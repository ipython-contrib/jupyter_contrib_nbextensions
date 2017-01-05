Jupyter configuration files
===========================

Jupyter configuration is based on the :mod:`traitlets.config` module.
Essentially, each Jupyter application (e.g. :mod:`notebook`, or
:mod:`nbconvert`) has a number of configurable values which:

1. have default values
2. can be altered form their default by values read from configuration files,
   which can be
   a) ``.json`` static files
   b) ``.py`` config python scripts
3. can be overridden by command-line arguments


.. _jupyter-config-path:

Jupyter config path
-------------------

Jupyter applications search for configuration files in each directory in the
*jupyter config path*. This path includes different locations in different
operating systems, but you can use the root jupyter command to find a list of
all jupyter paths, and look for the config section::

    jupyter --paths

There are at least three configuration directories

  1. a per-user directory
  2. a directory in the ``sys.prefix`` directory for the python installation in
     use
  3. a system-wide directory

Note that it is likely that to write to the system-wide config directory will
require elevated (admin) privileges. This may also be true for the sys-prefix
directory, depending on the python installation in use.

Finally, you can also specify a configuration file as a command line argument,
for example::

    jupyter notebook --config=/home/john/mystuff/jupyter_notebook_config.json

Note that this can change which filenames are searched for, as noted below.


.. _jupyter-config-filenames:

Jupyter configuration filenames
-------------------------------

Jupyter applications search the :ref:`jupyter-config-path` for config files
with names derived from the application name, with file extension of either
``.json`` (loaded as json) or ``.py`` (run as a python script).
For example, the ``jupyter notebook`` application searches for config files
called ``jupyter_notebook_config``, while the ``jupyter nbconvert`` application
searches for config files named ``jupyter_nbconvert_config``, with the file
extensions mentioned above.
In addition, all jupyter applications will load config files named
``jupyter_config.json`` or ``jupyter_config.py``.

Specifying a config file on the command line has the additional slightly subtle
effect that it will also change the filename that the application searches for.
For example, if I call the notebook using ::

    jupyter notebook --config=/home/john/mystuff/special_config_ftw.json

then instead of searching the :ref:`jupyter-config-path` for files named
``jupyter_notebook_config``, the notebook application will search the config
path for other files also named ``special_config_ftw``, which can mean that the
normal config files get missed. As a result, it may be preferable to name any
custom config files with the standard filename for the jupyter application they
pertain to.


.. _jupyter-contrib-nbextensions-config-edits:

Config files edited by jupyter_contrib_nbextensions
---------------------------------------------------

The ``jupyter contrib nbextensions install`` command edits some config files as
part of the install:

  * ``jupyter_notebook_config.json`` is edited in order to:
       - enable the
         `jupyter_nbextensions_configurator <https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator>`__.
         serverextension
       - enable the ``contrib_nbextensions_help_item`` nbextension, which adds
         a link to readthedocs to the help menu
  * ``jupyter_nbconvert_config.json`` is edited in order to:
       - edit the nbconvert template path, adding the
         ``jupyter_contrib_nbextensions.nbconvert_support`` templates directory
       - add preprocessors ``CodeFoldingPreprocessor`` and
         ``PyMarkdownPreprocessor`` from the
         ``jupyter_contrib_nbextensions.nbconvert_support`` module
