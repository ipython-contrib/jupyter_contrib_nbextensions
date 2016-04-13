import requests

from notebook.notebookapp import NotebookApp
from notebook.tests.launchnotebook import NotebookTestBase
from notebook.utils import url_path_join
from traitlets.config import Config


class ConfiguratorTest(NotebookTestBase):

    config = Config(log_level='DEBUG')
    if hasattr( NotebookApp, 'nbserver_extensions'):
        config.nbserver_extensions = Config({
            'themysto.nbextensions_configurator': True,
        })
    else:
        config.server_extensions = [
            'themysto.nbextensions_configurator',
        ]

    def test_load_nbextensions_page(self):
        """check that /nbextensions url loads"""
        response = requests.request(
            'GET', url_path_join(self.base_url(), 'nbextensions'),
        )
        response.raise_for_status()
