define([
    'base/js/namespace',
    'base/js/events'
], function(
    Jupyter,
    events
) {
    // define default config parameter values
    var params = {
        header_toggle : 'ctrl-h',
    };

    // updates default params with any specified in the server's config
    var update_params = function() {
        var config = Jupyter.notebook.config;
        for (var key in params){
            if (config.data.hasOwnProperty(key) ){
                params[key] = config.data[key];
            }
        }
    };

    var initialize = function () {
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

        var full_action_name = Jupyter.keyboard_manager.actions.register(action, action_name, prefix);

        // define keyboard shortcuts
        var shortcuts = {};
        shortcuts[params.header_toggle] = full_action_name;

        // register keyboard shortcuts with keyboard_manager
        Jupyter.notebook.keyboard_manager.command_shortcuts.add_shortcuts(shortcuts);
    };

    function load_ipython_extension() {
        $("head").append(
            '<style type="text/css"> .noheader { height: 100% !important }</style>');
        return Jupyter.notebook.config.loaded.then(initialize);
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
