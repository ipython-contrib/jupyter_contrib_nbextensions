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
            .hide()
            .append(
                $('<p/>').text('The ajax request to Github went wrong:')
            )
            .append(
                $('<pre/>').text(jqXHR.responseJSON ? JSON.stringify(jqXHR.responseJSON, null, 2) : errorThrown)
            );
        $('#gist_modal').find('.modal-body').append(alert);
        alert.slideDown('fast');
    }

    function gist_success (response, textStatus, jqXHR) {
        // if (Jupyter.notebook.metadata.gist.id === response.id) return;

        Jupyter.notebook.metadata.gist.id = response.id;
        Jupyter.notebook.metadata._draft = $.extend(
            true, // deep copy
            Jupyter.notebook.metadata._draft, // defaults
            {nbviewer_url: response.html_url} // overrides
        );

        var d = new Date();
        var msg_head = d.toLocaleString() + ': Gist ';
        var msg_tail = response.history.length === 1 ? ' published' : ' updated to revision ' + response.history.length;
        var alert = build_alert('alert-success')
            .hide()
            .append(msg_head)
            .append(
                $('<a/>')
                    .attr('href', response.html_url)
                    .attr('target', '_blank')
                    .text(response.id)
            )
            .append(msg_tail);
        $('#gist_modal').find('.modal-body').append(alert);
        alert.slideDown('fast');
    }

    function gist_id_updated_callback(gist_editor) {
        if (gist_editor === undefined) gist_editor = $('#gist_editor');

        var id_input = gist_editor.find('#gist_id');
        var id = id_input.val();

        var help_block  = gist_editor.find('#gist_id ~ .help-block');
        var help_block_base_text = 'Set the gist id to update an existing gist, ' +
            'or leave blank to create a new one.';

        var gist_it_button = $('#gist_modal').find('.btn-primary');

        id_input.parent()
            .removeClass('has-success has-error has-warning')
            .find('#gist_id ~ .form-control-feedback > i.fa')
            .removeClass('fa-pencil-square fa-exclamation-circle fa-question-circle');

        if (id === '') {
            $('#gist_id ~ .form-control-feedback > i.fa')
                .addClass('fa-plus-circle');
            help_block.html(
                '<p>' + help_block_base_text + '</p>' +
                '<p><i class="fa fa-plus-circle"></i> a new gist will be created</p>'
            );
            gist_it_button.prop('disabled', false);
        }
        else {
            $('#gist_id ~ .form-control-feedback > i.fa')
                .addClass('fa-circle-o-notch fa-spin');
            // List commits as a way of checking whether the gist exists.
            // Listing commits appears to give the most concise response.
            $.ajax({
                url: 'https://api.github.com/gists/' + id + '/commits',
                dataType: 'json',
                beforeSend: add_auth_token,
                error: function(jqXHR, textStatus, errorThrown) {
                    jqXHR.errorThrown = errorThrown;
                },
                complete: function(jqXHR, textStatus) {
                    var success = textStatus === 'success';
                    var error = !success && jqXHR.status === 404 && jqXHR.responseJSON !== undefined;
                    var warning = !success && !error;

                    var help_block_html = '<p>' + help_block_base_text + '</p>';

                    gist_it_button.prop('disabled', error);
                    if (success) {
                        var single = (jqXHR.responseJSON.length === 1);
                        help_block_html += '<p>' +
                            '<i class="fa fa-pencil-square"></i>' +
                            ' gist ' +
                            '<a href="https://gist.github.com/' + id +
                            '" target="_blank">' + id + '</a> will be updated' +
                            ' (' + jqXHR.responseJSON.length +
                            ' revision' + (single ? '' : 's') +
                            ' exist' + (single ? 's' : '') + ' so far)' +
                            '</p>';
                    }
                    else if (error) {
                        help_block_html += '<p>' +
                            '<i class="fa fa-exclamation-circle"></i>' +
                            ' no gist exists with the specified id (given current access token)'+
                            '</p>';
                    }
                    else {
                        help_block_html += '<p>' +
                            '<i class="fa fa-question-circle"></i>' +
                            ' can\'t list commits for the specified gist id - you may have problems updating it!' +
                            '</p>';
                        help_block_html += '<p>The ajax request to Github went wrong:<p/>' +
                            '<pre>';
                        if (jqXHR.responseJSON) {
                            help_block_html += JSON.stringify(jqXHR.responseJSON, null, 2);
                        }
                        else {
                            help_block_html += jqXHR.errorThrown || textStatus;
                        }
                        help_block_html += '</pre>';
                        console.log('non-404 github ajax error:', jqXHR, textStatus);
                    }
                    help_block.html(help_block_html);

                    id_input.parent()
                        .toggleClass('has-success', success)
                        .toggleClass('has-error', error)
                        .toggleClass('has-warning', warning)
                        .find('#gist_id ~ .form-control-feedback > i.fa')
                        .removeClass('fa-circle-o-notch fa-spin')
                        .toggleClass('fa-pencil-square', success)
                        .toggleClass('fa-exclamation-circle', error)
                        .toggleClass('fa-question-circle', warning);
                }
            });
        }
    }

    function update_gist_editor (gist_editor) {
        if (gist_editor === undefined) gist_editor = $('#gist_editor');

        var id_input = gist_editor.find('#gist_id');

        var have_auth = params.gist_it_personal_access_token !== '';
        var id = '';
        var is_public = true;
        if (have_auth) {
            id = Jupyter.notebook.metadata.gist.id;
            is_public = Jupyter.notebook.metadata.gist.data.public;
            id_input.val(id);
        }
        id_input.closest('.form-group').toggle(have_auth);

        gist_editor.find('#gist_public')
            .prop('checked', is_public)
            .prop('readonly', !have_auth);

        gist_editor.find('#gist_description')
            .val(Jupyter.notebook.metadata.gist.data.description);

        if (have_auth) {
            gist_id_updated_callback(gist_editor);
        }
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
            .addClass('has-feedback')
            .hide()
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
                    .val(Jupyter.notebook.metadata.gist.id)
            )
            .append(
                $('<span/>')
                    .addClass('form-control-feedback')
                    .append(
                        $('<i/>')
                            .addClass('fa fa-lg')
                    )
            )
            .append(
                $('<span/>')
                    .addClass('help-block')
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

        // bind events for id changing
        var id_input = gist_editor.find('#gist_id');
        // Save current value of element
        id_input.data('oldVal', id_input.val());
        // Look for changes in the value
        id_input.bind("change click keyup input paste", function(event) {
            // If value has changed...
            if (id_input.data('oldVal') !== id_input.val()) {
                // Updated stored value
                id_input.data('oldVal', id_input.val());
                // Do action
                gist_id_updated_callback(gist_editor);
            }
        });

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
                        });
                    }
                },
                done: {}
            }
        })
        .attr('id', 'gist_modal')
        .on('shown.bs.modal', function (evt) {
            var err = modal.find('#gist_id').parent().hasClass('has-error');
            modal.find('.btn-primary').prop('disabled', err);
        });

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

        var id_input = $('#gist_id');
        var id = params.gist_it_personal_access_token !== '' ? id_input.val() : '';
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
