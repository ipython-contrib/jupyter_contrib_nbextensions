This extension adds a toolbar button, along with an optional hotkey,
to toggle all cells' line numbers on or off in one action.


Installation
============
Install the master version of the IPython-notebook-extensions repository as
explained on the
[main repository readme page](https://github.com/ipython-contrib/IPython-notebook-extensions).

Then you can enable the extension by doing one of:
1. Using the config page at the `/nbextensions` URL
2. Running
    ```jupyter
    %%javascript
    Jupyter.notebook.config.update({
        "load_extensions": {
            "usability/toggle_all_line_numbers/main": true
        }
    });
    ```
    from within the IPython notebook
