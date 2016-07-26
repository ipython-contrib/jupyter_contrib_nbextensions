# -*- coding: utf-8 -*-

"""Test the package"""

from jupyter_contrib_core.testing_utils import raise_on_bad_version

from jupyter_contrib_nbextensions import __version__


def test_current_version():
    """check that version string complies with pep440"""
    raise_on_bad_version(__version__)
