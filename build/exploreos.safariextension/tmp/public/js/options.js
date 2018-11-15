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
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],10:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],11:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],12:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":10,"./encode":11}],13:[function(require,module,exports){
'use strict';

// Load rules
var Trie = require('./lib/suffix-trie.js');
var allRules = Trie.fromJson(require('./rules.json'));

// Internals
var extractHostname = require('./lib/clean-host.js');
var getDomain = require('./lib/domain.js');
var getPublicSuffix = require('./lib/public-suffix.js');
var getSubdomain = require('./lib/subdomain.js');
var isValid = require('./lib/is-valid.js');
var tldExists = require('./lib/tld-exists.js');


// Flags representing steps in the `parse` function. They are used to implement
// a early stop mechanism (simulating some form of laziness) to avoid doing more
// work than necessary to perform a given action (e.g.: we don't need to extract
// the domain and subdomain if we are only interested in public suffix).
var TLD_EXISTS = 1;
var PUBLIC_SUFFIX = 2;
var DOMAIN = 3;
var SUB_DOMAIN = 4;
var ALL = 5;


/**
 * Creates a new instance of tldjs
 * @param  {Object.<rules,validHosts>} options [description]
 * @return {tldjs|Object}                      [description]
 */
function factory(options) {
  var rules = options.rules || allRules || {};
  var validHosts = options.validHosts || [];
  var _extractHostname = options.extractHostname || extractHostname;

  /**
   * Process a given url and extract all information. This is a higher level API
   * around private functions of `tld.js`. It allows to remove duplication (only
   * extract hostname from url once for all operations) and implement some early
   * termination mechanism to not pay the price of what we don't need (this
   * simulates laziness at a lower cost).
   *
   * @param {string} url
   * @param {number|undefined} _step - where should we stop processing
   * @return {object}
   */
  function parse(url, _step) {
    var step = _step || ALL;
    var result = {
      hostname: _extractHostname(url),
      isValid: null,
      tldExists: null,
      publicSuffix: null,
      domain: null,
      subdomain: null,
    };

    // Check if `hostname` is valid
    result.isValid = isValid(result.hostname);
    if (result.isValid === false) return result;

    // Check if tld exists
    if (step === ALL || step === TLD_EXISTS) {
      result.tldExists = tldExists(rules, result.hostname);
    }
    if (step === TLD_EXISTS) return result;

    // Extract public suffix
    result.publicSuffix = getPublicSuffix(rules, result.hostname);
    if (step === PUBLIC_SUFFIX) return result;

    // Extract domain
    result.domain = getDomain(validHosts, result.publicSuffix, result.hostname);
    if (step === DOMAIN) return result;

    // Extract subdomain
    result.subdomain = getSubdomain(result.hostname, result.domain);

    return result;
  }


  return {
    extractHostname: _extractHostname,
    isValid: isValid,
    parse: parse,
    tldExists: function (url) {
      return parse(url, TLD_EXISTS).tldExists;
    },
    getPublicSuffix: function (url) {
      return parse(url, PUBLIC_SUFFIX).publicSuffix;
    },
    getDomain: function (url) {
      return parse(url, DOMAIN).domain;
    },
    getSubdomain: function (url) {
      return parse(url, SUB_DOMAIN).subdomain;
    },
    fromUserSettings: factory
  };
}


module.exports = factory({});

},{"./lib/clean-host.js":14,"./lib/domain.js":15,"./lib/is-valid.js":17,"./lib/public-suffix.js":18,"./lib/subdomain.js":19,"./lib/suffix-trie.js":20,"./lib/tld-exists.js":21,"./rules.json":22}],14:[function(require,module,exports){

var URL = require('url');
var isValid = require('./is-valid.js');


/**
 * Utility to cleanup the base host value. Also removes url fragments.
 *
 * Works for:
 * - hostname
 * - //hostname
 * - scheme://hostname
 * - scheme+scheme://hostname
 *
 * @param {string} value
 * @return {String}
 */

// scheme      = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
var hasPrefixRE = /^(([a-z][a-z0-9+.-]*)?:)?\/\//;
var invalidHostnameChars = /[^A-Za-z0-9.-]/;

// @see https://github.com/oncletom/tld.js/issues/95
function rtrim(value) {
  if (value[value.length - 1] === '.') {
    return value.substr(0, value.length - 1);
  }
  return value;
}

module.exports = function extractHostname(value) {
  if (isValid(value)) {
    return rtrim(value);
  }

  var url = ('' + value).toLowerCase().trim();

  if (isValid(url)) {
    return rtrim(url);
  }

  // Proceed with heavier url parsing to extract the hostname.
  var parts = URL.parse(hasPrefixRE.test(url) ? url : '//' + url, null, true);

  if (parts.hostname && !invalidHostnameChars.test(parts.hostname)) {
    return rtrim(parts.hostname);
  }

  return null;
};

},{"./is-valid.js":17,"url":23}],15:[function(require,module,exports){
'use strict';


/**
 * Polyfill for `endsWith`
 *
 * @param {string} str
 * @param {string} pattern
 * @return {boolean}
 */
function endsWith(str, pattern) {
  return (
    str.lastIndexOf(pattern) === (str.length - pattern.length)
  );
}


/**
 * Check if `vhost` is a valid suffix of `hostname` (top-domain)
 *
 * It means that `vhost` needs to be a suffix of `hostname` and we then need to
 * make sure that: either they are equal, or the character preceding `vhost` in
 * `hostname` is a '.' (it should not be a partial label).
 *
 * * hostname = 'not.evil.com' and vhost = 'vil.com'      => not ok
 * * hostname = 'not.evil.com' and vhost = 'evil.com'     => ok
 * * hostname = 'not.evil.com' and vhost = 'not.evil.com' => ok
 *
 * @param {string} hostname
 * @param {string} vhost
 * @return {boolean}
 */
function shareSameDomainSuffix(hostname, vhost) {
  if (endsWith(hostname, vhost)) {
    return (
      hostname.length === vhost.length ||
      hostname[hostname.length - vhost.length - 1] === '.'
    );
  }

  return false;
}


/**
 * Given a hostname and its public suffix, extract the general domain.
 *
 *  @param {string} hostname
 *  @param {string} publicSuffix
 *  @return {string}
 */
function extractDomainWithSuffix(hostname, publicSuffix) {
  // Locate the index of the last '.' in the part of the `hostname` preceding
  // the public suffix.
  //
  // examples:
  //   1. not.evil.co.uk  => evil.co.uk
  //         ^    ^
  //         |    | start of public suffix
  //         | index of the last dot
  //
  //   2. example.co.uk   => example.co.uk
  //     ^       ^
  //     |       | start of public suffix
  //     |
  //     | (-1) no dot found before the public suffix
  var publicSuffixIndex = hostname.length - publicSuffix.length - 2;
  var lastDotBeforeSuffixIndex = hostname.lastIndexOf('.', publicSuffixIndex);

  // No '.' found, then `hostname` is the general domain (no sub-domain)
  if (lastDotBeforeSuffixIndex === -1) {
    return hostname;
  }

  // Extract the part between the last '.'
  return hostname.substr(lastDotBeforeSuffixIndex + 1);
}


/**
 * Detects the domain based on rules and upon and a host string
 *
 * @api
 * @param {string} host
 * @return {String}
 */
module.exports = function getDomain(validHosts, suffix, hostname) {
  // Check if `hostname` ends with a member of `validHosts`.
  for (var i = 0; i < validHosts.length; i += 1) {
    var vhost = validHosts[i];
    if (shareSameDomainSuffix(hostname, vhost)) {
      return vhost;
    }
  }

  // If there is no suffix, there is no hostname
  if (suffix === null) {
    return null;
  }

  // If `hostname` is a valid public suffix, then there is no domain to return.
  // Since we already know that `getPublicSuffix` returns a suffix of `hostname`
  // there is no need to perform a string comparison and we only compare the
  // size.
  if (suffix.length === hostname.length) {
    return null;
  }

  // To extract the general domain, we start by identifying the public suffix
  // (if any), then consider the domain to be the public suffix with one added
  // level of depth. (e.g.: if hostname is `not.evil.co.uk` and public suffix:
  // `co.uk`, then we take one more level: `evil`, giving the final result:
  // `evil.co.uk`).
  return extractDomainWithSuffix(hostname, suffix);
};

},{}],16:[function(require,module,exports){
"use strict";

/**
 * Utility to extract the TLD from a hostname string
 *
 * @param {string} host
 * @return {String}
 */
module.exports = function extractTldFromHost(hostname) {
  var lastDotIndex = hostname.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return null;
  }

  return hostname.substr(lastDotIndex + 1);
};

},{}],17:[function(require,module,exports){
"use strict";


/**
 * Check if the code point is a digit [0-9]
 *
 * @param {number} code
 * @return boolean
 */
function isDigit(code) {
  // 48 == '0'
  // 57 == '9'
  return code >= 48 && code <= 57;
}


/**
 * Check if the code point is a letter [a-zA-Z]
 *
 * @param {number} code
 * @return boolean
 */
function isAlpha(code) {
  // 97 === 'a'
  // 122 == 'z'
  return code >= 97 && code <= 122;
}


/**
 * Check if a hostname string is valid (according to RFC
 * It's usually a preliminary check before trying to use getDomain or anything else
 *
 * Beware: it does not check if the TLD exists.
 *
 * @api
 * @param {string} hostname
 * @return {boolean}
 */
module.exports = function isValid(hostname) {
  if (typeof hostname !== 'string') {
    return false;
  }

  if (hostname.length > 255) {
    return false;
  }

  if (hostname.length === 0) {
    return false;
  }

  // Check first character: [a-zA-Z0-9]
  var firstCharCode = hostname.charCodeAt(0);
  if (!(isAlpha(firstCharCode) || isDigit(firstCharCode))) {
    return false;
  }

  // Validate hostname according to RFC
  var lastDotIndex = -1;
  var lastCharCode;
  var code;
  var len = hostname.length;

  for (var i = 0; i < len; i += 1) {
    code = hostname.charCodeAt(i);

    if (code === 46) { // '.'
      if (
        // Check that previous label is < 63 bytes long (64 = 63 + '.')
        (i - lastDotIndex) > 64 ||
        // Check that previous character was not already a '.'
        lastCharCode === 46 ||
        // Check that the previous label does not end with a '-'
        lastCharCode === 45
      ) {
        return false;
      }

      lastDotIndex = i;
    } else if (!(isAlpha(code) || isDigit(code) || code === 45)) {
      // Check if there is a forbidden character in the label: [^a-zA-Z0-9-]
      return false;
    }

    lastCharCode = code;
  }

  return (
    // Check that last label is shorter than 63 chars
    (len - lastDotIndex - 1) <= 63 &&
    // Check that the last character is an allowed trailing label character.
    // Since we already checked that the char is a valid hostname character,
    // we only need to check that it's different from '-'.
    lastCharCode !== 45
  );
};

},{}],18:[function(require,module,exports){
'use strict';


var extractTldFromHost = require('./from-host.js');


/**
 * Returns the public suffix (including exact matches)
 *
 * @api
 * @since 1.5
 * @param {string} hostname
 * @return {string}
 */
module.exports = function getPublicSuffix(rules, hostname) {
  // First check if `hostname` is already a valid top-level Domain.
  if (rules.hasTld(hostname)) {
    return hostname;
  }

  var candidate = rules.suffixLookup(hostname);
  if (candidate === null) {
    // Prevailing rule is '*' so we consider the top-level domain to be the
    // public suffix of `hostname` (e.g.: 'example.org' => 'org').
    return extractTldFromHost(hostname);
  }

  return candidate;
};

},{"./from-host.js":16}],19:[function(require,module,exports){
'use strict';


/**
 * Returns the subdomain of a hostname string
 *
 * @api
 * @param {string} hostname
 * @param {string} domain - the root domain of the hostname
 * @return {string|null} a subdomain string if any, blank string if subdomain
 *  is empty, otherwise null.
 */
module.exports = function getSubdomain(hostname, domain) {
  // No domain found? Just abort, abort!
  if (domain === null) {
    return null;
  }

  return hostname.substr(0, hostname.length - domain.length - 1);
};

},{}],20:[function(require,module,exports){
"use strict";

var VALID_HOSTNAME_VALUE = 0;


/**
 * Return min(a, b), handling possible `null` values.
 *
 * @param {number|null} a
 * @param {number|null} b
 * @return {number|null}
 */
function minIndex(a, b) {
  if (a === null) {
    return b;
  } else if (b === null) {
    return a;
  }

  return a < b ? a : b;
}


/**
 * Insert a public suffix rule in the `trie`.
 *
 * @param {object} rule
 * @param {object} trie
 * @return {object} trie (updated)
 */
function insertInTrie(rule, trie) {
  var parts = rule.parts;
  var node = trie;

  for (var i = 0; i < parts.length; i += 1) {
    var part = parts[i];
    var nextNode = node[part];
    if (nextNode === undefined) {
      nextNode = Object.create(null);
      node[part] = nextNode;
    }

    node = nextNode;
  }

  node.$ = VALID_HOSTNAME_VALUE;

  return trie;
}


/**
 * Recursive lookup of `parts` (starting at `index`) in the tree.
 *
 * @param {array} parts
 * @param {object} trie
 * @param {number} index - when to start in `parts` (initially: length - 1)
 * @return {number} size of the suffix found (in number of parts matched)
 */
function lookupInTrie(parts, trie, index) {
  var part;
  var nextNode;
  var publicSuffixIndex = null;

  // We have a match!
  if (trie.$ !== undefined) {
    publicSuffixIndex = index + 1;
  }

  // No more `parts` to look for
  if (index === -1) {
    return publicSuffixIndex;
  }

  part = parts[index];

  // Check branch corresponding to next part of hostname
  nextNode = trie[part];
  if (nextNode !== undefined) {
    publicSuffixIndex = minIndex(
      publicSuffixIndex,
      lookupInTrie(parts, nextNode, index - 1)
    );
  }

  // Check wildcard branch
  nextNode = trie['*'];
  if (nextNode !== undefined) {
    publicSuffixIndex = minIndex(
      publicSuffixIndex,
      lookupInTrie(parts, nextNode, index - 1)
    );
  }

  return publicSuffixIndex;
}


/**
 * Contains the public suffix ruleset as a Trie for efficient look-up.
 *
 * @constructor
 */
function SuffixTrie(rules) {
  this.exceptions = Object.create(null);
  this.rules = Object.create(null);

  if (rules) {
    for (var i = 0; i < rules.length; i += 1) {
      var rule = rules[i];
      if (rule.exception) {
        insertInTrie(rule, this.exceptions);
      } else {
        insertInTrie(rule, this.rules);
      }
    }
  }
}


/**
 * Load the trie from JSON (as serialized by JSON.stringify).
 */
SuffixTrie.fromJson = function (json) {
  var trie = new SuffixTrie();

  trie.exceptions = json.exceptions;
  trie.rules = json.rules;

  return trie;
};


/**
 * Check if `value` is a valid TLD.
 */
SuffixTrie.prototype.hasTld = function (value) {
  // All TLDs are at the root of the Trie.
  return this.rules[value] !== undefined;
};


/**
 * Check if `hostname` has a valid public suffix in `trie`.
 *
 * @param {string} hostname
 * @return {string|null} public suffix
 */
SuffixTrie.prototype.suffixLookup = function (hostname) {
  var parts = hostname.split('.');

  // Look for a match in rules
  var publicSuffixIndex = lookupInTrie(
    parts,
    this.rules,
    parts.length - 1
  );

  if (publicSuffixIndex === null) {
    return null;
  }

  // Look for exceptions
  var exceptionIndex = lookupInTrie(
    parts,
    this.exceptions,
    parts.length - 1
  );

  if (exceptionIndex !== null) {
    return parts.slice(exceptionIndex + 1).join('.');
  }

  return parts.slice(publicSuffixIndex).join('.');
};


module.exports = SuffixTrie;

},{}],21:[function(require,module,exports){
'use strict';


var extractTldFromHost = require('./from-host.js');


/**
 * Checks if the TLD exists for a given hostname
 *
 * @api
 * @param {string} rules
 * @param {string} hostname
 * @return {boolean}
 */
module.exports = function tldExists(rules, hostname) {
  // Easy case, it's a TLD
  if (rules.hasTld(hostname)) {
    return true;
  }

  // Popping only the TLD of the hostname
  var hostTld = extractTldFromHost(hostname);
  if (hostTld === null) {
    return false;
  }

  return rules.hasTld(hostTld);
};

},{"./from-host.js":16}],22:[function(require,module,exports){
module.exports={"exceptions":{"ck":{"www":{"$":0}},"jp":{"kawasaki":{"city":{"$":0}},"kitakyushu":{"city":{"$":0}},"kobe":{"city":{"$":0}},"nagoya":{"city":{"$":0}},"sapporo":{"city":{"$":0}},"sendai":{"city":{"$":0}},"yokohama":{"city":{"$":0}}}},"rules":{"ac":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"net":{"$":0},"mil":{"$":0},"org":{"$":0}},"ad":{"$":0,"nom":{"$":0}},"ae":{"$":0,"co":{"$":0},"net":{"$":0},"org":{"$":0},"sch":{"$":0},"ac":{"$":0},"gov":{"$":0},"mil":{"$":0},"blogspot":{"$":0},"nom":{"$":0}},"aero":{"$":0,"accident-investigation":{"$":0},"accident-prevention":{"$":0},"aerobatic":{"$":0},"aeroclub":{"$":0},"aerodrome":{"$":0},"agents":{"$":0},"aircraft":{"$":0},"airline":{"$":0},"airport":{"$":0},"air-surveillance":{"$":0},"airtraffic":{"$":0},"air-traffic-control":{"$":0},"ambulance":{"$":0},"amusement":{"$":0},"association":{"$":0},"author":{"$":0},"ballooning":{"$":0},"broker":{"$":0},"caa":{"$":0},"cargo":{"$":0},"catering":{"$":0},"certification":{"$":0},"championship":{"$":0},"charter":{"$":0},"civilaviation":{"$":0},"club":{"$":0},"conference":{"$":0},"consultant":{"$":0},"consulting":{"$":0},"control":{"$":0},"council":{"$":0},"crew":{"$":0},"design":{"$":0},"dgca":{"$":0},"educator":{"$":0},"emergency":{"$":0},"engine":{"$":0},"engineer":{"$":0},"entertainment":{"$":0},"equipment":{"$":0},"exchange":{"$":0},"express":{"$":0},"federation":{"$":0},"flight":{"$":0},"freight":{"$":0},"fuel":{"$":0},"gliding":{"$":0},"government":{"$":0},"groundhandling":{"$":0},"group":{"$":0},"hanggliding":{"$":0},"homebuilt":{"$":0},"insurance":{"$":0},"journal":{"$":0},"journalist":{"$":0},"leasing":{"$":0},"logistics":{"$":0},"magazine":{"$":0},"maintenance":{"$":0},"media":{"$":0},"microlight":{"$":0},"modelling":{"$":0},"navigation":{"$":0},"parachuting":{"$":0},"paragliding":{"$":0},"passenger-association":{"$":0},"pilot":{"$":0},"press":{"$":0},"production":{"$":0},"recreation":{"$":0},"repbody":{"$":0},"res":{"$":0},"research":{"$":0},"rotorcraft":{"$":0},"safety":{"$":0},"scientist":{"$":0},"services":{"$":0},"show":{"$":0},"skydiving":{"$":0},"software":{"$":0},"student":{"$":0},"trader":{"$":0},"trading":{"$":0},"trainer":{"$":0},"union":{"$":0},"workinggroup":{"$":0},"works":{"$":0}},"af":{"$":0,"gov":{"$":0},"com":{"$":0},"org":{"$":0},"net":{"$":0},"edu":{"$":0}},"ag":{"$":0,"com":{"$":0},"org":{"$":0},"net":{"$":0},"co":{"$":0},"nom":{"$":0}},"ai":{"$":0,"off":{"$":0},"com":{"$":0},"net":{"$":0},"org":{"$":0},"nom":{"$":0}},"al":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"mil":{"$":0},"net":{"$":0},"org":{"$":0},"blogspot":{"$":0},"nom":{"$":0}},"am":{"$":0,"blogspot":{"$":0}},"ao":{"$":0,"ed":{"$":0},"gv":{"$":0},"og":{"$":0},"co":{"$":0},"pb":{"$":0},"it":{"$":0}},"aq":{"$":0},"ar":{"$":0,"com":{"$":0,"blogspot":{"$":0}},"edu":{"$":0},"gob":{"$":0},"gov":{"$":0},"int":{"$":0},"mil":{"$":0},"musica":{"$":0},"net":{"$":0},"org":{"$":0},"tur":{"$":0}},"arpa":{"$":0,"e164":{"$":0},"in-addr":{"$":0},"ip6":{"$":0},"iris":{"$":0},"uri":{"$":0},"urn":{"$":0}},"as":{"$":0,"gov":{"$":0}},"asia":{"$":0,"cloudns":{"$":0}},"at":{"$":0,"ac":{"$":0},"co":{"$":0,"blogspot":{"$":0}},"gv":{"$":0},"or":{"$":0},"futurecms":{"*":{"$":0}},"futurehosting":{"$":0},"futuremailing":{"$":0},"ortsinfo":{"ex":{"*":{"$":0}},"kunden":{"*":{"$":0}}},"biz":{"$":0},"info":{"$":0},"priv":{"$":0},"12hp":{"$":0},"2ix":{"$":0},"4lima":{"$":0},"lima-city":{"$":0}},"au":{"$":0,"com":{"$":0,"blogspot":{"$":0}},"net":{"$":0},"org":{"$":0},"edu":{"$":0,"act":{"$":0},"nsw":{"$":0},"nt":{"$":0},"qld":{"$":0},"sa":{"$":0},"tas":{"$":0},"vic":{"$":0},"wa":{"$":0}},"gov":{"$":0,"qld":{"$":0},"sa":{"$":0},"tas":{"$":0},"vic":{"$":0},"wa":{"$":0}},"asn":{"$":0},"id":{"$":0},"info":{"$":0},"conf":{"$":0},"oz":{"$":0},"act":{"$":0},"nsw":{"$":0},"nt":{"$":0},"qld":{"$":0},"sa":{"$":0},"tas":{"$":0},"vic":{"$":0},"wa":{"$":0}},"aw":{"$":0,"com":{"$":0}},"ax":{"$":0},"az":{"$":0,"com":{"$":0},"net":{"$":0},"int":{"$":0},"gov":{"$":0},"org":{"$":0},"edu":{"$":0},"info":{"$":0},"pp":{"$":0},"mil":{"$":0},"name":{"$":0},"pro":{"$":0},"biz":{"$":0}},"ba":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"mil":{"$":0},"net":{"$":0},"org":{"$":0},"blogspot":{"$":0}},"bb":{"$":0,"biz":{"$":0},"co":{"$":0},"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"info":{"$":0},"net":{"$":0},"org":{"$":0},"store":{"$":0},"tv":{"$":0}},"bd":{"*":{"$":0}},"be":{"$":0,"ac":{"$":0},"blogspot":{"$":0},"transurl":{"*":{"$":0}}},"bf":{"$":0,"gov":{"$":0}},"bg":{"0":{"$":0},"1":{"$":0},"2":{"$":0},"3":{"$":0},"4":{"$":0},"5":{"$":0},"6":{"$":0},"7":{"$":0},"8":{"$":0},"9":{"$":0},"$":0,"a":{"$":0},"b":{"$":0},"c":{"$":0},"d":{"$":0},"e":{"$":0},"f":{"$":0},"g":{"$":0},"h":{"$":0},"i":{"$":0},"j":{"$":0},"k":{"$":0},"l":{"$":0},"m":{"$":0},"n":{"$":0},"o":{"$":0},"p":{"$":0},"q":{"$":0},"r":{"$":0},"s":{"$":0},"t":{"$":0},"u":{"$":0},"v":{"$":0},"w":{"$":0},"x":{"$":0},"y":{"$":0},"z":{"$":0},"blogspot":{"$":0},"barsy":{"$":0}},"bh":{"$":0,"com":{"$":0},"edu":{"$":0},"net":{"$":0},"org":{"$":0},"gov":{"$":0}},"bi":{"$":0,"co":{"$":0},"com":{"$":0},"edu":{"$":0},"or":{"$":0},"org":{"$":0}},"biz":{"$":0,"cloudns":{"$":0},"dyndns":{"$":0},"for-better":{"$":0},"for-more":{"$":0},"for-some":{"$":0},"for-the":{"$":0},"selfip":{"$":0},"webhop":{"$":0},"mmafan":{"$":0},"myftp":{"$":0},"no-ip":{"$":0},"dscloud":{"$":0}},"bj":{"$":0,"asso":{"$":0},"barreau":{"$":0},"gouv":{"$":0},"blogspot":{"$":0}},"bm":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"net":{"$":0},"org":{"$":0}},"bn":{"*":{"$":0}},"bo":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"gob":{"$":0},"int":{"$":0},"org":{"$":0},"net":{"$":0},"mil":{"$":0},"tv":{"$":0}},"br":{"$":0,"adm":{"$":0},"adv":{"$":0},"agr":{"$":0},"am":{"$":0},"arq":{"$":0},"art":{"$":0},"ato":{"$":0},"b":{"$":0},"belem":{"$":0},"bio":{"$":0},"blog":{"$":0},"bmd":{"$":0},"cim":{"$":0},"cng":{"$":0},"cnt":{"$":0},"com":{"$":0,"blogspot":{"$":0}},"coop":{"$":0},"cri":{"$":0},"def":{"$":0},"ecn":{"$":0},"eco":{"$":0},"edu":{"$":0},"emp":{"$":0},"eng":{"$":0},"esp":{"$":0},"etc":{"$":0},"eti":{"$":0},"far":{"$":0},"flog":{"$":0},"floripa":{"$":0},"fm":{"$":0},"fnd":{"$":0},"fot":{"$":0},"fst":{"$":0},"g12":{"$":0},"ggf":{"$":0},"gov":{"$":0,"ac":{"$":0},"al":{"$":0},"am":{"$":0},"ap":{"$":0},"ba":{"$":0},"ce":{"$":0},"df":{"$":0},"es":{"$":0},"go":{"$":0},"ma":{"$":0},"mg":{"$":0},"ms":{"$":0},"mt":{"$":0},"pa":{"$":0},"pb":{"$":0},"pe":{"$":0},"pi":{"$":0},"pr":{"$":0},"rj":{"$":0},"rn":{"$":0},"ro":{"$":0},"rr":{"$":0},"rs":{"$":0},"sc":{"$":0},"se":{"$":0},"sp":{"$":0},"to":{"$":0}},"imb":{"$":0},"ind":{"$":0},"inf":{"$":0},"jampa":{"$":0},"jor":{"$":0},"jus":{"$":0},"leg":{"$":0,"ac":{"$":0},"al":{"$":0},"am":{"$":0},"ap":{"$":0},"ba":{"$":0},"ce":{"$":0},"df":{"$":0},"es":{"$":0},"go":{"$":0},"ma":{"$":0},"mg":{"$":0},"ms":{"$":0},"mt":{"$":0},"pa":{"$":0},"pb":{"$":0},"pe":{"$":0},"pi":{"$":0},"pr":{"$":0},"rj":{"$":0},"rn":{"$":0},"ro":{"$":0},"rr":{"$":0},"rs":{"$":0},"sc":{"$":0},"se":{"$":0},"sp":{"$":0},"to":{"$":0}},"lel":{"$":0},"mat":{"$":0},"med":{"$":0},"mil":{"$":0},"mp":{"$":0},"mus":{"$":0},"net":{"$":0},"nom":{"*":{"$":0}},"not":{"$":0},"ntr":{"$":0},"odo":{"$":0},"org":{"$":0},"poa":{"$":0},"ppg":{"$":0},"pro":{"$":0},"psc":{"$":0},"psi":{"$":0},"qsl":{"$":0},"radio":{"$":0},"rec":{"$":0},"recife":{"$":0},"slg":{"$":0},"srv":{"$":0},"taxi":{"$":0},"teo":{"$":0},"tmp":{"$":0},"trd":{"$":0},"tur":{"$":0},"tv":{"$":0},"vet":{"$":0},"vix":{"$":0},"vlog":{"$":0},"wiki":{"$":0},"zlg":{"$":0}},"bs":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"edu":{"$":0},"gov":{"$":0},"we":{"$":0}},"bt":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"net":{"$":0},"org":{"$":0}},"bv":{"$":0},"bw":{"$":0,"co":{"$":0},"org":{"$":0}},"by":{"$":0,"gov":{"$":0},"mil":{"$":0},"com":{"$":0,"blogspot":{"$":0}},"of":{"$":0},"nym":{"$":0}},"bz":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"edu":{"$":0},"gov":{"$":0},"za":{"$":0},"nym":{"$":0}},"ca":{"$":0,"ab":{"$":0},"bc":{"$":0},"mb":{"$":0},"nb":{"$":0},"nf":{"$":0},"nl":{"$":0},"ns":{"$":0},"nt":{"$":0},"nu":{"$":0},"on":{"$":0},"pe":{"$":0},"qc":{"$":0},"sk":{"$":0},"yk":{"$":0},"gc":{"$":0},"awdev":{"*":{"$":0}},"co":{"$":0},"blogspot":{"$":0},"no-ip":{"$":0}},"cat":{"$":0},"cc":{"$":0,"cloudns":{"$":0},"ftpaccess":{"$":0},"game-server":{"$":0},"myphotos":{"$":0},"scrapping":{"$":0},"twmail":{"$":0},"fantasyleague":{"$":0}},"cd":{"$":0,"gov":{"$":0}},"cf":{"$":0,"blogspot":{"$":0}},"cg":{"$":0},"ch":{"$":0,"square7":{"$":0},"blogspot":{"$":0},"gotdns":{"$":0},"12hp":{"$":0},"2ix":{"$":0},"4lima":{"$":0},"lima-city":{"$":0}},"ci":{"$":0,"org":{"$":0},"or":{"$":0},"com":{"$":0},"co":{"$":0},"edu":{"$":0},"ed":{"$":0},"ac":{"$":0},"net":{"$":0},"go":{"$":0},"asso":{"$":0},"xn--aroport-bya":{"$":0},"int":{"$":0},"presse":{"$":0},"md":{"$":0},"gouv":{"$":0}},"ck":{"*":{"$":0}},"cl":{"$":0,"gov":{"$":0},"gob":{"$":0},"co":{"$":0},"mil":{"$":0},"blogspot":{"$":0},"nom":{"$":0}},"cm":{"$":0,"co":{"$":0},"com":{"$":0},"gov":{"$":0},"net":{"$":0}},"cn":{"$":0,"ac":{"$":0},"com":{"$":0,"amazonaws":{"compute":{"*":{"$":0}},"eb":{"cn-north-1":{"$":0}},"elb":{"*":{"$":0}},"cn-north-1":{"s3":{"$":0}}}},"edu":{"$":0},"gov":{"$":0},"net":{"$":0},"org":{"$":0},"mil":{"$":0},"xn--55qx5d":{"$":0},"xn--io0a7i":{"$":0},"xn--od0alg":{"$":0},"ah":{"$":0},"bj":{"$":0},"cq":{"$":0},"fj":{"$":0},"gd":{"$":0},"gs":{"$":0},"gz":{"$":0},"gx":{"$":0},"ha":{"$":0},"hb":{"$":0},"he":{"$":0},"hi":{"$":0},"hl":{"$":0},"hn":{"$":0},"jl":{"$":0},"js":{"$":0},"jx":{"$":0},"ln":{"$":0},"nm":{"$":0},"nx":{"$":0},"qh":{"$":0},"sc":{"$":0},"sd":{"$":0},"sh":{"$":0},"sn":{"$":0},"sx":{"$":0},"tj":{"$":0},"xj":{"$":0},"xz":{"$":0},"yn":{"$":0},"zj":{"$":0},"hk":{"$":0},"mo":{"$":0},"tw":{"$":0}},"co":{"$":0,"arts":{"$":0},"com":{"$":0,"blogspot":{"$":0}},"edu":{"$":0},"firm":{"$":0},"gov":{"$":0},"info":{"$":0},"int":{"$":0},"mil":{"$":0},"net":{"$":0},"nom":{"$":0},"org":{"$":0},"rec":{"$":0},"web":{"$":0},"nodum":{"$":0}},"com":{"$":0,"amazonaws":{"compute":{"*":{"$":0}},"compute-1":{"*":{"$":0}},"us-east-1":{"$":0,"dualstack":{"s3":{"$":0}}},"elb":{"*":{"$":0}},"s3":{"$":0},"s3-ap-northeast-1":{"$":0},"s3-ap-northeast-2":{"$":0},"s3-ap-south-1":{"$":0},"s3-ap-southeast-1":{"$":0},"s3-ap-southeast-2":{"$":0},"s3-ca-central-1":{"$":0},"s3-eu-central-1":{"$":0},"s3-eu-west-1":{"$":0},"s3-eu-west-2":{"$":0},"s3-external-1":{"$":0},"s3-fips-us-gov-west-1":{"$":0},"s3-sa-east-1":{"$":0},"s3-us-gov-west-1":{"$":0},"s3-us-east-2":{"$":0},"s3-us-west-1":{"$":0},"s3-us-west-2":{"$":0},"ap-northeast-2":{"s3":{"$":0},"dualstack":{"s3":{"$":0}},"s3-website":{"$":0}},"ap-south-1":{"s3":{"$":0},"dualstack":{"s3":{"$":0}},"s3-website":{"$":0}},"ca-central-1":{"s3":{"$":0},"dualstack":{"s3":{"$":0}},"s3-website":{"$":0}},"eu-central-1":{"s3":{"$":0},"dualstack":{"s3":{"$":0}},"s3-website":{"$":0}},"eu-west-2":{"s3":{"$":0},"dualstack":{"s3":{"$":0}},"s3-website":{"$":0}},"us-east-2":{"s3":{"$":0},"dualstack":{"s3":{"$":0}},"s3-website":{"$":0}},"ap-northeast-1":{"dualstack":{"s3":{"$":0}}},"ap-southeast-1":{"dualstack":{"s3":{"$":0}}},"ap-southeast-2":{"dualstack":{"s3":{"$":0}}},"eu-west-1":{"dualstack":{"s3":{"$":0}}},"sa-east-1":{"dualstack":{"s3":{"$":0}}},"s3-website-us-east-1":{"$":0},"s3-website-us-west-1":{"$":0},"s3-website-us-west-2":{"$":0},"s3-website-ap-northeast-1":{"$":0},"s3-website-ap-southeast-1":{"$":0},"s3-website-ap-southeast-2":{"$":0},"s3-website-eu-west-1":{"$":0},"s3-website-sa-east-1":{"$":0}},"elasticbeanstalk":{"$":0,"ap-northeast-1":{"$":0},"ap-northeast-2":{"$":0},"ap-south-1":{"$":0},"ap-southeast-1":{"$":0},"ap-southeast-2":{"$":0},"ca-central-1":{"$":0},"eu-central-1":{"$":0},"eu-west-1":{"$":0},"eu-west-2":{"$":0},"sa-east-1":{"$":0},"us-east-1":{"$":0},"us-east-2":{"$":0},"us-gov-west-1":{"$":0},"us-west-1":{"$":0},"us-west-2":{"$":0}},"on-aptible":{"$":0},"myasustor":{"$":0},"betainabox":{"$":0},"bplaced":{"$":0},"ar":{"$":0},"br":{"$":0},"cn":{"$":0},"de":{"$":0},"eu":{"$":0},"gb":{"$":0},"hu":{"$":0},"jpn":{"$":0},"kr":{"$":0},"mex":{"$":0},"no":{"$":0},"qc":{"$":0},"ru":{"$":0},"sa":{"$":0},"se":{"$":0},"uk":{"$":0},"us":{"$":0},"uy":{"$":0},"za":{"$":0},"africa":{"$":0},"gr":{"$":0},"co":{"$":0},"xenapponazure":{"$":0},"jdevcloud":{"$":0},"wpdevcloud":{"$":0},"cloudcontrolled":{"$":0},"cloudcontrolapp":{"$":0},"drayddns":{"$":0},"dreamhosters":{"$":0},"mydrobo":{"$":0},"dyndns-at-home":{"$":0},"dyndns-at-work":{"$":0},"dyndns-blog":{"$":0},"dyndns-free":{"$":0},"dyndns-home":{"$":0},"dyndns-ip":{"$":0},"dyndns-mail":{"$":0},"dyndns-office":{"$":0},"dyndns-pics":{"$":0},"dyndns-remote":{"$":0},"dyndns-server":{"$":0},"dyndns-web":{"$":0},"dyndns-wiki":{"$":0},"dyndns-work":{"$":0},"blogdns":{"$":0},"cechire":{"$":0},"dnsalias":{"$":0},"dnsdojo":{"$":0},"doesntexist":{"$":0},"dontexist":{"$":0},"doomdns":{"$":0},"dyn-o-saur":{"$":0},"dynalias":{"$":0},"est-a-la-maison":{"$":0},"est-a-la-masion":{"$":0},"est-le-patron":{"$":0},"est-mon-blogueur":{"$":0},"from-ak":{"$":0},"from-al":{"$":0},"from-ar":{"$":0},"from-ca":{"$":0},"from-ct":{"$":0},"from-dc":{"$":0},"from-de":{"$":0},"from-fl":{"$":0},"from-ga":{"$":0},"from-hi":{"$":0},"from-ia":{"$":0},"from-id":{"$":0},"from-il":{"$":0},"from-in":{"$":0},"from-ks":{"$":0},"from-ky":{"$":0},"from-ma":{"$":0},"from-md":{"$":0},"from-mi":{"$":0},"from-mn":{"$":0},"from-mo":{"$":0},"from-ms":{"$":0},"from-mt":{"$":0},"from-nc":{"$":0},"from-nd":{"$":0},"from-ne":{"$":0},"from-nh":{"$":0},"from-nj":{"$":0},"from-nm":{"$":0},"from-nv":{"$":0},"from-oh":{"$":0},"from-ok":{"$":0},"from-or":{"$":0},"from-pa":{"$":0},"from-pr":{"$":0},"from-ri":{"$":0},"from-sc":{"$":0},"from-sd":{"$":0},"from-tn":{"$":0},"from-tx":{"$":0},"from-ut":{"$":0},"from-va":{"$":0},"from-vt":{"$":0},"from-wa":{"$":0},"from-wi":{"$":0},"from-wv":{"$":0},"from-wy":{"$":0},"getmyip":{"$":0},"gotdns":{"$":0},"hobby-site":{"$":0},"homelinux":{"$":0},"homeunix":{"$":0},"iamallama":{"$":0},"is-a-anarchist":{"$":0},"is-a-blogger":{"$":0},"is-a-bookkeeper":{"$":0},"is-a-bulls-fan":{"$":0},"is-a-caterer":{"$":0},"is-a-chef":{"$":0},"is-a-conservative":{"$":0},"is-a-cpa":{"$":0},"is-a-cubicle-slave":{"$":0},"is-a-democrat":{"$":0},"is-a-designer":{"$":0},"is-a-doctor":{"$":0},"is-a-financialadvisor":{"$":0},"is-a-geek":{"$":0},"is-a-green":{"$":0},"is-a-guru":{"$":0},"is-a-hard-worker":{"$":0},"is-a-hunter":{"$":0},"is-a-landscaper":{"$":0},"is-a-lawyer":{"$":0},"is-a-liberal":{"$":0},"is-a-libertarian":{"$":0},"is-a-llama":{"$":0},"is-a-musician":{"$":0},"is-a-nascarfan":{"$":0},"is-a-nurse":{"$":0},"is-a-painter":{"$":0},"is-a-personaltrainer":{"$":0},"is-a-photographer":{"$":0},"is-a-player":{"$":0},"is-a-republican":{"$":0},"is-a-rockstar":{"$":0},"is-a-socialist":{"$":0},"is-a-student":{"$":0},"is-a-teacher":{"$":0},"is-a-techie":{"$":0},"is-a-therapist":{"$":0},"is-an-accountant":{"$":0},"is-an-actor":{"$":0},"is-an-actress":{"$":0},"is-an-anarchist":{"$":0},"is-an-artist":{"$":0},"is-an-engineer":{"$":0},"is-an-entertainer":{"$":0},"is-certified":{"$":0},"is-gone":{"$":0},"is-into-anime":{"$":0},"is-into-cars":{"$":0},"is-into-cartoons":{"$":0},"is-into-games":{"$":0},"is-leet":{"$":0},"is-not-certified":{"$":0},"is-slick":{"$":0},"is-uberleet":{"$":0},"is-with-theband":{"$":0},"isa-geek":{"$":0},"isa-hockeynut":{"$":0},"issmarterthanyou":{"$":0},"likes-pie":{"$":0},"likescandy":{"$":0},"neat-url":{"$":0},"saves-the-whales":{"$":0},"selfip":{"$":0},"sells-for-less":{"$":0},"sells-for-u":{"$":0},"servebbs":{"$":0},"simple-url":{"$":0},"space-to-rent":{"$":0},"teaches-yoga":{"$":0},"writesthisblog":{"$":0},"ddnsfree":{"$":0},"ddnsgeek":{"$":0},"giize":{"$":0},"gleeze":{"$":0},"kozow":{"$":0},"loseyourip":{"$":0},"ooguy":{"$":0},"theworkpc":{"$":0},"mytuleap":{"$":0},"evennode":{"eu-1":{"$":0},"eu-2":{"$":0},"eu-3":{"$":0},"eu-4":{"$":0},"us-1":{"$":0},"us-2":{"$":0},"us-3":{"$":0},"us-4":{"$":0}},"fbsbx":{"apps":{"$":0}},"firebaseapp":{"$":0},"flynnhub":{"$":0},"freebox-os":{"$":0},"freeboxos":{"$":0},"githubusercontent":{"$":0},"0emm":{"*":{"$":0}},"appspot":{"$":0},"blogspot":{"$":0},"codespot":{"$":0},"googleapis":{"$":0},"googlecode":{"$":0},"pagespeedmobilizer":{"$":0},"publishproxy":{"$":0},"withgoogle":{"$":0},"withyoutube":{"$":0},"herokuapp":{"$":0},"herokussl":{"$":0},"pixolino":{"$":0},"joyent":{"cns":{"*":{"$":0}}},"barsyonline":{"$":0},"meteorapp":{"$":0,"eu":{"$":0}},"bitballoon":{"$":0},"netlify":{"$":0},"4u":{"$":0},"nfshost":{"$":0},"blogsyte":{"$":0},"ciscofreak":{"$":0},"damnserver":{"$":0},"ditchyourip":{"$":0},"dnsiskinky":{"$":0},"dynns":{"$":0},"geekgalaxy":{"$":0},"health-carereform":{"$":0},"homesecuritymac":{"$":0},"homesecuritypc":{"$":0},"myactivedirectory":{"$":0},"mysecuritycamera":{"$":0},"net-freaks":{"$":0},"onthewifi":{"$":0},"point2this":{"$":0},"quicksytes":{"$":0},"securitytactics":{"$":0},"serveexchange":{"$":0},"servehumour":{"$":0},"servep2p":{"$":0},"servesarcasm":{"$":0},"stufftoread":{"$":0},"unusualperson":{"$":0},"workisboring":{"$":0},"3utilities":{"$":0},"ddnsking":{"$":0},"myvnc":{"$":0},"servebeer":{"$":0},"servecounterstrike":{"$":0},"serveftp":{"$":0},"servegame":{"$":0},"servehalflife":{"$":0},"servehttp":{"$":0},"serveirc":{"$":0},"servemp3":{"$":0},"servepics":{"$":0},"servequake":{"$":0},"operaunite":{"$":0},"outsystemscloud":{"$":0},"ownprovider":{"$":0},"pgfog":{"$":0},"pagefrontapp":{"$":0},"gotpantheon":{"$":0},"prgmr":{"xen":{"$":0}},"qa2":{"$":0},"dev-myqnapcloud":{"$":0},"alpha-myqnapcloud":{"$":0},"myqnapcloud":{"$":0},"quipelements":{"*":{"$":0}},"rackmaze":{"$":0},"rhcloud":{"$":0},"logoip":{"$":0},"firewall-gateway":{"$":0},"myshopblocks":{"$":0},"1kapp":{"$":0},"appchizi":{"$":0},"applinzi":{"$":0},"sinaapp":{"$":0},"vipsinaapp":{"$":0},"bounty-full":{"$":0,"alpha":{"$":0},"beta":{"$":0}},"temp-dns":{"$":0},"dsmynas":{"$":0},"familyds":{"$":0},"bloxcms":{"$":0},"townnews-staging":{"$":0},"hk":{"$":0},"remotewd":{"$":0},"yolasite":{"$":0}},"coop":{"$":0},"cr":{"$":0,"ac":{"$":0},"co":{"$":0},"ed":{"$":0},"fi":{"$":0},"go":{"$":0},"or":{"$":0},"sa":{"$":0}},"cu":{"$":0,"com":{"$":0},"edu":{"$":0},"org":{"$":0},"net":{"$":0},"gov":{"$":0},"inf":{"$":0}},"cv":{"$":0,"blogspot":{"$":0}},"cw":{"$":0,"com":{"$":0},"edu":{"$":0},"net":{"$":0},"org":{"$":0}},"cx":{"$":0,"gov":{"$":0},"ath":{"$":0},"info":{"$":0}},"cy":{"$":0,"ac":{"$":0},"biz":{"$":0},"com":{"$":0,"blogspot":{"$":0}},"ekloges":{"$":0},"gov":{"$":0},"ltd":{"$":0},"name":{"$":0},"net":{"$":0},"org":{"$":0},"parliament":{"$":0},"press":{"$":0},"pro":{"$":0},"tm":{"$":0}},"cz":{"$":0,"co":{"$":0},"realm":{"$":0},"e4":{"$":0},"blogspot":{"$":0},"metacentrum":{"cloud":{"$":0},"custom":{"$":0}}},"de":{"$":0,"bplaced":{"$":0},"square7":{"$":0},"com":{"$":0},"cosidns":{"dyn":{"$":0}},"dynamisches-dns":{"$":0},"dnsupdater":{"$":0},"internet-dns":{"$":0},"l-o-g-i-n":{"$":0},"dnshome":{"$":0},"fuettertdasnetz":{"$":0},"isteingeek":{"$":0},"istmein":{"$":0},"lebtimnetz":{"$":0},"leitungsen":{"$":0},"traeumtgerade":{"$":0},"ddnss":{"$":0,"dyn":{"$":0},"dyndns":{"$":0}},"dyndns1":{"$":0},"dyn-ip24":{"$":0},"home-webserver":{"$":0,"dyn":{"$":0}},"myhome-server":{"$":0},"goip":{"$":0},"blogspot":{"$":0},"keymachine":{"$":0},"git-repos":{"$":0},"lcube-server":{"$":0},"svn-repos":{"$":0},"barsy":{"$":0},"logoip":{"$":0},"firewall-gateway":{"$":0},"my-gateway":{"$":0},"my-router":{"$":0},"spdns":{"$":0},"taifun-dns":{"$":0},"12hp":{"$":0},"2ix":{"$":0},"4lima":{"$":0},"lima-city":{"$":0},"dd-dns":{"$":0},"dray-dns":{"$":0},"draydns":{"$":0},"dyn-vpn":{"$":0},"dynvpn":{"$":0},"mein-vigor":{"$":0},"my-vigor":{"$":0},"my-wan":{"$":0},"syno-ds":{"$":0},"synology-diskstation":{"$":0},"synology-ds":{"$":0}},"dj":{"$":0},"dk":{"$":0,"biz":{"$":0},"co":{"$":0},"firm":{"$":0},"reg":{"$":0},"store":{"$":0},"blogspot":{"$":0}},"dm":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"edu":{"$":0},"gov":{"$":0}},"do":{"$":0,"art":{"$":0},"com":{"$":0},"edu":{"$":0},"gob":{"$":0},"gov":{"$":0},"mil":{"$":0},"net":{"$":0},"org":{"$":0},"sld":{"$":0},"web":{"$":0}},"dz":{"$":0,"com":{"$":0},"org":{"$":0},"net":{"$":0},"gov":{"$":0},"edu":{"$":0},"asso":{"$":0},"pol":{"$":0},"art":{"$":0}},"ec":{"$":0,"com":{"$":0},"info":{"$":0},"net":{"$":0},"fin":{"$":0},"k12":{"$":0},"med":{"$":0},"pro":{"$":0},"org":{"$":0},"edu":{"$":0},"gov":{"$":0},"gob":{"$":0},"mil":{"$":0}},"edu":{"$":0},"ee":{"$":0,"edu":{"$":0},"gov":{"$":0},"riik":{"$":0},"lib":{"$":0},"med":{"$":0},"com":{"$":0,"blogspot":{"$":0}},"pri":{"$":0},"aip":{"$":0},"org":{"$":0},"fie":{"$":0}},"eg":{"$":0,"com":{"$":0,"blogspot":{"$":0}},"edu":{"$":0},"eun":{"$":0},"gov":{"$":0},"mil":{"$":0},"name":{"$":0},"net":{"$":0},"org":{"$":0},"sci":{"$":0}},"er":{"*":{"$":0}},"es":{"$":0,"com":{"$":0,"blogspot":{"$":0}},"nom":{"$":0},"org":{"$":0},"gob":{"$":0},"edu":{"$":0}},"et":{"$":0,"com":{"$":0},"gov":{"$":0},"org":{"$":0},"edu":{"$":0},"biz":{"$":0},"name":{"$":0},"info":{"$":0},"net":{"$":0}},"eu":{"$":0,"mycd":{"$":0},"cloudns":{"$":0},"barsy":{"$":0},"wellbeingzone":{"$":0},"spdns":{"$":0},"transurl":{"*":{"$":0}},"diskstation":{"$":0}},"fi":{"$":0,"aland":{"$":0},"dy":{"$":0},"blogspot":{"$":0},"iki":{"$":0}},"fj":{"*":{"$":0}},"fk":{"*":{"$":0}},"fm":{"$":0},"fo":{"$":0},"fr":{"$":0,"com":{"$":0},"asso":{"$":0},"nom":{"$":0},"prd":{"$":0},"presse":{"$":0},"tm":{"$":0},"aeroport":{"$":0},"assedic":{"$":0},"avocat":{"$":0},"avoues":{"$":0},"cci":{"$":0},"chambagri":{"$":0},"chirurgiens-dentistes":{"$":0},"experts-comptables":{"$":0},"geometre-expert":{"$":0},"gouv":{"$":0},"greta":{"$":0},"huissier-justice":{"$":0},"medecin":{"$":0},"notaires":{"$":0},"pharmacien":{"$":0},"port":{"$":0},"veterinaire":{"$":0},"fbx-os":{"$":0},"fbxos":{"$":0},"freebox-os":{"$":0},"freeboxos":{"$":0},"blogspot":{"$":0},"on-web":{"$":0},"chirurgiens-dentistes-en-france":{"$":0}},"ga":{"$":0},"gb":{"$":0},"gd":{"$":0,"nom":{"$":0}},"ge":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"org":{"$":0},"mil":{"$":0},"net":{"$":0},"pvt":{"$":0}},"gf":{"$":0},"gg":{"$":0,"co":{"$":0},"net":{"$":0},"org":{"$":0},"cya":{"$":0}},"gh":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"org":{"$":0},"mil":{"$":0}},"gi":{"$":0,"com":{"$":0},"ltd":{"$":0},"gov":{"$":0},"mod":{"$":0},"edu":{"$":0},"org":{"$":0}},"gl":{"$":0,"co":{"$":0},"com":{"$":0},"edu":{"$":0},"net":{"$":0},"org":{"$":0},"nom":{"$":0}},"gm":{"$":0},"gn":{"$":0,"ac":{"$":0},"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"org":{"$":0},"net":{"$":0}},"gov":{"$":0},"gp":{"$":0,"com":{"$":0},"net":{"$":0},"mobi":{"$":0},"edu":{"$":0},"org":{"$":0},"asso":{"$":0}},"gq":{"$":0},"gr":{"$":0,"com":{"$":0},"edu":{"$":0},"net":{"$":0},"org":{"$":0},"gov":{"$":0},"blogspot":{"$":0},"nym":{"$":0}},"gs":{"$":0},"gt":{"$":0,"com":{"$":0},"edu":{"$":0},"gob":{"$":0},"ind":{"$":0},"mil":{"$":0},"net":{"$":0},"org":{"$":0},"nom":{"$":0}},"gu":{"*":{"$":0}},"gw":{"$":0},"gy":{"$":0,"co":{"$":0},"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"net":{"$":0},"org":{"$":0}},"hk":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"idv":{"$":0},"net":{"$":0},"org":{"$":0},"xn--55qx5d":{"$":0},"xn--wcvs22d":{"$":0},"xn--lcvr32d":{"$":0},"xn--mxtq1m":{"$":0},"xn--gmqw5a":{"$":0},"xn--ciqpn":{"$":0},"xn--gmq050i":{"$":0},"xn--zf0avx":{"$":0},"xn--io0a7i":{"$":0},"xn--mk0axi":{"$":0},"xn--od0alg":{"$":0},"xn--od0aq3b":{"$":0},"xn--tn0ag":{"$":0},"xn--uc0atv":{"$":0},"xn--uc0ay4a":{"$":0},"blogspot":{"$":0},"ltd":{"$":0},"inc":{"$":0}},"hm":{"$":0},"hn":{"$":0,"com":{"$":0},"edu":{"$":0},"org":{"$":0},"net":{"$":0},"mil":{"$":0},"gob":{"$":0},"nom":{"$":0}},"hr":{"$":0,"iz":{"$":0},"from":{"$":0},"name":{"$":0},"com":{"$":0},"blogspot":{"$":0}},"ht":{"$":0,"com":{"$":0},"shop":{"$":0},"firm":{"$":0},"info":{"$":0},"adult":{"$":0},"net":{"$":0},"pro":{"$":0},"org":{"$":0},"med":{"$":0},"art":{"$":0},"coop":{"$":0},"pol":{"$":0},"asso":{"$":0},"edu":{"$":0},"rel":{"$":0},"gouv":{"$":0},"perso":{"$":0}},"hu":{"2000":{"$":0},"$":0,"co":{"$":0},"info":{"$":0},"org":{"$":0},"priv":{"$":0},"sport":{"$":0},"tm":{"$":0},"agrar":{"$":0},"bolt":{"$":0},"casino":{"$":0},"city":{"$":0},"erotica":{"$":0},"erotika":{"$":0},"film":{"$":0},"forum":{"$":0},"games":{"$":0},"hotel":{"$":0},"ingatlan":{"$":0},"jogasz":{"$":0},"konyvelo":{"$":0},"lakas":{"$":0},"media":{"$":0},"news":{"$":0},"reklam":{"$":0},"sex":{"$":0},"shop":{"$":0},"suli":{"$":0},"szex":{"$":0},"tozsde":{"$":0},"utazas":{"$":0},"video":{"$":0},"blogspot":{"$":0}},"id":{"$":0,"ac":{"$":0},"biz":{"$":0},"co":{"$":0,"blogspot":{"$":0}},"desa":{"$":0},"go":{"$":0},"mil":{"$":0},"my":{"$":0},"net":{"$":0},"or":{"$":0},"sch":{"$":0},"web":{"$":0}},"ie":{"$":0,"gov":{"$":0},"blogspot":{"$":0}},"il":{"$":0,"ac":{"$":0},"co":{"$":0,"blogspot":{"$":0}},"gov":{"$":0},"idf":{"$":0},"k12":{"$":0},"muni":{"$":0},"net":{"$":0},"org":{"$":0}},"im":{"$":0,"ac":{"$":0},"co":{"$":0,"ltd":{"$":0},"plc":{"$":0}},"com":{"$":0},"net":{"$":0},"org":{"$":0},"tt":{"$":0},"tv":{"$":0},"ro":{"$":0},"nom":{"$":0}},"in":{"$":0,"co":{"$":0},"firm":{"$":0},"net":{"$":0},"org":{"$":0},"gen":{"$":0},"ind":{"$":0},"nic":{"$":0},"ac":{"$":0},"edu":{"$":0},"res":{"$":0},"gov":{"$":0},"mil":{"$":0},"cloudns":{"$":0},"blogspot":{"$":0},"barsy":{"$":0}},"info":{"$":0,"cloudns":{"$":0},"dynamic-dns":{"$":0},"dyndns":{"$":0},"barrel-of-knowledge":{"$":0},"barrell-of-knowledge":{"$":0},"for-our":{"$":0},"groks-the":{"$":0},"groks-this":{"$":0},"here-for-more":{"$":0},"knowsitall":{"$":0},"selfip":{"$":0},"webhop":{"$":0},"nsupdate":{"$":0},"dvrcam":{"$":0},"ilovecollege":{"$":0},"no-ip":{"$":0},"v-info":{"$":0}},"int":{"$":0,"eu":{"$":0}},"io":{"$":0,"com":{"$":0},"backplaneapp":{"$":0},"boxfuse":{"$":0},"browsersafetymark":{"$":0},"dedyn":{"$":0},"drud":{"$":0},"definima":{"$":0},"enonic":{"$":0,"customer":{"$":0}},"github":{"$":0},"gitlab":{"$":0},"hasura-app":{"$":0},"ngrok":{"$":0},"nodeart":{"stage":{"$":0}},"nodum":{"$":0},"nid":{"$":0},"pantheonsite":{"$":0},"protonet":{"$":0},"vaporcloud":{"$":0},"hzc":{"$":0},"sandcats":{"$":0},"shiftedit":{"$":0},"lair":{"apps":{"$":0}},"stolos":{"*":{"$":0}},"spacekit":{"$":0},"thingdust":{"dev":{"cust":{"$":0}},"disrec":{"cust":{"$":0}},"prod":{"cust":{"$":0}},"testing":{"cust":{"$":0}}},"wedeploy":{"$":0}},"iq":{"$":0,"gov":{"$":0},"edu":{"$":0},"mil":{"$":0},"com":{"$":0},"org":{"$":0},"net":{"$":0}},"ir":{"$":0,"ac":{"$":0},"co":{"$":0},"gov":{"$":0},"id":{"$":0},"net":{"$":0},"org":{"$":0},"sch":{"$":0},"xn--mgba3a4f16a":{"$":0},"xn--mgba3a4fra":{"$":0}},"is":{"$":0,"net":{"$":0},"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"org":{"$":0},"int":{"$":0},"cupcake":{"$":0},"blogspot":{"$":0}},"it":{"$":0,"gov":{"$":0},"edu":{"$":0},"abr":{"$":0},"abruzzo":{"$":0},"aosta-valley":{"$":0},"aostavalley":{"$":0},"bas":{"$":0},"basilicata":{"$":0},"cal":{"$":0},"calabria":{"$":0},"cam":{"$":0},"campania":{"$":0},"emilia-romagna":{"$":0},"emiliaromagna":{"$":0},"emr":{"$":0},"friuli-v-giulia":{"$":0},"friuli-ve-giulia":{"$":0},"friuli-vegiulia":{"$":0},"friuli-venezia-giulia":{"$":0},"friuli-veneziagiulia":{"$":0},"friuli-vgiulia":{"$":0},"friuliv-giulia":{"$":0},"friulive-giulia":{"$":0},"friulivegiulia":{"$":0},"friulivenezia-giulia":{"$":0},"friuliveneziagiulia":{"$":0},"friulivgiulia":{"$":0},"fvg":{"$":0},"laz":{"$":0},"lazio":{"$":0},"lig":{"$":0},"liguria":{"$":0},"lom":{"$":0},"lombardia":{"$":0},"lombardy":{"$":0},"lucania":{"$":0},"mar":{"$":0},"marche":{"$":0},"mol":{"$":0},"molise":{"$":0},"piedmont":{"$":0},"piemonte":{"$":0},"pmn":{"$":0},"pug":{"$":0},"puglia":{"$":0},"sar":{"$":0},"sardegna":{"$":0},"sardinia":{"$":0},"sic":{"$":0},"sicilia":{"$":0},"sicily":{"$":0},"taa":{"$":0},"tos":{"$":0},"toscana":{"$":0},"trentino-a-adige":{"$":0},"trentino-aadige":{"$":0},"trentino-alto-adige":{"$":0},"trentino-altoadige":{"$":0},"trentino-s-tirol":{"$":0},"trentino-stirol":{"$":0},"trentino-sud-tirol":{"$":0},"trentino-sudtirol":{"$":0},"trentino-sued-tirol":{"$":0},"trentino-suedtirol":{"$":0},"trentinoa-adige":{"$":0},"trentinoaadige":{"$":0},"trentinoalto-adige":{"$":0},"trentinoaltoadige":{"$":0},"trentinos-tirol":{"$":0},"trentinostirol":{"$":0},"trentinosud-tirol":{"$":0},"trentinosudtirol":{"$":0},"trentinosued-tirol":{"$":0},"trentinosuedtirol":{"$":0},"tuscany":{"$":0},"umb":{"$":0},"umbria":{"$":0},"val-d-aosta":{"$":0},"val-daosta":{"$":0},"vald-aosta":{"$":0},"valdaosta":{"$":0},"valle-aosta":{"$":0},"valle-d-aosta":{"$":0},"valle-daosta":{"$":0},"valleaosta":{"$":0},"valled-aosta":{"$":0},"valledaosta":{"$":0},"vallee-aoste":{"$":0},"valleeaoste":{"$":0},"vao":{"$":0},"vda":{"$":0},"ven":{"$":0},"veneto":{"$":0},"ag":{"$":0},"agrigento":{"$":0},"al":{"$":0},"alessandria":{"$":0},"alto-adige":{"$":0},"altoadige":{"$":0},"an":{"$":0},"ancona":{"$":0},"andria-barletta-trani":{"$":0},"andria-trani-barletta":{"$":0},"andriabarlettatrani":{"$":0},"andriatranibarletta":{"$":0},"ao":{"$":0},"aosta":{"$":0},"aoste":{"$":0},"ap":{"$":0},"aq":{"$":0},"aquila":{"$":0},"ar":{"$":0},"arezzo":{"$":0},"ascoli-piceno":{"$":0},"ascolipiceno":{"$":0},"asti":{"$":0},"at":{"$":0},"av":{"$":0},"avellino":{"$":0},"ba":{"$":0},"balsan":{"$":0},"bari":{"$":0},"barletta-trani-andria":{"$":0},"barlettatraniandria":{"$":0},"belluno":{"$":0},"benevento":{"$":0},"bergamo":{"$":0},"bg":{"$":0},"bi":{"$":0},"biella":{"$":0},"bl":{"$":0},"bn":{"$":0},"bo":{"$":0},"bologna":{"$":0},"bolzano":{"$":0},"bozen":{"$":0},"br":{"$":0},"brescia":{"$":0},"brindisi":{"$":0},"bs":{"$":0},"bt":{"$":0},"bz":{"$":0},"ca":{"$":0},"cagliari":{"$":0},"caltanissetta":{"$":0},"campidano-medio":{"$":0},"campidanomedio":{"$":0},"campobasso":{"$":0},"carbonia-iglesias":{"$":0},"carboniaiglesias":{"$":0},"carrara-massa":{"$":0},"carraramassa":{"$":0},"caserta":{"$":0},"catania":{"$":0},"catanzaro":{"$":0},"cb":{"$":0},"ce":{"$":0},"cesena-forli":{"$":0},"cesenaforli":{"$":0},"ch":{"$":0},"chieti":{"$":0},"ci":{"$":0},"cl":{"$":0},"cn":{"$":0},"co":{"$":0},"como":{"$":0},"cosenza":{"$":0},"cr":{"$":0},"cremona":{"$":0},"crotone":{"$":0},"cs":{"$":0},"ct":{"$":0},"cuneo":{"$":0},"cz":{"$":0},"dell-ogliastra":{"$":0},"dellogliastra":{"$":0},"en":{"$":0},"enna":{"$":0},"fc":{"$":0},"fe":{"$":0},"fermo":{"$":0},"ferrara":{"$":0},"fg":{"$":0},"fi":{"$":0},"firenze":{"$":0},"florence":{"$":0},"fm":{"$":0},"foggia":{"$":0},"forli-cesena":{"$":0},"forlicesena":{"$":0},"fr":{"$":0},"frosinone":{"$":0},"ge":{"$":0},"genoa":{"$":0},"genova":{"$":0},"go":{"$":0},"gorizia":{"$":0},"gr":{"$":0},"grosseto":{"$":0},"iglesias-carbonia":{"$":0},"iglesiascarbonia":{"$":0},"im":{"$":0},"imperia":{"$":0},"is":{"$":0},"isernia":{"$":0},"kr":{"$":0},"la-spezia":{"$":0},"laquila":{"$":0},"laspezia":{"$":0},"latina":{"$":0},"lc":{"$":0},"le":{"$":0},"lecce":{"$":0},"lecco":{"$":0},"li":{"$":0},"livorno":{"$":0},"lo":{"$":0},"lodi":{"$":0},"lt":{"$":0},"lu":{"$":0},"lucca":{"$":0},"macerata":{"$":0},"mantova":{"$":0},"massa-carrara":{"$":0},"massacarrara":{"$":0},"matera":{"$":0},"mb":{"$":0},"mc":{"$":0},"me":{"$":0},"medio-campidano":{"$":0},"mediocampidano":{"$":0},"messina":{"$":0},"mi":{"$":0},"milan":{"$":0},"milano":{"$":0},"mn":{"$":0},"mo":{"$":0},"modena":{"$":0},"monza-brianza":{"$":0},"monza-e-della-brianza":{"$":0},"monza":{"$":0},"monzabrianza":{"$":0},"monzaebrianza":{"$":0},"monzaedellabrianza":{"$":0},"ms":{"$":0},"mt":{"$":0},"na":{"$":0},"naples":{"$":0},"napoli":{"$":0},"no":{"$":0},"novara":{"$":0},"nu":{"$":0},"nuoro":{"$":0},"og":{"$":0},"ogliastra":{"$":0},"olbia-tempio":{"$":0},"olbiatempio":{"$":0},"or":{"$":0},"oristano":{"$":0},"ot":{"$":0},"pa":{"$":0},"padova":{"$":0},"padua":{"$":0},"palermo":{"$":0},"parma":{"$":0},"pavia":{"$":0},"pc":{"$":0},"pd":{"$":0},"pe":{"$":0},"perugia":{"$":0},"pesaro-urbino":{"$":0},"pesarourbino":{"$":0},"pescara":{"$":0},"pg":{"$":0},"pi":{"$":0},"piacenza":{"$":0},"pisa":{"$":0},"pistoia":{"$":0},"pn":{"$":0},"po":{"$":0},"pordenone":{"$":0},"potenza":{"$":0},"pr":{"$":0},"prato":{"$":0},"pt":{"$":0},"pu":{"$":0},"pv":{"$":0},"pz":{"$":0},"ra":{"$":0},"ragusa":{"$":0},"ravenna":{"$":0},"rc":{"$":0},"re":{"$":0},"reggio-calabria":{"$":0},"reggio-emilia":{"$":0},"reggiocalabria":{"$":0},"reggioemilia":{"$":0},"rg":{"$":0},"ri":{"$":0},"rieti":{"$":0},"rimini":{"$":0},"rm":{"$":0},"rn":{"$":0},"ro":{"$":0},"roma":{"$":0},"rome":{"$":0},"rovigo":{"$":0},"sa":{"$":0},"salerno":{"$":0},"sassari":{"$":0},"savona":{"$":0},"si":{"$":0},"siena":{"$":0},"siracusa":{"$":0},"so":{"$":0},"sondrio":{"$":0},"sp":{"$":0},"sr":{"$":0},"ss":{"$":0},"suedtirol":{"$":0},"sv":{"$":0},"ta":{"$":0},"taranto":{"$":0},"te":{"$":0},"tempio-olbia":{"$":0},"tempioolbia":{"$":0},"teramo":{"$":0},"terni":{"$":0},"tn":{"$":0},"to":{"$":0},"torino":{"$":0},"tp":{"$":0},"tr":{"$":0},"trani-andria-barletta":{"$":0},"trani-barletta-andria":{"$":0},"traniandriabarletta":{"$":0},"tranibarlettaandria":{"$":0},"trapani":{"$":0},"trentino":{"$":0},"trento":{"$":0},"treviso":{"$":0},"trieste":{"$":0},"ts":{"$":0},"turin":{"$":0},"tv":{"$":0},"ud":{"$":0},"udine":{"$":0},"urbino-pesaro":{"$":0},"urbinopesaro":{"$":0},"va":{"$":0},"varese":{"$":0},"vb":{"$":0},"vc":{"$":0},"ve":{"$":0},"venezia":{"$":0},"venice":{"$":0},"verbania":{"$":0},"vercelli":{"$":0},"verona":{"$":0},"vi":{"$":0},"vibo-valentia":{"$":0},"vibovalentia":{"$":0},"vicenza":{"$":0},"viterbo":{"$":0},"vr":{"$":0},"vs":{"$":0},"vt":{"$":0},"vv":{"$":0},"blogspot":{"$":0}},"je":{"$":0,"co":{"$":0},"net":{"$":0},"org":{"$":0}},"jm":{"*":{"$":0}},"jo":{"$":0,"com":{"$":0},"org":{"$":0},"net":{"$":0},"edu":{"$":0},"sch":{"$":0},"gov":{"$":0},"mil":{"$":0},"name":{"$":0}},"jobs":{"$":0},"jp":{"$":0,"ac":{"$":0},"ad":{"$":0},"co":{"$":0},"ed":{"$":0},"go":{"$":0},"gr":{"$":0},"lg":{"$":0},"ne":{"$":0},"or":{"$":0},"aichi":{"$":0,"aisai":{"$":0},"ama":{"$":0},"anjo":{"$":0},"asuke":{"$":0},"chiryu":{"$":0},"chita":{"$":0},"fuso":{"$":0},"gamagori":{"$":0},"handa":{"$":0},"hazu":{"$":0},"hekinan":{"$":0},"higashiura":{"$":0},"ichinomiya":{"$":0},"inazawa":{"$":0},"inuyama":{"$":0},"isshiki":{"$":0},"iwakura":{"$":0},"kanie":{"$":0},"kariya":{"$":0},"kasugai":{"$":0},"kira":{"$":0},"kiyosu":{"$":0},"komaki":{"$":0},"konan":{"$":0},"kota":{"$":0},"mihama":{"$":0},"miyoshi":{"$":0},"nishio":{"$":0},"nisshin":{"$":0},"obu":{"$":0},"oguchi":{"$":0},"oharu":{"$":0},"okazaki":{"$":0},"owariasahi":{"$":0},"seto":{"$":0},"shikatsu":{"$":0},"shinshiro":{"$":0},"shitara":{"$":0},"tahara":{"$":0},"takahama":{"$":0},"tobishima":{"$":0},"toei":{"$":0},"togo":{"$":0},"tokai":{"$":0},"tokoname":{"$":0},"toyoake":{"$":0},"toyohashi":{"$":0},"toyokawa":{"$":0},"toyone":{"$":0},"toyota":{"$":0},"tsushima":{"$":0},"yatomi":{"$":0}},"akita":{"$":0,"akita":{"$":0},"daisen":{"$":0},"fujisato":{"$":0},"gojome":{"$":0},"hachirogata":{"$":0},"happou":{"$":0},"higashinaruse":{"$":0},"honjo":{"$":0},"honjyo":{"$":0},"ikawa":{"$":0},"kamikoani":{"$":0},"kamioka":{"$":0},"katagami":{"$":0},"kazuno":{"$":0},"kitaakita":{"$":0},"kosaka":{"$":0},"kyowa":{"$":0},"misato":{"$":0},"mitane":{"$":0},"moriyoshi":{"$":0},"nikaho":{"$":0},"noshiro":{"$":0},"odate":{"$":0},"oga":{"$":0},"ogata":{"$":0},"semboku":{"$":0},"yokote":{"$":0},"yurihonjo":{"$":0}},"aomori":{"$":0,"aomori":{"$":0},"gonohe":{"$":0},"hachinohe":{"$":0},"hashikami":{"$":0},"hiranai":{"$":0},"hirosaki":{"$":0},"itayanagi":{"$":0},"kuroishi":{"$":0},"misawa":{"$":0},"mutsu":{"$":0},"nakadomari":{"$":0},"noheji":{"$":0},"oirase":{"$":0},"owani":{"$":0},"rokunohe":{"$":0},"sannohe":{"$":0},"shichinohe":{"$":0},"shingo":{"$":0},"takko":{"$":0},"towada":{"$":0},"tsugaru":{"$":0},"tsuruta":{"$":0}},"chiba":{"$":0,"abiko":{"$":0},"asahi":{"$":0},"chonan":{"$":0},"chosei":{"$":0},"choshi":{"$":0},"chuo":{"$":0},"funabashi":{"$":0},"futtsu":{"$":0},"hanamigawa":{"$":0},"ichihara":{"$":0},"ichikawa":{"$":0},"ichinomiya":{"$":0},"inzai":{"$":0},"isumi":{"$":0},"kamagaya":{"$":0},"kamogawa":{"$":0},"kashiwa":{"$":0},"katori":{"$":0},"katsuura":{"$":0},"kimitsu":{"$":0},"kisarazu":{"$":0},"kozaki":{"$":0},"kujukuri":{"$":0},"kyonan":{"$":0},"matsudo":{"$":0},"midori":{"$":0},"mihama":{"$":0},"minamiboso":{"$":0},"mobara":{"$":0},"mutsuzawa":{"$":0},"nagara":{"$":0},"nagareyama":{"$":0},"narashino":{"$":0},"narita":{"$":0},"noda":{"$":0},"oamishirasato":{"$":0},"omigawa":{"$":0},"onjuku":{"$":0},"otaki":{"$":0},"sakae":{"$":0},"sakura":{"$":0},"shimofusa":{"$":0},"shirako":{"$":0},"shiroi":{"$":0},"shisui":{"$":0},"sodegaura":{"$":0},"sosa":{"$":0},"tako":{"$":0},"tateyama":{"$":0},"togane":{"$":0},"tohnosho":{"$":0},"tomisato":{"$":0},"urayasu":{"$":0},"yachimata":{"$":0},"yachiyo":{"$":0},"yokaichiba":{"$":0},"yokoshibahikari":{"$":0},"yotsukaido":{"$":0}},"ehime":{"$":0,"ainan":{"$":0},"honai":{"$":0},"ikata":{"$":0},"imabari":{"$":0},"iyo":{"$":0},"kamijima":{"$":0},"kihoku":{"$":0},"kumakogen":{"$":0},"masaki":{"$":0},"matsuno":{"$":0},"matsuyama":{"$":0},"namikata":{"$":0},"niihama":{"$":0},"ozu":{"$":0},"saijo":{"$":0},"seiyo":{"$":0},"shikokuchuo":{"$":0},"tobe":{"$":0},"toon":{"$":0},"uchiko":{"$":0},"uwajima":{"$":0},"yawatahama":{"$":0}},"fukui":{"$":0,"echizen":{"$":0},"eiheiji":{"$":0},"fukui":{"$":0},"ikeda":{"$":0},"katsuyama":{"$":0},"mihama":{"$":0},"minamiechizen":{"$":0},"obama":{"$":0},"ohi":{"$":0},"ono":{"$":0},"sabae":{"$":0},"sakai":{"$":0},"takahama":{"$":0},"tsuruga":{"$":0},"wakasa":{"$":0}},"fukuoka":{"$":0,"ashiya":{"$":0},"buzen":{"$":0},"chikugo":{"$":0},"chikuho":{"$":0},"chikujo":{"$":0},"chikushino":{"$":0},"chikuzen":{"$":0},"chuo":{"$":0},"dazaifu":{"$":0},"fukuchi":{"$":0},"hakata":{"$":0},"higashi":{"$":0},"hirokawa":{"$":0},"hisayama":{"$":0},"iizuka":{"$":0},"inatsuki":{"$":0},"kaho":{"$":0},"kasuga":{"$":0},"kasuya":{"$":0},"kawara":{"$":0},"keisen":{"$":0},"koga":{"$":0},"kurate":{"$":0},"kurogi":{"$":0},"kurume":{"$":0},"minami":{"$":0},"miyako":{"$":0},"miyama":{"$":0},"miyawaka":{"$":0},"mizumaki":{"$":0},"munakata":{"$":0},"nakagawa":{"$":0},"nakama":{"$":0},"nishi":{"$":0},"nogata":{"$":0},"ogori":{"$":0},"okagaki":{"$":0},"okawa":{"$":0},"oki":{"$":0},"omuta":{"$":0},"onga":{"$":0},"onojo":{"$":0},"oto":{"$":0},"saigawa":{"$":0},"sasaguri":{"$":0},"shingu":{"$":0},"shinyoshitomi":{"$":0},"shonai":{"$":0},"soeda":{"$":0},"sue":{"$":0},"tachiarai":{"$":0},"tagawa":{"$":0},"takata":{"$":0},"toho":{"$":0},"toyotsu":{"$":0},"tsuiki":{"$":0},"ukiha":{"$":0},"umi":{"$":0},"usui":{"$":0},"yamada":{"$":0},"yame":{"$":0},"yanagawa":{"$":0},"yukuhashi":{"$":0}},"fukushima":{"$":0,"aizubange":{"$":0},"aizumisato":{"$":0},"aizuwakamatsu":{"$":0},"asakawa":{"$":0},"bandai":{"$":0},"date":{"$":0},"fukushima":{"$":0},"furudono":{"$":0},"futaba":{"$":0},"hanawa":{"$":0},"higashi":{"$":0},"hirata":{"$":0},"hirono":{"$":0},"iitate":{"$":0},"inawashiro":{"$":0},"ishikawa":{"$":0},"iwaki":{"$":0},"izumizaki":{"$":0},"kagamiishi":{"$":0},"kaneyama":{"$":0},"kawamata":{"$":0},"kitakata":{"$":0},"kitashiobara":{"$":0},"koori":{"$":0},"koriyama":{"$":0},"kunimi":{"$":0},"miharu":{"$":0},"mishima":{"$":0},"namie":{"$":0},"nango":{"$":0},"nishiaizu":{"$":0},"nishigo":{"$":0},"okuma":{"$":0},"omotego":{"$":0},"ono":{"$":0},"otama":{"$":0},"samegawa":{"$":0},"shimogo":{"$":0},"shirakawa":{"$":0},"showa":{"$":0},"soma":{"$":0},"sukagawa":{"$":0},"taishin":{"$":0},"tamakawa":{"$":0},"tanagura":{"$":0},"tenei":{"$":0},"yabuki":{"$":0},"yamato":{"$":0},"yamatsuri":{"$":0},"yanaizu":{"$":0},"yugawa":{"$":0}},"gifu":{"$":0,"anpachi":{"$":0},"ena":{"$":0},"gifu":{"$":0},"ginan":{"$":0},"godo":{"$":0},"gujo":{"$":0},"hashima":{"$":0},"hichiso":{"$":0},"hida":{"$":0},"higashishirakawa":{"$":0},"ibigawa":{"$":0},"ikeda":{"$":0},"kakamigahara":{"$":0},"kani":{"$":0},"kasahara":{"$":0},"kasamatsu":{"$":0},"kawaue":{"$":0},"kitagata":{"$":0},"mino":{"$":0},"minokamo":{"$":0},"mitake":{"$":0},"mizunami":{"$":0},"motosu":{"$":0},"nakatsugawa":{"$":0},"ogaki":{"$":0},"sakahogi":{"$":0},"seki":{"$":0},"sekigahara":{"$":0},"shirakawa":{"$":0},"tajimi":{"$":0},"takayama":{"$":0},"tarui":{"$":0},"toki":{"$":0},"tomika":{"$":0},"wanouchi":{"$":0},"yamagata":{"$":0},"yaotsu":{"$":0},"yoro":{"$":0}},"gunma":{"$":0,"annaka":{"$":0},"chiyoda":{"$":0},"fujioka":{"$":0},"higashiagatsuma":{"$":0},"isesaki":{"$":0},"itakura":{"$":0},"kanna":{"$":0},"kanra":{"$":0},"katashina":{"$":0},"kawaba":{"$":0},"kiryu":{"$":0},"kusatsu":{"$":0},"maebashi":{"$":0},"meiwa":{"$":0},"midori":{"$":0},"minakami":{"$":0},"naganohara":{"$":0},"nakanojo":{"$":0},"nanmoku":{"$":0},"numata":{"$":0},"oizumi":{"$":0},"ora":{"$":0},"ota":{"$":0},"shibukawa":{"$":0},"shimonita":{"$":0},"shinto":{"$":0},"showa":{"$":0},"takasaki":{"$":0},"takayama":{"$":0},"tamamura":{"$":0},"tatebayashi":{"$":0},"tomioka":{"$":0},"tsukiyono":{"$":0},"tsumagoi":{"$":0},"ueno":{"$":0},"yoshioka":{"$":0}},"hiroshima":{"$":0,"asaminami":{"$":0},"daiwa":{"$":0},"etajima":{"$":0},"fuchu":{"$":0},"fukuyama":{"$":0},"hatsukaichi":{"$":0},"higashihiroshima":{"$":0},"hongo":{"$":0},"jinsekikogen":{"$":0},"kaita":{"$":0},"kui":{"$":0},"kumano":{"$":0},"kure":{"$":0},"mihara":{"$":0},"miyoshi":{"$":0},"naka":{"$":0},"onomichi":{"$":0},"osakikamijima":{"$":0},"otake":{"$":0},"saka":{"$":0},"sera":{"$":0},"seranishi":{"$":0},"shinichi":{"$":0},"shobara":{"$":0},"takehara":{"$":0}},"hokkaido":{"$":0,"abashiri":{"$":0},"abira":{"$":0},"aibetsu":{"$":0},"akabira":{"$":0},"akkeshi":{"$":0},"asahikawa":{"$":0},"ashibetsu":{"$":0},"ashoro":{"$":0},"assabu":{"$":0},"atsuma":{"$":0},"bibai":{"$":0},"biei":{"$":0},"bifuka":{"$":0},"bihoro":{"$":0},"biratori":{"$":0},"chippubetsu":{"$":0},"chitose":{"$":0},"date":{"$":0},"ebetsu":{"$":0},"embetsu":{"$":0},"eniwa":{"$":0},"erimo":{"$":0},"esan":{"$":0},"esashi":{"$":0},"fukagawa":{"$":0},"fukushima":{"$":0},"furano":{"$":0},"furubira":{"$":0},"haboro":{"$":0},"hakodate":{"$":0},"hamatonbetsu":{"$":0},"hidaka":{"$":0},"higashikagura":{"$":0},"higashikawa":{"$":0},"hiroo":{"$":0},"hokuryu":{"$":0},"hokuto":{"$":0},"honbetsu":{"$":0},"horokanai":{"$":0},"horonobe":{"$":0},"ikeda":{"$":0},"imakane":{"$":0},"ishikari":{"$":0},"iwamizawa":{"$":0},"iwanai":{"$":0},"kamifurano":{"$":0},"kamikawa":{"$":0},"kamishihoro":{"$":0},"kamisunagawa":{"$":0},"kamoenai":{"$":0},"kayabe":{"$":0},"kembuchi":{"$":0},"kikonai":{"$":0},"kimobetsu":{"$":0},"kitahiroshima":{"$":0},"kitami":{"$":0},"kiyosato":{"$":0},"koshimizu":{"$":0},"kunneppu":{"$":0},"kuriyama":{"$":0},"kuromatsunai":{"$":0},"kushiro":{"$":0},"kutchan":{"$":0},"kyowa":{"$":0},"mashike":{"$":0},"matsumae":{"$":0},"mikasa":{"$":0},"minamifurano":{"$":0},"mombetsu":{"$":0},"moseushi":{"$":0},"mukawa":{"$":0},"muroran":{"$":0},"naie":{"$":0},"nakagawa":{"$":0},"nakasatsunai":{"$":0},"nakatombetsu":{"$":0},"nanae":{"$":0},"nanporo":{"$":0},"nayoro":{"$":0},"nemuro":{"$":0},"niikappu":{"$":0},"niki":{"$":0},"nishiokoppe":{"$":0},"noboribetsu":{"$":0},"numata":{"$":0},"obihiro":{"$":0},"obira":{"$":0},"oketo":{"$":0},"okoppe":{"$":0},"otaru":{"$":0},"otobe":{"$":0},"otofuke":{"$":0},"otoineppu":{"$":0},"oumu":{"$":0},"ozora":{"$":0},"pippu":{"$":0},"rankoshi":{"$":0},"rebun":{"$":0},"rikubetsu":{"$":0},"rishiri":{"$":0},"rishirifuji":{"$":0},"saroma":{"$":0},"sarufutsu":{"$":0},"shakotan":{"$":0},"shari":{"$":0},"shibecha":{"$":0},"shibetsu":{"$":0},"shikabe":{"$":0},"shikaoi":{"$":0},"shimamaki":{"$":0},"shimizu":{"$":0},"shimokawa":{"$":0},"shinshinotsu":{"$":0},"shintoku":{"$":0},"shiranuka":{"$":0},"shiraoi":{"$":0},"shiriuchi":{"$":0},"sobetsu":{"$":0},"sunagawa":{"$":0},"taiki":{"$":0},"takasu":{"$":0},"takikawa":{"$":0},"takinoue":{"$":0},"teshikaga":{"$":0},"tobetsu":{"$":0},"tohma":{"$":0},"tomakomai":{"$":0},"tomari":{"$":0},"toya":{"$":0},"toyako":{"$":0},"toyotomi":{"$":0},"toyoura":{"$":0},"tsubetsu":{"$":0},"tsukigata":{"$":0},"urakawa":{"$":0},"urausu":{"$":0},"uryu":{"$":0},"utashinai":{"$":0},"wakkanai":{"$":0},"wassamu":{"$":0},"yakumo":{"$":0},"yoichi":{"$":0}},"hyogo":{"$":0,"aioi":{"$":0},"akashi":{"$":0},"ako":{"$":0},"amagasaki":{"$":0},"aogaki":{"$":0},"asago":{"$":0},"ashiya":{"$":0},"awaji":{"$":0},"fukusaki":{"$":0},"goshiki":{"$":0},"harima":{"$":0},"himeji":{"$":0},"ichikawa":{"$":0},"inagawa":{"$":0},"itami":{"$":0},"kakogawa":{"$":0},"kamigori":{"$":0},"kamikawa":{"$":0},"kasai":{"$":0},"kasuga":{"$":0},"kawanishi":{"$":0},"miki":{"$":0},"minamiawaji":{"$":0},"nishinomiya":{"$":0},"nishiwaki":{"$":0},"ono":{"$":0},"sanda":{"$":0},"sannan":{"$":0},"sasayama":{"$":0},"sayo":{"$":0},"shingu":{"$":0},"shinonsen":{"$":0},"shiso":{"$":0},"sumoto":{"$":0},"taishi":{"$":0},"taka":{"$":0},"takarazuka":{"$":0},"takasago":{"$":0},"takino":{"$":0},"tamba":{"$":0},"tatsuno":{"$":0},"toyooka":{"$":0},"yabu":{"$":0},"yashiro":{"$":0},"yoka":{"$":0},"yokawa":{"$":0}},"ibaraki":{"$":0,"ami":{"$":0},"asahi":{"$":0},"bando":{"$":0},"chikusei":{"$":0},"daigo":{"$":0},"fujishiro":{"$":0},"hitachi":{"$":0},"hitachinaka":{"$":0},"hitachiomiya":{"$":0},"hitachiota":{"$":0},"ibaraki":{"$":0},"ina":{"$":0},"inashiki":{"$":0},"itako":{"$":0},"iwama":{"$":0},"joso":{"$":0},"kamisu":{"$":0},"kasama":{"$":0},"kashima":{"$":0},"kasumigaura":{"$":0},"koga":{"$":0},"miho":{"$":0},"mito":{"$":0},"moriya":{"$":0},"naka":{"$":0},"namegata":{"$":0},"oarai":{"$":0},"ogawa":{"$":0},"omitama":{"$":0},"ryugasaki":{"$":0},"sakai":{"$":0},"sakuragawa":{"$":0},"shimodate":{"$":0},"shimotsuma":{"$":0},"shirosato":{"$":0},"sowa":{"$":0},"suifu":{"$":0},"takahagi":{"$":0},"tamatsukuri":{"$":0},"tokai":{"$":0},"tomobe":{"$":0},"tone":{"$":0},"toride":{"$":0},"tsuchiura":{"$":0},"tsukuba":{"$":0},"uchihara":{"$":0},"ushiku":{"$":0},"yachiyo":{"$":0},"yamagata":{"$":0},"yawara":{"$":0},"yuki":{"$":0}},"ishikawa":{"$":0,"anamizu":{"$":0},"hakui":{"$":0},"hakusan":{"$":0},"kaga":{"$":0},"kahoku":{"$":0},"kanazawa":{"$":0},"kawakita":{"$":0},"komatsu":{"$":0},"nakanoto":{"$":0},"nanao":{"$":0},"nomi":{"$":0},"nonoichi":{"$":0},"noto":{"$":0},"shika":{"$":0},"suzu":{"$":0},"tsubata":{"$":0},"tsurugi":{"$":0},"uchinada":{"$":0},"wajima":{"$":0}},"iwate":{"$":0,"fudai":{"$":0},"fujisawa":{"$":0},"hanamaki":{"$":0},"hiraizumi":{"$":0},"hirono":{"$":0},"ichinohe":{"$":0},"ichinoseki":{"$":0},"iwaizumi":{"$":0},"iwate":{"$":0},"joboji":{"$":0},"kamaishi":{"$":0},"kanegasaki":{"$":0},"karumai":{"$":0},"kawai":{"$":0},"kitakami":{"$":0},"kuji":{"$":0},"kunohe":{"$":0},"kuzumaki":{"$":0},"miyako":{"$":0},"mizusawa":{"$":0},"morioka":{"$":0},"ninohe":{"$":0},"noda":{"$":0},"ofunato":{"$":0},"oshu":{"$":0},"otsuchi":{"$":0},"rikuzentakata":{"$":0},"shiwa":{"$":0},"shizukuishi":{"$":0},"sumita":{"$":0},"tanohata":{"$":0},"tono":{"$":0},"yahaba":{"$":0},"yamada":{"$":0}},"kagawa":{"$":0,"ayagawa":{"$":0},"higashikagawa":{"$":0},"kanonji":{"$":0},"kotohira":{"$":0},"manno":{"$":0},"marugame":{"$":0},"mitoyo":{"$":0},"naoshima":{"$":0},"sanuki":{"$":0},"tadotsu":{"$":0},"takamatsu":{"$":0},"tonosho":{"$":0},"uchinomi":{"$":0},"utazu":{"$":0},"zentsuji":{"$":0}},"kagoshima":{"$":0,"akune":{"$":0},"amami":{"$":0},"hioki":{"$":0},"isa":{"$":0},"isen":{"$":0},"izumi":{"$":0},"kagoshima":{"$":0},"kanoya":{"$":0},"kawanabe":{"$":0},"kinko":{"$":0},"kouyama":{"$":0},"makurazaki":{"$":0},"matsumoto":{"$":0},"minamitane":{"$":0},"nakatane":{"$":0},"nishinoomote":{"$":0},"satsumasendai":{"$":0},"soo":{"$":0},"tarumizu":{"$":0},"yusui":{"$":0}},"kanagawa":{"$":0,"aikawa":{"$":0},"atsugi":{"$":0},"ayase":{"$":0},"chigasaki":{"$":0},"ebina":{"$":0},"fujisawa":{"$":0},"hadano":{"$":0},"hakone":{"$":0},"hiratsuka":{"$":0},"isehara":{"$":0},"kaisei":{"$":0},"kamakura":{"$":0},"kiyokawa":{"$":0},"matsuda":{"$":0},"minamiashigara":{"$":0},"miura":{"$":0},"nakai":{"$":0},"ninomiya":{"$":0},"odawara":{"$":0},"oi":{"$":0},"oiso":{"$":0},"sagamihara":{"$":0},"samukawa":{"$":0},"tsukui":{"$":0},"yamakita":{"$":0},"yamato":{"$":0},"yokosuka":{"$":0},"yugawara":{"$":0},"zama":{"$":0},"zushi":{"$":0}},"kochi":{"$":0,"aki":{"$":0},"geisei":{"$":0},"hidaka":{"$":0},"higashitsuno":{"$":0},"ino":{"$":0},"kagami":{"$":0},"kami":{"$":0},"kitagawa":{"$":0},"kochi":{"$":0},"mihara":{"$":0},"motoyama":{"$":0},"muroto":{"$":0},"nahari":{"$":0},"nakamura":{"$":0},"nankoku":{"$":0},"nishitosa":{"$":0},"niyodogawa":{"$":0},"ochi":{"$":0},"okawa":{"$":0},"otoyo":{"$":0},"otsuki":{"$":0},"sakawa":{"$":0},"sukumo":{"$":0},"susaki":{"$":0},"tosa":{"$":0},"tosashimizu":{"$":0},"toyo":{"$":0},"tsuno":{"$":0},"umaji":{"$":0},"yasuda":{"$":0},"yusuhara":{"$":0}},"kumamoto":{"$":0,"amakusa":{"$":0},"arao":{"$":0},"aso":{"$":0},"choyo":{"$":0},"gyokuto":{"$":0},"kamiamakusa":{"$":0},"kikuchi":{"$":0},"kumamoto":{"$":0},"mashiki":{"$":0},"mifune":{"$":0},"minamata":{"$":0},"minamioguni":{"$":0},"nagasu":{"$":0},"nishihara":{"$":0},"oguni":{"$":0},"ozu":{"$":0},"sumoto":{"$":0},"takamori":{"$":0},"uki":{"$":0},"uto":{"$":0},"yamaga":{"$":0},"yamato":{"$":0},"yatsushiro":{"$":0}},"kyoto":{"$":0,"ayabe":{"$":0},"fukuchiyama":{"$":0},"higashiyama":{"$":0},"ide":{"$":0},"ine":{"$":0},"joyo":{"$":0},"kameoka":{"$":0},"kamo":{"$":0},"kita":{"$":0},"kizu":{"$":0},"kumiyama":{"$":0},"kyotamba":{"$":0},"kyotanabe":{"$":0},"kyotango":{"$":0},"maizuru":{"$":0},"minami":{"$":0},"minamiyamashiro":{"$":0},"miyazu":{"$":0},"muko":{"$":0},"nagaokakyo":{"$":0},"nakagyo":{"$":0},"nantan":{"$":0},"oyamazaki":{"$":0},"sakyo":{"$":0},"seika":{"$":0},"tanabe":{"$":0},"uji":{"$":0},"ujitawara":{"$":0},"wazuka":{"$":0},"yamashina":{"$":0},"yawata":{"$":0}},"mie":{"$":0,"asahi":{"$":0},"inabe":{"$":0},"ise":{"$":0},"kameyama":{"$":0},"kawagoe":{"$":0},"kiho":{"$":0},"kisosaki":{"$":0},"kiwa":{"$":0},"komono":{"$":0},"kumano":{"$":0},"kuwana":{"$":0},"matsusaka":{"$":0},"meiwa":{"$":0},"mihama":{"$":0},"minamiise":{"$":0},"misugi":{"$":0},"miyama":{"$":0},"nabari":{"$":0},"shima":{"$":0},"suzuka":{"$":0},"tado":{"$":0},"taiki":{"$":0},"taki":{"$":0},"tamaki":{"$":0},"toba":{"$":0},"tsu":{"$":0},"udono":{"$":0},"ureshino":{"$":0},"watarai":{"$":0},"yokkaichi":{"$":0}},"miyagi":{"$":0,"furukawa":{"$":0},"higashimatsushima":{"$":0},"ishinomaki":{"$":0},"iwanuma":{"$":0},"kakuda":{"$":0},"kami":{"$":0},"kawasaki":{"$":0},"marumori":{"$":0},"matsushima":{"$":0},"minamisanriku":{"$":0},"misato":{"$":0},"murata":{"$":0},"natori":{"$":0},"ogawara":{"$":0},"ohira":{"$":0},"onagawa":{"$":0},"osaki":{"$":0},"rifu":{"$":0},"semine":{"$":0},"shibata":{"$":0},"shichikashuku":{"$":0},"shikama":{"$":0},"shiogama":{"$":0},"shiroishi":{"$":0},"tagajo":{"$":0},"taiwa":{"$":0},"tome":{"$":0},"tomiya":{"$":0},"wakuya":{"$":0},"watari":{"$":0},"yamamoto":{"$":0},"zao":{"$":0}},"miyazaki":{"$":0,"aya":{"$":0},"ebino":{"$":0},"gokase":{"$":0},"hyuga":{"$":0},"kadogawa":{"$":0},"kawaminami":{"$":0},"kijo":{"$":0},"kitagawa":{"$":0},"kitakata":{"$":0},"kitaura":{"$":0},"kobayashi":{"$":0},"kunitomi":{"$":0},"kushima":{"$":0},"mimata":{"$":0},"miyakonojo":{"$":0},"miyazaki":{"$":0},"morotsuka":{"$":0},"nichinan":{"$":0},"nishimera":{"$":0},"nobeoka":{"$":0},"saito":{"$":0},"shiiba":{"$":0},"shintomi":{"$":0},"takaharu":{"$":0},"takanabe":{"$":0},"takazaki":{"$":0},"tsuno":{"$":0}},"nagano":{"$":0,"achi":{"$":0},"agematsu":{"$":0},"anan":{"$":0},"aoki":{"$":0},"asahi":{"$":0},"azumino":{"$":0},"chikuhoku":{"$":0},"chikuma":{"$":0},"chino":{"$":0},"fujimi":{"$":0},"hakuba":{"$":0},"hara":{"$":0},"hiraya":{"$":0},"iida":{"$":0},"iijima":{"$":0},"iiyama":{"$":0},"iizuna":{"$":0},"ikeda":{"$":0},"ikusaka":{"$":0},"ina":{"$":0},"karuizawa":{"$":0},"kawakami":{"$":0},"kiso":{"$":0},"kisofukushima":{"$":0},"kitaaiki":{"$":0},"komagane":{"$":0},"komoro":{"$":0},"matsukawa":{"$":0},"matsumoto":{"$":0},"miasa":{"$":0},"minamiaiki":{"$":0},"minamimaki":{"$":0},"minamiminowa":{"$":0},"minowa":{"$":0},"miyada":{"$":0},"miyota":{"$":0},"mochizuki":{"$":0},"nagano":{"$":0},"nagawa":{"$":0},"nagiso":{"$":0},"nakagawa":{"$":0},"nakano":{"$":0},"nozawaonsen":{"$":0},"obuse":{"$":0},"ogawa":{"$":0},"okaya":{"$":0},"omachi":{"$":0},"omi":{"$":0},"ookuwa":{"$":0},"ooshika":{"$":0},"otaki":{"$":0},"otari":{"$":0},"sakae":{"$":0},"sakaki":{"$":0},"saku":{"$":0},"sakuho":{"$":0},"shimosuwa":{"$":0},"shinanomachi":{"$":0},"shiojiri":{"$":0},"suwa":{"$":0},"suzaka":{"$":0},"takagi":{"$":0},"takamori":{"$":0},"takayama":{"$":0},"tateshina":{"$":0},"tatsuno":{"$":0},"togakushi":{"$":0},"togura":{"$":0},"tomi":{"$":0},"ueda":{"$":0},"wada":{"$":0},"yamagata":{"$":0},"yamanouchi":{"$":0},"yasaka":{"$":0},"yasuoka":{"$":0}},"nagasaki":{"$":0,"chijiwa":{"$":0},"futsu":{"$":0},"goto":{"$":0},"hasami":{"$":0},"hirado":{"$":0},"iki":{"$":0},"isahaya":{"$":0},"kawatana":{"$":0},"kuchinotsu":{"$":0},"matsuura":{"$":0},"nagasaki":{"$":0},"obama":{"$":0},"omura":{"$":0},"oseto":{"$":0},"saikai":{"$":0},"sasebo":{"$":0},"seihi":{"$":0},"shimabara":{"$":0},"shinkamigoto":{"$":0},"togitsu":{"$":0},"tsushima":{"$":0},"unzen":{"$":0}},"nara":{"$":0,"ando":{"$":0},"gose":{"$":0},"heguri":{"$":0},"higashiyoshino":{"$":0},"ikaruga":{"$":0},"ikoma":{"$":0},"kamikitayama":{"$":0},"kanmaki":{"$":0},"kashiba":{"$":0},"kashihara":{"$":0},"katsuragi":{"$":0},"kawai":{"$":0},"kawakami":{"$":0},"kawanishi":{"$":0},"koryo":{"$":0},"kurotaki":{"$":0},"mitsue":{"$":0},"miyake":{"$":0},"nara":{"$":0},"nosegawa":{"$":0},"oji":{"$":0},"ouda":{"$":0},"oyodo":{"$":0},"sakurai":{"$":0},"sango":{"$":0},"shimoichi":{"$":0},"shimokitayama":{"$":0},"shinjo":{"$":0},"soni":{"$":0},"takatori":{"$":0},"tawaramoto":{"$":0},"tenkawa":{"$":0},"tenri":{"$":0},"uda":{"$":0},"yamatokoriyama":{"$":0},"yamatotakada":{"$":0},"yamazoe":{"$":0},"yoshino":{"$":0}},"niigata":{"$":0,"aga":{"$":0},"agano":{"$":0},"gosen":{"$":0},"itoigawa":{"$":0},"izumozaki":{"$":0},"joetsu":{"$":0},"kamo":{"$":0},"kariwa":{"$":0},"kashiwazaki":{"$":0},"minamiuonuma":{"$":0},"mitsuke":{"$":0},"muika":{"$":0},"murakami":{"$":0},"myoko":{"$":0},"nagaoka":{"$":0},"niigata":{"$":0},"ojiya":{"$":0},"omi":{"$":0},"sado":{"$":0},"sanjo":{"$":0},"seiro":{"$":0},"seirou":{"$":0},"sekikawa":{"$":0},"shibata":{"$":0},"tagami":{"$":0},"tainai":{"$":0},"tochio":{"$":0},"tokamachi":{"$":0},"tsubame":{"$":0},"tsunan":{"$":0},"uonuma":{"$":0},"yahiko":{"$":0},"yoita":{"$":0},"yuzawa":{"$":0}},"oita":{"$":0,"beppu":{"$":0},"bungoono":{"$":0},"bungotakada":{"$":0},"hasama":{"$":0},"hiji":{"$":0},"himeshima":{"$":0},"hita":{"$":0},"kamitsue":{"$":0},"kokonoe":{"$":0},"kuju":{"$":0},"kunisaki":{"$":0},"kusu":{"$":0},"oita":{"$":0},"saiki":{"$":0},"taketa":{"$":0},"tsukumi":{"$":0},"usa":{"$":0},"usuki":{"$":0},"yufu":{"$":0}},"okayama":{"$":0,"akaiwa":{"$":0},"asakuchi":{"$":0},"bizen":{"$":0},"hayashima":{"$":0},"ibara":{"$":0},"kagamino":{"$":0},"kasaoka":{"$":0},"kibichuo":{"$":0},"kumenan":{"$":0},"kurashiki":{"$":0},"maniwa":{"$":0},"misaki":{"$":0},"nagi":{"$":0},"niimi":{"$":0},"nishiawakura":{"$":0},"okayama":{"$":0},"satosho":{"$":0},"setouchi":{"$":0},"shinjo":{"$":0},"shoo":{"$":0},"soja":{"$":0},"takahashi":{"$":0},"tamano":{"$":0},"tsuyama":{"$":0},"wake":{"$":0},"yakage":{"$":0}},"okinawa":{"$":0,"aguni":{"$":0},"ginowan":{"$":0},"ginoza":{"$":0},"gushikami":{"$":0},"haebaru":{"$":0},"higashi":{"$":0},"hirara":{"$":0},"iheya":{"$":0},"ishigaki":{"$":0},"ishikawa":{"$":0},"itoman":{"$":0},"izena":{"$":0},"kadena":{"$":0},"kin":{"$":0},"kitadaito":{"$":0},"kitanakagusuku":{"$":0},"kumejima":{"$":0},"kunigami":{"$":0},"minamidaito":{"$":0},"motobu":{"$":0},"nago":{"$":0},"naha":{"$":0},"nakagusuku":{"$":0},"nakijin":{"$":0},"nanjo":{"$":0},"nishihara":{"$":0},"ogimi":{"$":0},"okinawa":{"$":0},"onna":{"$":0},"shimoji":{"$":0},"taketomi":{"$":0},"tarama":{"$":0},"tokashiki":{"$":0},"tomigusuku":{"$":0},"tonaki":{"$":0},"urasoe":{"$":0},"uruma":{"$":0},"yaese":{"$":0},"yomitan":{"$":0},"yonabaru":{"$":0},"yonaguni":{"$":0},"zamami":{"$":0}},"osaka":{"$":0,"abeno":{"$":0},"chihayaakasaka":{"$":0},"chuo":{"$":0},"daito":{"$":0},"fujiidera":{"$":0},"habikino":{"$":0},"hannan":{"$":0},"higashiosaka":{"$":0},"higashisumiyoshi":{"$":0},"higashiyodogawa":{"$":0},"hirakata":{"$":0},"ibaraki":{"$":0},"ikeda":{"$":0},"izumi":{"$":0},"izumiotsu":{"$":0},"izumisano":{"$":0},"kadoma":{"$":0},"kaizuka":{"$":0},"kanan":{"$":0},"kashiwara":{"$":0},"katano":{"$":0},"kawachinagano":{"$":0},"kishiwada":{"$":0},"kita":{"$":0},"kumatori":{"$":0},"matsubara":{"$":0},"minato":{"$":0},"minoh":{"$":0},"misaki":{"$":0},"moriguchi":{"$":0},"neyagawa":{"$":0},"nishi":{"$":0},"nose":{"$":0},"osakasayama":{"$":0},"sakai":{"$":0},"sayama":{"$":0},"sennan":{"$":0},"settsu":{"$":0},"shijonawate":{"$":0},"shimamoto":{"$":0},"suita":{"$":0},"tadaoka":{"$":0},"taishi":{"$":0},"tajiri":{"$":0},"takaishi":{"$":0},"takatsuki":{"$":0},"tondabayashi":{"$":0},"toyonaka":{"$":0},"toyono":{"$":0},"yao":{"$":0}},"saga":{"$":0,"ariake":{"$":0},"arita":{"$":0},"fukudomi":{"$":0},"genkai":{"$":0},"hamatama":{"$":0},"hizen":{"$":0},"imari":{"$":0},"kamimine":{"$":0},"kanzaki":{"$":0},"karatsu":{"$":0},"kashima":{"$":0},"kitagata":{"$":0},"kitahata":{"$":0},"kiyama":{"$":0},"kouhoku":{"$":0},"kyuragi":{"$":0},"nishiarita":{"$":0},"ogi":{"$":0},"omachi":{"$":0},"ouchi":{"$":0},"saga":{"$":0},"shiroishi":{"$":0},"taku":{"$":0},"tara":{"$":0},"tosu":{"$":0},"yoshinogari":{"$":0}},"saitama":{"$":0,"arakawa":{"$":0},"asaka":{"$":0},"chichibu":{"$":0},"fujimi":{"$":0},"fujimino":{"$":0},"fukaya":{"$":0},"hanno":{"$":0},"hanyu":{"$":0},"hasuda":{"$":0},"hatogaya":{"$":0},"hatoyama":{"$":0},"hidaka":{"$":0},"higashichichibu":{"$":0},"higashimatsuyama":{"$":0},"honjo":{"$":0},"ina":{"$":0},"iruma":{"$":0},"iwatsuki":{"$":0},"kamiizumi":{"$":0},"kamikawa":{"$":0},"kamisato":{"$":0},"kasukabe":{"$":0},"kawagoe":{"$":0},"kawaguchi":{"$":0},"kawajima":{"$":0},"kazo":{"$":0},"kitamoto":{"$":0},"koshigaya":{"$":0},"kounosu":{"$":0},"kuki":{"$":0},"kumagaya":{"$":0},"matsubushi":{"$":0},"minano":{"$":0},"misato":{"$":0},"miyashiro":{"$":0},"miyoshi":{"$":0},"moroyama":{"$":0},"nagatoro":{"$":0},"namegawa":{"$":0},"niiza":{"$":0},"ogano":{"$":0},"ogawa":{"$":0},"ogose":{"$":0},"okegawa":{"$":0},"omiya":{"$":0},"otaki":{"$":0},"ranzan":{"$":0},"ryokami":{"$":0},"saitama":{"$":0},"sakado":{"$":0},"satte":{"$":0},"sayama":{"$":0},"shiki":{"$":0},"shiraoka":{"$":0},"soka":{"$":0},"sugito":{"$":0},"toda":{"$":0},"tokigawa":{"$":0},"tokorozawa":{"$":0},"tsurugashima":{"$":0},"urawa":{"$":0},"warabi":{"$":0},"yashio":{"$":0},"yokoze":{"$":0},"yono":{"$":0},"yorii":{"$":0},"yoshida":{"$":0},"yoshikawa":{"$":0},"yoshimi":{"$":0}},"shiga":{"$":0,"aisho":{"$":0},"gamo":{"$":0},"higashiomi":{"$":0},"hikone":{"$":0},"koka":{"$":0},"konan":{"$":0},"kosei":{"$":0},"koto":{"$":0},"kusatsu":{"$":0},"maibara":{"$":0},"moriyama":{"$":0},"nagahama":{"$":0},"nishiazai":{"$":0},"notogawa":{"$":0},"omihachiman":{"$":0},"otsu":{"$":0},"ritto":{"$":0},"ryuoh":{"$":0},"takashima":{"$":0},"takatsuki":{"$":0},"torahime":{"$":0},"toyosato":{"$":0},"yasu":{"$":0}},"shimane":{"$":0,"akagi":{"$":0},"ama":{"$":0},"gotsu":{"$":0},"hamada":{"$":0},"higashiizumo":{"$":0},"hikawa":{"$":0},"hikimi":{"$":0},"izumo":{"$":0},"kakinoki":{"$":0},"masuda":{"$":0},"matsue":{"$":0},"misato":{"$":0},"nishinoshima":{"$":0},"ohda":{"$":0},"okinoshima":{"$":0},"okuizumo":{"$":0},"shimane":{"$":0},"tamayu":{"$":0},"tsuwano":{"$":0},"unnan":{"$":0},"yakumo":{"$":0},"yasugi":{"$":0},"yatsuka":{"$":0}},"shizuoka":{"$":0,"arai":{"$":0},"atami":{"$":0},"fuji":{"$":0},"fujieda":{"$":0},"fujikawa":{"$":0},"fujinomiya":{"$":0},"fukuroi":{"$":0},"gotemba":{"$":0},"haibara":{"$":0},"hamamatsu":{"$":0},"higashiizu":{"$":0},"ito":{"$":0},"iwata":{"$":0},"izu":{"$":0},"izunokuni":{"$":0},"kakegawa":{"$":0},"kannami":{"$":0},"kawanehon":{"$":0},"kawazu":{"$":0},"kikugawa":{"$":0},"kosai":{"$":0},"makinohara":{"$":0},"matsuzaki":{"$":0},"minamiizu":{"$":0},"mishima":{"$":0},"morimachi":{"$":0},"nishiizu":{"$":0},"numazu":{"$":0},"omaezaki":{"$":0},"shimada":{"$":0},"shimizu":{"$":0},"shimoda":{"$":0},"shizuoka":{"$":0},"susono":{"$":0},"yaizu":{"$":0},"yoshida":{"$":0}},"tochigi":{"$":0,"ashikaga":{"$":0},"bato":{"$":0},"haga":{"$":0},"ichikai":{"$":0},"iwafune":{"$":0},"kaminokawa":{"$":0},"kanuma":{"$":0},"karasuyama":{"$":0},"kuroiso":{"$":0},"mashiko":{"$":0},"mibu":{"$":0},"moka":{"$":0},"motegi":{"$":0},"nasu":{"$":0},"nasushiobara":{"$":0},"nikko":{"$":0},"nishikata":{"$":0},"nogi":{"$":0},"ohira":{"$":0},"ohtawara":{"$":0},"oyama":{"$":0},"sakura":{"$":0},"sano":{"$":0},"shimotsuke":{"$":0},"shioya":{"$":0},"takanezawa":{"$":0},"tochigi":{"$":0},"tsuga":{"$":0},"ujiie":{"$":0},"utsunomiya":{"$":0},"yaita":{"$":0}},"tokushima":{"$":0,"aizumi":{"$":0},"anan":{"$":0},"ichiba":{"$":0},"itano":{"$":0},"kainan":{"$":0},"komatsushima":{"$":0},"matsushige":{"$":0},"mima":{"$":0},"minami":{"$":0},"miyoshi":{"$":0},"mugi":{"$":0},"nakagawa":{"$":0},"naruto":{"$":0},"sanagochi":{"$":0},"shishikui":{"$":0},"tokushima":{"$":0},"wajiki":{"$":0}},"tokyo":{"$":0,"adachi":{"$":0},"akiruno":{"$":0},"akishima":{"$":0},"aogashima":{"$":0},"arakawa":{"$":0},"bunkyo":{"$":0},"chiyoda":{"$":0},"chofu":{"$":0},"chuo":{"$":0},"edogawa":{"$":0},"fuchu":{"$":0},"fussa":{"$":0},"hachijo":{"$":0},"hachioji":{"$":0},"hamura":{"$":0},"higashikurume":{"$":0},"higashimurayama":{"$":0},"higashiyamato":{"$":0},"hino":{"$":0},"hinode":{"$":0},"hinohara":{"$":0},"inagi":{"$":0},"itabashi":{"$":0},"katsushika":{"$":0},"kita":{"$":0},"kiyose":{"$":0},"kodaira":{"$":0},"koganei":{"$":0},"kokubunji":{"$":0},"komae":{"$":0},"koto":{"$":0},"kouzushima":{"$":0},"kunitachi":{"$":0},"machida":{"$":0},"meguro":{"$":0},"minato":{"$":0},"mitaka":{"$":0},"mizuho":{"$":0},"musashimurayama":{"$":0},"musashino":{"$":0},"nakano":{"$":0},"nerima":{"$":0},"ogasawara":{"$":0},"okutama":{"$":0},"ome":{"$":0},"oshima":{"$":0},"ota":{"$":0},"setagaya":{"$":0},"shibuya":{"$":0},"shinagawa":{"$":0},"shinjuku":{"$":0},"suginami":{"$":0},"sumida":{"$":0},"tachikawa":{"$":0},"taito":{"$":0},"tama":{"$":0},"toshima":{"$":0}},"tottori":{"$":0,"chizu":{"$":0},"hino":{"$":0},"kawahara":{"$":0},"koge":{"$":0},"kotoura":{"$":0},"misasa":{"$":0},"nanbu":{"$":0},"nichinan":{"$":0},"sakaiminato":{"$":0},"tottori":{"$":0},"wakasa":{"$":0},"yazu":{"$":0},"yonago":{"$":0}},"toyama":{"$":0,"asahi":{"$":0},"fuchu":{"$":0},"fukumitsu":{"$":0},"funahashi":{"$":0},"himi":{"$":0},"imizu":{"$":0},"inami":{"$":0},"johana":{"$":0},"kamiichi":{"$":0},"kurobe":{"$":0},"nakaniikawa":{"$":0},"namerikawa":{"$":0},"nanto":{"$":0},"nyuzen":{"$":0},"oyabe":{"$":0},"taira":{"$":0},"takaoka":{"$":0},"tateyama":{"$":0},"toga":{"$":0},"tonami":{"$":0},"toyama":{"$":0},"unazuki":{"$":0},"uozu":{"$":0},"yamada":{"$":0}},"wakayama":{"$":0,"arida":{"$":0},"aridagawa":{"$":0},"gobo":{"$":0},"hashimoto":{"$":0},"hidaka":{"$":0},"hirogawa":{"$":0},"inami":{"$":0},"iwade":{"$":0},"kainan":{"$":0},"kamitonda":{"$":0},"katsuragi":{"$":0},"kimino":{"$":0},"kinokawa":{"$":0},"kitayama":{"$":0},"koya":{"$":0},"koza":{"$":0},"kozagawa":{"$":0},"kudoyama":{"$":0},"kushimoto":{"$":0},"mihama":{"$":0},"misato":{"$":0},"nachikatsuura":{"$":0},"shingu":{"$":0},"shirahama":{"$":0},"taiji":{"$":0},"tanabe":{"$":0},"wakayama":{"$":0},"yuasa":{"$":0},"yura":{"$":0}},"yamagata":{"$":0,"asahi":{"$":0},"funagata":{"$":0},"higashine":{"$":0},"iide":{"$":0},"kahoku":{"$":0},"kaminoyama":{"$":0},"kaneyama":{"$":0},"kawanishi":{"$":0},"mamurogawa":{"$":0},"mikawa":{"$":0},"murayama":{"$":0},"nagai":{"$":0},"nakayama":{"$":0},"nanyo":{"$":0},"nishikawa":{"$":0},"obanazawa":{"$":0},"oe":{"$":0},"oguni":{"$":0},"ohkura":{"$":0},"oishida":{"$":0},"sagae":{"$":0},"sakata":{"$":0},"sakegawa":{"$":0},"shinjo":{"$":0},"shirataka":{"$":0},"shonai":{"$":0},"takahata":{"$":0},"tendo":{"$":0},"tozawa":{"$":0},"tsuruoka":{"$":0},"yamagata":{"$":0},"yamanobe":{"$":0},"yonezawa":{"$":0},"yuza":{"$":0}},"yamaguchi":{"$":0,"abu":{"$":0},"hagi":{"$":0},"hikari":{"$":0},"hofu":{"$":0},"iwakuni":{"$":0},"kudamatsu":{"$":0},"mitou":{"$":0},"nagato":{"$":0},"oshima":{"$":0},"shimonoseki":{"$":0},"shunan":{"$":0},"tabuse":{"$":0},"tokuyama":{"$":0},"toyota":{"$":0},"ube":{"$":0},"yuu":{"$":0}},"yamanashi":{"$":0,"chuo":{"$":0},"doshi":{"$":0},"fuefuki":{"$":0},"fujikawa":{"$":0},"fujikawaguchiko":{"$":0},"fujiyoshida":{"$":0},"hayakawa":{"$":0},"hokuto":{"$":0},"ichikawamisato":{"$":0},"kai":{"$":0},"kofu":{"$":0},"koshu":{"$":0},"kosuge":{"$":0},"minami-alps":{"$":0},"minobu":{"$":0},"nakamichi":{"$":0},"nanbu":{"$":0},"narusawa":{"$":0},"nirasaki":{"$":0},"nishikatsura":{"$":0},"oshino":{"$":0},"otsuki":{"$":0},"showa":{"$":0},"tabayama":{"$":0},"tsuru":{"$":0},"uenohara":{"$":0},"yamanakako":{"$":0},"yamanashi":{"$":0}},"xn--4pvxs":{"$":0},"xn--vgu402c":{"$":0},"xn--c3s14m":{"$":0},"xn--f6qx53a":{"$":0},"xn--8pvr4u":{"$":0},"xn--uist22h":{"$":0},"xn--djrs72d6uy":{"$":0},"xn--mkru45i":{"$":0},"xn--0trq7p7nn":{"$":0},"xn--8ltr62k":{"$":0},"xn--2m4a15e":{"$":0},"xn--efvn9s":{"$":0},"xn--32vp30h":{"$":0},"xn--4it797k":{"$":0},"xn--1lqs71d":{"$":0},"xn--5rtp49c":{"$":0},"xn--5js045d":{"$":0},"xn--ehqz56n":{"$":0},"xn--1lqs03n":{"$":0},"xn--qqqt11m":{"$":0},"xn--kbrq7o":{"$":0},"xn--pssu33l":{"$":0},"xn--ntsq17g":{"$":0},"xn--uisz3g":{"$":0},"xn--6btw5a":{"$":0},"xn--1ctwo":{"$":0},"xn--6orx2r":{"$":0},"xn--rht61e":{"$":0},"xn--rht27z":{"$":0},"xn--djty4k":{"$":0},"xn--nit225k":{"$":0},"xn--rht3d":{"$":0},"xn--klty5x":{"$":0},"xn--kltx9a":{"$":0},"xn--kltp7d":{"$":0},"xn--uuwu58a":{"$":0},"xn--zbx025d":{"$":0},"xn--ntso0iqx3a":{"$":0},"xn--elqq16h":{"$":0},"xn--4it168d":{"$":0},"xn--klt787d":{"$":0},"xn--rny31h":{"$":0},"xn--7t0a264c":{"$":0},"xn--5rtq34k":{"$":0},"xn--k7yn95e":{"$":0},"xn--tor131o":{"$":0},"xn--d5qv7z876c":{"$":0},"kawasaki":{"*":{"$":0}},"kitakyushu":{"*":{"$":0}},"kobe":{"*":{"$":0}},"nagoya":{"*":{"$":0}},"sapporo":{"*":{"$":0}},"sendai":{"*":{"$":0}},"yokohama":{"*":{"$":0}},"blogspot":{"$":0}},"ke":{"*":{"$":0},"co":{"blogspot":{"$":0}}},"kg":{"$":0,"org":{"$":0},"net":{"$":0},"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"mil":{"$":0}},"kh":{"*":{"$":0}},"ki":{"$":0,"edu":{"$":0},"biz":{"$":0},"net":{"$":0},"org":{"$":0},"gov":{"$":0},"info":{"$":0},"com":{"$":0}},"km":{"$":0,"org":{"$":0},"nom":{"$":0},"gov":{"$":0},"prd":{"$":0},"tm":{"$":0},"edu":{"$":0},"mil":{"$":0},"ass":{"$":0},"com":{"$":0},"coop":{"$":0},"asso":{"$":0},"presse":{"$":0},"medecin":{"$":0},"notaires":{"$":0},"pharmaciens":{"$":0},"veterinaire":{"$":0},"gouv":{"$":0}},"kn":{"$":0,"net":{"$":0},"org":{"$":0},"edu":{"$":0},"gov":{"$":0}},"kp":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"org":{"$":0},"rep":{"$":0},"tra":{"$":0}},"kr":{"$":0,"ac":{"$":0},"co":{"$":0},"es":{"$":0},"go":{"$":0},"hs":{"$":0},"kg":{"$":0},"mil":{"$":0},"ms":{"$":0},"ne":{"$":0},"or":{"$":0},"pe":{"$":0},"re":{"$":0},"sc":{"$":0},"busan":{"$":0},"chungbuk":{"$":0},"chungnam":{"$":0},"daegu":{"$":0},"daejeon":{"$":0},"gangwon":{"$":0},"gwangju":{"$":0},"gyeongbuk":{"$":0},"gyeonggi":{"$":0},"gyeongnam":{"$":0},"incheon":{"$":0},"jeju":{"$":0},"jeonbuk":{"$":0},"jeonnam":{"$":0},"seoul":{"$":0},"ulsan":{"$":0},"blogspot":{"$":0}},"kw":{"*":{"$":0}},"ky":{"$":0,"edu":{"$":0},"gov":{"$":0},"com":{"$":0},"org":{"$":0},"net":{"$":0}},"kz":{"$":0,"org":{"$":0},"edu":{"$":0},"net":{"$":0},"gov":{"$":0},"mil":{"$":0},"com":{"$":0},"nym":{"$":0}},"la":{"$":0,"int":{"$":0},"net":{"$":0},"info":{"$":0},"edu":{"$":0},"gov":{"$":0},"per":{"$":0},"com":{"$":0},"org":{"$":0},"bnr":{"$":0},"c":{"$":0},"nym":{"$":0}},"lb":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"net":{"$":0},"org":{"$":0}},"lc":{"$":0,"com":{"$":0},"net":{"$":0},"co":{"$":0},"org":{"$":0},"edu":{"$":0},"gov":{"$":0},"oy":{"$":0}},"li":{"$":0,"blogspot":{"$":0},"nom":{"$":0},"nym":{"$":0}},"lk":{"$":0,"gov":{"$":0},"sch":{"$":0},"net":{"$":0},"int":{"$":0},"com":{"$":0},"org":{"$":0},"edu":{"$":0},"ngo":{"$":0},"soc":{"$":0},"web":{"$":0},"ltd":{"$":0},"assn":{"$":0},"grp":{"$":0},"hotel":{"$":0},"ac":{"$":0}},"lr":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"org":{"$":0},"net":{"$":0}},"ls":{"$":0,"co":{"$":0},"org":{"$":0}},"lt":{"$":0,"gov":{"$":0},"blogspot":{"$":0},"nym":{"$":0}},"lu":{"$":0,"blogspot":{"$":0},"nym":{"$":0}},"lv":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"org":{"$":0},"mil":{"$":0},"id":{"$":0},"net":{"$":0},"asn":{"$":0},"conf":{"$":0}},"ly":{"$":0,"com":{"$":0},"net":{"$":0},"gov":{"$":0},"plc":{"$":0},"edu":{"$":0},"sch":{"$":0},"med":{"$":0},"org":{"$":0},"id":{"$":0}},"ma":{"$":0,"co":{"$":0},"net":{"$":0},"gov":{"$":0},"org":{"$":0},"ac":{"$":0},"press":{"$":0}},"mc":{"$":0,"tm":{"$":0},"asso":{"$":0}},"md":{"$":0,"blogspot":{"$":0}},"me":{"$":0,"co":{"$":0},"net":{"$":0},"org":{"$":0},"edu":{"$":0},"ac":{"$":0},"gov":{"$":0},"its":{"$":0},"priv":{"$":0},"c66":{"$":0},"daplie":{"$":0,"localhost":{"$":0}},"filegear":{"$":0},"brasilia":{"$":0},"ddns":{"$":0},"dnsfor":{"$":0},"hopto":{"$":0},"loginto":{"$":0},"noip":{"$":0},"webhop":{"$":0},"nym":{"$":0},"diskstation":{"$":0},"dscloud":{"$":0},"i234":{"$":0},"myds":{"$":0},"synology":{"$":0},"wedeploy":{"$":0},"yombo":{"$":0}},"mg":{"$":0,"org":{"$":0},"nom":{"$":0},"gov":{"$":0},"prd":{"$":0},"tm":{"$":0},"edu":{"$":0},"mil":{"$":0},"com":{"$":0},"co":{"$":0}},"mh":{"$":0},"mil":{"$":0},"mk":{"$":0,"com":{"$":0},"org":{"$":0},"net":{"$":0},"edu":{"$":0},"gov":{"$":0},"inf":{"$":0},"name":{"$":0},"blogspot":{"$":0},"nom":{"$":0}},"ml":{"$":0,"com":{"$":0},"edu":{"$":0},"gouv":{"$":0},"gov":{"$":0},"net":{"$":0},"org":{"$":0},"presse":{"$":0}},"mm":{"*":{"$":0}},"mn":{"$":0,"gov":{"$":0},"edu":{"$":0},"org":{"$":0},"nyc":{"$":0}},"mo":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"edu":{"$":0},"gov":{"$":0}},"mobi":{"$":0,"dscloud":{"$":0}},"mp":{"$":0},"mq":{"$":0},"mr":{"$":0,"gov":{"$":0},"blogspot":{"$":0}},"ms":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"net":{"$":0},"org":{"$":0}},"mt":{"$":0,"com":{"$":0,"blogspot":{"$":0}},"edu":{"$":0},"net":{"$":0},"org":{"$":0}},"mu":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"gov":{"$":0},"ac":{"$":0},"co":{"$":0},"or":{"$":0}},"museum":{"$":0,"academy":{"$":0},"agriculture":{"$":0},"air":{"$":0},"airguard":{"$":0},"alabama":{"$":0},"alaska":{"$":0},"amber":{"$":0},"ambulance":{"$":0},"american":{"$":0},"americana":{"$":0},"americanantiques":{"$":0},"americanart":{"$":0},"amsterdam":{"$":0},"and":{"$":0},"annefrank":{"$":0},"anthro":{"$":0},"anthropology":{"$":0},"antiques":{"$":0},"aquarium":{"$":0},"arboretum":{"$":0},"archaeological":{"$":0},"archaeology":{"$":0},"architecture":{"$":0},"art":{"$":0},"artanddesign":{"$":0},"artcenter":{"$":0},"artdeco":{"$":0},"arteducation":{"$":0},"artgallery":{"$":0},"arts":{"$":0},"artsandcrafts":{"$":0},"asmatart":{"$":0},"assassination":{"$":0},"assisi":{"$":0},"association":{"$":0},"astronomy":{"$":0},"atlanta":{"$":0},"austin":{"$":0},"australia":{"$":0},"automotive":{"$":0},"aviation":{"$":0},"axis":{"$":0},"badajoz":{"$":0},"baghdad":{"$":0},"bahn":{"$":0},"bale":{"$":0},"baltimore":{"$":0},"barcelona":{"$":0},"baseball":{"$":0},"basel":{"$":0},"baths":{"$":0},"bauern":{"$":0},"beauxarts":{"$":0},"beeldengeluid":{"$":0},"bellevue":{"$":0},"bergbau":{"$":0},"berkeley":{"$":0},"berlin":{"$":0},"bern":{"$":0},"bible":{"$":0},"bilbao":{"$":0},"bill":{"$":0},"birdart":{"$":0},"birthplace":{"$":0},"bonn":{"$":0},"boston":{"$":0},"botanical":{"$":0},"botanicalgarden":{"$":0},"botanicgarden":{"$":0},"botany":{"$":0},"brandywinevalley":{"$":0},"brasil":{"$":0},"bristol":{"$":0},"british":{"$":0},"britishcolumbia":{"$":0},"broadcast":{"$":0},"brunel":{"$":0},"brussel":{"$":0},"brussels":{"$":0},"bruxelles":{"$":0},"building":{"$":0},"burghof":{"$":0},"bus":{"$":0},"bushey":{"$":0},"cadaques":{"$":0},"california":{"$":0},"cambridge":{"$":0},"can":{"$":0},"canada":{"$":0},"capebreton":{"$":0},"carrier":{"$":0},"cartoonart":{"$":0},"casadelamoneda":{"$":0},"castle":{"$":0},"castres":{"$":0},"celtic":{"$":0},"center":{"$":0},"chattanooga":{"$":0},"cheltenham":{"$":0},"chesapeakebay":{"$":0},"chicago":{"$":0},"children":{"$":0},"childrens":{"$":0},"childrensgarden":{"$":0},"chiropractic":{"$":0},"chocolate":{"$":0},"christiansburg":{"$":0},"cincinnati":{"$":0},"cinema":{"$":0},"circus":{"$":0},"civilisation":{"$":0},"civilization":{"$":0},"civilwar":{"$":0},"clinton":{"$":0},"clock":{"$":0},"coal":{"$":0},"coastaldefence":{"$":0},"cody":{"$":0},"coldwar":{"$":0},"collection":{"$":0},"colonialwilliamsburg":{"$":0},"coloradoplateau":{"$":0},"columbia":{"$":0},"columbus":{"$":0},"communication":{"$":0},"communications":{"$":0},"community":{"$":0},"computer":{"$":0},"computerhistory":{"$":0},"xn--comunicaes-v6a2o":{"$":0},"contemporary":{"$":0},"contemporaryart":{"$":0},"convent":{"$":0},"copenhagen":{"$":0},"corporation":{"$":0},"xn--correios-e-telecomunicaes-ghc29a":{"$":0},"corvette":{"$":0},"costume":{"$":0},"countryestate":{"$":0},"county":{"$":0},"crafts":{"$":0},"cranbrook":{"$":0},"creation":{"$":0},"cultural":{"$":0},"culturalcenter":{"$":0},"culture":{"$":0},"cyber":{"$":0},"cymru":{"$":0},"dali":{"$":0},"dallas":{"$":0},"database":{"$":0},"ddr":{"$":0},"decorativearts":{"$":0},"delaware":{"$":0},"delmenhorst":{"$":0},"denmark":{"$":0},"depot":{"$":0},"design":{"$":0},"detroit":{"$":0},"dinosaur":{"$":0},"discovery":{"$":0},"dolls":{"$":0},"donostia":{"$":0},"durham":{"$":0},"eastafrica":{"$":0},"eastcoast":{"$":0},"education":{"$":0},"educational":{"$":0},"egyptian":{"$":0},"eisenbahn":{"$":0},"elburg":{"$":0},"elvendrell":{"$":0},"embroidery":{"$":0},"encyclopedic":{"$":0},"england":{"$":0},"entomology":{"$":0},"environment":{"$":0},"environmentalconservation":{"$":0},"epilepsy":{"$":0},"essex":{"$":0},"estate":{"$":0},"ethnology":{"$":0},"exeter":{"$":0},"exhibition":{"$":0},"family":{"$":0},"farm":{"$":0},"farmequipment":{"$":0},"farmers":{"$":0},"farmstead":{"$":0},"field":{"$":0},"figueres":{"$":0},"filatelia":{"$":0},"film":{"$":0},"fineart":{"$":0},"finearts":{"$":0},"finland":{"$":0},"flanders":{"$":0},"florida":{"$":0},"force":{"$":0},"fortmissoula":{"$":0},"fortworth":{"$":0},"foundation":{"$":0},"francaise":{"$":0},"frankfurt":{"$":0},"franziskaner":{"$":0},"freemasonry":{"$":0},"freiburg":{"$":0},"fribourg":{"$":0},"frog":{"$":0},"fundacio":{"$":0},"furniture":{"$":0},"gallery":{"$":0},"garden":{"$":0},"gateway":{"$":0},"geelvinck":{"$":0},"gemological":{"$":0},"geology":{"$":0},"georgia":{"$":0},"giessen":{"$":0},"glas":{"$":0},"glass":{"$":0},"gorge":{"$":0},"grandrapids":{"$":0},"graz":{"$":0},"guernsey":{"$":0},"halloffame":{"$":0},"hamburg":{"$":0},"handson":{"$":0},"harvestcelebration":{"$":0},"hawaii":{"$":0},"health":{"$":0},"heimatunduhren":{"$":0},"hellas":{"$":0},"helsinki":{"$":0},"hembygdsforbund":{"$":0},"heritage":{"$":0},"histoire":{"$":0},"historical":{"$":0},"historicalsociety":{"$":0},"historichouses":{"$":0},"historisch":{"$":0},"historisches":{"$":0},"history":{"$":0},"historyofscience":{"$":0},"horology":{"$":0},"house":{"$":0},"humanities":{"$":0},"illustration":{"$":0},"imageandsound":{"$":0},"indian":{"$":0},"indiana":{"$":0},"indianapolis":{"$":0},"indianmarket":{"$":0},"intelligence":{"$":0},"interactive":{"$":0},"iraq":{"$":0},"iron":{"$":0},"isleofman":{"$":0},"jamison":{"$":0},"jefferson":{"$":0},"jerusalem":{"$":0},"jewelry":{"$":0},"jewish":{"$":0},"jewishart":{"$":0},"jfk":{"$":0},"journalism":{"$":0},"judaica":{"$":0},"judygarland":{"$":0},"juedisches":{"$":0},"juif":{"$":0},"karate":{"$":0},"karikatur":{"$":0},"kids":{"$":0},"koebenhavn":{"$":0},"koeln":{"$":0},"kunst":{"$":0},"kunstsammlung":{"$":0},"kunstunddesign":{"$":0},"labor":{"$":0},"labour":{"$":0},"lajolla":{"$":0},"lancashire":{"$":0},"landes":{"$":0},"lans":{"$":0},"xn--lns-qla":{"$":0},"larsson":{"$":0},"lewismiller":{"$":0},"lincoln":{"$":0},"linz":{"$":0},"living":{"$":0},"livinghistory":{"$":0},"localhistory":{"$":0},"london":{"$":0},"losangeles":{"$":0},"louvre":{"$":0},"loyalist":{"$":0},"lucerne":{"$":0},"luxembourg":{"$":0},"luzern":{"$":0},"mad":{"$":0},"madrid":{"$":0},"mallorca":{"$":0},"manchester":{"$":0},"mansion":{"$":0},"mansions":{"$":0},"manx":{"$":0},"marburg":{"$":0},"maritime":{"$":0},"maritimo":{"$":0},"maryland":{"$":0},"marylhurst":{"$":0},"media":{"$":0},"medical":{"$":0},"medizinhistorisches":{"$":0},"meeres":{"$":0},"memorial":{"$":0},"mesaverde":{"$":0},"michigan":{"$":0},"midatlantic":{"$":0},"military":{"$":0},"mill":{"$":0},"miners":{"$":0},"mining":{"$":0},"minnesota":{"$":0},"missile":{"$":0},"missoula":{"$":0},"modern":{"$":0},"moma":{"$":0},"money":{"$":0},"monmouth":{"$":0},"monticello":{"$":0},"montreal":{"$":0},"moscow":{"$":0},"motorcycle":{"$":0},"muenchen":{"$":0},"muenster":{"$":0},"mulhouse":{"$":0},"muncie":{"$":0},"museet":{"$":0},"museumcenter":{"$":0},"museumvereniging":{"$":0},"music":{"$":0},"national":{"$":0},"nationalfirearms":{"$":0},"nationalheritage":{"$":0},"nativeamerican":{"$":0},"naturalhistory":{"$":0},"naturalhistorymuseum":{"$":0},"naturalsciences":{"$":0},"nature":{"$":0},"naturhistorisches":{"$":0},"natuurwetenschappen":{"$":0},"naumburg":{"$":0},"naval":{"$":0},"nebraska":{"$":0},"neues":{"$":0},"newhampshire":{"$":0},"newjersey":{"$":0},"newmexico":{"$":0},"newport":{"$":0},"newspaper":{"$":0},"newyork":{"$":0},"niepce":{"$":0},"norfolk":{"$":0},"north":{"$":0},"nrw":{"$":0},"nuernberg":{"$":0},"nuremberg":{"$":0},"nyc":{"$":0},"nyny":{"$":0},"oceanographic":{"$":0},"oceanographique":{"$":0},"omaha":{"$":0},"online":{"$":0},"ontario":{"$":0},"openair":{"$":0},"oregon":{"$":0},"oregontrail":{"$":0},"otago":{"$":0},"oxford":{"$":0},"pacific":{"$":0},"paderborn":{"$":0},"palace":{"$":0},"paleo":{"$":0},"palmsprings":{"$":0},"panama":{"$":0},"paris":{"$":0},"pasadena":{"$":0},"pharmacy":{"$":0},"philadelphia":{"$":0},"philadelphiaarea":{"$":0},"philately":{"$":0},"phoenix":{"$":0},"photography":{"$":0},"pilots":{"$":0},"pittsburgh":{"$":0},"planetarium":{"$":0},"plantation":{"$":0},"plants":{"$":0},"plaza":{"$":0},"portal":{"$":0},"portland":{"$":0},"portlligat":{"$":0},"posts-and-telecommunications":{"$":0},"preservation":{"$":0},"presidio":{"$":0},"press":{"$":0},"project":{"$":0},"public":{"$":0},"pubol":{"$":0},"quebec":{"$":0},"railroad":{"$":0},"railway":{"$":0},"research":{"$":0},"resistance":{"$":0},"riodejaneiro":{"$":0},"rochester":{"$":0},"rockart":{"$":0},"roma":{"$":0},"russia":{"$":0},"saintlouis":{"$":0},"salem":{"$":0},"salvadordali":{"$":0},"salzburg":{"$":0},"sandiego":{"$":0},"sanfrancisco":{"$":0},"santabarbara":{"$":0},"santacruz":{"$":0},"santafe":{"$":0},"saskatchewan":{"$":0},"satx":{"$":0},"savannahga":{"$":0},"schlesisches":{"$":0},"schoenbrunn":{"$":0},"schokoladen":{"$":0},"school":{"$":0},"schweiz":{"$":0},"science":{"$":0},"scienceandhistory":{"$":0},"scienceandindustry":{"$":0},"sciencecenter":{"$":0},"sciencecenters":{"$":0},"science-fiction":{"$":0},"sciencehistory":{"$":0},"sciences":{"$":0},"sciencesnaturelles":{"$":0},"scotland":{"$":0},"seaport":{"$":0},"settlement":{"$":0},"settlers":{"$":0},"shell":{"$":0},"sherbrooke":{"$":0},"sibenik":{"$":0},"silk":{"$":0},"ski":{"$":0},"skole":{"$":0},"society":{"$":0},"sologne":{"$":0},"soundandvision":{"$":0},"southcarolina":{"$":0},"southwest":{"$":0},"space":{"$":0},"spy":{"$":0},"square":{"$":0},"stadt":{"$":0},"stalbans":{"$":0},"starnberg":{"$":0},"state":{"$":0},"stateofdelaware":{"$":0},"station":{"$":0},"steam":{"$":0},"steiermark":{"$":0},"stjohn":{"$":0},"stockholm":{"$":0},"stpetersburg":{"$":0},"stuttgart":{"$":0},"suisse":{"$":0},"surgeonshall":{"$":0},"surrey":{"$":0},"svizzera":{"$":0},"sweden":{"$":0},"sydney":{"$":0},"tank":{"$":0},"tcm":{"$":0},"technology":{"$":0},"telekommunikation":{"$":0},"television":{"$":0},"texas":{"$":0},"textile":{"$":0},"theater":{"$":0},"time":{"$":0},"timekeeping":{"$":0},"topology":{"$":0},"torino":{"$":0},"touch":{"$":0},"town":{"$":0},"transport":{"$":0},"tree":{"$":0},"trolley":{"$":0},"trust":{"$":0},"trustee":{"$":0},"uhren":{"$":0},"ulm":{"$":0},"undersea":{"$":0},"university":{"$":0},"usa":{"$":0},"usantiques":{"$":0},"usarts":{"$":0},"uscountryestate":{"$":0},"usculture":{"$":0},"usdecorativearts":{"$":0},"usgarden":{"$":0},"ushistory":{"$":0},"ushuaia":{"$":0},"uslivinghistory":{"$":0},"utah":{"$":0},"uvic":{"$":0},"valley":{"$":0},"vantaa":{"$":0},"versailles":{"$":0},"viking":{"$":0},"village":{"$":0},"virginia":{"$":0},"virtual":{"$":0},"virtuel":{"$":0},"vlaanderen":{"$":0},"volkenkunde":{"$":0},"wales":{"$":0},"wallonie":{"$":0},"war":{"$":0},"washingtondc":{"$":0},"watchandclock":{"$":0},"watch-and-clock":{"$":0},"western":{"$":0},"westfalen":{"$":0},"whaling":{"$":0},"wildlife":{"$":0},"williamsburg":{"$":0},"windmill":{"$":0},"workshop":{"$":0},"york":{"$":0},"yorkshire":{"$":0},"yosemite":{"$":0},"youth":{"$":0},"zoological":{"$":0},"zoology":{"$":0},"xn--9dbhblg6di":{"$":0},"xn--h1aegh":{"$":0}},"mv":{"$":0,"aero":{"$":0},"biz":{"$":0},"com":{"$":0},"coop":{"$":0},"edu":{"$":0},"gov":{"$":0},"info":{"$":0},"int":{"$":0},"mil":{"$":0},"museum":{"$":0},"name":{"$":0},"net":{"$":0},"org":{"$":0},"pro":{"$":0}},"mw":{"$":0,"ac":{"$":0},"biz":{"$":0},"co":{"$":0},"com":{"$":0},"coop":{"$":0},"edu":{"$":0},"gov":{"$":0},"int":{"$":0},"museum":{"$":0},"net":{"$":0},"org":{"$":0}},"mx":{"$":0,"com":{"$":0},"org":{"$":0},"gob":{"$":0},"edu":{"$":0},"net":{"$":0},"blogspot":{"$":0},"nym":{"$":0}},"my":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"gov":{"$":0},"edu":{"$":0},"mil":{"$":0},"name":{"$":0},"blogspot":{"$":0}},"mz":{"$":0,"ac":{"$":0},"adv":{"$":0},"co":{"$":0},"edu":{"$":0},"gov":{"$":0},"mil":{"$":0},"net":{"$":0},"org":{"$":0}},"na":{"$":0,"info":{"$":0},"pro":{"$":0},"name":{"$":0},"school":{"$":0},"or":{"$":0},"dr":{"$":0},"us":{"$":0},"mx":{"$":0},"ca":{"$":0},"in":{"$":0},"cc":{"$":0},"tv":{"$":0},"ws":{"$":0},"mobi":{"$":0},"co":{"$":0},"com":{"$":0},"org":{"$":0}},"name":{"$":0,"her":{"forgot":{"$":0}},"his":{"forgot":{"$":0}}},"nc":{"$":0,"asso":{"$":0},"nom":{"$":0}},"ne":{"$":0},"net":{"$":0,"alwaysdata":{"*":{"$":0}},"cloudfront":{"$":0},"t3l3p0rt":{"$":0},"myfritz":{"$":0},"boomla":{"$":0},"bplaced":{"$":0},"square7":{"$":0},"gb":{"$":0},"hu":{"$":0},"jp":{"$":0},"se":{"$":0},"uk":{"$":0},"in":{"$":0},"cloudaccess":{"$":0},"cdn77-ssl":{"$":0},"cdn77":{"r":{"$":0}},"feste-ip":{"$":0},"knx-server":{"$":0},"static-access":{"$":0},"cryptonomic":{"*":{"$":0}},"debian":{"$":0},"at-band-camp":{"$":0},"blogdns":{"$":0},"broke-it":{"$":0},"buyshouses":{"$":0},"dnsalias":{"$":0},"dnsdojo":{"$":0},"does-it":{"$":0},"dontexist":{"$":0},"dynalias":{"$":0},"dynathome":{"$":0},"endofinternet":{"$":0},"from-az":{"$":0},"from-co":{"$":0},"from-la":{"$":0},"from-ny":{"$":0},"gets-it":{"$":0},"ham-radio-op":{"$":0},"homeftp":{"$":0},"homeip":{"$":0},"homelinux":{"$":0},"homeunix":{"$":0},"in-the-band":{"$":0},"is-a-chef":{"$":0},"is-a-geek":{"$":0},"isa-geek":{"$":0},"kicks-ass":{"$":0},"office-on-the":{"$":0},"podzone":{"$":0},"scrapper-site":{"$":0},"selfip":{"$":0},"sells-it":{"$":0},"servebbs":{"$":0},"serveftp":{"$":0},"thruhere":{"$":0},"webhop":{"$":0},"definima":{"$":0},"casacam":{"$":0},"dynu":{"$":0},"dynv6":{"$":0},"twmail":{"$":0},"ru":{"$":0},"channelsdvr":{"$":0},"fastlylb":{"$":0,"map":{"$":0}},"fastly":{"freetls":{"$":0},"map":{"$":0},"prod":{"a":{"$":0},"global":{"$":0}},"ssl":{"a":{"$":0},"b":{"$":0},"global":{"$":0}}},"flynnhosting":{"$":0},"cloudfunctions":{"$":0},"moonscale":{"$":0},"ipifony":{"$":0},"barsy":{"$":0},"azurewebsites":{"$":0},"azure-mobile":{"$":0},"cloudapp":{"$":0},"eating-organic":{"$":0},"mydissent":{"$":0},"myeffect":{"$":0},"mymediapc":{"$":0},"mypsx":{"$":0},"mysecuritycamera":{"$":0},"nhlfan":{"$":0},"no-ip":{"$":0},"pgafan":{"$":0},"privatizehealthinsurance":{"$":0},"bounceme":{"$":0},"ddns":{"$":0},"redirectme":{"$":0},"serveblog":{"$":0},"serveminecraft":{"$":0},"sytes":{"$":0},"rackmaze":{"$":0},"firewall-gateway":{"$":0},"dsmynas":{"$":0},"familyds":{"$":0},"za":{"$":0}},"nf":{"$":0,"com":{"$":0},"net":{"$":0},"per":{"$":0},"rec":{"$":0},"web":{"$":0},"arts":{"$":0},"firm":{"$":0},"info":{"$":0},"other":{"$":0},"store":{"$":0}},"ng":{"$":0,"com":{"$":0,"blogspot":{"$":0}},"edu":{"$":0},"gov":{"$":0},"i":{"$":0},"mil":{"$":0},"mobi":{"$":0},"name":{"$":0},"net":{"$":0},"org":{"$":0},"sch":{"$":0}},"ni":{"$":0,"ac":{"$":0},"biz":{"$":0},"co":{"$":0},"com":{"$":0},"edu":{"$":0},"gob":{"$":0},"in":{"$":0},"info":{"$":0},"int":{"$":0},"mil":{"$":0},"net":{"$":0},"nom":{"$":0},"org":{"$":0},"web":{"$":0}},"nl":{"$":0,"bv":{"$":0},"virtueeldomein":{"$":0},"co":{"$":0},"blogspot":{"$":0},"transurl":{"*":{"$":0}},"cistron":{"$":0},"demon":{"$":0}},"no":{"$":0,"fhs":{"$":0},"vgs":{"$":0},"fylkesbibl":{"$":0},"folkebibl":{"$":0},"museum":{"$":0},"idrett":{"$":0},"priv":{"$":0},"mil":{"$":0},"stat":{"$":0},"dep":{"$":0},"kommune":{"$":0},"herad":{"$":0},"aa":{"$":0,"gs":{"$":0}},"ah":{"$":0,"gs":{"$":0}},"bu":{"$":0,"gs":{"$":0}},"fm":{"$":0,"gs":{"$":0}},"hl":{"$":0,"gs":{"$":0}},"hm":{"$":0,"gs":{"$":0}},"jan-mayen":{"$":0,"gs":{"$":0}},"mr":{"$":0,"gs":{"$":0}},"nl":{"$":0,"gs":{"$":0}},"nt":{"$":0,"gs":{"$":0}},"of":{"$":0,"gs":{"$":0}},"ol":{"$":0,"gs":{"$":0}},"oslo":{"$":0,"gs":{"$":0}},"rl":{"$":0,"gs":{"$":0}},"sf":{"$":0,"gs":{"$":0}},"st":{"$":0,"gs":{"$":0}},"svalbard":{"$":0,"gs":{"$":0}},"tm":{"$":0,"gs":{"$":0}},"tr":{"$":0,"gs":{"$":0}},"va":{"$":0,"gs":{"$":0}},"vf":{"$":0,"gs":{"$":0}},"akrehamn":{"$":0},"xn--krehamn-dxa":{"$":0},"algard":{"$":0},"xn--lgrd-poac":{"$":0},"arna":{"$":0},"brumunddal":{"$":0},"bryne":{"$":0},"bronnoysund":{"$":0},"xn--brnnysund-m8ac":{"$":0},"drobak":{"$":0},"xn--drbak-wua":{"$":0},"egersund":{"$":0},"fetsund":{"$":0},"floro":{"$":0},"xn--flor-jra":{"$":0},"fredrikstad":{"$":0},"hokksund":{"$":0},"honefoss":{"$":0},"xn--hnefoss-q1a":{"$":0},"jessheim":{"$":0},"jorpeland":{"$":0},"xn--jrpeland-54a":{"$":0},"kirkenes":{"$":0},"kopervik":{"$":0},"krokstadelva":{"$":0},"langevag":{"$":0},"xn--langevg-jxa":{"$":0},"leirvik":{"$":0},"mjondalen":{"$":0},"xn--mjndalen-64a":{"$":0},"mo-i-rana":{"$":0},"mosjoen":{"$":0},"xn--mosjen-eya":{"$":0},"nesoddtangen":{"$":0},"orkanger":{"$":0},"osoyro":{"$":0},"xn--osyro-wua":{"$":0},"raholt":{"$":0},"xn--rholt-mra":{"$":0},"sandnessjoen":{"$":0},"xn--sandnessjen-ogb":{"$":0},"skedsmokorset":{"$":0},"slattum":{"$":0},"spjelkavik":{"$":0},"stathelle":{"$":0},"stavern":{"$":0},"stjordalshalsen":{"$":0},"xn--stjrdalshalsen-sqb":{"$":0},"tananger":{"$":0},"tranby":{"$":0},"vossevangen":{"$":0},"afjord":{"$":0},"xn--fjord-lra":{"$":0},"agdenes":{"$":0},"al":{"$":0},"xn--l-1fa":{"$":0},"alesund":{"$":0},"xn--lesund-hua":{"$":0},"alstahaug":{"$":0},"alta":{"$":0},"xn--lt-liac":{"$":0},"alaheadju":{"$":0},"xn--laheadju-7ya":{"$":0},"alvdal":{"$":0},"amli":{"$":0},"xn--mli-tla":{"$":0},"amot":{"$":0},"xn--mot-tla":{"$":0},"andebu":{"$":0},"andoy":{"$":0},"xn--andy-ira":{"$":0},"andasuolo":{"$":0},"ardal":{"$":0},"xn--rdal-poa":{"$":0},"aremark":{"$":0},"arendal":{"$":0},"xn--s-1fa":{"$":0},"aseral":{"$":0},"xn--seral-lra":{"$":0},"asker":{"$":0},"askim":{"$":0},"askvoll":{"$":0},"askoy":{"$":0},"xn--asky-ira":{"$":0},"asnes":{"$":0},"xn--snes-poa":{"$":0},"audnedaln":{"$":0},"aukra":{"$":0},"aure":{"$":0},"aurland":{"$":0},"aurskog-holand":{"$":0},"xn--aurskog-hland-jnb":{"$":0},"austevoll":{"$":0},"austrheim":{"$":0},"averoy":{"$":0},"xn--avery-yua":{"$":0},"balestrand":{"$":0},"ballangen":{"$":0},"balat":{"$":0},"xn--blt-elab":{"$":0},"balsfjord":{"$":0},"bahccavuotna":{"$":0},"xn--bhccavuotna-k7a":{"$":0},"bamble":{"$":0},"bardu":{"$":0},"beardu":{"$":0},"beiarn":{"$":0},"bajddar":{"$":0},"xn--bjddar-pta":{"$":0},"baidar":{"$":0},"xn--bidr-5nac":{"$":0},"berg":{"$":0},"bergen":{"$":0},"berlevag":{"$":0},"xn--berlevg-jxa":{"$":0},"bearalvahki":{"$":0},"xn--bearalvhki-y4a":{"$":0},"bindal":{"$":0},"birkenes":{"$":0},"bjarkoy":{"$":0},"xn--bjarky-fya":{"$":0},"bjerkreim":{"$":0},"bjugn":{"$":0},"bodo":{"$":0},"xn--bod-2na":{"$":0},"badaddja":{"$":0},"xn--bdddj-mrabd":{"$":0},"budejju":{"$":0},"bokn":{"$":0},"bremanger":{"$":0},"bronnoy":{"$":0},"xn--brnny-wuac":{"$":0},"bygland":{"$":0},"bykle":{"$":0},"barum":{"$":0},"xn--brum-voa":{"$":0},"telemark":{"bo":{"$":0},"xn--b-5ga":{"$":0}},"nordland":{"bo":{"$":0},"xn--b-5ga":{"$":0},"heroy":{"$":0},"xn--hery-ira":{"$":0}},"bievat":{"$":0},"xn--bievt-0qa":{"$":0},"bomlo":{"$":0},"xn--bmlo-gra":{"$":0},"batsfjord":{"$":0},"xn--btsfjord-9za":{"$":0},"bahcavuotna":{"$":0},"xn--bhcavuotna-s4a":{"$":0},"dovre":{"$":0},"drammen":{"$":0},"drangedal":{"$":0},"dyroy":{"$":0},"xn--dyry-ira":{"$":0},"donna":{"$":0},"xn--dnna-gra":{"$":0},"eid":{"$":0},"eidfjord":{"$":0},"eidsberg":{"$":0},"eidskog":{"$":0},"eidsvoll":{"$":0},"eigersund":{"$":0},"elverum":{"$":0},"enebakk":{"$":0},"engerdal":{"$":0},"etne":{"$":0},"etnedal":{"$":0},"evenes":{"$":0},"evenassi":{"$":0},"xn--eveni-0qa01ga":{"$":0},"evje-og-hornnes":{"$":0},"farsund":{"$":0},"fauske":{"$":0},"fuossko":{"$":0},"fuoisku":{"$":0},"fedje":{"$":0},"fet":{"$":0},"finnoy":{"$":0},"xn--finny-yua":{"$":0},"fitjar":{"$":0},"fjaler":{"$":0},"fjell":{"$":0},"flakstad":{"$":0},"flatanger":{"$":0},"flekkefjord":{"$":0},"flesberg":{"$":0},"flora":{"$":0},"fla":{"$":0},"xn--fl-zia":{"$":0},"folldal":{"$":0},"forsand":{"$":0},"fosnes":{"$":0},"frei":{"$":0},"frogn":{"$":0},"froland":{"$":0},"frosta":{"$":0},"frana":{"$":0},"xn--frna-woa":{"$":0},"froya":{"$":0},"xn--frya-hra":{"$":0},"fusa":{"$":0},"fyresdal":{"$":0},"forde":{"$":0},"xn--frde-gra":{"$":0},"gamvik":{"$":0},"gangaviika":{"$":0},"xn--ggaviika-8ya47h":{"$":0},"gaular":{"$":0},"gausdal":{"$":0},"gildeskal":{"$":0},"xn--gildeskl-g0a":{"$":0},"giske":{"$":0},"gjemnes":{"$":0},"gjerdrum":{"$":0},"gjerstad":{"$":0},"gjesdal":{"$":0},"gjovik":{"$":0},"xn--gjvik-wua":{"$":0},"gloppen":{"$":0},"gol":{"$":0},"gran":{"$":0},"grane":{"$":0},"granvin":{"$":0},"gratangen":{"$":0},"grimstad":{"$":0},"grong":{"$":0},"kraanghke":{"$":0},"xn--kranghke-b0a":{"$":0},"grue":{"$":0},"gulen":{"$":0},"hadsel":{"$":0},"halden":{"$":0},"halsa":{"$":0},"hamar":{"$":0},"hamaroy":{"$":0},"habmer":{"$":0},"xn--hbmer-xqa":{"$":0},"hapmir":{"$":0},"xn--hpmir-xqa":{"$":0},"hammerfest":{"$":0},"hammarfeasta":{"$":0},"xn--hmmrfeasta-s4ac":{"$":0},"haram":{"$":0},"hareid":{"$":0},"harstad":{"$":0},"hasvik":{"$":0},"aknoluokta":{"$":0},"xn--koluokta-7ya57h":{"$":0},"hattfjelldal":{"$":0},"aarborte":{"$":0},"haugesund":{"$":0},"hemne":{"$":0},"hemnes":{"$":0},"hemsedal":{"$":0},"more-og-romsdal":{"heroy":{"$":0},"sande":{"$":0}},"xn--mre-og-romsdal-qqb":{"xn--hery-ira":{"$":0},"sande":{"$":0}},"hitra":{"$":0},"hjartdal":{"$":0},"hjelmeland":{"$":0},"hobol":{"$":0},"xn--hobl-ira":{"$":0},"hof":{"$":0},"hol":{"$":0},"hole":{"$":0},"holmestrand":{"$":0},"holtalen":{"$":0},"xn--holtlen-hxa":{"$":0},"hornindal":{"$":0},"horten":{"$":0},"hurdal":{"$":0},"hurum":{"$":0},"hvaler":{"$":0},"hyllestad":{"$":0},"hagebostad":{"$":0},"xn--hgebostad-g3a":{"$":0},"hoyanger":{"$":0},"xn--hyanger-q1a":{"$":0},"hoylandet":{"$":0},"xn--hylandet-54a":{"$":0},"ha":{"$":0},"xn--h-2fa":{"$":0},"ibestad":{"$":0},"inderoy":{"$":0},"xn--indery-fya":{"$":0},"iveland":{"$":0},"jevnaker":{"$":0},"jondal":{"$":0},"jolster":{"$":0},"xn--jlster-bya":{"$":0},"karasjok":{"$":0},"karasjohka":{"$":0},"xn--krjohka-hwab49j":{"$":0},"karlsoy":{"$":0},"galsa":{"$":0},"xn--gls-elac":{"$":0},"karmoy":{"$":0},"xn--karmy-yua":{"$":0},"kautokeino":{"$":0},"guovdageaidnu":{"$":0},"klepp":{"$":0},"klabu":{"$":0},"xn--klbu-woa":{"$":0},"kongsberg":{"$":0},"kongsvinger":{"$":0},"kragero":{"$":0},"xn--krager-gya":{"$":0},"kristiansand":{"$":0},"kristiansund":{"$":0},"krodsherad":{"$":0},"xn--krdsherad-m8a":{"$":0},"kvalsund":{"$":0},"rahkkeravju":{"$":0},"xn--rhkkervju-01af":{"$":0},"kvam":{"$":0},"kvinesdal":{"$":0},"kvinnherad":{"$":0},"kviteseid":{"$":0},"kvitsoy":{"$":0},"xn--kvitsy-fya":{"$":0},"kvafjord":{"$":0},"xn--kvfjord-nxa":{"$":0},"giehtavuoatna":{"$":0},"kvanangen":{"$":0},"xn--kvnangen-k0a":{"$":0},"navuotna":{"$":0},"xn--nvuotna-hwa":{"$":0},"kafjord":{"$":0},"xn--kfjord-iua":{"$":0},"gaivuotna":{"$":0},"xn--givuotna-8ya":{"$":0},"larvik":{"$":0},"lavangen":{"$":0},"lavagis":{"$":0},"loabat":{"$":0},"xn--loabt-0qa":{"$":0},"lebesby":{"$":0},"davvesiida":{"$":0},"leikanger":{"$":0},"leirfjord":{"$":0},"leka":{"$":0},"leksvik":{"$":0},"lenvik":{"$":0},"leangaviika":{"$":0},"xn--leagaviika-52b":{"$":0},"lesja":{"$":0},"levanger":{"$":0},"lier":{"$":0},"lierne":{"$":0},"lillehammer":{"$":0},"lillesand":{"$":0},"lindesnes":{"$":0},"lindas":{"$":0},"xn--linds-pra":{"$":0},"lom":{"$":0},"loppa":{"$":0},"lahppi":{"$":0},"xn--lhppi-xqa":{"$":0},"lund":{"$":0},"lunner":{"$":0},"luroy":{"$":0},"xn--lury-ira":{"$":0},"luster":{"$":0},"lyngdal":{"$":0},"lyngen":{"$":0},"ivgu":{"$":0},"lardal":{"$":0},"lerdal":{"$":0},"xn--lrdal-sra":{"$":0},"lodingen":{"$":0},"xn--ldingen-q1a":{"$":0},"lorenskog":{"$":0},"xn--lrenskog-54a":{"$":0},"loten":{"$":0},"xn--lten-gra":{"$":0},"malvik":{"$":0},"masoy":{"$":0},"xn--msy-ula0h":{"$":0},"muosat":{"$":0},"xn--muost-0qa":{"$":0},"mandal":{"$":0},"marker":{"$":0},"marnardal":{"$":0},"masfjorden":{"$":0},"meland":{"$":0},"meldal":{"$":0},"melhus":{"$":0},"meloy":{"$":0},"xn--mely-ira":{"$":0},"meraker":{"$":0},"xn--merker-kua":{"$":0},"moareke":{"$":0},"xn--moreke-jua":{"$":0},"midsund":{"$":0},"midtre-gauldal":{"$":0},"modalen":{"$":0},"modum":{"$":0},"molde":{"$":0},"moskenes":{"$":0},"moss":{"$":0},"mosvik":{"$":0},"malselv":{"$":0},"xn--mlselv-iua":{"$":0},"malatvuopmi":{"$":0},"xn--mlatvuopmi-s4a":{"$":0},"namdalseid":{"$":0},"aejrie":{"$":0},"namsos":{"$":0},"namsskogan":{"$":0},"naamesjevuemie":{"$":0},"xn--nmesjevuemie-tcba":{"$":0},"laakesvuemie":{"$":0},"nannestad":{"$":0},"narvik":{"$":0},"narviika":{"$":0},"naustdal":{"$":0},"nedre-eiker":{"$":0},"akershus":{"nes":{"$":0}},"buskerud":{"nes":{"$":0}},"nesna":{"$":0},"nesodden":{"$":0},"nesseby":{"$":0},"unjarga":{"$":0},"xn--unjrga-rta":{"$":0},"nesset":{"$":0},"nissedal":{"$":0},"nittedal":{"$":0},"nord-aurdal":{"$":0},"nord-fron":{"$":0},"nord-odal":{"$":0},"norddal":{"$":0},"nordkapp":{"$":0},"davvenjarga":{"$":0},"xn--davvenjrga-y4a":{"$":0},"nordre-land":{"$":0},"nordreisa":{"$":0},"raisa":{"$":0},"xn--risa-5na":{"$":0},"nore-og-uvdal":{"$":0},"notodden":{"$":0},"naroy":{"$":0},"xn--nry-yla5g":{"$":0},"notteroy":{"$":0},"xn--nttery-byae":{"$":0},"odda":{"$":0},"oksnes":{"$":0},"xn--ksnes-uua":{"$":0},"oppdal":{"$":0},"oppegard":{"$":0},"xn--oppegrd-ixa":{"$":0},"orkdal":{"$":0},"orland":{"$":0},"xn--rland-uua":{"$":0},"orskog":{"$":0},"xn--rskog-uua":{"$":0},"orsta":{"$":0},"xn--rsta-fra":{"$":0},"hedmark":{"os":{"$":0},"valer":{"$":0},"xn--vler-qoa":{"$":0}},"hordaland":{"os":{"$":0}},"osen":{"$":0},"osteroy":{"$":0},"xn--ostery-fya":{"$":0},"ostre-toten":{"$":0},"xn--stre-toten-zcb":{"$":0},"overhalla":{"$":0},"ovre-eiker":{"$":0},"xn--vre-eiker-k8a":{"$":0},"oyer":{"$":0},"xn--yer-zna":{"$":0},"oygarden":{"$":0},"xn--ygarden-p1a":{"$":0},"oystre-slidre":{"$":0},"xn--ystre-slidre-ujb":{"$":0},"porsanger":{"$":0},"porsangu":{"$":0},"xn--porsgu-sta26f":{"$":0},"porsgrunn":{"$":0},"radoy":{"$":0},"xn--rady-ira":{"$":0},"rakkestad":{"$":0},"rana":{"$":0},"ruovat":{"$":0},"randaberg":{"$":0},"rauma":{"$":0},"rendalen":{"$":0},"rennebu":{"$":0},"rennesoy":{"$":0},"xn--rennesy-v1a":{"$":0},"rindal":{"$":0},"ringebu":{"$":0},"ringerike":{"$":0},"ringsaker":{"$":0},"rissa":{"$":0},"risor":{"$":0},"xn--risr-ira":{"$":0},"roan":{"$":0},"rollag":{"$":0},"rygge":{"$":0},"ralingen":{"$":0},"xn--rlingen-mxa":{"$":0},"rodoy":{"$":0},"xn--rdy-0nab":{"$":0},"romskog":{"$":0},"xn--rmskog-bya":{"$":0},"roros":{"$":0},"xn--rros-gra":{"$":0},"rost":{"$":0},"xn--rst-0na":{"$":0},"royken":{"$":0},"xn--ryken-vua":{"$":0},"royrvik":{"$":0},"xn--ryrvik-bya":{"$":0},"rade":{"$":0},"xn--rde-ula":{"$":0},"salangen":{"$":0},"siellak":{"$":0},"saltdal":{"$":0},"salat":{"$":0},"xn--slt-elab":{"$":0},"xn--slat-5na":{"$":0},"samnanger":{"$":0},"vestfold":{"sande":{"$":0}},"sandefjord":{"$":0},"sandnes":{"$":0},"sandoy":{"$":0},"xn--sandy-yua":{"$":0},"sarpsborg":{"$":0},"sauda":{"$":0},"sauherad":{"$":0},"sel":{"$":0},"selbu":{"$":0},"selje":{"$":0},"seljord":{"$":0},"sigdal":{"$":0},"siljan":{"$":0},"sirdal":{"$":0},"skaun":{"$":0},"skedsmo":{"$":0},"ski":{"$":0},"skien":{"$":0},"skiptvet":{"$":0},"skjervoy":{"$":0},"xn--skjervy-v1a":{"$":0},"skierva":{"$":0},"xn--skierv-uta":{"$":0},"skjak":{"$":0},"xn--skjk-soa":{"$":0},"skodje":{"$":0},"skanland":{"$":0},"xn--sknland-fxa":{"$":0},"skanit":{"$":0},"xn--sknit-yqa":{"$":0},"smola":{"$":0},"xn--smla-hra":{"$":0},"snillfjord":{"$":0},"snasa":{"$":0},"xn--snsa-roa":{"$":0},"snoasa":{"$":0},"snaase":{"$":0},"xn--snase-nra":{"$":0},"sogndal":{"$":0},"sokndal":{"$":0},"sola":{"$":0},"solund":{"$":0},"songdalen":{"$":0},"sortland":{"$":0},"spydeberg":{"$":0},"stange":{"$":0},"stavanger":{"$":0},"steigen":{"$":0},"steinkjer":{"$":0},"stjordal":{"$":0},"xn--stjrdal-s1a":{"$":0},"stokke":{"$":0},"stor-elvdal":{"$":0},"stord":{"$":0},"stordal":{"$":0},"storfjord":{"$":0},"omasvuotna":{"$":0},"strand":{"$":0},"stranda":{"$":0},"stryn":{"$":0},"sula":{"$":0},"suldal":{"$":0},"sund":{"$":0},"sunndal":{"$":0},"surnadal":{"$":0},"sveio":{"$":0},"svelvik":{"$":0},"sykkylven":{"$":0},"sogne":{"$":0},"xn--sgne-gra":{"$":0},"somna":{"$":0},"xn--smna-gra":{"$":0},"sondre-land":{"$":0},"xn--sndre-land-0cb":{"$":0},"sor-aurdal":{"$":0},"xn--sr-aurdal-l8a":{"$":0},"sor-fron":{"$":0},"xn--sr-fron-q1a":{"$":0},"sor-odal":{"$":0},"xn--sr-odal-q1a":{"$":0},"sor-varanger":{"$":0},"xn--sr-varanger-ggb":{"$":0},"matta-varjjat":{"$":0},"xn--mtta-vrjjat-k7af":{"$":0},"sorfold":{"$":0},"xn--srfold-bya":{"$":0},"sorreisa":{"$":0},"xn--srreisa-q1a":{"$":0},"sorum":{"$":0},"xn--srum-gra":{"$":0},"tana":{"$":0},"deatnu":{"$":0},"time":{"$":0},"tingvoll":{"$":0},"tinn":{"$":0},"tjeldsund":{"$":0},"dielddanuorri":{"$":0},"tjome":{"$":0},"xn--tjme-hra":{"$":0},"tokke":{"$":0},"tolga":{"$":0},"torsken":{"$":0},"tranoy":{"$":0},"xn--trany-yua":{"$":0},"tromso":{"$":0},"xn--troms-zua":{"$":0},"tromsa":{"$":0},"romsa":{"$":0},"trondheim":{"$":0},"troandin":{"$":0},"trysil":{"$":0},"trana":{"$":0},"xn--trna-woa":{"$":0},"trogstad":{"$":0},"xn--trgstad-r1a":{"$":0},"tvedestrand":{"$":0},"tydal":{"$":0},"tynset":{"$":0},"tysfjord":{"$":0},"divtasvuodna":{"$":0},"divttasvuotna":{"$":0},"tysnes":{"$":0},"tysvar":{"$":0},"xn--tysvr-vra":{"$":0},"tonsberg":{"$":0},"xn--tnsberg-q1a":{"$":0},"ullensaker":{"$":0},"ullensvang":{"$":0},"ulvik":{"$":0},"utsira":{"$":0},"vadso":{"$":0},"xn--vads-jra":{"$":0},"cahcesuolo":{"$":0},"xn--hcesuolo-7ya35b":{"$":0},"vaksdal":{"$":0},"valle":{"$":0},"vang":{"$":0},"vanylven":{"$":0},"vardo":{"$":0},"xn--vard-jra":{"$":0},"varggat":{"$":0},"xn--vrggt-xqad":{"$":0},"vefsn":{"$":0},"vaapste":{"$":0},"vega":{"$":0},"vegarshei":{"$":0},"xn--vegrshei-c0a":{"$":0},"vennesla":{"$":0},"verdal":{"$":0},"verran":{"$":0},"vestby":{"$":0},"vestnes":{"$":0},"vestre-slidre":{"$":0},"vestre-toten":{"$":0},"vestvagoy":{"$":0},"xn--vestvgy-ixa6o":{"$":0},"vevelstad":{"$":0},"vik":{"$":0},"vikna":{"$":0},"vindafjord":{"$":0},"volda":{"$":0},"voss":{"$":0},"varoy":{"$":0},"xn--vry-yla5g":{"$":0},"vagan":{"$":0},"xn--vgan-qoa":{"$":0},"voagat":{"$":0},"vagsoy":{"$":0},"xn--vgsy-qoa0j":{"$":0},"vaga":{"$":0},"xn--vg-yiab":{"$":0},"ostfold":{"valer":{"$":0}},"xn--stfold-9xa":{"xn--vler-qoa":{"$":0}},"co":{"$":0},"blogspot":{"$":0}},"np":{"*":{"$":0}},"nr":{"$":0,"biz":{"$":0},"info":{"$":0},"gov":{"$":0},"edu":{"$":0},"org":{"$":0},"net":{"$":0},"com":{"$":0}},"nu":{"$":0,"merseine":{"$":0},"mine":{"$":0},"shacknet":{"$":0},"nom":{"$":0}},"nz":{"$":0,"ac":{"$":0},"co":{"$":0,"blogspot":{"$":0}},"cri":{"$":0},"geek":{"$":0},"gen":{"$":0},"govt":{"$":0},"health":{"$":0},"iwi":{"$":0},"kiwi":{"$":0},"maori":{"$":0},"mil":{"$":0},"xn--mori-qsa":{"$":0},"net":{"$":0},"org":{"$":0},"parliament":{"$":0},"school":{"$":0},"nym":{"$":0}},"om":{"$":0,"co":{"$":0},"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"med":{"$":0},"museum":{"$":0},"net":{"$":0},"org":{"$":0},"pro":{"$":0}},"onion":{"$":0},"org":{"$":0,"amune":{"tele":{"$":0}},"pimienta":{"$":0},"poivron":{"$":0},"potager":{"$":0},"sweetpepper":{"$":0},"ae":{"$":0},"us":{"$":0},"certmgr":{"$":0},"cdn77":{"c":{"$":0},"rsc":{"$":0}},"cdn77-secure":{"origin":{"ssl":{"$":0}}},"cloudns":{"$":0},"duckdns":{"$":0},"tunk":{"$":0},"dyndns":{"$":0,"go":{"$":0},"home":{"$":0}},"blogdns":{"$":0},"blogsite":{"$":0},"boldlygoingnowhere":{"$":0},"dnsalias":{"$":0},"dnsdojo":{"$":0},"doesntexist":{"$":0},"dontexist":{"$":0},"doomdns":{"$":0},"dvrdns":{"$":0},"dynalias":{"$":0},"endofinternet":{"$":0},"endoftheinternet":{"$":0},"from-me":{"$":0},"game-host":{"$":0},"gotdns":{"$":0},"hobby-site":{"$":0},"homedns":{"$":0},"homeftp":{"$":0},"homelinux":{"$":0},"homeunix":{"$":0},"is-a-bruinsfan":{"$":0},"is-a-candidate":{"$":0},"is-a-celticsfan":{"$":0},"is-a-chef":{"$":0},"is-a-geek":{"$":0},"is-a-knight":{"$":0},"is-a-linux-user":{"$":0},"is-a-patsfan":{"$":0},"is-a-soxfan":{"$":0},"is-found":{"$":0},"is-lost":{"$":0},"is-saved":{"$":0},"is-very-bad":{"$":0},"is-very-evil":{"$":0},"is-very-good":{"$":0},"is-very-nice":{"$":0},"is-very-sweet":{"$":0},"isa-geek":{"$":0},"kicks-ass":{"$":0},"misconfused":{"$":0},"podzone":{"$":0},"readmyblog":{"$":0},"selfip":{"$":0},"sellsyourhome":{"$":0},"servebbs":{"$":0},"serveftp":{"$":0},"servegame":{"$":0},"stuff-4-sale":{"$":0},"webhop":{"$":0},"ddnss":{"$":0},"accesscam":{"$":0},"camdvr":{"$":0},"freeddns":{"$":0},"mywire":{"$":0},"webredirect":{"$":0},"eu":{"$":0,"al":{"$":0},"asso":{"$":0},"at":{"$":0},"au":{"$":0},"be":{"$":0},"bg":{"$":0},"ca":{"$":0},"cd":{"$":0},"ch":{"$":0},"cn":{"$":0},"cy":{"$":0},"cz":{"$":0},"de":{"$":0},"dk":{"$":0},"edu":{"$":0},"ee":{"$":0},"es":{"$":0},"fi":{"$":0},"fr":{"$":0},"gr":{"$":0},"hr":{"$":0},"hu":{"$":0},"ie":{"$":0},"il":{"$":0},"in":{"$":0},"int":{"$":0},"is":{"$":0},"it":{"$":0},"jp":{"$":0},"kr":{"$":0},"lt":{"$":0},"lu":{"$":0},"lv":{"$":0},"mc":{"$":0},"me":{"$":0},"mk":{"$":0},"mt":{"$":0},"my":{"$":0},"net":{"$":0},"ng":{"$":0},"nl":{"$":0},"no":{"$":0},"nz":{"$":0},"paris":{"$":0},"pl":{"$":0},"pt":{"$":0},"q-a":{"$":0},"ro":{"$":0},"ru":{"$":0},"se":{"$":0},"si":{"$":0},"sk":{"$":0},"tr":{"$":0},"uk":{"$":0},"us":{"$":0}},"twmail":{"$":0},"fedorainfracloud":{"$":0},"fedorapeople":{"$":0},"fedoraproject":{"cloud":{"$":0}},"hepforge":{"$":0},"js":{"$":0},"bmoattachments":{"$":0},"cable-modem":{"$":0},"collegefan":{"$":0},"couchpotatofries":{"$":0},"mlbfan":{"$":0},"mysecuritycamera":{"$":0},"nflfan":{"$":0},"read-books":{"$":0},"ufcfan":{"$":0},"hopto":{"$":0},"myftp":{"$":0},"no-ip":{"$":0},"zapto":{"$":0},"my-firewall":{"$":0},"myfirewall":{"$":0},"spdns":{"$":0},"dsmynas":{"$":0},"familyds":{"$":0},"tuxfamily":{"$":0},"diskstation":{"$":0},"hk":{"$":0},"wmflabs":{"$":0},"za":{"$":0}},"pa":{"$":0,"ac":{"$":0},"gob":{"$":0},"com":{"$":0},"org":{"$":0},"sld":{"$":0},"edu":{"$":0},"net":{"$":0},"ing":{"$":0},"abo":{"$":0},"med":{"$":0},"nom":{"$":0}},"pe":{"$":0,"edu":{"$":0},"gob":{"$":0},"nom":{"$":0},"mil":{"$":0},"org":{"$":0},"com":{"$":0},"net":{"$":0},"blogspot":{"$":0},"nym":{"$":0}},"pf":{"$":0,"com":{"$":0},"org":{"$":0},"edu":{"$":0}},"pg":{"*":{"$":0}},"ph":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"gov":{"$":0},"edu":{"$":0},"ngo":{"$":0},"mil":{"$":0},"i":{"$":0}},"pk":{"$":0,"com":{"$":0},"net":{"$":0},"edu":{"$":0},"org":{"$":0},"fam":{"$":0},"biz":{"$":0},"web":{"$":0},"gov":{"$":0},"gob":{"$":0},"gok":{"$":0},"gon":{"$":0},"gop":{"$":0},"gos":{"$":0},"info":{"$":0}},"pl":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"aid":{"$":0},"agro":{"$":0},"atm":{"$":0},"auto":{"$":0},"biz":{"$":0},"edu":{"$":0},"gmina":{"$":0},"gsm":{"$":0},"info":{"$":0},"mail":{"$":0},"miasta":{"$":0},"media":{"$":0},"mil":{"$":0},"nieruchomosci":{"$":0},"nom":{"$":0},"pc":{"$":0},"powiat":{"$":0},"priv":{"$":0},"realestate":{"$":0},"rel":{"$":0},"sex":{"$":0},"shop":{"$":0},"sklep":{"$":0},"sos":{"$":0},"szkola":{"$":0},"targi":{"$":0},"tm":{"$":0},"tourism":{"$":0},"travel":{"$":0},"turystyka":{"$":0},"gov":{"$":0,"ap":{"$":0},"ic":{"$":0},"is":{"$":0},"us":{"$":0},"kmpsp":{"$":0},"kppsp":{"$":0},"kwpsp":{"$":0},"psp":{"$":0},"wskr":{"$":0},"kwp":{"$":0},"mw":{"$":0},"ug":{"$":0},"um":{"$":0},"umig":{"$":0},"ugim":{"$":0},"upow":{"$":0},"uw":{"$":0},"starostwo":{"$":0},"pa":{"$":0},"po":{"$":0},"psse":{"$":0},"pup":{"$":0},"rzgw":{"$":0},"sa":{"$":0},"so":{"$":0},"sr":{"$":0},"wsa":{"$":0},"sko":{"$":0},"uzs":{"$":0},"wiih":{"$":0},"winb":{"$":0},"pinb":{"$":0},"wios":{"$":0},"witd":{"$":0},"wzmiuw":{"$":0},"piw":{"$":0},"wiw":{"$":0},"griw":{"$":0},"wif":{"$":0},"oum":{"$":0},"sdn":{"$":0},"zp":{"$":0},"uppo":{"$":0},"mup":{"$":0},"wuoz":{"$":0},"konsulat":{"$":0},"oirm":{"$":0}},"augustow":{"$":0},"babia-gora":{"$":0},"bedzin":{"$":0},"beskidy":{"$":0},"bialowieza":{"$":0},"bialystok":{"$":0},"bielawa":{"$":0},"bieszczady":{"$":0},"boleslawiec":{"$":0},"bydgoszcz":{"$":0},"bytom":{"$":0},"cieszyn":{"$":0},"czeladz":{"$":0},"czest":{"$":0},"dlugoleka":{"$":0},"elblag":{"$":0},"elk":{"$":0},"glogow":{"$":0},"gniezno":{"$":0},"gorlice":{"$":0},"grajewo":{"$":0},"ilawa":{"$":0},"jaworzno":{"$":0},"jelenia-gora":{"$":0},"jgora":{"$":0},"kalisz":{"$":0},"kazimierz-dolny":{"$":0},"karpacz":{"$":0},"kartuzy":{"$":0},"kaszuby":{"$":0},"katowice":{"$":0},"kepno":{"$":0},"ketrzyn":{"$":0},"klodzko":{"$":0},"kobierzyce":{"$":0},"kolobrzeg":{"$":0},"konin":{"$":0},"konskowola":{"$":0},"kutno":{"$":0},"lapy":{"$":0},"lebork":{"$":0},"legnica":{"$":0},"lezajsk":{"$":0},"limanowa":{"$":0},"lomza":{"$":0},"lowicz":{"$":0},"lubin":{"$":0},"lukow":{"$":0},"malbork":{"$":0},"malopolska":{"$":0},"mazowsze":{"$":0},"mazury":{"$":0},"mielec":{"$":0},"mielno":{"$":0},"mragowo":{"$":0},"naklo":{"$":0},"nowaruda":{"$":0},"nysa":{"$":0},"olawa":{"$":0},"olecko":{"$":0},"olkusz":{"$":0},"olsztyn":{"$":0},"opoczno":{"$":0},"opole":{"$":0},"ostroda":{"$":0},"ostroleka":{"$":0},"ostrowiec":{"$":0},"ostrowwlkp":{"$":0},"pila":{"$":0},"pisz":{"$":0},"podhale":{"$":0},"podlasie":{"$":0},"polkowice":{"$":0},"pomorze":{"$":0},"pomorskie":{"$":0},"prochowice":{"$":0},"pruszkow":{"$":0},"przeworsk":{"$":0},"pulawy":{"$":0},"radom":{"$":0},"rawa-maz":{"$":0},"rybnik":{"$":0},"rzeszow":{"$":0},"sanok":{"$":0},"sejny":{"$":0},"slask":{"$":0},"slupsk":{"$":0},"sosnowiec":{"$":0},"stalowa-wola":{"$":0},"skoczow":{"$":0},"starachowice":{"$":0},"stargard":{"$":0},"suwalki":{"$":0},"swidnica":{"$":0},"swiebodzin":{"$":0},"swinoujscie":{"$":0},"szczecin":{"$":0},"szczytno":{"$":0},"tarnobrzeg":{"$":0},"tgory":{"$":0},"turek":{"$":0},"tychy":{"$":0},"ustka":{"$":0},"walbrzych":{"$":0},"warmia":{"$":0},"warszawa":{"$":0},"waw":{"$":0},"wegrow":{"$":0},"wielun":{"$":0},"wlocl":{"$":0},"wloclawek":{"$":0},"wodzislaw":{"$":0},"wolomin":{"$":0},"wroclaw":{"$":0},"zachpomor":{"$":0},"zagan":{"$":0},"zarow":{"$":0},"zgora":{"$":0},"zgorzelec":{"$":0},"beep":{"$":0},"co":{"$":0},"art":{"$":0},"gliwice":{"$":0},"krakow":{"$":0},"poznan":{"$":0},"wroc":{"$":0},"zakopane":{"$":0},"gda":{"$":0},"gdansk":{"$":0},"gdynia":{"$":0},"med":{"$":0},"sopot":{"$":0}},"pm":{"$":0},"pn":{"$":0,"gov":{"$":0},"co":{"$":0},"org":{"$":0},"edu":{"$":0},"net":{"$":0}},"post":{"$":0},"pr":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"gov":{"$":0},"edu":{"$":0},"isla":{"$":0},"pro":{"$":0},"biz":{"$":0},"info":{"$":0},"name":{"$":0},"est":{"$":0},"prof":{"$":0},"ac":{"$":0}},"pro":{"$":0,"aaa":{"$":0},"aca":{"$":0},"acct":{"$":0},"avocat":{"$":0},"bar":{"$":0},"cpa":{"$":0},"eng":{"$":0},"jur":{"$":0},"law":{"$":0},"med":{"$":0},"recht":{"$":0},"cloudns":{"$":0}},"ps":{"$":0,"edu":{"$":0},"gov":{"$":0},"sec":{"$":0},"plo":{"$":0},"com":{"$":0},"org":{"$":0},"net":{"$":0}},"pt":{"$":0,"net":{"$":0},"gov":{"$":0},"org":{"$":0},"edu":{"$":0},"int":{"$":0},"publ":{"$":0},"com":{"$":0},"nome":{"$":0},"blogspot":{"$":0},"nym":{"$":0}},"pw":{"$":0,"co":{"$":0},"ne":{"$":0},"or":{"$":0},"ed":{"$":0},"go":{"$":0},"belau":{"$":0},"cloudns":{"$":0},"nom":{"$":0}},"py":{"$":0,"com":{"$":0},"coop":{"$":0},"edu":{"$":0},"gov":{"$":0},"mil":{"$":0},"net":{"$":0},"org":{"$":0}},"qa":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"mil":{"$":0},"name":{"$":0},"net":{"$":0},"org":{"$":0},"sch":{"$":0},"blogspot":{"$":0},"nom":{"$":0}},"re":{"$":0,"asso":{"$":0},"com":{"$":0},"nom":{"$":0},"blogspot":{"$":0}},"ro":{"$":0,"arts":{"$":0},"com":{"$":0},"firm":{"$":0},"info":{"$":0},"nom":{"$":0},"nt":{"$":0},"org":{"$":0},"rec":{"$":0},"store":{"$":0},"tm":{"$":0},"www":{"$":0},"shop":{"$":0},"blogspot":{"$":0}},"rs":{"$":0,"ac":{"$":0},"co":{"$":0},"edu":{"$":0},"gov":{"$":0},"in":{"$":0},"org":{"$":0},"blogspot":{"$":0},"nom":{"$":0}},"ru":{"$":0,"ac":{"$":0},"edu":{"$":0},"gov":{"$":0},"int":{"$":0},"mil":{"$":0},"test":{"$":0},"adygeya":{"$":0},"bashkiria":{"$":0},"bir":{"$":0},"cbg":{"$":0},"com":{"$":0},"dagestan":{"$":0},"grozny":{"$":0},"kalmykia":{"$":0},"kustanai":{"$":0},"marine":{"$":0},"mordovia":{"$":0},"msk":{"$":0},"mytis":{"$":0},"nalchik":{"$":0},"nov":{"$":0},"pyatigorsk":{"$":0},"spb":{"$":0},"vladikavkaz":{"$":0},"vladimir":{"$":0},"blogspot":{"$":0},"cldmail":{"hb":{"$":0}},"net":{"$":0},"org":{"$":0},"pp":{"$":0}},"rw":{"$":0,"gov":{"$":0},"net":{"$":0},"edu":{"$":0},"ac":{"$":0},"com":{"$":0},"co":{"$":0},"int":{"$":0},"mil":{"$":0},"gouv":{"$":0}},"sa":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"gov":{"$":0},"med":{"$":0},"pub":{"$":0},"edu":{"$":0},"sch":{"$":0}},"sb":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"net":{"$":0},"org":{"$":0}},"sc":{"$":0,"com":{"$":0},"gov":{"$":0},"net":{"$":0},"org":{"$":0},"edu":{"$":0}},"sd":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"edu":{"$":0},"med":{"$":0},"tv":{"$":0},"gov":{"$":0},"info":{"$":0}},"se":{"$":0,"a":{"$":0},"ac":{"$":0},"b":{"$":0},"bd":{"$":0},"brand":{"$":0},"c":{"$":0},"d":{"$":0},"e":{"$":0},"f":{"$":0},"fh":{"$":0},"fhsk":{"$":0},"fhv":{"$":0},"g":{"$":0},"h":{"$":0},"i":{"$":0},"k":{"$":0},"komforb":{"$":0},"kommunalforbund":{"$":0},"komvux":{"$":0},"l":{"$":0},"lanbib":{"$":0},"m":{"$":0},"n":{"$":0},"naturbruksgymn":{"$":0},"o":{"$":0},"org":{"$":0},"p":{"$":0},"parti":{"$":0},"pp":{"$":0},"press":{"$":0},"r":{"$":0},"s":{"$":0},"t":{"$":0},"tm":{"$":0},"u":{"$":0},"w":{"$":0},"x":{"$":0},"y":{"$":0},"z":{"$":0},"com":{"$":0},"blogspot":{"$":0}},"sg":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"gov":{"$":0},"edu":{"$":0},"per":{"$":0},"blogspot":{"$":0}},"sh":{"$":0,"com":{"$":0},"net":{"$":0},"gov":{"$":0},"org":{"$":0},"mil":{"$":0},"hashbang":{"$":0},"platform":{"*":{"$":0}},"wedeploy":{"$":0},"now":{"$":0}},"si":{"$":0,"blogspot":{"$":0},"nom":{"$":0}},"sj":{"$":0},"sk":{"$":0,"blogspot":{"$":0},"nym":{"$":0}},"sl":{"$":0,"com":{"$":0},"net":{"$":0},"edu":{"$":0},"gov":{"$":0},"org":{"$":0}},"sm":{"$":0},"sn":{"$":0,"art":{"$":0},"com":{"$":0},"edu":{"$":0},"gouv":{"$":0},"org":{"$":0},"perso":{"$":0},"univ":{"$":0},"blogspot":{"$":0}},"so":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0}},"sr":{"$":0},"st":{"$":0,"co":{"$":0},"com":{"$":0},"consulado":{"$":0},"edu":{"$":0},"embaixada":{"$":0},"gov":{"$":0},"mil":{"$":0},"net":{"$":0},"org":{"$":0},"principe":{"$":0},"saotome":{"$":0},"store":{"$":0}},"su":{"$":0,"abkhazia":{"$":0},"adygeya":{"$":0},"aktyubinsk":{"$":0},"arkhangelsk":{"$":0},"armenia":{"$":0},"ashgabad":{"$":0},"azerbaijan":{"$":0},"balashov":{"$":0},"bashkiria":{"$":0},"bryansk":{"$":0},"bukhara":{"$":0},"chimkent":{"$":0},"dagestan":{"$":0},"east-kazakhstan":{"$":0},"exnet":{"$":0},"georgia":{"$":0},"grozny":{"$":0},"ivanovo":{"$":0},"jambyl":{"$":0},"kalmykia":{"$":0},"kaluga":{"$":0},"karacol":{"$":0},"karaganda":{"$":0},"karelia":{"$":0},"khakassia":{"$":0},"krasnodar":{"$":0},"kurgan":{"$":0},"kustanai":{"$":0},"lenug":{"$":0},"mangyshlak":{"$":0},"mordovia":{"$":0},"msk":{"$":0},"murmansk":{"$":0},"nalchik":{"$":0},"navoi":{"$":0},"north-kazakhstan":{"$":0},"nov":{"$":0},"obninsk":{"$":0},"penza":{"$":0},"pokrovsk":{"$":0},"sochi":{"$":0},"spb":{"$":0},"tashkent":{"$":0},"termez":{"$":0},"togliatti":{"$":0},"troitsk":{"$":0},"tselinograd":{"$":0},"tula":{"$":0},"tuva":{"$":0},"vladikavkaz":{"$":0},"vladimir":{"$":0},"vologda":{"$":0},"nym":{"$":0}},"sv":{"$":0,"com":{"$":0},"edu":{"$":0},"gob":{"$":0},"org":{"$":0},"red":{"$":0}},"sx":{"$":0,"gov":{"$":0},"nym":{"$":0}},"sy":{"$":0,"edu":{"$":0},"gov":{"$":0},"net":{"$":0},"mil":{"$":0},"com":{"$":0},"org":{"$":0}},"sz":{"$":0,"co":{"$":0},"ac":{"$":0},"org":{"$":0}},"tc":{"$":0},"td":{"$":0,"blogspot":{"$":0}},"tel":{"$":0},"tf":{"$":0},"tg":{"$":0},"th":{"$":0,"ac":{"$":0},"co":{"$":0},"go":{"$":0},"in":{"$":0},"mi":{"$":0},"net":{"$":0},"or":{"$":0}},"tj":{"$":0,"ac":{"$":0},"biz":{"$":0},"co":{"$":0},"com":{"$":0},"edu":{"$":0},"go":{"$":0},"gov":{"$":0},"int":{"$":0},"mil":{"$":0},"name":{"$":0},"net":{"$":0},"nic":{"$":0},"org":{"$":0},"test":{"$":0},"web":{"$":0}},"tk":{"$":0},"tl":{"$":0,"gov":{"$":0}},"tm":{"$":0,"com":{"$":0},"co":{"$":0},"org":{"$":0},"net":{"$":0},"nom":{"$":0},"gov":{"$":0},"mil":{"$":0},"edu":{"$":0}},"tn":{"$":0,"com":{"$":0},"ens":{"$":0},"fin":{"$":0},"gov":{"$":0},"ind":{"$":0},"intl":{"$":0},"nat":{"$":0},"net":{"$":0},"org":{"$":0},"info":{"$":0},"perso":{"$":0},"tourism":{"$":0},"edunet":{"$":0},"rnrt":{"$":0},"rns":{"$":0},"rnu":{"$":0},"mincom":{"$":0},"agrinet":{"$":0},"defense":{"$":0},"turen":{"$":0}},"to":{"$":0,"com":{"$":0},"gov":{"$":0},"net":{"$":0},"org":{"$":0},"edu":{"$":0},"mil":{"$":0},"vpnplus":{"$":0}},"tr":{"$":0,"com":{"$":0,"blogspot":{"$":0}},"info":{"$":0},"biz":{"$":0},"net":{"$":0},"org":{"$":0},"web":{"$":0},"gen":{"$":0},"tv":{"$":0},"av":{"$":0},"dr":{"$":0},"bbs":{"$":0},"name":{"$":0},"tel":{"$":0},"gov":{"$":0},"bel":{"$":0},"pol":{"$":0},"mil":{"$":0},"k12":{"$":0},"edu":{"$":0},"kep":{"$":0},"nc":{"$":0,"gov":{"$":0}}},"travel":{"$":0},"tt":{"$":0,"co":{"$":0},"com":{"$":0},"org":{"$":0},"net":{"$":0},"biz":{"$":0},"info":{"$":0},"pro":{"$":0},"int":{"$":0},"coop":{"$":0},"jobs":{"$":0},"mobi":{"$":0},"travel":{"$":0},"museum":{"$":0},"aero":{"$":0},"name":{"$":0},"gov":{"$":0},"edu":{"$":0}},"tv":{"$":0,"dyndns":{"$":0},"better-than":{"$":0},"on-the-web":{"$":0},"worse-than":{"$":0}},"tw":{"$":0,"edu":{"$":0},"gov":{"$":0},"mil":{"$":0},"com":{"$":0,"mymailer":{"$":0}},"net":{"$":0},"org":{"$":0},"idv":{"$":0},"game":{"$":0},"ebiz":{"$":0},"club":{"$":0},"xn--zf0ao64a":{"$":0},"xn--uc0atv":{"$":0},"xn--czrw28b":{"$":0},"url":{"$":0},"blogspot":{"$":0},"nym":{"$":0}},"tz":{"$":0,"ac":{"$":0},"co":{"$":0},"go":{"$":0},"hotel":{"$":0},"info":{"$":0},"me":{"$":0},"mil":{"$":0},"mobi":{"$":0},"ne":{"$":0},"or":{"$":0},"sc":{"$":0},"tv":{"$":0}},"ua":{"$":0,"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"in":{"$":0},"net":{"$":0},"org":{"$":0},"cherkassy":{"$":0},"cherkasy":{"$":0},"chernigov":{"$":0},"chernihiv":{"$":0},"chernivtsi":{"$":0},"chernovtsy":{"$":0},"ck":{"$":0},"cn":{"$":0},"cr":{"$":0},"crimea":{"$":0},"cv":{"$":0},"dn":{"$":0},"dnepropetrovsk":{"$":0},"dnipropetrovsk":{"$":0},"dominic":{"$":0},"donetsk":{"$":0},"dp":{"$":0},"if":{"$":0},"ivano-frankivsk":{"$":0},"kh":{"$":0},"kharkiv":{"$":0},"kharkov":{"$":0},"kherson":{"$":0},"khmelnitskiy":{"$":0},"khmelnytskyi":{"$":0},"kiev":{"$":0},"kirovograd":{"$":0},"km":{"$":0},"kr":{"$":0},"krym":{"$":0},"ks":{"$":0},"kv":{"$":0},"kyiv":{"$":0},"lg":{"$":0},"lt":{"$":0},"lugansk":{"$":0},"lutsk":{"$":0},"lv":{"$":0},"lviv":{"$":0},"mk":{"$":0},"mykolaiv":{"$":0},"nikolaev":{"$":0},"od":{"$":0},"odesa":{"$":0},"odessa":{"$":0},"pl":{"$":0},"poltava":{"$":0},"rivne":{"$":0},"rovno":{"$":0},"rv":{"$":0},"sb":{"$":0},"sebastopol":{"$":0},"sevastopol":{"$":0},"sm":{"$":0},"sumy":{"$":0},"te":{"$":0},"ternopil":{"$":0},"uz":{"$":0},"uzhgorod":{"$":0},"vinnica":{"$":0},"vinnytsia":{"$":0},"vn":{"$":0},"volyn":{"$":0},"yalta":{"$":0},"zaporizhzhe":{"$":0},"zaporizhzhia":{"$":0},"zhitomir":{"$":0},"zhytomyr":{"$":0},"zp":{"$":0},"zt":{"$":0},"cc":{"$":0},"inf":{"$":0},"ltd":{"$":0},"biz":{"$":0},"co":{"$":0},"pp":{"$":0}},"ug":{"$":0,"co":{"$":0},"or":{"$":0},"ac":{"$":0},"sc":{"$":0},"go":{"$":0},"ne":{"$":0},"com":{"$":0},"org":{"$":0},"blogspot":{"$":0},"nom":{"$":0}},"uk":{"$":0,"ac":{"$":0},"co":{"$":0,"blogspot":{"$":0},"no-ip":{"$":0},"wellbeingzone":{"$":0}},"gov":{"$":0,"service":{"$":0},"homeoffice":{"$":0}},"ltd":{"$":0},"me":{"$":0},"net":{"$":0},"nhs":{"$":0},"org":{"$":0},"plc":{"$":0},"police":{"$":0},"sch":{"*":{"$":0}}},"us":{"$":0,"dni":{"$":0},"fed":{"$":0},"isa":{"$":0},"kids":{"$":0},"nsn":{"$":0},"ak":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"al":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"ar":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"as":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"az":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"ca":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"co":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"ct":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"dc":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"de":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"fl":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"ga":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"gu":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"hi":{"$":0,"cc":{"$":0},"lib":{"$":0}},"ia":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"id":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"il":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"in":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"ks":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"ky":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"la":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"ma":{"$":0,"k12":{"$":0,"pvt":{"$":0},"chtr":{"$":0},"paroch":{"$":0}},"cc":{"$":0},"lib":{"$":0}},"md":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"me":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"mi":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0},"ann-arbor":{"$":0},"cog":{"$":0},"dst":{"$":0},"eaton":{"$":0},"gen":{"$":0},"mus":{"$":0},"tec":{"$":0},"washtenaw":{"$":0}},"mn":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"mo":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"ms":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"mt":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"nc":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"nd":{"$":0,"cc":{"$":0},"lib":{"$":0}},"ne":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"nh":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"nj":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"nm":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"nv":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"ny":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"oh":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"ok":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"or":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"pa":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"pr":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"ri":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"sc":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"sd":{"$":0,"cc":{"$":0},"lib":{"$":0}},"tn":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"tx":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"ut":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"vi":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"vt":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"va":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"wa":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"wi":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"wv":{"$":0,"cc":{"$":0}},"wy":{"$":0,"k12":{"$":0},"cc":{"$":0},"lib":{"$":0}},"cloudns":{"$":0},"drud":{"$":0},"is-by":{"$":0},"land-4-sale":{"$":0},"stuff-4-sale":{"$":0},"golffan":{"$":0},"noip":{"$":0},"pointto":{"$":0}},"uy":{"$":0,"com":{"$":0,"blogspot":{"$":0}},"edu":{"$":0},"gub":{"$":0},"mil":{"$":0},"net":{"$":0},"org":{"$":0},"nom":{"$":0}},"uz":{"$":0,"co":{"$":0},"com":{"$":0},"net":{"$":0},"org":{"$":0}},"va":{"$":0},"vc":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"gov":{"$":0},"mil":{"$":0},"edu":{"$":0},"nom":{"$":0}},"ve":{"$":0,"arts":{"$":0},"co":{"$":0},"com":{"$":0},"e12":{"$":0},"edu":{"$":0},"firm":{"$":0},"gob":{"$":0},"gov":{"$":0},"info":{"$":0},"int":{"$":0},"mil":{"$":0},"net":{"$":0},"org":{"$":0},"rec":{"$":0},"store":{"$":0},"tec":{"$":0},"web":{"$":0}},"vg":{"$":0,"nom":{"$":0}},"vi":{"$":0,"co":{"$":0},"com":{"$":0},"k12":{"$":0},"net":{"$":0},"org":{"$":0}},"vn":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"edu":{"$":0},"gov":{"$":0},"int":{"$":0},"ac":{"$":0},"biz":{"$":0},"info":{"$":0},"name":{"$":0},"pro":{"$":0},"health":{"$":0},"blogspot":{"$":0}},"vu":{"$":0,"com":{"$":0},"edu":{"$":0},"net":{"$":0},"org":{"$":0}},"wf":{"$":0},"ws":{"$":0,"com":{"$":0},"net":{"$":0},"org":{"$":0},"gov":{"$":0},"edu":{"$":0},"advisor":{"*":{"$":0}},"dyndns":{"$":0},"mypets":{"$":0}},"yt":{"$":0},"xn--mgbaam7a8h":{"$":0},"xn--y9a3aq":{"$":0},"xn--54b7fta0cc":{"$":0},"xn--90ae":{"$":0},"xn--90ais":{"$":0},"xn--fiqs8s":{"$":0},"xn--fiqz9s":{"$":0},"xn--lgbbat1ad8j":{"$":0},"xn--wgbh1c":{"$":0},"xn--e1a4c":{"$":0},"xn--node":{"$":0},"xn--qxam":{"$":0},"xn--j6w193g":{"$":0},"xn--2scrj9c":{"$":0},"xn--3hcrj9c":{"$":0},"xn--45br5cyl":{"$":0},"xn--h2breg3eve":{"$":0},"xn--h2brj9c8c":{"$":0},"xn--mgbgu82a":{"$":0},"xn--rvc1e0am3e":{"$":0},"xn--h2brj9c":{"$":0},"xn--mgbbh1a71e":{"$":0},"xn--fpcrj9c3d":{"$":0},"xn--gecrj9c":{"$":0},"xn--s9brj9c":{"$":0},"xn--45brj9c":{"$":0},"xn--xkc2dl3a5ee0h":{"$":0},"xn--mgba3a4f16a":{"$":0},"xn--mgba3a4fra":{"$":0},"xn--mgbtx2b":{"$":0},"xn--mgbayh7gpa":{"$":0},"xn--3e0b707e":{"$":0},"xn--80ao21a":{"$":0},"xn--fzc2c9e2c":{"$":0},"xn--xkc2al3hye2a":{"$":0},"xn--mgbc0a9azcg":{"$":0},"xn--d1alf":{"$":0},"xn--l1acc":{"$":0},"xn--mix891f":{"$":0},"xn--mix082f":{"$":0},"xn--mgbx4cd0ab":{"$":0},"xn--mgb9awbf":{"$":0},"xn--mgbai9azgqp6j":{"$":0},"xn--mgbai9a5eva00b":{"$":0},"xn--ygbi2ammx":{"$":0},"xn--90a3ac":{"$":0,"xn--o1ac":{"$":0},"xn--c1avg":{"$":0},"xn--90azh":{"$":0},"xn--d1at":{"$":0},"xn--o1ach":{"$":0},"xn--80au":{"$":0}},"xn--p1ai":{"$":0},"xn--wgbl6a":{"$":0},"xn--mgberp4a5d4ar":{"$":0},"xn--mgberp4a5d4a87g":{"$":0},"xn--mgbqly7c0a67fbc":{"$":0},"xn--mgbqly7cvafr":{"$":0},"xn--mgbpl2fh":{"$":0},"xn--yfro4i67o":{"$":0},"xn--clchc0ea0b2g2a9gcd":{"$":0},"xn--ogbpf8fl":{"$":0},"xn--mgbtf8fl":{"$":0},"xn--o3cw4h":{"$":0,"xn--12c1fe0br":{"$":0},"xn--12co0c3b4eva":{"$":0},"xn--h3cuzk1di":{"$":0},"xn--o3cyx2a":{"$":0},"xn--m3ch0j3a":{"$":0},"xn--12cfi8ixb8l":{"$":0}},"xn--pgbs0dh":{"$":0},"xn--kpry57d":{"$":0},"xn--kprw13d":{"$":0},"xn--nnx388a":{"$":0},"xn--j1amh":{"$":0},"xn--mgb2ddes":{"$":0},"xxx":{"$":0},"ye":{"*":{"$":0}},"za":{"ac":{"$":0},"agric":{"$":0},"alt":{"$":0},"co":{"$":0,"blogspot":{"$":0}},"edu":{"$":0},"gov":{"$":0},"grondar":{"$":0},"law":{"$":0},"mil":{"$":0},"net":{"$":0},"ngo":{"$":0},"nis":{"$":0},"nom":{"$":0},"org":{"$":0},"school":{"$":0},"tm":{"$":0},"web":{"$":0}},"zm":{"$":0,"ac":{"$":0},"biz":{"$":0},"co":{"$":0},"com":{"$":0},"edu":{"$":0},"gov":{"$":0},"info":{"$":0},"mil":{"$":0},"net":{"$":0},"org":{"$":0},"sch":{"$":0}},"zw":{"$":0,"ac":{"$":0},"co":{"$":0},"gov":{"$":0},"mil":{"$":0},"org":{"$":0}},"aaa":{"$":0},"aarp":{"$":0},"abarth":{"$":0},"abb":{"$":0},"abbott":{"$":0},"abbvie":{"$":0},"abc":{"$":0},"able":{"$":0},"abogado":{"$":0},"abudhabi":{"$":0},"academy":{"$":0},"accenture":{"$":0},"accountant":{"$":0},"accountants":{"$":0},"aco":{"$":0},"active":{"$":0},"actor":{"$":0},"adac":{"$":0},"ads":{"$":0},"adult":{"$":0},"aeg":{"$":0},"aetna":{"$":0},"afamilycompany":{"$":0},"afl":{"$":0},"africa":{"$":0},"agakhan":{"$":0},"agency":{"$":0},"aig":{"$":0},"aigo":{"$":0},"airbus":{"$":0},"airforce":{"$":0},"airtel":{"$":0},"akdn":{"$":0},"alfaromeo":{"$":0},"alibaba":{"$":0},"alipay":{"$":0},"allfinanz":{"$":0},"allstate":{"$":0},"ally":{"$":0},"alsace":{"$":0},"alstom":{"$":0},"americanexpress":{"$":0},"americanfamily":{"$":0},"amex":{"$":0},"amfam":{"$":0},"amica":{"$":0},"amsterdam":{"$":0},"analytics":{"$":0},"android":{"$":0},"anquan":{"$":0},"anz":{"$":0},"aol":{"$":0},"apartments":{"$":0},"app":{"$":0},"apple":{"$":0},"aquarelle":{"$":0},"arab":{"$":0},"aramco":{"$":0},"archi":{"$":0},"army":{"$":0},"art":{"$":0},"arte":{"$":0},"asda":{"$":0},"associates":{"$":0},"athleta":{"$":0},"attorney":{"$":0},"auction":{"$":0},"audi":{"$":0},"audible":{"$":0},"audio":{"$":0},"auspost":{"$":0},"author":{"$":0},"auto":{"$":0},"autos":{"$":0},"avianca":{"$":0},"aws":{"$":0},"axa":{"$":0},"azure":{"$":0},"baby":{"$":0},"baidu":{"$":0},"banamex":{"$":0},"bananarepublic":{"$":0},"band":{"$":0},"bank":{"$":0},"bar":{"$":0},"barcelona":{"$":0},"barclaycard":{"$":0},"barclays":{"$":0},"barefoot":{"$":0},"bargains":{"$":0},"baseball":{"$":0},"basketball":{"$":0},"bauhaus":{"$":0},"bayern":{"$":0},"bbc":{"$":0},"bbt":{"$":0},"bbva":{"$":0},"bcg":{"$":0},"bcn":{"$":0},"beats":{"$":0},"beauty":{"$":0},"beer":{"$":0},"bentley":{"$":0},"berlin":{"$":0},"best":{"$":0},"bestbuy":{"$":0},"bet":{"$":0},"bharti":{"$":0},"bible":{"$":0},"bid":{"$":0},"bike":{"$":0},"bing":{"$":0},"bingo":{"$":0},"bio":{"$":0},"black":{"$":0},"blackfriday":{"$":0},"blanco":{"$":0},"blockbuster":{"$":0},"blog":{"$":0},"bloomberg":{"$":0},"blue":{"$":0},"bms":{"$":0},"bmw":{"$":0},"bnl":{"$":0},"bnpparibas":{"$":0},"boats":{"$":0},"boehringer":{"$":0},"bofa":{"$":0},"bom":{"$":0},"bond":{"$":0},"boo":{"$":0},"book":{"$":0},"booking":{"$":0},"boots":{"$":0},"bosch":{"$":0},"bostik":{"$":0},"boston":{"$":0},"bot":{"$":0},"boutique":{"$":0},"box":{"$":0},"bradesco":{"$":0},"bridgestone":{"$":0},"broadway":{"$":0},"broker":{"$":0},"brother":{"$":0},"brussels":{"$":0},"budapest":{"$":0},"bugatti":{"$":0},"build":{"$":0},"builders":{"$":0},"business":{"$":0},"buy":{"$":0},"buzz":{"$":0},"bzh":{"$":0},"cab":{"$":0},"cafe":{"$":0},"cal":{"$":0},"call":{"$":0},"calvinklein":{"$":0},"cam":{"$":0},"camera":{"$":0},"camp":{"$":0},"cancerresearch":{"$":0},"canon":{"$":0},"capetown":{"$":0},"capital":{"$":0},"capitalone":{"$":0},"car":{"$":0},"caravan":{"$":0},"cards":{"$":0},"care":{"$":0},"career":{"$":0},"careers":{"$":0},"cars":{"$":0},"cartier":{"$":0},"casa":{"$":0},"case":{"$":0},"caseih":{"$":0},"cash":{"$":0},"casino":{"$":0},"catering":{"$":0},"catholic":{"$":0},"cba":{"$":0},"cbn":{"$":0},"cbre":{"$":0},"cbs":{"$":0},"ceb":{"$":0},"center":{"$":0},"ceo":{"$":0},"cern":{"$":0},"cfa":{"$":0},"cfd":{"$":0},"chanel":{"$":0},"channel":{"$":0},"chase":{"$":0},"chat":{"$":0},"cheap":{"$":0},"chintai":{"$":0},"chloe":{"$":0},"christmas":{"$":0},"chrome":{"$":0},"chrysler":{"$":0},"church":{"$":0},"cipriani":{"$":0},"circle":{"$":0},"cisco":{"$":0},"citadel":{"$":0},"citi":{"$":0},"citic":{"$":0},"city":{"$":0},"cityeats":{"$":0},"claims":{"$":0},"cleaning":{"$":0},"click":{"$":0},"clinic":{"$":0},"clinique":{"$":0},"clothing":{"$":0},"cloud":{"$":0,"myfusion":{"$":0},"statics":{"*":{"$":0}},"magentosite":{"*":{"$":0}},"vapor":{"$":0},"sensiosite":{"*":{"$":0}},"trafficplex":{"$":0}},"club":{"$":0,"cloudns":{"$":0}},"clubmed":{"$":0},"coach":{"$":0},"codes":{"$":0},"coffee":{"$":0},"college":{"$":0},"cologne":{"$":0},"comcast":{"$":0},"commbank":{"$":0},"community":{"$":0},"company":{"$":0},"compare":{"$":0},"computer":{"$":0},"comsec":{"$":0},"condos":{"$":0},"construction":{"$":0},"consulting":{"$":0},"contact":{"$":0},"contractors":{"$":0},"cooking":{"$":0},"cookingchannel":{"$":0},"cool":{"$":0,"de":{"$":0}},"corsica":{"$":0},"country":{"$":0},"coupon":{"$":0},"coupons":{"$":0},"courses":{"$":0},"credit":{"$":0},"creditcard":{"$":0},"creditunion":{"$":0},"cricket":{"$":0},"crown":{"$":0},"crs":{"$":0},"cruise":{"$":0},"cruises":{"$":0},"csc":{"$":0},"cuisinella":{"$":0},"cymru":{"$":0},"cyou":{"$":0},"dabur":{"$":0},"dad":{"$":0},"dance":{"$":0},"data":{"$":0},"date":{"$":0},"dating":{"$":0},"datsun":{"$":0},"day":{"$":0},"dclk":{"$":0},"dds":{"$":0},"deal":{"$":0},"dealer":{"$":0},"deals":{"$":0},"degree":{"$":0},"delivery":{"$":0},"dell":{"$":0},"deloitte":{"$":0},"delta":{"$":0},"democrat":{"$":0},"dental":{"$":0},"dentist":{"$":0},"desi":{"$":0},"design":{"$":0},"dev":{"$":0},"dhl":{"$":0},"diamonds":{"$":0},"diet":{"$":0},"digital":{"$":0},"direct":{"$":0},"directory":{"$":0},"discount":{"$":0},"discover":{"$":0},"dish":{"$":0},"diy":{"$":0},"dnp":{"$":0},"docs":{"$":0},"doctor":{"$":0},"dodge":{"$":0},"dog":{"$":0},"doha":{"$":0},"domains":{"$":0},"dot":{"$":0},"download":{"$":0},"drive":{"$":0},"dtv":{"$":0},"dubai":{"$":0},"duck":{"$":0},"dunlop":{"$":0},"duns":{"$":0},"dupont":{"$":0},"durban":{"$":0},"dvag":{"$":0},"dvr":{"$":0},"earth":{"$":0},"eat":{"$":0},"eco":{"$":0},"edeka":{"$":0},"education":{"$":0},"email":{"$":0},"emerck":{"$":0},"energy":{"$":0},"engineer":{"$":0},"engineering":{"$":0},"enterprises":{"$":0},"epost":{"$":0},"epson":{"$":0},"equipment":{"$":0},"ericsson":{"$":0},"erni":{"$":0},"esq":{"$":0},"estate":{"$":0,"compute":{"*":{"$":0}}},"esurance":{"$":0},"etisalat":{"$":0},"eurovision":{"$":0},"eus":{"$":0,"party":{"user":{"$":0}}},"events":{"$":0},"everbank":{"$":0},"exchange":{"$":0},"expert":{"$":0},"exposed":{"$":0},"express":{"$":0},"extraspace":{"$":0},"fage":{"$":0},"fail":{"$":0},"fairwinds":{"$":0},"faith":{"$":0,"ybo":{"$":0}},"family":{"$":0},"fan":{"$":0},"fans":{"$":0},"farm":{"$":0,"storj":{"$":0}},"farmers":{"$":0},"fashion":{"$":0},"fast":{"$":0},"fedex":{"$":0},"feedback":{"$":0},"ferrari":{"$":0},"ferrero":{"$":0},"fiat":{"$":0},"fidelity":{"$":0},"fido":{"$":0},"film":{"$":0},"final":{"$":0},"finance":{"$":0},"financial":{"$":0},"fire":{"$":0},"firestone":{"$":0},"firmdale":{"$":0},"fish":{"$":0},"fishing":{"$":0},"fit":{"$":0,"ptplus":{"$":0}},"fitness":{"$":0},"flickr":{"$":0},"flights":{"$":0},"flir":{"$":0},"florist":{"$":0},"flowers":{"$":0},"fly":{"$":0},"foo":{"$":0},"food":{"$":0},"foodnetwork":{"$":0},"football":{"$":0},"ford":{"$":0},"forex":{"$":0},"forsale":{"$":0},"forum":{"$":0},"foundation":{"$":0},"fox":{"$":0},"free":{"$":0},"fresenius":{"$":0},"frl":{"$":0},"frogans":{"$":0},"frontdoor":{"$":0},"frontier":{"$":0},"ftr":{"$":0},"fujitsu":{"$":0},"fujixerox":{"$":0},"fun":{"$":0},"fund":{"$":0},"furniture":{"$":0},"futbol":{"$":0},"fyi":{"$":0},"gal":{"$":0},"gallery":{"$":0},"gallo":{"$":0},"gallup":{"$":0},"game":{"$":0},"games":{"$":0},"gap":{"$":0},"garden":{"$":0},"gbiz":{"$":0},"gdn":{"$":0},"gea":{"$":0},"gent":{"$":0},"genting":{"$":0},"george":{"$":0},"ggee":{"$":0},"gift":{"$":0},"gifts":{"$":0},"gives":{"$":0},"giving":{"$":0},"glade":{"$":0},"glass":{"$":0},"gle":{"$":0},"global":{"$":0},"globo":{"$":0},"gmail":{"$":0},"gmbh":{"$":0},"gmo":{"$":0},"gmx":{"$":0},"godaddy":{"$":0},"gold":{"$":0},"goldpoint":{"$":0},"golf":{"$":0},"goo":{"$":0},"goodhands":{"$":0},"goodyear":{"$":0},"goog":{"$":0,"cloud":{"$":0}},"google":{"$":0},"gop":{"$":0},"got":{"$":0},"grainger":{"$":0},"graphics":{"$":0},"gratis":{"$":0},"green":{"$":0},"gripe":{"$":0},"grocery":{"$":0},"group":{"$":0},"guardian":{"$":0},"gucci":{"$":0},"guge":{"$":0},"guide":{"$":0},"guitars":{"$":0},"guru":{"$":0},"hair":{"$":0},"hamburg":{"$":0},"hangout":{"$":0},"haus":{"$":0},"hbo":{"$":0},"hdfc":{"$":0},"hdfcbank":{"$":0},"health":{"$":0},"healthcare":{"$":0},"help":{"$":0},"helsinki":{"$":0},"here":{"$":0},"hermes":{"$":0},"hgtv":{"$":0},"hiphop":{"$":0},"hisamitsu":{"$":0},"hitachi":{"$":0},"hiv":{"$":0},"hkt":{"$":0},"hockey":{"$":0},"holdings":{"$":0},"holiday":{"$":0},"homedepot":{"$":0},"homegoods":{"$":0},"homes":{"$":0},"homesense":{"$":0},"honda":{"$":0},"honeywell":{"$":0},"horse":{"$":0},"hospital":{"$":0},"host":{"$":0,"cloudaccess":{"$":0},"freesite":{"$":0}},"hosting":{"$":0,"opencraft":{"$":0}},"hot":{"$":0},"hoteles":{"$":0},"hotels":{"$":0},"hotmail":{"$":0},"house":{"$":0},"how":{"$":0},"hsbc":{"$":0},"htc":{"$":0},"hughes":{"$":0},"hyatt":{"$":0},"hyundai":{"$":0},"ibm":{"$":0},"icbc":{"$":0},"ice":{"$":0},"icu":{"$":0},"ieee":{"$":0},"ifm":{"$":0},"ikano":{"$":0},"imamat":{"$":0},"imdb":{"$":0},"immo":{"$":0},"immobilien":{"$":0},"industries":{"$":0},"infiniti":{"$":0},"ing":{"$":0},"ink":{"$":0},"institute":{"$":0},"insurance":{"$":0},"insure":{"$":0},"intel":{"$":0},"international":{"$":0},"intuit":{"$":0},"investments":{"$":0},"ipiranga":{"$":0},"irish":{"$":0},"iselect":{"$":0},"ismaili":{"$":0},"ist":{"$":0},"istanbul":{"$":0},"itau":{"$":0},"itv":{"$":0},"iveco":{"$":0},"iwc":{"$":0},"jaguar":{"$":0},"java":{"$":0},"jcb":{"$":0},"jcp":{"$":0},"jeep":{"$":0},"jetzt":{"$":0},"jewelry":{"$":0},"jio":{"$":0},"jlc":{"$":0},"jll":{"$":0},"jmp":{"$":0},"jnj":{"$":0},"joburg":{"$":0},"jot":{"$":0},"joy":{"$":0},"jpmorgan":{"$":0},"jprs":{"$":0},"juegos":{"$":0},"juniper":{"$":0},"kaufen":{"$":0},"kddi":{"$":0},"kerryhotels":{"$":0},"kerrylogistics":{"$":0},"kerryproperties":{"$":0},"kfh":{"$":0},"kia":{"$":0},"kim":{"$":0},"kinder":{"$":0},"kindle":{"$":0},"kitchen":{"$":0},"kiwi":{"$":0},"koeln":{"$":0},"komatsu":{"$":0},"kosher":{"$":0},"kpmg":{"$":0},"kpn":{"$":0},"krd":{"$":0,"co":{"$":0},"edu":{"$":0}},"kred":{"$":0},"kuokgroup":{"$":0},"kyoto":{"$":0},"lacaixa":{"$":0},"ladbrokes":{"$":0},"lamborghini":{"$":0},"lamer":{"$":0},"lancaster":{"$":0},"lancia":{"$":0},"lancome":{"$":0},"land":{"$":0,"static":{"$":0,"dev":{"$":0},"sites":{"$":0}}},"landrover":{"$":0},"lanxess":{"$":0},"lasalle":{"$":0},"lat":{"$":0},"latino":{"$":0},"latrobe":{"$":0},"law":{"$":0},"lawyer":{"$":0},"lds":{"$":0},"lease":{"$":0},"leclerc":{"$":0},"lefrak":{"$":0},"legal":{"$":0},"lego":{"$":0},"lexus":{"$":0},"lgbt":{"$":0},"liaison":{"$":0},"lidl":{"$":0},"life":{"$":0},"lifeinsurance":{"$":0},"lifestyle":{"$":0},"lighting":{"$":0},"like":{"$":0},"lilly":{"$":0},"limited":{"$":0},"limo":{"$":0},"lincoln":{"$":0},"linde":{"$":0},"link":{"$":0,"cyon":{"$":0},"mypep":{"$":0}},"lipsy":{"$":0},"live":{"$":0},"living":{"$":0},"lixil":{"$":0},"loan":{"$":0},"loans":{"$":0},"locker":{"$":0},"locus":{"$":0},"loft":{"$":0},"lol":{"$":0},"london":{"$":0},"lotte":{"$":0},"lotto":{"$":0},"love":{"$":0},"lpl":{"$":0},"lplfinancial":{"$":0},"ltd":{"$":0},"ltda":{"$":0},"lundbeck":{"$":0},"lupin":{"$":0},"luxe":{"$":0},"luxury":{"$":0},"macys":{"$":0},"madrid":{"$":0},"maif":{"$":0},"maison":{"$":0},"makeup":{"$":0},"man":{"$":0},"management":{"$":0,"router":{"$":0}},"mango":{"$":0},"map":{"$":0},"market":{"$":0},"marketing":{"$":0},"markets":{"$":0},"marriott":{"$":0},"marshalls":{"$":0},"maserati":{"$":0},"mattel":{"$":0},"mba":{"$":0},"mcd":{"$":0},"mcdonalds":{"$":0},"mckinsey":{"$":0},"med":{"$":0},"media":{"$":0},"meet":{"$":0},"melbourne":{"$":0},"meme":{"$":0},"memorial":{"$":0},"men":{"$":0},"menu":{"$":0},"meo":{"$":0},"merckmsd":{"$":0},"metlife":{"$":0},"miami":{"$":0},"microsoft":{"$":0},"mini":{"$":0},"mint":{"$":0},"mit":{"$":0},"mitsubishi":{"$":0},"mlb":{"$":0},"mls":{"$":0},"mma":{"$":0},"mobile":{"$":0},"mobily":{"$":0},"moda":{"$":0},"moe":{"$":0},"moi":{"$":0},"mom":{"$":0},"monash":{"$":0},"money":{"$":0},"monster":{"$":0},"montblanc":{"$":0},"mopar":{"$":0},"mormon":{"$":0},"mortgage":{"$":0},"moscow":{"$":0},"moto":{"$":0},"motorcycles":{"$":0},"mov":{"$":0},"movie":{"$":0},"movistar":{"$":0},"msd":{"$":0},"mtn":{"$":0},"mtpc":{"$":0},"mtr":{"$":0},"mutual":{"$":0},"nab":{"$":0},"nadex":{"$":0},"nagoya":{"$":0},"nationwide":{"$":0},"natura":{"$":0},"navy":{"$":0},"nba":{"$":0},"nec":{"$":0},"netbank":{"$":0},"netflix":{"$":0},"network":{"$":0,"alces":{"*":{"$":0}}},"neustar":{"$":0},"new":{"$":0},"newholland":{"$":0},"news":{"$":0},"next":{"$":0},"nextdirect":{"$":0},"nexus":{"$":0},"nfl":{"$":0},"ngo":{"$":0},"nhk":{"$":0},"nico":{"$":0},"nike":{"$":0},"nikon":{"$":0},"ninja":{"$":0},"nissan":{"$":0},"nissay":{"$":0},"nokia":{"$":0},"northwesternmutual":{"$":0},"norton":{"$":0},"now":{"$":0},"nowruz":{"$":0},"nowtv":{"$":0},"nra":{"$":0},"nrw":{"$":0},"ntt":{"$":0},"nyc":{"$":0},"obi":{"$":0},"observer":{"$":0},"off":{"$":0},"office":{"$":0},"okinawa":{"$":0},"olayan":{"$":0},"olayangroup":{"$":0},"oldnavy":{"$":0},"ollo":{"$":0},"omega":{"$":0},"one":{"$":0,"homelink":{"$":0}},"ong":{"$":0},"onl":{"$":0},"online":{"$":0,"barsy":{"$":0}},"onyourside":{"$":0},"ooo":{"$":0},"open":{"$":0},"oracle":{"$":0},"orange":{"$":0},"organic":{"$":0},"origins":{"$":0},"osaka":{"$":0},"otsuka":{"$":0},"ott":{"$":0},"ovh":{"$":0,"nerdpol":{"$":0}},"page":{"$":0},"pamperedchef":{"$":0},"panasonic":{"$":0},"panerai":{"$":0},"paris":{"$":0},"pars":{"$":0},"partners":{"$":0},"parts":{"$":0},"party":{"$":0,"ybo":{"$":0}},"passagens":{"$":0},"pay":{"$":0},"pccw":{"$":0},"pet":{"$":0},"pfizer":{"$":0},"pharmacy":{"$":0},"phd":{"$":0},"philips":{"$":0},"phone":{"$":0},"photo":{"$":0},"photography":{"$":0},"photos":{"$":0},"physio":{"$":0},"piaget":{"$":0},"pics":{"$":0},"pictet":{"$":0},"pictures":{"1337":{"$":0},"$":0},"pid":{"$":0},"pin":{"$":0},"ping":{"$":0},"pink":{"$":0},"pioneer":{"$":0},"pizza":{"$":0},"place":{"$":0},"play":{"$":0},"playstation":{"$":0},"plumbing":{"$":0},"plus":{"$":0},"pnc":{"$":0},"pohl":{"$":0},"poker":{"$":0},"politie":{"$":0},"porn":{"$":0},"pramerica":{"$":0},"praxi":{"$":0},"press":{"$":0},"prime":{"$":0},"prod":{"$":0},"productions":{"$":0},"prof":{"$":0},"progressive":{"$":0},"promo":{"$":0},"properties":{"$":0},"property":{"$":0},"protection":{"$":0},"pru":{"$":0},"prudential":{"$":0},"pub":{"$":0},"pwc":{"$":0},"qpon":{"$":0},"quebec":{"$":0},"quest":{"$":0},"qvc":{"$":0},"racing":{"$":0},"radio":{"$":0},"raid":{"$":0},"read":{"$":0},"realestate":{"$":0},"realtor":{"$":0},"realty":{"$":0},"recipes":{"$":0},"red":{"$":0},"redstone":{"$":0},"redumbrella":{"$":0},"rehab":{"$":0},"reise":{"$":0},"reisen":{"$":0},"reit":{"$":0},"reliance":{"$":0},"ren":{"$":0},"rent":{"$":0},"rentals":{"$":0},"repair":{"$":0},"report":{"$":0},"republican":{"$":0},"rest":{"$":0},"restaurant":{"$":0},"review":{"$":0,"ybo":{"$":0}},"reviews":{"$":0},"rexroth":{"$":0},"rich":{"$":0},"richardli":{"$":0},"ricoh":{"$":0},"rightathome":{"$":0},"ril":{"$":0},"rio":{"$":0},"rip":{"$":0,"clan":{"$":0}},"rmit":{"$":0},"rocher":{"$":0},"rocks":{"$":0,"myddns":{"$":0},"lima-city":{"$":0},"webspace":{"$":0}},"rodeo":{"$":0},"rogers":{"$":0},"room":{"$":0},"rsvp":{"$":0},"rugby":{"$":0},"ruhr":{"$":0},"run":{"$":0},"rwe":{"$":0},"ryukyu":{"$":0},"saarland":{"$":0},"safe":{"$":0},"safety":{"$":0},"sakura":{"$":0},"sale":{"$":0},"salon":{"$":0},"samsclub":{"$":0},"samsung":{"$":0},"sandvik":{"$":0},"sandvikcoromant":{"$":0},"sanofi":{"$":0},"sap":{"$":0},"sapo":{"$":0},"sarl":{"$":0},"sas":{"$":0},"save":{"$":0},"saxo":{"$":0},"sbi":{"$":0},"sbs":{"$":0},"sca":{"$":0},"scb":{"$":0},"schaeffler":{"$":0},"schmidt":{"$":0},"scholarships":{"$":0},"school":{"$":0},"schule":{"$":0},"schwarz":{"$":0},"science":{"$":0,"ybo":{"$":0}},"scjohnson":{"$":0},"scor":{"$":0},"scot":{"$":0},"search":{"$":0},"seat":{"$":0},"secure":{"$":0},"security":{"$":0},"seek":{"$":0},"select":{"$":0},"sener":{"$":0},"services":{"$":0},"ses":{"$":0},"seven":{"$":0},"sew":{"$":0},"sex":{"$":0},"sexy":{"$":0},"sfr":{"$":0},"shangrila":{"$":0},"sharp":{"$":0},"shaw":{"$":0},"shell":{"$":0},"shia":{"$":0},"shiksha":{"$":0},"shoes":{"$":0},"shop":{"$":0},"shopping":{"$":0},"shouji":{"$":0},"show":{"$":0},"showtime":{"$":0},"shriram":{"$":0},"silk":{"$":0},"sina":{"$":0},"singles":{"$":0},"site":{"$":0,"cyon":{"$":0},"platformsh":{"*":{"$":0}},"byen":{"$":0}},"ski":{"$":0},"skin":{"$":0},"sky":{"$":0},"skype":{"$":0},"sling":{"$":0},"smart":{"$":0},"smile":{"$":0},"sncf":{"$":0},"soccer":{"$":0},"social":{"$":0},"softbank":{"$":0},"software":{"$":0},"sohu":{"$":0},"solar":{"$":0},"solutions":{"$":0},"song":{"$":0},"sony":{"$":0},"soy":{"$":0},"space":{"$":0,"stackspace":{"$":0},"uber":{"$":0},"xs4all":{"$":0}},"spiegel":{"$":0},"spot":{"$":0},"spreadbetting":{"$":0},"srl":{"$":0},"srt":{"$":0},"stada":{"$":0},"staples":{"$":0},"star":{"$":0},"starhub":{"$":0},"statebank":{"$":0},"statefarm":{"$":0},"statoil":{"$":0},"stc":{"$":0},"stcgroup":{"$":0},"stockholm":{"$":0},"storage":{"$":0},"store":{"$":0},"stream":{"$":0},"studio":{"$":0},"study":{"$":0},"style":{"$":0},"sucks":{"$":0},"supplies":{"$":0},"supply":{"$":0},"support":{"$":0,"barsy":{"$":0}},"surf":{"$":0},"surgery":{"$":0},"suzuki":{"$":0},"swatch":{"$":0},"swiftcover":{"$":0},"swiss":{"$":0},"sydney":{"$":0},"symantec":{"$":0},"systems":{"$":0,"knightpoint":{"$":0}},"tab":{"$":0},"taipei":{"$":0},"talk":{"$":0},"taobao":{"$":0},"target":{"$":0},"tatamotors":{"$":0},"tatar":{"$":0},"tattoo":{"$":0},"tax":{"$":0},"taxi":{"$":0},"tci":{"$":0},"tdk":{"$":0},"team":{"$":0},"tech":{"$":0},"technology":{"$":0},"telecity":{"$":0},"telefonica":{"$":0},"temasek":{"$":0},"tennis":{"$":0},"teva":{"$":0},"thd":{"$":0},"theater":{"$":0},"theatre":{"$":0},"tiaa":{"$":0},"tickets":{"$":0},"tienda":{"$":0},"tiffany":{"$":0},"tips":{"$":0},"tires":{"$":0},"tirol":{"$":0},"tjmaxx":{"$":0},"tjx":{"$":0},"tkmaxx":{"$":0},"tmall":{"$":0},"today":{"$":0},"tokyo":{"$":0},"tools":{"$":0},"top":{"$":0},"toray":{"$":0},"toshiba":{"$":0},"total":{"$":0},"tours":{"$":0},"town":{"$":0},"toyota":{"$":0},"toys":{"$":0},"trade":{"$":0,"ybo":{"$":0}},"trading":{"$":0},"training":{"$":0},"travelchannel":{"$":0},"travelers":{"$":0},"travelersinsurance":{"$":0},"trust":{"$":0},"trv":{"$":0},"tube":{"$":0},"tui":{"$":0},"tunes":{"$":0},"tushu":{"$":0},"tvs":{"$":0},"ubank":{"$":0},"ubs":{"$":0},"uconnect":{"$":0},"unicom":{"$":0},"university":{"$":0},"uno":{"$":0},"uol":{"$":0},"ups":{"$":0},"vacations":{"$":0},"vana":{"$":0},"vanguard":{"$":0},"vegas":{"$":0},"ventures":{"$":0},"verisign":{"$":0},"versicherung":{"$":0},"vet":{"$":0},"viajes":{"$":0},"video":{"$":0},"vig":{"$":0},"viking":{"$":0},"villas":{"$":0},"vin":{"$":0},"vip":{"$":0},"virgin":{"$":0},"visa":{"$":0},"vision":{"$":0},"vista":{"$":0},"vistaprint":{"$":0},"viva":{"$":0},"vivo":{"$":0},"vlaanderen":{"$":0},"vodka":{"$":0},"volkswagen":{"$":0},"volvo":{"$":0},"vote":{"$":0},"voting":{"$":0},"voto":{"$":0},"voyage":{"$":0},"vuelos":{"$":0},"wales":{"$":0},"walmart":{"$":0},"walter":{"$":0},"wang":{"$":0},"wanggou":{"$":0},"warman":{"$":0},"watch":{"$":0},"watches":{"$":0},"weather":{"$":0},"weatherchannel":{"$":0},"webcam":{"$":0},"weber":{"$":0},"website":{"$":0},"wed":{"$":0},"wedding":{"$":0},"weibo":{"$":0},"weir":{"$":0},"whoswho":{"$":0},"wien":{"$":0},"wiki":{"$":0},"williamhill":{"$":0},"win":{"$":0},"windows":{"$":0},"wine":{"$":0},"winners":{"$":0},"wme":{"$":0},"wolterskluwer":{"$":0},"woodside":{"$":0},"work":{"$":0},"works":{"$":0},"world":{"$":0},"wow":{"$":0},"wtc":{"$":0},"wtf":{"$":0},"xbox":{"$":0},"xerox":{"$":0},"xfinity":{"$":0},"xihuan":{"$":0},"xin":{"$":0},"xn--11b4c3d":{"$":0},"xn--1ck2e1b":{"$":0},"xn--1qqw23a":{"$":0},"xn--30rr7y":{"$":0},"xn--3bst00m":{"$":0},"xn--3ds443g":{"$":0},"xn--3oq18vl8pn36a":{"$":0},"xn--3pxu8k":{"$":0},"xn--42c2d9a":{"$":0},"xn--45q11c":{"$":0},"xn--4gbrim":{"$":0},"xn--55qw42g":{"$":0},"xn--55qx5d":{"$":0},"xn--5su34j936bgsg":{"$":0},"xn--5tzm5g":{"$":0},"xn--6frz82g":{"$":0},"xn--6qq986b3xl":{"$":0},"xn--80adxhks":{"$":0},"xn--80aqecdr1a":{"$":0},"xn--80asehdb":{"$":0},"xn--80aswg":{"$":0},"xn--8y0a063a":{"$":0},"xn--9dbq2a":{"$":0},"xn--9et52u":{"$":0},"xn--9krt00a":{"$":0},"xn--b4w605ferd":{"$":0},"xn--bck1b9a5dre4c":{"$":0},"xn--c1avg":{"$":0},"xn--c2br7g":{"$":0},"xn--cck2b3b":{"$":0},"xn--cg4bki":{"$":0},"xn--czr694b":{"$":0},"xn--czrs0t":{"$":0},"xn--czru2d":{"$":0},"xn--d1acj3b":{"$":0},"xn--eckvdtc9d":{"$":0},"xn--efvy88h":{"$":0},"xn--estv75g":{"$":0},"xn--fct429k":{"$":0},"xn--fhbei":{"$":0},"xn--fiq228c5hs":{"$":0},"xn--fiq64b":{"$":0},"xn--fjq720a":{"$":0},"xn--flw351e":{"$":0},"xn--fzys8d69uvgm":{"$":0},"xn--g2xx48c":{"$":0},"xn--gckr3f0f":{"$":0},"xn--gk3at1e":{"$":0},"xn--hxt814e":{"$":0},"xn--i1b6b1a6a2e":{"$":0},"xn--imr513n":{"$":0},"xn--io0a7i":{"$":0},"xn--j1aef":{"$":0},"xn--jlq61u9w7b":{"$":0},"xn--jvr189m":{"$":0},"xn--kcrx77d1x4a":{"$":0},"xn--kpu716f":{"$":0},"xn--kput3i":{"$":0},"xn--mgba3a3ejt":{"$":0},"xn--mgba7c0bbn0a":{"$":0},"xn--mgbaakc7dvf":{"$":0},"xn--mgbab2bd":{"$":0},"xn--mgbb9fbpob":{"$":0},"xn--mgbca7dzdo":{"$":0},"xn--mgbi4ecexp":{"$":0},"xn--mgbt3dhd":{"$":0},"xn--mk1bu44c":{"$":0},"xn--mxtq1m":{"$":0},"xn--ngbc5azd":{"$":0},"xn--ngbe9e0a":{"$":0},"xn--ngbrx":{"$":0},"xn--nqv7f":{"$":0},"xn--nqv7fs00ema":{"$":0},"xn--nyqy26a":{"$":0},"xn--p1acf":{"$":0},"xn--pbt977c":{"$":0},"xn--pssy2u":{"$":0},"xn--q9jyb4c":{"$":0},"xn--qcka1pmc":{"$":0},"xn--rhqv96g":{"$":0},"xn--rovu88b":{"$":0},"xn--ses554g":{"$":0},"xn--t60b56a":{"$":0},"xn--tckwe":{"$":0},"xn--tiq49xqyj":{"$":0},"xn--unup4y":{"$":0},"xn--vermgensberater-ctb":{"$":0},"xn--vermgensberatung-pwb":{"$":0},"xn--vhquv":{"$":0},"xn--vuq861b":{"$":0},"xn--w4r85el8fhu5dnra":{"$":0},"xn--w4rs40l":{"$":0},"xn--xhq521b":{"$":0},"xn--zfr164b":{"$":0},"xperia":{"$":0},"xyz":{"$":0,"blogsite":{"$":0},"fhapp":{"$":0}},"yachts":{"$":0},"yahoo":{"$":0},"yamaxun":{"$":0},"yandex":{"$":0},"yodobashi":{"$":0},"yoga":{"$":0},"yokohama":{"$":0},"you":{"$":0},"youtube":{"$":0},"yun":{"$":0},"zappos":{"$":0},"zara":{"$":0},"zero":{"$":0},"zip":{"$":0},"zippo":{"$":0},"zone":{"$":0,"triton":{"*":{"$":0}},"lima":{"$":0}},"zuerich":{"$":0}}}
},{}],23:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":24,"punycode":9,"querystring":12}],24:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],25:[function(require,module,exports){
'use strict';

/* global safari:false */
var context = void 0;

if (safari && safari.extension && safari.extension.globalPage && safari.extension.globalPage.contentWindow) {
    context = 'popup';
} else if (safari && safari.self && safari.self.tab) {
    context = 'extensionPage';
} else {
    throw new Error('safari-ui-wrapper couldn\'t figure out the context it\'s in');
}

var reloadTab = function reloadTab() {
    var activeTab = window.safari.application.activeBrowserWindow.activeTab;
    activeTab.url = activeTab.url;
};

var closePopup = function closePopup() {
    window.safari.self.hide();
};

/**
 * Messaging to/from the background page
 *
 * Unlike Chrome, Safari has different contexts for the popups and extension pages
 *
 * In extension pages, it's impossible to send a message along with a callback
 * for a reply, so for messages that need a response (e.g. getSetting) we need to
 * keep track of them via an ID
 */

var pendingMessages = {};

var sendExtensionPageMessage = function sendExtensionPageMessage(message, resolve, reject) {
    if (message.whitelisted) {
        resolve(safari.self.tab.dispatchMessage('whitelisted', message));
    } else if (message.getSetting) {
        var id = Math.random();
        message.id = id;
        pendingMessages[id] = resolve;
        safari.self.tab.dispatchMessage('getSetting', message);
    } else if (message.getExtensionVersion) {
        var _id = Math.random();
        message.id = _id;
        pendingMessages[_id] = resolve;
        safari.self.tab.dispatchMessage('getExtensionVersion', message);
    } else if (message.updateSetting) {
        resolve(safari.self.tab.dispatchMessage('updateSetting', message));
    }
};

if (context === 'extensionPage') {
    safari.self.addEventListener('message', function (e) {
        if (e.name !== 'backgroundResponse' || !e.message.id) {
            return;
        }

        var pendingResolve = pendingMessages[e.message.id];

        if (!pendingResolve) {
            return;
        }

        delete pendingMessages[e.message.id];
        pendingResolve(e.message.data);
    }, true);
}

var fetch = function fetch(message) {
    return new Promise(function (resolve, reject) {
        console.log('Safari Fetch: ' + JSON.stringify(message));
        if (context === 'popup') {
            safari.extension.globalPage.contentWindow.message(message, resolve);
        } else if (context === 'extensionPage') {
            sendExtensionPageMessage(message, resolve, reject);
        }
    });
};

var backgroundMessage = function backgroundMessage(thisModel) {
    // listen for messages from background
    safari.self.addEventListener('message', function (req) {
        if (req.whitelistChanged) {
            // notify subscribers that the whitelist has changed
            thisModel.set('whitelistChanged', true);
        } else if (req.updateTrackerCount) {
            thisModel.set('updateTrackerCount', true);
        }
    });
};

var getBackgroundTabData = function getBackgroundTabData() {
    return new Promise(function (resolve) {
        fetch({ getCurrentTab: true }).then(function (tab) {
            if (tab) {
                var tabCopy = JSON.parse(JSON.stringify(tab));
                resolve(tabCopy);
            } else {
                resolve();
            }
        });
    });
};

var search = function search(url) {
    // in Chrome, adding the ATB param is handled by ATB.redirectURL()
    // which doesn't happen on Safari
    fetch({ getSetting: { name: 'atb' } }).then(function (atb) {
        safari.application.activeBrowserWindow.openTab().url = 'https://www.exploreos.com/?q=' + url + '&bext=safari&atb=' + atb;
        safari.self.hide();
    });
};

var getExtensionURL = function getExtensionURL(path) {
    return safari.extension.baseURI + path;
};

var openExtensionPage = function openExtensionPage(path) {
    // Chrome needs an opening slash, Safari breaks if you add it
    if (path.indexOf('/') === 0) {
        path = path.substr(1);
    }

    var url = getExtensionURL(path);

    if (context === 'popup') {
        var tab = safari.application.activeBrowserWindow.openTab();
        tab.url = url;
        safari.self.hide();
    } else {
        // note: this will only work if this is happening as a direct response
        // to a user click - otherwise it'll be blocked by Safari's popup blocker
        window.open(url, '_blank');
    }
};

var openOptionsPage = function openOptionsPage() {
    openExtensionPage('/html/options.html');
};

module.exports = {
    fetch: fetch,
    reloadTab: reloadTab,
    closePopup: closePopup,
    backgroundMessage: backgroundMessage,
    getBackgroundTabData: getBackgroundTabData,
    search: search,
    openOptionsPage: openOptionsPage,
    openExtensionPage: openExtensionPage,
    getExtensionURL: getExtensionURL
};

},{}],26:[function(require,module,exports){
'use strict';

var Parent = window.DDG.base.Model;
var browserUIWrapper = require('./../base/safari-ui-wrapper.es6.js');

/**
 * Background messaging is done via two methods:
 *
 * 1. Passive messages from background -> backgroundMessage model -> subscribing model
 *
 *  The background sends these messages using chrome.runtime.sendMessage({'name': 'value'})
 *  The backgroundMessage model (here) receives the message and forwards the
 *  it to the global event store via model.send(msg)
 *  Other modules that are subscribed to state changes in backgroundMessage are notified
 *
 * 2. Two-way messaging using this.model.fetch() as a passthrough
 *
 *  Each model can use a fetch method to send and receive a response from the background.
 *  Ex: this.model.fetch({'name': 'value'}).then((response) => console.log(response))
 *  Listeners must be registered in the background to respond to messages with this 'name'.
 *
 *  The common fetch method is defined in base/model.es6.js
 */
function BackgroundMessage(attrs) {
    Parent.call(this, attrs);
    var thisModel = this;
    browserUIWrapper.backgroundMessage(thisModel);
}

BackgroundMessage.prototype = window.$.extend({}, Parent.prototype, {
    modelName: 'backgroundMessage'
});

module.exports = BackgroundMessage;

},{"./../base/safari-ui-wrapper.es6.js":25}],27:[function(require,module,exports){
'use strict';

var Parent = window.DDG.base.Model;

function PrivacyOptions(attrs) {
    // set some default values for the toggle switches in the template
    attrs.trackerBlockingEnabled = true;
    attrs.httpsEverywhereEnabled = true;
    attrs.embeddedTweetsEnabled = false;

    Parent.call(this, attrs);
}

PrivacyOptions.prototype = window.$.extend({}, Parent.prototype, {

    modelName: 'privacyOptions',

    toggle: function toggle(k) {
        if (this.hasOwnProperty(k)) {
            this[k] = !this[k];
            console.log('PrivacyOptions model toggle ' + k + ' is now ' + this[k]);
            this.fetch({ updateSetting: { name: k, value: this[k] } });
        }
    },

    getSettings: function getSettings() {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.fetch({ getSetting: 'all' }).then(function (settings) {
                self.trackerBlockingEnabled = settings['trackerBlockingEnabled'];
                self.httpsEverywhereEnabled = settings['httpsEverywhereEnabled'];
                self.embeddedTweetsEnabled = settings['embeddedTweetsEnabled'];
                resolve();
            });
        });
    }
});

module.exports = PrivacyOptions;

},{}],28:[function(require,module,exports){
'use strict';

var Parent = window.DDG.base.Model;
var tldjs = require('tldjs');

function Whitelist(attrs) {
    attrs.list = {};
    Parent.call(this, attrs);

    this.setWhitelistFromSettings();
}

Whitelist.prototype = window.$.extend({}, Parent.prototype, {

    modelName: 'whitelist',

    removeDomain: function removeDomain(itemIndex) {
        var domain = this.list[itemIndex];
        console.log('whitelist: remove ' + domain);

        this.fetch({
            'whitelisted': {
                list: 'whitelisted',
                domain: domain,
                value: false
            }
        });

        // Update list
        // use splice() so it reindexes the array
        this.list.splice(itemIndex, 1);
    },


    addDomain: function addDomain(url) {
        // We only whitelist domains, not full URLs:
        // - use getDomain, it will return null if the URL is invalid
        // - prefix with getSubDomain, which returns an empty string if none is found
        // But first, strip the 'www.' part, otherwise getSubDomain will include it
        // and whitelisting won't work for that site
        url = url ? url.replace('www.', '') : '';
        var localDomain = url.match(/^localhost(:[0-9]+)?$/i) ? 'localhost' : null;
        var subDomain = tldjs.getSubdomain(url);
        var domain = tldjs.getDomain(url) || localDomain;
        if (domain) {
            var domainToWhitelist = subDomain ? subDomain + '.' + domain : domain;
            console.log('whitelist: add ' + domainToWhitelist);

            this.fetch({
                'whitelisted': {
                    list: 'whitelisted',
                    domain: domainToWhitelist,
                    value: true
                }
            });

            this.setWhitelistFromSettings();
        }

        return domain;
    },

    setWhitelistFromSettings: function setWhitelistFromSettings() {
        var self = this;
        this.fetch({ getSetting: { name: 'whitelisted' } }).then(function (whitelist) {
            whitelist = whitelist || {};
            var wlist = Object.keys(whitelist);
            wlist.sort();

            // Publish whitelist change notification via the store
            // used to know when to rerender the view
            self.set('list', wlist);
        });
    }
});

module.exports = Whitelist;

},{"tldjs":13}],29:[function(require,module,exports){
'use strict';

module.exports = {
    setBrowserClassOnBodyTag: require('./safari-set-browser-class.es6.js'),
    parseQueryString: require('./parse-query-string.es6.js')
};

},{"./parse-query-string.es6.js":30,"./safari-set-browser-class.es6.js":31}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
'use strict';

module.exports = {
    setBrowserClassOnBodyTag: function setBrowserClassOnBodyTag() {
        var browserClass = 'is-browser--' + 'safari';
        window.$('html').addClass(browserClass);
        window.$('body').addClass(browserClass);
    }
};

},{}],32:[function(require,module,exports){
'use strict';

var Parent = window.DDG.base.Page;
var mixins = require('./mixins/index.es6.js');
var PrivacyOptionsView = require('./../views/privacy-options.es6.js');
var PrivacyOptionsModel = require('./../models/privacy-options.es6.js');
var privacyOptionsTemplate = require('./../templates/privacy-options.es6.js');
var WhitelistView = require('./../views/whitelist.es6.js');
var WhitelistModel = require('./../models/whitelist.es6.js');
var whitelistTemplate = require('./../templates/whitelist.es6.js');
var BackgroundMessageModel = require('./../models/background-message.es6.js');
var browserUIWrapper = require('./../base/safari-ui-wrapper.es6.js');

function Options(ops) {
    Parent.call(this, ops);
}

Options.prototype = window.$.extend({}, Parent.prototype, mixins.setBrowserClassOnBodyTag, {

    pageName: 'options',

    ready: function ready() {
        var $parent = window.$('#options-content');
        Parent.prototype.ready.call(this);

        this.setBrowserClassOnBodyTag();

        window.$('.js-feedback-link').click(this._onFeedbackClick.bind(this));
        window.$('.js-report-site-link').click(this._onReportSiteClick.bind(this));

        this.views.options = new PrivacyOptionsView({
            pageView: this,
            model: new PrivacyOptionsModel({}),
            appendTo: $parent,
            template: privacyOptionsTemplate
        });

        this.views.whitelist = new WhitelistView({
            pageView: this,
            model: new WhitelistModel({}),
            appendTo: $parent,
            template: whitelistTemplate
        });

        this.message = new BackgroundMessageModel({});
    },

    _onFeedbackClick: function _onFeedbackClick(e) {
        e.preventDefault();

        browserUIWrapper.openExtensionPage('/html/feedback.html');
    },

    _onReportSiteClick: function _onReportSiteClick(e) {
        e.preventDefault();

        browserUIWrapper.openExtensionPage('/html/feedback.html?broken=1');
    }
});

// kickoff!
window.DDG = window.DDG || {};
window.DDG.page = new Options();

},{"./../base/safari-ui-wrapper.es6.js":25,"./../models/background-message.es6.js":26,"./../models/privacy-options.es6.js":27,"./../models/whitelist.es6.js":28,"./../templates/privacy-options.es6.js":33,"./../templates/whitelist.es6.js":36,"./../views/privacy-options.es6.js":37,"./../views/whitelist.es6.js":38,"./mixins/index.es6.js":29}],33:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['<section class="options-content__privacy divider-bottom">\n    <h2 class="menu-title">Options</h2>\n    <ul class="default-list">\n        <li>\n            Show Embedded Tweets\n            ', '\n        </li>\n    </ul>\n</section>'], ['<section class="options-content__privacy divider-bottom">\n    <h2 class="menu-title">Options</h2>\n    <ul class="default-list">\n        <li>\n            Show Embedded Tweets\n            ', '\n        </li>\n    </ul>\n</section>']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');
var toggleButton = require('./shared/toggle-button.es6.js');

module.exports = function () {
    return bel(_templateObject, toggleButton(this.model.embeddedTweetsEnabled, 'js-options-embedded-tweets-enabled', 'embeddedTweetsEnabled'));

    /**
     * TODO: revisit these global options later:
        <li>
      Block Trackers
      ${toggleButton(this.model.trackerBlockingEnabled,
               'js-options-blocktrackers',
               'trackerBlockingEnabled')}
        </li>
        <li>
      Force Secure Connection
      ${toggleButton(this.model.httpsEverywhereEnabled,
               'js-options-https-everywhere-enabled',
               'httpsEverywhereEnabled')}
        </li>
     *
     */
};

},{"./shared/toggle-button.es6.js":34,"bel":1}],34:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n<button class="toggle-button toggle-button--is-active-', ' ', '"\n    data-key="', '"\n    type="button"\n    aria-pressed="', '"\n    >\n    <div class="toggle-button__bg">\n    </div>\n    <div class="toggle-button__knob"></div>\n</button>'], ['\n<button class="toggle-button toggle-button--is-active-', ' ', '"\n    data-key="', '"\n    type="button"\n    aria-pressed="', '"\n    >\n    <div class="toggle-button__bg">\n    </div>\n    <div class="toggle-button__knob"></div>\n</button>']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function (isActiveBoolean, klass, dataKey) {
    // make `klass` and `dataKey` optional:
    klass = klass || '';
    dataKey = dataKey || '';

    return bel(_templateObject, isActiveBoolean, klass, dataKey, isActiveBoolean ? 'true' : 'false');
};

},{"bel":1}],35:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['', ''], ['', '']),
    _templateObject2 = _taggedTemplateLiteral(['\n<li class="js-whitelist-list-item">\n    <a class="link-secondary" href="https://', '">', '</a>\n    <button class="remove pull-right js-whitelist-remove" data-item="', '">\xD7</button>\n</li>'], ['\n<li class="js-whitelist-list-item">\n    <a class="link-secondary" href="https://', '">', '</a>\n    <button class="remove pull-right js-whitelist-remove" data-item="', '">\xD7</button>\n</li>']),
    _templateObject3 = _taggedTemplateLiteral(['<li>No whitelisted sites.</li>'], ['<li>No whitelisted sites.</li>']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function (list) {
    if (list.length > 0) {
        var i = 0;
        return bel(_templateObject, list.map(function (dom) {
            return bel(_templateObject2, dom, dom, i++);
        }));
    }
    return bel(_templateObject3);
};

},{"bel":1}],36:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['<section class="options-content__whitelist">\n    <h2 class="menu-title">Whitelisted Sites</h2>\n    <p class="menu-paragraph">These sites will not be enhanced by Privacy Protection</p>\n    <ul class="default-list js-whitelist-container">\n        ', '\n    </ul>\n    ', '\n</section>'], ['<section class="options-content__whitelist">\n    <h2 class="menu-title">Whitelisted Sites</h2>\n    <p class="menu-paragraph">These sites will not be enhanced by Privacy Protection</p>\n    <ul class="default-list js-whitelist-container">\n        ', '\n    </ul>\n    ', '\n</section>']),
    _templateObject2 = _taggedTemplateLiteral(['<div>\n    <p class="whitelist-show-add js-whitelist-show-add">\n        <a href="javascript:void(0)">Add site to whitelist</a>\n    </p>\n    <input class="is-hidden whitelist-url float-left js-whitelist-url" type="text" placeholder="Enter URL">\n    <div class="is-hidden whitelist-add is-disabled float-right js-whitelist-add">Add to Whitelist</div>\n\n    <div class="is-hidden modal-box js-whitelist-error float-right">\n        <div class="modal-box__popout">\n            <div class="modal-box__popout__body">\n            </div>\n        </div>\n        <div class="modal-box__body">\n            <span class="icon icon__error">\n            </span>\n            <span class="modal__body__text">\n                Invalid URL\n            </span>\n        </div>\n    </div>\n</div>'], ['<div>\n    <p class="whitelist-show-add js-whitelist-show-add">\n        <a href="javascript:void(0)">Add site to whitelist</a>\n    </p>\n    <input class="is-hidden whitelist-url float-left js-whitelist-url" type="text" placeholder="Enter URL">\n    <div class="is-hidden whitelist-add is-disabled float-right js-whitelist-add">Add to Whitelist</div>\n\n    <div class="is-hidden modal-box js-whitelist-error float-right">\n        <div class="modal-box__popout">\n            <div class="modal-box__popout__body">\n            </div>\n        </div>\n        <div class="modal-box__body">\n            <span class="icon icon__error">\n            </span>\n            <span class="modal__body__text">\n                Invalid URL\n            </span>\n        </div>\n    </div>\n</div>']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');
var whitelistItems = require('./whitelist-items.es6.js');

module.exports = function () {
    return bel(_templateObject, whitelistItems(this.model.list), addToWhitelist());

    function addToWhitelist() {
        return bel(_templateObject2);
    }
};

},{"./whitelist-items.es6.js":35,"bel":1}],37:[function(require,module,exports){
'use strict';

var Parent = window.DDG.base.View;

function PrivacyOptions(ops) {
    var _this = this;

    this.model = ops.model;
    this.pageView = ops.pageView;
    this.template = ops.template;

    Parent.call(this, ops);

    this.model.getSettings().then(function () {
        _this.rerender();
    });
}

PrivacyOptions.prototype = window.$.extend({}, Parent.prototype, {

    _clickSetting: function _clickSetting(e) {
        var key = window.$(e.target).data('key') || window.$(e.target).parent().data('key');
        console.log('privacyOptions view click for setting "' + key + '"');
        this.model.toggle(key);
        this.rerender();
    },

    setup: function setup() {
        this._cacheElems('.js-options', ['blocktrackers', 'https-everywhere-enabled', 'embedded-tweets-enabled']);
        this.bindEvents([[this.$blocktrackers, 'click', this._clickSetting], [this.$httpseverywhereenabled, 'click', this._clickSetting], [this.$embeddedtweetsenabled, 'click', this._clickSetting]]);
    },

    rerender: function rerender() {
        this.unbindEvents();
        this._rerender();
        this.setup();
    }
});

module.exports = PrivacyOptions;

},{}],38:[function(require,module,exports){
'use strict';

var Parent = window.DDG.base.View;
var isHiddenClass = 'is-hidden';
var isDisabledClass = 'is-disabled';
var isInvalidInputClass = 'is-invalid-input';
var whitelistItemsTemplate = require('./../templates/whitelist-items.es6.js');

function Whitelist(ops) {
    this.model = ops.model;
    this.pageView = ops.pageView;
    this.template = ops.template;

    Parent.call(this, ops);

    // bind events
    this.setup();
}

Whitelist.prototype = window.$.extend({}, Parent.prototype, {

    _removeItem: function _removeItem(e) {
        var itemIndex = window.$(e.target).data('item');
        this.model.removeDomain(itemIndex);

        // No need to rerender the whole view
        this._renderList();
    },

    _addItem: function _addItem(e) {
        if (!this.$add.hasClass(isDisabledClass)) {
            var url = this.$url.val();
            var isValidInput = false;
            if (url) {
                isValidInput = this.model.addDomain(url);
            }

            if (isValidInput) {
                this.rerender();
            } else {
                this._showErrorMessage();
            }
        }
    },

    _showErrorMessage: function _showErrorMessage() {
        this.$add.addClass(isHiddenClass);
        this.$error.removeClass(isHiddenClass);
        this.$url.addClass(isInvalidInputClass);
    },

    _hideErrorMessage: function _hideErrorMessage() {
        this.$add.removeClass(isHiddenClass);
        this.$error.addClass(isHiddenClass);
        this.$url.removeClass(isInvalidInputClass);
    },

    _manageInputChange: function _manageInputChange(e) {
        var isButtonDisabled = this.$add.hasClass(isDisabledClass);

        this._hideErrorMessage();
        if (this.$url.val() && isButtonDisabled) {
            this.$add.removeClass(isDisabledClass);
        } else if (!this.$url.val()) {
            this.$add.addClass(isDisabledClass);
        }

        if (!isButtonDisabled && e.key === 'Enter') {
            // also add to whitelist on enter
            this._addItem();
        }
    },

    _showAddToWhitelistInput: function _showAddToWhitelistInput(e) {
        this.$url.removeClass(isHiddenClass);
        this.$url.focus();
        this.$add.removeClass(isHiddenClass);
        this.$showadd.addClass(isHiddenClass);
        e.preventDefault();
    },

    setup: function setup() {
        this._cacheElems('.js-whitelist', ['remove', 'add', 'error', 'show-add', 'container', 'list-item', 'url']);

        this.bindEvents([[this.$remove, 'click', this._removeItem], [this.$add, 'click', this._addItem], [this.$showadd, 'click', this._showAddToWhitelistInput], [this.$url, 'keyup', this._manageInputChange],
        // listen to changes to the whitelist model
        [this.store.subscribe, 'change:whitelist', this.rerender]]);
    },

    rerender: function rerender() {
        this.unbindEvents();
        this._rerender();
        this.setup();
    },

    _renderList: function _renderList() {
        this.unbindEvents();
        this.$container.html(whitelistItemsTemplate(this.model.list));
        this.setup();
    }
});

module.exports = Whitelist;

},{"./../templates/whitelist-items.es6.js":35}]},{},[32])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmVsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcmVzb2x2ZS9lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9nbG9iYWwvZG9jdW1lbnQuanMiLCJub2RlX21vZHVsZXMvZ2xvYmFsL3dpbmRvdy5qcyIsIm5vZGVfbW9kdWxlcy9oeXBlcnNjcmlwdC1hdHRyaWJ1dGUtdG8tcHJvcGVydHkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaHlwZXJ4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL25hbm9hc3NlcnQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb24tbG9hZC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wdW55Y29kZS9wdW55Y29kZS5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZGVjb2RlLmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9lbmNvZGUuanMiLCJub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RsZGpzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RsZGpzL2xpYi9jbGVhbi1ob3N0LmpzIiwibm9kZV9tb2R1bGVzL3RsZGpzL2xpYi9kb21haW4uanMiLCJub2RlX21vZHVsZXMvdGxkanMvbGliL2Zyb20taG9zdC5qcyIsIm5vZGVfbW9kdWxlcy90bGRqcy9saWIvaXMtdmFsaWQuanMiLCJub2RlX21vZHVsZXMvdGxkanMvbGliL3B1YmxpYy1zdWZmaXguanMiLCJub2RlX21vZHVsZXMvdGxkanMvbGliL3N1YmRvbWFpbi5qcyIsIm5vZGVfbW9kdWxlcy90bGRqcy9saWIvc3VmZml4LXRyaWUuanMiLCJub2RlX21vZHVsZXMvdGxkanMvbGliL3RsZC1leGlzdHMuanMiLCJub2RlX21vZHVsZXMvdGxkanMvcnVsZXMuanNvbiIsIm5vZGVfbW9kdWxlcy91cmwvdXJsLmpzIiwibm9kZV9tb2R1bGVzL3VybC91dGlsLmpzIiwic2hhcmVkL2pzL3VpL2Jhc2Uvc2FmYXJpLXVpLXdyYXBwZXIuZXM2LmpzIiwic2hhcmVkL2pzL3VpL21vZGVscy9iYWNrZ3JvdW5kLW1lc3NhZ2UuZXM2LmpzIiwic2hhcmVkL2pzL3VpL21vZGVscy9wcml2YWN5LW9wdGlvbnMuZXM2LmpzIiwic2hhcmVkL2pzL3VpL21vZGVscy93aGl0ZWxpc3QuZXM2LmpzIiwic2hhcmVkL2pzL3VpL3BhZ2VzL21peGlucy9pbmRleC5lczYuanMiLCJzaGFyZWQvanMvdWkvcGFnZXMvbWl4aW5zL3BhcnNlLXF1ZXJ5LXN0cmluZy5lczYuanMiLCJzaGFyZWQvanMvdWkvcGFnZXMvbWl4aW5zL3NhZmFyaS1zZXQtYnJvd3Nlci1jbGFzcy5lczYuanMiLCJzaGFyZWQvanMvdWkvcGFnZXMvb3B0aW9ucy5lczYuanMiLCJzaGFyZWQvanMvdWkvdGVtcGxhdGVzL3ByaXZhY3ktb3B0aW9ucy5lczYuanMiLCJzaGFyZWQvanMvdWkvdGVtcGxhdGVzL3NoYXJlZC90b2dnbGUtYnV0dG9uLmVzNi5qcyIsInNoYXJlZC9qcy91aS90ZW1wbGF0ZXMvd2hpdGVsaXN0LWl0ZW1zLmVzNi5qcyIsInNoYXJlZC9qcy91aS90ZW1wbGF0ZXMvd2hpdGVsaXN0LmVzNi5qcyIsInNoYXJlZC9qcy91aS92aWV3cy9wcml2YWN5LW9wdGlvbnMuZXM2LmpzIiwic2hhcmVkL2pzL3VpL3ZpZXdzL3doaXRlbGlzdC5lczYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SkE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzV0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hCQTtBQUNBLElBQUksZ0JBQUo7O0FBRUEsSUFBSSxVQUNJLE9BQU8sU0FEWCxJQUVJLE9BQU8sU0FBUCxDQUFpQixVQUZyQixJQUdJLE9BQU8sU0FBUCxDQUFpQixVQUFqQixDQUE0QixhQUhwQyxFQUdtRDtBQUMvQyxjQUFVLE9BQVY7QUFDSCxDQUxELE1BS08sSUFBSSxVQUNILE9BQU8sSUFESixJQUVILE9BQU8sSUFBUCxDQUFZLEdBRmIsRUFFa0I7QUFDckIsY0FBVSxlQUFWO0FBQ0gsQ0FKTSxNQUlBO0FBQ0gsVUFBTSxJQUFJLEtBQUosQ0FBVSw2REFBVixDQUFOO0FBQ0g7O0FBRUQsSUFBSSxZQUFZLFNBQVosU0FBWSxHQUFNO0FBQ2xCLFFBQUksWUFBWSxPQUFPLE1BQVAsQ0FBYyxXQUFkLENBQTBCLG1CQUExQixDQUE4QyxTQUE5RDtBQUNBLGNBQVUsR0FBVixHQUFnQixVQUFVLEdBQTFCO0FBQ0gsQ0FIRDs7QUFLQSxJQUFJLGFBQWEsU0FBYixVQUFhLEdBQU07QUFDbkIsV0FBTyxNQUFQLENBQWMsSUFBZCxDQUFtQixJQUFuQjtBQUNILENBRkQ7O0FBSUE7Ozs7Ozs7Ozs7QUFVQSxJQUFJLGtCQUFrQixFQUF0Qjs7QUFFQSxJQUFJLDJCQUEyQixTQUEzQix3QkFBMkIsQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixNQUFuQixFQUE4QjtBQUN6RCxRQUFJLFFBQVEsV0FBWixFQUF5QjtBQUNyQixnQkFBUSxPQUFPLElBQVAsQ0FBWSxHQUFaLENBQWdCLGVBQWhCLENBQWdDLGFBQWhDLEVBQStDLE9BQS9DLENBQVI7QUFDSCxLQUZELE1BRU8sSUFBSSxRQUFRLFVBQVosRUFBd0I7QUFDM0IsWUFBSSxLQUFLLEtBQUssTUFBTCxFQUFUO0FBQ0EsZ0JBQVEsRUFBUixHQUFhLEVBQWI7QUFDQSx3QkFBZ0IsRUFBaEIsSUFBc0IsT0FBdEI7QUFDQSxlQUFPLElBQVAsQ0FBWSxHQUFaLENBQWdCLGVBQWhCLENBQWdDLFlBQWhDLEVBQThDLE9BQTlDO0FBQ0gsS0FMTSxNQUtBLElBQUksUUFBUSxtQkFBWixFQUFpQztBQUNwQyxZQUFJLE1BQUssS0FBSyxNQUFMLEVBQVQ7QUFDQSxnQkFBUSxFQUFSLEdBQWEsR0FBYjtBQUNBLHdCQUFnQixHQUFoQixJQUFzQixPQUF0QjtBQUNBLGVBQU8sSUFBUCxDQUFZLEdBQVosQ0FBZ0IsZUFBaEIsQ0FBZ0MscUJBQWhDLEVBQXVELE9BQXZEO0FBQ0gsS0FMTSxNQUtBLElBQUksUUFBUSxhQUFaLEVBQTJCO0FBQzlCLGdCQUFRLE9BQU8sSUFBUCxDQUFZLEdBQVosQ0FBZ0IsZUFBaEIsQ0FBZ0MsZUFBaEMsRUFBaUQsT0FBakQsQ0FBUjtBQUNIO0FBQ0osQ0FoQkQ7O0FBa0JBLElBQUksWUFBWSxlQUFoQixFQUFpQztBQUM3QixXQUFPLElBQVAsQ0FBWSxnQkFBWixDQUE2QixTQUE3QixFQUF3QyxVQUFDLENBQUQsRUFBTztBQUMzQyxZQUFJLEVBQUUsSUFBRixLQUFXLG9CQUFYLElBQW1DLENBQUMsRUFBRSxPQUFGLENBQVUsRUFBbEQsRUFBc0Q7QUFDbEQ7QUFDSDs7QUFFRCxZQUFJLGlCQUFpQixnQkFBZ0IsRUFBRSxPQUFGLENBQVUsRUFBMUIsQ0FBckI7O0FBRUEsWUFBSSxDQUFDLGNBQUwsRUFBcUI7QUFBRTtBQUFROztBQUUvQixlQUFPLGdCQUFnQixFQUFFLE9BQUYsQ0FBVSxFQUExQixDQUFQO0FBQ0EsdUJBQWUsRUFBRSxPQUFGLENBQVUsSUFBekI7QUFDSCxLQVhELEVBV0csSUFYSDtBQVlIOztBQUVELElBQUksUUFBUSxTQUFSLEtBQVEsQ0FBQyxPQUFELEVBQWE7QUFDckIsV0FBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3BDLGdCQUFRLEdBQVIsb0JBQTZCLEtBQUssU0FBTCxDQUFlLE9BQWYsQ0FBN0I7QUFDQSxZQUFJLFlBQVksT0FBaEIsRUFBeUI7QUFDckIsbUJBQU8sU0FBUCxDQUFpQixVQUFqQixDQUE0QixhQUE1QixDQUEwQyxPQUExQyxDQUFrRCxPQUFsRCxFQUEyRCxPQUEzRDtBQUNILFNBRkQsTUFFTyxJQUFJLFlBQVksZUFBaEIsRUFBaUM7QUFDcEMscUNBQXlCLE9BQXpCLEVBQWtDLE9BQWxDLEVBQTJDLE1BQTNDO0FBQ0g7QUFDSixLQVBNLENBQVA7QUFRSCxDQVREOztBQVdBLElBQUksb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFDLFNBQUQsRUFBZTtBQUNuQztBQUNBLFdBQU8sSUFBUCxDQUFZLGdCQUFaLENBQTZCLFNBQTdCLEVBQXdDLFVBQUMsR0FBRCxFQUFTO0FBQzdDLFlBQUksSUFBSSxnQkFBUixFQUEwQjtBQUN0QjtBQUNBLHNCQUFVLEdBQVYsQ0FBYyxrQkFBZCxFQUFrQyxJQUFsQztBQUNILFNBSEQsTUFHTyxJQUFJLElBQUksa0JBQVIsRUFBNEI7QUFDL0Isc0JBQVUsR0FBVixDQUFjLG9CQUFkLEVBQW9DLElBQXBDO0FBQ0g7QUFDSixLQVBEO0FBUUgsQ0FWRDs7QUFZQSxJQUFJLHVCQUF1QixTQUF2QixvQkFBdUIsR0FBTTtBQUM3QixXQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFhO0FBQzVCLGNBQU0sRUFBQyxlQUFlLElBQWhCLEVBQU4sRUFBNkIsSUFBN0IsQ0FBa0MsVUFBQyxHQUFELEVBQVM7QUFDdkMsZ0JBQUksR0FBSixFQUFTO0FBQ0wsb0JBQUksVUFBVSxLQUFLLEtBQUwsQ0FBVyxLQUFLLFNBQUwsQ0FBZSxHQUFmLENBQVgsQ0FBZDtBQUNBLHdCQUFRLE9BQVI7QUFDSCxhQUhELE1BR087QUFDSDtBQUNIO0FBQ0osU0FQRDtBQVFILEtBVE0sQ0FBUDtBQVVILENBWEQ7O0FBYUEsSUFBSSxTQUFTLFNBQVQsTUFBUyxDQUFDLEdBQUQsRUFBUztBQUNsQjtBQUNBO0FBQ0EsVUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLEtBQVIsRUFBZCxFQUFOLEVBQXVDLElBQXZDLENBQTRDLFVBQUMsR0FBRCxFQUFTO0FBQ2pELGVBQU8sV0FBUCxDQUFtQixtQkFBbkIsQ0FBdUMsT0FBdkMsR0FBaUQsR0FBakQscUNBQXVGLEdBQXZGLHlCQUE4RyxHQUE5RztBQUNBLGVBQU8sSUFBUCxDQUFZLElBQVo7QUFDSCxLQUhEO0FBSUgsQ0FQRDs7QUFTQSxJQUFJLGtCQUFrQixTQUFsQixlQUFrQixDQUFDLElBQUQsRUFBVTtBQUM1QixXQUFPLE9BQU8sU0FBUCxDQUFpQixPQUFqQixHQUEyQixJQUFsQztBQUNILENBRkQ7O0FBSUEsSUFBSSxvQkFBb0IsU0FBcEIsaUJBQW9CLENBQUMsSUFBRCxFQUFVO0FBQzlCO0FBQ0EsUUFBSSxLQUFLLE9BQUwsQ0FBYSxHQUFiLE1BQXNCLENBQTFCLEVBQTZCO0FBQ3pCLGVBQU8sS0FBSyxNQUFMLENBQVksQ0FBWixDQUFQO0FBQ0g7O0FBRUQsUUFBSSxNQUFNLGdCQUFnQixJQUFoQixDQUFWOztBQUVBLFFBQUksWUFBWSxPQUFoQixFQUF5QjtBQUNyQixZQUFJLE1BQU0sT0FBTyxXQUFQLENBQW1CLG1CQUFuQixDQUF1QyxPQUF2QyxFQUFWO0FBQ0EsWUFBSSxHQUFKLEdBQVUsR0FBVjtBQUNBLGVBQU8sSUFBUCxDQUFZLElBQVo7QUFDSCxLQUpELE1BSU87QUFDSDtBQUNBO0FBQ0EsZUFBTyxJQUFQLENBQVksR0FBWixFQUFpQixRQUFqQjtBQUNIO0FBQ0osQ0FqQkQ7O0FBbUJBLElBQUksa0JBQWtCLFNBQWxCLGVBQWtCLEdBQU07QUFDeEIsc0JBQWtCLG9CQUFsQjtBQUNILENBRkQ7O0FBSUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2IsV0FBTyxLQURNO0FBRWIsZUFBVyxTQUZFO0FBR2IsZ0JBQVksVUFIQztBQUliLHVCQUFtQixpQkFKTjtBQUtiLDBCQUFzQixvQkFMVDtBQU1iLFlBQVEsTUFOSztBQU9iLHFCQUFpQixlQVBKO0FBUWIsdUJBQW1CLGlCQVJOO0FBU2IscUJBQWlCO0FBVEosQ0FBakI7Ozs7O0FDOUlBLElBQU0sU0FBUyxPQUFPLEdBQVAsQ0FBVyxJQUFYLENBQWdCLEtBQS9CO0FBQ0EsSUFBTSxtQkFBbUIsUUFBUSxzQ0FBUixDQUF6Qjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLFNBQVMsaUJBQVQsQ0FBNEIsS0FBNUIsRUFBbUM7QUFDL0IsV0FBTyxJQUFQLENBQVksSUFBWixFQUFrQixLQUFsQjtBQUNBLFFBQUksWUFBWSxJQUFoQjtBQUNBLHFCQUFpQixpQkFBakIsQ0FBbUMsU0FBbkM7QUFDSDs7QUFFRCxrQkFBa0IsU0FBbEIsR0FBOEIsT0FBTyxDQUFQLENBQVMsTUFBVCxDQUFnQixFQUFoQixFQUMxQixPQUFPLFNBRG1CLEVBRTFCO0FBQ0ksZUFBVztBQURmLENBRjBCLENBQTlCOztBQU9BLE9BQU8sT0FBUCxHQUFpQixpQkFBakI7Ozs7O0FDbENBLElBQU0sU0FBUyxPQUFPLEdBQVAsQ0FBVyxJQUFYLENBQWdCLEtBQS9COztBQUVBLFNBQVMsY0FBVCxDQUF5QixLQUF6QixFQUFnQztBQUM1QjtBQUNBLFVBQU0sc0JBQU4sR0FBK0IsSUFBL0I7QUFDQSxVQUFNLHNCQUFOLEdBQStCLElBQS9CO0FBQ0EsVUFBTSxxQkFBTixHQUE4QixLQUE5Qjs7QUFFQSxXQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWtCLEtBQWxCO0FBQ0g7O0FBRUQsZUFBZSxTQUFmLEdBQTJCLE9BQU8sQ0FBUCxDQUFTLE1BQVQsQ0FBZ0IsRUFBaEIsRUFDdkIsT0FBTyxTQURnQixFQUV2Qjs7QUFFSSxlQUFXLGdCQUZmOztBQUlJLFlBQVEsZ0JBQVUsQ0FBVixFQUFhO0FBQ2pCLFlBQUksS0FBSyxjQUFMLENBQW9CLENBQXBCLENBQUosRUFBNEI7QUFDeEIsaUJBQUssQ0FBTCxJQUFVLENBQUMsS0FBSyxDQUFMLENBQVg7QUFDQSxvQkFBUSxHQUFSLGtDQUEyQyxDQUEzQyxnQkFBdUQsS0FBSyxDQUFMLENBQXZEO0FBQ0EsaUJBQUssS0FBTCxDQUFXLEVBQUMsZUFBZSxFQUFDLE1BQU0sQ0FBUCxFQUFVLE9BQU8sS0FBSyxDQUFMLENBQWpCLEVBQWhCLEVBQVg7QUFDSDtBQUNKLEtBVkw7O0FBWUksaUJBQWEsdUJBQVk7QUFDckIsWUFBSSxPQUFPLElBQVg7QUFDQSxlQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDcEMsaUJBQUssS0FBTCxDQUFXLEVBQUMsWUFBWSxLQUFiLEVBQVgsRUFBZ0MsSUFBaEMsQ0FBcUMsVUFBQyxRQUFELEVBQWM7QUFDL0MscUJBQUssc0JBQUwsR0FBOEIsU0FBUyx3QkFBVCxDQUE5QjtBQUNBLHFCQUFLLHNCQUFMLEdBQThCLFNBQVMsd0JBQVQsQ0FBOUI7QUFDQSxxQkFBSyxxQkFBTCxHQUE2QixTQUFTLHVCQUFULENBQTdCO0FBQ0E7QUFDSCxhQUxEO0FBTUgsU0FQTSxDQUFQO0FBUUg7QUF0QkwsQ0FGdUIsQ0FBM0I7O0FBNEJBLE9BQU8sT0FBUCxHQUFpQixjQUFqQjs7Ozs7QUN2Q0EsSUFBTSxTQUFTLE9BQU8sR0FBUCxDQUFXLElBQVgsQ0FBZ0IsS0FBL0I7QUFDQSxJQUFNLFFBQVEsUUFBUSxPQUFSLENBQWQ7O0FBRUEsU0FBUyxTQUFULENBQW9CLEtBQXBCLEVBQTJCO0FBQ3ZCLFVBQU0sSUFBTixHQUFhLEVBQWI7QUFDQSxXQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWtCLEtBQWxCOztBQUVBLFNBQUssd0JBQUw7QUFDSDs7QUFFRCxVQUFVLFNBQVYsR0FBc0IsT0FBTyxDQUFQLENBQVMsTUFBVCxDQUFnQixFQUFoQixFQUNsQixPQUFPLFNBRFcsRUFFbEI7O0FBRUksZUFBVyxXQUZmOztBQUlJLGdCQUpKLHdCQUlrQixTQUpsQixFQUk2QjtBQUNyQixZQUFJLFNBQVMsS0FBSyxJQUFMLENBQVUsU0FBVixDQUFiO0FBQ0EsZ0JBQVEsR0FBUix3QkFBaUMsTUFBakM7O0FBRUEsYUFBSyxLQUFMLENBQVc7QUFDUCwyQkFBZTtBQUNYLHNCQUFNLGFBREs7QUFFWCx3QkFBUSxNQUZHO0FBR1gsdUJBQU87QUFISTtBQURSLFNBQVg7O0FBUUE7QUFDQTtBQUNBLGFBQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUIsU0FBakIsRUFBNEIsQ0FBNUI7QUFDSCxLQW5CTDs7O0FBcUJJLGVBQVcsbUJBQVUsR0FBVixFQUFlO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNLE1BQU0sSUFBSSxPQUFKLENBQVksTUFBWixFQUFvQixFQUFwQixDQUFOLEdBQWdDLEVBQXRDO0FBQ0EsWUFBTSxjQUFjLElBQUksS0FBSixDQUFVLHdCQUFWLElBQXNDLFdBQXRDLEdBQW9ELElBQXhFO0FBQ0EsWUFBTSxZQUFZLE1BQU0sWUFBTixDQUFtQixHQUFuQixDQUFsQjtBQUNBLFlBQU0sU0FBUyxNQUFNLFNBQU4sQ0FBZ0IsR0FBaEIsS0FBd0IsV0FBdkM7QUFDQSxZQUFJLE1BQUosRUFBWTtBQUNSLGdCQUFNLG9CQUFvQixZQUFZLFlBQVksR0FBWixHQUFrQixNQUE5QixHQUF1QyxNQUFqRTtBQUNBLG9CQUFRLEdBQVIscUJBQThCLGlCQUE5Qjs7QUFFQSxpQkFBSyxLQUFMLENBQVc7QUFDUCwrQkFBZTtBQUNYLDBCQUFNLGFBREs7QUFFWCw0QkFBUSxpQkFGRztBQUdYLDJCQUFPO0FBSEk7QUFEUixhQUFYOztBQVFBLGlCQUFLLHdCQUFMO0FBQ0g7O0FBRUQsZUFBTyxNQUFQO0FBQ0gsS0EvQ0w7O0FBaURJLDhCQUEwQixvQ0FBWTtBQUNsQyxZQUFJLE9BQU8sSUFBWDtBQUNBLGFBQUssS0FBTCxDQUFXLEVBQUMsWUFBWSxFQUFDLE1BQU0sYUFBUCxFQUFiLEVBQVgsRUFBZ0QsSUFBaEQsQ0FBcUQsVUFBQyxTQUFELEVBQWU7QUFDaEUsd0JBQVksYUFBYSxFQUF6QjtBQUNBLGdCQUFJLFFBQVEsT0FBTyxJQUFQLENBQVksU0FBWixDQUFaO0FBQ0Esa0JBQU0sSUFBTjs7QUFFQTtBQUNBO0FBQ0EsaUJBQUssR0FBTCxDQUFTLE1BQVQsRUFBaUIsS0FBakI7QUFDSCxTQVJEO0FBU0g7QUE1REwsQ0FGa0IsQ0FBdEI7O0FBa0VBLE9BQU8sT0FBUCxHQUFpQixTQUFqQjs7Ozs7QUM1RUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2IsOEJBQTBCLFFBQVEscUNBQVIsQ0FEYjtBQUViLHNCQUFrQixRQUFRLDZCQUFSO0FBRkwsQ0FBakI7Ozs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUI7QUFDYixzQkFBa0IsMEJBQUMsRUFBRCxFQUFRO0FBQ3RCLFlBQUksT0FBTyxFQUFQLEtBQWMsUUFBbEIsRUFBNEI7QUFDeEIsa0JBQU0sSUFBSSxLQUFKLENBQVUsMENBQVYsQ0FBTjtBQUNIOztBQUVELFlBQUksU0FBUyxFQUFiOztBQUVBLFlBQUksR0FBRyxDQUFILE1BQVUsR0FBZCxFQUFtQjtBQUNmLGlCQUFLLEdBQUcsTUFBSCxDQUFVLENBQVYsQ0FBTDtBQUNIOztBQUVELFlBQUksUUFBUSxHQUFHLEtBQUgsQ0FBUyxHQUFULENBQVo7O0FBRUEsY0FBTSxPQUFOLENBQWMsVUFBQyxJQUFELEVBQVU7QUFBQSw4QkFDSCxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBREc7QUFBQTtBQUFBLGdCQUNmLEdBRGU7QUFBQSxnQkFDVixHQURVOztBQUdwQixnQkFBSSxPQUFPLEdBQVgsRUFBZ0I7QUFDWix1QkFBTyxHQUFQLElBQWMsR0FBZDtBQUNIO0FBQ0osU0FORDs7QUFRQSxlQUFPLE1BQVA7QUFDSDtBQXZCWSxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUI7QUFDYiw4QkFBMEIsb0NBQVk7QUFDbEMsWUFBSSxlQUFlLGlCQUFpQixRQUFwQztBQUNBLGVBQU8sQ0FBUCxDQUFTLE1BQVQsRUFBaUIsUUFBakIsQ0FBMEIsWUFBMUI7QUFDQSxlQUFPLENBQVAsQ0FBUyxNQUFULEVBQWlCLFFBQWpCLENBQTBCLFlBQTFCO0FBQ0g7QUFMWSxDQUFqQjs7Ozs7QUNBQSxJQUFNLFNBQVMsT0FBTyxHQUFQLENBQVcsSUFBWCxDQUFnQixJQUEvQjtBQUNBLElBQU0sU0FBUyxRQUFRLHVCQUFSLENBQWY7QUFDQSxJQUFNLHFCQUFxQixRQUFRLG1DQUFSLENBQTNCO0FBQ0EsSUFBTSxzQkFBc0IsUUFBUSxvQ0FBUixDQUE1QjtBQUNBLElBQU0seUJBQXlCLFFBQVEsdUNBQVIsQ0FBL0I7QUFDQSxJQUFNLGdCQUFnQixRQUFRLDZCQUFSLENBQXRCO0FBQ0EsSUFBTSxpQkFBaUIsUUFBUSw4QkFBUixDQUF2QjtBQUNBLElBQU0sb0JBQW9CLFFBQVEsaUNBQVIsQ0FBMUI7QUFDQSxJQUFNLHlCQUF5QixRQUFRLHVDQUFSLENBQS9CO0FBQ0EsSUFBTSxtQkFBbUIsUUFBUSxzQ0FBUixDQUF6Qjs7QUFFQSxTQUFTLE9BQVQsQ0FBa0IsR0FBbEIsRUFBdUI7QUFDbkIsV0FBTyxJQUFQLENBQVksSUFBWixFQUFrQixHQUFsQjtBQUNIOztBQUVELFFBQVEsU0FBUixHQUFvQixPQUFPLENBQVAsQ0FBUyxNQUFULENBQWdCLEVBQWhCLEVBQ2hCLE9BQU8sU0FEUyxFQUVoQixPQUFPLHdCQUZTLEVBR2hCOztBQUVJLGNBQVUsU0FGZDs7QUFJSSxXQUFPLGlCQUFZO0FBQ2YsWUFBSSxVQUFVLE9BQU8sQ0FBUCxDQUFTLGtCQUFULENBQWQ7QUFDQSxlQUFPLFNBQVAsQ0FBaUIsS0FBakIsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUI7O0FBRUEsYUFBSyx3QkFBTDs7QUFFQSxlQUFPLENBQVAsQ0FBUyxtQkFBVCxFQUNLLEtBREwsQ0FDVyxLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBRFg7QUFFQSxlQUFPLENBQVAsQ0FBUyxzQkFBVCxFQUNLLEtBREwsQ0FDVyxLQUFLLGtCQUFMLENBQXdCLElBQXhCLENBQTZCLElBQTdCLENBRFg7O0FBR0EsYUFBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixJQUFJLGtCQUFKLENBQXVCO0FBQ3hDLHNCQUFVLElBRDhCO0FBRXhDLG1CQUFPLElBQUksbUJBQUosQ0FBd0IsRUFBeEIsQ0FGaUM7QUFHeEMsc0JBQVUsT0FIOEI7QUFJeEMsc0JBQVU7QUFKOEIsU0FBdkIsQ0FBckI7O0FBT0EsYUFBSyxLQUFMLENBQVcsU0FBWCxHQUF1QixJQUFJLGFBQUosQ0FBa0I7QUFDckMsc0JBQVUsSUFEMkI7QUFFckMsbUJBQU8sSUFBSSxjQUFKLENBQW1CLEVBQW5CLENBRjhCO0FBR3JDLHNCQUFVLE9BSDJCO0FBSXJDLHNCQUFVO0FBSjJCLFNBQWxCLENBQXZCOztBQU9BLGFBQUssT0FBTCxHQUFlLElBQUksc0JBQUosQ0FBMkIsRUFBM0IsQ0FBZjtBQUNILEtBOUJMOztBQWdDSSxzQkFBa0IsMEJBQVUsQ0FBVixFQUFhO0FBQzNCLFVBQUUsY0FBRjs7QUFFQSx5QkFBaUIsaUJBQWpCO0FBQ0gsS0FwQ0w7O0FBc0NJLHdCQUFvQiw0QkFBVSxDQUFWLEVBQWE7QUFDN0IsVUFBRSxjQUFGOztBQUVBLHlCQUFpQixpQkFBakI7QUFDSDtBQTFDTCxDQUhnQixDQUFwQjs7QUFpREE7QUFDQSxPQUFPLEdBQVAsR0FBYSxPQUFPLEdBQVAsSUFBYyxFQUEzQjtBQUNBLE9BQU8sR0FBUCxDQUFXLElBQVgsR0FBa0IsSUFBSSxPQUFKLEVBQWxCOzs7Ozs7Ozs7QUNsRUEsSUFBTSxNQUFNLFFBQVEsS0FBUixDQUFaO0FBQ0EsSUFBTSxlQUFlLFFBQVEsK0JBQVIsQ0FBckI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFlBQVk7QUFDekIsV0FBTyxHQUFQLGtCQUtVLGFBQWEsS0FBSyxLQUFMLENBQVcscUJBQXhCLEVBQ04sb0NBRE0sRUFFTix1QkFGTSxDQUxWOztBQVlKOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JDLENBN0JEOzs7Ozs7Ozs7QUNIQSxJQUFNLE1BQU0sUUFBUSxLQUFSLENBQVo7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFVBQVUsZUFBVixFQUEyQixLQUEzQixFQUFrQyxPQUFsQyxFQUEyQztBQUN4RDtBQUNBLFlBQVEsU0FBUyxFQUFqQjtBQUNBLGNBQVUsV0FBVyxFQUFyQjs7QUFFQSxXQUFPLEdBQVAsa0JBQ29ELGVBRHBELEVBQ3VFLEtBRHZFLEVBRVksT0FGWixFQUlnQixrQkFBa0IsTUFBbEIsR0FBMkIsT0FKM0M7QUFVSCxDQWZEOzs7Ozs7Ozs7OztBQ0ZBLElBQU0sTUFBTSxRQUFRLEtBQVIsQ0FBWjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsVUFBVSxJQUFWLEVBQWdCO0FBQzdCLFFBQUksS0FBSyxNQUFMLEdBQWMsQ0FBbEIsRUFBcUI7QUFDakIsWUFBSSxJQUFJLENBQVI7QUFDQSxlQUFPLEdBQVAsa0JBQWEsS0FBSyxHQUFMLENBQVMsVUFBQyxHQUFEO0FBQUEsbUJBQVMsR0FBVCxtQkFFZ0IsR0FGaEIsRUFFd0IsR0FGeEIsRUFHeUMsR0FIekM7QUFBQSxTQUFULENBQWI7QUFLSDtBQUNELFdBQU8sR0FBUDtBQUNILENBVkQ7Ozs7Ozs7Ozs7QUNGQSxJQUFNLE1BQU0sUUFBUSxLQUFSLENBQVo7QUFDQSxJQUFNLGlCQUFpQixRQUFRLDBCQUFSLENBQXZCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixZQUFZO0FBQ3pCLFdBQU8sR0FBUCxrQkFJTSxlQUFlLEtBQUssS0FBTCxDQUFXLElBQTFCLENBSk4sRUFNRSxnQkFORjs7QUFTQSxhQUFTLGNBQVQsR0FBMkI7QUFDdkIsZUFBTyxHQUFQO0FBcUJIO0FBQ0osQ0FqQ0Q7Ozs7O0FDSEEsSUFBTSxTQUFTLE9BQU8sR0FBUCxDQUFXLElBQVgsQ0FBZ0IsSUFBL0I7O0FBRUEsU0FBUyxjQUFULENBQXlCLEdBQXpCLEVBQThCO0FBQUE7O0FBQzFCLFNBQUssS0FBTCxHQUFhLElBQUksS0FBakI7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsSUFBSSxRQUFwQjtBQUNBLFNBQUssUUFBTCxHQUFnQixJQUFJLFFBQXBCOztBQUVBLFdBQU8sSUFBUCxDQUFZLElBQVosRUFBa0IsR0FBbEI7O0FBRUEsU0FBSyxLQUFMLENBQVcsV0FBWCxHQUF5QixJQUF6QixDQUE4QixZQUFNO0FBQ2hDLGNBQUssUUFBTDtBQUNILEtBRkQ7QUFHSDs7QUFFRCxlQUFlLFNBQWYsR0FBMkIsT0FBTyxDQUFQLENBQVMsTUFBVCxDQUFnQixFQUFoQixFQUN2QixPQUFPLFNBRGdCLEVBRXZCOztBQUVJLG1CQUFlLHVCQUFVLENBQVYsRUFBYTtBQUN4QixZQUFJLE1BQU0sT0FBTyxDQUFQLENBQVMsRUFBRSxNQUFYLEVBQW1CLElBQW5CLENBQXdCLEtBQXhCLEtBQWtDLE9BQU8sQ0FBUCxDQUFTLEVBQUUsTUFBWCxFQUFtQixNQUFuQixHQUE0QixJQUE1QixDQUFpQyxLQUFqQyxDQUE1QztBQUNBLGdCQUFRLEdBQVIsNkNBQXNELEdBQXREO0FBQ0EsYUFBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixHQUFsQjtBQUNBLGFBQUssUUFBTDtBQUNILEtBUEw7O0FBU0ksV0FBTyxpQkFBWTtBQUNmLGFBQUssV0FBTCxDQUFpQixhQUFqQixFQUFnQyxDQUFDLGVBQUQsRUFBa0IsMEJBQWxCLEVBQThDLHlCQUE5QyxDQUFoQztBQUNBLGFBQUssVUFBTCxDQUFnQixDQUNaLENBQUMsS0FBSyxjQUFOLEVBQXNCLE9BQXRCLEVBQStCLEtBQUssYUFBcEMsQ0FEWSxFQUVaLENBQUMsS0FBSyx1QkFBTixFQUErQixPQUEvQixFQUF3QyxLQUFLLGFBQTdDLENBRlksRUFHWixDQUFDLEtBQUssc0JBQU4sRUFBOEIsT0FBOUIsRUFBdUMsS0FBSyxhQUE1QyxDQUhZLENBQWhCO0FBS0gsS0FoQkw7O0FBa0JJLGNBQVUsb0JBQVk7QUFDbEIsYUFBSyxZQUFMO0FBQ0EsYUFBSyxTQUFMO0FBQ0EsYUFBSyxLQUFMO0FBQ0g7QUF0QkwsQ0FGdUIsQ0FBM0I7O0FBNEJBLE9BQU8sT0FBUCxHQUFpQixjQUFqQjs7Ozs7QUMxQ0EsSUFBTSxTQUFTLE9BQU8sR0FBUCxDQUFXLElBQVgsQ0FBZ0IsSUFBL0I7QUFDQSxJQUFNLGdCQUFnQixXQUF0QjtBQUNBLElBQU0sa0JBQWtCLGFBQXhCO0FBQ0EsSUFBTSxzQkFBc0Isa0JBQTVCO0FBQ0EsSUFBTSx5QkFBeUIsUUFBUSx1Q0FBUixDQUEvQjs7QUFFQSxTQUFTLFNBQVQsQ0FBb0IsR0FBcEIsRUFBeUI7QUFDckIsU0FBSyxLQUFMLEdBQWEsSUFBSSxLQUFqQjtBQUNBLFNBQUssUUFBTCxHQUFnQixJQUFJLFFBQXBCO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLElBQUksUUFBcEI7O0FBRUEsV0FBTyxJQUFQLENBQVksSUFBWixFQUFrQixHQUFsQjs7QUFFQTtBQUNBLFNBQUssS0FBTDtBQUNIOztBQUVELFVBQVUsU0FBVixHQUFzQixPQUFPLENBQVAsQ0FBUyxNQUFULENBQWdCLEVBQWhCLEVBQ2xCLE9BQU8sU0FEVyxFQUVsQjs7QUFFSSxpQkFBYSxxQkFBVSxDQUFWLEVBQWE7QUFDdEIsWUFBTSxZQUFZLE9BQU8sQ0FBUCxDQUFTLEVBQUUsTUFBWCxFQUFtQixJQUFuQixDQUF3QixNQUF4QixDQUFsQjtBQUNBLGFBQUssS0FBTCxDQUFXLFlBQVgsQ0FBd0IsU0FBeEI7O0FBRUE7QUFDQSxhQUFLLFdBQUw7QUFDSCxLQVJMOztBQVVJLGNBQVUsa0JBQVUsQ0FBVixFQUFhO0FBQ25CLFlBQUksQ0FBQyxLQUFLLElBQUwsQ0FBVSxRQUFWLENBQW1CLGVBQW5CLENBQUwsRUFBMEM7QUFDdEMsZ0JBQU0sTUFBTSxLQUFLLElBQUwsQ0FBVSxHQUFWLEVBQVo7QUFDQSxnQkFBSSxlQUFlLEtBQW5CO0FBQ0EsZ0JBQUksR0FBSixFQUFTO0FBQ0wsK0JBQWUsS0FBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixHQUFyQixDQUFmO0FBQ0g7O0FBRUQsZ0JBQUksWUFBSixFQUFrQjtBQUNkLHFCQUFLLFFBQUw7QUFDSCxhQUZELE1BRU87QUFDSCxxQkFBSyxpQkFBTDtBQUNIO0FBQ0o7QUFDSixLQXhCTDs7QUEwQkksdUJBQW1CLDZCQUFZO0FBQzNCLGFBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsYUFBbkI7QUFDQSxhQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLGFBQXhCO0FBQ0EsYUFBSyxJQUFMLENBQVUsUUFBVixDQUFtQixtQkFBbkI7QUFDSCxLQTlCTDs7QUFnQ0ksdUJBQW1CLDZCQUFZO0FBQzNCLGFBQUssSUFBTCxDQUFVLFdBQVYsQ0FBc0IsYUFBdEI7QUFDQSxhQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLGFBQXJCO0FBQ0EsYUFBSyxJQUFMLENBQVUsV0FBVixDQUFzQixtQkFBdEI7QUFDSCxLQXBDTDs7QUFzQ0ksd0JBQW9CLDRCQUFVLENBQVYsRUFBYTtBQUM3QixZQUFNLG1CQUFtQixLQUFLLElBQUwsQ0FBVSxRQUFWLENBQW1CLGVBQW5CLENBQXpCOztBQUVBLGFBQUssaUJBQUw7QUFDQSxZQUFJLEtBQUssSUFBTCxDQUFVLEdBQVYsTUFBbUIsZ0JBQXZCLEVBQXlDO0FBQ3JDLGlCQUFLLElBQUwsQ0FBVSxXQUFWLENBQXNCLGVBQXRCO0FBQ0gsU0FGRCxNQUVPLElBQUksQ0FBQyxLQUFLLElBQUwsQ0FBVSxHQUFWLEVBQUwsRUFBc0I7QUFDekIsaUJBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsZUFBbkI7QUFDSDs7QUFFRCxZQUFJLENBQUMsZ0JBQUQsSUFBcUIsRUFBRSxHQUFGLEtBQVUsT0FBbkMsRUFBNEM7QUFDeEM7QUFDQSxpQkFBSyxRQUFMO0FBQ0g7QUFDSixLQXBETDs7QUFzREksOEJBQTBCLGtDQUFVLENBQVYsRUFBYTtBQUNuQyxhQUFLLElBQUwsQ0FBVSxXQUFWLENBQXNCLGFBQXRCO0FBQ0EsYUFBSyxJQUFMLENBQVUsS0FBVjtBQUNBLGFBQUssSUFBTCxDQUFVLFdBQVYsQ0FBc0IsYUFBdEI7QUFDQSxhQUFLLFFBQUwsQ0FBYyxRQUFkLENBQXVCLGFBQXZCO0FBQ0EsVUFBRSxjQUFGO0FBQ0gsS0E1REw7O0FBOERJLFdBQU8saUJBQVk7QUFDZixhQUFLLFdBQUwsQ0FBaUIsZUFBakIsRUFBa0MsQ0FDOUIsUUFEOEIsRUFFOUIsS0FGOEIsRUFHOUIsT0FIOEIsRUFJOUIsVUFKOEIsRUFLOUIsV0FMOEIsRUFNOUIsV0FOOEIsRUFPOUIsS0FQOEIsQ0FBbEM7O0FBVUEsYUFBSyxVQUFMLENBQWdCLENBQ1osQ0FBQyxLQUFLLE9BQU4sRUFBZSxPQUFmLEVBQXdCLEtBQUssV0FBN0IsQ0FEWSxFQUVaLENBQUMsS0FBSyxJQUFOLEVBQVksT0FBWixFQUFxQixLQUFLLFFBQTFCLENBRlksRUFHWixDQUFDLEtBQUssUUFBTixFQUFnQixPQUFoQixFQUF5QixLQUFLLHdCQUE5QixDQUhZLEVBSVosQ0FBQyxLQUFLLElBQU4sRUFBWSxPQUFaLEVBQXFCLEtBQUssa0JBQTFCLENBSlk7QUFLWjtBQUNBLFNBQUMsS0FBSyxLQUFMLENBQVcsU0FBWixFQUF1QixrQkFBdkIsRUFBMkMsS0FBSyxRQUFoRCxDQU5ZLENBQWhCO0FBUUgsS0FqRkw7O0FBbUZJLGNBQVUsb0JBQVk7QUFDbEIsYUFBSyxZQUFMO0FBQ0EsYUFBSyxTQUFMO0FBQ0EsYUFBSyxLQUFMO0FBQ0gsS0F2Rkw7O0FBeUZJLGlCQUFhLHVCQUFZO0FBQ3JCLGFBQUssWUFBTDtBQUNBLGFBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQix1QkFBdUIsS0FBSyxLQUFMLENBQVcsSUFBbEMsQ0FBckI7QUFDQSxhQUFLLEtBQUw7QUFDSDtBQTdGTCxDQUZrQixDQUF0Qjs7QUFtR0EsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnZ2xvYmFsL2RvY3VtZW50JylcbnZhciBoeXBlcnggPSByZXF1aXJlKCdoeXBlcngnKVxudmFyIG9ubG9hZCA9IHJlcXVpcmUoJ29uLWxvYWQnKVxuXG52YXIgU1ZHTlMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnXG52YXIgWExJTktOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJ1xuXG52YXIgQk9PTF9QUk9QUyA9IHtcbiAgYXV0b2ZvY3VzOiAxLFxuICBjaGVja2VkOiAxLFxuICBkZWZhdWx0Y2hlY2tlZDogMSxcbiAgZGlzYWJsZWQ6IDEsXG4gIGZvcm1ub3ZhbGlkYXRlOiAxLFxuICBpbmRldGVybWluYXRlOiAxLFxuICByZWFkb25seTogMSxcbiAgcmVxdWlyZWQ6IDEsXG4gIHNlbGVjdGVkOiAxLFxuICB3aWxsdmFsaWRhdGU6IDFcbn1cbnZhciBDT01NRU5UX1RBRyA9ICchLS0nXG52YXIgU1ZHX1RBR1MgPSBbXG4gICdzdmcnLFxuICAnYWx0R2x5cGgnLCAnYWx0R2x5cGhEZWYnLCAnYWx0R2x5cGhJdGVtJywgJ2FuaW1hdGUnLCAnYW5pbWF0ZUNvbG9yJyxcbiAgJ2FuaW1hdGVNb3Rpb24nLCAnYW5pbWF0ZVRyYW5zZm9ybScsICdjaXJjbGUnLCAnY2xpcFBhdGgnLCAnY29sb3ItcHJvZmlsZScsXG4gICdjdXJzb3InLCAnZGVmcycsICdkZXNjJywgJ2VsbGlwc2UnLCAnZmVCbGVuZCcsICdmZUNvbG9yTWF0cml4JyxcbiAgJ2ZlQ29tcG9uZW50VHJhbnNmZXInLCAnZmVDb21wb3NpdGUnLCAnZmVDb252b2x2ZU1hdHJpeCcsICdmZURpZmZ1c2VMaWdodGluZycsXG4gICdmZURpc3BsYWNlbWVudE1hcCcsICdmZURpc3RhbnRMaWdodCcsICdmZUZsb29kJywgJ2ZlRnVuY0EnLCAnZmVGdW5jQicsXG4gICdmZUZ1bmNHJywgJ2ZlRnVuY1InLCAnZmVHYXVzc2lhbkJsdXInLCAnZmVJbWFnZScsICdmZU1lcmdlJywgJ2ZlTWVyZ2VOb2RlJyxcbiAgJ2ZlTW9ycGhvbG9neScsICdmZU9mZnNldCcsICdmZVBvaW50TGlnaHQnLCAnZmVTcGVjdWxhckxpZ2h0aW5nJyxcbiAgJ2ZlU3BvdExpZ2h0JywgJ2ZlVGlsZScsICdmZVR1cmJ1bGVuY2UnLCAnZmlsdGVyJywgJ2ZvbnQnLCAnZm9udC1mYWNlJyxcbiAgJ2ZvbnQtZmFjZS1mb3JtYXQnLCAnZm9udC1mYWNlLW5hbWUnLCAnZm9udC1mYWNlLXNyYycsICdmb250LWZhY2UtdXJpJyxcbiAgJ2ZvcmVpZ25PYmplY3QnLCAnZycsICdnbHlwaCcsICdnbHlwaFJlZicsICdoa2VybicsICdpbWFnZScsICdsaW5lJyxcbiAgJ2xpbmVhckdyYWRpZW50JywgJ21hcmtlcicsICdtYXNrJywgJ21ldGFkYXRhJywgJ21pc3NpbmctZ2x5cGgnLCAnbXBhdGgnLFxuICAncGF0aCcsICdwYXR0ZXJuJywgJ3BvbHlnb24nLCAncG9seWxpbmUnLCAncmFkaWFsR3JhZGllbnQnLCAncmVjdCcsXG4gICdzZXQnLCAnc3RvcCcsICdzd2l0Y2gnLCAnc3ltYm9sJywgJ3RleHQnLCAndGV4dFBhdGgnLCAndGl0bGUnLCAndHJlZicsXG4gICd0c3BhbicsICd1c2UnLCAndmlldycsICd2a2Vybidcbl1cblxuZnVuY3Rpb24gYmVsQ3JlYXRlRWxlbWVudCAodGFnLCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgdmFyIGVsXG5cbiAgLy8gSWYgYW4gc3ZnIHRhZywgaXQgbmVlZHMgYSBuYW1lc3BhY2VcbiAgaWYgKFNWR19UQUdTLmluZGV4T2YodGFnKSAhPT0gLTEpIHtcbiAgICBwcm9wcy5uYW1lc3BhY2UgPSBTVkdOU1xuICB9XG5cbiAgLy8gSWYgd2UgYXJlIHVzaW5nIGEgbmFtZXNwYWNlXG4gIHZhciBucyA9IGZhbHNlXG4gIGlmIChwcm9wcy5uYW1lc3BhY2UpIHtcbiAgICBucyA9IHByb3BzLm5hbWVzcGFjZVxuICAgIGRlbGV0ZSBwcm9wcy5uYW1lc3BhY2VcbiAgfVxuXG4gIC8vIENyZWF0ZSB0aGUgZWxlbWVudFxuICBpZiAobnMpIHtcbiAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgdGFnKVxuICB9IGVsc2UgaWYgKHRhZyA9PT0gQ09NTUVOVF9UQUcpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChwcm9wcy5jb21tZW50KVxuICB9IGVsc2Uge1xuICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpXG4gIH1cblxuICAvLyBJZiBhZGRpbmcgb25sb2FkIGV2ZW50c1xuICBpZiAocHJvcHMub25sb2FkIHx8IHByb3BzLm9udW5sb2FkKSB7XG4gICAgdmFyIGxvYWQgPSBwcm9wcy5vbmxvYWQgfHwgZnVuY3Rpb24gKCkge31cbiAgICB2YXIgdW5sb2FkID0gcHJvcHMub251bmxvYWQgfHwgZnVuY3Rpb24gKCkge31cbiAgICBvbmxvYWQoZWwsIGZ1bmN0aW9uIGJlbE9ubG9hZCAoKSB7XG4gICAgICBsb2FkKGVsKVxuICAgIH0sIGZ1bmN0aW9uIGJlbE9udW5sb2FkICgpIHtcbiAgICAgIHVubG9hZChlbClcbiAgICB9LFxuICAgIC8vIFdlIGhhdmUgdG8gdXNlIG5vbi1zdGFuZGFyZCBgY2FsbGVyYCB0byBmaW5kIHdobyBpbnZva2VzIGBiZWxDcmVhdGVFbGVtZW50YFxuICAgIGJlbENyZWF0ZUVsZW1lbnQuY2FsbGVyLmNhbGxlci5jYWxsZXIpXG4gICAgZGVsZXRlIHByb3BzLm9ubG9hZFxuICAgIGRlbGV0ZSBwcm9wcy5vbnVubG9hZFxuICB9XG5cbiAgLy8gQ3JlYXRlIHRoZSBwcm9wZXJ0aWVzXG4gIGZvciAodmFyIHAgaW4gcHJvcHMpIHtcbiAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgIHZhciBrZXkgPSBwLnRvTG93ZXJDYXNlKClcbiAgICAgIHZhciB2YWwgPSBwcm9wc1twXVxuICAgICAgLy8gTm9ybWFsaXplIGNsYXNzTmFtZVxuICAgICAgaWYgKGtleSA9PT0gJ2NsYXNzbmFtZScpIHtcbiAgICAgICAga2V5ID0gJ2NsYXNzJ1xuICAgICAgICBwID0gJ2NsYXNzJ1xuICAgICAgfVxuICAgICAgLy8gVGhlIGZvciBhdHRyaWJ1dGUgZ2V0cyB0cmFuc2Zvcm1lZCB0byBodG1sRm9yLCBidXQgd2UganVzdCBzZXQgYXMgZm9yXG4gICAgICBpZiAocCA9PT0gJ2h0bWxGb3InKSB7XG4gICAgICAgIHAgPSAnZm9yJ1xuICAgICAgfVxuICAgICAgLy8gSWYgYSBwcm9wZXJ0eSBpcyBib29sZWFuLCBzZXQgaXRzZWxmIHRvIHRoZSBrZXlcbiAgICAgIGlmIChCT09MX1BST1BTW2tleV0pIHtcbiAgICAgICAgaWYgKHZhbCA9PT0gJ3RydWUnKSB2YWwgPSBrZXlcbiAgICAgICAgZWxzZSBpZiAodmFsID09PSAnZmFsc2UnKSBjb250aW51ZVxuICAgICAgfVxuICAgICAgLy8gSWYgYSBwcm9wZXJ0eSBwcmVmZXJzIGJlaW5nIHNldCBkaXJlY3RseSB2cyBzZXRBdHRyaWJ1dGVcbiAgICAgIGlmIChrZXkuc2xpY2UoMCwgMikgPT09ICdvbicpIHtcbiAgICAgICAgZWxbcF0gPSB2YWxcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChucykge1xuICAgICAgICAgIGlmIChwID09PSAneGxpbms6aHJlZicpIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKFhMSU5LTlMsIHAsIHZhbClcbiAgICAgICAgICB9IGVsc2UgaWYgKC9eeG1sbnMoJHw6KS9pLnRlc3QocCkpIHtcbiAgICAgICAgICAgIC8vIHNraXAgeG1sbnMgZGVmaW5pdGlvbnNcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgcCwgdmFsKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUocCwgdmFsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYXBwZW5kQ2hpbGQgKGNoaWxkcykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShjaGlsZHMpKSByZXR1cm5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5vZGUgPSBjaGlsZHNbaV1cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKSB7XG4gICAgICAgIGFwcGVuZENoaWxkKG5vZGUpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fFxuICAgICAgICB0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJyB8fFxuICAgICAgICBub2RlIGluc3RhbmNlb2YgRGF0ZSB8fFxuICAgICAgICBub2RlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLnRvU3RyaW5nKClcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoZWwubGFzdENoaWxkICYmIGVsLmxhc3RDaGlsZC5ub2RlTmFtZSA9PT0gJyN0ZXh0Jykge1xuICAgICAgICAgIGVsLmxhc3RDaGlsZC5ub2RlVmFsdWUgKz0gbm9kZVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5vZGUpXG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlICYmIG5vZGUubm9kZVR5cGUpIHtcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQobm9kZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYXBwZW5kQ2hpbGQoY2hpbGRyZW4pXG5cbiAgcmV0dXJuIGVsXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHlwZXJ4KGJlbENyZWF0ZUVsZW1lbnQsIHtjb21tZW50czogdHJ1ZX0pXG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gbW9kdWxlLmV4cG9ydHNcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZUVsZW1lbnQgPSBiZWxDcmVhdGVFbGVtZW50XG4iLCIiLCJ2YXIgdG9wTGV2ZWwgPSB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB7fVxudmFyIG1pbkRvYyA9IHJlcXVpcmUoJ21pbi1kb2N1bWVudCcpO1xuXG52YXIgZG9jY3k7XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZG9jY3kgPSBkb2N1bWVudDtcbn0gZWxzZSB7XG4gICAgZG9jY3kgPSB0b3BMZXZlbFsnX19HTE9CQUxfRE9DVU1FTlRfQ0FDSEVANCddO1xuXG4gICAgaWYgKCFkb2NjeSkge1xuICAgICAgICBkb2NjeSA9IHRvcExldmVsWydfX0dMT0JBTF9ET0NVTUVOVF9DQUNIRUA0J10gPSBtaW5Eb2M7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvY2N5O1xuIiwidmFyIHdpbjtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW4gPSB3aW5kb3c7XG59IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW4gPSBnbG9iYWw7XG59IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICB3aW4gPSBzZWxmO1xufSBlbHNlIHtcbiAgICB3aW4gPSB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3aW47XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGF0dHJpYnV0ZVRvUHJvcGVydHlcblxudmFyIHRyYW5zZm9ybSA9IHtcbiAgJ2NsYXNzJzogJ2NsYXNzTmFtZScsXG4gICdmb3InOiAnaHRtbEZvcicsXG4gICdodHRwLWVxdWl2JzogJ2h0dHBFcXVpdidcbn1cblxuZnVuY3Rpb24gYXR0cmlidXRlVG9Qcm9wZXJ0eSAoaCkge1xuICByZXR1cm4gZnVuY3Rpb24gKHRhZ05hbWUsIGF0dHJzLCBjaGlsZHJlbikge1xuICAgIGZvciAodmFyIGF0dHIgaW4gYXR0cnMpIHtcbiAgICAgIGlmIChhdHRyIGluIHRyYW5zZm9ybSkge1xuICAgICAgICBhdHRyc1t0cmFuc2Zvcm1bYXR0cl1dID0gYXR0cnNbYXR0cl1cbiAgICAgICAgZGVsZXRlIGF0dHJzW2F0dHJdXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoKHRhZ05hbWUsIGF0dHJzLCBjaGlsZHJlbilcbiAgfVxufVxuIiwidmFyIGF0dHJUb1Byb3AgPSByZXF1aXJlKCdoeXBlcnNjcmlwdC1hdHRyaWJ1dGUtdG8tcHJvcGVydHknKVxuXG52YXIgVkFSID0gMCwgVEVYVCA9IDEsIE9QRU4gPSAyLCBDTE9TRSA9IDMsIEFUVFIgPSA0XG52YXIgQVRUUl9LRVkgPSA1LCBBVFRSX0tFWV9XID0gNlxudmFyIEFUVFJfVkFMVUVfVyA9IDcsIEFUVFJfVkFMVUUgPSA4XG52YXIgQVRUUl9WQUxVRV9TUSA9IDksIEFUVFJfVkFMVUVfRFEgPSAxMFxudmFyIEFUVFJfRVEgPSAxMSwgQVRUUl9CUkVBSyA9IDEyXG52YXIgQ09NTUVOVCA9IDEzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGgsIG9wdHMpIHtcbiAgaWYgKCFvcHRzKSBvcHRzID0ge31cbiAgdmFyIGNvbmNhdCA9IG9wdHMuY29uY2F0IHx8IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIFN0cmluZyhhKSArIFN0cmluZyhiKVxuICB9XG4gIGlmIChvcHRzLmF0dHJUb1Byb3AgIT09IGZhbHNlKSB7XG4gICAgaCA9IGF0dHJUb1Byb3AoaClcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoc3RyaW5ncykge1xuICAgIHZhciBzdGF0ZSA9IFRFWFQsIHJlZyA9ICcnXG4gICAgdmFyIGFyZ2xlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICB2YXIgcGFydHMgPSBbXVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaSA8IGFyZ2xlbiAtIDEpIHtcbiAgICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpKzFdXG4gICAgICAgIHZhciBwID0gcGFyc2Uoc3RyaW5nc1tpXSlcbiAgICAgICAgdmFyIHhzdGF0ZSA9IHN0YXRlXG4gICAgICAgIGlmICh4c3RhdGUgPT09IEFUVFJfVkFMVUVfRFEpIHhzdGF0ZSA9IEFUVFJfVkFMVUVcbiAgICAgICAgaWYgKHhzdGF0ZSA9PT0gQVRUUl9WQUxVRV9TUSkgeHN0YXRlID0gQVRUUl9WQUxVRVxuICAgICAgICBpZiAoeHN0YXRlID09PSBBVFRSX1ZBTFVFX1cpIHhzdGF0ZSA9IEFUVFJfVkFMVUVcbiAgICAgICAgaWYgKHhzdGF0ZSA9PT0gQVRUUikgeHN0YXRlID0gQVRUUl9LRVlcbiAgICAgICAgaWYgKHhzdGF0ZSA9PT0gT1BFTikge1xuICAgICAgICAgIGlmIChyZWcgPT09ICcvJykge1xuICAgICAgICAgICAgcC5wdXNoKFsgT1BFTiwgJy8nLCBhcmcgXSlcbiAgICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAucHVzaChbIE9QRU4sIGFyZyBdKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwLnB1c2goWyBWQVIsIHhzdGF0ZSwgYXJnIF0pXG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaC5hcHBseShwYXJ0cywgcClcbiAgICAgIH0gZWxzZSBwYXJ0cy5wdXNoLmFwcGx5KHBhcnRzLCBwYXJzZShzdHJpbmdzW2ldKSlcbiAgICB9XG5cbiAgICB2YXIgdHJlZSA9IFtudWxsLHt9LFtdXVxuICAgIHZhciBzdGFjayA9IFtbdHJlZSwtMV1dXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGN1ciA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXVswXVxuICAgICAgdmFyIHAgPSBwYXJ0c1tpXSwgcyA9IHBbMF1cbiAgICAgIGlmIChzID09PSBPUEVOICYmIC9eXFwvLy50ZXN0KHBbMV0pKSB7XG4gICAgICAgIHZhciBpeCA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXVsxXVxuICAgICAgICBpZiAoc3RhY2subGVuZ3RoID4gMSkge1xuICAgICAgICAgIHN0YWNrLnBvcCgpXG4gICAgICAgICAgc3RhY2tbc3RhY2subGVuZ3RoLTFdWzBdWzJdW2l4XSA9IGgoXG4gICAgICAgICAgICBjdXJbMF0sIGN1clsxXSwgY3VyWzJdLmxlbmd0aCA/IGN1clsyXSA6IHVuZGVmaW5lZFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzID09PSBPUEVOKSB7XG4gICAgICAgIHZhciBjID0gW3BbMV0se30sW11dXG4gICAgICAgIGN1clsyXS5wdXNoKGMpXG4gICAgICAgIHN0YWNrLnB1c2goW2MsY3VyWzJdLmxlbmd0aC0xXSlcbiAgICAgIH0gZWxzZSBpZiAocyA9PT0gQVRUUl9LRVkgfHwgKHMgPT09IFZBUiAmJiBwWzFdID09PSBBVFRSX0tFWSkpIHtcbiAgICAgICAgdmFyIGtleSA9ICcnXG4gICAgICAgIHZhciBjb3B5S2V5XG4gICAgICAgIGZvciAoOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAocGFydHNbaV1bMF0gPT09IEFUVFJfS0VZKSB7XG4gICAgICAgICAgICBrZXkgPSBjb25jYXQoa2V5LCBwYXJ0c1tpXVsxXSlcbiAgICAgICAgICB9IGVsc2UgaWYgKHBhcnRzW2ldWzBdID09PSBWQVIgJiYgcGFydHNbaV1bMV0gPT09IEFUVFJfS0VZKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHBhcnRzW2ldWzJdID09PSAnb2JqZWN0JyAmJiAha2V5KSB7XG4gICAgICAgICAgICAgIGZvciAoY29weUtleSBpbiBwYXJ0c1tpXVsyXSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0c1tpXVsyXS5oYXNPd25Qcm9wZXJ0eShjb3B5S2V5KSAmJiAhY3VyWzFdW2NvcHlLZXldKSB7XG4gICAgICAgICAgICAgICAgICBjdXJbMV1bY29weUtleV0gPSBwYXJ0c1tpXVsyXVtjb3B5S2V5XVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAga2V5ID0gY29uY2F0KGtleSwgcGFydHNbaV1bMl0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnRzW2ldWzBdID09PSBBVFRSX0VRKSBpKytcbiAgICAgICAgdmFyIGogPSBpXG4gICAgICAgIGZvciAoOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAocGFydHNbaV1bMF0gPT09IEFUVFJfVkFMVUUgfHwgcGFydHNbaV1bMF0gPT09IEFUVFJfS0VZKSB7XG4gICAgICAgICAgICBpZiAoIWN1clsxXVtrZXldKSBjdXJbMV1ba2V5XSA9IHN0cmZuKHBhcnRzW2ldWzFdKVxuICAgICAgICAgICAgZWxzZSBwYXJ0c1tpXVsxXT09PVwiXCIgfHwgKGN1clsxXVtrZXldID0gY29uY2F0KGN1clsxXVtrZXldLCBwYXJ0c1tpXVsxXSkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocGFydHNbaV1bMF0gPT09IFZBUlxuICAgICAgICAgICYmIChwYXJ0c1tpXVsxXSA9PT0gQVRUUl9WQUxVRSB8fCBwYXJ0c1tpXVsxXSA9PT0gQVRUUl9LRVkpKSB7XG4gICAgICAgICAgICBpZiAoIWN1clsxXVtrZXldKSBjdXJbMV1ba2V5XSA9IHN0cmZuKHBhcnRzW2ldWzJdKVxuICAgICAgICAgICAgZWxzZSBwYXJ0c1tpXVsyXT09PVwiXCIgfHwgKGN1clsxXVtrZXldID0gY29uY2F0KGN1clsxXVtrZXldLCBwYXJ0c1tpXVsyXSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoa2V5Lmxlbmd0aCAmJiAhY3VyWzFdW2tleV0gJiYgaSA9PT0galxuICAgICAgICAgICAgJiYgKHBhcnRzW2ldWzBdID09PSBDTE9TRSB8fCBwYXJ0c1tpXVswXSA9PT0gQVRUUl9CUkVBSykpIHtcbiAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5mcmFzdHJ1Y3R1cmUuaHRtbCNib29sZWFuLWF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgLy8gZW1wdHkgc3RyaW5nIGlzIGZhbHN5LCBub3Qgd2VsbCBiZWhhdmVkIHZhbHVlIGluIGJyb3dzZXJcbiAgICAgICAgICAgICAgY3VyWzFdW2tleV0gPSBrZXkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcnRzW2ldWzBdID09PSBDTE9TRSkge1xuICAgICAgICAgICAgICBpLS1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHMgPT09IEFUVFJfS0VZKSB7XG4gICAgICAgIGN1clsxXVtwWzFdXSA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAocyA9PT0gVkFSICYmIHBbMV0gPT09IEFUVFJfS0VZKSB7XG4gICAgICAgIGN1clsxXVtwWzJdXSA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAocyA9PT0gQ0xPU0UpIHtcbiAgICAgICAgaWYgKHNlbGZDbG9zaW5nKGN1clswXSkgJiYgc3RhY2subGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIGl4ID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdWzFdXG4gICAgICAgICAgc3RhY2sucG9wKClcbiAgICAgICAgICBzdGFja1tzdGFjay5sZW5ndGgtMV1bMF1bMl1baXhdID0gaChcbiAgICAgICAgICAgIGN1clswXSwgY3VyWzFdLCBjdXJbMl0ubGVuZ3RoID8gY3VyWzJdIDogdW5kZWZpbmVkXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHMgPT09IFZBUiAmJiBwWzFdID09PSBURVhUKSB7XG4gICAgICAgIGlmIChwWzJdID09PSB1bmRlZmluZWQgfHwgcFsyXSA9PT0gbnVsbCkgcFsyXSA9ICcnXG4gICAgICAgIGVsc2UgaWYgKCFwWzJdKSBwWzJdID0gY29uY2F0KCcnLCBwWzJdKVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwWzJdWzBdKSkge1xuICAgICAgICAgIGN1clsyXS5wdXNoLmFwcGx5KGN1clsyXSwgcFsyXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXJbMl0ucHVzaChwWzJdKVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHMgPT09IFRFWFQpIHtcbiAgICAgICAgY3VyWzJdLnB1c2gocFsxXSlcbiAgICAgIH0gZWxzZSBpZiAocyA9PT0gQVRUUl9FUSB8fCBzID09PSBBVFRSX0JSRUFLKSB7XG4gICAgICAgIC8vIG5vLW9wXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuaGFuZGxlZDogJyArIHMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRyZWVbMl0ubGVuZ3RoID4gMSAmJiAvXlxccyokLy50ZXN0KHRyZWVbMl1bMF0pKSB7XG4gICAgICB0cmVlWzJdLnNoaWZ0KClcbiAgICB9XG5cbiAgICBpZiAodHJlZVsyXS5sZW5ndGggPiAyXG4gICAgfHwgKHRyZWVbMl0ubGVuZ3RoID09PSAyICYmIC9cXFMvLnRlc3QodHJlZVsyXVsxXSkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdtdWx0aXBsZSByb290IGVsZW1lbnRzIG11c3QgYmUgd3JhcHBlZCBpbiBhbiBlbmNsb3NpbmcgdGFnJ1xuICAgICAgKVxuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0cmVlWzJdWzBdKSAmJiB0eXBlb2YgdHJlZVsyXVswXVswXSA9PT0gJ3N0cmluZydcbiAgICAmJiBBcnJheS5pc0FycmF5KHRyZWVbMl1bMF1bMl0pKSB7XG4gICAgICB0cmVlWzJdWzBdID0gaCh0cmVlWzJdWzBdWzBdLCB0cmVlWzJdWzBdWzFdLCB0cmVlWzJdWzBdWzJdKVxuICAgIH1cbiAgICByZXR1cm4gdHJlZVsyXVswXVxuXG4gICAgZnVuY3Rpb24gcGFyc2UgKHN0cikge1xuICAgICAgdmFyIHJlcyA9IFtdXG4gICAgICBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUVfVykgc3RhdGUgPSBBVFRSXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQXQoaSlcbiAgICAgICAgaWYgKHN0YXRlID09PSBURVhUICYmIGMgPT09ICc8Jykge1xuICAgICAgICAgIGlmIChyZWcubGVuZ3RoKSByZXMucHVzaChbVEVYVCwgcmVnXSlcbiAgICAgICAgICByZWcgPSAnJ1xuICAgICAgICAgIHN0YXRlID0gT1BFTlxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICc+JyAmJiAhcXVvdChzdGF0ZSkgJiYgc3RhdGUgIT09IENPTU1FTlQpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IE9QRU4gJiYgcmVnLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzLnB1c2goW09QRU4scmVnXSlcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX0tFWSkge1xuICAgICAgICAgICAgcmVzLnB1c2goW0FUVFJfS0VZLHJlZ10pXG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRSAmJiByZWcubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXMucHVzaChbQVRUUl9WQUxVRSxyZWddKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXMucHVzaChbQ0xPU0VdKVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBURVhUXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IENPTU1FTlQgJiYgLy0kLy50ZXN0KHJlZykgJiYgYyA9PT0gJy0nKSB7XG4gICAgICAgICAgaWYgKG9wdHMuY29tbWVudHMpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX1ZBTFVFLHJlZy5zdWJzdHIoMCwgcmVnLmxlbmd0aCAtIDEpXSxbQ0xPU0VdKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZWcgPSAnJ1xuICAgICAgICAgIHN0YXRlID0gVEVYVFxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBPUEVOICYmIC9eIS0tJC8udGVzdChyZWcpKSB7XG4gICAgICAgICAgaWYgKG9wdHMuY29tbWVudHMpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKFtPUEVOLCByZWddLFtBVFRSX0tFWSwnY29tbWVudCddLFtBVFRSX0VRXSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVnID0gY1xuICAgICAgICAgIHN0YXRlID0gQ09NTUVOVFxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBURVhUIHx8IHN0YXRlID09PSBDT01NRU5UKSB7XG4gICAgICAgICAgcmVnICs9IGNcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gT1BFTiAmJiBjID09PSAnLycgJiYgcmVnLmxlbmd0aCkge1xuICAgICAgICAgIC8vIG5vLW9wLCBzZWxmIGNsb3NpbmcgdGFnIHdpdGhvdXQgYSBzcGFjZSA8YnIvPlxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBPUEVOICYmIC9cXHMvLnRlc3QoYykpIHtcbiAgICAgICAgICBpZiAocmVnLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzLnB1c2goW09QRU4sIHJlZ10pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBBVFRSXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IE9QRU4pIHtcbiAgICAgICAgICByZWcgKz0gY1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSICYmIC9bXlxcc1wiJz0vXS8udGVzdChjKSkge1xuICAgICAgICAgIHN0YXRlID0gQVRUUl9LRVlcbiAgICAgICAgICByZWcgPSBjXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFIgJiYgL1xccy8udGVzdChjKSkge1xuICAgICAgICAgIGlmIChyZWcubGVuZ3RoKSByZXMucHVzaChbQVRUUl9LRVkscmVnXSlcbiAgICAgICAgICByZXMucHVzaChbQVRUUl9CUkVBS10pXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfS0VZICYmIC9cXHMvLnRlc3QoYykpIHtcbiAgICAgICAgICByZXMucHVzaChbQVRUUl9LRVkscmVnXSlcbiAgICAgICAgICByZWcgPSAnJ1xuICAgICAgICAgIHN0YXRlID0gQVRUUl9LRVlfV1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX0tFWSAmJiBjID09PSAnPScpIHtcbiAgICAgICAgICByZXMucHVzaChbQVRUUl9LRVkscmVnXSxbQVRUUl9FUV0pXG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJfVkFMVUVfV1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX0tFWSkge1xuICAgICAgICAgIHJlZyArPSBjXG4gICAgICAgIH0gZWxzZSBpZiAoKHN0YXRlID09PSBBVFRSX0tFWV9XIHx8IHN0YXRlID09PSBBVFRSKSAmJiBjID09PSAnPScpIHtcbiAgICAgICAgICByZXMucHVzaChbQVRUUl9FUV0pXG4gICAgICAgICAgc3RhdGUgPSBBVFRSX1ZBTFVFX1dcbiAgICAgICAgfSBlbHNlIGlmICgoc3RhdGUgPT09IEFUVFJfS0VZX1cgfHwgc3RhdGUgPT09IEFUVFIpICYmICEvXFxzLy50ZXN0KGMpKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfQlJFQUtdKVxuICAgICAgICAgIGlmICgvW1xcdy1dLy50ZXN0KGMpKSB7XG4gICAgICAgICAgICByZWcgKz0gY1xuICAgICAgICAgICAgc3RhdGUgPSBBVFRSX0tFWVxuICAgICAgICAgIH0gZWxzZSBzdGF0ZSA9IEFUVFJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRV9XICYmIGMgPT09ICdcIicpIHtcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJfVkFMVUVfRFFcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRV9XICYmIGMgPT09IFwiJ1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBBVFRSX1ZBTFVFX1NRXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUVfRFEgJiYgYyA9PT0gJ1wiJykge1xuICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX1ZBTFVFLHJlZ10sW0FUVFJfQlJFQUtdKVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBBVFRSXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUVfU1EgJiYgYyA9PT0gXCInXCIpIHtcbiAgICAgICAgICByZXMucHVzaChbQVRUUl9WQUxVRSxyZWddLFtBVFRSX0JSRUFLXSlcbiAgICAgICAgICByZWcgPSAnJ1xuICAgICAgICAgIHN0YXRlID0gQVRUUlxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX1cgJiYgIS9cXHMvLnRlc3QoYykpIHtcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJfVkFMVUVcbiAgICAgICAgICBpLS1cbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRSAmJiAvXFxzLy50ZXN0KGMpKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfVkFMVUUscmVnXSxbQVRUUl9CUkVBS10pXG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRSB8fCBzdGF0ZSA9PT0gQVRUUl9WQUxVRV9TUVxuICAgICAgICB8fCBzdGF0ZSA9PT0gQVRUUl9WQUxVRV9EUSkge1xuICAgICAgICAgIHJlZyArPSBjXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdGF0ZSA9PT0gVEVYVCAmJiByZWcubGVuZ3RoKSB7XG4gICAgICAgIHJlcy5wdXNoKFtURVhULHJlZ10pXG4gICAgICAgIHJlZyA9ICcnXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFICYmIHJlZy5sZW5ndGgpIHtcbiAgICAgICAgcmVzLnB1c2goW0FUVFJfVkFMVUUscmVnXSlcbiAgICAgICAgcmVnID0gJydcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUVfRFEgJiYgcmVnLmxlbmd0aCkge1xuICAgICAgICByZXMucHVzaChbQVRUUl9WQUxVRSxyZWddKVxuICAgICAgICByZWcgPSAnJ1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRV9TUSAmJiByZWcubGVuZ3RoKSB7XG4gICAgICAgIHJlcy5wdXNoKFtBVFRSX1ZBTFVFLHJlZ10pXG4gICAgICAgIHJlZyA9ICcnXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX0tFWSkge1xuICAgICAgICByZXMucHVzaChbQVRUUl9LRVkscmVnXSlcbiAgICAgICAgcmVnID0gJydcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdHJmbiAoeCkge1xuICAgIGlmICh0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHhcbiAgICBlbHNlIGlmICh0eXBlb2YgeCA9PT0gJ3N0cmluZycpIHJldHVybiB4XG4gICAgZWxzZSBpZiAoeCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcpIHJldHVybiB4XG4gICAgZWxzZSByZXR1cm4gY29uY2F0KCcnLCB4KVxuICB9XG59XG5cbmZ1bmN0aW9uIHF1b3QgKHN0YXRlKSB7XG4gIHJldHVybiBzdGF0ZSA9PT0gQVRUUl9WQUxVRV9TUSB8fCBzdGF0ZSA9PT0gQVRUUl9WQUxVRV9EUVxufVxuXG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuZnVuY3Rpb24gaGFzIChvYmosIGtleSkgeyByZXR1cm4gaGFzT3duLmNhbGwob2JqLCBrZXkpIH1cblxudmFyIGNsb3NlUkUgPSBSZWdFeHAoJ14oJyArIFtcbiAgJ2FyZWEnLCAnYmFzZScsICdiYXNlZm9udCcsICdiZ3NvdW5kJywgJ2JyJywgJ2NvbCcsICdjb21tYW5kJywgJ2VtYmVkJyxcbiAgJ2ZyYW1lJywgJ2hyJywgJ2ltZycsICdpbnB1dCcsICdpc2luZGV4JywgJ2tleWdlbicsICdsaW5rJywgJ21ldGEnLCAncGFyYW0nLFxuICAnc291cmNlJywgJ3RyYWNrJywgJ3dicicsICchLS0nLFxuICAvLyBTVkcgVEFHU1xuICAnYW5pbWF0ZScsICdhbmltYXRlVHJhbnNmb3JtJywgJ2NpcmNsZScsICdjdXJzb3InLCAnZGVzYycsICdlbGxpcHNlJyxcbiAgJ2ZlQmxlbmQnLCAnZmVDb2xvck1hdHJpeCcsICdmZUNvbXBvc2l0ZScsXG4gICdmZUNvbnZvbHZlTWF0cml4JywgJ2ZlRGlmZnVzZUxpZ2h0aW5nJywgJ2ZlRGlzcGxhY2VtZW50TWFwJyxcbiAgJ2ZlRGlzdGFudExpZ2h0JywgJ2ZlRmxvb2QnLCAnZmVGdW5jQScsICdmZUZ1bmNCJywgJ2ZlRnVuY0cnLCAnZmVGdW5jUicsXG4gICdmZUdhdXNzaWFuQmx1cicsICdmZUltYWdlJywgJ2ZlTWVyZ2VOb2RlJywgJ2ZlTW9ycGhvbG9neScsXG4gICdmZU9mZnNldCcsICdmZVBvaW50TGlnaHQnLCAnZmVTcGVjdWxhckxpZ2h0aW5nJywgJ2ZlU3BvdExpZ2h0JywgJ2ZlVGlsZScsXG4gICdmZVR1cmJ1bGVuY2UnLCAnZm9udC1mYWNlLWZvcm1hdCcsICdmb250LWZhY2UtbmFtZScsICdmb250LWZhY2UtdXJpJyxcbiAgJ2dseXBoJywgJ2dseXBoUmVmJywgJ2hrZXJuJywgJ2ltYWdlJywgJ2xpbmUnLCAnbWlzc2luZy1nbHlwaCcsICdtcGF0aCcsXG4gICdwYXRoJywgJ3BvbHlnb24nLCAncG9seWxpbmUnLCAncmVjdCcsICdzZXQnLCAnc3RvcCcsICd0cmVmJywgJ3VzZScsICd2aWV3JyxcbiAgJ3ZrZXJuJ1xuXS5qb2luKCd8JykgKyAnKSg/OltcXC4jXVthLXpBLVowLTlcXHUwMDdGLVxcdUZGRkZfOi1dKykqJCcpXG5mdW5jdGlvbiBzZWxmQ2xvc2luZyAodGFnKSB7IHJldHVybiBjbG9zZVJFLnRlc3QodGFnKSB9XG4iLCJhc3NlcnQubm90RXF1YWwgPSBub3RFcXVhbFxuYXNzZXJ0Lm5vdE9rID0gbm90T2tcbmFzc2VydC5lcXVhbCA9IGVxdWFsXG5hc3NlcnQub2sgPSBhc3NlcnRcblxubW9kdWxlLmV4cG9ydHMgPSBhc3NlcnRcblxuZnVuY3Rpb24gZXF1YWwgKGEsIGIsIG0pIHtcbiAgYXNzZXJ0KGEgPT0gYiwgbSkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbn1cblxuZnVuY3Rpb24gbm90RXF1YWwgKGEsIGIsIG0pIHtcbiAgYXNzZXJ0KGEgIT0gYiwgbSkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbn1cblxuZnVuY3Rpb24gbm90T2sgKHQsIG0pIHtcbiAgYXNzZXJ0KCF0LCBtKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHQsIG0pIHtcbiAgaWYgKCF0KSB0aHJvdyBuZXcgRXJyb3IobSB8fCAnQXNzZXJ0aW9uRXJyb3InKVxufVxuIiwiLyogZ2xvYmFsIE11dGF0aW9uT2JzZXJ2ZXIgKi9cbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJ2dsb2JhbC9kb2N1bWVudCcpXG52YXIgd2luZG93ID0gcmVxdWlyZSgnZ2xvYmFsL3dpbmRvdycpXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0JylcbnZhciB3YXRjaCA9IE9iamVjdC5jcmVhdGUobnVsbClcbnZhciBLRVlfSUQgPSAnb25sb2FkaWQnICsgKG5ldyBEYXRlKCkgJSA5ZTYpLnRvU3RyaW5nKDM2KVxudmFyIEtFWV9BVFRSID0gJ2RhdGEtJyArIEtFWV9JRFxudmFyIElOREVYID0gMFxuXG5pZiAod2luZG93ICYmIHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyKSB7XG4gIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICBpZiAoT2JqZWN0LmtleXMod2F0Y2gpLmxlbmd0aCA8IDEpIHJldHVyblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXV0YXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobXV0YXRpb25zW2ldLmF0dHJpYnV0ZU5hbWUgPT09IEtFWV9BVFRSKSB7XG4gICAgICAgIGVhY2hBdHRyKG11dGF0aW9uc1tpXSwgdHVybm9uLCB0dXJub2ZmKVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgZWFjaE11dGF0aW9uKG11dGF0aW9uc1tpXS5yZW1vdmVkTm9kZXMsIHR1cm5vZmYpXG4gICAgICBlYWNoTXV0YXRpb24obXV0YXRpb25zW2ldLmFkZGVkTm9kZXMsIHR1cm5vbilcbiAgICB9XG4gIH0pXG4gIGlmIChkb2N1bWVudC5ib2R5KSB7XG4gICAgYmVnaW5PYnNlcnZlKG9ic2VydmVyKVxuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGJlZ2luT2JzZXJ2ZShvYnNlcnZlcilcbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGJlZ2luT2JzZXJ2ZSAob2JzZXJ2ZXIpIHtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgIGF0dHJpYnV0ZU9sZFZhbHVlOiB0cnVlLFxuICAgIGF0dHJpYnV0ZUZpbHRlcjogW0tFWV9BVFRSXVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9ubG9hZCAoZWwsIG9uLCBvZmYsIGNhbGxlcikge1xuICBhc3NlcnQoZG9jdW1lbnQuYm9keSwgJ29uLWxvYWQ6IHdpbGwgbm90IHdvcmsgcHJpb3IgdG8gRE9NQ29udGVudExvYWRlZCcpXG4gIG9uID0gb24gfHwgZnVuY3Rpb24gKCkge31cbiAgb2ZmID0gb2ZmIHx8IGZ1bmN0aW9uICgpIHt9XG4gIGVsLnNldEF0dHJpYnV0ZShLRVlfQVRUUiwgJ28nICsgSU5ERVgpXG4gIHdhdGNoWydvJyArIElOREVYXSA9IFtvbiwgb2ZmLCAwLCBjYWxsZXIgfHwgb25sb2FkLmNhbGxlcl1cbiAgSU5ERVggKz0gMVxuICByZXR1cm4gZWxcbn1cblxubW9kdWxlLmV4cG9ydHMuS0VZX0FUVFIgPSBLRVlfQVRUUlxubW9kdWxlLmV4cG9ydHMuS0VZX0lEID0gS0VZX0lEXG5cbmZ1bmN0aW9uIHR1cm5vbiAoaW5kZXgsIGVsKSB7XG4gIGlmICh3YXRjaFtpbmRleF1bMF0gJiYgd2F0Y2hbaW5kZXhdWzJdID09PSAwKSB7XG4gICAgd2F0Y2hbaW5kZXhdWzBdKGVsKVxuICAgIHdhdGNoW2luZGV4XVsyXSA9IDFcbiAgfVxufVxuXG5mdW5jdGlvbiB0dXJub2ZmIChpbmRleCwgZWwpIHtcbiAgaWYgKHdhdGNoW2luZGV4XVsxXSAmJiB3YXRjaFtpbmRleF1bMl0gPT09IDEpIHtcbiAgICB3YXRjaFtpbmRleF1bMV0oZWwpXG4gICAgd2F0Y2hbaW5kZXhdWzJdID0gMFxuICB9XG59XG5cbmZ1bmN0aW9uIGVhY2hBdHRyIChtdXRhdGlvbiwgb24sIG9mZikge1xuICB2YXIgbmV3VmFsdWUgPSBtdXRhdGlvbi50YXJnZXQuZ2V0QXR0cmlidXRlKEtFWV9BVFRSKVxuICBpZiAoc2FtZU9yaWdpbihtdXRhdGlvbi5vbGRWYWx1ZSwgbmV3VmFsdWUpKSB7XG4gICAgd2F0Y2hbbmV3VmFsdWVdID0gd2F0Y2hbbXV0YXRpb24ub2xkVmFsdWVdXG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKHdhdGNoW211dGF0aW9uLm9sZFZhbHVlXSkge1xuICAgIG9mZihtdXRhdGlvbi5vbGRWYWx1ZSwgbXV0YXRpb24udGFyZ2V0KVxuICB9XG4gIGlmICh3YXRjaFtuZXdWYWx1ZV0pIHtcbiAgICBvbihuZXdWYWx1ZSwgbXV0YXRpb24udGFyZ2V0KVxuICB9XG59XG5cbmZ1bmN0aW9uIHNhbWVPcmlnaW4gKG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICBpZiAoIW9sZFZhbHVlIHx8ICFuZXdWYWx1ZSkgcmV0dXJuIGZhbHNlXG4gIHJldHVybiB3YXRjaFtvbGRWYWx1ZV1bM10gPT09IHdhdGNoW25ld1ZhbHVlXVszXVxufVxuXG5mdW5jdGlvbiBlYWNoTXV0YXRpb24gKG5vZGVzLCBmbikge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHdhdGNoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG5vZGVzW2ldICYmIG5vZGVzW2ldLmdldEF0dHJpYnV0ZSAmJiBub2Rlc1tpXS5nZXRBdHRyaWJ1dGUoS0VZX0FUVFIpKSB7XG4gICAgICB2YXIgb25sb2FkaWQgPSBub2Rlc1tpXS5nZXRBdHRyaWJ1dGUoS0VZX0FUVFIpXG4gICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKG9ubG9hZGlkID09PSBrKSB7XG4gICAgICAgICAgZm4oaywgbm9kZXNbaV0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIGlmIChub2Rlc1tpXS5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGVhY2hNdXRhdGlvbihub2Rlc1tpXS5jaGlsZE5vZGVzLCBmbilcbiAgICB9XG4gIH1cbn1cbiIsIi8qISBodHRwczovL210aHMuYmUvcHVueWNvZGUgdjEuNC4xIGJ5IEBtYXRoaWFzICovXG47KGZ1bmN0aW9uKHJvb3QpIHtcblxuXHQvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGVzICovXG5cdHZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiZcblx0XHQhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXHR2YXIgZnJlZU1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmXG5cdFx0IW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cdHZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWw7XG5cdGlmIChcblx0XHRmcmVlR2xvYmFsLmdsb2JhbCA9PT0gZnJlZUdsb2JhbCB8fFxuXHRcdGZyZWVHbG9iYWwud2luZG93ID09PSBmcmVlR2xvYmFsIHx8XG5cdFx0ZnJlZUdsb2JhbC5zZWxmID09PSBmcmVlR2xvYmFsXG5cdCkge1xuXHRcdHJvb3QgPSBmcmVlR2xvYmFsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBgcHVueWNvZGVgIG9iamVjdC5cblx0ICogQG5hbWUgcHVueWNvZGVcblx0ICogQHR5cGUgT2JqZWN0XG5cdCAqL1xuXHR2YXIgcHVueWNvZGUsXG5cblx0LyoqIEhpZ2hlc3QgcG9zaXRpdmUgc2lnbmVkIDMyLWJpdCBmbG9hdCB2YWx1ZSAqL1xuXHRtYXhJbnQgPSAyMTQ3NDgzNjQ3LCAvLyBha2EuIDB4N0ZGRkZGRkYgb3IgMl4zMS0xXG5cblx0LyoqIEJvb3RzdHJpbmcgcGFyYW1ldGVycyAqL1xuXHRiYXNlID0gMzYsXG5cdHRNaW4gPSAxLFxuXHR0TWF4ID0gMjYsXG5cdHNrZXcgPSAzOCxcblx0ZGFtcCA9IDcwMCxcblx0aW5pdGlhbEJpYXMgPSA3Mixcblx0aW5pdGlhbE4gPSAxMjgsIC8vIDB4ODBcblx0ZGVsaW1pdGVyID0gJy0nLCAvLyAnXFx4MkQnXG5cblx0LyoqIFJlZ3VsYXIgZXhwcmVzc2lvbnMgKi9cblx0cmVnZXhQdW55Y29kZSA9IC9eeG4tLS8sXG5cdHJlZ2V4Tm9uQVNDSUkgPSAvW15cXHgyMC1cXHg3RV0vLCAvLyB1bnByaW50YWJsZSBBU0NJSSBjaGFycyArIG5vbi1BU0NJSSBjaGFyc1xuXHRyZWdleFNlcGFyYXRvcnMgPSAvW1xceDJFXFx1MzAwMlxcdUZGMEVcXHVGRjYxXS9nLCAvLyBSRkMgMzQ5MCBzZXBhcmF0b3JzXG5cblx0LyoqIEVycm9yIG1lc3NhZ2VzICovXG5cdGVycm9ycyA9IHtcblx0XHQnb3ZlcmZsb3cnOiAnT3ZlcmZsb3c6IGlucHV0IG5lZWRzIHdpZGVyIGludGVnZXJzIHRvIHByb2Nlc3MnLFxuXHRcdCdub3QtYmFzaWMnOiAnSWxsZWdhbCBpbnB1dCA+PSAweDgwIChub3QgYSBiYXNpYyBjb2RlIHBvaW50KScsXG5cdFx0J2ludmFsaWQtaW5wdXQnOiAnSW52YWxpZCBpbnB1dCdcblx0fSxcblxuXHQvKiogQ29udmVuaWVuY2Ugc2hvcnRjdXRzICovXG5cdGJhc2VNaW51c1RNaW4gPSBiYXNlIC0gdE1pbixcblx0Zmxvb3IgPSBNYXRoLmZsb29yLFxuXHRzdHJpbmdGcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLFxuXG5cdC8qKiBUZW1wb3JhcnkgdmFyaWFibGUgKi9cblx0a2V5O1xuXG5cdC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cdC8qKlxuXHQgKiBBIGdlbmVyaWMgZXJyb3IgdXRpbGl0eSBmdW5jdGlvbi5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVGhlIGVycm9yIHR5cGUuXG5cdCAqIEByZXR1cm5zIHtFcnJvcn0gVGhyb3dzIGEgYFJhbmdlRXJyb3JgIHdpdGggdGhlIGFwcGxpY2FibGUgZXJyb3IgbWVzc2FnZS5cblx0ICovXG5cdGZ1bmN0aW9uIGVycm9yKHR5cGUpIHtcblx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcihlcnJvcnNbdHlwZV0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgZ2VuZXJpYyBgQXJyYXkjbWFwYCB1dGlsaXR5IGZ1bmN0aW9uLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCBmb3IgZXZlcnkgYXJyYXlcblx0ICogaXRlbS5cblx0ICogQHJldHVybnMge0FycmF5fSBBIG5ldyBhcnJheSBvZiB2YWx1ZXMgcmV0dXJuZWQgYnkgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gbWFwKGFycmF5LCBmbikge1xuXHRcdHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xuXHRcdHdoaWxlIChsZW5ndGgtLSkge1xuXHRcdFx0cmVzdWx0W2xlbmd0aF0gPSBmbihhcnJheVtsZW5ndGhdKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIHNpbXBsZSBgQXJyYXkjbWFwYC1saWtlIHdyYXBwZXIgdG8gd29yayB3aXRoIGRvbWFpbiBuYW1lIHN0cmluZ3Mgb3IgZW1haWxcblx0ICogYWRkcmVzc2VzLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZG9tYWluIFRoZSBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCBmb3IgZXZlcnlcblx0ICogY2hhcmFjdGVyLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IEEgbmV3IHN0cmluZyBvZiBjaGFyYWN0ZXJzIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFja1xuXHQgKiBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIG1hcERvbWFpbihzdHJpbmcsIGZuKSB7XG5cdFx0dmFyIHBhcnRzID0gc3RyaW5nLnNwbGl0KCdAJyk7XG5cdFx0dmFyIHJlc3VsdCA9ICcnO1xuXHRcdGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG5cdFx0XHQvLyBJbiBlbWFpbCBhZGRyZXNzZXMsIG9ubHkgdGhlIGRvbWFpbiBuYW1lIHNob3VsZCBiZSBwdW55Y29kZWQuIExlYXZlXG5cdFx0XHQvLyB0aGUgbG9jYWwgcGFydCAoaS5lLiBldmVyeXRoaW5nIHVwIHRvIGBAYCkgaW50YWN0LlxuXHRcdFx0cmVzdWx0ID0gcGFydHNbMF0gKyAnQCc7XG5cdFx0XHRzdHJpbmcgPSBwYXJ0c1sxXTtcblx0XHR9XG5cdFx0Ly8gQXZvaWQgYHNwbGl0KHJlZ2V4KWAgZm9yIElFOCBjb21wYXRpYmlsaXR5LiBTZWUgIzE3LlxuXHRcdHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKHJlZ2V4U2VwYXJhdG9ycywgJ1xceDJFJyk7XG5cdFx0dmFyIGxhYmVscyA9IHN0cmluZy5zcGxpdCgnLicpO1xuXHRcdHZhciBlbmNvZGVkID0gbWFwKGxhYmVscywgZm4pLmpvaW4oJy4nKTtcblx0XHRyZXR1cm4gcmVzdWx0ICsgZW5jb2RlZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIG51bWVyaWMgY29kZSBwb2ludHMgb2YgZWFjaCBVbmljb2RlXG5cdCAqIGNoYXJhY3RlciBpbiB0aGUgc3RyaW5nLiBXaGlsZSBKYXZhU2NyaXB0IHVzZXMgVUNTLTIgaW50ZXJuYWxseSxcblx0ICogdGhpcyBmdW5jdGlvbiB3aWxsIGNvbnZlcnQgYSBwYWlyIG9mIHN1cnJvZ2F0ZSBoYWx2ZXMgKGVhY2ggb2Ygd2hpY2hcblx0ICogVUNTLTIgZXhwb3NlcyBhcyBzZXBhcmF0ZSBjaGFyYWN0ZXJzKSBpbnRvIGEgc2luZ2xlIGNvZGUgcG9pbnQsXG5cdCAqIG1hdGNoaW5nIFVURi0xNi5cblx0ICogQHNlZSBgcHVueWNvZGUudWNzMi5lbmNvZGVgXG5cdCAqIEBzZWUgPGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nPlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGUudWNzMlxuXHQgKiBAbmFtZSBkZWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyBUaGUgVW5pY29kZSBpbnB1dCBzdHJpbmcgKFVDUy0yKS5cblx0ICogQHJldHVybnMge0FycmF5fSBUaGUgbmV3IGFycmF5IG9mIGNvZGUgcG9pbnRzLlxuXHQgKi9cblx0ZnVuY3Rpb24gdWNzMmRlY29kZShzdHJpbmcpIHtcblx0XHR2YXIgb3V0cHV0ID0gW10sXG5cdFx0ICAgIGNvdW50ZXIgPSAwLFxuXHRcdCAgICBsZW5ndGggPSBzdHJpbmcubGVuZ3RoLFxuXHRcdCAgICB2YWx1ZSxcblx0XHQgICAgZXh0cmE7XG5cdFx0d2hpbGUgKGNvdW50ZXIgPCBsZW5ndGgpIHtcblx0XHRcdHZhbHVlID0gc3RyaW5nLmNoYXJDb2RlQXQoY291bnRlcisrKTtcblx0XHRcdGlmICh2YWx1ZSA+PSAweEQ4MDAgJiYgdmFsdWUgPD0gMHhEQkZGICYmIGNvdW50ZXIgPCBsZW5ndGgpIHtcblx0XHRcdFx0Ly8gaGlnaCBzdXJyb2dhdGUsIGFuZCB0aGVyZSBpcyBhIG5leHQgY2hhcmFjdGVyXG5cdFx0XHRcdGV4dHJhID0gc3RyaW5nLmNoYXJDb2RlQXQoY291bnRlcisrKTtcblx0XHRcdFx0aWYgKChleHRyYSAmIDB4RkMwMCkgPT0gMHhEQzAwKSB7IC8vIGxvdyBzdXJyb2dhdGVcblx0XHRcdFx0XHRvdXRwdXQucHVzaCgoKHZhbHVlICYgMHgzRkYpIDw8IDEwKSArIChleHRyYSAmIDB4M0ZGKSArIDB4MTAwMDApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIHVubWF0Y2hlZCBzdXJyb2dhdGU7IG9ubHkgYXBwZW5kIHRoaXMgY29kZSB1bml0LCBpbiBjYXNlIHRoZSBuZXh0XG5cdFx0XHRcdFx0Ly8gY29kZSB1bml0IGlzIHRoZSBoaWdoIHN1cnJvZ2F0ZSBvZiBhIHN1cnJvZ2F0ZSBwYWlyXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2godmFsdWUpO1xuXHRcdFx0XHRcdGNvdW50ZXItLTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b3V0cHV0LnB1c2godmFsdWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBzdHJpbmcgYmFzZWQgb24gYW4gYXJyYXkgb2YgbnVtZXJpYyBjb2RlIHBvaW50cy5cblx0ICogQHNlZSBgcHVueWNvZGUudWNzMi5kZWNvZGVgXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZS51Y3MyXG5cdCAqIEBuYW1lIGVuY29kZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBjb2RlUG9pbnRzIFRoZSBhcnJheSBvZiBudW1lcmljIGNvZGUgcG9pbnRzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgbmV3IFVuaWNvZGUgc3RyaW5nIChVQ1MtMikuXG5cdCAqL1xuXHRmdW5jdGlvbiB1Y3MyZW5jb2RlKGFycmF5KSB7XG5cdFx0cmV0dXJuIG1hcChhcnJheSwgZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHZhciBvdXRwdXQgPSAnJztcblx0XHRcdGlmICh2YWx1ZSA+IDB4RkZGRikge1xuXHRcdFx0XHR2YWx1ZSAtPSAweDEwMDAwO1xuXHRcdFx0XHRvdXRwdXQgKz0gc3RyaW5nRnJvbUNoYXJDb2RlKHZhbHVlID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKTtcblx0XHRcdFx0dmFsdWUgPSAweERDMDAgfCB2YWx1ZSAmIDB4M0ZGO1xuXHRcdFx0fVxuXHRcdFx0b3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gb3V0cHV0O1xuXHRcdH0pLmpvaW4oJycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgYmFzaWMgY29kZSBwb2ludCBpbnRvIGEgZGlnaXQvaW50ZWdlci5cblx0ICogQHNlZSBgZGlnaXRUb0Jhc2ljKClgXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBjb2RlUG9pbnQgVGhlIGJhc2ljIG51bWVyaWMgY29kZSBwb2ludCB2YWx1ZS5cblx0ICogQHJldHVybnMge051bWJlcn0gVGhlIG51bWVyaWMgdmFsdWUgb2YgYSBiYXNpYyBjb2RlIHBvaW50IChmb3IgdXNlIGluXG5cdCAqIHJlcHJlc2VudGluZyBpbnRlZ2VycykgaW4gdGhlIHJhbmdlIGAwYCB0byBgYmFzZSAtIDFgLCBvciBgYmFzZWAgaWZcblx0ICogdGhlIGNvZGUgcG9pbnQgZG9lcyBub3QgcmVwcmVzZW50IGEgdmFsdWUuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNpY1RvRGlnaXQoY29kZVBvaW50KSB7XG5cdFx0aWYgKGNvZGVQb2ludCAtIDQ4IDwgMTApIHtcblx0XHRcdHJldHVybiBjb2RlUG9pbnQgLSAyMjtcblx0XHR9XG5cdFx0aWYgKGNvZGVQb2ludCAtIDY1IDwgMjYpIHtcblx0XHRcdHJldHVybiBjb2RlUG9pbnQgLSA2NTtcblx0XHR9XG5cdFx0aWYgKGNvZGVQb2ludCAtIDk3IDwgMjYpIHtcblx0XHRcdHJldHVybiBjb2RlUG9pbnQgLSA5Nztcblx0XHR9XG5cdFx0cmV0dXJuIGJhc2U7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBkaWdpdC9pbnRlZ2VyIGludG8gYSBiYXNpYyBjb2RlIHBvaW50LlxuXHQgKiBAc2VlIGBiYXNpY1RvRGlnaXQoKWBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGRpZ2l0IFRoZSBudW1lcmljIHZhbHVlIG9mIGEgYmFzaWMgY29kZSBwb2ludC5cblx0ICogQHJldHVybnMge051bWJlcn0gVGhlIGJhc2ljIGNvZGUgcG9pbnQgd2hvc2UgdmFsdWUgKHdoZW4gdXNlZCBmb3Jcblx0ICogcmVwcmVzZW50aW5nIGludGVnZXJzKSBpcyBgZGlnaXRgLCB3aGljaCBuZWVkcyB0byBiZSBpbiB0aGUgcmFuZ2Vcblx0ICogYDBgIHRvIGBiYXNlIC0gMWAuIElmIGBmbGFnYCBpcyBub24temVybywgdGhlIHVwcGVyY2FzZSBmb3JtIGlzXG5cdCAqIHVzZWQ7IGVsc2UsIHRoZSBsb3dlcmNhc2UgZm9ybSBpcyB1c2VkLiBUaGUgYmVoYXZpb3IgaXMgdW5kZWZpbmVkXG5cdCAqIGlmIGBmbGFnYCBpcyBub24temVybyBhbmQgYGRpZ2l0YCBoYXMgbm8gdXBwZXJjYXNlIGZvcm0uXG5cdCAqL1xuXHRmdW5jdGlvbiBkaWdpdFRvQmFzaWMoZGlnaXQsIGZsYWcpIHtcblx0XHQvLyAgMC4uMjUgbWFwIHRvIEFTQ0lJIGEuLnogb3IgQS4uWlxuXHRcdC8vIDI2Li4zNSBtYXAgdG8gQVNDSUkgMC4uOVxuXHRcdHJldHVybiBkaWdpdCArIDIyICsgNzUgKiAoZGlnaXQgPCAyNikgLSAoKGZsYWcgIT0gMCkgPDwgNSk7XG5cdH1cblxuXHQvKipcblx0ICogQmlhcyBhZGFwdGF0aW9uIGZ1bmN0aW9uIGFzIHBlciBzZWN0aW9uIDMuNCBvZiBSRkMgMzQ5Mi5cblx0ICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM0OTIjc2VjdGlvbi0zLjRcblx0ICogQHByaXZhdGVcblx0ICovXG5cdGZ1bmN0aW9uIGFkYXB0KGRlbHRhLCBudW1Qb2ludHMsIGZpcnN0VGltZSkge1xuXHRcdHZhciBrID0gMDtcblx0XHRkZWx0YSA9IGZpcnN0VGltZSA/IGZsb29yKGRlbHRhIC8gZGFtcCkgOiBkZWx0YSA+PiAxO1xuXHRcdGRlbHRhICs9IGZsb29yKGRlbHRhIC8gbnVtUG9pbnRzKTtcblx0XHRmb3IgKC8qIG5vIGluaXRpYWxpemF0aW9uICovOyBkZWx0YSA+IGJhc2VNaW51c1RNaW4gKiB0TWF4ID4+IDE7IGsgKz0gYmFzZSkge1xuXHRcdFx0ZGVsdGEgPSBmbG9vcihkZWx0YSAvIGJhc2VNaW51c1RNaW4pO1xuXHRcdH1cblx0XHRyZXR1cm4gZmxvb3IoayArIChiYXNlTWludXNUTWluICsgMSkgKiBkZWx0YSAvIChkZWx0YSArIHNrZXcpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMgdG8gYSBzdHJpbmcgb2YgVW5pY29kZVxuXHQgKiBzeW1ib2xzLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgcmVzdWx0aW5nIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBkZWNvZGUoaW5wdXQpIHtcblx0XHQvLyBEb24ndCB1c2UgVUNTLTJcblx0XHR2YXIgb3V0cHV0ID0gW10sXG5cdFx0ICAgIGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoLFxuXHRcdCAgICBvdXQsXG5cdFx0ICAgIGkgPSAwLFxuXHRcdCAgICBuID0gaW5pdGlhbE4sXG5cdFx0ICAgIGJpYXMgPSBpbml0aWFsQmlhcyxcblx0XHQgICAgYmFzaWMsXG5cdFx0ICAgIGosXG5cdFx0ICAgIGluZGV4LFxuXHRcdCAgICBvbGRpLFxuXHRcdCAgICB3LFxuXHRcdCAgICBrLFxuXHRcdCAgICBkaWdpdCxcblx0XHQgICAgdCxcblx0XHQgICAgLyoqIENhY2hlZCBjYWxjdWxhdGlvbiByZXN1bHRzICovXG5cdFx0ICAgIGJhc2VNaW51c1Q7XG5cblx0XHQvLyBIYW5kbGUgdGhlIGJhc2ljIGNvZGUgcG9pbnRzOiBsZXQgYGJhc2ljYCBiZSB0aGUgbnVtYmVyIG9mIGlucHV0IGNvZGVcblx0XHQvLyBwb2ludHMgYmVmb3JlIHRoZSBsYXN0IGRlbGltaXRlciwgb3IgYDBgIGlmIHRoZXJlIGlzIG5vbmUsIHRoZW4gY29weVxuXHRcdC8vIHRoZSBmaXJzdCBiYXNpYyBjb2RlIHBvaW50cyB0byB0aGUgb3V0cHV0LlxuXG5cdFx0YmFzaWMgPSBpbnB1dC5sYXN0SW5kZXhPZihkZWxpbWl0ZXIpO1xuXHRcdGlmIChiYXNpYyA8IDApIHtcblx0XHRcdGJhc2ljID0gMDtcblx0XHR9XG5cblx0XHRmb3IgKGogPSAwOyBqIDwgYmFzaWM7ICsraikge1xuXHRcdFx0Ly8gaWYgaXQncyBub3QgYSBiYXNpYyBjb2RlIHBvaW50XG5cdFx0XHRpZiAoaW5wdXQuY2hhckNvZGVBdChqKSA+PSAweDgwKSB7XG5cdFx0XHRcdGVycm9yKCdub3QtYmFzaWMnKTtcblx0XHRcdH1cblx0XHRcdG91dHB1dC5wdXNoKGlucHV0LmNoYXJDb2RlQXQoaikpO1xuXHRcdH1cblxuXHRcdC8vIE1haW4gZGVjb2RpbmcgbG9vcDogc3RhcnQganVzdCBhZnRlciB0aGUgbGFzdCBkZWxpbWl0ZXIgaWYgYW55IGJhc2ljIGNvZGVcblx0XHQvLyBwb2ludHMgd2VyZSBjb3BpZWQ7IHN0YXJ0IGF0IHRoZSBiZWdpbm5pbmcgb3RoZXJ3aXNlLlxuXG5cdFx0Zm9yIChpbmRleCA9IGJhc2ljID4gMCA/IGJhc2ljICsgMSA6IDA7IGluZGV4IDwgaW5wdXRMZW5ndGg7IC8qIG5vIGZpbmFsIGV4cHJlc3Npb24gKi8pIHtcblxuXHRcdFx0Ly8gYGluZGV4YCBpcyB0aGUgaW5kZXggb2YgdGhlIG5leHQgY2hhcmFjdGVyIHRvIGJlIGNvbnN1bWVkLlxuXHRcdFx0Ly8gRGVjb2RlIGEgZ2VuZXJhbGl6ZWQgdmFyaWFibGUtbGVuZ3RoIGludGVnZXIgaW50byBgZGVsdGFgLFxuXHRcdFx0Ly8gd2hpY2ggZ2V0cyBhZGRlZCB0byBgaWAuIFRoZSBvdmVyZmxvdyBjaGVja2luZyBpcyBlYXNpZXJcblx0XHRcdC8vIGlmIHdlIGluY3JlYXNlIGBpYCBhcyB3ZSBnbywgdGhlbiBzdWJ0cmFjdCBvZmYgaXRzIHN0YXJ0aW5nXG5cdFx0XHQvLyB2YWx1ZSBhdCB0aGUgZW5kIHRvIG9idGFpbiBgZGVsdGFgLlxuXHRcdFx0Zm9yIChvbGRpID0gaSwgdyA9IDEsIGsgPSBiYXNlOyAvKiBubyBjb25kaXRpb24gKi87IGsgKz0gYmFzZSkge1xuXG5cdFx0XHRcdGlmIChpbmRleCA+PSBpbnB1dExlbmd0aCkge1xuXHRcdFx0XHRcdGVycm9yKCdpbnZhbGlkLWlucHV0Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkaWdpdCA9IGJhc2ljVG9EaWdpdChpbnB1dC5jaGFyQ29kZUF0KGluZGV4KyspKTtcblxuXHRcdFx0XHRpZiAoZGlnaXQgPj0gYmFzZSB8fCBkaWdpdCA+IGZsb29yKChtYXhJbnQgLSBpKSAvIHcpKSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpICs9IGRpZ2l0ICogdztcblx0XHRcdFx0dCA9IGsgPD0gYmlhcyA/IHRNaW4gOiAoayA+PSBiaWFzICsgdE1heCA/IHRNYXggOiBrIC0gYmlhcyk7XG5cblx0XHRcdFx0aWYgKGRpZ2l0IDwgdCkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YmFzZU1pbnVzVCA9IGJhc2UgLSB0O1xuXHRcdFx0XHRpZiAodyA+IGZsb29yKG1heEludCAvIGJhc2VNaW51c1QpKSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR3ICo9IGJhc2VNaW51c1Q7XG5cblx0XHRcdH1cblxuXHRcdFx0b3V0ID0gb3V0cHV0Lmxlbmd0aCArIDE7XG5cdFx0XHRiaWFzID0gYWRhcHQoaSAtIG9sZGksIG91dCwgb2xkaSA9PSAwKTtcblxuXHRcdFx0Ly8gYGlgIHdhcyBzdXBwb3NlZCB0byB3cmFwIGFyb3VuZCBmcm9tIGBvdXRgIHRvIGAwYCxcblx0XHRcdC8vIGluY3JlbWVudGluZyBgbmAgZWFjaCB0aW1lLCBzbyB3ZSdsbCBmaXggdGhhdCBub3c6XG5cdFx0XHRpZiAoZmxvb3IoaSAvIG91dCkgPiBtYXhJbnQgLSBuKSB7XG5cdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0fVxuXG5cdFx0XHRuICs9IGZsb29yKGkgLyBvdXQpO1xuXHRcdFx0aSAlPSBvdXQ7XG5cblx0XHRcdC8vIEluc2VydCBgbmAgYXQgcG9zaXRpb24gYGlgIG9mIHRoZSBvdXRwdXRcblx0XHRcdG91dHB1dC5zcGxpY2UoaSsrLCAwLCBuKTtcblxuXHRcdH1cblxuXHRcdHJldHVybiB1Y3MyZW5jb2RlKG91dHB1dCk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzIChlLmcuIGEgZG9tYWluIG5hbWUgbGFiZWwpIHRvIGFcblx0ICogUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIHJlc3VsdGluZyBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZW5jb2RlKGlucHV0KSB7XG5cdFx0dmFyIG4sXG5cdFx0ICAgIGRlbHRhLFxuXHRcdCAgICBoYW5kbGVkQ1BDb3VudCxcblx0XHQgICAgYmFzaWNMZW5ndGgsXG5cdFx0ICAgIGJpYXMsXG5cdFx0ICAgIGosXG5cdFx0ICAgIG0sXG5cdFx0ICAgIHEsXG5cdFx0ICAgIGssXG5cdFx0ICAgIHQsXG5cdFx0ICAgIGN1cnJlbnRWYWx1ZSxcblx0XHQgICAgb3V0cHV0ID0gW10sXG5cdFx0ICAgIC8qKiBgaW5wdXRMZW5ndGhgIHdpbGwgaG9sZCB0aGUgbnVtYmVyIG9mIGNvZGUgcG9pbnRzIGluIGBpbnB1dGAuICovXG5cdFx0ICAgIGlucHV0TGVuZ3RoLFxuXHRcdCAgICAvKiogQ2FjaGVkIGNhbGN1bGF0aW9uIHJlc3VsdHMgKi9cblx0XHQgICAgaGFuZGxlZENQQ291bnRQbHVzT25lLFxuXHRcdCAgICBiYXNlTWludXNULFxuXHRcdCAgICBxTWludXNUO1xuXG5cdFx0Ly8gQ29udmVydCB0aGUgaW5wdXQgaW4gVUNTLTIgdG8gVW5pY29kZVxuXHRcdGlucHV0ID0gdWNzMmRlY29kZShpbnB1dCk7XG5cblx0XHQvLyBDYWNoZSB0aGUgbGVuZ3RoXG5cdFx0aW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGg7XG5cblx0XHQvLyBJbml0aWFsaXplIHRoZSBzdGF0ZVxuXHRcdG4gPSBpbml0aWFsTjtcblx0XHRkZWx0YSA9IDA7XG5cdFx0YmlhcyA9IGluaXRpYWxCaWFzO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBiYXNpYyBjb2RlIHBvaW50c1xuXHRcdGZvciAoaiA9IDA7IGogPCBpbnB1dExlbmd0aDsgKytqKSB7XG5cdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPCAweDgwKSB7XG5cdFx0XHRcdG91dHB1dC5wdXNoKHN0cmluZ0Zyb21DaGFyQ29kZShjdXJyZW50VmFsdWUpKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRoYW5kbGVkQ1BDb3VudCA9IGJhc2ljTGVuZ3RoID0gb3V0cHV0Lmxlbmd0aDtcblxuXHRcdC8vIGBoYW5kbGVkQ1BDb3VudGAgaXMgdGhlIG51bWJlciBvZiBjb2RlIHBvaW50cyB0aGF0IGhhdmUgYmVlbiBoYW5kbGVkO1xuXHRcdC8vIGBiYXNpY0xlbmd0aGAgaXMgdGhlIG51bWJlciBvZiBiYXNpYyBjb2RlIHBvaW50cy5cblxuXHRcdC8vIEZpbmlzaCB0aGUgYmFzaWMgc3RyaW5nIC0gaWYgaXQgaXMgbm90IGVtcHR5IC0gd2l0aCBhIGRlbGltaXRlclxuXHRcdGlmIChiYXNpY0xlbmd0aCkge1xuXHRcdFx0b3V0cHV0LnB1c2goZGVsaW1pdGVyKTtcblx0XHR9XG5cblx0XHQvLyBNYWluIGVuY29kaW5nIGxvb3A6XG5cdFx0d2hpbGUgKGhhbmRsZWRDUENvdW50IDwgaW5wdXRMZW5ndGgpIHtcblxuXHRcdFx0Ly8gQWxsIG5vbi1iYXNpYyBjb2RlIHBvaW50cyA8IG4gaGF2ZSBiZWVuIGhhbmRsZWQgYWxyZWFkeS4gRmluZCB0aGUgbmV4dFxuXHRcdFx0Ly8gbGFyZ2VyIG9uZTpcblx0XHRcdGZvciAobSA9IG1heEludCwgaiA9IDA7IGogPCBpbnB1dExlbmd0aDsgKytqKSB7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZSA9IGlucHV0W2pdO1xuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlID49IG4gJiYgY3VycmVudFZhbHVlIDwgbSkge1xuXHRcdFx0XHRcdG0gPSBjdXJyZW50VmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gSW5jcmVhc2UgYGRlbHRhYCBlbm91Z2ggdG8gYWR2YW5jZSB0aGUgZGVjb2RlcidzIDxuLGk+IHN0YXRlIHRvIDxtLDA+LFxuXHRcdFx0Ly8gYnV0IGd1YXJkIGFnYWluc3Qgb3ZlcmZsb3dcblx0XHRcdGhhbmRsZWRDUENvdW50UGx1c09uZSA9IGhhbmRsZWRDUENvdW50ICsgMTtcblx0XHRcdGlmIChtIC0gbiA+IGZsb29yKChtYXhJbnQgLSBkZWx0YSkgLyBoYW5kbGVkQ1BDb3VudFBsdXNPbmUpKSB7XG5cdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0fVxuXG5cdFx0XHRkZWx0YSArPSAobSAtIG4pICogaGFuZGxlZENQQ291bnRQbHVzT25lO1xuXHRcdFx0biA9IG07XG5cblx0XHRcdGZvciAoaiA9IDA7IGogPCBpbnB1dExlbmd0aDsgKytqKSB7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZSA9IGlucHV0W2pdO1xuXG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgPCBuICYmICsrZGVsdGEgPiBtYXhJbnQpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT0gbikge1xuXHRcdFx0XHRcdC8vIFJlcHJlc2VudCBkZWx0YSBhcyBhIGdlbmVyYWxpemVkIHZhcmlhYmxlLWxlbmd0aCBpbnRlZ2VyXG5cdFx0XHRcdFx0Zm9yIChxID0gZGVsdGEsIGsgPSBiYXNlOyAvKiBubyBjb25kaXRpb24gKi87IGsgKz0gYmFzZSkge1xuXHRcdFx0XHRcdFx0dCA9IGsgPD0gYmlhcyA/IHRNaW4gOiAoayA+PSBiaWFzICsgdE1heCA/IHRNYXggOiBrIC0gYmlhcyk7XG5cdFx0XHRcdFx0XHRpZiAocSA8IHQpIHtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRxTWludXNUID0gcSAtIHQ7XG5cdFx0XHRcdFx0XHRiYXNlTWludXNUID0gYmFzZSAtIHQ7XG5cdFx0XHRcdFx0XHRvdXRwdXQucHVzaChcblx0XHRcdFx0XHRcdFx0c3RyaW5nRnJvbUNoYXJDb2RlKGRpZ2l0VG9CYXNpYyh0ICsgcU1pbnVzVCAlIGJhc2VNaW51c1QsIDApKVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdHEgPSBmbG9vcihxTWludXNUIC8gYmFzZU1pbnVzVCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goc3RyaW5nRnJvbUNoYXJDb2RlKGRpZ2l0VG9CYXNpYyhxLCAwKSkpO1xuXHRcdFx0XHRcdGJpYXMgPSBhZGFwdChkZWx0YSwgaGFuZGxlZENQQ291bnRQbHVzT25lLCBoYW5kbGVkQ1BDb3VudCA9PSBiYXNpY0xlbmd0aCk7XG5cdFx0XHRcdFx0ZGVsdGEgPSAwO1xuXHRcdFx0XHRcdCsraGFuZGxlZENQQ291bnQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0KytkZWx0YTtcblx0XHRcdCsrbjtcblxuXHRcdH1cblx0XHRyZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgUHVueWNvZGUgc3RyaW5nIHJlcHJlc2VudGluZyBhIGRvbWFpbiBuYW1lIG9yIGFuIGVtYWlsIGFkZHJlc3Ncblx0ICogdG8gVW5pY29kZS4gT25seSB0aGUgUHVueWNvZGVkIHBhcnRzIG9mIHRoZSBpbnB1dCB3aWxsIGJlIGNvbnZlcnRlZCwgaS5lLlxuXHQgKiBpdCBkb2Vzbid0IG1hdHRlciBpZiB5b3UgY2FsbCBpdCBvbiBhIHN0cmluZyB0aGF0IGhhcyBhbHJlYWR5IGJlZW5cblx0ICogY29udmVydGVkIHRvIFVuaWNvZGUuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFB1bnljb2RlZCBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzIHRvXG5cdCAqIGNvbnZlcnQgdG8gVW5pY29kZS5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIFVuaWNvZGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIFB1bnljb2RlXG5cdCAqIHN0cmluZy5cblx0ICovXG5cdGZ1bmN0aW9uIHRvVW5pY29kZShpbnB1dCkge1xuXHRcdHJldHVybiBtYXBEb21haW4oaW5wdXQsIGZ1bmN0aW9uKHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHJlZ2V4UHVueWNvZGUudGVzdChzdHJpbmcpXG5cdFx0XHRcdD8gZGVjb2RlKHN0cmluZy5zbGljZSg0KS50b0xvd2VyQ2FzZSgpKVxuXHRcdFx0XHQ6IHN0cmluZztcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFVuaWNvZGUgc3RyaW5nIHJlcHJlc2VudGluZyBhIGRvbWFpbiBuYW1lIG9yIGFuIGVtYWlsIGFkZHJlc3MgdG9cblx0ICogUHVueWNvZGUuIE9ubHkgdGhlIG5vbi1BU0NJSSBwYXJ0cyBvZiB0aGUgZG9tYWluIG5hbWUgd2lsbCBiZSBjb252ZXJ0ZWQsXG5cdCAqIGkuZS4gaXQgZG9lc24ndCBtYXR0ZXIgaWYgeW91IGNhbGwgaXQgd2l0aCBhIGRvbWFpbiB0aGF0J3MgYWxyZWFkeSBpblxuXHQgKiBBU0NJSS5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcyB0byBjb252ZXJ0LCBhcyBhXG5cdCAqIFVuaWNvZGUgc3RyaW5nLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgUHVueWNvZGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIGRvbWFpbiBuYW1lIG9yXG5cdCAqIGVtYWlsIGFkZHJlc3MuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b0FTQ0lJKGlucHV0KSB7XG5cdFx0cmV0dXJuIG1hcERvbWFpbihpbnB1dCwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gcmVnZXhOb25BU0NJSS50ZXN0KHN0cmluZylcblx0XHRcdFx0PyAneG4tLScgKyBlbmNvZGUoc3RyaW5nKVxuXHRcdFx0XHQ6IHN0cmluZztcblx0XHR9KTtcblx0fVxuXG5cdC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cdC8qKiBEZWZpbmUgdGhlIHB1YmxpYyBBUEkgKi9cblx0cHVueWNvZGUgPSB7XG5cdFx0LyoqXG5cdFx0ICogQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IFB1bnljb2RlLmpzIHZlcnNpb24gbnVtYmVyLlxuXHRcdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHRcdCAqIEB0eXBlIFN0cmluZ1xuXHRcdCAqL1xuXHRcdCd2ZXJzaW9uJzogJzEuNC4xJyxcblx0XHQvKipcblx0XHQgKiBBbiBvYmplY3Qgb2YgbWV0aG9kcyB0byBjb252ZXJ0IGZyb20gSmF2YVNjcmlwdCdzIGludGVybmFsIGNoYXJhY3RlclxuXHRcdCAqIHJlcHJlc2VudGF0aW9uIChVQ1MtMikgdG8gVW5pY29kZSBjb2RlIHBvaW50cywgYW5kIGJhY2suXG5cdFx0ICogQHNlZSA8aHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmc+XG5cdFx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdFx0ICogQHR5cGUgT2JqZWN0XG5cdFx0ICovXG5cdFx0J3VjczInOiB7XG5cdFx0XHQnZGVjb2RlJzogdWNzMmRlY29kZSxcblx0XHRcdCdlbmNvZGUnOiB1Y3MyZW5jb2RlXG5cdFx0fSxcblx0XHQnZGVjb2RlJzogZGVjb2RlLFxuXHRcdCdlbmNvZGUnOiBlbmNvZGUsXG5cdFx0J3RvQVNDSUknOiB0b0FTQ0lJLFxuXHRcdCd0b1VuaWNvZGUnOiB0b1VuaWNvZGVcblx0fTtcblxuXHQvKiogRXhwb3NlIGBwdW55Y29kZWAgKi9cblx0Ly8gU29tZSBBTUQgYnVpbGQgb3B0aW1pemVycywgbGlrZSByLmpzLCBjaGVjayBmb3Igc3BlY2lmaWMgY29uZGl0aW9uIHBhdHRlcm5zXG5cdC8vIGxpa2UgdGhlIGZvbGxvd2luZzpcblx0aWYgKFxuXHRcdHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmXG5cdFx0ZGVmaW5lLmFtZFxuXHQpIHtcblx0XHRkZWZpbmUoJ3B1bnljb2RlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gcHVueWNvZGU7XG5cdFx0fSk7XG5cdH0gZWxzZSBpZiAoZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSkge1xuXHRcdGlmIChtb2R1bGUuZXhwb3J0cyA9PSBmcmVlRXhwb3J0cykge1xuXHRcdFx0Ly8gaW4gTm9kZS5qcywgaW8uanMsIG9yIFJpbmdvSlMgdjAuOC4wK1xuXHRcdFx0ZnJlZU1vZHVsZS5leHBvcnRzID0gcHVueWNvZGU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIGluIE5hcndoYWwgb3IgUmluZ29KUyB2MC43LjAtXG5cdFx0XHRmb3IgKGtleSBpbiBwdW55Y29kZSkge1xuXHRcdFx0XHRwdW55Y29kZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIChmcmVlRXhwb3J0c1trZXldID0gcHVueWNvZGVba2V5XSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdC8vIGluIFJoaW5vIG9yIGEgd2ViIGJyb3dzZXJcblx0XHRyb290LnB1bnljb2RlID0gcHVueWNvZGU7XG5cdH1cblxufSh0aGlzKSk7XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBJZiBvYmouaGFzT3duUHJvcGVydHkgaGFzIGJlZW4gb3ZlcnJpZGRlbiwgdGhlbiBjYWxsaW5nXG4vLyBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgd2lsbCBicmVhay5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2lzc3Vlcy8xNzA3XG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHFzLCBzZXAsIGVxLCBvcHRpb25zKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICB2YXIgb2JqID0ge307XG5cbiAgaWYgKHR5cGVvZiBxcyAhPT0gJ3N0cmluZycgfHwgcXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHZhciByZWdleHAgPSAvXFwrL2c7XG4gIHFzID0gcXMuc3BsaXQoc2VwKTtcblxuICB2YXIgbWF4S2V5cyA9IDEwMDA7XG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLm1heEtleXMgPT09ICdudW1iZXInKSB7XG4gICAgbWF4S2V5cyA9IG9wdGlvbnMubWF4S2V5cztcbiAgfVxuXG4gIHZhciBsZW4gPSBxcy5sZW5ndGg7XG4gIC8vIG1heEtleXMgPD0gMCBtZWFucyB0aGF0IHdlIHNob3VsZCBub3QgbGltaXQga2V5cyBjb3VudFxuICBpZiAobWF4S2V5cyA+IDAgJiYgbGVuID4gbWF4S2V5cykge1xuICAgIGxlbiA9IG1heEtleXM7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIHggPSBxc1tpXS5yZXBsYWNlKHJlZ2V4cCwgJyUyMCcpLFxuICAgICAgICBpZHggPSB4LmluZGV4T2YoZXEpLFxuICAgICAgICBrc3RyLCB2c3RyLCBrLCB2O1xuXG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICBrc3RyID0geC5zdWJzdHIoMCwgaWR4KTtcbiAgICAgIHZzdHIgPSB4LnN1YnN0cihpZHggKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAga3N0ciA9IHg7XG4gICAgICB2c3RyID0gJyc7XG4gICAgfVxuXG4gICAgayA9IGRlY29kZVVSSUNvbXBvbmVudChrc3RyKTtcbiAgICB2ID0gZGVjb2RlVVJJQ29tcG9uZW50KHZzdHIpO1xuXG4gICAgaWYgKCFoYXNPd25Qcm9wZXJ0eShvYmosIGspKSB7XG4gICAgICBvYmpba10gPSB2O1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICBvYmpba10ucHVzaCh2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqW2tdID0gW29ialtrXSwgdl07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHN0cmluZ2lmeVByaW1pdGl2ZSA9IGZ1bmN0aW9uKHYpIHtcbiAgc3dpdGNoICh0eXBlb2Ygdikge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdjtcblxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHYgPyAndHJ1ZScgOiAnZmFsc2UnO1xuXG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiBpc0Zpbml0ZSh2KSA/IHYgOiAnJztcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqLCBzZXAsIGVxLCBuYW1lKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgb2JqID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG1hcChvYmplY3RLZXlzKG9iaiksIGZ1bmN0aW9uKGspIHtcbiAgICAgIHZhciBrcyA9IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUoaykpICsgZXE7XG4gICAgICBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICAgIHJldHVybiBtYXAob2JqW2tdLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZSh2KSk7XG4gICAgICAgIH0pLmpvaW4oc2VwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqW2tdKSk7XG4gICAgICB9XG4gICAgfSkuam9pbihzZXApO1xuXG4gIH1cblxuICBpZiAoIW5hbWUpIHJldHVybiAnJztcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUobmFtZSkpICsgZXEgK1xuICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmopKTtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5mdW5jdGlvbiBtYXAgKHhzLCBmKSB7XG4gIGlmICh4cy5tYXApIHJldHVybiB4cy5tYXAoZik7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgIHJlcy5wdXNoKGYoeHNbaV0sIGkpKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHJlcy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuZGVjb2RlID0gZXhwb3J0cy5wYXJzZSA9IHJlcXVpcmUoJy4vZGVjb2RlJyk7XG5leHBvcnRzLmVuY29kZSA9IGV4cG9ydHMuc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9lbmNvZGUnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gTG9hZCBydWxlc1xudmFyIFRyaWUgPSByZXF1aXJlKCcuL2xpYi9zdWZmaXgtdHJpZS5qcycpO1xudmFyIGFsbFJ1bGVzID0gVHJpZS5mcm9tSnNvbihyZXF1aXJlKCcuL3J1bGVzLmpzb24nKSk7XG5cbi8vIEludGVybmFsc1xudmFyIGV4dHJhY3RIb3N0bmFtZSA9IHJlcXVpcmUoJy4vbGliL2NsZWFuLWhvc3QuanMnKTtcbnZhciBnZXREb21haW4gPSByZXF1aXJlKCcuL2xpYi9kb21haW4uanMnKTtcbnZhciBnZXRQdWJsaWNTdWZmaXggPSByZXF1aXJlKCcuL2xpYi9wdWJsaWMtc3VmZml4LmpzJyk7XG52YXIgZ2V0U3ViZG9tYWluID0gcmVxdWlyZSgnLi9saWIvc3ViZG9tYWluLmpzJyk7XG52YXIgaXNWYWxpZCA9IHJlcXVpcmUoJy4vbGliL2lzLXZhbGlkLmpzJyk7XG52YXIgdGxkRXhpc3RzID0gcmVxdWlyZSgnLi9saWIvdGxkLWV4aXN0cy5qcycpO1xuXG5cbi8vIEZsYWdzIHJlcHJlc2VudGluZyBzdGVwcyBpbiB0aGUgYHBhcnNlYCBmdW5jdGlvbi4gVGhleSBhcmUgdXNlZCB0byBpbXBsZW1lbnRcbi8vIGEgZWFybHkgc3RvcCBtZWNoYW5pc20gKHNpbXVsYXRpbmcgc29tZSBmb3JtIG9mIGxhemluZXNzKSB0byBhdm9pZCBkb2luZyBtb3JlXG4vLyB3b3JrIHRoYW4gbmVjZXNzYXJ5IHRvIHBlcmZvcm0gYSBnaXZlbiBhY3Rpb24gKGUuZy46IHdlIGRvbid0IG5lZWQgdG8gZXh0cmFjdFxuLy8gdGhlIGRvbWFpbiBhbmQgc3ViZG9tYWluIGlmIHdlIGFyZSBvbmx5IGludGVyZXN0ZWQgaW4gcHVibGljIHN1ZmZpeCkuXG52YXIgVExEX0VYSVNUUyA9IDE7XG52YXIgUFVCTElDX1NVRkZJWCA9IDI7XG52YXIgRE9NQUlOID0gMztcbnZhciBTVUJfRE9NQUlOID0gNDtcbnZhciBBTEwgPSA1O1xuXG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0bGRqc1xuICogQHBhcmFtICB7T2JqZWN0LjxydWxlcyx2YWxpZEhvc3RzPn0gb3B0aW9ucyBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHt0bGRqc3xPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZmFjdG9yeShvcHRpb25zKSB7XG4gIHZhciBydWxlcyA9IG9wdGlvbnMucnVsZXMgfHwgYWxsUnVsZXMgfHwge307XG4gIHZhciB2YWxpZEhvc3RzID0gb3B0aW9ucy52YWxpZEhvc3RzIHx8IFtdO1xuICB2YXIgX2V4dHJhY3RIb3N0bmFtZSA9IG9wdGlvbnMuZXh0cmFjdEhvc3RuYW1lIHx8IGV4dHJhY3RIb3N0bmFtZTtcblxuICAvKipcbiAgICogUHJvY2VzcyBhIGdpdmVuIHVybCBhbmQgZXh0cmFjdCBhbGwgaW5mb3JtYXRpb24uIFRoaXMgaXMgYSBoaWdoZXIgbGV2ZWwgQVBJXG4gICAqIGFyb3VuZCBwcml2YXRlIGZ1bmN0aW9ucyBvZiBgdGxkLmpzYC4gSXQgYWxsb3dzIHRvIHJlbW92ZSBkdXBsaWNhdGlvbiAob25seVxuICAgKiBleHRyYWN0IGhvc3RuYW1lIGZyb20gdXJsIG9uY2UgZm9yIGFsbCBvcGVyYXRpb25zKSBhbmQgaW1wbGVtZW50IHNvbWUgZWFybHlcbiAgICogdGVybWluYXRpb24gbWVjaGFuaXNtIHRvIG5vdCBwYXkgdGhlIHByaWNlIG9mIHdoYXQgd2UgZG9uJ3QgbmVlZCAodGhpc1xuICAgKiBzaW11bGF0ZXMgbGF6aW5lc3MgYXQgYSBsb3dlciBjb3N0KS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge251bWJlcnx1bmRlZmluZWR9IF9zdGVwIC0gd2hlcmUgc2hvdWxkIHdlIHN0b3AgcHJvY2Vzc2luZ1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBmdW5jdGlvbiBwYXJzZSh1cmwsIF9zdGVwKSB7XG4gICAgdmFyIHN0ZXAgPSBfc3RlcCB8fCBBTEw7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIGhvc3RuYW1lOiBfZXh0cmFjdEhvc3RuYW1lKHVybCksXG4gICAgICBpc1ZhbGlkOiBudWxsLFxuICAgICAgdGxkRXhpc3RzOiBudWxsLFxuICAgICAgcHVibGljU3VmZml4OiBudWxsLFxuICAgICAgZG9tYWluOiBudWxsLFxuICAgICAgc3ViZG9tYWluOiBudWxsLFxuICAgIH07XG5cbiAgICAvLyBDaGVjayBpZiBgaG9zdG5hbWVgIGlzIHZhbGlkXG4gICAgcmVzdWx0LmlzVmFsaWQgPSBpc1ZhbGlkKHJlc3VsdC5ob3N0bmFtZSk7XG4gICAgaWYgKHJlc3VsdC5pc1ZhbGlkID09PSBmYWxzZSkgcmV0dXJuIHJlc3VsdDtcblxuICAgIC8vIENoZWNrIGlmIHRsZCBleGlzdHNcbiAgICBpZiAoc3RlcCA9PT0gQUxMIHx8IHN0ZXAgPT09IFRMRF9FWElTVFMpIHtcbiAgICAgIHJlc3VsdC50bGRFeGlzdHMgPSB0bGRFeGlzdHMocnVsZXMsIHJlc3VsdC5ob3N0bmFtZSk7XG4gICAgfVxuICAgIGlmIChzdGVwID09PSBUTERfRVhJU1RTKSByZXR1cm4gcmVzdWx0O1xuXG4gICAgLy8gRXh0cmFjdCBwdWJsaWMgc3VmZml4XG4gICAgcmVzdWx0LnB1YmxpY1N1ZmZpeCA9IGdldFB1YmxpY1N1ZmZpeChydWxlcywgcmVzdWx0Lmhvc3RuYW1lKTtcbiAgICBpZiAoc3RlcCA9PT0gUFVCTElDX1NVRkZJWCkgcmV0dXJuIHJlc3VsdDtcblxuICAgIC8vIEV4dHJhY3QgZG9tYWluXG4gICAgcmVzdWx0LmRvbWFpbiA9IGdldERvbWFpbih2YWxpZEhvc3RzLCByZXN1bHQucHVibGljU3VmZml4LCByZXN1bHQuaG9zdG5hbWUpO1xuICAgIGlmIChzdGVwID09PSBET01BSU4pIHJldHVybiByZXN1bHQ7XG5cbiAgICAvLyBFeHRyYWN0IHN1YmRvbWFpblxuICAgIHJlc3VsdC5zdWJkb21haW4gPSBnZXRTdWJkb21haW4ocmVzdWx0Lmhvc3RuYW1lLCByZXN1bHQuZG9tYWluKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuXG4gIHJldHVybiB7XG4gICAgZXh0cmFjdEhvc3RuYW1lOiBfZXh0cmFjdEhvc3RuYW1lLFxuICAgIGlzVmFsaWQ6IGlzVmFsaWQsXG4gICAgcGFyc2U6IHBhcnNlLFxuICAgIHRsZEV4aXN0czogZnVuY3Rpb24gKHVybCkge1xuICAgICAgcmV0dXJuIHBhcnNlKHVybCwgVExEX0VYSVNUUykudGxkRXhpc3RzO1xuICAgIH0sXG4gICAgZ2V0UHVibGljU3VmZml4OiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICByZXR1cm4gcGFyc2UodXJsLCBQVUJMSUNfU1VGRklYKS5wdWJsaWNTdWZmaXg7XG4gICAgfSxcbiAgICBnZXREb21haW46IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgIHJldHVybiBwYXJzZSh1cmwsIERPTUFJTikuZG9tYWluO1xuICAgIH0sXG4gICAgZ2V0U3ViZG9tYWluOiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICByZXR1cm4gcGFyc2UodXJsLCBTVUJfRE9NQUlOKS5zdWJkb21haW47XG4gICAgfSxcbiAgICBmcm9tVXNlclNldHRpbmdzOiBmYWN0b3J5XG4gIH07XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHt9KTtcbiIsIlxudmFyIFVSTCA9IHJlcXVpcmUoJ3VybCcpO1xudmFyIGlzVmFsaWQgPSByZXF1aXJlKCcuL2lzLXZhbGlkLmpzJyk7XG5cblxuLyoqXG4gKiBVdGlsaXR5IHRvIGNsZWFudXAgdGhlIGJhc2UgaG9zdCB2YWx1ZS4gQWxzbyByZW1vdmVzIHVybCBmcmFnbWVudHMuXG4gKlxuICogV29ya3MgZm9yOlxuICogLSBob3N0bmFtZVxuICogLSAvL2hvc3RuYW1lXG4gKiAtIHNjaGVtZTovL2hvc3RuYW1lXG4gKiAtIHNjaGVtZStzY2hlbWU6Ly9ob3N0bmFtZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbi8vIHNjaGVtZSAgICAgID0gQUxQSEEgKiggQUxQSEEgLyBESUdJVCAvIFwiK1wiIC8gXCItXCIgLyBcIi5cIiApXG52YXIgaGFzUHJlZml4UkUgPSAvXigoW2Etel1bYS16MC05Ky4tXSopPzopP1xcL1xcLy87XG52YXIgaW52YWxpZEhvc3RuYW1lQ2hhcnMgPSAvW15BLVphLXowLTkuLV0vO1xuXG4vLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9vbmNsZXRvbS90bGQuanMvaXNzdWVzLzk1XG5mdW5jdGlvbiBydHJpbSh2YWx1ZSkge1xuICBpZiAodmFsdWVbdmFsdWUubGVuZ3RoIC0gMV0gPT09ICcuJykge1xuICAgIHJldHVybiB2YWx1ZS5zdWJzdHIoMCwgdmFsdWUubGVuZ3RoIC0gMSk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dHJhY3RIb3N0bmFtZSh2YWx1ZSkge1xuICBpZiAoaXNWYWxpZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gcnRyaW0odmFsdWUpO1xuICB9XG5cbiAgdmFyIHVybCA9ICgnJyArIHZhbHVlKS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcblxuICBpZiAoaXNWYWxpZCh1cmwpKSB7XG4gICAgcmV0dXJuIHJ0cmltKHVybCk7XG4gIH1cblxuICAvLyBQcm9jZWVkIHdpdGggaGVhdmllciB1cmwgcGFyc2luZyB0byBleHRyYWN0IHRoZSBob3N0bmFtZS5cbiAgdmFyIHBhcnRzID0gVVJMLnBhcnNlKGhhc1ByZWZpeFJFLnRlc3QodXJsKSA/IHVybCA6ICcvLycgKyB1cmwsIG51bGwsIHRydWUpO1xuXG4gIGlmIChwYXJ0cy5ob3N0bmFtZSAmJiAhaW52YWxpZEhvc3RuYW1lQ2hhcnMudGVzdChwYXJ0cy5ob3N0bmFtZSkpIHtcbiAgICByZXR1cm4gcnRyaW0ocGFydHMuaG9zdG5hbWUpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuICogUG9seWZpbGwgZm9yIGBlbmRzV2l0aGBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0dGVyblxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gZW5kc1dpdGgoc3RyLCBwYXR0ZXJuKSB7XG4gIHJldHVybiAoXG4gICAgc3RyLmxhc3RJbmRleE9mKHBhdHRlcm4pID09PSAoc3RyLmxlbmd0aCAtIHBhdHRlcm4ubGVuZ3RoKVxuICApO1xufVxuXG5cbi8qKlxuICogQ2hlY2sgaWYgYHZob3N0YCBpcyBhIHZhbGlkIHN1ZmZpeCBvZiBgaG9zdG5hbWVgICh0b3AtZG9tYWluKVxuICpcbiAqIEl0IG1lYW5zIHRoYXQgYHZob3N0YCBuZWVkcyB0byBiZSBhIHN1ZmZpeCBvZiBgaG9zdG5hbWVgIGFuZCB3ZSB0aGVuIG5lZWQgdG9cbiAqIG1ha2Ugc3VyZSB0aGF0OiBlaXRoZXIgdGhleSBhcmUgZXF1YWwsIG9yIHRoZSBjaGFyYWN0ZXIgcHJlY2VkaW5nIGB2aG9zdGAgaW5cbiAqIGBob3N0bmFtZWAgaXMgYSAnLicgKGl0IHNob3VsZCBub3QgYmUgYSBwYXJ0aWFsIGxhYmVsKS5cbiAqXG4gKiAqIGhvc3RuYW1lID0gJ25vdC5ldmlsLmNvbScgYW5kIHZob3N0ID0gJ3ZpbC5jb20nICAgICAgPT4gbm90IG9rXG4gKiAqIGhvc3RuYW1lID0gJ25vdC5ldmlsLmNvbScgYW5kIHZob3N0ID0gJ2V2aWwuY29tJyAgICAgPT4gb2tcbiAqICogaG9zdG5hbWUgPSAnbm90LmV2aWwuY29tJyBhbmQgdmhvc3QgPSAnbm90LmV2aWwuY29tJyA9PiBva1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBob3N0bmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IHZob3N0XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBzaGFyZVNhbWVEb21haW5TdWZmaXgoaG9zdG5hbWUsIHZob3N0KSB7XG4gIGlmIChlbmRzV2l0aChob3N0bmFtZSwgdmhvc3QpKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGhvc3RuYW1lLmxlbmd0aCA9PT0gdmhvc3QubGVuZ3RoIHx8XG4gICAgICBob3N0bmFtZVtob3N0bmFtZS5sZW5ndGggLSB2aG9zdC5sZW5ndGggLSAxXSA9PT0gJy4nXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuXG4vKipcbiAqIEdpdmVuIGEgaG9zdG5hbWUgYW5kIGl0cyBwdWJsaWMgc3VmZml4LCBleHRyYWN0IHRoZSBnZW5lcmFsIGRvbWFpbi5cbiAqXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGhvc3RuYW1lXG4gKiAgQHBhcmFtIHtzdHJpbmd9IHB1YmxpY1N1ZmZpeFxuICogIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZXh0cmFjdERvbWFpbldpdGhTdWZmaXgoaG9zdG5hbWUsIHB1YmxpY1N1ZmZpeCkge1xuICAvLyBMb2NhdGUgdGhlIGluZGV4IG9mIHRoZSBsYXN0ICcuJyBpbiB0aGUgcGFydCBvZiB0aGUgYGhvc3RuYW1lYCBwcmVjZWRpbmdcbiAgLy8gdGhlIHB1YmxpYyBzdWZmaXguXG4gIC8vXG4gIC8vIGV4YW1wbGVzOlxuICAvLyAgIDEuIG5vdC5ldmlsLmNvLnVrICA9PiBldmlsLmNvLnVrXG4gIC8vICAgICAgICAgXiAgICBeXG4gIC8vICAgICAgICAgfCAgICB8IHN0YXJ0IG9mIHB1YmxpYyBzdWZmaXhcbiAgLy8gICAgICAgICB8IGluZGV4IG9mIHRoZSBsYXN0IGRvdFxuICAvL1xuICAvLyAgIDIuIGV4YW1wbGUuY28udWsgICA9PiBleGFtcGxlLmNvLnVrXG4gIC8vICAgICBeICAgICAgIF5cbiAgLy8gICAgIHwgICAgICAgfCBzdGFydCBvZiBwdWJsaWMgc3VmZml4XG4gIC8vICAgICB8XG4gIC8vICAgICB8ICgtMSkgbm8gZG90IGZvdW5kIGJlZm9yZSB0aGUgcHVibGljIHN1ZmZpeFxuICB2YXIgcHVibGljU3VmZml4SW5kZXggPSBob3N0bmFtZS5sZW5ndGggLSBwdWJsaWNTdWZmaXgubGVuZ3RoIC0gMjtcbiAgdmFyIGxhc3REb3RCZWZvcmVTdWZmaXhJbmRleCA9IGhvc3RuYW1lLmxhc3RJbmRleE9mKCcuJywgcHVibGljU3VmZml4SW5kZXgpO1xuXG4gIC8vIE5vICcuJyBmb3VuZCwgdGhlbiBgaG9zdG5hbWVgIGlzIHRoZSBnZW5lcmFsIGRvbWFpbiAobm8gc3ViLWRvbWFpbilcbiAgaWYgKGxhc3REb3RCZWZvcmVTdWZmaXhJbmRleCA9PT0gLTEpIHtcbiAgICByZXR1cm4gaG9zdG5hbWU7XG4gIH1cblxuICAvLyBFeHRyYWN0IHRoZSBwYXJ0IGJldHdlZW4gdGhlIGxhc3QgJy4nXG4gIHJldHVybiBob3N0bmFtZS5zdWJzdHIobGFzdERvdEJlZm9yZVN1ZmZpeEluZGV4ICsgMSk7XG59XG5cblxuLyoqXG4gKiBEZXRlY3RzIHRoZSBkb21haW4gYmFzZWQgb24gcnVsZXMgYW5kIHVwb24gYW5kIGEgaG9zdCBzdHJpbmdcbiAqXG4gKiBAYXBpXG4gKiBAcGFyYW0ge3N0cmluZ30gaG9zdFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldERvbWFpbih2YWxpZEhvc3RzLCBzdWZmaXgsIGhvc3RuYW1lKSB7XG4gIC8vIENoZWNrIGlmIGBob3N0bmFtZWAgZW5kcyB3aXRoIGEgbWVtYmVyIG9mIGB2YWxpZEhvc3RzYC5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWxpZEhvc3RzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgdmFyIHZob3N0ID0gdmFsaWRIb3N0c1tpXTtcbiAgICBpZiAoc2hhcmVTYW1lRG9tYWluU3VmZml4KGhvc3RuYW1lLCB2aG9zdCkpIHtcbiAgICAgIHJldHVybiB2aG9zdDtcbiAgICB9XG4gIH1cblxuICAvLyBJZiB0aGVyZSBpcyBubyBzdWZmaXgsIHRoZXJlIGlzIG5vIGhvc3RuYW1lXG4gIGlmIChzdWZmaXggPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIElmIGBob3N0bmFtZWAgaXMgYSB2YWxpZCBwdWJsaWMgc3VmZml4LCB0aGVuIHRoZXJlIGlzIG5vIGRvbWFpbiB0byByZXR1cm4uXG4gIC8vIFNpbmNlIHdlIGFscmVhZHkga25vdyB0aGF0IGBnZXRQdWJsaWNTdWZmaXhgIHJldHVybnMgYSBzdWZmaXggb2YgYGhvc3RuYW1lYFxuICAvLyB0aGVyZSBpcyBubyBuZWVkIHRvIHBlcmZvcm0gYSBzdHJpbmcgY29tcGFyaXNvbiBhbmQgd2Ugb25seSBjb21wYXJlIHRoZVxuICAvLyBzaXplLlxuICBpZiAoc3VmZml4Lmxlbmd0aCA9PT0gaG9zdG5hbWUubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBUbyBleHRyYWN0IHRoZSBnZW5lcmFsIGRvbWFpbiwgd2Ugc3RhcnQgYnkgaWRlbnRpZnlpbmcgdGhlIHB1YmxpYyBzdWZmaXhcbiAgLy8gKGlmIGFueSksIHRoZW4gY29uc2lkZXIgdGhlIGRvbWFpbiB0byBiZSB0aGUgcHVibGljIHN1ZmZpeCB3aXRoIG9uZSBhZGRlZFxuICAvLyBsZXZlbCBvZiBkZXB0aC4gKGUuZy46IGlmIGhvc3RuYW1lIGlzIGBub3QuZXZpbC5jby51a2AgYW5kIHB1YmxpYyBzdWZmaXg6XG4gIC8vIGBjby51a2AsIHRoZW4gd2UgdGFrZSBvbmUgbW9yZSBsZXZlbDogYGV2aWxgLCBnaXZpbmcgdGhlIGZpbmFsIHJlc3VsdDpcbiAgLy8gYGV2aWwuY28udWtgKS5cbiAgcmV0dXJuIGV4dHJhY3REb21haW5XaXRoU3VmZml4KGhvc3RuYW1lLCBzdWZmaXgpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFV0aWxpdHkgdG8gZXh0cmFjdCB0aGUgVExEIGZyb20gYSBob3N0bmFtZSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaG9zdFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dHJhY3RUbGRGcm9tSG9zdChob3N0bmFtZSkge1xuICB2YXIgbGFzdERvdEluZGV4ID0gaG9zdG5hbWUubGFzdEluZGV4T2YoJy4nKTtcbiAgaWYgKGxhc3REb3RJbmRleCA9PT0gLTEpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBob3N0bmFtZS5zdWJzdHIobGFzdERvdEluZGV4ICsgMSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgY29kZSBwb2ludCBpcyBhIGRpZ2l0IFswLTldXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGNvZGVcbiAqIEByZXR1cm4gYm9vbGVhblxuICovXG5mdW5jdGlvbiBpc0RpZ2l0KGNvZGUpIHtcbiAgLy8gNDggPT0gJzAnXG4gIC8vIDU3ID09ICc5J1xuICByZXR1cm4gY29kZSA+PSA0OCAmJiBjb2RlIDw9IDU3O1xufVxuXG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGNvZGUgcG9pbnQgaXMgYSBsZXR0ZXIgW2EtekEtWl1cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gY29kZVxuICogQHJldHVybiBib29sZWFuXG4gKi9cbmZ1bmN0aW9uIGlzQWxwaGEoY29kZSkge1xuICAvLyA5NyA9PT0gJ2EnXG4gIC8vIDEyMiA9PSAneidcbiAgcmV0dXJuIGNvZGUgPj0gOTcgJiYgY29kZSA8PSAxMjI7XG59XG5cblxuLyoqXG4gKiBDaGVjayBpZiBhIGhvc3RuYW1lIHN0cmluZyBpcyB2YWxpZCAoYWNjb3JkaW5nIHRvIFJGQ1xuICogSXQncyB1c3VhbGx5IGEgcHJlbGltaW5hcnkgY2hlY2sgYmVmb3JlIHRyeWluZyB0byB1c2UgZ2V0RG9tYWluIG9yIGFueXRoaW5nIGVsc2VcbiAqXG4gKiBCZXdhcmU6IGl0IGRvZXMgbm90IGNoZWNrIGlmIHRoZSBUTEQgZXhpc3RzLlxuICpcbiAqIEBhcGlcbiAqIEBwYXJhbSB7c3RyaW5nfSBob3N0bmFtZVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1ZhbGlkKGhvc3RuYW1lKSB7XG4gIGlmICh0eXBlb2YgaG9zdG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGhvc3RuYW1lLmxlbmd0aCA+IDI1NSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChob3N0bmFtZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBDaGVjayBmaXJzdCBjaGFyYWN0ZXI6IFthLXpBLVowLTldXG4gIHZhciBmaXJzdENoYXJDb2RlID0gaG9zdG5hbWUuY2hhckNvZGVBdCgwKTtcbiAgaWYgKCEoaXNBbHBoYShmaXJzdENoYXJDb2RlKSB8fCBpc0RpZ2l0KGZpcnN0Q2hhckNvZGUpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFZhbGlkYXRlIGhvc3RuYW1lIGFjY29yZGluZyB0byBSRkNcbiAgdmFyIGxhc3REb3RJbmRleCA9IC0xO1xuICB2YXIgbGFzdENoYXJDb2RlO1xuICB2YXIgY29kZTtcbiAgdmFyIGxlbiA9IGhvc3RuYW1lLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgY29kZSA9IGhvc3RuYW1lLmNoYXJDb2RlQXQoaSk7XG5cbiAgICBpZiAoY29kZSA9PT0gNDYpIHsgLy8gJy4nXG4gICAgICBpZiAoXG4gICAgICAgIC8vIENoZWNrIHRoYXQgcHJldmlvdXMgbGFiZWwgaXMgPCA2MyBieXRlcyBsb25nICg2NCA9IDYzICsgJy4nKVxuICAgICAgICAoaSAtIGxhc3REb3RJbmRleCkgPiA2NCB8fFxuICAgICAgICAvLyBDaGVjayB0aGF0IHByZXZpb3VzIGNoYXJhY3RlciB3YXMgbm90IGFscmVhZHkgYSAnLidcbiAgICAgICAgbGFzdENoYXJDb2RlID09PSA0NiB8fFxuICAgICAgICAvLyBDaGVjayB0aGF0IHRoZSBwcmV2aW91cyBsYWJlbCBkb2VzIG5vdCBlbmQgd2l0aCBhICctJ1xuICAgICAgICBsYXN0Q2hhckNvZGUgPT09IDQ1XG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBsYXN0RG90SW5kZXggPSBpO1xuICAgIH0gZWxzZSBpZiAoIShpc0FscGhhKGNvZGUpIHx8IGlzRGlnaXQoY29kZSkgfHwgY29kZSA9PT0gNDUpKSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIGZvcmJpZGRlbiBjaGFyYWN0ZXIgaW4gdGhlIGxhYmVsOiBbXmEtekEtWjAtOS1dXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGFzdENoYXJDb2RlID0gY29kZTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgLy8gQ2hlY2sgdGhhdCBsYXN0IGxhYmVsIGlzIHNob3J0ZXIgdGhhbiA2MyBjaGFyc1xuICAgIChsZW4gLSBsYXN0RG90SW5kZXggLSAxKSA8PSA2MyAmJlxuICAgIC8vIENoZWNrIHRoYXQgdGhlIGxhc3QgY2hhcmFjdGVyIGlzIGFuIGFsbG93ZWQgdHJhaWxpbmcgbGFiZWwgY2hhcmFjdGVyLlxuICAgIC8vIFNpbmNlIHdlIGFscmVhZHkgY2hlY2tlZCB0aGF0IHRoZSBjaGFyIGlzIGEgdmFsaWQgaG9zdG5hbWUgY2hhcmFjdGVyLFxuICAgIC8vIHdlIG9ubHkgbmVlZCB0byBjaGVjayB0aGF0IGl0J3MgZGlmZmVyZW50IGZyb20gJy0nLlxuICAgIGxhc3RDaGFyQ29kZSAhPT0gNDVcbiAgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cblxudmFyIGV4dHJhY3RUbGRGcm9tSG9zdCA9IHJlcXVpcmUoJy4vZnJvbS1ob3N0LmpzJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBwdWJsaWMgc3VmZml4IChpbmNsdWRpbmcgZXhhY3QgbWF0Y2hlcylcbiAqXG4gKiBAYXBpXG4gKiBAc2luY2UgMS41XG4gKiBAcGFyYW0ge3N0cmluZ30gaG9zdG5hbWVcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRQdWJsaWNTdWZmaXgocnVsZXMsIGhvc3RuYW1lKSB7XG4gIC8vIEZpcnN0IGNoZWNrIGlmIGBob3N0bmFtZWAgaXMgYWxyZWFkeSBhIHZhbGlkIHRvcC1sZXZlbCBEb21haW4uXG4gIGlmIChydWxlcy5oYXNUbGQoaG9zdG5hbWUpKSB7XG4gICAgcmV0dXJuIGhvc3RuYW1lO1xuICB9XG5cbiAgdmFyIGNhbmRpZGF0ZSA9IHJ1bGVzLnN1ZmZpeExvb2t1cChob3N0bmFtZSk7XG4gIGlmIChjYW5kaWRhdGUgPT09IG51bGwpIHtcbiAgICAvLyBQcmV2YWlsaW5nIHJ1bGUgaXMgJyonIHNvIHdlIGNvbnNpZGVyIHRoZSB0b3AtbGV2ZWwgZG9tYWluIHRvIGJlIHRoZVxuICAgIC8vIHB1YmxpYyBzdWZmaXggb2YgYGhvc3RuYW1lYCAoZS5nLjogJ2V4YW1wbGUub3JnJyA9PiAnb3JnJykuXG4gICAgcmV0dXJuIGV4dHJhY3RUbGRGcm9tSG9zdChob3N0bmFtZSk7XG4gIH1cblxuICByZXR1cm4gY2FuZGlkYXRlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiAqIFJldHVybnMgdGhlIHN1YmRvbWFpbiBvZiBhIGhvc3RuYW1lIHN0cmluZ1xuICpcbiAqIEBhcGlcbiAqIEBwYXJhbSB7c3RyaW5nfSBob3N0bmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IGRvbWFpbiAtIHRoZSByb290IGRvbWFpbiBvZiB0aGUgaG9zdG5hbWVcbiAqIEByZXR1cm4ge3N0cmluZ3xudWxsfSBhIHN1YmRvbWFpbiBzdHJpbmcgaWYgYW55LCBibGFuayBzdHJpbmcgaWYgc3ViZG9tYWluXG4gKiAgaXMgZW1wdHksIG90aGVyd2lzZSBudWxsLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFN1YmRvbWFpbihob3N0bmFtZSwgZG9tYWluKSB7XG4gIC8vIE5vIGRvbWFpbiBmb3VuZD8gSnVzdCBhYm9ydCwgYWJvcnQhXG4gIGlmIChkb21haW4gPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBob3N0bmFtZS5zdWJzdHIoMCwgaG9zdG5hbWUubGVuZ3RoIC0gZG9tYWluLmxlbmd0aCAtIDEpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgVkFMSURfSE9TVE5BTUVfVkFMVUUgPSAwO1xuXG5cbi8qKlxuICogUmV0dXJuIG1pbihhLCBiKSwgaGFuZGxpbmcgcG9zc2libGUgYG51bGxgIHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcnxudWxsfSBhXG4gKiBAcGFyYW0ge251bWJlcnxudWxsfSBiXG4gKiBAcmV0dXJuIHtudW1iZXJ8bnVsbH1cbiAqL1xuZnVuY3Rpb24gbWluSW5kZXgoYSwgYikge1xuICBpZiAoYSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBiO1xuICB9IGVsc2UgaWYgKGIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gYTtcbiAgfVxuXG4gIHJldHVybiBhIDwgYiA/IGEgOiBiO1xufVxuXG5cbi8qKlxuICogSW5zZXJ0IGEgcHVibGljIHN1ZmZpeCBydWxlIGluIHRoZSBgdHJpZWAuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHJ1bGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB0cmllXG4gKiBAcmV0dXJuIHtvYmplY3R9IHRyaWUgKHVwZGF0ZWQpXG4gKi9cbmZ1bmN0aW9uIGluc2VydEluVHJpZShydWxlLCB0cmllKSB7XG4gIHZhciBwYXJ0cyA9IHJ1bGUucGFydHM7XG4gIHZhciBub2RlID0gdHJpZTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgdmFyIHBhcnQgPSBwYXJ0c1tpXTtcbiAgICB2YXIgbmV4dE5vZGUgPSBub2RlW3BhcnRdO1xuICAgIGlmIChuZXh0Tm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXh0Tm9kZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICBub2RlW3BhcnRdID0gbmV4dE5vZGU7XG4gICAgfVxuXG4gICAgbm9kZSA9IG5leHROb2RlO1xuICB9XG5cbiAgbm9kZS4kID0gVkFMSURfSE9TVE5BTUVfVkFMVUU7XG5cbiAgcmV0dXJuIHRyaWU7XG59XG5cblxuLyoqXG4gKiBSZWN1cnNpdmUgbG9va3VwIG9mIGBwYXJ0c2AgKHN0YXJ0aW5nIGF0IGBpbmRleGApIGluIHRoZSB0cmVlLlxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IHBhcnRzXG4gKiBAcGFyYW0ge29iamVjdH0gdHJpZVxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gd2hlbiB0byBzdGFydCBpbiBgcGFydHNgIChpbml0aWFsbHk6IGxlbmd0aCAtIDEpXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHNpemUgb2YgdGhlIHN1ZmZpeCBmb3VuZCAoaW4gbnVtYmVyIG9mIHBhcnRzIG1hdGNoZWQpXG4gKi9cbmZ1bmN0aW9uIGxvb2t1cEluVHJpZShwYXJ0cywgdHJpZSwgaW5kZXgpIHtcbiAgdmFyIHBhcnQ7XG4gIHZhciBuZXh0Tm9kZTtcbiAgdmFyIHB1YmxpY1N1ZmZpeEluZGV4ID0gbnVsbDtcblxuICAvLyBXZSBoYXZlIGEgbWF0Y2ghXG4gIGlmICh0cmllLiQgIT09IHVuZGVmaW5lZCkge1xuICAgIHB1YmxpY1N1ZmZpeEluZGV4ID0gaW5kZXggKyAxO1xuICB9XG5cbiAgLy8gTm8gbW9yZSBgcGFydHNgIHRvIGxvb2sgZm9yXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICByZXR1cm4gcHVibGljU3VmZml4SW5kZXg7XG4gIH1cblxuICBwYXJ0ID0gcGFydHNbaW5kZXhdO1xuXG4gIC8vIENoZWNrIGJyYW5jaCBjb3JyZXNwb25kaW5nIHRvIG5leHQgcGFydCBvZiBob3N0bmFtZVxuICBuZXh0Tm9kZSA9IHRyaWVbcGFydF07XG4gIGlmIChuZXh0Tm9kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcHVibGljU3VmZml4SW5kZXggPSBtaW5JbmRleChcbiAgICAgIHB1YmxpY1N1ZmZpeEluZGV4LFxuICAgICAgbG9va3VwSW5UcmllKHBhcnRzLCBuZXh0Tm9kZSwgaW5kZXggLSAxKVxuICAgICk7XG4gIH1cblxuICAvLyBDaGVjayB3aWxkY2FyZCBicmFuY2hcbiAgbmV4dE5vZGUgPSB0cmllWycqJ107XG4gIGlmIChuZXh0Tm9kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcHVibGljU3VmZml4SW5kZXggPSBtaW5JbmRleChcbiAgICAgIHB1YmxpY1N1ZmZpeEluZGV4LFxuICAgICAgbG9va3VwSW5UcmllKHBhcnRzLCBuZXh0Tm9kZSwgaW5kZXggLSAxKVxuICAgICk7XG4gIH1cblxuICByZXR1cm4gcHVibGljU3VmZml4SW5kZXg7XG59XG5cblxuLyoqXG4gKiBDb250YWlucyB0aGUgcHVibGljIHN1ZmZpeCBydWxlc2V0IGFzIGEgVHJpZSBmb3IgZWZmaWNpZW50IGxvb2stdXAuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFN1ZmZpeFRyaWUocnVsZXMpIHtcbiAgdGhpcy5leGNlcHRpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdGhpcy5ydWxlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgaWYgKHJ1bGVzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBydWxlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgdmFyIHJ1bGUgPSBydWxlc1tpXTtcbiAgICAgIGlmIChydWxlLmV4Y2VwdGlvbikge1xuICAgICAgICBpbnNlcnRJblRyaWUocnVsZSwgdGhpcy5leGNlcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluc2VydEluVHJpZShydWxlLCB0aGlzLnJ1bGVzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXG4vKipcbiAqIExvYWQgdGhlIHRyaWUgZnJvbSBKU09OIChhcyBzZXJpYWxpemVkIGJ5IEpTT04uc3RyaW5naWZ5KS5cbiAqL1xuU3VmZml4VHJpZS5mcm9tSnNvbiA9IGZ1bmN0aW9uIChqc29uKSB7XG4gIHZhciB0cmllID0gbmV3IFN1ZmZpeFRyaWUoKTtcblxuICB0cmllLmV4Y2VwdGlvbnMgPSBqc29uLmV4Y2VwdGlvbnM7XG4gIHRyaWUucnVsZXMgPSBqc29uLnJ1bGVzO1xuXG4gIHJldHVybiB0cmllO1xufTtcblxuXG4vKipcbiAqIENoZWNrIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBUTEQuXG4gKi9cblN1ZmZpeFRyaWUucHJvdG90eXBlLmhhc1RsZCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAvLyBBbGwgVExEcyBhcmUgYXQgdGhlIHJvb3Qgb2YgdGhlIFRyaWUuXG4gIHJldHVybiB0aGlzLnJ1bGVzW3ZhbHVlXSAhPT0gdW5kZWZpbmVkO1xufTtcblxuXG4vKipcbiAqIENoZWNrIGlmIGBob3N0bmFtZWAgaGFzIGEgdmFsaWQgcHVibGljIHN1ZmZpeCBpbiBgdHJpZWAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGhvc3RuYW1lXG4gKiBAcmV0dXJuIHtzdHJpbmd8bnVsbH0gcHVibGljIHN1ZmZpeFxuICovXG5TdWZmaXhUcmllLnByb3RvdHlwZS5zdWZmaXhMb29rdXAgPSBmdW5jdGlvbiAoaG9zdG5hbWUpIHtcbiAgdmFyIHBhcnRzID0gaG9zdG5hbWUuc3BsaXQoJy4nKTtcblxuICAvLyBMb29rIGZvciBhIG1hdGNoIGluIHJ1bGVzXG4gIHZhciBwdWJsaWNTdWZmaXhJbmRleCA9IGxvb2t1cEluVHJpZShcbiAgICBwYXJ0cyxcbiAgICB0aGlzLnJ1bGVzLFxuICAgIHBhcnRzLmxlbmd0aCAtIDFcbiAgKTtcblxuICBpZiAocHVibGljU3VmZml4SW5kZXggPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIExvb2sgZm9yIGV4Y2VwdGlvbnNcbiAgdmFyIGV4Y2VwdGlvbkluZGV4ID0gbG9va3VwSW5UcmllKFxuICAgIHBhcnRzLFxuICAgIHRoaXMuZXhjZXB0aW9ucyxcbiAgICBwYXJ0cy5sZW5ndGggLSAxXG4gICk7XG5cbiAgaWYgKGV4Y2VwdGlvbkluZGV4ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHBhcnRzLnNsaWNlKGV4Y2VwdGlvbkluZGV4ICsgMSkuam9pbignLicpO1xuICB9XG5cbiAgcmV0dXJuIHBhcnRzLnNsaWNlKHB1YmxpY1N1ZmZpeEluZGV4KS5qb2luKCcuJyk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gU3VmZml4VHJpZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuXG52YXIgZXh0cmFjdFRsZEZyb21Ib3N0ID0gcmVxdWlyZSgnLi9mcm9tLWhvc3QuanMnKTtcblxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgVExEIGV4aXN0cyBmb3IgYSBnaXZlbiBob3N0bmFtZVxuICpcbiAqIEBhcGlcbiAqIEBwYXJhbSB7c3RyaW5nfSBydWxlc1xuICogQHBhcmFtIHtzdHJpbmd9IGhvc3RuYW1lXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRsZEV4aXN0cyhydWxlcywgaG9zdG5hbWUpIHtcbiAgLy8gRWFzeSBjYXNlLCBpdCdzIGEgVExEXG4gIGlmIChydWxlcy5oYXNUbGQoaG9zdG5hbWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBQb3BwaW5nIG9ubHkgdGhlIFRMRCBvZiB0aGUgaG9zdG5hbWVcbiAgdmFyIGhvc3RUbGQgPSBleHRyYWN0VGxkRnJvbUhvc3QoaG9zdG5hbWUpO1xuICBpZiAoaG9zdFRsZCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBydWxlcy5oYXNUbGQoaG9zdFRsZCk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHM9e1wiZXhjZXB0aW9uc1wiOntcImNrXCI6e1wid3d3XCI6e1wiJFwiOjB9fSxcImpwXCI6e1wia2F3YXNha2lcIjp7XCJjaXR5XCI6e1wiJFwiOjB9fSxcImtpdGFreXVzaHVcIjp7XCJjaXR5XCI6e1wiJFwiOjB9fSxcImtvYmVcIjp7XCJjaXR5XCI6e1wiJFwiOjB9fSxcIm5hZ295YVwiOntcImNpdHlcIjp7XCIkXCI6MH19LFwic2FwcG9yb1wiOntcImNpdHlcIjp7XCIkXCI6MH19LFwic2VuZGFpXCI6e1wiY2l0eVwiOntcIiRcIjowfX0sXCJ5b2tvaGFtYVwiOntcImNpdHlcIjp7XCIkXCI6MH19fX0sXCJydWxlc1wiOntcImFjXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH19LFwiYWRcIjp7XCIkXCI6MCxcIm5vbVwiOntcIiRcIjowfX0sXCJhZVwiOntcIiRcIjowLFwiY29cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJzY2hcIjp7XCIkXCI6MH0sXCJhY1wiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIm1pbFwiOntcIiRcIjowfSxcImJsb2dzcG90XCI6e1wiJFwiOjB9LFwibm9tXCI6e1wiJFwiOjB9fSxcImFlcm9cIjp7XCIkXCI6MCxcImFjY2lkZW50LWludmVzdGlnYXRpb25cIjp7XCIkXCI6MH0sXCJhY2NpZGVudC1wcmV2ZW50aW9uXCI6e1wiJFwiOjB9LFwiYWVyb2JhdGljXCI6e1wiJFwiOjB9LFwiYWVyb2NsdWJcIjp7XCIkXCI6MH0sXCJhZXJvZHJvbWVcIjp7XCIkXCI6MH0sXCJhZ2VudHNcIjp7XCIkXCI6MH0sXCJhaXJjcmFmdFwiOntcIiRcIjowfSxcImFpcmxpbmVcIjp7XCIkXCI6MH0sXCJhaXJwb3J0XCI6e1wiJFwiOjB9LFwiYWlyLXN1cnZlaWxsYW5jZVwiOntcIiRcIjowfSxcImFpcnRyYWZmaWNcIjp7XCIkXCI6MH0sXCJhaXItdHJhZmZpYy1jb250cm9sXCI6e1wiJFwiOjB9LFwiYW1idWxhbmNlXCI6e1wiJFwiOjB9LFwiYW11c2VtZW50XCI6e1wiJFwiOjB9LFwiYXNzb2NpYXRpb25cIjp7XCIkXCI6MH0sXCJhdXRob3JcIjp7XCIkXCI6MH0sXCJiYWxsb29uaW5nXCI6e1wiJFwiOjB9LFwiYnJva2VyXCI6e1wiJFwiOjB9LFwiY2FhXCI6e1wiJFwiOjB9LFwiY2FyZ29cIjp7XCIkXCI6MH0sXCJjYXRlcmluZ1wiOntcIiRcIjowfSxcImNlcnRpZmljYXRpb25cIjp7XCIkXCI6MH0sXCJjaGFtcGlvbnNoaXBcIjp7XCIkXCI6MH0sXCJjaGFydGVyXCI6e1wiJFwiOjB9LFwiY2l2aWxhdmlhdGlvblwiOntcIiRcIjowfSxcImNsdWJcIjp7XCIkXCI6MH0sXCJjb25mZXJlbmNlXCI6e1wiJFwiOjB9LFwiY29uc3VsdGFudFwiOntcIiRcIjowfSxcImNvbnN1bHRpbmdcIjp7XCIkXCI6MH0sXCJjb250cm9sXCI6e1wiJFwiOjB9LFwiY291bmNpbFwiOntcIiRcIjowfSxcImNyZXdcIjp7XCIkXCI6MH0sXCJkZXNpZ25cIjp7XCIkXCI6MH0sXCJkZ2NhXCI6e1wiJFwiOjB9LFwiZWR1Y2F0b3JcIjp7XCIkXCI6MH0sXCJlbWVyZ2VuY3lcIjp7XCIkXCI6MH0sXCJlbmdpbmVcIjp7XCIkXCI6MH0sXCJlbmdpbmVlclwiOntcIiRcIjowfSxcImVudGVydGFpbm1lbnRcIjp7XCIkXCI6MH0sXCJlcXVpcG1lbnRcIjp7XCIkXCI6MH0sXCJleGNoYW5nZVwiOntcIiRcIjowfSxcImV4cHJlc3NcIjp7XCIkXCI6MH0sXCJmZWRlcmF0aW9uXCI6e1wiJFwiOjB9LFwiZmxpZ2h0XCI6e1wiJFwiOjB9LFwiZnJlaWdodFwiOntcIiRcIjowfSxcImZ1ZWxcIjp7XCIkXCI6MH0sXCJnbGlkaW5nXCI6e1wiJFwiOjB9LFwiZ292ZXJubWVudFwiOntcIiRcIjowfSxcImdyb3VuZGhhbmRsaW5nXCI6e1wiJFwiOjB9LFwiZ3JvdXBcIjp7XCIkXCI6MH0sXCJoYW5nZ2xpZGluZ1wiOntcIiRcIjowfSxcImhvbWVidWlsdFwiOntcIiRcIjowfSxcImluc3VyYW5jZVwiOntcIiRcIjowfSxcImpvdXJuYWxcIjp7XCIkXCI6MH0sXCJqb3VybmFsaXN0XCI6e1wiJFwiOjB9LFwibGVhc2luZ1wiOntcIiRcIjowfSxcImxvZ2lzdGljc1wiOntcIiRcIjowfSxcIm1hZ2F6aW5lXCI6e1wiJFwiOjB9LFwibWFpbnRlbmFuY2VcIjp7XCIkXCI6MH0sXCJtZWRpYVwiOntcIiRcIjowfSxcIm1pY3JvbGlnaHRcIjp7XCIkXCI6MH0sXCJtb2RlbGxpbmdcIjp7XCIkXCI6MH0sXCJuYXZpZ2F0aW9uXCI6e1wiJFwiOjB9LFwicGFyYWNodXRpbmdcIjp7XCIkXCI6MH0sXCJwYXJhZ2xpZGluZ1wiOntcIiRcIjowfSxcInBhc3Nlbmdlci1hc3NvY2lhdGlvblwiOntcIiRcIjowfSxcInBpbG90XCI6e1wiJFwiOjB9LFwicHJlc3NcIjp7XCIkXCI6MH0sXCJwcm9kdWN0aW9uXCI6e1wiJFwiOjB9LFwicmVjcmVhdGlvblwiOntcIiRcIjowfSxcInJlcGJvZHlcIjp7XCIkXCI6MH0sXCJyZXNcIjp7XCIkXCI6MH0sXCJyZXNlYXJjaFwiOntcIiRcIjowfSxcInJvdG9yY3JhZnRcIjp7XCIkXCI6MH0sXCJzYWZldHlcIjp7XCIkXCI6MH0sXCJzY2llbnRpc3RcIjp7XCIkXCI6MH0sXCJzZXJ2aWNlc1wiOntcIiRcIjowfSxcInNob3dcIjp7XCIkXCI6MH0sXCJza3lkaXZpbmdcIjp7XCIkXCI6MH0sXCJzb2Z0d2FyZVwiOntcIiRcIjowfSxcInN0dWRlbnRcIjp7XCIkXCI6MH0sXCJ0cmFkZXJcIjp7XCIkXCI6MH0sXCJ0cmFkaW5nXCI6e1wiJFwiOjB9LFwidHJhaW5lclwiOntcIiRcIjowfSxcInVuaW9uXCI6e1wiJFwiOjB9LFwid29ya2luZ2dyb3VwXCI6e1wiJFwiOjB9LFwid29ya3NcIjp7XCIkXCI6MH19LFwiYWZcIjp7XCIkXCI6MCxcImdvdlwiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfX0sXCJhZ1wiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH19LFwiYWlcIjp7XCIkXCI6MCxcIm9mZlwiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIm5vbVwiOntcIiRcIjowfX0sXCJhbFwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH19LFwiYW1cIjp7XCIkXCI6MCxcImJsb2dzcG90XCI6e1wiJFwiOjB9fSxcImFvXCI6e1wiJFwiOjAsXCJlZFwiOntcIiRcIjowfSxcImd2XCI6e1wiJFwiOjB9LFwib2dcIjp7XCIkXCI6MH0sXCJjb1wiOntcIiRcIjowfSxcInBiXCI6e1wiJFwiOjB9LFwiaXRcIjp7XCIkXCI6MH19LFwiYXFcIjp7XCIkXCI6MH0sXCJhclwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjAsXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb2JcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJpbnRcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJtdXNpY2FcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJ0dXJcIjp7XCIkXCI6MH19LFwiYXJwYVwiOntcIiRcIjowLFwiZTE2NFwiOntcIiRcIjowfSxcImluLWFkZHJcIjp7XCIkXCI6MH0sXCJpcDZcIjp7XCIkXCI6MH0sXCJpcmlzXCI6e1wiJFwiOjB9LFwidXJpXCI6e1wiJFwiOjB9LFwidXJuXCI6e1wiJFwiOjB9fSxcImFzXCI6e1wiJFwiOjAsXCJnb3ZcIjp7XCIkXCI6MH19LFwiYXNpYVwiOntcIiRcIjowLFwiY2xvdWRuc1wiOntcIiRcIjowfX0sXCJhdFwiOntcIiRcIjowLFwiYWNcIjp7XCIkXCI6MH0sXCJjb1wiOntcIiRcIjowLFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH19LFwiZ3ZcIjp7XCIkXCI6MH0sXCJvclwiOntcIiRcIjowfSxcImZ1dHVyZWNtc1wiOntcIipcIjp7XCIkXCI6MH19LFwiZnV0dXJlaG9zdGluZ1wiOntcIiRcIjowfSxcImZ1dHVyZW1haWxpbmdcIjp7XCIkXCI6MH0sXCJvcnRzaW5mb1wiOntcImV4XCI6e1wiKlwiOntcIiRcIjowfX0sXCJrdW5kZW5cIjp7XCIqXCI6e1wiJFwiOjB9fX0sXCJiaXpcIjp7XCIkXCI6MH0sXCJpbmZvXCI6e1wiJFwiOjB9LFwicHJpdlwiOntcIiRcIjowfSxcIjEyaHBcIjp7XCIkXCI6MH0sXCIyaXhcIjp7XCIkXCI6MH0sXCI0bGltYVwiOntcIiRcIjowfSxcImxpbWEtY2l0eVwiOntcIiRcIjowfX0sXCJhdVwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjAsXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MCxcImFjdFwiOntcIiRcIjowfSxcIm5zd1wiOntcIiRcIjowfSxcIm50XCI6e1wiJFwiOjB9LFwicWxkXCI6e1wiJFwiOjB9LFwic2FcIjp7XCIkXCI6MH0sXCJ0YXNcIjp7XCIkXCI6MH0sXCJ2aWNcIjp7XCIkXCI6MH0sXCJ3YVwiOntcIiRcIjowfX0sXCJnb3ZcIjp7XCIkXCI6MCxcInFsZFwiOntcIiRcIjowfSxcInNhXCI6e1wiJFwiOjB9LFwidGFzXCI6e1wiJFwiOjB9LFwidmljXCI6e1wiJFwiOjB9LFwid2FcIjp7XCIkXCI6MH19LFwiYXNuXCI6e1wiJFwiOjB9LFwiaWRcIjp7XCIkXCI6MH0sXCJpbmZvXCI6e1wiJFwiOjB9LFwiY29uZlwiOntcIiRcIjowfSxcIm96XCI6e1wiJFwiOjB9LFwiYWN0XCI6e1wiJFwiOjB9LFwibnN3XCI6e1wiJFwiOjB9LFwibnRcIjp7XCIkXCI6MH0sXCJxbGRcIjp7XCIkXCI6MH0sXCJzYVwiOntcIiRcIjowfSxcInRhc1wiOntcIiRcIjowfSxcInZpY1wiOntcIiRcIjowfSxcIndhXCI6e1wiJFwiOjB9fSxcImF3XCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH19LFwiYXhcIjp7XCIkXCI6MH0sXCJhelwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwiaW50XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiaW5mb1wiOntcIiRcIjowfSxcInBwXCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwibmFtZVwiOntcIiRcIjowfSxcInByb1wiOntcIiRcIjowfSxcImJpelwiOntcIiRcIjowfX0sXCJiYVwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH19LFwiYmJcIjp7XCIkXCI6MCxcImJpelwiOntcIiRcIjowfSxcImNvXCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwiaW5mb1wiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcInN0b3JlXCI6e1wiJFwiOjB9LFwidHZcIjp7XCIkXCI6MH19LFwiYmRcIjp7XCIqXCI6e1wiJFwiOjB9fSxcImJlXCI6e1wiJFwiOjAsXCJhY1wiOntcIiRcIjowfSxcImJsb2dzcG90XCI6e1wiJFwiOjB9LFwidHJhbnN1cmxcIjp7XCIqXCI6e1wiJFwiOjB9fX0sXCJiZlwiOntcIiRcIjowLFwiZ292XCI6e1wiJFwiOjB9fSxcImJnXCI6e1wiMFwiOntcIiRcIjowfSxcIjFcIjp7XCIkXCI6MH0sXCIyXCI6e1wiJFwiOjB9LFwiM1wiOntcIiRcIjowfSxcIjRcIjp7XCIkXCI6MH0sXCI1XCI6e1wiJFwiOjB9LFwiNlwiOntcIiRcIjowfSxcIjdcIjp7XCIkXCI6MH0sXCI4XCI6e1wiJFwiOjB9LFwiOVwiOntcIiRcIjowfSxcIiRcIjowLFwiYVwiOntcIiRcIjowfSxcImJcIjp7XCIkXCI6MH0sXCJjXCI6e1wiJFwiOjB9LFwiZFwiOntcIiRcIjowfSxcImVcIjp7XCIkXCI6MH0sXCJmXCI6e1wiJFwiOjB9LFwiZ1wiOntcIiRcIjowfSxcImhcIjp7XCIkXCI6MH0sXCJpXCI6e1wiJFwiOjB9LFwialwiOntcIiRcIjowfSxcImtcIjp7XCIkXCI6MH0sXCJsXCI6e1wiJFwiOjB9LFwibVwiOntcIiRcIjowfSxcIm5cIjp7XCIkXCI6MH0sXCJvXCI6e1wiJFwiOjB9LFwicFwiOntcIiRcIjowfSxcInFcIjp7XCIkXCI6MH0sXCJyXCI6e1wiJFwiOjB9LFwic1wiOntcIiRcIjowfSxcInRcIjp7XCIkXCI6MH0sXCJ1XCI6e1wiJFwiOjB9LFwidlwiOntcIiRcIjowfSxcIndcIjp7XCIkXCI6MH0sXCJ4XCI6e1wiJFwiOjB9LFwieVwiOntcIiRcIjowfSxcInpcIjp7XCIkXCI6MH0sXCJibG9nc3BvdFwiOntcIiRcIjowfSxcImJhcnN5XCI6e1wiJFwiOjB9fSxcImJoXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH19LFwiYmlcIjp7XCIkXCI6MCxcImNvXCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwib3JcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH19LFwiYml6XCI6e1wiJFwiOjAsXCJjbG91ZG5zXCI6e1wiJFwiOjB9LFwiZHluZG5zXCI6e1wiJFwiOjB9LFwiZm9yLWJldHRlclwiOntcIiRcIjowfSxcImZvci1tb3JlXCI6e1wiJFwiOjB9LFwiZm9yLXNvbWVcIjp7XCIkXCI6MH0sXCJmb3ItdGhlXCI6e1wiJFwiOjB9LFwic2VsZmlwXCI6e1wiJFwiOjB9LFwid2ViaG9wXCI6e1wiJFwiOjB9LFwibW1hZmFuXCI6e1wiJFwiOjB9LFwibXlmdHBcIjp7XCIkXCI6MH0sXCJuby1pcFwiOntcIiRcIjowfSxcImRzY2xvdWRcIjp7XCIkXCI6MH19LFwiYmpcIjp7XCIkXCI6MCxcImFzc29cIjp7XCIkXCI6MH0sXCJiYXJyZWF1XCI6e1wiJFwiOjB9LFwiZ291dlwiOntcIiRcIjowfSxcImJsb2dzcG90XCI6e1wiJFwiOjB9fSxcImJtXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH19LFwiYm5cIjp7XCIqXCI6e1wiJFwiOjB9fSxcImJvXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJnb2JcIjp7XCIkXCI6MH0sXCJpbnRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJ0dlwiOntcIiRcIjowfX0sXCJiclwiOntcIiRcIjowLFwiYWRtXCI6e1wiJFwiOjB9LFwiYWR2XCI6e1wiJFwiOjB9LFwiYWdyXCI6e1wiJFwiOjB9LFwiYW1cIjp7XCIkXCI6MH0sXCJhcnFcIjp7XCIkXCI6MH0sXCJhcnRcIjp7XCIkXCI6MH0sXCJhdG9cIjp7XCIkXCI6MH0sXCJiXCI6e1wiJFwiOjB9LFwiYmVsZW1cIjp7XCIkXCI6MH0sXCJiaW9cIjp7XCIkXCI6MH0sXCJibG9nXCI6e1wiJFwiOjB9LFwiYm1kXCI6e1wiJFwiOjB9LFwiY2ltXCI6e1wiJFwiOjB9LFwiY25nXCI6e1wiJFwiOjB9LFwiY250XCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjAsXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJjb29wXCI6e1wiJFwiOjB9LFwiY3JpXCI6e1wiJFwiOjB9LFwiZGVmXCI6e1wiJFwiOjB9LFwiZWNuXCI6e1wiJFwiOjB9LFwiZWNvXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZW1wXCI6e1wiJFwiOjB9LFwiZW5nXCI6e1wiJFwiOjB9LFwiZXNwXCI6e1wiJFwiOjB9LFwiZXRjXCI6e1wiJFwiOjB9LFwiZXRpXCI6e1wiJFwiOjB9LFwiZmFyXCI6e1wiJFwiOjB9LFwiZmxvZ1wiOntcIiRcIjowfSxcImZsb3JpcGFcIjp7XCIkXCI6MH0sXCJmbVwiOntcIiRcIjowfSxcImZuZFwiOntcIiRcIjowfSxcImZvdFwiOntcIiRcIjowfSxcImZzdFwiOntcIiRcIjowfSxcImcxMlwiOntcIiRcIjowfSxcImdnZlwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowLFwiYWNcIjp7XCIkXCI6MH0sXCJhbFwiOntcIiRcIjowfSxcImFtXCI6e1wiJFwiOjB9LFwiYXBcIjp7XCIkXCI6MH0sXCJiYVwiOntcIiRcIjowfSxcImNlXCI6e1wiJFwiOjB9LFwiZGZcIjp7XCIkXCI6MH0sXCJlc1wiOntcIiRcIjowfSxcImdvXCI6e1wiJFwiOjB9LFwibWFcIjp7XCIkXCI6MH0sXCJtZ1wiOntcIiRcIjowfSxcIm1zXCI6e1wiJFwiOjB9LFwibXRcIjp7XCIkXCI6MH0sXCJwYVwiOntcIiRcIjowfSxcInBiXCI6e1wiJFwiOjB9LFwicGVcIjp7XCIkXCI6MH0sXCJwaVwiOntcIiRcIjowfSxcInByXCI6e1wiJFwiOjB9LFwicmpcIjp7XCIkXCI6MH0sXCJyblwiOntcIiRcIjowfSxcInJvXCI6e1wiJFwiOjB9LFwicnJcIjp7XCIkXCI6MH0sXCJyc1wiOntcIiRcIjowfSxcInNjXCI6e1wiJFwiOjB9LFwic2VcIjp7XCIkXCI6MH0sXCJzcFwiOntcIiRcIjowfSxcInRvXCI6e1wiJFwiOjB9fSxcImltYlwiOntcIiRcIjowfSxcImluZFwiOntcIiRcIjowfSxcImluZlwiOntcIiRcIjowfSxcImphbXBhXCI6e1wiJFwiOjB9LFwiam9yXCI6e1wiJFwiOjB9LFwianVzXCI6e1wiJFwiOjB9LFwibGVnXCI6e1wiJFwiOjAsXCJhY1wiOntcIiRcIjowfSxcImFsXCI6e1wiJFwiOjB9LFwiYW1cIjp7XCIkXCI6MH0sXCJhcFwiOntcIiRcIjowfSxcImJhXCI6e1wiJFwiOjB9LFwiY2VcIjp7XCIkXCI6MH0sXCJkZlwiOntcIiRcIjowfSxcImVzXCI6e1wiJFwiOjB9LFwiZ29cIjp7XCIkXCI6MH0sXCJtYVwiOntcIiRcIjowfSxcIm1nXCI6e1wiJFwiOjB9LFwibXNcIjp7XCIkXCI6MH0sXCJtdFwiOntcIiRcIjowfSxcInBhXCI6e1wiJFwiOjB9LFwicGJcIjp7XCIkXCI6MH0sXCJwZVwiOntcIiRcIjowfSxcInBpXCI6e1wiJFwiOjB9LFwicHJcIjp7XCIkXCI6MH0sXCJyalwiOntcIiRcIjowfSxcInJuXCI6e1wiJFwiOjB9LFwicm9cIjp7XCIkXCI6MH0sXCJyclwiOntcIiRcIjowfSxcInJzXCI6e1wiJFwiOjB9LFwic2NcIjp7XCIkXCI6MH0sXCJzZVwiOntcIiRcIjowfSxcInNwXCI6e1wiJFwiOjB9LFwidG9cIjp7XCIkXCI6MH19LFwibGVsXCI6e1wiJFwiOjB9LFwibWF0XCI6e1wiJFwiOjB9LFwibWVkXCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwibXBcIjp7XCIkXCI6MH0sXCJtdXNcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJub21cIjp7XCIqXCI6e1wiJFwiOjB9fSxcIm5vdFwiOntcIiRcIjowfSxcIm50clwiOntcIiRcIjowfSxcIm9kb1wiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcInBvYVwiOntcIiRcIjowfSxcInBwZ1wiOntcIiRcIjowfSxcInByb1wiOntcIiRcIjowfSxcInBzY1wiOntcIiRcIjowfSxcInBzaVwiOntcIiRcIjowfSxcInFzbFwiOntcIiRcIjowfSxcInJhZGlvXCI6e1wiJFwiOjB9LFwicmVjXCI6e1wiJFwiOjB9LFwicmVjaWZlXCI6e1wiJFwiOjB9LFwic2xnXCI6e1wiJFwiOjB9LFwic3J2XCI6e1wiJFwiOjB9LFwidGF4aVwiOntcIiRcIjowfSxcInRlb1wiOntcIiRcIjowfSxcInRtcFwiOntcIiRcIjowfSxcInRyZFwiOntcIiRcIjowfSxcInR1clwiOntcIiRcIjowfSxcInR2XCI6e1wiJFwiOjB9LFwidmV0XCI6e1wiJFwiOjB9LFwidml4XCI6e1wiJFwiOjB9LFwidmxvZ1wiOntcIiRcIjowfSxcIndpa2lcIjp7XCIkXCI6MH0sXCJ6bGdcIjp7XCIkXCI6MH19LFwiYnNcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIndlXCI6e1wiJFwiOjB9fSxcImJ0XCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH19LFwiYnZcIjp7XCIkXCI6MH0sXCJid1wiOntcIiRcIjowLFwiY29cIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH19LFwiYnlcIjp7XCIkXCI6MCxcImdvdlwiOntcIiRcIjowfSxcIm1pbFwiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowLFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH19LFwib2ZcIjp7XCIkXCI6MH0sXCJueW1cIjp7XCIkXCI6MH19LFwiYnpcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcInphXCI6e1wiJFwiOjB9LFwibnltXCI6e1wiJFwiOjB9fSxcImNhXCI6e1wiJFwiOjAsXCJhYlwiOntcIiRcIjowfSxcImJjXCI6e1wiJFwiOjB9LFwibWJcIjp7XCIkXCI6MH0sXCJuYlwiOntcIiRcIjowfSxcIm5mXCI6e1wiJFwiOjB9LFwibmxcIjp7XCIkXCI6MH0sXCJuc1wiOntcIiRcIjowfSxcIm50XCI6e1wiJFwiOjB9LFwibnVcIjp7XCIkXCI6MH0sXCJvblwiOntcIiRcIjowfSxcInBlXCI6e1wiJFwiOjB9LFwicWNcIjp7XCIkXCI6MH0sXCJza1wiOntcIiRcIjowfSxcInlrXCI6e1wiJFwiOjB9LFwiZ2NcIjp7XCIkXCI6MH0sXCJhd2RldlwiOntcIipcIjp7XCIkXCI6MH19LFwiY29cIjp7XCIkXCI6MH0sXCJibG9nc3BvdFwiOntcIiRcIjowfSxcIm5vLWlwXCI6e1wiJFwiOjB9fSxcImNhdFwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjAsXCJjbG91ZG5zXCI6e1wiJFwiOjB9LFwiZnRwYWNjZXNzXCI6e1wiJFwiOjB9LFwiZ2FtZS1zZXJ2ZXJcIjp7XCIkXCI6MH0sXCJteXBob3Rvc1wiOntcIiRcIjowfSxcInNjcmFwcGluZ1wiOntcIiRcIjowfSxcInR3bWFpbFwiOntcIiRcIjowfSxcImZhbnRhc3lsZWFndWVcIjp7XCIkXCI6MH19LFwiY2RcIjp7XCIkXCI6MCxcImdvdlwiOntcIiRcIjowfX0sXCJjZlwiOntcIiRcIjowLFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH19LFwiY2dcIjp7XCIkXCI6MH0sXCJjaFwiOntcIiRcIjowLFwic3F1YXJlN1wiOntcIiRcIjowfSxcImJsb2dzcG90XCI6e1wiJFwiOjB9LFwiZ290ZG5zXCI6e1wiJFwiOjB9LFwiMTJocFwiOntcIiRcIjowfSxcIjJpeFwiOntcIiRcIjowfSxcIjRsaW1hXCI6e1wiJFwiOjB9LFwibGltYS1jaXR5XCI6e1wiJFwiOjB9fSxcImNpXCI6e1wiJFwiOjAsXCJvcmdcIjp7XCIkXCI6MH0sXCJvclwiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcImNvXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZWRcIjp7XCIkXCI6MH0sXCJhY1wiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcImdvXCI6e1wiJFwiOjB9LFwiYXNzb1wiOntcIiRcIjowfSxcInhuLS1hcm9wb3J0LWJ5YVwiOntcIiRcIjowfSxcImludFwiOntcIiRcIjowfSxcInByZXNzZVwiOntcIiRcIjowfSxcIm1kXCI6e1wiJFwiOjB9LFwiZ291dlwiOntcIiRcIjowfX0sXCJja1wiOntcIipcIjp7XCIkXCI6MH19LFwiY2xcIjp7XCIkXCI6MCxcImdvdlwiOntcIiRcIjowfSxcImdvYlwiOntcIiRcIjowfSxcImNvXCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH19LFwiY21cIjp7XCIkXCI6MCxcImNvXCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9fSxcImNuXCI6e1wiJFwiOjAsXCJhY1wiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowLFwiYW1hem9uYXdzXCI6e1wiY29tcHV0ZVwiOntcIipcIjp7XCIkXCI6MH19LFwiZWJcIjp7XCJjbi1ub3J0aC0xXCI6e1wiJFwiOjB9fSxcImVsYlwiOntcIipcIjp7XCIkXCI6MH19LFwiY24tbm9ydGgtMVwiOntcInMzXCI6e1wiJFwiOjB9fX19LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwieG4tLTU1cXg1ZFwiOntcIiRcIjowfSxcInhuLS1pbzBhN2lcIjp7XCIkXCI6MH0sXCJ4bi0tb2QwYWxnXCI6e1wiJFwiOjB9LFwiYWhcIjp7XCIkXCI6MH0sXCJialwiOntcIiRcIjowfSxcImNxXCI6e1wiJFwiOjB9LFwiZmpcIjp7XCIkXCI6MH0sXCJnZFwiOntcIiRcIjowfSxcImdzXCI6e1wiJFwiOjB9LFwiZ3pcIjp7XCIkXCI6MH0sXCJneFwiOntcIiRcIjowfSxcImhhXCI6e1wiJFwiOjB9LFwiaGJcIjp7XCIkXCI6MH0sXCJoZVwiOntcIiRcIjowfSxcImhpXCI6e1wiJFwiOjB9LFwiaGxcIjp7XCIkXCI6MH0sXCJoblwiOntcIiRcIjowfSxcImpsXCI6e1wiJFwiOjB9LFwianNcIjp7XCIkXCI6MH0sXCJqeFwiOntcIiRcIjowfSxcImxuXCI6e1wiJFwiOjB9LFwibm1cIjp7XCIkXCI6MH0sXCJueFwiOntcIiRcIjowfSxcInFoXCI6e1wiJFwiOjB9LFwic2NcIjp7XCIkXCI6MH0sXCJzZFwiOntcIiRcIjowfSxcInNoXCI6e1wiJFwiOjB9LFwic25cIjp7XCIkXCI6MH0sXCJzeFwiOntcIiRcIjowfSxcInRqXCI6e1wiJFwiOjB9LFwieGpcIjp7XCIkXCI6MH0sXCJ4elwiOntcIiRcIjowfSxcInluXCI6e1wiJFwiOjB9LFwiempcIjp7XCIkXCI6MH0sXCJoa1wiOntcIiRcIjowfSxcIm1vXCI6e1wiJFwiOjB9LFwidHdcIjp7XCIkXCI6MH19LFwiY29cIjp7XCIkXCI6MCxcImFydHNcIjp7XCIkXCI6MH0sXCJjb21cIjp7XCIkXCI6MCxcImJsb2dzcG90XCI6e1wiJFwiOjB9fSxcImVkdVwiOntcIiRcIjowfSxcImZpcm1cIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJpbmZvXCI6e1wiJFwiOjB9LFwiaW50XCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwibm9tXCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwicmVjXCI6e1wiJFwiOjB9LFwid2ViXCI6e1wiJFwiOjB9LFwibm9kdW1cIjp7XCIkXCI6MH19LFwiY29tXCI6e1wiJFwiOjAsXCJhbWF6b25hd3NcIjp7XCJjb21wdXRlXCI6e1wiKlwiOntcIiRcIjowfX0sXCJjb21wdXRlLTFcIjp7XCIqXCI6e1wiJFwiOjB9fSxcInVzLWVhc3QtMVwiOntcIiRcIjowLFwiZHVhbHN0YWNrXCI6e1wiczNcIjp7XCIkXCI6MH19fSxcImVsYlwiOntcIipcIjp7XCIkXCI6MH19LFwiczNcIjp7XCIkXCI6MH0sXCJzMy1hcC1ub3J0aGVhc3QtMVwiOntcIiRcIjowfSxcInMzLWFwLW5vcnRoZWFzdC0yXCI6e1wiJFwiOjB9LFwiczMtYXAtc291dGgtMVwiOntcIiRcIjowfSxcInMzLWFwLXNvdXRoZWFzdC0xXCI6e1wiJFwiOjB9LFwiczMtYXAtc291dGhlYXN0LTJcIjp7XCIkXCI6MH0sXCJzMy1jYS1jZW50cmFsLTFcIjp7XCIkXCI6MH0sXCJzMy1ldS1jZW50cmFsLTFcIjp7XCIkXCI6MH0sXCJzMy1ldS13ZXN0LTFcIjp7XCIkXCI6MH0sXCJzMy1ldS13ZXN0LTJcIjp7XCIkXCI6MH0sXCJzMy1leHRlcm5hbC0xXCI6e1wiJFwiOjB9LFwiczMtZmlwcy11cy1nb3Ytd2VzdC0xXCI6e1wiJFwiOjB9LFwiczMtc2EtZWFzdC0xXCI6e1wiJFwiOjB9LFwiczMtdXMtZ292LXdlc3QtMVwiOntcIiRcIjowfSxcInMzLXVzLWVhc3QtMlwiOntcIiRcIjowfSxcInMzLXVzLXdlc3QtMVwiOntcIiRcIjowfSxcInMzLXVzLXdlc3QtMlwiOntcIiRcIjowfSxcImFwLW5vcnRoZWFzdC0yXCI6e1wiczNcIjp7XCIkXCI6MH0sXCJkdWFsc3RhY2tcIjp7XCJzM1wiOntcIiRcIjowfX0sXCJzMy13ZWJzaXRlXCI6e1wiJFwiOjB9fSxcImFwLXNvdXRoLTFcIjp7XCJzM1wiOntcIiRcIjowfSxcImR1YWxzdGFja1wiOntcInMzXCI6e1wiJFwiOjB9fSxcInMzLXdlYnNpdGVcIjp7XCIkXCI6MH19LFwiY2EtY2VudHJhbC0xXCI6e1wiczNcIjp7XCIkXCI6MH0sXCJkdWFsc3RhY2tcIjp7XCJzM1wiOntcIiRcIjowfX0sXCJzMy13ZWJzaXRlXCI6e1wiJFwiOjB9fSxcImV1LWNlbnRyYWwtMVwiOntcInMzXCI6e1wiJFwiOjB9LFwiZHVhbHN0YWNrXCI6e1wiczNcIjp7XCIkXCI6MH19LFwiczMtd2Vic2l0ZVwiOntcIiRcIjowfX0sXCJldS13ZXN0LTJcIjp7XCJzM1wiOntcIiRcIjowfSxcImR1YWxzdGFja1wiOntcInMzXCI6e1wiJFwiOjB9fSxcInMzLXdlYnNpdGVcIjp7XCIkXCI6MH19LFwidXMtZWFzdC0yXCI6e1wiczNcIjp7XCIkXCI6MH0sXCJkdWFsc3RhY2tcIjp7XCJzM1wiOntcIiRcIjowfX0sXCJzMy13ZWJzaXRlXCI6e1wiJFwiOjB9fSxcImFwLW5vcnRoZWFzdC0xXCI6e1wiZHVhbHN0YWNrXCI6e1wiczNcIjp7XCIkXCI6MH19fSxcImFwLXNvdXRoZWFzdC0xXCI6e1wiZHVhbHN0YWNrXCI6e1wiczNcIjp7XCIkXCI6MH19fSxcImFwLXNvdXRoZWFzdC0yXCI6e1wiZHVhbHN0YWNrXCI6e1wiczNcIjp7XCIkXCI6MH19fSxcImV1LXdlc3QtMVwiOntcImR1YWxzdGFja1wiOntcInMzXCI6e1wiJFwiOjB9fX0sXCJzYS1lYXN0LTFcIjp7XCJkdWFsc3RhY2tcIjp7XCJzM1wiOntcIiRcIjowfX19LFwiczMtd2Vic2l0ZS11cy1lYXN0LTFcIjp7XCIkXCI6MH0sXCJzMy13ZWJzaXRlLXVzLXdlc3QtMVwiOntcIiRcIjowfSxcInMzLXdlYnNpdGUtdXMtd2VzdC0yXCI6e1wiJFwiOjB9LFwiczMtd2Vic2l0ZS1hcC1ub3J0aGVhc3QtMVwiOntcIiRcIjowfSxcInMzLXdlYnNpdGUtYXAtc291dGhlYXN0LTFcIjp7XCIkXCI6MH0sXCJzMy13ZWJzaXRlLWFwLXNvdXRoZWFzdC0yXCI6e1wiJFwiOjB9LFwiczMtd2Vic2l0ZS1ldS13ZXN0LTFcIjp7XCIkXCI6MH0sXCJzMy13ZWJzaXRlLXNhLWVhc3QtMVwiOntcIiRcIjowfX0sXCJlbGFzdGljYmVhbnN0YWxrXCI6e1wiJFwiOjAsXCJhcC1ub3J0aGVhc3QtMVwiOntcIiRcIjowfSxcImFwLW5vcnRoZWFzdC0yXCI6e1wiJFwiOjB9LFwiYXAtc291dGgtMVwiOntcIiRcIjowfSxcImFwLXNvdXRoZWFzdC0xXCI6e1wiJFwiOjB9LFwiYXAtc291dGhlYXN0LTJcIjp7XCIkXCI6MH0sXCJjYS1jZW50cmFsLTFcIjp7XCIkXCI6MH0sXCJldS1jZW50cmFsLTFcIjp7XCIkXCI6MH0sXCJldS13ZXN0LTFcIjp7XCIkXCI6MH0sXCJldS13ZXN0LTJcIjp7XCIkXCI6MH0sXCJzYS1lYXN0LTFcIjp7XCIkXCI6MH0sXCJ1cy1lYXN0LTFcIjp7XCIkXCI6MH0sXCJ1cy1lYXN0LTJcIjp7XCIkXCI6MH0sXCJ1cy1nb3Ytd2VzdC0xXCI6e1wiJFwiOjB9LFwidXMtd2VzdC0xXCI6e1wiJFwiOjB9LFwidXMtd2VzdC0yXCI6e1wiJFwiOjB9fSxcIm9uLWFwdGlibGVcIjp7XCIkXCI6MH0sXCJteWFzdXN0b3JcIjp7XCIkXCI6MH0sXCJiZXRhaW5hYm94XCI6e1wiJFwiOjB9LFwiYnBsYWNlZFwiOntcIiRcIjowfSxcImFyXCI6e1wiJFwiOjB9LFwiYnJcIjp7XCIkXCI6MH0sXCJjblwiOntcIiRcIjowfSxcImRlXCI6e1wiJFwiOjB9LFwiZXVcIjp7XCIkXCI6MH0sXCJnYlwiOntcIiRcIjowfSxcImh1XCI6e1wiJFwiOjB9LFwianBuXCI6e1wiJFwiOjB9LFwia3JcIjp7XCIkXCI6MH0sXCJtZXhcIjp7XCIkXCI6MH0sXCJub1wiOntcIiRcIjowfSxcInFjXCI6e1wiJFwiOjB9LFwicnVcIjp7XCIkXCI6MH0sXCJzYVwiOntcIiRcIjowfSxcInNlXCI6e1wiJFwiOjB9LFwidWtcIjp7XCIkXCI6MH0sXCJ1c1wiOntcIiRcIjowfSxcInV5XCI6e1wiJFwiOjB9LFwiemFcIjp7XCIkXCI6MH0sXCJhZnJpY2FcIjp7XCIkXCI6MH0sXCJnclwiOntcIiRcIjowfSxcImNvXCI6e1wiJFwiOjB9LFwieGVuYXBwb25henVyZVwiOntcIiRcIjowfSxcImpkZXZjbG91ZFwiOntcIiRcIjowfSxcIndwZGV2Y2xvdWRcIjp7XCIkXCI6MH0sXCJjbG91ZGNvbnRyb2xsZWRcIjp7XCIkXCI6MH0sXCJjbG91ZGNvbnRyb2xhcHBcIjp7XCIkXCI6MH0sXCJkcmF5ZGRuc1wiOntcIiRcIjowfSxcImRyZWFtaG9zdGVyc1wiOntcIiRcIjowfSxcIm15ZHJvYm9cIjp7XCIkXCI6MH0sXCJkeW5kbnMtYXQtaG9tZVwiOntcIiRcIjowfSxcImR5bmRucy1hdC13b3JrXCI6e1wiJFwiOjB9LFwiZHluZG5zLWJsb2dcIjp7XCIkXCI6MH0sXCJkeW5kbnMtZnJlZVwiOntcIiRcIjowfSxcImR5bmRucy1ob21lXCI6e1wiJFwiOjB9LFwiZHluZG5zLWlwXCI6e1wiJFwiOjB9LFwiZHluZG5zLW1haWxcIjp7XCIkXCI6MH0sXCJkeW5kbnMtb2ZmaWNlXCI6e1wiJFwiOjB9LFwiZHluZG5zLXBpY3NcIjp7XCIkXCI6MH0sXCJkeW5kbnMtcmVtb3RlXCI6e1wiJFwiOjB9LFwiZHluZG5zLXNlcnZlclwiOntcIiRcIjowfSxcImR5bmRucy13ZWJcIjp7XCIkXCI6MH0sXCJkeW5kbnMtd2lraVwiOntcIiRcIjowfSxcImR5bmRucy13b3JrXCI6e1wiJFwiOjB9LFwiYmxvZ2Ruc1wiOntcIiRcIjowfSxcImNlY2hpcmVcIjp7XCIkXCI6MH0sXCJkbnNhbGlhc1wiOntcIiRcIjowfSxcImRuc2Rvam9cIjp7XCIkXCI6MH0sXCJkb2VzbnRleGlzdFwiOntcIiRcIjowfSxcImRvbnRleGlzdFwiOntcIiRcIjowfSxcImRvb21kbnNcIjp7XCIkXCI6MH0sXCJkeW4tby1zYXVyXCI6e1wiJFwiOjB9LFwiZHluYWxpYXNcIjp7XCIkXCI6MH0sXCJlc3QtYS1sYS1tYWlzb25cIjp7XCIkXCI6MH0sXCJlc3QtYS1sYS1tYXNpb25cIjp7XCIkXCI6MH0sXCJlc3QtbGUtcGF0cm9uXCI6e1wiJFwiOjB9LFwiZXN0LW1vbi1ibG9ndWV1clwiOntcIiRcIjowfSxcImZyb20tYWtcIjp7XCIkXCI6MH0sXCJmcm9tLWFsXCI6e1wiJFwiOjB9LFwiZnJvbS1hclwiOntcIiRcIjowfSxcImZyb20tY2FcIjp7XCIkXCI6MH0sXCJmcm9tLWN0XCI6e1wiJFwiOjB9LFwiZnJvbS1kY1wiOntcIiRcIjowfSxcImZyb20tZGVcIjp7XCIkXCI6MH0sXCJmcm9tLWZsXCI6e1wiJFwiOjB9LFwiZnJvbS1nYVwiOntcIiRcIjowfSxcImZyb20taGlcIjp7XCIkXCI6MH0sXCJmcm9tLWlhXCI6e1wiJFwiOjB9LFwiZnJvbS1pZFwiOntcIiRcIjowfSxcImZyb20taWxcIjp7XCIkXCI6MH0sXCJmcm9tLWluXCI6e1wiJFwiOjB9LFwiZnJvbS1rc1wiOntcIiRcIjowfSxcImZyb20ta3lcIjp7XCIkXCI6MH0sXCJmcm9tLW1hXCI6e1wiJFwiOjB9LFwiZnJvbS1tZFwiOntcIiRcIjowfSxcImZyb20tbWlcIjp7XCIkXCI6MH0sXCJmcm9tLW1uXCI6e1wiJFwiOjB9LFwiZnJvbS1tb1wiOntcIiRcIjowfSxcImZyb20tbXNcIjp7XCIkXCI6MH0sXCJmcm9tLW10XCI6e1wiJFwiOjB9LFwiZnJvbS1uY1wiOntcIiRcIjowfSxcImZyb20tbmRcIjp7XCIkXCI6MH0sXCJmcm9tLW5lXCI6e1wiJFwiOjB9LFwiZnJvbS1uaFwiOntcIiRcIjowfSxcImZyb20tbmpcIjp7XCIkXCI6MH0sXCJmcm9tLW5tXCI6e1wiJFwiOjB9LFwiZnJvbS1udlwiOntcIiRcIjowfSxcImZyb20tb2hcIjp7XCIkXCI6MH0sXCJmcm9tLW9rXCI6e1wiJFwiOjB9LFwiZnJvbS1vclwiOntcIiRcIjowfSxcImZyb20tcGFcIjp7XCIkXCI6MH0sXCJmcm9tLXByXCI6e1wiJFwiOjB9LFwiZnJvbS1yaVwiOntcIiRcIjowfSxcImZyb20tc2NcIjp7XCIkXCI6MH0sXCJmcm9tLXNkXCI6e1wiJFwiOjB9LFwiZnJvbS10blwiOntcIiRcIjowfSxcImZyb20tdHhcIjp7XCIkXCI6MH0sXCJmcm9tLXV0XCI6e1wiJFwiOjB9LFwiZnJvbS12YVwiOntcIiRcIjowfSxcImZyb20tdnRcIjp7XCIkXCI6MH0sXCJmcm9tLXdhXCI6e1wiJFwiOjB9LFwiZnJvbS13aVwiOntcIiRcIjowfSxcImZyb20td3ZcIjp7XCIkXCI6MH0sXCJmcm9tLXd5XCI6e1wiJFwiOjB9LFwiZ2V0bXlpcFwiOntcIiRcIjowfSxcImdvdGRuc1wiOntcIiRcIjowfSxcImhvYmJ5LXNpdGVcIjp7XCIkXCI6MH0sXCJob21lbGludXhcIjp7XCIkXCI6MH0sXCJob21ldW5peFwiOntcIiRcIjowfSxcImlhbWFsbGFtYVwiOntcIiRcIjowfSxcImlzLWEtYW5hcmNoaXN0XCI6e1wiJFwiOjB9LFwiaXMtYS1ibG9nZ2VyXCI6e1wiJFwiOjB9LFwiaXMtYS1ib29ra2VlcGVyXCI6e1wiJFwiOjB9LFwiaXMtYS1idWxscy1mYW5cIjp7XCIkXCI6MH0sXCJpcy1hLWNhdGVyZXJcIjp7XCIkXCI6MH0sXCJpcy1hLWNoZWZcIjp7XCIkXCI6MH0sXCJpcy1hLWNvbnNlcnZhdGl2ZVwiOntcIiRcIjowfSxcImlzLWEtY3BhXCI6e1wiJFwiOjB9LFwiaXMtYS1jdWJpY2xlLXNsYXZlXCI6e1wiJFwiOjB9LFwiaXMtYS1kZW1vY3JhdFwiOntcIiRcIjowfSxcImlzLWEtZGVzaWduZXJcIjp7XCIkXCI6MH0sXCJpcy1hLWRvY3RvclwiOntcIiRcIjowfSxcImlzLWEtZmluYW5jaWFsYWR2aXNvclwiOntcIiRcIjowfSxcImlzLWEtZ2Vla1wiOntcIiRcIjowfSxcImlzLWEtZ3JlZW5cIjp7XCIkXCI6MH0sXCJpcy1hLWd1cnVcIjp7XCIkXCI6MH0sXCJpcy1hLWhhcmQtd29ya2VyXCI6e1wiJFwiOjB9LFwiaXMtYS1odW50ZXJcIjp7XCIkXCI6MH0sXCJpcy1hLWxhbmRzY2FwZXJcIjp7XCIkXCI6MH0sXCJpcy1hLWxhd3llclwiOntcIiRcIjowfSxcImlzLWEtbGliZXJhbFwiOntcIiRcIjowfSxcImlzLWEtbGliZXJ0YXJpYW5cIjp7XCIkXCI6MH0sXCJpcy1hLWxsYW1hXCI6e1wiJFwiOjB9LFwiaXMtYS1tdXNpY2lhblwiOntcIiRcIjowfSxcImlzLWEtbmFzY2FyZmFuXCI6e1wiJFwiOjB9LFwiaXMtYS1udXJzZVwiOntcIiRcIjowfSxcImlzLWEtcGFpbnRlclwiOntcIiRcIjowfSxcImlzLWEtcGVyc29uYWx0cmFpbmVyXCI6e1wiJFwiOjB9LFwiaXMtYS1waG90b2dyYXBoZXJcIjp7XCIkXCI6MH0sXCJpcy1hLXBsYXllclwiOntcIiRcIjowfSxcImlzLWEtcmVwdWJsaWNhblwiOntcIiRcIjowfSxcImlzLWEtcm9ja3N0YXJcIjp7XCIkXCI6MH0sXCJpcy1hLXNvY2lhbGlzdFwiOntcIiRcIjowfSxcImlzLWEtc3R1ZGVudFwiOntcIiRcIjowfSxcImlzLWEtdGVhY2hlclwiOntcIiRcIjowfSxcImlzLWEtdGVjaGllXCI6e1wiJFwiOjB9LFwiaXMtYS10aGVyYXBpc3RcIjp7XCIkXCI6MH0sXCJpcy1hbi1hY2NvdW50YW50XCI6e1wiJFwiOjB9LFwiaXMtYW4tYWN0b3JcIjp7XCIkXCI6MH0sXCJpcy1hbi1hY3RyZXNzXCI6e1wiJFwiOjB9LFwiaXMtYW4tYW5hcmNoaXN0XCI6e1wiJFwiOjB9LFwiaXMtYW4tYXJ0aXN0XCI6e1wiJFwiOjB9LFwiaXMtYW4tZW5naW5lZXJcIjp7XCIkXCI6MH0sXCJpcy1hbi1lbnRlcnRhaW5lclwiOntcIiRcIjowfSxcImlzLWNlcnRpZmllZFwiOntcIiRcIjowfSxcImlzLWdvbmVcIjp7XCIkXCI6MH0sXCJpcy1pbnRvLWFuaW1lXCI6e1wiJFwiOjB9LFwiaXMtaW50by1jYXJzXCI6e1wiJFwiOjB9LFwiaXMtaW50by1jYXJ0b29uc1wiOntcIiRcIjowfSxcImlzLWludG8tZ2FtZXNcIjp7XCIkXCI6MH0sXCJpcy1sZWV0XCI6e1wiJFwiOjB9LFwiaXMtbm90LWNlcnRpZmllZFwiOntcIiRcIjowfSxcImlzLXNsaWNrXCI6e1wiJFwiOjB9LFwiaXMtdWJlcmxlZXRcIjp7XCIkXCI6MH0sXCJpcy13aXRoLXRoZWJhbmRcIjp7XCIkXCI6MH0sXCJpc2EtZ2Vla1wiOntcIiRcIjowfSxcImlzYS1ob2NrZXludXRcIjp7XCIkXCI6MH0sXCJpc3NtYXJ0ZXJ0aGFueW91XCI6e1wiJFwiOjB9LFwibGlrZXMtcGllXCI6e1wiJFwiOjB9LFwibGlrZXNjYW5keVwiOntcIiRcIjowfSxcIm5lYXQtdXJsXCI6e1wiJFwiOjB9LFwic2F2ZXMtdGhlLXdoYWxlc1wiOntcIiRcIjowfSxcInNlbGZpcFwiOntcIiRcIjowfSxcInNlbGxzLWZvci1sZXNzXCI6e1wiJFwiOjB9LFwic2VsbHMtZm9yLXVcIjp7XCIkXCI6MH0sXCJzZXJ2ZWJic1wiOntcIiRcIjowfSxcInNpbXBsZS11cmxcIjp7XCIkXCI6MH0sXCJzcGFjZS10by1yZW50XCI6e1wiJFwiOjB9LFwidGVhY2hlcy15b2dhXCI6e1wiJFwiOjB9LFwid3JpdGVzdGhpc2Jsb2dcIjp7XCIkXCI6MH0sXCJkZG5zZnJlZVwiOntcIiRcIjowfSxcImRkbnNnZWVrXCI6e1wiJFwiOjB9LFwiZ2lpemVcIjp7XCIkXCI6MH0sXCJnbGVlemVcIjp7XCIkXCI6MH0sXCJrb3pvd1wiOntcIiRcIjowfSxcImxvc2V5b3VyaXBcIjp7XCIkXCI6MH0sXCJvb2d1eVwiOntcIiRcIjowfSxcInRoZXdvcmtwY1wiOntcIiRcIjowfSxcIm15dHVsZWFwXCI6e1wiJFwiOjB9LFwiZXZlbm5vZGVcIjp7XCJldS0xXCI6e1wiJFwiOjB9LFwiZXUtMlwiOntcIiRcIjowfSxcImV1LTNcIjp7XCIkXCI6MH0sXCJldS00XCI6e1wiJFwiOjB9LFwidXMtMVwiOntcIiRcIjowfSxcInVzLTJcIjp7XCIkXCI6MH0sXCJ1cy0zXCI6e1wiJFwiOjB9LFwidXMtNFwiOntcIiRcIjowfX0sXCJmYnNieFwiOntcImFwcHNcIjp7XCIkXCI6MH19LFwiZmlyZWJhc2VhcHBcIjp7XCIkXCI6MH0sXCJmbHlubmh1YlwiOntcIiRcIjowfSxcImZyZWVib3gtb3NcIjp7XCIkXCI6MH0sXCJmcmVlYm94b3NcIjp7XCIkXCI6MH0sXCJnaXRodWJ1c2VyY29udGVudFwiOntcIiRcIjowfSxcIjBlbW1cIjp7XCIqXCI6e1wiJFwiOjB9fSxcImFwcHNwb3RcIjp7XCIkXCI6MH0sXCJibG9nc3BvdFwiOntcIiRcIjowfSxcImNvZGVzcG90XCI6e1wiJFwiOjB9LFwiZ29vZ2xlYXBpc1wiOntcIiRcIjowfSxcImdvb2dsZWNvZGVcIjp7XCIkXCI6MH0sXCJwYWdlc3BlZWRtb2JpbGl6ZXJcIjp7XCIkXCI6MH0sXCJwdWJsaXNocHJveHlcIjp7XCIkXCI6MH0sXCJ3aXRoZ29vZ2xlXCI6e1wiJFwiOjB9LFwid2l0aHlvdXR1YmVcIjp7XCIkXCI6MH0sXCJoZXJva3VhcHBcIjp7XCIkXCI6MH0sXCJoZXJva3Vzc2xcIjp7XCIkXCI6MH0sXCJwaXhvbGlub1wiOntcIiRcIjowfSxcImpveWVudFwiOntcImNuc1wiOntcIipcIjp7XCIkXCI6MH19fSxcImJhcnN5b25saW5lXCI6e1wiJFwiOjB9LFwibWV0ZW9yYXBwXCI6e1wiJFwiOjAsXCJldVwiOntcIiRcIjowfX0sXCJiaXRiYWxsb29uXCI6e1wiJFwiOjB9LFwibmV0bGlmeVwiOntcIiRcIjowfSxcIjR1XCI6e1wiJFwiOjB9LFwibmZzaG9zdFwiOntcIiRcIjowfSxcImJsb2dzeXRlXCI6e1wiJFwiOjB9LFwiY2lzY29mcmVha1wiOntcIiRcIjowfSxcImRhbW5zZXJ2ZXJcIjp7XCIkXCI6MH0sXCJkaXRjaHlvdXJpcFwiOntcIiRcIjowfSxcImRuc2lza2lua3lcIjp7XCIkXCI6MH0sXCJkeW5uc1wiOntcIiRcIjowfSxcImdlZWtnYWxheHlcIjp7XCIkXCI6MH0sXCJoZWFsdGgtY2FyZXJlZm9ybVwiOntcIiRcIjowfSxcImhvbWVzZWN1cml0eW1hY1wiOntcIiRcIjowfSxcImhvbWVzZWN1cml0eXBjXCI6e1wiJFwiOjB9LFwibXlhY3RpdmVkaXJlY3RvcnlcIjp7XCIkXCI6MH0sXCJteXNlY3VyaXR5Y2FtZXJhXCI6e1wiJFwiOjB9LFwibmV0LWZyZWFrc1wiOntcIiRcIjowfSxcIm9udGhld2lmaVwiOntcIiRcIjowfSxcInBvaW50MnRoaXNcIjp7XCIkXCI6MH0sXCJxdWlja3N5dGVzXCI6e1wiJFwiOjB9LFwic2VjdXJpdHl0YWN0aWNzXCI6e1wiJFwiOjB9LFwic2VydmVleGNoYW5nZVwiOntcIiRcIjowfSxcInNlcnZlaHVtb3VyXCI6e1wiJFwiOjB9LFwic2VydmVwMnBcIjp7XCIkXCI6MH0sXCJzZXJ2ZXNhcmNhc21cIjp7XCIkXCI6MH0sXCJzdHVmZnRvcmVhZFwiOntcIiRcIjowfSxcInVudXN1YWxwZXJzb25cIjp7XCIkXCI6MH0sXCJ3b3JraXNib3JpbmdcIjp7XCIkXCI6MH0sXCIzdXRpbGl0aWVzXCI6e1wiJFwiOjB9LFwiZGRuc2tpbmdcIjp7XCIkXCI6MH0sXCJteXZuY1wiOntcIiRcIjowfSxcInNlcnZlYmVlclwiOntcIiRcIjowfSxcInNlcnZlY291bnRlcnN0cmlrZVwiOntcIiRcIjowfSxcInNlcnZlZnRwXCI6e1wiJFwiOjB9LFwic2VydmVnYW1lXCI6e1wiJFwiOjB9LFwic2VydmVoYWxmbGlmZVwiOntcIiRcIjowfSxcInNlcnZlaHR0cFwiOntcIiRcIjowfSxcInNlcnZlaXJjXCI6e1wiJFwiOjB9LFwic2VydmVtcDNcIjp7XCIkXCI6MH0sXCJzZXJ2ZXBpY3NcIjp7XCIkXCI6MH0sXCJzZXJ2ZXF1YWtlXCI6e1wiJFwiOjB9LFwib3BlcmF1bml0ZVwiOntcIiRcIjowfSxcIm91dHN5c3RlbXNjbG91ZFwiOntcIiRcIjowfSxcIm93bnByb3ZpZGVyXCI6e1wiJFwiOjB9LFwicGdmb2dcIjp7XCIkXCI6MH0sXCJwYWdlZnJvbnRhcHBcIjp7XCIkXCI6MH0sXCJnb3RwYW50aGVvblwiOntcIiRcIjowfSxcInByZ21yXCI6e1wieGVuXCI6e1wiJFwiOjB9fSxcInFhMlwiOntcIiRcIjowfSxcImRldi1teXFuYXBjbG91ZFwiOntcIiRcIjowfSxcImFscGhhLW15cW5hcGNsb3VkXCI6e1wiJFwiOjB9LFwibXlxbmFwY2xvdWRcIjp7XCIkXCI6MH0sXCJxdWlwZWxlbWVudHNcIjp7XCIqXCI6e1wiJFwiOjB9fSxcInJhY2ttYXplXCI6e1wiJFwiOjB9LFwicmhjbG91ZFwiOntcIiRcIjowfSxcImxvZ29pcFwiOntcIiRcIjowfSxcImZpcmV3YWxsLWdhdGV3YXlcIjp7XCIkXCI6MH0sXCJteXNob3BibG9ja3NcIjp7XCIkXCI6MH0sXCIxa2FwcFwiOntcIiRcIjowfSxcImFwcGNoaXppXCI6e1wiJFwiOjB9LFwiYXBwbGluemlcIjp7XCIkXCI6MH0sXCJzaW5hYXBwXCI6e1wiJFwiOjB9LFwidmlwc2luYWFwcFwiOntcIiRcIjowfSxcImJvdW50eS1mdWxsXCI6e1wiJFwiOjAsXCJhbHBoYVwiOntcIiRcIjowfSxcImJldGFcIjp7XCIkXCI6MH19LFwidGVtcC1kbnNcIjp7XCIkXCI6MH0sXCJkc215bmFzXCI6e1wiJFwiOjB9LFwiZmFtaWx5ZHNcIjp7XCIkXCI6MH0sXCJibG94Y21zXCI6e1wiJFwiOjB9LFwidG93bm5ld3Mtc3RhZ2luZ1wiOntcIiRcIjowfSxcImhrXCI6e1wiJFwiOjB9LFwicmVtb3Rld2RcIjp7XCIkXCI6MH0sXCJ5b2xhc2l0ZVwiOntcIiRcIjowfX0sXCJjb29wXCI6e1wiJFwiOjB9LFwiY3JcIjp7XCIkXCI6MCxcImFjXCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MH0sXCJlZFwiOntcIiRcIjowfSxcImZpXCI6e1wiJFwiOjB9LFwiZ29cIjp7XCIkXCI6MH0sXCJvclwiOntcIiRcIjowfSxcInNhXCI6e1wiJFwiOjB9fSxcImN1XCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJpbmZcIjp7XCIkXCI6MH19LFwiY3ZcIjp7XCIkXCI6MCxcImJsb2dzcG90XCI6e1wiJFwiOjB9fSxcImN3XCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH19LFwiY3hcIjp7XCIkXCI6MCxcImdvdlwiOntcIiRcIjowfSxcImF0aFwiOntcIiRcIjowfSxcImluZm9cIjp7XCIkXCI6MH19LFwiY3lcIjp7XCIkXCI6MCxcImFjXCI6e1wiJFwiOjB9LFwiYml6XCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjAsXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJla2xvZ2VzXCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwibHRkXCI6e1wiJFwiOjB9LFwibmFtZVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcInBhcmxpYW1lbnRcIjp7XCIkXCI6MH0sXCJwcmVzc1wiOntcIiRcIjowfSxcInByb1wiOntcIiRcIjowfSxcInRtXCI6e1wiJFwiOjB9fSxcImN6XCI6e1wiJFwiOjAsXCJjb1wiOntcIiRcIjowfSxcInJlYWxtXCI6e1wiJFwiOjB9LFwiZTRcIjp7XCIkXCI6MH0sXCJibG9nc3BvdFwiOntcIiRcIjowfSxcIm1ldGFjZW50cnVtXCI6e1wiY2xvdWRcIjp7XCIkXCI6MH0sXCJjdXN0b21cIjp7XCIkXCI6MH19fSxcImRlXCI6e1wiJFwiOjAsXCJicGxhY2VkXCI6e1wiJFwiOjB9LFwic3F1YXJlN1wiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcImNvc2lkbnNcIjp7XCJkeW5cIjp7XCIkXCI6MH19LFwiZHluYW1pc2NoZXMtZG5zXCI6e1wiJFwiOjB9LFwiZG5zdXBkYXRlclwiOntcIiRcIjowfSxcImludGVybmV0LWRuc1wiOntcIiRcIjowfSxcImwtby1nLWktblwiOntcIiRcIjowfSxcImRuc2hvbWVcIjp7XCIkXCI6MH0sXCJmdWV0dGVydGRhc25ldHpcIjp7XCIkXCI6MH0sXCJpc3RlaW5nZWVrXCI6e1wiJFwiOjB9LFwiaXN0bWVpblwiOntcIiRcIjowfSxcImxlYnRpbW5ldHpcIjp7XCIkXCI6MH0sXCJsZWl0dW5nc2VuXCI6e1wiJFwiOjB9LFwidHJhZXVtdGdlcmFkZVwiOntcIiRcIjowfSxcImRkbnNzXCI6e1wiJFwiOjAsXCJkeW5cIjp7XCIkXCI6MH0sXCJkeW5kbnNcIjp7XCIkXCI6MH19LFwiZHluZG5zMVwiOntcIiRcIjowfSxcImR5bi1pcDI0XCI6e1wiJFwiOjB9LFwiaG9tZS13ZWJzZXJ2ZXJcIjp7XCIkXCI6MCxcImR5blwiOntcIiRcIjowfX0sXCJteWhvbWUtc2VydmVyXCI6e1wiJFwiOjB9LFwiZ29pcFwiOntcIiRcIjowfSxcImJsb2dzcG90XCI6e1wiJFwiOjB9LFwia2V5bWFjaGluZVwiOntcIiRcIjowfSxcImdpdC1yZXBvc1wiOntcIiRcIjowfSxcImxjdWJlLXNlcnZlclwiOntcIiRcIjowfSxcInN2bi1yZXBvc1wiOntcIiRcIjowfSxcImJhcnN5XCI6e1wiJFwiOjB9LFwibG9nb2lwXCI6e1wiJFwiOjB9LFwiZmlyZXdhbGwtZ2F0ZXdheVwiOntcIiRcIjowfSxcIm15LWdhdGV3YXlcIjp7XCIkXCI6MH0sXCJteS1yb3V0ZXJcIjp7XCIkXCI6MH0sXCJzcGRuc1wiOntcIiRcIjowfSxcInRhaWZ1bi1kbnNcIjp7XCIkXCI6MH0sXCIxMmhwXCI6e1wiJFwiOjB9LFwiMml4XCI6e1wiJFwiOjB9LFwiNGxpbWFcIjp7XCIkXCI6MH0sXCJsaW1hLWNpdHlcIjp7XCIkXCI6MH0sXCJkZC1kbnNcIjp7XCIkXCI6MH0sXCJkcmF5LWRuc1wiOntcIiRcIjowfSxcImRyYXlkbnNcIjp7XCIkXCI6MH0sXCJkeW4tdnBuXCI6e1wiJFwiOjB9LFwiZHludnBuXCI6e1wiJFwiOjB9LFwibWVpbi12aWdvclwiOntcIiRcIjowfSxcIm15LXZpZ29yXCI6e1wiJFwiOjB9LFwibXktd2FuXCI6e1wiJFwiOjB9LFwic3luby1kc1wiOntcIiRcIjowfSxcInN5bm9sb2d5LWRpc2tzdGF0aW9uXCI6e1wiJFwiOjB9LFwic3lub2xvZ3ktZHNcIjp7XCIkXCI6MH19LFwiZGpcIjp7XCIkXCI6MH0sXCJka1wiOntcIiRcIjowLFwiYml6XCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MH0sXCJmaXJtXCI6e1wiJFwiOjB9LFwicmVnXCI6e1wiJFwiOjB9LFwic3RvcmVcIjp7XCIkXCI6MH0sXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJkbVwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9fSxcImRvXCI6e1wiJFwiOjAsXCJhcnRcIjp7XCIkXCI6MH0sXCJjb21cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb2JcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJzbGRcIjp7XCIkXCI6MH0sXCJ3ZWJcIjp7XCIkXCI6MH19LFwiZHpcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImFzc29cIjp7XCIkXCI6MH0sXCJwb2xcIjp7XCIkXCI6MH0sXCJhcnRcIjp7XCIkXCI6MH19LFwiZWNcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcImluZm9cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJmaW5cIjp7XCIkXCI6MH0sXCJrMTJcIjp7XCIkXCI6MH0sXCJtZWRcIjp7XCIkXCI6MH0sXCJwcm9cIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJnb2JcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH19LFwiZWR1XCI6e1wiJFwiOjB9LFwiZWVcIjp7XCIkXCI6MCxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcInJpaWtcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH0sXCJtZWRcIjp7XCIkXCI6MH0sXCJjb21cIjp7XCIkXCI6MCxcImJsb2dzcG90XCI6e1wiJFwiOjB9fSxcInByaVwiOntcIiRcIjowfSxcImFpcFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImZpZVwiOntcIiRcIjowfX0sXCJlZ1wiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjAsXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJlZHVcIjp7XCIkXCI6MH0sXCJldW5cIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJuYW1lXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwic2NpXCI6e1wiJFwiOjB9fSxcImVyXCI6e1wiKlwiOntcIiRcIjowfX0sXCJlc1wiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjAsXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJub21cIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJnb2JcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH19LFwiZXRcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImJpelwiOntcIiRcIjowfSxcIm5hbWVcIjp7XCIkXCI6MH0sXCJpbmZvXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9fSxcImV1XCI6e1wiJFwiOjAsXCJteWNkXCI6e1wiJFwiOjB9LFwiY2xvdWRuc1wiOntcIiRcIjowfSxcImJhcnN5XCI6e1wiJFwiOjB9LFwid2VsbGJlaW5nem9uZVwiOntcIiRcIjowfSxcInNwZG5zXCI6e1wiJFwiOjB9LFwidHJhbnN1cmxcIjp7XCIqXCI6e1wiJFwiOjB9fSxcImRpc2tzdGF0aW9uXCI6e1wiJFwiOjB9fSxcImZpXCI6e1wiJFwiOjAsXCJhbGFuZFwiOntcIiRcIjowfSxcImR5XCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH0sXCJpa2lcIjp7XCIkXCI6MH19LFwiZmpcIjp7XCIqXCI6e1wiJFwiOjB9fSxcImZrXCI6e1wiKlwiOntcIiRcIjowfX0sXCJmbVwiOntcIiRcIjowfSxcImZvXCI6e1wiJFwiOjB9LFwiZnJcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcImFzc29cIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH0sXCJwcmRcIjp7XCIkXCI6MH0sXCJwcmVzc2VcIjp7XCIkXCI6MH0sXCJ0bVwiOntcIiRcIjowfSxcImFlcm9wb3J0XCI6e1wiJFwiOjB9LFwiYXNzZWRpY1wiOntcIiRcIjowfSxcImF2b2NhdFwiOntcIiRcIjowfSxcImF2b3Vlc1wiOntcIiRcIjowfSxcImNjaVwiOntcIiRcIjowfSxcImNoYW1iYWdyaVwiOntcIiRcIjowfSxcImNoaXJ1cmdpZW5zLWRlbnRpc3Rlc1wiOntcIiRcIjowfSxcImV4cGVydHMtY29tcHRhYmxlc1wiOntcIiRcIjowfSxcImdlb21ldHJlLWV4cGVydFwiOntcIiRcIjowfSxcImdvdXZcIjp7XCIkXCI6MH0sXCJncmV0YVwiOntcIiRcIjowfSxcImh1aXNzaWVyLWp1c3RpY2VcIjp7XCIkXCI6MH0sXCJtZWRlY2luXCI6e1wiJFwiOjB9LFwibm90YWlyZXNcIjp7XCIkXCI6MH0sXCJwaGFybWFjaWVuXCI6e1wiJFwiOjB9LFwicG9ydFwiOntcIiRcIjowfSxcInZldGVyaW5haXJlXCI6e1wiJFwiOjB9LFwiZmJ4LW9zXCI6e1wiJFwiOjB9LFwiZmJ4b3NcIjp7XCIkXCI6MH0sXCJmcmVlYm94LW9zXCI6e1wiJFwiOjB9LFwiZnJlZWJveG9zXCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH0sXCJvbi13ZWJcIjp7XCIkXCI6MH0sXCJjaGlydXJnaWVucy1kZW50aXN0ZXMtZW4tZnJhbmNlXCI6e1wiJFwiOjB9fSxcImdhXCI6e1wiJFwiOjB9LFwiZ2JcIjp7XCIkXCI6MH0sXCJnZFwiOntcIiRcIjowLFwibm9tXCI6e1wiJFwiOjB9fSxcImdlXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJwdnRcIjp7XCIkXCI6MH19LFwiZ2ZcIjp7XCIkXCI6MH0sXCJnZ1wiOntcIiRcIjowLFwiY29cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJjeWFcIjp7XCIkXCI6MH19LFwiZ2hcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIm1pbFwiOntcIiRcIjowfX0sXCJnaVwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwibHRkXCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwibW9kXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9fSxcImdsXCI6e1wiJFwiOjAsXCJjb1wiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIm5vbVwiOntcIiRcIjowfX0sXCJnbVwiOntcIiRcIjowfSxcImduXCI6e1wiJFwiOjAsXCJhY1wiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfX0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJncFwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwibW9iaVwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImFzc29cIjp7XCIkXCI6MH19LFwiZ3FcIjp7XCIkXCI6MH0sXCJnclwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH0sXCJueW1cIjp7XCIkXCI6MH19LFwiZ3NcIjp7XCIkXCI6MH0sXCJndFwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ29iXCI6e1wiJFwiOjB9LFwiaW5kXCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwibm9tXCI6e1wiJFwiOjB9fSxcImd1XCI6e1wiKlwiOntcIiRcIjowfX0sXCJnd1wiOntcIiRcIjowfSxcImd5XCI6e1wiJFwiOjAsXCJjb1wiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfX0sXCJoa1wiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwiaWR2XCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwieG4tLTU1cXg1ZFwiOntcIiRcIjowfSxcInhuLS13Y3ZzMjJkXCI6e1wiJFwiOjB9LFwieG4tLWxjdnIzMmRcIjp7XCIkXCI6MH0sXCJ4bi0tbXh0cTFtXCI6e1wiJFwiOjB9LFwieG4tLWdtcXc1YVwiOntcIiRcIjowfSxcInhuLS1jaXFwblwiOntcIiRcIjowfSxcInhuLS1nbXEwNTBpXCI6e1wiJFwiOjB9LFwieG4tLXpmMGF2eFwiOntcIiRcIjowfSxcInhuLS1pbzBhN2lcIjp7XCIkXCI6MH0sXCJ4bi0tbWswYXhpXCI6e1wiJFwiOjB9LFwieG4tLW9kMGFsZ1wiOntcIiRcIjowfSxcInhuLS1vZDBhcTNiXCI6e1wiJFwiOjB9LFwieG4tLXRuMGFnXCI6e1wiJFwiOjB9LFwieG4tLXVjMGF0dlwiOntcIiRcIjowfSxcInhuLS11YzBheTRhXCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH0sXCJsdGRcIjp7XCIkXCI6MH0sXCJpbmNcIjp7XCIkXCI6MH19LFwiaG1cIjp7XCIkXCI6MH0sXCJoblwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwiZ29iXCI6e1wiJFwiOjB9LFwibm9tXCI6e1wiJFwiOjB9fSxcImhyXCI6e1wiJFwiOjAsXCJpelwiOntcIiRcIjowfSxcImZyb21cIjp7XCIkXCI6MH0sXCJuYW1lXCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH19LFwiaHRcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcInNob3BcIjp7XCIkXCI6MH0sXCJmaXJtXCI6e1wiJFwiOjB9LFwiaW5mb1wiOntcIiRcIjowfSxcImFkdWx0XCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwicHJvXCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwibWVkXCI6e1wiJFwiOjB9LFwiYXJ0XCI6e1wiJFwiOjB9LFwiY29vcFwiOntcIiRcIjowfSxcInBvbFwiOntcIiRcIjowfSxcImFzc29cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJyZWxcIjp7XCIkXCI6MH0sXCJnb3V2XCI6e1wiJFwiOjB9LFwicGVyc29cIjp7XCIkXCI6MH19LFwiaHVcIjp7XCIyMDAwXCI6e1wiJFwiOjB9LFwiJFwiOjAsXCJjb1wiOntcIiRcIjowfSxcImluZm9cIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJwcml2XCI6e1wiJFwiOjB9LFwic3BvcnRcIjp7XCIkXCI6MH0sXCJ0bVwiOntcIiRcIjowfSxcImFncmFyXCI6e1wiJFwiOjB9LFwiYm9sdFwiOntcIiRcIjowfSxcImNhc2lub1wiOntcIiRcIjowfSxcImNpdHlcIjp7XCIkXCI6MH0sXCJlcm90aWNhXCI6e1wiJFwiOjB9LFwiZXJvdGlrYVwiOntcIiRcIjowfSxcImZpbG1cIjp7XCIkXCI6MH0sXCJmb3J1bVwiOntcIiRcIjowfSxcImdhbWVzXCI6e1wiJFwiOjB9LFwiaG90ZWxcIjp7XCIkXCI6MH0sXCJpbmdhdGxhblwiOntcIiRcIjowfSxcImpvZ2FzelwiOntcIiRcIjowfSxcImtvbnl2ZWxvXCI6e1wiJFwiOjB9LFwibGFrYXNcIjp7XCIkXCI6MH0sXCJtZWRpYVwiOntcIiRcIjowfSxcIm5ld3NcIjp7XCIkXCI6MH0sXCJyZWtsYW1cIjp7XCIkXCI6MH0sXCJzZXhcIjp7XCIkXCI6MH0sXCJzaG9wXCI6e1wiJFwiOjB9LFwic3VsaVwiOntcIiRcIjowfSxcInN6ZXhcIjp7XCIkXCI6MH0sXCJ0b3pzZGVcIjp7XCIkXCI6MH0sXCJ1dGF6YXNcIjp7XCIkXCI6MH0sXCJ2aWRlb1wiOntcIiRcIjowfSxcImJsb2dzcG90XCI6e1wiJFwiOjB9fSxcImlkXCI6e1wiJFwiOjAsXCJhY1wiOntcIiRcIjowfSxcImJpelwiOntcIiRcIjowfSxcImNvXCI6e1wiJFwiOjAsXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJkZXNhXCI6e1wiJFwiOjB9LFwiZ29cIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJteVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yXCI6e1wiJFwiOjB9LFwic2NoXCI6e1wiJFwiOjB9LFwid2ViXCI6e1wiJFwiOjB9fSxcImllXCI6e1wiJFwiOjAsXCJnb3ZcIjp7XCIkXCI6MH0sXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJpbFwiOntcIiRcIjowLFwiYWNcIjp7XCIkXCI6MH0sXCJjb1wiOntcIiRcIjowLFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH19LFwiZ292XCI6e1wiJFwiOjB9LFwiaWRmXCI6e1wiJFwiOjB9LFwiazEyXCI6e1wiJFwiOjB9LFwibXVuaVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfX0sXCJpbVwiOntcIiRcIjowLFwiYWNcIjp7XCIkXCI6MH0sXCJjb1wiOntcIiRcIjowLFwibHRkXCI6e1wiJFwiOjB9LFwicGxjXCI6e1wiJFwiOjB9fSxcImNvbVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcInR0XCI6e1wiJFwiOjB9LFwidHZcIjp7XCIkXCI6MH0sXCJyb1wiOntcIiRcIjowfSxcIm5vbVwiOntcIiRcIjowfX0sXCJpblwiOntcIiRcIjowLFwiY29cIjp7XCIkXCI6MH0sXCJmaXJtXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiZ2VuXCI6e1wiJFwiOjB9LFwiaW5kXCI6e1wiJFwiOjB9LFwibmljXCI6e1wiJFwiOjB9LFwiYWNcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJyZXNcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJjbG91ZG5zXCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH0sXCJiYXJzeVwiOntcIiRcIjowfX0sXCJpbmZvXCI6e1wiJFwiOjAsXCJjbG91ZG5zXCI6e1wiJFwiOjB9LFwiZHluYW1pYy1kbnNcIjp7XCIkXCI6MH0sXCJkeW5kbnNcIjp7XCIkXCI6MH0sXCJiYXJyZWwtb2Yta25vd2xlZGdlXCI6e1wiJFwiOjB9LFwiYmFycmVsbC1vZi1rbm93bGVkZ2VcIjp7XCIkXCI6MH0sXCJmb3Itb3VyXCI6e1wiJFwiOjB9LFwiZ3Jva3MtdGhlXCI6e1wiJFwiOjB9LFwiZ3Jva3MtdGhpc1wiOntcIiRcIjowfSxcImhlcmUtZm9yLW1vcmVcIjp7XCIkXCI6MH0sXCJrbm93c2l0YWxsXCI6e1wiJFwiOjB9LFwic2VsZmlwXCI6e1wiJFwiOjB9LFwid2ViaG9wXCI6e1wiJFwiOjB9LFwibnN1cGRhdGVcIjp7XCIkXCI6MH0sXCJkdnJjYW1cIjp7XCIkXCI6MH0sXCJpbG92ZWNvbGxlZ2VcIjp7XCIkXCI6MH0sXCJuby1pcFwiOntcIiRcIjowfSxcInYtaW5mb1wiOntcIiRcIjowfX0sXCJpbnRcIjp7XCIkXCI6MCxcImV1XCI6e1wiJFwiOjB9fSxcImlvXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJiYWNrcGxhbmVhcHBcIjp7XCIkXCI6MH0sXCJib3hmdXNlXCI6e1wiJFwiOjB9LFwiYnJvd3NlcnNhZmV0eW1hcmtcIjp7XCIkXCI6MH0sXCJkZWR5blwiOntcIiRcIjowfSxcImRydWRcIjp7XCIkXCI6MH0sXCJkZWZpbmltYVwiOntcIiRcIjowfSxcImVub25pY1wiOntcIiRcIjowLFwiY3VzdG9tZXJcIjp7XCIkXCI6MH19LFwiZ2l0aHViXCI6e1wiJFwiOjB9LFwiZ2l0bGFiXCI6e1wiJFwiOjB9LFwiaGFzdXJhLWFwcFwiOntcIiRcIjowfSxcIm5ncm9rXCI6e1wiJFwiOjB9LFwibm9kZWFydFwiOntcInN0YWdlXCI6e1wiJFwiOjB9fSxcIm5vZHVtXCI6e1wiJFwiOjB9LFwibmlkXCI6e1wiJFwiOjB9LFwicGFudGhlb25zaXRlXCI6e1wiJFwiOjB9LFwicHJvdG9uZXRcIjp7XCIkXCI6MH0sXCJ2YXBvcmNsb3VkXCI6e1wiJFwiOjB9LFwiaHpjXCI6e1wiJFwiOjB9LFwic2FuZGNhdHNcIjp7XCIkXCI6MH0sXCJzaGlmdGVkaXRcIjp7XCIkXCI6MH0sXCJsYWlyXCI6e1wiYXBwc1wiOntcIiRcIjowfX0sXCJzdG9sb3NcIjp7XCIqXCI6e1wiJFwiOjB9fSxcInNwYWNla2l0XCI6e1wiJFwiOjB9LFwidGhpbmdkdXN0XCI6e1wiZGV2XCI6e1wiY3VzdFwiOntcIiRcIjowfX0sXCJkaXNyZWNcIjp7XCJjdXN0XCI6e1wiJFwiOjB9fSxcInByb2RcIjp7XCJjdXN0XCI6e1wiJFwiOjB9fSxcInRlc3RpbmdcIjp7XCJjdXN0XCI6e1wiJFwiOjB9fX0sXCJ3ZWRlcGxveVwiOntcIiRcIjowfX0sXCJpcVwiOntcIiRcIjowLFwiZ292XCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9fSxcImlyXCI6e1wiJFwiOjAsXCJhY1wiOntcIiRcIjowfSxcImNvXCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwiaWRcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJzY2hcIjp7XCIkXCI6MH0sXCJ4bi0tbWdiYTNhNGYxNmFcIjp7XCIkXCI6MH0sXCJ4bi0tbWdiYTNhNGZyYVwiOntcIiRcIjowfX0sXCJpc1wiOntcIiRcIjowLFwibmV0XCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiaW50XCI6e1wiJFwiOjB9LFwiY3VwY2FrZVwiOntcIiRcIjowfSxcImJsb2dzcG90XCI6e1wiJFwiOjB9fSxcIml0XCI6e1wiJFwiOjAsXCJnb3ZcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJhYnJcIjp7XCIkXCI6MH0sXCJhYnJ1enpvXCI6e1wiJFwiOjB9LFwiYW9zdGEtdmFsbGV5XCI6e1wiJFwiOjB9LFwiYW9zdGF2YWxsZXlcIjp7XCIkXCI6MH0sXCJiYXNcIjp7XCIkXCI6MH0sXCJiYXNpbGljYXRhXCI6e1wiJFwiOjB9LFwiY2FsXCI6e1wiJFwiOjB9LFwiY2FsYWJyaWFcIjp7XCIkXCI6MH0sXCJjYW1cIjp7XCIkXCI6MH0sXCJjYW1wYW5pYVwiOntcIiRcIjowfSxcImVtaWxpYS1yb21hZ25hXCI6e1wiJFwiOjB9LFwiZW1pbGlhcm9tYWduYVwiOntcIiRcIjowfSxcImVtclwiOntcIiRcIjowfSxcImZyaXVsaS12LWdpdWxpYVwiOntcIiRcIjowfSxcImZyaXVsaS12ZS1naXVsaWFcIjp7XCIkXCI6MH0sXCJmcml1bGktdmVnaXVsaWFcIjp7XCIkXCI6MH0sXCJmcml1bGktdmVuZXppYS1naXVsaWFcIjp7XCIkXCI6MH0sXCJmcml1bGktdmVuZXppYWdpdWxpYVwiOntcIiRcIjowfSxcImZyaXVsaS12Z2l1bGlhXCI6e1wiJFwiOjB9LFwiZnJpdWxpdi1naXVsaWFcIjp7XCIkXCI6MH0sXCJmcml1bGl2ZS1naXVsaWFcIjp7XCIkXCI6MH0sXCJmcml1bGl2ZWdpdWxpYVwiOntcIiRcIjowfSxcImZyaXVsaXZlbmV6aWEtZ2l1bGlhXCI6e1wiJFwiOjB9LFwiZnJpdWxpdmVuZXppYWdpdWxpYVwiOntcIiRcIjowfSxcImZyaXVsaXZnaXVsaWFcIjp7XCIkXCI6MH0sXCJmdmdcIjp7XCIkXCI6MH0sXCJsYXpcIjp7XCIkXCI6MH0sXCJsYXppb1wiOntcIiRcIjowfSxcImxpZ1wiOntcIiRcIjowfSxcImxpZ3VyaWFcIjp7XCIkXCI6MH0sXCJsb21cIjp7XCIkXCI6MH0sXCJsb21iYXJkaWFcIjp7XCIkXCI6MH0sXCJsb21iYXJkeVwiOntcIiRcIjowfSxcImx1Y2FuaWFcIjp7XCIkXCI6MH0sXCJtYXJcIjp7XCIkXCI6MH0sXCJtYXJjaGVcIjp7XCIkXCI6MH0sXCJtb2xcIjp7XCIkXCI6MH0sXCJtb2xpc2VcIjp7XCIkXCI6MH0sXCJwaWVkbW9udFwiOntcIiRcIjowfSxcInBpZW1vbnRlXCI6e1wiJFwiOjB9LFwicG1uXCI6e1wiJFwiOjB9LFwicHVnXCI6e1wiJFwiOjB9LFwicHVnbGlhXCI6e1wiJFwiOjB9LFwic2FyXCI6e1wiJFwiOjB9LFwic2FyZGVnbmFcIjp7XCIkXCI6MH0sXCJzYXJkaW5pYVwiOntcIiRcIjowfSxcInNpY1wiOntcIiRcIjowfSxcInNpY2lsaWFcIjp7XCIkXCI6MH0sXCJzaWNpbHlcIjp7XCIkXCI6MH0sXCJ0YWFcIjp7XCIkXCI6MH0sXCJ0b3NcIjp7XCIkXCI6MH0sXCJ0b3NjYW5hXCI6e1wiJFwiOjB9LFwidHJlbnRpbm8tYS1hZGlnZVwiOntcIiRcIjowfSxcInRyZW50aW5vLWFhZGlnZVwiOntcIiRcIjowfSxcInRyZW50aW5vLWFsdG8tYWRpZ2VcIjp7XCIkXCI6MH0sXCJ0cmVudGluby1hbHRvYWRpZ2VcIjp7XCIkXCI6MH0sXCJ0cmVudGluby1zLXRpcm9sXCI6e1wiJFwiOjB9LFwidHJlbnRpbm8tc3Rpcm9sXCI6e1wiJFwiOjB9LFwidHJlbnRpbm8tc3VkLXRpcm9sXCI6e1wiJFwiOjB9LFwidHJlbnRpbm8tc3VkdGlyb2xcIjp7XCIkXCI6MH0sXCJ0cmVudGluby1zdWVkLXRpcm9sXCI6e1wiJFwiOjB9LFwidHJlbnRpbm8tc3VlZHRpcm9sXCI6e1wiJFwiOjB9LFwidHJlbnRpbm9hLWFkaWdlXCI6e1wiJFwiOjB9LFwidHJlbnRpbm9hYWRpZ2VcIjp7XCIkXCI6MH0sXCJ0cmVudGlub2FsdG8tYWRpZ2VcIjp7XCIkXCI6MH0sXCJ0cmVudGlub2FsdG9hZGlnZVwiOntcIiRcIjowfSxcInRyZW50aW5vcy10aXJvbFwiOntcIiRcIjowfSxcInRyZW50aW5vc3Rpcm9sXCI6e1wiJFwiOjB9LFwidHJlbnRpbm9zdWQtdGlyb2xcIjp7XCIkXCI6MH0sXCJ0cmVudGlub3N1ZHRpcm9sXCI6e1wiJFwiOjB9LFwidHJlbnRpbm9zdWVkLXRpcm9sXCI6e1wiJFwiOjB9LFwidHJlbnRpbm9zdWVkdGlyb2xcIjp7XCIkXCI6MH0sXCJ0dXNjYW55XCI6e1wiJFwiOjB9LFwidW1iXCI6e1wiJFwiOjB9LFwidW1icmlhXCI6e1wiJFwiOjB9LFwidmFsLWQtYW9zdGFcIjp7XCIkXCI6MH0sXCJ2YWwtZGFvc3RhXCI6e1wiJFwiOjB9LFwidmFsZC1hb3N0YVwiOntcIiRcIjowfSxcInZhbGRhb3N0YVwiOntcIiRcIjowfSxcInZhbGxlLWFvc3RhXCI6e1wiJFwiOjB9LFwidmFsbGUtZC1hb3N0YVwiOntcIiRcIjowfSxcInZhbGxlLWRhb3N0YVwiOntcIiRcIjowfSxcInZhbGxlYW9zdGFcIjp7XCIkXCI6MH0sXCJ2YWxsZWQtYW9zdGFcIjp7XCIkXCI6MH0sXCJ2YWxsZWRhb3N0YVwiOntcIiRcIjowfSxcInZhbGxlZS1hb3N0ZVwiOntcIiRcIjowfSxcInZhbGxlZWFvc3RlXCI6e1wiJFwiOjB9LFwidmFvXCI6e1wiJFwiOjB9LFwidmRhXCI6e1wiJFwiOjB9LFwidmVuXCI6e1wiJFwiOjB9LFwidmVuZXRvXCI6e1wiJFwiOjB9LFwiYWdcIjp7XCIkXCI6MH0sXCJhZ3JpZ2VudG9cIjp7XCIkXCI6MH0sXCJhbFwiOntcIiRcIjowfSxcImFsZXNzYW5kcmlhXCI6e1wiJFwiOjB9LFwiYWx0by1hZGlnZVwiOntcIiRcIjowfSxcImFsdG9hZGlnZVwiOntcIiRcIjowfSxcImFuXCI6e1wiJFwiOjB9LFwiYW5jb25hXCI6e1wiJFwiOjB9LFwiYW5kcmlhLWJhcmxldHRhLXRyYW5pXCI6e1wiJFwiOjB9LFwiYW5kcmlhLXRyYW5pLWJhcmxldHRhXCI6e1wiJFwiOjB9LFwiYW5kcmlhYmFybGV0dGF0cmFuaVwiOntcIiRcIjowfSxcImFuZHJpYXRyYW5pYmFybGV0dGFcIjp7XCIkXCI6MH0sXCJhb1wiOntcIiRcIjowfSxcImFvc3RhXCI6e1wiJFwiOjB9LFwiYW9zdGVcIjp7XCIkXCI6MH0sXCJhcFwiOntcIiRcIjowfSxcImFxXCI6e1wiJFwiOjB9LFwiYXF1aWxhXCI6e1wiJFwiOjB9LFwiYXJcIjp7XCIkXCI6MH0sXCJhcmV6em9cIjp7XCIkXCI6MH0sXCJhc2NvbGktcGljZW5vXCI6e1wiJFwiOjB9LFwiYXNjb2xpcGljZW5vXCI6e1wiJFwiOjB9LFwiYXN0aVwiOntcIiRcIjowfSxcImF0XCI6e1wiJFwiOjB9LFwiYXZcIjp7XCIkXCI6MH0sXCJhdmVsbGlub1wiOntcIiRcIjowfSxcImJhXCI6e1wiJFwiOjB9LFwiYmFsc2FuXCI6e1wiJFwiOjB9LFwiYmFyaVwiOntcIiRcIjowfSxcImJhcmxldHRhLXRyYW5pLWFuZHJpYVwiOntcIiRcIjowfSxcImJhcmxldHRhdHJhbmlhbmRyaWFcIjp7XCIkXCI6MH0sXCJiZWxsdW5vXCI6e1wiJFwiOjB9LFwiYmVuZXZlbnRvXCI6e1wiJFwiOjB9LFwiYmVyZ2Ftb1wiOntcIiRcIjowfSxcImJnXCI6e1wiJFwiOjB9LFwiYmlcIjp7XCIkXCI6MH0sXCJiaWVsbGFcIjp7XCIkXCI6MH0sXCJibFwiOntcIiRcIjowfSxcImJuXCI6e1wiJFwiOjB9LFwiYm9cIjp7XCIkXCI6MH0sXCJib2xvZ25hXCI6e1wiJFwiOjB9LFwiYm9semFub1wiOntcIiRcIjowfSxcImJvemVuXCI6e1wiJFwiOjB9LFwiYnJcIjp7XCIkXCI6MH0sXCJicmVzY2lhXCI6e1wiJFwiOjB9LFwiYnJpbmRpc2lcIjp7XCIkXCI6MH0sXCJic1wiOntcIiRcIjowfSxcImJ0XCI6e1wiJFwiOjB9LFwiYnpcIjp7XCIkXCI6MH0sXCJjYVwiOntcIiRcIjowfSxcImNhZ2xpYXJpXCI6e1wiJFwiOjB9LFwiY2FsdGFuaXNzZXR0YVwiOntcIiRcIjowfSxcImNhbXBpZGFuby1tZWRpb1wiOntcIiRcIjowfSxcImNhbXBpZGFub21lZGlvXCI6e1wiJFwiOjB9LFwiY2FtcG9iYXNzb1wiOntcIiRcIjowfSxcImNhcmJvbmlhLWlnbGVzaWFzXCI6e1wiJFwiOjB9LFwiY2FyYm9uaWFpZ2xlc2lhc1wiOntcIiRcIjowfSxcImNhcnJhcmEtbWFzc2FcIjp7XCIkXCI6MH0sXCJjYXJyYXJhbWFzc2FcIjp7XCIkXCI6MH0sXCJjYXNlcnRhXCI6e1wiJFwiOjB9LFwiY2F0YW5pYVwiOntcIiRcIjowfSxcImNhdGFuemFyb1wiOntcIiRcIjowfSxcImNiXCI6e1wiJFwiOjB9LFwiY2VcIjp7XCIkXCI6MH0sXCJjZXNlbmEtZm9ybGlcIjp7XCIkXCI6MH0sXCJjZXNlbmFmb3JsaVwiOntcIiRcIjowfSxcImNoXCI6e1wiJFwiOjB9LFwiY2hpZXRpXCI6e1wiJFwiOjB9LFwiY2lcIjp7XCIkXCI6MH0sXCJjbFwiOntcIiRcIjowfSxcImNuXCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MH0sXCJjb21vXCI6e1wiJFwiOjB9LFwiY29zZW56YVwiOntcIiRcIjowfSxcImNyXCI6e1wiJFwiOjB9LFwiY3JlbW9uYVwiOntcIiRcIjowfSxcImNyb3RvbmVcIjp7XCIkXCI6MH0sXCJjc1wiOntcIiRcIjowfSxcImN0XCI6e1wiJFwiOjB9LFwiY3VuZW9cIjp7XCIkXCI6MH0sXCJjelwiOntcIiRcIjowfSxcImRlbGwtb2dsaWFzdHJhXCI6e1wiJFwiOjB9LFwiZGVsbG9nbGlhc3RyYVwiOntcIiRcIjowfSxcImVuXCI6e1wiJFwiOjB9LFwiZW5uYVwiOntcIiRcIjowfSxcImZjXCI6e1wiJFwiOjB9LFwiZmVcIjp7XCIkXCI6MH0sXCJmZXJtb1wiOntcIiRcIjowfSxcImZlcnJhcmFcIjp7XCIkXCI6MH0sXCJmZ1wiOntcIiRcIjowfSxcImZpXCI6e1wiJFwiOjB9LFwiZmlyZW56ZVwiOntcIiRcIjowfSxcImZsb3JlbmNlXCI6e1wiJFwiOjB9LFwiZm1cIjp7XCIkXCI6MH0sXCJmb2dnaWFcIjp7XCIkXCI6MH0sXCJmb3JsaS1jZXNlbmFcIjp7XCIkXCI6MH0sXCJmb3JsaWNlc2VuYVwiOntcIiRcIjowfSxcImZyXCI6e1wiJFwiOjB9LFwiZnJvc2lub25lXCI6e1wiJFwiOjB9LFwiZ2VcIjp7XCIkXCI6MH0sXCJnZW5vYVwiOntcIiRcIjowfSxcImdlbm92YVwiOntcIiRcIjowfSxcImdvXCI6e1wiJFwiOjB9LFwiZ29yaXppYVwiOntcIiRcIjowfSxcImdyXCI6e1wiJFwiOjB9LFwiZ3Jvc3NldG9cIjp7XCIkXCI6MH0sXCJpZ2xlc2lhcy1jYXJib25pYVwiOntcIiRcIjowfSxcImlnbGVzaWFzY2FyYm9uaWFcIjp7XCIkXCI6MH0sXCJpbVwiOntcIiRcIjowfSxcImltcGVyaWFcIjp7XCIkXCI6MH0sXCJpc1wiOntcIiRcIjowfSxcImlzZXJuaWFcIjp7XCIkXCI6MH0sXCJrclwiOntcIiRcIjowfSxcImxhLXNwZXppYVwiOntcIiRcIjowfSxcImxhcXVpbGFcIjp7XCIkXCI6MH0sXCJsYXNwZXppYVwiOntcIiRcIjowfSxcImxhdGluYVwiOntcIiRcIjowfSxcImxjXCI6e1wiJFwiOjB9LFwibGVcIjp7XCIkXCI6MH0sXCJsZWNjZVwiOntcIiRcIjowfSxcImxlY2NvXCI6e1wiJFwiOjB9LFwibGlcIjp7XCIkXCI6MH0sXCJsaXZvcm5vXCI6e1wiJFwiOjB9LFwibG9cIjp7XCIkXCI6MH0sXCJsb2RpXCI6e1wiJFwiOjB9LFwibHRcIjp7XCIkXCI6MH0sXCJsdVwiOntcIiRcIjowfSxcImx1Y2NhXCI6e1wiJFwiOjB9LFwibWFjZXJhdGFcIjp7XCIkXCI6MH0sXCJtYW50b3ZhXCI6e1wiJFwiOjB9LFwibWFzc2EtY2FycmFyYVwiOntcIiRcIjowfSxcIm1hc3NhY2FycmFyYVwiOntcIiRcIjowfSxcIm1hdGVyYVwiOntcIiRcIjowfSxcIm1iXCI6e1wiJFwiOjB9LFwibWNcIjp7XCIkXCI6MH0sXCJtZVwiOntcIiRcIjowfSxcIm1lZGlvLWNhbXBpZGFub1wiOntcIiRcIjowfSxcIm1lZGlvY2FtcGlkYW5vXCI6e1wiJFwiOjB9LFwibWVzc2luYVwiOntcIiRcIjowfSxcIm1pXCI6e1wiJFwiOjB9LFwibWlsYW5cIjp7XCIkXCI6MH0sXCJtaWxhbm9cIjp7XCIkXCI6MH0sXCJtblwiOntcIiRcIjowfSxcIm1vXCI6e1wiJFwiOjB9LFwibW9kZW5hXCI6e1wiJFwiOjB9LFwibW9uemEtYnJpYW56YVwiOntcIiRcIjowfSxcIm1vbnphLWUtZGVsbGEtYnJpYW56YVwiOntcIiRcIjowfSxcIm1vbnphXCI6e1wiJFwiOjB9LFwibW9uemFicmlhbnphXCI6e1wiJFwiOjB9LFwibW9uemFlYnJpYW56YVwiOntcIiRcIjowfSxcIm1vbnphZWRlbGxhYnJpYW56YVwiOntcIiRcIjowfSxcIm1zXCI6e1wiJFwiOjB9LFwibXRcIjp7XCIkXCI6MH0sXCJuYVwiOntcIiRcIjowfSxcIm5hcGxlc1wiOntcIiRcIjowfSxcIm5hcG9saVwiOntcIiRcIjowfSxcIm5vXCI6e1wiJFwiOjB9LFwibm92YXJhXCI6e1wiJFwiOjB9LFwibnVcIjp7XCIkXCI6MH0sXCJudW9yb1wiOntcIiRcIjowfSxcIm9nXCI6e1wiJFwiOjB9LFwib2dsaWFzdHJhXCI6e1wiJFwiOjB9LFwib2xiaWEtdGVtcGlvXCI6e1wiJFwiOjB9LFwib2xiaWF0ZW1waW9cIjp7XCIkXCI6MH0sXCJvclwiOntcIiRcIjowfSxcIm9yaXN0YW5vXCI6e1wiJFwiOjB9LFwib3RcIjp7XCIkXCI6MH0sXCJwYVwiOntcIiRcIjowfSxcInBhZG92YVwiOntcIiRcIjowfSxcInBhZHVhXCI6e1wiJFwiOjB9LFwicGFsZXJtb1wiOntcIiRcIjowfSxcInBhcm1hXCI6e1wiJFwiOjB9LFwicGF2aWFcIjp7XCIkXCI6MH0sXCJwY1wiOntcIiRcIjowfSxcInBkXCI6e1wiJFwiOjB9LFwicGVcIjp7XCIkXCI6MH0sXCJwZXJ1Z2lhXCI6e1wiJFwiOjB9LFwicGVzYXJvLXVyYmlub1wiOntcIiRcIjowfSxcInBlc2Fyb3VyYmlub1wiOntcIiRcIjowfSxcInBlc2NhcmFcIjp7XCIkXCI6MH0sXCJwZ1wiOntcIiRcIjowfSxcInBpXCI6e1wiJFwiOjB9LFwicGlhY2VuemFcIjp7XCIkXCI6MH0sXCJwaXNhXCI6e1wiJFwiOjB9LFwicGlzdG9pYVwiOntcIiRcIjowfSxcInBuXCI6e1wiJFwiOjB9LFwicG9cIjp7XCIkXCI6MH0sXCJwb3JkZW5vbmVcIjp7XCIkXCI6MH0sXCJwb3RlbnphXCI6e1wiJFwiOjB9LFwicHJcIjp7XCIkXCI6MH0sXCJwcmF0b1wiOntcIiRcIjowfSxcInB0XCI6e1wiJFwiOjB9LFwicHVcIjp7XCIkXCI6MH0sXCJwdlwiOntcIiRcIjowfSxcInB6XCI6e1wiJFwiOjB9LFwicmFcIjp7XCIkXCI6MH0sXCJyYWd1c2FcIjp7XCIkXCI6MH0sXCJyYXZlbm5hXCI6e1wiJFwiOjB9LFwicmNcIjp7XCIkXCI6MH0sXCJyZVwiOntcIiRcIjowfSxcInJlZ2dpby1jYWxhYnJpYVwiOntcIiRcIjowfSxcInJlZ2dpby1lbWlsaWFcIjp7XCIkXCI6MH0sXCJyZWdnaW9jYWxhYnJpYVwiOntcIiRcIjowfSxcInJlZ2dpb2VtaWxpYVwiOntcIiRcIjowfSxcInJnXCI6e1wiJFwiOjB9LFwicmlcIjp7XCIkXCI6MH0sXCJyaWV0aVwiOntcIiRcIjowfSxcInJpbWluaVwiOntcIiRcIjowfSxcInJtXCI6e1wiJFwiOjB9LFwicm5cIjp7XCIkXCI6MH0sXCJyb1wiOntcIiRcIjowfSxcInJvbWFcIjp7XCIkXCI6MH0sXCJyb21lXCI6e1wiJFwiOjB9LFwicm92aWdvXCI6e1wiJFwiOjB9LFwic2FcIjp7XCIkXCI6MH0sXCJzYWxlcm5vXCI6e1wiJFwiOjB9LFwic2Fzc2FyaVwiOntcIiRcIjowfSxcInNhdm9uYVwiOntcIiRcIjowfSxcInNpXCI6e1wiJFwiOjB9LFwic2llbmFcIjp7XCIkXCI6MH0sXCJzaXJhY3VzYVwiOntcIiRcIjowfSxcInNvXCI6e1wiJFwiOjB9LFwic29uZHJpb1wiOntcIiRcIjowfSxcInNwXCI6e1wiJFwiOjB9LFwic3JcIjp7XCIkXCI6MH0sXCJzc1wiOntcIiRcIjowfSxcInN1ZWR0aXJvbFwiOntcIiRcIjowfSxcInN2XCI6e1wiJFwiOjB9LFwidGFcIjp7XCIkXCI6MH0sXCJ0YXJhbnRvXCI6e1wiJFwiOjB9LFwidGVcIjp7XCIkXCI6MH0sXCJ0ZW1waW8tb2xiaWFcIjp7XCIkXCI6MH0sXCJ0ZW1waW9vbGJpYVwiOntcIiRcIjowfSxcInRlcmFtb1wiOntcIiRcIjowfSxcInRlcm5pXCI6e1wiJFwiOjB9LFwidG5cIjp7XCIkXCI6MH0sXCJ0b1wiOntcIiRcIjowfSxcInRvcmlub1wiOntcIiRcIjowfSxcInRwXCI6e1wiJFwiOjB9LFwidHJcIjp7XCIkXCI6MH0sXCJ0cmFuaS1hbmRyaWEtYmFybGV0dGFcIjp7XCIkXCI6MH0sXCJ0cmFuaS1iYXJsZXR0YS1hbmRyaWFcIjp7XCIkXCI6MH0sXCJ0cmFuaWFuZHJpYWJhcmxldHRhXCI6e1wiJFwiOjB9LFwidHJhbmliYXJsZXR0YWFuZHJpYVwiOntcIiRcIjowfSxcInRyYXBhbmlcIjp7XCIkXCI6MH0sXCJ0cmVudGlub1wiOntcIiRcIjowfSxcInRyZW50b1wiOntcIiRcIjowfSxcInRyZXZpc29cIjp7XCIkXCI6MH0sXCJ0cmllc3RlXCI6e1wiJFwiOjB9LFwidHNcIjp7XCIkXCI6MH0sXCJ0dXJpblwiOntcIiRcIjowfSxcInR2XCI6e1wiJFwiOjB9LFwidWRcIjp7XCIkXCI6MH0sXCJ1ZGluZVwiOntcIiRcIjowfSxcInVyYmluby1wZXNhcm9cIjp7XCIkXCI6MH0sXCJ1cmJpbm9wZXNhcm9cIjp7XCIkXCI6MH0sXCJ2YVwiOntcIiRcIjowfSxcInZhcmVzZVwiOntcIiRcIjowfSxcInZiXCI6e1wiJFwiOjB9LFwidmNcIjp7XCIkXCI6MH0sXCJ2ZVwiOntcIiRcIjowfSxcInZlbmV6aWFcIjp7XCIkXCI6MH0sXCJ2ZW5pY2VcIjp7XCIkXCI6MH0sXCJ2ZXJiYW5pYVwiOntcIiRcIjowfSxcInZlcmNlbGxpXCI6e1wiJFwiOjB9LFwidmVyb25hXCI6e1wiJFwiOjB9LFwidmlcIjp7XCIkXCI6MH0sXCJ2aWJvLXZhbGVudGlhXCI6e1wiJFwiOjB9LFwidmlib3ZhbGVudGlhXCI6e1wiJFwiOjB9LFwidmljZW56YVwiOntcIiRcIjowfSxcInZpdGVyYm9cIjp7XCIkXCI6MH0sXCJ2clwiOntcIiRcIjowfSxcInZzXCI6e1wiJFwiOjB9LFwidnRcIjp7XCIkXCI6MH0sXCJ2dlwiOntcIiRcIjowfSxcImJsb2dzcG90XCI6e1wiJFwiOjB9fSxcImplXCI6e1wiJFwiOjAsXCJjb1wiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfX0sXCJqbVwiOntcIipcIjp7XCIkXCI6MH19LFwiam9cIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcInNjaFwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIm1pbFwiOntcIiRcIjowfSxcIm5hbWVcIjp7XCIkXCI6MH19LFwiam9ic1wiOntcIiRcIjowfSxcImpwXCI6e1wiJFwiOjAsXCJhY1wiOntcIiRcIjowfSxcImFkXCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MH0sXCJlZFwiOntcIiRcIjowfSxcImdvXCI6e1wiJFwiOjB9LFwiZ3JcIjp7XCIkXCI6MH0sXCJsZ1wiOntcIiRcIjowfSxcIm5lXCI6e1wiJFwiOjB9LFwib3JcIjp7XCIkXCI6MH0sXCJhaWNoaVwiOntcIiRcIjowLFwiYWlzYWlcIjp7XCIkXCI6MH0sXCJhbWFcIjp7XCIkXCI6MH0sXCJhbmpvXCI6e1wiJFwiOjB9LFwiYXN1a2VcIjp7XCIkXCI6MH0sXCJjaGlyeXVcIjp7XCIkXCI6MH0sXCJjaGl0YVwiOntcIiRcIjowfSxcImZ1c29cIjp7XCIkXCI6MH0sXCJnYW1hZ29yaVwiOntcIiRcIjowfSxcImhhbmRhXCI6e1wiJFwiOjB9LFwiaGF6dVwiOntcIiRcIjowfSxcImhla2luYW5cIjp7XCIkXCI6MH0sXCJoaWdhc2hpdXJhXCI6e1wiJFwiOjB9LFwiaWNoaW5vbWl5YVwiOntcIiRcIjowfSxcImluYXphd2FcIjp7XCIkXCI6MH0sXCJpbnV5YW1hXCI6e1wiJFwiOjB9LFwiaXNzaGlraVwiOntcIiRcIjowfSxcIml3YWt1cmFcIjp7XCIkXCI6MH0sXCJrYW5pZVwiOntcIiRcIjowfSxcImthcml5YVwiOntcIiRcIjowfSxcImthc3VnYWlcIjp7XCIkXCI6MH0sXCJraXJhXCI6e1wiJFwiOjB9LFwia2l5b3N1XCI6e1wiJFwiOjB9LFwia29tYWtpXCI6e1wiJFwiOjB9LFwia29uYW5cIjp7XCIkXCI6MH0sXCJrb3RhXCI6e1wiJFwiOjB9LFwibWloYW1hXCI6e1wiJFwiOjB9LFwibWl5b3NoaVwiOntcIiRcIjowfSxcIm5pc2hpb1wiOntcIiRcIjowfSxcIm5pc3NoaW5cIjp7XCIkXCI6MH0sXCJvYnVcIjp7XCIkXCI6MH0sXCJvZ3VjaGlcIjp7XCIkXCI6MH0sXCJvaGFydVwiOntcIiRcIjowfSxcIm9rYXpha2lcIjp7XCIkXCI6MH0sXCJvd2FyaWFzYWhpXCI6e1wiJFwiOjB9LFwic2V0b1wiOntcIiRcIjowfSxcInNoaWthdHN1XCI6e1wiJFwiOjB9LFwic2hpbnNoaXJvXCI6e1wiJFwiOjB9LFwic2hpdGFyYVwiOntcIiRcIjowfSxcInRhaGFyYVwiOntcIiRcIjowfSxcInRha2FoYW1hXCI6e1wiJFwiOjB9LFwidG9iaXNoaW1hXCI6e1wiJFwiOjB9LFwidG9laVwiOntcIiRcIjowfSxcInRvZ29cIjp7XCIkXCI6MH0sXCJ0b2thaVwiOntcIiRcIjowfSxcInRva29uYW1lXCI6e1wiJFwiOjB9LFwidG95b2FrZVwiOntcIiRcIjowfSxcInRveW9oYXNoaVwiOntcIiRcIjowfSxcInRveW9rYXdhXCI6e1wiJFwiOjB9LFwidG95b25lXCI6e1wiJFwiOjB9LFwidG95b3RhXCI6e1wiJFwiOjB9LFwidHN1c2hpbWFcIjp7XCIkXCI6MH0sXCJ5YXRvbWlcIjp7XCIkXCI6MH19LFwiYWtpdGFcIjp7XCIkXCI6MCxcImFraXRhXCI6e1wiJFwiOjB9LFwiZGFpc2VuXCI6e1wiJFwiOjB9LFwiZnVqaXNhdG9cIjp7XCIkXCI6MH0sXCJnb2pvbWVcIjp7XCIkXCI6MH0sXCJoYWNoaXJvZ2F0YVwiOntcIiRcIjowfSxcImhhcHBvdVwiOntcIiRcIjowfSxcImhpZ2FzaGluYXJ1c2VcIjp7XCIkXCI6MH0sXCJob25qb1wiOntcIiRcIjowfSxcImhvbmp5b1wiOntcIiRcIjowfSxcImlrYXdhXCI6e1wiJFwiOjB9LFwia2FtaWtvYW5pXCI6e1wiJFwiOjB9LFwia2FtaW9rYVwiOntcIiRcIjowfSxcImthdGFnYW1pXCI6e1wiJFwiOjB9LFwia2F6dW5vXCI6e1wiJFwiOjB9LFwia2l0YWFraXRhXCI6e1wiJFwiOjB9LFwia29zYWthXCI6e1wiJFwiOjB9LFwia3lvd2FcIjp7XCIkXCI6MH0sXCJtaXNhdG9cIjp7XCIkXCI6MH0sXCJtaXRhbmVcIjp7XCIkXCI6MH0sXCJtb3JpeW9zaGlcIjp7XCIkXCI6MH0sXCJuaWthaG9cIjp7XCIkXCI6MH0sXCJub3NoaXJvXCI6e1wiJFwiOjB9LFwib2RhdGVcIjp7XCIkXCI6MH0sXCJvZ2FcIjp7XCIkXCI6MH0sXCJvZ2F0YVwiOntcIiRcIjowfSxcInNlbWJva3VcIjp7XCIkXCI6MH0sXCJ5b2tvdGVcIjp7XCIkXCI6MH0sXCJ5dXJpaG9uam9cIjp7XCIkXCI6MH19LFwiYW9tb3JpXCI6e1wiJFwiOjAsXCJhb21vcmlcIjp7XCIkXCI6MH0sXCJnb25vaGVcIjp7XCIkXCI6MH0sXCJoYWNoaW5vaGVcIjp7XCIkXCI6MH0sXCJoYXNoaWthbWlcIjp7XCIkXCI6MH0sXCJoaXJhbmFpXCI6e1wiJFwiOjB9LFwiaGlyb3Nha2lcIjp7XCIkXCI6MH0sXCJpdGF5YW5hZ2lcIjp7XCIkXCI6MH0sXCJrdXJvaXNoaVwiOntcIiRcIjowfSxcIm1pc2F3YVwiOntcIiRcIjowfSxcIm11dHN1XCI6e1wiJFwiOjB9LFwibmFrYWRvbWFyaVwiOntcIiRcIjowfSxcIm5vaGVqaVwiOntcIiRcIjowfSxcIm9pcmFzZVwiOntcIiRcIjowfSxcIm93YW5pXCI6e1wiJFwiOjB9LFwicm9rdW5vaGVcIjp7XCIkXCI6MH0sXCJzYW5ub2hlXCI6e1wiJFwiOjB9LFwic2hpY2hpbm9oZVwiOntcIiRcIjowfSxcInNoaW5nb1wiOntcIiRcIjowfSxcInRha2tvXCI6e1wiJFwiOjB9LFwidG93YWRhXCI6e1wiJFwiOjB9LFwidHN1Z2FydVwiOntcIiRcIjowfSxcInRzdXJ1dGFcIjp7XCIkXCI6MH19LFwiY2hpYmFcIjp7XCIkXCI6MCxcImFiaWtvXCI6e1wiJFwiOjB9LFwiYXNhaGlcIjp7XCIkXCI6MH0sXCJjaG9uYW5cIjp7XCIkXCI6MH0sXCJjaG9zZWlcIjp7XCIkXCI6MH0sXCJjaG9zaGlcIjp7XCIkXCI6MH0sXCJjaHVvXCI6e1wiJFwiOjB9LFwiZnVuYWJhc2hpXCI6e1wiJFwiOjB9LFwiZnV0dHN1XCI6e1wiJFwiOjB9LFwiaGFuYW1pZ2F3YVwiOntcIiRcIjowfSxcImljaGloYXJhXCI6e1wiJFwiOjB9LFwiaWNoaWthd2FcIjp7XCIkXCI6MH0sXCJpY2hpbm9taXlhXCI6e1wiJFwiOjB9LFwiaW56YWlcIjp7XCIkXCI6MH0sXCJpc3VtaVwiOntcIiRcIjowfSxcImthbWFnYXlhXCI6e1wiJFwiOjB9LFwia2Ftb2dhd2FcIjp7XCIkXCI6MH0sXCJrYXNoaXdhXCI6e1wiJFwiOjB9LFwia2F0b3JpXCI6e1wiJFwiOjB9LFwia2F0c3V1cmFcIjp7XCIkXCI6MH0sXCJraW1pdHN1XCI6e1wiJFwiOjB9LFwia2lzYXJhenVcIjp7XCIkXCI6MH0sXCJrb3pha2lcIjp7XCIkXCI6MH0sXCJrdWp1a3VyaVwiOntcIiRcIjowfSxcImt5b25hblwiOntcIiRcIjowfSxcIm1hdHN1ZG9cIjp7XCIkXCI6MH0sXCJtaWRvcmlcIjp7XCIkXCI6MH0sXCJtaWhhbWFcIjp7XCIkXCI6MH0sXCJtaW5hbWlib3NvXCI6e1wiJFwiOjB9LFwibW9iYXJhXCI6e1wiJFwiOjB9LFwibXV0c3V6YXdhXCI6e1wiJFwiOjB9LFwibmFnYXJhXCI6e1wiJFwiOjB9LFwibmFnYXJleWFtYVwiOntcIiRcIjowfSxcIm5hcmFzaGlub1wiOntcIiRcIjowfSxcIm5hcml0YVwiOntcIiRcIjowfSxcIm5vZGFcIjp7XCIkXCI6MH0sXCJvYW1pc2hpcmFzYXRvXCI6e1wiJFwiOjB9LFwib21pZ2F3YVwiOntcIiRcIjowfSxcIm9uanVrdVwiOntcIiRcIjowfSxcIm90YWtpXCI6e1wiJFwiOjB9LFwic2FrYWVcIjp7XCIkXCI6MH0sXCJzYWt1cmFcIjp7XCIkXCI6MH0sXCJzaGltb2Z1c2FcIjp7XCIkXCI6MH0sXCJzaGlyYWtvXCI6e1wiJFwiOjB9LFwic2hpcm9pXCI6e1wiJFwiOjB9LFwic2hpc3VpXCI6e1wiJFwiOjB9LFwic29kZWdhdXJhXCI6e1wiJFwiOjB9LFwic29zYVwiOntcIiRcIjowfSxcInRha29cIjp7XCIkXCI6MH0sXCJ0YXRleWFtYVwiOntcIiRcIjowfSxcInRvZ2FuZVwiOntcIiRcIjowfSxcInRvaG5vc2hvXCI6e1wiJFwiOjB9LFwidG9taXNhdG9cIjp7XCIkXCI6MH0sXCJ1cmF5YXN1XCI6e1wiJFwiOjB9LFwieWFjaGltYXRhXCI6e1wiJFwiOjB9LFwieWFjaGl5b1wiOntcIiRcIjowfSxcInlva2FpY2hpYmFcIjp7XCIkXCI6MH0sXCJ5b2tvc2hpYmFoaWthcmlcIjp7XCIkXCI6MH0sXCJ5b3RzdWthaWRvXCI6e1wiJFwiOjB9fSxcImVoaW1lXCI6e1wiJFwiOjAsXCJhaW5hblwiOntcIiRcIjowfSxcImhvbmFpXCI6e1wiJFwiOjB9LFwiaWthdGFcIjp7XCIkXCI6MH0sXCJpbWFiYXJpXCI6e1wiJFwiOjB9LFwiaXlvXCI6e1wiJFwiOjB9LFwia2FtaWppbWFcIjp7XCIkXCI6MH0sXCJraWhva3VcIjp7XCIkXCI6MH0sXCJrdW1ha29nZW5cIjp7XCIkXCI6MH0sXCJtYXNha2lcIjp7XCIkXCI6MH0sXCJtYXRzdW5vXCI6e1wiJFwiOjB9LFwibWF0c3V5YW1hXCI6e1wiJFwiOjB9LFwibmFtaWthdGFcIjp7XCIkXCI6MH0sXCJuaWloYW1hXCI6e1wiJFwiOjB9LFwib3p1XCI6e1wiJFwiOjB9LFwic2Fpam9cIjp7XCIkXCI6MH0sXCJzZWl5b1wiOntcIiRcIjowfSxcInNoaWtva3VjaHVvXCI6e1wiJFwiOjB9LFwidG9iZVwiOntcIiRcIjowfSxcInRvb25cIjp7XCIkXCI6MH0sXCJ1Y2hpa29cIjp7XCIkXCI6MH0sXCJ1d2FqaW1hXCI6e1wiJFwiOjB9LFwieWF3YXRhaGFtYVwiOntcIiRcIjowfX0sXCJmdWt1aVwiOntcIiRcIjowLFwiZWNoaXplblwiOntcIiRcIjowfSxcImVpaGVpamlcIjp7XCIkXCI6MH0sXCJmdWt1aVwiOntcIiRcIjowfSxcImlrZWRhXCI6e1wiJFwiOjB9LFwia2F0c3V5YW1hXCI6e1wiJFwiOjB9LFwibWloYW1hXCI6e1wiJFwiOjB9LFwibWluYW1pZWNoaXplblwiOntcIiRcIjowfSxcIm9iYW1hXCI6e1wiJFwiOjB9LFwib2hpXCI6e1wiJFwiOjB9LFwib25vXCI6e1wiJFwiOjB9LFwic2FiYWVcIjp7XCIkXCI6MH0sXCJzYWthaVwiOntcIiRcIjowfSxcInRha2FoYW1hXCI6e1wiJFwiOjB9LFwidHN1cnVnYVwiOntcIiRcIjowfSxcIndha2FzYVwiOntcIiRcIjowfX0sXCJmdWt1b2thXCI6e1wiJFwiOjAsXCJhc2hpeWFcIjp7XCIkXCI6MH0sXCJidXplblwiOntcIiRcIjowfSxcImNoaWt1Z29cIjp7XCIkXCI6MH0sXCJjaGlrdWhvXCI6e1wiJFwiOjB9LFwiY2hpa3Vqb1wiOntcIiRcIjowfSxcImNoaWt1c2hpbm9cIjp7XCIkXCI6MH0sXCJjaGlrdXplblwiOntcIiRcIjowfSxcImNodW9cIjp7XCIkXCI6MH0sXCJkYXphaWZ1XCI6e1wiJFwiOjB9LFwiZnVrdWNoaVwiOntcIiRcIjowfSxcImhha2F0YVwiOntcIiRcIjowfSxcImhpZ2FzaGlcIjp7XCIkXCI6MH0sXCJoaXJva2F3YVwiOntcIiRcIjowfSxcImhpc2F5YW1hXCI6e1wiJFwiOjB9LFwiaWl6dWthXCI6e1wiJFwiOjB9LFwiaW5hdHN1a2lcIjp7XCIkXCI6MH0sXCJrYWhvXCI6e1wiJFwiOjB9LFwia2FzdWdhXCI6e1wiJFwiOjB9LFwia2FzdXlhXCI6e1wiJFwiOjB9LFwia2F3YXJhXCI6e1wiJFwiOjB9LFwia2Vpc2VuXCI6e1wiJFwiOjB9LFwia29nYVwiOntcIiRcIjowfSxcImt1cmF0ZVwiOntcIiRcIjowfSxcImt1cm9naVwiOntcIiRcIjowfSxcImt1cnVtZVwiOntcIiRcIjowfSxcIm1pbmFtaVwiOntcIiRcIjowfSxcIm1peWFrb1wiOntcIiRcIjowfSxcIm1peWFtYVwiOntcIiRcIjowfSxcIm1peWF3YWthXCI6e1wiJFwiOjB9LFwibWl6dW1ha2lcIjp7XCIkXCI6MH0sXCJtdW5ha2F0YVwiOntcIiRcIjowfSxcIm5ha2FnYXdhXCI6e1wiJFwiOjB9LFwibmFrYW1hXCI6e1wiJFwiOjB9LFwibmlzaGlcIjp7XCIkXCI6MH0sXCJub2dhdGFcIjp7XCIkXCI6MH0sXCJvZ29yaVwiOntcIiRcIjowfSxcIm9rYWdha2lcIjp7XCIkXCI6MH0sXCJva2F3YVwiOntcIiRcIjowfSxcIm9raVwiOntcIiRcIjowfSxcIm9tdXRhXCI6e1wiJFwiOjB9LFwib25nYVwiOntcIiRcIjowfSxcIm9ub2pvXCI6e1wiJFwiOjB9LFwib3RvXCI6e1wiJFwiOjB9LFwic2FpZ2F3YVwiOntcIiRcIjowfSxcInNhc2FndXJpXCI6e1wiJFwiOjB9LFwic2hpbmd1XCI6e1wiJFwiOjB9LFwic2hpbnlvc2hpdG9taVwiOntcIiRcIjowfSxcInNob25haVwiOntcIiRcIjowfSxcInNvZWRhXCI6e1wiJFwiOjB9LFwic3VlXCI6e1wiJFwiOjB9LFwidGFjaGlhcmFpXCI6e1wiJFwiOjB9LFwidGFnYXdhXCI6e1wiJFwiOjB9LFwidGFrYXRhXCI6e1wiJFwiOjB9LFwidG9ob1wiOntcIiRcIjowfSxcInRveW90c3VcIjp7XCIkXCI6MH0sXCJ0c3Vpa2lcIjp7XCIkXCI6MH0sXCJ1a2loYVwiOntcIiRcIjowfSxcInVtaVwiOntcIiRcIjowfSxcInVzdWlcIjp7XCIkXCI6MH0sXCJ5YW1hZGFcIjp7XCIkXCI6MH0sXCJ5YW1lXCI6e1wiJFwiOjB9LFwieWFuYWdhd2FcIjp7XCIkXCI6MH0sXCJ5dWt1aGFzaGlcIjp7XCIkXCI6MH19LFwiZnVrdXNoaW1hXCI6e1wiJFwiOjAsXCJhaXp1YmFuZ2VcIjp7XCIkXCI6MH0sXCJhaXp1bWlzYXRvXCI6e1wiJFwiOjB9LFwiYWl6dXdha2FtYXRzdVwiOntcIiRcIjowfSxcImFzYWthd2FcIjp7XCIkXCI6MH0sXCJiYW5kYWlcIjp7XCIkXCI6MH0sXCJkYXRlXCI6e1wiJFwiOjB9LFwiZnVrdXNoaW1hXCI6e1wiJFwiOjB9LFwiZnVydWRvbm9cIjp7XCIkXCI6MH0sXCJmdXRhYmFcIjp7XCIkXCI6MH0sXCJoYW5hd2FcIjp7XCIkXCI6MH0sXCJoaWdhc2hpXCI6e1wiJFwiOjB9LFwiaGlyYXRhXCI6e1wiJFwiOjB9LFwiaGlyb25vXCI6e1wiJFwiOjB9LFwiaWl0YXRlXCI6e1wiJFwiOjB9LFwiaW5hd2FzaGlyb1wiOntcIiRcIjowfSxcImlzaGlrYXdhXCI6e1wiJFwiOjB9LFwiaXdha2lcIjp7XCIkXCI6MH0sXCJpenVtaXpha2lcIjp7XCIkXCI6MH0sXCJrYWdhbWlpc2hpXCI6e1wiJFwiOjB9LFwia2FuZXlhbWFcIjp7XCIkXCI6MH0sXCJrYXdhbWF0YVwiOntcIiRcIjowfSxcImtpdGFrYXRhXCI6e1wiJFwiOjB9LFwia2l0YXNoaW9iYXJhXCI6e1wiJFwiOjB9LFwia29vcmlcIjp7XCIkXCI6MH0sXCJrb3JpeWFtYVwiOntcIiRcIjowfSxcImt1bmltaVwiOntcIiRcIjowfSxcIm1paGFydVwiOntcIiRcIjowfSxcIm1pc2hpbWFcIjp7XCIkXCI6MH0sXCJuYW1pZVwiOntcIiRcIjowfSxcIm5hbmdvXCI6e1wiJFwiOjB9LFwibmlzaGlhaXp1XCI6e1wiJFwiOjB9LFwibmlzaGlnb1wiOntcIiRcIjowfSxcIm9rdW1hXCI6e1wiJFwiOjB9LFwib21vdGVnb1wiOntcIiRcIjowfSxcIm9ub1wiOntcIiRcIjowfSxcIm90YW1hXCI6e1wiJFwiOjB9LFwic2FtZWdhd2FcIjp7XCIkXCI6MH0sXCJzaGltb2dvXCI6e1wiJFwiOjB9LFwic2hpcmFrYXdhXCI6e1wiJFwiOjB9LFwic2hvd2FcIjp7XCIkXCI6MH0sXCJzb21hXCI6e1wiJFwiOjB9LFwic3VrYWdhd2FcIjp7XCIkXCI6MH0sXCJ0YWlzaGluXCI6e1wiJFwiOjB9LFwidGFtYWthd2FcIjp7XCIkXCI6MH0sXCJ0YW5hZ3VyYVwiOntcIiRcIjowfSxcInRlbmVpXCI6e1wiJFwiOjB9LFwieWFidWtpXCI6e1wiJFwiOjB9LFwieWFtYXRvXCI6e1wiJFwiOjB9LFwieWFtYXRzdXJpXCI6e1wiJFwiOjB9LFwieWFuYWl6dVwiOntcIiRcIjowfSxcInl1Z2F3YVwiOntcIiRcIjowfX0sXCJnaWZ1XCI6e1wiJFwiOjAsXCJhbnBhY2hpXCI6e1wiJFwiOjB9LFwiZW5hXCI6e1wiJFwiOjB9LFwiZ2lmdVwiOntcIiRcIjowfSxcImdpbmFuXCI6e1wiJFwiOjB9LFwiZ29kb1wiOntcIiRcIjowfSxcImd1am9cIjp7XCIkXCI6MH0sXCJoYXNoaW1hXCI6e1wiJFwiOjB9LFwiaGljaGlzb1wiOntcIiRcIjowfSxcImhpZGFcIjp7XCIkXCI6MH0sXCJoaWdhc2hpc2hpcmFrYXdhXCI6e1wiJFwiOjB9LFwiaWJpZ2F3YVwiOntcIiRcIjowfSxcImlrZWRhXCI6e1wiJFwiOjB9LFwia2FrYW1pZ2FoYXJhXCI6e1wiJFwiOjB9LFwia2FuaVwiOntcIiRcIjowfSxcImthc2FoYXJhXCI6e1wiJFwiOjB9LFwia2FzYW1hdHN1XCI6e1wiJFwiOjB9LFwia2F3YXVlXCI6e1wiJFwiOjB9LFwia2l0YWdhdGFcIjp7XCIkXCI6MH0sXCJtaW5vXCI6e1wiJFwiOjB9LFwibWlub2thbW9cIjp7XCIkXCI6MH0sXCJtaXRha2VcIjp7XCIkXCI6MH0sXCJtaXp1bmFtaVwiOntcIiRcIjowfSxcIm1vdG9zdVwiOntcIiRcIjowfSxcIm5ha2F0c3VnYXdhXCI6e1wiJFwiOjB9LFwib2dha2lcIjp7XCIkXCI6MH0sXCJzYWthaG9naVwiOntcIiRcIjowfSxcInNla2lcIjp7XCIkXCI6MH0sXCJzZWtpZ2FoYXJhXCI6e1wiJFwiOjB9LFwic2hpcmFrYXdhXCI6e1wiJFwiOjB9LFwidGFqaW1pXCI6e1wiJFwiOjB9LFwidGFrYXlhbWFcIjp7XCIkXCI6MH0sXCJ0YXJ1aVwiOntcIiRcIjowfSxcInRva2lcIjp7XCIkXCI6MH0sXCJ0b21pa2FcIjp7XCIkXCI6MH0sXCJ3YW5vdWNoaVwiOntcIiRcIjowfSxcInlhbWFnYXRhXCI6e1wiJFwiOjB9LFwieWFvdHN1XCI6e1wiJFwiOjB9LFwieW9yb1wiOntcIiRcIjowfX0sXCJndW5tYVwiOntcIiRcIjowLFwiYW5uYWthXCI6e1wiJFwiOjB9LFwiY2hpeW9kYVwiOntcIiRcIjowfSxcImZ1amlva2FcIjp7XCIkXCI6MH0sXCJoaWdhc2hpYWdhdHN1bWFcIjp7XCIkXCI6MH0sXCJpc2VzYWtpXCI6e1wiJFwiOjB9LFwiaXRha3VyYVwiOntcIiRcIjowfSxcImthbm5hXCI6e1wiJFwiOjB9LFwia2FucmFcIjp7XCIkXCI6MH0sXCJrYXRhc2hpbmFcIjp7XCIkXCI6MH0sXCJrYXdhYmFcIjp7XCIkXCI6MH0sXCJraXJ5dVwiOntcIiRcIjowfSxcImt1c2F0c3VcIjp7XCIkXCI6MH0sXCJtYWViYXNoaVwiOntcIiRcIjowfSxcIm1laXdhXCI6e1wiJFwiOjB9LFwibWlkb3JpXCI6e1wiJFwiOjB9LFwibWluYWthbWlcIjp7XCIkXCI6MH0sXCJuYWdhbm9oYXJhXCI6e1wiJFwiOjB9LFwibmFrYW5vam9cIjp7XCIkXCI6MH0sXCJuYW5tb2t1XCI6e1wiJFwiOjB9LFwibnVtYXRhXCI6e1wiJFwiOjB9LFwib2l6dW1pXCI6e1wiJFwiOjB9LFwib3JhXCI6e1wiJFwiOjB9LFwib3RhXCI6e1wiJFwiOjB9LFwic2hpYnVrYXdhXCI6e1wiJFwiOjB9LFwic2hpbW9uaXRhXCI6e1wiJFwiOjB9LFwic2hpbnRvXCI6e1wiJFwiOjB9LFwic2hvd2FcIjp7XCIkXCI6MH0sXCJ0YWthc2FraVwiOntcIiRcIjowfSxcInRha2F5YW1hXCI6e1wiJFwiOjB9LFwidGFtYW11cmFcIjp7XCIkXCI6MH0sXCJ0YXRlYmF5YXNoaVwiOntcIiRcIjowfSxcInRvbWlva2FcIjp7XCIkXCI6MH0sXCJ0c3VraXlvbm9cIjp7XCIkXCI6MH0sXCJ0c3VtYWdvaVwiOntcIiRcIjowfSxcInVlbm9cIjp7XCIkXCI6MH0sXCJ5b3NoaW9rYVwiOntcIiRcIjowfX0sXCJoaXJvc2hpbWFcIjp7XCIkXCI6MCxcImFzYW1pbmFtaVwiOntcIiRcIjowfSxcImRhaXdhXCI6e1wiJFwiOjB9LFwiZXRhamltYVwiOntcIiRcIjowfSxcImZ1Y2h1XCI6e1wiJFwiOjB9LFwiZnVrdXlhbWFcIjp7XCIkXCI6MH0sXCJoYXRzdWthaWNoaVwiOntcIiRcIjowfSxcImhpZ2FzaGloaXJvc2hpbWFcIjp7XCIkXCI6MH0sXCJob25nb1wiOntcIiRcIjowfSxcImppbnNla2lrb2dlblwiOntcIiRcIjowfSxcImthaXRhXCI6e1wiJFwiOjB9LFwia3VpXCI6e1wiJFwiOjB9LFwia3VtYW5vXCI6e1wiJFwiOjB9LFwia3VyZVwiOntcIiRcIjowfSxcIm1paGFyYVwiOntcIiRcIjowfSxcIm1peW9zaGlcIjp7XCIkXCI6MH0sXCJuYWthXCI6e1wiJFwiOjB9LFwib25vbWljaGlcIjp7XCIkXCI6MH0sXCJvc2FraWthbWlqaW1hXCI6e1wiJFwiOjB9LFwib3Rha2VcIjp7XCIkXCI6MH0sXCJzYWthXCI6e1wiJFwiOjB9LFwic2VyYVwiOntcIiRcIjowfSxcInNlcmFuaXNoaVwiOntcIiRcIjowfSxcInNoaW5pY2hpXCI6e1wiJFwiOjB9LFwic2hvYmFyYVwiOntcIiRcIjowfSxcInRha2VoYXJhXCI6e1wiJFwiOjB9fSxcImhva2thaWRvXCI6e1wiJFwiOjAsXCJhYmFzaGlyaVwiOntcIiRcIjowfSxcImFiaXJhXCI6e1wiJFwiOjB9LFwiYWliZXRzdVwiOntcIiRcIjowfSxcImFrYWJpcmFcIjp7XCIkXCI6MH0sXCJha2tlc2hpXCI6e1wiJFwiOjB9LFwiYXNhaGlrYXdhXCI6e1wiJFwiOjB9LFwiYXNoaWJldHN1XCI6e1wiJFwiOjB9LFwiYXNob3JvXCI6e1wiJFwiOjB9LFwiYXNzYWJ1XCI6e1wiJFwiOjB9LFwiYXRzdW1hXCI6e1wiJFwiOjB9LFwiYmliYWlcIjp7XCIkXCI6MH0sXCJiaWVpXCI6e1wiJFwiOjB9LFwiYmlmdWthXCI6e1wiJFwiOjB9LFwiYmlob3JvXCI6e1wiJFwiOjB9LFwiYmlyYXRvcmlcIjp7XCIkXCI6MH0sXCJjaGlwcHViZXRzdVwiOntcIiRcIjowfSxcImNoaXRvc2VcIjp7XCIkXCI6MH0sXCJkYXRlXCI6e1wiJFwiOjB9LFwiZWJldHN1XCI6e1wiJFwiOjB9LFwiZW1iZXRzdVwiOntcIiRcIjowfSxcImVuaXdhXCI6e1wiJFwiOjB9LFwiZXJpbW9cIjp7XCIkXCI6MH0sXCJlc2FuXCI6e1wiJFwiOjB9LFwiZXNhc2hpXCI6e1wiJFwiOjB9LFwiZnVrYWdhd2FcIjp7XCIkXCI6MH0sXCJmdWt1c2hpbWFcIjp7XCIkXCI6MH0sXCJmdXJhbm9cIjp7XCIkXCI6MH0sXCJmdXJ1YmlyYVwiOntcIiRcIjowfSxcImhhYm9yb1wiOntcIiRcIjowfSxcImhha29kYXRlXCI6e1wiJFwiOjB9LFwiaGFtYXRvbmJldHN1XCI6e1wiJFwiOjB9LFwiaGlkYWthXCI6e1wiJFwiOjB9LFwiaGlnYXNoaWthZ3VyYVwiOntcIiRcIjowfSxcImhpZ2FzaGlrYXdhXCI6e1wiJFwiOjB9LFwiaGlyb29cIjp7XCIkXCI6MH0sXCJob2t1cnl1XCI6e1wiJFwiOjB9LFwiaG9rdXRvXCI6e1wiJFwiOjB9LFwiaG9uYmV0c3VcIjp7XCIkXCI6MH0sXCJob3Jva2FuYWlcIjp7XCIkXCI6MH0sXCJob3Jvbm9iZVwiOntcIiRcIjowfSxcImlrZWRhXCI6e1wiJFwiOjB9LFwiaW1ha2FuZVwiOntcIiRcIjowfSxcImlzaGlrYXJpXCI6e1wiJFwiOjB9LFwiaXdhbWl6YXdhXCI6e1wiJFwiOjB9LFwiaXdhbmFpXCI6e1wiJFwiOjB9LFwia2FtaWZ1cmFub1wiOntcIiRcIjowfSxcImthbWlrYXdhXCI6e1wiJFwiOjB9LFwia2FtaXNoaWhvcm9cIjp7XCIkXCI6MH0sXCJrYW1pc3VuYWdhd2FcIjp7XCIkXCI6MH0sXCJrYW1vZW5haVwiOntcIiRcIjowfSxcImtheWFiZVwiOntcIiRcIjowfSxcImtlbWJ1Y2hpXCI6e1wiJFwiOjB9LFwia2lrb25haVwiOntcIiRcIjowfSxcImtpbW9iZXRzdVwiOntcIiRcIjowfSxcImtpdGFoaXJvc2hpbWFcIjp7XCIkXCI6MH0sXCJraXRhbWlcIjp7XCIkXCI6MH0sXCJraXlvc2F0b1wiOntcIiRcIjowfSxcImtvc2hpbWl6dVwiOntcIiRcIjowfSxcImt1bm5lcHB1XCI6e1wiJFwiOjB9LFwia3VyaXlhbWFcIjp7XCIkXCI6MH0sXCJrdXJvbWF0c3VuYWlcIjp7XCIkXCI6MH0sXCJrdXNoaXJvXCI6e1wiJFwiOjB9LFwia3V0Y2hhblwiOntcIiRcIjowfSxcImt5b3dhXCI6e1wiJFwiOjB9LFwibWFzaGlrZVwiOntcIiRcIjowfSxcIm1hdHN1bWFlXCI6e1wiJFwiOjB9LFwibWlrYXNhXCI6e1wiJFwiOjB9LFwibWluYW1pZnVyYW5vXCI6e1wiJFwiOjB9LFwibW9tYmV0c3VcIjp7XCIkXCI6MH0sXCJtb3NldXNoaVwiOntcIiRcIjowfSxcIm11a2F3YVwiOntcIiRcIjowfSxcIm11cm9yYW5cIjp7XCIkXCI6MH0sXCJuYWllXCI6e1wiJFwiOjB9LFwibmFrYWdhd2FcIjp7XCIkXCI6MH0sXCJuYWthc2F0c3VuYWlcIjp7XCIkXCI6MH0sXCJuYWthdG9tYmV0c3VcIjp7XCIkXCI6MH0sXCJuYW5hZVwiOntcIiRcIjowfSxcIm5hbnBvcm9cIjp7XCIkXCI6MH0sXCJuYXlvcm9cIjp7XCIkXCI6MH0sXCJuZW11cm9cIjp7XCIkXCI6MH0sXCJuaWlrYXBwdVwiOntcIiRcIjowfSxcIm5pa2lcIjp7XCIkXCI6MH0sXCJuaXNoaW9rb3BwZVwiOntcIiRcIjowfSxcIm5vYm9yaWJldHN1XCI6e1wiJFwiOjB9LFwibnVtYXRhXCI6e1wiJFwiOjB9LFwib2JpaGlyb1wiOntcIiRcIjowfSxcIm9iaXJhXCI6e1wiJFwiOjB9LFwib2tldG9cIjp7XCIkXCI6MH0sXCJva29wcGVcIjp7XCIkXCI6MH0sXCJvdGFydVwiOntcIiRcIjowfSxcIm90b2JlXCI6e1wiJFwiOjB9LFwib3RvZnVrZVwiOntcIiRcIjowfSxcIm90b2luZXBwdVwiOntcIiRcIjowfSxcIm91bXVcIjp7XCIkXCI6MH0sXCJvem9yYVwiOntcIiRcIjowfSxcInBpcHB1XCI6e1wiJFwiOjB9LFwicmFua29zaGlcIjp7XCIkXCI6MH0sXCJyZWJ1blwiOntcIiRcIjowfSxcInJpa3ViZXRzdVwiOntcIiRcIjowfSxcInJpc2hpcmlcIjp7XCIkXCI6MH0sXCJyaXNoaXJpZnVqaVwiOntcIiRcIjowfSxcInNhcm9tYVwiOntcIiRcIjowfSxcInNhcnVmdXRzdVwiOntcIiRcIjowfSxcInNoYWtvdGFuXCI6e1wiJFwiOjB9LFwic2hhcmlcIjp7XCIkXCI6MH0sXCJzaGliZWNoYVwiOntcIiRcIjowfSxcInNoaWJldHN1XCI6e1wiJFwiOjB9LFwic2hpa2FiZVwiOntcIiRcIjowfSxcInNoaWthb2lcIjp7XCIkXCI6MH0sXCJzaGltYW1ha2lcIjp7XCIkXCI6MH0sXCJzaGltaXp1XCI6e1wiJFwiOjB9LFwic2hpbW9rYXdhXCI6e1wiJFwiOjB9LFwic2hpbnNoaW5vdHN1XCI6e1wiJFwiOjB9LFwic2hpbnRva3VcIjp7XCIkXCI6MH0sXCJzaGlyYW51a2FcIjp7XCIkXCI6MH0sXCJzaGlyYW9pXCI6e1wiJFwiOjB9LFwic2hpcml1Y2hpXCI6e1wiJFwiOjB9LFwic29iZXRzdVwiOntcIiRcIjowfSxcInN1bmFnYXdhXCI6e1wiJFwiOjB9LFwidGFpa2lcIjp7XCIkXCI6MH0sXCJ0YWthc3VcIjp7XCIkXCI6MH0sXCJ0YWtpa2F3YVwiOntcIiRcIjowfSxcInRha2lub3VlXCI6e1wiJFwiOjB9LFwidGVzaGlrYWdhXCI6e1wiJFwiOjB9LFwidG9iZXRzdVwiOntcIiRcIjowfSxcInRvaG1hXCI6e1wiJFwiOjB9LFwidG9tYWtvbWFpXCI6e1wiJFwiOjB9LFwidG9tYXJpXCI6e1wiJFwiOjB9LFwidG95YVwiOntcIiRcIjowfSxcInRveWFrb1wiOntcIiRcIjowfSxcInRveW90b21pXCI6e1wiJFwiOjB9LFwidG95b3VyYVwiOntcIiRcIjowfSxcInRzdWJldHN1XCI6e1wiJFwiOjB9LFwidHN1a2lnYXRhXCI6e1wiJFwiOjB9LFwidXJha2F3YVwiOntcIiRcIjowfSxcInVyYXVzdVwiOntcIiRcIjowfSxcInVyeXVcIjp7XCIkXCI6MH0sXCJ1dGFzaGluYWlcIjp7XCIkXCI6MH0sXCJ3YWtrYW5haVwiOntcIiRcIjowfSxcIndhc3NhbXVcIjp7XCIkXCI6MH0sXCJ5YWt1bW9cIjp7XCIkXCI6MH0sXCJ5b2ljaGlcIjp7XCIkXCI6MH19LFwiaHlvZ29cIjp7XCIkXCI6MCxcImFpb2lcIjp7XCIkXCI6MH0sXCJha2FzaGlcIjp7XCIkXCI6MH0sXCJha29cIjp7XCIkXCI6MH0sXCJhbWFnYXNha2lcIjp7XCIkXCI6MH0sXCJhb2dha2lcIjp7XCIkXCI6MH0sXCJhc2Fnb1wiOntcIiRcIjowfSxcImFzaGl5YVwiOntcIiRcIjowfSxcImF3YWppXCI6e1wiJFwiOjB9LFwiZnVrdXNha2lcIjp7XCIkXCI6MH0sXCJnb3NoaWtpXCI6e1wiJFwiOjB9LFwiaGFyaW1hXCI6e1wiJFwiOjB9LFwiaGltZWppXCI6e1wiJFwiOjB9LFwiaWNoaWthd2FcIjp7XCIkXCI6MH0sXCJpbmFnYXdhXCI6e1wiJFwiOjB9LFwiaXRhbWlcIjp7XCIkXCI6MH0sXCJrYWtvZ2F3YVwiOntcIiRcIjowfSxcImthbWlnb3JpXCI6e1wiJFwiOjB9LFwia2FtaWthd2FcIjp7XCIkXCI6MH0sXCJrYXNhaVwiOntcIiRcIjowfSxcImthc3VnYVwiOntcIiRcIjowfSxcImthd2FuaXNoaVwiOntcIiRcIjowfSxcIm1pa2lcIjp7XCIkXCI6MH0sXCJtaW5hbWlhd2FqaVwiOntcIiRcIjowfSxcIm5pc2hpbm9taXlhXCI6e1wiJFwiOjB9LFwibmlzaGl3YWtpXCI6e1wiJFwiOjB9LFwib25vXCI6e1wiJFwiOjB9LFwic2FuZGFcIjp7XCIkXCI6MH0sXCJzYW5uYW5cIjp7XCIkXCI6MH0sXCJzYXNheWFtYVwiOntcIiRcIjowfSxcInNheW9cIjp7XCIkXCI6MH0sXCJzaGluZ3VcIjp7XCIkXCI6MH0sXCJzaGlub25zZW5cIjp7XCIkXCI6MH0sXCJzaGlzb1wiOntcIiRcIjowfSxcInN1bW90b1wiOntcIiRcIjowfSxcInRhaXNoaVwiOntcIiRcIjowfSxcInRha2FcIjp7XCIkXCI6MH0sXCJ0YWthcmF6dWthXCI6e1wiJFwiOjB9LFwidGFrYXNhZ29cIjp7XCIkXCI6MH0sXCJ0YWtpbm9cIjp7XCIkXCI6MH0sXCJ0YW1iYVwiOntcIiRcIjowfSxcInRhdHN1bm9cIjp7XCIkXCI6MH0sXCJ0b3lvb2thXCI6e1wiJFwiOjB9LFwieWFidVwiOntcIiRcIjowfSxcInlhc2hpcm9cIjp7XCIkXCI6MH0sXCJ5b2thXCI6e1wiJFwiOjB9LFwieW9rYXdhXCI6e1wiJFwiOjB9fSxcImliYXJha2lcIjp7XCIkXCI6MCxcImFtaVwiOntcIiRcIjowfSxcImFzYWhpXCI6e1wiJFwiOjB9LFwiYmFuZG9cIjp7XCIkXCI6MH0sXCJjaGlrdXNlaVwiOntcIiRcIjowfSxcImRhaWdvXCI6e1wiJFwiOjB9LFwiZnVqaXNoaXJvXCI6e1wiJFwiOjB9LFwiaGl0YWNoaVwiOntcIiRcIjowfSxcImhpdGFjaGluYWthXCI6e1wiJFwiOjB9LFwiaGl0YWNoaW9taXlhXCI6e1wiJFwiOjB9LFwiaGl0YWNoaW90YVwiOntcIiRcIjowfSxcImliYXJha2lcIjp7XCIkXCI6MH0sXCJpbmFcIjp7XCIkXCI6MH0sXCJpbmFzaGlraVwiOntcIiRcIjowfSxcIml0YWtvXCI6e1wiJFwiOjB9LFwiaXdhbWFcIjp7XCIkXCI6MH0sXCJqb3NvXCI6e1wiJFwiOjB9LFwia2FtaXN1XCI6e1wiJFwiOjB9LFwia2FzYW1hXCI6e1wiJFwiOjB9LFwia2FzaGltYVwiOntcIiRcIjowfSxcImthc3VtaWdhdXJhXCI6e1wiJFwiOjB9LFwia29nYVwiOntcIiRcIjowfSxcIm1paG9cIjp7XCIkXCI6MH0sXCJtaXRvXCI6e1wiJFwiOjB9LFwibW9yaXlhXCI6e1wiJFwiOjB9LFwibmFrYVwiOntcIiRcIjowfSxcIm5hbWVnYXRhXCI6e1wiJFwiOjB9LFwib2FyYWlcIjp7XCIkXCI6MH0sXCJvZ2F3YVwiOntcIiRcIjowfSxcIm9taXRhbWFcIjp7XCIkXCI6MH0sXCJyeXVnYXNha2lcIjp7XCIkXCI6MH0sXCJzYWthaVwiOntcIiRcIjowfSxcInNha3VyYWdhd2FcIjp7XCIkXCI6MH0sXCJzaGltb2RhdGVcIjp7XCIkXCI6MH0sXCJzaGltb3RzdW1hXCI6e1wiJFwiOjB9LFwic2hpcm9zYXRvXCI6e1wiJFwiOjB9LFwic293YVwiOntcIiRcIjowfSxcInN1aWZ1XCI6e1wiJFwiOjB9LFwidGFrYWhhZ2lcIjp7XCIkXCI6MH0sXCJ0YW1hdHN1a3VyaVwiOntcIiRcIjowfSxcInRva2FpXCI6e1wiJFwiOjB9LFwidG9tb2JlXCI6e1wiJFwiOjB9LFwidG9uZVwiOntcIiRcIjowfSxcInRvcmlkZVwiOntcIiRcIjowfSxcInRzdWNoaXVyYVwiOntcIiRcIjowfSxcInRzdWt1YmFcIjp7XCIkXCI6MH0sXCJ1Y2hpaGFyYVwiOntcIiRcIjowfSxcInVzaGlrdVwiOntcIiRcIjowfSxcInlhY2hpeW9cIjp7XCIkXCI6MH0sXCJ5YW1hZ2F0YVwiOntcIiRcIjowfSxcInlhd2FyYVwiOntcIiRcIjowfSxcInl1a2lcIjp7XCIkXCI6MH19LFwiaXNoaWthd2FcIjp7XCIkXCI6MCxcImFuYW1penVcIjp7XCIkXCI6MH0sXCJoYWt1aVwiOntcIiRcIjowfSxcImhha3VzYW5cIjp7XCIkXCI6MH0sXCJrYWdhXCI6e1wiJFwiOjB9LFwia2Fob2t1XCI6e1wiJFwiOjB9LFwia2FuYXphd2FcIjp7XCIkXCI6MH0sXCJrYXdha2l0YVwiOntcIiRcIjowfSxcImtvbWF0c3VcIjp7XCIkXCI6MH0sXCJuYWthbm90b1wiOntcIiRcIjowfSxcIm5hbmFvXCI6e1wiJFwiOjB9LFwibm9taVwiOntcIiRcIjowfSxcIm5vbm9pY2hpXCI6e1wiJFwiOjB9LFwibm90b1wiOntcIiRcIjowfSxcInNoaWthXCI6e1wiJFwiOjB9LFwic3V6dVwiOntcIiRcIjowfSxcInRzdWJhdGFcIjp7XCIkXCI6MH0sXCJ0c3VydWdpXCI6e1wiJFwiOjB9LFwidWNoaW5hZGFcIjp7XCIkXCI6MH0sXCJ3YWppbWFcIjp7XCIkXCI6MH19LFwiaXdhdGVcIjp7XCIkXCI6MCxcImZ1ZGFpXCI6e1wiJFwiOjB9LFwiZnVqaXNhd2FcIjp7XCIkXCI6MH0sXCJoYW5hbWFraVwiOntcIiRcIjowfSxcImhpcmFpenVtaVwiOntcIiRcIjowfSxcImhpcm9ub1wiOntcIiRcIjowfSxcImljaGlub2hlXCI6e1wiJFwiOjB9LFwiaWNoaW5vc2VraVwiOntcIiRcIjowfSxcIml3YWl6dW1pXCI6e1wiJFwiOjB9LFwiaXdhdGVcIjp7XCIkXCI6MH0sXCJqb2JvamlcIjp7XCIkXCI6MH0sXCJrYW1haXNoaVwiOntcIiRcIjowfSxcImthbmVnYXNha2lcIjp7XCIkXCI6MH0sXCJrYXJ1bWFpXCI6e1wiJFwiOjB9LFwia2F3YWlcIjp7XCIkXCI6MH0sXCJraXRha2FtaVwiOntcIiRcIjowfSxcImt1amlcIjp7XCIkXCI6MH0sXCJrdW5vaGVcIjp7XCIkXCI6MH0sXCJrdXp1bWFraVwiOntcIiRcIjowfSxcIm1peWFrb1wiOntcIiRcIjowfSxcIm1penVzYXdhXCI6e1wiJFwiOjB9LFwibW9yaW9rYVwiOntcIiRcIjowfSxcIm5pbm9oZVwiOntcIiRcIjowfSxcIm5vZGFcIjp7XCIkXCI6MH0sXCJvZnVuYXRvXCI6e1wiJFwiOjB9LFwib3NodVwiOntcIiRcIjowfSxcIm90c3VjaGlcIjp7XCIkXCI6MH0sXCJyaWt1emVudGFrYXRhXCI6e1wiJFwiOjB9LFwic2hpd2FcIjp7XCIkXCI6MH0sXCJzaGl6dWt1aXNoaVwiOntcIiRcIjowfSxcInN1bWl0YVwiOntcIiRcIjowfSxcInRhbm9oYXRhXCI6e1wiJFwiOjB9LFwidG9ub1wiOntcIiRcIjowfSxcInlhaGFiYVwiOntcIiRcIjowfSxcInlhbWFkYVwiOntcIiRcIjowfX0sXCJrYWdhd2FcIjp7XCIkXCI6MCxcImF5YWdhd2FcIjp7XCIkXCI6MH0sXCJoaWdhc2hpa2FnYXdhXCI6e1wiJFwiOjB9LFwia2Fub25qaVwiOntcIiRcIjowfSxcImtvdG9oaXJhXCI6e1wiJFwiOjB9LFwibWFubm9cIjp7XCIkXCI6MH0sXCJtYXJ1Z2FtZVwiOntcIiRcIjowfSxcIm1pdG95b1wiOntcIiRcIjowfSxcIm5hb3NoaW1hXCI6e1wiJFwiOjB9LFwic2FudWtpXCI6e1wiJFwiOjB9LFwidGFkb3RzdVwiOntcIiRcIjowfSxcInRha2FtYXRzdVwiOntcIiRcIjowfSxcInRvbm9zaG9cIjp7XCIkXCI6MH0sXCJ1Y2hpbm9taVwiOntcIiRcIjowfSxcInV0YXp1XCI6e1wiJFwiOjB9LFwiemVudHN1amlcIjp7XCIkXCI6MH19LFwia2Fnb3NoaW1hXCI6e1wiJFwiOjAsXCJha3VuZVwiOntcIiRcIjowfSxcImFtYW1pXCI6e1wiJFwiOjB9LFwiaGlva2lcIjp7XCIkXCI6MH0sXCJpc2FcIjp7XCIkXCI6MH0sXCJpc2VuXCI6e1wiJFwiOjB9LFwiaXp1bWlcIjp7XCIkXCI6MH0sXCJrYWdvc2hpbWFcIjp7XCIkXCI6MH0sXCJrYW5veWFcIjp7XCIkXCI6MH0sXCJrYXdhbmFiZVwiOntcIiRcIjowfSxcImtpbmtvXCI6e1wiJFwiOjB9LFwia291eWFtYVwiOntcIiRcIjowfSxcIm1ha3VyYXpha2lcIjp7XCIkXCI6MH0sXCJtYXRzdW1vdG9cIjp7XCIkXCI6MH0sXCJtaW5hbWl0YW5lXCI6e1wiJFwiOjB9LFwibmFrYXRhbmVcIjp7XCIkXCI6MH0sXCJuaXNoaW5vb21vdGVcIjp7XCIkXCI6MH0sXCJzYXRzdW1hc2VuZGFpXCI6e1wiJFwiOjB9LFwic29vXCI6e1wiJFwiOjB9LFwidGFydW1penVcIjp7XCIkXCI6MH0sXCJ5dXN1aVwiOntcIiRcIjowfX0sXCJrYW5hZ2F3YVwiOntcIiRcIjowLFwiYWlrYXdhXCI6e1wiJFwiOjB9LFwiYXRzdWdpXCI6e1wiJFwiOjB9LFwiYXlhc2VcIjp7XCIkXCI6MH0sXCJjaGlnYXNha2lcIjp7XCIkXCI6MH0sXCJlYmluYVwiOntcIiRcIjowfSxcImZ1amlzYXdhXCI6e1wiJFwiOjB9LFwiaGFkYW5vXCI6e1wiJFwiOjB9LFwiaGFrb25lXCI6e1wiJFwiOjB9LFwiaGlyYXRzdWthXCI6e1wiJFwiOjB9LFwiaXNlaGFyYVwiOntcIiRcIjowfSxcImthaXNlaVwiOntcIiRcIjowfSxcImthbWFrdXJhXCI6e1wiJFwiOjB9LFwia2l5b2thd2FcIjp7XCIkXCI6MH0sXCJtYXRzdWRhXCI6e1wiJFwiOjB9LFwibWluYW1pYXNoaWdhcmFcIjp7XCIkXCI6MH0sXCJtaXVyYVwiOntcIiRcIjowfSxcIm5ha2FpXCI6e1wiJFwiOjB9LFwibmlub21peWFcIjp7XCIkXCI6MH0sXCJvZGF3YXJhXCI6e1wiJFwiOjB9LFwib2lcIjp7XCIkXCI6MH0sXCJvaXNvXCI6e1wiJFwiOjB9LFwic2FnYW1paGFyYVwiOntcIiRcIjowfSxcInNhbXVrYXdhXCI6e1wiJFwiOjB9LFwidHN1a3VpXCI6e1wiJFwiOjB9LFwieWFtYWtpdGFcIjp7XCIkXCI6MH0sXCJ5YW1hdG9cIjp7XCIkXCI6MH0sXCJ5b2tvc3VrYVwiOntcIiRcIjowfSxcInl1Z2F3YXJhXCI6e1wiJFwiOjB9LFwiemFtYVwiOntcIiRcIjowfSxcInp1c2hpXCI6e1wiJFwiOjB9fSxcImtvY2hpXCI6e1wiJFwiOjAsXCJha2lcIjp7XCIkXCI6MH0sXCJnZWlzZWlcIjp7XCIkXCI6MH0sXCJoaWRha2FcIjp7XCIkXCI6MH0sXCJoaWdhc2hpdHN1bm9cIjp7XCIkXCI6MH0sXCJpbm9cIjp7XCIkXCI6MH0sXCJrYWdhbWlcIjp7XCIkXCI6MH0sXCJrYW1pXCI6e1wiJFwiOjB9LFwia2l0YWdhd2FcIjp7XCIkXCI6MH0sXCJrb2NoaVwiOntcIiRcIjowfSxcIm1paGFyYVwiOntcIiRcIjowfSxcIm1vdG95YW1hXCI6e1wiJFwiOjB9LFwibXVyb3RvXCI6e1wiJFwiOjB9LFwibmFoYXJpXCI6e1wiJFwiOjB9LFwibmFrYW11cmFcIjp7XCIkXCI6MH0sXCJuYW5rb2t1XCI6e1wiJFwiOjB9LFwibmlzaGl0b3NhXCI6e1wiJFwiOjB9LFwibml5b2RvZ2F3YVwiOntcIiRcIjowfSxcIm9jaGlcIjp7XCIkXCI6MH0sXCJva2F3YVwiOntcIiRcIjowfSxcIm90b3lvXCI6e1wiJFwiOjB9LFwib3RzdWtpXCI6e1wiJFwiOjB9LFwic2FrYXdhXCI6e1wiJFwiOjB9LFwic3VrdW1vXCI6e1wiJFwiOjB9LFwic3VzYWtpXCI6e1wiJFwiOjB9LFwidG9zYVwiOntcIiRcIjowfSxcInRvc2FzaGltaXp1XCI6e1wiJFwiOjB9LFwidG95b1wiOntcIiRcIjowfSxcInRzdW5vXCI6e1wiJFwiOjB9LFwidW1hamlcIjp7XCIkXCI6MH0sXCJ5YXN1ZGFcIjp7XCIkXCI6MH0sXCJ5dXN1aGFyYVwiOntcIiRcIjowfX0sXCJrdW1hbW90b1wiOntcIiRcIjowLFwiYW1ha3VzYVwiOntcIiRcIjowfSxcImFyYW9cIjp7XCIkXCI6MH0sXCJhc29cIjp7XCIkXCI6MH0sXCJjaG95b1wiOntcIiRcIjowfSxcImd5b2t1dG9cIjp7XCIkXCI6MH0sXCJrYW1pYW1ha3VzYVwiOntcIiRcIjowfSxcImtpa3VjaGlcIjp7XCIkXCI6MH0sXCJrdW1hbW90b1wiOntcIiRcIjowfSxcIm1hc2hpa2lcIjp7XCIkXCI6MH0sXCJtaWZ1bmVcIjp7XCIkXCI6MH0sXCJtaW5hbWF0YVwiOntcIiRcIjowfSxcIm1pbmFtaW9ndW5pXCI6e1wiJFwiOjB9LFwibmFnYXN1XCI6e1wiJFwiOjB9LFwibmlzaGloYXJhXCI6e1wiJFwiOjB9LFwib2d1bmlcIjp7XCIkXCI6MH0sXCJvenVcIjp7XCIkXCI6MH0sXCJzdW1vdG9cIjp7XCIkXCI6MH0sXCJ0YWthbW9yaVwiOntcIiRcIjowfSxcInVraVwiOntcIiRcIjowfSxcInV0b1wiOntcIiRcIjowfSxcInlhbWFnYVwiOntcIiRcIjowfSxcInlhbWF0b1wiOntcIiRcIjowfSxcInlhdHN1c2hpcm9cIjp7XCIkXCI6MH19LFwia3lvdG9cIjp7XCIkXCI6MCxcImF5YWJlXCI6e1wiJFwiOjB9LFwiZnVrdWNoaXlhbWFcIjp7XCIkXCI6MH0sXCJoaWdhc2hpeWFtYVwiOntcIiRcIjowfSxcImlkZVwiOntcIiRcIjowfSxcImluZVwiOntcIiRcIjowfSxcImpveW9cIjp7XCIkXCI6MH0sXCJrYW1lb2thXCI6e1wiJFwiOjB9LFwia2Ftb1wiOntcIiRcIjowfSxcImtpdGFcIjp7XCIkXCI6MH0sXCJraXp1XCI6e1wiJFwiOjB9LFwia3VtaXlhbWFcIjp7XCIkXCI6MH0sXCJreW90YW1iYVwiOntcIiRcIjowfSxcImt5b3RhbmFiZVwiOntcIiRcIjowfSxcImt5b3RhbmdvXCI6e1wiJFwiOjB9LFwibWFpenVydVwiOntcIiRcIjowfSxcIm1pbmFtaVwiOntcIiRcIjowfSxcIm1pbmFtaXlhbWFzaGlyb1wiOntcIiRcIjowfSxcIm1peWF6dVwiOntcIiRcIjowfSxcIm11a29cIjp7XCIkXCI6MH0sXCJuYWdhb2tha3lvXCI6e1wiJFwiOjB9LFwibmFrYWd5b1wiOntcIiRcIjowfSxcIm5hbnRhblwiOntcIiRcIjowfSxcIm95YW1hemFraVwiOntcIiRcIjowfSxcInNha3lvXCI6e1wiJFwiOjB9LFwic2Vpa2FcIjp7XCIkXCI6MH0sXCJ0YW5hYmVcIjp7XCIkXCI6MH0sXCJ1amlcIjp7XCIkXCI6MH0sXCJ1aml0YXdhcmFcIjp7XCIkXCI6MH0sXCJ3YXp1a2FcIjp7XCIkXCI6MH0sXCJ5YW1hc2hpbmFcIjp7XCIkXCI6MH0sXCJ5YXdhdGFcIjp7XCIkXCI6MH19LFwibWllXCI6e1wiJFwiOjAsXCJhc2FoaVwiOntcIiRcIjowfSxcImluYWJlXCI6e1wiJFwiOjB9LFwiaXNlXCI6e1wiJFwiOjB9LFwia2FtZXlhbWFcIjp7XCIkXCI6MH0sXCJrYXdhZ29lXCI6e1wiJFwiOjB9LFwia2lob1wiOntcIiRcIjowfSxcImtpc29zYWtpXCI6e1wiJFwiOjB9LFwia2l3YVwiOntcIiRcIjowfSxcImtvbW9ub1wiOntcIiRcIjowfSxcImt1bWFub1wiOntcIiRcIjowfSxcImt1d2FuYVwiOntcIiRcIjowfSxcIm1hdHN1c2FrYVwiOntcIiRcIjowfSxcIm1laXdhXCI6e1wiJFwiOjB9LFwibWloYW1hXCI6e1wiJFwiOjB9LFwibWluYW1paXNlXCI6e1wiJFwiOjB9LFwibWlzdWdpXCI6e1wiJFwiOjB9LFwibWl5YW1hXCI6e1wiJFwiOjB9LFwibmFiYXJpXCI6e1wiJFwiOjB9LFwic2hpbWFcIjp7XCIkXCI6MH0sXCJzdXp1a2FcIjp7XCIkXCI6MH0sXCJ0YWRvXCI6e1wiJFwiOjB9LFwidGFpa2lcIjp7XCIkXCI6MH0sXCJ0YWtpXCI6e1wiJFwiOjB9LFwidGFtYWtpXCI6e1wiJFwiOjB9LFwidG9iYVwiOntcIiRcIjowfSxcInRzdVwiOntcIiRcIjowfSxcInVkb25vXCI6e1wiJFwiOjB9LFwidXJlc2hpbm9cIjp7XCIkXCI6MH0sXCJ3YXRhcmFpXCI6e1wiJFwiOjB9LFwieW9ra2FpY2hpXCI6e1wiJFwiOjB9fSxcIm1peWFnaVwiOntcIiRcIjowLFwiZnVydWthd2FcIjp7XCIkXCI6MH0sXCJoaWdhc2hpbWF0c3VzaGltYVwiOntcIiRcIjowfSxcImlzaGlub21ha2lcIjp7XCIkXCI6MH0sXCJpd2FudW1hXCI6e1wiJFwiOjB9LFwia2FrdWRhXCI6e1wiJFwiOjB9LFwia2FtaVwiOntcIiRcIjowfSxcImthd2FzYWtpXCI6e1wiJFwiOjB9LFwibWFydW1vcmlcIjp7XCIkXCI6MH0sXCJtYXRzdXNoaW1hXCI6e1wiJFwiOjB9LFwibWluYW1pc2FucmlrdVwiOntcIiRcIjowfSxcIm1pc2F0b1wiOntcIiRcIjowfSxcIm11cmF0YVwiOntcIiRcIjowfSxcIm5hdG9yaVwiOntcIiRcIjowfSxcIm9nYXdhcmFcIjp7XCIkXCI6MH0sXCJvaGlyYVwiOntcIiRcIjowfSxcIm9uYWdhd2FcIjp7XCIkXCI6MH0sXCJvc2FraVwiOntcIiRcIjowfSxcInJpZnVcIjp7XCIkXCI6MH0sXCJzZW1pbmVcIjp7XCIkXCI6MH0sXCJzaGliYXRhXCI6e1wiJFwiOjB9LFwic2hpY2hpa2FzaHVrdVwiOntcIiRcIjowfSxcInNoaWthbWFcIjp7XCIkXCI6MH0sXCJzaGlvZ2FtYVwiOntcIiRcIjowfSxcInNoaXJvaXNoaVwiOntcIiRcIjowfSxcInRhZ2Fqb1wiOntcIiRcIjowfSxcInRhaXdhXCI6e1wiJFwiOjB9LFwidG9tZVwiOntcIiRcIjowfSxcInRvbWl5YVwiOntcIiRcIjowfSxcIndha3V5YVwiOntcIiRcIjowfSxcIndhdGFyaVwiOntcIiRcIjowfSxcInlhbWFtb3RvXCI6e1wiJFwiOjB9LFwiemFvXCI6e1wiJFwiOjB9fSxcIm1peWF6YWtpXCI6e1wiJFwiOjAsXCJheWFcIjp7XCIkXCI6MH0sXCJlYmlub1wiOntcIiRcIjowfSxcImdva2FzZVwiOntcIiRcIjowfSxcImh5dWdhXCI6e1wiJFwiOjB9LFwia2Fkb2dhd2FcIjp7XCIkXCI6MH0sXCJrYXdhbWluYW1pXCI6e1wiJFwiOjB9LFwia2lqb1wiOntcIiRcIjowfSxcImtpdGFnYXdhXCI6e1wiJFwiOjB9LFwia2l0YWthdGFcIjp7XCIkXCI6MH0sXCJraXRhdXJhXCI6e1wiJFwiOjB9LFwia29iYXlhc2hpXCI6e1wiJFwiOjB9LFwia3VuaXRvbWlcIjp7XCIkXCI6MH0sXCJrdXNoaW1hXCI6e1wiJFwiOjB9LFwibWltYXRhXCI6e1wiJFwiOjB9LFwibWl5YWtvbm9qb1wiOntcIiRcIjowfSxcIm1peWF6YWtpXCI6e1wiJFwiOjB9LFwibW9yb3RzdWthXCI6e1wiJFwiOjB9LFwibmljaGluYW5cIjp7XCIkXCI6MH0sXCJuaXNoaW1lcmFcIjp7XCIkXCI6MH0sXCJub2Jlb2thXCI6e1wiJFwiOjB9LFwic2FpdG9cIjp7XCIkXCI6MH0sXCJzaGlpYmFcIjp7XCIkXCI6MH0sXCJzaGludG9taVwiOntcIiRcIjowfSxcInRha2FoYXJ1XCI6e1wiJFwiOjB9LFwidGFrYW5hYmVcIjp7XCIkXCI6MH0sXCJ0YWthemFraVwiOntcIiRcIjowfSxcInRzdW5vXCI6e1wiJFwiOjB9fSxcIm5hZ2Fub1wiOntcIiRcIjowLFwiYWNoaVwiOntcIiRcIjowfSxcImFnZW1hdHN1XCI6e1wiJFwiOjB9LFwiYW5hblwiOntcIiRcIjowfSxcImFva2lcIjp7XCIkXCI6MH0sXCJhc2FoaVwiOntcIiRcIjowfSxcImF6dW1pbm9cIjp7XCIkXCI6MH0sXCJjaGlrdWhva3VcIjp7XCIkXCI6MH0sXCJjaGlrdW1hXCI6e1wiJFwiOjB9LFwiY2hpbm9cIjp7XCIkXCI6MH0sXCJmdWppbWlcIjp7XCIkXCI6MH0sXCJoYWt1YmFcIjp7XCIkXCI6MH0sXCJoYXJhXCI6e1wiJFwiOjB9LFwiaGlyYXlhXCI6e1wiJFwiOjB9LFwiaWlkYVwiOntcIiRcIjowfSxcImlpamltYVwiOntcIiRcIjowfSxcImlpeWFtYVwiOntcIiRcIjowfSxcImlpenVuYVwiOntcIiRcIjowfSxcImlrZWRhXCI6e1wiJFwiOjB9LFwiaWt1c2FrYVwiOntcIiRcIjowfSxcImluYVwiOntcIiRcIjowfSxcImthcnVpemF3YVwiOntcIiRcIjowfSxcImthd2FrYW1pXCI6e1wiJFwiOjB9LFwia2lzb1wiOntcIiRcIjowfSxcImtpc29mdWt1c2hpbWFcIjp7XCIkXCI6MH0sXCJraXRhYWlraVwiOntcIiRcIjowfSxcImtvbWFnYW5lXCI6e1wiJFwiOjB9LFwia29tb3JvXCI6e1wiJFwiOjB9LFwibWF0c3VrYXdhXCI6e1wiJFwiOjB9LFwibWF0c3Vtb3RvXCI6e1wiJFwiOjB9LFwibWlhc2FcIjp7XCIkXCI6MH0sXCJtaW5hbWlhaWtpXCI6e1wiJFwiOjB9LFwibWluYW1pbWFraVwiOntcIiRcIjowfSxcIm1pbmFtaW1pbm93YVwiOntcIiRcIjowfSxcIm1pbm93YVwiOntcIiRcIjowfSxcIm1peWFkYVwiOntcIiRcIjowfSxcIm1peW90YVwiOntcIiRcIjowfSxcIm1vY2hpenVraVwiOntcIiRcIjowfSxcIm5hZ2Fub1wiOntcIiRcIjowfSxcIm5hZ2F3YVwiOntcIiRcIjowfSxcIm5hZ2lzb1wiOntcIiRcIjowfSxcIm5ha2FnYXdhXCI6e1wiJFwiOjB9LFwibmFrYW5vXCI6e1wiJFwiOjB9LFwibm96YXdhb25zZW5cIjp7XCIkXCI6MH0sXCJvYnVzZVwiOntcIiRcIjowfSxcIm9nYXdhXCI6e1wiJFwiOjB9LFwib2theWFcIjp7XCIkXCI6MH0sXCJvbWFjaGlcIjp7XCIkXCI6MH0sXCJvbWlcIjp7XCIkXCI6MH0sXCJvb2t1d2FcIjp7XCIkXCI6MH0sXCJvb3NoaWthXCI6e1wiJFwiOjB9LFwib3Rha2lcIjp7XCIkXCI6MH0sXCJvdGFyaVwiOntcIiRcIjowfSxcInNha2FlXCI6e1wiJFwiOjB9LFwic2FrYWtpXCI6e1wiJFwiOjB9LFwic2FrdVwiOntcIiRcIjowfSxcInNha3Vob1wiOntcIiRcIjowfSxcInNoaW1vc3V3YVwiOntcIiRcIjowfSxcInNoaW5hbm9tYWNoaVwiOntcIiRcIjowfSxcInNoaW9qaXJpXCI6e1wiJFwiOjB9LFwic3V3YVwiOntcIiRcIjowfSxcInN1emFrYVwiOntcIiRcIjowfSxcInRha2FnaVwiOntcIiRcIjowfSxcInRha2Ftb3JpXCI6e1wiJFwiOjB9LFwidGFrYXlhbWFcIjp7XCIkXCI6MH0sXCJ0YXRlc2hpbmFcIjp7XCIkXCI6MH0sXCJ0YXRzdW5vXCI6e1wiJFwiOjB9LFwidG9nYWt1c2hpXCI6e1wiJFwiOjB9LFwidG9ndXJhXCI6e1wiJFwiOjB9LFwidG9taVwiOntcIiRcIjowfSxcInVlZGFcIjp7XCIkXCI6MH0sXCJ3YWRhXCI6e1wiJFwiOjB9LFwieWFtYWdhdGFcIjp7XCIkXCI6MH0sXCJ5YW1hbm91Y2hpXCI6e1wiJFwiOjB9LFwieWFzYWthXCI6e1wiJFwiOjB9LFwieWFzdW9rYVwiOntcIiRcIjowfX0sXCJuYWdhc2FraVwiOntcIiRcIjowLFwiY2hpaml3YVwiOntcIiRcIjowfSxcImZ1dHN1XCI6e1wiJFwiOjB9LFwiZ290b1wiOntcIiRcIjowfSxcImhhc2FtaVwiOntcIiRcIjowfSxcImhpcmFkb1wiOntcIiRcIjowfSxcImlraVwiOntcIiRcIjowfSxcImlzYWhheWFcIjp7XCIkXCI6MH0sXCJrYXdhdGFuYVwiOntcIiRcIjowfSxcImt1Y2hpbm90c3VcIjp7XCIkXCI6MH0sXCJtYXRzdXVyYVwiOntcIiRcIjowfSxcIm5hZ2FzYWtpXCI6e1wiJFwiOjB9LFwib2JhbWFcIjp7XCIkXCI6MH0sXCJvbXVyYVwiOntcIiRcIjowfSxcIm9zZXRvXCI6e1wiJFwiOjB9LFwic2Fpa2FpXCI6e1wiJFwiOjB9LFwic2FzZWJvXCI6e1wiJFwiOjB9LFwic2VpaGlcIjp7XCIkXCI6MH0sXCJzaGltYWJhcmFcIjp7XCIkXCI6MH0sXCJzaGlua2FtaWdvdG9cIjp7XCIkXCI6MH0sXCJ0b2dpdHN1XCI6e1wiJFwiOjB9LFwidHN1c2hpbWFcIjp7XCIkXCI6MH0sXCJ1bnplblwiOntcIiRcIjowfX0sXCJuYXJhXCI6e1wiJFwiOjAsXCJhbmRvXCI6e1wiJFwiOjB9LFwiZ29zZVwiOntcIiRcIjowfSxcImhlZ3VyaVwiOntcIiRcIjowfSxcImhpZ2FzaGl5b3NoaW5vXCI6e1wiJFwiOjB9LFwiaWthcnVnYVwiOntcIiRcIjowfSxcImlrb21hXCI6e1wiJFwiOjB9LFwia2FtaWtpdGF5YW1hXCI6e1wiJFwiOjB9LFwia2FubWFraVwiOntcIiRcIjowfSxcImthc2hpYmFcIjp7XCIkXCI6MH0sXCJrYXNoaWhhcmFcIjp7XCIkXCI6MH0sXCJrYXRzdXJhZ2lcIjp7XCIkXCI6MH0sXCJrYXdhaVwiOntcIiRcIjowfSxcImthd2FrYW1pXCI6e1wiJFwiOjB9LFwia2F3YW5pc2hpXCI6e1wiJFwiOjB9LFwia29yeW9cIjp7XCIkXCI6MH0sXCJrdXJvdGFraVwiOntcIiRcIjowfSxcIm1pdHN1ZVwiOntcIiRcIjowfSxcIm1peWFrZVwiOntcIiRcIjowfSxcIm5hcmFcIjp7XCIkXCI6MH0sXCJub3NlZ2F3YVwiOntcIiRcIjowfSxcIm9qaVwiOntcIiRcIjowfSxcIm91ZGFcIjp7XCIkXCI6MH0sXCJveW9kb1wiOntcIiRcIjowfSxcInNha3VyYWlcIjp7XCIkXCI6MH0sXCJzYW5nb1wiOntcIiRcIjowfSxcInNoaW1vaWNoaVwiOntcIiRcIjowfSxcInNoaW1va2l0YXlhbWFcIjp7XCIkXCI6MH0sXCJzaGluam9cIjp7XCIkXCI6MH0sXCJzb25pXCI6e1wiJFwiOjB9LFwidGFrYXRvcmlcIjp7XCIkXCI6MH0sXCJ0YXdhcmFtb3RvXCI6e1wiJFwiOjB9LFwidGVua2F3YVwiOntcIiRcIjowfSxcInRlbnJpXCI6e1wiJFwiOjB9LFwidWRhXCI6e1wiJFwiOjB9LFwieWFtYXRva29yaXlhbWFcIjp7XCIkXCI6MH0sXCJ5YW1hdG90YWthZGFcIjp7XCIkXCI6MH0sXCJ5YW1hem9lXCI6e1wiJFwiOjB9LFwieW9zaGlub1wiOntcIiRcIjowfX0sXCJuaWlnYXRhXCI6e1wiJFwiOjAsXCJhZ2FcIjp7XCIkXCI6MH0sXCJhZ2Fub1wiOntcIiRcIjowfSxcImdvc2VuXCI6e1wiJFwiOjB9LFwiaXRvaWdhd2FcIjp7XCIkXCI6MH0sXCJpenVtb3pha2lcIjp7XCIkXCI6MH0sXCJqb2V0c3VcIjp7XCIkXCI6MH0sXCJrYW1vXCI6e1wiJFwiOjB9LFwia2FyaXdhXCI6e1wiJFwiOjB9LFwia2FzaGl3YXpha2lcIjp7XCIkXCI6MH0sXCJtaW5hbWl1b251bWFcIjp7XCIkXCI6MH0sXCJtaXRzdWtlXCI6e1wiJFwiOjB9LFwibXVpa2FcIjp7XCIkXCI6MH0sXCJtdXJha2FtaVwiOntcIiRcIjowfSxcIm15b2tvXCI6e1wiJFwiOjB9LFwibmFnYW9rYVwiOntcIiRcIjowfSxcIm5paWdhdGFcIjp7XCIkXCI6MH0sXCJvaml5YVwiOntcIiRcIjowfSxcIm9taVwiOntcIiRcIjowfSxcInNhZG9cIjp7XCIkXCI6MH0sXCJzYW5qb1wiOntcIiRcIjowfSxcInNlaXJvXCI6e1wiJFwiOjB9LFwic2Vpcm91XCI6e1wiJFwiOjB9LFwic2VraWthd2FcIjp7XCIkXCI6MH0sXCJzaGliYXRhXCI6e1wiJFwiOjB9LFwidGFnYW1pXCI6e1wiJFwiOjB9LFwidGFpbmFpXCI6e1wiJFwiOjB9LFwidG9jaGlvXCI6e1wiJFwiOjB9LFwidG9rYW1hY2hpXCI6e1wiJFwiOjB9LFwidHN1YmFtZVwiOntcIiRcIjowfSxcInRzdW5hblwiOntcIiRcIjowfSxcInVvbnVtYVwiOntcIiRcIjowfSxcInlhaGlrb1wiOntcIiRcIjowfSxcInlvaXRhXCI6e1wiJFwiOjB9LFwieXV6YXdhXCI6e1wiJFwiOjB9fSxcIm9pdGFcIjp7XCIkXCI6MCxcImJlcHB1XCI6e1wiJFwiOjB9LFwiYnVuZ29vbm9cIjp7XCIkXCI6MH0sXCJidW5nb3Rha2FkYVwiOntcIiRcIjowfSxcImhhc2FtYVwiOntcIiRcIjowfSxcImhpamlcIjp7XCIkXCI6MH0sXCJoaW1lc2hpbWFcIjp7XCIkXCI6MH0sXCJoaXRhXCI6e1wiJFwiOjB9LFwia2FtaXRzdWVcIjp7XCIkXCI6MH0sXCJrb2tvbm9lXCI6e1wiJFwiOjB9LFwia3VqdVwiOntcIiRcIjowfSxcImt1bmlzYWtpXCI6e1wiJFwiOjB9LFwia3VzdVwiOntcIiRcIjowfSxcIm9pdGFcIjp7XCIkXCI6MH0sXCJzYWlraVwiOntcIiRcIjowfSxcInRha2V0YVwiOntcIiRcIjowfSxcInRzdWt1bWlcIjp7XCIkXCI6MH0sXCJ1c2FcIjp7XCIkXCI6MH0sXCJ1c3VraVwiOntcIiRcIjowfSxcInl1ZnVcIjp7XCIkXCI6MH19LFwib2theWFtYVwiOntcIiRcIjowLFwiYWthaXdhXCI6e1wiJFwiOjB9LFwiYXNha3VjaGlcIjp7XCIkXCI6MH0sXCJiaXplblwiOntcIiRcIjowfSxcImhheWFzaGltYVwiOntcIiRcIjowfSxcImliYXJhXCI6e1wiJFwiOjB9LFwia2FnYW1pbm9cIjp7XCIkXCI6MH0sXCJrYXNhb2thXCI6e1wiJFwiOjB9LFwia2liaWNodW9cIjp7XCIkXCI6MH0sXCJrdW1lbmFuXCI6e1wiJFwiOjB9LFwia3VyYXNoaWtpXCI6e1wiJFwiOjB9LFwibWFuaXdhXCI6e1wiJFwiOjB9LFwibWlzYWtpXCI6e1wiJFwiOjB9LFwibmFnaVwiOntcIiRcIjowfSxcIm5paW1pXCI6e1wiJFwiOjB9LFwibmlzaGlhd2FrdXJhXCI6e1wiJFwiOjB9LFwib2theWFtYVwiOntcIiRcIjowfSxcInNhdG9zaG9cIjp7XCIkXCI6MH0sXCJzZXRvdWNoaVwiOntcIiRcIjowfSxcInNoaW5qb1wiOntcIiRcIjowfSxcInNob29cIjp7XCIkXCI6MH0sXCJzb2phXCI6e1wiJFwiOjB9LFwidGFrYWhhc2hpXCI6e1wiJFwiOjB9LFwidGFtYW5vXCI6e1wiJFwiOjB9LFwidHN1eWFtYVwiOntcIiRcIjowfSxcIndha2VcIjp7XCIkXCI6MH0sXCJ5YWthZ2VcIjp7XCIkXCI6MH19LFwib2tpbmF3YVwiOntcIiRcIjowLFwiYWd1bmlcIjp7XCIkXCI6MH0sXCJnaW5vd2FuXCI6e1wiJFwiOjB9LFwiZ2lub3phXCI6e1wiJFwiOjB9LFwiZ3VzaGlrYW1pXCI6e1wiJFwiOjB9LFwiaGFlYmFydVwiOntcIiRcIjowfSxcImhpZ2FzaGlcIjp7XCIkXCI6MH0sXCJoaXJhcmFcIjp7XCIkXCI6MH0sXCJpaGV5YVwiOntcIiRcIjowfSxcImlzaGlnYWtpXCI6e1wiJFwiOjB9LFwiaXNoaWthd2FcIjp7XCIkXCI6MH0sXCJpdG9tYW5cIjp7XCIkXCI6MH0sXCJpemVuYVwiOntcIiRcIjowfSxcImthZGVuYVwiOntcIiRcIjowfSxcImtpblwiOntcIiRcIjowfSxcImtpdGFkYWl0b1wiOntcIiRcIjowfSxcImtpdGFuYWthZ3VzdWt1XCI6e1wiJFwiOjB9LFwia3VtZWppbWFcIjp7XCIkXCI6MH0sXCJrdW5pZ2FtaVwiOntcIiRcIjowfSxcIm1pbmFtaWRhaXRvXCI6e1wiJFwiOjB9LFwibW90b2J1XCI6e1wiJFwiOjB9LFwibmFnb1wiOntcIiRcIjowfSxcIm5haGFcIjp7XCIkXCI6MH0sXCJuYWthZ3VzdWt1XCI6e1wiJFwiOjB9LFwibmFraWppblwiOntcIiRcIjowfSxcIm5hbmpvXCI6e1wiJFwiOjB9LFwibmlzaGloYXJhXCI6e1wiJFwiOjB9LFwib2dpbWlcIjp7XCIkXCI6MH0sXCJva2luYXdhXCI6e1wiJFwiOjB9LFwib25uYVwiOntcIiRcIjowfSxcInNoaW1vamlcIjp7XCIkXCI6MH0sXCJ0YWtldG9taVwiOntcIiRcIjowfSxcInRhcmFtYVwiOntcIiRcIjowfSxcInRva2FzaGlraVwiOntcIiRcIjowfSxcInRvbWlndXN1a3VcIjp7XCIkXCI6MH0sXCJ0b25ha2lcIjp7XCIkXCI6MH0sXCJ1cmFzb2VcIjp7XCIkXCI6MH0sXCJ1cnVtYVwiOntcIiRcIjowfSxcInlhZXNlXCI6e1wiJFwiOjB9LFwieW9taXRhblwiOntcIiRcIjowfSxcInlvbmFiYXJ1XCI6e1wiJFwiOjB9LFwieW9uYWd1bmlcIjp7XCIkXCI6MH0sXCJ6YW1hbWlcIjp7XCIkXCI6MH19LFwib3Nha2FcIjp7XCIkXCI6MCxcImFiZW5vXCI6e1wiJFwiOjB9LFwiY2hpaGF5YWFrYXNha2FcIjp7XCIkXCI6MH0sXCJjaHVvXCI6e1wiJFwiOjB9LFwiZGFpdG9cIjp7XCIkXCI6MH0sXCJmdWppaWRlcmFcIjp7XCIkXCI6MH0sXCJoYWJpa2lub1wiOntcIiRcIjowfSxcImhhbm5hblwiOntcIiRcIjowfSxcImhpZ2FzaGlvc2FrYVwiOntcIiRcIjowfSxcImhpZ2FzaGlzdW1peW9zaGlcIjp7XCIkXCI6MH0sXCJoaWdhc2hpeW9kb2dhd2FcIjp7XCIkXCI6MH0sXCJoaXJha2F0YVwiOntcIiRcIjowfSxcImliYXJha2lcIjp7XCIkXCI6MH0sXCJpa2VkYVwiOntcIiRcIjowfSxcIml6dW1pXCI6e1wiJFwiOjB9LFwiaXp1bWlvdHN1XCI6e1wiJFwiOjB9LFwiaXp1bWlzYW5vXCI6e1wiJFwiOjB9LFwia2Fkb21hXCI6e1wiJFwiOjB9LFwia2FpenVrYVwiOntcIiRcIjowfSxcImthbmFuXCI6e1wiJFwiOjB9LFwia2FzaGl3YXJhXCI6e1wiJFwiOjB9LFwia2F0YW5vXCI6e1wiJFwiOjB9LFwia2F3YWNoaW5hZ2Fub1wiOntcIiRcIjowfSxcImtpc2hpd2FkYVwiOntcIiRcIjowfSxcImtpdGFcIjp7XCIkXCI6MH0sXCJrdW1hdG9yaVwiOntcIiRcIjowfSxcIm1hdHN1YmFyYVwiOntcIiRcIjowfSxcIm1pbmF0b1wiOntcIiRcIjowfSxcIm1pbm9oXCI6e1wiJFwiOjB9LFwibWlzYWtpXCI6e1wiJFwiOjB9LFwibW9yaWd1Y2hpXCI6e1wiJFwiOjB9LFwibmV5YWdhd2FcIjp7XCIkXCI6MH0sXCJuaXNoaVwiOntcIiRcIjowfSxcIm5vc2VcIjp7XCIkXCI6MH0sXCJvc2FrYXNheWFtYVwiOntcIiRcIjowfSxcInNha2FpXCI6e1wiJFwiOjB9LFwic2F5YW1hXCI6e1wiJFwiOjB9LFwic2VubmFuXCI6e1wiJFwiOjB9LFwic2V0dHN1XCI6e1wiJFwiOjB9LFwic2hpam9uYXdhdGVcIjp7XCIkXCI6MH0sXCJzaGltYW1vdG9cIjp7XCIkXCI6MH0sXCJzdWl0YVwiOntcIiRcIjowfSxcInRhZGFva2FcIjp7XCIkXCI6MH0sXCJ0YWlzaGlcIjp7XCIkXCI6MH0sXCJ0YWppcmlcIjp7XCIkXCI6MH0sXCJ0YWthaXNoaVwiOntcIiRcIjowfSxcInRha2F0c3VraVwiOntcIiRcIjowfSxcInRvbmRhYmF5YXNoaVwiOntcIiRcIjowfSxcInRveW9uYWthXCI6e1wiJFwiOjB9LFwidG95b25vXCI6e1wiJFwiOjB9LFwieWFvXCI6e1wiJFwiOjB9fSxcInNhZ2FcIjp7XCIkXCI6MCxcImFyaWFrZVwiOntcIiRcIjowfSxcImFyaXRhXCI6e1wiJFwiOjB9LFwiZnVrdWRvbWlcIjp7XCIkXCI6MH0sXCJnZW5rYWlcIjp7XCIkXCI6MH0sXCJoYW1hdGFtYVwiOntcIiRcIjowfSxcImhpemVuXCI6e1wiJFwiOjB9LFwiaW1hcmlcIjp7XCIkXCI6MH0sXCJrYW1pbWluZVwiOntcIiRcIjowfSxcImthbnpha2lcIjp7XCIkXCI6MH0sXCJrYXJhdHN1XCI6e1wiJFwiOjB9LFwia2FzaGltYVwiOntcIiRcIjowfSxcImtpdGFnYXRhXCI6e1wiJFwiOjB9LFwia2l0YWhhdGFcIjp7XCIkXCI6MH0sXCJraXlhbWFcIjp7XCIkXCI6MH0sXCJrb3Vob2t1XCI6e1wiJFwiOjB9LFwia3l1cmFnaVwiOntcIiRcIjowfSxcIm5pc2hpYXJpdGFcIjp7XCIkXCI6MH0sXCJvZ2lcIjp7XCIkXCI6MH0sXCJvbWFjaGlcIjp7XCIkXCI6MH0sXCJvdWNoaVwiOntcIiRcIjowfSxcInNhZ2FcIjp7XCIkXCI6MH0sXCJzaGlyb2lzaGlcIjp7XCIkXCI6MH0sXCJ0YWt1XCI6e1wiJFwiOjB9LFwidGFyYVwiOntcIiRcIjowfSxcInRvc3VcIjp7XCIkXCI6MH0sXCJ5b3NoaW5vZ2FyaVwiOntcIiRcIjowfX0sXCJzYWl0YW1hXCI6e1wiJFwiOjAsXCJhcmFrYXdhXCI6e1wiJFwiOjB9LFwiYXNha2FcIjp7XCIkXCI6MH0sXCJjaGljaGlidVwiOntcIiRcIjowfSxcImZ1amltaVwiOntcIiRcIjowfSxcImZ1amltaW5vXCI6e1wiJFwiOjB9LFwiZnVrYXlhXCI6e1wiJFwiOjB9LFwiaGFubm9cIjp7XCIkXCI6MH0sXCJoYW55dVwiOntcIiRcIjowfSxcImhhc3VkYVwiOntcIiRcIjowfSxcImhhdG9nYXlhXCI6e1wiJFwiOjB9LFwiaGF0b3lhbWFcIjp7XCIkXCI6MH0sXCJoaWRha2FcIjp7XCIkXCI6MH0sXCJoaWdhc2hpY2hpY2hpYnVcIjp7XCIkXCI6MH0sXCJoaWdhc2hpbWF0c3V5YW1hXCI6e1wiJFwiOjB9LFwiaG9uam9cIjp7XCIkXCI6MH0sXCJpbmFcIjp7XCIkXCI6MH0sXCJpcnVtYVwiOntcIiRcIjowfSxcIml3YXRzdWtpXCI6e1wiJFwiOjB9LFwia2FtaWl6dW1pXCI6e1wiJFwiOjB9LFwia2FtaWthd2FcIjp7XCIkXCI6MH0sXCJrYW1pc2F0b1wiOntcIiRcIjowfSxcImthc3VrYWJlXCI6e1wiJFwiOjB9LFwia2F3YWdvZVwiOntcIiRcIjowfSxcImthd2FndWNoaVwiOntcIiRcIjowfSxcImthd2FqaW1hXCI6e1wiJFwiOjB9LFwia2F6b1wiOntcIiRcIjowfSxcImtpdGFtb3RvXCI6e1wiJFwiOjB9LFwia29zaGlnYXlhXCI6e1wiJFwiOjB9LFwia291bm9zdVwiOntcIiRcIjowfSxcImt1a2lcIjp7XCIkXCI6MH0sXCJrdW1hZ2F5YVwiOntcIiRcIjowfSxcIm1hdHN1YnVzaGlcIjp7XCIkXCI6MH0sXCJtaW5hbm9cIjp7XCIkXCI6MH0sXCJtaXNhdG9cIjp7XCIkXCI6MH0sXCJtaXlhc2hpcm9cIjp7XCIkXCI6MH0sXCJtaXlvc2hpXCI6e1wiJFwiOjB9LFwibW9yb3lhbWFcIjp7XCIkXCI6MH0sXCJuYWdhdG9yb1wiOntcIiRcIjowfSxcIm5hbWVnYXdhXCI6e1wiJFwiOjB9LFwibmlpemFcIjp7XCIkXCI6MH0sXCJvZ2Fub1wiOntcIiRcIjowfSxcIm9nYXdhXCI6e1wiJFwiOjB9LFwib2dvc2VcIjp7XCIkXCI6MH0sXCJva2VnYXdhXCI6e1wiJFwiOjB9LFwib21peWFcIjp7XCIkXCI6MH0sXCJvdGFraVwiOntcIiRcIjowfSxcInJhbnphblwiOntcIiRcIjowfSxcInJ5b2thbWlcIjp7XCIkXCI6MH0sXCJzYWl0YW1hXCI6e1wiJFwiOjB9LFwic2FrYWRvXCI6e1wiJFwiOjB9LFwic2F0dGVcIjp7XCIkXCI6MH0sXCJzYXlhbWFcIjp7XCIkXCI6MH0sXCJzaGlraVwiOntcIiRcIjowfSxcInNoaXJhb2thXCI6e1wiJFwiOjB9LFwic29rYVwiOntcIiRcIjowfSxcInN1Z2l0b1wiOntcIiRcIjowfSxcInRvZGFcIjp7XCIkXCI6MH0sXCJ0b2tpZ2F3YVwiOntcIiRcIjowfSxcInRva29yb3phd2FcIjp7XCIkXCI6MH0sXCJ0c3VydWdhc2hpbWFcIjp7XCIkXCI6MH0sXCJ1cmF3YVwiOntcIiRcIjowfSxcIndhcmFiaVwiOntcIiRcIjowfSxcInlhc2hpb1wiOntcIiRcIjowfSxcInlva296ZVwiOntcIiRcIjowfSxcInlvbm9cIjp7XCIkXCI6MH0sXCJ5b3JpaVwiOntcIiRcIjowfSxcInlvc2hpZGFcIjp7XCIkXCI6MH0sXCJ5b3NoaWthd2FcIjp7XCIkXCI6MH0sXCJ5b3NoaW1pXCI6e1wiJFwiOjB9fSxcInNoaWdhXCI6e1wiJFwiOjAsXCJhaXNob1wiOntcIiRcIjowfSxcImdhbW9cIjp7XCIkXCI6MH0sXCJoaWdhc2hpb21pXCI6e1wiJFwiOjB9LFwiaGlrb25lXCI6e1wiJFwiOjB9LFwia29rYVwiOntcIiRcIjowfSxcImtvbmFuXCI6e1wiJFwiOjB9LFwia29zZWlcIjp7XCIkXCI6MH0sXCJrb3RvXCI6e1wiJFwiOjB9LFwia3VzYXRzdVwiOntcIiRcIjowfSxcIm1haWJhcmFcIjp7XCIkXCI6MH0sXCJtb3JpeWFtYVwiOntcIiRcIjowfSxcIm5hZ2FoYW1hXCI6e1wiJFwiOjB9LFwibmlzaGlhemFpXCI6e1wiJFwiOjB9LFwibm90b2dhd2FcIjp7XCIkXCI6MH0sXCJvbWloYWNoaW1hblwiOntcIiRcIjowfSxcIm90c3VcIjp7XCIkXCI6MH0sXCJyaXR0b1wiOntcIiRcIjowfSxcInJ5dW9oXCI6e1wiJFwiOjB9LFwidGFrYXNoaW1hXCI6e1wiJFwiOjB9LFwidGFrYXRzdWtpXCI6e1wiJFwiOjB9LFwidG9yYWhpbWVcIjp7XCIkXCI6MH0sXCJ0b3lvc2F0b1wiOntcIiRcIjowfSxcInlhc3VcIjp7XCIkXCI6MH19LFwic2hpbWFuZVwiOntcIiRcIjowLFwiYWthZ2lcIjp7XCIkXCI6MH0sXCJhbWFcIjp7XCIkXCI6MH0sXCJnb3RzdVwiOntcIiRcIjowfSxcImhhbWFkYVwiOntcIiRcIjowfSxcImhpZ2FzaGlpenVtb1wiOntcIiRcIjowfSxcImhpa2F3YVwiOntcIiRcIjowfSxcImhpa2ltaVwiOntcIiRcIjowfSxcIml6dW1vXCI6e1wiJFwiOjB9LFwia2FraW5va2lcIjp7XCIkXCI6MH0sXCJtYXN1ZGFcIjp7XCIkXCI6MH0sXCJtYXRzdWVcIjp7XCIkXCI6MH0sXCJtaXNhdG9cIjp7XCIkXCI6MH0sXCJuaXNoaW5vc2hpbWFcIjp7XCIkXCI6MH0sXCJvaGRhXCI6e1wiJFwiOjB9LFwib2tpbm9zaGltYVwiOntcIiRcIjowfSxcIm9rdWl6dW1vXCI6e1wiJFwiOjB9LFwic2hpbWFuZVwiOntcIiRcIjowfSxcInRhbWF5dVwiOntcIiRcIjowfSxcInRzdXdhbm9cIjp7XCIkXCI6MH0sXCJ1bm5hblwiOntcIiRcIjowfSxcInlha3Vtb1wiOntcIiRcIjowfSxcInlhc3VnaVwiOntcIiRcIjowfSxcInlhdHN1a2FcIjp7XCIkXCI6MH19LFwic2hpenVva2FcIjp7XCIkXCI6MCxcImFyYWlcIjp7XCIkXCI6MH0sXCJhdGFtaVwiOntcIiRcIjowfSxcImZ1amlcIjp7XCIkXCI6MH0sXCJmdWppZWRhXCI6e1wiJFwiOjB9LFwiZnVqaWthd2FcIjp7XCIkXCI6MH0sXCJmdWppbm9taXlhXCI6e1wiJFwiOjB9LFwiZnVrdXJvaVwiOntcIiRcIjowfSxcImdvdGVtYmFcIjp7XCIkXCI6MH0sXCJoYWliYXJhXCI6e1wiJFwiOjB9LFwiaGFtYW1hdHN1XCI6e1wiJFwiOjB9LFwiaGlnYXNoaWl6dVwiOntcIiRcIjowfSxcIml0b1wiOntcIiRcIjowfSxcIml3YXRhXCI6e1wiJFwiOjB9LFwiaXp1XCI6e1wiJFwiOjB9LFwiaXp1bm9rdW5pXCI6e1wiJFwiOjB9LFwia2FrZWdhd2FcIjp7XCIkXCI6MH0sXCJrYW5uYW1pXCI6e1wiJFwiOjB9LFwia2F3YW5laG9uXCI6e1wiJFwiOjB9LFwia2F3YXp1XCI6e1wiJFwiOjB9LFwia2lrdWdhd2FcIjp7XCIkXCI6MH0sXCJrb3NhaVwiOntcIiRcIjowfSxcIm1ha2lub2hhcmFcIjp7XCIkXCI6MH0sXCJtYXRzdXpha2lcIjp7XCIkXCI6MH0sXCJtaW5hbWlpenVcIjp7XCIkXCI6MH0sXCJtaXNoaW1hXCI6e1wiJFwiOjB9LFwibW9yaW1hY2hpXCI6e1wiJFwiOjB9LFwibmlzaGlpenVcIjp7XCIkXCI6MH0sXCJudW1henVcIjp7XCIkXCI6MH0sXCJvbWFlemFraVwiOntcIiRcIjowfSxcInNoaW1hZGFcIjp7XCIkXCI6MH0sXCJzaGltaXp1XCI6e1wiJFwiOjB9LFwic2hpbW9kYVwiOntcIiRcIjowfSxcInNoaXp1b2thXCI6e1wiJFwiOjB9LFwic3Vzb25vXCI6e1wiJFwiOjB9LFwieWFpenVcIjp7XCIkXCI6MH0sXCJ5b3NoaWRhXCI6e1wiJFwiOjB9fSxcInRvY2hpZ2lcIjp7XCIkXCI6MCxcImFzaGlrYWdhXCI6e1wiJFwiOjB9LFwiYmF0b1wiOntcIiRcIjowfSxcImhhZ2FcIjp7XCIkXCI6MH0sXCJpY2hpa2FpXCI6e1wiJFwiOjB9LFwiaXdhZnVuZVwiOntcIiRcIjowfSxcImthbWlub2thd2FcIjp7XCIkXCI6MH0sXCJrYW51bWFcIjp7XCIkXCI6MH0sXCJrYXJhc3V5YW1hXCI6e1wiJFwiOjB9LFwia3Vyb2lzb1wiOntcIiRcIjowfSxcIm1hc2hpa29cIjp7XCIkXCI6MH0sXCJtaWJ1XCI6e1wiJFwiOjB9LFwibW9rYVwiOntcIiRcIjowfSxcIm1vdGVnaVwiOntcIiRcIjowfSxcIm5hc3VcIjp7XCIkXCI6MH0sXCJuYXN1c2hpb2JhcmFcIjp7XCIkXCI6MH0sXCJuaWtrb1wiOntcIiRcIjowfSxcIm5pc2hpa2F0YVwiOntcIiRcIjowfSxcIm5vZ2lcIjp7XCIkXCI6MH0sXCJvaGlyYVwiOntcIiRcIjowfSxcIm9odGF3YXJhXCI6e1wiJFwiOjB9LFwib3lhbWFcIjp7XCIkXCI6MH0sXCJzYWt1cmFcIjp7XCIkXCI6MH0sXCJzYW5vXCI6e1wiJFwiOjB9LFwic2hpbW90c3VrZVwiOntcIiRcIjowfSxcInNoaW95YVwiOntcIiRcIjowfSxcInRha2FuZXphd2FcIjp7XCIkXCI6MH0sXCJ0b2NoaWdpXCI6e1wiJFwiOjB9LFwidHN1Z2FcIjp7XCIkXCI6MH0sXCJ1amlpZVwiOntcIiRcIjowfSxcInV0c3Vub21peWFcIjp7XCIkXCI6MH0sXCJ5YWl0YVwiOntcIiRcIjowfX0sXCJ0b2t1c2hpbWFcIjp7XCIkXCI6MCxcImFpenVtaVwiOntcIiRcIjowfSxcImFuYW5cIjp7XCIkXCI6MH0sXCJpY2hpYmFcIjp7XCIkXCI6MH0sXCJpdGFub1wiOntcIiRcIjowfSxcImthaW5hblwiOntcIiRcIjowfSxcImtvbWF0c3VzaGltYVwiOntcIiRcIjowfSxcIm1hdHN1c2hpZ2VcIjp7XCIkXCI6MH0sXCJtaW1hXCI6e1wiJFwiOjB9LFwibWluYW1pXCI6e1wiJFwiOjB9LFwibWl5b3NoaVwiOntcIiRcIjowfSxcIm11Z2lcIjp7XCIkXCI6MH0sXCJuYWthZ2F3YVwiOntcIiRcIjowfSxcIm5hcnV0b1wiOntcIiRcIjowfSxcInNhbmFnb2NoaVwiOntcIiRcIjowfSxcInNoaXNoaWt1aVwiOntcIiRcIjowfSxcInRva3VzaGltYVwiOntcIiRcIjowfSxcIndhamlraVwiOntcIiRcIjowfX0sXCJ0b2t5b1wiOntcIiRcIjowLFwiYWRhY2hpXCI6e1wiJFwiOjB9LFwiYWtpcnVub1wiOntcIiRcIjowfSxcImFraXNoaW1hXCI6e1wiJFwiOjB9LFwiYW9nYXNoaW1hXCI6e1wiJFwiOjB9LFwiYXJha2F3YVwiOntcIiRcIjowfSxcImJ1bmt5b1wiOntcIiRcIjowfSxcImNoaXlvZGFcIjp7XCIkXCI6MH0sXCJjaG9mdVwiOntcIiRcIjowfSxcImNodW9cIjp7XCIkXCI6MH0sXCJlZG9nYXdhXCI6e1wiJFwiOjB9LFwiZnVjaHVcIjp7XCIkXCI6MH0sXCJmdXNzYVwiOntcIiRcIjowfSxcImhhY2hpam9cIjp7XCIkXCI6MH0sXCJoYWNoaW9qaVwiOntcIiRcIjowfSxcImhhbXVyYVwiOntcIiRcIjowfSxcImhpZ2FzaGlrdXJ1bWVcIjp7XCIkXCI6MH0sXCJoaWdhc2hpbXVyYXlhbWFcIjp7XCIkXCI6MH0sXCJoaWdhc2hpeWFtYXRvXCI6e1wiJFwiOjB9LFwiaGlub1wiOntcIiRcIjowfSxcImhpbm9kZVwiOntcIiRcIjowfSxcImhpbm9oYXJhXCI6e1wiJFwiOjB9LFwiaW5hZ2lcIjp7XCIkXCI6MH0sXCJpdGFiYXNoaVwiOntcIiRcIjowfSxcImthdHN1c2hpa2FcIjp7XCIkXCI6MH0sXCJraXRhXCI6e1wiJFwiOjB9LFwia2l5b3NlXCI6e1wiJFwiOjB9LFwia29kYWlyYVwiOntcIiRcIjowfSxcImtvZ2FuZWlcIjp7XCIkXCI6MH0sXCJrb2t1YnVuamlcIjp7XCIkXCI6MH0sXCJrb21hZVwiOntcIiRcIjowfSxcImtvdG9cIjp7XCIkXCI6MH0sXCJrb3V6dXNoaW1hXCI6e1wiJFwiOjB9LFwia3VuaXRhY2hpXCI6e1wiJFwiOjB9LFwibWFjaGlkYVwiOntcIiRcIjowfSxcIm1lZ3Vyb1wiOntcIiRcIjowfSxcIm1pbmF0b1wiOntcIiRcIjowfSxcIm1pdGFrYVwiOntcIiRcIjowfSxcIm1penVob1wiOntcIiRcIjowfSxcIm11c2FzaGltdXJheWFtYVwiOntcIiRcIjowfSxcIm11c2FzaGlub1wiOntcIiRcIjowfSxcIm5ha2Fub1wiOntcIiRcIjowfSxcIm5lcmltYVwiOntcIiRcIjowfSxcIm9nYXNhd2FyYVwiOntcIiRcIjowfSxcIm9rdXRhbWFcIjp7XCIkXCI6MH0sXCJvbWVcIjp7XCIkXCI6MH0sXCJvc2hpbWFcIjp7XCIkXCI6MH0sXCJvdGFcIjp7XCIkXCI6MH0sXCJzZXRhZ2F5YVwiOntcIiRcIjowfSxcInNoaWJ1eWFcIjp7XCIkXCI6MH0sXCJzaGluYWdhd2FcIjp7XCIkXCI6MH0sXCJzaGluanVrdVwiOntcIiRcIjowfSxcInN1Z2luYW1pXCI6e1wiJFwiOjB9LFwic3VtaWRhXCI6e1wiJFwiOjB9LFwidGFjaGlrYXdhXCI6e1wiJFwiOjB9LFwidGFpdG9cIjp7XCIkXCI6MH0sXCJ0YW1hXCI6e1wiJFwiOjB9LFwidG9zaGltYVwiOntcIiRcIjowfX0sXCJ0b3R0b3JpXCI6e1wiJFwiOjAsXCJjaGl6dVwiOntcIiRcIjowfSxcImhpbm9cIjp7XCIkXCI6MH0sXCJrYXdhaGFyYVwiOntcIiRcIjowfSxcImtvZ2VcIjp7XCIkXCI6MH0sXCJrb3RvdXJhXCI6e1wiJFwiOjB9LFwibWlzYXNhXCI6e1wiJFwiOjB9LFwibmFuYnVcIjp7XCIkXCI6MH0sXCJuaWNoaW5hblwiOntcIiRcIjowfSxcInNha2FpbWluYXRvXCI6e1wiJFwiOjB9LFwidG90dG9yaVwiOntcIiRcIjowfSxcIndha2FzYVwiOntcIiRcIjowfSxcInlhenVcIjp7XCIkXCI6MH0sXCJ5b25hZ29cIjp7XCIkXCI6MH19LFwidG95YW1hXCI6e1wiJFwiOjAsXCJhc2FoaVwiOntcIiRcIjowfSxcImZ1Y2h1XCI6e1wiJFwiOjB9LFwiZnVrdW1pdHN1XCI6e1wiJFwiOjB9LFwiZnVuYWhhc2hpXCI6e1wiJFwiOjB9LFwiaGltaVwiOntcIiRcIjowfSxcImltaXp1XCI6e1wiJFwiOjB9LFwiaW5hbWlcIjp7XCIkXCI6MH0sXCJqb2hhbmFcIjp7XCIkXCI6MH0sXCJrYW1paWNoaVwiOntcIiRcIjowfSxcImt1cm9iZVwiOntcIiRcIjowfSxcIm5ha2FuaWlrYXdhXCI6e1wiJFwiOjB9LFwibmFtZXJpa2F3YVwiOntcIiRcIjowfSxcIm5hbnRvXCI6e1wiJFwiOjB9LFwibnl1emVuXCI6e1wiJFwiOjB9LFwib3lhYmVcIjp7XCIkXCI6MH0sXCJ0YWlyYVwiOntcIiRcIjowfSxcInRha2Fva2FcIjp7XCIkXCI6MH0sXCJ0YXRleWFtYVwiOntcIiRcIjowfSxcInRvZ2FcIjp7XCIkXCI6MH0sXCJ0b25hbWlcIjp7XCIkXCI6MH0sXCJ0b3lhbWFcIjp7XCIkXCI6MH0sXCJ1bmF6dWtpXCI6e1wiJFwiOjB9LFwidW96dVwiOntcIiRcIjowfSxcInlhbWFkYVwiOntcIiRcIjowfX0sXCJ3YWtheWFtYVwiOntcIiRcIjowLFwiYXJpZGFcIjp7XCIkXCI6MH0sXCJhcmlkYWdhd2FcIjp7XCIkXCI6MH0sXCJnb2JvXCI6e1wiJFwiOjB9LFwiaGFzaGltb3RvXCI6e1wiJFwiOjB9LFwiaGlkYWthXCI6e1wiJFwiOjB9LFwiaGlyb2dhd2FcIjp7XCIkXCI6MH0sXCJpbmFtaVwiOntcIiRcIjowfSxcIml3YWRlXCI6e1wiJFwiOjB9LFwia2FpbmFuXCI6e1wiJFwiOjB9LFwia2FtaXRvbmRhXCI6e1wiJFwiOjB9LFwia2F0c3VyYWdpXCI6e1wiJFwiOjB9LFwia2ltaW5vXCI6e1wiJFwiOjB9LFwia2lub2thd2FcIjp7XCIkXCI6MH0sXCJraXRheWFtYVwiOntcIiRcIjowfSxcImtveWFcIjp7XCIkXCI6MH0sXCJrb3phXCI6e1wiJFwiOjB9LFwia296YWdhd2FcIjp7XCIkXCI6MH0sXCJrdWRveWFtYVwiOntcIiRcIjowfSxcImt1c2hpbW90b1wiOntcIiRcIjowfSxcIm1paGFtYVwiOntcIiRcIjowfSxcIm1pc2F0b1wiOntcIiRcIjowfSxcIm5hY2hpa2F0c3V1cmFcIjp7XCIkXCI6MH0sXCJzaGluZ3VcIjp7XCIkXCI6MH0sXCJzaGlyYWhhbWFcIjp7XCIkXCI6MH0sXCJ0YWlqaVwiOntcIiRcIjowfSxcInRhbmFiZVwiOntcIiRcIjowfSxcIndha2F5YW1hXCI6e1wiJFwiOjB9LFwieXVhc2FcIjp7XCIkXCI6MH0sXCJ5dXJhXCI6e1wiJFwiOjB9fSxcInlhbWFnYXRhXCI6e1wiJFwiOjAsXCJhc2FoaVwiOntcIiRcIjowfSxcImZ1bmFnYXRhXCI6e1wiJFwiOjB9LFwiaGlnYXNoaW5lXCI6e1wiJFwiOjB9LFwiaWlkZVwiOntcIiRcIjowfSxcImthaG9rdVwiOntcIiRcIjowfSxcImthbWlub3lhbWFcIjp7XCIkXCI6MH0sXCJrYW5leWFtYVwiOntcIiRcIjowfSxcImthd2FuaXNoaVwiOntcIiRcIjowfSxcIm1hbXVyb2dhd2FcIjp7XCIkXCI6MH0sXCJtaWthd2FcIjp7XCIkXCI6MH0sXCJtdXJheWFtYVwiOntcIiRcIjowfSxcIm5hZ2FpXCI6e1wiJFwiOjB9LFwibmFrYXlhbWFcIjp7XCIkXCI6MH0sXCJuYW55b1wiOntcIiRcIjowfSxcIm5pc2hpa2F3YVwiOntcIiRcIjowfSxcIm9iYW5hemF3YVwiOntcIiRcIjowfSxcIm9lXCI6e1wiJFwiOjB9LFwib2d1bmlcIjp7XCIkXCI6MH0sXCJvaGt1cmFcIjp7XCIkXCI6MH0sXCJvaXNoaWRhXCI6e1wiJFwiOjB9LFwic2FnYWVcIjp7XCIkXCI6MH0sXCJzYWthdGFcIjp7XCIkXCI6MH0sXCJzYWtlZ2F3YVwiOntcIiRcIjowfSxcInNoaW5qb1wiOntcIiRcIjowfSxcInNoaXJhdGFrYVwiOntcIiRcIjowfSxcInNob25haVwiOntcIiRcIjowfSxcInRha2FoYXRhXCI6e1wiJFwiOjB9LFwidGVuZG9cIjp7XCIkXCI6MH0sXCJ0b3phd2FcIjp7XCIkXCI6MH0sXCJ0c3VydW9rYVwiOntcIiRcIjowfSxcInlhbWFnYXRhXCI6e1wiJFwiOjB9LFwieWFtYW5vYmVcIjp7XCIkXCI6MH0sXCJ5b25lemF3YVwiOntcIiRcIjowfSxcInl1emFcIjp7XCIkXCI6MH19LFwieWFtYWd1Y2hpXCI6e1wiJFwiOjAsXCJhYnVcIjp7XCIkXCI6MH0sXCJoYWdpXCI6e1wiJFwiOjB9LFwiaGlrYXJpXCI6e1wiJFwiOjB9LFwiaG9mdVwiOntcIiRcIjowfSxcIml3YWt1bmlcIjp7XCIkXCI6MH0sXCJrdWRhbWF0c3VcIjp7XCIkXCI6MH0sXCJtaXRvdVwiOntcIiRcIjowfSxcIm5hZ2F0b1wiOntcIiRcIjowfSxcIm9zaGltYVwiOntcIiRcIjowfSxcInNoaW1vbm9zZWtpXCI6e1wiJFwiOjB9LFwic2h1bmFuXCI6e1wiJFwiOjB9LFwidGFidXNlXCI6e1wiJFwiOjB9LFwidG9rdXlhbWFcIjp7XCIkXCI6MH0sXCJ0b3lvdGFcIjp7XCIkXCI6MH0sXCJ1YmVcIjp7XCIkXCI6MH0sXCJ5dXVcIjp7XCIkXCI6MH19LFwieWFtYW5hc2hpXCI6e1wiJFwiOjAsXCJjaHVvXCI6e1wiJFwiOjB9LFwiZG9zaGlcIjp7XCIkXCI6MH0sXCJmdWVmdWtpXCI6e1wiJFwiOjB9LFwiZnVqaWthd2FcIjp7XCIkXCI6MH0sXCJmdWppa2F3YWd1Y2hpa29cIjp7XCIkXCI6MH0sXCJmdWppeW9zaGlkYVwiOntcIiRcIjowfSxcImhheWFrYXdhXCI6e1wiJFwiOjB9LFwiaG9rdXRvXCI6e1wiJFwiOjB9LFwiaWNoaWthd2FtaXNhdG9cIjp7XCIkXCI6MH0sXCJrYWlcIjp7XCIkXCI6MH0sXCJrb2Z1XCI6e1wiJFwiOjB9LFwia29zaHVcIjp7XCIkXCI6MH0sXCJrb3N1Z2VcIjp7XCIkXCI6MH0sXCJtaW5hbWktYWxwc1wiOntcIiRcIjowfSxcIm1pbm9idVwiOntcIiRcIjowfSxcIm5ha2FtaWNoaVwiOntcIiRcIjowfSxcIm5hbmJ1XCI6e1wiJFwiOjB9LFwibmFydXNhd2FcIjp7XCIkXCI6MH0sXCJuaXJhc2FraVwiOntcIiRcIjowfSxcIm5pc2hpa2F0c3VyYVwiOntcIiRcIjowfSxcIm9zaGlub1wiOntcIiRcIjowfSxcIm90c3VraVwiOntcIiRcIjowfSxcInNob3dhXCI6e1wiJFwiOjB9LFwidGFiYXlhbWFcIjp7XCIkXCI6MH0sXCJ0c3VydVwiOntcIiRcIjowfSxcInVlbm9oYXJhXCI6e1wiJFwiOjB9LFwieWFtYW5ha2Frb1wiOntcIiRcIjowfSxcInlhbWFuYXNoaVwiOntcIiRcIjowfX0sXCJ4bi0tNHB2eHNcIjp7XCIkXCI6MH0sXCJ4bi0tdmd1NDAyY1wiOntcIiRcIjowfSxcInhuLS1jM3MxNG1cIjp7XCIkXCI6MH0sXCJ4bi0tZjZxeDUzYVwiOntcIiRcIjowfSxcInhuLS04cHZyNHVcIjp7XCIkXCI6MH0sXCJ4bi0tdWlzdDIyaFwiOntcIiRcIjowfSxcInhuLS1kanJzNzJkNnV5XCI6e1wiJFwiOjB9LFwieG4tLW1rcnU0NWlcIjp7XCIkXCI6MH0sXCJ4bi0tMHRycTdwN25uXCI6e1wiJFwiOjB9LFwieG4tLThsdHI2MmtcIjp7XCIkXCI6MH0sXCJ4bi0tMm00YTE1ZVwiOntcIiRcIjowfSxcInhuLS1lZnZuOXNcIjp7XCIkXCI6MH0sXCJ4bi0tMzJ2cDMwaFwiOntcIiRcIjowfSxcInhuLS00aXQ3OTdrXCI6e1wiJFwiOjB9LFwieG4tLTFscXM3MWRcIjp7XCIkXCI6MH0sXCJ4bi0tNXJ0cDQ5Y1wiOntcIiRcIjowfSxcInhuLS01anMwNDVkXCI6e1wiJFwiOjB9LFwieG4tLWVocXo1Nm5cIjp7XCIkXCI6MH0sXCJ4bi0tMWxxczAzblwiOntcIiRcIjowfSxcInhuLS1xcXF0MTFtXCI6e1wiJFwiOjB9LFwieG4tLWticnE3b1wiOntcIiRcIjowfSxcInhuLS1wc3N1MzNsXCI6e1wiJFwiOjB9LFwieG4tLW50c3ExN2dcIjp7XCIkXCI6MH0sXCJ4bi0tdWlzejNnXCI6e1wiJFwiOjB9LFwieG4tLTZidHc1YVwiOntcIiRcIjowfSxcInhuLS0xY3R3b1wiOntcIiRcIjowfSxcInhuLS02b3J4MnJcIjp7XCIkXCI6MH0sXCJ4bi0tcmh0NjFlXCI6e1wiJFwiOjB9LFwieG4tLXJodDI3elwiOntcIiRcIjowfSxcInhuLS1kanR5NGtcIjp7XCIkXCI6MH0sXCJ4bi0tbml0MjI1a1wiOntcIiRcIjowfSxcInhuLS1yaHQzZFwiOntcIiRcIjowfSxcInhuLS1rbHR5NXhcIjp7XCIkXCI6MH0sXCJ4bi0ta2x0eDlhXCI6e1wiJFwiOjB9LFwieG4tLWtsdHA3ZFwiOntcIiRcIjowfSxcInhuLS11dXd1NThhXCI6e1wiJFwiOjB9LFwieG4tLXpieDAyNWRcIjp7XCIkXCI6MH0sXCJ4bi0tbnRzbzBpcXgzYVwiOntcIiRcIjowfSxcInhuLS1lbHFxMTZoXCI6e1wiJFwiOjB9LFwieG4tLTRpdDE2OGRcIjp7XCIkXCI6MH0sXCJ4bi0ta2x0Nzg3ZFwiOntcIiRcIjowfSxcInhuLS1ybnkzMWhcIjp7XCIkXCI6MH0sXCJ4bi0tN3QwYTI2NGNcIjp7XCIkXCI6MH0sXCJ4bi0tNXJ0cTM0a1wiOntcIiRcIjowfSxcInhuLS1rN3luOTVlXCI6e1wiJFwiOjB9LFwieG4tLXRvcjEzMW9cIjp7XCIkXCI6MH0sXCJ4bi0tZDVxdjd6ODc2Y1wiOntcIiRcIjowfSxcImthd2FzYWtpXCI6e1wiKlwiOntcIiRcIjowfX0sXCJraXRha3l1c2h1XCI6e1wiKlwiOntcIiRcIjowfX0sXCJrb2JlXCI6e1wiKlwiOntcIiRcIjowfX0sXCJuYWdveWFcIjp7XCIqXCI6e1wiJFwiOjB9fSxcInNhcHBvcm9cIjp7XCIqXCI6e1wiJFwiOjB9fSxcInNlbmRhaVwiOntcIipcIjp7XCIkXCI6MH19LFwieW9rb2hhbWFcIjp7XCIqXCI6e1wiJFwiOjB9fSxcImJsb2dzcG90XCI6e1wiJFwiOjB9fSxcImtlXCI6e1wiKlwiOntcIiRcIjowfSxcImNvXCI6e1wiYmxvZ3Nwb3RcIjp7XCIkXCI6MH19fSxcImtnXCI6e1wiJFwiOjAsXCJvcmdcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJjb21cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH19LFwia2hcIjp7XCIqXCI6e1wiJFwiOjB9fSxcImtpXCI6e1wiJFwiOjAsXCJlZHVcIjp7XCIkXCI6MH0sXCJiaXpcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJpbmZvXCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9fSxcImttXCI6e1wiJFwiOjAsXCJvcmdcIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJwcmRcIjp7XCIkXCI6MH0sXCJ0bVwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcIm1pbFwiOntcIiRcIjowfSxcImFzc1wiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcImNvb3BcIjp7XCIkXCI6MH0sXCJhc3NvXCI6e1wiJFwiOjB9LFwicHJlc3NlXCI6e1wiJFwiOjB9LFwibWVkZWNpblwiOntcIiRcIjowfSxcIm5vdGFpcmVzXCI6e1wiJFwiOjB9LFwicGhhcm1hY2llbnNcIjp7XCIkXCI6MH0sXCJ2ZXRlcmluYWlyZVwiOntcIiRcIjowfSxcImdvdXZcIjp7XCIkXCI6MH19LFwia25cIjp7XCIkXCI6MCxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfX0sXCJrcFwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwicmVwXCI6e1wiJFwiOjB9LFwidHJhXCI6e1wiJFwiOjB9fSxcImtyXCI6e1wiJFwiOjAsXCJhY1wiOntcIiRcIjowfSxcImNvXCI6e1wiJFwiOjB9LFwiZXNcIjp7XCIkXCI6MH0sXCJnb1wiOntcIiRcIjowfSxcImhzXCI6e1wiJFwiOjB9LFwia2dcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJtc1wiOntcIiRcIjowfSxcIm5lXCI6e1wiJFwiOjB9LFwib3JcIjp7XCIkXCI6MH0sXCJwZVwiOntcIiRcIjowfSxcInJlXCI6e1wiJFwiOjB9LFwic2NcIjp7XCIkXCI6MH0sXCJidXNhblwiOntcIiRcIjowfSxcImNodW5nYnVrXCI6e1wiJFwiOjB9LFwiY2h1bmduYW1cIjp7XCIkXCI6MH0sXCJkYWVndVwiOntcIiRcIjowfSxcImRhZWplb25cIjp7XCIkXCI6MH0sXCJnYW5nd29uXCI6e1wiJFwiOjB9LFwiZ3dhbmdqdVwiOntcIiRcIjowfSxcImd5ZW9uZ2J1a1wiOntcIiRcIjowfSxcImd5ZW9uZ2dpXCI6e1wiJFwiOjB9LFwiZ3llb25nbmFtXCI6e1wiJFwiOjB9LFwiaW5jaGVvblwiOntcIiRcIjowfSxcImplanVcIjp7XCIkXCI6MH0sXCJqZW9uYnVrXCI6e1wiJFwiOjB9LFwiamVvbm5hbVwiOntcIiRcIjowfSxcInNlb3VsXCI6e1wiJFwiOjB9LFwidWxzYW5cIjp7XCIkXCI6MH0sXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJrd1wiOntcIipcIjp7XCIkXCI6MH19LFwia3lcIjp7XCIkXCI6MCxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfX0sXCJrelwiOntcIiRcIjowLFwib3JnXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9LFwibnltXCI6e1wiJFwiOjB9fSxcImxhXCI6e1wiJFwiOjAsXCJpbnRcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJpbmZvXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwicGVyXCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiYm5yXCI6e1wiJFwiOjB9LFwiY1wiOntcIiRcIjowfSxcIm55bVwiOntcIiRcIjowfX0sXCJsYlwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9fSxcImxjXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJjb1wiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIm95XCI6e1wiJFwiOjB9fSxcImxpXCI6e1wiJFwiOjAsXCJibG9nc3BvdFwiOntcIiRcIjowfSxcIm5vbVwiOntcIiRcIjowfSxcIm55bVwiOntcIiRcIjowfX0sXCJsa1wiOntcIiRcIjowLFwiZ292XCI6e1wiJFwiOjB9LFwic2NoXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwiaW50XCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwibmdvXCI6e1wiJFwiOjB9LFwic29jXCI6e1wiJFwiOjB9LFwid2ViXCI6e1wiJFwiOjB9LFwibHRkXCI6e1wiJFwiOjB9LFwiYXNzblwiOntcIiRcIjowfSxcImdycFwiOntcIiRcIjowfSxcImhvdGVsXCI6e1wiJFwiOjB9LFwiYWNcIjp7XCIkXCI6MH19LFwibHJcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfX0sXCJsc1wiOntcIiRcIjowLFwiY29cIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH19LFwibHRcIjp7XCIkXCI6MCxcImdvdlwiOntcIiRcIjowfSxcImJsb2dzcG90XCI6e1wiJFwiOjB9LFwibnltXCI6e1wiJFwiOjB9fSxcImx1XCI6e1wiJFwiOjAsXCJibG9nc3BvdFwiOntcIiRcIjowfSxcIm55bVwiOntcIiRcIjowfX0sXCJsdlwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwiaWRcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJhc25cIjp7XCIkXCI6MH0sXCJjb25mXCI6e1wiJFwiOjB9fSxcImx5XCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJwbGNcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJzY2hcIjp7XCIkXCI6MH0sXCJtZWRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJpZFwiOntcIiRcIjowfX0sXCJtYVwiOntcIiRcIjowLFwiY29cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJhY1wiOntcIiRcIjowfSxcInByZXNzXCI6e1wiJFwiOjB9fSxcIm1jXCI6e1wiJFwiOjAsXCJ0bVwiOntcIiRcIjowfSxcImFzc29cIjp7XCIkXCI6MH19LFwibWRcIjp7XCIkXCI6MCxcImJsb2dzcG90XCI6e1wiJFwiOjB9fSxcIm1lXCI6e1wiJFwiOjAsXCJjb1wiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImFjXCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwiaXRzXCI6e1wiJFwiOjB9LFwicHJpdlwiOntcIiRcIjowfSxcImM2NlwiOntcIiRcIjowfSxcImRhcGxpZVwiOntcIiRcIjowLFwibG9jYWxob3N0XCI6e1wiJFwiOjB9fSxcImZpbGVnZWFyXCI6e1wiJFwiOjB9LFwiYnJhc2lsaWFcIjp7XCIkXCI6MH0sXCJkZG5zXCI6e1wiJFwiOjB9LFwiZG5zZm9yXCI6e1wiJFwiOjB9LFwiaG9wdG9cIjp7XCIkXCI6MH0sXCJsb2dpbnRvXCI6e1wiJFwiOjB9LFwibm9pcFwiOntcIiRcIjowfSxcIndlYmhvcFwiOntcIiRcIjowfSxcIm55bVwiOntcIiRcIjowfSxcImRpc2tzdGF0aW9uXCI6e1wiJFwiOjB9LFwiZHNjbG91ZFwiOntcIiRcIjowfSxcImkyMzRcIjp7XCIkXCI6MH0sXCJteWRzXCI6e1wiJFwiOjB9LFwic3lub2xvZ3lcIjp7XCIkXCI6MH0sXCJ3ZWRlcGxveVwiOntcIiRcIjowfSxcInlvbWJvXCI6e1wiJFwiOjB9fSxcIm1nXCI6e1wiJFwiOjAsXCJvcmdcIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJwcmRcIjp7XCIkXCI6MH0sXCJ0bVwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcIm1pbFwiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcImNvXCI6e1wiJFwiOjB9fSxcIm1oXCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwibWtcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcImluZlwiOntcIiRcIjowfSxcIm5hbWVcIjp7XCIkXCI6MH0sXCJibG9nc3BvdFwiOntcIiRcIjowfSxcIm5vbVwiOntcIiRcIjowfX0sXCJtbFwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ291dlwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcInByZXNzZVwiOntcIiRcIjowfX0sXCJtbVwiOntcIipcIjp7XCIkXCI6MH19LFwibW5cIjp7XCIkXCI6MCxcImdvdlwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIm55Y1wiOntcIiRcIjowfX0sXCJtb1wiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9fSxcIm1vYmlcIjp7XCIkXCI6MCxcImRzY2xvdWRcIjp7XCIkXCI6MH19LFwibXBcIjp7XCIkXCI6MH0sXCJtcVwiOntcIiRcIjowfSxcIm1yXCI6e1wiJFwiOjAsXCJnb3ZcIjp7XCIkXCI6MH0sXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJtc1wiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9fSxcIm10XCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MCxcImJsb2dzcG90XCI6e1wiJFwiOjB9fSxcImVkdVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfX0sXCJtdVwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwiYWNcIjp7XCIkXCI6MH0sXCJjb1wiOntcIiRcIjowfSxcIm9yXCI6e1wiJFwiOjB9fSxcIm11c2V1bVwiOntcIiRcIjowLFwiYWNhZGVteVwiOntcIiRcIjowfSxcImFncmljdWx0dXJlXCI6e1wiJFwiOjB9LFwiYWlyXCI6e1wiJFwiOjB9LFwiYWlyZ3VhcmRcIjp7XCIkXCI6MH0sXCJhbGFiYW1hXCI6e1wiJFwiOjB9LFwiYWxhc2thXCI6e1wiJFwiOjB9LFwiYW1iZXJcIjp7XCIkXCI6MH0sXCJhbWJ1bGFuY2VcIjp7XCIkXCI6MH0sXCJhbWVyaWNhblwiOntcIiRcIjowfSxcImFtZXJpY2FuYVwiOntcIiRcIjowfSxcImFtZXJpY2FuYW50aXF1ZXNcIjp7XCIkXCI6MH0sXCJhbWVyaWNhbmFydFwiOntcIiRcIjowfSxcImFtc3RlcmRhbVwiOntcIiRcIjowfSxcImFuZFwiOntcIiRcIjowfSxcImFubmVmcmFua1wiOntcIiRcIjowfSxcImFudGhyb1wiOntcIiRcIjowfSxcImFudGhyb3BvbG9neVwiOntcIiRcIjowfSxcImFudGlxdWVzXCI6e1wiJFwiOjB9LFwiYXF1YXJpdW1cIjp7XCIkXCI6MH0sXCJhcmJvcmV0dW1cIjp7XCIkXCI6MH0sXCJhcmNoYWVvbG9naWNhbFwiOntcIiRcIjowfSxcImFyY2hhZW9sb2d5XCI6e1wiJFwiOjB9LFwiYXJjaGl0ZWN0dXJlXCI6e1wiJFwiOjB9LFwiYXJ0XCI6e1wiJFwiOjB9LFwiYXJ0YW5kZGVzaWduXCI6e1wiJFwiOjB9LFwiYXJ0Y2VudGVyXCI6e1wiJFwiOjB9LFwiYXJ0ZGVjb1wiOntcIiRcIjowfSxcImFydGVkdWNhdGlvblwiOntcIiRcIjowfSxcImFydGdhbGxlcnlcIjp7XCIkXCI6MH0sXCJhcnRzXCI6e1wiJFwiOjB9LFwiYXJ0c2FuZGNyYWZ0c1wiOntcIiRcIjowfSxcImFzbWF0YXJ0XCI6e1wiJFwiOjB9LFwiYXNzYXNzaW5hdGlvblwiOntcIiRcIjowfSxcImFzc2lzaVwiOntcIiRcIjowfSxcImFzc29jaWF0aW9uXCI6e1wiJFwiOjB9LFwiYXN0cm9ub215XCI6e1wiJFwiOjB9LFwiYXRsYW50YVwiOntcIiRcIjowfSxcImF1c3RpblwiOntcIiRcIjowfSxcImF1c3RyYWxpYVwiOntcIiRcIjowfSxcImF1dG9tb3RpdmVcIjp7XCIkXCI6MH0sXCJhdmlhdGlvblwiOntcIiRcIjowfSxcImF4aXNcIjp7XCIkXCI6MH0sXCJiYWRham96XCI6e1wiJFwiOjB9LFwiYmFnaGRhZFwiOntcIiRcIjowfSxcImJhaG5cIjp7XCIkXCI6MH0sXCJiYWxlXCI6e1wiJFwiOjB9LFwiYmFsdGltb3JlXCI6e1wiJFwiOjB9LFwiYmFyY2Vsb25hXCI6e1wiJFwiOjB9LFwiYmFzZWJhbGxcIjp7XCIkXCI6MH0sXCJiYXNlbFwiOntcIiRcIjowfSxcImJhdGhzXCI6e1wiJFwiOjB9LFwiYmF1ZXJuXCI6e1wiJFwiOjB9LFwiYmVhdXhhcnRzXCI6e1wiJFwiOjB9LFwiYmVlbGRlbmdlbHVpZFwiOntcIiRcIjowfSxcImJlbGxldnVlXCI6e1wiJFwiOjB9LFwiYmVyZ2JhdVwiOntcIiRcIjowfSxcImJlcmtlbGV5XCI6e1wiJFwiOjB9LFwiYmVybGluXCI6e1wiJFwiOjB9LFwiYmVyblwiOntcIiRcIjowfSxcImJpYmxlXCI6e1wiJFwiOjB9LFwiYmlsYmFvXCI6e1wiJFwiOjB9LFwiYmlsbFwiOntcIiRcIjowfSxcImJpcmRhcnRcIjp7XCIkXCI6MH0sXCJiaXJ0aHBsYWNlXCI6e1wiJFwiOjB9LFwiYm9ublwiOntcIiRcIjowfSxcImJvc3RvblwiOntcIiRcIjowfSxcImJvdGFuaWNhbFwiOntcIiRcIjowfSxcImJvdGFuaWNhbGdhcmRlblwiOntcIiRcIjowfSxcImJvdGFuaWNnYXJkZW5cIjp7XCIkXCI6MH0sXCJib3RhbnlcIjp7XCIkXCI6MH0sXCJicmFuZHl3aW5ldmFsbGV5XCI6e1wiJFwiOjB9LFwiYnJhc2lsXCI6e1wiJFwiOjB9LFwiYnJpc3RvbFwiOntcIiRcIjowfSxcImJyaXRpc2hcIjp7XCIkXCI6MH0sXCJicml0aXNoY29sdW1iaWFcIjp7XCIkXCI6MH0sXCJicm9hZGNhc3RcIjp7XCIkXCI6MH0sXCJicnVuZWxcIjp7XCIkXCI6MH0sXCJicnVzc2VsXCI6e1wiJFwiOjB9LFwiYnJ1c3NlbHNcIjp7XCIkXCI6MH0sXCJicnV4ZWxsZXNcIjp7XCIkXCI6MH0sXCJidWlsZGluZ1wiOntcIiRcIjowfSxcImJ1cmdob2ZcIjp7XCIkXCI6MH0sXCJidXNcIjp7XCIkXCI6MH0sXCJidXNoZXlcIjp7XCIkXCI6MH0sXCJjYWRhcXVlc1wiOntcIiRcIjowfSxcImNhbGlmb3JuaWFcIjp7XCIkXCI6MH0sXCJjYW1icmlkZ2VcIjp7XCIkXCI6MH0sXCJjYW5cIjp7XCIkXCI6MH0sXCJjYW5hZGFcIjp7XCIkXCI6MH0sXCJjYXBlYnJldG9uXCI6e1wiJFwiOjB9LFwiY2FycmllclwiOntcIiRcIjowfSxcImNhcnRvb25hcnRcIjp7XCIkXCI6MH0sXCJjYXNhZGVsYW1vbmVkYVwiOntcIiRcIjowfSxcImNhc3RsZVwiOntcIiRcIjowfSxcImNhc3RyZXNcIjp7XCIkXCI6MH0sXCJjZWx0aWNcIjp7XCIkXCI6MH0sXCJjZW50ZXJcIjp7XCIkXCI6MH0sXCJjaGF0dGFub29nYVwiOntcIiRcIjowfSxcImNoZWx0ZW5oYW1cIjp7XCIkXCI6MH0sXCJjaGVzYXBlYWtlYmF5XCI6e1wiJFwiOjB9LFwiY2hpY2Fnb1wiOntcIiRcIjowfSxcImNoaWxkcmVuXCI6e1wiJFwiOjB9LFwiY2hpbGRyZW5zXCI6e1wiJFwiOjB9LFwiY2hpbGRyZW5zZ2FyZGVuXCI6e1wiJFwiOjB9LFwiY2hpcm9wcmFjdGljXCI6e1wiJFwiOjB9LFwiY2hvY29sYXRlXCI6e1wiJFwiOjB9LFwiY2hyaXN0aWFuc2J1cmdcIjp7XCIkXCI6MH0sXCJjaW5jaW5uYXRpXCI6e1wiJFwiOjB9LFwiY2luZW1hXCI6e1wiJFwiOjB9LFwiY2lyY3VzXCI6e1wiJFwiOjB9LFwiY2l2aWxpc2F0aW9uXCI6e1wiJFwiOjB9LFwiY2l2aWxpemF0aW9uXCI6e1wiJFwiOjB9LFwiY2l2aWx3YXJcIjp7XCIkXCI6MH0sXCJjbGludG9uXCI6e1wiJFwiOjB9LFwiY2xvY2tcIjp7XCIkXCI6MH0sXCJjb2FsXCI6e1wiJFwiOjB9LFwiY29hc3RhbGRlZmVuY2VcIjp7XCIkXCI6MH0sXCJjb2R5XCI6e1wiJFwiOjB9LFwiY29sZHdhclwiOntcIiRcIjowfSxcImNvbGxlY3Rpb25cIjp7XCIkXCI6MH0sXCJjb2xvbmlhbHdpbGxpYW1zYnVyZ1wiOntcIiRcIjowfSxcImNvbG9yYWRvcGxhdGVhdVwiOntcIiRcIjowfSxcImNvbHVtYmlhXCI6e1wiJFwiOjB9LFwiY29sdW1idXNcIjp7XCIkXCI6MH0sXCJjb21tdW5pY2F0aW9uXCI6e1wiJFwiOjB9LFwiY29tbXVuaWNhdGlvbnNcIjp7XCIkXCI6MH0sXCJjb21tdW5pdHlcIjp7XCIkXCI6MH0sXCJjb21wdXRlclwiOntcIiRcIjowfSxcImNvbXB1dGVyaGlzdG9yeVwiOntcIiRcIjowfSxcInhuLS1jb211bmljYWVzLXY2YTJvXCI6e1wiJFwiOjB9LFwiY29udGVtcG9yYXJ5XCI6e1wiJFwiOjB9LFwiY29udGVtcG9yYXJ5YXJ0XCI6e1wiJFwiOjB9LFwiY29udmVudFwiOntcIiRcIjowfSxcImNvcGVuaGFnZW5cIjp7XCIkXCI6MH0sXCJjb3Jwb3JhdGlvblwiOntcIiRcIjowfSxcInhuLS1jb3JyZWlvcy1lLXRlbGVjb211bmljYWVzLWdoYzI5YVwiOntcIiRcIjowfSxcImNvcnZldHRlXCI6e1wiJFwiOjB9LFwiY29zdHVtZVwiOntcIiRcIjowfSxcImNvdW50cnllc3RhdGVcIjp7XCIkXCI6MH0sXCJjb3VudHlcIjp7XCIkXCI6MH0sXCJjcmFmdHNcIjp7XCIkXCI6MH0sXCJjcmFuYnJvb2tcIjp7XCIkXCI6MH0sXCJjcmVhdGlvblwiOntcIiRcIjowfSxcImN1bHR1cmFsXCI6e1wiJFwiOjB9LFwiY3VsdHVyYWxjZW50ZXJcIjp7XCIkXCI6MH0sXCJjdWx0dXJlXCI6e1wiJFwiOjB9LFwiY3liZXJcIjp7XCIkXCI6MH0sXCJjeW1ydVwiOntcIiRcIjowfSxcImRhbGlcIjp7XCIkXCI6MH0sXCJkYWxsYXNcIjp7XCIkXCI6MH0sXCJkYXRhYmFzZVwiOntcIiRcIjowfSxcImRkclwiOntcIiRcIjowfSxcImRlY29yYXRpdmVhcnRzXCI6e1wiJFwiOjB9LFwiZGVsYXdhcmVcIjp7XCIkXCI6MH0sXCJkZWxtZW5ob3JzdFwiOntcIiRcIjowfSxcImRlbm1hcmtcIjp7XCIkXCI6MH0sXCJkZXBvdFwiOntcIiRcIjowfSxcImRlc2lnblwiOntcIiRcIjowfSxcImRldHJvaXRcIjp7XCIkXCI6MH0sXCJkaW5vc2F1clwiOntcIiRcIjowfSxcImRpc2NvdmVyeVwiOntcIiRcIjowfSxcImRvbGxzXCI6e1wiJFwiOjB9LFwiZG9ub3N0aWFcIjp7XCIkXCI6MH0sXCJkdXJoYW1cIjp7XCIkXCI6MH0sXCJlYXN0YWZyaWNhXCI6e1wiJFwiOjB9LFwiZWFzdGNvYXN0XCI6e1wiJFwiOjB9LFwiZWR1Y2F0aW9uXCI6e1wiJFwiOjB9LFwiZWR1Y2F0aW9uYWxcIjp7XCIkXCI6MH0sXCJlZ3lwdGlhblwiOntcIiRcIjowfSxcImVpc2VuYmFoblwiOntcIiRcIjowfSxcImVsYnVyZ1wiOntcIiRcIjowfSxcImVsdmVuZHJlbGxcIjp7XCIkXCI6MH0sXCJlbWJyb2lkZXJ5XCI6e1wiJFwiOjB9LFwiZW5jeWNsb3BlZGljXCI6e1wiJFwiOjB9LFwiZW5nbGFuZFwiOntcIiRcIjowfSxcImVudG9tb2xvZ3lcIjp7XCIkXCI6MH0sXCJlbnZpcm9ubWVudFwiOntcIiRcIjowfSxcImVudmlyb25tZW50YWxjb25zZXJ2YXRpb25cIjp7XCIkXCI6MH0sXCJlcGlsZXBzeVwiOntcIiRcIjowfSxcImVzc2V4XCI6e1wiJFwiOjB9LFwiZXN0YXRlXCI6e1wiJFwiOjB9LFwiZXRobm9sb2d5XCI6e1wiJFwiOjB9LFwiZXhldGVyXCI6e1wiJFwiOjB9LFwiZXhoaWJpdGlvblwiOntcIiRcIjowfSxcImZhbWlseVwiOntcIiRcIjowfSxcImZhcm1cIjp7XCIkXCI6MH0sXCJmYXJtZXF1aXBtZW50XCI6e1wiJFwiOjB9LFwiZmFybWVyc1wiOntcIiRcIjowfSxcImZhcm1zdGVhZFwiOntcIiRcIjowfSxcImZpZWxkXCI6e1wiJFwiOjB9LFwiZmlndWVyZXNcIjp7XCIkXCI6MH0sXCJmaWxhdGVsaWFcIjp7XCIkXCI6MH0sXCJmaWxtXCI6e1wiJFwiOjB9LFwiZmluZWFydFwiOntcIiRcIjowfSxcImZpbmVhcnRzXCI6e1wiJFwiOjB9LFwiZmlubGFuZFwiOntcIiRcIjowfSxcImZsYW5kZXJzXCI6e1wiJFwiOjB9LFwiZmxvcmlkYVwiOntcIiRcIjowfSxcImZvcmNlXCI6e1wiJFwiOjB9LFwiZm9ydG1pc3NvdWxhXCI6e1wiJFwiOjB9LFwiZm9ydHdvcnRoXCI6e1wiJFwiOjB9LFwiZm91bmRhdGlvblwiOntcIiRcIjowfSxcImZyYW5jYWlzZVwiOntcIiRcIjowfSxcImZyYW5rZnVydFwiOntcIiRcIjowfSxcImZyYW56aXNrYW5lclwiOntcIiRcIjowfSxcImZyZWVtYXNvbnJ5XCI6e1wiJFwiOjB9LFwiZnJlaWJ1cmdcIjp7XCIkXCI6MH0sXCJmcmlib3VyZ1wiOntcIiRcIjowfSxcImZyb2dcIjp7XCIkXCI6MH0sXCJmdW5kYWNpb1wiOntcIiRcIjowfSxcImZ1cm5pdHVyZVwiOntcIiRcIjowfSxcImdhbGxlcnlcIjp7XCIkXCI6MH0sXCJnYXJkZW5cIjp7XCIkXCI6MH0sXCJnYXRld2F5XCI6e1wiJFwiOjB9LFwiZ2VlbHZpbmNrXCI6e1wiJFwiOjB9LFwiZ2Vtb2xvZ2ljYWxcIjp7XCIkXCI6MH0sXCJnZW9sb2d5XCI6e1wiJFwiOjB9LFwiZ2VvcmdpYVwiOntcIiRcIjowfSxcImdpZXNzZW5cIjp7XCIkXCI6MH0sXCJnbGFzXCI6e1wiJFwiOjB9LFwiZ2xhc3NcIjp7XCIkXCI6MH0sXCJnb3JnZVwiOntcIiRcIjowfSxcImdyYW5kcmFwaWRzXCI6e1wiJFwiOjB9LFwiZ3JhelwiOntcIiRcIjowfSxcImd1ZXJuc2V5XCI6e1wiJFwiOjB9LFwiaGFsbG9mZmFtZVwiOntcIiRcIjowfSxcImhhbWJ1cmdcIjp7XCIkXCI6MH0sXCJoYW5kc29uXCI6e1wiJFwiOjB9LFwiaGFydmVzdGNlbGVicmF0aW9uXCI6e1wiJFwiOjB9LFwiaGF3YWlpXCI6e1wiJFwiOjB9LFwiaGVhbHRoXCI6e1wiJFwiOjB9LFwiaGVpbWF0dW5kdWhyZW5cIjp7XCIkXCI6MH0sXCJoZWxsYXNcIjp7XCIkXCI6MH0sXCJoZWxzaW5raVwiOntcIiRcIjowfSxcImhlbWJ5Z2RzZm9yYnVuZFwiOntcIiRcIjowfSxcImhlcml0YWdlXCI6e1wiJFwiOjB9LFwiaGlzdG9pcmVcIjp7XCIkXCI6MH0sXCJoaXN0b3JpY2FsXCI6e1wiJFwiOjB9LFwiaGlzdG9yaWNhbHNvY2lldHlcIjp7XCIkXCI6MH0sXCJoaXN0b3JpY2hvdXNlc1wiOntcIiRcIjowfSxcImhpc3RvcmlzY2hcIjp7XCIkXCI6MH0sXCJoaXN0b3Jpc2NoZXNcIjp7XCIkXCI6MH0sXCJoaXN0b3J5XCI6e1wiJFwiOjB9LFwiaGlzdG9yeW9mc2NpZW5jZVwiOntcIiRcIjowfSxcImhvcm9sb2d5XCI6e1wiJFwiOjB9LFwiaG91c2VcIjp7XCIkXCI6MH0sXCJodW1hbml0aWVzXCI6e1wiJFwiOjB9LFwiaWxsdXN0cmF0aW9uXCI6e1wiJFwiOjB9LFwiaW1hZ2VhbmRzb3VuZFwiOntcIiRcIjowfSxcImluZGlhblwiOntcIiRcIjowfSxcImluZGlhbmFcIjp7XCIkXCI6MH0sXCJpbmRpYW5hcG9saXNcIjp7XCIkXCI6MH0sXCJpbmRpYW5tYXJrZXRcIjp7XCIkXCI6MH0sXCJpbnRlbGxpZ2VuY2VcIjp7XCIkXCI6MH0sXCJpbnRlcmFjdGl2ZVwiOntcIiRcIjowfSxcImlyYXFcIjp7XCIkXCI6MH0sXCJpcm9uXCI6e1wiJFwiOjB9LFwiaXNsZW9mbWFuXCI6e1wiJFwiOjB9LFwiamFtaXNvblwiOntcIiRcIjowfSxcImplZmZlcnNvblwiOntcIiRcIjowfSxcImplcnVzYWxlbVwiOntcIiRcIjowfSxcImpld2VscnlcIjp7XCIkXCI6MH0sXCJqZXdpc2hcIjp7XCIkXCI6MH0sXCJqZXdpc2hhcnRcIjp7XCIkXCI6MH0sXCJqZmtcIjp7XCIkXCI6MH0sXCJqb3VybmFsaXNtXCI6e1wiJFwiOjB9LFwianVkYWljYVwiOntcIiRcIjowfSxcImp1ZHlnYXJsYW5kXCI6e1wiJFwiOjB9LFwianVlZGlzY2hlc1wiOntcIiRcIjowfSxcImp1aWZcIjp7XCIkXCI6MH0sXCJrYXJhdGVcIjp7XCIkXCI6MH0sXCJrYXJpa2F0dXJcIjp7XCIkXCI6MH0sXCJraWRzXCI6e1wiJFwiOjB9LFwia29lYmVuaGF2blwiOntcIiRcIjowfSxcImtvZWxuXCI6e1wiJFwiOjB9LFwia3Vuc3RcIjp7XCIkXCI6MH0sXCJrdW5zdHNhbW1sdW5nXCI6e1wiJFwiOjB9LFwia3Vuc3R1bmRkZXNpZ25cIjp7XCIkXCI6MH0sXCJsYWJvclwiOntcIiRcIjowfSxcImxhYm91clwiOntcIiRcIjowfSxcImxham9sbGFcIjp7XCIkXCI6MH0sXCJsYW5jYXNoaXJlXCI6e1wiJFwiOjB9LFwibGFuZGVzXCI6e1wiJFwiOjB9LFwibGFuc1wiOntcIiRcIjowfSxcInhuLS1sbnMtcWxhXCI6e1wiJFwiOjB9LFwibGFyc3NvblwiOntcIiRcIjowfSxcImxld2lzbWlsbGVyXCI6e1wiJFwiOjB9LFwibGluY29sblwiOntcIiRcIjowfSxcImxpbnpcIjp7XCIkXCI6MH0sXCJsaXZpbmdcIjp7XCIkXCI6MH0sXCJsaXZpbmdoaXN0b3J5XCI6e1wiJFwiOjB9LFwibG9jYWxoaXN0b3J5XCI6e1wiJFwiOjB9LFwibG9uZG9uXCI6e1wiJFwiOjB9LFwibG9zYW5nZWxlc1wiOntcIiRcIjowfSxcImxvdXZyZVwiOntcIiRcIjowfSxcImxveWFsaXN0XCI6e1wiJFwiOjB9LFwibHVjZXJuZVwiOntcIiRcIjowfSxcImx1eGVtYm91cmdcIjp7XCIkXCI6MH0sXCJsdXplcm5cIjp7XCIkXCI6MH0sXCJtYWRcIjp7XCIkXCI6MH0sXCJtYWRyaWRcIjp7XCIkXCI6MH0sXCJtYWxsb3JjYVwiOntcIiRcIjowfSxcIm1hbmNoZXN0ZXJcIjp7XCIkXCI6MH0sXCJtYW5zaW9uXCI6e1wiJFwiOjB9LFwibWFuc2lvbnNcIjp7XCIkXCI6MH0sXCJtYW54XCI6e1wiJFwiOjB9LFwibWFyYnVyZ1wiOntcIiRcIjowfSxcIm1hcml0aW1lXCI6e1wiJFwiOjB9LFwibWFyaXRpbW9cIjp7XCIkXCI6MH0sXCJtYXJ5bGFuZFwiOntcIiRcIjowfSxcIm1hcnlsaHVyc3RcIjp7XCIkXCI6MH0sXCJtZWRpYVwiOntcIiRcIjowfSxcIm1lZGljYWxcIjp7XCIkXCI6MH0sXCJtZWRpemluaGlzdG9yaXNjaGVzXCI6e1wiJFwiOjB9LFwibWVlcmVzXCI6e1wiJFwiOjB9LFwibWVtb3JpYWxcIjp7XCIkXCI6MH0sXCJtZXNhdmVyZGVcIjp7XCIkXCI6MH0sXCJtaWNoaWdhblwiOntcIiRcIjowfSxcIm1pZGF0bGFudGljXCI6e1wiJFwiOjB9LFwibWlsaXRhcnlcIjp7XCIkXCI6MH0sXCJtaWxsXCI6e1wiJFwiOjB9LFwibWluZXJzXCI6e1wiJFwiOjB9LFwibWluaW5nXCI6e1wiJFwiOjB9LFwibWlubmVzb3RhXCI6e1wiJFwiOjB9LFwibWlzc2lsZVwiOntcIiRcIjowfSxcIm1pc3NvdWxhXCI6e1wiJFwiOjB9LFwibW9kZXJuXCI6e1wiJFwiOjB9LFwibW9tYVwiOntcIiRcIjowfSxcIm1vbmV5XCI6e1wiJFwiOjB9LFwibW9ubW91dGhcIjp7XCIkXCI6MH0sXCJtb250aWNlbGxvXCI6e1wiJFwiOjB9LFwibW9udHJlYWxcIjp7XCIkXCI6MH0sXCJtb3Njb3dcIjp7XCIkXCI6MH0sXCJtb3RvcmN5Y2xlXCI6e1wiJFwiOjB9LFwibXVlbmNoZW5cIjp7XCIkXCI6MH0sXCJtdWVuc3RlclwiOntcIiRcIjowfSxcIm11bGhvdXNlXCI6e1wiJFwiOjB9LFwibXVuY2llXCI6e1wiJFwiOjB9LFwibXVzZWV0XCI6e1wiJFwiOjB9LFwibXVzZXVtY2VudGVyXCI6e1wiJFwiOjB9LFwibXVzZXVtdmVyZW5pZ2luZ1wiOntcIiRcIjowfSxcIm11c2ljXCI6e1wiJFwiOjB9LFwibmF0aW9uYWxcIjp7XCIkXCI6MH0sXCJuYXRpb25hbGZpcmVhcm1zXCI6e1wiJFwiOjB9LFwibmF0aW9uYWxoZXJpdGFnZVwiOntcIiRcIjowfSxcIm5hdGl2ZWFtZXJpY2FuXCI6e1wiJFwiOjB9LFwibmF0dXJhbGhpc3RvcnlcIjp7XCIkXCI6MH0sXCJuYXR1cmFsaGlzdG9yeW11c2V1bVwiOntcIiRcIjowfSxcIm5hdHVyYWxzY2llbmNlc1wiOntcIiRcIjowfSxcIm5hdHVyZVwiOntcIiRcIjowfSxcIm5hdHVyaGlzdG9yaXNjaGVzXCI6e1wiJFwiOjB9LFwibmF0dXVyd2V0ZW5zY2hhcHBlblwiOntcIiRcIjowfSxcIm5hdW1idXJnXCI6e1wiJFwiOjB9LFwibmF2YWxcIjp7XCIkXCI6MH0sXCJuZWJyYXNrYVwiOntcIiRcIjowfSxcIm5ldWVzXCI6e1wiJFwiOjB9LFwibmV3aGFtcHNoaXJlXCI6e1wiJFwiOjB9LFwibmV3amVyc2V5XCI6e1wiJFwiOjB9LFwibmV3bWV4aWNvXCI6e1wiJFwiOjB9LFwibmV3cG9ydFwiOntcIiRcIjowfSxcIm5ld3NwYXBlclwiOntcIiRcIjowfSxcIm5ld3lvcmtcIjp7XCIkXCI6MH0sXCJuaWVwY2VcIjp7XCIkXCI6MH0sXCJub3Jmb2xrXCI6e1wiJFwiOjB9LFwibm9ydGhcIjp7XCIkXCI6MH0sXCJucndcIjp7XCIkXCI6MH0sXCJudWVybmJlcmdcIjp7XCIkXCI6MH0sXCJudXJlbWJlcmdcIjp7XCIkXCI6MH0sXCJueWNcIjp7XCIkXCI6MH0sXCJueW55XCI6e1wiJFwiOjB9LFwib2NlYW5vZ3JhcGhpY1wiOntcIiRcIjowfSxcIm9jZWFub2dyYXBoaXF1ZVwiOntcIiRcIjowfSxcIm9tYWhhXCI6e1wiJFwiOjB9LFwib25saW5lXCI6e1wiJFwiOjB9LFwib250YXJpb1wiOntcIiRcIjowfSxcIm9wZW5haXJcIjp7XCIkXCI6MH0sXCJvcmVnb25cIjp7XCIkXCI6MH0sXCJvcmVnb250cmFpbFwiOntcIiRcIjowfSxcIm90YWdvXCI6e1wiJFwiOjB9LFwib3hmb3JkXCI6e1wiJFwiOjB9LFwicGFjaWZpY1wiOntcIiRcIjowfSxcInBhZGVyYm9yblwiOntcIiRcIjowfSxcInBhbGFjZVwiOntcIiRcIjowfSxcInBhbGVvXCI6e1wiJFwiOjB9LFwicGFsbXNwcmluZ3NcIjp7XCIkXCI6MH0sXCJwYW5hbWFcIjp7XCIkXCI6MH0sXCJwYXJpc1wiOntcIiRcIjowfSxcInBhc2FkZW5hXCI6e1wiJFwiOjB9LFwicGhhcm1hY3lcIjp7XCIkXCI6MH0sXCJwaGlsYWRlbHBoaWFcIjp7XCIkXCI6MH0sXCJwaGlsYWRlbHBoaWFhcmVhXCI6e1wiJFwiOjB9LFwicGhpbGF0ZWx5XCI6e1wiJFwiOjB9LFwicGhvZW5peFwiOntcIiRcIjowfSxcInBob3RvZ3JhcGh5XCI6e1wiJFwiOjB9LFwicGlsb3RzXCI6e1wiJFwiOjB9LFwicGl0dHNidXJnaFwiOntcIiRcIjowfSxcInBsYW5ldGFyaXVtXCI6e1wiJFwiOjB9LFwicGxhbnRhdGlvblwiOntcIiRcIjowfSxcInBsYW50c1wiOntcIiRcIjowfSxcInBsYXphXCI6e1wiJFwiOjB9LFwicG9ydGFsXCI6e1wiJFwiOjB9LFwicG9ydGxhbmRcIjp7XCIkXCI6MH0sXCJwb3J0bGxpZ2F0XCI6e1wiJFwiOjB9LFwicG9zdHMtYW5kLXRlbGVjb21tdW5pY2F0aW9uc1wiOntcIiRcIjowfSxcInByZXNlcnZhdGlvblwiOntcIiRcIjowfSxcInByZXNpZGlvXCI6e1wiJFwiOjB9LFwicHJlc3NcIjp7XCIkXCI6MH0sXCJwcm9qZWN0XCI6e1wiJFwiOjB9LFwicHVibGljXCI6e1wiJFwiOjB9LFwicHVib2xcIjp7XCIkXCI6MH0sXCJxdWViZWNcIjp7XCIkXCI6MH0sXCJyYWlscm9hZFwiOntcIiRcIjowfSxcInJhaWx3YXlcIjp7XCIkXCI6MH0sXCJyZXNlYXJjaFwiOntcIiRcIjowfSxcInJlc2lzdGFuY2VcIjp7XCIkXCI6MH0sXCJyaW9kZWphbmVpcm9cIjp7XCIkXCI6MH0sXCJyb2NoZXN0ZXJcIjp7XCIkXCI6MH0sXCJyb2NrYXJ0XCI6e1wiJFwiOjB9LFwicm9tYVwiOntcIiRcIjowfSxcInJ1c3NpYVwiOntcIiRcIjowfSxcInNhaW50bG91aXNcIjp7XCIkXCI6MH0sXCJzYWxlbVwiOntcIiRcIjowfSxcInNhbHZhZG9yZGFsaVwiOntcIiRcIjowfSxcInNhbHpidXJnXCI6e1wiJFwiOjB9LFwic2FuZGllZ29cIjp7XCIkXCI6MH0sXCJzYW5mcmFuY2lzY29cIjp7XCIkXCI6MH0sXCJzYW50YWJhcmJhcmFcIjp7XCIkXCI6MH0sXCJzYW50YWNydXpcIjp7XCIkXCI6MH0sXCJzYW50YWZlXCI6e1wiJFwiOjB9LFwic2Fza2F0Y2hld2FuXCI6e1wiJFwiOjB9LFwic2F0eFwiOntcIiRcIjowfSxcInNhdmFubmFoZ2FcIjp7XCIkXCI6MH0sXCJzY2hsZXNpc2NoZXNcIjp7XCIkXCI6MH0sXCJzY2hvZW5icnVublwiOntcIiRcIjowfSxcInNjaG9rb2xhZGVuXCI6e1wiJFwiOjB9LFwic2Nob29sXCI6e1wiJFwiOjB9LFwic2Nod2VpelwiOntcIiRcIjowfSxcInNjaWVuY2VcIjp7XCIkXCI6MH0sXCJzY2llbmNlYW5kaGlzdG9yeVwiOntcIiRcIjowfSxcInNjaWVuY2VhbmRpbmR1c3RyeVwiOntcIiRcIjowfSxcInNjaWVuY2VjZW50ZXJcIjp7XCIkXCI6MH0sXCJzY2llbmNlY2VudGVyc1wiOntcIiRcIjowfSxcInNjaWVuY2UtZmljdGlvblwiOntcIiRcIjowfSxcInNjaWVuY2VoaXN0b3J5XCI6e1wiJFwiOjB9LFwic2NpZW5jZXNcIjp7XCIkXCI6MH0sXCJzY2llbmNlc25hdHVyZWxsZXNcIjp7XCIkXCI6MH0sXCJzY290bGFuZFwiOntcIiRcIjowfSxcInNlYXBvcnRcIjp7XCIkXCI6MH0sXCJzZXR0bGVtZW50XCI6e1wiJFwiOjB9LFwic2V0dGxlcnNcIjp7XCIkXCI6MH0sXCJzaGVsbFwiOntcIiRcIjowfSxcInNoZXJicm9va2VcIjp7XCIkXCI6MH0sXCJzaWJlbmlrXCI6e1wiJFwiOjB9LFwic2lsa1wiOntcIiRcIjowfSxcInNraVwiOntcIiRcIjowfSxcInNrb2xlXCI6e1wiJFwiOjB9LFwic29jaWV0eVwiOntcIiRcIjowfSxcInNvbG9nbmVcIjp7XCIkXCI6MH0sXCJzb3VuZGFuZHZpc2lvblwiOntcIiRcIjowfSxcInNvdXRoY2Fyb2xpbmFcIjp7XCIkXCI6MH0sXCJzb3V0aHdlc3RcIjp7XCIkXCI6MH0sXCJzcGFjZVwiOntcIiRcIjowfSxcInNweVwiOntcIiRcIjowfSxcInNxdWFyZVwiOntcIiRcIjowfSxcInN0YWR0XCI6e1wiJFwiOjB9LFwic3RhbGJhbnNcIjp7XCIkXCI6MH0sXCJzdGFybmJlcmdcIjp7XCIkXCI6MH0sXCJzdGF0ZVwiOntcIiRcIjowfSxcInN0YXRlb2ZkZWxhd2FyZVwiOntcIiRcIjowfSxcInN0YXRpb25cIjp7XCIkXCI6MH0sXCJzdGVhbVwiOntcIiRcIjowfSxcInN0ZWllcm1hcmtcIjp7XCIkXCI6MH0sXCJzdGpvaG5cIjp7XCIkXCI6MH0sXCJzdG9ja2hvbG1cIjp7XCIkXCI6MH0sXCJzdHBldGVyc2J1cmdcIjp7XCIkXCI6MH0sXCJzdHV0dGdhcnRcIjp7XCIkXCI6MH0sXCJzdWlzc2VcIjp7XCIkXCI6MH0sXCJzdXJnZW9uc2hhbGxcIjp7XCIkXCI6MH0sXCJzdXJyZXlcIjp7XCIkXCI6MH0sXCJzdml6emVyYVwiOntcIiRcIjowfSxcInN3ZWRlblwiOntcIiRcIjowfSxcInN5ZG5leVwiOntcIiRcIjowfSxcInRhbmtcIjp7XCIkXCI6MH0sXCJ0Y21cIjp7XCIkXCI6MH0sXCJ0ZWNobm9sb2d5XCI6e1wiJFwiOjB9LFwidGVsZWtvbW11bmlrYXRpb25cIjp7XCIkXCI6MH0sXCJ0ZWxldmlzaW9uXCI6e1wiJFwiOjB9LFwidGV4YXNcIjp7XCIkXCI6MH0sXCJ0ZXh0aWxlXCI6e1wiJFwiOjB9LFwidGhlYXRlclwiOntcIiRcIjowfSxcInRpbWVcIjp7XCIkXCI6MH0sXCJ0aW1la2VlcGluZ1wiOntcIiRcIjowfSxcInRvcG9sb2d5XCI6e1wiJFwiOjB9LFwidG9yaW5vXCI6e1wiJFwiOjB9LFwidG91Y2hcIjp7XCIkXCI6MH0sXCJ0b3duXCI6e1wiJFwiOjB9LFwidHJhbnNwb3J0XCI6e1wiJFwiOjB9LFwidHJlZVwiOntcIiRcIjowfSxcInRyb2xsZXlcIjp7XCIkXCI6MH0sXCJ0cnVzdFwiOntcIiRcIjowfSxcInRydXN0ZWVcIjp7XCIkXCI6MH0sXCJ1aHJlblwiOntcIiRcIjowfSxcInVsbVwiOntcIiRcIjowfSxcInVuZGVyc2VhXCI6e1wiJFwiOjB9LFwidW5pdmVyc2l0eVwiOntcIiRcIjowfSxcInVzYVwiOntcIiRcIjowfSxcInVzYW50aXF1ZXNcIjp7XCIkXCI6MH0sXCJ1c2FydHNcIjp7XCIkXCI6MH0sXCJ1c2NvdW50cnllc3RhdGVcIjp7XCIkXCI6MH0sXCJ1c2N1bHR1cmVcIjp7XCIkXCI6MH0sXCJ1c2RlY29yYXRpdmVhcnRzXCI6e1wiJFwiOjB9LFwidXNnYXJkZW5cIjp7XCIkXCI6MH0sXCJ1c2hpc3RvcnlcIjp7XCIkXCI6MH0sXCJ1c2h1YWlhXCI6e1wiJFwiOjB9LFwidXNsaXZpbmdoaXN0b3J5XCI6e1wiJFwiOjB9LFwidXRhaFwiOntcIiRcIjowfSxcInV2aWNcIjp7XCIkXCI6MH0sXCJ2YWxsZXlcIjp7XCIkXCI6MH0sXCJ2YW50YWFcIjp7XCIkXCI6MH0sXCJ2ZXJzYWlsbGVzXCI6e1wiJFwiOjB9LFwidmlraW5nXCI6e1wiJFwiOjB9LFwidmlsbGFnZVwiOntcIiRcIjowfSxcInZpcmdpbmlhXCI6e1wiJFwiOjB9LFwidmlydHVhbFwiOntcIiRcIjowfSxcInZpcnR1ZWxcIjp7XCIkXCI6MH0sXCJ2bGFhbmRlcmVuXCI6e1wiJFwiOjB9LFwidm9sa2Vua3VuZGVcIjp7XCIkXCI6MH0sXCJ3YWxlc1wiOntcIiRcIjowfSxcIndhbGxvbmllXCI6e1wiJFwiOjB9LFwid2FyXCI6e1wiJFwiOjB9LFwid2FzaGluZ3RvbmRjXCI6e1wiJFwiOjB9LFwid2F0Y2hhbmRjbG9ja1wiOntcIiRcIjowfSxcIndhdGNoLWFuZC1jbG9ja1wiOntcIiRcIjowfSxcIndlc3Rlcm5cIjp7XCIkXCI6MH0sXCJ3ZXN0ZmFsZW5cIjp7XCIkXCI6MH0sXCJ3aGFsaW5nXCI6e1wiJFwiOjB9LFwid2lsZGxpZmVcIjp7XCIkXCI6MH0sXCJ3aWxsaWFtc2J1cmdcIjp7XCIkXCI6MH0sXCJ3aW5kbWlsbFwiOntcIiRcIjowfSxcIndvcmtzaG9wXCI6e1wiJFwiOjB9LFwieW9ya1wiOntcIiRcIjowfSxcInlvcmtzaGlyZVwiOntcIiRcIjowfSxcInlvc2VtaXRlXCI6e1wiJFwiOjB9LFwieW91dGhcIjp7XCIkXCI6MH0sXCJ6b29sb2dpY2FsXCI6e1wiJFwiOjB9LFwiem9vbG9neVwiOntcIiRcIjowfSxcInhuLS05ZGJoYmxnNmRpXCI6e1wiJFwiOjB9LFwieG4tLWgxYWVnaFwiOntcIiRcIjowfX0sXCJtdlwiOntcIiRcIjowLFwiYWVyb1wiOntcIiRcIjowfSxcImJpelwiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcImNvb3BcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJpbmZvXCI6e1wiJFwiOjB9LFwiaW50XCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwibXVzZXVtXCI6e1wiJFwiOjB9LFwibmFtZVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcInByb1wiOntcIiRcIjowfX0sXCJtd1wiOntcIiRcIjowLFwiYWNcIjp7XCIkXCI6MH0sXCJiaXpcIjp7XCIkXCI6MH0sXCJjb1wiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcImNvb3BcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJpbnRcIjp7XCIkXCI6MH0sXCJtdXNldW1cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH19LFwibXhcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImdvYlwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcImJsb2dzcG90XCI6e1wiJFwiOjB9LFwibnltXCI6e1wiJFwiOjB9fSxcIm15XCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJuYW1lXCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH19LFwibXpcIjp7XCIkXCI6MCxcImFjXCI6e1wiJFwiOjB9LFwiYWR2XCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH19LFwibmFcIjp7XCIkXCI6MCxcImluZm9cIjp7XCIkXCI6MH0sXCJwcm9cIjp7XCIkXCI6MH0sXCJuYW1lXCI6e1wiJFwiOjB9LFwic2Nob29sXCI6e1wiJFwiOjB9LFwib3JcIjp7XCIkXCI6MH0sXCJkclwiOntcIiRcIjowfSxcInVzXCI6e1wiJFwiOjB9LFwibXhcIjp7XCIkXCI6MH0sXCJjYVwiOntcIiRcIjowfSxcImluXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJ0dlwiOntcIiRcIjowfSxcIndzXCI6e1wiJFwiOjB9LFwibW9iaVwiOntcIiRcIjowfSxcImNvXCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9fSxcIm5hbWVcIjp7XCIkXCI6MCxcImhlclwiOntcImZvcmdvdFwiOntcIiRcIjowfX0sXCJoaXNcIjp7XCJmb3Jnb3RcIjp7XCIkXCI6MH19fSxcIm5jXCI6e1wiJFwiOjAsXCJhc3NvXCI6e1wiJFwiOjB9LFwibm9tXCI6e1wiJFwiOjB9fSxcIm5lXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjAsXCJhbHdheXNkYXRhXCI6e1wiKlwiOntcIiRcIjowfX0sXCJjbG91ZGZyb250XCI6e1wiJFwiOjB9LFwidDNsM3AwcnRcIjp7XCIkXCI6MH0sXCJteWZyaXR6XCI6e1wiJFwiOjB9LFwiYm9vbWxhXCI6e1wiJFwiOjB9LFwiYnBsYWNlZFwiOntcIiRcIjowfSxcInNxdWFyZTdcIjp7XCIkXCI6MH0sXCJnYlwiOntcIiRcIjowfSxcImh1XCI6e1wiJFwiOjB9LFwianBcIjp7XCIkXCI6MH0sXCJzZVwiOntcIiRcIjowfSxcInVrXCI6e1wiJFwiOjB9LFwiaW5cIjp7XCIkXCI6MH0sXCJjbG91ZGFjY2Vzc1wiOntcIiRcIjowfSxcImNkbjc3LXNzbFwiOntcIiRcIjowfSxcImNkbjc3XCI6e1wiclwiOntcIiRcIjowfX0sXCJmZXN0ZS1pcFwiOntcIiRcIjowfSxcImtueC1zZXJ2ZXJcIjp7XCIkXCI6MH0sXCJzdGF0aWMtYWNjZXNzXCI6e1wiJFwiOjB9LFwiY3J5cHRvbm9taWNcIjp7XCIqXCI6e1wiJFwiOjB9fSxcImRlYmlhblwiOntcIiRcIjowfSxcImF0LWJhbmQtY2FtcFwiOntcIiRcIjowfSxcImJsb2dkbnNcIjp7XCIkXCI6MH0sXCJicm9rZS1pdFwiOntcIiRcIjowfSxcImJ1eXNob3VzZXNcIjp7XCIkXCI6MH0sXCJkbnNhbGlhc1wiOntcIiRcIjowfSxcImRuc2Rvam9cIjp7XCIkXCI6MH0sXCJkb2VzLWl0XCI6e1wiJFwiOjB9LFwiZG9udGV4aXN0XCI6e1wiJFwiOjB9LFwiZHluYWxpYXNcIjp7XCIkXCI6MH0sXCJkeW5hdGhvbWVcIjp7XCIkXCI6MH0sXCJlbmRvZmludGVybmV0XCI6e1wiJFwiOjB9LFwiZnJvbS1helwiOntcIiRcIjowfSxcImZyb20tY29cIjp7XCIkXCI6MH0sXCJmcm9tLWxhXCI6e1wiJFwiOjB9LFwiZnJvbS1ueVwiOntcIiRcIjowfSxcImdldHMtaXRcIjp7XCIkXCI6MH0sXCJoYW0tcmFkaW8tb3BcIjp7XCIkXCI6MH0sXCJob21lZnRwXCI6e1wiJFwiOjB9LFwiaG9tZWlwXCI6e1wiJFwiOjB9LFwiaG9tZWxpbnV4XCI6e1wiJFwiOjB9LFwiaG9tZXVuaXhcIjp7XCIkXCI6MH0sXCJpbi10aGUtYmFuZFwiOntcIiRcIjowfSxcImlzLWEtY2hlZlwiOntcIiRcIjowfSxcImlzLWEtZ2Vla1wiOntcIiRcIjowfSxcImlzYS1nZWVrXCI6e1wiJFwiOjB9LFwia2lja3MtYXNzXCI6e1wiJFwiOjB9LFwib2ZmaWNlLW9uLXRoZVwiOntcIiRcIjowfSxcInBvZHpvbmVcIjp7XCIkXCI6MH0sXCJzY3JhcHBlci1zaXRlXCI6e1wiJFwiOjB9LFwic2VsZmlwXCI6e1wiJFwiOjB9LFwic2VsbHMtaXRcIjp7XCIkXCI6MH0sXCJzZXJ2ZWJic1wiOntcIiRcIjowfSxcInNlcnZlZnRwXCI6e1wiJFwiOjB9LFwidGhydWhlcmVcIjp7XCIkXCI6MH0sXCJ3ZWJob3BcIjp7XCIkXCI6MH0sXCJkZWZpbmltYVwiOntcIiRcIjowfSxcImNhc2FjYW1cIjp7XCIkXCI6MH0sXCJkeW51XCI6e1wiJFwiOjB9LFwiZHludjZcIjp7XCIkXCI6MH0sXCJ0d21haWxcIjp7XCIkXCI6MH0sXCJydVwiOntcIiRcIjowfSxcImNoYW5uZWxzZHZyXCI6e1wiJFwiOjB9LFwiZmFzdGx5bGJcIjp7XCIkXCI6MCxcIm1hcFwiOntcIiRcIjowfX0sXCJmYXN0bHlcIjp7XCJmcmVldGxzXCI6e1wiJFwiOjB9LFwibWFwXCI6e1wiJFwiOjB9LFwicHJvZFwiOntcImFcIjp7XCIkXCI6MH0sXCJnbG9iYWxcIjp7XCIkXCI6MH19LFwic3NsXCI6e1wiYVwiOntcIiRcIjowfSxcImJcIjp7XCIkXCI6MH0sXCJnbG9iYWxcIjp7XCIkXCI6MH19fSxcImZseW5uaG9zdGluZ1wiOntcIiRcIjowfSxcImNsb3VkZnVuY3Rpb25zXCI6e1wiJFwiOjB9LFwibW9vbnNjYWxlXCI6e1wiJFwiOjB9LFwiaXBpZm9ueVwiOntcIiRcIjowfSxcImJhcnN5XCI6e1wiJFwiOjB9LFwiYXp1cmV3ZWJzaXRlc1wiOntcIiRcIjowfSxcImF6dXJlLW1vYmlsZVwiOntcIiRcIjowfSxcImNsb3VkYXBwXCI6e1wiJFwiOjB9LFwiZWF0aW5nLW9yZ2FuaWNcIjp7XCIkXCI6MH0sXCJteWRpc3NlbnRcIjp7XCIkXCI6MH0sXCJteWVmZmVjdFwiOntcIiRcIjowfSxcIm15bWVkaWFwY1wiOntcIiRcIjowfSxcIm15cHN4XCI6e1wiJFwiOjB9LFwibXlzZWN1cml0eWNhbWVyYVwiOntcIiRcIjowfSxcIm5obGZhblwiOntcIiRcIjowfSxcIm5vLWlwXCI6e1wiJFwiOjB9LFwicGdhZmFuXCI6e1wiJFwiOjB9LFwicHJpdmF0aXplaGVhbHRoaW5zdXJhbmNlXCI6e1wiJFwiOjB9LFwiYm91bmNlbWVcIjp7XCIkXCI6MH0sXCJkZG5zXCI6e1wiJFwiOjB9LFwicmVkaXJlY3RtZVwiOntcIiRcIjowfSxcInNlcnZlYmxvZ1wiOntcIiRcIjowfSxcInNlcnZlbWluZWNyYWZ0XCI6e1wiJFwiOjB9LFwic3l0ZXNcIjp7XCIkXCI6MH0sXCJyYWNrbWF6ZVwiOntcIiRcIjowfSxcImZpcmV3YWxsLWdhdGV3YXlcIjp7XCIkXCI6MH0sXCJkc215bmFzXCI6e1wiJFwiOjB9LFwiZmFtaWx5ZHNcIjp7XCIkXCI6MH0sXCJ6YVwiOntcIiRcIjowfX0sXCJuZlwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwicGVyXCI6e1wiJFwiOjB9LFwicmVjXCI6e1wiJFwiOjB9LFwid2ViXCI6e1wiJFwiOjB9LFwiYXJ0c1wiOntcIiRcIjowfSxcImZpcm1cIjp7XCIkXCI6MH0sXCJpbmZvXCI6e1wiJFwiOjB9LFwib3RoZXJcIjp7XCIkXCI6MH0sXCJzdG9yZVwiOntcIiRcIjowfX0sXCJuZ1wiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjAsXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJpXCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwibW9iaVwiOntcIiRcIjowfSxcIm5hbWVcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJzY2hcIjp7XCIkXCI6MH19LFwibmlcIjp7XCIkXCI6MCxcImFjXCI6e1wiJFwiOjB9LFwiYml6XCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MH0sXCJjb21cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb2JcIjp7XCIkXCI6MH0sXCJpblwiOntcIiRcIjowfSxcImluZm9cIjp7XCIkXCI6MH0sXCJpbnRcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJ3ZWJcIjp7XCIkXCI6MH19LFwibmxcIjp7XCIkXCI6MCxcImJ2XCI6e1wiJFwiOjB9LFwidmlydHVlZWxkb21laW5cIjp7XCIkXCI6MH0sXCJjb1wiOntcIiRcIjowfSxcImJsb2dzcG90XCI6e1wiJFwiOjB9LFwidHJhbnN1cmxcIjp7XCIqXCI6e1wiJFwiOjB9fSxcImNpc3Ryb25cIjp7XCIkXCI6MH0sXCJkZW1vblwiOntcIiRcIjowfX0sXCJub1wiOntcIiRcIjowLFwiZmhzXCI6e1wiJFwiOjB9LFwidmdzXCI6e1wiJFwiOjB9LFwiZnlsa2VzYmlibFwiOntcIiRcIjowfSxcImZvbGtlYmlibFwiOntcIiRcIjowfSxcIm11c2V1bVwiOntcIiRcIjowfSxcImlkcmV0dFwiOntcIiRcIjowfSxcInByaXZcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJzdGF0XCI6e1wiJFwiOjB9LFwiZGVwXCI6e1wiJFwiOjB9LFwia29tbXVuZVwiOntcIiRcIjowfSxcImhlcmFkXCI6e1wiJFwiOjB9LFwiYWFcIjp7XCIkXCI6MCxcImdzXCI6e1wiJFwiOjB9fSxcImFoXCI6e1wiJFwiOjAsXCJnc1wiOntcIiRcIjowfX0sXCJidVwiOntcIiRcIjowLFwiZ3NcIjp7XCIkXCI6MH19LFwiZm1cIjp7XCIkXCI6MCxcImdzXCI6e1wiJFwiOjB9fSxcImhsXCI6e1wiJFwiOjAsXCJnc1wiOntcIiRcIjowfX0sXCJobVwiOntcIiRcIjowLFwiZ3NcIjp7XCIkXCI6MH19LFwiamFuLW1heWVuXCI6e1wiJFwiOjAsXCJnc1wiOntcIiRcIjowfX0sXCJtclwiOntcIiRcIjowLFwiZ3NcIjp7XCIkXCI6MH19LFwibmxcIjp7XCIkXCI6MCxcImdzXCI6e1wiJFwiOjB9fSxcIm50XCI6e1wiJFwiOjAsXCJnc1wiOntcIiRcIjowfX0sXCJvZlwiOntcIiRcIjowLFwiZ3NcIjp7XCIkXCI6MH19LFwib2xcIjp7XCIkXCI6MCxcImdzXCI6e1wiJFwiOjB9fSxcIm9zbG9cIjp7XCIkXCI6MCxcImdzXCI6e1wiJFwiOjB9fSxcInJsXCI6e1wiJFwiOjAsXCJnc1wiOntcIiRcIjowfX0sXCJzZlwiOntcIiRcIjowLFwiZ3NcIjp7XCIkXCI6MH19LFwic3RcIjp7XCIkXCI6MCxcImdzXCI6e1wiJFwiOjB9fSxcInN2YWxiYXJkXCI6e1wiJFwiOjAsXCJnc1wiOntcIiRcIjowfX0sXCJ0bVwiOntcIiRcIjowLFwiZ3NcIjp7XCIkXCI6MH19LFwidHJcIjp7XCIkXCI6MCxcImdzXCI6e1wiJFwiOjB9fSxcInZhXCI6e1wiJFwiOjAsXCJnc1wiOntcIiRcIjowfX0sXCJ2ZlwiOntcIiRcIjowLFwiZ3NcIjp7XCIkXCI6MH19LFwiYWtyZWhhbW5cIjp7XCIkXCI6MH0sXCJ4bi0ta3JlaGFtbi1keGFcIjp7XCIkXCI6MH0sXCJhbGdhcmRcIjp7XCIkXCI6MH0sXCJ4bi0tbGdyZC1wb2FjXCI6e1wiJFwiOjB9LFwiYXJuYVwiOntcIiRcIjowfSxcImJydW11bmRkYWxcIjp7XCIkXCI6MH0sXCJicnluZVwiOntcIiRcIjowfSxcImJyb25ub3lzdW5kXCI6e1wiJFwiOjB9LFwieG4tLWJybm55c3VuZC1tOGFjXCI6e1wiJFwiOjB9LFwiZHJvYmFrXCI6e1wiJFwiOjB9LFwieG4tLWRyYmFrLXd1YVwiOntcIiRcIjowfSxcImVnZXJzdW5kXCI6e1wiJFwiOjB9LFwiZmV0c3VuZFwiOntcIiRcIjowfSxcImZsb3JvXCI6e1wiJFwiOjB9LFwieG4tLWZsb3ItanJhXCI6e1wiJFwiOjB9LFwiZnJlZHJpa3N0YWRcIjp7XCIkXCI6MH0sXCJob2trc3VuZFwiOntcIiRcIjowfSxcImhvbmVmb3NzXCI6e1wiJFwiOjB9LFwieG4tLWhuZWZvc3MtcTFhXCI6e1wiJFwiOjB9LFwiamVzc2hlaW1cIjp7XCIkXCI6MH0sXCJqb3JwZWxhbmRcIjp7XCIkXCI6MH0sXCJ4bi0tanJwZWxhbmQtNTRhXCI6e1wiJFwiOjB9LFwia2lya2VuZXNcIjp7XCIkXCI6MH0sXCJrb3BlcnZpa1wiOntcIiRcIjowfSxcImtyb2tzdGFkZWx2YVwiOntcIiRcIjowfSxcImxhbmdldmFnXCI6e1wiJFwiOjB9LFwieG4tLWxhbmdldmctanhhXCI6e1wiJFwiOjB9LFwibGVpcnZpa1wiOntcIiRcIjowfSxcIm1qb25kYWxlblwiOntcIiRcIjowfSxcInhuLS1tam5kYWxlbi02NGFcIjp7XCIkXCI6MH0sXCJtby1pLXJhbmFcIjp7XCIkXCI6MH0sXCJtb3Nqb2VuXCI6e1wiJFwiOjB9LFwieG4tLW1vc2plbi1leWFcIjp7XCIkXCI6MH0sXCJuZXNvZGR0YW5nZW5cIjp7XCIkXCI6MH0sXCJvcmthbmdlclwiOntcIiRcIjowfSxcIm9zb3lyb1wiOntcIiRcIjowfSxcInhuLS1vc3lyby13dWFcIjp7XCIkXCI6MH0sXCJyYWhvbHRcIjp7XCIkXCI6MH0sXCJ4bi0tcmhvbHQtbXJhXCI6e1wiJFwiOjB9LFwic2FuZG5lc3Nqb2VuXCI6e1wiJFwiOjB9LFwieG4tLXNhbmRuZXNzamVuLW9nYlwiOntcIiRcIjowfSxcInNrZWRzbW9rb3JzZXRcIjp7XCIkXCI6MH0sXCJzbGF0dHVtXCI6e1wiJFwiOjB9LFwic3BqZWxrYXZpa1wiOntcIiRcIjowfSxcInN0YXRoZWxsZVwiOntcIiRcIjowfSxcInN0YXZlcm5cIjp7XCIkXCI6MH0sXCJzdGpvcmRhbHNoYWxzZW5cIjp7XCIkXCI6MH0sXCJ4bi0tc3RqcmRhbHNoYWxzZW4tc3FiXCI6e1wiJFwiOjB9LFwidGFuYW5nZXJcIjp7XCIkXCI6MH0sXCJ0cmFuYnlcIjp7XCIkXCI6MH0sXCJ2b3NzZXZhbmdlblwiOntcIiRcIjowfSxcImFmam9yZFwiOntcIiRcIjowfSxcInhuLS1mam9yZC1scmFcIjp7XCIkXCI6MH0sXCJhZ2RlbmVzXCI6e1wiJFwiOjB9LFwiYWxcIjp7XCIkXCI6MH0sXCJ4bi0tbC0xZmFcIjp7XCIkXCI6MH0sXCJhbGVzdW5kXCI6e1wiJFwiOjB9LFwieG4tLWxlc3VuZC1odWFcIjp7XCIkXCI6MH0sXCJhbHN0YWhhdWdcIjp7XCIkXCI6MH0sXCJhbHRhXCI6e1wiJFwiOjB9LFwieG4tLWx0LWxpYWNcIjp7XCIkXCI6MH0sXCJhbGFoZWFkanVcIjp7XCIkXCI6MH0sXCJ4bi0tbGFoZWFkanUtN3lhXCI6e1wiJFwiOjB9LFwiYWx2ZGFsXCI6e1wiJFwiOjB9LFwiYW1saVwiOntcIiRcIjowfSxcInhuLS1tbGktdGxhXCI6e1wiJFwiOjB9LFwiYW1vdFwiOntcIiRcIjowfSxcInhuLS1tb3QtdGxhXCI6e1wiJFwiOjB9LFwiYW5kZWJ1XCI6e1wiJFwiOjB9LFwiYW5kb3lcIjp7XCIkXCI6MH0sXCJ4bi0tYW5keS1pcmFcIjp7XCIkXCI6MH0sXCJhbmRhc3VvbG9cIjp7XCIkXCI6MH0sXCJhcmRhbFwiOntcIiRcIjowfSxcInhuLS1yZGFsLXBvYVwiOntcIiRcIjowfSxcImFyZW1hcmtcIjp7XCIkXCI6MH0sXCJhcmVuZGFsXCI6e1wiJFwiOjB9LFwieG4tLXMtMWZhXCI6e1wiJFwiOjB9LFwiYXNlcmFsXCI6e1wiJFwiOjB9LFwieG4tLXNlcmFsLWxyYVwiOntcIiRcIjowfSxcImFza2VyXCI6e1wiJFwiOjB9LFwiYXNraW1cIjp7XCIkXCI6MH0sXCJhc2t2b2xsXCI6e1wiJFwiOjB9LFwiYXNrb3lcIjp7XCIkXCI6MH0sXCJ4bi0tYXNreS1pcmFcIjp7XCIkXCI6MH0sXCJhc25lc1wiOntcIiRcIjowfSxcInhuLS1zbmVzLXBvYVwiOntcIiRcIjowfSxcImF1ZG5lZGFsblwiOntcIiRcIjowfSxcImF1a3JhXCI6e1wiJFwiOjB9LFwiYXVyZVwiOntcIiRcIjowfSxcImF1cmxhbmRcIjp7XCIkXCI6MH0sXCJhdXJza29nLWhvbGFuZFwiOntcIiRcIjowfSxcInhuLS1hdXJza29nLWhsYW5kLWpuYlwiOntcIiRcIjowfSxcImF1c3Rldm9sbFwiOntcIiRcIjowfSxcImF1c3RyaGVpbVwiOntcIiRcIjowfSxcImF2ZXJveVwiOntcIiRcIjowfSxcInhuLS1hdmVyeS15dWFcIjp7XCIkXCI6MH0sXCJiYWxlc3RyYW5kXCI6e1wiJFwiOjB9LFwiYmFsbGFuZ2VuXCI6e1wiJFwiOjB9LFwiYmFsYXRcIjp7XCIkXCI6MH0sXCJ4bi0tYmx0LWVsYWJcIjp7XCIkXCI6MH0sXCJiYWxzZmpvcmRcIjp7XCIkXCI6MH0sXCJiYWhjY2F2dW90bmFcIjp7XCIkXCI6MH0sXCJ4bi0tYmhjY2F2dW90bmEtazdhXCI6e1wiJFwiOjB9LFwiYmFtYmxlXCI6e1wiJFwiOjB9LFwiYmFyZHVcIjp7XCIkXCI6MH0sXCJiZWFyZHVcIjp7XCIkXCI6MH0sXCJiZWlhcm5cIjp7XCIkXCI6MH0sXCJiYWpkZGFyXCI6e1wiJFwiOjB9LFwieG4tLWJqZGRhci1wdGFcIjp7XCIkXCI6MH0sXCJiYWlkYXJcIjp7XCIkXCI6MH0sXCJ4bi0tYmlkci01bmFjXCI6e1wiJFwiOjB9LFwiYmVyZ1wiOntcIiRcIjowfSxcImJlcmdlblwiOntcIiRcIjowfSxcImJlcmxldmFnXCI6e1wiJFwiOjB9LFwieG4tLWJlcmxldmctanhhXCI6e1wiJFwiOjB9LFwiYmVhcmFsdmFoa2lcIjp7XCIkXCI6MH0sXCJ4bi0tYmVhcmFsdmhraS15NGFcIjp7XCIkXCI6MH0sXCJiaW5kYWxcIjp7XCIkXCI6MH0sXCJiaXJrZW5lc1wiOntcIiRcIjowfSxcImJqYXJrb3lcIjp7XCIkXCI6MH0sXCJ4bi0tYmphcmt5LWZ5YVwiOntcIiRcIjowfSxcImJqZXJrcmVpbVwiOntcIiRcIjowfSxcImJqdWduXCI6e1wiJFwiOjB9LFwiYm9kb1wiOntcIiRcIjowfSxcInhuLS1ib2QtMm5hXCI6e1wiJFwiOjB9LFwiYmFkYWRkamFcIjp7XCIkXCI6MH0sXCJ4bi0tYmRkZGotbXJhYmRcIjp7XCIkXCI6MH0sXCJidWRlamp1XCI6e1wiJFwiOjB9LFwiYm9rblwiOntcIiRcIjowfSxcImJyZW1hbmdlclwiOntcIiRcIjowfSxcImJyb25ub3lcIjp7XCIkXCI6MH0sXCJ4bi0tYnJubnktd3VhY1wiOntcIiRcIjowfSxcImJ5Z2xhbmRcIjp7XCIkXCI6MH0sXCJieWtsZVwiOntcIiRcIjowfSxcImJhcnVtXCI6e1wiJFwiOjB9LFwieG4tLWJydW0tdm9hXCI6e1wiJFwiOjB9LFwidGVsZW1hcmtcIjp7XCJib1wiOntcIiRcIjowfSxcInhuLS1iLTVnYVwiOntcIiRcIjowfX0sXCJub3JkbGFuZFwiOntcImJvXCI6e1wiJFwiOjB9LFwieG4tLWItNWdhXCI6e1wiJFwiOjB9LFwiaGVyb3lcIjp7XCIkXCI6MH0sXCJ4bi0taGVyeS1pcmFcIjp7XCIkXCI6MH19LFwiYmlldmF0XCI6e1wiJFwiOjB9LFwieG4tLWJpZXZ0LTBxYVwiOntcIiRcIjowfSxcImJvbWxvXCI6e1wiJFwiOjB9LFwieG4tLWJtbG8tZ3JhXCI6e1wiJFwiOjB9LFwiYmF0c2Zqb3JkXCI6e1wiJFwiOjB9LFwieG4tLWJ0c2Zqb3JkLTl6YVwiOntcIiRcIjowfSxcImJhaGNhdnVvdG5hXCI6e1wiJFwiOjB9LFwieG4tLWJoY2F2dW90bmEtczRhXCI6e1wiJFwiOjB9LFwiZG92cmVcIjp7XCIkXCI6MH0sXCJkcmFtbWVuXCI6e1wiJFwiOjB9LFwiZHJhbmdlZGFsXCI6e1wiJFwiOjB9LFwiZHlyb3lcIjp7XCIkXCI6MH0sXCJ4bi0tZHlyeS1pcmFcIjp7XCIkXCI6MH0sXCJkb25uYVwiOntcIiRcIjowfSxcInhuLS1kbm5hLWdyYVwiOntcIiRcIjowfSxcImVpZFwiOntcIiRcIjowfSxcImVpZGZqb3JkXCI6e1wiJFwiOjB9LFwiZWlkc2JlcmdcIjp7XCIkXCI6MH0sXCJlaWRza29nXCI6e1wiJFwiOjB9LFwiZWlkc3ZvbGxcIjp7XCIkXCI6MH0sXCJlaWdlcnN1bmRcIjp7XCIkXCI6MH0sXCJlbHZlcnVtXCI6e1wiJFwiOjB9LFwiZW5lYmFra1wiOntcIiRcIjowfSxcImVuZ2VyZGFsXCI6e1wiJFwiOjB9LFwiZXRuZVwiOntcIiRcIjowfSxcImV0bmVkYWxcIjp7XCIkXCI6MH0sXCJldmVuZXNcIjp7XCIkXCI6MH0sXCJldmVuYXNzaVwiOntcIiRcIjowfSxcInhuLS1ldmVuaS0wcWEwMWdhXCI6e1wiJFwiOjB9LFwiZXZqZS1vZy1ob3JubmVzXCI6e1wiJFwiOjB9LFwiZmFyc3VuZFwiOntcIiRcIjowfSxcImZhdXNrZVwiOntcIiRcIjowfSxcImZ1b3Nza29cIjp7XCIkXCI6MH0sXCJmdW9pc2t1XCI6e1wiJFwiOjB9LFwiZmVkamVcIjp7XCIkXCI6MH0sXCJmZXRcIjp7XCIkXCI6MH0sXCJmaW5ub3lcIjp7XCIkXCI6MH0sXCJ4bi0tZmlubnkteXVhXCI6e1wiJFwiOjB9LFwiZml0amFyXCI6e1wiJFwiOjB9LFwiZmphbGVyXCI6e1wiJFwiOjB9LFwiZmplbGxcIjp7XCIkXCI6MH0sXCJmbGFrc3RhZFwiOntcIiRcIjowfSxcImZsYXRhbmdlclwiOntcIiRcIjowfSxcImZsZWtrZWZqb3JkXCI6e1wiJFwiOjB9LFwiZmxlc2JlcmdcIjp7XCIkXCI6MH0sXCJmbG9yYVwiOntcIiRcIjowfSxcImZsYVwiOntcIiRcIjowfSxcInhuLS1mbC16aWFcIjp7XCIkXCI6MH0sXCJmb2xsZGFsXCI6e1wiJFwiOjB9LFwiZm9yc2FuZFwiOntcIiRcIjowfSxcImZvc25lc1wiOntcIiRcIjowfSxcImZyZWlcIjp7XCIkXCI6MH0sXCJmcm9nblwiOntcIiRcIjowfSxcImZyb2xhbmRcIjp7XCIkXCI6MH0sXCJmcm9zdGFcIjp7XCIkXCI6MH0sXCJmcmFuYVwiOntcIiRcIjowfSxcInhuLS1mcm5hLXdvYVwiOntcIiRcIjowfSxcImZyb3lhXCI6e1wiJFwiOjB9LFwieG4tLWZyeWEtaHJhXCI6e1wiJFwiOjB9LFwiZnVzYVwiOntcIiRcIjowfSxcImZ5cmVzZGFsXCI6e1wiJFwiOjB9LFwiZm9yZGVcIjp7XCIkXCI6MH0sXCJ4bi0tZnJkZS1ncmFcIjp7XCIkXCI6MH0sXCJnYW12aWtcIjp7XCIkXCI6MH0sXCJnYW5nYXZpaWthXCI6e1wiJFwiOjB9LFwieG4tLWdnYXZpaWthLTh5YTQ3aFwiOntcIiRcIjowfSxcImdhdWxhclwiOntcIiRcIjowfSxcImdhdXNkYWxcIjp7XCIkXCI6MH0sXCJnaWxkZXNrYWxcIjp7XCIkXCI6MH0sXCJ4bi0tZ2lsZGVza2wtZzBhXCI6e1wiJFwiOjB9LFwiZ2lza2VcIjp7XCIkXCI6MH0sXCJnamVtbmVzXCI6e1wiJFwiOjB9LFwiZ2plcmRydW1cIjp7XCIkXCI6MH0sXCJnamVyc3RhZFwiOntcIiRcIjowfSxcImdqZXNkYWxcIjp7XCIkXCI6MH0sXCJnam92aWtcIjp7XCIkXCI6MH0sXCJ4bi0tZ2p2aWstd3VhXCI6e1wiJFwiOjB9LFwiZ2xvcHBlblwiOntcIiRcIjowfSxcImdvbFwiOntcIiRcIjowfSxcImdyYW5cIjp7XCIkXCI6MH0sXCJncmFuZVwiOntcIiRcIjowfSxcImdyYW52aW5cIjp7XCIkXCI6MH0sXCJncmF0YW5nZW5cIjp7XCIkXCI6MH0sXCJncmltc3RhZFwiOntcIiRcIjowfSxcImdyb25nXCI6e1wiJFwiOjB9LFwia3JhYW5naGtlXCI6e1wiJFwiOjB9LFwieG4tLWtyYW5naGtlLWIwYVwiOntcIiRcIjowfSxcImdydWVcIjp7XCIkXCI6MH0sXCJndWxlblwiOntcIiRcIjowfSxcImhhZHNlbFwiOntcIiRcIjowfSxcImhhbGRlblwiOntcIiRcIjowfSxcImhhbHNhXCI6e1wiJFwiOjB9LFwiaGFtYXJcIjp7XCIkXCI6MH0sXCJoYW1hcm95XCI6e1wiJFwiOjB9LFwiaGFibWVyXCI6e1wiJFwiOjB9LFwieG4tLWhibWVyLXhxYVwiOntcIiRcIjowfSxcImhhcG1pclwiOntcIiRcIjowfSxcInhuLS1ocG1pci14cWFcIjp7XCIkXCI6MH0sXCJoYW1tZXJmZXN0XCI6e1wiJFwiOjB9LFwiaGFtbWFyZmVhc3RhXCI6e1wiJFwiOjB9LFwieG4tLWhtbXJmZWFzdGEtczRhY1wiOntcIiRcIjowfSxcImhhcmFtXCI6e1wiJFwiOjB9LFwiaGFyZWlkXCI6e1wiJFwiOjB9LFwiaGFyc3RhZFwiOntcIiRcIjowfSxcImhhc3Zpa1wiOntcIiRcIjowfSxcImFrbm9sdW9rdGFcIjp7XCIkXCI6MH0sXCJ4bi0ta29sdW9rdGEtN3lhNTdoXCI6e1wiJFwiOjB9LFwiaGF0dGZqZWxsZGFsXCI6e1wiJFwiOjB9LFwiYWFyYm9ydGVcIjp7XCIkXCI6MH0sXCJoYXVnZXN1bmRcIjp7XCIkXCI6MH0sXCJoZW1uZVwiOntcIiRcIjowfSxcImhlbW5lc1wiOntcIiRcIjowfSxcImhlbXNlZGFsXCI6e1wiJFwiOjB9LFwibW9yZS1vZy1yb21zZGFsXCI6e1wiaGVyb3lcIjp7XCIkXCI6MH0sXCJzYW5kZVwiOntcIiRcIjowfX0sXCJ4bi0tbXJlLW9nLXJvbXNkYWwtcXFiXCI6e1wieG4tLWhlcnktaXJhXCI6e1wiJFwiOjB9LFwic2FuZGVcIjp7XCIkXCI6MH19LFwiaGl0cmFcIjp7XCIkXCI6MH0sXCJoamFydGRhbFwiOntcIiRcIjowfSxcImhqZWxtZWxhbmRcIjp7XCIkXCI6MH0sXCJob2JvbFwiOntcIiRcIjowfSxcInhuLS1ob2JsLWlyYVwiOntcIiRcIjowfSxcImhvZlwiOntcIiRcIjowfSxcImhvbFwiOntcIiRcIjowfSxcImhvbGVcIjp7XCIkXCI6MH0sXCJob2xtZXN0cmFuZFwiOntcIiRcIjowfSxcImhvbHRhbGVuXCI6e1wiJFwiOjB9LFwieG4tLWhvbHRsZW4taHhhXCI6e1wiJFwiOjB9LFwiaG9ybmluZGFsXCI6e1wiJFwiOjB9LFwiaG9ydGVuXCI6e1wiJFwiOjB9LFwiaHVyZGFsXCI6e1wiJFwiOjB9LFwiaHVydW1cIjp7XCIkXCI6MH0sXCJodmFsZXJcIjp7XCIkXCI6MH0sXCJoeWxsZXN0YWRcIjp7XCIkXCI6MH0sXCJoYWdlYm9zdGFkXCI6e1wiJFwiOjB9LFwieG4tLWhnZWJvc3RhZC1nM2FcIjp7XCIkXCI6MH0sXCJob3lhbmdlclwiOntcIiRcIjowfSxcInhuLS1oeWFuZ2VyLXExYVwiOntcIiRcIjowfSxcImhveWxhbmRldFwiOntcIiRcIjowfSxcInhuLS1oeWxhbmRldC01NGFcIjp7XCIkXCI6MH0sXCJoYVwiOntcIiRcIjowfSxcInhuLS1oLTJmYVwiOntcIiRcIjowfSxcImliZXN0YWRcIjp7XCIkXCI6MH0sXCJpbmRlcm95XCI6e1wiJFwiOjB9LFwieG4tLWluZGVyeS1meWFcIjp7XCIkXCI6MH0sXCJpdmVsYW5kXCI6e1wiJFwiOjB9LFwiamV2bmFrZXJcIjp7XCIkXCI6MH0sXCJqb25kYWxcIjp7XCIkXCI6MH0sXCJqb2xzdGVyXCI6e1wiJFwiOjB9LFwieG4tLWpsc3Rlci1ieWFcIjp7XCIkXCI6MH0sXCJrYXJhc2pva1wiOntcIiRcIjowfSxcImthcmFzam9oa2FcIjp7XCIkXCI6MH0sXCJ4bi0ta3Jqb2hrYS1od2FiNDlqXCI6e1wiJFwiOjB9LFwia2FybHNveVwiOntcIiRcIjowfSxcImdhbHNhXCI6e1wiJFwiOjB9LFwieG4tLWdscy1lbGFjXCI6e1wiJFwiOjB9LFwia2FybW95XCI6e1wiJFwiOjB9LFwieG4tLWthcm15LXl1YVwiOntcIiRcIjowfSxcImthdXRva2Vpbm9cIjp7XCIkXCI6MH0sXCJndW92ZGFnZWFpZG51XCI6e1wiJFwiOjB9LFwia2xlcHBcIjp7XCIkXCI6MH0sXCJrbGFidVwiOntcIiRcIjowfSxcInhuLS1rbGJ1LXdvYVwiOntcIiRcIjowfSxcImtvbmdzYmVyZ1wiOntcIiRcIjowfSxcImtvbmdzdmluZ2VyXCI6e1wiJFwiOjB9LFwia3JhZ2Vyb1wiOntcIiRcIjowfSxcInhuLS1rcmFnZXItZ3lhXCI6e1wiJFwiOjB9LFwia3Jpc3RpYW5zYW5kXCI6e1wiJFwiOjB9LFwia3Jpc3RpYW5zdW5kXCI6e1wiJFwiOjB9LFwia3JvZHNoZXJhZFwiOntcIiRcIjowfSxcInhuLS1rcmRzaGVyYWQtbThhXCI6e1wiJFwiOjB9LFwia3ZhbHN1bmRcIjp7XCIkXCI6MH0sXCJyYWhra2VyYXZqdVwiOntcIiRcIjowfSxcInhuLS1yaGtrZXJ2anUtMDFhZlwiOntcIiRcIjowfSxcImt2YW1cIjp7XCIkXCI6MH0sXCJrdmluZXNkYWxcIjp7XCIkXCI6MH0sXCJrdmlubmhlcmFkXCI6e1wiJFwiOjB9LFwia3ZpdGVzZWlkXCI6e1wiJFwiOjB9LFwia3ZpdHNveVwiOntcIiRcIjowfSxcInhuLS1rdml0c3ktZnlhXCI6e1wiJFwiOjB9LFwia3ZhZmpvcmRcIjp7XCIkXCI6MH0sXCJ4bi0ta3Zmam9yZC1ueGFcIjp7XCIkXCI6MH0sXCJnaWVodGF2dW9hdG5hXCI6e1wiJFwiOjB9LFwia3ZhbmFuZ2VuXCI6e1wiJFwiOjB9LFwieG4tLWt2bmFuZ2VuLWswYVwiOntcIiRcIjowfSxcIm5hdnVvdG5hXCI6e1wiJFwiOjB9LFwieG4tLW52dW90bmEtaHdhXCI6e1wiJFwiOjB9LFwia2Fmam9yZFwiOntcIiRcIjowfSxcInhuLS1rZmpvcmQtaXVhXCI6e1wiJFwiOjB9LFwiZ2FpdnVvdG5hXCI6e1wiJFwiOjB9LFwieG4tLWdpdnVvdG5hLTh5YVwiOntcIiRcIjowfSxcImxhcnZpa1wiOntcIiRcIjowfSxcImxhdmFuZ2VuXCI6e1wiJFwiOjB9LFwibGF2YWdpc1wiOntcIiRcIjowfSxcImxvYWJhdFwiOntcIiRcIjowfSxcInhuLS1sb2FidC0wcWFcIjp7XCIkXCI6MH0sXCJsZWJlc2J5XCI6e1wiJFwiOjB9LFwiZGF2dmVzaWlkYVwiOntcIiRcIjowfSxcImxlaWthbmdlclwiOntcIiRcIjowfSxcImxlaXJmam9yZFwiOntcIiRcIjowfSxcImxla2FcIjp7XCIkXCI6MH0sXCJsZWtzdmlrXCI6e1wiJFwiOjB9LFwibGVudmlrXCI6e1wiJFwiOjB9LFwibGVhbmdhdmlpa2FcIjp7XCIkXCI6MH0sXCJ4bi0tbGVhZ2F2aWlrYS01MmJcIjp7XCIkXCI6MH0sXCJsZXNqYVwiOntcIiRcIjowfSxcImxldmFuZ2VyXCI6e1wiJFwiOjB9LFwibGllclwiOntcIiRcIjowfSxcImxpZXJuZVwiOntcIiRcIjowfSxcImxpbGxlaGFtbWVyXCI6e1wiJFwiOjB9LFwibGlsbGVzYW5kXCI6e1wiJFwiOjB9LFwibGluZGVzbmVzXCI6e1wiJFwiOjB9LFwibGluZGFzXCI6e1wiJFwiOjB9LFwieG4tLWxpbmRzLXByYVwiOntcIiRcIjowfSxcImxvbVwiOntcIiRcIjowfSxcImxvcHBhXCI6e1wiJFwiOjB9LFwibGFocHBpXCI6e1wiJFwiOjB9LFwieG4tLWxocHBpLXhxYVwiOntcIiRcIjowfSxcImx1bmRcIjp7XCIkXCI6MH0sXCJsdW5uZXJcIjp7XCIkXCI6MH0sXCJsdXJveVwiOntcIiRcIjowfSxcInhuLS1sdXJ5LWlyYVwiOntcIiRcIjowfSxcImx1c3RlclwiOntcIiRcIjowfSxcImx5bmdkYWxcIjp7XCIkXCI6MH0sXCJseW5nZW5cIjp7XCIkXCI6MH0sXCJpdmd1XCI6e1wiJFwiOjB9LFwibGFyZGFsXCI6e1wiJFwiOjB9LFwibGVyZGFsXCI6e1wiJFwiOjB9LFwieG4tLWxyZGFsLXNyYVwiOntcIiRcIjowfSxcImxvZGluZ2VuXCI6e1wiJFwiOjB9LFwieG4tLWxkaW5nZW4tcTFhXCI6e1wiJFwiOjB9LFwibG9yZW5za29nXCI6e1wiJFwiOjB9LFwieG4tLWxyZW5za29nLTU0YVwiOntcIiRcIjowfSxcImxvdGVuXCI6e1wiJFwiOjB9LFwieG4tLWx0ZW4tZ3JhXCI6e1wiJFwiOjB9LFwibWFsdmlrXCI6e1wiJFwiOjB9LFwibWFzb3lcIjp7XCIkXCI6MH0sXCJ4bi0tbXN5LXVsYTBoXCI6e1wiJFwiOjB9LFwibXVvc2F0XCI6e1wiJFwiOjB9LFwieG4tLW11b3N0LTBxYVwiOntcIiRcIjowfSxcIm1hbmRhbFwiOntcIiRcIjowfSxcIm1hcmtlclwiOntcIiRcIjowfSxcIm1hcm5hcmRhbFwiOntcIiRcIjowfSxcIm1hc2Zqb3JkZW5cIjp7XCIkXCI6MH0sXCJtZWxhbmRcIjp7XCIkXCI6MH0sXCJtZWxkYWxcIjp7XCIkXCI6MH0sXCJtZWxodXNcIjp7XCIkXCI6MH0sXCJtZWxveVwiOntcIiRcIjowfSxcInhuLS1tZWx5LWlyYVwiOntcIiRcIjowfSxcIm1lcmFrZXJcIjp7XCIkXCI6MH0sXCJ4bi0tbWVya2VyLWt1YVwiOntcIiRcIjowfSxcIm1vYXJla2VcIjp7XCIkXCI6MH0sXCJ4bi0tbW9yZWtlLWp1YVwiOntcIiRcIjowfSxcIm1pZHN1bmRcIjp7XCIkXCI6MH0sXCJtaWR0cmUtZ2F1bGRhbFwiOntcIiRcIjowfSxcIm1vZGFsZW5cIjp7XCIkXCI6MH0sXCJtb2R1bVwiOntcIiRcIjowfSxcIm1vbGRlXCI6e1wiJFwiOjB9LFwibW9za2VuZXNcIjp7XCIkXCI6MH0sXCJtb3NzXCI6e1wiJFwiOjB9LFwibW9zdmlrXCI6e1wiJFwiOjB9LFwibWFsc2VsdlwiOntcIiRcIjowfSxcInhuLS1tbHNlbHYtaXVhXCI6e1wiJFwiOjB9LFwibWFsYXR2dW9wbWlcIjp7XCIkXCI6MH0sXCJ4bi0tbWxhdHZ1b3BtaS1zNGFcIjp7XCIkXCI6MH0sXCJuYW1kYWxzZWlkXCI6e1wiJFwiOjB9LFwiYWVqcmllXCI6e1wiJFwiOjB9LFwibmFtc29zXCI6e1wiJFwiOjB9LFwibmFtc3Nrb2dhblwiOntcIiRcIjowfSxcIm5hYW1lc2pldnVlbWllXCI6e1wiJFwiOjB9LFwieG4tLW5tZXNqZXZ1ZW1pZS10Y2JhXCI6e1wiJFwiOjB9LFwibGFha2VzdnVlbWllXCI6e1wiJFwiOjB9LFwibmFubmVzdGFkXCI6e1wiJFwiOjB9LFwibmFydmlrXCI6e1wiJFwiOjB9LFwibmFydmlpa2FcIjp7XCIkXCI6MH0sXCJuYXVzdGRhbFwiOntcIiRcIjowfSxcIm5lZHJlLWVpa2VyXCI6e1wiJFwiOjB9LFwiYWtlcnNodXNcIjp7XCJuZXNcIjp7XCIkXCI6MH19LFwiYnVza2VydWRcIjp7XCJuZXNcIjp7XCIkXCI6MH19LFwibmVzbmFcIjp7XCIkXCI6MH0sXCJuZXNvZGRlblwiOntcIiRcIjowfSxcIm5lc3NlYnlcIjp7XCIkXCI6MH0sXCJ1bmphcmdhXCI6e1wiJFwiOjB9LFwieG4tLXVuanJnYS1ydGFcIjp7XCIkXCI6MH0sXCJuZXNzZXRcIjp7XCIkXCI6MH0sXCJuaXNzZWRhbFwiOntcIiRcIjowfSxcIm5pdHRlZGFsXCI6e1wiJFwiOjB9LFwibm9yZC1hdXJkYWxcIjp7XCIkXCI6MH0sXCJub3JkLWZyb25cIjp7XCIkXCI6MH0sXCJub3JkLW9kYWxcIjp7XCIkXCI6MH0sXCJub3JkZGFsXCI6e1wiJFwiOjB9LFwibm9yZGthcHBcIjp7XCIkXCI6MH0sXCJkYXZ2ZW5qYXJnYVwiOntcIiRcIjowfSxcInhuLS1kYXZ2ZW5qcmdhLXk0YVwiOntcIiRcIjowfSxcIm5vcmRyZS1sYW5kXCI6e1wiJFwiOjB9LFwibm9yZHJlaXNhXCI6e1wiJFwiOjB9LFwicmFpc2FcIjp7XCIkXCI6MH0sXCJ4bi0tcmlzYS01bmFcIjp7XCIkXCI6MH0sXCJub3JlLW9nLXV2ZGFsXCI6e1wiJFwiOjB9LFwibm90b2RkZW5cIjp7XCIkXCI6MH0sXCJuYXJveVwiOntcIiRcIjowfSxcInhuLS1ucnkteWxhNWdcIjp7XCIkXCI6MH0sXCJub3R0ZXJveVwiOntcIiRcIjowfSxcInhuLS1udHRlcnktYnlhZVwiOntcIiRcIjowfSxcIm9kZGFcIjp7XCIkXCI6MH0sXCJva3NuZXNcIjp7XCIkXCI6MH0sXCJ4bi0ta3NuZXMtdXVhXCI6e1wiJFwiOjB9LFwib3BwZGFsXCI6e1wiJFwiOjB9LFwib3BwZWdhcmRcIjp7XCIkXCI6MH0sXCJ4bi0tb3BwZWdyZC1peGFcIjp7XCIkXCI6MH0sXCJvcmtkYWxcIjp7XCIkXCI6MH0sXCJvcmxhbmRcIjp7XCIkXCI6MH0sXCJ4bi0tcmxhbmQtdXVhXCI6e1wiJFwiOjB9LFwib3Jza29nXCI6e1wiJFwiOjB9LFwieG4tLXJza29nLXV1YVwiOntcIiRcIjowfSxcIm9yc3RhXCI6e1wiJFwiOjB9LFwieG4tLXJzdGEtZnJhXCI6e1wiJFwiOjB9LFwiaGVkbWFya1wiOntcIm9zXCI6e1wiJFwiOjB9LFwidmFsZXJcIjp7XCIkXCI6MH0sXCJ4bi0tdmxlci1xb2FcIjp7XCIkXCI6MH19LFwiaG9yZGFsYW5kXCI6e1wib3NcIjp7XCIkXCI6MH19LFwib3NlblwiOntcIiRcIjowfSxcIm9zdGVyb3lcIjp7XCIkXCI6MH0sXCJ4bi0tb3N0ZXJ5LWZ5YVwiOntcIiRcIjowfSxcIm9zdHJlLXRvdGVuXCI6e1wiJFwiOjB9LFwieG4tLXN0cmUtdG90ZW4temNiXCI6e1wiJFwiOjB9LFwib3ZlcmhhbGxhXCI6e1wiJFwiOjB9LFwib3ZyZS1laWtlclwiOntcIiRcIjowfSxcInhuLS12cmUtZWlrZXItazhhXCI6e1wiJFwiOjB9LFwib3llclwiOntcIiRcIjowfSxcInhuLS15ZXItem5hXCI6e1wiJFwiOjB9LFwib3lnYXJkZW5cIjp7XCIkXCI6MH0sXCJ4bi0teWdhcmRlbi1wMWFcIjp7XCIkXCI6MH0sXCJveXN0cmUtc2xpZHJlXCI6e1wiJFwiOjB9LFwieG4tLXlzdHJlLXNsaWRyZS11amJcIjp7XCIkXCI6MH0sXCJwb3JzYW5nZXJcIjp7XCIkXCI6MH0sXCJwb3JzYW5ndVwiOntcIiRcIjowfSxcInhuLS1wb3JzZ3Utc3RhMjZmXCI6e1wiJFwiOjB9LFwicG9yc2dydW5uXCI6e1wiJFwiOjB9LFwicmFkb3lcIjp7XCIkXCI6MH0sXCJ4bi0tcmFkeS1pcmFcIjp7XCIkXCI6MH0sXCJyYWtrZXN0YWRcIjp7XCIkXCI6MH0sXCJyYW5hXCI6e1wiJFwiOjB9LFwicnVvdmF0XCI6e1wiJFwiOjB9LFwicmFuZGFiZXJnXCI6e1wiJFwiOjB9LFwicmF1bWFcIjp7XCIkXCI6MH0sXCJyZW5kYWxlblwiOntcIiRcIjowfSxcInJlbm5lYnVcIjp7XCIkXCI6MH0sXCJyZW5uZXNveVwiOntcIiRcIjowfSxcInhuLS1yZW5uZXN5LXYxYVwiOntcIiRcIjowfSxcInJpbmRhbFwiOntcIiRcIjowfSxcInJpbmdlYnVcIjp7XCIkXCI6MH0sXCJyaW5nZXJpa2VcIjp7XCIkXCI6MH0sXCJyaW5nc2FrZXJcIjp7XCIkXCI6MH0sXCJyaXNzYVwiOntcIiRcIjowfSxcInJpc29yXCI6e1wiJFwiOjB9LFwieG4tLXJpc3ItaXJhXCI6e1wiJFwiOjB9LFwicm9hblwiOntcIiRcIjowfSxcInJvbGxhZ1wiOntcIiRcIjowfSxcInJ5Z2dlXCI6e1wiJFwiOjB9LFwicmFsaW5nZW5cIjp7XCIkXCI6MH0sXCJ4bi0tcmxpbmdlbi1teGFcIjp7XCIkXCI6MH0sXCJyb2RveVwiOntcIiRcIjowfSxcInhuLS1yZHktMG5hYlwiOntcIiRcIjowfSxcInJvbXNrb2dcIjp7XCIkXCI6MH0sXCJ4bi0tcm1za29nLWJ5YVwiOntcIiRcIjowfSxcInJvcm9zXCI6e1wiJFwiOjB9LFwieG4tLXJyb3MtZ3JhXCI6e1wiJFwiOjB9LFwicm9zdFwiOntcIiRcIjowfSxcInhuLS1yc3QtMG5hXCI6e1wiJFwiOjB9LFwicm95a2VuXCI6e1wiJFwiOjB9LFwieG4tLXJ5a2VuLXZ1YVwiOntcIiRcIjowfSxcInJveXJ2aWtcIjp7XCIkXCI6MH0sXCJ4bi0tcnlydmlrLWJ5YVwiOntcIiRcIjowfSxcInJhZGVcIjp7XCIkXCI6MH0sXCJ4bi0tcmRlLXVsYVwiOntcIiRcIjowfSxcInNhbGFuZ2VuXCI6e1wiJFwiOjB9LFwic2llbGxha1wiOntcIiRcIjowfSxcInNhbHRkYWxcIjp7XCIkXCI6MH0sXCJzYWxhdFwiOntcIiRcIjowfSxcInhuLS1zbHQtZWxhYlwiOntcIiRcIjowfSxcInhuLS1zbGF0LTVuYVwiOntcIiRcIjowfSxcInNhbW5hbmdlclwiOntcIiRcIjowfSxcInZlc3Rmb2xkXCI6e1wic2FuZGVcIjp7XCIkXCI6MH19LFwic2FuZGVmam9yZFwiOntcIiRcIjowfSxcInNhbmRuZXNcIjp7XCIkXCI6MH0sXCJzYW5kb3lcIjp7XCIkXCI6MH0sXCJ4bi0tc2FuZHkteXVhXCI6e1wiJFwiOjB9LFwic2FycHNib3JnXCI6e1wiJFwiOjB9LFwic2F1ZGFcIjp7XCIkXCI6MH0sXCJzYXVoZXJhZFwiOntcIiRcIjowfSxcInNlbFwiOntcIiRcIjowfSxcInNlbGJ1XCI6e1wiJFwiOjB9LFwic2VsamVcIjp7XCIkXCI6MH0sXCJzZWxqb3JkXCI6e1wiJFwiOjB9LFwic2lnZGFsXCI6e1wiJFwiOjB9LFwic2lsamFuXCI6e1wiJFwiOjB9LFwic2lyZGFsXCI6e1wiJFwiOjB9LFwic2thdW5cIjp7XCIkXCI6MH0sXCJza2Vkc21vXCI6e1wiJFwiOjB9LFwic2tpXCI6e1wiJFwiOjB9LFwic2tpZW5cIjp7XCIkXCI6MH0sXCJza2lwdHZldFwiOntcIiRcIjowfSxcInNramVydm95XCI6e1wiJFwiOjB9LFwieG4tLXNramVydnktdjFhXCI6e1wiJFwiOjB9LFwic2tpZXJ2YVwiOntcIiRcIjowfSxcInhuLS1za2llcnYtdXRhXCI6e1wiJFwiOjB9LFwic2tqYWtcIjp7XCIkXCI6MH0sXCJ4bi0tc2tqay1zb2FcIjp7XCIkXCI6MH0sXCJza29kamVcIjp7XCIkXCI6MH0sXCJza2FubGFuZFwiOntcIiRcIjowfSxcInhuLS1za25sYW5kLWZ4YVwiOntcIiRcIjowfSxcInNrYW5pdFwiOntcIiRcIjowfSxcInhuLS1za25pdC15cWFcIjp7XCIkXCI6MH0sXCJzbW9sYVwiOntcIiRcIjowfSxcInhuLS1zbWxhLWhyYVwiOntcIiRcIjowfSxcInNuaWxsZmpvcmRcIjp7XCIkXCI6MH0sXCJzbmFzYVwiOntcIiRcIjowfSxcInhuLS1zbnNhLXJvYVwiOntcIiRcIjowfSxcInNub2FzYVwiOntcIiRcIjowfSxcInNuYWFzZVwiOntcIiRcIjowfSxcInhuLS1zbmFzZS1ucmFcIjp7XCIkXCI6MH0sXCJzb2duZGFsXCI6e1wiJFwiOjB9LFwic29rbmRhbFwiOntcIiRcIjowfSxcInNvbGFcIjp7XCIkXCI6MH0sXCJzb2x1bmRcIjp7XCIkXCI6MH0sXCJzb25nZGFsZW5cIjp7XCIkXCI6MH0sXCJzb3J0bGFuZFwiOntcIiRcIjowfSxcInNweWRlYmVyZ1wiOntcIiRcIjowfSxcInN0YW5nZVwiOntcIiRcIjowfSxcInN0YXZhbmdlclwiOntcIiRcIjowfSxcInN0ZWlnZW5cIjp7XCIkXCI6MH0sXCJzdGVpbmtqZXJcIjp7XCIkXCI6MH0sXCJzdGpvcmRhbFwiOntcIiRcIjowfSxcInhuLS1zdGpyZGFsLXMxYVwiOntcIiRcIjowfSxcInN0b2trZVwiOntcIiRcIjowfSxcInN0b3ItZWx2ZGFsXCI6e1wiJFwiOjB9LFwic3RvcmRcIjp7XCIkXCI6MH0sXCJzdG9yZGFsXCI6e1wiJFwiOjB9LFwic3RvcmZqb3JkXCI6e1wiJFwiOjB9LFwib21hc3Z1b3RuYVwiOntcIiRcIjowfSxcInN0cmFuZFwiOntcIiRcIjowfSxcInN0cmFuZGFcIjp7XCIkXCI6MH0sXCJzdHJ5blwiOntcIiRcIjowfSxcInN1bGFcIjp7XCIkXCI6MH0sXCJzdWxkYWxcIjp7XCIkXCI6MH0sXCJzdW5kXCI6e1wiJFwiOjB9LFwic3VubmRhbFwiOntcIiRcIjowfSxcInN1cm5hZGFsXCI6e1wiJFwiOjB9LFwic3ZlaW9cIjp7XCIkXCI6MH0sXCJzdmVsdmlrXCI6e1wiJFwiOjB9LFwic3lra3lsdmVuXCI6e1wiJFwiOjB9LFwic29nbmVcIjp7XCIkXCI6MH0sXCJ4bi0tc2duZS1ncmFcIjp7XCIkXCI6MH0sXCJzb21uYVwiOntcIiRcIjowfSxcInhuLS1zbW5hLWdyYVwiOntcIiRcIjowfSxcInNvbmRyZS1sYW5kXCI6e1wiJFwiOjB9LFwieG4tLXNuZHJlLWxhbmQtMGNiXCI6e1wiJFwiOjB9LFwic29yLWF1cmRhbFwiOntcIiRcIjowfSxcInhuLS1zci1hdXJkYWwtbDhhXCI6e1wiJFwiOjB9LFwic29yLWZyb25cIjp7XCIkXCI6MH0sXCJ4bi0tc3ItZnJvbi1xMWFcIjp7XCIkXCI6MH0sXCJzb3Itb2RhbFwiOntcIiRcIjowfSxcInhuLS1zci1vZGFsLXExYVwiOntcIiRcIjowfSxcInNvci12YXJhbmdlclwiOntcIiRcIjowfSxcInhuLS1zci12YXJhbmdlci1nZ2JcIjp7XCIkXCI6MH0sXCJtYXR0YS12YXJqamF0XCI6e1wiJFwiOjB9LFwieG4tLW10dGEtdnJqamF0LWs3YWZcIjp7XCIkXCI6MH0sXCJzb3Jmb2xkXCI6e1wiJFwiOjB9LFwieG4tLXNyZm9sZC1ieWFcIjp7XCIkXCI6MH0sXCJzb3JyZWlzYVwiOntcIiRcIjowfSxcInhuLS1zcnJlaXNhLXExYVwiOntcIiRcIjowfSxcInNvcnVtXCI6e1wiJFwiOjB9LFwieG4tLXNydW0tZ3JhXCI6e1wiJFwiOjB9LFwidGFuYVwiOntcIiRcIjowfSxcImRlYXRudVwiOntcIiRcIjowfSxcInRpbWVcIjp7XCIkXCI6MH0sXCJ0aW5ndm9sbFwiOntcIiRcIjowfSxcInRpbm5cIjp7XCIkXCI6MH0sXCJ0amVsZHN1bmRcIjp7XCIkXCI6MH0sXCJkaWVsZGRhbnVvcnJpXCI6e1wiJFwiOjB9LFwidGpvbWVcIjp7XCIkXCI6MH0sXCJ4bi0tdGptZS1ocmFcIjp7XCIkXCI6MH0sXCJ0b2trZVwiOntcIiRcIjowfSxcInRvbGdhXCI6e1wiJFwiOjB9LFwidG9yc2tlblwiOntcIiRcIjowfSxcInRyYW5veVwiOntcIiRcIjowfSxcInhuLS10cmFueS15dWFcIjp7XCIkXCI6MH0sXCJ0cm9tc29cIjp7XCIkXCI6MH0sXCJ4bi0tdHJvbXMtenVhXCI6e1wiJFwiOjB9LFwidHJvbXNhXCI6e1wiJFwiOjB9LFwicm9tc2FcIjp7XCIkXCI6MH0sXCJ0cm9uZGhlaW1cIjp7XCIkXCI6MH0sXCJ0cm9hbmRpblwiOntcIiRcIjowfSxcInRyeXNpbFwiOntcIiRcIjowfSxcInRyYW5hXCI6e1wiJFwiOjB9LFwieG4tLXRybmEtd29hXCI6e1wiJFwiOjB9LFwidHJvZ3N0YWRcIjp7XCIkXCI6MH0sXCJ4bi0tdHJnc3RhZC1yMWFcIjp7XCIkXCI6MH0sXCJ0dmVkZXN0cmFuZFwiOntcIiRcIjowfSxcInR5ZGFsXCI6e1wiJFwiOjB9LFwidHluc2V0XCI6e1wiJFwiOjB9LFwidHlzZmpvcmRcIjp7XCIkXCI6MH0sXCJkaXZ0YXN2dW9kbmFcIjp7XCIkXCI6MH0sXCJkaXZ0dGFzdnVvdG5hXCI6e1wiJFwiOjB9LFwidHlzbmVzXCI6e1wiJFwiOjB9LFwidHlzdmFyXCI6e1wiJFwiOjB9LFwieG4tLXR5c3ZyLXZyYVwiOntcIiRcIjowfSxcInRvbnNiZXJnXCI6e1wiJFwiOjB9LFwieG4tLXRuc2JlcmctcTFhXCI6e1wiJFwiOjB9LFwidWxsZW5zYWtlclwiOntcIiRcIjowfSxcInVsbGVuc3ZhbmdcIjp7XCIkXCI6MH0sXCJ1bHZpa1wiOntcIiRcIjowfSxcInV0c2lyYVwiOntcIiRcIjowfSxcInZhZHNvXCI6e1wiJFwiOjB9LFwieG4tLXZhZHMtanJhXCI6e1wiJFwiOjB9LFwiY2FoY2VzdW9sb1wiOntcIiRcIjowfSxcInhuLS1oY2VzdW9sby03eWEzNWJcIjp7XCIkXCI6MH0sXCJ2YWtzZGFsXCI6e1wiJFwiOjB9LFwidmFsbGVcIjp7XCIkXCI6MH0sXCJ2YW5nXCI6e1wiJFwiOjB9LFwidmFueWx2ZW5cIjp7XCIkXCI6MH0sXCJ2YXJkb1wiOntcIiRcIjowfSxcInhuLS12YXJkLWpyYVwiOntcIiRcIjowfSxcInZhcmdnYXRcIjp7XCIkXCI6MH0sXCJ4bi0tdnJnZ3QteHFhZFwiOntcIiRcIjowfSxcInZlZnNuXCI6e1wiJFwiOjB9LFwidmFhcHN0ZVwiOntcIiRcIjowfSxcInZlZ2FcIjp7XCIkXCI6MH0sXCJ2ZWdhcnNoZWlcIjp7XCIkXCI6MH0sXCJ4bi0tdmVncnNoZWktYzBhXCI6e1wiJFwiOjB9LFwidmVubmVzbGFcIjp7XCIkXCI6MH0sXCJ2ZXJkYWxcIjp7XCIkXCI6MH0sXCJ2ZXJyYW5cIjp7XCIkXCI6MH0sXCJ2ZXN0YnlcIjp7XCIkXCI6MH0sXCJ2ZXN0bmVzXCI6e1wiJFwiOjB9LFwidmVzdHJlLXNsaWRyZVwiOntcIiRcIjowfSxcInZlc3RyZS10b3RlblwiOntcIiRcIjowfSxcInZlc3R2YWdveVwiOntcIiRcIjowfSxcInhuLS12ZXN0dmd5LWl4YTZvXCI6e1wiJFwiOjB9LFwidmV2ZWxzdGFkXCI6e1wiJFwiOjB9LFwidmlrXCI6e1wiJFwiOjB9LFwidmlrbmFcIjp7XCIkXCI6MH0sXCJ2aW5kYWZqb3JkXCI6e1wiJFwiOjB9LFwidm9sZGFcIjp7XCIkXCI6MH0sXCJ2b3NzXCI6e1wiJFwiOjB9LFwidmFyb3lcIjp7XCIkXCI6MH0sXCJ4bi0tdnJ5LXlsYTVnXCI6e1wiJFwiOjB9LFwidmFnYW5cIjp7XCIkXCI6MH0sXCJ4bi0tdmdhbi1xb2FcIjp7XCIkXCI6MH0sXCJ2b2FnYXRcIjp7XCIkXCI6MH0sXCJ2YWdzb3lcIjp7XCIkXCI6MH0sXCJ4bi0tdmdzeS1xb2EwalwiOntcIiRcIjowfSxcInZhZ2FcIjp7XCIkXCI6MH0sXCJ4bi0tdmcteWlhYlwiOntcIiRcIjowfSxcIm9zdGZvbGRcIjp7XCJ2YWxlclwiOntcIiRcIjowfX0sXCJ4bi0tc3Rmb2xkLTl4YVwiOntcInhuLS12bGVyLXFvYVwiOntcIiRcIjowfX0sXCJjb1wiOntcIiRcIjowfSxcImJsb2dzcG90XCI6e1wiJFwiOjB9fSxcIm5wXCI6e1wiKlwiOntcIiRcIjowfX0sXCJuclwiOntcIiRcIjowLFwiYml6XCI6e1wiJFwiOjB9LFwiaW5mb1wiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfX0sXCJudVwiOntcIiRcIjowLFwibWVyc2VpbmVcIjp7XCIkXCI6MH0sXCJtaW5lXCI6e1wiJFwiOjB9LFwic2hhY2tuZXRcIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH19LFwibnpcIjp7XCIkXCI6MCxcImFjXCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MCxcImJsb2dzcG90XCI6e1wiJFwiOjB9fSxcImNyaVwiOntcIiRcIjowfSxcImdlZWtcIjp7XCIkXCI6MH0sXCJnZW5cIjp7XCIkXCI6MH0sXCJnb3Z0XCI6e1wiJFwiOjB9LFwiaGVhbHRoXCI6e1wiJFwiOjB9LFwiaXdpXCI6e1wiJFwiOjB9LFwia2l3aVwiOntcIiRcIjowfSxcIm1hb3JpXCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwieG4tLW1vcmktcXNhXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwicGFybGlhbWVudFwiOntcIiRcIjowfSxcInNjaG9vbFwiOntcIiRcIjowfSxcIm55bVwiOntcIiRcIjowfX0sXCJvbVwiOntcIiRcIjowLFwiY29cIjp7XCIkXCI6MH0sXCJjb21cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJtZWRcIjp7XCIkXCI6MH0sXCJtdXNldW1cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJwcm9cIjp7XCIkXCI6MH19LFwib25pb25cIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MCxcImFtdW5lXCI6e1widGVsZVwiOntcIiRcIjowfX0sXCJwaW1pZW50YVwiOntcIiRcIjowfSxcInBvaXZyb25cIjp7XCIkXCI6MH0sXCJwb3RhZ2VyXCI6e1wiJFwiOjB9LFwic3dlZXRwZXBwZXJcIjp7XCIkXCI6MH0sXCJhZVwiOntcIiRcIjowfSxcInVzXCI6e1wiJFwiOjB9LFwiY2VydG1nclwiOntcIiRcIjowfSxcImNkbjc3XCI6e1wiY1wiOntcIiRcIjowfSxcInJzY1wiOntcIiRcIjowfX0sXCJjZG43Ny1zZWN1cmVcIjp7XCJvcmlnaW5cIjp7XCJzc2xcIjp7XCIkXCI6MH19fSxcImNsb3VkbnNcIjp7XCIkXCI6MH0sXCJkdWNrZG5zXCI6e1wiJFwiOjB9LFwidHVua1wiOntcIiRcIjowfSxcImR5bmRuc1wiOntcIiRcIjowLFwiZ29cIjp7XCIkXCI6MH0sXCJob21lXCI6e1wiJFwiOjB9fSxcImJsb2dkbnNcIjp7XCIkXCI6MH0sXCJibG9nc2l0ZVwiOntcIiRcIjowfSxcImJvbGRseWdvaW5nbm93aGVyZVwiOntcIiRcIjowfSxcImRuc2FsaWFzXCI6e1wiJFwiOjB9LFwiZG5zZG9qb1wiOntcIiRcIjowfSxcImRvZXNudGV4aXN0XCI6e1wiJFwiOjB9LFwiZG9udGV4aXN0XCI6e1wiJFwiOjB9LFwiZG9vbWRuc1wiOntcIiRcIjowfSxcImR2cmRuc1wiOntcIiRcIjowfSxcImR5bmFsaWFzXCI6e1wiJFwiOjB9LFwiZW5kb2ZpbnRlcm5ldFwiOntcIiRcIjowfSxcImVuZG9mdGhlaW50ZXJuZXRcIjp7XCIkXCI6MH0sXCJmcm9tLW1lXCI6e1wiJFwiOjB9LFwiZ2FtZS1ob3N0XCI6e1wiJFwiOjB9LFwiZ290ZG5zXCI6e1wiJFwiOjB9LFwiaG9iYnktc2l0ZVwiOntcIiRcIjowfSxcImhvbWVkbnNcIjp7XCIkXCI6MH0sXCJob21lZnRwXCI6e1wiJFwiOjB9LFwiaG9tZWxpbnV4XCI6e1wiJFwiOjB9LFwiaG9tZXVuaXhcIjp7XCIkXCI6MH0sXCJpcy1hLWJydWluc2ZhblwiOntcIiRcIjowfSxcImlzLWEtY2FuZGlkYXRlXCI6e1wiJFwiOjB9LFwiaXMtYS1jZWx0aWNzZmFuXCI6e1wiJFwiOjB9LFwiaXMtYS1jaGVmXCI6e1wiJFwiOjB9LFwiaXMtYS1nZWVrXCI6e1wiJFwiOjB9LFwiaXMtYS1rbmlnaHRcIjp7XCIkXCI6MH0sXCJpcy1hLWxpbnV4LXVzZXJcIjp7XCIkXCI6MH0sXCJpcy1hLXBhdHNmYW5cIjp7XCIkXCI6MH0sXCJpcy1hLXNveGZhblwiOntcIiRcIjowfSxcImlzLWZvdW5kXCI6e1wiJFwiOjB9LFwiaXMtbG9zdFwiOntcIiRcIjowfSxcImlzLXNhdmVkXCI6e1wiJFwiOjB9LFwiaXMtdmVyeS1iYWRcIjp7XCIkXCI6MH0sXCJpcy12ZXJ5LWV2aWxcIjp7XCIkXCI6MH0sXCJpcy12ZXJ5LWdvb2RcIjp7XCIkXCI6MH0sXCJpcy12ZXJ5LW5pY2VcIjp7XCIkXCI6MH0sXCJpcy12ZXJ5LXN3ZWV0XCI6e1wiJFwiOjB9LFwiaXNhLWdlZWtcIjp7XCIkXCI6MH0sXCJraWNrcy1hc3NcIjp7XCIkXCI6MH0sXCJtaXNjb25mdXNlZFwiOntcIiRcIjowfSxcInBvZHpvbmVcIjp7XCIkXCI6MH0sXCJyZWFkbXlibG9nXCI6e1wiJFwiOjB9LFwic2VsZmlwXCI6e1wiJFwiOjB9LFwic2VsbHN5b3VyaG9tZVwiOntcIiRcIjowfSxcInNlcnZlYmJzXCI6e1wiJFwiOjB9LFwic2VydmVmdHBcIjp7XCIkXCI6MH0sXCJzZXJ2ZWdhbWVcIjp7XCIkXCI6MH0sXCJzdHVmZi00LXNhbGVcIjp7XCIkXCI6MH0sXCJ3ZWJob3BcIjp7XCIkXCI6MH0sXCJkZG5zc1wiOntcIiRcIjowfSxcImFjY2Vzc2NhbVwiOntcIiRcIjowfSxcImNhbWR2clwiOntcIiRcIjowfSxcImZyZWVkZG5zXCI6e1wiJFwiOjB9LFwibXl3aXJlXCI6e1wiJFwiOjB9LFwid2VicmVkaXJlY3RcIjp7XCIkXCI6MH0sXCJldVwiOntcIiRcIjowLFwiYWxcIjp7XCIkXCI6MH0sXCJhc3NvXCI6e1wiJFwiOjB9LFwiYXRcIjp7XCIkXCI6MH0sXCJhdVwiOntcIiRcIjowfSxcImJlXCI6e1wiJFwiOjB9LFwiYmdcIjp7XCIkXCI6MH0sXCJjYVwiOntcIiRcIjowfSxcImNkXCI6e1wiJFwiOjB9LFwiY2hcIjp7XCIkXCI6MH0sXCJjblwiOntcIiRcIjowfSxcImN5XCI6e1wiJFwiOjB9LFwiY3pcIjp7XCIkXCI6MH0sXCJkZVwiOntcIiRcIjowfSxcImRrXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZWVcIjp7XCIkXCI6MH0sXCJlc1wiOntcIiRcIjowfSxcImZpXCI6e1wiJFwiOjB9LFwiZnJcIjp7XCIkXCI6MH0sXCJnclwiOntcIiRcIjowfSxcImhyXCI6e1wiJFwiOjB9LFwiaHVcIjp7XCIkXCI6MH0sXCJpZVwiOntcIiRcIjowfSxcImlsXCI6e1wiJFwiOjB9LFwiaW5cIjp7XCIkXCI6MH0sXCJpbnRcIjp7XCIkXCI6MH0sXCJpc1wiOntcIiRcIjowfSxcIml0XCI6e1wiJFwiOjB9LFwianBcIjp7XCIkXCI6MH0sXCJrclwiOntcIiRcIjowfSxcImx0XCI6e1wiJFwiOjB9LFwibHVcIjp7XCIkXCI6MH0sXCJsdlwiOntcIiRcIjowfSxcIm1jXCI6e1wiJFwiOjB9LFwibWVcIjp7XCIkXCI6MH0sXCJta1wiOntcIiRcIjowfSxcIm10XCI6e1wiJFwiOjB9LFwibXlcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJuZ1wiOntcIiRcIjowfSxcIm5sXCI6e1wiJFwiOjB9LFwibm9cIjp7XCIkXCI6MH0sXCJuelwiOntcIiRcIjowfSxcInBhcmlzXCI6e1wiJFwiOjB9LFwicGxcIjp7XCIkXCI6MH0sXCJwdFwiOntcIiRcIjowfSxcInEtYVwiOntcIiRcIjowfSxcInJvXCI6e1wiJFwiOjB9LFwicnVcIjp7XCIkXCI6MH0sXCJzZVwiOntcIiRcIjowfSxcInNpXCI6e1wiJFwiOjB9LFwic2tcIjp7XCIkXCI6MH0sXCJ0clwiOntcIiRcIjowfSxcInVrXCI6e1wiJFwiOjB9LFwidXNcIjp7XCIkXCI6MH19LFwidHdtYWlsXCI6e1wiJFwiOjB9LFwiZmVkb3JhaW5mcmFjbG91ZFwiOntcIiRcIjowfSxcImZlZG9yYXBlb3BsZVwiOntcIiRcIjowfSxcImZlZG9yYXByb2plY3RcIjp7XCJjbG91ZFwiOntcIiRcIjowfX0sXCJoZXBmb3JnZVwiOntcIiRcIjowfSxcImpzXCI6e1wiJFwiOjB9LFwiYm1vYXR0YWNobWVudHNcIjp7XCIkXCI6MH0sXCJjYWJsZS1tb2RlbVwiOntcIiRcIjowfSxcImNvbGxlZ2VmYW5cIjp7XCIkXCI6MH0sXCJjb3VjaHBvdGF0b2ZyaWVzXCI6e1wiJFwiOjB9LFwibWxiZmFuXCI6e1wiJFwiOjB9LFwibXlzZWN1cml0eWNhbWVyYVwiOntcIiRcIjowfSxcIm5mbGZhblwiOntcIiRcIjowfSxcInJlYWQtYm9va3NcIjp7XCIkXCI6MH0sXCJ1ZmNmYW5cIjp7XCIkXCI6MH0sXCJob3B0b1wiOntcIiRcIjowfSxcIm15ZnRwXCI6e1wiJFwiOjB9LFwibm8taXBcIjp7XCIkXCI6MH0sXCJ6YXB0b1wiOntcIiRcIjowfSxcIm15LWZpcmV3YWxsXCI6e1wiJFwiOjB9LFwibXlmaXJld2FsbFwiOntcIiRcIjowfSxcInNwZG5zXCI6e1wiJFwiOjB9LFwiZHNteW5hc1wiOntcIiRcIjowfSxcImZhbWlseWRzXCI6e1wiJFwiOjB9LFwidHV4ZmFtaWx5XCI6e1wiJFwiOjB9LFwiZGlza3N0YXRpb25cIjp7XCIkXCI6MH0sXCJoa1wiOntcIiRcIjowfSxcIndtZmxhYnNcIjp7XCIkXCI6MH0sXCJ6YVwiOntcIiRcIjowfX0sXCJwYVwiOntcIiRcIjowLFwiYWNcIjp7XCIkXCI6MH0sXCJnb2JcIjp7XCIkXCI6MH0sXCJjb21cIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJzbGRcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJpbmdcIjp7XCIkXCI6MH0sXCJhYm9cIjp7XCIkXCI6MH0sXCJtZWRcIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH19LFwicGVcIjp7XCIkXCI6MCxcImVkdVwiOntcIiRcIjowfSxcImdvYlwiOntcIiRcIjowfSxcIm5vbVwiOntcIiRcIjowfSxcIm1pbFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcImJsb2dzcG90XCI6e1wiJFwiOjB9LFwibnltXCI6e1wiJFwiOjB9fSxcInBmXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH19LFwicGdcIjp7XCIqXCI6e1wiJFwiOjB9fSxcInBoXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJuZ29cIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJpXCI6e1wiJFwiOjB9fSxcInBrXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJmYW1cIjp7XCIkXCI6MH0sXCJiaXpcIjp7XCIkXCI6MH0sXCJ3ZWJcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJnb2JcIjp7XCIkXCI6MH0sXCJnb2tcIjp7XCIkXCI6MH0sXCJnb25cIjp7XCIkXCI6MH0sXCJnb3BcIjp7XCIkXCI6MH0sXCJnb3NcIjp7XCIkXCI6MH0sXCJpbmZvXCI6e1wiJFwiOjB9fSxcInBsXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJhaWRcIjp7XCIkXCI6MH0sXCJhZ3JvXCI6e1wiJFwiOjB9LFwiYXRtXCI6e1wiJFwiOjB9LFwiYXV0b1wiOntcIiRcIjowfSxcImJpelwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdtaW5hXCI6e1wiJFwiOjB9LFwiZ3NtXCI6e1wiJFwiOjB9LFwiaW5mb1wiOntcIiRcIjowfSxcIm1haWxcIjp7XCIkXCI6MH0sXCJtaWFzdGFcIjp7XCIkXCI6MH0sXCJtZWRpYVwiOntcIiRcIjowfSxcIm1pbFwiOntcIiRcIjowfSxcIm5pZXJ1Y2hvbW9zY2lcIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH0sXCJwY1wiOntcIiRcIjowfSxcInBvd2lhdFwiOntcIiRcIjowfSxcInByaXZcIjp7XCIkXCI6MH0sXCJyZWFsZXN0YXRlXCI6e1wiJFwiOjB9LFwicmVsXCI6e1wiJFwiOjB9LFwic2V4XCI6e1wiJFwiOjB9LFwic2hvcFwiOntcIiRcIjowfSxcInNrbGVwXCI6e1wiJFwiOjB9LFwic29zXCI6e1wiJFwiOjB9LFwic3prb2xhXCI6e1wiJFwiOjB9LFwidGFyZ2lcIjp7XCIkXCI6MH0sXCJ0bVwiOntcIiRcIjowfSxcInRvdXJpc21cIjp7XCIkXCI6MH0sXCJ0cmF2ZWxcIjp7XCIkXCI6MH0sXCJ0dXJ5c3R5a2FcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MCxcImFwXCI6e1wiJFwiOjB9LFwiaWNcIjp7XCIkXCI6MH0sXCJpc1wiOntcIiRcIjowfSxcInVzXCI6e1wiJFwiOjB9LFwia21wc3BcIjp7XCIkXCI6MH0sXCJrcHBzcFwiOntcIiRcIjowfSxcImt3cHNwXCI6e1wiJFwiOjB9LFwicHNwXCI6e1wiJFwiOjB9LFwid3NrclwiOntcIiRcIjowfSxcImt3cFwiOntcIiRcIjowfSxcIm13XCI6e1wiJFwiOjB9LFwidWdcIjp7XCIkXCI6MH0sXCJ1bVwiOntcIiRcIjowfSxcInVtaWdcIjp7XCIkXCI6MH0sXCJ1Z2ltXCI6e1wiJFwiOjB9LFwidXBvd1wiOntcIiRcIjowfSxcInV3XCI6e1wiJFwiOjB9LFwic3Rhcm9zdHdvXCI6e1wiJFwiOjB9LFwicGFcIjp7XCIkXCI6MH0sXCJwb1wiOntcIiRcIjowfSxcInBzc2VcIjp7XCIkXCI6MH0sXCJwdXBcIjp7XCIkXCI6MH0sXCJyemd3XCI6e1wiJFwiOjB9LFwic2FcIjp7XCIkXCI6MH0sXCJzb1wiOntcIiRcIjowfSxcInNyXCI6e1wiJFwiOjB9LFwid3NhXCI6e1wiJFwiOjB9LFwic2tvXCI6e1wiJFwiOjB9LFwidXpzXCI6e1wiJFwiOjB9LFwid2lpaFwiOntcIiRcIjowfSxcIndpbmJcIjp7XCIkXCI6MH0sXCJwaW5iXCI6e1wiJFwiOjB9LFwid2lvc1wiOntcIiRcIjowfSxcIndpdGRcIjp7XCIkXCI6MH0sXCJ3em1pdXdcIjp7XCIkXCI6MH0sXCJwaXdcIjp7XCIkXCI6MH0sXCJ3aXdcIjp7XCIkXCI6MH0sXCJncml3XCI6e1wiJFwiOjB9LFwid2lmXCI6e1wiJFwiOjB9LFwib3VtXCI6e1wiJFwiOjB9LFwic2RuXCI6e1wiJFwiOjB9LFwienBcIjp7XCIkXCI6MH0sXCJ1cHBvXCI6e1wiJFwiOjB9LFwibXVwXCI6e1wiJFwiOjB9LFwid3VvelwiOntcIiRcIjowfSxcImtvbnN1bGF0XCI6e1wiJFwiOjB9LFwib2lybVwiOntcIiRcIjowfX0sXCJhdWd1c3Rvd1wiOntcIiRcIjowfSxcImJhYmlhLWdvcmFcIjp7XCIkXCI6MH0sXCJiZWR6aW5cIjp7XCIkXCI6MH0sXCJiZXNraWR5XCI6e1wiJFwiOjB9LFwiYmlhbG93aWV6YVwiOntcIiRcIjowfSxcImJpYWx5c3Rva1wiOntcIiRcIjowfSxcImJpZWxhd2FcIjp7XCIkXCI6MH0sXCJiaWVzemN6YWR5XCI6e1wiJFwiOjB9LFwiYm9sZXNsYXdpZWNcIjp7XCIkXCI6MH0sXCJieWRnb3N6Y3pcIjp7XCIkXCI6MH0sXCJieXRvbVwiOntcIiRcIjowfSxcImNpZXN6eW5cIjp7XCIkXCI6MH0sXCJjemVsYWR6XCI6e1wiJFwiOjB9LFwiY3plc3RcIjp7XCIkXCI6MH0sXCJkbHVnb2xla2FcIjp7XCIkXCI6MH0sXCJlbGJsYWdcIjp7XCIkXCI6MH0sXCJlbGtcIjp7XCIkXCI6MH0sXCJnbG9nb3dcIjp7XCIkXCI6MH0sXCJnbmllem5vXCI6e1wiJFwiOjB9LFwiZ29ybGljZVwiOntcIiRcIjowfSxcImdyYWpld29cIjp7XCIkXCI6MH0sXCJpbGF3YVwiOntcIiRcIjowfSxcImphd29yem5vXCI6e1wiJFwiOjB9LFwiamVsZW5pYS1nb3JhXCI6e1wiJFwiOjB9LFwiamdvcmFcIjp7XCIkXCI6MH0sXCJrYWxpc3pcIjp7XCIkXCI6MH0sXCJrYXppbWllcnotZG9sbnlcIjp7XCIkXCI6MH0sXCJrYXJwYWN6XCI6e1wiJFwiOjB9LFwia2FydHV6eVwiOntcIiRcIjowfSxcImthc3p1YnlcIjp7XCIkXCI6MH0sXCJrYXRvd2ljZVwiOntcIiRcIjowfSxcImtlcG5vXCI6e1wiJFwiOjB9LFwia2V0cnp5blwiOntcIiRcIjowfSxcImtsb2R6a29cIjp7XCIkXCI6MH0sXCJrb2JpZXJ6eWNlXCI6e1wiJFwiOjB9LFwia29sb2JyemVnXCI6e1wiJFwiOjB9LFwia29uaW5cIjp7XCIkXCI6MH0sXCJrb25za293b2xhXCI6e1wiJFwiOjB9LFwia3V0bm9cIjp7XCIkXCI6MH0sXCJsYXB5XCI6e1wiJFwiOjB9LFwibGVib3JrXCI6e1wiJFwiOjB9LFwibGVnbmljYVwiOntcIiRcIjowfSxcImxlemFqc2tcIjp7XCIkXCI6MH0sXCJsaW1hbm93YVwiOntcIiRcIjowfSxcImxvbXphXCI6e1wiJFwiOjB9LFwibG93aWN6XCI6e1wiJFwiOjB9LFwibHViaW5cIjp7XCIkXCI6MH0sXCJsdWtvd1wiOntcIiRcIjowfSxcIm1hbGJvcmtcIjp7XCIkXCI6MH0sXCJtYWxvcG9sc2thXCI6e1wiJFwiOjB9LFwibWF6b3dzemVcIjp7XCIkXCI6MH0sXCJtYXp1cnlcIjp7XCIkXCI6MH0sXCJtaWVsZWNcIjp7XCIkXCI6MH0sXCJtaWVsbm9cIjp7XCIkXCI6MH0sXCJtcmFnb3dvXCI6e1wiJFwiOjB9LFwibmFrbG9cIjp7XCIkXCI6MH0sXCJub3dhcnVkYVwiOntcIiRcIjowfSxcIm55c2FcIjp7XCIkXCI6MH0sXCJvbGF3YVwiOntcIiRcIjowfSxcIm9sZWNrb1wiOntcIiRcIjowfSxcIm9sa3VzelwiOntcIiRcIjowfSxcIm9sc3p0eW5cIjp7XCIkXCI6MH0sXCJvcG9jem5vXCI6e1wiJFwiOjB9LFwib3BvbGVcIjp7XCIkXCI6MH0sXCJvc3Ryb2RhXCI6e1wiJFwiOjB9LFwib3N0cm9sZWthXCI6e1wiJFwiOjB9LFwib3N0cm93aWVjXCI6e1wiJFwiOjB9LFwib3N0cm93d2xrcFwiOntcIiRcIjowfSxcInBpbGFcIjp7XCIkXCI6MH0sXCJwaXN6XCI6e1wiJFwiOjB9LFwicG9kaGFsZVwiOntcIiRcIjowfSxcInBvZGxhc2llXCI6e1wiJFwiOjB9LFwicG9sa293aWNlXCI6e1wiJFwiOjB9LFwicG9tb3J6ZVwiOntcIiRcIjowfSxcInBvbW9yc2tpZVwiOntcIiRcIjowfSxcInByb2Nob3dpY2VcIjp7XCIkXCI6MH0sXCJwcnVzemtvd1wiOntcIiRcIjowfSxcInByemV3b3Jza1wiOntcIiRcIjowfSxcInB1bGF3eVwiOntcIiRcIjowfSxcInJhZG9tXCI6e1wiJFwiOjB9LFwicmF3YS1tYXpcIjp7XCIkXCI6MH0sXCJyeWJuaWtcIjp7XCIkXCI6MH0sXCJyemVzem93XCI6e1wiJFwiOjB9LFwic2Fub2tcIjp7XCIkXCI6MH0sXCJzZWpueVwiOntcIiRcIjowfSxcInNsYXNrXCI6e1wiJFwiOjB9LFwic2x1cHNrXCI6e1wiJFwiOjB9LFwic29zbm93aWVjXCI6e1wiJFwiOjB9LFwic3RhbG93YS13b2xhXCI6e1wiJFwiOjB9LFwic2tvY3pvd1wiOntcIiRcIjowfSxcInN0YXJhY2hvd2ljZVwiOntcIiRcIjowfSxcInN0YXJnYXJkXCI6e1wiJFwiOjB9LFwic3V3YWxraVwiOntcIiRcIjowfSxcInN3aWRuaWNhXCI6e1wiJFwiOjB9LFwic3dpZWJvZHppblwiOntcIiRcIjowfSxcInN3aW5vdWpzY2llXCI6e1wiJFwiOjB9LFwic3pjemVjaW5cIjp7XCIkXCI6MH0sXCJzemN6eXRub1wiOntcIiRcIjowfSxcInRhcm5vYnJ6ZWdcIjp7XCIkXCI6MH0sXCJ0Z29yeVwiOntcIiRcIjowfSxcInR1cmVrXCI6e1wiJFwiOjB9LFwidHljaHlcIjp7XCIkXCI6MH0sXCJ1c3RrYVwiOntcIiRcIjowfSxcIndhbGJyenljaFwiOntcIiRcIjowfSxcIndhcm1pYVwiOntcIiRcIjowfSxcIndhcnN6YXdhXCI6e1wiJFwiOjB9LFwid2F3XCI6e1wiJFwiOjB9LFwid2Vncm93XCI6e1wiJFwiOjB9LFwid2llbHVuXCI6e1wiJFwiOjB9LFwid2xvY2xcIjp7XCIkXCI6MH0sXCJ3bG9jbGF3ZWtcIjp7XCIkXCI6MH0sXCJ3b2R6aXNsYXdcIjp7XCIkXCI6MH0sXCJ3b2xvbWluXCI6e1wiJFwiOjB9LFwid3JvY2xhd1wiOntcIiRcIjowfSxcInphY2hwb21vclwiOntcIiRcIjowfSxcInphZ2FuXCI6e1wiJFwiOjB9LFwiemFyb3dcIjp7XCIkXCI6MH0sXCJ6Z29yYVwiOntcIiRcIjowfSxcInpnb3J6ZWxlY1wiOntcIiRcIjowfSxcImJlZXBcIjp7XCIkXCI6MH0sXCJjb1wiOntcIiRcIjowfSxcImFydFwiOntcIiRcIjowfSxcImdsaXdpY2VcIjp7XCIkXCI6MH0sXCJrcmFrb3dcIjp7XCIkXCI6MH0sXCJwb3puYW5cIjp7XCIkXCI6MH0sXCJ3cm9jXCI6e1wiJFwiOjB9LFwiemFrb3BhbmVcIjp7XCIkXCI6MH0sXCJnZGFcIjp7XCIkXCI6MH0sXCJnZGFuc2tcIjp7XCIkXCI6MH0sXCJnZHluaWFcIjp7XCIkXCI6MH0sXCJtZWRcIjp7XCIkXCI6MH0sXCJzb3BvdFwiOntcIiRcIjowfX0sXCJwbVwiOntcIiRcIjowfSxcInBuXCI6e1wiJFwiOjAsXCJnb3ZcIjp7XCIkXCI6MH0sXCJjb1wiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfX0sXCJwb3N0XCI6e1wiJFwiOjB9LFwicHJcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImlzbGFcIjp7XCIkXCI6MH0sXCJwcm9cIjp7XCIkXCI6MH0sXCJiaXpcIjp7XCIkXCI6MH0sXCJpbmZvXCI6e1wiJFwiOjB9LFwibmFtZVwiOntcIiRcIjowfSxcImVzdFwiOntcIiRcIjowfSxcInByb2ZcIjp7XCIkXCI6MH0sXCJhY1wiOntcIiRcIjowfX0sXCJwcm9cIjp7XCIkXCI6MCxcImFhYVwiOntcIiRcIjowfSxcImFjYVwiOntcIiRcIjowfSxcImFjY3RcIjp7XCIkXCI6MH0sXCJhdm9jYXRcIjp7XCIkXCI6MH0sXCJiYXJcIjp7XCIkXCI6MH0sXCJjcGFcIjp7XCIkXCI6MH0sXCJlbmdcIjp7XCIkXCI6MH0sXCJqdXJcIjp7XCIkXCI6MH0sXCJsYXdcIjp7XCIkXCI6MH0sXCJtZWRcIjp7XCIkXCI6MH0sXCJyZWNodFwiOntcIiRcIjowfSxcImNsb3VkbnNcIjp7XCIkXCI6MH19LFwicHNcIjp7XCIkXCI6MCxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcInNlY1wiOntcIiRcIjowfSxcInBsb1wiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfX0sXCJwdFwiOntcIiRcIjowLFwibmV0XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiaW50XCI6e1wiJFwiOjB9LFwicHVibFwiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcIm5vbWVcIjp7XCIkXCI6MH0sXCJibG9nc3BvdFwiOntcIiRcIjowfSxcIm55bVwiOntcIiRcIjowfX0sXCJwd1wiOntcIiRcIjowLFwiY29cIjp7XCIkXCI6MH0sXCJuZVwiOntcIiRcIjowfSxcIm9yXCI6e1wiJFwiOjB9LFwiZWRcIjp7XCIkXCI6MH0sXCJnb1wiOntcIiRcIjowfSxcImJlbGF1XCI6e1wiJFwiOjB9LFwiY2xvdWRuc1wiOntcIiRcIjowfSxcIm5vbVwiOntcIiRcIjowfX0sXCJweVwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiY29vcFwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIm1pbFwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfX0sXCJxYVwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwibmFtZVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcInNjaFwiOntcIiRcIjowfSxcImJsb2dzcG90XCI6e1wiJFwiOjB9LFwibm9tXCI6e1wiJFwiOjB9fSxcInJlXCI6e1wiJFwiOjAsXCJhc3NvXCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9LFwibm9tXCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH19LFwicm9cIjp7XCIkXCI6MCxcImFydHNcIjp7XCIkXCI6MH0sXCJjb21cIjp7XCIkXCI6MH0sXCJmaXJtXCI6e1wiJFwiOjB9LFwiaW5mb1wiOntcIiRcIjowfSxcIm5vbVwiOntcIiRcIjowfSxcIm50XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwicmVjXCI6e1wiJFwiOjB9LFwic3RvcmVcIjp7XCIkXCI6MH0sXCJ0bVwiOntcIiRcIjowfSxcInd3d1wiOntcIiRcIjowfSxcInNob3BcIjp7XCIkXCI6MH0sXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJyc1wiOntcIiRcIjowLFwiYWNcIjp7XCIkXCI6MH0sXCJjb1wiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcImluXCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH19LFwicnVcIjp7XCIkXCI6MCxcImFjXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwiaW50XCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwidGVzdFwiOntcIiRcIjowfSxcImFkeWdleWFcIjp7XCIkXCI6MH0sXCJiYXNoa2lyaWFcIjp7XCIkXCI6MH0sXCJiaXJcIjp7XCIkXCI6MH0sXCJjYmdcIjp7XCIkXCI6MH0sXCJjb21cIjp7XCIkXCI6MH0sXCJkYWdlc3RhblwiOntcIiRcIjowfSxcImdyb3pueVwiOntcIiRcIjowfSxcImthbG15a2lhXCI6e1wiJFwiOjB9LFwia3VzdGFuYWlcIjp7XCIkXCI6MH0sXCJtYXJpbmVcIjp7XCIkXCI6MH0sXCJtb3Jkb3ZpYVwiOntcIiRcIjowfSxcIm1za1wiOntcIiRcIjowfSxcIm15dGlzXCI6e1wiJFwiOjB9LFwibmFsY2hpa1wiOntcIiRcIjowfSxcIm5vdlwiOntcIiRcIjowfSxcInB5YXRpZ29yc2tcIjp7XCIkXCI6MH0sXCJzcGJcIjp7XCIkXCI6MH0sXCJ2bGFkaWthdmthelwiOntcIiRcIjowfSxcInZsYWRpbWlyXCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH0sXCJjbGRtYWlsXCI6e1wiaGJcIjp7XCIkXCI6MH19LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwicHBcIjp7XCIkXCI6MH19LFwicndcIjp7XCIkXCI6MCxcImdvdlwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImFjXCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MH0sXCJpbnRcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJnb3V2XCI6e1wiJFwiOjB9fSxcInNhXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJtZWRcIjp7XCIkXCI6MH0sXCJwdWJcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJzY2hcIjp7XCIkXCI6MH19LFwic2JcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfX0sXCJzY1wiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9fSxcInNkXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJtZWRcIjp7XCIkXCI6MH0sXCJ0dlwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcImluZm9cIjp7XCIkXCI6MH19LFwic2VcIjp7XCIkXCI6MCxcImFcIjp7XCIkXCI6MH0sXCJhY1wiOntcIiRcIjowfSxcImJcIjp7XCIkXCI6MH0sXCJiZFwiOntcIiRcIjowfSxcImJyYW5kXCI6e1wiJFwiOjB9LFwiY1wiOntcIiRcIjowfSxcImRcIjp7XCIkXCI6MH0sXCJlXCI6e1wiJFwiOjB9LFwiZlwiOntcIiRcIjowfSxcImZoXCI6e1wiJFwiOjB9LFwiZmhza1wiOntcIiRcIjowfSxcImZodlwiOntcIiRcIjowfSxcImdcIjp7XCIkXCI6MH0sXCJoXCI6e1wiJFwiOjB9LFwiaVwiOntcIiRcIjowfSxcImtcIjp7XCIkXCI6MH0sXCJrb21mb3JiXCI6e1wiJFwiOjB9LFwia29tbXVuYWxmb3JidW5kXCI6e1wiJFwiOjB9LFwia29tdnV4XCI6e1wiJFwiOjB9LFwibFwiOntcIiRcIjowfSxcImxhbmJpYlwiOntcIiRcIjowfSxcIm1cIjp7XCIkXCI6MH0sXCJuXCI6e1wiJFwiOjB9LFwibmF0dXJicnVrc2d5bW5cIjp7XCIkXCI6MH0sXCJvXCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwicFwiOntcIiRcIjowfSxcInBhcnRpXCI6e1wiJFwiOjB9LFwicHBcIjp7XCIkXCI6MH0sXCJwcmVzc1wiOntcIiRcIjowfSxcInJcIjp7XCIkXCI6MH0sXCJzXCI6e1wiJFwiOjB9LFwidFwiOntcIiRcIjowfSxcInRtXCI6e1wiJFwiOjB9LFwidVwiOntcIiRcIjowfSxcIndcIjp7XCIkXCI6MH0sXCJ4XCI6e1wiJFwiOjB9LFwieVwiOntcIiRcIjowfSxcInpcIjp7XCIkXCI6MH0sXCJjb21cIjp7XCIkXCI6MH0sXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJzZ1wiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwicGVyXCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH19LFwic2hcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIm1pbFwiOntcIiRcIjowfSxcImhhc2hiYW5nXCI6e1wiJFwiOjB9LFwicGxhdGZvcm1cIjp7XCIqXCI6e1wiJFwiOjB9fSxcIndlZGVwbG95XCI6e1wiJFwiOjB9LFwibm93XCI6e1wiJFwiOjB9fSxcInNpXCI6e1wiJFwiOjAsXCJibG9nc3BvdFwiOntcIiRcIjowfSxcIm5vbVwiOntcIiRcIjowfX0sXCJzalwiOntcIiRcIjowfSxcInNrXCI6e1wiJFwiOjAsXCJibG9nc3BvdFwiOntcIiRcIjowfSxcIm55bVwiOntcIiRcIjowfX0sXCJzbFwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9fSxcInNtXCI6e1wiJFwiOjB9LFwic25cIjp7XCIkXCI6MCxcImFydFwiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdXZcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJwZXJzb1wiOntcIiRcIjowfSxcInVuaXZcIjp7XCIkXCI6MH0sXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJzb1wiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9fSxcInNyXCI6e1wiJFwiOjB9LFwic3RcIjp7XCIkXCI6MCxcImNvXCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9LFwiY29uc3VsYWRvXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwiZW1iYWl4YWRhXCI6e1wiJFwiOjB9LFwiZ292XCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwicHJpbmNpcGVcIjp7XCIkXCI6MH0sXCJzYW90b21lXCI6e1wiJFwiOjB9LFwic3RvcmVcIjp7XCIkXCI6MH19LFwic3VcIjp7XCIkXCI6MCxcImFia2hhemlhXCI6e1wiJFwiOjB9LFwiYWR5Z2V5YVwiOntcIiRcIjowfSxcImFrdHl1Ymluc2tcIjp7XCIkXCI6MH0sXCJhcmtoYW5nZWxza1wiOntcIiRcIjowfSxcImFybWVuaWFcIjp7XCIkXCI6MH0sXCJhc2hnYWJhZFwiOntcIiRcIjowfSxcImF6ZXJiYWlqYW5cIjp7XCIkXCI6MH0sXCJiYWxhc2hvdlwiOntcIiRcIjowfSxcImJhc2hraXJpYVwiOntcIiRcIjowfSxcImJyeWFuc2tcIjp7XCIkXCI6MH0sXCJidWtoYXJhXCI6e1wiJFwiOjB9LFwiY2hpbWtlbnRcIjp7XCIkXCI6MH0sXCJkYWdlc3RhblwiOntcIiRcIjowfSxcImVhc3Qta2F6YWtoc3RhblwiOntcIiRcIjowfSxcImV4bmV0XCI6e1wiJFwiOjB9LFwiZ2VvcmdpYVwiOntcIiRcIjowfSxcImdyb3pueVwiOntcIiRcIjowfSxcIml2YW5vdm9cIjp7XCIkXCI6MH0sXCJqYW1ieWxcIjp7XCIkXCI6MH0sXCJrYWxteWtpYVwiOntcIiRcIjowfSxcImthbHVnYVwiOntcIiRcIjowfSxcImthcmFjb2xcIjp7XCIkXCI6MH0sXCJrYXJhZ2FuZGFcIjp7XCIkXCI6MH0sXCJrYXJlbGlhXCI6e1wiJFwiOjB9LFwia2hha2Fzc2lhXCI6e1wiJFwiOjB9LFwia3Jhc25vZGFyXCI6e1wiJFwiOjB9LFwia3VyZ2FuXCI6e1wiJFwiOjB9LFwia3VzdGFuYWlcIjp7XCIkXCI6MH0sXCJsZW51Z1wiOntcIiRcIjowfSxcIm1hbmd5c2hsYWtcIjp7XCIkXCI6MH0sXCJtb3Jkb3ZpYVwiOntcIiRcIjowfSxcIm1za1wiOntcIiRcIjowfSxcIm11cm1hbnNrXCI6e1wiJFwiOjB9LFwibmFsY2hpa1wiOntcIiRcIjowfSxcIm5hdm9pXCI6e1wiJFwiOjB9LFwibm9ydGgta2F6YWtoc3RhblwiOntcIiRcIjowfSxcIm5vdlwiOntcIiRcIjowfSxcIm9ibmluc2tcIjp7XCIkXCI6MH0sXCJwZW56YVwiOntcIiRcIjowfSxcInBva3JvdnNrXCI6e1wiJFwiOjB9LFwic29jaGlcIjp7XCIkXCI6MH0sXCJzcGJcIjp7XCIkXCI6MH0sXCJ0YXNoa2VudFwiOntcIiRcIjowfSxcInRlcm1lelwiOntcIiRcIjowfSxcInRvZ2xpYXR0aVwiOntcIiRcIjowfSxcInRyb2l0c2tcIjp7XCIkXCI6MH0sXCJ0c2VsaW5vZ3JhZFwiOntcIiRcIjowfSxcInR1bGFcIjp7XCIkXCI6MH0sXCJ0dXZhXCI6e1wiJFwiOjB9LFwidmxhZGlrYXZrYXpcIjp7XCIkXCI6MH0sXCJ2bGFkaW1pclwiOntcIiRcIjowfSxcInZvbG9nZGFcIjp7XCIkXCI6MH0sXCJueW1cIjp7XCIkXCI6MH19LFwic3ZcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvYlwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcInJlZFwiOntcIiRcIjowfX0sXCJzeFwiOntcIiRcIjowLFwiZ292XCI6e1wiJFwiOjB9LFwibnltXCI6e1wiJFwiOjB9fSxcInN5XCI6e1wiJFwiOjAsXCJlZHVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJjb21cIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH19LFwic3pcIjp7XCIkXCI6MCxcImNvXCI6e1wiJFwiOjB9LFwiYWNcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH19LFwidGNcIjp7XCIkXCI6MH0sXCJ0ZFwiOntcIiRcIjowLFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH19LFwidGVsXCI6e1wiJFwiOjB9LFwidGZcIjp7XCIkXCI6MH0sXCJ0Z1wiOntcIiRcIjowfSxcInRoXCI6e1wiJFwiOjAsXCJhY1wiOntcIiRcIjowfSxcImNvXCI6e1wiJFwiOjB9LFwiZ29cIjp7XCIkXCI6MH0sXCJpblwiOntcIiRcIjowfSxcIm1pXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JcIjp7XCIkXCI6MH19LFwidGpcIjp7XCIkXCI6MCxcImFjXCI6e1wiJFwiOjB9LFwiYml6XCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MH0sXCJjb21cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb1wiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcImludFwiOntcIiRcIjowfSxcIm1pbFwiOntcIiRcIjowfSxcIm5hbWVcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJuaWNcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJ0ZXN0XCI6e1wiJFwiOjB9LFwid2ViXCI6e1wiJFwiOjB9fSxcInRrXCI6e1wiJFwiOjB9LFwidGxcIjp7XCIkXCI6MCxcImdvdlwiOntcIiRcIjowfX0sXCJ0bVwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH19LFwidG5cIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcImVuc1wiOntcIiRcIjowfSxcImZpblwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcImluZFwiOntcIiRcIjowfSxcImludGxcIjp7XCIkXCI6MH0sXCJuYXRcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJpbmZvXCI6e1wiJFwiOjB9LFwicGVyc29cIjp7XCIkXCI6MH0sXCJ0b3VyaXNtXCI6e1wiJFwiOjB9LFwiZWR1bmV0XCI6e1wiJFwiOjB9LFwicm5ydFwiOntcIiRcIjowfSxcInJuc1wiOntcIiRcIjowfSxcInJudVwiOntcIiRcIjowfSxcIm1pbmNvbVwiOntcIiRcIjowfSxcImFncmluZXRcIjp7XCIkXCI6MH0sXCJkZWZlbnNlXCI6e1wiJFwiOjB9LFwidHVyZW5cIjp7XCIkXCI6MH19LFwidG9cIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcIm1pbFwiOntcIiRcIjowfSxcInZwbnBsdXNcIjp7XCIkXCI6MH19LFwidHJcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowLFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH19LFwiaW5mb1wiOntcIiRcIjowfSxcImJpelwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcIndlYlwiOntcIiRcIjowfSxcImdlblwiOntcIiRcIjowfSxcInR2XCI6e1wiJFwiOjB9LFwiYXZcIjp7XCIkXCI6MH0sXCJkclwiOntcIiRcIjowfSxcImJic1wiOntcIiRcIjowfSxcIm5hbWVcIjp7XCIkXCI6MH0sXCJ0ZWxcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJiZWxcIjp7XCIkXCI6MH0sXCJwb2xcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJrMTJcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJrZXBcIjp7XCIkXCI6MH0sXCJuY1wiOntcIiRcIjowLFwiZ292XCI6e1wiJFwiOjB9fX0sXCJ0cmF2ZWxcIjp7XCIkXCI6MH0sXCJ0dFwiOntcIiRcIjowLFwiY29cIjp7XCIkXCI6MH0sXCJjb21cIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJiaXpcIjp7XCIkXCI6MH0sXCJpbmZvXCI6e1wiJFwiOjB9LFwicHJvXCI6e1wiJFwiOjB9LFwiaW50XCI6e1wiJFwiOjB9LFwiY29vcFwiOntcIiRcIjowfSxcImpvYnNcIjp7XCIkXCI6MH0sXCJtb2JpXCI6e1wiJFwiOjB9LFwidHJhdmVsXCI6e1wiJFwiOjB9LFwibXVzZXVtXCI6e1wiJFwiOjB9LFwiYWVyb1wiOntcIiRcIjowfSxcIm5hbWVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH19LFwidHZcIjp7XCIkXCI6MCxcImR5bmRuc1wiOntcIiRcIjowfSxcImJldHRlci10aGFuXCI6e1wiJFwiOjB9LFwib24tdGhlLXdlYlwiOntcIiRcIjowfSxcIndvcnNlLXRoYW5cIjp7XCIkXCI6MH19LFwidHdcIjp7XCIkXCI6MCxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcIm1pbFwiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowLFwibXltYWlsZXJcIjp7XCIkXCI6MH19LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiaWR2XCI6e1wiJFwiOjB9LFwiZ2FtZVwiOntcIiRcIjowfSxcImViaXpcIjp7XCIkXCI6MH0sXCJjbHViXCI6e1wiJFwiOjB9LFwieG4tLXpmMGFvNjRhXCI6e1wiJFwiOjB9LFwieG4tLXVjMGF0dlwiOntcIiRcIjowfSxcInhuLS1jenJ3MjhiXCI6e1wiJFwiOjB9LFwidXJsXCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH0sXCJueW1cIjp7XCIkXCI6MH19LFwidHpcIjp7XCIkXCI6MCxcImFjXCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MH0sXCJnb1wiOntcIiRcIjowfSxcImhvdGVsXCI6e1wiJFwiOjB9LFwiaW5mb1wiOntcIiRcIjowfSxcIm1lXCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwibW9iaVwiOntcIiRcIjowfSxcIm5lXCI6e1wiJFwiOjB9LFwib3JcIjp7XCIkXCI6MH0sXCJzY1wiOntcIiRcIjowfSxcInR2XCI6e1wiJFwiOjB9fSxcInVhXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJpblwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImNoZXJrYXNzeVwiOntcIiRcIjowfSxcImNoZXJrYXN5XCI6e1wiJFwiOjB9LFwiY2hlcm5pZ292XCI6e1wiJFwiOjB9LFwiY2hlcm5paGl2XCI6e1wiJFwiOjB9LFwiY2hlcm5pdnRzaVwiOntcIiRcIjowfSxcImNoZXJub3Z0c3lcIjp7XCIkXCI6MH0sXCJja1wiOntcIiRcIjowfSxcImNuXCI6e1wiJFwiOjB9LFwiY3JcIjp7XCIkXCI6MH0sXCJjcmltZWFcIjp7XCIkXCI6MH0sXCJjdlwiOntcIiRcIjowfSxcImRuXCI6e1wiJFwiOjB9LFwiZG5lcHJvcGV0cm92c2tcIjp7XCIkXCI6MH0sXCJkbmlwcm9wZXRyb3Zza1wiOntcIiRcIjowfSxcImRvbWluaWNcIjp7XCIkXCI6MH0sXCJkb25ldHNrXCI6e1wiJFwiOjB9LFwiZHBcIjp7XCIkXCI6MH0sXCJpZlwiOntcIiRcIjowfSxcIml2YW5vLWZyYW5raXZza1wiOntcIiRcIjowfSxcImtoXCI6e1wiJFwiOjB9LFwia2hhcmtpdlwiOntcIiRcIjowfSxcImtoYXJrb3ZcIjp7XCIkXCI6MH0sXCJraGVyc29uXCI6e1wiJFwiOjB9LFwia2htZWxuaXRza2l5XCI6e1wiJFwiOjB9LFwia2htZWxueXRza3lpXCI6e1wiJFwiOjB9LFwia2lldlwiOntcIiRcIjowfSxcImtpcm92b2dyYWRcIjp7XCIkXCI6MH0sXCJrbVwiOntcIiRcIjowfSxcImtyXCI6e1wiJFwiOjB9LFwia3J5bVwiOntcIiRcIjowfSxcImtzXCI6e1wiJFwiOjB9LFwia3ZcIjp7XCIkXCI6MH0sXCJreWl2XCI6e1wiJFwiOjB9LFwibGdcIjp7XCIkXCI6MH0sXCJsdFwiOntcIiRcIjowfSxcImx1Z2Fuc2tcIjp7XCIkXCI6MH0sXCJsdXRza1wiOntcIiRcIjowfSxcImx2XCI6e1wiJFwiOjB9LFwibHZpdlwiOntcIiRcIjowfSxcIm1rXCI6e1wiJFwiOjB9LFwibXlrb2xhaXZcIjp7XCIkXCI6MH0sXCJuaWtvbGFldlwiOntcIiRcIjowfSxcIm9kXCI6e1wiJFwiOjB9LFwib2Rlc2FcIjp7XCIkXCI6MH0sXCJvZGVzc2FcIjp7XCIkXCI6MH0sXCJwbFwiOntcIiRcIjowfSxcInBvbHRhdmFcIjp7XCIkXCI6MH0sXCJyaXZuZVwiOntcIiRcIjowfSxcInJvdm5vXCI6e1wiJFwiOjB9LFwicnZcIjp7XCIkXCI6MH0sXCJzYlwiOntcIiRcIjowfSxcInNlYmFzdG9wb2xcIjp7XCIkXCI6MH0sXCJzZXZhc3RvcG9sXCI6e1wiJFwiOjB9LFwic21cIjp7XCIkXCI6MH0sXCJzdW15XCI6e1wiJFwiOjB9LFwidGVcIjp7XCIkXCI6MH0sXCJ0ZXJub3BpbFwiOntcIiRcIjowfSxcInV6XCI6e1wiJFwiOjB9LFwidXpoZ29yb2RcIjp7XCIkXCI6MH0sXCJ2aW5uaWNhXCI6e1wiJFwiOjB9LFwidmlubnl0c2lhXCI6e1wiJFwiOjB9LFwidm5cIjp7XCIkXCI6MH0sXCJ2b2x5blwiOntcIiRcIjowfSxcInlhbHRhXCI6e1wiJFwiOjB9LFwiemFwb3Jpemh6aGVcIjp7XCIkXCI6MH0sXCJ6YXBvcml6aHpoaWFcIjp7XCIkXCI6MH0sXCJ6aGl0b21pclwiOntcIiRcIjowfSxcInpoeXRvbXlyXCI6e1wiJFwiOjB9LFwienBcIjp7XCIkXCI6MH0sXCJ6dFwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwiaW5mXCI6e1wiJFwiOjB9LFwibHRkXCI6e1wiJFwiOjB9LFwiYml6XCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MH0sXCJwcFwiOntcIiRcIjowfX0sXCJ1Z1wiOntcIiRcIjowLFwiY29cIjp7XCIkXCI6MH0sXCJvclwiOntcIiRcIjowfSxcImFjXCI6e1wiJFwiOjB9LFwic2NcIjp7XCIkXCI6MH0sXCJnb1wiOntcIiRcIjowfSxcIm5lXCI6e1wiJFwiOjB9LFwiY29tXCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH19LFwidWtcIjp7XCIkXCI6MCxcImFjXCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MCxcImJsb2dzcG90XCI6e1wiJFwiOjB9LFwibm8taXBcIjp7XCIkXCI6MH0sXCJ3ZWxsYmVpbmd6b25lXCI6e1wiJFwiOjB9fSxcImdvdlwiOntcIiRcIjowLFwic2VydmljZVwiOntcIiRcIjowfSxcImhvbWVvZmZpY2VcIjp7XCIkXCI6MH19LFwibHRkXCI6e1wiJFwiOjB9LFwibWVcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJuaHNcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJwbGNcIjp7XCIkXCI6MH0sXCJwb2xpY2VcIjp7XCIkXCI6MH0sXCJzY2hcIjp7XCIqXCI6e1wiJFwiOjB9fX0sXCJ1c1wiOntcIiRcIjowLFwiZG5pXCI6e1wiJFwiOjB9LFwiZmVkXCI6e1wiJFwiOjB9LFwiaXNhXCI6e1wiJFwiOjB9LFwia2lkc1wiOntcIiRcIjowfSxcIm5zblwiOntcIiRcIjowfSxcImFrXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJhbFwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwiYXJcIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcImFzXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJhelwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwiY2FcIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcImNvXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJjdFwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwiZGNcIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcImRlXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJmbFwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwiZ2FcIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcImd1XCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJoaVwiOntcIiRcIjowLFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwiaWFcIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcImlkXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJpbFwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwiaW5cIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcImtzXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJreVwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwibGFcIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcIm1hXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MCxcInB2dFwiOntcIiRcIjowfSxcImNodHJcIjp7XCIkXCI6MH0sXCJwYXJvY2hcIjp7XCIkXCI6MH19LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwibWRcIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcIm1lXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJtaVwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH0sXCJhbm4tYXJib3JcIjp7XCIkXCI6MH0sXCJjb2dcIjp7XCIkXCI6MH0sXCJkc3RcIjp7XCIkXCI6MH0sXCJlYXRvblwiOntcIiRcIjowfSxcImdlblwiOntcIiRcIjowfSxcIm11c1wiOntcIiRcIjowfSxcInRlY1wiOntcIiRcIjowfSxcIndhc2h0ZW5hd1wiOntcIiRcIjowfX0sXCJtblwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwibW9cIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcIm1zXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJtdFwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwibmNcIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcIm5kXCI6e1wiJFwiOjAsXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJuZVwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwibmhcIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcIm5qXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJubVwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwibnZcIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcIm55XCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJvaFwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwib2tcIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcIm9yXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJwYVwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwicHJcIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcInJpXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJzY1wiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwic2RcIjp7XCIkXCI6MCxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcInRuXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJ0eFwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwidXRcIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcInZpXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJ2dFwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwidmFcIjp7XCIkXCI6MCxcImsxMlwiOntcIiRcIjowfSxcImNjXCI6e1wiJFwiOjB9LFwibGliXCI6e1wiJFwiOjB9fSxcIndhXCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJ3aVwiOntcIiRcIjowLFwiazEyXCI6e1wiJFwiOjB9LFwiY2NcIjp7XCIkXCI6MH0sXCJsaWJcIjp7XCIkXCI6MH19LFwid3ZcIjp7XCIkXCI6MCxcImNjXCI6e1wiJFwiOjB9fSxcInd5XCI6e1wiJFwiOjAsXCJrMTJcIjp7XCIkXCI6MH0sXCJjY1wiOntcIiRcIjowfSxcImxpYlwiOntcIiRcIjowfX0sXCJjbG91ZG5zXCI6e1wiJFwiOjB9LFwiZHJ1ZFwiOntcIiRcIjowfSxcImlzLWJ5XCI6e1wiJFwiOjB9LFwibGFuZC00LXNhbGVcIjp7XCIkXCI6MH0sXCJzdHVmZi00LXNhbGVcIjp7XCIkXCI6MH0sXCJnb2xmZmFuXCI6e1wiJFwiOjB9LFwibm9pcFwiOntcIiRcIjowfSxcInBvaW50dG9cIjp7XCIkXCI6MH19LFwidXlcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowLFwiYmxvZ3Nwb3RcIjp7XCIkXCI6MH19LFwiZWR1XCI6e1wiJFwiOjB9LFwiZ3ViXCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwibm9tXCI6e1wiJFwiOjB9fSxcInV6XCI6e1wiJFwiOjAsXCJjb1wiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfX0sXCJ2YVwiOntcIiRcIjowfSxcInZjXCI6e1wiJFwiOjAsXCJjb21cIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJlZHVcIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH19LFwidmVcIjp7XCIkXCI6MCxcImFydHNcIjp7XCIkXCI6MH0sXCJjb1wiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcImUxMlwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImZpcm1cIjp7XCIkXCI6MH0sXCJnb2JcIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJpbmZvXCI6e1wiJFwiOjB9LFwiaW50XCI6e1wiJFwiOjB9LFwibWlsXCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9LFwicmVjXCI6e1wiJFwiOjB9LFwic3RvcmVcIjp7XCIkXCI6MH0sXCJ0ZWNcIjp7XCIkXCI6MH0sXCJ3ZWJcIjp7XCIkXCI6MH19LFwidmdcIjp7XCIkXCI6MCxcIm5vbVwiOntcIiRcIjowfX0sXCJ2aVwiOntcIiRcIjowLFwiY29cIjp7XCIkXCI6MH0sXCJjb21cIjp7XCIkXCI6MH0sXCJrMTJcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH19LFwidm5cIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcImludFwiOntcIiRcIjowfSxcImFjXCI6e1wiJFwiOjB9LFwiYml6XCI6e1wiJFwiOjB9LFwiaW5mb1wiOntcIiRcIjowfSxcIm5hbWVcIjp7XCIkXCI6MH0sXCJwcm9cIjp7XCIkXCI6MH0sXCJoZWFsdGhcIjp7XCIkXCI6MH0sXCJibG9nc3BvdFwiOntcIiRcIjowfX0sXCJ2dVwiOntcIiRcIjowLFwiY29tXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9LFwibmV0XCI6e1wiJFwiOjB9LFwib3JnXCI6e1wiJFwiOjB9fSxcIndmXCI6e1wiJFwiOjB9LFwid3NcIjp7XCIkXCI6MCxcImNvbVwiOntcIiRcIjowfSxcIm5ldFwiOntcIiRcIjowfSxcIm9yZ1wiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImFkdmlzb3JcIjp7XCIqXCI6e1wiJFwiOjB9fSxcImR5bmRuc1wiOntcIiRcIjowfSxcIm15cGV0c1wiOntcIiRcIjowfX0sXCJ5dFwiOntcIiRcIjowfSxcInhuLS1tZ2JhYW03YThoXCI6e1wiJFwiOjB9LFwieG4tLXk5YTNhcVwiOntcIiRcIjowfSxcInhuLS01NGI3ZnRhMGNjXCI6e1wiJFwiOjB9LFwieG4tLTkwYWVcIjp7XCIkXCI6MH0sXCJ4bi0tOTBhaXNcIjp7XCIkXCI6MH0sXCJ4bi0tZmlxczhzXCI6e1wiJFwiOjB9LFwieG4tLWZpcXo5c1wiOntcIiRcIjowfSxcInhuLS1sZ2JiYXQxYWQ4alwiOntcIiRcIjowfSxcInhuLS13Z2JoMWNcIjp7XCIkXCI6MH0sXCJ4bi0tZTFhNGNcIjp7XCIkXCI6MH0sXCJ4bi0tbm9kZVwiOntcIiRcIjowfSxcInhuLS1xeGFtXCI6e1wiJFwiOjB9LFwieG4tLWo2dzE5M2dcIjp7XCIkXCI6MH0sXCJ4bi0tMnNjcmo5Y1wiOntcIiRcIjowfSxcInhuLS0zaGNyajljXCI6e1wiJFwiOjB9LFwieG4tLTQ1YnI1Y3lsXCI6e1wiJFwiOjB9LFwieG4tLWgyYnJlZzNldmVcIjp7XCIkXCI6MH0sXCJ4bi0taDJicmo5YzhjXCI6e1wiJFwiOjB9LFwieG4tLW1nYmd1ODJhXCI6e1wiJFwiOjB9LFwieG4tLXJ2YzFlMGFtM2VcIjp7XCIkXCI6MH0sXCJ4bi0taDJicmo5Y1wiOntcIiRcIjowfSxcInhuLS1tZ2JiaDFhNzFlXCI6e1wiJFwiOjB9LFwieG4tLWZwY3JqOWMzZFwiOntcIiRcIjowfSxcInhuLS1nZWNyajljXCI6e1wiJFwiOjB9LFwieG4tLXM5YnJqOWNcIjp7XCIkXCI6MH0sXCJ4bi0tNDVicmo5Y1wiOntcIiRcIjowfSxcInhuLS14a2MyZGwzYTVlZTBoXCI6e1wiJFwiOjB9LFwieG4tLW1nYmEzYTRmMTZhXCI6e1wiJFwiOjB9LFwieG4tLW1nYmEzYTRmcmFcIjp7XCIkXCI6MH0sXCJ4bi0tbWdidHgyYlwiOntcIiRcIjowfSxcInhuLS1tZ2JheWg3Z3BhXCI6e1wiJFwiOjB9LFwieG4tLTNlMGI3MDdlXCI6e1wiJFwiOjB9LFwieG4tLTgwYW8yMWFcIjp7XCIkXCI6MH0sXCJ4bi0tZnpjMmM5ZTJjXCI6e1wiJFwiOjB9LFwieG4tLXhrYzJhbDNoeWUyYVwiOntcIiRcIjowfSxcInhuLS1tZ2JjMGE5YXpjZ1wiOntcIiRcIjowfSxcInhuLS1kMWFsZlwiOntcIiRcIjowfSxcInhuLS1sMWFjY1wiOntcIiRcIjowfSxcInhuLS1taXg4OTFmXCI6e1wiJFwiOjB9LFwieG4tLW1peDA4MmZcIjp7XCIkXCI6MH0sXCJ4bi0tbWdieDRjZDBhYlwiOntcIiRcIjowfSxcInhuLS1tZ2I5YXdiZlwiOntcIiRcIjowfSxcInhuLS1tZ2JhaTlhemdxcDZqXCI6e1wiJFwiOjB9LFwieG4tLW1nYmFpOWE1ZXZhMDBiXCI6e1wiJFwiOjB9LFwieG4tLXlnYmkyYW1teFwiOntcIiRcIjowfSxcInhuLS05MGEzYWNcIjp7XCIkXCI6MCxcInhuLS1vMWFjXCI6e1wiJFwiOjB9LFwieG4tLWMxYXZnXCI6e1wiJFwiOjB9LFwieG4tLTkwYXpoXCI6e1wiJFwiOjB9LFwieG4tLWQxYXRcIjp7XCIkXCI6MH0sXCJ4bi0tbzFhY2hcIjp7XCIkXCI6MH0sXCJ4bi0tODBhdVwiOntcIiRcIjowfX0sXCJ4bi0tcDFhaVwiOntcIiRcIjowfSxcInhuLS13Z2JsNmFcIjp7XCIkXCI6MH0sXCJ4bi0tbWdiZXJwNGE1ZDRhclwiOntcIiRcIjowfSxcInhuLS1tZ2JlcnA0YTVkNGE4N2dcIjp7XCIkXCI6MH0sXCJ4bi0tbWdicWx5N2MwYTY3ZmJjXCI6e1wiJFwiOjB9LFwieG4tLW1nYnFseTdjdmFmclwiOntcIiRcIjowfSxcInhuLS1tZ2JwbDJmaFwiOntcIiRcIjowfSxcInhuLS15ZnJvNGk2N29cIjp7XCIkXCI6MH0sXCJ4bi0tY2xjaGMwZWEwYjJnMmE5Z2NkXCI6e1wiJFwiOjB9LFwieG4tLW9nYnBmOGZsXCI6e1wiJFwiOjB9LFwieG4tLW1nYnRmOGZsXCI6e1wiJFwiOjB9LFwieG4tLW8zY3c0aFwiOntcIiRcIjowLFwieG4tLTEyYzFmZTBiclwiOntcIiRcIjowfSxcInhuLS0xMmNvMGMzYjRldmFcIjp7XCIkXCI6MH0sXCJ4bi0taDNjdXprMWRpXCI6e1wiJFwiOjB9LFwieG4tLW8zY3l4MmFcIjp7XCIkXCI6MH0sXCJ4bi0tbTNjaDBqM2FcIjp7XCIkXCI6MH0sXCJ4bi0tMTJjZmk4aXhiOGxcIjp7XCIkXCI6MH19LFwieG4tLXBnYnMwZGhcIjp7XCIkXCI6MH0sXCJ4bi0ta3ByeTU3ZFwiOntcIiRcIjowfSxcInhuLS1rcHJ3MTNkXCI6e1wiJFwiOjB9LFwieG4tLW5ueDM4OGFcIjp7XCIkXCI6MH0sXCJ4bi0tajFhbWhcIjp7XCIkXCI6MH0sXCJ4bi0tbWdiMmRkZXNcIjp7XCIkXCI6MH0sXCJ4eHhcIjp7XCIkXCI6MH0sXCJ5ZVwiOntcIipcIjp7XCIkXCI6MH19LFwiemFcIjp7XCJhY1wiOntcIiRcIjowfSxcImFncmljXCI6e1wiJFwiOjB9LFwiYWx0XCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MCxcImJsb2dzcG90XCI6e1wiJFwiOjB9fSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcImdyb25kYXJcIjp7XCIkXCI6MH0sXCJsYXdcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJuZ29cIjp7XCIkXCI6MH0sXCJuaXNcIjp7XCIkXCI6MH0sXCJub21cIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJzY2hvb2xcIjp7XCIkXCI6MH0sXCJ0bVwiOntcIiRcIjowfSxcIndlYlwiOntcIiRcIjowfX0sXCJ6bVwiOntcIiRcIjowLFwiYWNcIjp7XCIkXCI6MH0sXCJiaXpcIjp7XCIkXCI6MH0sXCJjb1wiOntcIiRcIjowfSxcImNvbVwiOntcIiRcIjowfSxcImVkdVwiOntcIiRcIjowfSxcImdvdlwiOntcIiRcIjowfSxcImluZm9cIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJuZXRcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH0sXCJzY2hcIjp7XCIkXCI6MH19LFwiendcIjp7XCIkXCI6MCxcImFjXCI6e1wiJFwiOjB9LFwiY29cIjp7XCIkXCI6MH0sXCJnb3ZcIjp7XCIkXCI6MH0sXCJtaWxcIjp7XCIkXCI6MH0sXCJvcmdcIjp7XCIkXCI6MH19LFwiYWFhXCI6e1wiJFwiOjB9LFwiYWFycFwiOntcIiRcIjowfSxcImFiYXJ0aFwiOntcIiRcIjowfSxcImFiYlwiOntcIiRcIjowfSxcImFiYm90dFwiOntcIiRcIjowfSxcImFiYnZpZVwiOntcIiRcIjowfSxcImFiY1wiOntcIiRcIjowfSxcImFibGVcIjp7XCIkXCI6MH0sXCJhYm9nYWRvXCI6e1wiJFwiOjB9LFwiYWJ1ZGhhYmlcIjp7XCIkXCI6MH0sXCJhY2FkZW15XCI6e1wiJFwiOjB9LFwiYWNjZW50dXJlXCI6e1wiJFwiOjB9LFwiYWNjb3VudGFudFwiOntcIiRcIjowfSxcImFjY291bnRhbnRzXCI6e1wiJFwiOjB9LFwiYWNvXCI6e1wiJFwiOjB9LFwiYWN0aXZlXCI6e1wiJFwiOjB9LFwiYWN0b3JcIjp7XCIkXCI6MH0sXCJhZGFjXCI6e1wiJFwiOjB9LFwiYWRzXCI6e1wiJFwiOjB9LFwiYWR1bHRcIjp7XCIkXCI6MH0sXCJhZWdcIjp7XCIkXCI6MH0sXCJhZXRuYVwiOntcIiRcIjowfSxcImFmYW1pbHljb21wYW55XCI6e1wiJFwiOjB9LFwiYWZsXCI6e1wiJFwiOjB9LFwiYWZyaWNhXCI6e1wiJFwiOjB9LFwiYWdha2hhblwiOntcIiRcIjowfSxcImFnZW5jeVwiOntcIiRcIjowfSxcImFpZ1wiOntcIiRcIjowfSxcImFpZ29cIjp7XCIkXCI6MH0sXCJhaXJidXNcIjp7XCIkXCI6MH0sXCJhaXJmb3JjZVwiOntcIiRcIjowfSxcImFpcnRlbFwiOntcIiRcIjowfSxcImFrZG5cIjp7XCIkXCI6MH0sXCJhbGZhcm9tZW9cIjp7XCIkXCI6MH0sXCJhbGliYWJhXCI6e1wiJFwiOjB9LFwiYWxpcGF5XCI6e1wiJFwiOjB9LFwiYWxsZmluYW56XCI6e1wiJFwiOjB9LFwiYWxsc3RhdGVcIjp7XCIkXCI6MH0sXCJhbGx5XCI6e1wiJFwiOjB9LFwiYWxzYWNlXCI6e1wiJFwiOjB9LFwiYWxzdG9tXCI6e1wiJFwiOjB9LFwiYW1lcmljYW5leHByZXNzXCI6e1wiJFwiOjB9LFwiYW1lcmljYW5mYW1pbHlcIjp7XCIkXCI6MH0sXCJhbWV4XCI6e1wiJFwiOjB9LFwiYW1mYW1cIjp7XCIkXCI6MH0sXCJhbWljYVwiOntcIiRcIjowfSxcImFtc3RlcmRhbVwiOntcIiRcIjowfSxcImFuYWx5dGljc1wiOntcIiRcIjowfSxcImFuZHJvaWRcIjp7XCIkXCI6MH0sXCJhbnF1YW5cIjp7XCIkXCI6MH0sXCJhbnpcIjp7XCIkXCI6MH0sXCJhb2xcIjp7XCIkXCI6MH0sXCJhcGFydG1lbnRzXCI6e1wiJFwiOjB9LFwiYXBwXCI6e1wiJFwiOjB9LFwiYXBwbGVcIjp7XCIkXCI6MH0sXCJhcXVhcmVsbGVcIjp7XCIkXCI6MH0sXCJhcmFiXCI6e1wiJFwiOjB9LFwiYXJhbWNvXCI6e1wiJFwiOjB9LFwiYXJjaGlcIjp7XCIkXCI6MH0sXCJhcm15XCI6e1wiJFwiOjB9LFwiYXJ0XCI6e1wiJFwiOjB9LFwiYXJ0ZVwiOntcIiRcIjowfSxcImFzZGFcIjp7XCIkXCI6MH0sXCJhc3NvY2lhdGVzXCI6e1wiJFwiOjB9LFwiYXRobGV0YVwiOntcIiRcIjowfSxcImF0dG9ybmV5XCI6e1wiJFwiOjB9LFwiYXVjdGlvblwiOntcIiRcIjowfSxcImF1ZGlcIjp7XCIkXCI6MH0sXCJhdWRpYmxlXCI6e1wiJFwiOjB9LFwiYXVkaW9cIjp7XCIkXCI6MH0sXCJhdXNwb3N0XCI6e1wiJFwiOjB9LFwiYXV0aG9yXCI6e1wiJFwiOjB9LFwiYXV0b1wiOntcIiRcIjowfSxcImF1dG9zXCI6e1wiJFwiOjB9LFwiYXZpYW5jYVwiOntcIiRcIjowfSxcImF3c1wiOntcIiRcIjowfSxcImF4YVwiOntcIiRcIjowfSxcImF6dXJlXCI6e1wiJFwiOjB9LFwiYmFieVwiOntcIiRcIjowfSxcImJhaWR1XCI6e1wiJFwiOjB9LFwiYmFuYW1leFwiOntcIiRcIjowfSxcImJhbmFuYXJlcHVibGljXCI6e1wiJFwiOjB9LFwiYmFuZFwiOntcIiRcIjowfSxcImJhbmtcIjp7XCIkXCI6MH0sXCJiYXJcIjp7XCIkXCI6MH0sXCJiYXJjZWxvbmFcIjp7XCIkXCI6MH0sXCJiYXJjbGF5Y2FyZFwiOntcIiRcIjowfSxcImJhcmNsYXlzXCI6e1wiJFwiOjB9LFwiYmFyZWZvb3RcIjp7XCIkXCI6MH0sXCJiYXJnYWluc1wiOntcIiRcIjowfSxcImJhc2ViYWxsXCI6e1wiJFwiOjB9LFwiYmFza2V0YmFsbFwiOntcIiRcIjowfSxcImJhdWhhdXNcIjp7XCIkXCI6MH0sXCJiYXllcm5cIjp7XCIkXCI6MH0sXCJiYmNcIjp7XCIkXCI6MH0sXCJiYnRcIjp7XCIkXCI6MH0sXCJiYnZhXCI6e1wiJFwiOjB9LFwiYmNnXCI6e1wiJFwiOjB9LFwiYmNuXCI6e1wiJFwiOjB9LFwiYmVhdHNcIjp7XCIkXCI6MH0sXCJiZWF1dHlcIjp7XCIkXCI6MH0sXCJiZWVyXCI6e1wiJFwiOjB9LFwiYmVudGxleVwiOntcIiRcIjowfSxcImJlcmxpblwiOntcIiRcIjowfSxcImJlc3RcIjp7XCIkXCI6MH0sXCJiZXN0YnV5XCI6e1wiJFwiOjB9LFwiYmV0XCI6e1wiJFwiOjB9LFwiYmhhcnRpXCI6e1wiJFwiOjB9LFwiYmlibGVcIjp7XCIkXCI6MH0sXCJiaWRcIjp7XCIkXCI6MH0sXCJiaWtlXCI6e1wiJFwiOjB9LFwiYmluZ1wiOntcIiRcIjowfSxcImJpbmdvXCI6e1wiJFwiOjB9LFwiYmlvXCI6e1wiJFwiOjB9LFwiYmxhY2tcIjp7XCIkXCI6MH0sXCJibGFja2ZyaWRheVwiOntcIiRcIjowfSxcImJsYW5jb1wiOntcIiRcIjowfSxcImJsb2NrYnVzdGVyXCI6e1wiJFwiOjB9LFwiYmxvZ1wiOntcIiRcIjowfSxcImJsb29tYmVyZ1wiOntcIiRcIjowfSxcImJsdWVcIjp7XCIkXCI6MH0sXCJibXNcIjp7XCIkXCI6MH0sXCJibXdcIjp7XCIkXCI6MH0sXCJibmxcIjp7XCIkXCI6MH0sXCJibnBwYXJpYmFzXCI6e1wiJFwiOjB9LFwiYm9hdHNcIjp7XCIkXCI6MH0sXCJib2VocmluZ2VyXCI6e1wiJFwiOjB9LFwiYm9mYVwiOntcIiRcIjowfSxcImJvbVwiOntcIiRcIjowfSxcImJvbmRcIjp7XCIkXCI6MH0sXCJib29cIjp7XCIkXCI6MH0sXCJib29rXCI6e1wiJFwiOjB9LFwiYm9va2luZ1wiOntcIiRcIjowfSxcImJvb3RzXCI6e1wiJFwiOjB9LFwiYm9zY2hcIjp7XCIkXCI6MH0sXCJib3N0aWtcIjp7XCIkXCI6MH0sXCJib3N0b25cIjp7XCIkXCI6MH0sXCJib3RcIjp7XCIkXCI6MH0sXCJib3V0aXF1ZVwiOntcIiRcIjowfSxcImJveFwiOntcIiRcIjowfSxcImJyYWRlc2NvXCI6e1wiJFwiOjB9LFwiYnJpZGdlc3RvbmVcIjp7XCIkXCI6MH0sXCJicm9hZHdheVwiOntcIiRcIjowfSxcImJyb2tlclwiOntcIiRcIjowfSxcImJyb3RoZXJcIjp7XCIkXCI6MH0sXCJicnVzc2Vsc1wiOntcIiRcIjowfSxcImJ1ZGFwZXN0XCI6e1wiJFwiOjB9LFwiYnVnYXR0aVwiOntcIiRcIjowfSxcImJ1aWxkXCI6e1wiJFwiOjB9LFwiYnVpbGRlcnNcIjp7XCIkXCI6MH0sXCJidXNpbmVzc1wiOntcIiRcIjowfSxcImJ1eVwiOntcIiRcIjowfSxcImJ1enpcIjp7XCIkXCI6MH0sXCJiemhcIjp7XCIkXCI6MH0sXCJjYWJcIjp7XCIkXCI6MH0sXCJjYWZlXCI6e1wiJFwiOjB9LFwiY2FsXCI6e1wiJFwiOjB9LFwiY2FsbFwiOntcIiRcIjowfSxcImNhbHZpbmtsZWluXCI6e1wiJFwiOjB9LFwiY2FtXCI6e1wiJFwiOjB9LFwiY2FtZXJhXCI6e1wiJFwiOjB9LFwiY2FtcFwiOntcIiRcIjowfSxcImNhbmNlcnJlc2VhcmNoXCI6e1wiJFwiOjB9LFwiY2Fub25cIjp7XCIkXCI6MH0sXCJjYXBldG93blwiOntcIiRcIjowfSxcImNhcGl0YWxcIjp7XCIkXCI6MH0sXCJjYXBpdGFsb25lXCI6e1wiJFwiOjB9LFwiY2FyXCI6e1wiJFwiOjB9LFwiY2FyYXZhblwiOntcIiRcIjowfSxcImNhcmRzXCI6e1wiJFwiOjB9LFwiY2FyZVwiOntcIiRcIjowfSxcImNhcmVlclwiOntcIiRcIjowfSxcImNhcmVlcnNcIjp7XCIkXCI6MH0sXCJjYXJzXCI6e1wiJFwiOjB9LFwiY2FydGllclwiOntcIiRcIjowfSxcImNhc2FcIjp7XCIkXCI6MH0sXCJjYXNlXCI6e1wiJFwiOjB9LFwiY2FzZWloXCI6e1wiJFwiOjB9LFwiY2FzaFwiOntcIiRcIjowfSxcImNhc2lub1wiOntcIiRcIjowfSxcImNhdGVyaW5nXCI6e1wiJFwiOjB9LFwiY2F0aG9saWNcIjp7XCIkXCI6MH0sXCJjYmFcIjp7XCIkXCI6MH0sXCJjYm5cIjp7XCIkXCI6MH0sXCJjYnJlXCI6e1wiJFwiOjB9LFwiY2JzXCI6e1wiJFwiOjB9LFwiY2ViXCI6e1wiJFwiOjB9LFwiY2VudGVyXCI6e1wiJFwiOjB9LFwiY2VvXCI6e1wiJFwiOjB9LFwiY2VyblwiOntcIiRcIjowfSxcImNmYVwiOntcIiRcIjowfSxcImNmZFwiOntcIiRcIjowfSxcImNoYW5lbFwiOntcIiRcIjowfSxcImNoYW5uZWxcIjp7XCIkXCI6MH0sXCJjaGFzZVwiOntcIiRcIjowfSxcImNoYXRcIjp7XCIkXCI6MH0sXCJjaGVhcFwiOntcIiRcIjowfSxcImNoaW50YWlcIjp7XCIkXCI6MH0sXCJjaGxvZVwiOntcIiRcIjowfSxcImNocmlzdG1hc1wiOntcIiRcIjowfSxcImNocm9tZVwiOntcIiRcIjowfSxcImNocnlzbGVyXCI6e1wiJFwiOjB9LFwiY2h1cmNoXCI6e1wiJFwiOjB9LFwiY2lwcmlhbmlcIjp7XCIkXCI6MH0sXCJjaXJjbGVcIjp7XCIkXCI6MH0sXCJjaXNjb1wiOntcIiRcIjowfSxcImNpdGFkZWxcIjp7XCIkXCI6MH0sXCJjaXRpXCI6e1wiJFwiOjB9LFwiY2l0aWNcIjp7XCIkXCI6MH0sXCJjaXR5XCI6e1wiJFwiOjB9LFwiY2l0eWVhdHNcIjp7XCIkXCI6MH0sXCJjbGFpbXNcIjp7XCIkXCI6MH0sXCJjbGVhbmluZ1wiOntcIiRcIjowfSxcImNsaWNrXCI6e1wiJFwiOjB9LFwiY2xpbmljXCI6e1wiJFwiOjB9LFwiY2xpbmlxdWVcIjp7XCIkXCI6MH0sXCJjbG90aGluZ1wiOntcIiRcIjowfSxcImNsb3VkXCI6e1wiJFwiOjAsXCJteWZ1c2lvblwiOntcIiRcIjowfSxcInN0YXRpY3NcIjp7XCIqXCI6e1wiJFwiOjB9fSxcIm1hZ2VudG9zaXRlXCI6e1wiKlwiOntcIiRcIjowfX0sXCJ2YXBvclwiOntcIiRcIjowfSxcInNlbnNpb3NpdGVcIjp7XCIqXCI6e1wiJFwiOjB9fSxcInRyYWZmaWNwbGV4XCI6e1wiJFwiOjB9fSxcImNsdWJcIjp7XCIkXCI6MCxcImNsb3VkbnNcIjp7XCIkXCI6MH19LFwiY2x1Ym1lZFwiOntcIiRcIjowfSxcImNvYWNoXCI6e1wiJFwiOjB9LFwiY29kZXNcIjp7XCIkXCI6MH0sXCJjb2ZmZWVcIjp7XCIkXCI6MH0sXCJjb2xsZWdlXCI6e1wiJFwiOjB9LFwiY29sb2duZVwiOntcIiRcIjowfSxcImNvbWNhc3RcIjp7XCIkXCI6MH0sXCJjb21tYmFua1wiOntcIiRcIjowfSxcImNvbW11bml0eVwiOntcIiRcIjowfSxcImNvbXBhbnlcIjp7XCIkXCI6MH0sXCJjb21wYXJlXCI6e1wiJFwiOjB9LFwiY29tcHV0ZXJcIjp7XCIkXCI6MH0sXCJjb21zZWNcIjp7XCIkXCI6MH0sXCJjb25kb3NcIjp7XCIkXCI6MH0sXCJjb25zdHJ1Y3Rpb25cIjp7XCIkXCI6MH0sXCJjb25zdWx0aW5nXCI6e1wiJFwiOjB9LFwiY29udGFjdFwiOntcIiRcIjowfSxcImNvbnRyYWN0b3JzXCI6e1wiJFwiOjB9LFwiY29va2luZ1wiOntcIiRcIjowfSxcImNvb2tpbmdjaGFubmVsXCI6e1wiJFwiOjB9LFwiY29vbFwiOntcIiRcIjowLFwiZGVcIjp7XCIkXCI6MH19LFwiY29yc2ljYVwiOntcIiRcIjowfSxcImNvdW50cnlcIjp7XCIkXCI6MH0sXCJjb3Vwb25cIjp7XCIkXCI6MH0sXCJjb3Vwb25zXCI6e1wiJFwiOjB9LFwiY291cnNlc1wiOntcIiRcIjowfSxcImNyZWRpdFwiOntcIiRcIjowfSxcImNyZWRpdGNhcmRcIjp7XCIkXCI6MH0sXCJjcmVkaXR1bmlvblwiOntcIiRcIjowfSxcImNyaWNrZXRcIjp7XCIkXCI6MH0sXCJjcm93blwiOntcIiRcIjowfSxcImNyc1wiOntcIiRcIjowfSxcImNydWlzZVwiOntcIiRcIjowfSxcImNydWlzZXNcIjp7XCIkXCI6MH0sXCJjc2NcIjp7XCIkXCI6MH0sXCJjdWlzaW5lbGxhXCI6e1wiJFwiOjB9LFwiY3ltcnVcIjp7XCIkXCI6MH0sXCJjeW91XCI6e1wiJFwiOjB9LFwiZGFidXJcIjp7XCIkXCI6MH0sXCJkYWRcIjp7XCIkXCI6MH0sXCJkYW5jZVwiOntcIiRcIjowfSxcImRhdGFcIjp7XCIkXCI6MH0sXCJkYXRlXCI6e1wiJFwiOjB9LFwiZGF0aW5nXCI6e1wiJFwiOjB9LFwiZGF0c3VuXCI6e1wiJFwiOjB9LFwiZGF5XCI6e1wiJFwiOjB9LFwiZGNsa1wiOntcIiRcIjowfSxcImRkc1wiOntcIiRcIjowfSxcImRlYWxcIjp7XCIkXCI6MH0sXCJkZWFsZXJcIjp7XCIkXCI6MH0sXCJkZWFsc1wiOntcIiRcIjowfSxcImRlZ3JlZVwiOntcIiRcIjowfSxcImRlbGl2ZXJ5XCI6e1wiJFwiOjB9LFwiZGVsbFwiOntcIiRcIjowfSxcImRlbG9pdHRlXCI6e1wiJFwiOjB9LFwiZGVsdGFcIjp7XCIkXCI6MH0sXCJkZW1vY3JhdFwiOntcIiRcIjowfSxcImRlbnRhbFwiOntcIiRcIjowfSxcImRlbnRpc3RcIjp7XCIkXCI6MH0sXCJkZXNpXCI6e1wiJFwiOjB9LFwiZGVzaWduXCI6e1wiJFwiOjB9LFwiZGV2XCI6e1wiJFwiOjB9LFwiZGhsXCI6e1wiJFwiOjB9LFwiZGlhbW9uZHNcIjp7XCIkXCI6MH0sXCJkaWV0XCI6e1wiJFwiOjB9LFwiZGlnaXRhbFwiOntcIiRcIjowfSxcImRpcmVjdFwiOntcIiRcIjowfSxcImRpcmVjdG9yeVwiOntcIiRcIjowfSxcImRpc2NvdW50XCI6e1wiJFwiOjB9LFwiZGlzY292ZXJcIjp7XCIkXCI6MH0sXCJkaXNoXCI6e1wiJFwiOjB9LFwiZGl5XCI6e1wiJFwiOjB9LFwiZG5wXCI6e1wiJFwiOjB9LFwiZG9jc1wiOntcIiRcIjowfSxcImRvY3RvclwiOntcIiRcIjowfSxcImRvZGdlXCI6e1wiJFwiOjB9LFwiZG9nXCI6e1wiJFwiOjB9LFwiZG9oYVwiOntcIiRcIjowfSxcImRvbWFpbnNcIjp7XCIkXCI6MH0sXCJkb3RcIjp7XCIkXCI6MH0sXCJkb3dubG9hZFwiOntcIiRcIjowfSxcImRyaXZlXCI6e1wiJFwiOjB9LFwiZHR2XCI6e1wiJFwiOjB9LFwiZHViYWlcIjp7XCIkXCI6MH0sXCJkdWNrXCI6e1wiJFwiOjB9LFwiZHVubG9wXCI6e1wiJFwiOjB9LFwiZHVuc1wiOntcIiRcIjowfSxcImR1cG9udFwiOntcIiRcIjowfSxcImR1cmJhblwiOntcIiRcIjowfSxcImR2YWdcIjp7XCIkXCI6MH0sXCJkdnJcIjp7XCIkXCI6MH0sXCJlYXJ0aFwiOntcIiRcIjowfSxcImVhdFwiOntcIiRcIjowfSxcImVjb1wiOntcIiRcIjowfSxcImVkZWthXCI6e1wiJFwiOjB9LFwiZWR1Y2F0aW9uXCI6e1wiJFwiOjB9LFwiZW1haWxcIjp7XCIkXCI6MH0sXCJlbWVyY2tcIjp7XCIkXCI6MH0sXCJlbmVyZ3lcIjp7XCIkXCI6MH0sXCJlbmdpbmVlclwiOntcIiRcIjowfSxcImVuZ2luZWVyaW5nXCI6e1wiJFwiOjB9LFwiZW50ZXJwcmlzZXNcIjp7XCIkXCI6MH0sXCJlcG9zdFwiOntcIiRcIjowfSxcImVwc29uXCI6e1wiJFwiOjB9LFwiZXF1aXBtZW50XCI6e1wiJFwiOjB9LFwiZXJpY3Nzb25cIjp7XCIkXCI6MH0sXCJlcm5pXCI6e1wiJFwiOjB9LFwiZXNxXCI6e1wiJFwiOjB9LFwiZXN0YXRlXCI6e1wiJFwiOjAsXCJjb21wdXRlXCI6e1wiKlwiOntcIiRcIjowfX19LFwiZXN1cmFuY2VcIjp7XCIkXCI6MH0sXCJldGlzYWxhdFwiOntcIiRcIjowfSxcImV1cm92aXNpb25cIjp7XCIkXCI6MH0sXCJldXNcIjp7XCIkXCI6MCxcInBhcnR5XCI6e1widXNlclwiOntcIiRcIjowfX19LFwiZXZlbnRzXCI6e1wiJFwiOjB9LFwiZXZlcmJhbmtcIjp7XCIkXCI6MH0sXCJleGNoYW5nZVwiOntcIiRcIjowfSxcImV4cGVydFwiOntcIiRcIjowfSxcImV4cG9zZWRcIjp7XCIkXCI6MH0sXCJleHByZXNzXCI6e1wiJFwiOjB9LFwiZXh0cmFzcGFjZVwiOntcIiRcIjowfSxcImZhZ2VcIjp7XCIkXCI6MH0sXCJmYWlsXCI6e1wiJFwiOjB9LFwiZmFpcndpbmRzXCI6e1wiJFwiOjB9LFwiZmFpdGhcIjp7XCIkXCI6MCxcInlib1wiOntcIiRcIjowfX0sXCJmYW1pbHlcIjp7XCIkXCI6MH0sXCJmYW5cIjp7XCIkXCI6MH0sXCJmYW5zXCI6e1wiJFwiOjB9LFwiZmFybVwiOntcIiRcIjowLFwic3RvcmpcIjp7XCIkXCI6MH19LFwiZmFybWVyc1wiOntcIiRcIjowfSxcImZhc2hpb25cIjp7XCIkXCI6MH0sXCJmYXN0XCI6e1wiJFwiOjB9LFwiZmVkZXhcIjp7XCIkXCI6MH0sXCJmZWVkYmFja1wiOntcIiRcIjowfSxcImZlcnJhcmlcIjp7XCIkXCI6MH0sXCJmZXJyZXJvXCI6e1wiJFwiOjB9LFwiZmlhdFwiOntcIiRcIjowfSxcImZpZGVsaXR5XCI6e1wiJFwiOjB9LFwiZmlkb1wiOntcIiRcIjowfSxcImZpbG1cIjp7XCIkXCI6MH0sXCJmaW5hbFwiOntcIiRcIjowfSxcImZpbmFuY2VcIjp7XCIkXCI6MH0sXCJmaW5hbmNpYWxcIjp7XCIkXCI6MH0sXCJmaXJlXCI6e1wiJFwiOjB9LFwiZmlyZXN0b25lXCI6e1wiJFwiOjB9LFwiZmlybWRhbGVcIjp7XCIkXCI6MH0sXCJmaXNoXCI6e1wiJFwiOjB9LFwiZmlzaGluZ1wiOntcIiRcIjowfSxcImZpdFwiOntcIiRcIjowLFwicHRwbHVzXCI6e1wiJFwiOjB9fSxcImZpdG5lc3NcIjp7XCIkXCI6MH0sXCJmbGlja3JcIjp7XCIkXCI6MH0sXCJmbGlnaHRzXCI6e1wiJFwiOjB9LFwiZmxpclwiOntcIiRcIjowfSxcImZsb3Jpc3RcIjp7XCIkXCI6MH0sXCJmbG93ZXJzXCI6e1wiJFwiOjB9LFwiZmx5XCI6e1wiJFwiOjB9LFwiZm9vXCI6e1wiJFwiOjB9LFwiZm9vZFwiOntcIiRcIjowfSxcImZvb2RuZXR3b3JrXCI6e1wiJFwiOjB9LFwiZm9vdGJhbGxcIjp7XCIkXCI6MH0sXCJmb3JkXCI6e1wiJFwiOjB9LFwiZm9yZXhcIjp7XCIkXCI6MH0sXCJmb3JzYWxlXCI6e1wiJFwiOjB9LFwiZm9ydW1cIjp7XCIkXCI6MH0sXCJmb3VuZGF0aW9uXCI6e1wiJFwiOjB9LFwiZm94XCI6e1wiJFwiOjB9LFwiZnJlZVwiOntcIiRcIjowfSxcImZyZXNlbml1c1wiOntcIiRcIjowfSxcImZybFwiOntcIiRcIjowfSxcImZyb2dhbnNcIjp7XCIkXCI6MH0sXCJmcm9udGRvb3JcIjp7XCIkXCI6MH0sXCJmcm9udGllclwiOntcIiRcIjowfSxcImZ0clwiOntcIiRcIjowfSxcImZ1aml0c3VcIjp7XCIkXCI6MH0sXCJmdWppeGVyb3hcIjp7XCIkXCI6MH0sXCJmdW5cIjp7XCIkXCI6MH0sXCJmdW5kXCI6e1wiJFwiOjB9LFwiZnVybml0dXJlXCI6e1wiJFwiOjB9LFwiZnV0Ym9sXCI6e1wiJFwiOjB9LFwiZnlpXCI6e1wiJFwiOjB9LFwiZ2FsXCI6e1wiJFwiOjB9LFwiZ2FsbGVyeVwiOntcIiRcIjowfSxcImdhbGxvXCI6e1wiJFwiOjB9LFwiZ2FsbHVwXCI6e1wiJFwiOjB9LFwiZ2FtZVwiOntcIiRcIjowfSxcImdhbWVzXCI6e1wiJFwiOjB9LFwiZ2FwXCI6e1wiJFwiOjB9LFwiZ2FyZGVuXCI6e1wiJFwiOjB9LFwiZ2JpelwiOntcIiRcIjowfSxcImdkblwiOntcIiRcIjowfSxcImdlYVwiOntcIiRcIjowfSxcImdlbnRcIjp7XCIkXCI6MH0sXCJnZW50aW5nXCI6e1wiJFwiOjB9LFwiZ2VvcmdlXCI6e1wiJFwiOjB9LFwiZ2dlZVwiOntcIiRcIjowfSxcImdpZnRcIjp7XCIkXCI6MH0sXCJnaWZ0c1wiOntcIiRcIjowfSxcImdpdmVzXCI6e1wiJFwiOjB9LFwiZ2l2aW5nXCI6e1wiJFwiOjB9LFwiZ2xhZGVcIjp7XCIkXCI6MH0sXCJnbGFzc1wiOntcIiRcIjowfSxcImdsZVwiOntcIiRcIjowfSxcImdsb2JhbFwiOntcIiRcIjowfSxcImdsb2JvXCI6e1wiJFwiOjB9LFwiZ21haWxcIjp7XCIkXCI6MH0sXCJnbWJoXCI6e1wiJFwiOjB9LFwiZ21vXCI6e1wiJFwiOjB9LFwiZ214XCI6e1wiJFwiOjB9LFwiZ29kYWRkeVwiOntcIiRcIjowfSxcImdvbGRcIjp7XCIkXCI6MH0sXCJnb2xkcG9pbnRcIjp7XCIkXCI6MH0sXCJnb2xmXCI6e1wiJFwiOjB9LFwiZ29vXCI6e1wiJFwiOjB9LFwiZ29vZGhhbmRzXCI6e1wiJFwiOjB9LFwiZ29vZHllYXJcIjp7XCIkXCI6MH0sXCJnb29nXCI6e1wiJFwiOjAsXCJjbG91ZFwiOntcIiRcIjowfX0sXCJnb29nbGVcIjp7XCIkXCI6MH0sXCJnb3BcIjp7XCIkXCI6MH0sXCJnb3RcIjp7XCIkXCI6MH0sXCJncmFpbmdlclwiOntcIiRcIjowfSxcImdyYXBoaWNzXCI6e1wiJFwiOjB9LFwiZ3JhdGlzXCI6e1wiJFwiOjB9LFwiZ3JlZW5cIjp7XCIkXCI6MH0sXCJncmlwZVwiOntcIiRcIjowfSxcImdyb2NlcnlcIjp7XCIkXCI6MH0sXCJncm91cFwiOntcIiRcIjowfSxcImd1YXJkaWFuXCI6e1wiJFwiOjB9LFwiZ3VjY2lcIjp7XCIkXCI6MH0sXCJndWdlXCI6e1wiJFwiOjB9LFwiZ3VpZGVcIjp7XCIkXCI6MH0sXCJndWl0YXJzXCI6e1wiJFwiOjB9LFwiZ3VydVwiOntcIiRcIjowfSxcImhhaXJcIjp7XCIkXCI6MH0sXCJoYW1idXJnXCI6e1wiJFwiOjB9LFwiaGFuZ291dFwiOntcIiRcIjowfSxcImhhdXNcIjp7XCIkXCI6MH0sXCJoYm9cIjp7XCIkXCI6MH0sXCJoZGZjXCI6e1wiJFwiOjB9LFwiaGRmY2JhbmtcIjp7XCIkXCI6MH0sXCJoZWFsdGhcIjp7XCIkXCI6MH0sXCJoZWFsdGhjYXJlXCI6e1wiJFwiOjB9LFwiaGVscFwiOntcIiRcIjowfSxcImhlbHNpbmtpXCI6e1wiJFwiOjB9LFwiaGVyZVwiOntcIiRcIjowfSxcImhlcm1lc1wiOntcIiRcIjowfSxcImhndHZcIjp7XCIkXCI6MH0sXCJoaXBob3BcIjp7XCIkXCI6MH0sXCJoaXNhbWl0c3VcIjp7XCIkXCI6MH0sXCJoaXRhY2hpXCI6e1wiJFwiOjB9LFwiaGl2XCI6e1wiJFwiOjB9LFwiaGt0XCI6e1wiJFwiOjB9LFwiaG9ja2V5XCI6e1wiJFwiOjB9LFwiaG9sZGluZ3NcIjp7XCIkXCI6MH0sXCJob2xpZGF5XCI6e1wiJFwiOjB9LFwiaG9tZWRlcG90XCI6e1wiJFwiOjB9LFwiaG9tZWdvb2RzXCI6e1wiJFwiOjB9LFwiaG9tZXNcIjp7XCIkXCI6MH0sXCJob21lc2Vuc2VcIjp7XCIkXCI6MH0sXCJob25kYVwiOntcIiRcIjowfSxcImhvbmV5d2VsbFwiOntcIiRcIjowfSxcImhvcnNlXCI6e1wiJFwiOjB9LFwiaG9zcGl0YWxcIjp7XCIkXCI6MH0sXCJob3N0XCI6e1wiJFwiOjAsXCJjbG91ZGFjY2Vzc1wiOntcIiRcIjowfSxcImZyZWVzaXRlXCI6e1wiJFwiOjB9fSxcImhvc3RpbmdcIjp7XCIkXCI6MCxcIm9wZW5jcmFmdFwiOntcIiRcIjowfX0sXCJob3RcIjp7XCIkXCI6MH0sXCJob3RlbGVzXCI6e1wiJFwiOjB9LFwiaG90ZWxzXCI6e1wiJFwiOjB9LFwiaG90bWFpbFwiOntcIiRcIjowfSxcImhvdXNlXCI6e1wiJFwiOjB9LFwiaG93XCI6e1wiJFwiOjB9LFwiaHNiY1wiOntcIiRcIjowfSxcImh0Y1wiOntcIiRcIjowfSxcImh1Z2hlc1wiOntcIiRcIjowfSxcImh5YXR0XCI6e1wiJFwiOjB9LFwiaHl1bmRhaVwiOntcIiRcIjowfSxcImlibVwiOntcIiRcIjowfSxcImljYmNcIjp7XCIkXCI6MH0sXCJpY2VcIjp7XCIkXCI6MH0sXCJpY3VcIjp7XCIkXCI6MH0sXCJpZWVlXCI6e1wiJFwiOjB9LFwiaWZtXCI6e1wiJFwiOjB9LFwiaWthbm9cIjp7XCIkXCI6MH0sXCJpbWFtYXRcIjp7XCIkXCI6MH0sXCJpbWRiXCI6e1wiJFwiOjB9LFwiaW1tb1wiOntcIiRcIjowfSxcImltbW9iaWxpZW5cIjp7XCIkXCI6MH0sXCJpbmR1c3RyaWVzXCI6e1wiJFwiOjB9LFwiaW5maW5pdGlcIjp7XCIkXCI6MH0sXCJpbmdcIjp7XCIkXCI6MH0sXCJpbmtcIjp7XCIkXCI6MH0sXCJpbnN0aXR1dGVcIjp7XCIkXCI6MH0sXCJpbnN1cmFuY2VcIjp7XCIkXCI6MH0sXCJpbnN1cmVcIjp7XCIkXCI6MH0sXCJpbnRlbFwiOntcIiRcIjowfSxcImludGVybmF0aW9uYWxcIjp7XCIkXCI6MH0sXCJpbnR1aXRcIjp7XCIkXCI6MH0sXCJpbnZlc3RtZW50c1wiOntcIiRcIjowfSxcImlwaXJhbmdhXCI6e1wiJFwiOjB9LFwiaXJpc2hcIjp7XCIkXCI6MH0sXCJpc2VsZWN0XCI6e1wiJFwiOjB9LFwiaXNtYWlsaVwiOntcIiRcIjowfSxcImlzdFwiOntcIiRcIjowfSxcImlzdGFuYnVsXCI6e1wiJFwiOjB9LFwiaXRhdVwiOntcIiRcIjowfSxcIml0dlwiOntcIiRcIjowfSxcIml2ZWNvXCI6e1wiJFwiOjB9LFwiaXdjXCI6e1wiJFwiOjB9LFwiamFndWFyXCI6e1wiJFwiOjB9LFwiamF2YVwiOntcIiRcIjowfSxcImpjYlwiOntcIiRcIjowfSxcImpjcFwiOntcIiRcIjowfSxcImplZXBcIjp7XCIkXCI6MH0sXCJqZXR6dFwiOntcIiRcIjowfSxcImpld2VscnlcIjp7XCIkXCI6MH0sXCJqaW9cIjp7XCIkXCI6MH0sXCJqbGNcIjp7XCIkXCI6MH0sXCJqbGxcIjp7XCIkXCI6MH0sXCJqbXBcIjp7XCIkXCI6MH0sXCJqbmpcIjp7XCIkXCI6MH0sXCJqb2J1cmdcIjp7XCIkXCI6MH0sXCJqb3RcIjp7XCIkXCI6MH0sXCJqb3lcIjp7XCIkXCI6MH0sXCJqcG1vcmdhblwiOntcIiRcIjowfSxcImpwcnNcIjp7XCIkXCI6MH0sXCJqdWVnb3NcIjp7XCIkXCI6MH0sXCJqdW5pcGVyXCI6e1wiJFwiOjB9LFwia2F1ZmVuXCI6e1wiJFwiOjB9LFwia2RkaVwiOntcIiRcIjowfSxcImtlcnJ5aG90ZWxzXCI6e1wiJFwiOjB9LFwia2Vycnlsb2dpc3RpY3NcIjp7XCIkXCI6MH0sXCJrZXJyeXByb3BlcnRpZXNcIjp7XCIkXCI6MH0sXCJrZmhcIjp7XCIkXCI6MH0sXCJraWFcIjp7XCIkXCI6MH0sXCJraW1cIjp7XCIkXCI6MH0sXCJraW5kZXJcIjp7XCIkXCI6MH0sXCJraW5kbGVcIjp7XCIkXCI6MH0sXCJraXRjaGVuXCI6e1wiJFwiOjB9LFwia2l3aVwiOntcIiRcIjowfSxcImtvZWxuXCI6e1wiJFwiOjB9LFwia29tYXRzdVwiOntcIiRcIjowfSxcImtvc2hlclwiOntcIiRcIjowfSxcImtwbWdcIjp7XCIkXCI6MH0sXCJrcG5cIjp7XCIkXCI6MH0sXCJrcmRcIjp7XCIkXCI6MCxcImNvXCI6e1wiJFwiOjB9LFwiZWR1XCI6e1wiJFwiOjB9fSxcImtyZWRcIjp7XCIkXCI6MH0sXCJrdW9rZ3JvdXBcIjp7XCIkXCI6MH0sXCJreW90b1wiOntcIiRcIjowfSxcImxhY2FpeGFcIjp7XCIkXCI6MH0sXCJsYWRicm9rZXNcIjp7XCIkXCI6MH0sXCJsYW1ib3JnaGluaVwiOntcIiRcIjowfSxcImxhbWVyXCI6e1wiJFwiOjB9LFwibGFuY2FzdGVyXCI6e1wiJFwiOjB9LFwibGFuY2lhXCI6e1wiJFwiOjB9LFwibGFuY29tZVwiOntcIiRcIjowfSxcImxhbmRcIjp7XCIkXCI6MCxcInN0YXRpY1wiOntcIiRcIjowLFwiZGV2XCI6e1wiJFwiOjB9LFwic2l0ZXNcIjp7XCIkXCI6MH19fSxcImxhbmRyb3ZlclwiOntcIiRcIjowfSxcImxhbnhlc3NcIjp7XCIkXCI6MH0sXCJsYXNhbGxlXCI6e1wiJFwiOjB9LFwibGF0XCI6e1wiJFwiOjB9LFwibGF0aW5vXCI6e1wiJFwiOjB9LFwibGF0cm9iZVwiOntcIiRcIjowfSxcImxhd1wiOntcIiRcIjowfSxcImxhd3llclwiOntcIiRcIjowfSxcImxkc1wiOntcIiRcIjowfSxcImxlYXNlXCI6e1wiJFwiOjB9LFwibGVjbGVyY1wiOntcIiRcIjowfSxcImxlZnJha1wiOntcIiRcIjowfSxcImxlZ2FsXCI6e1wiJFwiOjB9LFwibGVnb1wiOntcIiRcIjowfSxcImxleHVzXCI6e1wiJFwiOjB9LFwibGdidFwiOntcIiRcIjowfSxcImxpYWlzb25cIjp7XCIkXCI6MH0sXCJsaWRsXCI6e1wiJFwiOjB9LFwibGlmZVwiOntcIiRcIjowfSxcImxpZmVpbnN1cmFuY2VcIjp7XCIkXCI6MH0sXCJsaWZlc3R5bGVcIjp7XCIkXCI6MH0sXCJsaWdodGluZ1wiOntcIiRcIjowfSxcImxpa2VcIjp7XCIkXCI6MH0sXCJsaWxseVwiOntcIiRcIjowfSxcImxpbWl0ZWRcIjp7XCIkXCI6MH0sXCJsaW1vXCI6e1wiJFwiOjB9LFwibGluY29sblwiOntcIiRcIjowfSxcImxpbmRlXCI6e1wiJFwiOjB9LFwibGlua1wiOntcIiRcIjowLFwiY3lvblwiOntcIiRcIjowfSxcIm15cGVwXCI6e1wiJFwiOjB9fSxcImxpcHN5XCI6e1wiJFwiOjB9LFwibGl2ZVwiOntcIiRcIjowfSxcImxpdmluZ1wiOntcIiRcIjowfSxcImxpeGlsXCI6e1wiJFwiOjB9LFwibG9hblwiOntcIiRcIjowfSxcImxvYW5zXCI6e1wiJFwiOjB9LFwibG9ja2VyXCI6e1wiJFwiOjB9LFwibG9jdXNcIjp7XCIkXCI6MH0sXCJsb2Z0XCI6e1wiJFwiOjB9LFwibG9sXCI6e1wiJFwiOjB9LFwibG9uZG9uXCI6e1wiJFwiOjB9LFwibG90dGVcIjp7XCIkXCI6MH0sXCJsb3R0b1wiOntcIiRcIjowfSxcImxvdmVcIjp7XCIkXCI6MH0sXCJscGxcIjp7XCIkXCI6MH0sXCJscGxmaW5hbmNpYWxcIjp7XCIkXCI6MH0sXCJsdGRcIjp7XCIkXCI6MH0sXCJsdGRhXCI6e1wiJFwiOjB9LFwibHVuZGJlY2tcIjp7XCIkXCI6MH0sXCJsdXBpblwiOntcIiRcIjowfSxcImx1eGVcIjp7XCIkXCI6MH0sXCJsdXh1cnlcIjp7XCIkXCI6MH0sXCJtYWN5c1wiOntcIiRcIjowfSxcIm1hZHJpZFwiOntcIiRcIjowfSxcIm1haWZcIjp7XCIkXCI6MH0sXCJtYWlzb25cIjp7XCIkXCI6MH0sXCJtYWtldXBcIjp7XCIkXCI6MH0sXCJtYW5cIjp7XCIkXCI6MH0sXCJtYW5hZ2VtZW50XCI6e1wiJFwiOjAsXCJyb3V0ZXJcIjp7XCIkXCI6MH19LFwibWFuZ29cIjp7XCIkXCI6MH0sXCJtYXBcIjp7XCIkXCI6MH0sXCJtYXJrZXRcIjp7XCIkXCI6MH0sXCJtYXJrZXRpbmdcIjp7XCIkXCI6MH0sXCJtYXJrZXRzXCI6e1wiJFwiOjB9LFwibWFycmlvdHRcIjp7XCIkXCI6MH0sXCJtYXJzaGFsbHNcIjp7XCIkXCI6MH0sXCJtYXNlcmF0aVwiOntcIiRcIjowfSxcIm1hdHRlbFwiOntcIiRcIjowfSxcIm1iYVwiOntcIiRcIjowfSxcIm1jZFwiOntcIiRcIjowfSxcIm1jZG9uYWxkc1wiOntcIiRcIjowfSxcIm1ja2luc2V5XCI6e1wiJFwiOjB9LFwibWVkXCI6e1wiJFwiOjB9LFwibWVkaWFcIjp7XCIkXCI6MH0sXCJtZWV0XCI6e1wiJFwiOjB9LFwibWVsYm91cm5lXCI6e1wiJFwiOjB9LFwibWVtZVwiOntcIiRcIjowfSxcIm1lbW9yaWFsXCI6e1wiJFwiOjB9LFwibWVuXCI6e1wiJFwiOjB9LFwibWVudVwiOntcIiRcIjowfSxcIm1lb1wiOntcIiRcIjowfSxcIm1lcmNrbXNkXCI6e1wiJFwiOjB9LFwibWV0bGlmZVwiOntcIiRcIjowfSxcIm1pYW1pXCI6e1wiJFwiOjB9LFwibWljcm9zb2Z0XCI6e1wiJFwiOjB9LFwibWluaVwiOntcIiRcIjowfSxcIm1pbnRcIjp7XCIkXCI6MH0sXCJtaXRcIjp7XCIkXCI6MH0sXCJtaXRzdWJpc2hpXCI6e1wiJFwiOjB9LFwibWxiXCI6e1wiJFwiOjB9LFwibWxzXCI6e1wiJFwiOjB9LFwibW1hXCI6e1wiJFwiOjB9LFwibW9iaWxlXCI6e1wiJFwiOjB9LFwibW9iaWx5XCI6e1wiJFwiOjB9LFwibW9kYVwiOntcIiRcIjowfSxcIm1vZVwiOntcIiRcIjowfSxcIm1vaVwiOntcIiRcIjowfSxcIm1vbVwiOntcIiRcIjowfSxcIm1vbmFzaFwiOntcIiRcIjowfSxcIm1vbmV5XCI6e1wiJFwiOjB9LFwibW9uc3RlclwiOntcIiRcIjowfSxcIm1vbnRibGFuY1wiOntcIiRcIjowfSxcIm1vcGFyXCI6e1wiJFwiOjB9LFwibW9ybW9uXCI6e1wiJFwiOjB9LFwibW9ydGdhZ2VcIjp7XCIkXCI6MH0sXCJtb3Njb3dcIjp7XCIkXCI6MH0sXCJtb3RvXCI6e1wiJFwiOjB9LFwibW90b3JjeWNsZXNcIjp7XCIkXCI6MH0sXCJtb3ZcIjp7XCIkXCI6MH0sXCJtb3ZpZVwiOntcIiRcIjowfSxcIm1vdmlzdGFyXCI6e1wiJFwiOjB9LFwibXNkXCI6e1wiJFwiOjB9LFwibXRuXCI6e1wiJFwiOjB9LFwibXRwY1wiOntcIiRcIjowfSxcIm10clwiOntcIiRcIjowfSxcIm11dHVhbFwiOntcIiRcIjowfSxcIm5hYlwiOntcIiRcIjowfSxcIm5hZGV4XCI6e1wiJFwiOjB9LFwibmFnb3lhXCI6e1wiJFwiOjB9LFwibmF0aW9ud2lkZVwiOntcIiRcIjowfSxcIm5hdHVyYVwiOntcIiRcIjowfSxcIm5hdnlcIjp7XCIkXCI6MH0sXCJuYmFcIjp7XCIkXCI6MH0sXCJuZWNcIjp7XCIkXCI6MH0sXCJuZXRiYW5rXCI6e1wiJFwiOjB9LFwibmV0ZmxpeFwiOntcIiRcIjowfSxcIm5ldHdvcmtcIjp7XCIkXCI6MCxcImFsY2VzXCI6e1wiKlwiOntcIiRcIjowfX19LFwibmV1c3RhclwiOntcIiRcIjowfSxcIm5ld1wiOntcIiRcIjowfSxcIm5ld2hvbGxhbmRcIjp7XCIkXCI6MH0sXCJuZXdzXCI6e1wiJFwiOjB9LFwibmV4dFwiOntcIiRcIjowfSxcIm5leHRkaXJlY3RcIjp7XCIkXCI6MH0sXCJuZXh1c1wiOntcIiRcIjowfSxcIm5mbFwiOntcIiRcIjowfSxcIm5nb1wiOntcIiRcIjowfSxcIm5oa1wiOntcIiRcIjowfSxcIm5pY29cIjp7XCIkXCI6MH0sXCJuaWtlXCI6e1wiJFwiOjB9LFwibmlrb25cIjp7XCIkXCI6MH0sXCJuaW5qYVwiOntcIiRcIjowfSxcIm5pc3NhblwiOntcIiRcIjowfSxcIm5pc3NheVwiOntcIiRcIjowfSxcIm5va2lhXCI6e1wiJFwiOjB9LFwibm9ydGh3ZXN0ZXJubXV0dWFsXCI6e1wiJFwiOjB9LFwibm9ydG9uXCI6e1wiJFwiOjB9LFwibm93XCI6e1wiJFwiOjB9LFwibm93cnV6XCI6e1wiJFwiOjB9LFwibm93dHZcIjp7XCIkXCI6MH0sXCJucmFcIjp7XCIkXCI6MH0sXCJucndcIjp7XCIkXCI6MH0sXCJudHRcIjp7XCIkXCI6MH0sXCJueWNcIjp7XCIkXCI6MH0sXCJvYmlcIjp7XCIkXCI6MH0sXCJvYnNlcnZlclwiOntcIiRcIjowfSxcIm9mZlwiOntcIiRcIjowfSxcIm9mZmljZVwiOntcIiRcIjowfSxcIm9raW5hd2FcIjp7XCIkXCI6MH0sXCJvbGF5YW5cIjp7XCIkXCI6MH0sXCJvbGF5YW5ncm91cFwiOntcIiRcIjowfSxcIm9sZG5hdnlcIjp7XCIkXCI6MH0sXCJvbGxvXCI6e1wiJFwiOjB9LFwib21lZ2FcIjp7XCIkXCI6MH0sXCJvbmVcIjp7XCIkXCI6MCxcImhvbWVsaW5rXCI6e1wiJFwiOjB9fSxcIm9uZ1wiOntcIiRcIjowfSxcIm9ubFwiOntcIiRcIjowfSxcIm9ubGluZVwiOntcIiRcIjowLFwiYmFyc3lcIjp7XCIkXCI6MH19LFwib255b3Vyc2lkZVwiOntcIiRcIjowfSxcIm9vb1wiOntcIiRcIjowfSxcIm9wZW5cIjp7XCIkXCI6MH0sXCJvcmFjbGVcIjp7XCIkXCI6MH0sXCJvcmFuZ2VcIjp7XCIkXCI6MH0sXCJvcmdhbmljXCI6e1wiJFwiOjB9LFwib3JpZ2luc1wiOntcIiRcIjowfSxcIm9zYWthXCI6e1wiJFwiOjB9LFwib3RzdWthXCI6e1wiJFwiOjB9LFwib3R0XCI6e1wiJFwiOjB9LFwib3ZoXCI6e1wiJFwiOjAsXCJuZXJkcG9sXCI6e1wiJFwiOjB9fSxcInBhZ2VcIjp7XCIkXCI6MH0sXCJwYW1wZXJlZGNoZWZcIjp7XCIkXCI6MH0sXCJwYW5hc29uaWNcIjp7XCIkXCI6MH0sXCJwYW5lcmFpXCI6e1wiJFwiOjB9LFwicGFyaXNcIjp7XCIkXCI6MH0sXCJwYXJzXCI6e1wiJFwiOjB9LFwicGFydG5lcnNcIjp7XCIkXCI6MH0sXCJwYXJ0c1wiOntcIiRcIjowfSxcInBhcnR5XCI6e1wiJFwiOjAsXCJ5Ym9cIjp7XCIkXCI6MH19LFwicGFzc2FnZW5zXCI6e1wiJFwiOjB9LFwicGF5XCI6e1wiJFwiOjB9LFwicGNjd1wiOntcIiRcIjowfSxcInBldFwiOntcIiRcIjowfSxcInBmaXplclwiOntcIiRcIjowfSxcInBoYXJtYWN5XCI6e1wiJFwiOjB9LFwicGhkXCI6e1wiJFwiOjB9LFwicGhpbGlwc1wiOntcIiRcIjowfSxcInBob25lXCI6e1wiJFwiOjB9LFwicGhvdG9cIjp7XCIkXCI6MH0sXCJwaG90b2dyYXBoeVwiOntcIiRcIjowfSxcInBob3Rvc1wiOntcIiRcIjowfSxcInBoeXNpb1wiOntcIiRcIjowfSxcInBpYWdldFwiOntcIiRcIjowfSxcInBpY3NcIjp7XCIkXCI6MH0sXCJwaWN0ZXRcIjp7XCIkXCI6MH0sXCJwaWN0dXJlc1wiOntcIjEzMzdcIjp7XCIkXCI6MH0sXCIkXCI6MH0sXCJwaWRcIjp7XCIkXCI6MH0sXCJwaW5cIjp7XCIkXCI6MH0sXCJwaW5nXCI6e1wiJFwiOjB9LFwicGlua1wiOntcIiRcIjowfSxcInBpb25lZXJcIjp7XCIkXCI6MH0sXCJwaXp6YVwiOntcIiRcIjowfSxcInBsYWNlXCI6e1wiJFwiOjB9LFwicGxheVwiOntcIiRcIjowfSxcInBsYXlzdGF0aW9uXCI6e1wiJFwiOjB9LFwicGx1bWJpbmdcIjp7XCIkXCI6MH0sXCJwbHVzXCI6e1wiJFwiOjB9LFwicG5jXCI6e1wiJFwiOjB9LFwicG9obFwiOntcIiRcIjowfSxcInBva2VyXCI6e1wiJFwiOjB9LFwicG9saXRpZVwiOntcIiRcIjowfSxcInBvcm5cIjp7XCIkXCI6MH0sXCJwcmFtZXJpY2FcIjp7XCIkXCI6MH0sXCJwcmF4aVwiOntcIiRcIjowfSxcInByZXNzXCI6e1wiJFwiOjB9LFwicHJpbWVcIjp7XCIkXCI6MH0sXCJwcm9kXCI6e1wiJFwiOjB9LFwicHJvZHVjdGlvbnNcIjp7XCIkXCI6MH0sXCJwcm9mXCI6e1wiJFwiOjB9LFwicHJvZ3Jlc3NpdmVcIjp7XCIkXCI6MH0sXCJwcm9tb1wiOntcIiRcIjowfSxcInByb3BlcnRpZXNcIjp7XCIkXCI6MH0sXCJwcm9wZXJ0eVwiOntcIiRcIjowfSxcInByb3RlY3Rpb25cIjp7XCIkXCI6MH0sXCJwcnVcIjp7XCIkXCI6MH0sXCJwcnVkZW50aWFsXCI6e1wiJFwiOjB9LFwicHViXCI6e1wiJFwiOjB9LFwicHdjXCI6e1wiJFwiOjB9LFwicXBvblwiOntcIiRcIjowfSxcInF1ZWJlY1wiOntcIiRcIjowfSxcInF1ZXN0XCI6e1wiJFwiOjB9LFwicXZjXCI6e1wiJFwiOjB9LFwicmFjaW5nXCI6e1wiJFwiOjB9LFwicmFkaW9cIjp7XCIkXCI6MH0sXCJyYWlkXCI6e1wiJFwiOjB9LFwicmVhZFwiOntcIiRcIjowfSxcInJlYWxlc3RhdGVcIjp7XCIkXCI6MH0sXCJyZWFsdG9yXCI6e1wiJFwiOjB9LFwicmVhbHR5XCI6e1wiJFwiOjB9LFwicmVjaXBlc1wiOntcIiRcIjowfSxcInJlZFwiOntcIiRcIjowfSxcInJlZHN0b25lXCI6e1wiJFwiOjB9LFwicmVkdW1icmVsbGFcIjp7XCIkXCI6MH0sXCJyZWhhYlwiOntcIiRcIjowfSxcInJlaXNlXCI6e1wiJFwiOjB9LFwicmVpc2VuXCI6e1wiJFwiOjB9LFwicmVpdFwiOntcIiRcIjowfSxcInJlbGlhbmNlXCI6e1wiJFwiOjB9LFwicmVuXCI6e1wiJFwiOjB9LFwicmVudFwiOntcIiRcIjowfSxcInJlbnRhbHNcIjp7XCIkXCI6MH0sXCJyZXBhaXJcIjp7XCIkXCI6MH0sXCJyZXBvcnRcIjp7XCIkXCI6MH0sXCJyZXB1YmxpY2FuXCI6e1wiJFwiOjB9LFwicmVzdFwiOntcIiRcIjowfSxcInJlc3RhdXJhbnRcIjp7XCIkXCI6MH0sXCJyZXZpZXdcIjp7XCIkXCI6MCxcInlib1wiOntcIiRcIjowfX0sXCJyZXZpZXdzXCI6e1wiJFwiOjB9LFwicmV4cm90aFwiOntcIiRcIjowfSxcInJpY2hcIjp7XCIkXCI6MH0sXCJyaWNoYXJkbGlcIjp7XCIkXCI6MH0sXCJyaWNvaFwiOntcIiRcIjowfSxcInJpZ2h0YXRob21lXCI6e1wiJFwiOjB9LFwicmlsXCI6e1wiJFwiOjB9LFwicmlvXCI6e1wiJFwiOjB9LFwicmlwXCI6e1wiJFwiOjAsXCJjbGFuXCI6e1wiJFwiOjB9fSxcInJtaXRcIjp7XCIkXCI6MH0sXCJyb2NoZXJcIjp7XCIkXCI6MH0sXCJyb2Nrc1wiOntcIiRcIjowLFwibXlkZG5zXCI6e1wiJFwiOjB9LFwibGltYS1jaXR5XCI6e1wiJFwiOjB9LFwid2Vic3BhY2VcIjp7XCIkXCI6MH19LFwicm9kZW9cIjp7XCIkXCI6MH0sXCJyb2dlcnNcIjp7XCIkXCI6MH0sXCJyb29tXCI6e1wiJFwiOjB9LFwicnN2cFwiOntcIiRcIjowfSxcInJ1Z2J5XCI6e1wiJFwiOjB9LFwicnVoclwiOntcIiRcIjowfSxcInJ1blwiOntcIiRcIjowfSxcInJ3ZVwiOntcIiRcIjowfSxcInJ5dWt5dVwiOntcIiRcIjowfSxcInNhYXJsYW5kXCI6e1wiJFwiOjB9LFwic2FmZVwiOntcIiRcIjowfSxcInNhZmV0eVwiOntcIiRcIjowfSxcInNha3VyYVwiOntcIiRcIjowfSxcInNhbGVcIjp7XCIkXCI6MH0sXCJzYWxvblwiOntcIiRcIjowfSxcInNhbXNjbHViXCI6e1wiJFwiOjB9LFwic2Ftc3VuZ1wiOntcIiRcIjowfSxcInNhbmR2aWtcIjp7XCIkXCI6MH0sXCJzYW5kdmlrY29yb21hbnRcIjp7XCIkXCI6MH0sXCJzYW5vZmlcIjp7XCIkXCI6MH0sXCJzYXBcIjp7XCIkXCI6MH0sXCJzYXBvXCI6e1wiJFwiOjB9LFwic2FybFwiOntcIiRcIjowfSxcInNhc1wiOntcIiRcIjowfSxcInNhdmVcIjp7XCIkXCI6MH0sXCJzYXhvXCI6e1wiJFwiOjB9LFwic2JpXCI6e1wiJFwiOjB9LFwic2JzXCI6e1wiJFwiOjB9LFwic2NhXCI6e1wiJFwiOjB9LFwic2NiXCI6e1wiJFwiOjB9LFwic2NoYWVmZmxlclwiOntcIiRcIjowfSxcInNjaG1pZHRcIjp7XCIkXCI6MH0sXCJzY2hvbGFyc2hpcHNcIjp7XCIkXCI6MH0sXCJzY2hvb2xcIjp7XCIkXCI6MH0sXCJzY2h1bGVcIjp7XCIkXCI6MH0sXCJzY2h3YXJ6XCI6e1wiJFwiOjB9LFwic2NpZW5jZVwiOntcIiRcIjowLFwieWJvXCI6e1wiJFwiOjB9fSxcInNjam9obnNvblwiOntcIiRcIjowfSxcInNjb3JcIjp7XCIkXCI6MH0sXCJzY290XCI6e1wiJFwiOjB9LFwic2VhcmNoXCI6e1wiJFwiOjB9LFwic2VhdFwiOntcIiRcIjowfSxcInNlY3VyZVwiOntcIiRcIjowfSxcInNlY3VyaXR5XCI6e1wiJFwiOjB9LFwic2Vla1wiOntcIiRcIjowfSxcInNlbGVjdFwiOntcIiRcIjowfSxcInNlbmVyXCI6e1wiJFwiOjB9LFwic2VydmljZXNcIjp7XCIkXCI6MH0sXCJzZXNcIjp7XCIkXCI6MH0sXCJzZXZlblwiOntcIiRcIjowfSxcInNld1wiOntcIiRcIjowfSxcInNleFwiOntcIiRcIjowfSxcInNleHlcIjp7XCIkXCI6MH0sXCJzZnJcIjp7XCIkXCI6MH0sXCJzaGFuZ3JpbGFcIjp7XCIkXCI6MH0sXCJzaGFycFwiOntcIiRcIjowfSxcInNoYXdcIjp7XCIkXCI6MH0sXCJzaGVsbFwiOntcIiRcIjowfSxcInNoaWFcIjp7XCIkXCI6MH0sXCJzaGlrc2hhXCI6e1wiJFwiOjB9LFwic2hvZXNcIjp7XCIkXCI6MH0sXCJzaG9wXCI6e1wiJFwiOjB9LFwic2hvcHBpbmdcIjp7XCIkXCI6MH0sXCJzaG91amlcIjp7XCIkXCI6MH0sXCJzaG93XCI6e1wiJFwiOjB9LFwic2hvd3RpbWVcIjp7XCIkXCI6MH0sXCJzaHJpcmFtXCI6e1wiJFwiOjB9LFwic2lsa1wiOntcIiRcIjowfSxcInNpbmFcIjp7XCIkXCI6MH0sXCJzaW5nbGVzXCI6e1wiJFwiOjB9LFwic2l0ZVwiOntcIiRcIjowLFwiY3lvblwiOntcIiRcIjowfSxcInBsYXRmb3Jtc2hcIjp7XCIqXCI6e1wiJFwiOjB9fSxcImJ5ZW5cIjp7XCIkXCI6MH19LFwic2tpXCI6e1wiJFwiOjB9LFwic2tpblwiOntcIiRcIjowfSxcInNreVwiOntcIiRcIjowfSxcInNreXBlXCI6e1wiJFwiOjB9LFwic2xpbmdcIjp7XCIkXCI6MH0sXCJzbWFydFwiOntcIiRcIjowfSxcInNtaWxlXCI6e1wiJFwiOjB9LFwic25jZlwiOntcIiRcIjowfSxcInNvY2NlclwiOntcIiRcIjowfSxcInNvY2lhbFwiOntcIiRcIjowfSxcInNvZnRiYW5rXCI6e1wiJFwiOjB9LFwic29mdHdhcmVcIjp7XCIkXCI6MH0sXCJzb2h1XCI6e1wiJFwiOjB9LFwic29sYXJcIjp7XCIkXCI6MH0sXCJzb2x1dGlvbnNcIjp7XCIkXCI6MH0sXCJzb25nXCI6e1wiJFwiOjB9LFwic29ueVwiOntcIiRcIjowfSxcInNveVwiOntcIiRcIjowfSxcInNwYWNlXCI6e1wiJFwiOjAsXCJzdGFja3NwYWNlXCI6e1wiJFwiOjB9LFwidWJlclwiOntcIiRcIjowfSxcInhzNGFsbFwiOntcIiRcIjowfX0sXCJzcGllZ2VsXCI6e1wiJFwiOjB9LFwic3BvdFwiOntcIiRcIjowfSxcInNwcmVhZGJldHRpbmdcIjp7XCIkXCI6MH0sXCJzcmxcIjp7XCIkXCI6MH0sXCJzcnRcIjp7XCIkXCI6MH0sXCJzdGFkYVwiOntcIiRcIjowfSxcInN0YXBsZXNcIjp7XCIkXCI6MH0sXCJzdGFyXCI6e1wiJFwiOjB9LFwic3Rhcmh1YlwiOntcIiRcIjowfSxcInN0YXRlYmFua1wiOntcIiRcIjowfSxcInN0YXRlZmFybVwiOntcIiRcIjowfSxcInN0YXRvaWxcIjp7XCIkXCI6MH0sXCJzdGNcIjp7XCIkXCI6MH0sXCJzdGNncm91cFwiOntcIiRcIjowfSxcInN0b2NraG9sbVwiOntcIiRcIjowfSxcInN0b3JhZ2VcIjp7XCIkXCI6MH0sXCJzdG9yZVwiOntcIiRcIjowfSxcInN0cmVhbVwiOntcIiRcIjowfSxcInN0dWRpb1wiOntcIiRcIjowfSxcInN0dWR5XCI6e1wiJFwiOjB9LFwic3R5bGVcIjp7XCIkXCI6MH0sXCJzdWNrc1wiOntcIiRcIjowfSxcInN1cHBsaWVzXCI6e1wiJFwiOjB9LFwic3VwcGx5XCI6e1wiJFwiOjB9LFwic3VwcG9ydFwiOntcIiRcIjowLFwiYmFyc3lcIjp7XCIkXCI6MH19LFwic3VyZlwiOntcIiRcIjowfSxcInN1cmdlcnlcIjp7XCIkXCI6MH0sXCJzdXp1a2lcIjp7XCIkXCI6MH0sXCJzd2F0Y2hcIjp7XCIkXCI6MH0sXCJzd2lmdGNvdmVyXCI6e1wiJFwiOjB9LFwic3dpc3NcIjp7XCIkXCI6MH0sXCJzeWRuZXlcIjp7XCIkXCI6MH0sXCJzeW1hbnRlY1wiOntcIiRcIjowfSxcInN5c3RlbXNcIjp7XCIkXCI6MCxcImtuaWdodHBvaW50XCI6e1wiJFwiOjB9fSxcInRhYlwiOntcIiRcIjowfSxcInRhaXBlaVwiOntcIiRcIjowfSxcInRhbGtcIjp7XCIkXCI6MH0sXCJ0YW9iYW9cIjp7XCIkXCI6MH0sXCJ0YXJnZXRcIjp7XCIkXCI6MH0sXCJ0YXRhbW90b3JzXCI6e1wiJFwiOjB9LFwidGF0YXJcIjp7XCIkXCI6MH0sXCJ0YXR0b29cIjp7XCIkXCI6MH0sXCJ0YXhcIjp7XCIkXCI6MH0sXCJ0YXhpXCI6e1wiJFwiOjB9LFwidGNpXCI6e1wiJFwiOjB9LFwidGRrXCI6e1wiJFwiOjB9LFwidGVhbVwiOntcIiRcIjowfSxcInRlY2hcIjp7XCIkXCI6MH0sXCJ0ZWNobm9sb2d5XCI6e1wiJFwiOjB9LFwidGVsZWNpdHlcIjp7XCIkXCI6MH0sXCJ0ZWxlZm9uaWNhXCI6e1wiJFwiOjB9LFwidGVtYXNla1wiOntcIiRcIjowfSxcInRlbm5pc1wiOntcIiRcIjowfSxcInRldmFcIjp7XCIkXCI6MH0sXCJ0aGRcIjp7XCIkXCI6MH0sXCJ0aGVhdGVyXCI6e1wiJFwiOjB9LFwidGhlYXRyZVwiOntcIiRcIjowfSxcInRpYWFcIjp7XCIkXCI6MH0sXCJ0aWNrZXRzXCI6e1wiJFwiOjB9LFwidGllbmRhXCI6e1wiJFwiOjB9LFwidGlmZmFueVwiOntcIiRcIjowfSxcInRpcHNcIjp7XCIkXCI6MH0sXCJ0aXJlc1wiOntcIiRcIjowfSxcInRpcm9sXCI6e1wiJFwiOjB9LFwidGptYXh4XCI6e1wiJFwiOjB9LFwidGp4XCI6e1wiJFwiOjB9LFwidGttYXh4XCI6e1wiJFwiOjB9LFwidG1hbGxcIjp7XCIkXCI6MH0sXCJ0b2RheVwiOntcIiRcIjowfSxcInRva3lvXCI6e1wiJFwiOjB9LFwidG9vbHNcIjp7XCIkXCI6MH0sXCJ0b3BcIjp7XCIkXCI6MH0sXCJ0b3JheVwiOntcIiRcIjowfSxcInRvc2hpYmFcIjp7XCIkXCI6MH0sXCJ0b3RhbFwiOntcIiRcIjowfSxcInRvdXJzXCI6e1wiJFwiOjB9LFwidG93blwiOntcIiRcIjowfSxcInRveW90YVwiOntcIiRcIjowfSxcInRveXNcIjp7XCIkXCI6MH0sXCJ0cmFkZVwiOntcIiRcIjowLFwieWJvXCI6e1wiJFwiOjB9fSxcInRyYWRpbmdcIjp7XCIkXCI6MH0sXCJ0cmFpbmluZ1wiOntcIiRcIjowfSxcInRyYXZlbGNoYW5uZWxcIjp7XCIkXCI6MH0sXCJ0cmF2ZWxlcnNcIjp7XCIkXCI6MH0sXCJ0cmF2ZWxlcnNpbnN1cmFuY2VcIjp7XCIkXCI6MH0sXCJ0cnVzdFwiOntcIiRcIjowfSxcInRydlwiOntcIiRcIjowfSxcInR1YmVcIjp7XCIkXCI6MH0sXCJ0dWlcIjp7XCIkXCI6MH0sXCJ0dW5lc1wiOntcIiRcIjowfSxcInR1c2h1XCI6e1wiJFwiOjB9LFwidHZzXCI6e1wiJFwiOjB9LFwidWJhbmtcIjp7XCIkXCI6MH0sXCJ1YnNcIjp7XCIkXCI6MH0sXCJ1Y29ubmVjdFwiOntcIiRcIjowfSxcInVuaWNvbVwiOntcIiRcIjowfSxcInVuaXZlcnNpdHlcIjp7XCIkXCI6MH0sXCJ1bm9cIjp7XCIkXCI6MH0sXCJ1b2xcIjp7XCIkXCI6MH0sXCJ1cHNcIjp7XCIkXCI6MH0sXCJ2YWNhdGlvbnNcIjp7XCIkXCI6MH0sXCJ2YW5hXCI6e1wiJFwiOjB9LFwidmFuZ3VhcmRcIjp7XCIkXCI6MH0sXCJ2ZWdhc1wiOntcIiRcIjowfSxcInZlbnR1cmVzXCI6e1wiJFwiOjB9LFwidmVyaXNpZ25cIjp7XCIkXCI6MH0sXCJ2ZXJzaWNoZXJ1bmdcIjp7XCIkXCI6MH0sXCJ2ZXRcIjp7XCIkXCI6MH0sXCJ2aWFqZXNcIjp7XCIkXCI6MH0sXCJ2aWRlb1wiOntcIiRcIjowfSxcInZpZ1wiOntcIiRcIjowfSxcInZpa2luZ1wiOntcIiRcIjowfSxcInZpbGxhc1wiOntcIiRcIjowfSxcInZpblwiOntcIiRcIjowfSxcInZpcFwiOntcIiRcIjowfSxcInZpcmdpblwiOntcIiRcIjowfSxcInZpc2FcIjp7XCIkXCI6MH0sXCJ2aXNpb25cIjp7XCIkXCI6MH0sXCJ2aXN0YVwiOntcIiRcIjowfSxcInZpc3RhcHJpbnRcIjp7XCIkXCI6MH0sXCJ2aXZhXCI6e1wiJFwiOjB9LFwidml2b1wiOntcIiRcIjowfSxcInZsYWFuZGVyZW5cIjp7XCIkXCI6MH0sXCJ2b2RrYVwiOntcIiRcIjowfSxcInZvbGtzd2FnZW5cIjp7XCIkXCI6MH0sXCJ2b2x2b1wiOntcIiRcIjowfSxcInZvdGVcIjp7XCIkXCI6MH0sXCJ2b3RpbmdcIjp7XCIkXCI6MH0sXCJ2b3RvXCI6e1wiJFwiOjB9LFwidm95YWdlXCI6e1wiJFwiOjB9LFwidnVlbG9zXCI6e1wiJFwiOjB9LFwid2FsZXNcIjp7XCIkXCI6MH0sXCJ3YWxtYXJ0XCI6e1wiJFwiOjB9LFwid2FsdGVyXCI6e1wiJFwiOjB9LFwid2FuZ1wiOntcIiRcIjowfSxcIndhbmdnb3VcIjp7XCIkXCI6MH0sXCJ3YXJtYW5cIjp7XCIkXCI6MH0sXCJ3YXRjaFwiOntcIiRcIjowfSxcIndhdGNoZXNcIjp7XCIkXCI6MH0sXCJ3ZWF0aGVyXCI6e1wiJFwiOjB9LFwid2VhdGhlcmNoYW5uZWxcIjp7XCIkXCI6MH0sXCJ3ZWJjYW1cIjp7XCIkXCI6MH0sXCJ3ZWJlclwiOntcIiRcIjowfSxcIndlYnNpdGVcIjp7XCIkXCI6MH0sXCJ3ZWRcIjp7XCIkXCI6MH0sXCJ3ZWRkaW5nXCI6e1wiJFwiOjB9LFwid2VpYm9cIjp7XCIkXCI6MH0sXCJ3ZWlyXCI6e1wiJFwiOjB9LFwid2hvc3dob1wiOntcIiRcIjowfSxcIndpZW5cIjp7XCIkXCI6MH0sXCJ3aWtpXCI6e1wiJFwiOjB9LFwid2lsbGlhbWhpbGxcIjp7XCIkXCI6MH0sXCJ3aW5cIjp7XCIkXCI6MH0sXCJ3aW5kb3dzXCI6e1wiJFwiOjB9LFwid2luZVwiOntcIiRcIjowfSxcIndpbm5lcnNcIjp7XCIkXCI6MH0sXCJ3bWVcIjp7XCIkXCI6MH0sXCJ3b2x0ZXJza2x1d2VyXCI6e1wiJFwiOjB9LFwid29vZHNpZGVcIjp7XCIkXCI6MH0sXCJ3b3JrXCI6e1wiJFwiOjB9LFwid29ya3NcIjp7XCIkXCI6MH0sXCJ3b3JsZFwiOntcIiRcIjowfSxcIndvd1wiOntcIiRcIjowfSxcInd0Y1wiOntcIiRcIjowfSxcInd0ZlwiOntcIiRcIjowfSxcInhib3hcIjp7XCIkXCI6MH0sXCJ4ZXJveFwiOntcIiRcIjowfSxcInhmaW5pdHlcIjp7XCIkXCI6MH0sXCJ4aWh1YW5cIjp7XCIkXCI6MH0sXCJ4aW5cIjp7XCIkXCI6MH0sXCJ4bi0tMTFiNGMzZFwiOntcIiRcIjowfSxcInhuLS0xY2syZTFiXCI6e1wiJFwiOjB9LFwieG4tLTFxcXcyM2FcIjp7XCIkXCI6MH0sXCJ4bi0tMzBycjd5XCI6e1wiJFwiOjB9LFwieG4tLTNic3QwMG1cIjp7XCIkXCI6MH0sXCJ4bi0tM2RzNDQzZ1wiOntcIiRcIjowfSxcInhuLS0zb3ExOHZsOHBuMzZhXCI6e1wiJFwiOjB9LFwieG4tLTNweHU4a1wiOntcIiRcIjowfSxcInhuLS00MmMyZDlhXCI6e1wiJFwiOjB9LFwieG4tLTQ1cTExY1wiOntcIiRcIjowfSxcInhuLS00Z2JyaW1cIjp7XCIkXCI6MH0sXCJ4bi0tNTVxdzQyZ1wiOntcIiRcIjowfSxcInhuLS01NXF4NWRcIjp7XCIkXCI6MH0sXCJ4bi0tNXN1MzRqOTM2YmdzZ1wiOntcIiRcIjowfSxcInhuLS01dHptNWdcIjp7XCIkXCI6MH0sXCJ4bi0tNmZyejgyZ1wiOntcIiRcIjowfSxcInhuLS02cXE5ODZiM3hsXCI6e1wiJFwiOjB9LFwieG4tLTgwYWR4aGtzXCI6e1wiJFwiOjB9LFwieG4tLTgwYXFlY2RyMWFcIjp7XCIkXCI6MH0sXCJ4bi0tODBhc2VoZGJcIjp7XCIkXCI6MH0sXCJ4bi0tODBhc3dnXCI6e1wiJFwiOjB9LFwieG4tLTh5MGEwNjNhXCI6e1wiJFwiOjB9LFwieG4tLTlkYnEyYVwiOntcIiRcIjowfSxcInhuLS05ZXQ1MnVcIjp7XCIkXCI6MH0sXCJ4bi0tOWtydDAwYVwiOntcIiRcIjowfSxcInhuLS1iNHc2MDVmZXJkXCI6e1wiJFwiOjB9LFwieG4tLWJjazFiOWE1ZHJlNGNcIjp7XCIkXCI6MH0sXCJ4bi0tYzFhdmdcIjp7XCIkXCI6MH0sXCJ4bi0tYzJicjdnXCI6e1wiJFwiOjB9LFwieG4tLWNjazJiM2JcIjp7XCIkXCI6MH0sXCJ4bi0tY2c0YmtpXCI6e1wiJFwiOjB9LFwieG4tLWN6cjY5NGJcIjp7XCIkXCI6MH0sXCJ4bi0tY3pyczB0XCI6e1wiJFwiOjB9LFwieG4tLWN6cnUyZFwiOntcIiRcIjowfSxcInhuLS1kMWFjajNiXCI6e1wiJFwiOjB9LFwieG4tLWVja3ZkdGM5ZFwiOntcIiRcIjowfSxcInhuLS1lZnZ5ODhoXCI6e1wiJFwiOjB9LFwieG4tLWVzdHY3NWdcIjp7XCIkXCI6MH0sXCJ4bi0tZmN0NDI5a1wiOntcIiRcIjowfSxcInhuLS1maGJlaVwiOntcIiRcIjowfSxcInhuLS1maXEyMjhjNWhzXCI6e1wiJFwiOjB9LFwieG4tLWZpcTY0YlwiOntcIiRcIjowfSxcInhuLS1manE3MjBhXCI6e1wiJFwiOjB9LFwieG4tLWZsdzM1MWVcIjp7XCIkXCI6MH0sXCJ4bi0tZnp5czhkNjl1dmdtXCI6e1wiJFwiOjB9LFwieG4tLWcyeHg0OGNcIjp7XCIkXCI6MH0sXCJ4bi0tZ2NrcjNmMGZcIjp7XCIkXCI6MH0sXCJ4bi0tZ2szYXQxZVwiOntcIiRcIjowfSxcInhuLS1oeHQ4MTRlXCI6e1wiJFwiOjB9LFwieG4tLWkxYjZiMWE2YTJlXCI6e1wiJFwiOjB9LFwieG4tLWltcjUxM25cIjp7XCIkXCI6MH0sXCJ4bi0taW8wYTdpXCI6e1wiJFwiOjB9LFwieG4tLWoxYWVmXCI6e1wiJFwiOjB9LFwieG4tLWpscTYxdTl3N2JcIjp7XCIkXCI6MH0sXCJ4bi0tanZyMTg5bVwiOntcIiRcIjowfSxcInhuLS1rY3J4NzdkMXg0YVwiOntcIiRcIjowfSxcInhuLS1rcHU3MTZmXCI6e1wiJFwiOjB9LFwieG4tLWtwdXQzaVwiOntcIiRcIjowfSxcInhuLS1tZ2JhM2EzZWp0XCI6e1wiJFwiOjB9LFwieG4tLW1nYmE3YzBiYm4wYVwiOntcIiRcIjowfSxcInhuLS1tZ2JhYWtjN2R2ZlwiOntcIiRcIjowfSxcInhuLS1tZ2JhYjJiZFwiOntcIiRcIjowfSxcInhuLS1tZ2JiOWZicG9iXCI6e1wiJFwiOjB9LFwieG4tLW1nYmNhN2R6ZG9cIjp7XCIkXCI6MH0sXCJ4bi0tbWdiaTRlY2V4cFwiOntcIiRcIjowfSxcInhuLS1tZ2J0M2RoZFwiOntcIiRcIjowfSxcInhuLS1tazFidTQ0Y1wiOntcIiRcIjowfSxcInhuLS1teHRxMW1cIjp7XCIkXCI6MH0sXCJ4bi0tbmdiYzVhemRcIjp7XCIkXCI6MH0sXCJ4bi0tbmdiZTllMGFcIjp7XCIkXCI6MH0sXCJ4bi0tbmdicnhcIjp7XCIkXCI6MH0sXCJ4bi0tbnF2N2ZcIjp7XCIkXCI6MH0sXCJ4bi0tbnF2N2ZzMDBlbWFcIjp7XCIkXCI6MH0sXCJ4bi0tbnlxeTI2YVwiOntcIiRcIjowfSxcInhuLS1wMWFjZlwiOntcIiRcIjowfSxcInhuLS1wYnQ5NzdjXCI6e1wiJFwiOjB9LFwieG4tLXBzc3kydVwiOntcIiRcIjowfSxcInhuLS1xOWp5YjRjXCI6e1wiJFwiOjB9LFwieG4tLXFja2ExcG1jXCI6e1wiJFwiOjB9LFwieG4tLXJocXY5NmdcIjp7XCIkXCI6MH0sXCJ4bi0tcm92dTg4YlwiOntcIiRcIjowfSxcInhuLS1zZXM1NTRnXCI6e1wiJFwiOjB9LFwieG4tLXQ2MGI1NmFcIjp7XCIkXCI6MH0sXCJ4bi0tdGNrd2VcIjp7XCIkXCI6MH0sXCJ4bi0tdGlxNDl4cXlqXCI6e1wiJFwiOjB9LFwieG4tLXVudXA0eVwiOntcIiRcIjowfSxcInhuLS12ZXJtZ2Vuc2JlcmF0ZXItY3RiXCI6e1wiJFwiOjB9LFwieG4tLXZlcm1nZW5zYmVyYXR1bmctcHdiXCI6e1wiJFwiOjB9LFwieG4tLXZocXV2XCI6e1wiJFwiOjB9LFwieG4tLXZ1cTg2MWJcIjp7XCIkXCI6MH0sXCJ4bi0tdzRyODVlbDhmaHU1ZG5yYVwiOntcIiRcIjowfSxcInhuLS13NHJzNDBsXCI6e1wiJFwiOjB9LFwieG4tLXhocTUyMWJcIjp7XCIkXCI6MH0sXCJ4bi0temZyMTY0YlwiOntcIiRcIjowfSxcInhwZXJpYVwiOntcIiRcIjowfSxcInh5elwiOntcIiRcIjowLFwiYmxvZ3NpdGVcIjp7XCIkXCI6MH0sXCJmaGFwcFwiOntcIiRcIjowfX0sXCJ5YWNodHNcIjp7XCIkXCI6MH0sXCJ5YWhvb1wiOntcIiRcIjowfSxcInlhbWF4dW5cIjp7XCIkXCI6MH0sXCJ5YW5kZXhcIjp7XCIkXCI6MH0sXCJ5b2RvYmFzaGlcIjp7XCIkXCI6MH0sXCJ5b2dhXCI6e1wiJFwiOjB9LFwieW9rb2hhbWFcIjp7XCIkXCI6MH0sXCJ5b3VcIjp7XCIkXCI6MH0sXCJ5b3V0dWJlXCI6e1wiJFwiOjB9LFwieXVuXCI6e1wiJFwiOjB9LFwiemFwcG9zXCI6e1wiJFwiOjB9LFwiemFyYVwiOntcIiRcIjowfSxcInplcm9cIjp7XCIkXCI6MH0sXCJ6aXBcIjp7XCIkXCI6MH0sXCJ6aXBwb1wiOntcIiRcIjowfSxcInpvbmVcIjp7XCIkXCI6MCxcInRyaXRvblwiOntcIipcIjp7XCIkXCI6MH19LFwibGltYVwiOntcIiRcIjowfX0sXCJ6dWVyaWNoXCI6e1wiJFwiOjB9fX0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHVueWNvZGUgPSByZXF1aXJlKCdwdW55Y29kZScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuZXhwb3J0cy5wYXJzZSA9IHVybFBhcnNlO1xuZXhwb3J0cy5yZXNvbHZlID0gdXJsUmVzb2x2ZTtcbmV4cG9ydHMucmVzb2x2ZU9iamVjdCA9IHVybFJlc29sdmVPYmplY3Q7XG5leHBvcnRzLmZvcm1hdCA9IHVybEZvcm1hdDtcblxuZXhwb3J0cy5VcmwgPSBVcmw7XG5cbmZ1bmN0aW9uIFVybCgpIHtcbiAgdGhpcy5wcm90b2NvbCA9IG51bGw7XG4gIHRoaXMuc2xhc2hlcyA9IG51bGw7XG4gIHRoaXMuYXV0aCA9IG51bGw7XG4gIHRoaXMuaG9zdCA9IG51bGw7XG4gIHRoaXMucG9ydCA9IG51bGw7XG4gIHRoaXMuaG9zdG5hbWUgPSBudWxsO1xuICB0aGlzLmhhc2ggPSBudWxsO1xuICB0aGlzLnNlYXJjaCA9IG51bGw7XG4gIHRoaXMucXVlcnkgPSBudWxsO1xuICB0aGlzLnBhdGhuYW1lID0gbnVsbDtcbiAgdGhpcy5wYXRoID0gbnVsbDtcbiAgdGhpcy5ocmVmID0gbnVsbDtcbn1cblxuLy8gUmVmZXJlbmNlOiBSRkMgMzk4NiwgUkZDIDE4MDgsIFJGQyAyMzk2XG5cbi8vIGRlZmluZSB0aGVzZSBoZXJlIHNvIGF0IGxlYXN0IHRoZXkgb25seSBoYXZlIHRvIGJlXG4vLyBjb21waWxlZCBvbmNlIG9uIHRoZSBmaXJzdCBtb2R1bGUgbG9hZC5cbnZhciBwcm90b2NvbFBhdHRlcm4gPSAvXihbYS16MC05ListXSs6KS9pLFxuICAgIHBvcnRQYXR0ZXJuID0gLzpbMC05XSokLyxcblxuICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgYSBzaW1wbGUgcGF0aCBVUkxcbiAgICBzaW1wbGVQYXRoUGF0dGVybiA9IC9eKFxcL1xcLz8oPyFcXC8pW15cXD9cXHNdKikoXFw/W15cXHNdKik/JC8sXG5cbiAgICAvLyBSRkMgMjM5NjogY2hhcmFjdGVycyByZXNlcnZlZCBmb3IgZGVsaW1pdGluZyBVUkxzLlxuICAgIC8vIFdlIGFjdHVhbGx5IGp1c3QgYXV0by1lc2NhcGUgdGhlc2UuXG4gICAgZGVsaW1zID0gWyc8JywgJz4nLCAnXCInLCAnYCcsICcgJywgJ1xccicsICdcXG4nLCAnXFx0J10sXG5cbiAgICAvLyBSRkMgMjM5NjogY2hhcmFjdGVycyBub3QgYWxsb3dlZCBmb3IgdmFyaW91cyByZWFzb25zLlxuICAgIHVud2lzZSA9IFsneycsICd9JywgJ3wnLCAnXFxcXCcsICdeJywgJ2AnXS5jb25jYXQoZGVsaW1zKSxcblxuICAgIC8vIEFsbG93ZWQgYnkgUkZDcywgYnV0IGNhdXNlIG9mIFhTUyBhdHRhY2tzLiAgQWx3YXlzIGVzY2FwZSB0aGVzZS5cbiAgICBhdXRvRXNjYXBlID0gWydcXCcnXS5jb25jYXQodW53aXNlKSxcbiAgICAvLyBDaGFyYWN0ZXJzIHRoYXQgYXJlIG5ldmVyIGV2ZXIgYWxsb3dlZCBpbiBhIGhvc3RuYW1lLlxuICAgIC8vIE5vdGUgdGhhdCBhbnkgaW52YWxpZCBjaGFycyBhcmUgYWxzbyBoYW5kbGVkLCBidXQgdGhlc2VcbiAgICAvLyBhcmUgdGhlIG9uZXMgdGhhdCBhcmUgKmV4cGVjdGVkKiB0byBiZSBzZWVuLCBzbyB3ZSBmYXN0LXBhdGhcbiAgICAvLyB0aGVtLlxuICAgIG5vbkhvc3RDaGFycyA9IFsnJScsICcvJywgJz8nLCAnOycsICcjJ10uY29uY2F0KGF1dG9Fc2NhcGUpLFxuICAgIGhvc3RFbmRpbmdDaGFycyA9IFsnLycsICc/JywgJyMnXSxcbiAgICBob3N0bmFtZU1heExlbiA9IDI1NSxcbiAgICBob3N0bmFtZVBhcnRQYXR0ZXJuID0gL15bK2EtejAtOUEtWl8tXXswLDYzfSQvLFxuICAgIGhvc3RuYW1lUGFydFN0YXJ0ID0gL14oWythLXowLTlBLVpfLV17MCw2M30pKC4qKSQvLFxuICAgIC8vIHByb3RvY29scyB0aGF0IGNhbiBhbGxvdyBcInVuc2FmZVwiIGFuZCBcInVud2lzZVwiIGNoYXJzLlxuICAgIHVuc2FmZVByb3RvY29sID0ge1xuICAgICAgJ2phdmFzY3JpcHQnOiB0cnVlLFxuICAgICAgJ2phdmFzY3JpcHQ6JzogdHJ1ZVxuICAgIH0sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgbmV2ZXIgaGF2ZSBhIGhvc3RuYW1lLlxuICAgIGhvc3RsZXNzUHJvdG9jb2wgPSB7XG4gICAgICAnamF2YXNjcmlwdCc6IHRydWUsXG4gICAgICAnamF2YXNjcmlwdDonOiB0cnVlXG4gICAgfSxcbiAgICAvLyBwcm90b2NvbHMgdGhhdCBhbHdheXMgY29udGFpbiBhIC8vIGJpdC5cbiAgICBzbGFzaGVkUHJvdG9jb2wgPSB7XG4gICAgICAnaHR0cCc6IHRydWUsXG4gICAgICAnaHR0cHMnOiB0cnVlLFxuICAgICAgJ2Z0cCc6IHRydWUsXG4gICAgICAnZ29waGVyJzogdHJ1ZSxcbiAgICAgICdmaWxlJzogdHJ1ZSxcbiAgICAgICdodHRwOic6IHRydWUsXG4gICAgICAnaHR0cHM6JzogdHJ1ZSxcbiAgICAgICdmdHA6JzogdHJ1ZSxcbiAgICAgICdnb3BoZXI6JzogdHJ1ZSxcbiAgICAgICdmaWxlOic6IHRydWVcbiAgICB9LFxuICAgIHF1ZXJ5c3RyaW5nID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKTtcblxuZnVuY3Rpb24gdXJsUGFyc2UodXJsLCBwYXJzZVF1ZXJ5U3RyaW5nLCBzbGFzaGVzRGVub3RlSG9zdCkge1xuICBpZiAodXJsICYmIHV0aWwuaXNPYmplY3QodXJsKSAmJiB1cmwgaW5zdGFuY2VvZiBVcmwpIHJldHVybiB1cmw7XG5cbiAgdmFyIHUgPSBuZXcgVXJsO1xuICB1LnBhcnNlKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpO1xuICByZXR1cm4gdTtcbn1cblxuVXJsLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpIHtcbiAgaWYgKCF1dGlsLmlzU3RyaW5nKHVybCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGFyYW1ldGVyICd1cmwnIG11c3QgYmUgYSBzdHJpbmcsIG5vdCBcIiArIHR5cGVvZiB1cmwpO1xuICB9XG5cbiAgLy8gQ29weSBjaHJvbWUsIElFLCBvcGVyYSBiYWNrc2xhc2gtaGFuZGxpbmcgYmVoYXZpb3IuXG4gIC8vIEJhY2sgc2xhc2hlcyBiZWZvcmUgdGhlIHF1ZXJ5IHN0cmluZyBnZXQgY29udmVydGVkIHRvIGZvcndhcmQgc2xhc2hlc1xuICAvLyBTZWU6IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0yNTkxNlxuICB2YXIgcXVlcnlJbmRleCA9IHVybC5pbmRleE9mKCc/JyksXG4gICAgICBzcGxpdHRlciA9XG4gICAgICAgICAgKHF1ZXJ5SW5kZXggIT09IC0xICYmIHF1ZXJ5SW5kZXggPCB1cmwuaW5kZXhPZignIycpKSA/ICc/JyA6ICcjJyxcbiAgICAgIHVTcGxpdCA9IHVybC5zcGxpdChzcGxpdHRlciksXG4gICAgICBzbGFzaFJlZ2V4ID0gL1xcXFwvZztcbiAgdVNwbGl0WzBdID0gdVNwbGl0WzBdLnJlcGxhY2Uoc2xhc2hSZWdleCwgJy8nKTtcbiAgdXJsID0gdVNwbGl0LmpvaW4oc3BsaXR0ZXIpO1xuXG4gIHZhciByZXN0ID0gdXJsO1xuXG4gIC8vIHRyaW0gYmVmb3JlIHByb2NlZWRpbmcuXG4gIC8vIFRoaXMgaXMgdG8gc3VwcG9ydCBwYXJzZSBzdHVmZiBsaWtlIFwiICBodHRwOi8vZm9vLmNvbSAgXFxuXCJcbiAgcmVzdCA9IHJlc3QudHJpbSgpO1xuXG4gIGlmICghc2xhc2hlc0Rlbm90ZUhvc3QgJiYgdXJsLnNwbGl0KCcjJykubGVuZ3RoID09PSAxKSB7XG4gICAgLy8gVHJ5IGZhc3QgcGF0aCByZWdleHBcbiAgICB2YXIgc2ltcGxlUGF0aCA9IHNpbXBsZVBhdGhQYXR0ZXJuLmV4ZWMocmVzdCk7XG4gICAgaWYgKHNpbXBsZVBhdGgpIHtcbiAgICAgIHRoaXMucGF0aCA9IHJlc3Q7XG4gICAgICB0aGlzLmhyZWYgPSByZXN0O1xuICAgICAgdGhpcy5wYXRobmFtZSA9IHNpbXBsZVBhdGhbMV07XG4gICAgICBpZiAoc2ltcGxlUGF0aFsyXSkge1xuICAgICAgICB0aGlzLnNlYXJjaCA9IHNpbXBsZVBhdGhbMl07XG4gICAgICAgIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5c3RyaW5nLnBhcnNlKHRoaXMuc2VhcmNoLnN1YnN0cigxKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5xdWVyeSA9IHRoaXMuc2VhcmNoLnN1YnN0cigxKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoID0gJyc7XG4gICAgICAgIHRoaXMucXVlcnkgPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwcm90byA9IHByb3RvY29sUGF0dGVybi5leGVjKHJlc3QpO1xuICBpZiAocHJvdG8pIHtcbiAgICBwcm90byA9IHByb3RvWzBdO1xuICAgIHZhciBsb3dlclByb3RvID0gcHJvdG8udG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLnByb3RvY29sID0gbG93ZXJQcm90bztcbiAgICByZXN0ID0gcmVzdC5zdWJzdHIocHJvdG8ubGVuZ3RoKTtcbiAgfVxuXG4gIC8vIGZpZ3VyZSBvdXQgaWYgaXQncyBnb3QgYSBob3N0XG4gIC8vIHVzZXJAc2VydmVyIGlzICphbHdheXMqIGludGVycHJldGVkIGFzIGEgaG9zdG5hbWUsIGFuZCB1cmxcbiAgLy8gcmVzb2x1dGlvbiB3aWxsIHRyZWF0IC8vZm9vL2JhciBhcyBob3N0PWZvbyxwYXRoPWJhciBiZWNhdXNlIHRoYXQnc1xuICAvLyBob3cgdGhlIGJyb3dzZXIgcmVzb2x2ZXMgcmVsYXRpdmUgVVJMcy5cbiAgaWYgKHNsYXNoZXNEZW5vdGVIb3N0IHx8IHByb3RvIHx8IHJlc3QubWF0Y2goL15cXC9cXC9bXkBcXC9dK0BbXkBcXC9dKy8pKSB7XG4gICAgdmFyIHNsYXNoZXMgPSByZXN0LnN1YnN0cigwLCAyKSA9PT0gJy8vJztcbiAgICBpZiAoc2xhc2hlcyAmJiAhKHByb3RvICYmIGhvc3RsZXNzUHJvdG9jb2xbcHJvdG9dKSkge1xuICAgICAgcmVzdCA9IHJlc3Quc3Vic3RyKDIpO1xuICAgICAgdGhpcy5zbGFzaGVzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWhvc3RsZXNzUHJvdG9jb2xbcHJvdG9dICYmXG4gICAgICAoc2xhc2hlcyB8fCAocHJvdG8gJiYgIXNsYXNoZWRQcm90b2NvbFtwcm90b10pKSkge1xuXG4gICAgLy8gdGhlcmUncyBhIGhvc3RuYW1lLlxuICAgIC8vIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiAvLCA/LCA7LCBvciAjIGVuZHMgdGhlIGhvc3QuXG4gICAgLy9cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBAIGluIHRoZSBob3N0bmFtZSwgdGhlbiBub24taG9zdCBjaGFycyAqYXJlKiBhbGxvd2VkXG4gICAgLy8gdG8gdGhlIGxlZnQgb2YgdGhlIGxhc3QgQCBzaWduLCB1bmxlc3Mgc29tZSBob3N0LWVuZGluZyBjaGFyYWN0ZXJcbiAgICAvLyBjb21lcyAqYmVmb3JlKiB0aGUgQC1zaWduLlxuICAgIC8vIFVSTHMgYXJlIG9ibm94aW91cy5cbiAgICAvL1xuICAgIC8vIGV4OlxuICAgIC8vIGh0dHA6Ly9hQGJAYy8gPT4gdXNlcjphQGIgaG9zdDpjXG4gICAgLy8gaHR0cDovL2FAYj9AYyA9PiB1c2VyOmEgaG9zdDpjIHBhdGg6Lz9AY1xuXG4gICAgLy8gdjAuMTIgVE9ETyhpc2FhY3MpOiBUaGlzIGlzIG5vdCBxdWl0ZSBob3cgQ2hyb21lIGRvZXMgdGhpbmdzLlxuICAgIC8vIFJldmlldyBvdXIgdGVzdCBjYXNlIGFnYWluc3QgYnJvd3NlcnMgbW9yZSBjb21wcmVoZW5zaXZlbHkuXG5cbiAgICAvLyBmaW5kIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiBhbnkgaG9zdEVuZGluZ0NoYXJzXG4gICAgdmFyIGhvc3RFbmQgPSAtMTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhvc3RFbmRpbmdDaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGhlYyA9IHJlc3QuaW5kZXhPZihob3N0RW5kaW5nQ2hhcnNbaV0pO1xuICAgICAgaWYgKGhlYyAhPT0gLTEgJiYgKGhvc3RFbmQgPT09IC0xIHx8IGhlYyA8IGhvc3RFbmQpKVxuICAgICAgICBob3N0RW5kID0gaGVjO1xuICAgIH1cblxuICAgIC8vIGF0IHRoaXMgcG9pbnQsIGVpdGhlciB3ZSBoYXZlIGFuIGV4cGxpY2l0IHBvaW50IHdoZXJlIHRoZVxuICAgIC8vIGF1dGggcG9ydGlvbiBjYW5ub3QgZ28gcGFzdCwgb3IgdGhlIGxhc3QgQCBjaGFyIGlzIHRoZSBkZWNpZGVyLlxuICAgIHZhciBhdXRoLCBhdFNpZ247XG4gICAgaWYgKGhvc3RFbmQgPT09IC0xKSB7XG4gICAgICAvLyBhdFNpZ24gY2FuIGJlIGFueXdoZXJlLlxuICAgICAgYXRTaWduID0gcmVzdC5sYXN0SW5kZXhPZignQCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBhdFNpZ24gbXVzdCBiZSBpbiBhdXRoIHBvcnRpb24uXG4gICAgICAvLyBodHRwOi8vYUBiL2NAZCA9PiBob3N0OmIgYXV0aDphIHBhdGg6L2NAZFxuICAgICAgYXRTaWduID0gcmVzdC5sYXN0SW5kZXhPZignQCcsIGhvc3RFbmQpO1xuICAgIH1cblxuICAgIC8vIE5vdyB3ZSBoYXZlIGEgcG9ydGlvbiB3aGljaCBpcyBkZWZpbml0ZWx5IHRoZSBhdXRoLlxuICAgIC8vIFB1bGwgdGhhdCBvZmYuXG4gICAgaWYgKGF0U2lnbiAhPT0gLTEpIHtcbiAgICAgIGF1dGggPSByZXN0LnNsaWNlKDAsIGF0U2lnbik7XG4gICAgICByZXN0ID0gcmVzdC5zbGljZShhdFNpZ24gKyAxKTtcbiAgICAgIHRoaXMuYXV0aCA9IGRlY29kZVVSSUNvbXBvbmVudChhdXRoKTtcbiAgICB9XG5cbiAgICAvLyB0aGUgaG9zdCBpcyB0aGUgcmVtYWluaW5nIHRvIHRoZSBsZWZ0IG9mIHRoZSBmaXJzdCBub24taG9zdCBjaGFyXG4gICAgaG9zdEVuZCA9IC0xO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9uSG9zdENoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaGVjID0gcmVzdC5pbmRleE9mKG5vbkhvc3RDaGFyc1tpXSk7XG4gICAgICBpZiAoaGVjICE9PSAtMSAmJiAoaG9zdEVuZCA9PT0gLTEgfHwgaGVjIDwgaG9zdEVuZCkpXG4gICAgICAgIGhvc3RFbmQgPSBoZWM7XG4gICAgfVxuICAgIC8vIGlmIHdlIHN0aWxsIGhhdmUgbm90IGhpdCBpdCwgdGhlbiB0aGUgZW50aXJlIHRoaW5nIGlzIGEgaG9zdC5cbiAgICBpZiAoaG9zdEVuZCA9PT0gLTEpXG4gICAgICBob3N0RW5kID0gcmVzdC5sZW5ndGg7XG5cbiAgICB0aGlzLmhvc3QgPSByZXN0LnNsaWNlKDAsIGhvc3RFbmQpO1xuICAgIHJlc3QgPSByZXN0LnNsaWNlKGhvc3RFbmQpO1xuXG4gICAgLy8gcHVsbCBvdXQgcG9ydC5cbiAgICB0aGlzLnBhcnNlSG9zdCgpO1xuXG4gICAgLy8gd2UndmUgaW5kaWNhdGVkIHRoYXQgdGhlcmUgaXMgYSBob3N0bmFtZSxcbiAgICAvLyBzbyBldmVuIGlmIGl0J3MgZW1wdHksIGl0IGhhcyB0byBiZSBwcmVzZW50LlxuICAgIHRoaXMuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lIHx8ICcnO1xuXG4gICAgLy8gaWYgaG9zdG5hbWUgYmVnaW5zIHdpdGggWyBhbmQgZW5kcyB3aXRoIF1cbiAgICAvLyBhc3N1bWUgdGhhdCBpdCdzIGFuIElQdjYgYWRkcmVzcy5cbiAgICB2YXIgaXB2Nkhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZVswXSA9PT0gJ1snICYmXG4gICAgICAgIHRoaXMuaG9zdG5hbWVbdGhpcy5ob3N0bmFtZS5sZW5ndGggLSAxXSA9PT0gJ10nO1xuXG4gICAgLy8gdmFsaWRhdGUgYSBsaXR0bGUuXG4gICAgaWYgKCFpcHY2SG9zdG5hbWUpIHtcbiAgICAgIHZhciBob3N0cGFydHMgPSB0aGlzLmhvc3RuYW1lLnNwbGl0KC9cXC4vKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gaG9zdHBhcnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgcGFydCA9IGhvc3RwYXJ0c1tpXTtcbiAgICAgICAgaWYgKCFwYXJ0KSBjb250aW51ZTtcbiAgICAgICAgaWYgKCFwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFBhdHRlcm4pKSB7XG4gICAgICAgICAgdmFyIG5ld3BhcnQgPSAnJztcbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgayA9IHBhcnQubGVuZ3RoOyBqIDwgazsgaisrKSB7XG4gICAgICAgICAgICBpZiAocGFydC5jaGFyQ29kZUF0KGopID4gMTI3KSB7XG4gICAgICAgICAgICAgIC8vIHdlIHJlcGxhY2Ugbm9uLUFTQ0lJIGNoYXIgd2l0aCBhIHRlbXBvcmFyeSBwbGFjZWhvbGRlclxuICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRoaXMgdG8gbWFrZSBzdXJlIHNpemUgb2YgaG9zdG5hbWUgaXMgbm90XG4gICAgICAgICAgICAgIC8vIGJyb2tlbiBieSByZXBsYWNpbmcgbm9uLUFTQ0lJIGJ5IG5vdGhpbmdcbiAgICAgICAgICAgICAgbmV3cGFydCArPSAneCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXdwYXJ0ICs9IHBhcnRbal07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHdlIHRlc3QgYWdhaW4gd2l0aCBBU0NJSSBjaGFyIG9ubHlcbiAgICAgICAgICBpZiAoIW5ld3BhcnQubWF0Y2goaG9zdG5hbWVQYXJ0UGF0dGVybikpIHtcbiAgICAgICAgICAgIHZhciB2YWxpZFBhcnRzID0gaG9zdHBhcnRzLnNsaWNlKDAsIGkpO1xuICAgICAgICAgICAgdmFyIG5vdEhvc3QgPSBob3N0cGFydHMuc2xpY2UoaSArIDEpO1xuICAgICAgICAgICAgdmFyIGJpdCA9IHBhcnQubWF0Y2goaG9zdG5hbWVQYXJ0U3RhcnQpO1xuICAgICAgICAgICAgaWYgKGJpdCkge1xuICAgICAgICAgICAgICB2YWxpZFBhcnRzLnB1c2goYml0WzFdKTtcbiAgICAgICAgICAgICAgbm90SG9zdC51bnNoaWZ0KGJpdFsyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm90SG9zdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcmVzdCA9ICcvJyArIG5vdEhvc3Quam9pbignLicpICsgcmVzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaG9zdG5hbWUgPSB2YWxpZFBhcnRzLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhvc3RuYW1lLmxlbmd0aCA+IGhvc3RuYW1lTWF4TGVuKSB7XG4gICAgICB0aGlzLmhvc3RuYW1lID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGhvc3RuYW1lcyBhcmUgYWx3YXlzIGxvd2VyIGNhc2UuXG4gICAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGlmICghaXB2Nkhvc3RuYW1lKSB7XG4gICAgICAvLyBJRE5BIFN1cHBvcnQ6IFJldHVybnMgYSBwdW55Y29kZWQgcmVwcmVzZW50YXRpb24gb2YgXCJkb21haW5cIi5cbiAgICAgIC8vIEl0IG9ubHkgY29udmVydHMgcGFydHMgb2YgdGhlIGRvbWFpbiBuYW1lIHRoYXRcbiAgICAgIC8vIGhhdmUgbm9uLUFTQ0lJIGNoYXJhY3RlcnMsIGkuZS4gaXQgZG9lc24ndCBtYXR0ZXIgaWZcbiAgICAgIC8vIHlvdSBjYWxsIGl0IHdpdGggYSBkb21haW4gdGhhdCBhbHJlYWR5IGlzIEFTQ0lJLW9ubHkuXG4gICAgICB0aGlzLmhvc3RuYW1lID0gcHVueWNvZGUudG9BU0NJSSh0aGlzLmhvc3RuYW1lKTtcbiAgICB9XG5cbiAgICB2YXIgcCA9IHRoaXMucG9ydCA/ICc6JyArIHRoaXMucG9ydCA6ICcnO1xuICAgIHZhciBoID0gdGhpcy5ob3N0bmFtZSB8fCAnJztcbiAgICB0aGlzLmhvc3QgPSBoICsgcDtcbiAgICB0aGlzLmhyZWYgKz0gdGhpcy5ob3N0O1xuXG4gICAgLy8gc3RyaXAgWyBhbmQgXSBmcm9tIHRoZSBob3N0bmFtZVxuICAgIC8vIHRoZSBob3N0IGZpZWxkIHN0aWxsIHJldGFpbnMgdGhlbSwgdGhvdWdoXG4gICAgaWYgKGlwdjZIb3N0bmFtZSkge1xuICAgICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWUuc3Vic3RyKDEsIHRoaXMuaG9zdG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBpZiAocmVzdFswXSAhPT0gJy8nKSB7XG4gICAgICAgIHJlc3QgPSAnLycgKyByZXN0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIG5vdyByZXN0IGlzIHNldCB0byB0aGUgcG9zdC1ob3N0IHN0dWZmLlxuICAvLyBjaG9wIG9mZiBhbnkgZGVsaW0gY2hhcnMuXG4gIGlmICghdW5zYWZlUHJvdG9jb2xbbG93ZXJQcm90b10pIHtcblxuICAgIC8vIEZpcnN0LCBtYWtlIDEwMCUgc3VyZSB0aGF0IGFueSBcImF1dG9Fc2NhcGVcIiBjaGFycyBnZXRcbiAgICAvLyBlc2NhcGVkLCBldmVuIGlmIGVuY29kZVVSSUNvbXBvbmVudCBkb2Vzbid0IHRoaW5rIHRoZXlcbiAgICAvLyBuZWVkIHRvIGJlLlxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXV0b0VzY2FwZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBhZSA9IGF1dG9Fc2NhcGVbaV07XG4gICAgICBpZiAocmVzdC5pbmRleE9mKGFlKSA9PT0gLTEpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgdmFyIGVzYyA9IGVuY29kZVVSSUNvbXBvbmVudChhZSk7XG4gICAgICBpZiAoZXNjID09PSBhZSkge1xuICAgICAgICBlc2MgPSBlc2NhcGUoYWUpO1xuICAgICAgfVxuICAgICAgcmVzdCA9IHJlc3Quc3BsaXQoYWUpLmpvaW4oZXNjKTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIGNob3Agb2ZmIGZyb20gdGhlIHRhaWwgZmlyc3QuXG4gIHZhciBoYXNoID0gcmVzdC5pbmRleE9mKCcjJyk7XG4gIGlmIChoYXNoICE9PSAtMSkge1xuICAgIC8vIGdvdCBhIGZyYWdtZW50IHN0cmluZy5cbiAgICB0aGlzLmhhc2ggPSByZXN0LnN1YnN0cihoYXNoKTtcbiAgICByZXN0ID0gcmVzdC5zbGljZSgwLCBoYXNoKTtcbiAgfVxuICB2YXIgcW0gPSByZXN0LmluZGV4T2YoJz8nKTtcbiAgaWYgKHFtICE9PSAtMSkge1xuICAgIHRoaXMuc2VhcmNoID0gcmVzdC5zdWJzdHIocW0pO1xuICAgIHRoaXMucXVlcnkgPSByZXN0LnN1YnN0cihxbSArIDEpO1xuICAgIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnlzdHJpbmcucGFyc2UodGhpcy5xdWVyeSk7XG4gICAgfVxuICAgIHJlc3QgPSByZXN0LnNsaWNlKDAsIHFtKTtcbiAgfSBlbHNlIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgLy8gbm8gcXVlcnkgc3RyaW5nLCBidXQgcGFyc2VRdWVyeVN0cmluZyBzdGlsbCByZXF1ZXN0ZWRcbiAgICB0aGlzLnNlYXJjaCA9ICcnO1xuICAgIHRoaXMucXVlcnkgPSB7fTtcbiAgfVxuICBpZiAocmVzdCkgdGhpcy5wYXRobmFtZSA9IHJlc3Q7XG4gIGlmIChzbGFzaGVkUHJvdG9jb2xbbG93ZXJQcm90b10gJiZcbiAgICAgIHRoaXMuaG9zdG5hbWUgJiYgIXRoaXMucGF0aG5hbWUpIHtcbiAgICB0aGlzLnBhdGhuYW1lID0gJy8nO1xuICB9XG5cbiAgLy90byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICBpZiAodGhpcy5wYXRobmFtZSB8fCB0aGlzLnNlYXJjaCkge1xuICAgIHZhciBwID0gdGhpcy5wYXRobmFtZSB8fCAnJztcbiAgICB2YXIgcyA9IHRoaXMuc2VhcmNoIHx8ICcnO1xuICAgIHRoaXMucGF0aCA9IHAgKyBzO1xuICB9XG5cbiAgLy8gZmluYWxseSwgcmVjb25zdHJ1Y3QgdGhlIGhyZWYgYmFzZWQgb24gd2hhdCBoYXMgYmVlbiB2YWxpZGF0ZWQuXG4gIHRoaXMuaHJlZiA9IHRoaXMuZm9ybWF0KCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZm9ybWF0IGEgcGFyc2VkIG9iamVjdCBpbnRvIGEgdXJsIHN0cmluZ1xuZnVuY3Rpb24gdXJsRm9ybWF0KG9iaikge1xuICAvLyBlbnN1cmUgaXQncyBhbiBvYmplY3QsIGFuZCBub3QgYSBzdHJpbmcgdXJsLlxuICAvLyBJZiBpdCdzIGFuIG9iaiwgdGhpcyBpcyBhIG5vLW9wLlxuICAvLyB0aGlzIHdheSwgeW91IGNhbiBjYWxsIHVybF9mb3JtYXQoKSBvbiBzdHJpbmdzXG4gIC8vIHRvIGNsZWFuIHVwIHBvdGVudGlhbGx5IHdvbmt5IHVybHMuXG4gIGlmICh1dGlsLmlzU3RyaW5nKG9iaikpIG9iaiA9IHVybFBhcnNlKG9iaik7XG4gIGlmICghKG9iaiBpbnN0YW5jZW9mIFVybCkpIHJldHVybiBVcmwucHJvdG90eXBlLmZvcm1hdC5jYWxsKG9iaik7XG4gIHJldHVybiBvYmouZm9ybWF0KCk7XG59XG5cblVybC5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhdXRoID0gdGhpcy5hdXRoIHx8ICcnO1xuICBpZiAoYXV0aCkge1xuICAgIGF1dGggPSBlbmNvZGVVUklDb21wb25lbnQoYXV0aCk7XG4gICAgYXV0aCA9IGF1dGgucmVwbGFjZSgvJTNBL2ksICc6Jyk7XG4gICAgYXV0aCArPSAnQCc7XG4gIH1cblxuICB2YXIgcHJvdG9jb2wgPSB0aGlzLnByb3RvY29sIHx8ICcnLFxuICAgICAgcGF0aG5hbWUgPSB0aGlzLnBhdGhuYW1lIHx8ICcnLFxuICAgICAgaGFzaCA9IHRoaXMuaGFzaCB8fCAnJyxcbiAgICAgIGhvc3QgPSBmYWxzZSxcbiAgICAgIHF1ZXJ5ID0gJyc7XG5cbiAgaWYgKHRoaXMuaG9zdCkge1xuICAgIGhvc3QgPSBhdXRoICsgdGhpcy5ob3N0O1xuICB9IGVsc2UgaWYgKHRoaXMuaG9zdG5hbWUpIHtcbiAgICBob3N0ID0gYXV0aCArICh0aGlzLmhvc3RuYW1lLmluZGV4T2YoJzonKSA9PT0gLTEgP1xuICAgICAgICB0aGlzLmhvc3RuYW1lIDpcbiAgICAgICAgJ1snICsgdGhpcy5ob3N0bmFtZSArICddJyk7XG4gICAgaWYgKHRoaXMucG9ydCkge1xuICAgICAgaG9zdCArPSAnOicgKyB0aGlzLnBvcnQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMucXVlcnkgJiZcbiAgICAgIHV0aWwuaXNPYmplY3QodGhpcy5xdWVyeSkgJiZcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMucXVlcnkpLmxlbmd0aCkge1xuICAgIHF1ZXJ5ID0gcXVlcnlzdHJpbmcuc3RyaW5naWZ5KHRoaXMucXVlcnkpO1xuICB9XG5cbiAgdmFyIHNlYXJjaCA9IHRoaXMuc2VhcmNoIHx8IChxdWVyeSAmJiAoJz8nICsgcXVlcnkpKSB8fCAnJztcblxuICBpZiAocHJvdG9jb2wgJiYgcHJvdG9jb2wuc3Vic3RyKC0xKSAhPT0gJzonKSBwcm90b2NvbCArPSAnOic7XG5cbiAgLy8gb25seSB0aGUgc2xhc2hlZFByb3RvY29scyBnZXQgdGhlIC8vLiAgTm90IG1haWx0bzosIHhtcHA6LCBldGMuXG4gIC8vIHVubGVzcyB0aGV5IGhhZCB0aGVtIHRvIGJlZ2luIHdpdGguXG4gIGlmICh0aGlzLnNsYXNoZXMgfHxcbiAgICAgICghcHJvdG9jb2wgfHwgc2xhc2hlZFByb3RvY29sW3Byb3RvY29sXSkgJiYgaG9zdCAhPT0gZmFsc2UpIHtcbiAgICBob3N0ID0gJy8vJyArIChob3N0IHx8ICcnKTtcbiAgICBpZiAocGF0aG5hbWUgJiYgcGF0aG5hbWUuY2hhckF0KDApICE9PSAnLycpIHBhdGhuYW1lID0gJy8nICsgcGF0aG5hbWU7XG4gIH0gZWxzZSBpZiAoIWhvc3QpIHtcbiAgICBob3N0ID0gJyc7XG4gIH1cblxuICBpZiAoaGFzaCAmJiBoYXNoLmNoYXJBdCgwKSAhPT0gJyMnKSBoYXNoID0gJyMnICsgaGFzaDtcbiAgaWYgKHNlYXJjaCAmJiBzZWFyY2guY2hhckF0KDApICE9PSAnPycpIHNlYXJjaCA9ICc/JyArIHNlYXJjaDtcblxuICBwYXRobmFtZSA9IHBhdGhuYW1lLnJlcGxhY2UoL1s/I10vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KG1hdGNoKTtcbiAgfSk7XG4gIHNlYXJjaCA9IHNlYXJjaC5yZXBsYWNlKCcjJywgJyUyMycpO1xuXG4gIHJldHVybiBwcm90b2NvbCArIGhvc3QgKyBwYXRobmFtZSArIHNlYXJjaCArIGhhc2g7XG59O1xuXG5mdW5jdGlvbiB1cmxSZXNvbHZlKHNvdXJjZSwgcmVsYXRpdmUpIHtcbiAgcmV0dXJuIHVybFBhcnNlKHNvdXJjZSwgZmFsc2UsIHRydWUpLnJlc29sdmUocmVsYXRpdmUpO1xufVxuXG5VcmwucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihyZWxhdGl2ZSkge1xuICByZXR1cm4gdGhpcy5yZXNvbHZlT2JqZWN0KHVybFBhcnNlKHJlbGF0aXZlLCBmYWxzZSwgdHJ1ZSkpLmZvcm1hdCgpO1xufTtcblxuZnVuY3Rpb24gdXJsUmVzb2x2ZU9iamVjdChzb3VyY2UsIHJlbGF0aXZlKSB7XG4gIGlmICghc291cmNlKSByZXR1cm4gcmVsYXRpdmU7XG4gIHJldHVybiB1cmxQYXJzZShzb3VyY2UsIGZhbHNlLCB0cnVlKS5yZXNvbHZlT2JqZWN0KHJlbGF0aXZlKTtcbn1cblxuVXJsLnByb3RvdHlwZS5yZXNvbHZlT2JqZWN0ID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcbiAgaWYgKHV0aWwuaXNTdHJpbmcocmVsYXRpdmUpKSB7XG4gICAgdmFyIHJlbCA9IG5ldyBVcmwoKTtcbiAgICByZWwucGFyc2UocmVsYXRpdmUsIGZhbHNlLCB0cnVlKTtcbiAgICByZWxhdGl2ZSA9IHJlbDtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSBuZXcgVXJsKCk7XG4gIHZhciB0a2V5cyA9IE9iamVjdC5rZXlzKHRoaXMpO1xuICBmb3IgKHZhciB0ayA9IDA7IHRrIDwgdGtleXMubGVuZ3RoOyB0aysrKSB7XG4gICAgdmFyIHRrZXkgPSB0a2V5c1t0a107XG4gICAgcmVzdWx0W3RrZXldID0gdGhpc1t0a2V5XTtcbiAgfVxuXG4gIC8vIGhhc2ggaXMgYWx3YXlzIG92ZXJyaWRkZW4sIG5vIG1hdHRlciB3aGF0LlxuICAvLyBldmVuIGhyZWY9XCJcIiB3aWxsIHJlbW92ZSBpdC5cbiAgcmVzdWx0Lmhhc2ggPSByZWxhdGl2ZS5oYXNoO1xuXG4gIC8vIGlmIHRoZSByZWxhdGl2ZSB1cmwgaXMgZW1wdHksIHRoZW4gdGhlcmUncyBub3RoaW5nIGxlZnQgdG8gZG8gaGVyZS5cbiAgaWYgKHJlbGF0aXZlLmhyZWYgPT09ICcnKSB7XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIGhyZWZzIGxpa2UgLy9mb28vYmFyIGFsd2F5cyBjdXQgdG8gdGhlIHByb3RvY29sLlxuICBpZiAocmVsYXRpdmUuc2xhc2hlcyAmJiAhcmVsYXRpdmUucHJvdG9jb2wpIHtcbiAgICAvLyB0YWtlIGV2ZXJ5dGhpbmcgZXhjZXB0IHRoZSBwcm90b2NvbCBmcm9tIHJlbGF0aXZlXG4gICAgdmFyIHJrZXlzID0gT2JqZWN0LmtleXMocmVsYXRpdmUpO1xuICAgIGZvciAodmFyIHJrID0gMDsgcmsgPCBya2V5cy5sZW5ndGg7IHJrKyspIHtcbiAgICAgIHZhciBya2V5ID0gcmtleXNbcmtdO1xuICAgICAgaWYgKHJrZXkgIT09ICdwcm90b2NvbCcpXG4gICAgICAgIHJlc3VsdFtya2V5XSA9IHJlbGF0aXZlW3JrZXldO1xuICAgIH1cblxuICAgIC8vdXJsUGFyc2UgYXBwZW5kcyB0cmFpbGluZyAvIHRvIHVybHMgbGlrZSBodHRwOi8vd3d3LmV4YW1wbGUuY29tXG4gICAgaWYgKHNsYXNoZWRQcm90b2NvbFtyZXN1bHQucHJvdG9jb2xdICYmXG4gICAgICAgIHJlc3VsdC5ob3N0bmFtZSAmJiAhcmVzdWx0LnBhdGhuYW1lKSB7XG4gICAgICByZXN1bHQucGF0aCA9IHJlc3VsdC5wYXRobmFtZSA9ICcvJztcbiAgICB9XG5cbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKHJlbGF0aXZlLnByb3RvY29sICYmIHJlbGF0aXZlLnByb3RvY29sICE9PSByZXN1bHQucHJvdG9jb2wpIHtcbiAgICAvLyBpZiBpdCdzIGEga25vd24gdXJsIHByb3RvY29sLCB0aGVuIGNoYW5naW5nXG4gICAgLy8gdGhlIHByb3RvY29sIGRvZXMgd2VpcmQgdGhpbmdzXG4gICAgLy8gZmlyc3QsIGlmIGl0J3Mgbm90IGZpbGU6LCB0aGVuIHdlIE1VU1QgaGF2ZSBhIGhvc3QsXG4gICAgLy8gYW5kIGlmIHRoZXJlIHdhcyBhIHBhdGhcbiAgICAvLyB0byBiZWdpbiB3aXRoLCB0aGVuIHdlIE1VU1QgaGF2ZSBhIHBhdGguXG4gICAgLy8gaWYgaXQgaXMgZmlsZTosIHRoZW4gdGhlIGhvc3QgaXMgZHJvcHBlZCxcbiAgICAvLyBiZWNhdXNlIHRoYXQncyBrbm93biB0byBiZSBob3N0bGVzcy5cbiAgICAvLyBhbnl0aGluZyBlbHNlIGlzIGFzc3VtZWQgdG8gYmUgYWJzb2x1dGUuXG4gICAgaWYgKCFzbGFzaGVkUHJvdG9jb2xbcmVsYXRpdmUucHJvdG9jb2xdKSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHJlbGF0aXZlKTtcbiAgICAgIGZvciAodmFyIHYgPSAwOyB2IDwga2V5cy5sZW5ndGg7IHYrKykge1xuICAgICAgICB2YXIgayA9IGtleXNbdl07XG4gICAgICAgIHJlc3VsdFtrXSA9IHJlbGF0aXZlW2tdO1xuICAgICAgfVxuICAgICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHJlc3VsdC5wcm90b2NvbCA9IHJlbGF0aXZlLnByb3RvY29sO1xuICAgIGlmICghcmVsYXRpdmUuaG9zdCAmJiAhaG9zdGxlc3NQcm90b2NvbFtyZWxhdGl2ZS5wcm90b2NvbF0pIHtcbiAgICAgIHZhciByZWxQYXRoID0gKHJlbGF0aXZlLnBhdGhuYW1lIHx8ICcnKS5zcGxpdCgnLycpO1xuICAgICAgd2hpbGUgKHJlbFBhdGgubGVuZ3RoICYmICEocmVsYXRpdmUuaG9zdCA9IHJlbFBhdGguc2hpZnQoKSkpO1xuICAgICAgaWYgKCFyZWxhdGl2ZS5ob3N0KSByZWxhdGl2ZS5ob3N0ID0gJyc7XG4gICAgICBpZiAoIXJlbGF0aXZlLmhvc3RuYW1lKSByZWxhdGl2ZS5ob3N0bmFtZSA9ICcnO1xuICAgICAgaWYgKHJlbFBhdGhbMF0gIT09ICcnKSByZWxQYXRoLnVuc2hpZnQoJycpO1xuICAgICAgaWYgKHJlbFBhdGgubGVuZ3RoIDwgMikgcmVsUGF0aC51bnNoaWZ0KCcnKTtcbiAgICAgIHJlc3VsdC5wYXRobmFtZSA9IHJlbFBhdGguam9pbignLycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucGF0aG5hbWUgPSByZWxhdGl2ZS5wYXRobmFtZTtcbiAgICB9XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgICByZXN1bHQuaG9zdCA9IHJlbGF0aXZlLmhvc3QgfHwgJyc7XG4gICAgcmVzdWx0LmF1dGggPSByZWxhdGl2ZS5hdXRoO1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlbGF0aXZlLmhvc3RuYW1lIHx8IHJlbGF0aXZlLmhvc3Q7XG4gICAgcmVzdWx0LnBvcnQgPSByZWxhdGl2ZS5wb3J0O1xuICAgIC8vIHRvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gICAgaWYgKHJlc3VsdC5wYXRobmFtZSB8fCByZXN1bHQuc2VhcmNoKSB7XG4gICAgICB2YXIgcCA9IHJlc3VsdC5wYXRobmFtZSB8fCAnJztcbiAgICAgIHZhciBzID0gcmVzdWx0LnNlYXJjaCB8fCAnJztcbiAgICAgIHJlc3VsdC5wYXRoID0gcCArIHM7XG4gICAgfVxuICAgIHJlc3VsdC5zbGFzaGVzID0gcmVzdWx0LnNsYXNoZXMgfHwgcmVsYXRpdmUuc2xhc2hlcztcbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgdmFyIGlzU291cmNlQWJzID0gKHJlc3VsdC5wYXRobmFtZSAmJiByZXN1bHQucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpLFxuICAgICAgaXNSZWxBYnMgPSAoXG4gICAgICAgICAgcmVsYXRpdmUuaG9zdCB8fFxuICAgICAgICAgIHJlbGF0aXZlLnBhdGhuYW1lICYmIHJlbGF0aXZlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nXG4gICAgICApLFxuICAgICAgbXVzdEVuZEFicyA9IChpc1JlbEFicyB8fCBpc1NvdXJjZUFicyB8fFxuICAgICAgICAgICAgICAgICAgICAocmVzdWx0Lmhvc3QgJiYgcmVsYXRpdmUucGF0aG5hbWUpKSxcbiAgICAgIHJlbW92ZUFsbERvdHMgPSBtdXN0RW5kQWJzLFxuICAgICAgc3JjUGF0aCA9IHJlc3VsdC5wYXRobmFtZSAmJiByZXN1bHQucGF0aG5hbWUuc3BsaXQoJy8nKSB8fCBbXSxcbiAgICAgIHJlbFBhdGggPSByZWxhdGl2ZS5wYXRobmFtZSAmJiByZWxhdGl2ZS5wYXRobmFtZS5zcGxpdCgnLycpIHx8IFtdLFxuICAgICAgcHN5Y2hvdGljID0gcmVzdWx0LnByb3RvY29sICYmICFzbGFzaGVkUHJvdG9jb2xbcmVzdWx0LnByb3RvY29sXTtcblxuICAvLyBpZiB0aGUgdXJsIGlzIGEgbm9uLXNsYXNoZWQgdXJsLCB0aGVuIHJlbGF0aXZlXG4gIC8vIGxpbmtzIGxpa2UgLi4vLi4gc2hvdWxkIGJlIGFibGVcbiAgLy8gdG8gY3Jhd2wgdXAgdG8gdGhlIGhvc3RuYW1lLCBhcyB3ZWxsLiAgVGhpcyBpcyBzdHJhbmdlLlxuICAvLyByZXN1bHQucHJvdG9jb2wgaGFzIGFscmVhZHkgYmVlbiBzZXQgYnkgbm93LlxuICAvLyBMYXRlciBvbiwgcHV0IHRoZSBmaXJzdCBwYXRoIHBhcnQgaW50byB0aGUgaG9zdCBmaWVsZC5cbiAgaWYgKHBzeWNob3RpYykge1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9ICcnO1xuICAgIHJlc3VsdC5wb3J0ID0gbnVsbDtcbiAgICBpZiAocmVzdWx0Lmhvc3QpIHtcbiAgICAgIGlmIChzcmNQYXRoWzBdID09PSAnJykgc3JjUGF0aFswXSA9IHJlc3VsdC5ob3N0O1xuICAgICAgZWxzZSBzcmNQYXRoLnVuc2hpZnQocmVzdWx0Lmhvc3QpO1xuICAgIH1cbiAgICByZXN1bHQuaG9zdCA9ICcnO1xuICAgIGlmIChyZWxhdGl2ZS5wcm90b2NvbCkge1xuICAgICAgcmVsYXRpdmUuaG9zdG5hbWUgPSBudWxsO1xuICAgICAgcmVsYXRpdmUucG9ydCA9IG51bGw7XG4gICAgICBpZiAocmVsYXRpdmUuaG9zdCkge1xuICAgICAgICBpZiAocmVsUGF0aFswXSA9PT0gJycpIHJlbFBhdGhbMF0gPSByZWxhdGl2ZS5ob3N0O1xuICAgICAgICBlbHNlIHJlbFBhdGgudW5zaGlmdChyZWxhdGl2ZS5ob3N0KTtcbiAgICAgIH1cbiAgICAgIHJlbGF0aXZlLmhvc3QgPSBudWxsO1xuICAgIH1cbiAgICBtdXN0RW5kQWJzID0gbXVzdEVuZEFicyAmJiAocmVsUGF0aFswXSA9PT0gJycgfHwgc3JjUGF0aFswXSA9PT0gJycpO1xuICB9XG5cbiAgaWYgKGlzUmVsQWJzKSB7XG4gICAgLy8gaXQncyBhYnNvbHV0ZS5cbiAgICByZXN1bHQuaG9zdCA9IChyZWxhdGl2ZS5ob3N0IHx8IHJlbGF0aXZlLmhvc3QgPT09ICcnKSA/XG4gICAgICAgICAgICAgICAgICByZWxhdGl2ZS5ob3N0IDogcmVzdWx0Lmhvc3Q7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gKHJlbGF0aXZlLmhvc3RuYW1lIHx8IHJlbGF0aXZlLmhvc3RuYW1lID09PSAnJykgP1xuICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLmhvc3RuYW1lIDogcmVzdWx0Lmhvc3RuYW1lO1xuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgc3JjUGF0aCA9IHJlbFBhdGg7XG4gICAgLy8gZmFsbCB0aHJvdWdoIHRvIHRoZSBkb3QtaGFuZGxpbmcgYmVsb3cuXG4gIH0gZWxzZSBpZiAocmVsUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBpdCdzIHJlbGF0aXZlXG4gICAgLy8gdGhyb3cgYXdheSB0aGUgZXhpc3RpbmcgZmlsZSwgYW5kIHRha2UgdGhlIG5ldyBwYXRoIGluc3RlYWQuXG4gICAgaWYgKCFzcmNQYXRoKSBzcmNQYXRoID0gW107XG4gICAgc3JjUGF0aC5wb3AoKTtcbiAgICBzcmNQYXRoID0gc3JjUGF0aC5jb25jYXQocmVsUGF0aCk7XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgfSBlbHNlIGlmICghdXRpbC5pc051bGxPclVuZGVmaW5lZChyZWxhdGl2ZS5zZWFyY2gpKSB7XG4gICAgLy8ganVzdCBwdWxsIG91dCB0aGUgc2VhcmNoLlxuICAgIC8vIGxpa2UgaHJlZj0nP2ZvbycuXG4gICAgLy8gUHV0IHRoaXMgYWZ0ZXIgdGhlIG90aGVyIHR3byBjYXNlcyBiZWNhdXNlIGl0IHNpbXBsaWZpZXMgdGhlIGJvb2xlYW5zXG4gICAgaWYgKHBzeWNob3RpYykge1xuICAgICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3QgPSBzcmNQYXRoLnNoaWZ0KCk7XG4gICAgICAvL29jY2F0aW9uYWx5IHRoZSBhdXRoIGNhbiBnZXQgc3R1Y2sgb25seSBpbiBob3N0XG4gICAgICAvL3RoaXMgZXNwZWNpYWxseSBoYXBwZW5zIGluIGNhc2VzIGxpa2VcbiAgICAgIC8vdXJsLnJlc29sdmVPYmplY3QoJ21haWx0bzpsb2NhbDFAZG9tYWluMScsICdsb2NhbDJAZG9tYWluMicpXG4gICAgICB2YXIgYXV0aEluSG9zdCA9IHJlc3VsdC5ob3N0ICYmIHJlc3VsdC5ob3N0LmluZGV4T2YoJ0AnKSA+IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuaG9zdC5zcGxpdCgnQCcpIDogZmFsc2U7XG4gICAgICBpZiAoYXV0aEluSG9zdCkge1xuICAgICAgICByZXN1bHQuYXV0aCA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICAgICAgcmVzdWx0Lmhvc3QgPSByZXN1bHQuaG9zdG5hbWUgPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgLy90byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICAgIGlmICghdXRpbC5pc051bGwocmVzdWx0LnBhdGhuYW1lKSB8fCAhdXRpbC5pc051bGwocmVzdWx0LnNlYXJjaCkpIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gKHJlc3VsdC5wYXRobmFtZSA/IHJlc3VsdC5wYXRobmFtZSA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAgIChyZXN1bHQuc2VhcmNoID8gcmVzdWx0LnNlYXJjaCA6ICcnKTtcbiAgICB9XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGlmICghc3JjUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBubyBwYXRoIGF0IGFsbC4gIGVhc3kuXG4gICAgLy8gd2UndmUgYWxyZWFkeSBoYW5kbGVkIHRoZSBvdGhlciBzdHVmZiBhYm92ZS5cbiAgICByZXN1bHQucGF0aG5hbWUgPSBudWxsO1xuICAgIC8vdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgICBpZiAocmVzdWx0LnNlYXJjaCkge1xuICAgICAgcmVzdWx0LnBhdGggPSAnLycgKyByZXN1bHQuc2VhcmNoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucGF0aCA9IG51bGw7XG4gICAgfVxuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBpZiBhIHVybCBFTkRzIGluIC4gb3IgLi4sIHRoZW4gaXQgbXVzdCBnZXQgYSB0cmFpbGluZyBzbGFzaC5cbiAgLy8gaG93ZXZlciwgaWYgaXQgZW5kcyBpbiBhbnl0aGluZyBlbHNlIG5vbi1zbGFzaHksXG4gIC8vIHRoZW4gaXQgbXVzdCBOT1QgZ2V0IGEgdHJhaWxpbmcgc2xhc2guXG4gIHZhciBsYXN0ID0gc3JjUGF0aC5zbGljZSgtMSlbMF07XG4gIHZhciBoYXNUcmFpbGluZ1NsYXNoID0gKFxuICAgICAgKHJlc3VsdC5ob3N0IHx8IHJlbGF0aXZlLmhvc3QgfHwgc3JjUGF0aC5sZW5ndGggPiAxKSAmJlxuICAgICAgKGxhc3QgPT09ICcuJyB8fCBsYXN0ID09PSAnLi4nKSB8fCBsYXN0ID09PSAnJyk7XG5cbiAgLy8gc3RyaXAgc2luZ2xlIGRvdHMsIHJlc29sdmUgZG91YmxlIGRvdHMgdG8gcGFyZW50IGRpclxuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gc3JjUGF0aC5sZW5ndGg7IGkgPj0gMDsgaS0tKSB7XG4gICAgbGFzdCA9IHNyY1BhdGhbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBzcmNQYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKCFtdXN0RW5kQWJzICYmICFyZW1vdmVBbGxEb3RzKSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBzcmNQYXRoLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG11c3RFbmRBYnMgJiYgc3JjUGF0aFswXSAhPT0gJycgJiZcbiAgICAgICghc3JjUGF0aFswXSB8fCBzcmNQYXRoWzBdLmNoYXJBdCgwKSAhPT0gJy8nKSkge1xuICAgIHNyY1BhdGgudW5zaGlmdCgnJyk7XG4gIH1cblxuICBpZiAoaGFzVHJhaWxpbmdTbGFzaCAmJiAoc3JjUGF0aC5qb2luKCcvJykuc3Vic3RyKC0xKSAhPT0gJy8nKSkge1xuICAgIHNyY1BhdGgucHVzaCgnJyk7XG4gIH1cblxuICB2YXIgaXNBYnNvbHV0ZSA9IHNyY1BhdGhbMF0gPT09ICcnIHx8XG4gICAgICAoc3JjUGF0aFswXSAmJiBzcmNQYXRoWzBdLmNoYXJBdCgwKSA9PT0gJy8nKTtcblxuICAvLyBwdXQgdGhlIGhvc3QgYmFja1xuICBpZiAocHN5Y2hvdGljKSB7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3QgPSBpc0Fic29sdXRlID8gJycgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjUGF0aC5sZW5ndGggPyBzcmNQYXRoLnNoaWZ0KCkgOiAnJztcbiAgICAvL29jY2F0aW9uYWx5IHRoZSBhdXRoIGNhbiBnZXQgc3R1Y2sgb25seSBpbiBob3N0XG4gICAgLy90aGlzIGVzcGVjaWFsbHkgaGFwcGVucyBpbiBjYXNlcyBsaWtlXG4gICAgLy91cmwucmVzb2x2ZU9iamVjdCgnbWFpbHRvOmxvY2FsMUBkb21haW4xJywgJ2xvY2FsMkBkb21haW4yJylcbiAgICB2YXIgYXV0aEluSG9zdCA9IHJlc3VsdC5ob3N0ICYmIHJlc3VsdC5ob3N0LmluZGV4T2YoJ0AnKSA+IDAgP1xuICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lmhvc3Quc3BsaXQoJ0AnKSA6IGZhbHNlO1xuICAgIGlmIChhdXRoSW5Ib3N0KSB7XG4gICAgICByZXN1bHQuYXV0aCA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICAgIHJlc3VsdC5ob3N0ID0gcmVzdWx0Lmhvc3RuYW1lID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgIH1cbiAgfVxuXG4gIG11c3RFbmRBYnMgPSBtdXN0RW5kQWJzIHx8IChyZXN1bHQuaG9zdCAmJiBzcmNQYXRoLmxlbmd0aCk7XG5cbiAgaWYgKG11c3RFbmRBYnMgJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBzcmNQYXRoLnVuc2hpZnQoJycpO1xuICB9XG5cbiAgaWYgKCFzcmNQYXRoLmxlbmd0aCkge1xuICAgIHJlc3VsdC5wYXRobmFtZSA9IG51bGw7XG4gICAgcmVzdWx0LnBhdGggPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5wYXRobmFtZSA9IHNyY1BhdGguam9pbignLycpO1xuICB9XG5cbiAgLy90byBzdXBwb3J0IHJlcXVlc3QuaHR0cFxuICBpZiAoIXV0aWwuaXNOdWxsKHJlc3VsdC5wYXRobmFtZSkgfHwgIXV0aWwuaXNOdWxsKHJlc3VsdC5zZWFyY2gpKSB7XG4gICAgcmVzdWx0LnBhdGggPSAocmVzdWx0LnBhdGhuYW1lID8gcmVzdWx0LnBhdGhuYW1lIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChyZXN1bHQuc2VhcmNoID8gcmVzdWx0LnNlYXJjaCA6ICcnKTtcbiAgfVxuICByZXN1bHQuYXV0aCA9IHJlbGF0aXZlLmF1dGggfHwgcmVzdWx0LmF1dGg7XG4gIHJlc3VsdC5zbGFzaGVzID0gcmVzdWx0LnNsYXNoZXMgfHwgcmVsYXRpdmUuc2xhc2hlcztcbiAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5VcmwucHJvdG90eXBlLnBhcnNlSG9zdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaG9zdCA9IHRoaXMuaG9zdDtcbiAgdmFyIHBvcnQgPSBwb3J0UGF0dGVybi5leGVjKGhvc3QpO1xuICBpZiAocG9ydCkge1xuICAgIHBvcnQgPSBwb3J0WzBdO1xuICAgIGlmIChwb3J0ICE9PSAnOicpIHtcbiAgICAgIHRoaXMucG9ydCA9IHBvcnQuc3Vic3RyKDEpO1xuICAgIH1cbiAgICBob3N0ID0gaG9zdC5zdWJzdHIoMCwgaG9zdC5sZW5ndGggLSBwb3J0Lmxlbmd0aCk7XG4gIH1cbiAgaWYgKGhvc3QpIHRoaXMuaG9zdG5hbWUgPSBob3N0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzU3RyaW5nOiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gdHlwZW9mKGFyZykgPT09ICdzdHJpbmcnO1xuICB9LFxuICBpc09iamVjdDogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHR5cGVvZihhcmcpID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG4gIH0sXG4gIGlzTnVsbDogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbiAgfSxcbiAgaXNOdWxsT3JVbmRlZmluZWQ6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBhcmcgPT0gbnVsbDtcbiAgfVxufTtcbiIsIi8qIGdsb2JhbCBzYWZhcmk6ZmFsc2UgKi9cclxubGV0IGNvbnRleHRcclxuXHJcbmlmIChzYWZhcmkgJiZcclxuICAgICAgICBzYWZhcmkuZXh0ZW5zaW9uICYmXHJcbiAgICAgICAgc2FmYXJpLmV4dGVuc2lvbi5nbG9iYWxQYWdlICYmXHJcbiAgICAgICAgc2FmYXJpLmV4dGVuc2lvbi5nbG9iYWxQYWdlLmNvbnRlbnRXaW5kb3cpIHtcclxuICAgIGNvbnRleHQgPSAncG9wdXAnXHJcbn0gZWxzZSBpZiAoc2FmYXJpICYmXHJcbiAgICAgICAgc2FmYXJpLnNlbGYgJiZcclxuICAgICAgICBzYWZhcmkuc2VsZi50YWIpIHtcclxuICAgIGNvbnRleHQgPSAnZXh0ZW5zaW9uUGFnZSdcclxufSBlbHNlIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignc2FmYXJpLXVpLXdyYXBwZXIgY291bGRuXFwndCBmaWd1cmUgb3V0IHRoZSBjb250ZXh0IGl0XFwncyBpbicpXHJcbn1cclxuXHJcbmxldCByZWxvYWRUYWIgPSAoKSA9PiB7XHJcbiAgICB2YXIgYWN0aXZlVGFiID0gd2luZG93LnNhZmFyaS5hcHBsaWNhdGlvbi5hY3RpdmVCcm93c2VyV2luZG93LmFjdGl2ZVRhYlxyXG4gICAgYWN0aXZlVGFiLnVybCA9IGFjdGl2ZVRhYi51cmxcclxufVxyXG5cclxubGV0IGNsb3NlUG9wdXAgPSAoKSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmYXJpLnNlbGYuaGlkZSgpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNZXNzYWdpbmcgdG8vZnJvbSB0aGUgYmFja2dyb3VuZCBwYWdlXHJcbiAqXHJcbiAqIFVubGlrZSBDaHJvbWUsIFNhZmFyaSBoYXMgZGlmZmVyZW50IGNvbnRleHRzIGZvciB0aGUgcG9wdXBzIGFuZCBleHRlbnNpb24gcGFnZXNcclxuICpcclxuICogSW4gZXh0ZW5zaW9uIHBhZ2VzLCBpdCdzIGltcG9zc2libGUgdG8gc2VuZCBhIG1lc3NhZ2UgYWxvbmcgd2l0aCBhIGNhbGxiYWNrXHJcbiAqIGZvciBhIHJlcGx5LCBzbyBmb3IgbWVzc2FnZXMgdGhhdCBuZWVkIGEgcmVzcG9uc2UgKGUuZy4gZ2V0U2V0dGluZykgd2UgbmVlZCB0b1xyXG4gKiBrZWVwIHRyYWNrIG9mIHRoZW0gdmlhIGFuIElEXHJcbiAqL1xyXG5cclxubGV0IHBlbmRpbmdNZXNzYWdlcyA9IHt9XHJcblxyXG5sZXQgc2VuZEV4dGVuc2lvblBhZ2VNZXNzYWdlID0gKG1lc3NhZ2UsIHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgaWYgKG1lc3NhZ2Uud2hpdGVsaXN0ZWQpIHtcclxuICAgICAgICByZXNvbHZlKHNhZmFyaS5zZWxmLnRhYi5kaXNwYXRjaE1lc3NhZ2UoJ3doaXRlbGlzdGVkJywgbWVzc2FnZSkpXHJcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuZ2V0U2V0dGluZykge1xyXG4gICAgICAgIGxldCBpZCA9IE1hdGgucmFuZG9tKClcclxuICAgICAgICBtZXNzYWdlLmlkID0gaWRcclxuICAgICAgICBwZW5kaW5nTWVzc2FnZXNbaWRdID0gcmVzb2x2ZVxyXG4gICAgICAgIHNhZmFyaS5zZWxmLnRhYi5kaXNwYXRjaE1lc3NhZ2UoJ2dldFNldHRpbmcnLCBtZXNzYWdlKVxyXG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmdldEV4dGVuc2lvblZlcnNpb24pIHtcclxuICAgICAgICBsZXQgaWQgPSBNYXRoLnJhbmRvbSgpXHJcbiAgICAgICAgbWVzc2FnZS5pZCA9IGlkXHJcbiAgICAgICAgcGVuZGluZ01lc3NhZ2VzW2lkXSA9IHJlc29sdmVcclxuICAgICAgICBzYWZhcmkuc2VsZi50YWIuZGlzcGF0Y2hNZXNzYWdlKCdnZXRFeHRlbnNpb25WZXJzaW9uJywgbWVzc2FnZSlcclxuICAgIH0gZWxzZSBpZiAobWVzc2FnZS51cGRhdGVTZXR0aW5nKSB7XHJcbiAgICAgICAgcmVzb2x2ZShzYWZhcmkuc2VsZi50YWIuZGlzcGF0Y2hNZXNzYWdlKCd1cGRhdGVTZXR0aW5nJywgbWVzc2FnZSkpXHJcbiAgICB9XHJcbn1cclxuXHJcbmlmIChjb250ZXh0ID09PSAnZXh0ZW5zaW9uUGFnZScpIHtcclxuICAgIHNhZmFyaS5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZSkgPT4ge1xyXG4gICAgICAgIGlmIChlLm5hbWUgIT09ICdiYWNrZ3JvdW5kUmVzcG9uc2UnIHx8ICFlLm1lc3NhZ2UuaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcGVuZGluZ1Jlc29sdmUgPSBwZW5kaW5nTWVzc2FnZXNbZS5tZXNzYWdlLmlkXVxyXG5cclxuICAgICAgICBpZiAoIXBlbmRpbmdSZXNvbHZlKSB7IHJldHVybiB9XHJcblxyXG4gICAgICAgIGRlbGV0ZSBwZW5kaW5nTWVzc2FnZXNbZS5tZXNzYWdlLmlkXVxyXG4gICAgICAgIHBlbmRpbmdSZXNvbHZlKGUubWVzc2FnZS5kYXRhKVxyXG4gICAgfSwgdHJ1ZSlcclxufVxyXG5cclxubGV0IGZldGNoID0gKG1lc3NhZ2UpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFNhZmFyaSBGZXRjaDogJHtKU09OLnN0cmluZ2lmeShtZXNzYWdlKX1gKVxyXG4gICAgICAgIGlmIChjb250ZXh0ID09PSAncG9wdXAnKSB7XHJcbiAgICAgICAgICAgIHNhZmFyaS5leHRlbnNpb24uZ2xvYmFsUGFnZS5jb250ZW50V2luZG93Lm1lc3NhZ2UobWVzc2FnZSwgcmVzb2x2ZSlcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQgPT09ICdleHRlbnNpb25QYWdlJykge1xyXG4gICAgICAgICAgICBzZW5kRXh0ZW5zaW9uUGFnZU1lc3NhZ2UobWVzc2FnZSwgcmVzb2x2ZSwgcmVqZWN0KVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmxldCBiYWNrZ3JvdW5kTWVzc2FnZSA9ICh0aGlzTW9kZWwpID0+IHtcclxuICAgIC8vIGxpc3RlbiBmb3IgbWVzc2FnZXMgZnJvbSBiYWNrZ3JvdW5kXHJcbiAgICBzYWZhcmkuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKHJlcSkgPT4ge1xyXG4gICAgICAgIGlmIChyZXEud2hpdGVsaXN0Q2hhbmdlZCkge1xyXG4gICAgICAgICAgICAvLyBub3RpZnkgc3Vic2NyaWJlcnMgdGhhdCB0aGUgd2hpdGVsaXN0IGhhcyBjaGFuZ2VkXHJcbiAgICAgICAgICAgIHRoaXNNb2RlbC5zZXQoJ3doaXRlbGlzdENoYW5nZWQnLCB0cnVlKVxyXG4gICAgICAgIH0gZWxzZSBpZiAocmVxLnVwZGF0ZVRyYWNrZXJDb3VudCkge1xyXG4gICAgICAgICAgICB0aGlzTW9kZWwuc2V0KCd1cGRhdGVUcmFja2VyQ291bnQnLCB0cnVlKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmxldCBnZXRCYWNrZ3JvdW5kVGFiRGF0YSA9ICgpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGZldGNoKHtnZXRDdXJyZW50VGFiOiB0cnVlfSkudGhlbigodGFiKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0YWIpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0YWJDb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0YWIpKVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0YWJDb3B5KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufVxyXG5cclxubGV0IHNlYXJjaCA9ICh1cmwpID0+IHtcclxuICAgIC8vIGluIENocm9tZSwgYWRkaW5nIHRoZSBBVEIgcGFyYW0gaXMgaGFuZGxlZCBieSBBVEIucmVkaXJlY3RVUkwoKVxyXG4gICAgLy8gd2hpY2ggZG9lc24ndCBoYXBwZW4gb24gU2FmYXJpXHJcbiAgICBmZXRjaCh7IGdldFNldHRpbmc6IHsgbmFtZTogJ2F0YicgfSB9KS50aGVuKChhdGIpID0+IHtcclxuICAgICAgICBzYWZhcmkuYXBwbGljYXRpb24uYWN0aXZlQnJvd3NlcldpbmRvdy5vcGVuVGFiKCkudXJsID0gYGh0dHBzOi8vd3d3LmV4cGxvcmVvcy5jb20vP3E9JHt1cmx9JmJleHQ9c2FmYXJpJmF0Yj0ke2F0Yn1gXHJcbiAgICAgICAgc2FmYXJpLnNlbGYuaGlkZSgpXHJcbiAgICB9KVxyXG59XHJcblxyXG5sZXQgZ2V0RXh0ZW5zaW9uVVJMID0gKHBhdGgpID0+IHtcclxuICAgIHJldHVybiBzYWZhcmkuZXh0ZW5zaW9uLmJhc2VVUkkgKyBwYXRoXHJcbn1cclxuXHJcbmxldCBvcGVuRXh0ZW5zaW9uUGFnZSA9IChwYXRoKSA9PiB7XHJcbiAgICAvLyBDaHJvbWUgbmVlZHMgYW4gb3BlbmluZyBzbGFzaCwgU2FmYXJpIGJyZWFrcyBpZiB5b3UgYWRkIGl0XHJcbiAgICBpZiAocGF0aC5pbmRleE9mKCcvJykgPT09IDApIHtcclxuICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMSlcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdXJsID0gZ2V0RXh0ZW5zaW9uVVJMKHBhdGgpXHJcblxyXG4gICAgaWYgKGNvbnRleHQgPT09ICdwb3B1cCcpIHtcclxuICAgICAgICBsZXQgdGFiID0gc2FmYXJpLmFwcGxpY2F0aW9uLmFjdGl2ZUJyb3dzZXJXaW5kb3cub3BlblRhYigpXHJcbiAgICAgICAgdGFiLnVybCA9IHVybFxyXG4gICAgICAgIHNhZmFyaS5zZWxmLmhpZGUoKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBub3RlOiB0aGlzIHdpbGwgb25seSB3b3JrIGlmIHRoaXMgaXMgaGFwcGVuaW5nIGFzIGEgZGlyZWN0IHJlc3BvbnNlXHJcbiAgICAgICAgLy8gdG8gYSB1c2VyIGNsaWNrIC0gb3RoZXJ3aXNlIGl0J2xsIGJlIGJsb2NrZWQgYnkgU2FmYXJpJ3MgcG9wdXAgYmxvY2tlclxyXG4gICAgICAgIHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpXHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBvcGVuT3B0aW9uc1BhZ2UgPSAoKSA9PiB7XHJcbiAgICBvcGVuRXh0ZW5zaW9uUGFnZSgnL2h0bWwvb3B0aW9ucy5odG1sJylcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBmZXRjaDogZmV0Y2gsXHJcbiAgICByZWxvYWRUYWI6IHJlbG9hZFRhYixcclxuICAgIGNsb3NlUG9wdXA6IGNsb3NlUG9wdXAsXHJcbiAgICBiYWNrZ3JvdW5kTWVzc2FnZTogYmFja2dyb3VuZE1lc3NhZ2UsXHJcbiAgICBnZXRCYWNrZ3JvdW5kVGFiRGF0YTogZ2V0QmFja2dyb3VuZFRhYkRhdGEsXHJcbiAgICBzZWFyY2g6IHNlYXJjaCxcclxuICAgIG9wZW5PcHRpb25zUGFnZTogb3Blbk9wdGlvbnNQYWdlLFxyXG4gICAgb3BlbkV4dGVuc2lvblBhZ2U6IG9wZW5FeHRlbnNpb25QYWdlLFxyXG4gICAgZ2V0RXh0ZW5zaW9uVVJMOiBnZXRFeHRlbnNpb25VUkxcclxufVxyXG4iLCJjb25zdCBQYXJlbnQgPSB3aW5kb3cuRERHLmJhc2UuTW9kZWxcclxuY29uc3QgYnJvd3NlclVJV3JhcHBlciA9IHJlcXVpcmUoJy4vLi4vYmFzZS8kQlJPV1NFUi11aS13cmFwcGVyLmVzNi5qcycpXHJcblxyXG4vKipcclxuICogQmFja2dyb3VuZCBtZXNzYWdpbmcgaXMgZG9uZSB2aWEgdHdvIG1ldGhvZHM6XHJcbiAqXHJcbiAqIDEuIFBhc3NpdmUgbWVzc2FnZXMgZnJvbSBiYWNrZ3JvdW5kIC0+IGJhY2tncm91bmRNZXNzYWdlIG1vZGVsIC0+IHN1YnNjcmliaW5nIG1vZGVsXHJcbiAqXHJcbiAqICBUaGUgYmFja2dyb3VuZCBzZW5kcyB0aGVzZSBtZXNzYWdlcyB1c2luZyBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7J25hbWUnOiAndmFsdWUnfSlcclxuICogIFRoZSBiYWNrZ3JvdW5kTWVzc2FnZSBtb2RlbCAoaGVyZSkgcmVjZWl2ZXMgdGhlIG1lc3NhZ2UgYW5kIGZvcndhcmRzIHRoZVxyXG4gKiAgaXQgdG8gdGhlIGdsb2JhbCBldmVudCBzdG9yZSB2aWEgbW9kZWwuc2VuZChtc2cpXHJcbiAqICBPdGhlciBtb2R1bGVzIHRoYXQgYXJlIHN1YnNjcmliZWQgdG8gc3RhdGUgY2hhbmdlcyBpbiBiYWNrZ3JvdW5kTWVzc2FnZSBhcmUgbm90aWZpZWRcclxuICpcclxuICogMi4gVHdvLXdheSBtZXNzYWdpbmcgdXNpbmcgdGhpcy5tb2RlbC5mZXRjaCgpIGFzIGEgcGFzc3Rocm91Z2hcclxuICpcclxuICogIEVhY2ggbW9kZWwgY2FuIHVzZSBhIGZldGNoIG1ldGhvZCB0byBzZW5kIGFuZCByZWNlaXZlIGEgcmVzcG9uc2UgZnJvbSB0aGUgYmFja2dyb3VuZC5cclxuICogIEV4OiB0aGlzLm1vZGVsLmZldGNoKHsnbmFtZSc6ICd2YWx1ZSd9KS50aGVuKChyZXNwb25zZSkgPT4gY29uc29sZS5sb2cocmVzcG9uc2UpKVxyXG4gKiAgTGlzdGVuZXJzIG11c3QgYmUgcmVnaXN0ZXJlZCBpbiB0aGUgYmFja2dyb3VuZCB0byByZXNwb25kIHRvIG1lc3NhZ2VzIHdpdGggdGhpcyAnbmFtZScuXHJcbiAqXHJcbiAqICBUaGUgY29tbW9uIGZldGNoIG1ldGhvZCBpcyBkZWZpbmVkIGluIGJhc2UvbW9kZWwuZXM2LmpzXHJcbiAqL1xyXG5mdW5jdGlvbiBCYWNrZ3JvdW5kTWVzc2FnZSAoYXR0cnMpIHtcclxuICAgIFBhcmVudC5jYWxsKHRoaXMsIGF0dHJzKVxyXG4gICAgbGV0IHRoaXNNb2RlbCA9IHRoaXNcclxuICAgIGJyb3dzZXJVSVdyYXBwZXIuYmFja2dyb3VuZE1lc3NhZ2UodGhpc01vZGVsKVxyXG59XHJcblxyXG5CYWNrZ3JvdW5kTWVzc2FnZS5wcm90b3R5cGUgPSB3aW5kb3cuJC5leHRlbmQoe30sXHJcbiAgICBQYXJlbnQucHJvdG90eXBlLFxyXG4gICAge1xyXG4gICAgICAgIG1vZGVsTmFtZTogJ2JhY2tncm91bmRNZXNzYWdlJ1xyXG4gICAgfVxyXG4pXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tncm91bmRNZXNzYWdlXHJcbiIsImNvbnN0IFBhcmVudCA9IHdpbmRvdy5EREcuYmFzZS5Nb2RlbFxyXG5cclxuZnVuY3Rpb24gUHJpdmFjeU9wdGlvbnMgKGF0dHJzKSB7XHJcbiAgICAvLyBzZXQgc29tZSBkZWZhdWx0IHZhbHVlcyBmb3IgdGhlIHRvZ2dsZSBzd2l0Y2hlcyBpbiB0aGUgdGVtcGxhdGVcclxuICAgIGF0dHJzLnRyYWNrZXJCbG9ja2luZ0VuYWJsZWQgPSB0cnVlXHJcbiAgICBhdHRycy5odHRwc0V2ZXJ5d2hlcmVFbmFibGVkID0gdHJ1ZVxyXG4gICAgYXR0cnMuZW1iZWRkZWRUd2VldHNFbmFibGVkID0gZmFsc2VcclxuXHJcbiAgICBQYXJlbnQuY2FsbCh0aGlzLCBhdHRycylcclxufVxyXG5cclxuUHJpdmFjeU9wdGlvbnMucHJvdG90eXBlID0gd2luZG93LiQuZXh0ZW5kKHt9LFxyXG4gICAgUGFyZW50LnByb3RvdHlwZSxcclxuICAgIHtcclxuXHJcbiAgICAgICAgbW9kZWxOYW1lOiAncHJpdmFjeU9wdGlvbnMnLFxyXG5cclxuICAgICAgICB0b2dnbGU6IGZ1bmN0aW9uIChrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGspKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzW2tdID0gIXRoaXNba11cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBQcml2YWN5T3B0aW9ucyBtb2RlbCB0b2dnbGUgJHtrfSBpcyBub3cgJHt0aGlzW2tdfWApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoKHt1cGRhdGVTZXR0aW5nOiB7bmFtZTogaywgdmFsdWU6IHRoaXNba119fSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldFNldHRpbmdzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpc1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5mZXRjaCh7Z2V0U2V0dGluZzogJ2FsbCd9KS50aGVuKChzZXR0aW5ncykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudHJhY2tlckJsb2NraW5nRW5hYmxlZCA9IHNldHRpbmdzWyd0cmFja2VyQmxvY2tpbmdFbmFibGVkJ11cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmh0dHBzRXZlcnl3aGVyZUVuYWJsZWQgPSBzZXR0aW5nc1snaHR0cHNFdmVyeXdoZXJlRW5hYmxlZCddXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbWJlZGRlZFR3ZWV0c0VuYWJsZWQgPSBzZXR0aW5nc1snZW1iZWRkZWRUd2VldHNFbmFibGVkJ11cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4pXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFByaXZhY3lPcHRpb25zXHJcbiIsImNvbnN0IFBhcmVudCA9IHdpbmRvdy5EREcuYmFzZS5Nb2RlbFxyXG5jb25zdCB0bGRqcyA9IHJlcXVpcmUoJ3RsZGpzJylcclxuXHJcbmZ1bmN0aW9uIFdoaXRlbGlzdCAoYXR0cnMpIHtcclxuICAgIGF0dHJzLmxpc3QgPSB7fVxyXG4gICAgUGFyZW50LmNhbGwodGhpcywgYXR0cnMpXHJcblxyXG4gICAgdGhpcy5zZXRXaGl0ZWxpc3RGcm9tU2V0dGluZ3MoKVxyXG59XHJcblxyXG5XaGl0ZWxpc3QucHJvdG90eXBlID0gd2luZG93LiQuZXh0ZW5kKHt9LFxyXG4gICAgUGFyZW50LnByb3RvdHlwZSxcclxuICAgIHtcclxuXHJcbiAgICAgICAgbW9kZWxOYW1lOiAnd2hpdGVsaXN0JyxcclxuXHJcbiAgICAgICAgcmVtb3ZlRG9tYWluIChpdGVtSW5kZXgpIHtcclxuICAgICAgICAgICAgbGV0IGRvbWFpbiA9IHRoaXMubGlzdFtpdGVtSW5kZXhdXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGB3aGl0ZWxpc3Q6IHJlbW92ZSAke2RvbWFpbn1gKVxyXG5cclxuICAgICAgICAgICAgdGhpcy5mZXRjaCh7XHJcbiAgICAgICAgICAgICAgICAnd2hpdGVsaXN0ZWQnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdDogJ3doaXRlbGlzdGVkJyxcclxuICAgICAgICAgICAgICAgICAgICBkb21haW46IGRvbWFpbixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2VcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSBsaXN0XHJcbiAgICAgICAgICAgIC8vIHVzZSBzcGxpY2UoKSBzbyBpdCByZWluZGV4ZXMgdGhlIGFycmF5XHJcbiAgICAgICAgICAgIHRoaXMubGlzdC5zcGxpY2UoaXRlbUluZGV4LCAxKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGFkZERvbWFpbjogZnVuY3Rpb24gKHVybCkge1xyXG4gICAgICAgICAgICAvLyBXZSBvbmx5IHdoaXRlbGlzdCBkb21haW5zLCBub3QgZnVsbCBVUkxzOlxyXG4gICAgICAgICAgICAvLyAtIHVzZSBnZXREb21haW4sIGl0IHdpbGwgcmV0dXJuIG51bGwgaWYgdGhlIFVSTCBpcyBpbnZhbGlkXHJcbiAgICAgICAgICAgIC8vIC0gcHJlZml4IHdpdGggZ2V0U3ViRG9tYWluLCB3aGljaCByZXR1cm5zIGFuIGVtcHR5IHN0cmluZyBpZiBub25lIGlzIGZvdW5kXHJcbiAgICAgICAgICAgIC8vIEJ1dCBmaXJzdCwgc3RyaXAgdGhlICd3d3cuJyBwYXJ0LCBvdGhlcndpc2UgZ2V0U3ViRG9tYWluIHdpbGwgaW5jbHVkZSBpdFxyXG4gICAgICAgICAgICAvLyBhbmQgd2hpdGVsaXN0aW5nIHdvbid0IHdvcmsgZm9yIHRoYXQgc2l0ZVxyXG4gICAgICAgICAgICB1cmwgPSB1cmwgPyB1cmwucmVwbGFjZSgnd3d3LicsICcnKSA6ICcnXHJcbiAgICAgICAgICAgIGNvbnN0IGxvY2FsRG9tYWluID0gdXJsLm1hdGNoKC9ebG9jYWxob3N0KDpbMC05XSspPyQvaSkgPyAnbG9jYWxob3N0JyA6IG51bGxcclxuICAgICAgICAgICAgY29uc3Qgc3ViRG9tYWluID0gdGxkanMuZ2V0U3ViZG9tYWluKHVybClcclxuICAgICAgICAgICAgY29uc3QgZG9tYWluID0gdGxkanMuZ2V0RG9tYWluKHVybCkgfHwgbG9jYWxEb21haW5cclxuICAgICAgICAgICAgaWYgKGRvbWFpbikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZG9tYWluVG9XaGl0ZWxpc3QgPSBzdWJEb21haW4gPyBzdWJEb21haW4gKyAnLicgKyBkb21haW4gOiBkb21haW5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGB3aGl0ZWxpc3Q6IGFkZCAke2RvbWFpblRvV2hpdGVsaXN0fWApXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3doaXRlbGlzdGVkJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0OiAnd2hpdGVsaXN0ZWQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb21haW46IGRvbWFpblRvV2hpdGVsaXN0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRXaGl0ZWxpc3RGcm9tU2V0dGluZ3MoKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZG9tYWluXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0V2hpdGVsaXN0RnJvbVNldHRpbmdzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpc1xyXG4gICAgICAgICAgICB0aGlzLmZldGNoKHtnZXRTZXR0aW5nOiB7bmFtZTogJ3doaXRlbGlzdGVkJ319KS50aGVuKCh3aGl0ZWxpc3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHdoaXRlbGlzdCA9IHdoaXRlbGlzdCB8fCB7fVxyXG4gICAgICAgICAgICAgICAgbGV0IHdsaXN0ID0gT2JqZWN0LmtleXMod2hpdGVsaXN0KVxyXG4gICAgICAgICAgICAgICAgd2xpc3Quc29ydCgpXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUHVibGlzaCB3aGl0ZWxpc3QgY2hhbmdlIG5vdGlmaWNhdGlvbiB2aWEgdGhlIHN0b3JlXHJcbiAgICAgICAgICAgICAgICAvLyB1c2VkIHRvIGtub3cgd2hlbiB0byByZXJlbmRlciB0aGUgdmlld1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zZXQoJ2xpc3QnLCB3bGlzdClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gV2hpdGVsaXN0XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgc2V0QnJvd3NlckNsYXNzT25Cb2R5VGFnOiByZXF1aXJlKCcuLyRCUk9XU0VSLXNldC1icm93c2VyLWNsYXNzLmVzNi5qcycpLFxyXG4gICAgcGFyc2VRdWVyeVN0cmluZzogcmVxdWlyZSgnLi9wYXJzZS1xdWVyeS1zdHJpbmcuZXM2LmpzJylcclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHBhcnNlUXVlcnlTdHJpbmc6IChxcykgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgcXMgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndHJpZWQgdG8gcGFyc2UgYSBub24tc3RyaW5nIHF1ZXJ5IHN0cmluZycpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcGFyc2VkID0ge31cclxuXHJcbiAgICAgICAgaWYgKHFzWzBdID09PSAnPycpIHtcclxuICAgICAgICAgICAgcXMgPSBxcy5zdWJzdHIoMSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBwYXJ0cyA9IHFzLnNwbGl0KCcmJylcclxuXHJcbiAgICAgICAgcGFydHMuZm9yRWFjaCgocGFydCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgW2tleSwgdmFsXSA9IHBhcnQuc3BsaXQoJz0nKVxyXG5cclxuICAgICAgICAgICAgaWYgKGtleSAmJiB2YWwpIHtcclxuICAgICAgICAgICAgICAgIHBhcnNlZFtrZXldID0gdmFsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gcGFyc2VkXHJcbiAgICB9XHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBzZXRCcm93c2VyQ2xhc3NPbkJvZHlUYWc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgYnJvd3NlckNsYXNzID0gJ2lzLWJyb3dzZXItLScgKyAnc2FmYXJpJ1xyXG4gICAgICAgIHdpbmRvdy4kKCdodG1sJykuYWRkQ2xhc3MoYnJvd3NlckNsYXNzKVxyXG4gICAgICAgIHdpbmRvdy4kKCdib2R5JykuYWRkQ2xhc3MoYnJvd3NlckNsYXNzKVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnN0IFBhcmVudCA9IHdpbmRvdy5EREcuYmFzZS5QYWdlXHJcbmNvbnN0IG1peGlucyA9IHJlcXVpcmUoJy4vbWl4aW5zL2luZGV4LmVzNi5qcycpXHJcbmNvbnN0IFByaXZhY3lPcHRpb25zVmlldyA9IHJlcXVpcmUoJy4vLi4vdmlld3MvcHJpdmFjeS1vcHRpb25zLmVzNi5qcycpXHJcbmNvbnN0IFByaXZhY3lPcHRpb25zTW9kZWwgPSByZXF1aXJlKCcuLy4uL21vZGVscy9wcml2YWN5LW9wdGlvbnMuZXM2LmpzJylcclxuY29uc3QgcHJpdmFjeU9wdGlvbnNUZW1wbGF0ZSA9IHJlcXVpcmUoJy4vLi4vdGVtcGxhdGVzL3ByaXZhY3ktb3B0aW9ucy5lczYuanMnKVxyXG5jb25zdCBXaGl0ZWxpc3RWaWV3ID0gcmVxdWlyZSgnLi8uLi92aWV3cy93aGl0ZWxpc3QuZXM2LmpzJylcclxuY29uc3QgV2hpdGVsaXN0TW9kZWwgPSByZXF1aXJlKCcuLy4uL21vZGVscy93aGl0ZWxpc3QuZXM2LmpzJylcclxuY29uc3Qgd2hpdGVsaXN0VGVtcGxhdGUgPSByZXF1aXJlKCcuLy4uL3RlbXBsYXRlcy93aGl0ZWxpc3QuZXM2LmpzJylcclxuY29uc3QgQmFja2dyb3VuZE1lc3NhZ2VNb2RlbCA9IHJlcXVpcmUoJy4vLi4vbW9kZWxzL2JhY2tncm91bmQtbWVzc2FnZS5lczYuanMnKVxyXG5jb25zdCBicm93c2VyVUlXcmFwcGVyID0gcmVxdWlyZSgnLi8uLi9iYXNlLyRCUk9XU0VSLXVpLXdyYXBwZXIuZXM2LmpzJylcclxuXHJcbmZ1bmN0aW9uIE9wdGlvbnMgKG9wcykge1xyXG4gICAgUGFyZW50LmNhbGwodGhpcywgb3BzKVxyXG59XHJcblxyXG5PcHRpb25zLnByb3RvdHlwZSA9IHdpbmRvdy4kLmV4dGVuZCh7fSxcclxuICAgIFBhcmVudC5wcm90b3R5cGUsXHJcbiAgICBtaXhpbnMuc2V0QnJvd3NlckNsYXNzT25Cb2R5VGFnLFxyXG4gICAge1xyXG5cclxuICAgICAgICBwYWdlTmFtZTogJ29wdGlvbnMnLFxyXG5cclxuICAgICAgICByZWFkeTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHBhcmVudCA9IHdpbmRvdy4kKCcjb3B0aW9ucy1jb250ZW50JylcclxuICAgICAgICAgICAgUGFyZW50LnByb3RvdHlwZS5yZWFkeS5jYWxsKHRoaXMpXHJcblxyXG4gICAgICAgICAgICB0aGlzLnNldEJyb3dzZXJDbGFzc09uQm9keVRhZygpXHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuJCgnLmpzLWZlZWRiYWNrLWxpbmsnKVxyXG4gICAgICAgICAgICAgICAgLmNsaWNrKHRoaXMuX29uRmVlZGJhY2tDbGljay5iaW5kKHRoaXMpKVxyXG4gICAgICAgICAgICB3aW5kb3cuJCgnLmpzLXJlcG9ydC1zaXRlLWxpbmsnKVxyXG4gICAgICAgICAgICAgICAgLmNsaWNrKHRoaXMuX29uUmVwb3J0U2l0ZUNsaWNrLmJpbmQodGhpcykpXHJcblxyXG4gICAgICAgICAgICB0aGlzLnZpZXdzLm9wdGlvbnMgPSBuZXcgUHJpdmFjeU9wdGlvbnNWaWV3KHtcclxuICAgICAgICAgICAgICAgIHBhZ2VWaWV3OiB0aGlzLFxyXG4gICAgICAgICAgICAgICAgbW9kZWw6IG5ldyBQcml2YWN5T3B0aW9uc01vZGVsKHt9KSxcclxuICAgICAgICAgICAgICAgIGFwcGVuZFRvOiAkcGFyZW50LFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IHByaXZhY3lPcHRpb25zVGVtcGxhdGVcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMudmlld3Mud2hpdGVsaXN0ID0gbmV3IFdoaXRlbGlzdFZpZXcoe1xyXG4gICAgICAgICAgICAgICAgcGFnZVZpZXc6IHRoaXMsXHJcbiAgICAgICAgICAgICAgICBtb2RlbDogbmV3IFdoaXRlbGlzdE1vZGVsKHt9KSxcclxuICAgICAgICAgICAgICAgIGFwcGVuZFRvOiAkcGFyZW50LFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IHdoaXRlbGlzdFRlbXBsYXRlXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSBuZXcgQmFja2dyb3VuZE1lc3NhZ2VNb2RlbCh7fSlcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfb25GZWVkYmFja0NsaWNrOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICAgICAgICAgIGJyb3dzZXJVSVdyYXBwZXIub3BlbkV4dGVuc2lvblBhZ2UoYC9odG1sL2ZlZWRiYWNrLmh0bWxgKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9vblJlcG9ydFNpdGVDbGljazogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgICAgICAgICBicm93c2VyVUlXcmFwcGVyLm9wZW5FeHRlbnNpb25QYWdlKGAvaHRtbC9mZWVkYmFjay5odG1sP2Jyb2tlbj0xYClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbilcclxuXHJcbi8vIGtpY2tvZmYhXHJcbndpbmRvdy5EREcgPSB3aW5kb3cuRERHIHx8IHt9XHJcbndpbmRvdy5EREcucGFnZSA9IG5ldyBPcHRpb25zKClcclxuIiwiY29uc3QgYmVsID0gcmVxdWlyZSgnYmVsJylcclxuY29uc3QgdG9nZ2xlQnV0dG9uID0gcmVxdWlyZSgnLi9zaGFyZWQvdG9nZ2xlLWJ1dHRvbi5lczYuanMnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gYmVsYDxzZWN0aW9uIGNsYXNzPVwib3B0aW9ucy1jb250ZW50X19wcml2YWN5IGRpdmlkZXItYm90dG9tXCI+XHJcbiAgICA8aDIgY2xhc3M9XCJtZW51LXRpdGxlXCI+T3B0aW9uczwvaDI+XHJcbiAgICA8dWwgY2xhc3M9XCJkZWZhdWx0LWxpc3RcIj5cclxuICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgIFNob3cgRW1iZWRkZWQgVHdlZXRzXHJcbiAgICAgICAgICAgICR7dG9nZ2xlQnV0dG9uKHRoaXMubW9kZWwuZW1iZWRkZWRUd2VldHNFbmFibGVkLFxyXG4gICAgICAgICdqcy1vcHRpb25zLWVtYmVkZGVkLXR3ZWV0cy1lbmFibGVkJyxcclxuICAgICAgICAnZW1iZWRkZWRUd2VldHNFbmFibGVkJyl9XHJcbiAgICAgICAgPC9saT5cclxuICAgIDwvdWw+XHJcbjwvc2VjdGlvbj5gXHJcblxyXG4vKipcclxuICogVE9ETzogcmV2aXNpdCB0aGVzZSBnbG9iYWwgb3B0aW9ucyBsYXRlcjpcclxuICAgIDxsaT5cclxuICBCbG9jayBUcmFja2Vyc1xyXG4gICR7dG9nZ2xlQnV0dG9uKHRoaXMubW9kZWwudHJhY2tlckJsb2NraW5nRW5hYmxlZCxcclxuICAgICAgICAgICAnanMtb3B0aW9ucy1ibG9ja3RyYWNrZXJzJyxcclxuICAgICAgICAgICAndHJhY2tlckJsb2NraW5nRW5hYmxlZCcpfVxyXG4gICAgPC9saT5cclxuICAgIDxsaT5cclxuICBGb3JjZSBTZWN1cmUgQ29ubmVjdGlvblxyXG4gICR7dG9nZ2xlQnV0dG9uKHRoaXMubW9kZWwuaHR0cHNFdmVyeXdoZXJlRW5hYmxlZCxcclxuICAgICAgICAgICAnanMtb3B0aW9ucy1odHRwcy1ldmVyeXdoZXJlLWVuYWJsZWQnLFxyXG4gICAgICAgICAgICdodHRwc0V2ZXJ5d2hlcmVFbmFibGVkJyl9XHJcbiAgICA8L2xpPlxyXG4gKlxyXG4gKi9cclxufVxyXG4iLCJjb25zdCBiZWwgPSByZXF1aXJlKCdiZWwnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXNBY3RpdmVCb29sZWFuLCBrbGFzcywgZGF0YUtleSkge1xyXG4gICAgLy8gbWFrZSBga2xhc3NgIGFuZCBgZGF0YUtleWAgb3B0aW9uYWw6XHJcbiAgICBrbGFzcyA9IGtsYXNzIHx8ICcnXHJcbiAgICBkYXRhS2V5ID0gZGF0YUtleSB8fCAnJ1xyXG5cclxuICAgIHJldHVybiBiZWxgXHJcbjxidXR0b24gY2xhc3M9XCJ0b2dnbGUtYnV0dG9uIHRvZ2dsZS1idXR0b24tLWlzLWFjdGl2ZS0ke2lzQWN0aXZlQm9vbGVhbn0gJHtrbGFzc31cIlxyXG4gICAgZGF0YS1rZXk9XCIke2RhdGFLZXl9XCJcclxuICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgYXJpYS1wcmVzc2VkPVwiJHtpc0FjdGl2ZUJvb2xlYW4gPyAndHJ1ZScgOiAnZmFsc2UnfVwiXHJcbiAgICA+XHJcbiAgICA8ZGl2IGNsYXNzPVwidG9nZ2xlLWJ1dHRvbl9fYmdcIj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInRvZ2dsZS1idXR0b25fX2tub2JcIj48L2Rpdj5cclxuPC9idXR0b24+YFxyXG59XHJcbiIsImNvbnN0IGJlbCA9IHJlcXVpcmUoJ2JlbCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0KSB7XHJcbiAgICBpZiAobGlzdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdmFyIGkgPSAwXHJcbiAgICAgICAgcmV0dXJuIGJlbGAke2xpc3QubWFwKChkb20pID0+IGJlbGBcclxuPGxpIGNsYXNzPVwianMtd2hpdGVsaXN0LWxpc3QtaXRlbVwiPlxyXG4gICAgPGEgY2xhc3M9XCJsaW5rLXNlY29uZGFyeVwiIGhyZWY9XCJodHRwczovLyR7ZG9tfVwiPiR7ZG9tfTwvYT5cclxuICAgIDxidXR0b24gY2xhc3M9XCJyZW1vdmUgcHVsbC1yaWdodCBqcy13aGl0ZWxpc3QtcmVtb3ZlXCIgZGF0YS1pdGVtPVwiJHtpKyt9XCI+w5c8L2J1dHRvbj5cclxuPC9saT5gKX1gXHJcbiAgICB9XHJcbiAgICByZXR1cm4gYmVsYDxsaT5ObyB3aGl0ZWxpc3RlZCBzaXRlcy48L2xpPmBcclxufVxyXG4iLCJjb25zdCBiZWwgPSByZXF1aXJlKCdiZWwnKVxyXG5jb25zdCB3aGl0ZWxpc3RJdGVtcyA9IHJlcXVpcmUoJy4vd2hpdGVsaXN0LWl0ZW1zLmVzNi5qcycpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBiZWxgPHNlY3Rpb24gY2xhc3M9XCJvcHRpb25zLWNvbnRlbnRfX3doaXRlbGlzdFwiPlxyXG4gICAgPGgyIGNsYXNzPVwibWVudS10aXRsZVwiPldoaXRlbGlzdGVkIFNpdGVzPC9oMj5cclxuICAgIDxwIGNsYXNzPVwibWVudS1wYXJhZ3JhcGhcIj5UaGVzZSBzaXRlcyB3aWxsIG5vdCBiZSBlbmhhbmNlZCBieSBQcml2YWN5IFByb3RlY3Rpb248L3A+XHJcbiAgICA8dWwgY2xhc3M9XCJkZWZhdWx0LWxpc3QganMtd2hpdGVsaXN0LWNvbnRhaW5lclwiPlxyXG4gICAgICAgICR7d2hpdGVsaXN0SXRlbXModGhpcy5tb2RlbC5saXN0KX1cclxuICAgIDwvdWw+XHJcbiAgICAke2FkZFRvV2hpdGVsaXN0KCl9XHJcbjwvc2VjdGlvbj5gXHJcblxyXG4gICAgZnVuY3Rpb24gYWRkVG9XaGl0ZWxpc3QgKCkge1xyXG4gICAgICAgIHJldHVybiBiZWxgPGRpdj5cclxuICAgIDxwIGNsYXNzPVwid2hpdGVsaXN0LXNob3ctYWRkIGpzLXdoaXRlbGlzdC1zaG93LWFkZFwiPlxyXG4gICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj5BZGQgc2l0ZSB0byB3aGl0ZWxpc3Q8L2E+XHJcbiAgICA8L3A+XHJcbiAgICA8aW5wdXQgY2xhc3M9XCJpcy1oaWRkZW4gd2hpdGVsaXN0LXVybCBmbG9hdC1sZWZ0IGpzLXdoaXRlbGlzdC11cmxcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgVVJMXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaXMtaGlkZGVuIHdoaXRlbGlzdC1hZGQgaXMtZGlzYWJsZWQgZmxvYXQtcmlnaHQganMtd2hpdGVsaXN0LWFkZFwiPkFkZCB0byBXaGl0ZWxpc3Q8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiaXMtaGlkZGVuIG1vZGFsLWJveCBqcy13aGl0ZWxpc3QtZXJyb3IgZmxvYXQtcmlnaHRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm94X19wb3BvdXRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJveF9fcG9wb3V0X19ib2R5XCI+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib3hfX2JvZHlcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29uIGljb25fX2Vycm9yXCI+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtb2RhbF9fYm9keV9fdGV4dFwiPlxyXG4gICAgICAgICAgICAgICAgSW52YWxpZCBVUkxcclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PmBcclxuICAgIH1cclxufVxyXG4iLCJjb25zdCBQYXJlbnQgPSB3aW5kb3cuRERHLmJhc2UuVmlld1xyXG5cclxuZnVuY3Rpb24gUHJpdmFjeU9wdGlvbnMgKG9wcykge1xyXG4gICAgdGhpcy5tb2RlbCA9IG9wcy5tb2RlbFxyXG4gICAgdGhpcy5wYWdlVmlldyA9IG9wcy5wYWdlVmlld1xyXG4gICAgdGhpcy50ZW1wbGF0ZSA9IG9wcy50ZW1wbGF0ZVxyXG5cclxuICAgIFBhcmVudC5jYWxsKHRoaXMsIG9wcylcclxuXHJcbiAgICB0aGlzLm1vZGVsLmdldFNldHRpbmdzKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZXJlbmRlcigpXHJcbiAgICB9KVxyXG59XHJcblxyXG5Qcml2YWN5T3B0aW9ucy5wcm90b3R5cGUgPSB3aW5kb3cuJC5leHRlbmQoe30sXHJcbiAgICBQYXJlbnQucHJvdG90eXBlLFxyXG4gICAge1xyXG5cclxuICAgICAgICBfY2xpY2tTZXR0aW5nOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gd2luZG93LiQoZS50YXJnZXQpLmRhdGEoJ2tleScpIHx8IHdpbmRvdy4kKGUudGFyZ2V0KS5wYXJlbnQoKS5kYXRhKCdrZXknKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgcHJpdmFjeU9wdGlvbnMgdmlldyBjbGljayBmb3Igc2V0dGluZyBcIiR7a2V5fVwiYClcclxuICAgICAgICAgICAgdGhpcy5tb2RlbC50b2dnbGUoa2V5KVxyXG4gICAgICAgICAgICB0aGlzLnJlcmVuZGVyKClcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXR1cDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYWNoZUVsZW1zKCcuanMtb3B0aW9ucycsIFsnYmxvY2t0cmFja2VycycsICdodHRwcy1ldmVyeXdoZXJlLWVuYWJsZWQnLCAnZW1iZWRkZWQtdHdlZXRzLWVuYWJsZWQnXSlcclxuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRzKFtcclxuICAgICAgICAgICAgICAgIFt0aGlzLiRibG9ja3RyYWNrZXJzLCAnY2xpY2snLCB0aGlzLl9jbGlja1NldHRpbmddLFxyXG4gICAgICAgICAgICAgICAgW3RoaXMuJGh0dHBzZXZlcnl3aGVyZWVuYWJsZWQsICdjbGljaycsIHRoaXMuX2NsaWNrU2V0dGluZ10sXHJcbiAgICAgICAgICAgICAgICBbdGhpcy4kZW1iZWRkZWR0d2VldHNlbmFibGVkLCAnY2xpY2snLCB0aGlzLl9jbGlja1NldHRpbmddXHJcbiAgICAgICAgICAgIF0pXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcmVyZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51bmJpbmRFdmVudHMoKVxyXG4gICAgICAgICAgICB0aGlzLl9yZXJlbmRlcigpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0dXAoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQcml2YWN5T3B0aW9uc1xyXG4iLCJjb25zdCBQYXJlbnQgPSB3aW5kb3cuRERHLmJhc2UuVmlld1xyXG5jb25zdCBpc0hpZGRlbkNsYXNzID0gJ2lzLWhpZGRlbidcclxuY29uc3QgaXNEaXNhYmxlZENsYXNzID0gJ2lzLWRpc2FibGVkJ1xyXG5jb25zdCBpc0ludmFsaWRJbnB1dENsYXNzID0gJ2lzLWludmFsaWQtaW5wdXQnXHJcbmNvbnN0IHdoaXRlbGlzdEl0ZW1zVGVtcGxhdGUgPSByZXF1aXJlKCcuLy4uL3RlbXBsYXRlcy93aGl0ZWxpc3QtaXRlbXMuZXM2LmpzJylcclxuXHJcbmZ1bmN0aW9uIFdoaXRlbGlzdCAob3BzKSB7XHJcbiAgICB0aGlzLm1vZGVsID0gb3BzLm1vZGVsXHJcbiAgICB0aGlzLnBhZ2VWaWV3ID0gb3BzLnBhZ2VWaWV3XHJcbiAgICB0aGlzLnRlbXBsYXRlID0gb3BzLnRlbXBsYXRlXHJcblxyXG4gICAgUGFyZW50LmNhbGwodGhpcywgb3BzKVxyXG5cclxuICAgIC8vIGJpbmQgZXZlbnRzXHJcbiAgICB0aGlzLnNldHVwKClcclxufVxyXG5cclxuV2hpdGVsaXN0LnByb3RvdHlwZSA9IHdpbmRvdy4kLmV4dGVuZCh7fSxcclxuICAgIFBhcmVudC5wcm90b3R5cGUsXHJcbiAgICB7XHJcblxyXG4gICAgICAgIF9yZW1vdmVJdGVtOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtSW5kZXggPSB3aW5kb3cuJChlLnRhcmdldCkuZGF0YSgnaXRlbScpXHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwucmVtb3ZlRG9tYWluKGl0ZW1JbmRleClcclxuXHJcbiAgICAgICAgICAgIC8vIE5vIG5lZWQgdG8gcmVyZW5kZXIgdGhlIHdob2xlIHZpZXdcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyTGlzdCgpXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX2FkZEl0ZW06IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy4kYWRkLmhhc0NsYXNzKGlzRGlzYWJsZWRDbGFzcykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IHRoaXMuJHVybC52YWwoKVxyXG4gICAgICAgICAgICAgICAgbGV0IGlzVmFsaWRJbnB1dCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICBpZiAodXJsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZElucHV0ID0gdGhpcy5tb2RlbC5hZGREb21haW4odXJsKVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc1ZhbGlkSW5wdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcmVuZGVyKClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hvd0Vycm9yTWVzc2FnZSgpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfc2hvd0Vycm9yTWVzc2FnZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLiRhZGQuYWRkQ2xhc3MoaXNIaWRkZW5DbGFzcylcclxuICAgICAgICAgICAgdGhpcy4kZXJyb3IucmVtb3ZlQ2xhc3MoaXNIaWRkZW5DbGFzcylcclxuICAgICAgICAgICAgdGhpcy4kdXJsLmFkZENsYXNzKGlzSW52YWxpZElucHV0Q2xhc3MpXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX2hpZGVFcnJvck1lc3NhZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy4kYWRkLnJlbW92ZUNsYXNzKGlzSGlkZGVuQ2xhc3MpXHJcbiAgICAgICAgICAgIHRoaXMuJGVycm9yLmFkZENsYXNzKGlzSGlkZGVuQ2xhc3MpXHJcbiAgICAgICAgICAgIHRoaXMuJHVybC5yZW1vdmVDbGFzcyhpc0ludmFsaWRJbnB1dENsYXNzKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9tYW5hZ2VJbnB1dENoYW5nZTogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgY29uc3QgaXNCdXR0b25EaXNhYmxlZCA9IHRoaXMuJGFkZC5oYXNDbGFzcyhpc0Rpc2FibGVkQ2xhc3MpXHJcblxyXG4gICAgICAgICAgICB0aGlzLl9oaWRlRXJyb3JNZXNzYWdlKClcclxuICAgICAgICAgICAgaWYgKHRoaXMuJHVybC52YWwoKSAmJiBpc0J1dHRvbkRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRhZGQucmVtb3ZlQ2xhc3MoaXNEaXNhYmxlZENsYXNzKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLiR1cmwudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGFkZC5hZGRDbGFzcyhpc0Rpc2FibGVkQ2xhc3MpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghaXNCdXR0b25EaXNhYmxlZCAmJiBlLmtleSA9PT0gJ0VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgLy8gYWxzbyBhZGQgdG8gd2hpdGVsaXN0IG9uIGVudGVyXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hZGRJdGVtKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9zaG93QWRkVG9XaGl0ZWxpc3RJbnB1dDogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdGhpcy4kdXJsLnJlbW92ZUNsYXNzKGlzSGlkZGVuQ2xhc3MpXHJcbiAgICAgICAgICAgIHRoaXMuJHVybC5mb2N1cygpXHJcbiAgICAgICAgICAgIHRoaXMuJGFkZC5yZW1vdmVDbGFzcyhpc0hpZGRlbkNsYXNzKVxyXG4gICAgICAgICAgICB0aGlzLiRzaG93YWRkLmFkZENsYXNzKGlzSGlkZGVuQ2xhc3MpXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldHVwOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlRWxlbXMoJy5qcy13aGl0ZWxpc3QnLCBbXHJcbiAgICAgICAgICAgICAgICAncmVtb3ZlJyxcclxuICAgICAgICAgICAgICAgICdhZGQnLFxyXG4gICAgICAgICAgICAgICAgJ2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICdzaG93LWFkZCcsXHJcbiAgICAgICAgICAgICAgICAnY29udGFpbmVyJyxcclxuICAgICAgICAgICAgICAgICdsaXN0LWl0ZW0nLFxyXG4gICAgICAgICAgICAgICAgJ3VybCdcclxuICAgICAgICAgICAgXSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50cyhbXHJcbiAgICAgICAgICAgICAgICBbdGhpcy4kcmVtb3ZlLCAnY2xpY2snLCB0aGlzLl9yZW1vdmVJdGVtXSxcclxuICAgICAgICAgICAgICAgIFt0aGlzLiRhZGQsICdjbGljaycsIHRoaXMuX2FkZEl0ZW1dLFxyXG4gICAgICAgICAgICAgICAgW3RoaXMuJHNob3dhZGQsICdjbGljaycsIHRoaXMuX3Nob3dBZGRUb1doaXRlbGlzdElucHV0XSxcclxuICAgICAgICAgICAgICAgIFt0aGlzLiR1cmwsICdrZXl1cCcsIHRoaXMuX21hbmFnZUlucHV0Q2hhbmdlXSxcclxuICAgICAgICAgICAgICAgIC8vIGxpc3RlbiB0byBjaGFuZ2VzIHRvIHRoZSB3aGl0ZWxpc3QgbW9kZWxcclxuICAgICAgICAgICAgICAgIFt0aGlzLnN0b3JlLnN1YnNjcmliZSwgJ2NoYW5nZTp3aGl0ZWxpc3QnLCB0aGlzLnJlcmVuZGVyXVxyXG4gICAgICAgICAgICBdKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHJlcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudW5iaW5kRXZlbnRzKClcclxuICAgICAgICAgICAgdGhpcy5fcmVyZW5kZXIoKVxyXG4gICAgICAgICAgICB0aGlzLnNldHVwKClcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfcmVuZGVyTGlzdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVuYmluZEV2ZW50cygpXHJcbiAgICAgICAgICAgIHRoaXMuJGNvbnRhaW5lci5odG1sKHdoaXRlbGlzdEl0ZW1zVGVtcGxhdGUodGhpcy5tb2RlbC5saXN0KSlcclxuICAgICAgICAgICAgdGhpcy5zZXR1cCgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4pXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdoaXRlbGlzdFxyXG4iXX0=
