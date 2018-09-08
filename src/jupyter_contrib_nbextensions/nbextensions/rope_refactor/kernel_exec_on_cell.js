// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.

define([
    'jquery',
    'base/js/namespace',
    'base/js/events',
    'notebook/js/codecell',
], function (
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
                rename: 'shift-f6',
                extract_variable: 'alt-meta-v',
                extract_method: 'alt-meta-m',
                inline: 'alt-meta-;',
            },
            actions: {
                extract_variable: {
                    help: 'Extract variable',
                    icon: 'fa-legal'
                },
                rename: {
                    help: 'Rename',
                    icon: 'fa-beer'
                },
                extract_method: {
                    help: 'Extract Method',
                    icon: 'fa-beer'
                },
                inline: {
                    help: 'Inline',
                    icon: 'fa-beer'
                },
            },
            register_hotkey: true,
            show_alerts_for_errors: true,
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
    KernelExecOnCells.prototype.convert_error_msg_to_broken_promise = function (msg) {
        var that = this;
        return new Promise(function (resolve, reject) {
            if (msg.msg_type == 'error') {
                return reject(that.mod_log_prefix + '\n Error: ' + msg.content.ename + '\n' + msg.content.evalue);
            }
            return resolve(msg);
        });
    };

    KernelExecOnCells.prototype.convert_loading_library_error_msg_to_broken_promise = function (msg) {
        var that = this;
        return new Promise(function (resolve, reject) {
            if (msg.msg_type == 'error') {
                return reject(that.mod_log_prefix + '\n Error loading library for ' +
                    Jupyter.notebook.metadata.kernelspec.language + ':\n' +
                    msg.content.ename + msg.content.evalue +
                    '\n\nCheck that the appropriate library/module is correctly installed (read ' +
                    that.mod_name + '\'s documentation for details)');
            }
            return resolve(msg);
        });
    };

    KernelExecOnCells.prototype.get_kernel_config = function () {
        var kernelLanguage = Jupyter.notebook.metadata.kernelspec.language.toLowerCase();
        var kernel_config = this.cfg.kernel_config_map[kernelLanguage];
        // true => deep
        return $.extend(true, {}, this.default_kernel_config, kernel_config);
    };

    KernelExecOnCells.prototype.transform_json_string_to_kernel_string = function (str) {
        let kernel_config = this.get_kernel_config()
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
    KernelExecOnCells.prototype.construct_cell_callbacks = function (cell) {
        var that = this;
        var on_success = function (formatted_text) {
            cell.set_text(formatted_text);
        };
        var on_failure = function (reason) {
            console.warn(
                that.mod_log_prefix,
                'error processing cell:\n',
                reason
            );
            if (that.cfg.show_alerts_for_errors) {
                alert(reason);
            }
        };
        return [on_success, on_failure];
    };

    KernelExecOnCells.prototype.extract_variable = function () {
        this.perform_refactoring("extract_variable", "Variable name: ")
    };
    KernelExecOnCells.prototype.rename = function () {
        this.perform_refactoring("rename", "New name: ")
    };
    KernelExecOnCells.prototype.extract_method = function () {
        this.perform_refactoring("extract_method", "Method name: ")
    };
    KernelExecOnCells.prototype.inline = function () {
        this.perform_refactoring("inline", undefined)
    };

    KernelExecOnCells.prototype.perform_refactoring = function (refactoring_action_name, user_prompt) {
        let cell = Jupyter.notebook.get_selected_cell()
        if (cell == undefined) {
            alert("No cell selected")
            return
        }
        if (!(cell instanceof CodeCell)) {
            alert("Selected cell is not a code cell")
            return
        }
        let selections = cell.code_mirror.listSelections()
        if (selections.length > 1) {
            alert("Only single selections are supported")
            return
        }
        if (selections.length == 0) {
            alert("No text selected")
            return
        }

        let selection = selections[0]
        let start = selection.anchor
        let end = selection.head

        let new_variable_name
        if (user_prompt !== undefined) {
            new_variable_name = prompt(user_prompt)
        }

        let callbacks = this.construct_cell_callbacks(cell)

        let kernel_str = this.transform_json_string_to_kernel_string(JSON.stringify(cell.get_text()))

        this.send_request_to_server(refactoring_action_name, kernel_str, start, end, new_variable_name)
            .then(callbacks[0], callbacks[1])
    }
    

    KernelExecOnCells.prototype.send_request_to_server = function (action, code_to_refactor, start, end, new_variable_name) {
        var that = this;
        return new Promise(function (resolve, reject) {
            $.getJSON('/rope_refactoring', {
                "start": {
                    "line": start.line,
                    "ch": start.ch
                },
                "end": {
                    "line": end.line,
                    "ch": end.ch
                },
                "code_to_refactor": code_to_refactor,
                "new_variable_name": new_variable_name,
                "action": action
            }, function (msg) {
                return resolve(that.convert_error_msg_to_broken_promise(msg).then(
                    function on_success(msg) {
                        // print goes to stream text => msg.content.text
                        // but for some kernels (eg nodejs) can be called as result of exec
                        if (msg !== undefined) {
                            if (msg.refactored_code !== "") {
                                let refactored_code = msg.refactored_code
                                let kernel_config = that.get_kernel_config();
                                if (kernel_config.trim_formatted_text) {
                                    refactored_code = refactored_code.trim();
                                }
                                return refactored_code;
                            } else {
                                alert(msg.error)
                            }
                        } else {
                            alert("An unknown error occurred (no response).")
                        }
                    }
                ));
            });
        });
    }

    // KernelExecOnCells.prototype.execute_code_on_kernel = function (code, kernel_config) {
    //     var that = this;
    //     return new Promise(function (resolve, reject) {
    //         kernel_config = kernel_config || that.get_kernel_config();
    //         Jupyter.notebook.kernel.execute(code, {
    //                 iopub: {
    //                     output: function (msg) {
    //                         return resolve(that.convert_error_msg_to_broken_promise(msg).then(
    //                             function on_success(msg) {
    //                                 // print goes to stream text => msg.content.text
    //                                 // but for some kernels (eg nodejs) can be called as result of exec
    //                                 if (msg.content.text !== undefined) {
    //                                     var new_text;
    //                                     try {
    //                                         new_text = String(JSON.parse(msg.content.text));
    //                                     }
    //                                     catch (err) {
    //                                         return Promise.reject(err);
    //                                     }
    //                                     if (kernel_config.trim_formatted_text) {
    //                                         new_text = new_text.trim();
    //                                     }
    //                                     return new_text;
    //                                 }
    //                             }
    //                         ));
    //                     }
    //                 }
    //             }, {silent: false}
    //         );
    //     });
    // };


    KernelExecOnCells.prototype.add_toolbar_button = function () {
        // let rename_button_tag = this.mod_name + '_rename_button'
        // if ($('#' + rename_button_tag).length < 1) {
        //     Jupyter.toolbar.add_buttons_group([this.cfg.actions.rename.name], rename_button_tag);
        // }
        // let extract_variable_button_tag = this.mod_name + '_extract_variable_button'
        // if ($('#' + extract_variable_button_tag).length < 1) {
        //     Jupyter.toolbar.add_buttons_group([this.cfg.actions.extract_variable.name], extract_variable_button_tag);
        // }
        // let inline_button_tag = this.mod_name + '_inline_button'
        // if ($('#' + inline_button_tag).length < 1) {
        //     Jupyter.toolbar.add_buttons_group([this.cfg.actions.inline.name], inline_button_tag);
        // }
        // let extract_method_button_tag = this.mod_name + '_extract_method_button'
        // if ($('#' + extract_method_button_tag).length < 1) {
        //     Jupyter.toolbar.add_buttons_group([this.cfg.actions.extract_method.name], extract_method_button_tag);
        // }

        Object.keys(this.cfg.actions).forEach(actionName => {
            let button_tag = this.mod_name + '_' + actionName + '_button'
            if ($('#' + button_tag).length < 1) {
                Jupyter.toolbar.add_buttons_group([this.cfg.actions[actionName].name], button_tag);
            }
        });
        // Correct add_buttons_group default
            // Change title --> inserts bubble help
            // redefine icon to remove spurious space 
            // var w = $('#' + button_group_id + ' > .btn')[0];
            // w.title = this.cfg.kbd_shortcut_text + ' selected cell(s) (add shift for all cells)'
            // w.innerHTML = '<i class="' + this.cfg.button_icon + ' fa"></i>'
        // }
    }


    KernelExecOnCells.prototype.add_keyboard_shortcuts = function () {
        var new_shortcuts = {};
        Object.keys(this.cfg.actions).forEach(actionName => {
            new_shortcuts[this.cfg.hotkeys[actionName]] = this.cfg.actions[actionName].name
        });
        Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(new_shortcuts);
    };

    KernelExecOnCells.prototype.register_actions = function () {
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
        var that = this;
        let actions = this.cfg.actions;
        actions.extract_variable.handler = function (evt) {
            that.extract_variable();
        };

        actions.rename.handler = function (evt) {
            that.rename();
        };

        actions.extract_method.handler = function (evt) {
            that.extract_method();
        };

        actions.inline.handler = function (evt) {
            that.inline();
        };

        Object.keys(actions).forEach(actionName => {
            actions[actionName].name = Jupyter.keyboard_manager.actions.register(actions[actionName], actionName + "_action", that.mod_name)
        });
        // actions.extract_variable.name = Jupyter.keyboard_manager.actions.register(
        //     actions.extract_variable, 'extract_variable_action', that.mod_name);
        // actions.rename.name = Jupyter.keyboard_manager.actions.register(
        //     actions.rename, 'rename_action', that.mod_name);
        // actions.extract_variable.name = Jupyter.keyboard_manager.actions.register(
        //     actions.extract_variable, 'extract_method_action', that.mod_name);
        // actions.inline.name = Jupyter.keyboard_manager.actions.register(
        //     actions.inline, 'inline_action', that.mod_name);

        // var action = {
        //     icon: 'fa-comment-o', // a font-awesome class used on buttons, etc
        //     help: 'Show an alert',
        //     help_index: 'zz',
        //     handler: function (evt) {
        //         that.extract_variable();
        //     }
        // };
        // var prefix = 'my_extension';
        // var action_name = 'show-alert';

        // var full_action_name = Jupyter.actions.register(action, action_name, prefix); // returns 'my_extension:show-alert'
        // Jupyter.toolbar.add_buttons_group([full_action_name]);
    };

    KernelExecOnCells.prototype.setup_for_new_kernel = function () {
        var that = this;
        // var kernelLanguage = Jupyter.notebook.metadata.kernelspec.language.toLowerCase();
        // var kernel_config = this.cfg.kernel_config_map[kernelLanguage];
        // if (kernel_config === undefined) {
        //     $('#' + this.mod_name + '_button').remove();
        //     alert(this.mod_log_prefix + " Sorry, can't use kernel language " + kernelLanguage + ".\n" +
        //         "Configurations are currently only defined for the following languages:\n" +
        //         Object.keys(this.cfg.kernel_config_map).join(', ') + "\n" +
        //         "See readme for more details.");
        //     // also remove keyboard shortcuts
        //     if (this.cfg.register_hotkey) {
        //         try {
        //             Jupyter.keyboard_manager.edit_shortcuts.remove_shortcut(this.cfg.hotkeys.process_selected);
        //             Jupyter.keyboard_manager.edit_shortcuts.remove_shortcut(this.cfg.hotkeys.process_all);
        //             Jupyter.keyboard_manager.command_shortcuts.remove_shortcut(this.cfg.hotkeys.process_all);
        //         } catch (err) {
        //         }
        //     }

        // } else { // kernel language is supported
        if (this.cfg.add_toolbar_button) {
            this.add_toolbar_button();
        }
        if (this.cfg.register_hotkey) {
            this.add_keyboard_shortcuts();
        }
        // Jupyter.notebook.kernel.execute(
        //     kernel_config.library, {
        //         iopub: {
        //             output: function (msg) {
        //                 return that.convert_loading_library_error_msg_to_broken_promise(msg)
        //                     .catch(
        //                         function on_failure(err) {
        //                             if (that.cfg.show_alerts_for_errors) {
        //                                 alert(err);
        //                             }
        //                             else {
        //                                 console.error(err);
        //                             }
        //                         }
        //                     );
        //             }
        //         }
        //     }, { silent: false }
        // );

    // }
    };

    KernelExecOnCells.prototype.initialize_plugin = function () {
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
                events.on("kernel_ready.Kernel", function (evt, data) {
                    console.log(that.mod_log_prefix, 'restarting for new kernel_ready.Kernel event');
                    that.setup_for_new_kernel();
                });
            }).catch(function on_error(err) {
            console.error(that.mod_log_prefix, 'error loading:', err);
        });
    };

    return {KernelExecOnCells: KernelExecOnCells};
});
