# We redirect stderr & stdout to conda's .messages.txt
# for why, see
#     http://conda.pydata.org/docs/building/build-scripts.html
# for how, see
#     http://stackoverflow.com/questions/876239/how-can-i-redirect-and-append-both-stdout-and-stderr-to-a-file-with-bash
"${PREFIX}/bin/jupyter" contrib nbextension uninstall --sys-prefix >> "${PREFIX}/.messages.txt" 2>&1
