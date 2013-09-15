//  Copyright (C) 2013  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// add line numbers for all codecells

var linenumbers_extension = (function() {
    var numbersKey = { "Alt-N" : function(cm){toggleLineNumbers(cm);} };

    function toggleLineNumbers(cm) { 
        var cells = IPython.notebook.get_cells();
        for(var i in cells){
        var cell = cells[i];
        if ((cell instanceof IPython.CodeCell)) {
            cell.code_mirror.setOption('lineNumbers', !cell.code_mirror.getOption('lineNumbers')); }
        }
    };

    /**
     * Register new extraKeys to codemirror for newly created cell
     *
     * @param {Object} event
     * @param {Object} nbcell notebook cell
     */
    create_cell = function (event,nbcell,nbindex) {
        var cell = nbcell.cell;
        if (cell.cell_type == "code") {
            var keys = cell.code_mirror.getOption('extraKeys');
            cell.code_mirror.setOption('extraKeys', collect(keys, numbersKey ));  
        }
    };

    var cells = IPython.notebook.get_cells();
    for(var i in cells){
        var cell = cells[i];
        if ((cell instanceof IPython.CodeCell)) {
            var keys = cell.code_mirror.getOption('extraKeys');
            cell.code_mirror.setOption('extraKeys', collect(keys, numbersKey ));  
        }
    }
    $([IPython.events]).on('create.Cell',create_cell);
})();


