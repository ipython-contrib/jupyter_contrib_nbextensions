define([
  "base/js/namespace",
  "jquery",
  "./font_style/predefined_styles",
  "./font_style/font_control"
], function(Jupyter, $, Predefined_styles, Font_control) {
  "use strict";

  var fontStyle = function() {
    var fs_flag = false;
    var fc_obj = new Font_control();
    var ps_obj = new Predefined_styles(fc_obj);

    fontStyle.prototype.fs_initial = function() {
      //fs_initial
      //find Customise font button on the page
      var fs = $('button[title="Customise font"]');
      fs.addClass("dropdown-toggle");
      fs.attr("data-toggle", "dropdown");
      fs.attr("id", "fs");
      var fsdiv = $("<div>", { style: "display:inline", class: "btn-group" });
      fs.parent().append(fsdiv);
      fsdiv.append(fs);
      this.fs_dropdown_initial(fs);
    }; //end fs_initial

    fontStyle.prototype.fs_dropdown_initial = async function(fs) {
      //Create the dropdown menu
      var dropMenu = $("<ul/>")
        .addClass("dropdown-menu fs-dropdown-menu")
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

      //Font color
      var fs_menuitem2 = $("<li/>");
      var fs_font_color = $("<a/>").text("Font color");
      fs_menuitem2.append(fs_font_color);
      dropMenu.append(fs_menuitem2);
      //end

      //Font name
      var fs_menuitem3 = $("<li/>")
        .addClass("font-style-box")
        .text("Font style")
        .attr("title", "select a font style");
      var fs_font_name = fc_obj.font_name();
      fs_menuitem3.append(fs_font_name);
      dropMenu.append(fs_menuitem3);
      //end

      //Font size
      var fs_menuitem4 = $("<li/>")
        .addClass("font-size-box")
        .text("Font size")
        .attr("title", "select a font size");
      var fs_font_size = fc_obj.font_size();
      fc_obj.font_change();
      fs_menuitem4.append(fs_font_size);
      dropMenu.append(fs_menuitem4);
      //end

      var saved_style = localStorage.getItem("current_style");
      if (saved_style != null) {
        await ps_obj.set_style_values(JSON.parse(saved_style));
      }

      //Background color
      var fs_menuitem5 = $("<li/>");
      var fs_bg_color = $("<a/>").text("Background color");
      fs_menuitem5.append(fs_bg_color);
      dropMenu.append(fs_menuitem5);
      //end

      //Line spacing
      var fs_menuitem6 = $("<li/>");
      var fs_line_spacing = $("<a/>").text("Line spacing");
      fs_menuitem6.append(fs_line_spacing);
      dropMenu.append(fs_menuitem6);
      //end

      //Letter spacing
      var fs_menuitem7 = $("<li/>");
      var fs_letter_spacing = $("<a/>").text("Letter spacing");
      fs_menuitem7.append(fs_letter_spacing);
      dropMenu.append(fs_menuitem7);
      //end

      //On/off
      var fs_menuitem9 = $("<li/>").addClass("switch");
      var fs_switch = $("<input/>")
        .attr("id", "fs_switch")
        .attr("type", "checkbox")
        .attr("data-toggle", "toggle")
        .attr("data-style", "ios");
      fs_menuitem9.on("click", function() {
        fs_flag = !fs_flag;
      });
      fs_menuitem9.append(fs_switch);
      dropMenu.append(fs_menuitem9);
      //end
    };
  };

  return fontStyle;
});
