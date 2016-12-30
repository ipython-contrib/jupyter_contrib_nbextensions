// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.


define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Jupyter = require('base/js/namespace');
    var events = require('base/js/events');
    var utils = require('base/js/utils');
    var ConfigSection = require('services/config').ConfigSection;
    var CodeCell = require('notebook/js/codecell').CodeCell;

    var mod_edit_shortcuts = {};
    var mod_cmd_shortcuts = {};
    var default_kernel_config = {
        library: '',
        prefix: '',
        postfix: '',
        replacements_json_to_kernel: [],
        trim_formatted_text: true
    };
    var bigCfg = {}; // This will store the configs of calling modules ("plugins")
    // eg code_prettify, 2to3. This variable is exported by this module.

    /**
     * return a Promise which will resolve/reject based on the kernel message
     * type.
     * The returned promise will be
     *   - resolved if the message was not an error
     *   - rejected using the message's error text if msg.msg_type is "error"
     */
    function convert_error_msg_to_broken_promise (cfg, msg) {
        return new Promise(function (resolve, reject) {
            if (msg.msg_type == 'error') {
                return reject(cfg.mod_log_prefix + '\n Error: ' + msg.content.ename + '\n' + msg.content.evalue);
            }
            return resolve(msg);
        });
    }

    function get_kernel_config(cfg) {
        var kernelLanguage = Jupyter.notebook.metadata.kernelspec.language.toLowerCase();
        var kernel_config = cfg.kernel_config_map[kernelLanguage];
        // true => deep
        return $.extend(true,  {}, default_kernel_config, kernel_config);
    }

    function transform_json_string_to_kernel_string (str, kernel_config) {
        for (var ii=0; ii<kernel_config.replacements_json_to_kernel.length; ii++) {
            var from = kernel_config.replacements_json_to_kernel[ii][0];
            var to = kernel_config.replacements_json_to_kernel[ii][1];
            str = str.replace(from, to);
        }
        return str;
    }

    /**
     * construct functions as callbacks for the autoformat cell promise. This
     * is necessary because javascript lacks loop scoping, so if we don't use
     * this IIFE pattern, cell_index & cell are passed by reference, and every
     * callback ends up using the same value
     */
    function construct_cell_callbacks (cell_index, cell) {
        var on_success = function (formatted_text) {
            cell.set_text(formatted_text);
        };
        var on_failure = function (reason) {
            console.warn(
                cfg.mod_log_prefix,
                'error processing cell', cell_index + ':\n',
                reason
            );
            if (cfg.show_alerts_for_errors) {
                alert(reason);
            }
        };
        return [on_success, on_failure];
    }

    function autoformat_cells (cfg, indices) {
        if (indices === undefined) {
            indices = Jupyter.notebook.get_selected_cells_indices();
        }
        var kernel_config = get_kernel_config(cfg);
        for (var ii=0; ii<indices.length; ii++) {
            var cell_index = indices[ii];
            var cell = Jupyter.notebook.get_cell(cell_index);
            if (!(cell instanceof CodeCell)) {
                continue;
            }
            // IIFE because otherwise cell_index & cell are passed by reference
            var callbacks = construct_cell_callbacks(cell_index, cell);
            autoformat_text(cell.get_text(), kernel_config).then(callbacks[0], callbacks[1]);
        }
    }

    function autoformat_text (text, kernel_config) {
        return new Promise(function (resolve, reject) {
            kernel_config = kernel_config || get_kernel_config();
            var kernel_str = transform_json_string_to_kernel_string(
                JSON.stringify(text), kernel_config);
            Jupyter.notebook.kernel.execute(
                kernel_config.prefix + kernel_str + kernel_config.postfix,
                {iopub: {output: function (msg) {
                    return resolve(convert_error_msg_to_broken_promise(cfg, msg).then(
                        function on_success (msg) {
                            // print goes to stream text => msg.content.text
                            var formatted_text = String(JSON.parse(msg.content.text));
                            if (kernel_config.trim_formatted_text) {
                                formatted_text = formatted_text.trim();
                            }
                            return formatted_text;
                        }
                    ));
                }}},
                {silent: false}
            );
        });
    }

    function add_toolbar_button (cfg) {
        if ($('#'+cfg['extension_name']+'_button').length < 1) {
            Jupyter.toolbar.add_buttons_group([{
                'label': cfg['extension_label'], //'Code prettify',
                'icon': cfg['extension_icon'], //'fa-legal',
                'callback': function (evt) { autoformat_cells(cfg); },
                'id': cfg['extension_name']+'_button'
            }]);
        }
    }


    function setup_for_new_kernel (cfg) {
        var kernelLanguage = Jupyter.notebook.metadata.kernelspec.language.toLowerCase();
        var kernel_config = cfg.kernel_config_map[kernelLanguage];
        if (kernel_config === undefined) {
            $('#'+cfg['extension_name']+'_button').remove();
            alert(cfg.mod_log_prefix +  " Sorry, can't use kernel language " + kernelLanguage + ".\n" +
                  "Configurations are currently only defined for the following languages:\n" +
                  ', '.join(Object.keys(cfg.kernel_config_map)) + "\n" +
                  "See readme for more details.");
        } else {
            if (cfg.add_toolbar_button) {
                add_toolbar_button(cfg);
            }
           /* if (cfg.register_hotkey) {
                Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(mod_edit_shortcuts);
                Jupyter.keyboard_manager.command_shortcuts.add_shortcuts(mod_cmd_shortcuts);
            }*/
            Jupyter.notebook.kernel.execute(
                kernel_config.library,
                { iopub: { output: convert_error_msg_to_broken_promise } },
                { silent: false }
            );
        }
    }

    function main(module_name, module_prefix, module_initial_config){
        
        var cfg = module_initial_config
        cfg.mod_log_prefix = module_prefix
        cfg.mod_name = module_name
        // store the configuration for the calling module in a big map 
        // in global namespace. Otherwise, if cfg were global, it will 
        // be overwritted by subsequent module calls.
        // 
        bigCfg[cfg.mod_name] = cfg; 
        

        var base_url = utils.get_body_data("baseUrl");
        var conf_section = new ConfigSection('notebook', {base_url: base_url});
        // first, load config
        conf_section.load()
        // now update default config with that loaded from server
        .then(function on_success (config_data) {
            $.extend(true, cfg, config_data[cfg.mod_name]);
        }, function on_error (err) {
            console.warn(cfg.mod_log_prefix, 'error loading config:', err);
        })
        // next parse json config values
        .then(function on_success () {
            var parsed_kernel_cfg = JSON.parse(cfg.kernel_config_map_json);
            $.extend(cfg.kernel_config_map, parsed_kernel_cfg);
        })
        // if we failed to parse the json values in the config
        // using catch pattern, we attempt to continue anyway using defaults
        .catch(function on_error (err) {
            console.warn(
                cfg.mod_log_prefix, 'error parsing config variable',
                cfg.mod_name + '.kernel_config_map_json to a json object:',
                err
            );
        })
        // now do things which required the config to be loaded
        .then(function on_success () {
            //assign_hotkeys_from_config(cfg); // initialize hotkey (done by "plugins" now)
            // kernel may already have been loaded before we get here, in which
            // case we've missed the kernel_ready.Kernel event, so try this
            if (typeof Jupyter.notebook.kernel !== "undefined" && Jupyter.notebook.kernel !== null) {
                setup_for_new_kernel(cfg);
            }

            // on kernel_ready.Kernel, a new kernel has been started
            events.on("kernel_ready.Kernel", function(event, data) {
                console.log(cfg.mod_log_prefix, 'restarting for new kernel_ready.Kernel event');
                setup_for_new_kernel(cfg);
            });
        });
    }
        return {
        main: main, 
        autoformat_cells: autoformat_cells,
        bigCfg: bigCfg
    };
});


