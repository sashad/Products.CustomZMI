# Products.CustomZMI
It is a Zope product to customize ZMI of ZOPE 5.

## Installation

Install Zope package, then ...
```bash
pip install git+https://github.com/sashad/Products.CustomZMI.git
```
or
```bash
poetry add git+https://github.com/sashad/Products.CustomZMI.git
```

Create files in your zope project root folder **zmi.css** and **zmi.js**.
Here it is a JS script to append hotkey Ctrl-S to make commit changes and save a cursor position and a fullscreen mode.

I want a dark mode for ZMI ... )))

```javascript
$(function() {
    var dom = ace.require("ace/lib/dom");
    // Prevent global scroll from a mouse wheel in fullscreen mode.
    document.body.addEventListener('wheel', function(e) {
        if (dom.hasCssClass(document.body, "fullScreen") && e.cancelable) {
            e.preventDefault();
        }
    }, {passive: false});
    if (window.editor) {
        // Load any your prefer theme.
        window.editor.setTheme('ace/theme/tomorrow_night');
        // window.editor.setTheme('ace/theme/chrome');
        window.editor.renderer.on('resize', function() {
            window.scrollTo(0, 0);
        });
        window.editor.commands.addCommand({
            name: "Save changes",
            bindKey: "Ctrl-S",
            exec: function(editor) {
                var fullScreen = !dom.toggleCssClass(document.body, "fullScreen");
                var form = $('textarea#content').closest('form');
                var submitElement = $("input:submit");
                var tempElement = $("<input type='hidden' />");
                tempElement
                    .attr("name", submitElement.attr("name"))
                    .val(submitElement.val())
                    .appendTo(form);
                var position = editor.selection.getCursor(); // to get the Position Object
                var iRow = position.row; // to get the Row Position.
                var iCol = position.column; // to get the Column Position.
                var obj = form.attr('action').split('/');
                obj.shift(); obj.shift(); obj.shift();
                sessionStorage.setItem(obj.join('/'), [iRow, iCol, fullScreen].join(','));
                form.submit();
            }
        });
        window.editor.commands.addCommand({
            name: "Test",
            bindKey: "F9",
            exec: function(editor) {
                let tab = $("ul.nav-tabs li");
                let testLink = tab.filter(function (i, item) {
                    let el = $(item)[0].outerText.toLowerCase();
                    return el.indexOf('test') >= 0;
                }).first().find('a').attr('href');
                if (testLink) {
                    window.location = testLink;
                }
            }
        });
        var form = $('textarea#content').closest('form');
        if (form) {
            var obj = form.attr('action').split('/');
            obj.shift(); obj.shift(); obj.shift();
            var pos = sessionStorage.getItem(obj.join('/'));
            if (pos) {
                var rc = pos.split(',');
                var fs = rc[2] || 'false';
                dom.setCssClass(document.body, "fullScreen", (fs === 'true'));
                dom.setCssClass(editor.container, "fullScreen", (fs === 'true'));
                editor.setAutoScrollEditorIntoView(fs !== 'true');
                editor.resize();
                editor.focus();
                editor.moveCursorTo(rc[0],rc[1]);
                editor.renderer.scrollCursorIntoView({row: rc[0], column: rc[1]}, 0.5);
            }
        }
    }
});
```

It is an example **zmi.css**

```css
body {
    background-color: #E5E5E5 !important;
}
.zmi nav[role="navigation"] {
	background-color: #E5E5E5;
	padding-top:.8rem;
}
#editor_container:after {
    content:"Please press Ctrl-S to save changes, F9 to call a test page, F10 for full screen view.";
    display:block;
    margin-top:0;
    font-size:11px;
    color:#999;
}
```
