// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.
// Authors: @jfbercher and @jcb91

define(function(require, exports, module) {
    'use strict';

    var kernel_exec_on_cell = require('./kernel_exec_on_cell');

    var mod_name = 'code_prettify';

    // gives default settings
    var cfg = {
        add_toolbar_button: true,
        hotkey: 'Ctrl-L',
        process_all_hotkey: 'Ctrl-Shift-L',
        register_hotkey: true,
        show_alerts_for_errors: true,
        button_label: 'Code prettify',
        button_icon: 'fa-legal',
        kbd_shortcut_text: 'Code prettify',
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

    // Keyboard shortcuts ---------
    var assign_hotkeys = function(plugin) {

            var autofmt = function(mod_name, indices) {
                if (indices === undefined)
                    return plugin.autoformat_cells()
                else
                    return plugin.autoformat_cells(indices)
            }


            var kbd_shortcut_text = plugin.cfg.kbd_shortcut_text;
            var that = plugin;

            plugin.mod_edit_shortcuts[plugin.cfg.hotkey] = {
                help: kbd_shortcut_text + ' selected cell(s)',
                help_index: 'yf',
                handler: function(evt) { autofmt('code_prettify') },
            };

            plugin.mod_edit_shortcuts[plugin.cfg.process_all_hotkey] = {
                help: kbd_shortcut_text + " the whole notebook",
                help_index: 'yf',
                handler: function(evt) {
                    var indices = [],
                        N = Jupyter.notebook.ncells();
                    for (var i = 0; i < N; i++) {
                        indices.push(i);
                    }
                    autofmt('code_prettify', indices);
                },
            };

            // use modify-all hotkey in either command or edit mode
            plugin.mod_cmd_shortcuts[plugin.cfg.process_all_hotkey] = plugin.mod_edit_shortcuts[plugin.cfg.process_all_hotkey];

            if (plugin.cfg.register_hotkey) {
                Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(plugin.mod_edit_shortcuts);
                Jupyter.keyboard_manager.command_shortcuts.add_shortcuts(plugin.mod_cmd_shortcuts);
            }

        }

    var plugin = new kernel_exec_on_cell.define_plugin(mod_name, cfg);
    assign_hotkeys(plugin);
    plugin.load_ipython_extension = plugin.initialize_plugin;
    return plugin;
});
