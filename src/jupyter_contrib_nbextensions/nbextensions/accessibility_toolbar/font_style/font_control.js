define(["base/js/namespace", "jquery"], function(Jupyter, $) {
  "use strict";

  var Font_control = function() {
    var paddingBot = 0;
    var paddingTop = 0;
    var fs_style;
    var style_file;
    const font_value_list = [
      "monospace",
      "Arial, Helvetica, sans-serif",
      "'Arial Black', Gadget, sans-serif",
      "'Comic Sans MS', cursive, sans-serif",
      "Georgia, serif",
      "Impact, Charcoal, sans-serif, cursive, sans-serif",
      "'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
      "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
      "Tahoma, Geneva, sans-serif",
      "'Times New Roman', Times, serif",
      "Verdana, Geneva, sans-serif"
    ];
    const font_name_list = [
      "Monospace",
      "Arial",
      "Arial Black",
      "Comic Sans MS",
      "Georgia",
      "Impact",
      "Lucida Sans Unicode",
      "Palatino Linotype",
      "Tahoma",
      "Times New Roman",
      "Verdana"
    ];
    const font_size_list = [
      "10",
      "12",
      "14",
      "20",
      "28",
      "32",
      "48",
      "56",
      "64",
      "72"
    ];

    Font_control.prototype.font_name = function() {
      for (i = 0; i < document.styleSheets.length; i++) {
        if (/.*\/custom\/custom\.css/.test(document.styleSheets[i].href)) {
          style_file = document.styleSheets[i];
          break;
        }
      }
      for (i = 0; i < style_file.cssRules.length; i++) {
        if (/\.CodeMirror pre/.test(style_file.cssRules[i].selectorText)) {
          fs_style = style_file.cssRules[i].style;
          break;
        }
      }
      console.log(fs_style);
      if (fs_style == null) {
        style_file.insertRule(
          ".CodeMirror pre { font-size: 14px; padding-bottom: 0px; padding-top:0px}",
          0
        );
        style_file.insertRule(
          ".CodeMirror pre span { font-family: monospace; }",
          1
        );
        fs_style = style_file.cssRules;
      }

      var fs_font_name = $("<select>", {
        id: "font_name",
        class: "select-box",
        style: "float:right"
      });
      for (var i in font_value_list) {
        if (font_value_list[i] == "monospace") {
          fs_font_name.append(
            $("<option>", {
              value: font_value_list[i],
              selected: "selected"
            }).text(font_name_list[i])
          );
        } else {
          fs_font_name.append(
            $("<option>", {
              value: font_value_list[i],
              class: "select-box-options"
            }).text(font_name_list[i])
          );
        }
      }
      return fs_font_name;
    };

    Font_control.prototype.font_size = function() {
      var fs_font_size = $("<select>", {
        id: "font_size",
        class: "select-box",
        style: "float:right"
      });
      for (var size in font_size_list) {
        if (font_size_list[size] == "14") {
          fs_font_size.append(
            $("<option>", {
              value: font_size_list[size],
              selected: "selected"
            }).text(font_size_list[size])
          );
        } else {
          fs_font_size.append(
            $("<option>", { value: font_size_list[size] }).text(
              font_size_list[size]
            )
          );
        }
      }
      return fs_font_size;
    };

    Font_control.prototype.set_font_name = function(name) {
      for (var i = 0; i < fs_style.length; i++) {
        if (/font\-family/.test(fs_style[i].cssText)) {
          var index = i;
        }
      }
      document.getElementById("notebook").style.fontFamily = name;
      style_file.deleteRule(index);
      style_file.insertRule(".CodeMirror span{ font-family:" + name + "; }", 0);
    };

    Font_control.prototype.set_font_size = function(size) {
      for (var i = 0; i < fs_style.length; i++) {
        if (/font\-size/.test(fs_style[i].cssText)) {
          var index = i;
        }
      }
      document.getElementById("notebook").style.fontSize = size + "px";
      paddingBot = size <= 14 ? 0 : size - 14;
      paddingTop = size <= 14 ? 0 : size - 14;
      style_file.deleteRule(index);
      style_file.insertRule(
        ".CodeMirror pre { font-size:" +
          size +
          "px; padding-bottom:" +
          paddingBot +
          "px; padding-top:" +
          paddingTop +
          "px}",
        0
      );
    };

    Font_control.prototype.get_font_name = function() {
      return this.fontName;
    };

    Font_control.prototype.get_font_size = function() {
      return this.fontSize;
    };

    Font_control.prototype.font_change = function() {
      var that = this;
      $(document).ready(function() {
        $("#font_name").change(function() {
          var selected_font_style = $(this)
            .children("option:selected")
            .val();
          that.set_font_name(selected_font_style);
          that.fontName = selected_font_style;
          localStorage.setItem(
            "font_name",
            JSON.stringify(selected_font_style)
          );
        });
        $("#font_size").change(function() {
          var selected_font_size = $(this)
            .children("option:selected")
            .val();
          that.set_font_size(selected_font_size);
          that.fontSize = selected_font_size;
          localStorage.setItem("font_size", JSON.stringify(selected_font_size));
        });
      });
    };

    Font_control.prototype.load_font_change = function(
      font_name,
      font_size,
      def
    ) {
      var that = this;
      $(document).ready(function() {
        that.set_font_name(font_name);
        that.fontName = font_name;
        $("#font_name")[0].value = font_name;
        if (!def) localStorage.setItem("font_name", JSON.stringify(font_name));

        that.set_font_size(font_size);
        that.fontSize = font_size;
        $("#font_size")[0].value = font_size;
        if (!def) localStorage.setItem("font_size", JSON.stringify(font_size));
      });
    };

    Font_control.prototype.set_default_values = function() {
      this.load_font_change("monospace", 14, true);
    };
  };
  return Font_control;
});
