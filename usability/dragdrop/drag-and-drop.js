// add drag&drop functionality
// Tested with Firefox and Chrome


"using strict";

drag_and_drop = function() {
  
    
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

    /* the dragover event needs to be canceled to allow firing the drop event */
    window.addEventListener('dragover', function(event){
        if (event.preventDefault) { event.preventDefault(); };
    });
    
    /* allow dropping an image in notebook */
    window.addEventListener('drop', function(event){
    if (IPython.notebook.mode === "edit") return;
//    console.log("drop event x:",event);
        var cell = IPython.notebook.get_selected_cell();
        event.preventDefault();
        if(event.stopPropagation) {event.stopPropagation();}
            if (event.dataTransfer.items != undefined) { 
                /* Chrome here */
                var items = event.dataTransfer.items;
                for (var i = 0; i < items.length; i++) {
                    /* data coming from local file system, must be an image to allow dropping*/
                    if (items[i].kind == 'file' && items[i].type.indexOf('image/') !== -1) {
                        var blob = items[i].getAsFile();
                        var filename = blob.name;
                        var reader = new FileReader();
                        reader.onload = ( function(evt) {
                        console.log("name:",filename)
                            var msg = JSON.stringify({"type":"file",
                                                      "name":filename, 
                                                      "path":IPython.notebook.notebook_path,
                                                      "url" : "",
                                                      "data": evt.target.result});
                            IPython.notebook.ws_dragdrop.send(msg); 
                            event.preventDefault();
                            } );
                        reader.readAsDataURL(blob);
                    } else if (items[i].kind == 'string') {
                        /* data coming from browser */
                        var data = event.dataTransfer.getData('text/plain');
                        if (data[0] == 'd') {                        
                            url = "";
                            filename = uniqueid();
                        } else {
                            url = data;
                            data = "";
                        }   
                        /* data coming from browser:
                         *   url  - image is given as an url
                         *   data - image is a base64 blob
                         */
                        var msg = JSON.stringify({"type":"url",
                                                  "name":filename, 
                                                  "path":IPython.notebook.notebook_path,
                                                  "url" : url,
                                                  "data": data});
                        IPython.notebook.ws_dragdrop.send(msg);                    
                        event.preventDefault();
                        return;
                    }
                }
            } else { 
                /* Firefox here */
                var files = event.dataTransfer.files;
                if (files.length == 0) {
                    var filename = event.dataTransfer.getData('application/x-moz-file-promise-dest-filename');
                    var data = event.dataTransfer.getData('text/plain');
                    if (filename.length == 0) {
                        url = "";
                        filename = uniqueid();
                    } else {
                        url = data;
                        data = "";
                    }   
                    /* data coming from browser:
                     *   url  - image is given as an url
                     *   data - image is a base64 blob
                     */
                     console.log("type:",url," name:", filename," path:", IPython.notebook.notebook_path," url:", url);
                    var msg = JSON.stringify({"type":"url",
                                              "name":filename, 
                                              "path":IPython.notebook.notebook_path,
                                              "url" : url,
                                              "data": data});
                    IPython.notebook.ws_dragdrop.send(msg);                    
                    event.preventDefault();
                    return;
                    }
                /* data coming from local file system, must be an image to allow dropping*/
                for (var i=0; i < files.length; i++) {
                    var blob = event.dataTransfer.files[0];
                    if (blob.type.indexOf('image/') !== -1) {
                        var filename = blob.name;
                        var url = event.view.location.origin;
                        var reader = new FileReader();
                            reader.onload = ( function(evt) {
                            console.log("file"," name:", filename," path:", IPython.notebook.notebook_path," url:", url);
                                var msg = JSON.stringify({"type":"file",
                                                          "name":filename, 
                                                          "path":IPython.notebook.notebook_path,
                                                          "url" : url,
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
     * make sure we do not drop images into a codemirror text field 
     */
    checktype = function(cm,event) {
        if (event.dataTransfer.items != undefined)  
            {
            evt.codemirrorIgnore = true;
            }
        var blob = evt.dataTransfer.files[0];
        
        if (blob.type.indexOf('image/') !== -1) {
            evt.codemirrorIgnore = true;
            }
    }

    create_cell = function (event,nbcell,nbindex) {
        var cell = nbcell.cell;
        if ((cell instanceof IPython.CodeCell)) {
            cell.code_mirror.on('drop', checktype);
        }
    }; 
    
    var cells = IPython.notebook.get_cells();
    for(var i in cells){
        var cell = cells[i];
        if ((cell instanceof IPython.CodeCell)) {
            cell.code_mirror.on('drop', checktype);
        }
    }; 
    
    function callback(out_data)
    { 
        var ul = out_data.content.data;
        var webport = eval(ul['text/plain'])
        console.log("Graphics webport:",webport); 
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
