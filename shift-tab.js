//  Copyright (C) 2013  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// assign dedent to shift-tab 

(function (IPython) {

    var dedentKey = { "Shift-Tab":"indentLess" };
    var key   = IPython.utils.keycodes;
    
    /* http://stackoverflow.com/questions/2454295/javascript-concatenate-properties-from-multiple-objects-associative-array */
    function collect() {
        var ret = {};
        var len = arguments.length;
        for (var i=0; i<len; i++) {
            for (p in arguments[i]) {
                if (arguments[i].hasOwnProperty(p)) {
                    ret[p] = arguments[i][p];
                }
            }
        }
        return ret;
    }

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

    /**
     * Register new extraKeys to codemirror for newly created cell
     *
     * @param {Object} event
     * @param {Object} nbcell notebook cell
     */
    insert_cell = function (event,nbcell) {
        var cell = nbcell.cell;
        if (cell.cell_type == "code") {
            var keys = cell.code_mirror.getOption('extraKeys');
            cell.code_mirror.setOption('onKeyEvent',$.proxy(intercept_codemirror_keyevent,cell));
            cell.code_mirror.setOption('extraKeys', collect(keys, dedentKey ));  
        }
    };

    $([IPython.events]).on('insert_cell.Notebook',insert_cell);
    console.log("Shift+TAB dedent extension loaded correctly");
}(IPython));

