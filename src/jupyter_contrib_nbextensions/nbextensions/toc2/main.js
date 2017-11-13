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
    require,
    $,
    IPython,
    events,
    codecell,
    toc2
) {
    "use strict";

    // imports
    var highlight_toc_item = toc2.highlight_toc_item;
    var table_of_contents = toc2.table_of_contents;
    var toggle_toc = toc2.toggle_toc;

// ...........Parameters configuration......................
    // default values for system-wide configurable parameters
    var cfg={'threshold':4, 
             'navigate_menu':true,
             'markTocItemOnScroll': true,
             'moveMenuLeft': true,
             'widenNotebook': false,
             'colors': {
                'hover_highlight': '#DAA520',
                'selected_highlight': '#FFD700',
                'running_highlight': '#FF0000',
                'wrapper_background': '#FFFFFF',
                'sidebar_border': '#EEEEEE',
                'navigate_text': '#333333',
                'navigate_num': '#000000',
                'on_scroll': '#2447f0',
              },
              collapse_to_match_collapsible_headings: false,
}
    // default values for per-notebook configurable parameters
    var metadata_settings = {
        nav_menu: {},
        number_sections: true,
        sideBar: true,
        skip_h1_title: false,
        title_cell: 'Table of Contents',
        title_sidebar: 'Contents',
        toc_cell: false,
        toc_position: {},
        toc_section_display: true,
        toc_window_display: false,
    };
    // add per-notebook settings into global config object
    $.extend(true, cfg, metadata_settings);

    var read_config = function (cfg, callback) {
        IPython.notebook.config.loaded.then(function () {
      // config may be specified at system level or at document level.
      // first, update defaults with config loaded from server
            $.extend(true, cfg, IPython.notebook.config.data.toc2);
            // ensure notebook metadata has toc object, cache old values
            var md = IPython.notebook.metadata.toc || {};
            // reset notebook metadata to remove old values
            IPython.notebook.metadata.toc = {};
      // then update cfg with any found in current notebook metadata
      // and save in nb metadata (then can be modified per document)
            Object.keys(metadata_settings).forEach(function (key) {
                cfg[key] = IPython.notebook.metadata.toc[key] = (md.hasOwnProperty(key) ? md : cfg)[key];
            });
            // create highlights style section in document
            create_additional_css();
            // call callbacks
            callback && callback();
        });
      return cfg;
    };

    // extra download as html with toc menu (needs IPython kernel)
    function addSaveAsWithToc() {
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



// **********************************************************************

//***********************************************************************
// ----------------------------------------------------------------------

    function toggleToc() {
        toggle_toc(cfg)
    }

    var toc_button = function() {
        if (!IPython.toolbar) {
            events.on("app_initialized.NotebookApp", toc_button);
            return;
        }
        if ($("#toc_button").length === 0) {
            $(IPython.toolbar.add_buttons_group([
                Jupyter.keyboard_manager.actions.register ({
                    'help'   : 'Table of Contents',
                    'icon'   : 'fa-list',
                    'handler': toggleToc,
                }, 'toggle-toc', 'toc2')
            ])).find('.btn').attr('id', 'toc_button');
        }
    };

    var load_css = function() {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl("./main.css");
        document.getElementsByTagName("head")[0].appendChild(link);
    };


    function create_additional_css() {
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
        sheet.innerHTML += ".float-wrapper, .sidebar-wrapper { background-color: " + cfg.colors.wrapper_background + "}";
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


    function excute_codecell_callback(evt, data) {
        highlight_toc_item(evt, data);
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
        cfg = read_config(cfg, function() {
            table_of_contents(cfg);
        }); // called after config is stable
        // event: render toc for each markdown cell modification
        events.on("rendered.MarkdownCell",
            function(evt, data) {
                table_of_contents(cfg); // recompute the toc
                rehighlight_running_cells() // re-highlight running cells
                highlight_toc_item(evt, data); // and of course the one currently rendered
            });
        // event: on cell selection, highlight the corresponding item
        events.on('select.Cell', highlight_toc_item);
            // event: if kernel_ready (kernel change/restart): add/remove a menu item
        events.on("kernel_ready.Kernel", function() {
            addSaveAsWithToc();
        })

        // add a save as HTML with toc included    
        addSaveAsWithToc();
        // 
        // Highlight cell on execution
        patch_CodeCell_get_callbacks()
        events.on('execute.CodeCell', excute_codecell_callback);
    }


    var load_ipython_extension = function() {
        load_css(); //console.log("Loading css")
        toc_button(); //console.log("Adding toc_button")

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
