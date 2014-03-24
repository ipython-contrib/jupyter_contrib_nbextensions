//----------------------------------------------------------------------------
//  Copyright (C) 2012  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// Add help panel at right side of notebook window
"using strict";

var help_panel_extension = (function() {

    toggleHelpPanel = function () {
        /* check if help panel is already there */
        var a= $("#helpPanel").html();
        if ( a == undefined ) {
            /* reduce notebook width */
            $("#notebook_panel").css({"float": "left","overflow-x": "hidden","height": "100%","width": "70%"});
            /* add panel to the right of notebook */
            var helppanel = '<div id="helpPanel"></div>';
            $("#ipython-main-app").append(helppanel);
//            $('#helpPanel').css({"height":"100%","width":"20%", "float":"right", "overflow-x": "visible"});
            var data = IPython.quick_help.build_edit_help();
            $('#helpPanel').append(data);
            var data = IPython.quick_help.build_command_help();
            $('#helpPanel').append(data);
        }
        else {
            $("#notebook_panel").css({"width": "100%"});
            $('#helpPanel').remove();

        }
    };


        IPython.toolbar.add_buttons_group([
            {
                id : 'help_panel',
                label : 'Show help panel',
                icon : 'icon-book',
                callback : toggleHelpPanel
            }
      ]);

    var scripts = document.getElementsByTagName("script");
    var scriptLocation = scripts[scripts.length - 1].src;

})();
