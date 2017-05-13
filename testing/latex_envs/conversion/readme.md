
This directory contains utilitary functions used to convert the notebook, with embedded LaTeX structures, to LaTeX or html. 
Procedures are detailed in the documentation latex_env_doc.* and documentation.pdf. 

Files
-----
File 			| description
----------------------- | -----------------------------
documentation.pdf	|	Documentation (pdf version)  -- look at html and notebook version latex_env_doc.*
documentation.tex	|	Master file for producing documentation (includes latex_env_doc.tex)
header.tex		|	Header used for LaTeX compilation
ipynb_thms_to_html	|	Converter from ipynb to html
ipynb_thms_to_latex	|	Converter from ipynb to LaTeX
latex_env_doc.ipynb	|	Documentation and demo notebook
latex_env_doc.tex	|	Documentation and demo converted to LaTeX
latex_env_doc_tmp_files	|	temporary files from conversion
post_html_thms.js	|	Utilitary script used during ipynb --> html conversion
readme.md		|	This file
texheaders_rm.py	|	Utilitary script used during ipynb --> LaTeX conversion (removes header/footer)
thmInNb_tolatex.py	|	Utilitary script used during ipynb --> LaTeX conversion 
thmsInNb_article.tplx	|	Template for LaTeX conversion (article style)
thmsInNb_book.tplx	|	Template for LaTeX conversion (book style)
thmsInNb.tpl		|	Template for html conversion 

