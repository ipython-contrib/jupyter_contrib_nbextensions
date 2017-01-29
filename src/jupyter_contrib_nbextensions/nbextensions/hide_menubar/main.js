define([
    'base/js/namespace'
], function(
    Jupyter
) {

    function load_ipython_extension() {
        $("head").append(
            '<style type="text/css"> .nomenubar { height: 100% !important }</style>');
        var toggle_menubar = function (event) {
            if (Jupyter.notebook.mode == 'command') {
                $('#header').toggle();
                $('div#site').toggleClass('nomenubar');
                return false;
            }
            return true;
        };

        var action = {
            icon: 'fa-gear',
            help: 'Toggle menubar',
            help_index: 'zz',
            handler: toggle_menubar,
        };
        var prefix = 'hide_menubar';
        var action_name = 'toggle';

        var full_action_name = Jupyter.actions.register(action, action_name, prefix);
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut('ctrl-h', full_action_name);
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
