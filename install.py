# Install notebook extensions

from jupyter_core.paths import jupyter_data_dir
import os
import sys
import shutil
import IPython
import notebook

debug = False

if IPython.__version__[0] < '4':
    print("IPython version 4.x is required")
    exit(1)

if notebook.__version__[0] < '4':
    print("notebook version 4.x is required")
    exit(1)

if len(sys.argv) == 2 and sys.argv[1] == "debug":
    debug = True

print("Installing Jupyter notebook extensions.")

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
# 1. Get the local configuration file path
#
data_dir = os.getenv('PREFIX', None)
if data_dir == None:
    data_dir = jupyter_data_dir()
else:
    data_dir = os.path.join(data_dir, 'share/jupyter')

print("Extensions and templates path: %s" % data_dir)

if os.path.exists(data_dir) is False:
    os.mkdir(data_dir)
    if debug is True: print("Creating directory %s" % data_dir)

#
# 2. Install files
#   Indiscriminately copy all files from the nbextensions, extensions and template directories
#   Currently there is no other way, because there is no definition of a notebook extension package
#
        
# copy extensions to IPython extensions directory
src = 'extensions'
destination = os.path.join(data_dir, 'extensions')
if debug is True: print("Install Python extensions to %s" % destination)
recursive_overwrite(src, destination)

# Install templates
src = 'templates'
destination = os.path.join(data_dir, 'templates')
if debug is True: print("Install templates to %s" % destination)
recursive_overwrite(src, destination)

# Install nbextensions
src = 'nbextensions'
destination = os.path.join(data_dir, 'nbextensions')
if debug is True: print("Install notebook extensions to %s" % destination)
recursive_overwrite(src, destination)



