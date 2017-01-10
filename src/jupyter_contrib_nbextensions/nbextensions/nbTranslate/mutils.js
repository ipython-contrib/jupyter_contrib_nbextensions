// Maths utilitary functions,
// adapted from latex_envs, see github.com/jfbercher/jupyter_latex_envs

/****************************************************************************************************************
* Series of elementary functions for manipulating nested environments
* needed to do that because standard regular expressions are not well suited for recursive things
****************************************************************************************************************/
var OPENINGENV = '#!<',
    OPENINGENVre = new RegExp(OPENINGENV, 'g');
var CLOSINGENV = '#!>',
    CLOSINGENVre = new RegExp(CLOSINGENV, 'g');

function envSearch(text, env_open, env_close) {
    var reg = new RegExp(env_open + '[\\S\\s]*?' + env_close, 'gm');
    var start = text.match(reg);
    var env_open_re = new RegExp(env_open);
    var env_close_re = new RegExp(env_close);
    var retval;
    var r = "";
    if (typeof(start[0]) != 'undefined' && start[0] != null) {
        var r = start[0].substr(1)
    }
    var out = env_open_re.test(r) //test if there exists an opening env at level +1 
        //of the same kind inside

    if (out) { //in such case: replace the new opening at level +1 and the closing at level
        var rnew = r.replace(env_close_re, CLOSINGENV).replace(env_open_re, OPENINGENV)
        .replace(/\$\$/g,"!@$!@$") //last replace is because "$$" in the replacement string does not work
        var text = text.replace(r, rnew).replace(/!@\$/g,"$");
        if (env_open_re.test(rnew)) { // if it remains nested envs, call the function again
            retval = envSearch(text, env_open, env_close);
            if (retval !== undefined) {
                text = retval;
            }
        }
        return text
    }
    return text
}

function nestedEnvSearch(text, env_open, env_close) {
    var regtest = new RegExp(env_open + '[\\S\\s]*?' + env_close);
    var inmatches = text.match(regtest);
    if (inmatches != null) {
        for (i = 0; i < inmatches.length; i++) 
            inmatches[i] = inmatches[i].replace(/\*/g, '\\*')
        var n = 0;
        env_open = env_open.replace(/\([\\\+\S ]*?\)/g, function() {
            return inmatches[++n]
        })
        env_close = env_close.replace(/\\\d/g, function(x) {
            return inmatches[parseInt(x.substr(1))]
        })
        var output = envSearch(text, env_open, env_close)
        var matches = output.match(env_open + '([\\S\\s]*?)' + env_close);
        matches[0] = matches[0].replace(OPENINGENVre, env_open.replace('\\\\', '\\'))
            .replace(CLOSINGENVre, env_close.replace('\\\\', '\\'))
        matches[1] = matches[1].replace(OPENINGENVre, env_open.replace('\\\\', '\\'))
            .replace(CLOSINGENVre, env_close.replace('\\\\', '\\'))
        var result = [matches[0], inmatches[1], matches[1]]
        for (i = 0; i < result.length; i++) 
            result[i] = result[i].replace(/\\\*\}/g, '*}')
        return result;
    } else return [];
}


function envReplaceApply(text, matches, replacement) {
    var output;
    if (matches.length != 0) {
        if (replacement instanceof Function) {
            output = text.replace(matches[0], 
                replacement(matches[0], matches[1], matches[2])
                .replace(/\$\$/g,"!@$!@$")).replace(/!@\$/g,"$") 
                //last line because "$$" in the replacement string does not work
        } else if (typeof replacement == "string") {
            output = text.replace(matches[0], replacement)
        }
        return output
    } else {
        return text;
    }
}

function nestedEnvReplace(text, env_open, env_close, replacement, flags) {
    var list_of_matches = [];
    var count = 200; //protection
    var matches = nestedEnvSearch(text, env_open, env_close);
    if (flags == undefined) {
        return envReplaceApply(text, matches, replacement)
    } else if (flags.indexOf('g') !== -1) {
        var tmp_text = text; // tmp text
        while (count-- > 0 & matches.length != 0) {
            list_of_matches.push(matches[0]);
            tmp_text = tmp_text.replace(matches[0], ""); //suppress from tmp_text
            text = envReplaceApply(text, matches, replacement);
            matches = nestedEnvSearch(tmp_text, env_open, env_close);
        }
        return text;
    } else {
        return text;
    }
}

var textEnvs = {'theorem':'theorem', 'lemma':'lemma', 'remark':'remark', 
'example':'example', 'exercise':'exercise', 'corollary':'corollary', 
'proposition':'proposition', 'definition':'definition','problem':'problem', 
'proof':'proof', 'property':'property', 'itemize':'itemize', 'enumerate':'enumerate'}

