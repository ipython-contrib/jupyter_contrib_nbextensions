/*
* ----------------------------------------------------------------------------
* Copyright (c) 2013 - Damián Avila
*
* Distributed under the terms of the Modified BSD License.
*
* A little extension to give Zenmode functionality to the IPython notebook.
* -----------------------------------------------------------------------------
*/

IPython.layout_manager.app_height = function() {

  /*
  * We need to redefined this function because in the IPython codebase
  * the app_height function does not take into account the 'hmode' class
  * and the possibility to hide the 'menubar' bar.
  */

  var win = $(window);
  var w = win.width();
  var h = win.height();
  var header_height;
  if ($('div#header').hasClass('hmode')) {
    header_height = 0;
  }
  else {
    header_height = $('div#header').outerHeight(true);
  }
  var menubar_height;
  if ($('div#menubar').hasClass('hmode')) {
    menubar_height = 0;
  }
  else {
    menubar_height = $('div#menubar').outerHeight(true);
  }
  var toolbar_height;
  if ($('div#maintoolbar').hasClass('hmode')) {
    toolbar_height = 0;
  }
  else {
    toolbar_height = $('div#maintoolbar').outerHeight(true);
  }
  return h-header_height-menubar_height-toolbar_height;  // content height
}


function zenMode(back) {

  /*
  * We search for a class tag in the maintoolbar to if Zenmode is "on".
  * If not, to enter the Zenmode, we hide "menubar" and "header" bars and
  * we append a customized css stylesheet to get the proper styles.
  */

  var tag = $('#maintoolbar').hasClass('tagging');

  if (!tag) {

    $('head').append('<link rel="stylesheet" href=' + require.toUrl("./custom/styling/zenmode/main.css") + ' id="zenmodecss" />');
    $('body').css({'background': 'url(' + require.toUrl("./custom/styling/zenmode/" + back) + ')'});

    $('#menubar').addClass('hmode');
    $('#header').addClass('hmode');

    $('#maintoolbar').addClass('tagging');

  }
  else{

    $('#zenmodecss').remove();
    $('body').css({"background": "#ffffff"});

    $('#menubar').removeClass('hmode');
    $('#header').removeClass('hmode');

    $('#maintoolbar').removeClass('tagging');

  }

  // And now we find the proper height and do a resize
  IPython.layout_manager.app_height();
  IPython.layout_manager.do_resize();

}

define(function() {
  return {
    background: function setup(param) {
      IPython.toolbar.add_buttons_group([
        {
        'label'   : 'Enter/Exit Zenmode',
        'icon'    : 'fa-check',
        'callback': function(){zenMode(param)},
        'id'      : 'start_zenmode'
        },
      ])
    }
  }
});
