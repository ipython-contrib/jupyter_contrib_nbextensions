#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Setup script for themysto."""

# -----------------------------------------------------------------------------
# Imports
# -----------------------------------------------------------------------------

from __future__ import print_function

import os
import shutil
import sys
from distutils import log
from glob import glob

from setuptools import find_packages, setup
from setuptools.command.install import install


# -----------------------------------------------------------------------------
# Custom setuptools command definitions
# -----------------------------------------------------------------------------


def recursive_overwrite(src, dst):
    """
    Indiscriminately copy all files from the source directories to the
    destinations.
    Adapted from
    http://stackoverflow.com/questions/12683834
    """

    if os.path.isdir(src):
        if not os.path.isdir(dst):
            os.makedirs(dst)
        files = os.listdir(src)
        for f in files:
            recursive_overwrite(os.path.join(src, f), os.path.join(dst, f))
    else:
        log.info('cp {!r} {!r}'.format(src, dst))
        shutil.copyfile(src, dst)


class InstallCmd(install):
    """
    Copy extensions, nbextensions and templates to jupyter_data_dir

    We indiscriminately copy all files from the source directories to the
    destinations.
    Currently there is no other way, because there is no definition of a
    notebook extension package, although they will end up as npm packages
    eventually
    """

    description = ('Install extensions, nbextensions and templates' +
                   ' to jupyter_data_dir')

    def run(self):
        # need to call parent class run in order to get directories and things
        # created for stuff like bdist command, which calls install
        install.run(self)

        # check python version
        PY3 = (sys.version_info[0] >= 3)
        if not PY3:
            log.warn('WARNING: Python 3 ' +
                     'might be required for some server-side extensions.')

        # Get the data directory, which will be in jupyter_path
        from jupyter_core.paths import jupyter_data_dir
        data_dir = jupyter_data_dir()
        # do the actual copying
        copylist = [(name, os.path.join(data_dir, name))
                    for name in ('extensions', 'nbextensions', 'templates')]
        for src, dst in copylist:
            log.debug('    Installing {!s} to {!r}'.format(src, dst))
            recursive_overwrite(src, dst)

        import configure_nbextensions
        configure_nbextensions.main()

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
        version='0.0.0',
        author='IPython-contrib Developers',
        author_email='joshuacookebarnes@gmail.com',
        url='https://github.com/jcb91/IPython-notebook-extensions.git',
        download_url=('https://github.com/jcb91/IPython-notebook-extensions/'
                      'tarball/0.0.0'),
        keywords=['IPython', 'Jupyter', 'notebook'],
        license='BSD',
        platform=['Any'],
        packages=find_packages('src'),
        package_dir={'': 'src'},
        py_modules=[
            os.path.splitext(os.path.basename(path))[0]
            for path in glob('src/*.py')
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
        cmdclass={
            'install': InstallCmd,
        },
        extras_require={
            'test': [
                'nbformat',
                'nose',
                'pip',
                'requests',
            ],
            'test:python_version == "2.7"': [
                'mock',
            ],
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
