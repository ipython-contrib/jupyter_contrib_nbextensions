// Select cells with a rubberband-selection using the mouse
// shift + mouse drag -> select only cells currently touched by rubberband
// ctrl+shift + mouse drag -> select all cells that were touched by rubberband

define([
    'base/js/namespace',
    'jquery',
    'base/js/events',
    'base/js/keyboard',
], function(IPython, $, events, keyboard) {
    "use strict";

    var keycodes = keyboard.keycodes;

    var startX, startY;
    var offsetY
    var isDragging = false;
    var isRubberBandEnabled = false;
    var isAddSelection = false;
    var isScrolling = false

    /*
     * Capture shift key - shift+mouse button will start rubberband selection
     *
     */
    $(document).keydown(function(event){
        if(event.keyCode === keycodes.shift){
            isRubberBandEnabled = true
        }
        if(event.keyCode === keycodes.ctrl){
            isAddSelection = true
        }
    })
    
    $(document).keyup(function(event){
        if(event.keyCode === keycodes.shift){
            isRubberBandEnabled = false
        }
        if(event.keyCode === keycodes.ctrl){
            isAddSelection = false
        }
    })

    /*
     * Start rubberband selection action
     *
     */
    $(document).mousedown(function(event){
        offsetY = $('#notebook').offset().top
        if(isRubberBandEnabled){
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
        } else {
            if (event.pageY-offsetY > 0) {
                /* clear selection */
                var ncells = IPython.notebook.ncells()
                var cells = IPython.notebook.get_cells()  
                for(var i=0; i < ncells; i++){
                    delete cells[i].metadata.selected
                    cells[i].element.removeClass('multiselect')
            }
        }
    }

    });

    /*
     * Rubberband dragging operation - select cells touched by rubberband
     *
     */
    $(document).mousemove(function(event){
        var _h = $('#notebook').height()
        if(isDragging === true){
            var left, top, width, height;
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
            
            var ncells = IPython.notebook.ncells()
            var cells = IPython.notebook.get_cells();
            
            
            if (event.pageY-offsetY > _h-50 && isScrolling === false) {
                var speed = event.pageY-offsetY -( _h-50)
                var n=$('#notebook')
                var scrollpos = n.scrollTop() + 50  
                var time = 20 //2*(50-speed)    
                isScrolling = true
                n.animate({scrollTop:scrollpos}, time,"linear", function() { isScrolling = false })
            }

            if ((event.pageY-offsetY) < 50 && isScrolling === false) {
                var speed = event.pageY-offsetY
                var n=$('#notebook')
                var scrollpos = n.scrollTop() - 50  
                var time = 20 //2*(50-speed)  
                isScrolling = true                
                n.animate({scrollTop:scrollpos}, time,"linear", function() { isScrolling = false })
            }

            
            for (var i=0; i<ncells; i++) { 
                var _cell = cells[i]
                if (isCellWithin(_cell,left,top,width,height) === true) {
                    _cell.element.addClass('multiselect')
                    _cell.metadata.selected = true
                } else {
                    if (isAddSelection === false) {
                        _cell.element.removeClass('multiselect')
                        delete _cell.metadata.selected
                    }
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
        if (cellpos.top === 0)
            return false    // not visible
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
        document.getElementsByTagName("head")[0].appendChild(link);
      };

    load_css('/nbextensions/usability/rubberband/main.css');
    var rubberband_div = $('<div id="dragmask" class="highlight-drag"></div>')
    $("#header").append(rubberband_div)


    /**
     * Make sure new cells are never selected
     *
     * @method createCell
     * @param event
     * @param nbcell
     *
     */
    var createCell = function (event,nbcell) {
        var cell = nbcell.cell;
        delete cell.metadata.selected
    };
    events.on('create.Cell',createCell);
    
    /**
     * Clear existing selection at startup
     *
     */
    var ncells = IPython.notebook.ncells()
    var cells = IPython.notebook.get_cells()
    
    for(var i=0; i < ncells; i++){
        delete cells[i].metadata.selected
    }
})
