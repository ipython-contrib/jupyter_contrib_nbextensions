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
    'base/js/events',
    'nbextensions/config/hotkey_editor'
], function(
    $,
    require,
    IPython,
    page,
    utils,
    configmod,
    events,
    hke
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
                    'nbext', state ? ' enable:' : 'disable:' , ext_name );
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

        $('a[href=#' + ext_id + '] > .nbext-active-toggle').toggleClass('nbext-activated', state);

        $('#' + ext_id + '-on')
            .prop('disabled', state)
            .toggleClass('btn-default disabled', state)
            .toggleClass('btn-primary', !state);
        $('#' + ext_id + '-off')
            .prop('disabled', !state)
            .toggleClass('btn-default disabled', !state)
            .toggleClass('btn-primary', state);
    };

    /**
     * Handle button click event to activate/deactivate extension
     */
    var handle_buttons_click = function(evt) {
        // endswith
        var suffix = '-on';
        var state = this.id.indexOf(suffix, this.id.length - suffix.length) !== -1;
        var end = this.id.length - suffix.length - Number(!state);
        var ext_id = this.id.substring(0, end);
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
            case 'hotkey':
                return input.find('.hotkey').data('pre-humanized');
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
            case 'hotkey':
                input.find('.hotkey')
                    .html(hke.humanize_shortcut(new_value))
                    .data('pre-humanized', new_value);
                break;
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
        if (input.closest('.nbext-list-wrap').length > 0) {
            input = input.closest('.nbext-list-wrap');
        }
        // hotkeys need to find the correct tag
        else if (input.hasClass('hotkey')) {
            input = input.closest('.input-group');
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
            case 'hotkey':
                input = $('<div class="input-group"/>');
                input.append(
                    $('<span class="form-control form-control-static hotkey"/>')
                        .css(utils.platform === 'MasOS' ? {'letter-spacing': '1px'} : {})
                );
                input.append($('<div class="input-group-btn"/>').append(
                    $('<div class="btn-group"/>').append(
                        $('<a/>', {
                            type:'button',
                            class: "btn btn-primary",
                            text: 'Change'
                        }).on('click', function() {
                            hke.HotkeyEditor({
                                on_successful_close: function (new_value) {
                                    set_input_value(input, new_value);
                                    // trigger write to config
                                    input.find('.hotkey').change();
                                }
                            });
                        })
                    )
                ));
                break;
            case 'list':
                input = $('<div/>', {'class' : 'nbext-list-wrap'});
                input.append(
                    $('<ul/>', {'class': 'list-unstyled'})
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
                var add_button = $('<a/>')
                    .addClass('btn btn-default input-group-btn nbext-list-btn-add')
                    .append($('<i/>', {'class': 'fa fa-plus'}).text(' new item'))
                    .on('click', function () {
                        $(this).parent().siblings('ul').append(
                            wrap_list_input(build_param_input(list_element_param))
                        ).closest('.nbext-list-wrap').change();
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
        var non_form_control_input_types = ['checkbox', 'list', 'hotkey'];
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
        var div_buttons = $('<div class="btn-group nbext-activate-btns"/>');

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
        $('.nbext-compat-div').toggle(!hide_incompat);
        $('.nbext-selector .nbext-incompatible')
            .toggleClass('disabled', hide_incompat)
            .attr('title', hide_incompat ? 'possibly incompatible' : '');
        set_input_value(
            $('#' + param_id_prefix + 'nbext_hide_incompat'), hide_incompat);

        var selector = $('.nbext-selector');
        if (selector.find('li.active').first().hasClass('disabled')) {
            selector.find('li:not(.disabled) a').first().click();
        }
    };

    /*
     * build html body listing all extensions.
     *
     * Since this function uses the contents of config.data,
     * it should only be called after config.load() has been executed
     */
    var build_page = function() {
        var container = $("#site > .container");

        var selector = $('<div>')
            .addClass('nbext-selector container-fluid')
            .append(
                $('<h4/>').text('Configurable extensions')
            )
            .appendTo(container);

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
                var an = (a.Name || '').toLowerCase();
                var bn = (b.Name || '').toLowerCase();
                if (an < bn) return -1;
                if (an > bn) return 1;
                return 0;
            });
        }
        catch (err) {
            console.error('nbext: error loading extension json data!');
            $('<div/>')
                .addClass('alert alert-danger')
                .css('margin', '2em')
                .append(
                    $('<h3/>')
                        .text('error loading extension json data!')
                ).append(
                    $('<p/>')
                        .text('It might be worth checking your server logs, or the browser javascript console.')
                )
                .appendTo(container);
            // no more to be done without an extension list
            return;
        }

        // make columns to hold the nav links to each extension
        var i, num_cols = 4, cols = [];
        var col_class = 'col-md-' + Math.floor(12 / num_cols);
        var row = $('<nav/>')
            .addClass('row')
            .appendTo(selector);
        for (i=0; i < num_cols; i++) {
            cols.push(
                $('<ul/>')
                    .addClass('nav nav-pills nav-stacked ' + col_class)
                    .appendTo(row)
            );
        }

        var open_ext_ui = function(a, opts) {
            var li = a.closest('li');
            var ext_ui = $(a.attr('href'));
            if (li.hasClass('disabled')) return false;
            selector.find('li').removeClass('active');
            li.addClass('active');
            container
                .children('.row')
                .not(ext_ui)
                .not(selector)
                .slideUp();
            ext_ui.slideDown(opts);
        };

        var open_ext_ui_and_scroll = function () {
            var a = $(this);
            var ext_ui = $(a.attr('href'));
            open_ext_ui(a, {
                complete: function () { ext_ui.scrollTop(); }
            });
        };

        var toggle_activity = function () {
            var a = $(this).closest('a');
            var li = a.closest('li');
            if (!li.hasClass('disabled')) {
                var ext_id = a.attr('href').replace('#', '');
                var state = !$(this).hasClass('nbext-activated');
                set_buttons_active(ext_id, state);
                set_config_active(ext_id, state);
            }
            open_ext_ui(a);
            return false;
        };

        // fill the columns with nav links, also building UI elements
        var col_length = Math.ceil(extension_list.length / num_cols);
        for (i in extension_list) {
            var extension = extension_list[i];
            console.log("nbext extension:", extension.Name);
            var ext_id = ext_name_to_id(extension.Name);
            var ext_ui = build_extension_ui(extension);
            ext_ui.hide();
            container.append(ext_ui);
            $('<li/>')
                .toggleClass('nbext-incompatible', ext_ui.hasClass('nbext-incompatible'))
                .append(
                    $('<a/>')
                        .attr('href', '#' + ext_id)
                        .html(extension.Name)
                        .click(open_ext_ui_and_scroll)
                        .prepend(
                            $('<i>')
                                .addClass('fa fa-fw nbext-active-toggle')
                                .click(toggle_activity)
                        )
                )
                .appendTo(cols[Math.floor(i / col_length)]);

            var ext_url = get_ext_url(extension);
            var ext_active = false;
            if (config.data.hasOwnProperty('load_extensions')) {
                ext_active = (config.data.load_extensions[ext_url] === true);
            }
            set_buttons_active(ext_id, ext_active);
        }

        // en/disable incompatible extensions
        var hide_incompat = true;
        if (config.data.hasOwnProperty('nbext_hide_incompat')) {
            hide_incompat = config.data['nbext_hide_incompat'];
            console.log(
                'nbext_hide_incompat loaded from config as: ',
                hide_incompat
            );
        }
        set_hide_incompat(hide_incompat);

        /**
         * attempt to select an extension specified by a URL hash
         * for hash-related stuff, see
         * http://stackoverflow.com/questions/1822598
         * noting especially the potential for arbitrary code execution if
         * hashes are passed directly into $()
         */
        var hash = window.location.hash.replace('#', '');
        var link;
        if (hash) {
            link = $('body').find('a[href="#' + hash + '"]:first');
            if (link.closest('li').hasClass('disabled')) link = undefined;
        }
        if (!link) {
            // select the first non-disabled extension
            link = selector.find('li:not(.disabled) a').first();
            hash = link.attr('href').replace('#', '');
        }
        link.click();
    };

    var build_extension_ui = function(extension) {
        var ext_id = ext_name_to_id(extension.Name);
        var ext_row = $('<div/>')
            .attr('id', ext_id)
            .addClass('row');

        try {
            /**
             * Name.
             * Take advantage of column wrapping by using the col-xs-12 class
             * to ensure the name takes up a whole row-width on its own,
             * so that the subsequent columns wrap onto a new line.
             */
            var ext_name_head = $('<h3>')
                .addClass('col-xs-12')
                .html(extension.Name)
                .appendTo(ext_row);

            // Columns
            var col_right = $('<div>')
                .addClass("col-xs-12 col-sm-4 col-sm-push-8 col-md-6 col-md-push-6")
                .appendTo(ext_row);
            var col_left = $('<div/>')
                .addClass("col-xs-12 col-sm-8 col-sm-pull-4 col-md-6 col-md-pull-6")
                .appendTo(ext_row);

            // Icon
            if (extension.hasOwnProperty('Icon')) {
                $('<div/>')
                    .addClass('nbext-icon')
                    .append(
                        $('<img>')
                            .attr({
                                'src': base_url + extension.url + '/' + extension['Icon'],
                                'alt': extension.Name + ' icon'
                            })
                    )
                    .appendTo(col_right);
            }

            // Description
            var div_desc = $('<div/>')
                .addClass('nbext-desc')
                .appendTo(col_left);
            if (extension.hasOwnProperty('Description')) {
                $('<p/>')
                    .html(extension.Description)
                    .appendTo(div_desc);
            }
            if (extension.Link !== undefined) {
                var link = extension.Link;
                // add correct rendering URL prefix for non-absolute links
                if (!/^(f|ht)tps?:\/\//i.test(link)) {
                    link = base_url + 'nbextensions/config/rendermd/' + extension['url'] +'/' + link;
                }
                $('<a>')
                    .attr('href', link)
                    .text('more...')
                    .appendTo(div_desc);
            }

            // Compatibility
            var compat_txt = extension.Compatibility || "?.x";
            var compat_idx = compat_txt.toLowerCase().indexOf(
                IPython.version.substring(0, 2) + 'x');
            var is_compat = compat_idx >= 0;
            if (!is_compat) {
                ext_row.addClass('nbext-incompatible');
                compat_txt = $('<span/>')
                    .addClass('bg-danger text-danger')
                    .text(compat_txt);
            }
            else {
                compat_txt = $('<span/>')
                    .append(
                        compat_txt.substring(0, compat_idx)
                    )
                    .append(
                        $('<span/>')
                            .addClass('bg-success text-success')
                            .text(compat_txt.substring(compat_idx, compat_idx + 3))
                    )
                    .append(compat_txt.substring(compat_idx + 3, compat_txt.length));
            }
            $('<div/>')
                .addClass('nbext-compat-div')
                .text('compatibility: ')
                .append(compat_txt)
                .appendTo(col_left);

            // Activate/Deactivate buttons
            build_activate_buttons(ext_id).appendTo(col_left);

            // Parameters
            if (extension.hasOwnProperty('Parameters')) {
                $('<div/>')
                    .addClass('panel panel-default nbext-params')
                    .append(
                        $('<div/>')
                            .addClass('panel-heading')
                            .text('Parameters')
                    )
                    .append(
                        build_params_ui(extension.Parameters)
                    )
                    .appendTo(col_left);
            }
        }
        catch (err) {
            console.error('nbext error loading extension:', extension.Name);
            $('<div/>')
                .addClass('alert alert-warning')
                .css('margin-top', '5px')
                .append(
                    $('<p/>')
                        .text('error loading extension ' + extension.Name)
                )
                .appendTo(ext_row);
        }
        finally {
            return ext_row;
        }
    };

    var build_params_ui = function(params) {
        // Assemble and add params
        var div_param_list = $('<div/>')
            .addClass('list-group');

        for (var pp in params) {
            var param = params[pp];
            var param_name = param.name;
            if (!param_name) {
                console.warn('nbext param unnamed:', extension.Name);
                continue;
            }
            console.log('nbext param:', param_name);

            var param_div = $('<div/>')
                .addClass('form-group list-group-item')
                .appendTo(div_param_list);

            var param_id = param_id_prefix + param_name;

            // use param name / description as label
            $('<label/>')
                .attr('for', param_id)
                .html(
                    param.hasOwnProperty('description') ? param['description'] : param_name
                )
                .appendTo(param_div);

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
                    'nbext param:', param_name,
                    'from config:', configval
                );
                set_input_value(input, configval);
            }
            else if (param.hasOwnProperty('default')) {
                set_input_value(input, param['default']);
                console.log(
                    'nbext param:', param_name,
                    'default:', param['default']
                );
            }
        }

        return div_param_list;
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
