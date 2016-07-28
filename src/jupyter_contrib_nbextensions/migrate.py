# -*- coding: utf-8 -*-
"""
Functions to remove old (pre-themysto) installs.

This may change or disappear at any time, so don't rely on it!
"""

import errno
import io
import os
import shutil
import tempfile

from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir
from notebook.services.config import ConfigManager as FrontendConfigManager
from traitlets.config import Config
from traitlets.config.manager import BaseJSONConfigManager

from jupyter_contrib_nbextensions.install import (
    _set_managed_config, _update_config_list,
)


def _migrate_require_paths(logger=None):
    """Migrate require paths from old to new values."""
    if logger:
        logger.info('- Migrating require paths from old to new locations')

    mappings = {
        'notebook': [
            ('config/config_menu/main',
             'nbextensions_configurator/config_menu/main'),
        ] + [(req, req.split('/', 1)[1]) for req in [
            'codemirrormode/skill/skill',
            'publishing/gist_it/main',
            'publishing/printview/main',
            'styling/table_beautifier/main',
            'styling/zenmode/main',
            'usability/autosavetime/main',
            'usability/autoscroll/main',
            'usability/chrome-clipboard/main',
            'usability/code_font_size/code_font_size',
            'usability/codefolding/main',
            'usability/collapsible_headings/main',
            'usability/comment-uncomment/main',
            'usability/datestamper/main',
            'usability/dragdrop/main',
            'usability/equation-numbering/main',
            'usability/execute_time/ExecuteTime',
            'usability/exercise/main',
            'usability/exercise2/main',
            'usability/freeze/main',
            'usability/help_panel/help_panel',
            'usability/hide_input/main',
            'usability/hide_input_all/main',
            'usability/highlighter/highlighter',
            'usability/hinterland/hinterland',
            'usability/init_cell/main',
            'usability/keyboard_shortcut_editor/main',
            'usability/latex_envs/latex_envs',
            'usability/limit_output/main',
            'usability/move_selected_cells/main',
            'usability/navigation-hotkeys/main',
            'usability/notify/notify',
            'usability/python-markdown/main',
            'usability/qtconsole/qtconsole',
            'usability/rubberband/main',
            'usability/ruler/main',
            'usability/runtools/main',
            'usability/scratchpad/main',
            'usability/search-replace/main',
            'usability/skip-traceback/main',
            'usability/spellchecker/main',
            'usability/splitcell/splitcell',
            'usability/toc2/main',
            'usability/toggle_all_line_numbers/main',
        ]],
        'tree': [
            ('usability/tree-filter/index', 'tree-filter/index'),
        ]
    }

    fecm = FrontendConfigManager()
    for section in mappings:
        conf = fecm.get(section)
        load_extensions = conf.get('load_extensions', {})
        for old, new in mappings[section]:
            status = load_extensions.pop(old, None)
            if status is not None:
                if logger:
                    logger.debug('--  Migrating {!r} -> {!r}'.format(old, new))
                load_extensions[new] = status
        fecm.set(section, conf)


def _uninstall_pre_config(logger=None):
    """Undo config settings inserted by an old (pre-themysto) installation."""
    # for application json config files
    cm = BaseJSONConfigManager(config_dir=jupyter_config_dir())

    # -------------------------------------------------------------------------
    # notebook json config
    config_basename = 'jupyter_notebook_config'
    config = Config(cm.get(config_basename))
    config_path = cm.file_name(config_basename)
    if config and logger:
        logger.info('- Removing old config values from {}'.format(config_path))
    to_remove = ['nbextensions']
    # remove from notebook >= 4.2 key nbserver_extensions
    section = config.get('NotebookApp', Config())
    server_extensions = section.get('nbserver_extensions', {})
    for se in to_remove:
        server_extensions.pop(se, None)
    if len(server_extensions) == 0:
        section.pop('nbserver_extensions', None)
    # and notebook < 4.2 key server_extensions
    _update_config_list(
        config, 'NotebookApp.server_extensions', to_remove, False)
    _update_config_list(config, 'NotebookApp.extra_template_paths', [
        os.path.join(jupyter_data_dir(), 'templates'),
    ], False)
    _set_managed_config(cm, config_basename, config, logger)

    # -------------------------------------------------------------------------
    # nbconvert json config
    config_basename = 'jupyter_nbconvert_config'
    config = Config(cm.get(config_basename))
    if config and logger:
        logger.info('- Removing old config values from {}'.format(config_path))
    _update_config_list(config, 'Exporter.template_path', [
        '.', os.path.join(jupyter_data_dir(), 'templates'),
    ], False)
    _update_config_list(config, 'Exporter.preprocessors', [
        'pre_codefolding.CodeFoldingPreprocessor',
        'pre_pymarkdown.PyMarkdownPreprocessor',
    ], False)
    section = config.get('NbConvertApp', {})
    if (section.get('postprocessor_class') ==
            'post_embedhtml.EmbedPostProcessor'):
        section.pop('postprocessor_class', None)
    if len(section) == 0:
        config.pop('NbConvertApp', None)
    _set_managed_config(cm, config_basename, config, logger)

    # -------------------------------------------------------------------------
    # Remove old config lines from .py configuration files
    for config_basename in ('jupyter_notebook_config.py',
                            'jupyter_nbconvert_config.py'):
        py_config_path = os.path.join(jupyter_config_dir(), config_basename)
        if not os.path.isfile(py_config_path):
            continue
        if logger:
            logger.info(
                '--  Removing now-empty config file {}'.format(py_config_path))
        with io.open(py_config_path, 'r') as f:
            lines = f.readlines()
        marker = '#--- nbextensions configuration ---'
        marker_inds = [ii for ii, l in enumerate(lines) if l.find(marker) >= 0]
        if len(marker_inds) >= 2:
            lines = lines[0:marker_inds[0]] + lines[marker_inds[1] + 1:]
            if [l for l in lines if l.strip]:
                with io.open(py_config_path, 'w') as f:
                    f.writelines(lines)
            else:
                if logger:
                    logger.info(
                        'Removing now-empty config file {}'.format(
                            py_config_path))
                try:
                    os.remove(py_config_path)
                except OSError as ex:
                    if ex.errno != errno.ENOENT:
                        raise


