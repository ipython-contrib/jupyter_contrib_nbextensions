define([
    "require",
    "./python/numpy",
    "./python/scipy",
    "./python/matplotlib",
    "./python/sympy",
    "./python/pandas",
    "./python/astropy",
    "./python/h5py",
    "./python/numba",
    "./python/python",
], function (require, numpy, scipy, matplotlib, sympy, pandas, astropy, h5py, numba, python) {
    return {
        numpy:numpy,
        scipy:scipy,
        matplotlib:matplotlib,
        sympy:sympy,
        pandas:pandas,
        astropy:astropy,
        h5py:h5py,
        numba:numba,
        python:python,
    };
});
