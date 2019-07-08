define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'base/js/utils',
    './themes'

], function(Jupyter, $, requirejs, events, utils, Themes) {
    "use strict";
    var load_ipython_extension = function() {

        var themeObj =new Themes();
        
        //var boostrap_toggle_css="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css";
        //var boostrap_toggle_js="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js";

        //loadToggleCss(boostrap_toggle_css);
        //loadToogleJs(boostrap_toggle_js);
        
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
        themeObj.createThemeMenu();
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});


