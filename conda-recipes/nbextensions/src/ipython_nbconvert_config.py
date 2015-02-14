#--- nbextensions configuration ---

from IPython.utils.path import get_ipython_dir
import os
import sys

ipythondir = get_ipython_dir()
extensions = os.path.join(ipythondir,'extensions') 
sys.path.append( extensions )

c = get_config()
c.Exporter.template_path = [os.path.join(ipythondir,'templates') ]
c.Exporter.template_file = 'hide_input_output.tpl'

c.Exporter.preprocessors = ['codefolding.CodeFoldingPreprocessor', 'pymdpreprocessor.PyMarkdownPreprocessor' ]
c.Exporter.postprocessors = ['embed.EmbedPostProcessor']

#--- nbextensions configuration ---