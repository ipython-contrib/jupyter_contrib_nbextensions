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
    var configvals = {
        toggle_all_linenumbers_hotkey : 'Ctrl-Alt-N',
        toggle_all_linenumbers_enable_hotkey : true
    };

    // to be called once config is loaded, this updates default config vals
    // with the ones specified by the server's config file
    var update_default_config_vals = function() {
        for (var key in configvals){
            if (config.data.hasOwnProperty(key) ){
                configvals[key] = config.data[key];
            }
        }
    };


	var toggle_all = function() {
        var toolbar_button = $('#toggle_all_line_numbers');
        toolbar_button.state = !toolbar_button.state;
        var cells = IPython.notebook.get_cells();
        for(var i in cells ){
            cells[i].toggle_line_numbers(toolbar_button.state);
        }
        return false;
    };


    config.loaded.then(function() {
        // create toolbar button
        IPython.toolbar.add_buttons_group([{
            id: 'toggle_all_line_numbers',
            label: 'toggle all line numbers',
            icon: 'fa-sort-numeric-asc',
            callback: toggle_all
        }]);

        // update default config vals with the newly loaded ones
        update_default_config_vals();

        // (maybe) define hotkey
        if (configvals.toggle_all_linenumbers_enable_hotkey &&
            configvals.toggle_all_linenumbers_hotkey) {

            console.log('toggle_all_linenumbers enabling hotkey:',
                        configvals.toggle_all_linenumbers_hotkey);

            var hotkeyspec = {
                help    : 'Toggle linenumbers in all codecells',
                help_index : 'zz',
                handler : toggle_all
            };

            IPython.keyboard_manager.edit_shortcuts.add_shortcut(
                configvals.toggle_all_linenumbers_hotkey, hotkeyspec);
            IPython.keyboard_manager.command_shortcuts.add_shortcut(
                configvals.toggle_all_linenumbers_hotkey, hotkeyspec);
        }
    });


    var load_ipython_extension = function() {
        config.load();
    };

    var extension = {
        load_ipython_extension: load_ipython_extension
    };
    return extension;
});
