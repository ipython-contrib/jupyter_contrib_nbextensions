
var add_css_list = function (element,names) {
    console.log(element)
     var label = $('<label/>').text('Css:');
     var select = $('<select/>')
         .addClass('ui-widget-content')
         .append($('<option/>').attr('value', 'style.min').text('default'));
     element.append(label).append(select);
     select.change(function() {
            var val = $(this).val()
            $('link:nth(7)').attr('href','/static/css/'+val+'.css')
     });
     for (var i=0; i<names.length; i++) {
         var name = names[i];
         select.append($('<option/>').attr('value', name).text(name));
     }
};

add_css_list(IPython.toolbar.element,['duck','dark'])

