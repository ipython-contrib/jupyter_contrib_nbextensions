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
# enable the extension:
"$(jupyter --data-dir)/nbextensions/nbextension-scratchpad/enable"
```

Or clone the repo manually:

```bash
nbext="$(jupyter --data-dir)/nbextensions"
test -d "$nbext" || mkdir -p "$nbext"
cd "$nbext"
git clone git://github.com/minrk/nbextension-scratchpad
# enable the extension:
./nbextension-scratchpad/enable
```

You can disable the extension again:

```bash
"$(jupyter --data-dir)/nbextensions/nbextension-scratchpad/enable" --disable
```
