This extension adds codefolding functionality from CodeMirror to a codecell.

After clicking on the gutter (left margin of codecell) or typing `Alt+F`, the code gets folded. See the examples below. The folding status is saved in the cell metadata of the notebook, so reloading of a notebook will restore the folding view.

## Supported modes:
Three different folding modes are supported:

### Indent Folding
Python-style code folding, detetects indented code.
![](https://github.com/ipython-contrib/IPython-notebook-extensions/raw/master/wiki-images/codefolding_indent_unfolded.png)

The unfolded code above can be folded like this:

![](https://raw.github.com/ipython-contrib/IPython-notebook-extensions/master/wiki-images/codefolding_indent_folded_1.png)

or this:

![](https://raw.github.com/ipython-contrib/IPython-notebook-extensions/master/wiki-images/codefolding_indent_folded_2.png)

### Bracket Folding
Other languages like Javascript use brackets to designate code blocks. Codefolding is supported for Javascript in using the `%%javascript` magic in a codecell.

### Firstline Comment Folding
Allows collapsing of Python code cells to a single comment line. This is useful for long codecells. The algorithm simply looks for a comment in the first line and allows folding in the rest of the cell.

![](https://github.com/ipython-contrib/IPython-notebook-extensions/raw/master/wiki-images/codefolding_firstline_unfolded.png)

The code above can be folded like this:

![](https://raw.github.com/ipython-contrib/IPython-notebook-extensions/master/wiki-images/codefolding_firstline_folded.png)


Installation
============
Install the master version of the IPython-notebook-extensions repository as explained on the main wiki page
[here](https://github.com/ipython-contrib/IPython-notebook-extensions/wiki/Home_3x).

Then load the extension from within the IPyton notebook:
```javascript
%%javascript
IPython.load_extensions('IPython-notebook-extensions-master/usability/codefolding/codefolding');
```

## Internals
You need the current master branch from Codemirror in order to get codefolding to work. This is still very much work-in-progress.

The folding information is saved in the metadata of each codecell. The number of the folding start line (beginning with 0) is stored in an array: 
```javascript
cell.metadata.code_folding = [ 3, 20, 33 ]
```
When reloading the IPython notebook, the folding status is restored.


