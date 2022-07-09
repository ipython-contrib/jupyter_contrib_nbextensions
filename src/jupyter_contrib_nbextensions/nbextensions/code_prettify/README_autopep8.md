jupyter-autopep8
================

This nbextension reformats/prettifies code in notebook python code cells.

Under the hood, it uses a call to the current notebook kernel to reformat the
code.
The conversion run by the kernel uses the python [autopep8] package, and thus is compatible only with python kernels.

The nbextension provides

- a toolbar button (configurable to be added or not)

- a keyboard shortcut for reformatting the current code-cell (default shortcut
  is `Alt-A`, can also be configured not to add the keyboard shortcut).

- a keyboard shortcut for reformatting the whole notebook (default shortcut
  is `Alt-Shift-A`, can also be configured not to add the keyboard shortcut).

Syntax needs to be correct, but the nbextension may be able to point out basic
syntax errors.


Prerequisites
-------------

Of course, you must have the necessary kernel-specific package installed for
the prettifier call to work:

    pip install autopep8


Options
-------

All options are provided by the [KerneExecOnCells library] - see the
[internals] section below for details.
There are a few nbextension-wide options, configurable using the
[jupyter_nbextensions_configurator] or by editing the `notebook` section config
file directly.
The options are as follows:

- `autopep8.add_toolbar_button`:
  Whether to add a toolbar button to transform the selected cell(s).
  Defaults to `true`.

- `autopep8.button_icon`:
  A font-awesome class defining the icon used for the toolbar button and actions.
  See [fontawesome] for available icon classes.
  Defaults to `fa-cog`.

- `autopep8.button_label`:
  Toolbar button label text. Also used in the actions' help text.
  Defaults to `Prettify (using autopep8)`.

- `autopep8.register_hotkey`:
  Whether to register hotkeys to transform the selected cell(s)/whole notebook.
  Defaults to `true`.

- `autopep8.hotkeys.process_all`:
  Hotkey to use to transform all the code cells in the notebook.
  Defaults to `Alt-Shift-A`.

- `autopep8.hotkeys.process_selected`:
  Hotkey to use to transform the selected cell(s).
  Defaults to `Alt-A`.

- `autopep8.show_alerts_for_not_supported_kernel`:
  Whether to show alerts if the kernel is not supported.
  Defaults to `false`.

- `autopep8.show_alerts_for_errors`:
  Whether to show alerts for errors in the kernel calls.
  Defaults to `true`.

- `autopep8.kernel_config_map_json`:
  The value of this key is a string which can be parsed into a json object
  giving the config for each kernel language.

  The following give the per-kernel options of the parsed json, using the
  language key `python `:

  * `autopep8.kernel_config_map_json.python.library`:
    String to execute in the kernel in order to load any necessary kernel
    libraries.

  * `autopep8.kernel_config_map_json.python.replacements_json_to_kernel`:
    a list of pairs of strings, used as arguments to javascript's
    `String.replace(from, to)` to translate from a json string into a valid
    representation of the same string in the kernel language. Since json
    strings are particularly simple, this can often (as with the python
    language) be left as the default, an empty list.

  * `autopep8.kernel_config_map_json.python.prefix` and
    `autopep8.kernel_config_map_json.python.postfix`:
    Strings added as bookends to the kernel string (translated from the json
    string using the replacements above) to make up the kernel prettifier call
    kernel's prettifier libraries.

  * `autopep8.kernel_config_map_json.python.trim_formatted_text`:
    Whether to trim whitespace from the transformed cell text. Since jupyter
    cells don't usually have leading or trailing whitespace, the default
    behaviour is to trim the transformed text, in order to prevent the
    transform adding extra newlines at the end (a common behaviour for source
    files, where having a trailing newline is often considered good practice).


Internals
---------

Under the hood, this nbextension uses the [KerneExecOnCells library], a shared
library for creating Jupyter nbextensions which transform code cell text using
calls to the active kernel.

See the [shared README] for the internal model used by the nbextension.


History
-------

The project was forked by [@kenkoooo] from [@jfbercher]'s [code_prettify],
retaining most of the code.

It has since been altered to use the [KerneExecOnCells library], a shared
library for creating Jupyter nbextensions which transform code cell text using
calls to the active kernel.

[@jfbercher]: https://github.com/jfbercher
[@kenkoooo]: https://github.com/kenkoooo
[autopep8]: https://github.com/hhatto/autopep8
[code_prettify]: https://github.com/jfbercher/code_prettify
[fontawesome]: https://fontawesome.com/icons
[internals]: #Internals
[jupyter_nbextensions_configurator]: https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator
[KerneExecOnCells library]: README.md
[shared README]: README.md
