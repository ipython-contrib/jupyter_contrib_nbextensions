(some) LaTeX environments for Jupyter notebook
==============================================

This extension Jupyter notebook enables to use some LaTeX commands and environments in the notebook's markdown cells. 

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
5. Styles can be customized in `latex\_env.css` or `custom.css` stylesheets. 

More environments can be simply added in the source file (`thmsInNb4.js`). 

It is possible to export the notebooks to plain $\LaTeX$ and html while keeping all the features of the `latex_envs` notebook extension in the converted version. We provide specialized exporters, pre and post processors, templates. We also added entry-points to simplify the conversion process. It is now as simple asIt is now as simple as
```bash
jupyter nbconvert --to html_lenvs FILE.ipynb
```
or 
```bash
jupyter nbconvert --to latex_lenvs FILE.ipynb
```
to convert `FILE.ipynb` into html/latex while keeping all the features of the `latex_envs` notebook extension in the converted version. The LaTeX converter also expose several conversion options (read the docs). 


Demo/documentation
==================

The `doc` subdirectory that constains an example notebook and its html and pdf versions. This serves as the documentation. 
A demo notebook `latex_env_doc.ipynb` is provided. Its html version is [latex_env_doc.html](https://rawgit.com/ipython-contrib/jupyter_contrib_nbextensions/master/src/jupyter_contrib_nbextensions/nbextensions/latex_envs/doc/latex_env_doc.html) and a pdf resulting 
from conversion to LaTeX is available as [documentation](https://rawgit.com/ipython-contrib/jupyter_contrib_nbextensions/master/src/jupyter_contrib_nbextensions/nbextensions/latex_envs/doc/documentation.pdf). 


Installation
============

The extension consists in several javascript scripts: `latex_envs.js`, `thmsInNb4.js`, `bibInNb4.js` and `initNb.js`, together with a stylesheet `latex_envs.css`. You may follow the instructions in the [wiki](https://github.com/ipython-contrib/Jupyter-notebook-extensions/wiki) to install the extension.

Definitively, the simplest way to install and enable the extension is to follow the instrutions in the [Jupyter-notebook-extensions repo](https://github.com/ipython-contrib/Jupyter-notebook-extensions/blob/master/README.md). Once this is done, you can open a tab at `http://localhost:8888/nbextensions` to enable and configurate the various extensions. 


Disclaimer, sources and acknowledgments
=======================================


This is done in the hope it can be useful. However there are many impovements possible, in the code and in the documentation. 
**Contributions will be welcome and deeply appreciated.** 

Originally, I used a piece of code from the nice online markdown editor `stackedit` [https://github.com/benweet/stackedit/issues/187](https://github.com/benweet/stackedit/issues/187), where the authors also considered the problem of incorporating LaTeX markup in their markdown. 

I also studied and used examples and code from [https://github.com/ipython-contrib/IPython-notebook-extensions](https://github.com/ipython-contrib/IPython-notebook-extensions). 

