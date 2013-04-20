//----------------------------------------------------------------------------
//  Copyright (C) 2012  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// Slideshow extension 
// Based on the extension included with IPython
// Adds a toolbar and visual hints for slide type
//============================================================================

/**
 * $.getScript('/static/js/celltoolbarpresets/slideshow.js');
 * ```
 * or more generally  
 * ```
 * $.getScript('url to this file');
 * ```
 */
 // IIFE without asignement, we don't modifiy the IPython namespace
(function (IPython) {
    "use strict";

    var CellToolbar = IPython.CellToolbar;
    var slideshow_preset = [];

    var select_type = CellToolbar.utils.select_ui_generator([
            ["-"            ,undefined      ],
            ["Slide"        ,"slide"        ],
            ["Sub-Slide"    ,"subslide"     ],
            ["Fragment"     ,"fragment"     ],
            ["Skip"         ,"skip"         ],
            ["Notes"        ,"notes"        ],
            ],
            // setter
            function(cell, value){
                // we check that the slideshow namespace exist and create it if needed
                if (cell.metadata.slideshow == undefined){cell.metadata.slideshow = {}}
                // set the value
                cell.metadata.slideshow.slide_type = value
                },
            //getter
            function(cell){ var ns = cell.metadata.slideshow;
                // if the slideshow namespace does not exist return `undefined`
                // (will be interpreted as `false` by checkbox) otherwise
                // return the value
                return (ns == undefined)? undefined: ns.slide_type
                },
            "Slide Type");

    CellToolbar.register_callback('slideshow.select',select_type);

    slideshow_preset.push('slideshow.select');

    CellToolbar.register_preset('Slideshow',slideshow_preset);

    var display_slidetype = function(cell) {
        if (cell.metadata.slideshow != undefined){
            var div_slideshow = cell.element.find('div.slideshow');
            var x;
            if (div_slideshow.length == 0) {
                cell.element.prepend('<div class="slideshow"><p>Init</p></div>');
                div_slideshow = cell.element.find('div.slideshow');
            }
            var st = cell.metadata.slideshow.slide_type;
            if (st == "slide" ) {
                console.log(st);
                div_slideshow.html('<p>Slide</p>');
                div_slideshow.css("background","#FFA500"); 
                div_slideshow.css("height","17px"); 
            } else if (st == "subslide" ) {
                div_slideshow.html('<p>Subslide</p>');
                div_slideshow.css("background","#FFFF00"); 
                div_slideshow.css("height","8px"); 
            } else if (st == "fragment" ) {
                div_slideshow.html('<p>Fragment</p>');
                div_slideshow.css("background","0"); 
                div_slideshow.css("height","0px"); 
            } else if (st == "skip" ) {
                div_slideshow.html('<p>Skip</p>');
                div_slideshow.css("background","0"); 
                div_slideshow.css("height","0px"); 
            } else if (st == "notes" ) {
                div_slideshow.css("background","0"); 
                div_slideshow.css("height","0px"); 
                div_slideshow.html('<p>Notes</p>');
            };
        };
    };    

    var set_slide = function(value) {
        var cell = IPython.notebook.get_selected_cell();
        if (cell.metadata.slideshow != undefined && value == 'undefined'){
            var div_slideshow = cell.element.find('div.slideshow');
            div_slideshow.remove();
            cell.metadata.slideshow = undefined;
        } else {
            if (cell.metadata.slideshow == undefined){cell.metadata.slideshow = {}}
            cell.metadata.slideshow.slide_type = value;
            display_slidetype(cell);
        }
    }
        
    /**
     * Mark cells with slideshow metadata
     * 
     */
    var init_slideshow = function () {
        IPython.toolbar.add_buttons_group([
                    {
                        id : 'slide_slide',
                        label : 'Slideshow Slide',
                        icon : 'ui-icon-arrow-1-n',
                        callback : function () {
                        set_slide('slide');
                            }
                    },
                    {
                        id : 'slide_subslide',
                        label : 'Slideshow Sub-Slide',
                        icon : 'ui-icon-arrow-1-ne',
                        callback : function () {
                        set_slide('subslide');
                            }
                    },
                    {
                        id : 'slide_fragment',
                        label : 'Slideshow Fragment',
                        icon : 'ui-icon-arrow-1-se',
                        callback : function () {
                        set_slide('fragment');
                            }
                    },
                    {
                        id : 'slide_skip',
                        label : 'Slideshow Skip',
                        icon : 'ui-icon-cancel',
                        callback : function () {
                        set_slide('skip');
                            }
                    },
                    {
                        id : 'slide_notes',
                        label : 'Slideshow Notes',
                        icon : 'ui-icon-pencil',
                        callback : function () {
                        set_slide('notes');
                            }
                    },
                    {
                        id : 'slide_undef',
                        label : 'Slideshow Undefined',
                        icon : 'ui-icon-closethick',
                        callback : function () {
                        set_slide('undefined');
                            }
                    },
             ]);

        var cells = IPython.notebook.get_cells();
        for(var i in cells){
            var cell = cells[i];
            display_slidetype(cell);
        };
    };
        
    $([IPython.events]).on('notebook_loaded.Notebook',init_slideshow);
    
    console.log('Slideshow extension for metadata editing loaded.');

}(IPython));
