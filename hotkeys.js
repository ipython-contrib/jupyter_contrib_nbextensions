
//  Copyright (C) 2013  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Hotkey extension - add some additional hotkeys
// All cells:
// PGUP       - select previous cell
// PGDOWN     - select following cell
// CTRL+HOME  - select first cell
// CTRL+END   - select last cell
// Codecells:
// CTRL+ENTER - execute all following codecells
// SHIFT-TAB  - reduce TAB indent
//============================================================================

var key   = IPython.utils.keycodes;

/**
 * Intercept codemirror onKeyEvent in codecell
 * If hotkey is found, return without calling original keyevent function
 *
 * @return {Boolean} returns true if hotkey is found
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

    if (event.which == key.PGUP) {
        IPython.notebook.select_prev();
        return false;
    }; 
   
    if (event.which == key.PGDOWN) {
        IPython.notebook.select_next();
        return false;
    };
    
    if (event.which == key.END && event.ctrlKey) {
        var ncells = IPython.notebook.ncells();
        IPython.notebook.select(ncells-1);
        return false;
    };

    if (event.which == key.HOME && event.ctrlKey) {
        IPython.notebook.select(0);
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
