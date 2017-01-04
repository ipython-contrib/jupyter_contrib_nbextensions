Python code prettifying unsing autopep8
=======================================

This extension reformats/prettifies code in a notebook's code cell, uniquely for python language, using the autopep8 package.

Under the hood, it uses the KerneExecOnCells library, shared with `code_prettify`and  `2to3`
The nbextension provides

- a toolbar button (configurable to be added or not)
- a keyboard shortcut for reformatting the current code-cell (default shortcut
  is `Alt-A`, can also be configured not to add the keyboard shortcut).
- a keyboard shortcut for reformatting the whole notebook (default shortcut
  is `Alt-Shift-A`, can also be configured not to add the keyboard shortcut).
Syntax shall be correct. The nbextension will also point basic syntax errors.

prerequisites
-------------

Of course, you must have the necessary kernel-specific packages installed for
the prettifier call to work:

- for the default python implementation, the
  [autopep8](https://github.com/hhatto/autopep8) module is required:

      pip install autopep8

  Others you might consider using include [autopep8](https://github.com/hhatto/autopep8).