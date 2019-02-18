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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvb2F1dGgtc2lnbi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxhQUFhLG1CQUFPLENBQUMsb0JBQVE7O0FBRTdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixnQkFBZ0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIscUJBQXFCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQyIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLm9hdXRoLXNpZ24uODE3NDZlZGU3YTQ1Yzg5ZmFhMGYuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcblxuZnVuY3Rpb24gc2hhIChrZXksIGJvZHksIGFsZ29yaXRobSkge1xuICByZXR1cm4gY3J5cHRvLmNyZWF0ZUhtYWMoYWxnb3JpdGhtLCBrZXkpLnVwZGF0ZShib2R5KS5kaWdlc3QoJ2Jhc2U2NCcpXG59XG5cbmZ1bmN0aW9uIHJzYSAoa2V5LCBib2R5KSB7XG4gIHJldHVybiBjcnlwdG8uY3JlYXRlU2lnbignUlNBLVNIQTEnKS51cGRhdGUoYm9keSkuc2lnbihrZXksICdiYXNlNjQnKVxufVxuXG5mdW5jdGlvbiByZmMzOTg2IChzdHIpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHIpXG4gICAgLnJlcGxhY2UoLyEvZywnJTIxJylcbiAgICAucmVwbGFjZSgvXFwqL2csJyUyQScpXG4gICAgLnJlcGxhY2UoL1xcKC9nLCclMjgnKVxuICAgIC5yZXBsYWNlKC9cXCkvZywnJTI5JylcbiAgICAucmVwbGFjZSgvJy9nLCclMjcnKVxufVxuXG4vLyBNYXBzIG9iamVjdCB0byBiaS1kaW1lbnNpb25hbCBhcnJheVxuLy8gQ29udmVydHMgeyBmb286ICdBJywgYmFyOiBbICdiJywgJ0InIF19IHRvXG4vLyBbIFsnZm9vJywgJ0EnXSwgWydiYXInLCAnYiddLCBbJ2JhcicsICdCJ10gXVxuZnVuY3Rpb24gbWFwIChvYmopIHtcbiAgdmFyIGtleSwgdmFsLCBhcnIgPSBbXVxuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICB2YWwgPSBvYmpba2V5XVxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKylcbiAgICAgICAgYXJyLnB1c2goW2tleSwgdmFsW2ldXSlcbiAgICBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JylcbiAgICAgIGZvciAodmFyIHByb3AgaW4gdmFsKVxuICAgICAgICBhcnIucHVzaChba2V5ICsgJ1snICsgcHJvcCArICddJywgdmFsW3Byb3BdXSlcbiAgICBlbHNlXG4gICAgICBhcnIucHVzaChba2V5LCB2YWxdKVxuICB9XG4gIHJldHVybiBhcnJcbn1cblxuLy8gQ29tcGFyZSBmdW5jdGlvbiBmb3Igc29ydFxuZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICByZXR1cm4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDBcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVCYXNlIChodHRwTWV0aG9kLCBiYXNlX3VyaSwgcGFyYW1zKSB7XG4gIC8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2Rldi50d2l0dGVyLmNvbS9kb2NzL2F1dGgvb2F1dGggYW5kIFxuICAvLyBodHRwczovL2Rldi50d2l0dGVyLmNvbS9kb2NzL2F1dGgvY3JlYXRpbmctc2lnbmF0dXJlXG5cbiAgLy8gUGFyYW1ldGVyIG5vcm1hbGl6YXRpb25cbiAgLy8gaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNTg0OSNzZWN0aW9uLTMuNC4xLjMuMlxuICB2YXIgbm9ybWFsaXplZCA9IG1hcChwYXJhbXMpXG4gIC8vIDEuICBGaXJzdCwgdGhlIG5hbWUgYW5kIHZhbHVlIG9mIGVhY2ggcGFyYW1ldGVyIGFyZSBlbmNvZGVkXG4gIC5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICByZXR1cm4gWyByZmMzOTg2KHBbMF0pLCByZmMzOTg2KHBbMV0gfHwgJycpIF1cbiAgfSlcbiAgLy8gMi4gIFRoZSBwYXJhbWV0ZXJzIGFyZSBzb3J0ZWQgYnkgbmFtZSwgdXNpbmcgYXNjZW5kaW5nIGJ5dGUgdmFsdWVcbiAgLy8gICAgIG9yZGVyaW5nLiAgSWYgdHdvIG9yIG1vcmUgcGFyYW1ldGVycyBzaGFyZSB0aGUgc2FtZSBuYW1lLCB0aGV5XG4gIC8vICAgICBhcmUgc29ydGVkIGJ5IHRoZWlyIHZhbHVlLlxuICAuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBjb21wYXJlKGFbMF0sIGJbMF0pIHx8IGNvbXBhcmUoYVsxXSwgYlsxXSlcbiAgfSlcbiAgLy8gMy4gIFRoZSBuYW1lIG9mIGVhY2ggcGFyYW1ldGVyIGlzIGNvbmNhdGVuYXRlZCB0byBpdHMgY29ycmVzcG9uZGluZ1xuICAvLyAgICAgdmFsdWUgdXNpbmcgYW4gXCI9XCIgY2hhcmFjdGVyIChBU0NJSSBjb2RlIDYxKSBhcyBhIHNlcGFyYXRvciwgZXZlblxuICAvLyAgICAgaWYgdGhlIHZhbHVlIGlzIGVtcHR5LlxuICAubWFwKGZ1bmN0aW9uIChwKSB7IHJldHVybiBwLmpvaW4oJz0nKSB9KVxuICAgLy8gNC4gIFRoZSBzb3J0ZWQgbmFtZS92YWx1ZSBwYWlycyBhcmUgY29uY2F0ZW5hdGVkIHRvZ2V0aGVyIGludG8gYVxuICAgLy8gICAgIHNpbmdsZSBzdHJpbmcgYnkgdXNpbmcgYW4gXCImXCIgY2hhcmFjdGVyIChBU0NJSSBjb2RlIDM4KSBhc1xuICAgLy8gICAgIHNlcGFyYXRvci5cbiAgLmpvaW4oJyYnKVxuXG4gIHZhciBiYXNlID0gW1xuICAgIHJmYzM5ODYoaHR0cE1ldGhvZCA/IGh0dHBNZXRob2QudG9VcHBlckNhc2UoKSA6ICdHRVQnKSxcbiAgICByZmMzOTg2KGJhc2VfdXJpKSxcbiAgICByZmMzOTg2KG5vcm1hbGl6ZWQpXG4gIF0uam9pbignJicpXG5cbiAgcmV0dXJuIGJhc2Vcbn1cblxuZnVuY3Rpb24gaG1hY3NpZ24gKGh0dHBNZXRob2QsIGJhc2VfdXJpLCBwYXJhbXMsIGNvbnN1bWVyX3NlY3JldCwgdG9rZW5fc2VjcmV0KSB7XG4gIHZhciBiYXNlID0gZ2VuZXJhdGVCYXNlKGh0dHBNZXRob2QsIGJhc2VfdXJpLCBwYXJhbXMpXG4gIHZhciBrZXkgPSBbXG4gICAgY29uc3VtZXJfc2VjcmV0IHx8ICcnLFxuICAgIHRva2VuX3NlY3JldCB8fCAnJ1xuICBdLm1hcChyZmMzOTg2KS5qb2luKCcmJylcblxuICByZXR1cm4gc2hhKGtleSwgYmFzZSwgJ3NoYTEnKVxufVxuXG5mdW5jdGlvbiBobWFjc2lnbjI1NiAoaHR0cE1ldGhvZCwgYmFzZV91cmksIHBhcmFtcywgY29uc3VtZXJfc2VjcmV0LCB0b2tlbl9zZWNyZXQpIHtcbiAgdmFyIGJhc2UgPSBnZW5lcmF0ZUJhc2UoaHR0cE1ldGhvZCwgYmFzZV91cmksIHBhcmFtcylcbiAgdmFyIGtleSA9IFtcbiAgICBjb25zdW1lcl9zZWNyZXQgfHwgJycsXG4gICAgdG9rZW5fc2VjcmV0IHx8ICcnXG4gIF0ubWFwKHJmYzM5ODYpLmpvaW4oJyYnKVxuXG4gIHJldHVybiBzaGEoa2V5LCBiYXNlLCAnc2hhMjU2Jylcbn1cblxuZnVuY3Rpb24gcnNhc2lnbiAoaHR0cE1ldGhvZCwgYmFzZV91cmksIHBhcmFtcywgcHJpdmF0ZV9rZXksIHRva2VuX3NlY3JldCkge1xuICB2YXIgYmFzZSA9IGdlbmVyYXRlQmFzZShodHRwTWV0aG9kLCBiYXNlX3VyaSwgcGFyYW1zKVxuICB2YXIga2V5ID0gcHJpdmF0ZV9rZXkgfHwgJydcblxuICByZXR1cm4gcnNhKGtleSwgYmFzZSlcbn1cblxuZnVuY3Rpb24gcGxhaW50ZXh0IChjb25zdW1lcl9zZWNyZXQsIHRva2VuX3NlY3JldCkge1xuICB2YXIga2V5ID0gW1xuICAgIGNvbnN1bWVyX3NlY3JldCB8fCAnJyxcbiAgICB0b2tlbl9zZWNyZXQgfHwgJydcbiAgXS5tYXAocmZjMzk4Nikuam9pbignJicpXG5cbiAgcmV0dXJuIGtleVxufVxuXG5mdW5jdGlvbiBzaWduIChzaWduTWV0aG9kLCBodHRwTWV0aG9kLCBiYXNlX3VyaSwgcGFyYW1zLCBjb25zdW1lcl9zZWNyZXQsIHRva2VuX3NlY3JldCkge1xuICB2YXIgbWV0aG9kXG4gIHZhciBza2lwQXJncyA9IDFcblxuICBzd2l0Y2ggKHNpZ25NZXRob2QpIHtcbiAgICBjYXNlICdSU0EtU0hBMSc6XG4gICAgICBtZXRob2QgPSByc2FzaWduXG4gICAgICBicmVha1xuICAgIGNhc2UgJ0hNQUMtU0hBMSc6XG4gICAgICBtZXRob2QgPSBobWFjc2lnblxuICAgICAgYnJlYWtcbiAgICBjYXNlICdITUFDLVNIQTI1Nic6XG4gICAgICBtZXRob2QgPSBobWFjc2lnbjI1NlxuICAgICAgYnJlYWtcbiAgICBjYXNlICdQTEFJTlRFWFQnOlxuICAgICAgbWV0aG9kID0gcGxhaW50ZXh0XG4gICAgICBza2lwQXJncyA9IDRcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgdGhyb3cgbmV3IEVycm9yKCdTaWduYXR1cmUgbWV0aG9kIG5vdCBzdXBwb3J0ZWQ6ICcgKyBzaWduTWV0aG9kKVxuICB9XG5cbiAgcmV0dXJuIG1ldGhvZC5hcHBseShudWxsLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgc2tpcEFyZ3MpKVxufVxuXG5leHBvcnRzLmhtYWNzaWduID0gaG1hY3NpZ25cbmV4cG9ydHMuaG1hY3NpZ24yNTYgPSBobWFjc2lnbjI1NlxuZXhwb3J0cy5yc2FzaWduID0gcnNhc2lnblxuZXhwb3J0cy5wbGFpbnRleHQgPSBwbGFpbnRleHRcbmV4cG9ydHMuc2lnbiA9IHNpZ25cbmV4cG9ydHMucmZjMzk4NiA9IHJmYzM5ODZcbmV4cG9ydHMuZ2VuZXJhdGVCYXNlID0gZ2VuZXJhdGVCYXNlIl0sInNvdXJjZVJvb3QiOiIifQ==