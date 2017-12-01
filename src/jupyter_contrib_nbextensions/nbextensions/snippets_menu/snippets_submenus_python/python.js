define([
    "require",
    "./python_regex",
], function (requirejs, python_regex) {
    return {
        'name' : 'Python',
        'sub-menu' : [
            {
                'name' : 'Setup',
                'snippet' : ['from __future__ import print_function, division',],
            },
            {
                'name' : 'Documentation',
                'external-link' : 'https://docs.python.org/',
            },
            '---',

            {
                'name' : 'Lists',
                'sub-menu' : [
                    {
                        'name' : 'List comprehension',
                        'snippet' : ['[x**2 for x in range(-10, 11)]',],
                    },
                    {
                        'name' : 'Conditional list comprehension',
                        'snippet' : ['[x**2 for x in range(-10, 11) if (x%3)==0]',],
                    },
                    {
                        'name' : 'Conditional alternative list comprehension',
                        'snippet' : ['[x**2 if (x%3)==0 else x**3 for x in range(-10, 11)]',],
                    },
                    {
                        'name' : 'Reversed list',
                        'snippet' : ['reversed(l)'],
                    },
                    {
                        'name' : 'Sorted list',
                        'snippet' : ['sorted(l)'],
                    },
                    {
                        'name' : 'Sort two lists at the same time',
                        'snippet' : ['x, y = [list(tmp) for tmp in zip(*sorted(zip(x,y), key=lambda pair: pair[0]))]'],
                    },
                ],
            },

            {
                'name' : 'Basic file input/output',
                'sub-menu' : [
                    {
                        'name' : 'Read file into string',
                        'snippet' : [
                            'with open("some/file.txt", "r") as file_handle:',
                            '    file_contents = file_handle.read()',
                        ],
                    },
                    {
                        'name' : 'Read file into string, operating on each line',
                        'snippet' : [
                            'file_contents = ""',
                            'with open("some/file.txt", "r") as file_handle:',
                            '    for line in file_handle.readlines():',
                            '        file_contents += line.replace("-", "_")',
                        ],
                    }
                ],
            },
            
            {
                'name' : 'Defining functions',
                'sub-menu' : [
                    {
                        'name' : 'Simple function',
                        'snippet'  : [
                            'def bp_some_func(x):',
                            '    r"""Brief description of the function"""',
                            '    return x**2',
                        ],
                    },
                    {
                        'name' : 'Complicated function',
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
                ],
            },
            
            {
                'name' : 'Defining classes',
                'sub-menu' : [
                    {
                        'name' : 'Simple class',
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
                        'name' : 'Complicated class',
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
                        'name' : 'Subclass',
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
            },

            python_regex,
        ],
    };
});
