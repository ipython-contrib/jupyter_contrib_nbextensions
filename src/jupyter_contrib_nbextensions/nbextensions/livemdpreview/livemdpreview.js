define([
    'jquery',
    'require',
    'base/js/namespace',
    'base/js/events',
    'base/js/utils',
    'notebook/js/cell',
    'notebook/js/textcell',
    'codemirror/lib/codemirror',
], function (
    $,
    requirejs,
    Jupyter,
    events,
    utils,
    cell_mod,
    textcell,
    CodeMirror
) {
    "use strict";

    var LiveMdPreviewer = function(options) {
        options = $.extend(true, {}, this._default_options, options);
        this.show_side_by_side = options.show_side_by_side;
        this.timeout = Math.max(50, options.timeout);

        this.addCSS();
        var lmdp = this;
        // Change any existing cells:
        Jupyter.notebook.get_cells().forEach(function (cell) {
            lmdp.registerCell(cell);
        });
        // Ensure we also apply to new cells:
        events.on('create.Cell', function (evt, data) { lmdp.registerCell(data.cell); });
    };

    LiveMdPreviewer.prototype._default_options = {
        show_side_by_side: false,
        timeout :  500,
    };

    /**
     *  do work of rendering the markdown cell, without triggering the rendered
     *  event, or altering classes on elements
     */
    var previewMdCell = function(cell) {
        var cached_trigger = cell.events.trigger;
        cell.events.trigger = function (eventType) {
            if (eventType !== "rendered.MarkdownCell") {
                return cached_trigger.apply(this, arguments);
            }
            return this;
        };

        var Cell = cell_mod.Cell;
        var cached_render = Cell.prototype.render;
        Cell.prototype.render = function () {
            return true;
        };

        try {
            cell.render();
        }
        finally {
            cell.events.trigger = cached_trigger;
            Cell.prototype.render = cached_render;
        }
    };

    LiveMdPreviewer.prototype.registerCell = function(cell) {
        if (!(cell instanceof textcell.TextCell)) {
            return;
        }
        var timeout = this.timeout;
        cell.code_mirror.on('changes', function onCodeMirrorChanges (cm, changes) {
            if (!cm.state.livemdpreview) {
                cm.state.livemdpreview = setTimeout(function () {
                    var cell = $(cm.getWrapperElement()).closest('.cell').data('cell');
                    previewMdCell(cell);
                    delete cm.state.livemdpreview;
                }, timeout);
            }
        });
    };

    LiveMdPreviewer.prototype.addCSS = function () {
        var styles_elem = $('#livemdpreviewstyles');
        if (styles_elem.length < 1) {
            styles_elem = $('<style id="livemdpreviewstyles">').appendTo('body');
        }
        var styles = [
             // show rendered stuff even in "unrendered" cell
            '.text_cell.unrendered .text_cell_render { display: block; }',
        ];
        if (this.show_side_by_side) {
            styles.push('.text_cell.unrendered .inner_cell { flex-direction: row !important; }');
            styles.push('.text_cell.unrendered .input_area, .text_cell.unrendered .text_cell_render { width: 50%; }');
        }
        styles_elem.html(styles.join('\n'));
    };

    /**
     * Export things
     */
    return {
        load_ipython_extension : function () {
            return Jupyter.notebook.config.loaded.then(function () {
                return new LiveMdPreviewer(Jupyter.notebook.config.data.livemdpreview);
            });
        }
    };
});
