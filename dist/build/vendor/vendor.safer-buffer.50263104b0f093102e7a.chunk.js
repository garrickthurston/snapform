(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.safer-buffer"],{

/***/ "xZGU":
/*!********************************************!*\
  !*** ./node_modules/safer-buffer/safer.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* eslint-disable node/no-deprecated-api */



var buffer = __webpack_require__(/*! buffer */ "tjlA")
var Buffer = buffer.Buffer

var safer = {}

var key

for (key in buffer) {
  if (!buffer.hasOwnProperty(key)) continue
  if (key === 'SlowBuffer' || key === 'Buffer') continue
  safer[key] = buffer[key]
}

var Safer = safer.Buffer = {}
for (key in Buffer) {
  if (!Buffer.hasOwnProperty(key)) continue
  if (key === 'allocUnsafe' || key === 'allocUnsafeSlow') continue
  Safer[key] = Buffer[key]
}

safer.Buffer.prototype = Buffer.prototype

if (!Safer.from || Safer.from === Uint8Array.from) {
  Safer.from = function (value, encodingOrOffset, length) {
    if (typeof value === 'number') {
      throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof value)
    }
    if (value && typeof value.length === 'undefined') {
      throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' + typeof value)
    }
    return Buffer(value, encodingOrOffset, length)
  }
}

if (!Safer.alloc) {
  Safer.alloc = function (size, fill, encoding) {
    if (typeof size !== 'number') {
      throw new TypeError('The "size" argument must be of type number. Received type ' + typeof size)
    }
    if (size < 0 || size >= 2 * (1 << 30)) {
      throw new RangeError('The value "' + size + '" is invalid for option "size"')
    }
    var buf = Buffer(size)
    if (!fill || fill.length === 0) {
      buf.fill(0)
    } else if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
    return buf
  }
}

if (!safer.kStringMaxLength) {
  try {
    safer.kStringMaxLength = process.binding('buffer').kStringMaxLength
  } catch (e) {
    // we can't determine kStringMaxLength in environments where process.binding
    // is unsupported, so let's not set it
  }
}

if (!safer.constants) {
  safer.constants = {
    MAX_LENGTH: safer.kMaxLength
  }
  if (safer.kStringMaxLength) {
    safer.constants.MAX_STRING_LENGTH = safer.kStringMaxLength
  }
}

module.exports = safer

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "8oxB")))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2FmZXItYnVmZmVyL3NhZmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7QUFFWTs7QUFFWixhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0I7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5zYWZlci1idWZmZXIuNTAyNjMxMDRiMGYwOTMxMDJlN2EuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBub2RlL25vLWRlcHJlY2F0ZWQtYXBpICovXHJcblxyXG4ndXNlIHN0cmljdCdcclxuXHJcbnZhciBidWZmZXIgPSByZXF1aXJlKCdidWZmZXInKVxyXG52YXIgQnVmZmVyID0gYnVmZmVyLkJ1ZmZlclxyXG5cclxudmFyIHNhZmVyID0ge31cclxuXHJcbnZhciBrZXlcclxuXHJcbmZvciAoa2V5IGluIGJ1ZmZlcikge1xyXG4gIGlmICghYnVmZmVyLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlXHJcbiAgaWYgKGtleSA9PT0gJ1Nsb3dCdWZmZXInIHx8IGtleSA9PT0gJ0J1ZmZlcicpIGNvbnRpbnVlXHJcbiAgc2FmZXJba2V5XSA9IGJ1ZmZlcltrZXldXHJcbn1cclxuXHJcbnZhciBTYWZlciA9IHNhZmVyLkJ1ZmZlciA9IHt9XHJcbmZvciAoa2V5IGluIEJ1ZmZlcikge1xyXG4gIGlmICghQnVmZmVyLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlXHJcbiAgaWYgKGtleSA9PT0gJ2FsbG9jVW5zYWZlJyB8fCBrZXkgPT09ICdhbGxvY1Vuc2FmZVNsb3cnKSBjb250aW51ZVxyXG4gIFNhZmVyW2tleV0gPSBCdWZmZXJba2V5XVxyXG59XHJcblxyXG5zYWZlci5CdWZmZXIucHJvdG90eXBlID0gQnVmZmVyLnByb3RvdHlwZVxyXG5cclxuaWYgKCFTYWZlci5mcm9tIHx8IFNhZmVyLmZyb20gPT09IFVpbnQ4QXJyYXkuZnJvbSkge1xyXG4gIFNhZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwidmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBvZiB0eXBlIG51bWJlci4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIHZhbHVlKVxyXG4gICAgfVxyXG4gICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksIG9yIEFycmF5LWxpa2UgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgdmFsdWUpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gQnVmZmVyKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXHJcbiAgfVxyXG59XHJcblxyXG5pZiAoIVNhZmVyLmFsbG9jKSB7XHJcbiAgU2FmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcclxuICAgIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBudW1iZXIuIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBzaXplKVxyXG4gICAgfVxyXG4gICAgaWYgKHNpemUgPCAwIHx8IHNpemUgPj0gMiAqICgxIDw8IDMwKSkge1xyXG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIFwiJyArIHNpemUgKyAnXCIgaXMgaW52YWxpZCBmb3Igb3B0aW9uIFwic2l6ZVwiJylcclxuICAgIH1cclxuICAgIHZhciBidWYgPSBCdWZmZXIoc2l6ZSlcclxuICAgIGlmICghZmlsbCB8fCBmaWxsLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBidWYuZmlsbCgwKVxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIGJ1Zi5maWxsKGZpbGwsIGVuY29kaW5nKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYnVmLmZpbGwoZmlsbClcclxuICAgIH1cclxuICAgIHJldHVybiBidWZcclxuICB9XHJcbn1cclxuXHJcbmlmICghc2FmZXIua1N0cmluZ01heExlbmd0aCkge1xyXG4gIHRyeSB7XHJcbiAgICBzYWZlci5rU3RyaW5nTWF4TGVuZ3RoID0gcHJvY2Vzcy5iaW5kaW5nKCdidWZmZXInKS5rU3RyaW5nTWF4TGVuZ3RoXHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgLy8gd2UgY2FuJ3QgZGV0ZXJtaW5lIGtTdHJpbmdNYXhMZW5ndGggaW4gZW52aXJvbm1lbnRzIHdoZXJlIHByb2Nlc3MuYmluZGluZ1xyXG4gICAgLy8gaXMgdW5zdXBwb3J0ZWQsIHNvIGxldCdzIG5vdCBzZXQgaXRcclxuICB9XHJcbn1cclxuXHJcbmlmICghc2FmZXIuY29uc3RhbnRzKSB7XHJcbiAgc2FmZXIuY29uc3RhbnRzID0ge1xyXG4gICAgTUFYX0xFTkdUSDogc2FmZXIua01heExlbmd0aFxyXG4gIH1cclxuICBpZiAoc2FmZXIua1N0cmluZ01heExlbmd0aCkge1xyXG4gICAgc2FmZXIuY29uc3RhbnRzLk1BWF9TVFJJTkdfTEVOR1RIID0gc2FmZXIua1N0cmluZ01heExlbmd0aFxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYWZlclxyXG4iXSwic291cmNlUm9vdCI6IiJ9