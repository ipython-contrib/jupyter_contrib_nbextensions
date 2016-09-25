// Small extension to add an help menu pointing 
// to jupyter_contrib_nbextensions at readthedocs.

define(['jquery', 'base/js/namespace'], function($, Jupyter) {
    "use strict";

    function add_help_menu_item() {

        if ($('#jupyter_contrib_nbextensions_help').length > 0) {
            return;
        }
        var menu_item = $('<li/>')
            .append(
                $('<a/>')
                .html('Jupyter-contrib <br> nbextensions')
                .attr('title', 'Jupyter_contrib_nbextensions documentation')
                .attr('id', "jupyter_contrib_nbextensions_help")
                .attr('href', 'http://jupyter-contrib-nbextensions.readthedocs.io/en/latest/')
                .attr('target', "_blank")
                .append(
                    $('<i/>')
                    .addClass('fa fa-external-link menu-icon pull-right')
                ))
        menu_item.insertBefore($($("#help_menu > .divider")[1]))
    }


    var load_ipython_extension = function() {
        add_help_menu_item();
    };

    return {
        load_ipython_extension: load_ipython_extension
    };
});
