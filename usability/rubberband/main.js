// Select cells with a rubberband-selection using the mouse

define([
    'base/js/namespace',
    'jquery',
    "base/js/events",
], function(IPython, $, events) {
    "use strict";

    var startX, startY;
    var tmp_cell
    var offsetY
    var isDragging = false;
    var isRubberBandEnabled = false;
    
    /*
     * Capture shift key - shift+mouse button will start rubberband selection
     *
     */
    $(document).keydown(function(event){
        if(event.keyCode==16){
            // enable the highlighter
            isRubberBandEnabled = true
        }
    })
    
    $(document).keyup(function(event){
        if(event.keyCode==16){
            // disable the highlighter
            isRubberBandEnabled = false
        }
    })

    /*
     * Start rubberband selection action
     *
     */
    $(document).mousedown(function(event){
        if(isRubberBandEnabled){
            offsetY = $('#notebook').offset().top
            console.log(offsetY)
            tmp_cell = IPython.notebook.get_selected_index()
            startX = event.pageX;
            startY = event.pageY;
            isDragging = true;
            $("#dragmask").css(
                {
                    'left'   :    startX,
                    'top'    :    startY,
                    'width'  :    0,
                    'height' :    0
                }
     
            ).show();
            // prevent default behaviour of text selection
            return false;
        }
    });

    /*
     * Rubberband dragging operation - select cells touched by rubberband
     *
     */
    $(document).mousemove(function(event){
        if(isDragging){
     
            var left, top, width, height;
            //console.log(event)
            if(event.pageX>startX){
                left = startX;
                width = event.pageX - startX;
            }
            else {
                left = event.pageX;
                width = startX - event.pageX;
            }
            if(event.pageY>startY){
                top = startY;
                height = event.pageY - startY;
            }
            else {
                top = event.pageY;
                height = startY - event.pageY;
            }
/*            if (event.pageY > 500) {
                if (tmp_cell < IPython.notebook.ncells()) {
                    tmp_cell += 1            
                    IPython.notebook.scroll_to_cell(tmp_cell,200)
                }
            }

            if (event.pageY < 100) {
                //console.log("t,h:",top,height)
                if (tmp_cell > 0) {
                    tmp_cell -= 1            
                    IPython.notebook.scroll_to_cell(tmp_cell,200)
                }
            }*/
            
            //console.log("drag", left,top,width,height)
            var ncells = IPython.notebook.ncells()
            var cells = IPython.notebook.get_cells();
            for (var i=0; i<ncells; i++) { 
                var _cell = cells[i]
                if (isCellWithin(_cell,left,top,width,height) === true) {
                    _cell.element.css({"background-color": "#f5f5f5"});
                    _cell.metadata.selected = true
                } else {
                    _cell.element.css({"background-color": "#ffffff"});
                    delete _cell.metadata.selected
                }
            }
            $("#dragmask").css(
                {
                    'left'   :    left,
                    'top'    :    top,
                    'width'  :    width,
                    'height' :    height
                }
            )
        }
    })

    /*
     * End rubberband dragging operation
     *
     */
    $(document).mouseup(function(event){
        if(isDragging){
            isDragging = false;
            $("#dragmask").hide();
        }
    })

    /*
     * Test if a cell touched by a certain area
     *
     * @method isCellWithin
     * @param cell
     * @param left
     * @param top
     * @param width
     * @param height
     *
     */
    var isCellWithin = function(cell,left,top,width,height){
        var cellpos = cell.element.position()
        var cellh = cell.element.height()
        var cellw = cell.element.width()
        if ((cellpos.top+cellh) > top-offsetY && cellpos.top < top-offsetY+height 
            && cellpos.left+cellw > left && cellpos.left < left+width) {
            return true
        } else {
            return false
        }
    }

     /**
     * load css file and append to document
     *
     * @method load_css
     * @param name {String} filenaame of CSS file
     *
     */
    var load_css = function (name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        console.log(link);
        document.getElementsByTagName("head")[0].appendChild(link);
      };

    load_css('/nbextensions/testing/exercise/main.css');
    var rubberband_div = $('<div id="dragmask" class="highlight-drag"></div>')
    $("#header").append(rubberband_div)
    
    /**
     * Clear existing selection at startup
     *
     */
    var cells = IPython.notebook.get_cells()
    for(var i in cells){
        var cell = cells[i]
        if (typeof cell.metadata.selected != undefined) {
            delete cell.metadata.selected
        }
    }
})
