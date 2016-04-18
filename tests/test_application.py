# -*- coding: utf-8 -*-
"""Test for the main themysto app."""

from traitlets.tests.utils import check_help_all_output


def test_help_output():
    """Check that themysto --help-all works"""
    check_help_all_output('themysto.application')
    check_help_all_output('themysto.application', ['install'])
    check_help_all_output('themysto.application', ['uninstall'])
