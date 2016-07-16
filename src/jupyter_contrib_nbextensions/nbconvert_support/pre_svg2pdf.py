# -*- coding: utf-8 -*-
"""
Preprocessor to convert svg graphics embedded in markdown to PDF.

This preprocessor converts svg graphics embedded in markdown as
'![My graphic](graphics.svg)'
to PDF using Inkscape
"""
import io
import os
import re
import subprocess
import sys

import requests
from ipython_genutils.tempdir import TemporaryDirectory
from nbconvert.preprocessors import Preprocessor
from traitlets import Unicode


INKSCAPE_APP = '/Applications/Inkscape.app/Contents/Resources/bin/inkscape'

if sys.platform == "win32":
    try:
        import winreg
    except ImportError:
        import _winreg as winreg


class SVG2PDFPreprocessor(Preprocessor):

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
            ' --without-gui --export-pdf="{to_filename}" "{from_filename}"')

    inkscape = Unicode(config=True, help="The path to Inkscape, if necessary")

    def _inkscape_default(self):
        if sys.platform == "darwin":
            if os.path.isfile(INKSCAPE_APP):
                return INKSCAPE_APP
        if sys.platform == "win32":
            wr_handle = winreg.ConnectRegistry(None, winreg.HKEY_LOCAL_MACHINE)
            try:
                rkey = winreg.OpenKey(
                    wr_handle, "SOFTWARE\\Classes\\inkscape.svg\\DefaultIcon")
                inkscape = winreg.QueryValueEx(rkey, "")[0]
            except FileNotFoundError:
                raise FileNotFoundError("Inkscape executable not found")
            return inkscape
        return "inkscape"

    def convert_figure(self, name, data):
        """Convert a single SVG figure to PDF.  Returns converted data."""
        # self.log.info(name, data)
        # Work in a temporary directory
        # self.log.info('Inkscape:', self.inkscape)
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
        Replace svg image with pdf.

        Parameters
        ----------
        match: Regex match object
            Markdown image tags with svg images

        Returns
        -------
        img: string
            New markdown image tag with pdf image
        """
        url = match.group(2) + '.svg'
        if url.startswith('http'):
            data = requests.get(url)
        else:
            with open(url, 'rb') as f:
                data = f.read()
        if (self.output_files_dir is not None and
                os.path.exists(self.output_files_dir) is False):
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
            Index of the cell being processed (see base.py)
        """
        self.output_files_dir = resources.get('output_files_dir', None)
        if (cell.cell_type == 'markdown' and
                self.config.NbConvertApp.export_format in ('latex', 'pdf')):
            cell.source = re.sub(
                '\[(.*)\]\((.+).svg\)', self.replfunc, cell.source,
                flags=re.IGNORECASE)
        return cell, resources
