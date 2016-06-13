Introduction
============

This jupyter server extension provides a web page
(which you can find by going to the `/nbextensions` URL)
which allows you to enable or disable installed notebook extensions,
if they provide a `YAML` file description.

If you have a non-default base url (such as with JupyterHub), you'll need to
prepend it to the url. So, if your dashboard is at

```
http://localhost:8888/custom/base/url/tree
```

then you'll find the nbextensions configuration page at

```
http://localhost:8888/custom/base/url/nbextensions
```

Enabling an extension means it is loaded automatically when working with a
notebook document.

If you encounter problems with this config page, please create an issue at the
[ipython-contrib](https://github.com/ipython-contrib/IPython-notebook-extensions)
repository.

![](icon.png)

The configurator page is realized using a notebook server extension, new in
IPython 3.x. In order to work, this server extension needs to be installed.

In addition, any notebook extensions it will configure will require a YAML
description file under the `nbextensions` directory
(see installation notes, below) in order to be found.

You can see a video of the config extension in action on youtube:

[![config extension on youtube](https://i.ytimg.com/vi_webp/h9DEfxZSz2M/maxresdefault.webp)](https://youtu.be/h9DEfxZSz2M)


Setup procedure
===============


The simplest way to install the config extension is to install the
ipython-contrib extensions repository.
There are several ways to install the IPython-contrib extensions repository.
See the [main repository readme][main repository readme url] for details.

[main repository readme url]: https://github.com/ipython-contrib/IPython-notebook-extensions/README.md

Having restarted the server after the installation, you should be able to see the configuration page by going to the URL `/nbextensions`.


Internals
=========

The configuration for which notebook extensions are enabled is stored in
`jupyter_config_dir()/nbconfig/notebook.json`.
There are also some extensions for other parts of jupyter which are enabled in
other config section, such as the `tree-filter` extension for the file tree
view, which is enabled/disabled in the config file
`jupyter_config_dir()/nbconfig/tree.json`.


You can generate a table of currently enabled extensions for the notebook
section by executing the following in a notebook cell:

```Python
from notebook.services.config.manager import ConfigManager
from IPython.display import HTML

cm = ConfigManager()
extensions = cm.get('notebook').get('load_extensions', {})
table = """
<table border="1">
  <tr><th>Extension name</th><th>Enabled</th></tr>
  {}
</table>
""".format(
    '\n  '.join([
        '<tr><td>{}</td><td>{}</td>'.format(ext, bool(enabled))
        for ext, enabled in extensions.items()
    ])
)
HTML(table)
```

If you reload the notebook after enabling a notebook extension, the extension
should be loaded. You can also check the Javascript console to confirm.

YAML file format
----------------
A notebook extension is 'found' by the configurator server extension when a
special YAML file describing the nbextension and its options is found in the
notebook server's `nbextensions_path`.
The YAML file can have any name with the extension `.yaml` or `.yml`, and
describes the notebook extension and its options to the configurator server
extension.
Note that keys (in bold) are case-sensitive.
The keys `Type` and `Main` are required, all others are optional (though recommended!).

* **Type**          - (*required*) identifier, must be `IPython Notebook Extension` or `Jupyter Notebook Extension` (case sensitive)
* **Name**          - unique name of the extension
* **Description**   - short explanation of the extension
* **Link**          - a url for more documentation. If this is a relative url with a `.md` extension (recommended!), the markdown readme is rendered on the config page.
* **Icon**          - a url for a small icon for the config page (rendered 120px high, should preferably end up 400px wide. Recall HDPI displays may benefit from a 2x resolution icon).
* **Main**          - (*required*) main javascript file that is loaded, typically `main.js`
* **Compatibility** - IPython/Jupyter major version compatibility, e.g. `3.x` or `4.x`, `3.x 4.x`, `3.x, 4.x, 5.x`
* **Parameters**    - Optional list of configuration parameters. Each item is a dictionary with (some of) the following keys:
  * **name**        - (*required*) this is the name used to store the configuration variable in the config json. It follows a json-like structure, so you can use `.` to separate sub-objects e.g. `myextension.buttons_to_add.play`.
  * **description** - description of the configuration parameter
  * **default**     - a default value used to populate the tag on the nbextensions config page if no value is found in config. Note that this is more of a hint to the user than anything functional - since it's only set in the yaml file, the javascript implementing the extension in question might actually use a different default, depending on the implementation.
  * **input_type**  - controls the type of html tag used to render the parameter on the configuration page. Valid values include `text`, `textarea`, `checkbox`, [html5 input tags such as `number`, `url`, `color`, ...], plus a final type of `list`
  * **list_element** - for parameters with input_type `list`, this is used in place of `input_type` to render each element of the list
  * finally, extras such as **min** **step** **max** may be used by `number` tags for validation

Example:

```yaml
Type: IPython Notebook Extension
Name: Limit Output
Description: This extension limits the number of characters that can be printed below a codecell
Link: readme.md
Icon: icon.png
Main: main.js
Compatibility: 4.x
Parameters:
- name: limit_output
  description: Number of characters to limit output to
  input_type: number
  default: 10000
  step: 1
  min: 0
- name: limit_output_message
  description: Message to append when output is limited
  input_type: text
  default: '**OUTPUT MUTED**'
```


Troubleshooting
===============

If an extension doesn't work, here are some ways you can check what is wrong:

1. Clear your browser cache or start a private browser tab.
2. Verify the extension can be loaded by the notebook, for example,
   load the javascript file directly:
   `http://127.0.0.1:8888/nbextensions/usability/runtools/main.js`
3. Check for error messages in the JavaScript console of the browser.
4. Check for any error messages in the notebook server output logs
