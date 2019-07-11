define(["base/js/namespace", "jquery", "base/js/utils"], function(
  Jupyter,
  $,
  utils
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

    var sub_option1 = $("<li/>");
    var new_style_button = $("<a/>")
      .attr("id", "new_style_button")
      .text("Add new style...")
      .attr("href", "#")
      // .addClass('spc_dialog')
      .attr("data-toggle", "modal")
      .attr("data-target", "#new_style")
      .attr("data-backdrop", "false");
    sub_option1.append(new_style_button);

    new_style_button.click(function() {
      Jupyter.keyboard_manager.edit_mode();
    });

    var fs_obj = this;
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
      await fs_obj.create_style_file($("#style_name").val() + ".json");
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

    var sub_option2 = $("<li/>");
    var edit_style = $("<a/>")
      .text("Edit a style...")
      .attr("href", "#");
    sub_option2.append(edit_style);

    customise_options.append(sub_option1);
    customise_options.append(sub_option2);
    option1.append(customise_styles);

    option1.append(customise_options);
    style_options.append(option1);

    var styles_list = await this.get_style_list();
    console.log(styles_list);

    $.each(styles_list, function(key, value) {
      var style_option = $("<li/>");
      var style = $("<a/>")
        .text(value)
        .attr("href", "#");
      style_option.append(style);
      style_options.append(style_option);

      style.click(async function() {
        await fs_obj.set_style_values(value);
      });
    });

    fs_menuitem1.append(fs_predefined_styles);
    fs_menuitem1.append(style_options);

    dropMenu.append(fs_menuitem1);
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

  predefined_styles.prototype.create_style_file = async function(style_name) {
    var data = JSON.stringify({
      ext: "text",
      type: "file",
      content: JSON.stringify({
        style_name: style_name.slice(0, -5),
        font_colour: "green",
        font_name: "Times New Roman",
        font_size: 12,
        background_colour: "red",
        line_height: 1.6,
        letter_spacing: 1.2
      }),
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

    // Set font colour
    console.log(JSON.parse(styles.content).font_colour);
    // Set font name
    console.log(JSON.parse(styles.content).font_name);
    // Set font size
    console.log(JSON.parse(styles.content).font_size);
    // Set background colour
    console.log(JSON.parse(styles.content).background_colour);
    // Set line height
    console.log(JSON.parse(styles.content).line_height);
    // Set letter spacing
    console.log(JSON.parse(styles.content).letter_spacing);
  };

  return predefined_styles;
});
