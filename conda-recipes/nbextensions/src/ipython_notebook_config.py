#--- nbextensions configuration ---

from IPython.utils.path import get_ipython_dir
import os
import sys

ipythondir = get_ipython_dir()
extensions = os.path.join(ipythondir,'extensions') 
sys.path.append( extensions )

c = get_config()
c.NotebookApp.server_extensions = [ 'nbextensions' ]
c.NotebookApp.extra_template_paths = [os.path.join(ipythondir,'templates') ]

#--- nbextensions configuration ---
