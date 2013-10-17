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

  var targetAttributes = normalize(targetAttributes)

  var startAttributes = getStart(element, targetAttributes)
  var endAttributes = getEnd(element, targetAttributes)

  var transition = Object.keys(endAttributes).map(function(key){
    return dasherize(key) + ' ' + time + 'ms'
  }).join(', ')

  if (Object.keys(endAttributes).length){
    set(element, startAttributes)
    process.nextTick(function(){
      element.style.transition = transition
      set(element, endAttributes)

      // using transitionend is unreliable - it only fires 
      // if a transition actually took place, so we'll use setTimeout

      setTimeout(function(){
        element.style.transition = null
        set(element, targetAttributes)
        cb&&cb()
      }, time)

    })
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
    if (currentStyle[key] && currentStyle[key]){
      result[key] = currentStyle[key]
    }
  })

  return result
}

function getEnd(element, targetAttributes){
  var currentStyle = window.getComputedStyle(element)
  var result = {}

  Object.keys(targetAttributes).forEach(function(key){
    var value = targetAttributes[key]
    if (targetAttributes[key] == 'auto') {
      value = getAuto(element, key)
    }
    if (value != currentStyle[key]){
      result[key] = value
    }
  })

  return result
}

function getAuto(element, property){
  var style = window.getComputedStyle(element)
  var borderBoxSizing = style['box-sizing'] == 'border-box'
  if (property == 'width'){
    var width = element.scrollWidth

    // handle full width div
    if (style['position'] == 'static' && style['display'] == 'block' && element.parentNode){
      var parentStyle = window.getComputedStyle(element.parentNode)
      if (parentStyle['box-sizing'] == 'border-box'){
        width = element.parentNode.scrollWidth
      } else {
        var extra = parsePx(parentStyle.borderLeftWidth) + 
          parsePx(parentStyle.borderRightWidth) + 
          parsePx(parentStyle.paddingLeft) + 
          parsePx(parentStyle.paddingRight)
        width = element.parentNode.scrollWidth - extra
      }
    }

    if (borderBoxSizing){
      return width + 'px'
    } else {
      var extra = parsePx(style.borderLeftWidth) + 
        parsePx(style.borderRightWidth) + 
        parsePx(style.paddingLeft) + 
        parsePx(style.paddingRight)
      return (width - extra) + 'px'
    }
  } else if (property == 'height'){
    var height = element.scrollHeight
    if (borderBoxSizing){
      return height + 'px'
    } else {
      var extra = parsePx(style.borderBottomWidth) + 
        parsePx(style.borderTopWidth) + 
        parsePx(style.paddingTop) + 
        parsePx(style.paddingBottom)
      return (height - extra) + 'px'
    }
  }
  return 'auto'
}

function normalize(attributes){
  var result = {}
  Object.keys(attributes).forEach(function(key){
    result[camelize(key)] = key
  })
  return result
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