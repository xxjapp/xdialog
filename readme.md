# xdialog

Online demo is here [xdialog demo](https://xxjapp.github.io/xdialog/)

![preview.png](images/preview.png)

## Background

This javascript dialog library is based on [nifty-modal-window-effects](https://tympanus.net/codrops/2013/06/25/nifty-modal-window-effects/).

## Example

```js
let dialog1 = xdialog.open();
dialog1.close();

let dialog2 = xdialog.create({title: 'Hello dialog'});
dialog2.show();
dialog2.hide();
dialog2.destroy();
```

## Usage

### default options

```js
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
```

### xdialog API

```js
- xdialog.init(options)
// initialize xdialog

- xdialog.create(options)
// create a dialog

- xdialog.open(options)
// create a dialog and show it

- xdialog.alert(text, options)
// create an alert dialog and show it

- xdialog.confirm(text, onyes, options)
// create a confirm dialog and show it

- xdialog.dialogs()
// access all dialog instances
```

### xdialog API: utils

```js
- xdialog.startSpin()
// start spin animation

-  xdialog.stopSpin()
// stop spin animation
```

### dialog API

```js
- dialog.id
// dialog html element id

- dialog.element
// dialog html element

- dialog.show()
// show dialog

- dialog.hide()
// hide dialog

- dialog.destroy()
// destroy dialog

- dialog.close()
// hide dialog and destory it

- dialog.adjust()
// adjust dialog to make whole dialog visible

- dialog.fixChromeBlur()
// fix chrome blur
```
