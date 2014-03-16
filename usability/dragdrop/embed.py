"""PostProcessor for embedding images in HTML files."""
from __future__ import print_function
#-----------------------------------------------------------------------------
#Copyright (c) 2013, the IPython Development Team.
#
#Distributed under the terms of the Modified BSD License.
#
#The full license is in the file COPYING.txt, distributed with this software.
#-----------------------------------------------------------------------------

#-----------------------------------------------------------------------------
# Imports
#-----------------------------------------------------------------------------

import os
import re
import base64
import urllib

from IPython.utils.traitlets import Bool, Unicode, Int

from IPython.nbconvert.postprocessors.base import PostProcessorBase


class EmbedPostProcessor(PostProcessorBase):
    """Post processor designed to embed images in HTML file
    
    """

    def replfunc(self, match):
        url = match.group(1)
        imgformat = url.split('.')[-1]
        self.log.info("url: %s, format: %s" % (url, imgformat))
        data = urllib.urlopen(url).read()
        b64_data=base64.b64encode(data)
        if imgformat == "svg":
            #img = '<src src="data:svg;' + data + '">'
            img = '<div>' + data + '</div>'
            img = '<img src="data:image/svg+xml;base64,' + b64_data + '"/>'
        else:
            img = '<img src="data:image/'+imgformat+';base64,' + b64_data + '"/>'
        return img

    def postprocess(self, input):
        self.log.info("embedding images: %s",input)

        regex = re.compile('<img\s+ src="(\S+)"\s*/>')
        output='temp.html'
        with open(input) as fin, open(output,'w') as fout:
            for line in fin:
                fout.write(regex.sub(self.replfunc,line))
        fin.close()
        fout.close()