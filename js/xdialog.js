'use strict';

/**
 * Usage:
 *
 * let dialog = xdialog.open('modal-0', 'md-effect-0', perspective);
 * dialog.close();
 *
 * let dialog2 = xdialog.create('modal-0', 'md-effect-0', perspective);
 * dialog2.show();
 * dialog2.hide();
 * dialog2.destroy();
 */
let xdialog = (function() {
    let overlay = null;
    init();

    function init() {
        overlay = createOverlay();
    }

    function createOverlay() {
        let html = '<div class="md-overlay"></div>';
        document.body.insertAdjacentHTML('beforeend', html);
        return document.querySelector('.md-overlay');
    }

    function create(modalId, effectClass, perspective) {
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

        let modalElement = document.querySelector('#' + modalId);
        let closeElement = modalElement.querySelector('.md-close');

        overlay.addEventListener('click', close);
        closeElement.addEventListener('click', close);

        function show() {
            // use setTimeout to enable css transition
            setTimeout(function() {
                modalElement.classList.add('md-show');
            }, 0);

            if (perspective) {
                document.documentElement.classList.add('md-perspective');
            }
        }

        function hide() {
            if (perspective) {
                // TODO: not work when 17
                // setTimeout(function() {
                document.documentElement.classList.remove('md-perspective');
                // }, 0);
            }

            modalElement.classList.remove('md-show');
        }

        function destroy() {
            closeElement.removeEventListener('click', close);
            overlay.removeEventListener('click', close);

            // all transition should end in 1000ms
            setTimeout(function() {
                modalElement.remove();
            }, 1000);
        }

        function close(e) {
            hide();
            destroy();
        }

        return {
            show: show,
            hide: hide,
            destroy: destroy,
            close: close
        };
    }

    function open(modalId, effectClass, perspective) {
        let dialog = create(modalId, effectClass, perspective);
        dialog.show();
    }

    return {
        create: create,
        open: open
    };
})();
