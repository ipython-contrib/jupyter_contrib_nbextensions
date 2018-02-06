define([
    'jquery',
    'base/js/namespace',
], function (
    $,
    Jupyter
) {
    'use strict';

    var params = {
        scrollDownIsEnabled: false
    };

    var initialize = function () {
        $.extend(true, params, Jupyter.notebook.config.data);
        setButtonColor();
    };

    function toggleScrollDown() {
        params.scrollDownIsEnabled = !params.scrollDownIsEnabled;
        Jupyter.notebook.config.update(params);
        setButtonColor();
    }

    function setButtonColor() {
        $("#toggle_scroll_down").toggleClass('active', params.scrollDownIsEnabled);
    }

    function load_extension() {
        $(Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                help   : 'toggle automatic scrolling down',
                icon   : 'fa-angle-double-down ',
                handler: toggleScrollDown
            }, 'toggle-auto-scroll-down', 'scroll_down')
        ])).find('.btn').attr('id', 'toggle_scroll_down');

        console.log("[ScrollDown] is loaded");

        // the event was renamed from 'resize' to 'resizeOutput' in
        // https://github.com/jupyter/notebook/commit/b4928d481abd9f7cd996fd4b24078a55880d21e6
        $(document).on("resize resizeOutput", ".output", function () {
            if (!params.scrollDownIsEnabled) return;
            var output = $(this);
            setTimeout(function () {
                output.scrollTop(output.prop("scrollHeight"));
            }, 0);
        });

        return Jupyter.notebook.config.loaded.then(initialize);
    }

    return {
        load_jupyter_extension: load_extension,
        load_ipython_extension: load_extension
    };
});
