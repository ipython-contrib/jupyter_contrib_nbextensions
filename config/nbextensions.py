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
import os
import yaml
import json


class NBExtensionHandler(IPythonHandler):
    """Render the notebook extension configuration interface."""
    @web.authenticated
    def get(self):
        jupyterdir = jupyter_data_dir()
        nbextensions = (get_nbext_dir(), os.path.join(jupyterdir,'nbextensions'))
        exclude = [ 'mathjax' ]
        yaml_list = []
        # Traverse through nbextension subdirectories to find all yaml files
        for root, dirs, files in chain.from_iterable(os.walk(root) for root in nbextensions):
            dirs[:] = [d for d in dirs if d not in exclude]
            for f in files:
                if f.endswith('.yaml'):
                    yaml_list.append([ root, f] )
        # Build a list of extensions from YAML file description
        # containing at least the following entries:
        #   Type         - identifier
        #   Name         - unique name of the extension
        #   Description  - short explanation of the extension
        #   Main         - main file that is loaded, typically 'main.js'
        #
        extension_list = []
        for y in yaml_list:
            stream = open(os.path.join(y[0],y[1]), 'r')
            extension = yaml.load(stream)
            if all (k in extension for k in ('Type', 'Compatibility', 'Name', 'Main', 'Description')):
                if not extension['Type'].strip().startswith('IPython Notebook Extension'):
                    continue
                if not extension['Compatibility'].strip().startswith(notebook.__version__[0:2]):
                    continue
                # generate URL to extension
                idx=y[0].find('nbextensions')
                url = y[0][idx::].replace('\\', '/')
                extension['url'] = url
                # replace single quote with HTML representation
                for key in extension:
                    if isinstance(extension[key], str):
                        extension[key] = extension[key].replace("'","&#39;")
                extension_list.append(extension)
                self.log.info("Found extension %s" % extension['Name'])
            stream.close()
        json_list = json.dumps(extension_list)
        self.write(self.render_template('nbextensions.html',
            base_url = self.base_url,
            extension_list = json_list,
            page_title="Notebook Extension Configuration"
            )
        )
		
def load_jupyter_server_extension(nbapp):
    webapp = nbapp.web_app
    base_url = webapp.settings['base_url']
    webapp.add_handlers(".*$", [
        (ujoin(base_url, r"/nbextensions/"), NBExtensionHandler)
    ])
