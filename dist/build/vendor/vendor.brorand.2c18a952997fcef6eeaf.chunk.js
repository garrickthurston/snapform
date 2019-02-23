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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvcmFuZC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsZ0JBQWdCO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxpQkFBaUIsbUJBQU8sQ0FBQyxlQUFRO0FBQ2pDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5icm9yYW5kLjJjMThhOTUyOTk3ZmNlZjZlZWFmLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJhbmQobGVuKSB7XHJcbiAgaWYgKCFyKVxyXG4gICAgciA9IG5ldyBSYW5kKG51bGwpO1xyXG5cclxuICByZXR1cm4gci5nZW5lcmF0ZShsZW4pO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gUmFuZChyYW5kKSB7XHJcbiAgdGhpcy5yYW5kID0gcmFuZDtcclxufVxyXG5tb2R1bGUuZXhwb3J0cy5SYW5kID0gUmFuZDtcclxuXHJcblJhbmQucHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24gZ2VuZXJhdGUobGVuKSB7XHJcbiAgcmV0dXJuIHRoaXMuX3JhbmQobGVuKTtcclxufTtcclxuXHJcbi8vIEVtdWxhdGUgY3J5cHRvIEFQSSB1c2luZyByYW5keVxyXG5SYW5kLnByb3RvdHlwZS5fcmFuZCA9IGZ1bmN0aW9uIF9yYW5kKG4pIHtcclxuICBpZiAodGhpcy5yYW5kLmdldEJ5dGVzKVxyXG4gICAgcmV0dXJuIHRoaXMucmFuZC5nZXRCeXRlcyhuKTtcclxuXHJcbiAgdmFyIHJlcyA9IG5ldyBVaW50OEFycmF5KG4pO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzLmxlbmd0aDsgaSsrKVxyXG4gICAgcmVzW2ldID0gdGhpcy5yYW5kLmdldEJ5dGUoKTtcclxuICByZXR1cm4gcmVzO1xyXG59O1xyXG5cclxuaWYgKHR5cGVvZiBzZWxmID09PSAnb2JqZWN0Jykge1xyXG4gIGlmIChzZWxmLmNyeXB0byAmJiBzZWxmLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcclxuICAgIC8vIE1vZGVybiBicm93c2Vyc1xyXG4gICAgUmFuZC5wcm90b3R5cGUuX3JhbmQgPSBmdW5jdGlvbiBfcmFuZChuKSB7XHJcbiAgICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheShuKTtcclxuICAgICAgc2VsZi5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGFycik7XHJcbiAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAoc2VsZi5tc0NyeXB0byAmJiBzZWxmLm1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xyXG4gICAgLy8gSUVcclxuICAgIFJhbmQucHJvdG90eXBlLl9yYW5kID0gZnVuY3Rpb24gX3JhbmQobikge1xyXG4gICAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkobik7XHJcbiAgICAgIHNlbGYubXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGFycik7XHJcbiAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9O1xyXG5cclxuICAvLyBTYWZhcmkncyBXZWJXb3JrZXJzIGRvIG5vdCBoYXZlIGBjcnlwdG9gXHJcbiAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0Jykge1xyXG4gICAgLy8gT2xkIGp1bmtcclxuICAgIFJhbmQucHJvdG90eXBlLl9yYW5kID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkIHlldCcpO1xyXG4gICAgfTtcclxuICB9XHJcbn0gZWxzZSB7XHJcbiAgLy8gTm9kZS5qcyBvciBXZWIgd29ya2VyIHdpdGggbm8gY3J5cHRvIHN1cHBvcnRcclxuICB0cnkge1xyXG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xyXG4gICAgaWYgKHR5cGVvZiBjcnlwdG8ucmFuZG9tQnl0ZXMgIT09ICdmdW5jdGlvbicpXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm90IHN1cHBvcnRlZCcpO1xyXG5cclxuICAgIFJhbmQucHJvdG90eXBlLl9yYW5kID0gZnVuY3Rpb24gX3JhbmQobikge1xyXG4gICAgICByZXR1cm4gY3J5cHRvLnJhbmRvbUJ5dGVzKG4pO1xyXG4gICAgfTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=