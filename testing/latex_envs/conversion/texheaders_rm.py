
"""
Created on Thu Nov 18 15:34:38 2014
@author: bercherj
Remove TeX's file headers and footers
"""

import glob
import os
import sys
import time
from stat import *

    
def texheaders_filtering(input_file):
    import re
    
    st = os.stat(input_file)
    atime = st[ST_ATIME] #access time
    mtime = st[ST_MTIME] #modification time
   
    with open(input_file,'rt') as f:
        text=f.read()
    #print(text)           
    my_texfile = input_file #file.split('.html')[0] + 'b.html' 
    if sys.version_info >= (3,0,0):
        my_texfile_desc = open(my_texfile, 'wt', newline='')
    else:
        my_texfile_desc = open(my_texfile_file, 'wt')

    
    tex_text=re.search('begin{document}([\s\S]*?)\\\\end{document}',text,flags=re.M)
    #print(tex_text) 
    newtext=tex_text.group(1)
    newtext=newtext.replace('\maketitle','')
    newtext=newtext.replace('\\tableofcontents','')
    
    
    my_texfile_desc.write(newtext)
    
    #modify the file timestamp
    my_texfile_desc.close()    
    os.utime(my_texfile,(atime,mtime))

    
    
verbose=True    
if __name__ == '__main__':	
    import argparse

    whatitdoes="""This program filters a tex file in order to remove headers 
    and footer, that is all what is before the \\begin{document} (included) and
    after the \\end{document} (included)"""
    myself="(c) JFB 2014"
    parser = argparse.ArgumentParser(description=whatitdoes, epilog=myself)
    # mandatory argument
    parser.add_argument(
    help = 'List of files to filter (accepts regular expressions)',
    dest = 'argfiles', default = '*.tex', type = str,  nargs = '*')
    # verbosity flag
    parser.add_argument('-v','--verbose', help = 'Prints information',
    dest = 'verbose', default = False,   #action='store_true'
    action='count')

    arguments = parser.parse_args()
    verbose=arguments.verbose
    if verbose==2: print("script arg: ", arguments.argfiles)
   
    if isinstance(arguments.argfiles,list):
        tex_files=[]
        for x in arguments.argfiles:
             tex_files = tex_files+glob.glob(x)   
    else:
        tex_files = glob.glob(arguments.argfiles)
    if verbose==2: print("glog.glog expansion: ", tex_files, '\n')
    if len(tex_files ) == 0:
        raise RuntimeError('No TeX files to convert.')
          
    for file in tex_files:
        if verbose:
            print("Filtering {}".format(file))
        texheaders_filtering(file)




