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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaXMtdHlwZWRhcnJheS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5pcy10eXBlZGFycmF5LjZjNzhmMjI1MWFiMzk2Y2JiMWU0LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgICAgICA9IGlzVHlwZWRBcnJheVxyXG5pc1R5cGVkQXJyYXkuc3RyaWN0ID0gaXNTdHJpY3RUeXBlZEFycmF5XHJcbmlzVHlwZWRBcnJheS5sb29zZSAgPSBpc0xvb3NlVHlwZWRBcnJheVxyXG5cclxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xyXG52YXIgbmFtZXMgPSB7XHJcbiAgICAnW29iamVjdCBJbnQ4QXJyYXldJzogdHJ1ZVxyXG4gICwgJ1tvYmplY3QgSW50MTZBcnJheV0nOiB0cnVlXHJcbiAgLCAnW29iamVjdCBJbnQzMkFycmF5XSc6IHRydWVcclxuICAsICdbb2JqZWN0IFVpbnQ4QXJyYXldJzogdHJ1ZVxyXG4gICwgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJzogdHJ1ZVxyXG4gICwgJ1tvYmplY3QgVWludDE2QXJyYXldJzogdHJ1ZVxyXG4gICwgJ1tvYmplY3QgVWludDMyQXJyYXldJzogdHJ1ZVxyXG4gICwgJ1tvYmplY3QgRmxvYXQzMkFycmF5XSc6IHRydWVcclxuICAsICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nOiB0cnVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzVHlwZWRBcnJheShhcnIpIHtcclxuICByZXR1cm4gKFxyXG4gICAgICAgaXNTdHJpY3RUeXBlZEFycmF5KGFycilcclxuICAgIHx8IGlzTG9vc2VUeXBlZEFycmF5KGFycilcclxuICApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzU3RyaWN0VHlwZWRBcnJheShhcnIpIHtcclxuICByZXR1cm4gKFxyXG4gICAgICAgYXJyIGluc3RhbmNlb2YgSW50OEFycmF5XHJcbiAgICB8fCBhcnIgaW5zdGFuY2VvZiBJbnQxNkFycmF5XHJcbiAgICB8fCBhcnIgaW5zdGFuY2VvZiBJbnQzMkFycmF5XHJcbiAgICB8fCBhcnIgaW5zdGFuY2VvZiBVaW50OEFycmF5XHJcbiAgICB8fCBhcnIgaW5zdGFuY2VvZiBVaW50OENsYW1wZWRBcnJheVxyXG4gICAgfHwgYXJyIGluc3RhbmNlb2YgVWludDE2QXJyYXlcclxuICAgIHx8IGFyciBpbnN0YW5jZW9mIFVpbnQzMkFycmF5XHJcbiAgICB8fCBhcnIgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXlcclxuICAgIHx8IGFyciBpbnN0YW5jZW9mIEZsb2F0NjRBcnJheVxyXG4gIClcclxufVxyXG5cclxuZnVuY3Rpb24gaXNMb29zZVR5cGVkQXJyYXkoYXJyKSB7XHJcbiAgcmV0dXJuIG5hbWVzW3RvU3RyaW5nLmNhbGwoYXJyKV1cclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9