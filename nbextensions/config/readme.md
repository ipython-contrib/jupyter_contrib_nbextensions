Introduction
============

This extension provides a web page
(which you can find by going to the '/nbextensions' URL)
which allows you to activate or deactivate installed notebook extensions,
if they provide a `YAML` file description.

Activating an extension means it is loaded automatically when working with a
notebook document.

If you encounter problems with this config page, please create an issue at the
[ipython-contrib](https://github.com/ipython-contrib/IPython-notebook-extensions)
repository.

![](icon.png)   

The config page is realized using a notebook server extension, new in IPython 3.x.
In order to work, this extension (`nbextensions/config`) needs to be installed.

In addition, any notebook extensions it will configure will require a YAML
description file under the `nbextensions` directory
(see installation notes, below) in order to be found.

You can see a video of the config extension in action on youtube:

<div class="embed-responsive embed-responsive-4by3">
  ![config extension on youtube](https://i.ytimg.com/vi_webp/h9DEfxZSz2M/maxresdefault.webp)
  [](https://youtu.be/h9DEfxZSz2M)
</div>

Setup procedure
===============

The most recent version
can be found here:
[master.zip](https://github.com/ipython-contrib/IPython-notebook-extensions/archive/master.zip)   

https://binstar.org/juhasch/nbextensions

1. Installation
---------------

There are several ways to install the IPython-contrib extensions package:

 a) Using `setup.py` 777  
After downloading the most recent version from GitHub [master.zip](https://github.com/ipython-contrib/IPython-notebook-extensions/archive/master.zip),
   unpack the archive and run `python setup.py install`. This will copy all extensions to your local Jupyter installation
   and configure the extensions to work.   

 b) Installing the Anaconda package   
When using the Anaconda Python installation (highly recommended), you can install the package using the
  `conda install -c https://conda.binstar.org/juhasch nbextensions` command. Alternatively, you can download the latest master
  version and do a `conda build IPython-notebook-extensions` yourself to build the Anaconda package.
  
c) Manual installation (see below)

The easiest way is to do a) and install the extensions using the `python setup.py install` command.


Having restarted the server after the installation, you should be able to see the configuration page by going to the URL `/nbextensions`.
Otherwise, you can use the detailed instructions below - good luck!

**Note**: The notebook server is not allowed to run during installation.

1a. Manual Installation
-----------------------

 * copy the `nbextensions` folder to `~/Library/Jupyter` (on MacOs, for help locating Jupyter data dir on other OS look in 3.)
 * copy the `extensions` folder to `~/Library/Jupyter`
 * copy the `templates` folder to `~/Library/Jupyter`


2. Configuration
----------------

There are two configuration steps required:

 1. Edit your `.jupyter/jupyter_notebook_config.py` file (on MacOs, for help locating the Jupyter config dir on other OS look in 3.):
     ```
    from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir
    import os
    import sys
    
    sys.path.append(os.path.join(jupyter_data_dir(), 'extensions'))
    
    c = get_config()
    c.NotebookApp.extra_template_paths = [os.path.join(jupyter_data_dir(),'templates') ]
    ```
    And `.jupyter/jupyter_notebook_config.py`
    ```
    from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir
    import os
    import sys
    
    sys.path.append(os.path.join(jupyter_data_dir(), 'extensions'))
    
    c = get_config()
    c.Exporter.template_path = [os.path.join(jupyter_data_dir(), 'templates') ]
    ```
    This makes sure the Python extensions are found in the `~/Library/Jupyter/extensions` directory and the 
    additional templates are found in `~/Library/Jupyter/templates`

 2. Configure the server extension, and pre-/postprocessessors:   
    Edit the `.jupyter/jupyter_notebook.json` to look like this
     ```
     {
      "Exporter": {
        "preprocessors": [
          "pre_codefolding.CodeFoldingPreprocessor",
          "pre_pymarkdown.PyMarkdownPreprocessor"
        ]
      },
      "NbConvertApp": {
        "postprocessor_class": "post_embedhtml.EmbedPostProcessor"
      },
      "NotebookApp": {
        "server_extensions": [
          "nbextensions"
        ]
      },
      "version": 1
    }
    ```
 Edit the `.jupyter/jupyter_nbconvert.json` to look like this:
     ```
      {
      "Exporter": {
        "preprocessors": [
          "pre_codefolding.CodeFoldingPreprocessor",
          "pre_pymarkdown.PyMarkdownPreprocessor"
        ]
      },
      "NbConvertApp": {
        "postprocessor_class": "post_embedhtml.EmbedPostProcessor"
      },
      "version": 1
    }
    ```
    This will load the `nbextensions` server extension in the notebook, and add several pre/- and postprocessors that
     are required by notebook extensions to export notebooks using `jupter nbconvert` 
     (namely Codefolding, Python Mmarkdown, Runtools).
     
     
    
3. Help with locating files
---------------------------

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


Internals
=========

The configuration for which nbextensions are enabled is stored in `jupyter_config_dir()/nbconfig/notebook.json`.

You can generate a table of currently activated extensions by executing the following in a notebook cell:

```Python
from IPython.html.services.config import ConfigManager
from IPython.display import HTML
ip = get_ipython()
cm = ConfigManager(parent=ip, profile_dir=ip.profile_dir.location)
extensions =cm.get('notebook')
table = ""
for ext in extensions['load_extensions']:
    table += "<tr><td>%s</td>\n" % (ext)

top = """
<table border="1">
  <tr>
    <th>Extension name</th>
  </tr>
"""
bottom = """
</table>
"""
HTML(top + table + bottom)
```

If you reload the notebook after enabling a notebook extension, the extension
should be loaded. You can also check the Javascript console to confirm.

YAML file format
----------------
A notebook extensions is found, when a special YAML file describing the extensions is found.
The YAML file can have any name with the extension `YAML`, and describes the notebook extension. Note that keys (in bold) are case-sensitive.

* **Type**          - identifier, must be 'IPython Notebook Extension'
* **Name**          - unique name of the extension
* **Description**   - short explanation of the extension
* **Link**          - a url for more documentation
* **Icon**          - a url for a small icon (rendered 120px high, should preferably end up 400px wide. Recall HDPI displays may benefit from a 2x resolution icon).
* **Main**          - main javascript file that is loaded, typically 'main.js'
* **Compatibility** - IPython version compatibility, e.g. '3.x' or '4.x' or '3.x 4.x'
* **Parameters**    - Optional list of configuration parameters. Each item is a dictionary with (some of) the following keys:
  * **name**        - (mandatory) this is the name used to store the configuration variable in the config json, so should be unique among all extensions
  * **description** - description of the configuration parameter
  * **default**     - a default value used to populate the tag on the nbextensions config page. Note that this is more of a hint to the user than anything functional - since it's only set in the yaml file, the javascript implementing the extension in question might actually use a different default, depending on the implementation.
  * **input_type**  - controls the type of html tag used to render the parameter on the configuration page. Valid values include 'text', 'textarea', 'checkbox', [html5 input tags such as 'number', 'url', 'color', ...], plus a final type of 'list'
  * **list_element** - for parameters with input_type 'list', this is used in place of 'input_type' to render each element of the list
  * finally, extras such as **min** **step** **max** may be used by 'number' tags for validation

Example:

```yaml
Type: IPython Notebook Extension
Name: Limit Output
Description: This extension limits the number of characters that can be printed below a codecell
Link: https://github.com/ipython-contrib/IPython-notebook-extensions/wiki/limit-output
Icon: icon.png
Main: main.js
Compatibility: 3.x 4.x
Parameters:
- name: limit_output
  description: Number of characters to limit output to
  input_type: number
  default: 10000
  step: 1
  min: 0
```


Troubleshooting
===============

If an extension doesn't work, here are some ways you can check what is wrong:

1. Clear your browser cache or start a private browser tab.
2. Verify the extension can be loaded by the IPython notebook, for example,
   load the javascript file directly:
   `http://127.0.0.1:8888/nbextensions/usability/runtools/main.js`
3. Check for error messages in the JavaScript console of the browser.
4. Check for any error messages in the server output logs
 