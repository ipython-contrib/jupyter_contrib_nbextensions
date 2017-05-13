
/*
This script goes through the input text (actually it is triggered each time a markdown cell is rendered. The imput text is the content of the cell.
It replaces the latex structures by html tags, typically wit a <div class="latex_environment_name> ... </div>. Then the html rendering 
can be tailored using a devoted css. The original idea comes from
https://github.com/benweet/stackedit/issues/187
where the contributors to stackedit, the online markdown editor, discussed the processing of LaTeX environments. 
The code has evolved from this base and was adapted to the particular case and specificities of the Jupyter. 
*/

function initmap(){
    var eqLabNums = {};
    var thmCounter  = { num: 0 };
    var excsCounter = { num: 0 };
    var figCounter = { num: 0 };

    var environmentMap = {
                    thm:      { title: "Theorem"    ,counter: thmCounter  },
                    lem:      { title: "Lemma"      ,counter: thmCounter  },
                    cor:      { title: "Corollary"  ,counter: thmCounter  },
                    prop:     { title: "Property"   ,counter: thmCounter  },
                    defn:     { title: "Definition" ,counter: thmCounter  },
                    rem:      { title: "Remark"     ,counter: thmCounter  },
                    prob:     { title: "Problem"    ,counter: excsCounter },
                    excs:     { title: "Exercise"   ,counter: excsCounter },
                    examp:    { title: "Example"    ,counter: excsCounter },
                    property:     { title: "Property"   ,counter: thmCounter  },
                    theorem:      { title: "Theorem"    ,counter: thmCounter  },
                    lemma:        { title: "Lemma"      ,counter: thmCounter  },
                    corollary:    { title: "Corollary"  ,counter: thmCounter  },
                    proposition:  { title: "Property"   ,counter: thmCounter  },
                    definition:   { title: "Definition" ,counter: thmCounter  },
                    remark:       { title: "Remark"     ,counter: thmCounter  },
                    problem:      { title: "Problem"    ,counter: excsCounter },
                    exercise:     { title: "Exercise"   ,counter: excsCounter },
                    example:      { title: "Example"    ,counter: excsCounter },
                    figure:      { title: "Figure"    ,counter: figCounter },
                    itemize:      { title: "Itemize"     },
                    enumerate:    { title: "Enumerate"    },
                    listing:    { title: " "    },
                    textboxa:     { title: " "  },
                    proof:    { title: "Proof" }
                };


    //This is to substitute simple LaTeX+argument commands 
    // For instance \textbf{foo} is replaced by <b> foo </b>
    var cmdsMap =  {
        underline:  {  replacement: "u"  },
        textit:     {  replacement: "i"  },
        textbf:     {  replacement: "b"  },
        textem:     {  replacement: "em" },
        section:    {  replacement: "h1" },
        subsection: { replacement: "h2"  },
    }
    return [environmentMap, cmdsMap, eqLabNums]
}

var maps = initmap();
environmentMap=maps[0];
cmdsMap=maps[1];
eqLabNums=maps[2];




/*********/

