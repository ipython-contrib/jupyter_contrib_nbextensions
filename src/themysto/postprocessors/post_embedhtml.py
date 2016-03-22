# -*- coding: utf-8 -*-
"""PostProcessor for embedding markdown images in HTML files."""

from __future__ import print_function

import base64
import re

from nbconvert.postprocessors.base import PostProcessorBase

try:
    from urllib.request import urlopen  # py3
except ImportError:
    from urllib2 import urlopen


class EmbedPostProcessor(PostProcessorBase):
    """ Post processor designed to embed images in markdown cells as base64
    encoded blob in HTML file
    """

    def replfunc(self, match):
        """ replace source url or file link with base64 encoded blob """
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
            img = (
                '<img src="data:image/svg+xml;base64,' +
                b64_data + '"  ' + match.group(2) + '/>'
            )
        elif imgformat == "pdf":
            img = (
                '<img src="data:application/pdf;base64,' +
                b64_data + '"  ' + match.group(2) + '/>'
            )
        else:
            img = '<img src="data:image/' + imgformat + \
                ';base64,' + b64_data + '" ' + match.group(2) + ' />'
        return img

    def postprocess(self, input):
        if self.config.export_format == "html":
            regex = re.compile('<img\s+src="(\S+)"\s*(\S*)\s*/>')
            ext = input.split('.')[-1]
            output = input[0:-(len(ext) + 1)] + '-embedded.' + ext
            with open(input) as fin, open(output, 'w') as fout:
                for line in fin:
                    fout.write(regex.sub(self.replfunc, line))
            fin.close()
            fout.close()
