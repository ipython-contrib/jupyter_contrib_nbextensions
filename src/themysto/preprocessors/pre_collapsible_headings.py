# -*- coding: utf-8 -*-

from __future__ import print_function

import re

from nbconvert.preprocessors import Preprocessor

heading_re = re.compile(r'^#*')


class CollapsibleHeadingsPreprocessor(Preprocessor):

    def preprocess(self, nb, resources):
        """
        Preprocessing to apply on each notebook.

        Returns modified nb, resources.

        Parameters
        ----------
        nb : NotebookNode
            Notebook being converted
        resources : dictionary
            Additional resources used in the conversion process.  Allows
            preprocessors to pass variables into the Jinja engine.
        """
        filtered_cells = []
        ref_level = 7
        for cell in nb.cells:
            if cell.cell_type == 'markdown':
                level = len(heading_re.match(cell['source']).group(0))
                level = level if level > 0 else 7
            else:
                level = 7

            if (level <= ref_level):
                filtered_cells.append(cell)
                if cell['metadata'].get('heading_collapsed'):
                    ref_level = level
                else:
                    ref_level = 7

        nb.cells = filtered_cells
        return super(CollapsibleHeadingsPreprocessor, self).preprocess(
            nb, resources)

    def preprocess_cell(self, cell, resources, index):
        """
        Overridden just to avoid raising a NotImplementedError.
        Actual preprocessing is done in the preprocess method.
        """
        return cell, resources
