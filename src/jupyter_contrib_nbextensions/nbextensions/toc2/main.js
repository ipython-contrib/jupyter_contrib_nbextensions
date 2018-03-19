// Adapted from https://gist.github.com/magican/5574556
// by minrk https://github.com/minrk/ipython_extensions
// See the history of contributions in README.md

define([
    'require',
    'jquery',
    'base/js/namespace',
    'base/js/events',
    'notebook/js/codecell',
    'nbextensions/toc2/toc2'
], function(
    requirejs,
    $,
    Jupyter,
    events,
    codecell,
    toc2
) {
    "use strict";

    // imports
    var highlight_toc_item = toc2.highlight_toc_item;
    var table_of_contents = toc2.table_of_contents;
    var toggle_toc = toc2.toggle_toc;
    var IPython = Jupyter;

    // extra download as html with toc menu
    function addSaveAsWithToc() {

      if (parseFloat(Jupyter.version.substr(0, 3)) >= 5.1) {
        if ($("#download_html_toc").length === 0) {
          /* Add an entry in the download menu */
          var downloadEntry = $('<li id="download_html_toc"><a href="#">HTML with toc (.html)</a></li>')
          $("#download_html").after(downloadEntry)
          downloadEntry.click(function () {
              Jupyter.menubar._nbconvert('html_toc', true);
          });
        }
      }
      else {   /* Add a "save a" menu entry for pre 5.1 versions (needs python kernel) */
        if (IPython.notebook.metadata.kernelspec.language == 'python') {
            if ($('#save_html_with_toc').length == 0) {
                $('#save_checkpoint').after("<li id='save_html_with_toc'/>")
                $('#save_html_with_toc')
                    .append($('<a/>').text('Save as HTML (with toc)').attr("href", "#"))
                    .on('click', function (evt) {
                        if (IPython.notebook.metadata.kernelspec.language == 'python') {
                            var code = "!jupyter nbconvert '" + IPython.notebook.notebook_name + "' --template toc2";
                            console.log('[toc2] running:', code);
                            IPython.notebook.kernel.execute(code);
                        }
                        else {
                            alert('Sorry; this only works with a IPython kernel');
                            $('#save_html_with_toc').remove();
                        }
                    });
            }
        }
        else {
            $('#save_html_with_toc').remove()
        }
      }
    }

    var toc_button = function(cfg) {
        if (!IPython.toolbar) {
            events.on("app_initialized.NotebookApp", function (evt) {
                toc_button(cfg);
            });
            return;
        }
        if ($("#toc_button").length === 0) {
            $(IPython.toolbar.add_buttons_group([
                Jupyter.keyboard_manager.actions.register ({
                    'help'   : 'Table of Contents',
                    'icon'   : 'fa-list',
                    'handler': function() { toggle_toc(cfg); },
                }, 'toggle-toc', 'toc2')
            ])).find('.btn').attr('id', 'toc_button');
        }
    };

    var load_css = function() {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = requirejs.toUrl("./main.css");
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    function create_additional_css(cfg) {
        var sheet = document.createElement('style')
        sheet.innerHTML = "#toc li > span:hover { background-color: " + cfg.colors.hover_highlight + " }\n" +
            ".toc-item-highlight-select  {background-color: " + cfg.colors.selected_highlight + "}\n" +
            ".toc-item-highlight-execute  {background-color: " + cfg.colors.running_highlight + "}\n" +
            ".toc-item-highlight-execute.toc-item-highlight-select   {background-color: " + cfg.colors.selected_highlight + "}"
        if (cfg.moveMenuLeft) {
            sheet.innerHTML += "div#menubar-container, div#header-container {\n" +
                "width: auto;\n" +
                "padding-left: 20px; }"
        }
        // Using custom colors
        sheet.innerHTML += "#toc-wrapper { background-color: " + cfg.colors.wrapper_background + "}\n";
        sheet.innerHTML += "#toc a, #navigate_menu a, .toc { color: " + cfg.colors.navigate_text + "}";
        sheet.innerHTML += "#toc-wrapper .toc-item-num { color: " + cfg.colors.navigate_num + "}";
        sheet.innerHTML += ".sidebar-wrapper { border-color: " + cfg.colors.sidebar_border + "}";
        sheet.innerHTML += ".highlight_on_scroll { border-left: solid 4px " + cfg.colors.on_scroll + '}';
        document.body.appendChild(sheet);
    }


    var CodeCell = codecell.CodeCell;

    function patch_CodeCell_get_callbacks() {

        var previous_get_callbacks = CodeCell.prototype.get_callbacks;
        CodeCell.prototype.get_callbacks = function() {
            var callbacks = previous_get_callbacks.apply(this, arguments);
            var prev_reply_callback = callbacks.shell.reply;
            callbacks.shell.reply = function(msg) {
                if (msg.msg_type === 'execute_reply') {
                    setTimeout(function() {
                        $('.toc .toc-item-highlight-execute').removeClass('toc-item-highlight-execute');
                        rehighlight_running_cells() // re-highlight running cells
                    }, 100);
                    var c = IPython.notebook.get_selected_cell();
                    highlight_toc_item({
                        type: 'selected'
                    }, {
                        cell: c
                    })
                }
                return prev_reply_callback(msg);
            };
            return callbacks;
        };
    }

    function rehighlight_running_cells() {
        $.each($('.running'), // re-highlight running cells
            function(idx, elt) {
                highlight_toc_item({
                    type: "execute"
                }, $(elt).data())
            }
        )
    }

    var toc_init = function() {
        // read configuration, then call toc
        IPython.notebook.config.loaded.then(function () {
            var cfg = toc2.read_config();
            // create highlights style section in document
            create_additional_css(cfg);
            // add toc toggle button (now that cfg has loaded)
            toc_button(cfg);
            // call main function with newly loaded config
            table_of_contents(cfg);
            // event: render toc for each markdown cell modification
            events.on("rendered.MarkdownCell", function(evt, data) {
                table_of_contents(cfg); // recompute the toc
                rehighlight_running_cells() // re-highlight running cells
                highlight_toc_item(evt, data); // and of course the one currently rendered
            });
        });

        // event: on cell selection, highlight the corresponding item
        events.on('select.Cell', highlight_toc_item);
            // event: if kernel_ready (kernel change/restart): add/remove a menu item
        events.on("kernel_ready.Kernel", function() {
            addSaveAsWithToc();
        })

        // add a save as HTML with toc included
        addSaveAsWithToc();
        // Highlight cell on execution
        patch_CodeCell_get_callbacks()
        events.on('execute.CodeCell', highlight_toc_item);
    }

    var load_ipython_extension = function() {
        load_css(); //console.log("Loading css")

        // Wait for the notebook to be fully loaded
        if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
            // this tests if the notebook is fully loaded
            console.log("[toc2] Notebook fully loaded -- toc2 initialized ")
            toc_init();
        } else {
            console.log("[toc2] Waiting for notebook availability")
            events.on("notebook_loaded.Notebook", function() {
                console.log("[toc2] toc2 initialized (via notebook_loaded)")
                toc_init();
            })
        }

    };


    return {
        load_ipython_extension: load_ipython_extension,
        toggle_toc: toggle_toc,
        table_of_contents: table_of_contents
    };

});
