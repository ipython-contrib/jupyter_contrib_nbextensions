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
           
            var fs_style;
            var style_file;
            var color;
          
        Color_control.prototype.background_color = function() {
            
            $(function () {
                    $('#color-picker-background').colorpicker().on('changeColor', function (e) {
                         color = e.color.toHex();
                    
            for (var i = 0; i < document.styleSheets.length; i++) {
                if (/.*\/custom\/custom\.css/.test(document.styleSheets[i].href)) {
                  style_file = document.styleSheets[i];
                  break;
                }
              }
              for (var i = 0; i < style_file.cssRules.length; i++) {
                if (/\.CodeMirror pre/.test(style_file.cssRules[i].selectorText)) {
                  fs_style = style_file.cssRules[i].style;
                  break;
                }
              }
              if (fs_style == null) {
                style_file.insertRule(".input_area div{ background:" + color + "; }", 0);
                style_file.insertRule(".text_cell.rendered .rendered_html { background:" + color + "; }", 0);            
                style_file.insertRule("div.output_area pre { background:" + color + "; }", 0);            

                fs_style = style_file.cssRules;
              }else {
                for (var i = 0; i < fs_style.length; i++) {
                    if (/background/.test(fs_style[i].cssText)) {
                      var index = i;
                    }
                  }
                style_file.deleteRule(index);
                style_file.insertRule(".input_area div{ background:" + color + "; }", 0);
                style_file.insertRule(".text_cell.rendered .rendered_html{ background:" + color + "; }", 0);            
                style_file.insertRule("div.output_area pre { background:" + color + "; }", 0);            


              }
            });
        });
        };
        Color_control.prototype.font_color = function() {

            $(function () {
                $('#color-picker').colorpicker().on('changeColor', function (e) {
                     color = e.color.toHex();
                
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (/.*\/custom\/custom\.css/.test(document.styleSheets[i].href)) {
              style_file = document.styleSheets[i];
              break;
            }
          }
          for (var i = 0; i < style_file.cssRules.length; i++) {
            if (/\.CodeMirror pre/.test(style_file.cssRules[i].selectorText)) {
              fs_style = style_file.cssRules[i].style;
              break;
            }
          }
          if (fs_style == null) {
            style_file.insertRule(".input_area div{ color:" + color + "; }", 0);
            style_file.insertRule(".text_cell.rendered .rendered_html { color:" + color + "; }", 0);            
            style_file.insertRule("div.output_area pre { color:" + color + "; }", 0);            

            fs_style = style_file.cssRules;
          }else {
            for (var i = 0; i < fs_style.length; i++) {
                if (/color/.test(fs_style[i].cssText)) {
                  var index = i;
                }
              }
            style_file.deleteRule(index);
            style_file.insertRule(".input_area div{ color:" + color + "; }", 0);
            style_file.insertRule(".text_cell.rendered .rendered_html{ color:" + color + "; }", 0);            
            style_file.insertRule("div.output_area pre { color:" + color + "; }", 0);            


          }
        });
    });




//====================================
            // $(function () {
		
			// 	$('#color-picker').colorpicker().on('changeColor', function (e) {
			// 		var colorF = e.color.toHex();
			// 		//----

			// 		var all = document.getElementsByTagName("*");
					
			// 		for (var i=0, max=all.length; i < max; i++) {
			// 			if(all[i].className != "cm-builtin" && all[i].className != "cm-string" && all[i].className != "ansi-green-fg" && all[i].className != "ansi-red-fg" && all[i].className != "ansi-cyan-fg"&& all[i].className != "cm-variable"
			// 			&& all[i].className != "cm-operator" && all[i].className != "cm-number" && all[i].className != "cm-keyword" && all[i].className != "code")						 
			// 			{
			// 				all[i].style.color = colorF;
			// 			}
					 
			// 		}
			// 	});
			// 	 });
//=========================================            
        };
    };
    return Color_control;


});