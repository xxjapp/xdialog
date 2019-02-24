'use strict';

(function() {
    [].slice.call(document.querySelectorAll('.md-trigger')).forEach(function(el) {
        el.addEventListener('click', function() {
            let effect = el.getAttribute('data-effect');
            xdialog.open({
                effect: effect
            });
        });
    });
})();
