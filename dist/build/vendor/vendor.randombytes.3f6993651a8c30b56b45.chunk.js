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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmFuZG9tYnl0ZXMvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsdURBQVk7O0FBRVo7QUFDQTtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQzs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLnJhbmRvbWJ5dGVzLjNmNjk5MzY1MWE4YzMwYjU2YjQ1LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXHJcblxyXG5mdW5jdGlvbiBvbGRCcm93c2VyICgpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoJ1NlY3VyZSByYW5kb20gbnVtYmVyIGdlbmVyYXRpb24gaXMgbm90IHN1cHBvcnRlZCBieSB0aGlzIGJyb3dzZXIuXFxuVXNlIENocm9tZSwgRmlyZWZveCBvciBJbnRlcm5ldCBFeHBsb3JlciAxMScpXHJcbn1cclxuXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG52YXIgY3J5cHRvID0gZ2xvYmFsLmNyeXB0byB8fCBnbG9iYWwubXNDcnlwdG9cclxuXHJcbmlmIChjcnlwdG8gJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xyXG4gIG1vZHVsZS5leHBvcnRzID0gcmFuZG9tQnl0ZXNcclxufSBlbHNlIHtcclxuICBtb2R1bGUuZXhwb3J0cyA9IG9sZEJyb3dzZXJcclxufVxyXG5cclxuZnVuY3Rpb24gcmFuZG9tQnl0ZXMgKHNpemUsIGNiKSB7XHJcbiAgLy8gcGhhbnRvbWpzIG5lZWRzIHRvIHRocm93XHJcbiAgaWYgKHNpemUgPiA2NTUzNikgdGhyb3cgbmV3IEVycm9yKCdyZXF1ZXN0ZWQgdG9vIG1hbnkgcmFuZG9tIGJ5dGVzJylcclxuICAvLyBpbiBjYXNlIGJyb3dzZXJpZnkgIGlzbid0IHVzaW5nIHRoZSBVaW50OEFycmF5IHZlcnNpb25cclxuICB2YXIgcmF3Qnl0ZXMgPSBuZXcgZ2xvYmFsLlVpbnQ4QXJyYXkoc2l6ZSlcclxuXHJcbiAgLy8gVGhpcyB3aWxsIG5vdCB3b3JrIGluIG9sZGVyIGJyb3dzZXJzLlxyXG4gIC8vIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXNcclxuICBpZiAoc2l6ZSA+IDApIHsgIC8vIGdldFJhbmRvbVZhbHVlcyBmYWlscyBvbiBJRSBpZiBzaXplID09IDBcclxuICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMocmF3Qnl0ZXMpXHJcbiAgfVxyXG5cclxuICAvLyBYWFg6IHBoYW50b21qcyBkb2Vzbid0IGxpa2UgYSBidWZmZXIgYmVpbmcgcGFzc2VkIGhlcmVcclxuICB2YXIgYnl0ZXMgPSBCdWZmZXIuZnJvbShyYXdCeXRlcy5idWZmZXIpXHJcblxyXG4gIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIHJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgY2IobnVsbCwgYnl0ZXMpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGJ5dGVzXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==