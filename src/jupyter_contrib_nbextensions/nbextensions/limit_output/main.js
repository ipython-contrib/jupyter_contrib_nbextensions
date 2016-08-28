// Restrict output in a codecell to a maximum length

define([
    'base/js/namespace',
    'jquery',
    'notebook/js/outputarea',
    'base/js/dialog',
    'notebook/js/codecell',
    'services/config',
    'base/js/utils'
], function(IPython, $, oa, dialog, cc, configmod, utils) {
    "use strict";

    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    // define default values for config parameters
    var params = {
        // maximum number of characters the output area is allowed to print
        limit_output : 10000,
        // message to print when output is limited
        limit_output_message : '<b>limit_output extension: Maximum message size exceeded</b>'
    };

    // to be called once config is loaded, this updates default config vals
    // with the ones specified by the server's config file
    var update_params = function() {
        for (var key in params) {
            if (config.data.hasOwnProperty(key) ){
                params[key] = config.data[key];
            }
        }
    };

    config.loaded.then(function() {
        update_params();
        var MAX_CHARACTERS = params.limit_output;

        oa.OutputArea.prototype._handle_output = oa.OutputArea.prototype.handle_output;
        oa.OutputArea.prototype.handle_output = function (msg) {
            if (msg.header.msg_type.match("stream|execute_result|display_data")) {
                var count = 0;
                if (msg.header.msg_type === "stream") {
                    count = String(msg.content.text).length;
                } else {
                    count = Math.max(
                        (msg.content.data['text/plain'] === undefined) ? 0 : String(msg.content.data['text/plain']).length,
                        (msg.content.data['text/html'] === undefined) ? 0 : String(msg.content.data['text/html']).length )
                }
                if (count > MAX_CHARACTERS)
                    console.log("limit_output: output exceeded", MAX_CHARACTERS, "characters. Further output muted.");
                    if (msg.header.msg_type === "stream") {
                        msg.content.text = msg.content.text.substr(0, MAX_CHARACTERS)
                    } else {
                        if (msg.content.data['text/plain'] !== undefined) msg.content.data['text/plain'] = msg.content.data['text/plain'].substr(0, MAX_CHARACTERS);
                        if (msg.content.data['text/html'] !== undefined) msg.content.data['text/html'] = msg.content.data['text/html'].substr(0, MAX_CHARACTERS);
                    }
                    var limitmsg = {};
                    limitmsg.data = [];
                    limitmsg.data['text/html'] = params.limit_output_message;
                    this._handle_output(msg);
                    return this.append_display_data(limitmsg);
                }
            return this._handle_output(msg);
        };

        cc.CodeCell.prototype._execute = cc.CodeCell.prototype.execute;
        cc.CodeCell.prototype.execute = function() {
            // reset counter on execution.
            this.output_area.count = 0;
            this.output_area.drop  = false;
            return this._execute();
        };
    });

    var load_ipython_extension = function() {
        config.load();
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
