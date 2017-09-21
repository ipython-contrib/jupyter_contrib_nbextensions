// Launch QT Console attached to the current kernel

define([
    'base/js/namespace',
    'base/js/events'
    ], function(Jupyter, events) {
        var load_ipython_extension = function () {
            Jupyter.toolbar.add_buttons_group([
                /**
                 * Button to launch QTConsole
                 */
                Jupyter.actions.register ({
                     'help'   : 'Run QTConsole',
                     'icon'   : 'fa-terminal',
                     'handler': function () {
                         Jupyter.notebook.kernel.execute('%qtconsole')
                     }
                }, 'qtconsole')
            ]);
        };
        return {
            load_ipython_extension : load_ipython_extension
        };
});
