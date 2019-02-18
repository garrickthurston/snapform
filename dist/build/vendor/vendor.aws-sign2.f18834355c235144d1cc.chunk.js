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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXdzLXNpZ24yL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixZQUFZLG1CQUFPLENBQUMsaUJBQUs7QUFDekI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLFNBQVM7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmF3cy1zaWduMi5mMTg4MzQzNTVjMjM1MTQ0ZDFjYy5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyohXG4gKiAgQ29weXJpZ2h0IDIwMTAgTGVhcm5Cb29zdCA8ZGV2QGxlYXJuYm9vc3QuY29tPlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICwgcGFyc2UgPSByZXF1aXJlKCd1cmwnKS5wYXJzZVxuICA7XG5cbi8qKlxuICogVmFsaWQga2V5cy5cbiAqL1xuXG52YXIga2V5cyA9IFxuICBbICdhY2wnXG4gICwgJ2xvY2F0aW9uJ1xuICAsICdsb2dnaW5nJ1xuICAsICdub3RpZmljYXRpb24nXG4gICwgJ3BhcnROdW1iZXInXG4gICwgJ3BvbGljeSdcbiAgLCAncmVxdWVzdFBheW1lbnQnXG4gICwgJ3RvcnJlbnQnXG4gICwgJ3VwbG9hZElkJ1xuICAsICd1cGxvYWRzJ1xuICAsICd2ZXJzaW9uSWQnXG4gICwgJ3ZlcnNpb25pbmcnXG4gICwgJ3ZlcnNpb25zJ1xuICAsICd3ZWJzaXRlJ1xuICBdXG5cbi8qKlxuICogUmV0dXJuIGFuIFwiQXV0aG9yaXphdGlvblwiIGhlYWRlciB2YWx1ZSB3aXRoIHRoZSBnaXZlbiBgb3B0aW9uc2BcbiAqIGluIHRoZSBmb3JtIG9mIFwiQVdTIDxrZXk+OjxzaWduYXR1cmU+XCJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gYXV0aG9yaXphdGlvbiAob3B0aW9ucykge1xuICByZXR1cm4gJ0FXUyAnICsgb3B0aW9ucy5rZXkgKyAnOicgKyBzaWduKG9wdGlvbnMpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXV0aG9yaXphdGlvblxubW9kdWxlLmV4cG9ydHMuYXV0aG9yaXphdGlvbiA9IGF1dGhvcml6YXRpb25cblxuLyoqXG4gKiBTaW1wbGUgSE1BQy1TSEExIFdyYXBwZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi8gXG5cbmZ1bmN0aW9uIGhtYWNTaGExIChvcHRpb25zKSB7XG4gIHJldHVybiBjcnlwdG8uY3JlYXRlSG1hYygnc2hhMScsIG9wdGlvbnMuc2VjcmV0KS51cGRhdGUob3B0aW9ucy5tZXNzYWdlKS5kaWdlc3QoJ2Jhc2U2NCcpXG59XG5cbm1vZHVsZS5leHBvcnRzLmhtYWNTaGExID0gaG1hY1NoYTFcblxuLyoqXG4gKiBDcmVhdGUgYSBiYXNlNjQgc2hhMSBITUFDIGZvciBgb3B0aW9uc2AuIFxuICogXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2lnbiAob3B0aW9ucykge1xuICBvcHRpb25zLm1lc3NhZ2UgPSBzdHJpbmdUb1NpZ24ob3B0aW9ucylcbiAgcmV0dXJuIGhtYWNTaGExKG9wdGlvbnMpXG59XG5tb2R1bGUuZXhwb3J0cy5zaWduID0gc2lnblxuXG4vKipcbiAqIENyZWF0ZSBhIGJhc2U2NCBzaGExIEhNQUMgZm9yIGBvcHRpb25zYC4gXG4gKlxuICogU3BlY2lmaWNhbGx5IHRvIGJlIHVzZWQgd2l0aCBTMyBwcmVzaWduZWQgVVJMc1xuICogXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2lnblF1ZXJ5IChvcHRpb25zKSB7XG4gIG9wdGlvbnMubWVzc2FnZSA9IHF1ZXJ5U3RyaW5nVG9TaWduKG9wdGlvbnMpXG4gIHJldHVybiBobWFjU2hhMShvcHRpb25zKVxufVxubW9kdWxlLmV4cG9ydHMuc2lnblF1ZXJ5PSBzaWduUXVlcnlcblxuLyoqXG4gKiBSZXR1cm4gYSBzdHJpbmcgZm9yIHNpZ24oKSB3aXRoIHRoZSBnaXZlbiBgb3B0aW9uc2AuXG4gKlxuICogU3BlYzpcbiAqIFxuICogICAgPHZlcmI+XFxuXG4gKiAgICA8bWQ1PlxcblxuICogICAgPGNvbnRlbnQtdHlwZT5cXG5cbiAqICAgIDxkYXRlPlxcblxuICogICAgW2hlYWRlcnNcXG5dXG4gKiAgICA8cmVzb3VyY2U+XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHN0cmluZ1RvU2lnbiAob3B0aW9ucykge1xuICB2YXIgaGVhZGVycyA9IG9wdGlvbnMuYW1hem9uSGVhZGVycyB8fCAnJ1xuICBpZiAoaGVhZGVycykgaGVhZGVycyArPSAnXFxuJ1xuICB2YXIgciA9IFxuICAgIFsgb3B0aW9ucy52ZXJiXG4gICAgLCBvcHRpb25zLm1kNVxuICAgICwgb3B0aW9ucy5jb250ZW50VHlwZVxuICAgICwgb3B0aW9ucy5kYXRlID8gb3B0aW9ucy5kYXRlLnRvVVRDU3RyaW5nKCkgOiAnJ1xuICAgICwgaGVhZGVycyArIG9wdGlvbnMucmVzb3VyY2VcbiAgICBdXG4gIHJldHVybiByLmpvaW4oJ1xcbicpXG59XG5tb2R1bGUuZXhwb3J0cy5zdHJpbmdUb1NpZ24gPSBzdHJpbmdUb1NpZ25cblxuLyoqXG4gKiBSZXR1cm4gYSBzdHJpbmcgZm9yIHNpZ24oKSB3aXRoIHRoZSBnaXZlbiBgb3B0aW9uc2AsIGJ1dCBpcyBtZWFudCBleGNsdXNpdmVseVxuICogZm9yIFMzIHByZXNpZ25lZCBVUkxzXG4gKlxuICogU3BlYzpcbiAqIFxuICogICAgPGRhdGU+XFxuXG4gKiAgICA8cmVzb3VyY2U+XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHF1ZXJ5U3RyaW5nVG9TaWduIChvcHRpb25zKXtcbiAgcmV0dXJuICdHRVRcXG5cXG5cXG4nICsgb3B0aW9ucy5kYXRlICsgJ1xcbicgKyBvcHRpb25zLnJlc291cmNlXG59XG5tb2R1bGUuZXhwb3J0cy5xdWVyeVN0cmluZ1RvU2lnbiA9IHF1ZXJ5U3RyaW5nVG9TaWduXG5cbi8qKlxuICogUGVyZm9ybSB0aGUgZm9sbG93aW5nOlxuICpcbiAqICAtIGlnbm9yZSBub24tYW1hem9uIGhlYWRlcnNcbiAqICAtIGxvd2VyY2FzZSBmaWVsZHNcbiAqICAtIHNvcnQgbGV4aWNvZ3JhcGhpY2FsbHlcbiAqICAtIHRyaW0gd2hpdGVzcGFjZSBiZXR3ZWVuIFwiOlwiXG4gKiAgLSBqb2luIHdpdGggbmV3bGluZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBjYW5vbmljYWxpemVIZWFkZXJzIChoZWFkZXJzKSB7XG4gIHZhciBidWYgPSBbXVxuICAgICwgZmllbGRzID0gT2JqZWN0LmtleXMoaGVhZGVycylcbiAgICA7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBmaWVsZHMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgZmllbGQgPSBmaWVsZHNbaV1cbiAgICAgICwgdmFsID0gaGVhZGVyc1tmaWVsZF1cbiAgICAgICwgZmllbGQgPSBmaWVsZC50b0xvd2VyQ2FzZSgpXG4gICAgICA7XG4gICAgaWYgKDAgIT09IGZpZWxkLmluZGV4T2YoJ3gtYW16JykpIGNvbnRpbnVlXG4gICAgYnVmLnB1c2goZmllbGQgKyAnOicgKyB2YWwpXG4gIH1cbiAgcmV0dXJuIGJ1Zi5zb3J0KCkuam9pbignXFxuJylcbn1cbm1vZHVsZS5leHBvcnRzLmNhbm9uaWNhbGl6ZUhlYWRlcnMgPSBjYW5vbmljYWxpemVIZWFkZXJzXG5cbi8qKlxuICogUGVyZm9ybSB0aGUgZm9sbG93aW5nOlxuICpcbiAqICAtIGlnbm9yZSBub24gc3ViLXJlc291cmNlc1xuICogIC0gc29ydCBsZXhpY29ncmFwaGljYWxseVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSByZXNvdXJjZVxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gY2Fub25pY2FsaXplUmVzb3VyY2UgKHJlc291cmNlKSB7XG4gIHZhciB1cmwgPSBwYXJzZShyZXNvdXJjZSwgdHJ1ZSlcbiAgICAsIHBhdGggPSB1cmwucGF0aG5hbWVcbiAgICAsIGJ1ZiA9IFtdXG4gICAgO1xuXG4gIE9iamVjdC5rZXlzKHVybC5xdWVyeSkuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xuICAgIGlmICghfmtleXMuaW5kZXhPZihrZXkpKSByZXR1cm5cbiAgICB2YXIgdmFsID0gJycgPT0gdXJsLnF1ZXJ5W2tleV0gPyAnJyA6ICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh1cmwucXVlcnlba2V5XSlcbiAgICBidWYucHVzaChrZXkgKyB2YWwpXG4gIH0pXG5cbiAgcmV0dXJuIHBhdGggKyAoYnVmLmxlbmd0aCA/ICc/JyArIGJ1Zi5zb3J0KCkuam9pbignJicpIDogJycpXG59XG5tb2R1bGUuZXhwb3J0cy5jYW5vbmljYWxpemVSZXNvdXJjZSA9IGNhbm9uaWNhbGl6ZVJlc291cmNlXG4iXSwic291cmNlUm9vdCI6IiJ9