// Adds a button to hide the input part of the currently selected cells

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

    var toggle_selected_input = function () {
        // Find the selected cell
        var cell = Jupyter.notebook.get_selected_cell();
        // Toggle visibility of the input div
        cell.element.find("div.input").toggle('slow');
        cell.metadata.hide_input = ! cell.metadata.hide_input;
    };

    var update_input_visibility = function () {
        Jupyter.notebook.get_cells().forEach(function(cell) {
            if (cell.metadata.hide_input) {
                cell.element.find("div.input").hide();
            }
        })
    };

    var load_ipython_extension = function() {

        // Add a button to the toolbar
        $(Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                help   : 'Toggle selected cell input display',
                icon   : 'fa-chevron-up',
                handler: function() {
                    toggle_selected_input();
                    setTimeout(function() { $('#btn-hide-input').blur(); }, 500);
                }
            }, 'toggle-cell-input-display', 'hide_input')
        ])).find('.btn').attr('id', 'btn-hide-input');
        // Collapse all cells that are marked as hidden
        if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
            // notebook already loaded. Update directly
            update_input_visibility();
        }
        events.on("notebook_loaded.Notebook", update_input_visibility);
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
