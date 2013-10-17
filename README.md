css-transition
===

Animate between DOM style changes using css transitions.

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

Run `npm start example` and navigate to `http://localhost:9966` to see it in action.