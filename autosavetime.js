var ast = function (element, IPython) {
    "use strict";
    var label = $('<label/>').text('Autosave interval (min):');
    var select = $('<select/>')
         .addClass('ui-widget-content')
         .append($('<option/>').attr('value', '2').text('2 (default)'))
         .append($('<option/>').attr('value', '0').text('autosave off'))
    
    element.append(label).append(select);
    select.change(function() {
         var val = $(this).val()
         console.log('change val');
         IPython.notebook.set_autosave_interval(parseInt(val)*60*1000)
    });
    var thresholds = [2,5,10,15,20,30,60];

    for (var i=0; i<thresholds.length; i++) {
         var thr = thresholds[i];
         select.append($('<option/>').attr('value', thr).text(thr));
    }

    console.log('foo');
    $([IPython.events]).on("autosave_enabled.Notebook", 
            function(event,value){
               select.val(parseInt(value/60/1000)) 
            });

    console.log('autosave time selector loaded');
};

console.log('repas')
ast(IPython.toolbar.element, IPython)
console.log('awmfiuvb');



