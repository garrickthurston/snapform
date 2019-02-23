(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.randomfill"],{

/***/ "dcwN":
/*!********************************************!*\
  !*** ./node_modules/randomfill/browser.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

function oldBrowser () {
  throw new Error('secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11')
}
var safeBuffer = __webpack_require__(/*! safe-buffer */ "hwdV")
var randombytes = __webpack_require__(/*! randombytes */ "Edxu")
var Buffer = safeBuffer.Buffer
var kBufferMaxLength = safeBuffer.kMaxLength
var crypto = global.crypto || global.msCrypto
var kMaxUint32 = Math.pow(2, 32) - 1
function assertOffset (offset, length) {
  if (typeof offset !== 'number' || offset !== offset) { // eslint-disable-line no-self-compare
    throw new TypeError('offset must be a number')
  }

  if (offset > kMaxUint32 || offset < 0) {
    throw new TypeError('offset must be a uint32')
  }

  if (offset > kBufferMaxLength || offset > length) {
    throw new RangeError('offset out of range')
  }
}

function assertSize (size, offset, length) {
  if (typeof size !== 'number' || size !== size) { // eslint-disable-line no-self-compare
    throw new TypeError('size must be a number')
  }

  if (size > kMaxUint32 || size < 0) {
    throw new TypeError('size must be a uint32')
  }

  if (size + offset > length || size > kBufferMaxLength) {
    throw new RangeError('buffer too small')
  }
}
if ((crypto && crypto.getRandomValues) || !process.browser) {
  exports.randomFill = randomFill
  exports.randomFillSync = randomFillSync
} else {
  exports.randomFill = oldBrowser
  exports.randomFillSync = oldBrowser
}
function randomFill (buf, offset, size, cb) {
  if (!Buffer.isBuffer(buf) && !(buf instanceof global.Uint8Array)) {
    throw new TypeError('"buf" argument must be a Buffer or Uint8Array')
  }

  if (typeof offset === 'function') {
    cb = offset
    offset = 0
    size = buf.length
  } else if (typeof size === 'function') {
    cb = size
    size = buf.length - offset
  } else if (typeof cb !== 'function') {
    throw new TypeError('"cb" argument must be a function')
  }
  assertOffset(offset, buf.length)
  assertSize(size, offset, buf.length)
  return actualFill(buf, offset, size, cb)
}

