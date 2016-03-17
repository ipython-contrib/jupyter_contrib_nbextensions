# Copyright (c) IPython-Contrib Team.
# Notebook Server Extension to activate/deactivate javascript notebook extensions
#
from jupyter_core.paths import jupyter_data_dir
import notebook
from notebook.utils import url_path_join as ujoin
from notebook.base.handlers import IPythonHandler, json_errors
from notebook.nbextensions import _get_nbext_dir as get_nbext_dir
from tornado import web
from itertools import chain
import os.path
import yaml
from yaml.scanner import ScannerError
import json

jupyterdir = jupyter_data_dir()
nbextension_dirs = (get_nbext_dir(), os.path.join(jupyterdir, 'nbextensions'))
exclude = ['mathjax']


class NBExtensionHandler(IPythonHandler):
    """Render the notebook extension configuration interface."""

    @web.authenticated
    def get(self):
        yaml_list = []
        # Traverse through nbextension subdirectories to find all yaml files
        for root, dirs, files in chain.from_iterable(
                os.walk(nb_ext_dir, followlinks=True) for nb_ext_dir in nbextension_dirs):
            # filter to exclude directories
            dirs[:] = [d for d in dirs if d not in exclude]

            for filename in files:
                if filename.endswith('.yaml'):
                    yaml_list.append((root, filename))

        # Build a list of extensions from YAML file description
        # containing at least the following entries:
        #   Type - identifier, must be either 'IPython Notebook Extension' or 'Jupyter Notebook Extension'
        #   Main - relative path to main file that is loaded, typically 'main.js'
        #
        extension_list = []
        required_keys = ('Type', 'Main')

        for ext_dir, yaml_filename in sorted(yaml_list):
            with open(os.path.join(ext_dir, yaml_filename), 'r') as stream:
                try:
                    extension = yaml.load(stream)
                except ScannerError:
                    self.log.warning(
                        'failed to load yaml file %r', yaml_filename)
                    continue

            if any(key not in extension for key in required_keys):
                continue
            if extension['Type'].strip() not in ['IPython Notebook Extension', 'Jupyter Notebook Extension']:
                continue
            compat = extension.setdefault('Compatibility', '?.x').strip()
            if not compat.startswith(
                    notebook.__version__[:2]):
                pass

            # generate URL to extension's main js file
            idx = ext_dir.find('nbextensions')
            url = ext_dir[idx::].replace('\\', '/')
            extension['url'] = url

            extension_list.append(extension)
            self.log.info(
                "Found {} extension {}".format(compat, extension['Name']))

        # dump to JSON, replacing any single quotes with HTML representation
        extension_list_json = json.dumps(extension_list).replace("'", "&#39;")

        self.write(self.render_template(
            'nbextensions.html',
            base_url=self.base_url,
            extension_list=extension_list_json,
            page_title="Notebook Extension Configuration"
        ))


class RenderExtensionHandler(IPythonHandler):
    """Render  given markdown file"""

    @web.authenticated
    def get(self, path):
        if not path.endswith('.md'):
            # for all non-markdown items, we redirect to the actual file
            return self.redirect(self.base_url + path)
        self.write(self.render_template('rendermd.html',
            base_url=self.base_url,
            md_url=path,
            page_title=path,
        ))


def load_jupyter_server_extension(nbapp):
    webapp = nbapp.web_app
    base_url = webapp.settings['base_url']

    webapp.add_handlers(".*$", [
        (ujoin(base_url, r"/nbextensions"), NBExtensionHandler),
        (ujoin(base_url, r"/nbextensions/"), NBExtensionHandler),
        (ujoin(base_url, r"/nbextensions/config/rendermd/(.*)"), RenderExtensionHandler),
    ])
