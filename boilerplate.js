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
                : escape_strings(['import numpy as np',
                                  'import matplotlib as mpl',
                                  'import matplotlib.pyplot as plt',
                                  '%matplotlib inline',]),

                'Set up for scripts'
                : escape_strings(['import matplotlib as mpl',
                                  'mpl.use("Agg")  # Must come after importing mpl, but before importing plt',
                                  'import matplotlib.pyplot as plt',]),

                'Example plots' : {
                    'Basic line plot'
                    : escape_strings(['# Silly example data',
                                      'bp_x = np.linspace(0, 2*np.pi, num=40, endpoint=True)',
                                      'bp_y = np.sin(bp_x)',
                                      '',
                                      '# Make the plot',
                                      'plt.plot(bp_x, bp_y, linewidth=3, linestyle="--",',
                                      '         color="blue", label=r"Legend label $\\sin(x)$")',
                                      'plt.xlabel(r"Description of $x$ coordinate (units)")',
                                      'plt.ylabel(r"Description of $y$ coordinate (units)")',
                                      'plt.title(r"Title here (remove for papers)")',
                                      'plt.xlim((0, 2*np.pi))',
                                      'plt.ylim((-1.1, 1.1))',
                                      'plt.legend(loc="lower left")',
                                      'plt.show()',]),

                    'Histogram'
                    : escape_strings(['x = np.random.randn(10000)  # example data, random normal distribution',
                                      'num_bins = 50',
                                      'n, bins, patches = plt.hist(x, num_bins, normed=1, facecolor="green", alpha=0.5)',
                                      'plt.xlabel(r"Description of $x$ coordinate (units)")',
                                      'plt.ylabel(r"Description of $y$ coordinate (units)")',
                                      'plt.title(r"Histogram title here (remove for papers)")',
                                      'plt.show();',
                                     ]),

                    'Contour plot'
                    : escape_strings(['# Silly example data',
                                      'x_min, x_max, y_min, y_max = 0.0, 2*np.pi, 0.0, 2*np.pi',
                                      'f = [[np.sin(x**2 + y**2) for x in np.linspace(x_min, x_max, num=200)]',
                                      '     for y in np.linspace(y_min, y_max, num=200)]',
                                      '',
                                      '# Make the plot',
                                      'plt.figure()',
                                      'plt.imshow(f, interpolation="bicubic", origin="lower", extent=[x_min, x_max, y_min, y_max])',
                                      'plt.colorbar()',
                                      'plt.title(r"Title here (remove for papers)")',
                                      'plt.xlabel(r"Description of $x$ coordinate (units)")',
                                      'plt.ylabel(r"Description of $y$ coordinate (units)")',
                                      'plt.show()',]),

                    '3-d plot'
                    : escape_strings(['from mpl_toolkits.mplot3d import Axes3D',
                                      'from matplotlib import cm',
                                      '',
                                      '# Silly example data',
                                      'X = np.arange(-5, 5, 0.25)',
                                      'Y = np.arange(-5, 5, 0.25)',
                                      'X, Y = np.meshgrid(X, Y)',
                                      'R = np.sqrt(X**2 + Y**2)',
                                      'Z = np.sin(R)',
                                      '',
                                      '# Make the plot',
                                      'fig = plt.figure()',
                                      'ax = fig.gca(projection="3d")',
                                      'surf = ax.plot_surface(X, Y, Z, rstride=1, cstride=1, cmap=cm.coolwarm,',
                                      '                       linewidth=0, antialiased=False)',
                                      'ax.set_zlim(-1.01, 1.01)',
                                      'fig.colorbar(surf, shrink=0.5, aspect=5)',
                                      'plt.show()',]),

                    'Error bars'
                    : escape_strings(['# Silly example data',
                                      'x = np.linspace(0.1, 4, num=10)',
                                      'y = np.exp(-x)',
                                      'dx = 0.1 - x/25.0',
                                      'dy = 0.2 + x/15.0',
                                      '',
                                      '# Make the plot',
                                      'plt.figure()',
                                      'plt.errorbar(x, y, xerr=dx, yerr=dy)',
                                      'plt.title(r"Title here (remove for papers)")',
                                      'plt.xlabel(r"Description of $x$ coordinate (units)")',
                                      'plt.ylabel(r"Description of $y$ coordinate (units)")',
                                      'plt.show()']),

                    'Grouped plots'
                    : escape_strings(['# Silly example data',
                                      'bp_x1 = np.linspace(0, 2*np.pi, num=40, endpoint=True)',
                                      'bp_y1 = np.sin(bp_x1)',
                                      'bp_x2 = np.linspace(0, np.pi, num=40, endpoint=True)',
                                      'bp_y2 = np.cos(bp_x2)',
                                      '',
                                      '# Make the plot',
                                      'fig, (ax1, ax2) = plt.subplots(ncols=2)',
                                      'ax1.plot(bp_x1, bp_y1, linewidth=3, linestyle="--",',
                                      '         color="blue", label=r"Legend label $\\sin(x)$")',
                                      'ax1.set_xlabel(r"Description of $x_{1}$ coordinate (units)")',
                                      'ax1.set_ylabel(r"Description of $y_{1}$ coordinate (units)")',
                                      'ax1.set_title(r"Title 1 here (remove for papers)")',
                                      'ax1.set_xlim((0, 2*np.pi))',
                                      'ax1.set_ylim((-1.1, 1.1))',
                                      'ax1.legend(loc="lower left")',
                                      'ax2.plot(bp_x2, bp_y2, linewidth=3, linestyle="--",',
                                      '         color="blue", label=r"Legend label $\\cos(x)$")',
                                      'ax2.set_xlabel(r"Description of $x_{2}$ coordinate (units)")',
                                      'ax2.set_ylabel(r"Description of $y_{2}$ coordinate (units)")',
                                      'ax2.set_title(r"Title 2 here (remove for papers)")',
                                      'ax2.set_xlim((0, np.pi))',
                                      'ax2.set_ylim((-1.1, 1.1))',
                                      'ax2.legend(loc="lower left")',
                                      'plt.show()']),
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

                'Series' : '# !!! NOT YET IMPLEMENTED !!!',

                'Summation' : '# !!! NOT YET IMPLEMENTED !!!',

                'Integral' : '# !!! NOT YET IMPLEMENTED !!!',

                'Derivative' : '# !!! NOT YET IMPLEMENTED !!!',

                'Limit' : '# !!! NOT YET IMPLEMENTED !!!',

                'Simplification' : '# !!! NOT YET IMPLEMENTED !!!',
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

                'Get array' : 'bp_array = bp_f["bp_array_item"][:]',

                'Get scalar' : 'bp_scalar = bp_f["bp_scalar_item"][()]',
            },

            'Python' : {
                'Future imports' : 'from __future__ import division, print_function',

                'List comprehension' : '[x**2 for x in range(-10, 11)]',
                
                'Conditional list comprehension' : '[x**2 for x in range(-10, 11) if (x%3)==0]',
                
                'Define a simple function'
                : escape_strings(['def bp_some_func(x):',
                                  '    r"""Brief description of the function"""',
                                  '    return x**2',]),

                'Define a simple class'
                : escape_strings(['class BPSomeClass(object):',
                                  '    r"""Describe the class"""',
                                  '    def __init__(self, arg1, arg2):',
                                  '        self.attr1 = arg1',
                                  '        self.attr2 = arg2',
                                  '    ',
                                  '    def attribute1(self):',
                                  '        return self.attr1',
                                  'bp_obj = BPSomeClass("a", 2.7182)',
                                  'bp_obj.attribute1()',
                                 ]),

                'Define a complicated function'
                : escape_strings(['def bp_some_func(x, y, z=3.14, **kwargs):',
                                  '    r"""Some function',
                                  '    ',
                                  '    Does some stuff.',
                                  '    ',
                                  '    Parameters',
                                  '    ----------',
                                  '    x : int',
                                  '        Description of x',
                                  '    y : str',
                                  '        Description of y',
                                  '    z : float, optional',
                                  '        Description of z.  Defaults to 3.14',
                                  '    **kwargs',
                                  '        Arbitrary optional keyword arguments.',
                                  '        w : float',
                                  '            Defaults to 6.28',
                                  '    ',
                                  '    Returns',
                                  '    -------',
                                  '    double',
                                  '        Some nonsensical number computed from some ugly formula',
                                  '    ',
                                  '    """',
                                  '    w = kwargs.pop("w", 6.28)',
                                  '    if kwargs:',
                                  '        print("Got {0} unused kwargs".format(len(kwargs)))',
                                  '    return (x**2 + len(y)) * (w + z)',]),

                'Define a complicated class'
                : escape_strings(['class BPSomeClass(object):',
                                  '    """Brief class description',
                                  '    ',
                                  '    Some more extensive description',
                                  '    ',
                                  '    Attributes',
                                  '    ----------',
                                  '    attr1 : string',
                                  '        Purpose of attr1.',
                                  '    attr2 : float',
                                  '        Purpose of attr2.',
                                  '    ',
                                  '    """',
                                  '    ',
                                  '    def __init__(self, param1, param2, param3=0):',
                                  '        """Example of docstring on the __init__ method.',
                                  '        ',
                                  '        Parameters',
                                  '        ----------',
                                  '        param1 : str',
                                  '            Description of `param1`.',
                                  '        param2 : float',
                                  '            Description of `param2`.',
                                  '        param3 : int, optional',
                                  '            Description of `param3`, defaults to 0.',
                                  '        ',
                                  '        """',
                                  '        self.attr1 = param1',
                                  '        self.attr2 = param2',
                                  '        print(param3 // 4)',
                                  '    ',
                                  '    @property',
                                  '    def attribute2(self):',
                                  '        return self.attr2',
                                  '    ',
                                  '    @attribute2.setter',
                                  '    def attribute2(self, new_attr2):',
                                  '        if not isinstance(float, new_attr2):',
                                  '            raise ValueError("attribute2 must be a float, not {0}".format(new_attr2))',
                                  '        self.attr2 = new_attr2',
                                  '',
                                  '',
                                  'bp_obj = BPSomeClass("a", 1.618)',
                                  'print(bp_obj.attribute2)',
                                  'bp_obj.attribute2 = 3.236',
                                  '',]),

                'Define a subclass'
                : escape_strings(['class BP_A(object):',
                                  '    def __init__(self, param1):',
                                  '        self.attr1 = param1',
                                  '',
                                  'class BP_B(BP_A):',
                                  '    def __init__(self, param1, param2):',
                                  '        super(BP_B, self).__init__(param1)',
                                  '        self.attr2 = param2',
                                  '',
                                  '',
                                  'bp_b = BP_B("a", "b")',
                                  'print(bp_b.attr1, bp_b.attr2)',
                                 ]),
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
                : escape_strings(['<img src="image_file_in_this_directory.svg" />',]),

                'Insert local video'
                : escape_strings(['<video controls src="video_file_in_this_directory.m4v" />',]),

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
