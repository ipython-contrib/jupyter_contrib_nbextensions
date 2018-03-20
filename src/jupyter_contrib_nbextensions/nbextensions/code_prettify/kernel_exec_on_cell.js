// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.

define([
    'jquery',
    'base/js/namespace',
    'base/js/events',
    'notebook/js/codecell',
], function(
    $,
    Jupyter,
    events,
    codecell
) {
    'use strict';

    var CodeCell = codecell.CodeCell;

    // this wrapper function allows config & hotkeys to be per-plugin
    function KernelExecOnCells(mod_name, cfg) {

        this.mod_name = mod_name;
        this.mod_log_prefix = '[' + this.mod_name + ']';
        this.mod_edit_shortcuts = {};
        this.mod_cmd_shortcuts = {};
        this.default_kernel_config = {
            library: '',
            prefix: '',
            postfix: '',
            replacements_json_to_kernel: [],
            trim_formatted_text: true
        };
        // gives default settings
        var default_cfg = {
            add_toolbar_button: true,
            hotkeys: {
                process_selected: 'Ctrl-L',
                process_all: 'Ctrl-Shift-L',
            },
            register_hotkey: true,
            show_alerts_for_errors: true,
            button_icon: 'fa-legal',
            button_label: mod_name,
            kbd_shortcut_text: mod_name,
            kernel_config_map: {},
            actions: null, // to be filled by register_actions
        };
        // extend a new object, to avoid interference with other nbextensions
        // derived from the same base class
        this.cfg = $.extend(true, {}, cfg, default_cfg);
        // set default json string, will later be updated from config
        // before it is parsed into an object
        this.cfg.kernel_config_map_json = JSON.stringify(this.cfg.kernel_config_map);

    } // end per-plugin wrapper define_plugin_functions

    // Prototypes
    // ----------

    /**
     * return a Promise which will resolve/reject based on the kernel message
     * type.
     * The returned promise will be
     *   - resolved if the message was not an error
     *   - rejected using the message's error text if msg.msg_type is "error"
     */
    KernelExecOnCells.prototype.convert_error_msg_to_broken_promise = function(msg) {
        var that = this;
        return new Promise(function(resolve, reject) {
            if (msg.msg_type == 'error') {
                return reject(that.mod_log_prefix + '\n Error: ' + msg.content.ename + '\n' + msg.content.evalue);
            }
            return resolve(msg);
        });
    };

    KernelExecOnCells.prototype.convert_loading_library_error_msg_to_broken_promise = function(msg) {
        var that = this;
        return new Promise(function(resolve, reject) {
            if (msg.msg_type == 'error') {
                return reject(that.mod_log_prefix + '\n Error loading library for ' +
                    Jupyter.notebook.metadata.kernelspec.language + ':\n' +
                    msg.content.ename  + msg.content.evalue +
                    '\n\nCheck that the appropriate library/module is correctly installed (read ' +
                    that.mod_name + '\'s documentation for details)');
            }
            return resolve(msg);
        });
    };

    KernelExecOnCells.prototype.get_kernel_config = function() {
        var kernelLanguage = Jupyter.notebook.metadata.kernelspec.language.toLowerCase();
        var kernel_config = this.cfg.kernel_config_map[kernelLanguage];
        // true => deep
        return $.extend(true, {}, this.default_kernel_config, kernel_config);
    };

    KernelExecOnCells.prototype.transform_json_string_to_kernel_string = function(str, kernel_config) {
        for (var ii = 0; ii < kernel_config.replacements_json_to_kernel.length; ii++) {
            var from = kernel_config.replacements_json_to_kernel[ii][0];
            var to = kernel_config.replacements_json_to_kernel[ii][1];
            str = str.replace(from, to);
        }
        return str;
    };

    /**
     * construct functions as callbacks for the autoformat cell promise. This
     * is necessary because javascript lacks loop scoping, so if we don't use
     * this IIFE pattern, cell_index & cell are passed by reference, and every
     * callback ends up using the same value
     */
    KernelExecOnCells.prototype.construct_cell_callbacks = function(cell_index, cell) {
        var that = this;
        var on_success = function(formatted_text) {
            cell.set_text(formatted_text);
        };
        var on_failure = function(reason) {
            console.warn(
                that.mod_log_prefix,
                'error processing cell', cell_index + ':\n',
                reason
            );
            if (that.cfg.show_alerts_for_errors) {
                alert(reason);
            }
        };
        return [on_success, on_failure];
    };

    KernelExecOnCells.prototype.autoformat_cells = function(indices) {

        if (indices === undefined) {
            indices = Jupyter.notebook.get_selected_cells_indices();
        }
        var kernel_config = this.get_kernel_config();
        for (var ii = 0; ii < indices.length; ii++) {
            var cell_index = indices[ii];
            var cell = Jupyter.notebook.get_cell(cell_index);
            if (!(cell instanceof CodeCell)) {
                continue;
            }
            // IIFE because otherwise cell_index & cell are passed by reference
            var callbacks = this.construct_cell_callbacks(cell_index, cell);
            this.autoformat_text(cell.get_text(), kernel_config).then(callbacks[0], callbacks[1]);
        }
    };

    KernelExecOnCells.prototype.autoformat_text = function(text, kernel_config) {
        var that = this;
        return new Promise(function(resolve, reject) {
            kernel_config = kernel_config || that.get_kernel_config();
            var kernel_str = that.transform_json_string_to_kernel_string(
                JSON.stringify(text), kernel_config);
            Jupyter.notebook.kernel.execute(
                kernel_config.prefix + kernel_str + kernel_config.postfix, {
                    iopub: {
                        output: function(msg) {
                            return resolve(that.convert_error_msg_to_broken_promise(msg).then(
                                function on_success(msg) {
                                    // print goes to stream text => msg.content.text
                                    // but for some kernels (eg nodejs) can be called as result of exec
                                    if (msg.content.text !== undefined) {
                                        var formatted_text;
                                        try {
                                            formatted_text = String(JSON.parse(msg.content.text));
                                        }
                                        catch (err) {
                                            return Promise.reject(err);
                                        }
                                        if (kernel_config.trim_formatted_text) {
                                            formatted_text = formatted_text.trim();
                                        }
                                        return formatted_text;
                                    }
                                }
                            ));
                        }
                    }
                }, { silent: false }
            );
        });
    };


    KernelExecOnCells.prototype.add_toolbar_button = function() {
        if ($('#' + this.mod_name + '_button').length < 1) {
            var button_group_id = this.mod_name + '_button';
            var that = this;
            Jupyter.toolbar.add_buttons_group([{
                label: ' ', //space otherwise add_buttons fails -- This label is inserted as a button description AND bubble help
                icon: this.cfg.button_icon,
                callback: function(evt) {
                    that.autoformat_cells(
                        evt.shiftKey ? Jupyter.notebook.get_cells().map(function (cell, idx) { return idx; }) : undefined
                    );
                },
            }], button_group_id);

            // Correct add_buttons_group default
            // Change title --> inserts bubble help
            // redefine icon to remove spurious space 
            var w = $('#'+ button_group_id +' > .btn')[0];
            w.title = this.cfg.kbd_shortcut_text + ' selected cell(s) (add shift for all cells)'
            w.innerHTML = '<i class="' + this.cfg.button_icon + ' fa"></i>'
        }
}



    KernelExecOnCells.prototype.add_keyboard_shortcuts = function() {
        var new_shortcuts = {};
        new_shortcuts[this.cfg.hotkeys.process_selected] = this.cfg.actions.process_selected.name;
        new_shortcuts[this.cfg.hotkeys.process_all] = this.cfg.actions.process_all.name;
        Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(new_shortcuts);
        Jupyter.keyboard_manager.command_shortcuts.add_shortcuts(new_shortcuts);
    };

    KernelExecOnCells.prototype.register_actions = function() {
        /**
         *  it's important that the actions created by registering keyboard
         *  shortcuts get different names, as otherwise a default action is
         *  created, whose name is a string representation of the handler
         *  function.
         *  Since this library uses the same handler function for all plugins,
         *  just with different contexts (different values of cfg), their
         *  string representations are the same, and the last one to be
         *  registered overwrites all previous versions.
         *  This is essentially an issue with notebook, but it encourages us to
         *  use actions, which is where notebook is going anyway.
         */
        var actions = this.cfg.actions = {};
        var that = this;
        actions.process_selected = {
            help: that.cfg.kbd_shortcut_text + ' selected cell(s)',
            help_index: 'yf',
            icon: that.cfg.button_icon,
            handler: function(evt) { that.autoformat_cells(); },
        };
        actions.process_all = {
            help: that.cfg.kbd_shortcut_text + " the whole notebook",
            help_index: 'yf',
            icon: that.cfg.button_icon,
            handler: function(evt) {
                that.autoformat_cells(Jupyter.notebook.get_cells().map(function (cell, idx) { return idx; }));
            },
        };

        actions.process_selected.name = Jupyter.keyboard_manager.actions.register(
            actions.process_selected, 'process_selected_cells', that.mod_name);
        actions.process_all.name = Jupyter.keyboard_manager.actions.register(
            actions.process_all, 'process_all_cells', that.mod_name);
    };

    KernelExecOnCells.prototype.setup_for_new_kernel = function() {
        var that = this;
        var kernelLanguage = Jupyter.notebook.metadata.kernelspec.language.toLowerCase();
        var kernel_config = this.cfg.kernel_config_map[kernelLanguage];
        if (kernel_config === undefined) {
            $('#' + this.mod_name + '_button').remove();
            alert(this.mod_log_prefix + " Sorry, can't use kernel language " + kernelLanguage + ".\n" +
                "Configurations are currently only defined for the following languages:\n" +
                Object.keys(this.cfg.kernel_config_map).join(', ') + "\n" +
                "See readme for more details.");
            // also remove keyboard shortcuts
            if (this.cfg.register_hotkey) {
                try {
                    Jupyter.keyboard_manager.edit_shortcuts.remove_shortcut(this.cfg.hotkeys.process_selected);
                    Jupyter.keyboard_manager.edit_shortcuts.remove_shortcut(this.cfg.hotkeys.process_all);
                    Jupyter.keyboard_manager.command_shortcuts.remove_shortcut(this.cfg.hotkeys.process_all);
                } catch (err) {}
            }

        } else { // kernel language is supported
            if (this.cfg.add_toolbar_button) {
                this.add_toolbar_button();
            }
            if (this.cfg.register_hotkey) {
                this.add_keyboard_shortcuts();
            }
            Jupyter.notebook.kernel.execute(
                kernel_config.library, {
                    iopub: {
                        output: function(msg) {
                            return that.convert_loading_library_error_msg_to_broken_promise(msg)
                                .catch(
                                    function on_failure(err) {
                                        if (that.cfg.show_alerts_for_errors) {
                                            alert(err);
                                        }
                                        else {
                                            console.error(err);
                                        }
                                    }

                                );
                        }
                    }
                }, { silent: false }
            );

        }
    };

    KernelExecOnCells.prototype.initialize_plugin = function() {
        var that = this;
        // first, load config
        Jupyter.notebook.config.loaded
            // now update default config with that loaded from server
            .then(function on_success() {
                $.extend(true, that.cfg, Jupyter.notebook.config.data[that.mod_name]);
            }, function on_error(err) {
                console.warn(that.mod_log_prefix, 'error loading config:', err);
            })
            // next parse json config values
            .then(function on_success() {
                var parsed_kernel_cfg = JSON.parse(that.cfg.kernel_config_map_json);
                $.extend(that.cfg.kernel_config_map, parsed_kernel_cfg);
            })
            // if we failed to parse the json values in the config
            // using catch pattern, we attempt to continue anyway using defaults
            .catch(function on_error(err) {
                console.warn(
                    that.mod_log_prefix, 'error parsing config variable',
                    that.mod_name + '.kernel_config_map_json to a json object:',
                    err
                );
            })
            // now do things which required the config to be loaded
            .then(function on_success() {
                that.register_actions(); // register actions
                // kernel may already have been loaded before we get here, in which
                // case we've missed the kernel_ready.Kernel event, so try ctx
                if (typeof Jupyter.notebook.kernel !== "undefined" && Jupyter.notebook.kernel !== null) {
                    that.setup_for_new_kernel();
                }

                // on kernel_ready.Kernel, a new kernel has been started
                events.on("kernel_ready.Kernel", function(evt, data) {
                    console.log(that.mod_log_prefix, 'restarting for new kernel_ready.Kernel event');
                    that.setup_for_new_kernel();
                });
            }).catch(function on_error(err) {
                console.error(that.mod_log_prefix, 'error loading:', err);
            });
    };

    return {define_plugin: KernelExecOnCells};
});
