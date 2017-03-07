define([
    'base/js/namespace',
    'services/config',
    'base/js/utils',
    'base/js/events'
], function(
    Jupyter,
    configmod,
    utils,
    events
) {

    // create config object to load parameters
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    // define default config parameter values
    var params = {
        header_toggle : 'ctrl-h',
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

        // register action
        var toggle_header = function (event) {
            if (Jupyter.notebook.mode == 'command') {
                $('#header').toggle();
                $('div#site').toggleClass('noheader');
                events.trigger('toggle-all-headers');
                return false;
            }
            return true;
        };

        var action = {
            icon: 'fa-gear',
            help: 'Toggle All Headers',
            help_index: 'zz',
            handler: toggle_header,
        };
        var prefix = 'hide_header';
        var action_name = 'toggle';

        var full_action_name = Jupyter.actions.register(action, action_name, prefix);

        // define keyboard shortcuts
        var shortcuts = {};
        shortcuts[params.header_toggle] = full_action_name;

        // register keyboard shortcuts with keyboard_manager
        Jupyter.notebook.keyboard_manager.command_shortcuts.add_shortcuts(shortcuts);
    });

    function load_ipython_extension() {
        $("head").append(
            '<style type="text/css"> .noheader { height: 100% !important }</style>');
        config.load();
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
