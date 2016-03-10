/*
 * Based on https://github.com/jdfreder/jupyter-tree-filter.git
 */

define([
    'require',
    'jqueryui',
    'base/js/namespace',
    'base/js/events',
    'base/js/utils',
    'services/config'
], function (
    require,
    $,
    IPython,
    events,
    utils,
    configmod
) {
    'use strict';

    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('tree', {base_url: base_url});

    config.loaded.then(function() {
        if (config.data.hasOwnProperty('filter_keyword')) {
			var filter_keyword = config.data.filter_keyword;
			if (filter_keyword) {
				console.log("filter_keyword:", filter_keyword);
				$('#filterkeyword').val(filter_keyword);
				filterRows(filter_keyword);
			}
        }
    });

    function filterRows (filterText) {
        var rows = Array.prototype.concat.apply([], document.querySelectorAll('.list_item.row'));
        rows.forEach(function (row) {
            if (!filterText || row.querySelector('.item_name').innerHTML.indexOf(filterText) !== -1) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function load_ipython_extension () {
		var html = '<label id="Keyword-Filter" for="filterkeyword">Filter: </label><input type="text" id="filterkeyword">';
		$('#notebook_list_header').append(html);
		$('#Keyword-Filter').attr('title','Keyword for filtering tree');

        $('#filterkeyword').keyup( function (e) {
            filterRows($('#filterkeyword').val());
        });
        config.load();
    }

    return {
        load_ipython_extension : load_ipython_extension
    };

});