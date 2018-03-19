Hide Input
==========

This extension allows hiding of an individual codecell in a notebook. This can
be achieved by clicking on the toolbar button:

![](icon.png)


Internals
---------

The codecell hiding state is stored in the metadata `cell.metadata.hide_input`.
If it is set to `true`, the codecell will be hidden on reload.


Exporting with nbconvert
------------------------

See also the general docs for exporting using nbconvert at
[jupyter-contrib-nbextensions.readthedocs.io](https://jupyter-contrib-nbextensions.readthedocs.io/en/latest/).

To export a notebook with hidden cell inputs using nbconvert, you need to use a
custom template.
The required template is supplied as part of
`jupyter_contrib_nbextensions.nbconvert_support`, or you can roll your own
using the provided ones as examples. Again, see the docs linked above for more
information.

The `nbextensions.tpl` template is provided in the
`jupyter_contrib_nbextensions.nbconvert_support` templates directory (see the
docs mentioned above for how to find it)

To use, add the template to your `nbconvert` call:

    jupyter nbconvert --template=nbextensions --to=html my_notebook.ipynb

The nbextensions template will respect the `cell.metadata.hide_input` flag, and
filter the cell's output prompt (the bit that looks like `Out[27]:`).
The filter is only used for html output, not for PDF or LaTeX output.

If you want to _keep_ the cell output prompt, you will have to remove the lines

    {% block output_group -%}
    {%- if cell.metadata.hide_output or nb.metadata.hide_input -%}
    {%- else -%}
        {{ super() }}
    {%- endif -%}
    {% endblock output_group %}

in the `nbextensions.tpl` file.
