(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.buffer-equal-constant-time"],{

/***/ "tc1l":
/*!**********************************************************!*\
  !*** ./node_modules/buffer-equal-constant-time/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*jshint node:true */

var Buffer = __webpack_require__(/*! buffer */ "tjlA").Buffer; // browserify
var SlowBuffer = __webpack_require__(/*! buffer */ "tjlA").SlowBuffer;

module.exports = bufferEq;

function bufferEq(a, b) {

  // shortcutting on type is necessary for correctness
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    return false;
  }

  // buffer sizes should be well-known information, so despite this
  // shortcutting, it doesn't leak any information about the *contents* of the
  // buffers.
  if (a.length !== b.length) {
    return false;
  }

  var c = 0;
  for (var i = 0; i < a.length; i++) {
    /*jshint bitwise:false */
    c |= a[i] ^ b[i]; // XOR
  }
  return c === 0;
}

bufferEq.install = function() {
  Buffer.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
    return bufferEq(this, that);
  };
};

var origBufEqual = Buffer.prototype.equal;
var origSlowBufEqual = SlowBuffer.prototype.equal;
bufferEq.restore = function() {
  Buffer.prototype.equal = origBufEqual;
  SlowBuffer.prototype.equal = origSlowBufEqual;
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVxdWFsLWNvbnN0YW50LXRpbWUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ2E7QUFDYixhQUFhLG1CQUFPLENBQUMsb0JBQVEsU0FBUztBQUN0QyxpQkFBaUIsbUJBQU8sQ0FBQyxvQkFBUTs7QUFFakM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLGNBQWM7QUFDL0I7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuYnVmZmVyLWVxdWFsLWNvbnN0YW50LXRpbWUuZDhjZjNhZDAzYWE5ZTdiNzFhY2EuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKmpzaGludCBub2RlOnRydWUgKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyOyAvLyBicm93c2VyaWZ5XHJcbnZhciBTbG93QnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuU2xvd0J1ZmZlcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYnVmZmVyRXE7XHJcblxyXG5mdW5jdGlvbiBidWZmZXJFcShhLCBiKSB7XHJcblxyXG4gIC8vIHNob3J0Y3V0dGluZyBvbiB0eXBlIGlzIG5lY2Vzc2FyeSBmb3IgY29ycmVjdG5lc3NcclxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvLyBidWZmZXIgc2l6ZXMgc2hvdWxkIGJlIHdlbGwta25vd24gaW5mb3JtYXRpb24sIHNvIGRlc3BpdGUgdGhpc1xyXG4gIC8vIHNob3J0Y3V0dGluZywgaXQgZG9lc24ndCBsZWFrIGFueSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgKmNvbnRlbnRzKiBvZiB0aGVcclxuICAvLyBidWZmZXJzLlxyXG4gIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHZhciBjID0gMDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgIC8qanNoaW50IGJpdHdpc2U6ZmFsc2UgKi9cclxuICAgIGMgfD0gYVtpXSBeIGJbaV07IC8vIFhPUlxyXG4gIH1cclxuICByZXR1cm4gYyA9PT0gMDtcclxufVxyXG5cclxuYnVmZmVyRXEuaW5zdGFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gIEJ1ZmZlci5wcm90b3R5cGUuZXF1YWwgPSBTbG93QnVmZmVyLnByb3RvdHlwZS5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKHRoYXQpIHtcclxuICAgIHJldHVybiBidWZmZXJFcSh0aGlzLCB0aGF0KTtcclxuICB9O1xyXG59O1xyXG5cclxudmFyIG9yaWdCdWZFcXVhbCA9IEJ1ZmZlci5wcm90b3R5cGUuZXF1YWw7XHJcbnZhciBvcmlnU2xvd0J1ZkVxdWFsID0gU2xvd0J1ZmZlci5wcm90b3R5cGUuZXF1YWw7XHJcbmJ1ZmZlckVxLnJlc3RvcmUgPSBmdW5jdGlvbigpIHtcclxuICBCdWZmZXIucHJvdG90eXBlLmVxdWFsID0gb3JpZ0J1ZkVxdWFsO1xyXG4gIFNsb3dCdWZmZXIucHJvdG90eXBlLmVxdWFsID0gb3JpZ1Nsb3dCdWZFcXVhbDtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==