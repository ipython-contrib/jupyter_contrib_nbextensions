// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// Render markdown url

define([
    'require',
    'jquery',
    'base/js/utils',
    'base/js/page',
    'base/js/security',
    'notebook/js/mathjaxutils',
    'notebook/js/codemirror-ipythongfm',
    'codemirror/lib/codemirror',
    'codemirror/mode/gfm/gfm',
    'codemirror/addon/runmode/runmode',
    'components/marked/lib/marked'
], function(
    require,
    $,
    utils,
    page,
    security,
    mathjaxutils,
    ipgfm,
    CodeMirror,
    gfm,
    runMode,
    marked
){
    // Setup marked options
    // This is lifted from notebook/js/notebook
    marked.setOptions({
        gfm : true,
        tables: true,
        // FIXME: probably want central config for CodeMirror theme when we have js config
        langPrefix: "cm-s-ipython language-",
        highlight: function(code, lang, callback) {
            if (!lang) {
                // no language, no highlight
                if (callback) {
                    callback(null, code);
                    return;
                } else {
                    return code;
                }
            }
            utils.requireCodeMirrorMode(lang, function (spec) {
                var el = document.createElement("div");
                var mode = CodeMirror.getMode({}, spec);
                if (!mode) {
                    console.log("No CodeMirror mode: " + lang);
                    callback(null, code);
                    return;
                }
                try {
                    CodeMirror.runMode(code, spec, el);
                    callback(null, el.innerHTML);
                } catch (err) {
                    console.log("Failed to highlight " + lang + " code", err);
                    callback(err, code);
                }
            }, function (err) {
                console.log("No CodeMirror mode: " + lang);
                callback(err, code);
            });
        }
    });

    page = new page.Page();

    var base_url = utils.get_body_data('baseUrl');
    var md_url = $('body').data('md-url');

    var url = base_url +  md_url;
    $.ajax({
        url: url,
        dataType: 'text', // or 'html', 'xml', 'more'
        success: function(md_contents) {
            // the bulk of this functon is adapted from
            // notebook/js/textcell.Markdowncell.render
            if (md_contents) {
                var text_and_math = mathjaxutils.remove_math(md_contents);
                var text = text_and_math[0];
                var math = text_and_math[1];
                marked(text, function (err, html) {
                    html = mathjaxutils.replace_math(html, math);
                    html = security.sanitize_html(html);
                    html = $($.parseHTML(html));
                    // add anchors to headings
                    html.find(":header").addBack(":header").each(function (i, h) {
                        h = $(h);
                        var hash = h.text().replace(/ /g, '-');
                        h.attr('id', hash);
                        h.append(
                            $('<a/>')
                                .addClass('anchor-link')
                                .attr('href', '#' + hash)
                                .text('¶')
                        );
                    });
                    // links in markdown cells should open in new tabs
                    html.find("a[href]").not('[href^="#"]').attr("target", "_blank");
                    $("#render-container").html(html);
                });
            }
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
