/**
* ----------------------------------------------------------------------------
* Copyright (c) 2013 - Damián Avila
* Copyright (c) 2015 - Joshua Cooke Barnes (jcb91)
*
* Distributed under the terms of the Modified BSD License.
*
* A little extension to give Zenmode functionality to the IPython notebook.
* ----------------------------------------------------------------------------
*/

define([
    "require",
    "jquery",
    "base/js/namespace",
    "base/js/events",
    'base/js/utils',
    'services/config',
], function(
    require,
    $,
    IPython,
    events,
    utils,
    configmod
) {
    "use_strict";

    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    var backgrounds = [
        'back11.jpg', 'back12.jpg', 'back2.jpg', 'back21.jpg', 'back22.jpg',
        'back3.jpg', 'ipynblogo0.png', 'ipynblogo1.png'
    ];


    var getZenModeActive = function() {
        return ($('link#zenmodecss')[0] !== undefined);
    };

    // not sure when this changed, so maybe this is the wrong comparison to make
    var use_layout_manager = (Number(IPython.version.split(".")[0]) < 3);
    var header_pattern = use_layout_manager ? '#header' : '#header-container';
    if (use_layout_manager) {
        // We need to redefine this function because in the IPython codebase
        // the app_height function does not take into account the possibility
        // to hide the header and 'menubar' bar.
        IPython.layout_manager.app_height = function() {
            var get_height = function(pattern) {
                var el = $(pattern);
                return getZenModeActive() ? 0 : el.outerHeight(true);
            };
            var h = $(window).height();
            // content height
            return h - get_height(header_pattern) - get_height('#menubar') - get_height('#maintoolbar');
        };
    }

    var menu_pattern = '#menubar';
    var oldBgAttrName = "zenmode-old-bg";
    var toggleZenMode = function (background) {
        if (getZenModeActive()) {
            console.log('toggling zenmode off');
            $('#zenmode-toggle-btn .fa').removeClass("fa-rebel").addClass("fa-empire");
            $('#zenmodecss').remove();

            // retrieve and reapply old bg css settings
            var oldBg = $('body').attr(oldBgAttrName) || "#ffffff";
            $('body').css({"background": oldBg});

            $(menu_pattern).toggle(true);
            $(header_pattern).toggle(true);
        }
        else {
            console.log('toggling zenmode on');
            $('#zenmode-toggle-btn .fa').removeClass("fa-empire").addClass("fa-rebel");
            $('head').append(
                $('<link id="zenmodecss" rel="stylesheet" type="text/css"/>').attr(
                    'href', require.toUrl("./main.css"))
            );

            if (background === undefined){
                background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
            }
            var absolute_url_pat = /^https?:\/\/|^\/\//i;
            if (!absolute_url_pat.test(background)) {
                background = require.toUrl("./images/" + background);
            }

            // save old bg css, then apply new
            $('body').attr(oldBgAttrName, ($('body').get(0).style.background || ""));
            $('body').css({
                'background': 'url(' + background + ') no-repeat center center fixed',
                '-webkit-background-size': 'cover',
                '-moz-background-size': 'cover',
                '-o-background-size': 'cover',
                'background-size': 'cover'
            });

            $(menu_pattern).toggle(false);
            $(header_pattern).toggle(false);
        }

        // Lastly get notebook to do a resize
        if (use_layout_manager) {
            IPython.layout_manager.app_height();
            IPython.layout_manager.do_resize();
        }
        else {
            events.trigger("resize-header.Page");
        }
    };

    var setZenModeActive = function(active, background) {
        if (active === undefined) { active = true; }
        console.log("zenmode ->", active);
        if (getZenModeActive() != active) { toggleZenMode(background); }
    };

    config.loaded.then(function() {
        if (config.data.hasOwnProperty('zenmode_use_builtin_backgrounds')) {
            if (!config.data.zenmode_use_builtin_backgrounds) {
                console.log("not using builtin zenmode_backgrounds");
                backgrounds.length = 0;
            }
        }

        if (config.data.hasOwnProperty('zenmode_backgrounds')) {
            if (config.data.zenmode_backgrounds.length > 0) {
                var new_bg_urls = config.data.zenmode_backgrounds;
                for (var ii=0; ii < new_bg_urls.length; ii++) {
                    var bg_url = new_bg_urls[ii].replace(/^\s+|\s+$/g, '');
                    if (bg_url.length > 0 && bg_url[0] != '#') {
                        backgrounds.push(bg_url);
                    }
                }
                console.log("additional zenmode backgrounds added");
            }
        }
        console.log("zenmode_backgrounds = ", backgrounds);

        if (config.data.hasOwnProperty('zenmode_set_zenmode_on_load')) {
            setZenModeActive(
                config.data.zenmode_set_zenmode_on_load ? true : false
            );
        }
    });

    var load_ipython_extension = function(background) {
        IPython.toolbar.add_buttons_group([{
                'label'   : 'Enter/Exit Zenmode',
                'icon'    : 'fa-empire',
                'callback': function() {
                    toggleZenMode(background);
                    setTimeout(function () {
                        $('#zenmode-toggle-btn').blur();
                    }, 500);
                },
                'id'      : 'zenmode-toggle-btn'
            }],
            'zenmode-btn-grp'
        );
        $("#maintoolbar-container").prepend($('#zenmode-btn-grp'));
        config.load();
    };

    var extension = {
        load_ipython_extension : load_ipython_extension,
        backgrounds : backgrounds,
        toggleZenMode : toggleZenMode,
        getZenModeActive : getZenModeActive,
        setZenModeActive : setZenModeActive
    };
    return extension;
});
