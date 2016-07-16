from re import sub


def strip_output_prompt(input):
    output = sub(r'<div class="prompt output_prompt">',
                 r'<div class="invisible">', input)
    return output
