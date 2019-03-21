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
        xdialog.demo();
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
                let source = xdialog.demo.toString().split('\n').slice(1, -1);
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
})();
