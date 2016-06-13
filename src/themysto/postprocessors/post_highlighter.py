# -*- coding: utf-8 -*-

"""
Provides an nbconvert postprocessor which, used in combination with the
corresponding preprocessor, preserves highlights when converting the notebook
to html or LaTeX

Postprocessor:
- replaces the "neutral" text versions by the destination language tags
  eg. [html example] becomes <span class="mark"> <em>text</em> </span>
  (the data text have been correctly emphasized)
  eg. [LaTeX example] becomes \highlighta{\emph{text}}
  (the data text have been correctly emphasized)

The LaTeX commands and environments are defined in the LaTeX
template highlighter.tplx
"""

from __future__ import print_function

from nbconvert.postprocessors.base import PostProcessorBase


class HighlighterPostProcessor(PostProcessorBase):

    def postprocess(self, input):
        self.log.info('Postprocessing highlighter...')
        replacements = {
            'latex': [
                ('!op!', '{'),
                ('!cl!', '}'),
                ('!sl!', '\\'),
            ],
            'html': [
                ('!oph!', '<'),
                ('!clh!', '>'),
            ],
        }.get(self.config.NbConvertApp.export_format, [])
        if replacements:
            with open(input, 'rt') as f:
                nb_text = f.read()
            for frm, to in replacements:
                nb_text = nb_text.replace(frm, to)
            with open(input, 'wt') as f:
                f.write(nb_text)
