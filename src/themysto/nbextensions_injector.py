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
    nbapp.web_app.settings['nbextensions_path'].append(nbext_dir())


def _jupyter_server_extension_paths():
    """Magically-named function to allow `jupyter serverextension` to work."""
    return [{
        'module': __name__
    }]
