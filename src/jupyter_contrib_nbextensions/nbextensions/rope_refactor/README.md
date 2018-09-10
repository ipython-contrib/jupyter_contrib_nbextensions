Rope Refactor
==============

Enables some basic python refactorings using rope (https://github.com/python-rope/rope). Includes inline, extract variable, extract method, rename.


Usage
-----

Requires both the rope_refactor_server server extension and the rope_refactor nbextension.
To enable the server extension:
```jupyter serverextension enable rope_refactor_server```

![Screenshot image](screenshot.png)


Options
-------

### Hotkeys
These options define the hotkeys for each of the actions.

### Add toolbar button
If checked, buttons will show in the toolbar, one for each refactoring action. Off by default.

### Icons
If Add toolbar button is checked, these icons will be used for them.

Internals
---------

For the rope_refactor nbextension, I re-used/adapted code from code_prettify's kernel_exec_on_cells.js file. I ended up using a serverextension instead of the notebook kernel to evaluate python code though, so I didn't use that part.