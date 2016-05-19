# -*- coding: utf-8 -*-
"""Nbextensions Javascript Test Controller.

This module runs one or more subprocesses which will actually run the
Javascript test suite.
"""

# Adapted from notebook.jstest, which is
# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

from __future__ import absolute_import, print_function

import glob
import logging
import multiprocessing.pool
import os
import signal
import sys
import time

from ipython_genutils.py3compat import bytes_to_str
from notebook.jstest import JSController as notebook_JSController
from notebook.jstest import get_js_test_dir as notebook_get_js_test_dir
from notebook.jstest import argparser, do_run, report
from traitlets.config.application import LevelFormatter
from traitlets.config.manager import BaseJSONConfigManager

import themysto.install


def get_logger(name=__name__, log_level=logging.INFO):
    """
    Return a logger for use in install/uninstall functions.

    Adapted from
        tratilets.config.application.Application._log_default
    """
    log = logging.getLogger(name)
    log.setLevel(log_level)
    log.propagate = False
    _log = log  # copied from Logger.hasHandlers() (new in Python 3.2)
    while _log:
        if _log.handlers:
            return log
        if not _log.propagate:
            break
        else:
            _log = _log.parent
    if sys.executable.endswith('pythonw.exe'):
        # this should really go to a file, but file-logging is only
        # hooked up in parallel applications
        _log_handler = logging.StreamHandler(open(os.devnull, 'w'))
    else:
        _log_handler = logging.StreamHandler()
    _log_formatter = LevelFormatter(
        fmt='%(message)s', datefmt="%Y-%m-%d %H:%M:%S")
    _log_handler.setFormatter(_log_formatter)
    log.addHandler(_log_handler)
    return log


def get_js_test_dir():
    """Return path of javascript tests directory."""
    # Modified to get the themysto tests rather than the notebook ones
    return os.path.join(os.path.dirname(__file__), 'jstests')


def all_js_groups():
    """Return list of all javascript test groups."""
    # Essentially a clone of notebook.jstest.all_js_groups
    # but catches the correct test directory from get_js_test_dir above
    test_dir = get_js_test_dir()
    all_subdirs = glob.glob(os.path.join(test_dir, '[!_]*/'))
    return [os.path.relpath(x, test_dir) for x in all_subdirs]


class JSController(notebook_JSController):
    __doc__ = notebook_JSController.__doc__

    # Essentially a clone of notebook.jstest.JSController, but:
    #  - overriding __init__ in order to use the get_js_test_dir defined here,
    #    to ensure we get our jstests rather than those from notebook.
    #  - overriding launch, to install themysto before launching

    def __init__(self, section, xunit=True, engine='phantomjs', url=None):
        """Create new test runner."""
        super(JSController, self).__init__(
            section, xunit=xunit, engine=engine, url=url)
        includes = '--includes={}'.format(
            os.path.join(notebook_get_js_test_dir(), 'util.js'))
        test_cases = os.path.join(get_js_test_dir(), self.section)
        self.cmd = [
            'casperjs', 'test', includes, test_cases,
            '--engine=%s' % self.engine]

    def _init_server(self):
        """Start the notebook server in a separate process."""
        logger = get_logger(
            name='themysto.install.install', log_level=logging.DEBUG)
        themysto.install.install(
            config_dir=self.config_dir.name, logger=logger)

        print('Setting log_level in config')
        cm = BaseJSONConfigManager(config_dir=self.config_dir.name)
        cm.update('jupyter_notebook_config',
                  {'NotebookApp': {'log_level': logging.DEBUG}})

        super(JSController, self)._init_server()

    def print_extra_info(self):
        """Overridden to add more details about temporary folders."""
        print("Running tests with")
        print("        home dir: %r" % self.home.name)
        print("    notebook dir: %r" % self.nbdir.name)
        print("      config dir: %r" % self.config_dir.name)
        print("     ipython dir: %r" % self.ipydir.name)


