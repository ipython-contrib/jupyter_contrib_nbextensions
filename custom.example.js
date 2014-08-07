// Example for custom.js

// we want strict javascript that fails on ambiguous syntax
"using strict";

// activate extensions only after Notebook is initialized
require(["base/js/events"], function (events) {
    if (IPython.version[0] > "2") {
        var ev = events;
    } else {
        var ev = $([IPython.events]);
    }
    ev.on("app_initialized.NotebookApp", function () {
    /*
     * all exentensions from IPython-notebook-extensions, uncomment to activate
     */
        
    // PUBLISHING
//    IPython.load_extensions('publishing/nbviewer_theme/main')
//    IPython.load_extensions('publishing/gist_it')
//    IPython.load_extensions('publishing/nbconvert_button')
//    IPython.load_extensions('publishing/printview_button')
//    IPython.load_extensions('publishing/printviewmenu_button')
    
    // SLIDEMODE
//    IPython.load_extensions('slidemode/main')

    
    // STYLING
//    IPython.load_extensions('styling/css_selector/main')
    
    // TESTING
//    IPython.load_extensions('testing/hierarchical_collapse/main')
//    IPython.load_extensions('testing/history/history'])
//    IPython.load_extensions('testing/cellstate')
    
    // USABILITY
//    IPython.load_extensions('usability/aspell/ipy-aspell')
//    IPython.load_extensions('usability/codefolding/codefolding')
//    IPython.load_extensions('usability/dragdrop/drag-and-drop')
//    IPython.load_extensions('usability/runtools/runtools')
//    IPython.load_extensions('usability/chrome_clipboard')
//    IPython.load_extensions('usability/navigation-hotkeys')
//    IPython.load_extensions('usability/shift-tab')
//    IPython.load_extensions('usability/toggle_all_line_number')
//    IPython.load_extensions('usability/help_panel/help_panel')
//    IPython.load_extensions('usability/hide_input')
//    IPython.load_extensions('usability/search')
//    IPython.load_extensions('usability/split-combine'')
//    IPython.load_extensions('usability/read-only')
//    IPython.load_extensions('usability/init_cell/main')
//    IPython.load_extensions('usability/autosavetime')
//    IPython.load_extensions('usability/autoscroll')
//    IPython.load_extensions('usability/breakpoints')
//    IPython.load_extensions('usability/clean_start')
//    IPython.load_extensions('usability/comment-uncomment')
//    IPython.load_extensions('usability/linenumbers')
//    IPython.load_extensions('usability/no_exec_dunder')
//    IPython.load_extensions('usability/noscroll')
//    IPython.load_extensions('usability/hide_io_selected')
//    IPython.load_extensions('usability/execute_time/ExecuteTime')
//    IPython.load_extensions('usability/python-markdown')

    });
});

