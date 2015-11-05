// adapted from https://gist.github.com/magican/5574556

define(["require", "jquery", "base/js/namespace"], function (require, $, IPython) {
  "use strict";

  var make_link = function (h) {
    var a = $("<a/>");
    a.attr("href", '#' + h.attr('id'));
    var hclone = h.clone();
    // last() is the |P anchor which lights up when you hoover over the headline
    hclone.children().last().remove();
    a.html(hclone.html());
    return a;
  };

  var ol_depth = function (element) {
    // get depth of nested ol
    var d = 0;
    while (element.prop("tagName").toLowerCase() == 'ol') {
      d += 1;
      element = element.parent();
    }
    return d;
  };
  
  var create_toc_div = function () {
    var toc_wrapper = $('<div id="toc-wrapper"/>')
    .append(
      $("<div/>")
      .addClass("header")
      .text("Contents ")
      .click( function(){
        $('#toc').slideToggle();
        $('#toc-wrapper').toggleClass('closed');
        if ($('#toc-wrapper').hasClass('closed')){
          $('#toc-wrapper .hide-btn')
          .text('[+]')
          .attr('title', 'Show ToC');
        } else {
          $('#toc-wrapper .hide-btn')
          .text('[-]')
          .attr('title', 'Hide ToC');
        }
        return false;
      }).append(
        $("<a/>")
        .attr("href", "#")
        .addClass("hide-btn")
        .attr('title', 'Hide ToC')
        .text("[-]")
      ).append(
        $("<a/>")
        .attr("href", "#")
        .addClass("reload-btn")
        .text("  \u21BB")
        .attr('title', 'Reload ToC')
        .click( function(){
          table_of_contents();
          return false;
        })
      )
    ).append(
        $("<div/>").attr("id", "toc")
    );
    $("body").append(toc_wrapper);
  };

  var table_of_contents = function (threshold) {
    if (threshold === undefined) {
      threshold = 4;
    }
    var toc_wrapper = $("#toc-wrapper");
    if (toc_wrapper.length === 0) {
      create_toc_div();
    }
  
    var ol = $("<ol/>");
    ol.addClass("toc-item");
    $("#toc").empty().append(ol);
    
    $("#notebook").find(":header").map(function (i, h) {
      var level = parseInt(h.tagName.slice(1), 10);
      // skip below threshold
      if (level > threshold) return;
      // skip headings with no ID to link to
      if (!h.id) return;
      
      var depth = ol_depth(ol);

      // walk down levels
      for (; depth < level; depth++) {
        var new_ol = $("<ol/>");
        new_ol.addClass("toc-item");
        ol.append(new_ol);
        ol = new_ol;
      }
      // walk up levels
      for (; depth > level; depth--) {
        ol = ol.parent();
      }
      //
      ol.append(
        $("<li/>").append(make_link($(h)))
      );
    });

    $(window).resize(function(){
      $('#toc').css({maxHeight: $(window).height() - 200});
    });

    $(window).trigger('resize');
  };
    
  var toggle_toc = function () {
    // toggle draw (first because of first-click behavior)
    $("#toc-wrapper").toggle();
    // recompute:
    table_of_contents();
  };
  
  var toc_button = function () {
    if (!IPython.toolbar) {
      $([IPython.events]).on("app_initialized.NotebookApp", toc_button);
      return;
    }
    if ($("#toc_button").length === 0) {
      IPython.toolbar.add_buttons_group([
        {
          'label'   : 'Table of Contents',
          'icon'    : 'fa-list',
          'callback': toggle_toc,
          'id'      : 'toc_button'
        }
      ]);
    }
  };
  
  var load_css = function () {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = require.toUrl("./main.css");
    document.getElementsByTagName("head")[0].appendChild(link);
  };
  
  var load_ipython_extension = function () {
    load_css();
    toc_button();
    // $([IPython.events]).on("notebook_loaded.Notebook", table_of_contents);
    $([IPython.events]).on("notebook_saved.Notebook", table_of_contents);
    $([IPython.events]).on("rendered.MarkdownCell", table_of_contents);
  };

  return {
    load_ipython_extension : load_ipython_extension,
    toggle_toc : toggle_toc,
    table_of_contents : table_of_contents
  };
});
