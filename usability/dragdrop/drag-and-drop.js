//----------------------------------------------------------------------------
//  Copyright (C) 2014  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// add drag&drop functionality
// Tested with Firefox and Chrome

"using strict";

drag_and_drop = function() {

    var wsUri = "ws://" + document.domain + ":8901/"+ "websocket"; 
    var ws_dragdrop = new WebSocket(wsUri);
    IPython.notebook.ws_dragdrop = ws_dragdrop;

    /* receive spellchecker result and mark errors */
    ws_dragdrop.onmessage = function(evt){
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
        var cell = IPython.notebook.get_selected_cell();
        event.preventDefault();
        if(event.stopPropagation) {event.stopPropagation();}
        if (cell.mode == "command") {  
            if (event.dataTransfer.items != undefined) { 
                /* Chrome here */
                var items = event.dataTransfer.items;
                for (var i = 0; i < items.length; ++i) {
                    /* data coming from local file system, must be an image to allow dropping*/
                    if (items[i].kind == 'file' && items[i].type.indexOf('image/') !== -1) {
                        var blob = items[i].getAsFile();
                        var reader = new FileReader();
                        reader.onload = ( function(evt) {
                            var new_cell = IPython.notebook.insert_cell_below('markdown');
                            var str = '<img src="' + evt.target.result + '"/>';
                            new_cell.set_text(str);
                            new_cell.rendered = false;
                            new_cell.read_only = true;
                            new_cell.render();
                            event.preventDefault();
                            } );
                        reader.readAsDataURL(blob);
                    } else if (items[i].kind == 'string') {
                        /* base64 data coming from browser */
                        var new_cell = IPython.notebook.insert_cell_below('markdown');
                        var data = event.dataTransfer.getData('text/plain');
                        var str = '<img  src="' + data + '"/>';
                        new_cell.set_text(str);
                        new_cell.rendered = false;
                        new_cell.read_only = true; 
                        new_cell.render();
                        event.preventDefault();
                        return;
                    }
                }
            } else { 
                /* Firefox here */
                var files = event.dataTransfer.files;
                if (files.length == 0) {
                    /* base64 data coming from browser */
                    var new_cell = IPython.notebook.insert_cell_below('markdown');
                    var data = event.dataTransfer.getData('text/plain');
                    var str = '<img  src="' + data + '"/>';
                    new_cell.set_text(str);
                    new_cell.rendered = false;
                    new_cell.read_only = true;                       
                    new_cell.render();
                    event.preventDefault();
                    return;
                    }
                /* data coming from local file system, must be an image to allow dropping*/
                for (var i=0; i < files.length; i++) {
                    var blob = event.dataTransfer.files[0];
                    if (blob.type.indexOf('image/') !== -1) {
                        console.log("Blob:", blob);
                        var filename = blob.name;
                        var reader = new FileReader();
                            reader.onload = ( function(evt) {
                                var msg = JSON.stringify({"name":filename, 
                                                          "path":IPython.notebook.notebook_path,
                                                          "data": evt.target.result});
                                IPython.notebook.ws_dragdrop.send(msg); 
                                event.preventDefault();
                                } );
                        reader.readAsDataURL(blob);
                    }
                }   
            }
        }
    });


     
}();
