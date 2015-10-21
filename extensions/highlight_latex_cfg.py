from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir
import os
import sys

sys.path.append(os.path.join(jupyter_data_dir(), 'extensions'))

c = get_config()
c.NbConvertApp.export_format = "latex"
c.Exporter.template_path = [ '.', os.path.join(jupyter_data_dir(), 'templates') ]
c.Exporter.preprocessors = ['pp_highlighter.HighlighterPreprocessor' ]
c.NbConvertApp.postprocessor_class = 'pp_highlighter.HighlighterPostProcessor' 
#latex
c.Exporter.template_file = 'highlighter.tplx'
#html
#c.Exporter.template_file = 'highlighter.tpl'
