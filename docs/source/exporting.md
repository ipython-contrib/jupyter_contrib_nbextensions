.. module:: jupyter_contrib_nbextensions.nbconvert_support


Exporting
=========

Some extensions add functionality you might want to keep when exporting a notebook
to another format using :mod:`nbconvert`.

There are several parts to customize `nbconvert`output:
 * *Preprocessors* to change content before conversion to another format
 * *Postprocessors* to change content after conversion to another format
 * *Exporters* to actually do the conversion to another format
 * *Templates* provide customization using Jinja without writing an exporter


Preprocessors
-------------

 * CodeFoldingPreprocessor - preserve code folding at export:<br>
   The preprocessor is installed by default. To enable codefolding with NbConvert, 
   you need to set the configuration parameter `NbConvertApp.codefolding=True`.
   This can be done either in the `jupyter_nbconvert_config.py` file:
   
        c.NbConvertApp.codefolding=True
        
    or using a command line parameter when calling NbConvert:
  
        jupyter nbconvert --to html --NbConvertApp.codefolding=True mynotebook.ipynb

 * CollapsibleHeadingsPreprocessor

 * HighlighterPreprocessor

 * PyMarkdownPreprocessor

 * SVG2PDFPreprocessor<br>
  Convert external `SVG` graphics to `PDF` using Inkscape. This is useful for LaTeX export.
  This provides the functionality already provided by NbConvert for embedded images in cell output.


Postprocessors
--------------

 * HighlighterPostProcessor


Exporters
---------

 * EmbedHTMLExporter<br>
 Allows embedding images (pdf, svg and raster images) into a HTML file as base64 encoded binary, 
 instead of linking to them.
 
        jupyter nbconvert --to html_embed --NbConvertApp.codefolding=True mynotebook.ipynb

 * TocExporter

 * LenvsHTMLExporter

 * LenvsLatexExporter


Templates
---------

* highlighter
    To be documented...

* *nbextensions.tpl* and *nbextensions.tplx*<br>
    Templates for notebook extensions that allow hiding code cells, output, or text cells.
    Usage:
    
        jupyter nbconvert --template nbextensions mynotebook.ipynb 
        
    The supported cell metadata tags are:
     * `cell.metadata.hidden` - hide complete cell
     * `cell.metadata.hide_input` - hide code cell input
     * `cell.metadata.hide_output` - hide code cell output
   

* toc3
    To be done.
