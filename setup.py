#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Setup script for themysto"""

# -----------------------------------------------------------------------------
# Imports
# -----------------------------------------------------------------------------

from __future__ import print_function

import os
from glob import glob

from setuptools import find_packages, setup


# -----------------------------------------------------------------------------
# main setup call
# -----------------------------------------------------------------------------


def main():

    setup(
        name='themysto',
        description="jcb91's fork of IPython-contrib-nbextensions",
        long_description="""
Contains a collection of extensions that add functionality to the Jupyter
notebook.
These extensions are mostly written in Javascript, and are loaded locally in
the browser.

The IPython-contrib repository
https://github.com/ipython-contrib/IPython-notebook-extensions
is maintained independently by a group of users and developers and is not
officially related to the IPython development team.

The maturity of the provided extensions may vary, please create an issue if you
encounter any problems.
    """,
        version='0.0.1',
        author='IPython-contrib Developers',
        author_email='joshuacookebarnes@gmail.com',
        url='git+https://github.com/jcb91/IPython-notebook-extensions.git',
        keywords=['IPython', 'Jupyter', 'notebook'],
        license='BSD',
        packages=find_packages('src'),
        package_dir={'': 'src'},
        py_modules=[
            os.path.splitext(os.path.basename(path))[0]
            for path in glob('src/*.py')
        ],
        install_requires=[
            'jupyter_core',
            'nbconvert',
            'notebook >=4.0, <5.0',
            'psutil >=2.2.1',
            'pyyaml',
            'tornado',
            'traitlets',
        ],
        extras_require={
            'test:python_version == "2.7"': ['mock'],
            'test': ['nose', 'requests'],
        },
        zip_safe=True,
        classifiers=[
            'Development Status :: 1 - Planning',
            'Intended Audience :: End Users/Desktop',
            'Intended Audience :: Science/Research',
            'License :: OSI Approved :: BSD License',
            'Natural Language :: English',
            'Operating System :: OS Independent',
            'Programming Language :: JavaScript',
            'Programming Language :: Python',
            'Topic :: Utilities',
        ],
    )

if __name__ == '__main__':
    main()
