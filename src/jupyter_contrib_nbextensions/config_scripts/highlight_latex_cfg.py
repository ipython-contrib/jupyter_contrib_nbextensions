import os

import jupyter_contrib_nbextensions.nbconvert_support

jcnbe_dir = os.path.dirname(jupyter_contrib_nbextensions.__file__)
pp_mod_name = 'jupyter_contrib_nbextensions.nbconvert_support.pp_highlighter'

c = get_config()  # noqa
c.NbConvertApp.export_format = "latex"
c.Exporter.template_path = [
    '.',
    jupyter_contrib_nbextensions.nbconvert_support.templates_directory(),
    os.path.join(jcnbe_dir, 'nbextensions', 'highlighter')
]
c.Exporter.preprocessors = [pp_mod_name + '.HighlighterPreprocessor']
c.NbConvertApp.postprocessor_class = pp_mod_name + '.HighlighterPostProcessor'
# latex
c.Exporter.template_file = 'highlighter.tplx'
# html
# c.Exporter.template_file = 'highlighter.tpl'
