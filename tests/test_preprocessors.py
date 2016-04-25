# -*- coding: utf-8 -*-
"""Tests for themysto.preprocessors."""

import os

import nbformat
from nbconvert import LatexExporter, RSTExporter
from nbconvert.utils.pandoc import PandocMissing
from nose.plugins.skip import SkipTest
from nose.tools import assert_in, assert_not_in, assert_true
from traitlets.config import Config


def path_in_data(rel_path):
    """Return an absolute path from a relative path in tests/data."""
    return os.path.join(os.path.dirname(__file__), 'data', rel_path)


def export_through_preprocessor(
        preproc_rel_name, nb_rel_path, exporter_class, export_format):
    """Export a notebook through a given preprocessor."""
    nb_path = path_in_data(nb_rel_path)
    notebook_node = nbformat.read(nb_path, as_version=4)
    exporter = exporter_class(
        preprocessors=['themysto.preprocessors.' + preproc_rel_name],
        config=Config(NbConvertApp={'export_format': export_format}))
    try:
        return exporter.from_notebook_node(notebook_node)
    except PandocMissing:
        raise SkipTest("Pandoc wasn't found")


def test_pymarkdown_preprocessor():
    """Test python markdown preprocessor."""
    body = export_through_preprocessor(
        'pre_pymarkdown.PyMarkdownPreprocessor', 'pymarkdown.ipynb',
        RSTExporter, 'rst')
    expected = 'Hello world'
    assert_in(
        expected, body[0], 'first cell should contain {}'.format(expected))


def test_codefolding():
    """Test codefolding preprocessor."""
    body = export_through_preprocessor(
        'pre_codefolding.CodeFoldingPreprocessor', 'codefolding.ipynb',
        RSTExporter, 'rst')
    assert_not_in('AXYZ12AXY', body[0], 'check firstline fold has worked')
    assert_not_in('GR4CX32ZT', body[0], 'check function fold has worked')


def test_svg2pdf_preprocessor():
    """Test svg2pdf preprocessor for markdown cell svg images."""
    from themysto.preprocessors.pre_svg2pdf import get_inkscape_executable_path
    if get_inkscape_executable_path() is None:
        raise SkipTest('No inkscape executable found')
    body = export_through_preprocessor(
        'pre_svg2pdf.SVG2PDFPreprocessor', 'svg2pdf.ipynb',
        LatexExporter, 'latex')

    pdf_path = path_in_data('test.pdf')
    assert_true(os.path.isfile(pdf_path), 'exported pdf should exist')
    if os.path.isfile(pdf_path):
        os.remove(pdf_path)
    assert_in('test.pdf', body[0],
              'exported pdf should be referenced in exported notebook')
