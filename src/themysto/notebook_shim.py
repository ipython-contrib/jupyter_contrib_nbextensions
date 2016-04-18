# -*- coding: utf-8 -*-
"""Shim providing some extension functions from notebook 4.2
jupyter.serverextensions and jupyter.nbextensions
for use on jupyter versions < 4.2.0
"""

from __future__ import print_function

import os
import shutil
from os.path import join as pjoin
from os.path import basename, normpath

from ipython_genutils.path import ensure_dir_exists
from ipython_genutils.py3compat import cast_unicode_py2
from jupyter_core.paths import (
    ENV_CONFIG_PATH, ENV_JUPYTER_PATH, SYSTEM_CONFIG_PATH, SYSTEM_JUPYTER_PATH,
    jupyter_config_dir, jupyter_data_dir,
)
from traitlets.config.manager import BaseJSONConfigManager

# -----------------------------------------------------------------------------
# Public API
# -----------------------------------------------------------------------------


class ArgumentConflict(ValueError):
    pass


def toggle_serverextension_python(import_name, enabled=None, parent=None,
                                  user=True, sys_prefix=False, logger=None):
    """Toggle a server extension.
    Copied from notebook.serverextensions v4.2.0, but modified to use the older
    config key server_extensions, which was a list rather than the newer
    nbserver_extensions dict
    """
    user = False if sys_prefix else user
    config_dir = _get_config_dir(user=user, sys_prefix=sys_prefix)
    cm = BaseJSONConfigManager(parent=parent, config_dir=config_dir)
    cfg = cm.get('jupyter_notebook_config')
    server_extensions = (
        cfg.setdefault('NotebookApp', {})
        .setdefault('server_extensions', [])
    )

    old_enabled = import_name in server_extensions
    new_enabled = enabled if enabled is not None else not old_enabled

    if logger:
        if new_enabled:
            logger.info(u'Enabling: %s' % (import_name))
        else:
            logger.info(u'Disabling: %s' % (import_name))

    if new_enabled:
        if not old_enabled:
            server_extensions.append(import_name)
    elif old_enabled:
        while import_name in server_extensions:
            server_extensions.pop(server_extensions.index(import_name))

    if logger:
        logger.info(u'- Writing config: {}'.format(config_dir))

    cm.update('jupyter_notebook_config', cfg)


def install_nbextension(path, overwrite=False, symlink=False,
                        user=False, prefix=None, nbextensions_dir=None,
                        destination=None, logger=None, sys_prefix=False):
    """Install a Javascript extension for the notebook.
    Copied from notebook v4.2.0, cut down to only support installing from a
    local non-archived directory.
    """
    # the actual path to which we eventually installed
    full_dest = None

    nbext = _get_nbextension_dir(
        user=user, sys_prefix=sys_prefix, prefix=prefix,
        nbextensions_dir=nbextensions_dir)
    # make sure nbextensions dir exists
    ensure_dir_exists(nbext)

    # forcing symlink parameter to False if os.symlink does not exist (e.g.,
    # on Windows machines running python 2)
    if not hasattr(os, 'symlink'):
        logger.warning(
            'os does not support symlinks - reverting to non-symlink install')
        symlink = False

    if isinstance(path, (list, tuple)):
        raise TypeError(
            'path must be a string pointing to a single extension to install;'
            ' call this function multiple times to install multiple extensions'
        )

    path = cast_unicode_py2(path)

    if not destination:
        destination = basename(path)
    destination = cast_unicode_py2(destination)
    full_dest = normpath(pjoin(nbext, destination))
    if overwrite and os.path.lexists(full_dest):
        if logger:
            logger.info('Removing: %s' % full_dest)
        if os.path.isdir(full_dest) and not os.path.islink(full_dest):
            shutil.rmtree(full_dest)
        else:
            os.remove(full_dest)

    if symlink:
        path = os.path.abspath(path)
        if not os.path.exists(full_dest):
            if logger:
                logger.info('Symlinking: %s -> %s' % (full_dest, path))
            os.symlink(path, full_dest)
    elif os.path.isdir(path):
        path = pjoin(os.path.abspath(path), '')  # end in path separator
        for parent, dirs, files in os.walk(path):
            dest_dir = pjoin(full_dest, parent[len(path):])
            if not os.path.exists(dest_dir):
                if logger:
                    logger.info('Making directory: %s' % dest_dir)
                os.makedirs(dest_dir)
            for file in files:
                src = pjoin(parent, file)
                dest_file = pjoin(dest_dir, file)
                _maybe_copy(src, dest_file, logger=logger)
    else:
        src = path
        _maybe_copy(src, full_dest, logger=logger)

    return full_dest


