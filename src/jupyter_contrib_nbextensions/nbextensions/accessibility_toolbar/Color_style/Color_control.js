define(["base/js/namespace", "jquery", "./Spectrum"], function(
  Jupyter,
  $,
  Spectrum
) {
  "use strict";

  //=============
  $("head").append('<style type="text/css"></style>');
  var newStyleElement = $("head").children(":last");
  newStyleElement.html(
    ".sp-palette .sp-thumb-el.sp-thumb-focus {outline: 1px dotted #212121;outline: 5px auto -webkit-focus-ring-color;}"
  );

  var link2 = document.createElement("link");
  link2.type = "text/css";
  link2.rel = "stylesheet";
  link2.href =
    "https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css";
  document.getElementsByTagName("head")[0].appendChild(link2);

  var fs_style;
  var style_Sheet;
  var current_backgroundColor = "#fff";
  var current_backgroundColorInput = "#f7f7f7";
  var current_fontColor = "#000";
  //================
  var Color_control = function() {};

  //==== Methods to return the default values ===
  Color_control.prototype.background_color_reset = function() {
    return "#fff";
  };
  Color_control.prototype.input_background_color_reset = function() {
    return "#f7f7f7";
  };

  Color_control.prototype.font_color_reset = function() {
    return "#000";
  };

  Color_control.prototype.color_reset = function() {
    if (fs_style == null) {
      style_Sheet.insertRule(
        ".ctb_global_show .ctb_show + .input_area { background-color :#f7f7f7;  color : #000 ; }",
        0
      );
      style_Sheet.insertRule(
        ".ctb_global_show .ctb_show + div.text_cell_input, .ctb_global_show .ctb_show ~ div.text_cell_render { background-color :#fff;  color : #000 ; }",
        1
      );
      style_Sheet.insertRule(
        "div.output_area pre { background-color :#fff;  color : #000 ;",
        2
      );
      style_Sheet.insertRule(
        "[role*=presentation] { background-color : #f7f7f7;  color : #000 ;",
        3
      );
    } else {
      style_Sheet.deleteRule(0);
      style_Sheet.deleteRule(0);
      style_Sheet.deleteRule(0);
      style_Sheet.deleteRule(0);
      style_Sheet.insertRule(
        ".ctb_global_show .ctb_show + .input_area { background-color :#f7f7f7;  color : #000 ; }",
        0
      );
      style_Sheet.insertRule(
        ".ctb_global_show .ctb_show + div.text_cell_input, .ctb_global_show .ctb_show ~ div.text_cell_render { background-color :#fff;  color : #000 ; }",
        1
      );
      style_Sheet.insertRule(
        "div.output_area pre { background-color :#fff;  color : #000 ;",
        2
      );
      style_Sheet.insertRule(
        "[role*=presentation] { background-color : #f7f7f7;  color : #000 ;",
        3
      );
    }
  };
  //=========================================
  Color_control.prototype.background_color = function() {
    $(function() {
      $("#color-picker-background").spectrum({
        showPaletteOnly: true,
        togglePaletteOnly: true,
        togglePaletteMoreText: "more",
        togglePaletteLessText: "less",
        showInput: true,
        preferredFormat: "hex",
        showInitial: true,
        palette: [
          ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
          ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
          [
            "#f4cccc",
            "#fce5cd",
            "#fff2cc",
            "#d9ead3",
            "#d0e0e3",
            "#cfe2f3",
            "#d9d2e9",
            "#ead1dc"
          ],
          [
            "#ea9999",
            "#f9cb9c",
            "#ffe599",
            "#b6d7a8",
            "#a2c4c9",
            "#9fc5e8",
            "#b4a7d6",
            "#d5a6bd"
          ],
          [
            "#e06666",
            "#f6b26b",
            "#ffd966",
            "#93c47d",
            "#76a5af",
            "#6fa8dc",
            "#8e7cc3",
            "#c27ba0"
          ],
          [
            "#c00",
            "#e69138",
            "#f1c232",
            "#6aa84f",
            "#45818e",
            "#3d85c6",
            "#674ea7",
            "#a64d79"
          ],
          [
            "#900",
            "#b45f06",
            "#bf9000",
            "#38761d",
            "#134f5c",
            "#0b5394",
            "#351c75",
            "#741b47"
          ],
          [
            "#600",
            "#783f04",
            "#7f6000",
            "#274e13",
            "#0c343d",
            "#073763",
            "#20124d",
            "#4c1130"
          ]
        ],

        change: function(color) {
          current_backgroundColor = color.toHexString();
          current_backgroundColorInput = color.toHexString();
          set_color();
        }
      });
    });
  }; // end background_color
  Color_control.prototype.font_color = function() {
    $(function() {
      $("#color-picker").spectrum({
        showPaletteOnly: true,
        togglePaletteOnly: true,
        togglePaletteMoreText: "more",
        togglePaletteLessText: "less",
        showInput: true,
        preferredFormat: "hex",
        showInitial: true,
        palette: [
          ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
          ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
          [
            "#f4cccc",
            "#fce5cd",
            "#fff2cc",
            "#d9ead3",
            "#d0e0e3",
            "#cfe2f3",
            "#d9d2e9",
            "#ead1dc"
          ],
          [
            "#ea9999",
            "#f9cb9c",
            "#ffe599",
            "#b6d7a8",
            "#a2c4c9",
            "#9fc5e8",
            "#b4a7d6",
            "#d5a6bd"
          ],
          [
            "#e06666",
            "#f6b26b",
            "#ffd966",
            "#93c47d",
            "#76a5af",
            "#6fa8dc",
            "#8e7cc3",
            "#c27ba0"
          ],
          [
            "#c00",
            "#e69138",
            "#f1c232",
            "#6aa84f",
            "#45818e",
            "#3d85c6",
            "#674ea7",
            "#a64d79"
          ],
          [
            "#900",
            "#b45f06",
            "#bf9000",
            "#38761d",
            "#134f5c",
            "#0b5394",
            "#351c75",
            "#741b47"
          ],
          [
            "#600",
            "#783f04",
            "#7f6000",
            "#274e13",
            "#0c343d",
            "#073763",
            "#20124d",
            "#4c1130"
          ]
        ],
        change: function(color) {
          current_fontColor = color.toHexString();
          set_color();
        }
      });
    });
  }; // end font_color

  function set_color() {
    for (var i = 0; i < document.styleSheets.length; i++) {
      if (/.*\/custom\/custom\.css/.test(document.styleSheets[i].href)) {
        console.log("p0");
        style_Sheet = document.styleSheets[i];
        break;
      }
    }
    var rule = style_Sheet.cssRules ? style_Sheet.cssRules : style_Sheet.rules;
    console.log("2lengY=" + rule.length);
    for (var i = 0; i < rule.length; i++) {
      if (
        /\.ctb_global_show \.ctb_show \+ \.input_area/.test(
          rule[i].selectorText
        )
      ) {
        console.log("p1");
        fs_style = rule[i].style;
        break;
      }
    }
    if (fs_style == null) {
      console.log("p2");
      style_Sheet.insertRule(
        ".ctb_global_show .ctb_show + .input_area { background-color :" +
          current_backgroundColorInput +
          ";  color : " +
          current_fontColor +
          "; }",
        0
      );
      style_Sheet.insertRule(
        ".ctb_global_show .ctb_show + div.text_cell_input, .ctb_global_show .ctb_show ~ div.text_cell_render { background-color :" +
          current_backgroundColor +
          ";  color : " +
          current_fontColor +
          "; }",
        1
      );
      style_Sheet.insertRule(
        "div.output_area pre { background-color :" +
          current_backgroundColor +
          ";  color : " +
          current_fontColor +
          "; }",
        2
      );
      style_Sheet.insertRule(
        "[role*=presentation] { background-color :" +
          current_backgroundColorInput +
          ";  color : " +
          current_fontColor +
          "; }",
        3
      );
    } else {
      console.log("p3");
      console.log(fs_style.length);
      style_Sheet.deleteRule(0);
      style_Sheet.deleteRule(0);
      style_Sheet.deleteRule(0);
      style_Sheet.deleteRule(0);
      style_Sheet.insertRule(
        ".ctb_global_show .ctb_show + .input_area { background-color :" +
          current_backgroundColorInput +
          ";  color : " +
          current_fontColor +
          "}",
        0
      );
      style_Sheet.insertRule(
        ".ctb_global_show .ctb_show + div.text_cell_input, .ctb_global_show .ctb_show ~ div.text_cell_render { background-color :" +
          current_backgroundColor +
          ";  color : " +
          current_fontColor +
          "}",
        1
      );
      style_Sheet.insertRule(
        "div.output_area pre { background-color :" +
          current_backgroundColor +
          ";  color : " +
          current_fontColor +
          "}",
        2
      );
      style_Sheet.insertRule(
        "[role*=presentation] { background-color :" +
          current_backgroundColorInput +
          ";  color : " +
          current_fontColor +
          "}",
        3
      );
    }
  } //end set color

  return Color_control;
});
