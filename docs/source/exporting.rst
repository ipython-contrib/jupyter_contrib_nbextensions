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

post_embedhtml
    Embed graphics (pdf, svg and images) in the HTML file.
    `nbconvert --to html --option='embed' mynotebook.ipynb`

Generic documentation for postprocessors can be found here: http://nbconvert.readthedocs.io/en/latest/api/postprocessors.html

Exporters
---------
Generic documentation for exporters can be found here:: http://nbconvert.readthedocs.io/en/latest/api/exporters.html

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



