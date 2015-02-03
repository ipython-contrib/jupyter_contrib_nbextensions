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
    var MAX_CHARACTERS = 10000;  // maximum number of characters the output area is allowed to print

    var base_url = utils.get_body_data("baseUrl")
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});
    config.load();

    config.loaded.then(function() {
        console.log("config.data:",config.data)
        if (config.data.hasOwnProperty('limit_output') ){
            MAX_CHARACTERS = config.data.limit_output;
            //console.log('limit_output to ', MAX_CHARACTERS, 'characters')
        }
    });

    
    oa.OutputArea.prototype._handle_output = oa.OutputArea.prototype.handle_output;
    oa.OutputArea.prototype.handle_output = function (msg){
        if(!this.count){this.count=0}
        if(!this.max_count){ this.max_count = MAX_CHARACTERS }
        this.count = this.count+String(msg.content.text).length;        
        if(this.count > this.max_count){
            if(!this.drop){
                console.log("Output exceeded", this.max_count, "characters. Further output muted.");
                msg.content.text = msg.content.text.substr(0,this.max_count) + "**OUTPUT MUTED**";
                this.drop=true;
                return this._handle_output(msg);
            }
            return 
        }
        return this._handle_output(msg);
    }

    cc.CodeCell.prototype._execute = cc.CodeCell.prototype.execute;
    cc.CodeCell.prototype.execute = function(stop_on_error){
        // reset counter on execution.
        this.output_area.count = 0;
        this.output_area.drop  = false;
        return this._execute(stop_on_error);
    }
});
