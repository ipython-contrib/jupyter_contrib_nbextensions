define([
    'base/js/namespace',
    'jquery',
], function(Jupyter, $)
{
    "use strict";

    var fontStyle = function() {

        var fs_flag = false;

        fontStyle.prototype.fs_initial=function() { //fs_initial
            //find Customise font button on the page
			var fs = $('button[title="Customise font"]');
			fs.addClass('dropdown-toggle');
			fs.attr('data-toggle','dropdown');
			var fsdiv=$("<div>",{"style":"display:inline","class":"btn-group"});   
			fs.parent().append(fsdiv);
			fsdiv.append(fs);
   			this.fs_dropdown_initial(fs);
        }//end fs_initial

        fontStyle.prototype.fs_dropdown_initial = function(fs) {
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

		    //Font color
		    var fs_menuitem2 = $('<li/>');
		    var fs_font_color = $('<a/>').text('Font color');
		    fs_menuitem2.append(fs_font_color);
		    dropMenu.append(fs_menuitem2);
		    //end

		    //Font name
		    var fs_menuitem3 = $('<li/>');
		    var fs_font_name = $('<a/>').text('Font name');
		    fs_menuitem3.append(fs_font_name);
		    dropMenu.append(fs_menuitem3);
		    //end

		    //Font size
		    var fs_menuitem4 = $('<li/>');
		    var fs_font_size = $('<a/>').text('Font size');
		    fs_menuitem4.append(fs_font_size);
		    dropMenu.append(fs_menuitem4);
		    //end

		    //Background color
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

    return fontStyle;
})
