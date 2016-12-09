# A 2to3 converter

This extension converts python2 code in a notebook's code cell to python3 code. 
Under the hood, it uses Pythons build in [2to3]() function.

Possibly it will be extended to use the [futurize](http://python-future.org/automatic_conversion.html) functions so it can convert both ways.




Installation
------------

If you use [jupyter-contrib-nbextensions](https://github.com/ipython-contrib/jupyter_contrib_nbextensions), proceed as usual. 

Otherwise, you can still install/try the extension from my personal repo, using
```
jupyter nbextension install https://github.com/jfbercher/code_prettify/archive/master.zip --user
jupyter nbextension enable code_prettify-master/code_prettify
```

```
jupyter nbextension install https://github.com/EWouters/2to3/archive/master.zip --user
jupyter nbextension enable 2to3-master/2to3
```