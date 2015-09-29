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
        limit_ouput_message : "**OUTPUT MUTED**"
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

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    config.loaded.then(function() {
        var MAX_CHARACTERS = params.limit_output;
        update_params();
        if (isNumber(params.limit_output)) MAX_CHARACTERS = params.limit_output;

        oa.OutputArea.prototype._handle_output = oa.OutputArea.prototype.handle_output;
        oa.OutputArea.prototype.handle_output = function (msg) {
            if (this.count === undefined) { this.count=0; }
            if (this.max_count === undefined) { this.max_count = MAX_CHARACTERS; }
            this.count = this.count + String(msg.content.text).length;
            if(this.count > this.max_count) {
                if (this.drop) return;
                console.log("limit_output: output exceeded", this.max_count, "characters. Further output muted.");
                msg.content.text = msg.content.text.substr(0, this.max_count) + params.limit_ouput_message;
                this.drop = true;
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

    var extension = {
        load_ipython_extension : load_ipython_extension
    };
    return extension;
});
