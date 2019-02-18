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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmFuZG9tZmlsbC9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx1REFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsbUJBQU8sQ0FBQyx5QkFBYTtBQUN0QyxrQkFBa0IsbUJBQU8sQ0FBQyx5QkFBYTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdEO0FBQ3hEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IucmFuZG9tZmlsbC5jYWQ3ZDczMzM5M2UyMTIxMjBkYi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5mdW5jdGlvbiBvbGRCcm93c2VyICgpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdzZWN1cmUgcmFuZG9tIG51bWJlciBnZW5lcmF0aW9uIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBicm93c2VyXFxudXNlIGNocm9tZSwgRmlyZUZveCBvciBJbnRlcm5ldCBFeHBsb3JlciAxMScpXG59XG52YXIgc2FmZUJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJylcbnZhciByYW5kb21ieXRlcyA9IHJlcXVpcmUoJ3JhbmRvbWJ5dGVzJylcbnZhciBCdWZmZXIgPSBzYWZlQnVmZmVyLkJ1ZmZlclxudmFyIGtCdWZmZXJNYXhMZW5ndGggPSBzYWZlQnVmZmVyLmtNYXhMZW5ndGhcbnZhciBjcnlwdG8gPSBnbG9iYWwuY3J5cHRvIHx8IGdsb2JhbC5tc0NyeXB0b1xudmFyIGtNYXhVaW50MzIgPSBNYXRoLnBvdygyLCAzMikgLSAxXG5mdW5jdGlvbiBhc3NlcnRPZmZzZXQgKG9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICh0eXBlb2Ygb2Zmc2V0ICE9PSAnbnVtYmVyJyB8fCBvZmZzZXQgIT09IG9mZnNldCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29mZnNldCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPiBrTWF4VWludDMyIHx8IG9mZnNldCA8IDApIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvZmZzZXQgbXVzdCBiZSBhIHVpbnQzMicpXG4gIH1cblxuICBpZiAob2Zmc2V0ID4ga0J1ZmZlck1heExlbmd0aCB8fCBvZmZzZXQgPiBsZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IG91dCBvZiByYW5nZScpXG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzZXJ0U2l6ZSAoc2l6ZSwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJyB8fCBzaXplICE9PSBzaXplKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc2l6ZSBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfVxuXG4gIGlmIChzaXplID4ga01heFVpbnQzMiB8fCBzaXplIDwgMCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3NpemUgbXVzdCBiZSBhIHVpbnQzMicpXG4gIH1cblxuICBpZiAoc2l6ZSArIG9mZnNldCA+IGxlbmd0aCB8fCBzaXplID4ga0J1ZmZlck1heExlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdidWZmZXIgdG9vIHNtYWxsJylcbiAgfVxufVxuaWYgKChjcnlwdG8gJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgfHwgIXByb2Nlc3MuYnJvd3Nlcikge1xuICBleHBvcnRzLnJhbmRvbUZpbGwgPSByYW5kb21GaWxsXG4gIGV4cG9ydHMucmFuZG9tRmlsbFN5bmMgPSByYW5kb21GaWxsU3luY1xufSBlbHNlIHtcbiAgZXhwb3J0cy5yYW5kb21GaWxsID0gb2xkQnJvd3NlclxuICBleHBvcnRzLnJhbmRvbUZpbGxTeW5jID0gb2xkQnJvd3NlclxufVxuZnVuY3Rpb24gcmFuZG9tRmlsbCAoYnVmLCBvZmZzZXQsIHNpemUsIGNiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikgJiYgIShidWYgaW5zdGFuY2VvZiBnbG9iYWwuVWludDhBcnJheSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJ1ZlwiIGFyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXIgb3IgVWludDhBcnJheScpXG4gIH1cblxuICBpZiAodHlwZW9mIG9mZnNldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNiID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gMFxuICAgIHNpemUgPSBidWYubGVuZ3RoXG4gIH0gZWxzZSBpZiAodHlwZW9mIHNpemUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYiA9IHNpemVcbiAgICBzaXplID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICB9IGVsc2UgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiY2JcIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICB9XG4gIGFzc2VydE9mZnNldChvZmZzZXQsIGJ1Zi5sZW5ndGgpXG4gIGFzc2VydFNpemUoc2l6ZSwgb2Zmc2V0LCBidWYubGVuZ3RoKVxuICByZXR1cm4gYWN0dWFsRmlsbChidWYsIG9mZnNldCwgc2l6ZSwgY2IpXG59XG5cbmZ1bmN0aW9uIGFjdHVhbEZpbGwgKGJ1Ziwgb2Zmc2V0LCBzaXplLCBjYikge1xuICBpZiAocHJvY2Vzcy5icm93c2VyKSB7XG4gICAgdmFyIG91ckJ1ZiA9IGJ1Zi5idWZmZXJcbiAgICB2YXIgdWludCA9IG5ldyBVaW50OEFycmF5KG91ckJ1Ziwgb2Zmc2V0LCBzaXplKVxuICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXModWludClcbiAgICBpZiAoY2IpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBjYihudWxsLCBidWYpXG4gICAgICB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHJldHVybiBidWZcbiAgfVxuICBpZiAoY2IpIHtcbiAgICByYW5kb21ieXRlcyhzaXplLCBmdW5jdGlvbiAoZXJyLCBieXRlcykge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyKVxuICAgICAgfVxuICAgICAgYnl0ZXMuY29weShidWYsIG9mZnNldClcbiAgICAgIGNiKG51bGwsIGJ1ZilcbiAgICB9KVxuICAgIHJldHVyblxuICB9XG4gIHZhciBieXRlcyA9IHJhbmRvbWJ5dGVzKHNpemUpXG4gIGJ5dGVzLmNvcHkoYnVmLCBvZmZzZXQpXG4gIHJldHVybiBidWZcbn1cbmZ1bmN0aW9uIHJhbmRvbUZpbGxTeW5jIChidWYsIG9mZnNldCwgc2l6ZSkge1xuICBpZiAodHlwZW9mIG9mZnNldCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvZmZzZXQgPSAwXG4gIH1cbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSAmJiAhKGJ1ZiBpbnN0YW5jZW9mIGdsb2JhbC5VaW50OEFycmF5KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBvciBVaW50OEFycmF5JylcbiAgfVxuXG4gIGFzc2VydE9mZnNldChvZmZzZXQsIGJ1Zi5sZW5ndGgpXG5cbiAgaWYgKHNpemUgPT09IHVuZGVmaW5lZCkgc2l6ZSA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcblxuICBhc3NlcnRTaXplKHNpemUsIG9mZnNldCwgYnVmLmxlbmd0aClcblxuICByZXR1cm4gYWN0dWFsRmlsbChidWYsIG9mZnNldCwgc2l6ZSlcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=