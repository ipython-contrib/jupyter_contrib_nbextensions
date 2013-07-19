
define(["require"], function(require) {
    console.log('indefine')
    var add_css_list = function (element,names) {
         var label = $('<label/>').text('Css:');
         var select = $('<select/>')
             .addClass('ui-widget-content')
             .append($('<option/>').attr('value', 'default').text('default'));
         element.append(label).append(select);
         select.change(function() {
                var val = $(this).val()
                if (val === 'default'){
                    $('.extracss').remove();
                    return
                }
                var link = $('<link/>')
                    .attr('href',require.toUrl('./css/'+val+'.css'))
                    .attr('rel','stylesheet')
                    .attr('type','text/css')
                    .attr('class','extracss')
                    
                $('head').append(link)
         });
         for (var i=0; i<names.length; i++) {
             var name = names[i];
             select.append($('<option/>').attr('value', name).text(name));
         }
    };
    add_css_list(IPython.toolbar.element,['duck','dark','xkcd'])

});
