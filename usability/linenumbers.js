// toggle showing line numbers for all codecells
"use strict";

var linenumbers_extension = (function() {
    var numbersKey = { "Alt-N": function(cm){toggleLineNumbers(cm);} };

    function toggleLineNumbers(cm) { 
        var cells = IPython.notebook.get_cells();
        for(var i in cells){
            var cell = cells[i];
            if ((cell instanceof IPython.CodeCell)) {
                var activate = !cell.code_mirror.getOption('lineNumbers');
                var gutters = cell.code_mirror.getOption('gutters');
                console.log("Gutters", gutters);
                var found = jQuery.inArray("CodeMirror-linenumbers", gutters);
                if (activate == true && found == -1) {
                    gutters.unshift("CodeMirror-linenumbers");
                } 
                if (activate ==false && found > -1) {
                    gutters.shift("CodeMirror-linenumbers");
                }
                cell.code_mirror.setOption('gutters', gutters);
                cell.code_mirror.setOption('lineNumbers', activate);
            }
        }
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
     * Register new extraKeys to codemirror for newly created cell
     *
     * @param {Object} event
     * @param {Object} nbcell notebook cell
     */
    createCell = function (event,nbcell,nbindex) {
        var cell = nbcell.cell;
        registerKey(cell, numbersKey)
    };

    /**
     * Initialize extension by registering hotkey at all codecells
     *
     */
    var cells = IPython.notebook.get_cells();
    for(var i in cells){
        registerKey(cells[i], numbersKey)
    }
    $([IPython.events]).on('create.Cell',createCell);
})();
