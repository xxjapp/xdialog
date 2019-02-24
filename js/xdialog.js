'use strict';

/**
 * Usage:
 *
 * let dialog = xdialog.open({effect: 'md-effect-1'});
 * dialog.close();
 *
 * let dialog2 = xdialog.create({effect: 'md-effect-1'});
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

    let defaultOptions = {
        effect: 'fade_in_and_scale'
    };

    function getEffect(effectName) {
        switch (effectName) {
            case 'fade_in_and_scale':
                return { class: 'md-effect-1', perspective: false };
            case 'slide_in_right':
                return { class: 'md-effect-2', perspective: false };
            case 'slide_in_bottom':
                return { class: 'md-effect-3', perspective: false };
            case 'newspaper':
                return { class: 'md-effect-4', perspective: false };
            case 'fall':
                return { class: 'md-effect-5', perspective: false };
            case 'side_fall':
                return { class: 'md-effect-6', perspective: false };
            case 'sticky_up':
                return { class: 'md-effect-7', perspective: false };
            case '3d_flip_horizontal':
                return { class: 'md-effect-8', perspective: false };
            case '3d_flip_vertical':
                return { class: 'md-effect-9', perspective: false };
            case '3d_sign':
                return { class: 'md-effect-10', perspective: false };
            case 'super_scaled':
                return { class: 'md-effect-11', perspective: false };
            case 'just_me':
                return { class: 'md-effect-12', perspective: false };
            case '3d_slit':
                return { class: 'md-effect-13', perspective: false };
            case '3d_rotate_bottom':
                return { class: 'md-effect-14', perspective: false };
            case '3d_rotate_in_left':
                return { class: 'md-effect-15', perspective: false };
            case 'blur':
                return { class: 'md-effect-16', perspective: false };
            case 'let_me_in':
                return { class: 'md-effect-17', perspective: true };
            case 'make_way':
                return { class: 'md-effect-18', perspective: true };
            case 'slip_from_top':
                return { class: 'md-effect-19', perspective: true };
            default:
                return { class: 'md-effect-1', perspective: false };
        }
    }

    function create(options) {
        options = Object.assign(defaultOptions, options);

        let modalId = 'md_' + Math.random().toString(36).substring(2);
        let effect = getEffect(options.effect);

        let html = '\
        <div class="md-modal ' + effect.class + '" id="' + modalId + '">\
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

            if (effect.perspective) {
                document.documentElement.classList.add('md-perspective');
            }
        }

        function hide() {
            if (effect.perspective) {
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

    function open(options) {
        let dialog = create(options);
        dialog.show();
    }

    return {
        create: create,
        open: open
    };
})();
