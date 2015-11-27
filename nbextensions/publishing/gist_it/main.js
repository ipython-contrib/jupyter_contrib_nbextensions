/**
 *
// Avoid server side code :
// https://github.com/ipython/ipython/issues/2780
 *
 * This essentially boils down to the following:
 * Github authentication requires some server-side code for any 'app' which
 * wants to authenticate over the Github API.
 * When registering an app with Github, Github provides the app with what they
 * call a 'client secret'.
 * The client secret is then incorporated into the app, and the app sends it to
 * Github as part of the authentication process, thus proving to Github's
 * servers that the communicating app was written by someone with appropriate
 * credentials.
 *
 * The issue with writing a single Github app for Gist-ing notebooks, is that
 * it would need to include such a client secret. Since this would be part of
 * the extension source code, anyone could use the client secret, potentially
 * gaining the permissions that any given user has granted to the app.
 *
 * As a result, we only support:
 * - anonymous (non-authenticated) API usage
 * - client-side authentication using a personal access token
 *   (see https://github.com/settings/tokens)
 */

define([
    'jquery',
    'base/js/namespace',
    'base/js/dialog',
    'base/js/utils',
    'services/config'
], function (
    $,
    Jupyter,
    dialog,
    utils,
    configmod
) {
    "use strict";

    // define default values for config parameters
    var params = {
        gist_it_default_to_public: false,
        gist_it_personal_access_token: '',
    };

    // create config object to load parameters
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    config.loaded.then(function() {
        update_params();
        Jupyter.toolbar.add_buttons_group([{
            label   : 'Create/Edit Gist of Notebook',
            icon    : 'fa-github',
            callback: show_gist_editor_modal
        }]);
    });

    // update params with any specified in the server's config file
    var update_params = function() {
        for (var key in params) {
            if (config.data.hasOwnProperty(key))
                params[key] = config.data[key];
        }
        default_metadata.data.public = Boolean(config.data.gist_it_default_to_public);
    };

    var default_metadata = {
        id: '',
        data: {
            description: Jupyter.notebook.notebook_path,
            public: false
        }
    };

    function ensure_default_metadata () {
        Jupyter.notebook.metadata.gist = $.extend(
            true, // deep-copy
            default_metadata, //defaults
            Jupyter.notebook.metadata.gist // overrides
        );
    }

    var add_auth_token = function add_auth_token (xhr) {
        var token = '';
        if (params.gist_it_personal_access_token !== '') {
            token = params.gist_it_personal_access_token;
        }
        if (token !== '') {
            xhr.setRequestHeader("Authorization", "token " + token);
        }
    };

    function build_alert(alert_class) {
        return $('<div/>')
            .addClass('alert alert-dismissable')
            .addClass(alert_class)
            .append(
                $('<button class="close" type="button" data-dismiss="alert" aria-label="Close"/>')
                    .append($('<span aria-hidden="true"/>').html('&times;'))
            );
    }

    function gist_error (jqXHR, textStatus, errorThrown) {
        console.log('github ajax error:', jqXHR, textStatus, errorThrown);
        var alert = build_alert('alert-danger')
            .append(
                $('<p/>').text('The ajax request to Github went wrong:')
            )
            .append(
                $('<p/>').text(jqXHR.responseJSON ? jqXHR.responseJSON.message : errorThrown)
            );
        $('#gist_modal').find('.modal-body').append(alert);
    }

    function gist_success (response, textStatus, jqXHR) {
        // if (Jupyter.notebook.metadata.gist.id === response.id) return;

        Jupyter.notebook.metadata.gist.id = response.id;
        Jupyter.notebook.metadata._draft = $.extend(
            true, // deep copy
            Jupyter.notebook.metadata._draft, // defaults
            {nbviewer_url: response.html_url} // overrides
        );

        var alert = build_alert('alert-success')
            .append('Gist published to ')
            .append(
                $('<a/>')
                    .attr('href', response.html_url)
                    .attr('target', '_blank')
                    .text(response.html_url)
            );
        $('#gist_modal').find('.modal-body').append(alert);
    }

    function update_link () {
        var id_input = $('#gist_id');
        var id = id_input.val();
        var link = $('#gist_link');
        if (id) {
            var html_url = 'https://gist.github.com/' + id;
            link
                .attr('href', html_url)
                .attr('target', '_blank')
                .text(html_url);
        }
        link.add(id_input).closest('.form-group').toggle(id !== '');
    }

    function update_gist_editor (gist_editor) {
        if (gist_editor === undefined) gist_editor = $('#gist_editor');

        var id = '';
        var is_public = true;
        if (params.gist_it_personal_access_token !== '') {
            id = Jupyter.notebook.metadata.gist.id;
            is_public = Jupyter.notebook.metadata.gist.data.public;
        }

        gist_editor.find('#gist_id')
            .val(Jupyter.notebook.metadata.gist.id)
            .prop('readonly', true);

        gist_editor.find('#gist_public')
            .prop('checked', is_public)
            .prop('readonly', id === '');

        gist_editor.find('#gist_description')
            .val(Jupyter.notebook.metadata.gist.data.description);
    }

    function build_gist_editor () {
        ensure_default_metadata();

        var gist_editor = $('#gist_editor');

        if (gist_editor.length > 0) return gist_editor;

        gist_editor = $('<div/>').attr('id', 'gist_editor').append(controls);

        var id = params.gist_it_personal_access_token !== '' ? Jupyter.notebook.metadata.gist.id : '';
        var controls = $('<form/>')
            .appendTo(gist_editor)
            .addClass('form-horizontal');

        $('<div/>')
            .hide(0)
            .appendTo(controls)
            .append(
                $('<label/>')
                    .attr('for', 'gist_id')
                    .text('Gist id')
            )
            .append(
                $('<input/>')
                    .addClass('form-control')
                    .attr('id', 'gist_id')
                    .on('change', update_link)
                    .val(Jupyter.notebook.metadata.gist.id)
                    .prop('readonly', true)
            );
        $('<div/>')
            .hide(0)
            .appendTo(controls)
            .append(
                $('<label/>')
                    .attr('for', 'gist_link')
                    .text('HTML view link')
            )
            .append(
                $('<p/>')
                    .addClass('form-control-static')
                    .append(
                        $('<a/>')
                            .attr('id', 'gist_link')
                    )
            );
        $('<div/>')
            .appendTo(controls)
            .append(
                $('<div/>')
                    .addClass('checkbox')
                    .append(
                        $('<label>')
                            .text('Make the gist public')
                            .prepend(
                                $('<input/>')
                                    .attr('type', 'checkbox')
                                    .attr('id', 'gist_public')
                                    .prop('checked', Jupyter.notebook.metadata.gist.data.public)
                                    .prop('readonly', id === '')
                            )
                    )
            )
            .append(
                $('<label/>')
                    .attr('for', 'gist_public')
                    .text('public')
            );
        $('<div/>')
            .appendTo(controls)
            .addClass('form-group')
            .append(
                $('<label/>')
                    .attr('for', 'gist_description')
                    .text('description')
            )
            .append(
                $('<input/>')
                    .addClass('form-control')
                    .attr('id', 'gist_description')
                    .attr('type', 'textarea')
                    .val(Jupyter.notebook.metadata.gist.data.description)
            );

        var form_groups = controls.children('div').addClass('form-group');
        form_groups
            .children('label')
                .addClass('col-sm-2 control-label')
                .css('padding-right', '1em');
        form_groups
            .each(function (index, elem) {
                $('<div/>')
                    .appendTo(elem)
                    .addClass('col-sm-10')
                    .append($(elem).children(':not(label)'));
            });

        update_gist_editor(gist_editor);

        return gist_editor;
    }

    function show_gist_editor_modal () {
        var modal;
        modal = dialog.modal({
            show: false,
            title: 'Share on Github',
            notebook: Jupyter.notebook,
            keyboard_manager: Jupyter.notebook.keyboard_manager,
            body: build_gist_editor(),
            buttons: {
                ' Gist it!': {
                    class : 'btn-primary',
                    click: function() {
                        modal.find('.btn').prop('disabled', true);
                        var new_data = {
                            public: $('#gist_public').prop('checked'),
                            description: $('#gist_description').val()
                        };
                        $.extend(
                            true,
                            Jupyter.notebook.metadata.gist.data,
                            new_data
                        );
                        // prevent the modal from closing. See github.com/twbs/bootstrap/issues/1202
                        modal.data('bs.modal').isShown = false;
                        var spinner = modal.find('.btn-primary .fa-github').addClass('fa-spin');
                        make_gist(function (jqXHR, textStatus) {
                            modal.find('.btn').prop('disabled', false);
                            // allow the modal to close again. See github.com/twbs/bootstrap/issues/1202
                            modal.data('bs.modal').isShown = true;
                            spinner.removeClass('fa-spin');
                            if (modal.find('.alert').length === 0) {
                                modal.modal('hide');
                            }
                        });
                    }
                },
                done: {}
            }
        })
        .attr('id', 'gist_modal')
        .on('shown.bs.modal', update_link);

        modal.find('.btn-primary').prepend(
            $('<i/>')
                .addClass('fa fa-lg fa-github')
        );

        modal.modal('show');
    }

    var make_gist = function make_gist (complete_callback) {
        ensure_default_metadata();

        var data = $.extend(
            true, // deep-copy
            { files: {} }, // defaults
            Jupyter.notebook.metadata.gist.data // overrides
        );
        var filename = Jupyter.notebook.notebook_name;
        data.files[filename] = {
            content: JSON.stringify(Jupyter.notebook.toJSON(), null, 2)
        };

        var id = params.gist_it_personal_access_token !== '' ? Jupyter.notebook.metadata.gist.id : '';
        var method = id ? 'PATCH' : 'POST';

        // Create/edit the Gist
        $.ajax({
            url: 'https://api.github.com/gists' + (id ? '/' + id : ''),
            type: method,
            dataType: 'json',
            data: JSON.stringify(data),
            beforeSend: add_auth_token,
            success: gist_success,
            error: gist_error,
            complete: complete_callback
        });
    };

    function load_jupyter_extension () {
        config.load();
    }

    return {
        load_jupyter_extension: load_jupyter_extension,
        load_ipython_extension: load_jupyter_extension
    };
});
