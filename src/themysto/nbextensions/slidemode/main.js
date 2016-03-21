define(['require',
        'base/js/namespace',
        'notebook/js/toolbar',
        'base/js/keyboard'],
  function(
    require,
    IPython,
    ToolBarmod,
    keyboard
  ){
  "use strict";
  
  var ToolBar = ToolBarmod.ToolBar;

  function loadCss(url) {
      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = url;
      document.getElementsByTagName("head")[0].appendChild(link);
  }

  var cssUrl = require.toUrl("./main.css");


  var tminus  = 340;
  var deltat  = 140;
  var tplus   = tminus+deltat;

  var left, right;

  try {
      left =  keyboard.keycodes.left;
      right = keyboard.keycodes.right;
  } catch (e){
      left =  keyboard.keycodes.LEFT_ARROW;
      right = keyboard.keycodes.RIGHT_ARROW;
  }

  var bind_remote = function(selector){
      var invisible_input = $('<input/>')
              .fadeTo(0.2,0)
              .keydown(
                  function(event) {
                      if(event.which == left){
                          IPython.slideshow.prev();
                      } else if(event.which == right){
                          IPython.slideshow.next();
                      }
                      event.preventDefault();
                      return false;
                  }
              )
              .focusin(function(){$('#qwerty').text('Slide Mode Enabled');})
              .focusout(function(){$('#qwerty').text('Enable Slide Mode');});

       var keyboard_control_button = $('<button/>')
              .attr('id','qwerty')
              .addClass('btn')
              .text('slide control')
              .attr('style','float:right')
              .click(
                  function(){ invisible_input.focus();}
              )
              .keydown(
                  function(event){
                      event.preventDefault();
                      return false;
                  }
              );

      $(selector)
          .append(invisible_input)
          .append(keyboard_control_button)
          .fadeTo('slow',0.3)
      .hover(
              function(){$(selector).fadeTo('slow',1);},
              function(){$(selector).fadeTo('slow',0.3);}
      );
  };

  /**
   * not use yet
   */
  var show_line = function(cell,line_number){
      cell.code_mirror.showLine(cell.code_mirror.getLineHandle(line_number-1));
  };


      /**
       * @constructor
       */
      var Presentation = function(){
            this.ccell = 0;
      };

      var is_cell_of_type = function(cell,type){
          if (cell === undefined){
              return false;
          }
          var def = { "slideshow": {} };
          var m = cell.metadata.slideshow ? cell.metadata.slideshow:{};
          return ( m.slide_type == type);
      };

      var _typer = function(type){
          return function(cell){return is_cell_of_type(cell,type);};
      };

      var is_undefined = _typer(undefined);
      var is_fragment = _typer('fragment');
      var is_slide = _typer('slide');
      var is_skip = _typer('skip');
      var is_subslide = _typer('subslide');
      var is_notes = _typer('notes');

      // backward compat
      var is_marked_cell = is_slide;

      Presentation.prototype.create_toolbar = function(){
          var that = this;

          this.progression = $('<button/>').addClass('btn').text(that.eta());
          var grp = $('<div/>').addClass('btn-group');

          var pt = $('<div/>').attr('id','toolbar_present').addClass('container');

          grp.append(this.progression);
          pt.append(grp);

          $('.toolbar-inner').append(pt);
          var ptoolbar = new ToolBar('#toolbar_present');


          ptoolbar.add_buttons_group([{label:'Pause', icon:'fa fa-pause', callback:function(){that.pause()}}])
          ptoolbar.add_buttons_group([{label:'Stop' , icon:'fa fa-stop' , callback:function(){that.stop() }}])

          ptoolbar.add_buttons_group([
                   {label:'Prev Slide', icon:'fa fa-backward', callback:function(){that.prev_group()}},
                   {label:'Next Slide', icon:'fa fa-forward', callback:function(){that.next_group()}},
                                  ])
          ptoolbar.add_buttons_group([
                   {label:'Next', icon:'fa fa-play', callback:function(){that.next()}}
                   ])

          bind_remote('#toolbar_present')

          IPython.ptoolbar = ptoolbar
      }

      Presentation.prototype.remove_toolbar = function(){
          $('#toolbar_present').remove()
      }

      // return the total number of slide
      Presentation.prototype.ngroups = function(){
          var cells = IPython.notebook.get_cells()
          var cnt =0
          for( var i=0; i< cells.length;i++)
                if(is_marked_cell(cells[i])) cnt++
          return cnt
      }

      // return the number of the current slide
      Presentation.prototype.cgroups = function(){
          var cells = IPython.notebook.get_cells()
          var cnt =0
          for( var i=0; i<= this.ccell ;i++)
              if(is_marked_cell(cells[i])) cnt++
          return cnt
      }

      // estimated time of arival
      Presentation.prototype.eta = function(){
          return this.cgroups()+'/'+this.ngroups()
      }

      // number of next marked cell, (artefact, deprecated)
      Presentation.prototype.next_marked_cell_n = function() {
          for(var i=this.ccell+1; i< $('.cell').length; i++) {
              if(is_marked_cell(IPython.notebook.get_cell(i)))
              { return i }
          }
          return null
      }

      // number of prev marked cell, (artefact, deprecated)
      Presentation.prototype.prev_marked_cell_n = function() {
          for(var i=this.ccell-1; i> 0; i--) {
              if(is_marked_cell(IPython.notebook.get_cell(i))){
                  return i
              }
          }
          return 0;
      }

      Presentation.prototype.start = function(){
          this.restart()
          this.resume()
      }

      Presentation.prototype.restart = function(){
          this.ccell = 0;
          delete this.progression
      }

      Presentation.prototype.resume = function(){
          this.create_toolbar()
          $('body').addClass('presentation_mode')
          $('#menubar').addClass('pmode')
          $('#pager_splitter').addClass('pmode')
          $('#pager').addClass('pmode')
          $('#menubar, #pager_splitter, #pager, #header,#maintoolbar-container').addClass('pmode')
          $('#header').addClass('pmode')
          $('#maintoolbar-container').addClass('pmode')
          $('#header-container').css('display','none')
          $('.cell').fadeOut(tminus)
          if(this.current_is_marked()){
              $('.cell:nth('+this.ccell+')').fadeIn()
          } else {
              for( var i=this.prev_marked_cell_n() ; i<= this.ccell; i++){
                  $('.cell:nth('+i+')').fadeIn()
              }
          }
          var that=this
          if(this.progression != undefined){
              this.progression.text(that.eta())
          }
          return this
      }

      Presentation.prototype.stop = function(){
          this.restart()
          this.pause()
      }

      Presentation.prototype.pause = function(){
          $('.cell').fadeIn();
          $('.pmode').removeClass('pmode')
          $('body').removeClass('presentation_mode')
          $('div#header-container').css('display','')
          $('div#notebook').removeClass('pmode')
          this.remove_toolbar()
      }

      Presentation.prototype.next = function(){
          var current_cell_number = this.ccell
          var number_next_cell = this.ccell+1
          this.ccell = this.ccell+1

          var that = this
          if(this.ccell >= $('.cell').length ){
              this.restart()
              this.pause()
              return
          }
          var next_cell = IPython.notebook.get_cell(number_next_cell)
          var look_ahead_cell = IPython.notebook.get_cell(number_next_cell+1)

          if(is_marked_cell(next_cell) || is_subslide(next_cell)){
              $('.cell').fadeOut(tminus)
              setTimeout(function(){$('.cell:nth('+number_next_cell+')').fadeIn(tminus)},tplus)
          } else {
              if( !is_skip(next_cell) && !is_notes(next_cell) ){
                  setTimeout(function(){$('.cell:nth('+number_next_cell+')').fadeIn(tminus)},tplus)
              }
          }
          $(this.progression).button('option','label',that.eta())

          if(is_undefined(look_ahead_cell) || is_skip(look_ahead_cell) || is_notes(look_ahead_cell)){
              this.next()
          }
      }

      Presentation.prototype.next_group = function(){
          this.ccell = this.next_marked_cell_n()
          var that = this
          $('.cell').fadeOut(tminus)
          setTimeout(function(){
              $('.cell:nth('+that.ccell+')').fadeIn(tminus)
          },tplus)
          $(this.progression).button('option','label',that.eta())
      }

      Presentation.prototype.prev_group = function(){
          this.ccell = this.prev_marked_cell_n()
          var that = this
          $('.cell').fadeOut(tminus)
          setTimeout(function(){$('.cell:nth('+that.ccell+')').fadeIn(tminus)},tplus)
          $(this.progression).button('option','label',that.eta())
      }

      Presentation.prototype.is_n_marked = function(n){
          return is_marked_cell(IPython.notebook.get_cell(n))
      }

      Presentation.prototype.current_is_marked = function(n){
          return is_marked_cell(IPython.notebook.get_cell(this.ccell))
      }

      Presentation.prototype.prev = function(){
          if(is_marked_cell(IPython.notebook.get_cell(this.ccell)) || is_subslide(IPython.notebook.get_cell(this.ccell))){
              var pmcell = this.prev_marked_cell_n()
              $('.cell').fadeOut(tminus)
              for( var i=pmcell; i< this.ccell ; i++ ){
                    (function(val){
                        return function(){
                                    setTimeout( function(){
                                        $('.cell:nth('+val+')').fadeIn(tminus)
                                        },tplus)
                        }
                     })(i)()
                }
            } else {
                $('.cell:nth('+this.ccell+')').fadeOut(tminus)
            }
            this.ccell = this.ccell -1
            return this
        }

        IPython.Presentation = Presentation


  //$('body').append($('<style/>').text('.pmode{ display: none !important }'))
  //
  IPython.slideshow = new IPython.Presentation()
  var init = function(){
    IPython.toolbar.add_buttons_group([
        {
            'label'   : 'Start/Resume Slideshow',
            'icon'    : 'fa fa-bar-chart-o',
            'callback': function(){IPython.slideshow.resume()},
            'id'      : 'start_pmode'
        },
    ])
    loadCss(cssUrl);
    console.log('Live slideshow extension correctly loaded')
  };

return {init:init} ;

});
