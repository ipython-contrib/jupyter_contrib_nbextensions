define([
    'base/js/namespace',
    'jquery',
    'require'
], function(IPython, $, require) {
    "use strict";

    var load_css = function (name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    load_css('./main.css');
    var zennableDiv = ['<div class="zennable"><div>',
                       '<label class="expander">Expand</label>',
                       '<label class="shrinker">Shrink</label>',
                       '</div></div>'
                      ].join('\n');
    $(zennableDiv).insertAfter('.CodeMirror');

    $('.zennable .expander').on("click", function (event) {
        expander();
    });

    $('.zennable .shrinker').on("click", function (event) {
        shrinker();
    });

    var expander = function () {
        var cell = IPython.notebook.get_selected_cell(),
            ele= cell.element[0];
        ele.querySelector('.input_area').setAttribute('class', 'input_area full-screen');
        ele.querySelector('.zennable div').setAttribute('class', 'zen-backdrop');
    };

    var shrinker = function () {
        $('.zen-backdrop').removeClass('zen-backdrop');
        $('.full-screen').removeClass('full-screen');
    };

    var add_shortcuts = {
        'Alt-l' : {
            help    : 'Toggle fullscreen',
            help_index : 'ml',
            handler : function () {
                if ($('.full-screen').length) {
                    shrinker();
                } else {
                    expander();
                }
            }
        }
    }

    IPython.keyboard_manager.command_shortcuts.add_shortcuts(add_shortcuts);
    IPython.keyboard_manager.edit_shortcuts.add_shortcuts(add_shortcuts);
});
