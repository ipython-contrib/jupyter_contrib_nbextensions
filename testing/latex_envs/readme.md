# (some) LaTeX environments for Jupyter notebook

This extension enables to use some LaTeX structures directly in markdown cells of the notebook. Supported structures include

- theorems like structures: theorem, lemma, corollary, definition, example, problem, ...
- itemize, enumerate, ...

More environments can be simply added in the source file (`thsInNb.js`). 

An automatic numbering of environments is implemented. Labels, cross-references and links between environments and equations are supported.

In addition, the extension also enables to use simple LaTeX markup such as \textit{}, \textbf{}, \textem{}, \underline{}, etc. 
This is useful for copying snippets of text to/from a LaTeX file. 
The rendering of the LaTeX strucures (theorems, definitions, exercises..) can be tailored via the stylesheet `latex_envs.css`

The `conversion` directory contains scripts for converting the notebooks to html and LaTeX while taking into account the structures 
enabled by the extension. Theses scripts require nodejs, perl, ipython3. 

# Installation

You should follow the instructions in the wiki. A manual installation consists in copying latex_envs.js, thmsInNb.js, latex_envs.css to 
the notebook extension directory, usually ~/.ipython/nbextensions.   
Copy the scripts in conversion/ to some directory (preferably in your path).
Either load the extension from your `custom.js` or use a code cell with


	%%javascript
	IPython.load_extensions('latex_envs'); 
	

# Demo/documentation 

A demo notebook `latex_env_doc.ipynb` is provided. Its html version is [latex_env_doc.html](https://rawgit.com/jfbercher/IPython-notebook-extensions/master/testing/latex_envs/latex_env_doc.html) and a pdf resulting 
from conversion to LaTeX is available as `documentation.pdf`. Code needs improvements. 
**Contributions, comments, issues are most welcome and will be deeply appreciated.**

The original idea and starting code come from a discussion here: [https://github.com/benweet/stackedit/issues/187](https://github.com/benweet/stackedit/issues/187).


## Files 

File 			| description
----------------------- | -----------------------------
conversion		|	Directory containing utilitary files for converting the notebook to html/LaTeX
documentation.pdf	|	Documentation
latex_env_doc.html	|	Documentation and demo notebook (html) version
latex_env_doc.ipynb	|	Documentation and demo notebook
latex_envs.css		|	Stylesheet for rendering the notebook/html
latex_envs.js		|	LaTeX_envs extension (main script)
thmsInNb.js		|	LaTeX_envs extension (does the actual conversion)
readme.md		|	This file.
