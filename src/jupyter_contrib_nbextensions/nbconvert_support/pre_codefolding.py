# -*- coding: utf-8 -*-
"""
This preprocessor removes lines in code cells that have been marked as `folded`
by the codefolding extension
"""

from nbconvert.preprocessors import Preprocessor


class CodeFoldingPreprocessor(Preprocessor):
    """
    :mod:`nbconvert` Preprocessor for the code_folding nbextension.

    Folds codecells as displayed in the notebook.

    The preprocessor is installed by default. To enable codefolding with
    NbConvert, you need to set the configuration parameter
    `NbConvertApp.codefolding=True`.
    This can be done either in the `jupyter_nbconvert_config.py` file::

        c.NbConvertApp.codefolding = True

    or using a command line parameter when calling NbConvert::

        $ jupyter nbconvert --to html --NbConvertApp.codefolding=True mynotebook.ipynb

    """  # noqa: E501

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
        Requires configuration parameter 'NbConvertApp.codefolding = True'

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
        dofolding = self.config.NbConvertApp.get('codefolding', False) is True
        if hasattr(cell, 'source') and cell.cell_type == 'code' and dofolding:
            if hasattr(cell['metadata'], 'code_folding'):
                folded = cell['metadata']['code_folding']
                if len(folded) > 0:
                    cell.source = self.fold_cell(cell.source, folded)
        return cell, resources
