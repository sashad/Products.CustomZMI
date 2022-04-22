# Products.CustomZMI
It is a Zope product to customize ZMI of ZOPE 5

## Installation

```bash
pip install git+https://github.com/sashad/Products.CustomZMI.git
```

Create files in your zope project root folder **zmi.css** and **zmi.js**.
Here it is a JS script to append hotkey F2 to make commit changes and save a cursor position and a fullscreen mode.

```javascript
$(function() {
    //console.log("I am here!");
    var dom = ace.require("ace/lib/dom");
    if (window.editor) {
        window.editor.commands.addCommand({
            name: "Save changes",
            bindKey: "F2",
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