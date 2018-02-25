"""Embed graphics into Slides Exporter class"""

from nbconvert.exporters.slides import SlidesExporter
from .exporter_embedhtml import EmbedImages


class EmbedSlidesExporter(SlidesExporter, EmbedImages):
    """
    :mod:`nbconvert` Exporter which embeds graphics as base64 into html.

    Convert to HTML and embed graphics (pdf, svg and raster images) in the HTML
    file.

    Example usage::

        jupyter nbconvert --to slides_embed mynotebook.ipynb
    """
    def from_notebook_node(self, nb, resources=None, **kw):
        output, resources = super(
            EmbedSlidesExporter, self).from_notebook_node(nb, resources)

        embedded_output = self.embed_images_into_notebooks(output, resources)
        return embedded_output, resources
