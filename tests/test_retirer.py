# -*- coding: utf-8 -*-
"""Tests for the main themysto app."""

from __future__ import (
    absolute_import, division, print_function, unicode_literals,
)

import imp
import os
import shutil
import tempfile
from unittest import TestCase

import nose.tools as nt
import pip

import themysto.application
import themysto.retirer
from themysto_testing_utils import stringify_env

try:
    from unittest.mock import patch
except ImportError:
    from mock import patch  # py2


def refresh_packages():
    """
    Refresh pip's list of installed packages.

    Rather hackish, taken from https://github.com/pypa/pip/issues/2695
    """
    pip.utils.pkg_resources = imp.reload(pip.utils.pkg_resources)


def get_installed_project_names():
    """Return all installed project names as reported by (refreshed) pip."""
    refresh_packages()
    return [p.project_name for p in pip.get_installed_distributions()]


class MigrateTest(TestCase):
    """Tests for the main themysto app."""
    old_pkg_git_ref = 'master'
    old_pkg_project_name = 'Python-contrib-nbextensions'

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
        self.dirs = {
            dd: os.path.join(self.test_dir, dd)
            for dd in ['config', 'data']}
        for dd in [dd for dd in self.dirs.values() if not os.path.exists(dd)]:
            os.makedirs(dd)
        env_patch = patch.dict('os.environ', stringify_env({
            'JUPYTER_CONFIG_DIR': self.dirs['config'],
            'JUPYTER_DATA_DIR': self.dirs['data'],
        }))
        env_patch.start()
        self.addCleanup(env_patch.stop)
        self.addCleanup(self.remove_dirs)

    def install_old_pkg(self):
        old_pkg_project_name = self.old_pkg_project_name
        # install old repo version
        pip.main(['install', '-v', self.get_old_pkg_url()])
        # check pip installed ok
        nt.assert_in(
            old_pkg_project_name, get_installed_project_names(),
            'pip should list {} as installed'.format(old_pkg_project_name))
        # list all files that got installed
        installed = {}
        for sect in self.dirs:
            installed[sect] = []
            for root, subdirs, files in os.walk(self.dirs[sect]):
                installed[sect].extend([os.path.join(root, f) for f in files])
            nt.assert_true(installed,
                           'Old install should create files in {}'.format(
                               *self.dirs.values()))
        return installed

    def check_old_pkg_uninstalled(self, installed):
        old_pkg_project_name = self.old_pkg_project_name
        # check pip uninstalled ok
        nt.assert_not_in(
            old_pkg_project_name, get_installed_project_names(),
            'pip should no longer list {} as installed'.format(
                old_pkg_project_name))
        # check that nothing remains of the old install
        for sect, dd in self.dirs.items():
            remaining = [pp for pp in installed[sect] if os.path.exists(pp)]
            nt.assert_false(
                remaining,
                '{} should remove all data files from {}'.format(
                    'themysto.retirer', dd))

    def test_01_retirer_main(self):
        """Check retirer script removes old install correctly."""
        installed_files = self.install_old_pkg()
        # execute the retirer script
        themysto.retirer.main()
        self.check_old_pkg_uninstalled(installed_files)

    def test_02_retirer_app(self):
        """Check retirer application removes old install correctly."""
        installed_files = self.install_old_pkg()
        # execute the retirer app
        themysto.application.main(['retire'])
        self.check_old_pkg_uninstalled(installed_files)

    def test_03_retirer_blank(self):
        """Check retirer can run correctly even without a previous install."""
        # execute the retirer script
        themysto.retirer.main()
