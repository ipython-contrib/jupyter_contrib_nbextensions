:: We redirect stderr & stdout to conda's .messages.txt
:: for why, see
::     http://conda.pydata.org/docs/building/build-scripts.html
:: for how, see
::     https://technet.microsoft.com/en-gb/library/bb490982.aspx
 "%PREFIX%\Scripts\jupyter.exe" contrib nbextension install --sys-prefix >> "%PREFIX%/.messages.txt" 2>&1
if errorlevel 1 exit 1
