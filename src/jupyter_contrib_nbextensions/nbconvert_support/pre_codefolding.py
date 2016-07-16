# -*- coding: utf-8 -*-
"""
This preprocessor removes lines in code cells that have been marked as `folded`
by the codefolding extension
"""

from nbconvert.preprocessors import Preprocessor


class CodeFoldingPreprocessor(Preprocessor):

    fold_mark = u'↔'

    def fold_cell(self, cell, folded):
        """
        Remove folded lines and add a '<->' at the parent line
        """
        lines = cell.splitlines(True)

        if folded[0] == 0 and (lines[0][0] == '#' or lines[0][0] == '%'):
            # fold whole cell when first line is a comment or magic
            return lines[0].rstrip('\n') + self.fold_mark + '\n'
        fold_indent = 0
        fold = False
        fcell = ""
        for i, l in enumerate(lines):
            # fold indent level
            indent = len(l) - len(l.lstrip(' '))
            if indent <= fold_indent:
                fold = False
                fold_indent = 0
            if i in folded:
                fold = True
                fold_indent = indent
                fcell += l.rstrip('\n') + self.fold_mark + '\n'
            if fold is False:
                fcell += l
        return fcell

    def preprocess_cell(self, cell, resources, index):
        """
        Read cell metadata and remove lines marked as `folded`.

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
        if hasattr(cell, "source") and cell.cell_type == "code":
            if hasattr(cell['metadata'], 'code_folding'):
                folded = cell['metadata']['code_folding']
                if len(folded) > 0:
                    cell.source = self.fold_cell(cell.source, folded)
        return cell, resources
