// add new configurable hotkey binding to toggle comments

define([
    'base/js/namespace',
    'services/config',
    'base/js/utils'
], function(
    IPython,
    configmod,
    utils
) {
    "use strict";

    // create config object to load parameters
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    // define default config parameter values
    var params = {
        comment_uncomment_keybinding : 'alt-c',
    };

    // updates default params with any specified in the server's config
    var update_params = function() {
        for (var key in params){
            if (config.data.hasOwnProperty(key) ){
                params[key] = config.data[key];
            }
        }
    };

    config.loaded.then(function() {
        // update defaults
        update_params();

        // register actions with ActionHandler instance
        var prefix = 'auto';
        var name = 'toggle-comment';
        var action = {
            icon: 'fa-comment-o',
            help    : 'Toggle comments',
            help_index : 'eb',
            id : 'read_only_codecell',
            handler : toggle_comment
        };
        var action_full_name = IPython.keyboard_manager.actions.register(action, name, prefix);

        // define keyboard shortcuts
        var edit_mode_shortcuts = {};
        edit_mode_shortcuts[params.comment_uncomment_keybinding] = action_full_name;

        // register keyboard shortcuts with keyboard_manager
        IPython.notebook.keyboard_manager.edit_shortcuts.add_shortcuts(edit_mode_shortcuts);
    });

    var toggle_comment = function() {
        var cm = IPython.notebook.get_selected_cell().code_mirror;
        var from = cm.getCursor("start"), to = cm.getCursor("end");
        if (!cm.uncomment(from, to)) cm.lineComment(from, to);
        return false;
    };

    var load_ipython_extension = function () {
        // load config to trigger keybinding registration
        config.load();
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
