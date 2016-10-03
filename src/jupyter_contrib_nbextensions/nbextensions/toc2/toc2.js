//---------------------------------------------------------------------

//......... utilitary functions............

var liveNotebook = !(typeof IPython == "undefined")

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
    // add a data attribute so that other code (e.g. collapsible_headings) can use it
    a.attr('data-toc-modified-id', h.attr('id'));
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
  
  // extra download as html with toc menu (needs IPython kernel)
  function addSaveAsWithToc() {
     var saveAsWithToc = $('#save_html_with_toc').length == 0
     var IPythonKernel = (IPython.notebook.kernel.name == "python2" || IPython.notebook.kernel.name == "python3")
     if (IPythonKernel) {
         $('#save_checkpoint').after("<li id='save_html_with_toc'/>")
         $('#save_html_with_toc').append($('<a/>').text('Save as HTML (with toc)').attr("href", "#"))
         $('#save_html_with_toc').click(function() {
             var IPythonKernel = (IPython.notebook.kernel.name == "python2" || IPython.notebook.kernel.name == "python3")
             if (IPythonKernel) {
                 var code = "!jupyter nbconvert '" + IPython.notebook.notebook_name + "' --template toc2"
                 console.log(code)
                 IPython.notebook.kernel.execute(code)
             } else {
                 alert("Sorry; this only works with a IPython kernel");
                 $('#save_html_with_toc').remove();
             }
         })
     }
  }


  var create_navigate_menu = function(callback) {
      $('#kernel_menu').parent().after('<li id="Navigate"/>')
      $('#Navigate').addClass('dropdown').append($('<a/>').attr('href', '#').attr('id', 'Navigate_sub'))
      $('#Navigate_sub').text('Navigate').addClass('dropdown-toggle').attr('data-toggle', 'dropdown')
      $('#Navigate').append($('<ul/>').attr('id', 'Navigate_menu').addClass('dropdown-menu')
          .append($("<div/>").attr("id", "navigate_menu").addClass('toc')))

      if (IPython.notebook.metadata.toc['nav_menu']) {
          $('#Navigate_menu').css(IPython.notebook.metadata.toc['nav_menu'])
          $('#navigate_menu').css('width', $('#Navigate_menu').css('width'))
          $('#navigate_menu').css('height', $('#Navigate_menu').height())
      } else {
          IPython.notebook.metadata.toc.nav_menu = {};
           $([IPython.events]).on("before_save.Notebook", 
            function(){
               if(IPython.notebook.metadata.toc.nav_menu){
                  IPython.notebook.metadata.toc.nav_menu['width'] = $('#Navigate_menu').css('width')
                  IPython.notebook.metadata.toc.nav_menu['height'] = $('#Navigate_menu').css('height')
               }
            })
      }

      $('#Navigate_menu').resizable({
          resize: function(event, ui) {
              $('#navigate_menu').css('width', $('#Navigate_menu').css('width'))
              $('#navigate_menu').css('height', $('#Navigate_menu').height())
          },
          stop: function(event, ui) {
              IPython.notebook.metadata.toc.nav_menu['width'] = $('#Navigate_menu').css('width')
              IPython.notebook.metadata.toc.nav_menu['height'] = $('#Navigate_menu').css('height')
          }
      })

      callback && callback();
  }



  var create_toc_div = function (cfg,st) {
    var toc_wrapper = $('<div id="toc-wrapper"/>')
    .append(
      $('<div id="toc-header"/>')
      .addClass("header")
      .text("Contents ")
      .append(
        $("<a/>")
        .attr("href", "#")
        .addClass("hide-btn")
        .attr('title', 'Hide ToC')
        .text("[-]")
        .click( function(){
            $('#toc').slideToggle({'complete': function(){ if(liveNotebook){
            IPython.notebook.metadata.toc['toc_section_display']=$('#toc').css('display');
            IPython.notebook.set_dirty();}}
              });
            $('#toc-wrapper').toggleClass('closed');
            if ($('#toc-wrapper').hasClass('closed')){
              st.oldTocHeight = $('#toc-wrapper').css('height'); 
              $('#toc-wrapper').css({height: 40});
              $('#toc-wrapper .hide-btn')
              .text('[+]')
              .attr('title', 'Show ToC');
            } else {
             // $('#toc-wrapper').css({height: IPython.notebook.metadata.toc.toc_position['height']});
             // $('#toc').css({height: IPython.notebook.metadata.toc.toc_position['height']});
              $('#toc-wrapper').css({height: st.oldTocHeight});
              $('#toc').css({height: st.oldTocHeight});
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
          table_of_contents(cfg,st);
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
          cfg.number_sections=!(cfg.number_sections); 
          if(liveNotebook){
            IPython.notebook.metadata.toc['number_sections']=cfg.number_sections;
        
            IPython.notebook.set_dirty();}
          //$('.toc-item-num').toggle();  
          cfg.number_sections ? $('.toc-item-num').show() : $('.toc-item-num').hide()
          //table_of_contents();
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
          cfg.toc_cell=!(cfg.toc_cell); 
          if(liveNotebook){
            IPython.notebook.metadata.toc['toc_cell']=cfg.toc_cell;
            IPython.notebook.set_dirty();}
          table_of_contents(cfg,st);
          return false;
        })
      )
    ).append(
        $("<div/>").attr("id", "toc").addClass('toc')
    )

    $("body").append(toc_wrapper);

    
    // enable dragging and save position on stop moving
    $('#toc-wrapper').draggable({

          drag: function( event, ui ) {
          
        // If dragging to the left side, then transforms in sidebar
        if ((ui.position.left<=0) && (cfg.sideBar==false)){
          cfg.sideBar = true;
          st.oldTocHeight = $('#toc-wrapper').css('height');
          if(liveNotebook){
            IPython.notebook.metadata.toc['sideBar']=true;
            IPython.notebook.set_dirty();}
          //$('#toc-wrapper').css('height','');
          toc_wrapper.removeClass('float-wrapper').addClass('sidebar-wrapper');
          $('#notebook-container').css('margin-left',$('#toc-wrapper').width()+30);
          $('#notebook-container').css('width',$('#notebook').width()-$('#toc-wrapper').width()-30);
          ui.position.top = liveNotebook ? $('#header').height() : 0;          
          ui.position.left = 0;
          if(liveNotebook){
            $('#toc-wrapper').css('height',$('#site').height());}
          else{  
          $('#toc-wrapper').css('height','96%');}
          $('#toc').css('height', $('#toc-wrapper').height()-$('#toc-header').height());         
        }
        if (ui.position.left<=0) {      
          ui.position.left = 0;
          ui.position.top = liveNotebook ? $('#header').height() : 0;          
        }
        if ((ui.position.left>0) && (cfg.sideBar==true)) {
          cfg.sideBar = false;
          if(liveNotebook){
            IPython.notebook.metadata.toc['sideBar']=false;
            IPython.notebook.set_dirty(); } 
          if (st.oldTocHeight==undefined) st.oldTocHeight=Math.max($('#site').height()/2,200)
          $('#toc-wrapper').css('height',st.oldTocHeight);        
          toc_wrapper.removeClass('sidebar-wrapper').addClass('float-wrapper');
          $('#notebook-container').css('margin-left',30);
          $('#notebook-container').css('width',$('#notebook').width()-30);   
          $('#toc').css('height', $('#toc-wrapper').height()-$('#toc-header').height()); //redraw at begin of of drag (after resizing height)
                     
        }
      }, //end of drag function
          start : function(event, ui) {
              $(this).width($(this).width());
          },
          stop :  function (event,ui){ // on save, store toc position
        if(liveNotebook){
          IPython.notebook.metadata.toc['toc_position']={
          'left':$('#toc-wrapper').css('left'), 
          'top':$('#toc-wrapper').css('top'),
          'width':$('#toc-wrapper').css('width'),  
          'height':$('#toc-wrapper').css('height'), 
            'right':$('#toc-wrapper').css('right')};
            IPython.notebook.set_dirty();}
          // Ensure position is fixed (again)
          $('#toc-wrapper').css('position', 'fixed');
          },
    }); 

    $('#toc-wrapper').resizable({
        resize : function(event,ui){
          if (cfg.sideBar){
             $('#notebook-container').css('margin-left',$('#toc-wrapper').width()+30)
             $('#notebook-container').css('width',$('#notebook').width()-$('#toc-wrapper').width()-30)
          }
          else {
            $('#toc').css('height', $('#toc-wrapper').height()-$('#toc-header').height());         
          }
        },
          start : function(event, ui) {
                  $(this).width($(this).width());
                  //$(this).css('position', 'fixed');
              },
          stop :  function (event,ui){ // on save, store toc position
                if(liveNotebook){
                  IPython.notebook.metadata.toc['toc_position']={
                  'left':$('#toc-wrapper').css('left'), 
                  'top':$('#toc-wrapper').css('top'),
                  'height':$('#toc-wrapper').css('height'), 
                  'width':$('#toc-wrapper').css('width'),  
                  'right':$('#toc-wrapper').css('right')};
                  $('#toc').css('height', $('#toc-wrapper').height()-$('#toc-header').height())
                  IPython.notebook.set_dirty();
              }
                // Ensure position is fixed (again)
                //$(this).css('position', 'fixed');
            }
        })  


    // restore toc position at load
    if(liveNotebook){
    if (IPython.notebook.metadata.toc['toc_position'] !== undefined){
          $('#toc-wrapper').css(IPython.notebook.metadata.toc['toc_position']); 
          }         
        }
    // Ensure position is fixed
        $('#toc-wrapper').css('position', 'fixed');

    // Restore toc display 
    if(liveNotebook){
      if (IPython.notebook.metadata.toc !== undefined) {
        if (IPython.notebook.metadata.toc['toc_section_display']!==undefined)  {  
            $('#toc').css('display',IPython.notebook.metadata.toc['toc_section_display'])
            $('#toc').css('height', $('#toc-wrapper').height()-$('#toc-header').height())
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
    }
    
    // if toc-wrapper is undefined (first run(?), then hide it)
    if ($('#toc-wrapper').css('display')==undefined) $('#toc-wrapper').css('display',"none") //block
  //};

    $('#site').bind('siteHeight', function() {
    if (cfg.sideBar) $('#toc-wrapper').css('height',$('#site').height());})

    $('#site').trigger('siteHeight');

    // Initial style
    ///sideBar = cfg['sideBar']
    if (cfg.sideBar) {
        $('#toc-wrapper').addClass('sidebar-wrapper');
        if (!liveNotebook) {
            $('#toc-wrapper').css('width', '202px');
            $('#notebook-container').css('margin-left', '212px');
            $('#toc-wrapper').css('height', '96%');
            $('#toc').css('height', $('#toc-wrapper').height() - $('#toc-header').height())
        } else {
            if (cfg.toc_window_display) {
              setTimeout(function() {
                $('#notebook-container').css('width', $('#notebook').width() - $('#toc-wrapper').width() - 30);
                $('#notebook-container').css('margin-left', $('#toc-wrapper').width() + 30);
                 }, 500)
            }
            setTimeout(function() {
                $('#toc-wrapper').css('height', $('#site').height());
                $('#toc').css('height', $('#toc-wrapper').height() - $('#toc-header').height())
            }, 500)
        }
        setTimeout(function() { $('#toc-wrapper').css('top', liveNotebook ? $('#header').height() : 0); }, 500) //wait a bit
        $('#toc-wrapper').css('left', 0);

    }

    else {
      toc_wrapper.addClass('float-wrapper');   
    }
}

//------------------------------------------------------------------
   // TOC CELL -- if cfg.toc_cell=true, add and update a toc cell in the notebook. 
   //             This cell, initially at the very beginning, can be moved.
   //             Its contents are automatically updated.
   //             Optionnaly, the sections in the toc can be numbered.

 
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

    function process_cell_toc(cfg,st){ 
        // look for a possible toc cell
         var cells = IPython.notebook.get_cells();
         var lcells=cells.length;
         for (var i = 0; i < lcells; i++) {
            if (cells[i].metadata.toc=="true") {
                  st.cell_toc=cells[i]; 
                  st.toc_index=i; 
                  //console.log("Found a cell_toc",i); 
                  break;} 
                  }
        //if toc_cell=true, we want a cell_toc. 
        //  If it does not exist, create it at the beginning of the notebook
        //if toc_cell=false, we do not want a cell-toc. 
        //  If one exists, delete it
        if(cfg.toc_cell) {
               if (st.cell_toc == undefined) {
                    st.rendering_toc_cell = true;
                    //console.log("*********  Toc undefined - Inserting toc_cell");
                    st.cell_toc = IPython.notebook.select(0).insert_cell_above("markdown"); 
                    st.cell_toc.metadata.toc="true";
               }
        }
        else{
           if (st.cell_toc !== undefined) IPython.notebook.delete_cell(st.toc_index);
           st.rendering_toc_cell=false; 
         }
    } //end function process_cell_toc --------------------------

// Table of Contents =================================================================
var table_of_contents = function (cfg,st) {

    if(st.rendering_toc_cell) { // if toc_cell is rendering, do not call  table_of_contents,                             
        st.rendering_toc_cell=false;  // otherwise it will loop
        return}
  

    var toc_wrapper = $("#toc-wrapper");
   // var toc_index=0;
    if (toc_wrapper.length === 0) {
      create_toc_div(cfg,st);
    }
    var segments = [];
    var ul = $("<ul/>").addClass("toc-item").attr('id','toc-level0');
   
     // update toc element
     $("#toc").empty().append(ul);


    st.cell_toc = undefined;
   // if cfg.toc_cell=true, add and update a toc cell in the notebook. 

    if(liveNotebook){
      ///look_for_cell_toc(process_cell_toc);        
      process_cell_toc(cfg,st);
    }
    //process_cell_toc();
    
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
      if (level > cfg.threshold){ return; }
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
        h.id=$(h).attr("saveid")+'-'+num_str.replace(/\./g,'');  
        // change the id to be "unique" and toc links to it 
        // (and replace '.' with '' in num_str since it poses some pb with jquery)
        var saveid = $(h).attr('saveid')
        //escape special chars: http://stackoverflow.com/questions/3115150/
        var saveid_search=saveid.replace(/[-[\]{}():\/!;&@=$£%§<>%"'*+?.,~\\^$|#\s]/g, "\\$&"); 
        if ($(h).find("a[name="+saveid_search+"]").length==0){  //add an anchor with original id (if it doesnt't already exists)
             $(h).prepend($("<a/>").attr("name",saveid)); }

  
      // Create toc entry, append <li> tag to the current <ol>. Prepend numbered-labels to headings.
      li=$("<li/>").append( make_link( $(h), num_lbl));

      ul.append(li);
      $(h).prepend(num_lbl);
      

      //toc_cell:
      if(cfg.toc_cell) {
          var leves = '<div class="lev' + level.toString() + ' toc-item">';
          var lnk=make_link_originalid($(h))
          cell_toc_text += leves + $('<p>').append(lnk).html()+'</div>';
          //workaround for https://github.com/jupyter/notebook/issues/699 as suggested by @jhamrick
          lnk.on('click',function(){setTimeout(function(){$.ajax()}, 100) }) 
      }
    });

 

     // update navigation menu
     if (cfg.navigate_menu) {
         var pop_nav = function() { //callback for create_nav_menu
             //$('#Navigate_menu').empty().append($("<div/>").attr("id", "navigate_menu").addClass('toc').append(ul.clone().attr('id', 'navigate_menu-level0')))
             $('#navigate_menu').empty().append($('#toc-level0').clone().attr('id', 'navigate_menu-level0'))
         }
         if ($('#Navigate_menu').length == 0) {
             create_navigate_menu(pop_nav);
         } else {
             pop_nav()                 
         }
     } else { // If navigate_menu is false but the menu already exists, then remove it
         if ($('#Navigate_menu').length > 0) $('#Navigate_sub').remove()
     }
    


    if(cfg.toc_cell) {
         st.rendering_toc_cell = true;
         //IPython.notebook.to_markdown(toc_index);
         st.cell_toc.set_text(cell_toc_text); 
         st.cell_toc.render();
    };

    // Show section numbers if enabled
    cfg.number_sections ? $('.toc-item-num').show() : $('.toc-item-num').hide()

    $(window).resize(function(){
        $('#toc').css({maxHeight: $(window).height() - 30});
        $('#toc-wrapper').css({maxHeight: $(window).height() - 10});

        if (cfg.sideBar==true) {
          if ($('#toc-wrapper').css('display')!='block'){
          $('#notebook-container').css('margin-left',30);
          $('#notebook-container').css('width',$('#notebook').width()-30);  
          }  
          else{
          $('#notebook-container').css('margin-left',$('#toc-wrapper').width()+30);
          $('#notebook-container').css('width',$('#notebook').width()-$('#toc-wrapper').width()-30);
          $('#toc-wrapper').css('height',liveNotebook ? $('#site').height(): $(window).height() - 10);
          $('#toc-wrapper').css('top', liveNotebook ? $('#header').height() : 0);  
          }
        } else{
          $('#notebook-container').css('margin-left',30);
          $('#notebook-container').css('width',$('#notebook').width()-30); 
        }  
    });

    $(window).trigger('resize');

};
    
  var toggle_toc = function (cfg,st) {
    // toggle draw (first because of first-click behavior)
    //$("#toc-wrapper").toggle({'complete':function(){
    $("#toc-wrapper").toggle({
      'progress':function(){  
        if (cfg.sideBar==true) {
          if ($('#toc-wrapper').css('display')!='block'){
          $('#notebook-container').css('margin-left',st.nbcontainer_marginleft);
          $('#notebook-container').css('width',st.nbcontainer_width);  
          }  
          else{
          $('#notebook-container').css('margin-left',$('#toc-wrapper').width()+30)
          $('#notebook-container').css('width',$('#notebook').width()-$('#toc-wrapper').width()-30)  
          }
        }        
      },
    'complete': function(){ 
      if(liveNotebook){
        IPython.notebook.metadata.toc['toc_window_display']=$('#toc-wrapper').css('display')=='block';
        IPython.notebook.set_dirty();
      }
      // recompute:
      st.rendering_toc_cell = false;
      table_of_contents(cfg,st);
      }
    });
  
  };

//var out=$.ajax({url:"/nbextensions/toc2/toc2.js", async:false})
//eval(out.responseText)
