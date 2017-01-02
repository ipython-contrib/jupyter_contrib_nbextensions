// The following are various examples taken from README.md.  Each section
// contains code that you could place into your own custom.js file.  Note that
// only one of these should be used, though you might want to combine ideas
// from the various examples.


//// 1. Simple "My favorites" menu inserted at the top of "Snippets"
require(["base/js/namespace", "base/js/events", "base/js/utils"], function () {

    require(["nbextensions/snippets_menu/main"], function (snippets_menu) {
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
        snippets_menu.default_menus[0]['sub-menu'].splice(0, 0, my_favorites);
        snippets_menu.remove_top_level_snippets_menu_items();
        snippets_menu.load_ipython_extension(snippets_menu.default_menus);
        console.log('Loaded `snippets_menu` customizations from `custom.js`');
    });

});



//// 2. "My favorites" menu with lots of stringy goodness
require(["base/js/namespace", "base/js/events", "base/js/utils"], function () {

    require(["nbextensions/snippets_menu/main"], function (snippets_menu) {
        console.log('Loading `snippets_menu` customizations from `custom.js`');
        var my_favorites = {
            'name' : 'My favorites',
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
        snippets_menu.default_menus[0]['sub-menu'].splice(0, 0, my_favorites);
        snippets_menu.remove_top_level_snippets_menu_items();
        snippets_menu.load_ipython_extension(snippets_menu.default_menus);
        console.log('Loaded `snippets_menu` customizations from `custom.js`');
    });

});



//// 3. Insert "My favorites" before "Snippets", instead of at the top
require(["base/js/namespace", "base/js/events", "base/js/utils"], function () {

    require(["nbextensions/snippets_menu/main"], function (snippets_menu) {
        console.log('Loading `snippets_menu` customizations from `custom.js`');
        var my_favorites = {
            'name' : 'My favorites',
            'sub-menu' : [
                {
                    'name' : 'Menu item text',
                    'snippet' : ['new_command(3.14)',
                                 'other_new_code_on_new_line("with a string!")',
                                 'stringy(\'escape single quotes once\')',
                                 "stringy2('or use single quotes inside of double quotes')",
                                 'backslashy("This \\ appears as just one backslash in the output")',
                                 'backslashy2("Here are \\\\ two backslashes")',],
                },
                {
                    'name' : 'Another menu item',
                    'snippet' : ['another_new_command(2.78)',
                                 'with_another_new_line(1.618)',],
                },
            ],
        };
        snippets_menu.default_menus.splice(0, 0, my_favorites);
        snippets_menu.remove_top_level_snippets_menu_items();
        snippets_menu.load_ipython_extension(snippets_menu.default_menus);
        console.log('Loaded `snippets_menu` customizations from `custom.js`');
    });

});



//// 4. Insert "My favorites" after "Snippets", instead of at the top
require(["base/js/namespace", "base/js/events", "base/js/utils"], function () {

    require(["nbextensions/snippets_menu/main"], function (snippets_menu) {
        console.log('Loading `snippets_menu` customizations from `custom.js`');
        var my_favorites = {
            'name' : 'My favorites',
            'sub-menu' : [
                {
                    'name' : 'Menu item text',
                    'snippet' : ['new_command(3.14)',
                                 'other_new_code_on_new_line("with a string!")',
                                 'stringy(\'escape single quotes once\')',
                                 "stringy2('or use single quotes inside of double quotes')",
                                 'backslashy("This \\ appears as just one backslash in the output")',
                                 'backslashy2("Here are \\\\ two backslashes")',],
                },
                {
                    'name' : 'Another menu item',
                    'snippet' : ['another_new_command(2.78)',
                                 'with_another_new_line(1.618)',],
                },
            ],
        };
        snippets_menu.default_menus.splice(1, 0, my_favorites);
        snippets_menu.remove_top_level_snippets_menu_items();
        snippets_menu.load_ipython_extension(snippets_menu.default_menus);
        console.log('Loaded `snippets_menu` customizations from `custom.js`');
    });

});



//// 5. Delete "Matplotlib"'s "Setup for scripts" item
require(["base/js/namespace", "base/js/events", "base/js/utils"], function () {

    require(["nbextensions/snippets_menu/main"], function (snippets_menu) {
        console.log('Loading `snippets_menu` customizations from `custom.js`');
        snippets_menu.default_menus[0]['sub-menu'][2]['sub-menu'].splice(1, 1);
        snippets_menu.remove_top_level_snippets_menu_items();
        snippets_menu.load_ipython_extension(snippets_menu.default_menus);
        console.log('Loaded `snippets_menu` customizations from `custom.js`');
    });

});



//// 6. Swapping Setup items in Matplotlib
require(["base/js/namespace", "base/js/events", "base/js/utils"], function () {

    require(["nbextensions/snippets_menu/main"], function (snippets_menu) {
        console.log('Loading `snippets_menu` customizations from `custom.js`');
        var tmp = snippets_menu.default_menus[0]['sub-menu'][2]['sub-menu'][0];
        snippets_menu.default_menus[0]['sub-menu'][2]['sub-menu'][0] = snippets_menu.default_menus[0]['sub-menu'][2]['sub-menu'][1];
        snippets_menu.default_menus[0]['sub-menu'][2]['sub-menu'][1] = tmp;
        snippets_menu.remove_top_level_snippets_menu_items();
        snippets_menu.load_ipython_extension(snippets_menu.default_menus);
        console.log('Loaded `snippets_menu` customizations from `custom.js`');
    });

});



//// 7. Change direction of sub-menus
require(["base/js/namespace", "base/js/events", "base/js/utils"], function () {

    require(["nbextensions/snippets_menu/main"], function (snippets_menu) {
        console.log('Loading `snippets_menu` customizations from `custom.js`');
        snippets_menu.default_menus[0]['sub-menu-direction'] = 'right';
        snippets_menu.remove_top_level_snippets_menu_items();
        snippets_menu.load_ipython_extension(snippets_menu.default_menus);
        console.log('Loaded `snippets_menu` customizations from `custom.js`');
    });

});



//// 8. Move SymPy and Numpy to navbar and delete pandas
require(["base/js/namespace", "base/js/events", "base/js/utils"], function () {

    require(["nbextensions/snippets_menu/main"], function (snippets_menu) {
        console.log('Loading `snippets_menu` customizations from `custom.js`');
        snippets_menu.default_menus[0]['sub-menu'].splice(3, 2); // Remove SymPy and pandas
        snippets_menu.python.sympy['sub-menu-direction'] = 'left'; // Point new SymPy menus to left
        var new_menus = [
            snippets_menu.default_menus[0],
            snippets_menu.python.sympy,
            snippets_menu.python.numpy,
        ];
        snippets_menu.remove_top_level_snippets_menu_items();
        snippets_menu.load_ipython_extension(new_menus);
        console.log('Loaded `snippets_menu` customizations from `custom.js`');
    });

});



//// 9. Place "Snippets" before "Help" menu
require(["base/js/namespace", "base/js/events", "base/js/utils"], function () {

    require(["nbextensions/snippets_menu/main"], function (snippets_menu) {
        console.log('Loading `snippets_menu` customizations from `custom.js`');
        snippets_menu.remove_top_level_snippets_menu_items();
        snippets_menu.load_ipython_extension(snippets_menu.default_menus, $("#help_menu").parent(), 'before');
        console.log('Loaded `snippets_menu` customizations from `custom.js`');
    });

});



//// 10. Place "Snippets" at bottom of "Insert" menu
require(["base/js/namespace", "base/js/events", "base/js/utils"], function () {

    require(["nbextensions/snippets_menu/main"], function (snippets_menu) {
        console.log('Loading `snippets_menu` customizations from `custom.js`');
        snippets_menu.default_menus[0]['menu-direction'] = 'left';
        snippets_menu.default_menus[0]['sub-menu-direction'] = 'right';
        var sibling = $("#insert_cell_below");
        var menus = [
            '---',
            snippets_menu.default_menus[0],
        ];
        snippets_menu.remove_top_level_snippets_menu_items();
        snippets_menu.load_ipython_extension(menus, sibling, 'after');
        console.log('Loaded `snippets_menu` customizations from `custom.js`');
    });

});



//// 11. Multiple menus in different places
require(["base/js/namespace", "base/js/events", "base/js/utils"], function () {

    require(["nbextensions/snippets_menu/main"], function (snippets_menu) {
        console.log('Loading `snippets_menu` customizations from `custom.js`');
        var sympy_menu = [snippets_menu.python.sympy,];
        sympy_menu[0]['sub-menu-direction'] = 'left';
        snippets_menu.default_menus[0]['sub-menu'].splice(3, 1); // Remove SymPy from defaults
        snippets_menu.default_menus[0]['menu-direction'] = 'left';
        snippets_menu.default_menus[0]['sub-menu-direction'] = 'right';
        var sibling = $("#insert_cell_below");
        var insert_menu = [
            '---',
            snippets_menu.default_menus[0],
        ];
        snippets_menu.remove_top_level_snippets_menu_items();
        snippets_menu.load_ipython_extension(sympy_menu);
        snippets_menu.menu_setup(insert_menu, sibling, 'after');
        console.log('Loaded `snippets_menu` customizations from `custom.js`');
    });

});
