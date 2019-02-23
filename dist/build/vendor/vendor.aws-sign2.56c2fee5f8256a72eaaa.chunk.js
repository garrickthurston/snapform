(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.aws-sign2"],{

/***/ "SOXU":
/*!*****************************************!*\
  !*** ./node_modules/aws-sign2/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


/*!
 *  Copyright 2010 LearnBoost <dev@learnboost.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Module dependencies.
 */

var crypto = __webpack_require__(/*! crypto */ "HEbw")
  , parse = __webpack_require__(/*! url */ "CxY0").parse
  ;

/**
 * Valid keys.
 */

var keys = 
  [ 'acl'
  , 'location'
  , 'logging'
  , 'notification'
  , 'partNumber'
  , 'policy'
  , 'requestPayment'
  , 'torrent'
  , 'uploadId'
  , 'uploads'
  , 'versionId'
  , 'versioning'
  , 'versions'
  , 'website'
  ]

/**
 * Return an "Authorization" header value with the given `options`
 * in the form of "AWS <key>:<signature>"
 *
 * @param {Object} options
 * @return {String}
 * @api private
 */

function authorization (options) {
  return 'AWS ' + options.key + ':' + sign(options)
}

module.exports = authorization
module.exports.authorization = authorization

/**
 * Simple HMAC-SHA1 Wrapper
 *
 * @param {Object} options
 * @return {String}
 * @api private
 */ 

function hmacSha1 (options) {
  return crypto.createHmac('sha1', options.secret).update(options.message).digest('base64')
}

module.exports.hmacSha1 = hmacSha1

/**
 * Create a base64 sha1 HMAC for `options`. 
 * 
 * @param {Object} options
 * @return {String}
 * @api private
 */

function sign (options) {
  options.message = stringToSign(options)
  return hmacSha1(options)
}
module.exports.sign = sign

/**
 * Create a base64 sha1 HMAC for `options`. 
 *
 * Specifically to be used with S3 presigned URLs
 * 
 * @param {Object} options
 * @return {String}
 * @api private
 */

function signQuery (options) {
  options.message = queryStringToSign(options)
  return hmacSha1(options)
}
module.exports.signQuery= signQuery

/**
 * Return a string for sign() with the given `options`.
 *
 * Spec:
 * 
 *    <verb>\n
 *    <md5>\n
 *    <content-type>\n
 *    <date>\n
 *    [headers\n]
 *    <resource>
 *
 * @param {Object} options
 * @return {String}
 * @api private
 */

function stringToSign (options) {
  var headers = options.amazonHeaders || ''
  if (headers) headers += '\n'
  var r = 
    [ options.verb
    , options.md5
    , options.contentType
    , options.date ? options.date.toUTCString() : ''
    , headers + options.resource
    ]
  return r.join('\n')
}
module.exports.stringToSign = stringToSign

/**
 * Return a string for sign() with the given `options`, but is meant exclusively
 * for S3 presigned URLs
 *
 * Spec:
 * 
 *    <date>\n
 *    <resource>
 *
 * @param {Object} options
 * @return {String}
 * @api private
 */

function queryStringToSign (options){
  return 'GET\n\n\n' + options.date + '\n' + options.resource
}
module.exports.queryStringToSign = queryStringToSign

/**
 * Perform the following:
 *
 *  - ignore non-amazon headers
 *  - lowercase fields
 *  - sort lexicographically
 *  - trim whitespace between ":"
 *  - join with newline
 *
 * @param {Object} headers
 * @return {String}
 * @api private
 */

function canonicalizeHeaders (headers) {
  var buf = []
    , fields = Object.keys(headers)
    ;
  for (var i = 0, len = fields.length; i < len; ++i) {
    var field = fields[i]
      , val = headers[field]
      , field = field.toLowerCase()
      ;
    if (0 !== field.indexOf('x-amz')) continue
    buf.push(field + ':' + val)
  }
  return buf.sort().join('\n')
}
module.exports.canonicalizeHeaders = canonicalizeHeaders

/**
 * Perform the following:
 *
 *  - ignore non sub-resources
 *  - sort lexicographically
 *
 * @param {String} resource
 * @return {String}
 * @api private
 */

function canonicalizeResource (resource) {
  var url = parse(resource, true)
    , path = url.pathname
    , buf = []
    ;

  Object.keys(url.query).forEach(function(key){
    if (!~keys.indexOf(key)) return
    var val = '' == url.query[key] ? '' : '=' + encodeURIComponent(url.query[key])
    buf.push(key + val)
  })

  return path + (buf.length ? '?' + buf.sort().join('&') : '')
}
module.exports.canonicalizeResource = canonicalizeResource


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXdzLXNpZ24yL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixZQUFZLG1CQUFPLENBQUMsaUJBQUs7QUFDekI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLFNBQVM7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmF3cy1zaWduMi41NmMyZmVlNWY4MjU2YTcyZWFhYS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiFcclxuICogIENvcHlyaWdodCAyMDEwIExlYXJuQm9vc3QgPGRldkBsZWFybmJvb3N0LmNvbT5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXHJcbiAqL1xyXG5cclxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXHJcbiAgLCBwYXJzZSA9IHJlcXVpcmUoJ3VybCcpLnBhcnNlXHJcbiAgO1xyXG5cclxuLyoqXHJcbiAqIFZhbGlkIGtleXMuXHJcbiAqL1xyXG5cclxudmFyIGtleXMgPSBcclxuICBbICdhY2wnXHJcbiAgLCAnbG9jYXRpb24nXHJcbiAgLCAnbG9nZ2luZydcclxuICAsICdub3RpZmljYXRpb24nXHJcbiAgLCAncGFydE51bWJlcidcclxuICAsICdwb2xpY3knXHJcbiAgLCAncmVxdWVzdFBheW1lbnQnXHJcbiAgLCAndG9ycmVudCdcclxuICAsICd1cGxvYWRJZCdcclxuICAsICd1cGxvYWRzJ1xyXG4gICwgJ3ZlcnNpb25JZCdcclxuICAsICd2ZXJzaW9uaW5nJ1xyXG4gICwgJ3ZlcnNpb25zJ1xyXG4gICwgJ3dlYnNpdGUnXHJcbiAgXVxyXG5cclxuLyoqXHJcbiAqIFJldHVybiBhbiBcIkF1dGhvcml6YXRpb25cIiBoZWFkZXIgdmFsdWUgd2l0aCB0aGUgZ2l2ZW4gYG9wdGlvbnNgXHJcbiAqIGluIHRoZSBmb3JtIG9mIFwiQVdTIDxrZXk+OjxzaWduYXR1cmU+XCJcclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKiBAYXBpIHByaXZhdGVcclxuICovXHJcblxyXG5mdW5jdGlvbiBhdXRob3JpemF0aW9uIChvcHRpb25zKSB7XHJcbiAgcmV0dXJuICdBV1MgJyArIG9wdGlvbnMua2V5ICsgJzonICsgc2lnbihvcHRpb25zKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGF1dGhvcml6YXRpb25cclxubW9kdWxlLmV4cG9ydHMuYXV0aG9yaXphdGlvbiA9IGF1dGhvcml6YXRpb25cclxuXHJcbi8qKlxyXG4gKiBTaW1wbGUgSE1BQy1TSEExIFdyYXBwZXJcclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKiBAYXBpIHByaXZhdGVcclxuICovIFxyXG5cclxuZnVuY3Rpb24gaG1hY1NoYTEgKG9wdGlvbnMpIHtcclxuICByZXR1cm4gY3J5cHRvLmNyZWF0ZUhtYWMoJ3NoYTEnLCBvcHRpb25zLnNlY3JldCkudXBkYXRlKG9wdGlvbnMubWVzc2FnZSkuZGlnZXN0KCdiYXNlNjQnKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5obWFjU2hhMSA9IGhtYWNTaGExXHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgYmFzZTY0IHNoYTEgSE1BQyBmb3IgYG9wdGlvbnNgLiBcclxuICogXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICogQGFwaSBwcml2YXRlXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gc2lnbiAob3B0aW9ucykge1xyXG4gIG9wdGlvbnMubWVzc2FnZSA9IHN0cmluZ1RvU2lnbihvcHRpb25zKVxyXG4gIHJldHVybiBobWFjU2hhMShvcHRpb25zKVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLnNpZ24gPSBzaWduXHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgYmFzZTY0IHNoYTEgSE1BQyBmb3IgYG9wdGlvbnNgLiBcclxuICpcclxuICogU3BlY2lmaWNhbGx5IHRvIGJlIHVzZWQgd2l0aCBTMyBwcmVzaWduZWQgVVJMc1xyXG4gKiBcclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKiBAYXBpIHByaXZhdGVcclxuICovXHJcblxyXG5mdW5jdGlvbiBzaWduUXVlcnkgKG9wdGlvbnMpIHtcclxuICBvcHRpb25zLm1lc3NhZ2UgPSBxdWVyeVN0cmluZ1RvU2lnbihvcHRpb25zKVxyXG4gIHJldHVybiBobWFjU2hhMShvcHRpb25zKVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLnNpZ25RdWVyeT0gc2lnblF1ZXJ5XHJcblxyXG4vKipcclxuICogUmV0dXJuIGEgc3RyaW5nIGZvciBzaWduKCkgd2l0aCB0aGUgZ2l2ZW4gYG9wdGlvbnNgLlxyXG4gKlxyXG4gKiBTcGVjOlxyXG4gKiBcclxuICogICAgPHZlcmI+XFxuXHJcbiAqICAgIDxtZDU+XFxuXHJcbiAqICAgIDxjb250ZW50LXR5cGU+XFxuXHJcbiAqICAgIDxkYXRlPlxcblxyXG4gKiAgICBbaGVhZGVyc1xcbl1cclxuICogICAgPHJlc291cmNlPlxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqIEBhcGkgcHJpdmF0ZVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIHN0cmluZ1RvU2lnbiAob3B0aW9ucykge1xyXG4gIHZhciBoZWFkZXJzID0gb3B0aW9ucy5hbWF6b25IZWFkZXJzIHx8ICcnXHJcbiAgaWYgKGhlYWRlcnMpIGhlYWRlcnMgKz0gJ1xcbidcclxuICB2YXIgciA9IFxyXG4gICAgWyBvcHRpb25zLnZlcmJcclxuICAgICwgb3B0aW9ucy5tZDVcclxuICAgICwgb3B0aW9ucy5jb250ZW50VHlwZVxyXG4gICAgLCBvcHRpb25zLmRhdGUgPyBvcHRpb25zLmRhdGUudG9VVENTdHJpbmcoKSA6ICcnXHJcbiAgICAsIGhlYWRlcnMgKyBvcHRpb25zLnJlc291cmNlXHJcbiAgICBdXHJcbiAgcmV0dXJuIHIuam9pbignXFxuJylcclxufVxyXG5tb2R1bGUuZXhwb3J0cy5zdHJpbmdUb1NpZ24gPSBzdHJpbmdUb1NpZ25cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgZm9yIHNpZ24oKSB3aXRoIHRoZSBnaXZlbiBgb3B0aW9uc2AsIGJ1dCBpcyBtZWFudCBleGNsdXNpdmVseVxyXG4gKiBmb3IgUzMgcHJlc2lnbmVkIFVSTHNcclxuICpcclxuICogU3BlYzpcclxuICogXHJcbiAqICAgIDxkYXRlPlxcblxyXG4gKiAgICA8cmVzb3VyY2U+XHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICogQGFwaSBwcml2YXRlXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gcXVlcnlTdHJpbmdUb1NpZ24gKG9wdGlvbnMpe1xyXG4gIHJldHVybiAnR0VUXFxuXFxuXFxuJyArIG9wdGlvbnMuZGF0ZSArICdcXG4nICsgb3B0aW9ucy5yZXNvdXJjZVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLnF1ZXJ5U3RyaW5nVG9TaWduID0gcXVlcnlTdHJpbmdUb1NpZ25cclxuXHJcbi8qKlxyXG4gKiBQZXJmb3JtIHRoZSBmb2xsb3dpbmc6XHJcbiAqXHJcbiAqICAtIGlnbm9yZSBub24tYW1hem9uIGhlYWRlcnNcclxuICogIC0gbG93ZXJjYXNlIGZpZWxkc1xyXG4gKiAgLSBzb3J0IGxleGljb2dyYXBoaWNhbGx5XHJcbiAqICAtIHRyaW0gd2hpdGVzcGFjZSBiZXR3ZWVuIFwiOlwiXHJcbiAqICAtIGpvaW4gd2l0aCBuZXdsaW5lXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICogQGFwaSBwcml2YXRlXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gY2Fub25pY2FsaXplSGVhZGVycyAoaGVhZGVycykge1xyXG4gIHZhciBidWYgPSBbXVxyXG4gICAgLCBmaWVsZHMgPSBPYmplY3Qua2V5cyhoZWFkZXJzKVxyXG4gICAgO1xyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBmaWVsZHMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgIHZhciBmaWVsZCA9IGZpZWxkc1tpXVxyXG4gICAgICAsIHZhbCA9IGhlYWRlcnNbZmllbGRdXHJcbiAgICAgICwgZmllbGQgPSBmaWVsZC50b0xvd2VyQ2FzZSgpXHJcbiAgICAgIDtcclxuICAgIGlmICgwICE9PSBmaWVsZC5pbmRleE9mKCd4LWFteicpKSBjb250aW51ZVxyXG4gICAgYnVmLnB1c2goZmllbGQgKyAnOicgKyB2YWwpXHJcbiAgfVxyXG4gIHJldHVybiBidWYuc29ydCgpLmpvaW4oJ1xcbicpXHJcbn1cclxubW9kdWxlLmV4cG9ydHMuY2Fub25pY2FsaXplSGVhZGVycyA9IGNhbm9uaWNhbGl6ZUhlYWRlcnNcclxuXHJcbi8qKlxyXG4gKiBQZXJmb3JtIHRoZSBmb2xsb3dpbmc6XHJcbiAqXHJcbiAqICAtIGlnbm9yZSBub24gc3ViLXJlc291cmNlc1xyXG4gKiAgLSBzb3J0IGxleGljb2dyYXBoaWNhbGx5XHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSByZXNvdXJjZVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqIEBhcGkgcHJpdmF0ZVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGNhbm9uaWNhbGl6ZVJlc291cmNlIChyZXNvdXJjZSkge1xyXG4gIHZhciB1cmwgPSBwYXJzZShyZXNvdXJjZSwgdHJ1ZSlcclxuICAgICwgcGF0aCA9IHVybC5wYXRobmFtZVxyXG4gICAgLCBidWYgPSBbXVxyXG4gICAgO1xyXG5cclxuICBPYmplY3Qua2V5cyh1cmwucXVlcnkpLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcclxuICAgIGlmICghfmtleXMuaW5kZXhPZihrZXkpKSByZXR1cm5cclxuICAgIHZhciB2YWwgPSAnJyA9PSB1cmwucXVlcnlba2V5XSA/ICcnIDogJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHVybC5xdWVyeVtrZXldKVxyXG4gICAgYnVmLnB1c2goa2V5ICsgdmFsKVxyXG4gIH0pXHJcblxyXG4gIHJldHVybiBwYXRoICsgKGJ1Zi5sZW5ndGggPyAnPycgKyBidWYuc29ydCgpLmpvaW4oJyYnKSA6ICcnKVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLmNhbm9uaWNhbGl6ZVJlc291cmNlID0gY2Fub25pY2FsaXplUmVzb3VyY2VcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==