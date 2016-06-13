# -*- coding: utf-8 -*-
"""
Provides an nbconvert preprocessor which, used in combination with the
corresponding postprocessor, preserves highlights when converting the notebook
to html or LaTeX

Preprocessor:
- for html conversion: the preprocessor replaces html tags by a "neutral" text
  version, which enables markdown conversion of text included in the data field
  e.g <span class="mark"> *text* </span>
  is translated into
  !oph!span class="mark"!clh! *text* !oph!/span!clh!
- for LaTeX conversion: the preprocessor replaces html tags by a "neutral" text
  version of some associated LaTeX commands or environments. This, again
  enables markdown conversion of text included in the command or environment.
  e.g <span class="mark"> *text* </span>
  is translated into
  !sl!highlighta!op! *text* !cl!

The LaTeX commands and environments are defined in the LaTeX
template highlighter.tplx
"""

from __future__ import print_function

import re

from nbconvert.preprocessors import Preprocessor


class HighlighterPreprocessor(Preprocessor):

    def latex_scheme_cell(self, match):
        schemes = {
            "mark": "highlightA",
            "burk": "highlightB",
            "girk": "highlightC",
        }
        return ("!sl!begin!op!" + schemes[match.group(1)] + '!cl!\n' +
                match.group(2) + "\n!sl!end!op!" + schemes[match.group(1)] +
                '!cl!\n')

    def latex_scheme(self, match):
        schemes = {
            "mark": r"!sl!highlighta",
            "burk": r"!sl!highlightb",
            "girk": r"!sl!highlightc",
        }
        return schemes[match.group(1)] + '!op!' + match.group(2) + '!cl!'

    def html_replacements(self, match):
        return match.group(0).replace("<", "!oph!").replace(">", "!clh!")

    def replace_highlights_with_latex(self, cell_text):
        cell_text = re.sub(
            "^<div class=\"(mark|burk|girk)\">" +
            "([\S\s]*?)<\/div><i class=\"fa fa-lightbulb-o \"></i>",
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

        if cell.cell_type == "markdown":
            if self.config.NbConvertApp.export_format == "latex":
                cell.source = self.replace_highlights_with_latex(cell.source)
            elif self.config.NbConvertApp.export_format == "html":
                cell.source = self.replace_highlights_in_html(cell.source)
        return cell, resources
