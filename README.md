# Scratchpad notebook extension

Adds a scratchpad cell to Jupyter notebook.
This is a cell in which you can execute code against the current kernel without modifying the notebook document.

The scratchpad can be toggled by clicking the icon in the bottom-right,
or via the keyboard shortcut `Ctrl-B`.

![demo](demo.gif)


## Install

```bash
bower install --config.directory="$(jupyter --data-dir)/nbextensions" nbextension-scratchpad
# enable the extension:
$(jupyter --data-dir)/nbextensions/nbextension-scratchpad/enable
```

You can disable the extension again:

```bash
$(jupyter --data-dir)/nbextensions/nbextension-scratchpad/enable --disable
```
