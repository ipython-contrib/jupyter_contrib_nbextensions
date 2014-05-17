from IPython.nbconvert.preprocessors import Preprocessor

class HierarchicalCollapsePreprocessor(Preprocessor):

    ref_level = 7
    hide = False

    def preprocess_cell(self, cell , resources, index):

        if self.hide:
            print "hiding cell %d"%index
            # Temporary hack fix this using filters
            cell['metadata']['hidden'] = True
            return cell, resources

        if self.is_collapsed_heading(cell):
            self.ref_level = min( self.cell_level(cell), self.ref_level )
            self.hide = True

        if self.hide and self.cell_level(cell) < self.ref_level :
            self.ref_level = self.cell_level(cell)
            self.hide = self.is_collapsed_heading

        return cell, resources


    def is_collapsed_heading(self, cell):
        if 'heading_collapsed' in cell['metadata']:
            return True
        return False

    def cell_level(self, cell):
        if 'cell_level' in cell:
            return cell['cell_level']
        else:
            return 7
