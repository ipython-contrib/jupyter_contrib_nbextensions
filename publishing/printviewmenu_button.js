// add toolbar button calling File->Print Preview menu

"use strict";
  
IPython.toolbar.add_buttons_group([
    {
        id : 'doPrintView',
        label : 'Create static print view',
        icon : 'fa-print',
        callback : function(){$('#print_preview').click();}
    }
]);


