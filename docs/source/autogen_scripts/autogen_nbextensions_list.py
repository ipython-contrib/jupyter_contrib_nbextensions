#!/usr/bin/env python
"""
Create nbextensions.rst, a Sphinx documentation source file.

Links to documentation for each of the nbextensions provided by the
jupyter_contrib_nbextensions package.
"""

import logging
import os

from jupyter_contrib_core.testing_utils import get_logger
from jupyter_nbextensions_configurator import get_configurable_nbextensions

import jupyter_contrib_nbextensions.install

log = get_logger(name=os.path.basename(__file__), log_level=logging.INFO)

# Set on_rtd to whether we are building on readthedocs. We get this test from
# docs.readthedocs.io
on_rtd = os.environ.get('READTHEDOCS', None) == 'True'
log.info('on_rtd = {}'.format(on_rtd))

doc_autogen_dir = os.path.dirname(__file__)
doc_srcdir = os.path.dirname(doc_autogen_dir)
nbext_dir = os.path.join(doc_srcdir, 'nbextensions')
destination = os.path.join(doc_srcdir, 'nbextensions.rst')

log.info('doc_autogen_dir = {}'.format(doc_autogen_dir))
log.info('doc_srcdir = {}'.format(doc_srcdir))
log.info('nbext_dir = {}'.format(nbext_dir))

log.info('-------- commencing nbextensions install')
log.info('---- installing nbextensions into {}'.format(nbext_dir))
do_symlink = hasattr(os, 'symlink') and os.name not in ('nt', 'dos')
log.info('---- {}using symlinks for install'.format(
    '' if do_symlink else 'not '))
jupyter_contrib_nbextensions.install.toggle_install_files(
    True, logger=log,
    nbextensions_dir=nbext_dir,
    overwrite=True,
    symlink=do_symlink,
)
log.info('-------- finished nbextensions install')

log.info('Writing Sphinx doc file {}'.format(destination))
log.info('looking for nbextensions in {}...'.format(nbext_dir))
nbextensions = sorted(
    get_configurable_nbextensions([nbext_dir], log=log),
    key=lambda a: a['Name'].lower())

header = """

.. This is an automatically generated file. Do not modify by hand.

List of provided nbextensions
=============================

.. the hidden toc is used to suppress warnings about readmes which are
.. not for individual nbextensions, but are linked to by nbextensions'
.. individual readmes

.. toctree::
    :hidden:

    nbextensions/code_prettify/README

.. toctree::
   :maxdepth: 1

"""

with open(destination, 'w') as f:
    f.write(header)
    f.writelines([
        '   {} <nbextensions/{}>\n'.format(
            nbext['Name'],
            os.path.splitext(nbext['readme'])[0]
        )
        for nbext in nbextensions if nbext.get('readme')
    ])
