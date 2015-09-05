# Introduction

The Jupyter notebook functionality (i.e. what you do with the Browser) can be extended using Javascript extensions.
This page allows you to activate or deacivate installed notebook extensions, if they provide a `YAML` file description.

Activating an extension means it is loaded automatically when working with a notebook document.
 
If you encounter problems with this page, please create an issue at the [ipython-contrib](https://github.com/ipython-contrib/IPython-notebook-extensions) repository.

The documentation below is something you probably don't need to know, if you installed the conda package.
If not, good luck!

## Now where in the world did everything go ?
Jupyter/IPython 4.x works differently than IPython 3.x.

In short
----
* The notebook was split from IPython. You need to install both to run the notebook with IPython now. The easiest way is to use Anaconda and do a `conda install jupyter`
* There are no profiles anymore. You can specify environment variables to change the default, see [Jupyter ML](https://groups.google.com/forum/?utm_medium=email&utm_source=footer#!topic/jupyter/7q02jjksvFU)].
* The configuration has moved to a new place. To find out where, see below.
* There is a kind of automatic upgrade of the configuration files from IPython 3.x to Jupyter.

## So where can I find things now?
To find where the configuration files are, start IPython 
```Python
from __future__ import print_function
from jupyter_core.paths import jupyter_config_dir, jupyter_config_path
print(jupyter_config_dir())
print(jupyter_config_path())
```
`jupyter_config_dir()` shows you where your *local* configuration files are, `jupyter_config_path` shows you where Jupyter will look for configuration files. For the notebook, there are two files that will be used:
`jupyter_notebook_config.py` and `jupyter_notebook_config.json`. 

The `nbextension` directory has moved to a different location and can be found in one of these directories:
```Python
from __future__ import print_function
from jupyter_core.paths import jupyter_data_dir, jupyter_path
print(jupyter_data_dir())
print(jupyter_path())
```

## Checking/loading notebook extension manually from IPython
You can check if the directory or a file (or list of files) exists:
```Python
import notebook
notebook.nbextensions.check_nbextension('usability/codefolding', user=True)
notebook.nbextensions.check_nbextension('usability/codefolding/main.js', user=True)
```
Make sure to use `user=True` if you have the extensions installed in your local path (in `jupyter_data_dir()`).

To enable an extension:
```Python
import notebook
E = notebook.nbextensions.EnableNBExtensionApp()
E.enable_nbextension('usability/codefolding/main')
```

To disable an extension:
```Python
import notebook
D = notebook.nbextensions.DisableNBExtensionApp()
D.disable_nbextension('usability/codefolding/main')
```
The configuration is stored in either `jupyter_config_dir()/notebok.json` or `jupyter_config_dir()/nbconfig/notebook.json` 
depending on your Jupyter (4.0.xx or master) version.

If you reload the notebook after enabling a notebook extension, the extension will be loaded. You can check the Javascript console to confirm.


# General extension installation instructions
Installing and activating notebook extensions works differently in Jupyter compared to Python. Please be aware that Jupyter is still in development stage and some commands would change in future. 

* There is a graphical interface for activating/deactivating notebook extensions now. You might want to use it:
[config-extension](config-extension)

##1. Installing an extension

`jupyter nbextension install <name of extension>`

Example:
`jupyter nbextension install usability/codefolding/main`

##2. Activating an extension

`jupyter nbextension enable <name of extension>`

##3. Deactivating extensions

`jupyter nbextension disable <name of extension>`

## Troubleshooting
If the extension does not work, here is how you can check what is wrong:

1. Clear your browser cache or start a private browser tab.
2. Verify the extension can be loaded by the IPython notebook, for example:
    `http://127.0.0.1:8888/nbextensions/IPython-notebook-extensions-master/usability/runtools/main.js`
3. Check for error messages in the JavaScript console of the browser. 
