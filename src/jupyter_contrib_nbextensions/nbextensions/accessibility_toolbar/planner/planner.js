define([
  "base/js/namespace",
  "jquery",
  "require",
  "base/js/utils",
  "./simplemde.min"
], function(Jupyter, $, requirejs, utils, SimpleMDE) {
  var Planner = function() {
    this.create_planner_folder();
  };

  Planner.prototype.initialise_planner = function() {
    var planner_button = $("[title='Planner']").addClass("main-btn");
    var planner_button_div = $("<div/>").addClass("btn-group");

    planner_button_div.appendTo(planner_button.parent());
    planner_button_div.append(planner_button);
    this.open = false;

    this.planner = $("<div id='nbextension-planner'>").addClass("col-md-4");
    this.create_main_body();

    $("#notebook")
      .addClass("row")
      .append(this.planner);

    this.planner.hide();
    this.setup_planner_ui();
  };

  Planner.prototype.create_main_body = function() {
    this.main_body = $("<div/>")
      .addClass("row")
      .attr("id", "main_body");

    const text_area = $("<textarea id='text_area'/>");

    this.main_body.append(text_area);

    this.main_body.click(function() {
      Jupyter.keyboard_manager.edit_mode();
    });

    this.planner.append(this.main_body);
  };

  Planner.prototype.open_planner = function() {
    this.open = true;
    var site_height = $("#site").height();
    this.planner.css("height", site_height);
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

  Planner.prototype.setup_planner_ui = function() {
    var simplemde = new SimpleMDE({
      autofocus: true,
      autosave: {
        enabled: true,
        uniqueId: "planner_content",
        delay: 500
      },
      element: document.getElementById("text_area"),
      forceSync: true,
      hideIcons: ["fullscreen", "side-by-side"],
      indentWithTabs: false,
      insertTexts: {
        horizontalRule: ["", "\n\n-----\n\n"],
        image: ["![](http://", ")"],
        link: ["[", "](http://)"],
        table: [
          "",
          "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n"
        ]
      },
      lineWrapping: false,
      parsingConfig: {
        allowAtxHeaderWithoutSpace: true,
        strikethrough: false,
        underscoresBreakWords: true
      },
      placeholder: "Type here...",
      promptURLs: true,
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true
      },
      shortcuts: {
        drawTable: "Cmd-Alt-T"
      },
      showIcons: ["code", "table"],
      spellChecker: true,
      status: false,
      status: ["autosave", "lines", "words", "cursor"], // Optional usage
      status: [
        "autosave",
        "lines",
        "words",
        "cursor",
        {
          className: "keystrokes",
          defaultValue: function(el) {
            this.keystrokes = 0;
            el.innerHTML = "0 Keystrokes";
          },
          onUpdate: function(el) {
            el.innerHTML = ++this.keystrokes + " Keystrokes";
          }
        }
      ],
      styleSelectedText: false,
      tabSize: 4,
      toolbarTips: true
    });
    var that = this;
    simplemde.codemirror.on("change", function() {
      // console.log(simplemde.value());
      that.create_planner_file();
    });
  };

  Planner.prototype.create_planner_folder = function() {
    var data = JSON.stringify({
      ext: "text",
      type: "directory"
    });

    var url = Jupyter.notebook.contents.api_url("/planner/");

    var settings = {
      processData: false,
      type: "PUT",
      data: data,
      dataType: "json"
    };
    utils.promising_ajax(url, settings);
  };

  Planner.prototype.create_planner_file = async function() {
    var data = JSON.stringify({
      ext: "text",
      type: "file",
      content: localStorage.getItem("smde_planner_content"),
      format: "text"
    });

    var url = Jupyter.notebook.contents.api_url(
      "/planner/" + $("#notebook_name").text()
    );

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

  return Planner;
});
