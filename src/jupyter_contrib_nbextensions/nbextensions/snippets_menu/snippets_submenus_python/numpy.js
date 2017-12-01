define([
    "require",
    "./numpy_ufuncs",
    "./numpy_polynomial",
], function (requirejs, numpy_ufuncs, numpy_polynomial) {
    return {
        'name' : 'NumPy',
        'sub-menu' : [
            {
                'name' : 'Setup',
                'snippet' : [
                    'from __future__ import print_function, division',
                    'import numpy as np',
                ],
            },
            {
                'name' : 'Documentation',
                'external-link' : 'http://docs.scipy.org/doc/numpy/index.html',
            },
            '---',
            {
                'name' : 'Creating arrays',
                'sub-menu' : [
                    {
                        'name' : 'New array of given shape',
                        'snippet' : ['new_array = np.zeros((4,3,), dtype=complex)',],
                    },
                    {
                        'name' : 'New array shaped like another',
                        'snippet' : ['new_array = np.zeros_like(old_array, dtype=complex)',],
                    },
                    {
                        'name' : 'Copy of existing data',
                        'snippet' : ['new_array = np.copy(old_array)',],
                    },
                    {
                        'name' : 'Array from list of data',
                        'snippet' : ['new_array = np.array([1.2, 3.4, 5.6])',],
                    },
                    {
                        'name' : 'Evenly spaced values within a given interval',
                        'snippet' : ['new_array = np.arange(1, 10, 2)'],
                    },
                    {
                        'name' : 'Evenly spaced numbers over a specified interval',
                        'snippet' : ['new_array = np.linspace(1., 10., num=120, endpoint=True)'],
                    },
                    {
                        'name' : 'Numbers spaced evenly on a log scale',
                        'snippet' : ['new_array = np.logspace(1., 10., num=120, endpoint=True, base=2)'],
                    },
                    {
                        'name' : 'Coordinate matrices from coordinate vectors',
                        'snippet' : [
                            'x = np.linspace(0, 1, 7)',
                            'y = np.linspace(0, 1, 11)',
                            'xx, yy = np.meshgrid(x, y)',
                        ],
                    },
                    {
                        'name' : 'Return views of the data, split into $N$ groups',
                        'snippet' : [
                            'x = np.arange(12)',
                            'a,b,c = np.split(x, 3)',
                        ],
                    },
                    {
                        'name' : 'Return views of the data, split at given indices along given axis',
                        'snippet' : [
                            'x = np.arange(27).reshape((3,9))',
                            'a,b,c = np.split(x, [2,6], axis=1)',
                        ],
                    },
                    {
                        'name' : 'Return copy of arrays, combined into one',
                        'snippet' : [
                            'a = np.arange(30).reshape((2,3,5))',
                            'b = np.arange(42).reshape((2,3,7))',
                            'c = np.concatenate((a, b), axis=1)',
                        ],
                    },
                ],
            },

            {
                'name' : 'Reshaping and viewing arrays',
                'sub-menu' : [
                    {
                        'name' : 'Return a view of the data, with a different shape',
                        'snippet' : ['np.arange(6).reshape((3, 2))'],
                    },
                    {
                        'name' : 'Return a view of the data, with an extra axis',
                        'snippet' : ['a[:, np.newaxis]'],
                    },
                    {
                        'name' : 'Return a view of the data, flattened to 1-D',
                        'snippet' : ['a.ravel()'],
                    },
                    {
                        'name' : 'Return a copy of the data, flattened to 1-D',
                        'snippet' : ['a.flatten()'],
                    },
                    {
                        'name' : 'Return a view of the data, with a different dtype',
                        'snippet' : ['np.linspace(0, 10, num=50).view(complex)'],
                        'sub-menu' : [
                            {
                                'name' : 'View real array as complex',
                                'snippet' : [
                                    'r = np.linspace(0, 10, num=100).reshape((25,4))',
                                    'c = r.view(complex)',
                                ],
                            },
                            {
                                'name' : 'View complex array as real with extra dimension',
                                'snippet' : [
                                    'c = (np.linspace(0, 10, num=50) + 1j*np.linspace(0, 10, num=50))',
                                    'cv = c.view(float)',
                                    'r = cv.reshape(c.shape + (2,))',
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'Return a copy of the data, cast to a different dtype',
                        'snippet' : ['np.linspace(0, 10, num=50).astype(complex)'],
                    },
                    {
                        'name' : 'Return a view of the data with indices reversed (transposed)',
                        'snippet' : ['np.arange(210).reshape((2,3,5,7)).transpose()'],
                    },
                    {
                        'name' : 'Return a view of the data with indices permuted',
                        'snippet' : ['np.arange(210).reshape((2,3,5,7)).transpose((2,1,0,3))'],
                    },
                    {
                        'name' : 'Exchange two axes in an array',
                        'snippet' : ['np.arange(210).reshape((2,3,5,7)).swapaxes(1,3)'],
                    },
                    {
                        'name' : 'Permute axes, bringing given axis into new position',
                        'snippet' : ['np.rollaxis(np.arange(210).reshape((2,3,5,7)), 2, 0)'],
                    },
                    {
                        'name' : 'Permute indices by a given amount along the given axis',
                        'snippet' : ['np.roll(np.arange(10).reshape((2,5)), 2, axis=1)'],
                    },
                    {
                        'name' : 'Return views of the data, split into $N$ groups',
                        'snippet' : [
                            'x = np.arange(12)',
                            'a,b,c = np.split(x, 3)',
                        ],
                    },
                    {
                        'name' : 'Return views of the data, split at given indices along given axis',
                        'snippet' : [
                            'x = np.arange(27).reshape((3,9))',
                            'a,b,c = np.split(x, [2,6], axis=1)',
                        ],
                    },
                    {
                        'name' : 'Return copy of arrays, combined into one',
                        'snippet' : [
                            'a = np.arange(30).reshape((2,3,5))',
                            'b = np.arange(42).reshape((2,3,7))',
                            'c = np.concatenate((a, b), axis=1)',
                        ],
                    },
                ],
            },

            {
                'name' : 'Indexing and testing arrays',
                'sub-menu' : [
                    {
                        'name' : 'Indexing documentation',
                        'external-link' : 'http://docs.scipy.org/doc/numpy/reference/arrays.indexing.html',
                    },
                    '---',
                    {
                        'name' : 'Test if array is empty',
                        'snippet' : [
                            'if a.size > 0:  # Never use `if a` or `if len(a)` for numpy arrays',
                            '    print(a)',
                        ],
                    },
                    {
                        'name' : 'Get number of dimensions of array',
                        'snippet' : ['a.ndim'],
                    },
                    {
                        'name' : 'Get shape of array',
                        'snippet' : ['a.shape'],
                    },
                    {
                        'name' : 'Index a one-dimensional array',
                        'sub-menu' : [
                            {
                                'name' : 'Get one element',
                                'snippet' : [
                                    'a = np.arange(10)',
                                    'a[3]'
                                ],
                            },
                            {
                                'name' : 'Get first $N$ elements',
                                'snippet' : [
                                    'a = np.arange(10)',
                                    'a[:3]'
                                ],
                            },
                            {
                                'name' : 'Get last $N$ elements',
                                'snippet' : [
                                    'a = np.arange(10)',
                                    'a[-3:]'
                                ],
                            },
                            {
                                'name' : 'Get elements $N$ to $M$',
                                'snippet' : [
                                    'a = np.arange(10)',
                                    'a[3:6]'
                                ],
                            },
                            {
                                'name' : 'Get elements satisfying a condition',
                                'snippet' : [
                                    'a = np.arange(10)',
                                    'a[a>5]'
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'Index a multi-dimensional array',
                        'sub-menu' : [
                            {
                                'name' : 'Get one element',
                                'snippet' : [
                                    'a = np.arange(30).reshape((2,3,5))',
                                    'a[1, 2, 4]'
                                ],
                            },
                            {
                                'name' : 'Get first $N$ elements along each final axis',
                                'snippet' : [
                                    'a = np.arange(30).reshape((2,3,5))',
                                    'a[:, :, :4]'
                                ],
                            },
                            {
                                'name' : 'Get last $N$ elements along each final axis',
                                'snippet' : [
                                    'a = np.arange(30).reshape((2,3,5))',
                                    'a[:, :, -3:]'
                                ],
                            },
                            {
                                'name' : 'Get elements $N$ to $M$ along each final axis',
                                'snippet' : [
                                    'a = np.arange(30).reshape((2,3,5))',
                                    'a[:, :, 3:5]'
                                ],
                            },
                            {
                                'name' : 'Get elements satisfying a condition (flattened result)',
                                'snippet' : [
                                    'a = np.arange(30).reshape((2,3,5))',
                                    'a[a>5]'
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'Index an array of unknown dimension',
                        'sub-menu' : [
                            {
                                'name' : 'Get first $N$ elements along each final axis',
                                'snippet' : [
                                    'a = np.arange(30).reshape((2,3,5))',
                                    'a[..., :4]'
                                ],
                            },
                            {
                                'name' : 'Get last $N$ elements along each final axis',
                                'snippet' : [
                                    'a = np.arange(30).reshape((2,3,5))',
                                    'a[..., -3:]'
                                ],
                            },
                            {
                                'name' : 'Get elements $N$ to $M$ along each final axis',
                                'snippet' : [
                                    'a = np.arange(30).reshape((2,3,5))',
                                    'a[..., 3:5]'
                                ],
                            },
                            {
                                'name' : 'Get elements satisfying a condition (flattened result)',
                                'snippet' : [
                                    'a = np.arange(30).reshape((2,3,5))',
                                    'a[a>5]'
                                ],
                            },
                        ],
                    },
                    {
                        'name' : '',
                        'snippet' : [
                            ''
                        ],
                    },
                ],
            },

            numpy_ufuncs,

            numpy_polynomial,

            // {
            //     'name' : 'Polynomials',
            //     'external-link' : 'http://docs.scipy.org/doc/numpy/reference/routines.polynomials.html',
            //     // 'sub-menu' : [
                    
            //     // ],
            // },

            {
                'name' : 'Pretty printing',
                'sub-menu' : [
                    {
                        'name' : 'Context manager',
                        'snippet' : [
                            'import contextlib',
                            '@contextlib.contextmanager',
                            'def printoptions(*args, **kwargs):',
                            '    original = np.get_printoptions()',
                            '    np.set_printoptions(*args, **kwargs)',
                            '    yield',
                            '    np.set_printoptions(**original)',
                        ],
                    },
                    '---',
                    {
                        'name' : 'Print to given precision',
                        'snippet' : [
                            'with printoptions(precision=5):',
                            '    print(np.random.random(10))',
                        ],
                    },
                    {
                        'name' : 'Summarize arrays with more than $N+1$ elements',
                        'snippet' : [
                            'with printoptions(threshold=5):',
                            '    print(np.random.random(10))',
                        ],
                    },
                    {
                        'name' : 'Print $N$ elements at each end of a summary',
                        'snippet' : [
                            'with printoptions(threshold=5, edgeitems=4):',
                            '    print(np.random.random(10))',
                        ],
                    },
                    {
                        'name' : 'Set number of characters per line',
                        'snippet' : [
                            'with printoptions(linewidth=100):',
                            '    print(np.random.random(10))',
                        ],
                    },
                    {
                        'name' : 'Suppress printing of small values',
                        'snippet' : [
                            'with printoptions(suppress=True):',
                            '    print(1e-8*np.random.random(10))',
                        ],
                    },
                    {
                        'name' : 'Set string with which to represent nan',
                        'snippet' : [
                            "with printoptions(nanstr='NaN!'):",
                            '    print(np.array([1, np.nan, 3]))',
                        ],
                    },
                    {
                        'name' : 'Set string with which to represent infinity',
                        'snippet' : [
                            "with printoptions(infstr='oo'):",
                            '    print(np.array([1, np.inf, 3]))',
                        ],
                    },
                    {
                        'name' : 'Formatting functions for specific dtypes',
                        'sub-menu' : [
                            {
                                'name' : 'Set formatter for `bool` type',
                                'snippet' : [
                                    "def format_bool(x):",
                                    "    if x:",
                                    "        return 'TRUE'",
                                    "    else:",
                                    "        return 'FALSE'",
                                    "with printoptions(formatter={'bool': format_bool}):",
                                    "    print(np.random.randint(0,2,10).astype(bool))",
                                ],
                            },
                            {
                                'name' : 'Set formatter for `int` type',
                                'snippet' : [
                                    "def format_int(x):",
                                    "    return 'int({0})'.format(x)",
                                    "with printoptions(formatter={'int': format_int}):",
                                    "    print(np.random.randint(-3, 4, 10))",
                                ],
                            },
                            {
                                'name' : 'Set formatter for `timedelta` type',
                                'snippet' : [
                                    "def format_timedelta(delta):",
                                    "    days = delta.astype('timedelta64[D]').astype(int)",
                                    "    hours = delta.astype('timedelta64[h]').astype(int) - 24*days",
                                    "    minutes = delta.astype('timedelta64[m]').astype(int) - 60*(24*days+hours)",
                                    "    seconds = delta.astype('timedelta64[s]').astype(int) - 60*(60*(24*days+hours)+minutes)",
                                    "    return '{0}days,{1}hours,{2}minutes,{3}seconds'.format(days, hours, minutes, seconds)",
                                    "with printoptions(formatter={'timedelta': format_timedelta}):",
                                    "    print(np.array([np.timedelta64(int(sec), 's') for sec in np.random.randint(0, 1000000, 10)]))",
                                ],
                            },
                            {
                                'name' : 'Set formatter for `datetime` type',
                                'snippet' : [
                                    "def format_datetime(date):",
                                    "    year = date.astype('datetime64[Y]').astype(int) + 1970",
                                    "    month = date.astype('datetime64[M]').astype(int) % 12 + 1",
                                    "    day = (date - date.astype('datetime64[M]')).astype(int) + 1",
                                    "    return 'Y{0}:M{1}:D{2}'.format(year, month, day)",
                                    "with printoptions(formatter={'datetime': format_datetime}):",
                                    "    days = np.random.randint(0, 20000, 10)",
                                    "    dates = np.array([np.datetime64(int(d), 'D') for d in days])",
                                    "    print(dates)",
                                ],
                            },
                            {
                                'name' : 'Set formatter for `float` type',
                                'snippet' : [
                                    "def format_float(x):",
                                    "    return '{0:+0.2f}'.format(x)",
                                    "with printoptions(formatter={'float': format_float}):",
                                    "    print(np.random.random(10)-0.5)",
                                ],
                            },
                            {
                                'name' : 'Set formatter for `longfloat` type',
                                'snippet' : [
                                    "def format_longfloat(x):",
                                    "    return 'long{0}'.format(x)",
                                    "with printoptions(formatter={'longfloat': format_longfloat}):",
                                    "    print(np.random.random(10).astype(np.longfloat))",
                                ],
                            },
                            {
                                'name' : 'Set formatter for `complexfloat` type',
                                'snippet' : [
                                    "def format_complexfloat(x):",
                                    "    return '{0.real}+1j*{0.imag}'.format(x)",
                                    "with printoptions(formatter={'complexfloat': format_complexfloat}):",
                                    "    print(np.random.random(5)+1j*np.random.random(5))",
                                ],
                            },
                            {
                                'name' : 'Set formatter for `longcomplexfloat` type',
                                'snippet' : [
                                    "def format_longcomplexfloat(x):",
                                    "    return '{0.real}+1j*{0.imag}'.format(x)",
                                    "with printoptions(formatter={'longcomplexfloat': format_longcomplexfloat}):",
                                    "    print(np.random.random(5).astype(np.longfloat)+1j*np.random.random(5).astype(np.longfloat))",
                                ],
                            },
                            // {
                            //     'name' : 'Set formatter for `numpy_str` type',
                            //     'snippet' : [
                            //         "def format_numpy_str(x):",
                            //         "    return 'n\"{0}\"'.format(x)",
                            //         "with printoptions(formatter={'numpy_str': format_numpy_str}):",
                            //         "    print(np.random.random(10))",
                            //     ],
                            // },
                            // {
                            //     'name' : 'Set formatter for `str` type',
                            //     'snippet' : [
                            //         "def format_str(x):",
                            //         "    return '\"{0}\"'.format(x)",
                            //         "with printoptions(formatter={'str': format_str}):",
                            //         "    print(np.random.random(10))",
                            //     ],
                            // },
                            '---',
                            {
                                'name' : 'Set formatter for all types',
                                'snippet' : [
                                    "def format_all(x):",
                                    "    return 'repr({0})'.format(repr(x))",
                                    "with printoptions(formatter={'all': format_all}):",
                                    "    print(np.array([3, 8]))",
                                    "    print(np.array([0.1, 0.5]))",
                                    "    print(np.array([1.4+2.3j, 2.8+4.6j]))",
                                    "    print(np.array(['abc', 'xyz']))",
                                ],
                            },
                            {
                                'name' : 'Set formatter for all `int` types',
                                'snippet' : [
                                    "def format_int_kind(x):",
                                    "    return 'int({0})'.format(x)",
                                    "with printoptions(formatter={'int_kind': format_int_kind}):",
                                    "    print(np.random.randint(-100, 100, 10))",
                                ],
                            },
                            {
                                'name' : 'Set formatter for all `float` types',
                                'snippet' : [
                                    "def format_float_kind(x):",
                                    "    return '{0:.2%}'.format(x)",
                                    "with printoptions(formatter={'float_kind': format_float_kind}):",
                                    "    print(np.random.random(10))",
                                ],
                            },
                            {
                                'name' : 'Set formatter for all `complex` types',
                                'snippet' : [
                                    "def format_complex_kind(x):",
                                    "    return '{0.real}+1j*{0.imag}'.format(x)",
                                    "with printoptions(formatter={'complex_kind': format_complex_kind}):",
                                    "    print(np.random.random(5)+1j*np.random.random(5))",
                                ],
                            },
                            {
                                'name' : 'Set formatter for all `str` types',
                                'snippet' : [
                                    "def format_str_kind(x):",
                                    "    return 'str({0})'.format(x)",
                                    "with printoptions(formatter={'str_kind': format_str_kind}):",
                                    "    print(np.array(['abc', 'xyz']))",
                                ],
                            },
                        ],
                    },
                ],
            },

            {
                'name' : 'File I/O',
                'sub-menu' : [
                    {
                        'name' : 'Read data from simple text file',
                        'snippet' : [
                            'data = np.loadtxt(filename)',
                        ],
                    },
                    {
                        'name' : 'Read data from text file with missing values',
                        'snippet' : [
                            'data = np.genfromtxt(filename)',
                        ],
                    },
                    {
                        'name' : 'Read data from .npy or .npz file',
                        'snippet' : [
                            'data = np.load(filename)',
                        ],
                    },
                    '---',
                    {
                        'name' : 'Write single array to text file',
                        'snippet' : [
                            'np.savetxt(filename, x)',
                        ],
                    },
                    {
                        'name' : 'Write multiple arrays to text file',
                        'snippet' : [
                            'np.savetxt(filename, np.transpose((x, y, z)))',
                        ],
                    },
                    {
                        'name' : 'Write single array to single .npy file',
                        'snippet' : [
                            'np.save(filename, x)',
                        ],
                    },
                    {
                        'name' : 'Write multiple arrays to single .npy file',
                        'snippet' : [
                            'np.save(filename, np.transpose((x, y, z)))',
                        ],
                    },
                    {
                        'name' : 'Write multiple arrays to single .npz file',
                        'snippet' : [
                            'np.savez(filename, x, y, z)',
                        ],
                    },
                    {
                        'name' : 'Write multiple arrays to single compressed .npz file',
                        'snippet' : [
                            'np.savez_compressed(filename, x, y, z)',
                        ],
                    },
                ],
            },
        ]
    }
}
);
