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
  'base/js/events'
 ], function (
    require,
    $,
    events
) {
  'use strict';

  var sortable;
  var bst = require(
    ['https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.25.7/js/jquery.tablesorter.min.js'],
    function () {
      sortable = true;
      bootstrapify_all();
    },
    function (err) {
      sortable = false;
    }
  );

  function bootstrapify_tables($tables, wherefound) {
    wherefound = wherefound ? ' in '+ wherefound : '';
    $tables.addClass('table table-condensed table-nonfluid');
    if (sortable) {
      $tables.tablesorter();
    }
    if ($tables.length > 0) {
      console.log('beautified', $tables.length, 'tables' + wherefound + '...');
    }
  }

  function bootstrapify_all (){
    bootstrapify_tables($('.rendered_html table'));
  }

  function bootstrapify_output (event, type, value, metadata, $toinsert){
    bootstrapify_tables($toinsert.find('table'), 'output');
  }

  function bootstrapify_mdcell (event, mdcell){
    bootstrapify_tables(mdcell.cell.element.find('table'), 'md');
  }

  function load_css (name) {
    $('<link/>').attr({
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
