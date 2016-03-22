import os

from themysto import __file__ as themysto_filepath

themysto_dir = os.path.dirname(themysto_filepath)

c = get_config()  # noqa
c.NbConvertApp.export_format = "latex"
c.Exporter.template_path = [
    '.',
    os.path.join(themysto_dir, 'templates'),
]
c.Exporter.preprocessors = ['pp_highlighter.HighlighterPreprocessor']
c.NbConvertApp.postprocessor_class = 'pp_highlighter.HighlighterPostProcessor'
# latex
c.Exporter.template_file = 'highlighter.tplx'
