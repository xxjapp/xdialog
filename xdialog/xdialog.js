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
    let dialogs = [];

    function defaultOptions() {
        return {
            // dialog title
            // use null value to remove title
            title: 'Dialog Title',

            // dialog body
            // use null value to remove body
            body: '<p>Dialog body</p>',

            // dialog buttons,
            //
            // valid values:
            // - array
            //  - predefined button name or user defined button html like
            //  ['ok', 'cancel', 'delete', '<button id="my-button-id" class="my-button-class">Button-text</button>']
            // - object
            //  - button name to button text(predefined) or button html(user defined) or attribute object map like
            // {
            //     ok: {
            //         name: '削除',
            //         style: 'background:#f44336;'
            //     },
            //     delete: '削除',
            //     cancel: 'キャンセル',
            //     other: '<button id="my-button-id" class="my-button-class">Button-text</button>'
            // }
            buttons: ['ok', 'cancel'],

            // dialog extra style
            // for example 'width: auto;'
            style: '',

            // dialog show/hide effect, one of the following values
            // - fade_in_and_scale'
            // - slide_in_right'
            // - slide_in_bottom'
            // - newspaper'
            // - fall'
            // - side_fall'
            // - sticky_up'
            // - 3d_flip_horizontal'
            // - 3d_flip_vertical'
            // - 3d_sign'
            // - super_scaled'
            // - just_me'
            // - 3d_slit'
            // - 3d_rotate_bottom'
            // - 3d_rotate_in_left'
            // - blur'
            // - let_me_in'
            // - make_way'
            // - slip_from_top'
            //
            // use null value to disable effect
            effect: 'fade_in_and_scale',

            // fix dialog blur for chrome browser with/without transform and/or with/without perspective
            //
            // true: to fix
            // false: not to fix
            //
            fixChromeBlur: true,

            // callback when OK button pressed
            // return false to avoid to be closed
            onok: null,

            // callback when Cancel button pressed
            // return false to avoid to be closed
            oncancel: null,

            // callback when Delete button pressed
            // return false to avoid to be closed
            ondelete: null,

            // callback when dialog is about to be destroyed
            // return false to avoid to be destroyed
            ondestroy: null,
        };
    }

    function defaultAlertOptions(text) {
        text = text || 'alert text';

        return {
            title: null,
            body: '<p style="text-align:center;">' + text + '</p>',
            buttons: ['ok'],
            style: 'width:auto;',
            effect: 'sticky_up',
        };
    }

    function defaultConfirmOptions(text, onyes) {
        text = text || 'Are you sure?';

        return {
            title: 'Confirm',
            body: '<p style="text-align:center;">' + text + '</p>',
            buttons: {
                ok: 'Yes',
                cancel: 'No'
            },
            style: 'width:auto;',
            effect: '3d_sign',
            onok: onyes,
        };
    }

    function getEffect(effectName) {
        if (!effectName) {
            return { class: '', perspective: false };
        }

        switch (effectName) {
            case 'fade_in_and_scale':
            default:
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
        let overlayElement = document.createElement('div');

        overlayElement.classList.add('xd-overlay');
        overlayElement.style['z-index'] = newZIndex();

        document.body.insertAdjacentElement('beforeend', overlayElement);
        return overlayElement;
    }

    function createDialog(options) {
        // create element
        let dialogElement = document.createElement('div');
        let effect = getEffect(options.effect);

        dialogElement.id = newId();
        dialogElement.effect = effect;
        dialogElement.setAttribute('class', 'xd-dialog xd-center ' + effect.class);
        dialogElement.setAttribute('style', 'z-index:' + newZIndex() + ';' + options.style);

        // create innerHTML
        let innerHTML = '<div class="xd-content">';

        if (options.title) {
            innerHTML += '<div class="xd-title">' + options.title + '</div>';
        }

        if (options.body) {
            innerHTML += '<div class="xd-body">' + options.body + '</div>';
        }

        if (options.buttons) {
            innerHTML += createButtons(options);
        }

        innerHTML += '</div>';
        dialogElement.innerHTML = innerHTML;

        document.body.insertAdjacentElement('afterbegin', dialogElement);
        return dialogElement;
    }

    function predefinedButtonInfo(name) {
        switch (name) {
            case 'ok':
                return {
                    text: 'OK',
                    class: 'xd-ok'
                };
            case 'cancel':
                return {
                    text: 'Cancel',
                    class: 'xd-cancel'
                };
            case 'delete':
                return {
                    text: 'Delete',
                    class: 'xd-delete'
                };
            default:
                return null;
        }
    }

    function createButtons(options) {
        let html = '';
        let buttonInfos = {};

        if (Array.isArray(options.buttons)) {
            options.buttons.forEach(function(name, i) {
                let buttonInfo = predefinedButtonInfo(name);

                if (buttonInfo) {
                    // predefined
                    buttonInfos[name] = buttonInfo;
                } else {
                    // non-predefined
                    buttonInfos['button' + i] = {
                        html: name // name is html
                    };
                }
            });
        } else {
            Object.keys(options.buttons).forEach(function(name) {
                let buttonInfo = predefinedButtonInfo(name);
                let value = options.buttons[name];

                if (buttonInfo) {
                    // predefined
                    if (typeof value === 'string' || value instanceof String) {
                        // value is a string, set text attribute
                        buttonInfo.text = value;
                        buttonInfos[name] = buttonInfo;
                    } else {
                        // value is an object, merge attributes
                        buttonInfos[name] = Object.assign(buttonInfo, value);
                    }
                } else {
                    // non-predefined
                    buttonInfos[name] = {
                        html: value
                    };
                }
            });
        }

        html += '<div class="xd-buttons">';

        Object.keys(buttonInfos).forEach(function(name) {
            if (buttonInfos[name].html) {
                // html defined
                html += buttonInfos[name].html;
            } else {
                let style = buttonInfos[name].style || '';
                html += '<button style="' + style + '" class="' + buttonInfos[name].class + '">' + buttonInfos[name].text + '</button>';
            }
        });

        html += '</div>';

        return html;
    }

    function create(options) {
        options = Object.assign(defaultOptions(), options);

        let overlayElement = createOverlay();
        let dialogElement = createDialog(options);
        let okButton = dialogElement.querySelector('.xd-ok');
        let cancelButton = dialogElement.querySelector('.xd-cancel');
        let deleteButton = dialogElement.querySelector('.xd-delete');

        dragElement(dialogElement)

        if (okButton) {
            okButton.addEventListener('click', doOk);
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', doCancel);
        }

        if (deleteButton) {
            deleteButton.addEventListener('click', doDelete);
        }

        overlayElement.addEventListener('click', doCancel);

        function show() {
            // use setTimeout to enable css transition
            setTimeout(function() {
                dialogElement.classList.add('xd-show');
                overlayElement.classList.add('xd-show-overlay');
            }, 0);

            if (dialogElement.effect.perspective) {
                document.documentElement.classList.add('xd-perspective');
            }

            // NOTE: fix chrome blur
            if (options.fixChromeBlur) {
                // all transition should end in 1000 ms
                // event transitionend not always usable, so use setTimeout
                setTimeout(function() {
                    fixChromeBlur();
                }, 1000);
            }
        }

        function hide() {
            restorePerspectiive();

            if (dialogElement.effect.perspective) {
                // all transition should end in 1000 ms
                setTimeout(function() {
                    document.documentElement.classList.remove('xd-perspective');
                }, 1000);
            }

            dialogElement.classList.remove('xd-show');
            overlayElement.classList.remove('xd-show-overlay');
        }

        function fixChromeBlur() {
            // 1. keep current position
            // SEE: https://stackoverflow.com/a/11396681/1440174
            let rect = dialogElement.getBoundingClientRect();
            dialogElement.style.top = rect.top + 'px';
            dialogElement.style.left = rect.left + 'px';

            // 2. set 'transform' and 'perspective' to none, which may make dialog blurry in chrome browser
            dialogElement.style.transform = 'none';
            dialogElement.style.perspective = 'none';
        }

        // restore perspective to enable 3D transform
        function restorePerspectiive() {
            // remove inline perspective
            // NOTE: do not remove 'top', 'left' and 'transform' to keep dialog position after user's drag
            dialogElement.style.removeProperty('perspective');
        }

        function doOk(e) {
            if (options.onok && options.onok(e) === false) {
                return;
            }

            close();
        }

        function doCancel(e) {
            if (options.oncancel && options.oncancel(e) === false) {
                return;
            }

            close();
        }

        function doDelete(e) {
            if (options.ondelete && options.ondelete(e) === false) {
                return;
            }

            close();
        }

        function destroy() {
            if (options.ondestroy && options.ondestroy() === false) {
                return;
            }

            if (okButton) {
                okButton.removeEventListener('click', doOk);
            }

            if (cancelButton) {
                cancelButton.removeEventListener('click', doCancel);
            }

            if (deleteButton) {
                deleteButton.removeEventListener('click', doDelete);
            }

            overlayElement.removeEventListener('click', doCancel);

            // all transition should end in 1000 ms
            setTimeout(function() {
                let index = dialogs.indexOf(dialog);

                if (index === -1) {
                    // user may call destroy() or click OK/Cancle/Delete button multi times
                    return;
                }

                dialogs.splice(index, 1);
                document.body.removeChild(dialogElement);
                document.body.removeChild(overlayElement);
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
        }

        let dialog = {
            // dialog.element
            // dialog html element
            element: dialogElement,

            // dialog.show()
            // show dialog
            show: show,

            // dialog.hide()
            // hide dialog
            hide: hide,

            // dialog.destroy()
            // destroy dialog
            destroy: destroy,

            // dialog.close()
            // hide dialog and destory it
            close: close,

            // dialog.fixChromeBlur()
            // fix chrome blur
            fixChromeBlur: fixChromeBlur
        };

        dialogs.push(dialog);
        return dialog;
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

    function confirm(text, onyes, options) {
        options = Object.assign(defaultConfirmOptions(text, onyes), options);
        return open(options);
    }

    return {
        // xdialog.create(options)
        // create a dialog
        create: create,

        // xdialog.open(options)
        // create a dialog and show it
        open: open,

        // xdialog.alert(text, options)
        // create an alert dialog and show it
        alert: alert,

        // xdialog.confirm(text, onyes, options)
        // create a confirm dialog and show it
        confirm: confirm,

        // xdialog.dialogs
        // access all dialog instances
        dialogs: dialogs
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
