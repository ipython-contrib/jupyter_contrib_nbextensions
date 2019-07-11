define(["base/js/namespace", "jquery"], function(Jupyter, $) {
  "use strict";

  var font_style = function() {
    var fs_flag = false;

    font_style.prototype.fs_initial = function() {
      this.create_styles_folder();

      //fs_initial
      //find Customise font button on the page
      var fs = $('button[title="Customise font"]');
      fs.addClass("dropdown-toggle");
      fs.attr("data-toggle", "dropdown");
      var fsdiv = $("<div>", { style: "display:inline", class: "btn-group" });
      fs.parent().append(fsdiv);
      fsdiv.append(fs);
      this.fs_dropdown_initial(fs);
    }; //end fs_initial

    font_style.prototype.fs_dropdown_initial = function(fs) {
      //Create the dropdown menu
      var dropMenu = $("<ul/>")
        .addClass("dropdown-menu")
        .attr("id", "fs_dropdown");
      fs.parent().append(dropMenu);

      //Create the contents of dropdown menu
      //Predefined style
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

      $("#style_modal").on("hide.bs.modal", async function() {
        console.log("hello je;");
        await fs_obj.create_style_file("hello");
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
      //&submenu
      //&end submenu

      //Font color
      var fs_menuitem2 = $("<li/>");
      var fs_font_color = $("<a/>").text("Font color");
      fs_menuitem2.append(fs_font_color);
      dropMenu.append(fs_menuitem2);
      //end

      //Font name
      var fs_menuitem3 = $("<li/>");
      var fs_font_name = $("<a/>").text("Font name");
      fs_menuitem3.append(fs_font_name);
      dropMenu.append(fs_menuitem3);
      //end

      //Font size
      var fs_menuitem4 = $("<li/>");
      var fs_font_size = $("<a/>").text("Font size");
      fs_menuitem4.append(fs_font_size);
      dropMenu.append(fs_menuitem4);
      //end

      //Background color
      var fs_menuitem5 = $("<li/>");
      var fs_bg_color = $("<a/>").text("Background color");
      fs_menuitem5.append(fs_bg_color);
      dropMenu.append(fs_menuitem5);
      //end

      //Line spacing
      var fs_menuitem6 = $("<li/>");
      var fs_line_spacing = $("<a/>").text("Line spacing");
      fs_menuitem6.append(fs_line_spacing);
      dropMenu.append(fs_menuitem6);
      //end

      //Letter spacing
      var fs_menuitem7 = $("<li/>");
      var fs_letter_spacing = $("<a/>").text("Letter spacing");
      fs_menuitem7.append(fs_letter_spacing);
      dropMenu.append(fs_menuitem7);
      //end

      //Transform
      var fs_menuitem8 = $("<li/>");
      var fs_transform = $("<a/>").text("Transform");
      fs_menuitem8.append(fs_transform);
      dropMenu.append(fs_menuitem8);
      //end

      //On/off
      var fs_menuitem9 = $("<li/>").addClass("switch");
      var fs_switch = $("<input/>")
        .attr("id", "fs_switch")
        .attr("type", "checkbox")
        .attr("data-toggle", "toggle");
      fs_menuitem9.on("click", function() {
        fs_flag = !fs_flag;
      });
      fs_menuitem9.append(fs_switch);
      dropMenu.append(fs_menuitem9);
      //end
    };

    font_style.prototype.create_styles_folder = function() {
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

    font_style.prototype.create_style_file = async function(style_name) {
      var folder_name = await Jupyter.notebook.contents
        .new_untitled("/styles", { type: "file" })
        .then(folder => {
          return folder.name;
        });
      Jupyter.notebook.contents.rename(
        "/styles/" + folder_name,
        "/styles/" + style_name
      );
    };
  };

  return font_style;
});
