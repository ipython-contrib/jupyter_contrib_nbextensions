// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.

define(function(require, exports, module) {
    'use strict';

    var Jupyter = require('base/js/namespace');
    var events = require('base/js/events');
    var utils = require('base/js/utils');
    var ConfigSection = require('services/config').ConfigSection;
    var CodeCell = require('notebook/js/codecell').CodeCell;

    var mod_name = 'code_prettify';
    var mod_log_prefix = '[' + mod_name + ']';
    var mod_edit_shortcuts = {};
    var default_kernel_config = {
        library: '',
        prefix: '',
        postfix: '',
        replacements_json_to_kernel: [],
        trim_formatted_text: true
    };

    // gives default settings
    var cfg = {
        add_toolbar_button: true,
        hotkey: 'Ctrl-L',
        register_hotkey: true,
        show_alerts_for_errors: true,
    };

    cfg.kernel_config_map = { // map of parameters for supported kernels
        "python": {
            "library": "import json\nimport yapf.yapflib.yapf_api",
            "prefix": "print(json.dumps(yapf.yapflib.yapf_api.FormatCode(u",
            "postfix": ")[0]))"
        },
        "r": {
            "library": "library(formatR)\nlibrary(jsonlite)",
            "prefix": "cat(paste(tidy_source(text=",
            "postfix": ")[['text.tidy']], collapse='\n'))"
        },
        "javascript": {
            "library": "",
            // we do this + trick to prevent require.js attempting to load js-beautify when processing the AMI-style load for this module
            "prefix": "console.log(JSON.stringify(require(" + "'js-beautify').js_beautify(",
            "postfix": ")));"
        }
    };

    /**
     * return a Promise which will resolve/reject based on the kernel message
     * type.
     * The returned promise will be
     *   - resolved if the message was not an error
     *   - rejected using the message's error text if msg.msg_type is "error"
     */
    function convert_error_msg_to_broken_promise (msg) {
        return new Promise(function (resolve, reject) {
            if (msg.msg_type == 'error') {
                return reject(mod_log_prefix + '\n Error: ' + msg.content.ename + '\n' + msg.content.evalue);
            }
            return resolve(msg);
        });
    }

    function get_kernel_config() {
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
                mod_log_prefix,
                'error prettifying cell', cell_index + ':\n',
                reason
            );
            if (cfg.show_alerts_for_errors) {
                alert(reason);
            }
        };
        return [on_success, on_failure];
    }

    function autoformat_cells (indices) {
        if (indices === undefined) {
            indices = Jupyter.notebook.get_selected_cells_indices();
        }
        var kernel_config = get_kernel_config();
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
                    return resolve(convert_error_msg_to_broken_promise(msg).then(
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

    function add_toolbar_button () {
        if ($('#code_prettify_button').length < 1) {
            Jupyter.toolbar.add_buttons_group([{
                'label': 'Code prettify',
                'icon': 'fa-legal',
                'callback': function (evt) { autoformat_cells(); },
                'id': 'code_prettify_button'
            }]);
        }
    }

    function assign_hotkeys_from_config () {
        mod_edit_shortcuts[cfg.hotkey] = {
            help: "code prettify",
            help_index: 'yf',
            handler: function (evt) { autoformat_cells(); },
        };
    }

    function setup_for_new_kernel () {
        var kernelLanguage = Jupyter.notebook.metadata.kernelspec.language.toLowerCase()
        var kernel_config = cfg.kernel_config_map[kernelLanguage];
        if (kernel_config === undefined) {
            $('#code_prettify_button').remove();
            alert(mod_log_prefix +  " Sorry, can't use kernel language " + kernelLanguage + ".\n" +
                  "Configurations are currently only defined for the following languages:\n" +
                  ', '.join(Object.keys(cfg.kernel_config_map)) + "\n" +
                  "See readme for more details.");
        } else {
            if (cfg.add_toolbar_button) {
                add_toolbar_button();
            }
            if (cfg.register_hotkey) {
                Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(mod_edit_shortcuts);
            }
            Jupyter.notebook.kernel.execute(
                kernel_config.library,
                { iopub: { output: convert_error_msg_to_broken_promise } },
                { silent: false }
            );
        }
    }

    function load_notebook_extension () {
        var base_url = utils.get_body_data("baseUrl");
        var conf_section = new ConfigSection('notebook', {base_url: base_url});
        // first, load config
        conf_section.load()
        // now update default config with that loaded from server
        .then(function on_success (config_data) {
            $.extend(true, cfg, config_data[mod_name]);
        }, function on_error (err) {
            console.warn(mod_log_prefix, 'error loading config:', err);
        })
        // now do things which required the config to be loaded
        .then(function on_success () {
            assign_hotkeys_from_config(); // initialize hotkey
            // kernel may already have been loaded before we get here, in which
            // case we've missed the kernel_ready.Kernel event, so try this
            if (typeof Jupyter.notebook.kernel !== "undefined" && Jupyter.notebook.kernel != null) {
                setup_for_new_kernel();
            }

            // on kernel_ready.Kernel, a new kernel has been started
            events.on("kernel_ready.Kernel", function(event, data) {
                console.log(mod_log_prefix, 'restarting for new kernel_ready.Kernel event');
                setup_for_new_kernel();
            });
        });
    }

    return {
        load_ipython_extension: load_notebook_extension
    };
});
