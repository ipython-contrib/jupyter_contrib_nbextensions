Troubleshooting
===============

If you are migrating from an older version of the contrib notebook extensions
repository, some old files might be left on your system. This can lead, for
example, to having all the nbextensions listed twice on the configurator page.

The nbextensions from older versions will be located in the `nbextensions`
subdirectory in one of the `data` directories that can be found using the
`jupyter --paths` command. If you run your notebook server with the
`--debug` flag, you should also be able to tell where the extra nbextensions
are located from jupyter server logs produced by the
`jupyter_nbextensions_configurator` serverextension.
