define([
    "require",
    "./scipy_constants",
    "./scipy_special",
], function (requirejs, scipy_constants, scipy_special) {
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

            {
                'name' : 'Documentation',
                'external-link' : 'http://docs.scipy.org/doc/scipy/reference/',
            },

            '---',
            
            // {
            //     'name' : 'Clustering algorithms',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['from scipy import cluster',],
            //         },
            //     ],
            // },

            scipy_constants,

            {
                'name' : 'Fast Fourier Transform routines',
                'sub-menu' : [
                    {
                        'name' : 'Setup',
                        'snippet' : ['from scipy import fftpack',],
                    },
                    '---',
                    {
                        'name' : 'Docs',
                        'external-link' : 'http://docs.scipy.org/doc/scipy-0.15.1/reference/fftpack.html'
                    },
                ],
            },

            {
                'name' : 'Integration and ODE solvers',
                'sub-menu' : [
                    {
                        'name' : 'Setup',
                        'snippet' : ['from scipy import integrate',],
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
                                'name' : 'Integrate func(x) using Gaussian quadrature of order $n$',
                                'snippet' : [
                                    'gaussian = lambda x: 1/np.sqrt(np.pi) * np.exp(-x**2)',
                                    'a,b = 0,1  # limits of integration',
                                    'result,err = integrate.fixed_quad(gaussian, a, b, n=5)',
                                ],
                            },
                            {
                                'name' : 'Integrate with given tolerance using Gaussian quadrature',
                                'snippet' : [
                                    'gaussian = lambda x: 1/np.sqrt(np.pi) * np.exp(-x**2)',
                                    'a,b = 0,1  # limits of integration',
                                    'result,err = integrate.quadrature(gaussian, a, b, tol=1e-8, rtol=1e-8)',
                                ],
                            },
                            {
                                'name' : 'Integrate using Romberg integration',
                                'snippet' : [
                                    'gaussian = lambda x: 1/np.sqrt(np.pi) * np.exp(-x**2)',
                                    'a,b = 0,1  # limits of integration',
                                    'result = integrate.romberg(gaussian, a, b, tol=1e-8, rtol=1e-8)',
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'Integrate given fixed samples',
                        'sub-menu' : [
                            {
                                'name' : 'Trapezoidal rule to compute integral from samples',
                                'snippet' : [
                                    'x = np.linspace(1, 5, num=100)',
                                    'y = 3*x**2 + 1',
                                    'integrate.trapz(y, x) # Exact value is 128',
                                ],
                            },
                            {
                                'name' : 'Trapezoidal rule to cumulatively compute integral from samples',
                                'snippet' : [
                                    'x = np.linspace(1, 5, num=100)',
                                    'y = 3*x**2 + 1',
                                    'integrate.cumtrapz(y, x) # Should range from ~0 to ~128',
                                ],
                            },
                            {
                                'name' : "Simpson's rule to compute integral from samples",
                                'snippet' : [
                                    'x = np.linspace(1, 5, num=100)',
                                    'y = 3*x**2 + 1',
                                    'integrate.simps(y, x) # Exact value is 128',
                                ],
                            },
                            {
                                'name' : 'Romberg Integration to compute integral from $2^k + 1$ evenly spaced samples',
                                'snippet' : [
                                    'x = np.linspace(1, 5, num=2**7+1)',
                                    'y = 3*x**2 + 1',
                                    'integrate.romb(y, x) # Exact value is 128',
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'Numerically integrate ODE systems',
                        'sub-menu' : [
                            {
                                'name' : 'General integration of ordinary differential equations',
                                'snippet' : [
                                    'from scipy.special import gamma, airy',
                                    'def func(y, t):',
                                    '    return [t*y[1], y[0]]',
                                    'x = np.arange(0, 4.0, 0.01)',
                                    'y_0 = [-1.0 / 3**(1.0/3.0) / gamma(1.0/3.0), 1.0 / 3**(2.0/3.0) / gamma(2.0/3.0)]',
                                    'Ai, Aip, Bi, Bip = airy(x)',
                                    'y = odeint(func, y_0, x, rtol=1e-12, atol=1e-12) # Exact answer: (Aip, Ai)',
                                ],
                            },
                            {
                                'name' : 'General integration of ordinary differential equations with known gradient',
                                'snippet' : [
                                    'from scipy.special import gamma, airy',
                                    'def func(y, t):',
                                    '    return [t*y[1], y[0]]',
                                    'def gradient(y, t):',
                                    '    return [[0,t], [1,0]]',
                                    'x = np.arange(0, 4.0, 0.01)',
                                    'y_0 = [-1.0 / 3**(1.0/3.0) / gamma(1.0/3.0), 1.0 / 3**(2.0/3.0) / gamma(2.0/3.0)]',
                                    'Ai, Aip, Bi, Bip = airy(x)',
                                    'y = odeint(func, y_0, x, rtol=1e-12, atol=1e-12, Dfun=gradient) # Exact answer: (Aip, Ai)',
                                ],
                            },
                            {
                                'name' : 'Integrate ODE using VODE and ZVODE routines',
                                'snippet' : [
                                    "def f(t, y, arg1):",
                                    "    return [1j*arg1*y[0] + y[1], -arg1*y[1]**2]",
                                    "def jac(t, y, arg1):",
                                    "    return [[1j*arg1, 1], [0, -arg1*2*y[1]]]",
                                    "y0 = [1.0j, 2.0]",
                                    "t0, t1, dt = 0.0, 10.0, 1.0",
                                    "r = integrate.ode(f, jac).set_integrator('zvode', method='bdf')",
                                    "r.set_initial_value(y0, t0)",
                                    "r.set_f_params(2.0)",
                                    "r.set_jac_params(2.0)",
                                    "while r.successful() and r.t < t1:",
                                    "    r.integrate(r.t+dt)",
                                    "    print('{0}: {1}'.format(r.t, r.y))",
                                ],
                            },
                            // {
                            //     'name' : 'Integrate complex ODE using VODE and ZVODE routines',
                            //     'snippet' : [
                            //         'integrate.complex_ode',
                            //     ],
                            // },
                        ],
                    },
                ],
            },

            {
                'name' : 'Interpolation and smoothing splines',
                'sub-menu' : [
                    {
                        'name' : 'Setup',
                        'snippet' : ['from scipy import interpolate',],
                    },
                    '---',
                    {
                        'name' : 'interp1d',
                        'snippet' : [
                            '# NOTE: `interp1d` is very slow; prefer `InterpolatedUnivariateSpline`',
                            'x = np.linspace(0, 10, 10)',
                            'y = np.cos(-x**2/8.0)',
                            "f = interpolate.interp1d(x, y, kind='cubic')",
                            'X = np.linspace(0, 10, 100)',
                            'Y = f(X)',
                        ],
                    },
                    {
                        'name' : 'splrep / splrev',
                        'snippet' : [
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
            //             'snippet' : ['from scipy import io',],
            //         },
            //        '---',
            //     ],
            // },

            {
                'name' : 'Linear algebra',
                'sub-menu' : [
                    {
                        'name' : 'Setup',
                        'snippet' : ['from scipy import linalg',],
                    },
                    '---',
                    {
                        'name' : 'Docs',
                        'external-link' : 'http://docs.scipy.org/doc/scipy-0.15.1/reference/linalg.html'
                    },
                ],
            },

            // {
            //     'name' : 'Maximum entropy methods',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['from scipy import maxentropy',],
            //         },
            //        '---',
            //     ],
            // },

            // {
            //     'name' : 'N-dimensional image processing',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['from scipy import ndimage',],
            //         },
            //        '---',
            //     ],
            // },

            // {
            //     'name' : 'Orthogonal distance regression',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['from scipy import odr',],
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
                            'from scipy import optimize',
                        ],
                    },
                    '---',
                    {
                        'name' : 'Scalar function minimization',
                        'sub-menu' : [
                            {
                                'name' : 'Unconstrained minimization',
                                'snippet' : [
                                    'f = lambda x: (x - 2) * (x + 1)**2',
                                    "res = optimize.minimize_scalar(f, method='brent')",
                                    'print(res.x)',
                                ],
                            },
                            {
                                'name' : 'Bounded minimization',
                                'snippet' : [
                                    'from scipy.special import j1  # Test function',
                                    "res = optimize.minimize_scalar(j1, bounds=(4, 7), method='bounded')",
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
                                    'def rosen(x):',
                                    '    """The Rosenbrock function"""',
                                    '    return sum(100.0*(x[1:]-x[:-1]**2.0)**2.0 + (1-x[:-1])**2.0)',
                                    'x0 = np.array([1.3, 0.7, 0.8, 1.9, 1.2])',
                                    "res = optimize.minimize(rosen, x0, method='nelder-mead',",
                                    "                        options={'xtol': 1e-8, 'disp': True})",
                                    'print(res.x)',],
                            },
                            {
                                'name' : 'Broyden-Fletcher-Goldfarb-Shanno (BFGS), analytical derivative',
                                'snippet' : [
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
                                    "res = optimize.minimize(rosen, x0, method='BFGS', jac=rosen_der, options={'disp': True})",
                                    'print(res.x)',],
                            },
                            {
                                'name' : 'Broyden-Fletcher-Goldfarb-Shanno (BFGS), finite-difference derivative',
                                'snippet' : [
                                    'def rosen(x):',
                                    '    """The Rosenbrock function"""',
                                    '    return sum(100.0*(x[1:]-x[:-1]**2.0)**2.0 + (1-x[:-1])**2.0)',
                                    'x0 = np.array([1.3, 0.7, 0.8, 1.9, 1.2])',
                                    "res = optimize.minimize(rosen, x0, method='BFGS', options={'disp': True})",
                                    'print(res.x)',],
                            },
                            {
                                'name' : 'Newton-Conjugate-Gradient, full Hessian',
                                'snippet' : [
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
                                    "res = optimize.minimize(rosen, x0, method='Newton-CG', jac=rosen_der, hess=rosen_hess,",
                                    "                        options={'xtol': 1e-8, 'disp': True})",
                                    'print(res.x)'],
                            },
                            {
                                'name' : 'Newton-Conjugate-Gradient, Hessian product',
                                'snippet' : [
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
                                    "res = optimize.minimize(rosen, x0, method='Newton-CG', jac=rosen_der, hessp=rosen_hess_p,",
                                    "                        options={'xtol': 1e-8, 'disp': True})",
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
                                    'def func(x, sign=1.0):',
                                    '    """ Objective function """',
                                    '    return sign*(2*x[0]*x[1] + 2*x[0] - x[0]**2 - 2*x[1]**2)',
                                    'def func_deriv(x, sign=1.0):',
                                    '    """ Derivative of objective function """',
                                    '    dfdx0 = sign*(-2*x[0] + 2*x[1] + 2)',
                                    '    dfdx1 = sign*(2*x[0] - 4*x[1])',
                                    '    return np.array([ dfdx0, dfdx1 ])',
                                    "res = optimize.minimize(func, [-1.0,1.0], args=(-1.0,), jac=func_deriv,",
                                    "                        method='SLSQP', options={'disp': True})",
                                    'print(res.x)',
                                ],
                            },
                            {
                                'name' : 'Constrained Sequential Least SQuares Programming (SLSQP)',
                                'snippet' : [
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
                                    "res = optimize.minimize(func, [-1.0,1.0], args=(-1.0,), jac=func_deriv,",
                                    "                        constraints=cons, method='SLSQP', options={'disp': True})",
                                    'print(res.x)',
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'Fitting (see also numpy.polynomial)',
                        'sub-menu' : [
                            {
                                'name' : 'Basic function fitting',
                                'snippet' : [
                                    'def fitting_function(x, a, b, c):',
                                    '    return a * np.exp(-b * x) + c',
                                    'xdata = np.linspace(0, 4, 50)',
                                    'ydata = fitting_function(xdata, 2.5, 1.3, 0.5) + 0.2 * np.random.normal(size=len(xdata))',
                                    'optimal_parameters, estimated_covariance = optimize.curve_fit(fitting_function, xdata, ydata)',
                                    'estimated_std_dev = np.sqrt(np.diag(estimated_covariance))',
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
            //             'snippet' : ['from scipy import signal',],
            //         },
            //        '---',
            //     ],
            // },

            // {
            //     'name' : 'Sparse matrices and associated routines',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['from scipy import sparse',],
            //         },
            //        '---',
            //     ],
            // },

            // {
            //     'name' : 'Spatial data structures and algorithms',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['from scipy import spatial',],
            //         },
            //        '---',
            //     ],
            // },

            scipy_special,

            {
                'name' : 'Statistical distributions and functions',
                'sub-menu' : [
                    {
                        'name' : 'Setup',
                        'snippet' : ['from scipy import stats',],
                    },
                    '---',
                    {
                        'name' : 'Docs',
                        'external-link' : 'http://docs.scipy.org/doc/scipy-0.15.1/reference/stats.html'
                    },
                ],
            },

            // {
            //     'name' : 'C/C++ integration',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['from scipy import weave',],
            //         },
            //         '---',
            //     ],
            // },
        ],
    };
});
