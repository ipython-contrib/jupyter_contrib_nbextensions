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

    var boilerplate_menus = [
        {
            'name' : 'Boilerplate',
            'sub-menu' : [

                {
                    'name' : 'NumPy',
                    'sub-menu' : [
                        {
                            'name' : 'Import',
                            'snippet' : 'import numpy as np',
                        },
                        
                        {
                            'name' : 'New array',
                            'snippet' : 'bp_new_array = np.zeros((4,3,), dtype=complex)',
                        },
                        
                        {
                            'name' : 'New array like another',
                            'snippet' : 'bp_new_array = np.zeros_like(bp_other_array)',
                        },
                    ]
                },

                {
                    'name' : 'SciPy',
                    'sub-menu' : [
                        {
                            'name' : 'Imports',
                            'snippet' :
                            escape_strings(['import scipy.constants',
                                            'import scipy.interpolate',
                                            'import scipy.linalg',
                                            'import scipy.optimize',]),
                        },
                    ],
                },

                {
                    'name' : 'Matplotlib',
                    'sub-menu' : [
                        {
                            'name' : 'Set up for notebook',
                            'snippet' :
                            escape_strings(['import numpy as np',
                                            'import matplotlib as mpl',
                                            'import matplotlib.pyplot as plt',
                                            '%matplotlib inline',]),
                        },

                        {
                            'name' : 'Set up for scripts',
                            'snippet' :
                            escape_strings(['import matplotlib as mpl',
                                            'mpl.use("Agg")  # Must come after importing mpl, but before importing plt',
                                            'import matplotlib.pyplot as plt',]),
                        },

                        {
                            'name' : 'Example plots',
                            'sub-menu' : [
                                {
                                    'name' : 'Basic line plot',
                                    'snippet' :
                                    escape_strings(['# Silly example data',
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
                                },

                                {
                                    'name' : 'Histogram',
                                    'snippet' :
                                    escape_strings(['x = np.random.randn(10000)  # example data, random normal distribution',
                                                    'num_bins = 50',
                                                    'n, bins, patches = plt.hist(x, num_bins, normed=1, facecolor="green", alpha=0.5)',
                                                    'plt.xlabel(r"Description of $x$ coordinate (units)")',
                                                    'plt.ylabel(r"Description of $y$ coordinate (units)")',
                                                    'plt.title(r"Histogram title here (remove for papers)")',
                                                    'plt.show();',
                                                   ]),
                                },

                                {
                                    'name' : 'Contour plot',
                                    'snippet' :
                                    escape_strings(['# Silly example data',
                                                    'x_min, x_max, y_min, y_max = 0.0, 2*np.pi, 0.0, 2*np.pi',
                                                    'f = [[np.sin(x**2 + y**2) for x in np.linspace(x_min, x_max, num=200)]',
                                                    '     for y in np.linspace(y_min, y_max, num=200)]',
                                                    '',
                                                    '# Make the plot',
                                                    'plt.figure()',
                                                    'plt.imshow(f, interpolation="bicubic", origin="lower",',
                                                    '           extent=[x_min, x_max, y_min, y_max])',
                                                    'plt.colorbar()',
                                                    'plt.title(r"Title here (remove for papers)")',
                                                    'plt.xlabel(r"Description of $x$ coordinate (units)")',
                                                    'plt.ylabel(r"Description of $y$ coordinate (units)")',
                                                    'plt.show()',]),
                                },

                                {
                                    'name' : '3-d plot',
                                    'snippet' :
                                    escape_strings(['from mpl_toolkits.mplot3d import Axes3D',
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
                                },

                                {
                                    'name' : 'Error bars',
                                    'snippet' :
                                    escape_strings(['# Silly example data',
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
                                },

                                {
                                    'name' : 'Grouped plots',
                                    'snippet' :
                                    escape_strings(['# Silly example data',
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
                            ],
                        },
                    ],
                },

                {
                    'name' : 'SymPy',
                    'sub-menu' : [
                        {
                            'name' : 'Imports and setup',
                            'snippet' :
                            escape_strings(['from __future__ import division',
                                            'from sympy import *',
                                            'x, y, z, t = symbols("x, y, z, t")',
                                            'k, m, n = symbols("k, m, n", integer=True)',
                                            'f, g, h = symbols("f, g, h", cls=Function)',
                                            'init_printing()',]),
                        },

                        {
                            'name' : 'Series',
                            'snippet' : '# !!! NOT YET IMPLEMENTED !!!',
                        },
                        
                        {
                            'name' : 'Summation',
                            'snippet' : '# !!! NOT YET IMPLEMENTED !!!',
                        },

                        {
                            'name' : 'Integral',
                            'snippet' : '# !!! NOT YET IMPLEMENTED !!!',
                        },

                        {
                            'name' : 'Derivative',
                            'snippet' : '# !!! NOT YET IMPLEMENTED !!!',
                        },

                        {
                            'name' : 'Limit',
                            'snippet' : '# !!! NOT YET IMPLEMENTED !!!',
                        },

                        {
                            'name' : 'Simplification',
                            'snippet' : '# !!! NOT YET IMPLEMENTED !!!',
                        },
                    ],
                },

                {
                    'name' :'pandas',
                    'sub-menu' : [
                        {
                            'name' : 'Import',
                            'snippet' : 'import pandas as pd',
                        },

                        {
                            'name' : 'Set options',
                            'snippet' :
                            escape_strings(['pd.set_option(""display.height"", 10)',
                                            'pd.set_option(""display.max_rows"", 20)',
                                            'pd.set_option(""display.max_columns"", 500)',
                                            'pd.set_option(""display.width"", 1000)',]),
                        },

                        {
                            'name' : 'To/from file',
                            'sub-menu' : [
                                {
                                    'name' : 'Read from CSV',
                                    'snippet' : 'bp_data = pd.read_csv("path/to/file.csv", header=1, delim_whitespace=True)',
                                },

                                {
                                    'name' : 'Write to CSV',
                                    'snippet' : 'bp_data.to_csv("path/to/new_file.csv", sep=" ", header=False, index=False)',
                                },
                            ],
                        },

                        {
                            'name' : 'Deal with NaNs',
                            'sub-menu' : [
                                {
                                    'name' : 'Filter out NaNs',
                                    'snippet' : 'bp_data = bp_data.dropna()',
                                },
                                
                                {
                                    'name' : 'Replace NaNs with number',
                                    'snippet' : 'bp_data = bp_data.fillna(0.0)',
                                },
                            ],
                        },

                        {
                            'name' : 'Select rows',
                            'snippet' : 'bp_data[:5]',
                        },

                        {
                            'name' : 'Select by column...',
                            'sub-menu' : [
                                {
                                    'name' : 'name',
                                    'snippet' : 'bp_column = bp_data[["Column name"]]',
                                },
                                
                                {
                                    'name' : 'names',
                                    'snippet' : 'bp_columns = bp_data[["Column name 1", "Column name 2", "Column name 3"]]',
                                },
                            ],
                        },

                        {
                            'name' : 'Get numerical values from...',
                            'sub-menu' : [
                                {
                                    'name' : 'column',
                                    'snippet' : 'bp_num_value = bp_data[["Numerical column"]].values',
                                },
                                {
                                    'name' : 'columns',
                                    'snippet' : 'bp_num_values = bp_data[["Numerical column 1", "Numerical column 2"]].values',
                                },
                            ],
                        },

                        {
                            'name' : 'Iteration',
                            'snippet' : '',
                        },

                        {
                            'name' : 'Grouping',
                            'snippet' : '',
                        },

                        {
                            'name' : 'Sorting',
                            'snippet' : '',
                        },

                        {
                            'name' : 'Combining',
                            'snippet' : '',
                        },

                        {
                            'name' : 'Basic stats',
                            'sub-menu' : [
                                {
                                    'name' : 'Mean',
                                    'snippet' : 'bp_mean = bp_data[["Numerical column 1"]].mean()',
                                },
                                {
                                    'name' : 'Mode',
                                    'snippet' : 'bp_mode = bp_data[["Numerical column 1"]].mode()',
                                },
                                {
                                    'name' : 'Median',
                                    'snippet' : 'bp_median = bp_data[["Numerical column 1"]].median()',
                                },
                                {
                                    'name' : 'Standard deviation (unbiased)',
                                    'snippet' : 'bp_std = bp_data[["Numerical column 1"]].std()',
                                },
                                {
                                    'name' : 'Variance (unbiased)',
                                    'snippet' : 'bp_var = bp_data[["Numerical column 1"]].var()',
                                },
                                {
                                    'name' : 'Skew (unbiased)',
                                    'snippet' : 'bp_skew = bp_data[["Numerical column 1"]].skew()',
                                },
                                {
                                    'name' : 'Kurtosis (unbiased)',
                                    'snippet' : 'bp_kurtosis = bp_data[["Numerical column 1"]].kurt()',
                                },
                                {
                                    'name' : 'Min',
                                    'snippet' : 'bp_min = bp_data[["Numerical column 1"]].min()',
                                },
                                {
                                    'name' : 'Max',
                                    'snippet' : 'bp_max = bp_data[["Numerical column 1"]].max()',
                                },
                                {
                                    'name' : 'Sum',
                                    'snippet' : 'bp_sum = bp_data[["Numerical column 1"]].sum()',
                                },
                                {
                                    'name' : 'Product',
                                    'snippet' : 'bp_product = bp_data[["Numerical column 1"]].product()',
                                },
                                {
                                    'name' : 'Number of elements',
                                    'snippet' : 'bp_count = bp_data[["Numerical column 1"]].count()',
                                },
                            ],
                        },
                    ],
                },

                {
                    'name' : 'h5py',
                    'sub-menu' : [
                        {
                            'name' : 'Import',
                            'snippet' : 'import h5py',
                        },
                        
                        {
                            'name' : 'Open a file',
                            'snippet' : 'bp_f = h5py.File("path/to/file.h5")',
                        },
                        
                        {
                            'name' : 'Close a file',
                            'snippet' : 'bp_f.close()',
                        },
                        
                        {
                            'name' : 'Get array',
                            'snippet' : 'bp_array = bp_f["bp_array_item"][:]',
                        },
                        
                        {
                            'name' : 'Get scalar',
                            'snippet' : 'bp_scalar = bp_f["bp_scalar_item"][()]',
                        },
                    ],
                },

                {
                    'name' : 'numba',
                    'sub-menu' : [
                        {
                            'name' : 'Import',
                            'snippet' : 'import numba',
                        },
                        
                        {
                            'name' : 'Jit function',
                            'snippet' :
                            escape_strings(['@numba.njit',
                                            'def bp_func(x):',
                                            '    r"""Some function',
                                            '    ',
                                            '    Does some stuff.',
                                            '    ',
                                            '    """',
                                            '    return x**2',]),
                        },

                        {
                            'name' : 'Jit function with specified signature',
                            'snippet' :
                            escape_strings(['@numba.njit(f8, f8[:])',
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
                    ],
                },
                
                {
                    'name' : 'Python',
                    'sub-menu' : [
                        {
                            'name' : 'Future imports',
                            'snippet' : 'from __future__ import division, print_function',
                        },

                        {
                            'name' : 'List comprehension',
                            'snippet' : '[x**2 for x in range(-10, 11)]',
                        },
                        
                        {
                            'name' : 'Conditional list comprehension',
                            'snippet' : '[x**2 for x in range(-10, 11) if (x%3)==0]',
                        },
                        
                        {
                            'name' : 'Define a simple function',
                            'snippet' :
                            escape_strings(['def bp_some_func(x):',
                                            '    r"""Brief description of the function"""',
                                            '    return x**2',]),
                        },
                        
                        {
                            'name' : 'Define a simple class',
                            'snippet' :
                            escape_strings(['class BPSomeClass(object):',
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
                        },

                        {
                            'name' : 'Define a complicated function',
                            'snippet' :
                            escape_strings(['def bp_some_func(x, y, z=3.14, **kwargs):',
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
                        },

                        {
                            'name' : 'Define a complicated class',
                            'snippet' :
                            escape_strings(['class BPSomeClass(object):',
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
                        },

                        {
                            'name' : 'Define a subclass',
                            'snippet' :
                            escape_strings(['class BP_A(object):',
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
                    ],
                },
                
                {
                    'name' : 'Markdown',
                    'sub-menu' : [
                        {
                            'name' : 'Insert itemized list',
                            'snippet' :
                            escape_strings(['* One',
                                            '    - Sublist',
                                            '        - This',
                                            '  - Sublist',
                                            '        - That',
                                            '        - The other thing',
                                            '* Two',
                                            '  - Sublist',
                                            '* Three',
                                            '  - Sublist',]),
                        },

                        {
                            'name' : 'Insert enumerated list',
                            'snippet' :
                            escape_strings(['1. Here we go',
                                            '    1. Sublist',
                                            '    2. Sublist',
                                            '2. There we go',
                                            '3. Now this',]),
                        },

                        {
                            'name' : 'Insert table',
                            'snippet' :
                            escape_strings(['<table>',
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
                        },

                        {
                            'name' : 'Insert local image',
                            'snippet' :
                            escape_strings(['<img src="image_file_in_this_directory.svg" />',]),
                        },

                        {
                            'name' : 'Insert local video',
                            'snippet' :
                            escape_strings(['<video controls src="video_file_in_this_directory.m4v" />',]),
                        },

                        {
                            'name' : 'Insert remote image',
                            'snippet' :
                            escape_strings(['<img src="http://some.site.org/image.jpg" />',]),
                        },

                        {
                            'name' : 'Insert remote video',
                            'snippet' :
                            escape_strings(['<video controls src="http://some.site.org/video.m4v" />',]),
                        },

                        {
                            'name' : 'Insert inline math',
                            'snippet' : '$e^{i\\pi} + 1 = 0$',
                        },

                        {
                            'name' : 'Insert equation',
                            'snippet' :
                            escape_strings(['\\begin{equation}',
                                            '  e^x = \\sum_{j=0}^{\\infty} \\frac{1}{j!} x^j',
                                            '\\end{equation}',]),
                        },

                        {
                            'name' : 'Insert aligned equation',
                            'snippet' :
                            escape_strings(['\\begin{align}',
                                            '  a &= b \\\\',
                                            '  c &= d \\\\',
                                            '  e &= f',
                                            '\\end{align}']),
                        },
                    ],
                },
            ],
        },
    ];

    function insert_boilerplate(text) {
        var selected_cell = IPython.notebook.get_selected_cell();
        IPython.notebook.edit_mode();
        selected_cell.code_mirror.replaceSelection(text, 'around');
    }

    function menu_recurse(sub_menu) {
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
            $('<a/>', {
                href : '#',
                text : sub_menu['name'],
                onclick : 'insert_boilerplate("' + sub_menu['snippet'] + '")',
            }).appendTo(dropdown_item);
        } else if(sub_menu.hasOwnProperty('URL')) {
            var a = $('<a/>', {
                target : '_blank',
                title : 'Opens in a new window',
                href : sub_menu['URL'],
            });
            $('<i/>', {
                'class' : 'fa fa-external-link menu-icon pull-right',
                'css' : '::before',
            }).appendTo(a);
            $('<span/>').html(sub_menu['name']).appendTo(a);
            a.appendTo(dropdown_item);
        } else {
            $('<a/>', {
                href : '#',
                text : sub_menu['name'],
            }).appendTo(dropdown_item);
        }

        if(sub_menu.hasOwnProperty('sub-menu')) {
            dropdown_item.attr('class', 'dropdown-submenu');
            var sub_dropdown = $('<ul/>', {
                'class' : 'dropdown-menu',
            });

            for(var j=0; j<sub_menu['sub-menu'].length; ++j) {
                var sub_sub_menu = menu_recurse(sub_menu['sub-menu'][j]);
                if(sub_sub_menu !== null) {
                    sub_sub_menu.appendTo(sub_dropdown);
                }
            }

            sub_dropdown.appendTo(dropdown_item);
        }
        
        return dropdown_item;
    };

    function menu_setup(menu_items) {
        var navbar = document.getElementsByClassName("nav navbar-nav")[0];
        var menu_counter = 0;

        for(var i = 0; i<menu_items.length; ++i) {
            menu_item = menu_items[i];
            
            var node = $('<li/>').addClass('dropdown');

            $('<a/>', {
                href : '#',
                'class' : 'dropdown-toggle',
                'data-toggle' : 'dropdown',
                'aria-expanded' : 'false',
                'text' : menu_item['name'],
            }).appendTo(node);

            var dropdown = $('<ul/>', {
                id : 'boilerplate_menu_'+menu_counter,
                'class' : 'dropdown-menu',
            });
            menu_counter++;

            for(var j=0; j<menu_item['sub-menu'].length; ++j) {
                var sub_menu = menu_recurse(menu_item['sub-menu'][j]);
                if(sub_menu !== null) {
                    sub_menu.appendTo(dropdown);
                }
            }
            dropdown.appendTo(node);
            node.appendTo(navbar);
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
