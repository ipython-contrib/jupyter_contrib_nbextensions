"""Nbconvert preprocessor for the python-markdown nbextension."""

from nbconvert.preprocessors import Preprocessor
from traitlets import Bool, Float
import re
import os
import base64
from urllib.request import urlopen
from io import StringIO
from ipython_genutils.ipstruct import Struct


class EmbedImagesPreprocessor(Preprocessor):
    """
    :mod:`nbconvert` Preprocessor to embed images in a markdown cell as attachment inside the notebook itself.

    This :class:`~nbconvert.preprocessors.Preprocessor` replaces kernel code in
    markdown cells with the results stored in the cell metadata.

    The preprocessor is installed by default. To enable embedding images with
    NbConvert, you need to set the configuration parameter
    `EmbedImagesPreprocessor.embed_images=True`.
    This can be done either in the `jupyter_nbconvert_config.py` file::

        c.EmbedImagesPreprocessor.embed_images=True

    or using a command line parameter when calling NbConvert::

        $ jupyter nbconvert --to html --EmbedImagesPreprocessor.embed_images=True mynotebook.ipynb

    Further options are

        EmbedImagesPreprocessor.embed_remote_images=True

    to additionally embeds all images referenced by an url (e.g. http://jupyter.org/assets/nav_logo.svg) instead
    of a local file name. Also

        EmbedImagesPreprocessor.dpi_scaling

    Let's you scale the size of an image. This is interesting if you want to save space by not embedding large
    images and instead use a smaller (scaled) version. Works only for raster images (i.e. png, jpg).

    *Note:* To embed images after conversion to HTML you can also use the `html_embed` exporter
    """

    embed_images = Bool(False, help="Embed images as attachment").tag(config=True)
    embed_remote_images = Bool(False, help="Embed images referenced by an url as attachment").tag(config=True)
    dpi_scaling = Float(0, help="Resize images to a certain DPI number (reduce size)").tag(config=True)

    def preprocess(self, nb, resources):
        """Skip preprocessor if not enabled"""
        if self.embed_images:
            nb, resources = super(EmbedImagesPreprocessor, self).preprocess(nb, resources)
        return nb, resources

    def replfunc_md(self, match):
        """Read image and store as base64 encoded attachment"""
        url = match.group(2)
        imgformat = url.split('.')[-1]
        if url.startswith('http'):
            if self.embed_remote_images:
                data = urlopen(url).read()
            else:
                return match.string
        elif url.startswith('attachment'):
            return match.string
        else:
            filename = os.path.join(self.path, url)
            with open(filename, 'rb') as f:
                data = f.read()

        # TODO: scale image...
        if self.dpi_scaling > 0 and imgformat in ['png', 'jpg']:
            try:
                import pillow as PIL
            except ImportError:
                self.log.info("pillow library not available to scale images")
            if PIL:
                #im = PIL.Image.open(StringIO(data))
                #size = 128, 128
                #im.thumbnail(size, PIL.Image.ANTIALIAS)
                #data = im.save()
                self.log.info("Rescaled image %s to size %d x %d pixels" % (imgname, size) )

        self.log.debug("embedding url: %s, format: %s" % (url, imgformat))
        b64_data = base64.b64encode(data).decode("utf-8")
        self.attachments[url] = { 'image/'+imgformat : b64_data }

        newimg = '![' + match.group(1) + '](attachment:' + match.group(2) + ')'
        return newimg

    def preprocess_cell(self, cell, resources, index):
        """
        Preprocess cell

        Parameters
        ----------
        cell : NotebookNode cell
            Notebook cell being processed
        resources : dictionary
            Additional resources used in the conversion process.  Allows
            preprocessors to pass variables into the Jinja engine.
        cell_index : int
            Index of the cell being processed (see base.py)
        """
        self.path = resources['metadata']['path']
        self.attachments = Struct()

        if cell.cell_type == "markdown":
            regex = re.compile('!\[([^"]*)\]\(([^"]+)\)')
            cell.source = regex.sub(self.replfunc_md, cell.source)
            cell.attachments = self.attachments
        return cell, resources
