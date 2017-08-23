# -*- coding: utf-8 -*-
"""Nbconvert preprocessor for the embedding img sources into the cells."""

from nbconvert.preprocessors import Preprocessor
from .embedhtml import EmbedHTMLExporter, et


class PyMarkdownPreprocessor(Preprocessor, EmbedHTMLExporter):
    """
    :mod:`nbconvert` Preprocessor which embeds graphics as base64 into markdown
    cells.

    This :class:`~nbconvert.preprocessors.Preprocessor` replaces kernel code in
    markdown cells with the results stored in the cell metadata.
    """

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
        index : int
            Index of the cell being processed (see base.py)
        """

        self.path = resources['metadata']['path']
        if cell.cell_type == "markdown":
            if 'attachments' in cell.keys():
                self.attachments += cell['attachments']
            # Parse HTML and replace <img> tags with the embedded data
            parser = et.HTMLParser()
            root = et.fromstring(cell, parser=parser)
            nodes = root.findall(".//img")

            for n in nodes:
                # replfunc comes from the EmbedHTMLExporter class, and is all
                # that is really needed from there
                self.replfunc(n)

            # Convert back to HTML
            embedded_output = et.tostring(root, method="html")

            return embedded_output, resources
        else:
            return cell, resources
