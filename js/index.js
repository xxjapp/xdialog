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
                title: 'Title',
                body: body,
                effect: effect,
                onok: function(e) {
                    xdialog.alert('OK button pressed');
                },
                oncancel: function(e) {
                    xdialog.alert('Cancel button pressed');
                }
            });
        });
    });
})();
