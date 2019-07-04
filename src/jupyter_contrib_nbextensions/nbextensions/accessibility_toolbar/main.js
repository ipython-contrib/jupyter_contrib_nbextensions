
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
                    customise_font_menu();
                  
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

//--------------------------
var fs_flag=false;
function customise_font_menu(){
    
    var l=document.querySelectorAll('button[title]');
    for(var i=0;i<l.length;i++){
        var btn=l[i];
        if(btn.title=="Customise font"){
           var fs=btn;
        }
    }
    fs.className+="dropdown-toggle";
    fs.setAttribute("data-toggle","dropdown")
    fs_dropdown_initial(fs);
}// end fun

    //Create the dropdown menu

function fs_dropdown_initial(fs){

//tou--------------------
    if(fs_flag==false){
        var dropMenu=document.createElement("ul");
        dropMenu.className="dropdown-menu";
        fs_flag=true;
    }

    //Create the contents of dropdown menu
//Predefined style
    var fs_menuitem1=document.createElement("li");
    var fs_Predefined_styles=document.createElement("a");
    fs_Predefined_styles.text="Predefined styles";
    fs_menuitem1.appendChild(fs_Predefined_styles);
    dropMenu.appendChild(fs_menuitem1); 
    fs.parentNode.insertBefore(dropMenu,fs.nextSibling);
    //&submenu
    //&end submenu


    //Font color
    var fs_menuitem2=document.createElement("li");
    var fs_font_color=document.createElement("a");
    fs_font_color.text="Font color";
    fs_menuitem2.appendChild(fs_font_color);
    dropMenu.appendChild(fs_menuitem2); 
    fs.parentNode.insertBefore(dropMenu,fs.nextSibling);
    //end 

    //Font name
    var fs_menuitem3=document.createElement("li");
    var fs_font_name=document.createElement("a");
    fs_font_name.text="Font name";
    fs_menuitem3.appendChild(fs_font_name);
    dropMenu.appendChild(fs_menuitem3); 
    fs.parentNode.insertBefore(dropMenu,fs.nextSibling);
    //end

    //Font size
    var fs_menuitem4=document.createElement("li");
    var fs_font_size=document.createElement("a");
    fs_font_name.text="Font size";
    fs_menuitem4.appendChild(fs_font_size);
    dropMenu.appendChild(fs_menuitem4); 
    fs.parentNode.insertBefore(dropMenu,fs.nextSibling);
    //end

    //Background color
    //end

    //Line spacing
    //end

    //Letter spacing
    //end

    //Transform
    //end
    
    //On/off
    //end

//end Predefined style
} 
