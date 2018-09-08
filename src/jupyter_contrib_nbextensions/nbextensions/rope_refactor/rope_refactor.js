// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.
// Authors: @Undrinkable

define(['./kernel_exec_on_cell'], function(kernel_exec_on_cell) {
    'use strict';

    var mod_name = 'rope_refactor';

    // gives default settings
    var cfg = {
        add_toolbar_button: true,
        hotkeys: {
            rename: 'Shift-F6',
            extract_variable: 'Cmd+Alt+V',
            process_selected: 'Ctrl-L',
            process_all: 'Ctrl-Shift-L',
        },
        register_hotkey: true,
        show_alerts_for_errors: true,
        button_label: 'Rename',
        button_icon: 'fa-legal',
        kbd_shortcut_text: 'Rename',
    };

    cfg.kernel_config_map = { // map of parameters for supported kernels
        "python": {
            "library": "import rope_refactor",
            "prefix": "print(json.dumps(rope_refactor.refactor(u",
            "postfix": ")))"
        }
    };

 
    var prettifier = new kernel_exec_on_cell.KernelExecOnCells(mod_name, cfg);
    prettifier.load_ipython_extension = prettifier.initialize_plugin;
    return prettifier;
});
