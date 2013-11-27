//  Copyright (C) 2013  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------
//
// Breakpoints extension - allow execute of notebook cells until a breakpoint
// is encountered. If a breakpoint is set at the currently selected cell, 
// run cell anyway, allowing to step through the notebook

"using strict";

var cellstate_extension = (function() {
    var breakpointKey = { "Alt-B" : function(){toggle_breakpoint();} };

    function setMarker() {
      var marker = document.createElement("div");
      marker.style.color = "#822";
      marker.innerHTML = "●";
      return marker;
    }

    /**
     * Concatenate associative array objects
     *
     * Source: http://stackoverflow.com/questions/2454295/javascript-concatenate-properties-from-multiple-objects-associative-array
     */
    function collect() {
    var ret = {};
    var len = arguments.length;
    for (var i=0; i<len; i++) {
        for (p in arguments[i]) {
            if (arguments[i].hasOwnProperty(p)) {
                ret[p] = arguments[i][p];
            }
        }
    }
    return ret;
}

    /**
     * Toggle breakpoint marker on/off
     * 
     * @param {Object} current codecell
     * @param {Boolean} turn breakpoint on/off 
     */
    function makeMarker(cell,val) {
        if (cell.metadata.run_control == undefined){
            cell.metadata.run_control = {};
        }

        if (val == undefined) { val = false; }
        
        cell.metadata.run_control.breakpoint = val;  
        cell.code_mirror.setGutterMarker(0, "breakpoints", val ?  setMarker(): null);
};

    /**
     * Clear all breakpoints in notebook
     * 
     */
    function clear_breakpoints() {
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
     * Run code cells from current cell until next breakpoint
     * 
     */
    function run_breakpoint() {
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
     * Toggle breakpoint in current cell
     * 
     */
    function toggle_breakpoint() {
        var cell = IPython.notebook.get_selected_cell();
        if ((cell instanceof IPython.CodeCell)) {
            var val;
            if (cell.metadata.run_control == undefined){
                val = true;
            } else {
                val = !cell.metadata.run_control.breakpoint;
            }
            makeMarker(cell,val);
        }
    };

    /**
     * Add run control buttons to toolbar
     * 
     */
    IPython.toolbar.add_buttons_group([
            {
                id : 'run_c',
                label : 'Run current cell',
                icon : 'icon-step-forward',
                callback : function () {
                    IPython.notebook.execute_selected_cell();
                    }
            },
            {
                id : 'run_ca',
                label : 'Run from top to current cell',
                icon : 'icon-fast-forward',
                callback : function () {
                    IPython.notebook.execute_cells_above();
                    } 
            },
            {
                id : 'run_cb',
                label : 'Run from current cell to end',
                icon : 'icon-forward',
                callback : function () {
                    IPython.notebook.execute_cells_below();
                    }
            },
            {
                id : 'run_a',
                label : 'Run All',
                icon : 'icon-play',
                callback : function () {
                    IPython.notebook.execute_all_cells();
                    }
            },
            {
                id : 'interrupt_b',
                label : 'Interrupt',
                icon : 'icon-stop',
                callback : function () {
                    IPython.notebook.kernel.interrupt();
                    }
            },
            {
                id : 'run_until_break',
                label : 'Run until next breakpoint',
                icon : 'icon-play-circle',
                callback : run_breakpoint
            },
            {
                id : 'set_breakpoint',
                label : 'Toggle Breakpoint',
                icon : 'icon-remove-sign',
                callback : toggle_breakpoint
            },                
            {
                id : 'clear_all_breakpoints',
                label : 'Clear all Breakpoints',
                icon : 'icon-remove',
                callback : clear_breakpoints
            }
         ]);

    /**
     * Register newly created cell TODO: needed here ??
     *
     * @param {Object} event
     * @param {Object} nbcell notebook cell
     */
    create_cell = function (event,nbcell,nbindex) {
        var cell = nbcell.cell;
        if ((cell instanceof IPython.CodeCell)) {
            cell.code_mirror.on("gutterClick", changeEvent);
            var gutters = cell.code_mirror.getOption('gutters');
            cell.code_mirror.setOption('gutters', [gutters, "breakpoints" ]);
            var keys = cell.code_mirror.getOption('extraKeys');
            cell.code_mirror.setOption('extraKeys', collect(keys, breakpointKey ));
            makeMarker(cell,false,0);
        }
    };

    /**
     * Register newly created cell TODO: needed here ??
     *
     * @param {Object} event
     * @param {Object} nbcell notebook cell
     */
    
    function changeEvent(cm,n) {
        var val;
        var cell = IPython.notebook.get_selected_cell();
        if (cell.code_mirror != cm) {
            console.log("other cell");
            var cells = IPython.notebook.get_cells();
            for(var i in cells){
                var cell = cells[i];
                if (cell.code_mirror == cm ) { break; }
            }
        }
            
        if (cell.metadata.run_control == undefined){
            val = true;
        } else {
            val = !cell.metadata.run_control.breakpoint;
        }
        makeMarker(cell,val);
    }
    
    var cells = IPython.notebook.get_cells();
    for(var i in cells){
        var cell = cells[i];
        if ((cell instanceof IPython.CodeCell)) {
            cell.code_mirror.on("gutterClick", changeEvent);
            var gutters = cell.code_mirror.getOption('gutters');
            cell.code_mirror.setOption('gutters', [gutters, "breakpoints" ]);
            var keys = cell.code_mirror.getOption('extraKeys');
            cell.code_mirror.setOption('extraKeys', collect(keys, breakpointKey ));
            if (cell.metadata.run_control != undefined) {
                    makeMarker(cell,cell.metadata.run_control.breakpoint);
            }
        }
    };
    
    $([IPython.events]).on('create.Cell',create_cell);
})();
