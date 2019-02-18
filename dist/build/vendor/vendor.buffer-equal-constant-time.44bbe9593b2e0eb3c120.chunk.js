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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnVmZmVyLWVxdWFsLWNvbnN0YW50LXRpbWUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ2E7QUFDYixhQUFhLG1CQUFPLENBQUMsb0JBQVEsU0FBUztBQUN0QyxpQkFBaUIsbUJBQU8sQ0FBQyxvQkFBUTs7QUFFakM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLGNBQWM7QUFDL0I7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuYnVmZmVyLWVxdWFsLWNvbnN0YW50LXRpbWUuNDRiYmU5NTkzYjJlMGViM2MxMjAuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKmpzaGludCBub2RlOnRydWUgKi9cbid1c2Ugc3RyaWN0JztcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7IC8vIGJyb3dzZXJpZnlcbnZhciBTbG93QnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuU2xvd0J1ZmZlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBidWZmZXJFcTtcblxuZnVuY3Rpb24gYnVmZmVyRXEoYSwgYikge1xuXG4gIC8vIHNob3J0Y3V0dGluZyBvbiB0eXBlIGlzIG5lY2Vzc2FyeSBmb3IgY29ycmVjdG5lc3NcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYSkgfHwgIUJ1ZmZlci5pc0J1ZmZlcihiKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIGJ1ZmZlciBzaXplcyBzaG91bGQgYmUgd2VsbC1rbm93biBpbmZvcm1hdGlvbiwgc28gZGVzcGl0ZSB0aGlzXG4gIC8vIHNob3J0Y3V0dGluZywgaXQgZG9lc24ndCBsZWFrIGFueSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgKmNvbnRlbnRzKiBvZiB0aGVcbiAgLy8gYnVmZmVycy5cbiAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBjID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgLypqc2hpbnQgYml0d2lzZTpmYWxzZSAqL1xuICAgIGMgfD0gYVtpXSBeIGJbaV07IC8vIFhPUlxuICB9XG4gIHJldHVybiBjID09PSAwO1xufVxuXG5idWZmZXJFcS5pbnN0YWxsID0gZnVuY3Rpb24oKSB7XG4gIEJ1ZmZlci5wcm90b3R5cGUuZXF1YWwgPSBTbG93QnVmZmVyLnByb3RvdHlwZS5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKHRoYXQpIHtcbiAgICByZXR1cm4gYnVmZmVyRXEodGhpcywgdGhhdCk7XG4gIH07XG59O1xuXG52YXIgb3JpZ0J1ZkVxdWFsID0gQnVmZmVyLnByb3RvdHlwZS5lcXVhbDtcbnZhciBvcmlnU2xvd0J1ZkVxdWFsID0gU2xvd0J1ZmZlci5wcm90b3R5cGUuZXF1YWw7XG5idWZmZXJFcS5yZXN0b3JlID0gZnVuY3Rpb24oKSB7XG4gIEJ1ZmZlci5wcm90b3R5cGUuZXF1YWwgPSBvcmlnQnVmRXF1YWw7XG4gIFNsb3dCdWZmZXIucHJvdG90eXBlLmVxdWFsID0gb3JpZ1Nsb3dCdWZFcXVhbDtcbn07XG4iXSwic291cmNlUm9vdCI6IiJ9