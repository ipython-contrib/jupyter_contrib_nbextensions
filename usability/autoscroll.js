var collapse_threshold_control = function (element, IPython) {
    var label = $('<label/>').text('AutoScroll Limit:');
    var select = $('<select/>')
         .addClass('ui-widget-content')
         .append($('<option/>').attr('value', '100').text('100 (default)'))
         .append($('<option/>').attr('value', '-1').text('no-scroll'))
    
         element.append(label).append(select);
    select.change(function() {
         var val = $(this).val()
         IPython.OutputArea.auto_scroll_threshold = parseInt(val)
    });
    var thresholds = [1,10,50,200,500,1000];

    for (var i=0; i<thresholds.length; i++) {
         var thr = thresholds[i];
         select.append($('<option/>').attr('value', thr).text(thr));
    }
};

collapse_threshold_control(IPython.toolbar.element, IPython)

