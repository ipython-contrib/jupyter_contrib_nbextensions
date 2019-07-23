define([
  "base/js/namespace",
  "jquery",
  "./spc_function/checker",
  "codemirror/lib/codemirror"
], function(Jupyter, $, Checker, Codemirror) {
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

    spell_checker.prototype.spc_initial = function() {
      //get spell check button on the page
      var spc = $("[title='Spell Checker']");
      var spcdiv = $("<div>", { display: "inline", class: "btn-group" });
      spc.parent().append(spcdiv);
      spcdiv.append(spc);
      spc.addClass("dropdown-toggle main-btn");
      spc.attr("data-toggle", "dropdown");
      spc.attr("id", "spc");
      this.spc_dropdown_initial(spc);
    };

    spell_checker.prototype.spc_dropdown_initial = function(spc) {
      //Create the dropdown menu
      var dropMenu = $("<ul>", {
        class: "dropdown-menu dropdown-menu-style",
        id: "spc_dropdown"
      });
      //TODO: Create the menu item in the dropdown menu: sliding switch, Input
      //List Item 1: Toggle Switch
      var spc_menuitem1 = $("<li>", { class: "switch text-center focus" }).text(
        "OFF\xa0\xa0"
      );
      var spc_switch = $("<input>", {
        id: "spc_switch",
        type: "checkbox",
        "data-toggle": "toggle",
        "data-style": "ios",
        "data-onstyle": "warning",
        "data-offstyle": "default",
        "data-width": "58",
        "data-on": " ",
        "data-off": " ",
        tabindex: "0"
      });

      spc_menuitem1.click(function() {
        if (spc_flag == false) {
          spc_flag = true;
        } else {
          spc_flag = false;
        }
      });
      var offText = $("<p>", { style: "display:inline" }).text("\xa0\xa0ON");
      spc_menuitem1.append(spc_switch);
      spc_menuitem1.append(offText);
      dropMenu.append(spc_menuitem1);
      $(document).on("click", "#spc", function(e) {
        e.stopPropagation();
      });
      $(document).on("click", "#spc_dropdown", function(e) {
        e.stopPropagation();
      });
      //List Item 2: Pop-up spell checker dialog button and the pop-up menu
      const m2_template = `<hr><a class='spc-dialog-btn' id='dlg_btn' data-toggle='modal' data-target='#popup_dlg' data-backdrop='false'>Open spell-checker</a>`;
      var spc_menuitem2 = $("<li>", { class: "text-center spc-btn-li" });
      var dlg_template = `
                <div class="modal-dialog" role="document" id="spc_main_body">
                <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="exampleModalLabel">Spell Checker</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                <form><fieldset>
                    <h5>Enter or Paste your text below</h5>
                    <div id="textarea1" class="text-input-area"></div>
                    </fieldset></form>
                    <button id="check-btn">Check</button>
                    <hr>
                    <h5>Suggestions</h5>
                    <select id="suggestions" class="suggestions" size="5"></select>
                    <button id="apply-btn">Select and Apply</button>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
              </div>
                </div></div>`;

      spc_menuitem2.append(m2_template);
      dropMenu.append(spc_menuitem2);
      var popup_dlg = $("<div>", {
        id: "popup_dlg",
        class: "modal",
        role: "dialog"
      });
      popup_dlg.append(dlg_template);
      // spc.parent().append(popup_dlg);
      var nb_panel = $("#notebook_panel");
      nb_panel.append(popup_dlg);
      //append dropdown menu to parent
      spc.parent().append(dropMenu);

      var editor = Codemirror(document.getElementById("textarea1"));
      editor.setSize(null, 100);
      $("#textarea1").click(function() {
        Jupyter.notebook.keyboard_manager.edit_mode();
      });

      var checker = new Checker();
      $("#check-btn").click(function() {
        checker.get_word_list(editor);
      });
      $("#apply-btn").click(function() {
        checker.apply_change();
      });
    };
  };
  return spell_checker;
});
