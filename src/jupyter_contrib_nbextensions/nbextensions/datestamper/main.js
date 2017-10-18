define([
    "base/js/namespace",
    "jquery"
], function (IPython, $) {
    "use strict";

    var padZero = function(val){
        return ("0" + val).slice(-2);
    };

    var datestring = function(){
        var d = new Date();
        return (
            d.getFullYear() + "-" + padZero(d.getMonth() + 1) + "-" + padZero(d.getDate()) +
            " " + padZero(d.getHours()) + ":" + padZero(d.getMinutes()) + ":" + padZero(d.getSeconds())
        );
    };

    var datestamp = function(){
        var cell = IPython.notebook.get_selected_cell();
        var do_render = !((cell.cell_type === "raw") || (cell.cell_type === "code"));
        if(do_render) cell.unrender();
        cell.code_mirror.focus();
        cell.code_mirror.doc.replaceSelection(datestring() + " ", "end");
        if(do_render) cell.edit_mode();
    };

    var load_ipython_extension = function () {
        IPython.toolbar.add_buttons_group([
            IPython.keyboard_manager.actions.register ({
                help   : 'insert datestamp',
                icon   : 'fa-calendar',
                handler: datestamp
            }, 'insert-datestamp', 'datestamp')
        ]);
    };

    var extension = {
        load_ipython_extension : load_ipython_extension,
    };
    return extension;
});
