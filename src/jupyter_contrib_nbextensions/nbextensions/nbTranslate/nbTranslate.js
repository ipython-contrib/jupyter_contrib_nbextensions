// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.
// Author: Jean-François Bercher 


//var config_toolbar_present = false; 
var listOfLangsInNotebook = [];
var log_prefix = '[nbTranslate] ';
var nbTranslate_toolbarNotYetDisplayed = true;

var langs = {
    'auto': 'Automatic',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'zh-cn': 'Chinese Simplified',
    'zh-tw': 'Chinese Traditional',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    'iw': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'ma': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sudanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
};

// test if array contains an element
function inArray(array, element){
    return array.indexOf(element) > -1; // is not supported by old IE but doesn't really matter
};

/*Extend array prototype to include a contains method
Array.prototype.contains = function(element){
    return this.indexOf(element) > -1; // is not supported by old IE but doesn't really matter
};
Array.prototype.addIfNotAlreadyIn = function(element){
    if (this.indexOf(element) == -1){ // is not supported by old IE but doesn't really matter
    this.push(element)}
};
*/

console.log(log_prefix, " Overriding run-range javascript function");
requirejs("notebook/js/notebook").Notebook.prototype.execute_cell_range = function(start, end) {
    this.command_mode();
    for (var i = start; i < end; i++) {
        this.select(i);
        var c = this.get_selected_cell();
        if (c.element.is(':visible')) {
            this.execute_cell();
        } else {
            //console.log("do nothing for cell",i);
        }
    }
};


function translateCurrentCell() {
    //alert(log_prefix+" run on action")
    conf = Jupyter.notebook.metadata.nbTranslate
    var cell = Jupyter.notebook.get_selected_cell();
    var cellText = cell.get_text();
    var maths_and_text = removeMaths(cellText)
    var html_and_text = removeHtml(maths_and_text[1])
    var sourceText = html_and_text[1]; 
    var mdReplacements = {'*': '<*>', '**': '<**>',
        '_': '<_>', '__': '<__>'}  
    // **, *, _, and __ in markdown are "protected" with <.> 
    // which seems to survive the google translation -- not always, actually
    sourceText = sourceText.replace(/([\*|_]{1,2})([\s\S]*?)\1/g, 
        function(m0,m1,m2){return mdReplacements[m1]+m2+mdReplacements[m1]})
    cell.metadata.lang = conf.sourceLang;
    var translated_text = "";
    if (conf.useGoogleTranslate) {
        var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + conf.sourceLang + "&tl=" + conf.targetLang + "&dt=t&q=" + encodeURIComponent(sourceText);
        var result = $.get(url)
        .done(function(data, text, obj) {
            if (obj.status == 200) {
                var translated_text = processGoogleTranslateResponse(obj.responseJSON);

            } else {
                var translated_text = sourceText;
            }

            translated_text = restoreHtml([html_and_text[0], translated_text])
            translated_text = restoreMaths([maths_and_text[0], translated_text])
            translated_text = 
            translated_text.replace(/\\label{([\s\S]*?)}/g, function(m0,m1){return "\\label{"+m1+"-"+conf.targetLang+"}"})
                           .replace(/\\ref{([\s\S]*?)}/g, function(m0,m1){return "\\ref{"+m1+"-"+conf.targetLang+"}"})
            insertTranslatedCell(translated_text, cell.rendered)
        })
    } else {
        insertTranslatedCell(cellText, cell.rendered)
    }
}


