define([
    'base/js/namespace',
    'jquery',
    'require',
], function(Jupyter, $, requirejs) {
    "use strict";

    var ThemeObj = function() {
        var boostrap_toggle_css="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css";
        var boostrap_toggle_js="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"
        this.loadToggleCss(boostrap_toggle_css);
        this.loadToogleJs(boostrap_toggle_js);
    };

    ThemeObj.prototype.loadToggleCss = function (url){
        var link=document.createElement("link");
        link.rel="stylesheet";
        link.type="text/css"
        link.href=requirejs.toUrl(url);
        document.getElementsByTagName("head")[0].appendChild(link);
    };
    
    ThemeObj.prototype.loadToogleJs = function (url){
        var script=document.createElement("script");
        script.src=requirejs.toUrl(url);
        document.getElementsByTagName("head")[0].appendChild(script);  
    };
    
    ThemeObj.prototype.createThemeMenu = function() {
        
        var themeButton = document.querySelector("[title='Custom themes']");
        themeButton.className += " dropdown-toggle";
        themeButton.setAttribute("data-toggle","dropdown");  
        
        var dropDownMenu = document.createElement("ul");
        dropDownMenu.className = "dropdown-menu";
        
        var menuItem1 = document.createElement("li");
        var label1 = document.createElement("label");
        label1.innerHTML = "Dark Mode";
        
        var switchToggle = document.createElement("input");
        switchToggle.type = "checkbox";
        switchToggle.setAttribute("data-toggle", "toggle");
        
        label1.appendChild(switchToggle);
        menuItem1.appendChild(label1);
        dropDownMenu.appendChild(menuItem1);
    
        var menuItem3 = document.createElement("br");
        dropDownMenu.append(menuItem3);
    
        var menuItem2 = document.createElement("li");
        var label2 = document.createElement("label");
        label2.innerHTML = "High Contrast";
        var switchToggle2 = document.createElement("input");
        switchToggle2.type = "checkbox";
        switchToggle2.setAttribute("data-toggle", "toggle");
        
        label2.appendChild(switchToggle2)
        menuItem2.appendChild(label2);
        dropDownMenu.appendChild(menuItem2);
    
        themeButton.parentNode.appendChild(dropDownMenu);
    };

    return ThemeObj;
});



