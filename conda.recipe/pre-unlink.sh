#!/bin/bash
# We redirect stderr & stdout to conda's .messages.txt; for details, see
# http://conda.pydata.org/docs/building/build-scripts.html
{
  "${PREFIX}/bin/jupyter-contrib-nbextension" uninstall --sys-prefix
} >>"${PREFIX}/.messages.txt" 2>&1
