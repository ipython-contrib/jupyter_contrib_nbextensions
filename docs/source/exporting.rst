.. module:: jupyter_contrib_nbextensions.nbconvert_support


Exporting
=========

Some extensions add functionality you might want to keep when exporting a notebook
to another format using :mod:`nbconvert`.

There are several parts to customize :mod:`nbconvert` output:
 * *Preprocessors* to change content before conversion to another format
 * *Postprocessors* to change content after conversion to another format
 * *Exporters* to actually do the conversion to another format
 * *Templates* provide customization using Jinja without writing an exporter


Preprocessors
-------------

Generic documentation for preprocessors can be found at
http://nbconvert.readthedocs.io/en/latest/api/preprocessors.html.

Retaining Codefolding
^^^^^^^^^^^^^^^^^^^^^

.. autoclass:: CodeFoldingPreprocessor


Coallapsible Headings
^^^^^^^^^^^^^^^^^^^^^

.. autoclass:: CollapsibleHeadingsPreprocessor

Retaining Highlighting
^^^^^^^^^^^^^^^^^^^^^^

.. autoclass:: HighlighterPreprocessor


Evaluating code in Markdown (PyMarkDown)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. autoclass:: PyMarkdownPreprocessor

Converting linked SVG to PDF
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. autoclass:: SVG2PDFPreprocessor



Postprocessors
--------------

Generic documentation for postprocessors can be found here
http://nbconvert.readthedocs.io/en/latest/api/postprocessors.html

Retaining Highlighting
^^^^^^^^^^^^^^^^^^^^^^

.. autoclass:: HighlighterPostProcessor


Exporters
---------

Generic documentation for exporters can be found at
http://nbconvert.readthedocs.io/en/latest/api/exporters.html

Embed images in HTML
^^^^^^^^^^^^^^^^^^^^

.. autoclass:: EmbedHTMLExporter

    Allows embedding images (pdf, svg and raster images) into a HTML file as base64 encoded binary,
    instead of linking to them.

        jupyter nbconvert --to html_embed --NbConvertApp.codefolding=True mynotebook.ipynb

Export Table of Contents
^^^^^^^^^^^^^^^^^^^^^^^^

.. autoclass:: TocExporter


Templates
---------

Generic documentation on templates can be found at
http://nbconvert.readthedocs.io/en/latest/customizing.html

To find the location of the custom templates you can use this function:
.. autofunction:: templates_directory

Hiding cells
^^^^^^^^^^^^

*nbextensions.tpl* and *nbextensions.tplx*<br>
Templates for notebook extensions that allow hiding code cells, output, or text cells.
Usage::

    $ jupyter nbconvert --template=nbextensions mynotebook.ipynb
        
The supported cell metadata tags are:
 * `cell.metadata.hidden` - hide complete cell
 * `cell.metadata.hide_input` - hide code cell input
 * `cell.metadata.hide_output` - hide code cell output
   
