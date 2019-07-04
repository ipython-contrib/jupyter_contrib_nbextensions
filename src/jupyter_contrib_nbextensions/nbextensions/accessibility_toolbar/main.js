
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
                    spc_click();
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

//Spell Checker
var spc_flag=false;
function spc_click(){
    //get spell check button on the page
    var l=document.querySelectorAll('button[title]');
    for(var i=0;i<l.length;i++){
        var btn=l[i];
        if(btn.title=="Spell Checker"){
            var spc=btn;
        }
    }
    spc.className+=" dropdown-toggle";
    spc.setAttribute("data-toggle","dropdown")
    spc_dropdown_initial(spc);
}

function spc_dropdown_initial(spc){
    //Create the dropdown menu
    if(spc_flag==false){
        //var dropMenu=document.createElement("div id='spc_dropdown' class='dropMn'");
        var dropMenu=document.createElement("ul");
        dropMenu.className="dropdown-menu";
        spc_flag=true;
    }
    //TODO: Create the menu item in the dropdown menu: sliding switch
    var spc_menuitem1=document.createElement("li");
    var spc_switch=document.createElement("a");
    spc_switch.href="#on";
    spc_switch.text="on/off";
    spc_menuitem1.appendChild(spc_switch);
    dropMenu.appendChild(spc_menuitem1);
    spc.parentNode.insertBefore(dropMenu,spc.nextSibling);
}