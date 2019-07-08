
define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'base/js/utils',
    './planner'
], function(Jupyter, $, requirejs, events, utils, planner) {
    "use strict";

    var load_ipython_extension = function() {

        var planner1 = new planner();

        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Customise font',
                'icon'   : 'fas fa-font',
                'handler': function () {
                    //TODO
                }
            }, 'customise-font', 'accessibility-toolbar'),

            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Spell Checker',
                'icon'   : 'fas fa-check',
                'handler': function () {
                    //TODO
                }
            }, 'spell-checker', 'accessibility-toolbar'),

            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Voice Control',
                'icon'   : 'fas fa-microphone',
                'handler': function () {
                    //TODO
                }
            }, 'voice-control', 'accessibility-toolbar'),

            Jupyter.keyboard_manager.actions.register ({
                'help': 'Planner',
                'icon': 'fas fa-sticky-note',
                'handler': function () {
                    planner1.toggle_planner();
                }
            }, 'planner', 'accessibility-toolbar'),

            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Custom themes',
                'icon'   : 'fas fa-clone',
                'handler': function () {
                    //TODO
                }
            }, 'customise-theme', 'accessibility-toolbar'),

        ]);
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
