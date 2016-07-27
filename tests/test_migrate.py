# -*- coding: utf-8 -*-
"""Tests for the retiring old IPython-notebook-extensions installations."""

from __future__ import (
    absolute_import, division, print_function, unicode_literals,
)

import imp
import json
import os
from unittest import TestCase

import nose.tools as nt
import pip
from jupyter_contrib_core.testing_utils import (
    get_logger, patch_traitlets_app_logs,
)
from jupyter_contrib_core.testing_utils.jupyter_env import patch_jupyter_dirs

import jupyter_contrib_nbextensions.application
import jupyter_contrib_nbextensions.migrate


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
    """Tests for retiring old IPython-notebook-extensions installs."""
    old_pkg_git_ref = 'c6d65e7826657a23c47b1fadbf8557a06e774db2'
    old_pkg_project_name = 'Python-contrib-nbextensions'

    @classmethod
    def setup_class(cls):
        cls.log = cls.log = get_logger(cls.__name__)
        cls.log.handlers = []
        cls.log.propagate = True

    @classmethod
    def get_old_pkg_url(cls):
        return ('https://github.com/ipython-contrib/'
                'IPython-notebook-extensions/archive/{}.zip').format(
            cls.old_pkg_git_ref)

    def setUp(self):
        """Set up test fixtures."""
        (jupyter_patches, self.jupyter_dirs,
         remove_jupyter_dirs) = patch_jupyter_dirs()
        for ptch in jupyter_patches:
            ptch.start()
            self.addCleanup(ptch.stop)
        self.addCleanup(remove_jupyter_dirs)

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
        for sect, dirpath in self.jupyter_dirs['env_vars'].items():
            installed[sect] = []
            for root, subdirs, files in os.walk(dirpath):
                installed[sect].extend([os.path.join(root, f) for f in files])
            nt.assert_true(installed,
                           'Old install should create files in {}'.format(
                               dirpath))

        return installed

    def check_old_pkg_uninstalled(self, installed):
        old_pkg_project_name = self.old_pkg_project_name
        # check pip uninstalled ok
        nt.assert_not_in(
            old_pkg_project_name, get_installed_project_names(),
            'pip should no longer list {} as installed'.format(
                old_pkg_project_name))
        # check that nothing remains of the old install
        remaining = [pp for pp in installed['data'] if os.path.exists(pp)]
        nt.assert_false(
            remaining, '{} should remove all data files from {}'.format(
                'jupyter_contrib_nbextensions.migrate',
                self.jupyter_dirs['env_vars']['data']))
        # check that python configs are empty
        for pp in [pp for pp in installed['conf']
                   if (os.path.exists(pp) and pp.endswith('.py'))]:
            with open(pp, 'r') as f:
                contents = f.read()
            nt.assert_false(
                contents.strip(),
                '.py config file {} contains text:\n{}'.format(pp, contents))
        # check that json configs are essentially empty
        for pp in [pp for pp in installed['conf']
                   if (os.path.exists(pp) and pp.endswith('.json'))]:
            with open(pp, 'r') as f:
                contents = f.read()
            conf = json.loads(contents)
            # ignore keys added by jupyter_nbextensions_configurator
            load_exts = conf.get('load_extensions', {})
            for req in list(load_exts.keys()):
                if req.startswith('nbextensions_configurator'):
                    load_exts.pop(req, None)
            if not load_exts:
                conf.pop('load_extensions', None)
            conf.pop('version', None)
            srvext_to_remove = 'jupyter_nbextensions_configurator'
            nbapp_sect = conf.get('NotebookApp', {})
            srvxts_key = 'nbserver_extensions'
            srvxts = nbapp_sect.get(srvxts_key, {})
            srvxts.pop(srvext_to_remove, None)
            if not srvxts:
                nbapp_sect.pop(srvxts_key, None)
            srvxts_key = 'server_extensions'
            srvxts = nbapp_sect.get(srvxts_key, [])
            while srvext_to_remove in srvxts:
                srvxts.remove(srvext_to_remove)
            if not srvxts:
                nbapp_sect.pop(srvxts_key, None)
            if not nbapp_sect:
                conf.pop('NotebookApp', None)
            nt.assert_false(
                conf,
                'config file {} is not empty:\n{}'.format(
                    pp, json.dumps(conf, indent=2, sort_keys=True)))

    def test_01_migrate_main(self):
        """Check migrate script removes old install correctly."""
        installed_files = self.install_old_pkg()
        # execute the migrate script
        jupyter_contrib_nbextensions.migrate.main()
        self.check_old_pkg_uninstalled(installed_files)

    def test_02_migrate_app(self):
        """Check migrate application removes old install correctly."""
        installed_files = self.install_old_pkg()
        # execute the migrate app
        klass = jupyter_contrib_nbextensions.application.MigrateContribNbextensionsApp  # noqa
        patch_traitlets_app_logs(klass)
        jupyter_contrib_nbextensions.application.main(['migrate'])
        self.check_old_pkg_uninstalled(installed_files)

    def test_03_migrate_blank(self):
        """Check migrate can run correctly even without a previous install."""
        jupyter_contrib_nbextensions.migrate.main()
