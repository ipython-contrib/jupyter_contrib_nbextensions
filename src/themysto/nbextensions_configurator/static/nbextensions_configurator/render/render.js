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
    /**
     * Custom marked options,
     * lifted from notebook/js/notebook
     */
    var custom_marked_options = {
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

            var magic_match;
            if (lang.toLowerCase() === 'jupyter') {
                var magic_specs = {
                    'javascript'    : /^%%javascript/,
                    'perl'          : /^%%perl/,
                    'ruby'          : /^%%ruby/,
                    'python'        : /^%%python3?/,
                    'shell'         : /^%%bash/,
                    'r'             : /^%%R/,
                    'text/x-cython' : /^%%cython/,
                    'latex'         : /^%%latex/
                };
                for (var mode in magic_specs) {
                    magic_match = code.match(magic_specs[mode]);
                    if (magic_match !== null) {
                        magic_match = magic_match[0];
                        lang = mode;
                        code = code.substr(magic_match.length);
                        break;
                    }
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
                    if (magic_match) {
                        $(el).prepend($('<span/>').text(magic_match));
                    }
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
    };

    /**
     * return a URL constructed by joining together each relative URL given as an argument, applying '..'
     */
    var join_relative_urls = function () {
        var url = [], root = '';
        for (var i in arguments) {
            var url_parts = arguments[i];
            // reset url if we encounter a relative URL starting at domain root (i.e. beginning with '/')
            if (url_parts.length > 0 && url_parts[0] === '/') {
                url = [];
                root = '/';
            }
            url_parts = url_parts.split('/');
            url.pop(); // relative urls don't include the resource, so pop it
            for (var j in url_parts) {
                switch (url_parts[j]) {
                    case '':
                    case '.':
                        continue;
                    case '..':
                        url.pop();
                        break;
                    default:
                        url.push(url_parts[j]);
                }
            }
        }
        return root + url.join('/');
    };

    /**
     * Render given markdown into html, returning as a jquery element.
     * Optionally absolutify relative href/src attributes using the parameter relative_url_root
     */
    var render_markdown = function(md_contents, relative_url_root) {
        var div = $('<div>');
        // the bulk of this functon is adapted from
        // notebook/js/textcell.Markdowncell.render
        // with the addition of code to absolutify relative href/src attributes
        if (md_contents) {
            var text_and_math = mathjaxutils.remove_math(md_contents);
            var text = text_and_math[0];
            var math = text_and_math[1];
            var options = custom_marked_options;
            if (relative_url_root) {
                // patch the renderer to fix relative paths to be absolute
                var renderer = new marked.Renderer();
                var base_renderer_link = renderer.link;
                renderer.link = function (href, title, text) {
                    if (!/^#|mailto:|(f|ht)tps?:\/\//i.test(href)) {
                        href = join_relative_urls(relative_url_root, href);
                    }
                    return base_renderer_link.call(this, href, title, text);
                };
                base_renderer_image = renderer.image;
                renderer.image = function (href, title, text) {
                    if (!/^(f|ht)tps?:\/\//i.test(href)) {
                        href = join_relative_urls(relative_url_root, href);
                    }
                    return base_renderer_image.call(this, href, title, text);
                };
                options = $.extend(custom_marked_options, {renderer: renderer});
            }
            marked(text, options, function (err, html) {
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
                div.html(html);
            });
        }
        return div;
    };

    var render_markdown_page = function() {
        // add css first so hopefully it'll be loaded in time
        add_markdown_css();

        page = new page.Page();
        page.show_header();

        var base_url = utils.get_body_data('baseUrl');
        var encoded_md_url = utils.encode_uri_components($('body').data('md-url'));
        var url = utils.url_path_join(base_url, encoded_md_url);

        $.ajax({
            url: url,
            dataType: 'text', // or 'html', 'xml', 'more'
            success: function(md_contents) {
                $("#render-container").append(render_markdown(md_contents));
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
            },
            complete: function(jqXHR, textStatus) {
                page.show();
                // See http://stackoverflow.com/questions/13735912
                var el = $(window.location.hash);
                if (el.length > 0) el[0].scrollIntoView();
            }
        });
    };

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

    /**
     * Add the specific markdown CSS file to page
     */
    var add_markdown_css = function () {
        add_css('./rendermd.css');
    };

    // expose functions
    return {
        add_markdown_css : add_markdown_css,
        custom_marked_options : custom_marked_options,
        join_relative_urls : join_relative_urls,
        render_markdown : render_markdown,
        render_markdown_page : render_markdown_page
    };
});
