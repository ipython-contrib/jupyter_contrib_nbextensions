KernelExecOnCells library and nbextensions
==========================================

The KernelExecOnCells library is a shared library for creating Jupyter
nbextensions which transform code cell text using calls to the active kernel.

This scheme has been applied to create several nbextensions which are also
included in the repository.
For instance, to prettify code, see the [code-prettify] nbextension, or to
refactor python 2 code for python 3, see the [2to3] extension.
These nbextensions are defined as simple plugins of the main KernelExecOnCells
library. Defining such a plugin, [jupyter-autopep8], is described in the last section below.


Compatible Kernels
------------------

The library is kernel-language agnostic, as described in the [internals]
section below. Essentially any kernel capable of interpreting and creating
json-formatted strings, and sending them to the stream output (where print
statements in most languages go) should be easy to integrate.
Hopefully, that covers pretty much all languages!


Options
-------

The library uses a series of options, describing the configuration of the
plugin. Default values for these options are specified as an object in the
plugin source file, and can be overriden by values loaded from config.
There are a few nbextension-wide options, configurable using the
[jupyter_nbextensions_configurator] or by editing the `notebook` section config
file directly.
If `mod_name` is the name of the plugin module (e.g. `code_prettify`, `2to3`,
...) and `LANG` the lowercased kernel language (eg julia, python, r ...), then
the options are as follows:

- `mod_name.add_toolbar_button`:
  Whether to add a toolbar button to transform the selected cell(s).
  Defaults to `true`.

- `mod_name.button_icon`:
  A font-awesome class defining the icon used for the toolbar button and
  actions. See [fontawesome] for available icon classes.
  Defaults to `fa-legal`.

- `mod_name.button_label`:
  Toolbar button label text. Also used in the actions' help text.
  Defaults to `mod_name`.

- `mod_name.register_hotkey`:
  Whether to register hotkeys to transform the selected cell(s)/whole notebook.
  Defaults to `true`.

- `mod_name.hotkeys.process_all`:
  Hotkey to use to transform all the code cells in the notebook.
  Defaults to `Ctrl-Shift-L`.

- `mod_name.hotkeys.process_selected`:
  Hotkey to use to transform the selected cell(s).
  Defaults to `Ctrl-L`.

- `mod_name.show_alerts_for_errors`:
  Whether to show alerts for errors in the kernel calls.
  Defaults to `true`.

- `mod_name.kernel_config_map_json`:
  The value of this key is a string which can be parsed into a json object
  giving the config for each kernel language.

  The following give the per-kernel options of the parsed json, using the
  language key `LANG`, to be replaced as appropriate:

  * `mod_name.kernel_config_map_json.LANG.library`:
  String to execute in the kernel in order to load any necessary kernel
  libraries.

  * `mod_name.kernel_config_map_json.LANG.replacements_json_to_kernel`:
    a list of pairs of strings, used as arguments to javascript's
    `String.replace(from, to)` to translate from a json string into a valid
    representation of the same string in the kernel language. Since json
    strings are particularly simple, this can often (as with the python
    language) be left as the default, an empty list.

  * `mod_name.kernel_config_map_json.LANG.prefix` and
    `mod_name.kernel_config_map_json.LANG.postfix`:
    strings added as bookends to the kernel string (translated from the json
    string using the replacements above) to make up the kernel prettifier call
    kernel's prettifier libraries.

  * `mod_name.kernel_config_map_json.LANG.trim_formatted_text`:
    Whether to trim whitespace from the transformed cell text. Since jupyter
    cells don't usually have leading or trailing whitespace, the default
    behaviour is to trim the transformed text, in order to prevent the
    transform adding extra newlines at the end (a common behaviour for source
    files, where having a trailing newline is often considered good practice).


Internals
---------

The model is essentially:

1.  The cell text is grabbed by client-side javascript, then turned into a json
    string using javascript `JSON.stringify`. Since json-compatible strings are
    a particularly simple string format, which is compatible with many other
    programming languages without much modification (e.g. a valid json string
    is also a valid string in python 3, and also in python 2 when prefixed with
    a `u`), and easily converted for use in others (because of its simplicity).

2.  Optional regex replacements are used to translate the json-format string
    into a valid kernel string. Python, R and javascript don't require this
    step, but other  languages may do, so it's implemented for flexibility
    using the per-kernel config key `replacements_json_to_kernel`, which is a
    list of pairs of arguments to javascript `String.replace`.

3.  The kernel-specific prettifier call is then composed from
    `kernel_config.prefix` + `kernel_text_string` + `kernel_config.postfix` and
    sent to the kernel for execution. This kernel call is expected to get the
    formatted cell text _printed_ as a json-compatible string. Since most
    kernel languages have json packages, this should hopefully be easy to
    arrange. The reason for the printing text rather than simply displaying it,
    is that it prevents us having to translate from a kernel string
    representing a json string.

4.  The callback for the kernel execution in client-side javascript parses the
    printed json-format string, optionally trims trailing whitespace according
    to the `trim_formatted_text` key (which defaults to `true`) in the
    per-kernel config, and then sets the cell text using the result.

The process is probably best illustrated using an example for the python
implementation in `code_prettify`:

1.  **At nbextension load**, the `code_prettify.kernel_config_map_json` config
    option is parsed to give the json object

    ```json
    {
      "python": {
        "library": "import json\nimport yapf.yapflib.yapf_api",
        "prefix": "print(json.dumps(yapf.yapflib.yapf_api.FormatCode(u",
        "postfix": ")[0]))"
      }
    }
    ```

    (other kernel languages are omitted for clarity).

