# Install notebook extensions
from __future__ import print_function
import os
import sys
import shutil

import IPython
if IPython.__version__[0] < '3':
    raise ImportError('IPython version 3 required')

from IPython.utils.path import get_ipython_dir

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

ipythondir = get_ipython_dir()

# Install extensions
extensions = os.path.join(ipythondir,'extensions') 
src = os.path.join('src','extensions')
print("Install extensions to %s" % extensions)
recursive_overwrite(src, extensions)

# Install templates
templates = os.path.join(ipythondir,'templates') 
src = os.path.join('src','templates')
print("Install templates to %s" % templates)
recursive_overwrite(src, templates)

# Install nbextensions
nbextensions = os.path.join(ipythondir,'nbextensions') 
src = os.path.join('src','nbextensions')
print("Install notebook extensions to %s" % nbextensions)
recursive_overwrite(src, nbextensions)

# Update configuration files
def remove_old_config(config):
    """ Remove old configuration entries """
    marker_found = []
    lines = config.splitlines()
    for i,l in enumerate(lines):
        if l.find(marker) >= 0:
            marker_found.append(i)
    start = marker_found[0]
    end = marker_found[-1]
    
    return '\n'.join(lines[0:start] + lines[end+1:-1])
    
def update_config(config_file, newconfig_file):
    """ Update configuration file with new configuration data """
    f = open( config_file, 'r')
    config = f.read()
    f.close()   
    
    # add config
    f = open( newconfig_file, 'r')
    new_config = f.read()
    f.close()

    marker='#--- nbextensions configuration ---'
    if config.find(marker) >=0:
        config = remove_old_config(config)

    config = new_config + '\n' + config    
    
    # write config file
    f = open( config_file, 'w')
    f.write(config)
    f.close()

profiledir = os.path.join(ipythondir,'profile_default') 
notebook  = os.path.join( profiledir, 'ipython_notebook_config.py')
nbconvert = os.path.join( profiledir, 'ipython_nbconvert_config.py')
notebook_newconfig  = os.path.join( 'src', 'ipython_notebook_config.py')
nbconvert_newconfig = os.path.join( 'src', 'ipython_nbconvert_config.py')

print("Update configuration file %s" % notebook)
update_config(notebook, notebook_newconfig)
print("Update configuration file %s" % nbconvert)
update_config(nbconvert, nbconvert_newconfig)
