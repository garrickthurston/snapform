(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.https-browserify"],{

/***/ "JPgR":
/*!************************************************!*\
  !*** ./node_modules/https-browserify/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var http = __webpack_require__(/*! http */ "lJCZ")
var url = __webpack_require__(/*! url */ "CxY0")

var https = module.exports

for (var key in http) {
  if (http.hasOwnProperty(key)) https[key] = http[key]
}

https.request = function (params, cb) {
  params = validateParams(params)
  return http.request.call(this, params, cb)
}

https.get = function (params, cb) {
  params = validateParams(params)
  return http.get.call(this, params, cb)
}

function validateParams (params) {
  if (typeof params === 'string') {
    params = url.parse(params)
  }
  if (!params.protocol) {
    params.protocol = 'https:'
  }
  if (params.protocol !== 'https:') {
    throw new Error('Protocol "' + params.protocol + '" not supported. Expected "https:"')
  }
  return params
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaHR0cHMtYnJvd3NlcmlmeS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxXQUFXLG1CQUFPLENBQUMsa0JBQU07QUFDekIsVUFBVSxtQkFBTyxDQUFDLGlCQUFLOztBQUV2Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuaHR0cHMtYnJvd3NlcmlmeS5kMDkzNGJmODA0ZmQyMjQwYTNlNC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBodHRwID0gcmVxdWlyZSgnaHR0cCcpXHJcbnZhciB1cmwgPSByZXF1aXJlKCd1cmwnKVxyXG5cclxudmFyIGh0dHBzID0gbW9kdWxlLmV4cG9ydHNcclxuXHJcbmZvciAodmFyIGtleSBpbiBodHRwKSB7XHJcbiAgaWYgKGh0dHAuaGFzT3duUHJvcGVydHkoa2V5KSkgaHR0cHNba2V5XSA9IGh0dHBba2V5XVxyXG59XHJcblxyXG5odHRwcy5yZXF1ZXN0ID0gZnVuY3Rpb24gKHBhcmFtcywgY2IpIHtcclxuICBwYXJhbXMgPSB2YWxpZGF0ZVBhcmFtcyhwYXJhbXMpXHJcbiAgcmV0dXJuIGh0dHAucmVxdWVzdC5jYWxsKHRoaXMsIHBhcmFtcywgY2IpXHJcbn1cclxuXHJcbmh0dHBzLmdldCA9IGZ1bmN0aW9uIChwYXJhbXMsIGNiKSB7XHJcbiAgcGFyYW1zID0gdmFsaWRhdGVQYXJhbXMocGFyYW1zKVxyXG4gIHJldHVybiBodHRwLmdldC5jYWxsKHRoaXMsIHBhcmFtcywgY2IpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlUGFyYW1zIChwYXJhbXMpIHtcclxuICBpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ3N0cmluZycpIHtcclxuICAgIHBhcmFtcyA9IHVybC5wYXJzZShwYXJhbXMpXHJcbiAgfVxyXG4gIGlmICghcGFyYW1zLnByb3RvY29sKSB7XHJcbiAgICBwYXJhbXMucHJvdG9jb2wgPSAnaHR0cHM6J1xyXG4gIH1cclxuICBpZiAocGFyYW1zLnByb3RvY29sICE9PSAnaHR0cHM6Jykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdQcm90b2NvbCBcIicgKyBwYXJhbXMucHJvdG9jb2wgKyAnXCIgbm90IHN1cHBvcnRlZC4gRXhwZWN0ZWQgXCJodHRwczpcIicpXHJcbiAgfVxyXG4gIHJldHVybiBwYXJhbXNcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9