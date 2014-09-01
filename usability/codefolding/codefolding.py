# -*- coding: utf-8 -*-
"""This preprocessor removes lines in code cells that have been marked as `folded`
by the codefolding extension
"""

from IPython.nbconvert.preprocessors import *

try:
    from io import StringIO
except ImportError:
    from cStringIO import StringIO
    
class CodeFoldingPreprocessor(Preprocessor):

    def fold_cell(self,cell,folded):
        """
        Remove folded lines and add a '<->' at the parent line
        """
        f = StringIO.StringIO(cell)
        lines = f.readlines()
    
        if folded[0] == 0 and lines[0][0] == '#':
            # fold when first line is a comment
            return lines[0].rstrip('\n') + '<->\n'
        fold_indent = 0
        fold = False
        fcell = ""
        for i,l in enumerate(lines):
            # fold indent level
            indent = len(l)-len(l.lstrip(' '))
            if indent <= fold_indent:
                fold = False
                fold_indent = 0
            if i in folded:
                fold = True
                fold_indent = indent
                fcell += l.rstrip('\n') + '<->\n'
            if fold is False:
                fcell += l
        return fcell

    def preprocess_cell(self, cell, resources, index):
        """
        Read out metadata and remove lines if marked as `folded` in cell metadata.

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
        if hasattr(cell, "input") and cell.cell_type == "code":
            if hasattr(cell['metadata'], 'code_folding'):
                folded = cell['metadata']['code_folding']
                if len(folded) > 0:
                    cell.input = self.fold_cell(cell.input, folded)
        return cell, resources
