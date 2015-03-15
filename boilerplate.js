/*

Add this file to $(ipython locate)/nbextensions/boilerplate.js and load it with
the following lines in your $(ipython profile locate)/static/custom/custom.js
file:

    require(["nbextensions/boilerplate"], function (boilerplate_extension) {
        console.log('Loading `boilerplate` notebook extension');
        boilerplate_extension.load_ipython_extension();
    });

Various customization options are given in the README.md file, also found at
the homepage <https://github.com/moble/ipynb_boilerplate>.

*/

define([
    "require",
    "jquery",
    "base/js/namespace" // I'm not sure what this does, but all the cool kids are doing it...
], function (require, $, IPython) {
    
    function escape_strings(lines) {
        for(var i=0; i<lines.length; ++i) {
            lines[i] = lines[i]
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\n/g, '\\n')
            ;
        }
        return lines.join('\\n');
    }

    var numpy_menu = {
        'name' : 'NumPy',
        'sub-menu-direction' : 'left',
        'sub-menu' : [
            {
                'name' : 'Import',
                'snippet' : [
                    'from __future__ import print_function, division',
                    'import numpy as np',
                ],
            },
            {
                'name' : 'New array',
                'snippet' : ['bp_new_array = np.zeros((4,3,), dtype=complex)',],
            },
            {
                'name' : 'New array like another',
                'snippet' : ['bp_new_array = np.zeros_like(bp_other_array)',],
            },
        ]
    };

    var scipy_menu = {
        'name' : 'SciPy',
        'sub-menu-direction' : 'left',
        'sub-menu' : [
            {
                'name' : 'Imports',
                'snippet'  : [
                    'from __future__ import print_function, division',
                    'import numpy as np',
                    'import scipy as sp',
                ],
            },
            
            // {
            //     'name' : 'Clustering algorithms',
            //     'sub-menu' : [
            //         {
            //             'name' : 'Setup',
            //             'snippet' : ['import scipy.cluster',],
            //         },
            //     ],
            // },

            {
                'name' : 'Physical and mathematical constants',
                'sub-menu' : [
                    {
                        'name' : 'Setup',
                        'snippet' : [
                            'import scipy.constants',
                        ],
                    },
                    '---',
                    {
                        'name' : 'Mathematical constants',
                        'sub-menu' : [
                            {
                                'name' : 'Geometric constant $\\pi$',
                                'snippet' : ['scipy.constants.pi',]
                            },
                            {
                                'name' : 'Golden ratio $\\phi$',
                                'snippet' : ['scipy.constants.golden',]
                            },
                        ],
                    },
                    {
                        'name' : 'Common physical constants',
                        'sub-menu' : [
                            {
                                'name' : 'Speed of light in vacuum $c$',
                                'snippet' : ['scipy.constants.c',],
                            },
                            {
                                'name' : 'Magnetic constant $\\mu_0$',
                                'snippet' : ['scipy.constants.mu_0',],
                            },
                            {
                                'name' : 'Electric constant (vacuum permittivity), $\\varepsilon_0$',
                                'snippet' : ['scipy.constants.epsilon_0',],
                            },
                            {
                                'name' : 'Planck\'s constant $h$',
                                'snippet' : ['scipy.constants.h',],
                            },
                            {
                                'name' : 'Planck\'s reduced constant $\\hbar$',
                                'snippet' : ['scipy.constants.hbar',],
                            },
                            {
                                'name' : 'Newton\'s constant of gravitation $G_\\mathrm{N}$',
                                'snippet' : ['scipy.constants.G',],
                            },
                            {
                                'name' : 'Standard acceleration of gravity $g$',
                                'snippet' : ['scipy.constants.g',],
                            },
                            {
                                'name' : 'Elementary charge $e$',
                                'snippet' : ['scipy.constants.e',],
                            },
                            {
                                'name' : 'Molar gas constant $R$',
                                'snippet' : ['scipy.constants.R',],
                            },
                            {
                                'name' : 'Fine-structure constant $\\alpha$',
                                'snippet' : ['scipy.constants.alpha',],
                            },
                            {
                                'name' : 'Avogadro constant $N_\\mathrm{A}$',
                                'snippet' : ['scipy.constants.N_A',],
                            },
                            {
                                'name' : 'Boltzmann constant $k_\\mathrm{B}$',
                                'snippet' : ['scipy.constants.k',],
                            },
                            {
                                'name' : 'Stefan-Boltzmann constant $\\sigma$',
                                'snippet' : ['scipy.constants.sigma',],
                            },
                            {
                                'name' : 'Wien displacement law constant $b$',
                                'snippet' : ['scipy.constants.Wien',],
                            },
                            {
                                'name' : 'Rydberg constant $R_\\infty$',
                                'snippet' : ['scipy.constants.Rydberg',],
                            },
                            {
                                'name' : 'Electron mass $m_\\mathrm{e}$',
                                'snippet' : ['scipy.constants.m_e',],
                            },
                            {
                                'name' : 'Proton mass $m_\\mathrm{p}$',
                                'snippet' : ['scipy.constants.m_p',],
                            },
                            {
                                'name' : 'Neutron mass $m_\\mathrm{n}$',
                                'snippet' : ['scipy.constants.m_n',],
                            },
                        ],
                    },
                    {
                        'name' : 'CODATA physical constants',
                        'sub-menu' : [
                            {
                                'name' : 'A',
                                'sub-menu' : [
                                    {
                                        'name' : 'alpha particle mass',
                                        'snippet' : ['scipy.constants.physical_constants["alpha particle mass"]',],
                                    },
                                    {
                                        'name' : 'alpha particle mass energy equivalent',
                                        'snippet' : ['scipy.constants.physical_constants["alpha particle mass energy equivalent"]',],
                                    },
                                    {
                                        'name' : 'alpha particle mass energy equivalent in MeV',
                                        'snippet' : ['scipy.constants.physical_constants["alpha particle mass energy equivalent in MeV"]',],
                                    },
                                    {
                                        'name' : 'alpha particle mass in u',
                                        'snippet' : ['scipy.constants.physical_constants["alpha particle mass in u"]',],
                                    },
                                    {
                                        'name' : 'alpha particle molar mass',
                                        'snippet' : ['scipy.constants.physical_constants["alpha particle molar mass"]',],
                                    },
                                    {
                                        'name' : 'alpha particle-electron mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["alpha particle-electron mass ratio"]',],
                                    },
                                    {
                                        'name' : 'alpha particle-proton mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["alpha particle-proton mass ratio"]',],
                                    },
                                    {
                                        'name' : 'Angstrom star',
                                        'snippet' : ['scipy.constants.physical_constants["Angstrom star"]',],
                                    },
                                    {
                                        'name' : 'atomic mass constant',
                                        'snippet' : ['scipy.constants.physical_constants["atomic mass constant"]',],
                                    },
                                    {
                                        'name' : 'atomic mass constant energy equivalent',
                                        'snippet' : ['scipy.constants.physical_constants["atomic mass constant energy equivalent"]',],
                                    },
                                    {
                                        'name' : 'atomic mass constant energy equivalent in MeV',
                                        'snippet' : ['scipy.constants.physical_constants["atomic mass constant energy equivalent in MeV"]',],
                                    },
                                    {
                                        'name' : 'atomic mass unit-electron volt relationship',
                                        'snippet' : ['scipy.constants.physical_constants["atomic mass unit-electron volt relationship"]',],
                                    },
                                    {
                                        'name' : 'atomic mass unit-hartree relationship',
                                        'snippet' : ['scipy.constants.physical_constants["atomic mass unit-hartree relationship"]',],
                                    },
                                    {
                                        'name' : 'atomic mass unit-hertz relationship',
                                        'snippet' : ['scipy.constants.physical_constants["atomic mass unit-hertz relationship"]',],
                                    },
                                    {
                                        'name' : 'atomic mass unit-inverse meter relationship',
                                        'snippet' : ['scipy.constants.physical_constants["atomic mass unit-inverse meter relationship"]',],
                                    },
                                    {
                                        'name' : 'atomic mass unit-joule relationship',
                                        'snippet' : ['scipy.constants.physical_constants["atomic mass unit-joule relationship"]',],
                                    },
                                    {
                                        'name' : 'atomic mass unit-kelvin relationship',
                                        'snippet' : ['scipy.constants.physical_constants["atomic mass unit-kelvin relationship"]',],
                                    },
                                    {
                                        'name' : 'atomic mass unit-kilogram relationship',
                                        'snippet' : ['scipy.constants.physical_constants["atomic mass unit-kilogram relationship"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of 1st hyperpolarizability',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of 1st hyperpolarizability"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of 2nd hyperpolarizability',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of 2nd hyperpolarizability"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of action',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of action"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of charge',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of charge"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of charge density',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of charge density"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of current',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of current"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of electric dipole mom.',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of electric dipole mom."]',],
                                    },
                                    {
                                        'name' : 'atomic unit of electric field',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of electric field"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of electric field gradient',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of electric field gradient"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of electric polarizability',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of electric polarizability"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of electric potential',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of electric potential"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of electric quadrupole mom.',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of electric quadrupole mom."]',],
                                    },
                                    {
                                        'name' : 'atomic unit of energy',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of energy"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of force',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of force"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of length',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of length"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of mag. dipole mom.',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of mag. dipole mom."]',],
                                    },
                                    {
                                        'name' : 'atomic unit of mag. flux density',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of mag. flux density"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of magnetizability',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of magnetizability"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of mass',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of mass"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of mom.um',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of mom.um"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of permittivity',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of permittivity"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of time',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of time"]',],
                                    },
                                    {
                                        'name' : 'atomic unit of velocity',
                                        'snippet' : ['scipy.constants.physical_constants["atomic unit of velocity"]',],
                                    },
                                    {
                                        'name' : 'Avogadro constant',
                                        'snippet' : ['scipy.constants.physical_constants["Avogadro constant"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'B',
                                'sub-menu' : [
                                    {
                                        'name' : 'Bohr magneton',
                                        'snippet' : ['scipy.constants.physical_constants["Bohr magneton"]',],
                                    },
                                    {
                                        'name' : 'Bohr magneton in eV/T',
                                        'snippet' : ['scipy.constants.physical_constants["Bohr magneton in eV/T"]',],
                                    },
                                    {
                                        'name' : 'Bohr magneton in Hz/T',
                                        'snippet' : ['scipy.constants.physical_constants["Bohr magneton in Hz/T"]',],
                                    },
                                    {
                                        'name' : 'Bohr magneton in inverse meters per tesla',
                                        'snippet' : ['scipy.constants.physical_constants["Bohr magneton in inverse meters per tesla"]',],
                                    },
                                    {
                                        'name' : 'Bohr magneton in K/T',
                                        'snippet' : ['scipy.constants.physical_constants["Bohr magneton in K/T"]',],
                                    },
                                    {
                                        'name' : 'Bohr radius',
                                        'snippet' : ['scipy.constants.physical_constants["Bohr radius"]',],
                                    },
                                    {
                                        'name' : 'Boltzmann constant',
                                        'snippet' : ['scipy.constants.physical_constants["Boltzmann constant"]',],
                                    },
                                    {
                                        'name' : 'Boltzmann constant in eV/K',
                                        'snippet' : ['scipy.constants.physical_constants["Boltzmann constant in eV/K"]',],
                                    },
                                    {
                                        'name' : 'Boltzmann constant in Hz/K',
                                        'snippet' : ['scipy.constants.physical_constants["Boltzmann constant in Hz/K"]',],
                                    },
                                    {
                                        'name' : 'Boltzmann constant in inverse meters per kelvin',
                                        'snippet' : ['scipy.constants.physical_constants["Boltzmann constant in inverse meters per kelvin"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'C',
                                'sub-menu' : [
                                    {
                                        'name' : 'characteristic impedance of vacuum',
                                        'snippet' : ['scipy.constants.physical_constants["characteristic impedance of vacuum"]',],
                                    },
                                    {
                                        'name' : 'classical electron radius',
                                        'snippet' : ['scipy.constants.physical_constants["classical electron radius"]',],
                                    },
                                    {
                                        'name' : 'Compton wavelength',
                                        'snippet' : ['scipy.constants.physical_constants["Compton wavelength"]',],
                                    },
                                    {
                                        'name' : 'Compton wavelength over 2 pi',
                                        'snippet' : ['scipy.constants.physical_constants["Compton wavelength over 2 pi"]',],
                                    },
                                    {
                                        'name' : 'conductance quantum',
                                        'snippet' : ['scipy.constants.physical_constants["conductance quantum"]',],
                                    },
                                    {
                                        'name' : 'conventional value of Josephson constant',
                                        'snippet' : ['scipy.constants.physical_constants["conventional value of Josephson constant"]',],
                                    },
                                    {
                                        'name' : 'conventional value of von Klitzing constant',
                                        'snippet' : ['scipy.constants.physical_constants["conventional value of von Klitzing constant"]',],
                                    },
                                    {
                                        'name' : 'Cu x unit',
                                        'snippet' : ['scipy.constants.physical_constants["Cu x unit"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'D',
                                'sub-menu' : [
                                    {
                                        'name' : 'deuteron g factor',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron g factor"]',],
                                    },
                                    {
                                        'name' : 'deuteron mag. mom.',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron mag. mom."]',],
                                    },
                                    {
                                        'name' : 'deuteron mag. mom. to Bohr magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron mag. mom. to Bohr magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'deuteron mag. mom. to nuclear magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron mag. mom. to nuclear magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'deuteron mass',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron mass"]',],
                                    },
                                    {
                                        'name' : 'deuteron mass energy equivalent',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron mass energy equivalent"]',],
                                    },
                                    {
                                        'name' : 'deuteron mass energy equivalent in MeV',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron mass energy equivalent in MeV"]',],
                                    },
                                    {
                                        'name' : 'deuteron mass in u',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron mass in u"]',],
                                    },
                                    {
                                        'name' : 'deuteron molar mass',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron molar mass"]',],
                                    },
                                    {
                                        'name' : 'deuteron rms charge radius',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron rms charge radius"]',],
                                    },
                                    {
                                        'name' : 'deuteron-electron mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron-electron mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'deuteron-electron mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron-electron mass ratio"]',],
                                    },
                                    {
                                        'name' : 'deuteron-neutron mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron-neutron mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'deuteron-proton mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron-proton mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'deuteron-proton mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["deuteron-proton mass ratio"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'E',
                                'sub-menu' : [
                                    {
                                        'name' : 'electric constant',
                                        'snippet' : ['scipy.constants.physical_constants["electric constant"]',],
                                    },
                                    {
                                        'name' : 'electron charge to mass quotient',
                                        'snippet' : ['scipy.constants.physical_constants["electron charge to mass quotient"]',],
                                    },
                                    {
                                        'name' : 'electron g factor',
                                        'snippet' : ['scipy.constants.physical_constants["electron g factor"]',],
                                    },
                                    {
                                        'name' : 'electron gyromag. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron gyromag. ratio"]',],
                                    },
                                    {
                                        'name' : 'electron gyromag. ratio over 2 pi',
                                        'snippet' : ['scipy.constants.physical_constants["electron gyromag. ratio over 2 pi"]',],
                                    },
                                    {
                                        'name' : 'electron mag. mom.',
                                        'snippet' : ['scipy.constants.physical_constants["electron mag. mom."]',],
                                    },
                                    {
                                        'name' : 'electron mag. mom. anomaly',
                                        'snippet' : ['scipy.constants.physical_constants["electron mag. mom. anomaly"]',],
                                    },
                                    {
                                        'name' : 'electron mag. mom. to Bohr magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron mag. mom. to Bohr magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'electron mag. mom. to nuclear magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron mag. mom. to nuclear magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'electron mass',
                                        'snippet' : ['scipy.constants.physical_constants["electron mass"]',],
                                    },
                                    {
                                        'name' : 'electron mass energy equivalent',
                                        'snippet' : ['scipy.constants.physical_constants["electron mass energy equivalent"]',],
                                    },
                                    {
                                        'name' : 'electron mass energy equivalent in MeV',
                                        'snippet' : ['scipy.constants.physical_constants["electron mass energy equivalent in MeV"]',],
                                    },
                                    {
                                        'name' : 'electron mass in u',
                                        'snippet' : ['scipy.constants.physical_constants["electron mass in u"]',],
                                    },
                                    {
                                        'name' : 'electron molar mass',
                                        'snippet' : ['scipy.constants.physical_constants["electron molar mass"]',],
                                    },
                                    {
                                        'name' : 'electron to alpha particle mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron to alpha particle mass ratio"]',],
                                    },
                                    {
                                        'name' : 'electron to shielded helion mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron to shielded helion mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'electron to shielded proton mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron to shielded proton mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'electron volt',
                                        'snippet' : ['scipy.constants.physical_constants["electron volt"]',],
                                    },
                                    {
                                        'name' : 'electron volt-atomic mass unit relationship',
                                        'snippet' : ['scipy.constants.physical_constants["electron volt-atomic mass unit relationship"]',],
                                    },
                                    {
                                        'name' : 'electron volt-hartree relationship',
                                        'snippet' : ['scipy.constants.physical_constants["electron volt-hartree relationship"]',],
                                    },
                                    {
                                        'name' : 'electron volt-hertz relationship',
                                        'snippet' : ['scipy.constants.physical_constants["electron volt-hertz relationship"]',],
                                    },
                                    {
                                        'name' : 'electron volt-inverse meter relationship',
                                        'snippet' : ['scipy.constants.physical_constants["electron volt-inverse meter relationship"]',],
                                    },
                                    {
                                        'name' : 'electron volt-joule relationship',
                                        'snippet' : ['scipy.constants.physical_constants["electron volt-joule relationship"]',],
                                    },
                                    {
                                        'name' : 'electron volt-kelvin relationship',
                                        'snippet' : ['scipy.constants.physical_constants["electron volt-kelvin relationship"]',],
                                    },
                                    {
                                        'name' : 'electron volt-kilogram relationship',
                                        'snippet' : ['scipy.constants.physical_constants["electron volt-kilogram relationship"]',],
                                    },
                                    {
                                        'name' : 'electron-deuteron mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron-deuteron mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'electron-deuteron mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron-deuteron mass ratio"]',],
                                    },
                                    {
                                        'name' : 'electron-helion mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron-helion mass ratio"]',],
                                    },
                                    {
                                        'name' : 'electron-muon mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron-muon mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'electron-muon mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron-muon mass ratio"]',],
                                    },
                                    {
                                        'name' : 'electron-neutron mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron-neutron mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'electron-neutron mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron-neutron mass ratio"]',],
                                    },
                                    {
                                        'name' : 'electron-proton mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron-proton mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'electron-proton mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron-proton mass ratio"]',],
                                    },
                                    {
                                        'name' : 'electron-tau mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron-tau mass ratio"]',],
                                    },
                                    {
                                        'name' : 'electron-triton mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["electron-triton mass ratio"]',],
                                    },
                                    {
                                        'name' : 'elementary charge',
                                        'snippet' : ['scipy.constants.physical_constants["elementary charge"]',],
                                    },
                                    {
                                        'name' : 'elementary charge over h',
                                        'snippet' : ['scipy.constants.physical_constants["elementary charge over h"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'F',
                                'sub-menu' : [
                                    {
                                        'name' : 'Faraday constant',
                                        'snippet' : ['scipy.constants.physical_constants["Faraday constant"]',],
                                    },
                                    {
                                        'name' : 'Faraday constant for conventional electric current',
                                        'snippet' : ['scipy.constants.physical_constants["Faraday constant for conventional electric current"]',],
                                    },
                                    {
                                        'name' : 'Fermi coupling constant',
                                        'snippet' : ['scipy.constants.physical_constants["Fermi coupling constant"]',],
                                    },
                                    {
                                        'name' : 'fine-structure constant',
                                        'snippet' : ['scipy.constants.physical_constants["fine-structure constant"]',],
                                    },
                                    {
                                        'name' : 'first radiation constant',
                                        'snippet' : ['scipy.constants.physical_constants["first radiation constant"]',],
                                    },
                                    {
                                        'name' : 'first radiation constant for spectral radiance',
                                        'snippet' : ['scipy.constants.physical_constants["first radiation constant for spectral radiance"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'H',
                                'sub-menu' : [
                                    {
                                        'name' : 'Hartree energy',
                                        'snippet' : ['scipy.constants.physical_constants["Hartree energy"]',],
                                    },
                                    {
                                        'name' : 'Hartree energy in eV',
                                        'snippet' : ['scipy.constants.physical_constants["Hartree energy in eV"]',],
                                    },
                                    {
                                        'name' : 'hartree-atomic mass unit relationship',
                                        'snippet' : ['scipy.constants.physical_constants["hartree-atomic mass unit relationship"]',],
                                    },
                                    {
                                        'name' : 'hartree-electron volt relationship',
                                        'snippet' : ['scipy.constants.physical_constants["hartree-electron volt relationship"]',],
                                    },
                                    {
                                        'name' : 'hartree-hertz relationship',
                                        'snippet' : ['scipy.constants.physical_constants["hartree-hertz relationship"]',],
                                    },
                                    {
                                        'name' : 'hartree-inverse meter relationship',
                                        'snippet' : ['scipy.constants.physical_constants["hartree-inverse meter relationship"]',],
                                    },
                                    {
                                        'name' : 'hartree-joule relationship',
                                        'snippet' : ['scipy.constants.physical_constants["hartree-joule relationship"]',],
                                    },
                                    {
                                        'name' : 'hartree-kelvin relationship',
                                        'snippet' : ['scipy.constants.physical_constants["hartree-kelvin relationship"]',],
                                    },
                                    {
                                        'name' : 'hartree-kilogram relationship',
                                        'snippet' : ['scipy.constants.physical_constants["hartree-kilogram relationship"]',],
                                    },
                                    {
                                        'name' : 'helion g factor',
                                        'snippet' : ['scipy.constants.physical_constants["helion g factor"]',],
                                    },
                                    {
                                        'name' : 'helion mag. mom.',
                                        'snippet' : ['scipy.constants.physical_constants["helion mag. mom."]',],
                                    },
                                    {
                                        'name' : 'helion mag. mom. to Bohr magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["helion mag. mom. to Bohr magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'helion mag. mom. to nuclear magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["helion mag. mom. to nuclear magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'helion mass',
                                        'snippet' : ['scipy.constants.physical_constants["helion mass"]',],
                                    },
                                    {
                                        'name' : 'helion mass energy equivalent',
                                        'snippet' : ['scipy.constants.physical_constants["helion mass energy equivalent"]',],
                                    },
                                    {
                                        'name' : 'helion mass energy equivalent in MeV',
                                        'snippet' : ['scipy.constants.physical_constants["helion mass energy equivalent in MeV"]',],
                                    },
                                    {
                                        'name' : 'helion mass in u',
                                        'snippet' : ['scipy.constants.physical_constants["helion mass in u"]',],
                                    },
                                    {
                                        'name' : 'helion molar mass',
                                        'snippet' : ['scipy.constants.physical_constants["helion molar mass"]',],
                                    },
                                    {
                                        'name' : 'helion-electron mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["helion-electron mass ratio"]',],
                                    },
                                    {
                                        'name' : 'helion-proton mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["helion-proton mass ratio"]',],
                                    },
                                    {
                                        'name' : 'hertz-atomic mass unit relationship',
                                        'snippet' : ['scipy.constants.physical_constants["hertz-atomic mass unit relationship"]',],
                                    },
                                    {
                                        'name' : 'hertz-electron volt relationship',
                                        'snippet' : ['scipy.constants.physical_constants["hertz-electron volt relationship"]',],
                                    },
                                    {
                                        'name' : 'hertz-hartree relationship',
                                        'snippet' : ['scipy.constants.physical_constants["hertz-hartree relationship"]',],
                                    },
                                    {
                                        'name' : 'hertz-inverse meter relationship',
                                        'snippet' : ['scipy.constants.physical_constants["hertz-inverse meter relationship"]',],
                                    },
                                    {
                                        'name' : 'hertz-joule relationship',
                                        'snippet' : ['scipy.constants.physical_constants["hertz-joule relationship"]',],
                                    },
                                    {
                                        'name' : 'hertz-kelvin relationship',
                                        'snippet' : ['scipy.constants.physical_constants["hertz-kelvin relationship"]',],
                                    },
                                    {
                                        'name' : 'hertz-kilogram relationship',
                                        'snippet' : ['scipy.constants.physical_constants["hertz-kilogram relationship"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'I',
                                'sub-menu' : [
                                    {
                                        'name' : 'inverse fine-structure constant',
                                        'snippet' : ['scipy.constants.physical_constants["inverse fine-structure constant"]',],
                                    },
                                    {
                                        'name' : 'inverse meter-atomic mass unit relationship',
                                        'snippet' : ['scipy.constants.physical_constants["inverse meter-atomic mass unit relationship"]',],
                                    },
                                    {
                                        'name' : 'inverse meter-electron volt relationship',
                                        'snippet' : ['scipy.constants.physical_constants["inverse meter-electron volt relationship"]',],
                                    },
                                    {
                                        'name' : 'inverse meter-hartree relationship',
                                        'snippet' : ['scipy.constants.physical_constants["inverse meter-hartree relationship"]',],
                                    },
                                    {
                                        'name' : 'inverse meter-hertz relationship',
                                        'snippet' : ['scipy.constants.physical_constants["inverse meter-hertz relationship"]',],
                                    },
                                    {
                                        'name' : 'inverse meter-joule relationship',
                                        'snippet' : ['scipy.constants.physical_constants["inverse meter-joule relationship"]',],
                                    },
                                    {
                                        'name' : 'inverse meter-kelvin relationship',
                                        'snippet' : ['scipy.constants.physical_constants["inverse meter-kelvin relationship"]',],
                                    },
                                    {
                                        'name' : 'inverse meter-kilogram relationship',
                                        'snippet' : ['scipy.constants.physical_constants["inverse meter-kilogram relationship"]',],
                                    },
                                    {
                                        'name' : 'inverse of conductance quantum',
                                        'snippet' : ['scipy.constants.physical_constants["inverse of conductance quantum"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'J',
                                'sub-menu' : [
                                    {
                                        'name' : 'Josephson constant',
                                        'snippet' : ['scipy.constants.physical_constants["Josephson constant"]',],
                                    },
                                    {
                                        'name' : 'joule-atomic mass unit relationship',
                                        'snippet' : ['scipy.constants.physical_constants["joule-atomic mass unit relationship"]',],
                                    },
                                    {
                                        'name' : 'joule-electron volt relationship',
                                        'snippet' : ['scipy.constants.physical_constants["joule-electron volt relationship"]',],
                                    },
                                    {
                                        'name' : 'joule-hartree relationship',
                                        'snippet' : ['scipy.constants.physical_constants["joule-hartree relationship"]',],
                                    },
                                    {
                                        'name' : 'joule-hertz relationship',
                                        'snippet' : ['scipy.constants.physical_constants["joule-hertz relationship"]',],
                                    },
                                    {
                                        'name' : 'joule-inverse meter relationship',
                                        'snippet' : ['scipy.constants.physical_constants["joule-inverse meter relationship"]',],
                                    },
                                    {
                                        'name' : 'joule-kelvin relationship',
                                        'snippet' : ['scipy.constants.physical_constants["joule-kelvin relationship"]',],
                                    },
                                    {
                                        'name' : 'joule-kilogram relationship',
                                        'snippet' : ['scipy.constants.physical_constants["joule-kilogram relationship"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'K',
                                'sub-menu' : [
                                    {
                                        'name' : 'kelvin-atomic mass unit relationship',
                                        'snippet' : ['scipy.constants.physical_constants["kelvin-atomic mass unit relationship"]',],
                                    },
                                    {
                                        'name' : 'kelvin-electron volt relationship',
                                        'snippet' : ['scipy.constants.physical_constants["kelvin-electron volt relationship"]',],
                                    },
                                    {
                                        'name' : 'kelvin-hartree relationship',
                                        'snippet' : ['scipy.constants.physical_constants["kelvin-hartree relationship"]',],
                                    },
                                    {
                                        'name' : 'kelvin-hertz relationship',
                                        'snippet' : ['scipy.constants.physical_constants["kelvin-hertz relationship"]',],
                                    },
                                    {
                                        'name' : 'kelvin-inverse meter relationship',
                                        'snippet' : ['scipy.constants.physical_constants["kelvin-inverse meter relationship"]',],
                                    },
                                    {
                                        'name' : 'kelvin-joule relationship',
                                        'snippet' : ['scipy.constants.physical_constants["kelvin-joule relationship"]',],
                                    },
                                    {
                                        'name' : 'kelvin-kilogram relationship',
                                        'snippet' : ['scipy.constants.physical_constants["kelvin-kilogram relationship"]',],
                                    },
                                    {
                                        'name' : 'kilogram-atomic mass unit relationship',
                                        'snippet' : ['scipy.constants.physical_constants["kilogram-atomic mass unit relationship"]',],
                                    },
                                    {
                                        'name' : 'kilogram-electron volt relationship',
                                        'snippet' : ['scipy.constants.physical_constants["kilogram-electron volt relationship"]',],
                                    },
                                    {
                                        'name' : 'kilogram-hartree relationship',
                                        'snippet' : ['scipy.constants.physical_constants["kilogram-hartree relationship"]',],
                                    },
                                    {
                                        'name' : 'kilogram-hertz relationship',
                                        'snippet' : ['scipy.constants.physical_constants["kilogram-hertz relationship"]',],
                                    },
                                    {
                                        'name' : 'kilogram-inverse meter relationship',
                                        'snippet' : ['scipy.constants.physical_constants["kilogram-inverse meter relationship"]',],
                                    },
                                    {
                                        'name' : 'kilogram-joule relationship',
                                        'snippet' : ['scipy.constants.physical_constants["kilogram-joule relationship"]',],
                                    },
                                    {
                                        'name' : 'kilogram-kelvin relationship',
                                        'snippet' : ['scipy.constants.physical_constants["kilogram-kelvin relationship"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'L',
                                'sub-menu' : [
                                    {
                                        'name' : 'lattice parameter of silicon',
                                        'snippet' : ['scipy.constants.physical_constants["lattice parameter of silicon"]',],
                                    },
                                    {
                                        'name' : 'Loschmidt constant (273.15 K, 100 kPa)',
                                        'snippet' : ['scipy.constants.physical_constants["Loschmidt constant (273.15 K, 100 kPa)"]',],
                                    },
                                    {
                                        'name' : 'Loschmidt constant (273.15 K, 101.325 kPa)',
                                        'snippet' : ['scipy.constants.physical_constants["Loschmidt constant (273.15 K, 101.325 kPa)"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'M',
                                'sub-menu' : [
                                    {
                                        'name' : 'mag. constant',
                                        'snippet' : ['scipy.constants.physical_constants["mag. constant"]',],
                                    },
                                    {
                                        'name' : 'mag. flux quantum',
                                        'snippet' : ['scipy.constants.physical_constants["mag. flux quantum"]',],
                                    },
                                    {
                                        'name' : 'Mo x unit',
                                        'snippet' : ['scipy.constants.physical_constants["Mo x unit"]',],
                                    },
                                    {
                                        'name' : 'molar gas constant',
                                        'snippet' : ['scipy.constants.physical_constants["molar gas constant"]',],
                                    },
                                    {
                                        'name' : 'molar mass constant',
                                        'snippet' : ['scipy.constants.physical_constants["molar mass constant"]',],
                                    },
                                    {
                                        'name' : 'molar mass of carbon-12',
                                        'snippet' : ['scipy.constants.physical_constants["molar mass of carbon-12"]',],
                                    },
                                    {
                                        'name' : 'molar Planck constant',
                                        'snippet' : ['scipy.constants.physical_constants["molar Planck constant"]',],
                                    },
                                    {
                                        'name' : 'molar Planck constant times c',
                                        'snippet' : ['scipy.constants.physical_constants["molar Planck constant times c"]',],
                                    },
                                    {
                                        'name' : 'molar volume of ideal gas (273.15 K, 100 kPa)',
                                        'snippet' : ['scipy.constants.physical_constants["molar volume of ideal gas (273.15 K, 100 kPa)"]',],
                                    },
                                    {
                                        'name' : 'molar volume of ideal gas (273.15 K, 101.325 kPa)',
                                        'snippet' : ['scipy.constants.physical_constants["molar volume of ideal gas (273.15 K, 101.325 kPa)"]',],
                                    },
                                    {
                                        'name' : 'molar volume of silicon',
                                        'snippet' : ['scipy.constants.physical_constants["molar volume of silicon"]',],
                                    },
                                    {
                                        'name' : 'muon Compton wavelength',
                                        'snippet' : ['scipy.constants.physical_constants["muon Compton wavelength"]',],
                                    },
                                    {
                                        'name' : 'muon Compton wavelength over 2 pi',
                                        'snippet' : ['scipy.constants.physical_constants["muon Compton wavelength over 2 pi"]',],
                                    },
                                    {
                                        'name' : 'muon g factor',
                                        'snippet' : ['scipy.constants.physical_constants["muon g factor"]',],
                                    },
                                    {
                                        'name' : 'muon mag. mom.',
                                        'snippet' : ['scipy.constants.physical_constants["muon mag. mom."]',],
                                    },
                                    {
                                        'name' : 'muon mag. mom. anomaly',
                                        'snippet' : ['scipy.constants.physical_constants["muon mag. mom. anomaly"]',],
                                    },
                                    {
                                        'name' : 'muon mag. mom. to Bohr magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["muon mag. mom. to Bohr magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'muon mag. mom. to nuclear magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["muon mag. mom. to nuclear magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'muon mass',
                                        'snippet' : ['scipy.constants.physical_constants["muon mass"]',],
                                    },
                                    {
                                        'name' : 'muon mass energy equivalent',
                                        'snippet' : ['scipy.constants.physical_constants["muon mass energy equivalent"]',],
                                    },
                                    {
                                        'name' : 'muon mass energy equivalent in MeV',
                                        'snippet' : ['scipy.constants.physical_constants["muon mass energy equivalent in MeV"]',],
                                    },
                                    {
                                        'name' : 'muon mass in u',
                                        'snippet' : ['scipy.constants.physical_constants["muon mass in u"]',],
                                    },
                                    {
                                        'name' : 'muon molar mass',
                                        'snippet' : ['scipy.constants.physical_constants["muon molar mass"]',],
                                    },
                                    {
                                        'name' : 'muon-electron mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["muon-electron mass ratio"]',],
                                    },
                                    {
                                        'name' : 'muon-neutron mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["muon-neutron mass ratio"]',],
                                    },
                                    {
                                        'name' : 'muon-proton mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["muon-proton mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'muon-proton mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["muon-proton mass ratio"]',],
                                    },
                                    {
                                        'name' : 'muon-tau mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["muon-tau mass ratio"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'N',
                                'sub-menu' : [
                                    {
                                        'name' : 'natural unit of action',
                                        'snippet' : ['scipy.constants.physical_constants["natural unit of action"]',],
                                    },
                                    {
                                        'name' : 'natural unit of action in eV s',
                                        'snippet' : ['scipy.constants.physical_constants["natural unit of action in eV s"]',],
                                    },
                                    {
                                        'name' : 'natural unit of energy',
                                        'snippet' : ['scipy.constants.physical_constants["natural unit of energy"]',],
                                    },
                                    {
                                        'name' : 'natural unit of energy in MeV',
                                        'snippet' : ['scipy.constants.physical_constants["natural unit of energy in MeV"]',],
                                    },
                                    {
                                        'name' : 'natural unit of length',
                                        'snippet' : ['scipy.constants.physical_constants["natural unit of length"]',],
                                    },
                                    {
                                        'name' : 'natural unit of mass',
                                        'snippet' : ['scipy.constants.physical_constants["natural unit of mass"]',],
                                    },
                                    {
                                        'name' : 'natural unit of mom.um',
                                        'snippet' : ['scipy.constants.physical_constants["natural unit of mom.um"]',],
                                    },
                                    {
                                        'name' : 'natural unit of mom.um in MeV/c',
                                        'snippet' : ['scipy.constants.physical_constants["natural unit of mom.um in MeV/c"]',],
                                    },
                                    {
                                        'name' : 'natural unit of time',
                                        'snippet' : ['scipy.constants.physical_constants["natural unit of time"]',],
                                    },
                                    {
                                        'name' : 'natural unit of velocity',
                                        'snippet' : ['scipy.constants.physical_constants["natural unit of velocity"]',],
                                    },
                                    {
                                        'name' : 'neutron Compton wavelength',
                                        'snippet' : ['scipy.constants.physical_constants["neutron Compton wavelength"]',],
                                    },
                                    {
                                        'name' : 'neutron Compton wavelength over 2 pi',
                                        'snippet' : ['scipy.constants.physical_constants["neutron Compton wavelength over 2 pi"]',],
                                    },
                                    {
                                        'name' : 'neutron g factor',
                                        'snippet' : ['scipy.constants.physical_constants["neutron g factor"]',],
                                    },
                                    {
                                        'name' : 'neutron gyromag. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["neutron gyromag. ratio"]',],
                                    },
                                    {
                                        'name' : 'neutron gyromag. ratio over 2 pi',
                                        'snippet' : ['scipy.constants.physical_constants["neutron gyromag. ratio over 2 pi"]',],
                                    },
                                    {
                                        'name' : 'neutron mag. mom.',
                                        'snippet' : ['scipy.constants.physical_constants["neutron mag. mom."]',],
                                    },
                                    {
                                        'name' : 'neutron mag. mom. to Bohr magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["neutron mag. mom. to Bohr magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'neutron mag. mom. to nuclear magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["neutron mag. mom. to nuclear magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'neutron mass',
                                        'snippet' : ['scipy.constants.physical_constants["neutron mass"]',],
                                    },
                                    {
                                        'name' : 'neutron mass energy equivalent',
                                        'snippet' : ['scipy.constants.physical_constants["neutron mass energy equivalent"]',],
                                    },
                                    {
                                        'name' : 'neutron mass energy equivalent in MeV',
                                        'snippet' : ['scipy.constants.physical_constants["neutron mass energy equivalent in MeV"]',],
                                    },
                                    {
                                        'name' : 'neutron mass in u',
                                        'snippet' : ['scipy.constants.physical_constants["neutron mass in u"]',],
                                    },
                                    {
                                        'name' : 'neutron molar mass',
                                        'snippet' : ['scipy.constants.physical_constants["neutron molar mass"]',],
                                    },
                                    {
                                        'name' : 'neutron to shielded proton mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["neutron to shielded proton mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'neutron-electron mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["neutron-electron mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'neutron-electron mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["neutron-electron mass ratio"]',],
                                    },
                                    {
                                        'name' : 'neutron-muon mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["neutron-muon mass ratio"]',],
                                    },
                                    {
                                        'name' : 'neutron-proton mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["neutron-proton mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'neutron-proton mass difference',
                                        'snippet' : ['scipy.constants.physical_constants["neutron-proton mass difference"]',],
                                    },
                                    {
                                        'name' : 'neutron-proton mass difference energy equivalent',
                                        'snippet' : ['scipy.constants.physical_constants["neutron-proton mass difference energy equivalent"]',],
                                    },
                                    {
                                        'name' : 'neutron-proton mass difference energy equivalent in MeV',
                                        'snippet' : ['scipy.constants.physical_constants["neutron-proton mass difference energy equivalent in MeV"]',],
                                    },
                                    {
                                        'name' : 'neutron-proton mass difference in u',
                                        'snippet' : ['scipy.constants.physical_constants["neutron-proton mass difference in u"]',],
                                    },
                                    {
                                        'name' : 'neutron-proton mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["neutron-proton mass ratio"]',],
                                    },
                                    {
                                        'name' : 'neutron-tau mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["neutron-tau mass ratio"]',],
                                    },
                                    {
                                        'name' : 'Newtonian constant of gravitation',
                                        'snippet' : ['scipy.constants.physical_constants["Newtonian constant of gravitation"]',],
                                    },
                                    {
                                        'name' : 'Newtonian constant of gravitation over h-bar c',
                                        'snippet' : ['scipy.constants.physical_constants["Newtonian constant of gravitation over h-bar c"]',],
                                    },
                                    {
                                        'name' : 'nuclear magneton',
                                        'snippet' : ['scipy.constants.physical_constants["nuclear magneton"]',],
                                    },
                                    {
                                        'name' : 'nuclear magneton in eV/T',
                                        'snippet' : ['scipy.constants.physical_constants["nuclear magneton in eV/T"]',],
                                    },
                                    {
                                        'name' : 'nuclear magneton in inverse meters per tesla',
                                        'snippet' : ['scipy.constants.physical_constants["nuclear magneton in inverse meters per tesla"]',],
                                    },
                                    {
                                        'name' : 'nuclear magneton in K/T',
                                        'snippet' : ['scipy.constants.physical_constants["nuclear magneton in K/T"]',],
                                    },
                                    {
                                        'name' : 'nuclear magneton in MHz/T',
                                        'snippet' : ['scipy.constants.physical_constants["nuclear magneton in MHz/T"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'P',
                                'sub-menu' : [
                                    {
                                        'name' : 'Planck constant',
                                        'snippet' : ['scipy.constants.physical_constants["Planck constant"]',],
                                    },
                                    {
                                        'name' : 'Planck constant in eV s',
                                        'snippet' : ['scipy.constants.physical_constants["Planck constant in eV s"]',],
                                    },
                                    {
                                        'name' : 'Planck constant over 2 pi',
                                        'snippet' : ['scipy.constants.physical_constants["Planck constant over 2 pi"]',],
                                    },
                                    {
                                        'name' : 'Planck constant over 2 pi in eV s',
                                        'snippet' : ['scipy.constants.physical_constants["Planck constant over 2 pi in eV s"]',],
                                    },
                                    {
                                        'name' : 'Planck constant over 2 pi times c in MeV fm',
                                        'snippet' : ['scipy.constants.physical_constants["Planck constant over 2 pi times c in MeV fm"]',],
                                    },
                                    {
                                        'name' : 'Planck length',
                                        'snippet' : ['scipy.constants.physical_constants["Planck length"]',],
                                    },
                                    {
                                        'name' : 'Planck mass',
                                        'snippet' : ['scipy.constants.physical_constants["Planck mass"]',],
                                    },
                                    {
                                        'name' : 'Planck mass energy equivalent in GeV',
                                        'snippet' : ['scipy.constants.physical_constants["Planck mass energy equivalent in GeV"]',],
                                    },
                                    {
                                        'name' : 'Planck temperature',
                                        'snippet' : ['scipy.constants.physical_constants["Planck temperature"]',],
                                    },
                                    {
                                        'name' : 'Planck time',
                                        'snippet' : ['scipy.constants.physical_constants["Planck time"]',],
                                    },
                                    {
                                        'name' : 'proton charge to mass quotient',
                                        'snippet' : ['scipy.constants.physical_constants["proton charge to mass quotient"]',],
                                    },
                                    {
                                        'name' : 'proton Compton wavelength',
                                        'snippet' : ['scipy.constants.physical_constants["proton Compton wavelength"]',],
                                    },
                                    {
                                        'name' : 'proton Compton wavelength over 2 pi',
                                        'snippet' : ['scipy.constants.physical_constants["proton Compton wavelength over 2 pi"]',],
                                    },
                                    {
                                        'name' : 'proton g factor',
                                        'snippet' : ['scipy.constants.physical_constants["proton g factor"]',],
                                    },
                                    {
                                        'name' : 'proton gyromag. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["proton gyromag. ratio"]',],
                                    },
                                    {
                                        'name' : 'proton gyromag. ratio over 2 pi',
                                        'snippet' : ['scipy.constants.physical_constants["proton gyromag. ratio over 2 pi"]',],
                                    },
                                    {
                                        'name' : 'proton mag. mom.',
                                        'snippet' : ['scipy.constants.physical_constants["proton mag. mom."]',],
                                    },
                                    {
                                        'name' : 'proton mag. mom. to Bohr magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["proton mag. mom. to Bohr magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'proton mag. mom. to nuclear magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["proton mag. mom. to nuclear magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'proton mag. shielding correction',
                                        'snippet' : ['scipy.constants.physical_constants["proton mag. shielding correction"]',],
                                    },
                                    {
                                        'name' : 'proton mass',
                                        'snippet' : ['scipy.constants.physical_constants["proton mass"]',],
                                    },
                                    {
                                        'name' : 'proton mass energy equivalent',
                                        'snippet' : ['scipy.constants.physical_constants["proton mass energy equivalent"]',],
                                    },
                                    {
                                        'name' : 'proton mass energy equivalent in MeV',
                                        'snippet' : ['scipy.constants.physical_constants["proton mass energy equivalent in MeV"]',],
                                    },
                                    {
                                        'name' : 'proton mass in u',
                                        'snippet' : ['scipy.constants.physical_constants["proton mass in u"]',],
                                    },
                                    {
                                        'name' : 'proton molar mass',
                                        'snippet' : ['scipy.constants.physical_constants["proton molar mass"]',],
                                    },
                                    {
                                        'name' : 'proton rms charge radius',
                                        'snippet' : ['scipy.constants.physical_constants["proton rms charge radius"]',],
                                    },
                                    {
                                        'name' : 'proton-electron mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["proton-electron mass ratio"]',],
                                    },
                                    {
                                        'name' : 'proton-muon mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["proton-muon mass ratio"]',],
                                    },
                                    {
                                        'name' : 'proton-neutron mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["proton-neutron mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'proton-neutron mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["proton-neutron mass ratio"]',],
                                    },
                                    {
                                        'name' : 'proton-tau mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["proton-tau mass ratio"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Q',
                                'sub-menu' : [
                                    {
                                        'name' : 'quantum of circulation',
                                        'snippet' : ['scipy.constants.physical_constants["quantum of circulation"]',],
                                    },
                                    {
                                        'name' : 'quantum of circulation times 2',
                                        'snippet' : ['scipy.constants.physical_constants["quantum of circulation times 2"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'R',
                                'sub-menu' : [
                                    {
                                        'name' : 'Rydberg constant',
                                        'snippet' : ['scipy.constants.physical_constants["Rydberg constant"]',],
                                    },
                                    {
                                        'name' : 'Rydberg constant times c in Hz',
                                        'snippet' : ['scipy.constants.physical_constants["Rydberg constant times c in Hz"]',],
                                    },
                                    {
                                        'name' : 'Rydberg constant times hc in eV',
                                        'snippet' : ['scipy.constants.physical_constants["Rydberg constant times hc in eV"]',],
                                    },
                                    {
                                        'name' : 'Rydberg constant times hc in J',
                                        'snippet' : ['scipy.constants.physical_constants["Rydberg constant times hc in J"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'S',
                                'sub-menu' : [
                                    {
                                        'name' : 'Sackur-Tetrode constant (1 K, 100 kPa)',
                                        'snippet' : ['scipy.constants.physical_constants["Sackur-Tetrode constant (1 K, 100 kPa)"]',],
                                    },
                                    {
                                        'name' : 'Sackur-Tetrode constant (1 K, 101.325 kPa)',
                                        'snippet' : ['scipy.constants.physical_constants["Sackur-Tetrode constant (1 K, 101.325 kPa)"]',],
                                    },
                                    {
                                        'name' : 'second radiation constant',
                                        'snippet' : ['scipy.constants.physical_constants["second radiation constant"]',],
                                    },
                                    {
                                        'name' : 'shielded helion gyromag. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["shielded helion gyromag. ratio"]',],
                                    },
                                    {
                                        'name' : 'shielded helion gyromag. ratio over 2 pi',
                                        'snippet' : ['scipy.constants.physical_constants["shielded helion gyromag. ratio over 2 pi"]',],
                                    },
                                    {
                                        'name' : 'shielded helion mag. mom.',
                                        'snippet' : ['scipy.constants.physical_constants["shielded helion mag. mom."]',],
                                    },
                                    {
                                        'name' : 'shielded helion mag. mom. to Bohr magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["shielded helion mag. mom. to Bohr magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'shielded helion mag. mom. to nuclear magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["shielded helion mag. mom. to nuclear magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'shielded helion to proton mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["shielded helion to proton mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'shielded helion to shielded proton mag. mom. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["shielded helion to shielded proton mag. mom. ratio"]',],
                                    },
                                    {
                                        'name' : 'shielded proton gyromag. ratio',
                                        'snippet' : ['scipy.constants.physical_constants["shielded proton gyromag. ratio"]',],
                                    },
                                    {
                                        'name' : 'shielded proton gyromag. ratio over 2 pi',
                                        'snippet' : ['scipy.constants.physical_constants["shielded proton gyromag. ratio over 2 pi"]',],
                                    },
                                    {
                                        'name' : 'shielded proton mag. mom.',
                                        'snippet' : ['scipy.constants.physical_constants["shielded proton mag. mom."]',],
                                    },
                                    {
                                        'name' : 'shielded proton mag. mom. to Bohr magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["shielded proton mag. mom. to Bohr magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'shielded proton mag. mom. to nuclear magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["shielded proton mag. mom. to nuclear magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'speed of light in vacuum',
                                        'snippet' : ['scipy.constants.physical_constants["speed of light in vacuum"]',],
                                    },
                                    {
                                        'name' : 'standard acceleration of gravity',
                                        'snippet' : ['scipy.constants.physical_constants["standard acceleration of gravity"]',],
                                    },
                                    {
                                        'name' : 'standard atmosphere',
                                        'snippet' : ['scipy.constants.physical_constants["standard atmosphere"]',],
                                    },
                                    {
                                        'name' : 'standard-state pressure',
                                        'snippet' : ['scipy.constants.physical_constants["standard-state pressure"]',],
                                    },
                                    {
                                        'name' : 'Stefan-Boltzmann constant',
                                        'snippet' : ['scipy.constants.physical_constants["Stefan-Boltzmann constant"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'T',
                                'sub-menu' : [
                                    {
                                        'name' : 'tau Compton wavelength',
                                        'snippet' : ['scipy.constants.physical_constants["tau Compton wavelength"]',],
                                    },
                                    {
                                        'name' : 'tau Compton wavelength over 2 pi',
                                        'snippet' : ['scipy.constants.physical_constants["tau Compton wavelength over 2 pi"]',],
                                    },
                                    {
                                        'name' : 'tau mass',
                                        'snippet' : ['scipy.constants.physical_constants["tau mass"]',],
                                    },
                                    {
                                        'name' : 'tau mass energy equivalent',
                                        'snippet' : ['scipy.constants.physical_constants["tau mass energy equivalent"]',],
                                    },
                                    {
                                        'name' : 'tau mass energy equivalent in MeV',
                                        'snippet' : ['scipy.constants.physical_constants["tau mass energy equivalent in MeV"]',],
                                    },
                                    {
                                        'name' : 'tau mass in u',
                                        'snippet' : ['scipy.constants.physical_constants["tau mass in u"]',],
                                    },
                                    {
                                        'name' : 'tau molar mass',
                                        'snippet' : ['scipy.constants.physical_constants["tau molar mass"]',],
                                    },
                                    {
                                        'name' : 'tau-electron mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["tau-electron mass ratio"]',],
                                    },
                                    {
                                        'name' : 'tau-muon mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["tau-muon mass ratio"]',],
                                    },
                                    {
                                        'name' : 'tau-neutron mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["tau-neutron mass ratio"]',],
                                    },
                                    {
                                        'name' : 'tau-proton mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["tau-proton mass ratio"]',],
                                    },
                                    {
                                        'name' : 'Thomson cross section',
                                        'snippet' : ['scipy.constants.physical_constants["Thomson cross section"]',],
                                    },
                                    {
                                        'name' : 'triton g factor',
                                        'snippet' : ['scipy.constants.physical_constants["triton g factor"]',],
                                    },
                                    {
                                        'name' : 'triton mag. mom.',
                                        'snippet' : ['scipy.constants.physical_constants["triton mag. mom."]',],
                                    },
                                    {
                                        'name' : 'triton mag. mom. to Bohr magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["triton mag. mom. to Bohr magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'triton mag. mom. to nuclear magneton ratio',
                                        'snippet' : ['scipy.constants.physical_constants["triton mag. mom. to nuclear magneton ratio"]',],
                                    },
                                    {
                                        'name' : 'triton mass',
                                        'snippet' : ['scipy.constants.physical_constants["triton mass"]',],
                                    },
                                    {
                                        'name' : 'triton mass energy equivalent',
                                        'snippet' : ['scipy.constants.physical_constants["triton mass energy equivalent"]',],
                                    },
                                    {
                                        'name' : 'triton mass energy equivalent in MeV',
                                        'snippet' : ['scipy.constants.physical_constants["triton mass energy equivalent in MeV"]',],
                                    },
                                    {
                                        'name' : 'triton mass in u',
                                        'snippet' : ['scipy.constants.physical_constants["triton mass in u"]',],
                                    },
                                    {
                                        'name' : 'triton molar mass',
                                        'snippet' : ['scipy.constants.physical_constants["triton molar mass"]',],
                                    },
                                    {
                                        'name' : 'triton-electron mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["triton-electron mass ratio"]',],
                                    },
                                    {
                                        'name' : 'triton-proton mass ratio',
                                        'snippet' : ['scipy.constants.physical_constants["triton-proton mass ratio"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'U',
                                'sub-menu' : [
                                    {
                                        'name' : 'unified atomic mass unit',
                                        'snippet' : ['scipy.constants.physical_constants["unified atomic mass unit"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'V',
                                'sub-menu' : [
                                    {
                                        'name' : 'von Klitzing constant',
                                        'snippet' : ['scipy.constants.physical_constants["von Klitzing constant"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'W',
                                'sub-menu' : [
                                    {
                                        'name' : 'weak mixing angle',
                                        'snippet' : ['scipy.constants.physical_constants["weak mixing angle"]',],
                                    },
                                    {
                                        'name' : 'Wien frequency displacement law constant',
                                        'snippet' : ['scipy.constants.physical_constants["Wien frequency displacement law constant"]',],
                                    },
                                    {
                                        'name' : 'Wien wavelength displacement law constant',
                                        'snippet' : ['scipy.constants.physical_constants["Wien wavelength displacement law constant"]',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Other',
                                'sub-menu' : [
                                    {
                                        'name' : '{220} lattice spacing of silicon',
                                        'snippet' : ['scipy.constants.physical_constants["{220} lattice spacing of silicon"]',],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        'name' : 'Units',
                        'sub-menu' : [
                            {
                                'name' : 'SI prefixes',
                                'sub-menu' : [
                                    {
                                        'name' : 'yotta \\(10^{24}\\)',
                                        'snippet' : ['scipy.constants.yotta',],
                                    },
                                    {
                                        'name' : 'zetta \\(10^{21}\\)',
                                        'snippet' : ['scipy.constants.zetta',],
                                    },
                                    {
                                        'name' : 'exa \\(10^{18}\\)',
                                        'snippet' : ['scipy.constants.exa',],
                                    },
                                    {
                                        'name' : 'peta \\(10^{15}\\)',
                                        'snippet' : ['scipy.constants.peta',],
                                    },
                                    {
                                        'name' : 'tera \\(10^{12}\\)',
                                        'snippet' : ['scipy.constants.tera',],
                                    },
                                    {
                                        'name' : 'giga \\(10^{9}\\)',
                                        'snippet' : ['scipy.constants.giga',],
                                    },
                                    {
                                        'name' : 'mega \\(10^{6}\\)',
                                        'snippet' : ['scipy.constants.mega',],
                                    },
                                    {
                                        'name' : 'kilo \\(10^{3}\\)',
                                        'snippet' : ['scipy.constants.kilo',],
                                    },
                                    {
                                        'name' : 'hecto \\(10^{2}\\)',
                                        'snippet' : ['scipy.constants.hecto',],
                                    },
                                    {
                                        'name' : 'deka \\(10^{1}\\)',
                                        'snippet' : ['scipy.constants.deka',],
                                    },
                                    {
                                        'name' : 'deci \\(10^{−1}\\)',
                                        'snippet' : ['scipy.constants.deci',],
                                    },
                                    {
                                        'name' : 'centi \\(10^{−2}\\)',
                                        'snippet' : ['scipy.constants.centi',],
                                    },
                                    {
                                        'name' : 'milli \\(10^{−3}\\)',
                                        'snippet' : ['scipy.constants.milli',],
                                    },
                                    {
                                        'name' : 'micro \\(10^{−6}\\)',
                                        'snippet' : ['scipy.constants.micro',],
                                    },
                                    {
                                        'name' : 'nano \\(10^{−9}\\)',
                                        'snippet' : ['scipy.constants.nano',],
                                    },
                                    {
                                        'name' : 'pico \\(10^{−12}\\)',
                                        'snippet' : ['scipy.constants.pico',],
                                    },
                                    {
                                        'name' : 'femto \\(10^{−15}\\)',
                                        'snippet' : ['scipy.constants.femto',],
                                    },
                                    {
                                        'name' : 'atto \\(10^{−18}\\)',
                                        'snippet' : ['scipy.constants.atto',],
                                    },
                                    {
                                        'name' : 'zepto \\(10^{−21}\\)',
                                        'snippet' : ['scipy.constants.zepto',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Binary prefixes',
                                'sub-menu' : [
                                    {
                                        'name' : 'kibi \\(2^{10}\\)',
                                        'snippet' : ['scipy.constants.kibi',],
                                    },
                                    {
                                        'name' : 'mebi \\(2^{20}\\)',
                                        'snippet' : ['scipy.constants.mebi',],
                                    },
                                    {
                                        'name' : 'gibi \\(2^{30}\\)',
                                        'snippet' : ['scipy.constants.gibi',],
                                    },
                                    {
                                        'name' : 'tebi \\(2^{40}\\)',
                                        'snippet' : ['scipy.constants.tebi',],
                                    },
                                    {
                                        'name' : 'pebi \\(2^{50}\\)',
                                        'snippet' : ['scipy.constants.pebi',],
                                    },
                                    {
                                        'name' : 'exbi \\(2^{60}\\)',
                                        'snippet' : ['scipy.constants.exbi',],
                                    },
                                    {
                                        'name' : 'zebi \\(2^{70}\\)',
                                        'snippet' : ['scipy.constants.zebi',],
                                    },
                                    {
                                        'name' : 'yobi \\(2^{80}\\)',
                                        'snippet' : ['scipy.constants.yobi',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Weight',
                                'sub-menu' : [
                                    {
                                        'name' : 'One gram in kg',
                                        'snippet' : ['scipy.constants.gram',],
                                    },
                                    {
                                        'name' : 'One metric ton in kg (\\(10^{3}\\))',
                                        'snippet' : ['scipy.constants.metric_ton',],
                                    },
                                    {
                                        'name' : 'One grain in kg',
                                        'snippet' : ['scipy.constants.grain',],
                                    },
                                    {
                                        'name' : 'One pound (avoirdupois) in kg',
                                        'snippet' : ['scipy.constants.lb',],
                                    },
                                    {
                                        'name' : 'One ounce in kg',
                                        'snippet' : ['scipy.constants.oz',],
                                    },
                                    {
                                        'name' : 'One stone in kg',
                                        'snippet' : ['scipy.constants.stone',],
                                    },
                                    {
                                        'name' : 'One grain in kg',
                                        'snippet' : ['scipy.constants.grain',],
                                    },
                                    {
                                        'name' : 'One long ton in kg',
                                        'snippet' : ['scipy.constants.long_ton',],
                                    },
                                    {
                                        'name' : 'One short ton in kg',
                                        'snippet' : ['scipy.constants.short_ton',],
                                    },
                                    {
                                        'name' : 'One Troy ounce in kg',
                                        'snippet' : ['scipy.constants.troy_ounce',],
                                    },
                                    {
                                        'name' : 'One Troy pound in kg',
                                        'snippet' : ['scipy.constants.troy_pound',],
                                    },
                                    {
                                        'name' : 'One carat in kg',
                                        'snippet' : ['scipy.constants.carat',],
                                    },
                                    {
                                        'name' : 'Atomic mass constant in kg',
                                        'snippet' : ['scipy.constants.m_u',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Angle',
                                'sub-menu' : [
                                    {
                                        'name' : 'Degree in radians',
                                        'snippet' : ['scipy.constants.degree',],
                                    },
                                    {
                                        'name' : 'Arc minute in radians',
                                        'snippet' : ['scipy.constants.arcmin',],
                                    },
                                    {
                                        'name' : 'Arc second in radians',
                                        'snippet' : ['scipy.constants.arcsec',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Time',
                                'sub-menu' : [
                                    {
                                        'name' : 'One minute in seconds',
                                        'snippet' : ['scipy.constants.minute',],
                                    },
                                    {
                                        'name' : 'One hour in seconds',
                                        'snippet' : ['scipy.constants.hour',],
                                    },
                                    {
                                        'name' : 'One day in seconds',
                                        'snippet' : ['scipy.constants.day',],
                                    },
                                    {
                                        'name' : 'One week in seconds',
                                        'snippet' : ['scipy.constants.week',],
                                    },
                                    {
                                        'name' : 'One year (365 days) in seconds',
                                        'snippet' : ['scipy.constants.year',],
                                    },
                                    {
                                        'name' : 'One Julian year (365.25 days) in seconds',
                                        'snippet' : ['scipy.constants.Julian_year',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Length',
                                'sub-menu' : [
                                    {
                                        'name' : 'One inch in meters',
                                        'snippet' : ['scipy.constants.inch',],
                                    },
                                    {
                                        'name' : 'One foot in meters',
                                        'snippet' : ['scipy.constants.foot',],
                                    },
                                    {
                                        'name' : 'One yard in meters',
                                        'snippet' : ['scipy.constants.yard',],
                                    },
                                    {
                                        'name' : 'One mile in meters',
                                        'snippet' : ['scipy.constants.mile',],
                                    },
                                    {
                                        'name' : 'One mil in meters',
                                        'snippet' : ['scipy.constants.mil',],
                                    },
                                    {
                                        'name' : 'One point in meters',
                                        'snippet' : ['scipy.constants.pt',],
                                    },
                                    {
                                        'name' : 'One survey foot in meters',
                                        'snippet' : ['scipy.constants.survey_foot',],
                                    },
                                    {
                                        'name' : 'One survey mile in meters',
                                        'snippet' : ['scipy.constants.survey_mile',],
                                    },
                                    {
                                        'name' : 'One nautical mile in meters',
                                        'snippet' : ['scipy.constants.nautical_mile',],
                                    },
                                    {
                                        'name' : 'One Fermi in meters',
                                        'snippet' : ['scipy.constants.fermi',],
                                    },
                                    {
                                        'name' : 'One Angstrom in meters',
                                        'snippet' : ['scipy.constants.angstrom',],
                                    },
                                    {
                                        'name' : 'One micron in meters',
                                        'snippet' : ['scipy.constants.micron',],
                                    },
                                    {
                                        'name' : 'One astronomical unit in meters',
                                        'snippet' : ['scipy.constants.au',],
                                    },
                                    {
                                        'name' : 'One light year in meters',
                                        'snippet' : ['scipy.constants.light_year',],
                                    },
                                    {
                                        'name' : 'One parsec in meters',
                                        'snippet' : ['scipy.constants.parsec',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Pressure',
                                'sub-menu' : [
                                    {
                                        'name' : 'Standard atmosphere in pascals',
                                        'snippet' : ['scipy.constants.atm',],
                                    },
                                    {
                                        'name' : 'One bar in pascals',
                                        'snippet' : ['scipy.constants.bar',],
                                    },
                                    {
                                        'name' : 'One torr (mmHg) in pascals',
                                        'snippet' : ['scipy.constants.torr',],
                                    },
                                    {
                                        'name' : 'One psi in pascals',
                                        'snippet' : ['scipy.constants.psi',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Area',
                                'sub-menu' : [
                                    {
                                        'name' : 'One hectare in square meters',
                                        'snippet' : ['scipy.constants.hectare',],
                                    },
                                    {
                                        'name' : 'One acre in square meters',
                                        'snippet' : ['scipy.constants.acre',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Volume',
                                'sub-menu' : [
                                    {
                                        'name' : 'One liter in cubic meters',
                                        'snippet' : ['scipy.constants.liter',],
                                    },
                                    {
                                        'name' : 'One gallon (US) in cubic meters',
                                        'snippet' : ['scipy.constants.gallon',],
                                    },
                                    {
                                        'name' : 'One gallon (UK) in cubic meters',
                                        'snippet' : ['scipy.constants.gallon_imp',],
                                    },
                                    {
                                        'name' : 'One fluid ounce (US) in cubic meters',
                                        'snippet' : ['scipy.constants.fluid_ounce',],
                                    },
                                    {
                                        'name' : 'One fluid ounce (UK) in cubic meters',
                                        'snippet' : ['scipy.constants.fluid_ounce_imp',],
                                    },
                                    {
                                        'name' : 'One barrel in cubic meters',
                                        'snippet' : ['scipy.constants.bbl',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Speed',
                                'sub-menu' : [
                                    {
                                        'name' : 'Kilometers per hour in meters per second',
                                        'snippet' : ['scipy.constants.kmh',],
                                    },
                                    {
                                        'name' : 'Miles per hour in meters per second',
                                        'snippet' : ['scipy.constants.mph',],
                                    },
                                    {
                                        'name' : 'One Mach (approx., at 15 C, 1 atm) in meters per second',
                                        'snippet' : ['scipy.constants.mach',],
                                    },
                                    {
                                        'name' : 'One knot in meters per second',
                                        'snippet' : ['scipy.constants.knot',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Temperature',
                                'sub-menu' : [
                                    {
                                        'name' : 'Zero of Celsius scale in Kelvin',
                                        'snippet' : ['scipy.constants.zero_Celsius',],
                                    },
                                    {
                                        'name' : 'One Fahrenheit (only differences) in Kelvins',
                                        'snippet' : ['scipy.constants.degree_Fahrenheit',],
                                    },
                                    {
                                        'name' : 'Convert Celsius to Kelvin',
                                        'snippet' : ['scipy.constants.C2K(C)',],
                                    },
                                    {
                                        'name' : 'Convert Kelvin to Celsius',
                                        'snippet' : ['scipy.constants.K2C(K)',],
                                    },
                                    {
                                        'name' : 'Convert Fahrenheit to Celsius',
                                        'snippet' : ['scipy.constants.F2C(F)',],
                                    },
                                    {
                                        'name' : 'Convert Celsius to Fahrenheit',
                                        'snippet' : ['scipy.constants.C2F(C)',],
                                    },
                                    {
                                        'name' : 'Convert Fahrenheit to Kelvin',
                                        'snippet' : ['scipy.constants.F2K(F)',],
                                    },
                                    {
                                        'name' : 'Convert Kelvin to Fahrenheit',
                                        'snippet' : ['scipy.constants.K2F(K)',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Energy',
                                'sub-menu' : [
                                    {
                                        'name' : 'One electron volt in Joules',
                                        'snippet' : ['scipy.constants.eV',],
                                    },
                                    {
                                        'name' : 'One calorie (thermochemical) in Joules',
                                        'snippet' : ['scipy.constants.calorie',],
                                    },
                                    {
                                        'name' : 'One calorie (International Steam Table calorie, 1956) in Joules',
                                        'snippet' : ['scipy.constants.calorie_IT',],
                                    },
                                    {
                                        'name' : 'One erg in Joules',
                                        'snippet' : ['scipy.constants.erg',],
                                    },
                                    {
                                        'name' : 'One British thermal unit (International Steam Table) in Joules',
                                        'snippet' : ['scipy.constants.Btu',],
                                    },
                                    {
                                        'name' : 'One British thermal unit (thermochemical) in Joules',
                                        'snippet' : ['scipy.constants.Btu_th',],
                                    },
                                    {
                                        'name' : 'One ton of TNT in Joules',
                                        'snippet' : ['scipy.constants.ton_TNT',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Power',
                                'sub-menu' : [
                                    {
                                        'name' : 'One horsepower in watts',
                                        'snippet' : ['scipy.constants.hp',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Force',
                                'sub-menu' : [
                                    {
                                        'name' : 'One dyne in newtons',
                                        'snippet' : ['scipy.constants.dyn',],
                                    },
                                    {
                                        'name' : 'One pound force in newtons',
                                        'snippet' : ['scipy.constants.lbf',],
                                    },
                                    {
                                        'name' : 'One kilogram force in newtons',
                                        'snippet' : ['scipy.constants.kgf',],
                                    },
                                ],
                            },
                            {
                                'name' : 'Optics',
                                'sub-menu' : [
                                    {
                                        'name' : 'Convert wavelength \\(\\lambda\\) to optical frequency \\(\\nu\\)',
                                        'snippet' : ['scipy.constants.lambda2nu(lambda_)',],
                                    },
                                    {
                                        'name' : 'Convert optical frequency \\(\\nu\\) to wavelength \\(\\lambda\\)',
                                        'snippet' : ['scipy.constants.nu2lambda(nu)',],
                                    },

                                ],
                            },
                        ],
                    },
                ],
            },

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
                        'snippet' : ['import scipy.optimize',],
                    },
                    '---',
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

    var matplotlib_menu = {
        'name' : 'Matplotlib',
        'sub-menu-direction' : 'left',
        'sub-menu' : [
            {
                'name' : 'Import and set up for notebook',
                'snippet'  : [
                    'from __future__ import print_function, division',
                    'import numpy as np',
                    'import matplotlib as mpl',
                    'import matplotlib.pyplot as plt',
                    '%matplotlib inline',
                ],
            },

            {
                'name' : 'Import and set up for scripts',
                'snippet'  : [
                    'import matplotlib as mpl',
                    'mpl.use("Agg")  # Must come after importing mpl, but before importing plt',
                    'import matplotlib.pyplot as plt',
                ],
            },

            {
                'name' : 'Example plots',
                'sub-menu' : [
                    {
                        'name' : 'Basic line plot',
                        'snippet'  : [
                            '# Silly example data',
                            'bp_x = np.linspace(0, 2*np.pi, num=40, endpoint=True)',
                            'bp_y = np.sin(bp_x)',
                            '',
                            '# Make the plot',
                            'plt.plot(bp_x, bp_y, linewidth=3, linestyle="--",',
                            '         color="blue", label=r"Legend label $\\sin(x)$")',
                            'plt.xlabel(r"Description of $x$ coordinate (units)")',
                            'plt.ylabel(r"Description of $y$ coordinate (units)")',
                            'plt.title(r"Title here (remove for papers)")',
                            'plt.xlim((0, 2*np.pi))',
                            'plt.ylim((-1.1, 1.1))',
                            'plt.legend(loc="lower left")',
                            'plt.show()',
                        ],
                    },

                    {
                        'name' : 'Histogram',
                        'snippet'  : [
                            'x = np.random.randn(10000)  # example data, random normal distribution',
                            'num_bins = 50',
                            'n, bins, patches = plt.hist(x, num_bins, normed=1, facecolor="green", alpha=0.5)',
                            'plt.xlabel(r"Description of $x$ coordinate (units)")',
                            'plt.ylabel(r"Description of $y$ coordinate (units)")',
                            'plt.title(r"Histogram title here (remove for papers)")',
                            'plt.show();',
                        ],
                    },

                    {
                        'name' : 'Contour plot',
                        'snippet'  : [
                            '# Silly example data',
                            'x_min, x_max, y_min, y_max = 0.0, 2*np.pi, 0.0, 2*np.pi',
                            'f = [[np.sin(x**2 + y**2) for x in np.linspace(x_min, x_max, num=200)]',
                            '     for y in np.linspace(y_min, y_max, num=200)]',
                            '',
                            '# Make the plot',
                            'plt.figure()',
                            'plt.imshow(f, interpolation="bicubic", origin="lower",',
                            '           extent=[x_min, x_max, y_min, y_max])',
                            'plt.colorbar()',
                            'plt.title(r"Title here (remove for papers)")',
                            'plt.xlabel(r"Description of $x$ coordinate (units)")',
                            'plt.ylabel(r"Description of $y$ coordinate (units)")',
                            'plt.show()',
                        ],
                    },

                    {
                        'name' : '3-d plot',
                        'snippet'  : [
                            'from mpl_toolkits.mplot3d import Axes3D',
                            'from matplotlib import cm',
                            '',
                            '# Silly example data',
                            'X = np.arange(-5, 5, 0.25)',
                            'Y = np.arange(-5, 5, 0.25)',
                            'X, Y = np.meshgrid(X, Y)',
                            'R = np.sqrt(X**2 + Y**2)',
                            'Z = np.sin(R)',
                            '',
                            '# Make the plot',
                            'fig = plt.figure()',
                            'ax = fig.gca(projection="3d")',
                            'surf = ax.plot_surface(X, Y, Z, rstride=1, cstride=1, cmap=cm.coolwarm,',
                            '                       linewidth=0, antialiased=False)',
                            'ax.set_zlim(-1.01, 1.01)',
                            'fig.colorbar(surf, shrink=0.5, aspect=5)',
                            'plt.show()',
                        ],
                    },

                    {
                        'name' : 'Error bars',
                        'snippet'  : [
                            '# Silly example data',
                            'x = np.linspace(0.1, 4, num=10)',
                            'y = np.exp(-x)',
                            'dx = 0.1 - x/25.0',
                            'dy = 0.2 + x/15.0',
                            '',
                            '# Make the plot',
                            'plt.figure()',
                            'plt.errorbar(x, y, xerr=dx, yerr=dy)',
                            'plt.title(r"Title here (remove for papers)")',
                            'plt.xlabel(r"Description of $x$ coordinate (units)")',
                            'plt.ylabel(r"Description of $y$ coordinate (units)")',
                            'plt.show()',
                        ],
                    },

                    {
                        'name' : 'Grouped plots',
                        'snippet'  : [
                            '# Silly example data',
                            'bp_x1 = np.linspace(0, 2*np.pi, num=40, endpoint=True)',
                            'bp_y1 = np.sin(bp_x1)',
                            'bp_x2 = np.linspace(0, np.pi, num=40, endpoint=True)',
                            'bp_y2 = np.cos(bp_x2)',
                            '',
                            '# Make the plot',
                            'fig, (ax1, ax2) = plt.subplots(ncols=2)',
                            'ax1.plot(bp_x1, bp_y1, linewidth=3, linestyle="--",',
                            '         color="blue", label=r"Legend label $\\sin(x)$")',
                            'ax1.set_xlabel(r"Description of $x_{1}$ coordinate (units)")',
                            'ax1.set_ylabel(r"Description of $y_{1}$ coordinate (units)")',
                            'ax1.set_title(r"Title 1 here (remove for papers)")',
                            'ax1.set_xlim((0, 2*np.pi))',
                            'ax1.set_ylim((-1.1, 1.1))',
                            'ax1.legend(loc="lower left")',
                            'ax2.plot(bp_x2, bp_y2, linewidth=3, linestyle="--",',
                            '         color="blue", label=r"Legend label $\\cos(x)$")',
                            'ax2.set_xlabel(r"Description of $x_{2}$ coordinate (units)")',
                            'ax2.set_ylabel(r"Description of $y_{2}$ coordinate (units)")',
                            'ax2.set_title(r"Title 2 here (remove for papers)")',
                            'ax2.set_xlim((0, np.pi))',
                            'ax2.set_ylim((-1.1, 1.1))',
                            'ax2.legend(loc="lower left")',
                            'plt.show()',
                        ],
                    },
                ],
            },
        ],
    };

    var sympy_menu = {
        'name' : 'SymPy',
        'sub-menu-direction' : 'left',
        'sub-menu' : [
            {
                'name' : 'Imports and setup',
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
                    // '---',
                    {
                        'name' : 'Base of natural logarithm, $e$',
                        'snippet' : ['E',],
                    },
                    {
                        'name' : 'Unit imaginary number, $i$',
                        'snippet' : ['I',],
                    },
                    {
                        'name' : 'Geometric constant, $\\pi$',
                        'snippet' : ['pi',],
                    },
                    {
                        'name' : 'Golden ratio, $\\phi$',
                        'snippet' : ['GoldenRatio',],
                    },
                    {
                        'name' : 'Euler-Mascheroni constant, $\\gamma$',
                        'snippet' : ['EulerGamma',],
                    },
                    {
                        'name' : 'Catalan\'s constant, $K$',
                        'snippet' : ['Catalan',],
                    },
                    '---',
                    {
                        'name' : 'Infinity, $\\infty$',
                        'snippet' : ['oo',], // 'S.Infinity'
                    },
                    // {
                    //     'name' : 'Negative infinity, $-\\infty$',
                    //     'snippet' : ['S.NegativeInfinity',],
                    // },
                    {
                        'name' : 'Complex infinity, $\\tilde{\\infty}$',
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
                        'snippet' : [
                            'expr = exp(pi*I*2*x)',
                            'assumption = Q.integer(x) & Q.integer(y)',
                            'expr = refine(expr, assumption)',
                        ],
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
                                'name' : 'Caveats',
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
                                'name' : 'Caveats',
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
    };

    var pandas_menu = {
        'name' :'pandas',
        'sub-menu-direction' : 'left',
        'sub-menu' : [
            {
                'name' : 'Import',
                'snippet' : [
                    'from __future__ import print_function, division',
                    'import pandas as pd',
                ],
            },

            {
                'name' : 'Set options',
                'snippet'  : [
                    'pd.set_option(""display.height"", 10)',
                    'pd.set_option(""display.max_rows"", 20)',
                    'pd.set_option(""display.max_columns"", 500)',
                    'pd.set_option(""display.width"", 1000)',
                ],
            },

            {
                'name' : 'To/from file',
                'sub-menu' : [
                    {
                        'name' : 'Read from CSV',
                        'snippet'  : [
                            'bp_data = pd.read_csv("path/to/file.csv", header=1, delim_whitespace=True)',
                        ],
                    },

                    {
                        'name' : 'Write to CSV',
                        'snippet' : ['bp_data.to_csv("path/to/new_file.csv", sep=" ", header=False, index=False)',],
                    },
                ],
            },

            {
                'name' : 'Deal with NaNs',
                'sub-menu' : [
                    {
                        'name' : 'Filter out NaNs',
                        'snippet' : ['bp_data = bp_data.dropna()',],
                    },
                    
                    {
                        'name' : 'Replace NaNs with number',
                        'snippet' : ['bp_data = bp_data.fillna(0.0)',],
                    },
                ],
            },

            {
                'name' : 'Select rows',
                'snippet' : ['bp_data[:5]',],
            },

            {
                'name' : 'Select by column',
                'snippet' : ['bp_column = bp_data[["Column name"]]',],
                'sub-menu' : [
                    {
                        'name' : 'Select single column',
                        'snippet' : ['bp_column = bp_data[["Column name"]]',],
                    },
                    
                    {
                        'name' : 'Select multiple columns',
                        'snippet'  : [
                            'bp_columns = bp_data[["Column name 1", "Column name 2", "Column name 3"]]',],
                    },
                ],
            },

            {
                'name' : 'Get numerical values from selection',
                'sub-menu' : [
                    {
                        'name' : 'Select single column',
                        'snippet' : ['bp_num_value = bp_data[["Numerical column"]].values',],
                    },
                    {
                        'name' : 'Select multiple columns',
                        'snippet'  : [
                            'bp_num_values = bp_data[["Numerical column 1", "Numerical column 2"]].values',],
                    },
                    {
                        'name' : 'Select rows',
                        'snippet' : ['bp_num_value = bp_data[:5].values',],
                    },
                ],
            },

            {
                'name' : 'Iteration',
                'snippet' : ['',],
            },

            {
                'name' : 'Grouping',
                'snippet' : ['',],
            },

            {
                'name' : 'Sorting',
                'snippet' : ['',],
            },

            {
                'name' : 'Combining',
                'snippet' : ['',],
            },

            {
                'name' : 'Basic stats',
                'sub-menu' : [
                    {
                        'name' : 'Mean',
                        'snippet' : ['bp_mean = bp_data[["Numerical column 1"]].mean()',],
                    },
                    {
                        'name' : 'Mode',
                        'snippet' : ['bp_mode = bp_data[["Numerical column 1"]].mode()',],
                    },
                    {
                        'name' : 'Median',
                        'snippet' : ['bp_median = bp_data[["Numerical column 1"]].median()',],
                    },
                    {
                        'name' : 'Standard deviation (unbiased)',
                        'snippet' : ['bp_std = bp_data[["Numerical column 1"]].std()',],
                    },
                    {
                        'name' : 'Variance (unbiased)',
                        'snippet' : ['bp_var = bp_data[["Numerical column 1"]].var()',],
                    },
                    {
                        'name' : 'Skew (unbiased)',
                        'snippet' : ['bp_skew = bp_data[["Numerical column 1"]].skew()',],
                    },
                    {
                        'name' : 'Kurtosis (unbiased)',
                        'snippet' : ['bp_kurtosis = bp_data[["Numerical column 1"]].kurt()',],
                    },
                    {
                        'name' : 'Min',
                        'snippet' : ['bp_min = bp_data[["Numerical column 1"]].min()',],
                    },
                    {
                        'name' : 'Max',
                        'snippet' : ['bp_max = bp_data[["Numerical column 1"]].max()',],
                    },
                    {
                        'name' : 'Sum',
                        'snippet' : ['bp_sum = bp_data[["Numerical column 1"]].sum()',],
                    },
                    {
                        'name' : 'Product',
                        'snippet' : ['bp_product = bp_data[["Numerical column 1"]].product()',],
                    },
                    {
                        'name' : 'Number of elements',
                        'snippet' : ['bp_count = bp_data[["Numerical column 1"]].count()',],
                    },
                ],
            },
        ],
    };

    var h5py_menu = {
        'name' : 'h5py',
        'sub-menu-direction' : 'left',
        'sub-menu' : [
            {
                'name' : 'Import',
                'snippet' : [
                    'from __future__ import print_function, division',
                    'import h5py',
                ],
            },
            
            {
                'name' : 'Open a file',
                'snippet' : ['bp_f = h5py.File("path/to/file.h5")',],
            },
            
            {
                'name' : 'Close a file',
                'snippet' : ['bp_f.close()',],
            },
            
            {
                'name' : 'Get array',
                'snippet' : ['bp_array = bp_f["bp_array_item"][:]',],
            },
            
            {
                'name' : 'Get scalar',
                'snippet' : ['bp_scalar = bp_f["bp_scalar_item"][()]',],
            },
        ],
    };

    var numba_menu = {
        'name' : 'numba',
        'sub-menu-direction' : 'left',
        'sub-menu' : [
            {
                'name' : 'Import',
                'snippet' : [
                    'from __future__ import print_function, division',
                    'import sys',
                    'if sys.version_info[0] >= 3:',
                    '    xrange = range  # Must always iterate with xrange in njit functions',
                    'import numba',
                ],
            },
            
            {
                'name' : 'Jit function',
                'snippet'  : [
                    '@numba.njit',
                    'def bp_func(x):',
                    '    r"""Some function',
                    '    ',
                    '    Does some stuff.',
                    '    ',
                    '    """',
                    '    return x**2',
                ],
            },

            {
                'name' : 'Jit function with specified signature',
                'snippet'  : [
                    '@numba.njit(f8, f8[:])',
                    'def bp_func(x, y):',
                    '    r"""Some function',
                    '    ',
                    '    Parameters',
                    '    ----------',
                    '    x : float',
                    '    y : float array',
                    '    ',
                    '    """',
                    '    for j in xrange(y.size):',
                    '        y[j] *= x',
                ],
            },
        ],
    };
    
    var python_menu = {
        'name' : 'Python',
        'sub-menu-direction' : 'left',
        'sub-menu' : [
            {
                'name' : 'Future imports',
                'snippet' : ['from __future__ import print_function, division',],
            },

            {
                'name' : 'List comprehension',
                'snippet' : ['[x**2 for x in range(-10, 11)]',],
            },
            
            {
                'name' : 'Conditional list comprehension',
                'snippet' : ['[x**2 for x in range(-10, 11) if (x%3)==0]',],
            },
            
            {
                'name' : 'Define a simple function',
                'snippet'  : [
                    'def bp_some_func(x):',
                    '    r"""Brief description of the function"""',
                    '    return x**2',
                ],
            },
            
            {
                'name' : 'Define a simple class',
                'snippet'  : [
                    'class BPSomeClass(object):',
                    '    r"""Describe the class"""',
                    '    def __init__(self, arg1, arg2):',
                    '        self.attr1 = arg1',
                    '        self.attr2 = arg2',
                    '    ',
                    '    def attribute1(self):',
                    '        return self.attr1',
                    'bp_obj = BPSomeClass("a", 2.7182)',
                    'bp_obj.attribute1()',
                ],
            },

            {
                'name' : 'Define a complicated function',
                'snippet'  : [
                    'def bp_some_func(x, y, z=3.14, **kwargs):',
                    '    r"""Some function',
                    '    ',
                    '    Does some stuff.',
                    '    ',
                    '    Parameters',
                    '    ----------',
                    '    x : int',
                    '        Description of x',
                    '    y : str',
                    '        Description of y',
                    '    z : float, optional',
                    '        Description of z.  Defaults to 3.14',
                    '    **kwargs',
                    '        Arbitrary optional keyword arguments.',
                    '        w : float',
                    '            Defaults to 6.28',
                    '    ',
                    '    Returns',
                    '    -------',
                    '    double',
                    '        Some nonsensical number computed from some ugly formula',
                    '    ',
                    '    """',
                    '    w = kwargs.pop("w", 6.28)',
                    '    if kwargs:',
                    '        print("Got {0} unused kwargs".format(len(kwargs)))',
                    '    return (x**2 + len(y)) * (w + z)',
                ],
            },

            {
                'name' : 'Define a complicated class',
                'snippet'  : [
                    'class BPSomeClass(object):',
                    '    """Brief class description',
                    '    ',
                    '    Some more extensive description',
                    '    ',
                    '    Attributes',
                    '    ----------',
                    '    attr1 : string',
                    '        Purpose of attr1.',
                    '    attr2 : float',
                    '        Purpose of attr2.',
                    '    ',
                    '    """',
                    '    ',
                    '    def __init__(self, param1, param2, param3=0):',
                    '        """Example of docstring on the __init__ method.',
                    '        ',
                    '        Parameters',
                    '        ----------',
                    '        param1 : str',
                    '            Description of `param1`.',
                    '        param2 : float',
                    '            Description of `param2`.',
                    '        param3 : int, optional',
                    '            Description of `param3`, defaults to 0.',
                    '        ',
                    '        """',
                    '        self.attr1 = param1',
                    '        self.attr2 = param2',
                    '        print(param3 // 4)',
                    '    ',
                    '    @property',
                    '    def attribute2(self):',
                    '        return self.attr2',
                    '    ',
                    '    @attribute2.setter',
                    '    def attribute2(self, new_attr2):',
                    '        if not isinstance(float, new_attr2):',
                    '            raise ValueError("attribute2 must be a float, not {0}".format(new_attr2))',
                    '        self.attr2 = new_attr2',
                    '',
                    '',
                    'bp_obj = BPSomeClass("a", 1.618)',
                    'print(bp_obj.attribute2)',
                    'bp_obj.attribute2 = 3.236',
                    '',
                ],
            },

            {
                'name' : 'Define a subclass',
                'snippet'  : [
                    'class BP_A(object):',
                    '    def __init__(self, param1):',
                    '        self.attr1 = param1',
                    '',
                    'class BP_B(BP_A):',
                    '    def __init__(self, param1, param2):',
                    '        super(BP_B, self).__init__(param1)',
                    '        self.attr2 = param2',
                    '',
                    '',
                    'bp_b = BP_B("a", "b")',
                    'print(bp_b.attr1, bp_b.attr2)',
                ],
            },
        ],
    };
    
    var markdown_menu = {
        'name' : 'Markdown',
        'sub-menu-direction' : 'left',
        'sub-menu' : [
            {
                'name' : 'Insert itemized list',
                'snippet'  : [
                    '* One',
                    '    - Sublist',
                    '        - This',
                    '  - Sublist',
                    '        - That',
                    '        - The other thing',
                    '* Two',
                    '  - Sublist',
                    '* Three',
                    '  - Sublist',
                ],
            },

            {
                'name' : 'Insert enumerated list',
                'snippet'  : [
                    '1. Here we go',
                    '    1. Sublist',
                    '    2. Sublist',
                    '2. There we go',
                    '3. Now this',
                ],
            },

            {
                'name' : 'Insert table',
                'snippet'  : [
                    '<table>',
                    '  <tr>',
                    '    <th>Header 1</th>',
                    '    <th>Header 2</th>',
                    '  </tr>',
                    '  <tr>',
                    '    <td>row 1, cell 1</td>',
                    '    <td>row 1, cell 2</td>',
                    '  </tr>',
                    '  <tr>',
                    '    <td>row 2, cell 1</td>',
                    '    <td>row 2, cell 2</td>',
                    '  </tr>',
                    '</table>',
                ],
            },

            {
                'name' : 'Insert local image',
                'snippet'  : [
                    '<img src="image_file_in_this_directory.svg" />',
                ],
            },

            {
                'name' : 'Insert local video',
                'snippet'  : [
                    '<video controls src="video_file_in_this_directory.m4v" />',
                ],
            },

            {
                'name' : 'Insert remote image',
                'snippet'  : [
                    '<img src="http://some.site.org/image.jpg" />',
                ],
            },

            {
                'name' : 'Insert remote video',
                'snippet'  : [
                    '<video controls src="http://some.site.org/video.m4v" />',
                ],
            },

            {
                'name' : 'Insert inline math',
                'snippet' : ['$e^{i\\pi} + 1 = 0$',],
            },

            {
                'name' : 'Insert equation',
                'snippet'  : [
                    '\\begin{equation}',
                    '  e^x = \\sum_{j=0}^{\\infty} \\frac{1}{j!} x^j',
                    '\\end{equation}',
                ],
            },

            {
                'name' : 'Insert aligned equation',
                'snippet'  : [
                    '\\begin{align}',
                    '  a &= b \\\\',
                    '  c &= d \\\\',
                    '  e &= f',
                    '\\end{align}',
                ],
            },
        ],
    };

    var boilerplate_menus = [
        {
            'name' : 'Boilerplate',
            'sub-menu' : [
                numpy_menu,
                scipy_menu,
                matplotlib_menu,
                sympy_menu,
                pandas_menu,
                h5py_menu,
                numba_menu,
                python_menu,
                markdown_menu,
            ],
        },
    ];

    function insert_boilerplate(text) {
        var selected_cell = IPython.notebook.get_selected_cell();
        IPython.notebook.edit_mode();
        selected_cell.code_mirror.replaceSelection(text, 'around');
    }

    function menu_recurse(sub_menu) {
        if (typeof sub_menu == 'string') {
            if(sub_menu == '---') {
                return $('<li/>').addClass('divider');
            } else {
                console.log('Don\'t understand sub-menu string "' + sub_menu + '"');
                return null;
            }
        }

        // Create the menu item
        var dropdown_item = $('<li/>');

        if(sub_menu.hasOwnProperty('snippet')) {
            console.log(sub_menu['snippet']);
            console.log(sub_menu['snippet'].join('\n'));
            $('<a/>', {
                href : '#',
                title : sub_menu['snippet'].join('\n'),
                text : sub_menu['name'],
                onclick : 'insert_boilerplate("' + escape_strings(sub_menu['snippet']) + '")',
            }).appendTo(dropdown_item);
        } else if(sub_menu.hasOwnProperty('internal-link')) {
            var a = $('<a/>', {
                href : sub_menu['internal-link'],
                text : sub_menu['name'],
            }).appendTo(dropdown_item);
        } else if(sub_menu.hasOwnProperty('external-link')) {
            var a = $('<a/>', {
                target : '_blank',
                title : 'Opens in a new window',
                href : sub_menu['external-link'],
            });
            $('<i/>', {
                'class' : 'fa fa-external-link menu-icon pull-right',
            }).appendTo(a);
            $('<span/>').html(sub_menu['name']).appendTo(a);
            a.appendTo(dropdown_item);
        } else {
            $('<a/>', {
                href : '#',
                text : sub_menu['name'],
            }).appendTo(dropdown_item);
        }

        if(sub_menu.hasOwnProperty('sub-menu')) {
            dropdown_item.attr('class', 'dropdown-submenu');
            var sub_dropdown = $('<ul/>', {
                'class' : 'dropdown-menu',
                // 'style' : 'left:50%; top:100%', // For space-saving menus
                // 'style' : 'left:auto; right:100%', // For left-side menus
            });
            if(sub_menu.hasOwnProperty('sub-menu-direction')) {
                if(sub_menu['sub-menu-direction'] == 'left') {
                    dropdown_item.toggleClass('dropdown-submenu-left');
                    sub_dropdown.css('left', 'auto');
                    sub_dropdown.css('right', '100%');
                }
            }

            for(var j=0; j<sub_menu['sub-menu'].length; ++j) {
                var sub_sub_menu = menu_recurse(sub_menu['sub-menu'][j]);
                if(sub_sub_menu !== null) {
                    sub_sub_menu.appendTo(sub_dropdown);
                }
            }

            sub_dropdown.appendTo(dropdown_item);
        }
        
        return dropdown_item;
    };

    function menu_setup(menu_items) {
        var navbar = document.getElementsByClassName("nav navbar-nav")[0];
        var menu_counter = 0;

        for(var i = 0; i<menu_items.length; ++i) {
            menu_item = menu_items[i];
            
            var node = $('<li/>').addClass('dropdown');

            $('<a/>', {
                href : '#',
                'class' : 'dropdown-toggle',
                'data-toggle' : 'dropdown',
                'aria-expanded' : 'false',
                'text' : menu_item['name'],
            }).appendTo(node);

            var id_string = 'boilerplate_menu_'+menu_counter;
            menu_counter++;
            var dropdown = $('<ul/>', {
                id : id_string,
                'class' : 'dropdown-menu',
            });

            for(var j=0; j<menu_item['sub-menu'].length; ++j) {
                var sub_menu = menu_recurse(menu_item['sub-menu'][j]);
                if(sub_menu !== null) {
                    sub_menu.appendTo(dropdown);
                }
            }
            dropdown.appendTo(node);
            node.appendTo(navbar);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, id_string]);
        }
    };

    var load_ipython_extension = function (menu_items) {
        if(menu_items === undefined) { menu_items = boilerplate_menus; }
        $('head').append('<script type="text/javascript">\n' + insert_boilerplate + '\n</script>');
        $('head').append('<link rel="stylesheet" type="text/css" href="' + require.toUrl("./boilerplate.css") + '">');
        menu_setup(menu_items);
    };
    
    return {
        load_ipython_extension : load_ipython_extension,
        numpy_menu : numpy_menu,
        scipy_menu : scipy_menu,
        matplotlib_menu : matplotlib_menu,
        sympy_menu : sympy_menu,
        pandas_menu : pandas_menu,
        h5py_menu : h5py_menu,
        numba_menu : numba_menu,
        python_menu : python_menu,
        markdown_menu : markdown_menu,
        boilerplate_menus : boilerplate_menus,
    };
    
});
