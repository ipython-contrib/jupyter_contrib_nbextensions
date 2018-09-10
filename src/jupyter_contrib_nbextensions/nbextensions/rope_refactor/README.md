Rope Refactor
==============

Enables some basic python refactorings using rope (https://github.com/python-rope/rope). Includes inline, extract variable, extract method, rename.


Usage
-----

Requires both the rope_refactor_server serverextension and the rope_refactor nbextension.

![Screenshot image](screenshot.png)


Options
-------

Some description of the different options the nbextension provides, what they do, and their default values

Internals
---------

For the rope_refactor nbextension, I re-used/adapted code from code_prettify's kernel_exec_on_cells.js file. I ended up using a serverextension instead of the notebook kernel to evaluate python code though, so I didn't use that part.