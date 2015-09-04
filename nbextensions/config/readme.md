# Introduction

The Jupyter notebook functionality (i.e. what you do with the Browser) can be extended using Javascript extensions.
This page allows you to activate or deacivate installed notebook extensions, if they provide a `YAML` file description.

Activating an extension means it is loaded automatically when working with a notebook document.
 
If you encounter problems with this page, please create an issue at the [ipython-contrib](https://github.com/ipython-contrib/IPython-notebook-extensions) repository.

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
