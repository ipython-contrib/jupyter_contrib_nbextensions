// toggle on/off linenumber display in all codecells

define([
    'jquery',
    'base/js/namespace',
    'base/js/utils',
    'services/config'
], function(
    $,
    Jupyter,
    utils,
    configmod
) {
    "use strict";

    // create config object to load parameters
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    // define default values for config parameters
    var params = {
        toggle_all_linenumbers_hotkey : 'Alt-N',
        toggle_all_linenumbers_enable_hotkey : true
    };

    // to be called once config is loaded, this updates default config vals
    // with the ones specified by the server's config file
    var update_params = function() {
        for (var key in params) {
            if (config.data.hasOwnProperty(key) ){
                params[key] = config.data[key];
            }
        }
    };

    var toggle_all = function() {
        var toolbar_button = $('#toggle_all_linenumbers');
        toolbar_button.toggleClass('active', !toolbar_button.hasClass('active'));
        var cells = Jupyter.notebook.get_cells();
        for(var i in cells ){
            cells[i].toggle_line_numbers();
        }
    };

    // define action, register with ActionHandler instance
    var prefix = 'auto';
    var action_name = 'toggle-all-line-numbers';
    var action = {
        icon: 'fa-list-ol',
        help: 'Toggle linenumbers in all codecells',
        help_index : 'zz',
        id: 'toggle_all_linenumbers',
        handler: toggle_all
    };
    var action_full_name; // will be set on registration

    config.loaded.then(function() {
        // update default config vals with the newly loaded ones
        update_params();

        // register actions with ActionHandler instance
        action_full_name = Jupyter.keyboard_manager.actions.register(action, action_name, prefix);

        // create toolbar button
        Jupyter.toolbar.add_buttons_group([action_full_name]);

        // (maybe) define hotkey
        if (params.toggle_all_linenumbers_enable_hotkey &&
            params.toggle_all_linenumbers_hotkey) {

            console.log('toggle_all_linenumbers enabling hotkey:',
                        params.toggle_all_linenumbers_hotkey);

            Jupyter.keyboard_manager.edit_shortcuts.add_shortcut(
                params.toggle_all_linenumbers_hotkey, action_full_name);
            Jupyter.keyboard_manager.command_shortcuts.add_shortcut(
                params.toggle_all_linenumbers_hotkey, action_full_name);
        }
    });

    var load_ipython_extension = function() {
        config.load();
    };

    var extension = {
        load_ipython_extension : load_ipython_extension
    };
    return extension;
});