def uninstall_nbextension(dest, require=None, user=False, sys_prefix=False,
                          prefix=None, nbextensions_dir=None, logger=None):
    """Uninstall a Javascript extension of the notebook.
    Copied from notebook.nbextensions v4.2.0
    """
    nbext = _get_nbextension_dir(
        user=user, sys_prefix=sys_prefix, prefix=prefix,
        nbextensions_dir=nbextensions_dir)
    dest = cast_unicode_py2(dest)
    full_dest = pjoin(nbext, dest)
    if os.path.lexists(full_dest):
        if logger:
            logger.info('Removing: %s' % full_dest)
        if os.path.isdir(full_dest) and not os.path.islink(full_dest):
            shutil.rmtree(full_dest)
        else:
            os.remove(full_dest)

    # Look through all of the config sections making sure that the nbextension
    # doesn't exist.
    config_dir = os.path.join(
        _get_config_dir(user=user, sys_prefix=sys_prefix), 'nbconfig')
    cm = BaseJSONConfigManager(config_dir=config_dir)
    if require:
        for section in ('common', 'notebook', 'tree', 'edit', 'terminal'):
            cm.update(section, {'load_extensions': {require: None}})


def _should_copy(src, dest, logger=None):
    """Should a file be copied, if it doesn't exist, or is newer?

    Returns whether the file needs to be updated.

    Parameters
    ----------

    src : string
        A path that should exist from which to copy a file
    src : string
        A path that might exist to which to copy a file
    logger : Jupyter logger [optional]
        Logger instance to use
    """
    if not os.path.exists(dest):
        return True
    if os.stat(src).st_mtime - os.stat(dest).st_mtime > 1e-6:
        # we add a fudge factor to work around a bug in python 2.x
        # that was fixed in python 3.x: http://bugs.python.org/issue12904
        if logger:
            logger.warn("Out of date: %s" % dest)
        return True
    if logger:
        logger.info("Up to date: %s" % dest)
    return False


def _maybe_copy(src, dest, logger=None):
    """Copy a file if it needs updating.

    Parameters
    ----------

    src : string
        A path that should exist from which to copy a file
    src : string
        A path that might exist to which to copy a file
    logger : Jupyter logger [optional]
        Logger instance to use
    """
    if _should_copy(src, dest, logger=logger):
        if logger:
            logger.info("Copying: %s -> %s" % (src, dest))
        shutil.copy2(src, dest)


def _get_config_dir(user=False, sys_prefix=False):
    """Get the location of config files for the current context.
    Copied from notebook.nbextensions v4.2.0
    """
    user = False if sys_prefix else user
    if user and sys_prefix:
        raise ArgumentConflict(
            'Cannot specify more than one of user or sys_prefix')
    if user:
        nbext = jupyter_config_dir()
    elif sys_prefix:
        nbext = ENV_CONFIG_PATH[0]
    else:
        nbext = SYSTEM_CONFIG_PATH[0]
    return nbext


def _get_nbextension_dir(user=False, sys_prefix=False, prefix=None,
                         nbextensions_dir=None):
    """Return the nbextension directory specified.
    Copied from notebook.nbextensions v4.2.0
    """
    if sum(map(bool, [user, prefix, nbextensions_dir, sys_prefix])) > 1:
        raise ArgumentConflict(
            'cannot specify more than one of user, sys_prefix, prefix, or '
            'nbextensions_dir')
    if user:
        nbext = pjoin(jupyter_data_dir(), u'nbextensions')
    elif sys_prefix:
        nbext = pjoin(ENV_JUPYTER_PATH[0], u'nbextensions')
    elif prefix:
        nbext = pjoin(prefix, 'share', 'jupyter', 'nbextensions')
    elif nbextensions_dir:
        nbext = nbextensions_dir
    else:
        nbext = pjoin(SYSTEM_JUPYTER_PATH[0], 'nbextensions')
    return nbext
