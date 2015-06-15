define({
    'name' : 'h5py',
    'sub-menu' : [
        {
            'name' : 'Setup',
            'snippet' : [
                'from __future__ import print_function, division',
                'import h5py',
            ],
        },
        {
            'name' : 'Documentation',
            'external-link' : 'http://docs.h5py.org/en/latest/',
        },
        '---',
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
});
