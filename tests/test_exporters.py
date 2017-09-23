# -*- coding: utf-8 -*-
"""Tests for custom exporters."""

import io
import os
from functools import wraps

from nbconvert.tests.base import TestsBase
from nbformat import v4, write


def path_in_data(rel_path):
    """Return an absolute path from a relative path in tests/data."""
    return os.path.join(os.path.dirname(__file__), 'data', rel_path)


def _with_tmp_cwd(func):
    @wraps(func)
    def func_wrapper(self, *args, **kwargs):
        with self.create_temp_cwd():
            return func(self, *args, **kwargs)
    return func_wrapper


def _filesize_without_cr(name):
    """Calculate file size without additional CR (Windows) """
    with io.open(name, 'r', encoding='utf-8') as f:
	print(data.encode("utf-8"))
        data = f.read().replace('\r', '')
    size = len(data)
    return size


class TestNbConvertExporters(TestsBase):

    def check_stuff_gets_embedded(self, nb, exporter_name, to_be_included=[]):
        nb_basename = 'notebook'
        nb_src_filename = nb_basename + '.ipynb'
        with io.open(nb_src_filename, 'w', encoding='utf-8') as f:
            write(nb, f, 4)

        # convert with default exporter
        (stdout, stderr) = self.nbconvert('--to {} "{}"'.format('html', nb_src_filename))
        print(stdout)
        nb_dst_filename = nb_basename + '.html'
        assert os.path.isfile(nb_dst_filename)
        filesize = _filesize_without_cr(nb_dst_filename)
        os.remove(nb_dst_filename)

        # convert with embedding exporter
        (stdout, stderr) = self.nbconvert('--to {} "{}"'.format(exporter_name, nb_src_filename))
        print(stdout)
        filesize_e = _filesize_without_cr(nb_dst_filename)
        assert os.path.isfile(nb_dst_filename)
        assert filesize_e > filesize

        with io.open(nb_dst_filename, 'r', encoding='utf-8') as f:
            embedded_nb = f.read()

        for txt in to_be_included:
            assert txt in embedded_nb

    @_with_tmp_cwd
    def test_embedhtml(self):
        """Test exporter for embedding images into HTML"""
        nb = v4.new_notebook(cells=[
            v4.new_code_cell(source="a = 'world'"),
            v4.new_markdown_cell(
                source="![testimage]({})".format(path_in_data('icon.png'))
            ),
        ])
        self.check_stuff_gets_embedded(
            nb, 'html_embed', to_be_included=['base64'])

    @_with_tmp_cwd
    def test_htmltoc2(self):
        """Test exporter for adding table of contents"""
        nb = v4.new_notebook(cells=[
            v4.new_code_cell(source="a = 'world'"),
            v4.new_markdown_cell(source="# Heading"),
        ])
        self.check_stuff_gets_embedded(
            nb, 'html_toc', to_be_included=['toc2'])

    @_with_tmp_cwd
    def test_html_collapsible_headings(self):
        """Test exporter for inlining collapsible_headings"""
        nb = v4.new_notebook(cells=[
            v4.new_markdown_cell(source=('# level 1 heading')),
            v4.new_code_cell(source='a = range(1,10)'),
            v4.new_markdown_cell(source=('## level 2 heading')),
            v4.new_code_cell(source='a = range(1,10)'),
            v4.new_markdown_cell(source=('### level 3 heading')),
            v4.new_code_cell(source='a = range(1,10)'),
        ])
        self.check_stuff_gets_embedded(
            nb, 'html_ch', to_be_included=['collapsible_headings'])
