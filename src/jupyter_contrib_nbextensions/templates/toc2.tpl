{%- extends 'nbextensions.tpl' -%}


{%- block header -%}
{{ super() }}

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css">

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.6/underscore-umd-min.js"></script>

<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/ipython-contrib/jupyter_contrib_nbextensions/src/jupyter_contrib_nbextensions/nbextensions/toc2/main.css">
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<script src="https://cdn.jsdelivr.net/gh/ipython-contrib/jupyter_contrib_nbextensions/src/jupyter_contrib_nbextensions/nbextensions/toc2/toc2.js"></script>

<script>
$( document ).ready(function(){

            var cfg = {{ nb.get('metadata', {}).get('toc', {})|tojson|safe }};
            cfg.navigate_menu=false;
            // fire the main function with these parameters
            require(['nbextensions/toc2/toc2'], function (toc2) {
                toc2.table_of_contents(cfg);
            });
    });
</script>

{%- endblock header -%}
