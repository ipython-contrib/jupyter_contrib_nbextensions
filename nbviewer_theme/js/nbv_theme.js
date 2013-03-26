
var nbtheme = function (element,names) {
    var label = $('<label/>').text('NBvCss:');
    var select = $('<select/>')
         .addClass('ui-widget-content')
         .attr('id','nbsel')
         .append($('<option/>').attr('value', 'default').text('default'));
    element.append(label).append(select);
    meta = IPython.notebook.metadata
    if( meta._nbviewer == undefined) {
                meta._nbviewer = {}
    }
    select.change(function() {
            // check the metadata._nbviewer exists
            var val = $(this).val()
            
            if(val == 'default'){
                delete meta._nbviewer.css;
            } else {
                meta._nbviewer.css = val;
            }
                
     });
     for (var i=0; i<names.length; i++) {
         var name = names[i];
         select.append($('<option/>').attr('value', name).text(name));
     }
     select.val(IPython.notebook.metadata._nbviewer.css)
    console.log('nbviewer css loaded correctly');
};

$([IPython.events]).on('notebook_loaded.Notebook', function(){
    nbtheme(IPython.toolbar.element,['cdp_1','linalg_css'])
})

