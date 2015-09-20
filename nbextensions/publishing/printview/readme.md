
Description
-----------
Add a toolbar button to call nbconvert for the current the notebook and optionally display the converted html file in a 
new browser tab.

The extensions has two options:

* "nbconvert options": 
Options to nbconvert. Default: `--to html`

* "open a new tab in the browser to display nbconvert output (for html only)":
After conversion to html, open a new tab. Only makes sense when converting to html output format.


Internals
---------

The configuration is stored in the Jupyter configuration path `nbconfig/notebook.js` using two keys:
*printpreview_nbconvert_options* and *printview_open_tab*.
