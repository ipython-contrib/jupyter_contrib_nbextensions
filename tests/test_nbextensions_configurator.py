# -*- coding: utf-8 -*-

from __future__ import print_function

import requests
from notebook.notebookapp import NotebookApp
from notebook.tests.launchnotebook import NotebookTestBase
from notebook.utils import url_path_join
from traitlets.config import Config


class ConfiguratorTest(NotebookTestBase):

    config = Config()
    config.NotebookApp.log_level = 0

    if hasattr(NotebookApp, 'nbserver_extensions'):
        config.NotebookApp.nbserver_extensions = {
            'themysto.nbextensions_configurator': True,
        }
    else:
        config.NotebookApp.server_extensions = [
            'themysto.nbextensions_configurator',
        ]

    def test_load_nbextensions_page(self):
        """check that /nbextensions url loads"""
        response = requests.request(
            'GET', url_path_join(self.base_url(), 'nbextensions'),
        )
        response.raise_for_status()
