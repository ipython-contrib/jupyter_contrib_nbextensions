Printview
=========
This extension adds a toolbar button to call `jupyter nbconvert` for the current the notebook and optionally display the converted file in a
new browser tab.

![printview toolbar button](printview-button.png)

Supported ouput types to display in a tab are `html` and `pdf`.

Parameters
----------

 - **`printview_nbconvert_options`**: Options to pass to nbconvert. Default: `--to html`
   To convert to PDF you can use ` --to pdf`. 
   Using `--to pdf --template printviewlatex.tplx` as the parameter, using a
   custom template generates a nice looking PDF document.
   **Note**: Converting to PDF requires a Latex installation running on the
   notebook server.

 - **`printview_open_tab`**: After conversion, open a new tab.
   Only available when converting to html or pdf output format. Default true.


Note
----

If you use matplotlib plots and want to generate a PDF document, it is useful to have the IPython backend generate high quality pdf versions of plots
 using this code snippet:

```python
ip = get_ipython()
ibe = ip.configurables[-1]
ibe.figure_formats = { 'pdf', 'png'}
```

Internals
---------

The configuration is stored in the Jupyter configuration path `nbconfig/notebook.js` using two keys:
`printview_nbconvert_options` and `printview_open_tab`.

You can check the current configuration using the
[jupyter_nbextensions_configurator](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator)
server extension, or with this code snippet:

```python
import os
from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir
from traitlets.config.loader import Config, JSONFileConfigLoader

json_config = os.path.join(jupyter_config_dir(), 'nbconfig/notebook.json')
if os.path.isfile(json_config) is True:
    cl = JSONFileConfigLoader(json_config)
    config = cl.load_config()
    for k in config:
        if k.startswith('printview'):
            print("%s: %s" % (k, config[k]))
```
