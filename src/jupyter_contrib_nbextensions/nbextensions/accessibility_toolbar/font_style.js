define([
    'base/js/namespace',
    'jquery',
], function(Jupyter, $)
{
    "use strict";

    var fontStyle = function() {
        var link=document.createElement("link");
        link.rel="stylesheet";
        link.type="text/css"
        link.href=requirejs.toUrl("../../nbextensions/accessibility_toolbar/font_style.css");
        document.getElementsByTagName("head")[0].appendChild(link);
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

		    //Line height
		    var fs_menuitem6 = $('<li/>');
		    var fs_line_spacing = $('<a/>').addClass('d.inline').text('Line height');
            var zoom_div = `<div class="listitem ">
                <span>Line height</span>
                <div class="zoom btn-group" id="line_height_buttons">
                    <button class="btn icon-button" id="reduce_line_height" title="Reduce line height"><i class="fa fa-minus"></i></button>
                    <button class="btn icon-button" id="increase_line_height" title="Increase line height"><i class="fa fa-plus"></i></button>
                </div>
            </div>`
		    // fs_menuitem6.append(fs_line_spacing);

            fs_menuitem6.append(zoom_div);
		    dropMenu.append(fs_menuitem6);
            // handle line-height changes
            var max_lh = 30;
            var min_lh = 10;
            // var default_lh = $(this).css("line-height");
            $('#reduce_line_height').click(function() {
                console.log("reduce line height");
                var current_lh = parseInt($('.cell').css("line-height").replace( /[^\d.-]/g, '' ));
                console.log(current_lh);
                $('.cell, .text_cell_render, .CodeMirror-code, .CodeMirror-line').css("line-height", (current_lh - 2) + "px");
                console.log($('.cell').css("line-height"));
                if ((current_lh - 2) <= min_lh) {
                    $(this).attr("disabled", true);
                    return false;
                }
                if ($('#increase_line_height').is(":disabled") && (current_lh - 2) < max_lh) {
                    $('#increase_line_height').attr("disabled", false);
                    return false;
                }
            });
            $('#increase_line_height').click(function() {
                console.log("increase line height");
                var current_lh = parseInt($('.cell').css("line-height").replace( /[^\d.-]/g, '' ));
                console.log(current_lh);
                $('.cell, .text_cell_render, .CodeMirror-code, .CodeMirror-line').css("line-height", (current_lh + 2) + "px");
                console.log($('.cell').css("line-height"));
                if ((current_lh + 2) >= max_lh) {
                    $(this).attr("disabled", true);
                    return false;
                }
                if ($('#reduce_line_height').is(":disabled") && (current_lh + 2) > min_lh) {
                    $('#reduce_line_height').attr("disabled", false);
                    return false;
                }
            });
		    //end

		    //Letter spacing
		    var fs_menuitem7 = $('<li/>');
		    var fs_letter_spacing = $('<a/>').addClass('d.inline').text('Letter spacing');
            var zoom_div = `<div class="listitem">
                <span>Letter spacing</span>
                <div class="zoom btn-group" id="letter_space_buttons">
                    <button class="btn icon-button" id="reduce_letter_space" title="Reduce letter spacing"><i class="fa fa-minus"></i></button>
                    <button class="btn icon-button" id="increase_letter_space" title="Increase letter spacing"><i class="fa fa-plus"></i></button>
                </div>
            </div>`
		    // fs_menuitem6.append(fs_line_spacing);
            fs_menuitem7.append(zoom_div);
		    dropMenu.append(fs_menuitem7);

            // handle letter-spacing changes
            // var default_ls = $(this).css("letter-spacing");
            var max_ls = 10;
            var min_ls = -10;
            var current = 0;
            $('#reduce_letter_space').click(function() {
                console.log("reduce letter space");
                current = parseInt($('.cell').css("letter-spacing").replace( /[^\d.-]/g, '' ));
                console.log(current);
                $('.cell').css("letter-spacing", (current - 2) + "px");
                console.log($('.cell').css("letter-spacing"));
                if ((current - 2) == min_ls) {
                    $(this).attr("disabled", true);
                    return false;
                }
                if ($('#increase_letter_space').is(":disabled") && (current - 2) < max_ls) {
                    $('#increase_letter_space').attr("disabled", false);
                    return false;
                }
            });
            $('#increase_letter_space').click(function() {
                console.log("increase letter space")
                current = parseInt($('.cell').css("letter-spacing").replace( /[^\d.-]/g, '' ));
                console.log(current);
                $('.cell').css("letter-spacing", (current + 2) + "px");
                console.log($('.cell').css("letter-spacing"));
                if ((current + 2) == max_ls) {
                    $(this).attr("disabled", true);
                    return false;
                }
                if ($('#reduce_letter_space').is(":disabled") && (current + 2) > min_ls) {
                    $('#reduce_letter_space').attr("disabled", false);
                    return false;
                }
            });
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
