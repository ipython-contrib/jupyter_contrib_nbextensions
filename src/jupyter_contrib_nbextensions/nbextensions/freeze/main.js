define([
    'base/js/namespace',
    'base/js/events',
    'notebook/js/codecell',
    'notebook/js/textcell',
    'jquery'
], function (
    Jupyter,
    events,
    codecell,
    textcell,
    $
){
    'use strict';

    var CodeCell = codecell.CodeCell;
    var MarkdownCell = textcell.MarkdownCell;

    var mod_name = 'Freeze';
    var log_prefix = '[' + mod_name + ']';

    // defaults, overridden by server's config
    var options = {
        readonly_color: '#fffef0',
        frozen_color: '#f0feff'
    }

    function patch_MarkdownCell_unrender () {
        console.log('[Freeze] patching MarkdownCell.prototype.unrender');
        var old_unrender = MarkdownCell.prototype.unrender;

        MarkdownCell.prototype.unrender = function () {
            // console.log('[Freeze] patched unrender applied');
            if (this.metadata.run_control === undefined ||
                !this.metadata.run_control.frozen
            ) {
                old_unrender.apply(this, arguments);
            }
        }
    }

    function patch_CodeCell_execute () {
        console.log('[Freeze] patching CodeCell.prototype.execute');
        var old_execute = CodeCell.prototype.execute;

        CodeCell.prototype.execute = function () {
            if (this.metadata.run_control === undefined ||
                !this.metadata.run_control.frozen
            ) {
                old_execute.apply(this, arguments);
            }
        }
    }

    function set_state(cell, state) {
        if (!(cell instanceof CodeCell || cell instanceof MarkdownCell)) {
            return
        }

        state = state || 'normal';
        var bg;
        delete cell.metadata.run_control
        switch (state) {
            case 'normal':
                cell.metadata.editable = true;
                cell.metadata.run_control = {
                    frozen: false
                };
                bg = "";
                break;
            case 'read_only':
                cell.metadata.editable = false;
                cell.metadata.run_control = {
                    frozen: false
                };
                bg = options.readonly_color;
                break;
            case 'frozen':
                cell.metadata.editable = false;
                cell.metadata.run_control = {
                    frozen: true
                };
                bg = options.frozen_color;
                break;
        }
        cell.code_mirror.setOption('readOnly', !cell.metadata.editable);
        var prompt = cell.element.find('div.input_area');
        prompt.css("background-color", bg);
    }

    function set_state_selected (state) {
        var cells = Jupyter.notebook.get_selected_cells();
        for (var i = 0; i < cells.length; i++) {
            set_state(cells[i], state);
        }
    }

    function button_callback(state) {
        set_state_selected(state);
        var dirty_state = {value: true};
        events.trigger("set_dirty.Notebook", dirty_state);
    }

    function make_normal_selected () {
        button_callback('normal');
    }

    function make_read_only_selected () {
        button_callback('read_only');
    }

    function make_frozen_selected () {
        button_callback('frozen');
    }

    function initialize_states () {
        var cells = Jupyter.notebook.get_cells();
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            if (!(cell instanceof CodeCell || cell instanceof MarkdownCell)) {
                continue;
            }
            var state = 'normal';
            // Old metadata format
            if (cell.metadata.run_control !== undefined && cell.metadata.run_control.read_only) {
                state = cell.metadata.run_control.frozen ? 'frozen' : 'read_only';
            }
            // Jupyter 5.x metadata format
            if (cell.metadata.run_control !== undefined && cell.metadata.editable !== undefined && !cell.metadata.editable) {
                state = cell.metadata.run_control.frozen ? 'frozen' : 'read_only';
            }
            set_state(cell, state);
        }
    }

    function load_extension () {
        Jupyter.toolbar.add_buttons_group([
            {
                id : 'make_normal',
                label : 'lift restrictions from selected cells',
                icon : 'fa-unlock-alt',
                callback : make_normal_selected
            },
            {
                id : 'make_read_only',
                label : 'make selected cells read-only',
                icon: 'fa-lock',
                callback : make_read_only_selected
            },
            {
                id : 'freeze_cells',
                label : 'freeze selected cells',
                icon : 'fa-asterisk',
                callback : make_frozen_selected
            }
        ]);

        patch_CodeCell_execute();
        patch_MarkdownCell_unrender();

        Jupyter.notebook.config.loaded.then(function on_config_loaded () {
            $.extend(true, options, Jupyter.notebook.config.data[mod_name]);
        }, function on_config_load_error (reason) {
            console.warn(log_prefix, 'Using defaults after error loading config:', reason);
        }).then(function do_stuff_with_config () {
            events.on("notebook_loaded.Notebook", initialize_states);
            if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
                // notebook already loaded, so we missed the event, so update all
                initialize_states();
            }
        }).catch(function on_error (reason) {
            console.error(log_prefix, 'Error:', reason);
        });
    }

    return {
        load_jupyter_extension : load_extension,
        load_ipython_extension : load_extension
    };
});
