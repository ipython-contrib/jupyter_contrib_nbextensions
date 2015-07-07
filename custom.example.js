// Example for custom.js

// we want strict javascript that fails on ambiguous syntax
"use strict";

// activate extensions only after Notebook is initialized
require(["base/js/events"], function (events) {
    events.on("app_initialized.NotebookApp", function () {
    /*
     * all exentensions from IPython-notebook-extensions, uncomment to activate
     */
        
    // PUBLISHING
//    IPython.load_extensions('publishing/nbviewer_theme/main')
//    IPython.load_extensions('publishing/gist_it')
//    IPython.load_extensions('publishing/nbconvert_button')
//    IPython.load_extensions('publishing/printview/main')
//    IPython.load_extensions('publishing/printviewmenu_button')
    
    // SLIDEMODE
//    IPython.load_extensions('slidemode/main')

    
    // STYLING
//    IPython.load_extensions('styling/css_selector/main')
    
    // TESTING
//    IPython.load_extensions('testing/hierarchical_collapse/main')
    
    // USABILITY
//    IPython.load_extensions('usability/aspell/ipy-aspell')
//    IPython.load_extensions('usability/codefolding/main')
//    IPython.load_extensions('usability/dragdrop/drag-and-drop')
//    IPython.load_extensions('usability/runtools/main')
//    IPython.load_extensions('usability/chrome_clipboard/main')
//    IPython.load_extensions('usability/navigation-hotkeys/main')
//    IPython.load_extensions('usability/toggle_all_line_number')
//    IPython.load_extensions('usability/help_panel/help_panel')
//    IPython.load_extensions('usability/hide_input/main')
//    IPython.load_extensions('usability/split-combine')
//    IPython.load_extensions('usability/read-only')
//    IPython.load_extensions('usability/init_cell/main')
//    IPython.load_extensions('usability/limit_output/main')
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
//    IPython.load_extensions('usability/python-markdown/main')

    });
});

