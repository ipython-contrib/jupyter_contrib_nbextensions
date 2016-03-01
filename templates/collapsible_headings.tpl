{%- extends 'full.tpl' -%}

{% block any_cell scoped %}
{%- if cell.metadata.collapsed -%}
{%- else -%}
{{ super() }}
{%- endif -%}
{% endblock any_cell %}

