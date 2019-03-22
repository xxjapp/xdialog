'use strict';

(function() {
    [].slice.call(document.querySelectorAll('.xd-trigger')).forEach(function(el) {
        el.addEventListener('click', function() {
            let effect = el.getAttribute('data-effect');
            let body = '\
            <p>This is a dialog. You can do the following things with it:</p>\
            <ul>\
                <li><strong>Read:</strong> dialogs will probably tell you something important so don\'t forget to read what they say.</li>\
                <li><strong>Look:</strong> a dialog enjoys a certain kind of attention; just look at it and appreciate its presence.</li>\
            </ul>';

            xdialog.open({
                title: el.textContent,
                body: body,
                effect: effect,
                onok: function(e) {
                    xdialog.alert('OK button pressed');
                    return false;
                }
            });
        });
    });

    document.getElementById('button-demo').addEventListener('click', function() {
        openDialogDemo();
    });

    document.getElementById('button-demo-source').addEventListener('click', function() {
        xdialog.open({
            title: 'demo source',
            body: '<pre><code class="js" id="demo-source"></code></pre>',
            style: 'width: auto;',
            buttons: {
                ok: {
                    text: 'copy',
                    clazz: 'xd-button xd-ok demo-copy-button'
                }
            },
            beforeshow: function() {
                let source = openDialogDemo.toString().split('\n').slice(1, -1);
                let spaceWidth = source[0].match(/^ */)[0].length;

                source = source.map(function(line) {
                    return line.slice(spaceWidth);
                }).join('\n');

                let sourceElement = document.getElementById('demo-source');
                sourceElement.innerText = source;
                hljs.highlightBlock(sourceElement);

                new ClipboardJS('.demo-copy-button', {
                    text: function() {
                        return source;
                    }
                });
            }
        });
    });

    function openDialogDemo() {
        xdialog.open({
            title: 'Login Demo',
            body: '\
            <style>\
                .demo-mb-1 { margin-bottom: 1em; }\
                .demo-row { text-align: center; }\
                .demo-row label { min-width: 6em; display: inline-block; }\
                .demo-row input { padding: 0.3em; outline: none; min-width: 12em; }\
                .demo-validated input { border: green 2px solid; }\
                .demo-validated input:invalid { border: red 2px solid; }\
            </style>\
            <div id="demo-form">\
                <div class="demo-row demo-mb-1"><label for="uname">User Name</label><input type="text" id="uname" required></div>\
                <div class="demo-row"><label for="psw">Password</label><input type="password" id="psw" required></div>\
            </div>',
            buttons: { ok: 'Login', cancel: 'Cancel' },
            style: 'width: auto',
            effect: '3d_rotate_bottom',
            onok: function() {
                document.getElementById('demo-form').classList.add('demo-validated');

                let uname = document.getElementById('uname').value;
                let psw = document.getElementById('psw').value;

                if (!uname || !psw) {
                    return false;
                }

                xdialog.alert('Welcome, ' + uname);
            }
        });
    }

    document.getElementById('button-spin').addEventListener('click', function() {
        xdialog.startSpin();

        setTimeout(function() {
            xdialog.stopSpin();
        }, 5000);
    });
})();
