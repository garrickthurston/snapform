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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2FmZXItYnVmZmVyL3NhZmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7QUFFWTs7QUFFWixhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0I7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5zYWZlci1idWZmZXIuMTFiNDE5MTJmMGM0OWEzZjQzZDcuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBub2RlL25vLWRlcHJlY2F0ZWQtYXBpICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJylcbnZhciBCdWZmZXIgPSBidWZmZXIuQnVmZmVyXG5cbnZhciBzYWZlciA9IHt9XG5cbnZhciBrZXlcblxuZm9yIChrZXkgaW4gYnVmZmVyKSB7XG4gIGlmICghYnVmZmVyLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlXG4gIGlmIChrZXkgPT09ICdTbG93QnVmZmVyJyB8fCBrZXkgPT09ICdCdWZmZXInKSBjb250aW51ZVxuICBzYWZlcltrZXldID0gYnVmZmVyW2tleV1cbn1cblxudmFyIFNhZmVyID0gc2FmZXIuQnVmZmVyID0ge31cbmZvciAoa2V5IGluIEJ1ZmZlcikge1xuICBpZiAoIUJ1ZmZlci5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZVxuICBpZiAoa2V5ID09PSAnYWxsb2NVbnNhZmUnIHx8IGtleSA9PT0gJ2FsbG9jVW5zYWZlU2xvdycpIGNvbnRpbnVlXG4gIFNhZmVyW2tleV0gPSBCdWZmZXJba2V5XVxufVxuXG5zYWZlci5CdWZmZXIucHJvdG90eXBlID0gQnVmZmVyLnByb3RvdHlwZVxuXG5pZiAoIVNhZmVyLmZyb20gfHwgU2FmZXIuZnJvbSA9PT0gVWludDhBcnJheS5mcm9tKSB7XG4gIFNhZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgdmFsdWUpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgb3IgQXJyYXktbGlrZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiB2YWx1ZSlcbiAgICB9XG4gICAgcmV0dXJuIEJ1ZmZlcih2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG59XG5cbmlmICghU2FmZXIuYWxsb2MpIHtcbiAgU2FmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIG51bWJlci4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIHNpemUpXG4gICAgfVxuICAgIGlmIChzaXplIDwgMCB8fCBzaXplID49IDIgKiAoMSA8PCAzMCkpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgXCInICsgc2l6ZSArICdcIiBpcyBpbnZhbGlkIGZvciBvcHRpb24gXCJzaXplXCInKVxuICAgIH1cbiAgICB2YXIgYnVmID0gQnVmZmVyKHNpemUpXG4gICAgaWYgKCFmaWxsIHx8IGZpbGwubGVuZ3RoID09PSAwKSB7XG4gICAgICBidWYuZmlsbCgwKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJykge1xuICAgICAgYnVmLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1Zi5maWxsKGZpbGwpXG4gICAgfVxuICAgIHJldHVybiBidWZcbiAgfVxufVxuXG5pZiAoIXNhZmVyLmtTdHJpbmdNYXhMZW5ndGgpIHtcbiAgdHJ5IHtcbiAgICBzYWZlci5rU3RyaW5nTWF4TGVuZ3RoID0gcHJvY2Vzcy5iaW5kaW5nKCdidWZmZXInKS5rU3RyaW5nTWF4TGVuZ3RoXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyB3ZSBjYW4ndCBkZXRlcm1pbmUga1N0cmluZ01heExlbmd0aCBpbiBlbnZpcm9ubWVudHMgd2hlcmUgcHJvY2Vzcy5iaW5kaW5nXG4gICAgLy8gaXMgdW5zdXBwb3J0ZWQsIHNvIGxldCdzIG5vdCBzZXQgaXRcbiAgfVxufVxuXG5pZiAoIXNhZmVyLmNvbnN0YW50cykge1xuICBzYWZlci5jb25zdGFudHMgPSB7XG4gICAgTUFYX0xFTkdUSDogc2FmZXIua01heExlbmd0aFxuICB9XG4gIGlmIChzYWZlci5rU3RyaW5nTWF4TGVuZ3RoKSB7XG4gICAgc2FmZXIuY29uc3RhbnRzLk1BWF9TVFJJTkdfTEVOR1RIID0gc2FmZXIua1N0cmluZ01heExlbmd0aFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2FmZXJcbiJdLCJzb3VyY2VSb290IjoiIn0=