"""PostProcessor for customizing code language css class."""

# ----------------------------------------------------------------------------
# Copyright (c) the IPython Development Team.
#
# Distributed under the terms of the Modified BSD License.
#
# The full license is in the file COPYING.txt, distributed with this software.
# ----------------------------------------------------------------------------

# ----------------------------------------------------------------------------
# Imports
# ----------------------------------------------------------------------------
from __future__ import print_function

import io
import re

from nbconvert.postprocessors.base import PostProcessorBase
from traitlets import Unicode

try:
    from html.parser import HTMLParser  # py3
except:
    from HTMLParser import HTMLParser  # py2


class HtmlHighlightStripper(HTMLParser):
    """
    An object that is fed with html and removes <span> tags
    enclosed inside <pre> or <code> tags. This effectively removes
    static highlighting, but can strip other things too. This class is
    made to work with pandoc/marked/pygments type of output
    """

    def __init__(self, ostream):
        HTMLParser.__init__(self)
        self.in_pre = False
        self.in_code = False
        self.ostream = ostream
        self.pygments_fix = False

    def handle_starttag(self, tag, attrs):
        _print = True
        if tag == u"pre":
            if self.pygments_fix:
                _print = False
            self.in_pre = True
        elif tag == u"code":
            self.in_code = True
        elif tag == u"div":
            # Pygments doesn't protect raw code inside a <code> el.
            # and the language is in the enclosing <div> so we must
            # do some transfos.
            attrs_dict = dict(attrs)
            cssclass = attrs_dict.pop(u"class", None)
            if cssclass and cssclass.startswith(u"hl-"):
                self.pygments_fix = True
                tag = u"div" + self.stringify_attrs(attrs_dict) + ">"
                tag += u"<pre><code"

        elif self.in_pre or self.in_code:
            _print = False

        if _print:
            self.out(u"<%s%s>" % (tag, self.stringify_attrs(attrs)))

    def handle_endtag(self, tag):
        _print = True
        if tag == u"pre":
            if self.pygments_fix:
                _print = False
            self.in_pre = False
        elif tag == u"code":
            self.in_code = False
        elif self.in_pre or self.in_code:
            _print = False
        elif tag == u"div" and self.pygments_fix:
            tag = u"code></pre></div"
            self.pygments_fix = False

        if _print:
            self.out(u"</" + tag + ">")

    def def_handle(self, arg):
        self.out(arg)

    def handle_entityref(self, arg):
        self.out("&" + arg + ";")

    def handle_decl(self, arg):
        self.out("<!" + arg + ">")

    def handle_charref(self, arg):
        self.out("&#" + arg + ";")

    def handle_comment(self, arg):
        self.out("<!--" + arg + "-->")

    def handle_pi(self, arg):
        self.out("<?" + arg + ">")

    handle_data = unknown_decl = def_handle

    def stringify_attrs(self, attrs):
        if not attrs:
            return ""
        return " " + " ".join([k + "=" + '"%s"' % v for k, v in attrs])

    def out(self, data):
        self.ostream.write(data)


def rec(reg):
    return re.compile(reg, re.S)

pandoc_code_markup_re = rec(r'<pre\s*class="(\w*?)">\s*<code>')
marked_code_markup_re = rec(r'<pre>\s*<code\s*class="language-(\w*)">')
pygments_code_markup_re = rec(r'<pre>\s*<code\s*class="hl-(\w*)">')


class JsHighlightPostProcessor(PostProcessorBase):
    """
    Customize CSS classes of code blocks to let
    your favourite JS highlighting engine pick them up.
    """

    css_substitution = Unicode(default_value='{lang}', config=True,
                               help="""A template string to insert into the <pre>
        tags' ``class`` attribute. The only substituted value
        is {lang} where ``lang`` is the language of the fenced
        code block.""")

    def postprocess(self, input):

        _html = None
        with io.open(input, "r", encoding="utf-8") as f:
            _html = f.read()

        stripped = io.StringIO()
        stripper = HtmlHighlightStripper(stripped)
        stripper.feed(_html)
        _html = stripped.getvalue()

        # Prepare substitution string. {lang} is a placeholder
        # for the language detected by the regexp, which is the first
        # captured element.
        css = self.css_substitution.format(lang=r"\1")
        substitute = '<pre class="' + css + '"><code>'

        for cre in (pandoc_code_markup_re,
                    marked_code_markup_re,
                    pygments_code_markup_re):
            _html = cre.sub(substitute, _html)

        with io.open(input, "w", encoding="utf-8") as f:
            f.write(_html)

        return

msg = """
Modify code blocks in nbconvert's HTML output so that the highlighting
is done in the browser by Javascript.

Usage:
======
python js_highlight.py file.html css_substitution

Example (to let google-prettify do the highlighting):
=====================================================
    nbconvert MyNotebook.ipynb
    python js_highlight.py MyNotebook.html "prettyprint lang_{lang}"

Details
=======
"""


def usage():
    print(msg)
    print(JsHighlightPostProcessor.class_get_help())


def main(path, substitution=None):
    """allow running the module to customize css classes of html code blocks"""
    htmlClassCustomizer = JsHighlightPostProcessor()
    if substitution is not None:
        htmlClassCustomizer.css_substitution = substitution
    htmlClassCustomizer(path)

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 3:
        usage()
        sys.exit(-1)
    main(*sys.argv[1:])
