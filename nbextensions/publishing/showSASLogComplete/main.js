define([
    'base/js/namespace',
    'jquery',
    'services/config',
    'base/js/events',
    'base/js/utils'
], function(IPython, $, configmod, events, utils) {
    "use strict";
    //var base_url = utils.get_body_data("baseUrl");
    //var config = new configmod.ConfigSection('notebook', {base_url: base_url});
    
    function handle_output(out){
       var res = null;
       if(out.msg_type === "execute_result"){
           res = out.content.data["text/plain"];
       var logWindow = window.open('SASLog.html','_blank');
       logWindow.document.open();
       // strip the leading and trailing "'"
       logWindow.document.write(res.substring(1,res.length-1));
       logWindow.document.close();
       }
    }

    var SASlog = function () {
        var code_input = 'highlight(saspy._log,SASLogLexer(), HtmlFormatter(full=True, style=SASLogStyle, lineseparator="<br>",title="SAS Log"))';
        var kernel = IPython.notebook.kernel;
        var callbacks = { 'iopub' : {'output' : handle_output}};
        var msg_id = kernel.execute(code_input, callbacks, {silent:false});
    };

    var load_ipython_extension = function() {
        config.load();
        IPython.toolbar.add_buttons_group([
            {
                id: 'showSASLog',
                label: 'Show the SAS Log for last executed cell',
                icon: 'fa-wrench',
                callback: SASlog
            }
        ]);
    };
    return {
        load_ipython_extension : load_ipython_extension
    };
});

