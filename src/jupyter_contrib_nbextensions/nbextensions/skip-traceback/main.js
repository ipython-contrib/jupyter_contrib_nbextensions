// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

define([
    'base/js/namespace',
    'jquery',
    'require',
    'notebook/js/outputarea',
], function (
    Jupyter,
    $,
    require,
    outputarea
) {
    "use strict";

    var mod_name = 'skip-traceback';
    var log_prefix = '[' + mod_name + ']';

    var cfg = {
        enable: true,
        use_toolbar_button: false,
        button_icon: 'fa-warning',
        animation_duration: 100,
    };

    // this will be filled as they're registered
    var actions = {};

    var apply_patches = function () {

        outputarea.OutputArea.prototype.append_error = function (json) {
            // firts part is just a copy of the original, but keeping a reference to inserted_text
            var inserted_text;
            var tb = json.traceback;
            if (tb !== undefined && tb.length > 0) {
                var s = '';
                var len = tb.length;
                for (var i = 0; i < len; i++) {
                    s = s + tb[i] + '\n';
                }
                s = s + '\n';
                var toinsert = this.create_output_area();
                var append_text = outputarea.OutputArea.append_map['text/plain'];
                if (append_text) {
                    inserted_text = append_text.apply(this, [s, {}, toinsert]).addClass('output_error');
                }
                this._safe_append(toinsert);

                // now we add our header at the top of the inserted_text
                if (!inserted_text) {
                    return;
                }
                var sum = $('<pre/>')
                    .addClass('skip-traceback-summary')
                    .css('cursor', 'pointer')
                    .text(': ' + json.evalue + ' ')
                    .prepend($('<span class=ansired/>').text(json.ename))
                    .append('<i class="fa fa-caret-right" title="Expand traceback"/>')
                    .append('\n')
                    .on('click', function (evt) {
                        var summary = $(this);
                        var icon = summary.find('.fa');
                        var show = icon.hasClass('fa-caret-right');
                        icon
                            .toggleClass('fa-caret-down', show)
                            .toggleClass('fa-caret-right', !show)
                            .attr('title', show ? 'Collapse traceback' : 'Expand traceback');
                        summary.siblings()[show ? 'slideDown' : 'slideUp'](cfg.animation_duration || 100);
                    })
                    .prependTo(inserted_text);
                if (cfg.enable) {
                    sum.siblings().css('display', 'none');
                }
                else {
                    sum.css('display', 'none');
                }
            }
        };
    };

    var toggle_traceback = function (set_on) {
        if (set_on === undefined) {
            set_on = !cfg.enable;
        }
        // update config
        if (set_on !== cfg.enable) {
            cfg.enable = set_on;
            var conf_update = {};
            conf_update[mod_name] = {enable: set_on};
            Jupyter.notebook.config.update(conf_update);
            console.log(log_prefix, 'toggled', set_on ? 'on' : 'off');
        }
        // update button looks
        $('#toggle_traceback_btns > .btn').toggleClass('active', set_on).blur();
        // update existing OutputAreas
        $('.cell .output_area .output_error .skip-traceback-summary').each(function (idx, el) {
            var $summary = $(el);
            $summary.css('display', set_on ? '' : 'none');
            if ($summary.find('.fa').hasClass(set_on ? 'fa-caret-down' : 'fa-caret-right')) {
                $summary.click();
            }
        });
    };

    var register_new_actions = function () {
        actions.toggle = {
            help : 'Toggle Hiding Traceback',
            help_index: 'zz',
            icon : cfg.button_icon || 'fa-warning',
            handler : function (env) { toggle_traceback(); },
        };
        actions.toggle.name = Jupyter.keyboard_manager.actions.register(
            actions.toggle, 'toggle', mod_name);
    };

    var add_toolbar_button = function () {
        if (cfg.use_toolbar_button) {
            Jupyter.toolbar.add_buttons_group([actions.toggle.name], 'toggle_traceback_btns');
        }
    };

    var load_ipython_extension = function () {
        apply_patches();

        Jupyter.notebook.config.loaded
        .then(function () {
            $.extend(true, cfg, Jupyter.notebook.config.data[mod_name]);
            register_new_actions();
            add_toolbar_button();
            toggle_traceback(cfg.enable);
            // update any OutputArea created before our patch)
            $('.cell .output_area .output_error').each(function (idx, el) {
                var $el = $(el);
                if ($el.children('.skip-traceback-summary').length < 1) {
                    var oa = $el.closest('.cell').data('cell').output_area;
                    var json_outputs = oa.toJSON();
                    // clear; do not wait, ignore queue
                    oa.clear_output(false, true);
                    oa.fromJSON(json_outputs);
                }
            });
        })
        .catch(function (reason) {
            console.error(log_prefix, 'Error loading:', reason);
        });
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
