//  Copyright (C) 2013  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// add code folding to codecell

$.getScript('/static/components/codemirror/addon/fold/foldcode.js')
$.getScript('/static/components/codemirror/addon/fold/indent-fold.js')


(function (IPython) {

    var foldingKey = { "Alt-F" : function(cm){foldPython(cm, cm.getCursor());} };
    
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

    function foldPython(cm, where) { cm.foldCode(where, CodeMirror.indentRangeFinderA);}

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
            cell.code_mirror.setOption('extraKeys', collect(keys, foldingKey ));  
        }
    };

    $([IPython.events]).on('insert_cell.Notebook',insert_cell);
    console.log("Codefolding extension loaded correctly");
}(IPython));

