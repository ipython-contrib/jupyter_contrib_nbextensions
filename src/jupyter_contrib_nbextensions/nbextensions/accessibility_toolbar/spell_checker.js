define([
  "base/js/namespace",
  "jquery",
  "require",
  "base/js/events",
  "base/js/utils"
], function(Jupyter, $) {
  "use strict";

  var spell_checker = function() {
    var spc_flag = false;

    spell_checker.prototype.spc_click = function() {
      var cell = Jupyter.notebook.get_cell_element(0);
      var i = 0;
      while (cell != null) {
        var text = cell[0].textContent;
        var cell_type = cell[0].classList[1];
        i++;
        cell = Jupyter.notebook.get_cell_element(i);
      }
    };

    spell_checker.prototype.spc_css_initial = function(url) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = requirejs.toUrl(url);
      document.getElementsByTagName("head")[0].appendChild(link);
    };

    spell_checker.prototype.spc_js_initial = function(url) {
      var script = document.createElement("script");
      script.src = requirejs.toUrl(url);
      document.getElementsByTagName("head")[0].appendChild(script);
    };

    spell_checker.prototype.spc_initial = function() {
      this.spc_css_initial(
        "../../nbextensions/accessibility_toolbar/spellchecker.css"
      );
      //get spell check button on the page
      var spc = $("[title='Spell Checker']");
      var spcdiv = $("<div>", { display: "inline", class: "btn-group" });
      spc.parent().append(spcdiv);
      spcdiv.append(spc);
      spc.addClass("dropdown-toggle");
      spc.attr("data-toggle", "dropdown");
      this.spc_dropdown_initial(spc);
    };

    spell_checker.prototype.spc_dropdown_initial = function(spc) {
      //Create the dropdown menu
      var dropMenu = $("<ul>", { class: "dropdown-menu", id: "spc_dropdown" });
      //TODO: Create the menu item in the dropdown menu: sliding switch, Input
      //List Item 1: Toggle Switch
      var spc_menuitem1 = $("<li>", { class: "switch" });
      var spc_switch = $("<input>", {
        id: "spc_switch",
        type: "checkbox",
        "data-toggle": "toggle"
      });
      spc_menuitem1.click(function() {
        spc_flag = !spc_flag;
      });
      spc_menuitem1.append(spc_switch);
      dropMenu.append(spc_menuitem1);

      //List Item 2: Pop-up spell checker dialog button and the pop-up menu
      const m2_template = `<hr><button class='spc_dialog' id='dlg_btn' data-toggle='modal' data-target='#popup_dlg' data-backdrop='false'>Open spell-checker</button>`;
      var spc_menuitem2 = $("<li>");
      const dlg_template = `
                <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div></div></div>`;
      spc_menuitem2.append(m2_template);
      dropMenu.append(spc_menuitem2);
      var popup_dlg = $("<div>", {
        id: "popup_dlg",
        tabindex: "-1",
        class: "modal fade",
        role: "dialog"
      });
      popup_dlg.append(dlg_template);
      spc.parent().append(popup_dlg);

      //append dropdown menu to parent
      spc.parent().append(dropMenu);
    };
  };
  return spell_checker;
});
