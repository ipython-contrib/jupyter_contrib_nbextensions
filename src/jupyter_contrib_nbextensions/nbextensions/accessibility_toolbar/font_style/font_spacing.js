define(["base/js/namespace", "jquery", "base/js/utils", "require"], function(
    Jupyter,
    $,
    utils,
    requirejs
) {
    "use strict";
    var fs_style;
    var style_file;
    var Font_spacing = function() {
        this.max_lh = 30;
        this.min_lh = 10;
        this.max_ls = 10;
        this.min_ls = 0;
        this.default_ls = $('.cell').css("letter-spacing");
        this.default_lh = $('.cell').css("line-height");
        console.log(this.default_ls);
        console.log(this.default_lh);
    };

    Font_spacing.prototype.initialise_font_spacing = function() {
        var that = this;
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (/.*\/custom\/custom\.css/.test(document.styleSheets[i].href)) {
                style_file = document.styleSheets[i];
                break;
            }
        }
        for (i = 0; i < style_file.cssRules.length; i++) {
            if (/\.cell/.test(style_file.cssRules[i].selectorText)) {
                fs_style = style_file.cssRules[i].style;
                break;
            }
        }
        if (fs_style == null) {
            style_file.insertRule(
                ".cell { letter-spacing: 0; }",
                0
            );
            style_file.insertRule(
                ".cell, .text_cell_render, .CodeMirror-code, .CodeMirror-line { line-height: " + that.default_lh +"; }",
                1
            );
            fs_style = style_file.cssRules;
        }

        // var default_lh = $(this).css("line-height");
        $('#reduce_line_height').click(function() {
            console.log("reduce line height");
            var current_lh = parseInt($('.cell').css("line-height").replace( /[^\d.-]/g, '' ));
            console.log(current_lh);
            // $('.cell, .text_cell_render, .CodeMirror-code, .CodeMirror-line').css("line-height", (current_lh - 2) + "px");
            that.set_line_height((current_lh - 2) + "px");
            console.log($('.cell').css("line-height"));
            if ((current_lh - 2) <= that.min_lh) {
                $(this).attr("disabled", true);
                return false;
            }
            if ($('#increase_line_height').is(":disabled") && (current_lh - 2) < that.max_lh) {
                $('#increase_line_height').attr("disabled", false);
                return false;
            }
        });
        $('#increase_line_height').click(function() {
            console.log("increase line height");
            var current_lh = parseInt($('.cell').css("line-height").replace( /[^\d.-]/g, '' ));
            console.log(current_lh);
            // $('.cell, .text_cell_render, .CodeMirror-code, .CodeMirror-line').css("line-height", (current_lh + 2) + "px");
            that.set_line_height((current_lh + 2) + "px");
            console.log($('.cell').css("line-height"));
            if ((current_lh + 2) >= that.max_lh) {
                $(this).attr("disabled", true);
                return false;
            }
            if ($('#reduce_line_height').is(":disabled") && (current_lh + 2) > that.min_lh) {
                $('#reduce_line_height').attr("disabled", false);
                return false;
            }
        });
        $('#reduce_letter_space').click(function() {
            console.log("reduce letter space");
            var current = parseInt($('.cell').css("letter-spacing").replace( /[^\d.-]/g, '' ));
            console.log(current);
            // $('.cell').css("letter-spacing", (current - 2) + "px");
            that.set_letter_spacing((current_lh - 2) + "px");
            console.log($('.cell').css("letter-spacing"));
            if ((current - 2) == that.min_ls) {
                $(this).attr("disabled", true);
                return false;
            }
            if ($('#increase_letter_space').is(":disabled") && (current - 2) < that.max_ls) {
                $('#increase_letter_space').attr("disabled", false);
                return false;
            }
        });
        $('#increase_letter_space').click(function() {
            console.log("increase letter space")
            var current = parseInt($('.cell').css("letter-spacing").replace( /[^\d.-]/g, '' ));
            console.log(current);
            // $('.cell').css("letter-spacing", (current + 2) + "px");
            that.set_letter_spacing((current + 2) + "px");
            console.log($('.cell').css("letter-spacing"));
            if ((current + 2) == that.max_ls) {
                $(this).attr("disabled", true);
                return false;
            }
            if ($('#reduce_letter_space').is(":disabled") && (current + 2) > that.min_ls) {
                $('#reduce_letter_space').attr("disabled", false);
                return false;
            }
        });

        Font_spacing.prototype.set_line_height = function(size) {
            for (var i = 0; i < fs_style.length; i++) {
                if (/line\-height/.test(fs_style[i].cssText)) {
                    var index = i;
                }
            }
            // document.getElementById("notebook").style.fontFamily = name;
            style_file.deleteRule(index);
            style_file.insertRule(".cell, .text_cell_render, .CodeMirror-code, .CodeMirror-line{ line-height:" + size + "; }", 1);
        };
        Font_spacing.prototype.set_letter_spacing = function(size) {
            for (var i = 0; i < fs_style.length; i++) {
                if (/letter\-spacing/.test(fs_style[i].cssText)) {
                    var index = i;
                }
            }
            // document.getElementById("notebook").style.fontFamily = name;
            style_file.deleteRule(index);
            style_file.insertRule(".cell{ letter-spacing:" + size + "; }", 0);
        };
    }
    return Font_spacing;
});
