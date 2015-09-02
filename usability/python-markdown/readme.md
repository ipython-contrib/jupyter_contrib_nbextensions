This extension allows dynamically displaying Python variables in markdown cells.
Example:
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

## Further examples
Before rendering the markdown cell:
![before](https://raw.github.com/ipython-contrib/IPython-notebook-extensions/master/wiki-images/python-markdown-pre.png)

After rendering the markdown cell:
![after](https://raw.github.com/ipython-contrib/IPython-notebook-extensions/master/wiki-images/python-markdown-post.png)


**Caution:** There is no restriction in the expression you can embedd in `{{ }}`. Be careful as you might crash your browser if you return too large datasets.

Also, images in markdown will be removed due to the HTML sanitizer after a reload.

## Installation
There are different versions of this extension for the 2.x or 3.x version of IPython. Please make sure you use the correct one by selecting the `2.x` or `master` branch in the repository.

Copy `python-markdown.js` to the `nbextensions` directory of your IPython notebook server.
Then load the using
```javascript
%%javascript
IPython.load_extensions('python-markdown')
```
You can add the `IPython.load_extensions('python-markdown')` call to your local `custom.js` file to have the extension automatically loaded. See the IPython documentation or the main make of this Wiki for details.

In order to have `nbconvert` show the preprocessed output, copy the `pymdpreprocessor.py` file to a location in your `PYTHONPATH`and add or extend the following line to your `ipython_nbconvert_config.py` configuration file:
`c.Exporter.preprocessors = [ 'pymdpreprocessor.PyMarkdownPreprocessor' ]`. Make sure you have defined `	
c = get_config()` beforehand.

## Internals
The extension overrides the `textcell.MarkdownCell.prototype.render` function and searches for a Python expression enclosed in double curly braced `{{ <expr> }}`. It then executes the expression and replaces it with the result returned from Python, embedded in a `<span>` tag.
Additionally, the result is saved in the metadata of the markdown cell, i.e. `cell.metadata.variables[varname]`. This stored value is displayed when reloading the notebook and used for the nbconvert preprocesser.

The preprocessor `pymdpreprocessor.PyMarkdownPreprocessor` allows `nbconvert` to display the computed variables when converting the notebook to an output file format.

