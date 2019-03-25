'use strict';

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

window.xdialog = function() {
    let dialogs = [];
    let perspectiveCounter = 0;
    let zIndex = 10000;
    let utils = {
        newId: function() {
            return 'xd-id-' + Math.random().toString(36).substring(2);
        },
        newZIndex: function() {
            zIndex += 1;
            return zIndex;
        }
    };

    // all transitions should end in 1 second, then some cleanup work or fix will be done
    let transitionTimeout = 1000;

    let spinOverlayElement = createSpin();
    let spinCount = 0;

    let dragAsClick = {
        timeout: 300,
        distance: 5
    }

    return {
        // xdialog.init(options)
        // initialize xdialog
        // options.zIndex0 - initial z index to use, default value is 10000
        init: init,

        // xdialog.create(options)
        // create a dialog
        // SEE: [default options](#default_options)
        create: create,

        // xdialog.open(options)
        // create a dialog and show it
        // SEE: [default options](#default_options)
        open: open,

        // xdialog.alert(text, options)
        // display an alert dialog, please view the source for details
        alert: alert,

        // xdialog.confirm(text, onyes, options)
        // display a confirm dialog, please view the source for details
        confirm: confirm,

        // xdialog.dialogs()
        // get all dialog instances
        dialogs: dialogs,

        // xdialog.startSpin()
        // start spin animation
        startSpin: startSpin,

        // xdialog.stopSpin()
        // stop spin animation
        stopSpin: stopSpin,
    };

    function defaultOptions() {
        return {
            // dialog title
            // use null value to remove title
            title: 'Dialog Title',

            // dialog body
            // use null value to remove body
            body: '<p>Dialog body</p>',

            // dialog buttons
            //
            // valid values:
            // - null
            //  - no buttons
            // - array
            //  - predefined button name or user defined button html like
            //  ['ok', 'cancel', 'delete', '<button id="my-button-id" class="my-button-class">Button-text</button>']
            // - object
            //  - button name to button text(predefined) or button html(user defined) or attribute object map like
            // {
            //     ok: {
            //         name: '削除',
            //         style: 'background:#f44336;'
            //         clazz: 'xd-button xd-ok demo-copy-button'
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
            // - fade_in_and_scale
            // - slide_in_right
            // - slide_in_bottom
            // - newspaper
            // - fall
            // - side_fall
            // - sticky_up
            // - 3d_flip_horizontal
            // - 3d_flip_vertical
            // - 3d_sign
            // - super_scaled
            // - just_me
            // - 3d_slit
            // - 3d_rotate_bottom
            // - 3d_rotate_in_left
            // - blur
            // - let_me_in
            // - make_way
            // - slip_from_top
            //
            // use '' or null value to disable effect
            effect: 'fade_in_and_scale',

            // fix dialog blur for chrome browser with/without transform and/or with/without perspective
            //
            // true: to fix
            // false: not to fix
            //
            fixChromeBlur: true,

            // modal or not
            modal: true,

            // callback when dialog element is about to be created
            beforecreate: null,

            // callback when dialog element has been created
            aftercreate: null,

            // callback before show
            beforeshow: null,

            // callback after show
            aftershow: null,

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

    function callbackParam(dialogElement, dialog, overlayElement, event) {
        return {
            id: dialogElement.id,
            element: dialogElement,
            dialog: dialog,
            overlay: overlayElement,
            event: event
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
            return { clazz: '', perspective: false };
        }

        switch (effectName) {
            case 'fade_in_and_scale':
            default:
                return { clazz: 'xd-effect-1', perspective: false };
            case 'slide_in_right':
                return { clazz: 'xd-effect-2', perspective: false };
            case 'slide_in_bottom':
                return { clazz: 'xd-effect-3', perspective: false };
            case 'newspaper':
                return { clazz: 'xd-effect-4', perspective: false };
            case 'fall':
                return { clazz: 'xd-effect-5', perspective: false };
            case 'side_fall':
                return { clazz: 'xd-effect-6', perspective: false };
            case 'sticky_up':
                return { clazz: 'xd-effect-7', perspective: false };
            case '3d_flip_horizontal':
                return { clazz: 'xd-effect-8', perspective: false };
            case '3d_flip_vertical':
                return { clazz: 'xd-effect-9', perspective: false };
            case '3d_sign':
                return { clazz: 'xd-effect-10', perspective: false };
            case 'super_scaled':
                return { clazz: 'xd-effect-11', perspective: false };
            case 'just_me':
                return { clazz: 'xd-effect-12', perspective: false };
            case '3d_slit':
                return { clazz: 'xd-effect-13', perspective: false };
            case '3d_rotate_bottom':
                return { clazz: 'xd-effect-14', perspective: false };
            case '3d_rotate_in_left':
                return { clazz: 'xd-effect-15', perspective: false };
            case 'blur':
                return { clazz: 'xd-effect-16', perspective: false };
            case 'let_me_in':
                return { clazz: 'xd-effect-17', perspective: true };
            case 'make_way':
                return { clazz: 'xd-effect-18', perspective: true };
            case 'slip_from_top':
                return { clazz: 'xd-effect-19', perspective: true };
        }
    }

    function createOverlay(params) {
        params = Object.assign({
            zIndex: utils.newZIndex()
        }, params);

        let overlayElement = document.createElement('div');

        overlayElement.classList.add('xd-overlay');
        overlayElement.style['z-index'] = params.zIndex;

        document.body.insertAdjacentElement('beforeend', overlayElement);
        return overlayElement;
    }

    function createDialog(options, overlayElement) {
        // create element
        let dialogElement = document.createElement('div');
        let effect = getEffect(options.effect);

        dialogElement.id = utils.newId();
        dialogElement.effect = effect;
        dialogElement.setAttribute('class', 'xd-dialog xd-center ' + effect.clazz);
        dialogElement.setAttribute('style', 'z-index:' + utils.newZIndex() + ';' + options.style);

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

        options.beforecreate && options.beforecreate(callbackParam(dialogElement, null, overlayElement, null));
        document.body.insertAdjacentElement('afterbegin', dialogElement);
        options.aftercreate && options.aftercreate(callbackParam(dialogElement, null, overlayElement, null));

        return dialogElement;
    }

    function predefinedButtonInfo(name) {
        switch (name) {
            case 'ok':
                return {
                    text: 'OK',
                    clazz: 'xd-button xd-ok'
                };
            case 'cancel':
                return {
                    text: 'Cancel',
                    clazz: 'xd-button xd-cancel'
                };
            case 'delete':
                return {
                    text: 'Delete',
                    clazz: 'xd-button xd-delete'
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
                html += '<button style="' + style + '" class="' + buttonInfos[name].clazz + '">' + buttonInfos[name].text + '</button>';
            }
        });

        html += '</div>';

        return html;
    }

    /**
     * init xdialog
     *
     * @param {object} options
     * @param {number} options.zIndex0
     */
    function init(options) {
        zIndex = options.zIndex0 || zIndex;
    }

    function create(options) {
        let dialog = {};
        options = Object.assign(defaultOptions(), options);

        let overlayElement = null;
        options.modal && (overlayElement = createOverlay());

        let dialogElement = createDialog(options, overlayElement);
        let okButton = dialogElement.querySelector('.xd-ok');
        let cancelButton = dialogElement.querySelector('.xd-cancel');
        let deleteButton = dialogElement.querySelector('.xd-delete');

        dragElement(dialogElement)

        if (overlayElement) {
            dragElement(dialogElement, overlayElement, doCancel);
        }

        okButton && okButton.addEventListener('click', doOk);
        cancelButton && cancelButton.addEventListener('click', doCancel);
        deleteButton && deleteButton.addEventListener('click', doDelete);

        // load all iframes before showing
        let preparedForShow = false;
        handleIFrame();

        dialog = {
            // dialog.id
            // dialog html element id
            id: dialogElement.id,

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

            // dialog.adjust()
            // adjust dialog to make the whole dialog visible
            adjust: adjust,

            // dialog.fixChromeBlur()
            // fix chrome blur
            fixChromeBlur: fixChromeBlur
        };

        dialogs.push(dialog);
        return dialog;

        function handleIFrame() {
            let iframes = dialogElement.querySelectorAll('iframe');

            if (iframes.length === 0) {
                preparedForShow = true;
                return;
            }

            let loadCount = 0;

            [].slice.call(iframes).forEach(function(iframe) {
                iframe.addEventListener('load', function listener(ev) {
                    iframe.removeEventListener('load', listener);
                    loadCount += 1;

                    if (loadCount === iframes.length) {
                        preparedForShow = true;
                    }
                })
            });
        }

        function show() {
            checkStatusAndShow();

            function checkStatusAndShow() {
                if (preparedForShow) {
                    options.beforeshow && options.beforeshow(callbackParam(dialogElement, dialog, overlayElement, event));
                    showMe();
                    options.aftershow && options.aftershow(callbackParam(dialogElement, dialog, overlayElement, event));
                } else {
                    // wait for preparedForShow
                    setTimeout(checkStatusAndShow, 0);
                }
            }

            function showMe() {
                // use setTimeout to enable css transition
                setTimeout(function() {
                    if (dialogElement.effect.perspective) {
                        perspectiveCounter++;

                        if (perspectiveCounter === 1) {
                            document.documentElement.classList.add('xd-perspective');
                        }
                    }

                    dialogElement.classList.add('xd-show');
                    overlayElement && overlayElement.classList.add('xd-show-overlay');

                    listenEscKey();
                }, 200);

                // NOTE: fix chrome blur
                if (options.fixChromeBlur) {
                    if (!dialogElement.effect.clazz) {
                        // dialogs without effect
                        fixChromeBlur();
                    } else {
                        dialogElement.addEventListener('transitionend', function listener(ev) {
                            if (ev.propertyName === 'transform') {
                                dialogElement.removeEventListener('transitionend', listener);

                                // dialogs with effect on transform end
                                fixChromeBlur();
                            }
                        });

                        // event transitionend not always reliable, so also use setTimeout
                        setTimeout(function() {
                            fixChromeBlur();
                        }, transitionTimeout);
                    }
                }
            }
        }

        function hide() {
            unlistenEscKey();
            restorePerspectiive();

            if (dialogElement.effect.perspective) {
                setTimeout(function() {
                    if (perspectiveCounter === 1) {
                        document.documentElement.classList.remove('xd-perspective');
                    }

                    perspectiveCounter--;
                }, transitionTimeout);
            }

            dialogElement.classList.remove('xd-show');
            overlayElement && overlayElement.classList.remove('xd-show-overlay');
        }

        function listenEscKey() {
            dialogElement.escKeyListener = function listener(ev) {
                if (ev.key !== 'Escape' && ev.key !== 'Esc') {
                    return;
                }

                let topMostDialogElement = document.querySelector('.xd-dialog.xd-show');

                if (topMostDialogElement === dialogElement) {
                    doCancel(ev);
                }
            };

            document.addEventListener('keyup', dialogElement.escKeyListener);
        }

        function unlistenEscKey() {
            document.removeEventListener('keyup', dialogElement.escKeyListener);
            dialogElement.escKeyListener = null;
        }

        function fixChromeBlur() {
            if (dialogElement.style.transform === 'none') {
                return;
            }

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
            if (options.onok && options.onok(callbackParam(dialogElement, dialog, overlayElement, e)) === false) {
                return;
            }

            close();
        }

        function doCancel(e) {
            if (options.oncancel && options.oncancel(callbackParam(dialogElement, dialog, overlayElement, e)) === false) {
                return;
            }

            close();
        }

        function doDelete(e) {
            if (options.ondelete && options.ondelete(callbackParam(dialogElement, dialog, overlayElement, e)) === false) {
                return;
            }

            close();
        }

        function destroy() {
            if (options.ondestroy && options.ondestroy(callbackParam(dialogElement, dialog, overlayElement, null)) === false) {
                return;
            }

            okButton && okButton.removeEventListener('click', doOk);
            cancelButton && cancelButton.removeEventListener('click', doCancel);
            deleteButton && deleteButton.removeEventListener('click', doDelete);

            setTimeout(function() {
                let index = dialogs.indexOf(dialog);

                if (index === -1) {
                    // user may call destroy() or click OK/Cancle/Delete button multi times
                    return;
                }

                dialogs.splice(index, 1);
                document.body.removeChild(dialogElement);
                overlayElement && document.body.removeChild(overlayElement);
            }, transitionTimeout);
        }

        function close() {
            hide();
            destroy();
        }

        function adjust() {
            let rect = dialogElement.getBoundingClientRect();
            let clientWidth = document.documentElement.clientWidth;
            let clientHeight = document.documentElement.clientHeight;

            if (rect.x >= 0 && rect.y >= 0 && rect.right <= clientWidth && rect.bottom <= clientHeight) {
                return;
            }

            dialogElement.style.transition = 'all .3s ease-in-out';

            if (rect.width > clientWidth) {
                dialogElement.style['max-width'] = clientWidth + 'px';
            }

            if (rect.height > clientHeight) {
                dialogElement.style['max-height'] = clientHeight + 'px';
            }

            let rect2 = dialogElement.getBoundingClientRect();

            dialogElement.style.left = (clientWidth - rect2.width) / 2 + 'px';
            dialogElement.style.top = (clientHeight - rect2.height) / 2 + 'px';

            dialogElement.addEventListener('transitionend', function listener() {
                dialogElement.removeEventListener('transitionend', listener);
                dialogElement.style.transition = '';
            });
        }
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

    function createSpin() {
        // create spin element
        let spinElement = document.createElement('div');
        let innerHTML = '';

        spinElement.classList.add('sk-fading-circle');

        for (let i = 1; i <= 12; i++) {
            innerHTML += '<div class="sk-circle sk-circle' + i + '"></div>';
        }

        spinElement.innerHTML = innerHTML;

        // create overley element
        let spinOverlayElement = createOverlay({
            zIndex: 2147483647
        });
        spinOverlayElement.classList.add('xd-spin-overlay');
        spinOverlayElement.classList.add('xd-center-child');
        spinOverlayElement.appendChild(spinElement);

        return spinOverlayElement;
    }

    function startSpin() {
        if (spinCount === 0) {
            spinOverlayElement.classList.add('xd-show-overlay');
        }

        spinCount++;
    }

    function stopSpin() {
        spinCount--;

        if (spinCount === 0) {
            spinOverlayElement.classList.remove('xd-show-overlay');
        }
    }

    /**
     * drag on srcElement to move destElement
     *
     * @param {Element} destElement - element to be moved
     * @param {Element} srcElement - element to drag on
     * @param {Function} onclick - callback function when user clicked
     *
     * SEE: https://www.w3schools.com/howto/howto_js_draggable.asp
     */
    function dragElement(destElement, srcElement, onclick) {
        // use destElement as srcElement if srcElement not supplied
        srcElement = srcElement || destElement;

        srcElement.addEventListener('mousedown', dragMouseDown);

        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        let mouseDownEvent = null;

        function isDraggableElement(element) {
            // do not start drag when click on inputs
            if (element instanceof HTMLInputElement) {
                return false;
            }

            // do not start drag when click on buttons and ...
            if (['BUTTON'].indexOf(element.tagName) >= 0) {
                return false;
            }

            return srcElement.contains(element);
        }

        function dragMouseDown(e) {
            mouseDownEvent = e;

            if (!isDraggableElement(e.target)) {
                return;
            }

            e.preventDefault();

            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;

            // call a function whenever the cursor moves:
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);

            // Temporarily disable mouse events for IFRAME for smooth dragging
            // SEE: https://www.gyrocode.com/articles/how-to-detect-mousemove-event-over-iframe-element/
            [].slice.call(srcElement.querySelectorAll('iframe')).forEach(function(iframe) {
                iframe.style['pointer-events'] = 'none';
            });
        }

        function elementDrag(e) {
            e.preventDefault();

            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // set the destElement's new position:
            destElement.style.top = (destElement.offsetTop - pos2) + 'px';
            destElement.style.left = (destElement.offsetLeft - pos1) + 'px';
        }

        function closeDragElement(e) {
            // trigger click when dragging a litter quickly
            if (Math.abs(e.clientX - mouseDownEvent.clientX) + Math.abs(e.clientY - mouseDownEvent.clientY) < dragAsClick.distance && e.timeStamp - mouseDownEvent.timeStamp < dragAsClick.timeout) {
                onclick && onclick(e);
            }

            // stop moving when mouse button is released:
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);

            // Re-enable mouse events for IFRAME
            [].slice.call(srcElement.querySelectorAll('iframe')).forEach(function(iframe) {
                iframe.style['pointer-events'] = 'auto';
            });
        }
    }
}();
