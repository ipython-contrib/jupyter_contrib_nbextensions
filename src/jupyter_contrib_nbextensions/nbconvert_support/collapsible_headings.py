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

    def _template_file_default(self):
        return 'collapsible_headings'

    def __init__(self, *args, **kwargs):
        super(ExporterCollapsibleHeadings, self).__init__(*args, **kwargs)

        ch_dir = os.path.join(
            os.path.dirname(contrib_init), 'nbextensions',
            'collapsible_headings')

        with open(os.path.join(ch_dir, 'main.css'), 'r') as f:
            main_css = f.read()
        self.inliner_resources['css'].append(main_css)

        self.inliner_resources['css'].append("""
/* no local copies of fontawesome fonts from basic templates, so get them from cdn */
@font-face {
    font-family: 'FontAwesome';
    src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.eot');
    src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.eot?#iefix') format('embedded-opentype'),
         url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.woff') format('woff'),
         url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.ttf') format('truetype'),
         url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.svg#fontawesomeregular') format('svg');
    font-weight: normal;
    font-style: normal;
}
""")  # noqa: E501

        with open(os.path.join(ch_dir, 'main.js'), 'r') as f:
            self.inliner_resources['js'].append(
                f.read().replace(
                    "define([",
                    "define('nbextensions/collapsible_headings/main', [")
            )

        cm = ConfigManager()
        collapsible_headings_options = cm.get('notebook').get(
            'collapsible_headings', {})
        self.inliner_resources['js'].append("""
require([
    'jquery',
    'nbextensions/collapsible_headings/main'
], function (
    $,
    nbext
) {
    nbext.set_collapsible_headings_options(%s);
    $(document).ready(function () {
        nbext.refresh_all_headings();
    });
});
""" % json.dumps(collapsible_headings_options))
