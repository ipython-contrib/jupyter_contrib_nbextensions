# -*- coding: utf-8 -*-
"""Tests for the main themysto app."""

import os
import json
import shutil
import tempfile

import nose.tools as nt
from traitlets.tests.utils import check_help_all_output, check_help_output
from traitlets.config import Config
from unittest import TestCase

from themysto.application import main as main_app
from themysto.application import InstallThemystoApp


class AppTest(TestCase):
    """Tests for the main themysto app."""

    env_vars = {'JUPYTER_CONFIG_DIR': 'config', 'JUPYTER_DATA_DIR': 'data'}

    def setUp(self):
        """Set up test fixtures."""
        self.jupyter_dir = tempfile.mkdtemp(prefix='jupyter_')

    def tearDown(self):
        """Tear down test fixtures."""
        shutil.rmtree(self.jupyter_dir)

    def check_install(self, extra_args=None):
        """Check files were installed in the correct place."""
        if extra_args is None:
            extra_args = []
        data_dir = os.path.join(self.jupyter_dir, 'data')
        conf_dir = os.path.join(self.jupyter_dir, 'config')

        # do install
        main_app(argv=['install'] + extra_args)

        # list everything that got installed
        installed_files = []
        for root, subdirs, files in os.walk(self.jupyter_dir):
            installed_files.extend([os.path.join(root, f) for f in files])
        nt.assert_true(
            installed_files,
            'Install should create files in {}'.format(self.jupyter_dir))

        # a bit of a hack to allow initializing a new app instance
        for cls in InstallThemystoApp._walk_mro():
            cls._instance = None

        # do uninstall
        main_app(argv=['uninstall'] + extra_args)
        # check that nothing remains in the data directory
        data_installed = [
            path for path in installed_files
            if path.startswith(data_dir) and os.path.exists(path)]
        nt.assert_false(
            data_installed,
            'Uninstall should remove all data files from {}'.format(data_dir))
        # check the config directory
        conf_installed = [
            path for path in installed_files
            if path.startswith(conf_dir) and os.path.exists(path)]
        for path in conf_installed:
            with open(path, 'r') as f:
                conf = Config(json.load(f))
            nbapp = conf.get('NotebookApp', {})
            nt.assert_not_in(
                'server_extensions', nbapp,
                'Uninstall should empty & remove '
                'server_extensions list'.format(path))
            nbservext = nbapp.get('nbserver_extensions', {})
            nt.assert_false(
                {k: v for k, v in nbservext.items() if v},
                'Uninstall should disable all '
                'nbserver_extensions file {}'.format(path))
            confstrip = {}
            confstrip.update(conf)
            confstrip.pop('NotebookApp', None)
            confstrip.pop('version', None)
            nt.assert_false(confstrip, 'Uninstall should leave config empty.')

    def test_help_output(self):
        """Check that themysto app help works."""
        for argv in (None, ['install'], ['uninstall']):
            check_help_output('themysto.application', argv)
            check_help_all_output('themysto.application', argv)
        # sys.exit should be called if no argv specified
        with nt.assert_raises(SystemExit):
            main_app()

    def test_kwarg_install(self):
        """Check that install works correctly using --config-dir arg."""
        self.check_install([
            '--config-dir=' + os.path.join(self.jupyter_dir, 'config')])

    def test_env_var_install(self):
        """Check that install works correctly using environment variables."""
        for var in self.env_vars:
            new_dir = self.env_vars[var]
            self.env_vars[var] = os.environ.get(var, None)
            os.environ[var] = os.path.join(self.jupyter_dir, new_dir)
            if not os.path.exists(os.environ[var]):
                os.makedirs(os.environ[var])
        try:
            self.check_install()
        finally:
            for var, val in self.env_vars.items():
                self.env_vars[var] = os.path.basename(os.environ.pop(var))
                if val is not None:
                    os.environ[var] = val
