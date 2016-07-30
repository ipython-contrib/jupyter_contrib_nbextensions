# -*- coding: utf-8 -*-
"""App to install/remove jupyter_contrib_nbextensions."""

from __future__ import print_function, unicode_literals

import sys

from jupyter_contrib_core.notebook_compat.nbextensions import ArgumentConflict
from jupyter_core.application import JupyterApp
from tornado.log import LogFormatter
from traitlets import Bool, Unicode, default

import jupyter_contrib_nbextensions
from jupyter_contrib_nbextensions.install import install, uninstall
from jupyter_contrib_nbextensions.migrate import migrate


class BaseContribNbextensionsApp(JupyterApp):
    """Base class for jupyter_contrib_nbextensions apps."""

    version = jupyter_contrib_nbextensions.__version__

    _log_formatter_cls = LogFormatter

    @default('log_datefmt')
    def _log_datefmt_default(self):
        """Exclude date from timestamp."""
        return "%H:%M:%S"

    @default('log_format')
    def _log_format_default(self):
        """Override default log format to include time."""
        return ('%(color)s['
                '%(levelname)1.1s %(asctime)s %(name)s'
                ']%(end_color)s '
                '%(message)s')


USER_HELP = 'Do a user install'
SYS_PREFIX_HELP = 'Use the sys.prefix as the prefix'


class BaseContribNbextensionsInstallApp(BaseContribNbextensionsApp):
    """Base jupyter_contrib_nbextensions (un)installer app."""

    aliases = {
        'prefix': 'BaseContribNbextensionsInstallApp.prefix',
        'nbextensions': 'BaseContribNbextensionsInstallApp.nbextensions_dir',
        'config-dir': 'BaseContribNbextensionsInstallApp.config_dir'
    }

    flags = {
        'debug': JupyterApp.flags['debug'],
        'user': ({
            'BaseContribNbextensionsInstallApp': {
                'user': True, 'sys_prefix': False}},
            USER_HELP
        ),
        'system': ({
            'BaseContribNbextensionsInstallApp': {
                'user': False, 'sys_prefix': False}},
            'Do a system-wide install'
        ),
        'sys-prefix': (
            {'BaseContribNbextensionsInstallApp': {
                'user': False, 'sys_prefix': True}},
            SYS_PREFIX_HELP
        ),
        # below flags apply only to nbextensions, not server extensions
        'overwrite': (
            {'BaseContribNbextensionsInstallApp': {'overwrite': True}},
            'Force overwrite of existing nbextension files, '
            'regardless of modification time'
        ),
        'symlink': (
            {'BaseContribNbextensionsInstallApp': {'symlink': True}},
            'Create symlinks for nbextensions instead of copying files'
        ),
    }

    user = Bool(True, config=True, help=USER_HELP)
    sys_prefix = Bool(False, config=True, help=SYS_PREFIX_HELP)

    # settings pertaining to nbextensions installation only
    overwrite = Bool(False, config=True,
                     help='Force overwrite of existing nbextension files')
    symlink = Bool(False, config=True,
                   help='Create symlinks instead of copying nbextension files')
    prefix = Unicode(
        '', config=True,
        help='Installation prefix, currently only used for nbextensions')
    nbextensions_dir = Unicode(
        '', config=True,
        help='Full path to nbextensions dir '
        '(consider instead using, system sys_prefix, prefix or user)')
    config_dir = Unicode(
        '', config=True,
        help='Custom jupyter config directory')

    def parse_command_line(self, argv=None):
        """
        Overriden to check for conflicting flags

        Since notebook version doesn't do it very well
        """
        
        # parse first so the dirs are set
        super(BaseContribNbextensionsInstallApp, self).parse_command_line(argv)
        
        conflicting = [
            ('user', '--user' in argv),
            ('system', '--system' in argv),
            ('sys-prefix', '--sys-prefix' in argv),
            ('prefix', self.prefix),
            ('nbextensions', self.nbextensions_dir),
        ]
        conflicting_set = ['{}={!r}'.format(n, v) for n, v in conflicting if v]

        if len(conflicting_set) > 1:
            raise ArgumentConflict(
                'cannot specify more than one of user, system, sys_prefix, prefix, or nbextensions, but found {}',
                ', '.join(conflicting_set))
        
        # it works with flags, but no idea how to do this for string CLI args with traitlets
        if self.prefix or self.nbextensions_dir:
            self.user = self.sys_prefix = False


