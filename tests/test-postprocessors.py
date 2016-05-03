# -*- coding: utf-8 -*-
from nbconvert import RSTExporter, LatexExporter
import nbformat
from traitlets.config import Config
import os
import sys
sys.path.append('extensions')
c = Config()


def test_pymarkdown_preprocessor():
    """ Test python markdown preprocessor """
    nb_name='tests/data/pymarkdown.ipynb'
    with open(nb_name, 'r') as f:
        notebook_json = f.read()
    notebook = nbformat.reads(notebook_json, as_version=4)
    c.RSTExporter.preprocessors = ["pre_pymarkdown.PyMarkdownPreprocessor"]
    c.NbConvertApp.export_format = 'rst'
    rst_exporter = RSTExporter(config=c)
    body = rst_exporter.from_notebook_node(notebook)
    with open('test.txt', 'wb') as f:
        f.write(body[0].encode('utf8'))
    assert 'Hello world' in body[0]
    pass


def test_codefolding():
    """ Test codefolding preprocessor """
    nb_name='tests/data/codefolding.ipynb'
    with open(nb_name, 'r') as f:
        notebook_json = f.read()
    notebook = nbformat.reads(notebook_json, as_version=4)
    c.RSTExporter.preprocessors = ["pre_codefolding.CodeFoldingPreprocessor"]
    c.NbConvertApp.export_format = 'rst'
    rst_exporter = RSTExporter(config=c)
    body = rst_exporter.from_notebook_node(notebook)
    assert 'AXYZ12AXY' not in body[0]  # firstline fold
    assert 'GR4CX32ZT' not in body[0]  # function fold


def test_svg2pdf_preprocessor():
    """ Test svg2pdf preprocessor for markdown cell images """
    nb_name='tests/data/svg2pdf.ipynb'
    pdf_file='tests/data/test.pdf'
    with open(nb_name, 'r') as f:
        notebook_json = f.read()
    notebook = nbformat.reads(notebook_json, as_version=4)
    c.LatexExporter.preprocessors = ["pre_svg2pdf.SVG2PDFPreprocessor"]
    c.NbConvertApp.export_format = 'latex'
    latex_exporter = LatexExporter(config=c)
    body = latex_exporter.from_notebook_node(notebook)
    assert os.path.isfile(pdf_file) 
    os.remove(pdf_file)
    assert 'test.pdf' in body[0]
