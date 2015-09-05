// Avoid server side code :
// https://github.com/ipython/ipython/issues/2780
var show_gist_link = function(type,data){
    var dialog = $('<div/>');
    dialog.html('you can see this notebook at '+data.data);

    if(IPython.notebook.metadata._draft == undefined){
        IPython.notebook.metadata._draft = {}
    }

    if(IPython.notebook.metadata._draft.nbviewer_url == undefined){
        IPython.notebook.metadata._draft.nbviewer_url = data.data
    }

    $(document).append(dialog);
    dialog.dialog({
        resizable: false,
        modal: true,
        title: "Shared on Github",
    });
}

var cdict = {
    output: show_gist_link
    }

IPython.toolbar.add_buttons_group([
    {
             'label'   : 'Share Notebook',
             'icon'    : 'fa-info-circle',
             'callback': function(){
                 IPython.notebook.kernel.execute(
                        //'!jist -p ' + IPython.notebook.notebook_name + '.ipynb',
                        '!echo "gisting : ' + IPython.notebook.notebook_name + '.ipynb"',
                        cdict)

    }
}]);
