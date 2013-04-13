
//  Copyright (C) 2013  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Breakpoint extension - execute notebook cells until breakpoint
// If a breakpoint is set at the currently selected cell, run cell anyway, 
// allowing to step through the notebook
//============================================================================

/**
 * Toggle breakpoint marker on/off
 * 
 * @param {Object} current codecell
 * @param {Boolean} turn breakpoint on/off 
 */
function makeMarker(cell,val) {
    cell.metadata.run_control.breakpoint = val ;   
    var input = cell.element.find('div.breakpoint');
    if (val == true) { 
        input.html('●');
    } else {
        input.html('&nbsp&nbsp');
    }
}

/**
 * Clear all breakpoints in notebook
 * 
 */
var clear_breakpoints = function() {
    var cells = IPython.notebook.get_cells();
    for(var i in cells){
        var cell = cells[i];
        if ((cell instanceof IPython.CodeCell)) { 
            if (cell.metadata.run_control == undefined){cell.metadata.run_control = {}} {
                makeMarker(cell,false);
            }
        }
    }
};

/**
 * Run code cells from current cell to next breakpoint
 * 
 */
var run_breakpoint = function () {
    var start = IPython.notebook.get_selected_index();
    var end = IPython.notebook.ncells()
    for (var i=start; i<end; i++) { 
        IPython.notebook.select(i);
        var cell = IPython.notebook.get_selected_cell();
        if ((cell instanceof IPython.CodeCell)) { 
            if (cell.metadata.run_control != undefined) {
                if (cell.metadata.run_control.breakpoint == true && i > start) {
                    break; 
                } 
            } 
            IPython.notebook.execute_selected_cell({add_new:false});
        }
    }
};

/**
 * Loop through all code cells to find which input prompt was clicked
 * and turn breakpoint on/off
 * 
 * @param {Object} current notebook cell
 */
function clickPrompt(cell) {
    if ((cell instanceof IPython.CodeCell)) { 
        var prompt = cell.element.find('div.input_prompt');
        if (cell.metadata.run_control == undefined){cell.metadata.run_control = {}}
            makeMarker(cell,!cell.metadata.run_control.breakpoint);
    }
};


/**
 * Add run control buttons to toolbar
 * 
 */
var init_breakpoint = function(){
    IPython.toolbar.add_buttons_group([
                {
                    id : 'run_c',
                    label : 'Run Cell',
                    icon : 'ui-icon-seek-next',
                    callback : function () {
                        IPython.notebook.execute_selected_cell();
                        }
                },
                {
                    id : 'run_cb',
                    label : 'Run Cells Below',
                    icon : 'ui-icon-seek-end',
                    callback : function () {
                        IPython.notebook.execute_cells_below();
                        }
                },
                {
                    id : 'run_a',
                    label : 'Run All',
                    icon : 'ui-icon-play',
                    callback : function () {
                        IPython.notebook.execute_all_cells();
                        }
                },
                {
                    id : 'interrupt_b',
                    label : 'Interrupt',
                    icon : 'ui-icon-stop',
                    callback : function () {
                        IPython.notebook.kernel.interrupt();
                        }
                },
                {
                    id : 'run_until_break',
                    label : 'Run Until Breakpoint',
                    icon : 'ui-icon-bullet',
                    callback : run_breakpoint
                },
                {
                    id : 'clear_all_breakpoints',
                    label : 'Clear all Breakpoints',
                    icon : 'ui-icon-radio-off',
                    callback : clear_breakpoints
                }                
         ]);
    init_input_prompt();
};

/**
 * Mark cells with breakpoint enabled
 * 
 */
var init_input_prompt = function () {
    var cells = IPython.notebook.get_cells();
    for(var i in cells){
        var cell = cells[i];
        if ((cell instanceof IPython.CodeCell)) {
            if (cell.metadata.run_control != undefined) {
                    makeMarker(cell,cell.metadata.run_control.breakpoint);
            }
        }
    }   
};

/**
 * Add div.breakpoint to a new cell and make it clickable
 * 
 * @param {Object} event
 * @param {Object} current notebook cell
 */
var insert_cell = function (event,cell) {
    if ((cell instanceof IPython.CodeCell)) {
        var prompt = cell.element.find('div.input_prompt');
        prompt.after('<div class="breakpoint" style="color: rgb(136, 34, 34);"></div');
        prompt.click( function() {clickPrompt(cell); } ) 
    }
};

$([IPython.events]).on('insert_cell.Notebook',insert_cell);

$([IPython.events]).on('notebook_loaded.Notebook',init_breakpoint);

console.log("Breakpoint extension loaded correctly")
