import os
import sys

from jupyter_core.paths import jupyter_data_dir

sys.path.append(os.path.join(jupyter_data_dir(), 'extensions'))

c = get_config()  # noqa
c.NbConvertApp.export_format = "html"
c.Exporter.template_path = [
    '.',
    os.path.join(jupyter_data_dir(), 'templates'),
    os.path.join(jupyter_data_dir(), 'nbextensions', 'highlighter')
]
c.Exporter.preprocessors = ['pp_highlighter.HighlighterPreprocessor']
c.NbConvertApp.postprocessor_class = 'pp_highlighter.HighlighterPostProcessor'
# html
c.Exporter.template_file = 'highlighter.tpl'
