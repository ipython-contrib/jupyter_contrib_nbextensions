
define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'base/js/utils',
], function(Jupyter, $, requirejs, events, utils) {
    "use strict";

    var load_ipython_extension = function() {
        var boostrap_toggle="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css";
        var boostrap_toggle_js="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js";
        spc_css_initial("../../nbextensions/accessibility_toolbar/spellchecker.css");
        spc_css_initial(boostrap_toggle);
        spc_js_initail(boostrap_toggle_js);
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
        spc_initial();
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});

//Spell Checker
function spc_css_initial(url){
    var link=document.createElement("link");
    link.rel="stylesheet";
    link.type="text/css"
    link.href=requirejs.toUrl(url);
    document.getElementsByTagName("head")[0].appendChild(link);
}

function spc_js_initail(url){
    var script=document.createElement("script");
    script.src=requirejs.toUrl(url);
    document.getElementsByTagName("head")[0].appendChild(script);  
}

var dp_menu_flag=false;
var spc_flag=false;
function spc_initial(){
    //get spell check button on the page
    var l=document.querySelectorAll('button[title]');
    for(var i=0;i<l.length;i++){
        var btn=l[i];
        if(btn.title=="Spell Checker"){
            var spc=btn;
        }
    }
    spc.className+=" dropdown-toggle";
    spc.setAttribute("data-toggle","dropdown");
    spc_dropdown_initial(spc);
}

function spc_dropdown_initial(spc){
    //Create the dropdown menu
    if(dp_menu_flag==false){
        var dropMenu=document.createElement("ul");
        dropMenu.className="dropdown-menu";
        dropMenu.id-"spc_dropdown";
        dp_menu_flag=true;
        // dropMenu.addEventListener('click', function (event) {
        //     event.stopPropagation();
        // });
        //TODO: Create the menu item in the dropdown menu: sliding switch
        var spc_menuitem1=document.createElement("li");
        spc_menuitem1.className="switch";
        //<input type="checkbox" checked data-toggle="toggle">
        var spc_switch=document.createElement("input");
        spc_switch.type="checkbox";
        spc_switch.setAttribute("data-toggle","toggle");
    
        spc_menuitem1.appendChild(spc_switch);
        dropMenu.appendChild(spc_menuitem1);
        spc.parentNode.insertBefore(dropMenu,spc.nextSibling);
    }
}

function spc_click(){

}