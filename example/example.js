var cssTransition = require('../')

var element = document.getElementById('element')

element.onclick = function(){
  cssTransition(element, {
    height: '200px',
    width: '600px',
    backgroundColor: 'red'
  }, 200, function(){
    console.log('animation complete')
  })
}

