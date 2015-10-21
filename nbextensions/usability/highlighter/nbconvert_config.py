from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir
import os
import sys

sys.path.append(os.path.join(jupyter_data_dir(), 'extensions'))

c = get_config()
c.Exporter.template_path = [ '.', os.path.join(jupyter_data_dir(), 'templates') ]