define({
    'name' : 'Astropy',
    'sub-menu' : [
        {
            'name' : 'Constants',
            'sub-menu' : [
                {
                    'name' : 'Setup',
                    'snippet' : ['import astropy.constants'],
                },
                '---',
                {
                    'name' : 'Extracting value',
                    'snippet' : ['astropy.constants.G.value'],
                },
                {
                    'name' : 'Extracting units',
                    'snippet' : ['astropy.constants.G.unit'],
                },
                {
                    'name' : 'Extracting uncertainty',
                    'snippet' : ['astropy.constants.G.uncertainty'],
                },
                {
                    'name' : 'Converting to SI',
                    'snippet' : ['astropy.constants.G.si'],
                },
                {
                    'name' : 'Converting to cgs',
                    'snippet' : ['astropy.constants.G.cgs'],
                },
                '---',
                {
                    'name' : 'Gravitational constant [\\(\\mathrm{m}^3 / (\\mathrm{kg}\\, \\mathrm{s}^2)\\)]',
                    'snippet' : ['astropy.constants.G',],
                },
                {
                    'name' : 'Solar luminosity [\\(\\mathrm{W}\\)]',
                    'snippet' : ['astropy.constants.L_sun',],
                },
                {
                    'name' : 'Earth mass [\\(\\mathrm{kg}\\)]',
                    'snippet' : ['astropy.constants.M_earth',],
                },
                {
                    'name' : 'Jupiter mass [\\(\\mathrm{kg}\\)]',
                    'snippet' : ['astropy.constants.M_jup',],
                },
                {
                    'name' : 'Solar mass [\\(\\mathrm{kg}\\)]',
                    'snippet' : ['astropy.constants.M_sun',],
                },
                {
                    'name' : 'Avogadro’s number [\\(1 / \\mathrm{mol}\\)]',
                    'snippet' : ['astropy.constants.N_A',],
                },
                {
                    'name' : 'Gas constant [\\(\\mathrm{J} / (\\mathrm{K}\\, \\mathrm{mol})\\)]',
                    'snippet' : ['astropy.constants.R',],
                },
                {
                    'name' : 'Earth equatorial radius [\\(\\mathrm{m}\\)]',
                    'snippet' : ['astropy.constants.R_earth',],
                },
                {
                    'name' : 'Jupiter equatorial radius [\\(\\mathrm{m}\\)]',
                    'snippet' : ['astropy.constants.R_jup',],
                },
                {
                    'name' : 'Solar radius [\\(\\mathrm{m}\\)]',
                    'snippet' : ['astropy.constants.R_sun',],
                },
                {
                    'name' : 'Rydberg constant [\\(1 / \\mathrm{m}\\)]',
                    'snippet' : ['astropy.constants.Ryd',],
                },
                {
                    'name' : 'Bohr radius [\\(\\mathrm{m}\\)]',
                    'snippet' : ['astropy.constants.a0',],
                },
                {
                    'name' : 'Fine-structure constant (dimensionless)',
                    'snippet' : ['astropy.constants.alpha',],
                },
                {
                    'name' : 'Atmosphere [\\(\\mathrm{Pa}\\)]',
                    'snippet' : ['astropy.constants.atmosphere',],
                },
                {
                    'name' : 'Astronomical Unit [\\(\\mathrm{m}\\)]',
                    'snippet' : ['astropy.constants.au',],
                },
                {
                    'name' : 'Wien wavelength displacement law constant [\\(\\mathrm{m}\\, \\mathrm{K}\\)]',
                    'snippet' : ['astropy.constants.b_wien',],
                },
                {
                    'name' : 'Speed of light in vacuum [\\(\\mathrm{m} / \\mathrm{s}\\)]',
                    'snippet' : ['astropy.constants.c',],
                },
                {
                    'name' : 'Electron charge [\\(\\mathrm{C}\\)]',
                    'snippet' : ['astropy.constants.e',],
                },
                {
                    'name' : 'Electric constant [\\(\\mathrm{F}/\\mathrm{m}\\)]',
                    'snippet' : ['astropy.constants.eps0',],
                },
                {
                    'name' : 'Standard acceleration of gravity [\\(\\mathrm{m} / \\mathrm{s}^2\\)]',
                    'snippet' : ['astropy.constants.g0',],
                },
                {
                    'name' : 'Planck constant [\\(\\mathrm{J}\\, \\mathrm{s}\\)]',
                    'snippet' : ['astropy.constants.h',],
                },
                {
                    'name' : 'Reduced Planck constant [\\(\\mathrm{J}\\, \\mathrm{s}\\)]',
                    'snippet' : ['astropy.constants.hbar',],
                },
                {
                    'name' : 'Boltzmann constant [\\(\\mathrm{J} / \\mathrm{K}\\)]',
                    'snippet' : ['astropy.constants.k_B',],
                },
                {
                    'name' : 'Kiloparsec [\\(\\mathrm{m}\\)]',
                    'snippet' : ['astropy.constants.kpc',],
                },
                {
                    'name' : 'Electron mass [\\(\\mathrm{kg}\\)]',
                    'snippet' : ['astropy.constants.m_e',],
                },
                {
                    'name' : 'Neutron mass [\\(\\mathrm{kg}\\)]',
                    'snippet' : ['astropy.constants.m_n',],
                },
                {
                    'name' : 'Proton mass [\\(\\mathrm{kg}\\)]',
                    'snippet' : ['astropy.constants.m_p',],
                },
                {
                    'name' : 'Magnetic constant [\\(\\mathrm{N}/\\mathrm{A}^2\\)]',
                    'snippet' : ['astropy.constants.mu0',],
                },
                {
                    'name' : 'Bohr magneton [\\(\\mathrm{J}/\\mathrm{T}\\)]',
                    'snippet' : ['astropy.constants.muB',],
                },
                {
                    'name' : 'Parsec [\\(\\mathrm{m}\\)]',
                    'snippet' : ['astropy.constants.pc',],
                },
                {
                    'name' : 'Stefan-Boltzmann constant [\\(\\mathrm{W} / (\\mathrm{K}^4\\, \\mathrm{m}^2)\\)]',
                    'snippet' : ['astropy.constants.sigma_sb',],
                },
                {
                    'name' : 'Atomic mass [\\(\\mathrm{kg}\\)]',
                    'snippet' : ['astropy.constants.u',],
                },
            ],
        },
    ],
});
