Jupyter notebook extensions
===========================

.. image:: https://badges.gitter.im/jcb91/IPython-notebook-extensions.svg
    :alt: Join the chat at https://gitter.im/jcb91/IPython-notebook-extensions
    :target: https://gitter.im/jcb91/IPython-notebook-extensions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge

.. image:: https://img.shields.io/travis/jcb91/IPython-notebook-extensions.svg?maxAge=3600&label=Travis%20build
    :alt: Travis-CI Build Status
    :target: https://travis-ci.org/jcb91/IPython-notebook-extensions

.. image:: https://img.shields.io/appveyor/ci/jcb91/Ipython-notebook-extensions.svg?maxAge=3600&label=Windows%20build
    :alt: Appveyor Build status
    :target: https://ci.appveyor.com/project/jcb91/ipython-notebook-extensions

.. image:: https://img.shields.io/coveralls/jcb91/IPython-notebook-extensions/trav.svg?maxAge=3600&label=Coveralls%20coverage
    :alt: Coveralls python test coverage
    :target: https://coveralls.io/github/jcb91/IPython-notebook-extensions?branch=trav

.. image:: https://img.shields.io/codecov/c/github/jcb91/IPython-notebook-extensions/trav.svg?maxAge=3600&label=Codecov%20coverage
    :alt: Codecov python test coverage
    :target: https://codecov.io/gh/jcb91/IPython-notebook-extensions

This repository contains a collection of extensions that add functionality to
the Jupyter notebook. These extensions are mostly written in Javascript and
will be loaded locally in your browser, though there are also some python parts
providing jupyter server extensions and nbconvert pre- and post-processors.

The IPython-contrib repository is maintained independently by a group of users
and developers and not officially related to the IPython development team.

The maturity of the provided extensions varies, so please check the repository
`issues`_ if you encounter any problems, or `create a new issue`_ if you can't
find what you're looking for!

.. _issues:
  https://github.com/jcb91/IPython-notebook-extensions/issues

.. _create a new issue:
  https://github.com/jcb91/IPython-notebook-extensions/issues/new


Documentation
=============

All extensions that are maintained and active should have a markdown (``.md``)
readme file for documentation, and a yaml file to allow them being configured
using the 'nbextensions_configurator' server extension.

.. figure:: src/themysto/nbextensions_configurator/static/nbextensions_configurator/icon.png
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

.. _wiki:
  https://github.com/jcb91/IPython-notebook-extensions/wiki

Some extensions are not documented. We encourage you to add documentation for
them!


Version support
===============

This repository mainly caters to Jupyter, following the `Big Split`_ of the
IPython codebase.

.. _Big Split:
  https://blog.jupyter.org/2015/04/15/the-big-split

In the `master branch`_, we aim to support all notebook minor release versions
(4.0, 4.1, 4.2 etc.). Since the notebook javascript API can change from one
release to another, and since some nbextensions can use parts which are not
considered part of the public notebook API, changes to the notebook codebase
can break nbextensions without warning on notebook upgrades, so again, check
the `issues`_ if you encounter problems.

There are also repository branches for older IPython versions, although these
are much less frequently updated. If you need an older version, you can try the
`3.x branch`_ for IPython/notebook 3.x, or the `2.x branch`_ for
IPython/notebook 2.x.

.. _2.x branch:
  https://github.com/ipython-contrib/IPython-notebook-extensions/tree/2.x
.. _3.x branch:
  https://github.com/ipython-contrib/IPython-notebook-extensions/tree/3.x
.. _master branch:
  https://github.com/ipython-contrib/IPython-notebook-extensions

There are different branches of the notebook extensions in this repository.
Please make sure you use the branch corresponding to your IPython/Jupyter
version.

Our continuous integration testing covers python 2.7, 3.3 through 3.5, as well
as pypy.


Installation
============

TL;DR: ``pip install themysto && themysto install``


To install the extensions, you first need to install the python package, and
then use the python package's install command to install the various extensions
and the like to the appropriate jupyter directories.

python package installation
---------------------------

It is possible to install the the python package, from the current repository
master, using

::

    pip install https://github.com/jcb91/IPython-notebook-extensions/archive/master.zip

with the usual pip flags such as ``-v`` for verbose, ``--upgrade`` to upgrade,
etc.


Alternatively, the package can be installed from a cloned repository. You can
clone the repo using

::

    git clone https://github.com/ipython-contrib/IPython-notebook-extensions.git

Then running ``pip install .`` in the newly-created directory. This can be
useful to create editable installs, for development purposes, using pip's
``-e`` flag.

extension installation
----------------------

Once you have installed the python package, you can use it to install all of
the jupyter server extensions, nbextensions, templates and processors using the
provided command-line script:

::

    themysto install

The install command takes some options which can be used to set where the
extensions are installed: use

* ``--user`` to install into the user's jupyter directories (default location)
* ``--system`` to install into the system-wide jupyter directories
* ``--sys-prefix`` to respect system environment variables, used for
  installing into the jupyter directories of a virtual environment

After the package's extensions have been installed, and the jupyter server
(re)started, simply go to the ``/nbextensions`` page in the notebook, as noted
above, to activate/deactivate and configure your notebook extensions.

For more complex installation scenarios, please look up the documentation for
installing notebook extensions, server extensions, pre/postprocessors, and
templates at the `Jupyter homepage`_

.. _Jupyter homepage:
  http://www.jupyter.org


Notebook extension structure
============================

Each notebook extension has its own directory in the nbextensions folder of the
package, typically containing:

* ``thisnbextension/main.js`` - javascript file implementing the extension,
  which is loaded using `requirejs`_.
* ``thisextension/config.yaml`` - yaml file describing the extension to the
  ``themysto.nbextensions_configurator`` server extension and its parameters.
  This should be in the same directory as the main javascript file.
* ``thisnbextension/readme.md`` - `markdown`_ readme file describing the
  extension any parameters it might have.
* ``thisnbextension/main.css`` - optional CSS, loaded by ``main.js``

.. _requirejs:
  https://requirejs.org
.. _markdown:
  https://en.wikipedia.org/wiki/Markdown
