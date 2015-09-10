// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// Show notebook extension configuration

require([
    'jqueryui',
    'require',
    'base/js/namespace',
    'base/js/page',
    'base/js/utils',
    'services/config',
    'base/js/events'
], function(
    $,
    require,
    IPython,
    page,
    utils,
    configmod,
    events
){
    "use strict";

    var nbext_config_page = new page.Page();
    var base_url = utils.get_body_data('baseUrl');
    // get list of extensions from body data supplied by the python backend
    var extension_list = $('body').data('extension-list');

    /**
     * create config var from json config file on server.
     * we still need to call config.load later to actually fetch it though!
     */
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    // the prefix added to all parameter input id's
    var param_id_prefix = 'input_';

    /**
     * A standardized way to get an element-style id from an extension name
     */
    var ext_name_to_id = function(ext_name) {
        /**
         * The HTML 4.01 spec states that ID tokens must
         * begin with a letter ([A-Za-z])
         * which may be followed by any number of
         *     letters, digits, hyphens, underscores, colons, and periods
         */
        return 'nbext-ext-' + ext_name.replace(/[^A-Za-z0-9-_:.]/g, '');
    };

    /**
     * Compute the url of an extension's main javascript file
     */
    var get_ext_url = function(ext) {
        var url = base_url + ext.url + '/' + ext.Main;
        url = url.split('.js')[0];
        url = url.split('nbextensions/')[1];
        return url;
    };

    /**
     * Update server's json config file to reflect changed activate state
     */
    var set_config_active = function(ext_id, state) {
        state = state === true;
        for(var i in extension_list) {
            var ext = extension_list[i];
            var ext_name = ext['Name'];
            if (ext_name_to_id(ext_name) == ext_id) {
                console.log(
                    "Turning extension", ext_name, state ? ' on' : ' off');
                var to_load = {};
                var ext_url = get_ext_url(ext);
                to_load[ext_url] = (state ? true : null);
                config.update({"load_extensions": to_load});
            }
        }
    };

    /**
     * Update buttons to reflect changed activate state
     */
    var set_buttons_active = function(ext_id, state) {
        state = (state === true);
        $('#' + ext_id + (state ? '-on' : '-off'))
            .prop('disabled', true)
            .removeClass('btn-primary').addClass('btn-default');
        $('#' + ext_id + (state ? '-off' : '-on'))
            .prop('disabled', false)
            .removeClass('btn-default').addClass('btn-primary');
    };

    /**
     * Handle button click event to activate/deactivate extension
     */
    var handle_buttons_click = function(evt) {
        var ext_id = this.id.replace(/-on|-off/, '');
        var state = (this.id.search(/-on/) >= 0) ? true : false;
        set_buttons_active(ext_id, state);
        set_config_active(ext_id, state);
    };

    /*
     * Get the useful value (dependent on element type) from an input element
     */
    var get_input_value = function(input) {
        input = $(input);
        var input_type = input.data('param_type');

        switch (input_type) {
            case 'list':
                var val=[];
                input.find('.nbext-list-element').children().not('a').each(
                    function () {
                        // "this" is the current child element of input in the loop
                        val.push(get_input_value(this));
                    }
                );
                return val;
            case 'checkbox':
                return input.prop('checked') ? true : false;
            default:
                return input.val();
        }
    };

    /*
     * Set the useful value (dependent on element type) from a js value
     */
    var set_input_value = function(input, new_value) {
        input = $(input);
        var input_type = input.data('param_type');
        switch (input_type) {
            case 'list':
                var ul = input.children('ul');
                ul.empty();
                var list_element_param = input.data('list_element_param');
                for (var ii=0; ii < new_value.length; ii++) {
                    var list_element_input = build_param_input(list_element_param);
                    set_input_value(list_element_input, new_value[ii]);
                    ul.append(wrap_list_input(list_element_input));
                }
                break;
            case 'checkbox':
                input.prop('checked', new_value ? true : false);
                break;
            default:
                input.val(new_value);
        }
    };

    /**
     * handle form input for extension parameters, updating parameters in
     * server's json config file
     */
    var handle_input = function(evt) {
        var input = $(evt.target);

        // list elements should alter their parent's config
        if (input.hasClass('nbext-list-element')) {
            input = input.closest('.nbext-list-wrap');
        }
        // get param name by cutting off prefix
        var configkey = input.attr('id').substring(param_id_prefix.length);
        var configval = get_input_value(input);
        console.log(configkey, '->', configval);
        var c = {};
        c[configkey] = configval;
        config.update(c);
        return configval;
    };

    var wrap_list_input = function(list_input) {
        var btn_remove = $('<a/>', {'class': 'btn btn-default input-group-addon nbext-list-el-btn-remove'});
        btn_remove.append($('<i/>', {'class': 'fa fa-fw fa-trash'}));
        btn_remove.on('click', function () {
            var list_el = $(this).closest('li');
            var list_input = list_el.closest('.nbext-list-wrap');
            list_el.remove();
            list_input.change(); // trigger change event
        });

        return $('<li/>', {'class' : 'nbext-list-element input-group'}).append(
            $('<a class="btn btn-default input-group-addon handle"/>').append(
                $('<i class="fa fa-fw fa-arrows-v"/>')
            ),
            [list_input, btn_remove]);
    };


    /**
     * Build and return an element used to edit a parameter
     */
    var build_param_input = function(param) {
        var input_type = (param.input_type || 'text').toLowerCase();
        var input;

        switch (input_type) {
            case 'list':
                input = $('<div/>', {'class' : 'nbext-list-wrap'});
                input.append(
                    $('<ul/>', {'class': 'nbext-list'})
                        .sortable({
                            handle: '.handle',
                            containment: 'window',
                            placeholder: 'nbext-list-element-placeholder',
                            update: function(event, ui) {
                                ui.item.closest('.nbext-list-wrap').change();
                            }
                        })
                );
                var list_element_param = param.list_element || {};
                // add the requested list param type to the list element using
                // jquery data api
                input.data('list_element_param', list_element_param);

                // add a button to add list elements
                var add_button = $('<a/>', {'class': 'btn btn-default input-group-addon nbext-list-btn-add'});
                add_button.addClass('btn-default');
                add_button.append($('<i/>', {'class': 'fa fa-fw fa-plus'}));
                add_button.append(' new item');
                add_button.on('click', function () {
                    $(this).parent().siblings('ul').append(
                        wrap_list_input(build_param_input(list_element_param))
                    ).parent().change();
                });
                input.append($('<div class="input-group"/>').append(add_button));
                break;
            case 'textarea':
                input = $('<textarea/>');
                break;
            case 'number':
                input = $('<input/>', {'type': input_type});
                if (param['step'] !== undefined) input.attr('step', param['step']);
                if (param['min'] !== undefined) input.attr('min', param['min']);
                if (param['max'] !== undefined) input.attr('max', param['max']);
                break;
            default:
                input = $('<input/>', {'type': input_type});
                // detect html5 input tag support using scheme from
                // http://diveintohtml5.info/detect.html#input-types
                // If the browser supports the requested particular input type,
                // the type property will retain the value you set.
                // If the browser does not support the requested input type,
                // it will ignore the value you set
                // and the type property will still be "text".
                input = document.createElement('input');
                input.setAttribute('type', input_type);
                // wrap in jquery
                input = $(input);
        }
        // add the param type to the element using jquery data api
        input.data('param_type', input_type);
        var non_form_control_input_types = ['checkbox', 'list'];
        if (non_form_control_input_types.indexOf(input_type) < 0) {
          input.addClass("form-control");
        }
        input.on('change', handle_input);
        return input;
    };


    /*
     * Build and return a div containing the buttons to activate/deactivate an
     * extension with the given id.
     */
    var build_activate_buttons = function(ext_id) {
        var div_buttons = $('<div class="nbext-activate-btns"/>');

        var btn_activate = $('<button/>', {
            'type': 'button',
            'class': 'btn btn-primary',
            'id': ext_id + '-on'
        }).text('Activate').on('click', handle_buttons_click);
        btn_activate.appendTo(div_buttons);

        var btn_deactivate = $('<button/>', {
            'type': 'button',
            'class': 'btn btn-default',
            'id': ext_id + '-off'
        }).text('Deactivate').on('click', handle_buttons_click);
        btn_deactivate.appendTo(div_buttons);

        btn_deactivate.prop('disabled', true);
        return div_buttons;
    };

    var set_hide_incompat = function(hide_incompat) {
        $('.nbext-compat').toggle(!hide_incompat, 500);
        set_input_value(
            $('#' + param_id_prefix + 'nbext_hide_incompat'), hide_incompat);
    };

    /*
     * build html body listing all extensions.
     *
     * Since this function uses the contents of config.data,
     * it should only be called after config.load() has been executed
     */
    var build_page = function() {
        var container = $("#nbext-container");

        $('.nbext-showhide-incompat').prepend(
            build_param_input({'input_type': 'checkbox'})
            .attr('id', param_id_prefix + 'nbext_hide_incompat')
            .off('change').on('change', function (evt) {
                set_hide_incompat(handle_input(evt));
            })
        ).add('.nbext-page-title').show();
        events.trigger("resize-header.Page");

        // (try to) sort extensions alphabetically
        try {
            extension_list.sort(function (a, b) {
                var an = a.Name.toLowerCase();
                var bn = b.Name.toLowerCase();
                if (an < bn) return -1;
                if (an > bn) return 1;
                return 0;
            });
        }
        catch (err) {
            container.append(
                $('<div class="alert alert-danger"/>')
                .css('margin', '2em')
                .append(
                    $('<h3/>').text(
                        'error loading extension json data!')
                ).append(
                    $('<p/>').text(
                        'It might be worth checking your server logs.')
                )
            );
            // no more to be done without an extension list
            return;
        }

        for(var i in extension_list) {
            var extension = extension_list[i];
            var ext_id = ext_name_to_id(extension['Name']);

            console.log("Found extension:", extension.Name);

            var ext_row = $('<div>').addClass("row nbext-row");
            ext_row.appendTo(container);

            try {
                var col_right = $('<div>').addClass("col-xs-4 col-sm-6");
                col_right.appendTo(ext_row);

                // Extension icon
                if (extension.hasOwnProperty('Icon')) {
                    $('<div/>', {'class': 'nbext-icon'}).append(
                        $('<img>', {
                            'src': base_url + extension.url + '/' + extension['Icon'],
                            'alt': extension.Name + ' icon'
                        })
                    ).appendTo(col_right);
                }

                var col_left = $('<div/>').addClass("col-xs-8 col-sm-6");
                // put left col before right col
                col_left.prependTo(ext_row);

                // Extension name
                var ext_name_head = $('<div>', {'class': 'h3 nbext-title'});
                ext_name_head.text(extension.Name);
                ext_name_head.appendTo(col_left);

                // Extension compatibility & description
                var div_compat_and_desc = $('<div/>').addClass('nbext-desc');
                div_compat_and_desc.appendTo(col_left);

                if (extension.hasOwnProperty('Description')) {
                    div_compat_and_desc.append(
                        $('<p/>').text(extension['Description'])
                    );
                }

                if (extension.Link !== undefined) {
                    var link = extension.Link;
                    if (!/^(f|ht)tps?:\/\//i.test(link)) {
                        link = base_url + 'rendermd/' + extension['url'] +'/' + link;
                    }
                    link = $('<a>').attr('href', link).text('more...');
                    link.appendTo(div_compat_and_desc);
                }

                var span_compat_wrap = $('<div class="nbext-compat"/>');
                span_compat_wrap.text('compatibility: ');
                span_compat_wrap.appendTo(div_compat_and_desc);

                var compat = extension.Compatibility || "?.x";
                var span_compat = $('<span class="nbext-compat"/>');
                span_compat.text(compat);
                var is_compat = compat.toLowerCase().indexOf(
                    IPython.version.substring(0, 2) + 'x') >= 0;
                span_compat.addClass('nbext-compat-' + is_compat);
                if (!is_compat) ext_row.addClass('nbext-compat');
                span_compat.appendTo(span_compat_wrap);

                // Activate/Deactivate buttons
                build_activate_buttons(ext_id).appendTo(col_left);
                var ext_url = get_ext_url(extension);
                var active = false;
                if (config.data.hasOwnProperty('load_extensions')) {
                    active = (config.data.load_extensions[ext_url] === true);
                }
                set_buttons_active(ext_id, active);

                if (!extension.hasOwnProperty('Parameters')) continue;
                var params = extension['Parameters'];

                // Assemble and add params
                var div_param_list = $('<div/>', {'class' : 'nbext-params'});
                div_param_list.appendTo(col_left);

                    for (var pp in params) {
                        var param = params[pp];
                        var param_name = param.name;
                        if (!param_name) {
                            console.warn(
                                'Extension', extension.Name,
                                'declared a parameter without a name!');
                            continue;
                        }
                    console.log('Found ext param:', param_name);

                    var param_div = $('<div class="form-group"/>');
                    param_div.appendTo(div_param_list);

                    var param_id = param_id_prefix + param_name;

                    // use param name / description as label
                    $('<label/>', {'for' : param_id}).html(
                        param.hasOwnProperty('description') ? param['description'] : param_name
                    ).appendTo(param_div);

                    // input to configure the param
                    var input = build_param_input(param);
                    input.attr('id', param_id);
                    var prepend_input_types = ['checkbox'];
                    if (prepend_input_types.indexOf(param['input_type']) < 0) {
                        param_div.append(input);
                    }
                    else {
                        param_div.prepend(' ');
                        param_div.prepend(input);
                    }

                    // set input value from config or default, if poss
                    if (config.data.hasOwnProperty(param_name)) {
                        var configval = config.data[param_name];
                        console.log(
                            'ext parameter',
                            param_name,
                            'loaded from config as:',
                            configval);
                        set_input_value(input, configval);
                    }
                    else if (param.hasOwnProperty('default')) {
                        set_input_value(input, param['default']);
                    }
                }
            }
            catch (err) {
                ext_row.append(
                    $('<div class="alert alert-warning"/>')
                    .css('margin-top', '5px')
                    .append(
                        $('<p/>').text('error loading extension ' + ext_name)
                    )
                );
            }
        }

        var hide_incompat = true;
        if (config.data.hasOwnProperty('nbext_hide_incompat')) {
            hide_incompat = config.data['nbext_hide_incompat'];
            console.log(
                'nbext_hide_incompat loaded from config as: ',
                hide_incompat
            );
        }
        set_hide_incompat(hide_incompat);
    };

    /**
     * Add CSS file to page
     *
     * @param name filename
     */
    var add_css = function (name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    // finally, actually do the work
    add_css('/nbextensions/config/main.css');
    config.loaded.then(build_page);
    config.load();
    nbext_config_page.show();
});
