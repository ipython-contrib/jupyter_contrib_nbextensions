define(["base/js/namespace", "jquery"], function(Jupyter, $) {
  "use strict";

  var Font_control = function() {
    var fontSize = "14";
    var fontName = "monospace";
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
            $("<option>", { value: font_value_list[i] }).text(font_name_list[i])
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

    function set_font_name(name) {
      for (
        var index = 0;
        index < document.getElementsByClassName("CodeMirror").length;
        index++
      ) {
        document.getElementsByClassName("CodeMirror")[
          index
        ].style.fontFamily = name;
        document.getElementsByClassName("inner_cell")[
          index
        ].style.fontFamily = name;
        try {
          document.getElementsByClassName("output_subarea")[
            index
          ].children[0].style.fontFamily = name;
        } catch (e) {
          continue;
        }
      }
    }

    function set_font_size(size) {
      for (
        var index = 0;
        index < document.getElementsByClassName("CodeMirror").length;
        index++
      ) {
        document.getElementsByClassName("CodeMirror")[index].style.fontSize =
          size + "px";
        document.getElementsByClassName("inner_cell")[index].style.fontSize =
          size + "px";
        try {
          document.getElementsByClassName("input_prompt")[
            index
          ].style.fontSize = size + "px";
          document.getElementsByClassName("output_subarea")[
            index
          ].style.fontSize = size + "px";
        } catch (e) {
          continue;
        }
      }
    }

    Font_control.prototype.get_font_name = function() {
      return this.fontName;
    };

    Font_control.prototype.get_font_size = function() {
      return this.fontSize;
    };

    Font_control.prototype.font_control = function() {
      $(document).ready(function() {
        $("#font_name").change(function() {
          var selected_font_style = $(this)
            .children("option:selected")
            .val();
          set_font_name(selected_font_style);
          this.fontName = selected_font_style;
        });
        $("#font_size").change(function() {
          var selected_font_size = $(this)
            .children("option:selected")
            .val();
          set_font_size(selected_font_size);
          this.fontSize = selected_font_size;
        });
      });
    };
  };
  return Font_control;
});
