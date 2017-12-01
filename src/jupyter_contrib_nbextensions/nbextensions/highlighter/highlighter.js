/*
Three different highlighting schemes "mark"|"burk"|"girk" are defined in the css highlighter.css
The following functions highlight the selected text, according to the scheme chosen by a menu button. More precisely, they replace selected text, both in edit or command mode, by 
a span tag with a given class and the selected text as data.
if no text is selected, then the whole cell is highlighted (using a div tag and a class corresponding to the chosen scheme). A function to remove all hihlightings is also provided. 
*/

function removeFullCellHighlight(cell_text) {
    cell_text = cell_text.replace(/<div class=(?:"mark"|"burk"|"girk")>\n([\s\S]*?)<\/div><i class="fa fa-lightbulb-o "><\/i>/g, function(w, g) {
        return g
    })
    return cell_text
}

function fullCellHighlight(cell_text,scheme) {
    cell_text=removeFullCellHighlight(cell_text);
    return '<div class='+'"'+scheme+'"'+'>\n'+cell_text+'</div><i class="fa fa-lightbulb-o "><\/i>'
}

function highlight(text,scheme) {
    var scheme=scheme;
    // replace by a span, wile preserving leading and trailing spaces
    var rep=text.replace(/(\S[\S\s]*\S)/,function (w,internal_text){
        return '<span class='+'"'+scheme+'"'+'>'+internal_text+'</span>'})
    return rep
    //return '<span class='+'"'+scheme+'"'+'>'+text+'</span>'
}


function add_div(text) {
    if (text.match(/^<div>([\S\s]*)<\/div>$/)==null) {return '<div>'+text+'</div>'}
    else {return text}
}

function rem_div(text) {
    return text.replace(/^<div>([\S\s]*)<\/div>$/,function (w,g){return g})    
}

function highlightInCmdMode(event, scheme) {
    var cell = IPython.notebook.get_selected_cell()
    var cm = IPython.notebook.get_selected_cell().code_mirror
    var selectedText = window.getSelection().toString();
    var cell_text = cell.get_text();
    if (selectedText.length==0){
        cell_text=fullCellHighlight(cell_text,scheme);
    }
    else{
        var identifiedText = align(selectedText,cell_text);
        cell_text = cell_text.replace(identifiedText,highlight(identifiedText,scheme));
    }
    cell.set_text(cell_text);
    cell.render();
    return false;
}

function highlightInEditMode(event, scheme) {
    var cell = IPython.notebook.get_selected_cell()
    var cm = cell.code_mirror
    var selectedText = cm.getSelection()
    if (selectedText.length==0){
        var cell_text = cell.get_text();
        cell_text=fullCellHighlight(cell_text,scheme);
        cell.set_text(cell_text);
    }
    else{
        cm.replaceSelection(highlight(selectedText,scheme))
    }
    return false;
}

