@echo off
:: We redirect stderr & stdout to conda's .messages.txt; for details, see
::     http://conda.pydata.org/docs/building/build-scripts.html
(
  "%PREFIX%\Scripts\jupyter-contrib-nbextension.exe" install --only-config --sys-prefix
) >>"%PREFIX%\.messages.txt" 2>&1
