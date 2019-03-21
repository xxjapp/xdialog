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
            body: '<textarea id="demo-source" style="width: 100%; height: 49em;"></textarea>',
            style: 'width: 40em;',
            buttons: {
                ok: 'copy'
            },
            beforeshow: function() {
                let source = xdialog.demo.toString().split('\n').slice(1, -1);
                let spaceWidth = source[0].match(/^ */)[0].length;

                source = source.map(function(line) {
                    return line.slice(spaceWidth);
                });
                document.getElementById('demo-source').value = source.join('\n');
            }
        });
    });
})();
