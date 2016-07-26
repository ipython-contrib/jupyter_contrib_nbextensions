This extension adds codefolding functionality from CodeMirror to a codecell.

After clicking on the gutter (left margin of codecell) or typing `Alt+F`, the code gets folded. See the examples below. The folding status is saved in the cell metadata of the notebook, so reloading of a notebook will restore the folding view.


Supported modes
===============

Three different folding modes are supported:


Indent Folding
--------------

Python-style code folding, detetects indented code.
![](codefolding_indent_unfolded.png)

The unfolded code above can be folded like this:

![](codefolding_indent_folded_1.png)

or this:

![](codefolding_indent_folded_2.png)


Bracket Folding
---------------

Other languages like Javascript use brackets to designate code blocks. Codefolding is supported for Javascript in using the `%%javascript` magic in a codecell.


Firstline Comment Folding
-------------------------

Allows collapsing of Python code cells to a single comment line. This is useful for long codecells. The algorithm simply looks for a comment in the first line and allows folding in the rest of the cell.

![](codefolding_firstline_unfolded.png)

The code above can be folded like this:

![](codefolding_firstline_folded.png)


Magics Folding
--------------

If you specify a magic in the first line of a cell, it can be folded, too.

![](magic-unfolded.png)

Folded:

![](magic-folded.png)


Internals
=========

You need the current master branch from Codemirror in order to get codefolding to work. This is still very much work-in-progress.

The folding information is saved in the metadata of each codecell. The number of the folding start line (beginning with 0) is stored in an array: 

```javascript
cell.metadata.code_folding = [ 3, 20, 33 ]
```

When reloading the IPython notebook, the folding status is restored.


Exporting
=========

To export a notebook containing folded cells you will need to apply a export template. 
The template needs to be in a path where nbconvert can find it. This can be your local path or specified in 
`jupyter_nbconvert_config` or `jupyter_notebook_config` as `c.Exporter.template_path`, see [Jupyter docs](http://jupyter-notebook.readthedocs.io/en/latest/config.html).

For HTML export a template is provided as `nbextensions.tpl` in the `jupyter_contrib_nbextensions` templates directory. Alternatively you can create your own template:

```
{%- extends 'full.tpl' -%}

{% block input_group -%}
{%- if cell.metadata.hide_input -%}
{%- else -%}
{{ super() }}
{%- endif -%}
{% endblock input_group %}

{% block output_group -%}
{%- if cell.metadata.hide_output -%}
{%- else -%}
{{ super() }}
{%- endif -%}
{% endblock output_group %}
```

For LaTeX export a different template is required, which is included as `nbextensions.tplx` in the `jupyter_contrib_nbextensions` templates directory. Alternatively you can create your own template:
```
((- extends 'report.tplx' -))

((* block input_group -))
((- if cell.metadata.hide_input -))
((- else -))
((( super() )))
((- endif -))
(( endblock input_group *))

((* block output_group -))
((- if cell.metadata.hide_output -))
((- else -))
((( super() )))
((- endif -))
(( endblock output_group *))
```
