define(["base/js/namespace", "jquery", "./spectrum"], function(
  Jupyter,
  $,
  Spectrum
) {
  "use strict";

  //=============
  var fs_style;
  var fs_style2;
  var fs_style3;
  var style_Sheet;
  var style_Sheet2;
  var style_Sheet3;
  var rule;
  var rule2;
  var rule3;
  var current_backgroundColor = "#fff";
  var current_backgroundColorInput = "#f7f7f7";
  var current_fontColor = "#000";
  var current_page_background_Color = "#fff";

  //================
  var Color_control = function() {
    this.add_focus();
  };

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

  //=========================================
  Color_control.prototype.background_color = function() {
    var that = this;
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
          that.set_color();
          that.set_markdown_color();
          localStorage.setItem(
            "background_color",
            JSON.stringify(current_backgroundColor)
          );
        }
      });
    });
  }; // end background_color
  //=========================================
  Color_control.prototype.page_background_color = function() {
    var that = this;
    $(function() {
      $("#color-picker-page-background").spectrum({
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
          console.log("change function");
          current_page_background_Color = color.toHexString();
          that.page_set_color();

          // localStorage.setItem(
          //   "background_color",
          //   JSON.stringify(current_backgroundColor)
          // );
        }
      });
    });
  }; // end page background_color
  Color_control.prototype.font_color = function() {
    var that = this;
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
          that.page_font_set_color();
          that.set_color();
          that.set_markdown_color();
          localStorage.setItem("font_color", JSON.stringify(current_fontColor));
        }
      });
    });
  }; // end font_color
  //=======================================================
  Color_control.prototype.set_color = function() {
    for (var i = 0; i < document.styleSheets.length; i++) {
      if (/.*\/custom\/custom\.css/.test(document.styleSheets[i].href)) {
        style_Sheet = document.styleSheets[i];
        break;
      }
    }
    rule = style_Sheet.cssRules;
    //if (/\.input_area/.test(rule[i].selectorText))
    for (var i = 0; i < rule.length; i++) {
      if (/\.input_area/.test(rule[i].selectorText)) {
        fs_style = rule[i].style;
        break;
      }
    }

    if (fs_style == null) {
      style_Sheet.insertRule(
        ".input_area div { background-color :" +
          current_backgroundColor +
          "!important; }",
        0
      );

      // style_Sheet.insertRule(
      //   "div.text_cell_render { background-color :" +
      //     current_backgroundColor +
      //     "!important;  color : " +
      //     current_fontColor +
      //     "!important; }",
      //   1
      // );
    } else {
      this.remove_style_rule();

      style_Sheet.insertRule(
        ".input_area div { background-color :" +
          current_backgroundColor +
          "!important; }",
        0
      );

      // style_Sheet.insertRule(
      //   "div.text_cell_render { background-color :" +
      //     current_backgroundColor +
      //     "!important;  color : " +
      //     current_fontColor +
      //     "!important; }",
      //   1
      // );
    }
    rule = style_Sheet.cssRules;
  };
  //end set color

  //=======================================================
  //=======================================================
  Color_control.prototype.set_markdown_color = function() {
    for (var i = 0; i < document.styleSheets.length; i++) {
      if (/.*\/custom\/custom\.css/.test(document.styleSheets[i].href)) {
        style_Sheet = document.styleSheets[i];
        break;
      }
    }
    rule = style_Sheet.cssRules;

    for (var i = 0; i < rule.length; i++) {
      if (/div.text_cell_render/.test(rule[i].selectorText)) {
        fs_style = rule[i].style;
        break;
      }
    }

    if (fs_style == null) {
      style_Sheet.insertRule(
        "div.text_cell_render { background-color :" +
          current_backgroundColor +
          "!important;  color : " +
          current_fontColor +
          "!important; }",
        0
      );
    } else {
      // remove rule====
      for (var j = 0; j < rule.length; j++) {
        console.log("delet loop");
        if (/div.text_cell_render/.test(rule[j].cssText)) {
          style_Sheet.deleteRule(j);
          console.log("rule deleted");
          rule = style_Sheet.cssRules;
          break;
        }
      }

      style_Sheet.insertRule(
        "div.text_cell_render { background-color :" +
          current_backgroundColor +
          "!important;  color : " +
          current_fontColor +
          "!important; }",
        0
      );
    }
    rule = style_Sheet.cssRules;
  };
  //end set markdown cell color

  //=======================================================

  Color_control.prototype.page_set_color = function() {
    console.log("start page pg function");
    for (var i = 0; i < document.styleSheets.length; i++) {
      console.log("css files loop");
      if (/.*\/custom\/custom\.css/.test(document.styleSheets[i].href)) {
        style_Sheet2 = document.styleSheets[i];
        console.log("found the css file");
        break;
      }
    }
    rule2 = style_Sheet2.cssRules;
    for (var i = 0; i < rule2.length; i++) {
      console.log("rules loop");
      if (/notebook-container/.test(rule2[i].selectorText)) {
        console.log("found the rule file");
        fs_style2 = rule2[i].style;
        break;
      }
    }

    if (fs_style2 == null) {
      console.log("fs_style2 == null");
      style_Sheet2.insertRule(
        "#notebook-container { background-color :" +
          current_page_background_Color +
          "!important; }",
        0
      );
    } else {
      console.log("fs_style2 != null");
      // remove rule====
      for (var j = 0; j < rule2.length; j++) {
        console.log("delet loop");
        //||/notebook-container/.test(rule[j].cssText)
        ///background\-color/.test(rule[j].cssText
        if (/notebook-container/.test(rule2[j].cssText)) {
          style_Sheet2.deleteRule(j);
          console.log("rule deleted");
          rule2 = style_Sheet2.cssRules;
          break;
        }
      }
      //========

      style_Sheet2.insertRule(
        "#notebook-container { background-color :" +
          current_page_background_Color +
          "!important; }",
        0
      );
      console.log("rule insert");
    }
    rule2 = style_Sheet2.cssRules;
  };
  //end  set page background color

  //==============================

  //==============================
  Color_control.prototype.page_font_set_color = function() {
    console.log("start page pg function");
    for (var i = 0; i < document.styleSheets.length; i++) {
      console.log("css files loop");
      if (/.*\/custom\/custom\.css/.test(document.styleSheets[i].href)) {
        style_Sheet3 = document.styleSheets[i];
        console.log("found the css file");
        break;
      }
    }
    rule3 = style_Sheet3.cssRules;
    for (var i = 0; i < rule3.length; i++) {
      console.log("rules loop");
      if (/div.output_area/.test(rule3[i].selectorText)) {
        console.log("found the rule file");
        fs_style3 = rule3[i].style;
        break;
      }
    }

    if (fs_style3 == null) {
      console.log("fs_style2 == null");
      style_Sheet3.insertRule(
        "div.output_area pre { color :" + current_fontColor + "!important; }",
        0
      );
    } else {
      console.log("fs_style2 != null");
      // remove rule====
      for (var j = 0; j < rule3.length; j++) {
        console.log("delet loop");
        //||/notebook-container/.test(rule[j].cssText)
        ///background\-color/.test(rule[j].cssText
        if (/div.output_area/.test(rule3[j].cssText)) {
          style_Sheet3.deleteRule(j);
          console.log("rule deleted");
          rule3 = style_Sheet3.cssRules;
          break;
        }
      }
      //========

      style_Sheet3.insertRule(
        "div.output_area pre { color :" + current_fontColor + "!important; }",
        0
      );
      console.log("rule insert");
    }
    rule3 = style_Sheet3.cssRules;
  };
  //end  set page font color

  //==============================

  Color_control.prototype.add_focus = function() {
    $("head").append('<style type="text/css"></style>');
    var newStyleElement = $("head").children(":last");
    newStyleElement.html(
      ".sp-palette .sp-thumb-el.sp-thumb-focus {outline: 1px dotted #212121;outline: 5px auto -webkit-focus-ring-color;}"
    );
  };

  Color_control.prototype.get_background_color = function() {
    return current_backgroundColor;
  };

  Color_control.prototype.get_font_color = function() {
    return current_fontColor;
  };

  Color_control.prototype.set_colors = function(
    background,
    background_input,
    font,
    def
  ) {
    current_backgroundColor = background;
    current_backgroundColorInput = background_input;
    current_fontColor = font;
    if (!def) {
      localStorage.setItem("background_color", JSON.stringify(background));
      localStorage.setItem(
        "background_input_color",
        JSON.stringify(background_input)
      );
      localStorage.setItem("font_color", JSON.stringify(font));
    }
    this.set_color();
  };

  Color_control.prototype.remove_style_rule = function() {
    console.log("entered delete");
    // for (var i = 0; i < 2; i++) {
    // /background\-color/.test(rule[j].cssText) ||
    // /div.text_cell_render/.test(rule[j].cssText) ||
    // /div.text_cell_render .rendered_html/.test(rule[j].cssText)
    for (var j = 0; j < rule.length; j++) {
      if (/.input_area div/.test(rule[j].cssText)) {
        style_Sheet.deleteRule(j);
        console.log("delete");
        rule = style_Sheet.cssRules;
        j = 0;
      }
    }
    // }
  };

  return Color_control;
});
