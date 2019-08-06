define(["base/js/namespace", "jquery", "require", "./simplemde.min"], function(
  Jupyter,
  $,
  requirejs,
  SimpleMDE
) {
  var Planner = function() {};

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

  return Planner;
});
