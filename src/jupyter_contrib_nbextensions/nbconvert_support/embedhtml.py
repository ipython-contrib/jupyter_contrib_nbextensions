"""Embed graphics into HTML Exporter class"""

import base64
import os

from ipython_genutils.ipstruct import Struct
from nbconvert.exporters.html import HTMLExporter

try:
    from urllib.request import urlopen  # py3
except ImportError:
    from urllib2 import urlopen


class EmbedHTMLExporter(HTMLExporter):
    """
    :mod:`nbconvert` Exporter which embeds graphics as base64 into html.

    Convert to HTML and embed graphics (pdf, svg and raster images) in the HTML
    file.

    Example usage::

        jupyter nbconvert --to html_embed mynotebook.ipynb
    """

    def replfunc(self, node):
        """Replace source url or file link with base64 encoded blob."""
        url = node.attrib["src"]
        imgformat = url.split('.')[-1]
        b64_data = None
        prefix = None

        if url.startswith('data'):
            return  # Already in base64 Format

        self.log.info("try embedding url: %s, format: %s" % (url, imgformat))

        if url.startswith('http'):
            b64_data = base64.b64encode(urlopen(url).read()).decode("utf-8")
        elif url.startswith('attachment'):
            imgname = url.split(':')[1]
            available_formats = self.attachments[imgname]
            # get the image based on the configured image type priority
            for imgformat in self.config.NbConvertBase.display_data_priority:
                if imgformat in available_formats.keys():
                    b64_data = self.attachments[imgname][imgformat]
                    prefix = "data:%s;base64," % imgformat
            if b64_data is None:
                raise ValueError("""Could not find attachment for image '%s'
                                    in notebook""" % imgname)
        else:
            filename = os.path.join(self.path, url)
            with open(filename, 'rb') as f:
                b64_data = base64.b64encode(f.read()).decode("utf-8")

        if prefix is None:
            if imgformat == "svg":
                prefix = "data:image/svg+xml;base64,"
            elif imgformat == "pdf":
                prefix = "data:application/pdf;base64,"
            else:
                prefix = "data:image/" + imgformat + ';base64,'

        node.attrib["src"] = prefix + b64_data

    def from_notebook_node(self, nb, resources=None, **kw):
        # The parent nbconvert_support module imports this module, and
        # nbconvert_support is imported as part of our install scripts, and
        # other fairly basic stuff.
        # By keeping lxml import in this method, we can still import this
        # module even if lxml isn't available, or is missing dependencies, etc.
        # In this way, problems with lxml should only bother people who are
        # actually trying to *use* this.
        import lxml.etree as et
        output, resources = super(
            EmbedHTMLExporter, self).from_notebook_node(nb, resources)

        self.path = resources['metadata']['path']

        # Get attachments
        self.attachments = Struct()
        for cell in nb.cells:
            if 'attachments' in cell.keys():
                self.attachments += cell['attachments']

        # Parse HTML and replace <img> tags with the embedded data
        parser = et.HTMLParser()
        root = et.fromstring(output, parser=parser)
        nodes = root.findall(".//img")
        for n in nodes:
            self.replfunc(n)

        # Convert back to HTML
        embedded_output = et.tostring(root.getroottree(),
                                      method="html",
                                      encoding='unicode')

        return embedded_output, resources
