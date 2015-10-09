// toggle on/off linenumber display in all codecells

define([
    'jquery',
    'base/js/namespace',
    'base/js/utils',
    'services/config'
], function(
    $,
    IPython,
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
        var cells = IPython.notebook.get_cells();
        for(var i in cells ){
            cells[i].toggle_line_numbers();
        }
    };

    // define actions
    var toggle_all_linenumbers_actions = {
        'toggle-all-line-numbers' : {
            icon: 'fa-sort-numeric-asc',
            help: 'Toggle linenumbers in all codecells',
            help_index : 'zz',
            id: 'toggle_all_linenumbers',
            handler : toggle_all
        }
    };

    config.loaded.then(function() {
        // update default config vals with the newly loaded ones
        update_params();

        // (maybe) define hotkey
        if (params.toggle_all_linenumbers_enable_hotkey &&
            params.toggle_all_linenumbers_hotkey) {

            console.log('toggle_all_linenumbers enabling hotkey:',
                        params.toggle_all_linenumbers_hotkey);

            IPython.keyboard_manager.edit_shortcuts.add_shortcut(
                params.toggle_all_linenumbers_hotkey, 'auto.toggle-all-line-numbers');
            IPython.keyboard_manager.command_shortcuts.add_shortcut(
                params.toggle_all_linenumbers_hotkey, 'auto.toggle-all-line-numbers');
        }
    });

    var register_actions = function(actions, prefix) {
        prefix = prefix || 'auto';
        for (var name in actions) {
            if (actions.hasOwnProperty(name)) {
                IPython.notebook.keyboard_manager.actions.register(
                    actions[name], name, prefix
                );
            }
        }
    };

    var load_ipython_extension = function() {

        // register actions with ActionHandler instance
        register_actions(toggle_all_linenumbers_actions);

        // create toolbar button
        IPython.toolbar.add_buttons_group([{
            id: 'toggle_all_linenumbers',
            label: 'toggle all line numbers',
            icon: 'fa-sort-numeric-asc',
            callback: toggle_all
        }]);

        config.load();
    };

    var extension = {
        load_ipython_extension : load_ipython_extension
    };
    return extension;
});
