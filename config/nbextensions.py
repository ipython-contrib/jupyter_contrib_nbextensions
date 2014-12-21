# Notebook Server Extension
#
from IPython.utils.path import get_ipython_dir
from IPython.html.utils import url_path_join as ujoin
from tornado import web
from IPython.utils.py3compat import PY3
from IPython.html.base.handlers import IPythonHandler, json_errors
import os
import yaml
import json

class NBExtensionHandler(IPythonHandler):
    """Render the text editor interface."""
    @web.authenticated
    def get(self):
        ipythondir = get_ipython_dir()
        
        nbextensions = os.path.join(ipythondir,'nbextensions') 
        exclude = [ 'mathjax' ]        
        yaml_list = []
        # Traverse through nbextension subdirectories to find all yaml files
        for root, dirs, files in os.walk(nbextensions):
            dirs[:] = [d for d in dirs if d not in exclude]
            for f in files:
                if f.endswith('.yaml'):
                    yaml_list.append([ root, f] )
                    
        extension_list = []
        for y in yaml_list:
            stream = open(os.path.join(y[0],y[1]), 'r')
            extension = yaml.load(stream)            
            if 'Description' in extension:
                b=y[0].find('nbextensions')
                url = y[0][b::].replace('\\', '/')
                extension['url'] = url
                print( extension['Description'])
                extension_list.append(extension)
            stream.close()
        json_list = json.dumps(extension_list)
        self.write(self.render_template('nbextensions.html',
            base_url = "",
            extension_list = json_list,
            page_title="Notebook Extension Configuration"
            )
        )
		
def load_jupyter_server_extension(nbapp):
    webapp = nbapp.web_app
    base_url = webapp.settings['base_url']
    webapp.add_handlers(".*$", [
        (ujoin(base_url, r"/nbextensions/"), NBExtensionHandler)
    ])
