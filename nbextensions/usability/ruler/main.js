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

    var ruler_column = [78];
    var ruler_color = ["#ff0000"];
    var ruler_linestyle = ["dashed"];

    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});
    var rulers = [];

    var isNumber = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    config.loaded.then(function() {
        if (config.data.hasOwnProperty('ruler_color') && config.data.ruler_color.length>0) {
            ruler_color = config.data.ruler_color;
        }
        console.log("ruler_color:", ruler_color);

        if (config.data.hasOwnProperty('ruler_column')) {
            var new_columns = []
            for(var i in config.data.ruler_column) {
                if (isNumber(config.data.ruler_column[i])) {
                    new_columns.push(config.data.ruler_column[i]);
                }
            }
            if (new_columns.length>0) {
                ruler_column = new_columns
            }
        }
        console.log("ruler_column:", ruler_column);

        if (config.data.hasOwnProperty('ruler_linestyle') && config.data.ruler_linestyle.length>0) {
            ruler_linestyle = config.data.ruler_linestyle;
        }
        console.log("ruler_linestyle:", ruler_linestyle);

        for(var i in ruler_column) {
            rulers.push({
                color: ruler_color[i % ruler_color.length],
                column: ruler_column[i],
                lineStyle: ruler_linestyle[i % ruler_linestyle.length]
            });
        }

        var cells = IPython.notebook.get_cells();
        for(var i in cells) {
            var cell = cells[i];
            if ((cell instanceof IPython.CodeCell)) {
                cell.code_mirror.setOption('rulers', rulers);
            }
        }
        events.on('create.Cell', createCell);
    });

    var createCell = function (event, nbcell) {
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
