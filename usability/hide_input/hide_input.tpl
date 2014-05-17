{%- extends 'slides_reveal.tpl' -%}

{% block input_group %}
{%- if cell.metadata.input_collapsed -%}
{%- else -%}
<div class="input hbox">
{{ super() }}
</div>
{%- endif -%}
{% endblock input_group %}

{% block output %}
<div class="hbox output_area">
{%- if cell.metadata.input_collapsed -%}
    {{ super() | strip_output_prompt }}
{%- else -%}
    {{ super() }}
{%- endif -%}
</div>
{% endblock output %}
