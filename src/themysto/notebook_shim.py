# -*- coding: utf-8 -*-
"""Shim providing some things from 4.2 notebook for use in earlier versions."""

from jupyter_core.paths import (
    ENV_CONFIG_PATH, SYSTEM_CONFIG_PATH, jupyter_config_dir,
)


class ArgumentConflict(ValueError):
    pass


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
