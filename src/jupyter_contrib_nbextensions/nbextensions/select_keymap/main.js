// change the mode of all current and future CodeMirror instances

define([
    'base/js/namespace',
    'base/js/utils',
    'notebook/js/cell',
    'services/config',
    'codemirror/lib/codemirror',
    'codemirror/keymap/emacs',
    'codemirror/keymap/vim',
    'codemirror/keymap/sublime'
], function(Jupyter, utils, Cell, configmod, CodeMirror) {
    "use_strict";

    var available_keymaps = [
        'default',
        'emacs',
        'vim',
        'sublime'
    ];

    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {
        base_url: base_url
    });

    config.load();

    var conf = {
        remove_ctrl_shft_minus: true,
        override_ctrl_y: true,
        line_wrap: true
    };

    // make sure config is loaded before making changes
    config.loaded.then(function() {
        for (var key in conf) {
            var config_key = 'select_keymap_' + key;
            if (config.data.hasOwnProperty(config_key)) {
                conf[key] = config.data[config_key];
            }
        }
        // initialize last stored value or default
        switch_keymap(window.localStorage.getItem('jupyter_keymap') || 'default');
    });

    // override default: don't highlight text after pasting
    var orig_ctrl_y = CodeMirror.keyMap.emacs["Ctrl-Y"];

    function mod_ctrl_y(cm) {
        orig_ctrl_y(cm);
        cm.setSelection(cm.getCursor(), cm.getCursor());
    };

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function create_menu() {
        var menu = [
            '<li class="dropdown">',
            '<a class="dropdown-toggle" data-toggle="dropdown" href="#">Keymaps</a>',
            '<ul class="dropdown-menu" id="keymap_menu">'
        ];

        available_keymaps.forEach(function(keymap) {
            var cap_keymap = capitalize(keymap);
            menu.push(`<li><a id="keymap-${keymap}" href="#" title="Toggle ${cap_keymap} Keybindings" onClick="switch_keymap('${keymap}')">${cap_keymap}</a></li>`);
        });

        menu.push('</ul></li>');

        $('#help_menu').parent().before(menu.join("\n"));
    }

    function highlight_selection(mode) {
        $("[id^=keymap]").css('font-weight', 'normal');
        $('[id=keymap-' + mode + ']').css('font-weight', 'bold');
    }

    function change_cells(mode) {
        // change existing cells
        function cell_to_mode(c) {
            var cell = c.code_mirror;
            cell.setOption('keyMap', mode);
            cell.setOption('lineWrapping', conf.line_wrap);

            var extraKeys = cell.getOption('extraKeys');

            if (conf.override_ctrl_y) {
                if (mode == 'emacs') {
                    // make changes
                    extraKeys["Ctrl-Y"] = mod_ctrl_y;
                } else if (extraKeys["Ctrl-Y"]) {
                    // undo changes
                    // FIXME: could cause problems for custom extrakeys
                    delete extraKeys["Ctrl-Y"];
                }
            }
        };

        Jupyter.notebook.get_cells().map(cell_to_mode);
    }

    function change_defaults(mode) {
        // set defaults
        var cell_config = Cell.Cell.options_default.cm_config;

        cell_config.keyMap = mode;
        cell_config.lineWrapping = conf.line_wrap;

        if (conf.override_ctrl_y) {
            if (mode == 'emacs') {
                // make changes
                cell_config.extraKeys["Ctrl-Y"] = mod_ctrl_y;
            } else if (cell_config.extraKeys["Ctrl-Y"]) {
                // undo changes
                // FIXME: could cause problems for custom extrakeys, should be able to restore
                delete cell_config.extraKeys["Ctrl-Y"];
            }
        }

        if (conf.remove_ctrl_shft_minus) {
            var shortcuts = Jupyter.keyboard_manager.edit_shortcuts;
            if (mode == 'emacs') {
                // make changes
                shortcuts.remove_shortcut('ctrl-shift-minus');
            } else {
                // undo changes
                // FIXME: could cause problems for custom shortcuts, should be able to restore
                shortcuts.set_shortcut('ctrl-shift-minus', 'jupyter-notebook:split-cell-at-cursor');
            }
        }
    }

    function switch_keymap(mode) {
        // save selection in localStorage for later retrieval
        window.localStorage.setItem('jupyter_keymap', mode);

        highlight_selection(mode);
        change_defaults(mode);
        change_cells(mode);
    }

    window.switch_keymap = switch_keymap;

    return {
        load_ipython_extension: create_menu
    };
});