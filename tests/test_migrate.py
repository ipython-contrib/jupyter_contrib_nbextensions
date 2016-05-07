# -*- coding: utf-8 -*-
"""Tests for the main themysto app."""

from __future__ import (
    absolute_import, division, print_function, unicode_literals,
)

import os
import shutil
import tempfile
from unittest import TestCase

import nose.tools as nt
import pip
from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir

import themysto.retirer

try:
    from unittest.mock import patch
except ImportError:
    from mock import patch  # py2


class MigrateTest(TestCase):
    """Tests for the main themysto app."""
    old_pkg_git_ref = 'master'

    @classmethod
    def get_old_pkg_url(cls):
        return ('https://github.com/ipython-contrib/'
                'IPython-notebook-extensions/archive/{}.zip').format(
            cls.old_pkg_git_ref)

    def remove_dirs(self):
        """Remove any temporary directories created."""
        shutil.rmtree(self.test_dir)

    def setUp(self):
        """Set up test fixtures."""
        self.test_dir = tempfile.mkdtemp(prefix='jupyter_')
        dirs = {dd: os.path.join(self.test_dir, dd)
                for dd in ['config', 'data']}
        for dd in [dd for dd in dirs.values() if not os.path.exists(dd)]:
            os.makedirs(dd)
        env_patch = patch.dict('os.environ', {
            'JUPYTER_CONFIG_DIR': dirs['config'],
            'JUPYTER_DATA_DIR': dirs['data'],
        })
        env_patch.start()
        self.addCleanup(env_patch.stop)
        self.addCleanup(self.remove_dirs)

    def test_retirer(self):
        """Check retirer removes old files correctly."""
        dirs = {'conf': jupyter_config_dir(), 'data': jupyter_data_dir()}

        # install old repo version
        pip.main(['install', '-y', '-v', self.get_old_pkg_url()])

        # list everything that got installed
        installed = {}
        for sect in dirs:
            installed[sect] = []
            for root, subdirs, files in os.walk(dirs[sect]):
                installed[sect].extend([os.path.join(root, f) for f in files])
            nt.assert_true(installed,
                           'Old install should create files in {}'.format(
                               *dirs.values()))

        # execute the retirer script
        themysto.retirer.main()

        # check that nothing remains of the old install
        for sect, dd in dirs.items():
            remaining = [pp for pp in installed[sect] if os.path.exists(pp)]
            nt.assert_false(
                remaining,
                '{} should remove all data files from {}'.format(
                    'themysto.retirer', dd))
