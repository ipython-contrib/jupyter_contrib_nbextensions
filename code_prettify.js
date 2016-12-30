// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.
// Authors: @jfbercher and @jcb91

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Jupyter = require('base/js/namespace');
    var kernel_exec_on_cell = require('nbextensions/code_prettify/kernel_exec_on_cell')

    var mod_name = 'code_prettify';
    var mod_log_prefix = '[' + mod_name + ']';

    // gives default settings
    var cfg = {
        add_toolbar_button: true,
        hotkey: 'Ctrl-L',
        process_all_hotkey: 'Ctrl-Shift-L',
        register_hotkey: true,
        show_alerts_for_errors: true,
        extension_name: 'code_prettify',
        extension_label: 'Code prettify',
        extension_icon: 'fa-legal'
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
    // set default json string, will later be updated from config
    // before it is parsed into an object
    cfg.kernel_config_map_json = JSON.stringify(cfg.kernel_config_map);

    function assign_hotkeys_from_config(cfg) {

        var cfg_code_prettify = cfg;
        var mod_edit_shortcuts = {};
        var mod_cmd_shortcuts = {};

        mod_edit_shortcuts[cfg.hotkey] = {
            help: "code prettify",
            help_index: 'yf',
            handler: function(evt) {
                return kernel_exec_on_cell.autoformat_cells(cfg_code_prettify);
            },
        };

        mod_edit_shortcuts[cfg.process_all_hotkey] = {
            help: "code prettify the whole notebook",
            help_index: 'yf',
            handler: function(evt) {
                return function() {
                    var indices = [];
                    var N = Jupyter.notebook.ncells();
                    for (var i = 0; i <= N; i++) {
                        indices.push(i);
                    }
                    kernel_exec_on_cell.autoformat_cells(cfg_code_prettify, indices);
                }
            }(),
        };
        mod_cmd_shortcuts[cfg.process_all_hotkey] = mod_edit_shortcuts[cfg.process_all_hotkey]
        if (cfg.register_hotkey) {
            Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(mod_edit_shortcuts);
            Jupyter.keyboard_manager.command_shortcuts.add_shortcuts(mod_cmd_shortcuts);
        }
    }

    function load_notebook_extension () {
          console.log("Executing kernel_exec_on_cell load_ipython")
          kernel_exec_on_cell.main(mod_name, mod_log_prefix, cfg);
          //kernel_exec_on_cell.
          assign_hotkeys_from_config(kernel_exec_on_cell.bigCfg['code_prettify']);
            }

    return {
        load_ipython_extension: load_notebook_extension
    };
});
