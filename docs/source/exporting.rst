.. module:: jupyter_contrib_nbextensions.nbconvert_support


Exporting
=========

Some extensions require additional effort when exporting them to other formats
using :mod:`nbconvert`.


Preprocessors
-------------

Generic documentation for preprocessors can be found at
http://nbconvert.readthedocs.io/en/latest/api/preprocessors.html.

.. autoclass:: CodeFoldingPreprocessor

.. autoclass:: CollapsibleHeadingsPreprocessor

.. autoclass:: HighlighterPreprocessor

.. autoclass:: PyMarkdownPreprocessor

.. autoclass:: SVG2PDFPreprocessor




Postprocessors
--------------

Generic documentation for postprocessors can be found here
http://nbconvert.readthedocs.io/en/latest/api/postprocessors.html

.. autoclass:: HighlighterPostProcessor


Exporters
---------

Generic documentation for exporters can be found at
http://nbconvert.readthedocs.io/en/latest/api/exporters.html

.. autoclass:: EmbedHTMLExporter

.. autoclass:: TocExporter

.. autoclass:: LenvsHTMLExporter

.. autoclass:: LenvsLatexExporter


Templates
---------

Generic documentation on templates can be found at
http://nbconvert.readthedocs.io/en/latest/customizing.html

.. autofunction:: templates_directory

highlighter
    To be documented...

nbextensions
    Template for notebook extensions hiding code cells, output, or text cells.

printviewlatex
    Template for the printview extension converting the current notebook to
    LaTeX or PDF.

toc3
    To be done.
