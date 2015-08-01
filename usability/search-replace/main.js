// Simple search&replace extension based on a codemirror addon.
// Adds a search box to the notebook toolbar and selects search word if found.


define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'notebook/js/keyboardmanager',
    'codemirror/lib/codemirror',
    'codemirror/addon/search/search',
    'codemirror/addon/search/searchcursor'
],   function(IPython, $, require, events, keyboard_manager, codemirror) {
    "use strict";
    if (IPython.version[0] < 3) {
        console.log("This extension requires IPython 3.x");
        return
    }

    /**
     *
     * @param hotkey
     * @returns {boolean}
     */
    var search = function(hotkey) {
    if (hotkey != 0 && hotkey != 13) {            
        return false;
    }
    
        var cell = IPython.notebook.get_selected_cell();
        if (cell.rendered == true && cell.cell_type == "markdown" ) cell.unrender();

        var findString = $('#searchbar_search_text').val();
        var cur = cell.code_mirror.getCursor();

        var case_sensitive = !$('#searchbar_case_sensitive').hasClass('active');
        var find = cell.code_mirror.getSearchCursor(findString,cur, case_sensitive);
        if (find.find() == true) {
            cell.code_mirror.setSelection(find.pos.from,find.pos.to);
            cell.code_mirror.focus();
        } else {
            var ncells = IPython.notebook.ncells();
            if ( IPython.notebook.get_selected_index()+1 == ncells) {
                cell.code_mirror.focus();
            } else {
                IPython.notebook.select_next();
                IPython.notebook.edit_mode();                
                cell.code_mirror.setCursor({line:0, ch:0});
                return search(hotkey);
            }
        }
    };

    /**
     *
     * @param hotkey
     * @returns {boolean}
     */
    var replace = function(hotkey) {
    if (hotkey != 0 && hotkey != 13) {
        return false;
    }

        var cell = IPython.notebook.get_selected_cell();
        if (cell.rendered == true && cell.cell_type == "markdown" ) cell.unrender();

        var findString = $('#searchbar_search_text').val();
        var cur = cell.code_mirror.getCursor();

        var case_sensitive = !$('#searchbar_case_sensitive').hasClass('active');
        var find = cell.code_mirror.getSearchCursor(findString,cur, case_sensitive);
        if (find.find() == true) {
            cell.code_mirror.setSelection(find.pos.from,find.pos.to);
            cell.code_mirror.focus();
        } else {
            var ncells = IPython.notebook.ncells();
            if ( IPython.notebook.get_selected_index()+1 == ncells) {
                cell.code_mirror.focus();
            } else {
                IPython.notebook.select_next();
                IPython.notebook.edit_mode();
                cell.code_mirror.setCursor({line:0, ch:0});
                return replace(hotkey);
            }
        }
    };

    /**
     * Create floating toolbar
     *
     */
    var create_searchbar_div = function () {
        var btn = '<div class="btn-toolbar">\
                    <div class="btn-group">\
                    <label for="usr">Search text:</label>\
                     <input id="searchbar_search_text" type="text" class="form-control searchbar_input">\
                     <button id="searchbar_search" class="btn btn-primary fa fa-search searchbar_buttons"></button>\
                     <button id="searchbar_case_sensitive" class="btn btn-primary searchbar_buttons" data-toggle="button" value="OFF" >aA</button>\
                   </div>\
                    <div class="btn-group">\
                    <label for="usr">Replace text:</label>\
                     <input id="searchbar_replace_text" type="text" class="form-control searchbar_input">\
                     <button type="button" id="searchbar_replace" class="btn btn-primary fa fa-search searchbar_buttons"></button>\
                   </div>\
                 </div>';

        var searchbar_wrapper = $('<div id="searchbar-wrapper">')
           .text("Searchbar")
           .append(btn)
           .draggable()
           .append("</div>");

        $("#header").append(searchbar_wrapper);
        $("#searchbar-wrapper").css({'position' : 'absolute'});

        $('#searchbar_search').on('click', function() { search(0); this.blur(); })
            .tooltip({ title : 'Search text' , delay: {show: 500, hide: 100}});
        $('#searchbar_case_sensitive').on('click', function() {  this.blur(); })
            .tooltip({ title : 'Case sensitive' , delay: {show: 500, hide: 100}});
        $('#searchbar_replace').on('click', function() { replace(0); this.blur(); })
            .tooltip({ title : 'Replace text' , delay: {show: 500, hide: 100}});
        $('#searchbar_search_text').on('keyup', function(event) { search(event.keyCode);});
        $('#searchbar_replace_text').on('keyup', function(event) { replace(event.keyCode);});
        IPython.notebook.keyboard_manager.register_events($('#searchbar_search_text'));
        IPython.notebook.keyboard_manager.register_events($('#searchbar_replace_text'));
    };

    /**
     * Show/hide toolbar
     *
     */
    var toggle_toolbar = function() {
        var dom = $("#searchbar-wrapper");

        if (dom.is(':visible')) {
            $('#toggle_searchbar').removeClass('active').blur();
            dom.hide();
        } else {
            $('#toggle_searchbar').addClass('active');
            dom.show();
        }

        if (dom.length === 0) {
            create_searchbar_div()
        }

    };

   IPython.toolbar.add_buttons_group([
           {
               id : 'toggle_searchbar',
               label : 'Toggle Search Toolbar',
               icon : 'fa-search',
               callback : function () {
                   toggle_toolbar();
                   }
           }
        ]);

    $("#toggle_searchbar").css({'outline' : 'none'});

   /**
     * Add CSS file
     *
     * @param name filename
     */
    var load_css = function (name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);
      };

    load_css('./main.css');
});
