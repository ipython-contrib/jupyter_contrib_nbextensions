{%- extends 'inliner.tpl' -%}

{% block markdowncell scoped %}
{%- if cell.metadata.heading_collapsed -%}
<div class="cell border-box-sizing text_cell rendered collapsible_headings_collapsed">
{%- else -%}
<div class="cell border-box-sizing text_cell rendered">
{%- endif -%}
{{ self.empty_in_prompt() }}
<div class="inner_cell">
<div class="text_cell_render border-box-sizing rendered_html">
{{ cell.source  | markdown2html | strip_files_prefix }}
</div>
</div>
</div>
{%- endblock markdowncell %}

