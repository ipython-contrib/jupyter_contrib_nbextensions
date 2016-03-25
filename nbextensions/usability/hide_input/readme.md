This extension allows hiding of an individual codecell in a notebook. This can be achieved by clicking on the button toolbar.

Internals
=========

The codecell hiding state is stored in the metadata `cell.metadata.hide_input`.
If it is set to `true`, all codecells will be hidden on reload.

To export a notebook with hidden cells using nbconvert, you need to add a custom template and a custom filter:
```
c = get_config()
c.Exporter.template_file = 'hide_input_output'
c.Exporter.filters = {'strip_output_prompt': 'strip_output_prompt.strip_output_prompt'}
```
