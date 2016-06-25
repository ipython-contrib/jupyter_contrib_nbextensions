// Node.js script for html to html conversion,
// substituting html classes to LaTeX theorem like environment constructs
// This applies the same substitutions
// that we use in the live notebook .

var nbextensionsDir='/.local/share/jupyter/nbextensions' // for Jupyter, '/.ipython/nbextensions' for IPython
var static_path = "/usr/share/ipython/notebook/static"; //for IPython 3.x on Debian
// /usr/share/jupyter/notebook/static // probably for Jupyter (on Debian);
var marked = require( static_path + '/components/marked/lib/marked.js');



// read the markdown from stdin
var html_to_analyse='';
process.stdin.on("data", function (data) {
    html_to_analyse += data;
});



// perform the html transform once stdin is complete
process.stdin.on("end", function () {
var fs = require('fs');
var IPython;


//TODO It should be nice to read the value of these variables from the notebook's metada. As it should...
var eqNum = 0; // begins equation numbering at eqNum+1
var eqLabelWithNumbers = true; //if true, label equations with equation numbers; otherwise using the tag specified by \label
var conversion_to_html = true;
var current_cit=1;
var cite_by='key';  //only number and key are supported
var document={}
document.bibliography={};

// Read the actual conversion script file, located in $HOME/.../nbextensions
eval(fs.readFileSync( process.env['HOME'] + nbextensionsDir +"/usability/latex_envs/thmsInNb4.js", 'utf8') );


    //IPython.mathjaxutils.init();
    var html_converted = thmsInNbConv(marked,html_to_analyse);

    process.stdout.write(html_converted);

});
