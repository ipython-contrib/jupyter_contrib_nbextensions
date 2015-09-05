/* 
How does it work ?

send each cell to a server for storing

*/
 
var ws;

/* http://stackoverflow.com/questions/3231459/create-unique-id-with-javascript */
function uniqueid(){
    // always start with a letter (for DOM friendlyness)
    var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
    do {                
        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
        var ascicode=Math.floor((Math.random()*42)+48);
        if (ascicode<58 || ascicode>64){
            // exclude all chars between : (58) and @ (64)
            idstr+=String.fromCharCode(ascicode);    
        }                
    } while (idstr.length<32);

    return (idstr);
}

/**
 * Called when a cell is executed
 *
 * @param {Object} event
 * @param {Object} current notebook cell
 */
var execute_cell = function (event,cell) {
    // create unique id if not already exists
    if (cell.metadata.history == undefined) {
        cell.metadata.history = {};
        cell.metadata.history.id = uniqueid();
    }
    // now send cell text to server
    var obj = { 'id' : cell.metadata.history.id , 'text' : cell.get_text()  };
    var str = JSON.stringify(obj);
    ws.send(str);
};
//        var pb = '<div id="container" style="width:100%; height:10px;"><div id="progressbar" style="width:'+value+'%;height:10px;background:#FFA500"></div></div>'
//        cell.element.prepend(pb);
//        div_slideshow = cell.element.find('div.slideshow');
//    div_slideshow.css("background","#FFA500"); 
//    div_slideshow.css("height","17px"); 

var set_progressbar = function(cell,idx,imax) {
    var div_history = cell.element.find('div.history');
    if (div_history.length == 0) {
        cell.element.prepend('<div class="history"><p>Init</p></div>');
        div_history = cell.element.find('div.history');        
    }
    if (idx < imax) {
        div_history.html('<p>'+idx+'/'+imax+'</p>');
    } else {
        div_history.html('<p></p>');
    }
}

/* receive update */
var update_history = function(evt) {
    var obj = $.parseJSON(evt.data);
    var cells = IPython.notebook.get_cells();
    for(var i in cells) {
        var cell = cells[i];
        if (cell.metadata.history != undefined) {
            if (cell.metadata.history.id == obj.id) {
                cell.set_text(obj.text); 
                set_progressbar(cell,obj.idx+1, obj.imax);
                if (cell instanceof IPython.CodeCell) {
                    cell.execute();
                } else {
                    cell.rendered = false;
                    cell.render();
                }  
                IPython.notebook.dirty = true;
            }
        }
    } 
};

/**
 * Move one step forward in cell history
 *
 */
var history_forward = function() {
    var cell = IPython.notebook.get_selected_cell();
    if (cell.metadata.history != undefined) {
        var obj = { 'id' : cell.metadata.history.id , 'action' : 'forward'  };
        var str = JSON.stringify(obj);
        ws.send(str);
    }
};

/**
 * Move one step back in cell history
 *
 */
var history_back = function() {
    var cell = IPython.notebook.get_selected_cell();
    if (cell.metadata.history != undefined) {
        var obj = { 'id' : cell.metadata.history.id , 'action' : 'back'  };
        var str = JSON.stringify(obj);
        ws.send(str);  
    }
};

var history_latest = function() {
    var cells = IPython.notebook.get_cells();
    for(var i in cells) {
        var cell = cells[i];
        if (cell.metadata.history != undefined) {
            var obj = { 'id' : cell.metadata.history.id , 'action' : 'latest'  };
            var str = JSON.stringify(obj);
            ws.send(str);  
        }
    }
};


/**
 * Called when a notebook is loaded
  *
 */
var init_history = function () {
    /* add toolbar buttons */
    IPython.toolbar.add_buttons_group([
                {
                    id : 'forward',
                    label : 'Move cell history one step forward',
                    icon : 'fa-plus-circle',
                    callback : history_forward
                },
                {
                    id : 'back',
                    label : 'Move cell history one step back',
                    icon : 'fa-minus-circle',
                    callback : history_back
                },
                {
                    id : 'end',
                    label : 'All cells to latest step',
                    icon : 'fa-fast-forward',
                    callback : history_latest
                },
            ]);
                
    /* connect to websocket */
    ws = new WebSocket("ws://localhost:8889/websocket");
    ws.onmessage = update_history
};

$([IPython.events]).on('execute_cell.Notebook',execute_cell);

$([IPython.events]).on('notebook_loaded.Notebook',init_history);

console.log("History extension loaded correctly")
