# A 2to3 converter

This extension converts python2 code in a notebook's code cell to python3 code. 
Under the hood, it uses Pythons build in [2to3](https://docs.python.org/3/library/2to3.html) function.

The project was forked by @EWouters from [code_prettify](https://github.com/jfbercher/code_prettify) by [@jfbercher](https://github.com/jfbercher), retaining most of the code. It now shares with `code_prettify` a library of functions dedicated to kernel processing of cells text in Jupyter notebooks. 

The 2to3 conversion is based on [2to3_nb.py](https://gist.github.com/takluyver/c8839593c615bb2f6e80) by [@takluyver](https://github.com/takluyver) and [@fperez](https://github.com/fperez).

Possibly it will be extended to use the [futurize](http://python-future.org/automatic_conversion.html) functions so it can convert both ways.

Under the hood, it uses the KerneExecOnCells library, shared between `code_prettify`, `autopep8` and `2to3` (to date)
The nbextension provides

- a toolbar button (configurable to be added or not)
- a keyboard shortcut for reformatting the current code-cell (default shortcut
  is `Alt-A`, can also be configured not to add the keyboard shortcut).
- a keyboard shortcut for reformatting the whole notebook (default shortcut
  is `Alt-Shift-A`, can also be configured not to add the keyboard shortcut).
Syntax shall be correct. The nbextension will also point basic syntax errors.

![](demo_2to3.gif)

See `code_prettify`'s [README](README.md) for the internals used by the extension and a description of the options. 
