define([
    "require",
    "./scipy_constants",
], function (require, scipy_constants) {
    return {
        'name' : 'SciPy',
        'sub-menu' : [
            {
                'name' : 'Setup',
                'snippet'  : [
                    'from __future__ import print_function, division',
                    'import numpy as np',
                    'import scipy as sp',
                ],
            },
            '---',
            
            // {
            //     'name' : 'Clustering algorithms',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['import scipy.cluster',],
            //         },
            //     ],
            // },

            scipy_constants,

            {
                'name' : 'Fast Fourier Transform routines',
                'sub-menu' : [
                    {
                        'name' : 'Setup',
                        'snippet' : ['import scipy.fftpack',],
                    },
                    '---',
                ],
            },

            {
                'name' : 'Integration and ordinary differential equation solvers',
                'sub-menu' : [
                    {
                        'name' : 'Setup',
                        'snippet' : ['import scipy.integrate',],
                    },
                    '---',
                ],
            },

            {
                'name' : 'Interpolation and smoothing splines',
                'sub-menu' : [
                    {
                        'name' : 'Setup',
                        'snippet' : ['import scipy.interpolate',],
                    },
                    '---',
                ],
            },

            // {
            //     'name' : 'Input and Output',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['import scipy.io',],
            //         },
            //        '---',
            //     ],
            // },

            {
                'name' : 'Linear algebra',
                'sub-menu' : [
                    {
                        'name' : 'Setup',
                        'snippet' : ['import scipy.linalg',],
                    },
                    '---',
                ],
            },

            // {
            //     'name' : 'Maximum entropy methods',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['import scipy.maxentropy',],
            //         },
            //        '---',
            //     ],
            // },

            // {
            //     'name' : 'N-dimensional image processing',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['import scipy.ndimage',],
            //         },
            //        '---',
            //     ],
            // },

            // {
            //     'name' : 'Orthogonal distance regression',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['import scipy.odr',],
            //         },
            //        '---',
            //     ],
            // },

            {
                'name' : 'Optimization and root-finding routines',
                'sub-menu' : [
                    {
                        'name' : 'Setup',
                        'snippet' : ['import scipy.optimize',],
                    },
                    '---',
                ],
            },

            // {
            //     'name' : 'Signal processing',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['import scipy.signal',],
            //         },
            //        '---',
            //     ],
            // },

            // {
            //     'name' : 'Sparse matrices and associated routines',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['import scipy.sparse',],
            //         },
            //        '---',
            //     ],
            // },

            // {
            //     'name' : 'Spatial data structures and algorithms',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['import scipy.spatial',],
            //         },
            //        '---',
            //     ],
            // },

            {
                'name' : 'Special functions',
                'sub-menu' : [
                    {
                        'name' : 'Setup',
                        'snippet' : ['import scipy.special',],
                    },
                    '---',
                ],
            },

            {
                'name' : 'Statistical distributions and functions',
                'sub-menu' : [
                    {
                        'name' : 'Setup',
                        'snippet' : ['import scipy.stats',],
                    },
                    '---',
                ],
            },

            {
                'name' : 'C/C++ integration',
                'sub-menu' : [
                    {
                        'name' : 'Setup',
                        'snippet' : ['import scipy.weave',],
                    },
                    '---',
                ],
            },
        ],
    };
});
