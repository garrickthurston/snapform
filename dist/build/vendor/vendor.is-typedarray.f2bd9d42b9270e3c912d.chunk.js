(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.is-typedarray"],{

/***/ "qXd6":
/*!*********************************************!*\
  !*** ./node_modules/is-typedarray/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports      = isTypedArray
isTypedArray.strict = isStrictTypedArray
isTypedArray.loose  = isLooseTypedArray

var toString = Object.prototype.toString
var names = {
    '[object Int8Array]': true
  , '[object Int16Array]': true
  , '[object Int32Array]': true
  , '[object Uint8Array]': true
  , '[object Uint8ClampedArray]': true
  , '[object Uint16Array]': true
  , '[object Uint32Array]': true
  , '[object Float32Array]': true
  , '[object Float64Array]': true
}

function isTypedArray(arr) {
  return (
       isStrictTypedArray(arr)
    || isLooseTypedArray(arr)
  )
}

function isStrictTypedArray(arr) {
  return (
       arr instanceof Int8Array
    || arr instanceof Int16Array
    || arr instanceof Int32Array
    || arr instanceof Uint8Array
    || arr instanceof Uint8ClampedArray
    || arr instanceof Uint16Array
    || arr instanceof Uint32Array
    || arr instanceof Float32Array
    || arr instanceof Float64Array
  )
}

function isLooseTypedArray(arr) {
  return names[toString.call(arr)]
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaXMtdHlwZWRhcnJheS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5pcy10eXBlZGFycmF5LmYyYmQ5ZDQyYjkyNzBlM2M5MTJkLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgICAgICA9IGlzVHlwZWRBcnJheVxuaXNUeXBlZEFycmF5LnN0cmljdCA9IGlzU3RyaWN0VHlwZWRBcnJheVxuaXNUeXBlZEFycmF5Lmxvb3NlICA9IGlzTG9vc2VUeXBlZEFycmF5XG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbnZhciBuYW1lcyA9IHtcbiAgICAnW29iamVjdCBJbnQ4QXJyYXldJzogdHJ1ZVxuICAsICdbb2JqZWN0IEludDE2QXJyYXldJzogdHJ1ZVxuICAsICdbb2JqZWN0IEludDMyQXJyYXldJzogdHJ1ZVxuICAsICdbb2JqZWN0IFVpbnQ4QXJyYXldJzogdHJ1ZVxuICAsICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XSc6IHRydWVcbiAgLCAnW29iamVjdCBVaW50MTZBcnJheV0nOiB0cnVlXG4gICwgJ1tvYmplY3QgVWludDMyQXJyYXldJzogdHJ1ZVxuICAsICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nOiB0cnVlXG4gICwgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSc6IHRydWVcbn1cblxuZnVuY3Rpb24gaXNUeXBlZEFycmF5KGFycikge1xuICByZXR1cm4gKFxuICAgICAgIGlzU3RyaWN0VHlwZWRBcnJheShhcnIpXG4gICAgfHwgaXNMb29zZVR5cGVkQXJyYXkoYXJyKVxuICApXG59XG5cbmZ1bmN0aW9uIGlzU3RyaWN0VHlwZWRBcnJheShhcnIpIHtcbiAgcmV0dXJuIChcbiAgICAgICBhcnIgaW5zdGFuY2VvZiBJbnQ4QXJyYXlcbiAgICB8fCBhcnIgaW5zdGFuY2VvZiBJbnQxNkFycmF5XG4gICAgfHwgYXJyIGluc3RhbmNlb2YgSW50MzJBcnJheVxuICAgIHx8IGFyciBpbnN0YW5jZW9mIFVpbnQ4QXJyYXlcbiAgICB8fCBhcnIgaW5zdGFuY2VvZiBVaW50OENsYW1wZWRBcnJheVxuICAgIHx8IGFyciBpbnN0YW5jZW9mIFVpbnQxNkFycmF5XG4gICAgfHwgYXJyIGluc3RhbmNlb2YgVWludDMyQXJyYXlcbiAgICB8fCBhcnIgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXlcbiAgICB8fCBhcnIgaW5zdGFuY2VvZiBGbG9hdDY0QXJyYXlcbiAgKVxufVxuXG5mdW5jdGlvbiBpc0xvb3NlVHlwZWRBcnJheShhcnIpIHtcbiAgcmV0dXJuIG5hbWVzW3RvU3RyaW5nLmNhbGwoYXJyKV1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=