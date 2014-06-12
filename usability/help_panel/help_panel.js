// Add help panel at right side of notebook window
"using strict";

var help_panel_extension = (function() {

    var platform = IPython.utils.platform;

    var QuickHelp = function (selector) {
    };

    var cmd_ctrl = 'Ctrl-';
    var platform_specific;

    if (platform === 'MacOS') {
        // Mac OS X specific
        cmd_ctrl = 'Cmd-';
        platform_specific = [
            { shortcut: "Cmd-Up",     help:"go to cell start"  },
            { shortcut: "Cmd-Down",   help:"go to cell end"  },
            { shortcut: "Opt-Left",   help:"go one word left"  },
            { shortcut: "Opt-Right",  help:"go one word right"  },
            { shortcut: "Opt-Backspace",      help:"del word before"  },
            { shortcut: "Opt-Delete",         help:"del word after"  },
        ];
    } else {
        // PC specific
        platform_specific = [
            { shortcut: "Ctrl-Home",  help:"go to cell start"  },
            { shortcut: "Ctrl-Up",     help:"go to cell start"  },
            { shortcut: "Ctrl-End",   help:"go to cell end"  },
            { shortcut: "Ctrl-Down",  help:"go to cell end"  },
            { shortcut: "Ctrl-Left",  help:"go one word left"  },
            { shortcut: "Ctrl-Right", help:"go one word right"  },
            { shortcut: "Ctrl-Backspace", help:"del word before"  },
            { shortcut: "Ctrl-Delete",    help:"del word after"  },
        ];
    }

    var cm_shortcuts = [
        { shortcut:"Tab",   help:"code completion or indent" },
        { shortcut:"Shift-Tab",   help:"tooltip" },
        { shortcut: cmd_ctrl + "]",   help:"indent"  },
        { shortcut: cmd_ctrl + "[",   help:"dedent"  },
        { shortcut: cmd_ctrl + "a",   help:"select all"  },
        { shortcut: cmd_ctrl + "z",   help:"undo"  },
        { shortcut: cmd_ctrl + "Shift-z",   help:"redo"  },
        { shortcut: cmd_ctrl + "y",   help:"redo"  },
    ].concat( platform_specific );



    toggleHelpPanel = function () {
        /* check if help panel is already there */
        var a= $("#helpPanel").html();
        if ( a == undefined ) {
            /* reduce notebook width */
            $("#notebook_panel").css({"float": "left","overflow-x": "hidden","height": "100%","width": "70%","font-size": "9pt"});
            /* add panel to the right of notebook */
            var helppanel = '<div id="helpPanel"></div>';
            $("#ipython-main-app").append(helppanel);
            $('#helpPanel').css({"font-size":"9pt"});
            var data = IPython.quick_help.build_edit_help(cm_shortcuts);
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
    $("head").append($("<link rel='stylesheet' href='/static/custom/help_panel/help_panel.css' type='text/css'  />"));
})();
