define(["base/js/namespace", "jquery", "require"], function(
  Jupyter,
  $,
  requirejs
) {
  "use strict";

  var ThemesController = function() {
    this.setup_css();
  };

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

  ThemesController.prototype.setup_css = function() {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = requirejs.toUrl("./themes.css");
    document.getElementsByTagName("head")[0].appendChild(link);
  };

  return ThemesController;
});
