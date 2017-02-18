{%- extends 'nbextensions.tpl' -%}

{%- block html_head -%}

{{ super() }}

{% for css in resources.inliner.css -%}
    <style type="text/css">
    {{ css }}
    </style>
{% endfor %}

{% for js in resources.inliner.js -%}
    <script type="text/javascript">
    {{ js }}
    </script>
{% endfor %}

{%- endblock html_head -%}
