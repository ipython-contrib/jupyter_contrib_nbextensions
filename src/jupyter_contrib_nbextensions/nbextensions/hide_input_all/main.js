// toggle display of all code cells' inputs

define([
    'jquery',
    'base/js/namespace'
], function(
    $,
    IPython
) {
    "use strict";

    function set_input_visible(show) {
        IPython.notebook.metadata.hide_input = !show;

        if (show) $('div.input').show('slow');
        else $('div.input').hide('slow');

        var btn = $('#toggle_codecells');
        btn.toggleClass('active', !show);

        var icon = btn.find('i');
        icon.toggleClass('fa-eye', show);
        icon.toggleClass('fa-eye-slash', !show);
        $('#toggle_codecells').attr(
            'title', (show ? 'Hide' : 'Show') + ' codecell inputs');
    }

    function toggle() {
        set_input_visible($('#toggle_codecells').hasClass('active'));
    }

    var load_ipython_extension = function() {
        IPython.toolbar.add_buttons_group([{
            id : 'toggle_codecells',
            label : 'Hide codecell inputs',
            icon : 'fa-eye',
            callback : function() {
                toggle();
                setTimeout(function() { $('#toggle_codecells').blur(); }, 500);
            }
        }]);

        set_input_visible(IPython.notebook.metadata.hide_input !== true);
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
