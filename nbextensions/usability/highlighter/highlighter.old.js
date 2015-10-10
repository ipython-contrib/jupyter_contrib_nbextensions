var burk = {
    'open': '<div class="burk">\n',
    'close': '</div>'
};
var mark = {
    'open': '<div class="mark">\n',
    'close': '</div>'
};
var icon = '<i class="fa fa-lightbulb-o "></i>'


function add_div(text) {
    if (text.match(/^<div>([\S\s]*)<\/div>$/)==null) {return '<div>'+text+'</div>'}
    else {return text}
}

function rem_div(text) {
    return text.replace(/^<div>([\S\s]*)<\/div>$/,function (w,g){return g})    
}

function highlightInCmdMode(event, highlight) {
    var cell = IPython.notebook.get_selected_cell()
    var cm = IPython.notebook.get_selected_cell().code_mirror
    var zozo = window.getSelection().toString();
    var cell_text = cell.get_text();
    if (zozo.length==0){
        cell_text=rem_div(cell_text);
        cell_text = highlight.open + cell_text + highlight.close+icon
    }
    else{
        var identifiedText = align(zozo,cell_text)
        cell_text = cell_text.replace(identifiedText, highlight.open + identifiedText + highlight.close)
    }
    cell.set_text(add_div(cell_text))
    cell.render();
    return false;
}

function highlightInEditMode(event, highlight) {
    var cell = IPython.notebook.get_selected_cell()
    var cm = cell.code_mirror
    var zozo = cm.getSelection()
    if (zozo.length==0){
        var cell_text = IPython.notebook.get_selected_cell().get_text();
        cell_text = highlight.open + cell_text + highlight.close+icon;
        cell.set_text(cell_text);
    }
    else{
        cm.replaceSelection(highlight.open + zozo + highlight.close)
        cell.set_text(add_div(cell.get_text()))
    }
    return false;
}

function removeHighlights() {
    var cell = IPython.notebook.get_selected_cell()
    var cell_text = rem_div(cell.get_text());
    var ll = [mark.open, mark.close, burk.open, burk.close]
    cell_text = cell_text.replace(/<div class="mark">\n([\s\S]*?)<\/div>(<i class="fa fa-lightbulb-o "><\/i>)?/g, function(w, g) {
        return g
    })
    cell_text = cell_text.replace(/<div class="burk">\n([\s\S]*?)<\/div>(<i class="fa fa-lightbulb-o "><\/i>)?/g, function(w, g) {
        return g
    })
    cell.set_text(cell_text)
    cell.render();
}

//*****************************************************************************************
// Utilitary functions for finding a candidate corresponding text from an unformatted selection

/* In case of text selection in rendered cells, the returned text retains no formatting 
therefore, when looking for this text in the actual formatted text, we need to do a 
kind of "fuzzy" alignment. Though there exists specialized libraries for such task, 
we have developed here a simple heuristics that should work 90% of the time, 
but the problem cannot get a perfect solution. 
A first point is to replace special characters that could be interpreded with 
a special meaning in regular expressions. Then the idea is to find the exact matches 
ofthe longest substring from the beginning of the text, then the longest substring 
from the end of the text. Finally, given the locations of the two substring, 
we extract the corresponding global match in the original text. 
*/
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "#");
    // return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    return str
}

// Extract the longest matching substring from the beginning of the text
function exsub_up(sub, text) {
    for (k = 0; k <= sub.length; k++) {
        if (text.match(sub.substr(0, k)) == null) {
            k = k - 2
            break
        }
    }
    return text.match(sub.substr(0, k + 1))
}

// Extract the longest matching substring from the end of the text
function exsub_down(sub, text) {
    var L = sub.length
    try {
        for (k = 0; k <= sub.length; k++) {
            tst = sub.substr(L - k - 1, L);
            if (text.match(tst) == null) {
                // console.log(tst)
                k = k - 1
                break
            }
        }
        return text.match(sub.substr(L - k - 1, L))
    } catch (e) {
        console.log('Error', e)
        return ""
    }

}

// Function that tries to find the best match of the unformatted 
// text in the formatted one. 

function align(tofind, text) {

    sub = escapeRegExp(tofind)
    textModified = escapeRegExp(text)
    //console.log(textModified.match(sub))
    if (textModified.match(sub) == null) {
        a = exsub_up(sub, textModified)
        b = exsub_down(sub, textModified)
        return text.substr(a.index, b.index + b[0].length - a.index)
    } else {
        var tmpMatch = textModified.match(sub)
        return text.substr(tmpMatch.index, tmpMatch[0].length)
    }
}
//z_ini="Firstable, the [extension* _provides_ three toolbar buttons that enable highlighting a selected text _within a markdown cell_. Two different \`color schemes' are provided, which can be customized in the stylesheet `highlighter.css`. The last button the last button enables to remove all highlightings in the current cell."
// sub_ini="the [extension* provides thr"
// Test: align(sub_ini,z_ini)




// ***************** Keyboard shortcuts ******************************

var add_cmd_shortcuts = {
    'Alt-g': {
        help: 'highlight selected text',
        help_index: 'ht',
        handler: function(event) {
            highlightInCmdMode("", mark);
            return false;
        }
    },
    'Alt-h': {
        help: 'highlight selected text',
        help_index: 'ht',
        handler: function(event) {
            highlightInCmdMode("", burk);
            return false;
        }
    },
};


