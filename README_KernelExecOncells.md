KernelExecOnCells library
=========================

The KernelExecOnCells library provides a set of functions which enable to execute an external function, through the current Jupyter kernel, on the text of selected cells, and replace this text with the output of the external function. This scheme has been applied, for instance, to prettify code, see the [code-prettify](README_code_prettify.md) extension or to refactor it, see the [2to3](README_2to3.md) extension. 
These extensions are defined as simple plugins of the library. Defining such a plugin is described in the last section below. 

parameters
----------
The library uses a series of parameters, describing the configuration of the plugin. These parameters are specified as an object in the plugin source file. There are a few nbextension-wide options, configurable using the
[jupyter_nbextensions_configurator](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator)
or by editing the `notebook` section config file directly. Let `mod_name` be the name of the plugin module (eg code_prettify, 2to3, ...) and `LANG` the kernel language (eg julia, python, R...). These parameters are as follows:

- `mod_name.add_toolbar_button`: Whether to add a toolbar button to
  apply the kernel function to the selected cell(s), defaults to `true`.
- `mod_name.register_hotkey`:  Whether to register a hotkey to apply the kernel function to
  the selected cell(s). defaults to `true`.
- `mod_name.hotkey`:  Hotkey to use to apply the kernel function to the selected cell(s).
  defaults to `Ctrl-L`
- `mod_name.show_alerts_for_errors`:  Whether to show alerts for errors in
  the kernel calls. Defaults to `true`

The following give the per-kernel options as keys for the python language:

- `mod_name.kernel_config_map_json` The value of this key is a string
  which can be parsed into a json object giving the config for each kernel
  language. Relevant keys, using the python language key:

  * `mod_name.kernel_config_map_json.LANG.library`: string to load the
    kernel's prettifier libraries. For python, defaults to

    ```python
    import json
    import yapf.yapflib.yapf_api
    ```

  * `mod_name.kernel_config_map_json.LANG.replacements_json_to_kernel`:
    a list of pairs of strings, used as arguments to javascript's
    `String.replace(from, to)` to translate from a json string into a valid
    representation of the same string in the kernel language. Since json
    strings are particularly simple, this can often (as with the python
    language) be left as the default, an empty list.

  * `mod_name.kernel_config_map_json.LANG.prefix` and
    `mod_name.kernel_config_map_json.LANG.postfix`: strings added as
    bookends to the kernel string (translated from the json string using the
    replacements above) to make up the kernel prettifier call kernel's
    prettifier libraries.

  * `mod_name.kernel_config_map_json.LANG.trim_formatted_text`: whether
    to trim whitespace from the resulting cell text. Since jupyter cells don't
    usually have leading or trailing whitespace, the default behaviour is to
    trim the output text, in order to prevent the output of the kernel function adding extra
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
implementation in `code_prettify`:

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

adding a new plugin
-------------------

As an example, we will add a new plugin which reformats code sing the autopep8 module in python. Such a plugin, [jupyter-autopep8](https://github.com/kenkoooo/jupyter-autopep8) has be developed by @kenkoooo as a fork of an old version of `code_prettify`. Redefining it here has the advantage of using the updated and more robust architecture, in addition to the possibilty to reformat the whole notebook at once. For that extension, we just have to run `import autopep8` as the library,  and then call `autopep8.fix_code` on cells' text. Hence what we have to do is:

- copy code_prettify.js to autopep8.js
- update `mod_name`, `hotkeys`, `button_icon`
- update cfg.kernel_config_map into     
```
cfg.kernel_config_map = { // map of parameters for supported kernels
        "python": {
            "library": "import json\nimport autopep8",
            "prefix": "print(json.dumps(autopep8.fix_code(u",
            "postfix": ")))"
        }
    };
```
- copy code_prettify.yaml into autopep8.yaml 
- update values in autopep8.yaml (replace code_prettify by autopep8, update hotkeys, icon, and kernel_config_map)
- that's all :-)

Of course, one can also update the configuration of `code_prettify` using the nbextensions_configurator to use autopep8 instead of yapf to reformat python code.  

History:
-------

- [@jfbercher](https://github.com/jfbercher), august 14, 2016, first version [yapf_ext]
- [@jfbercher](https://github.com/jfbercher), august 19, 2016, second version [code_prettify]
  - introduced support for R and javascript.
  - changed extension name from `yapf_ext` to `code_prettify`
- [@jcb91](https://github.com/jcb91), december 2016
  - made addition of toolbar button & hotkey configurable
  - reworked to avoid regex replacements for conversion to/from kernel string
    formats, in favour of json-string interchange
  - made kernel-specific prettifier calls configurable, allowing support for
    different prettifiers & arbitrary kernels
  - improved documentation
- [@jfbercher](https://github.com/jfbercher), december 2016-january 2017
  - added a configurable shortkey to reflow the whole notebook
  - extracted most of the code to build a general library of functions, `kernel_exec_on_cell.js`, which can be used for all nbextensions which needs to exec some code (via the current kernel) on the text from cells. 
  - added 2to3 as a plugin to the shared library
- [@jcb91](https://github.com/jcb91), january 2017
  - [code_prettify lib] use actions to avoid problems with auto-generated actions generated by keyboard_manager,
which were overwriting each other.This has the added benefit of allowing the action to be used in the command palette.
Also fix toolbar button removal, which was removing only the button, leaving the button group behind.  
- [@jfbercher](https://github.com/jfbercher), january 2017
  - updated documentations
  - added autopep8 as a plugin to the shared library
