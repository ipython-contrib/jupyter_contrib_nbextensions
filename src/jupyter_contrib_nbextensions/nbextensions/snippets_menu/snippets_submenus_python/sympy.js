define([
    "require",
    "./sympy_functions",
    "./sympy_assumptions",
], function (requirejs, sympy_functions, sympy_assumptions) {
    return {
        'name' : 'SymPy',
        'sub-menu' : [
            {
                'name' : 'Setup',
                'snippet'  : [
                    'from __future__ import print_function, division',
                    'from sympy import *',
                    'a, s, t, u, v, w, x, y, z = symbols("a, s, t, u, v, w, x, y, z")',
                    'k, m, n = symbols("k, m, n", integer=True)',
                    'f, g, h = symbols("f, g, h", cls=Function)',
                    'init_printing()',
                ],
            },
            {
                'name' : 'Documentation',
                'external-link' : 'http://docs.sympy.org/latest/index.html',
            },
            '---',
            {
                'name' : 'Constants',
                'sub-menu' : [
                    {
                        'name' : '1',
                        'snippet' : ['S(1)',], //'S.One',],
                    },
                    // {
                    //     'name' : '0',
                    //     'snippet' : ['S.Zero',],
                    // },
                    // {
                    //     'name' : '-1',
                    //     'snippet' : ['S.NegativeOne',],
                    // },
                    {
                        'name' : '1/2',
                        'snippet' : ['S(1)/2',], //'S.Half',],
                    },
                    {
                        'name' : 'Rational numbers',
                        'snippet' : ['Rational(3, 7)',],
                    },
                    '---',
                    {
                        'name' : 'Base of natural logarithm, \\(e\\)',
                        'snippet' : ['E',],
                    },
                    {
                        'name' : 'Unit imaginary number, \\(i\\)',
                        'snippet' : ['I',],
                    },
                    {
                        'name' : 'Geometric constant, \\(\\pi\\)',
                        'snippet' : ['pi',],
                    },
                    {
                        'name' : 'Golden ratio, \\(\\phi\\)',
                        'snippet' : ['GoldenRatio',],
                    },
                    {
                        'name' : 'Euler-Mascheroni constant, \\(\\gamma\\)',
                        'snippet' : ['EulerGamma',],
                    },
                    {
                        'name' : 'Catalan\'s constant, \\(K\\)',
                        'snippet' : ['Catalan',],
                    },
                    '---',
                    {
                        'name' : 'Infinity, \\(\\infty\\)',
                        'snippet' : ['oo',], // 'S.Infinity'
                    },
                    // {
                    //     'name' : 'Negative infinity, \\(-\\infty\\)',
                    //     'snippet' : ['S.NegativeInfinity',],
                    // },
                    {
                        'name' : 'Complex infinity, \\(\\tilde{\\infty}\\)',
                        'snippet' : ['zoo'], //'S.ComplexInfinity',],
                    },
                    {
                        'name' : 'NaN',
                        'snippet' : ['nan',], // 'S.NaN'
                    },
                ],
            },
            sympy_functions,
            {
                'name' : 'Calculus',
                'sub-menu' : [
                    {
                        'name' : 'Differentiate once',
                        'snippet' : [
                            'expr = exp(x**2)',
                            'deriv = diff(expr, x)',
                        ],
                    },
                    {
                        'name' : 'Differentiate multiple times',
                        'snippet' : [
                            'expr = x**4',
                            'deriv = diff(expr, x, 3)',
                        ],
                    },
                    {
                        'name' : 'Mixed partial derivatives',
                        'snippet' : [
                            'expr = exp(x*y*z)',
                            'deriv = diff(expr, x, y, 2, z, 4)',
                        ],
                    },
                    {
                        'name' : 'Finite differences',
                        'snippet' : [
                            'dx0, dx1 = symbols("dx0, dx1")',
                            'formula = as_finite_diff(f(x).diff(x), [x-dx0, x, x+dx1])',
                        ],
                    },
                    '---',
                    {
                        'name' : 'Indefinite integral',
                        'snippet' : [
                            'integral = integrate(cos(x), x)',
                        ],
                    },
                    {
                        'name' : 'Definite integral',
                        'snippet' : [
                            'integral = integrate(exp(-x), (x, 0, oo))',
                        ],
                    },
                    {
                        'name' : 'Double integral',
                        'snippet' : [
                            'integral = integrate(exp(-x**2-y**2), (x, -oo, oo), (y, -oo, oo))',
                        ],
                    },
                    '---',
                    {
                        'name' : 'Limits',
                        'snippet' : [
                            'lim = limit(sin(x)/x, x, 0, "+")',
                        ],
                    },
                    {
                        'name' : 'Series expansion',
                        'snippet' : [
                            'expr = exp(sin(x))',
                            'ser = series(expr, x, 0, 6)',
                        ],
                    },
                    {
                        'name' : 'Series expansion, removing order term',
                        'snippet' : [
                            'expr = exp(sin(x))',
                            'ser = series(expr, x, 0, 6).removeO()',
                        ],
                    },
                    {
                        'name' : 'Summations',
                        'snippet' : [
                            'ell_min,ell,ell_max = symbols("ell_min,ell,ell_max", integer=True)',
                            'summ = summation((2*ell + 1), (ell, ell_min, ell_max))',
                        ],
                    },
                ],
            },

            {
                'name' : 'Solvers',
                'sub-menu' : [
                    {
                        'name' : 'Solve for one variable',
                        'snippet' : [
                            'expr = x**4 - 4*x**3 + 2*x**2 - x',
                            'eqn = Eq(expr, 0)',
                            'soln = solve(eqn, x)',
                        ],
                    },
                    {
                        'name' : 'Solve for two variables',
                        'snippet' : [
                            'eqns = Eq(x + y, 4), Eq(x*y, 3)',
                            'soln = solve(eqns, [x,y])',
                        ],
                    },
                    {
                        'name' : 'Solve differential equation',
                        'snippet' : [
                            'expr = f(x).diff(x, x) + 9*f(x)',
                            "eqn = Eq(expr, 1)  # f''(x) + 9f(x) = 1",
                            'soln = dsolve(eqn, f(x))',
                        ],
                    },
                ],
            },
            {
                'name' : 'Manipulating expressions',
                'sub-menu' : [
                    {
                        'name' : 'Simplify',
                        'snippet' : [
                            'expr = (x**3 + x**2 - x - 1)/(x**2 + 2*x + 1)',
                            'expr = simplify(expr)',
                        ],
                    },
                    {
                        'name' : 'Refine, using assumptions',
                        // 'snippet' : [
                        //     'expr = exp(pi*I*2*x)',
                        //     'assumption = Q.integer(x) & Q.integer(y)',
                        //     'expr = refine(expr, assumption)',
                        // ],
                        'sub-menu' : [
                            {
                                'name' : 'Refine',
                                'snippet' : [
                                    'expr = exp(pi*I*2*(x+y))',
                                    'assumption = Q.integer(x) & Q.integer(y)',
                                    'expr = refine(expr, assumption)',
                                ],
                            },
                            {
                                'name' : 'Refine in context manager',
                                'snippet' : [
                                    'expr = exp(pi*I*2*(x+y))',
                                    'with assuming(Q.integer(x) & Q.integer(y)):',
                                    '    expr = refine(expr)',
                                ],
                            },
                            sympy_assumptions,
                        ],
                    },
                    {
                        'name' : 'Expansion',
                        'sub-menu' : [
                            {
                                'name' : 'Expand basic expressions',
                                'snippet' : [
                                    'expr = (x + 2)*(x - 3)',
                                    'expr = expand(expr)',
                                ],
                            },
                            '---',
                            {
                                'name' : 'Expand, including complex parts',
                                'snippet' : [
                                    'expr = cos(x)',
                                    'expr = expand(expr, complex=True)',
                                ],
                            },
                            {
                                'name' : 'Expand, including functions',
                                'snippet' : [
                                    'expr = gamma(x+3)',
                                    'expr = expand(expr, func=True)',
                                ],
                            },
                            {
                                'name' : 'Expand, including trig',
                                'snippet' : [
                                    'expr = sin(x+y)*(x+y)',
                                    'expr = expand(expr, trig=True)',
                                ],
                            },
                            '---',
                            {
                                'name' : 'Expand only real and imaginary parts',
                                'snippet' : [
                                    'expand_complex(x)',
                                ],
                            },
                            {
                                'name' : 'Expand only functions',
                                'snippet' : [
                                    'expr = gamma(x + 2)',
                                    'expr = expand_func(expr)',
                                ],
                            },
                            {
                                'name' : 'Expand only hypergeometric functions',
                                'snippet' : [
                                    'expr = hyper([1,1], [1,], z) + gamma(z)',
                                    'expr = hyperexpand(expr)',
                                ],
                            },
                            {
                                'name' : 'Expand only logarithms',
                                'snippet' : [
                                    'a, b = symbols("a, b", positive=True)',
                                    'expr = log(a**2*b)',
                                    'expr = expand_log(expr)',
                                ],
                            },
                            {
                                'name' : 'Expand only multiplication over addition',
                                'snippet' : [
                                    'expr = y*(x + z)',
                                    'expr = expand_mul(expr)',
                                ],
                            },
                            {
                                'name' : 'Expand only multinomials',
                                'snippet' : [
                                    'expr = (x + y + z)**3',
                                    'expr = expand_multinomial(expr)',
                                ],
                            },
                            {
                                'name' : 'Expand only powers of multiplied bases',
                                'snippet' : [
                                    'a, b = symbols("a, b", positive=True)',
                                    'expr = (a*b)**z',
                                    'expr = expand_power_base(expr)',
                                ],
                            },
                            {
                                'name' : 'Expand only addition in exponents',
                                'snippet' : [
                                    'expr = x**(y + 2)',
                                    'expr = expand_power_exp(expr)',
                                ],
                            },
                            {
                                'name' : 'Expand only trig',
                                'snippet' : [
                                    'expr = sin(x+y)*(x+y)',
                                    'expr = expand_trig(expr)',
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'Collect terms',
                        'sub-menu' : [
                            {
                                'name' : 'Collect as coefficients of one factor',
                                'snippet' : [
                                    'expr = y*x**2 + z*x**2 + t*x - 2*x + 3',
                                    'expr = collect(expr, x)',
                                ],
                            },
                            {
                                'name' : 'Collect as coefficients of multiple factors',
                                'snippet' : [
                                    'expr = x**2 + y*x**2 + x*y + y + z*y',
                                    'expr = collect(expr, [x, y])',
                                ],
                            },
                            {
                                'name' : 'Collect with respect to wild card',
                                'snippet' : [
                                    'w = Wild("w")',
                                    'expr = z*x**y - t*z**y',
                                    'expr = collect(expr, w**y)',
                                ],
                            },
                            {
                                'name' : 'Collect and apply function to each coefficient',
                                'snippet' : [
                                    'expr = expand((x + y + 1)**3)',
                                    'expr = collect(expr, x, factor)',
                                ],
                            },
                            {
                                'name' : 'Recursively collect',
                                'snippet' : [
                                    'expr = (x**2*y + x*y + x + y)/(x*y + z*y)',
                                    'expr = rcollect(expr, y)',
                                ],
                            },
                            {
                                'name' : 'Collect constants',
                                'snippet' : [
                                    'expr = sqrt(3)*x + sqrt(7)*x + sqrt(3) + sqrt(7)',
                                    'expr = collect_const(expr)',
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'Substitutions and replacements',
                        'sub-menu' : [
                            {
                                'name' : 'Substitute one subexpression for another',
                                'snippet' : [
                                    'expr = 1 + x*y',
                                    'expr = expr.subs(x, pi)',
                                ],
                            },
                            {
                                'name' : 'Substitute multiple subexpressions successively',
                                'snippet' : [
                                    'expr = (x+y)/y',
                                    'substitutions = [(x+y, y), (y, x+y)]',
                                    'expr = expr.subs(substitutions)',
                                ],
                            },
                            {
                                'name' : 'Substitute multiple subexpressions simultaneously',
                                'snippet' : [
                                    'expr = (x+y)/y',
                                    'substitutions = [(x+y, y), (y, x+y)]',
                                    'expr = expr.subs(substitutions, simultaneous=True)',
                                ],
                            },
                            '---',
                            {
                                'name' : 'Replace one object with another',
                                'snippet' : [
                                    'expr = 1 + x*y',
                                    'expr = expr.replace(x, pi)',
                                ],
                            },
                            {
                                'name' : 'Replace one object with some function of its arguments',
                                'snippet' : [
                                    'expr = log(sin(x)) + tan(sin(x**2))',
                                    'expr = expr.replace(sin, lambda arg: sin(2*arg))',
                                ],
                            },
                            {
                                'name' : 'Replace a pattern with an object',
                                'snippet' : [
                                    '# Note: `exclude=` specifies that the Wild cannot match any item in the list',
                                    'a, b = symbols("a, b", cls=Wild, exclude=[x,y])',
                                    'expr = 2*x + y + z',
                                    'wild = a*x + b',
                                    'replacement = b - a',
                                    '# Note: `exact=True` demands that all Wilds have nonzero matches',
                                    'expr = expr.replace(wild, replacement, exact=True)',
                                ],
                            },
                            {
                                'name' : 'Replace a pattern with some function of that object',
                                'snippet' : [
                                    'a = symbols("a", cls=Wild, exclude=[])',
                                    'expr = log(sin(x)) + tan(sin(x**2))',
                                    'expr.replace(sin(a), lambda a: sin(2*a))',
                                ],
                            },
                            {
                                'name' : 'Replace anything with some function of that thing',
                                'snippet' : [
                                    'g = 2*sin(x**3)',
                                    'g.replace(lambda expr: expr.is_Function, lambda expr: expr**2)',
                                ],
                            },
                            '---',
                            {
                                'name' : 'Replace exact subexpressions',
                                'snippet' : [
                                    'expr = x**2 + x**4',
                                    'replacements = {x**2: y}',
                                    'expr = expr.xreplace(replacements)',
                                ],
                            },
                            // {
                            //     'name' : 'rewrite',
                            //     'snippet' : [
                            //         'expr = tan(x)',
                            //         'expr = expr.rewrite(sin)',
                            //     ],
                            // },
                        ],
                    },
                    {
                        'name' : 'Evaluation',
                        'sub-menu' : [
                            {
                                'name' : 'Evaluate numerically to arbitrary precision',
                                'snippet' : [
                                    'expr = x * sqrt(8)',
                                    'precision = 50',
                                    'val = N(expr, precision, subs={x:2.4})',
                                ],
                            },
                            {
                                'name' : 'Evaluate numerically to python float',
                                'snippet' : [
                                    'expr = x * sqrt(8)',
                                    'val = float(expr.subs([(x, 2.4)]))',
                                ],
                            },
                            {
                                'name' : 'Create numpy function for efficient evaluation',
                                'snippet' : [
                                    'import numpy',
                                    'a = numpy.arange(10)',
                                    'expr = sin(x)',
                                    'f = lambdify(x, expr, "numpy")',
                                    'vals = f(a)',
                                ],
                            },
                        ],
                    },
                    '---',
                    {
                        'name' : 'Polynomials',
                        'sub-menu' : [
                            {
                                'name' : 'Factor polynomial over rationals',
                                'snippet' : [
                                    'expr = x**3 - x**2 + x - 1',
                                    'expr = factor(expr)',
                                ],
                            },
                            {
                                'name' : 'Collect common powers of a term',
                                'snippet' : [
                                    'expr = x*y + x - 3 + 2*x**2 - z*x**2 + x**3',
                                    'expr = collect(expr, x)',
                                ],
                            },
                            {
                                'name' : 'Extract coefficient of a term',
                                'snippet' : [
                                    'expr = 3+2*x+4*x**2',
                                    'expr = expr.coeff(x**2)',
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'Rational functions',
                        'sub-menu' : [
                            {
                                'name' : 'Cancel',
                                'snippet' : [
                                    'expr = (x**2 + 2*x + 1)/(x**2 + x)',
                                    'expr = cancel(expr)',
                                ],
                            },
                            {
                                'name' : 'Decompose into partial fractions',
                                'snippet' : [
                                    'expr = (4*x**3 + 21*x**2 + 10*x + 12)/(x**4 + 5*x**3 + 5*x**2 + 4*x)',
                                    'expr = apart(expr)',
                                ],
                            },
                            {
                                'name' : 'Join over common denominator',
                                'snippet' : [
                                    'expr = 1/x + 1/y',
                                    'expr = ratsimp(expr)',
                                ],
                            },
                            {
                                'name' : 'Remove square roots from denominator',
                                'snippet' : [
                                    'expr = 1/(1+I)',
                                    'expr = radsimp(expr)',
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'Powers',
                        'sub-menu' : [
                            {
                                'name' : 'Important caveats',
                                'external-link' : 'http://docs.sympy.org/dev/tutorial/simplification.html#powers'
                            },
                            '---',
                            // {
                            //     'name' : 'Setup for these snippets',
                            //     'snippet' : [
                            //         'x, y = symbols("x, y", positive=True)',
                            //         'a, b = symbols("a, b", real=True)',
                            //         'z, t, c = symbols("z, t, c")',
                            //     ],
                            // },
                            {
                                'name' : 'Simplify powers for general arguments',
                                'snippet' : [
                                    'powsimp(x**y * x**z)',
                                ],
                            },
                            {
                                'name' : 'Simplify powers, forcing assumptions',
                                'snippet' : [
                                    'powsimp(x**y * x**z, force=True)',
                                ],
                            },
                            {
                                'name' : 'Expand powers by exponent for general arguments',
                                'snippet' : [
                                    'expand_power_exp(x**(y + z))',
                                ],
                            },
                            {
                                'name' : 'Expand powers of multiplied bases, forcing assumptions',
                                'snippet' : [
                                    'expand_power_base((x*y)**z, force=True)',
                                ],
                            },
                            {
                                'name' : 'Collect exponents on powers for general arguments',
                                'snippet' : [
                                    'powdenest((x**y)**z)',
                                ],
                            },
                            {
                                'name' : 'Collect exponents on powers, forcing assumptions',
                                'snippet' : [
                                    'powdenest((x**y)**z, force=True)',
                                ],
                            },
                            {
                                'name' : 'Collect exponents on powers, forcing assumptions and polar simplifications',
                                'snippet' : [
                                    'powdenest((z**a)**b, force=True, polar=True)',
                                ],
                            },
                            {
                                'name' : 'Denest square-roots',
                                'snippet' : [
                                    'sqrtdenest(sqrt(5 + 2*sqrt(6)))',
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'Exponentials and Logarithms',
                        'sub-menu' : [
                            {
                                'name' : 'Important caveats',
                                'external-link' : 'http://docs.sympy.org/dev/tutorial/simplification.html#exponentials-and-logarithms'
                            },
                            '---',
                            // {
                            //     'name' : 'Setup for these snippets',
                            //     'snippet' : [
                            //         'x, y = symbols("x, y", positive=True)',
                            //         'n = symbols("n", real=True)',
                            //     ],
                            // },
                            {
                                'name' : 'Combine exponentials',
                                'snippet' : [
                                    'powsimp(exp(y) * exp(z))',
                                ],
                            },
                            {
                                'name' : 'Expand logarithms for general arguments',
                                'snippet' : [
                                    'expand_log(log(x*y))',
                                ],
                            },
                            {
                                'name' : 'Expand logarithms, forcing assumptions',
                                'snippet' : [
                                    'expand_log(log(z**2), force=True)',
                                ],
                            },
                            {
                                'name' : 'Combine logarithms for general arguments',
                                'snippet' : [
                                    'logcombine(log(x) + z*log(y))',
                                ],
                            },
                            {
                                'name' : 'Combine logarithms, forcing assumptions',
                                'snippet' : [
                                    'logcombine(log(x) + z*log(y))',
                                ],
                            },
                            {
                                'name' : 'Simplification, possibly to trig functions',
                                'snippet' : [
                                    'exptrigsimp(exp(z) + exp(-z))',
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'Trigonometric functions',
                        'sub-menu' : [
                            {
                                'name' : 'Expansion',
                                'snippet' : [
                                    'expr = sin(x + y)',
                                    'expr = expand(expr, trig=True)',
                                ],
                            },
                            {
                                'name' : 'Simplification',
                                'snippet' : [
                                    'expr = sin(x)**4 - 2*cos(x)**2*sin(x)**2 + cos(x)**4',
                                    'expr = trigsimp(expr)',
                                ],
                            },
                            {
                                'name' : 'Simplification, possibly to exponentials',
                                'snippet' : [
                                    'expr = cosh(z) - sinh(z)',
                                    'expr = exptrigsimp(expr)',
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'Miscellaneous',
                        'sub-menu' : [
                            {
                                'name' : 'Simplify factorials',
                                'snippet' : [
                                    'expr = factorial(n)/factorial(n - 3)',
                                    'expr = combsimp(expr)',
                                ],
                            },
                            {
                                'name' : 'Simplify binomials',
                                'snippet' : [
                                    'expr = binomial(n+1, k+1)/binomial(n, k)',
                                    'expr = combsimp(expr)',
                                ],
                            },
                            {
                                'name' : 'Simplify numerical expressions to exact values',
                                'snippet' : [
                                    'nsimplify(4.0/(1+sqrt(5.0)), constants=[GoldenRatio,])',
                                ],
                            },
                            {
                                'name' : 'Expand gamma functions',
                                'snippet' : [
                                    'expr = gamma(z+3)',
                                    'expr = expand_func(expr)',
                                ],
                            },
                            {
                                'name' : 'Simplify Bessel functions',
                                'snippet' : [
                                    'expr = besselj(x, z*polar_lift(-1))',
                                    'expr = besselsimp(expr)',
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };
});
