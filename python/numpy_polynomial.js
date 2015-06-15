define({
    'name' : 'Polynomials',
    'sub-menu' : [
        {
            'name' : 'Setup',
            'snippet' : [
                'import numpy as np',
                'from numpy.polynomial import Polynomial as P',
                'from numpy.polynomial import Chebyshev as T',
                'from numpy.polynomial import Legendre as Le',
                'from numpy.polynomial import Laguerre as La',
                'from numpy.polynomial import Hermite as H',
                'from numpy.polynomial import HermiteE as HE',
            ],
        },
        '---',
        {
            'name' : 'Instantiate from coefficients',
            'snippet' : [
                'poly = P([1, 2, 3])',
            ],
        },
        {
            'name' : 'Instantiate from roots',
            'snippet' : [
                'poly = P.fromroots([1, 2, 3])',
            ],
        },
        {
            'name' : 'Instantiate from basis element $n$',
            'snippet' : [
                'poly = P.basis(n)',
            ],
        },
        {
            'name' : 'Convert between types',
            'snippet' : [
                'from numpy.polynomial import Chebyshev',
                'polyT = poly.convert(kind=Chebyshev)',
            ],
        },
        '---',
        {
            'name' : 'Get coefficients (constant at index 0, higher indices for higher orders)',
            'snippet' : [
                'poly.coeff',
            ],
        },
        {
            'name' : 'Get domain (scaled and offset domain of function for fitting)',
            'snippet' : [
                'poly.domain',
            ],
        },
        {
            'name' : 'Get window (natural domain of basis functions)',
            'snippet' : [
                'poly.window',
            ],
        },
        {
            'name' : 'Get degree of polynomial (one less than number of coefficients)',
            'snippet' : [
                'poly.degree()',
            ],
        },
        '---',
        {
            'name' : 'Evaluate polynomial at given points',
            'snippet' : [
                'x = np.linspace(0, 3.14)',
                'poly(x)',
            ],
        },
        {
            'name' : 'Return $n$ equally spaced $(x,y)$ values',
            'snippet' : [
                'x, y = poly.linspace(n=100)',
            ],
        },
        {
            'name' : 'Find roots',
            'snippet' : [
                'poly.roots()',
            ],
        },
        {
            'name' : 'Differentiate once',
            'snippet' : [
                'poly.deriv()',
            ],
        },
        {
            'name' : 'Differentiate $n$ times',
            'snippet' : [
                'poly.deriv(n)',
            ],
        },
        {
            'name' : 'Integrate once',
            'snippet' : [
                'poly.integ()',
            ],
        },
        {
            'name' : 'Integrate $n$ times',
            'snippet' : [
                'poly.integ(n)',
            ],
        },
        {
            'name' : 'Integrate with given lower bound and integration constant $k$',
            'snippet' : [
                'poly.integ(lbnd=0.1, k=-2.34',
            ],
        },
        '---',
        {
            'name' : 'Fit to data with series of degree $n$',
            'snippet' : [
                'np.random.seed(11)',
                'x = np.linspace(0, 2*np.pi, 20)',
                'y = np.sin(x) + np.random.normal(scale=.1, size=x.shape)',
                'n = 5',
                'p = T.fit(x, y, n)',
            ],
        },
    ],
});
