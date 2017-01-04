define([
    "require",
    "jquery",
    "base/js/namespace",
    "base/js/events",
    "base/js/utils",
    'services/config',
    "./snippets_submenu_python",
    "./snippets_submenu_markdown",
], function (require, $, Jupyter, events, utils, configmod, python, markdown) {

    "use strict";

    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection("notebook", {base_url: base_url});

    var python_menus = [
        python.numpy,
        python.scipy,
        python.matplotlib,
        python.sympy,
        python.pandas,
        python.astropy,
        python.h5py,
        python.numba,
        python.python,
    ];

    var menu_counter = 0;
    var insert_as_new_cell = false;
    var default_menus = [
        {
            'name' : 'Snippets',
            'sub-menu-direction' : 'left',
            'sub-menu' : python_menus.concat([markdown]),
        },
    ];
    var options = {
        sibling : $("#help_menu").parent(),
        insert_before_or_after : 'after',
        menus : [],
        direction_of_top_level_submenu : 'left',
        pre_config_hook : undefined,
        post_config_hook : undefined,
    };

    config.loaded.then(function() {

        if (options['pre_config_hook'] !== undefined) {
            options['pre_config_hook']();
        }

        if (!config.data.hasOwnProperty('snippets')) {
            config.data['snippets'] = {};
        }

        if (config.data.snippets.hasOwnProperty('insert_as_new_cell')) {
            if (config.data.snippets.insert_as_new_cell) {
                console.log("Snippets: Insertions will insert new cell");
                insert_as_new_cell = true;
            }
        }

        // If `options['menus']` had elements added in custom.js, skip all of this and ignore all remaining options
        if (options['menus'].length > 0) {
            console.log('Snippets: `options[\'menus\']` was created in custom.js; skipping all other configuration.');
        } else {

            options['menus'] = [
                {
                    'name' : 'Snippets',
                    'sub-menu-direction' : options['direction_of_top_level_submenu'],
                    'sub-menu' : [],
                },
            ];

            if (config.data.snippets.hasOwnProperty('include_custom_menu')) {
                if (config.data.snippets.include_custom_menu) {
                    var custom_menu_content = '';
                    if (config.data.snippets.hasOwnProperty('custom_menu_content')) {
                        custom_menu_content = config.data.snippets.custom_menu_content;
                    } else {
                        custom_menu_content = '{\n' +
                            '    "name" : "My favorites",\n' +
                            '    "sub-menu" : [\n' +
                            '        {\n' +
                            '            "name" : "Menu item text",\n' +
                            '            "snippet" : ["import something",\n' +
                            '                         "",\n' +
                            '                         "new_command(3.14)",\n' +
                            '                         "other_new_code_on_new_line(\'with a string!\')",\n' +
                            '                         "stringy(\\"if you need them, escape double quotes with a single backslash\\")",\n' +
                            '                         "backslashy(\'This \\\\ appears as just one backslash in the output\')",\n' +
                            '                         "backslashy2(\'Here \\\\\\\\ are two backslashes\')"]\n' +
                            '        },\n' +
                            '        {\n' +
                            '            "name" : "TeX can be written in menu labels $\\\\alpha_W e\\\\int_0 \\\\mu \\\\epsilon$",\n' +
                            '            "snippet" : ["another_new_command(2.78)"]\n' +
                            '        }\n' +
                            '    ]\n' +
                            '}';
                    }
                    console.log('Snippets: Adding custom menu: ' + custom_menu_content);
                    options['menus'][0]['sub-menu'].unshift(JSON.parse(custom_menu_content));
                }
            }

            if (config.data.snippets.hasOwnProperty('include_submenu_numpy') && !config.data.snippets.include_submenu_numpy) {
                console.log("Snippets: Removing numpy sub-menu");
            } else {                    
                options['menus'][0]['sub-menu'].push(python.numpy);
            }

            if (config.data.snippets.hasOwnProperty('include_submenu_scipy') && !config.data.snippets.include_submenu_scipy) {
                console.log("Snippets: Removing scipy sub-menu");
            } else {                    
                options['menus'][0]['sub-menu'].push(python.scipy);
            }

            if (config.data.snippets.hasOwnProperty('include_submenu_matplotlib') && !config.data.snippets.include_submenu_matplotlib) {
                console.log("Snippets: Removing matplotlib sub-menu");
            } else {                    
                options['menus'][0]['sub-menu'].push(python.matplotlib);
            }

            if (config.data.snippets.hasOwnProperty('include_submenu_sympy') && !config.data.snippets.include_submenu_sympy) {
                console.log("Snippets: Removing sympy sub-menu");
            } else {                    
                options['menus'][0]['sub-menu'].push(python.sympy);
            }

            if (config.data.snippets.hasOwnProperty('include_submenu_pandas') && !config.data.snippets.include_submenu_pandas) {
                console.log("Snippets: Removing pandas sub-menu");
            } else {                    
                options['menus'][0]['sub-menu'].push(python.pandas);
            }

            if (config.data.snippets.hasOwnProperty('include_submenu_astropy') && !config.data.snippets.include_submenu_astropy) {
                console.log("Snippets: Removing astropy sub-menu");
            } else {                    
                options['menus'][0]['sub-menu'].push(python.astropy);
            }

            if (config.data.snippets.hasOwnProperty('include_submenu_h5py') && !config.data.snippets.include_submenu_h5py) {
                console.log("Snippets: Removing h5py sub-menu");
            } else {                    
                options['menus'][0]['sub-menu'].push(python.h5py);
            }

            if (config.data.snippets.hasOwnProperty('include_submenu_numba') && !config.data.snippets.include_submenu_numba) {
                console.log("Snippets: Removing numba sub-menu");
            } else {                    
                options['menus'][0]['sub-menu'].push(python.numba);
            }

            if (config.data.snippets.hasOwnProperty('include_submenu_python') && !config.data.snippets.include_submenu_python) {
                console.log("Snippets: Removing python sub-menu");
            } else {                    
                options['menus'][0]['sub-menu'].push(python.python);
            }

            if (config.data.snippets.hasOwnProperty('include_submenu_markdown') && !config.data.snippets.include_submenu_markdown) {
                console.log("Snippets: Removing markdown sub-menu");
            } else {                    
                options['menus'][0]['sub-menu'].push(markdown);
            }

        }

        if (options['post_config_hook'] !== undefined) {
            options['post_config_hook']();
        }

        // Parse and insert the menu items
        menu_setup(options['menus'], options['sibling'], options['insert_before_or_after']);

    });

    function snippet_menu__insert_snippet(identifier, insert_as_new_cell) {
        var selected_cell = Jupyter.notebook.get_selected_cell();
        Jupyter.notebook.edit_mode();
        selected_cell.code_mirror.replaceSelection($(identifier).data('snippet-code'), 'around');
    }

    function menu_recurse(sub_menu, direction) {
        if (typeof sub_menu == 'string') {
            if(sub_menu == '---') {
                return $('<li/>').addClass('divider');
            } else {
                console.log('Don\'t understand sub-menu string "' + sub_menu + '"');
                return null;
            }
        }

        // Create the menu item
        var dropdown_item = $('<li/>');

        if(sub_menu.hasOwnProperty('snippet')) {
            var snippet;
            if (typeof sub_menu['snippet'] == 'string' || sub_menu['snippet'] instanceof String) {
                snippet = [sub_menu['snippet'],];
            } else {
                snippet = sub_menu['snippet'];
            }
            $('<a/>', {
                'class' : 'snippet',
                'href' : '#',
                'title' : "", // Do not remove this, even though it's empty!
                'data-snippet-code' : snippet.join('\n'),
                'html' : sub_menu['name'],
                'onclick' : 'snippet_menu__insert_snippet(this, ' + insert_as_new_cell + ');',
            }).appendTo(dropdown_item);
        } else if(sub_menu.hasOwnProperty('internal-link')) {
            var a = $('<a/>', {
                'href' : sub_menu['internal-link'],
                'html' : sub_menu['name'],
            }).appendTo(dropdown_item);
        } else if(sub_menu.hasOwnProperty('external-link')) {
            var a = $('<a/>', {
                'target' : '_blank',
                'title' : 'Opens in a new window',
                'href' : sub_menu['external-link'],
            });
            $('<i/>', {
                'class' : 'fa fa-external-link menu-icon pull-right',
            }).appendTo(a);
            $('<span/>').html(sub_menu['name']).appendTo(a);
            a.appendTo(dropdown_item);
        } else {
            $('<a/>', {
                'href' : '#',
                'html' : sub_menu['name'],
            }).appendTo(dropdown_item);
        }

        if(sub_menu.hasOwnProperty('sub-menu')) {
            dropdown_item.toggleClass('dropdown-submenu');
            // dropdown_item.attr('class', 'dropdown-submenu');
            var sub_dropdown = $('<ul/>', {
                'class' : 'dropdown-menu',
            });
            if(direction == 'left') {
                dropdown_item.toggleClass('dropdown-submenu-left');
                sub_dropdown.css('left', 'auto');
                sub_dropdown.css('right', '100%');
                // 'left:50%; top:100%', // For space-saving menus
            }

            var new_direction = 'right';
            if(sub_menu.hasOwnProperty('sub-menu-direction')) {
                if(sub_menu['sub-menu-direction'] == 'left') {
                    new_direction = 'left';
                }
            }
            for(var j=0; j<sub_menu['sub-menu'].length; ++j) {
                var sub_sub_menu = menu_recurse(sub_menu['sub-menu'][j], new_direction);
                if(sub_sub_menu !== null) {
                    sub_sub_menu.appendTo(sub_dropdown);
                }
            }

            sub_dropdown.appendTo(dropdown_item);
        }
        
        return dropdown_item;
    };

    function menu_setup(menu_items, sibling, insert_before_or_after) {
        var parent = sibling.parent();
        var navbar = $('ul.nav.navbar-nav');
        var new_menu_is_in_navbar;
        if(navbar.is(parent)) {
            new_menu_is_in_navbar = true;
        } else {
            new_menu_is_in_navbar = false;
        }

        for(var i=0; i<menu_items.length; ++i) {
            var menu_item;
            if(insert_before_or_after == 'before') {
                menu_item = menu_items[i];
            } else {
                menu_item = menu_items[menu_items.length-1-i];
            }
            var direction = 'right';
            var node;
            var id_string = 'snippets_menu_'+menu_counter;
            menu_counter++;

            if(new_menu_is_in_navbar) {
                // We need special properties if this item is in the navbar
                node = $('<li/>').addClass('dropdown');
                $('<a/>', {
                    'href' : '#',
                    'class' : 'dropdown-toggle',
                    'data-toggle' : 'dropdown',
                    'aria-expanded' : 'false',
                    'html' : menu_item['name'],
                }).appendTo(node);
                var dropdown = $('<ul/>', {
                    'id' : id_string,
                    'class' : 'dropdown-menu',
                });
                if(menu_item.hasOwnProperty('sub-menu-direction')) {
                    if(menu_item['sub-menu-direction'] == 'left') {
                        direction = 'left';
                    }
                }
                for(var j=0; j<menu_item['sub-menu'].length; ++j) {
                    var sub_menu = menu_recurse(menu_item['sub-menu'][j], direction);
                    if(sub_menu !== null) {
                        sub_menu.appendTo(dropdown);
                    }
                }
                dropdown.appendTo(node);
            } else {
                // Assume this is inside some other menu in the navbar
                if(menu_item.hasOwnProperty('menu-direction')) {
                    if(menu_item['menu-direction'] == 'left') {
                        direction = 'left';
                    }
                }
                node = menu_recurse(menu_item, direction);
                node.attr('id', id_string);
            }

            // Insert the menu
            if(insert_before_or_after == 'before') {
                node.insertBefore(sibling);
            } else {
                node.insertAfter(sibling);
            }

            // Make sure MathJax will typeset this menu
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, id_string]);
        }
    };

    var load_ipython_extension = function () {
        // Add our js and css to the notebook's head
        $('head').append(
            $('<script/>', {
                type:'text/javascript',
                html: '\n' + snippet_menu__insert_snippet + '\n'
            })
        );
        $('head').append(
            $('<link/>', {
                rel: 'stylesheet',
                type:'text/css',
                href: require.toUrl('./snippets_menu.css')
            })
        );

        // Arrange the menus as given by the configuration
        config.load();
    };

    return {
        // Handy functions
        load_ipython_extension : load_ipython_extension,
        menu_setup : menu_setup,

        // Default menus
        python : python,
        python_menus : python_menus,
        markdown : markdown,
        default_menus : default_menus,

        // Items that could be useful for customization
        options : options,
    };

});