function thmsInNbConv(marked,text) {

    var listings = [];

            { //****************************************************************************
                var EnvReplace = function(message) {
                    //console.log(message);

                    //Look for pairs [ ]
                    var message = message.replace(/^(?:<p>)?\[([\s\S]*?)^(?:<p>)?\]/gm,
                        function(wholeMatch, m1) {
                            //return "\\["+m1+"\\]";
                            m1 = m1.replace(/<[/]?em>/g, "_"); //correct possible incorrect md remplacements in eqs
                            m1 = m1.replace(/left{/g, "left\\{"); //correct possible incorrect md remplacements in eqs
                            return "\\[" + m1 + "\\]";
                        }
                    );

                    var message = message.replace(/(?:<p>)?([$]{1,2})([\s\S]*?)(?:<p>)?\1/gm,
                        function(wholeMatch, m1) {
                            //return "\\["+m1+"\\]";
                            wholeMatch = wholeMatch.replace(/<[/]?em>/g, "_"); //correct possible incorrect md remplacements in eqs
                            wholeMatch = wholeMatch.replace(/left{/g, "left\\{"); //correct possible incorrect md remplacements in eqs
                            return wholeMatch;
                        }
                    );

                    
                    var out = message.replace(/\\begin{(\w+)}([\s\S]*?)\\end{\1}/gm, function(wholeMatch, m1, m2) {


                        //if(!environmentMap[m1]) return wholeMatch;
                        var environment = environmentMap[m1];
                        if (!environment) return wholeMatch;
                        

                        var title = environment.title;
                        if (environment.counter) {
                            environment.counter.num++;
                            title += ' ' + environment.counter.num;
                        }
                        //The conversion machinery (see marked.js or mathjaxutils.js) extracts text and math and converts text to markdown. 
                        //Here, we also want to convert thm like env. 
                        //So we do it here. However, environments with blank lines are *not* extracted before and thus already converted. 
                        // Thus we avoid to process them again.
                        // Try to check if there is remaining Markdown
                        // |\n\s-[\s]*(\w+)/gm
                        // /\*{1,2}([\s\S]*?)\*{1,2}|\_{1,2}([\s\S]*?)\_{1,2}/gm)
                        if (m2.match(/\*{1,2}([\s\S]*?)\*{1,2}|\_{1,2}([\S]*?)\_{1,2}|```/gm)) {
                            var m2 = marked.parser(marked.lexer(m2));
                        }


                        var result = '<span class="latex_title">' + title + '</span> <div class="latex_' + m1 + '">' + m2;

                        // case of the figure environment. We look for an \includegraphics directive, gobble its parameters except the image name,
                        // look for a caption and a label and construct an image representation with a caption and an anchor. Style can be customized 
                        // via the class latex_img

                        if (m1 == "figure") {
                            
                            var caption = /\\caption{([\s\S]*?)}/gm.exec(m2)[1];
                            var graphic = /\\includegraphics(?:[\S\s]*?){([\s\S]*?)}/gm.exec(m2)[1];
                            var label = m2.match(/<a id=([\s\S]*?)a>/gm);
                            if (!caption.match(/<a id=([\s\S]*?)a>/gm)) {caption=label+caption};
                            
                            var result = '<div class="latex_figure"> <img class="latex_img" src="'+graphic+'"> <p class="latex_img"> ' +  title+': ' + caption + '</p>';
                        };



                        if (m1 == "proof") {
                            result += '<span class="latex_proofend" style="float:right">■</span>';
                        }

                        if (m1 == "itemize") {
                            var result = "<div><ul>" + m2.replace(/\\item/g, "<li>") + "</ul>";
                        };

                        if (m1 == "enumerate") {
                            var result = "<div><ol>" + m2.replace(/\\item/g, "<li>") + "</ol>";
                        };

                        if (m1 != "listing") {
                            result = EnvReplace(result);
                        }; //try to do further replacements

                        return result + '</div>';
                    });
                    //out = EnvReplace(out);

                    return out; //}

                }
            } 
            //**********************************************************************************
            // What follows is done on the whole text, environments included:
            // - substitutions of labels with anchors
            // - substitutions of ref with links
            // - LaTeX commands (textbf, textit, etc) replaced by html tags

            // We want to preserve a "listing" environment from **any modification**
                // therefore we remove them and insert them back at the end
            
            var remove_listing = function (text)  {
                text = text.replace(/\\begin{listing}([\s\S]*?)\\end{listing}/gm, function(wholeMatch, m1) {
                listings.push(m1); 
                return '!@!Listing'+listings.length+'!@!'; //originallistings location are marked by !@!Listingn!@!, n being the index of listing
                });
               
                return text;
            };

            text = remove_listing(text)
    

            // Now we can do our stuff


            {
                // This is to replace references by links to the correct environment, 
                //while preserving links to equations
                // which are worked out by MathJax

                //LABELS
                var text = text.replace(/\\label{(\S+):(\S+)}/g, function(wholeMatch, m1, m2) {
                    m2 = m2.replace(/<[/]?em>/g, "_");
                    if (m1 == "eq") {
                        if (conversion_to_html) {
                            /*  if (eqLabelWithNumbers) {
                        eqNum++;
                        return wholeMatch + '\\tag{'+eqNum+'}' ;
                       */
                            return wholeMatch; //+ '\\tag{'+m1+':'+m2+'}' ; 
                        } else {
                            if (eqLabelWithNumbers) {
                                eqNum++;
                                //return '<a id="' + m1 + m2 + '">' + '['+m1+':'+m2+']' + '</a>' + '\\tag{'+eqNum+'}' ;
                                eqLabNums[m2] = eqNum.toString();

                                return '\\tag{' + eqNum + '}' + '<!--' + wholeMatch + '-->' ;
                            }
                            return '\\tag{' + m2 + '}' + '<!--' + wholeMatch + '-->';
                        };
                    }
                    return '<a id="' + m1 + m2 + '">' + '[' + m1 + ':' + m2 + ']' + '</a>';
                });


                //REFERENCES
                var text = text.replace(/\\ref{(\S+):(\S+)}/g, function(wholeMatch, m1, m2) {
                    m2 = m2.replace(/<[/]?em>/g, "_");
                    if (conversion_to_html) {
                        if (m1 == "eq") return wholeMatch;
                    } else {
                        if (m1 == "eq") {
                            if (eqLabelWithNumbers) {
                                return eqLabNums[m2];
                            } else return m1 + ':' + m2;
                        }
                    }

                    return '<a class="latex_ref" href="#' + m1 + m2 + '">' + '[' + m1 + ':' + m2 + ']' + '</a>';
                });



                {


                    text = EnvReplace(text);

                    // LaTeX commands replacements (eg \textbf, \texit, etc)
                    var text = text.replace(/\\([\w]*){(.+?)}/g, function(wholeMatch, m1, m2) {

                        var cmd = cmdsMap[m1];
                        if (!cmd) return wholeMatch;
                        var tag = cmd.replacement;
                        return '<' + tag + '>' + m2 + '</' + tag + '>';
                    });

                    //Other small replacements
                    var text = text.replace(/\\index{(.+?)}/g, function(wholeMatch, m1) {
                        return '';
                    });
                    var text = text.replace(/\\noindent/g, "");
                    var text = text.replace(/\\(?:<\/p>)/g, "</p>");



                };
                
            };

            //insert back listings in the text

            text = text.replace(/!@!Listing(\d+)!@!/gm, function(wholeMatch, n) {
                        return '<pre>' + listings[n-1] + '</pre>';
            });

            return text;

        };
