# -*- coding: utf-8 -*-

from __future__ import print_function

from nbconvert.preprocessors import Preprocessor


class CollapsibleHeadingsPreprocessor(Preprocessor):

    ref_level = 7

    def preprocess_cell(self, cell, resources, index):
        if 'cell_level' in cell:
            level = cell['cell_level']
        else:
            level = 7

        if (level > self.ref_level):
            print('hiding cell', index)
            # Temporary hack fix this using filters
            cell['metadata']['hidden'] = True
        elif 'heading_collapsed' in cell['metadata']:
            self.ref_level = level
        else:
            self.ref_level = 7

        return cell, resources
