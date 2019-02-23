(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.oauth-sign"],{

/***/ "UC7N":
/*!******************************************!*\
  !*** ./node_modules/oauth-sign/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var crypto = __webpack_require__(/*! crypto */ "HEbw")

function sha (key, body, algorithm) {
  return crypto.createHmac(algorithm, key).update(body).digest('base64')
}

function rsa (key, body) {
  return crypto.createSign('RSA-SHA1').update(body).sign(key, 'base64')
}

function rfc3986 (str) {
  return encodeURIComponent(str)
    .replace(/!/g,'%21')
    .replace(/\*/g,'%2A')
    .replace(/\(/g,'%28')
    .replace(/\)/g,'%29')
    .replace(/'/g,'%27')
}

// Maps object to bi-dimensional array
// Converts { foo: 'A', bar: [ 'b', 'B' ]} to
// [ ['foo', 'A'], ['bar', 'b'], ['bar', 'B'] ]
function map (obj) {
  var key, val, arr = []
  for (key in obj) {
    val = obj[key]
    if (Array.isArray(val))
      for (var i = 0; i < val.length; i++)
        arr.push([key, val[i]])
    else if (typeof val === 'object')
      for (var prop in val)
        arr.push([key + '[' + prop + ']', val[prop]])
    else
      arr.push([key, val])
  }
  return arr
}

// Compare function for sort
function compare (a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}

function generateBase (httpMethod, base_uri, params) {
  // adapted from https://dev.twitter.com/docs/auth/oauth and 
  // https://dev.twitter.com/docs/auth/creating-signature

  // Parameter normalization
  // http://tools.ietf.org/html/rfc5849#section-3.4.1.3.2
  var normalized = map(params)
  // 1.  First, the name and value of each parameter are encoded
  .map(function (p) {
    return [ rfc3986(p[0]), rfc3986(p[1] || '') ]
  })
  // 2.  The parameters are sorted by name, using ascending byte value
  //     ordering.  If two or more parameters share the same name, they
  //     are sorted by their value.
  .sort(function (a, b) {
    return compare(a[0], b[0]) || compare(a[1], b[1])
  })
  // 3.  The name of each parameter is concatenated to its corresponding
  //     value using an "=" character (ASCII code 61) as a separator, even
  //     if the value is empty.
  .map(function (p) { return p.join('=') })
   // 4.  The sorted name/value pairs are concatenated together into a
   //     single string by using an "&" character (ASCII code 38) as
   //     separator.
  .join('&')

  var base = [
    rfc3986(httpMethod ? httpMethod.toUpperCase() : 'GET'),
    rfc3986(base_uri),
    rfc3986(normalized)
  ].join('&')

  return base
}

function hmacsign (httpMethod, base_uri, params, consumer_secret, token_secret) {
  var base = generateBase(httpMethod, base_uri, params)
  var key = [
    consumer_secret || '',
    token_secret || ''
  ].map(rfc3986).join('&')

  return sha(key, base, 'sha1')
}

function hmacsign256 (httpMethod, base_uri, params, consumer_secret, token_secret) {
  var base = generateBase(httpMethod, base_uri, params)
  var key = [
    consumer_secret || '',
    token_secret || ''
  ].map(rfc3986).join('&')

  return sha(key, base, 'sha256')
}

function rsasign (httpMethod, base_uri, params, private_key, token_secret) {
  var base = generateBase(httpMethod, base_uri, params)
  var key = private_key || ''

  return rsa(key, base)
}

function plaintext (consumer_secret, token_secret) {
  var key = [
    consumer_secret || '',
    token_secret || ''
  ].map(rfc3986).join('&')

  return key
}

function sign (signMethod, httpMethod, base_uri, params, consumer_secret, token_secret) {
  var method
  var skipArgs = 1

  switch (signMethod) {
    case 'RSA-SHA1':
      method = rsasign
      break
    case 'HMAC-SHA1':
      method = hmacsign
      break
    case 'HMAC-SHA256':
      method = hmacsign256
      break
    case 'PLAINTEXT':
      method = plaintext
      skipArgs = 4
      break
    default:
     throw new Error('Signature method not supported: ' + signMethod)
  }

  return method.apply(null, [].slice.call(arguments, skipArgs))
}

exports.hmacsign = hmacsign
exports.hmacsign256 = hmacsign256
exports.rsasign = rsasign
exports.plaintext = plaintext
exports.sign = sign
exports.rfc3986 = rfc3986
exports.generateBase = generateBase

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvb2F1dGgtc2lnbi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxhQUFhLG1CQUFPLENBQUMsb0JBQVE7O0FBRTdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixnQkFBZ0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIscUJBQXFCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQyIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLm9hdXRoLXNpZ24uMjZjMjM2ZWUwMzkxMzQ5Mjg4N2QuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcclxuXHJcbmZ1bmN0aW9uIHNoYSAoa2V5LCBib2R5LCBhbGdvcml0aG0pIHtcclxuICByZXR1cm4gY3J5cHRvLmNyZWF0ZUhtYWMoYWxnb3JpdGhtLCBrZXkpLnVwZGF0ZShib2R5KS5kaWdlc3QoJ2Jhc2U2NCcpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJzYSAoa2V5LCBib2R5KSB7XHJcbiAgcmV0dXJuIGNyeXB0by5jcmVhdGVTaWduKCdSU0EtU0hBMScpLnVwZGF0ZShib2R5KS5zaWduKGtleSwgJ2Jhc2U2NCcpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJmYzM5ODYgKHN0cikge1xyXG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyKVxyXG4gICAgLnJlcGxhY2UoLyEvZywnJTIxJylcclxuICAgIC5yZXBsYWNlKC9cXCovZywnJTJBJylcclxuICAgIC5yZXBsYWNlKC9cXCgvZywnJTI4JylcclxuICAgIC5yZXBsYWNlKC9cXCkvZywnJTI5JylcclxuICAgIC5yZXBsYWNlKC8nL2csJyUyNycpXHJcbn1cclxuXHJcbi8vIE1hcHMgb2JqZWN0IHRvIGJpLWRpbWVuc2lvbmFsIGFycmF5XHJcbi8vIENvbnZlcnRzIHsgZm9vOiAnQScsIGJhcjogWyAnYicsICdCJyBdfSB0b1xyXG4vLyBbIFsnZm9vJywgJ0EnXSwgWydiYXInLCAnYiddLCBbJ2JhcicsICdCJ10gXVxyXG5mdW5jdGlvbiBtYXAgKG9iaikge1xyXG4gIHZhciBrZXksIHZhbCwgYXJyID0gW11cclxuICBmb3IgKGtleSBpbiBvYmopIHtcclxuICAgIHZhbCA9IG9ialtrZXldXHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKVxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKylcclxuICAgICAgICBhcnIucHVzaChba2V5LCB2YWxbaV1dKVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpXHJcbiAgICAgIGZvciAodmFyIHByb3AgaW4gdmFsKVxyXG4gICAgICAgIGFyci5wdXNoKFtrZXkgKyAnWycgKyBwcm9wICsgJ10nLCB2YWxbcHJvcF1dKVxyXG4gICAgZWxzZVxyXG4gICAgICBhcnIucHVzaChba2V5LCB2YWxdKVxyXG4gIH1cclxuICByZXR1cm4gYXJyXHJcbn1cclxuXHJcbi8vIENvbXBhcmUgZnVuY3Rpb24gZm9yIHNvcnRcclxuZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xyXG4gIHJldHVybiBhID4gYiA/IDEgOiBhIDwgYiA/IC0xIDogMFxyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZUJhc2UgKGh0dHBNZXRob2QsIGJhc2VfdXJpLCBwYXJhbXMpIHtcclxuICAvLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9kZXYudHdpdHRlci5jb20vZG9jcy9hdXRoL29hdXRoIGFuZCBcclxuICAvLyBodHRwczovL2Rldi50d2l0dGVyLmNvbS9kb2NzL2F1dGgvY3JlYXRpbmctc2lnbmF0dXJlXHJcblxyXG4gIC8vIFBhcmFtZXRlciBub3JtYWxpemF0aW9uXHJcbiAgLy8gaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNTg0OSNzZWN0aW9uLTMuNC4xLjMuMlxyXG4gIHZhciBub3JtYWxpemVkID0gbWFwKHBhcmFtcylcclxuICAvLyAxLiAgRmlyc3QsIHRoZSBuYW1lIGFuZCB2YWx1ZSBvZiBlYWNoIHBhcmFtZXRlciBhcmUgZW5jb2RlZFxyXG4gIC5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgIHJldHVybiBbIHJmYzM5ODYocFswXSksIHJmYzM5ODYocFsxXSB8fCAnJykgXVxyXG4gIH0pXHJcbiAgLy8gMi4gIFRoZSBwYXJhbWV0ZXJzIGFyZSBzb3J0ZWQgYnkgbmFtZSwgdXNpbmcgYXNjZW5kaW5nIGJ5dGUgdmFsdWVcclxuICAvLyAgICAgb3JkZXJpbmcuICBJZiB0d28gb3IgbW9yZSBwYXJhbWV0ZXJzIHNoYXJlIHRoZSBzYW1lIG5hbWUsIHRoZXlcclxuICAvLyAgICAgYXJlIHNvcnRlZCBieSB0aGVpciB2YWx1ZS5cclxuICAuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgcmV0dXJuIGNvbXBhcmUoYVswXSwgYlswXSkgfHwgY29tcGFyZShhWzFdLCBiWzFdKVxyXG4gIH0pXHJcbiAgLy8gMy4gIFRoZSBuYW1lIG9mIGVhY2ggcGFyYW1ldGVyIGlzIGNvbmNhdGVuYXRlZCB0byBpdHMgY29ycmVzcG9uZGluZ1xyXG4gIC8vICAgICB2YWx1ZSB1c2luZyBhbiBcIj1cIiBjaGFyYWN0ZXIgKEFTQ0lJIGNvZGUgNjEpIGFzIGEgc2VwYXJhdG9yLCBldmVuXHJcbiAgLy8gICAgIGlmIHRoZSB2YWx1ZSBpcyBlbXB0eS5cclxuICAubWFwKGZ1bmN0aW9uIChwKSB7IHJldHVybiBwLmpvaW4oJz0nKSB9KVxyXG4gICAvLyA0LiAgVGhlIHNvcnRlZCBuYW1lL3ZhbHVlIHBhaXJzIGFyZSBjb25jYXRlbmF0ZWQgdG9nZXRoZXIgaW50byBhXHJcbiAgIC8vICAgICBzaW5nbGUgc3RyaW5nIGJ5IHVzaW5nIGFuIFwiJlwiIGNoYXJhY3RlciAoQVNDSUkgY29kZSAzOCkgYXNcclxuICAgLy8gICAgIHNlcGFyYXRvci5cclxuICAuam9pbignJicpXHJcblxyXG4gIHZhciBiYXNlID0gW1xyXG4gICAgcmZjMzk4NihodHRwTWV0aG9kID8gaHR0cE1ldGhvZC50b1VwcGVyQ2FzZSgpIDogJ0dFVCcpLFxyXG4gICAgcmZjMzk4NihiYXNlX3VyaSksXHJcbiAgICByZmMzOTg2KG5vcm1hbGl6ZWQpXHJcbiAgXS5qb2luKCcmJylcclxuXHJcbiAgcmV0dXJuIGJhc2VcclxufVxyXG5cclxuZnVuY3Rpb24gaG1hY3NpZ24gKGh0dHBNZXRob2QsIGJhc2VfdXJpLCBwYXJhbXMsIGNvbnN1bWVyX3NlY3JldCwgdG9rZW5fc2VjcmV0KSB7XHJcbiAgdmFyIGJhc2UgPSBnZW5lcmF0ZUJhc2UoaHR0cE1ldGhvZCwgYmFzZV91cmksIHBhcmFtcylcclxuICB2YXIga2V5ID0gW1xyXG4gICAgY29uc3VtZXJfc2VjcmV0IHx8ICcnLFxyXG4gICAgdG9rZW5fc2VjcmV0IHx8ICcnXHJcbiAgXS5tYXAocmZjMzk4Nikuam9pbignJicpXHJcblxyXG4gIHJldHVybiBzaGEoa2V5LCBiYXNlLCAnc2hhMScpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhtYWNzaWduMjU2IChodHRwTWV0aG9kLCBiYXNlX3VyaSwgcGFyYW1zLCBjb25zdW1lcl9zZWNyZXQsIHRva2VuX3NlY3JldCkge1xyXG4gIHZhciBiYXNlID0gZ2VuZXJhdGVCYXNlKGh0dHBNZXRob2QsIGJhc2VfdXJpLCBwYXJhbXMpXHJcbiAgdmFyIGtleSA9IFtcclxuICAgIGNvbnN1bWVyX3NlY3JldCB8fCAnJyxcclxuICAgIHRva2VuX3NlY3JldCB8fCAnJ1xyXG4gIF0ubWFwKHJmYzM5ODYpLmpvaW4oJyYnKVxyXG5cclxuICByZXR1cm4gc2hhKGtleSwgYmFzZSwgJ3NoYTI1NicpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJzYXNpZ24gKGh0dHBNZXRob2QsIGJhc2VfdXJpLCBwYXJhbXMsIHByaXZhdGVfa2V5LCB0b2tlbl9zZWNyZXQpIHtcclxuICB2YXIgYmFzZSA9IGdlbmVyYXRlQmFzZShodHRwTWV0aG9kLCBiYXNlX3VyaSwgcGFyYW1zKVxyXG4gIHZhciBrZXkgPSBwcml2YXRlX2tleSB8fCAnJ1xyXG5cclxuICByZXR1cm4gcnNhKGtleSwgYmFzZSlcclxufVxyXG5cclxuZnVuY3Rpb24gcGxhaW50ZXh0IChjb25zdW1lcl9zZWNyZXQsIHRva2VuX3NlY3JldCkge1xyXG4gIHZhciBrZXkgPSBbXHJcbiAgICBjb25zdW1lcl9zZWNyZXQgfHwgJycsXHJcbiAgICB0b2tlbl9zZWNyZXQgfHwgJydcclxuICBdLm1hcChyZmMzOTg2KS5qb2luKCcmJylcclxuXHJcbiAgcmV0dXJuIGtleVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaWduIChzaWduTWV0aG9kLCBodHRwTWV0aG9kLCBiYXNlX3VyaSwgcGFyYW1zLCBjb25zdW1lcl9zZWNyZXQsIHRva2VuX3NlY3JldCkge1xyXG4gIHZhciBtZXRob2RcclxuICB2YXIgc2tpcEFyZ3MgPSAxXHJcblxyXG4gIHN3aXRjaCAoc2lnbk1ldGhvZCkge1xyXG4gICAgY2FzZSAnUlNBLVNIQTEnOlxyXG4gICAgICBtZXRob2QgPSByc2FzaWduXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdITUFDLVNIQTEnOlxyXG4gICAgICBtZXRob2QgPSBobWFjc2lnblxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnSE1BQy1TSEEyNTYnOlxyXG4gICAgICBtZXRob2QgPSBobWFjc2lnbjI1NlxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnUExBSU5URVhUJzpcclxuICAgICAgbWV0aG9kID0gcGxhaW50ZXh0XHJcbiAgICAgIHNraXBBcmdzID0gNFxyXG4gICAgICBicmVha1xyXG4gICAgZGVmYXVsdDpcclxuICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NpZ25hdHVyZSBtZXRob2Qgbm90IHN1cHBvcnRlZDogJyArIHNpZ25NZXRob2QpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gbWV0aG9kLmFwcGx5KG51bGwsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCBza2lwQXJncykpXHJcbn1cclxuXHJcbmV4cG9ydHMuaG1hY3NpZ24gPSBobWFjc2lnblxyXG5leHBvcnRzLmhtYWNzaWduMjU2ID0gaG1hY3NpZ24yNTZcclxuZXhwb3J0cy5yc2FzaWduID0gcnNhc2lnblxyXG5leHBvcnRzLnBsYWludGV4dCA9IHBsYWludGV4dFxyXG5leHBvcnRzLnNpZ24gPSBzaWduXHJcbmV4cG9ydHMucmZjMzk4NiA9IHJmYzM5ODZcclxuZXhwb3J0cy5nZW5lcmF0ZUJhc2UgPSBnZW5lcmF0ZUJhc2UiXSwic291cmNlUm9vdCI6IiJ9