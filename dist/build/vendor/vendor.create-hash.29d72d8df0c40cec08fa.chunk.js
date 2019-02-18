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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3JlYXRlLWhhc2gvbWQ1LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jcmVhdGUtaGFzaC9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLFVBQVUsbUJBQU8sQ0FBQyxvQkFBUTs7QUFFMUI7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDSlk7QUFDWixlQUFlLG1CQUFPLENBQUMsc0JBQVU7QUFDakMsVUFBVSxtQkFBTyxDQUFDLG9CQUFRO0FBQzFCLGdCQUFnQixtQkFBTyxDQUFDLHVCQUFXO0FBQ25DLFVBQVUsbUJBQU8sQ0FBQyxvQkFBUTtBQUMxQixXQUFXLG1CQUFPLENBQUMseUJBQWE7O0FBRWhDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5jcmVhdGUtaGFzaC4yOWQ3MmQ4ZGYwYzQwY2VjMDhmYS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBNRDUgPSByZXF1aXJlKCdtZDUuanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChidWZmZXIpIHtcbiAgcmV0dXJuIG5ldyBNRDUoKS51cGRhdGUoYnVmZmVyKS5kaWdlc3QoKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG52YXIgTUQ1ID0gcmVxdWlyZSgnbWQ1LmpzJylcbnZhciBSSVBFTUQxNjAgPSByZXF1aXJlKCdyaXBlbWQxNjAnKVxudmFyIHNoYSA9IHJlcXVpcmUoJ3NoYS5qcycpXG52YXIgQmFzZSA9IHJlcXVpcmUoJ2NpcGhlci1iYXNlJylcblxuZnVuY3Rpb24gSGFzaCAoaGFzaCkge1xuICBCYXNlLmNhbGwodGhpcywgJ2RpZ2VzdCcpXG5cbiAgdGhpcy5faGFzaCA9IGhhc2hcbn1cblxuaW5oZXJpdHMoSGFzaCwgQmFzZSlcblxuSGFzaC5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIHRoaXMuX2hhc2gudXBkYXRlKGRhdGEpXG59XG5cbkhhc2gucHJvdG90eXBlLl9maW5hbCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX2hhc2guZGlnZXN0KClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVIYXNoIChhbGcpIHtcbiAgYWxnID0gYWxnLnRvTG93ZXJDYXNlKClcbiAgaWYgKGFsZyA9PT0gJ21kNScpIHJldHVybiBuZXcgTUQ1KClcbiAgaWYgKGFsZyA9PT0gJ3JtZDE2MCcgfHwgYWxnID09PSAncmlwZW1kMTYwJykgcmV0dXJuIG5ldyBSSVBFTUQxNjAoKVxuXG4gIHJldHVybiBuZXcgSGFzaChzaGEoYWxnKSlcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=