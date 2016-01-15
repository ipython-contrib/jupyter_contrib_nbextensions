# -*- coding: utf-8 -*-
# Install notebook extensions

from jupyter_core.paths import jupyter_config_dir, jupyter_data_dir
from traitlets.config.loader import Config, JSONFileConfigLoader
import os
import sys
import json
import psutil

marker = '#--- nbextensions configuration ---'
debug = False

def remove_old_config(configdata):
    """ Remove old configuration entries

    :param configdata: python configuration data
    """
    marker_found = []
    lines = configdata.splitlines()
    for i, l in enumerate(lines):
        if l.find(marker) >= 0:
            marker_found.append(i)
    start = marker_found[0]
    end = marker_found[-1]
    return '\n'.join(lines[0:start] + lines[end+1:])


def make_backup(filename):
    import shutil
    backup = filename + ".bak"
    if os.path.exists(filename):
        shutil.copy(filename,backup)


def update_config(config_file):
    """ Update .py configuration file with new path to extensions

    :param config_file: name of the config file to be updated
    """
    if debug is True:
        print("Configuring %s" % config_file)
    make_backup(config_file)

    new_config = "import os\nimport sys\nsys.path.append(os.path.join(r'{0:s}', 'extensions'))\nc = get_config()\nc.Exporter.template_path = [ '.', os.path.join(r'{0:s}', 'templates') ]".format(data_dir)
    # add config
    with open(config_file, 'a+') as f:
        f.seek(0)
        pyconfig = f.read()

    if pyconfig.find(marker) >= 0:
        pyconfig = remove_old_config(pyconfig)

    pyconfig = marker + '\n' + new_config + '\n' + marker + '\n' + pyconfig
    # write config file
    with open(config_file, 'w') as f:
        f.write(pyconfig)



for p in psutil.process_iter():
    if ("python" or "jupyter") in p.name():
        c = p.cmdline()
        if len(c) == 2 and "jupyter-notebook" in c[1]:
            print("Cannot configure while the Jupyter notebook server is running")
            exit(1)

if len(sys.argv) == 2 and sys.argv[1] == "debug":
    debug = True

print("Configuring the Jupyter notebook extensions.")

# Get the local configuration file path
# Use $PREFIX for Anaconda
data_dir = os.getenv('PREFIX', None)
if data_dir is None:
    data_dir = jupyter_data_dir()
else:
    data_dir = os.path.join(data_dir, 'share/jupyter')

if debug is True:
    print("Extensions and templates path: %s" % data_dir)

config_dir = jupyter_config_dir()
print("Configuration files directory: %s" % config_dir)
if os.path.exists(config_dir) is False:
    os.mkdir(config_dir)
    if debug is True:
        print("Creating directory %s" % config_dir)



def load_json_config(json_filename):
    """ Load config as JSON file
    :param json_filename: Filename of JSON file
    :return: Traitlets based configuration
    """
    json_config = os.path.join(jupyter_config_dir(), json_filename)
    if debug is True: print("Configuring %s" % json_config)
    if os.path.isfile(json_config) is True:
        cl = JSONFileConfigLoader(json_config)
        config = cl.load_config()
    else:
        config = Config()
    return config


def save_json_config(json_file, newconfig):
    """ Save config as JSON file
    :param json_file: Filename of JSON file
    :param newconfig: New traitlets based configuration
    """
    s = json.dumps(newconfig, indent=2, separators=(',', ': '), sort_keys=True)
    json_config = os.path.join(jupyter_config_dir(), json_file)
    make_backup(json_config)
    with open(json_config, 'w') as f:
        f.write(s)

# Update nbconvert JSON configuration
json_file = 'jupyter_nbconvert_config.json'
config = load_json_config(json_file)

# Set template path, pre- and postprocessors of notebook extensions
newconfig = Config()
newconfig.Exporter.template_path = ['.', os.path.join(data_dir, 'templates')]
newconfig.Exporter.preprocessors = ["pre_codefolding.CodeFoldingPreprocessor", "pre_pymarkdown.PyMarkdownPreprocessor"]
newconfig.NbConvertApp.postprocessor_class = 'post_embedhtml.EmbedPostProcessor'
config.merge(newconfig)
config.version = 1
save_json_config(json_file, config)

# Update nbconvert PY configuration
py_config = os.path.join(jupyter_config_dir(), 'jupyter_nbconvert_config.py')
update_config(py_config)

# Update notebook JSON configuration
json_file = 'jupyter_notebook_config.json'
config = load_json_config(json_file)

# Add server extension of /nbextension/ configuration tool and template path
newconfig = Config()
newconfig.NotebookApp.server_extensions = ["nbextensions"]
newconfig.NotebookApp.extra_template_paths = [os.path.join(jupyter_data_dir(),'templates') ]
config.merge(newconfig)
config.version = 1
save_json_config(json_file, config)

# Update notebook PY configuration
py_config = os.path.join(jupyter_config_dir(), 'jupyter_notebook_config.py')
update_config(py_config)
