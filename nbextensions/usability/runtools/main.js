// Add toolbar buttons for extended code execution commands


define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'codemirror/lib/codemirror',
    'codemirror/addon/fold/foldgutter'
],   function(IPython, $, require, events, codemirror) {
    "use strict";

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
        var ncells = IPython.notebook.ncells();
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
        var ncells = IPython.notebook.ncells();
        var cells = IPython.notebook.get_cells();
        for (var i=0; i<ncells; i++) { 
            var _cell=cells[i];
            setCell(_cell, false);
        }
        cell.focus_cell();        
    }

    /**
     * Change event to mark/unmark cell
     *
     * @param cm codemirror instance
     * @param line current line
     * @param gutter not used
     */
    function changeEvent(cm,line, gutter) {
        var cmline = cm.doc.children[0].lines[line];
        /* clicking on gutterMarkers should not change selection */
        if (cmline.gutterMarkers != undefined) return;
        
        var cell = IPython.notebook.get_selected_cell();
        if (cell.code_mirror != cm) {
            var ncells = IPython.notebook.ncells();
            var cells = IPython.notebook.get_cells();
        for (var i=0; i<ncells; i++) {
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
            if ((cell instanceof IPython.CodeCell)) {
                var gutters = cell.code_mirror.getOption('gutters');
                var found = jQuery.inArray("CodeMirror-foldgutter", gutters);
                if (found == -1) {
                    cell.code_mirror.setOption('gutters', [gutters, "CodeMirror-foldgutter"]);
                    cell.code_mirror.refresh();
                }
            }

        }
    };

    /**
     *
     * @param cell cell to be tested
     * @returns {boolean} true if marked
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
                if (is_marked(cells[i]) && !is_marked(cells[i + 1])) {
                    IPython.notebook.move_cell_down(i);
                }
            }
        }
    };

    function makeLockMarker() {
        var marker = document.createElement("div");
        marker.style.color = "#822";
        marker.innerHTML = '<i class="fa fa-lock" /i>';
        return marker;
    }



    var lock_cell = function() {
        var ncells = IPython.notebook.ncells();
        for (var i=ncells-2; i>=0; i--) {
            var cells = IPython.notebook.get_cells();
            if ((cells[i].cell_type === "code") && is_marked(cells[i])) {
                cells[i].code_mirror.setOption('readOnly', true);
                cells[i].metadata.deletable = false;
                cells[i].metadata.locked = true;
                cells[i].code_mirror.setGutterMarker(0,"CodeMirror-foldgutter", makeLockMarker())
            }
        }
    };

    var unlock_cell = function() {
        var ncells = IPython.notebook.ncells();
        for (var i=ncells-2; i>=0; i--) {
            var cells = IPython.notebook.get_cells();
            if ((cells[i].cell_type === "code" && is_marked(cells[i]))) {
                cells[i].code_mirror.setOption('readOnly', false);
                cells[i].metadata.deletable = true;
                cells[i].metadata.locked = false;
                cells[i].code_mirror.setGutterMarker(0,"CodeMirror-foldgutter", null)
                }
            }
        };


    /**
     * Execute all cells and don't stop on errors
     *
     */
    var execute_all_cells_ignore_errors = function () {
        for (var i=0; i < IPython.notebook.ncells(); i++) {
            IPython.notebook.select(i);
            var cell = IPython.notebook.get_selected_cell();
            cell.execute(false);
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
                <button type="button" id="lock_marked" class="btn btn-primary fa fa-lock"></button>\
                <button type="button" id="unlock_marked" class="btn btn-primary fa fa-unlock"></button>\
            </div>\
            </div>';

        var runtools_wrapper = $('<div id="runtools-wrapper">')
           .text("Runtools")
           .append(btn)
           .draggable()
           .append("</div>");

        $("#header").append(runtools_wrapper);
        $("#runtools-wrapper").css({'position' : 'absolute'});
    
        $('#run_c').on('click', function(e) { IPython.notebook.execute_cell(); e.target.blur() })
           .tooltip({ title : 'Run current cell' , delay: {show: 500, hide: 100}});
        $('#run_ca').on('click', function(e) { IPython.notebook.execute_cells_above(); IPython.notebook.select_next(); e.target.blur() })
            .tooltip({ title : 'Run cells above (Alt-A)' , delay: {show: 500, hide: 100}});
        $('#run_cb').on('click', function(e) { IPython.notebook.execute_cells_below(); e.target.blur() })
            .tooltip({ title : 'Run cells below (Alt-B)' , delay: {show: 500, hide: 100}});
        $('#run_a').on('click', function(e) { IPython.notebook.execute_all_cells(); e.target.blur() })
            .tooltip({ title : 'Run all cells (Alt-X)' , delay: {show: 500, hide: 100}});
        $('#run_af').on('click', function(e) { execute_all_cells_ignore_errors(); e.target.blur() })
            .tooltip({ title : 'Run all - ignore errors' , delay: {show: 500, hide: 100}});
        $('#run_m').on('click', function(e) { run_marked(); e.target.blur() })
            .tooltip({ title : 'Run marked codecells (Alt-R)' , delay: {show: 500, hide: 100}});
        $('#interrupt_b').on('click', function(e) { IPython.notebook.kernel.interrupt(); e.target.blur() })
            .tooltip({ title : 'Interrupt' , delay: {show: 500, hide: 100}});

        $('#mark_toggle').on('click', function() { toggle_marker()  })
        .tooltip({ title : 'Toggle codecell marker (Alt-T)' , delay: {show: 500, hide: 100}});
        $('#mark_all').on('click', function() { mark_all()  })
        .tooltip({ title : 'Mark all codecells (Alt-M)' , delay: {show: 500, hide: 100}});
        $('#mark_none').on('click', function() { mark_none()  })
            .tooltip({ title : 'Unmark all codecells (Alt-U)' , delay: {show: 500, hide: 100}});

        $('#show_input').on('click', function() { show_input(true); this.blur() })
            .tooltip({ title : 'Show input area of codecell' , delay: {show: 500, hide: 100}});
        $('#hide_input').on('click', function() { show_input(false); this.blur()  })
            .tooltip({ title : 'Hide input area of codecell' , delay: {show: 500, hide: 100}});
        $('#show_output').on('click', function() { show_output(true); this.blur()  })
            .tooltip({ title : 'Show output area of codecell' , delay: {show: 500, hide: 100}});
        $('#hide_output').on('click', function() { show_output(false); this.blur()  })
            .tooltip({ title : 'Hide output area of codecell' , delay: {show: 500, hide: 100}});

        $('#up_marked').on('click', function() { move_marked_up(); this.blur()  })
            .tooltip({ title : 'Move marked codecells up' , delay: {show: 500, hide: 100}});
        $('#down_marked').on('click', function() { move_marked_down(); this.blur()  })
            .tooltip({ title : 'Move marked codecells down' , delay: {show: 500, hide: 100}});
        $('#lock_marked').on('click', function() { lock_cell(); this.blur()  })
            .tooltip({ title : 'Lock codecells' , delay: {show: 500, hide: 100}});
        $('#unlock_marked').on('click', function() { unlock_cell(); this.blur()  })
            .tooltip({ title : 'Unlock codecells' , delay: {show: 500, hide: 100}});
    };

    /**
     * Show/hide toolbar
     *
     */
    var toggle_toolbar = function() {
        var dom = $("#runtools-wrapper");

        if (dom.is(':visible')) {
            $('#toggle_runtools').removeClass('active').blur();
            dom.hide();
        } else {
            $('#toggle_runtools').addClass('active');
            dom.show();
        }

        if (dom.length === 0) {
            create_runtools_div()
        }
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
    $("#toggle_runtools").css({'outline' : 'none'});

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
                handler : function() {
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
                handler : function() {
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
                handler : function() {
                    toggle_marker();
                    return false;
                }
            }, 
            'alt-m' : {
                help    : 'Mark all codecells',
                help_index : 'ma',
                handler : function() {
                    mark_all();
                    return false;
                }
            }, 
            'alt-u' : {
                help    : 'Unmark all codecells',
                help_index : 'mu',
                handler : function() {
                    mark_none();
                    return false;
                }
            }, 
            'alt-r' : {
                help    : 'Run marked cells',
                help_index : 'rm',
                handler : function() {
                    run_marked();
                    return false;
                }
            }, 
            'alt-x' : {
                help    : 'Run all cells',
                help_index : 'ra',
                handler : function() {
                    var pos = IPython.notebook.element.scrollTop();
                    var ic = IPython.notebook.get_selected_index();
                    IPython.notebook.execute_all_cells();
                    IPython.notebook.select(ic);
                    IPython.notebook.element.animate({scrollTop:pos}, 100);
                    return false;
                }
            }, 
            'alt-f' : {
                help    : 'Run all cells - ignore errors',
                help_index : 'rf',
                handler : function() {
                    execute_all_cells_ignore_errors();
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

    var initGutter = function() {
        var ncells = IPython.notebook.ncells();
        var cells = IPython.notebook.get_cells();
        for (var i=0; i<ncells; i++) {
            var cell = cells[i];
            if ((cell instanceof IPython.CodeCell)) {
                var gutters = cell.code_mirror.getOption('gutters');
                var found = jQuery.inArray("CodeMirror-foldgutter", gutters);
                if (found == -1) {
                    cell.code_mirror.setOption('gutters', [gutters, "CodeMirror-foldgutter"]);
                    //cell.code_mirror.refresh();
                }
            }
        }
        /**
         * Restore hide/show status after reload
         */
        for (i=0; i<ncells; i++) {
            var _cell=cells[i];
            if (_cell.metadata.hasOwnProperty('hide_input') && _cell.metadata.hide_input === true )
                showCell(_cell, 'i',false);
            if (_cell.metadata.hasOwnProperty('hide_output') && _cell.metadata.hide_output === true )
                showCell(_cell, 'o',false);
            if (_cell.metadata.hasOwnProperty('locked') && _cell.metadata.locked === true ) {
                _cell.code_mirror.setOption('readOnly', true);
                _cell.code_mirror.setGutterMarker(0, "CodeMirror-foldgutter", makeLockMarker());
                //_cell.code_mirror.refresh();
            }
        _cell.code_mirror.refresh();
        }
    };

    /**
     * Called after extension was loaded
     *
     */
    var load_extension = function() {
        events.on('create.Cell',create_cell);
        load_css('./main.css');
        load_css('codemirror/addon/fold/foldgutter.css');
        load_css( './gutter.css'); /* change default gutter width */
        require(['./dummy'], initGutter); /* gross hack to avoid race condition */
    };

    var runtools = {
        load_ipython_extension : load_extension
        };

    return runtools;
});
