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
    function defaultOptions() {
        return {
            title: 'Dialog Title',
            body: '<p>Dialog body</p>',
            style: '',
            effect: 'fade_in_and_scale',
            buttons: ['ok', 'cancel'],
            onok: null,
            oncancel: null,
            ondestroy: null
        };
    }

    function defaultAlertOptions(text) {
        return {
            title: null,
            body: '<p style="text-align: center">' + text + '</p>',
            style: 'width: auto;',
            effect: 'sticky_up',
            buttons: ['ok']
        };
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

    function newId() {
        return 'xd-id-' + Math.random().toString(36).substring(2);
    }

    let newZIndex = (function() {
        let zIndex = 1000;

        return function() {
            zIndex += 1;
            return zIndex;
        };
    })();

    function createOverlay() {
        let id = newId();
        let html = '<div class="xd-overlay" id="' + id + '" style="z-index: ' + newZIndex() + '"></div>';
        document.body.insertAdjacentHTML('beforeend', html);
        return document.querySelector('#' + id);
    }

    function createDialog(options) {
        let id = newId();
        let effect = getEffect(options.effect);
        let html = '<div class="xd-dialog xd-center ' + effect.class + '" id="' + id + '" style="z-index:' + newZIndex()  + ';' + options.style + '"><div class="xd-content">';

        if (options.title) {
            html += '<div class="xd-title">' + options.title + '</div>';
        }

        if (options.body) {
            html += '<div class="xd-body">' + options.body + '</div>';
        }

        if (options.buttons) {
            html += '<div class="xd-buttons">';

            options.buttons.forEach(function(b) {
                switch (b) {
                    case 'ok':
                        html += '<button class="xd-ok">OK</button>';
                        break;
                    case 'cancel':
                        html += '<button class="xd-cancel">Cancel</button>';
                        break;
                    default:
                        html += b;
                        break;
                }
            })

            html += '</div>';
        }

        html += '</div></div>';
        document.body.insertAdjacentHTML('afterbegin', html);

        let dialogElement = document.querySelector('#' + id);
        dialogElement.effect = effect;
        return dialogElement;
    }

    function create(options) {
        options = Object.assign(defaultOptions(), options);

        let overlayElement = createOverlay();
        let dialogElement = createDialog(options);
        let okButton = dialogElement.querySelector('.xd-ok');
        let cancelButton = dialogElement.querySelector('.xd-cancel');

        dragElement(dialogElement)

        if (okButton) {
            okButton.addEventListener('click', ok);
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', cancel);
        }

        overlayElement.addEventListener('click', cancel);

        function show() {
            // use setTimeout to enable css transition
            setTimeout(function() {
                dialogElement.classList.add('xd-show');
            }, 0);

            if (dialogElement.effect.perspective) {
                document.documentElement.classList.add('xd-perspective');
            }
        }

        function hide() {
            if (dialogElement.effect.perspective) {
                // all transition should end in 1000 ms
                setTimeout(function() {
                    document.documentElement.classList.remove('xd-perspective');
                }, 1000);
            }

            dialogElement.classList.remove('xd-show');
        }

        function ok(e) {
            // return false onok to avoid close
            if (options.onok && options.onok(e) === false) {
                return;
            }

            close();
        }

        function cancel(e) {
            // return false oncancel to avoid close
            if (options.oncancel && options.oncancel(e) === false) {
                return;
            }

            close();
        }

        function destroy() {
            // return false ondestroy to avoid destroy
            if (options.ondestroy && options.ondestroy() === false) {
                return;
            }

            if (okButton) {
                okButton.removeEventListener('click', close);
            }

            if (cancelButton) {
                cancelButton.removeEventListener('click', close);
            }

            overlayElement.removeEventListener('click', close);
            overlayElement.remove();

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
        function dragElement(dialogElement) {
            let pos1 = 0,
                pos2 = 0,
                pos3 = 0,
                pos4 = 0;
            let titleElement = document.querySelector('#' + dialogElement.id + ' .xd-title');

            // if titleElement present, the header is where you move the dialog,
            // otherwise, move the dialog from anywhere inside the dialog
            let dragTarget = titleElement || dialogElement;

            dragTarget.onmousedown = dragMouseDown;
            dragTarget.style.cursor = 'move';

            function isDraggableElement(element) {
                // do not start drag when click on buttons and ...
                if (element.tagName === 'BUTTON') {
                    return false;
                }

                return dragTarget.contains(element);
            }

            function dragMouseDown(e) {
                if (!isDraggableElement(e.target)) {
                    return;
                }

                e.preventDefault();

                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;

                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;

                // lazy fix to keep dialog center when no drag
                fixChromeBlurOnDrag();
            }

            function elementDrag(e) {
                e.preventDefault();

                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                // set the dialogElement's new position:
                dialogElement.style.top = (dialogElement.offsetTop - pos2) + 'px';
                dialogElement.style.left = (dialogElement.offsetLeft - pos1) + 'px';
            }

            function closeDragElement() {
                // stop moving when mouse button is released:
                document.onmouseup = null;
                document.onmousemove = null;
            }

            // NOTE: fix for chrome blur on transform when dragging
            function fixChromeBlurOnDrag() {
                if (dialogElement.style.transform === 'none') {
                    return;
                }

                // 1. keep current position
                // SEE: https://stackoverflow.com/a/11396681/1440174
                let rect = dialogElement.getBoundingClientRect();
                dialogElement.style.top = rect.top + 'px';
                dialogElement.style.left = rect.left + 'px';

                // 2. set 'transform' to none, which let dialog blur in chrome)
                // do not use dialogElement.classList.remove('xd-center'), other effects may also has transforms
                dialogElement.style.transform = 'none';
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
        let dialogElement = create(options);
        dialogElement.show();
        return dialogElement;
    }

    function alert(text, options) {
        options = Object.assign(defaultAlertOptions(text), options);
        return open(options);
    }

    return {
        create: create,
        open: open,
        alert: alert
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
