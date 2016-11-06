Documenting jupyter_contrib_nbextensions
========================================

Documentation for `jupyter_contrib_nbextensions`
is [hosted on ReadTheDocs](https://jupyter_contrib_nbextensions.readthedocs.org/en/latest/).


Building the documentation locally
----------------------------------

The easiest way to build the docs locally is to use the provided tox
environment, `docs`. Essentially this just installs the correct dependencies
into a vitrualenv, and calls `sphinx-build` with the correct arguments.
See the repo's [tox.ini](../tox.ini) for details.

From the repository root:

1. Install tox:

    $ pip install tox

2. Run the tox environment:

    $ tox -e docs

3. Display the documentation locally by navigating to `build/html/index.html`
   in your browser.

   Or alternatively you may run a local server to display the docs.
   In Python 3:

      $ python -m http.server 8000

   Then, in your browser, go to `http://localhost:8000`.


Developing Documentation
------------------------

Helpful files and directories:

 * `source` directory - source files for documentation.
 * [source/conf.py](source/conf.py) - Sphinx build configuration file.
 * [source/autogen_scripts/autogen_nbextensions_list.py](source/autogen_scripts/autogen_nbextensions_list.py) -
   Generates an rst file listing each of the provided nbextensions readmes.

The readme files for each nbextension are incorporated into the documentation
by using pandoc to convert them into rst as part of the parsing step.
This is configured in the Sphinx configuration file (see above).

In order to get the nbextensions' readmes to build in sphinx, they _must_ be
inside the docs `source_dir`.
As a result, we call sphinx-build with the repository root as the `source_dir`,
and specify `docs/source` as the config directory (where sphinx can find
`conf.py`).

On ReadTheDocs, however, we _cannot_ specify a `source_dir` different from the
config directory. As an alternative, we use a symlink to bring the readmes into
the source directory. This would in principle be a better solution altogether,
but symlinks aren't supported on Windows without admin rights, so we have to
use the hack detailed above.
