define({
    'name' :'pandas',
    'sub-menu' : [
        {
            'name' : 'Setup',
            'snippet' : [
                'from __future__ import print_function, division',
                'import pandas as pd',
            ],
        },
        {
            'name' : 'Documentation',
            'external-link' : 'http://pandas.pydata.org/pandas-docs/stable/',
        },
        '---',
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
});
