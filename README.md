IPython notebook extensions
===========================

This is a merge of 2 repositories, this Readme should be cleaned.


IPython-static-profiles
=======================

Some experiment with statics files. Clone this in your
`.ipython/profile_default/static/custom` and uncomment the extension you are
interested in in `custom/custom.js`.

This is a simple workaround until we ship IPython with requirejs.

Install
=======

Clone this repo into  `~/.ipython_/profile_xxx/static/`

```bash
git clone https://github.com/ipython-contrib/IPython-notebook-extensions.git ~/.ipython/profile_default/static/custom
```

Edit `~/.ipython/profile_default/static/custom/custom.js` to your preferences. 
That is to say, uncomment the extensions that interest you.

Restart your notebook server. You may also need to empty your browser cache.

Details
=======

The `custom.js` file in this branch contains a small load_ext function to help
load extensions.  Extensions can either be folders named after the extension, 
containing a `main.js` script, or a simple Javascript file. You can either load
an extension by name if it is in a folder, or by specifying the full path if it
ends with .js

# IPython-nb-extensions

* breakpoint - allow setting of breakpoints for notebook cells

* hotkeys    - add PGUP / PGDOWN / HOME / END hotkeys for fast scrolling in codecells

* slideshow  - add toolbar and visual hints to slideshow extension

* history - add individual cell history (just a test...)

* read-only  - allow codecells to be set read-only, so no editing or celle execution is possible

* shift-tab - assign shift-tab to dedent

* codefolding - fold code blocks using Alt-F or clicking on line numbers

* linenumbers - display line numbers in codecells using Alt-N

* comment-uncomment - toggle comments in selected lines using Alt-C

* split-combine - split/combine cells using Alt-S, Alt-A, Alt-B

* nbconvert_button - add GUI button to call 'nbconvert --to html' for current notebook

* printview_button - add GUI button to call 'nbconvert --to html' for current notebook
  and display static html page in a new browser tab

* help_panel - display a static help panel beside notebook
  After installing this extension, a new button in the toolbar will appear. Clicking this button reduces the notebook width to 80% and at the right side a help panel is displayed. The default contents are the current IPython hotkeys.
  Individual help text can be added to the "help_panel.html" file. It is important to keep the table ID "help-table", as this allows additional extension hotkey descriptions to be added dynamically.
  Extensions can register their hotekeys by adding this line:

    `IPython.hotkeys["Shift-Tab"] = "reduce tab indent";`
    
  Currently, 
  
    `IPython.hotkeys = [];` 
    
  has to be added in custom.js before the first extension is loaded.

* cellstate - display state of current cell in codemirror gutter: 'n'ew, 'e'xecuted or 'd'irty. 

