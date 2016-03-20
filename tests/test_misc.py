# -*- coding: utf-8 -*-

"""Test themysto package"""

from notebook.tests.test_notebookapp import raise_on_bad_version

from themysto import __version__


def test_current_version():
    """check that version string complies with pep440"""
    raise_on_bad_version(__version__)
