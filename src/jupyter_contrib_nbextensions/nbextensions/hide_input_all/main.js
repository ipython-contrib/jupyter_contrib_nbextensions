// toggle display of all code cells' inputs

define([
    'jquery',
    'base/js/namespace',
    'base/js/events',
    'base/js/utils',
    'services/config'
], function(
    $,
    Jupyter,
    events,
    utils,
    configmod
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

            ])).find('.btn').attr('id', 'toggle_codecells');
        
        if( $("#view_menu > li#toggle_celltoolbar").length == 0){
            $("#view_menu").append('<li id="toggle_celltoolbar" title="Display of hide the celltoolbar for cells which where hiiden by the \'hide input\' or \'hide input all\' extensions"><a href="#"><i class="menu-icon fa fa-eye-slash pull-left"></i>show/hide celltoobar for hidden inputs</a></li>');
            var config = new configmod.ConfigSection('hide_input',
                {base_url: utils.get_body_data("baseUrl")});
            config.load();
            config.loaded.then(function(){
                if(Jupyter.notebook.metadata.hide_cellprompt == undefined){
                    Jupyter.notebook.metadata.hide_cellprompt = false;
                    Jupyter.notebook.metadata.hide_cellprompt = (config.data.hide_input.hide_cellprompt || false);
                }
                $("#view_menu > li#toggle_celltoolbar > a > i").toggleClass('fa-eye', !Jupyter.notebook.metadata.hide_cellprompt);
                $("#view_menu > li#toggle_celltoolbar > a > i").toggleClass('fa-eye-slash', Jupyter.notebook.metadata.hide_cellprompt);
            
                $("#view_menu > li#toggle_celltoolbar > a").click(function(){
                    Jupyter.notebook.metadata.hide_cellprompt = !Jupyter.notebook.metadata.hide_cellprompt
                    $("#view_menu > li#toggle_celltoolbar > a > i").toggleClass('fa-eye-slash', Jupyter.notebook.metadata.hide_cellprompt);
                    $("#view_menu > li#toggle_celltoolbar > a > i").toggleClass('fa-eye', !Jupyter.notebook.metadata.hide_cellprompt);
                    update_input_visibility();
                });
                
                if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
                    // notebook already loaded. Update directly
                    initialize();
                }
                events.on("notebook_loaded.Notebook", initialize);
            });
        }else{
        
            // Collapse all cells that are marked as hidden
            if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
                // notebook already loaded. Update directly
                initialize();
            }
            events.on("notebook_loaded.Notebook", initialize);
        }
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
