# Generating the documentation

## html
Simply type
```
jupyter nbconvert --to html_lenvs latex_env_doc.ipynb 
```

## latex
For LaTeX, convert and then compile. Here we ask the converter to remove headers. This is useful for including a series of files into a master one. We provide a generic header `header.tex` which is included in documentation.tex. Look at it. 

```
jupyter nbconvert --to latex_lenvs --LenvsLatexExporter.removeHeaders=True latex_env_doc.ipynb 
xelatex documentation.tex
```
