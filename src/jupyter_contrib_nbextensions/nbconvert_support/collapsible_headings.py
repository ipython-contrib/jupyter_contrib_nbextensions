"""Nbconvert exporter to inline css & js for collapsible_headings."""

import json
import os

from notebook.services.config import ConfigManager

from jupyter_contrib_nbextensions import __file__ as contrib_init

from .exporter_inliner import ExporterInliner


class ExporterCollapsibleHeadings(ExporterInliner):
    """
    HTMLExporter which inlines the collapsible_headings nbextension.

    Export collapsible_headings nbextension functionality to html
    by inlining relevant css and js content.

    Example usage::

        jupyter nbconvert --to html_ch FILE.ipynb
    """

    def __init__(self, *args, **kwargs):
        super(ExporterCollapsibleHeadings, self).__init__(*args, **kwargs)

        self.inliner_resources['css'].append("""
/* no local copies of fontawesome fonts in basic templates, so use cdn */
@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css)
""")  # noqa: E501

        ch_dir = os.path.join(
            os.path.dirname(contrib_init), 'nbextensions',
            'collapsible_headings')

        with open(os.path.join(ch_dir, 'main.css'), 'r') as f:
            self.inliner_resources['css'].append(f.read())

        with open(os.path.join(ch_dir, 'main.js'), 'r') as f:
            self.inliner_resources['js'].append(f.read())

        cm = ConfigManager()
        collapsible_headings_options = cm.get('notebook').get(
            'collapsible_headings', {})
        self.inliner_resources['js'].append("""
$(document).ready(function () {
    require(['nbextensions/collapsible_headings/main'], function (ch) {
        ch.set_collapsible_headings_options(%s);
        ch.refresh_all_headings();
    });
});
""" % json.dumps(collapsible_headings_options))
