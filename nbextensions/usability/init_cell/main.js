define([
    'jquery',
    'base/js/namespace',
    'base/js/events'
], function (
    $,
    IPython,
    events
) {
    var ctb = IPython.CellToolbar;

    var init_cell_ui_callback = ctb.utils.checkbox_ui_generator(
        'Initialisation Cell',
        // setter
        function(cell, value) {
            cell.metadata.init_cell = value;
        },
        // getter
        function(cell) {
             // if init_cell is undefined, it'll be interpreted as false anyway
            return cell.metadata.init_cell;
        }
    );

    var run_init_cells = function(){
        console.log('init_cell : running all initialization cells');
        var num = 0;
        var cells = IPython.notebook.get_cells();
        for(var ii in cells) {
            var cell = cells[ii];
            if((cell instanceof IPython.CodeCell) && cell.metadata.init_cell === true ) {
                cell.execute();
                num++;
            }
        }
        console.log('init_cell : finished running ' + num + ' initialization cell' + (num !== 1 ? 's' : ''));
    };

    var load_ipython_extension = function() {
        var prefix = 'auto';
        var action_name = 'run-initialization-cells';
        var action = {
            icon: 'fa-calculator',
            help: 'Run all initialization cells',
            help_index : 'zz',
            handler : run_init_cells
        };
        var action_full_name = IPython.notebook.keyboard_manager.actions.register(action, action_name, prefix);

        IPython.toolbar.add_buttons_group([action_full_name]);

        // Register a callback to create a UI element for a cell toolbar.
        ctb.register_callback('init_cell.is_init_cell', init_cell_ui_callback, 'code');
        // Register a preset of UI elements forming a cell toolbar.
        ctb.register_preset('Initialisation Cell', ['init_cell.is_init_cell']);

        // whenever a (new) kernel  becomes ready, run all initialization cells
        events.on('kernel_ready.Kernel', run_init_cells);
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
