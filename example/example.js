var cssTransition = require('../')

var element1 = document.getElementById('element1')
element1.onclick = function(){
  cssTransition(element1, {
    height: '200px',
    width: '600px',
    backgroundColor: 'red'
  }, 400, function(){
    console.log('animation complete')
  })
}

var element2 = document.getElementById('element2')
element2.onclick = function(){
  cssTransition(element2, {
    height: 'auto',
    width: 'auto'
  }, 400, function(){
    console.log('animation complete')
  })
}

var element3 = document.getElementById('element3')
element3.onclick = function(){
  cssTransition(element3, {
    marginLeft: 'auto',
    marginRight: 'auto'
  }, 400, function(){
    console.log('animation complete')
  })
}

var element4 = document.getElementById('element4')
element4.onclick = function(){
  cssTransition(element4, {
    position: 'fixed',
    top: '300px',
    right: '200px'
  }, 400, function(){
    console.log('animation complete')
  })
}

var element5 = document.getElementById('element5')
element5.onclick = function(){
  cssTransition(element5, {
    position: 'static'
  }, 400, function(){
    console.log('animation complete')
  })
}