BaseContribNbextensionsInstallApp.flags['s'] = (
    BaseContribNbextensionsInstallApp.flags['symlink'])


class InstallContribNbextensionsApp(BaseContribNbextensionsInstallApp):
    """Install all jupyter_contrib_nbextensions."""

    name = 'jupyter contrib nbextension install'
    description = (
        'Install all jupyter_contrib_nbextensions.'
    )

    def start(self):
        """Perform the App's actions as configured."""
        if self.extra_args:
            sys.exit('{} takes no extra arguments'.format(self.name))
        self.log.info('{} {}'.format(self.name, ' '.join(self.argv)))
        return install(
            user=self.user, sys_prefix=self.sys_prefix, prefix=self.prefix,
            nbextensions_dir=self.nbextensions_dir, logger=self.log,
            overwrite=self.overwrite, symlink=self.symlink, config_dir=self.config_dir)


class UninstallContribNbextensionsApp(BaseContribNbextensionsInstallApp):
    """Uninstall all jupyter_contrib_nbextensions."""

    name = 'jupyter contrib nbextension uninstall'
    description = (
        'Uninstall all jupyter_contrib_nbextensions.'
    )

    def start(self):
        """Perform the App's actions as configured."""
        if self.extra_args:
            sys.exit('{} takes no extra arguments'.format(self.name))
        self.log.info('{} {}'.format(self.name, ' '.join(self.argv)))
        return uninstall(
            user=self.user, sys_prefix=self.sys_prefix, prefix=self.prefix,
            nbextensions_dir=self.nbextensions_dir, logger=self.log)


class MigrateContribNbextensionsApp(BaseContribNbextensionsInstallApp):
    """
    Migrate config from an old pre-jupyter_contrib_nbextensions install.

    Neatly edits/removes config keys and/or files from installs of
    ipython-contrib/IPython-notebook-extensions.
    """
    name = 'jupyter contrib nbextension migrate'
    description = ('Uninstall any old pre-jupyter_contrib_nbextensions install'
                   ' by removing old config keys and files.')

    def start(self):
        """Perform the App's actions as configured."""
        self.log.info('{} {}'.format(self.name, ' '.join(self.argv)))
        return migrate(logger=self.log)


class ContribNbextensionsApp(BaseContribNbextensionsApp):
    """Main jupyter_contrib_nbextensions application."""

    name = 'jupyter contrib nbextension'
    description = (
        'Install or uninstall all of jupyter_contrib_nbextensions.'
    )
    examples = '\n'.join(['jupyter contrib nbextension ' + t for t in [
        'install   # {}'.format(install.__doc__),
        'uninstall # {}'.format(uninstall.__doc__),
        'migrate    # {}'.format(migrate.__doc__),
    ]])
    subcommands = dict(
        install=(InstallContribNbextensionsApp, install.__doc__),
        uninstall=(UninstallContribNbextensionsApp, uninstall.__doc__),
        migrate=(MigrateContribNbextensionsApp, migrate.__doc__),
    )

    def start(self):
        """Perform the App's functions as configured."""
        super(ContribNbextensionsApp, self).start()

        # The above should have called a subcommand and raised NoStart; if we
        # get here, it didn't, so we should self.log.info a message.
        subcmds = ', '.join(sorted(self.subcommands))
        sys.exit('Please supply at least one subcommand: {}'.format(subcmds))


def jupyter_contrib_core_app_subcommands():
    """Return dict of subcommands for use by jupyter_contrib_core."""
    subcommands = dict(
        nbextension=(ContribNbextensionsApp,
                     ContribNbextensionsApp.description)
    )
    # alias with an 's' as well as without
    subcommands['nbextensions'] = subcommands['nbextension']
    return subcommands

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------

main = ContribNbextensionsApp.launch_instance

if __name__ == '__main__':
    main()
