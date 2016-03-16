# -*- coding: utf-8 -*-

"""Utilities for themysto package"""

from __future__ import print_function

import json
import os

import psutil
from jupyter_core.paths import jupyter_config_dir
from traitlets.config.loader import Config, JSONFileConfigLoader

from themysto import __file__ as root_pkg_path

root_pkg_path = os.path.dirname(root_pkg_path)


class NotebookRunningError(Exception):
    pass


def notebook_is_running():
    for p in psutil.process_iter():
        # p.name() can throw exceptions due to zombie processes on Mac OS X, so
        # ignore psutil.ZombieProcess
        # (See https://code.google.com/p/psutil/issues/detail?id=428)

        # It isn't enough to search just the process name, we have to
        # search the process command to see if jupyter-notebook is running.

        # Checking the process command can cause an AccessDenied exception to
        # be thrown for system owned processes, ignore those as well
        try:
            # use lower, since python may be Python, e.g. on OSX
            if ('python' or 'jupyter') in p.name().lower():
                for arg in p.cmdline():
                    # the missing k is deliberate!
                    # The usual string 'jupyter-notebook' can get truncated.
                    if 'jupyter-noteboo' in arg:
                        return True
        except (psutil.ZombieProcess, psutil.AccessDenied):
            pass
        return False


def update_config_list(config, list_key, values, insert):
    section, list_key = list_key.split('.')
    config[section] = config.get(section, Config())
    conf_list = config[section][list_key] = config[section].get(list_key, [])
    list_alteration_method = 'append' if insert else 'remove'
    for val in values:
        if (val in conf_list) != insert:
            getattr(conf_list, list_alteration_method)(val)
    if not insert:
        # remove empty list
        if len(conf_list) == 0:
            config[section].pop(list_key)
        # remove empty section
        if len(config[section]) == 0:
            config.pop(section)


def _ensure_config_exists(config_filepath):
    config_filepath = os.path.realpath(config_filepath)
    config_dir = os.path.dirname(config_filepath)
    if not os.path.exists(config_dir):
        os.makedirs(config_dir)
    if not os.path.exists(config_filepath):
        with open(config_filepath, 'w') as f:
            json.dump({'version': 1}, f, indent=2)


def _config_configure(install):

    if notebook_is_running():
        raise NotebookRunningError(
            'Cannot configure while the Jupyter notebook server is running')

    # Add server extension  for /nbextensions configuration tool
    config_filepath = os.path.join(
        jupyter_config_dir(), 'jupyter_notebook_config.json')
    _ensure_config_exists(config_filepath)
    with JSONFileConfigLoader(config_filepath) as config:
        update_config_list(config, 'NotebookApp.server_extensions', [
            'themysto.extensions.nbextensions_configurator',
        ], install)
        update_config_list(config, 'NotebookApp.extra_nbextensions_path', [
            os.path.join(root_pkg_path, 'nbextensions'),
        ], install)
        update_config_list(config, 'NotebookApp.extra_template_paths', [
            os.path.join(root_pkg_path, 'templates'),
        ], install)

    # Set template path, pre- and post-processors for nbconvert
    config_filepath = os.path.join(
        jupyter_config_dir(), 'jupyter_nbconvert_config.json')
    _ensure_config_exists(config_filepath)
    with JSONFileConfigLoader(config_filepath) as config:
        update_config_list(config, 'Exporter.preprocessors', [
            'themysto.preprocessors.CodeFoldingPreprocessor',
            'themysto.preprocessors.PyMarkdownPreprocessor',
        ], install)
        update_config_list(config, 'Exporter.template_path', [
            '.',
            os.path.join(root_pkg_path, 'templates'),
        ], install)

        if install:
            config.NbConvertApp.postprocessor_class = (
                'themysto.postprocessors.EmbedPostProcessor')
        elif 'NbConvertApp' in config:
            config.NbConvertApp.pop('postprocessor_class', None)
            if len(config.NbConvertApp) == 0:
                config.pop('NbConvertApp')


def config_install():
    return _config_configure(True)


def config_uninstall():
    return _config_configure(False)
