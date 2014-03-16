"""PostProcessor for embedding markdown images in HTML files."""
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
    """Post processor designed to embed images in markdown cells
	as base64 encoded blob in HTML file
    """

    def replfunc(self, match):
        """ replace source url or file link with base64 encoded blob 
        """
        url = match.group(1)
        imgformat = url.split('.')[-1]
        self.log.info("embedding url: %s, format: %s" % (url, imgformat))
        data = urllib.urlopen(url).read()
        b64_data=base64.b64encode(data)
        if imgformat == "svg":
            img = '<div>' + data + '</div>'
            img = '<img src="data:image/svg+xml;base64,' + b64_data + '"  match.group(2) />'
        else:
            img = '<img src="data:image/'+imgformat+';base64,' + b64_data + '" '+ match.group(2) + ' />'
        return img

    def postprocess(self, input):
        regex = re.compile('<img\s+ src="(\S+)"\s*(\S*)\s*/>')
        ext = input.split('.')[-1]
        output=input[0:-(len(ext)+1)] + '-embedded.' + ext
        with open(input) as fin, open(output,'w') as fout:
            for line in fin:
                fout.write(regex.sub(self.replfunc,line))
        fin.close()
        fout.close()
