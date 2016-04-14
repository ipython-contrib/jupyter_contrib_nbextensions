# -*- coding: utf-8 -*-

"""Test themysto package"""

import re

from themysto import __version__

try:
    from notebook.tests.test_notebookapp import raise_on_bad_version
except ImportError:
    pep440re = re.compile(
        r'^'
        r'([1-9]\d*!)?(0|[1-9]\d*)(.(0|[1-9]\d*))*'
        r'((a|b|rc)(0|[1-9]\d*))?'
        r'(\.post(0|[1-9]\d*))?'
        r'(\.dev(0|[1-9]\d*))?'
        r'$'
    )

    def raise_on_bad_version(version):
        if not pep440re.match(version):
            raise ValueError(
                "Versions String apparently does not match Pep 440 "
                "specification, which might lead to sdist and wheel being "
                "seen as 2 different release. "
                "E.g: do not use dots for beta/alpha/rc markers."
            )


def test_current_version():
    """check that version string complies with pep440"""
    raise_on_bad_version(__version__)
