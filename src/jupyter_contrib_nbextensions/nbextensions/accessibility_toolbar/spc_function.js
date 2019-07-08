define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'base/js/utils'
], function(Jupyter, $) {
    "use strict";

    var spell_checker=function(){             
        var dp_menu_flag=false;
        var spc_flag=false;
        var boostrap_toggle="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css";
        var boostrap_toggle_js="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js";

        spell_checker.prototype.spc_click=function(){
            var cell=Jupyter.notebook.get_cell_element(0);
            var text=cell[0].textContent;
            console.log(text);
            var i=0;
            while(cell!=null){
                i++;
                cell=Jupyter.notebook.get_cell_element(i);
            }
        }

        spell_checker.prototype.spc_css_initial=function(url){
            var link=document.createElement("link");
            link.rel="stylesheet";
            link.type="text/css"
            link.href=requirejs.toUrl(url);
            document.getElementsByTagName("head")[0].appendChild(link);
        }

        spell_checker.prototype.spc_js_initail=function(url){
            var script=document.createElement("script");
            script.src=requirejs.toUrl(url);
            document.getElementsByTagName("head")[0].appendChild(script);  
        }

        spell_checker.prototype.spc_initial=function(){
            this.spc_css_initial("../../nbextensions/accessibility_toolbar/spellchecker.css");
            this.spc_css_initial(boostrap_toggle);
            this.spc_js_initail(boostrap_toggle_js);
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
            this.spc_dropdown_initial(spc);
        }
        
        spell_checker.prototype.spc_dropdown_initial=function(spc){
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
                spc_switch.id="spc_switch";
                spc_switch.type="checkbox";
                spc_switch.setAttribute("data-toggle","toggle");
                spc_menuitem1.addEventListener('click', function () {
                    if(spc_flag==false){
                        spc_flag=true;
                    }
                    else{
                        spc_flag=false;
                    }
                });
                spc_menuitem1.appendChild(spc_switch);
                dropMenu.appendChild(spc_menuitem1);
                spc.parentNode.insertBefore(dropMenu,spc.nextSibling);
            }
        }

    }
    return spell_checker;
})
