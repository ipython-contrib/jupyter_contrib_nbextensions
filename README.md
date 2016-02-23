# Scratchpad notebook extension

Adds a scratchpad cell to Jupyter notebook.
This is a cell in which you can execute code against the current kernel without modifying the notebook document.

![demo](demo.gif)

## install

    bower install --config.directory="$(jupyter --data-dir)/nbextensions" nbextension-scratchpad
    # enable the extension:
    $(jupyter --data-dir)/nbextensions/nbextension-scratchpad/enable


You can disable the extension again:

    $(jupyter --data-dir)/nbextensions/nbextension-scratchpad/enable --disable

