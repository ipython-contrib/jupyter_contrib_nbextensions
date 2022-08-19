// Add rulers to codecells
define([
    'base/js/namespace',
    'base/js/events',
    'services/config',
    'notebook/js/codecell',
    'codemirror/lib/codemirror',
    'codemirror/addon/display/rulers'
], function (Jupyter, events, configmod, codecell, codemirror) {
    "use strict";

    var log_prefix = '[ruler]';

    // define default config parameter values
    var params = {
        ruler_column: [78],
        ruler_color: ["#ff0000"],
        ruler_linestyle: ["dashed"],
        ruler_do_css_patch: false
    };


    var rulers = [];

    var isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    // updates default params with any specified in the provided config data
    var update_params = function (config_data) {
        for (var key in params) {
            if (config_data.hasOwnProperty(key)) {
                params[key] = config_data[key];
            }
        }
    };

    var on_config_loaded = function () {

        if (Jupyter.notebook !== undefined) {
            var i, config = Jupyter.notebook.config;
        } else {
            var i, config = Jupyter.editor.config;
        }

        if (config.data.hasOwnProperty('ruler_color') && config.data.ruler_color.length > 0) {
            params.ruler_color = config.data.ruler_color;
        }

        if (config.data.hasOwnProperty('ruler_column')) {
            var new_columns = [];
            for (i in config.data.ruler_column) {
                if (isNumber(config.data.ruler_column[i])) {
                    new_columns.push(config.data.ruler_column[i]);
                }
            }
            if (new_columns.length > 0) {
                params.ruler_column = new_columns;
            }
        }

        if (config.data.hasOwnProperty('ruler_linestyle') && config.data.ruler_linestyle.length > 0) {
            params.ruler_linestyle = config.data.ruler_linestyle;
        }

        for (i in params.ruler_column) {
            rulers.push({
                color: params.ruler_color[i % params.ruler_color.length],
                column: params.ruler_column[i],
                lineStyle: params.ruler_linestyle[i % params.ruler_linestyle.length]
            });
        }
        console.debug(log_prefix, 'ruler specs:', rulers);

        if (Jupyter.notebook !== undefined) {
            var i, config = Jupyter.notebook.config;

            // Change default for new cells
            codecell.CodeCell.options_default.cm_config.rulers = rulers;
            // Apply to any already-existing cells
            var cells = Jupyter.notebook.get_cells().forEach(function (cell) {
                if (cell instanceof codecell.CodeCell) {
                    cell.code_mirror.setOption('rulers', rulers);
                }
            });

        }
        else {
            Jupyter.editor.codemirror.setOption('rulers', rulers);
        }
    };

    var load_extension = function () {

        // first, check which view we're in, in order to decide whether to load
        var conf_sect;
        if (Jupyter.notebook) {
            // we're in notebook view
            conf_sect = Jupyter.notebook.config;
        }
        else if (Jupyter.editor) {
            // we're in file-editor view
            conf_sect = Jupyter.editor.config;
        }
        else {
            // we're some other view like dashboard, terminal, etc, so bail now
            return;
        }

        conf_sect.loaded
            .then(function () {
                update_params(conf_sect.data);
            })
            .then(on_config_loaded)
            .catch(function on_error(reason) {
                console.warn(log_prefix, 'error:', reason);
            });
    };

    var extension = {
        load_ipython_extension: load_extension
    };
    return extension;
});
