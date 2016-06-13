# -*- coding: utf-8 -*-
# Copyright (c) IPython-Contrib Team.

"""Jupyter server extension to enable, disable and configure nbextensions."""

from __future__ import unicode_literals

import json
import os.path
import posixpath
import re

import yaml
from notebook.base.handlers import IPythonHandler
from notebook.utils import url_path_join as ujoin
from notebook.utils import path2url
from tornado import web
from yaml.error import YAMLError

# attempt to use LibYaml if available
try:
    from yaml import CSafeLoader as SafeLoader
except ImportError:
    from yaml import SafeLoader

absolute_url_re = re.compile(r'^(f|ht)tps?://')


def get_configurable_nbextensions(
        nbextension_dirs, exclude_dirs=('mathjax',), as_dict=False, log=None):
    """Build a list of configurable nbextensions based on YAML descriptor files.

    descriptor files must:
      - be located under one of nbextension_dirs
      - have the extension '.yaml'
      - containing (at minimum) the following keys:
        - Type: must be 'IPython Notebook Extension' or
                'Jupyter Notebook Extension'
        - Main: relative url of the nbextension's main javascript file
    """
    extension_dict = {}
    required_keys = {'Type', 'Main'}
    valid_types = {'IPython Notebook Extension', 'Jupyter Notebook Extension'}

    # Traverse through nbextension subdirectories to find all yaml files
    for root_nbext_dir in nbextension_dirs:
        if log:
            log.debug(
                'Looking for nbextension yaml descriptor files in {}'.format(
                    root_nbext_dir))
        for direct, dirs, files in os.walk(root_nbext_dir, followlinks=True):
            # filter to exclude directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for filename in files:
                if os.path.splitext(filename)[1] not in ['.yml', '.yaml']:
                    continue
                yaml_path = os.path.join(direct, filename)
                yaml_relpath = os.path.relpath(yaml_path, root_nbext_dir)
                with open(yaml_path, 'r') as stream:
                    try:
                        extension = yaml.load(stream, Loader=SafeLoader)
                    except YAMLError:
                        if log:
                            log.warning(
                                'Failed to load yaml file {}'.format(
                                    yaml_relpath))
                        continue
                if not isinstance(extension, dict):
                    continue
                if any(key not in extension for key in required_keys):
                    continue
                if extension['Type'].strip() not in valid_types:
                    continue
                extension.setdefault('Compatibility', '?.x')
                extension.setdefault('Section', 'notebook')

                # generate relative URLs within the nbextensions namespace,
                # from urls relative to the yaml file
                yaml_dir_url = path2url(os.path.dirname(yaml_relpath))
                key_map = [
                    ('Link', 'readme'),
                    ('Icon', 'icon'),
                    ('Main', 'require'),
                ]
                for from_key, to_key in key_map:
                    # str needed in python 3, otherwise it ends up bytes
                    from_val = str(extension.get(from_key, ''))
                    if not from_val:
                        continue
                    if absolute_url_re.match(from_val):
                        extension[to_key] = from_val
                    else:
                        extension[to_key] = posixpath.normpath(
                            ujoin(yaml_dir_url, from_val))
                # strip .js extension in require path
                require = extension['require'] = os.path.splitext(
                    extension['require'])[0]

                extension.setdefault('Name', extension['require'])

                if log:
                    if require in extension_dict:
                        msg = 'nbextension {!r} has duplicate listings'.format(
                            extension['require'])
                        msg += ' in both {!r} and {!r}'.format(
                            yaml_path, extension_dict[require]['yaml_path'])
                        log.warning(msg)
                        extension['duplicate'] = True
                    else:
                        log.debug('Found nbextension {!r} in {}'.format(
                            extension['Name'], yaml_relpath))

                extension_dict[require] = {
                    'yaml_path': yaml_path, 'extension': extension}
    if as_dict:
        return extension_dict
    return [val['extension'] for val in extension_dict.values()]


class NBExtensionHandler(IPythonHandler):
    """Renders the notebook extension configuration interface."""

    @web.authenticated
    def get(self):
        """Render the notebook extension configuration interface."""
        nbapp_webapp = self.application
        nbextension_dirs = nbapp_webapp.settings['nbextensions_path']
        extension_list = get_configurable_nbextensions(
            nbextension_dirs=nbextension_dirs, log=self.log)
        # dump to JSON, replacing any single quotes with HTML representation
        extension_list_json = json.dumps(extension_list).replace("'", "&#39;")

        self.finish(self.render_template(
            'nbextensions_configurator.html',
            extension_list=extension_list_json,
            page_title='Notebook Extension Configuration',
            **self.application.settings
        ))


class RenderExtensionHandler(IPythonHandler):
    """Renders markdown files as pages."""

    @web.authenticated
    def get(self, path):
        """Render given markdown file."""
        if not path.endswith('.md'):
            # for all non-markdown items, we redirect to the actual file
            return self.redirect(self.base_url + path)
        self.finish(self.render_template(
            'rendermd.html',
            md_url=path,
            page_title=path,
            **self.application.settings
        ))


def load_jupyter_server_extension(nbapp):
    """Load and initialise the server extension."""
    nbapp.log.debug('Loading extension {}'.format(__name__))
    webapp = nbapp.web_app

    # ensure our template gets into search path
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
    nbapp.log.debug('  Editing template path to add {}'.format(templates_dir))
    searchpath = webapp.settings['jinja2_env'].loader.searchpath
    if templates_dir not in searchpath:
        searchpath.append(templates_dir)

    base_url = webapp.settings['base_url']

    # make sure our static files are available
    static_files_path = os.path.normpath(os.path.join(
        os.path.dirname(__file__), 'static'))
    nbapp.log.debug(
        '  Editing nbextensions path to add {}'.format(static_files_path))
    if static_files_path not in webapp.settings['nbextensions_path']:
        webapp.settings['nbextensions_path'].append(static_files_path)

    # add our new custom handlers
    nbapp.log.debug('  Adding new handlers')
    webapp.add_handlers(".*$", [
        (ujoin(base_url, r"/nbextensions"), NBExtensionHandler),
        (ujoin(base_url, r"/nbextensions/"), NBExtensionHandler),
        (ujoin(base_url,
               r"/nbextensions/nbextensions_configurator/rendermd/(.*)"),
         RenderExtensionHandler),
    ])

    nbapp.log.info('Loaded extension {}'.format(__name__))


def _jupyter_server_extension_paths():
    return [{
        'module': __name__
    }]
