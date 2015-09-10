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
            icon : 'fa-download',
            callback : doNbconvert
        }
    ]);
})();

