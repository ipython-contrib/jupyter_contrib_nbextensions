# A 2to3 converter

This extension converts python2 code in a notebook's code cell to python3 code. 
Under the hood, it uses Pythons build in [2to3](https://docs.python.org/3/library/2to3.html) function.

The project was forked by @EWouters from [code_prettify](https://github.com/jfbercher/code_prettify) by [@jfbercher](https://github.com/jfbercher), retaining most of the code. It now shares with `code_prettify` a library of functions dedicated to kernel processing of cells text in Jupyter notebooks. 

The 2to3 conversion is based on [2to3_nb.py](https://gist.github.com/takluyver/c8839593c615bb2f6e80) by [@takluyver](https://github.com/takluyver) and [@fperez](https://github.com/fperez).

Possibly it will be extended to use the [futurize](http://python-future.org/automatic_conversion.html) functions so it can convert both ways.

![](demo_2to3.gif)

See `code_prettify`'s [README](http://localhost:8888/nbextensions/nbextensions_configurator/rendermd/nbextensions/code_prettify/README.md) for the internals used by the extension and a description of the main options ans parameters. 
