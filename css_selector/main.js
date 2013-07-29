
define(["require"], function(require) {

    /**
     * @param element {}  DOM element to which add controls
     * @param styles {Dict} key = css name, value = url
     * @para field {}  place to store the css in json. 
     */
    var add_css_list = function (element, styles, field) {
         // link to which we will append css
         var $link = $('<link/>')
         var $tlink = $('<link/>')
         $('head').append($link)
         $('head').append($tlink)
        
         // build UI
         var label = $('<label/>').text('Css:');
         var select = $('<select/>')
             .append($('<option/>')
             .attr('value', 'default')
             .text('default'));
         element.append(label).append(select);
         
         // we'll loop on each element and create ui based on their name.
         select.change(function() {
                var val = $(this).val()
                if (val === 'default'){
                    $link.attr('href','');
                    for(c in IPython.notebook.get_cells()){
                        IPython.notebook.get_cell(c).code_mirror.setOption('theme', 'ipython')
                    }
                    return
                }
                styles[val] = styles[val]||{}
                var cmtm = styles[val].cm || 'ipyhton'; 
                if(cmtm != undefined){

                    $tlink.attr('href',require.toUrl('../../components/codemirror/theme/'+cmtm+'.css'))
                        .attr('rel','stylesheet')
                        .attr('type','text/css')
                    
                    for(c in IPython.notebook.get_cells()){
                        IPython.notebook.get_cell(c).code_mirror.setOption('theme', cmtm)
                    }
                }
                $link.attr('href',require.toUrl('./css/'+val+'.css'))
                    .attr('rel','stylesheet')
                    .attr('type','text/css')
                md.css = ['val'];
                
         });

         for (var name in styles) {
             select.append($('<option/>').attr('value', name).text(name));
         }
    };
    var md = IPython.notebook.metadata
        md.css = [];
    add_css_list(IPython.toolbar.element,{'duck':null
                                         ,'dark':{cm:'monokai'}
                                         ,'xkcd':null
                                         ,'foo':null}, md )
    

});
