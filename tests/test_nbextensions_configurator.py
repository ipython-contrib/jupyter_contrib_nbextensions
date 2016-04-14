# -*- coding: utf-8 -*-

from __future__ import print_function

import os
from threading import Event, Thread

import jupyter_core
import jupyter_core.paths
import requests
from ipython_genutils.tempdir import TemporaryDirectory
from notebook.notebookapp import NotebookApp
from notebook.tests.launchnotebook import NotebookTestBase
from notebook.utils import url_path_join
from tornado.ioloop import IOLoop

pjoin = os.path.join

try:
    from unittest.mock import patch
except ImportError:
    from mock import patch  # py2


class ConfiguratorTest(NotebookTestBase):

    nbapp_kwargs = dict(
        log_level=0,
        open_browser=False,
        port_retries=0,
    )
    if hasattr(NotebookApp, 'nbserver_extensions'):
        nbapp_kwargs['nbserver_extensions'] = {
            'themysto.nbextensions_configurator': True,
        }
    else:
        nbapp_kwargs['server_extensions'] = [
            'themysto.nbextensions_configurator',
        ]

    @classmethod
    def setup_class(cls):
        """
        Similar to jupyter version, but uses our kwargs.
        It seems that, at least for notebook < 4.2.0b1, config passed in as a
        kwarg is ignored, so we have to actually pass each config item as an
        individual kwarg
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

        started = Event()

        def start_thread():
            # setup keyword arguments
            cls.nbapp_kwargs.setdefault('port', cls.port)
            cls.nbapp_kwargs.setdefault('config_dir', cls.config_dir.name)
            cls.nbapp_kwargs.setdefault('data_dir', cls.data_dir.name)
            cls.nbapp_kwargs.setdefault('runtime_dir', cls.runtime_dir.name)
            cls.nbapp_kwargs.setdefault('notebook_dir', cls.notebook_dir.name)
            cls.nbapp_kwargs.setdefault('base_url', cls.url_prefix)
            cls.nbapp_kwargs.setdefault('config', cls.config)
            app = cls.notebook = NotebookApp(**cls.nbapp_kwargs)

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
                app.session_manager.close()
        cls.notebook_thread = Thread(target=start_thread)
        cls.notebook_thread.start()
        started.wait()
        cls.wait_until_alive()

    def test_load_nbextensions_page(self):
        """check that /nbextensions url loads"""
        response = requests.request(
            'GET', url_path_join(self.base_url(), 'nbextensions'),
        )
        response.raise_for_status()
