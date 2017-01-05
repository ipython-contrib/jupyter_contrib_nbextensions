define({
    // See <http://docs.sympy.org/dev/modules/functions/index.html#functions-contents> for a full list
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
});
