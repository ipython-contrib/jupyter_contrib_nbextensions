// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.
// Authors: @EWouters, @jfbercher and @jcb91
// Based on: https://github.com/jfbercher/code_prettify and
//           https://gist.github.com/takluyver/c8839593c615bb2f6e80

define(function(require, exports, module) {
    'use strict';

    var kernel_exec_on_cell = require('./kernel_exec_on_cell');

    var mod_name = '2to3';

    // gives default settings
    var cfg = {
        add_toolbar_button: true,
        hotkey: 'Ctrl-M',
        process_all_hotkey: 'Ctrl-Shift-M',
        register_hotkey: true,
        show_alerts_for_errors: true,
        button_icon: 'fa-space-shuttle',
        button_label: 'Convert Python 2 to 3',
        kbd_shortcut_text: 'Convert Python 2 to 3 in' // ' current cell(s)'
    };

    cfg.kernel_config_map = { // map of parameters for supported kernels
        "python": {
            "library": [
                "import lib2to3.refactor, json",
                "_2to3_refactoring_tool = lib2to3.refactor.RefactoringTool(",
                "    set(lib2to3.refactor.get_fixers_from_package('lib2to3.fixes')))",
                "def _2to3_refactor_cell(src):",
                "    try:",
                "        tree = _2to3_refactoring_tool.refactor_string(src+'\\n', '<dummy_name>')",
                "    except (lib2to3.pgen2.parse.ParseError, lib2to3.pgen2.tokenize.TokenError):",
                "        return src ",
                "    else:",
                "        return str(tree)[:-1]",
            ].join('\n'),
            "prefix": "print(json.dumps(_2to3_refactor_cell(u",
            "postfix": ")))"
        }
    };
    // Keyboard shortcuts ---------
    var assign_hotkeys = function(plugin) {
        var kbd_shortcut_text = plugin.cfg.kbd_shortcut_text;
        var that = plugin;

        var autofmt = function(mod_name, indices) {
            if (indices === undefined)
                return plugin.autoformat_cells()
            else
                return plugin.autoformat_cells(indices)
        }

        plugin.mod_edit_shortcuts[plugin.cfg.hotkey] = {
            help: kbd_shortcut_text + ' selected cell(s)',
            help_index: 'yf',
            handler: function(evt) { autofmt('2to3') },
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
                autofmt('2to3', indices);
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
