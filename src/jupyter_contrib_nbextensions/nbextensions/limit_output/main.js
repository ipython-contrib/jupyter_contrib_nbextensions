// Restrict output in a codecell to a maximum length

define([
    'base/js/namespace',
    'notebook/js/outputarea',
    'notebook/js/codecell',
], function(
    Jupyter,
    oa,
    cc
) {
    "use strict";

    // define default values for config parameters
    var params = {
        // maximum number of characters the output area is allowed to print
        limit_output : 10000,
        limit_stream : true,
        limit_execute_result : true,
        limit_display_data : false,
        // message to print when output is limited
        limit_output_message : '<b>limit_output extension: Maximum message size of {limit_output_length} exceeded with {output_length} characters</b>'
    };

    // to be called once config is loaded, this updates default config vals
    // with the ones specified by the server's config file
    var update_params = function() {
        var config = Jupyter.notebook.config;
        for (var key in params) {
            if (config.data.hasOwnProperty(key) ){
                params[key] = config.data[key];
            }
        }
    };

    function is_finite_number (n) {
        n = parseFloat(n);
        return !isNaN(n) && isFinite(n);
    }

    var initialize = function () {
        update_params();
        // sometimes limit_output metadata val can get stored as a string
        params.limit_output = parseFloat(params.limit_output);
        var old_handle_output = oa.OutputArea.prototype.handle_output;
        oa.OutputArea.prototype.handle_output = function (msg) {
            var handled_msg_types = ['stream', 'execute_result', 'display_data'];
            if (handled_msg_types.indexOf(msg.header.msg_type) < 0) {
                return old_handle_output.apply(this, arguments);
            }
            else {
                // get MAX_CHARACTERS from cell metadata if present, otherwise param
                //msg.header.msg_type
                var MAX_CHARACTERS = params.limit_output;
                var cell_metadata = this.element.closest('.cell').data('cell').metadata;
                if (is_finite_number(cell_metadata.limit_output)) {
                    MAX_CHARACTERS = parseFloat(cell_metadata.limit_output);
                }

                // read the length of already-appended outputs from our data
                var count = this.element.data('limit_output_count') || 0;
                // update count with the length of this message
                var old_count = count;
                if (msg.header.msg_type === "stream" && params.limit_stream) {
                    count += String(msg.content.text).length;
                }
                else {
                    if ((msg.header.msg_type === "execute_result" && params.limit_execute_result) ||
                        (msg.header.msg_type === "display_data" && params.limit_display_data)) {
                        count += Math.max(
                            (msg.content.data['text/plain'] === undefined) ? 0 : String(msg.content.data['text/plain']).length,
                            (msg.content.data['text/html'] === undefined) ? 0 : String(msg.content.data['text/html']).length
                        );
                    }

                }
                // save updated count
                this.element.data('limit_output_count', count);

                if (count <= MAX_CHARACTERS) {
                    return old_handle_output.apply(this, arguments);
                }
                // if here, we'd exceed MAX_CHARACTERS with addition of this message.
                if (old_count <= MAX_CHARACTERS) {
                    // Apply truncated portion of this message
                    var to_add = MAX_CHARACTERS - old_count;
                    if (msg.header.msg_type === "stream") {
                        msg.content.text = msg.content.text.substr(0, to_add);
                    }
                    else {
                        if (msg.content.data['text/plain'] !== undefined) {
                            msg.content.data['text/plain'] = msg.content.data['text/plain'].substr(0, to_add);
                        }
                        if (msg.content.data['text/html'] !== undefined) {
                            msg.content.data['text/html'] = msg.content.data['text/html'].substr(0, to_add);
                        }
                    }
                    old_handle_output.apply(this, arguments);

                    // display limit notification messages
                    console.log(
                        "limit_output: Maximum message size of", MAX_CHARACTERS,
                        "exceeded with",  count, "characters. Further output muted."
                    );
                    // allow simple substitutions for output length for quick debugging
                    var limitmsg = params.limit_output_message.replace("{message_type}", msg.header.msg_type)
                                                              .replace("{limit_output_length}", MAX_CHARACTERS)
                                                              .replace("{output_length}", count);
                    this.append_output({
                        "output_type": "display_data",
                        "metadata": {}, // included to avoid warning
                        "data": {"text/html": limitmsg}
                    });
                }
            }
        };

        var old_clear_output = oa.OutputArea.prototype.clear_output;
        oa.OutputArea.prototype.clear_output = function () {
            // reset counter on execution.
            this.element.data('limit_output_count', 0);
            return old_clear_output.apply(this, arguments);
        };
    };

    var load_ipython_extension = function() {
        return Jupyter.notebook.config.loaded.then(initialize);
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
