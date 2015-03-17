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
                    {
                        'name' : 'Integrate given function object',
                        'sub-menu' : [
                            {
                                'name' : 'General-purpose integration',
                                'snippet' : [
                                    'from scipy import integrate',
                                    'def f(x, a, b):',
                                    '    return a * x + b',
                                    'integral,error = integrate.quad(f, 0, 4.5, args=(2,1))  # integrates 2*x+1',
                                    'print(integral, error)',
                                ],
                            },
                            {
                                'name' : 'General purpose double integration',
                                'snippet' : [
                                    'from scipy import integrate',
                                    'def integrand(y, x):',
                                    '    return x * y**2',
                                    'x_lower_lim, x_upper_lim = 0.0, 0.5',
                                    'y_lower_lim, y_upper_lim = lambda x:0.0, lambda x:1.0-2.0*x',
                                    '# int_{x=0}^{0.5} int_{y=0}^{1-2x} x y dx dy',
                                    'integral,error = integrate.dblquad(integrand,',
                                    '                                   x_lower_lim, x_upper_lim,',
                                    '                                   y_lower_lim, y_upper_lim)',
                                    'print(integral, error)',
                                ],
                            },
                            {
                                'name' : 'General purpose triple integration',
                                'snippet' : [
                                    'from scipy import integrate',
                                    'def integrand(z, y, x):',
                                    '    return x * y**2 + z',
                                    'x_lower_lim, x_upper_lim = 0.0, 0.5',
                                    'y_lower_lim, y_upper_lim = lambda x:0.0, lambda x:1.0-2.0*x',
                                    'z_lower_lim, z_upper_lim = lambda x,y:-1.0, lambda x,y:1.0+2.0*x-y',
                                    '# int_{x=0}^{0.5} int_{y=0}^{1-2x} int_{z=-1}^{1+2x-y} (x y**2 + z) dz dy dx',
                                    'integral,error = integrate.tplquad(integrand,',
                                    '                                   x_lower_lim, x_upper_lim,',
                                    '                                   y_lower_lim, y_upper_lim,',
                                    '                                   z_lower_lim, z_upper_lim)',
                                    'print(integral, error)',
                                ],
                            },
                            {
                                'name' : 'General purpose n-fold integration',
                                'snippet' : [
                                    'from scipy import integrate',
                                    'def integrand(x0, x1, x2):',
                                    '    return x2 * x1**2 + x0',
                                    'x2_lim = (0.0, 0.5)',
                                    'x1_lim = lambda x2:(0.0, 1.0-2.0*x2)',
                                    'x0_lim = lambda x1,x2:(-1.0, 1.0+2.0*x2-x1)',
                                    '# int_{x2=0}^{0.5} int_{x1=0}^{1-2x2} int_{x0=-1}^{1+2x2-x1} (x2 x1**2 + x0) dx0 dx1 dx2',
                                    'integral,error = integrate.nquad(integrand, [x0_lim, x1_lim, x2_lim])',
                                    'print(integral, error)',
                                ],
                            },
                            {
                                'name' : 'Integrate func(x) using Gaussian quadrature of order n',
                                'snippet' : [], // ['fixed_quad',],
                            },
                            {
                                'name' : 'Integrate with given tolerance using Gaussian quadrature',
                                'snippet' : [], // ['quadrature',],
                            },
                            {
                                'name' : 'Integrate func using Romberg integration',
                                'snippet' : [], // ['romberg',],
                            },
                        ],
                    },
                    {
                        'name' : 'Integrate given fixed samples',
                        'sub-menu' : [
                            {
                                'name' : 'Trapezoidal rule to compute integral from samples',
                                'snippet' : [], // 'trapz',
                            },
                            {
                                'name' : 'Trapezoidal rule to cumulatively compute integral',
                                'snippet' : [], // 'cumtrapz',
                            },
                            {
                                'name' : "Simpson's rule to compute integral from samples",
                                'snippet' : [], // 'simps',
                            },
                            {
                                'name' : 'Romberg Integration to compute integral from $2^k + 1$ evenly spaced samples',
                                'snippet' : [], // 'romb',
                            },
                        ],
                    },
                    {
                        'name' : 'Numerically integrate ODE systems',
                        'sub-menu' : [
                            {
                                'name' : 'General integration of ordinary differential equations',
                                'snippet' : [], // ['odeint',],
                            },
                            {
                                'name' : 'Integrate ODE using VODE and ZVODE routines',
                                'snippet' : [], // ['ode',],
                            },
                        ],
                    },
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
                    {
                        'name' : 'interp1d',
                        'snippet' : [
                            '# NOTE: `interp1d` is very slow; prefer `InterpolatedUnivariateSpline`',
                            'from scipy.interpolate import interp1d',
                            'x = np.linspace(0, 10, 10)',
                            'y = np.cos(-x**2/8.0)',
                            "f = interp1d(x, y, kind='cubic')",
                            'X = np.linspace(0, 10, 100)',
                            'Y = f(X)',
                        ],
                    },
                    {
                        'name' : 'splrep / splrev',
                        'snippet' : [
                            'from scipy import interpolate',
                            'x = np.arange(0, 2*np.pi+np.pi/4, 2*np.pi/8)',
                            'y = np.sin(x)',
                            'tck = interpolate.splrep(x, y, s=0)',
                            'xnew = np.arange(0,2*np.pi,np.pi/50)',
                            'ynew = interpolate.splev(xnew, tck, der=0)',
                        ],
                    },
                    {
                        'name' : 'InterpolatedUnivariateSpline',
                        'snippet' : [
                            'from scipy import interpolate',
                            'x = np.arange(0, 2*np.pi+np.pi/4, 2*np.pi/8)',
                            'y = np.sin(x)',
                            's = interpolate.InterpolatedUnivariateSpline(x, y)',
                            'xnew = np.arange(0, 2*np.pi, np.pi/50)',
                            'ynew = s(xnew)',
                        ],
                    },
                    {
                        'name' : 'Multivariate interpolation',
                        'sub-menu' : [

                        ],
                    },
                    {
                        'name' : '2-D Splines',
                        'sub-menu' : [

                        ],
                    },
                    {
                        'name' : 'Radial basis functions',
                        'sub-menu' : [

                        ],
                    },
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
                        'snippet' : [
                            'import numpy as np',
                            'import scipy.optimize',
                            'from scipy.optimize import minimize',
                        ],
                    },
                    '---',
                    {
                        'name' : 'Scalar function minimization',
                        'sub-menu' : [
                            {
                                'name' : 'Unconstrained minimization',
                                'snippet' : [
                                    'from scipy.optimize import minimize_scalar',
                                    'f = lambda x: (x - 2) * (x + 1)**2',
                                    "res = minimize_scalar(f, method='brent')",
                                    'print(res.x)',
                                ],
                            },
                            {
                                'name' : 'Bounded minimization',
                                'snippet' : [
                                    'from scipy.optimize import minimize_scalar',
                                    'from scipy.special import j1  # Test function',
                                    "res = minimize_scalar(j1, bounds=(4, 7), method='bounded')",
                                    'print(res.x)',
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'General-purpose optimization',
                        'sub-menu' : [
                            {
                                'name' : 'Nelder-Mead Simplex algorithm',
                                'snippet' : [
                                    'from scipy.optimize import minimize',
                                    'def rosen(x):',
                                    '    """The Rosenbrock function"""',
                                    '    return sum(100.0*(x[1:]-x[:-1]**2.0)**2.0 + (1-x[:-1])**2.0)',
                                    'x0 = np.array([1.3, 0.7, 0.8, 1.9, 1.2])',
                                    "res = minimize(rosen, x0, method='nelder-mead',",
                                    "               options={'xtol': 1e-8, 'disp': True})",
                                    'print(res.x)',],
                            },
                            {
                                'name' : 'Broyden-Fletcher-Goldfarb-Shanno (BFGS), analytical derivative',
                                'snippet' : ['from scipy.optimize import minimize',
                                             'def rosen(x):',
                                             '    """The Rosenbrock function"""',
                                             '    return sum(100.0*(x[1:]-x[:-1]**2.0)**2.0 + (1-x[:-1])**2.0)',
                                             'def rosen_der(x):',
                                             '    """Derivative of the Rosenbrock function"""',
                                             '    xm = x[1:-1]',
                                             '    xm_m1 = x[:-2]',
                                             '    xm_p1 = x[2:]',
                                             '    der = np.zeros_like(x)',
                                             '    der[1:-1] = 200*(xm-xm_m1**2) - 400*(xm_p1 - xm**2)*xm - 2*(1-xm)',
                                             '    der[0] = -400*x[0]*(x[1]-x[0]**2) - 2*(1-x[0])',
                                             '    der[-1] = 200*(x[-1]-x[-2]**2)',
                                             '    return der',
                                             'x0 = np.array([1.3, 0.7, 0.8, 1.9, 1.2])',
                                             "res = minimize(rosen, x0, method='BFGS', jac=rosen_der, options={'disp': True})",
                                             'print(res.x)',],
                            },
                            {
                                'name' : 'Broyden-Fletcher-Goldfarb-Shanno (BFGS), finite-difference derivative',
                                'snippet' : ['from scipy.optimize import minimize',
                                             'def rosen(x):',
                                             '    """The Rosenbrock function"""',
                                             '    return sum(100.0*(x[1:]-x[:-1]**2.0)**2.0 + (1-x[:-1])**2.0)',
                                             'x0 = np.array([1.3, 0.7, 0.8, 1.9, 1.2])',
                                             "res = minimize(rosen, x0, method='BFGS', options={'disp': True})",
                                             'print(res.x)',],
                            },
                            {
                                'name' : 'Newton-Conjugate-Gradient, full Hessian',
                                'snippet' : ['from scipy.optimize import minimize',
                                             'def rosen(x):',
                                             '    """The Rosenbrock function"""',
                                             '    return sum(100.0*(x[1:]-x[:-1]**2.0)**2.0 + (1-x[:-1])**2.0)',
                                             'def rosen_der(x):',
                                             '    """Derivative of the Rosenbrock function"""',
                                             '    xm = x[1:-1]',
                                             '    xm_m1 = x[:-2]',
                                             '    xm_p1 = x[2:]',
                                             '    der = np.zeros_like(x)',
                                             '    der[1:-1] = 200*(xm-xm_m1**2) - 400*(xm_p1 - xm**2)*xm - 2*(1-xm)',
                                             '    der[0] = -400*x[0]*(x[1]-x[0]**2) - 2*(1-x[0])',
                                             '    der[-1] = 200*(x[-1]-x[-2]**2)',
                                             '    return der',
                                             'def rosen_hess(x):',
                                             '    x = np.asarray(x)',
                                             '    H = np.diag(-400*x[:-1],1) - np.diag(400*x[:-1],-1)',
                                             '    diagonal = np.zeros_like(x)',
                                             '    diagonal[0] = 1200*x[0]-400*x[1]+2',
                                             '    diagonal[-1] = 200',
                                             '    diagonal[1:-1] = 202 + 1200*x[1:-1]**2 - 400*x[2:]',
                                             '    H = H + np.diag(diagonal)',
                                             '    return H',
                                             'x0 = np.array([1.3, 0.7, 0.8, 1.9, 1.2])',
                                             "res = minimize(rosen, x0, method='Newton-CG', jac=rosen_der, hess=rosen_hess,",
                                             "               options={'xtol': 1e-8, 'disp': True})",
                                             'print(res.x)'],
                            },
                            {
                                'name' : 'Newton-Conjugate-Gradient, Hessian product',
                                'snippet' : ['from scipy.optimize import minimize',
                                             'def rosen(x):',
                                             '    """The Rosenbrock function"""',
                                             '    return sum(100.0*(x[1:]-x[:-1]**2.0)**2.0 + (1-x[:-1])**2.0)',
                                             'def rosen_der(x):',
                                             '    """Derivative of the Rosenbrock function"""',
                                             '    xm = x[1:-1]',
                                             '    xm_m1 = x[:-2]',
                                             '    xm_p1 = x[2:]',
                                             '    der = np.zeros_like(x)',
                                             '    der[1:-1] = 200*(xm-xm_m1**2) - 400*(xm_p1 - xm**2)*xm - 2*(1-xm)',
                                             '    der[0] = -400*x[0]*(x[1]-x[0]**2) - 2*(1-x[0])',
                                             '    der[-1] = 200*(x[-1]-x[-2]**2)',
                                             '    return der',
                                             'def rosen_hess_p(x,p):',
                                             '    x = np.asarray(x)',
                                             '    Hp = np.zeros_like(x)',
                                             '    Hp[0] = (1200*x[0]**2 - 400*x[1] + 2)*p[0] - 400*x[0]*p[1]',
                                             '    Hp[1:-1] = (-400*x[:-2]*p[:-2]+(202+1200*x[1:-1]**2-400*x[2:])*p[1:-1] ',
                                             '                -400*x[1:-1]*p[2:])',
                                             '    Hp[-1] = -400*x[-2]*p[-2] + 200*p[-1]',
                                             '    return Hp',
                                             'x0 = np.array([1.3, 0.7, 0.8, 1.9, 1.2])',
                                             "res = minimize(rosen, x0, method='Newton-CG', jac=rosen_der, hessp=rosen_hess_p,",
                                             "               options={'xtol': 1e-8, 'disp': True})",
                                             'print(res.x)'],
                            },
                        ],
                    },
                    {
                        'name' : 'Constrained multivariate minimization',
                        'sub-menu' : [
                            {
                                'name' : 'Unconstrained Sequential Least SQuares Programming (SLSQP)',
                                'snippet' : [
                                    'from scipy.optimize import minimize',
                                    'def func(x, sign=1.0):',
                                    '    """ Objective function """',
                                    '    return sign*(2*x[0]*x[1] + 2*x[0] - x[0]**2 - 2*x[1]**2)',
                                    'def func_deriv(x, sign=1.0):',
                                    '    """ Derivative of objective function """',
                                    '    dfdx0 = sign*(-2*x[0] + 2*x[1] + 2)',
                                    '    dfdx1 = sign*(2*x[0] - 4*x[1])',
                                    '    return np.array([ dfdx0, dfdx1 ])',
                                    "res = minimize(func, [-1.0,1.0], args=(-1.0,), jac=func_deriv,",
                                    "               method='SLSQP', options={'disp': True})",
                                    'print(res.x)',
                                ],
                            },
                            {
                                'name' : 'Constrained Sequential Least SQuares Programming (SLSQP)',
                                'snippet' : [
                                    'from scipy.optimize import minimize',
                                    'def func(x, sign=1.0):',
                                    '    """ Objective function """',
                                    '    return sign*(2*x[0]*x[1] + 2*x[0] - x[0]**2 - 2*x[1]**2)',
                                    'def func_deriv(x, sign=1.0):',
                                    '    """ Derivative of objective function """',
                                    '    dfdx0 = sign*(-2*x[0] + 2*x[1] + 2)',
                                    '    dfdx1 = sign*(2*x[0] - 4*x[1])',
                                    '    return np.array([ dfdx0, dfdx1 ])',
                                    '# Constraints correspond to x**3-y=0 and y-1>=0, respectively',
                                    "cons = ({'type': 'eq',",
                                    "         'fun' : lambda x: np.array([x[0]**3 - x[1]]),",
                                    "         'jac' : lambda x: np.array([3.0*(x[0]**2.0), -1.0])},",
                                    "        {'type': 'ineq',",
                                    "         'fun' : lambda x: np.array([x[1] - 1]),",
                                    "         'jac' : lambda x: np.array([0.0, 1.0])})",
                                    "res = minimize(func, [-1.0,1.0], args=(-1.0,), jac=func_deriv,",
                                    "               constraints=cons, method='SLSQP', options={'disp': True})",
                                    'print(res.x)',
                                ],
                            },
                        ],
                    },
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
