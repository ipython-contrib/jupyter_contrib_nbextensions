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
        //set_input_visible(Jupyter.notebook.metadata.hide_input !== true);
        console.warn("Embedded HTML Button loaded!");
    }

    var load_ipython_extension = function() {
        Jupyter.toolbar.add_buttons_group([{
            id : 'export_embeddedhtml',
            label : 'Embedded HTML Export',
            icon : 'fa-save',
            callback : function() {
                Jupyter.menubar._nbconvert('htmlembedded', true);
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
