"""Classes provided by jupyter_contrib_nbextensions for use with nbconvert."""

import os

from .latex_envs import LenvsHTMLExporter, LenvsLatexExporter
from .pp_highlighter import HighlighterPostProcessor, HighlighterPreprocessor
from .pre_codefolding import CodeFoldingPreprocessor
from .pre_collapsible_headings import CollapsibleHeadingsPreprocessor
from .pre_pymarkdown import PyMarkdownPreprocessor
from .pre_svg2pdf import SVG2PDFPreprocessor
from .toc2 import TocExporter
from .embedhtml import EmbedHTMLExporter

__all__ = [
    'CodeFoldingPreprocessor',
    'CollapsibleHeadingsPreprocessor',
    'HighlighterPostProcessor',
    'HighlighterPreprocessor',
    'PyMarkdownPreprocessor',
    'SVG2PDFPreprocessor',
    'TocExporter',
    'EmbedHTMLExporter',
    'LenvsHTMLExporter',
    'LenvsLatexExporter',
    'templates_directory',
]


def templates_directory():
    """Return path of the jupyter_contrib_nbextensions nbconvert templates."""
    return os.path.join(
        os.path.dirname(os.path.dirname(__file__)), 'templates')
