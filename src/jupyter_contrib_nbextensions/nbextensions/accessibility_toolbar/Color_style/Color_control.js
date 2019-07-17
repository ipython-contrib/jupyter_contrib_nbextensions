define([
    'base/js/namespace',
	'jquery',
    './simple_color_picker',
    './Spectrum',
], function(Jupyter, $,simple, Spectrum) {
    "use strict";

    var Color_control = function() {  

        // var link2 = document.createElement("link");
		// 	link2.type = 'text/css';
		// 	link2.rel = 'stylesheet';
		// 	link2.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.5.3/css/bootstrap-colorpicker.css';
        //     document.getElementsByTagName('head')[0].appendChild(link2);

            var link2 = document.createElement("link");
			link2.type = 'text/css';
			link2.rel = 'stylesheet';
			link2.href = 'https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css';
            document.getElementsByTagName('head')[0].appendChild(link2);
           
            var fs_style;
            var style_file;
            var color;
          
        Color_control.prototype.background_color = function() {
            
            $(function () {



                $("#color-picker-background").spectrum({
                    color: "#ECC",
                    showInput: true,
                    className: "full-spectrum",
                    showInitial: true,
                    showPalette: true,
                    showSelectionPalette: true,
                    maxSelectionSize: 10,
                    preferredFormat: "hex",
                    localStorageKey: "spectrum.demo",
                    
            //         move: function (color) {
            //                      for (var i = 0; i < document.styleSheets.length; i++) {
            //     if (/.*\/custom\/custom\.css/.test(document.styleSheets[i].href)) {
            //       style_file = document.styleSheets[i];
            //       break;
            //     }
            //   }
            //   for (var i = 0; i < style_file.cssRules.length; i++) {
            //             if (/\.CodeMirror pre/.test(style_file.cssRules[i].selectorText)) {
            //               fs_style = style_file.cssRules[i].style;
            //               break;
            //             }
            //           }

            //           if (fs_style == null) {
            //                     style_file.insertRule(".input_area div{ background:" + color.toHexString() + "; }", 0);
            //                     style_file.insertRule(".text_cell.rendered .rendered_html { background:" + color.toHexString() + "; }", 0);            
            //                     style_file.insertRule("div.output_area pre { background:" + color.toHexString() + "; }", 0);            
                
            //                     fs_style = style_file.cssRules;
            //                   }

            //                   else {
            //                             for (var i = 0; i < fs_style.length; i++) {
            //                                 if (/background/.test(fs_style[i].cssText)) {
            //                                   var index = i;
            //                                 }
            //                               }
                                    

            //                         style_file.deleteRule(index);
            //                                 style_file.insertRule(".input_area div{ background:" + color.toHexString() + "; }", 0);
            //                                 style_file.insertRule(".text_cell.rendered .rendered_html{ background:" + color + "; }", 0);            
            //                                 style_file.insertRule("div.output_area pre { background:" + color.toHexString() + "; }", 0);   
            //                   }
                        
                        
            //         },
                    show: function () {
                    
                    },
                    beforeShow: function () {
                    
                    },
                    hide: function () {
                    
                    },
                    change: function(color) {
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
                                            style_file.insertRule(".input_area div{ background:" + color.toHexString() + "; }", 0);
                                            style_file.insertRule(".text_cell.rendered .rendered_html { background:" + color.toHexString() + "; }", 0);            
                                            style_file.insertRule("div.output_area pre { background:" + color.toHexString() + "; }", 0);            
                            
                                            fs_style = style_file.cssRules;
                                          }
            
                                          else {
                                                    for (var i = 0; i < fs_style.length; i++) {
                                                        if (/background/.test(fs_style[i].cssText)) {
                                                          var index = i;
                                                        }
                                                      }
                                                
            
                                                style_file.deleteRule(index);
                                                        style_file.insertRule(".input_area div{ background:" + color.toHexString() + "; }", 0);
                                                        style_file.insertRule(".text_cell.rendered .rendered_html{ background:" + color + "; }", 0);            
                                                        style_file.insertRule("div.output_area pre { background:" + color.toHexString() + "; }", 0);   
                                          }
                                    
                        
                    },
                    palette: [
                        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
                        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
                        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
                        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
                        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
                        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
                        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
                        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
                        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
                        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
                    ]
                });


                //-------------------------------------
        //             $('#color-picker-background').colorpicker().on('changeColor', function (e) {
        //                  color = e.color.toHex();
                    
        //     for (var i = 0; i < document.styleSheets.length; i++) {
        //         if (/.*\/custom\/custom\.css/.test(document.styleSheets[i].href)) {
        //           style_file = document.styleSheets[i];
        //           break;
        //         }
        //       }
        //       for (var i = 0; i < style_file.cssRules.length; i++) {
        //         if (/\.CodeMirror pre/.test(style_file.cssRules[i].selectorText)) {
        //           fs_style = style_file.cssRules[i].style;
        //           break;
        //         }
        //       }
        //       if (fs_style == null) {
        //         style_file.insertRule(".input_area div{ background:" + color + "; }", 0);
        //         style_file.insertRule(".text_cell.rendered .rendered_html { background:" + color + "; }", 0);            
        //         style_file.insertRule("div.output_area pre { background:" + color + "; }", 0);            

        //         fs_style = style_file.cssRules;
        //       }else {
        //         for (var i = 0; i < fs_style.length; i++) {
        //             if (/background/.test(fs_style[i].cssText)) {
        //               var index = i;
        //             }
        //           }
        //         style_file.deleteRule(index);
        //         style_file.insertRule(".input_area div{ background:" + color + "; }", 0);
        //         style_file.insertRule(".text_cell.rendered .rendered_html{ background:" + color + "; }", 0);            
        //         style_file.insertRule("div.output_area pre { background:" + color + "; }", 0);            


        //       }
        //     });
         });
        };
        Color_control.prototype.font_color = function() {

            $(function () {

                $("#color-picker").spectrum({
                    color: "#ECC",
                    showInput: true,
                    className: "full-spectrum",
                    showInitial: true,
                    showPalette: true,
                    showSelectionPalette: true,
                    maxSelectionSize: 10,
                    preferredFormat: "hex",
                    localStorageKey: "spectrum.demo",
                    
            //         move: function (color) {
            //                      for (var i = 0; i < document.styleSheets.length; i++) {
            //     if (/.*\/custom\/custom\.css/.test(document.styleSheets[i].href)) {
            //       style_file = document.styleSheets[i];
            //       break;
            //     }
            //   }
            //   for (var i = 0; i < style_file.cssRules.length; i++) {
            //             if (/\.CodeMirror pre/.test(style_file.cssRules[i].selectorText)) {
            //               fs_style = style_file.cssRules[i].style;
            //               break;
            //             }
            //           }

            //           if (fs_style == null) {
            //                     style_file.insertRule(".input_area div{ color:" + color.toHexString() + "; }", 0);
            //                     style_file.insertRule(".text_cell.rendered .rendered_html { color:" + color.toHexString() + "; }", 0);            
            //                     style_file.insertRule("div.output_area pre { color:" + color.toHexString() + "; }", 0);            
                
            //                     fs_style = style_file.cssRules;
            //                   }

            //                   else {
            //                             for (var i = 0; i < fs_style.length; i++) {
            //                                 if (/color/.test(fs_style[i].cssText)) {
            //                                   var index = i;
            //                                 }
            //                               }
                                    

            //                         style_file.deleteRule(index);
            //                                 style_file.insertRule(".input_area div{ color:" + color.toHexString() + "; }", 0);
            //                                 style_file.insertRule(".text_cell.rendered .rendered_html{ color:" + color + "; }", 0);            
            //                                 style_file.insertRule("div.output_area pre { color:" + color.toHexString() + "; }", 0);   
            //                   }
                        
                        
            //         },
                    show: function () {
                    
                    },
                    beforeShow: function () {
                    
                    },
                    hide: function () {
                    
                    },
                    change: function(color) {
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
                                            style_file.insertRule(".input_area div{ color:" + color.toHexString() + "; }", 0);
                                            style_file.insertRule(".text_cell.rendered .rendered_html { color:" + color.toHexString() + "; }", 0);            
                                            style_file.insertRule("div.output_area pre { color:" + color.toHexString() + "; }", 0);            
                            
                                            fs_style = style_file.cssRules;
                                          }
            
                                          else {
                                                    for (var i = 0; i < fs_style.length; i++) {
                                                        if (/color/.test(fs_style[i].cssText)) {
                                                          var index = i;
                                                        }
                                                      }
                                                
            
                                                style_file.deleteRule(index);
                                                        style_file.insertRule(".input_area div{ color:" + color.toHexString() + "; }", 0);
                                                        style_file.insertRule(".text_cell.rendered .rendered_html{ color:" + color + "; }", 0);            
                                                        style_file.insertRule("div.output_area pre { color:" + color.toHexString() + "; }", 0);   
                                          }
                                    
                        
                    },
                    palette: [
                        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
                        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
                        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
                        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
                        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
                        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
                        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
                        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
                        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
                        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
                    ]
                });



                //================================================
    //             $('#color-picker').colorpicker().on('changeColor', function (e) {
    //                  color = e.color.toHex();
                
    //     for (var i = 0; i < document.styleSheets.length; i++) {
    //         if (/.*\/custom\/custom\.css/.test(document.styleSheets[i].href)) {
    //           style_file = document.styleSheets[i];
    //           break;
    //         }
    //       }
    //       for (var i = 0; i < style_file.cssRules.length; i++) {
    //         if (/\.CodeMirror pre/.test(style_file.cssRules[i].selectorText)) {
    //           fs_style = style_file.cssRules[i].style;
    //           break;
    //         }
    //       }
    //       if (fs_style == null) {
    //         style_file.insertRule(".input_area div{ color:" + color + "; }", 0);
    //         style_file.insertRule(".text_cell.rendered .rendered_html { color:" + color + "; }", 0);            
    //         style_file.insertRule("div.output_area pre { color:" + color + "; }", 0);            

    //         fs_style = style_file.cssRules;
    //       }else {
    //         for (var i = 0; i < fs_style.length; i++) {
    //             if (/color/.test(fs_style[i].cssText)) {
    //               var index = i;
    //             }
    //           }
    //         style_file.deleteRule(index);
    //         style_file.insertRule(".input_area div{ color:" + color + "; }", 0);
    //         style_file.insertRule(".text_cell.rendered .rendered_html{ color:" + color + "; }", 0);            
    //         style_file.insertRule("div.output_area pre { color:" + color + "; }", 0);            


    //       }
    //     });
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