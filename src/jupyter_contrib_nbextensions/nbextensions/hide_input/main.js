// Adds a button to hide the input part of the currently selected cells

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

    var toggle_selected_input = function () {
        // Find the selected cell
        var cell = Jupyter.notebook.get_selected_cell();
        // Toggle visibility of the input div
        if(Jupyter.notebook.metadata.hide_cellprompt){
                cell.element.find("div.input").toggle('slow')
        }else{
            cell.element.find("div.input > div.inner_cell > div.input_area").toggle('slow')
            cell.metadata.hide_input = ! cell.metadata.hide_input;

            if(cell.metadata.hide_input){
                cell.element.find("div.input_prompt").css('visibility', 'hidden');
            }else{
                cell.element.find("div.input_prompt").css('visibility', 'visible');
            }
        }
    };

    var update_input_visibility = function () {
        console.log(Jupyter.notebook.metadata.hide_cellprompt);
        Jupyter.notebook.get_cells().forEach(function(cell) {
            if (cell.metadata.hide_input) {
                if(Jupyter.notebook.metadata.hide_cellprompt){
                    cell.element.find("div.input").hide();
                    cell.element.find("div.input > div.inner_cell > div.input_area").show();
                    cell.element.find("div.input_prompt").css('visibility', 'visible');
                }else{
                    cell.element.find("div.input").show();
                    cell.element.find("div.input > div.inner_cell > div.input_area").hide();
                    cell.element.find("div.input_prompt").css('visibility', 'hidden');
                }
            }else{
                cell.element.find("div.input").show();
                cell.element.find("div.input > div.inner_cell > div.input_area").show();
                cell.element.find("div.input_prompt").css('visibility', 'visible');
            }
        })
    };

    var load_ipython_extension = function() {

        // Add a button to the toolbar
        $(Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                help   : 'Toggle selected cell input display',
                icon   : 'fa-chevron-up',
                handler: function() {
                    toggle_selected_input();
                    setTimeout(function() { $('#btn-hide-input').blur(); }, 500);
                }
            }, 'toggle-cell-input-display', 'hide_input')
        ])).find('.btn').attr('id', 'btn-hide-input');
        
        // Add a checkbox menu for the hide celltoolbar
        if( $("#view_menu > li#toggle_celltoolbar").length == 0){
            $("#view_menu").append('<li id="toggle_celltoolbar" title="Show/Hide cell toolbar when showing/hidding source"><a href="#"><i class="menu-icon fa fa-square-o pull-left"></i>Toggle cell toolbar hidding</a></li>');
            var config = new configmod.ConfigSection('hide_input',
                {base_url: utils.get_body_data("baseUrl")});
            config.load();
            config.loaded.then(function(){
                if(Jupyter.notebook.metadata.hide_cellprompt == undefined){
                    Jupyter.notebook.metadata.hide_cellprompt = false;
                    Jupyter.notebook.metadata.hide_cellprompt = (config.data.hide_input.hide_cellprompt || false);
                }
                $("#view_menu > li#toggle_celltoolbar > a > i").toggleClass('fa-square-o', !Jupyter.notebook.metadata.hide_cellprompt);
                $("#view_menu > li#toggle_celltoolbar > a > i").toggleClass('fa-check-square-o', Jupyter.notebook.metadata.hide_cellprompt);
            
                $("#view_menu > li#toggle_celltoolbar > a").click(function(){
                    Jupyter.notebook.metadata.hide_cellprompt = !Jupyter.notebook.metadata.hide_cellprompt
                    $("#view_menu > li#toggle_celltoolbar > a > i").toggleClass('fa-check-square-o', Jupyter.notebook.metadata.hide_cellprompt);
                    $("#view_menu > li#toggle_celltoolbar > a > i").toggleClass('fa-square-o', !Jupyter.notebook.metadata.hide_cellprompt);
                    update_input_visibility();
                });
                
                if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
                    // notebook already loaded. Update directly
                    update_input_visibility();
                }
                events.on("notebook_loaded.Notebook", update_input_visibility);
            });
        }else{
        
            // Collapse all cells that are marked as hidden
            if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
                // notebook already loaded. Update directly
                update_input_visibility();
            }
            events.on("notebook_loaded.Notebook", update_input_visibility);
        }
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
