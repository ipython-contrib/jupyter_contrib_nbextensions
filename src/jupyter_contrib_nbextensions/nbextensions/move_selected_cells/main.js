// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// This is a quick (and dirty) extension - move up or down several selected cells
// Dirty because it would be better to act on dom elements and write a correct 
// move_cells() function.
// Updated to Jupyter 4.2+, taking advantage of 
// `Jupyter.notebook.move_selection_{down, up}` new functions
//
// Keyboard shortcuts: Alt-up and Alt-down (works with single cells also -- this is useful!)
// Cells can be selected using the rubberband (needs rubberband extension) or via Shift-up/Shift-down or Shift-K/Shift-J


define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events'
], function(Jupyter, $, requirejs, events, rubberband) {
    "use strict";

    if (parseFloat(Jupyter.version.substr(0, 3)) >= 4.2) {
        var add_cmd_shortcuts = {
            'Alt-down': {
                help: 'Move selected cells down',
                help_index: 'ht',
                handler: function() { Jupyter.notebook.move_selection_down() }
            },
            'Alt-up': {
                help: 'Move selected cells up',
                help_index: 'ht',
                handler: function() { Jupyter.notebook.move_selection_up() }
            }
        }

    } else { // Jupyter version < 4.2
        var add_cmd_shortcuts = {
            'Alt-down': {
                help: 'Move selected cells down',
                help_index: 'ht',
                handler: function(event) {
                    var ncells = Jupyter.notebook.ncells();
                    var s = Jupyter.notebook.get_selected_indices();
                    //ensure cells indices are reverse sorted
                    var ss = s.sort(function(x, y) {
                        return x - y }).reverse();
                    if (ss[0] + 1 < ncells) {
                        for (var k in ss) {
                            Jupyter.notebook.move_cell_down(ss[k]);
                        }; //The second loop is needed because move_cell deselect
                        for (var k in ss) {
                            Jupyter.notebook.get_cell(ss[k] + 1).select();
                        }
                    }
                }
            },
            'Alt-up': {
                help: 'Move selected cells up',
                help_index: 'ht',
                handler: function(event) {
                    var s = Jupyter.notebook.get_selected_indices();
                    //ensure cells indices are sorted 
                    var ss = s.sort(function(x, y) {
                        return x - y });
                    if (ss[0] - 1 >= 0) {
                        for (var k in ss) {
                            Jupyter.notebook.move_cell_up(ss[k]);
                        };
                        for (var k in ss) {
                            Jupyter.notebook.get_cell(ss[k] - 1).select();
                        }
                    }
                }
            }
        }
    }

    function load_ipython_extension() {
        Jupyter.keyboard_manager.command_shortcuts.add_shortcuts(add_cmd_shortcuts);
        console.log("[move_selected_cells] loaded")
    }

    return {
        load_ipython_extension: load_ipython_extension,
    };

});
