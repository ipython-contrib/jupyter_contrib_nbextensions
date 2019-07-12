define(["base/js/namespace", "jquery", "base/js/utils", "require"], function(
  Jupyter,
  $,
  utils,
  requirejs
) {
  "use strict";

  var predefined_styles = function() {
    this.create_styles_folder();
  };

  predefined_styles.prototype.create_menus = async function(dropMenu, fs) {
    var fs_menuitem1 = $("<li/>").addClass("dropdown-submenu");
    var fs_predefined_styles = $("<a/>")
      .text("Predefined styles")
      .attr("href", "#");

    var style_options = $("<ul/>").addClass("dropdown-menu");

    var option1 = $("<li/>").addClass("dropdown-submenu");
    var customise_styles = $("<a/>")
      .text("Customise Style")
      .attr("href", "#");

    var customise_options = $("<ul/>").addClass("dropdown-menu");

    var sub_option1 = this.new_style_creator(fs);

    var sub_option2 = await this.delete_style_creator(fs);

    customise_options.append(sub_option1);
    customise_options.append(sub_option2);
    option1.append(customise_styles);

    option1.append(customise_options);
    style_options.append(option1);

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
      .attr("data-backdrop", "false");
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
                        <input id="style_name" class="form-control input-sm" placeholder="New style name"/>
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
      await ps_obj.save_current_styles();
      location.reload();
      Jupyter.keyboard_manager.command_mode();
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
      .attr("data-backdrop", "false");
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
    var styles_list = await this.get_style_list();

    $.each(styles_list, function(key, value) {
      var style_option = $("<li/>");
      var style = $("<a/>")
        .text(value)
        .attr("href", "#");
      style_option.append(style);
      style_options.append(style_option);

      var ps_obj = this;
      style.click(async function() {
        await ps_obj.set_style_values(value);
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

    //TODO: Set font colour
    var font_colour = JSON.parse(styles.content).font_colour;

    //TODO: Set font name
    var font_name = JSON.parse(styles.content).font_name;

    //TODO: Set font size
    var font_size = JSON.parse(styles.content).font_size;

    //TODO: Set background colour
    var background_colour = JSON.parse(styles.content).background_colour;

    //TODO: Set line height
    var line_height = JSON.parse(styles.content).line_height;

    //TODO: Set letter spacing
    var letter_spacing = JSON.parse(styles.content).letter_spacing;
  };

  predefined_styles.prototype.save_current_styles = async function() {
    var style_name = $("#style_name").val();
    var style_data = {
      style_name: style_name,
      font_colour: "green", //TODO: save font colour
      font_name: "Times New Roman", //TODO: save font name
      font_size: 12, //TODO: save font size
      background_colour: "red", //TODO: save background colour
      line_height: 1.6, //TODO: save line height
      letter_spacing: 1.2 //TODO: save letter spacing
    };

    await this.create_style_file(style_name + ".json", style_data);
  };

  predefined_styles.prototype.delete_style = async function(style_name) {
    await Jupyter.notebook.contents.delete("/styles/" + style_name + ".json");
  };

  return predefined_styles;
});
