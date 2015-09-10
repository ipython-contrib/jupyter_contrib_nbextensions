# Introduction

This extension provides a web page
(which you can find by going to the '/nbextensions' URL)
which allows you to activate or deactivate installed notebook extensions,
if they provide a `YAML` file description.

Activating an extension means it is loaded automatically when working with a
notebook document.

If you encounter problems with this config page, please create an issue at the
[ipython-contrib](https://github.com/ipython-contrib/IPython-notebook-extensions)
repository.

![](https://github.com/ipython-contrib/IPython-notebook-extensions/raw/master/nbextensions/config/icon.png)

The config page is realized using a notebook server extension, new in IPython 3.x.
In order to work, this extension (`nbextensions/config`) needs to be installed.

In addition, any notebook extensions it will configure will require a YAML
description file under the `nbextensions` directory
(see installation notes, below) in order to be found.


# Setup procedure

If you've followed the
[main repository installation instructions](../../README.md), such as
using the conda recipe in `meta.yaml`,
or running `python setup.py install`,
then the nbextension config extension should already be installed, and the
documentation below is something you probably don't need to know.
Having restarted the server after the installation, you should be able to see
the configuration page by going to the URL `/nbextensions`.
Otherwise, if you didn't follow the main repository installation instructions,
you can use the detailed instructions below - good luck!


## 1. Installation

All required files for the configuration page are originally located in the
'config' subdirectory of the repository.
 * copy `nbextensions.py` to your `~/.ipython/extensions` folder (for 3.x or 4.x)
 * copy `nbextensions.html` and `rendermd.html` to your `~/.ipython/templates` folder (for 3.x or 4.x)
 * copy `main.js` and `main.css` to the `nbextensions/config/` directory, which can be found:
   * for IPython 3.x, inside your `~/.ipython` folder, so `~/.ipython/nbextensions/config/`
   * for Jupyter notebook (4.x), inside the folder given by running
     ```
     from jupyter_core.paths import jupyter_data_dir;
     print(jupyter_data_dir())
     ```
   in an ipython terminal. This varies between platforms, e.g. on Mac OSX,
   it outputs the expanded version of
   `~/Library/Jupyter`, meaning we should put them in
   `~/Library/Jupyter/nbextensions/config/`.


## 2. Configuration
To enable the config extension, you'll need to edit your notebook config file.
In 3.x, this is in your profile directory, e.g.
`~/.ipython/profile_default/ipython_notebook_config.py`
whereas in Jupyter 4.x, it's `~/.jupyter/jupyter_notebook_config.py`
(since Jupyter doesn't have a concept of profiles).

Add the following lines:

```Python
from IPython.utils.path import get_ipython_dir
import os.path
import sys

ipythondir = get_ipython_dir()
extensions = os.path.join(ipythondir,'extensions')
sys.path.append( extensions )

c = get_config()
c.NotebookApp.server_extensions = ['nbextensions']
c.NotebookApp.extra_template_paths = [os.path.join(ipythondir,'templates') ]
```


## 3. Help with locating files
If you're having problems with where the different files are supposed to go,
here's an attempt at an explanation.
Jupyter/IPython 4.x works differently than IPython 3.x:

* The notebook was split from IPython. You need to install both to run the
  notebook with IPython now.
  The easiest way is to use Anaconda and do a `conda install jupyter`
* There are no profiles anymore.
  You can specify environment variables to change the default, see
  [Jupyter ML](https://groups.google.com/forum/?utm_medium=email&utm_source=footer#!topic/jupyter/7q02jjksvFU).
* The configuration has moved to a new place. To find out where, see below.
* There is a kind of automatic upgrade of the configuration files from IPython 3.x to Jupyter.


### So where are all the config files now?
To find where the configuration files are, start IPython and run the following:

```Python
from __future__ import print_function
from jupyter_core.paths import jupyter_config_dir, jupyter_config_path
print(jupyter_config_dir())
print(jupyter_config_path())
```

`jupyter_config_dir()` shows you where your *local* configuration files are,
`jupyter_config_path()` shows you where Jupyter will look for *global* configuration files.
For the notebook, there are two files that will be used:
`jupyter_notebook_config.py` and `jupyter_notebook_config.json`.

The `nbextensions` directory has moved to a different location and can be found
in one of these directories:

```Python
from __future__ import print_function
from jupyter_core.paths import jupyter_data_dir, jupyter_path
print(jupyter_data_dir())
print(jupyter_path())
```


### Checking/loading notebook extension manually from IPython

You can check if the directory or a file (or list of files) exists:

```Python
import notebook
notebook.nbextensions.check_nbextension('usability/codefolding', user=True)
notebook.nbextensions.check_nbextension('usability/codefolding/main.js', user=True)
```

Make sure to use `user=True` if you have the extensions installed in your
local path (in `jupyter_data_dir()`) rather than in the global install location.

To enable an extension:
```Python
import notebook
Enabler = notebook.nbextensions.EnableNBExtensionApp()
Enabler.enable_nbextension('usability/codefolding/main')
```

To disable an extension:
```Python
import notebook
Disabler = notebook.nbextensions.DisableNBExtensionApp()
Disabler.disable_nbextension('usability/codefolding/main')
```

The configuration for which nbextensions are enabled is stored in
either `jupyter_config_dir()/notebok.json`
or `jupyter_config_dir()/nbconfig/notebook.json`
depending on your Jupyter (4.0.xx or master) version.

If you reload the notebook after enabling a notebook extension, the extension
should be loaded. You can check the Javascript console to confirm.


### Checking/loading notebook extension manually from the command line

Installing and activating notebook extensions works differently in Jupyter
compared to Python.
Please be aware that Jupyter is still in development stage, so some commands
are likely to change in future.

To install an extension:
```
jupyter nbextension install <name of extension>
```
Example:
```
jupyter nbextension install usability/codefolding/main
```

To activate an extension:
```
jupyter nbextension enable <name of extension>
```

To deactivate an extension:
```
jupyter nbextension disable <name of extension>
```


### Troubleshooting

If an extension doesn't work, here are some ways you can check what is wrong:

1. Clear your browser cache or start a private browser tab.
2. Verify the extension can be loaded by the IPython notebook, for example,
   load the javascript file directly:
   `http://127.0.0.1:8888/nbextensions/IPython-notebook-extensions-master/usability/runtools/main.js`
3. Check for error messages in the JavaScript console of the browser.
4. Check for any error messages in the server output logs
