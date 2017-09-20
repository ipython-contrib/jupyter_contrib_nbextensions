Installing jupyter_contrib_nbextensions
=======================================

To install the `jupyter_contrib_nbextensions` notebook extensions, three steps
are required. First, the Python pip package needs to be installed. Then, the
notebook extensions themselves need to be copied to the Jupyter data directory.
Finally, the installed notebook extensions can be enabled, either by using
built-in Jupyter commands, or more conveniently by using the
[jupyter_nbextensions_configurator](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator)
server extension, which is installed as a dependency of this repo.

The Python package installation step is necessary to allow painless
installation of the nbextensions together with additional items like nbconvert
templates, pre-/postprocessors, and exporters.


1\. Install the python package
------------------------------


### PIP

All of the nbextensions in this repo are provided as parts of a python package,
which is installable in the usual manner, using `pip` or the `setup.py` script.
To install the current version from PyPi, simply type

    pip install jupyter_contrib_nbextensions

Alternatively, you can install directly from the current master branch of the
repository

    pip install https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tarball/master

All the usual pip options apply, e.g. using pip's `--upgrade` flag to force an
upgrade, or `-e` for an editable install.


### Conda

There are conda packages for the notebook extensions and the
[jupyter_nbextensions_configurator](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator)
available from [conda-forge](https://conda-forge.github.io).
You can install both using

    conda install -c conda-forge jupyter_contrib_nbextensions

This also automatically installs the Javascript and CSS files
(using `jupyter contrib nbextension install --sys-prefix`), so the second
installation step below can therefore be skipped.


### Installation from cloned Repo

You can also install from a cloned repo, which can be useful for development.
You can clone the repo using

    git clone https://github.com/ipython-contrib/jupyter_contrib_nbextensions.git

Then perform an editable pip install using

    pip install -e jupyter_contrib_nbextensions


2\. Install javascript and css files
------------------------------------

This step copies the nbextensions' javascript and css files into the jupyter
server's search directory, and edits some jupyter config files.
A `jupyter` subcommand is provided for the purpose:

    jupyter contrib nbextension install --user

The command does two things: installs nbextension files, and edits nbconvert
config files. The first part is essentially a wrapper around the
notebook-provided `jupyter nbextension install`, and copies relevant javascript
and css files to the appropriate jupyter data directory.
The second part edits the config files `jupyter_nbconvert_config.json`and
`jupyter_notebook_config.json` as noted below in the options.
The command can take most of the same options as the jupyter-provided versions,
including

 * `--user` to install into the user's home jupyter directories
 * `--system` to perform installation into system-wide jupyter directories
 * `--sys-prefix` to install into python's `sys.prefix`, useful for instance in
   virtual environments, such as with conda
 * `--symlink` to symlink the nbextensions rather than copying each file
   (recommended, on non-Windows platforms).
 * `--debug`, for more-verbose output

In addition, two further option flags are provided to perform either only the
config-editing operations, or only the file-copy operations:

 * `--only-files` to install nbextension files without editing any config files
 * `--only-config` to edit the config files without copying/symlinking any
   nbextension files. This edits the following files in the applicable jupyter
   config directory:
    - `jupyter_nbconvert_config.json` to use some of the classes provided
      in the python module `jupyter_contrib_nbextensions.nbconvert_support`
    - `jupyter_notebook_config.json` to enable the serverextension
      `jupyter_nbextensions_configurator`.

Finally, the `--skip-running-check` option flag is provided in order to allow
the installation to proceed even if a notebook server appears to be currently
running (by default, the install will not be performed if a notebook server
appears to be running).

An analogous `uninstall` command is also provided, to remove all of the
nbextension files from the jupyter directories.


3\. Enabling/Disabling extensions
---------------------------------

To use an nbextension, you'll also need to enable it, which tells the notebook
interface to load it. To do this, you can use a Jupyter subcommand:

    jupyter nbextension enable <nbextension require path>

for example,

    jupyter nbextension enable codefolding/main

To disable the extension again, use

    jupyter nbextension disable <nbextension require path>

**Alternatively**, and more conveniently, you can use the
[jupyter_nbextensions_configurator](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator)
server extension, which is installed as a dependency of this repo, and can be
used to enable and disable the individual nbextensions, as well as configure
their options. You can then open the `nbextensions` tab on the tree
(dashboard/file browser) notebook page to configure nbextensions.
You will have access there to a dashboard where extensions can be
enabled/disabled via checkboxes.
Additionally a short documentation for each extension is displayed, and
configuration options are presented.

![jupyter_nbextensions_configurator](https://raw.githubusercontent.com/Jupyter-contrib/jupyter_nbextensions_configurator/master/src/jupyter_nbextensions_configurator/static/nbextensions_configurator/icon.png)


4\. Migrating from older versions of this repo
----------------------------------------------

The `jupyter contrib nbextensions` command also offers a `migrate` subcommand,
which will

 * uninstall the old repository version's files, config and python package
 * adapt all `require` paths which have changed. E.g. if you had the
    collapsible headings nbextension enabled with its old require path of
    `usability/collapsible_headings/main`, the `migrate` command will alter
    this to match the new require path of `collapsible_headings/main`.

For complex or customized installation scenarios, please look at the
documentation for installing notebook extensions, server extensions, nbconvert
pre/postprocessors and templates on the [Jupyter homepage](http://jupyter.org).
More information can also be found in the
[Wiki](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/wiki).

See also [installing Jupyter](http://jupyter.readthedocs.io/en/latest/install.html)
