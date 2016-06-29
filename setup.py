#!/usr/bin/env python
# -*- coding: utf-8 -*-

#Usage:
#pip install https://github.com/ipython-contrib/IPython-notebook-extensions/archive/master.zip --user
#verbose mode can be enabled with -v switch eg pip -v install ...
#upgrade with a --upgrade.
#A system install can be done by omitting the --user switch.

#Testing: pip install https://github.com/jfbercher/IPython-notebook-extensions/archive/pip-install.zip --user


"""
*********************************************************************************************************
IPython-contrib-nbextensions - (C) 2013-2016, IPython-contrib Developers - All rights reserved.

contains a collection of extensions that add functionality to the Jupyter notebook. These extensions are
mostly written in Javascript and will be loaded locally in your Browser.

The IPython-contrib repository https://github.com/ipython-contrib/IPython-notebook-extensions
is maintained independently by a group of users and developers and not officially related to the
IPython development team.

The maturity of the provided extensions may vary, please create an issue if you encounter any problems.

Released under Modified BSD License, read COPYING file for more details.
*********************************************************************************************************
"""

from __future__ import print_function

#from distutils.core import setup
from setuptools import setup, find_packages
from os.path import join
from sys import exit, prefix, version_info, argv

#import os, fnmatch
#FILES = [os.path.join(dirpath, f)
#    for dirpath, dirnames, files in os.walk('.')
#    for f in fnmatch.filter(files, '*') if '.git' not in dirpath]



if 'bdist_wheel' in argv:
    raise RuntimeError("This setup.py does not support wheels")

#
if 'install' in argv: #-----------------------------------
    print("Running source install...")
    import install
    install.main()
    print('Done!')
    print("Configuring extensions...")
    import configure_nbextensions
    print('Done!')

#

# pip/setuptools install ------------------------------

classifiers = """\
Development Status :: 1 - Planning
Intended Audience :: End Users/Desktop
Intended Audience :: Science/Research
License :: OSI Approved :: BSD License
Natural Language :: English
Operating System :: OS Independent
Programming Language :: JavaScript
Programming Language :: Python :: 3
Topic :: Utilities
"""

print(__doc__)

# check python version
ver = (version_info.major, version_info.minor)
if ver < (3, 0):
    print('WARNING: Python 3.x or higher might be required for some extensions.')



setup(name='Python-contrib-nbextensions',
      version='alpha',
      description=__doc__.split("\n")[2],
      long_description='\n'.join(__doc__.split("\n")[2:]).strip(),
      author='IPython-contrib Developers',
      author_email='@gmail.com',
      url='https://github.com/ipython-contrib/IPython-notebook-extensions',
      platforms='POSIX',
      keywords=['IPython Jupyter notebook extension'],
      classifiers=[clsf for clsf in classifiers.split('\n') if clsf],
      license='BSD',
      install_requires=[
          'jupyter_core',
          'jupyter_nbextensions_configurator',
          'nbconvert',
          'notebook',
          'psutil >= 2.2.1',
          'pyyaml',
          'tornado',
          'traitlets',
      ],
      setup_requires=[
          'jupyter_nbextensions_configurator',
      ],
      #packages=['IPython-contrib-nbextensions'],
      # **addargs
)

