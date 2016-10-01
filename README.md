# A Code Prettifier

This extension reformats/prettifies code in a notebook's code cell. 
It currently supports R, javascript and Python code. 
Under the hood, it uses the [YAPF](https://github.com/google/yapf) Python module to reformat Python code (python2/python3 kernels), [formatR](http://yihui.name/formatR/) for R code (ir kernel) and [js-beautify](https://github.com/beautify-web/js-beautify) for javascript ([ijavascript](http://n-riesco.github.io/ijavascript/) kernel). 

Other languages may be added in the future. Actually, given that there are more than 50 [kernels](https://github.com/ipython/ipython/wiki/IPython-kernels-for-other-languages) available for Jupyter it does not easy possible to support all of them. The current implementation uses a call to the current kernel to reformat the code. Thus the actual prettyfier package has to be written in the current kernel language. 

**pre-requisites:** of course, you must have some of the corresponding packages installed:

- for Python 
```
pip install yapf [--user]
``` 
- for R
```
install.packages("formatR", repos = "http://cran.rstudio.com")
``` 
- for ijavascript (*Under linux, in the root of your user tree = ~*)
```
npm install js-beautify
``` 
Under windows, you may then need to set the `NODE_PATH` environment variable: [From stackoverflow](http://stackoverflow.com/questions/9587665/nodejs-cannot-find-installed-module-on-windows) set it to %AppData%\npm\node_modules (Windows 7/8/10). To be done with it once and for all, add this as a System variable in the Advanced tab of the System Properties dialog.

Then the extension provides

- a toolbar button
- a keyboard shortcut for reformatting the current code-cell (default: Ctrl-L)

Syntax shall be correct. The extension will also point basic syntax errors. 
![](demo-py.gif)
![](demo-R.gif)
![](demo-jv.gif)




Installation
------------

If you use [jupyter-contrib-nbextensions](https://github.com/ipython-contrib/jupyter_contrib_nbextensions), proceed as usual. 

Otherwise, you can still install/try the extension from my personal repo, using
```
jupyter nbextension install https://github.com/jfbercher/code_prettify/archive/master.zip --user
jupyter nbextension enable code_prettify-master/code_prettify
```


History: 
---------

- @jfbercher, august 14, 2016, first version. 
- @jfbercher, august 19, 2016, second version, introducing support for R language and javascript. Change extension name from `yapf_ext` to `code_prettify` 