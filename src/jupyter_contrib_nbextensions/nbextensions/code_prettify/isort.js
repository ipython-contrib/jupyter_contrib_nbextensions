// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.
// Authors: @benjaminabel
// Based on: code_prettify extension

define(['./kernel_exec_on_cell'], function(kernel_exec_on_cell) {
    'use strict';

    var mod_name = 'isort';

    // gives default settings
    var cfg = {
        add_toolbar_button: true,
        register_hotkey: false,
        show_alerts_for_errors: false,
        button_icon: 'fa-sort',
        button_label: 'Sort imports with isort',
        kbd_shortcut_text: 'Sort imports in' // ' current cell(s)'
    };

    cfg.kernel_config_map = { // map of parameters for supported kernels
        "python": {
            "library": [
                "import isort",
                "import json",
                "def _isort_refactor_cell(src):",
                "    try:",
                "        tree = isort.SortImports(file_contents=src).output",
                "    except Exception:",
                "        return src ",
                "    else:",
                "        return str(tree)[:-1]",
            ].join('\n'),
            "prefix": "print(json.dumps(_isort_refactor_cell(u",
            "postfix": ")))"
        }
    };

    var converter = new kernel_exec_on_cell.define_plugin(mod_name, cfg);
    converter.load_ipython_extension = converter.initialize_plugin;
    return converter;

    });
