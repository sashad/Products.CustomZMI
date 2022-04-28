/*
 * Override the original function show_ace_editor to make needed functionality.
 * The problem is ace editor initialization for some big files too long time.
 * Second JQuery document ready event is not suitable for functionality initialization.
 */
function show_ace_editor() {
    var saveTypes = ['dtml', 'text/javascript', 'application/javascript', 'application/x-javascript', 'text/css', 'application/css', 'application/x-css'];
	$('#content').wrap('<div id="editor_container" class="form-group"></div>');
	$('#content').before('<div id="editor">ace editor text</div>');
	var dom = ace.require("ace/lib/dom");
    var form = $('textarea#content').closest('form');
	// add command to all new editor instances
	window.ace.require("ace/commands/default_commands").commands.push({
		name: "Toggle Fullscreen",
		bindKey: "F10",
		exec: function(editor) {
			var fullScreen = dom.toggleCssClass(document.body, "fullScreen");
			dom.setCssClass(window.editor.container, "fullScreen", fullScreen);
			window.editor.setAutoScrollEditorIntoView(!fullScreen);
			window.editor.resize();
			window.scrollTo(0, 0);
		}
	});
	window.ace.require("ace/commands/default_commands").commands.push({
        name: "Save changes",
        bindKey: "F2",
        exec: function(editor) {
            var fullScreen = !dom.toggleCssClass(document.body, "fullScreen");
            var submitElement = $("input:submit");
            var tempElement = $("<input type='hidden' />");
            tempElement
                .attr("name", submitElement.attr("name"))
                .val(submitElement.val())
                .appendTo(form);
            var position = editor.selection.getCursor(); // to get the Position Object
            var obj = form.attr('action').split('/');
            obj.shift(); obj.shift(); obj.shift();
            obj.unshift('zope');
            sessionStorage.setItem(obj.join('/'), JSON.stringify({row: position.row, col: position.column, fs: fullScreen}));
            form.submit();
        }
	});
	// @see https://github.com/ajaxorg/ace/wiki/Embedding---API
	$("textarea#content").hide();
	window.editor = ace.edit("editor");
	var value = $("textarea#content").val();
	var content_type = $("input#contenttype").val();
	if ( (typeof content_type === "undefined" || !content_type) &&  $("textarea#content").attr('data-contenttype') ) {
		content_type = $("textarea#content").attr('data-contenttype');
	}
	if (typeof content_type === "undefined" || ! content_type || content_type === 'text/x-unknown-content-type') {
		var absolute_url = $("span#absolute_url").text();
		var id = absolute_url.substr(absolute_url.lastIndexOf("/")+1);
		if (id.endsWith(".css")) {
			content_type = "text/css";
		}
		else if (id.endsWith(".less")) {
			content_type = "text/less";
		}
		else if (id.endsWith(".js")) {
			content_type = "text/javascript";
		}
		else {
			content_type = "text/html";
		}
	}
	if ( 0 === value.indexOf("<html") && !saveTypes.includes(content_type) ) {
		content_type = "text/html";
	}
	if ( (0 === value.indexOf("<?xml") || value.indexOf("tal:") >= 0) && !saveTypes.includes(content_type) ) {
		content_type = "text/xml";
	}
	if ( 0 === value.indexOf("#!/usr/bin/python") || 0 === value.indexOf("## Script (Python)") ) {
		content_type = "python";
	}
	var mode = "text";
	if (content_type == "html" || content_type == "text/html") {
		mode = "html";
	}
	else if (content_type == "text/css" || content_type == "application/css" || content_type == "application/x-css") {
		mode = "css";
	}
	else if (content_type == "text/less") {
		mode = "less";
	}
	else if (content_type == "text/javascript" || content_type == "application/javascript" || content_type == "application/x-javascript") {
		mode = "javascript";
	}   
	else if (content_type == "text/xml") {
		mode = "xml";
	}
	else if (content_type == "python") {
		mode = 'python';
	}
	else if (content_type == "sql") {
		mode = 'sql';
	}
	else if (content_type == "json") {
		mode = 'json';
	}
	else if (content_type == "dtml") {
		mode = 'markdown';
	}
	window.editor.setTheme("ace/theme/chrome");
	window.editor.getSession().setMode('ace/mode/'+mode);
	window.editor.getSession().setValue(value);
	window.editor.on('blur', function() {
	    // on blur event to save a cursor position
        var obj = form.attr('action').split('/');
        obj.shift(); obj.shift(); obj.shift();
        obj.unshift('zope');
        var pos = sessionStorage.getItem(obj.join('/'));
        var fullScreen = false;
        if (pos !== null) {
            var sessionData = JSON.parse(pos);
            fullScreen = sessionData.fs;
        }
        var position = editor.selection.getCursor(); // to get the Position Object
        sessionStorage.setItem(obj.join('/'), JSON.stringify({row: position.row, col: position.column, fs: fullScreen}));
	});
    window.editor.on('changeSelection', function() {
	    // on changeSelection event to save a cursor position
        var obj = form.attr('action').split('/');
        obj.shift(); obj.shift(); obj.shift();
        obj.unshift('zope');
        var pos = sessionStorage.getItem(obj.join('/'));
        var fullScreen = false;
        if (pos !== null) {
            var sessionData = JSON.parse(pos);
            fullScreen = sessionData.fs;
        }
        var position = editor.selection.getCursor(); // to get the Position Object
        sessionStorage.setItem(obj.join('/'), JSON.stringify({row: position.row, col: position.column, fs: fullScreen}));
    });
    window.editor.on('focus', function() {
        if (form) {
            var obj = form.attr('action').split('/');
            obj.shift(); obj.shift(); obj.shift();
            obj.unshift('zope');
            var pos = sessionStorage.getItem(obj.join('/'));
            if (pos !== null) {
                var sessionData = JSON.parse(pos);
                dom.setCssClass(document.body, "fullScreen", sessionData.fs);
                dom.setCssClass(window.editor.container, "fullScreen", sessionData.fs);
                window.editor.moveCursorTo(sessionData.row, sessionData.col);
                var toScrollToLine = true;
                window.editor.renderer.on('afterRender', function() {
                	if (toScrollToLine) {
                        window.editor.scrollToLine(sessionData.row, true);
                	    toScrollToLine = false;
                	}
                });
    			window.editor.setAutoScrollEditorIntoView(!sessionData.fs);
                window.editor.resize(true);
            }
        }
    });
    window.scrollTo(0, 0);
    window.editor.focus();
	window.editor.getSession().on("change",function() {
		$("textarea#content").val(editor.getSession().getValue()).change();
	});
}