var textCmds = {'textbf':'textbf', 'textit':'textit', 'underline':'underline', 
'texttt':'texttt', 'textem':'textem', 'emph':'emph'}
//label and ref not added because their content shall not be translated

var OPENmath = 'mathid'//'\u003cmathid',
    OPENmathRe = new RegExp(OPENmath, 'g');
var CLOSEmath = ''//'\u003e',
    CLOSEmathRe = new RegExp(CLOSEmath, 'g');

function removeMaths(text){
    var math=[];
    function replacement(m0,m1,m2) {
        if (m1 in textEnvs){
            math.push('\\begin{'+m1+'}'); var id_beg = math.length;
            math.push('\\end{'+m1+'}'); var id_end = math.length;
            m2 = nestedEnvReplace(m2, '\\\\begin{(\\w+\\\*?)}', '\\\\end{\\1}', replacement, 'g')
            return OPENmath + id_beg + CLOSEmath + m2 + OPENmath + id_end + CLOSEmath;
        }
        else if (m1 in textCmds){
            math.push('\\' + m1 + '{')
            math.push('}')
            return OPENmath + String(math.length - 1) + CLOSEmath + m2 + OPENmath + math.length + CLOSEmath;
        }
        else {
            math.push(m0)
            return OPENmath + math.length + CLOSEmath;
        }
    }
    text = nestedEnvReplace(text, '\\\\begin{(\\w+\\\*?)}', '\\\\end{\\1}', replacement, 'g')    
    text = text.replace(/\\\[([\S\s]*?)\\\]/gm,replacement)
    text = text.replace(/\\\(([\S\s]*?)\\\)/gm,replacement)
    text = text.replace(/\$\$([\S\s]*?)\$\$/gm,replacement)    
    text = text.replace(/\$([\S\s]*?)\$/gm,replacement)    
    text = text.replace(/\\item/gm,replacement)  
    text = text.replace(/\\([\S]*?){([\S\s]*?)}/gm,replacement) //textcmd      
    return [math, text]
}

function restoreMaths(math_and_text) {
    var math = math_and_text[0];
    var text = math_and_text[1];
    var newtext;
    var OPENmathUnicode = escape(OPENmath).replace(/%u([A-F0-9]{4})|%([A-F0-9]{2})/g, function(_, u, x) { return "\\\\u" + (u || '00' + x).toLowerCase() });
    var CLOSEmathUnicode = escape(CLOSEmath).replace(/%u([A-F0-9]{4})|%([A-F0-9]{2})/g, function(_, u, x) { return "\\\\u" + (u || '00' + x).toLowerCase() });
    var mathDetectRe = new RegExp(OPENmathUnicode+'\\s*?(\\d+)\\s*?'+CLOSEmathUnicode, 'gim');
    var cont = true;
    while (cont) {
        var newtext = text.replace(mathDetectRe, function(wholeMatch, n) {
            return math[n - 1];
                });
        /*var newtext = newtext.replace(/\\u003cmathiid\s*?(\d+)\s*?\\u003e/gim, function(wholeMatch, n) {
            return math[n - 1];
                });    */    
        cont = text !== newtext; //recurse in text (possible nesting -- just one level)
        text=newtext;
    }
    return text;
}

var OPENhtml = 'htmlid'
    OPENhtmlRe = new RegExp(OPENhtml, 'g');
var CLOSEhtml = ''//'\u003e',
    CLOSEhtmlRe = new RegExp(CLOSEhtml, 'g');

function removeHtml(text) {
    var html = [];
    function replacement(m0, m1) {
        html.push(m0)
        return OPENhtml + html.length + CLOSEhtml;

    }
    text = text.replace(/<(\S[\S\s]*?)\S>/gm, replacement)
    return [html, text]
}


function restoreHtml(html_and_text) {
    var html = html_and_text[0];
    var text = html_and_text[1];
    var newtext;
    var OPENhtmlUnicode = escape(OPENhtml).replace(/%u([A-F0-9]{4})|%([A-F0-9]{2})/g, function(_, u, x) {
        return "\\\\u" + (u || '00' + x).toLowerCase() });
    var CLOSEhtmlUnicode = escape(CLOSEhtml).replace(/%u([A-F0-9]{4})|%([A-F0-9]{2})/g, function(_, u, x) {
        return "\\\\u" + (u || '00' + x).toLowerCase() });
    var htmlDetectRe = new RegExp(OPENhtmlUnicode + '\\s*?(\\d+)\\s*?' + CLOSEhtmlUnicode, 'gim');
    text = text.replace(htmlDetectRe, function(wholeMatch, n) {
        return html[n - 1];
    });

    return text;
}

