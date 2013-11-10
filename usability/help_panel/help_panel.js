//----------------------------------------------------------------------------
//  Copyright (C) 2012  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// Add help panel at right side of notebook window, load and display "helpstring.html"
"using strict";

var help_panel_extension = (function() {

    toggleHelpPanel = function () {
        /* check if help panel is already there */
        var a= $("#helpPanel").html();
        if ( a == undefined ) {
            /* reduce notebook width */
            $("#notebook_panel").css({"float": "left","overflow-x": "hidden","height": "100%","width": "80%"});
            /* add panel to the right of notebook */
            var helppanel = '<div id="helpPanel"><p>dummy</p></div>';
            $("#ipython-main-app").append(helppanel);
            $('#helpPanel').css({"height":"100%","width":"20%", "float":"right", "overflow-x": "visible"});
            /* load html help page */
            $.get('/static/custom/help_panel.html', function(data) {
                $('#helpPanel').html(data);
                /* dynamically add help text from extensions */
                for (var key in IPython.hotkeys) {
                    var str = '<tr><td>' + key + '</td><td>' + IPython.hotkeys[key] + '</td></tr>';
                    console.log($('#help-table'),str);
                    $('#help-table').append(str);
                }
            },"html");
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

    $(document).ready(function() {
      // logs the full path corresponding to "js2.js"
      console.log(scriptLocation);
    });

    console.log("Help Panel extension loaded correctly");
})();
