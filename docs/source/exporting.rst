.. module:: jupyter_contrib_nbextensions.nbconvert_support


Exporting
=========

Some extensions add functionality you might want to keep when exporting a notebook
to another format using :mod:`nbconvert`.

There are several parts to customize :mod:`nbconvert` output:
 * *Preprocessors* to change content before conversion to another format
 * *Postprocessors* to change content after conversion to another format
 * *Exporters* to actually do the conversion to another format
 * *Templates* provide customization using Jinja without writing an exporter


Preprocessors
-------------

Generic documentation for preprocessors can be found at
`nbconvert.readthedocs.io/en/latest/api/preprocessors.html <http://nbconvert.readthedocs.io/en/latest/api/preprocessors.html>`__.


Retaining Codefolding
^^^^^^^^^^^^^^^^^^^^^

.. autoclass:: CodeFoldingPreprocessor


Collapsible Headings
^^^^^^^^^^^^^^^^^^^^

.. autoclass:: CollapsibleHeadingsPreprocessor


Retaining Highlighting
^^^^^^^^^^^^^^^^^^^^^^

.. autoclass:: HighlighterPreprocessor


Evaluating code in Markdown (PyMarkDown)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. autoclass:: PyMarkdownPreprocessor


Converting linked SVG to PDF
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. autoclass:: SVG2PDFPreprocessor



Postprocessors
--------------

Generic documentation for postprocessors can be found at
`nbconvert.readthedocs.io/en/latest/api/postprocessors.html <http://nbconvert.readthedocs.io/en/latest/api/postprocessors.html>`__


Retaining Highlighting
^^^^^^^^^^^^^^^^^^^^^^

.. autoclass:: HighlighterPostProcessor


Exporters
---------

Generic documentation for exporters can be found at

`nbconvert.readthedocs.io/en/latest/api/exporters.html <http://nbconvert.readthedocs.io/en/latest/api/exporters.html>`__


Embed images in HTML
^^^^^^^^^^^^^^^^^^^^

.. autoclass:: EmbedHTMLExporter

    Allows embedding images (pdf, svg and raster images) into a HTML file as base64 encoded binary,
    instead of linking to them.

        jupyter nbconvert --to html_embed --NbConvertApp.codefolding=True mynotebook.ipynb


Export Table of Contents
^^^^^^^^^^^^^^^^^^^^^^^^

.. autoclass:: TocExporter


Templates
---------

Generic documentation on templates can be found at
`nbconvert.readthedocs.io/en/latest/customizing.html <http://nbconvert.readthedocs.io/en/latest/customizing.html>`__

The main `jupyter contrib nbextension install` command will attempt to alter
the nbconvert config to include the package's templates directory, as mentioned
in :ref:`jupyter-contrib-nbextensions-config-edits`.
This should allow you to use the templates `nbextensions.tpl` and
`nbextensions.tplx` mentioned below just by specifying `--template=nbextensions`
in your call to nbconvert.

To find the location of the custom templates you can use this function:
.. autofunction:: templates_directory


nbextensions.tpl
^^^^^^^^^^^^^^^^

This is a template for notebook extensions that allows hiding code cells, output, or text cells.
Usage::

    $ jupyter nbconvert --template=nbextensions mynotebook.ipynb

The supported cell metadata tags are:
 * `cell.metadata.hidden` - hide complete cell
 * `cell.metadata.hide_input` - hide code cell input
 * `cell.metadata.hide_output` - hide code cell output

Detailed description:

This will hide any cell marked as `hidden` (used for collapsible headings extension):
.. code-block::

    {% block any_cell scoped %}
    {%- if cell.metadata.hidden -%}
    {%- else -%}
    {{ super() }}
    {%- endif -%}
    {% endblock any_cell %}

This will hide the input of either an individual code cell or all code cells of the notebook:
.. code-block::

    {% block input_group -%}
    {%- if cell.metadata.hide_input or nb.metadata.hide_input -%}
    {%- else -%}
    {{ super() }}
    {%- endif -%}
    {% endblock input_group %}

This will hide the output of an individual code cell:
.. code-block::

    {% block output_group -%}
    {%- if cell.metadata.hide_output -%}
    {%- else -%}
        {{ super() }}
    {%- endif -%}
    {% endblock output_group %}

This will suppress the prompt string if the input of a code cell is hidden:
.. code-block::

    {% block output_area_prompt %}
    {%- if cell.metadata.hide_input or nb.metadata.hide_input -%}
        <div class="prompt"> </div>
    {%- else -%}
        {{ super() }}
    {%- endif -%}
    {% endblock output_area_prompt %}

nbextensions.tplx
^^^^^^^^^^^^^^^^^

This template is for the conversion to Latex.
Usage::

    $ jupyter nbconvert --to=latex --template=nbextensions mynotebook.ipynb

