
from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir
import os
import sys
import glob
import shutil


data_dir = jupyter_data_dir()
dest_templates = os.path.join(data_dir, 'templates')
src_templates = os.path.join(data_dir, 'nbextensions', 'templates')
dest_extensions = os.path.join(data_dir, 'extensions')
src_extensions = os.path.join(data_dir, 'nbextensions','extensions')

# make sure destinations exist
if os.path.exists(dest_templates) is False:
    os.mkdir(dest_templates)
if os.path.exists(dest_extensions) is False:
    os.mkdir(dest_extensions)

# Finally copy templates and pre/postprocessor
for filename in glob.glob(os.path.join(src_templates,'*')):
    shutil.copy2(filename,dest_templates)
for filename in glob.glob(os.path.join(src_extensions,'*')):
    shutil.copy2(filename,dest_extensions)

