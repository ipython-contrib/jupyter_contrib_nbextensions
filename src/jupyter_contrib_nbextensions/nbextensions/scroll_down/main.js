define([
    'base/js/namespace',
    'services/config',
    'base/js/utils',
    'jquery'
], function (Jupyter,
             configmod,
             utils,
             $) {
    'use strict';

    var base_url = utils.get_body_data('baseUrl');
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    var params = {
        scrollDownIsEnabled: false
    };

    config.loaded.then(function () {
        $.extend(true, params, config.data);
        setButtonColor();
    });

    function toggleScrollDown() {
        params.scrollDownIsEnabled = !params.scrollDownIsEnabled;
        config.update(params);
        setButtonColor();
    }

    function setButtonColor() {
        var bg = params.scrollDownIsEnabled ? "darkgray" : "";
        $("#toggle_scroll_down").css("background-color",  bg);
    }

    function load_extension() {
        Jupyter.toolbar.add_buttons_group([
            {
                id: 'toggle_scroll_down',
                label: 'toggle automatic scrolling down',
                icon: 'fa-angle-double-down ',
                callback: toggleScrollDown
            }
        ]);

        console.log("[ScrollDown] is loaded");

        $(".output").on("resize", function () {
            if (!params.scrollDownIsEnabled) return;
            var output = $(this);
            setTimeout(function () {
                output.scrollTop(output.prop("scrollHeight"));
                console.log("height: " + output.prop("scrollHeight"));
            }, 0);
        });

        config.load();
    }

    return {
        load_jupyter_extension: load_extension,
        load_ipython_extension: load_extension
    }
});