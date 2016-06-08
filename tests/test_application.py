# -*- coding: utf-8 -*-
"""Tests for the main themysto app."""

from __future__ import (
    absolute_import, division, print_function, unicode_literals,
)

import json
import os
import shutil
import sys
import tempfile
from unittest import TestCase

import nose.tools as nt
from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir
from traitlets.config import Config
from traitlets.tests.utils import check_help_all_output, check_help_output
from traitlets.traitlets import default

import themysto.install
from themysto.application import main as main_app
from themysto.application import (
    BaseThemystoApp, InstallThemystoApp, UninstallThemystoApp,
)
from themysto_testing_utils import stringify_env

try:
    from unittest.mock import patch
except ImportError:
    from mock import patch  # py2


def reset_app_class(app_class):
    """Reset all Themysto app traits and clear the instance."""
    for name, traitlet in app_class._instance.traits().items():
        if isinstance(traitlet.this_class, BaseThemystoApp):
            setattr(app_class._instance, name, traitlet.default_value)
    app_class.clear_instance()


class AppTest(TestCase):
    """Tests for the main themysto app."""

    def make_dirs(self, base_dir):
        """Return a dict of root, config and data directory paths."""
        return {
            'root': os.path.join(self.test_dir, base_dir),
            'conf': os.path.join(self.test_dir, base_dir, 'config'),
            'data': os.path.join(self.test_dir, base_dir, 'data'),
        }

    def remove_dirs(self):
        """Remove any temporary directories created."""
        shutil.rmtree(self.test_dir)

    def setUp(self):
        """Set up test fixtures."""
        self.test_dir = tempfile.mkdtemp(prefix='jupyter_')
        self.patches = []

        # patch the App method which returns the default log
        @default('log')
        def new_def_log(self):
            logger = super(BaseThemystoApp, self)._log_default()
            # clear log handlers and propagate to root for nose to capture
            logger.propagate = True
            logger.handlers = []
            return logger
        BaseThemystoApp._log_default = new_def_log

        self.dirs = {
            name: self.make_dirs(name) for name in (
                'user_home', 'env_vars', 'system', 'sys_prefix', 'custom')}

        self.patches.append(patch.dict('os.environ', stringify_env({
            'HOME': self.dirs['user_home']['root'],
            'JUPYTER_CONFIG_DIR': self.dirs['env_vars']['conf'],
            'JUPYTER_DATA_DIR': self.dirs['env_vars']['data'],
        })))

        mod_to_patch_paths = sys.modules[
            themysto.install._get_config_dir.__module__]
        self.patches.append(patch.multiple(
            mod_to_patch_paths,
            SYSTEM_CONFIG_PATH=[self.dirs['system']['conf']],
            ENV_CONFIG_PATH=[self.dirs['sys_prefix']['conf']],
        ))
        if hasattr(mod_to_patch_paths, 'SYSTEM_JUPYTER_PATH'):
            self.patches.append(patch.multiple(
                mod_to_patch_paths,
                SYSTEM_JUPYTER_PATH=[self.dirs['system']['data']]))
        if hasattr(mod_to_patch_paths, 'ENV_JUPYTER_PATH'):
            self.patches.append(patch.multiple(
                mod_to_patch_paths,
                ENV_JUPYTER_PATH=[self.dirs['sys_prefix']['data']]))

        for ptch in self.patches:
            ptch.start()
            self.addCleanup(ptch.stop)
        self.addCleanup(self.remove_dirs)

    def check_install(self, argv=None, dirs=None):
        """Check files were installed in the correct place."""
        if argv is None:
            argv = []
        if dirs is None:
            dirs = {
                'conf': jupyter_config_dir(),
                'data': jupyter_data_dir(),
            }
        conf_dir, data_dir = dirs['conf'], dirs['data']

        # do install
        main_app(argv=['install'] + argv)

        # list everything that got installed
        installed_files = []
        for root, subdirs, files in os.walk(dirs['conf']):
            installed_files.extend([os.path.join(root, f) for f in files])
        for root, subdirs, files in os.walk(dirs['data']):
            installed_files.extend([os.path.join(root, f) for f in files])
        nt.assert_true(installed_files,
                       'Install should create files in {} or {}'.format(
                           dirs['conf'], dirs['data']))

        # a bit of a hack to allow initializing a new app instance
        reset_app_class(InstallThemystoApp)

        # do uninstall
        main_app(argv=['uninstall'] + argv)
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
                'nbserver_extensions in file {}'.format(path))
            confstrip = {}
            confstrip.update(conf)
            confstrip.pop('NotebookApp', None)
            confstrip.pop('version', None)
            nt.assert_false(confstrip, 'Uninstall should leave config empty.')

        reset_app_class(UninstallThemystoApp)

    def test_help_output(self):
        """Check that themysto app help works."""
        for argv in (['install'], ['uninstall']):
            check_help_output('themysto.application', argv)
            check_help_all_output('themysto.application', argv)
        # sys.exit should be called if no argv specified
        with nt.assert_raises(SystemExit):
            main_app([])

    def test_default_install(self):
        """Check that install works correctly using defaults."""
        self.check_install()

    def test_user_install(self):
        """Check that install works correctly using --user flag."""
        self.check_install(argv=['--user'], dirs=self.dirs['env_vars'])

    def test_sys_prefix_install(self):
        """Check that install works correctly using --sys-prefix flag."""
        self.check_install(argv=['--sys-prefix'], dirs=self.dirs['sys_prefix'])

    def test_system_install(self):
        """Check that install works correctly using --system flag."""
        self.check_install(argv=['--system'], dirs=self.dirs['system'])

    def test_config_dir_install(self):
        """Check that install works correctly using --config-dir arg."""
        self.check_install(
            argv=['--config-dir=' + self.dirs['custom']['conf']],
            dirs=self.dirs['custom'])
