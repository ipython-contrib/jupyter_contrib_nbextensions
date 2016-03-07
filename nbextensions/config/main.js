// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// Show notebook extension configuration

define([
    'jqueryui',
    'require',
    'base/js/namespace',
    'base/js/page',
    'base/js/utils',
    'services/config',
    'base/js/events',
    'notebook/js/quickhelp',
    'nbextensions/config/render/render',
    'nbextensions/config/kse_components'
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
){
    "use strict";

    var base_url = utils.get_body_data('baseUrl');
    // get list of extensions from body data supplied by the python backend
    var extension_list = $('body').data('extension-list') || [];

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
    function ext_name_to_id (ext_name) {
        /**
         * The HTML 4.01 spec states that ID tokens must
         * begin with a letter ([A-Za-z])
         * which may be followed by any number of
         *     letters, digits, hyphens, underscores, colons, and periods
         */
        return 'nbext-ext-' + ext_name.replace(/[^A-Za-z0-9-_:.]/g, '-');
    }

    /**
     * Compute the url of an extension's main javascript file
     */
    function get_ext_url (ext) {
        var url = utils.url_path_join(base_url, ext.url, utils.splitext(ext.Main)[0]);
        url = url.split('nbextensions/')[1];
        return url;
    }

    /**
     * Update server's json config file to reflect changed activate state
     */
    function set_config_active (ext_id, state) {
        state = state === true;
        for(var i in extension_list) {
            var ext = extension_list[i];
            if (ext.id === ext_id) {
                console.log(
                    'nbext', state ? ' enable:' : 'disable:' , ext.Name );
                var to_load = {};
                var ext_url = get_ext_url(ext);
                to_load[ext_url] = (state ? true : null);
                config.update({"load_extensions": to_load});
            }
        }
    }

    /**
     * Update buttons to reflect changed activate state
     */
    function set_buttons_active (ext_id, state) {
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
    }

    /**
     * Handle button click event to activate/deactivate extension
     */
    function handle_buttons_click (evt) {
        // endswith
        var suffix = '-on';
        var state = this.id.indexOf(suffix, this.id.length - suffix.length) !== -1;
        var end = this.id.length - suffix.length - Number(!state);
        var ext_id = this.id.substring(0, end);
        set_buttons_active(ext_id, state);
        set_config_active(ext_id, state);
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
                for (var ii=0; ii < new_value.length; ii++) {
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
        console.log(configkey, '->', configval);
        var c = {};
        c[configkey] = configval;
        config.update(c);
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
                            type:'button',
                            class: "btn btn-primary",
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
        var non_form_control_input_types = ['checkbox', 'list', 'hotkey'];
        if (non_form_control_input_types.indexOf(input_type) < 0) {
          input.addClass("form-control");
        }
        return input;
    }

    /*
     * Build and return a div containing the buttons to activate/deactivate an
     * extension with the given id.
     */
    function build_activate_buttons (ext_id) {
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
     * if the extension's link is a relative url with extension .md,
     *     render the referenced markdown file
     * otherwise
     *     add an anchor element to the extension's description
     */
    function load_readme (extension) {
        var readme_div = $('.nbext-readme .nbext-readme-contents').empty();
        var readme_title = $('.nbext-readme > h3').empty();
        if (!extension.Link) return;

        var url = extension.Link;
        var is_absolute = /^(f|ht)tps?:\/\//i.test(url);
        if (is_absolute || (utils.splitext(url)[1] !== '.md')) {
            // provide a link only
            var desc = $('#' + extension.id + ' .nbext-desc');
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
        // relative urls are relative to extension url
        url = require.toUrl(utils.url_path_join(extension.url, url));
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
            success: function(md_contents) {
                rendermd.render_markdown(md_contents, url)
                    .addClass('rendered_html')
                    .appendTo(readme_div);
                // We can't rely on picking up the rendered html,
                // since render_markdown returns
                // before the actual rendering work is complete
                extension.readme_content = md_contents;
            },
            error: function(jqXHR, textStatus, errorThrown) {
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
     * @param a the nav link corresponding to the extension
     * @param opts options for the reveal animation
     */
    function open_ext_ui (a, opts) {
        var default_opts = {duration: 100};
        opts = $.extend(true, {}, default_opts, opts);
        var li = a.closest('li');
        if (li.hasClass('disabled')) {
            return;
        }

        /**
         * Set window location hash to allow reloading settings for given
         * extension.
         * Avoid browser jumping, since we do our own scrolling.
         * To avoid jumping, we add an arbitrary string to the hash to
         * ensure that it doesn't correspond to an actual id.
         */
        var hash = a.attr('href');
        var extension = a.data('extension');
        window.location.hash = hash.replace('#', '#_' );

        var ext_ui = $(hash);
        // ensure ext_ui exists
        if (ext_ui.length < 1) {
            ext_ui = build_extension_ui(extension);
            // use display: none since hide(0) doesn't do anything
            // for elements that aren't yet part of the DOM
            ext_ui.css('display', 'none');
            ext_ui.insertBefore('.nbext-readme');
            var ext_url = get_ext_url(extension);
            var ext_active = false;
            if (config.data.hasOwnProperty('load_extensions')) {
                ext_active = (config.data.load_extensions[ext_url] === true);
            }
            set_buttons_active(extension.id, ext_active);
        }

        $('.nbext-selector li')
            .removeClass('active');
        li.addClass('active');

        $('.nbext-ext-row')
            .not(ext_ui)
            .slideUp(default_opts);
        ext_ui.slideDown(opts);
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
        open_ext_ui(a, {
            complete: function () {
                // scroll to ensure at least title is visible
                var site = $('#site');
                var ext_ui = site.find(a.attr('href'));
                var title = ext_ui.children('h3:first');
                var adjust = (title.offset().top - site.offset().top) + (2 * title.outerHeight(true) - site.innerHeight());
                if (adjust > 0) {
                    site.animate({scrollTop: site.scrollTop() + adjust});
                }
            }
        });
    }

    /**
     * Callback for the nav links' activation checkboxes
     */
    function selector_checkbox_callback (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        var a = $(evt.currentTarget).closest('a');
        var li = a.closest('li');
        if (!li.hasClass('disabled')) {
            var ext_id = a.attr('href').replace('#', '');
            var state = !$(evt.currentTarget).hasClass('nbext-activated');
            set_buttons_active(ext_id, state);
            set_config_active(ext_id, state);
            open_ext_ui(a);
        }
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
            if (config.data.hasOwnProperty(param_name)) {
                var configval = config.data[param_name];
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
            .attr('id', extension.id)
            .addClass('row nbext-row nbext-ext-row');

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
             * right prepends left in markup in order that it appears first
             * when the columns are wrapped each onto a single line.
             * The push and pull CSS classes are then used to get them to be
             * left/right correctly when next to each other
             */
            var col_right = $('<div>')
                .addClass("col-xs-12 col-sm-4 col-sm-push-8 col-md-6 col-md-push-6")
                .appendTo(ext_row);
            var col_left = $('<div/>')
                .addClass("col-xs-12 col-sm-8 col-sm-pull-4 col-md-6 col-md-pull-6")
                .appendTo(ext_row);

            // Icon
            if (extension.Icon) {
                $('<div/>')
                    .addClass('nbext-icon')
                    .append(
                        $('<img>')
                            .attr({
                                'src': utils.url_path_join(base_url, extension.url, extension.Icon),
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

            // Compatibility
            var compat_txt = extension.Compatibility || "?.x";
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

            // Activate/Deactivate buttons
            build_activate_buttons(extension.id).appendTo(col_left);

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
     *
     * Since this function uses the contents of config.data,
     * it should only be called after config.load() has been executed
     */
    function build_page () {
        var nbext_config_page = new page.Page();

        // prepare for rendermd usage
        rendermd.add_markdown_css();

        var container = $("#site > .container");

        var selector = $('.nbext-selector');

        $('.nbext-showhide-incompat').prepend(
            build_param_input({'input_type': 'checkbox'})
            .attr('id', param_id_prefix + 'nbext_hide_incompat')
            .on('change', function (evt) {
                set_hide_incompat(handle_input(evt));
            })
        );
        nbext_config_page.show_header();
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

        // fill the columns with nav links
        var col_length = Math.ceil(extension_list.length / cols.length);
        for (var i in extension_list) {
            var extension = extension_list[i];
            console.log("nbext extension:", extension.Name);
            extension.id = ext_name_to_id(extension.Name);
            extension.is_compatible = (extension.Compatibility || "?.x").toLowerCase().indexOf(
                Jupyter.version.substring(0, 2) + 'x') >= 0;
            if (!extension.is_compatible) {
                // reveal the checkbox since we've found an incompatible nbext
                $('.nbext-showhide-incompat').show();
            }
            $('<li/>')
                .toggleClass('nbext-incompatible', !extension.is_compatible)
                .append(
                    $('<a/>')
                        .attr('href', '#' + extension.id)
                        .data('extension', extension)
                        .html(extension.Name)
                        .prepend(
                            $('<i>')
                                .addClass('fa fa-fw nbext-active-toggle')
                        )
                )
                .appendTo(cols[Math.floor(i / col_length)]);

            var ext_url = get_ext_url(extension);
            var ext_active = false;
            if (config.data.hasOwnProperty('load_extensions')) {
                ext_active = (config.data.load_extensions[ext_url] === true);
            }
            set_buttons_active(extension.id, ext_active);
        }
        // attach click handlers
        $('.nbext-active-toggle')
            .on('click', selector_checkbox_callback)
            .closest('a')
            .on('click', selector_nav_link_callback);

        // en/disable incompatible extensions
        var hide_incompat = true;
        if (config.data.hasOwnProperty('nbext_hide_incompat')) {
            hide_incompat = config.data.nbext_hide_incompat;
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
         *
         * in addition, we've added _ to the beginning of the hash to ensure it
         * doesn't correspond to an actual element id (which would cause the
         * browser to jump)
         */
        var hash = window.location.hash.replace('#_', '#');
        var link = $();
        if (hash) {
            link = $('body')
                .find('a[href="' + hash + '"]:first')
                .filter( function (idx, elem) {
                    return !$('li', this).hasClass('disabled');
                });
        }
        if (link.length === 0) {
            // select the first non-disabled extension
            link = selector.find('li:not(.disabled) a').first();
        }
        setTimeout(function() { link.click(); }, 0);

        return nbext_config_page;
    }

    /**
     * Add CSS file to page
     *
     * @param name filename
     */
    function add_css (name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    add_css('./main.css');
    // set up work to be done on loading the config
    config.loaded.then(function() {
        build_page().show();
    });
    // finally, actually do the work by loading the config
    config.load();

    return {
        add_css: add_css,
        build_param_input: build_param_input,
        build_params_ui: build_params_ui,
        build_page: build_page,
        ext_name_to_id: ext_name_to_id,
        get_input_value: get_input_value,
        set_input_value: set_input_value,
        handle_input: handle_input,
        wrap_list_input: wrap_list_input
    };
});
