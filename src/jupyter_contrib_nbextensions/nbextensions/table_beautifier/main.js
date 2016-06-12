/**
* ----------------------------------------------------------------------------
* Copyright (c) 2016 - Jan Schulz
*
* Distributed under the terms of the Modified BSD License.
*
* Extension to style markdown and output tables in the notebook with bootstrap
* ----------------------------------------------------------------------------
*/

define([
  'require',
  'jquery',
  'base/js/events',
  'services/config'
 ], function (
    require,
    $,
    events,
    configmod
) {

  function bootstrapify_all (){
    args = arguments; // just to see them in the debugger
    $(".rendered_html table").addClass("table table-condensed table-nonfluid");
    n_rendered = $(".rendered_html table").length;
    console.log ("beautified "+ n_rendered + " tables ...");
  }

  function bootstrapify_output (event, type, value, metadata, $toinsert){
    $toinsert.find( "table" ).addClass("table table-condensed table-nonfluid");
    n = $toinsert.find( "table" ).length;
    console.log ("beautified "+n+" tables in output...");
  }

   function bootstrapify_mdcell (event, mdcell){
    $tbls = mdcell.cell.element.find("table");
    $tbls.addClass("table table-condensed table-nonfluid");
    n = $tbls.length;
    console.log ("beautified "+n+" tables in md...");
  }

  function load_css (name) {
    var link = $('<link/>').attr({
      type: 'text/css',
      rel: 'stylesheet',
      href: require.toUrl(name)
    }).appendTo('head');
  }

  var load_jupyter_extension = function () {
    load_css('./main.css');
    events.on("notebook_loaded.Notebook", bootstrapify_all);
    events.on("kernel_ready.Kernel", bootstrapify_all);
    events.on("output_appended.OutputArea", bootstrapify_output);
    events.on("rendered.MarkdownCell", bootstrapify_mdcell);
  };

  return {
    'load_jupyter_extension': load_jupyter_extension,
    'load_ipython_extension': load_jupyter_extension
  };

});

