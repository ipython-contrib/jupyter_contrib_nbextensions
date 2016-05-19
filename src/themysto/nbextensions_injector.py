# -*- coding: utf-8 -*-

import os


def nbext_dir():
    """Return the path where themysto nbextensions reside."""
    return os.path.join(os.path.dirname(__file__), 'nbextensions')


def load_jupyter_server_extension(nbapp):
    """
    Load and initialise the server extension.

    This is essentially just a way of appending the themysto nbextensions
    directory to server's nbextensions path.
    """
    nbapp.log.debug('Loading extension {}'.format(__name__))
    webapp = nbapp.web_app
    static_files_path = os.path.normpath(nbext_dir())
    nbapp.log.debug(
        '  Editing nbextensions path to add {}'.format(static_files_path))
    if static_files_path not in webapp.settings['nbextensions_path']:
        webapp.settings['nbextensions_path'].append(static_files_path)
    nbapp.log.debug('Loaded extension {}'.format(__name__))


def _jupyter_server_extension_paths():
    """Magically-named function to allow `jupyter serverextension` to work."""
    return [{
        'module': __name__
    }]
