css-transition
===

Animate between DOM style changes using css transitions.

Also supports a few extra transitions not currently available in vanilla css such as **position** (`static` <-> `absolute`/`fixed`) and **auto** values (e.g. `height: auto`).

## Install

```bash
$ npm install css-transition
```

## Example

```html
<div id='element' style='padding:20px; background: silver; border: 1px solid gray'>
  Element with content
</div>
```

```js
var cssTransition = require('css-transition')
var element = document.getElementById('element')

cssTransition(element, {
  height: '200px',
  width: '600px',
  backgroundColor: 'red'
}, 400, function(){
  console.log('animation complete')
})
```

Run `npm run example` and navigate to `http://localhost:9966` to see it in action.