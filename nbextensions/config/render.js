// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// Render markdown url

define([
    'require',
    'jquery',
    'base/js/utils',
    'base/js/page',
    'components/marked/lib/marked'
], function(
    require,
    $,
    utils,
    page,
    marked
){
    page = new page.Page();

    var base_url = utils.get_body_data('baseUrl');
    var md_url = $('body').data('md-url');

    var url = base_url +  md_url;
    $.ajax({
        url: url,
        dataType: 'text', // or 'html', 'xml', 'more' */
        success: function(md_contents) {
            $("#render-container").html(marked(md_contents));
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $(".nbext-page-title-wrap").append(
                $('<span class="nbext-page-title text-danger"/>').text(
                    textStatus + ' : ' + jqXHR.status + ' ' + errorThrown
                )
            );
            $("#render-container").addClass("text-danger bg-danger");
            var body_txt = "";
            switch (jqXHR.status) {
                case 404:
                    body_txt = 'no markdown file at ' + url;
                    break;
            }
            $("#render-container").append(body_txt);
        }
    });

    /**
     * Add CSS file to page
     *
     * @param url where to get css from. Will be wrapped by require.toUrl
     */
    var add_css = function (url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(url);
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    add_css('./rendermd.css');
    page.show();
});
