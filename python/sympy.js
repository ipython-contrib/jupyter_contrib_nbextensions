define({
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
        { // See <http://docs.sympy.org/dev/modules/functions/index.html#functions-contents> for a list
            'name' : 'Functions',
            'sub-menu' : [
                {
                    'name' : 'Elementary functions',
                    'sub-menu' : [
                        {
                            'name' : 'Abs',
                            'snippet' : ['Abs(-1)',],
                        },
                        {
                            'name' : 'acos',
                            'snippet' : ['acos(S(1)/2)',],
                        },
                        {
                            'name' : 'acosh',
                            'snippet' : ['acosh(S(1)/2)',],
                        },
                        {
                            'name' : 'acot',
                            'snippet' : ['acot(1)',],
                        },
                        {
                            'name' : 'acoth',
                            'snippet' : ['acoth(I)',],
                        },
                        {
                            'name' : 'arg',
                            'snippet' : ['arg(exp(pi*I))',],
                        },
                        {
                            'name' : 'asin',
                            'snippet' : ['asin(S(1)/2)',],
                        },
                        {
                            'name' : 'asinh',
                            'snippet' : ['asinh(I)',],
                        },
                        {
                            'name' : 'atan',
                            'snippet' : ['atan(1)',],
                        },
                        {
                            'name' : 'atan2',
                            'snippet' : ['atan2(1,sqrt(3))',],
                        },
                        {
                            'name' : 'atanh',
                            'snippet' : ['atanh(I)',],
                        },
                        {
                            'name' : 'ceiling',
                            'snippet' : ['ceiling(S(3)/2)',],
                        },
                        {
                            'name' : 'conjugate',
                            'snippet' : ['conjugate(1+I)',],
                        },
                        {
                            'name' : 'cos',
                            'snippet' : ['cos(2*pi/3)',],
                        },
                        {
                            'name' : 'cosh',
                            'snippet' : ['cosh(pi*I/3)',],
                        },
                        {
                            'name' : 'cot',
                            'snippet' : ['cot(pi/4)',],
                        },
                        {
                            'name' : 'coth',
                            'snippet' : ['coth(pi*I/4)',],
                        },
                        {
                            'name' : 'exp',
                            'snippet' : ['exp(1+I)',],
                        },
                        {
                            'name' : 'floor',
                            'snippet' : ['floor(S(3)/2)',],
                        },
                        {
                            'name' : 'Identity function',
                            'snippet' : ['Id(x)',],
                        },
                        {
                            'name' : 'im',
                            'snippet' : ['im(2+3*I)',],
                        },
                        {
                            'name' : 'Lambert W (a.k.a. product logarithm)',
                            'snippet' : ['LambertW(x, n)',],
                        },
                        {
                            'name' : 'log',
                            'snippet' : ['log(x)',],
                        },
                        {
                            'name' : 'Min',
                            'snippet' : [
                                'p = Symbol("p", negative=True)',
                                'q = Symbol("q", positive=True)',
                                'Min(p, q)',
                            ],
                        },
                        {
                            'name' : 'Max',
                            'snippet' : [
                                'p = Symbol("p", negative=True)',
                                'q = Symbol("q", positive=True)',
                                'Max(p, q)',
                            ],
                        },
                        {
                            'name' : 'Piecewise',
                            'snippet' : ['Piecewise((0, x<1), (x**2, x>=5), (log(x), True))',],
                        },
                        {
                            'name' : 'Product logarithm',
                            'snippet' : ['LambertW(x)',],
                        },
                        {
                            'name' : 're',
                            'snippet' : ['re(2+I)',],
                        },
                        {
                            'name' : 'root',
                            'snippet' : ['root(-8, 3)',],
                        },
                        {
                            'name' : 'sin',
                            'snippet' : ['sin(pi/4)',],
                        },
                        {
                            'name' : 'sinh',
                            'snippet' : ['sinh(pi*I/2)',],
                        },
                        {
                            'name' : 'sqrt',
                            'snippet' : ['sqrt(4)',],
                        },
                        {
                            'name' : 'sign',
                            'snippet' : ['sign(-3)',],
                        },
                        {
                            'name' : 'tan',
                            'snippet' : ['tan(pi/4)',],
                        },
                        {
                            'name' : 'tanh',
                            'snippet' : ['tanh(pi*I/4)',],
                        },
                    ],
                },
                {
                    'name' : 'Combinatorial functions',
                    'sub-menu' : [
                        {
                            'name' : 'Bell number',
                            'snippet' : ['bell(n)',],
                        },
                        {
                            'name' : 'Bell polynomial',
                            'snippet' : ['bell(n, k)',],
                        },
                        {
                            'name' : 'Bell polynomial of the second kind',
                            'snippet' : [
                                'n = 6',
                                'k = 2',
                                'x_j = symbols("x:{0}".format(n-k+1))',
                                'bell(n, k, x_j)',
                            ],
                        },
                        {
                            'name' : 'Bernoulli number',
                            'snippet' : ['bernoulli(n)',],
                        },
                        {
                            'name' : 'Bernoulli polynomial',
                            'snippet' : ['bernoulli(n, x)',],
                        },
                        {
                            'name' : 'Binomial coefficient (nCk)',
                            'snippet' : ['binomial(n, k)',],
                        },
                        {
                            'name' : 'Catalan number',
                            'snippet' : ['catalan(n)',],
                        },
                        {
                            'name' : 'Euler number',
                            'snippet' : ['euler(n)',],
                        },
                        {
                            'name' : 'Factorial',
                            'snippet' : ['factorial(n)',],
                        },
                        {
                            'name' : 'Double factorial',
                            'snippet' : ['factorial2(n)',],
                        },
                        {
                            'name' : 'Falling factorial',
                            'snippet' : ['ff(x, k)',],
                        },
                        {
                            'name' : 'Fibonacci number',
                            'snippet' : ['fibonacci(n)',],
                        },
                        {
                            'name' : 'Fibonacci polynomial',
                            'snippet' : ['fibonacci(n, x)',],
                        },
                        {
                            'name' : 'Harmonic number',
                            'snippet' : ['harmonic(n)',],
                        },
                        {
                            'name' : 'Generalized harmonic number',
                            'snippet' : ['harmonic(n, m)',],
                        },
                        {
                            'name' : 'Lucas number',
                            'snippet' : ['lucas(n)',],
                        },
                        {
                            'name' : 'Rising factorial',
                            'snippet' : ['rf(x, k)',],
                        },
                        {
                            'name' : 'Stirling number of the second kind',
                            'snippet' : ['stirling(n, k)',],
                        },
                        {
                            'name' : 'Stirling number of the first kind',
                            'snippet' : ['stirling(n, k, kind=1, signed=False)',],
                        },
                        {
                            'name' : 'Reduced Stirling number of the second kind',
                            'snippet' : ['stirling(n, k, d)',],
                        },
                        {
                            'name' : 'Number of combinations of length k among n items',
                            'snippet' : ['nC(n, k)',],
                        },
                        {
                            'name' : 'Number of permutations of length k among n items',
                            'snippet' : ['nP(n, k)',],
                        },
                        {
                            'name' : 'Number of partitions of length k among n items',
                            'snippet' : ['nT(n, k)',],
                        },
                    ],
                },
                {
                    'name' : 'Special functions',
                    'sub-menu' : [
                        {
                            'name' : 'Dirac delta function',
                            'snippet' : ['DiracDelta(x)',],
                        },
                        {
                            'name' : 'Derivative of Dirac delta function',
                            'snippet' : ['DiracDelta(x, k)',],
                        },
                        {
                            'name' : 'Heaviside function',
                            'snippet' : ['Heaviside(X)',],
                        },
                        {
                            'name' : 'Gamma, Beta and related Functions',
                            'sub-menu' : [
                                {
                                    'name' : 'Gamma function',
                                    'snippet' : ['gamma(x)',],
                                },
                                {
                                    'name' : 'Lower incomplete gamma function',
                                    'snippet' : ['lowergamma(s, x)',],
                                },
                                {
                                    'name' : 'Upper incomplete gamma function',
                                    'snippet' : ['uppergamma(s, x)',],
                                },
                                {
                                    'name' : 'Polygamma function',
                                    'snippet' : ['polygamma(n, z)',],
                                },
                                {
                                    'name' : 'Log Gamma function',
                                    'snippet' : ['loggamma(x)',],
                                },
                                {
                                    'name' : 'Digamma function',
                                    'snippet' : ['digamma(x)',],
                                },
                                {
                                    'name' : 'Trigamma function',
                                    'snippet' : ['trigamma(x)',],
                                },
                                {
                                    'name' : 'Euler Beta function',
                                    'snippet' : ['beta(x, y)',],
                                },
                            ],
                        },
                        {
                            'name' : 'Error Functions and Fresnel Integrals',
                            'sub-menu' : [
                                {
                                    'name' : 'Gauss error function',
                                    'snippet' : ['erf(x)',],
                                },
                                {
                                    'name' : 'Complementary error function',
                                    'snippet' : ['erfc(x)',],
                                },
                                {
                                    'name' : 'Imaginary error function',
                                    'snippet' : ['erfi(x)',],
                                },
                                {
                                    'name' : 'Two-argument error function',
                                    'snippet' : ['erf2(x, y)',],
                                },
                                {
                                    'name' : 'Inverse error function',
                                    'snippet' : ['erfinv(y)',],
                                },
                                {
                                    'name' : 'Inverse complementary error function',
                                    'snippet' : ['erfcinv(y)',],
                                },
                                {
                                    'name' : 'Inverse two-argument error function',
                                    'snippet' : ['erf2inv(x, y)',],
                                },
                                {
                                    'name' : 'Fresnel integral S',
                                    'snippet' : ['fresnels(z)',],
                                },
                                {
                                    'name' : 'Fresnel integral C',
                                    'snippet' : ['fresnelc(z)',],
                                },
                            ],
                        },
                        {
                            'name' : 'Exponential, Logarithmic and Trigonometric Integrals',
                            'sub-menu' : [
                                {
                                    'name' : 'Exponential integral',
                                    'snippet' : ['Ei(x)',],
                                },
                                {
                                    'name' : 'Generalised exponential integral',
                                    'snippet' : ['expint(x, z)',],
                                },
                                {
                                    'name' : 'Special case of the generalised exponential integral',
                                    'snippet' : ['E1(z)',],
                                },
                                {
                                    'name' : 'Classical logarithmic integral',
                                    'snippet' : ['li(x)',],
                                },
                                {
                                    'name' : 'Offset logarithmic integral',
                                    'snippet' : ['Li(x)',],
                                },
                                {
                                    'name' : 'Sine integral',
                                    'snippet' : ['Si(z)',],
                                },
                                {
                                    'name' : 'Cosine integral',
                                    'snippet' : ['Ci(z)',],
                                },
                                {
                                    'name' : 'Hyperbolic sine integral',
                                    'snippet' : ['Shi(z)',],
                                },
                                {
                                    'name' : 'Hyperbolic cosine integral',
                                    'snippet' : ['Chi(z)',],
                                },
                            ],
                        },
                        {
                            'name' : 'Bessel Type Functions',
                            'sub-menu' : [
                                {
                                    'name' : 'Bessel function of the first kind',
                                    'snippet' : ['besselj(n, z)',],
                                },
                                {
                                    'name' : 'Bessel function of the second kind',
                                    'snippet' : ['bessely(n, z)',],
                                },
                                {
                                    'name' : 'Modified Bessel function of the first kind',
                                    'snippet' : ['besseli(n, z)',],
                                },
                                {
                                    'name' : 'Modified Bessel function of the second kind',
                                    'snippet' : ['besselk(n, z)',],
                                },
                                {
                                    'name' : 'Hankel function of the first kind',
                                    'snippet' : ['hankel1(n, z)',],
                                },
                                {
                                    'name' : 'Hankel function of the second kind',
                                    'snippet' : ['hankel2(n, z)',],
                                },
                                {
                                    'name' : 'Spherical Bessel function of the first kind',
                                    'snippet' : ['jn(n, z)',],
                                },
                                {
                                    'name' : 'Spherical Bessel function of the second kind',
                                    'snippet' : ['yn(n, z)',],
                                },
                                {
                                    'name' : 'Zeros of the spherical Bessel function of the first kind',
                                    'snippet' : ['jn_zeros(n, k)',],
                                },
                            ],
                        },
                        {
                            'name' : 'Airy Functions',
                            'sub-menu' : [
                                {
                                    'name' : 'Airy function of the first kind',
                                    'snippet' : ['airyai(z)',],
                                },
                                {
                                    'name' : 'Airy function of the second kind',
                                    'snippet' : ['airybi(z)',],
                                },
                                {
                                    'name' : 'Derivative of the Airy function of the first kind',
                                    'snippet' : ['airyaiprime(z)',],
                                },
                                {
                                    'name' : 'Derivative of the Airy function of the second kind',
                                    'snippet' : ['airybiprime(z)',],
                                },
                            ],
                        },
                        {
                            'name' : 'B-Splines',
                            'sub-menu' : [
                                {
                                    'name' : 'The n-th B-spline at x of degree d with given knots',
                                    'snippet' : [
                                        'd = 3',
                                        'knots = range(5)',
                                        'n = 0',
                                        'bspline_basis(d, knots, n, x, close=True)',
                                    ],
                                },
                                {
                                    'name' : 'The B-splines at x of degree d with given knots',
                                    'snippet' : ['bspline_basis_set(d, knots, x)',],
                                },
                            ],
                        },
                        {
                            'name' : 'Riemann Zeta and Related Functions',
                            'sub-menu' : [
                                {
                                    'name' : 'Riemann zeta function',
                                    'snippet' : ['zeta(s, 1)',],
                                },
                                {
                                    'name' : 'Hurwitz zeta function',
                                    'snippet' : ['zeta(s, a)',],
                                },
                                {
                                    'name' : 'Dirichlet eta function',
                                    'snippet' : ['eta(s)',],
                                },
                                {
                                    'name' : 'Polylogarithm function',
                                    'snippet' : ['polylog(s, z)',],
                                },
                                {
                                    'name' : 'Lerch transcendent (Lerch phi function)',
                                    'snippet' : ['lerchphi(z, s, a)',],
                                },
                            ],
                        },
                        {
                            'name' : 'Hypergeometric Functions',
                            'sub-menu' : [
                                {
                                    'name' : 'Generalized hypergeometric function',
                                    'snippet' : [
                                        'p = 3',
                                        'q = 2',
                                        'a_j = symbols("a:{0}".format(p)) # numerator parameters',
                                        'b_k = symbols("b:{0}".format(q)) # denominator parameters',
                                        'hyper(a_j, b_k)',
                                    ],
                                },
                                {
                                    'name' : 'Meijer G-function',
                                    'snippet' : [
                                        'm,n = 1,2',
                                        'p,q = 4,1',
                                        'a_j = symbols("a:{0}".format(p)) # numerator parameters',
                                        'b_k = symbols("b:{0}".format(q)) # denominator parameters',
                                        'meijerg(a_j[:n], a_j[n:p], b_k[:m], b_k[m:q], x)',
                                    ],
                                },
                            ],
                        },
                        {
                            'name' : 'Elliptic integrals',
                            'sub-menu' : [
                                {
                                    'name' : 'Complete elliptic integral of the first kind',
                                    'snippet' : ['elliptic_k(z)',],
                                },
                                {
                                    'name' : 'Legendre incomplete elliptic integral of the first kind',
                                    'snippet' : ['elliptic_f(z, m)',],
                                },
                                {
                                    'name' : 'Legendre incomplete elliptic integral of the second kind',
                                    'snippet' : ['elliptic_e(z, m)',],
                                },
                                {
                                    'name' : 'Legendre incomplete elliptic integral of the third kind',
                                    'snippet' : ['elliptic_pi(n, z, m)',],
                                },
                            ],
                        },
                        {
                            'name' : 'Orthogonal Polynomials',
                            'sub-menu' : [
                                {
                                    'name' : 'Jacobi polynomial',
                                    'snippet' : ['jacobi(n, a, b, x)',],
                                },
                                {
                                    'name' : 'Normalized Jacobi polynomial',
                                    'snippet' : ['jacobi_normalized(n, a, b, x)',],
                                },
                                {
                                    'name' : 'Gegenbauer polynomial',
                                    'snippet' : ['gegenbauer(n, a, x)',],
                                },
                                {
                                    'name' : 'Chebyshev polynomial of the first kind',
                                    'snippet' : ['chebyshevt(n, x)',],
                                },
                                {
                                    'name' : 'Chebyshev polynomial of the second kind',
                                    'snippet' : ['chebyshevu(n, x)',],
                                },
                                {
                                    'name' : 'Root k of the nth Chebyshev polynomial of the first kind',
                                    'snippet' : ['chebyshevt_root(n, k)',],
                                },
                                {
                                    'name' : 'Root k of the nth Chebyshev polynomial of the second kind',
                                    'snippet' : ['chebyshevu_root(n, k)',],
                                },
                                {
                                    'name' : 'Legendre polynomial',
                                    'snippet' : ['legendre(n, x)',],
                                },
                                {
                                    'name' : 'Associated Legendre polynomial',
                                    'snippet' : ['assoc_legendre(n, m, x)',],
                                },
                                {
                                    'name' : 'Hermite polynomial',
                                    'snippet' : ['hermite(n, x)',],
                                },
                                {
                                    'name' : 'Laguerre polynomial',
                                    'snippet' : ['laguerre(n, x)',],
                                },
                                {
                                    'name' : 'Generalized (associated) Laguerre polynomial',
                                    'snippet' : ['assoc_laguerre(n, a, x)',],
                                },
                            ],
                        },
                        {
                            'name' : 'Spherical Harmonics',
                            'sub-menu' : [
                                {
                                    'name' : 'Spherical harmonics',
                                    'snippet' : [
                                        'vartheta, varphi = symbols("vartheta, varphi", real=True)',
                                        'Ynm(n, m, vartheta, varphi)',
                                    ],
                                },
                                {
                                    'name' : 'Conjugate spherical harmonics',
                                    'snippet' : [
                                        'vartheta, varphi = symbols("vartheta, varphi", real=True)',
                                        'Ynm_c(n, m, vartheta, varphi)',
                                    ],
                                },
                                {
                                    'name' : 'Real spherical harmonics',
                                    'snippet' : [
                                        'vartheta, varphi = symbols("vartheta, varphi", real=True)',
                                        'Znm(n, m, vartheta, varphi)',
                                    ],
                                },
                            ],
                        },
                        {
                            'name' : 'Tensor Functions',
                            'sub-menu' : [
                                {
                                    'name' : 'Levi-Civita symbol',
                                    'snippet' : ['LeviCivita(0,1,2,3)',],
                                },
                                {
                                    'name' : 'Kronecker delta',
                                    'snippet' : ['KroneckerDelta(1,2)',],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
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
                        {
                            'name' : 'List of assumptions',
                            'sub-menu' : [
                                {
                                    'name' : 'Bounded',
                                    'snippet' : ['Q.bounded(x)',],
                                },
                                {
                                    'name' : 'Commutative',
                                    'snippet' : ['Q.commutative(x)',],
                                },
                                {
                                    'name' : 'Complex',
                                    'snippet' : ['Q.complex(x)',],
                                },
                                {
                                    'name' : 'Imaginary',
                                    'snippet' : ['Q.imaginary(x)',],
                                },
                                {
                                    'name' : 'Real',
                                    'snippet' : ['Q.real(x)',],
                                },
                                {
                                    'name' : 'Extended real',
                                    'snippet' : ['Q.extended_real(x)',],
                                },
                                {
                                    'name' : 'Integer',
                                    'snippet' : ['Q.integer(x)',],
                                },
                                {
                                    'name' : 'Odd',
                                    'snippet' : ['Q.odd(x)',],
                                },
                                {
                                    'name' : 'Even',
                                    'snippet' : ['Q.even(x)',],
                                },
                                {
                                    'name' : 'Prime',
                                    'snippet' : ['Q.prime(x)',],
                                },
                                {
                                    'name' : 'Composite',
                                    'snippet' : ['Q.composite(x)',],
                                },
                                {
                                    'name' : 'Zero',
                                    'snippet' : ['Q.zero(x)',],
                                },
                                {
                                    'name' : 'Nonzero',
                                    'snippet' : ['Q.nonzero(x)',],
                                },
                                {
                                    'name' : 'Rational',
                                    'snippet' : ['Q.rational(x)',],
                                },
                                {
                                    'name' : 'Algebraic',
                                    'snippet' : ['Q.algebraic(x)',],
                                },
                                {
                                    'name' : 'Transcendental',
                                    'snippet' : ['Q.transcendental(x)',],
                                },
                                {
                                    'name' : 'Irrational',
                                    'snippet' : ['Q.irrational(x)',],
                                },
                                {
                                    'name' : 'Finite',
                                    'snippet' : ['Q.finite(x)',],
                                },
                                {
                                    'name' : 'Infinite',
                                    'snippet' : ['Q.infinite(x)',],
                                },
                                {
                                    'name' : 'Infinitesimal',
                                    'snippet' : ['Q.infinitesimal(x)',],
                                },
                                {
                                    'name' : 'Negative',
                                    'snippet' : ['Q.negative(x)',],
                                },
                                {
                                    'name' : 'Nonnegative',
                                    'snippet' : ['Q.nonnegative(x)',],
                                },
                                {
                                    'name' : 'Positive',
                                    'snippet' : ['Q.positive(x)',],
                                },
                                {
                                    'name' : 'Nonpositive',
                                    'snippet' : ['Q.nonpositive(x)',],
                                },
                                {
                                    'name' : 'Hermitian',
                                    'snippet' : ['Q.hermitian(x)',],
                                },
                                {
                                    'name' : 'Antihermitian',
                                    'snippet' : ['Q.antihermitian(x)',],
                                },
                            ],
                        },
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
                    'name' : 'Substitutions',
                    'sub-menu' : [
                        {
                            'name' : 'Substitute successively',
                            'snippet' : [
                                'expr = 1 + x*y',
                                'substitutions = [(x, pi), (y, 2)]',
                                'expr = expr.subs(substitutions)',
                            ],
                        },
                        {
                            'name' : 'Substitute simultaneously',
                            'snippet' : [
                                'expr = (x+y)/y',
                                'substitutions = [(x+y, y), (y, x+y)]',
                                'expr = expr.subs(substitutions, simultaneous=True)',
                            ],
                        },
                        '---',
                        {
                            'name' : 'Replace with wild cards',
                            'snippet' : [
                                'a,b = Wild("a", exclude=[x,y]), Wild("b", exclude=[x])',
                                'expr = 2*x + y',
                                'wild = a*x + b',
                                'replacement = b - a',
                                'expr = expr.replace(wild, replacement, exact=True)',
                            ],
                        },
                        {
                            'name' : 'Replace exact expression',
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
});
