
Purpose
=======
This extension loads a tex file whenever a notebook is loaded, then re-runs
mathjax. It's useful if you have several notebooks that use a common set of latex
macros, so you don't have to copy the macros to each notebook.

Usage
=====

Simply put your latex macros in a file named latexdefs.tex, in the same directory as your notebook.


Credit
======

This is derived entirely from the nbextension `jupyter_latex_envs`, with help from its author @jfbercher.
