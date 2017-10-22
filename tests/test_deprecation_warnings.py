import json
import warnings

with warnings.catch_warnings(record=True) as ww:
    # Cause all warnings to always be triggered.
    warnings.simplefilter("always")
    # (Potentially) trigger some deprecation warnings.
    import jupyter_contrib_nbextensions.nbconvert_support  # noqa
    # list them all:
    errs = [{
        'category': w.category.__name__,
        'message': w.message.args[0],
        'filename': w.filename,
        'lineno': w.lineno
    } for w in ww if issubclass(w.category, (PendingDeprecationWarning,
                                             DeprecationWarning))]
    if errs:
        raise Exception(
            'Warnings found:\n' + json.dumps(errs, indent=2, sort_keys=True))
