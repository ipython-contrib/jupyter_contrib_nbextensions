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
    'services/config',
    'notebook/js/codecell',
    'codemirror/lib/codemirror',
    'codemirror/addon/fold/foldcode',
    'codemirror/addon/fold/foldgutter',
    'codemirror/addon/fold/brace-fold',
    'codemirror/addon/fold/indent-fold'
], function (Jupyter, $, requirejs, events, configmod, codecell, CodeMirror) {
    "use strict";

    // define default config parameter values
    var params = {
        codefolding_hotkey : 'Alt-f',
        init_delay : 1000
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
            // register actions with ActionHandler instance
            var prefix = 'auto';
            var name = 'toggle-codefolding';
            var action = {
                icon: 'fa-comment-o',
                help    : 'Toggle codefolding',
                help_index : 'ec',
                id : 'toggle_codefolding',
                handler : toggleFolding
            };
            var action_full_name = Jupyter.keyboard_manager.actions.register(action, name, prefix);

            // define keyboard shortcuts
            var edit_mode_shortcuts = {};
            edit_mode_shortcuts[params.codefolding_hotkey] = action_full_name;

            // register keyboard shortcuts with keyboard_manager
            Jupyter.notebook.keyboard_manager.edit_shortcuts.add_shortcuts(edit_mode_shortcuts);
            Jupyter.notebook.keyboard_manager.command_shortcuts.add_shortcuts(edit_mode_shortcuts);
        }
        else {
            // we're in edit view
            var extraKeys = Jupyter.editor.codemirror.getOption('extraKeys');
            extraKeys[params.codefolding_hotkey] = toggleFolding;
            CodeMirror.normalizeKeyMap(extraKeys);
            console.log('[codefolding] binding hotkey', params.codefolding_hotkey);
            Jupyter.editor.codemirror.setOption('extraKeys', extraKeys);
        }
    };

    /*
     * Toggle folding on/off at current line
     *
     * @param cm CodeMirror instance
     *
     */
    function toggleFolding () {
        var cm;
        var pos = {line: 0, ch: 0, xRel: 0};
        if (Jupyter.notebook !== undefined) {
            cm = Jupyter.notebook.get_selected_cell().code_mirror;
            if (Jupyter.notebook.mode === 'edit') {
                pos = cm.getCursor();
            }
        }
        else {
            cm = Jupyter.editor.codemirror;
            pos = cm.getCursor();
        }
        var opts = cm.state.foldGutter.options;
        cm.foldCode(pos, opts.rangeFinder);
    }

    /**
     * Update cell metadata with folding info, so folding state can be restored after reloading notebook
     *
     * @param cm CodeMirror instance
     */
    function updateMetadata (cm) {
        var list = cm.getAllMarks();
        var lines = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].__isFold) {
                var range = list[i].find();
                lines.push(range.from.line);
            }
        }
        /* User can click on gutter of unselected cells, so make sure we store metadata in the correct cell */
        var cell = Jupyter.notebook.get_selected_cell();
        if (cell.code_mirror !== cm) {
            var cells = Jupyter.notebook.get_cells();
            var ncells = Jupyter.notebook.ncells();
            for (var k = 0; k < ncells; k++) {
                var _cell = cells[k];
                if (_cell.code_mirror === cm ) { cell = _cell; break; }
            }
        }
        cell.metadata.code_folding = lines;
    }

    /**
     * Activate codefolding in CodeMirror options, don't overwrite other settings
     *
     * @param cm codemirror instance
     */
    function activate_cm_folding (cm) {
        var gutters = cm.getOption('gutters').slice();
        if ( $.inArray("CodeMirror-foldgutter", gutters) < 0) {
                gutters.push('CodeMirror-foldgutter');
                cm.setOption('gutters', gutters);
            }

        /* set indent or brace folding */
        var opts = true;
        if (Jupyter.notebook) {
            opts = {
                rangeFinder: new CodeMirror.fold.combine(
                    CodeMirror.fold.firstline,
                    CodeMirror.fold.magic,
                    cm.getMode().fold === 'indent' ? CodeMirror.fold.indent : CodeMirror.fold.brace
                )
            };
        }
        cm.setOption('foldGutter', opts);
    }

    /**
     * Restore folding status from metadata
     * @param cell
     */
    var restoreFolding = function (cell) {
        if (cell.metadata.code_folding === undefined || !(cell instanceof codecell.CodeCell)) {
            return;
        }
        // visit in reverse order, as otherwise nested folds un-fold outer ones
        var lines = cell.metadata.code_folding.slice().sort();
        for (var idx = lines.length - 1; idx >= 0; idx--) {
            var line = lines[idx];
            var opts = cell.code_mirror.state.foldGutter.options;
            var linetext = cell.code_mirror.getLine(line);
            if (linetext !== undefined) {
                cell.code_mirror.foldCode(CodeMirror.Pos(line, 0), opts.rangeFinder);
            }
            else {
                // the line doesn't exist, so we should remove it from metadata
                cell.metadata.code_folding = lines.slice(0, idx);
            }
            cell.code_mirror.refresh();
        }
    };

    /**
     * Add codefolding gutter to a new cell
     *
     * @param event
     * @param nbcell
     *
     */
    var createCell = function (event, nbcell) {
        var cell = nbcell.cell;
        if ((cell instanceof codecell.CodeCell)) {
            activate_cm_folding(cell.code_mirror);
            cell.code_mirror.on('fold', updateMetadata);
            cell.code_mirror.on('unfold', updateMetadata);
            // queue restoring folding, to run once metadata is set, hopefully.
            // This can be useful if cells are un-deleted, for example.
            setTimeout(function () { restoreFolding(cell); }, 500);
        }
    };

    /*
     * Initialize gutter in existing cells
     *
     */
    var initExistingCells = function () {
        var cells = Jupyter.notebook.get_cells();
        var ncells = Jupyter.notebook.ncells();
        for (var i = 0; i < ncells; i++) {
            var cell = cells[i];
            if ((cell instanceof codecell.CodeCell)) {
                activate_cm_folding(cell.code_mirror);
                /* restore folding state if previously saved */
                restoreFolding(cell);
                cell.code_mirror.on('fold', updateMetadata);
                cell.code_mirror.on('unfold', updateMetadata);
            }
        }
        events.on('create.Cell', createCell);
    };

    /**
     * Load my own CSS file
     *
     * @param name off CSS file
     *
     */
    var load_css = function (name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = requirejs.toUrl(name, 'css');
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    /**
     * Initialize extension
     *
     */
    var load_extension = function () {
        // first, check which view we're in, in order to decide whether to load
        var conf_sect;
        if (Jupyter.notebook) {
            // we're in notebook view
            conf_sect = Jupyter.notebook.config;
        }
        else if (Jupyter.editor) {
            // we're in file-editor view
            conf_sect = new configmod.ConfigSection('notebook', {base_url: Jupyter.editor.base_url});
            conf_sect.load();
        }
        else {
            // we're some other view like dashboard, terminal, etc, so bail now
            return;
        }

        load_css('codemirror/addon/fold/foldgutter.css');
        /* change default gutter width */
        load_css( './foldgutter.css');

        conf_sect.loaded
        .then(function () { update_params(conf_sect.data); })
        .then(on_config_loaded);

        if (Jupyter.notebook) {
            /* require our additional custom codefolding modes before initialising fully */
            requirejs(['./firstline-fold', './magic-fold'], function () {
                if (Jupyter.notebook._fully_loaded) {
                    setTimeout(function () {
                        console.log('Codefolding: Wait for', params.init_delay, 'ms');
                        initExistingCells();
                    }, params.init_delay);
                }
                else {
                    events.one('notebook_loaded.Notebook', initExistingCells);
                }
            });
        }
        else {
            activate_cm_folding(Jupyter.editor.codemirror);
            setTimeout(function () {
                console.log('Codefolding: Wait for', params.init_delay, 'ms');
                Jupyter.editor.codemirror.refresh();
            }, params.init_delay);
        }
    };

    return {load_ipython_extension : load_extension};
});
