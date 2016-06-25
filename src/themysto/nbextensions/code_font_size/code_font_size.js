// Increase/decrease code font size


define([
    'base/js/namespace',
    'base/js/events'
    ], function(Jupyter, events) {
            var code_change_fontsize =  function(doIncrease) {
                var pre_css = null;
                var pre_style = null;
                for(i = 0; i < document.styleSheets.length; i++){
                    //if style sheet is custom.css
                    if(/localhost.*\/custom\/custom\.css/.test(document.styleSheets[i].href)){ 
                        //pre_css now contains the style sheet custom.css
                        pre_css = document.styleSheets[i]; 
                        break;
                    }
                }

                for(i = 0; i < pre_css.cssRules.length; i++){
                    if(/\.CodeMirror pre/.test(pre_css.cssRules[i].selectorText)){
                        pre_style = pre_css.cssRules[i].style;
                        break;
                    }
                }

                if(pre_style == null){
                    pre_css.insertRule(".CodeMirror pre { font-size: \"14px\"; padding-bottom: \"0px\"; }", 0);
                    pre_style = pre_css.cssRules[0];
                }

                var font_size = pre_style.fontSize || "";
                if(font_size == "")
                    font_size = 14;
                else
                    font_size = +/\d+/.exec(font_size)[0];
                font_size += (doIncrease ? +3 : -3);
                font_size = (font_size < 8 ? 8 : font_size);
                var padding_size = (font_size <= 14 ? 0 : (font_size - 14));

                pre_style.paddingBottom = padding_size + "px";
                pre_style.fontSize = font_size + "px";
            };

        var load_ipython_extension = function () {
            Jupyter.toolbar.add_buttons_group([
                /*
                 * Buttons to increase/decrease code font size
                 */
                {
                     'label'   : 'Increase code font size',
                     'icon'    : 'fa-search-plus',
                     'callback': function () {
                        $( document ).ready(code_change_fontsize(true));
                     }
                },
                {
                     'label'   : 'Decrease code font size',
                     'icon'    : 'fa-search-minus',
                     'callback': function () {
                        $( document ).ready(code_change_fontsize(false));
                     }
                }
                
            ]);
        };
        return {
            load_ipython_extension : load_ipython_extension
        };
});
