'use strict';

(function() {
    [].slice.call(document.querySelectorAll('.md-trigger')).forEach(function(el, i) {
        el.addEventListener('click', function(ev) {
            let modalId = el.getAttribute('data-modal');
            let modalNumber = modalId.substring(modalId.indexOf('-') + 1);
            let effectClass = 'md-effect-' + modalNumber;
            let perspective = el.classList.contains('md-setperspective');

            xdialog.open(modalId, effectClass, perspective);
        });
    });
})();
