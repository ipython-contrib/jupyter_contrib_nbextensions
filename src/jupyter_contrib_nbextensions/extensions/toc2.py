"""Toc2 Exporter class"""

#-----------------------------------------------------------------------------
# Copyright (c) 2016, the IPython IPython-Contrib Development Team.
#
# Distributed under the terms of the Modified BSD License.
#
#-----------------------------------------------------------------------------

#-----------------------------------------------------------------------------
# Imports
#-----------------------------------------------------------------------------

from traitlets.config import Config
from traitlets.config import Config
from nbconvert.exporters.html import HTMLExporter

#-----------------------------------------------------------------------------
# Classes
#-----------------------------------------------------------------------------

class TocExporter(HTMLExporter):
    """
    Exports to an html document, embedding toc2 extension (.html)
    """
    
    def _file_extension_default(self):
        return '.html'

    def _template_file_default(self):
        return 'toc3'

    output_mimetype = 'text/html'
    
    def _raw_mimetypes_default(self):
        return ['text/markdown', 'text/html', '']

    @property
    def default_config(self):
        import jupyter_core.paths
        import os
        c = Config({'ExtractOutputPreprocessor':{'enabled':True}})
        c.merge(super(TocExporter,self).default_config)
        
        user_templates = os.path.join(jupyter_core.paths.jupyter_data_dir(), 'templates')
        c.TemplateExporter.template_path = [
                                '.', user_templates ]
        return c