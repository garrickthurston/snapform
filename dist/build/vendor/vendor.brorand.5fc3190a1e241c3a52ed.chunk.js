(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.brorand"],{

/***/ "/ayr":
/*!***************************************!*\
  !*** ./node_modules/brorand/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var r;

module.exports = function rand(len) {
  if (!r)
    r = new Rand(null);

  return r.generate(len);
};

function Rand(rand) {
  this.rand = rand;
}
module.exports.Rand = Rand;

Rand.prototype.generate = function generate(len) {
  return this._rand(len);
};

// Emulate crypto API using randy
Rand.prototype._rand = function _rand(n) {
  if (this.rand.getBytes)
    return this.rand.getBytes(n);

  var res = new Uint8Array(n);
  for (var i = 0; i < res.length; i++)
    res[i] = this.rand.getByte();
  return res;
};

if (typeof self === 'object') {
  if (self.crypto && self.crypto.getRandomValues) {
    // Modern browsers
    Rand.prototype._rand = function _rand(n) {
      var arr = new Uint8Array(n);
      self.crypto.getRandomValues(arr);
      return arr;
    };
  } else if (self.msCrypto && self.msCrypto.getRandomValues) {
    // IE
    Rand.prototype._rand = function _rand(n) {
      var arr = new Uint8Array(n);
      self.msCrypto.getRandomValues(arr);
      return arr;
    };

  // Safari's WebWorkers do not have `crypto`
  } else if (typeof window === 'object') {
    // Old junk
    Rand.prototype._rand = function() {
      throw new Error('Not implemented yet');
    };
  }
} else {
  // Node.js or Web worker with no crypto support
  try {
    var crypto = __webpack_require__(/*! crypto */ 3);
    if (typeof crypto.randomBytes !== 'function')
      throw new Error('Not supported');

    Rand.prototype._rand = function _rand(n) {
      return crypto.randomBytes(n);
    };
  } catch (e) {
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvcmFuZC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsZ0JBQWdCO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxpQkFBaUIsbUJBQU8sQ0FBQyxlQUFRO0FBQ2pDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5icm9yYW5kLjVmYzMxOTBhMWUyNDFjM2E1MmVkLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmFuZChsZW4pIHtcbiAgaWYgKCFyKVxuICAgIHIgPSBuZXcgUmFuZChudWxsKTtcblxuICByZXR1cm4gci5nZW5lcmF0ZShsZW4pO1xufTtcblxuZnVuY3Rpb24gUmFuZChyYW5kKSB7XG4gIHRoaXMucmFuZCA9IHJhbmQ7XG59XG5tb2R1bGUuZXhwb3J0cy5SYW5kID0gUmFuZDtcblxuUmFuZC5wcm90b3R5cGUuZ2VuZXJhdGUgPSBmdW5jdGlvbiBnZW5lcmF0ZShsZW4pIHtcbiAgcmV0dXJuIHRoaXMuX3JhbmQobGVuKTtcbn07XG5cbi8vIEVtdWxhdGUgY3J5cHRvIEFQSSB1c2luZyByYW5keVxuUmFuZC5wcm90b3R5cGUuX3JhbmQgPSBmdW5jdGlvbiBfcmFuZChuKSB7XG4gIGlmICh0aGlzLnJhbmQuZ2V0Qnl0ZXMpXG4gICAgcmV0dXJuIHRoaXMucmFuZC5nZXRCeXRlcyhuKTtcblxuICB2YXIgcmVzID0gbmV3IFVpbnQ4QXJyYXkobik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzLmxlbmd0aDsgaSsrKVxuICAgIHJlc1tpXSA9IHRoaXMucmFuZC5nZXRCeXRlKCk7XG4gIHJldHVybiByZXM7XG59O1xuXG5pZiAodHlwZW9mIHNlbGYgPT09ICdvYmplY3QnKSB7XG4gIGlmIChzZWxmLmNyeXB0byAmJiBzZWxmLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBNb2Rlcm4gYnJvd3NlcnNcbiAgICBSYW5kLnByb3RvdHlwZS5fcmFuZCA9IGZ1bmN0aW9uIF9yYW5kKG4pIHtcbiAgICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheShuKTtcbiAgICAgIHNlbGYuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhhcnIpO1xuICAgICAgcmV0dXJuIGFycjtcbiAgICB9O1xuICB9IGVsc2UgaWYgKHNlbGYubXNDcnlwdG8gJiYgc2VsZi5tc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBJRVxuICAgIFJhbmQucHJvdG90eXBlLl9yYW5kID0gZnVuY3Rpb24gX3JhbmQobikge1xuICAgICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KG4pO1xuICAgICAgc2VsZi5tc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMoYXJyKTtcbiAgICAgIHJldHVybiBhcnI7XG4gICAgfTtcblxuICAvLyBTYWZhcmkncyBXZWJXb3JrZXJzIGRvIG5vdCBoYXZlIGBjcnlwdG9gXG4gIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBPbGQganVua1xuICAgIFJhbmQucHJvdG90eXBlLl9yYW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCB5ZXQnKTtcbiAgICB9O1xuICB9XG59IGVsc2Uge1xuICAvLyBOb2RlLmpzIG9yIFdlYiB3b3JrZXIgd2l0aCBubyBjcnlwdG8gc3VwcG9ydFxuICB0cnkge1xuICAgIHZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgICBpZiAodHlwZW9mIGNyeXB0by5yYW5kb21CeXRlcyAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm90IHN1cHBvcnRlZCcpO1xuXG4gICAgUmFuZC5wcm90b3R5cGUuX3JhbmQgPSBmdW5jdGlvbiBfcmFuZChuKSB7XG4gICAgICByZXR1cm4gY3J5cHRvLnJhbmRvbUJ5dGVzKG4pO1xuICAgIH07XG4gIH0gY2F0Y2ggKGUpIHtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==