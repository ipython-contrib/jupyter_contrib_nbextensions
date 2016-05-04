# -*- coding: utf-8 -*-
# Copyright (c) IPython-Contrib Team.

"""Notebook Server Extension to activate, deactivate and configure javascript
notebook extensions"""

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

# attempt to use LibYaml if available
try:
    from yaml import CSafeLoader as SafeLoader
except ImportError:
    from yaml import SafeLoader

absolute_url_re = re.compile(r'^(f|ht)tps?://')


def get_nbextensions_path():
    """
    Return the nbextensions search path

    gets the search path for
      - the current NotebookApp instance
    or, if we can't instantiate one
      - the default config used, found by spawning a subprocess
    """
    # Attempt to get the path for the currently-running config, or the default
    # if one isn't running.
    # If there's already a non-NotebookApp traitlets app running, e.g. when
    # we're inside an IPython kernel there's a KernelApp instantiated, then
    # attempting to get a NotebookApp instance will raise a
    # MultipleInstanceError.
    try:
        return NotebookApp.instance().nbextensions_path
    except MultipleInstanceError:
        # So, we spawn a new python process to get paths for the default config
        cmd = "from {0} import {1}; [print(p) for p in {1}()]".format(
            get_nbextensions_path.__module__, get_nbextensions_path.__name__)

        return subprocess.check_output([
            sys.executable, '-c', cmd
        ]).decode(sys.stdout.encoding).split('\n')


def get_configurable_nbextensions(
        nbextension_dirs=None, exclude_dirs=['mathjax'], log=None):
    """Build a list of configurable nbextensions based on YAML descriptor files

    descriptor files must:
      - be located under one of nbextension_dirs
      - have the extension '.yaml'
      - containing (at minimum) the following keys:
        - Type: must be 'IPython Notebook Extension' or
                'Jupyter Notebook Extension'
        - Main: url of the nbextension's main javascript file, relative to yaml
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
    """Render the notebook extension configuration interface."""

    @web.authenticated
    def get(self):
        extension_list = get_configurable_nbextensions(log=self.log)
        # dump to JSON, replacing any single quotes with HTML representation
        extension_list_json = json.dumps(extension_list).replace("'", "&#39;")

        self.write(self.render_template(
            'nbextensions.html',
            base_url=self.base_url,
            extension_list=extension_list_json,
            page_title="Notebook Extension Configuration"
        ))


class RenderExtensionHandler(IPythonHandler):
    """Render given markdown file"""

    @web.authenticated
    def get(self, path):
        if not path.endswith('.md'):
            # for all non-markdown items, we redirect to the actual file
            return self.redirect(self.base_url + path)
        self.write(self.render_template(
            'rendermd.html',
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
        (ujoin(base_url, r"/nbextensions/config/rendermd/(.*)"),
         RenderExtensionHandler),
    ])
