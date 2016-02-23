# Scratchpad notebook extension

Adds a scratchpad cell to Jupyter notebook.
This is a cell in which you can execute code against the current kernel without modifying the notebook document.

The scratchpad can be toggled by clicking the icon in the bottom-right,
or via the keyboard shortcut `Ctrl-B`.

![demo](demo.gif)


## Install

You can install with bower:

```bash
bower install --config.directory="$(jupyter --data-dir)/nbextensions" nbextension-scratchpad
```

Or clone the repo manually:

```bash
git clone git://github.com/minrk/nbextension-scratchpad
jupyter nbextension install nbextension-scratchpad
```

And enable the extension:

```bash
jupyter nbextension enable nbextension-scratchpad/main
```

You can disable the extension again:

```bash
jupyter nbextension disable nbextension-scratchpad/main
```
