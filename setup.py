# Install notebook extensions

from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir
from traitlets.config.loader import Config, JSONFileConfigLoader
import os
import sys
import json
import shutil
import psutil
import IPython
import notebook

marker = '#--- nbextensions configuration ---'


if IPython.__version__[0] < '4':
    print("IPython version 4.x is required")
    exit()

if notebook.__version__[0] < '4':
    print("notebook version 4.x is required")

for p in psutil.process_iter():
    if "jupyter-notebook" in p.name():
        print("Cannot install while the Jupyter notebook server is running")
        exit()

if len(sys.argv) == 2 and sys.argv[1] == "install":
    print("Installing Jupyter notebook extensions")
else:
    print("To install the notebook extensions use 'python setup.py install'")
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


def remove_old_config(config):
    """ Remove old configuration entries 
    
    :param config: python configuration data
    """
    marker_found = []
    lines = config.splitlines()
    for i, l in enumerate(lines):
        if l.find(marker) >= 0:
            marker_found.append(i)
    start = marker_found[0]
    end = marker_found[-1]
    return '\n'.join(lines[0:start] + lines[end+1:])


def update_config(config_file, newconfig_file):
    """ Update .py configuration file with new path to extensions 
    
    :param config_file: name of the existing python config file
    :param newconfig_file: name of the config file to be written into the existing python config file
    """
    if os.path.isfile(config_file) is True:
        f = open(config_file, 'r')
        config = f.read()
        f.close()
    else:
        config = ''
    
    # add config
    f = open(newconfig_file, 'r')
    new_config = f.read()
    f.close()
    
    if config.find(marker) >= 0:
        config = remove_old_config(config)

    config = marker + '\n' + new_config + '\n' + marker + '\n' + config    
    
    # write config file
    f = open(config_file, 'w')
    f.write(config)
    f.close()        


#
# 1. Get the local configuration file path
#
config_dir = jupyter_config_dir()
data_dir = jupyter_data_dir()

print("Configuration files directory: %s" % config_dir)
print("Extensions and templates path: %s" % data_dir)

# now test if path exists
if os.path.exists(config_dir) is False:
    os.mkdir(config_dir)
if os.path.exists(data_dir) is False:
    os.mkdir(data_dir)

#
# 2. Install files
#   Indiscriminately copy all files from the nbextensions, extensions and template directories
#   Currently there is no other way, because there is no definition of a notebook extension package
#
        
# copy extensions to IPython extensions directory
src = 'extensions'
destination = os.path.join(data_dir, 'extensions')
print("Install Python extensions to %s" % destination)
recursive_overwrite(src, destination)

# Install templates
src = 'templates'
destination = os.path.join(data_dir, 'templates')
print("Install templates to %s" % destination)
recursive_overwrite(src, destination)

# Install nbextensions
src = 'nbextensions'
destination = os.path.join(data_dir, 'nbextensions')
print("Install notebook extensions to %s" % destination)
recursive_overwrite(src, destination)


#
# 3. Update nbconvert configuration
#
json_config = os.path.join(jupyter_config_dir(), 'jupyter_nbconvert_config.json')
print("Configuring %s" % json_config)
if os.path.isfile(json_config) is True:
    cl = JSONFileConfigLoader(json_config)
    config = cl.load_config()
else:
    config = Config()
newconfig = Config()
# Set template path, pre- and postprocessors of notebook extensions
newconfig.Exporter.template_path = [os.path.join(data_dir, 'templates')]
newconfig.Exporter.preprocessors = ["pre_codefolding.CodeFoldingPreprocessor", "pre_pymarkdown.PyMarkdownPreprocessor"]
newconfig.NbConvertApp.postprocessor_class = 'post_embedhtml.EmbedPostProcessor'
config.merge(newconfig)
config.version = 1
s=json.dumps(config, indent=2, separators=(',', ': '), sort_keys=True)
with open(json_config, 'w') as f:
    f.write(s)

py_config = os.path.join(jupyter_config_dir(), 'jupyter_nbconvert_config.py')
print("Configuring %s" % py_config)

new_py_config = 'jupyter_nbconvert_config.py'
update_config(py_config, new_py_config)

#
# 4. Update notebook configuration
#
fname = os.path.join(config_dir, 'jupyter_notebook_config.json')
print("Configuring %s" % fname)
if os.path.isfile(json_config) is True:
    cl = JSONFileConfigLoader(json_config)
    config = cl.load_config()
else:
    config = Config()
newconfig = Config()
# Add server extension of /nbextension/ configuration tool
newconfig.NotebookApp.server_extensions = ["nbextensions"]
config.merge(newconfig)
config.version = 1
s = json.dumps(config, indent=2, separators=(',', ': '), sort_keys=True)
with open(fname, 'w') as f:
    f.write(s)

    py_config = os.path.join(jupyter_config_dir(), 'jupyter_notebook_config.py')
print("Configuring %s" % py_config)

new_py_config = 'jupyter_notebook_config.py'
update_config(py_config, new_py_config)
