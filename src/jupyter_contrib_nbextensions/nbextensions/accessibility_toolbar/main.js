
define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'base/js/utils',
], function(Jupyter, $, requirejs, events, utils) {
    "use strict";
    var Voice_control = function() {
        var voice_control = this;
        // this.notebook = nb;
        this.open = false;

        var node = document.querySelector('button[title="Voice Control"]');
        node.classList.add("dropdown-toggle");
        node.setAttribute("data-toggle","dropdown");
        node.setAttribute("id","vc_menu")
        node.setAttribute("aria-haspopup","true")
        node.setAttribute("aria-controls","vc_dropdown")

        // var parent = node.parentNode;
        // var wrapper = document.createElement('span');
        // wrapper.classList.add("dropdown");
        // parent.replaceChild(wrapper, node);
        // wrapper.appendChild(node);
        this.popup = $('<ul/>')
            .addClass("dropdown-menu")
            .attr("id", "vc_dropdown")
            .attr("role", "menu")
            .attr("aria-labelledby", "vc_menu")
            .appendTo(node);

        var button_li = $('<li/>')
            // .addClass('cmd_button_div row')
            .attr("role", "none")
            .appendTo(this.popup);

        $('<button/>')
            .addClass("btn btn-default btn-lg")
            .attr("id", "view_commands")
            .text("View commands")
            .attr("role", "menuitem")
            .appendTo(button_li);

        var voice_toggle = $('<li/>')
            // .addClass("toggle")
            .attr("role", "none")
            .appendTo(this.popup);

        // var lab = $('<label/>').addClass("switch")
        //     .appendTo(voice_toggle)

        var input_sw = $('<input/>')
            .attr("role", "menuitem")
            .attr("id", "voice_toggle")
            .attr("type", "checkbox")
            .attr("data-toggle", "toggle")
            .appendTo(voice_toggle);
        // $('<span/>').addClass("slider round").appendTo(lab)

        // $('#maintoolbar-container').append(this.popup)

        this.close_vc_popup();
    }

    Voice_control.prototype.open_vc_popup = function (){
        // Toggle dropdown if not already visible:
        console.log("open function");
        if ($('#vc_menu').find('.dropdown-menu').is(":hidden")){
            console.log("found function");
            $('#vc_menu').dropdown('toggle');
        }
        this.open = true;
    }
    Voice_control.prototype.close_vc_popup = function (){
        console.log("close function");
        this.open = false;
    }

    Voice_control.prototype.toggle_vc_popup = function () {
        console.log("toggle function");
        this.open ? this.close_vc_popup() : this.open_vc_popup();
    }
    function setup_voice_control() {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = requirejs.toUrl("./voice_control.css");
        document.getElementsByTagName("head")[0].appendChild(link);

        console.log('Voice Control setup complete');
        return new Voice_control();
    }
    var load_ipython_extension = function() {
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Customise font',
                'icon'   : 'fas fa-font',
                'handler': function () {
                    //TODO
                }
            }, 'customise-font', 'accessibility-toolbar'),
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Spell Checker',
                'icon'   : 'fas fa-check',
                'handler': function () {
                    //TODO
                }
            }, 'spell-checker', 'accessibility-toolbar'),
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Voice Control',
                'icon'   : 'fas fa-microphone',
                'handler':  function () {
                    voice_control.toggle_vc_popup()
                }
            }, 'voice-control', 'accessibility-toolbar'),
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Planner',
                'icon'   : 'fas fa-sticky-note',
                'handler': function () {
                   //TODO
                }
            }, 'planner', 'accessibility-toolbar'),
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Custom themes',
                'icon'   : 'fas fa-clone',
                'handler': function () {
                    //TODO
                }
            }, 'customise-theme', 'accessibility-toolbar'),
        ]);
        var voice_control = setup_voice_control();
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
