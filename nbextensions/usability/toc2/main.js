// Adapted from https://gist.github.com/magican/5574556
// by minrk https://github.com/minrk/ipython_extensions
// See the history of contributions in README.md


define(["require", "jquery", "base/js/namespace",  'services/config',
    'base/js/utils'], function (require, $, IPython, configmod, utils) {

  "use strict";

// ...........Parameters configuration......................
 // define default values for config parameters if they were not present in general settings (notebook.json)
    var cfg={'toc_threshold':4, 
             'toc_number_sections':true, 
             'toc_cell':false,
             'toc_window_display':false}
    var threshold = cfg['toc_threshold']
    var toc_cell=cfg['toc_cell'];
    var number_sections = cfg['toc_number_sections'];


   function read_config() {  // read after nb is loaded
     // create config object to load parameters
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    // update params with any specified in the server's config file
    var update_params = function() {
        for (var key in cfg) {
            if (config.data.hasOwnProperty(key)){
                cfg[key] = config.data[key];
}
        }
        IPython.notebook.metadata.toc = cfg; //save in present nb metadata (then can be modified per document)
        threshold = cfg['toc_threshold'];
        toc_cell=cfg['toc_cell'];
        number_sections = cfg['toc_number_sections'];
        //$('#toc-wrapper').css('display',cfg['toc-wrapper_display']) //ensure display is done as noted in config
        $('#toc-wrapper').css('display',cfg['toc_window_display'] ? 'block' : 'none') //ensure display is done as noted in config
    };

    // config may be specified at system level or at document level.
    if (IPython.notebook.metadata.toc !== undefined){ //configuration saved in nb
        console.log("config stored in nb")
	cfg = IPython.notebook.metadata.toc;
        threshold = cfg['toc_threshold'];
        toc_cell=cfg['toc_cell'];
        number_sections = cfg['toc_number_sections'];
	}
    else {
        console.log("config stored in system")
	config.load();
        config.loaded.then(function() {update_params() })
    } 
    config_loaded = true;
}
//.....................global variables....

    var rendering_toc_cell = false; 
    var config_loaded = false;
    var extension_initialized=false;

//......... utilitary functions............    

  var make_link = function (h) {
    var a = $("<a/>");
    a.attr("href", '#' + h.attr('id'));
    // get the text *excluding* the link text, whatever it may be
    var hclone = h.clone();
    hclone.children().last().remove(); // remove only the last child 
    a.html(hclone.html());
    a.on('click',function(){setTimeout(function(){ $.ajax()}, 100) }) //workaround for  https://github.com/jupyter/notebook/issues/699
                                                                                        //as suggested by @jhamrick
    return a;
  };

  var ol_depth = function (element) {
    // get depth of nested ol
    var d = 0;
    while (element.prop("tagName").toLowerCase() == 'ol') {
      d += 1;
      element = element.parent();
    }
    return d;
  };
  
  var create_toc_div = function () {
    var toc_wrapper = $('<div id="toc-wrapper"/>')
    .append(
      $("<div/>")
      .addClass("header")
      .text("Contents ")
      .append(
        $("<a/>")
        .attr("href", "#")
        .addClass("hide-btn")
        .attr('title', 'Hide ToC')
        .text("[-]")
        .click( function(){
            $('#toc').slideToggle({'complete': function(){
		    IPython.notebook.metadata.toc['toc_section_display']=$('#toc').css('display');
		    IPython.notebook.set_dirty();}}
		    );
            $('#toc-wrapper').toggleClass('closed');
            if ($('#toc-wrapper').hasClass('closed')){
              $('#toc-wrapper .hide-btn')
              .text('[+]')
              .attr('title', 'Show ToC');
            } else {
              $('#toc-wrapper .hide-btn')
              .text('[-]')
              .attr('title', 'Hide ToC');
            }
            return false;
          })
      ).append(
        $("<a/>")
        .attr("href", "#")
        .addClass("reload-btn")
        .text("  \u21BB")
        .attr('title', 'Reload ToC')
        .click( function(){
          table_of_contents();
          return false;
        })
      ).append(
        $("<span/>")
        .html("&nbsp;&nbsp")
      ).append(
        $("<a/>")
        .attr("href", "#")
        .addClass("number_sections-btn")
        .text("n")
        .attr('title', 'Number text sections')
        .click( function(){
          number_sections=!(number_sections); 
          IPython.notebook.metadata.toc['toc_number_sections']=number_sections;
	  IPython.notebook.set_dirty();
          table_of_contents();
          return false;
        })
      ).append(
        $("<span/>")
        .html("&nbsp;&nbsp;")
        ).append(
        $("<a/>")
        .attr("href", "#")
        .addClass("toc_cell_sections-btn")
        .html("t")
        .attr('title', 'Add a toc section in Notebook')
        .click( function(){
          toc_cell=!(toc_cell); 
	  IPython.notebook.metadata.toc['toc_cell']=toc_cell;
	  IPython.notebook.set_dirty();
          table_of_contents();
          return false;
        })
      )
    ).append(
        $("<div/>").attr("id", "toc")
    )

    $("body").append(toc_wrapper);

    // enable dragging and save position on stop moving
    $('#toc-wrapper').draggable({
          start : function(event, ui) {
              $(this).width($(this).width());
          },
          stop :  function (event,ui){ // on save, store toc position
		IPython.notebook.metadata['toc_position']={
		'left':$('#toc-wrapper').css('left'), 
		'top':$('#toc-wrapper').css('top'),
        'width':$('#toc-wrapper').css('width'),  
		'right':$('#toc-wrapper').css('right')};
		IPython.notebook.set_dirty();
		},
    }); 

    $('#toc-wrapper').resizable({
          start : function(event, ui) {
              $(this).width($(this).width());
          },
          stop :  function (event,ui){ // on save, store toc position
		IPython.notebook.metadata['toc_position']={
		'left':$('#toc-wrapper').css('left'), 
		'top':$('#toc-wrapper').css('top'),
        'width':$('#toc-wrapper').css('width'),  
		'right':$('#toc-wrapper').css('right')};
		IPython.notebook.set_dirty();
		},
    });

    // restore toc position at load
    if (IPython.notebook.metadata['toc_position'] !== undefined){
          $('#toc-wrapper').css(IPython.notebook.metadata['toc_position']);          
}
    // Ensure position is fixed
        $('#toc-wrapper').css('position', 'fixed');

    // Restore toc display 
    if (IPython.notebook.metadata.toc !== undefined) {
        if (IPython.notebook.metadata.toc['toc_section_display']!==undefined)    
            $('#toc').css('display',IPython.notebook.metadata.toc['toc_section_display'])
        if (IPython.notebook.metadata.toc['toc_window_display']!==undefined)    { 
            console.log("Restoring toc display"); 
            $('#toc-wrapper').css('display',IPython.notebook.metadata.toc['toc_window_display'] ? 'block' : 'none')}
    }
    
    // if toc-wrapper is undefined (first run(?), then hide it)
    if ($('#toc-wrapper').css('display')==undefined) $('#toc-wrapper').css('display',"none") //block
  };



//  var table_of_contents = function (threshold) { //small bug because being called on an event, the passed threshold was actually an event
//                                                   now threshold is a global variable 
var table_of_contents = function () {
    if(rendering_toc_cell) { // if toc_cell is rendering, do not call  table_of_contents,                             
        rendering_toc_cell=false;  // otherwise it will loop
        return}
//
    var toc_wrapper = $("#toc-wrapper");
  
//
    var toc_index=0;
    if (toc_wrapper.length === 0) {
      create_toc_div();
    }
    var segments = [];
    var ol = $("<ol/>");
    ol.addClass("toc-item");
    $("#toc").empty().append(ol);

   // TOC CELL -- if toc_cell=true, add and update a toc cell in the notebook. 
   //             This cell, initially at the very beginning, can be moved.
   //             Its contents are automatically updated.
   //             Optionnaly, the sections in the toc can be numbered.
               
   var cell_toc = undefined;

   function look_for_cell_toc(callb){ // look for a possible toc cell
       var cells = IPython.notebook.get_cells();
       var lcells=cells.length;
       for (var i = 0; i < lcells; i++) {
          if (cells[i].metadata.toc=="true") {
                cell_toc=cells[i]; 
                toc_index=i; 
                //console.log("Found a cell_toc",i); 
                break;}	
                }
    callb && callb(i);
    }
    // then process the toc cell:
    function proces_cell_toc(i){ 
	    //if toc_cell=true, we want a cell_toc. 
	    //	If it does not exist, create it at the beginning of the notebook
	    //if toc_cell=false, we do not want a cell-toc. 
	    //	If one exists, delete it
        if(toc_cell) {
               if (cell_toc == undefined) {
                    rendering_toc_cell = true;
                    //console.log("*********  Toc undefined - Inserting toc_cell");
	        	    cell_toc = IPython.notebook.select(0).insert_cell_above("markdown"); 
                    cell_toc.metadata.toc="true";
               }
        }
        else{
           if (cell_toc !== undefined) IPython.notebook.delete_cell(toc_index);
           rendering_toc_cell=false; 
         }
    }
    look_for_cell_toc(proces_cell_toc);
    //proces_cell_toc();
    
    var cell_toc_text = "# Table of Contents\n <p>";
    var depth = 1;
    var li;
    $("#notebook").find(":header").map(function (i, h) {
      var level = parseInt(h.tagName.slice(1), 10);
      // skip below threshold
      if (level > threshold) return;
      // skip headings with no ID to link to
      if (!h.id) return;
      // skip toc cell if present
      if (h.id=="Table-of-Contents") return;
      
      //var depth = ol_depth(ol);

      // walk down levels
      for (; depth < level; depth++) {
        var new_ol = $("<ol/>");
        new_ol.addClass("toc-item");
        li.append(new_ol);
        ol = new_ol;
      }
      // walk up levels
      for (; depth > level; depth--) {
          // up twice: the enclosing <ol> and the <li> it was  inserted in 
          ol = ol.parent().parent();
      }
      //
      $(h).find(".toc-item-num").remove(); //If h had already a number, remove it
      li=$("<li/>").append(make_link($(h)));
      ol.append(li);
      


    // Add numerotation of sections if number_sections==true
    // adapted from from http://stackoverflow.com/questions/5127017/automatic-numbering-of-headings-h1-h6-using-jquery
    if (number_sections){
      if(segments.length == level) {
        // from Hn to another Hn, just increment the last segment
        segments[level-1]++;
      } else if(segments.length > level) {
        // from Hn to Hn-x, slice off the last x segments, and increment the last of the remaining
        segments = segments.slice(0, level);
        segments[level-1]++;
      } else if(segments.length < level) {
        // from Hn to Hn+x, (should always be Hn+1, but some error checks anyway)
        // add '0' (x-1) times, then a 1
        var deltalevel = level-segments.length   
        for(var i = 0; i < (deltalevel-1); i++) {
          segments.push(0);
        }
        segments.push(1);
      }
      var num=$("<span/>").addClass("toc-item-num").text(segments.join(".")+" - ");
      //$(h).find(".toc-item-num").remove(); //If h had already a number, remove it
      $(h).prepend(num);
}
    //---------------------------
//toc_cell:
if(toc_cell) {
    var tabs = function(level) {
          var tabs = '';
          for (var j = 0; j < level -1; j++) { 
		    tabs += "\t";}
            return tabs}

    var leves='<div class="lev'+level.toString()+'">'
    var lnk=make_link($(h))
    cell_toc_text += leves + $('<p>').append(lnk).html()+'</div>';
    lnk.on('click',function(){setTimeout(function(){console.log('clicked'); $.ajax()}, 100) })  //workaround for  https://github.com/jupyter/notebook/issues/699
                                                                                        //as suggested by @jhamrick
    }

    });

    if(toc_cell) {
         rendering_toc_cell = true;
         //IPython.notebook.to_markdown(toc_index);
         cell_toc.set_text(cell_toc_text); 
         cell_toc.render();
};


    $(window).resize(function(){
      $('#toc').css({maxHeight: $(window).height() - 200});
    });

    $(window).trigger('resize');
  };
    
  var toggle_toc = function () {
    // toggle draw (first because of first-click behavior)
    $("#toc-wrapper").toggle({'complete':function(){
		IPython.notebook.metadata.toc['toc_window_display']=$('#toc-wrapper').css('display')=='block';
					} 
		});
     IPython.notebook.set_dirty();
    // recompute:
    rendering_toc_cell = false;
    table_of_contents();
  };
  
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
          'callback': toggle_toc,
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
    load_css(); 
    toc_button(); 
    // render toc on load
    $([IPython.events]).on("notebook_loaded.Notebook", function(){ // curiously, the event is not always fired or detected
                                                       // thus I rely on kernel_ready.Kernel to read the initial config 
                                                       // and render the first  table of contents
            read_config(); 
	    table_of_contents(); 
	    // render toc for each markdown cell modification
	    //$([IPython.events]).on("rendered.MarkdownCell", table_of_contents);
	    $([IPython.events]).on("rendered.MarkdownCell", function(){table_of_contents();});
            console.log("toc2 initialized (via notebook_loaded)")
	    extension_initialized=true	; // flag to indicate that initialization was done
})

    $([IPython.events]).on("kernel_ready.Kernel", function(){
            if (!extension_initialized){
            read_config(); 
	    table_of_contents(); 
	    // render toc for each markdown cell modification
	    $([IPython.events]).on("rendered.MarkdownCell", function(){table_of_contents();});
            console.log("toc2 initialized (via kernel_ready)")
	}
   });

  };


  return {
    load_ipython_extension : load_ipython_extension,
    toggle_toc : toggle_toc,
    table_of_contents : table_of_contents
    
  };

});
