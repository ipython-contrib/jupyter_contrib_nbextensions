
define(["require"], function(require) {
    "use strict";

    //console.log('here 1');
    var add_css_list = function (element,names) {
    //    console.log(element)
         var label = $('<label/>').text('Css:');
         var select = $('<select/>')
             .addClass('ui-widget-content')
             .append($('<option/>').attr('value', 'style.min').text('default'));
         element.append(label).append(select);
    //     select.change(function() {
    //            var val = $(this).val()
    //            if (val == 'default'){
    //                $('.extracss').remove();
    //                return
    //            }
    //            var link = $('<link/>')
    //                .attr('href',require.toUrl('./css/'+val+'.css'))
    //                .attr('rel','stylesheet')
    //                .attr('type','text/css')
    //                .attr('class','extracss')
    //                
    //            $('head').append(link)
    //     });
    //     for (var i=0; i<names.length; i++) {
    //         var name = names[i];
    //         select.append($('<option/>').attr('value', name).text(name));
    //     }
    };
    //console.log('here 2') 
    add_css_list(IPython.toolbar.element,['duck','dark'])

});
