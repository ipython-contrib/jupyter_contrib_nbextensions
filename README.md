Jupyter notebook extensions
===========================

[![Join the chat at https://gitter.im/ipython-contrib/jupyter_contrib_nbextensions](https://img.shields.io/gitter/room/ipython-contrib/jupyter_contrib_nbextensions.svg?maxAge=3600)](https://gitter.im/ipython-contrib/jupyter_contrib_nbextensions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![GitHub issues](https://img.shields.io/github/issues/ipython-contrib/jupyter_contrib_nbextensions.svg?maxAge=3600)](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues)
<br/>
[![Travis-CI Build Status](https://img.shields.io/travis/ipython-contrib/jupyter_contrib_nbextensions.svg?maxAge=3600&label=Travis)](https://travis-ci.org/ipython-contrib/jupyter_contrib_nbextensions) [![Appveyor Build status](https://img.shields.io/appveyor/ci/jcb91/ipython-notebook-extensions-ynb9f.svg?maxAge=3600&label=Appveyor)](https://ci.appveyor.com/project/jcb91/ipython-notebook-extensions-ynb9f) [![Coveralls python test coverage](https://img.shields.io/coveralls/ipython-contrib/jupyter_contrib_nbextensions/master.svg?maxAge=3600&label=Coveralls)](https://coveralls.io/github/ipython-contrib/jupyter_contrib_nbextensions) [![Codecov python test coverage](https://img.shields.io/codecov/c/github/ipython-contrib/jupyter_contrib_nbextensions/master.svg?maxAge=3600&label=Codecov)](https://codecov.io/gh/ipython-contrib/jupyter_contrib_nbextensions)
<br/>
[![GitHub tag](https://img.shields.io/github/tag/ipython-contrib/jupyter_contrib_nbextensions.svg?maxAge=3600)](https://github.com/ipython-contrib/jupyter_contrib_nbextensions) [![Github All Releases](https://img.shields.io/github/downloads/ipython-contrib/jupyter_contrib_nbextensions/total.svg?maxAge=3600)](https://github.com/ipython-contrib/jupyter_contrib_nbextensions) [![PyPI](https://img.shields.io/pypi/v/jupyter_contrib_nbextensions.svg?maxAge=3600)](https://pypi.python.org/pypi/jupyter_contrib_nbextensions) [![PyPI](https://img.shields.io/pypi/dm/jupyter_contrib_nbextensions.svg?maxAge=3600)](https://pypi.python.org/pypi/jupyter_contrib_nbextensions)

This repository contains a collection of extensions that add functionality to the Jupyter notebook.
These extensions are mostly written in Javascript and will be loaded locally in
your browser.

The IPython-contrib repository is maintained independently by a group of users and developers and not officially related
 to the IPython development team.

The maturity of the provided extensions varies, so please
[create an issue](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/new)
at the project's
[github repository](https://github.com/ipython-contrib/jupyter_contrib_nbextensions)
if you encounter any problems.


IPython/Jupyter version support
===============================

| Version     | Description                                                                                    |
|-------------|------------------------------------------------------------------------------------------------|
| IPython 2.x | checkout [2.x branch](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/2.x) |
| IPython 3.x | checkout [3.x branch](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/3.x) |
| Jupyter 4.x | checkout [master branch](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/)      |

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
https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/master/src/jupyter_contrib_nbextensions/nbextensions.

For older releases (2.x and 3.x), look at the [Wiki](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/wiki)

Some extensions are not documented. We encourage you to add documentation for them.


Installation
============

To install notebook extensions, three steps are required. First, this Python package needs to be installed.
Then, the notebook extensions themselves can be copied to the Jupyter data directory.
Finally, the installed notebook extensions can be enabled, either by using built-in Jupyter commands,
or more convenient by using the jupyter_nbextensions_configurator server extension.

The Python package installation step is necessary to allow painless installation of the extensions togther with
additional items like nbconvert templates, pre-/postprocessors, and exporters.


1. Install the python package
-----------------------------

All of the nbextensions in this repo are provided as parts of a python package,
which is installable in the usual manner, using `pip` or the `setup.py` script.
You can install directly from the current master branch of the repository

    pip install https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tarball/master

All the usual pip options apply, e.g. using pip's `--upgrade` flag to force an
upgrade, or `-e` for an editable install.

You can also install from a cloned repo, which can be useful for development.
You can clone the repo using

    git clone https://github.com/ipython-contrib/jupyter_contrib_nbextensions.git jupyter_contrib_nbextensions

Then perform an editable pip install using

    pip install -e jupyter_contrib_nbextensions


2. Install javascript and css files
-----------------------------------

This step copies the nbextensions javascript and css files into the jupyter
server's search directory. A `jupyter` subcommand is provided which installs
all of the nbextensions files:

    jupyter contrib nbextension install --user

The command is essentially a wrapper around the notebook-provided
`jupyter nbextension`, and can take most of the same options, such as `--user`
to install into the user's home jupyter directories, `--system` to perform
installation into system-wide jupyter directories, `sys-prefix` to install into
python's `sys.prefix`, useful for instance in virtual environments, and
`--symlink` to symlink the nbextensions rather than copying each file
(recommended).

An analogous `uninstall` command is also provided, to remove all of the
nbextension files from the jupyter directories.


3. Enabling/Disabling extensions
--------------------------------

To use an nbextension, you’ll also need to enable it, which tells the notebook
interface to load it. To do this, you can use a Jupyter subcommand:

    jupyter nbextension enable <nbextension>

for example,

    jupyter nbextension enable codefolding/main

To disable the extension again, use

    jupyter nbextension disable <nbextension>

Alternatively, and more conveniently, you can use the
[`jupyter_nbextensions_configurator`](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator)
server extension, which is installed as a dependency of this repo, and can be
used to enable and disable the individual nbextensions, as well as configure
their options.


4. Migrating from older versions of this repo
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
[Wiki](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/wiki).


Notebook extension structure
============================

The nbextensions are stored each as a separate subdirectory of `src/jupyter_contrib_nbextensions/nbextensions`
Each notebook extension typically has it's own directory containing:
 * `thisextension/main.js` - javascript implementing the extension
 * `thisextension/main.css` - optional CSS
 * `thisextension/readme.md` - readme file describing the extension in markdown format
 * `thisextension/config.yaml` - file describing the extension to the `jupyter_nbextensions_configurator` server extension

