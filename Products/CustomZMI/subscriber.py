import zope.component
import zope.interface

from zmi.styles import subscriber

@zope.component.adapter(zope.interface.Interface)
def css_paths(context):
    """Return paths to CSS files needed for the Zope 4 ZMI."""
    return subscriber.css_paths(context) + ('/zmi.css',)


@zope.component.adapter(zope.interface.Interface)
def js_paths(context):
    """Return paths to JS files needed for the Zope 4 ZMI."""
    return subscriber.js_paths(context) + ('/zmi.js',)
