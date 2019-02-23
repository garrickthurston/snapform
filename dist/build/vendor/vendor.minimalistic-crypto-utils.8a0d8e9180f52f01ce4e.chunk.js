(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.minimalistic-crypto-utils"],{

/***/ "dlgc":
/*!*************************************************************!*\
  !*** ./node_modules/minimalistic-crypto-utils/lib/utils.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = exports;

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg !== 'string') {
    for (var i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
    return res;
  }
  if (enc === 'hex') {
    msg = msg.replace(/[^a-z0-9]+/ig, '');
    if (msg.length % 2 !== 0)
      msg = '0' + msg;
    for (var i = 0; i < msg.length; i += 2)
      res.push(parseInt(msg[i] + msg[i + 1], 16));
  } else {
    for (var i = 0; i < msg.length; i++) {
      var c = msg.charCodeAt(i);
      var hi = c >> 8;
      var lo = c & 0xff;
      if (hi)
        res.push(hi, lo);
      else
        res.push(lo);
    }
  }
  return res;
}
utils.toArray = toArray;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
utils.zero2 = zero2;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
utils.toHex = toHex;

utils.encode = function encode(arr, enc) {
  if (enc === 'hex')
    return toHex(arr);
  else
    return arr;
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbWluaW1hbGlzdGljLWNyeXB0by11dGlscy9saWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhOztBQUViOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixnQkFBZ0I7QUFDbkM7QUFDQSxHQUFHO0FBQ0gsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IubWluaW1hbGlzdGljLWNyeXB0by11dGlscy44YTBkOGU5MTgwZjUyZjAxY2U0ZS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB1dGlscyA9IGV4cG9ydHM7XHJcblxyXG5mdW5jdGlvbiB0b0FycmF5KG1zZywgZW5jKSB7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkobXNnKSlcclxuICAgIHJldHVybiBtc2cuc2xpY2UoKTtcclxuICBpZiAoIW1zZylcclxuICAgIHJldHVybiBbXTtcclxuICB2YXIgcmVzID0gW107XHJcbiAgaWYgKHR5cGVvZiBtc2cgIT09ICdzdHJpbmcnKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkrKylcclxuICAgICAgcmVzW2ldID0gbXNnW2ldIHwgMDtcclxuICAgIHJldHVybiByZXM7XHJcbiAgfVxyXG4gIGlmIChlbmMgPT09ICdoZXgnKSB7XHJcbiAgICBtc2cgPSBtc2cucmVwbGFjZSgvW15hLXowLTldKy9pZywgJycpO1xyXG4gICAgaWYgKG1zZy5sZW5ndGggJSAyICE9PSAwKVxyXG4gICAgICBtc2cgPSAnMCcgKyBtc2c7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkgKz0gMilcclxuICAgICAgcmVzLnB1c2gocGFyc2VJbnQobXNnW2ldICsgbXNnW2kgKyAxXSwgMTYpKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtc2cubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGMgPSBtc2cuY2hhckNvZGVBdChpKTtcclxuICAgICAgdmFyIGhpID0gYyA+PiA4O1xyXG4gICAgICB2YXIgbG8gPSBjICYgMHhmZjtcclxuICAgICAgaWYgKGhpKVxyXG4gICAgICAgIHJlcy5wdXNoKGhpLCBsbyk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXMucHVzaChsbyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxudXRpbHMudG9BcnJheSA9IHRvQXJyYXk7XHJcblxyXG5mdW5jdGlvbiB6ZXJvMih3b3JkKSB7XHJcbiAgaWYgKHdvcmQubGVuZ3RoID09PSAxKVxyXG4gICAgcmV0dXJuICcwJyArIHdvcmQ7XHJcbiAgZWxzZVxyXG4gICAgcmV0dXJuIHdvcmQ7XHJcbn1cclxudXRpbHMuemVybzIgPSB6ZXJvMjtcclxuXHJcbmZ1bmN0aW9uIHRvSGV4KG1zZykge1xyXG4gIHZhciByZXMgPSAnJztcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkrKylcclxuICAgIHJlcyArPSB6ZXJvMihtc2dbaV0udG9TdHJpbmcoMTYpKTtcclxuICByZXR1cm4gcmVzO1xyXG59XHJcbnV0aWxzLnRvSGV4ID0gdG9IZXg7XHJcblxyXG51dGlscy5lbmNvZGUgPSBmdW5jdGlvbiBlbmNvZGUoYXJyLCBlbmMpIHtcclxuICBpZiAoZW5jID09PSAnaGV4JylcclxuICAgIHJldHVybiB0b0hleChhcnIpO1xyXG4gIGVsc2VcclxuICAgIHJldHVybiBhcnI7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=