# -*- coding: utf-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals,
)

import logging
import os
import sys
from threading import Event, RLock, Thread

import jupyter_core.paths
from ipython_genutils.tempdir import TemporaryDirectory
from nose.plugins.attrib import attr as nose_attr
from nose.plugins.skip import SkipTest
from notebook.notebookapp import NotebookApp
from notebook.tests.launchnotebook import NotebookTestBase
from tornado.ioloop import IOLoop
from traitlets.config import Config
from traitlets.config.application import LevelFormatter
from traitlets.traitlets import default

import themysto.install
from themysto_testing_utils import stringify_env

try:
    from unittest.mock import patch  # py3
except ImportError:
    from mock import patch  # py2

no_selenium = True
try:
    from selenium import webdriver
except ImportError:
    pass
else:
    no_selenium = False
    from selenium.common.exceptions import TimeoutException
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support import expected_conditions as ec
    from selenium.webdriver.support.ui import WebDriverWait


class GlobalMemoryHandler(logging.Handler):
    """
    A MemoryHandler which uses a single buffer across all instances.

    In addition, will only flush logs when explicitly called to.
    """

    _buffer = None  # used as a class-wide attribute
    _lock = None  # used as a class-wide attribute

    @classmethod
    def _setup_class(cls):
        if cls._lock is None:
            cls._lock = RLock()
        if cls._buffer is None:
            with cls._lock:
                cls._buffer = []

    def __init__(self, target):
        logging.Handler.__init__(self)
        self.target = target
        self._setup_class()

    def emit(self, record):
        """
        Emit a record.

        Append the record and its target to the buffer.
        Don't check shouldFlush like regular MemoryHandler does.
        """
        self.__class__._buffer.append((record, self.target))

    @classmethod
    def flush_to_target(cls):
        """
        Sending the buffered records to their respective targets.

        The class-wide record buffer is also cleared by this operation.
        """
        with cls._lock:
            for record, target in cls._buffer:
                target.handle(record)
            cls.clear_buffer()

    @classmethod
    def clear_buffer(cls):
        with cls._lock:
            cls._buffer = []

    @classmethod
    def rotate_buffer(cls, num_places=1):
        with cls._lock:
            cls._buffer = cls._buffer[-num_places:] + cls._buffer[:-num_places]

    def close(self):
        """Close the handler."""
        try:
            self.flush()
        finally:
            logging.Handler.close(self)


def wrap_logger_handlers(logger):
    """Wrap a logging handler in a GlobalMemoryHandler."""
    # clear original log handlers, saving a copy
    handlers_to_wrap = logger.handlers
    logger.handlers = []
    # wrap each one
    for handler in handlers_to_wrap:
        if isinstance(handler, GlobalMemoryHandler):
            wrapping_handler = handler
        else:
            wrapping_handler = GlobalMemoryHandler(target=handler)
        logger.addHandler(wrapping_handler)
    return logger


