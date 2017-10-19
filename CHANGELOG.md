Changelog
=========

All notable changes to this project should be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres (at least as of 0.3.0!) to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

Note also that since this markdown is used to produce our docs at
[jupyter-contrib-nbextensions.readthedocs.io](http://jupyter-contrib-nbextensions.readthedocs.io/en/latest/)
via [recommonmark](https://github.com/rtfd/recommonmark), (and GitHub links
aren't automatically added by recommonmark), it'd be helpful if you could
explicitly link github PR/issue numbers and any URIs, to make sure our
readthedocs stuff gets all the shiny link goodness. Thanks!


Unreleased (aka. GitHub master)
-------------------------------

This is where each new PR to the project should add a summary of its changes,
which makes it much easier to fill in each release's changelog :)


0.3.3
-----

-  [#1128](https://github.com/ipython-contrib/pulls/1128)
   bugfix for notebook < 5.2.0, bugs introduced by
   [@jcb91](https://github.com/jcb91) in
   [#1123](https://github.com/ipython-contrib/pulls/1123)

0.3.2
-----

Repo-level stuff:

 - [#1097](https://github.com/ipython-contrib/pulls/1097)
   [@juhasch](https://github.com/juhasch)
   Increase lint's allowed line length to 120
 - [#1100](https://github.com/ipython-contrib/pulls/1100)
   [@juhasch](https://github.com/juhasch)
   Add note about --skip-running-check flag to docs
 - [#1117](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1117)
   [@jcb91](https://github.com/jcb91)
   test yaml files using jupyter_nbextensions_configurator to avoid any yaml
   typos which may prevent nbextensions from getting installed.
-  [#1103](https://github.com/ipython-contrib/pulls/1103)
   [@Sukneet](https://github.com/Sukneet)
   update add_buttons_group to use action instead of button

New features and bugfixes:

- `code_prettify`, `autopep8` & `2to3`
  [#1118](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1118)
  [@jcb91](https://github.com/jcb91)
  Merge upstream changes, using textareas for json parameter editing
- `collapsible_headings`
  [#1109](https://github.com/ipython-contrib/pulls/1109)
  [@jcb91](https://github.com/jcb91)
  bugfix: update *all* headings on markdown rendering
- `embedhtml`
  [#1052](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/1052)
  [@gabyx](https://github.com/gabyx)
  Changed regex parsing in embedhtml.py to XML parsing with lxml, regex
- `python-markdown`
  * [#1081](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/1081)
    [@yarikoptic](https://github.com/yarikoptic)
     fix minor readme typo: currently -> current
  * [#1122](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/1122)
    [@jcb91](https://github.com/jcb91)
    avoid js error when marked doesn't wrap things in `<p>` tags
- `ruler`
  [#1116](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/1116)
  [@jcb91](https://github.com/jcb91)
  css patch for notebook > 4.2.3 - see
  [jupyter/notebook#2869](https://github.com/jupyter/notebook/issues/2869)
  for details
- `runtools`
  [#946](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/946)
  [@juhasch](https://github.com/juhasch)
  Use a scheduling list for running marked cells
- `scratchpad`
  [#1089](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/1089)
  [@jcb91](https://github.com/jcb91)
  fix typo in yaml
- `toc2`
  * [#1068](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/1068)
    [@jfbercher](https://github.com/jfbercher)
    Scrolling: add a mark to currently displayed section in TOC window
  * [#1084](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1084)
    [@jfbercher](https://github.com/jfbercher)
    fix for
    [#1083](https://github.com/ipython-contrib/issue/1083):
    Revert full url in links to relative to the current page.
  * [#1091](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1091)
    [@fkoessel](https://github.com/fkoessel)
    Ensure notebook is not widened if sidebar is displayed and
    `cfg.widenNotebook` is unchecked.
  * [#1095](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/1095)
    [@fkjogu](https://github.com/fkjogu)
    Beautify toc2.js using js-beautify
  * [#1110](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/1110)
    [@jcb91](https://github.com/jcb91)
    constrain draggable toc to the body
  * [#1111](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/1111)
    [@jcb91](https://github.com/jcb91)
    remove unused variables & commented code
  * [#1112](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/1112)
    [@jcb91](https://github.com/jcb91)
    use requirejs to get events
  * [#1120](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/1120)
    [@jcb91](https://github.com/jcb91)
    simplify ToC cell processing
  * [#1121](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/1121)
    [@jcb91](https://github.com/jcb91)
    correct toc tree construction
- `zenmode`
  [#1062](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/1062)
  [@soamaven](https://github.com/soamaven)
  Make hiding of the Header and Menubar optional

Removed/deprecated nbextensions:

- [#539](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/539)
  [@janschulz](https://github.com/janschulz)
  Remove deprecated extension `search-replace`
- [#1108](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pulls/1108)
  [@juhasch](https://github.com/juhasch)
  Remove deprecated extensions `chrome-clipboard`, `dragdrop`, `search-replace`


0.3.1
-----

Repo-level stuff:

- [#1073](https://github.com/ipython-contrib/pulls/1073)
  [@jcb91](https://github.com/jcb91)
  Use newer conda version for recipe build test
- [#1069](https://github.com/ipython-contrib/pulls/1069)
  [@jcb91](https://github.com/jcb91)
  Bugfix in installer, require newer versions of
  [`jupyter_contrib_core`](https://github.com/jupyter-contrib/jupyter_contrib_core)
  and
  [`jupyter_nbextensions_configurator`](https://github.com/jupyter-contrib/jupyter_nbextensions_configurator)
- [#1059](https://github.com/ipython-contrib/pulls/1059)
  [@jcb91](https://github.com/jcb91)
  fix linting errors, disallow linting failure on Travis

New features and bugfixes:

- `codefolding`
  * [#1054](https://github.com/ipython-contrib/pulls/1054)
    [@gabyx](https://github.com/gabyx)
    [codefolding] preprocessor improvements
  * [#1072](https://github.com/ipython-contrib/pulls/1072)
    [@jcb91](https://github.com/jcb91)
    fix linting in preprocessor
- `dragdrop`
  [#1063](https://github.com/ipython-contrib/pulls/1063)
  [@juhasch](https://github.com/juhasch)
  Add note to docs about native drag&drop support
- `toc2`
  [#1066](https://github.com/ipython-contrib/pulls/1066)
  [@jfbercher](https://github.com/jfbercher)
  tentative fix for
  [#1065](https://github.com/ipython-contrib/issues/1065)
  by updating jqueryui cdn and version
- for various nbextensions
  [#1061](https://github.com/ipython-contrib/pulls/1061)
  [@jcb91](https://github.com/jcb91)
  use `Jupyter.notebook.config` instance, where appropriate


0.3.0
-----

Alterations to the installation machinery
(these are what made the bump to `0.3`):

  - [#992](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/992)
    require `nbconvert >=4.2`
  - [#1045](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1045)
    improved running-server checks for installation

Repo-level stuff:

  - notebook 5.x: Update various nbextensions to list themselves as compatible
    [#1000](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1000),
    [#1002](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1002),
    [#1003](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1003),
    [#1055](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1055)
  - CI updates:
    [#995](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/995)
    updates for Travis

New features and bugfixes:

  - `codefolding`,
    * [#1028](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1028)
      [@juhasch](https://github.com/juhasch)
      Add configurable delay for initialization
    * [#1055](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1055)
      [@jcb91](https://github.com/@jcb91)
      fix restoration of nested folds
    * [#1058](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1058)
      [@juhasch](https://github.com/juhasch)
      Fix preprocessor configuration
  - `code_prettify`,
    [#1019](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1019)
    [@jfbercher](https://github.com/jfbercher)
    added support for IPython magics, cf
    [#1018](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/1018)
  - `collapsible_headings`,
    * [#1025](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1025)
      add new (un)collapse-all actions, shortcuts, button
    * [#1031](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1031)
      [@jcb91](https://github.com/jcb91)
      integration with `toc2`
    * [#1060](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1060)
      bugfix for exporter
  - `ExecuteTime`,
    [#1022](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1022)
    [@jcb91](https://github.com/jcb91)
    add menu items & options for clearing timing data
  - `export_embedded`
    [#1039](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1022)
    [@gabyx](https://github.com/gabyx)
    **New nbextension** providing a menu item to allow downloading the notebook
    through the `html_embed` exporter.
  - `freeze`
      * [#1006](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1006)
        [@aminought](https://github.com/aminought)
        Fix cell removing after copying of freezed cell
      * [#1033](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1033)
        [@jcb91](https://github.com/jcb91)
        fix typo/inconsitent state naming
  - `html_embed` exporter:
    [#1044](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1006)
    [@juhasch](https://github.com/juhasch)
    bugfix for issue
    [#1041](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1041):
    to ensure correct treatment of images already embedded as
    [attachments](https://github.com/jupyter/nbformat/pull/21).
  - `nbTranslate`
    [#998](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/998)
    [@jfbercher](https://github.com/jfbercher)
    update to google API modifications
  - `notify`
    * [#1036](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1036)
      [@baldwint](https://github.com/baldwint)
      Update notify extension for Jupyter 5.x
    * [#1053](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1053)
      [@brenns10](https://github.com/brenns10)
      Add sound, & sticky options
  - `scratchpad`,
    [#1026](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1026)
    [@jcb91](https://github.com/jcb91)
    merge upstream fix to stop the scratchpad interfering with the scrollbar in firefox.
  - `toc2`
    * [#994](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/994)
      [@jfbercher](https://github.com/jfbercher)
      update for cells width and sidebar height
    * [#1030](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1030)
      [@jfbercher](https://github.com/jfbercher)
      Full url in links | #skip tag to skip headers from being inserted
    * [#1031](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1031)
      [@jcb91](https://github.com/jcb91)
      Make toc entries collapsible, integrate with `collapsible_headings`
    * [#1032](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1032)
      Use amd structure to avoid polluting the global namespace
    * [#1035](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1035)
      [@jcb91](https://github.com/jcb91)
      alter ToC cell source to work better with `collapsible_headings`
  - `varInspector`
    * [#1001](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1001)
      [@jcb91](https://github.com/jcb91)
      merge upstream fixes, ensuring each library object has its own config object
    * [#1016](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1016)
      [@jfbercher](https://github.com/jfbercher)
      Fix [#1014](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/1014)
      and [#1015](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/1015) -
      reload on `%reset` magic and fix print on python2


0.2.8
-----

Alterations to the installation machinery:

  - [#981](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/981)
    fix potential bug in config uninstall

Repo-level stuff:
[#986](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/986),
[#972](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/972),
update more nbextensions to list themselves as 5.x-compatible.

New features and bugfixes:

  - `cellstate`
    [#978](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/978)
    [@juhasch](https://github.com/juhasch)
    Stale nbextensions removed
  - `codefolding`
    [#977](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/977)
    [@juhasch](https://github.com/juhasch)
    Fix codefolding gutter load issue
  - `ExecuteTime`
    [#967](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/967)
    [@NII](https://github.com/NII)
    Fix highlight.color option
  - `freeze`
    * [#966](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/966)
      [@NII](https://github.com/NII)
      make cell colors configurable
    * [#968](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/968)
      [@tnarik](https://github.com/tnarik)
      use `cell.metadata.editable` as introduced by notebook 5.x.
    * [#976](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/976)
      [@yacchin1205](https://github.com/yacchin1205)
      Fix property checking
    * [#974](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/974)
      [@yacchin1205](https://github.com/yacchin1205)
      Export set/get_state functions
  - `init_cell`
    [#987](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/987)
    [@jcb91](https://github.com/jcb91)
    fix typo in options-loading code
  - `ruler`
    [#980](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/980)
    [@jcb91](https://github.com/jcb91)
    fix typo in `cm_config` defaults
  - `select_keymap`
    [#971](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/971)
    [@jcb91](https://github.com/jcb91)
    honour default params as declared in yaml
  - `skip-traceback`
    [#957](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/957)
    [@jcb91](https://github.com/jcb91)
    make traceback collapsed, rather than just omitted entirely.
    Apply to pre-existing traceback at notebook load, and add a button to copy
    the traceback
  - `toc2`
    [#969](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/969)
    [@hiiwave](https://github.com/hiiwave)
    Support custom colors for navigation text and window
  - `tree-filter`
    [#948](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/948)
    [@wikiped](https://github.com/wikiped)
    Make search optionally case-insensitve and accept RegExp syntax

Updates to readme/docs:
[#973](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/973)
fix link typos and redirects

0.2.7
-----

New nbextensions, new features and bugfixes:

  - `codefolding` 
    * [#927](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/927)
      [@juhasch](https://github.com/juhasch)
      bugfix, restore default codefolding hotkey
    * [#954](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/954)
      [@juhasch](https://github.com/juhasch)
      Make codefolding available in edit view
  - `collapsible_headings` 
    [#950](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/950)
    [@jcb91](https://github.com/jcb91)
    fix tooltip placement bug for notebook 5.x, add 5.x compatibility
  - `comment-uncomment` 
    [#953](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/953)
    [@juhasch](https://github.com/juhasch)
    Add option to indent comments to current indent level
  - `dragdrop`
    [#929](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/929)
    [@xNok](https://github.com/xNok)
    use markdown syntax instead of html
  - `ExecuteTime`
    [#934](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/934)
    [@jcb91](https://github.com/jcb91)
    honour `default_kernel_to_utc` for both start and end times
  - `init_cell`
    [#928](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/928)
    [@ZelphirKaltstahl](https://github.com/ZelphirKaltstahl)
    bugfix error introduced as part of fixes to
    [#885](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/885)
  - `nbTranslate`
    [#951](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/951)
    [@jfbercher](https://github.com/jfbercher)
    improved code formatting in nbTranslate.py
  - `runtools`
    [#930](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/930)
    [@tsankuanglee](https://github.com/tsankuanglee)
    add tooltips to runtools' many buttons
  - `varInspector`
    [#922](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/922)
    [@jfbercher](https://github.com/jfbercher)
    **new nbextension** a variable inspector!

CI stuff:
[#955](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/955)

0.2.6
-----

Fix requirements, which got altered incorrectly as part of the 0.2.5 release.


0.2.5
-----

New nbextensions, new features and bugfixes:

  - `autoscroll`
    [#864](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/864)
    [@simplygood](https://github.com/simplygood)
    fixed a typo in AutoScroll's `main.js`
  - `chrome-clipboard` 
    [#921](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/921)
    [@sdsawtelle](https://github.com/sdsawtelle)
    use utils function to add authentication to upload, fixing
    [#918](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/918)
  - `codefolding`
    [#908](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/908)
    [@juhasch](https://github.com/juhasch)
    Fixes for languages other than IPython that use non-indent-based blocks.
  - `codemirror_mode_extensions`
    [#905](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/905)
    [@jcb91](https://github.com/jcb91)
    **New nbextension**
  - `collapsible_headings` 
    [#892](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/892)
    [@jcb91](https://github.com/jcb91)
    new features including support for embedding into html
  - `dragdrop`
    [#915](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/915)
    [@juhasch](https://github.com/juhasch)
    Bugfix for Firefox
  - `ExecuteTime`
    [#907](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/907)
    [@jcb91](https://github.com/jcb91)
    new features including configurable utc assumption, relative
    time display, message templates, right-alignment.
  - `hide_header`
    [#863](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/863)
    [@bluss](https://github.com/bluss)
    **New nbextension** to toggle (header + toolbar + menubar) visibility
  - [#899](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/899)
    [@jfbercher](https://github.com/jfbercher)
    `highlighter` Minor typo update + cleaning
  - `init_cell`
    [#912](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/912)
    [@jcb91](https://github.com/jcb91)
    allow celltoolbar preset to load from metadata setting
  - `move_selected_cells`
    [#860](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/860)
    [@jfbercher](https://github.com/jfbercher)
    updated to Jupyter 4.2+
  - `nbconvert_support.embed_html`
    [#902](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/902)
    [@jozjan](https://github.com/jozjan)
    Updated regex pattern for better match
  - `scratchpad`
    [#919](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/919)
    [@jcb91](https://github.com/jcb91)
    adopt [minrk/scratchpad#12](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/12)
    to bugfix z-index for issue
    [#916](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/916)
  - `snippets_menu` 
    [#917](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/917)
    [@moble](https://github.com/moble)
    Fix documentation links
  - `toc2`
    * [#846](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/846)
      [@jfbercher](https://github.com/jfbercher)
      always read threshold parameter from system config - address
      [#646](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/646)
    * [#872](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/872)
      [@jfbercher](https://github.com/jfbercher)
      update template and resize sidebar on resize-header event
    * [#887](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/887)
      [@jfbercher](https://github.com/jfbercher)
      Add a parameter to enable/disable cell widening
    * [#911](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/911)
      [@piti118](https://github.com/piti118)
      Use https instead of http for jquery in nbconvert template
  - Various fixes to ensure nbextensions load correctly, related to
    [#885](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/885):
    PRs
    [#895](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/895),
    [#897](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/897),
    [#898](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/898),
    [#900](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/900),
    [#906](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/906)
  - **stale nbextensions removed**:
    * `history` [#889](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/889)
    * `read-only` [#890](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/890)
    * `search`, `slidemode/slidemode2`, `swc` [#891](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/891)
    * `no_exec_dunder`, `nbviewer_theme` [#906](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/906)

Alterations to the installation machinery:

  - [#874](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/874)
    add traitlets 4.1 to requirements, needed by nbTranslate
  - [#923](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/923)
    [@jcb91](https://github.com/jcb91)
    update required versions of `jupyter_nbextensions_configurator`,
    `jupyter_latex_envs`, and `jupyter_highlight_selected_word` to latest
    releases

Updates to readme/docs:

  - [#896](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/896)
    [@juhasch](https://github.com/juhasch)
    Add some more documentation for `freeze`
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
    `snippets_menu` merge upstream changes
  - [#844](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/844)
    [@jfbercher](https://github.com/jfbercher)
    `nbTranslate` add help message for keyboard shortcuts
  - [#843](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/843)
    [@jfbercher](https://github.com/jfbercher)
    `code_prettify` bugfix: reinstate JSON-conversion of results from the R kernel
  - [#837](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/837)
    [@jcb91](https://github.com/jcb91)
    `code_prettify` Merge upstream code-prettify updates
  - [#838](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/838)
    [@jfbercher](https://github.com/jfbercher)
    `nbTranslate` **New nbextension**
  - [#827](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/827)
    [@moble](https://github.com/moble)
    `snippets_menu` **New nbextension**
  - [#836](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/836)
    [@juhasch](https://github.com/juhasch)
    Remove `strip_output_prompt` from `nbconvert_support`
  - [#831](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/831)
    [@juhasch](https://github.com/juhasch)
    `dragdrop` use utils function to add authentication to upload, fixing
    [#830](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/830)
  - [#834](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/834)
    [@lspvic](https://github.com/lspvic)
    `init_cell` fix bug with trust warning
  - [#826](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/826)
    [@adrn](https://github.com/adrn)
    `code_snippets` **New nbextension**
  - [#820](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/820)
    [@jcb91](https://github.com/jcb91)
    `hinterland` disable hints in comments (configurable), fixing
    [#819](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/819)
  - [#815](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/815)
    [@jcb91](https://github.com/jcb91)
    `hinterland` make all regexes configurable, addressing
    [#651](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/651)

Updates to readme/docs:

  - [#845](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/845)
    [@aiguofer](https://github.com/aiguofer)
    Add note about helpful firefox extension to `select_keymap` docs
  - [#850](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/850)
    [@juhasch](https://github.com/juhasch)
    Describe nbextensions custom template
  - [#833](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/833)
    [@jcb91](https://github.com/jcb91)
    updates to readme and docs, addressing
    [#740](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/740)
  - [#825](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/825)
    [@jcb91](https://github.com/jcb91)
    readme updates to specllchecker, codefolding, gist_it, readonly
  - [#816](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/816)
    [@jcb91](https://github.com/jcb91)
    update docs build to include nbextensions provided by dependencies

Some CI updates:
[#824](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/824)


0.2.3
-----

Alterations to the installation machinery:

  - [#801](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/801)
    [@jcb91](https://github.com/jcb91)
    updates to migrate script addressing renames
  - [#807](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/807)
    [@jcb91](https://github.com/jcb91)
    setup.py fixes

New nbextensions, new features and bugfixes:

  - [#796](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/796)
    [@oxinabox](https://github.com/oxinabox)
    `AddBefore` Add new nbextension
  - [#746](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/746),
    [#802](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/802)
    [@jfbercher](https://github.com/jfbercher),
    [@jcb91](https://github.com/jcb91)
    `latex_envs` replace vendored `latex_envs` with its pypi package
  - [#794](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/794)
    [@juhasch](https://github.com/juhasch)
    `codefolding` Only execute codefolding preprocessor when requested
  - [#804](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/804)
    [@jcb91](https://github.com/jcb91)
    `jupyter_highlight_selected_word` add jupyter_highlight_selected_word nbextension
  - [#795](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/795)
    [@jfbercher](https://github.com/jfbercher)
    `toc2` Highlight toc headings for sections with selected/edited/running cells;
    fix save issue [#762](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/762)
  - [#803](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/803)
    [@jfbercher](https://github.com/jfbercher)
    `toc2` make higlight colours configurable; configurably allow shifting
    title, menus & icons to the left, ratehr than centring
  - [#810](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/810)
    [@jfbercher](https://github.com/jfbercher)
    `toc2` take account of nb metadata in html export
  - [#813](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/813)
    [@jcb91](https://github.com/jcb91)
    `limit_output` allow per-cell override of limit length, make output-limited
    notes persist through notebook save & reload, limit outputs even over
    several distinct output events
  - [#814](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/814)
    [@jcb91](https://github.com/jcb91)
    `init_cell` make automatic running of initialization cells configurable
    (fixes [#812](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/812)),
    prevent automatic run of initialization cells in untrusted notebooks

Some CI updates:
[#797](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/797)
[#806](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/806)


0.2.2
-----

Alterations to the installation machinery:

  - [#774](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/774)
    [@jcb91](https://github.com/jcb91)
    Add flags to install only files/only config modifications.
  - [#769](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/769)
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
    `limit_output` enable independent limiting of different kernel message types
  - [#877](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/877)
    [@jfbercher](https://github.com/jfbercher)
    `toc2` Remove MathJax preview in headers and links
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
  - [#787](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/787)
    [@jcb91](https://github.com/jcb91)
    `scratchpad` Updates from master repo
  - [#784](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/784)
    [@azjps](https://github.com/azjps)
    `limit_output` fix missing braces
  - [#768](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/768)
    [@lll9p](https://github.com/lll9p)
    `collapsible_headings` Make level test code robust to undefined cell
  - [#770](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/770)
    [@jfbercher](https://github.com/jfbercher)
    `code_prettify` Update to address [#767](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/767)
  - [#765](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/765)
    [@kukanya](https://github.com/kukanya)
    `Freeze` Extend functionality to markdown cells
  - [#781](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/781)
    [@kukanya](https://github.com/kukanya)
    `ScrollDown` Add new nbextension

Updates to readme/docs:

  - [#790](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/790)
    [@juhasch](https://github.com/juhasch)
    mention PyPi install source in readme
  - [#789](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/789)
    [@jcb91](https://github.com/jcb91)
    A few minor readme updates
  - [#788](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/788)
    [@jcb91](https://github.com/jcb91)
    update installation instructions
  - [#773](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/773)
    [@jcb91](https://github.com/jcb91)
    generate docs without conversion

Some CI updates:
[#778](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/778),
[#779](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/779),
[#772](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/772),
[#771](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/771),
[#766](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/766)


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
  - `latex_envs`: update for MathJax use and html export;
    add latex_envs.py - exporter library;
    add templates for conversion;
    configure entry points for exporters in `setup.py`;
    update readme.
  - `toc2` modifications to templates, configure entry points for exporters in
    `setup.py`, update README
  - `breakpoints` removed stale extension
  - Bugfixes: `limit_output`, postprocessors, nbconvert support

Updates to readme/docs:
  - Add docs generation
  - Add lots of missing readme & yaml files
  - Attempt to get docs builds working on readthedocs

Plus various CI & packaging fixes/improvements


0.1.0
-----

First release with pep-440 compatible versioning!
