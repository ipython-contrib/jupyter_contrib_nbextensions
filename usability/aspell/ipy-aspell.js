// Spell checker frontend for IPython notebook and aspell
// Requires server program running on remote PC

spell_checker = function() {

    /* Put in the name of the machine running ipy-aspell-server.py here */
    var aspell_server = 'nas'; /* = document.domain; if it is running on your local computer */

    var wsUri = "ws://" + aspell_server + ":8989/"+ "websocket"; 
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
        var cell=IPython.notebook.get_selected_cell();
        if (cell.cell_type == "markdown" && cell.read_only == false ) {
            for (var i = 0; i < marked.length; ++i)
                marked[i].clear();

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
                var msg = JSON.stringify({"text":curWord, "line": cur.line, "start":start, "end":end, "id":cell.cell_id});
                IPython.notebook.ws.send(msg); 
            }
        }
    }

    /* loop through notebook and register codemirror change notification */
    var cells = IPython.notebook.get_cells();
    for(var i=0; i < cells.length; i++){
        var cell = cells[i];
        cell.code_mirror.on("change", RegisterChange);
    }

    /* register codemirror change notification for newly created cells */
    createCell = function (event,nbcell,nbindex) {
        var cell = nbcell.cell;
        if (cell.cell_type == "markdown") {
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

    $([IPython.events]).on('create.Cell',createCell);
    $("head").append($("<link rel='stylesheet' href='/static/custom/aspell/ipy-aspell.css' type='text/css'  />"));
}();
