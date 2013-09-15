//  Copyright (C) 2013  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// add code folding to codecell using hotkey or click on gutter (line number area)
"using strict";

require(['/static/components/codemirror/addon/fold/foldcode.js'])
require(['/static/components/codemirror/addon/fold/indent-fold.js'])

IPython.hotkeys["Alt-F"]   = "Fold/unfold code";
var foldingKey = { "Alt-F" : function(cm){foldPython(cm, cm.getCursor());} };

    /* modified CodeMirror.indentRangeFinder code for now. 
     * Will be replaced in new CodeMirror version
     */
    indentRangeFinderA = function(cm, start) {
        var tabSize = cm.getOption("tabSize"), firstLine = cm.getLine(start.line);
        var myIndent = CodeMirror.countColumn(firstLine, null, tabSize);
        for (var i = start.line + 1, end = cm.lineCount(); i < end; ++i) {
            var curLine = cm.getLine(i);
            if ((CodeMirror.countColumn(curLine, null, tabSize) == myIndent)&&
                (CodeMirror.countColumn(cm.getLine(i-1), null, tabSize) > myIndent)){
                    return {from: {line: start.line, ch: firstLine.length},
                        to: {line: i, ch: curLine.length}};
            }
        }
    };
    
    function foldPython(cm, where) { cm.foldCode(where, indentRangeFinderA)}

    function setMarker() {
        var marker = document.createElement("div");
        marker.style.color = "#822";
        marker.innerHTML = ">";
        return marker;
    }
    
    function toggleMarker(val,cm,from,to) {
        console.log(from);
        /* get current cell and search correct one if user clicked on different cell */
        var cell = IPython.notebook.get_selected_cell();
        if (cell.code_mirror != cm) {
            var cells = IPython.notebook.get_cells();
            for(var i in cells){
                var cell = cells[i];
                if (cell.code_mirror == cm ) { break; }
            }
        }

        cm.setGutterMarker(from.line, "folding", val ?  setMarker(): null);
    }    
    
    function add_folding(cell) {
        var keys = cell.code_mirror.getOption('extraKeys');
        cell.code_mirror.setOption('extraKeys', collect(keys, foldingKey ));  
        cell.code_mirror.on("gutterClick", foldPython);
        cell.code_mirror.on("fold", function(cm,from,to) { toggleMarker(true,cm,from,true);} );
        cell.code_mirror.on("unfold", function(cm,from,to) { toggleMarker(false,cm,from,to);} );
        var gutters = cell.code_mirror.getOption('gutters');
        cell.code_mirror.setOption('gutters', [gutters, "folding"]);
        if (cell.metadata.folding == undefined) {
            cell.metadata.folding = new Array();
        }
    }
    
/**
 * Register new extraKeys to codemirror for newly created cell
 *
 * @param {Object} event
 * @param {Object} nbcell notebook cell
 */
folding_create_cell = function (event,nbcell,nbindex) {
    var cell = nbcell.cell;
    if (cell.cell_type == "code") {
        add_folding(cell);
    }
};

var cells = IPython.notebook.get_cells();
for(var i in cells){
    var cell = cells[i];
    if ((cell instanceof IPython.CodeCell)) {
        add_folding(cell);
    }
};

$([IPython.events]).on('create.Cell',folding_create_cell);
console.log("Codefolding extension loaded correctly");

