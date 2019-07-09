define([
    'base/js/namespace',
    'jquery',
    'require',
], function(Jupyter, $, requirejs) {
    "use strict";

    var ThemeObj = function() {
        this.loadToggleCss("https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css");
        this.loadToogleJs("https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js");
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


    ThemeObj.prototype.createThemeMenu = function () {
       var themeButton = $("[title='Custom themes']");
       var themediv = $("<div>",{"style":"display:inline","class":"btn-group"});
       themeButton.parent().append(themediv);
       themediv.append(themeButton)
       themeButton.addClass('dropdown-toggle').attr("data-toggle","dropdown");

       var dropDownMenu = $('<ul/>').addClass('dropdown-menu');
       var menuItem1 = $('<li/>');
       var label1 = $('<label/>');
       label1.text("Dark mode")
    
       var switchToggle = $('<input/>').attr("type", "checkbox").attr("data-toggle", "toggle");
       label1.append(switchToggle);
       menuItem1.append(label1);
       dropDownMenu.append(menuItem1);

       var line_break = $('<br/>');
       dropDownMenu.append(line_break);
       
       var menuItem2 = $('<li/>');
       var label2 = $('<label/>');
       label2.text( "High Contrast");
       var switchToggle2 = $('<input/>').attr("type", "checkbox").attr("data-toggle", "toggle");

       label2.append(switchToggle2)
       menuItem2.append(label2);
       dropDownMenu.append(menuItem2);
       
       themeButton.parent().append(dropDownMenu);
       console.log("Menu created");
    };

    return ThemeObj;
});



