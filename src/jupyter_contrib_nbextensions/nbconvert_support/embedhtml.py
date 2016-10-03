"""Embed graphics into HTML Exporter class"""

import base64
import re
from nbconvert.exporters.html import HTMLExporter

try:
    from urllib.request import urlopen  # py3
except ImportError:
    from urllib2 import urlopen


class EmbedHTMLExporter(HTMLExporter):
    def replfunc(self, match):
        """Replace source url or file link with base64 encoded blob."""
        url = match.group(1)
        imgformat = url.split('.')[-1]
        if url.startswith('http'):
            data = urlopen(url).read()
        elif url.startswith('data'):
            img = '<img src="' + url + '" ' + match.group(2) + ' />'
            return img
        else:
            with open(url, 'rb') as f:
                data = f.read()

        self.log.info("embedding url: %s, format: %s" % (url, imgformat))
        b64_data = base64.b64encode(data).decode("utf-8")
        if imgformat == "svg":
            img = '<img src="data:image/svg+xml;base64,' + \
                b64_data + '"  ' + match.group(2) + '/>'
        elif imgformat == "pdf":
            img = '<img src="data:application/pdf;base64,' + \
                b64_data + '"  ' + match.group(2) + '/>'
        else:
            img = '<img src="data:image/' + imgformat + \
                ';base64,' + b64_data + '" ' + match.group(2) + ' />'
        return img

    def from_notebook_node(self, nb, resources=None, **kw):
        output, resources = super(EmbedHTMLExporter, self).from_notebook_node(nb, resources)

        regex = re.compile('<img\s+src="(\S+)"\s*(\S*)\s*')

        embedded_output = regex.sub(self.replfunc, output)
        return embedded_output, resources
