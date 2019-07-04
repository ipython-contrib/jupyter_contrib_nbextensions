
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
                             spell_checker_menu();
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

var spc_flag=false;
function spell_checker_menu(){
    var spc;
    var l=document.querySelectorAll('button[title]');
    for(var i=0;i<l.length;i++){
        var btn=l[i];
        if(btn.title=="Spell Checker"){
            spc=btn;
        }
    }
    spc.className+=" dropBtn";
    spc.classList.toggle("show");

    //Create the dropdown menu
    if(spc_flag==false){
        var dropMenu=document.createElement("div");
        dropMenu.className="dropMn";
        spc_flag=true;
    }

    //Create the contents of dropdown menu
    var spc_switch=document.createElement("a");
    spc_switch.href="#On";
    spc_switch.text='On/Off';
    dropMenu.appendChild(spc_switch);
    spc.parentNode.insertBefore(dropMenu,spc.nextSibling);

    spc.appendChild(dropMenu);

}