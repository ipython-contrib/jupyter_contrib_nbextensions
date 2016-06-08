# -*- coding: utf-8 -*-

from . import nbextensions_configurator, nbextensions_injector

__version__ = '0.0.2'


def _jupyter_server_extension_paths():
    return (
        nbextensions_configurator._jupyter_server_extension_paths() +
        nbextensions_injector._jupyter_server_extension_paths()
    )
