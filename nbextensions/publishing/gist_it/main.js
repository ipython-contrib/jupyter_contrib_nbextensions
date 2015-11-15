// Avoid server side code :
// https://github.com/ipython/ipython/issues/2780

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
        gist_it_auth_token: ''
    };

    // create config object to load parameters
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    config.loaded.then(function() {
        update_params();
        Jupyter.toolbar.add_buttons_group([{
            label   : 'Gist Notebook',
            icon    : 'fa-github',
            callback: show_gist_editor
        }]);
    });

    // update params with any specified in the server's config file
    var update_params = function() {
        for (var key in params) {
            if (config.data.hasOwnProperty(key))
                params[key] = config.data[key];
        }
    };

    var add_auth_token = function add_auth_token (xhr) {
        if (params.gist_it_auth_token !== '') {
            xhr.setRequestHeader("Authorization", "token " + params.gist_it_auth_token);
        }
    };

    var show_gist_link = function show_gist_link (response, textStatus, jqXHR) {
        if(Jupyter.notebook.metadata._draft === undefined){
            Jupyter.notebook.metadata._draft = {};
        }
        if(Jupyter.notebook.metadata._draft.nbviewer_url === undefined){
            Jupyter.notebook.metadata._draft.nbviewer_url = response.html_url;
        }

        var body = $('<div/>')
            .append('Gist published to ')
            .append(
                $('<a/>')
                    .attr('href', response.html_url)
                    .attr('target', '_blank')
                    .text(response.html_url)
            );

        return dialog.modal({
            title: "Shared on Github",
            body: body
        });
    };

    var make_gist = function make_gist () {

        var data = {
            description: Jupyter.notebook.notebook_path,
            public: true,
            files: {}
        };
        var filename = Jupyter.notebook.notebook_name;
        data.files[filename] = {
            content: JSON.stringify(Jupyter.notebook.toJSON(), null, 2)
        };

        // Create/edit the Gist
        $.ajax({
            url: 'https://api.github.com/gists',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            beforeSend: add_auth_token,
            success: show_gist_link
        });
    };

    var load_jupyter_extension = function load_ipython_extension () {
        config.load();
    };

    return {
        load_jupyter_extension: load_jupyter_extension,
        load_ipython_extension: load_jupyter_extension
    };
});
