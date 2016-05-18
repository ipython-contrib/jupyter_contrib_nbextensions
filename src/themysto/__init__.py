# -*- coding: utf-8 -*-

import os

from . import nbextensions_configurator

__version__ = '0.0.1'


def _jupyter_server_extension_paths():
    return nbextensions_configurator._jupyter_server_extension_paths() + []


def _jupyter_nbextension_paths():
    nbext_metadata = []
    pkg_nbext_dir = os.path.join(os.path.dirname(__file__), 'nbextensions')
    specs = nbextensions_configurator.get_configurable_nbextensions(
        nbextension_dirs=[pkg_nbext_dir])
    for ext in specs:
        nbext_metadata.append(dict(
            section=ext['Section'],
            # the path is relative to the package directory
            src=os.path.join(
                'nbextensions',
                # src is a directory in which we assume require file resides.
                os.path.dirname(ext['require'])
            ),
            # directory in the `nbextension/` namespace
            dest=os.path.dirname(ext['require']),
            # _also_ in the `nbextension/` namespace
            require=ext['require'],
        ))
    return nbext_metadata
