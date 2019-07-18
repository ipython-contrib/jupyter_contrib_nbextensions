define(["base/js/namespace", "jquery", "base/js/utils", "require"], function(
    Jupyter,
    $,
    utils,
    requirejs
) {
    "use strict";

    var Font_spacing = function() {
        this.max_lh = 30;
        this.min_lh = 10;
        this.max_ls = 10;
        this.min_ls = 0;
    };

    Font_spacing.prototype.initialise_font_spacing = function() {
        // var default_lh = $(this).css("line-height");
        $('#reduce_line_height').click(function() {
            console.log("reduce line height");
            var current_lh = parseInt($('.cell').css("line-height").replace( /[^\d.-]/g, '' ));
            console.log(current_lh);
            $('.cell, .text_cell_render, .CodeMirror-code, .CodeMirror-line').css("line-height", (current_lh - 2) + "px");
            console.log($('.cell').css("line-height"));
            if ((current_lh - 2) <= this.min_lh) {
                $(this).attr("disabled", true);
                return false;
            }
            if ($('#increase_line_height').is(":disabled") && (current_lh - 2) < this.max_lh) {
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
            if ((current_lh + 2) >= this.max_lh) {
                $(this).attr("disabled", true);
                return false;
            }
            if ($('#reduce_line_height').is(":disabled") && (current_lh + 2) > this.min_lh) {
                $('#reduce_line_height').attr("disabled", false);
                return false;
            }
        });
        $('#reduce_letter_space').click(function() {
            console.log("reduce letter space");
            var current = parseInt($('.cell').css("letter-spacing").replace( /[^\d.-]/g, '' ));
            console.log(current);
            $('.cell').css("letter-spacing", (current - 2) + "px");
            console.log($('.cell').css("letter-spacing"));
            if ((current - 2) == this.min_ls) {
                $(this).attr("disabled", true);
                return false;
            }
            if ($('#increase_letter_space').is(":disabled") && (current - 2) < this.max_ls) {
                $('#increase_letter_space').attr("disabled", false);
                return false;
            }
        });
        $('#increase_letter_space').click(function() {
            console.log("increase letter space")
            var current = parseInt($('.cell').css("letter-spacing").replace( /[^\d.-]/g, '' ));
            console.log(current);
            $('.cell').css("letter-spacing", (current + 2) + "px");
            console.log($('.cell').css("letter-spacing"));
            if ((current + 2) == this.max_ls) {
                $(this).attr("disabled", true);
                return false;
            }
            if ($('#reduce_letter_space').is(":disabled") && (current + 2) > this.min_ls) {
                $('#reduce_letter_space').attr("disabled", false);
                return false;
            }
        });
    }
    return Font_spacing;
});
