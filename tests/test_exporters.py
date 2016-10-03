# -*- coding: utf-8 -*-
"""Tests for custom exporters."""

from nbconvert.tests.base import TestsBase
from nbformat import v4, write
import io
import os

def path_in_data(rel_path):
    """Return an absolute path from a relative path in tests/data."""
    return os.path.join(os.path.dirname(__file__), 'data', rel_path)

class TestNbConvertExporters(TestsBase):

    def test_embedhtml(self):
        """Test exporter for embedding images into HTML"""
        with self.create_temp_cwd():
            nb = v4.new_notebook(cells=[
                v4.new_code_cell(source="a = 'world'"),
                v4.new_markdown_cell(source="![testimage]({})".format(path_in_data('icon.png'))),
            ])
            with io.open('notebook2.ipynb', 'w', encoding='utf-8') as f:
                write(nb, f, 4)

            self.nbconvert('--to html'
                           ' "notebook2"')
            statinfo = os.stat('notebook2.html')
            assert os.path.isfile('notebook2.html')
            os.remove('notebook2.html')

            self.nbconvert('--to html_embed'
                           ' "notebook2"')
            statinfo_e = os.stat('notebook2.html')
            assert os.path.isfile('notebook2.html')
            assert statinfo_e.st_size > statinfo.st_size

    def test_htmltoc2(self):
        """Test exporter for adding table of contents"""
        with self.create_temp_cwd():
            nb = v4.new_notebook(cells=[
                v4.new_code_cell(source="a = 'world'"),
                v4.new_markdown_cell(source="# Heading"),
            ])
            with io.open('notebook2.ipynb', 'w', encoding='utf-8') as f:
                write(nb, f, 4)

            self.nbconvert('--to html_toc'
                           ' "notebook2"')
            assert os.path.isfile('notebook2.html')

