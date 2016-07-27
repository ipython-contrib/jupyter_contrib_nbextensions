Jupyter notebook extensions
===========================

[![Join the chat at https://gitter.im/ipython-contrib/IPython-notebook-extensions](https://img.shields.io/gitter/room/ipython-contrib/IPython-notebook-extensions.svg?maxAge=3600)](https://gitter.im/ipython-contrib/IPython-notebook-extensions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![GitHub issues](https://img.shields.io/github/issues/ipython-contrib/IPython-notebook-extensions.svg?maxAge=3600)](https://github.com/ipython-contrib/IPython-notebook-extensions/issues)
<br/>
[![Travis-CI Build Status](https://img.shields.io/travis/ipython-contrib/IPython-notebook-extensions.svg?maxAge=3600&label=Travis)](https://travis-ci.org/ipython-contrib/IPython-notebook-extensions) [![Appveyor Build status](https://img.shields.io/appveyor/ci/jcb91/ipython-notebook-extensions-ynb9f.svg?maxAge=3600&label=Appveyor)](https://ci.appveyor.com/project/jcb91/ipython-notebook-extensions-ynb9f) [![Coveralls python test coverage](https://img.shields.io/coveralls/ipython-contrib/IPython-notebook-extensions/master.svg?maxAge=3600&label=Coveralls)](https://coveralls.io/github/ipython-contrib/IPython-notebook-extensions) [![Codecov python test coverage](https://img.shields.io/codecov/c/github/ipython-contrib/IPython-notebook-extensions/master.svg?maxAge=3600&label=Codecov)](https://codecov.io/gh/ipython-contrib/IPython-notebook-extensions)
<br/>
[![GitHub tag](https://img.shields.io/github/tag/ipython-contrib/IPython-notebook-extensions.svg?maxAge=3600)](https://github.com/ipython-contrib/IPython-notebook-extensions) [![Github All Releases](https://img.shields.io/github/downloads/ipython-contrib/IPython-notebook-extensions/total.svg?maxAge=3600)](https://github.com/ipython-contrib/IPython-notebook-extensions) [![PyPI](https://img.shields.io/pypi/v/jupyter_contrib_nbextensions.svg?maxAge=3600)](https://pypi.python.org/pypi/jupyter_contrib_nbextensions) [![PyPI](https://img.shields.io/pypi/dm/jupyter_contrib_nbextensions.svg?maxAge=3600)](https://pypi.python.org/pypi/jupyter_contrib_nbextensions)

This repository contains a collection of extensions that add functionality to the Jupyter notebook.
These extensions are mostly written in Javascript and will be loaded locally in
your browser.

The IPython-contrib repository is maintained independently by a group of users and developers and not officially related
 to the IPython development team.

The maturity of the provided extensions varies, so please
[create an issue](https://github.com/ipython-contrib/IPython-notebook-extensions/issues/new)
at the project's
[github repository](https://github.com/ipython-contrib/IPython-notebook-extensions)
if you encounter any problems.


IPython/Jupyter version support
===============================

| Version     | Description                                                                                    |
|-------------|------------------------------------------------------------------------------------------------|
| IPython 2.x | checkout [2.x branch](https://github.com/ipython-contrib/IPython-notebook-extensions/tree/2.x) |
| IPython 3.x | checkout [3.x branch](https://github.com/ipython-contrib/IPython-notebook-extensions/tree/3.x) |
| Jupyter 4.x | checkout [master branch](https://github.com/ipython-contrib/IPython-notebook-extensions/)      |

There are different branches of the notebook extensions in this repository.
Please make sure you use the branch corresponding to your IPython/Jupyter version.


Documentation
=============

In the 4.x Jupyter repository, all extensions that are maintained and active
have at least a  yaml file to allow them being configured using the
[`jupyter_nbextensions_configurator`](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator)
server extension, which is installed as a dependency of this package.
Most also have a markdown readme file for documentation.
The `jupyter_nbextensions_configurator` server extension shows an nbextensions
tab on the main notebook dashboard (file tree page) from which you can see each
nbextension's markdown readme, and configure its options.
To view documentation without installing, you can browse the nbextensions
directory to read markdown readmes on github at
https://github.com/ipython-contrib/IPython-notebook-extensions/tree/master/src/jupyter_contrib_nbextensions/nbextensions.

For older releases (2.x and 3.x), and for general installation information, look at the [Wiki](https://github.com/ipython-contrib/IPython-notebook-extensions/wiki)

Some extensions are not documented. We encourage you to add documentation for them.


Installation
============

The install process has two steps:

 1. install the python package
 2. install javascript and css files from the python package into jupyter data
    directories, and activate `jupyter_nbextensions_configurator`
 3. (optional, one-time-only) migrate config settings from an old version of
    the ipython-contrib repository

1. install the python package
-----------------------------

All of the nbextensions in this repo are provided as parts of a python package,
which is installable in the usual manner, using `pip` or the `setup.py` script.
You can install directly from the current master branch of the repository

    pip install https://github.com/ipython-contrib/IPython-notebook-extensions/tarball/master

All the usual pip options apply, e.g. using pip's `--upgrade` flag to force an
upgrade, or `-e` for an editable install.

You can also install from a cloned repo, which can be useful for development.
You can clone the repo using

    git clone https://github.com/ipython-contrib/IPython-notebook-extensions.git IPython-notebook-extensions

Then perform an editable pip install using

    pip install -e IPython-notebook-extensions

2. install javascript and css files
-----------------------------------

This step copies the nbextensions javascript and css files into the jupyter
server's search directory. A `jupyter` subcommand is provided which installs
all of the nbextensions files:

    jupyter contrib nbextensions install --user

The command is essentially a wrapper around the notebook-provided
`jupyter nbextension`, and can take most of the same options, such as `--user`
to install into the user's home jupyter directories, `--system` to perform
installation into system-wide jupyter directories, `sys-prefix` to install into
python's `sys.prefix`, useful for instance in virtual environments, and
`--symlink` to symlink the nbextensions rather than copying each file
(recommended). The command also takes care of enabling the
`jupyter_nbextensions_configurator` serverextension, which can be used to
enable and disable the individual extensions, as well as configure their
options.
An analogous `uninstall` command is also provided, to remove all of the
nbextension files from the jupyter directories.


3. migrating from older versions of this repo
---------------------------------------------

The `jupyter contrib nbextensions` command also offers a `migrate` subcommand,
which will

 * uninstall the old repository version's files, config and python package
 * adapt all `require` paths which have changed. E.g. if you had the
    collapsible headings nbextension enabled with its old require path of
    `usability/collapsible_headings/main`, the `migrate` command will alter
    this to match the new require path of `collapsible_headings/main`.

For complex or customized installation scenarios, please look at the
documentation for installing notebook extensions, server extensions, nbconvert
pre/postprocessors and templates on the Jupyter homepage http://www.jupyter.org.
More information can also be found in the
[Wiki](https://github.com/ipython-contrib/IPython-notebook-extensions/wiki).


Notebook extension structure
============================

The nbextensions are stored each as a separate subdirectory of `src/jup Each notebook extension typically has it's own directory containing:
 * `thisextension/main.js` - javascript implementing the extension
 * `thisextension/main.css` - optional CSS
 * `thisextension/readme.md` - readme file describing the extension in markdown format
 * `thisextension/config.yaml` - file describing the extension to the `jupyter_nbextensions_configurator` server extension

