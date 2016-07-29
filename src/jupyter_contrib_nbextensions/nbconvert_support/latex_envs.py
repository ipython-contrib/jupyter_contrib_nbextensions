"""latex_envs Exporter class"""

# -----------------------------------------------------------------------------
# Copyright (c) 2016, the IPython IPython-Contrib Development Team.
#
# Distributed under the terms of the Modified BSD License.
#
# -----------------------------------------------------------------------------

# -----------------------------------------------------------------------------
# Imports
# -----------------------------------------------------------------------------

# Stdlib imports
# import os
import re

# A small utilitary function
from IPython.display import HTML, display
from nbconvert.exporters.exporter import Exporter
from nbconvert.exporters.html import HTMLExporter
from nbconvert.exporters.latex import LatexExporter
# from nbconvert.postprocessors.base import PostProcessorBase
from nbconvert.filters.highlight import Highlight2HTML, Highlight2Latex
from nbconvert.preprocessors import Preprocessor
from traitlets import Bool, Dict
from traitlets.config import Config


# IPython imports


def figcaption(text, label=" "):
    display(HTML("<div class=caption><b> Caption: </b> %s</div>"
            % text.replace('\n', '<br>')))

# -----------------------------------------------------------------------------
# Preprocessors, Exporters, PostProcessors
# -----------------------------------------------------------------------------


class LenvsLatexPreprocessor(Preprocessor):

    environmentMap = ['thm', 'lem', 'cor', 'prop', 'defn', 'rem',
                      'prob', 'excs', 'examp', 'theorem', 'lemma',
                      'corollary', 'proposition', 'definition', 'remark',
                      'problem', 'exercise', 'example', 'proof', 'property',
                      'itemize', 'enumerate', 'theo', 'enum']
    # this map should match the map defined in thmsInNb4.js
    # do not include figure

    def __call__(self, nb, resources):
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
        for index, cell in enumerate(nb.cells):
            nb.cells[index], resources = self.preprocess_cell(cell,
                                                              resources, index)
        return nb, resources

    def replacement(self, match):
        theenv = match.group(1)
        tobetranslated = match.group(2)
        out = "!sl!begin!op!" + theenv + '!cl!' + tobetranslated + "!sl!end!op!" + theenv + '!cl!'  # noqa
        out = out.replace('\n', '!nl!')
        if theenv in self.environmentMap:
            return out
        else:
            tobetranslated = tobetranslated.replace('\\begin', '/begin')
            tobetranslated = tobetranslated.replace('\\end', '/end')
            return out

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
        if cell.cell_type == "markdown":
            data = cell.source
            code = re.search(r'\\begin{(\w+)}([\s\S]*?)\\end{\1}', data)
            # data=data.replace(r"{enumerate}",r"{enum}")
            while (code is not None):
                data = re.sub(r'\\begin{(\w+)}([\s\S]*?)\\end{\1}',
                              self.replacement, data)
                data = data.replace(r"{enum}", r"{enumerate}")
                data = data.replace(r'\item', r'/item')
                code = re.search(r'\\begin{(\w+)}([\s\S]*?)\\end{\1}', data)
            # cell.source = cell.source.replace('\n','!nl!')
            data = data.replace("/begin", "\\begin")
            data = data.replace("/end", "\\end")
            cell.source = data
        return cell, resources


class LenvsHTMLPreprocessor(Preprocessor):

    environmentMap = ['thm', 'lem', 'cor', 'prop', 'defn', 'rem',
                      'prob', 'excs', 'examp', 'theorem', 'lemma',
                      'corollary', 'proposition', 'definition', 'remark',
                      'problem', 'exercise', 'example', 'proof', 'property',
                      'itemize', 'enumerate', 'theo', 'enum']
    # this map should match the map defined in thmsInNb4.js
    # do not include figure

    def replacement(self, match):
        return "\n" + match.group(0)

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
        # Add a newline before each environment: this is a workaround
        # for a bug in mistune where
        # the environment contents will be converted from markdown
        # this has unwanted consequences for equations
        # ref: https://github.com/jupyter/nbconvert/issues/160
        if cell.cell_type == "markdown":
            cell.source = re.sub(r'\\begin{(\w+)}([\s\S]*?)\\end{\1}',
                                 self.replacement, cell.source)
        return cell, resources


