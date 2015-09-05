Jupyter notebook extensions
===========================
This repository contains a collection of extensions that add functionality to the Jupyter notebook.
These extensions are mostly written in Javascript and will be loaded locally in your Browser.

The IPython-contrib repository is maintained independently by a group of users and developers and not officially related
 to the IPython development team.

The maturity of the provided extensions may vary, please create an issue if you encounter any problems.

IPython/Jupyter version support
=======================

| Version | Description |
|--------|-------------|
| IPython 1.x    | not supported |
| IPython 2.x    | checkout 2.x branch |
| IPython 3.x    | checkout 3.x branch |
| Jupyter 4.x | checkout master branch |

There are different branches of the notebook extensions in this repository.
Please make sure you use the branch corresponding to your IPython/Jupyter version.

Documentation
=============
In the 4.x Jupyter repository, all extensions that are maintained and active have a markdown readme file for 
documentation and a yaml file to allow them being configured using the 'nbextensions' server extension.

For older releases (2.x und 3.x) and general installation information, look at the [Wiki](https://github.com/ipython-contrib/IPython-notebook-extensions/wiki)

Some extensions are not documented. We encourage you to add documentation for them.

 
Installation
============

The simple case: You want to install the extensions as local user. Then, simply run `setup.py install` or install
the conda package. The conda package can be built by running `conda build IPython-notebook-extensions` in the parent
directory, and then doing a `conda install nbextensions`.

For more complex installation scenarios, please look up the documentation for installing notebook extensions, 
server extensions, pre/postprocessors, and templates at the Jupyter homepage http://www.jupyter.org

More details can be found in the [Wiki](https://github.com/ipython-contrib/IPython-notebook-extensions/wiki/Home_Jupyter)
