define({
    'name' : 'Special functions',
    'sub-menu' : [
        {
            'name' : 'Setup',
            'snippet' : ['from scipy import special',],
        },
        '---',

        {
            'name' : 'Airy functions',
            'sub-menu' : [

                {
                    'name' : 'airy: Airy functions and their derivatives',
                    'snippet' : [
                        'special.airy(z)',
                    ],
                },

                {
                    'name' : 'airye: Exponentially scaled Airy functions and their derivatives',
                    'snippet' : [
                        'special.airye(z)',
                    ],
                },

                {
                    'name' : 'ai_zeros: Compute $n$ zeros $a$ and $a\'$ of $\\mathrm{Ai}(x)$ and $\\mathrm{Ai}\'(x)$, and $\\mathrm{Ai}(a\')$ and $\\mathrm{Ai}\'(a)$',
                    'snippet' : [
                        'special.ai_zeros(n)',
                    ],
                },

                {
                    'name' : 'bi_zeros: Compute $n$ zeros $b$ and $b\'$ of $\\mathrm{Bi}(x)$ and $\\mathrm{Bi}\'(x)$, and $\\mathrm{Bi}(b\')$ and $\\mathrm{Bi}\'(b)$',
                    'snippet' : [
                        'special.bi_zeros(n)',
                    ],
                },

            ],
        },

        {
            'name' : 'Elliptic Functions',
            'sub-menu' : [

                {
                    'name' : 'ellipj: Jacobian elliptic functions',
                    'snippet' : [
                        'special.ellipj(u, m)',
                    ],
                },

                {
                    'name' : 'ellipk: Computes the complete elliptic integral of the first kind',
                    'snippet' : [
                        'special.ellipk(m)',
                    ],
                },

                {
                    'name' : 'ellipkm1: The complete elliptic integral of the first kind around m=1',
                    'snippet' : [
                        'special.ellipkm1(p)',
                    ],
                },

                {
                    'name' : 'ellipkinc: Incomplete elliptic integral of the first kind',
                    'snippet' : [
                        'special.ellipkinc(phi, m)',
                    ],
                },

                {
                    'name' : 'ellipe: Complete elliptic integral of the second kind',
                    'snippet' : [
                        'special.ellipe(m)',
                    ],
                },

                {
                    'name' : 'ellipeinc: Incomplete elliptic integral of the second kind',
                    'snippet' : [
                        'special.ellipeinc(phi,m)',
                    ],
                },

            ],
        },

        {
            'name' : 'Bessel Functions',
            'sub-menu' : [

                {
                    'name' : 'Bessel Functions',
                    'sub-menu' : [

                        {
                            'name' : 'jv: Bessel function of the first kind of real order $v$, $J_v(z)$',
                            'snippet' : [
                                'special.jv(v, z)',
                            ],
                        },

                        {
                            'name' : 'jve: Exponentially scaled Bessel function of the first kind of order $v$, $J_v(z)\\, e^{-|\\Im{z}|}$',
                            'snippet' : [
                                'special.jve(v, z)',
                            ],
                        },

                        {
                            'name' : 'yn: Bessel function of the second kind of integer order $n$, $Y_n(x)$',
                            'snippet' : [
                                'special.yn(n,x)',
                            ],
                        },

                        {
                            'name' : 'yv: Bessel function of the second kind of real order $v$, $Y_v(z)$',
                            'snippet' : [
                                'special.yv(v,z)',
                            ],
                        },

                        {
                            'name' : 'yve: Exponentially scaled Bessel function of the second kind of real order, $Y_v(z)\\, e^{-|\\Im{z}|}$',
                            'snippet' : [
                                'special.yve(v,z)',
                            ],
                        },

                        {
                            'name' : 'kn: Modified Bessel function of the second kind of integer order $n$, $K_n(x)$',
                            'snippet' : [
                                'special.kn(n, x)',
                            ],
                        },

                        {
                            'name' : 'kv: Modified Bessel function of the second kind of real order $v$, $K_v(z)$',
                            'snippet' : [
                                'special.kv(v,z)',
                            ],
                        },

                        {
                            'name' : 'kve: Exponentially scaled modified Bessel function of the second kind, $K_v(z)\\, e^{z}$',
                            'snippet' : [
                                'special.kve(v,z)',
                            ],
                        },

                        {
                            'name' : 'iv: Modified Bessel function of the first kind of real order $v$, $I_v(z)$',
                            'snippet' : [
                                'special.iv(v,z)',
                            ],
                        },

                        {
                            'name' : 'ive: Exponentially scaled modified Bessel function of the first kind of real order $v$, $I_v(z)\\, e^{-|\\Re{z}|}$',
                            'snippet' : [
                                'special.ive(v,z)',
                            ],
                        },

                        {
                            'name' : 'hankel1: Hankel function of the first kind, $H^{(1)}_v(z)$',
                            'snippet' : [
                                'special.hankel1(v, z)',
                            ],
                        },

                        {
                            'name' : 'hankel1e: Exponentially scaled Hankel function of the first kind, $H^{(1)}_v(z)\\, e^{-i\\, z}$',
                            'snippet' : [
                                'special.hankel1e(v, z)',
                            ],
                        },

                        {
                            'name' : 'hankel2: Hankel function of the second kind, $H^{(2)}_v(z)$',
                            'snippet' : [
                                'special.hankel2(v, z)',
                            ],
                        },

                        {
                            'name' : 'hankel2e: Exponentially scaled Hankel function of the second kind, $H^{(2)}_v(z)\\, e^{i\\, z}$',
                            'snippet' : [
                                'special.hankel2e(v, z)',
                            ],
                        },

                        // The following is not an universal function:

                        {
                            'name' : 'lmbda: Compute sequence of lambda functions with arbitrary order $v$ and their derivatives',
                            'snippet' : [
                                'special.lmbda(v, x)',
                            ],
                        },

                    ],
                },

                {
                    'name' : 'Zeros of Bessel Functions',
                    'sub-menu' : [

                        // These are not universal functions:

                        {
                            'name' : 'jnjnp_zeros: Compute nt (<=1200) zeros of the Bessel functions $J_n$ and $J_n\'$ and arange them in order of their magnitudes',
                            'snippet' : [
                                'special.jnjnp_zeros(nt)',
                            ],
                        },

                        {
                            'name' : 'jnyn_zeros: Compute nt zeros of the Bessel functions $J_n(x)$, $J_n\'(x)$, $Y_n(x)$, and $Y_n\'(x)$, respectively',
                            'snippet' : [
                                'special.jnyn_zeros(n, nt)',
                            ],
                        },

                        {
                            'name' : 'jn_zeros: Compute nt zeros of the Bessel function $J_n(x)$',
                            'snippet' : [
                                'special.jn_zeros(n, nt)',
                            ],
                        },

                        {
                            'name' : 'jnp_zeros: Compute nt zeros of the Bessel function $J_n\'(x)$',
                            'snippet' : [
                                'special.jnp_zeros(n, nt)',
                            ],
                        },

                        {
                            'name' : 'yn_zeros: Compute nt zeros of the Bessel function $Y_n(x)$',
                            'snippet' : [
                                'special.yn_zeros(n, nt)',
                            ],
                        },

                        {
                            'name' : 'ynp_zeros: Compute nt zeros of the Bessel function $Y_n\'(x)$',
                            'snippet' : [
                                'special.ynp_zeros(n, nt)',
                            ],
                        },

                        {
                            'name' : 'y0_zeros: Returns nt (complex or real) zeros of $Y_0(z)$, $z_0$, and the value of $Y_0\'(z_0) = -Y_1(z_0)$ at each zero',
                            'snippet' : [
                                'special.y0_zeros(nt, complex=0)',
                            ],
                        },

                        {
                            'name' : 'y1_zeros: Returns nt (complex or real) zeros of $Y_1(z)$, $z_1$, and the value of $Y_1\'(z_1) = Y_0(z_1)$ at each zero',
                            'snippet' : [
                                'special.y1_zeros(nt, complex=0)',
                            ],
                        },

                        {
                            'name' : 'y1p_zeros: Returns nt (complex or real) zeros of $Y_1\'(z)$, $z_1\'$, and the value of $Y_1(z_1\')$ at each zero',
                            'snippet' : [
                                'special.y1p_zeros(nt, complex=0)',
                            ],
                        },

                    ],
                },

                {
                    'name' : 'Faster versions of common Bessel Functions',
                    'sub-menu' : [

                        {
                            'name' : 'j0: Bessel function the first kind of order 0, $J_0(x)$',
                            'snippet' : [
                                'special.j0(x)',
                            ],
                        },

                        {
                            'name' : 'j1: Bessel function of the first kind of order 1, $J_1(x)$',
                            'snippet' : [
                                'special.j1(x)',
                            ],
                        },

                        {
                            'name' : 'y0: Bessel function of the second kind of order 0, $Y_0(x)$',
                            'snippet' : [
                                'special.y0(x)',
                            ],
                        },

                        {
                            'name' : 'y1: Bessel function of the second kind of order 1, $Y_1(x)$',
                            'snippet' : [
                                'special.y1(x)',
                            ],
                        },

                        {
                            'name' : 'i0: Modified Bessel function of order 0, $I_0(x)$',
                            'snippet' : [
                                'special.i0(x)',
                            ],
                        },

                        {
                            'name' : 'i0e: Exponentially scaled modified Bessel function of order 0, $I_0(x)\\, e^{-|x|}$',
                            'snippet' : [
                                'special.i0e(x)',
                            ],
                        },

                        {
                            'name' : 'i1: Modified Bessel function of order 1, $I_1(x)$',
                            'snippet' : [
                                'special.i1(x)',
                            ],
                        },

                        {
                            'name' : 'i1e: Exponentially scaled modified Bessel function of order 1, $I_1(x)\\, e^{-|x|}$',
                            'snippet' : [
                                'special.i1e(x)',
                            ],
                        },

                        {
                            'name' : 'k0: Modified Bessel function K of order 0, $K_0(x)$',
                            'snippet' : [
                                'special.k0(x)',
                            ],
                        },

                        {
                            'name' : 'k0e: Exponentially scaled modified Bessel function K of order 0, $K_0(x)\\, e^{x}$',
                            'snippet' : [
                                'special.k0e(x)',
                            ],
                        },

                        {
                            'name' : 'k1: Modified Bessel function of the first kind of order 1, $K_1(x)$',
                            'snippet' : [
                                'special.k1(x)',
                            ],
                        },

                        {
                            'name' : 'k1e: Exponentially scaled modified Bessel function K of order 1, $K_1(x)\\, e^{x}$',
                            'snippet' : [
                                'special.k1e(x)',
                            ],
                        },

                    ],
                },

                {
                    'name' : 'Integrals of Bessel Functions',
                    'sub-menu' : [

                        {
                            'name' : 'itj0y0: Integrals of Bessel functions of order 0: $\\int_0^x J_0(t)\\, dt$, $\\int_0^x Y_0(t)\\, dt$',
                            'snippet' : [
                                'special.itj0y0(x)',
                            ],
                        },

                        {
                            'name' : 'it2j0y0: Integrals related to Bessel functions of order 0: $\\int_0^x \\frac{1-J_0(t)}{t}\\, dt$, $\\int_x^\\infty \\frac{Y_0(t)}{t}\\, dt$',
                            'snippet' : [
                                'special.it2j0y0(x)',
                            ],
                        },

                        {
                            'name' : 'iti0k0: Integrals of modified Bessel functions of order 0: $\\int_0^x I_0(t)\\, dt$, $\\int_0^x K_0(t)\\, dt$',
                            'snippet' : [
                                'special.iti0k0(x)',
                            ],
                        },

                        {
                            'name' : 'it2i0k0: Integrals related to modified Bessel functions of order 0: $\\int_0^x \\frac{I_0(t)-1}{t}\\, dt$, $\\int_x^\\infty \\frac{K_0(t)}{t}\\, dt$',
                            'snippet' : [
                                'special.it2i0k0(x)',
                            ],
                        },

                        {
                            'name' : 'besselpoly: Weighted integral of a Bessel function, $\\int_0^1 x^\\lambda J_\\nu(2 a x) \\, dx$',
                            'snippet' : [
                                'special.besselpoly(a, lmb, nu)',
                            ],
                        },

                    ],
                },

                {
                    'name' : 'Derivatives of Bessel Functions',
                    'sub-menu' : [

                        {
                            'name' : 'jvp: Return the $n$th derivative of $J_v(z)$ with respect to $z$',
                            'snippet' : [
                                'special.jvp(v, z, n=1)',
                            ],
                        },

                        {
                            'name' : 'yvp: Return the $n$th derivative of $Y_v(z)$ with respect to $z$',
                            'snippet' : [
                                'special.yvp(v, z, n=1)',
                            ],
                        },

                        {
                            'name' : 'kvp: Return the $n$th derivative of $K_v(z)$ with respect to $z$',
                            'snippet' : [
                                'special.kvp(v, z, n=1)',
                            ],
                        },

                        {
                            'name' : 'ivp: Return the $n$th derivative of $I_v(z)$ with respect to $z$',
                            'snippet' : [
                                'special.ivp(v, z, n=1)',
                            ],
                        },

                        {
                            'name' : 'h1vp: Return the $n$th derivative of $H^{(1)}_v(z)$ with respect to $z$',
                            'snippet' : [
                                'special.h1vp(v, z, n=1)',
                            ],
                        },

                        {
                            'name' : 'h2vp: Return the $n$th derivative of $H^{(2)}_v(z)$ with respect to z',
                            'snippet' : [
                                'special.h2vp(v, z, n=1)',
                            ],
                        },

                    ],
                },

                {
                    'name' : 'Spherical Bessel Functions',
                    'sub-menu' : [

                        // These are not universal functions:

                        {
                            'name' : 'sph_jn: Compute the spherical Bessel function $j_n(z)$ and its derivative for all orders up to and including $n$',
                            'snippet' : [
                                'special.sph_jn(n, z)',
                            ],
                        },

                        {
                            'name' : 'sph_yn: Compute the spherical Bessel function $y_n(z)$ and its derivative for all orders up to and including $n$',
                            'snippet' : [
                                'special.sph_yn(n, z)',
                            ],
                        },

                        {
                            'name' : 'sph_jnyn: Compute the spherical Bessel functions, $j_n(z)$ and $y_n(z)$ and their derivatives for all orders up to and including $n$',
                            'snippet' : [
                                'special.sph_jnyn(n, z)',
                            ],
                        },

                        {
                            'name' : 'sph_in: Compute the spherical Bessel function $i_n(z)$ and its derivative for all orders up to and including $n$',
                            'snippet' : [
                                'special.sph_in(n, z)',
                            ],
                        },

                        {
                            'name' : 'sph_kn: Compute the spherical Bessel function $k_n(z)$ and its derivative for all orders up to and including $n$',
                            'snippet' : [
                                'special.sph_kn(n, z)',
                            ],
                        },

                        {
                            'name' : 'sph_inkn: Compute the spherical Bessel functions, $i_n(z)$ and $k_n(z)$ and their derivatives for all orders up to and including $n$',
                            'snippet' : [
                                'special.sph_inkn(n, z)',
                            ],
                        },

                    ],
                },

                {
                    'name' : 'Riccati-Bessel Functions',
                    'sub-menu' : [

                        // These are not universal functions:

                        {
                            'name' : 'riccati_jn: Compute the Ricatti-Bessel function of the first kind and its derivative for all orders up to and including n',
                            'snippet' : [
                                'special.riccati_jn(n, x)',
                            ],
                        },

                        {
                            'name' : 'riccati_yn: Compute the Ricatti-Bessel function of the second kind and its derivative for all orders up to and including n',
                            'snippet' : [
                                'special.riccati_yn(n, x)',
                            ],
                        },

                    ],
                },
            ],
        },

        {
            'name' : 'Struve Functions',
            'sub-menu' : [

                {
                    'name' : 'struve: Struve function',
                    'snippet' : [
                        'special.struve(v,x)',
                    ],
                },

                {
                    'name' : 'modstruve: Modified Struve function',
                    'snippet' : [
                        'special.modstruve(v, x)',
                    ],
                },

                {
                    'name' : 'itstruve0: Integral of the Struve function of order 0',
                    'snippet' : [
                        'special.itstruve0(x)',
                    ],
                },

                {
                    'name' : 'it2struve0: Integral related to Struve function of order 0',
                    'snippet' : [
                        'special.it2struve0(x)',
                    ],
                },

                {
                    'name' : 'itmodstruve0: Integral of the modified Struve function of order 0',
                    'snippet' : [
                        'special.itmodstruve0(x)',
                    ],
                },

            ],
        },

        {
            'name' : 'Statistical Functions (see also scipy.stats)',
            'sub-menu' : [

// See also
// scipy.stats: Friendly versions of these functions.

                {
                    'name' : 'bdtr: Binomial distribution cumulative distribution function',
                    'snippet' : [
                        'special.bdtr(k, n, p)',
                    ],
                },

                {
                    'name' : 'bdtrc: Binomial distribution survival function',
                    'snippet' : [
                        'special.bdtrc(k, n, p)',
                    ],
                },

                {
                    'name' : 'bdtri: Inverse function to bdtr vs',
                    'snippet' : [
                        'special.bdtri(k, n, y)',
                    ],
                },

                {
                    'name' : 'btdtr: Cumulative beta distribution',
                    'snippet' : [
                        'special.btdtr(a,b,x)',
                    ],
                },

                {
                    'name' : 'btdtri: p-th quantile of the beta distribution',
                    'snippet' : [
                        'special.btdtri(a,b,p)',
                    ],
                },

                {
                    'name' : 'fdtr: F cumulative distribution function',
                    'snippet' : [
                        'special.fdtr(dfn, dfd, x)',
                    ],
                },

                {
                    'name' : 'fdtrc: F survival function',
                    'snippet' : [
                        'special.fdtrc(dfn, dfd, x)',
                    ],
                },

                {
                    'name' : 'fdtri: Inverse to fdtr vs x',
                    'snippet' : [
                        'special.fdtri(dfn, dfd, p)',
                    ],
                },

                {
                    'name' : 'gdtr: Gamma distribution cumulative density function',
                    'snippet' : [
                        'special.gdtr(a,b,x)',
                    ],
                },

                {
                    'name' : 'gdtrc: Gamma distribution survival function',
                    'snippet' : [
                        'special.gdtrc(a,b,x)',
                    ],
                },

                {
                    'name' : 'gdtria: Inverse of gdtr vs a',
                    'snippet' : [
                        'special.gdtria(p, b, x)',
                    ],
                },

                {
                    'name' : 'gdtrib: Inverse of gdtr vs b',
                    'snippet' : [
                        'special.gdtrib(a, p, x)',
                    ],
                },

                {
                    'name' : 'gdtrix: Inverse of gdtr vs x',
                    'snippet' : [
                        'special.gdtrix(a, b, p)',
                    ],
                },

                {
                    'name' : 'nbdtr: Negative binomial cumulative distribution function',
                    'snippet' : [
                        'special.nbdtr(k, n, p)',
                    ],
                },

                {
                    'name' : 'nbdtrc: Negative binomial survival function',
                    'snippet' : [
                        'special.nbdtrc(k,n,p)',
                    ],
                },

                {
                    'name' : 'nbdtri: Inverse of nbdtr vs p',
                    'snippet' : [
                        'special.nbdtri(k, n, y)',
                    ],
                },

                {
                    'name' : 'ncfdtr: Cumulative distribution function of the non-central $F$ distribution.',
                    'snippet' : [
                        'special.ncfdtr(dfn, dfd, nc, f)',
                    ],
                },

                {
                    'name' : 'ncfdtridfd: Calculate degrees of freedom (denominator) for the noncentral $F$ distribution.',
                    'snippet' : [
                        'special.ncfdtridfd(p, f, dfn, nc)',
                    ],
                },

                {
                    'name' : 'ncfdtridfn: Calculate degrees of freedom (numerator) for the noncentral $F$ distribution.',
                    'snippet' : [
                        'special.ncfdtridfn(p, f, dfd, nc)',
                    ],
                },

                {
                    'name' : 'ncfdtri: Inverse cumulative distribution function of the non-central $F$ distribution.',
                    'snippet' : [
                        'special.ncfdtri(p, dfn, dfd, nc)',
                    ],
                },

                {
                    'name' : 'ncfdtrinc: Calculate non-centrality parameter for non-central $F$ distribution.',
                    'snippet' : [
                        'special.ncfdtrinc(p, f, dfn, dfd)',
                    ],
                },

                {
                    'name' : 'nctdtr: Cumulative distribution function of the non-central $t$ distribution.',
                    'snippet' : [
                        'special.nctdtr(df, nc, t)',
                    ],
                },

                {
                    'name' : 'nctdtridf: Calculate degrees of freedom for non-central $t$ distribution.',
                    'snippet' : [
                        'special.nctdtridf(p, nc, t)',
                    ],
                },

                {
                    'name' : 'nctdtrit: Inverse cumulative distribution function of the non-central $t$ distribution.',
                    'snippet' : [
                        'special.nctdtrit(df, nc, p)',
                    ],
                },

                {
                    'name' : 'nctdtrinc: Calculate non-centrality parameter for non-central $t$ distribution.',
                    'snippet' : [
                        'special.nctdtrinc(df, p, t)',
                    ],
                },

                {
                    'name' : 'nrdtrimn: Calculate mean of normal distribution given other params.',
                    'snippet' : [
                        'special.nrdtrimn(p, x, std)',
                    ],
                },

                {
                    'name' : 'nrdtrisd: Calculate standard deviation of normal distribution given other params.',
                    'snippet' : [
                        'special.nrdtrisd(p, x, mn)',
                    ],
                },

                {
                    'name' : 'pdtr: Poisson cumulative distribution function',
                    'snippet' : [
                        'special.pdtr(k, m)',
                    ],
                },

                {
                    'name' : 'pdtrc: Poisson survival function',
                    'snippet' : [
                        'special.pdtrc(k, m)',
                    ],
                },

                {
                    'name' : 'pdtri: Inverse to pdtr vs m',
                    'snippet' : [
                        'special.pdtri(k,y)',
                    ],
                },

                {
                    'name' : 'stdtr: Student $t$ distribution cumulative density function',
                    'snippet' : [
                        'special.stdtr(df,t)',
                    ],
                },

                {
                    'name' : 'stdtridf: Inverse of stdtr vs df',
                    'snippet' : [
                        'special.stdtridf(p,t)',
                    ],
                },

                {
                    'name' : 'stdtrit: Inverse of stdtr vs t',
                    'snippet' : [
                        'special.stdtrit(df,p)',
                    ],
                },

                {
                    'name' : 'chdtr: Chi square cumulative distribution function',
                    'snippet' : [
                        'special.chdtr(v, x)',
                    ],
                },

                {
                    'name' : 'chdtrc: Chi square survival function',
                    'snippet' : [
                        'special.chdtrc(v,x)',
                    ],
                },

                {
                    'name' : 'chdtri: Inverse to chdtrc',
                    'snippet' : [
                        'special.chdtri(v,p)',
                    ],
                },

                {
                    'name' : 'ndtr: Gaussian cumulative distribution function',
                    'snippet' : [
                        'special.ndtr(x)',
                    ],
                },

                {
                    'name' : 'ndtri: Inverse of ndtr vs x',
                    'snippet' : [
                        'special.ndtri(y)',
                    ],
                },

                {
                    'name' : 'smirnov: Kolmogorov-Smirnov complementary cumulative distribution function',
                    'snippet' : [
                        'special.smirnov(n,e)',
                    ],
                },

                {
                    'name' : 'smirnovi: Inverse to smirnov',
                    'snippet' : [
                        'special.smirnovi(n,y)',
                    ],
                },

                {
                    'name' : 'kolmogorov: Complementary cumulative distribution function of Kolmogorov distribution',
                    'snippet' : [
                        'special.kolmogorov(y)',
                    ],
                },

                {
                    'name' : 'kolmogi: Inverse function to kolmogorov',
                    'snippet' : [
                        'special.kolmogi(p)',
                    ],
                },

                {
                    'name' : 'tklmbda: Tukey-Lambda cumulative distribution function',
                    'snippet' : [
                        'special.tklmbda(x, lmbda)',
                    ],
                },

                {
                    'name' : 'logit: Logit ufunc for ndarrays',
                    'snippet' : [
                        'special.logit(x)',
                    ],
                },

                {
                    'name' : 'expit: Expit ufunc for ndarrays',
                    'snippet' : [
                        'special.expit(x)',
                    ],
                },

                {
                    'name' : 'boxcox: Compute the Box-Cox transformation',
                    'snippet' : [
                        'special.boxcox(x, lmbda)',
                    ],
                },

                {
                    'name' : 'boxcox1p: Compute the Box-Cox transformation of 1 + x',
                    'snippet' : [
                        'special.boxcox1p(x, lmbda)',
                    ],
                },

            ],
        },

        {
            'name' : 'Information Theory Functions',
            'sub-menu' : [
                {
                    'name' : 'entr: Elementwise function for computing entropy.',
                    'snippet' : [
                        'special.entr(x)',
                    ],
                },

                {
                    'name' : 'rel_entr: Elementwise function for computing relative entropy.',
                    'snippet' : [
                        'special.rel_entr(x, y)',
                    ],
                },

                {
                    'name' : 'kl_div: Elementwise function for computing Kullback-Leibler divergence.',
                    'snippet' : [
                        'special.kl_div(x, y)',
                    ],
                },

                {
                    'name' : 'huber: Huber loss function.',
                    'snippet' : [
                        'special.huber(delta, r)',
                    ],
                },

                {
                    'name' : 'pseudo_huber: Pseudo-Huber loss function.',
                    'snippet' : [
                        'special.pseudo_huber(delta, r)',
                    ],
                },
            ],
        },

        {
            'name' : 'Gamma and Related Functions',
            'sub-menu' : [

                {
                    'name' : 'gamma: Gamma function',
                    'snippet' : [
                        'special.gamma(z)',
                    ],
                },

                {
                    'name' : 'gammaln: Logarithm of absolute value of gamma function',
                    'snippet' : [
                        'special.gammaln(z)',
                    ],
                },

                {
                    'name' : 'gammasgn: Sign of the gamma function',
                    'snippet' : [
                        'special.gammasgn(x)',
                    ],
                },

                {
                    'name' : 'gammainc: Incomplete gamma function',
                    'snippet' : [
                        'special.gammainc(a, x)',
                    ],
                },

                {
                    'name' : 'gammaincinv: Inverse to gammainc',
                    'snippet' : [
                        'special.gammaincinv(a, y)',
                    ],
                },

                {
                    'name' : 'gammaincc: Complemented incomplete gamma integral',
                    'snippet' : [
                        'special.gammaincc(a,x)',
                    ],
                },

                {
                    'name' : 'gammainccinv: Inverse to gammaincc',
                    'snippet' : [
                        'special.gammainccinv(a,y)',
                    ],
                },

                {
                    'name' : 'beta: Beta function',
                    'snippet' : [
                        'special.beta(a, b)',
                    ],
                },

                {
                    'name' : 'betaln: Natural logarithm of absolute value of beta function',
                    'snippet' : [
                        'special.betaln(a, b)',
                    ],
                },

                {
                    'name' : 'betainc: Incomplete beta integral',
                    'snippet' : [
                        'special.betainc(a, b, x)',
                    ],
                },

                {
                    'name' : 'betaincinv: Inverse function to beta integral',
                    'snippet' : [
                        'special.betaincinv(a, b, y)',
                    ],
                },

                {
                    'name' : 'psi: Digamma function',
                    'snippet' : [
                        'special.psi(z)',
                    ],
                },

                {
                    'name' : 'rgamma: Gamma function inverted',
                    'snippet' : [
                        'special.rgamma(z)',
                    ],
                },

                {
                    'name' : 'polygamma: Polygamma function which is the $n$th derivative of the digamma (psi) function',
                    'snippet' : [
                        'special.polygamma(n, x)',
                    ],
                },

                {
                    'name' : 'multigammaln: Returns the log of multivariate gamma, also sometimes called the generalized gamma',
                    'snippet' : [
                        'special.multigammaln(a, d)',
                    ],
                },

                {
                    'name' : 'digamma: Digamma function',
                    'snippet' : [
                        'special.digamma(z)',
                    ],
                },
            ],
        },

        {
            'name' : 'Error Function and Fresnel Integrals',
            'sub-menu' : [

                {
                    'name' : 'erf: Returns the error function of complex argument',
                    'snippet' : [
                        'special.erf(z)',
                    ],
                },

                {
                    'name' : 'erfc: Complementary error function, $1 - \\mathrm{erf}(x)$',
                    'snippet' : [
                        'special.erfc(x)',
                    ],
                },

                {
                    'name' : 'erfcx: Scaled complementary error function, $\\exp(x^2)\\, \\mathrm{erfc}(x)$',
                    'snippet' : [
                        'special.erfcx(x)',
                    ],
                },

                {
                    'name' : 'erfi: Imaginary error function, $-i\\, \\mathrm{erf}(i\\, z)$',
                    'snippet' : [
                        'special.erfi(z)',
                    ],
                },

                {
                    'name' : 'erfinv: Inverse function for erf',
                    'snippet' : [
                        'special.erfinv(y)',
                    ],
                },

                {
                    'name' : 'erfcinv: Inverse function for erfc',
                    'snippet' : [
                        'special.erfcinv(y)',
                    ],
                },

                {
                    'name' : 'wofz: Faddeeva function',
                    'snippet' : [
                        'special.wofz(z)',
                    ],
                },

                {
                    'name' : 'dawsn: Dawson’s integral',
                    'snippet' : [
                        'special.dawsn(x)',
                    ],
                },

                {
                    'name' : 'fresnel: Fresnel sin and cos integrals',
                    'snippet' : [
                        'special.fresnel(z)',
                    ],
                },

                {
                    'name' : 'fresnel_zeros: Compute nt complex zeros of the sine and cosine Fresnel integrals S(z) and C(z)',
                    'snippet' : [
                        'special.fresnel_zeros(nt)',
                    ],
                },

                {
                    'name' : 'modfresnelp: Modified Fresnel positive integrals',
                    'snippet' : [
                        'special.modfresnelp(x)',
                    ],
                },

                {
                    'name' : 'modfresnelm: Modified Fresnel negative integrals',
                    'snippet' : [
                        'special.modfresnelm(x)',
                    ],
                },

// These are not universal functions:

                {
                    'name' : 'erf_zeros: Compute nt complex zeros of the error function erf(z)',
                    'snippet' : [
                        'special.erf_zeros(nt)',
                    ],
                },

                {
                    'name' : 'fresnelc_zeros: Compute nt complex zeros of the cosine Fresnel integral C(z)',
                    'snippet' : [
                        'special.fresnelc_zeros(nt)',
                    ],
                },

                {
                    'name' : 'fresnels_zeros: Compute nt complex zeros of the sine Fresnel integral S(z)',
                    'snippet' : [
                        'special.fresnels_zeros(nt)',
                    ],
                },

            ],
        },

        {
            'name' : 'Legendre Functions',
            'sub-menu' : [

                {
                    'name' : 'lpmv: Associated legendre function of integer order',
                    'snippet' : [
                        'special.lpmv(m, v, x)',
                    ],
                },

                {
                    'name' : 'sph_harm: Spherical harmonic of degree $n \\geq 0$ and order $|m| \\leq n$',
                    'snippet' : [
                        '# Note: n >= 0 and |m| <= n; azimuthal angle in [0, 2pi) and polar in [0, pi]',
                        'special.sph_harm(order_m, degree_n, azimuthal_angle, polar_angle)',
                    ],
                },

// These are not universal functions:

                {
                    'name' : 'clpmn: Associated Legendre function of the first kind, $P_{m,n}(z)$',
                    'snippet' : [
                        'special.clpmn(m, n, z[, type])',
                    ],
                },

                {
                    'name' : 'lpn: Compute sequence of Legendre functions of the first kind (polynomials), $P_n(z)$ and derivatives for all degrees from 0 to $n$ (inclusive)',
                    'snippet' : [
                        'special.lpn(n, z)',
                    ],
                },

                {
                    'name' : 'lqn: Compute sequence of Legendre functions of the second kind, $Q_n(z)$ and derivatives for all degrees from 0 to $n$ (inclusive)',
                    'snippet' : [
                        'special.lqn(n, z)',
                    ],
                },

                {
                    'name' : 'lpmn: Associated Legendre function of the first kind, $P_{m,n}(z)$',
                    'snippet' : [
                        'special.lpmn(m, n, z)',
                    ],
                },

                {
                    'name' : 'lqmn: Associated Legendre functions of the second kind, $Q_{m,n}(z)$ and its derivative, $Q_{m,n}\'(z)$ of order $m$ and degree $n$',
                    'snippet' : [
                        'special.lqmn(m, n, z)',
                    ],
                },

            ],
        },

        {
            'name' : 'Ellipsoidal Harmonics',
            'sub-menu' : [
                {
                    'name' : 'ellip_harm: Ellipsoidal harmonic functions $E^p_n(l)$',
                    'snippet' : [
                        'special.ellip_harm(h2, k2, n, p, s[, signm, signn])',
                    ],
                },

                {
                    'name' : 'ellip_harm_2: Ellipsoidal harmonic functions $F^p_n(l)$',
                    'snippet' : [
                        'special.ellip_harm_2(h2, k2, n, p, s)',
                    ],
                },

                {
                    'name' : 'ellip_normal: Ellipsoidal harmonic normalization constants $\\gamma^p_n$',
                    'snippet' : [
                        'special.ellip_normal(h2, k2, n, p)',
                    ],
                },
            ],
        },

        {
            'name' : 'Orthogonal polynomials',
            'sub-menu' : [

// The following functions evaluate values of orthogonal polynomials:
                {
                    'name' : 'assoc_laguerre: Returns the $n$th order generalized (associated) Laguerre polynomial.',
                    'snippet' : [
                        'special.assoc_laguerre(x, n)',
                    ],
                },

                {
                    'name' : 'eval_legendre: Evaluate Legendre polynomial at a point',
                    'snippet' : [
                        'special.eval_legendre(n, x)',
                    ],
                },

                {
                    'name' : 'eval_chebyt: Evaluate Chebyshev $T$ polynomial at a point',
                    'snippet' : [
                        'special.eval_chebyt(n, x)',
                    ],
                },

                {
                    'name' : 'eval_chebyu: Evaluate Chebyshev $U$ polynomial at a point',
                    'snippet' : [
                        'special.eval_chebyu(n, x)',
                    ],
                },

                {
                    'name' : 'eval_chebyc: Evaluate Chebyshev $C$ polynomial at a point',
                    'snippet' : [
                        'special.eval_chebyc(n, x)',
                    ],
                },

                {
                    'name' : 'eval_chebys: Evaluate Chebyshev $S$ polynomial at a point',
                    'snippet' : [
                        'special.eval_chebys(n, x)',
                    ],
                },

                {
                    'name' : 'eval_jacobi: Evaluate Jacobi polynomial at a point',
                    'snippet' : [
                        'special.eval_jacobi(n, alpha, beta, x)',
                    ],
                },

                {
                    'name' : 'eval_laguerre: Evaluate Laguerre polynomial at a point',
                    'snippet' : [
                        'special.eval_laguerre(n, x)',
                    ],
                },

                {
                    'name' : 'eval_genlaguerre: Evaluate generalized Laguerre polynomial at a point',
                    'snippet' : [
                        'special.eval_genlaguerre(n, alpha, x)',
                    ],
                },

                {
                    'name' : 'eval_hermite: Evaluate Hermite polynomial at a point',
                    'snippet' : [
                        'special.eval_hermite(n, x)',
                    ],
                },

                {
                    'name' : 'eval_hermitenorm: Evaluate normalized Hermite polynomial at a point',
                    'snippet' : [
                        'special.eval_hermitenorm(n, x)',
                    ],
                },

                {
                    'name' : 'eval_gegenbauer: Evaluate Gegenbauer polynomial at a point',
                    'snippet' : [
                        'special.eval_gegenbauer(n, alpha, x)',
                    ],
                },

                {
                    'name' : 'eval_sh_legendre: Evaluate shifted Legendre polynomial at a point',
                    'snippet' : [
                        'special.eval_sh_legendre(n, x)',
                    ],
                },

                {
                    'name' : 'eval_sh_chebyt: Evaluate shifted Chebyshev $T$ polynomial at a point',
                    'snippet' : [
                        'special.eval_sh_chebyt(n, x)',
                    ],
                },

                {
                    'name' : 'eval_sh_chebyu: Evaluate shifted Chebyshev $U$ polynomial at a point',
                    'snippet' : [
                        'special.eval_sh_chebyu(n, x)',
                    ],
                },

                {
                    'name' : 'eval_sh_jacobi: Evaluate shifted Jacobi polynomial at a point',
                    'snippet' : [
                        'special.eval_sh_jacobi(n, p, q, x)',
                    ],
                },

                {
                    'name' : 'legendre: Coefficients of the $n$th order Legendre polynomial, $P_n(x)$',
                    'snippet' : [
                        'special.legendre(n[, monic])',
                    ],
                },

                {
                    'name' : 'chebyt: Coefficients of the $n$th order Chebyshev polynomial of first kind, $T_n(x)$',
                    'snippet' : [
                        'special.chebyt(n[, monic])',
                    ],
                },

                {
                    'name' : 'chebyu: Coefficients of the $n$th order Chebyshev polynomial of second kind, $U_n(x)$',
                    'snippet' : [
                        'special.chebyu(n[, monic])',
                    ],
                },

                {
                    'name' : 'chebyc: Coefficients of the $n$th order Chebyshev polynomial of first kind, $C_n(x)$',
                    'snippet' : [
                        'special.chebyc(n[, monic])',
                    ],
                },

                {
                    'name' : 'chebys: Coefficients of the $n$th order Chebyshev polynomial of second kind, $S_n$(x)',
                    'snippet' : [
                        'special.chebys(n[, monic])',
                    ],
                },

                {
                    'name' : 'jacobi: Coefficients of the $n$th order Jacobi polynomial, $P^(\\alpha,\\beta)_n(x)$ orthogonal over [-1,1] with weighting function $(1-x)^\\alpha (1+x)^\\beta$ with $\\alpha,\\beta > -1$',
                    'snippet' : [
                        'special.jacobi(n, alpha, beta[, monic])',
                    ],
                },

                {
                    'name' : 'laguerre: Coefficients of the $n$th order Laguerre polynoimal, $L_n(x)$',
                    'snippet' : [
                        'special.laguerre(n[, monic])',
                    ],
                },

                {
                    'name' : 'genlaguerre: Coefficients of the $n$th order generalized (associated) Laguerre polynomial,',
                    'snippet' : [
                        'special.genlaguerre(n, alpha[, monic])',
                    ],
                },

                {
                    'name' : 'hermite: Coefficients of the $n$th order Hermite polynomial, $H_n(x)$, orthogonal over',
                    'snippet' : [
                        'special.hermite(n[, monic])',
                    ],
                },

                {
                    'name' : 'hermitenorm: Coefficients of the $n$th order normalized Hermite polynomial, $He_n(x)$, orthogonal',
                    'snippet' : [
                        'special.hermitenorm(n[, monic])',
                    ],
                },

                {
                    'name' : 'gegenbauer: Coefficients of the $n$th order Gegenbauer (ultraspherical) polynomial,',
                    'snippet' : [
                        'special.gegenbauer(n, alpha[, monic])',
                    ],
                },

                {
                    'name' : 'sh_legendre: Coefficients of the $n$th order shifted Legendre polynomial, $P^\\ast_n(x)$',
                    'snippet' : [
                        'special.sh_legendre(n[, monic])',
                    ],
                },

                {
                    'name' : 'sh_chebyt: Coefficients of $n$th order shifted Chebyshev polynomial of first kind, $T_n(x)$',
                    'snippet' : [
                        'special.sh_chebyt(n[, monic])',
                    ],
                },

                {
                    'name' : 'sh_chebyu: Coefficients of the $n$th order shifted Chebyshev polynomial of second kind, $U_n(x)$',
                    'snippet' : [
                        'special.sh_chebyu(n[, monic])',
                    ],
                },

                {
                    'name' : 'sh_jacobi: Coefficients of the $n$th order Jacobi polynomial, $G_n(p,q,x)$ orthogonal over [0,1] with weighting function $(1-x)^{p-q} x^{q-1}$ with $p>q-1$ and $q > 0$',
                    'snippet' : [
                        'special.sh_jacobi(n, p, q[, monic])',
                    ],
                },

            ],
        },

        {
            'name' : 'Hypergeometric Functions',
            'sub-menu' : [

                {
                    'name' : 'hyp2f1: Gauss hypergeometric function ${}_2F_1(a, b; c; z)$',
                    'snippet' : [
                        'special.hyp2f1(a, b, c, z)',
                    ],
                },

                {
                    'name' : 'hyp1f1: Confluent hypergeometric function ${}_1F_1(a, b; x)$',
                    'snippet' : [
                        'special.hyp1f1(a, b, x)',
                    ],
                },

                {
                    'name' : 'hyperu: Confluent hypergeometric function $U(a, b, x)$ of the second kind',
                    'snippet' : [
                        'special.hyperu(a, b, x)',
                    ],
                },

                {
                    'name' : 'hyp0f1: Confluent hypergeometric limit function ${}_0F_1$',
                    'snippet' : [
                        'special.hyp0f1(v, z)',
                    ],
                },

                {
                    'name' : 'hyp2f0: Hypergeometric function ${}_2F_0$ in $y$ and an error estimate',
                    'snippet' : [
                        'special.hyp2f0(a, b, x, type)',
                    ],
                },

                {
                    'name' : 'hyp1f2: Hypergeometric function ${}_1F_2$ and error estimate',
                    'snippet' : [
                        'special.hyp1f2(a, b, c, x)',
                    ],
                },

                {
                    'name' : 'hyp3f0: Hypergeometric function ${}_3F_0$ in $y$ and an error estimate',
                    'snippet' : [
                        'special.hyp3f0(a, b, c, x)',
                    ],
                },

            ],
        },

        {
            'name' : 'Parabolic Cylinder Functions',
            'sub-menu' : [

                {
                    'name' : 'pbdv: Parabolic cylinder function $D$',
                    'snippet' : [
                        'special.pbdv(v, x)',
                    ],
                },

                {
                    'name' : 'pbvv: Parabolic cylinder function $V$',
                    'snippet' : [
                        'special.pbvv(v,x)',
                    ],
                },

                {
                    'name' : 'pbwa: Parabolic cylinder function $W$',
                    'snippet' : [
                        'special.pbwa(a,x)',
                    ],
                },

// These are not universal functions:

                {
                    'name' : 'pbdv_seq: $D_{v_0}(x), ..., D_v(x)$ and $D_{v_0}\'(x), ..., D_v\'(x)$ with $v_0=v-\\lfloor v \\rfloor$',
                    'snippet' : [
                        'special.pbdv_seq(v, x)',
                    ],
                },

                {
                    'name' : 'pbvv_seq: $V_{v_0}(x), ..., V_v(x)$ and $V_{v_0}\'(x), ..., V_v\'(x)$ with $v_0=v-\\lfloor v \\rfloor$',
                    'snippet' : [
                        'special.pbvv_seq(v, x)',
                    ],
                },

                {
                    'name' : 'pbdn_seq: $D_0(x), ..., D_n(x)$ and $D_0\'(x), ..., D_n\'(x)$',
                    'snippet' : [
                        'special.pbdn_seq(n, z)',
                    ],
                },

            ],
        },

        {
            'name' : 'Mathieu and Related Functions',
            'sub-menu' : [

                {
                    'name' : 'mathieu_a: Characteristic value of even Mathieu functions',
                    'snippet' : [
                        'special.mathieu_a(m,q)',
                    ],
                },

                {
                    'name' : 'mathieu_b: Characteristic value of odd Mathieu functions',
                    'snippet' : [
                        'special.mathieu_b(m,q)',
                    ],
                },

// These are not universal functions:

                {
                    'name' : 'mathieu_even_coef: Compute expansion coefficients for even Mathieu functions and modified Mathieu functions',
                    'snippet' : [
                        'special.mathieu_even_coef(m, q)',
                    ],
                },

                {
                    'name' : 'mathieu_odd_coef: Compute expansion coefficients for even Mathieu functions and modified Mathieu functions',
                    'snippet' : [
                        'special.mathieu_odd_coef(m, q)',
                    ],
                },

// The following return both function and first derivative:

                {
                    'name' : 'mathieu_cem: Even Mathieu function and its derivative',
                    'snippet' : [
                        'special.mathieu_cem(m,q,x)',
                    ],
                },

                {
                    'name' : 'mathieu_sem: Odd Mathieu function and its derivative',
                    'snippet' : [
                        'special.mathieu_sem(m, q, x)',
                    ],
                },

                {
                    'name' : 'mathieu_modcem1: Even modified Mathieu function of the first kind and its derivative',
                    'snippet' : [
                        'special.mathieu_modcem1(m, q, x)',
                    ],
                },

                {
                    'name' : 'mathieu_modcem2: Even modified Mathieu function of the second kind and its derivative',
                    'snippet' : [
                        'special.mathieu_modcem2(m, q, x)',
                    ],
                },

                {
                    'name' : 'mathieu_modsem1: Odd modified Mathieu function of the first kind and its derivative',
                    'snippet' : [
                        'special.mathieu_modsem1(m,q,x)',
                    ],
                },

                {
                    'name' : 'mathieu_modsem2: Odd modified Mathieu function of the second kind and its derivative',
                    'snippet' : [
                        'special.mathieu_modsem2(m, q, x)',
                    ],
                },

            ],
        },

        {
            'name' : 'Spheroidal Wave Functions',
            'sub-menu' : [

                {
                    'name' : 'pro_ang1: Prolate spheroidal angular function of the first kind and its derivative',
                    'snippet' : [
                        'special.pro_ang1(m,n,c,x)',
                    ],
                },

                {
                    'name' : 'pro_rad1: Prolate spheroidal radial function of the first kind and its derivative',
                    'snippet' : [
                        'special.pro_rad1(m,n,c,x)',
                    ],
                },

                {
                    'name' : 'pro_rad2: Prolate spheroidal radial function of the secon kind and its derivative',
                    'snippet' : [
                        'special.pro_rad2(m,n,c,x)',
                    ],
                },

                {
                    'name' : 'obl_ang1: Oblate spheroidal angular function of the first kind and its derivative',
                    'snippet' : [
                        'special.obl_ang1(m, n, c, x)',
                    ],
                },

                {
                    'name' : 'obl_rad1: Oblate spheroidal radial function of the first kind and its derivative',
                    'snippet' : [
                        'special.obl_rad1(m,n,c,x)',
                    ],
                },

                {
                    'name' : 'obl_rad2: Oblate spheroidal radial function of the second kind and its derivative',
                    'snippet' : [
                        'special.obl_rad2(m,n,c,x)',
                    ],
                },

                {
                    'name' : 'pro_cv: Characteristic value of prolate spheroidal function',
                    'snippet' : [
                        'special.pro_cv(m,n,c)',
                    ],
                },

                {
                    'name' : 'obl_cv: Characteristic value of oblate spheroidal function',
                    'snippet' : [
                        'special.obl_cv(m, n, c)',
                    ],
                },

                {
                    'name' : 'pro_cv_seq: Compute a sequence of characteristic values for the prolate spheroidal wave functions for mode m and n’=m..n and spheroidal parameter c',
                    'snippet' : [
                        'special.pro_cv_seq(m, n, c)',
                    ],
                },

                {
                    'name' : 'obl_cv_seq: Compute a sequence of characteristic values for the oblate spheroidal wave functions for mode m and n’=m..n and spheroidal parameter c',
                    'snippet' : [
                        'special.obl_cv_seq(m, n, c)',
                    ],
                },

// The following functions require pre-computed characteristic value:

                {
                    'name' : 'pro_ang1_cv: Prolate spheroidal angular function pro_ang1 for precomputed characteristic value',
                    'snippet' : [
                        'special.pro_ang1_cv(m,n,c,cv,x)',
                    ],
                },

                {
                    'name' : 'pro_rad1_cv: Prolate spheroidal radial function pro_rad1 for precomputed characteristic value',
                    'snippet' : [
                        'special.pro_rad1_cv(m,n,c,cv,x)',
                    ],
                },

                {
                    'name' : 'pro_rad2_cv: Prolate spheroidal radial function pro_rad2 for precomputed characteristic value',
                    'snippet' : [
                        'special.pro_rad2_cv(m,n,c,cv,x)',
                    ],
                },

                {
                    'name' : 'obl_ang1_cv: Oblate spheroidal angular function obl_ang1 for precomputed characteristic value',
                    'snippet' : [
                        'special.obl_ang1_cv(m, n, c, cv, x)',
                    ],
                },

                {
                    'name' : 'obl_rad1_cv: Oblate spheroidal radial function obl_rad1 for precomputed characteristic value',
                    'snippet' : [
                        'special.obl_rad1_cv(m,n,c,cv,x)',
                    ],
                },

                {
                    'name' : 'obl_rad2_cv: Oblate spheroidal radial function obl_rad2 for precomputed characteristic value',
                    'snippet' : [
                        'special.obl_rad2_cv(m,n,c,cv,x)',
                    ],
                },

            ],
        },

        {
            'name' : 'Kelvin Functions',
            'sub-menu' : [

                {
                    'name' : 'kelvin: Kelvin functions as complex numbers',
                    'snippet' : [
                        'special.kelvin(x)',
                    ],
                },

                {
                    'name' : 'kelvin_zeros: Compute nt zeros of all the Kelvin functions returned in a length 8 tuple of arrays of length nt',
                    'snippet' : [
                        'special.kelvin_zeros(nt)',
                    ],
                },

                {
                    'name' : 'ber: Kelvin function ber',
                    'snippet' : [
                        'special.ber(x)',
                    ],
                },

                {
                    'name' : 'bei: Kelvin function bei',
                    'snippet' : [
                        'special.bei(x)',
                    ],
                },

                {
                    'name' : 'berp: Derivative of the Kelvin function ber',
                    'snippet' : [
                        'special.berp(x)',
                    ],
                },

                {
                    'name' : 'beip: Derivative of the Kelvin function bei',
                    'snippet' : [
                        'special.beip(x)',
                    ],
                },

                {
                    'name' : 'ker: Kelvin function ker',
                    'snippet' : [
                        'special.ker(x)',
                    ],
                },

                {
                    'name' : 'kei: Kelvin function ker',
                    'snippet' : [
                        'special.kei(x)',
                    ],
                },

                {
                    'name' : 'kerp: Derivative of the Kelvin function ker',
                    'snippet' : [
                        'special.kerp(x)',
                    ],
                },

                {
                    'name' : 'keip: Derivative of the Kelvin function kei',
                    'snippet' : [
                        'special.keip(x)',
                    ],
                },

// These are not universal functions:

                {
                    'name' : 'ber_zeros: Compute nt zeros of the Kelvin function ber x',
                    'snippet' : [
                        'special.ber_zeros(nt)',
                    ],
                },

                {
                    'name' : 'bei_zeros: Compute nt zeros of the Kelvin function bei x',
                    'snippet' : [
                        'special.bei_zeros(nt)',
                    ],
                },

                {
                    'name' : 'berp_zeros: Compute nt zeros of the Kelvin function ber’ x',
                    'snippet' : [
                        'special.berp_zeros(nt)',
                    ],
                },

                {
                    'name' : 'beip_zeros: Compute nt zeros of the Kelvin function bei’ x',
                    'snippet' : [
                        'special.beip_zeros(nt)',
                    ],
                },

                {
                    'name' : 'ker_zeros: Compute nt zeros of the Kelvin function ker x',
                    'snippet' : [
                        'special.ker_zeros(nt)',
                    ],
                },

                {
                    'name' : 'kei_zeros: Compute nt zeros of the Kelvin function kei x',
                    'snippet' : [
                        'special.kei_zeros(nt)',
                    ],
                },

                {
                    'name' : 'kerp_zeros: Compute nt zeros of the Kelvin function ker’ x',
                    'snippet' : [
                        'special.kerp_zeros(nt)',
                    ],
                },

                {
                    'name' : 'keip_zeros: Compute nt zeros of the Kelvin function kei’ x',
                    'snippet' : [
                        'special.keip_zeros(nt)',
                    ],
                },

            ],
        },

        {
            'name' : 'Combinatorics',
            'sub-menu' : [
                {
                    'name' : 'comb: The number of combinations of N things taken k at a time',
                    'snippet' : [
                        'special.comb(N, k, exact=False, repetition=False)',
                    ],
                },

                {
                    'name' : 'perm: Permutations of N things taken k at a time, i.e., k-permutations of N',
                    'snippet' : [
                        'special.perm(N, k, exact=False)',
                    ],
                },
            ],
        },

        {
            'name' : 'Other Special Functions',
            'sub-menu' : [
                {
                    'name' : 'agm: Arithmetic, Geometric Mean',
                    'snippet' : [
                        'special.agm(a, b)',
                    ],
                },

                {
                    'name' : 'bernoulli: Return an array of the Bernoulli numbers $B_0$, ..., $B_n$ (inclusive)',
                    'snippet' : [
                        'special.bernoulli(n)',
                    ],
                },

                {
                    'name' : 'binom: Binomial coefficient',
                    'snippet' : [
                        'special.binom(n, k)',
                    ],
                },

                {
                    'name' : 'diric: Returns the periodic sinc function, also called the Dirichlet function',
                    'snippet' : [
                        'special.diric(x, n)',
                    ],
                },

                {
                    'name' : 'euler: Return an array of the Euler numbers $E_0$, ..., $E_n$ (inclusive)',
                    'snippet' : [
                        'special.euler(n)',
                    ],
                },

                {
                    'name' : 'expn: Exponential integral $E_n$',
                    'snippet' : [
                        'special.expn(n, x)',
                    ],
                },

                {
                    'name' : 'exp1: Exponential integral $E_1$ of complex argument $z$',
                    'snippet' : [
                        'special.exp1(z)',
                    ],
                },

                {
                    'name' : 'expi: Exponential integral $\\mathrm{Ei}$',
                    'snippet' : [
                        'special.expi(x)',
                    ],
                },

                {
                    'name' : 'factorial: The factorial function, $n! = \\Gamma(n+1)$',
                    'snippet' : [
                        'special.factorial(n, exact=False)',
                    ],
                },

                {
                    'name' : 'factorial2: Double factorial $n!!$',
                    'snippet' : [
                        'special.factorial2(n, exact=False)',
                    ],
                },

                {
                    'name' : 'factorialk: $n(!!...!)$ = multifactorial of order $k$',
                    'snippet' : [
                        'special.factorialk(n, k, exact=False)',
                    ],
                },

                {
                    'name' : 'shichi: Hyperbolic sine and cosine integrals',
                    'snippet' : [
                        'special.shichi(x)',
                    ],
                },

                {
                    'name' : 'sici: Sine and cosine integrals',
                    'snippet' : [
                        'special.sici(x)',
                    ],
                },

                {
                    'name' : 'spence: Dilogarithm integral',
                    'snippet' : [
                        'special.spence(x)',
                    ],
                },

                {
                    'name' : 'lambertw: Lambert $W$ function [R497]',
                    'snippet' : [
                        'special.lambertw(z[, k, tol])',
                    ],
                },

                {
                    'name' : 'zeta: Hurwitz $\\zeta$ function',
                    'snippet' : [
                        'special.zeta(x, q)',
                    ],
                },

                {
                    'name' : 'zetac: Riemann $\\zeta$ function minus 1',
                    'snippet' : [
                        'special.zetac(x)',
                    ],
                },

            ],
        },

        {
            'name' : 'Convenience Functions',
            'sub-menu' : [

                {
                    'name' : 'cbrt: $\\sqrt[3]{x}$',
                    'snippet' : [
                        'special.cbrt(x)',
                    ],
                },

                {
                    'name' : 'exp10: $10^x$',
                    'snippet' : [
                        'special.exp10(x)',
                    ],
                },

                {
                    'name' : 'exp2: $2^x$',
                    'snippet' : [
                        'special.exp2(x)',
                    ],
                },

                {
                    'name' : 'radian: Convert from degrees to radians',
                    'snippet' : [
                        'special.radian(d, m, s)',
                    ],
                },

                {
                    'name' : 'cosdg: Cosine of the angle given in degrees',
                    'snippet' : [
                        'special.cosdg(x)',
                    ],
                },

                {
                    'name' : 'sindg: Sine of angle given in degrees',
                    'snippet' : [
                        'special.sindg(x)',
                    ],
                },

                {
                    'name' : 'tandg: Tangent of angle given in degrees',
                    'snippet' : [
                        'special.tandg(x)',
                    ],
                },

                {
                    'name' : 'cotdg: Cotangent of the angle given in degrees',
                    'snippet' : [
                        'special.cotdg(x)',
                    ],
                },

                {
                    'name' : 'log1p: Calculates $\\log(1+x)$ for use when $x$ is near zero',
                    'snippet' : [
                        'special.log1p(x)',
                    ],
                },

                {
                    'name' : 'expm1: $\\exp(x) - 1$ for use when $x$ is near zero',
                    'snippet' : [
                        'special.expm1(x)',
                    ],
                },

                {
                    'name' : 'cosm1: $\\cos(x) - 1$ for use when $x$ is near zero',
                    'snippet' : [
                        'special.cosm1(x)',
                    ],
                },

                {
                    'name' : 'round: Round to nearest integer',
                    'snippet' : [
                        'special.round(x)',
                    ],
                },

                {
                    'name' : 'xlogy: Compute $x\\, \\log(y)$ so that the result is 0 if $x$ = 0',
                    'snippet' : [
                        'special.xlogy(x, y)',
                    ],
                },

                {
                    'name' : 'xlog1py: Compute $x\\, \\log(1+y)$ so that the result is 0 if $x$ = 0',
                    'snippet' : [
                        'special.xlog1py(x, y)',
                    ],
                },
            ],
        },

    ],
});
