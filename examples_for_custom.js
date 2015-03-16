// The following are various examples taken from README.md.  Each section
// contains code that you could place into your own custom.js file.  Note that
// only one of these should be used, though you might want to combine ideas
// from the various examples.



// //// 1. Basic installation
// $([IPython.events]).on('app_initialized.NotebookApp', function(){

//     require(["nbextensions/boilerplate/boilerplate"], function (boilerplate) {
//         boilerplate.load_ipython_extension();
//     });

// });



// //// 2. Simple "My favorites" menu inserted at the top of "Boilerplate"
// $([IPython.events]).on('app_initialized.NotebookApp', function(){

//     require(["nbextensions/boilerplate/boilerplate"], function (boilerplate) {
//         console.log('Loading `boilerplate` notebook extension');
//         var my_favorites = {
//             'name' : 'My favorites',
//             'sub-menu' : [
//                 {
//                     'name' : 'Menu item text',
//                     'snippet' : ['new_command(3.14)',],
//                 },
//                 {
//                     'name' : 'Another menu item',
//                     'snippet' : ['another_new_command(2.78)',],
//                 },
//             ],
//         };
//         boilerplate.default_menus[0]['sub-menu'].splice(0, 0, my_favorites);
//         boilerplate.load_ipython_extension(boilerplate.default_menus);
//         console.log('Loaded `boilerplate` notebook extension');
//     });

// });



// //// 3. "My favorites" menu with lots of stringy goodness
// $([IPython.events]).on('app_initialized.NotebookApp', function(){

//     require(["nbextensions/boilerplate/boilerplate"], function (boilerplate) {
//         console.log('Loading `boilerplate` notebook extension');
//         var my_favorites = {
//             'name' : 'My favorites',
//             'sub-menu' : [
//                 {
//                     'name' : 'Menu item text',
//                     'snippet' : ['new_command(3.14)',
//                                  'other_new_code_on_new_line("with a string!")',
//                                  'stringy(\'escape single quotes once\')',
//                                  "stringy2('or use single quotes inside of double quotes')",
//                                  'backslashy("This \\ appears as just one backslash in the output")',
//                                  'backslashy2("Here are \\\\ two backslashes")',],
//                 },
//                 {
//                     'name' : 'TeX appears correctly $\\alpha_W e\\int_0 \\mu \\epsilon$',
//                     'snippet' : ['another_new_command(2.78)',],
//                 },
//             ],
//         };
//         boilerplate.default_menus[0]['sub-menu'].splice(0, 0, my_favorites);
//         boilerplate.load_ipython_extension(boilerplate.default_menus);
//         console.log('Loaded `boilerplate` notebook extension');
//     });

// });



// //// 4. Insert "My favorites" before "Boilerplate"
// $([IPython.events]).on('app_initialized.NotebookApp', function(){

//     require(["nbextensions/boilerplate/boilerplate"], function (boilerplate) {
//         console.log('Loading `boilerplate` notebook extension');
//         var my_favorites = {
//             'name' : 'My favorites',
//             'sub-menu' : [
//                 {
//                     'name' : 'Menu item text',
//                     'snippet' : ['new_command(3.14)',
//                                  'other_new_code_on_new_line("with a string!")',
//                                  'stringy(\'escape single quotes once\')',
//                                  "stringy2('or use single quotes inside of double quotes')",
//                                  'backslashy("This \\ appears as just one backslash in the output")',
//                                  'backslashy2("Here are \\\\ two backslashes")',],
//                 },
//                 {
//                     'name' : 'Another menu item',
//                     'snippet' : ['another_new_command(2.78)',
//                                  'with_another_new_line(1.618)',],
//                 },
//             ],
//         };
//         // boilerplate.default_menus[0]['sub-menu'].splice(0, 0, my_favorites);
//         boilerplate.default_menus.splice(0, 0, my_favorites);
//         boilerplate.load_ipython_extension(boilerplate.default_menus);
//         console.log('Loaded `boilerplate` notebook extension');
//     });

// });



// //// 5. Insert "My favorites" after "Boilerplate"
// $([IPython.events]).on('app_initialized.NotebookApp', function(){

//     require(["nbextensions/boilerplate/boilerplate"], function (boilerplate) {
//         console.log('Loading `boilerplate` notebook extension');
//         var my_favorites = {
//             'name' : 'My favorites',
//             'sub-menu' : [
//                 {
//                     'name' : 'Menu item text',
//                     'snippet' : ['new_command(3.14)',
//                                  'other_new_code_on_new_line("with a string!")',
//                                  'stringy(\'escape single quotes once\')',
//                                  "stringy2('or use single quotes inside of double quotes')",
//                                  'backslashy("This \\ appears as just one backslash in the output")',
//                                  'backslashy2("Here are \\\\ two backslashes")',],
//                 },
//                 {
//                     'name' : 'Another menu item',
//                     'snippet' : ['another_new_command(2.78)',
//                                  'with_another_new_line(1.618)',],
//                 },
//             ],
//         };
//         // boilerplate.default_menus[0]['sub-menu'].splice(0, 0, my_favorites);
//         boilerplate.default_menus.splice(1, 0, my_favorites);
//         boilerplate.load_ipython_extension(boilerplate.default_menus);
//         console.log('Loaded `boilerplate` notebook extension');
//     });

