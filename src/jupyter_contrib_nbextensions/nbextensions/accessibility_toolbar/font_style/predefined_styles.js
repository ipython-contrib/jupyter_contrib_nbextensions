define(["base/js/namespace", "jquery", "base/js/utils"], function(
  Jupyter,
  $,
  utils
) {
  "use strict";

  var selected_style = "";

  var predefined_styles = function(fc_obj, fsp_obj, cc_obj) {
    this.create_styles_folder();
    this.fc_obj = fc_obj;
    this.fsp_obj = fsp_obj;
    this.cc_obj = cc_obj;
  };

  predefined_styles.prototype.create_menus = async function(dropMenu, fs) {
    var fs_menuitem1 = $("<li/>")
      .addClass("menu_focus_highlight dropdown dropdown-submenu")
      .attr("role", "none")
      .attr("title", "select a predefined style")
      .attr("aria-label", "select a predefined style")
      .attr("id", "predefined_styles");
    var fs_predefined_styles = $("<a/>").text("Predefined styles");

    var style_options = $("<ul/>")
      .addClass("dropdown-menu dropdown-menu-style")
      .attr("role", "menu");

    var customise_options = $("<ul/>")
      .addClass("dropdown-menu")
      .attr("role", "menu");

    var sub_option1 = this.new_style_creator(fs);

    var sub_option2 = await this.delete_style_creator(fs);

    customise_options.append(sub_option1);
    customise_options.append(sub_option2);

    style_options.append(sub_option1);
    style_options.append(sub_option2);

    await this.create_styles_dropdown(style_options);

    fs_menuitem1.append(fs_predefined_styles);
    fs_menuitem1.append(style_options);

    dropMenu.append(fs_menuitem1);
  };

  predefined_styles.prototype.new_style_creator = function(fs) {
    var ps_obj = this;

    var sub_option1 = $("<li/>");
    var new_style_button = $("<a/>")
      .attr("id", "new_style_button")
      .text("Add new style...")
      .attr("href", "#")
      .attr("data-toggle", "modal")
      .attr("data-target", "#new_style")
      .attr("data-backdrop", "false")
      .attr("role", "menuitem");
    sub_option1.append(new_style_button);

    new_style_button.click(function() {
      Jupyter.keyboard_manager.edit_mode();
    });

    var new_style_modal = `
                <div id="style_modal" class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="modal-title" id="exampleModalLabel">Create a new predefined style</h4>
                </div>
                <div class="modal-body">
                    <form method="post" id="new_style_form">
                        <input id="style_name" type="text" class="form-control input-sm" placeholder="New style name"/>
                        <p id="invalid-char">*The character you entered is not permitted</p>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button id="save-button" type="submit" class="btn btn-default btn-sm btn-primary" 
                        data-dismiss="modal">Save current format settings</button>
                </div>
                </div>
                </div>`;

    $(document).on("click", "#save-button", async function() {
      var style_name = $("#style_name").val();
      await ps_obj.save_current_styles(style_name);
      location.reload();
      Jupyter.keyboard_manager.command_mode();
    });

    // Sanitise input
    $(document).ready(function() {
      $("#invalid-char").addClass("hidden");
      $("#style_name").keypress(function(key) {
        var valid_chars = /^[\w-_.]*$/;
        if (!valid_chars.test(String.fromCharCode(key.charCode))) {
          $("#invalid-char").removeClass("hidden");
          return false;
        } else {
          $("#invalid-char").addClass("hidden");
          return true;
        }
      });
    });

    var new_style = $("<div>", {
      id: "new_style",
      tabindex: "-1",
      class: "modal fade",
      role: "dialog"
    });
    new_style.append(new_style_modal);

    fs.parent().append(new_style);

    return sub_option1;
  };

  predefined_styles.prototype.delete_style_creator = async function(fs) {
    var ps_obj = this;
    var sub_option2 = $("<li/>");
    var edit_style = $("<a/>")
      .text("Delete a style...")
      .attr("id", "delete_style_button")
      .attr("href", "#")
      .attr("data-toggle", "modal")
      .attr("data-target", "#delete_style")
      .attr("data-backdrop", "false")
      .attr("role", "menuitem");
    sub_option2.append(edit_style);

    var delete_style_modal = `
                <div id="delete_style_modal" class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="modal-title" id="exampleModalLabel">Select a predefined style</h4>
                </div>
                <div id='modal_body' class="modal-body" style="text-align:center">
                    <form method="post" id="delete_style_form">
                        <select id="style-list" class="custom-select" multiple>
                        </select>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button id="delete-button" type="submit" class="btn btn-default btn-sm btn-primary" 
                        data-dismiss="modal">Delete selected style</button>
                </div>
                </div>
                </div>`;

    var delete_style = $("<div>", {
      id: "delete_style",
      tabindex: "-1",
      class: "modal fade",
      role: "dialog"
    });

    var select = $("<select multiple/>").addClass("custom-select");

    var style_list = await this.get_style_list();

    $(document).ready(function() {
      $.each(style_list, function(key, value) {
        var style = $("<option></option>")
          .text(value)
          .attr("value", value);
        $("#style-list").append(style);
      });
    });

    $(document).on("click", "#delete-button", async function() {
      var selected = $("#style-list option:selected").text();
      console.log(selected);
      await ps_obj.delete_style(selected);
      location.reload();
      Jupyter.keyboard_manager.command_mode();
    });

    $(".modal-body #modal_body").append(select);

    delete_style.append(delete_style_modal);
    fs.parent().append(delete_style);

    return sub_option2;
  };

  predefined_styles.prototype.create_styles_dropdown = async function(
    style_options
  ) {
    var ps_obj = this;
    var styles_list = await this.get_style_list();
    var first_val = true;

    $.each(styles_list, function(key, value) {
      var style_option = $("<li/>");
      var style = $("<a/>")
        .addClass("dropdown-item")
        .text(value)
        .attr("href", "#")
        .attr("role", "menuitem");
      if (first_val) {
        selected_style = style;
        style.addClass("dropdown-item-checked");
        first_val = false;
      }
      style_option.append(style);
      style_options.append(style_option);

      style.click(async function(event) {
        await ps_obj.set_style_values(value);
        event.preventDefault();
        selected_style.toggleClass("dropdown-item-checked");
        selected_style = style;
        $(this).addClass("dropdown-item-checked");
      });
    });
  };

  predefined_styles.prototype.create_styles_folder = function() {
    var data = JSON.stringify({
      ext: "text",
      type: "directory"
    });

    var url = Jupyter.notebook.contents.api_url("/styles/");

    var settings = {
      processData: false,
      type: "PUT",
      data: data,
      dataType: "json"
    };
    utils.promising_ajax(url, settings);
  };

  predefined_styles.prototype.create_style_file = async function(
    style_name,
    style_data
  ) {
    var data = JSON.stringify({
      ext: "text",
      type: "file",
      content: JSON.stringify(style_data),
      format: "text"
    });

    var url = Jupyter.notebook.contents.api_url("/styles/" + style_name);

    var settings = {
      processData: false,
      type: "PUT",
      data: data,
      contentType: "application/json",
      format: "text",
      dataType: "json"
    };
    utils.promising_ajax(url, settings);
  };

  predefined_styles.prototype.get_style_list = async function() {
    var styles = await Jupyter.notebook.contents.list_contents("/styles");

    var style_list = [];
    $.each(styles.content, function(key, value) {
      style_list.push(value.name.slice(0, -5));
    });
    return style_list;
  };

  predefined_styles.prototype.set_style_values = async function(style_name) {
    var styles = await Jupyter.notebook.contents.get(
      "/styles/" + style_name + ".json",
      { type: "file" }
    );

    var font_colour = JSON.parse(styles.content).font_colour;

    var font_name = JSON.parse(styles.content).font_name;
    var font_size = JSON.parse(styles.content).font_size;
    this.fc_obj.load_font_change(font_name, font_size);

    var background_colour = JSON.parse(styles.content).background_colour;
    this.cc_obj.set_colors(background_colour, font_colour);

    var line_height = JSON.parse(styles.content).line_height;
    this.fsp_obj.set_line_height(line_height);

    var letter_spacing = JSON.parse(styles.content).letter_spacing;
    this.fsp_obj.set_letter_spacing(letter_spacing);
  };

  predefined_styles.prototype.save_current_styles = async function(style_name) {
    var style_data = {
      style_name: style_name,
      font_colour: this.cc_obj.get_font_color(),
      font_name: this.fc_obj.get_font_name(),
      font_size: this.fc_obj.get_font_size(),
      background_colour: this.cc_obj.get_background_color(),
      line_height: this.fsp_obj.get_line_height(),
      letter_spacing: this.fsp_obj.get_letter_spacing()
    };
    await this.create_style_file(style_name + ".json", style_data);
  };

  predefined_styles.prototype.delete_style = async function(style_name) {
    await Jupyter.notebook.contents.delete("/styles/" + style_name + ".json");
  };

  return predefined_styles;
});
