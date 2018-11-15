(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var document = require('global/document')
var hyperx = require('hyperx')
var onload = require('on-load')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = {
  autofocus: 1,
  checked: 1,
  defaultchecked: 1,
  disabled: 1,
  formnovalidate: 1,
  indeterminate: 1,
  readonly: 1,
  required: 1,
  selected: 1,
  willvalidate: 1
}
var COMMENT_TAG = '!--'
var SVG_TAGS = [
  'svg',
  'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
  'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB',
  'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
  'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
  'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face',
  'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri',
  'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line',
  'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath',
  'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // If adding onload events
  if (props.onload || props.onunload) {
    var load = props.onload || function () {}
    var unload = props.onunload || function () {}
    onload(el, function belOnload () {
      load(el)
    }, function belOnunload () {
      unload(el)
    },
    // We have to use non-standard `caller` to find who invokes `belCreateElement`
    belCreateElement.caller.caller.caller)
    delete props.onload
    delete props.onunload
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS[key]) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  function appendChild (childs) {
    if (!Array.isArray(childs)) return
    for (var i = 0; i < childs.length; i++) {
      var node = childs[i]
      if (Array.isArray(node)) {
        appendChild(node)
        continue
      }

      if (typeof node === 'number' ||
        typeof node === 'boolean' ||
        typeof node === 'function' ||
        node instanceof Date ||
        node instanceof RegExp) {
        node = node.toString()
      }

      if (typeof node === 'string') {
        if (el.lastChild && el.lastChild.nodeName === '#text') {
          el.lastChild.nodeValue += node
          continue
        }
        node = document.createTextNode(node)
      }

      if (node && node.nodeType) {
        el.appendChild(node)
      }
    }
  }
  appendChild(children)

  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"global/document":3,"hyperx":6,"on-load":8}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"min-document":2}],4:[function(require,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],6:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)],[CLOSE])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var hasOwn = Object.prototype.hasOwnProperty
function has (obj, key) { return hasOwn.call(obj, key) }

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":5}],7:[function(require,module,exports){
assert.notEqual = notEqual
assert.notOk = notOk
assert.equal = equal
assert.ok = assert

module.exports = assert

function equal (a, b, m) {
  assert(a == b, m) // eslint-disable-line eqeqeq
}

function notEqual (a, b, m) {
  assert(a != b, m) // eslint-disable-line eqeqeq
}

function notOk (t, m) {
  assert(!t, m)
}

function assert (t, m) {
  if (!t) throw new Error(m || 'AssertionError')
}

},{}],8:[function(require,module,exports){
/* global MutationObserver */
var document = require('global/document')
var window = require('global/window')
var assert = require('assert')
var watch = Object.create(null)
var KEY_ID = 'onloadid' + (new Date() % 9e6).toString(36)
var KEY_ATTR = 'data-' + KEY_ID
var INDEX = 0

if (window && window.MutationObserver) {
  var observer = new MutationObserver(function (mutations) {
    if (Object.keys(watch).length < 1) return
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].attributeName === KEY_ATTR) {
        eachAttr(mutations[i], turnon, turnoff)
        continue
      }
      eachMutation(mutations[i].removedNodes, turnoff)
      eachMutation(mutations[i].addedNodes, turnon)
    }
  })
  if (document.body) {
    beginObserve(observer)
  } else {
    document.addEventListener('DOMContentLoaded', function (event) {
      beginObserve(observer)
    })
  }
}

function beginObserve (observer) {
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: [KEY_ATTR]
  })
}

module.exports = function onload (el, on, off, caller) {
  assert(document.body, 'on-load: will not work prior to DOMContentLoaded')
  on = on || function () {}
  off = off || function () {}
  el.setAttribute(KEY_ATTR, 'o' + INDEX)
  watch['o' + INDEX] = [on, off, 0, caller || onload.caller]
  INDEX += 1
  return el
}

module.exports.KEY_ATTR = KEY_ATTR
module.exports.KEY_ID = KEY_ID

function turnon (index, el) {
  if (watch[index][0] && watch[index][2] === 0) {
    watch[index][0](el)
    watch[index][2] = 1
  }
}

function turnoff (index, el) {
  if (watch[index][1] && watch[index][2] === 1) {
    watch[index][1](el)
    watch[index][2] = 0
  }
}

function eachAttr (mutation, on, off) {
  var newValue = mutation.target.getAttribute(KEY_ATTR)
  if (sameOrigin(mutation.oldValue, newValue)) {
    watch[newValue] = watch[mutation.oldValue]
    return
  }
  if (watch[mutation.oldValue]) {
    off(mutation.oldValue, mutation.target)
  }
  if (watch[newValue]) {
    on(newValue, mutation.target)
  }
}

function sameOrigin (oldValue, newValue) {
  if (!oldValue || !newValue) return false
  return watch[oldValue][3] === watch[newValue][3]
}

function eachMutation (nodes, fn) {
  var keys = Object.keys(watch)
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] && nodes[i].getAttribute && nodes[i].getAttribute(KEY_ATTR)) {
      var onloadid = nodes[i].getAttribute(KEY_ATTR)
      keys.forEach(function (k) {
        if (onloadid === k) {
          fn(k, nodes[i])
        }
      })
    }
    if (nodes[i].childNodes.length > 0) {
      eachMutation(nodes[i].childNodes, fn)
    }
  }
}

},{"assert":7,"global/document":3,"global/window":4}],9:[function(require,module,exports){
"use strict";

module.exports = {
    "trackerListLoc": "data/tracker_lists",
    "blockLists": ["trackersWithParentCompany.json"],
    "entityList": "https://s3.us-east-2.amazonaws.com/searchcdn/contentblocking.js",
    "entityMap": "data/tracker_lists/entityMap.json",
    "blocking": ["Advertising", "Analytics", "Social"],
    "requestListenerTypes": ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"],
    "trackersWhitelistTemporary": "https://s3.us-east-2.amazonaws.com/searchcdn/trackers-whitelist-temporary.txt",
    "trackersWhitelist": "https://s3.us-east-2.amazonaws.com/searchcdn/trackers-whitelist.txt",
    "surrogateList": "https://s3.us-east-2.amazonaws.com/searchcdn/surrogates.js",
    "feedbackUrl": "https://www.exploreos.com/feedback.js?type=extension-feedback",
    "tosdrMessages": {
        "A": "Good",
        "B": "Mixed",
        "C": "Bad",
        "D": "Bad",
        "E": "Bad",
        "good": "Good",
        "bad": "Bad",
        "unknown": "Unknown",
        "mixed": "Mixed"
    },
    "httpsMessages": {
        "secure": "Encrypted Connection",
        "upgraded": "Forced Encryption",
        "none": "Unencrypted Connection"
    },
    /**
     * Major tracking networks data:
     * percent of the top 1 million sites a tracking network has been seen on.
     * see: https://webtransparency.cs.princeton.edu/webcensus/
     */
    "majorTrackingNetworks": {
        "google": 84,
        "facebook": 36,
        "twitter": 16,
        "amazon": 14,
        "appnexus": 10,
        "oracle": 10,
        "mediamath": 9,
        "oath": 9,
        "maxcdn": 7,
        "automattic": 7
    },
    "httpsDBName": "https",
    "httpsLists": [{
        "type": "upgrade list",
        "name": "httpsUpgradeList",
        "url": "https://s3.us-east-2.amazonaws.com/searchcdn/https-bloom.json"
    }, {
        "type": "whitelist",
        "name": "httpsWhitelist",
        "url": "https://s3.us-east-2.amazonaws.com/searchcdn/https-whitelist.json"
    }],
    "httpsErrorCodes": {
        "net::ERR_CONNECTION_REFUSED": 1,
        "net::ERR_ABORTED": 2,
        "net::ERR_SSL_PROTOCOL_ERROR": 3,
        "net::ERR_SSL_VERSION_OR_CIPHER_MISMATCH": 4,
        "net::ERR_NAME_NOT_RESOLVED": 5,
        "NS_ERROR_CONNECTION_REFUSED": 6,
        "NS_ERROR_UNKNOWN_HOST": 7,
        "An additional policy constraint failed when validating this certificate.": 8,
        "Unable to communicate securely with peer: requested domain name does not match the server’s certificate.": 9,
        "Cannot communicate securely with peer: no common encryption algorithm(s).": 10,
        "SSL received a record that exceeded the maximum permissible length.": 11,
        "The certificate is not trusted because it is self-signed.": 12,
        "downgrade_redirect_loop": 13
    }
};

},{}],10:[function(require,module,exports){
'use strict';

module.exports = function (uaString) {
    if (!uaString) uaString = window.navigator.userAgent;

    var browser = void 0;
    var version = void 0;

    try {
        var parsedUaParts = uaString.match(/(Firefox|Chrome|Safari)\/([0-9]+)/);
        browser = parsedUaParts[1];
        version = parsedUaParts[2];

        // in Safari, the bit immediately after Safari/ is the Webkit version
        // the *actual* version number is elsewhere
        if (browser === 'Safari') {
            version = uaString.match(/Version\/(\d+)/)[1];
        }
    } catch (e) {
        // unlikely, prevent extension from exploding if we don't recognize the UA
        browser = version = '';
    }

    return {
        browser: browser,
        version: version
    };
};

},{}],11:[function(require,module,exports){
'use strict';

var Parent = window.DDG.base.Model;
var constants = require('../../../data/constants');

function FeedbackForm(attrs) {
    var _this = this;

    attrs = attrs || {};
    attrs.isBrokenSite = attrs.isBrokenSite || false;
    attrs.url = attrs.url || '';
    attrs.message = attrs.message || '';
    attrs.canSubmit = false;
    attrs.submitted = false;

    attrs.browser = attrs.browser || '';
    attrs.browserVersion = attrs.browserVersion || '';

    Parent.call(this, attrs);

    this.updateCanSubmit();

    // grab atb value from background process
    this.fetch({ getSetting: { name: 'atb' } }).then(function (atb) {
        _this.atb = atb;
    });
    this.fetch({ getExtensionVersion: true }).then(function (extensionVersion) {
        _this.extensionVersion = extensionVersion;
    });
}

FeedbackForm.prototype = window.$.extend({}, Parent.prototype, {
    modelName: 'feedbackForm',

    submit: function submit() {
        var _this2 = this;

        if (!this.canSubmit || this._submitting) {
            return;
        }

        this._submitting = true;

        window.$.ajax(constants.feedbackUrl, {
            method: 'POST',
            data: {
                reason: this.isBrokenSite ? 'broken_site' : 'general',
                url: this.url || '',
                comment: this.message || '',
                browser: this.browser || '',
                browser_version: this.browserVersion || '',
                v: this.extensionVersion || '',
                atb: this.atb || ''
            },
            success: function success(data) {
                if (data && data.status === 'success') {
                    _this2.set('submitted', true);
                } else {
                    _this2.set('errored', true);
                }
            },
            error: function error() {
                _this2.set('errored', true);
            }
        });
    },

    toggleBrokenSite: function toggleBrokenSite(val) {
        this.set('isBrokenSite', val);
        this.updateCanSubmit();
        this.reset();
    },

    updateCanSubmit: function updateCanSubmit() {
        if (this.isBrokenSite) {
            this.set('canSubmit', !!(this.url && this.message));
        } else {
            this.set('canSubmit', !!this.message);
        }
    },

    reset: function reset() {
        this.set('url', '');
        this.set('message', '');
        this.set('canSubmit', false);
    }
});

module.exports = FeedbackForm;

},{"../../../data/constants":9}],12:[function(require,module,exports){
'use strict';

var Parent = window.DDG.base.Page;
var mixins = require('./mixins/index.es6');
var parseUserAgentString = require('../../shared-utils/parse-user-agent-string.es6.js');
var FeedbackFormView = require('../views/feedback-form.es6');
var FeedbackFormModel = require('../models/feedback-form.es6');

function Feedback(ops) {
    Parent.call(this, ops);
}

Feedback.prototype = window.$.extend({}, Parent.prototype, mixins.setBrowserClassOnBodyTag, mixins.parseQueryString, {

    pageName: 'feedback',

    ready: function ready() {
        Parent.prototype.ready.call(this);
        this.setBrowserClassOnBodyTag();

        var params = this.parseQueryString(window.location.search);
        var browserInfo = parseUserAgentString();

        this.form = new FeedbackFormView({
            appendTo: window.$('.js-feedback-form'),
            model: new FeedbackFormModel({
                isBrokenSite: params.broken,
                url: decodeURIComponent(params.url || ''),
                browser: browserInfo.browser,
                browserVersion: browserInfo.version
            })
        });
    }
});

// kickoff!
window.DDG = window.DDG || {};
window.DDG.page = new Feedback();

},{"../../shared-utils/parse-user-agent-string.es6.js":10,"../models/feedback-form.es6":11,"../views/feedback-form.es6":17,"./mixins/index.es6":13}],13:[function(require,module,exports){
'use strict';

module.exports = {
    setBrowserClassOnBodyTag: require('./safari-set-browser-class.es6.js'),
    parseQueryString: require('./parse-query-string.es6.js')
};

},{"./parse-query-string.es6.js":14,"./safari-set-browser-class.es6.js":15}],14:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

