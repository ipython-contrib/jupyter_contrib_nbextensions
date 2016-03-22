# -*- coding: utf-8 -*-
"""
@author: bercherj
The content of selected environments is translated from markdown to latex, via
pandoc
"""

# ****************************************************************************
import re

from nbconvert.utils.pandoc import pandoc


def EnvReplace(message):

    environmentMap = [
        'thm', 'lem', 'cor', 'prop', 'defn', 'rem', 'prob', 'excs', 'examp',
        'theorem', 'lemma', 'corollary', 'proposition', 'definition', 'remark',
        'problem', 'exercise', 'example', 'proof', 'property', 'itemize',
        'enumerate', 'theo', 'enum'
    ]
    # this map should match the map defined in
    # .ipython/nbextensions/thmsInNb.js
    # do not include figure

    def replacement(a):
        import textwrap
        theenv = a.group(1)
        tobetranslated = a.group(2)
        tobetranslated = textwrap.dedent(tobetranslated)
        if theenv in environmentMap:
            # pandoc does not translate lines beginning with \item
            tobetranslated = tobetranslated.replace(r'\item', r'/item')
            out = pandoc(tobetranslated, 'markdown', 'latex')
            out = out.replace(r'/item', r'\item')
            result = (
                '/begin{' + theenv + '}\n' + out + '\n\end{' + theenv + '}'
            )
        else:
            tobetranslated = tobetranslated.replace('\\begin', '/begin')
            result = (
                '/begin{' + theenv + '}' + tobetranslated +
                '\end{' + theenv + '}'
            )
        # the transform \begin --> /begin is done in order to avoid the group
        # to match again

        # print(result)
        return result

    code = "Init"
    data = message
    data = data.replace(r"{enumerate}", r"{enum}")
    while (code is not None):
        code = re.search(r'\\begin{(\w+)}([\s\S]*?)\\end{\1}', data)
        data = re.sub(r'\\begin{(\w+)}([\s\S]*?)\\end{\1}', replacement, data)
    data = data.replace(r"{enum}", r"{enumerate}")
    return data

    # while (message.match(/\\begin{(\w+)}([\s\S]*?)\\end{\1}/gm)!="") {

if __name__ == '__main__':
    # TEST
    import sys
    infile = sys.argv[1]
    outfile = sys.argv[2]
    with open(sys.argv[1], "r") as infile:
        text = infile.read()
    text = text.replace("\\begin{document}", "/begin{document}")
    out = EnvReplace(text)
    out = out.replace("/begin", "\\begin")
    # don't knwow why but my last pandoc converts $ into \( or /). Correct
    # this:
    out = re.sub(r'\\[\(\)]', '$', out)
    # want to number everything
    out = re.sub(r'\\\[', r'\\begin{equation}', out)
    out = re.sub(r'\\\]', r'\\end{equation}', out)
    with open(sys.argv[2], "w") as outfile:
        outfile.write(
            "%Thms like environments translated from notebook"
            " using thmInNb_tolatex.py\n"
        )
        outfile.write(out)
