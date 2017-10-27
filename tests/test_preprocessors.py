# -*- coding: utf-8 -*-

import json
import os
import re

import nbformat.v4 as nbf
from nbconvert import LatexExporter, NotebookExporter, RSTExporter
from nbconvert.utils.pandoc import PandocMissing
from nose.plugins.skip import SkipTest
from nose.tools import (
    assert_greater_equal, assert_in, assert_not_in, assert_true,
)
from traitlets.config import Config


def path_in_data(rel_path):
    """Return an absolute path from a relative path in tests/data."""
    return os.path.join(os.path.dirname(__file__), 'data', rel_path)


def export_through_preprocessor(
        notebook_node, preproc_cls, exporter_class, export_format,
        customconfig=None):
    """Export a notebook through a given preprocessor."""
    config = Config(NbConvertApp={'export_format': export_format})
    if customconfig is not None:
        config.merge(customconfig)
    exporter = exporter_class(
        preprocessors=[preproc_cls.__module__ + '.' + preproc_cls.__name__],
        config=config)
    try:
        return exporter.from_notebook_node(notebook_node)
    except PandocMissing:
        raise SkipTest("Pandoc wasn't found")


def test_preprocessor_pymarkdown():
    """Test python markdown preprocessor."""
    # check import shortcut
    from jupyter_contrib_nbextensions.nbconvert_support import PyMarkdownPreprocessor  # noqa E501
    notebook_node = nbf.new_notebook(cells=[
        nbf.new_code_cell(source="a = 'world'"),
        nbf.new_markdown_cell(source="Hello {{ a }}",
                              metadata={"variables": {" a ": "world"}}),
    ])
    body, resources = export_through_preprocessor(
        notebook_node, PyMarkdownPreprocessor, RSTExporter, 'rst', )
    expected = 'Hello world'
    assert_in(expected, body, 'first cell should contain {}'.format(expected))


def test_preprocessor_codefolding():
    """Test codefolding preprocessor."""
    # check import shortcut
    from jupyter_contrib_nbextensions.nbconvert_support import CodeFoldingPreprocessor  # noqa: E501
    notebook_node = nbf.new_notebook(cells=[
        nbf.new_code_cell(source='\n'.join(["# Codefolding test 1",
                                            "'AXYZ12AXY'"]),
                          metadata={"code_folding": [0]}),
        nbf.new_code_cell(source='\n'.join(["# Codefolding test 2",
                                            "def myfun():",
                                            "    if True : ",
                                            "       ",
                                            "      ",
                                            "        'GR4CX32ZT'",
                                            "        ",
                                            "      "]),
                          metadata={"code_folding": [1]}),
        nbf.new_code_cell(source='\n'.join(["# Codefolding test 3",
                                            "def myfun():",
                                            "    if True : ",
                                            "       ",
                                            "      ",
                                            "        'GR4CX32ZE'",
                                            "        ",
                                            "      ",
                                            "    'GR4CX32ZR'"]),
                          metadata={"code_folding": [2]})
    ])
    customconfig = Config(CodeFoldingPreprocessor={'remove_folded_code': True})
    body, resources = export_through_preprocessor(
        notebook_node, CodeFoldingPreprocessor, RSTExporter, 'rst',
        customconfig)
    assert_not_in('AXYZ12AXY', body, 'check firstline fold has worked')
    assert_not_in('GR4CX32ZT', body, 'check function fold has worked')
    assert_in('GR4CX32ZR', body, 'check if fold has worked')
    assert_not_in('GR4CX32ZE', body, 'check if fold has worked')


def test_preprocessor_svg2pdf():
    """Test svg2pdf preprocessor for markdown cell svg images in latex/pdf."""
    # check import shortcut
    from jupyter_contrib_nbextensions.nbconvert_support import SVG2PDFPreprocessor  # noqa: E501
    from jupyter_contrib_nbextensions.nbconvert_support.pre_svg2pdf import (
        get_inkscape_executable_path)
    if not get_inkscape_executable_path():
        raise SkipTest('No inkscape executable found')

    notebook_node = nbf.new_notebook(cells=[
        nbf.new_markdown_cell(
            source='![This is a test]({})'.format(path_in_data('test.svg')))
    ])
    body, resources = export_through_preprocessor(
        notebook_node, SVG2PDFPreprocessor, LatexExporter, 'latex')

    pdf_path = path_in_data('test.pdf')
    pdf_existed = os.path.isfile(pdf_path)
    if pdf_existed:
        os.remove(pdf_path)
    assert_true(pdf_existed, 'exported pdf should exist')
    assert_in('test.pdf', body,
              'exported pdf should be referenced in exported notebook')


def _normalize_iso8601_timezone(timestamp_str):
    # Zulu -> +00:00 offset
    timestamp_str = re.sub(r'Z$', r'+00:00', timestamp_str)
    # HH -> HH:00 offset
    timestamp_str = re.sub(r'([+-]\d\d)$', r'\1:00', timestamp_str)
    # HHMM -> HH:MM offset
    timestamp_str = re.sub(r'([+-]\d\d):?(\d\d)$', r'\1:\2', timestamp_str)
    return timestamp_str


def test_preprocessor_execute_time():
    """Test ExecuteTime preprocessor."""
    # check import shortcut
    from jupyter_contrib_nbextensions.nbconvert_support import ExecuteTimePreprocessor  # noqa E501
    notebook_node = nbf.new_notebook(cells=[
        nbf.new_code_cell(source="a = 'world'"),
        nbf.new_code_cell(source="import time\ntime.sleep(2)"),
    ])
    body, resources = export_through_preprocessor(
        notebook_node, ExecuteTimePreprocessor, NotebookExporter, 'ipynb')
    cells = json.loads(body)['cells']
    for cell in cells:
        if cell['cell_type'] != 'code':
            assert_not_in('ExecuteTime', cell['metadata'])
        else:
            assert_in('ExecuteTime', cell['metadata'])
            etmd = cell['metadata']['ExecuteTime']
            assert_in('start_time', etmd)
            assert_in('end_time', etmd)
            assert_greater_equal(
                _normalize_iso8601_timezone(etmd['end_time']),
                _normalize_iso8601_timezone(etmd['start_time']),
                'end_time should not be before start_time')