module.exports = {
    parseQueryString: function parseQueryString(qs) {
        if (typeof qs !== 'string') {
            throw new Error('tried to parse a non-string query string');
        }

        var parsed = {};

        if (qs[0] === '?') {
            qs = qs.substr(1);
        }

        var parts = qs.split('&');

        parts.forEach(function (part) {
            var _part$split = part.split('='),
                _part$split2 = _slicedToArray(_part$split, 2),
                key = _part$split2[0],
                val = _part$split2[1];

            if (key && val) {
                parsed[key] = val;
            }
        });

        return parsed;
    }
};

},{}],15:[function(require,module,exports){
'use strict';

module.exports = {
    setBrowserClassOnBodyTag: function setBrowserClassOnBodyTag() {
        var browserClass = 'is-browser--' + 'safari';
        window.$('html').addClass(browserClass);
        window.$('body').addClass(browserClass);
    }
};

},{}],16:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['<div>\n            <label class=\'frm__label\'>Which website is broken?</label>\n            <input class=\'js-feedback-url frm__input\' type=\'text\' placeholder=\'Copy and paste your URL\' value=\'', '\'/>\n            <label class=\'frm__label\'>Describe the issue you encountered:</label>\n            <textarea class=\'frm__text js-feedback-message\' placeholder=\'Which website content or functionality is broken? Please be as specific as possible.\'></textarea>\n        </div>'], ['<div>\n            <label class=\'frm__label\'>Which website is broken?</label>\n            <input class=\'js-feedback-url frm__input\' type=\'text\' placeholder=\'Copy and paste your URL\' value=\'', '\'/>\n            <label class=\'frm__label\'>Describe the issue you encountered:</label>\n            <textarea class=\'frm__text js-feedback-message\' placeholder=\'Which website content or functionality is broken? Please be as specific as possible.\'></textarea>\n        </div>']),
    _templateObject2 = _taggedTemplateLiteral(['<div>\n            <label class=\'frm__label\'>What do you love? What isn\'t working? How could the extension be improved?</label>\n            <textarea class=\'frm__text js-feedback-message\' placeholder=\'Which features or functionality does your feedback refer to? Please be as specific as possible.\'></textarea>\n        </div>'], ['<div>\n            <label class=\'frm__label\'>What do you love? What isn\'t working? How could the extension be improved?</label>\n            <textarea class=\'frm__text js-feedback-message\' placeholder=\'Which features or functionality does your feedback refer to? Please be as specific as possible.\'></textarea>\n        </div>']),
    _templateObject3 = _taggedTemplateLiteral(['<form class=\'frm\'>\n        <p>Anonymously share some feedback to help us improve ExploreOS Search.</p>\n        <label class=\'frm__label\'>\n            <input type=\'checkbox\' class=\'js-feedback-broken-site frm__label__chk\'\n                ', '/>\n            I want to report a broken site\n        </label>\n        ', '\n        <input class=\'btn js-feedback-submit ', '\'\n            type=\'submit\' value=\'Submit\' ', '/>\n    </form>'], ['<form class=\'frm\'>\n        <p>Anonymously share some feedback to help us improve ExploreOS Search.</p>\n        <label class=\'frm__label\'>\n            <input type=\'checkbox\' class=\'js-feedback-broken-site frm__label__chk\'\n                ', '/>\n            I want to report a broken site\n        </label>\n        ', '\n        <input class=\'btn js-feedback-submit ', '\'\n            type=\'submit\' value=\'Submit\' ', '/>\n    </form>']),
    _templateObject4 = _taggedTemplateLiteral(['<div>\n            <p>Thank you for your feedback!</p>\n            <p>Your broken site reports help our development team fix these breakages.</p>\n            <p>To fix the issue for the time being, you can turn off "Privacy Protection" to add the site to the extension whitelist.</p>\n        </div>'], ['<div>\n            <p>Thank you for your feedback!</p>\n            <p>Your broken site reports help our development team fix these breakages.</p>\n            <p>To fix the issue for the time being, you can turn off "Privacy Protection" to add the site to the extension whitelist.</p>\n        </div>']),
    _templateObject5 = _taggedTemplateLiteral(['<p>Thank you for your feedback!</p>'], ['<p>Thank you for your feedback!</p>']),
    _templateObject6 = _taggedTemplateLiteral(['<p>Something went wrong when submitting feedback. Please try again later!</p>'], ['<p>Something went wrong when submitting feedback. Please try again later!</p>']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function () {
    var fields = void 0;

    if (this.model.errored) {
        return showError();
    }

    if (this.model.submitted) {
        return showThankYou(this.model.isBrokenSite);
    }

    if (this.model.isBrokenSite) {
        fields = bel(_templateObject, this.model.url);
    } else {
        fields = bel(_templateObject2);
    }

    return bel(_templateObject3, this.model.isBrokenSite ? 'checked' : '', fields, this.model.canSubmit ? '' : 'is-disabled', this.model.canSubmit ? '' : 'disabled');
};

function showThankYou(isBrokenSite) {
    if (isBrokenSite) {
        return bel(_templateObject4);
    } else {
        return bel(_templateObject5);
    }
}

function showError() {
    return bel(_templateObject6);
}

},{"bel":1}],17:[function(require,module,exports){
'use strict';

var Parent = window.DDG.base.View;
var feedbackFormTemplate = require('../templates/feedback-form.es6');

function FeedbackForm(ops) {
    this.model = ops.model;
    this.template = feedbackFormTemplate;

    Parent.call(this, ops);

    this._setup();
}

FeedbackForm.prototype = window.$.extend({}, Parent.prototype, {
    _setup: function _setup() {
        this._cacheElems('.js-feedback', ['url', 'message', 'broken-site', 'submit']);

        this.bindEvents([[this.store.subscribe, 'change:feedbackForm', this._onModelChange], [this.$url, 'input', this._onUrlChange], [this.$message, 'input', this._onMessageChange], [this.$brokensite, 'change', this._onBrokenSiteChange], [this.$submit, 'click', this._onSubmitClick]]);
    },

    _onModelChange: function _onModelChange(e) {
        if (e.change.attribute === 'isBrokenSite' || e.change.attribute === 'submitted' || e.change.attribute === 'errored') {
            this.unbindEvents();
            this._rerender();
            this._setup();
        } else if (e.change.attribute === 'canSubmit') {
            this.$submit.toggleClass('is-disabled', !this.model.canSubmit);
            this.$submit.attr('disabled', !this.model.canSubmit);
        }
    },

    _onBrokenSiteChange: function _onBrokenSiteChange(e) {
        this.model.toggleBrokenSite(e.target.checked);
    },

    _onUrlChange: function _onUrlChange() {
        this.model.set('url', this.$url.val());
        this.model.updateCanSubmit();
    },

    _onMessageChange: function _onMessageChange() {
        this.model.set('message', this.$message.val());
        this.model.updateCanSubmit();
    },

    _onSubmitClick: function _onSubmitClick(e) {
        e.preventDefault();

        if (!this.model.canSubmit) {
            return;
        }

        this.model.submit();

        this.$submit.addClass('is-disabled');
        this.$submit.val('Sending...');
    }
});

module.exports = FeedbackForm;

},{"../templates/feedback-form.es6":16}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmVsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcmVzb2x2ZS9lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9nbG9iYWwvZG9jdW1lbnQuanMiLCJub2RlX21vZHVsZXMvZ2xvYmFsL3dpbmRvdy5qcyIsIm5vZGVfbW9kdWxlcy9oeXBlcnNjcmlwdC1hdHRyaWJ1dGUtdG8tcHJvcGVydHkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaHlwZXJ4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL25hbm9hc3NlcnQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb24tbG9hZC9pbmRleC5qcyIsInNoYXJlZC9kYXRhL2NvbnN0YW50cy5qcyIsInNoYXJlZC9qcy9zaGFyZWQtdXRpbHMvcGFyc2UtdXNlci1hZ2VudC1zdHJpbmcuZXM2LmpzIiwic2hhcmVkL2pzL3VpL21vZGVscy9mZWVkYmFjay1mb3JtLmVzNi5qcyIsInNoYXJlZC9qcy91aS9wYWdlcy9mZWVkYmFjay5lczYuanMiLCJzaGFyZWQvanMvdWkvcGFnZXMvbWl4aW5zL2luZGV4LmVzNi5qcyIsInNoYXJlZC9qcy91aS9wYWdlcy9taXhpbnMvcGFyc2UtcXVlcnktc3RyaW5nLmVzNi5qcyIsInNoYXJlZC9qcy91aS9wYWdlcy9taXhpbnMvc2FmYXJpLXNldC1icm93c2VyLWNsYXNzLmVzNi5qcyIsInNoYXJlZC9qcy91aS90ZW1wbGF0ZXMvZmVlZGJhY2stZm9ybS5lczYuanMiLCJzaGFyZWQvanMvdWkvdmlld3MvZmVlZGJhY2stZm9ybS5lczYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SkE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0EsaUJBQUssTUFBTDtBQUNILFNBTkQsTUFNTyxJQUFJLEVBQUUsTUFBRixDQUFTLFNBQVQsS0FBdUIsV0FBM0IsRUFBd0M7QUFDM0MsaUJBQUssT0FBTCxDQUFhLFdBQWIsQ0FBeUIsYUFBekIsRUFBd0MsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxTQUFwRDtBQUNBLGlCQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLFVBQWxCLEVBQThCLENBQUMsS0FBSyxLQUFMLENBQVcsU0FBMUM7QUFDSDtBQUNKLEtBN0JMOztBQStCSSx5QkFBcUIsNkJBQVUsQ0FBVixFQUFhO0FBQzlCLGFBQUssS0FBTCxDQUFXLGdCQUFYLENBQTRCLEVBQUUsTUFBRixDQUFTLE9BQXJDO0FBQ0gsS0FqQ0w7O0FBbUNJLGtCQUFjLHdCQUFZO0FBQ3RCLGFBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxLQUFmLEVBQXNCLEtBQUssSUFBTCxDQUFVLEdBQVYsRUFBdEI7QUFDQSxhQUFLLEtBQUwsQ0FBVyxlQUFYO0FBQ0gsS0F0Q0w7O0FBd0NJLHNCQUFrQiw0QkFBWTtBQUMxQixhQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsU0FBZixFQUEwQixLQUFLLFFBQUwsQ0FBYyxHQUFkLEVBQTFCO0FBQ0EsYUFBSyxLQUFMLENBQVcsZUFBWDtBQUNILEtBM0NMOztBQTZDSSxvQkFBZ0Isd0JBQVUsQ0FBVixFQUFhO0FBQ3pCLFVBQUUsY0FBRjs7QUFFQSxZQUFJLENBQUMsS0FBSyxLQUFMLENBQVcsU0FBaEIsRUFBMkI7QUFBRTtBQUFROztBQUVyQyxhQUFLLEtBQUwsQ0FBVyxNQUFYOztBQUVBLGFBQUssT0FBTCxDQUFhLFFBQWIsQ0FBc0IsYUFBdEI7QUFDQSxhQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLFlBQWpCO0FBQ0g7QUF0REwsQ0FGcUIsQ0FBekI7O0FBNERBLE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJ2dsb2JhbC9kb2N1bWVudCcpXG52YXIgaHlwZXJ4ID0gcmVxdWlyZSgnaHlwZXJ4JylcbnZhciBvbmxvYWQgPSByZXF1aXJlKCdvbi1sb2FkJylcblxudmFyIFNWR05TID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJ1xudmFyIFhMSU5LTlMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaydcblxudmFyIEJPT0xfUFJPUFMgPSB7XG4gIGF1dG9mb2N1czogMSxcbiAgY2hlY2tlZDogMSxcbiAgZGVmYXVsdGNoZWNrZWQ6IDEsXG4gIGRpc2FibGVkOiAxLFxuICBmb3Jtbm92YWxpZGF0ZTogMSxcbiAgaW5kZXRlcm1pbmF0ZTogMSxcbiAgcmVhZG9ubHk6IDEsXG4gIHJlcXVpcmVkOiAxLFxuICBzZWxlY3RlZDogMSxcbiAgd2lsbHZhbGlkYXRlOiAxXG59XG52YXIgQ09NTUVOVF9UQUcgPSAnIS0tJ1xudmFyIFNWR19UQUdTID0gW1xuICAnc3ZnJyxcbiAgJ2FsdEdseXBoJywgJ2FsdEdseXBoRGVmJywgJ2FsdEdseXBoSXRlbScsICdhbmltYXRlJywgJ2FuaW1hdGVDb2xvcicsXG4gICdhbmltYXRlTW90aW9uJywgJ2FuaW1hdGVUcmFuc2Zvcm0nLCAnY2lyY2xlJywgJ2NsaXBQYXRoJywgJ2NvbG9yLXByb2ZpbGUnLFxuICAnY3Vyc29yJywgJ2RlZnMnLCAnZGVzYycsICdlbGxpcHNlJywgJ2ZlQmxlbmQnLCAnZmVDb2xvck1hdHJpeCcsXG4gICdmZUNvbXBvbmVudFRyYW5zZmVyJywgJ2ZlQ29tcG9zaXRlJywgJ2ZlQ29udm9sdmVNYXRyaXgnLCAnZmVEaWZmdXNlTGlnaHRpbmcnLFxuICAnZmVEaXNwbGFjZW1lbnRNYXAnLCAnZmVEaXN0YW50TGlnaHQnLCAnZmVGbG9vZCcsICdmZUZ1bmNBJywgJ2ZlRnVuY0InLFxuICAnZmVGdW5jRycsICdmZUZ1bmNSJywgJ2ZlR2F1c3NpYW5CbHVyJywgJ2ZlSW1hZ2UnLCAnZmVNZXJnZScsICdmZU1lcmdlTm9kZScsXG4gICdmZU1vcnBob2xvZ3knLCAnZmVPZmZzZXQnLCAnZmVQb2ludExpZ2h0JywgJ2ZlU3BlY3VsYXJMaWdodGluZycsXG4gICdmZVNwb3RMaWdodCcsICdmZVRpbGUnLCAnZmVUdXJidWxlbmNlJywgJ2ZpbHRlcicsICdmb250JywgJ2ZvbnQtZmFjZScsXG4gICdmb250LWZhY2UtZm9ybWF0JywgJ2ZvbnQtZmFjZS1uYW1lJywgJ2ZvbnQtZmFjZS1zcmMnLCAnZm9udC1mYWNlLXVyaScsXG4gICdmb3JlaWduT2JqZWN0JywgJ2cnLCAnZ2x5cGgnLCAnZ2x5cGhSZWYnLCAnaGtlcm4nLCAnaW1hZ2UnLCAnbGluZScsXG4gICdsaW5lYXJHcmFkaWVudCcsICdtYXJrZXInLCAnbWFzaycsICdtZXRhZGF0YScsICdtaXNzaW5nLWdseXBoJywgJ21wYXRoJyxcbiAgJ3BhdGgnLCAncGF0dGVybicsICdwb2x5Z29uJywgJ3BvbHlsaW5lJywgJ3JhZGlhbEdyYWRpZW50JywgJ3JlY3QnLFxuICAnc2V0JywgJ3N0b3AnLCAnc3dpdGNoJywgJ3N5bWJvbCcsICd0ZXh0JywgJ3RleHRQYXRoJywgJ3RpdGxlJywgJ3RyZWYnLFxuICAndHNwYW4nLCAndXNlJywgJ3ZpZXcnLCAndmtlcm4nXG5dXG5cbmZ1bmN0aW9uIGJlbENyZWF0ZUVsZW1lbnQgKHRhZywgcHJvcHMsIGNoaWxkcmVuKSB7XG4gIHZhciBlbFxuXG4gIC8vIElmIGFuIHN2ZyB0YWcsIGl0IG5lZWRzIGEgbmFtZXNwYWNlXG4gIGlmIChTVkdfVEFHUy5pbmRleE9mKHRhZykgIT09IC0xKSB7XG4gICAgcHJvcHMubmFtZXNwYWNlID0gU1ZHTlNcbiAgfVxuXG4gIC8vIElmIHdlIGFyZSB1c2luZyBhIG5hbWVzcGFjZVxuICB2YXIgbnMgPSBmYWxzZVxuICBpZiAocHJvcHMubmFtZXNwYWNlKSB7XG4gICAgbnMgPSBwcm9wcy5uYW1lc3BhY2VcbiAgICBkZWxldGUgcHJvcHMubmFtZXNwYWNlXG4gIH1cblxuICAvLyBDcmVhdGUgdGhlIGVsZW1lbnRcbiAgaWYgKG5zKSB7XG4gICAgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZylcbiAgfSBlbHNlIGlmICh0YWcgPT09IENPTU1FTlRfVEFHKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQocHJvcHMuY29tbWVudClcbiAgfSBlbHNlIHtcbiAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKVxuICB9XG5cbiAgLy8gSWYgYWRkaW5nIG9ubG9hZCBldmVudHNcbiAgaWYgKHByb3BzLm9ubG9hZCB8fCBwcm9wcy5vbnVubG9hZCkge1xuICAgIHZhciBsb2FkID0gcHJvcHMub25sb2FkIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgdmFyIHVubG9hZCA9IHByb3BzLm9udW5sb2FkIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgb25sb2FkKGVsLCBmdW5jdGlvbiBiZWxPbmxvYWQgKCkge1xuICAgICAgbG9hZChlbClcbiAgICB9LCBmdW5jdGlvbiBiZWxPbnVubG9hZCAoKSB7XG4gICAgICB1bmxvYWQoZWwpXG4gICAgfSxcbiAgICAvLyBXZSBoYXZlIHRvIHVzZSBub24tc3RhbmRhcmQgYGNhbGxlcmAgdG8gZmluZCB3aG8gaW52b2tlcyBgYmVsQ3JlYXRlRWxlbWVudGBcbiAgICBiZWxDcmVhdGVFbGVtZW50LmNhbGxlci5jYWxsZXIuY2FsbGVyKVxuICAgIGRlbGV0ZSBwcm9wcy5vbmxvYWRcbiAgICBkZWxldGUgcHJvcHMub251bmxvYWRcbiAgfVxuXG4gIC8vIENyZWF0ZSB0aGUgcHJvcGVydGllc1xuICBmb3IgKHZhciBwIGluIHByb3BzKSB7XG4gICAgaWYgKHByb3BzLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICB2YXIga2V5ID0gcC50b0xvd2VyQ2FzZSgpXG4gICAgICB2YXIgdmFsID0gcHJvcHNbcF1cbiAgICAgIC8vIE5vcm1hbGl6ZSBjbGFzc05hbWVcbiAgICAgIGlmIChrZXkgPT09ICdjbGFzc25hbWUnKSB7XG4gICAgICAgIGtleSA9ICdjbGFzcydcbiAgICAgICAgcCA9ICdjbGFzcydcbiAgICAgIH1cbiAgICAgIC8vIFRoZSBmb3IgYXR0cmlidXRlIGdldHMgdHJhbnNmb3JtZWQgdG8gaHRtbEZvciwgYnV0IHdlIGp1c3Qgc2V0IGFzIGZvclxuICAgICAgaWYgKHAgPT09ICdodG1sRm9yJykge1xuICAgICAgICBwID0gJ2ZvcidcbiAgICAgIH1cbiAgICAgIC8vIElmIGEgcHJvcGVydHkgaXMgYm9vbGVhbiwgc2V0IGl0c2VsZiB0byB0aGUga2V5XG4gICAgICBpZiAoQk9PTF9QUk9QU1trZXldKSB7XG4gICAgICAgIGlmICh2YWwgPT09ICd0cnVlJykgdmFsID0ga2V5XG4gICAgICAgIGVsc2UgaWYgKHZhbCA9PT0gJ2ZhbHNlJykgY29udGludWVcbiAgICAgIH1cbiAgICAgIC8vIElmIGEgcHJvcGVydHkgcHJlZmVycyBiZWluZyBzZXQgZGlyZWN0bHkgdnMgc2V0QXR0cmlidXRlXG4gICAgICBpZiAoa2V5LnNsaWNlKDAsIDIpID09PSAnb24nKSB7XG4gICAgICAgIGVsW3BdID0gdmFsXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobnMpIHtcbiAgICAgICAgICBpZiAocCA9PT0gJ3hsaW5rOmhyZWYnKSB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGVOUyhYTElOS05TLCBwLCB2YWwpXG4gICAgICAgICAgfSBlbHNlIGlmICgvXnhtbG5zKCR8OikvaS50ZXN0KHApKSB7XG4gICAgICAgICAgICAvLyBza2lwIHhtbG5zIGRlZmluaXRpb25zXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsIHAsIHZhbClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwuc2V0QXR0cmlidXRlKHAsIHZhbClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFwcGVuZENoaWxkIChjaGlsZHMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoY2hpbGRzKSkgcmV0dXJuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gY2hpbGRzW2ldXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgICAgICBhcHBlbmRDaGlsZChub2RlKVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdudW1iZXInIHx8XG4gICAgICAgIHR5cGVvZiBub2RlID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgdHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicgfHxcbiAgICAgICAgbm9kZSBpbnN0YW5jZW9mIERhdGUgfHxcbiAgICAgICAgbm9kZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICBub2RlID0gbm9kZS50b1N0cmluZygpXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKGVsLmxhc3RDaGlsZCAmJiBlbC5sYXN0Q2hpbGQubm9kZU5hbWUgPT09ICcjdGV4dCcpIHtcbiAgICAgICAgICBlbC5sYXN0Q2hpbGQubm9kZVZhbHVlICs9IG5vZGVcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICAgIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShub2RlKVxuICAgICAgfVxuXG4gICAgICBpZiAobm9kZSAmJiBub2RlLm5vZGVUeXBlKSB7XG4gICAgICAgIGVsLmFwcGVuZENoaWxkKG5vZGUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGFwcGVuZENoaWxkKGNoaWxkcmVuKVxuXG4gIHJldHVybiBlbFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGh5cGVyeChiZWxDcmVhdGVFbGVtZW50LCB7Y29tbWVudHM6IHRydWV9KVxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IG1vZHVsZS5leHBvcnRzXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVFbGVtZW50ID0gYmVsQ3JlYXRlRWxlbWVudFxuIiwiIiwidmFyIHRvcExldmVsID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOlxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDoge31cbnZhciBtaW5Eb2MgPSByZXF1aXJlKCdtaW4tZG9jdW1lbnQnKTtcblxudmFyIGRvY2N5O1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGRvY2N5ID0gZG9jdW1lbnQ7XG59IGVsc2Uge1xuICAgIGRvY2N5ID0gdG9wTGV2ZWxbJ19fR0xPQkFMX0RPQ1VNRU5UX0NBQ0hFQDQnXTtcblxuICAgIGlmICghZG9jY3kpIHtcbiAgICAgICAgZG9jY3kgPSB0b3BMZXZlbFsnX19HTE9CQUxfRE9DVU1FTlRfQ0FDSEVANCddID0gbWluRG9jO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb2NjeTtcbiIsInZhciB3aW47XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luID0gZ2xvYmFsO1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgd2luID0gc2VsZjtcbn0gZWxzZSB7XG4gICAgd2luID0ge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2luO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBhdHRyaWJ1dGVUb1Byb3BlcnR5XG5cbnZhciB0cmFuc2Zvcm0gPSB7XG4gICdjbGFzcyc6ICdjbGFzc05hbWUnLFxuICAnZm9yJzogJ2h0bWxGb3InLFxuICAnaHR0cC1lcXVpdic6ICdodHRwRXF1aXYnXG59XG5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHkgKGgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0YWdOYW1lLCBhdHRycywgY2hpbGRyZW4pIHtcbiAgICBmb3IgKHZhciBhdHRyIGluIGF0dHJzKSB7XG4gICAgICBpZiAoYXR0ciBpbiB0cmFuc2Zvcm0pIHtcbiAgICAgICAgYXR0cnNbdHJhbnNmb3JtW2F0dHJdXSA9IGF0dHJzW2F0dHJdXG4gICAgICAgIGRlbGV0ZSBhdHRyc1thdHRyXVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaCh0YWdOYW1lLCBhdHRycywgY2hpbGRyZW4pXG4gIH1cbn1cbiIsInZhciBhdHRyVG9Qcm9wID0gcmVxdWlyZSgnaHlwZXJzY3JpcHQtYXR0cmlidXRlLXRvLXByb3BlcnR5JylcblxudmFyIFZBUiA9IDAsIFRFWFQgPSAxLCBPUEVOID0gMiwgQ0xPU0UgPSAzLCBBVFRSID0gNFxudmFyIEFUVFJfS0VZID0gNSwgQVRUUl9LRVlfVyA9IDZcbnZhciBBVFRSX1ZBTFVFX1cgPSA3LCBBVFRSX1ZBTFVFID0gOFxudmFyIEFUVFJfVkFMVUVfU1EgPSA5LCBBVFRSX1ZBTFVFX0RRID0gMTBcbnZhciBBVFRSX0VRID0gMTEsIEFUVFJfQlJFQUsgPSAxMlxudmFyIENPTU1FTlQgPSAxM1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChoLCBvcHRzKSB7XG4gIGlmICghb3B0cykgb3B0cyA9IHt9XG4gIHZhciBjb25jYXQgPSBvcHRzLmNvbmNhdCB8fCBmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBTdHJpbmcoYSkgKyBTdHJpbmcoYilcbiAgfVxuICBpZiAob3B0cy5hdHRyVG9Qcm9wICE9PSBmYWxzZSkge1xuICAgIGggPSBhdHRyVG9Qcm9wKGgpXG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKHN0cmluZ3MpIHtcbiAgICB2YXIgc3RhdGUgPSBURVhULCByZWcgPSAnJ1xuICAgIHZhciBhcmdsZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgdmFyIHBhcnRzID0gW11cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGkgPCBhcmdsZW4gLSAxKSB7XG4gICAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaSsxXVxuICAgICAgICB2YXIgcCA9IHBhcnNlKHN0cmluZ3NbaV0pXG4gICAgICAgIHZhciB4c3RhdGUgPSBzdGF0ZVxuICAgICAgICBpZiAoeHN0YXRlID09PSBBVFRSX1ZBTFVFX0RRKSB4c3RhdGUgPSBBVFRSX1ZBTFVFXG4gICAgICAgIGlmICh4c3RhdGUgPT09IEFUVFJfVkFMVUVfU1EpIHhzdGF0ZSA9IEFUVFJfVkFMVUVcbiAgICAgICAgaWYgKHhzdGF0ZSA9PT0gQVRUUl9WQUxVRV9XKSB4c3RhdGUgPSBBVFRSX1ZBTFVFXG4gICAgICAgIGlmICh4c3RhdGUgPT09IEFUVFIpIHhzdGF0ZSA9IEFUVFJfS0VZXG4gICAgICAgIGlmICh4c3RhdGUgPT09IE9QRU4pIHtcbiAgICAgICAgICBpZiAocmVnID09PSAnLycpIHtcbiAgICAgICAgICAgIHAucHVzaChbIE9QRU4sICcvJywgYXJnIF0pXG4gICAgICAgICAgICByZWcgPSAnJ1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwLnB1c2goWyBPUEVOLCBhcmcgXSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcC5wdXNoKFsgVkFSLCB4c3RhdGUsIGFyZyBdKVxuICAgICAgICB9XG4gICAgICAgIHBhcnRzLnB1c2guYXBwbHkocGFydHMsIHApXG4gICAgICB9IGVsc2UgcGFydHMucHVzaC5hcHBseShwYXJ0cywgcGFyc2Uoc3RyaW5nc1tpXSkpXG4gICAgfVxuXG4gICAgdmFyIHRyZWUgPSBbbnVsbCx7fSxbXV1cbiAgICB2YXIgc3RhY2sgPSBbW3RyZWUsLTFdXVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjdXIgPSBzdGFja1tzdGFjay5sZW5ndGgtMV1bMF1cbiAgICAgIHZhciBwID0gcGFydHNbaV0sIHMgPSBwWzBdXG4gICAgICBpZiAocyA9PT0gT1BFTiAmJiAvXlxcLy8udGVzdChwWzFdKSkge1xuICAgICAgICB2YXIgaXggPSBzdGFja1tzdGFjay5sZW5ndGgtMV1bMV1cbiAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBzdGFjay5wb3AoKVxuICAgICAgICAgIHN0YWNrW3N0YWNrLmxlbmd0aC0xXVswXVsyXVtpeF0gPSBoKFxuICAgICAgICAgICAgY3VyWzBdLCBjdXJbMV0sIGN1clsyXS5sZW5ndGggPyBjdXJbMl0gOiB1bmRlZmluZWRcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocyA9PT0gT1BFTikge1xuICAgICAgICB2YXIgYyA9IFtwWzFdLHt9LFtdXVxuICAgICAgICBjdXJbMl0ucHVzaChjKVxuICAgICAgICBzdGFjay5wdXNoKFtjLGN1clsyXS5sZW5ndGgtMV0pXG4gICAgICB9IGVsc2UgaWYgKHMgPT09IEFUVFJfS0VZIHx8IChzID09PSBWQVIgJiYgcFsxXSA9PT0gQVRUUl9LRVkpKSB7XG4gICAgICAgIHZhciBrZXkgPSAnJ1xuICAgICAgICB2YXIgY29weUtleVxuICAgICAgICBmb3IgKDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHBhcnRzW2ldWzBdID09PSBBVFRSX0tFWSkge1xuICAgICAgICAgICAga2V5ID0gY29uY2F0KGtleSwgcGFydHNbaV1bMV0pXG4gICAgICAgICAgfSBlbHNlIGlmIChwYXJ0c1tpXVswXSA9PT0gVkFSICYmIHBhcnRzW2ldWzFdID09PSBBVFRSX0tFWSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJ0c1tpXVsyXSA9PT0gJ29iamVjdCcgJiYgIWtleSkge1xuICAgICAgICAgICAgICBmb3IgKGNvcHlLZXkgaW4gcGFydHNbaV1bMl0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFydHNbaV1bMl0uaGFzT3duUHJvcGVydHkoY29weUtleSkgJiYgIWN1clsxXVtjb3B5S2V5XSkge1xuICAgICAgICAgICAgICAgICAgY3VyWzFdW2NvcHlLZXldID0gcGFydHNbaV1bMl1bY29weUtleV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGtleSA9IGNvbmNhdChrZXksIHBhcnRzW2ldWzJdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBicmVha1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJ0c1tpXVswXSA9PT0gQVRUUl9FUSkgaSsrXG4gICAgICAgIHZhciBqID0gaVxuICAgICAgICBmb3IgKDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHBhcnRzW2ldWzBdID09PSBBVFRSX1ZBTFVFIHx8IHBhcnRzW2ldWzBdID09PSBBVFRSX0tFWSkge1xuICAgICAgICAgICAgaWYgKCFjdXJbMV1ba2V5XSkgY3VyWzFdW2tleV0gPSBzdHJmbihwYXJ0c1tpXVsxXSlcbiAgICAgICAgICAgIGVsc2UgcGFydHNbaV1bMV09PT1cIlwiIHx8IChjdXJbMV1ba2V5XSA9IGNvbmNhdChjdXJbMV1ba2V5XSwgcGFydHNbaV1bMV0pKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHBhcnRzW2ldWzBdID09PSBWQVJcbiAgICAgICAgICAmJiAocGFydHNbaV1bMV0gPT09IEFUVFJfVkFMVUUgfHwgcGFydHNbaV1bMV0gPT09IEFUVFJfS0VZKSkge1xuICAgICAgICAgICAgaWYgKCFjdXJbMV1ba2V5XSkgY3VyWzFdW2tleV0gPSBzdHJmbihwYXJ0c1tpXVsyXSlcbiAgICAgICAgICAgIGVsc2UgcGFydHNbaV1bMl09PT1cIlwiIHx8IChjdXJbMV1ba2V5XSA9IGNvbmNhdChjdXJbMV1ba2V5XSwgcGFydHNbaV1bMl0pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGtleS5sZW5ndGggJiYgIWN1clsxXVtrZXldICYmIGkgPT09IGpcbiAgICAgICAgICAgICYmIChwYXJ0c1tpXVswXSA9PT0gQ0xPU0UgfHwgcGFydHNbaV1bMF0gPT09IEFUVFJfQlJFQUspKSB7XG4gICAgICAgICAgICAgIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2luZnJhc3RydWN0dXJlLmh0bWwjYm9vbGVhbi1hdHRyaWJ1dGVzXG4gICAgICAgICAgICAgIC8vIGVtcHR5IHN0cmluZyBpcyBmYWxzeSwgbm90IHdlbGwgYmVoYXZlZCB2YWx1ZSBpbiBicm93c2VyXG4gICAgICAgICAgICAgIGN1clsxXVtrZXldID0ga2V5LnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJ0c1tpXVswXSA9PT0gQ0xPU0UpIHtcbiAgICAgICAgICAgICAgaS0tXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzID09PSBBVFRSX0tFWSkge1xuICAgICAgICBjdXJbMV1bcFsxXV0gPSB0cnVlXG4gICAgICB9IGVsc2UgaWYgKHMgPT09IFZBUiAmJiBwWzFdID09PSBBVFRSX0tFWSkge1xuICAgICAgICBjdXJbMV1bcFsyXV0gPSB0cnVlXG4gICAgICB9IGVsc2UgaWYgKHMgPT09IENMT1NFKSB7XG4gICAgICAgIGlmIChzZWxmQ2xvc2luZyhjdXJbMF0pICYmIHN0YWNrLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBpeCA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXVsxXVxuICAgICAgICAgIHN0YWNrLnBvcCgpXG4gICAgICAgICAgc3RhY2tbc3RhY2subGVuZ3RoLTFdWzBdWzJdW2l4XSA9IGgoXG4gICAgICAgICAgICBjdXJbMF0sIGN1clsxXSwgY3VyWzJdLmxlbmd0aCA/IGN1clsyXSA6IHVuZGVmaW5lZFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzID09PSBWQVIgJiYgcFsxXSA9PT0gVEVYVCkge1xuICAgICAgICBpZiAocFsyXSA9PT0gdW5kZWZpbmVkIHx8IHBbMl0gPT09IG51bGwpIHBbMl0gPSAnJ1xuICAgICAgICBlbHNlIGlmICghcFsyXSkgcFsyXSA9IGNvbmNhdCgnJywgcFsyXSlcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocFsyXVswXSkpIHtcbiAgICAgICAgICBjdXJbMl0ucHVzaC5hcHBseShjdXJbMl0sIHBbMl0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VyWzJdLnB1c2gocFsyXSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzID09PSBURVhUKSB7XG4gICAgICAgIGN1clsyXS5wdXNoKHBbMV0pXG4gICAgICB9IGVsc2UgaWYgKHMgPT09IEFUVFJfRVEgfHwgcyA9PT0gQVRUUl9CUkVBSykge1xuICAgICAgICAvLyBuby1vcFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmhhbmRsZWQ6ICcgKyBzKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0cmVlWzJdLmxlbmd0aCA+IDEgJiYgL15cXHMqJC8udGVzdCh0cmVlWzJdWzBdKSkge1xuICAgICAgdHJlZVsyXS5zaGlmdCgpXG4gICAgfVxuXG4gICAgaWYgKHRyZWVbMl0ubGVuZ3RoID4gMlxuICAgIHx8ICh0cmVlWzJdLmxlbmd0aCA9PT0gMiAmJiAvXFxTLy50ZXN0KHRyZWVbMl1bMV0pKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnbXVsdGlwbGUgcm9vdCBlbGVtZW50cyBtdXN0IGJlIHdyYXBwZWQgaW4gYW4gZW5jbG9zaW5nIHRhZydcbiAgICAgIClcbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodHJlZVsyXVswXSkgJiYgdHlwZW9mIHRyZWVbMl1bMF1bMF0gPT09ICdzdHJpbmcnXG4gICAgJiYgQXJyYXkuaXNBcnJheSh0cmVlWzJdWzBdWzJdKSkge1xuICAgICAgdHJlZVsyXVswXSA9IGgodHJlZVsyXVswXVswXSwgdHJlZVsyXVswXVsxXSwgdHJlZVsyXVswXVsyXSlcbiAgICB9XG4gICAgcmV0dXJuIHRyZWVbMl1bMF1cblxuICAgIGZ1bmN0aW9uIHBhcnNlIChzdHIpIHtcbiAgICAgIHZhciByZXMgPSBbXVxuICAgICAgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX1cpIHN0YXRlID0gQVRUUlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckF0KGkpXG4gICAgICAgIGlmIChzdGF0ZSA9PT0gVEVYVCAmJiBjID09PSAnPCcpIHtcbiAgICAgICAgICBpZiAocmVnLmxlbmd0aCkgcmVzLnB1c2goW1RFWFQsIHJlZ10pXG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IE9QRU5cbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnPicgJiYgIXF1b3Qoc3RhdGUpICYmIHN0YXRlICE9PSBDT01NRU5UKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBPUEVOICYmIHJlZy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKFtPUEVOLHJlZ10pXG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9LRVkpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX0tFWSxyZWddKVxuICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUUgJiYgcmVnLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzLnB1c2goW0FUVFJfVkFMVUUscmVnXSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzLnB1c2goW0NMT1NFXSlcbiAgICAgICAgICByZWcgPSAnJ1xuICAgICAgICAgIHN0YXRlID0gVEVYVFxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBDT01NRU5UICYmIC8tJC8udGVzdChyZWcpICYmIGMgPT09ICctJykge1xuICAgICAgICAgIGlmIChvcHRzLmNvbW1lbnRzKSB7XG4gICAgICAgICAgICByZXMucHVzaChbQVRUUl9WQUxVRSxyZWcuc3Vic3RyKDAsIHJlZy5sZW5ndGggLSAxKV0sW0NMT1NFXSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IFRFWFRcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gT1BFTiAmJiAvXiEtLSQvLnRlc3QocmVnKSkge1xuICAgICAgICAgIGlmIChvcHRzLmNvbW1lbnRzKSB7XG4gICAgICAgICAgICByZXMucHVzaChbT1BFTiwgcmVnXSxbQVRUUl9LRVksJ2NvbW1lbnQnXSxbQVRUUl9FUV0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlZyA9IGNcbiAgICAgICAgICBzdGF0ZSA9IENPTU1FTlRcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gVEVYVCB8fCBzdGF0ZSA9PT0gQ09NTUVOVCkge1xuICAgICAgICAgIHJlZyArPSBjXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IE9QRU4gJiYgYyA9PT0gJy8nICYmIHJlZy5sZW5ndGgpIHtcbiAgICAgICAgICAvLyBuby1vcCwgc2VsZiBjbG9zaW5nIHRhZyB3aXRob3V0IGEgc3BhY2UgPGJyLz5cbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gT1BFTiAmJiAvXFxzLy50ZXN0KGMpKSB7XG4gICAgICAgICAgaWYgKHJlZy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKFtPUEVOLCByZWddKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZWcgPSAnJ1xuICAgICAgICAgIHN0YXRlID0gQVRUUlxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBPUEVOKSB7XG4gICAgICAgICAgcmVnICs9IGNcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUiAmJiAvW15cXHNcIic9L10vLnRlc3QoYykpIHtcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJfS0VZXG4gICAgICAgICAgcmVnID0gY1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSICYmIC9cXHMvLnRlc3QoYykpIHtcbiAgICAgICAgICBpZiAocmVnLmxlbmd0aCkgcmVzLnB1c2goW0FUVFJfS0VZLHJlZ10pXG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfQlJFQUtdKVxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX0tFWSAmJiAvXFxzLy50ZXN0KGMpKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfS0VZLHJlZ10pXG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJfS0VZX1dcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9LRVkgJiYgYyA9PT0gJz0nKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfS0VZLHJlZ10sW0FUVFJfRVFdKVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBBVFRSX1ZBTFVFX1dcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9LRVkpIHtcbiAgICAgICAgICByZWcgKz0gY1xuICAgICAgICB9IGVsc2UgaWYgKChzdGF0ZSA9PT0gQVRUUl9LRVlfVyB8fCBzdGF0ZSA9PT0gQVRUUikgJiYgYyA9PT0gJz0nKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfRVFdKVxuICAgICAgICAgIHN0YXRlID0gQVRUUl9WQUxVRV9XXG4gICAgICAgIH0gZWxzZSBpZiAoKHN0YXRlID09PSBBVFRSX0tFWV9XIHx8IHN0YXRlID09PSBBVFRSKSAmJiAhL1xccy8udGVzdChjKSkge1xuICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX0JSRUFLXSlcbiAgICAgICAgICBpZiAoL1tcXHctXS8udGVzdChjKSkge1xuICAgICAgICAgICAgcmVnICs9IGNcbiAgICAgICAgICAgIHN0YXRlID0gQVRUUl9LRVlcbiAgICAgICAgICB9IGVsc2Ugc3RhdGUgPSBBVFRSXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUVfVyAmJiBjID09PSAnXCInKSB7XG4gICAgICAgICAgc3RhdGUgPSBBVFRSX1ZBTFVFX0RRXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUVfVyAmJiBjID09PSBcIidcIikge1xuICAgICAgICAgIHN0YXRlID0gQVRUUl9WQUxVRV9TUVxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX0RRICYmIGMgPT09ICdcIicpIHtcbiAgICAgICAgICByZXMucHVzaChbQVRUUl9WQUxVRSxyZWddLFtBVFRSX0JSRUFLXSlcbiAgICAgICAgICByZWcgPSAnJ1xuICAgICAgICAgIHN0YXRlID0gQVRUUlxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX1NRICYmIGMgPT09IFwiJ1wiKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfVkFMVUUscmVnXSxbQVRUUl9CUkVBS10pXG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRV9XICYmICEvXFxzLy50ZXN0KGMpKSB7XG4gICAgICAgICAgc3RhdGUgPSBBVFRSX1ZBTFVFXG4gICAgICAgICAgaS0tXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUUgJiYgL1xccy8udGVzdChjKSkge1xuICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX1ZBTFVFLHJlZ10sW0FUVFJfQlJFQUtdKVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBBVFRSXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUUgfHwgc3RhdGUgPT09IEFUVFJfVkFMVUVfU1FcbiAgICAgICAgfHwgc3RhdGUgPT09IEFUVFJfVkFMVUVfRFEpIHtcbiAgICAgICAgICByZWcgKz0gY1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3RhdGUgPT09IFRFWFQgJiYgcmVnLmxlbmd0aCkge1xuICAgICAgICByZXMucHVzaChbVEVYVCxyZWddKVxuICAgICAgICByZWcgPSAnJ1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRSAmJiByZWcubGVuZ3RoKSB7XG4gICAgICAgIHJlcy5wdXNoKFtBVFRSX1ZBTFVFLHJlZ10pXG4gICAgICAgIHJlZyA9ICcnXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX0RRICYmIHJlZy5sZW5ndGgpIHtcbiAgICAgICAgcmVzLnB1c2goW0FUVFJfVkFMVUUscmVnXSlcbiAgICAgICAgcmVnID0gJydcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUVfU1EgJiYgcmVnLmxlbmd0aCkge1xuICAgICAgICByZXMucHVzaChbQVRUUl9WQUxVRSxyZWddKVxuICAgICAgICByZWcgPSAnJ1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9LRVkpIHtcbiAgICAgICAgcmVzLnB1c2goW0FUVFJfS0VZLHJlZ10pXG4gICAgICAgIHJlZyA9ICcnXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3RyZm4gKHgpIHtcbiAgICBpZiAodHlwZW9mIHggPT09ICdmdW5jdGlvbicpIHJldHVybiB4XG4gICAgZWxzZSBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnKSByZXR1cm4geFxuICAgIGVsc2UgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSByZXR1cm4geFxuICAgIGVsc2UgcmV0dXJuIGNvbmNhdCgnJywgeClcbiAgfVxufVxuXG5mdW5jdGlvbiBxdW90IChzdGF0ZSkge1xuICByZXR1cm4gc3RhdGUgPT09IEFUVFJfVkFMVUVfU1EgfHwgc3RhdGUgPT09IEFUVFJfVkFMVUVfRFFcbn1cblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcbmZ1bmN0aW9uIGhhcyAob2JqLCBrZXkpIHsgcmV0dXJuIGhhc093bi5jYWxsKG9iaiwga2V5KSB9XG5cbnZhciBjbG9zZVJFID0gUmVnRXhwKCdeKCcgKyBbXG4gICdhcmVhJywgJ2Jhc2UnLCAnYmFzZWZvbnQnLCAnYmdzb3VuZCcsICdicicsICdjb2wnLCAnY29tbWFuZCcsICdlbWJlZCcsXG4gICdmcmFtZScsICdocicsICdpbWcnLCAnaW5wdXQnLCAnaXNpbmRleCcsICdrZXlnZW4nLCAnbGluaycsICdtZXRhJywgJ3BhcmFtJyxcbiAgJ3NvdXJjZScsICd0cmFjaycsICd3YnInLCAnIS0tJyxcbiAgLy8gU1ZHIFRBR1NcbiAgJ2FuaW1hdGUnLCAnYW5pbWF0ZVRyYW5zZm9ybScsICdjaXJjbGUnLCAnY3Vyc29yJywgJ2Rlc2MnLCAnZWxsaXBzZScsXG4gICdmZUJsZW5kJywgJ2ZlQ29sb3JNYXRyaXgnLCAnZmVDb21wb3NpdGUnLFxuICAnZmVDb252b2x2ZU1hdHJpeCcsICdmZURpZmZ1c2VMaWdodGluZycsICdmZURpc3BsYWNlbWVudE1hcCcsXG4gICdmZURpc3RhbnRMaWdodCcsICdmZUZsb29kJywgJ2ZlRnVuY0EnLCAnZmVGdW5jQicsICdmZUZ1bmNHJywgJ2ZlRnVuY1InLFxuICAnZmVHYXVzc2lhbkJsdXInLCAnZmVJbWFnZScsICdmZU1lcmdlTm9kZScsICdmZU1vcnBob2xvZ3knLFxuICAnZmVPZmZzZXQnLCAnZmVQb2ludExpZ2h0JywgJ2ZlU3BlY3VsYXJMaWdodGluZycsICdmZVNwb3RMaWdodCcsICdmZVRpbGUnLFxuICAnZmVUdXJidWxlbmNlJywgJ2ZvbnQtZmFjZS1mb3JtYXQnLCAnZm9udC1mYWNlLW5hbWUnLCAnZm9udC1mYWNlLXVyaScsXG4gICdnbHlwaCcsICdnbHlwaFJlZicsICdoa2VybicsICdpbWFnZScsICdsaW5lJywgJ21pc3NpbmctZ2x5cGgnLCAnbXBhdGgnLFxuICAncGF0aCcsICdwb2x5Z29uJywgJ3BvbHlsaW5lJywgJ3JlY3QnLCAnc2V0JywgJ3N0b3AnLCAndHJlZicsICd1c2UnLCAndmlldycsXG4gICd2a2Vybidcbl0uam9pbignfCcpICsgJykoPzpbXFwuI11bYS16QS1aMC05XFx1MDA3Ri1cXHVGRkZGXzotXSspKiQnKVxuZnVuY3Rpb24gc2VsZkNsb3NpbmcgKHRhZykgeyByZXR1cm4gY2xvc2VSRS50ZXN0KHRhZykgfVxuIiwiYXNzZXJ0Lm5vdEVxdWFsID0gbm90RXF1YWxcbmFzc2VydC5ub3RPayA9IG5vdE9rXG5hc3NlcnQuZXF1YWwgPSBlcXVhbFxuYXNzZXJ0Lm9rID0gYXNzZXJ0XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzZXJ0XG5cbmZ1bmN0aW9uIGVxdWFsIChhLCBiLCBtKSB7XG4gIGFzc2VydChhID09IGIsIG0pIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZXFlcWVxXG59XG5cbmZ1bmN0aW9uIG5vdEVxdWFsIChhLCBiLCBtKSB7XG4gIGFzc2VydChhICE9IGIsIG0pIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZXFlcWVxXG59XG5cbmZ1bmN0aW9uIG5vdE9rICh0LCBtKSB7XG4gIGFzc2VydCghdCwgbSlcbn1cblxuZnVuY3Rpb24gYXNzZXJ0ICh0LCBtKSB7XG4gIGlmICghdCkgdGhyb3cgbmV3IEVycm9yKG0gfHwgJ0Fzc2VydGlvbkVycm9yJylcbn1cbiIsIi8qIGdsb2JhbCBNdXRhdGlvbk9ic2VydmVyICovXG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCdnbG9iYWwvZG9jdW1lbnQnKVxudmFyIHdpbmRvdyA9IHJlcXVpcmUoJ2dsb2JhbC93aW5kb3cnKVxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpXG52YXIgd2F0Y2ggPSBPYmplY3QuY3JlYXRlKG51bGwpXG52YXIgS0VZX0lEID0gJ29ubG9hZGlkJyArIChuZXcgRGF0ZSgpICUgOWU2KS50b1N0cmluZygzNilcbnZhciBLRVlfQVRUUiA9ICdkYXRhLScgKyBLRVlfSURcbnZhciBJTkRFWCA9IDBcblxuaWYgKHdpbmRvdyAmJiB3aW5kb3cuTXV0YXRpb25PYnNlcnZlcikge1xuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgaWYgKE9iamVjdC5rZXlzKHdhdGNoKS5sZW5ndGggPCAxKSByZXR1cm5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG11dGF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG11dGF0aW9uc1tpXS5hdHRyaWJ1dGVOYW1lID09PSBLRVlfQVRUUikge1xuICAgICAgICBlYWNoQXR0cihtdXRhdGlvbnNbaV0sIHR1cm5vbiwgdHVybm9mZilcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGVhY2hNdXRhdGlvbihtdXRhdGlvbnNbaV0ucmVtb3ZlZE5vZGVzLCB0dXJub2ZmKVxuICAgICAgZWFjaE11dGF0aW9uKG11dGF0aW9uc1tpXS5hZGRlZE5vZGVzLCB0dXJub24pXG4gICAgfVxuICB9KVxuICBpZiAoZG9jdW1lbnQuYm9keSkge1xuICAgIGJlZ2luT2JzZXJ2ZShvYnNlcnZlcilcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBiZWdpbk9ic2VydmUob2JzZXJ2ZXIpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBiZWdpbk9ic2VydmUgKG9ic2VydmVyKSB7XG4gIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB7XG4gICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIHN1YnRyZWU6IHRydWUsXG4gICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVGaWx0ZXI6IFtLRVlfQVRUUl1cbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvbmxvYWQgKGVsLCBvbiwgb2ZmLCBjYWxsZXIpIHtcbiAgYXNzZXJ0KGRvY3VtZW50LmJvZHksICdvbi1sb2FkOiB3aWxsIG5vdCB3b3JrIHByaW9yIHRvIERPTUNvbnRlbnRMb2FkZWQnKVxuICBvbiA9IG9uIHx8IGZ1bmN0aW9uICgpIHt9XG4gIG9mZiA9IG9mZiB8fCBmdW5jdGlvbiAoKSB7fVxuICBlbC5zZXRBdHRyaWJ1dGUoS0VZX0FUVFIsICdvJyArIElOREVYKVxuICB3YXRjaFsnbycgKyBJTkRFWF0gPSBbb24sIG9mZiwgMCwgY2FsbGVyIHx8IG9ubG9hZC5jYWxsZXJdXG4gIElOREVYICs9IDFcbiAgcmV0dXJuIGVsXG59XG5cbm1vZHVsZS5leHBvcnRzLktFWV9BVFRSID0gS0VZX0FUVFJcbm1vZHVsZS5leHBvcnRzLktFWV9JRCA9IEtFWV9JRFxuXG5mdW5jdGlvbiB0dXJub24gKGluZGV4LCBlbCkge1xuICBpZiAod2F0Y2hbaW5kZXhdWzBdICYmIHdhdGNoW2luZGV4XVsyXSA9PT0gMCkge1xuICAgIHdhdGNoW2luZGV4XVswXShlbClcbiAgICB3YXRjaFtpbmRleF1bMl0gPSAxXG4gIH1cbn1cblxuZnVuY3Rpb24gdHVybm9mZiAoaW5kZXgsIGVsKSB7XG4gIGlmICh3YXRjaFtpbmRleF1bMV0gJiYgd2F0Y2hbaW5kZXhdWzJdID09PSAxKSB7XG4gICAgd2F0Y2hbaW5kZXhdWzFdKGVsKVxuICAgIHdhdGNoW2luZGV4XVsyXSA9IDBcbiAgfVxufVxuXG5mdW5jdGlvbiBlYWNoQXR0ciAobXV0YXRpb24sIG9uLCBvZmYpIHtcbiAgdmFyIG5ld1ZhbHVlID0gbXV0YXRpb24udGFyZ2V0LmdldEF0dHJpYnV0ZShLRVlfQVRUUilcbiAgaWYgKHNhbWVPcmlnaW4obXV0YXRpb24ub2xkVmFsdWUsIG5ld1ZhbHVlKSkge1xuICAgIHdhdGNoW25ld1ZhbHVlXSA9IHdhdGNoW211dGF0aW9uLm9sZFZhbHVlXVxuICAgIHJldHVyblxuICB9XG4gIGlmICh3YXRjaFttdXRhdGlvbi5vbGRWYWx1ZV0pIHtcbiAgICBvZmYobXV0YXRpb24ub2xkVmFsdWUsIG11dGF0aW9uLnRhcmdldClcbiAgfVxuICBpZiAod2F0Y2hbbmV3VmFsdWVdKSB7XG4gICAgb24obmV3VmFsdWUsIG11dGF0aW9uLnRhcmdldClcbiAgfVxufVxuXG5mdW5jdGlvbiBzYW1lT3JpZ2luIChvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgaWYgKCFvbGRWYWx1ZSB8fCAhbmV3VmFsdWUpIHJldHVybiBmYWxzZVxuICByZXR1cm4gd2F0Y2hbb2xkVmFsdWVdWzNdID09PSB3YXRjaFtuZXdWYWx1ZV1bM11cbn1cblxuZnVuY3Rpb24gZWFjaE11dGF0aW9uIChub2RlcywgZm4pIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh3YXRjaClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChub2Rlc1tpXSAmJiBub2Rlc1tpXS5nZXRBdHRyaWJ1dGUgJiYgbm9kZXNbaV0uZ2V0QXR0cmlidXRlKEtFWV9BVFRSKSkge1xuICAgICAgdmFyIG9ubG9hZGlkID0gbm9kZXNbaV0uZ2V0QXR0cmlidXRlKEtFWV9BVFRSKVxuICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIGlmIChvbmxvYWRpZCA9PT0gaykge1xuICAgICAgICAgIGZuKGssIG5vZGVzW2ldKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAobm9kZXNbaV0uY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBlYWNoTXV0YXRpb24obm9kZXNbaV0uY2hpbGROb2RlcywgZm4pXG4gICAgfVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIFwidHJhY2tlckxpc3RMb2NcIjogXCJkYXRhL3RyYWNrZXJfbGlzdHNcIixcclxuICAgIFwiYmxvY2tMaXN0c1wiOiBbXHJcbiAgICAgICAgXCJ0cmFja2Vyc1dpdGhQYXJlbnRDb21wYW55Lmpzb25cIlxyXG4gICAgXSxcclxuICAgIFwiZW50aXR5TGlzdFwiOiBcImh0dHBzOi8vczMudXMtZWFzdC0yLmFtYXpvbmF3cy5jb20vc2VhcmNoY2RuL2NvbnRlbnRibG9ja2luZy5qc1wiLFxyXG4gICAgXCJlbnRpdHlNYXBcIjogXCJkYXRhL3RyYWNrZXJfbGlzdHMvZW50aXR5TWFwLmpzb25cIixcclxuICAgIFwiYmxvY2tpbmdcIjogW1wiQWR2ZXJ0aXNpbmdcIiwgXCJBbmFseXRpY3NcIiwgXCJTb2NpYWxcIl0sXHJcbiAgICBcInJlcXVlc3RMaXN0ZW5lclR5cGVzXCI6IFtcIm1haW5fZnJhbWVcIixcInN1Yl9mcmFtZVwiLFwic3R5bGVzaGVldFwiLFwic2NyaXB0XCIsXCJpbWFnZVwiLFwib2JqZWN0XCIsXCJ4bWxodHRwcmVxdWVzdFwiLFwib3RoZXJcIl0sXHJcbiAgICBcInRyYWNrZXJzV2hpdGVsaXN0VGVtcG9yYXJ5XCI6IFwiaHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9zZWFyY2hjZG4vdHJhY2tlcnMtd2hpdGVsaXN0LXRlbXBvcmFyeS50eHRcIixcclxuICAgIFwidHJhY2tlcnNXaGl0ZWxpc3RcIjogXCJodHRwczovL3MzLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tL3NlYXJjaGNkbi90cmFja2Vycy13aGl0ZWxpc3QudHh0XCIsXHJcbiAgICBcInN1cnJvZ2F0ZUxpc3RcIjogXCJodHRwczovL3MzLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tL3NlYXJjaGNkbi9zdXJyb2dhdGVzLmpzXCIsXHJcbiAgICBcImZlZWRiYWNrVXJsXCI6IFwiaHR0cHM6Ly93d3cuZXhwbG9yZW9zLmNvbS9mZWVkYmFjay5qcz90eXBlPWV4dGVuc2lvbi1mZWVkYmFja1wiLFxyXG4gICAgXCJ0b3Nkck1lc3NhZ2VzXCIgOiB7XHJcbiAgICAgICAgXCJBXCI6IFwiR29vZFwiLFxyXG4gICAgICAgIFwiQlwiOiBcIk1peGVkXCIsXHJcbiAgICAgICAgXCJDXCI6IFwiQmFkXCIsXHJcbiAgICAgICAgXCJEXCI6IFwiQmFkXCIsXHJcbiAgICAgICAgXCJFXCI6IFwiQmFkXCIsXHJcbiAgICAgICAgXCJnb29kXCI6IFwiR29vZFwiLFxyXG4gICAgICAgIFwiYmFkXCI6IFwiQmFkXCIsXHJcbiAgICAgICAgXCJ1bmtub3duXCI6IFwiVW5rbm93blwiLFxyXG4gICAgICAgIFwibWl4ZWRcIjogXCJNaXhlZFwiXHJcbiAgICB9LFxyXG4gICAgXCJodHRwc01lc3NhZ2VzXCI6IHtcclxuICAgICAgICBcInNlY3VyZVwiOiBcIkVuY3J5cHRlZCBDb25uZWN0aW9uXCIsXHJcbiAgICAgICAgXCJ1cGdyYWRlZFwiOiBcIkZvcmNlZCBFbmNyeXB0aW9uXCIsXHJcbiAgICAgICAgXCJub25lXCI6IFwiVW5lbmNyeXB0ZWQgQ29ubmVjdGlvblwiLFxyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogTWFqb3IgdHJhY2tpbmcgbmV0d29ya3MgZGF0YTpcclxuICAgICAqIHBlcmNlbnQgb2YgdGhlIHRvcCAxIG1pbGxpb24gc2l0ZXMgYSB0cmFja2luZyBuZXR3b3JrIGhhcyBiZWVuIHNlZW4gb24uXHJcbiAgICAgKiBzZWU6IGh0dHBzOi8vd2VidHJhbnNwYXJlbmN5LmNzLnByaW5jZXRvbi5lZHUvd2ViY2Vuc3VzL1xyXG4gICAgICovXHJcbiAgICBcIm1ham9yVHJhY2tpbmdOZXR3b3Jrc1wiOiB7XHJcbiAgICAgICAgXCJnb29nbGVcIjogODQsXHJcbiAgICAgICAgXCJmYWNlYm9va1wiOiAzNixcclxuICAgICAgICBcInR3aXR0ZXJcIjogMTYsXHJcbiAgICAgICAgXCJhbWF6b25cIjogMTQsXHJcbiAgICAgICAgXCJhcHBuZXh1c1wiOiAxMCxcclxuICAgICAgICBcIm9yYWNsZVwiOiAxMCxcclxuICAgICAgICBcIm1lZGlhbWF0aFwiOiA5LFxyXG4gICAgICAgIFwib2F0aFwiOiA5LFxyXG4gICAgICAgIFwibWF4Y2RuXCI6IDcsXHJcbiAgICAgICAgXCJhdXRvbWF0dGljXCI6IDdcclxuICAgIH0sXHJcbiAgICBcImh0dHBzREJOYW1lXCI6IFwiaHR0cHNcIixcclxuICAgIFwiaHR0cHNMaXN0c1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJ1cGdyYWRlIGxpc3RcIixcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiaHR0cHNVcGdyYWRlTGlzdFwiLFxyXG4gICAgICAgICAgICBcInVybFwiOiBcImh0dHBzOi8vczMudXMtZWFzdC0yLmFtYXpvbmF3cy5jb20vc2VhcmNoY2RuL2h0dHBzLWJsb29tLmpzb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJ3aGl0ZWxpc3RcIixcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiaHR0cHNXaGl0ZWxpc3RcIixcclxuICAgICAgICAgICAgXCJ1cmxcIjogXCJodHRwczovL3MzLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tL3NlYXJjaGNkbi9odHRwcy13aGl0ZWxpc3QuanNvblwiXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIFwiaHR0cHNFcnJvckNvZGVzXCI6IHtcclxuICAgICAgICBcIm5ldDo6RVJSX0NPTk5FQ1RJT05fUkVGVVNFRFwiOiAxLFxyXG4gICAgICAgIFwibmV0OjpFUlJfQUJPUlRFRFwiOiAyLFxyXG4gICAgICAgIFwibmV0OjpFUlJfU1NMX1BST1RPQ09MX0VSUk9SXCI6IDMsXHJcbiAgICAgICAgXCJuZXQ6OkVSUl9TU0xfVkVSU0lPTl9PUl9DSVBIRVJfTUlTTUFUQ0hcIjogNCxcclxuICAgICAgICBcIm5ldDo6RVJSX05BTUVfTk9UX1JFU09MVkVEXCI6IDUsXHJcbiAgICAgICAgXCJOU19FUlJPUl9DT05ORUNUSU9OX1JFRlVTRURcIjogNixcclxuICAgICAgICBcIk5TX0VSUk9SX1VOS05PV05fSE9TVFwiOiA3LFxyXG4gICAgICAgIFwiQW4gYWRkaXRpb25hbCBwb2xpY3kgY29uc3RyYWludCBmYWlsZWQgd2hlbiB2YWxpZGF0aW5nIHRoaXMgY2VydGlmaWNhdGUuXCI6IDgsXHJcbiAgICAgICAgXCJVbmFibGUgdG8gY29tbXVuaWNhdGUgc2VjdXJlbHkgd2l0aCBwZWVyOiByZXF1ZXN0ZWQgZG9tYWluIG5hbWUgZG9lcyBub3QgbWF0Y2ggdGhlIHNlcnZlcuKAmXMgY2VydGlmaWNhdGUuXCI6IDksXHJcbiAgICAgICAgXCJDYW5ub3QgY29tbXVuaWNhdGUgc2VjdXJlbHkgd2l0aCBwZWVyOiBubyBjb21tb24gZW5jcnlwdGlvbiBhbGdvcml0aG0ocykuXCI6IDEwLFxyXG4gICAgICAgIFwiU1NMIHJlY2VpdmVkIGEgcmVjb3JkIHRoYXQgZXhjZWVkZWQgdGhlIG1heGltdW0gcGVybWlzc2libGUgbGVuZ3RoLlwiOiAxMSxcclxuICAgICAgICBcIlRoZSBjZXJ0aWZpY2F0ZSBpcyBub3QgdHJ1c3RlZCBiZWNhdXNlIGl0IGlzIHNlbGYtc2lnbmVkLlwiOiAxMixcclxuICAgICAgICBcImRvd25ncmFkZV9yZWRpcmVjdF9sb29wXCI6IDEzXHJcbiAgICB9XHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSAodWFTdHJpbmcpID0+IHtcclxuICAgIGlmICghdWFTdHJpbmcpIHVhU3RyaW5nID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnRcclxuXHJcbiAgICBsZXQgYnJvd3NlclxyXG4gICAgbGV0IHZlcnNpb25cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHBhcnNlZFVhUGFydHMgPSB1YVN0cmluZy5tYXRjaCgvKEZpcmVmb3h8Q2hyb21lfFNhZmFyaSlcXC8oWzAtOV0rKS8pXHJcbiAgICAgICAgYnJvd3NlciA9IHBhcnNlZFVhUGFydHNbMV1cclxuICAgICAgICB2ZXJzaW9uID0gcGFyc2VkVWFQYXJ0c1syXVxyXG5cclxuICAgICAgICAvLyBpbiBTYWZhcmksIHRoZSBiaXQgaW1tZWRpYXRlbHkgYWZ0ZXIgU2FmYXJpLyBpcyB0aGUgV2Via2l0IHZlcnNpb25cclxuICAgICAgICAvLyB0aGUgKmFjdHVhbCogdmVyc2lvbiBudW1iZXIgaXMgZWxzZXdoZXJlXHJcbiAgICAgICAgaWYgKGJyb3dzZXIgPT09ICdTYWZhcmknKSB7XHJcbiAgICAgICAgICAgIHZlcnNpb24gPSB1YVN0cmluZy5tYXRjaCgvVmVyc2lvblxcLyhcXGQrKS8pWzFdXHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIC8vIHVubGlrZWx5LCBwcmV2ZW50IGV4dGVuc2lvbiBmcm9tIGV4cGxvZGluZyBpZiB3ZSBkb24ndCByZWNvZ25pemUgdGhlIFVBXHJcbiAgICAgICAgYnJvd3NlciA9IHZlcnNpb24gPSAnJ1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgYnJvd3NlcjogYnJvd3NlcixcclxuICAgICAgICB2ZXJzaW9uOiB2ZXJzaW9uXHJcbiAgICB9XHJcbn1cclxuIiwiY29uc3QgUGFyZW50ID0gd2luZG93LkRERy5iYXNlLk1vZGVsXHJcbmNvbnN0IGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uLy4uLy4uL2RhdGEvY29uc3RhbnRzJylcclxuXHJcbmZ1bmN0aW9uIEZlZWRiYWNrRm9ybSAoYXR0cnMpIHtcclxuICAgIGF0dHJzID0gYXR0cnMgfHwge31cclxuICAgIGF0dHJzLmlzQnJva2VuU2l0ZSA9IGF0dHJzLmlzQnJva2VuU2l0ZSB8fCBmYWxzZVxyXG4gICAgYXR0cnMudXJsID0gYXR0cnMudXJsIHx8ICcnXHJcbiAgICBhdHRycy5tZXNzYWdlID0gYXR0cnMubWVzc2FnZSB8fCAnJ1xyXG4gICAgYXR0cnMuY2FuU3VibWl0ID0gZmFsc2VcclxuICAgIGF0dHJzLnN1Ym1pdHRlZCA9IGZhbHNlXHJcblxyXG4gICAgYXR0cnMuYnJvd3NlciA9IGF0dHJzLmJyb3dzZXIgfHwgJydcclxuICAgIGF0dHJzLmJyb3dzZXJWZXJzaW9uID0gYXR0cnMuYnJvd3NlclZlcnNpb24gfHwgJydcclxuXHJcbiAgICBQYXJlbnQuY2FsbCh0aGlzLCBhdHRycylcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUNhblN1Ym1pdCgpXHJcblxyXG4gICAgLy8gZ3JhYiBhdGIgdmFsdWUgZnJvbSBiYWNrZ3JvdW5kIHByb2Nlc3NcclxuICAgIHRoaXMuZmV0Y2goeyBnZXRTZXR0aW5nOiB7IG5hbWU6ICdhdGInIH0gfSlcclxuICAgICAgICAudGhlbigoYXRiKSA9PiB7IHRoaXMuYXRiID0gYXRiIH0pXHJcbiAgICB0aGlzLmZldGNoKHsgZ2V0RXh0ZW5zaW9uVmVyc2lvbjogdHJ1ZSB9KVxyXG4gICAgICAgIC50aGVuKChleHRlbnNpb25WZXJzaW9uKSA9PiB7IHRoaXMuZXh0ZW5zaW9uVmVyc2lvbiA9IGV4dGVuc2lvblZlcnNpb24gfSlcclxufVxyXG5cclxuRmVlZGJhY2tGb3JtLnByb3RvdHlwZSA9IHdpbmRvdy4kLmV4dGVuZCh7fSxcclxuICAgIFBhcmVudC5wcm90b3R5cGUsXHJcbiAgICB7XHJcbiAgICAgICAgbW9kZWxOYW1lOiAnZmVlZGJhY2tGb3JtJyxcclxuXHJcbiAgICAgICAgc3VibWl0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jYW5TdWJtaXQgfHwgdGhpcy5fc3VibWl0dGluZykgeyByZXR1cm4gfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fc3VibWl0dGluZyA9IHRydWVcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy4kLmFqYXgoY29uc3RhbnRzLmZlZWRiYWNrVXJsLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICByZWFzb246IHRoaXMuaXNCcm9rZW5TaXRlID8gJ2Jyb2tlbl9zaXRlJyA6ICdnZW5lcmFsJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHRoaXMudXJsIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnQ6IHRoaXMubWVzc2FnZSB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICBicm93c2VyOiB0aGlzLmJyb3dzZXIgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgYnJvd3Nlcl92ZXJzaW9uOiB0aGlzLmJyb3dzZXJWZXJzaW9uIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHY6IHRoaXMuZXh0ZW5zaW9uVmVyc2lvbiB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICBhdGI6IHRoaXMuYXRiIHx8ICcnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0ZWQnLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdlcnJvcmVkJywgdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnZXJyb3JlZCcsIHRydWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgdG9nZ2xlQnJva2VuU2l0ZTogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnaXNCcm9rZW5TaXRlJywgdmFsKVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNhblN1Ym1pdCgpXHJcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHVwZGF0ZUNhblN1Ym1pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0Jyb2tlblNpdGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdjYW5TdWJtaXQnLCAhISh0aGlzLnVybCAmJiB0aGlzLm1lc3NhZ2UpKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2NhblN1Ym1pdCcsICEhdGhpcy5tZXNzYWdlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ3VybCcsICcnKVxyXG4gICAgICAgICAgICB0aGlzLnNldCgnbWVzc2FnZScsICcnKVxyXG4gICAgICAgICAgICB0aGlzLnNldCgnY2FuU3VibWl0JywgZmFsc2UpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4pXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWRiYWNrRm9ybVxyXG4iLCJjb25zdCBQYXJlbnQgPSB3aW5kb3cuRERHLmJhc2UuUGFnZVxyXG5jb25zdCBtaXhpbnMgPSByZXF1aXJlKCcuL21peGlucy9pbmRleC5lczYnKVxyXG5jb25zdCBwYXJzZVVzZXJBZ2VudFN0cmluZyA9IHJlcXVpcmUoJy4uLy4uL3NoYXJlZC11dGlscy9wYXJzZS11c2VyLWFnZW50LXN0cmluZy5lczYuanMnKVxyXG5jb25zdCBGZWVkYmFja0Zvcm1WaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvZmVlZGJhY2stZm9ybS5lczYnKVxyXG5jb25zdCBGZWVkYmFja0Zvcm1Nb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9mZWVkYmFjay1mb3JtLmVzNicpXHJcblxyXG5mdW5jdGlvbiBGZWVkYmFjayAob3BzKSB7XHJcbiAgICBQYXJlbnQuY2FsbCh0aGlzLCBvcHMpXHJcbn1cclxuXHJcbkZlZWRiYWNrLnByb3RvdHlwZSA9IHdpbmRvdy4kLmV4dGVuZCh7fSxcclxuICAgIFBhcmVudC5wcm90b3R5cGUsXHJcbiAgICBtaXhpbnMuc2V0QnJvd3NlckNsYXNzT25Cb2R5VGFnLFxyXG4gICAgbWl4aW5zLnBhcnNlUXVlcnlTdHJpbmcsXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHBhZ2VOYW1lOiAnZmVlZGJhY2snLFxyXG5cclxuICAgICAgICByZWFkeTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBQYXJlbnQucHJvdG90eXBlLnJlYWR5LmNhbGwodGhpcylcclxuICAgICAgICAgICAgdGhpcy5zZXRCcm93c2VyQ2xhc3NPbkJvZHlUYWcoKVxyXG5cclxuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyc2VRdWVyeVN0cmluZyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxyXG4gICAgICAgICAgICBsZXQgYnJvd3NlckluZm8gPSBwYXJzZVVzZXJBZ2VudFN0cmluZygpXHJcblxyXG4gICAgICAgICAgICB0aGlzLmZvcm0gPSBuZXcgRmVlZGJhY2tGb3JtVmlldyh7XHJcbiAgICAgICAgICAgICAgICBhcHBlbmRUbzogd2luZG93LiQoJy5qcy1mZWVkYmFjay1mb3JtJyksXHJcbiAgICAgICAgICAgICAgICBtb2RlbDogbmV3IEZlZWRiYWNrRm9ybU1vZGVsKHtcclxuICAgICAgICAgICAgICAgICAgICBpc0Jyb2tlblNpdGU6IHBhcmFtcy5icm9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBkZWNvZGVVUklDb21wb25lbnQocGFyYW1zLnVybCB8fCAnJyksXHJcbiAgICAgICAgICAgICAgICAgICAgYnJvd3NlcjogYnJvd3NlckluZm8uYnJvd3NlcixcclxuICAgICAgICAgICAgICAgICAgICBicm93c2VyVmVyc2lvbjogYnJvd3NlckluZm8udmVyc2lvblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbilcclxuXHJcbi8vIGtpY2tvZmYhXHJcbndpbmRvdy5EREcgPSB3aW5kb3cuRERHIHx8IHt9XHJcbndpbmRvdy5EREcucGFnZSA9IG5ldyBGZWVkYmFjaygpXHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgc2V0QnJvd3NlckNsYXNzT25Cb2R5VGFnOiByZXF1aXJlKCcuLyRCUk9XU0VSLXNldC1icm93c2VyLWNsYXNzLmVzNi5qcycpLFxyXG4gICAgcGFyc2VRdWVyeVN0cmluZzogcmVxdWlyZSgnLi9wYXJzZS1xdWVyeS1zdHJpbmcuZXM2LmpzJylcclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHBhcnNlUXVlcnlTdHJpbmc6IChxcykgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgcXMgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndHJpZWQgdG8gcGFyc2UgYSBub24tc3RyaW5nIHF1ZXJ5IHN0cmluZycpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcGFyc2VkID0ge31cclxuXHJcbiAgICAgICAgaWYgKHFzWzBdID09PSAnPycpIHtcclxuICAgICAgICAgICAgcXMgPSBxcy5zdWJzdHIoMSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBwYXJ0cyA9IHFzLnNwbGl0KCcmJylcclxuXHJcbiAgICAgICAgcGFydHMuZm9yRWFjaCgocGFydCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgW2tleSwgdmFsXSA9IHBhcnQuc3BsaXQoJz0nKVxyXG5cclxuICAgICAgICAgICAgaWYgKGtleSAmJiB2YWwpIHtcclxuICAgICAgICAgICAgICAgIHBhcnNlZFtrZXldID0gdmFsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gcGFyc2VkXHJcbiAgICB9XHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBzZXRCcm93c2VyQ2xhc3NPbkJvZHlUYWc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgYnJvd3NlckNsYXNzID0gJ2lzLWJyb3dzZXItLScgKyAnc2FmYXJpJ1xyXG4gICAgICAgIHdpbmRvdy4kKCdodG1sJykuYWRkQ2xhc3MoYnJvd3NlckNsYXNzKVxyXG4gICAgICAgIHdpbmRvdy4kKCdib2R5JykuYWRkQ2xhc3MoYnJvd3NlckNsYXNzKVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnN0IGJlbCA9IHJlcXVpcmUoJ2JlbCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBmaWVsZHNcclxuXHJcbiAgICBpZiAodGhpcy5tb2RlbC5lcnJvcmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIHNob3dFcnJvcigpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMubW9kZWwuc3VibWl0dGVkKSB7XHJcbiAgICAgICAgcmV0dXJuIHNob3dUaGFua1lvdSh0aGlzLm1vZGVsLmlzQnJva2VuU2l0ZSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5tb2RlbC5pc0Jyb2tlblNpdGUpIHtcclxuICAgICAgICBmaWVsZHMgPSBiZWxgPGRpdj5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPSdmcm1fX2xhYmVsJz5XaGljaCB3ZWJzaXRlIGlzIGJyb2tlbj88L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9J2pzLWZlZWRiYWNrLXVybCBmcm1fX2lucHV0JyB0eXBlPSd0ZXh0JyBwbGFjZWhvbGRlcj0nQ29weSBhbmQgcGFzdGUgeW91ciBVUkwnIHZhbHVlPScke3RoaXMubW9kZWwudXJsfScvPlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9J2ZybV9fbGFiZWwnPkRlc2NyaWJlIHRoZSBpc3N1ZSB5b3UgZW5jb3VudGVyZWQ6PC9sYWJlbD5cclxuICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPSdmcm1fX3RleHQganMtZmVlZGJhY2stbWVzc2FnZScgcGxhY2Vob2xkZXI9J1doaWNoIHdlYnNpdGUgY29udGVudCBvciBmdW5jdGlvbmFsaXR5IGlzIGJyb2tlbj8gUGxlYXNlIGJlIGFzIHNwZWNpZmljIGFzIHBvc3NpYmxlLic+PC90ZXh0YXJlYT5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZpZWxkcyA9IGJlbGA8ZGl2PlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9J2ZybV9fbGFiZWwnPldoYXQgZG8geW91IGxvdmU/IFdoYXQgaXNuJ3Qgd29ya2luZz8gSG93IGNvdWxkIHRoZSBleHRlbnNpb24gYmUgaW1wcm92ZWQ/PC9sYWJlbD5cclxuICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPSdmcm1fX3RleHQganMtZmVlZGJhY2stbWVzc2FnZScgcGxhY2Vob2xkZXI9J1doaWNoIGZlYXR1cmVzIG9yIGZ1bmN0aW9uYWxpdHkgZG9lcyB5b3VyIGZlZWRiYWNrIHJlZmVyIHRvPyBQbGVhc2UgYmUgYXMgc3BlY2lmaWMgYXMgcG9zc2libGUuJz48L3RleHRhcmVhPlxyXG4gICAgICAgIDwvZGl2PmBcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYmVsYDxmb3JtIGNsYXNzPSdmcm0nPlxyXG4gICAgICAgIDxwPkFub255bW91c2x5IHNoYXJlIHNvbWUgZmVlZGJhY2sgdG8gaGVscCB1cyBpbXByb3ZlIEV4cGxvcmVPUyBTZWFyY2guPC9wPlxyXG4gICAgICAgIDxsYWJlbCBjbGFzcz0nZnJtX19sYWJlbCc+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdjaGVja2JveCcgY2xhc3M9J2pzLWZlZWRiYWNrLWJyb2tlbi1zaXRlIGZybV9fbGFiZWxfX2NoaydcclxuICAgICAgICAgICAgICAgICR7dGhpcy5tb2RlbC5pc0Jyb2tlblNpdGUgPyAnY2hlY2tlZCcgOiAnJ30vPlxyXG4gICAgICAgICAgICBJIHdhbnQgdG8gcmVwb3J0IGEgYnJva2VuIHNpdGVcclxuICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICR7ZmllbGRzfVxyXG4gICAgICAgIDxpbnB1dCBjbGFzcz0nYnRuIGpzLWZlZWRiYWNrLXN1Ym1pdCAke3RoaXMubW9kZWwuY2FuU3VibWl0ID8gJycgOiAnaXMtZGlzYWJsZWQnfSdcclxuICAgICAgICAgICAgdHlwZT0nc3VibWl0JyB2YWx1ZT0nU3VibWl0JyAke3RoaXMubW9kZWwuY2FuU3VibWl0ID8gJycgOiAnZGlzYWJsZWQnfS8+XHJcbiAgICA8L2Zvcm0+YFxyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93VGhhbmtZb3UgKGlzQnJva2VuU2l0ZSkge1xyXG4gICAgaWYgKGlzQnJva2VuU2l0ZSkge1xyXG4gICAgICAgIHJldHVybiBiZWxgPGRpdj5cclxuICAgICAgICAgICAgPHA+VGhhbmsgeW91IGZvciB5b3VyIGZlZWRiYWNrITwvcD5cclxuICAgICAgICAgICAgPHA+WW91ciBicm9rZW4gc2l0ZSByZXBvcnRzIGhlbHAgb3VyIGRldmVsb3BtZW50IHRlYW0gZml4IHRoZXNlIGJyZWFrYWdlcy48L3A+XHJcbiAgICAgICAgICAgIDxwPlRvIGZpeCB0aGUgaXNzdWUgZm9yIHRoZSB0aW1lIGJlaW5nLCB5b3UgY2FuIHR1cm4gb2ZmIFwiUHJpdmFjeSBQcm90ZWN0aW9uXCIgdG8gYWRkIHRoZSBzaXRlIHRvIHRoZSBleHRlbnNpb24gd2hpdGVsaXN0LjwvcD5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBiZWxgPHA+VGhhbmsgeW91IGZvciB5b3VyIGZlZWRiYWNrITwvcD5gXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dFcnJvciAoKSB7XHJcbiAgICByZXR1cm4gYmVsYDxwPlNvbWV0aGluZyB3ZW50IHdyb25nIHdoZW4gc3VibWl0dGluZyBmZWVkYmFjay4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciE8L3A+YFxyXG59XHJcbiIsImNvbnN0IFBhcmVudCA9IHdpbmRvdy5EREcuYmFzZS5WaWV3XHJcbmNvbnN0IGZlZWRiYWNrRm9ybVRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2ZlZWRiYWNrLWZvcm0uZXM2JylcclxuXHJcbmZ1bmN0aW9uIEZlZWRiYWNrRm9ybSAob3BzKSB7XHJcbiAgICB0aGlzLm1vZGVsID0gb3BzLm1vZGVsXHJcbiAgICB0aGlzLnRlbXBsYXRlID0gZmVlZGJhY2tGb3JtVGVtcGxhdGVcclxuXHJcbiAgICBQYXJlbnQuY2FsbCh0aGlzLCBvcHMpXHJcblxyXG4gICAgdGhpcy5fc2V0dXAoKVxyXG59XHJcblxyXG5GZWVkYmFja0Zvcm0ucHJvdG90eXBlID0gd2luZG93LiQuZXh0ZW5kKHt9LFxyXG4gICAgUGFyZW50LnByb3RvdHlwZSxcclxuICAgIHtcclxuICAgICAgICBfc2V0dXA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FjaGVFbGVtcygnLmpzLWZlZWRiYWNrJywgW1xyXG4gICAgICAgICAgICAgICAgJ3VybCcsXHJcbiAgICAgICAgICAgICAgICAnbWVzc2FnZScsXHJcbiAgICAgICAgICAgICAgICAnYnJva2VuLXNpdGUnLFxyXG4gICAgICAgICAgICAgICAgJ3N1Ym1pdCdcclxuICAgICAgICAgICAgXSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50cyhbXHJcbiAgICAgICAgICAgICAgICBbdGhpcy5zdG9yZS5zdWJzY3JpYmUsIGBjaGFuZ2U6ZmVlZGJhY2tGb3JtYCwgdGhpcy5fb25Nb2RlbENoYW5nZV0sXHJcbiAgICAgICAgICAgICAgICBbdGhpcy4kdXJsLCBgaW5wdXRgLCB0aGlzLl9vblVybENoYW5nZV0sXHJcbiAgICAgICAgICAgICAgICBbdGhpcy4kbWVzc2FnZSwgYGlucHV0YCwgdGhpcy5fb25NZXNzYWdlQ2hhbmdlXSxcclxuICAgICAgICAgICAgICAgIFt0aGlzLiRicm9rZW5zaXRlLCBgY2hhbmdlYCwgdGhpcy5fb25Ccm9rZW5TaXRlQ2hhbmdlXSxcclxuICAgICAgICAgICAgICAgIFt0aGlzLiRzdWJtaXQsIGBjbGlja2AsIHRoaXMuX29uU3VibWl0Q2xpY2tdXHJcbiAgICAgICAgICAgIF0pXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX29uTW9kZWxDaGFuZ2U6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmNoYW5nZS5hdHRyaWJ1dGUgPT09ICdpc0Jyb2tlblNpdGUnIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgZS5jaGFuZ2UuYXR0cmlidXRlID09PSAnc3VibWl0dGVkJyB8fFxyXG4gICAgICAgICAgICAgICAgICAgIGUuY2hhbmdlLmF0dHJpYnV0ZSA9PT0gJ2Vycm9yZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVuYmluZEV2ZW50cygpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXJlbmRlcigpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXR1cCgpXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5jaGFuZ2UuYXR0cmlidXRlID09PSAnY2FuU3VibWl0Jykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kc3VibWl0LnRvZ2dsZUNsYXNzKCdpcy1kaXNhYmxlZCcsICF0aGlzLm1vZGVsLmNhblN1Ym1pdClcclxuICAgICAgICAgICAgICAgIHRoaXMuJHN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsICF0aGlzLm1vZGVsLmNhblN1Ym1pdClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9vbkJyb2tlblNpdGVDaGFuZ2U6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwudG9nZ2xlQnJva2VuU2l0ZShlLnRhcmdldC5jaGVja2VkKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9vblVybENoYW5nZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCgndXJsJywgdGhpcy4kdXJsLnZhbCgpKVxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnVwZGF0ZUNhblN1Ym1pdCgpXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX29uTWVzc2FnZUNoYW5nZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCgnbWVzc2FnZScsIHRoaXMuJG1lc3NhZ2UudmFsKCkpXHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlQ2FuU3VibWl0KClcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfb25TdWJtaXRDbGljazogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMubW9kZWwuY2FuU3VibWl0KSB7IHJldHVybiB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnN1Ym1pdCgpXHJcblxyXG4gICAgICAgICAgICB0aGlzLiRzdWJtaXQuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJylcclxuICAgICAgICAgICAgdGhpcy4kc3VibWl0LnZhbCgnU2VuZGluZy4uLicpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4pXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWRiYWNrRm9ybVxyXG4iXX0=
