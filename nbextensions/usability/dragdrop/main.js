// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// Allow drag&drop of images into a notebook
// Tested with Firefox and Chrome

define([
    'base/js/namespace',
    'jquery',
    "base/js/events"
], function(IPython, $, events) {
    "use strict";

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

    var send_to_server = function(name,path,msg) {
        if (name == '') {
            name = uniqueid() + '.' + msg.match(/data:image\/(\S+);/)[1];
            }
        path = path.substring(0, path.lastIndexOf('/')) + '/';
        if (path === '/') path = '';
        var url = '//' + location.host + '/api/contents/' + path + name;
        var img = msg.replace(/(^\S+,)/, ''); // strip header
        //console.log("send_to_server:", url, img);
        var data = {'name': name, 'format':'base64', 'content': img, 'type': 'file'};
        var settings = {
            processData : false,
            cache : false,
            type : "PUT",
            dataType : "json",
            data : JSON.stringify(data),
            headers : {'Content-Type': 'text/plain'},
            async : false,
            success : function (data, status, xhr) {
                var new_cell = IPython.notebook.insert_cell_below('markdown');
                var str = '<img  src="' + name + '"/>';
                new_cell.set_text(str);
                new_cell.execute();
                },
            error : function() {console.log('Data transfer for drag-and-drop failed.'); }
        };
        $.ajax(url, settings);
    };

    /* the dragover event needs to be canceled to allow firing the drop event */
    window.addEventListener('dragover', function(event){
        if (event.preventDefault) {
            event.preventDefault();
        }
    });

    /* allow dropping into a notebook */
    window.addEventListener('drop', function(event){
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
                        reader.onload = ( function(evt, filename) {
                            send_to_server(filename, IPython.notebook.notebook_path, evt.target.result);
                            if(event.stopPropagation) {event.stopPropagation();}
                         } );
                        reader.readAsDataURL(blob);
                    } else {
                        // dropping of ipynb
                        var blob = items[i].getAsFile();
                        var filename = blob.name;
                        var extension = filename.split('.').pop();
                        if (extension === "ipynb") {
                            var reader = new FileReader();
                             reader.onload = ( function(evt) {
                                if(event.stopPropagation) {event.stopPropagation();}
                                var byteString = atob(evt.target.result.split(',')[1]);
                                var content = JSON.parse(byteString);
                                // test for same language
                                if (content.metadata.language_info.name !== IPython.notebook.metadata.language_info.name)
                                {
                                    console.log("Dropping language ", content.language_info.name, " into language ", IPython.notebook.metadata.language_info.name, " not supported")
                                    return
                                }
                                var new_cells = content.cells;
                                var ncells = new_cells.length;
                                var selected_cell_index = IPython.notebook.get_selected_index();
                                var cell_data = null;
                                var new_cell = null;
                                for (i=0; i<ncells; i++) {
                                    cell_data = new_cells[i];
                                    //new_cell = IPython.notebook.insert_cell_at_index(cell_data.cell_type, i);
                                    new_cell = IPython.notebook.insert_cell_below(cell_data.cell_type,selected_cell_index + i);
                                    cell_data.source = cell_data.source[0];
                                    console.log("cell_data:", cell_data, new_cell);
                                    if (cell_data.hasOwnProperty("outputs")) console.log("Output there") //cell_data.outputs = cell_data.outputs[0];
                                    new_cell.fromJSON(cell_data);
                                    IPython.notebook.events.trigger('dragdrop.Cell', {'cell': new_cell})
                                    // approach: insert cell, copy data over
                                    //new_cell.source = cell_data.source[0];
                                    if (new_cell.cell_type === 'code' && !new_cell.output_area.trusted) {
                                        IPython.notebook.trusted = false;
                                    }
                                }
                             } );
                             reader.readAsDataURL(blob);
                        }
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
                        filename = '';
                    } else {
                        url = data;
                        data = "";
                    }
                    /* data coming from browser:
                     *   url  - image is given as an url
                     *   data - image is a base64 blob
                     */
                    //console.log("type:",url," name:", filename," path:", IPython.notebook.notebook_path," url:", url);
                    send_to_server(filename, IPython.notebook.notebook_path, data);
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
                                //console.log("file"," name:", filename," path:", IPython.notebook.notebook_path," url:", url);
                                send_to_server(filename, IPython.notebook.notebook_path, evt.target.result);
                                event.preventDefault();
                                } );
                        reader.readAsDataURL(blob);
                    } else {
                        console.log("Unsupported type: X", items[i].kind, items[i].type);
                    }

                }
        }
    });

    /*
     * make sure we do not drop images into a codemirror text field
     */
    var checktype = function(cm,event) {
        if (event.dataTransfer.items != undefined)
            {
            event.codemirrorIgnore = true;
            }
        var blob = event.dataTransfer.files[0];

        if (event.dataTransfer.files.length > 0 && blob.type.indexOf('image/') !== -1) {
            event.codemirrorIgnore = true;
            }
    };

    var create_cell = function (event,nbcell,nbindex) {
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
    }

    var load_ipython_extension = function() {
        events.on('create.Cell', create_cell);
    };
    return {
        load_ipython_extension : load_ipython_extension
    };
});

