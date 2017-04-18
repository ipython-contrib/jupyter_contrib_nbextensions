# Install notebook extensions

from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir, jupyter_runtime_dir
from traitlets.config.loader import Config, JSONFileConfigLoader
import IPython.extensions
import os
import sys
import logging
import json

# http://stackoverflow.com/questions/12683834/how-to-copy-directory-recursively-in-python-and-overwrite-all
def recursive_overwrite(src, dest, ignore=None):
    if os.path.isdir(src):
        if not os.path.isdir(dest):
            os.makedirs(dest)
        files = os.listdir(src)
        if ignore is not None:
            ignored = ignore(src, files)
        else:
            ignored = set()
        for f in files:
            if f not in ignored:
                recursive_overwrite(os.path.join(src, f), 
                                    os.path.join(dest, f), 
                                    ignore)
    else:
        shutil.copyfile(src, dest)

#
# Install files
#
        
# copy extensions to IPython extensions directory
extensions = os.path.dirname(IPython.extensions.__file__)
src = os.path.join('src','extensions')
print("Install extensions to %s" % extensions)
recursive_overwrite(src, extensions)

# Install templates
templates = os.path.join(jupyter_data_dir(), 'templates') 
src = os.path.join('src','templates')
print("Install templates to %s" % templates)
recursive_overwrite(src, templates)

# Install nbextensions
nbextensions = os.path.join(jupyter_data_dir(), 'nbextensions') 
src = os.path.join('src','nbextensions')
print("Install notebook extensions to %s" % nbextensions)
recursive_overwrite(src, nbextensions)

#
# Update nbconvert configuration
#
fname = os.path.join(jupyter_config_dir(), 'jupyter_nbconvert_config.json')
cl = JSONFileConfigLoader(fname)
config = cl.load_config()
newconfig=Config()
# Set template path, pre- and postprocessors of notebook extensions
newconfig.Exporter.template_path = [os.path.join(jupyter_data_dir(),'templates') ]
newconfig.Exporter.preprocessors = ["codefolding.CodeFoldingPreprocessor", "pymdpreprocessor.PyMarkdownPreprocessor" ] 
newconfig.NbConvertApp.postprocessor_class = 'embed.EmbedPostProcessor'
config.merge(newconfig)
config.version = 1
s=json.dumps(config, indent=2, separators=(',', ': '), sort_keys=True)
with open(fname, 'w') as f:
    f.write(s)

#
# Update notebook configuration
#
fname = os.path.join(jupyter_config_dir(), 'jupyter_notebook_config.json')
cl = JSONFileConfigLoader(fname, log=log)
config = cl.load_config()
newconfig=Config()
# Add server extension of /nbextension/ configuration tool
newconfig.NotebookApp.server_extensions = [ "nbextensions" ]
config.merge(newconfig)
config.version = 1
s=json.dumps(config, indent=2, separators=(',', ': '), sort_keys=True)
with open(fname, 'w') as f:
    f.write(s)
