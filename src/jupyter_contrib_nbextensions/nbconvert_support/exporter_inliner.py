"""Nbconvert exporter to inline css & js for collapsible_headings."""

from __future__ import print_function

from nbconvert.exporters.html import HTMLExporter
from traitlets import Dict


class ExporterInliner(HTMLExporter):

    inliner_resources = Dict(
        {'css': [], 'js': []}, config=True,
        help='css and js scripts to wrap in html <style> or <script> tags')

    def _template_file_default(self):
        return 'inliner'

    def from_notebook_node(self, nb, resources=None, **kw):

        # ensure resources used by template actually exist, add in any from
        # config
        if resources is None:
            resources = {}
        inliner_resources = resources.setdefault('inliner', {})
        for tt in ('css', 'js'):
            existing_items = inliner_resources.setdefault(tt, [])
            existing_items += [
                item for item in self.inliner_resources[tt]
                if item not in existing_items]

        return super(ExporterInliner, self).from_notebook_node(
            nb, resources, **kw)

    @property
    def default_config(self):
        c = super(ExporterInliner, self).default_config
        #  import here to avoid circular import
        from jupyter_contrib_nbextensions.nbconvert_support import (
            templates_directory)
        contrib_templates_dir = templates_directory()

        template_path = c.TemplateExporter.setdefault('template_path', [])
        if contrib_templates_dir not in template_path:
            template_path.append(contrib_templates_dir)

        return c
