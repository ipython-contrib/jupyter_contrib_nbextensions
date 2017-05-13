# -*- coding: utf-8 -*-
"""
@author: bercherj
The content of selected environments is translated from markdown to latex, via pandoc
The environments are extracted recursively and translated. Then they are inserted back into the tex file. 
"""

#****************************************************************************
def EnvReplace(message):
	
    import re
    from IPython.nbconvert.utils.pandoc import pandoc
    
    environmentMap = ['thm','lem', 'cor', 'prop','defn','rem','prob','excs','examp','theorem','lemma','corollary','proposition',
            'definition','remark','problem', 'exercise', 'example','proof','property']
	# this map should match the map defined in .ipython/nbextensions/thmsInNb.js	

    def replacement(a):
        
        w=a.group(0)            
        theenv=a.group(1)
        tobetranslated=a.group(2)
        if theenv in environmentMap:
            out=pandoc(tobetranslated, 'markdown', 'latex')
            result = '/begin{' + theenv + '}\n'+ out + '\n\end{' + theenv + '}';
        else:
            result = '/begin{' + theenv + '}'+ tobetranslated + '\end{' + theenv + '}';
        #the transform \begin --> /begin is done in order to avoid the group to match again
        
        #print(result)
        return result
    
    code="Init"
    data=message
    while (code!=None):   
        code=re.search(r'\\begin{(\w+)}([\s\S]*?)\\end{\1}', data)         
        data=re.sub(r'\\begin{(\w+)}([\s\S]*?)\\end{\1}', replacement, data)
    return data
        

	#while (message.match(/\\begin{(\w+)}([\s\S]*?)\\end{\1}/gm)!="") {
	
if __name__ == '__main__':
    # TEST
    import sys
    infile=sys.argv[1]
    outfile=sys.argv[2]
    with open (sys.argv[1], "r") as infile:
       text=infile.read()
    text=text.replace("\\begin{document}","/begin{document}")   
    out=EnvReplace(text)
    out=out.replace("/begin","\\begin")   
    with open (sys.argv[2], "w") as outfile:
       outfile.write("%Thms like environments translated from notebook using thmInNb_tolatex.py\n")        
       outfile.write(out)


