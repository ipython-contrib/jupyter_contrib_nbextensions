//----------------------------------------------------------------------------
//  Copyright (C) 2012  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// Spell checker frontend for IPython notebook and aspell
// Requires server program running on remote PC

spell_checker = function() {

    //var wsUri = "ws://" + document.domain + ":8889/"+ "websocket"; 
    var wsUri = "ws://" + "nas" + ":8989/"+ "websocket"; 
    var ws = new WebSocket(wsUri);
    IPython.notebook.ws = ws;

    var marked = [];

    /* receive spellchecker result and mark errors */
    ws.onmessage = function(evt){
        var cell=IPython.notebook.get_selected_cell();
        var obj = $.parseJSON(evt.data);
     
        if (obj.check == 0) {
            var from = {line: obj.line, ch: obj.start};
            var to = {line: obj.line, ch: obj.end }; 
            marked.push(cell.code_mirror.markText(from,to,{className:"ipyspell-highlight"}));
        }
    }

    /* called upon a change in codemirror */
    RegisterChange = function(cm,event) {
    //    console.log("chane");
       // if (event.text = "" || event.text < 32) {
       {
            // new word 
    for (var i = 0; i < marked.length; ++i)
          marked[i].clear();


            var cell=IPython.notebook.get_selected_cell();
            var text = cell.code_mirror.getValue();
            
            var WORD = /[\w$]+/, RANGE = 500;
            var word =  WORD;
            var range =  RANGE;
            
            var cur = cm.getCursor(), curLine = cm.getLine(cur.line);
            var start = cur.ch-1, end = start;
            while (end < curLine.length && word.test(curLine.charAt(end))) ++end;
            while (start && word.test(curLine.charAt(start - 1))) --start;
            var curWord = start != end && curLine.slice(start, end);
            if ( curWord != false) {
                //console.log("Word:",curWord);
                var msg = JSON.stringify({"text":curWord, "line": cur.line, "start":start, "end":end, "id":cell.cell_id});
                IPython.notebook.ws.send(msg); 
            }
        }
    }

    /* loop through notebook and set read-only cells defined in metadata */
    var cells = IPython.notebook.get_cells();
    for(var i in cells){
        var cell = cells[i];
        /* don't check codecells or read-only cells online */
        if (cell.cell_type != "code" && cell.read_only == false ) {
            cell.code_mirror.on("change", RegisterChange);
        }
    };

    clearSpellCheck = function() {
        for (var i = 0; i < marked.length; ++i) marked[i].clear();
        marked.length = 0;
    };

    /* check whole cell */
    doSpellCheck = function() {
        
        for (var i = 0; i < marked.length; ++i) marked[i].clear();
        marked.length = 0;

        var regex = /[\w$]+/g;
          
        var cell=IPython.notebook.get_selected_cell();
        var cm = cell.code_mirror;
        var start = 0, end = start;
        for (var i=0; i < cm.lineCount(); i++) {
            var curLine = cm.getLine(i);
            var matched = null;
            while (matched = regex.exec(curLine)) {
                var word = matched[0];
                var len = word.length;
                var start = matched.index;
                var end = start + len;
                var msg = JSON.stringify({"text":word, "line": i, "start":start, "end":end, "id":cell.cell_id});
                IPython.notebook.ws.send(msg); 
            }
        }
    }
      
    IPython.toolbar.add_buttons_group([
        {
            id : 'doSpellCheck',
            label : 'Perform a spellcheck on cell',
            icon : 'icon-check',
            callback : doSpellCheck
        },
            {
            id : 'clearSpellCheck',
            label : 'Clear spellcheck markers',
            icon : 'icon-trash',
            callback : clearSpellCheck
        }

    ]);


}();
