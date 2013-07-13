
//  Copyright (C) 2013  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Hotkey extension - add some additional hotkeys
// All cells:
// PGUP           - scroll one page up
// PGDOWN         - scroll one page down
// CTRL+HOME      - jump to first cell
// CTRL+END       - jump to last cell
//============================================================================

(function (IPython) {

    var key   = IPython.utils.keycodes;

    /**
     * Additional hotkeys for notebook
     *
     * @return {Boolean} return false to stop further key handling in notebook.js 
     */
    var document_keydown = function(event) {

    if (event.which == key.PGUP ) {
        var wh = 0.8 * $(window).height();
        var cell = IPython.notebook.get_selected_cell();
        var h = 0;
        /* loop until we have enough cells to span the size of the notebook window (= one page) */
        do {
            h += cell.element.height();
            IPython.notebook.select_prev();
            cell = IPython.notebook.get_selected_cell();
        } while ( h < wh )
        /* make sure we see the selected cell at the top */
        if  (IPython.notebook.get_selected_index() == 0) {
            IPython.notebook.scroll_to_top()
            }
        return false;
    }; 

    if (event.which == key.PGDOWN) {  
        var wh = 0.8*$(window).height();
        var cell = IPython.notebook.get_selected_cell();
        var h = 0;
		
        /* loop until we have enough cells to span the size of the notebook window (= one page) */
        do {
            h += cell.element.height();
            IPython.notebook.select_next();
            cell = IPython.notebook.get_selected_cell();
        } while ( h < wh )
        /* make sure we see the selected cell at the bottom */
        if  (IPython.notebook.get_selected_index() == IPython.notebook.ncells()-1 ) {
            IPython.notebook.scroll_to_bottom();
            }
        /* make characters in codecell line completely visible */
        else if ((cell instanceof IPython.CodeCell)) {
			var pos = IPython.notebook.element.scrollTop();
			pos += cell.code_mirror.defaultTextHeight();
			IPython.notebook.element.animate({scrollTop:pos}, 0);			
            }
        return false;
    }; 
           
        if (event.which == key.END && event.ctrlKey) {
            var ncells = IPython.notebook.ncells();
            IPython.notebook.select(ncells-1);
            IPython.notebook.scroll_to_bottom()
            return false;
        };

        if (event.which == key.HOME && event.ctrlKey) {
            IPython.notebook.select(0);
            IPython.notebook.scroll_to_top()
            return false;
        };
        
       return true;
    };

    /**
     * Register onKeyEvent to codemirror for all cells
     * and global keydown event
     *
     */            
    init_keyevent = function(){
        $(document).keydown( document_keydown );
    };

    $([IPython.events]).on('notebook_loaded.Notebook',init_keyevent);
    console.log("Hotkey extension loaded correctly")
}(IPython));
