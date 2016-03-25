{%- extends 'full.tpl' -%}

{% block any_cell scoped %}
{%- if cell.metadata.hidden -%}
{%- else -%}
{{ super() }}
{%- endif -%}
{% endblock any_cell %}

{% block input_group -%}
{%- if cell.metadata.hide_input -%}
{%- else -%}
{{ super() }}
{%- endif -%}
{% endblock input_group %}

{% block output -%}
{%- if cell.metadata.hide_input -%}
    {{ super() | strip_output_prompt }}
{%- else -%}
    {{ super() }}
{%- endif -%}
{% endblock output %}

{% block output_group -%}
{%- if cell.metadata.hide_output -%}
{%- else -%}
    {{ super() }}
{%- endif -%}
{% endblock output_group %}
