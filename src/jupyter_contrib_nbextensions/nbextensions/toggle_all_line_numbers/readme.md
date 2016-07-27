This extension adds a toolbar button, along with an optional hotkey,
to toggle all cells' line numbers on or off in one action.


Installation
============
Install the master version of the jupyter_contrib_nbextensions repository as
explained on the
[main repository readme page](https://github.com/ipython-contrib/jupyter_contrib_nbextensions).

Then you can enable the extension by doing one of:
1. Using the config page at the `/nbextensions` URL
2. Running
    ```jupyter
    %%javascript
    Jupyter.notebook.config.update({
        "load_extensions": {
            "toggle_all_line_numbers/main": true
        }
    });
    ```
    from within the IPython notebook
