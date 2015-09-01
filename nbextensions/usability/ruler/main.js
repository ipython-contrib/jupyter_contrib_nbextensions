// Add rulers to a codecell
//

define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'services/config',
    'base/js/utils',    
    'codemirror/lib/codemirror',
    'codemirror/addon/display/rulers'
], function(IPython, $, require, events, configmod, utils, codemirror) {
    "use strict";

    var RULERCOLUMN = 78;
    var base_url = utils.get_body_data("baseUrl")
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});
    var rulers = [];

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    config.loaded.then(function() {
        if (config.data.hasOwnProperty('ruler_column') ){
            if (isNumber(config.data.ruler_column)) RULERCOLUMN = config.data.ruler_column;
        }
        console.log("RULER:", RULERCOLUMN)
        rulers.push({color: "#f00", column: RULERCOLUMN, lineStyle: "dashed"});
        var cells = IPython.notebook.get_cells();
        for(var i in cells){
            var cell = cells[i];
            if ((cell instanceof IPython.CodeCell)) {
                cell.code_mirror.setOption('rulers', rulers);
            }
        }
        events.on('create.Cell',createCell);
    });

    var createCell = function (event,nbcell) {
        var cell = nbcell.cell;
        if ((cell instanceof IPython.CodeCell)) {
            cell.code_mirror.setOption('rulers', rulers);

        }
    };

    var load_ipython_extension = function() {
        config.load();
    };

    var extension = {
        load_ipython_extension : load_ipython_extension
    };
    return extension;
});
