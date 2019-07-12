define(["base/js/namespace", "jquery"], function(Jupyter, $) {
  "use strict";

  var Font_control = function() {
    Font_control.prototype.font_name = function() {
      var fs_font_name = $("<select>", {
        id: "font_name",
        class: "select-box"
      });
      fs_font_name.append(
        $("<option>", { value: "monospace", selected: "selected" }).text(
          "Monospace"
        )
      );
      fs_font_name.append(
        $("<option>", { value: "Arial, Helvetica, sans-serif" }).text("Arial")
      );
      fs_font_name.append(
        $("<option>", { value: "'Arial Black', Gadget, sans-serif" }).text(
          "Arial Black"
        )
      );
      fs_font_name.append(
        $("<option>", { value: "'Comic Sans MS', cursive, sans-serif" }).text(
          "Comic Sans MS"
        )
      );
      fs_font_name.append(
        $("<option>", { value: "Georgia, serif" }).text("Georgia")
      );
      fs_font_name.append(
        $("<option>", {
          value: "Impact, Charcoal, sans-serif, cursive, sans-serif"
        }).text("Impact")
      );
      fs_font_name.append(
        $("<option>", {
          value: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif"
        }).text("Lucida Sans Unicode")
      );
      fs_font_name.append(
        $("<option>", {
          value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif"
        }).text("Palatino Linotype")
      );
      fs_font_name.append(
        $("<option>", { value: "Tahoma, Geneva, sans-serif" }).text("Tahoma")
      );
      fs_font_name.append(
        $("<option>", { value: "'Times New Roman', Times, serif" }).text(
          "Times New Roman"
        )
      );
      fs_font_name.append(
        $("<option>", { value: "Verdana, Geneva, sans-serif" }).text("Verdana")
      );
      return fs_font_name;
    };

    Font_control.prototype.font_size = function() {
      var fs_font_size = $("<select>", {
        id: "font_size",
        class: "select-box"
      });
      fs_font_size.append($("<option>", { value: "10" }).text("10"));
      fs_font_size.append($("<option>", { value: "12" }).text("12"));
      fs_font_size.append(
        $("<option>", { value: "14", selected: "selected" }).text("14")
      );
      fs_font_size.append($("<option>", { value: "20" }).text("20"));
      fs_font_size.append($("<option>", { value: "28" }).text("28"));
      fs_font_size.append($("<option>", { value: "32" }).text("32"));
      fs_font_size.append($("<option>", { value: "48" }).text("48"));
      fs_font_size.append($("<option>", { value: "56" }).text("56"));
      fs_font_size.append($("<option>", { value: "64" }).text("64"));
      fs_font_size.append($("<option>", { value: "72" }).text("72"));
      return fs_font_size;
    };

    Font_control.prototype.Upper_transform = function() {
      var fs_Upper = $("<a/>", {
        id: "transform",
        class: "font-size-box"
      }).text("Transform to uppercase");
      // fs_Upper.click(function(){
      //     var cell_index=Jupyter.notebook.get_selected_index();
      //     document.getElementsByClassName("CodeMirror")[cell_index].style.textTransform="uppercase";
      // })
      return fs_Upper;
    };

    Font_control.prototype.Lower_transform = function() {
      var fs_Lower = $("<a/>", {
        id: "transform",
        class: "font-size-box"
      }).text("Transform to lowercase");
      // fs_Lower.click(function(){
      //     var cell_index=Jupyter.notebook.get_selected_index();
      //     document.getElementsByClassName("CodeMirror")[cell_index].style.textTransform="lowercase";
      // })
      return fs_Lower;
    };
  };
  return Font_control;
});
