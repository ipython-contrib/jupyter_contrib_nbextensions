define([
  "base/js/namespace",
  "jquery",
  "./font_control",
  "./font_spacing",
  "./color_control",
  "./predefined_styles"
], function(
  Jupyter,
  $,
  Font_control,
  Font_spacing,
  Color_control,
  Predefined_styles
) {
  "use strict";

  var font_style = function() {
    var fs_flag = false;
    var fc_obj = new Font_control();
    var fsp_obj = new Font_spacing();
    var cc_obj = new Color_control();
    var ps_obj = new Predefined_styles(fc_obj, fsp_obj, cc_obj);

    font_style.prototype.fs_initial = function() {
      //fs_initial
      //find Customise font button on the page
      var fs = $('button[title="Customise font"]');
      fs.addClass("dropdown-toggle main-btn");
      fs.attr("data-toggle", "dropdown");
      fs.attr("id", "fs");
      var fsdiv = $("<div>", { style: "display:inline", class: "btn-group" });
      fs.parent().append(fsdiv);
      fsdiv.append(fs);
      this.fs_dropdown_initial(fs);
    }; //end fs_initial

    font_style.prototype.fs_dropdown_initial = async function(fs) {
      var that = this;

      //Create the dropdown menu
      var dropMenu = $("<ul/>")
        .addClass("dropdown-menu dropdown-menu-style")
        .attr("id", "fs_dropdown");
      fs.parent().append(dropMenu);
      $(document).on("click", "#fs", function(e) {
        e.stopPropagation();
      });
      $(document).on("click", "#fs_dropdown", function(e) {
        e.stopPropagation();
      });
      //Create the contents of dropdown menu
      //Predefined style
      await ps_obj.create_menus(dropMenu, fs);
      //&submenu
      //&end submenu

      //font color
      var fs_menuitem5 = $("<li/>").attr("id", "font_colour");
      var colorpicker2 = $("<a/>")
        .attr("href", "#")
        .addClass("font-select-box")
        .attr("id", "color-picker")
        .text("Font color")
        .attr("data-toggle", "dropdown")
        .attr("aria-haspopup", "true")
        .attr("aria-label", "font color");
      var fs_font_color = cc_obj.font_color();
      fs_menuitem5.append(fs_font_color);
      fs_menuitem5.append(colorpicker2);
      dropMenu.append(fs_menuitem5);
      //end

      //Font name
      var fs_menuitem3 = $("<li/>")
        .attr("id", "f_name")
        .addClass("font-select-box")
        .text("Font style")
        .attr("title", "select a font style");

      var fs_font_name = fc_obj.font_name();
      fs_menuitem3.append(fs_font_name);
      dropMenu.append(fs_menuitem3);
      //end

      //Font size
      var fs_menuitem4 = $("<li/>")
        .attr("id", "f_size")
        .addClass("font-select-box")
        .text("Font size")
        .attr("title", "select a font size");

      var fs_font_size = fc_obj.font_size();
      fc_obj.font_change();
      fs_menuitem4.append(fs_font_size);
      dropMenu.append(fs_menuitem4);
      //end

      //Background color
      var fs_menuitem2 = $("<li/>").attr("id", "back_colour");
      var colorpicker1 = $("<a/>")
        .attr("href", "#")
        .addClass("font-select-box")
        .attr("id", "color-picker-background")
        .text("Background color")
        .attr("data-toggle", "dropdown")
        .attr("aria-haspopup", "true")
        .attr("aria-label", "text background color")
        .attr("data-toggle", "dropdown")
        .attr("aria-haspopup", "true")
        .attr("aria-label", "text background color");

      var fs_background_color = cc_obj.background_color();

      fs_menuitem2.append(colorpicker1);
      fs_menuitem2.append(fs_background_color);
      dropMenu.append(fs_menuitem2);
      //end

      //Line height
      var fs_menuitem6 = $("<li/>")
        .attr("id", "height_elem")
        .text("Line height");
      var zoom_div = `
                <div class="zoom btn-group" id="line_height_buttons">
                    <button class="btn icon-button" id="reduce_line_height" title="Reduce line height"><i class="fa fa-minus"></i></button>
                    <button class="btn icon-button" id="increase_line_height" title="Increase line height"><i class="fa fa-plus"></i></button>
                </div>`;
      fs_menuitem6.append(zoom_div);
      dropMenu.append(fs_menuitem6);
      //end

      //Letter spacing
      var fs_menuitem7 = $("<li/>")
        .attr("id", "space_elem")
        .text("Letter Spacing");
      var zoom_div = `
                <div class="zoom btn-group" id="letter_space_buttons">
                    <button class="btn icon-button" id="reduce_letter_space" title="Reduce letter spacing"><i class="fa fa-minus"></i></button>
                    <button class="btn icon-button" id="increase_letter_space" title="Increase letter spacing"><i class="fa fa-plus"></i></button>
                </div>
            </div>`;
      fs_menuitem7.append(zoom_div);
      dropMenu.append(fs_menuitem7);
      //end

      //On/off
      dropMenu.append(this.create_toggle_button());

      fsp_obj.initialise_font_spacing();

      this.set_saved_style();
    };

    font_style.prototype.create_toggle_button = function() {
      var that = this;

      var fs_menuitem9 = $("<li/>")
        .addClass("switch text-center")
        .text("OFF\xa0\xa0");
      var fs_switch = $("<input/>", {
        type: "checkbox",
        id: "fs_switch",
        "data-toggle": "toggle",
        "data-style": "ios",
        "data-onstyle": "warning",
        "data-offstyle": "default",
        "data-width": "58",
        "data-on": " ",
        "data-off": " "
      });
      var offText = $("<p>", { style: "display:inline" }).text("\xa0\xa0ON");
      this.disable_options();

      $(document).ready(function() {
        var toggle_status = localStorage.getItem("toggle");
        if (toggle_status != null) {
          if (toggle_status === "true") {
            $("#fs_switch").trigger("click");
          }
        }
      });

      fs_menuitem9.on("change", function() {
        fs_flag = fs_flag ? false : true;
        if (!fs_flag) {
          that.disable_options();
          that.set_default_styles();
        } else {
          that.enable_options();
          that.set_saved_style();
        }
        localStorage.setItem("toggle", fs_flag);
      });

      fs_menuitem9.append(fs_switch);
      fs_menuitem9.append(offText);

      return fs_menuitem9;
    };

    font_style.prototype.disable_options = function() {
      $("#predefined_styles").addClass("disabled");
      $("#font_colour").addClass("disabled");
      $("#f_name").addClass("disabled");
      $("#f_size").addClass("disabled");
      $("#back_colour").addClass("disabled");
      $("#height_elem").addClass("disabled");
      $("#space_elem").addClass("disabled");
    };

    font_style.prototype.enable_options = function() {
      $("#predefined_styles").removeClass("disabled");
      $("#font_colour").removeClass("disabled");
      $("#f_name").removeClass("disabled");
      $("#f_size").removeClass("disabled");
      $("#back_colour").removeClass("disabled");
      $("#height_elem").removeClass("disabled");
      $("#space_elem").removeClass("disabled");
    };

    font_style.prototype.set_default_styles = function() {
      fc_obj.set_default_values();
      fsp_obj.set_default_values();
      cc_obj.set_colors(
        cc_obj.background_color_reset(),
        cc_obj.font_color_reset(),
        true
      );
    };

    font_style.prototype.set_saved_style = function() {
      var saved_line_height = localStorage.getItem("line_height");
      var saved_letter_space = localStorage.getItem("letter_spacing");
      var saved_font_size = localStorage.getItem("font_size");
      var saved_font_name = localStorage.getItem("font_name");
      var saved_background_color = localStorage.getItem("background_color");
      var saved_font_color = localStorage.getItem("font_color");

      fc_obj.load_font_change(
        JSON.parse(saved_font_name),
        JSON.parse(saved_font_size)
      );

      fsp_obj.set_line_height(JSON.parse(saved_line_height), false);

      fsp_obj.set_letter_spacing(JSON.parse(saved_letter_space), false);

      cc_obj.set_colors(
        JSON.parse(saved_background_color),
        JSON.parse(saved_font_color),
        false
      );
    };
  };

  return font_style;
});
