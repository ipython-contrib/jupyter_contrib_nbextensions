// toggle display of all code cells' inputs

define([
    'jquery',
    'base/js/namespace',
    'base/js/events'
], function(
    $,
    Jupyter,
    events
) {
    "use strict";

    function set_input_visible(show) {
        Jupyter.notebook.metadata.hide_input = !show;

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

    function initialize () {
        set_input_visible(Jupyter.notebook.metadata.hide_input !== true);
    }

    var load_ipython_extension = function() {
        $(Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                help   : 'Hide codecell inputs',
                icon   : 'fa-eye',
                handler: function() {
                    toggle();
                    setTimeout(function() { $('#toggle_codecells').blur(); }, 500);
                }
            }, 'hide-codecell-inputs', 'hide_input_all'),
        ])).find('.btn').attr('id', 'toggle_codecells');
        if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
            // notebook_loaded.Notebook event has already happened
            initialize();
        }
        events.on('notebook_loaded.Notebook', initialize);
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
