/*
This file contains some functions used for bibliography formatting.
The bibtex bibliography is read by `readBibliography` and parsed using
the bibtex [bibtex-js](https://code.google.com/p/bibtex-js/) parser.
The bibliography object is stored  in document.bibliography. A reference
section is added at the end of the notebook. Citations are formated according
to the simple templates described in the object cit_tpl (see the file latex_envs_jup).
These templates can be customized.
*/

if (typeof Jupyter == 'undefined'){var Jupyter=IPython;} //for IPython 3.x
document.bibliography={};
var bibmsg="";

function readBibliography(callback){
require(["nbextensions/latex_envs/bibtex2"], function () {
   	
	document.bibliography={}; bibmsg="";
    document.bibtex_parser = new BibtexParser();

    function parse_bibtex(string) {
        document.bibtex_parser.setInput(string);
        document.bibtex_parser.bibtex();
        // {KEY: {AUTHOR:..., BIB_KEY:...}}
        return document.bibtex_parser.getEntries();
    }

    $.get(bibliofile, function (data){
        var json = parse_bibtex(data)
        $.extend(document.bibliography, json);
    }).fail(function () {bibmsg="The bib file "+bibliofile+" was not found\n\n"; console.log(bibmsg)})
	.always(function (){if (typeof callback != "undefined") {callback()}})

    })
	return true
}

//..... This function is from calico-documents-tools.js .........
    function find_cell(cell_type, text) {
	// Finds first cell of cell_type that starts with text
	// cell_type and text are interpreted as a regular expression
	var cell = undefined;
	var cells = Jupyter.notebook.get_cells();
	for (var x = 0; x < cells.length; x++) {
	    var temp = cells[x];
	    if (temp.cell_type.match(cell_type) != undefined) {
		var temp_text = temp.get_text();
		var re = new RegExp("^" + text);
		if (re.test(temp_text)) {
		    cell = cells[x];
		    break;
		}
	    }
	}
	return cell;
    }
//.............................................................


function createReferenceSection() {

	//console.log("Create refs section");
	if (Object.keys(cit_table).length==0){ //it is not necessary to create the reference section since there will be nothing in it!
	return
}


//..... This part is from calico-documents-tools.js .......
	// If there is a References section, replace it:
	var reference_cell = find_cell("markdown", "#+ References");
	var cells = Jupyter.notebook.get_cells();
	// default to top-level heading:
	var references = "# References\n\n";
	if (reference_cell == undefined) {
            reference_cell = Jupyter.notebook.select(cells.length-1).insert_cell_below("markdown");
	} else {
	    // already exists:
	    references = reference_cell.get_text().match("# References")[0] + "\n\n";
	}
//............................................................

if (bibmsg!="") {references += '<mark> <b>' +  bibmsg + '</b> </mark>'};
var str="Nothing yet"
for (key in  cit_table) {  // cit_table is populated during the edition and rendering of each markdown cell. It is possible to reload all citations by pressing the toolbar LaTeX refresh button
    var citation = document.bibliography[key.toUpperCase()];
	var opening_cit='[';  var closing_cit=']';
    if (cite_by=='apalike'){var opening_cit='(';  var closing_cit=')' }
     str = opening_cit +'<a id="cit-'+ key + '"'+' href="#call-' + key + '">'
                +  cit_table[key]['key']  + '</a>' + closing_cit+' '
    if (!(citation==undefined)){
		//check the type of citation, eg ARTICLE, INPROCEEDINGS, INBOOK, etc
        if (citation['reftype'] in cit_tpl) {var type=citation['reftype']} else {var type='UNKNOWN'};

		//replace %words% in template
        str += cit_tpl[type].replace(/%([\w:]+)+%/g, function(rep) {
				//case of %AUTHOR:format%
				if (rep.slice(1,7)=='AUTHOR') {
					var out=rep.slice(1,-1).split(':');
					if (out.length>1) {
						 var val=formatAuthors(makeAuthorsArray(citation['AUTHOR']),out[1],etal);
					}
					else{
						 var val=formatAuthors(makeAuthorsArray(citation['AUTHOR']),'default',etal);
					}
				return val
				//case of other keywords
				}
				else{
					if (citation[rep.slice(1, -1)]==undefined)
						return "";
					else
	        			return citation[rep.slice(1, -1)].replace(/[{}]/g,"") || "";
					}
				 });
		//
        if (citation['URL']!=undefined) {str+= '  [online]('+citation['URL']+')'};
    }
    else {
        str+="!! _This reference was not found in "+ bibliofile +" _ !!"
    }
    references += str + '\n\n'
    //console.log(str)

    reference_cell.unrender();
    reference_cell.set_text(references);
    reference_cell.render();
    }
}

function generateReferences() {

	readBibliography(createReferenceSection);
	}

// ........... Other utilitary functions for formatting authors and references .........

function authorSplit(singleAuthor) {
    var firstName, givenName, jr;
	switch (singleAuthor.split(',').length) {
		case 1:
		    firstName=singleAuthor.split(' ')[0];
		    givenName=singleAuthor.split(' ')[1];
		    break;
		case 2:
		    firstName=singleAuthor.split(', ')[1];
		    givenName=singleAuthor.split(', ')[0];
		    break;
		case 3:
		    firstName=singleAuthor.split(', ')[2];
		    givenName=singleAuthor.split(', ')[0];
		    jr=singleAuthor.split(', ')[1];
		    break;
	}
	return {firstName:firstName.trim(), givenName:givenName.trim()}
}


function makeAuthorsArray(bibtexAuthors){
    var listSingleAuthors=bibtexAuthors.split(' and ');
    var authorsArray=listSingleAuthors.map(
    function(x) {
         return authorSplit(x)
             });
    return authorsArray
}


function formatSingleAuthorObject(author,format){
        var str;
        switch (format){
            case 'InitialsGiven':
                str = author.firstName.split(' ').reduce(function (x,y){return x+y[0].toUpperCase()+'.'},'')
                + ' '+ author.givenName;
                break;
            case 'GivenInitials':
                str = author.givenName + ' '+ author.firstName.split(' ').reduce(function (x,y){return x+y[0].toUpperCase()+'.'},'') ;
                break;
            case 'FirstGiven':
                str =  author.firstName + ' '+ author.givenName;
                break;
            case 'GivenFirst':
                str =  author.givenName +' '+ author.firstName;
                break;
            case 'Given':
                str =  author.givenName;
                break;
            default:
                str =  author.firstName +' '+ author.givenName;
        }
     return str;
    }


function formatAuthors(authorsArray, format, etal){
    etal= typeof etal !== 'undefined' ? etal : 2;  //default value
    var str="";
    var kmax;
    fullAuthors = authorsArray.length<=etal
    fullAuthors ? kmax=authorsArray.length : kmax=etal+1
    for (var k = 0; k < kmax-1; k++){
        str += formatSingleAuthorObject(authorsArray[k],format)+', '
    }
    str=str.slice(0,-2) //cut last 2 chars
    if (fullAuthors) {
		if (kmax>1) {str += ' and '}
        str += formatSingleAuthorObject(authorsArray[k],format)
        }
    else{
        str += ' <em>et al.</em>'
    }
    return str
}
