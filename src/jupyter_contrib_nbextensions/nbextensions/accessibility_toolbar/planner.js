define(["base/js/namespace", "jquery", "require"], function(
  Jupyter,
  $,
  requirejs
) {
  var Planner = function() {};

  Planner.prototype.initialise_planner = function() {
    var planner_button = $("[title='Planner']").addClass("main-btn");
    var planner_button_div = $("<div/>").addClass("btn-group");

    planner_button_div.appendTo(planner_button.parent());
    planner_button_div.append(planner_button);

    this.open = false;

    this.planner = $("<div id='nbextension-planner'>").addClass("col-md-4");

    // this.create_toolbar();
    this.planner.append($("<br/>"));
    this.create_main_body();

    $("#notebook")
      .addClass("row")
      .append(this.planner);

    this.planner.hide();
    this.setup_planner();
    $(document).ready(function() {
      new EasyMDE();
    });
  };

  Planner.prototype.create_main_body = function() {
    this.main_body = $("<div/>")
      .addClass("row")
      .attr("id", "main_body");

    const text_area = $("<textarea/>");

    this.main_body.append(text_area);

    this.main_body.click(function() {
      Jupyter.keyboard_manager.edit_mode();
    });

    this.planner.append(this.main_body);
  };

  Planner.prototype.create_toolbar = function() {
    var planner = this;
    const toolbar = $("<div/>").addClass("icon-bar");

    const close_icon = $("<i/>").addClass("fa fa-close");
    close_icon.click(function() {
      planner.close_planner();
    });
    const close = $("<a/>").append(close_icon);

    const bullet_icon = $("<i/>").addClass("fa fa-list");
    const bullet_list = $("<a/>").append(bullet_icon);

    const num_icon = $("<i/>").addClass("fa fa-list-ol");
    const num_list = $("<a/>").append(num_icon);

    const header_icon = $("<i/>").addClass("fa fa-header");
    const header = $("<a/>").append(header_icon);

    const size_icon = $("<i/>").addClass("fa fa-text-height");
    const font_size = $("<a/>").append(size_icon);

    const left_icon = $("<i/>").addClass("fa fa-align-left");
    const align_left = $("<a/>").append(left_icon);

    const center_icon = $("<i/>").addClass("fa fa-align-center");
    const align_center = $("<a/>").append(center_icon);

    const right_icon = $("<i/>").addClass("fa fa-align-right");
    const align_right = $("<a/>").append(right_icon);

    const upload_icon = $("<i/>").addClass("fa fa-upload");
    const upload_button = $("<a/>")
      .attr("type", "file")
      .append(upload_icon);
    const upload_file = $("<input/>")
      .attr("id", "upload_file")
      .attr("type", "file");

    upload_button.click(function() {
      planner.upload_image();
    });

    const draw_icon = $("<i/>").addClass("fa fa-pencil");
    const draw = $("<a/>").append(draw_icon);

    toolbar
      .append(close)
      .append(bullet_list)
      .append(num_list)
      .append(header)
      .append(font_size)
      .append(align_left)
      .append(align_center)
      .append(align_right)
      .append(upload_button)
      .append(upload_file)
      .append(draw);
    this.planner.append(toolbar);
  };

  Planner.prototype.upload_image = function() {
    $("#upload_file").trigger("click");

    $("#upload_file").change(function() {
      if (this.files && this.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
          var resizable_div = $("<div/>").addClass("resizable");
          var img = $("<img>").attr("src", e.target.result);
          resizable_div.html(img);
          $("#text_area").append(resizable_div);
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  };

  Planner.prototype.open_planner = function() {
    this.open = true;
    var site_height = $("#site").height();
    this.planner.css("height", site_height);
    // this.element.show({ direction: "left" }, 750);
    this.planner.show();
    $("#notebook-container").addClass("col-md-8");
  };

  Planner.prototype.close_planner = function() {
    this.open = false;
    this.planner.hide({ direction: "right" }, 750);
    $("#notebook-container").removeClass("col-md-8");
  };

  Planner.prototype.toggle_planner = function() {
    this.open ? this.close_planner() : this.open_planner();
  };

  Planner.prototype.setup_planner = function() {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = requirejs.toUrl("./planner.css");
    document.getElementsByTagName("head")[0].appendChild(link);
    console.log("New Planner Created");
  };

  return Planner;
});
