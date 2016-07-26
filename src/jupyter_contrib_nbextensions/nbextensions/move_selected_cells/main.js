// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// This is a quick (and dirty) extension - move up or down several selected cells
// Dirty because it would be better to act on dom elements and write a correct move_cells() function
// Keyboard shortcuts: Alt-up and Alt-down (works with single cells also -- this is useful!)
// Cells can be selected using the rubberband or via Shift-J and Shift-K


define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'nbextensions/rubberband/main'
], function(IPython, $, require, events, rubberband) {
    "use strict";
var add_cmd_shortcuts = {
    'Alt-down': {
        help: 'Move selected cells down',
        help_index: 'ht',
        handler: function(event) {
            var ncells = IPython.notebook.ncells();
            var s = IPython.notebook.get_selected_indices();
            //ensure cells indices are reverse sorted
            var ss = s.sort(function(x, y) {return x - y}).reverse(); 
            if (ss[0] + 1 < ncells) {
                for (var k in ss) {
                    IPython.notebook.move_cell_down(ss[k]);
                }; //The second loop is needed because move_cell deselect
                for (var k in ss) {
                    IPython.notebook.get_cell(ss[k] + 1).select();
                }
            }
        }
    },
    'Alt-up': {
        help: 'Move selected cells up',
        help_index: 'ht',
        handler: function(event) {
            var s = IPython.notebook.get_selected_indices();
            //ensure cells indices are sorted 
            var ss = s.sort(function(x, y) {return x - y});
            if (ss[0] - 1 >= 0) {
                for (var k in ss) {
                    IPython.notebook.move_cell_up(ss[k]);
                };
                for (var k in ss) {
                    IPython.notebook.get_cell(ss[k] - 1).select();
                }
            }
        }
    }
}


IPython.keyboard_manager.command_shortcuts.add_shortcuts(add_cmd_shortcuts);

function load_ipython_extension(){
    //console.log("Executing rubberband load_ipython");
    rubberband.load_ipython_extension();
}

    return {
        load_ipython_extension: load_ipython_extension,
    };
    
});
