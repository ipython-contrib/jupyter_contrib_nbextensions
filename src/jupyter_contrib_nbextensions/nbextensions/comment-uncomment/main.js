// add new configurable hotkey binding to toggle comments

define([
    'base/js/namespace',
], function(
    IPython
) {
    "use strict";

    // define default config parameter values
    var params = {
        comment_uncomment_keybinding : 'alt-c',
        comment_uncomment_indent: false,
    };

    // updates default params with any specified in the server's config
    var update_params = function() {
        var config = IPython.notebook.config;
        for (var key in params){
            if (config.data.hasOwnProperty(key) ){
                params[key] = config.data[key];
            }
        }
    };

    var initialize = function () {
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
    };

    var toggle_comment = function() {
        var cm = IPython.notebook.get_selected_cell().code_mirror;
        cm.toggleComment({ indent: params.comment_uncomment_indent });
        return false;
    };

    var load_ipython_extension = function () {
        return IPython.notebook.config.loaded.then(initialize);
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
