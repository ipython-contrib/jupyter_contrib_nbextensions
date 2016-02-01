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
    

    var SASlog = function () {
        var kernel = IPython.notebook.kernel;
        var name = IPython.notebook.notebook_name;
        var id = IPython.notebook.kernel.id
        var command ='showSASLog_11092015';
        console.log(command+' '+id);
        function callback(msg) {
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
        kernel.execute(command, { shell: { reply : callback } });
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

