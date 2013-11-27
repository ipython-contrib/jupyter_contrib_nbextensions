//  Copyright (C) 2013  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// add hotkey to comment/uncomment complete lines in codecells
"using strict";

var comment_uncomment_extension = (function() {
    var commentKey = { "Alt-C" : function(cm){toggleComments(cm)} };

    function toggleComments(cm) { 
        var from = cm.getCursor("start"), to = cm.getCursor("end");
        cm.uncomment(from, to) || cm.lineComment(from, to);
    };

    /**
     * Concatenate associative array objects
     *
     * Source: http://stackoverflow.com/questions/2454295/javascript-concatenate-properties-from-multiple-objects-associative-array
     */
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
     * Register extraKeys in codemirror cells
     *
     */
    registerKey = function (cell, keyfunc) {
        if ((cell instanceof IPython.CodeCell)) {
            var keys = cell.code_mirror.getOption('extraKeys');
            cell.code_mirror.setOption('extraKeys', collect(keys, keyfunc ));  
        }
    }
    
    /**
     * Register key for newly created cells
     *
     * @param {Object} event
     * @param {Object} nbcell notebook cell
     */
    createCell = function (event,nbcell,nbindex) {
        var cell = nbcell.cell;
        registerKey(cell, commentKey);
    };

    /**
     * Initialize extension by registering hotkey for all codecells
     *
     */
    initExtension = function () {
        var cells = IPython.notebook.get_cells();
        for(var i in cells){
            registerKey(cells[i], commentKey);
        }
    $([IPython.events]).on('create.Cell',createCell);
    }
    require(['/static/components/codemirror/addon/comment/comment.js'],initExtension); 
})();
