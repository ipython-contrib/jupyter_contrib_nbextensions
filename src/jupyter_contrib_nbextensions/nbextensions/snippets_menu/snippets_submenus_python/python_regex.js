define({
    'name' : 'Regular expressions',
    'sub-menu' : [
        {
            'name' : 'Setup',
            'snippet' : [
                'import re',
            ],
        },
        '---',
        {
            'name' : 'Basic search for pattern anywhere in string',
            'snippet' : [
                'string = " abc def "',
                'pattern = re.compile(r"[a-z]+")',
                'result = re.search(pattern, string)',
                'if result is not None:',
                '    print("Substring \'{0}\' was found in the range {1}".format(result.group(), result.span()))',
            ],
        },
        {
            'name' : 'Basic search (match) for exact pattern at beginning of string',
            'snippet' : [
                'string = " abc def "',
                'pattern = re.compile(r".*[a-z]+")',
                'result = re.match(pattern, string)',
                'if result is not None:',
                '    print("Substring \'{0}\' was found in the range {1}".format(result.group(), result.span()))',
            ],
        },
        {
            'name' : 'Basic substitution',
            'snippet' : [
                'string = " abc def "',
                'pattern = re.compile(r"[a-z]+")',
                'new_string = re.sub(pattern, "something", string)',
                'print("New string is \'{0}\'".format(new_string))',
            ],
        },
        {
            'name' : 'Substitution with backreferences',
            'snippet' : [
                'string = "John Doe lives at 221B Baker Street."',
                'pattern = re.compile(r"""',
                '    ([a-zA-Z ]+)      # Save as many letters and spaces as possible to group 1',
                '    \\ lives\\ at\\      # Match " lives at "',
                '    (?P<address>.*)   # Save everything in between as a group named `address`',
                '    \\.                # Match the period at the end',
                '""", re.VERBOSE)',
                'new_string = re.sub(pattern, r"\\g<address> is occupied by \\1.", string)',
                'print("New string is \'{0}\'".format(new_string))',
            ],
        },
        '---',
        {
            'name' : 'Escaped special characters',
            'sub-menu' : [
                {
                    'name' : '.',
                    'snippet' : ['\\.',],
                },
                {
                    'name' : '^',
                    'snippet' : ['\\^',],
                },
                {
                    'name' : '$',
                    'snippet' : ['\\$',],
                },
                {
                    'name' : '*',
                    'snippet' : ['\\*',],
                },
                {
                    'name' : '+',
                    'snippet' : ['\\+',],
                },
                {
                    'name' : '?',
                    'snippet' : ['\\?',],
                },
                {
                    'name' : '{',
                    'snippet' : ['\\{',],
                },
                {
                    'name' : '}',
                    'snippet' : ['\\}',],
                },
                {
                    'name' : '[',
                    'snippet' : ['\\[',],
                },
                {
                    'name' : ']',
                    'snippet' : ['\\]',],
                },
                {
                    'name' : '\\',
                    'snippet' : ['\\\\',],
                },
                {
                    'name' : '|',
                    'snippet' : ['\\|',],
                },
                {
                    'name' : '(',
                    'snippet' : ['\\(',],
                },
                {
                    'name' : ')',
                    'snippet' : ['\\)',],
                },
            ],
        },

        {
            'name' : 'Character classes and alternatives',
            'sub-menu' : [
                {
                    'name' : 'Standard character-class abbreviations',
                    'sub-menu' : [
                        {
                            'name' : 'Any decimal digit',
                            'snippet' : ['\\d',],
                        },
                        {
                            'name' : 'Any non-digit character',
                            'snippet' : ['\\D',],
                        },
                        {
                            'name' : 'Any whitespace character',
                            'snippet' : ['\\s',],
                        },
                        {
                            'name' : 'Any non-whitespace character',
                            'snippet' : ['\\S',],
                        },
                        {
                            'name' : 'Any alphanumeric character',
                            'snippet' : ['\\w',],
                        },
                        {
                            'name' : 'Any non-alphanumeric character',
                            'snippet' : ['\\W',],
                        },
                    ],
                },
                {
                    'name' : 'Inclusive character classes',
                    'snippet' : [
                        '[a-zA-Z0-9 \\t\\n\\r\\f\\v]',
                    ],
                },
                {
                    'name' : 'Exclusive character classes',
                    'snippet' : [
                        '[^a-zA-Z0-9]',
                    ],
                },
                {
                    'name' : 'Alternatives',
                    'snippet' : [
                        '(?:abc|def)',
                    ],
                },
                
            ],
        },

        {
            'name' : 'Repetition',
            'sub-menu' : [
                {
                    'name' : 'Match 0 or more repetitions of the preceding, greedily',
                    'snippet' : ['*',],
                },
                {
                    'name' : 'Match 1 or more repetitions of the preceding, greedily',
                    'snippet' : ['+',],
                },
                {
                    'name' : 'Match 0 or 1 repetitions of the preceding, greedily',
                    'snippet' : ['?',],
                },
                '---',
                {
                    'name' : 'Match 0 or more repetitions of the preceding, non-greedily',
                    'snippet' : ['*?',],
                },
                {
                    'name' : 'Match 1 or more repetitions of the preceding, non-greedily',
                    'snippet' : ['+?',],
                },
                {
                    'name' : 'Match 0 or 1 repetitions of the preceding, non-greedily',
                    'snippet' : ['??',],
                },
                '---',
                {
                    'name' : 'Match exactly n repeititions of the preceding',
                    'snippet' : ['{3}',],
                },
                {
                    'name' : 'Match between m and n repetions of the preceding, greedily',
                    'snippet' : ['{3,5}',],
                },
                {
                    'name' : 'Match between m and n repetions of the preceding, non-greedily',
                    'snippet' : ['{3,5}?',],
                },
            ],
        },

        // {
        //     'name' : '',
        //     'sub-menu' : [
                
        //     ],
        // },

        // {
        //     'name' : '',
        //     'sub-menu' : [
                
        //     ],
        // },

        {
            'name' : 'Lookahead/behind',
            'sub-menu' : [
                {
                    'name' : 'Positive lookahead',
                    'snippet' : [
                        'string = "Isaac Asimov"',
                        'pattern = re.compile(r"Isaac(?= Asimov)")  # Only match "Isaac Asimov", but drop the " Asimov"',
                        'result = re.match(pattern, string)',
                        'if result is not None:',
                        '    print("Substring \'{0}\' was found in the range {1}".format(result.group(), result.span()))',
                    ],
                },
                {
                    'name' : 'Negative lookahead',
                    'snippet' : [
                        'string = "Isaac Newton"',
                        'pattern = re.compile(r"Isaac(?! Asimov)")  # Match any Isaac except Asimov, and only keep the "Isaac"',
                        'result = re.match(pattern, string)',
                        'if result is not None:',
                        '    print("Substring \'{0}\' was found in the range {1}".format(result.group(), result.span()))',
                    ],
                },
                {
                    'name' : 'Positive lookbehind',
                    'snippet' : [
                        'string = "Janet Asimov"',
                        'pattern = re.compile(r"(?<=Janet )Asimov")  # Only match "Janet Asimov", but drop the "Janet "',
                        'result = re.search(pattern, string)',
                        'if result is not None:',
                        '    print("Substring \'{0}\' was found in the range {1}".format(result.group(), result.span()))',
                    ],
                },
                {
                    'name' : 'Negative lookbehind',
                    'snippet' : [
                        'string = "Janet Asimov"',
                        'pattern = re.compile(r"(?<!Isaac )Asimov")  # Will match any Asimov except Isaac, and only keep "Asimov"',
                        'result = re.search(pattern, string)',
                        'if result is not None:',
                        '    print("Substring \'{0}\' was found in the range {1}".format(result.group(), result.span()))',
                    ],
                },
            ],
        },

        {
            'name' : 'Compilation flags',
            'sub-menu' : [
                {
                    'name' : 'Enable verbose REs, for cleaner and more organized code',
                    'snippet' : ['re.VERBOSE',],
                },
                {
                    'name' : 'Do case-insensitive matches',
                    'snippet' : ['re.IGNORECASE',],
                },
                {
                    'name' : 'Make "." match any character, including newlines',
                    'snippet' : ['re.DOTALL',],
                },
                {
                    'name' : 'Multi-line matching, affecting "^" and "$"',
                    'snippet' : ['re.MULTILINE',],
                },
                {
                    'name' : 'Make \\w, \\W, \\b, \\B, \\s, and \\S Unicode aware',
                    'snippet' : ['re.UNICODE',],
                },
                {
                    'name' : 'Make \\w, \\W, \\b, \\B, \\s, and \\S dependent on the current locale',
                    'snippet' : ['re.LOCALE',],
                },
                {
                    'name' : 'Display debug info about compiled regex',
                    'snippet' : ['re.DEBUG',],
                },
            ],
        },
    ],
});
