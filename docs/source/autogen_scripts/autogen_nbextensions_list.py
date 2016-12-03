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
jupyter_contrib_nbextensions.install.toggle_install_files(
    True, logger=log,
    nbextensions_dir=nbext_dir,
    symlink=(os.name not in ('nt', 'dos')),
)
log.info('-------- finished nbextensions install')

log.info('Writing Sphinx doc file {}'.format(destination))

# readthedocs doesn't allow us to specify the docs source_dir, but assumes
# it to be the same as the parent dir of this file. As such, we cheat for rtd
# by inserting a symlink, which requires us to alter the relative paths from
# the nbextensions.rst list to the readme files.
readme_rst_uri_prefix = (
    'nbextensions/' if on_rtd else
    '../../src/jupyter_contrib_nbextensions/nbextensions/')

log.info('readme_rst_uri_prefix = {}'.format(readme_rst_uri_prefix))
log.info('looking for nbextensions in {}...'.format(nbext_dir))
nbextensions = sorted(
    get_configurable_nbextensions([nbext_dir], log=log),
    key=lambda a: a['Name'].lower())

header = """

.. This is an automatically generated file. Do not modify by hand.

List of provided nbextensions
=============================

.. toctree::
   :maxdepth: 1

"""

with open(destination, 'w') as f:
    f.write(header)
    f.writelines([
        '   {}\n'.format(
            readme_rst_uri_prefix + os.path.splitext(nbext['readme'])[0])
        for nbext in nbextensions if nbext.get('readme')
    ])
