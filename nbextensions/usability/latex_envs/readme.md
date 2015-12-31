(some) LaTeX environments for Jupyter notebook
==============================================

This extension for IPython 3.x or Jupyter enables to use some LaTeX commands and environments in the notebook's markdown cells. 

1. **LaTeX commands and environments**
 - support for some LaTeX commands within markdown cells, *e.g.* `\textit`, `\textbf`, `\underline`
 -  support for **theorem-like environments**
 -  support for **lists**: *enumerate, itemize*,  
 -  limited support for a **figure environment**,
 -  support for an environment *listing*,
 -  additional *textboxa* environment
2. **Citations and bibliography**
 -  support for `\cite` with creation of a References section, rendering of references can be customized (to some extent)
3. **Document-wide numbering of equations, support for `\label` and `\ref`**
4. **Configuration toolbar**
5. Styles can be customized in the *latex\_env.css* stylesheet

More environments can be simply added in the source file (`thmsInNb4.js`). 

The `conversion` directory contains scripts for converting the notebooks to html and LaTeX while taking into account the structures 
enabled by the extension. Theses scripts require nodejs, perl, ipython3. Examples of such conversions are in the `doc` subdirectory that constains an example notebook and its html and pdf versions. This serves as the documentation.


Demo/documentation
==================

A demo notebook `latex_env_doc.ipynb` is provided. Its html version is [latex_env_doc.html](https://rawgit.com/jfbercher/latex_envs/master/doc/latex_env_doc.html) and a pdf resulting 
from conversion to LaTeX is available as [documentation](https://rawgit.com/jfbercher/latex_envs/master/doc/latex_env_doc.html). 


Installation
============

You should follow the instructions in the [wiki](https://github.com/ipython-contrib/Ipython-notebook-extensions/wiki). 
- Manual installation: Clone the repository and then copy the files to the notebook extension directory, usually ~/.local/share/jupyter/nebextensions (Jupyter) or ~/.ipython/nbextensions (IPython 3.x). Copy the scripts in conversion/ to some directory (preferably in your path).
- Automated installation

An even more simple procedure is to issue

``` bash
jupyter nbextension install https://rawgit.com/jfbercher/latex_envs/master/latex_envs.zip  --user
```

at the command line.
Either load the extension from your `custom.js` or use a code cell with

```jupyter
%%javascript
require("base/js/utils").load_extensions("latex_envs/latex_envs")
```

You can automatically load the extension via

```bash
jupyter nbextension enable latex_envs/latex_envs
```


Disclaimer, sources and acknowledgments
=======================================

Code certainly needs improvements. **Contributions, comments, issues are most welcome and will be deeply appreciated.**

The original idea and starting code come from a discussion here: [https://github.com/benweet/stackedit/issues/187](https://github.com/benweet/stackedit/issues/187). Examples and code from [https://github.com/ipython-contrib/IPython-notebook-extensions](https://github.com/ipython-contrib/IPython-notebook-extensions) were also used. The bibliography part was inspired by the nice extension  [icalico-document-tools](https://bitbucket.org/ipre/calico/downloads/).
