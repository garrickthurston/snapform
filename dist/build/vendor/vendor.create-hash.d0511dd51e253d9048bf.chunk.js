(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.create-hash"],{

/***/ "WnY+":
/*!*****************************************!*\
  !*** ./node_modules/create-hash/md5.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var MD5 = __webpack_require__(/*! md5.js */ "9XZ3")

module.exports = function (buffer) {
  return new MD5().update(buffer).digest()
}


/***/ }),

/***/ "mObS":
/*!*********************************************!*\
  !*** ./node_modules/create-hash/browser.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var inherits = __webpack_require__(/*! inherits */ "P7XM")
var MD5 = __webpack_require__(/*! md5.js */ "9XZ3")
var RIPEMD160 = __webpack_require__(/*! ripemd160 */ "tcrS")
var sha = __webpack_require__(/*! sha.js */ "afKu")
var Base = __webpack_require__(/*! cipher-base */ "ZDAU")

function Hash (hash) {
  Base.call(this, 'digest')

  this._hash = hash
}

inherits(Hash, Base)

Hash.prototype._update = function (data) {
  this._hash.update(data)
}

Hash.prototype._final = function () {
  return this._hash.digest()
}

module.exports = function createHash (alg) {
  alg = alg.toLowerCase()
  if (alg === 'md5') return new MD5()
  if (alg === 'rmd160' || alg === 'ripemd160') return new RIPEMD160()

  return new Hash(sha(alg))
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3JlYXRlLWhhc2gvbWQ1LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jcmVhdGUtaGFzaC9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLFVBQVUsbUJBQU8sQ0FBQyxvQkFBUTs7QUFFMUI7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDSlk7QUFDWixlQUFlLG1CQUFPLENBQUMsc0JBQVU7QUFDakMsVUFBVSxtQkFBTyxDQUFDLG9CQUFRO0FBQzFCLGdCQUFnQixtQkFBTyxDQUFDLHVCQUFXO0FBQ25DLFVBQVUsbUJBQU8sQ0FBQyxvQkFBUTtBQUMxQixXQUFXLG1CQUFPLENBQUMseUJBQWE7O0FBRWhDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5jcmVhdGUtaGFzaC5kMDUxMWRkNTFlMjUzZDkwNDhiZi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBNRDUgPSByZXF1aXJlKCdtZDUuanMnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYnVmZmVyKSB7XHJcbiAgcmV0dXJuIG5ldyBNRDUoKS51cGRhdGUoYnVmZmVyKS5kaWdlc3QoKVxyXG59XHJcbiIsIid1c2Ugc3RyaWN0J1xyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXHJcbnZhciBNRDUgPSByZXF1aXJlKCdtZDUuanMnKVxyXG52YXIgUklQRU1EMTYwID0gcmVxdWlyZSgncmlwZW1kMTYwJylcclxudmFyIHNoYSA9IHJlcXVpcmUoJ3NoYS5qcycpXHJcbnZhciBCYXNlID0gcmVxdWlyZSgnY2lwaGVyLWJhc2UnKVxyXG5cclxuZnVuY3Rpb24gSGFzaCAoaGFzaCkge1xyXG4gIEJhc2UuY2FsbCh0aGlzLCAnZGlnZXN0JylcclxuXHJcbiAgdGhpcy5faGFzaCA9IGhhc2hcclxufVxyXG5cclxuaW5oZXJpdHMoSGFzaCwgQmFzZSlcclxuXHJcbkhhc2gucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gIHRoaXMuX2hhc2gudXBkYXRlKGRhdGEpXHJcbn1cclxuXHJcbkhhc2gucHJvdG90eXBlLl9maW5hbCA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gdGhpcy5faGFzaC5kaWdlc3QoKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUhhc2ggKGFsZykge1xyXG4gIGFsZyA9IGFsZy50b0xvd2VyQ2FzZSgpXHJcbiAgaWYgKGFsZyA9PT0gJ21kNScpIHJldHVybiBuZXcgTUQ1KClcclxuICBpZiAoYWxnID09PSAncm1kMTYwJyB8fCBhbGcgPT09ICdyaXBlbWQxNjAnKSByZXR1cm4gbmV3IFJJUEVNRDE2MCgpXHJcblxyXG4gIHJldHVybiBuZXcgSGFzaChzaGEoYWxnKSlcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9