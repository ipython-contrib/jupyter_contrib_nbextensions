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
        console.log("Embedded HTML Exporter loaded!");
    }

    var load_ipython_extension = function() {
      
        var dwm = $("#download_menu")
        var downloadEntry = $('<li id="download_html_embed"><a href="#">HTML Embedded (.html)</a></li>')
        dwm.append(downloadEntry)
        downloadEntry.click(function () {
            Jupyter.menubar._nbconvert('html_embed', true);
        });
      
        Jupyter.toolbar.add_buttons_group([{
            id : 'export_embeddedhtml',
            label : 'Embedded HTML Export',
            icon : 'fa-save',
            callback : function() {
                Jupyter.menubar._nbconvert('html_embed', true);
            }
        }]);
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
