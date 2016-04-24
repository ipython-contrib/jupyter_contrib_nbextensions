# -*- coding: utf-8 -*-
"""API to install/remove all themysto nbextensions and server extensions."""

from __future__ import print_function

import sys

from jupyter_core.application import JupyterApp
from tornado.log import LogFormatter
from traitlets import Bool, Unicode

import themysto
from themysto.install import install, uninstall

# ----------------------------------------------------------------------------
# Applications
# ----------------------------------------------------------------------------


class BaseThemystoApp(JupyterApp):
    """Base class for themysto apps."""
    version = themysto.__version__

    _log_formatter_cls = LogFormatter

    def _log_format_default(self):
        """A default format for messages."""
        return '%(message)s'


class BaseThemystoInstallApp(BaseThemystoApp):
    """Base themysto installer app."""

    aliases = {
        'prefix': 'BaseThemystoInstallApp.prefix',
        'nbextensions': 'BaseThemystoInstallApp.nbextensions_dir',
    }
    flags = {
        'debug': JupyterApp.flags['debug'],
        'user': ({
            'BaseThemystoInstallApp': {'user': True}},
            'Perform the operation for the current user'
        ),
        'system': ({
            'BaseThemystoInstallApp': {'user': False, 'sys_prefix': False}},
            'Perform the operation system-wide'
        ),
        'sys-prefix': (
            {'BaseThemystoInstallApp': {'sys_prefix': True}},
            'Use sys.prefix as the prefix for installing server extensions'
        ),
        # below flags apply only to nbextensions, not server extensions
        'overwrite': (
            {'BaseThemystoInstallApp': {'overwrite': True}},
            'Force overwrite of existing nbextension files, '
            'regardless of modification time'
        ),
        'symlink': (
            {'BaseThemystoInstallApp': {'symlink': True}},
            'Create symlinks for nbextensions instead of copying files'
        ),
    }

    user = Bool(True, config=True, help='Whether to do a user install')
    sys_prefix = Bool(False, config=True,
                      help='Use the sys.prefix as the prefix')
    config_dir = Unicode(
        '', config=True, help='Full path to config dir to use.')

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
        '(consider instead using sys_prefix, prefix or user)')


class InstallThemystoApp(BaseThemystoInstallApp):
    """Install all themysto nbextensions and server extensions."""

    name = 'themysto install'
    description = 'Install all themysto nbextensions and server extensions.'

    def start(self):
        """Perform the App's actions as configured."""
        return install(
            user=self.user, sys_prefix=self.sys_prefix,
            overwrite=self.overwrite, symlink=self.symlink, prefix=self.prefix,
            nbextensions_dir=self.nbextensions_dir, logger=self.log)


class UninstallThemystoApp(BaseThemystoInstallApp):
    """Uninstall all themysto nbextensions and server extensions."""

    name = 'themysto uninstall'
    description = 'Uninstall all themysto nbextensions and server extensions.'

    def start(self):
        """Perform the App's actions as configured."""
        return uninstall(
            user=self.user, sys_prefix=self.sys_prefix,
            prefix=self.prefix, nbextensions_dir=self.nbextensions_dir,
            logger=self.log)


class ThemystoApp(BaseThemystoApp):
    """Themysto main application."""

    name = 'themysto'
    description = (
        'Install or uninstall all themysto nbextensions and server extensions.'
    )
    examples = '\n'.join([
        'themysto install   # {}'.format(install.__doc__),
        'themysto uninstall # {}'.format(uninstall.__doc__),
    ])
    subcommands = dict(
        install=(InstallThemystoApp, install.__doc__),
        uninstall=(UninstallThemystoApp, uninstall.__doc__),
    )

    def start(self):
        """Perform the App's functions as configured."""
        super(ThemystoApp, self).start()

        # The above should have called a subcommand and raised NoStart; if we
        # get here, it didn't, so we should self.log.info a message.
        subcmds = ', '.join(sorted(self.subcommands))
        sys.exit('Please supply at least one subcommand: {}'.format(subcmds))


# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------

main = ThemystoApp.launch_instance

if __name__ == '__main__':
    main()
