define([
    'base/js/namespace',
	'jquery',
	'./simple_color_picker',
], function(Jupyter, $,simple)
{
    "use strict";

    var Font_style = function() {

        var fs_flag = false;

        Font_style.prototype.fs_initial=function() { //fs_initial
            //find Customise font button on the page
			var fs = $('button[title="Customise font"]');
			fs.addClass('dropdown-toggle');
			fs.attr('data-toggle','dropdown');
			var fsdiv=$("<div>",{"style":"display:inline","class":"btn-group"});   
			fs.parent().append(fsdiv);
			fsdiv.append(fs);
   			this.fs_dropdown_initial(fs);
        }//end fs_initial

        Font_style.prototype.fs_dropdown_initial = function(fs) {
            //Create the dropdown menu
			var dropMenu = $('<ul/>').addClass('dropdown-menu').attr('id', 'fs_dropdown');
            fs.parent().append(dropMenu);
		//Create the contents of dropdown menu
		//Predefined style
			var fs_menuitem1 = $('<li/>').attr('role', 'none');
            var fs_predefined_styles = $('<a/>').text('Predefined styles').attr('href', '#');
		    fs_menuitem1.append(fs_predefined_styles);
		    dropMenu.append(fs_menuitem1);
		    //&submenu
		    //&end submenu

		    //Background color
		    
			//---------create a Color picker----------
			var link2 = document.createElement("link");
			link2.type = 'text/css';
			link2.rel = 'stylesheet';
			link2.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.5.3/css/bootstrap-colorpicker.css';
			document.getElementsByTagName('head')[0].appendChild(link2);
			// --------------------UI------------------
			var fs_menuitem2 = $('<li/>');
			var colorpicker1 = $('<a/>').attr('href', '#').addClass('btn btn-default').attr('id','color-picker-background').text('Background color');
			fs_menuitem2.append(colorpicker1);
			dropMenu.append(fs_menuitem2);
			var fs_menuitem99 = $('<li/>');
			var chgcolor = $('<a/>').text('hi').attr('href', '#').attr('id','chgcolor');
			fs_menuitem99.append(chgcolor);
			dropMenu.append(fs_menuitem99);
			//++++++++++++++++++++++++++++++++++++++++++++++++++++
	//function
	
	$(function () {
 
		$('#color-picker-background').colorpicker().on('changeColor', function (e) {
			var color = e.color.toHex();
			$('#chgcolor')[0].style.backgroundColor = color;
			$("div").css("background-color", color);
		//	$("body").css("background-color", color);
			//$("#heder").css("background-color", color);'
			//$(".CodeMirror pre").css("background-color", color);
		});
		});
        //+++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++++++++++++++++++++
//---------------------------------------------
// cahnge the bg
 //$("div").css("background-color", "yellow");
//--------------------------------------------
		    //end

		    //Font name
		    var fs_menuitem3 = $('<li/>');
		    var fs_font_name = $('<a/>').text('color');
		    fs_menuitem3.append(fs_font_name);
		    dropMenu.append(fs_menuitem3);
		    //end

		    //Font size
		    var fs_menuitem4 = $('<li/>');
		    var fs_font_size = $('<a/>').text('Font size');
		    fs_menuitem4.append(fs_font_size);
		    dropMenu.append(fs_menuitem4);
		    //end

		    //font color
		    var fs_menuitem5 = $('<li/>');
		    var fs_bg_color = $('<a/>').text('Background color');
		    fs_menuitem5.append(fs_bg_color);
		    dropMenu.append(fs_menuitem5);
		    //end

		    //Line spacing
		    var fs_menuitem6 = $('<li/>');
		    var fs_line_spacing = $('<a/>').text('Line spacing');
		    fs_menuitem6.append(fs_line_spacing);
		    dropMenu.append(fs_menuitem6);
		    //end

		    //Letter spacing
		    var fs_menuitem7 = $('<li/>');
		    var fs_letter_spacing = $('<a/>').text('Letter spacing');
		    fs_menuitem7.append(fs_letter_spacing);
		    dropMenu.append(fs_menuitem7);
		    //end

		    //Transform
		    var fs_menuitem8 = $('<li/>');
		    var fs_transform = $('<a/>').text('Transform');
		    fs_menuitem8.append(fs_transform);
		    dropMenu.append(fs_menuitem8);
		    //end

		    //On/off
			var fs_menuitem9 = $('<li/>').addClass('switch');
            var fs_switch = $('<input/>').attr('id', 'fs_switch')
				.attr('type', 'checkbox').attr('data-toggle', 'toggle');
            fs_menuitem9.on('click', function () {
            	fs_flag = !fs_flag;
            });
            fs_menuitem9.append(fs_switch);
            dropMenu.append(fs_menuitem9);
            //end
        }
	};
	//---
	Font_style.prototype.setup_planner = function () {



    };

    return Font_style;
})
