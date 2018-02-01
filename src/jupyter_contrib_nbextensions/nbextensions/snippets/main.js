// Code cell snippets

define([
    'jquery',
    'base/js/namespace',
    'base/js/dialog'
], function(
    $,
    Jupyter,
    dialog
) {
    "use strict";

    var initialize = function () {
        var dropdown = $("<select></select>").attr("id", "snippet_picker")
                                             .css("margin-left", "0.75em")
                                             .attr("class", "form-control select-xs")
                                             .change(insert_cell);
        Jupyter.toolbar.element.append(dropdown);
    };

    // will be called when the nbextension is loaded
    function load_extension() {
        Jupyter.notebook.config.loaded.then(initialize); // trigger loading config parameters

        $.getJSON(Jupyter.notebook.base_url+"nbextensions/snippets/snippets.json", function(data) {
            // Add the header as the top option, does nothing on click
            var option = $("<option></option>")
                         .attr("id", "snippet_header")
                         .text("Snippets");
            $("select#snippet_picker").append(option);

            // Add options for each code snippet in the snippets.json file
            $.each(data['snippets'], function(key, snippet) {
                var option = $("<option></option>")
                             .attr("value", snippet['name'])
                             .text(snippet['name'])
                             .attr("code", snippet['code'].join('\n'));
                $("select#snippet_picker").append(option);
            });
        })
        .error(function(jqXHR, textStatus, errorThrown) {
            // Add an error message if the JSON fails to load
            var option = $("<option></option>")
                         .attr("value", 'ERROR')
                         .text('Error: failed to load snippets!')
                         .attr("code", "");
            $("select#snippet_picker").append(option);
        });

    };

    var insert_cell = function() {
        var selected_snippet = $("select#snippet_picker").find(":selected");

        if (selected_snippet.attr("name") != 'header') {
            var code = selected_snippet.attr("code");
            var new_cell = Jupyter.notebook.insert_cell_above('code');
            new_cell.set_text(code);
            new_cell.focus_cell();

            $("option#snippet_header").prop("selected",true);
        }
    };

    // return public methods
    return {
        load_ipython_extension : load_extension
    };
});
