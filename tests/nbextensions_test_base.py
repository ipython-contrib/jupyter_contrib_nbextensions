# -*- coding: utf-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals,
)

import logging
import os
import sys
from threading import Event, Thread

import jupyter_core.paths
from ipython_genutils.tempdir import TemporaryDirectory
from nose.plugins.attrib import attr as nose_attr
from nose.plugins.skip import SkipTest
from notebook.notebookapp import NotebookApp
from notebook.tests.launchnotebook import NotebookTestBase
from tornado.ioloop import IOLoop
from traitlets.config import Config
from traitlets.config.application import LevelFormatter

import themysto.install

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

        cls.env_patch = patch.dict('os.environ', {
            'HOME': cls.home_dir.name,
            'IPYTHONDIR': os.path.join(cls.home_dir.name, '.ipython'),
            'JUPYTER_DATA_DIR': cls.data_dir.name
        })
        cls.env_patch.start()

        cls.path_patch = patch.object(
            jupyter_core.paths, 'SYSTEM_JUPYTER_PATH', [])
        cls.path_patch.start()

        # added to install themysto!
        logger = get_logger(
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
        app = cls.notebook = NotebookApp(**cls.get_server_kwargs())
        # don't register signal handler during tests
        app.init_signal = lambda: None
        # clear log handlers and propagate to root for nose to capture it.
        # Notebook version does this before and after initialize, which
        # resets logging handlers. However, logs about server extension
        # loading occur during the initialize call, and as such are missed
        # if we reset logging before calling initialize, for some reason I
        # don't fully understand. So, we just reset after initialize,
        # while adding a log note to explain why logs stop.
        # app.log.propagate = True
        # app.log.handlers = []
        app.initialize(argv=[])
        app.log.info(
            'Switching logging off, letting nose capture the rest.')
        app.log.propagate = True
        app.log.handlers = []
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
            username = os.environ['SAUCE_USERNAME']
            access_key = os.environ['SAUCE_ACCESS_KEY']
            capabilities = {
                # 'platform': 'Mac OS X 10.9',
                'platform': 'Linux',
                'browserName': 'firefox',
                'version': 'latest',
                'tags': [os.environ['TOXENV'], 'CI'],
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

    @classmethod
    def teardown_class(cls):
        cls.driver.close()
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
