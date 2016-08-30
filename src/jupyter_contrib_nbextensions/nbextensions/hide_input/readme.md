Hide Input
==========
This extension allows hiding of an individual codecell in a notebook. This can be achieved by clicking on the toolbar 
button:
![](icon.png)

Internals
---------

The codecell hiding state is stored in the metadata `cell.metadata.hide_input`.
If it is set to `true`, the codecell will be hidden on reload.

To export a notebook with hidden cells using nbconvert, you need to add a custom template and a custom filter:
```
c = get_config()
c.Exporter.template_file = 'nbextensions'
c.Exporter.filters = {'strip_output_prompt': 'strip_output_prompt.strip_output_prompt'}
```

The template will respect the `cell.metadata.hide_input` flag, and the filter will remove the cell output prompt 
that looks like `Out[27]:`. The filter is not used for PDF or LaTeX output.

If you want to keep the cell output prompt, you will have to change the line
```
   {{ super() | strip_output_prompt }}
```
to
```
   {{ super() }}
```
in the `nbextensions.tpl` file. 