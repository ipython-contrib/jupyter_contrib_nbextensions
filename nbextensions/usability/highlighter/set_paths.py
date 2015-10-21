# Install notebook extensions

from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir
from traitlets.config.loader import Config, JSONFileConfigLoader
import os
import sys
import json
import shutil
import IPython
import notebook

marker = '#--- nbextensions configuration ---'


if IPython.__version__[0] < '4':
    print("IPython version 4.x is required")
    exit()

if notebook.__version__[0] < '4':
    print("notebook version 4.x is required")


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
newconfig.Exporter.template_path = ['.', os.path.join(data_dir, 'templates')]

config.merge(newconfig)
config.version = 1
s=json.dumps(config, indent=2, separators=(',', ': '), sort_keys=True)
with open(json_config, 'w') as f:
    f.write(s)

py_config = os.path.join(jupyter_config_dir(), 'jupyter_nbconvert_config.py')
print("Configuring %s" % py_config)

new_py_config = 'nbconvert_config.py'#'jupyter_nbconvert_config.py'
update_config(py_config, new_py_config)