def get_logger(name=__name__, log_level=logging.DEBUG):
    """
    Return a logger with a default StreamHandler.

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
        fmt='[%(levelname)1.1s %(asctime)s.%(msecs).03d %(name)s] %(message)s',
        datefmt='%H:%M:%S')
    _log_handler.setFormatter(_log_formatter)
    log.addHandler(_log_handler)
    return log


def get_wrapped_logger(*args, **kwargs):
    """Return a logger with StreamHandler wrapped in a GlobalMemoryHandler."""
    return wrap_logger_handlers(get_logger(*args, **kwargs))


class NoseyNotebookApp(NotebookApp):
    """Wrap the regular logging handler(s). for use inside nose tests."""

    @default('log')
    def _log_default(self):
        """wrap loggers for this application."""
        return wrap_logger_handlers(NotebookApp._log_default(self))


class NbextensionTestBase(NotebookTestBase):
    """
    Base class for nbextensions test case classes.

    We override the setup_class method from NotebookTestBase in order to
    install themysto, and also to set log_level to debug.
    Also split some of the setup_class method into separate methods in order to
    simplify subclassing.
    """
    config = Config(NotebookApp={'log_level': logging.DEBUG})

    # this is added for notebook < 4.1, where it wasn't defined
    if not hasattr(NotebookTestBase, 'url_prefix'):
        url_prefix = '/a%40b/'

    @classmethod
    def pre_server_setup(cls):
        """Setup a temporary environment in which to run a notebook server."""
        cls.config_dir = TemporaryDirectory()
        cls.data_dir = TemporaryDirectory()
        cls.home_dir = TemporaryDirectory()
        cls.notebook_dir = TemporaryDirectory()
        cls.runtime_dir = TemporaryDirectory()

        cls.env_patch = patch.dict('os.environ', stringify_env({
            'HOME': cls.home_dir.name,
            'IPYTHONDIR': os.path.join(cls.home_dir.name, '.ipython'),
            'JUPYTER_DATA_DIR': cls.data_dir.name
        }))
        cls.env_patch.start()

        cls.path_patch = patch.object(
            jupyter_core.paths, 'SYSTEM_JUPYTER_PATH', [])
        cls.path_patch.start()

        # added to install themysto!
        cls.log.info('Installing themysto')
        logger = get_wrapped_logger(
            name='themysto.install.install', log_level=logging.DEBUG)
        themysto.install.install(config_dir=cls.config_dir.name, logger=logger)

    @classmethod
    def get_server_kwargs(cls, **overrides):
        kwargs = dict(
            port=cls.port,
            port_retries=0,
            open_browser=False,
            config_dir=cls.config_dir.name,
            data_dir=cls.data_dir.name,
            runtime_dir=cls.runtime_dir.name,
            notebook_dir=cls.notebook_dir.name,
            base_url=cls.url_prefix,
            config=cls.config,
        )
        kwargs.update(overrides)
        return kwargs

    @classmethod
    def start_server_thread(cls, started_event):
        """
        Start a notebook server in a separate thread.

        The start is signalled using the passed Event instance.
        """
        cls.log.info('Starting notebook server app thread')
        app = cls.notebook = NoseyNotebookApp(**cls.get_server_kwargs())
        # don't register signal handler during tests
        app.init_signal = lambda: None
        app.initialize(argv=[])
        loop = IOLoop.current()
        loop.add_callback(started_event.set)
        try:
            app.start()
        finally:
            # set the event, so failure to start doesn't cause a hang
            started_event.set()
            # app.session_manager.close call was added after notebook 4.0
            if hasattr(app.session_manager, 'close'):
                app.session_manager.close()

    @classmethod
    def setup_class(cls):
        """Install themysto, & setup a notebook server in a separate thread."""
        cls.log = get_wrapped_logger(cls.__name__)
        cls.pre_server_setup()
        started = Event()
        cls.notebook_thread = Thread(
            target=cls.start_server_thread, args=[started])
        cls.notebook_thread.start()
        started.wait()
        cls.wait_until_alive()


@nose_attr('js')
class SeleniumNbextensionTestBase(NbextensionTestBase):

    @classmethod
    def setup_class(cls):
        if no_selenium:
            raise SkipTest('Selenium not installed. '
                           'Skipping selenium-based test.')
        super(SeleniumNbextensionTestBase, cls).setup_class()

        if os.environ.get('CI'):
            cls.log.info('Running in a CI environment. Using Sauce.')
            username = os.environ['SAUCE_USERNAME']
            access_key = os.environ['SAUCE_ACCESS_KEY']
            capabilities = {
                # 'platform': 'Mac OS X 10.9',
                'platform': 'Linux',
                'browserName': 'firefox',
                'version': 'latest',
                'tags': [os.environ['TOXENV'], 'CI'],
                'name': cls.__name__
            }
            hub_url = 'http://{}:{}@ondemand.saucelabs.com:80/wd/hub'.format(
                username, access_key)
            if os.environ.get('TRAVIS'):
                # see https://docs.travis-ci.com/user/gui-and-headless-browsers
                # and https://docs.travis-ci.com/user/sauce-connect
                capabilities.update({
                    'tunnel-identifier': os.environ['TRAVIS_JOB_NUMBER'],
                    'build': os.environ['TRAVIS_BUILD_NUMBER'],
                })
            cls.driver = webdriver.Remote(
                desired_capabilities=capabilities, command_executor=hub_url)
        else:
            # local test
            cls.driver = webdriver.Firefox()

        cls._failure_occurred = False  # flag for logging

    def run(self, results):
        """Run a given test. Overridden in order to access results."""
        results = super(SeleniumNbextensionTestBase, self).run(results)
        if results.failures or results.errors:
            self.__class__._failure_occurred = True
        return results

    @classmethod
    def teardown_class(cls):
        if cls._failure_occurred:
            cls.log.info('\n'.join([
                '',
                '\t\tFailed test!',
                '\t\tCaptured logging:',
            ]))
            GlobalMemoryHandler.rotate_buffer(1)
            GlobalMemoryHandler.flush_to_target()

            cls.log.info('\n\t\tjavascript console logs below...\n\n')
            browser_logger = get_wrapped_logger(
                name=cls.__name__ + '.driver', log_level=logging.DEBUG)
            for entry in cls.driver.get_log('browser'):
                level = logging._nameToLevel[entry['level']]
                msg = entry['message'].strip()
                browser_logger.log(level, msg)
                record, target = GlobalMemoryHandler._buffer[-1]
                record.ct = entry['timestamp'] / 1000.
                GlobalMemoryHandler._buffer[-1] = record, target
            GlobalMemoryHandler.flush_to_target()

        if (not cls._failure_occurred) or os.environ.get('CI'):
            cls.driver.quit()

        super(SeleniumNbextensionTestBase, cls).teardown_class()

    def wait_for_selector(self, css_selector, message='', timeout=5):
        """WebDriverWait for a selector to appear, fail test on timeout."""
        try:
            WebDriverWait(self.driver, 5).until(
                ec.presence_of_element_located((
                    By.CSS_SELECTOR, css_selector)))
        except TimeoutException:
            if message:
                message += '\n'
            self.fail(
                '{}No element matching selector {!r} found in {}s'.format(
                    message, css_selector, timeout))
