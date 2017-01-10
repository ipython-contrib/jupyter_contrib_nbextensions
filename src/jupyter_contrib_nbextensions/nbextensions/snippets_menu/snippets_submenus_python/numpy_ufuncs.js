define({
    // See <http://docs.scipy.org/doc/numpy/reference/ufuncs.html#available-ufuncs> for a full list
    'name' : 'Vectorized (universal) functions',
    'sub-menu' : [
        {
            'name' : 'Characterizing arrays',
            'sub-menu' : [
                {
                    'name' : 'max: Return the maximum along a given axis.',
                    'snippet' : [
                        'np.max(a, axis=0)',
                    ],
                },

                {
                    'name' : 'argmax: Return indices of the maximum values along the given axis.',
                    'snippet' : [
                        'np.argmax(a, axis=0)',
                    ],
                },

                {
                    'name' : 'min: Return the minimum along a given axis.',
                    'snippet' : [
                        'np.min(a, axis=0)',
                    ],
                },

                {
                    'name' : 'argmin: Return indices of the minimum values along the given axis of a.',
                    'snippet' : [
                        'np.argmin(a, axis=0)',
                    ],
                },

                {
                    'name' : 'ptp: Peak-to-peak (maximum - minimum) value along a given axis.',
                    'snippet' : [
                        'np.ptp(a, axis=0)',
                    ],
                },

                {
                    'name' : 'trace: Return the sum along diagonals of the array.',
                    'snippet' : [
                        'np.trace(a, axis1, axis2)',
                    ],
                },

                {
                    'name' : 'mean: Returns the average of the array elements along given axis.',
                    'snippet' : [
                        'np.mean(a, axis=0)',
                    ],
                },

                {
                    'name' : 'var: Returns the variance of the array elements, along given axis.',
                    'snippet' : [
                        'np.var(a, axis=0)',
                    ],
                },

                {
                    'name' : 'std: Returns the standard deviation of the array elements along given axis.',
                    'snippet' : [
                        'np.std(a, axis=0)',
                    ],
                },

                {
                    'name' : 'all: Returns True if all elements evaluate to True.',
                    'snippet' : [
                        'np.all(a, axis=0)',
                    ],
                },

                {
                    'name' : 'any: Returns True if any of the elements of a evaluate to True.',
                    'snippet' : [
                        'np.any(a, axis=0)',
                    ],
                },
            ],
        },

        {
            'name' : 'Sums, products, differences within array',
            'sub-menu' : [
                {
                    'name' : 'prod: Product of array elements over a given axis',
                    'snippet' : [
                        'np.prod(a, axis=0)',
                    ],
                },

                {
                    'name' : 'sum: Sum of array elements over a given axis',
                    'snippet' : [
                        'np.sum(a, axis=0)',
                    ],
                },

                {
                    'name' : 'nansum: Sum of array elements over a given axis treating NaNs as zero',
                    'snippet' : [
                        'np.nansum(a, axis=0)',
                    ],
                },

                {
                    'name' : 'cumprod: Cumulative product of elements along a given axis',
                    'snippet' : [
                        'np.cumprod(a, axis=0)',
                    ],
                },

                {
                    'name' : 'cumsum: Cumulative sum of the elements along a given axis',
                    'snippet' : [
                        'np.cumsum(a, axis=0)',
                    ],
                },

                {
                    'name' : 'diff: Calculate the n-th order discrete difference along given axis',
                    'snippet' : [
                        'np.diff(a, n, axis=0)',
                    ],
                },

                {
                    'name' : 'ediff1d: Differences between consecutive elements of an array',
                    'snippet' : [
                        'np.ediff1d(a)',
                    ],
                },

                {
                    'name' : 'gradient: Gradient of an N-dimensional array',
                    'snippet' : [
                        'np.gradient(f, *varargs, **kwargs)',
                    ],
                },

                {
                    'name' : 'trapz: Integrate along the given axis using the composite trapezoidal rule',
                    'snippet' : [
                        'np.trapz(y, x, dx, axis)',
                    ],
                },

                {
                    'name' : 'convolve: Discrete, linear convolution of two one-dimensional sequences',
                    'snippet' : [
                        'np.convolve(a, v)',
                    ],
                },

                {
                    'name' : 'interp: One-dimensional linear interpolation',
                    'snippet' : [
                        'np.interp(x, xp, fp)',
                    ],
                },
            ],
        },


        {
            'name' : 'Logarithms and exponentials',
            'sub-menu' : [
                {
                    'name' : 'logaddexp: Logarithm of the sum of exponentiations of the inputs',
                    'snippet' : [
                        'np.logaddexp(x1, x2)',
                    ],
                },

                {
                    'name' : 'logaddexp2: Logarithm of the sum of exponentiations of the inputs in base-2',
                    'snippet' : [
                        'np.logaddexp2(x1, x2)',
                    ],
                },

                {
                    'name' : 'power: First array elements raised to powers from second array, element-wise',
                    'snippet' : [
                        'np.power(x1, x2)',
                    ],
                },

                {
                    'name' : 'power: First array elements raised to powers from second array, element-wise with automatic domain',
                    'snippet' : [
                        '# Use np.emath.power when input dtypes are float, but may contain negatives',
                        'np.emath.power(x1, x2)',
                    ],
                },

                {
                    'name' : 'exp: Calculate the exponential of all elements in the input array',
                    'snippet' : [
                        'np.exp(x)',
                    ],
                },

                {
                    'name' : 'exp2: Calculate $2^p$ for all $p$ in the input array',
                    'snippet' : [
                        'np.exp2(x)',
                    ],
                },

                {
                    'name' : 'log: Natural logarithm, element-wise',
                    'snippet' : [
                        'np.log(x)',
                    ],
                },

                {
                    'name' : 'log: Natural logarithm, element-wise with automatic domain',
                    'snippet' : [
                        '# Use np.emath.log when input dtype is float, but may contain negatives',
                        'np.emath.log(x)',
                    ],
                },

                {
                    'name' : 'log2: Base-2 logarithm of $x$',
                    'snippet' : [
                        'np.log2(x)',
                    ],
                },

                {
                    'name' : 'log2: Base-2 logarithm of $x$ with automatic domain',
                    'snippet' : [
                        '# Use np.emath.log2 when input dtype is float, but may contain negatives',
                        'np.emath.log2(x)',
                    ],
                },

                {
                    'name' : 'log10: Return the base 10 logarithm of the input array, element-wise',
                    'snippet' : [
                        'np.log10(x)',
                    ],
                },

                {
                    'name' : 'log10: Return the base 10 logarithm of the input array, element-wise with automatic domain',
                    'snippet' : [
                        '# Use np.emath.log10 when input dtype is float, but may contain negatives',
                        'np.emath.log10(x)',
                    ],
                },

                {
                    'name' : 'logn: Return the base $n$ logarithm of the input array, element-wise with automatic domain',
                    'snippet' : [
                        '# np.emath.logn allows for inputs with dtype float but possibly containing negatives',
                        'np.emath.logn(n, x)',
                    ],
                },

                {
                    'name' : 'expm1: Calculate $\\exp(x) - 1$ for all elements in the array',
                    'snippet' : [
                        'np.expm1(x)',
                    ],
                },

                {
                    'name' : 'log1p: Calculate $\\log(1+x)$ for all elements in the array',
                    'snippet' : [
                        'np.log1p(x)',
                    ],
                },

                {
                    'name' : 'sqrt: Return the positive square-root of an array, element-wise',
                    'snippet' : [
                        'np.sqrt(x)',
                    ],
                },

                {
                    'name' : 'sqrt: Return the positive square-root of an array, element-wise with automatic domain',
                    'snippet' : [
                        '# Use np.emath.sqrt when argument may contain negative real numbers',
                        'np.emath.sqrt(x)',
                    ],
                },

                {
                    'name' : 'square: Return the element-wise square of the input',
                    'snippet' : [
                        'np.square(x)',
                    ],
                },

                {
                    'name' : 'reciprocal: Return the reciprocal of the argument, element-wise',
                    'snippet' : [
                        'np.reciprocal(x)',
                    ],
                },
            ],
        },

        {
            'name' : 'Trigonometric and hyperbolic functions',
            'sub-menu' : [
                {
                    'name' : 'sin: Trigonometric sine, element-wise',
                    'snippet' : [
                        'np.sin(x)',
                    ],
                },

                {
                    'name' : 'cos: Cosine element-wise',
                    'snippet' : [
                        'np.cos(x)',
                    ],
                },

                {
                    'name' : 'tan: Compute tangent element-wise',
                    'snippet' : [
                        'np.tan(x)',
                    ],
                },

                {
                    'name' : 'arcsin: Trigonometric inverse sine, element-wise',
                    'snippet' : [
                        'np.arcsin(x)',
                    ],
                },

                {
                    'name' : 'arcsin: Trigonometric inverse sine, element-wise with automatic domain',
                    'snippet' : [
                        '# Use np.emath.arcsin when input dtype is float, but may contain values outside of [-1,1]',
                        'np.emath.arcsin(x)',
                    ],
                },

                {
                    'name' : 'arccos: Trigonometric inverse cosine, element-wise',
                    'snippet' : [
                        'np.arccos(x)',
                    ],
                },

                {
                    'name' : 'arccos: Trigonometric inverse cosine, element-wise with automatic domain',
                    'snippet' : [
                        '# Use np.emath.arccos when input dtype is float, but may contain values outside of [-1,1]',
                        'np.emath.arccos(x)',
                    ],
                },

                {
                    'name' : 'arctan: Trigonometric inverse tangent, element-wise',
                    'snippet' : [
                        'np.arctan(x)',
                    ],
                },

                {
                    'name' : 'arctan2: Element-wise arc tangent of $x_1/x_2$ choosing the quadrant correctly',
                    'snippet' : [
                        'np.arctan2(x1, x2)',
                    ],
                },

                {
                    'name' : 'hypot: Given the “legs” of a right triangle, return its hypotenuse',
                    'snippet' : [
                        'np.hypot(x1, x2)',
                    ],
                },

                '---',
                
                {
                    'name' : 'sinh: Hyperbolic sine, element-wise',
                    'snippet' : [
                        'np.sinh(x)',
                    ],
                },

                {
                    'name' : 'cosh: Hyperbolic cosine, element-wise',
                    'snippet' : [
                        'np.cosh(x)',
                    ],
                },

                {
                    'name' : 'tanh: Compute hyperbolic tangent element-wise',
                    'snippet' : [
                        'np.tanh(x)',
                    ],
                },

                {
                    'name' : 'arcsinh: Inverse hyperbolic sine element-wise',
                    'snippet' : [
                        'np.arcsinh(x)',
                    ],
                },

                {
                    'name' : 'arccosh: Inverse hyperbolic cosine, element-wise',
                    'snippet' : [
                        'np.arccosh(x)',
                    ],
                },

                {
                    'name' : 'arctanh: Inverse hyperbolic tangent, element-wise',
                    'snippet' : [
                        'np.arctanh(x)',
                    ],
                },

                {
                    'name' : 'arctanh: Inverse hyperbolic tangent, element-wise with automatic domain',
                    'snippet' : [
                        '# Use np.emath.arctanh when input dtype is float, but may contain values outside of (-1,1)',
                        'np.emath.arctanh(x)',
                    ],
                },

                '---',

                {
                    'name' : 'deg2rad: Convert angles from degrees to radians',
                    'snippet' : [
                        'np.deg2rad(x)',
                    ],
                },

                {
                    'name' : 'rad2deg: Convert angles from radians to degrees',
                    'snippet' : [
                        'np.rad2deg(x)',
                    ],
                },

                {
                    'name' : 'unwrap: Unwrap radian phase by changing jumps greater than $\\pi$ to their $2\\pi$ complement',
                    'snippet' : [
                        'np.unwrap(x)',
                    ],
                },
            ],
        },

        {
            'name' : 'Complex numbers',
            'sub-menu' : [
                {
                    'name' : 'real: Real part of the elements of the array',
                    'snippet' : [
                        'np.real(a)',
                    ],
                },

                {
                    'name' : 'imag: Imaginary part of the elements of the array',
                    'snippet' : [
                        'np.imag(a)',
                    ],
                },

                {
                    'name' : 'conj: Complex conjugate, element-wise',
                    'snippet' : [
                        'np.conj(a)',
                    ],
                },
                
                {
                    'name' : 'angle: Angle of the complex argument',
                    'snippet' : [
                        'np.angle(a)',
                    ],
                },

                {
                    'name' : 'unwrap: Unwrap radian phase by changing jumps greater than $\\pi$ to their $2\\pi$ complement',
                    'snippet' : [
                        'np.unwrap(x)',
                    ],
                },
            ],
        },

        {
            'name' : 'Rounding and clipping',
            'sub-menu' : [
                {
                    'name' : 'around: Evenly round to the given number of decimals',
                    'snippet' : [
                        'np.around(a, decimals=2)',
                    ],
                },

                {
                    'name' : 'rint: Round elements of the array to the nearest integer',
                    'snippet' : [
                        'np.rint(a)',
                    ],
                },

                {
                    'name' : 'fix: Round to nearest integer towards zero',
                    'snippet' : [
                        'np.fix(a)',
                    ],
                },

                {
                    'name' : 'floor: Floor of the input, element-wise',
                    'snippet' : [
                        'np.floor(a)',
                    ],
                },

                {
                    'name' : 'ceil: Ceiling of the input, element-wise',
                    'snippet' : [
                        'np.ceil(a)',
                    ],
                },

                {
                    'name' : 'trunc: Truncated value of the input, element-wise',
                    'snippet' : [
                        'np.trunc(a)',
                    ],
                },

                {
                    'name' : 'clip: Clip (limit) the values in an array',
                    'snippet' : [
                        'np.clip(a, a_min, a_max)',
                    ],
                },

                {
                    'name' : 'nan_to_num: Replace NaNs with zero and inf with finite numbers',
                    'snippet' : [
                        'np.nan_to_num(a)',
                    ],
                },

                {
                    'name' : 'real_if_close: Truncate complex parts if within `tol` times machine epsilon of zero',
                    'snippet' : [
                        'np.real_if_close(a, tol=100)',
                    ],
                },
            ],
        },

        {
            'name' : 'Float functions',
            'sub-menu' : [
                {
                    'name' : 'isreal: Returns a bool array, where True if input element is real',
                    'snippet' : [
                        'np.isreal(x)',
                    ],
                },

                {
                    'name' : 'iscomplex: Returns a bool array, where True if input element is complex',
                    'snippet' : [
                        'np.iscomplex(x)',
                    ],
                },

                {
                    'name' : 'isfinite: Test element-wise for finiteness (not infinity and not NaN)',
                    'snippet' : [
                        'np.isfinite(x)',
                    ],
                },

                {
                    'name' : 'isinf: Test element-wise for positive or negative infinity',
                    'snippet' : [
                        'np.isinf(x)',
                    ],
                },

                {
                    'name' : 'isnan: Test element-wise for NaN and return result as a boolean array',
                    'snippet' : [
                        'np.isnan(x)',
                    ],
                },

                {
                    'name' : 'signbit: Returns element-wise True where signbit is set (less than zero)',
                    'snippet' : [
                        'np.signbit(x)',
                    ],
                },

                {
                    'name' : 'copysign: Change the sign of $x_1$ to that of $x_2$, element-wise',
                    'snippet' : [
                        'np.copysign(x1, x2)',
                    ],
                },

                {
                    'name' : 'nextafter: Return the next floating-point value after $x_1$ towards $x_2$, element-wise',
                    'snippet' : [
                        'np.nextafter(x1, x2)',
                    ],
                },

                {
                    'name' : 'modf: Return the fractional and integral parts of an array, element-wise',
                    'snippet' : [
                        'np.modf(x)',
                    ],
                },

                {
                    'name' : 'ldexp: Returns $x_1\\, 2^{x_2}$, element-wise',
                    'snippet' : [
                        'np.ldexp(x1, x2)',
                    ],
                },

                {
                    'name' : 'frexp: Decompose the elements of $x$ into mantissa and twos exponent',
                    'snippet' : [
                        'np.frexp(x)',
                    ],
                },

                {
                    'name' : 'fmod: Return the element-wise remainder of division',
                    'snippet' : [
                        'np.fmod(x1, x2)',
                    ],
                },

                {
                    'name' : 'floor: Return the floor of the input, element-wise',
                    'snippet' : [
                        'np.floor(x)',
                    ],
                },

                {
                    'name' : 'ceil: Return the ceiling of the input, element-wise',
                    'snippet' : [
                        'np.ceil(x)',
                    ],
                },

                {
                    'name' : 'trunc: Return the truncated value of the input, element-wise',
                    'snippet' : [
                        'np.trunc(x)',
                    ],
                },
            ],
        },

        {
            'name' : 'Bit-twiddling functions',
            'sub-menu' : [
                {
                    'name' : 'bitwise_and: Compute the bit-wise AND of two arrays element-wise',
                    'snippet' : [
                        'np.bitwise_and(x1, x2)',
                    ],
                },

                {
                    'name' : 'bitwise_or: Compute the bit-wise OR of two arrays element-wise',
                    'snippet' : [
                        'np.bitwise_or(x1, x2)',
                    ],
                },

                {
                    'name' : 'bitwise_xor: Compute the bit-wise XOR of two arrays element-wise',
                    'snippet' : [
                        'np.bitwise_xor(x1, x2)',
                    ],
                },

                {
                    'name' : 'invert: Compute bit-wise inversion, or bit-wise NOT, element-wise',
                    'snippet' : [
                        'np.invert(x)',
                    ],
                },

                {
                    'name' : 'left_shift: Shift the bits of an integer to the left',
                    'snippet' : [
                        'np.left_shift(x1, x2)',
                    ],
                },

                {
                    'name' : 'right_shift: Shift the bits of an integer to the right',
                    'snippet' : [
                        'np.right_shift(x1, x2)',
                    ],
                },
            ],
        },

        {
            'name' : 'Special functions (see scipy.special)',
            'sub-menu' : [
                {
                    'name' : 'i0: Modified Bessel function of the first kind, order 0',
                    'snippet' : [
                        'np.i0(x)',
                    ],
                },

                {
                    'name' : 'sinc: Return the sinc function',
                    'snippet' : [
                        'np.sinc(x)',
                    ],
                },
            ],
        },

        '---',

        {
            'name' : 'Arithmetic',
            'sub-menu' : [
                {
                    'name' : 'add: Add arguments element-wise',
                    'snippet' : [
                        'np.add(x1, x2)',
                    ],
                },

                {
                    'name' : 'subtract: Subtract arguments, element-wise',
                    'snippet' : [
                        'np.subtract(x1, x2)',
                    ],
                },

                {
                    'name' : 'multiply: Multiply arguments element-wise',
                    'snippet' : [
                        'np.multiply(x1, x2)',
                    ],
                },

                {
                    'name' : 'divide: Divide arguments element-wise',
                    'snippet' : [
                        'np.divide(x1, x2)',
                    ],
                },

                {
                    'name' : 'true_divide: Returns a true division of the inputs, element-wise',
                    'snippet' : [
                        'np.true_divide(x1, x2)',
                    ],
                },

                {
                    'name' : 'floor_divide: Return the largest integer smaller or equal to the division of the inputs',
                    'snippet' : [
                        'np.floor_divide(x1, x2)',
                    ],
                },

                {
                    'name' : 'negative: Numerical negative, element-wise',
                    'snippet' : [
                        'np.negative(x)',
                    ],
                },

                {
                    'name' : 'remainder: Return element-wise remainder of integer division',
                    'snippet' : [
                        'np.remainder(x1, x2)',
                    ],
                },

                {
                    'name' : 'mod: Return element-wise remainder of integer division',
                    'snippet' : [
                        'np.mod(x1, x2) # identical to np.remainder',
                    ],
                },

                {
                    'name' : 'fmod: Return element-wise remainder of float division',
                    'snippet' : [
                        'np.fmod(x1, x2)',
                    ],
                },

                {
                    'name' : 'modf: Return the fractional and integral parts of an array, element-wise',
                    'snippet' : [
                        'np.modf(x)',
                    ],
                },

                {
                    'name' : 'absolute: Calculate the absolute value element-wise',
                    'snippet' : [
                        'np.absolute(x)',
                    ],
                },

                {
                    'name' : 'rint: Round elements of the array to the nearest integer',
                    'snippet' : [
                        'np.rint(x)',
                    ],
                },

                {
                    'name' : 'sign: Returns an element-wise indication of the sign of a number',
                    'snippet' : [
                        'np.sign(x)',
                    ],
                },

                {
                    'name' : 'conj: Return the complex conjugate, element-wise',
                    'snippet' : [
                        'np.conj(x)',
                    ],
                },

                {
                    'name' : 'sqrt: Return the positive square-root of an array, element-wise',
                    'snippet' : [
                        'np.sqrt(x)',
                    ],
                },

                {
                    'name' : 'sqrt: Return the positive square-root of an array, element-wise with automatic domain',
                    'snippet' : [
                        '# Use np.emath.sqrt when argument may contain negative real numbers',
                        'np.emath.sqrt(x)',
                    ],
                },

                {
                    'name' : 'square: Return the element-wise square of the input',
                    'snippet' : [
                        'np.square(x)',
                    ],
                },

                {
                    'name' : 'reciprocal: Return the reciprocal of the argument, element-wise',
                    'snippet' : [
                        'np.reciprocal(x)',
                    ],
                },
            ],
        },

        {
            'name' : 'Matrix and vector products',
            'sub-menu' : [
                {
                    'name' : 'tensordot: Tensor dot product over last $n$ axes of a and first $n$ of b',
                    'snippet' : [
                        'a = np.arange(60).reshape((5,3,4))',
                        'b = np.arange(84).reshape((3,4,7))',
                        'n = 2',
                        'np.tensordot(a, b, n)',
                    ],
                },
                {
                    'name' : 'tensordot: Tensor dot product over given pairs of axes',
                    'snippet' : [
                        'a = np.arange(24).reshape((3,4,2))',
                        'axes_a = (2, 0)',
                        'b = np.arange(30).reshape((2,3,5))',
                        'axes_b = (0, 1)',
                        'np.tensordot(a, b, (axes_a, axes_b)',
                    ],
                },
                {
                    'name' : 'einsum: Evaluate Einstein summation convention on operands',
                    'snippet' : [
                        'a = np.arange(6).reshape((3,2))',
                        'b = np.arange(12).reshape((4,3))',
                        "np.einsum('ki,jk->ij', a, b)",
                    ],
                },
                {
                    'name' : 'inner: Inner product, summing over last two axes',
                    'snippet' : [
                        'a = np.arange(24).reshape((2,3,4))',
                        'b = np.arange(4)',
                        'np.inner(a, b)',
                    ],
                },
                {
                    'name' : 'outer: Compute outer product of two vectors (automatically flattened)',
                    'snippet' : [
                        'a = np.ones((5,))',
                        'b = np.linspace(-2, 2, 5)',
                        'np.outer(a, b)',
                    ],
                },
                {
                    'name' : 'kron: Kronecker product of arrays',
                    'snippet' : [
                        'np.kron(np.eye(2), np.ones((2,2)))',
                    ],
                },
                {
                    'name' : 'vdot: Dot product of two complex vectors, conjugating the first',
                    'snippet' : [
                        '',
                    ],
                },
                {
                    'name' : 'dot: Dot product of two arrays over last and second-to-last dimensions, respectively',
                    'snippet' : [
                        '',
                    ],
                },
                {
                    'name' : 'cross: Cross product of two (arrays of) vectors',
                    'snippet' : [
                        'np.cross(a, b)',
                    ],
                },
            ],
        },

        {
            'name' : 'Comparisons between two arrays',
            'sub-menu' : [
                {
                    'name' : 'greater: Return the truth value of $(x_1 > x_2)$ element-wise',
                    'snippet' : [
                        'np.greater(x1, x2)',
                    ],
                },

                {
                    'name' : 'greater_equal: Return the truth value of $(x_1 \\geq x_2)$ element-wise',
                    'snippet' : [
                        'np.greater_equal(x1, x2)',
                    ],
                },

                {
                    'name' : 'less: Return the truth value of $(x_1 < x_2)$ element-wise',
                    'snippet' : [
                        'np.less(x1, x2)',
                    ],
                },

                {
                    'name' : 'less_equal: Return the truth value of $(x_1 \\leq x_2)$ element-wise',
                    'snippet' : [
                        'np.less_equal(x1, x2)',
                    ],
                },

                {
                    'name' : 'not_equal: Return $(x_1 != x_2)$ element-wise',
                    'snippet' : [
                        'np.not_equal(x1, x2)',
                    ],
                },

                {
                    'name' : 'equal: Return $(x_1 == x_2)$ element-wise',
                    'snippet' : [
                        'np.equal(x1, x2)',
                    ],
                },

                {
                    'name' : 'logical_and: Compute the truth value of $x_1$ AND $x_2$ element-wise',
                    'snippet' : [
                        'np.logical_and(x1, x2)',
                    ],
                },

                {
                    'name' : 'logical_or: Compute the truth value of $x_1$ OR $x_2$ element-wise',
                    'snippet' : [
                        'np.logical_or(x1, x2)',
                    ],
                },

                {
                    'name' : 'logical_xor: Compute the truth value of $x_1$ XOR $x_2$, element-wise',
                    'snippet' : [
                        'np.logical_xor(x1, x2)',
                    ],
                },

                {
                    'name' : 'logical_not: Compute the truth value of NOT $x$ element-wise',
                    'snippet' : [
                        'np.logical_not(x)',
                    ],
                },

                {
                    'name' : 'maximum: Element-wise maximum of array elements',
                    'snippet' : [
                        'np.maximum(x1, x2)',
                    ],
                },

                {
                    'name' : 'minimum: Element-wise minimum of array elements',
                    'snippet' : [
                        'np.minimum(x1, x2)',
                    ],
                },

                {
                    'name' : 'fmax: Element-wise maximum of array elements',
                    'snippet' : [
                        'np.fmax(x1, x2)',
                    ],
                },

                {
                    'name' : 'fmin: Element-wise minimum of array elements',
                    'snippet' : [
                        'np.fmin(x1, x2)',
                    ],
                },
            ],
        },

    ],
});
