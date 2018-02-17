// The following are various examples taken from README.md.  Each section
// contains code that you could place into your own custom.js file.  Note that
// only one of these should be used, though you might want to combine ideas
// from the various examples.


//// 1. Simple "My favorites" menu inserted at the *bottom* of "Snippets", with horizontal-line separator
requirejs(["nbextensions/snippets_menu/main"], function (snippets_menu) {
    console.log('Loading `snippets_menu` customizations from `custom.js`');
    var horizontal_line = '---';
    var my_favorites = {
        'name' : 'My favorites',
        'sub-menu' : [
            {
                'name' : 'Menu item text',
                'snippet' : ['new_command(3.14)',],
            },
            {
                'name' : 'Another menu item',
                'snippet' : ['another_new_command(2.78)',],
            },
        ],
    };
    snippets_menu.options['menus'] = snippets_menu.default_menus;
    snippets_menu.options['menus'][0]['sub-menu'].push(horizontal_line);
    snippets_menu.options['menus'][0]['sub-menu'].push(my_favorites);
    console.log('Loaded `snippets_menu` customizations from `custom.js`');
});


//// 2. "My favorites" menu with lots of stringy goodness
requirejs(["nbextensions/snippets_menu/main"], function (snippets_menu) {
    console.log('Loading `snippets_menu` customizations from `custom.js`');
    var horizontal_line = '---';
    var my_favorites = {
        'name' : 'My $\\nu$ favorites',
        'sub-menu' : [
            {
                'name' : 'Multi-line snippet',
                'snippet' : ['new_command(3.14)',
                             'other_new_code_on_new_line("with a string!")',
                             'stringy(\'escape single quotes once\')',
                             "stringy2('or use single quotes inside of double quotes')",
                             'backslashy("This \\ appears as just one backslash in the output")',
                             'backslashy2("Here are \\\\ two backslashes")',],
            },
            {
                'name' : 'TeX appears correctly $\\alpha_W e\\int_0 \\mu \\epsilon$',
                'snippet' : ['another_new_command(2.78)',],
            },
        ],
    };
    snippets_menu.options['menus'].push(snippets_menu.default_menus[0]);
    snippets_menu.options['menus'][0]['sub-menu'].push(horizontal_line);
    snippets_menu.options['menus'][0]['sub-menu'].push(my_favorites);
    console.log('Loaded `snippets_menu` customizations from `custom.js`');
});



//// 3. Delete "Matplotlib"'s "Setup for scripts" item
requirejs(["nbextensions/snippets_menu/main"], function (snippets_menu) {
    console.log('Loading `snippets_menu` customizations from `custom.js`');
    snippets_menu.python.matplotlib['sub-menu'].splice(1, 1); // Delete 1 element starting at position 1 of the sub-menu
    console.log('Loaded `snippets_menu` customizations from `custom.js`');
});



//// 4. Swap setup items in "Matplotlib" sub-menu
requirejs(["nbextensions/snippets_menu/main"], function (snippets_menu) {
    console.log('Loading `snippets_menu` customizations from `custom.js`');
    var tmp = snippets_menu.python.matplotlib['sub-menu'][0];
    snippets_menu.python.matplotlib['sub-menu'][0] = snippets_menu.python.matplotlib['sub-menu'][1];
    snippets_menu.python.matplotlib['sub-menu'][1] = tmp;
    console.log('Loaded `snippets_menu` customizations from `custom.js`');
});



//// 5. Insert "My favorites" as a new top-level menu before "Snippets", instead of inside "Snippets"
requirejs(["nbextensions/snippets_menu/main"], function (snippets_menu) {
    console.log('Loading `snippets_menu` customizations from `custom.js`');
    var my_favorites = {
        'name' : 'My favorites',
        'sub-menu' : [
            {
                'name' : 'Menu item text',
                'snippet' : ['new_command(3.14)',],
            },
            {
                'name' : 'Another menu item',
                'snippet' : ['another_new_command(2.78)',],
            },
        ],
    };
    snippets_menu.options['menus'].push(my_favorites);
    snippets_menu.options['menus'].push(snippets_menu.default_menus[0]);
    console.log('Loaded `snippets_menu` customizations from `custom.js`');
});



