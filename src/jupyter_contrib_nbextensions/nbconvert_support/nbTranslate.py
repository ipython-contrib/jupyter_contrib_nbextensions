# -*- coding: utf-8 -*-

"""nbTranslate Preprocessor Exporter class"""

# -----------------------------------------------------------------------------
# Copyright (c) 2016, J.-F. Bercher
#
# Distributed under the terms of the Modified BSD License.
#
# -----------------------------------------------------------------------------

# -----------------------------------------------------------------------------
# Imports
# -----------------------------------------------------------------------------

from __future__ import print_function

import nbformat
from nbconvert.exporters.notebook import NotebookExporter
from nbconvert.preprocessors import Preprocessor
from traitlets import Bool, Enum, Unicode

# -----------------------------------------------------------------------------
# Preprocessor
# -----------------------------------------------------------------------------

langs = {
    'auto': 'Automatic',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'zh-cn': 'Chinese Simplified',
    'zh-tw': 'Chinese Traditional',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    'iw': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'ma': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sudanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
}


class nbTranslatePreprocessor(Preprocessor):

    def __init__(self, lang='en', **kw):
        self.language = lang

    def __call__(self, nb, resources, lang='en'):
        if self.enabled:
            self.log.debug("Applying preprocessor: %s",
                           self.__class__.__name__)
            return self.preprocess(nb, resources)
        else:
            return nb, resources

    def preprocess(self, nb, resources):
        """
        Preprocessing to apply on each notebook.

        Must return modified nb, resources.

        If you wish to apply your preprocessing to each cell, you might want
        to override preprocess_cell method instead.

        Parameters
        ----------
        nb : NotebookNode
            Notebook being converted
        resources : dictionary
            Additional resources used in the conversion process.  Allows
            preprocessors to pass variables into the Jinja engine.
        """

        filtered_cells = []
        for cell in nb.cells:
            if cell.cell_type == 'markdown':
                if (cell.get('metadata', {}).get('lang', self.language) == self.language): # noqa
                    filtered_cells.append(cell)
            else:
                filtered_cells.append(cell)

        nb.cells = filtered_cells
        return super(nbTranslatePreprocessor, self).preprocess(nb, resources)

    def preprocess_cell(self, cell, resources, index):
        """
        Preprocess cell

        Parameters
        ----------
        cell : NotebookNode cell
            Notebook cell being processed
        resources : dictionary
            Additional resources used in the conversion process.  Allows
            preprocessors to pass variables into the Jinja engine.
        cell_index : int
            Index of the cell being processed (see base.py)
        """

        return cell, resources

# ----------------------------------------------------------------
# Exporter
# ----------------------------------------------------------------


class NotebookLangExporter(NotebookExporter):
    """Exports to an IPython notebook."""

    nbformat_version = Enum(list(nbformat.versions),
                            default_value=nbformat.current_nbformat,
                            config=True,
                            help="""The nbformat version to write.
        Use this to downgrade notebooks.
        """
                            )

#    language = CaselessStrEnum(
#        langs.keys(), help="Selected language").tag(config=True, alias="lang")

    language = Unicode(
        'en', help="Selected language").tag(config=True, alias="lang")

    addSuffix = Bool(True, help="Use language tag as suffix")

    # language = 'en'

    def _file_extension_default(self):
        return '.ipynb'

    output_mimetype = 'application/json'

    def from_notebook_node(self, nb, resources=None, **kw):

        if (self.language not in langs.keys()):
            raise ValueError("""Error -- {} is not a valid language abbreviation
            Please select one of the abbreviations in the list\n {}""".format(self.language, langs)) # noqa

        nbtranslatepreprocessor = nbTranslatePreprocessor(lang=self.language)
        self.register_preprocessor(nbtranslatepreprocessor, enabled=True)
        self._init_preprocessors()
        nb, resources = nbtranslatepreprocessor(nb, resources)

        nb_copy, resources = super(NotebookLangExporter, self).from_notebook_node(nb, resources, **kw) # noqa
        if self.addSuffix:
            resources['output_suffix'] = '_' + self.language

        return nb_copy, resources
