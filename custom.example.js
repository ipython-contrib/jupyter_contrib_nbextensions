// we want strict javascript that fails
// on ambiguous syntax
"using strict";

// notebook loaded is not perfect as it is re-triggerd on
// revert to checkpoint but this allow extesnsion to be loaded
// late enough to work.
$([IPython.events]).on('notebook_loaded.Notebook', function(){


    /**  Use path to js file relative to /static/ dir without leading slash, or
     *  js extension.
     *  Link directly to file is js extension isa simple file
     *
     *  first argument of require is a **list** that can contains several modules if needed.
     **/

    // require(['custom/noscroll']);
    // require(['custom/clean_start'])
    // require(['custom/toggle_all_line_number'])
    // require(['custom/gist_it']);

    /**
     *  Link to entrypoint if extesnsion is a folder.
     *  to be consistent with commonjs module, the entrypoint is main.js
     *  here youcan also trigger a custom function on load that will do extra
     *  action with the module if needed
     **/
    // require(['custom/slidemode/main'],function(slidemode){
    //     // do stuff
    // })

    // require(['custom/autoscroll']);

    // load_ext('css_selector')
    // load_ext('nbviewer_theme')
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
