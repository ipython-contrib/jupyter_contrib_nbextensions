define([
    "require",
    "./snippets_submenus_python/numpy",
    "./snippets_submenus_python/scipy",
    "./snippets_submenus_python/matplotlib",
    "./snippets_submenus_python/sympy",
    "./snippets_submenus_python/pandas",
    "./snippets_submenus_python/astropy",
    "./snippets_submenus_python/h5py",
    "./snippets_submenus_python/numba",
    "./snippets_submenus_python/python",
], function (requirejs, numpy, scipy, matplotlib, sympy, pandas, astropy, h5py, numba, python) {
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
