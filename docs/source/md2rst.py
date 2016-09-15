# Use pandoc to convert readme md files to rst and copy images to a place sphinx can process them.
# Afterwards, generate a rst file with links to all extensions
import sys
import os
from shutil import copyfile
import pypandoc

extensions = """
List of Extensions
==================

.. toctree::
   :maxdepth: 1

"""

destination = 'source'
if not os.path.exists(destination):
    destination = '.'
print('Copying converted docs to %s directory' % destination)
src_path = os.path.join(destination, '..', '..', 'src', 'jupyter_contrib_nbextensions', 'nbextensions')
for root, directories, filenames in os.walk(src_path):
    for filename in filenames:
        ext = os.path.splitext(filename)
        if 'md' in ext[1]:
            md_filename = os.path.join(root, filename)
            rst_path = os.path.join(os.path.split(root)[-1])
            src_path = os.path.join(destination, rst_path)
            if not os.path.exists(src_path):
                os.mkdir(src_path)
            rst_name = ext[0]+'.rst'
            rst_filename = os.path.join(src_path, rst_name)
            output = pypandoc.convert_file(md_filename, format='md', to='rst', outputfile=rst_filename)
            extensions += '   %s/%s\n' % (rst_path, ext[0])
            # copy images
            for root2, directories2, filenames2 in os.walk(root):
                for name2 in filenames2:
                    ext2 = os.path.splitext(name2)
                    if ext2[1].strip('.').lower() in ['jpg', 'png', 'gif']:
                        src = os.path.join(root2, name2)
                        dst = os.path.join(src_path, name2)
                        print('Destination: %s' % dst)
                        copyfile(src, dst)

# Write list of extensions
extname = os.path.join(destination, 'nbextensions.rst')
f = open(extname, 'w')
f.write(extensions)
f.write('\n')
f.close()

