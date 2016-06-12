{%- extends 'full.tpl' -%}


{%- block header -%}
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>[{{nb.metadata.name}}]</title>
{% for css in resources.inlining.css -%}
    <style type="text/css">
    {{ css }}
    </style>
{% endfor %}

<style type="text/css">
/* Overrides of notebook CSS for static HTML export */
body {
  overflow: visible;
  padding: 8px;
}
.input_area {
  padding:  0.2em; 
}

pre {
    padding: 0.2em;
    border: none;
    margin: 0px;
    font-size: 13px;
}
</style>

<!-- Custom stylesheet, it must be in the same directory as the html file -->
<link rel="stylesheet" href="custom.css"> 
<link rel="stylesheet" href="latex_envs.css"> 



    <!-- Load mathjax -->
    <script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>
    <!-- MathJax configuration -->
    <script type="text/x-mathjax-config">
    MathJax.Hub.Config({
        TeX: { equationNumbers: { autoNumber: "AMS" } }, <!-- Add this line-->
        tex2jax: {
            inlineMath: [ ['$','$'], ["\\(","\\)"] ],
            displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
            processEscapes: true,
            processEnvironments: true
        },
        // Center justify equations in code and markdown cells. Elsewhere
        // we use CSS to left justify single line equations in code cells.
        displayAlign: 'center',
        "HTML-CSS": {
            styles: {'.MathJax_Display': {"margin": 0}},
            linebreaks: { automatic: true }
        }
    });
    </script>
    <!-- End of mathjax configuration -->


</head>
{%- endblock header -%}

{% block body %}

{{ super() }}

{%- endblock body %}

{% block footer %}
</html>
{% endblock footer %}
