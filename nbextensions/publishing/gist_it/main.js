// Avoid server side code :
// https://github.com/ipython/ipython/issues/2780

define([
    'jquery',
    'base/js/namespace',
    'base/js/dialog'
], function (
    $,
    Jupyter,
    dialog
) {
    "use strict";

    var auth_token = '';

    var add_auth_token = function add_auth_token (xhr) {
        if (auth_token !== '') {
            xhr.setRequestHeader("Authorization", "token " + token);
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
            content: JSON.stringify(Jupyter.notebook.toJSON())
        };

        // Create a public, anonymous, Gist
        $.ajax({
            url: 'https://api.github.com/gists',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            beforeSend: add_auth_token,
            success: show_gist_link
        });
    };

    Jupyter.toolbar.add_buttons_group([{
        label   : 'Gist Notebook',
        icon    : 'fa-github',
        callback: make_gist
    }]);
});
