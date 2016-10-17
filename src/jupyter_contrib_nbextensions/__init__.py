# -*- coding: utf-8 -*-

import os

import jupyter_nbextensions_configurator

__version__ = '0.2.1'


def _jupyter_server_extension_paths():
    """Magically-named function for jupyter extension installations."""
    return []


def _jupyter_nbextension_paths():
    """Magically-named function for jupyter extension installations."""
    nbextension_dirs = [
        os.path.join(os.path.dirname(__file__), 'nbextensions')]
    specs = jupyter_nbextensions_configurator.get_configurable_nbextensions(
        nbextension_dirs=nbextension_dirs)

    return [dict(
        section=nbext['Section'],
        # src is a directory in which we assume the require file resides.
        # the path is relative to the package directory
        src=os.path.join(
            'nbextensions',
            os.path.dirname(nbext['require'])
        ),
        # directory in the `nbextension/` namespace
        dest=os.path.dirname(nbext['require']),
        # _also_ in the `nbextension/` namespace
        require=nbext['require'],
    ) for nbext in specs]
