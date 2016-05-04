# -*- coding: utf-8 -*-

from __future__ import print_function

import os
from threading import Event, Thread

import jupyter_core.paths
import requests
from ipython_genutils.tempdir import TemporaryDirectory
from notebook.notebookapp import NotebookApp
from notebook.tests.launchnotebook import NotebookTestBase
from notebook.utils import url_path_join
from tornado.ioloop import IOLoop
from traitlets.config import Config

import themysto.install

try:
    from unittest.mock import patch
except ImportError:
    from mock import patch  # py2

pjoin = os.path.join


class ConfiguratorTest(NotebookTestBase):
    """
    Tests for the nbextensions_configurator server extension.

    We override the setup_class method from NotebookTestBase in order to
    install themysto.
    Also set log_level to debug.
    """
    config = Config(NotebookApp={'log_level': 0})
    config.NotebookApp.log_level = 0

    # this is added for notebook < 4.1, where it wasn't defined
    if not hasattr(NotebookTestBase, 'url_prefix'):
        url_prefix = '/'

    @classmethod
    def setup_class(cls):
        """
        Setup a notebook server in a separate thread.

        Essentially a clone of NotebookTestBase.setup_class but installs
        themysto into the temporary config_dir created.
        """
        cls.home_dir = TemporaryDirectory()
        data_dir = TemporaryDirectory()
        cls.env_patch = patch.dict('os.environ', {
            'HOME': cls.home_dir.name,
            'IPYTHONDIR': pjoin(cls.home_dir.name, '.ipython'),
            'JUPYTER_DATA_DIR': data_dir.name
        })
        cls.env_patch.start()
        cls.path_patch = patch.object(
            jupyter_core.paths, 'SYSTEM_JUPYTER_PATH', [])
        cls.path_patch.start()
        cls.config_dir = TemporaryDirectory()
        cls.data_dir = data_dir
        cls.runtime_dir = TemporaryDirectory()
        cls.notebook_dir = TemporaryDirectory()

        # added to install themysto!
        themysto.install.install(config_dir=cls.config_dir.name)

        started = Event()

        def start_thread():
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
            # clear log handlers and propagate to root for nose to capture it
            # needs to be redone after initialize, which reconfigures logging
            app.log.propagate = True
            app.log.handlers = []
            app.initialize(argv=[])
            app.log.propagate = True
            app.log.handlers = []
            loop = IOLoop.current()
            loop.add_callback(started.set)
            try:
                app.start()
            finally:
                # set the event, so failure to start doesn't cause a hang
                started.set()
                # app.session_manager.close call was added after notebook 4.0
                if hasattr(app.session_manager, 'close'):
                    app.session_manager.close()

        cls.notebook_thread = Thread(target=start_thread)
        cls.notebook_thread.start()
        started.wait()
        cls.wait_until_alive()

    def test_load_nbextensions_page(self):
        """Check that <base_url>/nbextensions url loads."""
        response = requests.request(
            'GET', url_path_join(self.base_url(), 'nbextensions'),
        )
        response.raise_for_status()

    def test_load_nbextensions_readme_page(self):
        """Check that <base_url>/nbextensions url loads."""
        response = requests.request(
            'GET', url_path_join(
                self.base_url(), 'nbextensions', 'config', 'rendermd',
                'nbextensions', 'config', 'readme.md')
        )
        response.raise_for_status()
