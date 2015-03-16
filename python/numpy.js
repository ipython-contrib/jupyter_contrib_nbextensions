define({
    'name' : 'NumPy',
    'sub-menu-direction' : 'left',
    'sub-menu' : [
        {
            'name' : 'Setup',
            'snippet' : [
                'from __future__ import print_function, division',
                'import numpy as np',
            ],
        },
        '---',
        {
            'name' : 'New array',
            'snippet' : ['bp_new_array = np.zeros((4,3,), dtype=complex)',],
        },
        {
            'name' : 'New array like another',
            'snippet' : ['bp_new_array = np.zeros_like(bp_other_array)',],
        },
    ]
});
