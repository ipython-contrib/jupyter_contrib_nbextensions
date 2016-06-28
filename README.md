Jupyter notebook extensions
===========================

[![Join the chat at https://gitter.im/ipython-contrib/IPython-notebook-extensions](https://img.shields.io/gitter/room/ipython-contrib/IPython-notebook-extensions.svg?maxAge=3600)](https://gitter.im/ipython-contrib/IPython-notebook-extensions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This repository contains a collection of extensions that add functionality to the Jupyter notebook.
These extensions are mostly written in Javascript and will be loaded locally in your Browser.

The IPython-contrib repository is maintained independently by a group of users and developers and not officially related
 to the IPython development team.

The maturity of the provided extensions may vary, please create an issue if you encounter any problems.


IPython/Jupyter version support
===============================

| Version     | Description                                                                                    |
|-------------|------------------------------------------------------------------------------------------------|
| IPython 1.x | not supported                                                                                  |
| IPython 2.x | [checkout 2.x branch](https://github.com/ipython-contrib/IPython-notebook-extensions/tree/2.x) |
| IPython 3.x | [checkout 3.x branch](https://github.com/ipython-contrib/IPython-notebook-extensions/tree/3.x) |
| Jupyter 4.x | [checkout master branch](https://github.com/ipython-contrib/IPython-notebook-extensions/)      |

There are different branches of the notebook extensions in this repository.
Please make sure you use the branch corresponding to your IPython/Jupyter version.


Documentation
=============

In the 4.x Jupyter repository, all extensions that are maintained and active have a markdown readme file for
documentation and a yaml file to allow them being configured using the
[`jupyter_nbextensions_configurator`](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator)
server extension.

![Extensions](https://raw.githubusercontent.com/Jupyter-contrib/jupyter_nbextensions_configurator/master/src/jupyter_nbextensions_configurator/static/nbextensions_configurator/icon.png)

For older releases (2.x and 3.x), and for general installation information, look at the [Wiki](https://github.com/ipython-contrib/IPython-notebook-extensions/wiki)

Some extensions are not documented. We encourage you to add documentation for them.


Installation
============

For most installs, the `pip`-based command works for most people.

For complex installation scenarios, please look at the documentation for
installing notebook extensions, server extensions, pre/postprocessors, and
templates at the Jupyter homepage http://www.jupyter.org.
More information can also be found in the
[Wiki](https://github.com/ipython-contrib/IPython-notebook-extensions/wiki).


pip-install
-----------

As an experimental feature, it is now possible to install the collection of
Jupyter extensions using pip, from the current repository master branch:

    pip install https://github.com/ipython-contrib/IPython-notebook-extensions/tarball/master

**Important:** the pip installation runs the repository's `install.py` script.
For details on what that does, and on installation to non-default locations,
see the [install.py](#installpy) section below.

Use pip's `--upgrade` flag to upgrade.

After installation, simply go to the `/nbextensions/` page in the notebook to activate/deactivate  your notebook extensions.

Since this installation procedure is still experimental, please make an issue if needed.


install from a cloned repo
--------------------------

You can clone the repo using

    git clone https://github.com/ipython-contrib/IPython-notebook-extensions.git

Then, simply run `setup.py install`.

**Important:** this procedure also runs the repository's `install.py` script.
For details on what that does, and on installation to non-default locations,
see the [install.py](#installpy) section below.

This procedure also runs the repository's `install.py` script, so see [that
section](#installpy) for details.

After installation, simply go to the `/nbextensions/` page in the notebook to activate/deactivate  your notebook extensions.


install.py
----------

This is the installation script that installs the notebook extensions. It will

 1. Find jupyter configuration and data directories. The uses the jupyter
    directories inside the installing user's home directory. To override this
    behavior, for example to perform an install into system jupyter directories
    or a specific location, you can set the environment variables
    `JUPYTER_DATA_DIR` to the desired install location, and/or
    `JUPYTER_CONFIG_DIR` to the desired configuration directory.

    On unix-based systems with bash (e.g. in Linux/OSX), this can be done using
    for example

        JUPYTER_DATA_DIR=/usr/share/jupyter JUPYTER_CONFIG_DIR=/etc/jupyter pip install https://github.com/ipython-contrib/IPython-notebook-extensions/tarball/master

    Alternatively, to perform an installation into the system-wide jupyter
    directories, we can use the following python snippet:

    ```python
    import os
    import pip
    from jupyter_core.paths import SYSTEM_CONFIG_PATH, SYSTEM_JUPYTER_PATH
    os.environ['JUPYTER_CONFIG_DIR'] = SYSTEM_CONFIG_PATH[0]
    os.environ['JUPYTER_DATA_DIR'] = SYSTEM_JUPYTER_PATH[0]
    pip.main(['install', 'https://github.com/ipython-contrib/IPython-notebook-extensions/tarball/master'])
    ```

    which should also work on Windows.

 2. Install files into the local data directory found in step 1. from the
    following repository directories:

     * extensions - Python files like server extensions, pre- and postprocessors
     * nbextensions - notebook extensions, typically each extension has its own directory
     * templates - jinja and html templates used by the extensions

 3. Create/update nbconvert configuration files (`.py` and `.json`) in the
    configuration directory found in step 1 to load custom templates and
    pre-/postprocessors

 4. Create/update notebook configuration files (`.py` and `.json`) in the
    configuration directory found in step 1 to load server extensions, custom
    templates and pre-/postprocessors

**Important**: The installation script will overwrite files without asking.
It will not delete files that do not belong to the repository.
It will also make backups of any Jupyter configuration files which it edits,
and should preserve existing configuration in any edited files.


Notebook extension structure
============================

Each notebook extension typically has it's own directory containing:
 * thisextension/main.js - javascript implementing the extension
 * thisextension/main.css - optional CSS
 * thisextension/readme.md- readme file describing the extension in markdown format
 * thisextension/config.yaml - file describing the extension to the nbconfig server extension

