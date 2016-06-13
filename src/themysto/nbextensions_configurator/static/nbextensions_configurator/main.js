// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// Show notebook extension configuration

define([
    'jquery',
    'require',
    'base/js/namespace',
    'base/js/page',
    'base/js/utils',
    'services/config',
    'base/js/events',
    'notebook/js/quickhelp',
    'nbextensions/nbextensions_configurator/render/render',
    'nbextensions/nbextensions_configurator/kse_components',
    // only loaded, not used:
    'jqueryui',
    'bootstrap'
], function(
    $,
    require,
    Jupyter,
    page,
    utils,
    configmod,
    events,
    quickhelp,
    rendermd,
    kse_comp
) {
    'use strict';

    var base_url = utils.get_body_data('baseUrl');
    var first_load_done = false; // flag used to not push history on first load
    var extensions_dict = {}; // dictionary storing extensions by their 'require' value

    /**
     * create configs var from json files on server.
     * we still need to call configs[].load later to actually fetch them though!
     */
    var configs = {
        'notebook' : new configmod.ConfigSection('notebook', {base_url: base_url}),
        'edit' : new configmod.ConfigSection('edit', {base_url: base_url}),
        'tree' : new configmod.ConfigSection('tree', {base_url: base_url}),
        'common'   : new configmod.ConfigSection('common', {base_url: base_url}),
    };

    // the prefix added to all parameter input id's
    var param_id_prefix = 'input_';

    /**
     * check whether a dot-notation key exists in a given ConfigSection object
     *
     * @param {ConfigSection} conf - the config section to query
     * @param {string} key - the (dot-notation) key to check for
     * @return {Boolean} - `true` if the key exists, `false` otherwise
     */
    function conf_dot_key_exists(conf, key) {
        var obj = conf.data;
        key = key.split('.');
        while (key.length > 0) {
            var partkey = key.shift();
            if (!obj.hasOwnProperty(partkey)) {
                return false;
            }
            obj = obj[partkey];
        }
        return true;
    }

    /**
     * get the value for a dot-notation key in a given ConfigSection object
     *
     * @param {ConfigSection} conf - the config section to query
     * @param {string} key - the (dot-notation) key to get the value of
     * @return - the value associated with the given key
     */
    function conf_dot_get (conf, key) {
        var obj = conf.data;
        key = key.split('.');
        while (key.length > 0) {
            obj = obj[key.shift()];
        }
        return obj;
    }

    /**
     * update the value for a dot-notation key in a given ConfigSection object
     *
     * @param {ConfigSection} conf - the config section to update
     * @param {string} key - the (dot-notation) key to update the value of
     * @param value - the new value to set. null results in removal of the key
     * @return - the return value of the ConfigSection.update call
     */
    function conf_dot_update (conf, key, value) {
        key = key.split('.');
        var root = {};
        var curr = root;
        while (key.length > 1) {
            curr = curr[key.shift()] = {};
        }
        curr[key.shift()] = value;
        return conf.update(root);
    }

    /**
     * Remove the value for a dot-notation key in a given ConfigSection object.
     *
     * @param {ConfigSection} conf - the config section to update
     * @param {string[]} dotted_keys - the (dot-notation) keys to remove
     */
    function conf_dot_delete_keys(conf, dotted_keys) {
        return conf.load().then(function (data) {
            for (var ii=0; ii < dotted_keys.length; ii++) {
                var obj = data;
                var key_parts = dotted_keys[ii].split('.');
                while (key_parts.length > 0) {
                    var partkey = key_parts.shift();
                    if (key_parts.length === 0) {
                        delete obj[partkey];
                        break;
                    }
                    if (!obj.hasOwnProperty(partkey)) {
                        break;
                    }
                    obj = obj[partkey];
                }
            }
            // Modify the config values stored by calling api directly
            // (set endpoint isn't yet implemented in js class)
            return utils.promising_ajax(conf.api_url(), {
                processData: false,
                type : "PUT",
                data: JSON.stringify(data),
                dataType : "json",
                contentType: 'application/json',
            });
        });
    }

    /**
     * Update server's json config file to reflect changed enable state
     */
    function set_config_enabled (extension, state) {
        state = state === undefined ? true : state;
        console.log('Notebook extension "' + extension.Name + '"', state ? 'enabled' : 'disabled');
        var to_load = {};
        to_load[extension.require] = (state ? true : null);
        configs[extension.Section].update({load_extensions: to_load});
    }

    /**
     * Update buttons to reflect changed enable state
     */
    function set_buttons_enabled (extension, state) {
        state = (state === true);

        extension.selector_link.find('.nbext-enable-toggle').toggleClass('nbext-enabled', state);

        var btns = $(extension.ui).find('.nbext-enable-btns').children();
        btns.eq(0)
            .prop('disabled', state)
            .toggleClass('btn-default disabled', state)
            .toggleClass('btn-primary', !state);
        btns.eq(1)
            .prop('disabled', !state)
            .toggleClass('btn-default disabled', !state)
            .toggleClass('btn-primary', state);
    }

    /**
     * Handle button click event to enable/disable extension
     */
    function handle_buttons_click (evt) {
        var btn = $(evt.target);
        var state = btn.is(':first-child');
        var extension = btn.closest('.nbext-ext-row').data('extension');
        set_buttons_enabled(extension, state);
        set_config_enabled(extension, state);
    }

    /*
     * Get the useful value (dependent on element type) from an input element
     */
    function get_input_value (input) {
        input = $(input);
        var input_type = input.data('param_type');

        switch (input_type) {
            case 'hotkey':
                return input.find('.hotkey').data('pre-humanized');
            case 'list':
                var val = [];
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
    }

    /*
     * Set the useful value (dependent on element type) from a js value
     */
    function set_input_value (input, new_value) {
        input = $(input);
        var input_type = input.data('param_type');
        switch (input_type) {
            case 'hotkey':
                input.find('.hotkey')
                    .html(quickhelp.humanize_sequence(new_value))
                    .data('pre-humanized', new_value);
                break;
            case 'list':
                var ul = input.children('ul');
                ul.empty();
                var list_element_param = input.data('list_element_param');
                for (var ii = 0; ii < new_value.length; ii++) {
                    var list_element_input = build_param_input(list_element_param);
                    list_element_input.on('change', handle_input);
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
    }

    /**
     * handle form input for extension parameters, updating parameters in
     * server's json config file
     */
    function handle_input (evt) {
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
        var configsection = input.data('section');
        console.log(configsection + '.' + configkey, '->', configval);
        conf_dot_update(configs[configsection], configkey, configval);
        return configval;
    }

    /**
     * wrap a single list-element input with the <li>, and move/remove buttons
     */
    function wrap_list_input (list_input) {
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
    }

    /**
     * Build and return an element used to edit a parameter
     */
    function build_param_input (param) {
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
                            type: 'button',
                            class: 'btn btn-primary',
                            text: 'Change'
                        }).on('click', function() {
                            var description = 'Change ' +
                                param.description +
                                ' from ' +
                                quickhelp.humanize_sequence(get_input_value(input)) +
                                ' to:';
                            var modal = kse_comp.KSE_modal({
                                'description': description,
                                'buttons': {
                                    'OK': {
                                        'class': 'btn-primary',
                                        'click': function () {
                                            var editor = $(this).find('#kse-editor');
                                            var new_value = (editor.data('kse_sequence') || []).join(',');
                                            set_input_value(input, new_value);
                                            // trigger write to config
                                            input.find('.hotkey').change();
                                        }
                                    },
                                    'Cancel': {}
                                },
                            });
                            modal.modal('show');
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
                            wrap_list_input(
                                build_param_input(list_element_param)
                                    .on('change', handle_input)
                            )
                        ).closest('.nbext-list-wrap').change();
                    });
                input.append($('<div class="input-group"/>').append(add_button));
                break;
            case 'textarea':
                input = $('<textarea/>');
                break;
            case 'number':
                input = $('<input/>', {'type': input_type});
                if (param.step !== undefined) input.attr('step', param.step);
                if (param.min !== undefined) input.attr('min', param.min);
                if (param.max !== undefined) input.attr('max', param.max);
                break;
            default:
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
        input.data('section', param.section);
        var non_form_control_input_types = ['checkbox', 'list', 'hotkey'];
        if (non_form_control_input_types.indexOf(input_type) < 0) {
            input.addClass('form-control');
        }
        return input;
    }

    /*
     * Build and return a div containing the buttons to enable/disable an
     * extension with the given id.
     */
    function build_enable_buttons () {
        var div_buttons = $('<div class="btn-group nbext-enable-btns"/>');

        $('<button/>')
            .text('Enable')
            .attr('type', 'button')
            .addClass('btn btn-primary')
            .on('click', handle_buttons_click)
            .appendTo(div_buttons);

        $('<button/>')
            .text('Disable')
            .attr('type', 'button')
            .addClass('btn btn-default')
            .on('click', handle_buttons_click)
            .prop('disabled', true)
            .appendTo(div_buttons);

        return div_buttons;
    }

    /**
     * show/hide compatibility text, along with en/disabling the nav link
     */
    function set_hide_incompat (hide_incompat) {
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
    }

    /**
     * if the extension's readme is a relative url with extension .md,
     *     render the referenced markdown file
     * otherwise
     *     add an anchor element to the extension's description
     */
    function load_readme (extension) {
        var readme_div = $('.nbext-readme .nbext-readme-contents').empty();
        var readme_title = $('.nbext-readme > h3').empty();
        if (!extension.readme) return;

        var url = extension.readme;
        var is_absolute = /^(f|ht)tps?:\/\//i.test(url);
        if (is_absolute || (utils.splitext(url)[1] !== '.md')) {
            // provide a link only
            var desc = extension.ui.find('.nbext-desc');
            var link = desc.find('.nbext-readme-more-link');
            if (link.length === 0) {
                desc.append(' ');
                link = $('<a/>')
                    .addClass('nbext-readme-more-link')
                    .text('more...')
                    .attr('href', url)
                    .appendTo(desc);
            }
            return;
        }
        // relative urls are in nbextensions namespace
        url = require.toUrl(
            utils.url_path_join(
                base_url, 'nbextensions', utils.encode_uri_components(url)));
        readme_title.text(url);
        // add rendered markdown to readme_div. Use pre-fetched if present
        if (extension.readme_content) {
            rendermd.render_markdown(extension.readme_content, url)
                .addClass('rendered_html')
                .appendTo(readme_div);
            return;
        }
        $.ajax({
            url: url,
            dataType: 'text',
            success: function (md_contents) {
                rendermd.render_markdown(md_contents, url)
                    .addClass('rendered_html')
                    .appendTo(readme_div);
                // We can't rely on picking up the rendered html,
                // since render_markdown returns
                // before the actual rendering work is complete
                extension.readme_content = md_contents;
                // attempt to scroll to a location hash, if there is one.
                var hash = window.location.hash.replace(/^#/, '');
                if (hash) {
                    // Allow time for markdown to render
                    setTimeout( function () {
                        // use filter to avoid breaking jQuery selector syntax with weird id
                        var hdr = readme_div.find(':header').filter(function (idx, elem) {
                            return elem.id === hash;
                        });
                        if (hdr.length > 0) {
                            var site = $('#site');
                            var adjust = hdr.offset().top - site.offset().top;
                            if (adjust > 0) {
                                site.animate(
                                    {scrollTop: site.scrollTop() + adjust},
                                    undefined, // time
                                    undefined, // easing function
                                    function () {
                                        if (hdr.effect !== undefined) {
                                            hdr.effect('highlight', {color: '#faf2cc'});
                                        }
                                    }
                                );
                            }
                        }
                    }, 100);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var error_div = $('<div class="text-danger bg-danger"/>')
                    .text(textStatus + ' : ' + jqXHR.status + ' ' + errorThrown)
                    .appendTo(readme_div);
                if (jqXHR.status === 404) {
                    $('<p/>')
                        .text('no markdown file at ' + url)
                        .appendTo(error_div);
                }
            }
        });
    }

    /**
     * open the user interface the extension corresponding to the given
     * link
     * @param extension the extension
     * @param opts options for the reveal animation
     */
    function open_ext_ui (extension, opts) {
        var default_opts = {duration: 100};
        opts = $.extend(true, {}, default_opts, opts);

        /**
         * Set window search string to allow reloading settings for a given
         * extension.
         * Use history.pushState if available, to avoid reloading the page
         */
        var new_search = '?nbextension=' + utils.encode_uri_components(extension.require);
        if (first_load_done) {
            if (window.history.pushState) {
                window.history.pushState(extension.require, undefined, new_search);
            }
            else {
                window.location.search = new_search;
            }
        }
        first_load_done = true;

        // ensure extension.ui exists
        if (extension.ui === undefined) {
            // use display: none since hide(0) doesn't do anything
            // for elements that aren't yet part of the DOM
            extension.ui = build_extension_ui(extension)
                .css('display', 'none')
                .insertBefore('.nbext-readme');

            var ext_enabled = extension.selector_link.find('.nbext-enable-toggle').hasClass('nbext-enabled');
            set_buttons_enabled(extension, ext_enabled);
        }

        $('.nbext-selector li')
            .removeClass('active');
        extension.selector_link.closest('li').addClass('active');

        $('.nbext-ext-row')
            .not(extension.ui)
            .slideUp(default_opts);
        extension.ui.slideDown(opts);
        load_readme(extension);
    }

    /**
     * Callback for the nav links
     * open the user interface the extension corresponding to the clicked
     * link, and scroll it into view
     */
    function selector_nav_link_callback (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        var a = $(evt.currentTarget);
        var extension = a.data('extension');
        if (a.closest('li').hasClass('disabled')) {
            return;
        }
        open_ext_ui(extension, {
            complete: function () {
                // scroll to ensure at least title is visible
                var site = $('#site');
                var title = extension.ui.children('h3:first');
                var adjust = (title.offset().top - site.offset().top) + (2 * title.outerHeight(true) - site.innerHeight());
                if (adjust > 0) {
                    site.animate({scrollTop: site.scrollTop() + adjust});
                }
            }
        });
    }

    /**
     * Callback for the nav links' enable checkboxes
     */
    function selector_checkbox_callback (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        var a = $(evt.currentTarget).closest('a');
        if (!a.closest('li').hasClass('disabled')) {
            var extension = a.data('extension');
            var state = !$(evt.currentTarget).hasClass('nbext-enabled');
            set_buttons_enabled(extension, state);
            set_config_enabled(extension, state);
            open_ext_ui(extension);
        }
    }

    /**
     * delete all of the values for an extension's parameters from the config,
     * then rebuild their ui elements, to give default values.
     */
    function reset_params (extension) {
        // first remove config values:
        return conf_dot_delete_keys(

            configs[extension.Section],
            extension.Parameters.map(function (param) {
                return param.name;
            })
        ).then(function () {
            // now rebuild param ui
            extension.ui.find('.nbext-params > .list-group')
                .replaceWith(build_params_ui(extension.Parameters));
        });
    }

    /**
     * Callback for the rest parameters control
     */
    function reset_params_callback (evt) {
        var btn = $(evt.target);
        if (btn.children('.fa').length < 1) {
            btn.addClass('disabled');
            btn.children('.fa').addClass('fa-spin');
        }
        var extension = btn.closest('.nbext-ext-row').data('extension');
        reset_params(extension).then(function () {
            btn.removeClass('disabled');
            btn.children('.fa').removeClass('fa-spin');
        });
    }

    /**
     * build and return UI elements for a set of parameters
     */
    function build_params_ui (params) {
        // Assemble and add params
        var div_param_list = $('<div/>')
            .addClass('list-group');

        for (var pp in params) {
            var param = params[pp];
            var param_name = param.name;
            if (!param_name) {
                console.error('nbext param: unnamed parameter declared!');
                continue;
            }

            var param_div = $('<div/>')
                .addClass('form-group list-group-item')
                .appendTo(div_param_list);

            var param_id = param_id_prefix + param_name;

            // use param name / description as label
            $('<label/>')
                .attr('for', param_id)
                .html(
                    param.hasOwnProperty('description') ? param.description : param_name
                )
                .appendTo(param_div);

            // input to configure the param
            var input = build_param_input(param);
            input.on('change', handle_input);
            input.attr('id', param_id);
            var prepend_input_types = ['checkbox'];
            if (prepend_input_types.indexOf(param.input_type) < 0) {
                param_div.append(input);
            }
            else {
                param_div.prepend(' ');
                param_div.prepend(input);
            }

            // set input value from config or default, if poss
            if (conf_dot_key_exists(configs[param.section], param_name)) {
                var configval = conf_dot_get(configs[param.section], param_name);
                console.log(
                    'nbext param:', param_name,
                    'from config:', configval
                );
                set_input_value(input, configval);
            }
            else if (param.hasOwnProperty('default')) {
                set_input_value(input, param.default);
                console.log(
                    'nbext param:', param_name,
                    'default:', param.default
                );
            }
            else {
                console.log('nbext param:', param_name);
            }
        }
        return div_param_list;
    }

    /**
     * build and return UI elements for a single extension
     */
    function build_extension_ui (extension) {
        var ext_row = $('<div/>')
            .data('extension', extension)
            .addClass('row nbext-ext-row');

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

            /**
             * Columns
             */
            var col_left = $('<div/>')
                .addClass('col-xs-12')
                .appendTo(ext_row);

            // Icon
            if (extension.icon) {
                col_left
                    .addClass('col-sm-8 col-sm-pull-4 col-md-6 col-md-pull-6');
                // right precedes left in markup, so that it appears first when
                // the columns are wrapped each onto a single line.
                // The push and pull CSS classes are then used to get them to
                // be left/right correctly when next to each other
                var col_right = $('<div>')
                    .addClass('col-xs-12 col-sm-4 col-sm-push-8 col-md-6 col-md-push-6')
                    .insertBefore(col_left);
                $('<div/>')
                    .addClass('nbext-icon')
                    .append(
                        $('<img>')
                            .attr({
                                // extension.icon is in nbextensions namespace
                                'src': utils.url_path_join(base_url, 'nbextensions', utils.encode_uri_components(extension.icon)),
                                'alt': extension.Name + ' icon'
                            })
                    )
                    .appendTo(col_right);
            }

            // Duplicate warning
            if (extension.duplicate) {
                var duplicate_warning_p = $('<p/>').text(
                    'This extension\'s require url (' + extension.require + ') ' +
                    'is referenced by two different yaml files on the server. ' +
                    'This probably means that there are two installations ' +
                    'of the same extension in different directories. ' +
                    'If they are different, this may prevent configuration ' +
                    'from working correctly. ' +
                    'Check the jupyter server log for ' +
                    'the paths of the relevant yaml files.');
                $('<div/>')
                    .addClass('alert alert-warning')
                    .css('margin-top', '5px')
                    .append(duplicate_warning_p)
                    .appendTo(ext_row);
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

            // Compatibility
            var compat_txt = extension.Compatibility || '?.x';
            var compat_idx = compat_txt.toLowerCase().indexOf(
                Jupyter.version.substring(0, 2) + 'x');
            if (!extension.is_compatible) {
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

            // Enable/Disable buttons
            build_enable_buttons().appendTo(col_left);

            // Parameters
            if (extension.Parameters.length > 0) {
                for (var ii = 0; ii < extension.Parameters.length; ii++) {
                    extension.Parameters[ii].section = extension.Section;
                }
                var reset_control = $('<a/>')
                    .addClass('nbext-params-reset')
                    .on('click', reset_params_callback)
                    .addClass('pull-right')
                    .attr('href', '#')
                    .text(' reset');
                $('<i/>')
                    .addClass('fa fa-refresh')
                    .addClass()
                    .prependTo(reset_control);
                $('<div/>')
                    .addClass('panel panel-default nbext-params col-xs-12')
                    .append(
                        $('<div/>')
                            .addClass('panel-heading')
                            .text('Parameters')
                            .append(reset_control)
                    )
                    .append(
                        build_params_ui(extension.Parameters)
                    )
                    .appendTo(ext_row);
            }
        }
        catch (err) {
            console.error('nbext error loading extension', extension.Name);
            console.error(err);
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
    }

    /**
     * build html body listing all extensions.
     */
    function build_page () {
        add_css('./main.css');

        var nbext_config_page = Jupyter.page = new page.Page();

        // prepare for rendermd usage
        rendermd.add_markdown_css();

        build_param_input({
            input_type: 'checkbox',
            section: 'common'
        })
            .attr('id', param_id_prefix + 'nbext_hide_incompat')
            .on('change', function (evt) {
                set_hide_incompat(handle_input(evt));
            })
            .prependTo('.nbext-showhide-incompat');

        nbext_config_page.show_header();
        events.trigger('resize-header.Page');

        var config_promises = [];
        for (var section in configs) {
            config_promises.push(configs[section].loaded);
            configs[section].load();
        }
        Promise.all(config_promises).then(function () {
            build_extension_list();
            nbext_config_page.show();
        });

        return nbext_config_page;
    }

    /**
     * Callback for the window.popstate event, used to handle switching to the
     * correct selected extension
     */
    function popstateCallback (evt) {
        var require_url;
        if (evt === undefined) {
            // attempt to select an extension specified by a URL search parameter
            var queries = window.location.search.replace(/^\?/, '').split('&');
            for (var ii = 0; ii < queries.length; ii++) {
                var keyValuePair = queries[ii].split('=');
                if (decodeURIComponent(keyValuePair[0]) === 'nbextension') {
                    require_url = decodeURIComponent(keyValuePair[1]);
                    break;
                }
            }
        }
        else if (evt.state === null) {
            return; // as a result of setting window.location.hash
        }
        else {
            require_url = evt.state;
        }
        var selected_link;
        if (extensions_dict[require_url] === undefined || extensions_dict[require_url].selector_link.hasClass('disabled')) {
            selected_link = $('.nbext-selector').find('li:not(.disabled)').last().children('a');
        }
        else {
            selected_link = extensions_dict[require_url].selector_link;
        }
        selected_link.click();
    }

    /**
     * build html body listing all extensions.
     *
     * Since this function uses the contents of config.data,
     * it should only be called after config.load() has been executed
     */
    function build_extension_list () {
        // get list of extensions from body data supplied by the python backend
        var extension_list = $('body').data('extension-list') || [];
        // add enabled-but-unconfigurable extensions to the list
        // construct a set of enabled extension urls from the configs
        // this is used later to add unconfigurable extensions to the list
        var unconfigurable_enabled_extensions = {};
        var section;
        for (section in configs) {
            unconfigurable_enabled_extensions[section] = $.extend({}, configs[section].data.load_extensions);
        }
        var i, extension;
        for (i = 0; i < extension_list.length; i++) {
            extension = extension_list[i];
            extension.Section = (extension.Section || 'notebook').toString();
            extension.Name = (extension.Name || (extension.Section + ':' + extension.require)).toString();
            // extension *is* configurable
            delete unconfigurable_enabled_extensions[extension.Section][extension.require];
        }
        // add any remaining unconfigurable extensions as stubs
        for (section in configs) {
            for (var require_url in unconfigurable_enabled_extensions[section]) {
                extension_list.push({
                    Name: section + ' : ' + require_url,
                    Description: 'This extension is enabled in the ' + section + ' json config, ' +
                        "but doesn't provide a yaml file to tell us how to configure it. " +
                        "You can disable it from here, but if you do, it won't show up in " +
                        'this list again after you reload the page.',
                    Section: section,
                    require: require_url,
                    unconfigurable: true,
                });
            }
        }

        var container = $('#site > .container');

        var selector = $('.nbext-selector');
        var cols = selector.find('ul');

        // sort extensions alphabetically
        extension_list.sort(function (a, b) {
            var an = (a.Name || '').toLowerCase();
            var bn = (b.Name || '').toLowerCase();
            if (an < bn) return -1;
            if (an > bn) return 1;
            return 0;
        });

        // fill the columns with nav links
        var col_length = Math.ceil(extension_list.length / cols.length);
        for (i = 0; i < extension_list.length; i++) {
            extension = extension_list[i];
            extensions_dict[extension.require] = extension;
            console.log('Notebook extension "' + extension.Name + '" found');

            extension.is_compatible = (extension.Compatibility || '?.x').toLowerCase().indexOf(
                Jupyter.version.substring(0, 2) + 'x') >= 0;
            extension.Parameters = extension.Parameters || [];
            if (!extension.is_compatible) {
                // reveal the checkbox since we've found an incompatible nbext
                $('.nbext-showhide-incompat').show();
            }
            extension.selector_link = $('<a/>')
                .attr('href', '#')
                .data('extension', extension)
                .html(extension.Name)
                .toggleClass('text-warning bg-warning', extension.unconfigurable === true)
                .prepend(
                    $('<i>')
                        .addClass('fa fa-fw nbext-enable-toggle')
                );
            $('<li/>')
                .toggleClass('nbext-incompatible', !extension.is_compatible)
                .append(extension.selector_link)
                .appendTo(cols[Math.floor(i / col_length)]);

            var ext_enabled = false;
            var conf = configs[extension.Section];
            if (conf === undefined) {
                console.error("nbextension '" + extension.Name + "' specifies unknown Section of '" + extension.Section + "'. Can't determine enable status.");
            }
            else if (conf.data.hasOwnProperty('load_extensions')) {
                ext_enabled = (conf.data.load_extensions[extension.require] === true);
            }
            set_buttons_enabled(extension, ext_enabled);
        }
        // attach click handlers
        $('.nbext-enable-toggle')
            .on('click', selector_checkbox_callback)
            .closest('a')
            .on('click', selector_nav_link_callback);

        // en/disable incompatible extensions
        var hide_incompat = true;
        if (configs['common'].data.hasOwnProperty('nbext_hide_incompat')) {
            hide_incompat = configs['common'].data.nbext_hide_incompat;
            console.log(
                'nbext_hide_incompat loaded from config as: ',
                hide_incompat
            );
        }
        set_hide_incompat(hide_incompat);

        window.addEventListener('popstate', popstateCallback);
        setTimeout(popstateCallback, 0);
    }

    /**
     * Add CSS file to page
     *
     * @param name filename
     */
    function add_css (name) {
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = require.toUrl(name);
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    return {
        build_page : build_page
    };
});
