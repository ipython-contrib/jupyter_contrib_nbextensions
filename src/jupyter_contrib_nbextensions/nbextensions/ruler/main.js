// Add rulers to codecells
define([
    'base/js/namespace',
    'base/js/events',
    'notebook/js/codecell',
    'codemirror/lib/codemirror',
    'codemirror/addon/display/rulers'
], function(Jupyter, events, codecell, codemirror) {
    "use strict";

    var log_prefix = '[ruler]';

    var ruler_column = [78];
    var ruler_color = ["#ff0000"];
    var ruler_linestyle = ["dashed"];
    var ruler_do_css_patch;

    var rulers = [];

    var isNumber = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    function update_options () {
        var i, config = Jupyter.notebook.config;

        if (config.data.hasOwnProperty('ruler_color') && config.data.ruler_color.length>0) {
            ruler_color = config.data.ruler_color;
        }

        if (config.data.hasOwnProperty('ruler_column')) {
            var new_columns = [];
            for (i in config.data.ruler_column) {
                if (isNumber(config.data.ruler_column[i])) {
                    new_columns.push(config.data.ruler_column[i]);
                }
            }
            if (new_columns.length>0) {
                ruler_column = new_columns;
            }
        }

        if (config.data.hasOwnProperty('ruler_linestyle') && config.data.ruler_linestyle.length>0) {
            ruler_linestyle = config.data.ruler_linestyle;
        }

        for (i in ruler_column) {
            rulers.push({
                color: ruler_color[i % ruler_color.length],
                column: ruler_column[i],
                lineStyle: ruler_linestyle[i % ruler_linestyle.length]
            });
        }
        console.debug(log_prefix, 'ruler specs:', rulers);

        ruler_do_css_patch = config.data.ruler_do_css_patch; // undefined is ok
    }

    var load_ipython_extension = function() {
        Jupyter.notebook.config.loaded
        .then(update_options, function on_error (reason) {
            console.warn(log_prefix, 'error loading config:', reason);
        })
        .then(function () {
            // Add css patch fix for notebook > 4.2.3 - see
            //     https://github.com/jupyter/notebook/issues/2869
            // for details
            if (ruler_do_css_patch !== false) {
                var sheet = document.createElement('style');
                sheet.innerHTML = [
                    '.CodeMirror-lines {',
                    '  padding: 0.4em 0; /* Vertical padding around content */',
                    '}',
                    '.CodeMirror pre {',
                    '  padding: 0 0.4em; /* Horizonal padding around content */',
                    '}',
                ].join('\n');
                document.head.appendChild(sheet);
            }

            // Change default for new cells
            codecell.CodeCell.options_default.cm_config.rulers = rulers;
            // Apply to any already-existing cells
            var cells = Jupyter.notebook.get_cells().forEach(function (cell) {
                if (cell instanceof codecell.CodeCell) {
                    cell.code_mirror.setOption('rulers', rulers);
                }
            });
        })
        .catch(function on_error (reason) {
            console.warn(log_prefix, 'error:', reason);
        });
    };

    var extension = {
        load_ipython_extension : load_ipython_extension
    };
    return extension;
});
