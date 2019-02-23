(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.process-nextick-args"],{

/***/ "lm0R":
/*!****************************************************!*\
  !*** ./node_modules/process-nextick-args/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = { nextTick: nextTick };
} else {
  module.exports = process
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "8oxB")))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy1uZXh0aWNrLWFyZ3MvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtDQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQixDQUFDO0FBQ0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLnByb2Nlc3MtbmV4dGljay1hcmdzLjE4NjhlOWUzMWE1MmVmMGYxNmZhLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaWYgKCFwcm9jZXNzLnZlcnNpb24gfHxcclxuICAgIHByb2Nlc3MudmVyc2lvbi5pbmRleE9mKCd2MC4nKSA9PT0gMCB8fFxyXG4gICAgcHJvY2Vzcy52ZXJzaW9uLmluZGV4T2YoJ3YxLicpID09PSAwICYmIHByb2Nlc3MudmVyc2lvbi5pbmRleE9mKCd2MS44LicpICE9PSAwKSB7XHJcbiAgbW9kdWxlLmV4cG9ydHMgPSB7IG5leHRUaWNrOiBuZXh0VGljayB9O1xyXG59IGVsc2Uge1xyXG4gIG1vZHVsZS5leHBvcnRzID0gcHJvY2Vzc1xyXG59XHJcblxyXG5mdW5jdGlvbiBuZXh0VGljayhmbiwgYXJnMSwgYXJnMiwgYXJnMykge1xyXG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiY2FsbGJhY2tcIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcclxuICB9XHJcbiAgdmFyIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XHJcbiAgdmFyIGFyZ3MsIGk7XHJcbiAgc3dpdGNoIChsZW4pIHtcclxuICBjYXNlIDA6XHJcbiAgY2FzZSAxOlxyXG4gICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZm4pO1xyXG4gIGNhc2UgMjpcclxuICAgIHJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uIGFmdGVyVGlja09uZSgpIHtcclxuICAgICAgZm4uY2FsbChudWxsLCBhcmcxKTtcclxuICAgIH0pO1xyXG4gIGNhc2UgMzpcclxuICAgIHJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uIGFmdGVyVGlja1R3bygpIHtcclxuICAgICAgZm4uY2FsbChudWxsLCBhcmcxLCBhcmcyKTtcclxuICAgIH0pO1xyXG4gIGNhc2UgNDpcclxuICAgIHJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uIGFmdGVyVGlja1RocmVlKCkge1xyXG4gICAgICBmbi5jYWxsKG51bGwsIGFyZzEsIGFyZzIsIGFyZzMpO1xyXG4gICAgfSk7XHJcbiAgZGVmYXVsdDpcclxuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XHJcbiAgICBpID0gMDtcclxuICAgIHdoaWxlIChpIDwgYXJncy5sZW5ndGgpIHtcclxuICAgICAgYXJnc1tpKytdID0gYXJndW1lbnRzW2ldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gYWZ0ZXJUaWNrKCkge1xyXG4gICAgICBmbi5hcHBseShudWxsLCBhcmdzKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==