def _uninstall_pre_files(logger=None):
    """
    Remove any files recorded from a previous installation.

    Rather than actually deleting, this function copies everything to a
    temporary directory without explicit cleanup, in case a user wants to try
    manual recovery at some point.

    The OS can then handle actual removal from the temp directory as and when
    it chooses to.
    """
    data_dir = jupyter_data_dir()

    bom_pref = 'ipython-contrib-IPython-notebook-extensions-'
    bom_path = os.path.join(data_dir, bom_pref + 'installed_files.txt')

    if not os.path.exists(bom_path):
        if logger:
            logger.info('- No list of previously-installed files at {}'.format(
                bom_path))
        return
    elif logger:
        logger.info(
            '- Removing previously-installed files listed in {}'.format(
                bom_path))

    deleted_to = tempfile.mkdtemp(prefix=bom_pref)
    if logger:
        logger.info(
            '--  Files will be copied to the temp directory {}'.format(
                deleted_to))

    with open(bom_path, 'r') as bom_file:
        for src in bom_file.readlines():
            src = src.rstrip('\n').rstrip('\r')
            if os.path.exists(src):
                if logger:
                    logger.info('    ' + src)
                dest = os.path.join(
                    deleted_to, os.path.relpath(src, data_dir))
                dest_dir = os.path.dirname(dest)
                if not os.path.exists(dest_dir):
                    os.makedirs(dest_dir)
                shutil.move(src, dest)
            # remove empty directories
            allowed_errnos = (errno.ENOTDIR, errno.ENOTEMPTY, errno.ENOENT)
            while len(src) > len(data_dir):
                src = os.path.dirname(src)
                try:
                    os.rmdir(src)
                except OSError as ex:
                    if ex.errno not in allowed_errnos:
                        raise
                    break
                else:
                    if logger:
                        logger.info('    ' + src)
    os.remove(bom_path)
    return deleted_to


def _uninstall_pre_pip(logger=None):
    """Uninstall the old package name from pip."""
    old_pkg_name = 'Python-contrib-nbextensions'
    try:
        import pip
    except ImportError:
        pass
        logger.info((
            "- Couldn't import pip, so can't attempt to "
            "pip uninstall the old package name {}").format(old_pkg_name))
    else:
        installed_pkg_names = [
            pkg.project_name for pkg in pip.get_installed_distributions()]
        if old_pkg_name not in installed_pkg_names:
            return
        if logger:
            logger.info('- Uninstalling old package name from pip: {}'.format(
                old_pkg_name))
        try:
            pip.main(['uninstall', '-y', old_pkg_name])
        except SystemExit:
            pass


def migrate(logger=None):
    """Remove an old (pre-jupyter_contrib_nbextensions) install."""
    _migrate_require_paths(logger=logger)
    _uninstall_pre_files(logger=logger)
    _uninstall_pre_config(logger=logger)
    _uninstall_pre_pip(logger=logger)


def main():
    """Allow for running module as a script."""
    import logging
    logger = logging.getLogger('jupyter_contrib_nbextensions.migrate.main')
    logger.info(
        'Retiring pre-jupyter_contrib_nbextensions IPython-notebook-extensions'
    )
    migrate(logger)


if __name__ == '__main__':  # pragma: no cover
    """Run module as a script."""
    main()
