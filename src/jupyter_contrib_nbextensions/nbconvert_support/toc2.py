"""Toc2 Exporter class"""

# -----------------------------------------------------------------------------
# Copyright (c) 2016, the IPython IPython-Contrib Development Team.
#
# Distributed under the terms of the Modified BSD License.
#
# -----------------------------------------------------------------------------

# -----------------------------------------------------------------------------
# Imports
# -----------------------------------------------------------------------------

from nbconvert.exporters.html import HTMLExporter
from traitlets.config import Config

# -----------------------------------------------------------------------------
# Classes
# -----------------------------------------------------------------------------


class TocExporter(HTMLExporter):
    """Exports to an html document, embedding toc2 extension (.html)."""

    def _file_extension_default(self):
        return '.html'

    def _template_file_default(self):
        return 'toc2'

    output_mimetype = 'text/html'

    def _raw_mimetypes_default(self):
        return ['text/markdown', 'text/html', '']

    @property
    def default_config(self):
        c = Config({'ExtractOutputPreprocessor': {'enabled': True}})
        #  import here to avoid circular import
        from jupyter_contrib_nbextensions.nbconvert_support import (
            templates_directory)
        c.merge(super(TocExporter, self).default_config)

        c.TemplateExporter.template_path = [
            '.',
            templates_directory(),
        ]

        return c
