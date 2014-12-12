// Allow codefolding in code cells
//
// This extension enables the CodeMirror feature
// It works by adding a gutter area to each code cell. 
// Fold-able code is marked using small triangles in the gutter.
//
// The current folding state is saved in the cell metadata as an array
// of line numbers.
// Format: cell.metadata.code_folding = [ line1, line2, line3, ...]
//

define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'codemirror/lib/codemirror',
    'codemirror/addon/fold/foldgutter',
    'codemirror/addon/fold/foldcode', 
    'codemirror/addon/fold/brace-fold',
    'codemirror/addon/fold/indent-fold',    
], function(IPython, $, require, events, codemirror) {
    "use strict";
    if (IPython.version[0] != 3) {
        console.log("This extension requires IPython 3.x")
        return
    }

    var foldingKey = { "Alt-F" : toggleFolding };
    
    /*
     * Toggle folding on/off at current line
     *
     * @param cm CodeMirror instance
     *
     */
    function toggleFolding(cm) {
        var pos = cm.getCursor();
        var opts = cm.state.foldGutter.options;
        cm.foldCode(pos, opts.rangeFinder);
    }


    /**
     * Concatenate associative array objects
     *
     * Source: http://stackoverflow.com/questions/2454295/javascript-concatenate-properties-from-multiple-objects-associative-array
     */
    function collect() {
        var ret = {};
        var len = arguments.length;
        for (var i=0; i<len; i++) {
            for (var p in arguments[i]) {
                if (arguments[i].hasOwnProperty(p)) {
                    ret[p] = arguments[i][p];
                }
            }
        }
        return ret;
    }

    /**
     * Update cell metadata with folding info, so folding state can be restored after reloading notebook
     *
     * @param cm CodeMirror instance
     */
    function updateMetadata(cm) {
        var list = cm.getAllMarks();
        var lines = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].__isFold == true) {
                var range = list[i].find();
                lines.push(range.from.line);
            }
        }
        /* User can click on gutter of unselected cells, so make sure we store metadata in the correct cell */
        var cell = IPython.notebook.get_selected_cell();
        if (cell.code_mirror != cm) {
            var cells = IPython.notebook.get_cells();
            for(var i in cells){
                var cell = cells[i];
                if (cell.code_mirror == cm ) { break; }
            }
        }
        cell.metadata.code_folding = lines;
    }
               
    /**
     * Activate codefolding in CodeMirror options, don't overwrite other settings
     *
     * @param cell {CodeCell} code cell to activate folding gutter
     */
    function cellFolding(cell) {
        if (CodeMirror.fold != undefined) { 
            var keys = cell.code_mirror.getOption('extraKeys');
            cell.code_mirror.setOption('extraKeys', collect(keys, foldingKey ));  
            var mode = cell.code_mirror.getOption('mode');
            /* use indent folding in Python */
            if (mode.name == 'ipython' ) {
                cell.code_mirror.setOption('foldGutter',{rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.firstline, CodeMirror.fold.indent) });                        
            } else {
                cell.code_mirror.setOption('foldGutter',{rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.firstline, CodeMirror.fold.brace) });            
            }
            var gutters = cell.code_mirror.getOption('gutters');
                var found = jQuery.inArray("CodeMirror-foldgutter", gutters);
                if ( found == -1) {
                    cell.code_mirror.setOption('gutters', [ gutters , "CodeMirror-foldgutter"]);
                }            
            cell.code_mirror.on('fold',updateMetadata);
            cell.code_mirror.on('unfold',updateMetadata);
        }
    }
    
    /**
     * Add codefolding gutter to a new cell
     *
     * @param event
     * @param nbcell
     *
     */
    var createCell = function (event,nbcell) {
        var cell = nbcell.cell;
        if ((cell instanceof IPython.CodeCell)) {
            cellFolding(cell)
        }
    };

    /*
     * Initialize gutter in existing cells
     *
     */
    var initGutter = function() {
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
        events.on('create.Cell',createCell);
    }

    /**
     * Load my own CSS file
     *
     * @param name add CSS file
     *
     */
    var load_css = function (name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name, 'css');
        document.getElementsByTagName("head")[0].appendChild(link);
    };    

    /**
     * Called after extension was loaded
     *
     * @param module id (i.e. path + name)
     */
    var load_extension = function() { 
        load_css('codemirror/addon/fold/foldgutter.css');
        /* change default gutter width */
        load_css( './foldgutter.css');
        /* additional custom codefolding mode */
        require(['./firstline-fold'], initGutter)
        }

    var codefolding = {
        load_ipython_extension : load_extension,
        }
    
    return codefolding
})
