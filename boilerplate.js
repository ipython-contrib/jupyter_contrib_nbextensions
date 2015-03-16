/*

Add this directory to `$(ipython locate)/nbextensions` and load the extension with the
following lines in your `$(ipython profile locate)/static/custom/custom.js` file:

    require(["nbextensions/boilerplate/boilerplate"], function (boilerplate) {
        console.log('Loading `boilerplate` notebook extension');
        boilerplate.load_ipython_extension();
    });

Various customization options are given in the README.md file, also found at
the homepage <https://github.com/moble/jupyter_boilerplate>.

*/

define([
    "require",
    "jquery",
    "base/js/namespace",
    "./python",
    "./markdown",
], function (require, $, IPython, python, markdown) {

    var python_menus = [
        python.numpy,
        python.scipy,
        python.matplotlib,
        python.sympy,
        python.pandas,
        python.h5py,
        python.numba,
        python.python,
    ];

    var default_menus = [
        {
            'name' : 'Boilerplate',
            'sub-menu-direction' : 'left',
            'sub-menu' : python_menus.concat([markdown]),
        },
    ];
    
    function insert_snippet_code(identifier) {
        var selected_cell = IPython.notebook.get_selected_cell();
        IPython.notebook.edit_mode();
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
                'onclick' : 'insert_snippet_code(this);',
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

    var menu_counter = 0;

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
            var id_string = 'boilerplate_menu_'+menu_counter;
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

    var load_ipython_extension = function (menu_items, sibling, insert_before_or_after) {
        // Some defaults
        if(insert_before_or_after === undefined) { insert_before_or_after = 'after'; }
        if(sibling === undefined) { sibling = $("#help_menu").parent(); }
        if(menu_items === undefined) { menu_items = default_menus; }

        // Add our js and css to the notebook's head
        $('head').append('<script type="text/javascript">\n    ' + insert_snippet_code + '\n</script>');
        $('head').append('<link rel="stylesheet" type="text/css" href="' + require.toUrl("./boilerplate.css") + '">');

        // Parse and insert the menu items
        menu_setup(menu_items, sibling, insert_before_or_after);
    };
    
    return {
        load_ipython_extension : load_ipython_extension,
        menu_setup : menu_setup,
        python : python,
        python_menus : python_menus,
        markdown : markdown,
        default_menus : default_menus,
    };
});
