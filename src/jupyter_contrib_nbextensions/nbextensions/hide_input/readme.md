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
[jupyter-contrib-nbextensions.readthedocs.io](http://jupyter-contrib-nbextensions.readthedocs.io/en/latest).

To export a notebook with hidden cell inputs using nbconvert, you need to use a
custom template and a custom filter.
The required filter and template are supplied as part of
`jupyter_contrib_nbextensions.nbconvert_support`, or you can roll your own
using the provided ones as examples. Again, see the docs linked above for more
information.

The `nbextensions.tpl` template is provided in the
`jupyter_contrib_nbextensions.nbconvert_support` templates directory (see the
docs mentioned above for how to find it), while the necessary
`strip_output_prompt` filter, is provided by
`jupyter_contrib_nbextension.nbconvert_support.strip_output_prompt`.

An example of a python config file which will arrange to use the correct
template and filter:

```python
import os
import jupyter_contrib_nbextensions.nbconvert_support

c = get_config()
c.Exporter.template_file = os.path.join(
    jupyter_contrib_nbextensions.nbconvert_support.templates_directory(),
    'nbextensions')
c.Exporter.setdefault('filters', {})['strip_output_prompt'] = (
    'jupyter_contrib_nbextensions.nbconvert_support.'
    'strip_output_prompt.strip_output_prompt')
```

To use, put this config into a file named `jupyter_nbconvert_config.py` in the
same directory as the notebook you wish to convert, and call using

    nbconvert --config=jupyter_nbconvert_config.py my_notebook.ipynb

The nbextensions template will respect the `cell.metadata.hide_input` flag, and
the filter will remove the cell's output prompt (the bit that looks like
`Out[27]:`).
The filter is only used for html output, not for PDF or LaTeX output.

If you want to _keep_ the cell output prompt, you will have to change the line

    {{ super() | strip_output_prompt }}

to

    {{ super() }}

in the `nbextensions.tpl` file.
