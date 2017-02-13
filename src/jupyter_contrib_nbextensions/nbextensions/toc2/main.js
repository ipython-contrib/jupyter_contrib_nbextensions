// Adapted from https://gist.github.com/magican/5574556
// by minrk https://github.com/minrk/ipython_extensions
// See the history of contributions in README.md


//define(["require", "jquery", "base/js/namespace",  'services/config',
//    'base/js/utils', "nbextensions/toc2/toc2"], function(require, $, IPython, configmod, utils, toc2) {

define(["require", "jquery", "base/js/namespace",  'services/config',
    'base/js/utils', 'notebook/js/codecell', "nbextensions/toc2/toc2"], function(require, $, IPython, configmod, utils, codecell, toc2 ) {

  var Notebook = require('notebook/js/notebook').Notebook
  "use strict";


// ...........Parameters configuration......................
 // define default values for config parameters if they were not present in general settings (notebook.json)
    var cfg={'threshold':4, 
             'number_sections':true, 
             'toc_cell':false,
             'toc_window_display':false,
             "toc_section_display": "block",
             'sideBar':true,
	           'navigate_menu':true,
             'moveMenuLeft': true,
             'widenNotebook': false,
             'colors': {'hover_highlight': '#DAA520',
             'selected_highlight': '#FFD700',
             'running_highlight': '#FF0000'}
}

//.....................global variables....

    var liveNotebook = !(typeof IPython == "undefined")

    var st={}
    st.rendering_toc_cell = false; 
    st.config_loaded = false;
    st.extension_initialized=false;

    st.nbcontainer_marginleft = $('#notebook-container').css('margin-left')
    st.nbcontainer_marginright = $('#notebook-container').css('margin-right')
    st.nbcontainer_width = $('#notebook-container').css('width')
    st.oldTocHeight = undefined 

    st.cell_toc = undefined;
    st.toc_index=0;



  function read_config(cfg, callback) { // read after nb is loaded
      // create config object to load parameters
      var base_url = utils.get_body_data("baseUrl");
      var initial_cfg = $.extend(true, {}, cfg);
      var config = new configmod.ConfigSection('notebook', { base_url: base_url });
      config.loaded.then(function(){ 
      // config may be specified at system level or at document level.
      // first, update defaults with config loaded from server
      cfg = $.extend(true, cfg, config.data.toc2);
      // then update cfg with any found in current notebook metadata
      // and save in nb metadata (then can be modified per document)
      cfg = IPython.notebook.metadata.toc = $.extend(true, cfg,
          IPython.notebook.metadata.toc);
      // excepted colors that are taken globally (if defined)
      cfg.colors = $.extend(true, {}, initial_cfg.colors);      
      try
         {cfg.colors = IPython.notebook.metadata.toc.colors = $.extend(true, cfg.colors, config.data.toc2.colors);  }
      catch(e) {}
      // and moveMenuLeft, threshold, wideNotebook taken globally (if it exists, otherwise default)
      cfg.moveMenuLeft = IPython.notebook.metadata.toc.moveMenuLeft = initial_cfg.moveMenuLeft;
      cfg.threshold = IPython.notebook.metadata.toc.threshold = initial_cfg.threshold;
      cfg.widenNotebook = IPython.notebook.metadata.toc.widenNotebook = initial_cfg.widenNotebook;
      if (config.data.toc2) {
        if (typeof config.data.toc2.moveMenuLeft !== "undefined") {
            cfg.moveMenuLeft = IPython.notebook.metadata.toc.moveMenuLeft = config.data.toc2.moveMenuLeft; 
        }
        if (typeof config.data.toc2.threshold !== "undefined") {
            cfg.threshold = IPython.notebook.metadata.toc.threshold = config.data.toc2.threshold; 
        }
        if (typeof config.data.toc2.widenNotebook !== "undefined") {
            cfg.widenNotebook = IPython.notebook.metadata.toc.widenNotebook = config.data.toc2.widenNotebook; 
        }
      }
      // create highlights style section in document
      create_additional_css()
      // call callbacks
      callback && callback();
      st.config_loaded = true;
    })
      config.load();
      return cfg;
  }




// **********************************************************************

//***********************************************************************
// ----------------------------------------------------------------------

  function toggleToc() {
    toggle_toc(cfg,st)
  }

  var toc_button = function () {
    if (!IPython.toolbar) {
      $([IPython.events]).on("app_initialized.NotebookApp", toc_button);
      return;
    }
    if ($("#toc_button").length === 0) {
      IPython.toolbar.add_buttons_group([
        {
          'label'   : 'Table of Contents',
          'icon'    : 'fa-list',
          'callback':  toggleToc,
          'id'      : 'toc_button'
        }
      ]);
    }
  };
  
  var load_css = function () {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = require.toUrl("./main.css");
    document.getElementsByTagName("head")[0].appendChild(link);
  };
  

  function create_additional_css() {
      var sheet = document.createElement('style')
      sheet.innerHTML = "#toc-level0 li > a:hover {  display: block; background-color: " + cfg.colors.hover_highlight + " }\n" +
          ".toc-item-highlight-select  {background-color: " + cfg.colors.selected_highlight + "}\n" +
          ".toc-item-highlight-execute  {background-color: " + cfg.colors.running_highlight + "}\n" +
          ".toc-item-highlight-execute.toc-item-highlight-select   {background-color: " + cfg.colors.selected_highlight + "}"       
      if (cfg.moveMenuLeft){
        sheet.innerHTML += "div#menubar-container, div#header-container {\n"+
            "width: auto;\n"+
            "padding-left: 20px; }"
      }          
      document.body.appendChild(sheet);
  }



  var CodeCell = codecell.CodeCell;

  function patch_CodeCell_get_callbacks() {

    var previous_get_callbacks = CodeCell.prototype.get_callbacks;
    CodeCell.prototype.get_callbacks = function() {
        var that = this;
        var callbacks = previous_get_callbacks.apply(this, arguments);
        var prev_reply_callback = callbacks.shell.reply;
        callbacks.shell.reply = function(msg) {
            if (msg.msg_type === 'execute_reply') {
                setTimeout(function(){ 
                       $(toc).find('.toc-item-highlight-execute').removeClass('toc-item-highlight-execute')
              rehighlight_running_cells() // re-highlight running cells
                 }, 100);
                var c = IPython.notebook.get_selected_cell();
                highlight_toc_item({ type: 'selected' }, { cell: c })
            }
            return prev_reply_callback(msg);
        };
        return callbacks;
    };
  }


  function excute_codecell_callback(evt, data) {
      var cell = data.cell;
      highlight_toc_item(evt, data);
  }

  function rehighlight_running_cells() {
      $.each($('.running'), // re-highlight running cells
          function(idx, elt) {
              highlight_toc_item({ type: "execute" }, $(elt).data())
          }
      )
  }

  var toc_init = function() {
      // read configuration, then call toc    
      cfg = read_config(cfg, function() { table_of_contents(cfg, st); }); // called after config is stable           
      // event: render toc for each markdown cell modification
      $([IPython.events]).on("rendered.MarkdownCell",
          function(evt, data) {
              table_of_contents(cfg, st); // recompute the toc
              rehighlight_running_cells() // re-highlight running cells
              highlight_toc_item(evt, data); // and of course the one currently rendered
          });
      // event: on cell selection, highlight the corresponding item
      $([IPython.events]).on('select.Cell', highlight_toc_item)
          // event: if kernel_ready (kernel change/restart): add/remove a menu item
      $([IPython.events]).on("kernel_ready.Kernel", function() {
              addSaveAsWithToc();
          })
          // add a save as HTML with toc included    
      addSaveAsWithToc();
      // 
      // Highlight cell on execution
      patch_CodeCell_get_callbacks()
      $([Jupyter.events]).on('execute.CodeCell', excute_codecell_callback);
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
          $([Jupyter.events]).on("notebook_loaded.Notebook", function() {
              console.log("[toc2] toc2 initialized (via notebook_loaded)")
              toc_init();
          })
      }

  };


  return {
    load_ipython_extension : load_ipython_extension,
    toggle_toc : toggle_toc,
    table_of_contents : table_of_contents
  };

});
