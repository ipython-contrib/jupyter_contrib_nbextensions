define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'base/js/utils'
], function(Jupyter, $) {
    "use strict";

    var Voice_control = function() {

        Voice_control.prototype.setup_voice_control = function() {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = requirejs.toUrl("../../nbextensions/accessibility_toolbar/voice_control.css");
            document.getElementsByTagName("head")[0].appendChild(link);

            var boostrap_toggle="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css";
            var boostrap_toggle_js="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js";
            var link=document.createElement("link");
            link.rel="stylesheet";
            link.type="text/css"
            link.href=requirejs.toUrl("https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css");
            document.getElementsByTagName("head")[0].appendChild(link);
            var script=document.createElement("script");
            script.src=requirejs.toUrl("https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js");
            document.getElementsByTagName("head")[0].appendChild(script);
            this.create_menu();
            $("#voice_toggle").click(function(e) {
                // console.log(this.prop('checked'))
                e.stopPropagation();
            });
            $("#voice_toggle").change(function(e) {
                // console.log(this.prop('checked'))
                // e.stopPropagation();
                console.log($(this).prop('checked'));
                $("#vc_menu").toggleClass('voice-control-on');
            });
        }

        Voice_control.prototype.create_menu = function(){
            var node = $('button[title="Voice Control"]')
                .addClass("dropdown-toggle")
                .attr("data-toggle","dropdown")
                .attr("id","vc_menu")
                .attr("aria-haspopup","true")
                .attr("aria-controls","vc_dropdown");
            var vcdiv=$("<div>",{"style":"display:inline","class":"btn-group"});
            node.parent().append(vcdiv);
            vcdiv.append(node)
            this.popup = $('<ul/>')
                .addClass("dropdown-menu")
                .attr("id", "vc_dropdown")
                .attr("role", "menu")
                .attr("aria-labelledby", "vc_menu")
                .appendTo(node.parent());

            var button_li = $('<li/>')
                .attr("role", "none")
                .appendTo(this.popup);

            $('<a/>')
                .attr("href", "#")
                .attr("id", "view_commands")
                .text("View commands")
                .attr("role", "menuitem")
                .appendTo(button_li);

            var voice_toggle = $('<li/>')
                .addClass("text-center")
                .attr("role", "none")
                .appendTo(this.popup);

            var input_sw = $('<input/>')
                .attr("role", "menuitem")
                .attr("id", "voice_toggle")
                .attr("title", "Voice control switch")
                .attr("type", "checkbox")
                .attr("data-toggle", "toggle")
                .appendTo(voice_toggle);
        }
    }
    return Voice_control
})