def prepare_controllers(options):
    # Essentially a clone of notebook.jstest.prepare_controllers
    # but using the all_js_groups and JSController defined here.
    """Return two lists of TestController instances to run, and not to run."""
    testgroups = options.testgroups
    if not testgroups:
        testgroups = all_js_groups()

    engine = 'slimerjs' if options.slimerjs else 'phantomjs'
    controllers = [
        JSController(name, xunit=options.xunit, engine=engine, url=options.url)
        for name in testgroups
    ]

    to_run = [c for c in controllers if c.will_run]
    not_run = [c for c in controllers if not c.will_run]
    return to_run, not_run


def run_jstestall(options):
    # Essentially a clone of notebook.jstest.run_jstestall
    # but using the prepare_controllers defined here.
    """Run the entire Javascript test suite.

    This function constructs TestControllers and runs them in subprocesses.

    Parameters
    ----------

    All parameters are passed as attributes of the options object.

    testgroups : list of str
      Run only these sections of the test suite. If empty, run all the
      available sections.

    fast : int or None
      Run the test suite in parallel, using n simultaneous processes. If None
      is passed, one process is used per CPU core. Default 1 (i.e. sequential)

    inc_slow : bool
      Include slow tests. By default, these tests aren't run.

    slimerjs : bool
      Use slimerjs if it's installed instead of phantomjs for casperjs tests.

    url : unicode
      Address:port to use when running the JS tests.

    xunit : bool
      Produce Xunit XML output. This is written to multiple foo.xunit.xml
      files.

    extra_args : list
      Extra arguments to pass to the test subprocesses, e.g. '-v'
    """
    to_run, not_run = prepare_controllers(options)

    def justify(ltext, rtext, width=70, fill='-'):
        ltext += ' '
        rtext = (' ' + rtext).rjust(width - len(ltext), fill)
        return ltext + rtext

    # Run all test runners, tracking execution time
    failed = []
    t_start = time.time()

    print()
    if options.fast == 1:
        # This actually means sequential, i.e. with 1 job
        for controller in to_run:
            print('Test group:', controller.section)
            sys.stdout.flush()  # Show in correct order when output is piped
            controller, res = do_run(controller, buffer_output=False)
            if res:
                failed.append(controller)
                if res == -signal.SIGINT:
                    print("Interrupted")
                    break
            print()

    else:
        # Run options.fast tests concurrently
        try:
            pool = multiprocessing.pool.ThreadPool(options.fast)
            for (controller, res) in pool.imap_unordered(do_run, to_run):
                res_string = 'OK' if res == 0 else 'FAILED'
                print(justify('Test group: ' + controller.section, res_string))
                if res:
                    controller.print_extra_info()
                    print(bytes_to_str(controller.stdout))
                    failed.append(controller)
                    if res == -signal.SIGINT:
                        print("Interrupted")
                        break
        except KeyboardInterrupt:
            return

    for controller in not_run:
        print(justify('Test group: ' + controller.section, 'NOT RUN'))

    t_end = time.time()
    t_tests = t_end - t_start
    nrunners = len(to_run)
    nfail = len(failed)
    # summarize results
    print('_' * 70)
    print('Test suite completed for system with the following information:')
    print(report())
    took = "Took %.3fs." % t_tests
    print('Status: ', end='')
    if not failed:
        print('OK (%d test groups).' % nrunners, took)
    else:
        # If anything went wrong, point out what command to rerun manually to
        # see the actual errors and individual summary
        failed_sections = [c.section for c in failed]
        print('ERROR - {} out of {} test groups failed ({}).'.format(
            nfail, nrunners, ', '.join(failed_sections)), took)
        print()
        if len(failed) > 1:
            print('For more detail, you may wish to rerun these, with:')
            print('  python -m themysto.jstest', *failed_sections)
            print()
        else:
            capturer = failed[0].stream_capturer
            print('Failed test server captured output:\n{}'.format(
                capturer.get_buffer().decode('utf-8', 'replace')
            ))

    if failed:
        # Ensure that our exit code indicates failure
        sys.exit(1)


def main():
    """Allow running module as script."""
    try:
        ix = sys.argv.index('--')
    except ValueError:
        to_parse = sys.argv[1:]
        extra_args = []
    else:
        to_parse = sys.argv[1:ix]
        extra_args = sys.argv[ix + 1:]

    argparser.description = 'Run themysto Javascript tests'
    options = argparser.parse_args(to_parse)
    options.extra_args = extra_args

    run_jstestall(options)


if __name__ == '__main__':
    main()
