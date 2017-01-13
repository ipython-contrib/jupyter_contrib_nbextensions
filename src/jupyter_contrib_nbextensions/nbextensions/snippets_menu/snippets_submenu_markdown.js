define({
    'name' : 'Markdown',
    'sub-menu' : [
        {
            'name' : 'Documentation',
            'external-link' : 'https://help.github.com/articles/github-flavored-markdown/',
        },
        '---',
        
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
});
