# A 2to3 converter

This extension converts python2 code in a notebook's code cell to python3 code. 
Under the hood, it uses Pythons build in [2to3](https://docs.python.org/3/library/2to3.html) function.

The project was forked from [code_prettify](https://github.com/jfbercher/code_prettify) by [@jfbercher](https://github.com/jfbercher), retaining most of the code.
The 2to3 conversion is based on [2to3_nb.py](https://gist.github.com/takluyver/c8839593c615bb2f6e80) by [@takluyver](https://github.com/takluyver) and [@fperez](https://github.com/fperez).

Possibly it will be extended to use the [futurize](http://python-future.org/automatic_conversion.html) functions so it can convert both ways.

![](demo.gif)

Installation
------------

If you use [jupyter-contrib-nbextensions](https://github.com/ipython-contrib/jupyter_contrib_nbextensions), proceed as usual. 

Otherwise, you can still install/try the extension from my personal repo, using
```
jupyter nbextension install https://github.com/EWouters/2to3_cell/archive/master.zip --user
jupyter nbextension enable 2to3_cell-master/2to3_cell
```

To remove
```
jupyter nbextension uninstall 2to3_cell-master/2to3_cell
```
