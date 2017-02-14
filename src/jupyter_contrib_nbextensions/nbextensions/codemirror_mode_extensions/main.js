define(['codemirror/lib/codemirror'], function (CodeMirror) {
    "use strict";
    return {
        load_ipython_extension : function () {
            CodeMirror.extendMode('octave', {
                lineComment: '%',
                fold: 'indent',
            });
        }
    };
});
