// Add rulers to a codecell
//

define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'base/js/utils',
], function(IPython, $, require, events, configmod, utils) {
    "use strict";

    var load_ipython_extension = function() {
             IPython.toolbar.add_buttons_group([
                 {
                      'label'   : 'Insert Cell Above',
                      'icon'    : 'fa-arrow-circle-o-up',
                      'callback': function () {
                                                    IPython.notebook.insert_cell_above('code');
                                                    IPython.notebook.select_prev();
                                                    IPython.notebook.focus_cell();
                      }
                 },
                 {
                      'label'   : 'Insert Cell Below',
                      'icon'    : 'fa-arrow-circle-o-down',
                      'callback': function () {
                                                    IPython.notebook.insert_cell_below('code');
                                                    IPython.notebook.select_next();
                                                    IPython.notebook.focus_cell();
                      }
                 }
                 ]);
             $('#insert_above_below').remove()

    };




    var extension = {
        load_ipython_extension : load_ipython_extension
    };
    return extension;
});
