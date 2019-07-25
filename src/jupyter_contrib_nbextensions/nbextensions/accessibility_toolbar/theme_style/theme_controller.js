define(["base/js/namespace", "jquery", "require"], function(
  Jupyter,
  $,
  requirejs
) {
  "use strict";

  var Themes_controller = function() {};

  Themes_controller.prototype.theme_change = function() {
    $(document).ready(function() {
      const currentTheme = localStorage.getItem("theme")
        ? localStorage.getItem("theme")
        : null;
      if (currentTheme) {
        document.documentElement.setAttribute("data-theme", currentTheme);
        if (currentTheme === "dark") {
          $("#darkToggle").prop("checked", "true");
          $("#highToggle").attr("disabled", "disabled");
        } else if (currentTheme === "contrast") {
          $("#highToggle").prop("checked", "true");
          $("#darkToggle").attr("disabled", "disabled");
        }
      } else {
        document.documentElement.setAttribute("data-theme", "default");
        localStorage.setItem("theme", "default");
      }

      $("#darkToggle").change(function() {
        if ($(this).prop("checked")) {
          document.documentElement.setAttribute("data-theme", "dark");
          localStorage.setItem("theme", "dark");
          $("#highToggle").attr("disabled", "disabled");
          if (localStorage.getItem("toggle") === "true") {
            $("#fs_switch").trigger("click");
            localStorage.setItem("toggle", "true");
          }
          $("#switch").addClass("disabled");
        } else {
          document.documentElement.setAttribute("data-theme", "default");
          localStorage.setItem("theme", "default");
          $("#highToggle").removeAttr("disabled", "disabled");
          if (localStorage.getItem("toggle") === "true") {
            $("#fs_switch").trigger("click");
          }
          $("#switch").removeClass("disabled");
        }
      });
      $("#highToggle").change(function() {
        if ($(this).prop("checked")) {
          document.documentElement.setAttribute("data-theme", "contrast");
          localStorage.setItem("theme", "contrast");
          $("#darkToggle").attr("disabled", "disabled");
          if (localStorage.getItem("toggle") === "true") {
            $("#fs_switch").trigger("click");
            localStorage.setItem("toggle", "true");
          }
          $("#switch").addClass("disabled");
        } else {
          document.documentElement.setAttribute("data-theme", "default");
          localStorage.setItem("theme", "default");
          $("#darkToggle").removeAttr("disabled", "disabled");
          if (localStorage.getItem("toggle") === "true") {
            $("#fs_switch").trigger("click");
          }
          $("#switch").removeClass("disabled");
        }
      });
    });
  };
  return Themes_controller;
});
