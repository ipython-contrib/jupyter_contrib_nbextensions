# -*- coding: utf-8 -*-
# Install notebook extensions

from __future__ import print_function
from jupyter_core.paths import jupyter_data_dir
import errno
import os
import sys
import shutil
import tempfile
import notebook

debug = False

bom_pref = 'ipython-contrib-IPython-notebook-extensions-'
bom_path = os.path.join(jupyter_data_dir(), bom_pref + 'installed_files.txt')

if notebook.__version__[0] < '4':
    print("notebook version 4.x is required")
    exit(1)

if (len(sys.argv) == 2 and sys.argv[1] == "debug") or '--debug' in sys.argv:
    debug = True


# http://stackoverflow.com/questions/12683834/how-to-copy-directory-recursively-in-python-and-overwrite-all
def recursive_overwrite(src, dest, ignore=None):
    destinations = []
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
                destinations.extend(
                    recursive_overwrite(
                        os.path.join(src, f), os.path.join(dest, f), ignore)
                )
    else:
        shutil.copyfile(src, dest)
        destinations.append(dest)
        if debug:
            print('    ' + dest)
    return destinations


def uninstall_files():
    """
    Remove any files recorded as being installed by a previous installation"""

    if os.path.exists(bom_path):
        # rather than actually deleting, copy everything to a temporary
        # directory without explicit cleanup
        deleted_to = tempfile.mkdtemp(prefix=bom_pref)
        print('Removing previously-installed files to {}'.format(deleted_to))
        with open(bom_path, 'r') as bom_file:
            for src in bom_file.readlines():
                src = src.rstrip('\n').rstrip('\r')
                if os.path.exists(src):
                    if debug:
                        print('    ' + src)
                    dest = os.path.join(
                        deleted_to, os.path.relpath(src, data_dir))
                    dest_dir = os.path.dirname(dest)
                    if not os.path.exists(dest_dir):
                        os.makedirs(dest_dir)
                    shutil.move(src, dest)
                # remove empty directories
                while len(src) > len(data_dir):
                    src = os.path.dirname(src)
                    try:
                        os.rmdir(src)
                    except OSError as ex:
                        if ex.errno not in (errno.ENOTDIR, errno.ENOTEMPTY, errno.ENOENT):
                            raise
                        break
                    else:
                        if debug:
                            print('    ' + src)
        os.remove(bom_path)

#
# 1. Get the data directory, which will be in jupyter_path
#
data_dir = jupyter_data_dir()

print("Extensions and templates path: %s" % data_dir)

if os.path.exists(data_dir) is False:
    os.mkdir(data_dir)
    if debug is True: print("Creating directory %s" % data_dir)


#
# 2. Install files
#   Indiscriminately copy all files from the nbextensions, extensions and template directories
#   Currently there is no other way, because there is no definition of a notebook extension package
#
def install_files():
    """Install repo files into jupyter data dir"""

    print("Installing Jupyter notebook extensions.")
    installed_files = []
    # copy everything to jupyter data directory
    for name, src in [('python extensions', 'extensions'),
                      ('templates', 'templates'),
                      ('notebook extensions', 'nbextensions')]:
        destination = os.path.join(data_dir, src)
        if debug:
            print("Install %s to %s" % (name, destination))
        installed_files.extend(
            recursive_overwrite(
                os.path.join(os.path.dirname(__file__), src), destination))

    # write a bom - everything we installed
    with open(bom_path, 'w') as bom_file:
        bom_file.write('\n'.join(installed_files))
    if debug:
        print('Installed files are listed in {}'.format(bom_path))


def main():
    uninstall_files()
    install_files()

if __name__ == '__main__':
    main()