//// 6. Insert "My favorites" as a new top-level menu after "Snippets", instead of inside "Snippets"
requirejs(["nbextensions/snippets_menu/main"], function (snippets_menu) {
    console.log('Loading `snippets_menu` customizations from `custom.js`');
    var my_favorites = {
        'name' : 'My favorites',
        'sub-menu' : [
            {
                'name' : 'Menu item text',
                'snippet' : ['new_command(3.14)',],
            },
            {
                'name' : 'Another menu item',
                'snippet' : ['another_new_command(2.78)',],
            },
        ],
    };
    snippets_menu.options['menus'].push(snippets_menu.default_menus[0]);
    snippets_menu.options['menus'].push(my_favorites);
    console.log('Loaded `snippets_menu` customizations from `custom.js`');
});



//// 7. Place "Snippets" before "Help" menu
requirejs(["nbextensions/snippets_menu/main"], function (snippets_menu) {
    console.log('Loading `snippets_menu` customizations from `custom.js`');
    snippets_menu.options['insert_before_sibling'] = true;
    console.log('Loaded `snippets_menu` customizations from `custom.js`');
});



//// 8. Move SymPy and Numpy to navbar and delete pandas
requirejs(["nbextensions/snippets_menu/main"], function (snippets_menu) {
    console.log('Loading `snippets_menu` customizations from `custom.js`');
    snippets_menu.default_menus[0]['sub-menu'].splice(3, 2); // Remove SymPy and pandas
    snippets_menu.python.sympy['sub-menu-direction'] = 'left'; // Point new SymPy menus to left
    snippets_menu.python.numpy['sub-menu-direction'] = 'left'; // Point new Numpy menus to left
    snippets_menu.options['menus'].push(snippets_menu.default_menus[0]); // Start with the remaining "Snippets" menu
    snippets_menu.options['menus'].push(snippets_menu.python.sympy); // Follow that with a new SymPy menu
    snippets_menu.options['menus'].push(snippets_menu.python.numpy); // Follow that with a new Numpy menu
    console.log('Loaded `snippets_menu` customizations from `custom.js`');
});



//// 9. Change direction of sub-menus under "Snippets"
requirejs(["nbextensions/snippets_menu/main"], function (snippets_menu) {
    console.log('Loading `snippets_menu` customizations from `custom.js`');
    snippets_menu.options['direction_of_top_level_submenu'] = 'right';
    console.log('Loaded `snippets_menu` customizations from `custom.js`');
});



//// 10. Place "Snippets" inside "Insert" menu
requirejs(["nbextensions/snippets_menu/main"], function (snippets_menu) {
    console.log('Loading `snippets_menu` customizations from `custom.js`');
    snippets_menu.default_menus[0]['menu-direction'] = 'left'; // Open top-level menu to the left...
    snippets_menu.default_menus[0]['sub-menu-direction'] = 'right'; // ...and sub-menus to the right.
    snippets_menu.options['menus'].push('---', snippets_menu.default_menus[0]); // Add horizontal line and default menus
    snippets_menu.options['sibling'] = $("#insert_cell_below"); // Find the place at which to insert the new menus
    console.log('Loaded `snippets_menu` customizations from `custom.js`');
});



//// 11. Multiple menus in different places
requirejs(["nbextensions/snippets_menu/main"], function (snippets_menu) {
    console.log('Loading `snippets_menu` customizations from `custom.js`');
    var sympy_menu = [snippets_menu.python.sympy,];
    sympy_menu[0]['sub-menu-direction'] = 'left';
    snippets_menu.options['menus'] = sympy_menu;
    snippets_menu.default_menus[0]['sub-menu'].splice(3, 1); // Remove SymPy from defaults
    snippets_menu.default_menus[0]['menu-direction'] = 'left';
    snippets_menu.default_menus[0]['sub-menu-direction'] = 'right';
    var sibling = $("#insert_cell_below");
    var inserted_menu = [
        '---',
        snippets_menu.default_menus[0],
    ];
    snippets_menu.menu_setup(inserted_menu, sibling, false);
    console.log('Loaded `snippets_menu` customizations from `custom.js`');
});
