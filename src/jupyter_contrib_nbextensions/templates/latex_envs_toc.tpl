{%- extends 'full.tpl' -%}


{%- block html_head -%}

  <meta charset="utf-8"/>

<!-- javascript from CDN for conversion -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.5/marked.js"></script>

    

{% if nb['metadata']['latex_envs']['eqLabelWithNumbers'] == True %}
<script type="text/x-mathjax-config">
// make sure that equations numbers are enabled
MathJax.Hub.Config({ TeX: { equationNumbers: {
    autoNumber: "AMS", // All AMS equations are numbered
    useLabelIds: true, // labels as ids
    // format the equation number - uses an offset eqNumInitial (default 0)
    formatNumber: function (n) {return String(Number(n)+Number({{nb['metadata']['latex_envs']['eqNumInitial']}} ))} 
    } } 
});
</script>
{% else %}
<script type="text/x-mathjax-config">
// make sure that equations numbers are enabled
MathJax.Hub.Config({ TeX: { equationNumbers: {
    autoNumber: "none", // All AMS equations are numbered
    useLabelIds: true, // labels as ids
    } } 
});
</script>
{% endif %}


{{ super() }}


 <link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js"></script>

<!-- stylesheet from CDN -->
<link rel="stylesheet" type="text/css" href="https://rawgit.com/ipython-contrib/jupyter_contrib_nbextensions/master/src/jupyter_contrib_nbextensions/nbextensions/latex_envs/latex_envs.css">

<!-- Custom stylesheet, it must be in the same directory as the html file -->
<link rel="stylesheet" href="custom.css"> 

<!-- Load mathjax 
<script src="https://rawgit.com/ipython-contrib/jupyter_contrib_nbextensions/master/src/jupyter_contrib_nbextensions/nbextensions/latex_envs/thmsInNb4.js"></script>
-->
<script type="text/javascript"  src="https://rawgit.com/jfbercher/jupyter_contrib_nbextensions/latex_envs/src/jupyter_contrib_nbextensions/nbextensions/latex_envs/thmsInNb4.js"> </script>

<link rel="stylesheet" type="text/css" href="https://rawgit.com/ipython-contrib/Jupyter-notebook-extensions/master/src/jupyter_contrib_nbextensions/nbextensions/toc2/main.css">

<script src="https://rawgit.com/ipython-contrib/Jupyter-notebook-extensions/master/src/jupyter_contrib_nbextensions/nbextensions/toc2/toc2.js"></script>

<script>
$( document ).ready(function(){

        //Value of configuration variables, some taken from the notebook's metada. 
        eqNum = 0; // begins equation numbering at eqNum+1
        eqLabelWithNumbers = "{{nb['metadata']['latex_envs']['eqLabelWithNumbers']}}"=="True" ? true : false; //if true, label equations with equation numbers; 
                                       //otherwise using the tag specified by \label
        conversion_to_html = false;
        current_cit=1;
        cite_by='key';  //only number and key are supported
        //var document={}
        document.bibliography={};


        // fire the main function with these parameters
        var html_to_analyse = $('body').html()
        var html_converted = thmsInNbConv(marked,html_to_analyse);
        $('body').html(html_converted)


            var cfg={'threshold':6,     // depth of toc (number of levels)
             'number_sections':true,    // sections numbering
             'toc_cell':false,          // useless here
             'toc_window_display':true, // display the toc window
             "toc_section_display": "block", // display toc contents in the window
             'sideBar':true,             // sidebar or floating window
             'navigate_menu':false       // navigation menu (only in liveNotebook -- do not change)
            }

            var st={};                  // some variables used in the script
            st.rendering_toc_cell = false;
            st.config_loaded = false;
            st.extension_initialized=false;
            st.nbcontainer_marginleft = $('#notebook-container').css('margin-left')
            st.nbcontainer_marginright = $('#notebook-container').css('margin-right')
            st.nbcontainer_width = $('#notebook-container').css('width')
            st.oldTocHeight = undefined
            st.cell_toc = undefined;
            st.toc_index=0;

            // fire the main function with these parameters
            table_of_contents(cfg,st);
    });

</script>

{%- endblock html_head -%}

{% block body %}


{{ super() }}



{%- endblock body %}

{% block footer %}
</html>
{% endblock footer %}
