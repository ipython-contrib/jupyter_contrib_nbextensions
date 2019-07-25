define(["base/js/namespace", "jquery", "require"], function(
  Jupyter,
  $,
  requirejs
) {
  "use strict";
  
  //constructor
  var ThemesController = function() {
  };

  // detects the change in the toggle switch and applies the appropriate theme
  ThemesController.prototype.theme_change = function() {
    $(document).ready(function() {
      const currentTheme = localStorage.getItem("theme")
        ? localStorage.getItem("theme")
        : null;
      console.log("The current theme is ", currentTheme);
      if (currentTheme) {
        document.documentElement.setAttribute("data-theme", currentTheme);
        if (currentTheme === "dark") {
          $("#darkToggle").prop("checked", "true");
          $("#highToggle").attr("disabled", "disabled");
        } else if (currentTheme === "contrast") {
          $("#highToggle").prop("checked", "true");
          $("#darkToggle").attr("disabled", "disabled");
        }
      }

      $("#darkToggle").change(function() {
        if ($(this).prop("checked")) {
          document.documentElement.setAttribute("data-theme", "dark");
          localStorage.setItem("theme", "dark");
          $("#highToggle").attr("disabled", "disabled");
        } else {
          document.documentElement.setAttribute("data-theme", "default");
          localStorage.setItem("theme", "default");
          $("#highToggle").removeAttr("disabled", "disabled");
        }
      });
      $("#highToggle").change(function() {
        if ($(this).prop("checked")) {
          document.documentElement.setAttribute("data-theme", "contrast");
          localStorage.setItem("theme", "contrast");
          $("#darkToggle").attr("disabled", "disabled");
        } else {
          document.documentElement.setAttribute("data-theme", "default");
          localStorage.setItem("theme", "default");
          $("#darkToggle").removeAttr("disabled", "disabled");
        }
      });
    });
  };
  return ThemesController;
});