var add_edit_shortcuts = {
    'Alt-g': {
        help: 'highlight selected text',
        help_index: 'ht',
        handler: function(event) {
            var highlight = mark;
            highlightInEditMode("", mark);
            return false;
        }
    },
    'Alt-h': {
        help: 'highlight selected text',
        help_index: 'ht',
        handler: function(event) {
            var highlight = burk;
            highlightInEditMode("", burk);
            return false;
        }
    },
};

IPython.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
IPython.keyboard_manager.command_shortcuts.add_shortcuts(add_cmd_shortcuts);

//******Toolbar buttons *************************************************

function highlightText(highlight) {
    var cell = IPython.notebook.get_selected_cell();
    var rendered = cell.rendered;
    if (rendered) highlightInCmdMode("", highlight);
    else highlightInEditMode("", highlight);
}

var test = ' <div class="btn-group" role="toolbar"> <button type="button" class="btn btn-group btn-default" style="font-weight:bold;"  \
             href="#" id="highlight1">\
             <i class="fa fa-paint-brush"></i>  G</button>\
             <button type="button" class="btn btn-group btn-default" style="font-weight:bold;margin-left:0" \
             href="#" id="highlight2">\
             <i class="fa fa-flip-horizontal fa-paint-brush"></i>H </button>\
             <button type="button" class="btn btn-default" style="font-weight:bold;margin-left:0"\
             href="#" id="highlight3">\
            <i class="fa fa-flip-horizontal fa-paint-brush" style="color:#cccccc"></i>\
              <i class="fa fa-times" ></i>\
             </button></div>'


$("#maintoolbar-container").append(test);
$("#test").css({
    'padding': '5px'
});

//buttons initial css -- shall check if this is really necessary
$("#highlight1").css({
    'padding': '2px 8px',
    'display': 'inline-block',
    'border': '1px solid',
    'border-color': '#cccccc',
    'font-weight': 'bold',
    'text-align': 'center',
    'vertical-align': 'middle',
    'margin-left': '0px'
})
$("#highlight2").css({
    'padding': '2px 8px',
    'display': 'inline-block',
    'border': '1px solid',
    'border-color': '#cccccc',
    'font-weight': 'bold',
    'text-align': 'center',
    'vertical-align': 'middle',
    'margin-left': '0px'
})


$("#highlight1").on('mouseout', function() {
        $(this).addClass("btn btn-default")
            .removeClass("mark")
    })
    .on('mouseover', function() {
        $(this).removeClass("btn btn-default ")
            .addClass("mark")
            //    .css({ 'padding': '2px 8px', 'display': 'inline-block','border': '1px solid',
            //            'border-color':'#cccccc',  'font-weight': 'bold', 
            //  'text-align': 'center',   'vertical-align': 'middle'
            //  }) 
    })
    .on('click', function() {
        highlightText(mark)
    })
    .tooltip({
        title: 'Highlight selected text (shortcut: Alt-g)',
        trigger: "hover",
        delay: {
            show: 500,
            hide: 50
        }
    });

$("#highlight2").on('mouseout', function() {
        $(this).addClass("btn btn-default")
            .removeClass("burk")
    })
    .on('mouseover', function() {
        $(this).removeClass("btn btn-default ")
            .addClass("burk")
            //    .css({ 'padding': '2px 8px', 'display': 'inline-block','border': '1px solid',
            //            'border-color':'#cccccc',  'font-weight': 'bold',
            //  'text-align': 'center',   'vertical-align': 'middle'
            //  }) 
    })
    .on('click', function() {
        highlightText(burk)
    })
    .tooltip({
        title: 'Highlight selected text (shortcut: Alt-h)',
        trigger: "hover",
        delay: {
            show: 500,
            hide: 50
        }
    });

$("#highlight3")
    .on('click', function() {
        removeHighlights()
    })
    .tooltip({
        title: 'Remove highlightings in selected cell',
        trigger: "hover",
        delay: {
            show: 500,
            hide: 50
        }
    });


//******************************* MAIN FUNCTION **************************

define(["require",
    'base/js/namespace'
], function(require, Jupyter) {

    var security = require("base/js/security")

    var load_css = function(name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);

    };

    //Load_ipython_extension
    var load_ipython_extension = require(['base/js/namespace'], function(Jupyter) {

        "use strict";
        if (Jupyter.version[0] < 3) {
            console.log("This extension requires Jupyter or IPython >= 3.x")
            return
        }

        var _on_reload = true; /* make sure cells render on reload */

        //highlighter_init_cells(); /* initialize cells */


        /* on reload */
        $([Jupyter.events]).on('status_started.Kernel', function() {

            //highlighter_init_cells();
            console.log("reload...");
            _on_reload = false;
        })

    }); //end of load_ipython_extension function


    //.....

    console.log("Loading highlighter.css");
    load_css('./highlighter.css')



    //load_ipython_extension();
    return {
        load_ipython_extension: load_ipython_extension,
    };
}); //End of main function

console.log("Loading ./highlighter.js");
