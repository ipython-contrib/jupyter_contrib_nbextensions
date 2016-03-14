from __future__ import print_function
import os.path
import sys
from jupyter_core.paths import jupyter_data_dir
from notebook.services.config import ConfigManager
cm = ConfigManager()

try:
    from urllib.request import urlretrieve # Py3
    from urllib.parse import urljoin
except ImportError:
    from urllib import urlretrieve # Py2
    from urlparse import urljoin

remote_base_url = 'https://chromium.googlesource.com/chromium/deps/hunspell_dictionaries/+/master'
local_base_url = os.path.join(jupyter_data_dir(), 'nbextensions', 'usability', 'spellchecker', 'typo', 'dictionaries')

lang_code = 'de_DE'

for ext in ('dic', 'aff'):
    dict_fname = lang_code + '.' + ext
    remote_path = remote_base_url + '/' + dict_fname
    local_path = os.path.join(local_base_url, dict_fname)

    print('saving {!r}\n    to {!r}'.format(remote_path, local_path))
    urlretrieve(remote_path, local_path)
    rel_path = './typo/dictionaries/' + dict_fname
    cm.update('notebook', {'spellchecker': {ext + '_url': rel_path}})

cm.update('notebook', {'spellchecker': {'lang_code': lang_code}});
