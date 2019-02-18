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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnVmZmVyLXhvci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLFlBQVk7QUFDN0I7QUFDQTs7QUFFQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuYnVmZmVyLXhvci4yMDI1YWI2YjA1ZTU3YzU5MTI5Mi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geG9yIChhLCBiKSB7XG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihhLmxlbmd0aCwgYi5sZW5ndGgpXG4gIHZhciBidWZmZXIgPSBuZXcgQnVmZmVyKGxlbmd0aClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgYnVmZmVyW2ldID0gYVtpXSBeIGJbaV1cbiAgfVxuXG4gIHJldHVybiBidWZmZXJcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=