// Adapted from https://gist.github.com/magican/5574556
// by minrk https://github.com/minrk/ipython_extensions
// See the history of contributions in README.md


define(["require", "jquery", "base/js/namespace",  'services/config',
    'base/js/utils'], function (require, $, IPython, configmod, utils) {

  "use strict";

// ...........Parameters configuration......................
 // define default values for config parameters if they were not present in general settings (notebook.json)
    var cfg={'toc_threshold':6, 
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
    } else {
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

  function incr_lbl(ary, h_idx){//increment heading label  w/ h_idx (zero based)
      ary[h_idx]++;
      for(var j= h_idx+1; j < ary.length; j++){ ary[j]= 0; }
      return ary.slice(0, h_idx+1);
  }



  var make_link = function (h, num_lbl) {
    var a = $("<a/>");
    a.attr("href", '#' + h.attr('id'));
    // get the text *excluding* the link text, whatever it may be
    var hclone = h.clone();
    if( num_lbl ){ hclone.prepend(num_lbl); }
    hclone.children().last().remove(); // remove the last child (that is the automatic anchor)
    hclone.find("a[name]").remove();   //remove all named anchors
    a.html(hclone.html());
    a.on('click',function(){setTimeout(function(){ $.ajax()}, 100) }) //workaround for  https://github.com/jupyter/notebook/issues/699
                                                                                        //as suggested by @jhamrick
    //console.log("h",h.children)
    return a;
  };


  var make_link_originalid = function (h, num_lbl) {
    var a = $("<a/>");
    a.attr("href", '#' + h.attr('saveid'));
    // get the text *excluding* the link text, whatever it may be
    var hclone = h.clone();
    if( num_lbl ){ hclone.prepend(num_lbl); }
    hclone.children().last().remove(); // remove the last child (that is the automatic anchor)
    hclone.find("a[name]").remove();   //remove all named anchors
    a.html(hclone.html());
    a.on('click',function(){setTimeout(function(){ $.ajax()}, 100) }) //workaround for  https://github.com/jupyter/notebook/issues/699
    return a;
}

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
              $('#toc-wrapper').css({height: 40});
              $('#toc-wrapper .hide-btn')
              .text('[+]')
              .attr('title', 'Show ToC');
            } else {
              $('#toc-wrapper').css({height: IPython.notebook.metadata.toc_position['height']});
              $('#toc').css({height: IPython.notebook.metadata.toc_position['height']});
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
        var oldHeight = IPython.notebook.metadata['toc_position']['height'];
		IPython.notebook.metadata['toc_position']={
		'left':$('#toc-wrapper').css('left'), 
		'top':$('#toc-wrapper').css('top'),
        'width':$('#toc-wrapper').css('width'),  
		'right':$('#toc-wrapper').css('right')};
        if (!$('#toc-wrapper').hasClass('closed')){
            IPython.notebook.metadata['toc_position']['height']=$('#toc-wrapper').css('height');
        }
        else {
            IPython.notebook.metadata['toc_position']['height']=oldHeight;
        }
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
        'height':$('#toc-wrapper').css('height'), 
		'right':$('#toc-wrapper').css('right')};
        $('#toc').css('height', $('#toc-wrapper').height()-30)
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
        if (IPython.notebook.metadata.toc['toc_section_display']!==undefined)  {  
            $('#toc').css('display',IPython.notebook.metadata.toc['toc_section_display'])
            $('#toc').css('height', $('#toc-wrapper').height()-30)
            if (IPython.notebook.metadata.toc['toc_section_display']=='none'){
              $('#toc-wrapper').addClass('closed');
              $('#toc-wrapper').css({height: 40});
              $('#toc-wrapper .hide-btn')
              .text('[+]')
              .attr('title', 'Show ToC');         
            }
        }
        if (IPython.notebook.metadata.toc['toc_window_display']!==undefined)    { 
            console.log("******Restoring toc display"); 
            $('#toc-wrapper').css('display',IPython.notebook.metadata.toc['toc_window_display'] ? 'block' : 'none');
            //$('#toc').css('overflow','auto')
        }
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

    var toc_wrapper = $("#toc-wrapper");
    var toc_index=0;
    if (toc_wrapper.length === 0) {
      create_toc_div();
    }
    var segments = [];
    var ul = $("<ul/>").addClass("toc-item");
    $("#toc").empty().append(ul);

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
        //  If it does not exist, create it at the beginning of the notebook
        //if toc_cell=false, we do not want a cell-toc. 
        //  If one exists, delete it
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
    var depth = 1; //var depth = ol_depth(ol);
    var li= ul;//yes, initialize li with ul! 
    var all_headers= $("#notebook").find(":header");
    var min_lvl=1, lbl_ary= [];
    for(; min_lvl <= 6; min_lvl++){ if(all_headers.is('h'+min_lvl)){break;} }
    for(var i= min_lvl; i <= 6; i++){ lbl_ary[i - min_lvl]= 0; }

    //loop over all headers
    all_headers.each(function (i, h) {
      var level = parseInt(h.tagName.slice(1), 10) - min_lvl + 1;
      // skip below threshold
      if (level > threshold){ return; }
      // skip headings with no ID to link to
      if (!h.id){ return; }
      // skip toc cell if present
      if (h.id=="Table-of-Contents"){ return; }
      //If h had already a number, remove it
      $(h).find(".toc-item-num").remove();
      var num_str= incr_lbl(lbl_ary,level-1).join('.');// numbered heading labels
      var num_lbl= $("<span/>").addClass("toc-item-num")
            .text(num_str).append('&nbsp;').append('&nbsp;');

      // walk down levels
      for(var elm=li; depth < level; depth++) {
          var new_ul = $("<ul/>").addClass("toc-item");
          elm.append(new_ul);
          elm= ul= new_ul;
      }
      // walk up levels
      for(; depth > level; depth--) {
          // up twice: the enclosing <ol> and <li> it was inserted in
          ul= ul.parent();
          while(!ul.is('ul')){ ul= ul.parent(); }
      }
      // Change link id -- append current num_str so as to get a kind of unique anchor 
      // A drawback of this approach is that anchors are subject to change and thus external links can fail if toc changes
      // Anyway, one can always add a <a name="myanchor"></a> in the heading and refer to that anchor, eg [link](#myanchor) 
      // This anchor is automatically removed when building toc links. The original id is also preserved and an anchor is created 
      // using it. 
      // Finally a heading line can be linked to by [link](#initialID), or [link](#initialID-num_str) or [link](#myanchor)
        if (!$(h).attr("saveid")) {$(h).attr("saveid", h.id)} //save original id
        h.id=$(h).attr("saveid")+'-'+num_str;  // change the id to be "unique" and toc links to it
        var saveid = $(h).attr('saveid')
        //escape special chars: http://stackoverflow.com/questions/3115150/
        var saveid_search=saveid.replace(/[-[\]{}():\/!;&@=$£%§<>%"'*+?.,~\\^$|#\s]/g, "\\$&"); 
        if ($(h).find("a[name="+saveid_search+"]").length==0){  //add an anchor with original id (if it doesnt't already exists)
             $(h).prepend($("<a/>").attr("name",saveid)); }

  
      // Create toc entry, append <li> tag to the current <ol>. Prepend numbered-labels to headings.
      li=$("<li/>").append( make_link( $(h), num_lbl));
      ul.append(li);
      if( number_sections ){ $(h).prepend(num_lbl); }

      //toc_cell:
      if(toc_cell) {
          var tabs = function(level) {
                var tabs = '';
                for (var j = 0; j < level -1; j++) { 
                  tabs += "\t";}
                  return tabs}

          var leves='<div class="lev'+level.toString()+'">'
          var lnk=make_link_originalid($(h))
          cell_toc_text += leves + $('<p>').append(lnk).html()+'</div>';
          //workaround for https://github.com/jupyter/notebook/issues/699 as suggested by @jhamrick
          lnk.on('click',function(){setTimeout(function(){console.log('clicked'); $.ajax()}, 100) }) 
      }
    });

    if(toc_cell) {
         rendering_toc_cell = true;
         //IPython.notebook.to_markdown(toc_index);
         cell_toc.set_text(cell_toc_text); 
         cell_toc.render();
    };

    $(window).resize(function(){
        $('#toc').css({maxHeight: $(window).height() - 100});
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
        extension_initialized=true  ; // flag to indicate that initialization was done
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
