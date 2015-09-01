# Install notebook extensions

from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir, jupyter_runtime_dir
from traitlets.config.loader import Config, JSONFileConfigLoader
import IPython.extensions
import os
import sys
import logging
import json

#
if len(sys.argv) == 2 and sys.argv[1] == "install":
    print("Installing Jupyter notebook extensions")

exit()

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
# Get the local cofiguration file path
#
from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir
config_dir = jupyter_config_dir()
data_dir = jupyter_data_dir()

print("Configuration files directory: %s" % config_dir)
print("Extensions and templates path: %s" % data_dir)

#
# Install files
#   Indiscriminately copy all files from the nbextensions, extensions and template directories
#   Currently there is no other way, because there is no definition of a notebook extension package
#
        
# copy extensions to IPython extensions directory
src = 'extensions'
destination = os.path.join(data_dir, 'extensions')
print("Install Python extensions to %s" % extensions)
recursive_overwrite(src, destination)

# Install templates
src = 'extensions'
destination = os.path.join(data_dir, 'templates')
templates = os.path.join(jupyter_data_dir(), 'templates')
print("Install templates to %s" % destination)
recursive_overwrite(src, destination)

# Install nbextensions
src = 'nbextensions'
destination = os.path.join(data_dir, 'nbextensions')
print("Install notebook extensions to %s" % destination)
recursive_overwrite(src, destination)

#
# Update nbconvert configuration
#
fname = os.path.join(jupyter_config_dir(), 'jupyter_nbconvert_config.json')
print("Configuring %s" % fname)
cl = JSONFileConfigLoader(fname)
config = cl.load_config()
newconfig=Config()
# Set template path, pre- and postprocessors of notebook extensions
newconfig.Exporter.template_path = [os.path.join(data_dir, 'templates') ]
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
fname = os.path.join(config_dir, 'jupyter_notebook_config.json')
print("Configuring %s" % fname)
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
