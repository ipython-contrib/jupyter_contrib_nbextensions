// custom.js using contents-api to load nbextensions
"use strict";

// do not use notebook loaded  event as it is re-triggerd on
// revert to checkpoint but this allow extension to be loaded
// late enough to work.

require(["base/js/events"], function (events) {

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

events.on("kernel_ready.Kernel", function () {    

    var a = httpGet('http://' + location.host + '/api/config/nbextensions')
    var b = JSON.parse(a)

    var path = b.path
    var activate = b.activate

    for (var key in path) {
        if (activate[key] === true) {
            IPython.load_extensions(path[key])
        }
    }    

    /* disable shortcuts for cell toolbar */
    IPython.keyboard_manager.register_events($('#cell_type'));
    IPython.keyboard_manager.register_events($('#ctb_select'));
    });
});
