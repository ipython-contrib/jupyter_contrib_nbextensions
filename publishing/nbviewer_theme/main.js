
var nbtheme = function (element,names) {
     var label = $('<label/>').text('NBvCss:');
     var select = $('<select/>')
         .addClass('ui-widget-content')
         .append($('<option/>').attr('value', 'default').text('default'));
     element.append(label).append(select);
     select.change(function() {
            var val = $(this).val()
            if val == 'default'
     });
     for (var i=0; i<names.length; i++) {
         var name = names[i];
         select.append($('<option/>').attr('value', name).text(name));
     }
};

nbtheme(IPython.toolbar.element,['cdp_1','linalg_css'])

