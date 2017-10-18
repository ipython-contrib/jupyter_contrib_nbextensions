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
) {
    'use strict';

    var CodeCell = codecell.CodeCell;
    var MarkdownCell = textcell.MarkdownCell;

    var mod_name = 'Freeze';
    var log_prefix = '[' + mod_name + ']';

    // defaults, overridden by server's config
    var options = {
        readonly_color: '#fffef0',
        frozen_color: '#f0feff'
    };

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
        };
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
        };
    }

    // Migrate old metadata format to new notebook-defined metadata.editable
    function migrate_state (cell) {
        if (cell.metadata.run_control !== undefined) {
            if (cell instanceof CodeCell || cell instanceof MarkdownCell) {
                if (cell.metadata.run_control.read_only === true) {
                    cell.metadata.editable = false;
                }
            }
            else {
                // remove metadata irrelevant to non-code/markdown cells
                delete cell.metadata.run_control.frozen;
            }
            // remove old key replaced by metadata.editable
            delete cell.metadata.run_control.read_only;
            // remove whole object if it's now empty
            if (Object.keys(cell.metadata.run_control).length === 0) {
                delete cell.metadata.run_control;
            }
        }
    }

    function get_state (cell) {
        if (cell.metadata.editable === false && (cell instanceof CodeCell || cell instanceof MarkdownCell)) {
            if (cell.metadata.run_control !== undefined && cell.metadata.run_control.frozen) {
                return 'frozen';
            }
            return 'readonly';
        }
        return 'normal';
    }

    function set_state(cell, state) {
        if (!(cell instanceof CodeCell || cell instanceof MarkdownCell)) {
            return;
        }

        state = state || 'normal';
        var bg;
        switch (state) {
            case 'normal':
                cell.metadata.editable = true;
                cell.metadata.deletable = true;
                if (cell.metadata.run_control !== undefined) {
                    delete cell.metadata.run_control.frozen;
                }
                bg = "";
                break;
            case 'read_only':
            case 'readonly':
                cell.metadata.editable = false;
                cell.metadata.deletable = false;
                if (cell.metadata.run_control !== undefined) {
                    delete cell.metadata.run_control.frozen;
                }
                bg = options.readonly_color;
                break;
            case 'frozen':
                cell.metadata.editable = false;
                cell.metadata.deletable = false;
                $.extend(true, cell.metadata, {run_control: {frozen: true}});
                bg = options.frozen_color;
                break;
        }
        // remove whole object if it's now empty
        if (cell.metadata.run_control !== undefined && Object.keys(cell.metadata.run_control).length === 0) {
            delete cell.metadata.run_control;
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
            migrate_state(cell);
            var state = get_state(cell);
            set_state(cell, state);
        }
    }

    function load_extension () {
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register ({
                help : 'lift restrictions from selected cells',
                icon : 'fa-unlock-alt',
                handler : make_normal_selected
            }, 'make-cells-normal', mod_name),
            Jupyter.keyboard_manager.actions.register({
                help : 'make selected cells read-only',
                icon: 'fa-lock',
                handler : make_read_only_selected
            }, 'make-cells-read-only', mod_name),
            Jupyter.keyboard_manager.actions.register({
                help : 'freeze selected cells',
                icon : 'fa-asterisk',
                handler : make_frozen_selected
            }, 'freeze-cells', mod_name)
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
        get_state : get_state,
        set_state : set_state,
        load_jupyter_extension : load_extension,
        load_ipython_extension : load_extension
    };
});
