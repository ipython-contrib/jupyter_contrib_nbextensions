"using strict";

// notebook loaded is not perfect as it is re-triggerd on 
// revert to checkpoint
$([IPython.events]).on('notebook_loaded.Notebook', function(){
    // Full path if extensions are only one file

    // Add a button to disable auto-output scrolling for current session
    //load_ext('noscroll.js');

    //load_ext('clean_start.js')
    //load_ext('toggle_all_line_number.js')
    //load_ext('gist_it.js');
    //

    //
    require(['custom/slidemode/main'],function(slidemode){
        slidemode.init()
    })

    require(['custom/autoscroll']);

    //load_ext('css_selector')
    //load_ext('nbviewer_theme')
    //

});

/*
$([IPython.events]).on('notebook_loaded.Notebook', function(){
    IPython.toolbar.add_buttons_group([
                    {
                'label'   : 'run qtconsole',
                'icon'    : 'ui-icon-calculator',
                'callback': function(){IPython.notebook.kernel.execute('%qtconsole')}
                }
            ]);
});
*/

//$([IPython.events]).on('notebook_loaded.Notebook', function(){
//    mobile_preset = []
//    var edit = function(div, cell) {
//            var button_container = $(div);
//            var button = $('<div/>').button({icons:{primary:'ui-icon-pencil'}});
//                button.click(function(){
//                    cell.edit()
//                        })
//            button_container.append(button);
//    }
//
//    IPython.CellToolbar.register_callback('mobile.edit',edit);
//    mobile_preset.push('mobile.edit');
//
//    IPython.CellToolbar.register_preset('Mobile',mobile_preset);
//});
