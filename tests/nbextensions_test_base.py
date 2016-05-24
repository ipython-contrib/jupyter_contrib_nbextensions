# -*- coding: utf-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals,
)

import logging
import os
from threading import Event, Thread

import jupyter_core.paths
from ipython_genutils.tempdir import TemporaryDirectory
from notebook.notebookapp import NotebookApp
from notebook.tests.launchnotebook import NotebookTestBase
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.ui import WebDriverWait
from tornado.ioloop import IOLoop
from traitlets.config import Config

import themysto.install

try:
    from unittest.mock import patch  # py3
except ImportError:
    from mock import patch  # py2


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
        url_prefix = '/'

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
        from themysto.jstest import get_logger
        logger = get_logger(
            name='themysto.install.install', log_level=logging.DEBUG)
        themysto.install.install(config_dir=cls.config_dir.name, logger=logger)

    @classmethod
    def start_server_thread(cls, started_event):
        """
        Start a notebook server in a separate thread.

        The start is signalled using the passed Event instance.
        """
        app = cls.notebook = NotebookApp(
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


class SeleniumNbextensionTestBase(NbextensionTestBase):

    @classmethod
    def setup_class(cls):
        super(SeleniumNbextensionTestBase, cls).setup_class()
        cls.driver = webdriver.Firefox()

    @classmethod
    def teardown_class(cls):
        cls.driver.close()
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