2.  **On kernel becoming ready**, the nbextension looks up the config for the
    kernel's language (in our example, this is the `python` key of the kernel
    config json object above). It then sends the kernel config's `library`
    string to the kernel for execution. Thus the python implementation above
    executes

    ```python
    import json
    import yapf.yapflib.yapf_api
    ```

3.  **On requesting a cell be prettified** which can happen by clicking the
    toolbar, or with a (configurable) hotkey, the following happens:

    Say the cell to be formatted contains the following ugly python code:

    ```python
    msg= 'hello '+"world"
    print  (
                        msg    )
    ```

    Then the result of the `JSON.stringify` call will be a string containing

    ```json
    "msg= 'hello '+\"world\"\nprint  (\n                    msg    )"
    ```

    (note the opening and closing quotes). Concatenating this with the prefix &
    postfix strings from the python kernel config above, gives us the kernel
    code to execute. The call sent to the python kernel is therefore

    ```python
    print(json.dumps(yapf.yapflib.yapf_api.FormatCode(u"msg= 'hello '+\"world\"\nprint  (\n                    msg    )")[0]))
    ```

4.  What gets 'printed' by the kernel (i.e. returned to the javascript stream
    callback) is the following json-format string:

    ```json
    "msg = 'hello ' + \"world\"\nprint(msg)\n"
    ```

    The default is to trim whitepace from the returned prettified text, which
    results in the final prettified python code for the cell:

    ```python
    msg = 'hello ' + "world"
    print(msg)
    ```


Defining a new plugin
---------------------

As an example, we will add a new plugin which reformats code using the
[autopep8] module in python, rather than the [yapf] library used by
`code_prettify`. Such a plugin, [jupyter-autopep8] was developed by [@kenkoooo]
as a fork of an old version of `code_prettify`. Redefining it here has the
advantage of using the updated and more-robust architecture, in addition to
making it possible to reformat the whole notebook in one go.

For this new nbextension, we just have to run `import autopep8` as the kernel
library code, and then call the `autopep8.fix_code` function on cells' text.
Hence what we have to do is:

- copy `code_prettify.js` to `autopep8.js`

- update `mod_name`, `hotkeys`, `button_icon` default config values in the new
  `autopep8.js`. Also update the `cfg.kernel_config_map` value to use the
  correct kernel code:
  ```javascript
  cfg.kernel_config_map = { // map of options for supported kernels
      "python": {
          "library": "import json\nimport autopep8",
          "prefix": "print(json.dumps(autopep8.fix_code(u",
          "postfix": ")))"
      }
  };
  ```

- copy `code_prettify.yaml` to `autopep8.yaml`, and update its values (name,
  require, readme, plus the new defaults for hotkeys, icon, and
  kernel_config_map

- that's all :-)

Of course, for this simple case, one could equally have just updated the
configuration of `code_prettify` using the [jupyter_nbextensions_configurator]
to use [autopep8] instead of [yapf] to reformat the python code.
But, if you want two alternative prettifiers available for the same kernel
language, we need to define separate plugins.

Custom Yapf Styles
------------------

Using the default `yapf` engine, one may define a custom formatting style according to the [package documentation](https://github.com/google/yapf#formatting-style).

The `code_prettify` extension is configured to follow the default `yapf` ordering (minus the command line option) and will search for the formatting style in the following manner:

> 1. In the [style] section of a .style.yapf file in either the current directory or one of its parent directories.
> 2. In the [yapf] section of a setup.cfg file in either the current directory or one of its parent directories.
> 3. In the ~/.config/yapf/style file in your home directory.
>
> If none of those files are found, the default style is used (PEP8).

This means that one can set up a globa custom yapf style using `~/.config/yapf/style` or a project-specific one using the project directory.

History
-------

- [@jfbercher], august 14, 2016, first version, named `yapf_ext`
- [@jfbercher], august 19, 2016, second version `code_prettify`
  - introduced support for R and javascript.
  - changed extension name from `yapf_ext` to `code_prettify`
- [@jcb91], december 2016
  - made addition of toolbar button & hotkey configurable
  - reworked to avoid regex replacements for conversion to/from kernel string
    formats, in favour of json-string interchange
  - made kernel-specific prettifier calls configurable, allowing support for
    different prettifiers & arbitrary kernels
  - improved documentation
- [@jfbercher], december 2016-january 2017
  - added a configurable shortkey to reflow the whole notebook
  - extracted most of the code to build a general library of functions,
    `kernel_exec_on_cell.js`, which can be used for all nbextensions which
    needs to exec some code (via the current kernel) on the text from cells.
  - added 2to3 as a plugin to the shared library
- [@jcb91], january 2017
  - library: Use actions to avoid problems with auto-generated actions
    generated by keyboard_manager, which were overwriting each other.
    Also fix toolbar button removal.
- [@jfbercher], january 2017
  - updated documentation
  - added autopep8 nbextension as a plugin using the shared library
- [@artificialsoph], Jan 2018
  - updated documentation
  - changed default behavior to load custom yapf styles
- [@jfbercher], April 2019
  - corrected an issue in configs merge
  - added an option for displaying an alert if kernel is not supported and turned it off by default (instead issue a warning in the js console). 

[2to3]: README_2to3.md
[@jcb91]: https://github.com/jcb91
[@jfbercher]: https://github.com/jfbercher
[@kenkoooo]: https://github.com/kenkoooo
[autopep8]: https://github.com/hhatto/autopep8
[code-prettify]: README_code_prettify.md
[jupyter-autopep8]: README_autopep8.md
[fontawesome]: https://fontawesome.com/icons
[internals]: #Internals
[jupyter-autopep8]: https://github.com/kenkoooo/jupyter-autopep8
[jupyter_nbextensions_configurator]: https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator
[yapf]: https://github.com/google/yapf
