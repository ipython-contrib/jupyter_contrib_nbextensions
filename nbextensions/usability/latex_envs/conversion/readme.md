This directory contains utilitary functions used to convert the notebook, with embedded LaTeX structures, to LaTeX or html. 
Procedures are detailed in the documentation latex_env_doc.* and documentation.pdf. 


Files
-----

File                  | description
----------------------|--------------------------------------------------------
header.tex            | Header used for LaTeX compilation
ipynb_thms_to_html    | Converter from ipynb to html
ipynb_thms_to_latex   | Converter from ipynb to LaTeX
post_html_thms.js     | Utilitary script used during ipynb --> html conversion
readme.md             | This file
texheaders_rm.py      | Utilitary script used during ipynb --> LaTeX conversion (removes header/footer)
thmInNb_tolatex.py    | Utilitary script used during ipynb --> LaTeX conversion 
thmsInNb_article.tplx | Template for LaTeX conversion (article style)
thmsInNb_book.tplx    | Template for LaTeX conversion (book style)
thmsInNb.tpl          | Template for html conversion 
