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

        if (show){
            if(Jupyter.notebook.metadata.hide_cellprompt){
                $('div.input').show('slow');
            }else{
                $('div.input > div.inner_cell > div.input_area').show('slow');
                $('div.input_prompt').css('visibility','visible');
            }
        }else{
            if(Jupyter.notebook.metadata.hide_cellprompt){
                $('div.input').hide('slow');
            }else{
                $('div.input_prompt').css('visibility','hidden');
            }
        }

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
            
        // Add a checkbox menu for the hide celltoolbar
        if( $("#view_menu > li#toggle_celltoolbar").length == 0){
                $("#view_menu").append('<li id="toggle_celltoolbar" title="Show/Hide cell toolbar when showing/hidding source"><a href="#"><i class="menu-icon fa fa-square-o pull-left"></i>Toggle cell toolbar hidding</a></li>');
        }
        if(Jupyter.notebook.metadata.hide_cellprompt == undefined){
            Jupyter.notebook.metadata.hide_cellprompt = false;
        }
            
        $("#view_menu > li#toggle_celltoolbar > a > i").toggleClass('fa-square-o',Jupyter.notebook.metadata.hide_cellprompt);
        $("#view_menu > li#toggle_celltoolbar > a > i").toggleClass('fa-check-square-o',!Jupyter.notebook.metadata.hide_cellprompt);
            
        $("#view_menu > li#toggle_celltoolbar > a").click(function(){
            Jupyter.notebook.metadata.hide_cellprompt = !Jupyter.notebook.metadata.hide_cellprompt
            $("#view_menu > li#toggle_celltoolbar > a > i").toggleClass('fa-check-square-o', Jupyter.notebook.metadata.hide_cellprompt);
            $("#view_menu > li#toggle_celltoolbar > a > i").toggleClass('fa-square-o', !Jupyter.notebook.metadata.hide_cellprompt);
            update_input_visibility();
        });
        
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
