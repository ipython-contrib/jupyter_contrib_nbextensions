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

    aliases = {}
    aliases.update(JupyterApp.aliases)
    aliases.pop('config')

    _log_formatter_cls = LogFormatter

    def _log_format_default(self):
        """A default format for messages."""
        return '%(message)s'



class ThemystoConfigModifyApp(BaseThemystoApp):
    """Base class for apps modifying config files."""

    aliases = {}
    aliases.update(BaseThemystoApp.aliases)
    aliases.update({
        'config-dir': 'ThemystoConfigModifyApp.config_dir',
    })
    flags = {
        'debug': JupyterApp.flags['debug'],
        'user': (
            {'ThemystoConfigModifyApp': {'user': True}},
            'Perform the operation for the current user'
        ),
        'system': (
            {'ThemystoConfigModifyApp': {'user': False, 'sys_prefix': False}},
            'Perform the operation system-wide'
        ),
        'sys-prefix': (
            {'ThemystoConfigModifyApp': {'sys_prefix': True}},
            'Use sys.prefix as the prefix for configuration files'
        ),
    }
    user = Bool(True, config=True, help='Whether to do a user install')
    sys_prefix = Bool(False, config=True, help='Use sys.prefix as the prefix')
    config_dir = Unicode('', config=True, help='Full path to config directory')


class InstallThemystoApp(ThemystoConfigModifyApp):
    """Install all themysto nbextensions and server extensions."""

    name = 'themysto install'
    description = 'Install all themysto nbextensions and server extensions.'

    def start(self):
        """Perform the App's actions as configured."""
        return install(user=self.user, sys_prefix=self.sys_prefix,
                       config_dir=self.config_dir, logger=self.log)


class UninstallThemystoApp(ThemystoConfigModifyApp):
    """Uninstall all themysto nbextensions and server extensions."""

    name = 'themysto uninstall'
    description = 'Uninstall all themysto nbextensions and server extensions.'

    def start(self):
        """Perform the App's actions as configured."""
        return uninstall(user=self.user, sys_prefix=self.sys_prefix,
                         config_dir=self.config_dir, logger=self.log)


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
    flags = {}
    flags.update(JupyterApp.flags)
    flags.pop('generate-config')

    def start(self):
        """Perform the App's actions as configured."""
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
