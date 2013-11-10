//  Copyright (C) 2013  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

IPython.hotkeys["Alt-F"] = "Fold/unfold code";
IPython.extensions["sodefolding"] = "Allow codefolding in code cells";

var codefolding_extension = (function() {

    var foldingKey = { "Alt-F" : function(cm){cm.foldCode(cm.getCursor());} };

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
            c.metadata.code_folding = lines;
        }
    }
           
    /**
     * Activate codefolding in CodeMirror options, don't overwrite other settings
     *
     */
    function cellFolding(cell) {
        if (CodeMirror.fold != undefined) { 
            var keys = cell.code_mirror.getOption('extraKeys');
            cell.code_mirror.setOption('extraKeys', collect(keys, foldingKey ));  
//            cell.code_mirror.setOption('foldGutter',{rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.indent, CodeMirror.fold.firstline) });
            cell.code_mirror.setOption('foldGutter',{rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.firstline, CodeMirror.fold.indent) });
            cell.code_mirror.setOption('gutters', ["CodeMirror-foldgutter"]);
            cell.code_mirror.on('fold',update_metadata);
            cell.code_mirror.on('unfold',update_metadata);

        }
    }

    save_notebook = function(event) {
        var cells = IPython.notebook.get_cells();
        for(var i in cells){
            var cell = cells[i];
            if ( cell.metadata.code_folding != undefined) {
                var list = cell.code_mirror.getAllMarks();
                var lines = [];
                for (var i = 0; i < list.length; i++) {
                    var range = list[i].find();
                    lines.push(range.from.line);
                }
                cell.metadata.code_folding = lines;
            }
        }
    }
    
    /**
     * Add codefolding to new cell
     *
     */
    create_cell = function (event,nbcell,nbindex) {
        var cell = nbcell.cell;
        if ((cell instanceof IPython.CodeCell)) {
            cellFolding(cell)            
        }
    };
    $([IPython.events]).on('create.Cell',create_cell);
    
    /**
    * Add codefolding to existing cells
     *
     */
    var cells = IPython.notebook.get_cells();
    for(var i in cells){
        var cell = cells[i];
        if ((cell instanceof IPython.CodeCell)) {
            cellFolding(cell);
            /* restore folding state if previously saved */
            if ( cell.metadata.code_folding != undefined) {
                for (var idx in cell.metadata.code_folding) {
                    var line = cell.metadata.code_folding[idx];
                    cell.code_mirror.foldCode(CodeMirror.Pos(line, 0));
                }            
            }
        }
    }

    $([IPython.events]).on('create.Cell',create_cell);
    console.log("Codefolding extension loaded correctly");
})();

