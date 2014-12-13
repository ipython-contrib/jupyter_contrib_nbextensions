// Add toolbar buttons for extended code execution commands

// - Execute single cell
// - Execute from top to current cell
// - Execute from current cell to bottom
// - Execute all
// - Execute all, ignore exceptions
// - Execute marked codecells
// - Stop execution

define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'codemirror/lib/codemirror',
    'codemirror/addon/fold/foldgutter',
    'codemirror/addon/fold/foldcode',
    'codemirror/addon/fold/brace-fold',
    'codemirror/addon/fold/indent-fold'
],   function(IPython, $, require, events, codemirror) {
    "use strict";
    if (IPython.version[0] < 3) {
        console.log("This extension requires IPython 3.x");
        return
    }

    /**
     * Hide or show a cell
     *
     * @param cell
     * @param io 'i' for cell input, 'o' for cell output
     * @param showme {Boolean} show (true) or hide (false) cell
     */
     function showCell(cell, io, showme) {
        if ( io == 'i') {
            if ( showme == true) {
                cell.element.find("div.input").show();
                cell.metadata.hide_input = false;
            } else {
                cell.element.find("div.input").hide();
                cell.metadata.hide_input = true;
            }
        } else {
            if ( showme == true) {
                cell.element.find('div.output').show();
                cell.metadata.hide_output = false;
            } else {
                cell.element.find('div.output').hide();
                cell.metadata.hide_output = true;
            }
        }
    }

    /**
     * Hide or show input of all marked code cells
     *
     * @param {Boolean} show show (true) or hide (false)
     */
    function show_input(show) {
        var ncells = IPython.notebook.ncells();
        var cells = IPython.notebook.get_cells();
        for (var i=0; i<ncells; i++) { 
            var _cell=cells[i];
            if (_cell.metadata.run_control !== undefined && _cell.metadata.run_control.marked === true )
                showCell(_cell, 'i', show);
        }
    }

    /**
     * Hide or show output area of all marked code cells
     *
     * @param {Boolean} show show (true) or hide (false)
     */
    function show_output(show) {
        var ncells = IPython.notebook.ncells();
        var cells = IPython.notebook.get_cells();
        for (var i=0; i<ncells; i++) { 
            var _cell=cells[i];
            if (_cell.metadata.run_control != undefined && _cell.metadata.run_control.marked == true )
                showCell(_cell, 'o', show);
        } 
    }

    /**
     * Run code cells marked in metadata
     * 
     */
    function run_marked() {
        var current = IPython.notebook.get_selected_index();
        var end = IPython.notebook.ncells();
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
    }

        /**
         *
         * @param cell
         * @param value
         */
    function setCell(cell,value) {
        if (cell.metadata.run_control == undefined) cell.metadata.run_control = {};
        if (cell.metadata.run_control.marked == undefined) cell.metadata.run_control.marked = false;
        if (value == undefined) value = !cell.metadata.run_control.marked;
        var g=cell.code_mirror.getGutterElement();
        if (value == false) {
            cell.metadata.run_control.marked = false;
            $(g).css({"background-color": "#f5f5f5"});
        } else {
            cell.metadata.run_control.marked = true;
            $(g).css({"background-color": "#0f0"});
        }
    }

        /**
         * Toggle code cell marker
         */
    function toggle_marker() {
        var cell = IPython.notebook.get_selected_cell();
        setCell(cell, undefined);
        cell.focus_cell();
    }

        /**
         *
         */
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

        /**
         *
         */
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
     * @param cm
     * @param line
     * @param gutter
     */
    function changeEvent(cm,line,gutter) {
        var cmline = cm.doc.children[0].lines[line];
        /* clicking on gutterMarkers should not change selection */
        if (cmline.gutterMarkers != undefined) return;
        
        var cell = IPython.notebook.get_selected_cell();
        if (cell.code_mirror != cm) {
            var cells = IPython.notebook.get_cells();
            for(var i in cells){
                cell = cells[i];
                if (cell.code_mirror == cm ) { break; }
            }
        }
        if (cell.metadata.run_control == undefined)
            cell.metadata.run_control = {};
        setCell(cell, !cell.metadata.run_control.marked);
    }

    /**
     * Register newly created cell
     *
     * @param {Object} event
     * @param {Object} nbcell notebook cell
     */
    var create_cell = function (event,nbcell) {
        var cell = nbcell.cell;
        if ((cell.cell_type == "code")) {
            cell.code_mirror.on("gutterClick", changeEvent);
        }
    };

    /**
     *
     * @param cell
     * @returns {boolean}
     */
    var is_marked = function(cell) {
        if (cell.metadata.run_control != undefined) {
            if (cell.metadata.run_control.marked == true) {
                return true;
            }
        }
        return false;
    };

    /**
     *  Move marked cells one up, don't have one marked cell overtake another one
     *
     */
    var move_marked_up = function() {
        var ncells = IPython.notebook.ncells();
        for (var i=1; i<ncells; i++) {
            var cells = IPython.notebook.get_cells();
            if ((cells[i].cell_type == "code")) {
                if ( is_marked(cells[i]) && !is_marked(cells[i-1]) ) {
                        IPython.notebook.move_cell_up(i);
                }
            }
        }
    };

    /*
     * Move marked code cells one up
     *
     */
    var move_marked_down = function() {
        var ncells = IPython.notebook.ncells();
        for (var i=ncells-2; i>=0; i--) {
            var cells = IPython.notebook.get_cells();
            if ((cells[i].cell_type == "code")) {
                if ( is_marked(cells[i]) && !is_marked(cells[i+1]) ) {
                    IPython.notebook.move_cell_down(i);
                }
            }
        }
    };

    /**
     * Execute all cells and ignore exceptions
     * ATTN: Requires custom patch to IPython
     *
     */
    var execute_all_cells_skip_exceptions = function () {
        for (var i=0; i < IPython.notebook.ncells(); i++) {
            IPython.notebook.select(i);
            var cell = IPython.notebook.get_selected_cell();
            cell.execute(skip_exceptions=true);
        }
    };

    /**
     * Create floating toolbar
     *
     */
    var create_runtools_div = function () {
        var btn = '<div class="btn-toolbar">\
            <div class="btn-group">\
                <button type="button" id="run_c" class="btn btn-primary fa fa-step-forward"></button>\
                <button type="button" id="run_ca" class="btn btn-primary fa icon-run-to"></button>\
                <button type="button" id="run_cb" class="btn btn-primary fa icon-run-from"></button>\
                <button type="button" id="run_a" class="btn btn-primary fa icon-run-all"></button>\
                <button type="button" id="run_af" class="btn btn-primary fa icon-run-all-forced"></button>\
                <button type="button" id="run_m" class="btn btn-primary fa icon-run-marked"></button>\
                <button type="button" id="interrupt_b" class="btn btn-primary fa fa-stop"></button>\
            </div>\
            <div class="btn-group">\
                <button type="button" id="mark_toggle" class="btn btn-primary fa icon-mark-toggle"></button>\
                <button type="button" id="mark_all" class="btn btn-primary fa icon-mark-all"></button>\
                <button type="button" id="mark_none" class="btn btn-primary fa icon-mark-none"></button>\
            </div>\
            <div class="btn-group">\
                <button type="button" id="show_input" class="btn btn-primary fa icon-show-input"></button>\
                <button type="button" id="hide_input" class="btn btn-primary fa icon-hide-input"></button>\
                <button type="button" id="show_output" class="btn btn-primary fa icon-show-output"></button>\
                <button type="button" id="hide_output" class="btn btn-primary fa icon-hide-output"></button>\
            </div>\
            <div class="btn-group">\
                <button type="button" id="up_marked" class="btn btn-primary fa fa-arrow-up"></button>\
                <button type="button" id="down_marked" class="btn btn-primary fa fa-arrow-down"></button>\
            </div>\
            </div>';

        var runtools_wrapper = $('<div id="runtools-wrapper">')
           .text("Runtools")
           .append(btn)
           .draggable()
           .append("</div>");

        $("#header").append(runtools_wrapper);
    
        $('#run_c').on('click', function (e) { IPython.notebook.execute_cell();  });
        $("#run_c").tooltip({ title : 'Run current cell' , delay: {show: 500, hide: 100}});
        $('#run_ca').on('click', function (e) { IPython.notebook.execute_cells_above(); IPython.notebook.select_next(); });
        $("#run_ca").tooltip({ title : 'Run cells above (Alt-A)' , delay: {show: 500, hide: 100}});
        $('#run_cb').on('click', function (e) { IPython.notebook.execute_cells_below();  });
        $("#run_cb").tooltip({ title : 'Run cells below (Alt-B)' , delay: {show: 500, hide: 100}});
        $('#run_a').on('click', function (e) { IPython.notebook.execute_all_cells();  });
        $("#run_a").tooltip({ title : 'Run all cells (Alt-X)' , delay: {show: 500, hide: 100}});
        $('#run_af').on('click', function (e) { execute_all_cells_skip_exceptions();  });
        $("#run_af").tooltip({ title : 'Run all - skip exceptions' , delay: {show: 500, hide: 100}});
        $('#run_m').on('click', function (e) { run_marked();  });
        $("#run_m").tooltip({ title : 'Run marked codecells (Alt-R)' , delay: {show: 500, hide: 100}});
        $('#interrupt_b').on('click', function (e) { IPython.notebook.kernel.interrupt(); });
        $('#interrupt_b').tooltip({ title : 'Interrupt' , delay: {show: 500, hide: 100}});

        $('#mark_toggle').on('click', function (e) { toggle_marker()  });
        $('#mark_toggle').tooltip({ title : 'Toggle codecell marker (Alt-T)' , delay: {show: 500, hide: 100}});
        $('#mark_all').on('click', function (e) { mark_all()  });
        $('#mark_all').tooltip({ title : 'Mark all codecells (Alt-M)' , delay: {show: 500, hide: 100}});
        $('#mark_none').on('click', function (e) { mark_none()  });
        $('#mark_none').tooltip({ title : 'Unmark all codecells (ALt-U)' , delay: {show: 500, hide: 100}});

        $('#show_input').on('click', function (e) { show_input(true)  });
        $('#show_input').tooltip({ title : 'Show input area of codecell' , delay: {show: 500, hide: 100}});
        $('#hide_input').on('click', function (e) { show_input(false)  });
        $('#hide_input').tooltip({ title : 'Hide input area of codecell' , delay: {show: 500, hide: 100}});
        $('#show_output').on('click', function (e) { show_output(true)  });
        $('#show_output').tooltip({ title : 'Show output area of codecell' , delay: {show: 500, hide: 100}});
        $('#hide_output').on('click', function (e) { show_output(false)  });
        $('#hide_output').tooltip({ title : 'Hide output area of codecell' , delay: {show: 500, hide: 100}});

        $('#up_marked').on('click', function (e) { move_marked_up()  });
        $('#up_marked').tooltip({ title : 'Move marked codecells up' , delay: {show: 500, hide: 100}});
        $('#down_marked').on('click', function (e) { move_marked_down()  });
        $('#down_marked').tooltip({ title : 'Move marked codecells down' , delay: {show: 500, hide: 100}});
    };

    /**
     * Show/hide toolbar
     *
     */
    var toggle_toolbar = function() {
        $("#runtools-wrapper").toggle();
        
        if ($("#runtools-wrapper").length === 0)
            create_runtools_div()
    };
    
    /**
     * Add run control buttons to toolbar
     * 
     */
    IPython.toolbar.add_buttons_group([
            {
                id : 'toggle_runtools',
                label : 'Toggle Runtools Toolbar',
                icon : 'fa-cogs',
                callback : function () {
                    toggle_toolbar();
                    }
            }
         ]);

    /**
     * Add CSS file
     *
     * @param name filename
     */
    var load_css = function (name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);
      };

    /**
     *  Add keyboard shortcuts
     *
     */
    var add_command_shortcuts = {
            'alt-a' : {
                help    : 'Execute cells above',
                help_index : 'xa',
                handler : function (event) {
                    var mode = IPython.notebook.get_selected_cell().mode;
                    IPython.notebook.execute_cells_above();
                    IPython.notebook.select_next();
                    var type = IPython.notebook.get_selected_cell().cell_type;
                    if (mode == "edit" && type == "code") IPython.notebook.edit_mode();
                    return false;
                }
            },
            'alt-b' : {
                help    : 'Execute cells below',
                help_index : 'aa',
                handler : function (event) {
                    var mode = IPython.notebook.get_selected_cell().mode;               
                    IPython.notebook.execute_cells_below();
                    var type = IPython.notebook.get_selected_cell().cell_type;
                    if (mode == "edit" && type == "code") IPython.notebook.edit_mode();                   
                    return false;
                }
            }, 
            'alt-t' : {
                help    : 'Toggle marker',
                help_index : 'mt',
                handler : function (event) {
                    toggle_marker();
                    return false;
                }
            }, 
            'alt-m' : {
                help    : 'Mark all codecells',
                help_index : 'ma',
                handler : function (event) {
                    mark_all();
                    return false;
                }
            }, 
            'alt-u' : {
                help    : 'Unmark all codecells',
                help_index : 'mu',
                handler : function (event) {
                    mark_none();
                    return false;
                }
            }, 
            'alt-r' : {
                help    : 'Run marked cells',
                help_index : 'rm',
                handler : function (event) {
                    run_marked();
                    return false;
                }
            }, 
            'alt-x' : {
                help    : 'Run all cells',
                help_index : 'ra',
                handler : function (event) {
                    var pos = IPython.notebook.element.scrollTop();
                    console.log("prev:",pos);
                    var ic = IPython.notebook.get_selected_index();                    
                    IPython.notebook.execute_all_cells();
                    IPython.notebook.select(ic);
                    IPython.notebook.element.animate({scrollTop:pos}, 100);
                    return false;
                }
            }, 
            'alt-f' : {
                help    : 'Run all cells - skip exceptions',
                help_index : 'rf',
                handler : function (event) {
                    execute_all_cells_skip_exceptions();
                    return false;
                }
            }
        };
    IPython.keyboard_manager.command_shortcuts.add_shortcuts(add_command_shortcuts);
    IPython.keyboard_manager.edit_shortcuts.add_shortcuts(add_command_shortcuts);

    /**
     * Add event if user clicks on codemirror gutter
     *
     */
    var ncells = IPython.notebook.ncells();
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
     * Restore hide/show status after reload
     *
     */
    for (i=0; i<ncells; i++) {
        var _cell=cells[i];
        if (_cell.metadata.hide_input != undefined && _cell.metadata.hide_input == true )
            showCell(_cell, 'i',false);
        if (_cell.metadata.hide_output != undefined && _cell.metadata.hide_output == true )
            showCell(_cell, 'o',false);
        }
    $([IPython.events]).on('create.Cell',create_cell);
    load_css('./runtools.css');
});
