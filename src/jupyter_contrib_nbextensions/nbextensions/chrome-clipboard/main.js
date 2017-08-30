// add system clipboard functionality with chrome
// works with images and notebook cells (MIME-type 'notebook-cell/json')

define([
    'jquery',
    'base/js/namespace',
    'base/js/events'
], function(
    $,
    IPython,
    events
) {
    "use strict";
    if (window.chrome === undefined) return;

    	var params = {
		subdirectory : '',
	};

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

    var create_dir = function(path) {
        var options = {type:'directory'};

        var data = JSON.stringify({
          ext: options.ext,
          type: options.type
        });

        var settings = {
            processData : false,
            type : "PUT",
            data: data,
            contentType: 'application/json',
            dataType : "json"
        };
    utils.promising_ajax(IPython.contents.api_url(path), settings);
    };

    var send_to_server = function(name, msg) {
        var path = utils.url_path_join(utils.url_path_split(IPython.notebook.notebook_path)[0], params.subdirectory);
        if (name == '') {
            name = uniqueid() + '.' + msg.match(/data:image\/(\S+);/)[1];
            }
        create_dir(path);
        var url = '//' + location.host + utils.url_path_join(IPython.notebook.base_url, 'api/contents', path, name);

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
            error : function() {console.log('Data transfer for clipboard paste failed.'); }
        };
        utils.promising_ajax(url, settings).then(
            function on_success (data, status, xhr) {
                var new_cell = IPython.notebook.insert_cell_below('markdown');
                var str = '![](' + utils.url_path_join(params.subdirectory, name) + ')';
                new_cell.set_text(str);
                new_cell.execute();
            },
            function on_error (reason) {
                     console.log('Data transfer for clipboard paste has failed.');
            });
    };

    /**
     * Initialize extension
     */
    var load_ipython_extension = function() {

		IPython.notebook.config.loaded
			.then(function () {
				$.extend(true, params, IPython.notebook.config.data.dragdrop); // update params
				if (params.subdirectory) {
					console.log('subdir:', params.subdirectory)
				}
			})

        /*
         * override clipboard 'paste' and insert new cell from json data in clipboard
         */
        window.addEventListener('paste', function (event) {
            var cell = IPython.notebook.get_selected_cell();
            if (cell.mode == "command") {
                var items = event.clipboardData.items;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image/') !== -1) {
                        event.preventDefault();
                        /* images are transferred to the server as file and linked to */
                        var blob = items[i].getAsFile();
                        var reader = new FileReader();
                        reader.onload = ( function (evt) {
                            var filename = '';
                            send_to_server(filename, evt.target.result);
                            event.preventDefault();
                        } );
                        reader.readAsDataURL(blob);
                    }
                }
            }
        });
    };

    var extension = {
        load_ipython_extension : load_ipython_extension
    };
    return extension;
});