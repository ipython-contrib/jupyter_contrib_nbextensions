//----------------------------------------------------------------------------
//  Copyright (C) 2012  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// add toolbar button calling File->Print Preview menu

"use strict";
  
IPython.toolbar.add_buttons_group([
    {
        id : 'doPrintView',
        label : 'Create static print view',
        icon : 'icon-print',
        callback : function(){$('#print_preview').click();}
    }
]);


