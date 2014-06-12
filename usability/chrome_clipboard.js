// add system clipboard functionality with chrome
// works with images and notebook cells (MIME-type 'notebook-cell/json')

"using strict";

chrome_clipboard = function() {

    if (window.chrome == undefined) return;

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

    /* receive url of graphics from websocket */
    dragdrop_event = function(evt){
        console.log("Websock-Event:", evt);
        var obj = $.parseJSON(evt.data);
        if (obj.status == "OK") {
            var new_cell = IPython.notebook.insert_cell_below('markdown');
            var filename = obj.name;
            var str = '<img  src="' + filename + '"/>';
            new_cell.set_text(str);
            new_cell.rendered = false;
            new_cell.render();
        }
    }
    
    /* 
     * override clipboard 'paste' and insert new cell from json data in clipboard
     */
    window.addEventListener('paste', function(event){
        var cell = IPython.notebook.get_selected_cell();
        if (cell.mode == "command" ) {
            event.preventDefault();
            var items = event.clipboardData.items;
            for (var i = 0; i < items.length; i++) {
                console.log("items:", items[i].type);
                if (items[i].type == 'notebook-cell/json') {
                    /* json data adds a new notebook cell */
                    var data = event.clipboardData.getData('notebook-cell/json');
                    var new_cell_data = JSON.parse(data);
                    var new_cell = IPython.notebook.insert_cell_below(new_cell_data.cell_type);
                    new_cell.fromJSON(new_cell_data);
                } else if (items[i].type.indexOf('image/') !== -1) {
                    /* images are transferred to the server as file and linked to */
                    var blob = items[i].getAsFile();
                    var reader = new FileReader();
                    reader.onload = ( function(evt) {
                        var filename = uniqueid();
                        var msg = JSON.stringify({"type":"file",
                                                  "name":filename, 
                                                  "path":IPython.notebook.notebook_path,
                                                  "url" : "",
                                                  "data": evt.target.result});
                        IPython.notebook.ws_dragdrop.send(msg); 
                        event.preventDefault();
                        } );
                    reader.readAsDataURL(blob);
                }
            }
        }
    });

    /* 
     * override clipboard 'copy' and copy current cell as json and text to clipboard
     */
    window.addEventListener('copy', function(event){
        
        var cell = IPython.notebook.get_selected_cell();
        if (cell.mode == "command") { 
            var sel = window.getSelection();
            if (sel.type == "Range") return; /* default: copy marked text */
            event.preventDefault();
            var j = cell.toJSON();
            var json = JSON.stringify(j);           
            var text = cell.code_mirror.getValue();
            /* copy cell as json and cell contents as text */
            event.clipboardData.setData('notebook-cell/json',json);        
            event.clipboardData.setData("Text", text);
        }
    });    

    /* 
     * override clipboard 'cut' and copy current cell as json and text to clipboard
     */
    window.addEventListener('cut', function(event){
        
        var cell = IPython.notebook.get_selected_cell();
        if (cell.mode == "command" ) {  
            var sel = window.getSelection();
            if (sel.type == "Range") return; /* default: cut marked text */
            event.preventDefault();
            var j = cell.toJSON();
            var json = JSON.stringify(j);
            var text = cell.code_mirror.getValue();       
            /* copy cell as json and cell contents as text */        
            event.clipboardData.setData('notebook-cell/json',json);
            event.clipboardData.setData("Text", text);
            IPython.notebook.delete_cell(IPython.notebook.find_cell_index(cell));
        }
    });

    function callback(out_data)
    { 
        var ul = out_data.content.data;
        var webport = eval(ul['text/plain'])
        console.log("webport:",webport); 
        var wsUri = "ws://" + document.domain + ":" + webport + "/"+ "websocket"; 
        var ws_dragdrop = new WebSocket(wsUri);
        IPython.notebook.ws_dragdrop = ws_dragdrop;
        ws_dragdrop.onmessage = dragdrop_event;
    }

    function getport() 
    {
        var code = 'drag_and_drop_webport';
        var callbacks = { iopub : { output: callback } };
           
        IPython.notebook.kernel.execute(code, callbacks, {silent: false});     
    }
    
        
    $([IPython.events]).on('create.Cell',create_cell);     
    $([IPython.events]).on('status_started.Kernel',function() { getport();});     
    
}();
