//  Copyright (C) 2013  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

var codefolding_extension = (function() {

    function toggleFolding(cm) {
        var pos = cm.getCursor();
        var opts = cm.state.foldGutter.options;
        cm.foldCode(pos, opts.rangeFinder);
    }

    var foldingKey = { "Alt-F" : toggleFolding };

    /**
     * Update cell metadata whith folding info, so folding state can be restored after reloading notebook
     *
     */
    update_metadata = function() {
        var c=IPython.notebook.get_selected_cell();
        var cm = c.code_mirror;
        var list = cm.getAllMarks();

        var lines = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].__isFold == true) {
                var range = list[i].find();
                lines.push(range.from.line);
            }
        }
        c.metadata.code_folding = lines;
    }
           
    /**
     * Activate codefolding in CodeMirror options, don't overwrite other settings
     *
     */
    function cellFolding(cell) {
        if (CodeMirror.fold != undefined) { 
            var keys = cell.code_mirror.getOption('extraKeys');
            cell.code_mirror.setOption('extraKeys', collect(keys, foldingKey ));  
            cell.code_mirror.setOption('foldGutter',{rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.firstline, CodeMirror.fold.indent) });
            cell.code_mirror.setOption('gutters', ["CodeMirror-foldgutter"]);
            cell.code_mirror.on('fold',update_metadata);
            cell.code_mirror.on('unfold',update_metadata);

        }
    }
    
    /**
     * Add codefolding to new cell
     *
     */
    createCell = function (event,nbcell,nbindex) {
        var cell = nbcell.cell;
        if ((cell instanceof IPython.CodeCell)) {
            cellFolding(cell)            
        }
    };
    
    /**
    * Add codefolding to existing cells
     *
     */
    initExtension = function(event) {
        var cells = IPython.notebook.get_cells();
        for(var i in cells){
            var cell = cells[i];
            if ((cell instanceof IPython.CodeCell)) {
                cellFolding(cell);
                /* restore folding state if previously saved */
                if ( cell.metadata.code_folding != undefined) {
                    for (var idx in cell.metadata.code_folding) {
                        var line = cell.metadata.code_folding[idx];
                        var opts = cell.code_mirror.state.foldGutter.options; 
                        cell.code_mirror.foldCode(CodeMirror.Pos(line, 0), opts.rangeFinder);
                    }            
                }
            }
        }
        $([IPython.events]).on('create.Cell',createCell);
    }
    
    /* load codemirror addon */
    $("head").append($("<link rel='stylesheet' href='/static/custom/codefolding/foldgutter.css' type='text/css'  />"));
    require(['/static/components/codemirror/addon/fold/foldcode.js', 
             '/static/components/codemirror/addon/fold/foldgutter.js',
             '/static/components/codemirror/addon/fold/indent-fold.js',
             '/static/custom/codefolding/firstline-fold.js'], initExtension)
})();


