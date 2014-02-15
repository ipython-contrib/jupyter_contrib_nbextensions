//----------------------------------------------------------------------------
//  Copyright (C) 2012  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------
require(['/static/components/codemirror/addon/search/search.js']);
require(['/static/components/codemirror/addon/search/searchcursor.js']);

"using strict";

search_replace_toolbar = function() {

    var savepos = {line: 0, ch: 0};    
    var safe_mode;

    search = function(hotkey) {
        var cell = IPython.notebook.get_selected_cell();
        if (safe_mode == "command" && cell.cell_type != "markdown") return; /* only do search in markdown cells while in edit mode */

        var findString = IPython.toolbar.element.find('#search').val();
        var cur = cell.code_mirror.getCursor();

        if (hotkey > 0 && hotkey != 13) cur = savepos;

        savepos = cur; 
        if(cell.element.find('#RegExp').val() == true){
                findString = new RegExp(findString);
        }
        var find = cell.code_mirror.getSearchCursor(findString,cur, cell.element.find('#CaseSensitive').val());
        if (find.find() == true) {
            cell.code_mirror.setSelection(find.pos.from,find.pos.to);               
        } else {
            cell.code_mirror.setCursor(cur);
            cell.code_mirror.focus();
        }
    };

    function replace(hotkey) {
        var cell = IPython.notebook.get_selected_cell();
        if (safe_mode == "command" && cell.cell_type != "markdown") return; /* only do replace in markdown cells while in edit mode */
       
        var findString = IPython.toolbar.element.find('#search').val();
        var replaceString = IPython.toolbar.element.find('#replace').val();
        var cur = cell.code_mirror.getCursor();

        if (hotkey > 0 && hotkey != 13) cur = savepos;

        savepos = cur; 
            if(cell.element.find('#RegExp').val() == true){
                    findString = new RegExp(findString);
            }
            var find = cell.code_mirror.getSearchCursor(findString,cur, cell.element.find('#CaseSensitive').val());
            if (cell.element.find('#CaseSensitive').val() == true) {
                find = cell.code_mirror.getSearchCursor(findString,cur);
                
            }
            if (find.find() == true) {
                cell.code_mirror.setSelection(find.pos.from,find.pos.to);
                cell.code_mirror.replaceSelection(replaceString,"end");
            } else {
                cell.code_mirror.setCursor(cur);
                cell.code_mirror.focus();                
            }
}


function focusin(event) {
    safe_mode = IPython.keyboard_manager.mode;
    IPython.keyboard_manager.searchmode = true;
}

function focusout(event) {
    IPython.keyboard_manager.searchmode = false;
}
  
  var celltoolbar = IPython.toolbar.element;
  
        var search_group = $('<div/>').addClass("btn-group");
            var input = $('<input id="search" >')
                .addClass("inpt")
                .attr("Title","Search for text")
                .on('keyup', function(event) { search(event.keyCode);});
            search_group.append(input);
            search_group.focusin( focusin );
            search_group.focusout( focusout );

            var button = $('<button/>')
                .addClass("btn")
                .attr("Title","Search for text")
                .text("Search")
                .click( function() {search(0);});
            search_group.append(button);

            var button = $('<button data-toggle="button" id="CaseSensitive" value=false/>')
                .addClass("btn")
                .attr("Title","Upper-/lowercase sensitive")
                .text("A/a")
                .click( function() {$(this).val(!$(this).val()); });
            search_group.append(button);

            var button = $('<button data-toggle="button" id="RegExp" value=false/>')
                .addClass("btn")
                .attr("Title","Regular expression search")
                .text("RegEx")
                .click( function() {$(this).val(!$(this).val()); });
            search_group.append(button);           
            
        celltoolbar.append(search_group);

        var replace_group = $('<div/>').addClass("btn-group");
            var input = $('<input id="replace" >')
                .addClass("inpt")
                .attr("Title","Replace text")
                .keydown( function(event) {if (event.keyCode == 13) replace(true);});
            replace_group.append(input);

            var button = $('<button/>')
                .addClass("btn")
                .attr("Title","Replace for text")
                .text("Replace")
                .click( function() {replace(0);});
            replace_group.append(button);  
            replace_group.focusin( focusin );
            replace_group.focusout( focusout );
  
         celltoolbar.append(replace_group);

}();


