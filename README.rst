Jupyter notebook extensions
===========================

.. image:: https://travis-ci.org/jcb91/IPython-notebook-extensions.svg?branch=master
    :alt: Travis-CI Build Status
    :target: https://travis-ci.org/jcb91/IPython-notebook-extensions

This repository contains a collection of extensions that add functionality to
the Jupyter notebook. These extensions are mostly written in Javascript and
will be loaded locally in your browser.

The IPython-contrib repository is maintained independently by a group of users
and developers and not officially related to the IPython development team.

The maturity of the provided extensions may vary, please `create an issue`_ if
you encounter any problems.

.. _create an issue:
  https://github.com/ipython-contrib/IPython-notebook-extensions/issues/new


IPython/Jupyter version support
===============================

+---------------+-------------------------------------------------------------+
| Version       | Description                                                 |
+===============+=============================================================+
| IPython 1.x   | not supported                                               |
+---------------+-------------------------------------------------------------+
| IPython 2.x   | checkout `2.x branch`_                                      |
+---------------+-------------------------------------------------------------+
| IPython 3.x   | checkout `3.x branch`_                                      |
+---------------+-------------------------------------------------------------+
| Jupyter 4.x   | checkout `master branch`_                                   |
+---------------+-------------------------------------------------------------+

.. _2.x branch:
  https://github.com/ipython-contrib/IPython-notebook-extensions/tree/2.x
.. _3.x branch:
  https://github.com/ipython-contrib/IPython-notebook-extensions/tree/3.x
.. _master branch:
  https://github.com/ipython-contrib/IPython-notebook-extensions

There are different branches of the notebook extensions in this repository.
Please make sure you use the branch corresponding to your IPython/Jupyter
version.


Documentation
=============

In the 4.x Jupyter branch, all extensions that are maintained and active have a
markdown readme file for documentation and a yaml file to allow them being
configured using the 'nbextensions' server extension.

.. figure:: src/themysto/nbextensions_configurator/static/icon.png
   :alt: nbxtensions config page

The configuration page provided by the server extension can be found for
default jupyter installations at the ``/nbextensions`` url. If you have a
non-default base url (such as with JupyterHub), you'll need to prepend it to
the url. So, if your dashboard is at

::

    http://localhost:8888/custom/base/url/tree

then you'll find the nbextensions configuration page at

::

    http://localhost:8888/custom/base/url/nbextensions

For older releases (2.x and 3.x), and for general installation information,
look at the wiki_.

Some extensions are not documented. We encourage you to add documentation for
them!


Installation
============


pip-install
-----------

As an experimental feature, it is now possible to install the collection of
notebook extensions using pip, from the current repository master, using

::

    pip install https://github.com/ipython-contrib/IPython-notebook-extensions/archive/master.zip --user

-  verbose mode can be enabled with ``-v`` switch,  e.g. ``pip -v install ...``
-  upgrade with ``--upgrade``.
-  A system install can be done by omitting the ``--user`` switch.

After installation, simply go to the ``/nbextensions`` page in the notebook to
activate/deactivate your notebook extensions.

This uses the `setup.py`_ script below, so read the warnings there.
Since this installation procedure is still experimental, please
`create an issue`_ if needed.


install from a cloned repo
--------------------------

You can clone the repo by

::

    git clone https://github.com/ipython-contrib/IPython-notebook-extensions.git

Then, if you want to install the extensions as local user, simply run
``setup.py install``. This uses the `setup.py`_ script below, so read the
warnings there.

After installation, simply go to the ``/nbextensions`` page in the notebook, as
noted above, to activate/deactivate and configure your notebook extensions.

For more complex installation scenarios, please look up the documentation for
installing notebook extensions, server extensions, pre/postprocessors, and
templates at the `Jupyter homepage`_

.. _Jupyter homepage:
  http://www.jupyter.org

More information can also be found in the wiki_.

.. _wiki:
  https://github.com/ipython-contrib/IPython-notebook-extensions/wiki


setup.py
--------

The ``setup.py`` script in the root of the repository is used to install the
notebook extensions for your local user. It will (via other scripts):

1. find your local jupyter configuration directory
2. copy into it files from the following directories:

   * ``extensions`` - Python files like server extensions, pre and
     postprocessors
   * ``nbextensions`` - notebook extensions, typically each extension has its
     own directory
   * ``templates`` - jinja and html templates used by the extensions

3. update notebook configuration (.py and .json) to load server extensions and
   custom templates
4. update nbconvert configuration (.py and .json) to load custom templates and
   pre/postprocessors

**Important**: The installation script will overwrite files *without asking*.
It will not delete files that do not belong to the repository. It will also not
delete your Jupyter configuration.


Notebook extension structure
============================

Each notebook extension has it's own directory, typically containing:

* ``thisextension/main.js`` - javascript implementing the extension
* ``thisextension/main.css`` - optional CSS
* ``thisextension/readme.md`` - readme file describing the extension in
  markdown format
* ``thisextension/config.yaml`` - yaml file describing the extension to the
  ``nbextensions.py`` server extension
