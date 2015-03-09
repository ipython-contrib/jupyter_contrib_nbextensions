/*

Add this file to $(ipython locate)/nbextensions/boilerplate.js and load it with
the following lines in your $(ipython profile locate)/static/custom/custom.js
file:

    require(["nbextensions/boilerplate"], function (boilerplate_extension) {
        console.log('Loading `boilerplate` notebook extension');
        boilerplate_extension.load_ipython_extension();
    });

Various customization options are given in the README.md file, also found at
the homepage <https://github.com/moble/ipynb_boilerplate>.

*/

define([
    "jquery",
    "base/js/namespace"
    ], function () {

    function escape_strings(lines) {
        for(var i=0; i<lines.length; ++i) {
            lines[i] = lines[i]
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\n/g, '\\n')
            ;
        }
        return lines.join('\\n');
    }

    var boilerplate_menus = {
        'Boilerplate' : {

            'Numpy' : {
                'Import' : 'import numpy as np',

                'New array' : 'bp_new_array = np.zeros((4,3,), dtype=complex)',

                'New array like another' : 'bp_new_array = np.zeros_like(bp_other_array)',
            },

            'Scipy' : {
                'Imports'
                : escape_strings(['import scipy.constants',
                                  'import scipy.interpolate',
                                  'import scipy.linalg',
                                  'import scipy.optimize',]),
            },

            'Matplotlib': {
                'Set up for notebook'
                : escape_strings(['import matplotlib as mpl',
                                  'import matplotlib.pyplot as plt',
                                  '%matplotlib inline',]),

                'Set up for scripts'
                : escape_strings(['import matplotlib as mpl',
                                  'mpl.use("Agg")  # Must come after importing mpl, but before importing plt',
                                  'import matplotlib.pyplot as plt',]),

                'Example plots' : {
                    'Basic line plot'
                    : escape_strings(['bp_x = [1.0, 2.0, 3.0]',
                                      'bp_y = [1.0, 4.0, 9.0]',
                                      'plt.plot(bp_x, bp_y, linewidth=3, color="blue", label=r"Legend label $x^2$")',
                                      'plt.xlabel("Description of $x$ coordinate (units)")',
                                      'plt.ylabel("Description of $y$ coordinate (units)")',
                                      'plt.title("You should probably remove the title for a plot in a paper")',
                                      'plt.legend(loc="upper left")',
                                      'plt.show()',]),

                    'Histogram' : '# !!! NOT YET IMPLEMENTED !!!',

                    'Contour plot' : '# !!! NOT YET IMPLEMENTED !!!',

                    '3-d plot' : '# !!! NOT YET IMPLEMENTED !!!',

                    'XKCD plot' : '# !!! NOT YET IMPLEMENTED !!!',

                    'Error bars' : '# !!! NOT YET IMPLEMENTED !!!',

                    'Grouped plots' : '# !!! NOT YET IMPLEMENTED !!!',
                },
            },

            'Pandas': {
                'Import' : 'import pandas as pd',

                'Read from CSV' : 'bp_data = pd.read_csv("path/to/file.csv", header=1, delim_whitespace=True)',

                'Write to CSV' : 'bp_data.to_csv("path/to/new_file.csv", sep=" ", header=False, index=False)',

                'Slice by ...' : '# !!! NOT YET IMPLEMENTED !!!',
            },

            'Sympy' : {
                'Imports and setup'
                : escape_strings(['from __future__ import division',
                                  'from sympy import *',
                                  'x, y, z, t = symbols("x, y, z, t")',
                                  'k, m, n = symbols("k, m, n", integer=True)',
                                  'f, g, h = symbols("f, g, h", cls=Function)',
                                  'init_printing()',]),

                'Series' : '<not yet implemented',

                'Summation' : '<not yet implemented',

                'Integral' : '<not yet implemented',

                'Derivative' : '<not yet implemented',

                'Limit' : '<not yet implemented',

                'Simplification' : '<not yet implemented',
            },

            'numba' : {
                'Import' : 'import numba',

                'Jit function'
                : escape_strings(['@numba.njit',
                                  'def bp_func(x):',
                                  '    r"""Some function',
                                  '    ',
                                  '    Does some stuff.',
                                  '    ',
                                  '    """',
                                  '    return x**2',]),

                'Jit function with specified signature'
                : escape_strings(['@numba.njit(f8, f8[:])',
                                  'def bp_func(x, y):',
                                  '    r"""Some function',
                                  '    ',
                                  '    Parameters',
                                  '    ----------',
                                  '    x : float',
                                  '    y : float array',
                                  '    ',
                                  '    """',
                                  '    for j in xrange(y.size):',
                                  '        y[j] *= x',]),
            },

            'h5py' : {
                'Import' : 'import h5py',

                'Open a file' : 'bp_f = h5py.File("path/to/file.h5")',

                'Close a file' : 'bp_f.close()',

                'Get array' : 'bp_array = bp_f["array_item"][:]',

                'Get scalar' : 'bp_scalar = bp_f["scalar_item"][()]',
            },

            'Python' : {
                'Future imports' : 'from __future__ import division, print_function',
                
                'Define a basic function'
                : escape_strings(['def some_func(x):',
                                  '    r"""Some function',
                                  '    ',
                                  '    Does some stuff.',
                                  '    ',
                                  '    """',
                                  '    return x**2',]),
            },

            'Markdown' : {
                'Insert itemized list'
                : escape_strings(['* One',
                                  '    - Sublist',
                                  '        - This',
                                  '  - Sublist',
                                  '        - That',
                                  '        - The other thing',
                                  '* Two',
                                  '  - Sublist',
                                  '* Three',
                                  '  - Sublist',]),

                'Insert enumerated list'
                : escape_strings(['1. Here we go',
                                  '    1. Sublist',
                                  '    2. Sublist',
                                  '2. There we go',
                                  '3. Now this',]),

                'Insert table'
                : escape_strings(['<table>',
                                  '  <tr>',
                                  '    <th>Header 1</th>',
                                  '    <th>Header 2</th>',
                                  '  </tr>',
                                  '  <tr>',
                                  '    <td>row 1, cell 1</td>',
                                  '    <td>row 1, cell 2</td>',
                                  '  </tr>',
                                  '  <tr>',
                                  '    <td>row 2, cell 1</td>',
                                  '    <td>row 2, cell 2</td>',
                                  '  </tr>',
                                  '</table>',]),

                'Insert local image'
                : escape_strings(['<img src="local_image_file_in_this_directory.svg" />',]),

                'Insert local video'
                : escape_strings(['<video controls src="local_video_file_in_this_directory.m4v" />',]),

                'Insert remote image'
                : escape_strings(['<img src="http://some.site.org/image.jpg" />',]),

                'Insert remote video'
                : escape_strings(['<video controls src="http://some.site.org/video.m4v" />',]),

                'Insert inline math' : '$e^{i\\pi} + 1 = 0$',

                'Insert equation'
                : escape_strings(['\\begin{equation}',
                                  '  e^x = \\sum_{j=0}^{\\infty} \\frac{1}{j!} x^j',
                                  '\\end{equation}',]),

                'Insert aligned equation'
                : escape_strings(['\\begin{align}',
                                  '  a &= b \\\\',
                                  '  c &= d \\\\',
                                  '  e &= f',
                                  '\\end{align}']),
            },
            
        },
    };

    function insert_boilerplate(text) {
        var selected_cell = IPython.notebook.get_selected_cell();
        IPython.notebook.edit_mode();
        selected_cell.code_mirror.replaceSelection(text, 'around');
    }

    var navbar = document.getElementsByClassName("nav navbar-nav")[0];

    var menu_counter = 0;

    function menu_recurse(sub_menu_item, sub_menu_value) {
        var dropdown_item = document.createElement("LI");
        dropdown_item.setAttribute("id", "boilerplate_menu_"+menu_counter);
        menu_counter++;
        var dropdown_item_link = document.createElement("A");
        dropdown_item_link.setAttribute("href", "#");
        var dropdown_item_textnode = document.createTextNode(sub_menu_item);
        dropdown_item_link.appendChild(dropdown_item_textnode);
        if(typeof sub_menu_value === 'string') {
            // add the string input as an action
            dropdown_item_link.setAttribute("onclick", 'insert_boilerplate("' + sub_menu_value + '")');
            dropdown_item.appendChild(dropdown_item_link);
        } else {
            dropdown_item.appendChild(dropdown_item_link);
            dropdown_item.setAttribute("class", "dropdown-submenu");
            var sub_dropdown = document.createElement("UL");
            sub_dropdown.setAttribute("id", "boilerplate_menu_"+menu_counter);
            menu_counter++;
            sub_dropdown.setAttribute("class", "dropdown-menu");
            for(var sub_sub_menu_item in sub_menu_value) {
                var sub_sub_menu_value = sub_menu_value[sub_sub_menu_item];
                sub_dropdown.appendChild(menu_recurse(sub_sub_menu_item, sub_sub_menu_value));
            }
            dropdown_item.appendChild(sub_dropdown);
        }
        return dropdown_item;
    };

    function menu_setup(menu_items) {
        for(var menu_item in menu_items) {
            var node = document.createElement("LI");
            node.setAttribute("class", "dropdown");

            var link = document.createElement("A");
            link.setAttribute("href", "#");
            link.setAttribute("class", "dropdown-toggle");
            link.setAttribute("data-toggle", "dropdown");
            link.setAttribute("aria-expanded", "false");
            var textnode = document.createTextNode(menu_item);
            link.appendChild(textnode);
            node.appendChild(link);

            var dropdown = document.createElement("UL");
            dropdown.setAttribute("id", "boilerplate_menu_"+menu_counter);
            menu_counter++;
            dropdown.setAttribute("class", "dropdown-menu");

            for(var sub_menu_item in menu_items[menu_item]) {
                var sub_menu_value = menu_items[menu_item][sub_menu_item];
                dropdown.appendChild(menu_recurse(sub_menu_item, sub_menu_value));
            }
            node.appendChild(dropdown);
            navbar.appendChild(node);
        }
    }    
    
    var load_ipython_extension = function (menu_items) {
        if(menu_items === undefined) { menu_items = boilerplate_menus; }
        $('head').append('<script type="text/javascript">\n' + insert_boilerplate + '\n</script>');
        menu_setup(menu_items);
    };
    
    return {
        load_ipython_extension : load_ipython_extension,
        boilerplate_menus : boilerplate_menus,
        escape_strings : escape_strings,
    };
    
});
