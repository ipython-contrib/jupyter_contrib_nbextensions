// Adapted from https://gist.github.com/magican/5574556
// by minrk https://github.com/minrk/ipython_extensions
// See the history of contributions in README.md


//define(["require", "jquery", "base/js/namespace",  'services/config',
//    'base/js/utils', "nbextensions/toc2/toc2"], function(require, $, IPython, configmod, utils, toc2) {

define(["require", "jquery", "base/js/namespace",  'services/config',
    'base/js/utils', "nbextensions/toc2/toc2"], function(require, $, IPython, configmod, utils, toc2 ) {

  "use strict";


// ...........Parameters configuration......................
 // define default values for config parameters if they were not present in general settings (notebook.json)
    var cfg={'threshold':4, 
             'number_sections':true, 
             'toc_cell':false,
             'toc_window_display':false,
             "toc_section_display": "block",
             'sideBar':true,
	           'navigate_menu':true}

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
      var config = new configmod.ConfigSection('notebook', { base_url: base_url });
      config.loaded.then(function(){ 
      // config may be specified at system level or at document level.
      // first, update defaults with config loaded from server
      cfg = $.extend(true, cfg, config.data.toc2);
      // then update cfg with any found in current notebook metadata
      // and save in nb metadata (then can be modified per document)
      cfg = IPython.notebook.metadata.toc = $.extend(true, cfg,
          IPython.notebook.metadata.toc);

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
  

  var load_ipython_extension = function () {
    load_css(); //console.log("Loading css")
    toc_button(); //console.log("Adding toc_button")
    
    // read configuration, then call toc
    cfg = read_config(cfg, 
      function(){table_of_contents(cfg,st);} // called after config is stable
      );     
    
    // render toc for each markdown cell modification
    $([IPython.events]).on("rendered.MarkdownCell", 
      function(){
        table_of_contents(cfg,st);
      });
        console.log("toc2 initialized")

    // add a save as HTML with toc included    
    addSaveAsWithToc(); 

    // render toc on load 
    $([IPython.events]).on("notebook_loaded.Notebook", function(){
        table_of_contents(cfg,st); 
        console.log("toc2 initialized (via notebook_loaded)")
})

    // render toc if kernel_ready and add/remove a menu
    $([IPython.events]).on("kernel_ready.Kernel", function(){
      console.log("kernel_ready.Kernel")
      table_of_contents(cfg,st); 
      console.log("toc2 initialized (via kernel_ready)")
      // If kernel has been restarted, or changed, check if save_html_with_toc has to be included or removed
      var IPythonKernel=(IPython.notebook.kernel.name == "python2" || IPython.notebook.kernel.name == "python3")
        if (!IPythonKernel) {
            $('#save_html_with_toc').remove()
        }
        else{
          if ($('#save_html_with_toc').length==0) addSaveAsWithToc();
        }
    });

  };

  return {
    load_ipython_extension : load_ipython_extension,
    toggle_toc : toggle_toc,
    table_of_contents : table_of_contents
  };

});
