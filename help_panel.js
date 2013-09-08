//----------------------------------------------------------------------------
//  Copyright (C) 2012  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// Add help panel at right side of notebook window, load and display "helpstring.html"
"using strict";

toggleHelpPanel = function () {
    /* check if help panel is already there */
    var a= $("#helpPanel").html();
    if ( a == undefined ) {
        /* reduce notebook width */
        $("#notebook_panel").css({"float": "left","overflow-x": "hidden","height": "100%","width": "82%"});
        /* add panel to the right of notebook */
        var helppanel = '<div id="helpPanel"><p>dummy</p></div>';
        $("#ipython-main-app").append(helppanel);
        $('#helpPanel').css({"height":"100%","width":"300px", "float":"right"});
        /* load html help page */
        $.get('/static/custom/help_panel.html', function(data) {
            $('#helpPanel').html(data);
            /* dynamically add help text from extensions */
            for (var key in IPython.hotkeys) {
                var str = '<tr><td>' + key + '</td><td>' + IPython.hotkeys[key] + '</td></tr>';
                console.log($('#help-table'),str);
                $('#help-table').append(str);
            }
        });
    }
    else {
        $("#notebook_panel").css({"width": "100%"});
        $('#helpPanel').remove();

    }
};

initHelpPanel = function(){
    IPython.toolbar.add_buttons_group([
        {
            id : 'help_panel',
            label : 'Show help panel',
            icon : 'icon-book',
            callback : toggleHelpPanel
        }
  ]);

};

$([IPython.events]).on('app_initialized.NotebookApp',initHelpPanel);
console.log("Help Panel extension loaded correctly");

