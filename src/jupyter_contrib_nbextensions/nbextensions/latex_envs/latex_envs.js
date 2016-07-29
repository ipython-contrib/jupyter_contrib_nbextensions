
/*

*/

var conversion_to_html = false;
var config_toolbar_present=false;

var cite_by, bibliofile, eqNumInitial, eqNum, eqLabelWithNumbers; //These variables are initialized in init_config()
var MathJaxDefined=!(typeof MathJax == "undefined")

// make sure that equations numbers are enabled
if(MathJaxDefined) {
MathJax.Hub.Config({ processSectionDelay: 0,  TeX: { equationNumbers: {
    autoNumber: "AMS", // All AMS equations are numbered
    useLabelIds: true, // labels as ids
    // format the equation number - uses an offset eqNumInitial (default 0)
    formatNumber: function (n) {return String(Number(n)+Number(eqNumInitial))} 
    } } 
});
MathJax.Hub.processSectionDelay=0;
}

var reprocessEqs;

//EQUATIONS
//var eqNumInitial = 0;
//var eqNum = eqNumInitial; // begins equation numbering at eqNum+1
//var eqLabelWithNumbers = true; //if true, label equations with equation numbers; otherwise using the tag specified by \label

//BIBLIOGRAPHY 
//var cite_by = 'apalike'  //cite by 'number', 'key' or 'apalike'
var current_citInitial=1;
var current_cit=current_citInitial; // begins citation numbering at current_cit
//var bibliofile = 'biblio.bib' //or IPython.notebook.notebook_name.split(".")[0]+."bib"


//citations templates ........................................................

var etal=3;   //list of authors is completed by et al. if there is more than etal authors
var cit_tpl = {
// feel free to add more types and customize the templates
    'INPROCEEDINGS': '%AUTHOR:InitialsGiven%, ``_%TITLE%_\'\', %BOOKTITLE%, %MONTH% %YEAR%.',
    'TECHREPORT': '%AUTHOR%, ``%TITLE%\'\', %INSTITUTION%, number: %NUMBER%,  %MONTH% %YEAR%.',
    'ARTICLE' : '%AUTHOR:GivenFirst%, ``_%TITLE%_\'\', %JOURNAL%, vol. %VOLUME%, number %NUMBER%, pp. %PAGES%, %MONTH% %YEAR%.',
    'INBOOK' : '%AUTHOR:Given%, ``_%TITLE%_\'\', in %BOOKTITLE%, %EDITION%, %PUBLISHER%, pp. %PAGES%, %MONTH% %YEAR%.',
    'UNKNOWN' : '%AUTHOR:FirstGiven%, ``_%TITLE%_\'\', %MONTH% %YEAR%.'
}
/* The keys are the main types of documents, eg inproceedings, article, inbook, etc. To each key is associated a string where the %KEYWORDS% are the fields of the bibtex entry. The keywords are replaced by the correponding bibtex entry value. The template string can formatted with additional words and effects (markdown or LaTeX are commands are supported)

Authors can be formatted according to the following keywords:
- %AUTHOR:FirstGiven%, i.e. John Smith
- %AUTHOR:GivenFirst%, i.e. Smith John
- %AUTHOR:InitialsGiven%, i.e. J. Smith
- %AUTHOR:GivenInitials%, i.e. Smith J.
- %AUTHOR:Given%, i.e. Smith
*/

// *****************************************************************************

// use AMD-style simplified define wrapper to avoid http://requirejs.org/docs/errors.html#notloaded
define(function (require, exports, module) {
   var Jupyter = require('base/js/namespace');
   var thmsInNb = require('nbextensions/latex_envs/thmsInNb4');
   var bibsInNb = require('nbextensions/latex_envs/bibInNb4');
   var initNb = require('nbextensions/latex_envs/initNb');

    var maps = initmap();
    environmentMap=maps[0];
    cmdsMap=maps[1];
    eqLabNums=maps[2];
	cit_table = maps[3];


	init_config();
	cfg= Jupyter.notebook.metadata.latex_envs;

	var MarkdownCell = require('notebook/js/textcell').MarkdownCell;
 	var TextCell = require('notebook/js/textcell').TextCell;
	var mathjaxutils = require('notebook/js/mathjaxutils');
	var security=require("base/js/security")
 	var marked = require('components/marked/lib/marked');

    //define(["require"], function (require) {
    var load_css = function(name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        //link.href = name;
        document.getElementsByTagName("head")[0].appendChild(link);

    };

	var load_ipython_extension = require(['base/js/namespace'], function(Jupyter){

		"use strict";
		if (Jupyter.version[0] < 3) {
            console.log("This extension requires Jupyter or IPython >= 3.x")
            return
        	}

        var _on_reload = true; /* make sure cells render on reload */



        /* Override original markdown render function */
        
            // for IPython v 3+ / Jupyter 4

    MarkdownCell.prototype.render = function (noevent) {
        if(typeof noevent === "undefined") noevent=false;

        var cont = TextCell.prototype.render.apply(this);
        if (cont || Jupyter.notebook.dirty || _on_reload) {
            var that = this;
            var text = this.get_text();
            var math = null;
            if (text === "") { text = this.placeholder; }
            var text_and_math = mathjaxutils.remove_math(text);
            text = text_and_math[0];
            math = text_and_math[1];
            marked(text, function (err, html) {
                html = mathjaxutils.replace_math(html, math);
                var htmlout = thmsInNbConv(marked,html); //<----- thmsInNb patch here
                html = security.sanitize_html(htmlout);
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
                that.set_rendered(html);
                that.typeset();
                if(!noevent)
                that.events.trigger("rendered.MarkdownCell", {cell: that});
            });
        }
        return cont;
    }; 



// reset eq numbers on each markdown cell modification
    $([IPython.events]).on("rendered.MarkdownCell", onMarkdownCellRendering);



        //init_cells();
		readBibliography(function (){
					init_cells();
					createReferenceSection();
					});


		/* on reload */
        $([Jupyter.events]).on('status_started.Kernel', function() {

            //init_cells();
			readBibliography(function (){
					init_cells();
					createReferenceSection();
					});
            _on_reload = false;
        })


            Jupyter.toolbar.add_buttons_group([
                {
            id : 'doReload',
            label : 'LaTeX_envs: Refresh rendering of labels, equations and citations',
            icon : 'fa-refresh',
            callback : init_cells
                },
				{
			'label'   : 'Read bibliography and generate references section',
			'icon'    : 'fa-book',
			'callback': generateReferences
				},
				{
			'label'   : 'LaTeX_envs: Some configuration options (toogle toolbar)',
			'icon'    : 'fa-wrench',
			'callback': config_toolbar
				}
            ]);



   // });

}); //end of load_ipython_extension function

    console.log("Loading latex_envs.css");

    //load_css('/nbextensions/latex_envs.css')
    load_css('./latex_envs.css')



    //load_ipython_extension();
    return {
        load_ipython_extension: load_ipython_extension,
    };
}); //End of run_this

//run_this();
console.log("Loading ./latex_envs.js");
