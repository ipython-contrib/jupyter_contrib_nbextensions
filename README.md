Jupyter notebook extensions master branch
===========================
This repository contains a collection of extensions that add functionality to the Jupyter notebook.
These extensions are mostly written in Javascript and will be loaded locally in your Browser.

The IPython-contrib repository is maintained independently by a group of users and developers and not officially related to the IPython development team.

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
Some extensions are not documented. We encourage you to add documentation for them.

All extensions that are maintained and active have a markdown readme file for documentation and a yaml file to
 allow them being configured using the 'nbextensions' server extension.
 
Installation
============

The simple case: You want to install the extensions as local user. Then, simply run `setup.py` or build
a conda package by running `conda build`, and then do a `conda install nbextensions`.

For more complex installation scenarios, please look up the documentation at the Jupyter homepage http://www.jupyter.org


