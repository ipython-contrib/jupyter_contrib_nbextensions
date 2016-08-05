# use pandoc to convert md files to rst and copy images
import os
from shutil import copyfile
import pypandoc

extensions = """
List of Extensions
==================

.. toctree::
   :maxdepth: 1

"""

# generate file with link to all extensions containing md files
for root, directories, filenames in os.walk(r'..\..\src\jupyter_contrib_nbextensions\nbextensions'):
    for filename in filenames:
        ext = os.path.splitext(filename)
        if 'md' in ext[1]:
            md_filename = os.path.join(root, filename)
            #print('root: %s' % root)
            rst_path = os.path.split(root)[-1]
            if not os.path.exists(rst_path):
                os.mkdir(rst_path)
            rst_name = ext[0]+'.rst'
            rst_filename = os.path.join(rst_path, rst_name)
            output = pypandoc.convert_file(md_filename, format='md', to='rst', outputfile=rst_filename)
            extensions += '   %s/%s\n' % (rst_path, ext[0])
            # copy images
            for root2, directories2, filenames2 in os.walk(root):
                for name2 in filenames2:
                    ext2 = os.path.splitext(name2)
                    if ext2[1].strip('.').lower() in ['jpg', 'png', 'gif']:
                        src = os.path.join(root2, name2)
                        dst = os.path.join(rst_path, name2)
                        #print('src: %s' % src)
                        #print('dst: %s' % dst)
                        copyfile(src, dst)

# Generate list of extensions
f = open('extensions.rst', 'w')
f.write(extensions)
f.close()

