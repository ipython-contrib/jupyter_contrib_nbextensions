define({
    'name' : 'numba',
    'sub-menu' : [
        {
            'name' : 'Setup',
            'snippet' : [
                'from __future__ import print_function, division',
                'import sys',
                'if sys.version_info[0] >= 3:',
                '    xrange = range  # Must always iterate with xrange in njit functions',
                'import numba',
            ],
        },
        {
            'name' : 'Documentation',
            'external-link' : 'http://numba.pydata.org/numba-doc/dev/index.html',
        },
        '---',
        {
            'name' : 'Jit function',
            'snippet'  : [
                '@numba.njit',
                'def bp_func(x):',
                '    r"""Some function',
                '    ',
                '    Does some stuff.',
                '    ',
                '    """',
                '    return x**2',
            ],
        },

        {
            'name' : 'Jit function with specified signature',
            'snippet'  : [
                '@numba.njit(f8, f8[:])',
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
                '        y[j] *= x',
            ],
        },
    ],
});
