// Extended code execution commands and more

define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'services/config',
    'base/js/utils',
    'notebook/js/codecell'
], function(Jupyter, $, requirejs, events, configmod, utils, codecell) {
    "use strict";

    var run_list = []; /* list of cells to be run */

    // define default config parameter values
    var params = {
        run_cells_above: 'Alt-a',
        run_cells_below: 'Alt-b',
        toggle_marker: 'Alt-t',
        mark_all_codecells: 'Alt-m',
        unmark_all_codecells: 'Alt-u',
        run_marked_cells: 'Alt-r',
        run_all_cells: 'Alt-x',
        run_all_cells_ignore_errors: 'Alt-f',
        stop_execution: 'Ctrl-c',
        marked_color: '#20f224',
        scheduled_color: '#00def0',
        run_color: '#f30a2d'
    };

    /**
     * Add event if user clicks on codemirror gutter
     *
     */
    function add_gutter_events() {
        var ncells = Jupyter.notebook.ncells();
        var cells = Jupyter.notebook.get_cells();
        for (var i = 0; i < ncells; i++) {
            var cell = cells[i];
            if ((cell.cell_type === "code")) {
                cell.code_mirror.on("gutterClick", changeEvent);
                if (is_marked(cell)) {
                    var g = cell.code_mirror.getGutterElement();
                    $(g).css({
                        "background-color": params.marked_color
                    });
                }
            }
        }
    }

    /*
     * Initialize toolbar and gutter after config was loaded
     */
    function initialize() {
        $.extend(true, params, Jupyter.notebook.config.data.runtools);

        add_gutter_events();

        /* Add run control buttons to toolbar */
        $(Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register ({
                help: 'Toggle Runtools Toolbar',
                icon: 'fa-cogs',
                handler: toggle_toolbar
            }, 'toggle-runtools-toolbar', 'runtools')
        ])).find('.btn').attr('id', 'toggle_runtools').css({
            'outline': 'none'
        });

        /* Add keyboard shortcuts */
        var add_command_shortcuts = {};
        add_command_shortcuts[params["run_cells_above"]] = {
            help: 'Run cells above',
            help_index: 'xa',
            handler: function() {
                execute_cells_above();
                return false;
            }
        };
        add_command_shortcuts[params["run_cells_below"]] = {
            help: 'Run cells below',
            help_index: 'aa',
            handler: function() {
                execute_cells_below();
                return false;
            }
        };
        add_command_shortcuts[params["toggle_marker"]] = {
            help: 'Toggle marker',
            help_index: 'mt',
            handler: function() {
                toggle_marker();
                return false;
            }
        };
        add_command_shortcuts[params["mark_all_codecells"]] = {
            help: 'Mark all codecells',
            help_index: 'ma',
            handler: function() {
                mark_all();
                return false;
            }
        };
        add_command_shortcuts[params["unmark_all_codecells"]] = {
            help: 'Unmark all codecells',
            help_index: 'mu',
            handler: function() {
                mark_none();
                return false;
            }
        };
        add_command_shortcuts[params["run_marked_cells"]] = {
            help: 'Run marked cells',
            help_index: 'rm',
            handler: function() {
                run_marked_cells();
                return false;
            }
        };
        add_command_shortcuts[params["run_all_cells"]] = {
            help: 'Run all cells',
            help_index: 'ra',
            handler: function() {
                var pos = Jupyter.notebook.element.scrollTop();
                execute_all_cells();
                Jupyter.notebook.element.animate({
                    scrollTop: pos
                }, 100);
                return false;
            }
        };
        add_command_shortcuts[params["run_all_cells_ignore_errors"]] = {
            help: 'Run all cells - ignore errors',
            help_index: 'rf',
            handler: function() {
                run_all_cells_ignore_errors();
                return false;
            }
        };
        Jupyter.keyboard_manager.command_shortcuts.add_shortcuts(add_command_shortcuts);
        Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(add_command_shortcuts);

        events.on('finished_execute.CodeCell', finished_execute_event);
    }

    /**
     * Hide or show a cell
     *
     * @param cell
     * @param io 'i' for cell input, 'o' for cell output
     * @param showme {Boolean} show (true) or hide (false) cell
     */
    function showCell(cell, io, showme) {
        if (io === 'i') {
            if (showme === true) {
                cell.element.find("div.input").show();
                cell.metadata.hide_input = false;
            } else {
                cell.element.find("div.input").hide();
                cell.metadata.hide_input = true;
            }
        } else {
            if (showme === true) {
                cell.element.find('div.output').show();
                cell.metadata.hide_output = false;
            } else {
                cell.element.find('div.output').hide();
                cell.metadata.hide_output = true;
            }
        }
    }

    function _show_input_output_of_marked(show, char) {
        var cells = Jupyter.notebook.get_cells();
        var ncells = cells.length;
        for (var i = 0; i < ncells; i++) {
            var _cell = cells[i];
            if (is_marked(_cell))
                showCell(_cell, char, show);
        }
    }

    /**
     * Hide or show input of all marked code cells
     *
     * @param show {Boolean} show (true) or hide (false) code cells
     */
    function show_input(show) {
        _show_input_output_of_marked(show, 'i');
    }

    /**
     * Hide or show output area of all marked code cells
     *
     * @param {Boolean} show show (true) or hide (false)
     */
    function show_output(show) {
        _show_input_output_of_marked(show, 'o');
    }


    /**
     * Execute next cell in run list, if it is still marked
     *
     */
    function execute_next_marked_cell() {
        var cells = Jupyter.notebook.get_cells();
        var end = cells.length;
        while (run_list.length > 0) {
            var runcell = run_list.shift();
            for (var i = 0; i < end; i++) {
                if (runcell === cells[i]) {
                    if (runcell.metadata.run_control !== undefined && runcell.metadata.run_control.marked === true) {
                        var g = runcell.code_mirror.getGutterElement();
                        $(g).css({
                            "background-color": params.run_color
                        });
                        runcell.execute();
                        return;
                    }
                }
            }
        }
    }

    function _execute_without_selecting(idx_start, idx_end, stop_on_error) {
        // notebook.execute_cells alters selection, this doesn't
        var cells = Jupyter.notebook.get_cells();
        idx_start = idx_start !== undefined ? idx_start : 0;
        idx_end = idx_end !== undefined ? idx_end : cells.length;
        for (var ii = idx_start; ii < idx_end; ii++) {
            cells[ii].execute(stop_on_error);
        }
    }

    function execute_cells_above() {
        _execute_without_selecting(0, Jupyter.notebook.get_selected_index());
    }

    function execute_cells_below() {
        _execute_without_selecting(Jupyter.notebook.get_selected_index(), undefined);
    }

    function execute_all_cells(stop_on_error) {
        _execute_without_selecting(0, undefined, stop_on_error);
    }

    /**
     * Run code cells marked in metadata
     *
     */
    function run_marked_cells() {
        var cells = Jupyter.notebook.get_cells();
        var end = cells.length;
        run_list = [];
        /* Show all marked cells as scheduled to be run with new gutter background color  */
        for (var i = 0; i < end; i++) {
            var cell = cells[i];
            if (cell instanceof codecell.CodeCell) {
                var last_line = cell.code_mirror.lastLine();
                var cell_empty = ( last_line === 0 && cell.code_mirror.getLine(last_line) === "");
                if (cell.metadata.run_control !== undefined && cell_empty === false) {
                    if (cell.metadata.run_control.marked === true) {
                        var g = cell.code_mirror.getGutterElement();
                        $(g).css({
                            "background-color": params.scheduled_color
                        });
                        run_list.push(cell);
                    }
                }
            }
        }
        execute_next_marked_cell();
    }

    /*
     * Execute next cell in run_list when notified execution of last cell has been finished
     * @param evt Event
     * @param data Cell that has finished executing
     */
    var finished_execute_event = function(evt, data) {
        var cell = data.cell;
        /* Reset gutter color no non-queued state */
        if (is_marked(cell)) {
            var g = cell.code_mirror.getGutterElement();
            $(g).css({
                "background-color": params.marked_color
            });
        }
        execute_next_marked_cell();
    };

    /**
     *
     * @param cell
     * @param value
     */
    function setCell(cell, value) {
        if (!(cell instanceof codecell.CodeCell)) return;
        if (cell.metadata.run_control === undefined) cell.metadata.run_control = {};
        if (cell.metadata.run_control.marked === undefined) cell.metadata.run_control.marked = false;
        if (value === undefined) value = !cell.metadata.run_control.marked;
        var g = cell.code_mirror.getGutterElement();
        if (value === false) {
            cell.metadata.run_control.marked = false;
            $(g).css({
                "background-color": ""
            });
        } else {
            cell.metadata.run_control.marked = true;
            $(g).css({
                "background-color": params.marked_color
            });
        }
    }

    function setCellsMarked(cells, value) {
        var ncells = cells.length;
        for (var i = 0; i < ncells; i++) {
            setCell(cells[i], value);
        }
    }

    /**
     * Toggle code cell marker
     */
    function toggle_marker() {
        setCellsMarked(Jupyter.notebook.get_selected_cells(), undefined);
    }

    /**
     *
     */
    function mark_all() {
        setCellsMarked(Jupyter.notebook.get_cells(), true);
    }

    /**
     *
     */
    function mark_none() {
        setCellsMarked(Jupyter.notebook.get_cells(), false);
    }

    /**
     *
     * @param cell notebook cell instance
     * @param state {string} state to be display [ '', 'locked', 'executed', 'modified' ]
     */
    function set_cell_state(cell, state) {
        var icon = "";
        if (state === 'locked') {
            icon = '<div class="fa fa-lock" style="font-size:70%;" /div>'
        }
        cell.code_mirror.setGutterMarker(0, "CodeMirror-cellstate", celltypeMarker(icon))
    }

    /**
     * Change event to mark/unmark cell
     *
     * @param cm codemirror instance
     * @param line current line
     * @param gutter not used
     */
    function changeEvent(cm, line, gutter) {
        if (gutter === "CodeMirror-foldgutter") return; /* Don't collide with codefolding extension */

        var cmline = cm.doc.children[0].lines[line];
        if (cmline === undefined) {
            return;
        }
        var cell = $(cm.display.gutters).closest('.cell').data('cell');
        if (cell.metadata.run_control === undefined)
            cell.metadata.run_control = {};
        setCell(cell, !cell.metadata.run_control.marked);
    }

    /**
     *
     * @param cell cell to be tested
     * @returns {boolean} true if marked
     */
    var is_marked = function(cell) {
        return (cell instanceof codecell.CodeCell) &&
            cell.metadata.run_control !== undefined &&
            cell.metadata.run_control.marked;
    };

    /**
     * Return div element to set in cellstate gutter
     *
     * @param val HTML string
     * @returns {Element} div Element
     */
    function celltypeMarker(val) {
        var marker = document.createElement("div");
        marker.style.color = "#822";
        marker.innerHTML = val;
        return marker;
    }

    /**
     * Lock/Unlock current code cell
     *             if (cell.metadata.run_control != undefined && cell.metadata.run_control.read_only) {
     *                     cell.code_mirror.setOption('readOnly', cell.metadata.run_control.read_only);
     */
    var lock_cell = function(locked) {
        var ncells = Jupyter.notebook.ncells();
        for (var i = ncells - 2; i >= 0; i--) {
            var cells = Jupyter.notebook.get_cells();
            if ((cells[i].cell_type === "code") && is_marked(cells[i])) {
                if (locked === true) {
                    cells[i].metadata.editable = false;
                    set_cell_state(cells[i], 'locked')
                } else {
                    cells[i].metadata.editable = true;
                    set_cell_state(cells[i], '')
                }
            }
        }
    };

    /**
     * Execute all cells and don't stop on errors
     *
     */
    var run_all_cells_ignore_errors = function() {
        execute_all_cells(false);
    };

    /**
     * Create floating toolbar
     *
     */
    var create_runtools_div = function() {
        var btn = '<div class="btn-toolbar">\
            <div class="btn-group">\
                <button type="button" id="run_c" class="btn-primary fa fa-step-forward" title="Run current cell"></button>\
                <button type="button" id="run_ca" class="btn-primary fa icon-run-to" title="' +
            'Run cells above (' + params["run_cells_above"] + ')"</button>\
                <button type="button" id="run_cb" class="btn-primary fa icon-run-from" title="' +
            'Run cells below (' + params["run_cells_below"] + ')"</button>\
                <button type="button" id="run_a" class="btn-primary fa icon-run-all" title="' +
            'Run all cells (' + params["run_all_cells"] + ')"</button>\
                <button type="button" id="run_af" class="btn-primary fa icon-run-all-forced" title="' +
            'Run all - ignore errors (' + params["run_all_cells_ignore_errors"] + ')"</button>\
                <button type="button" id="run_m" class="btn-primary fa icon-run-marked" title="' +
            'Run marked codecells (' + params["run_marked_cells"] + ')"</button>\
                <button type="button" id="interrupt_b" class="btn-primary fa fa-stop" title="' +
            'Stop execution (' + params["stop_execution"] + ')"</button>\
            </div>\
            <div class="btn-group">\
                <button type="button" id="mark_toggle" class="btn-primary fa icon-mark-toggle" title="Mark single code cell"></button>\
                <button type="button" id="mark_all" class="btn-primary fa icon-mark-all" title="Mark all code cells"></button>\
                <button type="button" id="mark_none" class="btn-primary fa icon-mark-none" title="Unmark all code cells"></button>\
            </div>\
            <div class="btn-group">\
                <button type="button" id="show_input" class="btn-primary fa icon-show-input" title="Show input of code cell"></button>\
                <button type="button" id="hide_input" class="btn-primary fa icon-hide-input" title="Hide input of code cell"></button>\
                <button type="button" id="show_output" class="btn-primary fa icon-show-output" title="Show output of code cell"></button>\
                <button type="button" id="hide_output" class="btn-primary fa icon-hide-output" title="Hide output of code cell"></button>\
                <button type="button" id="lock_marked" class="btn-primary fa fa-lock" title="Lock marked cells"></button>\
                <button type="button" id="unlock_marked" class="btn-primary fa fa-unlock" title="Unlock marked cells"></button>\
            </div>\
            </div>';

        var runtools_wrapper = $('<div id="runtools-wrapper">')
            .text("Runtools")
            .append(btn)
            .draggable()
            .append("</div>");

        $("#header").append(runtools_wrapper);
        $("#runtools-wrapper").css({
            'position': 'absolute'
        });
        $('#run_c').on('click', function(e) {
                var idx = Jupyter.notebook.get_selected_index();
                _execute_without_selecting(idx, idx + 1);
                e.target.blur();
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#run_ca').on('click', function(e) {
                execute_cells_above();
                e.target.blur();
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#run_cb').on('click', function(e) {
                execute_cells_below();
                e.target.blur();
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#run_a').on('click', function(e) {
                execute_all_cells();
                e.target.blur();
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#run_af').on('click', function(e) {
                run_all_cells_ignore_errors();
                e.target.blur()
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#run_m').on('click', function(e) {
                run_marked_cells();
                e.target.blur()
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#interrupt_b').on('click', function(e) {
                interrupt_execution();
                e.target.blur()
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#mark_toggle').on('click', function() {
                toggle_marker()
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#mark_all').on('click', function() {
                mark_all()
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#mark_none').on('click', function() {
                mark_none()
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#show_input').on('click', function() {
                show_input(true);
                this.blur()
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#hide_input').on('click', function() {
                show_input(false);
                this.blur()
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#show_output').on('click', function() {
                show_output(true);
                this.blur()
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#hide_output').on('click', function() {
                show_output(false);
                this.blur()
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#lock_marked').on('click', function() {
                lock_cell(true);
                this.blur()
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
        $('#unlock_marked').on('click', function() {
                lock_cell(false);
                this.blur()
            })
            .tooltip({
                delay: {
                    show: 500,
                    hide: 100
                }
            });
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
     * Add CSS file
     *
     * @param name filename
     */
    var load_css = function(name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = requirejs.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    /**
     * Add gutter to a new cell
     *
     * @param event
     * @param nbcell
     *
     */
    var createCell = function(event, nbcell) {
        var cell = nbcell.cell;
        if (cell instanceof codecell.CodeCell) {
            var gutters = cell.code_mirror.getOption('gutters').slice();
            if ($.inArray("CodeMirror-cellstate", gutters) < 0) {
                gutters.push('CodeMirror-cellstate');
                cell.code_mirror.setOption('gutters', gutters);
                cell.code_mirror.on("gutterClick", changeEvent);

            }
        }
    };


    /**
     * Initialize all cells with new gutter
     */
    var initGutter = function() {
        var cells = Jupyter.notebook.get_cells();
        var ncells = cells.length;
        for (var i = 0; i < ncells; i++) {
            var cell = cells[i];
            if (cell instanceof codecell.CodeCell) {
                var gutters = cell.code_mirror.getOption('gutters').slice();
                if ($.inArray("CodeMirror-cellstate", gutters) < 0) {
                    gutters.push('CodeMirror-cellstate');
                    cell.code_mirror.setOption('gutters', gutters);
                }
            }
            /**
             * Restore hide/show status after reload
             */
            if (cell.metadata.hasOwnProperty('hide_input') && cell.metadata.hide_input === true)
                showCell(cell, 'i', false);
            if (cell.metadata.hasOwnProperty('hide_output') && cell.metadata.hide_output === true)
                showCell(cell, 'o', false);
            if (cell.is_editable() === false) {
                set_cell_state(cell, 'locked');
            }
            cell.code_mirror.refresh();
        }
        events.on('create.Cell', createCell);
    };

    /**
     * Called from notebook after extension was loaded
     *
     */
    var load_extension = function() {
        load_css('./main.css');
        load_css('./gutter.css'); /* set gutter width */
        requirejs(['./cellstate'], function() {
            if (Jupyter.notebook._fully_loaded) {
                initGutter();
            } else {
                events.one('notebook_loaded.Notebook', initGutter);
            }
        });
        Jupyter.notebook.config.loaded.then(initialize);
    };

    return {
        load_jupyter_extension: load_extension,
        load_ipython_extension: load_extension
    };
});
