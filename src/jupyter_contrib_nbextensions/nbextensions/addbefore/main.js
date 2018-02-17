define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'base/js/utils',
], function(Jupyter, $, requirejs, events, configmod, utils) {
    "use strict";

    var load_extension = function() {
             Jupyter.toolbar.add_buttons_group([
                 Jupyter.keyboard_manager.actions.register ({
                      'help'   : 'Insert Cell Above',
                      'icon'   : 'fa-arrow-circle-o-up',
                      'handler': function () {
                                                    Jupyter.notebook.insert_cell_above('code');
                                                    Jupyter.notebook.select_prev();
                                                    Jupyter.notebook.focus_cell();
                      }
                 }, 'insert-cell-above', 'addbefore'),
                 Jupyter.keyboard_manager.actions.register ({
                      'help'   : 'Insert Cell Below',
                      'icon'   : 'fa-arrow-circle-o-down',
                      'handler': function () {
                                                    Jupyter.notebook.insert_cell_below('code');
                                                    Jupyter.notebook.select_next();
                                                    Jupyter.notebook.focus_cell();
                      }
                 }, 'insert-cell-below', 'addbefore'),
                 ]);
             $('#insert_above_below').remove()

    };



    var extension = {
        load_jupyter_extension : load_extension,
        load_ipython_extension : load_extension
    };
    return extension;
});
