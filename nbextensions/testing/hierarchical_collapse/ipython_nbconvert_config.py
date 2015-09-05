c = get_config()

#Export all the notebooks in the current directory to the sphinx_howto format.
c.NbConvertApp.notebooks = ['*.ipynb']
c.NbConvertApp.export_format = 'slides'
c.Exporter.template_file = 'hierarchical_collapse.tpl'
c.Exporter.preprocessors = ['hierarchical_collapse_preprocessor.HierarchicalCollapsePreprocessor']
