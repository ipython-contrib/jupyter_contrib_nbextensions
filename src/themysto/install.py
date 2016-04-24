# -*- coding: utf-8 -*-
"""API to install/remove all themysto nbextensions and server extensions."""

from __future__ import print_function

import os

import psutil
from traitlets.config.manager import BaseJSONConfigManager

import themysto

try:
    # notebook >= 4.2.0
    from notebook.serverextensions import toggle_serverextension_python
    from notebook.nbextensions import _get_config_dir
except ImportError:
    # notebook < 4.2.0
    from themysto.notebook_shim import toggle_serverextension_python
    from themysto.notebook_shim import _get_config_dir


class NotebookRunningError(Exception):
    pass


def notebook_is_running():
    """Return true if a notebook process appears to be running."""
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
    """Add or remove items as required to/from a config value which is a list.

    This exists in order to avoid clobbering values other than those which we
    wish to add/remove
    """
    section, list_key = list_key.split('.')
    config[section] = config.get(section, {})
    conf_list = config[section].setdefault(list_key, [])
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


def toggle_install(install, user=False, sys_prefix=False, overwrite=False,
                   symlink=False, prefix=None, nbextensions_dir=None,
                   config_dir=None, logger=None):
    """Install or remove all themysto nbextensions and server extensions."""
    if notebook_is_running():
        raise NotebookRunningError(
            'Cannot configure while the Jupyter notebook server is running')

    user = False if sys_prefix else user

    # server extensions (logging done in toggle_serverextension_python):
    for servext in themysto._jupyter_server_extension_paths():
        import_name = servext['module']
        toggle_serverextension_python(import_name, install, user=user,
                                      sys_prefix=sys_prefix, logger=logger)

    # nbextensions paths
    if config_dir is None:
        config_dir = _get_config_dir(user=user, sys_prefix=sys_prefix)
    cm = BaseJSONConfigManager(config_dir=config_dir)
    config_basename = 'jupyter_notebook_config'
    config = cm.get(config_basename)
    if logger:
        logger.info('Configuring nbextensions paths')
        logger.info(
            '- Writing config: {}'.format(cm.file_name(config_basename)))
    # avoid warnigns about unset version
    config.setdefault('version', 1)
    update_config_list(config, 'NotebookApp.extra_nbextensions_path', [
        os.path.join(os.path.dirname(themysto.__file__), 'nbextensions'),
    ], install)
    cm.update(config_basename, config)

    # Set extra template path, pre- and post-processors for nbconvert
    if logger:
        logger.info('Configuring nbconvert pre/postprocessors and templates')
    cm = BaseJSONConfigManager(config_dir=config_dir)
    config_basename = 'jupyter_nbconvert_config'
    config = cm.get(config_basename)
    # avoid warnigns about unset version
    config.setdefault('version', 1)
    # our templates directory
    update_config_list(config, 'Exporter.template_path', [
        '.',
        os.path.join(os.path.dirname(themysto.__file__), 'templates'),
    ], install)
    # our preprocessors
    update_config_list(config, 'Exporter.preprocessors', [
        'themysto.preprocessors.CodeFoldingPreprocessor',
        'themysto.preprocessors.PyMarkdownPreprocessor',
    ], install)
    # our postprocessor class
    if install:
        config.setdefault('NbConvertApp', {})['postprocessor_class'] = (
            'themysto.postprocessors.EmbedPostProcessor')
    else:
        nbconvert_conf = config.get('NbConvertApp', {})
        if (nbconvert_conf.get('postprocessor_class') ==
                'themysto.postprocessors.EmbedPostProcessor'):
            nbconvert_conf.pop('postprocessor_class', None)
            if len(nbconvert_conf) < 1:
                config.pop('NbConvertApp')
    if logger:
        logger.info(
            u'- Writing config: {}'.format(cm.file_name(config_basename)))
    cm.update(config_basename, config)


def install(user=False, sys_prefix=False, overwrite=False, symlink=False,
            prefix=None, nbextensions_dir=None, config_dir=None, logger=None):
    """Edit jupyter config files to use all themysto extensions."""
    return toggle_install(
        True, user=user, sys_prefix=sys_prefix, overwrite=overwrite,
        symlink=symlink, prefix=prefix, nbextensions_dir=nbextensions_dir,
        config_dir=config_dir, logger=logger)


def uninstall(user=False, sys_prefix=False, prefix=None, nbextensions_dir=None,
              config_dir=None, logger=None):
    """Edit jupyter config files to not use all themysto extensions."""
    return toggle_install(
        False, user=user, sys_prefix=sys_prefix, prefix=prefix,
        nbextensions_dir=nbextensions_dir, config_dir=config_dir,
        logger=logger)
