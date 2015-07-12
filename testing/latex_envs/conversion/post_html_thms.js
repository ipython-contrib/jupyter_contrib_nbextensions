// Node.js script for html to html conversion, 
// substituting html classes to LaTeX theorem like environment constructs
// This applies the same substitutions 
// that we use in the live notebook .


// read the markdown from stdin
var html_to_analyse='';
process.stdin.on("data", function (data) {
    html_to_analyse += data;
});



// perform the html transform once stdin is complete
process.stdin.on("end", function () {
var fs = require('fs');
var IPython;

var static_path = "/usr/share/ipython/notebook/static/";
var marked = require( static_path + 'components/marked/lib/marked.js');

var eqNum = 0; // begins equation numbering at eqNum+1
var eqLabelWithNumbers = true; //if true, label equations with equation numbers; otherwise using the tag specified by \label
var conversion_to_html = true;

// Read the actual conversion script file, located in $HOME/.ipython/nbextensions
eval(fs.readFileSync( process.env['HOME'] + "/.ipython/nbextensions/thmsInNb.js", 'utf8') );


    //IPython.mathjaxutils.init();
    var html_converted = thmsInNbConv(marked,html_to_analyse);
    
    process.stdout.write(html_converted);
																																																	
});

