//----------------------------------------------------------------------------
//  Copyright (C) 2012  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// convert current notebook to html by calling "ipython nbconvert"
"using strict";
   
doNbconvert = function(){
    var kernel = IPython.notebook.kernel;
    var name = IPython.notebook.notebook_name;
    command = 'import subprocess; subprocess.call(\"ipython nbconvert --to html ' + name + '\",shell=True)';
    function callback(out_type, out_data){ console.log('out:', out_data);  } 
    kernel.execute(command, {"output": callback});
};

IPython.toolbar.add_buttons_group([
    {
        id : 'doNbconvert',
        label : 'Convert current notebook to HTML',
        icon : 'icon-download-alt',
        callback : doNbconvert
    }   
]);

