Description
-----------
Add a toolbar button to call nbconvert for the current the notebook and optionally display the converted html file in a 
new browser tab.

![](printview-button.png)

The extensions has two options:

* _nbconvert options_: Options to pass to nbconvert. Default: `--to html`

* _open tab_: After conversion to html, open a new tab to display the output. Only really makes sense when converting to html output format. Default: `true`

This leaves the resulting static html file from your notebook in the directory where the notebook resides.

Internals
---------

The configuration is stored in the Jupyter configuration path `nbconfig/notebook.js` using two keys:
*printpreview_nbconvert_options* and *printview_open_tab*.
