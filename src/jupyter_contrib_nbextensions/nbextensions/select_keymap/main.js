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

    var previous_mode = "";

    var available_keymaps = [
        "default",
        "emacs",
        "vim",
        "sublime"
    ];

    var starting_state = {
        extraKeys: {},
        edit_shortcuts: {},
        command_shortcuts: {}
    };

    var cm_default = Cell.Cell.options_default.cm_config;
    var edit_shortcuts = Jupyter.keyboard_manager.edit_shortcuts;
    var command_shortcuts = Jupyter.keyboard_manager.command_shortcuts;

    var mods = {
        vim: {
            add: {
                extraKeys: {
                    "Esc": "leave_current_mode",
                    "Ctrl-[": "leave_current_mode"
                },
                command_shortcuts: {
                    "ctrl-c": "jupyter-notebook:interrupt-kernel",
                    "ctrl-z": "jupyter-notebook:restart-kernel",

                    "d,d": "jupyter-notebook:cut-cell",
                    "y,y": "jupyter-notebook:copy-cell",
                    "u": "jupyter-notebook:undo-cell-deletion",

                    "p": "jupyter-notebook:paste-cell-below",
                    "shift-p": "jupyter-notebook:paste-cell-above",

                    "o": "jupyter-notebook:insert-cell-below",
                    "shift-o": "jupyter-notebook:insert-cell-above",

                    "i": "jupyter-notebook:enter-edit-mode",
                    "enter": "jupyter-notebook:enter-edit-mode",

                    "shift-j": "jupyter-notebook:move-cell-down",
                    "shift-k": "jupyter-notebook:move-cell-up",

                    "shift-/": "jupyter-notebook:show-keyboard-shortcuts",
                    "h": "jupyter-notebook:toggle-cell-output-collapsed",
                    "shift-h": "jupyter-notebook:toggle-cell-output-scrolled",

                    "`": "jupyter-notebook:change-cell-to-code",
                    "0": "jupyter-notebook:change-cell-to-markdown"
                },
                edit_shortcuts: {
                    "shift-esc": "jupyter-notebook:enter-command-mode"
                }
            },
            remove: {
                edit_shortcuts: ["esc"]
            },
            custom: function() {
                // Disable keyboard manager for code mirror dialogs, handles ':'
                // triggered ex-mode dialog box in vim mode.
                // Manager is re-enabled by re-entry into notebook edit mode +
                // cell normal mode after dialog closes
                this.openDialog = CodeMirror.prototype.openDialog;

                function openDialog_keymap_wrapper(target, template, callback, options) {
                    Jupyter.keyboard_manager.disable();
                    return target.call(this, template, callback, options);
                }

                CodeMirror.defineExtension("openDialog", _.wrap(this.openDialog,
                    openDialog_keymap_wrapper));
            },
            custom_teardown: function() {
                CodeMirror.defineExtension("openDialog", this.openDialog);
            }
        },
        emacs: {
            add: {
                extraKeys: {
                    "Ctrl-Y": "yank_no_selection"
                },
                command_shortcuts: {
                    "ctrl-n": "jupyter-notebook:select-next-cell",
                    "ctrl-p": "jupyter-notebook:select-previous-cell"
                }
            },
            remove: {
                edit_shortcuts: ["ctrl-shift-minus"],
                keyMap: ["Ctrl-V"]
            }
        }
    };

    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {
        base_url: base_url
    });

    config.load();

    var conf = {
        line_wrap: true
    };

    // make sure config is loaded before making changes
    config.loaded.then(function() {
        for (var key in conf) {
            var config_key = "select_keymap_" + key;
            if (config.data.hasOwnProperty(config_key)) {
                conf[key] = config.data[config_key];
            }
        }
        save_starting_state();
        // initialize last stored value or default
        switch_keymap(window.localStorage.getItem("jupyter_keymap") || "default");
    });

    function flatten_shortcuts(shortcut_tree) {
        var result = {};
        for (var p in shortcut_tree) {
            if (typeof(shortcut_tree[p]) == "string") {
                result[p] = shortcut_tree[p];
            } else {
                var subresult = flatten_shortcuts(shortcut_tree[p]);
                for (var subp in subresult) {
                    result[p + "," + subp] = subresult[subp];
                }
            }
        }
        return result;
    }

    function update_shortcuts(shortcut_manager, updated_shortcuts) {
        var current_shortcuts = _.invert(flatten_shortcuts(shortcut_manager._shortcuts));

        for (var shortcut_action in _.invert(updated_shortcuts)) {
            if (_.has(current_shortcuts, shortcut_action) &&
                shortcut_manager.get_shortcut(current_shortcuts[shortcut_action])) {

                shortcut_manager.remove_shortcut(current_shortcuts[shortcut_action]);
            }
        }

        shortcut_manager.add_shortcuts(updated_shortcuts);
    }

    // start custom CodeMirror command definitions
    function leave_current_mode(cm) {
        if (cm.state.vim.insertMode) {
            // Move from insert mode into command mode.
            CodeMirror.keyMap['vim-insert'].call('Esc', cm);
        } else if (cm.state.vim.visualMode) {
            // Move from visual mode to command mode.
            CodeMirror.keyMap['vim'].call('Esc', cm);
        } else {
            // Move to notebook command mode.
            Jupyter.notebook.command_mode();
            Jupyter.notebook.focus_cell();
        }
    };

    var orig_ctrl_y = CodeMirror.keyMap.emacs["Ctrl-Y"];

    function yank_no_selection(cm) {
        orig_ctrl_y(cm);
        // remove selection after yank
        cm.setSelection(cm.getCursor(), cm.getCursor());
    };

    CodeMirror.commands.yank_no_selection = yank_no_selection;
    CodeMirror.commands.leave_current_mode = leave_current_mode;
    // end custom CodeMirror command definitions

    function create_menu() {
        var menu = [
            '<li class="divider"></li>',
            '<li class="dropdown-submenu">',
            '<a href="#">Keymaps</a>',
            '<ul class="dropdown-menu" id="keymap_menu">'
        ];

        available_keymaps.forEach(function(keymap) {
            menu.push(`<li><a id="keymap-${keymap}" href="#" title="Toggle ${keymap} keybindings" onClick="switch_keymap('${keymap}')" style="text-transform: capitalize;">${keymap}</a></li>`);
        });

        menu.push('</ul></li>');

        $('#move_cell_down').after(menu.join('\n'));
    }

    function update_cm_instance_to_defaults(cell) {
        var cm = cell.code_mirror;
        cm.setOption("vimMode", cm_default["vimMode"]);
        cm.setOption("lineWrapping", cm_default["lineWrapping"]);
        cm.setOption("keyMap", cm_default["keyMap"]);
        cm.setOption("extraKeys", cm_default["extraKeys"]);
    };

    function highlight_selection(mode) {
        $("[id^=keymap]").css('font-weight', 'normal');
        $('[id=keymap-' + mode + ']').css('font-weight', 'bold');
    }

    function reset_state() {
        // FIXME: if this extension loads before other extensions that alter
        // key shortcuts, this will probably reset those as well
        cm_default.extraKeys = _.clone(starting_state.extraKeys);
        update_shortcuts(edit_shortcuts, starting_state.edit_shortcuts);
        update_shortcuts(command_shortcuts, starting_state.command_shortcuts);
        var prev_mode_mods = mods[previous_mode];
        if (prev_mode_mods && prev_mode_mods.custom_teardown)
            prev_mode_mods.custom_teardown();
    }

    function save_starting_state() {
        starting_state.extraKeys = _.clone(cm_default.extraKeys);
        starting_state.edit_shortcuts = flatten_shortcuts(edit_shortcuts._shortcuts);
        starting_state.command_shortcuts = flatten_shortcuts(command_shortcuts._shortcuts);
    }

    function add_bindings(add, mode) {
        _.extend(CodeMirror.keyMap[mode], add.keyMap);
        _.extend(cm_default.extraKeys, add.extraKeys);

        if (add.command_shortcuts)
            update_shortcuts(command_shortcuts, add.command_shortcuts);

        if (add.edit_shortcuts)
            update_shortcuts(edit_shortcuts, add.edit_shortcuts);
    }

    function remove_bindings(remove, mode) {
        _.forEach(remove.keyMap, function(key) {
            delete CodeMirror.keyMap[mode][key];
        });

        _.forEach(remove.extraKeys, function(key) {
            delete cm_default.extraKeys[key];
        });

        _.forEach(remove.edit_shortcuts, function(key) {
            edit_shortcuts.remove_shortcut(key);
        });

        _.forEach(remove.command_shortcuts, function(key) {
            command_shortcuts.remove_shortcut(key);
        });
    }

    function change_defaults(mode) {
        // make changes to cm defaults
        cm_default.keyMap = mode;
        cm_default.vimMode = mode == 'vim';
        cm_default.lineWrapping = conf.line_wrap;

        var mode_mods = mods[mode];
        if (mode_mods) {
            if (mode_mods.add)
                add_bindings(mode_mods.add, mode);

            if (mode_mods.remove)
                remove_bindings(mode_mods.remove, mode);

            if (mode_mods.custom)
                mode_mods.custom();
        }
    }

    function change_cells_to_defaults() {
        Jupyter.notebook.get_cells().map(update_cm_instance_to_defaults);
    }

    function switch_keymap(mode) {
        // don't run if selecting currently selected mode
        if (mode == previous_mode) return;

        // store selection in localStorage for later retrieval
        window.localStorage.setItem('jupyter_keymap', mode);

        reset_state();

        change_defaults(mode);

        change_cells_to_defaults();

        highlight_selection(mode);

        previous_mode = mode;
    }

    window.switch_keymap = switch_keymap;

    return {
        load_ipython_extension: create_menu
    };
});