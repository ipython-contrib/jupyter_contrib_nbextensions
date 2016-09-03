Notebook extension structure
============================

The nbextensions are stored each as a separate subdirectory of
``src/jupyter_contrib_nbextensions/nbextensions``

Each notebook extension typically has it's own directory containing:

* ``thisextension/main.js``: javascript implementing the extension
* ``thisextension/main.css``: optional CSS
* ``thisextension/readme.md``: readme file describing the extension in markdown format
* ``thisextension/config.yaml``: file describing the extension to the ``jupyter_nbextensions_configurator`` server extension
