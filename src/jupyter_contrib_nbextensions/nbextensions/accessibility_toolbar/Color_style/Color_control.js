define([
    'base/js/namespace',
	'jquery',
	'./simple_color_picker',
], function(Jupyter, $,simple) {
    "use strict";

    var Color_control = function() {  
        var link2 = document.createElement("link");
			link2.type = 'text/css';
			link2.rel = 'stylesheet';
			link2.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.5.3/css/bootstrap-colorpicker.css';
            document.getElementsByTagName('head')[0].appendChild(link2);
            
        Color_control.prototype.background_color = function() {
             $(function () {
                $('#color-picker-background').colorpicker().on('changeColor', function (e) {
                    var color = e.color.toHex();
                    $("div").css("background-color", color);
                });
                 });

        };
        Color_control.prototype.font_color = function() {
            $(function () {
		
				$('#color-picker').colorpicker().on('changeColor', function (e) {
					var colorF = e.color.toHex();
					//----

					var all = document.getElementsByTagName("*");
					
					for (var i=0, max=all.length; i < max; i++) {
						if(all[i].className != "cm-builtin" && all[i].className != "cm-string" && all[i].className != "ansi-green-fg" && all[i].className != "ansi-red-fg" && all[i].className != "ansi-cyan-fg"&& all[i].className != "cm-variable"
						&& all[i].className != "cm-operator" && all[i].className != "cm-number" && all[i].className != "cm-keyword" && all[i].className != "code")						 
						{
							all[i].style.color = colorF;
						}
					 
					}
				});
				 });
            
        };
    };
    return Color_control;


});