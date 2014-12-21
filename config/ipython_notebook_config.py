# Configuration file for ipython-notebook.
import sys
import os
ipythondir = sys.path[-1]
extensions = os.path.join(ipythondir,'extensions') 
sys.path.append( extensions )

c = get_config()

c.NotebookApp.open_browser = False
c.IPKernelApp.ip = '127.0.0.1'
c.FileNotebookManager.notebook_dir = 'i:\\notebook'

c.NotebookApp.server_extensions = [ 'nbextensions' ]
c.NotebookApp.extra_template_paths = [os.path.join(ipythondir,'templates') ]
