$.getScript('/static/js/slide_meta.js')
$.getScript('/static/js/gist_it.js')
$.getScript('/static/js/clean_start.js')
$.getScript('/static/js/celltoolbarpresets/example.js')
$.getScript('/static/js/toggle_all_line_number.js')
$.getScript('/static/js/css_selector.js')

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

mobile_preset = []
var edit = function(div, cell) {
        var button_container = $(div);
        var button = $('<div/>').button({icons:{primary:'ui-icon-pencil'}});
            button.click(function(){
                cell.edit()
                    })
        button_container.append(button);
}

IPython.CellToolbar.register_callback('mobile.edit',edit);
mobile_preset.push('mobile.edit');

IPython.CellToolbar.register_preset('Mobile',mobile_preset);
