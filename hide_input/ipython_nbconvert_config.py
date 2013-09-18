c = get_config()

#Export all the notebooks in the current directory to the sphinx_howto format.
c.NbConvertApp.notebooks = ['*.ipynb']
c.NbConvertApp.export_format = 'slides'
c.Exporter.template_file = 'hide_input'
c.Exporter.filters = {'strip_output_prompt': 'strip_output_prompt.strip_output_prompt'}
