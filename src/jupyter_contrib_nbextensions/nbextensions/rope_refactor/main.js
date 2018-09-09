define(['./kernel_exec_on_cell'], function (kernel_exec_on_cell) {
    function load_ipython_extension() {
        'use strict';

        var mod_name = 'rope_refactor';

        // gives default settings
        var cfg = {
            add_toolbar_button: true,
            hotkeys: {
                rename: 'shift-F6',
                extract_variable: 'alt-meta-v',
                extract_method: 'alt-meta-m',
                inline: 'alt-meta-n',
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

        new kernel_exec_on_cell.RopeRefactorer(mod_name, cfg).initialize_plugin();
    };
    return { load_ipython_extension: load_ipython_extension };
});