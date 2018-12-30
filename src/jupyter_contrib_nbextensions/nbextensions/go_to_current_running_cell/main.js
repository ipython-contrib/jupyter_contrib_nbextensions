// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// This is an extension allows you to jump to the current running cell.
//  You can also activate this functionality automatically,
//  i.e., your view is always scolling to the current cell.

//
// Keyboard shortcuts: Alt-I and Alt-down (works with single cells also -- this is useful!)



define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events'
], function (Jupyter, $, requirejs, events) {
    "use strict";

    function scrollIntoRunningCell(evt, data) {
        $('.running')[0].scrollIntoView({behavior: 'smooth', inline: 'center'});
    }
    
    // Go to Running cell shortcut
    var go_to_running_cell = {
        'Alt-I': {
            help: 'Go to first executing cell',
            help_index: 'zz',
            handler: function (event) {
                setTimeout(function () {
                    // Find running cell and click the first one
                    if ($('.running').length > 0) {
                        //alert("found running cell");
                        $('.running')[0].scrollIntoView();
                    }
                }, 250);
                return false;
            }
        },

        'Meta-[': {
            help: 'Follow Executing Cell On',
            help_index: 'zz',
            handler: function (event) {
                Jupyter.notebook.events.on('finished_execute.CodeCell', scrollIntoRunningCell);
                //console.log("Follow Executing Cell On")
                return false;
            }
        },

        'Meta-]': {
            help: 'Follow Executing Cell Off',
            help_index: 'zz',
            handler: function (event) {
                Jupyter.notebook.events.off('finished_execute.CodeCell', scrollIntoRunningCell);
                //console.log("Follow Executing Cell Off")
                return false;
            }
        }
    }

    function load_ipython_extension() {
        Jupyter.keyboard_manager.command_shortcuts.add_shortcuts(go_to_running_cell);
        console.log("[go to current running cell] loaded")
    }

    return {
        load_ipython_extension: load_ipython_extension,
    };

});