class LenvsHTMLExporter(HTMLExporter):
    """
    Exports to an html document, embedding latex_env extension (.html)
    """

    def __init__(self, config=None, **kw):
            """
            Public constructor

            Parameters
            ----------
            config : :class:`~traitlets.config.Config`
                User configuration instance.
            `**kw`
                Additional keyword arguments passed to parent __init__

            """
            with_default_config = self.default_config
            if config:
                with_default_config.merge(config)

            super(HTMLExporter, self).__init__(
                config=with_default_config, **kw)
            self.register_preprocessor(LenvsHTMLPreprocessor(), enabled=True)

            self._init_preprocessors()

    def _file_extension_default(self):
        return '.html'

    def _template_file_default(self):
        return 'latex_envs'

    output_mimetype = 'text/html'

    def _raw_mimetypes_default(self):
        return ['text/markdown', 'text/html', '']

    @property
    def default_config(self):
        # import jupyter_core.paths
        # import os
        c = Config({
            'NbConvertBase': {
                'display_data_priority': ['application/javascript',
                                          'text/html',
                                          'text/markdown',
                                          'image/svg+xml',
                                          'text/latex',
                                          'image/png',
                                          'image/jpeg',
                                          'text/plain'
                                          ]
            },
            'CSSHTMLHeaderPreprocessor': {
                'enabled': True
            },
            'HighlightMagicsPreprocessor': {
                'enabled': True
            },
            'ExtractOutputPreprocessor': {'enabled': True},
            'latex_envs.LenvsHTMLPreprocessor': {'enabled': True}}
        )
        from jupyter_contrib_nbextensions.nbconvert_support import (
            templates_directory)
        c.merge(super(LenvsHTMLExporter, self).default_config)

        # user_templates = os.path.join(jupyter_core.paths.jupyter_data_dir(),
        # 'templates')
        c.TemplateExporter.template_path = ['.', templates_directory()]
        # c.Exporter.preprocessors = ['tmp.LenvsLatexPreprocessor' ]
        # c.NbConvertApp.postprocessor_class = 'tmp.TocPostProcessor'
        return c

    def from_notebook_node(self, nb, resources=None, **kw):
            langinfo = nb.metadata.get('language_info', {})
            lexer = langinfo.get('pygments_lexer', langinfo.get('name', None))
            self.register_filter('highlight_code',
                                 Highlight2HTML(pygments_lexer=lexer,
                                                parent=self))
            lenvshtmlpreprocessor = LenvsHTMLPreprocessor()

            self.register_preprocessor(lenvshtmlpreprocessor, enabled=True)
            self._init_preprocessors()
            nb, resources = lenvshtmlpreprocessor(nb, resources)
            output, resources = super(LenvsHTMLExporter,
                                      self).from_notebook_node(
                                          nb, resources, **kw)
            # postout = postprocess(output)
            # print(postout[0:200]) #WORKS
            return output, resources

###################


class LenvsTocHTMLExporter(LenvsHTMLExporter):
    """
    Exports to an html document, embedding latex_env and toc extensions (.html)
    """

    def _template_file_default(self):
        return 'latex_envs_toc'


################

