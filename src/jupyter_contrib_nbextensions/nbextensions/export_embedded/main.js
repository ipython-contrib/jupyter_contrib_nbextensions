// toggle display of all code cells' inputs

define([
    'jquery',
    'base/js/namespace',
    'base/js/events'
], function(
    $,
    Jupyter,
    events
) {
    "use strict";

    function initialize () {
    }

    var load_ipython_extension = function() {
        
        var v = Jupyter.version.split(".")
        if(Number(v[0])*10+ Number(v[1]) < 51)
        {
          console.log('Notebook version 5.1.0 or higher required for this extension')
          return
        }
        
        /* Add an entry in the download menu */
        var dwm = $("#download_menu")
        var downloadEntry = $('<li id="download_html_embed"><a href="#">HTML Embedded (.html)</a></li>')
        dwm.append(downloadEntry)
        downloadEntry.click(function () {
            Jupyter.menubar._nbconvert('html_embed', true);
        });
        
        /* Add also a Button, currently disabled */
        /*
        Jupyter.toolbar.add_buttons_group([
        Jupyter.keyboard_manager.actions.register ({
            help   : 'Embedded HTML Export',
            icon   : 'fa-save',
            handler: function() {
                Jupyter.menubar._nbconvert('html_embed', true);
            }
        }, 'export-embedded-html', 'export_embedded')
        ]);
        */
        if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
            // notebook_loaded.Notebook event has already happened
            initialize();
        }
        events.on('notebook_loaded.Notebook', initialize);
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
