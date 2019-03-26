'use strict';

(function() {
    [].slice.call(document.querySelectorAll('.xd-trigger')).forEach(function(el) {
        el.addEventListener('click', function() {
            let effect = el.getAttribute('data-effect');
            let body = '\
            <p>This is a dialog. You can do the following things with it:</p>\
            <ul>\
                <li><strong>Read:</strong> dialogs will probably tell you something important so don\'t forget to read what they say.</li>\
                <li><strong>Look:</strong> a dialog enjoys a certain kind of attention; just look at it and appreciate its presence.</li>\
            </ul>';

            xdialog.open({
                title: el.textContent,
                body: body,
                effect: effect,
                onok: function() {
                    xdialog.alert('OK button pressed');
                    return false;
                }
            });
        });
    });

    [].slice.call(document.getElementsByClassName('button-demo')).forEach(function(el) {
        el.addEventListener('click', function() {
            eval(el.dataset.method + '()');
        });
    });

    [].slice.call(document.getElementsByClassName('button-demo-source')).forEach(function(el) {
        let method = el.dataset.method;

        // prepare source
        let source = eval(method).toString().split('\n').slice(1, -1);
        let spaceWidth = source[0].match(/^ */)[0].length;

        source = source.map(function(line) {
            return line.slice(spaceWidth);
        }).join('\n');

        el.addEventListener('click', function() {
            xdialog.open({
                title: method + ' source',
                body: '<pre><code class="js demo-source"></code></pre>',
                style: 'width: auto;',
                buttons: {
                    ok: {
                        text: 'copy',
                        clazz: 'xd-button xd-ok demo-copy-button'
                    },
                    run: '<button class="xd-button demo-button-run" style="background: #f44336;">run</button>',
                    cancel: 'cancel'
                },
                aftercreate: function(param) {
                    param.element.querySelector('.demo-button-run').addEventListener('click', function() {
                        eval(source);
                    });
                },
                beforeshow: function(param) {
                    let sourceElement = param.element.getElementsByClassName('demo-source')[0];
                    sourceElement.innerText = source;
                    hljs.highlightBlock(sourceElement);

                    new ClipboardJS('#' + param.id + ' .demo-copy-button', {
                        text: function() {
                            return source;
                        }
                    });
                }
            });
        });
    });

    function openDialogDemo1() {
        xdialog.open({
            title: 'Login Demo',
            body: '\
            <style>\
                .demo1-mb-1 { margin-bottom: 1em; }\
                .demo1-row { text-align: center; }\
                .demo1-row label { min-width: 6em; display: inline-block; }\
                .demo1-row input { padding: 0.3em; outline: none; min-width: 12em; }\
                .demo1-validated input { border: green 2px solid; }\
                .demo1-validated input:invalid { border: red 2px solid; }\
            </style>\
            <div id="demo1-form">\
                <div class="demo1-row demo1-mb-1"><label for="uname">User Name</label><input type="text" id="uname" required></div>\
                <div class="demo1-row"><label for="psw">Password</label><input type="password" id="psw" required></div>\
            </div>',
            buttons: { ok: 'Login', cancel: 'Cancel' },
            style: 'width: auto',
            effect: '3d_rotate_bottom',
            onok: function() {
                document.getElementById('demo1-form').classList.add('demo1-validated');

                let uname = document.getElementById('uname').value;
                let psw = document.getElementById('psw').value;

                if (!uname || !psw) {
                    return false;
                }

                xdialog.alert('Welcome, ' + uname);
            }
        });
    }

    function openDialogDemo2() {
        xdialog.startSpin();

        xdialog.open({
            title: '',
            body: '\
            <style>\
                .video-container { position:relative; padding-bottom:56.25%; height:0; overflow:hidden; }\
                .video-container iframe { position:absolute; top:0; left:0; width:100%; height:100%; }\
            </style>\
            <div style="width:560px">\
                <div class="video-container">\
                    <iframe\
                        src="https://www.youtube.com/embed/3NycM9lYdRI"\
                        frameborder="0"\
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"\
                        allowfullscreen>\
                    </iframe>\
                </div>\
            </div>',
            buttons: null,
            style: 'width: auto;',
            effect: 'slide_in_bottom',
            aftercreate: function(param) {
                param.element.querySelector('.xd-content .xd-body').style.padding = '0';

                let hintElement = document.createElement('div');
                hintElement.innerHTML = 'Click here to close dialog, drag here to move dialog';
                hintElement.setAttribute('style', 'position:fixed;bottom:0;left:0;right:0;color:white;font-size:3em;margin:2em;text-align:center;');
                param.overlay.appendChild(hintElement);
            },
            aftershow: function() {
                setTimeout(function() {
                    xdialog.stopSpin();
                }, 700);
            }
        });
    }

    function openDialogDemo3() {
        xdialog.open({
            title: 'callback parameters',
            body: 'open browser development console to view callback parameters',
            buttons: ['ok', 'delete', 'cancel'],
            beforecreate: function(param) {
                console.info('beforecreate', param);
            },
            aftercreate: function(param) {
                console.info('aftercreate', param);
            },
            beforeshow: function(param) {
                console.info('beforeshow', param);
            },
            aftershow: function(param) {
                console.info('aftershow', param);
            },
            onok: function(param) {
                console.info('onok', param);
            },
            oncancel: function(param) {
                console.info('oncancel', param);
            },
            ondelete: function(param) {
                console.info('ondelete', param);
            },
            ondestroy: function(param) {
                console.info('ondestroy', param);
            },
        });
    }

    function openDialogDemo4() {
        xdialog.open({
            title: 'inputs',
            body: '\
            <style>\
                .demo4-items {display:flex;flex-direction:column;align-items:center;}\
                .demo4-item {display:block;height:30px;width:80%;margin:3px;padding:1px;}\
            </style>\
            <div class="demo4-items">\
                <input class="demo4-item" type="button" value="Input Button">\
                <input class="demo4-item" type="checkbox">\
                <input class="demo4-item" type="file">\
                <input class="demo4-item" type="hidden">\
                <input class="demo4-item" type="image">\
                <input class="demo4-item" type="password">\
                <input class="demo4-item" type="radio">\
                <input class="demo4-item" type="reset">\
                <input class="demo4-item" type="submit">\
                <input class="demo4-item" type="text">\
                <select class="demo4-item">\
                    <option>Option</option>\
                </select>\
                <textarea class="demo4-item"></textarea>\
                <button class="demo4-item">Button</button>\
            </div>\
            <p>inputs, buttons, selects and textareas not allowed to be dragged on by default</p>',
            beforeshow: function(param) {
                [].slice.call(param.element.querySelectorAll('.xd-body *')).forEach(function(el) {
                    let border = false;

                    if (el instanceof HTMLInputElement) {
                        border = true;
                    }

                    if (['BUTTON', 'SELECT', 'TEXTAREA'].indexOf(el.tagName) >= 0) {
                        border = true;
                    }

                    if (border) {
                        el.style = 'border: 2px solid green;'
                    }
                });
            }
        });
    }

    document.getElementById('button-spin').addEventListener('click', function() {
        xdialog.startSpin();

        setTimeout(function() {
            xdialog.stopSpin();
        }, 5000);
    });
})();
