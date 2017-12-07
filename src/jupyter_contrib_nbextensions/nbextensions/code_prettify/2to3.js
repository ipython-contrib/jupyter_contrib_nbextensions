// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.
// Authors: @EWouters, @jfbercher and @jcb91
// Based on: https://github.com/jfbercher/code_prettify and
//           https://gist.github.com/takluyver/c8839593c615bb2f6e80

define(['./kernel_exec_on_cell'], function(kernel_exec_on_cell) {
    'use strict';

    var mod_name = '2to3';

    // gives default settings
    var cfg = {
        add_toolbar_button: true,
        hotkeys: {
            process_selected: 'Ctrl-M',
            process_all: 'Ctrl-Shift-M',
        },
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

    var converter = new kernel_exec_on_cell.define_plugin(mod_name, cfg);
    converter.load_ipython_extension = converter.initialize_plugin;
    return converter;

    });
