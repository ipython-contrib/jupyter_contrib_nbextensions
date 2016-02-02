define([
    'base/js/namespace',
    'jquery',
    'services/config',
    'base/js/events',
    'base/js/utils'
], function(IPython, $, configmod, events, utils) {
    "use strict";

    var extension = '.html';
    var open_tab = true;
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});


    
    function handle_output(out){
       //console.log(out);
       var res = null;
       // if output is a python object
       if(out.msg_type === "execute_result"){
           res = out.content.data["text/plain"];
       var logWindow = window.open('SASLog.html','_blank');
       logWindow.document.open();
       // strip the leading and trailing "'"
       logWindow.document.write(res.substring(1,res.length-1));
       logWindow.document.close();
       //console.log(res);
       }
    }

    var SASlog = function () {
        var code_input = 'regular code';
        var code_input = 'showSASLog_11092015';
        var kernel = IPython.notebook.kernel;
        var callbacks = { 'iopub' : {'output' : handle_output}};
        var msg_id = kernel.execute(code_input, callbacks, {silent:false});
        //console.log(msg_id, kernel.id);

 //       var kernel = IPython.notebook.kernel;
 //       var name = IPython.notebook.notebook_name;
 //       var id = IPython.notebook.kernel.id;
 //       var command ='showSASLog_11092015';
 //       console.log(command+' '+id);
        function callback() {
            if (open_tab === true) {
                var url = name.split('.ipynb')[0] + extension;
                console.log("before msg")
                console.log(msg)
                //console.log(msg.content.payload[0].tostring())
                console.log("after msg")
                var SASLog = `
                <html>
                <header><title>This is title</title></header>
                <body>
                Hello world
                </body>
                </html>
                `;
                var logWindow = window.open('SASLog.html','_blank');
                logWindow.document.open();
                logWindow.document.write(SASLog);
                logWindow.document.close();
            }
        }
//        kernel.execute(command, { shell: { reply : callback } });
        //$('#showSASLog').blur()
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

