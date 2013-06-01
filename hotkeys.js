
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
// Codecells:
// CTRL+ENTER     - execute all following codecells
// SHIFT-TAB      - remove TAB indent
//============================================================================

var key   = IPython.utils.keycodes;

/**
 * Intercept codemirror onKeyEvent in codecell
 * If hotkey is found, return without calling original keyevent function
 *
 * @return {Boolean} returns false if hotkey is found, otherwise call original function
 */
var intercept_codemirror_keyevent = function (editor, event) {

    if (event.type == 'keydown' && event.which == key.TAB && event.shiftKey) {
        var obj = editor.getCursor("start");
        editor.indentLine(obj.line,"substract");
        return false;
    };

    if (event.type == 'keydown' && event.which == key.ENTER && event.ctrlKey) {
        IPython.notebook.execute_cells_below();
        return false;
    };
    
    return this.handle_codemirror_keyevent(editor,event);
}

/**
 * Additional hotkeys for notebook
 *
 * @return {Boolean} return false to stop further key handling in notebook.js 
 */
var document_keydown = function(event) {

    if (event.which == key.PGUP ) {
        var wh = $(window).height();
        var cell = IPython.notebook.get_selected_cell();
        var h = cell.element.height();
        /* loop until we have enough cells to span the size of the notebook window (= one page) */
        while ( h < wh && cell != undefined) {
            IPython.notebook.select_prev();
            cell = IPython.notebook.get_selected_cell();
            h += cell.element.height();
            }
        /* make sure we see the selected cell at the top */
        if  (IPython.notebook.get_selected_index() == 0) {
            IPython.notebook.scroll_to_top()
            }
        return false;
    }; 

    if (event.which == key.PGDOWN) {  
        var wh = $(window).height();
        var cell = IPython.notebook.get_selected_cell();
        var h = cell.element.height();
		
        /* loop until we have enough cells to span the size of the notebook window (= one page) */
        while ( h < wh && cell != undefined) {
            IPython.notebook.select_next();
            cell = IPython.notebook.get_selected_cell();
            h += cell.element.height();
            }
//            console.log(cell);
            /* make sure we see the selected cell at the bottom */
        if  (IPython.notebook.get_selected_index() == IPython.notebook.ncells()-1 ) {
            IPython.notebook.scroll_to_bottom();
            }
        else if ((cell instanceof IPython.CodeCell)) {
			var pos = IPython.notebook.element.scrollTop();
			console.log("scroll:",pos);
			pos += cell.code_mirror.defaultTextHeight();
			console.log("scroll+:",pos);
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
    var cells = IPython.notebook.get_cells();
    for(var i in cells){
        var cell = cells[i];
        if ((cell instanceof IPython.CodeCell)) {
            cell.code_mirror.setOption('onKeyEvent',$.proxy(intercept_codemirror_keyevent,cell));
        }
    }   
    $(document).keydown( document_keydown );
};

/**
 * Register onKeyEvent to codemirror when a new cell is created
 *
 * @param {Object} event
 * @param {Object} current notebook cell
 */
insert_cell = function (event,cell) {
    if ((cell instanceof IPython.CodeCell)) {
        cell.code_mirror.setOption('onKeyEvent',$.proxy(intercept_codemirror_keyevent,cell));        
   };  
};

$([IPython.events]).on('insert_cell.Notebook',insert_cell);

$([IPython.events]).on('notebook_loaded.Notebook',init_keyevent);

console.log("Hotkey extension loaded correctly")
