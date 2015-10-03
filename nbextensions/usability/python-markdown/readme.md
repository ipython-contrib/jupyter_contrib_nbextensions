Description
===========
The **Python Markdown** extension allows displaying Python output in markdown cells.
For example:
If you set variable `a` in Python

```Python
a = 1.23
```

and write the following line in a markdown cell:

```Markdown
a = {{a}}
```

It will be displayed as:

```Markdown
a = 1.23
```

[![Demo Video](http://img.youtube.com/vi/_wLwLsgkExc/0.jpg)](https://youtu.be/_wLwLsgkExc)


Further examples
----------------

Before rendering the markdown cell:
![before](python-markdown-pre.png)

After rendering the markdown cell:
![after](python-markdown-post.png)

Python code is only executed when the notebook is trusted. So if your original Python code is still shown in 
rendered markdown output, please make sure your notebook is trusted.

**Caution:** There is no restriction in the expression you can embedd in `{{ }}`. Be careful as you might crash your 
browser if you return too large datasets.


Exporting
=========

In order to have `nbconvert` show the computed Python output when exporting to another format, 
use the `pymdpreprocessor.py` preprocessor. If you used the `python setup.py install` command to install the
IPython-contrib extension package, this will already be installed.   

For manual setup, you need to copy this file to a location within the Python path (or extend `PYTHONPATH`).
Additionally, you need to add these two lines to your `jupyter_nbconvert_config.py` configuration file:
```Python
c = get_config()
c.Exporter.preprocessors = [ 'pymdpreprocessor.PyMarkdownPreprocessor' ]
```

Internals
=========

The extension overrides the `textcell.MarkdownCell.prototype.render` function and searches for a Python expression enclosed in 
double curly braced `{{ <expr> }}`. It then executes the expression and replaces it with the result returned from Python, embedded 
in a `<span>` tag.
Additionally, the result is saved in the metadata of the markdown cell, i.e. `cell.metadata.variables[varname]`. 
This stored value is displayed when reloading the notebook and used for the nbconvert preprocesser.

The preprocessor `pymdpreprocessor.PyMarkdownPreprocessor` allows `nbconvert` to display the computed variables 
when converting the notebook to an output file format.
