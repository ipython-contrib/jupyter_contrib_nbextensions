//  Copyright (C) 2013  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// assign dedent to shift-tab 

IPython.hotkeys["Shift-Tab"] = "reduce tab indent";

var shift_tab_extension = (function() {

    var dedentKey = { "Shift-Tab":"indentLess" };
    var key   = IPython.utils.keycodes;

    /**
     * Intercept codemirror onKeyEvent in codecell
     *
     * @return {Boolean} returns false if hotkey is found, otherwise call original function
     */
    var intercept_codemirror_keyevent = function (cm, event) {

        /* Dummy for shift+Tab, who knows why */
        if (event.type == 'keydown' && event.which == key.TAB && event.shiftKey) {            
            return false;
        };
        return this.handle_codemirror_keyevent(cm,event);
    }

    function assign_key(cell) {
        var keys = cell.code_mirror.getOption('extraKeys');
        cell.code_mirror.setOption('onKeyEvent',$.proxy(intercept_codemirror_keyevent,cell));
        cell.code_mirror.setOption('extraKeys', collect(keys, dedentKey ));  
    }
    
    /**
     * Initialize newly created cell
     *
     * @param {Object} event
     * @param {Object} nbcell notebook cell
     */
    create_cell = function (event,nbcell,nbindex) {
        var cell = nbcell.cell;
        if ((cell instanceof IPython.CodeCell)) { assign_key(cell); }
    };

    /**
     * Initialize all cells
     *
     */
    var cells = IPython.notebook.get_cells();
    for(var i in cells){
        var cell = cells[i];
        if ((cell instanceof IPython.CodeCell)) { assign_key(cell); }
    };

    $([IPython.events]).on('create.Cell',create_cell);
})();
