define([
    'base/js/namespace',
    'jquery',
    'require',
    'notebook/js/outputarea',
],   function(IPython, $, require, outputarea) {
    "use strict";

	var original_append_error = outputarea.OutputArea.prototype.append_error;

    /*
     * Display only error type and message instead of complete traceback
     */
    var new_append_error = function (json) {
        var tb = json.ename;
		console.log(tb)
        if (tb !== undefined && tb.length > 0) {
            var toinsert = this.create_output_area();
			console.log(outputarea.OutputArea.append_map)
            var append_text = outputarea.OutputArea.append_map['text/plain'];
			console.log(append_text)
            if (append_text) {
			    var s = '[1;31m' + tb + '[0m: ' + json.evalue;
                append_text.apply(this, [s, {}, toinsert]).addClass('output_prompt');				
            }
            this._safe_append(toinsert);
        }
    };

	var toggle_traceback = function() {
        if ($('#toggle_traceback').hasClass('active')) {
            $('#toggle_traceback').removeClass('active');
            $('#toggle_traceback').blur();
			outputarea.OutputArea.prototype.append_error = new_append_error;
        } else {
            $('#toggle_traceback').addClass('active');
            outputarea.OutputArea.prototype.append_error = original_append_error;
        }
    };

    outputarea.OutputArea.prototype.append_error = new_append_error;

	IPython.toolbar.add_buttons_group([
           {
               id : 'toggle_traceback',
               label : 'Toggle Hiding Traceback',
               icon : 'fa-warning',
               callback : function () {
                   toggle_traceback();
                   }
           }
        ]);
});
