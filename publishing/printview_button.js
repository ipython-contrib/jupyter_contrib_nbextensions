// convert current notebook to html by calling "ipython nbconvert" and open static html file in new tab
"using strict";
   
nbconvertPrintView = function(){
    var kernel = IPython.notebook.kernel;
    var name = IPython.notebook.notebook_name;
    
    var path = IPython.notebook.notebook_path;
    if (path.length > 0) { path = path.concat('/'); }
    
    var command = 'ip=get_ipython(); import os; os.system(\"ipython nbconvert --profile=%s --to html ' + name + '\" % ip.profile)';

    function callback(out_type, out_data)
        { 
        var url = '/files/' + path + name.split('.ipynb')[0] + '.html';
        var win=window.open(url, '_blank');
        win.focus();
        }
    kernel.execute(command, { shell: { reply : callback } });
};

IPython.toolbar.add_buttons_group([
    {
        id : 'doPrintView',
        label : 'Create static print view',
        icon : 'fa-print',
        callback : nbconvertPrintView
    }
]);


