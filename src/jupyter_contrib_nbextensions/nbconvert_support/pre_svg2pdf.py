# -*- coding: utf-8 -*-
"""
Preprocessor to convert svg graphics embedded in markdown to PDF.
"""

import errno
import io
import os
import re
import subprocess
import sys

from ipython_genutils.py3compat import which
from ipython_genutils.tempdir import TemporaryDirectory
from nbconvert.preprocessors import Preprocessor
from traitlets import Unicode

try:
    from urllib.request import urlopen  # py3
except ImportError:
    from urllib2 import urlopen  # py2


def get_inkscape_executable_path():
    """
    Return the path of the system inkscape_ exectuable.

    .. _inkscape: https://inkscape.org/en

    """
    inkscape = which('inkscape')
    if inkscape is not None:
        return inkscape

    if sys.platform == 'darwin':
        default_darwin_inkscape_path = (
            '/Applications/Inkscape.app/Contents/Resources/bin/inkscape')
        if os.path.isfile(default_darwin_inkscape_path):
            return default_darwin_inkscape_path
    elif sys.platform == 'win32':
        try:
            import winreg  # py3 stdlib on windows
        except ImportError:
            import _winreg as winreg  # py2 stdlib on windows
        win32_inkscape_reg_key = "SOFTWARE\\Classes\\inkscape.svg\\DefaultIcon"
        wr_handle = winreg.ConnectRegistry(None, winreg.HKEY_LOCAL_MACHINE)
        try:
            rkey = winreg.OpenKey(wr_handle, win32_inkscape_reg_key)
            inkscape = winreg.QueryValueEx(rkey, "")[0]
        except OSError as ex:
            if ex.errno == errno.ENOENT:
                return None
            raise
        return inkscape
    return None


class SVG2PDFPreprocessor(Preprocessor):
    """
    Preprocessor to convert svg graphics embedded in notebook markdown to PDF.
    Example for a markdown cell image::

        ![My graphic](graphics.svg)

    Because LaTeX can't use SVG graphics, they are converted to PDF using
    inkscape_. This preprocessor is for SVG graphics in markdown only. For SVG
    outputs from codecells, there is already the built-in nbconvert
    preprocessor.

    Configuration::

        c.Exporter.preprocessors.append(
            "jupyter_contrib_nbextensions.nbconvert_support.SVG2PDFPreprocessor"
        )

    .. _inkscape: https://inkscape.org/en
    """  # noqa: E501

    def _from_format_default(self):
        return 'image/svg+xml'

    def _to_format_default(self):
        return 'application/pdf'

    output_filename_template = Unicode(
        "{unique_key}_{cell_index}_{index}{extension}", config=True)

    command = Unicode(
        config=True,
        help="""The command to use for converting SVG to PDF

        This string is a template, which will be formatted with the keys
        to_filename and from_filename.

        The conversion call must read the SVG from {from_flename},
        and write a PDF to {to_filename}.
        """)

    def _command_default(self):
        return (
            self.inkscape +
            ' --without-gui --export-pdf="{to_filename}" "{from_filename}"'
        )

    inkscape = Unicode(config=True, help="The path to Inkscape, if necessary")

    def _inkscape_default(self):
        return get_inkscape_executable_path()

    def convert_figure(self, name, data):
        """Convert a single SVG figure to PDF. Returns converted data."""
        # self.log.info(name, data)
        if not self.inkscape:
            raise OSError('Inkscape executable not found')
        # self.log.info('Inkscape:', self.inkscape)
        # Work in a temporary directory
        with TemporaryDirectory() as tmpdir:
            # Write fig to temp file
            input_filename = os.path.join(tmpdir, 'figure' + '.svg')
            # SVG data is unicode text
            with io.open(input_filename, 'w', encoding='utf8') as f:
                f.write(data.decode('utf-8'))
                # f.write(cast_unicode_py2(data))

            # Call conversion application
            output_filename = os.path.join(tmpdir, 'figure.pdf')
            shell = self.command.format(
                from_filename=input_filename, to_filename=output_filename)
            # Shell=True okay since input is trusted.
            subprocess.call(shell, shell=True)

            # Read output from drive
            # return value expects a filename
            if os.path.isfile(output_filename):
                with open(output_filename, 'rb') as f:
                    # PDF is a nb supported binary data type, so base64 encode
                    return f.read()
                    # return base64.encodestring(f.read())
            else:
                raise TypeError("Inkscape svg to pdf conversion failed")

    def replfunc(self, match):
        """
        Transform a regex match for an svg image into a markdown pdf image tag.

        Parameters
        ----------
        match : re.MatchObject
            Match object containing the markdown image tag with svg images

        Returns
        -------
        str
            New markdown image tag using the converted-to-pdf image
        """
        url = match.group(2) + '.svg'
        if url.startswith('http'):
            data = urlopen(url).read()
        else:
            with open(url, 'rb') as f:
                data = f.read()
        if (self.output_files_dir is not None and
                not os.path.exists(self.output_files_dir)):
            os.makedirs(self.output_files_dir)
        else:
            self.output_files_dir = ''
        output_filename = os.path.join(
            self.output_files_dir, match.group(2) + '.pdf')
        pdf_data = self.convert_figure(match.group(2), data)
        self.log.info('Writing PDF image %s' % output_filename)
        with open(output_filename, 'wb') as f:
            f.write(pdf_data)
        new_img = "[" + match.group(1) + "](" + output_filename + ")"
        return new_img

    def preprocess_cell(self, cell, resources, index):
        """
        Find SVG links and convert to PDF.

        Parameters
        ----------
        cell : NotebookNode cell
            Notebook cell being processed
        resources : dictionary
            Additional resources used in the conversion process.  Allows
            preprocessors to pass variables into the Jinja engine.
        index : int
            Index of the cell being processed (see
            nbconvert.preprocessors.base for details)
        """
        self.output_files_dir = resources.get('output_files_dir', None)
        if (cell.cell_type == 'markdown' and
                self.config.NbConvertApp.export_format in ('latex', 'pdf')):
            cell.source = re.sub(
                '\[(.*)\]\((.+).svg\)', self.replfunc, cell.source,
                flags=re.IGNORECASE)
        return cell, resources
