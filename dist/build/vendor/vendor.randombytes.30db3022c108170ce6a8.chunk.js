(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.randombytes"],{

/***/ "Edxu":
/*!*********************************************!*\
  !*** ./node_modules/randombytes/browser.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

function oldBrowser () {
  throw new Error('Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11')
}

var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
var crypto = global.crypto || global.msCrypto

if (crypto && crypto.getRandomValues) {
  module.exports = randomBytes
} else {
  module.exports = oldBrowser
}

function randomBytes (size, cb) {
  // phantomjs needs to throw
  if (size > 65536) throw new Error('requested too many random bytes')
  // in case browserify  isn't using the Uint8Array version
  var rawBytes = new global.Uint8Array(size)

  // This will not work in older browsers.
  // See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
  if (size > 0) {  // getRandomValues fails on IE if size == 0
    crypto.getRandomValues(rawBytes)
  }

  // XXX: phantomjs doesn't like a buffer being passed here
  var bytes = Buffer.from(rawBytes.buffer)

  if (typeof cb === 'function') {
    return process.nextTick(function () {
      cb(null, bytes)
    })
  }

  return bytes
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "yLpj"), __webpack_require__(/*! ./../process/browser.js */ "8oxB")))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmFuZG9tYnl0ZXMvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsdURBQVk7O0FBRVo7QUFDQTtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQzs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLnJhbmRvbWJ5dGVzLjMwZGIzMDIyYzEwODE3MGNlNmE4LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmZ1bmN0aW9uIG9sZEJyb3dzZXIgKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ1NlY3VyZSByYW5kb20gbnVtYmVyIGdlbmVyYXRpb24gaXMgbm90IHN1cHBvcnRlZCBieSB0aGlzIGJyb3dzZXIuXFxuVXNlIENocm9tZSwgRmlyZWZveCBvciBJbnRlcm5ldCBFeHBsb3JlciAxMScpXG59XG5cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxudmFyIGNyeXB0byA9IGdsb2JhbC5jcnlwdG8gfHwgZ2xvYmFsLm1zQ3J5cHRvXG5cbmlmIChjcnlwdG8gJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJhbmRvbUJ5dGVzXG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IG9sZEJyb3dzZXJcbn1cblxuZnVuY3Rpb24gcmFuZG9tQnl0ZXMgKHNpemUsIGNiKSB7XG4gIC8vIHBoYW50b21qcyBuZWVkcyB0byB0aHJvd1xuICBpZiAoc2l6ZSA+IDY1NTM2KSB0aHJvdyBuZXcgRXJyb3IoJ3JlcXVlc3RlZCB0b28gbWFueSByYW5kb20gYnl0ZXMnKVxuICAvLyBpbiBjYXNlIGJyb3dzZXJpZnkgIGlzbid0IHVzaW5nIHRoZSBVaW50OEFycmF5IHZlcnNpb25cbiAgdmFyIHJhd0J5dGVzID0gbmV3IGdsb2JhbC5VaW50OEFycmF5KHNpemUpXG5cbiAgLy8gVGhpcyB3aWxsIG5vdCB3b3JrIGluIG9sZGVyIGJyb3dzZXJzLlxuICAvLyBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzXG4gIGlmIChzaXplID4gMCkgeyAgLy8gZ2V0UmFuZG9tVmFsdWVzIGZhaWxzIG9uIElFIGlmIHNpemUgPT0gMFxuICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMocmF3Qnl0ZXMpXG4gIH1cblxuICAvLyBYWFg6IHBoYW50b21qcyBkb2Vzbid0IGxpa2UgYSBidWZmZXIgYmVpbmcgcGFzc2VkIGhlcmVcbiAgdmFyIGJ5dGVzID0gQnVmZmVyLmZyb20ocmF3Qnl0ZXMuYnVmZmVyKVxuXG4gIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBjYihudWxsLCBieXRlcylcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG4iXSwic291cmNlUm9vdCI6IiJ9