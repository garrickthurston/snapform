(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.isstream"],{

/***/ "jPMY":
/*!*******************************************!*\
  !*** ./node_modules/isstream/isstream.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var stream = __webpack_require__(/*! stream */ "1IWx")


function isStream (obj) {
  return obj instanceof stream.Stream
}


function isReadable (obj) {
  return isStream(obj) && typeof obj._read == 'function' && typeof obj._readableState == 'object'
}


function isWritable (obj) {
  return isStream(obj) && typeof obj._write == 'function' && typeof obj._writableState == 'object'
}


function isDuplex (obj) {
  return isReadable(obj) && isWritable(obj)
}


module.exports            = isStream
module.exports.isReadable = isReadable
module.exports.isWritable = isWritable
module.exports.isDuplex   = isDuplex


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaXNzdHJlYW0vaXNzdHJlYW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsYUFBYSxtQkFBTyxDQUFDLG9CQUFROzs7QUFHN0I7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmlzc3RyZWFtLjk4ZTNkZDY0YjE2NmMwODRiNjQ0LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpXHJcblxyXG5cclxuZnVuY3Rpb24gaXNTdHJlYW0gKG9iaikge1xyXG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiBzdHJlYW0uU3RyZWFtXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpc1JlYWRhYmxlIChvYmopIHtcclxuICByZXR1cm4gaXNTdHJlYW0ob2JqKSAmJiB0eXBlb2Ygb2JqLl9yZWFkID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5fcmVhZGFibGVTdGF0ZSA9PSAnb2JqZWN0J1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaXNXcml0YWJsZSAob2JqKSB7XHJcbiAgcmV0dXJuIGlzU3RyZWFtKG9iaikgJiYgdHlwZW9mIG9iai5fd3JpdGUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLl93cml0YWJsZVN0YXRlID09ICdvYmplY3QnXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpc0R1cGxleCAob2JqKSB7XHJcbiAgcmV0dXJuIGlzUmVhZGFibGUob2JqKSAmJiBpc1dyaXRhYmxlKG9iailcclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzICAgICAgICAgICAgPSBpc1N0cmVhbVxyXG5tb2R1bGUuZXhwb3J0cy5pc1JlYWRhYmxlID0gaXNSZWFkYWJsZVxyXG5tb2R1bGUuZXhwb3J0cy5pc1dyaXRhYmxlID0gaXNXcml0YWJsZVxyXG5tb2R1bGUuZXhwb3J0cy5pc0R1cGxleCAgID0gaXNEdXBsZXhcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==