class LenvsLatexExporter(LatexExporter):
    """
    Exports to an html document, embedding latex_env extension (.html)
    """

    removeHeaders = Bool(False, shortname="rh",
                         help="Remove headers and footers").tag(config=True)
    figcaptionProcess = Bool(True, shortname="fc",
                             help="Process figcaptions").tag(config=True)
    tocrefRemove = Bool(True, shortname="fc",
        help="Remove tocs and ref sections, + some cleaning").tag(config=True)  # noqa
    flags = Dict(dict(enable=({'Bar': {'enabled': True}}, "Enable Bar")))

    def __init__(self, config=None, **kw):
            """
            Public constructor

            Parameters
            ----------
            config : :class:`~traitlets.config.Config`
                User configuration instance.
            `**kw`
                Additional keyword arguments passed to parent __init__

            """
            with_default_config = self.default_config
            if config:
                with_default_config.merge(config)

            super(Exporter, self).__init__(config=with_default_config, **kw)
            self.register_preprocessor(LenvsLatexPreprocessor(), enabled=True)

            self._init_preprocessors()

    def _file_extension_default(self):
        return '.tex'

    def _template_file_default(self):
        return 'thmsInNb_article'

    output_mimetype = 'text/tex'

    def _raw_mimetypes_default(self):
        return ['text/tex', 'text/txt', '']

    @property
    def default_config(self):
        # import jupyter_core.paths
        # import os
        c = Config({
            'NbConvertBase': {
                'display_data_priority': ['application/javascript',
                                          'text/html',
                                          'text/markdown',
                                          'image/svg+xml',
                                          'text/latex',
                                          'image/png',
                                          'image/jpeg',
                                          'text/plain'
                                          ]
            },
            'CSSHTMLHeaderPreprocessor': {
                'enabled': True},
            'HighlightMagicsPreprocessor': {
                'enabled': True},
            'ExtractOutputPreprocessor': {
                'enabled': True},
            'latex_envs.LenvsLatexPreprocessor': {'enabled': True}
        }
        )
        from jupyter_contrib_nbextensions.nbconvert_support import (
            templates_directory)
        c.merge(super(LenvsLatexExporter, self).default_config)

        # user_templates = os.path.join(jupyter_core.paths.jupyter_data_dir(),
        # 'templates')
        c.TemplateExporter.template_path = ['.', templates_directory()]

        # c.Exporter.preprocessors = ['tmp.LenvsLatexPreprocessor' ]
        # c.NbConvertApp.postprocessor_class = 'tmp.TocPostProcessor'
        return c

    def tocrefrm(self, text):
        # Remove Table of Contents section
        newtext = re.sub(r'\\section{Table of Contents}([\s\S]*?)(?=(?:\\[sub]?section|\\chapter))', '', text, flags=re.M)  # noqa
        # Remove References section
        newtext = re.sub(r'\\section{References}[\S\s]*?(?=(?:\\[sub]*section|\\chapter|\\end{document}|\Z))', '', newtext, flags=re.M)   # noqa
        # Cleaning
        newtext = re.sub('\\\\begin{verbatim}[\s]*?<matplotlib\.[\S ]*?>[\s]*?\\\\end{verbatim}', '', newtext, flags=re.M)  # noqa
        newtext = re.sub('\\\\begin{verbatim}[\s]*?<IPython\.core\.display[\S ]*?>[\s]*?\\\\end{verbatim}', '', newtext, flags=re.M)  # noqa
        # bottom page with links to Index/back/next (suppress this)
        # '----[\s]*?<div align=right> [Index](toc.ipynb)[\S ]*?.ipynb\)</div>'
        newtext = re.sub('\\\\begin{center}\\\\rule{3in}{0.4pt}\\\\end{center}[\s]*?\\\\href{toc.ipynb}{Index}[\S\s ]*?.ipynb}{Next}', '', newtext, flags=re.M)  # noqa
        return newtext

    def figcaption(self, nb_text):
        # Looks for figcaption in the text. Then for the included image
        # with \adjustimage...Then extracts caption and label from the
        # figcaption and redraws the figure using a figure environment
        # and an \includegraphics figcaption(text,label=)
        tofind = "figcaption\(([\s\S]*?)\)\n([\s\S]*?)\\\\begin{center}\s*\\\\adjustimage[\s\S]*?}}{([\S]*?)}\s*\\\\end{center}"  # noqa

        def replacement(text):
            cap = re.match("\"([\S\s]*?)\",[\S\s]*?label=\"([\S]*?)\"", text.group(1))  # noqa
            if cap is None:
                cap = re.match("\"([\S\s]*?)\"", text.group(1), re.M)
                if cap is not None:
                    caption = cap.group(1)
                else:
                    caption = '""'
                label = ""
                rep = "\n%s\n\\begin{figure}[H]\n\\centering\n\\includegraphics[width=0.6\\linewidth]{%s}\n\\caption{%s}\n\\end{figure}" % (text.group(2), text.group(3), caption)  # noqa
            else:
                caption = cap.group(1)
                label = cap.group(2)
                rep = "\n%s\n\\begin{figure}[H]\n\\centering\n\\includegraphics[width=0.6\\linewidth]{%s}\n\\caption{%s}\n\\label{%s}\n\\end{figure}" % (text.group(2), text.group(3), caption, label)  # noqa
            return rep

        code = re.search(tofind, nb_text)
        while (code is not None):
            nb_text = re.sub(tofind, replacement, nb_text, flags=re.M)
            code = re.search(tofind, nb_text)
        return nb_text

    def postprocess(self, nb_text):
        nb_text = nb_text.replace('!nl!', '\n')
        nb_text = nb_text.replace('!op!', '{')
        nb_text = nb_text.replace('!cl!', '}')
        nb_text = nb_text.replace('!sl!', '\\')
        nb_text = nb_text.replace(r'/item', r'\item')

        # print('SELF--->',dir(self))
        if self.removeHeaders:
            tex_text = re.search('begin{document}([\s\S]*?)\\\\end{document}', nb_text, flags=re.M)  # noqa
            newtext = tex_text.group(1)
            newtext = newtext.replace('\maketitle', '')
            newtext = newtext.replace('\\tableofcontents', '')
            nb_text = newtext
        if self.figcaptionProcess:
            nb_text = self.figcaption(nb_text)
        if self.tocrefRemove:
            nb_text = self.tocrefrm(nb_text)
        return nb_text

    def from_notebook_node(self, nb, resources=None, **kw):
            langinfo = nb.metadata.get('language_info', {})
            lexer = langinfo.get('pygments_lexer', langinfo.get('name', None))
            self.register_filter('highlight_code',
                                 Highlight2Latex(pygments_lexer=lexer,
                                                 parent=self))
            lenvslatexpreprocessor = LenvsLatexPreprocessor()

            self.register_preprocessor(lenvslatexpreprocessor, enabled=True)
            self._init_preprocessors()
            nb, resources = lenvslatexpreprocessor(nb, resources)
            output, resources = super(LenvsLatexExporter, self).from_notebook_node(nb, resources, **kw)  # noqa
            postout = self.postprocess(output)
            # postout = postout.replace('sklearn','Tonio')
            # print(postout[0:200]) #WORKS

            return postout, resources

# jupyter nbconvert --to latex_envs.LenvsLatexExporter
# --LenvsLatexExporter.removeHeaders=True
# --LenvsLatexExporter.figcaptionProcess=True
# --LenvsLatexExporter.tocrefRemove=True test_theo.ipynb

# once entry point are installed
# jupyter nbconvert --to latex_lenvs --figcaptionProcess=true
# --removeHeaders=false test_theo

# jupyter nbconvert --to latex_envs.LenvsHTMLExporter test_theo.ipynb
