function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

var load_ext = function(ext_name) {
    var full_name = '';
    if ( !endsWith(ext_name,'.js')){ 
        full_name = ext_name+'/main.js';
    } else {
        full_name = ext_name;
    }

    var subfolder = '';
    $.getScript('/static/custom/'+subfolder+full_name,function(){})
     .done(function(){ console.log('Extension loading ......[OK] : '+ext_name+' loded correctly')})
     .fail(function(){ console.log('Extension loading ...[ERROR] : '+ext_name+' not loaded')})

}


load_ext('slidemode');
load_ext('gist_it.js');
//
load_ext('clean_start.js')
load_ext('toggle_all_line_number.js')
load_ext('css_selector')
load_ext('nbviewer_theme')

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
