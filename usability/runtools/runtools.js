// Add toolbar buttons for extended code execution commands

// - Execute single cell
// - Execute from top to current cell
// - Execute from current cell to bottom
// - Execute all
// - Execute all, ignore exceptions
// - Execute marked codecells
// - Stop execution

"using strict";

var runcontrol_extension = (function() {
    
    /**
     * Run code cells marked in metadata
     * 
     */
    function run_marked() {
        var current = IPython.notebook.get_selected_index();
        var end = IPython.notebook.ncells()
        for (var i=0; i<end; i++) { 
            IPython.notebook.select(i);
            var cell = IPython.notebook.get_selected_cell();
            if ((cell instanceof IPython.CodeCell)) { 
                if (cell.metadata.run_control != undefined) {
                    if (cell.metadata.run_control.marked == true ) {
                        IPython.notebook.execute_cell();
                    } 
                } 
            }
        }
        IPython.notebook.select(current);
    };

    function setCell(cell,value) {
        if (cell.metadata.run_control == undefined) 
            {
            cell.metadata.run_control = {};
            }
         
        var g=cell.code_mirror.getGutterElement();
        if (value == false) {
            cell.metadata.run_control.marked = value;
            $(g).css({"background-color": "#f5f5f5"});
        } else {
            cell.metadata.run_control.marked = value;
            $(g).css({"background-color": "#0f0"});
        }
    };
    function toggle_marker() {
        var cell = IPython.notebook.get_selected_cell();
        setCell(cell, !cell.metadata.run_control.marked);
        cell.focus_cell();

    }

    function mark_all() {
        var cell = IPython.notebook.get_selected_cell();
        var ncells = IPython.notebook.ncells()
        var cells = IPython.notebook.get_cells();
        for (var i=0; i<ncells; i++) { 
            var _cell=cells[i];
            setCell(_cell, true);
        }
        cell.focus_cell();        
    }

    function mark_none() {
        var cell = IPython.notebook.get_selected_cell();
        var ncells = IPython.notebook.ncells()
        var cells = IPython.notebook.get_cells();
        for (var i=0; i<ncells; i++) { 
            var _cell=cells[i];
            setCell(_cell, false);
        }
        cell.focus_cell();        
    }

    /**
     * Change event to mark/umark cell
     *
     */
    function changeEvent(cm,line,gutter) {
        var cmline = cm.doc.children[0].lines[line];
        /* clicking on gutterMarkers should not change selection */
        if (cmline.gutterMarkers != undefined) return;
        
        var cell = IPython.notebook.get_selected_cell();
        if (cell.code_mirror != cm) {
            var cells = IPython.notebook.get_cells();
            for(var i in cells){
                var cell = cells[i];
                if (cell.code_mirror == cm ) { break; }
            }
        }

        if (cell.metadata.run_control == undefined) cell.metadata.run_control = {};
        setCell(cell, !cell.metadata.run_control.marked);
    }

    /**
     * Register newly created cell
     *
     * @param {Object} event
     * @param {Object} nbcell notebook cell
     */
    create_cell = function (event,nbcell) {
        var cell = nbcell.cell;
        if ((cell.cell_type == "code")) {
            cell.code_mirror.on("gutterClick", changeEvent);
        }
    };

    var ncells = IPython.notebook.ncells()
    var cells = IPython.notebook.get_cells();
    for (var i=0; i<ncells; i++) { 
        var cell=cells[i];
        if ((cell.cell_type == "code")) {
            cell.code_mirror.on("gutterClick", changeEvent);

            if (cell.metadata.run_control != undefined) {
                if (cell.metadata.run_control.marked == true) {
                    var g=cell.code_mirror.getGutterElement();
                    $(g).css({"background-color": "#0f0"});
                }
            }
        }
    }
    
    /**
     * Add run control buttons to toolbar
     * 
     */
    IPython.toolbar.add_buttons_group([
            {
                id : 'run_c',
                label : 'Execute current cell',
                icon : 'icon-angle-right',
                callback : function () {
                    IPython.notebook.execute_cell();
                    }
            },
            {
                id : 'run_ca',
                label : 'Run from top to current cell',
                icon : 'icon-run-to',
                callback : function () {
                    IPython.notebook.execute_cells_above();
                    } 
            },
            {
                id : 'run_cb',
                label : 'Run from current cell to end',
                icon : 'icon-run-from',
                callback : function () {
                    IPython.notebook.execute_cells_below();
                    }
            },
            {
                id : 'run_a',
                label : 'Run All',
                icon : 'icon-run-all',
                callback : function () {
                    IPython.notebook.execute_all_cells();
                    }
            },
            {
                id : 'run_af',
                label : 'Run All, ignore exceptions',
                icon : 'icon-run-all-forced',
                callback : function () {
                    IPython.notebook.execute_all_cells(true);
                    }
            },
            {
                id : 'run_m',
                label : 'Run Marked',
                icon : 'icon-run-marked',
                callback : function () {
                    run_marked();
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
         ]);

    IPython.toolbar.add_buttons_group([
            {
                id : 'mark_toggle',
                label : 'Toggle codecell marker',
                icon : 'icon-mark-toggle',
                callback : function () {
                    toggle_marker();
                    }
            },
            {
                id : 'mark_all',
                label : 'Mark all codecells',
                icon : 'icon-mark-all',
                callback : function () {
                    mark_all();
                    }
            },
            {
                id : 'mark_none',
                label : 'Unmark all codecells',
                icon : 'icon-mark-none',
                callback : function () {
                    mark_none();
                    }
            },
         ]);
            
    $([IPython.events]).on('create.Cell',create_cell);
    $("head").append($("<link rel='stylesheet' href='/static/custom/usability/runtools/runtools.css' type='text/css'  />"));    
})();
