
// Initializations

function onMarkdownCellRendering(event, data) {
    // console.log("recomputing eqs")
    if (MathJaxDefined) MathJax.Hub.Queue(
        ["resetEquationNumbers", MathJax.InputJax.TeX], 
        ["PreProcess", MathJax.Hub], 
        ["Reprocess", MathJax.Hub]
    );
};


var init_nb = function() {
    readBibliography(function() {
        init_cells();
        create_latex_menu();
        add_help_menu_item();
        createReferenceSection();
        Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
    });
}


var init_cells = function() {
    var ncells = Jupyter.notebook.ncells();
    var cells = Jupyter.notebook.get_cells();
    var MarkdownCell = require('notebook/js/textcell').MarkdownCell;
    var maps = initmap(); // this is to reset the counters in case of reload
    var venvironmentMap = maps[0];
    var vcit_table = maps[3];
    environmentMap = maps[0];
    cit_table = maps[3];
    cmdsMap = maps[1];
    eqLabNums = maps[2];
    eqNum = eqNumInitial;
    current_cit = current_citInitial;
    var noevent = true;
    var lastmd_cell;
    for (var i = 0; i < ncells; i++) {
        var cell = cells[i]; 
        if (cell instanceof MarkdownCell) {
            cell.render(noevent);
            lastmd_cell = cell;
        };
    }
    if(typeof lastmd !== "undefined") lastmd_cell.render(); // re-render last md cell and issue rendered.MarkdownCell event
    onMarkdownCellRendering();
}


var init_config = require(['base/js/namespace'], function(Jupyter) {
    var default_config = {
        //EQUATIONS
        'eqNumInitial': 0, // begins equation numbering at eqNum+1
        'eqLabelWithNumbers': true, //if true, label equations with equation numbers; otherwise using the tag specified by \label
        //BIBLIOGRAPHY
        'current_citInitial': 1, // begins citation numbering at current_cit
        'cite_by': 'apalike', //cite by 'number', 'key' or 'apalike' 
        'bibliofile': 'biblio.bib' //or IPython.notebook.notebook_name.split(".")[0]+."bib"
    }
    if (Jupyter.notebook.metadata.latex_envs === undefined) {
        Jupyter.notebook.metadata.latex_envs = default_config;
    }
    cfg = Jupyter.notebook.metadata.latex_envs;
    cite_by = cfg.cite_by; //global
    bibliofile = cfg.bibliofile;
    eqNumInitial = cfg.eqNumInitial;
    eqLabelWithNumbers = cfg.eqLabelWithNumbers;
    eqNum = cfg.eqNumInitial;
    reprocessEqs = true;
})


/** help menu **************************************************************/
    function add_help_menu_item() {

        if ($('#latex_envs_help').length > 0) {
            return;
        }
        var menu_item = $('<li/>')
            .insertAfter('#keyboard_shortcuts');
        var menu_link = $('<a/>')
            .text('LaTeX_envs help')
            .attr('title', 'LaTeX_envs documentation')
            .attr('id', "latex_envs_help")
            .attr('href', '/nbextensions/latex_envs/doc/latex_env_doc.html')
            .attr('target', "_blank")
            .appendTo(menu_item);
        $('<i/>')
            .addClass('fa fa-external-link menu-icon pull-right')
            .prependTo(menu_link);
    }


/** LaTeX_envs menu *********************************************************
* Series of sortcuts to environments in latex_envs
****************************************************************************/

function create_latex_menu(callback) {

    if ($('#Latex_envs').length > 0) {
        return;
    }

    $('#help_menu').parent().before('<li id="Latex_envs"/>')
    $('#Latex_envs').addClass('dropdown')
            .append($('<a/>').attr('href', '#')
            .attr('id', 'latex_envs')
            .addClass('dropdown-toogle')
            .attr('data-toggle', "dropdown")
            .attr('aria-expanded', "false")
            .text("LaTeX_envs"))
            .append($('<ul/>')
            .attr('id', 'latex_envs_menu')
            .addClass('dropdown-menu'))

    //for (var i = 0; i < Object.keys(envsLatex).length; i++) {
    for (var p in envsLatex) {
        var current_env_name = envsLatex[p]['name']
        var current_hint = envsLatex[p]['hint']
        var current_env = envsLatex[p]['env']
        var current_shortcut = envsLatex[p]['shortcut']
        var current_id = "env_" + p
        current_env_name = current_shortcut == "" ? current_env_name : current_env_name + '  (' + current_shortcut + ')'

        var menu_item = $('<li/>').appendTo('#latex_envs_menu')
            .attr('id', 'zozo').attr('title', "titre")

        var menu_link = $('<a/>')
            .text(current_env_name)
            .attr('href', '#')
            .attr('title', current_hint)
            .attr('id', current_id)
            .attr('data-text', current_env)
            .attr('onclick', 'insert_text(this);')
            .appendTo(menu_item);

        if (typeof envsLatex[p]['position'] !== "undefined") {
            menu_link.attr('data-position', envsLatex[p]['position'])
        }

        if (current_shortcut !== "") {
            add_edit_shortcuts[current_shortcut] = {
                help: current_hint,
                help_index: 'ht',
                handler: Function('insert_text($(' + '"#' + current_id + '"))')
            }
        }
    }
    callback && callback();
}

