# We redirect stderr & stdout to conda's .messages.txt
# for why, see
#     http://conda.pydata.org/docs/building/build-scripts.html
# for how, see
#     http://stackoverflow.com/questions/876239
"${PREFIX}/bin/jupyter" contrib nbextension enable --sys-prefix >> "${PREFIX}/.messages.txt" 2>&1
