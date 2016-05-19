# -*- coding: utf-8 -*-
# Copyright (c) IPython-Contrib Team.

"""Jupyter server extension to enable, disable and configure nbextensions."""

from __future__ import unicode_literals

import json
import os.path
import posixpath
import re
import subprocess
import sys

import yaml
from notebook.base.handlers import IPythonHandler
from notebook.notebookapp import NotebookApp
from notebook.utils import url_path_join as ujoin
from notebook.utils import path2url
from tornado import web
from traitlets.config.configurable import MultipleInstanceError
from yaml.scanner import ScannerError

from ..nbextensions_injector import nbext_dir

# attempt to use LibYaml if available
try:
    from yaml import CSafeLoader as SafeLoader
except ImportError:
    from yaml import SafeLoader

absolute_url_re = re.compile(r'^(f|ht)tps?://')


def get_nbextensions_path():
    """
    Return the nbextensions search path.

    gets the search path for
      - the current NotebookApp instance
    or, if we can't instantiate one
      - the default config used, found by spawning a subprocess
    """
    # Attempt to get the path for the currently-running server, or the default
    # if one isn't running.
    # If there's already a non-NotebookApp traitlets app running, e.g. when
    # we're inside an IPython kernel there's a KernelApp instantiated, then
    # attempting to get a NotebookApp instance will raise a
    # MultipleInstanceError.
    try:
        nbapp = NotebookApp.instance()
    except MultipleInstanceError:
        # So, we spawn a new python process to get paths for the default config
        cmd = "from {0} import {1}; [print(p) for p in {1}()]".format(
            get_nbextensions_path.__module__, get_nbextensions_path.__name__)

        nbext_path = subprocess.check_output([
            sys.executable, '-c', cmd
        ]).decode(sys.stdout.encoding).split('\n')
    else:
        # try to get web_app.settings if possible (e.g. when a NotebookApp
        # instance is running correctly).
        try:
            webapp = nbapp.web_app
        except AttributeError:
            nbext_path = nbapp.nbextensions_path
        else:
            nbext_path = webapp.settings['nbextensions_path']
    finally:
        # We may need to insert our nbext_dir into the path if we're created
        # the NotebookApp instance, as in this case, the server extension
        # themysto.nbextensions_injector won't have loaded to modify the
        # nbapp.web_app.settings
        our_nbext_dir = nbext_dir()
        if our_nbext_dir not in nbext_path:
            nbext_path.append(our_nbext_dir)
        return nbext_path


def get_configurable_nbextensions(
        nbextension_dirs=None, exclude_dirs=('mathjax',), log=None):
    """Build a list of configurable nbextensions based on YAML descriptor files.

    descriptor files must:
      - be located under one of nbextension_dirs
      - have the extension '.yaml'
      - containing (at minimum) the following keys:
        - Type: must be 'IPython Notebook Extension' or
                'Jupyter Notebook Extension'
        - Main: relative url of the nbextension's main javascript file
    """
    if nbextension_dirs is None:
        nbextension_dirs = get_nbextensions_path()

    extension_list = []
    required_keys = {'Type', 'Main'}
    valid_types = {'IPython Notebook Extension', 'Jupyter Notebook Extension'}
    do_log = (log is not None)
    # Traverse through nbextension subdirectories to find all yaml files
    for root_nbext_dir in nbextension_dirs:
        if do_log:
            log.debug(
                'Looking for nbextension yaml descriptor files in {}'.format(
                    root_nbext_dir))
        for direct, dirs, files in os.walk(root_nbext_dir, followlinks=True):
            # filter to exclude directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for filename in files:
                if not filename.endswith('.yaml'):
                    continue
                yaml_path = os.path.join(direct, filename)
                yaml_relpath = os.path.relpath(yaml_path, root_nbext_dir)
                with open(yaml_path, 'r') as stream:
                    try:
                        extension = yaml.load(stream, Loader=SafeLoader)
                    except ScannerError:
                        if do_log:
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
                extension['require'] = os.path.splitext(
                    extension['require'])[0]

                if do_log:
                    log.debug(
                        'Found nbextension {!r} in {}'.format(
                            extension.setdefault('Name', extension['require']),
                            yaml_relpath,
                        )
                    )

                extension_list.append(extension)
    return extension_list


class NBExtensionHandler(IPythonHandler):
    """Renders the notebook extension configuration interface."""

    @web.authenticated
    def get(self):
        """Render the notebook extension configuration interface."""
        extension_list = get_configurable_nbextensions(log=self.log)
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
    nbapp.log.debug('  Editing template path')
    searchpath = webapp.settings['jinja2_env'].loader.searchpath
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
    if templates_dir not in searchpath:
        searchpath.append(templates_dir)

    base_url = webapp.settings['base_url']

    # make sure our static files are available
    nbapp.log.debug('  Editing nbextensions path')
    static_files_path = os.path.normpath(os.path.join(
        os.path.dirname(__file__), 'static'))
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
