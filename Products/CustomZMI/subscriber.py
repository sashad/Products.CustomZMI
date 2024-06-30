import zope.component
import zope.interface


@zope.component.adapter(zope.interface.Interface)
def css_paths(context):
    """Return paths to CSS files needed for the Zope 4 ZMI."""
    if hasattr(context, 'zmi.css'):
        return (
            # Load a custom CSS from a ZODB root project.
            '/zmi.css',
        )
    return None


@zope.component.adapter(zope.interface.Interface)
def js_paths(context):
    """Return paths to JS files needed for the Zope 4 ZMI."""
    if hasattr(context, 'zmi.js'):
        return (
            # Reload ace editor by newer version.
            '/++resource++custom_zmi/ace.ajax.org/ace.js',
            # Load a JS script from a ZODB root project.
            '/zmi.js',
        )
    return None
