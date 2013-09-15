//----------------------------------------------------------------------------
//  Copyright (C) 2012  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// convert current notebook to html by calling "ipython nbconvert" and open file in new tab
"using strict";
   
nbconvertPrintView = function(){
    var kernel = IPython.notebook.kernel;
    var name = IPython.notebook.notebook_name;
    command = 'import subprocess; subprocess.call(\"ipython nbconvert --to html ' + name + '\",shell=True)';
    function callback(out_type, out_data)
        { 
        console.log('out:', out_data);  
        var url = '/files/' + name + '.html';
        var win=window.open(url, '_blank');
        win.focus();
        }
    kernel.execute(command, {"execute_reply": callback});
};

IPython.toolbar.add_buttons_group([
    {
        id : 'doPrintView',
        label : 'Create static print view',
        icon : 'icon-print',
        callback : nbconvertPrintView
    }
]);


