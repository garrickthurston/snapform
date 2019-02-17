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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbWluaW1hbGlzdGljLWNyeXB0by11dGlscy9saWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhOztBQUViOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixnQkFBZ0I7QUFDbkM7QUFDQSxHQUFHO0FBQ0gsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InZlbmRvci92ZW5kb3IubWluaW1hbGlzdGljLWNyeXB0by11dGlscy43YTI4ZDNhYzU1OTEzMmFiMjRmMi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gZXhwb3J0cztcblxuZnVuY3Rpb24gdG9BcnJheShtc2csIGVuYykge1xuICBpZiAoQXJyYXkuaXNBcnJheShtc2cpKVxuICAgIHJldHVybiBtc2cuc2xpY2UoKTtcbiAgaWYgKCFtc2cpXG4gICAgcmV0dXJuIFtdO1xuICB2YXIgcmVzID0gW107XG4gIGlmICh0eXBlb2YgbXNnICE9PSAnc3RyaW5nJykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLmxlbmd0aDsgaSsrKVxuICAgICAgcmVzW2ldID0gbXNnW2ldIHwgMDtcbiAgICByZXR1cm4gcmVzO1xuICB9XG4gIGlmIChlbmMgPT09ICdoZXgnKSB7XG4gICAgbXNnID0gbXNnLnJlcGxhY2UoL1teYS16MC05XSsvaWcsICcnKTtcbiAgICBpZiAobXNnLmxlbmd0aCAlIDIgIT09IDApXG4gICAgICBtc2cgPSAnMCcgKyBtc2c7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtc2cubGVuZ3RoOyBpICs9IDIpXG4gICAgICByZXMucHVzaChwYXJzZUludChtc2dbaV0gKyBtc2dbaSArIDFdLCAxNikpO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgYyA9IG1zZy5jaGFyQ29kZUF0KGkpO1xuICAgICAgdmFyIGhpID0gYyA+PiA4O1xuICAgICAgdmFyIGxvID0gYyAmIDB4ZmY7XG4gICAgICBpZiAoaGkpXG4gICAgICAgIHJlcy5wdXNoKGhpLCBsbyk7XG4gICAgICBlbHNlXG4gICAgICAgIHJlcy5wdXNoKGxvKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cbnV0aWxzLnRvQXJyYXkgPSB0b0FycmF5O1xuXG5mdW5jdGlvbiB6ZXJvMih3b3JkKSB7XG4gIGlmICh3b3JkLmxlbmd0aCA9PT0gMSlcbiAgICByZXR1cm4gJzAnICsgd29yZDtcbiAgZWxzZVxuICAgIHJldHVybiB3b3JkO1xufVxudXRpbHMuemVybzIgPSB6ZXJvMjtcblxuZnVuY3Rpb24gdG9IZXgobXNnKSB7XG4gIHZhciByZXMgPSAnJztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtc2cubGVuZ3RoOyBpKyspXG4gICAgcmVzICs9IHplcm8yKG1zZ1tpXS50b1N0cmluZygxNikpO1xuICByZXR1cm4gcmVzO1xufVxudXRpbHMudG9IZXggPSB0b0hleDtcblxudXRpbHMuZW5jb2RlID0gZnVuY3Rpb24gZW5jb2RlKGFyciwgZW5jKSB7XG4gIGlmIChlbmMgPT09ICdoZXgnKVxuICAgIHJldHVybiB0b0hleChhcnIpO1xuICBlbHNlXG4gICAgcmV0dXJuIGFycjtcbn07XG4iXSwic291cmNlUm9vdCI6IiJ9