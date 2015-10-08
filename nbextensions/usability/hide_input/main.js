// Adds a button to hide the input part of the currently selected cells

define([
    'jquery',
    'base/js/namespace'
], function(
    $,
    IPython
) {
    "use strict";

    var toggle_selected_input = function () {
        // Find the selected cell
        var cell = IPython.notebook.get_selected_cell();
        // Toggle visibility of the input div
        cell.element.find("div.input").toggle('slow');
        cell.metadata.input_collapsed = ! cell.metadata.input_collapsed;
    };

    var load_ipython_extension = function() {

        // Add a button to the toolbar
        IPython.toolbar.add_buttons_group([{
            id: 'btn-hide-input',
            label: 'Toggle selected cell input display',
            icon: 'fa-chevron-up',
            callback: function() {
                toggle_selected_input();
                setTimeout(function() { $('#btn-hide-input').blur(); }, 500);
            }
        }]);

        // Collapse all cells that are marked as hidden
        IPython.notebook.get_cells().forEach(function(cell) {
            if(cell.metadata.input_collapsed) {
                cell.element.find("div.input").hide();
            }
        });
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