// });



// //// 6. Delete "Matplotlib"'s "Setup for scripts" item
// $([IPython.events]).on('app_initialized.NotebookApp', function(){

//     require(["nbextensions/boilerplate/boilerplate"], function (boilerplate) {
//         console.log('Loading `boilerplate` notebook extension');
//         boilerplate.default_menus[0]['sub-menu'][2]['sub-menu'].splice(1, 1);
//         boilerplate.load_ipython_extension(boilerplate.default_menus);
//         console.log('Loaded `boilerplate` notebook extension');
//     });

// });



// //// 7. Swapping Setup items in Matplotlib
// $([IPython.events]).on('app_initialized.NotebookApp', function(){

//     require(["nbextensions/boilerplate/boilerplate"], function (boilerplate) {
//         console.log('Loading `boilerplate` notebook extension');
//         var tmp = boilerplate.default_menus[0]['sub-menu'][2]['sub-menu'][0];
//         boilerplate.default_menus[0]['sub-menu'][2]['sub-menu'][0] = boilerplate.default_menus[0]['sub-menu'][2]['sub-menu'][1];
//         boilerplate.default_menus[0]['sub-menu'][2]['sub-menu'][1] = tmp;
//         boilerplate.load_ipython_extension(boilerplate.default_menus);
//         console.log('Loaded `boilerplate` notebook extension');
//     });

// });



// //// 8. Change direction of sub-menus
// $([IPython.events]).on('app_initialized.NotebookApp', function(){

//     require(["nbextensions/boilerplate/boilerplate"], function (boilerplate) {
//         console.log('Loading `boilerplate` notebook extension');
//         boilerplate.default_menus[0]['sub-menu-direction'] = 'right';
//         boilerplate.load_ipython_extension(boilerplate.default_menus);
//         console.log('Loaded `boilerplate` notebook extension');
//     });

// });



// //// 9. Move SymPy to navbar and delete pandas
// $([IPython.events]).on('app_initialized.NotebookApp', function(){

//     require(["nbextensions/boilerplate/boilerplate"], function (boilerplate) {
//         console.log('Loading `boilerplate` notebook extension');
//         boilerplate.default_menus[0]['sub-menu'].splice(3, 2); // Remove SymPy and pandas
//         boilerplate.python.sympy['sub-menu-direction'] = 'left'; // Point new SymPy menus to left
//         var new_menus = [
//             boilerplate.default_menus[0],
//             boilerplate.python.sympy,
//         ];
//         boilerplate.load_ipython_extension(new_menus);
//         console.log('Loaded `boilerplate` notebook extension');
//     });

// });



// //// 10. Place "Boilerplate" before "Help" menu
// $([IPython.events]).on('app_initialized.NotebookApp', function(){

//     require(["nbextensions/boilerplate/boilerplate"], function (boilerplate) {
//         console.log('Loading `boilerplate` notebook extension');
//         boilerplate.load_ipython_extension(boilerplate.default_menus, $("#help_menu").parent(), 'before');
//         console.log('Loaded `boilerplate` notebook extension');
//     });

// });



// //// 11. Place "Boilerplate" at bottom of "Insert" menu
// $([IPython.events]).on('app_initialized.NotebookApp', function(){

//     require(["nbextensions/boilerplate/boilerplate"], function (boilerplate) {
//         console.log('Loading `boilerplate` notebook extension');
//         boilerplate.default_menus[0]['menu-direction'] = 'left';
//         boilerplate.default_menus[0]['sub-menu-direction'] = 'right';
//         var sibling = $("#insert_cell_below");
//         var menus = [
//             '---',
//             boilerplate.default_menus[0],
//         ];
//         boilerplate.load_ipython_extension(menus, sibling, 'after');
//         console.log('Loaded `boilerplate` notebook extension');
//     });

// });



//// 12. Multiple menus in different places
$([IPython.events]).on('app_initialized.NotebookApp', function(){

    require(["nbextensions/boilerplate/boilerplate"], function (boilerplate) {
        console.log('Loading `boilerplate` notebook extension');
        var sympy_menu = [boilerplate.python.sympy,];
        sympy_menu[0]['sub-menu-direction'] = 'left';
        boilerplate.default_menus[0]['sub-menu'].splice(3, 1); // Remove SymPy from defaults
        boilerplate.default_menus[0]['menu-direction'] = 'left';
        boilerplate.default_menus[0]['sub-menu-direction'] = 'right';
        var sibling = $("#insert_cell_below");
        var insert_menu = [
            '---',
            boilerplate.default_menus[0],
        ];
        boilerplate.load_ipython_extension(sympy_menu);
        boilerplate.menu_setup(insert_menu, sibling, 'after');
        console.log('Loaded `boilerplate` notebook extension');
    });

});