/********************************************************************************************
* Definition of a toolbar that enable to select several options:
*		- equations numbered or labelled
* 		- value of initial counter for equations
*		- style of citations call: by number, eg [1,2], by key, eg [perez2001,buss2012], or apalike
* 			eg (Perez et al., 1988)
*		- name of biblio file (if applicable)
*
*********************************************************************************************/

function config_toolbar(callback){

	if (config_toolbar_present){
		config_toolbar_present=false;
		$("#test").remove();
	    $(site).height($(window).height()-$('#header').height() - $('#footer').height());
		return
	}
	else{
			config_toolbar_present=true;
	}
	cfg=Jupyter.notebook.metadata.latex_envs

	//local to this function
	var cite_by_icon={'number':'fa-sort-numeric-asc', 'key':'fa-key', 'apalike':'fa-pencil-square-o'}
	var cite_by_tmp=cite_by
	var eqLabel_tmp = eqLabelWithNumbers
	var eq_by_icon={true:'fa-sort-numeric-asc', false:'fa-tag'}

    var eqNumtmp=eqNumInitial+1;
    var toolbar = '<b> LaTeX_envs&nbsp;&nbsp;</b>\
    <span style="display: inline-block; vertical-align:bottom; width: 0; height: 1.8em;border-left:2px solid #cccccc"></span>\ </span>&nbsp;\
    <b> Bibliography&nbsp;</b>\
  <input  type="text" value="'+bibliofile+'" id="biblio" class="edit_mode input-xs" style="vertical-align:middle">\
&nbsp;  \
<div id="citeby" class="btn-group ">\
  <a class="btn btn-default" href="#"><i id="menu-refs" class="fa '+ cite_by_icon[cite_by_tmp] +' fa-fw"></i> References</a>\
  <a class="btn btn-default dropdown-toggle" data-toggle="dropdown" href="#">\
    <span class="fa fa-caret-down"></span></a>\
  <ul id="choice" class="dropdown-menu">\
    <li><a href="#"><i class="fa fa-sort-numeric-asc fa-fw"></i> Numbered</a></li>\
    <li><a href="#"><i class="fa fa-key fa-fw"></i> Key</a></li>\
    <li><a href="#"><i class="fa fa-pencil-square-o fa-fw"></i> Apa-like</a></li>\
  </ul>\
</div>\
&nbsp;  \
<span style="display: inline-block; vertical-align:bottom; width: 0; height: 1.8em;border-left:2px solid #cccccc"></span>\
&nbsp;  \
<b> Equations&nbsp;</b>\
  <input  type="text" value="'+eqNumtmp+' " id="eqnum" size=3 style="vertical-align:middle;text-align:right;" class="edit_mode ">\
&nbsp;  \
<div id="eqby" class="btn-group ">\
  <a class="btn btn-default" href="#"><i id="menu-eqs" class="fa '+ eq_by_icon[eqLabelWithNumbers] +' fa-fw"></i> Equations</a>\
  <a class="btn btn-default dropdown-toggle" data-toggle="dropdown" href="#">\
    <span class="fa fa-caret-down"></span></a>\
  <ul id="choice_eq" class="dropdown-menu">\
    <li><a href="#"><i class="fa fa-sort-numeric-asc fa-fw"></i> Numbered</a></li>\
    <li><a href="#"><i class="fa fa-tag fa-fw"></i> Label</a></li>\
  </ul>\
</div>\
<a class="btn btn-default" style="float:right;" href="#" id="suicide"><i class="fa fa-power-off"></i></a>\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
</div>'

  $('head').append('<style> input:focus {\
  border-color: #66afe9;\
  outline: 0;\
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);\
	}</style>')

    var test = $('<div id="test" class="container edit_mode" >')
    .append(toolbar)
//    .draggable()

    
 //$(header).append...   
$("#maintoolbar-container").append(test);
$("#test").css({'padding':'5px'});

                                           
$('#citeby').on('click', '.dropdown-menu li a', function(){
    //console.log($(this).text());
    var tmp_text=$(this).text().trim().toLowerCase()
    switch (tmp_text) {
        case 'numbered':
            cite_by_tmp = 'number';
            break;
        case 'key':    
            cite_by_tmp = 'key';
            break;
        case 'apa-like':    
            cite_by_tmp = 'apalike';
            break;
        default:
            cite_by_tmp = 'apalike';
               }
		$('#menu-refs').removeClass().addClass("fa "+cite_by_icon[cite_by_tmp]+" fa-fw");
		cfg.cite_by=cite_by_tmp //Jupyter.notebook.metadata.latex_envs.cite_by 
		cite_by=cite_by_tmp //Jupyter.notebook.metadata.latex_envs.cite_by 
		init_nb(); 
})
.tooltip({ title : 'Select references style: numbered, by key, or apa-like' , trigger: "hover",  delay: {show: 500, hide: 50}});
   

var kmMode="command";    
$('#biblio').on('focus', function(){
	kmMode=Jupyter.keyboard_manager.mode;	
	Jupyter.keyboard_manager.mode="edit";})
	.on('blur', function() {Jupyter.keyboard_manager.mode=kmMode})
	.on('keypress', function(e) {if (e.keyCode==13){
			$('#biblio').blur();
			cfg.bibliofile=$("#biblio")[0].value; 
			bibliofile=$("#biblio")[0].value;   
			init_nb(); }})
	.tooltip({ title : 'Enter BibTeX biblio filename (default biblio.bib in current directory)' ,trigger: "hover",  delay: {show: 500, hide: 50}});

$('#eqby').on('click', '.dropdown-menu li a', function(){
    //console.log($(this).text());
    var tmp_text=$(this).text().trim().toLowerCase()
    switch (tmp_text) {
        case 'numbered':
            {
            eqLabel_tmp = true;
            if(MathJaxDefined) MathJax.Hub.Config({ TeX: { equationNumbers: {
                autoNumber: "AMS", 
                useLabelIds: true
                } } 
            });
            }
            break;
        case 'label':    
            {
            eqLabel_tmp = false;
            if(MathJaxDefined) MathJax.Hub.Config({ TeX: { equationNumbers: {
                autoNumber: "none", 
                useLabelIds: true
                } } 
            });
            }
            break;
        default:
            {
            eqLabel_tmp = true;
            if(MathJaxDefined) MathJax.Hub.Config({ TeX: { equationNumbers: {
                autoNumber: "AMS", 
                useLabelIds: true
                } } 
            });
            }
               }
		$('#menu-eqs').removeClass().addClass("fa "+eq_by_icon[eqLabel_tmp]+" fa-fw");
		cfg.eqLabelWithNumbers=eqLabel_tmp; //Jupyter.notebook.metadata.latex_envs.eqLabelWithNumbers
		eqLabelWithNumbers=eqLabel_tmp;
		init_cells();
})
.tooltip({ title : 'Select equations referencing: by number or by label' , trigger: "hover", delay: {show: 500, hide: 50}});  


$('#eqnum').on('focus', function(){
	kmMode=Jupyter.keyboard_manager.mode;	
	Jupyter.keyboard_manager.mode="edit";})
	.on('blur', function() {Jupyter.keyboard_manager.mode=kmMode})
	.on('keypress', function(e) {if (e.keyCode==13){
			$('#eqnum').blur();   
			cfg.eqNumInitial=Number($('#eqnum')[0].value)-1; //Jupyter.notebook.metadata.latex_envs.eqNumInitial 
			eqNumInitial=Number($('#eqnum')[0].value)-1;   
			init_cells(); }})
.tooltip({ title : 'Equations numbering begins at...' ,trigger: "hover",  delay: {show: 500, hide: 50}});    

$('#apply').on('click', function (){
    //
    //set the values of global variables
    cite_by=cite_by_tmp //Jupyter.notebook.metadata.latex_envs.cite_by 
    bibliofile=$("#biblio")[0].value  //Jupyter.notebook.metadata.latex_envs.bibliofile 
    eqNumInitial=Number($('#eqnum')[0].value)-1 //Jupyter.notebook.metadata.latex_envs.eqNumInitial
    eqLabelWithNumbers=eqLabel_tmp //Jupyter.notebook.metadata.latex_envs.eqLabelWithNumbers
    //save into notebook's metadata 
    cfg=Jupyter.notebook.metadata.latex_envs
    cfg.cite_by=cite_by_tmp //Jupyter.notebook.metadata.latex_envs.cite_by 
    cfg.bibliofile=$("#biblio")[0].value  //Jupyter.notebook.metadata.latex_envs.bibliofile 
    cfg.eqNumInitial=Number($('#eqnum')[0].value)-1 //Jupyter.notebook.metadata.latex_envs.eqNumInitial
    cfg.eqLabelWithNumbers=eqLabel_tmp //Jupyter.notebook.metadata.latex_envs.eqLabelWithNumbers
	//apply all this
	readBibliography(function (){ 
					init_cells(); 
					createReferenceSection();
					});
    
})
.tooltip({ title : 'Apply the selected values' , trigger: "hover", delay: {show: 500, hide: 50}});

$('#suicide').on('click', function (){
    config_toolbar_present=false;
    $("#test").remove();
    $(site).height($(window).height()-$('#header').height() - $('#footer').height())
}
).tooltip({ title : 'Close the LaTeX-envs configuration toolbar' ,trigger: "hover",  delay: {show: 500, hide: 50}});
    
} 