function actualFill (buf, offset, size, cb) {
  if (process.browser) {
    var ourBuf = buf.buffer
    var uint = new Uint8Array(ourBuf, offset, size)
    crypto.getRandomValues(uint)
    if (cb) {
      process.nextTick(function () {
        cb(null, buf)
      })
      return
    }
    return buf
  }
  if (cb) {
    randombytes(size, function (err, bytes) {
      if (err) {
        return cb(err)
      }
      bytes.copy(buf, offset)
      cb(null, buf)
    })
    return
  }
  var bytes = randombytes(size)
  bytes.copy(buf, offset)
  return buf
}
function randomFillSync (buf, offset, size) {
  if (typeof offset === 'undefined') {
    offset = 0
  }
  if (!Buffer.isBuffer(buf) && !(buf instanceof global.Uint8Array)) {
    throw new TypeError('"buf" argument must be a Buffer or Uint8Array')
  }

  assertOffset(offset, buf.length)

  if (size === undefined) size = buf.length - offset

  assertSize(size, offset, buf.length)

  return actualFill(buf, offset, size)
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "yLpj"), __webpack_require__(/*! ./../process/browser.js */ "8oxB")))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmFuZG9tZmlsbC9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx1REFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsbUJBQU8sQ0FBQyx5QkFBYTtBQUN0QyxrQkFBa0IsbUJBQU8sQ0FBQyx5QkFBYTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdEO0FBQ3hEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IucmFuZG9tZmlsbC5hNTdkZWE0ZWJhYmM0MmJlMDU0Yi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xyXG5cclxuZnVuY3Rpb24gb2xkQnJvd3NlciAoKSB7XHJcbiAgdGhyb3cgbmV3IEVycm9yKCdzZWN1cmUgcmFuZG9tIG51bWJlciBnZW5lcmF0aW9uIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBicm93c2VyXFxudXNlIGNocm9tZSwgRmlyZUZveCBvciBJbnRlcm5ldCBFeHBsb3JlciAxMScpXHJcbn1cclxudmFyIHNhZmVCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpXHJcbnZhciByYW5kb21ieXRlcyA9IHJlcXVpcmUoJ3JhbmRvbWJ5dGVzJylcclxudmFyIEJ1ZmZlciA9IHNhZmVCdWZmZXIuQnVmZmVyXHJcbnZhciBrQnVmZmVyTWF4TGVuZ3RoID0gc2FmZUJ1ZmZlci5rTWF4TGVuZ3RoXHJcbnZhciBjcnlwdG8gPSBnbG9iYWwuY3J5cHRvIHx8IGdsb2JhbC5tc0NyeXB0b1xyXG52YXIga01heFVpbnQzMiA9IE1hdGgucG93KDIsIDMyKSAtIDFcclxuZnVuY3Rpb24gYXNzZXJ0T2Zmc2V0IChvZmZzZXQsIGxlbmd0aCkge1xyXG4gIGlmICh0eXBlb2Ygb2Zmc2V0ICE9PSAnbnVtYmVyJyB8fCBvZmZzZXQgIT09IG9mZnNldCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb2Zmc2V0IG11c3QgYmUgYSBudW1iZXInKVxyXG4gIH1cclxuXHJcbiAgaWYgKG9mZnNldCA+IGtNYXhVaW50MzIgfHwgb2Zmc2V0IDwgMCkge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb2Zmc2V0IG11c3QgYmUgYSB1aW50MzInKVxyXG4gIH1cclxuXHJcbiAgaWYgKG9mZnNldCA+IGtCdWZmZXJNYXhMZW5ndGggfHwgb2Zmc2V0ID4gbGVuZ3RoKSB7XHJcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IG91dCBvZiByYW5nZScpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplLCBvZmZzZXQsIGxlbmd0aCkge1xyXG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicgfHwgc2l6ZSAhPT0gc2l6ZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc2l6ZSBtdXN0IGJlIGEgbnVtYmVyJylcclxuICB9XHJcblxyXG4gIGlmIChzaXplID4ga01heFVpbnQzMiB8fCBzaXplIDwgMCkge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc2l6ZSBtdXN0IGJlIGEgdWludDMyJylcclxuICB9XHJcblxyXG4gIGlmIChzaXplICsgb2Zmc2V0ID4gbGVuZ3RoIHx8IHNpemUgPiBrQnVmZmVyTWF4TGVuZ3RoKSB7XHJcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignYnVmZmVyIHRvbyBzbWFsbCcpXHJcbiAgfVxyXG59XHJcbmlmICgoY3J5cHRvICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHx8ICFwcm9jZXNzLmJyb3dzZXIpIHtcclxuICBleHBvcnRzLnJhbmRvbUZpbGwgPSByYW5kb21GaWxsXHJcbiAgZXhwb3J0cy5yYW5kb21GaWxsU3luYyA9IHJhbmRvbUZpbGxTeW5jXHJcbn0gZWxzZSB7XHJcbiAgZXhwb3J0cy5yYW5kb21GaWxsID0gb2xkQnJvd3NlclxyXG4gIGV4cG9ydHMucmFuZG9tRmlsbFN5bmMgPSBvbGRCcm93c2VyXHJcbn1cclxuZnVuY3Rpb24gcmFuZG9tRmlsbCAoYnVmLCBvZmZzZXQsIHNpemUsIGNiKSB7XHJcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSAmJiAhKGJ1ZiBpbnN0YW5jZW9mIGdsb2JhbC5VaW50OEFycmF5KSkge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIG9yIFVpbnQ4QXJyYXknKVxyXG4gIH1cclxuXHJcbiAgaWYgKHR5cGVvZiBvZmZzZXQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGNiID0gb2Zmc2V0XHJcbiAgICBvZmZzZXQgPSAwXHJcbiAgICBzaXplID0gYnVmLmxlbmd0aFxyXG4gIH0gZWxzZSBpZiAodHlwZW9mIHNpemUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGNiID0gc2l6ZVxyXG4gICAgc2l6ZSA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcclxuICB9IGVsc2UgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJjYlwiIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpXHJcbiAgfVxyXG4gIGFzc2VydE9mZnNldChvZmZzZXQsIGJ1Zi5sZW5ndGgpXHJcbiAgYXNzZXJ0U2l6ZShzaXplLCBvZmZzZXQsIGJ1Zi5sZW5ndGgpXHJcbiAgcmV0dXJuIGFjdHVhbEZpbGwoYnVmLCBvZmZzZXQsIHNpemUsIGNiKVxyXG59XHJcblxyXG5mdW5jdGlvbiBhY3R1YWxGaWxsIChidWYsIG9mZnNldCwgc2l6ZSwgY2IpIHtcclxuICBpZiAocHJvY2Vzcy5icm93c2VyKSB7XHJcbiAgICB2YXIgb3VyQnVmID0gYnVmLmJ1ZmZlclxyXG4gICAgdmFyIHVpbnQgPSBuZXcgVWludDhBcnJheShvdXJCdWYsIG9mZnNldCwgc2l6ZSlcclxuICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXModWludClcclxuICAgIGlmIChjYikge1xyXG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjYihudWxsLCBidWYpXHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ1ZlxyXG4gIH1cclxuICBpZiAoY2IpIHtcclxuICAgIHJhbmRvbWJ5dGVzKHNpemUsIGZ1bmN0aW9uIChlcnIsIGJ5dGVzKSB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICByZXR1cm4gY2IoZXJyKVxyXG4gICAgICB9XHJcbiAgICAgIGJ5dGVzLmNvcHkoYnVmLCBvZmZzZXQpXHJcbiAgICAgIGNiKG51bGwsIGJ1ZilcclxuICAgIH0pXHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgdmFyIGJ5dGVzID0gcmFuZG9tYnl0ZXMoc2l6ZSlcclxuICBieXRlcy5jb3B5KGJ1Ziwgb2Zmc2V0KVxyXG4gIHJldHVybiBidWZcclxufVxyXG5mdW5jdGlvbiByYW5kb21GaWxsU3luYyAoYnVmLCBvZmZzZXQsIHNpemUpIHtcclxuICBpZiAodHlwZW9mIG9mZnNldCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIG9mZnNldCA9IDBcclxuICB9XHJcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSAmJiAhKGJ1ZiBpbnN0YW5jZW9mIGdsb2JhbC5VaW50OEFycmF5KSkge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIG9yIFVpbnQ4QXJyYXknKVxyXG4gIH1cclxuXHJcbiAgYXNzZXJ0T2Zmc2V0KG9mZnNldCwgYnVmLmxlbmd0aClcclxuXHJcbiAgaWYgKHNpemUgPT09IHVuZGVmaW5lZCkgc2l6ZSA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcclxuXHJcbiAgYXNzZXJ0U2l6ZShzaXplLCBvZmZzZXQsIGJ1Zi5sZW5ndGgpXHJcblxyXG4gIHJldHVybiBhY3R1YWxGaWxsKGJ1Ziwgb2Zmc2V0LCBzaXplKVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=