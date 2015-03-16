define({
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
                            'name' : 'Geometric constant \\(\\pi\\)',
                            'snippet' : ['scipy.constants.pi',]
                        },
                        {
                            'name' : 'Golden ratio \\(\\phi\\)',
                            'snippet' : ['scipy.constants.golden',]
                        },
                    ],
                },
                {
                    'name' : 'Common physical constants',
                    'sub-menu' : [
                        {
                            'name' : 'Speed of light in vacuum \\(c\\)',
                            'snippet' : ['scipy.constants.c',],
                        },
                        {
                            'name' : 'Magnetic constant \\(\\mu_0\\)',
                            'snippet' : ['scipy.constants.mu_0',],
                        },
                        {
                            'name' : 'Electric constant (vacuum permittivity), \\(\\varepsilon_0\\)',
                            'snippet' : ['scipy.constants.epsilon_0',],
                        },
                        {
                            'name' : 'Planck\'s constant \\(h\\)',
                            'snippet' : ['scipy.constants.h',],
                        },
                        {
                            'name' : 'Planck\'s reduced constant \\(\\hbar\\)',
                            'snippet' : ['scipy.constants.hbar',],
                        },
                        {
                            'name' : 'Newton\'s constant of gravitation \\(G_\\mathrm{N}\\)',
                            'snippet' : ['scipy.constants.G',],
                        },
                        {
                            'name' : 'Standard acceleration of gravity \\(g\\)',
                            'snippet' : ['scipy.constants.g',],
                        },
                        {
                            'name' : 'Elementary charge \\(e\\)',
                            'snippet' : ['scipy.constants.e',],
                        },
                        {
                            'name' : 'Molar gas constant \\(R\\)',
                            'snippet' : ['scipy.constants.R',],
                        },
                        {
                            'name' : 'Fine-structure constant \\(\\alpha\\)',
                            'snippet' : ['scipy.constants.alpha',],
                        },
                        {
                            'name' : 'Avogadro constant \\(N_\\mathrm{A}\\)',
                            'snippet' : ['scipy.constants.N_A',],
                        },
                        {
                            'name' : 'Boltzmann constant \\(k_\\mathrm{B}\\)',
                            'snippet' : ['scipy.constants.k',],
                        },
                        {
                            'name' : 'Stefan-Boltzmann constant \\(\\sigma\\)',
                            'snippet' : ['scipy.constants.sigma',],
                        },
                        {
                            'name' : 'Wien displacement law constant \\(b\\)',
                            'snippet' : ['scipy.constants.Wien',],
                        },
                        {
                            'name' : 'Rydberg constant \\(R_\\infty\\)',
                            'snippet' : ['scipy.constants.Rydberg',],
                        },
                        {
                            'name' : 'Electron mass \\(m_\\mathrm{e}\\)',
                            'snippet' : ['scipy.constants.m_e',],
                        },
                        {
                            'name' : 'Proton mass \\(m_\\mathrm{p}\\)',
                            'snippet' : ['scipy.constants.m_p',],
                        },
                        {
                            'name' : 'Neutron mass \\(m_\\mathrm{n}\\)',
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
                                    'name' : 'Compton wavelength over \\(2\\pi\\)',
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
});
