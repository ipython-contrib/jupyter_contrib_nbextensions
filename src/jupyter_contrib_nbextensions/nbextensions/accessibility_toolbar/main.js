define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'base/js/utils',
    './voice_control'
    './themes',
    './spc_function',
    './planner'
    './fontStyle'
], function(Jupyter, $, requirejs, events, utils, Voice_control, Themes, SPC, planner) {
    "use strict";

    var load_ipython_extension = function() {

        var themeObj = new Themes(); 
        var spc_obj=new SPC();
        var planner_obj = new planner();
        var vc_obj = new Voice_control();


        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Customise font',
                'icon'   : 'fas fa-font',
                'handler': function () {

                }
            }, 'customise-font', 'accessibility-toolbar'),
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Spell Checker',
                'icon'   : 'fas fa-check',
                'handler': function () {
                    //TODO
                    spc_obj.spc_click();
                }
            }, 'spell-checker', 'accessibility-toolbar'),
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Voice Control',
                'icon'   : 'fas fa-microphone',
                'handler':  function () {
                    // TODO
                }
            }, 'voice-control', 'accessibility-toolbar'),
            Jupyter.keyboard_manager.actions.register ({
                'help': 'Planner',
                'icon': 'fas fa-sticky-note',
                'handler': function () {
                    planner_obj.toggle_planner();
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

        vc_obj.setup_voice_control();
        themeObj.createThemeMenu();
        spc_obj.spc_initial();
        fs_obj.fs_initial();

    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});


