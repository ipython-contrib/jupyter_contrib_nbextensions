# -*- coding: utf-8 -*-
r"""
These pre and postprocessor preserve highlights when converting the notebook to
html or LaTeX.

Preprocessor:

- for html conversion: the preprocessor replaces html tags by a "neutral" text
  versions, which enables markdown conversion of text included in the data
  field e.g. ::

      <span class="mark"> *text* </span>

  is translated into::

      !oph!span class="mark"!clh! *text* !oph!/span!clh!

- for LaTeX conversion: the preprocessor replaces html tags by a "neutral" text
  version of some associated LaTeX commands or environments. This, again
  enables markdown conversion of text included in the command or environment.
  e.g. ::

      <span class="mark"> *text* </span>

  is translated into::

      !sl!highlighta!op! *text* !cl!

Postprocessor:

- replaces the "neutral" text versions by the destination language tags
  e.g. the [html example] becomes ::

    <span class="mark"> <em>text</em> </span>

  (the data text have been correctly emphasized)

  e.g. [LaTeX example] becomes ::

    \highlighta{\emph{text}}

  (the data text have been correctly emphasized)

The LaTeX commands and environments are defined in the LaTeX template
highlighter.tplx
"""

from __future__ import print_function

import re

from nbconvert.postprocessors.base import PostProcessorBase
from nbconvert.preprocessors import Preprocessor


class HighlighterPreprocessor(Preprocessor):
    """
    :mod:`nbconvert` Preprocessor for the ``highlighter`` nbextension.

    The preprocessor replaces highlighter html tags in markdown with a
    "neutral" text version, which enables markdown conversion of text included
    in the data field, command or environment. Then the neutral text is
    translated into LaTeX/html output by the corresponding
    :class:`HighlighterPostProcessor`.

    For example the highlighter-created markdown ::

        <span class="mark"> *text* </span>

    is translated for html conversion into::

        !oph!span class="mark"!clh! *text* !oph!/span!clh!

    or for LaTeX conversion is translated into::

        !sl!highlighta!op! *text* !cl!
    """

    def latex_scheme_cell(self, match):
        schemes = {
            "mark": "highlightA",
            "burk": "highlightB",
            "girk": "highlightC"
        }
        return ("!sl!begin!op!" + schemes[match.group(1)] + '!cl!\n' +
                match.group(2) + "\n!sl!end!op!" + schemes[match.group(1)] +
                '!cl!\n')

    def latex_scheme(self, match):
        schemes = {
            "mark": r"!sl!highlighta",
            "burk": r"!sl!highlightb",
            "girk": r"!sl!highlightc"
        }
        return schemes[match.group(1)] + '!op!' + match.group(2) + '!cl!'

    def html_replacements(self, match):
        return match.group(0).replace("<", "!oph!").replace(">", "!clh!")

    def replace_highlights_with_latex(self, cell_text):
        cell_text = re.sub(
            "^<div class=\"(mark|burk|girk)\">([\S\s]*?)<\/div>" +
            "<i class=\"fa fa-lightbulb-o \"></i>",
            self.latex_scheme_cell, cell_text)
        cell_text = re.sub(
            "<span class=\"(mark|burk|girk)\">([\S\s]*?)<\/span>",
            self.latex_scheme, cell_text)
        return cell_text

    def replace_highlights_in_html(self, cell_text):
        cell_text = re.sub(
            "^<div class=\"(mark|burk|girk)\">([\S\s]*?)<\/div>" +
            "<i class=\"fa fa-lightbulb-o \"></i>",
            self.html_replacements, cell_text)
        cell_text = re.sub(
            "<span class=\"(mark|burk|girk)\">([\S\s]*?)<\/span>",
            self.html_replacements, cell_text)
        return cell_text

    def preprocess_cell(self, cell, resources, index):
        """
        Preprocess cell

        Parameters
        ----------
        cell : NotebookNode cell
            Notebook cell being processed
        resources : dictionary
            Additional resources used in the conversion process.  Allows
            preprocessors to pass variables into the Jinja engine.
        cell_index : int
            Index of the cell being processed (see base.py)
        """

        # print("config", self.config)
        if cell.cell_type == "markdown":
            if self.config.NbConvertApp.export_format == "latex":
                cell.source = self.replace_highlights_with_latex(cell.source)
            elif self.config.NbConvertApp.export_format == "html":
                cell.source = self.replace_highlights_in_html(cell.source)
        return cell, resources


class HighlighterPostProcessor(PostProcessorBase):
    r"""
    :mod:`nbconvert` PostProcessor for the ``highlighter`` nbextension.


    Replaces the "neutral" text versions created by the
    :class:`HighlighterPreprocessor` by the destination language tags.

    e.g. the html example becomes ::

        <span class="mark"> <em>text</em> </span>

    (the data text have been correctly emphasized in html markup)

    e.g. the LaTeX example becomes ::

        \highlighta{\emph{text}}

    (the data text have been correctly emphasized using LaTeX tags)
    """

    def postprocess(self, input):
        print("Postprocessing...")
        """if self.config.NbConvertApp.export_format == "latex":
            with open(input,'rt') as f:
                nb_text=f.read()
            nb_text=nb_text.replace('!op!','{')
            nb_text=nb_text.replace('!cl!','}')
            nb_text=nb_text.replace('!sl!','\\')
            with open(input,'wt') as f:
                f.write(nb_text)
         elif self.config.NbConvertApp.export_format == "html":
            with open(input,'rt') as f:
                nb_text=f.read()
            nb_text=nb_text.replace('!oph!','<')
            nb_text=nb_text.replace('!clh!','>')
            with open(input,'wt') as f:
                f.write(nb_text)
         """
        if self.config.NbConvertApp.export_format == "latex" or "html":
            with open(input, 'rt') as f:
                nb_text = f.read()
            if self.config.NbConvertApp.export_format == "latex":
                nb_text = nb_text.replace('!op!', '{')
                nb_text = nb_text.replace('!cl!', '}')
                nb_text = nb_text.replace('!sl!', '\\')
            elif self.config.NbConvertApp.export_format == "html":
                nb_text = nb_text.replace('!oph!', '<')
                nb_text = nb_text.replace('!clh!', '>')
            with open(input, 'wt') as f:
                f.write(nb_text)