function removeHighlights() {
    var cell = IPython.notebook.get_selected_cell();
    var cell_text = removeFullCellHighlight(cell.get_text());
    cell_text = cell_text.replace(/<span class=(?:"mark"|"burk"|"girk")>([\s\S]*?)<\/span>/g, 
        function(w, g) {return g}
)
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
on the longest substring from the beginning of text, then the longest substring 
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


//******Toolbar buttons *************************************************

function highlightText(scheme) {
    var cell = IPython.notebook.get_selected_cell();
    var rendered = cell.rendered;
    if (rendered) highlightInCmdMode("", scheme);
    else highlightInEditMode("", scheme);
}

           
function build_toolbar () {
var test = ' <div id="hgl" class="btn-group" role="toolbar"> \
<button type="button" class="btn btn-group btn-default" id="higlighter_menu" href="#">\
<i class="fa fa-paint-brush"></i> <i id="menu-hgl" class="fa fa-caret-right"></i>  </button>\
<div id="submenu" class="btn-group" style="font-weight:bold;margin-left:0" > \
    <button type="button" class="btn btn-group btn-default burk" style="font-weight:bold;margin-left:0"  href="#" id="b1"> <i class="fa fa-paint-brush"></i>  </button>\
    <button type="button" class="btn btn-group btn-default mark" style="font-weight:bold;margin-left:0"  href="#" id="b2"><i class="fa fa-paint-brush"></i>  </button>\
    <button type="button" class="btn btn-group btn-default girk" style="font-weight:bold;margin-left:0"  href="#" id="b3"><i class="fa fa-paint-brush"></i>  </button>\
<button type="button" class="btn btn-default" style="font-weight:bold;margin-left:0"\
 href="#" id="remove_highlights"> <i class="fa fa-paint-brush" style="color:#cccccc"></i>\
     <i class="fa fa-times"></i> </button></div>\
                 </div>'             
             

$("#maintoolbar-container").append(test);
$("#test").css({
    'padding': '5px'
});

$("#submenu").hide(); // initially hide the submenu

//buttons initial css -- shall check if this is really necessary
$("#higlighter_menu").css({
    'padding': '2px 8px',
    'display': 'inline-block',
    'border': '1px solid',
    'border-color': '#cccccc',
    'font-weight': 'bold',
    'text-align': 'center',
    'vertical-align': 'middle',
    'margin-left': '0px',
    'margin-right': '0px'
})


//Actions


$("#higlighter_menu")
    .on('click', function() {
        $("#submenu").toggle();
        $("#menu-hgl").toggleClass("fa-caret-right", "fa-caret-left")
    })
    .attr('title', 'Highlight Selected Text');


$("#b1")
    .on('click', function() {
        highlightText("burk")
    })
     .on('mouseover', function() {
        $("#b1").removeClass("btn btn-default").addClass("btn burk")
            //.addClass("burk");
}) //!!
    .on('mouseout', function() {
       $("#b1").addClass("btn btn-default")
})  


$("#b2")
    .on('click', function() {
        highlightText("mark")
    })
     .on('mouseover', function() {
    $("#b2").removeClass("btn btn-default").addClass("btn mark")
}) //!!
    .on('mouseout', function() {
       $("#b2").addClass("btn btn-default")
})  

$("#b3")
    .on('click', function() {
        highlightText("girk")
    })
     .on('mouseover', function() {
       $(this).removeClass("btn btn-default").addClass("btn girk")
}) //!!
    .on('mouseout', function() {
       $(this).addClass("btn btn-default")
})  


$("#remove_highlights")
    .on('click', function() {
        removeHighlights()
    })
    .attr('title', 'Remove highlightings in selected cell');
} // end build_toolbar

//******************************* MAIN FUNCTION **************************

define(["require",
    'base/js/namespace'
], function(requirejs, Jupyter) {

    var security = requirejs("base/js/security")

    var load_css = function(name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = requirejs.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);

    };

    //Load_ipython_extension
    var load_ipython_extension = requirejs(['base/js/namespace'], function(Jupyter) {
        "use strict";
        if (Jupyter.version[0] < 3) {
            console.log("This extension requires Jupyter or IPython >= 3.x")
            return
        }

        console.log("[highlighter] Loading highlighter.css");
        load_css('./highlighter.css')

        IPython.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
        IPython.keyboard_manager.command_shortcuts.add_shortcuts(add_cmd_shortcuts);

        build_toolbar();

        var _on_reload = true; /* make sure cells render on reload */

        //highlighter_init_cells(); /* initialize cells */


        /* on reload */
        $([Jupyter.events]).on('status_started.Kernel', function() {

            //highlighter_init_cells();
            console.log("[highlighter] reload...");
            _on_reload = false;
        })

    }); //end of load_ipython_extension function

    return {
        load_ipython_extension: load_ipython_extension,
    };
}); //End of main function

console.log("Loading ./highlighter.js");
