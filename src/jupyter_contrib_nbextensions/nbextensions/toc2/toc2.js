(require.specified('base/js/namespace') ? define : function(deps, callback) {
    // if here, the Jupyter namespace hasn't been specified to be loaded.
    // This means that we're probably embedded in a page, so we need to make
    // our definition with a specific module name
    return define('nbextensions/toc2/toc2', deps, callback);
})(['jquery', 'require'], function($, require) {
    "use strict";

    var IPython;
    var events;
    var liveNotebook = false;
    var all_headers = $("#notebook").find(":header");

    try {
        // this will work in a live notebook because nbextensions & custom.js
        // are loaded by/after notebook.js, which requires base/js/namespace
        IPython = require('base/js/namespace');
        events = require('base/js/events');
        liveNotebook = true;
    } catch (err) {
        // We *are* theoretically in a non-live notebook
        console.log('[toc2] working in non-live notebook'); //, err);
        // in non-live notebook, there's no event structure, so we make our own
        if (window.events === undefined) {
            var Events = function() {};
            window.events = $([new Events()]);
        }
        events = window.events;
    }

    function incr_lbl(ary, h_idx) { //increment heading label  w/ h_idx (zero based)
        ary[h_idx]++;
        for (var j = h_idx + 1; j < ary.length; j++) {
            ary[j] = 0;
        }
        return ary.slice(0, h_idx + 1);
    }

    function removeMathJaxPreview(elt) {
        elt.children('.anchor-link, .toc-mod-link').remove();
        elt.find("script[type='math/tex']").each(
            function(i, e) {
                $(e).replaceWith('$' + $(e).text() + '$')
            })
        elt.find("span.MathJax_Preview").remove()
        elt.find("span.MathJax").remove()
        return elt
    }

    var callback_toc_link_click = function(evt) {
        // workaround for https://github.com/jupyter/notebook/issues/699
        setTimeout(function() {
            $.ajax()
        }, 100);
        evt.preventDefault();
        var trg_id = $(evt.currentTarget).attr('data-toc-modified-id');
        // use native scrollIntoView method with semi-unique id
        // ! browser native click does't follow links on all browsers
        // $('<a>').attr('href', window.location.href.split('#')[0] + '#' + trg_id)[0].click();
        document.getElementById(trg_id).scrollIntoView(true)
        if (liveNotebook) {
            // use native document method as jquery won't cope with characters
            // like . in an id
            var cell = $(document.getElementById(trg_id)).closest('.cell').data('cell');
            Jupyter.notebook.select(Jupyter.notebook.find_cell_index(cell));
            highlight_toc_item("toc_link_click", {
                cell: cell
            });
        }
    };

    var make_link = function(h, toc_mod_id) {
        var a = $('<a>')
            .attr({
                'href': h.find('.anchor-link').attr('href'),
                'data-toc-modified-id': toc_mod_id,
            });
        // get the text *excluding* the link text, whatever it may be
        var hclone = h.clone();
        hclone = removeMathJaxPreview(hclone);
        a.html(hclone.html());
        a.on('click', callback_toc_link_click);
        return a;
    };

    var ol_depth = function(element) {
        // get depth of nested ol
        var d = 0;
        while (element.prop("tagName").toLowerCase() == 'ol') {
            d += 1;
            element = element.parent();
        }
        return d;
    };

    function highlight_toc_item(evt, data) {
        var c = $(data.cell.element);
        if (c.length < 1) {
            return;
        }
        var trg_id = c.find('.toc-mod-link').attr('id') ||
            c.prevAll().find('.toc-mod-link').eq(-1).attr('id');
        var highlighted_item = $();
        if (trg_id !== undefined) {
            highlighted_item = $('.toc a').filter(function(idx, elt) {
                return $(elt).attr('data-toc-modified-id') === trg_id;
            });
        }
        if (evt.type === 'execute') {
            // remove the selected class and add execute class
            // if the cell is selected again, it will be highligted as selected+running
            highlighted_item.removeClass('toc-item-highlight-select').addClass('toc-item-highlight-execute');
        } else {
            $('.toc .toc-item-highlight-select').removeClass('toc-item-highlight-select');
            highlighted_item.addClass('toc-item-highlight-select');
        }
    }

    var create_navigate_menu = function(callback) {
        $('#kernel_menu').parent().after('<li id="Navigate"/>')
        $('#Navigate').addClass('dropdown').append($('<a/>').attr('href', '#').attr('id', 'Navigate_sub'))
        $('#Navigate_sub').text('Navigate').addClass('dropdown-toggle').attr('data-toggle', 'dropdown')
        $('#Navigate').append($('<ul/>').attr('id', 'Navigate_menu').addClass('dropdown-menu')
            .append($("<div/>").attr("id", "navigate_menu").addClass('toc')))

        if (IPython.notebook.metadata.toc['nav_menu']) {
            $('#Navigate_menu').css(IPython.notebook.metadata.toc['nav_menu'])
            $('#navigate_menu').css('width', $('#Navigate_menu').css('width'))
            $('#navigate_menu').css('height', $('#Navigate_menu').height())
        } else {
            IPython.notebook.metadata.toc.nav_menu = {};
            $([IPython.events]).on("before_save.Notebook",
                function() {
                    try {
                        IPython.notebook.metadata.toc.nav_menu['width'] = $('#Navigate_menu').css('width')
                        IPython.notebook.metadata.toc.nav_menu['height'] = $('#Navigate_menu').css('height')
                    } catch (e) {
                        console.log("[toc2] Error in metadata (navigation menu) - Proceeding", e)
                    }
                })
        }

        $('#Navigate_menu').resizable({
            resize: function(event, ui) {
                $('#navigate_menu').css('width', $('#Navigate_menu').css('width'))
                $('#navigate_menu').css('height', $('#Navigate_menu').height())
            },
            stop: function(event, ui) {
                IPython.notebook.metadata.toc.nav_menu['width'] = $('#Navigate_menu').css('width')
                IPython.notebook.metadata.toc.nav_menu['height'] = $('#Navigate_menu').css('height')
            }
        })

        callback && callback();
    }

    function setNotebookWidth(cfg, st) {
        //cfg.widenNotebook  = true;
        if (cfg.sideBar) {
            if ($('#toc-wrapper').is(':visible')) {
                $('#notebook-container').css('margin-left', $('#toc-wrapper').width() + 30)
                $('#notebook-container').css('width', $('#notebook').width() - $('#toc-wrapper').width() - 30)
            } else {
                if (cfg.widenNotebook) {
                    $('#notebook-container').css('margin-left', 30);
                    $('#notebook-container').css('width', $('#notebook').width() - 30);
                } else { // original width
                    $("#notebook-container").css({
                        'width': '',
                        'margin-left': ''
                    })
                }
            }
        } else {
            if (cfg.widenNotebook) {
                $('#notebook-container').css('margin-left', 30);
                $('#notebook-container').css('width', $('#notebook').width() - 30);
            } else { // original width
                $("#notebook-container").css({
                    'width': '',
                    'margin-left': ''
                })
            }
        }
    }

    function setSideBarHeight(cfg, st) {
        if (cfg.sideBar) {
            var headerVisibleHeight = $('#header').is(':visible') ? $('#header').height() : 0
            $('#toc-wrapper').css('top', liveNotebook ? headerVisibleHeight : 0)
            $('#toc-wrapper').css('height', $('#site').height());
            $('#toc').css('height', $('#toc-wrapper').height() - $('#toc-header').height())
        }
    }

    var create_toc_div = function(cfg, st) {
        var toc_wrapper = $('<div id="toc-wrapper"/>')
            .append(
                $('<div id="toc-header"/>')
                .addClass("header")
                .text("Contents ")
                .append(
                    $("<a/>")
                    .attr("href", "#")
                    .addClass("hide-btn")
                    .attr('title', 'Hide ToC')
                    .text("[-]")
                    .click(function() {
                        $('#toc').slideToggle({
                            'complete': function() {
                                if (liveNotebook) {
                                    IPython.notebook.metadata.toc['toc_section_display'] = $('#toc').css('display');
                                    IPython.notebook.set_dirty();
                                }
                            }
                        });
                        $('#toc-wrapper').toggleClass('closed');
                        if ($('#toc-wrapper').hasClass('closed')) {
                            st.oldTocHeight = $('#toc-wrapper').css('height');
                            $('#toc-wrapper').css({
                                height: 40
                            });
                            $('#toc-wrapper .hide-btn')
                                .text('[+]')
                                .attr('title', 'Show ToC');
                        } else {
                            // $('#toc-wrapper').css({height: IPython.notebook.metadata.toc.toc_position['height']});
                            // $('#toc').css({height: IPython.notebook.metadata.toc.toc_position['height']});
                            $('#toc-wrapper').css({
                                height: st.oldTocHeight
                            });
                            $('#toc').css({
                                height: st.oldTocHeight
                            });
                            $('#toc-wrapper .hide-btn')
                                .text('[-]')
                                .attr('title', 'Hide ToC');
                        }
                        return false;
                    })
                ).append(
                    $("<a/>")
                    .attr("href", "#")
                    .addClass("reload-btn")
                    .text("  \u21BB")
                    .attr('title', 'Reload ToC')
                    .click(function() {
                        table_of_contents(cfg, st);
                        return false;
                    })
                ).append(
                    $("<span/>")
                    .html("&nbsp;&nbsp")
                ).append(
                    $("<a/>")
                    .attr("href", "#")
                    .addClass("number_sections-btn")
                    .text("n")
                    .attr('title', 'Number text sections')
                    .click(function() {
                        cfg.number_sections = !(cfg.number_sections);
                        if (liveNotebook) {
                            IPython.notebook.metadata.toc['number_sections'] = cfg.number_sections;

                            IPython.notebook.set_dirty();
                        }
                        //$('.toc-item-num').toggle();
                        cfg.number_sections ? $('.toc-item-num').show() : $('.toc-item-num').hide()
                        //table_of_contents();
                        return false;
                    })
                ).append(
                    $("<span/>")
                    .html("&nbsp;&nbsp;")
                ).append(
                    $("<a/>")
                    .attr("href", "#")
                    .addClass("toc_cell_sections-btn")
                    .html("t")
                    .attr('title', 'Add a toc section in Notebook')
                    .click(function() {
                        cfg.toc_cell = !(cfg.toc_cell);
                        if (liveNotebook) {
                            IPython.notebook.metadata.toc['toc_cell'] = cfg.toc_cell;
                            IPython.notebook.set_dirty();
                        }
                        table_of_contents(cfg, st);
                        return false;
                    })
                )
            ).append(
                $("<div/>").attr("id", "toc").addClass('toc')
            )

        $("body").append(toc_wrapper);

        // On header/menu/toolbar resize, resize the toc itself
        // (if displayed as a sidebar)
        if (liveNotebook) {
            $([Jupyter.events]).on("resize-header.Page", function() {
                setSideBarHeight(cfg, st);
            });
            $([Jupyter.events]).on("toggle-all-headers", function() {
                setSideBarHeight(cfg, st);
            });
        }

        // enable dragging and save position on stop moving
        $('#toc-wrapper').draggable({

            drag: function(event, ui) {

                // If dragging to the left side, then transforms in sidebar
                if ((ui.position.left <= 0) && (cfg.sideBar == false)) {
                    cfg.sideBar = true;
                    st.oldTocHeight = $('#toc-wrapper').css('height');
                    if (liveNotebook) {
                        IPython.notebook.metadata.toc['sideBar'] = true;
                        IPython.notebook.set_dirty();
                    }
                    toc_wrapper.removeClass('float-wrapper').addClass('sidebar-wrapper');
                    setNotebookWidth(cfg, st)
                    var headerVisibleHeight = $('#header').is(':visible') ? $('#header').height() : 0
                    ui.position.top = liveNotebook ? headerVisibleHeight : 0;
                    ui.position.left = 0;
                    if (liveNotebook) {
                        $('#toc-wrapper').css('height', $('#site').height());
                    } else {
                        $('#toc-wrapper').css('height', '96%');
                    }
                    $('#toc').css('height', $('#toc-wrapper').height() - $('#toc-header').height());
                }
                if (ui.position.left <= 0) {
                    ui.position.left = 0;
                    var headerVisibleHeight = $('#header').is(':visible') ? $('#header').height() : 0
                    ui.position.top = liveNotebook ? headerVisibleHeight : 0;
                }
                if ((ui.position.left > 0) && (cfg.sideBar == true)) {
                    cfg.sideBar = false;
                    if (liveNotebook) {
                        IPython.notebook.metadata.toc['sideBar'] = false;
                        IPython.notebook.set_dirty();
                    }
                    if (st.oldTocHeight == undefined) st.oldTocHeight = Math.max($('#site').height() / 2, 200)
                    $('#toc-wrapper').css('height', st.oldTocHeight);
                    toc_wrapper.removeClass('sidebar-wrapper').addClass('float-wrapper');
                    setNotebookWidth(cfg, st)
                    $('#toc').css('height', $('#toc-wrapper').height() - $('#toc-header').height()); //redraw at begin of of drag (after resizing height)

                }
            }, //end of drag function
            start: function(event, ui) {
                $(this).width($(this).width());
            },
            stop: function(event, ui) { // on save, store toc position
                if (liveNotebook) {
                    IPython.notebook.metadata.toc['toc_position'] = {
                        'left': $('#toc-wrapper').css('left'),
                        'top': $('#toc-wrapper').css('top'),
                        'width': $('#toc-wrapper').css('width'),
                        'height': $('#toc-wrapper').css('height'),
                        'right': $('#toc-wrapper').css('right')
                    };
                    IPython.notebook.set_dirty();
                }
                // Ensure position is fixed (again)
                $('#toc-wrapper').css('position', 'fixed');
            },
        });

        $('#toc-wrapper').resizable({
            resize: function(event, ui) {
                if (cfg.sideBar) {
                    setNotebookWidth(cfg, st)
                } else {
                    $('#toc').css('height', $('#toc-wrapper').height() - $('#toc-header').height());
                }
            },
            start: function(event, ui) {
                $(this).width($(this).width());
                //$(this).css('position', 'fixed');
            },
            stop: function(event, ui) { // on save, store toc position
                if (liveNotebook) {
                    IPython.notebook.metadata.toc['toc_position'] = {
                        'left': $('#toc-wrapper').css('left'),
                        'top': $('#toc-wrapper').css('top'),
                        'height': $('#toc-wrapper').css('height'),
                        'width': $('#toc-wrapper').css('width'),
                        'right': $('#toc-wrapper').css('right')
                    };
                    $('#toc').css('height', $('#toc-wrapper').height() - $('#toc-header').height())
                    IPython.notebook.set_dirty();
                }
                // Ensure position is fixed (again)
                //$(this).css('position', 'fixed');
            }
        })

        $("body").append(toc_wrapper);

        // On header/menu/toolbar resize, resize the toc itself
        // (if displayed as a sidebar)
        if (liveNotebook) {
            $([Jupyter.events]).on("resize-header.Page toggle-all-headers", function() {
                setSideBarHeight(cfg, st);
            });
        }



        // restore toc position at load
        if (liveNotebook) {
            if (IPython.notebook.metadata.toc['toc_position'] !== undefined) {
                $('#toc-wrapper').css(IPython.notebook.metadata.toc['toc_position']);
            }
        }
        // Ensure position is fixed
        $('#toc-wrapper').css('position', 'fixed');

        // Restore toc display
        if (liveNotebook) {
            if (IPython.notebook.metadata.toc !== undefined) {
                if (IPython.notebook.metadata.toc['toc_section_display'] !== undefined) {
                    $('#toc').css('display', IPython.notebook.metadata.toc['toc_section_display'])
                    $('#toc').css('height', $('#toc-wrapper').height() - $('#toc-header').height())
                    if (IPython.notebook.metadata.toc['toc_section_display'] == 'none') {
                        $('#toc-wrapper').addClass('closed');
                        $('#toc-wrapper').css({
                            height: 40
                        });
                        $('#toc-wrapper .hide-btn')
                            .text('[+]')
                            .attr('title', 'Show ToC');
                    }
                }
                if (IPython.notebook.metadata.toc['toc_window_display'] !== undefined) {
                    console.log("******Restoring toc display");
                    $('#toc-wrapper').css('display', IPython.notebook.metadata.toc['toc_window_display'] ? 'block' : 'none');
                }
            }
        }

        // if toc-wrapper is undefined (first run(?), then hide it)
        if ($('#toc-wrapper').css('display') == undefined) $('#toc-wrapper').css('display', "none") //block
        //};

        $('#site').bind('siteHeight', function() {
            if (cfg.sideBar) $('#toc-wrapper').css('height', $('#site').height());
        })

        $('#site').trigger('siteHeight');

        // Initial style
        ///sideBar = cfg['sideBar']
        if (cfg.sideBar) {
            $('#toc-wrapper').addClass('sidebar-wrapper');
            if (!liveNotebook) {
                $('#toc-wrapper').css('width', '202px');
                $('#notebook-container').css('margin-left', '212px');
                $('#toc-wrapper').css('height', '96%');
                $('#toc').css('height', $('#toc-wrapper').height() - $('#toc-header').height())
            } else {
                if (cfg.toc_window_display) {
                    setTimeout(function() {
                        setNotebookWidth(cfg, st)
                    }, 500)
                }
                setTimeout(function() {
                    $('#toc-wrapper').css('height', $('#site').height());
                    $('#toc').css('height', $('#toc-wrapper').height() - $('#toc-header').height())
                }, 500)
            }
            setTimeout(function() {
                $('#toc-wrapper').css('top', liveNotebook ? $('#header').height() : 0);
            }, 500) //wait a bit
            $('#toc-wrapper').css('left', 0);

        } else {
            toc_wrapper.addClass('float-wrapper');
        }
    }

    //----------------------------------------------------------------------------
    // on scroll - mark the toc item corresponding to the first header visible in
    // the viewport with 'highlight_on_scroll' class
    // some elements from https://stackoverflow.com/questions/20791374/jquery-check-if-element-is-visible-in-viewport
    function highlightTocItemOnScroll(cfg, st) {
        if (cfg.markTocItemOnScroll) {
            var scrolling_elt = liveNotebook ? '#site' : window
            $(scrolling_elt).scroll(function() {
                var headerVisibleHeight = $('#header').is(':visible') ? $('#header').height() : 0
                var headerHeight = liveNotebook ? headerVisibleHeight : 0
                var bottom_of_screen = $(window).scrollTop() + $(scrolling_elt).height() + headerHeight;
                var top_of_screen = $(window).scrollTop() + headerHeight;
                //loop over all headers
                all_headers.each(function(i, h) {
                    var top_of_element = $(h).offset().top;
                    // var bottom_of_element = $(h).offset().top + $(h).outerHeight();

                    if ((bottom_of_screen > top_of_element) && (top_of_screen < top_of_element)) {
                        // The element is visible
                        var trg_id = $(h).attr('data-toc-modified-id')
                        if (trg_id !== undefined) {
                            var highlighted_item = $('#toc a').filter(function(idx, elt) {
                                return $(elt).attr('data-toc-modified-id') === trg_id;
                            });
                            $('#toc .highlight_on_scroll').removeClass('highlight_on_scroll')
                            highlighted_item.parent().addClass('highlight_on_scroll')
                        }
                        return false;
                    } else {
                        // The element is not visible
                        // If the current header is already below the viewport then break
                        if (bottom_of_screen < top_of_element) return false
                        else return
                    }
                })
            });
        }
    }
    //----------------------------------------------------------------------------
    // TOC CELL -- if cfg.toc_cell=true, add and update a toc cell in the notebook.
    //             This cell, initially at the very beginning, can be moved.
    //             Its contents are automatically updated.
    //             Optionnaly, the sections in the toc can be numbered.


    function look_for_cell_toc(callb) { // look for a possible toc cell
        var cells = IPython.notebook.get_cells();
        var lcells = cells.length;
        for (var i = 0; i < lcells; i++) {
            if (cells[i].metadata.toc == "true") {
                cell_toc = cells[i];
                toc_index = i;
                //console.log("Found a cell_toc",i);
                break;
            }
        }
        callb && callb(i);
    }
    // then process the toc cell:

    function process_cell_toc(cfg, st) {
        // look for a possible toc cell
        var cells = IPython.notebook.get_cells();
        var lcells = cells.length;
        for (var i = 0; i < lcells; i++) {
            if (cells[i].metadata.toc == "true") {
                st.cell_toc = cells[i];
                st.toc_index = i;
                //console.log("Found a cell_toc",i);
                break;
            }
        }
        //if toc_cell=true, we want a cell_toc.
        //  If it does not exist, create it at the beginning of the notebook
        //if toc_cell=false, we do not want a cell-toc.
        //  If one exists, delete it
        if (cfg.toc_cell) {
            if (st.cell_toc == undefined) {
                st.rendering_toc_cell = true;
                //console.log("*********  Toc undefined - Inserting toc_cell");
                st.cell_toc = IPython.notebook.select(0).insert_cell_above("markdown");
                st.cell_toc.metadata.toc = "true";
            }
        } else {
            if (st.cell_toc !== undefined) IPython.notebook.delete_cell(st.toc_index);
            st.rendering_toc_cell = false;
        }
    } //end function process_cell_toc --------------------------

    var collapse_by_id = function(trg_id, show, trigger_event) {
        var anchors = $('.toc .toc-item > li > span > a').filter(function(idx, elt) {
            return $(elt).attr('data-toc-modified-id') === trg_id;
        });
        anchors.siblings('i')
            .toggleClass('fa-caret-right', !show)
            .toggleClass('fa-caret-down', show);
        anchors.parent().siblings('ul')[show ? 'slideDown' : 'slideUp']('fast');
        if (trigger_event !== false) {
            // fire event for collapsible_heading to catch
            var cell = $(document.getElementById(trg_id)).closest('.cell').data('cell');
            events.trigger((show ? 'un' : '') + 'collapse.Toc', {
                cell: cell
            });
        }
    };

    var callback_toc2_collapsible_headings = function(evt, data) {
        var trg_id = data.cell.element.find(':header').filter(function(idx, elt) {
            return Boolean($(elt).attr('data-toc-modified-id'));
        }).attr('data-toc-modified-id');
        var show = evt.type.indexOf('un') >= 0;
        // use trigger_event false to avoid re-triggering collapsible_headings
        collapse_by_id(trg_id, show, false);
    };

    var callback_collapser = function(evt) {
        var clicked_i = $(evt.currentTarget);
        var trg_id = clicked_i.siblings('a').attr('data-toc-modified-id');
        var anchors = $('.toc .toc-item > li > span > a').filter(function(idx, elt) {
            return $(elt).attr('data-toc-modified-id') === trg_id;
        });
        var show = clicked_i.hasClass('fa-caret-right');
        collapse_by_id(trg_id, show);
    };

    // Table of Contents =================================================================
    var table_of_contents = function(cfg, st) {

        if (st.rendering_toc_cell) { // if toc_cell is rendering, do not call  table_of_contents,
            st.rendering_toc_cell = false; // otherwise it will loop
            return
        }


        var toc_wrapper = $("#toc-wrapper");
        // var toc_index=0;
        if (toc_wrapper.length === 0) { // toc window doesn't exist at all
            create_toc_div(cfg, st); // create it
            highlightTocItemOnScroll(cfg, st); // initialize highlighting on scroll
        }
        var segments = [];
        var ul = $("<ul/>").addClass("toc-item").attr('id', 'toc-level0');

        // update toc element
        $("#toc").empty().append(ul);


        st.cell_toc = undefined;
        // if cfg.toc_cell=true, add and update a toc cell in the notebook.

        if (liveNotebook) {
            ///look_for_cell_toc(process_cell_toc);
            process_cell_toc(cfg, st);
        }
        //process_cell_toc();

        var cell_toc_text = " # Table of Contents\n";
        var depth = 1; //var depth = ol_depth(ol);
        var li = ul; //yes, initialize li with ul!
        all_headers = $("#notebook").find(":header"); // update all_headers
        var min_lvl = 1 + Number(Boolean(cfg.skip_h1_title)),
            lbl_ary = [];
        for (; min_lvl <= 6; min_lvl++) {
            if (all_headers.is('h' + min_lvl)) {
                break;
            }
        }
        for (var i = min_lvl; i <= 6; i++) {
            lbl_ary[i - min_lvl] = 0;
        }

        //loop over all headers
        all_headers.each(function(i, h) {
            var level = parseInt(h.tagName.slice(1), 10) - min_lvl + 1;
            // skip below threshold, or h1 ruled out by cfg.skip_h1_title
            if (level < 1 || level > cfg.threshold) {
                return;
            }
            // skip headings with no ID to link to
            if (!h.id) {
                return;
            }
            // skip toc cell if present
            if (h.id == "Table-of-Contents") {
                return;
            }
            // skip header if an html tag with class 'tocSkip' is present
            // eg in ## title <a class='tocSkip'>
            if ($(h).find('.tocSkip').length != 0) {
                return;
            }
            h = $(h);
            h.children('.toc-item-num').remove(); // remove pre-existing number
            // numbered heading labels
            var num_str = incr_lbl(lbl_ary, level - 1).join('.');
            if (cfg.number_sections) {
                $('<span>')
                    .text(num_str + '\u00a0\u00a0')
                    .addClass('toc-item-num')
                    .prependTo(h);
            }

            // walk down levels
            for (var elm = li; depth < level; depth++) {
                var new_ul = $("<ul/>").addClass("toc-item");
                elm.append(new_ul);
                elm = ul = new_ul;
            }
            // walk up levels
            for (; depth > level; depth--) {
                // up twice: the enclosing <ol> and <li> it was inserted in
                ul = ul.parent();
                while (!ul.is('ul')) {
                    ul = ul.parent();
                }
            }

            var toc_mod_id = h.attr('id') + '-' + num_str;
            h.attr('data-toc-modified-id', toc_mod_id);
            // add an anchor with modified id (if it doesn't already exist)
            h.children('.toc-mod-link').remove();
            $('<a>').addClass('toc-mod-link').attr('id', toc_mod_id).prependTo(h);

            // Create toc entry, append <li> tag to the current <ol>.
            li = $('<li>').append($('<span/>').append(make_link(h, toc_mod_id)));
            ul.append(li);
        });

        // update navigation menu
        if (cfg.navigate_menu) {
            var pop_nav = function() { //callback for create_nav_menu
                //$('#Navigate_menu').empty().append($("<div/>").attr("id", "navigate_menu").addClass('toc').append(ul.clone().attr('id', 'navigate_menu-level0')))
                $('#navigate_menu').empty().append($('#toc-level0').clone().attr('id', 'navigate_menu-level0'))
            }
            if ($('#Navigate_menu').length == 0) {
                create_navigate_menu(pop_nav);
            } else {
                pop_nav()
            }
        } else { // If navigate_menu is false but the menu already exists, then remove it
            if ($('#Navigate_menu').length > 0) $('#Navigate_sub').remove()
        }


        // check for st.cell_toc because we may have a non-live notebook where
        // metadata says to use cell_toc, but the actual cell's been removed
        if (cfg.toc_cell && st.cell_toc) {
            st.rendering_toc_cell = true;
            st.cell_toc.set_text(
                cell_toc_text +
                '<div class="toc" style="margin-top: 1em;">' +
                $('#toc').html() +
                '</div>'
            );
            st.cell_toc.render();
            st.cell_toc.element.find('.toc-item li a').on('click', callback_toc_link_click);
        };

        // add collapse controls
        $('<i>')
            .addClass('fa fa-fw fa-caret-down')
            .on('click', callback_collapser) // callback
            .prependTo('.toc li:has(ul) > span'); // only if li has descendants
        $('<i>').addClass('fa fa-fw ').prependTo('.toc li:not(:has(ul)) > span'); // otherwise still add <i> to keep things aligned

        events[cfg.collapse_to_match_collapsible_headings ? 'on' : 'off'](
            'collapse.CollapsibleHeading uncollapse.CollapsibleHeading', callback_toc2_collapsible_headings);


        $(window).resize(function() {
            $('#toc').css({
                maxHeight: $(window).height() - 30
            });
            $('#toc-wrapper').css({
                maxHeight: $(window).height() - 10
            });
            setSideBarHeight(cfg, st),
                setNotebookWidth(cfg, st);
        });

        $(window).trigger('resize');

    };


    var toggle_toc = function(cfg, st) {
        // toggle draw (first because of first-click behavior)
        //$("#toc-wrapper").toggle({'complete':function(){
        $("#toc-wrapper").toggle({
            'progress': function() {
                setNotebookWidth(cfg, st);
            },
            'complete': function() {
                if (liveNotebook) {
                    IPython.notebook.metadata.toc['toc_window_display'] = $('#toc-wrapper').css('display') == 'block';
                    IPython.notebook.set_dirty();
                }
                // recompute:
                st.rendering_toc_cell = false;
                table_of_contents(cfg, st);
            }
        });

    };

    return {
        highlight_toc_item: highlight_toc_item,
        table_of_contents: table_of_contents,
        toggle_toc: toggle_toc,
    };
});
// export table_of_contents to global namespace for backwards compatibility
// Do export synchronously, so that it's defined as soon as this file is loaded
if (!require.specified('base/js/namespace')) {
    window.table_of_contents = function(cfg, st) {
        // use require to ensure the module is correctly loaded before the
        // actual call is made
        require(['nbextensions/toc2/toc2'], function(toc2) {
            toc2.table_of_contents(cfg, st);
        });
    };
}
