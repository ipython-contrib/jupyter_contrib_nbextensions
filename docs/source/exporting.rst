Exporting
=========

Some extensions require additional effort when exporting them to other formats using `nbconvert`.
Please read the documentation here: http://nbconvert.readthedocs.io/en/latest/index.html

Preprocessors
-------------

pre_svg2pdf
    Supports converting notebooks to PDF. Because LaTeX can't use SVG graphics, they are converted to PDF
    using `inkscape`. This preprocessor is for markdown graphics only. For cell output, there is already a preprocessor
    in `nbconvert`.

pre_codefolding
    Folds codecells as displayed in the notebook.

pre_collapsible_headings
    For collapsible_headings extensions. Hides collapsed parts of the notebook.

pre_pymarkdown
    Inserts the varaible values for the Python markdown extension.

Generic documentation for preprocessors can be found here: http://nbconvert.readthedocs.io/en/latest/api/preprocessors.html

Postprocessors
--------------
Generic documentation for postprocessors can be found here: http://nbconvert.readthedocs.io/en/latest/api/postprocessors.html

Exporters
---------
Generic documentation for exporters can be found here:: http://nbconvert.readthedocs.io/en/latest/api/exporters.html

embedhtml
    Convert to HTML and embed graphics (pdf, svg and raster images) in the HTML file.
    `nbconvert --to html_embed mynotebook.ipynb`

html_toc2
    Export table of contents extension functionality to html. The idea is to link a relevant part of the javascript
    extension and the css, and add a small script in the html file.
    jupyter nbconvert --to html_toc FILE.ipynb

html_lenvs
    To export the notebooks to plain and html while keeping all the features of the latex_envs notebook extension in the converted version.
    We provide specialized exporters, pre and post processors, templates. We also added entry-points to simplify the conversion process.
    HTML conversion is as simple as
    'jupyter nbconvert --to html_lenvs FILE.ipynb'


latex_lenvs
    To export the notebooks to plain and html while keeping all the features of the latex_envs notebook extension in the converted version.
    We provide specialized exporters, pre and post processors, templates. We also added entry-points to simplify the conversion process.
    The LaTeX converter also expose several conversion options (read the docs). LaTeX conversion is as simple as
    'jupyter nbconvert --to latex_lenvs FILE.ipynb'


Templates
---------

highlighter
    To be done.

nbextensions
    Template for notebook extensions hiding code cells, output, or text cells.

printviewlatex
    Template for the printview extension converting the current notebook to LaTeX or PDF.

toc3
    To be done.

Generic documentation on templates can be found here: http://nbconvert.readthedocs.io/en/latest/customizing.html