function processGoogleTranslateResponse(responseJSON) {
    var translated_text = "";

    var list_paragraphs = responseJSON[0]
    //var list_paragraphs = data.responseText.match(/\[\"([\S\s]*?)\",/g)
             
    list_paragraphs.forEach(
        function(elt) {
            translated_text += elt[0] //.substring(2, elt.length - 2)
        })
    translated_text = translated_text.replace(/([^\\])\\n/g, "$1\n").replace(/([^\\])\\n/g, "$1\n")
        .replace(/\\\\/g, "\\") // unescape
        .replace(/\\"/g, '"') // replace double quotes
        .replace(/\\u003c([\*|_|@]{1,2})\\u003e\s*([\s\S]*?)\s*\\u003c\1\\u003e/g, function(m0,m1,m2){return m1+m2+m1})        
        .replace(/<([\*|_|@]{1,2})>\s*([\s\S]*?)\s*<\1>/g, function(m0,m1,m2){return m1+m2+m1})        
    
    /*for (item in mdReplacements) {
        var pattern = new RegExp(mdReplacements[item], 'gmi');
        translated_text = translated_text.replace(pattern, item);
    }*/

    // Remove spurious md remaining 
    translated_text = translated_text.replace(/\\u003c([\*|_|@]{1,2})\\u003e/g, "")
    // Remove extra spaces in markdown
    translated_text = translated_text.replace(/([\*|_|@]{1,2})\s*([\s\S]*?)\s*\1/g, function(m0,m1,m2){return m1+m2+m1})        
    return translated_text;
}


function insertTranslatedCell(translated_text, render) {
    conf = Jupyter.notebook.metadata.nbTranslate
    Jupyter.notebook.insert_cell_below("markdown");
    Jupyter.notebook.select_next();
    var new_cell = Jupyter.notebook.get_selected_cell();
    new_cell.set_text(translated_text);
    new_cell.metadata.lang = conf.targetLang;
    if (render) new_cell.render();
}

function show_mdcells(displayLangs) {
        // only show cells with lang or nothing
        var ncells = Jupyter.notebook.ncells();
        var cells = Jupyter.notebook.get_cells();
        var MarkdownCell = requirejs('notebook/js/textcell').MarkdownCell;
        var lastmd_cell;
        for (var i = 0; i < ncells; i++) {
            var cell = cells[i]; 
            if (cell instanceof MarkdownCell) {
                if (typeof cell.metadata.lang != "undefined") {
                    if (!inArray(listOfLangsInNotebook, cell.metadata.lang)){
                        listOfLangsInNotebook.push(cell.metadata.lang)
                    }
                } 
                if (typeof cell.metadata.lang == "undefined" || 
                         inArray(displayLangs, cell.metadata.lang) || 
                         inArray(displayLangs, '*')) {
                    if (!cell.rendered) cell.render();
                    cell.element.show();
                    lastmd_cell = cell;
                }
                else {
                    cell.set_rendered("");
                    cell.rendered = false ; 
                    cell.element.hide();
            }
        }
        }
        // this is to update toc contents.
        if(typeof lastmd_cell !== "undefined") {
            lastmd_cell.rendered = false; 
            lastmd_cell.render(); // re-render last md cell and issue rendered.MarkdownCell event
        }
        else { //not a single markdown cell has been rendered
            // add one, render it and delete it.
            if (Jupyter.notebook.ncells()>1){ 
               var c = Jupyter.notebook.insert_cell_at_bottom('markdown');
               c.render();
               Jupyter.notebook.delete_cell(Jupyter.notebook.ncells()-1);
           }
        }
    }

function translateToolbarToggle(){
    if (nbTranslate_toolbarNotYetDisplayed){
        buildTranslateToolbar(); //rebuild it
        nbTranslate_toolbarNotYetDisplayed = false;
        $("#nbTranslate_toolbar").show();
    }
    else
        $("#nbTranslate_toolbar").toggle();
}

function buildTranslateToolbar(callback) {

    conf = Jupyter.notebook.metadata.nbTranslate
    var config_toolbar_present = $("#nbTranslate_toolbar").length >0;

    if (config_toolbar_present) {
        $("#nbTranslate_toolbar").remove();
        if ($('#LangSelectionMenu').length > 0) $('#LangSelectionMenu').remove();
        $(site).height($(window).height() - $('#header').height() - $('#footer').height());
    }
        sourceLang = conf.sourceLang;
        targetLang = conf.targetLang;

    //local to this function


    // Defining the toolbar --------------------------------------------------------------
    var nbTranslate_toolbar = $('<div id="nbTranslate_toolbar" \
        class="container edit_mode" style="display: none;">')

    var vertical_separator = '&nbsp;&nbsp;<span style="display: inline-block; \
vertical-align:bottom; width: 0; height: 1.8em;border-left:2px solid #cccccc"></span>&nbsp;&nbsp;'

    var extensionLabel = $('<a/>').html('<b> nbTranslate&nbsp;</b>')
        .attr('title', 'Translate from primary to secondary language')
        .on('click', function(data) {translateCurrentCell() })
    var primaryLangLabel = $('<b/>').html('Primary language&nbsp;')
    var secondaryLangLabel = $('<b/>').html('Secondary language&nbsp;')
    var displayLangLabel = $('<b/>').html('Display&nbsp;')

    // dropdown menu for parameter selection and toggle
    
    var sourceLangChoice = $('<ul/>').attr('id', 'sourceLangChoice')
        .addClass("dropdown-menu")
        .attr('min-width', '250px').css('height','300px').css('overflow', 'auto')

    for (lang in langs) {
        sourceLangChoice.append($('<li/>').append($('<a/>')
            .attr('id', 'sourceItem_' + langs[lang])
            .data('lang', lang)
            .text(langs[lang])
            .css('width', '175px')
            .attr('href', '#')
            .attr('title', 'Select ' + langs[lang] +
                ' as source language')
            .on('click', function(data) {
                sourceLang = $(this).data('lang');
                conf.sourceLang = sourceLang;
                $('#sourceLangConfig').text(langs[sourceLang])
                $('[id^=sourceItem_]' + '>.fa').toggleClass('fa-check', false) //reset the old one if any
                $('#sourceItem_' + $(this).text() + ' > .fa').toggleClass('fa-check', true)
                $('#displayItem_source').data('lang', sourceLang).text(langs[sourceLang]).prepend($('<i/>').addClass('fa menu-icon pull-right')).attr('title', 'Display ' + langs[sourceLang])
            })
            .prepend($('<i/>').addClass('fa menu-icon pull-right'))
        ))
    }

    var sourceLangMenu = $('<div/>').attr('id', 'cfgby').addClass('btn-group')
        .attr('title', 'Select source language')
        .append($('<a/>')
            .attr('id', "sourceLangConfig")
            .addClass("btn btn-default")
            .append($('<i/>')
                .addClass("fa fa-wrench fa-fw"))
            .text(langs[sourceLang])
        )
        .append($('<a/>')
            .addClass("btn btn-default dropdown-toggle")
            .attr('data-toggle', "dropdown")
            .attr('href', "#")
            .append($('<span/>').addClass("fa fa-caret-down")))
        .append(sourceLangChoice)
        

    // target language menu

    var targetLangChoice = $('<ul/>').attr('id', 'targetLangChoice').addClass("dropdown-menu")
            .attr('min-width', '250px').css('height','300px').css('overflow', 'auto')

    var listOfLangItems = $('<li/>')
    for (lang in langs) {
        targetLangChoice.append($('<li/>').append($('<a/>')
            .attr('id', 'targetItem_' + lang)
            .data('lang', lang)
            .text(langs[lang])
            .css('width', '175px')
            .attr('href', '#')
            .attr('title', 'Select ' + langs[lang] +
                ' as target language')
            .on('click', function(data) {
                targetLang = $(this).data('lang');
                conf.targetLang = targetLang;
                $('#targetLangConfig').text(langs[targetLang])
                $('[id^=targetItem_]' + '>.fa').toggleClass('fa-check', false) //reset the old one if any
                $($(this).id + ' > .fa').toggleClass('fa-check', true)
                $('#displayItem_target').data('lang', targetLang).text(langs[targetLang]).prepend($('<i/>').addClass('fa menu-icon pull-right')).attr('title', 'Display ' + langs[targetLang])
                // add targetLang to display menu
                // out = $('#displayLangChoice > li a').map(function (idx, elt) {return $(elt).data('lang')})
                if (listOfLangsInNotebook.indexOf(targetLang)==-1){
                    listOfLangsInNotebook.push(targetLang);
                    conf.displayLangs.push(targetLang);
                    $('#displayLangChoice').append(addLangToDisplayLangChoice(targetLang));
                    }
                $('#displayItem_' + targetLang  + ' > .fa').toggleClass('fa-check',true)
                var index = conf.displayLangs.indexOf('*');
                if (index > -1) {
                    conf.displayLangs.splice(index, 1);
                    $('#displayItem_all > .fa').toggleClass('fa-check', false)
                }  
                show_mdcells(conf.displayLangs)              
            })
            .prepend($('<i/>').addClass('fa menu-icon pull-right'))
        ))
    }

    var targetLangMenu = $('<div/>').attr('id', 'cfgby').addClass('btn-group')
        .attr('title', 'Select target language')
        .append($('<a/>')
            .attr('id', "targetLangConfig")
            .addClass("btn btn-default")
            .append($('<i/>')
                .addClass("fa fa-wrench fa-fw"))
            .text(langs[targetLang])
        )
        .append($('<a/>')
            .addClass("btn btn-default dropdown-toggle")
            .attr('data-toggle', "dropdown")
            .attr('href', "#")
            .append($('<span/>').addClass("fa fa-caret-down")))
        .append(targetLangChoice
            .append(listOfLangItems)
        )


    // Display language menu

    function onClickedLangChoice(data) {
        var lang = $(this).data('lang');
        $('#displayItem_' + lang + ' > .fa').toggleClass('fa-check')
        if ($('#displayItem_' + lang + ' > .fa').hasClass('fa-check')) {
            if (conf.displayLangs.indexOf(lang) == -1) conf.displayLangs.push(lang);
            $('#displayItem_all > .fa').toggleClass('fa-check', false)
            var index = conf.displayLangs.indexOf('*');
            if (index > -1) {
                conf.displayLangs.splice(index, 1);
            }
        } else {
            var index = conf.displayLangs.indexOf(lang);
            if (index > -1) {
                conf.displayLangs.splice(index, 1);
            }
        }
        $('#displayLangConfig').text('Select')
        // console.log("displayLangs", displayLangs)
        show_mdcells(conf.displayLangs)
    }


    function addLangToDisplayLangChoice(lang){
        if (typeof lang === 'string' || lang instanceof String)
            return $('<li/>').append($('<a/>')
            .attr('id', 'displayItem_'+lang)
            .data('lang', lang)
            .text(langs[lang])
            .css('width', '175px')
            .attr('href', '#')
            .attr('title', 'Display ' + langs[lang])
            .on('click', onClickedLangChoice)
            .prepend($('<i/>').addClass('fa menu-icon pull-right'))
            )
    }

    var displayLangChoice = $('<ul/>')
        .attr('id', 'displayLangChoice')
        .addClass("dropdown-menu")
        .attr('min-width', '300px')

    var allLangs = $('<li/>')
    allLangs.attr('id', 'allLangs')
        .append($('<a/>')
            .attr('id', 'displayItem_all')
            .data('lang', '*')
            .text('All')
            .css('width', '175px')
            .attr('href', '#')
            .attr('title', 'Display all languages')
            .on('click', function(data) {
                conf.displayLangs = ['*'];
                $('#displayLangConfig').text('All')
                $('[id^=displayItem_]' + '>.fa').toggleClass('fa-check', false) //reset the old one if any
                $('#displayItem_all > .fa').toggleClass('fa-check', true)
                show_mdcells(conf.displayLangs)
                })
            .prepend($('<i/>').addClass('fa menu-icon pull-right'))
        )

    //console.log("List of langs", listOfLangsInNotebook)
    for (var langIndex in listOfLangsInNotebook) {
        var lang = listOfLangsInNotebook[langIndex]
        //console.log("lang",lang)
        if (typeof lang === 'string' || lang instanceof String){
        displayLangChoice.append( 
        addLangToDisplayLangChoice(listOfLangsInNotebook[langIndex]))}
    }

    var displayLangMenu = $('<div/>').attr('id', 'cfgby').addClass('btn-group')
        .attr('title', 'Select language to display')
        .append($('<a/>')
            .attr('id', "displayLangConfig")
            .addClass("btn btn-default")
            .append($('<i/>')
                .addClass("fa fa-wrench fa-fw"))
            .text(inArray(conf.displayLangs, '*') ? 'All' : 'Select')
        )
        .append($('<a/>')
            .addClass("btn btn-default dropdown-toggle")
            .attr('data-toggle', "dropdown")
            .attr('href', "#")
            .append($('<span/>').addClass("fa fa-caret-down")))
            .append(displayLangChoice.prepend(allLangs))


    // Refresh display in notebook
    var refresh_languages_display_button = $("<a/>")
        .addClass("btn btn-default")
        .attr('href', "#")
        .attr('title', 'Refresh languages display in notebook')
        .css('color', 'black')
        .attr('id', 'refreshLanguagesDisplay')
        .append($("<i/>").addClass('fa fa-refresh'))
        .on('click', function() {
            show_mdcells(conf.displayLangs)
        })

    // close button
    var suicide_button = $("<a/>")
        .addClass("btn btn-default")
        .attr('href', "#")
        .attr('title', 'Close nbTranslate toolbar')
        .css('float', 'right')
        .attr('id', 'suicide')
        .attr('title', 'Close the nbTranslate configuration toolbar')
        .append($("<i/>").addClass('fa fa-power-off'))
        .on('click', function() {
            translateToolbarToggle();
            return
        })


    // translateButton
    var translate_button = $("<a/>")
        .addClass("btn btn-default")
        .attr('href', "#")
        .attr('title', 'Translate current cell')
        .attr('id', 'translateButton')
        .html('<b> nbTranslate&nbsp;</b>')
        .on('click', function(data) {translateCurrentCell() })

   //  Enable Google Engine button
    var useGoogleTranslateButton = $("<a/>")
        .addClass("btn btn-default")
        .attr('href', "#")
        .attr('title', 'Use Google translate')
        .attr('id', 'useGoogleTranslateButton')
        .append($("<i/>").addClass(conf.useGoogleTranslate ? 'fa fa-check-square-o' : 'fa fa-square-o'))
        .on('click', function() { $('#useGoogleTranslateButton > .fa').toggleClass("fa-square-o fa-check-square-o");
        conf.useGoogleTranslate = !conf.useGoogleTranslate })  

    // Lang Menu
    var langMenu = $('<a/>').attr('href', '#')
            .addClass('dropdown-toogle')
            .attr('data-toggle', "dropdown")
            .attr('aria-expanded', "false")
            .text("Langs")
            .attr('title', 'Languages to display in notebook (nbTranslate extension)')

    // Finally the toolbar itself
    nbTranslate_toolbar.append(translate_button)
        .append(vertical_separator)
        .append(useGoogleTranslateButton)
        .append(vertical_separator)
        .append(primaryLangLabel)
        .append(sourceLangMenu)
        .append(vertical_separator)
        .append(secondaryLangLabel)
        .append(targetLangMenu)
    if (conf.langInMainMenu) {
     $('#kernel_menu').parent().after('<li id="LangSelectionMenu"/>')
    $('#LangSelectionMenu').addClass('dropdown')
            .append(langMenu).append(displayLangChoice)       
    }
    else{
        nbTranslate_toolbar.append(vertical_separator)
        .append(displayLangLabel)
        .append(displayLangMenu)
    }
        nbTranslate_toolbar.append('&nbsp;&nbsp;')
        .append(refresh_languages_display_button)
        .append(suicide_button)

    // Appending the new toolbar to the main one
    $('head').append('<style> input:focus {border-color: #66afe9;\
outline: 0; box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px \
rgba(102, 175, 233, 0.6);}</style>')

    $("#maintoolbar-container").append(nbTranslate_toolbar);
    $("#nbTranslate_toolbar").css({ 'padding': '5px' });


    // Initializing toogles checks
    $('#sourceItem_' + langs[sourceLang] + ' > .fa').toggleClass('fa-check', true)
    $('#targetItem_' + langs[targetLang] + ' > .fa').toggleClass('fa-check', true)

    for (var langIndex in conf.displayLangs) {  
        var lang =  conf.displayLangs[langIndex]; 
        if (typeof lang === 'string' || lang instanceof String){
        $('#displayItem_' + lang + ' .fa')
        .toggleClass('fa-check', true)
        }
        if (conf.displayLangs.indexOf('*')> -1) 
            $('#displayItem_all > .fa').toggleClass('fa-check', true)
    }      
}

/*
function create_lang_menu(callback) {

    if ($('#LangSelectionMenu').length > 0) {
        return;
    }
    var displayLangChoiceClone = $('#displayLangChoice').clone()

    $('#help_menu').parent().before('<li id="LangSelectionMenu"/>')
    $('#LangSelectionMenu').addClass('dropdown')
            .append($('<a/>').attr('href', '#')
            .addClass('dropdown-toogle')
            .attr('data-toggle', "dropdown")
            .attr('aria-expanded', "false")
            .text("Langs"))
            .append(displayLangChoiceClone)
            }

*/