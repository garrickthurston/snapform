(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.buffer-xor"],{

/***/ "jIre":
/*!******************************************!*\
  !*** ./node_modules/buffer-xor/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {module.exports = function xor (a, b) {
  var length = Math.min(a.length, b.length)
  var buffer = new Buffer(length)

  for (var i = 0; i < length; ++i) {
    buffer[i] = a[i] ^ b[i]
  }

  return buffer
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../buffer/index.js */ "tjlA").Buffer))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnVmZmVyLXhvci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLFlBQVk7QUFDN0I7QUFDQTs7QUFFQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuYnVmZmVyLXhvci5iMTI1MDg0ZTI4ZGRkMjIzNzlmZC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geG9yIChhLCBiKSB7XHJcbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGEubGVuZ3RoLCBiLmxlbmd0aClcclxuICB2YXIgYnVmZmVyID0gbmV3IEJ1ZmZlcihsZW5ndGgpXHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcclxuICAgIGJ1ZmZlcltpXSA9IGFbaV0gXiBiW2ldXHJcbiAgfVxyXG5cclxuICByZXR1cm4gYnVmZmVyXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==