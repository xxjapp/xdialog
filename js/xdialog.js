'use strict';

/**
 * Usage:
 *
 * let dialog = xdialog.open({effect: 'xd-effect-1'});
 * dialog.close();
 *
 * let dialog2 = xdialog.create({effect: 'xd-effect-1'});
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
        let html = '<div class="xd-overlay"></div>';
        document.body.insertAdjacentHTML('beforeend', html);
        return document.querySelector('.xd-overlay');
    }

    let defaultOptions = {
        effect: 'fade_in_and_scale'
    };

    function getEffect(effectName) {
        switch (effectName) {
            case 'fade_in_and_scale':
                return { class: 'xd-effect-1', perspective: false };
            case 'slide_in_right':
                return { class: 'xd-effect-2', perspective: false };
            case 'slide_in_bottom':
                return { class: 'xd-effect-3', perspective: false };
            case 'newspaper':
                return { class: 'xd-effect-4', perspective: false };
            case 'fall':
                return { class: 'xd-effect-5', perspective: false };
            case 'side_fall':
                return { class: 'xd-effect-6', perspective: false };
            case 'sticky_up':
                return { class: 'xd-effect-7', perspective: false };
            case '3d_flip_horizontal':
                return { class: 'xd-effect-8', perspective: false };
            case '3d_flip_vertical':
                return { class: 'xd-effect-9', perspective: false };
            case '3d_sign':
                return { class: 'xd-effect-10', perspective: false };
            case 'super_scaled':
                return { class: 'xd-effect-11', perspective: false };
            case 'just_me':
                return { class: 'xd-effect-12', perspective: false };
            case '3d_slit':
                return { class: 'xd-effect-13', perspective: false };
            case '3d_rotate_bottom':
                return { class: 'xd-effect-14', perspective: false };
            case '3d_rotate_in_left':
                return { class: 'xd-effect-15', perspective: false };
            case 'blur':
                return { class: 'xd-effect-16', perspective: false };
            case 'let_me_in':
                return { class: 'xd-effect-17', perspective: true };
            case 'make_way':
                return { class: 'xd-effect-18', perspective: true };
            case 'slip_from_top':
                return { class: 'xd-effect-19', perspective: true };
            default:
                return { class: 'xd-effect-1', perspective: false };
        }
    }

    function create(options) {
        options = Object.assign(defaultOptions, options);

        let dialogId = 'xd_' + Math.random().toString(36).substring(2);
        let effect = getEffect(options.effect);

        let html = '\
        <div class="xd-dialog ' + effect.class + '" id="' + dialogId + '">\
            <div class="xd-content">\
                <h3>Dialog</h3>\
                <div>\
                    <p>This is a dialog. You can do the following things with it:</p>\
                    <ul>\
                        <li><strong>Read:</strong> dialogs will probably tell you something important so don\'t forget to read what they say.</li>\
                        <li><strong>Look:</strong> a dialog enjoys a certain kind of attention; just look at it and appreciate its presence.</li>\
                        <li><strong>Close:</strong> click on the button below to close the dialog.</li>\
                    </ul>\
                    <div class="xd-buttons">\
                        <button class="xd-ok">OK</button>\
                        <button class="xd-close">Close</button>\
                    </div>\
                </div>\
            </div>\
        </div>';
        document.body.insertAdjacentHTML('afterbegin', html);

        let dialogElement = document.querySelector('#' + dialogId);
        let okElement = dialogElement.querySelector('.xd-ok');
        let closeElement = dialogElement.querySelector('.xd-close');

        overlay.addEventListener('click', close);
        okElement.addEventListener('click', close);
        closeElement.addEventListener('click', close);

        function show() {
            // use setTimeout to enable css transition
            setTimeout(function() {
                dialogElement.classList.add('xd-show');
            }, 0);

            if (effect.perspective) {
                document.documentElement.classList.add('xd-perspective');
            }
        }

        function hide() {
            if (effect.perspective) {
                // TODO: not work when 17
                // setTimeout(function() {
                document.documentElement.classList.remove('xd-perspective');
                // }, 0);
            }

            dialogElement.classList.remove('xd-show');
        }

        function destroy() {
            okElement.removeEventListener('click', close);
            closeElement.removeEventListener('click', close);
            overlay.removeEventListener('click', close);

            // all transition should end in 1000ms
            setTimeout(function() {
                dialogElement.remove();
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
