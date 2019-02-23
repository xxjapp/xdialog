'use strict';

(function() {
    init();

    function init() {
        let overlay = document.querySelector('.md-overlay');

        [].slice.call(document.querySelectorAll('.md-trigger')).forEach(function(el, i) {
            el.addEventListener('click', function(ev) {
                let dataModal = el.getAttribute('data-modal');
                let modalNumber = dataModal.substring(dataModal.indexOf('-') + 1);
                addModal('modal-' + modalNumber, 'md-effect-' + modalNumber);

                let modal = document.querySelector('#' + dataModal);
                let close = modal.querySelector('.md-close');

                // use setTimeout to enable css transition
                setTimeout(function() {
                    modal.classList.add('md-show');
                }, 0);

                overlay.addEventListener('click', removeModalHandler);

                if (el.classList.contains('md-setperspective')) {
                    setTimeout(function() {
                        document.documentElement.classList.add('md-perspective');
                    }, 25);
                }

                close.addEventListener('click', function(ev) {
                    ev.stopPropagation();
                    removeModalHandler();
                });

                function removeModalHandler() {
                    overlay.removeEventListener('click', removeModalHandler);
                    modal.classList.remove('md-show');

                    if (el.classList.contains('md-setperspective')) {
                        document.documentElement.classList.remove('md-perspective');
                    }

                    modal.addEventListener("transitionend", function(event) {
                        modal.remove();
                    }, false);
                }
            });
        });
    }

    /**
     * example: addModal('modal-0', 'md-effect-0');
     *
     * @param {*} modalId
     * @param {*} effectClass
     */
    function addModal(modalId, effectClass) {
        let html = '\
        <div class="md-modal ' + effectClass + '" id="' + modalId + '">\
            <div class="md-content">\
                <h3>Modal Dialog</h3>\
                <div>\
                    <p>This is a modal window. You can do the following things with it:</p>\
                    <ul>\
                        <li><strong>Read:</strong> modal windows will probably tell you something important so don\'t forget to read what they say.</li>\
                        <li><strong>Look:</strong> a modal window enjoys a certain kind of attention; just look at it and appreciate its presence.</li>\
                        <li><strong>Close:</strong> click on the button below to close the modal.</li>\
                    </ul>\
                    <button class="md-close">Close me!</button>\
                </div>\
            </div>\
        </div>';
        document.body.insertAdjacentHTML('afterbegin', html);
    }
})();
