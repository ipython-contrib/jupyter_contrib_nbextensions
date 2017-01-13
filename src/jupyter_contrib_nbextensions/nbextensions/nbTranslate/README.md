# nbTranslate -- helps translating notebooks -- provides multilanguage support

This extension

- helps converting markdown cells in a notebook from a language to another (optionally using **Google translate**),
- enables to selectively display cells from a given language in a multilanguage notebook. 

Basically, the extension allows to copy the original cell into a new one for editing and translating. Optionally, the cell source text can be passed through `google translate` and the result inserted in the new cell. Basic markdown structures (e.g. bold, emphasis, lists) are preserved/restored after conversion, to the best extent, but this is not perfect, and usually one has to correct the text and structures afterward. Similarly, equations are extracted before conversion and restored in the result. It seems that when translating from lang1 to lang2, the best results are obtained by taking English as an intermediate language.

A metadata indicating the language used is added to each cell. This allows to selectively display cells for a particular language and hide the other ones. As far as they are concerned, code cells are preserved. This way, one can get a kind of multilanguage notebook. A menu is provided to select the languages to display in the notebook. 


![](demo1.gif)

![](demo2.gif)


## Compatibility

The extension has been written to play nicely with
- [latex_envs]: LaTeX environments are protected before conversion and restored after. For environments with a text content, e.g. theorem, remark, etc, the content is still translated. Some minor updates have been applied to `latex_envs` to ensure the best compatibilty; so update if necessary via 
```
pip install jupyter_latex_envs --upgrade [--user|sys-prefix]
jupyter nbextension install --py latex_envs --user
jupyter nbextension enable latex_envs --user --py
```
- [toc2]: cells of non displayed languages are hidden and unrendered so that the toc corresponds only to the selected languages; The toc is automatically updated each time a language is added/removed. 

## Configuration
- Parameters values can be changed using the `nbextensions-configurator`: it is possible to choose the initial source and target languages, to choose to use of google translate engine or not, to specify the initially displayed languages, the position of the language selection menu, and define a keyboard shortcut
- A *configuration toolbar* is provided which enables to change the main options per notebook. In the configuration toolbar, one can toogle the use of the google translate engine, select the source and target languges, and finally select the language to display. 

## Export 
It is possible to extract one language from the multilanguage notebook. An exporter with an entry-point `selectLanguage` is provided that `converts` the notebook into another one as follows
```
jupyter nbconvert --to selectLanguage --NotebookLangExporter.language=lang  FILE.ipynb 
```
where lang is a valid language abbreviation, e.g. en, fr, ar, sp, ... See the full list <a href='languages.js'> here.</a>


Installation
------------

If you use [jupyter-contrib-nbextensions](https://github.com/ipython-contrib/jupyter_contrib_nbextensions), proceed as usual. 

Otherwise, you can still install/try the extension from my personal repo, using
```
jupyter nbextension install https://rawgit.com/jfbercher/jupyter_nbTranslate/master/nbTranslate.zip --user
jupyter nbextension enable nbTranslate/main
```
[Note that for now, installing from this repo does not install the python module and add the entry points for exporting as described above]

To remove
```
jupyter nbextension uninstall nbTranslate/main
```
