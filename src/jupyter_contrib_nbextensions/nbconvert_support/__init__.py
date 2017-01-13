"""Classes and functions provided for use with nbconvert."""

import os

from .embedhtml import EmbedHTMLExporter
from .pp_highlighter import HighlighterPostProcessor, HighlighterPreprocessor
from .pre_codefolding import CodeFoldingPreprocessor
from .pre_collapsible_headings import CollapsibleHeadingsPreprocessor
from .pre_pymarkdown import PyMarkdownPreprocessor
from .pre_svg2pdf import SVG2PDFPreprocessor
from .toc2 import TocExporter
from .nbTranslate import NotebookLangExporter 

__all__ = [
    'CodeFoldingPreprocessor',
    'CollapsibleHeadingsPreprocessor',
    'EmbedHTMLExporter',
    'HighlighterPostProcessor',
    'HighlighterPreprocessor',
    'PyMarkdownPreprocessor',
    'SVG2PDFPreprocessor',
    'templates_directory',
    'TocExporter',
    'NotebookLangExporter'
]


def templates_directory():
    """Return path to the jupyter_contrib_nbextensions nbconvert templates."""
    return os.path.join(
        os.path.dirname(os.path.dirname(__file__)), 'templates')
