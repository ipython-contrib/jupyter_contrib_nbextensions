define(["base/js/namespace", "jquery"], function(Jupyter, $) {
  "use strict";

  var predefined_styles = function() {
    this.create_styles_folder();
  };

  predefined_styles.prototype.create_menus = function(dropMenu, fs) {
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
                </div></div></div>`;

    $(document).on("click", "#save-button", async function() {
      await fs_obj.create_style_file($("#style_name").val() + ".json");
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

    var styles_list = [
      "Previous Style",
      "LexieReadable",
      "LexieReadable Bold",
      "Nisaba",
      "OpenDyslexic Bold"
    ];

    // this.create_style_file();

    $.each(styles_list, function(key, value) {
      var style_option = $("<li/>");
      var style = $("<a/>")
        .text(value)
        .attr("href", "#");
      style_option.append(style);
      style_options.append(style_option);
    });

    fs_menuitem1.append(fs_predefined_styles);
    fs_menuitem1.append(style_options);

    dropMenu.append(fs_menuitem1);
  };

  predefined_styles.prototype.create_styles_folder = function() {
    Jupyter.notebook.contents
      .get("/styles", { type: "directory" })
      .catch(async function() {
        var folder_name = await Jupyter.notebook.contents
          .new_untitled("/", { type: "directory" })
          .then(folder => {
            return folder.name;
          });
        Jupyter.notebook.contents.rename(folder_name, "/styles");
      });
  };

  predefined_styles.prototype.create_style_file = async function(style_name) {
    var folder_name = await Jupyter.notebook.contents
      .new_untitled("/styles", { type: "file" })
      .then(folder => {
        return folder.name;
      });
    Jupyter.notebook.contents
      .rename("/styles/" + folder_name, "/styles/" + style_name)
      .catch(function() {
        alert("Style already exists");
        Jupyter.notebook.contents.delete("/styles/" + folder_name);
        //TODO: make modal stay open in this case
        // $('#style_modal').modal()});
      });
  };

  return predefined_styles;
});
