define([
  "base/js/namespace",
  "jquery",
  "codemirror/lib/codemirror",
  "./spc_function"
], function(Jupyter, $, Codemirror, Spc) {
  "use strict";

  var spell_checker = function() {
    var spc_flag =
      localStorage.getItem("spcflag") == null
        ? false
        : localStorage.getItem("spcflag");

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
                    <button id="check-btn" class="spc_btn" style="transform:translateY(5px)">Check</button>
                    <h5>Suggestions</h5>
                    <select id="suggestions" class="suggestions" size="5"></select>
                    <br>
                    <button id="apply-btn" class="spc_btn">Apply Selected word</button>
                    <hr>
                    <h5>Add new word to dictionary</h5>
                    <input id="new_word" type="text" class="new_word">
                    <button id="add-new-btn" class="spc_btn">Add new word to dictionary</button>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
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

      var nb_panel = $("#notebook_panel");
      nb_panel.append(popup_dlg);
      spc.parent().append(dropMenu);

      //create codemirror cell
      var editor = Codemirror(document.getElementById("textarea1"));
      editor.setSize(null, 500);
      $("#textarea1").click(function() {
        Jupyter.notebook.keyboard_manager.edit_mode();
      });
      $("#new_word").click(function() {
        Jupyter.notebook.keyboard_manager.edit_mode();
      });
      //add new word
      var add_input = $("#new_word");
      $("#add-new-btn").click(function() {
        spc.add_word(add_input.val());
        spc.refresh();
      });

      var cell_list = document.querySelectorAll(".CodeMirror");
      var checker_cell = cell_list[cell_list.length - 1];
      var spc = new Spc(checker_cell);
      spc.define_mode();
      //toggle switch controller
      if (localStorage.getItem("spcflag") == "true") {
        spc_switch.trigger("click");
        spc.toggle();
      }
      spc_switch.on("change", function() {
        spc_flag = spc_flag ? false : true;
        if (!spc_flag) {
          spc.toggle();
        } else {
          spc.toggle();
        }
      });

      $("#check-btn").click(function() {
        spc.default();
        checker_cell.CodeMirror.setOption("mode", "spc");
        spc.get_suggestions();
      });

      //apply selected word
      $("#apply-btn").click(function() {
        spc.apply();
      });

      //list item3: settings for spell checker
      var spc_menuitem3 = $("<li>", { class: "text-center spc-btn-li" });
      const m3_template = `<hr><a class='spc-dialog-btn' id='setting_btn' data-toggle='modal' data-target='#setting_dlg' data-backdrop='false'>Settings</a>`;
      var setting_template = `
      <div class="modal-dialog" role="document" id="spc_main_body">
      <div class="modal-content">
      <div class="modal-header">
          <h4 class="modal-title" id="exampleModalLabel">Spell Checker Settings</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
      </div>
      <div class="modal-body">
        <div>
        <div class="form-check">
        <input class="form-check-input" type="radio" name="Radios" id="Bold_radio" value="Bold" checked>
        <label class="form-check-label" for="Bold_radio">
            Bold
        </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="Radios" id="Underline_radio" value="Underline">
          <label class="form-check-label" for="Underline_radio">
            Underline
          </label>
        </div>
        </div></div>
      <div class="modal-footer">
      <button id="apply_change_btn" type="button" class="btn btn-primary" data-dismiss="modal">Apply changes</button>
      <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>
      </div></div>
      `;
      spc_menuitem3.append(m3_template);
      var setting_dlg = $("<div>", {
        id: "setting_dlg",
        class: "modal",
        role: "dialog"
      });
      setting_dlg.append(setting_template);
      dropMenu.append(spc_menuitem3);
      nb_panel.append(setting_dlg);

      $("#apply_change_btn").click(function() {
        var temp = document.querySelector("input[value='Bold']").checked;
        spc.change_style(temp, spc_flag);
      });
    };
  };
  return spell_checker;
});
