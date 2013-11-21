//----------------------------------------------------------------------------
//  Copyright (C) 2012  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// convert current notebook to html by calling "ipython nbconvert"
"using strict";

var do_nbconvert_extension = (function() {  
    doNbconvert = function(){
        var kernel = IPython.notebook.kernel;
        var name = IPython.notebook.notebook_name;
        command = 'import os; os.system(\"ipython nbconvert --to html ' + name + '\")';
        kernel.execute(command);
    };

    IPython.toolbar.add_buttons_group([
        {
            id : 'doNbconvert',
            label : 'Convert current notebook to HTML',
            icon : 'icon-download-alt',
            callback : doNbconvert
        }
    ]);
})();

