A Code Prettifier
=================

This extension reformats/prettifies code in a notebook's code cell.

Under the hood, it uses a call to the current notebook kernel to reformat the
code. Thus the actual prettifier package has to be callable from
the current kernel language.
Example implementations for prettifiers for ipython, ir and ijavascript kernels
are provided which should work out of the box (assuming availability of the
relevant kernel-specific [prerequisites](#prerequisites) mentioned below), but
the kernel-specific prettifier calls are configurable, so the model is
applicable to essentially any kernel language.
Other languages may be added as defaults in the future, but given that there
are more than 50
[kernels](https://github.com/ipython/ipython/wiki/IPython-kernels-for-other-languages)
available for Jupyter, it is not easily possible to support all of them out of
the box, unless people with experience in the relevant kernels have the time to
contribute code. For information on how the reformatting takes place, and how
to adapt it for your particular kernel/prettifier, see the
[internals](#internals) section below.

Under the hood, it uses the [KerneExecOnCells](README_kernelExecOncells.md) library, shared between `code_prettify`, `autopep8` and `2to3` (to date)

With an appropriately-configured prettifier for the kernel in use, the
nbextension provides

- a toolbar button (configurable to be added or not)
- a keyboard shortcut for reformatting the current code-cell (default shortcut
  is `Ctrl-L`, can also be configured not to add the keyboard shortcut).
- a keyboard shortcut for reformatting the whole notebook (default shortcut
  is `Ctrl-Shift-L`, can also be configured not to add the keyboard shortcut).
Syntax shall be correct. The nbextension will also point basic syntax errors.

Syntax shall be correct. The nbextension will also point basic syntax errors.

![](demo-py.gif)
![](demo-R.gif)
![](demo-jv.gif)


prerequisites
-------------

Of course, you must have the necessary kernel-specific packages installed for
the prettifier call to work:

- for the default python implementation, the
  [YAPF](https://github.com/google/yapf) module is required:

      pip install yapf

  Others you might consider using include [autopep8](https://github.com/hhatto/autopep8).

- for R, the default implementation uses the
  [formatR](http://yihui.name/formatR/) and
  [jsonlite](https://github.com/jeroenooms/jsonlite) packages:

  ```r
  install.packages(c("formatR", "jsonlite"), repos="http://cran.rstudio.com")
  ```

- for [ijavascript](http://n-riesco.github.io/ijavascript/), the
  [js-beautify](https://github.com/beautify-web/js-beautify) package is used:
  (*Under linux, in the root of your user tree = ~*)

      npm install js-beautify

  Under Windows, you may then need to set the `NODE_PATH` environment variable
  (see [this question on stackoverflow](http://stackoverflow.com/questions/9587665/nodejs-cannot-find-installed-module-on-windows))
  to it to `%AppData%\npm\node_modules` (Windows 7/8/10).
  To be done with it once and for all, add this as a System variable in the
  Advanced tab of the System Properties dialog.


options
-------

There are a few nbextension-wide options, configurable using the
[jupyter_nbextensions_configurator](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator)
or by editing the `notebook` section config file directly:

- `code_prettify.add_toolbar_button`: Whether to add a toolbar button to
  prettify the selected cell(s), defaults to `true`.
- `code_prettify.button_icon`: a font-awesome class defining the icon used for
  the toolbar button and actions. See
  [http://fontawesome.io/icons/](http://fontawesome.io/icons/)
  for available icon classes. Defaults to `fa-legal`.
- `code_prettify.button_label`: Toolbar button label text. Also used in the
  actions' help text. Defaults to  `Code prettify`.
- `code_prettify.register_hotkey`:  Whether to register a hotkey to prettify
  the selected cell(s). defaults to `true`.
- `code_prettify.hotkeys.process_selected`:  Hotkey to use to prettify the
  selected cell(s). defaults to `Ctrl-L`
- `code_prettify.hotkeys.process_all`:  Hotkey to use to prettify all
  cells in the notebook. Defaults to `Ctrl-Shift-L`
- `code_prettify.show_alerts_for_errors`:  Whether to show alerts for errors in
  the kernel prettifying calls. Defaults to `true`

The following give the per-kernel options as keys for the python language:

- `code_prettify.kernel_config_map_json` The value of this key is a string
  which can be parsed into a json object giving the config for each kernel
  language. Relevant keys, using the python language key:

  * `code_prettify.kernel_config_map_json.python.library`: string to load the
    kernel's prettifier libraries. For python, defaults to

    ```python
    import json
    import yapf.yapflib.yapf_api
    ```

  * `code_prettify.kernel_config_map_json.python.replacements_json_to_kernel`:
    a list of pairs of strings, used as arguments to javascript's
    `String.replace(from, to)` to translate from a json string into a valid
    representation of the same string in the kernel language. Since json
    strings are particularly simple, this can often (as with the python
    language) be left as the default, an empty list.

  * `code_prettify.kernel_config_map_json.python.prefix` and
    `code_prettify.kernel_config_map_json.python.postfix`: strings added as
    bookends to the kernel string (translated from the json string using the
    replacements above) to make up the kernel prettifier call kernel's
    prettifier libraries.

  * `code_prettify.kernel_config_map_json.python.trim_formatted_text`: whether
    to trim whitespace from the prettified cell. Since jupyter cells don't
    usually have leading or trailing whitespace, the default behaviour is to
    trim the prettified text, in order to prevent the prettifying adding extra
    newlines at the end (a common behaviour for source files, where having a
    trailing newline is often considered good practice).


internals
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
implementation:

1.  **At nbextension load**, the `code_prettify.kernel_config_map_json` config
    parameter is parsed to give the json object

    ```json
    {
      "python": {
        "library": "import json\nimport yapf.yapflib.yapf_api",
        "prefix": "print(json.dumps(yapf.yapflib.yapf_api.FormatCode(u",
        "postfix": ")[0]))"
      }
    }
    ```

    (other kernel laguages are omitted for clarity).

2.  **On kernel becoming ready**, the nbextension looks up the config for the
    kernel's language (in our example, this is the `python` key of the kernel
    config json object above). It then sends the kernel config's `library`
    string  to the kernel for execution. Thus the python implementation above
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

4.  What gets 'printed' by the kernel (i.e. returned to the javascript
    stream callback) is the following json-format string:

    ```json
    "msg = 'hello ' + \"world\"\nprint(msg)\n"
    ```

    The default is to trim whitepace from the returned prettified text, which
    results in the final prettified python code for the cell:

    ```python
    msg = 'hello ' + "world"
    print(msg)
    ```


History:
---------

- [@jfbercher](https://github.com/jfbercher), august 14, 2016, first version.
- [@jfbercher](https://github.com/jfbercher), august 19, 2016, second version,
  - introduced support for R and javascript.
  - changed extension name from `yapf_ext` to `code_prettify`
- [@jcb91](https://github.com/jcb91), december 2016
  - made addition of toolbar button & hotkey configurable
  - reworked to avoid regex replacements for conversion to/from kernel string
    formats, in favour of json-string interchange
  - made kernel-specific prettifier calls configurable, allowing support for
    different prettifiers & arbitrary kernels
  - improved documentation
- [@jfbercher](https://github.com/jfbercher), december 2016
  - added a configurable shortkey to reflow the whole notebook
  - extracted most of the code to build a general library of functions, `kernel_exec_on_cell.js`, which can be used for all nbextensions which needs to exec some code (via the current kernel) on the text from cells.  
