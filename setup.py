#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Setup script for themysto."""

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
jcb91's fork of IPython-contrib-nbextensions

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
        version='0.0.4',
        author='IPython-contrib Developers',
        author_email='joshuacookebarnes@gmail.com',
        url='https://github.com/jcb91/IPython-notebook-extensions.git',
        download_url=('https://github.com/jcb91/IPython-notebook-extensions/'
                      'tarball/0.0.4'),
        keywords=['IPython', 'Jupyter', 'notebook'],
        license='BSD',
        platform=['Any'],
        packages=find_packages('src'),
        package_dir={'': 'src'},
        include_package_data=True,
        py_modules=[
            os.path.splitext(os.path.basename(path))[0]
            for path in glob('src/*.py')
        ],
        setup_requires=[
            'setuptools_git >= 0.3',
        ],
        install_requires=[
            'ipython_genutils',
            'jupyter_core',
            'nbconvert',
            'notebook >=4.0, <5.0',
            'psutil >=2.2.1',
            'pyyaml',
            'tornado',
            'traitlets',
        ],
        extras_require={
            'test': [
                'nbformat',
                'nose',
                'pip',
                'requests',
                'selenium',
            ],
            'test:python_version == "2.7"': [
                'mock',
            ],
        },
        # we can't be zip safe as we require templates etc to be accessible to
        # jupyter server
        zip_safe=False,
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
        entry_points={
            'console_scripts': [
                'themysto = themysto.application:main',
            ],
        },
    )

if __name__ == '__main__':
    main()
