Jupyter notebook extensions
===========================

[![Join the chat at https://gitter.im/ipython-contrib/jupyter_contrib_nbextensions](https://img.shields.io/gitter/room/ipython-contrib/jupyter_contrib_nbextensions.svg?maxAge=3600)](https://gitter.im/ipython-contrib/jupyter_contrib_nbextensions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Documentation Status](https://readthedocs.org/projects/jupyter-contrib-nbextensions/badge/?version=latest)](http://jupyter-contrib-nbextensions.readthedocs.io/en/latest/)
[![Documentation Status](https://readthedocs.org/projects/jupyter-contrib-nbextensions/badge/?version=stable)](http://jupyter-contrib-nbextensions.readthedocs.io/en/stable/)
[![GitHub issues](https://img.shields.io/github/issues/ipython-contrib/jupyter_contrib_nbextensions.svg?maxAge=3600)](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues)
<br/>
[![Travis-CI Build Status](https://img.shields.io/travis/ipython-contrib/jupyter_contrib_nbextensions.svg?maxAge=3600&label=Travis)](https://travis-ci.org/ipython-contrib/jupyter_contrib_nbextensions)
[![Appveyor Build status](https://img.shields.io/appveyor/ci/jcb91/ipython-notebook-extensions-ynb9f.svg?maxAge=3600&label=Appveyor)](https://ci.appveyor.com/project/jcb91/ipython-notebook-extensions-ynb9f)
[![Coveralls python test coverage](https://img.shields.io/coveralls/ipython-contrib/jupyter_contrib_nbextensions/master.svg?maxAge=3600&label=Coveralls)](https://coveralls.io/github/ipython-contrib/jupyter_contrib_nbextensions)
[![Codecov python test coverage](https://img.shields.io/codecov/c/github/ipython-contrib/jupyter_contrib_nbextensions/master.svg?maxAge=3600&label=Codecov)](https://codecov.io/gh/ipython-contrib/jupyter_contrib_nbextensions)
<br/>
[![GitHub tag](https://img.shields.io/github/tag/ipython-contrib/jupyter_contrib_nbextensions.svg?maxAge=3600&label=Github)](https://github.com/ipython-contrib/jupyter_contrib_nbextensions)
[![PyPI](https://img.shields.io/pypi/v/jupyter_contrib_nbextensions.svg?maxAge=3600)](https://pypi.python.org/pypi/jupyter_contrib_nbextensions)
[![Anaconda cloud](https://anaconda.org/conda-forge/jupyter_contrib_nbextensions/badges/version.svg)](https://anaconda.org/conda-forge/jupyter_contrib_nbextensions)

This repository contains a collection of extensions that add functionality to
the Jupyter notebook.
These extensions are mostly written in Javascript and will be loaded locally in
your browser.

The IPython-contrib repository is maintained independently by a group of users
and developers and not officially related to the IPython development team.

The maturity of the provided extensions varies, so please
[create an issue](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/new)
at the project's
[github repository](https://github.com/ipython-contrib/jupyter_contrib_nbextensions)
if you encounter any problems.


IPython/Jupyter version support
===============================

| Version     | Description                                                                                     |
|-------------|-------------------------------------------------------------------------------------------------|
| IPython 2.x | checkout [2.x branch](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/2.x) |
| IPython 3.x | checkout [3.x branch](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/3.x) |
| Jupyter 4.x | checkout [master branch](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/)      |

There are different branches of the notebook extensions in this repository.
Please make sure you use the branch corresponding to your IPython/Jupyter version.


Documentation
=============

Documentation for all maintained extensions can be found at
[jupyter-contrib-nbextensions.readthedocs.io](http://jupyter-contrib-nbextensions.readthedocs.io/en/latest)

In the 4.x Jupyter repository, all extensions that are maintained and active
have at least a  yaml file to allow them being configured using the
[jupyter_nbextensions_configurator](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator)
server extension, which is installed as a dependency of this package.
Most also have a markdown readme file for documentation.
The `jupyter_nbextensions_configurator` server extension shows an nbextensions
tab on the main notebook dashboard (file tree page) from which you can see each
nbextension's markdown readme, and configure its options.
To view documentation without installing, you can browse the nbextensions
directory to read markdown readmes on github at
[github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/master/src/jupyter_contrib_nbextensions/nbextensions](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/master/src/jupyter_contrib_nbextensions/nbextensions).

For older releases (2.x and 3.x), look at the [Wiki](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/wiki)

Some extensions are not documented. We encourage you to add documentation for them.


Installation
============

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


Notebook extension structure
============================

The nbextensions are stored each as a separate subdirectory of `src/jupyter_contrib_nbextensions/nbextensions`
Each notebook extension typically has it's own directory containing:

 * `thisextension/main.js` - javascript implementing the extension
 * `thisextension/main.css` - optional CSS
 * `thisextension/readme.md` - readme file describing the extension in markdown format
 * `thisextension/config.yaml` - file describing the extension to the `jupyter_nbextensions_configurator` server extension


Changes
=======

0.2.6
-----

Fix requirements, which got altered incorrectly as part of the 0.2.5 release.


0.2.5
-----

New nbextensions, new features and bugfixes:
 - [#846](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/846)
   [@jfbercher](https://github.com/jfbercher)
   [toc2] - always read threshold parameter from system config - address
   [#646](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/646)
 - [#860](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/860)
   [@jfbercher](https://github.com/jfbercher)
   [move_selected_cells] updated to Jupyter 4.2+
 - [#863](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/863)
   [@bluss](https://github.com/bluss)
   [hide_header] **New nbextension** to toggle (header + toolbar + menubar)
   visibility
 - [#864](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/864)
   [@simplygood](https://github.com/simplygood)
   [autoscroll] fixed a typo in AutoScroll's `main.js`
 - [#872](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/872)
   [@jfbercher](https://github.com/jfbercher)
   [toc2] update template and resize sidebar on resize-header event
 - [#887](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/887)
   [@jfbercher](https://github.com/jfbercher)
   [toc2] Add a parameter to enable/disable cell widening
 - [#899](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/899)
   [@jfbercher](https://github.com/jfbercher)
   [highlighter] Minor typo update + cleaning
 - [#892](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/892)
   [@jcb91](https://github.com/jcb91)
   [collapsible_headings] new features including support for embedding into
   html
 - [#902](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/902)
   [@jozjan](https://github.com/jozjan)
   [nbconvert_support.embed_html] Updated regex pattern for better match
 - [#905](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/905)
   [@jcb91](https://github.com/jcb91)
   [codemirror_mode_extensions] **New nbextension**
 - [#907](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/907)
   [@jcb91](https://github.com/jcb91)
   [ExecuteTime] new features including configurable utc assumption, relative
   time display, message templates, right-alignment.
 - [#908](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/908)
   [@juhasch](https://github.com/juhasch)
   [codefolding] Fixes for languages other than IPython that use
   non-indent-based blocks.
 - [#911](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/911)
   [@piti118](https://github.com/piti118)
   [toc2] Use https instead of http for jquery in nbconvert template
 - [#912](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/912)
   [@jcb91](https://github.com/jcb91)
   [init_cell] allow celltoolbar preset to load from metadata setting
 - [#915](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/915)
   [@juhasch](https://github.com/juhasch)
   [dragdrop] Bugfix for Firefox
 - [#917](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/917)
   [@moble](https://github.com/moble)
   [snippets_menu] Fix documentation links
 - [#919](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/919)
   [@jcb91](https://github.com/jcb91)
   [scratchpad] adopt [minrk/scratchpad#12](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/12)
   to bugfix z-index for issue
   [#916](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/916)
 - [#921](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/921)
   [@sdsawtelle](https://github.com/sdsawtelle)
   [chrome-clipboard] use utils function to add authentication to upload, fixing
   [#918](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/918)
 - Various fixes to ensure nbextensions load correctly, related to
   [#885](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/885):
   PRs
   [#895](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/895),
   [#897](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/897),
   [#898](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/898),
   [#900](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/900),
   [#906](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/906)
 - [#923](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/923)
   [@jcb91](https://github.com/jcb91)
   update dependency versions, meaning potential updates to
   jupyter_nbextensions_configurator, jupyter_latex_envs, and
   jupyter_highlight_selected_word
 - **stale nbextensions removed**:
   history [#889](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/889)
   read-only [#890](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/890)
   search, slidemode/slidemode2, swc [#891](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/891)
   no_exec_dunder, nbviewer_theme [#906](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/906)

Alterations to the installation machinery:
 - [#874](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/874)
   add traitlets 4.1 to requirements, needed by nbTranslate
 - [#923](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/923)
   [@jcb91](https://github.com/jcb91)
   update required versions of jupyter_nbextensions_configurator,
   jupyter_latex_envs, and jupyter_highlight_selected_word to latest releases

Updates to readme/docs:
 - [#896](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/896)
   [@juhasch](https://github.com/juhasch)
   [freeze] Add some more documentation
 - [#881](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/881)
   [@juhasch](https://github.com/juhasch)
   Fix graphics in doc
 - [#875](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/875)
   [@jcb91](https://github.com/jcb91)
   Docs updates - sort list
 - [#876](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/876)
   [@juhasch](https://github.com/juhasch)
   Document LaTex templates

CI updates:
[#862](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/862),
[#894](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/894),
[#920](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/920)


0.2.4
-----

New nbextensions, new features and bugfixes:

  - [#839](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/839)
    [@jcb91](https://github.com/jcb91)
    [snippets_menu] merge upstream changes
  - [#844](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/844)
    [@jfbercher](https://github.com/jfbercher)
    [nbTranslate] add help message for keyboard shortcuts
  - [#843](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/843)
    [@jfbercher](https://github.com/jfbercher)
    [code_prettify] bugfix: reinstate JSON-conversion of results from the R kernel
  - [#837](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/837)
    [@jcb91](https://github.com/jcb91)
    [code_prettify] Merge upstream code-prettify updates
  - [#838](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/838)
    [@jfbercher](https://github.com/jfbercher)
    [nbTranslate] **New nbextension**
  - [#827](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/827)
    [@moble](https://github.com/moble)
    [snippets_menu] **New nbextension**
  - [#836](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/836)
    [@juhasch](https://github.com/juhasch)
    Remove `strip_output_prompt` from `nbconvert_support`
  - [#831](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/831)
    [@juhasch](https://github.com/juhasch)
    [dragdrop] use utils function to add authentication to upload, fixing
    [#830](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/830)
  - [#834](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/834)
    [@lspvic](https://github.com/lspvic)
    [init_cell] fix bug with trust warning
  - [#826](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/826)
    [@adrn](https://github.com/adrn)
    [code_snippets] **New nbextension**
  - [#820](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/820)
    [@jcb91](https://github.com/jcb91)
    [hinterland] disable hints in comments (configurable), fixing
    [#819](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/819)
  - [#815](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/815)
    [@jcb91](https://github.com/jcb91)
    [hinterland] make all regexes configurable, addressing
    [#651](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/651)

Updates to readme/docs:
  - [#845](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/845)
    [@aiguofer](https://github.com/aiguofer)
    [select_keymap] Add note about helpful firefox extension
  - [#850](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/850)
    [@juhasch](https://github.com/juhasch)
    Describe nbextensions custom template
  - [#833](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/833)
    [@jcb91](https://github.com/jcb91)
    [docs] updates to readme and docs, addressing
    [#740](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/740)
  - [#825](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/825)
    [@jcb91](https://github.com/jcb91)
    [docs] readme updates to specllchecker, codefolding, gist_it, readonly
  - [#816](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/816)
    [@jcb91](https://github.com/jcb91)
    [docs] update docs build to include nbextensions provided by dependencies

Some CI updates:
  [#824](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/824)


0.2.3
-----

Alterations to the installation machinery:
  - [#801](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/801)
    [@jcb91](https://github.com/jcb91)
    updates to migrate script addressing renames
  - [#807](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/807)
    [@jcb91](https://github.com/jcb91)
    setup.py fixes

New nbextensions, new features and bugfixes:
  - [#796](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/796)
    [@oxinabox](https://github.com/oxinabox)
    [AddBefore] Add new nbextension
  - [#746](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/746),
    [#802](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/802)
    [@jfbercher](https://github.com/jfbercher),
    [@jcb91](https://github.com/jcb91)
    [latex_envs] replace vendored `latex_envs` with its pypi package
  - [#794](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/794)
    [@juhasch](https://github.com/juhasch)
    [codefolding] Only execute codefolding preprocessor when requested
  - [#804](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/804)
    [@jcb91](https://github.com/jcb91)
    [jupyter_highlight_selected_word] add jupyter_highlight_selected_word nbextension
  - [#795](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/795)
    [@jfbercher](https://github.com/jfbercher)
    [toc2] Highlight toc headings for sections with selected/edited/running cells;
    fix save issue [#762](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/762)
  - [#803](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/803)
    [@jfbercher](https://github.com/jfbercher)
    [toc2] make higlight colours configurable; configurably allow shifting
    title, menus & icons to the left, ratehr than centring
  - [#810](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/810)
    [@jfbercher](https://github.com/jfbercher)
    [toc2] take account of nb metadata in html export
  - [#813](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/813)
    [@jcb91](https://github.com/jcb91)
    [limit_output] allow per-cell override of limit length, make output-limited
    notes persist through notebook save & reload, limit outputs even over
    several distinct output events
  - [#814](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/814)
    [@jcb91](https://github.com/jcb91)
    [init_cell] make automatic running of initialization cells configurable
    (fixes [#812](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/812)),
    prevent automatic run of initialization cells in untrusted notebooks

Some CI updates:
  [#797](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/797)
  [#806](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/806)


0.2.2
-----

Alterations to the installation machinery:
  - [#774](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/774)
    [@jcb91](https://github.com/jcb91)
    Add flags to install only files/only config modifications.
  - [#769](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/769)
    [@jcb91](https://github.com/jcb91)
    Use jupyter_nbextensions_configurator's actual install app

Stale nbextensions removed:
  - history, readonly, swc, slidemode
    [#890](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/890),
    [#889](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/889)
    [@juhasch](https://github.com/juhasch),
    [#891](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/891)
    [@jcb91](https://github.com/jcb91),
    none of which have yet even been updated to notebook 4.x

New nbextensions, new features and bugfixes:

  - [#882](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/882)
    [@juhasch](https://github.com/juhasch)
    [limit_output] enable independent limiting of different kernel message types
  - [#877](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/877)
    [@jfbercher](https://github.com/jfbercher)
    [toc2] Remove MathJax preview in headers and links
  - Fixes for timings issues related to the `notebook_loaded.Notebook` event, as
    raised in issue
    [#885](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/885).
    Fixes for `hide_input`, `hide_input_all`, `ruler`, `splitcell` in
    [#886](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/886)
    [@jcb91](https://github.com/jcb91),
    for `codefolding` in
    [#888](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/888)
    [@juhasch](https://github.com/juhasch)
    for `freeze` in
    [#884](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/884)
    [@kukanya](https://github.com/kukanya)
    for `execute_time` in
    [#883](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/883)
    [@jcb91](https://github.com/jcb91)
  - [#787](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/787)
    [@jcb91](https://github.com/jcb91)
    [scratchpad] Updates from master repo
  - [#784](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/784)
    [@azjps](https://github.com/azjps)
    [limit_output] fix missing braces
  - [#768](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/768)
    [@lll9p](https://github.com/lll9p)
    [collapsible_headings] Make level test code robust to undefined cell
  - [#770](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/770)
    [@jfbercher](https://github.com/jfbercher)
    [code_prettify] Update to address [#767](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/767)
  - [#765](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/765)
    [@kukanya](https://github.com/kukanya)
    [Freeze] Extend functionality to markdown cells
  - [#781](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/781)
    [@kukanya](https://github.com/kukanya)
    [ScrollDown] Add new nbextension

Updates to readme/docs:
  - [#790](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/790)
    [@juhasch](https://github.com/juhasch)
    mention PyPi install source in readme
  - [#789](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/789)
    [@jcb91](https://github.com/jcb91)
    A few minor readme updates
  - [#788](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/788)
    [@jcb91](https://github.com/jcb91)
    update installation instructions
  - [#773](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/773)
    [@jcb91](https://github.com/jcb91)
    generate docs without conversion

Some CI updates:
  [#778](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/778),
  [#779](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/779),
  [#772](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/772),
  [#771](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/771),
  [#766](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/766)


0.2.1
-----

New nbextensions, new features and bugfixes:
  - New `html_embed` nbconvert exporter
  - Added `select_keymap` nbextension
  - added tests for `toc2` and `html_embed` exporters
  - tooltips on `highlighter`
  - `toc2` issue with zero-length navigation menu
  - switch `table_beautifier` from bootstrap-table to tablesorter plugin
  - `code_prettify`: corrected insufficient re replacement
  - `dragdrop` fix url generation when using non-default base_url

Updates to readme/docs:
  - get docs readable at
    [jupyter-contrib-nbextensions.readthedocs.io](http://jupyter-contrib-nbextensions.readthedocs.io/)
  - add an auto-enabled nbextension `contrib_nbextensions_help_item`, which
    adds a help menu item to point at RTD
  - Add missing readmes & yaml links to readmes


0.2.0
-----

Alterations to the installation machinery:
  - __alter app default settings__, making `--user` flag in install app default
    to `False`
  - __add plural nbextensions command alias__ i.e.
    `jupyter contrib nbextensions` as an alias of `jupyter contrib nbextension`
  - conda-forge recipe & installation instructions added

New nbextensions, new features and bugfixes:
  - __new__ `code_prettify` extension
  - [latex_envs]: update for MathJax use and html export;
    add latex_envs.py - exporter library;
    add templates for conversion;
    configure entry points for exporters in `setup.py`;
    update readme.
  - [toc2] modifications to templates, configure entry points for exporters in
    `setup.py`, update README
  - [breakpoints] removed stale extension
  - Bugfixes: `limit_output`, postprocessors, nbconvert support

Updates to readme/docs:
  - Add docs generation
  - Add lots of missing readme & yaml files
  - Attempt to get docs builds working on readthedocs

Plus various CI & packaging fixes/improvements, including


0.1.0
-----

First release with pep-440 compatible versioning
