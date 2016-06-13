# -*- coding: utf-8 -*-
"""Test utilities themysto."""

from __future__ import (
    absolute_import, division, print_function, unicode_literals,
)

import os
import sys


def stringify_env(env):
    """
    Convert environment vars dict to str: str (not unicode) for py2 on Windows.

    Python 2 on Windows doesn't handle Unicode objects in environment, even if
    they can be converted to ASCII string, which can cause problems for
    subprocess calls in modules importing unicode_literals from future.
    """
    if sys.version_info[0] < 3 and os.name == 'nt':
        return {str(key): str(val) for key, val in env.iteritems()}
    return env
