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
window.xdialog = (function() {
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
        title: 'Dialog Title',
        body: '<p>Dialog body<p>',
        effect: 'fade_in_and_scale',
        ondestroy: null
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
            <div class="xd-content">';

        if (options.title) {
            html += '<div class="xd-title">' + options.title + '</div>';
        }

        html += '<div>';

        if (options.body) {
            html += options.body;
        }

        html += '<div class="xd-buttons">\
                        <button class="xd-ok">OK</button>\
                        <button class="xd-cancel">Cancel</button>\
                    </div>\
                </div>\
            </div>\
        </div>';
        document.body.insertAdjacentHTML('afterbegin', html);

        let dialogElement = document.querySelector('#' + dialogId);
        let okButton = dialogElement.querySelector('.xd-ok');
        let cancelButton = dialogElement.querySelector('.xd-cancel');

        dragElement(dialogElement)
        overlay.addEventListener('click', close);
        okButton.addEventListener('click', close);
        cancelButton.addEventListener('click', close);

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
                // all transition should end in 1000 ms
                setTimeout(function() {
                    document.documentElement.classList.remove('xd-perspective');
                }, 1000);
            }

            dialogElement.classList.remove('xd-show');
        }

        function destroy() {
            // return false ondestroy to avoid destroy
            if (options.ondestroy && options.ondestroy() === false) {
                return;
            }

            okButton.removeEventListener('click', close);
            cancelButton.removeEventListener('click', close);
            overlay.removeEventListener('click', close);

            // all transition should end in 1000 ms
            setTimeout(function() {
                dialogElement.remove();
            }, 1000);
        }

        function close(e) {
            hide();
            destroy();
        }

        // SEE: https://www.w3schools.com/howto/howto_js_draggable.asp
        function dragElement(element) {
            let pos1 = 0,
                pos2 = 0,
                pos3 = 0,
                pos4 = 0;
            let titleElement = document.querySelector('#' + element.id + ' .xd-title');

            if (titleElement) {
                // if present, the header is where you move the DIV from:
                titleElement.onmousedown = dragMouseDown;
            } else {
                // otherwise, move the DIV from anywhere inside the DIV:
                element.onmousedown = dragMouseDown;
                element.style.cursor = 'move';

            }

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();

                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;

                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();

                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                // set the element's new position:
                element.style.top = (element.offsetTop - pos2) + 'px';
                element.style.left = (element.offsetLeft - pos1) + 'px';
            }

            function closeDragElement() {
                // stop moving when mouse button is released:
                document.onmouseup = null;
                document.onmousemove = null;
            }
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
        return dialog;
    }

    return {
        create: create,
        open: open
    };
})();

// Polyfills

// SEE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, 'assign', {
        value: function assign(target, varArgs) { // .length of function is 2
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            let to = Object(target);

            for (let index = 1; index < arguments.length; index++) {
                let nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (let nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}
