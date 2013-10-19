module.exports = function(element, targetAttributes, time, easing, cb){
  if (typeof easing == 'function'){
    cb = easing
    easing = null
  }

  if (!('transition' in element.style)){
    // crappy fallback
    set(element, targetAttributes)
    return cb&&cb()
  }

  var targetAttributes = normalize(element, targetAttributes)

  var startAttributes = getStart(element, targetAttributes)
  var endAttributes = getEnd(element, startAttributes, targetAttributes)
  var finalAttributes = getFinal(element, endAttributes, targetAttributes)

  var transition = Object.keys(endAttributes).map(function(key){
    return dasherize(key) + ' ' + time + 'ms ' + (easing || '')
  }).join(', ')

  if (Object.keys(endAttributes).length){
    set(element, startAttributes)
    setTimeout(function(){
      element.style.transition = transition
      set(element, endAttributes)

      // using transitionend is unreliable - it only fires 
      // if a transition actually took place, so we'll use setTimeout

      setTimeout(function(){
        element.style.transition = null
        set(element, finalAttributes)
        cb&&cb()
      }, time)
    }, 15)


  } else {
    return cb&&cb()
  }

}

function set(element, attributes){
  Object.keys(attributes).forEach(function(key){
    element.style[key] = attributes[key]
  })
}

function getStart(element, targetAttributes){
  var currentStyle = window.getComputedStyle(element)
  var result = {}

  Object.keys(targetAttributes).forEach(function(key){
    result[key] = currentStyle[key]
  })

  // handle absolute position transition
  if (targetAttributes['position']){
    if (currentStyle['position'] != targetAttributes['position']){


      result['position'] = 'relative'
      result['top'] = '0'
      result['left'] = '0'
      result['right'] = 'auto'
      result['bottom'] = 'auto'
      result['width'] = currentStyle['width']
      result['height'] = currentStyle['height']

      if (currentStyle['position'] == 'fixed'){
        var offset = getDestinationOffset(element)
        result['top'] = (element.offsetTop + offset.top) + 'px'
        result['left'] = (element.offsetLeft + offset.left) + 'px'
      }

      if (targetAttributes['position'] == 'static'){
        result['marginBottom'] = (parsePx(currentStyle['marginBottom']) - element.offsetHeight) + 'px'
      } else if (currentStyle['position'] == 'static') {
        result['marginBottom'] = currentStyle['marginBottom']
      }
    }
  }

  return result
}

function getEnd(element, startAttributes, targetAttributes){

  var result = {}
  var originals = {}

  var offsetTop = element.offsetTop
  var offsetLeft = element.offsetLeft
  var originalPosition = window.getComputedStyle(element)['position']

  // simulate new attributes to resolve autos
  Object.keys(targetAttributes).forEach(function(key){
    originals[key] = element.style[key]
    element.style[key] = targetAttributes[key]
  })
  var targetStyle = window.getComputedStyle(element)
  Object.keys(targetAttributes).forEach(function(key){
    if (startAttributes[key] != targetStyle[key]){
      result[key] = targetStyle[key]
    }
  })


  // handle absolute position transition
  if (targetAttributes['position'] && startAttributes['position'] != targetAttributes['position']){
    result['position'] = 'relative'
    result['top'] = (element.offsetTop - offsetTop) + 'px'
    result['left'] = (element.offsetLeft - offsetLeft) + 'px'
    result['right'] = 'auto'
    result['bottom'] = 'auto'

    if (targetAttributes['position'] == 'static'){
      result['top'] = '0px'
      result['left'] = '0px'
      result['marginBottom'] = element.style['marginBottom']
    } else if (originalPosition == 'static' && !result['marginBottom']){
      result['marginBottom'] = (parsePx(startAttributes['marginBottom']) - element.offsetHeight) + 'px'
    } 
  }

  // revert attribute change
  Object.keys(originals).forEach(function(key){
    element.style[key] = originals[key]
  })

  return result
}

function getFinal(element, endAttributes, targetAttributes){
  var result = {}
  Object.keys(endAttributes).forEach(function(key){
    result[key] = element.style[key]
  })
  Object.keys(targetAttributes).forEach(function(key){
    result[key] = targetAttributes[key]
  })
  return result
}

function normalize(element, attributes){
  var result = {}
  Object.keys(attributes).forEach(function(key){
    result[camelize(key)] = attributes[key]
  })
  return result
}

function getOffset(element){
  var result = {
    top: 0,
    left: 0
  }

  while (element){
    result.top += element.offsetTop
    result.left += element.offsetLeft
    element = element.offsetParent
  }

  return result
}

function getDestinationOffset(element){
  var revert = element.style.position
  element.style.position = 'static'

  var parent = element.offsetParent
  var value = getOffset(element)

  element.style.position = revert
  return {
    top: -value.top + document.body.scrollTop,
    left: -value.left + document.body.scrollLeft
  }
}

function parsePx(px){
  return parseInt(px, 10) || 0
}

function camelize(str) {
  return str.replace(/[_.-](\w|$)/g, function (_,x) {
    return x.toUpperCase()
  })
}

function dasherize(str){
  return str.trim().replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
}