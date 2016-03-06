// Select cells with a rubberband-selection using the mouse
// shift + mouse drag -> select only cells currently touched by rubberband
// alt+shift + mouse drag -> select all cells that were touched by rubberband

define([
    'base/js/namespace',
    'jquery',
    'base/js/events',
    'base/js/keyboard',
    'require'
], function(IPython, $, events, keyboard, require) {
    "use strict";

    var scrollRange = 50; /* range on top and bottom where autoscroll starts */
    
    var keycodes = keyboard.keycodes;

    var startX, startY;
    var offsetY;
    var isDragging = false;
    var isRubberBandEnabled = false;
    var isAddSelection = false;
    var isScrolling = false;
    var headerHeight;

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
        var cellpos = cell.element.position();
        var cellh = cell.element.height();
        var cellw = cell.element.width();
        if (cellpos.top === 0)
            return false;   // not visible
        return ((cellpos.top+cellh) > top-offsetY && cellpos.top < top-offsetY+height
            && cellpos.left+cellw > left && cellpos.left < left+width);
    };

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


    /**
     * Clear existing selection
     *
     * @method clearSelection
     *
     */
    var clearSelection = function() {
        var ncells = IPython.notebook.ncells();
        var cells = IPython.notebook.get_cells();
        
        for(var i=0; i < ncells; i++){
            cells[i].unselect();
        }
    };
    


    function load_ipython_extension() {
        /*
         * Capture shift key - shift+mouse button will start rubberband selection
         *
         */
        $(document).keydown(function(event){
            if(event.keyCode === keycodes.shift && IPython.notebook.mode === "command"){
                isRubberBandEnabled = true
            }
            if(event.keyCode === keycodes.alt){
                isAddSelection = true
            }
        });

        $(document).keyup(function(event){
            if(event.keyCode === keycodes.shift){
                isRubberBandEnabled = false
            }
            if(event.keyCode === keycodes.alt){
                isAddSelection = false
            }
        });

        /*
         * Start rubberband selection action
         *
         */
        $(document).mousedown(function(event){
            offsetY = $('#notebook').offset().top;
            headerHeight = $('#header').height();
            if(isRubberBandEnabled) {
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
                    var ncells = IPython.notebook.ncells();
                    var cells = IPython.notebook.get_cells();
                    var selected_idx = IPython.notebook.get_selected_index();
                    for(var i=0; i < ncells; i++){
                        if (i != selected_idx) cells[i].unselect();
                }
            }
        }

        });
        /*
         * Rubberband dragging operation - select cells touched by rubberband
         *
         */
        $(document).mousemove(function(event){
            offsetY = $('#notebook').offset().top;

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

                var ncells = IPython.notebook.ncells();
                var cells = IPython.notebook.get_cells();
                var elheight = IPython.notebook.scroll_manager.element.height();
                var Yfromtop = event.clientY - headerHeight;
                var scrollpos = IPython.notebook.scroll_manager.element.scrollTop();
                var scrolltime = 200;
                if (Yfromtop < scrollRange && isScrolling === false) {
                    isScrolling = true;
                    IPython.notebook.scroll_manager.element.animate({scrollTop:scrollpos - 0.3*elheight}, scrolltime,"linear", function() { isScrolling = false })
                }

                if ( Yfromtop > elheight-scrollRange && isScrolling === false) {
                    isScrolling = true;
                    IPython.notebook.scroll_manager.element.animate({scrollTop: scrollpos + 0.3*elheight}, scrolltime,"linear", function() { isScrolling = false })
                }

					var selected_cells = IPython.notebook.get_selected_cells_indices()
					var first = true;
                for (var i=0; i<ncells; i++) {
                    var _cell = cells[i];
                    if (isCellWithin(_cell,left,top,width,height) === true) {
						if (selected_cells.includes(i) == true) first = false;
						if (first === true) {
							first = false;
							IPython.notebook.select(i);
						} else {
							if (!selected_cells.includes(i)) {
								IPython.notebook.select(i, false);
								};
						};
                    } else {
						if (selected_cells.includes(i)) {
							var index = IPython.notebook.get_selected_index();
							if (isAddSelection === false) {
								var delta = 0;
								if (index > i) delta = 1;
								if (index < i) delta = -1;
								IPython.notebook.select(i+delta, false);
							};
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
        });

        /*
         * End rubberband dragging operation
         *
         */
        $(document).mouseup(function(event){
            if(isDragging){
                isDragging = false;
                $("#dragmask").hide();
            }
        });
        load_css('./main.css');
        var rubberband_div = $('<div id="dragmask" class="highlight-drag"></div>');
        $("#header").append(rubberband_div);
    }

    /* expose functions to other extensions */
    var rubberband = {
        load_ipython_extension : load_ipython_extension,
    };
    return rubberband;
});
