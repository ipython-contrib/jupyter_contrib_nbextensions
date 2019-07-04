
define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'base/js/utils',
], function(Jupyter, $, requirejs, events, utils) {
    "use strict";

    var load_ipython_extension = function() {
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Customise font',
                'icon'   : 'fas fa-font',
                'handler': function () {
                    //TODO
                }
            }, 'customise-font', 'toolbar'),
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Spell Checker',
                'icon'   : 'fas fa-check',
                'handler': function () {
                    //TODO
                }
            }, 'spell-checker', 'toolbar'),
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Voice Control',
                'icon'   : 'fas fa-microphone',
                'handler': function () {
                    //TODO
                }
            }, 'voice-control', 'toolbar'),
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Planner',
                'icon'   : 'fas fa-sticky-note',
                'handler': function () {
                   //TODO
                }
            }, 'planner', 'toolbar'),
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Custom themes',
                'icon'   : 'fas fa-clone',
                'handler': function () {
                    //TODO
                }
            }, 'customise-theme', 'toolbar'),
        ]);
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
