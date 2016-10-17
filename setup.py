#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Setup script for jupyter_contrib_nbextensions."""

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
        name='jupyter_contrib_nbextensions',
        description="A collection of Jupyter nbextensions.",
        long_description="""
Contains a collection of extensions that add functionality to the Jupyter
notebook. These extensions are mostly written in Javascript, and are loaded
locally in the browser.

The jupyter-contrib repository
https://github.com/ipython-contrib/jupyter_contrib_nbextensions
is maintained independently by a group of users and developers, and is not
officially related to the Jupyter development team.

The maturity of the provided extensions varies, please create an issue if you
encounter any problems.
""",
        version='0.2.1',
        author='ipython-contrib and jupyter-contrib developers',
        author_email='jupytercontrib@gmail.com',
        url=('https://github.com/'
             'ipython-contrib/jupyter_contrib_nbextensions.git'),
        download_url=('https://github.com/'
                      'ipython-contrib/jupyter_contrib_nbextensions'
                      'tarball/0.2.1'),
        keywords=['IPython', 'Jupyter', 'notebook'],
        license='BSD',
        platforms=['Any'],
        packages=find_packages('src'),
        package_dir={'': 'src'},
        include_package_data=True,
        py_modules=[
            os.path.splitext(os.path.basename(path))[0]
            for path in glob('src/*.py')
        ],
        install_requires=[
            'ipython_genutils',
            'jupyter_contrib_core >=0.3',
            'jupyter_core',
            'jupyter_nbextensions_configurator',
            'nbconvert',
            'notebook >=4.0',
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
            ],
            'test:python_version == "2.7"': [
                'mock',
            ],
        },
        # we can't be zip safe as we require templates etc to be accessible to
        # jupyter server
        zip_safe=False,
        entry_points={
            'console_scripts': [
                'jupyter-contrib-nbextension = jupyter_contrib_nbextensions.application:main',  # noqa
            ],
            'jupyter_contrib_core.app.subcommands': [
                'nbextension = jupyter_contrib_nbextensions.application:jupyter_contrib_core_app_subcommands',  # noqa
            ],
            'nbconvert.exporters': [
                'html_lenvs = jupyter_contrib_nbextensions.nbconvert_support.latex_envs:LenvsHTMLExporter',  # noqa
                'latex_lenvs = jupyter_contrib_nbextensions.nbconvert_support.latex_envs:LenvsLatexExporter',  # noqa
                'html_toc = jupyter_contrib_nbextensions.nbconvert_support.toc2:TocExporter',  # noqa
                'html_embed = jupyter_contrib_nbextensions.nbconvert_support.embedhtml:EmbedHTMLExporter',  # noqa
                 ],
        },
        scripts=[os.path.join('scripts', p) for p in [
            'jupyter-contrib-nbextension',
        ]],
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
