// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// Render markdown url

require([
    'base/js/namespace',
    'base/js/utils',
    'base/js/page',
    'jquery',
    'require',
    'components/marked/lib/marked'
], function(
    IPython,
    utils,
    page,
    $, require,
    marked
    ){
    page = new page.Page();

    var base_url = utils.get_body_data('baseUrl');
    var md_url = $('body').data('md-url');
    /* build html body listing all extensions */
    var html = "";
    $("#nbextensions-container").html(html);

    var url = base_url +  md_url;
    $.get(url, function( my_var ) {
        $("#render-container").html(marked(my_var));
    }, 'text');  // or 'text', 'xml', 'more' */

    page.show();
});
