// extension by jcb91
// Tiny extension to add an edit-menu item to open the NbExtensions config page

define(['jquery', 'base/js/namespace'], function ($, Jupyter) {
    "use strict";

    var load_ipython_extension = function () {
        var menu_item = $('<li/>').append(
            $('<a/>', {
                'target' : '_blank',
                'title' : 'Opens in a new window',
                'href' : Jupyter.notebook.base_url + 'nbextensions/',
            })
            .append(' ')
            .append($('<i/>', {'class' : 'fa fa-cogs menu-icon pull-right'}))
            .append($('<span/>').html('nbextensions config'))
        );

        var edit_menu = $('#edit_menu');
        edit_menu.append($('<li/>').addClass('divider'));
        edit_menu.append(menu_item);
    };

    // export the extension so it can be loaded correctly
    var extension = {
        load_ipython_extension : load_ipython_extension
    };
    return extension;
});
