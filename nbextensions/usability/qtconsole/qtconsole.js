
define([
    'base/js/namespace',
    'base/js/events'
    ], function(Jupyter, events) {
        events.on("app_initialized.NotebookApp", function () {
            Jupyter.toolbar.add_buttons_group([
                /**
                 * Button to launch QTConsole
                 */
                {
                     'label'   : 'Run QTConsole',
                    // select your icon from http://fortawesome.github.io/Font-Awesome/icons
                     'icon'    : 'fa-terminal',
                     'callback': function () {
                         Jupyter.notebook.kernel.execute('%qtconsole')
                     }
                }
            ]);
        });
});
