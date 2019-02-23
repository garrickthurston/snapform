(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.request"],{

/***/ "C8Ws":
/*!*********************************************!*\
  !*** ./node_modules/request/lib/cookies.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tough = __webpack_require__(/*! tough-cookie */ "n+Wf")

var Cookie = tough.Cookie
var CookieJar = tough.CookieJar

exports.parse = function (str) {
  if (str && str.uri) {
    str = str.uri
  }
  if (typeof str !== 'string') {
    throw new Error('The cookie function only accepts STRING as param')
  }
  return Cookie.parse(str, {loose: true})
}

// Adapt the sometimes-Async api of tough.CookieJar to our requirements
function RequestJar (store) {
  var self = this
  self._jar = new CookieJar(store, {looseMode: true})
}
RequestJar.prototype.setCookie = function (cookieOrStr, uri, options) {
  var self = this
  return self._jar.setCookieSync(cookieOrStr, uri, options || {})
}
RequestJar.prototype.getCookieString = function (uri) {
  var self = this
  return self._jar.getCookieStringSync(uri)
}
RequestJar.prototype.getCookies = function (uri) {
  var self = this
  return self._jar.getCookiesSync(uri)
}

exports.jar = function (store) {
  return new RequestJar(store)
}


/***/ }),

/***/ "FwwX":
/*!*********************************************!*\
  !*** ./node_modules/request/lib/helpers.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate, process) {

var jsonSafeStringify = __webpack_require__(/*! json-stringify-safe */ "3/DG")
var crypto = __webpack_require__(/*! crypto */ "HEbw")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

var defer = typeof setImmediate === 'undefined'
  ? process.nextTick
  : setImmediate

function paramsHaveRequestBody (params) {
  return (
    params.body ||
    params.requestBodyStream ||
    (params.json && typeof params.json !== 'boolean') ||
    params.multipart
  )
}

function safeStringify (obj, replacer) {
  var ret
  try {
    ret = JSON.stringify(obj, replacer)
  } catch (e) {
    ret = jsonSafeStringify(obj, replacer)
  }
  return ret
}

function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

function isReadStream (rs) {
  return rs.readable && rs.path && rs.mode
}

function toBase64 (str) {
  return Buffer.from(str || '', 'utf8').toString('base64')
}

function copy (obj) {
  var o = {}
  Object.keys(obj).forEach(function (i) {
    o[i] = obj[i]
  })
  return o
}

function version () {
  var numbers = process.version.replace('v', '').split('.')
  return {
    major: parseInt(numbers[0], 10),
    minor: parseInt(numbers[1], 10),
    patch: parseInt(numbers[2], 10)
  }
}

exports.paramsHaveRequestBody = paramsHaveRequestBody
exports.safeStringify = safeStringify
exports.md5 = md5
exports.isReadStream = isReadStream
exports.toBase64 = toBase64
exports.copy = copy
exports.version = version
exports.defer = defer

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../timers-browserify/main.js */ "URgk").setImmediate, __webpack_require__(/*! ./../../process/browser.js */ "8oxB")))

/***/ }),

/***/ "Loi0":
/*!*************************************************!*\
  !*** ./node_modules/request/lib/querystring.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var qs = __webpack_require__(/*! qs */ "Qyje")
var querystring = __webpack_require__(/*! querystring */ "s4NR")

function Querystring (request) {
  this.request = request
  this.lib = null
  this.useQuerystring = null
  this.parseOptions = null
  this.stringifyOptions = null
}

Querystring.prototype.init = function (options) {
  if (this.lib) { return }

  this.useQuerystring = options.useQuerystring
  this.lib = (this.useQuerystring ? querystring : qs)

  this.parseOptions = options.qsParseOptions || {}
  this.stringifyOptions = options.qsStringifyOptions || {}
}

Querystring.prototype.stringify = function (obj) {
  return (this.useQuerystring)
    ? this.rfc3986(this.lib.stringify(obj,
      this.stringifyOptions.sep || null,
      this.stringifyOptions.eq || null,
      this.stringifyOptions))
    : this.lib.stringify(obj, this.stringifyOptions)
}

Querystring.prototype.parse = function (str) {
  return (this.useQuerystring)
    ? this.lib.parse(str,
      this.parseOptions.sep || null,
      this.parseOptions.eq || null,
      this.parseOptions)
    : this.lib.parse(str, this.parseOptions)
}

Querystring.prototype.rfc3986 = function (str) {
  return str.replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

Querystring.prototype.unescape = querystring.unescape

exports.Querystring = Querystring


/***/ }),

/***/ "MNzl":
/*!***************************************!*\
  !*** ./node_modules/request/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright 2010-2012 Mikeal Rogers
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.



var extend = __webpack_require__(/*! extend */ "6dBs")
var cookies = __webpack_require__(/*! ./lib/cookies */ "C8Ws")
var helpers = __webpack_require__(/*! ./lib/helpers */ "FwwX")

var paramsHaveRequestBody = helpers.paramsHaveRequestBody

// organize params for patch, post, put, head, del
function initParams (uri, options, callback) {
  if (typeof options === 'function') {
    callback = options
  }

  var params = {}
  if (typeof options === 'object') {
    extend(params, options, {uri: uri})
  } else if (typeof uri === 'string') {
    extend(params, {uri: uri})
  } else {
    extend(params, uri)
  }

  params.callback = callback || params.callback
  return params
}

function request (uri, options, callback) {
  if (typeof uri === 'undefined') {
    throw new Error('undefined is not a valid uri or options object.')
  }

  var params = initParams(uri, options, callback)

  if (params.method === 'HEAD' && paramsHaveRequestBody(params)) {
    throw new Error('HTTP HEAD requests MUST NOT include a request body.')
  }

  return new request.Request(params)
}

function verbFunc (verb) {
  var method = verb.toUpperCase()
  return function (uri, options, callback) {
    var params = initParams(uri, options, callback)
    params.method = method
    return request(params, params.callback)
  }
}

// define like this to please codeintel/intellisense IDEs
request.get = verbFunc('get')
request.head = verbFunc('head')
request.options = verbFunc('options')
request.post = verbFunc('post')
request.put = verbFunc('put')
request.patch = verbFunc('patch')
request.del = verbFunc('delete')
request['delete'] = verbFunc('delete')

request.jar = function (store) {
  return cookies.jar(store)
}

request.cookie = function (str) {
  return cookies.parse(str)
}

function wrapRequestMethod (method, options, requester, verb) {
  return function (uri, opts, callback) {
    var params = initParams(uri, opts, callback)

    var target = {}
    extend(true, target, options, params)

    target.pool = params.pool || options.pool

    if (verb) {
      target.method = verb.toUpperCase()
    }

    if (typeof requester === 'function') {
      method = requester
    }

    return method(target, target.callback)
  }
}

request.defaults = function (options, requester) {
  var self = this

  options = options || {}

  if (typeof options === 'function') {
    requester = options
    options = {}
  }

  var defaults = wrapRequestMethod(self, options, requester)

  var verbs = ['get', 'head', 'post', 'put', 'patch', 'del', 'delete']
  verbs.forEach(function (verb) {
    defaults[verb] = wrapRequestMethod(self[verb], options, requester, verb)
  })

  defaults.cookie = wrapRequestMethod(self.cookie, options, requester)
  defaults.jar = self.jar
  defaults.defaults = self.defaults
  return defaults
}

request.forever = function (agentOptions, optionsArg) {
  var options = {}
  if (optionsArg) {
    extend(options, optionsArg)
  }
  if (agentOptions) {
    options.agentOptions = agentOptions
  }

  options.forever = true
  return request.defaults(options)
}

// Exports

module.exports = request
request.Request = __webpack_require__(/*! ./request */ "O2Ve")
request.initParams = initParams

// Backwards compatibility for request.debug
Object.defineProperty(request, 'debug', {
  enumerable: true,
  get: function () {
    return request.Request.debug
  },
  set: function (debug) {
    request.Request.debug = debug
  }
})


/***/ }),

/***/ "NtJR":
/*!***********************************************!*\
  !*** ./node_modules/request/lib/multipart.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var uuid = __webpack_require__(/*! uuid/v4 */ "xk4V")
var CombinedStream = __webpack_require__(/*! combined-stream */ "X9DY")
var isstream = __webpack_require__(/*! isstream */ "jPMY")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

function Multipart (request) {
  this.request = request
  this.boundary = uuid()
  this.chunked = false
  this.body = null
}

Multipart.prototype.isChunked = function (options) {
  var self = this
  var chunked = false
  var parts = options.data || options

  if (!parts.forEach) {
    self.request.emit('error', new Error('Argument error, options.multipart.'))
  }

  if (options.chunked !== undefined) {
    chunked = options.chunked
  }

  if (self.request.getHeader('transfer-encoding') === 'chunked') {
    chunked = true
  }

  if (!chunked) {
    parts.forEach(function (part) {
      if (typeof part.body === 'undefined') {
        self.request.emit('error', new Error('Body attribute missing in multipart.'))
      }
      if (isstream(part.body)) {
        chunked = true
      }
    })
  }

  return chunked
}

Multipart.prototype.setHeaders = function (chunked) {
  var self = this

  if (chunked && !self.request.hasHeader('transfer-encoding')) {
    self.request.setHeader('transfer-encoding', 'chunked')
  }

  var header = self.request.getHeader('content-type')

  if (!header || header.indexOf('multipart') === -1) {
    self.request.setHeader('content-type', 'multipart/related; boundary=' + self.boundary)
  } else {
    if (header.indexOf('boundary') !== -1) {
      self.boundary = header.replace(/.*boundary=([^\s;]+).*/, '$1')
    } else {
      self.request.setHeader('content-type', header + '; boundary=' + self.boundary)
    }
  }
}

Multipart.prototype.build = function (parts, chunked) {
  var self = this
  var body = chunked ? new CombinedStream() : []

  function add (part) {
    if (typeof part === 'number') {
      part = part.toString()
    }
    return chunked ? body.append(part) : body.push(Buffer.from(part))
  }

  if (self.request.preambleCRLF) {
    add('\r\n')
  }

  parts.forEach(function (part) {
    var preamble = '--' + self.boundary + '\r\n'
    Object.keys(part).forEach(function (key) {
      if (key === 'body') { return }
      preamble += key + ': ' + part[key] + '\r\n'
    })
    preamble += '\r\n'
    add(preamble)
    add(part.body)
    add('\r\n')
  })
  add('--' + self.boundary + '--')

  if (self.request.postambleCRLF) {
    add('\r\n')
  }

  return body
}

Multipart.prototype.onRequest = function (options) {
  var self = this

  var chunked = self.isChunked(options)
  var parts = options.data || options

  self.setHeaders(chunked)
  self.chunked = chunked
  self.body = self.build(parts, chunked)
}

exports.Multipart = Multipart


/***/ }),

/***/ "O2Ve":
/*!*****************************************!*\
  !*** ./node_modules/request/request.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, console) {

var http = __webpack_require__(/*! http */ "lJCZ")
var https = __webpack_require__(/*! https */ "JPgR")
var url = __webpack_require__(/*! url */ "CxY0")
var util = __webpack_require__(/*! util */ "7tlc")
var stream = __webpack_require__(/*! stream */ "1IWx")
var zlib = __webpack_require__(/*! zlib */ "Rwuk")
var aws2 = __webpack_require__(/*! aws-sign2 */ "SOXU")
var aws4 = __webpack_require__(/*! aws4 */ "Zq4/")
var httpSignature = __webpack_require__(/*! http-signature */ "oRnL")
var mime = __webpack_require__(/*! mime-types */ "zB2q")
var caseless = __webpack_require__(/*! caseless */ "2loA")
var ForeverAgent = __webpack_require__(/*! forever-agent */ "ZfmE")
var FormData = __webpack_require__(/*! form-data */ "WjD0")
var extend = __webpack_require__(/*! extend */ "6dBs")
var isstream = __webpack_require__(/*! isstream */ "jPMY")
var isTypedArray = __webpack_require__(/*! is-typedarray */ "qXd6").strict
var helpers = __webpack_require__(/*! ./lib/helpers */ "FwwX")
var cookies = __webpack_require__(/*! ./lib/cookies */ "C8Ws")
var getProxyFromURI = __webpack_require__(/*! ./lib/getProxyFromURI */ "t1Ng")
var Querystring = __webpack_require__(/*! ./lib/querystring */ "Loi0").Querystring
var Har = __webpack_require__(/*! ./lib/har */ "ztjF").Har
var Auth = __webpack_require__(/*! ./lib/auth */ "lP/L").Auth
var OAuth = __webpack_require__(/*! ./lib/oauth */ "zd8i").OAuth
var hawk = __webpack_require__(/*! ./lib/hawk */ "VfEU")
var Multipart = __webpack_require__(/*! ./lib/multipart */ "NtJR").Multipart
var Redirect = __webpack_require__(/*! ./lib/redirect */ "meuO").Redirect
var Tunnel = __webpack_require__(/*! ./lib/tunnel */ "prM7").Tunnel
var now = __webpack_require__(/*! performance-now */ "bQgK")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

var safeStringify = helpers.safeStringify
var isReadStream = helpers.isReadStream
var toBase64 = helpers.toBase64
var defer = helpers.defer
var copy = helpers.copy
var version = helpers.version
var globalCookieJar = cookies.jar()

var globalPool = {}

function filterForNonReserved (reserved, options) {
  // Filter out properties that are not reserved.
  // Reserved values are passed in at call site.

  var object = {}
  for (var i in options) {
    var notReserved = (reserved.indexOf(i) === -1)
    if (notReserved) {
      object[i] = options[i]
    }
  }
  return object
}

function filterOutReservedFunctions (reserved, options) {
  // Filter out properties that are functions and are reserved.
  // Reserved values are passed in at call site.

  var object = {}
  for (var i in options) {
    var isReserved = !(reserved.indexOf(i) === -1)
    var isFunction = (typeof options[i] === 'function')
    if (!(isReserved && isFunction)) {
      object[i] = options[i]
    }
  }
  return object
}

// Return a simpler request object to allow serialization
function requestToJSON () {
  var self = this
  return {
    uri: self.uri,
    method: self.method,
    headers: self.headers
  }
}

// Return a simpler response object to allow serialization
function responseToJSON () {
  var self = this
  return {
    statusCode: self.statusCode,
    body: self.body,
    headers: self.headers,
    request: requestToJSON.call(self.request)
  }
}

function Request (options) {
  // if given the method property in options, set property explicitMethod to true

  // extend the Request instance with any non-reserved properties
  // remove any reserved functions from the options object
  // set Request instance to be readable and writable
  // call init

  var self = this

  // start with HAR, then override with additional options
  if (options.har) {
    self._har = new Har(self)
    options = self._har.options(options)
  }

  stream.Stream.call(self)
  var reserved = Object.keys(Request.prototype)
  var nonReserved = filterForNonReserved(reserved, options)

  extend(self, nonReserved)
  options = filterOutReservedFunctions(reserved, options)

  self.readable = true
  self.writable = true
  if (options.method) {
    self.explicitMethod = true
  }
  self._qs = new Querystring(self)
  self._auth = new Auth(self)
  self._oauth = new OAuth(self)
  self._multipart = new Multipart(self)
  self._redirect = new Redirect(self)
  self._tunnel = new Tunnel(self)
  self.init(options)
}

util.inherits(Request, stream.Stream)

// Debugging
Request.debug = process.env.NODE_DEBUG && /\brequest\b/.test(process.env.NODE_DEBUG)
function debug () {
  if (Request.debug) {
    console.error('REQUEST %s', util.format.apply(util, arguments))
  }
}
Request.prototype.debug = debug

Request.prototype.init = function (options) {
  // init() contains all the code to setup the request object.
  // the actual outgoing request is not started until start() is called
  // this function is called from both the constructor and on redirect.
  var self = this
  if (!options) {
    options = {}
  }
  self.headers = self.headers ? copy(self.headers) : {}

  // Delete headers with value undefined since they break
  // ClientRequest.OutgoingMessage.setHeader in node 0.12
  for (var headerName in self.headers) {
    if (typeof self.headers[headerName] === 'undefined') {
      delete self.headers[headerName]
    }
  }

  caseless.httpify(self, self.headers)

  if (!self.method) {
    self.method = options.method || 'GET'
  }
  if (!self.localAddress) {
    self.localAddress = options.localAddress
  }

  self._qs.init(options)

  debug(options)
  if (!self.pool && self.pool !== false) {
    self.pool = globalPool
  }
  self.dests = self.dests || []
  self.__isRequestRequest = true

  // Protect against double callback
  if (!self._callback && self.callback) {
    self._callback = self.callback
    self.callback = function () {
      if (self._callbackCalled) {
        return // Print a warning maybe?
      }
      self._callbackCalled = true
      self._callback.apply(self, arguments)
    }
    self.on('error', self.callback.bind())
    self.on('complete', self.callback.bind(self, null))
  }

  // People use this property instead all the time, so support it
  if (!self.uri && self.url) {
    self.uri = self.url
    delete self.url
  }

  // If there's a baseUrl, then use it as the base URL (i.e. uri must be
  // specified as a relative path and is appended to baseUrl).
  if (self.baseUrl) {
    if (typeof self.baseUrl !== 'string') {
      return self.emit('error', new Error('options.baseUrl must be a string'))
    }

    if (typeof self.uri !== 'string') {
      return self.emit('error', new Error('options.uri must be a string when using options.baseUrl'))
    }

    if (self.uri.indexOf('//') === 0 || self.uri.indexOf('://') !== -1) {
      return self.emit('error', new Error('options.uri must be a path when using options.baseUrl'))
    }

    // Handle all cases to make sure that there's only one slash between
    // baseUrl and uri.
    var baseUrlEndsWithSlash = self.baseUrl.lastIndexOf('/') === self.baseUrl.length - 1
    var uriStartsWithSlash = self.uri.indexOf('/') === 0

    if (baseUrlEndsWithSlash && uriStartsWithSlash) {
      self.uri = self.baseUrl + self.uri.slice(1)
    } else if (baseUrlEndsWithSlash || uriStartsWithSlash) {
      self.uri = self.baseUrl + self.uri
    } else if (self.uri === '') {
      self.uri = self.baseUrl
    } else {
      self.uri = self.baseUrl + '/' + self.uri
    }
    delete self.baseUrl
  }

  // A URI is needed by this point, emit error if we haven't been able to get one
  if (!self.uri) {
    return self.emit('error', new Error('options.uri is a required argument'))
  }

  // If a string URI/URL was given, parse it into a URL object
  if (typeof self.uri === 'string') {
    self.uri = url.parse(self.uri)
  }

  // Some URL objects are not from a URL parsed string and need href added
  if (!self.uri.href) {
    self.uri.href = url.format(self.uri)
  }

  // DEPRECATED: Warning for users of the old Unix Sockets URL Scheme
  if (self.uri.protocol === 'unix:') {
    return self.emit('error', new Error('`unix://` URL scheme is no longer supported. Please use the format `http://unix:SOCKET:PATH`'))
  }

  // Support Unix Sockets
  if (self.uri.host === 'unix') {
    self.enableUnixSocket()
  }

  if (self.strictSSL === false) {
    self.rejectUnauthorized = false
  }

  if (!self.uri.pathname) { self.uri.pathname = '/' }

  if (!(self.uri.host || (self.uri.hostname && self.uri.port)) && !self.uri.isUnix) {
    // Invalid URI: it may generate lot of bad errors, like 'TypeError: Cannot call method `indexOf` of undefined' in CookieJar
    // Detect and reject it as soon as possible
    var faultyUri = url.format(self.uri)
    var message = 'Invalid URI "' + faultyUri + '"'
    if (Object.keys(options).length === 0) {
      // No option ? This can be the sign of a redirect
      // As this is a case where the user cannot do anything (they didn't call request directly with this URL)
      // they should be warned that it can be caused by a redirection (can save some hair)
      message += '. This can be caused by a crappy redirection.'
    }
    // This error was fatal
    self.abort()
    return self.emit('error', new Error(message))
  }

  if (!self.hasOwnProperty('proxy')) {
    self.proxy = getProxyFromURI(self.uri)
  }

  self.tunnel = self._tunnel.isEnabled()
  if (self.proxy) {
    self._tunnel.setup(options)
  }

  self._redirect.onRequest(options)

  self.setHost = false
  if (!self.hasHeader('host')) {
    var hostHeaderName = self.originalHostHeaderName || 'host'
    self.setHeader(hostHeaderName, self.uri.host)
    // Drop :port suffix from Host header if known protocol.
    if (self.uri.port) {
      if ((self.uri.port === '80' && self.uri.protocol === 'http:') ||
          (self.uri.port === '443' && self.uri.protocol === 'https:')) {
        self.setHeader(hostHeaderName, self.uri.hostname)
      }
    }
    self.setHost = true
  }

  self.jar(self._jar || options.jar)

  if (!self.uri.port) {
    if (self.uri.protocol === 'http:') { self.uri.port = 80 } else if (self.uri.protocol === 'https:') { self.uri.port = 443 }
  }

  if (self.proxy && !self.tunnel) {
    self.port = self.proxy.port
    self.host = self.proxy.hostname
  } else {
    self.port = self.uri.port
    self.host = self.uri.hostname
  }

  if (options.form) {
    self.form(options.form)
  }

  if (options.formData) {
    var formData = options.formData
    var requestForm = self.form()
    var appendFormValue = function (key, value) {
      if (value && value.hasOwnProperty('value') && value.hasOwnProperty('options')) {
        requestForm.append(key, value.value, value.options)
      } else {
        requestForm.append(key, value)
      }
    }
    for (var formKey in formData) {
      if (formData.hasOwnProperty(formKey)) {
        var formValue = formData[formKey]
        if (formValue instanceof Array) {
          for (var j = 0; j < formValue.length; j++) {
            appendFormValue(formKey, formValue[j])
          }
        } else {
          appendFormValue(formKey, formValue)
        }
      }
    }
  }

  if (options.qs) {
    self.qs(options.qs)
  }

  if (self.uri.path) {
    self.path = self.uri.path
  } else {
    self.path = self.uri.pathname + (self.uri.search || '')
  }

  if (self.path.length === 0) {
    self.path = '/'
  }

  // Auth must happen last in case signing is dependent on other headers
  if (options.aws) {
    self.aws(options.aws)
  }

  if (options.hawk) {
    self.hawk(options.hawk)
  }

  if (options.httpSignature) {
    self.httpSignature(options.httpSignature)
  }

  if (options.auth) {
    if (Object.prototype.hasOwnProperty.call(options.auth, 'username')) {
      options.auth.user = options.auth.username
    }
    if (Object.prototype.hasOwnProperty.call(options.auth, 'password')) {
      options.auth.pass = options.auth.password
    }

    self.auth(
      options.auth.user,
      options.auth.pass,
      options.auth.sendImmediately,
      options.auth.bearer
    )
  }

  if (self.gzip && !self.hasHeader('accept-encoding')) {
    self.setHeader('accept-encoding', 'gzip, deflate')
  }

  if (self.uri.auth && !self.hasHeader('authorization')) {
    var uriAuthPieces = self.uri.auth.split(':').map(function (item) { return self._qs.unescape(item) })
    self.auth(uriAuthPieces[0], uriAuthPieces.slice(1).join(':'), true)
  }

  if (!self.tunnel && self.proxy && self.proxy.auth && !self.hasHeader('proxy-authorization')) {
    var proxyAuthPieces = self.proxy.auth.split(':').map(function (item) { return self._qs.unescape(item) })
    var authHeader = 'Basic ' + toBase64(proxyAuthPieces.join(':'))
    self.setHeader('proxy-authorization', authHeader)
  }

  if (self.proxy && !self.tunnel) {
    self.path = (self.uri.protocol + '//' + self.uri.host + self.path)
  }

  if (options.json) {
    self.json(options.json)
  }
  if (options.multipart) {
    self.multipart(options.multipart)
  }

  if (options.time) {
    self.timing = true

    // NOTE: elapsedTime is deprecated in favor of .timings
    self.elapsedTime = self.elapsedTime || 0
  }

  function setContentLength () {
    if (isTypedArray(self.body)) {
      self.body = Buffer.from(self.body)
    }

    if (!self.hasHeader('content-length')) {
      var length
      if (typeof self.body === 'string') {
        length = Buffer.byteLength(self.body)
      } else if (Array.isArray(self.body)) {
        length = self.body.reduce(function (a, b) { return a + b.length }, 0)
      } else {
        length = self.body.length
      }

      if (length) {
        self.setHeader('content-length', length)
      } else {
        self.emit('error', new Error('Argument error, options.body.'))
      }
    }
  }
  if (self.body && !isstream(self.body)) {
    setContentLength()
  }

  if (options.oauth) {
    self.oauth(options.oauth)
  } else if (self._oauth.params && self.hasHeader('authorization')) {
    self.oauth(self._oauth.params)
  }

  var protocol = self.proxy && !self.tunnel ? self.proxy.protocol : self.uri.protocol
  var defaultModules = {'http:': http, 'https:': https}
  var httpModules = self.httpModules || {}

  self.httpModule = httpModules[protocol] || defaultModules[protocol]

  if (!self.httpModule) {
    return self.emit('error', new Error('Invalid protocol: ' + protocol))
  }

  if (options.ca) {
    self.ca = options.ca
  }

  if (!self.agent) {
    if (options.agentOptions) {
      self.agentOptions = options.agentOptions
    }

    if (options.agentClass) {
      self.agentClass = options.agentClass
    } else if (options.forever) {
      var v = version()
      // use ForeverAgent in node 0.10- only
      if (v.major === 0 && v.minor <= 10) {
        self.agentClass = protocol === 'http:' ? ForeverAgent : ForeverAgent.SSL
      } else {
        self.agentClass = self.httpModule.Agent
        self.agentOptions = self.agentOptions || {}
        self.agentOptions.keepAlive = true
      }
    } else {
      self.agentClass = self.httpModule.Agent
    }
  }

  if (self.pool === false) {
    self.agent = false
  } else {
    self.agent = self.agent || self.getNewAgent()
  }

  self.on('pipe', function (src) {
    if (self.ntick && self._started) {
      self.emit('error', new Error('You cannot pipe to this stream after the outbound request has started.'))
    }
    self.src = src
    if (isReadStream(src)) {
      if (!self.hasHeader('content-type')) {
        self.setHeader('content-type', mime.lookup(src.path))
      }
    } else {
      if (src.headers) {
        for (var i in src.headers) {
          if (!self.hasHeader(i)) {
            self.setHeader(i, src.headers[i])
          }
        }
      }
      if (self._json && !self.hasHeader('content-type')) {
        self.setHeader('content-type', 'application/json')
      }
      if (src.method && !self.explicitMethod) {
        self.method = src.method
      }
    }

  // self.on('pipe', function () {
  //   console.error('You have already piped to this stream. Pipeing twice is likely to break the request.')
  // })
  })

  defer(function () {
    if (self._aborted) {
      return
    }

    var end = function () {
      if (self._form) {
        if (!self._auth.hasAuth) {
          self._form.pipe(self)
        } else if (self._auth.hasAuth && self._auth.sentAuth) {
          self._form.pipe(self)
        }
      }
      if (self._multipart && self._multipart.chunked) {
        self._multipart.body.pipe(self)
      }
      if (self.body) {
        if (isstream(self.body)) {
          self.body.pipe(self)
        } else {
          setContentLength()
          if (Array.isArray(self.body)) {
            self.body.forEach(function (part) {
              self.write(part)
            })
          } else {
            self.write(self.body)
          }
          self.end()
        }
      } else if (self.requestBodyStream) {
        console.warn('options.requestBodyStream is deprecated, please pass the request object to stream.pipe.')
        self.requestBodyStream.pipe(self)
      } else if (!self.src) {
        if (self._auth.hasAuth && !self._auth.sentAuth) {
          self.end()
          return
        }
        if (self.method !== 'GET' && typeof self.method !== 'undefined') {
          self.setHeader('content-length', 0)
        }
        self.end()
      }
    }

    if (self._form && !self.hasHeader('content-length')) {
      // Before ending the request, we had to compute the length of the whole form, asyncly
      self.setHeader(self._form.getHeaders(), true)
      self._form.getLength(function (err, length) {
        if (!err && !isNaN(length)) {
          self.setHeader('content-length', length)
        }
        end()
      })
    } else {
      end()
    }

    self.ntick = true
  })
}

Request.prototype.getNewAgent = function () {
  var self = this
  var Agent = self.agentClass
  var options = {}
  if (self.agentOptions) {
    for (var i in self.agentOptions) {
      options[i] = self.agentOptions[i]
    }
  }
  if (self.ca) {
    options.ca = self.ca
  }
  if (self.ciphers) {
    options.ciphers = self.ciphers
  }
  if (self.secureProtocol) {
    options.secureProtocol = self.secureProtocol
  }
  if (self.secureOptions) {
    options.secureOptions = self.secureOptions
  }
  if (typeof self.rejectUnauthorized !== 'undefined') {
    options.rejectUnauthorized = self.rejectUnauthorized
  }

  if (self.cert && self.key) {
    options.key = self.key
    options.cert = self.cert
  }

  if (self.pfx) {
    options.pfx = self.pfx
  }

  if (self.passphrase) {
    options.passphrase = self.passphrase
  }

  var poolKey = ''

  // different types of agents are in different pools
  if (Agent !== self.httpModule.Agent) {
    poolKey += Agent.name
  }

  // ca option is only relevant if proxy or destination are https
  var proxy = self.proxy
  if (typeof proxy === 'string') {
    proxy = url.parse(proxy)
  }
  var isHttps = (proxy && proxy.protocol === 'https:') || this.uri.protocol === 'https:'

  if (isHttps) {
    if (options.ca) {
      if (poolKey) {
        poolKey += ':'
      }
      poolKey += options.ca
    }

    if (typeof options.rejectUnauthorized !== 'undefined') {
      if (poolKey) {
        poolKey += ':'
      }
      poolKey += options.rejectUnauthorized
    }

    if (options.cert) {
      if (poolKey) {
        poolKey += ':'
      }
      poolKey += options.cert.toString('ascii') + options.key.toString('ascii')
    }

    if (options.pfx) {
      if (poolKey) {
        poolKey += ':'
      }
      poolKey += options.pfx.toString('ascii')
    }

    if (options.ciphers) {
      if (poolKey) {
        poolKey += ':'
      }
      poolKey += options.ciphers
    }

    if (options.secureProtocol) {
      if (poolKey) {
        poolKey += ':'
      }
      poolKey += options.secureProtocol
    }

    if (options.secureOptions) {
      if (poolKey) {
        poolKey += ':'
      }
      poolKey += options.secureOptions
    }
  }

  if (self.pool === globalPool && !poolKey && Object.keys(options).length === 0 && self.httpModule.globalAgent) {
    // not doing anything special.  Use the globalAgent
    return self.httpModule.globalAgent
  }

  // we're using a stored agent.  Make sure it's protocol-specific
  poolKey = self.uri.protocol + poolKey

  // generate a new agent for this setting if none yet exists
  if (!self.pool[poolKey]) {
    self.pool[poolKey] = new Agent(options)
    // properly set maxSockets on new agents
    if (self.pool.maxSockets) {
      self.pool[poolKey].maxSockets = self.pool.maxSockets
    }
  }

  return self.pool[poolKey]
}

Request.prototype.start = function () {
  // start() is called once we are ready to send the outgoing HTTP request.
  // this is usually called on the first write(), end() or on nextTick()
  var self = this

  if (self.timing) {
    // All timings will be relative to this request's startTime.  In order to do this,
    // we need to capture the wall-clock start time (via Date), immediately followed
    // by the high-resolution timer (via now()).  While these two won't be set
    // at the _exact_ same time, they should be close enough to be able to calculate
    // high-resolution, monotonically non-decreasing timestamps relative to startTime.
    var startTime = new Date().getTime()
    var startTimeNow = now()
  }

  if (self._aborted) {
    return
  }

  self._started = true
  self.method = self.method || 'GET'
  self.href = self.uri.href

  if (self.src && self.src.stat && self.src.stat.size && !self.hasHeader('content-length')) {
    self.setHeader('content-length', self.src.stat.size)
  }
  if (self._aws) {
    self.aws(self._aws, true)
  }

  // We have a method named auth, which is completely different from the http.request
  // auth option.  If we don't remove it, we're gonna have a bad time.
  var reqOptions = copy(self)
  delete reqOptions.auth

  debug('make request', self.uri.href)

  // node v6.8.0 now supports a `timeout` value in `http.request()`, but we
  // should delete it for now since we handle timeouts manually for better
  // consistency with node versions before v6.8.0
  delete reqOptions.timeout

  try {
    self.req = self.httpModule.request(reqOptions)
  } catch (err) {
    self.emit('error', err)
    return
  }

  if (self.timing) {
    self.startTime = startTime
    self.startTimeNow = startTimeNow

    // Timing values will all be relative to startTime (by comparing to startTimeNow
    // so we have an accurate clock)
    self.timings = {}
  }

  var timeout
  if (self.timeout && !self.timeoutTimer) {
    if (self.timeout < 0) {
      timeout = 0
    } else if (typeof self.timeout === 'number' && isFinite(self.timeout)) {
      timeout = self.timeout
    }
  }

  self.req.on('response', self.onRequestResponse.bind(self))
  self.req.on('error', self.onRequestError.bind(self))
  self.req.on('drain', function () {
    self.emit('drain')
  })

  self.req.on('socket', function (socket) {
    // `._connecting` was the old property which was made public in node v6.1.0
    var isConnecting = socket._connecting || socket.connecting
    if (self.timing) {
      self.timings.socket = now() - self.startTimeNow

      if (isConnecting) {
        var onLookupTiming = function () {
          self.timings.lookup = now() - self.startTimeNow
        }

        var onConnectTiming = function () {
          self.timings.connect = now() - self.startTimeNow
        }

        socket.once('lookup', onLookupTiming)
        socket.once('connect', onConnectTiming)

        // clean up timing event listeners if needed on error
        self.req.once('error', function () {
          socket.removeListener('lookup', onLookupTiming)
          socket.removeListener('connect', onConnectTiming)
        })
      }
    }

    var setReqTimeout = function () {
      // This timeout sets the amount of time to wait *between* bytes sent
      // from the server once connected.
      //
      // In particular, it's useful for erroring if the server fails to send
      // data halfway through streaming a response.
      self.req.setTimeout(timeout, function () {
        if (self.req) {
          self.abort()
          var e = new Error('ESOCKETTIMEDOUT')
          e.code = 'ESOCKETTIMEDOUT'
          e.connect = false
          self.emit('error', e)
        }
      })
    }
    if (timeout !== undefined) {
      // Only start the connection timer if we're actually connecting a new
      // socket, otherwise if we're already connected (because this is a
      // keep-alive connection) do not bother. This is important since we won't
      // get a 'connect' event for an already connected socket.
      if (isConnecting) {
        var onReqSockConnect = function () {
          socket.removeListener('connect', onReqSockConnect)
          clearTimeout(self.timeoutTimer)
          self.timeoutTimer = null
          setReqTimeout()
        }

        socket.on('connect', onReqSockConnect)

        self.req.on('error', function (err) { // eslint-disable-line handle-callback-err
          socket.removeListener('connect', onReqSockConnect)
        })

        // Set a timeout in memory - this block will throw if the server takes more
        // than `timeout` to write the HTTP status and headers (corresponding to
        // the on('response') event on the client). NB: this measures wall-clock
        // time, not the time between bytes sent by the server.
        self.timeoutTimer = setTimeout(function () {
          socket.removeListener('connect', onReqSockConnect)
          self.abort()
          var e = new Error('ETIMEDOUT')
          e.code = 'ETIMEDOUT'
          e.connect = true
          self.emit('error', e)
        }, timeout)
      } else {
        // We're already connected
        setReqTimeout()
      }
    }
    self.emit('socket', socket)
  })

  self.emit('request', self.req)
}

Request.prototype.onRequestError = function (error) {
  var self = this
  if (self._aborted) {
    return
  }
  if (self.req && self.req._reusedSocket && error.code === 'ECONNRESET' &&
    self.agent.addRequestNoreuse) {
    self.agent = { addRequest: self.agent.addRequestNoreuse.bind(self.agent) }
    self.start()
    self.req.end()
    return
  }
  if (self.timeout && self.timeoutTimer) {
    clearTimeout(self.timeoutTimer)
    self.timeoutTimer = null
  }
  self.emit('error', error)
}

Request.prototype.onRequestResponse = function (response) {
  var self = this

  if (self.timing) {
    self.timings.response = now() - self.startTimeNow
  }

  debug('onRequestResponse', self.uri.href, response.statusCode, response.headers)
  response.on('end', function () {
    if (self.timing) {
      self.timings.end = now() - self.startTimeNow
      response.timingStart = self.startTime

      // fill in the blanks for any periods that didn't trigger, such as
      // no lookup or connect due to keep alive
      if (!self.timings.socket) {
        self.timings.socket = 0
      }
      if (!self.timings.lookup) {
        self.timings.lookup = self.timings.socket
      }
      if (!self.timings.connect) {
        self.timings.connect = self.timings.lookup
      }
      if (!self.timings.response) {
        self.timings.response = self.timings.connect
      }

      debug('elapsed time', self.timings.end)

      // elapsedTime includes all redirects
      self.elapsedTime += Math.round(self.timings.end)

      // NOTE: elapsedTime is deprecated in favor of .timings
      response.elapsedTime = self.elapsedTime

      // timings is just for the final fetch
      response.timings = self.timings

      // pre-calculate phase timings as well
      response.timingPhases = {
        wait: self.timings.socket,
        dns: self.timings.lookup - self.timings.socket,
        tcp: self.timings.connect - self.timings.lookup,
        firstByte: self.timings.response - self.timings.connect,
        download: self.timings.end - self.timings.response,
        total: self.timings.end
      }
    }
    debug('response end', self.uri.href, response.statusCode, response.headers)
  })

  if (self._aborted) {
    debug('aborted', self.uri.href)
    response.resume()
    return
  }

  self.response = response
  response.request = self
  response.toJSON = responseToJSON

  // XXX This is different on 0.10, because SSL is strict by default
  if (self.httpModule === https &&
    self.strictSSL && (!response.hasOwnProperty('socket') ||
    !response.socket.authorized)) {
    debug('strict ssl error', self.uri.href)
    var sslErr = response.hasOwnProperty('socket') ? response.socket.authorizationError : self.uri.href + ' does not support SSL'
    self.emit('error', new Error('SSL Error: ' + sslErr))
    return
  }

  // Save the original host before any redirect (if it changes, we need to
  // remove any authorization headers).  Also remember the case of the header
  // name because lots of broken servers expect Host instead of host and we
  // want the caller to be able to specify this.
  self.originalHost = self.getHeader('host')
  if (!self.originalHostHeaderName) {
    self.originalHostHeaderName = self.hasHeader('host')
  }
  if (self.setHost) {
    self.removeHeader('host')
  }
  if (self.timeout && self.timeoutTimer) {
    clearTimeout(self.timeoutTimer)
    self.timeoutTimer = null
  }

  var targetCookieJar = (self._jar && self._jar.setCookie) ? self._jar : globalCookieJar
  var addCookie = function (cookie) {
    // set the cookie if it's domain in the href's domain.
    try {
      targetCookieJar.setCookie(cookie, self.uri.href, {ignoreError: true})
    } catch (e) {
      self.emit('error', e)
    }
  }

  response.caseless = caseless(response.headers)

  if (response.caseless.has('set-cookie') && (!self._disableCookies)) {
    var headerName = response.caseless.has('set-cookie')
    if (Array.isArray(response.headers[headerName])) {
      response.headers[headerName].forEach(addCookie)
    } else {
      addCookie(response.headers[headerName])
    }
  }

  if (self._redirect.onResponse(response)) {
    return // Ignore the rest of the response
  } else {
    // Be a good stream and emit end when the response is finished.
    // Hack to emit end on close because of a core bug that never fires end
    response.on('close', function () {
      if (!self._ended) {
        self.response.emit('end')
      }
    })

    response.once('end', function () {
      self._ended = true
    })

    var noBody = function (code) {
      return (
        self.method === 'HEAD' ||
        // Informational
        (code >= 100 && code < 200) ||
        // No Content
        code === 204 ||
        // Not Modified
        code === 304
      )
    }

    var responseContent
    if (self.gzip && !noBody(response.statusCode)) {
      var contentEncoding = response.headers['content-encoding'] || 'identity'
      contentEncoding = contentEncoding.trim().toLowerCase()

      // Be more lenient with decoding compressed responses, since (very rarely)
      // servers send slightly invalid gzip responses that are still accepted
      // by common browsers.
      // Always using Z_SYNC_FLUSH is what cURL does.
      var zlibOptions = {
        flush: zlib.Z_SYNC_FLUSH,
        finishFlush: zlib.Z_SYNC_FLUSH
      }

      if (contentEncoding === 'gzip') {
        responseContent = zlib.createGunzip(zlibOptions)
        response.pipe(responseContent)
      } else if (contentEncoding === 'deflate') {
        responseContent = zlib.createInflate(zlibOptions)
        response.pipe(responseContent)
      } else {
        // Since previous versions didn't check for Content-Encoding header,
        // ignore any invalid values to preserve backwards-compatibility
        if (contentEncoding !== 'identity') {
          debug('ignoring unrecognized Content-Encoding ' + contentEncoding)
        }
        responseContent = response
      }
    } else {
      responseContent = response
    }

    if (self.encoding) {
      if (self.dests.length !== 0) {
        console.error('Ignoring encoding parameter as this stream is being piped to another stream which makes the encoding option invalid.')
      } else {
        responseContent.setEncoding(self.encoding)
      }
    }

    if (self._paused) {
      responseContent.pause()
    }

    self.responseContent = responseContent

    self.emit('response', response)

    self.dests.forEach(function (dest) {
      self.pipeDest(dest)
    })

    responseContent.on('data', function (chunk) {
      if (self.timing && !self.responseStarted) {
        self.responseStartTime = (new Date()).getTime()

        // NOTE: responseStartTime is deprecated in favor of .timings
        response.responseStartTime = self.responseStartTime
      }
      self._destdata = true
      self.emit('data', chunk)
    })
    responseContent.once('end', function (chunk) {
      self.emit('end', chunk)
    })
    responseContent.on('error', function (error) {
      self.emit('error', error)
    })
    responseContent.on('close', function () { self.emit('close') })

    if (self.callback) {
      self.readResponseBody(response)
    } else { // if no callback
      self.on('end', function () {
        if (self._aborted) {
          debug('aborted', self.uri.href)
          return
        }
        self.emit('complete', response)
      })
    }
  }
  debug('finish init function', self.uri.href)
}

Request.prototype.readResponseBody = function (response) {
  var self = this
  debug("reading response's body")
  var buffers = []
  var bufferLength = 0
  var strings = []

  self.on('data', function (chunk) {
    if (!Buffer.isBuffer(chunk)) {
      strings.push(chunk)
    } else if (chunk.length) {
      bufferLength += chunk.length
      buffers.push(chunk)
    }
  })
  self.on('end', function () {
    debug('end event', self.uri.href)
    if (self._aborted) {
      debug('aborted', self.uri.href)
      // `buffer` is defined in the parent scope and used in a closure it exists for the life of the request.
      // This can lead to leaky behavior if the user retains a reference to the request object.
      buffers = []
      bufferLength = 0
      return
    }

    if (bufferLength) {
      debug('has body', self.uri.href, bufferLength)
      response.body = Buffer.concat(buffers, bufferLength)
      if (self.encoding !== null) {
        response.body = response.body.toString(self.encoding)
      }
      // `buffer` is defined in the parent scope and used in a closure it exists for the life of the Request.
      // This can lead to leaky behavior if the user retains a reference to the request object.
      buffers = []
      bufferLength = 0
    } else if (strings.length) {
      // The UTF8 BOM [0xEF,0xBB,0xBF] is converted to [0xFE,0xFF] in the JS UTC16/UCS2 representation.
      // Strip this value out when the encoding is set to 'utf8', as upstream consumers won't expect it and it breaks JSON.parse().
      if (self.encoding === 'utf8' && strings[0].length > 0 && strings[0][0] === '\uFEFF') {
        strings[0] = strings[0].substring(1)
      }
      response.body = strings.join('')
    }

    if (self._json) {
      try {
        response.body = JSON.parse(response.body, self._jsonReviver)
      } catch (e) {
        debug('invalid JSON received', self.uri.href)
      }
    }
    debug('emitting complete', self.uri.href)
    if (typeof response.body === 'undefined' && !self._json) {
      response.body = self.encoding === null ? Buffer.alloc(0) : ''
    }
    self.emit('complete', response, response.body)
  })
}

Request.prototype.abort = function () {
  var self = this
  self._aborted = true

  if (self.req) {
    self.req.abort()
  } else if (self.response) {
    self.response.destroy()
  }

  self.emit('abort')
}

Request.prototype.pipeDest = function (dest) {
  var self = this
  var response = self.response
  // Called after the response is received
  if (dest.headers && !dest.headersSent) {
    if (response.caseless.has('content-type')) {
      var ctname = response.caseless.has('content-type')
      if (dest.setHeader) {
        dest.setHeader(ctname, response.headers[ctname])
      } else {
        dest.headers[ctname] = response.headers[ctname]
      }
    }

    if (response.caseless.has('content-length')) {
      var clname = response.caseless.has('content-length')
      if (dest.setHeader) {
        dest.setHeader(clname, response.headers[clname])
      } else {
        dest.headers[clname] = response.headers[clname]
      }
    }
  }
  if (dest.setHeader && !dest.headersSent) {
    for (var i in response.headers) {
      // If the response content is being decoded, the Content-Encoding header
      // of the response doesn't represent the piped content, so don't pass it.
      if (!self.gzip || i !== 'content-encoding') {
        dest.setHeader(i, response.headers[i])
      }
    }
    dest.statusCode = response.statusCode
  }
  if (self.pipefilter) {
    self.pipefilter(response, dest)
  }
}

Request.prototype.qs = function (q, clobber) {
  var self = this
  var base
  if (!clobber && self.uri.query) {
    base = self._qs.parse(self.uri.query)
  } else {
    base = {}
  }

  for (var i in q) {
    base[i] = q[i]
  }

  var qs = self._qs.stringify(base)

  if (qs === '') {
    return self
  }

  self.uri = url.parse(self.uri.href.split('?')[0] + '?' + qs)
  self.url = self.uri
  self.path = self.uri.path

  if (self.uri.host === 'unix') {
    self.enableUnixSocket()
  }

  return self
}
Request.prototype.form = function (form) {
  var self = this
  if (form) {
    if (!/^application\/x-www-form-urlencoded\b/.test(self.getHeader('content-type'))) {
      self.setHeader('content-type', 'application/x-www-form-urlencoded')
    }
    self.body = (typeof form === 'string')
      ? self._qs.rfc3986(form.toString('utf8'))
      : self._qs.stringify(form).toString('utf8')
    return self
  }
  // create form-data object
  self._form = new FormData()
  self._form.on('error', function (err) {
    err.message = 'form-data: ' + err.message
    self.emit('error', err)
    self.abort()
  })
  return self._form
}
Request.prototype.multipart = function (multipart) {
  var self = this

  self._multipart.onRequest(multipart)

  if (!self._multipart.chunked) {
    self.body = self._multipart.body
  }

  return self
}
Request.prototype.json = function (val) {
  var self = this

  if (!self.hasHeader('accept')) {
    self.setHeader('accept', 'application/json')
  }

  if (typeof self.jsonReplacer === 'function') {
    self._jsonReplacer = self.jsonReplacer
  }

  self._json = true
  if (typeof val === 'boolean') {
    if (self.body !== undefined) {
      if (!/^application\/x-www-form-urlencoded\b/.test(self.getHeader('content-type'))) {
        self.body = safeStringify(self.body, self._jsonReplacer)
      } else {
        self.body = self._qs.rfc3986(self.body)
      }
      if (!self.hasHeader('content-type')) {
        self.setHeader('content-type', 'application/json')
      }
    }
  } else {
    self.body = safeStringify(val, self._jsonReplacer)
    if (!self.hasHeader('content-type')) {
      self.setHeader('content-type', 'application/json')
    }
  }

  if (typeof self.jsonReviver === 'function') {
    self._jsonReviver = self.jsonReviver
  }

  return self
}
Request.prototype.getHeader = function (name, headers) {
  var self = this
  var result, re, match
  if (!headers) {
    headers = self.headers
  }
  Object.keys(headers).forEach(function (key) {
    if (key.length !== name.length) {
      return
    }
    re = new RegExp(name, 'i')
    match = key.match(re)
    if (match) {
      result = headers[key]
    }
  })
  return result
}
Request.prototype.enableUnixSocket = function () {
  // Get the socket & request paths from the URL
  var unixParts = this.uri.path.split(':')
  var host = unixParts[0]
  var path = unixParts[1]
  // Apply unix properties to request
  this.socketPath = host
  this.uri.pathname = path
  this.uri.path = path
  this.uri.host = host
  this.uri.hostname = host
  this.uri.isUnix = true
}

Request.prototype.auth = function (user, pass, sendImmediately, bearer) {
  var self = this

  self._auth.onRequest(user, pass, sendImmediately, bearer)

  return self
}
Request.prototype.aws = function (opts, now) {
  var self = this

  if (!now) {
    self._aws = opts
    return self
  }

  if (opts.sign_version === 4 || opts.sign_version === '4') {
    // use aws4
    var options = {
      host: self.uri.host,
      path: self.uri.path,
      method: self.method,
      headers: self.headers,
      body: self.body
    }
    if (opts.service) {
      options.service = opts.service
    }
    var signRes = aws4.sign(options, {
      accessKeyId: opts.key,
      secretAccessKey: opts.secret,
      sessionToken: opts.session
    })
    self.setHeader('authorization', signRes.headers.Authorization)
    self.setHeader('x-amz-date', signRes.headers['X-Amz-Date'])
    if (signRes.headers['X-Amz-Security-Token']) {
      self.setHeader('x-amz-security-token', signRes.headers['X-Amz-Security-Token'])
    }
  } else {
    // default: use aws-sign2
    var date = new Date()
    self.setHeader('date', date.toUTCString())
    var auth = {
      key: opts.key,
      secret: opts.secret,
      verb: self.method.toUpperCase(),
      date: date,
      contentType: self.getHeader('content-type') || '',
      md5: self.getHeader('content-md5') || '',
      amazonHeaders: aws2.canonicalizeHeaders(self.headers)
    }
    var path = self.uri.path
    if (opts.bucket && path) {
      auth.resource = '/' + opts.bucket + path
    } else if (opts.bucket && !path) {
      auth.resource = '/' + opts.bucket
    } else if (!opts.bucket && path) {
      auth.resource = path
    } else if (!opts.bucket && !path) {
      auth.resource = '/'
    }
    auth.resource = aws2.canonicalizeResource(auth.resource)
    self.setHeader('authorization', aws2.authorization(auth))
  }

  return self
}
Request.prototype.httpSignature = function (opts) {
  var self = this
  httpSignature.signRequest({
    getHeader: function (header) {
      return self.getHeader(header, self.headers)
    },
    setHeader: function (header, value) {
      self.setHeader(header, value)
    },
    method: self.method,
    path: self.path
  }, opts)
  debug('httpSignature authorization', self.getHeader('authorization'))

  return self
}
Request.prototype.hawk = function (opts) {
  var self = this
  self.setHeader('Authorization', hawk.header(self.uri, self.method, opts))
}
Request.prototype.oauth = function (_oauth) {
  var self = this

  self._oauth.onRequest(_oauth)

  return self
}

Request.prototype.jar = function (jar) {
  var self = this
  var cookies

  if (self._redirect.redirectsFollowed === 0) {
    self.originalCookieHeader = self.getHeader('cookie')
  }

  if (!jar) {
    // disable cookies
    cookies = false
    self._disableCookies = true
  } else {
    var targetCookieJar = (jar && jar.getCookieString) ? jar : globalCookieJar
    var urihref = self.uri.href
    // fetch cookie in the Specified host
    if (targetCookieJar) {
      cookies = targetCookieJar.getCookieString(urihref)
    }
  }

  // if need cookie and cookie is not empty
  if (cookies && cookies.length) {
    if (self.originalCookieHeader) {
      // Don't overwrite existing Cookie header
      self.setHeader('cookie', self.originalCookieHeader + '; ' + cookies)
    } else {
      self.setHeader('cookie', cookies)
    }
  }
  self._jar = jar
  return self
}

// Stream API
Request.prototype.pipe = function (dest, opts) {
  var self = this

  if (self.response) {
    if (self._destdata) {
      self.emit('error', new Error('You cannot pipe after data has been emitted from the response.'))
    } else if (self._ended) {
      self.emit('error', new Error('You cannot pipe after the response has been ended.'))
    } else {
      stream.Stream.prototype.pipe.call(self, dest, opts)
      self.pipeDest(dest)
      return dest
    }
  } else {
    self.dests.push(dest)
    stream.Stream.prototype.pipe.call(self, dest, opts)
    return dest
  }
}
Request.prototype.write = function () {
  var self = this
  if (self._aborted) { return }

  if (!self._started) {
    self.start()
  }
  if (self.req) {
    return self.req.write.apply(self.req, arguments)
  }
}
Request.prototype.end = function (chunk) {
  var self = this
  if (self._aborted) { return }

  if (chunk) {
    self.write(chunk)
  }
  if (!self._started) {
    self.start()
  }
  if (self.req) {
    self.req.end()
  }
}
Request.prototype.pause = function () {
  var self = this
  if (!self.responseContent) {
    self._paused = true
  } else {
    self.responseContent.pause.apply(self.responseContent, arguments)
  }
}
Request.prototype.resume = function () {
  var self = this
  if (!self.responseContent) {
    self._paused = false
  } else {
    self.responseContent.resume.apply(self.responseContent, arguments)
  }
}
Request.prototype.destroy = function () {
  var self = this
  if (!self._ended) {
    self.end()
  } else if (self.response) {
    self.response.destroy()
  }
}

Request.defaultProxyHeaderWhiteList =
  Tunnel.defaultProxyHeaderWhiteList.slice()

Request.defaultProxyHeaderExclusiveList =
  Tunnel.defaultProxyHeaderExclusiveList.slice()

// Exports

Request.prototype.toJSON = requestToJSON
module.exports = Request

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "8oxB"), __webpack_require__(/*! ./../console-browserify/index.js */ "ziTh")))

/***/ }),

/***/ "VfEU":
/*!******************************************!*\
  !*** ./node_modules/request/lib/hawk.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = __webpack_require__(/*! crypto */ "HEbw")

function randomString (size) {
  var bits = (size + 1) * 6
  var buffer = crypto.randomBytes(Math.ceil(bits / 8))
  var string = buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  return string.slice(0, size)
}

function calculatePayloadHash (payload, algorithm, contentType) {
  var hash = crypto.createHash(algorithm)
  hash.update('hawk.1.payload\n')
  hash.update((contentType ? contentType.split(';')[0].trim().toLowerCase() : '') + '\n')
  hash.update(payload || '')
  hash.update('\n')
  return hash.digest('base64')
}

exports.calculateMac = function (credentials, opts) {
  var normalized = 'hawk.1.header\n' +
    opts.ts + '\n' +
    opts.nonce + '\n' +
    (opts.method || '').toUpperCase() + '\n' +
    opts.resource + '\n' +
    opts.host.toLowerCase() + '\n' +
    opts.port + '\n' +
    (opts.hash || '') + '\n'

  if (opts.ext) {
    normalized = normalized + opts.ext.replace('\\', '\\\\').replace('\n', '\\n')
  }

  normalized = normalized + '\n'

  if (opts.app) {
    normalized = normalized + opts.app + '\n' + (opts.dlg || '') + '\n'
  }

  var hmac = crypto.createHmac(credentials.algorithm, credentials.key).update(normalized)
  var digest = hmac.digest('base64')
  return digest
}

exports.header = function (uri, method, opts) {
  var timestamp = opts.timestamp || Math.floor((Date.now() + (opts.localtimeOffsetMsec || 0)) / 1000)
  var credentials = opts.credentials
  if (!credentials || !credentials.id || !credentials.key || !credentials.algorithm) {
    return ''
  }

  if (['sha1', 'sha256'].indexOf(credentials.algorithm) === -1) {
    return ''
  }

  var artifacts = {
    ts: timestamp,
    nonce: opts.nonce || randomString(6),
    method: method,
    resource: uri.pathname + (uri.search || ''),
    host: uri.hostname,
    port: uri.port || (uri.protocol === 'http:' ? 80 : 443),
    hash: opts.hash,
    ext: opts.ext,
    app: opts.app,
    dlg: opts.dlg
  }

  if (!artifacts.hash && (opts.payload || opts.payload === '')) {
    artifacts.hash = calculatePayloadHash(opts.payload, credentials.algorithm, opts.contentType)
  }

  var mac = exports.calculateMac(credentials, artifacts)

  var hasExt = artifacts.ext !== null && artifacts.ext !== undefined && artifacts.ext !== ''
  var header = 'Hawk id="' + credentials.id +
    '", ts="' + artifacts.ts +
    '", nonce="' + artifacts.nonce +
    (artifacts.hash ? '", hash="' + artifacts.hash : '') +
    (hasExt ? '", ext="' + artifacts.ext.replace(/\\/g, '\\\\').replace(/"/g, '\\"') : '') +
    '", mac="' + mac + '"'

  if (artifacts.app) {
    header = header + ', app="' + artifacts.app + (artifacts.dlg ? '", dlg="' + artifacts.dlg : '') + '"'
  }

  return header
}


/***/ }),

/***/ "lP/L":
/*!******************************************!*\
  !*** ./node_modules/request/lib/auth.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var caseless = __webpack_require__(/*! caseless */ "2loA")
var uuid = __webpack_require__(/*! uuid/v4 */ "xk4V")
var helpers = __webpack_require__(/*! ./helpers */ "FwwX")

var md5 = helpers.md5
var toBase64 = helpers.toBase64

function Auth (request) {
  // define all public properties here
  this.request = request
  this.hasAuth = false
  this.sentAuth = false
  this.bearerToken = null
  this.user = null
  this.pass = null
}

Auth.prototype.basic = function (user, pass, sendImmediately) {
  var self = this
  if (typeof user !== 'string' || (pass !== undefined && typeof pass !== 'string')) {
    self.request.emit('error', new Error('auth() received invalid user or password'))
  }
  self.user = user
  self.pass = pass
  self.hasAuth = true
  var header = user + ':' + (pass || '')
  if (sendImmediately || typeof sendImmediately === 'undefined') {
    var authHeader = 'Basic ' + toBase64(header)
    self.sentAuth = true
    return authHeader
  }
}

Auth.prototype.bearer = function (bearer, sendImmediately) {
  var self = this
  self.bearerToken = bearer
  self.hasAuth = true
  if (sendImmediately || typeof sendImmediately === 'undefined') {
    if (typeof bearer === 'function') {
      bearer = bearer()
    }
    var authHeader = 'Bearer ' + (bearer || '')
    self.sentAuth = true
    return authHeader
  }
}

Auth.prototype.digest = function (method, path, authHeader) {
  // TODO: More complete implementation of RFC 2617.
  //   - handle challenge.domain
  //   - support qop="auth-int" only
  //   - handle Authentication-Info (not necessarily?)
  //   - check challenge.stale (not necessarily?)
  //   - increase nc (not necessarily?)
  // For reference:
  // http://tools.ietf.org/html/rfc2617#section-3
  // https://github.com/bagder/curl/blob/master/lib/http_digest.c

  var self = this

  var challenge = {}
  var re = /([a-z0-9_-]+)=(?:"([^"]+)"|([a-z0-9_-]+))/gi
  for (;;) {
    var match = re.exec(authHeader)
    if (!match) {
      break
    }
    challenge[match[1]] = match[2] || match[3]
  }

  /**
   * RFC 2617: handle both MD5 and MD5-sess algorithms.
   *
   * If the algorithm directive's value is "MD5" or unspecified, then HA1 is
   *   HA1=MD5(username:realm:password)
   * If the algorithm directive's value is "MD5-sess", then HA1 is
   *   HA1=MD5(MD5(username:realm:password):nonce:cnonce)
   */
  var ha1Compute = function (algorithm, user, realm, pass, nonce, cnonce) {
    var ha1 = md5(user + ':' + realm + ':' + pass)
    if (algorithm && algorithm.toLowerCase() === 'md5-sess') {
      return md5(ha1 + ':' + nonce + ':' + cnonce)
    } else {
      return ha1
    }
  }

  var qop = /(^|,)\s*auth\s*($|,)/.test(challenge.qop) && 'auth'
  var nc = qop && '00000001'
  var cnonce = qop && uuid().replace(/-/g, '')
  var ha1 = ha1Compute(challenge.algorithm, self.user, challenge.realm, self.pass, challenge.nonce, cnonce)
  var ha2 = md5(method + ':' + path)
  var digestResponse = qop
    ? md5(ha1 + ':' + challenge.nonce + ':' + nc + ':' + cnonce + ':' + qop + ':' + ha2)
    : md5(ha1 + ':' + challenge.nonce + ':' + ha2)
  var authValues = {
    username: self.user,
    realm: challenge.realm,
    nonce: challenge.nonce,
    uri: path,
    qop: qop,
    response: digestResponse,
    nc: nc,
    cnonce: cnonce,
    algorithm: challenge.algorithm,
    opaque: challenge.opaque
  }

  authHeader = []
  for (var k in authValues) {
    if (authValues[k]) {
      if (k === 'qop' || k === 'nc' || k === 'algorithm') {
        authHeader.push(k + '=' + authValues[k])
      } else {
        authHeader.push(k + '="' + authValues[k] + '"')
      }
    }
  }
  authHeader = 'Digest ' + authHeader.join(', ')
  self.sentAuth = true
  return authHeader
}

Auth.prototype.onRequest = function (user, pass, sendImmediately, bearer) {
  var self = this
  var request = self.request

  var authHeader
  if (bearer === undefined && user === undefined) {
    self.request.emit('error', new Error('no auth mechanism defined'))
  } else if (bearer !== undefined) {
    authHeader = self.bearer(bearer, sendImmediately)
  } else {
    authHeader = self.basic(user, pass, sendImmediately)
  }
  if (authHeader) {
    request.setHeader('authorization', authHeader)
  }
}

Auth.prototype.onResponse = function (response) {
  var self = this
  var request = self.request

  if (!self.hasAuth || self.sentAuth) { return null }

  var c = caseless(response.headers)

  var authHeader = c.get('www-authenticate')
  var authVerb = authHeader && authHeader.split(' ')[0].toLowerCase()
  request.debug('reauth', authVerb)

  switch (authVerb) {
    case 'basic':
      return self.basic(self.user, self.pass, true)

    case 'bearer':
      return self.bearer(self.bearerToken, true)

    case 'digest':
      return self.digest(request.method, request.path, authHeader)
  }
}

exports.Auth = Auth


/***/ }),

/***/ "meuO":
/*!**********************************************!*\
  !*** ./node_modules/request/lib/redirect.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var url = __webpack_require__(/*! url */ "CxY0")
var isUrl = /^https?:/

function Redirect (request) {
  this.request = request
  this.followRedirect = true
  this.followRedirects = true
  this.followAllRedirects = false
  this.followOriginalHttpMethod = false
  this.allowRedirect = function () { return true }
  this.maxRedirects = 10
  this.redirects = []
  this.redirectsFollowed = 0
  this.removeRefererHeader = false
}

Redirect.prototype.onRequest = function (options) {
  var self = this

  if (options.maxRedirects !== undefined) {
    self.maxRedirects = options.maxRedirects
  }
  if (typeof options.followRedirect === 'function') {
    self.allowRedirect = options.followRedirect
  }
  if (options.followRedirect !== undefined) {
    self.followRedirects = !!options.followRedirect
  }
  if (options.followAllRedirects !== undefined) {
    self.followAllRedirects = options.followAllRedirects
  }
  if (self.followRedirects || self.followAllRedirects) {
    self.redirects = self.redirects || []
  }
  if (options.removeRefererHeader !== undefined) {
    self.removeRefererHeader = options.removeRefererHeader
  }
  if (options.followOriginalHttpMethod !== undefined) {
    self.followOriginalHttpMethod = options.followOriginalHttpMethod
  }
}

Redirect.prototype.redirectTo = function (response) {
  var self = this
  var request = self.request

  var redirectTo = null
  if (response.statusCode >= 300 && response.statusCode < 400 && response.caseless.has('location')) {
    var location = response.caseless.get('location')
    request.debug('redirect', location)

    if (self.followAllRedirects) {
      redirectTo = location
    } else if (self.followRedirects) {
      switch (request.method) {
        case 'PATCH':
        case 'PUT':
        case 'POST':
        case 'DELETE':
          // Do not follow redirects
          break
        default:
          redirectTo = location
          break
      }
    }
  } else if (response.statusCode === 401) {
    var authHeader = request._auth.onResponse(response)
    if (authHeader) {
      request.setHeader('authorization', authHeader)
      redirectTo = request.uri
    }
  }
  return redirectTo
}

Redirect.prototype.onResponse = function (response) {
  var self = this
  var request = self.request

  var redirectTo = self.redirectTo(response)
  if (!redirectTo || !self.allowRedirect.call(request, response)) {
    return false
  }

  request.debug('redirect to', redirectTo)

  // ignore any potential response body.  it cannot possibly be useful
  // to us at this point.
  // response.resume should be defined, but check anyway before calling. Workaround for browserify.
  if (response.resume) {
    response.resume()
  }

  if (self.redirectsFollowed >= self.maxRedirects) {
    request.emit('error', new Error('Exceeded maxRedirects. Probably stuck in a redirect loop ' + request.uri.href))
    return false
  }
  self.redirectsFollowed += 1

  if (!isUrl.test(redirectTo)) {
    redirectTo = url.resolve(request.uri.href, redirectTo)
  }

  var uriPrev = request.uri
  request.uri = url.parse(redirectTo)

  // handle the case where we change protocol from https to http or vice versa
  if (request.uri.protocol !== uriPrev.protocol) {
    delete request.agent
  }

  self.redirects.push({ statusCode: response.statusCode, redirectUri: redirectTo })

  if (self.followAllRedirects && request.method !== 'HEAD' &&
    response.statusCode !== 401 && response.statusCode !== 307) {
    request.method = self.followOriginalHttpMethod ? request.method : 'GET'
  }
  // request.method = 'GET' // Force all redirects to use GET || commented out fixes #215
  delete request.src
  delete request.req
  delete request._started
  if (response.statusCode !== 401 && response.statusCode !== 307) {
    // Remove parameters from the previous response, unless this is the second request
    // for a server that requires digest authentication.
    delete request.body
    delete request._form
    if (request.headers) {
      request.removeHeader('host')
      request.removeHeader('content-type')
      request.removeHeader('content-length')
      if (request.uri.hostname !== request.originalHost.split(':')[0]) {
        // Remove authorization if changing hostnames (but not if just
        // changing ports or protocols).  This matches the behavior of curl:
        // https://github.com/bagder/curl/blob/6beb0eee/lib/http.c#L710
        request.removeHeader('authorization')
      }
    }
  }

  if (!self.removeRefererHeader) {
    request.setHeader('referer', uriPrev.href)
  }

  request.emit('redirect')

  request.init()

  return true
}

exports.Redirect = Redirect


/***/ }),

/***/ "prM7":
/*!********************************************!*\
  !*** ./node_modules/request/lib/tunnel.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var url = __webpack_require__(/*! url */ "CxY0")
var tunnel = __webpack_require__(/*! tunnel-agent */ "CQoD")

var defaultProxyHeaderWhiteList = [
  'accept',
  'accept-charset',
  'accept-encoding',
  'accept-language',
  'accept-ranges',
  'cache-control',
  'content-encoding',
  'content-language',
  'content-location',
  'content-md5',
  'content-range',
  'content-type',
  'connection',
  'date',
  'expect',
  'max-forwards',
  'pragma',
  'referer',
  'te',
  'user-agent',
  'via'
]

var defaultProxyHeaderExclusiveList = [
  'proxy-authorization'
]

function constructProxyHost (uriObject) {
  var port = uriObject.port
  var protocol = uriObject.protocol
  var proxyHost = uriObject.hostname + ':'

  if (port) {
    proxyHost += port
  } else if (protocol === 'https:') {
    proxyHost += '443'
  } else {
    proxyHost += '80'
  }

  return proxyHost
}

function constructProxyHeaderWhiteList (headers, proxyHeaderWhiteList) {
  var whiteList = proxyHeaderWhiteList
    .reduce(function (set, header) {
      set[header.toLowerCase()] = true
      return set
    }, {})

  return Object.keys(headers)
    .filter(function (header) {
      return whiteList[header.toLowerCase()]
    })
    .reduce(function (set, header) {
      set[header] = headers[header]
      return set
    }, {})
}

function constructTunnelOptions (request, proxyHeaders) {
  var proxy = request.proxy

  var tunnelOptions = {
    proxy: {
      host: proxy.hostname,
      port: +proxy.port,
      proxyAuth: proxy.auth,
      headers: proxyHeaders
    },
    headers: request.headers,
    ca: request.ca,
    cert: request.cert,
    key: request.key,
    passphrase: request.passphrase,
    pfx: request.pfx,
    ciphers: request.ciphers,
    rejectUnauthorized: request.rejectUnauthorized,
    secureOptions: request.secureOptions,
    secureProtocol: request.secureProtocol
  }

  return tunnelOptions
}

function constructTunnelFnName (uri, proxy) {
  var uriProtocol = (uri.protocol === 'https:' ? 'https' : 'http')
  var proxyProtocol = (proxy.protocol === 'https:' ? 'Https' : 'Http')
  return [uriProtocol, proxyProtocol].join('Over')
}

function getTunnelFn (request) {
  var uri = request.uri
  var proxy = request.proxy
  var tunnelFnName = constructTunnelFnName(uri, proxy)
  return tunnel[tunnelFnName]
}

function Tunnel (request) {
  this.request = request
  this.proxyHeaderWhiteList = defaultProxyHeaderWhiteList
  this.proxyHeaderExclusiveList = []
  if (typeof request.tunnel !== 'undefined') {
    this.tunnelOverride = request.tunnel
  }
}

Tunnel.prototype.isEnabled = function () {
  var self = this
  var request = self.request
    // Tunnel HTTPS by default. Allow the user to override this setting.

  // If self.tunnelOverride is set (the user specified a value), use it.
  if (typeof self.tunnelOverride !== 'undefined') {
    return self.tunnelOverride
  }

  // If the destination is HTTPS, tunnel.
  if (request.uri.protocol === 'https:') {
    return true
  }

  // Otherwise, do not use tunnel.
  return false
}

Tunnel.prototype.setup = function (options) {
  var self = this
  var request = self.request

  options = options || {}

  if (typeof request.proxy === 'string') {
    request.proxy = url.parse(request.proxy)
  }

  if (!request.proxy || !request.tunnel) {
    return false
  }

  // Setup Proxy Header Exclusive List and White List
  if (options.proxyHeaderWhiteList) {
    self.proxyHeaderWhiteList = options.proxyHeaderWhiteList
  }
  if (options.proxyHeaderExclusiveList) {
    self.proxyHeaderExclusiveList = options.proxyHeaderExclusiveList
  }

  var proxyHeaderExclusiveList = self.proxyHeaderExclusiveList.concat(defaultProxyHeaderExclusiveList)
  var proxyHeaderWhiteList = self.proxyHeaderWhiteList.concat(proxyHeaderExclusiveList)

  // Setup Proxy Headers and Proxy Headers Host
  // Only send the Proxy White Listed Header names
  var proxyHeaders = constructProxyHeaderWhiteList(request.headers, proxyHeaderWhiteList)
  proxyHeaders.host = constructProxyHost(request.uri)

  proxyHeaderExclusiveList.forEach(request.removeHeader, request)

  // Set Agent from Tunnel Data
  var tunnelFn = getTunnelFn(request)
  var tunnelOptions = constructTunnelOptions(request, proxyHeaders)
  request.agent = tunnelFn(tunnelOptions)

  return true
}

Tunnel.defaultProxyHeaderWhiteList = defaultProxyHeaderWhiteList
Tunnel.defaultProxyHeaderExclusiveList = defaultProxyHeaderExclusiveList
exports.Tunnel = Tunnel


/***/ }),

/***/ "t1Ng":
/*!*****************************************************!*\
  !*** ./node_modules/request/lib/getProxyFromURI.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

function formatHostname (hostname) {
  // canonicalize the hostname, so that 'oogle.com' won't match 'google.com'
  return hostname.replace(/^\.*/, '.').toLowerCase()
}

function parseNoProxyZone (zone) {
  zone = zone.trim().toLowerCase()

  var zoneParts = zone.split(':', 2)
  var zoneHost = formatHostname(zoneParts[0])
  var zonePort = zoneParts[1]
  var hasPort = zone.indexOf(':') > -1

  return {hostname: zoneHost, port: zonePort, hasPort: hasPort}
}

function uriInNoProxy (uri, noProxy) {
  var port = uri.port || (uri.protocol === 'https:' ? '443' : '80')
  var hostname = formatHostname(uri.hostname)
  var noProxyList = noProxy.split(',')

  // iterate through the noProxyList until it finds a match.
  return noProxyList.map(parseNoProxyZone).some(function (noProxyZone) {
    var isMatchedAt = hostname.indexOf(noProxyZone.hostname)
    var hostnameMatched = (
      isMatchedAt > -1 &&
        (isMatchedAt === hostname.length - noProxyZone.hostname.length)
    )

    if (noProxyZone.hasPort) {
      return (port === noProxyZone.port) && hostnameMatched
    }

    return hostnameMatched
  })
}

function getProxyFromURI (uri) {
  // Decide the proper request proxy to use based on the request URI object and the
  // environmental variables (NO_PROXY, HTTP_PROXY, etc.)
  // respect NO_PROXY environment variables (see: http://lynx.isc.org/current/breakout/lynx_help/keystrokes/environments.html)

  var noProxy = process.env.NO_PROXY || process.env.no_proxy || ''

  // if the noProxy is a wildcard then return null

  if (noProxy === '*') {
    return null
  }

  // if the noProxy is not empty and the uri is found return null

  if (noProxy !== '' && uriInNoProxy(uri, noProxy)) {
    return null
  }

  // Check for HTTP or HTTPS Proxy in environment Else default to null

  if (uri.protocol === 'http:') {
    return process.env.HTTP_PROXY ||
      process.env.http_proxy || null
  }

  if (uri.protocol === 'https:') {
    return process.env.HTTPS_PROXY ||
      process.env.https_proxy ||
      process.env.HTTP_PROXY ||
      process.env.http_proxy || null
  }

  // if none of that works, return null
  // (What uri protocol are you using then?)

  return null
}

module.exports = getProxyFromURI

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "8oxB")))

/***/ }),

/***/ "zd8i":
/*!*******************************************!*\
  !*** ./node_modules/request/lib/oauth.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var url = __webpack_require__(/*! url */ "CxY0")
var qs = __webpack_require__(/*! qs */ "Qyje")
var caseless = __webpack_require__(/*! caseless */ "2loA")
var uuid = __webpack_require__(/*! uuid/v4 */ "xk4V")
var oauth = __webpack_require__(/*! oauth-sign */ "UC7N")
var crypto = __webpack_require__(/*! crypto */ "HEbw")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

function OAuth (request) {
  this.request = request
  this.params = null
}

OAuth.prototype.buildParams = function (_oauth, uri, method, query, form, qsLib) {
  var oa = {}
  for (var i in _oauth) {
    oa['oauth_' + i] = _oauth[i]
  }
  if (!oa.oauth_version) {
    oa.oauth_version = '1.0'
  }
  if (!oa.oauth_timestamp) {
    oa.oauth_timestamp = Math.floor(Date.now() / 1000).toString()
  }
  if (!oa.oauth_nonce) {
    oa.oauth_nonce = uuid().replace(/-/g, '')
  }
  if (!oa.oauth_signature_method) {
    oa.oauth_signature_method = 'HMAC-SHA1'
  }

  var consumer_secret_or_private_key = oa.oauth_consumer_secret || oa.oauth_private_key // eslint-disable-line camelcase
  delete oa.oauth_consumer_secret
  delete oa.oauth_private_key

  var token_secret = oa.oauth_token_secret // eslint-disable-line camelcase
  delete oa.oauth_token_secret

  var realm = oa.oauth_realm
  delete oa.oauth_realm
  delete oa.oauth_transport_method

  var baseurl = uri.protocol + '//' + uri.host + uri.pathname
  var params = qsLib.parse([].concat(query, form, qsLib.stringify(oa)).join('&'))

  oa.oauth_signature = oauth.sign(
    oa.oauth_signature_method,
    method,
    baseurl,
    params,
    consumer_secret_or_private_key, // eslint-disable-line camelcase
    token_secret // eslint-disable-line camelcase
  )

  if (realm) {
    oa.realm = realm
  }

  return oa
}

OAuth.prototype.buildBodyHash = function (_oauth, body) {
  if (['HMAC-SHA1', 'RSA-SHA1'].indexOf(_oauth.signature_method || 'HMAC-SHA1') < 0) {
    this.request.emit('error', new Error('oauth: ' + _oauth.signature_method +
      ' signature_method not supported with body_hash signing.'))
  }

  var shasum = crypto.createHash('sha1')
  shasum.update(body || '')
  var sha1 = shasum.digest('hex')

  return Buffer.from(sha1, 'hex').toString('base64')
}

OAuth.prototype.concatParams = function (oa, sep, wrap) {
  wrap = wrap || ''

  var params = Object.keys(oa).filter(function (i) {
    return i !== 'realm' && i !== 'oauth_signature'
  }).sort()

  if (oa.realm) {
    params.splice(0, 0, 'realm')
  }
  params.push('oauth_signature')

  return params.map(function (i) {
    return i + '=' + wrap + oauth.rfc3986(oa[i]) + wrap
  }).join(sep)
}

OAuth.prototype.onRequest = function (_oauth) {
  var self = this
  self.params = _oauth

  var uri = self.request.uri || {}
  var method = self.request.method || ''
  var headers = caseless(self.request.headers)
  var body = self.request.body || ''
  var qsLib = self.request.qsLib || qs

  var form
  var query
  var contentType = headers.get('content-type') || ''
  var formContentType = 'application/x-www-form-urlencoded'
  var transport = _oauth.transport_method || 'header'

  if (contentType.slice(0, formContentType.length) === formContentType) {
    contentType = formContentType
    form = body
  }
  if (uri.query) {
    query = uri.query
  }
  if (transport === 'body' && (method !== 'POST' || contentType !== formContentType)) {
    self.request.emit('error', new Error('oauth: transport_method of body requires POST ' +
      'and content-type ' + formContentType))
  }

  if (!form && typeof _oauth.body_hash === 'boolean') {
    _oauth.body_hash = self.buildBodyHash(_oauth, self.request.body.toString())
  }

  var oa = self.buildParams(_oauth, uri, method, query, form, qsLib)

  switch (transport) {
    case 'header':
      self.request.setHeader('Authorization', 'OAuth ' + self.concatParams(oa, ',', '"'))
      break

    case 'query':
      var href = self.request.uri.href += (query ? '&' : '?') + self.concatParams(oa, '&')
      self.request.uri = url.parse(href)
      self.request.path = self.request.uri.path
      break

    case 'body':
      self.request.body = (form ? form + '&' : '') + self.concatParams(oa, '&')
      break

    default:
      self.request.emit('error', new Error('oauth: transport_method invalid'))
  }
}

exports.OAuth = OAuth


/***/ }),

/***/ "ztjF":
/*!*****************************************!*\
  !*** ./node_modules/request/lib/har.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fs = __webpack_require__(/*! fs */ "Po9p")
var qs = __webpack_require__(/*! querystring */ "s4NR")
var validate = __webpack_require__(/*! har-validator */ "5cyC")
var extend = __webpack_require__(/*! extend */ "6dBs")

function Har (request) {
  this.request = request
}

Har.prototype.reducer = function (obj, pair) {
  // new property ?
  if (obj[pair.name] === undefined) {
    obj[pair.name] = pair.value
    return obj
  }

  // existing? convert to array
  var arr = [
    obj[pair.name],
    pair.value
  ]

  obj[pair.name] = arr

  return obj
}

Har.prototype.prep = function (data) {
  // construct utility properties
  data.queryObj = {}
  data.headersObj = {}
  data.postData.jsonObj = false
  data.postData.paramsObj = false

  // construct query objects
  if (data.queryString && data.queryString.length) {
    data.queryObj = data.queryString.reduce(this.reducer, {})
  }

  // construct headers objects
  if (data.headers && data.headers.length) {
    // loweCase header keys
    data.headersObj = data.headers.reduceRight(function (headers, header) {
      headers[header.name] = header.value
      return headers
    }, {})
  }

  // construct Cookie header
  if (data.cookies && data.cookies.length) {
    var cookies = data.cookies.map(function (cookie) {
      return cookie.name + '=' + cookie.value
    })

    if (cookies.length) {
      data.headersObj.cookie = cookies.join('; ')
    }
  }

  // prep body
  function some (arr) {
    return arr.some(function (type) {
      return data.postData.mimeType.indexOf(type) === 0
    })
  }

  if (some([
    'multipart/mixed',
    'multipart/related',
    'multipart/form-data',
    'multipart/alternative'])) {
    // reset values
    data.postData.mimeType = 'multipart/form-data'
  } else if (some([
    'application/x-www-form-urlencoded'])) {
    if (!data.postData.params) {
      data.postData.text = ''
    } else {
      data.postData.paramsObj = data.postData.params.reduce(this.reducer, {})

      // always overwrite
      data.postData.text = qs.stringify(data.postData.paramsObj)
    }
  } else if (some([
    'text/json',
    'text/x-json',
    'application/json',
    'application/x-json'])) {
    data.postData.mimeType = 'application/json'

    if (data.postData.text) {
      try {
        data.postData.jsonObj = JSON.parse(data.postData.text)
      } catch (e) {
        this.request.debug(e)

        // force back to text/plain
        data.postData.mimeType = 'text/plain'
      }
    }
  }

  return data
}

Har.prototype.options = function (options) {
  // skip if no har property defined
  if (!options.har) {
    return options
  }

  var har = {}
  extend(har, options.har)

  // only process the first entry
  if (har.log && har.log.entries) {
    har = har.log.entries[0]
  }

  // add optional properties to make validation successful
  har.url = har.url || options.url || options.uri || options.baseUrl || '/'
  har.httpVersion = har.httpVersion || 'HTTP/1.1'
  har.queryString = har.queryString || []
  har.headers = har.headers || []
  har.cookies = har.cookies || []
  har.postData = har.postData || {}
  har.postData.mimeType = har.postData.mimeType || 'application/octet-stream'

  har.bodySize = 0
  har.headersSize = 0
  har.postData.size = 0

  if (!validate.request(har)) {
    return options
  }

  // clean up and get some utility properties
  var req = this.prep(har)

  // construct new options
  if (req.url) {
    options.url = req.url
  }

  if (req.method) {
    options.method = req.method
  }

  if (Object.keys(req.queryObj).length) {
    options.qs = req.queryObj
  }

  if (Object.keys(req.headersObj).length) {
    options.headers = req.headersObj
  }

  function test (type) {
    return req.postData.mimeType.indexOf(type) === 0
  }
  if (test('application/x-www-form-urlencoded')) {
    options.form = req.postData.paramsObj
  } else if (test('application/json')) {
    if (req.postData.jsonObj) {
      options.body = req.postData.jsonObj
      options.json = true
    }
  } else if (test('multipart/form-data')) {
    options.formData = {}

    req.postData.params.forEach(function (param) {
      var attachment = {}

      if (!param.fileName && !param.fileName && !param.contentType) {
        options.formData[param.name] = param.value
        return
      }

      // attempt to read from disk!
      if (param.fileName && !param.value) {
        attachment.value = fs.createReadStream(param.fileName)
      } else if (param.value) {
        attachment.value = param.value
      }

      if (param.fileName) {
        attachment.options = {
          filename: param.fileName,
          contentType: param.contentType ? param.contentType : null
        }
      }

      options.formData[param.name] = attachment
    })
  } else {
    if (req.postData.text) {
      options.body = req.postData.text
    }
  }

  return options
}

exports.Har = Har


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVxdWVzdC9saWIvY29va2llcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVxdWVzdC9saWIvaGVscGVycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVxdWVzdC9saWIvcXVlcnlzdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlcXVlc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlcXVlc3QvbGliL211bHRpcGFydC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVxdWVzdC9yZXF1ZXN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZXF1ZXN0L2xpYi9oYXdrLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZXF1ZXN0L2xpYi9hdXRoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZXF1ZXN0L2xpYi9yZWRpcmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVxdWVzdC9saWIvdHVubmVsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZXF1ZXN0L2xpYi9nZXRQcm94eUZyb21VUkkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlcXVlc3QvbGliL29hdXRoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZXF1ZXN0L2xpYi9oYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFZOztBQUVaLFlBQVksbUJBQU8sQ0FBQywwQkFBYzs7QUFFbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixZQUFZO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxnQkFBZ0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFO0FBQ2hFO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHdDQUF3QyxxQkFBcUIsMkNBQTJDO0FBQ3hHOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixzQkFBc0I7QUFDL0M7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0VBQXNFLGlDQUFpQztBQUN2RztBQUNBOztBQUVBO0FBQ0EsMEVBQTBFLGlDQUFpQztBQUMzRztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxtREFBbUQsc0JBQXNCO0FBQ3pFLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0Esd0JBQXdCO0FBQ3hCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsNkNBQTZDO0FBQzdDO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELGtCQUFrQjtBQUMxRSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMLDZDQUE2QyxxQkFBcUI7O0FBRWxFO0FBQ0E7QUFDQSxLQUFLLE9BQU87QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLElBQUk7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUssSUFBSTtBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDOUtBLCtDQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFD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QUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IucmVxdWVzdC5mZTVlOWVkZDIwZTE0NzY0Y2I0Ny5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIHRvdWdoID0gcmVxdWlyZSgndG91Z2gtY29va2llJylcclxuXHJcbnZhciBDb29raWUgPSB0b3VnaC5Db29raWVcclxudmFyIENvb2tpZUphciA9IHRvdWdoLkNvb2tpZUphclxyXG5cclxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICBpZiAoc3RyICYmIHN0ci51cmkpIHtcclxuICAgIHN0ciA9IHN0ci51cmlcclxuICB9XHJcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb29raWUgZnVuY3Rpb24gb25seSBhY2NlcHRzIFNUUklORyBhcyBwYXJhbScpXHJcbiAgfVxyXG4gIHJldHVybiBDb29raWUucGFyc2Uoc3RyLCB7bG9vc2U6IHRydWV9KVxyXG59XHJcblxyXG4vLyBBZGFwdCB0aGUgc29tZXRpbWVzLUFzeW5jIGFwaSBvZiB0b3VnaC5Db29raWVKYXIgdG8gb3VyIHJlcXVpcmVtZW50c1xyXG5mdW5jdGlvbiBSZXF1ZXN0SmFyIChzdG9yZSkge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIHNlbGYuX2phciA9IG5ldyBDb29raWVKYXIoc3RvcmUsIHtsb29zZU1vZGU6IHRydWV9KVxyXG59XHJcblJlcXVlc3RKYXIucHJvdG90eXBlLnNldENvb2tpZSA9IGZ1bmN0aW9uIChjb29raWVPclN0ciwgdXJpLCBvcHRpb25zKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgcmV0dXJuIHNlbGYuX2phci5zZXRDb29raWVTeW5jKGNvb2tpZU9yU3RyLCB1cmksIG9wdGlvbnMgfHwge30pXHJcbn1cclxuUmVxdWVzdEphci5wcm90b3R5cGUuZ2V0Q29va2llU3RyaW5nID0gZnVuY3Rpb24gKHVyaSkge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIHJldHVybiBzZWxmLl9qYXIuZ2V0Q29va2llU3RyaW5nU3luYyh1cmkpXHJcbn1cclxuUmVxdWVzdEphci5wcm90b3R5cGUuZ2V0Q29va2llcyA9IGZ1bmN0aW9uICh1cmkpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICByZXR1cm4gc2VsZi5famFyLmdldENvb2tpZXNTeW5jKHVyaSlcclxufVxyXG5cclxuZXhwb3J0cy5qYXIgPSBmdW5jdGlvbiAoc3RvcmUpIHtcclxuICByZXR1cm4gbmV3IFJlcXVlc3RKYXIoc3RvcmUpXHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIganNvblNhZmVTdHJpbmdpZnkgPSByZXF1aXJlKCdqc29uLXN0cmluZ2lmeS1zYWZlJylcclxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG5cclxudmFyIGRlZmVyID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gJ3VuZGVmaW5lZCdcclxuICA/IHByb2Nlc3MubmV4dFRpY2tcclxuICA6IHNldEltbWVkaWF0ZVxyXG5cclxuZnVuY3Rpb24gcGFyYW1zSGF2ZVJlcXVlc3RCb2R5IChwYXJhbXMpIHtcclxuICByZXR1cm4gKFxyXG4gICAgcGFyYW1zLmJvZHkgfHxcclxuICAgIHBhcmFtcy5yZXF1ZXN0Qm9keVN0cmVhbSB8fFxyXG4gICAgKHBhcmFtcy5qc29uICYmIHR5cGVvZiBwYXJhbXMuanNvbiAhPT0gJ2Jvb2xlYW4nKSB8fFxyXG4gICAgcGFyYW1zLm11bHRpcGFydFxyXG4gIClcclxufVxyXG5cclxuZnVuY3Rpb24gc2FmZVN0cmluZ2lmeSAob2JqLCByZXBsYWNlcikge1xyXG4gIHZhciByZXRcclxuICB0cnkge1xyXG4gICAgcmV0ID0gSlNPTi5zdHJpbmdpZnkob2JqLCByZXBsYWNlcilcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICByZXQgPSBqc29uU2FmZVN0cmluZ2lmeShvYmosIHJlcGxhY2VyKVxyXG4gIH1cclxuICByZXR1cm4gcmV0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1kNSAoc3RyKSB7XHJcbiAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdtZDUnKS51cGRhdGUoc3RyKS5kaWdlc3QoJ2hleCcpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzUmVhZFN0cmVhbSAocnMpIHtcclxuICByZXR1cm4gcnMucmVhZGFibGUgJiYgcnMucGF0aCAmJiBycy5tb2RlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvQmFzZTY0IChzdHIpIHtcclxuICByZXR1cm4gQnVmZmVyLmZyb20oc3RyIHx8ICcnLCAndXRmOCcpLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb3B5IChvYmopIHtcclxuICB2YXIgbyA9IHt9XHJcbiAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChpKSB7XHJcbiAgICBvW2ldID0gb2JqW2ldXHJcbiAgfSlcclxuICByZXR1cm4gb1xyXG59XHJcblxyXG5mdW5jdGlvbiB2ZXJzaW9uICgpIHtcclxuICB2YXIgbnVtYmVycyA9IHByb2Nlc3MudmVyc2lvbi5yZXBsYWNlKCd2JywgJycpLnNwbGl0KCcuJylcclxuICByZXR1cm4ge1xyXG4gICAgbWFqb3I6IHBhcnNlSW50KG51bWJlcnNbMF0sIDEwKSxcclxuICAgIG1pbm9yOiBwYXJzZUludChudW1iZXJzWzFdLCAxMCksXHJcbiAgICBwYXRjaDogcGFyc2VJbnQobnVtYmVyc1syXSwgMTApXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnRzLnBhcmFtc0hhdmVSZXF1ZXN0Qm9keSA9IHBhcmFtc0hhdmVSZXF1ZXN0Qm9keVxyXG5leHBvcnRzLnNhZmVTdHJpbmdpZnkgPSBzYWZlU3RyaW5naWZ5XHJcbmV4cG9ydHMubWQ1ID0gbWQ1XHJcbmV4cG9ydHMuaXNSZWFkU3RyZWFtID0gaXNSZWFkU3RyZWFtXHJcbmV4cG9ydHMudG9CYXNlNjQgPSB0b0Jhc2U2NFxyXG5leHBvcnRzLmNvcHkgPSBjb3B5XHJcbmV4cG9ydHMudmVyc2lvbiA9IHZlcnNpb25cclxuZXhwb3J0cy5kZWZlciA9IGRlZmVyXHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIHFzID0gcmVxdWlyZSgncXMnKVxyXG52YXIgcXVlcnlzdHJpbmcgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpXHJcblxyXG5mdW5jdGlvbiBRdWVyeXN0cmluZyAocmVxdWVzdCkge1xyXG4gIHRoaXMucmVxdWVzdCA9IHJlcXVlc3RcclxuICB0aGlzLmxpYiA9IG51bGxcclxuICB0aGlzLnVzZVF1ZXJ5c3RyaW5nID0gbnVsbFxyXG4gIHRoaXMucGFyc2VPcHRpb25zID0gbnVsbFxyXG4gIHRoaXMuc3RyaW5naWZ5T3B0aW9ucyA9IG51bGxcclxufVxyXG5cclxuUXVlcnlzdHJpbmcucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gIGlmICh0aGlzLmxpYikgeyByZXR1cm4gfVxyXG5cclxuICB0aGlzLnVzZVF1ZXJ5c3RyaW5nID0gb3B0aW9ucy51c2VRdWVyeXN0cmluZ1xyXG4gIHRoaXMubGliID0gKHRoaXMudXNlUXVlcnlzdHJpbmcgPyBxdWVyeXN0cmluZyA6IHFzKVxyXG5cclxuICB0aGlzLnBhcnNlT3B0aW9ucyA9IG9wdGlvbnMucXNQYXJzZU9wdGlvbnMgfHwge31cclxuICB0aGlzLnN0cmluZ2lmeU9wdGlvbnMgPSBvcHRpb25zLnFzU3RyaW5naWZ5T3B0aW9ucyB8fCB7fVxyXG59XHJcblxyXG5RdWVyeXN0cmluZy5wcm90b3R5cGUuc3RyaW5naWZ5ID0gZnVuY3Rpb24gKG9iaikge1xyXG4gIHJldHVybiAodGhpcy51c2VRdWVyeXN0cmluZylcclxuICAgID8gdGhpcy5yZmMzOTg2KHRoaXMubGliLnN0cmluZ2lmeShvYmosXHJcbiAgICAgIHRoaXMuc3RyaW5naWZ5T3B0aW9ucy5zZXAgfHwgbnVsbCxcclxuICAgICAgdGhpcy5zdHJpbmdpZnlPcHRpb25zLmVxIHx8IG51bGwsXHJcbiAgICAgIHRoaXMuc3RyaW5naWZ5T3B0aW9ucykpXHJcbiAgICA6IHRoaXMubGliLnN0cmluZ2lmeShvYmosIHRoaXMuc3RyaW5naWZ5T3B0aW9ucylcclxufVxyXG5cclxuUXVlcnlzdHJpbmcucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gKHN0cikge1xyXG4gIHJldHVybiAodGhpcy51c2VRdWVyeXN0cmluZylcclxuICAgID8gdGhpcy5saWIucGFyc2Uoc3RyLFxyXG4gICAgICB0aGlzLnBhcnNlT3B0aW9ucy5zZXAgfHwgbnVsbCxcclxuICAgICAgdGhpcy5wYXJzZU9wdGlvbnMuZXEgfHwgbnVsbCxcclxuICAgICAgdGhpcy5wYXJzZU9wdGlvbnMpXHJcbiAgICA6IHRoaXMubGliLnBhcnNlKHN0ciwgdGhpcy5wYXJzZU9wdGlvbnMpXHJcbn1cclxuXHJcblF1ZXJ5c3RyaW5nLnByb3RvdHlwZS5yZmMzOTg2ID0gZnVuY3Rpb24gKHN0cikge1xyXG4gIHJldHVybiBzdHIucmVwbGFjZSgvWyEnKCkqXS9nLCBmdW5jdGlvbiAoYykge1xyXG4gICAgcmV0dXJuICclJyArIGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKVxyXG4gIH0pXHJcbn1cclxuXHJcblF1ZXJ5c3RyaW5nLnByb3RvdHlwZS51bmVzY2FwZSA9IHF1ZXJ5c3RyaW5nLnVuZXNjYXBlXHJcblxyXG5leHBvcnRzLlF1ZXJ5c3RyaW5nID0gUXVlcnlzdHJpbmdcclxuIiwiLy8gQ29weXJpZ2h0IDIwMTAtMjAxMiBNaWtlYWwgUm9nZXJzXHJcbi8vXHJcbi8vICAgIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbi8vICAgIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuLy8gICAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbi8vXHJcbi8vICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuLy9cclxuLy8gICAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4vLyAgICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbi8vICAgIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4vLyAgICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbi8vICAgIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG5cclxuJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJylcclxudmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuL2xpYi9jb29raWVzJylcclxudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL2xpYi9oZWxwZXJzJylcclxuXHJcbnZhciBwYXJhbXNIYXZlUmVxdWVzdEJvZHkgPSBoZWxwZXJzLnBhcmFtc0hhdmVSZXF1ZXN0Qm9keVxyXG5cclxuLy8gb3JnYW5pemUgcGFyYW1zIGZvciBwYXRjaCwgcG9zdCwgcHV0LCBoZWFkLCBkZWxcclxuZnVuY3Rpb24gaW5pdFBhcmFtcyAodXJpLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgY2FsbGJhY2sgPSBvcHRpb25zXHJcbiAgfVxyXG5cclxuICB2YXIgcGFyYW1zID0ge31cclxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XHJcbiAgICBleHRlbmQocGFyYW1zLCBvcHRpb25zLCB7dXJpOiB1cml9KVxyXG4gIH0gZWxzZSBpZiAodHlwZW9mIHVyaSA9PT0gJ3N0cmluZycpIHtcclxuICAgIGV4dGVuZChwYXJhbXMsIHt1cmk6IHVyaX0pXHJcbiAgfSBlbHNlIHtcclxuICAgIGV4dGVuZChwYXJhbXMsIHVyaSlcclxuICB9XHJcblxyXG4gIHBhcmFtcy5jYWxsYmFjayA9IGNhbGxiYWNrIHx8IHBhcmFtcy5jYWxsYmFja1xyXG4gIHJldHVybiBwYXJhbXNcclxufVxyXG5cclxuZnVuY3Rpb24gcmVxdWVzdCAodXJpLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gIGlmICh0eXBlb2YgdXJpID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1bmRlZmluZWQgaXMgbm90IGEgdmFsaWQgdXJpIG9yIG9wdGlvbnMgb2JqZWN0LicpXHJcbiAgfVxyXG5cclxuICB2YXIgcGFyYW1zID0gaW5pdFBhcmFtcyh1cmksIG9wdGlvbnMsIGNhbGxiYWNrKVxyXG5cclxuICBpZiAocGFyYW1zLm1ldGhvZCA9PT0gJ0hFQUQnICYmIHBhcmFtc0hhdmVSZXF1ZXN0Qm9keShwYXJhbXMpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0hUVFAgSEVBRCByZXF1ZXN0cyBNVVNUIE5PVCBpbmNsdWRlIGEgcmVxdWVzdCBib2R5LicpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IHJlcXVlc3QuUmVxdWVzdChwYXJhbXMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZlcmJGdW5jICh2ZXJiKSB7XHJcbiAgdmFyIG1ldGhvZCA9IHZlcmIudG9VcHBlckNhc2UoKVxyXG4gIHJldHVybiBmdW5jdGlvbiAodXJpLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHBhcmFtcyA9IGluaXRQYXJhbXModXJpLCBvcHRpb25zLCBjYWxsYmFjaylcclxuICAgIHBhcmFtcy5tZXRob2QgPSBtZXRob2RcclxuICAgIHJldHVybiByZXF1ZXN0KHBhcmFtcywgcGFyYW1zLmNhbGxiYWNrKVxyXG4gIH1cclxufVxyXG5cclxuLy8gZGVmaW5lIGxpa2UgdGhpcyB0byBwbGVhc2UgY29kZWludGVsL2ludGVsbGlzZW5zZSBJREVzXHJcbnJlcXVlc3QuZ2V0ID0gdmVyYkZ1bmMoJ2dldCcpXHJcbnJlcXVlc3QuaGVhZCA9IHZlcmJGdW5jKCdoZWFkJylcclxucmVxdWVzdC5vcHRpb25zID0gdmVyYkZ1bmMoJ29wdGlvbnMnKVxyXG5yZXF1ZXN0LnBvc3QgPSB2ZXJiRnVuYygncG9zdCcpXHJcbnJlcXVlc3QucHV0ID0gdmVyYkZ1bmMoJ3B1dCcpXHJcbnJlcXVlc3QucGF0Y2ggPSB2ZXJiRnVuYygncGF0Y2gnKVxyXG5yZXF1ZXN0LmRlbCA9IHZlcmJGdW5jKCdkZWxldGUnKVxyXG5yZXF1ZXN0WydkZWxldGUnXSA9IHZlcmJGdW5jKCdkZWxldGUnKVxyXG5cclxucmVxdWVzdC5qYXIgPSBmdW5jdGlvbiAoc3RvcmUpIHtcclxuICByZXR1cm4gY29va2llcy5qYXIoc3RvcmUpXHJcbn1cclxuXHJcbnJlcXVlc3QuY29va2llID0gZnVuY3Rpb24gKHN0cikge1xyXG4gIHJldHVybiBjb29raWVzLnBhcnNlKHN0cilcclxufVxyXG5cclxuZnVuY3Rpb24gd3JhcFJlcXVlc3RNZXRob2QgKG1ldGhvZCwgb3B0aW9ucywgcmVxdWVzdGVyLCB2ZXJiKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICh1cmksIG9wdHMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgcGFyYW1zID0gaW5pdFBhcmFtcyh1cmksIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuICAgIHZhciB0YXJnZXQgPSB7fVxyXG4gICAgZXh0ZW5kKHRydWUsIHRhcmdldCwgb3B0aW9ucywgcGFyYW1zKVxyXG5cclxuICAgIHRhcmdldC5wb29sID0gcGFyYW1zLnBvb2wgfHwgb3B0aW9ucy5wb29sXHJcblxyXG4gICAgaWYgKHZlcmIpIHtcclxuICAgICAgdGFyZ2V0Lm1ldGhvZCA9IHZlcmIudG9VcHBlckNhc2UoKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgcmVxdWVzdGVyID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIG1ldGhvZCA9IHJlcXVlc3RlclxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtZXRob2QodGFyZ2V0LCB0YXJnZXQuY2FsbGJhY2spXHJcbiAgfVxyXG59XHJcblxyXG5yZXF1ZXN0LmRlZmF1bHRzID0gZnVuY3Rpb24gKG9wdGlvbnMsIHJlcXVlc3Rlcikge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG5cclxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxyXG5cclxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIHJlcXVlc3RlciA9IG9wdGlvbnNcclxuICAgIG9wdGlvbnMgPSB7fVxyXG4gIH1cclxuXHJcbiAgdmFyIGRlZmF1bHRzID0gd3JhcFJlcXVlc3RNZXRob2Qoc2VsZiwgb3B0aW9ucywgcmVxdWVzdGVyKVxyXG5cclxuICB2YXIgdmVyYnMgPSBbJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbCcsICdkZWxldGUnXVxyXG4gIHZlcmJzLmZvckVhY2goZnVuY3Rpb24gKHZlcmIpIHtcclxuICAgIGRlZmF1bHRzW3ZlcmJdID0gd3JhcFJlcXVlc3RNZXRob2Qoc2VsZlt2ZXJiXSwgb3B0aW9ucywgcmVxdWVzdGVyLCB2ZXJiKVxyXG4gIH0pXHJcblxyXG4gIGRlZmF1bHRzLmNvb2tpZSA9IHdyYXBSZXF1ZXN0TWV0aG9kKHNlbGYuY29va2llLCBvcHRpb25zLCByZXF1ZXN0ZXIpXHJcbiAgZGVmYXVsdHMuamFyID0gc2VsZi5qYXJcclxuICBkZWZhdWx0cy5kZWZhdWx0cyA9IHNlbGYuZGVmYXVsdHNcclxuICByZXR1cm4gZGVmYXVsdHNcclxufVxyXG5cclxucmVxdWVzdC5mb3JldmVyID0gZnVuY3Rpb24gKGFnZW50T3B0aW9ucywgb3B0aW9uc0FyZykge1xyXG4gIHZhciBvcHRpb25zID0ge31cclxuICBpZiAob3B0aW9uc0FyZykge1xyXG4gICAgZXh0ZW5kKG9wdGlvbnMsIG9wdGlvbnNBcmcpXHJcbiAgfVxyXG4gIGlmIChhZ2VudE9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMuYWdlbnRPcHRpb25zID0gYWdlbnRPcHRpb25zXHJcbiAgfVxyXG5cclxuICBvcHRpb25zLmZvcmV2ZXIgPSB0cnVlXHJcbiAgcmV0dXJuIHJlcXVlc3QuZGVmYXVsdHMob3B0aW9ucylcclxufVxyXG5cclxuLy8gRXhwb3J0c1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByZXF1ZXN0XHJcbnJlcXVlc3QuUmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpXHJcbnJlcXVlc3QuaW5pdFBhcmFtcyA9IGluaXRQYXJhbXNcclxuXHJcbi8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGZvciByZXF1ZXN0LmRlYnVnXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1ZXN0LCAnZGVidWcnLCB7XHJcbiAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiByZXF1ZXN0LlJlcXVlc3QuZGVidWdcclxuICB9LFxyXG4gIHNldDogZnVuY3Rpb24gKGRlYnVnKSB7XHJcbiAgICByZXF1ZXN0LlJlcXVlc3QuZGVidWcgPSBkZWJ1Z1xyXG4gIH1cclxufSlcclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgdXVpZCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxyXG52YXIgQ29tYmluZWRTdHJlYW0gPSByZXF1aXJlKCdjb21iaW5lZC1zdHJlYW0nKVxyXG52YXIgaXNzdHJlYW0gPSByZXF1aXJlKCdpc3N0cmVhbScpXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG5cclxuZnVuY3Rpb24gTXVsdGlwYXJ0IChyZXF1ZXN0KSB7XHJcbiAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdFxyXG4gIHRoaXMuYm91bmRhcnkgPSB1dWlkKClcclxuICB0aGlzLmNodW5rZWQgPSBmYWxzZVxyXG4gIHRoaXMuYm9keSA9IG51bGxcclxufVxyXG5cclxuTXVsdGlwYXJ0LnByb3RvdHlwZS5pc0NodW5rZWQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIHZhciBjaHVua2VkID0gZmFsc2VcclxuICB2YXIgcGFydHMgPSBvcHRpb25zLmRhdGEgfHwgb3B0aW9uc1xyXG5cclxuICBpZiAoIXBhcnRzLmZvckVhY2gpIHtcclxuICAgIHNlbGYucmVxdWVzdC5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignQXJndW1lbnQgZXJyb3IsIG9wdGlvbnMubXVsdGlwYXJ0LicpKVxyXG4gIH1cclxuXHJcbiAgaWYgKG9wdGlvbnMuY2h1bmtlZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBjaHVua2VkID0gb3B0aW9ucy5jaHVua2VkXHJcbiAgfVxyXG5cclxuICBpZiAoc2VsZi5yZXF1ZXN0LmdldEhlYWRlcigndHJhbnNmZXItZW5jb2RpbmcnKSA9PT0gJ2NodW5rZWQnKSB7XHJcbiAgICBjaHVua2VkID0gdHJ1ZVxyXG4gIH1cclxuXHJcbiAgaWYgKCFjaHVua2VkKSB7XHJcbiAgICBwYXJ0cy5mb3JFYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XHJcbiAgICAgIGlmICh0eXBlb2YgcGFydC5ib2R5ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHNlbGYucmVxdWVzdC5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignQm9keSBhdHRyaWJ1dGUgbWlzc2luZyBpbiBtdWx0aXBhcnQuJykpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKGlzc3RyZWFtKHBhcnQuYm9keSkpIHtcclxuICAgICAgICBjaHVua2VkID0gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNodW5rZWRcclxufVxyXG5cclxuTXVsdGlwYXJ0LnByb3RvdHlwZS5zZXRIZWFkZXJzID0gZnVuY3Rpb24gKGNodW5rZWQpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuXHJcbiAgaWYgKGNodW5rZWQgJiYgIXNlbGYucmVxdWVzdC5oYXNIZWFkZXIoJ3RyYW5zZmVyLWVuY29kaW5nJykpIHtcclxuICAgIHNlbGYucmVxdWVzdC5zZXRIZWFkZXIoJ3RyYW5zZmVyLWVuY29kaW5nJywgJ2NodW5rZWQnKVxyXG4gIH1cclxuXHJcbiAgdmFyIGhlYWRlciA9IHNlbGYucmVxdWVzdC5nZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScpXHJcblxyXG4gIGlmICghaGVhZGVyIHx8IGhlYWRlci5pbmRleE9mKCdtdWx0aXBhcnQnKSA9PT0gLTEpIHtcclxuICAgIHNlbGYucmVxdWVzdC5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdtdWx0aXBhcnQvcmVsYXRlZDsgYm91bmRhcnk9JyArIHNlbGYuYm91bmRhcnkpXHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChoZWFkZXIuaW5kZXhPZignYm91bmRhcnknKSAhPT0gLTEpIHtcclxuICAgICAgc2VsZi5ib3VuZGFyeSA9IGhlYWRlci5yZXBsYWNlKC8uKmJvdW5kYXJ5PShbXlxccztdKykuKi8sICckMScpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZWxmLnJlcXVlc3Quc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCBoZWFkZXIgKyAnOyBib3VuZGFyeT0nICsgc2VsZi5ib3VuZGFyeSlcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbk11bHRpcGFydC5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbiAocGFydHMsIGNodW5rZWQpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICB2YXIgYm9keSA9IGNodW5rZWQgPyBuZXcgQ29tYmluZWRTdHJlYW0oKSA6IFtdXHJcblxyXG4gIGZ1bmN0aW9uIGFkZCAocGFydCkge1xyXG4gICAgaWYgKHR5cGVvZiBwYXJ0ID09PSAnbnVtYmVyJykge1xyXG4gICAgICBwYXJ0ID0gcGFydC50b1N0cmluZygpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2h1bmtlZCA/IGJvZHkuYXBwZW5kKHBhcnQpIDogYm9keS5wdXNoKEJ1ZmZlci5mcm9tKHBhcnQpKVxyXG4gIH1cclxuXHJcbiAgaWYgKHNlbGYucmVxdWVzdC5wcmVhbWJsZUNSTEYpIHtcclxuICAgIGFkZCgnXFxyXFxuJylcclxuICB9XHJcblxyXG4gIHBhcnRzLmZvckVhY2goZnVuY3Rpb24gKHBhcnQpIHtcclxuICAgIHZhciBwcmVhbWJsZSA9ICctLScgKyBzZWxmLmJvdW5kYXJ5ICsgJ1xcclxcbidcclxuICAgIE9iamVjdC5rZXlzKHBhcnQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICBpZiAoa2V5ID09PSAnYm9keScpIHsgcmV0dXJuIH1cclxuICAgICAgcHJlYW1ibGUgKz0ga2V5ICsgJzogJyArIHBhcnRba2V5XSArICdcXHJcXG4nXHJcbiAgICB9KVxyXG4gICAgcHJlYW1ibGUgKz0gJ1xcclxcbidcclxuICAgIGFkZChwcmVhbWJsZSlcclxuICAgIGFkZChwYXJ0LmJvZHkpXHJcbiAgICBhZGQoJ1xcclxcbicpXHJcbiAgfSlcclxuICBhZGQoJy0tJyArIHNlbGYuYm91bmRhcnkgKyAnLS0nKVxyXG5cclxuICBpZiAoc2VsZi5yZXF1ZXN0LnBvc3RhbWJsZUNSTEYpIHtcclxuICAgIGFkZCgnXFxyXFxuJylcclxuICB9XHJcblxyXG4gIHJldHVybiBib2R5XHJcbn1cclxuXHJcbk11bHRpcGFydC5wcm90b3R5cGUub25SZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuXHJcbiAgdmFyIGNodW5rZWQgPSBzZWxmLmlzQ2h1bmtlZChvcHRpb25zKVxyXG4gIHZhciBwYXJ0cyA9IG9wdGlvbnMuZGF0YSB8fCBvcHRpb25zXHJcblxyXG4gIHNlbGYuc2V0SGVhZGVycyhjaHVua2VkKVxyXG4gIHNlbGYuY2h1bmtlZCA9IGNodW5rZWRcclxuICBzZWxmLmJvZHkgPSBzZWxmLmJ1aWxkKHBhcnRzLCBjaHVua2VkKVxyXG59XHJcblxyXG5leHBvcnRzLk11bHRpcGFydCA9IE11bHRpcGFydFxyXG4iLCIndXNlIHN0cmljdCdcclxuXHJcbnZhciBodHRwID0gcmVxdWlyZSgnaHR0cCcpXHJcbnZhciBodHRwcyA9IHJlcXVpcmUoJ2h0dHBzJylcclxudmFyIHVybCA9IHJlcXVpcmUoJ3VybCcpXHJcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpXHJcbnZhciBzdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKVxyXG52YXIgemxpYiA9IHJlcXVpcmUoJ3psaWInKVxyXG52YXIgYXdzMiA9IHJlcXVpcmUoJ2F3cy1zaWduMicpXHJcbnZhciBhd3M0ID0gcmVxdWlyZSgnYXdzNCcpXHJcbnZhciBodHRwU2lnbmF0dXJlID0gcmVxdWlyZSgnaHR0cC1zaWduYXR1cmUnKVxyXG52YXIgbWltZSA9IHJlcXVpcmUoJ21pbWUtdHlwZXMnKVxyXG52YXIgY2FzZWxlc3MgPSByZXF1aXJlKCdjYXNlbGVzcycpXHJcbnZhciBGb3JldmVyQWdlbnQgPSByZXF1aXJlKCdmb3JldmVyLWFnZW50JylcclxudmFyIEZvcm1EYXRhID0gcmVxdWlyZSgnZm9ybS1kYXRhJylcclxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpXHJcbnZhciBpc3N0cmVhbSA9IHJlcXVpcmUoJ2lzc3RyZWFtJylcclxudmFyIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJ2lzLXR5cGVkYXJyYXknKS5zdHJpY3RcclxudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL2xpYi9oZWxwZXJzJylcclxudmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuL2xpYi9jb29raWVzJylcclxudmFyIGdldFByb3h5RnJvbVVSSSA9IHJlcXVpcmUoJy4vbGliL2dldFByb3h5RnJvbVVSSScpXHJcbnZhciBRdWVyeXN0cmluZyA9IHJlcXVpcmUoJy4vbGliL3F1ZXJ5c3RyaW5nJykuUXVlcnlzdHJpbmdcclxudmFyIEhhciA9IHJlcXVpcmUoJy4vbGliL2hhcicpLkhhclxyXG52YXIgQXV0aCA9IHJlcXVpcmUoJy4vbGliL2F1dGgnKS5BdXRoXHJcbnZhciBPQXV0aCA9IHJlcXVpcmUoJy4vbGliL29hdXRoJykuT0F1dGhcclxudmFyIGhhd2sgPSByZXF1aXJlKCcuL2xpYi9oYXdrJylcclxudmFyIE11bHRpcGFydCA9IHJlcXVpcmUoJy4vbGliL211bHRpcGFydCcpLk11bHRpcGFydFxyXG52YXIgUmVkaXJlY3QgPSByZXF1aXJlKCcuL2xpYi9yZWRpcmVjdCcpLlJlZGlyZWN0XHJcbnZhciBUdW5uZWwgPSByZXF1aXJlKCcuL2xpYi90dW5uZWwnKS5UdW5uZWxcclxudmFyIG5vdyA9IHJlcXVpcmUoJ3BlcmZvcm1hbmNlLW5vdycpXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG5cclxudmFyIHNhZmVTdHJpbmdpZnkgPSBoZWxwZXJzLnNhZmVTdHJpbmdpZnlcclxudmFyIGlzUmVhZFN0cmVhbSA9IGhlbHBlcnMuaXNSZWFkU3RyZWFtXHJcbnZhciB0b0Jhc2U2NCA9IGhlbHBlcnMudG9CYXNlNjRcclxudmFyIGRlZmVyID0gaGVscGVycy5kZWZlclxyXG52YXIgY29weSA9IGhlbHBlcnMuY29weVxyXG52YXIgdmVyc2lvbiA9IGhlbHBlcnMudmVyc2lvblxyXG52YXIgZ2xvYmFsQ29va2llSmFyID0gY29va2llcy5qYXIoKVxyXG5cclxudmFyIGdsb2JhbFBvb2wgPSB7fVxyXG5cclxuZnVuY3Rpb24gZmlsdGVyRm9yTm9uUmVzZXJ2ZWQgKHJlc2VydmVkLCBvcHRpb25zKSB7XHJcbiAgLy8gRmlsdGVyIG91dCBwcm9wZXJ0aWVzIHRoYXQgYXJlIG5vdCByZXNlcnZlZC5cclxuICAvLyBSZXNlcnZlZCB2YWx1ZXMgYXJlIHBhc3NlZCBpbiBhdCBjYWxsIHNpdGUuXHJcblxyXG4gIHZhciBvYmplY3QgPSB7fVxyXG4gIGZvciAodmFyIGkgaW4gb3B0aW9ucykge1xyXG4gICAgdmFyIG5vdFJlc2VydmVkID0gKHJlc2VydmVkLmluZGV4T2YoaSkgPT09IC0xKVxyXG4gICAgaWYgKG5vdFJlc2VydmVkKSB7XHJcbiAgICAgIG9iamVjdFtpXSA9IG9wdGlvbnNbaV1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG9iamVjdFxyXG59XHJcblxyXG5mdW5jdGlvbiBmaWx0ZXJPdXRSZXNlcnZlZEZ1bmN0aW9ucyAocmVzZXJ2ZWQsIG9wdGlvbnMpIHtcclxuICAvLyBGaWx0ZXIgb3V0IHByb3BlcnRpZXMgdGhhdCBhcmUgZnVuY3Rpb25zIGFuZCBhcmUgcmVzZXJ2ZWQuXHJcbiAgLy8gUmVzZXJ2ZWQgdmFsdWVzIGFyZSBwYXNzZWQgaW4gYXQgY2FsbCBzaXRlLlxyXG5cclxuICB2YXIgb2JqZWN0ID0ge31cclxuICBmb3IgKHZhciBpIGluIG9wdGlvbnMpIHtcclxuICAgIHZhciBpc1Jlc2VydmVkID0gIShyZXNlcnZlZC5pbmRleE9mKGkpID09PSAtMSlcclxuICAgIHZhciBpc0Z1bmN0aW9uID0gKHR5cGVvZiBvcHRpb25zW2ldID09PSAnZnVuY3Rpb24nKVxyXG4gICAgaWYgKCEoaXNSZXNlcnZlZCAmJiBpc0Z1bmN0aW9uKSkge1xyXG4gICAgICBvYmplY3RbaV0gPSBvcHRpb25zW2ldXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBvYmplY3RcclxufVxyXG5cclxuLy8gUmV0dXJuIGEgc2ltcGxlciByZXF1ZXN0IG9iamVjdCB0byBhbGxvdyBzZXJpYWxpemF0aW9uXHJcbmZ1bmN0aW9uIHJlcXVlc3RUb0pTT04gKCkge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIHJldHVybiB7XHJcbiAgICB1cmk6IHNlbGYudXJpLFxyXG4gICAgbWV0aG9kOiBzZWxmLm1ldGhvZCxcclxuICAgIGhlYWRlcnM6IHNlbGYuaGVhZGVyc1xyXG4gIH1cclxufVxyXG5cclxuLy8gUmV0dXJuIGEgc2ltcGxlciByZXNwb25zZSBvYmplY3QgdG8gYWxsb3cgc2VyaWFsaXphdGlvblxyXG5mdW5jdGlvbiByZXNwb25zZVRvSlNPTiAoKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgcmV0dXJuIHtcclxuICAgIHN0YXR1c0NvZGU6IHNlbGYuc3RhdHVzQ29kZSxcclxuICAgIGJvZHk6IHNlbGYuYm9keSxcclxuICAgIGhlYWRlcnM6IHNlbGYuaGVhZGVycyxcclxuICAgIHJlcXVlc3Q6IHJlcXVlc3RUb0pTT04uY2FsbChzZWxmLnJlcXVlc3QpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBSZXF1ZXN0IChvcHRpb25zKSB7XHJcbiAgLy8gaWYgZ2l2ZW4gdGhlIG1ldGhvZCBwcm9wZXJ0eSBpbiBvcHRpb25zLCBzZXQgcHJvcGVydHkgZXhwbGljaXRNZXRob2QgdG8gdHJ1ZVxyXG5cclxuICAvLyBleHRlbmQgdGhlIFJlcXVlc3QgaW5zdGFuY2Ugd2l0aCBhbnkgbm9uLXJlc2VydmVkIHByb3BlcnRpZXNcclxuICAvLyByZW1vdmUgYW55IHJlc2VydmVkIGZ1bmN0aW9ucyBmcm9tIHRoZSBvcHRpb25zIG9iamVjdFxyXG4gIC8vIHNldCBSZXF1ZXN0IGluc3RhbmNlIHRvIGJlIHJlYWRhYmxlIGFuZCB3cml0YWJsZVxyXG4gIC8vIGNhbGwgaW5pdFxyXG5cclxuICB2YXIgc2VsZiA9IHRoaXNcclxuXHJcbiAgLy8gc3RhcnQgd2l0aCBIQVIsIHRoZW4gb3ZlcnJpZGUgd2l0aCBhZGRpdGlvbmFsIG9wdGlvbnNcclxuICBpZiAob3B0aW9ucy5oYXIpIHtcclxuICAgIHNlbGYuX2hhciA9IG5ldyBIYXIoc2VsZilcclxuICAgIG9wdGlvbnMgPSBzZWxmLl9oYXIub3B0aW9ucyhvcHRpb25zKVxyXG4gIH1cclxuXHJcbiAgc3RyZWFtLlN0cmVhbS5jYWxsKHNlbGYpXHJcbiAgdmFyIHJlc2VydmVkID0gT2JqZWN0LmtleXMoUmVxdWVzdC5wcm90b3R5cGUpXHJcbiAgdmFyIG5vblJlc2VydmVkID0gZmlsdGVyRm9yTm9uUmVzZXJ2ZWQocmVzZXJ2ZWQsIG9wdGlvbnMpXHJcblxyXG4gIGV4dGVuZChzZWxmLCBub25SZXNlcnZlZClcclxuICBvcHRpb25zID0gZmlsdGVyT3V0UmVzZXJ2ZWRGdW5jdGlvbnMocmVzZXJ2ZWQsIG9wdGlvbnMpXHJcblxyXG4gIHNlbGYucmVhZGFibGUgPSB0cnVlXHJcbiAgc2VsZi53cml0YWJsZSA9IHRydWVcclxuICBpZiAob3B0aW9ucy5tZXRob2QpIHtcclxuICAgIHNlbGYuZXhwbGljaXRNZXRob2QgPSB0cnVlXHJcbiAgfVxyXG4gIHNlbGYuX3FzID0gbmV3IFF1ZXJ5c3RyaW5nKHNlbGYpXHJcbiAgc2VsZi5fYXV0aCA9IG5ldyBBdXRoKHNlbGYpXHJcbiAgc2VsZi5fb2F1dGggPSBuZXcgT0F1dGgoc2VsZilcclxuICBzZWxmLl9tdWx0aXBhcnQgPSBuZXcgTXVsdGlwYXJ0KHNlbGYpXHJcbiAgc2VsZi5fcmVkaXJlY3QgPSBuZXcgUmVkaXJlY3Qoc2VsZilcclxuICBzZWxmLl90dW5uZWwgPSBuZXcgVHVubmVsKHNlbGYpXHJcbiAgc2VsZi5pbml0KG9wdGlvbnMpXHJcbn1cclxuXHJcbnV0aWwuaW5oZXJpdHMoUmVxdWVzdCwgc3RyZWFtLlN0cmVhbSlcclxuXHJcbi8vIERlYnVnZ2luZ1xyXG5SZXF1ZXN0LmRlYnVnID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyAmJiAvXFxicmVxdWVzdFxcYi8udGVzdChwcm9jZXNzLmVudi5OT0RFX0RFQlVHKVxyXG5mdW5jdGlvbiBkZWJ1ZyAoKSB7XHJcbiAgaWYgKFJlcXVlc3QuZGVidWcpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ1JFUVVFU1QgJXMnLCB1dGlsLmZvcm1hdC5hcHBseSh1dGlsLCBhcmd1bWVudHMpKVxyXG4gIH1cclxufVxyXG5SZXF1ZXN0LnByb3RvdHlwZS5kZWJ1ZyA9IGRlYnVnXHJcblxyXG5SZXF1ZXN0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAvLyBpbml0KCkgY29udGFpbnMgYWxsIHRoZSBjb2RlIHRvIHNldHVwIHRoZSByZXF1ZXN0IG9iamVjdC5cclxuICAvLyB0aGUgYWN0dWFsIG91dGdvaW5nIHJlcXVlc3QgaXMgbm90IHN0YXJ0ZWQgdW50aWwgc3RhcnQoKSBpcyBjYWxsZWRcclxuICAvLyB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBmcm9tIGJvdGggdGhlIGNvbnN0cnVjdG9yIGFuZCBvbiByZWRpcmVjdC5cclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICBpZiAoIW9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSB7fVxyXG4gIH1cclxuICBzZWxmLmhlYWRlcnMgPSBzZWxmLmhlYWRlcnMgPyBjb3B5KHNlbGYuaGVhZGVycykgOiB7fVxyXG5cclxuICAvLyBEZWxldGUgaGVhZGVycyB3aXRoIHZhbHVlIHVuZGVmaW5lZCBzaW5jZSB0aGV5IGJyZWFrXHJcbiAgLy8gQ2xpZW50UmVxdWVzdC5PdXRnb2luZ01lc3NhZ2Uuc2V0SGVhZGVyIGluIG5vZGUgMC4xMlxyXG4gIGZvciAodmFyIGhlYWRlck5hbWUgaW4gc2VsZi5oZWFkZXJzKSB7XHJcbiAgICBpZiAodHlwZW9mIHNlbGYuaGVhZGVyc1toZWFkZXJOYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgZGVsZXRlIHNlbGYuaGVhZGVyc1toZWFkZXJOYW1lXVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2FzZWxlc3MuaHR0cGlmeShzZWxmLCBzZWxmLmhlYWRlcnMpXHJcblxyXG4gIGlmICghc2VsZi5tZXRob2QpIHtcclxuICAgIHNlbGYubWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgJ0dFVCdcclxuICB9XHJcbiAgaWYgKCFzZWxmLmxvY2FsQWRkcmVzcykge1xyXG4gICAgc2VsZi5sb2NhbEFkZHJlc3MgPSBvcHRpb25zLmxvY2FsQWRkcmVzc1xyXG4gIH1cclxuXHJcbiAgc2VsZi5fcXMuaW5pdChvcHRpb25zKVxyXG5cclxuICBkZWJ1ZyhvcHRpb25zKVxyXG4gIGlmICghc2VsZi5wb29sICYmIHNlbGYucG9vbCAhPT0gZmFsc2UpIHtcclxuICAgIHNlbGYucG9vbCA9IGdsb2JhbFBvb2xcclxuICB9XHJcbiAgc2VsZi5kZXN0cyA9IHNlbGYuZGVzdHMgfHwgW11cclxuICBzZWxmLl9faXNSZXF1ZXN0UmVxdWVzdCA9IHRydWVcclxuXHJcbiAgLy8gUHJvdGVjdCBhZ2FpbnN0IGRvdWJsZSBjYWxsYmFja1xyXG4gIGlmICghc2VsZi5fY2FsbGJhY2sgJiYgc2VsZi5jYWxsYmFjaykge1xyXG4gICAgc2VsZi5fY2FsbGJhY2sgPSBzZWxmLmNhbGxiYWNrXHJcbiAgICBzZWxmLmNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoc2VsZi5fY2FsbGJhY2tDYWxsZWQpIHtcclxuICAgICAgICByZXR1cm4gLy8gUHJpbnQgYSB3YXJuaW5nIG1heWJlP1xyXG4gICAgICB9XHJcbiAgICAgIHNlbGYuX2NhbGxiYWNrQ2FsbGVkID0gdHJ1ZVxyXG4gICAgICBzZWxmLl9jYWxsYmFjay5hcHBseShzZWxmLCBhcmd1bWVudHMpXHJcbiAgICB9XHJcbiAgICBzZWxmLm9uKCdlcnJvcicsIHNlbGYuY2FsbGJhY2suYmluZCgpKVxyXG4gICAgc2VsZi5vbignY29tcGxldGUnLCBzZWxmLmNhbGxiYWNrLmJpbmQoc2VsZiwgbnVsbCkpXHJcbiAgfVxyXG5cclxuICAvLyBQZW9wbGUgdXNlIHRoaXMgcHJvcGVydHkgaW5zdGVhZCBhbGwgdGhlIHRpbWUsIHNvIHN1cHBvcnQgaXRcclxuICBpZiAoIXNlbGYudXJpICYmIHNlbGYudXJsKSB7XHJcbiAgICBzZWxmLnVyaSA9IHNlbGYudXJsXHJcbiAgICBkZWxldGUgc2VsZi51cmxcclxuICB9XHJcblxyXG4gIC8vIElmIHRoZXJlJ3MgYSBiYXNlVXJsLCB0aGVuIHVzZSBpdCBhcyB0aGUgYmFzZSBVUkwgKGkuZS4gdXJpIG11c3QgYmVcclxuICAvLyBzcGVjaWZpZWQgYXMgYSByZWxhdGl2ZSBwYXRoIGFuZCBpcyBhcHBlbmRlZCB0byBiYXNlVXJsKS5cclxuICBpZiAoc2VsZi5iYXNlVXJsKSB7XHJcbiAgICBpZiAodHlwZW9mIHNlbGYuYmFzZVVybCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgcmV0dXJuIHNlbGYuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ29wdGlvbnMuYmFzZVVybCBtdXN0IGJlIGEgc3RyaW5nJykpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBzZWxmLnVyaSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgcmV0dXJuIHNlbGYuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ29wdGlvbnMudXJpIG11c3QgYmUgYSBzdHJpbmcgd2hlbiB1c2luZyBvcHRpb25zLmJhc2VVcmwnKSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZi51cmkuaW5kZXhPZignLy8nKSA9PT0gMCB8fCBzZWxmLnVyaS5pbmRleE9mKCc6Ly8nKSAhPT0gLTEpIHtcclxuICAgICAgcmV0dXJuIHNlbGYuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ29wdGlvbnMudXJpIG11c3QgYmUgYSBwYXRoIHdoZW4gdXNpbmcgb3B0aW9ucy5iYXNlVXJsJykpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGFuZGxlIGFsbCBjYXNlcyB0byBtYWtlIHN1cmUgdGhhdCB0aGVyZSdzIG9ubHkgb25lIHNsYXNoIGJldHdlZW5cclxuICAgIC8vIGJhc2VVcmwgYW5kIHVyaS5cclxuICAgIHZhciBiYXNlVXJsRW5kc1dpdGhTbGFzaCA9IHNlbGYuYmFzZVVybC5sYXN0SW5kZXhPZignLycpID09PSBzZWxmLmJhc2VVcmwubGVuZ3RoIC0gMVxyXG4gICAgdmFyIHVyaVN0YXJ0c1dpdGhTbGFzaCA9IHNlbGYudXJpLmluZGV4T2YoJy8nKSA9PT0gMFxyXG5cclxuICAgIGlmIChiYXNlVXJsRW5kc1dpdGhTbGFzaCAmJiB1cmlTdGFydHNXaXRoU2xhc2gpIHtcclxuICAgICAgc2VsZi51cmkgPSBzZWxmLmJhc2VVcmwgKyBzZWxmLnVyaS5zbGljZSgxKVxyXG4gICAgfSBlbHNlIGlmIChiYXNlVXJsRW5kc1dpdGhTbGFzaCB8fCB1cmlTdGFydHNXaXRoU2xhc2gpIHtcclxuICAgICAgc2VsZi51cmkgPSBzZWxmLmJhc2VVcmwgKyBzZWxmLnVyaVxyXG4gICAgfSBlbHNlIGlmIChzZWxmLnVyaSA9PT0gJycpIHtcclxuICAgICAgc2VsZi51cmkgPSBzZWxmLmJhc2VVcmxcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNlbGYudXJpID0gc2VsZi5iYXNlVXJsICsgJy8nICsgc2VsZi51cmlcclxuICAgIH1cclxuICAgIGRlbGV0ZSBzZWxmLmJhc2VVcmxcclxuICB9XHJcblxyXG4gIC8vIEEgVVJJIGlzIG5lZWRlZCBieSB0aGlzIHBvaW50LCBlbWl0IGVycm9yIGlmIHdlIGhhdmVuJ3QgYmVlbiBhYmxlIHRvIGdldCBvbmVcclxuICBpZiAoIXNlbGYudXJpKSB7XHJcbiAgICByZXR1cm4gc2VsZi5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignb3B0aW9ucy51cmkgaXMgYSByZXF1aXJlZCBhcmd1bWVudCcpKVxyXG4gIH1cclxuXHJcbiAgLy8gSWYgYSBzdHJpbmcgVVJJL1VSTCB3YXMgZ2l2ZW4sIHBhcnNlIGl0IGludG8gYSBVUkwgb2JqZWN0XHJcbiAgaWYgKHR5cGVvZiBzZWxmLnVyaSA9PT0gJ3N0cmluZycpIHtcclxuICAgIHNlbGYudXJpID0gdXJsLnBhcnNlKHNlbGYudXJpKVxyXG4gIH1cclxuXHJcbiAgLy8gU29tZSBVUkwgb2JqZWN0cyBhcmUgbm90IGZyb20gYSBVUkwgcGFyc2VkIHN0cmluZyBhbmQgbmVlZCBocmVmIGFkZGVkXHJcbiAgaWYgKCFzZWxmLnVyaS5ocmVmKSB7XHJcbiAgICBzZWxmLnVyaS5ocmVmID0gdXJsLmZvcm1hdChzZWxmLnVyaSlcclxuICB9XHJcblxyXG4gIC8vIERFUFJFQ0FURUQ6IFdhcm5pbmcgZm9yIHVzZXJzIG9mIHRoZSBvbGQgVW5peCBTb2NrZXRzIFVSTCBTY2hlbWVcclxuICBpZiAoc2VsZi51cmkucHJvdG9jb2wgPT09ICd1bml4OicpIHtcclxuICAgIHJldHVybiBzZWxmLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdgdW5peDovL2AgVVJMIHNjaGVtZSBpcyBubyBsb25nZXIgc3VwcG9ydGVkLiBQbGVhc2UgdXNlIHRoZSBmb3JtYXQgYGh0dHA6Ly91bml4OlNPQ0tFVDpQQVRIYCcpKVxyXG4gIH1cclxuXHJcbiAgLy8gU3VwcG9ydCBVbml4IFNvY2tldHNcclxuICBpZiAoc2VsZi51cmkuaG9zdCA9PT0gJ3VuaXgnKSB7XHJcbiAgICBzZWxmLmVuYWJsZVVuaXhTb2NrZXQoKVxyXG4gIH1cclxuXHJcbiAgaWYgKHNlbGYuc3RyaWN0U1NMID09PSBmYWxzZSkge1xyXG4gICAgc2VsZi5yZWplY3RVbmF1dGhvcml6ZWQgPSBmYWxzZVxyXG4gIH1cclxuXHJcbiAgaWYgKCFzZWxmLnVyaS5wYXRobmFtZSkgeyBzZWxmLnVyaS5wYXRobmFtZSA9ICcvJyB9XHJcblxyXG4gIGlmICghKHNlbGYudXJpLmhvc3QgfHwgKHNlbGYudXJpLmhvc3RuYW1lICYmIHNlbGYudXJpLnBvcnQpKSAmJiAhc2VsZi51cmkuaXNVbml4KSB7XHJcbiAgICAvLyBJbnZhbGlkIFVSSTogaXQgbWF5IGdlbmVyYXRlIGxvdCBvZiBiYWQgZXJyb3JzLCBsaWtlICdUeXBlRXJyb3I6IENhbm5vdCBjYWxsIG1ldGhvZCBgaW5kZXhPZmAgb2YgdW5kZWZpbmVkJyBpbiBDb29raWVKYXJcclxuICAgIC8vIERldGVjdCBhbmQgcmVqZWN0IGl0IGFzIHNvb24gYXMgcG9zc2libGVcclxuICAgIHZhciBmYXVsdHlVcmkgPSB1cmwuZm9ybWF0KHNlbGYudXJpKVxyXG4gICAgdmFyIG1lc3NhZ2UgPSAnSW52YWxpZCBVUkkgXCInICsgZmF1bHR5VXJpICsgJ1wiJ1xyXG4gICAgaWYgKE9iamVjdC5rZXlzKG9wdGlvbnMpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAvLyBObyBvcHRpb24gPyBUaGlzIGNhbiBiZSB0aGUgc2lnbiBvZiBhIHJlZGlyZWN0XHJcbiAgICAgIC8vIEFzIHRoaXMgaXMgYSBjYXNlIHdoZXJlIHRoZSB1c2VyIGNhbm5vdCBkbyBhbnl0aGluZyAodGhleSBkaWRuJ3QgY2FsbCByZXF1ZXN0IGRpcmVjdGx5IHdpdGggdGhpcyBVUkwpXHJcbiAgICAgIC8vIHRoZXkgc2hvdWxkIGJlIHdhcm5lZCB0aGF0IGl0IGNhbiBiZSBjYXVzZWQgYnkgYSByZWRpcmVjdGlvbiAoY2FuIHNhdmUgc29tZSBoYWlyKVxyXG4gICAgICBtZXNzYWdlICs9ICcuIFRoaXMgY2FuIGJlIGNhdXNlZCBieSBhIGNyYXBweSByZWRpcmVjdGlvbi4nXHJcbiAgICB9XHJcbiAgICAvLyBUaGlzIGVycm9yIHdhcyBmYXRhbFxyXG4gICAgc2VsZi5hYm9ydCgpXHJcbiAgICByZXR1cm4gc2VsZi5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcihtZXNzYWdlKSlcclxuICB9XHJcblxyXG4gIGlmICghc2VsZi5oYXNPd25Qcm9wZXJ0eSgncHJveHknKSkge1xyXG4gICAgc2VsZi5wcm94eSA9IGdldFByb3h5RnJvbVVSSShzZWxmLnVyaSlcclxuICB9XHJcblxyXG4gIHNlbGYudHVubmVsID0gc2VsZi5fdHVubmVsLmlzRW5hYmxlZCgpXHJcbiAgaWYgKHNlbGYucHJveHkpIHtcclxuICAgIHNlbGYuX3R1bm5lbC5zZXR1cChvcHRpb25zKVxyXG4gIH1cclxuXHJcbiAgc2VsZi5fcmVkaXJlY3Qub25SZXF1ZXN0KG9wdGlvbnMpXHJcblxyXG4gIHNlbGYuc2V0SG9zdCA9IGZhbHNlXHJcbiAgaWYgKCFzZWxmLmhhc0hlYWRlcignaG9zdCcpKSB7XHJcbiAgICB2YXIgaG9zdEhlYWRlck5hbWUgPSBzZWxmLm9yaWdpbmFsSG9zdEhlYWRlck5hbWUgfHwgJ2hvc3QnXHJcbiAgICBzZWxmLnNldEhlYWRlcihob3N0SGVhZGVyTmFtZSwgc2VsZi51cmkuaG9zdClcclxuICAgIC8vIERyb3AgOnBvcnQgc3VmZml4IGZyb20gSG9zdCBoZWFkZXIgaWYga25vd24gcHJvdG9jb2wuXHJcbiAgICBpZiAoc2VsZi51cmkucG9ydCkge1xyXG4gICAgICBpZiAoKHNlbGYudXJpLnBvcnQgPT09ICc4MCcgJiYgc2VsZi51cmkucHJvdG9jb2wgPT09ICdodHRwOicpIHx8XHJcbiAgICAgICAgICAoc2VsZi51cmkucG9ydCA9PT0gJzQ0MycgJiYgc2VsZi51cmkucHJvdG9jb2wgPT09ICdodHRwczonKSkge1xyXG4gICAgICAgIHNlbGYuc2V0SGVhZGVyKGhvc3RIZWFkZXJOYW1lLCBzZWxmLnVyaS5ob3N0bmFtZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2VsZi5zZXRIb3N0ID0gdHJ1ZVxyXG4gIH1cclxuXHJcbiAgc2VsZi5qYXIoc2VsZi5famFyIHx8IG9wdGlvbnMuamFyKVxyXG5cclxuICBpZiAoIXNlbGYudXJpLnBvcnQpIHtcclxuICAgIGlmIChzZWxmLnVyaS5wcm90b2NvbCA9PT0gJ2h0dHA6JykgeyBzZWxmLnVyaS5wb3J0ID0gODAgfSBlbHNlIGlmIChzZWxmLnVyaS5wcm90b2NvbCA9PT0gJ2h0dHBzOicpIHsgc2VsZi51cmkucG9ydCA9IDQ0MyB9XHJcbiAgfVxyXG5cclxuICBpZiAoc2VsZi5wcm94eSAmJiAhc2VsZi50dW5uZWwpIHtcclxuICAgIHNlbGYucG9ydCA9IHNlbGYucHJveHkucG9ydFxyXG4gICAgc2VsZi5ob3N0ID0gc2VsZi5wcm94eS5ob3N0bmFtZVxyXG4gIH0gZWxzZSB7XHJcbiAgICBzZWxmLnBvcnQgPSBzZWxmLnVyaS5wb3J0XHJcbiAgICBzZWxmLmhvc3QgPSBzZWxmLnVyaS5ob3N0bmFtZVxyXG4gIH1cclxuXHJcbiAgaWYgKG9wdGlvbnMuZm9ybSkge1xyXG4gICAgc2VsZi5mb3JtKG9wdGlvbnMuZm9ybSlcclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLmZvcm1EYXRhKSB7XHJcbiAgICB2YXIgZm9ybURhdGEgPSBvcHRpb25zLmZvcm1EYXRhXHJcbiAgICB2YXIgcmVxdWVzdEZvcm0gPSBzZWxmLmZvcm0oKVxyXG4gICAgdmFyIGFwcGVuZEZvcm1WYWx1ZSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSAmJiB2YWx1ZS5oYXNPd25Qcm9wZXJ0eSgnb3B0aW9ucycpKSB7XHJcbiAgICAgICAgcmVxdWVzdEZvcm0uYXBwZW5kKGtleSwgdmFsdWUudmFsdWUsIHZhbHVlLm9wdGlvbnMpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVxdWVzdEZvcm0uYXBwZW5kKGtleSwgdmFsdWUpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAodmFyIGZvcm1LZXkgaW4gZm9ybURhdGEpIHtcclxuICAgICAgaWYgKGZvcm1EYXRhLmhhc093blByb3BlcnR5KGZvcm1LZXkpKSB7XHJcbiAgICAgICAgdmFyIGZvcm1WYWx1ZSA9IGZvcm1EYXRhW2Zvcm1LZXldXHJcbiAgICAgICAgaWYgKGZvcm1WYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGZvcm1WYWx1ZS5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBhcHBlbmRGb3JtVmFsdWUoZm9ybUtleSwgZm9ybVZhbHVlW2pdKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhcHBlbmRGb3JtVmFsdWUoZm9ybUtleSwgZm9ybVZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKG9wdGlvbnMucXMpIHtcclxuICAgIHNlbGYucXMob3B0aW9ucy5xcylcclxuICB9XHJcblxyXG4gIGlmIChzZWxmLnVyaS5wYXRoKSB7XHJcbiAgICBzZWxmLnBhdGggPSBzZWxmLnVyaS5wYXRoXHJcbiAgfSBlbHNlIHtcclxuICAgIHNlbGYucGF0aCA9IHNlbGYudXJpLnBhdGhuYW1lICsgKHNlbGYudXJpLnNlYXJjaCB8fCAnJylcclxuICB9XHJcblxyXG4gIGlmIChzZWxmLnBhdGgubGVuZ3RoID09PSAwKSB7XHJcbiAgICBzZWxmLnBhdGggPSAnLydcclxuICB9XHJcblxyXG4gIC8vIEF1dGggbXVzdCBoYXBwZW4gbGFzdCBpbiBjYXNlIHNpZ25pbmcgaXMgZGVwZW5kZW50IG9uIG90aGVyIGhlYWRlcnNcclxuICBpZiAob3B0aW9ucy5hd3MpIHtcclxuICAgIHNlbGYuYXdzKG9wdGlvbnMuYXdzKVxyXG4gIH1cclxuXHJcbiAgaWYgKG9wdGlvbnMuaGF3aykge1xyXG4gICAgc2VsZi5oYXdrKG9wdGlvbnMuaGF3aylcclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLmh0dHBTaWduYXR1cmUpIHtcclxuICAgIHNlbGYuaHR0cFNpZ25hdHVyZShvcHRpb25zLmh0dHBTaWduYXR1cmUpXHJcbiAgfVxyXG5cclxuICBpZiAob3B0aW9ucy5hdXRoKSB7XHJcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9wdGlvbnMuYXV0aCwgJ3VzZXJuYW1lJykpIHtcclxuICAgICAgb3B0aW9ucy5hdXRoLnVzZXIgPSBvcHRpb25zLmF1dGgudXNlcm5hbWVcclxuICAgIH1cclxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3B0aW9ucy5hdXRoLCAncGFzc3dvcmQnKSkge1xyXG4gICAgICBvcHRpb25zLmF1dGgucGFzcyA9IG9wdGlvbnMuYXV0aC5wYXNzd29yZFxyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuYXV0aChcclxuICAgICAgb3B0aW9ucy5hdXRoLnVzZXIsXHJcbiAgICAgIG9wdGlvbnMuYXV0aC5wYXNzLFxyXG4gICAgICBvcHRpb25zLmF1dGguc2VuZEltbWVkaWF0ZWx5LFxyXG4gICAgICBvcHRpb25zLmF1dGguYmVhcmVyXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICBpZiAoc2VsZi5nemlwICYmICFzZWxmLmhhc0hlYWRlcignYWNjZXB0LWVuY29kaW5nJykpIHtcclxuICAgIHNlbGYuc2V0SGVhZGVyKCdhY2NlcHQtZW5jb2RpbmcnLCAnZ3ppcCwgZGVmbGF0ZScpXHJcbiAgfVxyXG5cclxuICBpZiAoc2VsZi51cmkuYXV0aCAmJiAhc2VsZi5oYXNIZWFkZXIoJ2F1dGhvcml6YXRpb24nKSkge1xyXG4gICAgdmFyIHVyaUF1dGhQaWVjZXMgPSBzZWxmLnVyaS5hdXRoLnNwbGl0KCc6JykubWFwKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBzZWxmLl9xcy51bmVzY2FwZShpdGVtKSB9KVxyXG4gICAgc2VsZi5hdXRoKHVyaUF1dGhQaWVjZXNbMF0sIHVyaUF1dGhQaWVjZXMuc2xpY2UoMSkuam9pbignOicpLCB0cnVlKVxyXG4gIH1cclxuXHJcbiAgaWYgKCFzZWxmLnR1bm5lbCAmJiBzZWxmLnByb3h5ICYmIHNlbGYucHJveHkuYXV0aCAmJiAhc2VsZi5oYXNIZWFkZXIoJ3Byb3h5LWF1dGhvcml6YXRpb24nKSkge1xyXG4gICAgdmFyIHByb3h5QXV0aFBpZWNlcyA9IHNlbGYucHJveHkuYXV0aC5zcGxpdCgnOicpLm1hcChmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gc2VsZi5fcXMudW5lc2NhcGUoaXRlbSkgfSlcclxuICAgIHZhciBhdXRoSGVhZGVyID0gJ0Jhc2ljICcgKyB0b0Jhc2U2NChwcm94eUF1dGhQaWVjZXMuam9pbignOicpKVxyXG4gICAgc2VsZi5zZXRIZWFkZXIoJ3Byb3h5LWF1dGhvcml6YXRpb24nLCBhdXRoSGVhZGVyKVxyXG4gIH1cclxuXHJcbiAgaWYgKHNlbGYucHJveHkgJiYgIXNlbGYudHVubmVsKSB7XHJcbiAgICBzZWxmLnBhdGggPSAoc2VsZi51cmkucHJvdG9jb2wgKyAnLy8nICsgc2VsZi51cmkuaG9zdCArIHNlbGYucGF0aClcclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLmpzb24pIHtcclxuICAgIHNlbGYuanNvbihvcHRpb25zLmpzb24pXHJcbiAgfVxyXG4gIGlmIChvcHRpb25zLm11bHRpcGFydCkge1xyXG4gICAgc2VsZi5tdWx0aXBhcnQob3B0aW9ucy5tdWx0aXBhcnQpXHJcbiAgfVxyXG5cclxuICBpZiAob3B0aW9ucy50aW1lKSB7XHJcbiAgICBzZWxmLnRpbWluZyA9IHRydWVcclxuXHJcbiAgICAvLyBOT1RFOiBlbGFwc2VkVGltZSBpcyBkZXByZWNhdGVkIGluIGZhdm9yIG9mIC50aW1pbmdzXHJcbiAgICBzZWxmLmVsYXBzZWRUaW1lID0gc2VsZi5lbGFwc2VkVGltZSB8fCAwXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRDb250ZW50TGVuZ3RoICgpIHtcclxuICAgIGlmIChpc1R5cGVkQXJyYXkoc2VsZi5ib2R5KSkge1xyXG4gICAgICBzZWxmLmJvZHkgPSBCdWZmZXIuZnJvbShzZWxmLmJvZHkpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFzZWxmLmhhc0hlYWRlcignY29udGVudC1sZW5ndGgnKSkge1xyXG4gICAgICB2YXIgbGVuZ3RoXHJcbiAgICAgIGlmICh0eXBlb2Ygc2VsZi5ib2R5ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHNlbGYuYm9keSlcclxuICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNlbGYuYm9keSkpIHtcclxuICAgICAgICBsZW5ndGggPSBzZWxmLmJvZHkucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhICsgYi5sZW5ndGggfSwgMClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZW5ndGggPSBzZWxmLmJvZHkubGVuZ3RoXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChsZW5ndGgpIHtcclxuICAgICAgICBzZWxmLnNldEhlYWRlcignY29udGVudC1sZW5ndGgnLCBsZW5ndGgpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZi5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignQXJndW1lbnQgZXJyb3IsIG9wdGlvbnMuYm9keS4nKSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoc2VsZi5ib2R5ICYmICFpc3N0cmVhbShzZWxmLmJvZHkpKSB7XHJcbiAgICBzZXRDb250ZW50TGVuZ3RoKClcclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLm9hdXRoKSB7XHJcbiAgICBzZWxmLm9hdXRoKG9wdGlvbnMub2F1dGgpXHJcbiAgfSBlbHNlIGlmIChzZWxmLl9vYXV0aC5wYXJhbXMgJiYgc2VsZi5oYXNIZWFkZXIoJ2F1dGhvcml6YXRpb24nKSkge1xyXG4gICAgc2VsZi5vYXV0aChzZWxmLl9vYXV0aC5wYXJhbXMpXHJcbiAgfVxyXG5cclxuICB2YXIgcHJvdG9jb2wgPSBzZWxmLnByb3h5ICYmICFzZWxmLnR1bm5lbCA/IHNlbGYucHJveHkucHJvdG9jb2wgOiBzZWxmLnVyaS5wcm90b2NvbFxyXG4gIHZhciBkZWZhdWx0TW9kdWxlcyA9IHsnaHR0cDonOiBodHRwLCAnaHR0cHM6JzogaHR0cHN9XHJcbiAgdmFyIGh0dHBNb2R1bGVzID0gc2VsZi5odHRwTW9kdWxlcyB8fCB7fVxyXG5cclxuICBzZWxmLmh0dHBNb2R1bGUgPSBodHRwTW9kdWxlc1twcm90b2NvbF0gfHwgZGVmYXVsdE1vZHVsZXNbcHJvdG9jb2xdXHJcblxyXG4gIGlmICghc2VsZi5odHRwTW9kdWxlKSB7XHJcbiAgICByZXR1cm4gc2VsZi5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignSW52YWxpZCBwcm90b2NvbDogJyArIHByb3RvY29sKSlcclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLmNhKSB7XHJcbiAgICBzZWxmLmNhID0gb3B0aW9ucy5jYVxyXG4gIH1cclxuXHJcbiAgaWYgKCFzZWxmLmFnZW50KSB7XHJcbiAgICBpZiAob3B0aW9ucy5hZ2VudE9wdGlvbnMpIHtcclxuICAgICAgc2VsZi5hZ2VudE9wdGlvbnMgPSBvcHRpb25zLmFnZW50T3B0aW9uc1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLmFnZW50Q2xhc3MpIHtcclxuICAgICAgc2VsZi5hZ2VudENsYXNzID0gb3B0aW9ucy5hZ2VudENsYXNzXHJcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZm9yZXZlcikge1xyXG4gICAgICB2YXIgdiA9IHZlcnNpb24oKVxyXG4gICAgICAvLyB1c2UgRm9yZXZlckFnZW50IGluIG5vZGUgMC4xMC0gb25seVxyXG4gICAgICBpZiAodi5tYWpvciA9PT0gMCAmJiB2Lm1pbm9yIDw9IDEwKSB7XHJcbiAgICAgICAgc2VsZi5hZ2VudENsYXNzID0gcHJvdG9jb2wgPT09ICdodHRwOicgPyBGb3JldmVyQWdlbnQgOiBGb3JldmVyQWdlbnQuU1NMXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZi5hZ2VudENsYXNzID0gc2VsZi5odHRwTW9kdWxlLkFnZW50XHJcbiAgICAgICAgc2VsZi5hZ2VudE9wdGlvbnMgPSBzZWxmLmFnZW50T3B0aW9ucyB8fCB7fVxyXG4gICAgICAgIHNlbGYuYWdlbnRPcHRpb25zLmtlZXBBbGl2ZSA9IHRydWVcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZi5hZ2VudENsYXNzID0gc2VsZi5odHRwTW9kdWxlLkFnZW50XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoc2VsZi5wb29sID09PSBmYWxzZSkge1xyXG4gICAgc2VsZi5hZ2VudCA9IGZhbHNlXHJcbiAgfSBlbHNlIHtcclxuICAgIHNlbGYuYWdlbnQgPSBzZWxmLmFnZW50IHx8IHNlbGYuZ2V0TmV3QWdlbnQoKVxyXG4gIH1cclxuXHJcbiAgc2VsZi5vbigncGlwZScsIGZ1bmN0aW9uIChzcmMpIHtcclxuICAgIGlmIChzZWxmLm50aWNrICYmIHNlbGYuX3N0YXJ0ZWQpIHtcclxuICAgICAgc2VsZi5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignWW91IGNhbm5vdCBwaXBlIHRvIHRoaXMgc3RyZWFtIGFmdGVyIHRoZSBvdXRib3VuZCByZXF1ZXN0IGhhcyBzdGFydGVkLicpKVxyXG4gICAgfVxyXG4gICAgc2VsZi5zcmMgPSBzcmNcclxuICAgIGlmIChpc1JlYWRTdHJlYW0oc3JjKSkge1xyXG4gICAgICBpZiAoIXNlbGYuaGFzSGVhZGVyKCdjb250ZW50LXR5cGUnKSkge1xyXG4gICAgICAgIHNlbGYuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCBtaW1lLmxvb2t1cChzcmMucGF0aCkpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChzcmMuaGVhZGVycykge1xyXG4gICAgICAgIGZvciAodmFyIGkgaW4gc3JjLmhlYWRlcnMpIHtcclxuICAgICAgICAgIGlmICghc2VsZi5oYXNIZWFkZXIoaSkpIHtcclxuICAgICAgICAgICAgc2VsZi5zZXRIZWFkZXIoaSwgc3JjLmhlYWRlcnNbaV0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChzZWxmLl9qc29uICYmICFzZWxmLmhhc0hlYWRlcignY29udGVudC10eXBlJykpIHtcclxuICAgICAgICBzZWxmLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChzcmMubWV0aG9kICYmICFzZWxmLmV4cGxpY2l0TWV0aG9kKSB7XHJcbiAgICAgICAgc2VsZi5tZXRob2QgPSBzcmMubWV0aG9kXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgLy8gc2VsZi5vbigncGlwZScsIGZ1bmN0aW9uICgpIHtcclxuICAvLyAgIGNvbnNvbGUuZXJyb3IoJ1lvdSBoYXZlIGFscmVhZHkgcGlwZWQgdG8gdGhpcyBzdHJlYW0uIFBpcGVpbmcgdHdpY2UgaXMgbGlrZWx5IHRvIGJyZWFrIHRoZSByZXF1ZXN0LicpXHJcbiAgLy8gfSlcclxuICB9KVxyXG5cclxuICBkZWZlcihmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoc2VsZi5fYWJvcnRlZCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICB2YXIgZW5kID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoc2VsZi5fZm9ybSkge1xyXG4gICAgICAgIGlmICghc2VsZi5fYXV0aC5oYXNBdXRoKSB7XHJcbiAgICAgICAgICBzZWxmLl9mb3JtLnBpcGUoc2VsZilcclxuICAgICAgICB9IGVsc2UgaWYgKHNlbGYuX2F1dGguaGFzQXV0aCAmJiBzZWxmLl9hdXRoLnNlbnRBdXRoKSB7XHJcbiAgICAgICAgICBzZWxmLl9mb3JtLnBpcGUoc2VsZilcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHNlbGYuX211bHRpcGFydCAmJiBzZWxmLl9tdWx0aXBhcnQuY2h1bmtlZCkge1xyXG4gICAgICAgIHNlbGYuX211bHRpcGFydC5ib2R5LnBpcGUoc2VsZilcclxuICAgICAgfVxyXG4gICAgICBpZiAoc2VsZi5ib2R5KSB7XHJcbiAgICAgICAgaWYgKGlzc3RyZWFtKHNlbGYuYm9keSkpIHtcclxuICAgICAgICAgIHNlbGYuYm9keS5waXBlKHNlbGYpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNldENvbnRlbnRMZW5ndGgoKVxyXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2VsZi5ib2R5KSkge1xyXG4gICAgICAgICAgICBzZWxmLmJvZHkuZm9yRWFjaChmdW5jdGlvbiAocGFydCkge1xyXG4gICAgICAgICAgICAgIHNlbGYud3JpdGUocGFydClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlbGYud3JpdGUoc2VsZi5ib2R5KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgc2VsZi5lbmQoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChzZWxmLnJlcXVlc3RCb2R5U3RyZWFtKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdvcHRpb25zLnJlcXVlc3RCb2R5U3RyZWFtIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSBwYXNzIHRoZSByZXF1ZXN0IG9iamVjdCB0byBzdHJlYW0ucGlwZS4nKVxyXG4gICAgICAgIHNlbGYucmVxdWVzdEJvZHlTdHJlYW0ucGlwZShzZWxmKVxyXG4gICAgICB9IGVsc2UgaWYgKCFzZWxmLnNyYykge1xyXG4gICAgICAgIGlmIChzZWxmLl9hdXRoLmhhc0F1dGggJiYgIXNlbGYuX2F1dGguc2VudEF1dGgpIHtcclxuICAgICAgICAgIHNlbGYuZW5kKClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2VsZi5tZXRob2QgIT09ICdHRVQnICYmIHR5cGVvZiBzZWxmLm1ldGhvZCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIHNlbGYuc2V0SGVhZGVyKCdjb250ZW50LWxlbmd0aCcsIDApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlbGYuZW5kKClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZWxmLl9mb3JtICYmICFzZWxmLmhhc0hlYWRlcignY29udGVudC1sZW5ndGgnKSkge1xyXG4gICAgICAvLyBCZWZvcmUgZW5kaW5nIHRoZSByZXF1ZXN0LCB3ZSBoYWQgdG8gY29tcHV0ZSB0aGUgbGVuZ3RoIG9mIHRoZSB3aG9sZSBmb3JtLCBhc3luY2x5XHJcbiAgICAgIHNlbGYuc2V0SGVhZGVyKHNlbGYuX2Zvcm0uZ2V0SGVhZGVycygpLCB0cnVlKVxyXG4gICAgICBzZWxmLl9mb3JtLmdldExlbmd0aChmdW5jdGlvbiAoZXJyLCBsZW5ndGgpIHtcclxuICAgICAgICBpZiAoIWVyciAmJiAhaXNOYU4obGVuZ3RoKSkge1xyXG4gICAgICAgICAgc2VsZi5zZXRIZWFkZXIoJ2NvbnRlbnQtbGVuZ3RoJywgbGVuZ3RoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbmQoKVxyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZW5kKClcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLm50aWNrID0gdHJ1ZVxyXG4gIH0pXHJcbn1cclxuXHJcblJlcXVlc3QucHJvdG90eXBlLmdldE5ld0FnZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIHZhciBBZ2VudCA9IHNlbGYuYWdlbnRDbGFzc1xyXG4gIHZhciBvcHRpb25zID0ge31cclxuICBpZiAoc2VsZi5hZ2VudE9wdGlvbnMpIHtcclxuICAgIGZvciAodmFyIGkgaW4gc2VsZi5hZ2VudE9wdGlvbnMpIHtcclxuICAgICAgb3B0aW9uc1tpXSA9IHNlbGYuYWdlbnRPcHRpb25zW2ldXHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChzZWxmLmNhKSB7XHJcbiAgICBvcHRpb25zLmNhID0gc2VsZi5jYVxyXG4gIH1cclxuICBpZiAoc2VsZi5jaXBoZXJzKSB7XHJcbiAgICBvcHRpb25zLmNpcGhlcnMgPSBzZWxmLmNpcGhlcnNcclxuICB9XHJcbiAgaWYgKHNlbGYuc2VjdXJlUHJvdG9jb2wpIHtcclxuICAgIG9wdGlvbnMuc2VjdXJlUHJvdG9jb2wgPSBzZWxmLnNlY3VyZVByb3RvY29sXHJcbiAgfVxyXG4gIGlmIChzZWxmLnNlY3VyZU9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMuc2VjdXJlT3B0aW9ucyA9IHNlbGYuc2VjdXJlT3B0aW9uc1xyXG4gIH1cclxuICBpZiAodHlwZW9mIHNlbGYucmVqZWN0VW5hdXRob3JpemVkICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgb3B0aW9ucy5yZWplY3RVbmF1dGhvcml6ZWQgPSBzZWxmLnJlamVjdFVuYXV0aG9yaXplZFxyXG4gIH1cclxuXHJcbiAgaWYgKHNlbGYuY2VydCAmJiBzZWxmLmtleSkge1xyXG4gICAgb3B0aW9ucy5rZXkgPSBzZWxmLmtleVxyXG4gICAgb3B0aW9ucy5jZXJ0ID0gc2VsZi5jZXJ0XHJcbiAgfVxyXG5cclxuICBpZiAoc2VsZi5wZngpIHtcclxuICAgIG9wdGlvbnMucGZ4ID0gc2VsZi5wZnhcclxuICB9XHJcblxyXG4gIGlmIChzZWxmLnBhc3NwaHJhc2UpIHtcclxuICAgIG9wdGlvbnMucGFzc3BocmFzZSA9IHNlbGYucGFzc3BocmFzZVxyXG4gIH1cclxuXHJcbiAgdmFyIHBvb2xLZXkgPSAnJ1xyXG5cclxuICAvLyBkaWZmZXJlbnQgdHlwZXMgb2YgYWdlbnRzIGFyZSBpbiBkaWZmZXJlbnQgcG9vbHNcclxuICBpZiAoQWdlbnQgIT09IHNlbGYuaHR0cE1vZHVsZS5BZ2VudCkge1xyXG4gICAgcG9vbEtleSArPSBBZ2VudC5uYW1lXHJcbiAgfVxyXG5cclxuICAvLyBjYSBvcHRpb24gaXMgb25seSByZWxldmFudCBpZiBwcm94eSBvciBkZXN0aW5hdGlvbiBhcmUgaHR0cHNcclxuICB2YXIgcHJveHkgPSBzZWxmLnByb3h5XHJcbiAgaWYgKHR5cGVvZiBwcm94eSA9PT0gJ3N0cmluZycpIHtcclxuICAgIHByb3h5ID0gdXJsLnBhcnNlKHByb3h5KVxyXG4gIH1cclxuICB2YXIgaXNIdHRwcyA9IChwcm94eSAmJiBwcm94eS5wcm90b2NvbCA9PT0gJ2h0dHBzOicpIHx8IHRoaXMudXJpLnByb3RvY29sID09PSAnaHR0cHM6J1xyXG5cclxuICBpZiAoaXNIdHRwcykge1xyXG4gICAgaWYgKG9wdGlvbnMuY2EpIHtcclxuICAgICAgaWYgKHBvb2xLZXkpIHtcclxuICAgICAgICBwb29sS2V5ICs9ICc6J1xyXG4gICAgICB9XHJcbiAgICAgIHBvb2xLZXkgKz0gb3B0aW9ucy5jYVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5yZWplY3RVbmF1dGhvcml6ZWQgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIGlmIChwb29sS2V5KSB7XHJcbiAgICAgICAgcG9vbEtleSArPSAnOidcclxuICAgICAgfVxyXG4gICAgICBwb29sS2V5ICs9IG9wdGlvbnMucmVqZWN0VW5hdXRob3JpemVkXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuY2VydCkge1xyXG4gICAgICBpZiAocG9vbEtleSkge1xyXG4gICAgICAgIHBvb2xLZXkgKz0gJzonXHJcbiAgICAgIH1cclxuICAgICAgcG9vbEtleSArPSBvcHRpb25zLmNlcnQudG9TdHJpbmcoJ2FzY2lpJykgKyBvcHRpb25zLmtleS50b1N0cmluZygnYXNjaWknKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLnBmeCkge1xyXG4gICAgICBpZiAocG9vbEtleSkge1xyXG4gICAgICAgIHBvb2xLZXkgKz0gJzonXHJcbiAgICAgIH1cclxuICAgICAgcG9vbEtleSArPSBvcHRpb25zLnBmeC50b1N0cmluZygnYXNjaWknKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLmNpcGhlcnMpIHtcclxuICAgICAgaWYgKHBvb2xLZXkpIHtcclxuICAgICAgICBwb29sS2V5ICs9ICc6J1xyXG4gICAgICB9XHJcbiAgICAgIHBvb2xLZXkgKz0gb3B0aW9ucy5jaXBoZXJzXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuc2VjdXJlUHJvdG9jb2wpIHtcclxuICAgICAgaWYgKHBvb2xLZXkpIHtcclxuICAgICAgICBwb29sS2V5ICs9ICc6J1xyXG4gICAgICB9XHJcbiAgICAgIHBvb2xLZXkgKz0gb3B0aW9ucy5zZWN1cmVQcm90b2NvbFxyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLnNlY3VyZU9wdGlvbnMpIHtcclxuICAgICAgaWYgKHBvb2xLZXkpIHtcclxuICAgICAgICBwb29sS2V5ICs9ICc6J1xyXG4gICAgICB9XHJcbiAgICAgIHBvb2xLZXkgKz0gb3B0aW9ucy5zZWN1cmVPcHRpb25zXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoc2VsZi5wb29sID09PSBnbG9iYWxQb29sICYmICFwb29sS2V5ICYmIE9iamVjdC5rZXlzKG9wdGlvbnMpLmxlbmd0aCA9PT0gMCAmJiBzZWxmLmh0dHBNb2R1bGUuZ2xvYmFsQWdlbnQpIHtcclxuICAgIC8vIG5vdCBkb2luZyBhbnl0aGluZyBzcGVjaWFsLiAgVXNlIHRoZSBnbG9iYWxBZ2VudFxyXG4gICAgcmV0dXJuIHNlbGYuaHR0cE1vZHVsZS5nbG9iYWxBZ2VudFxyXG4gIH1cclxuXHJcbiAgLy8gd2UncmUgdXNpbmcgYSBzdG9yZWQgYWdlbnQuICBNYWtlIHN1cmUgaXQncyBwcm90b2NvbC1zcGVjaWZpY1xyXG4gIHBvb2xLZXkgPSBzZWxmLnVyaS5wcm90b2NvbCArIHBvb2xLZXlcclxuXHJcbiAgLy8gZ2VuZXJhdGUgYSBuZXcgYWdlbnQgZm9yIHRoaXMgc2V0dGluZyBpZiBub25lIHlldCBleGlzdHNcclxuICBpZiAoIXNlbGYucG9vbFtwb29sS2V5XSkge1xyXG4gICAgc2VsZi5wb29sW3Bvb2xLZXldID0gbmV3IEFnZW50KG9wdGlvbnMpXHJcbiAgICAvLyBwcm9wZXJseSBzZXQgbWF4U29ja2V0cyBvbiBuZXcgYWdlbnRzXHJcbiAgICBpZiAoc2VsZi5wb29sLm1heFNvY2tldHMpIHtcclxuICAgICAgc2VsZi5wb29sW3Bvb2xLZXldLm1heFNvY2tldHMgPSBzZWxmLnBvb2wubWF4U29ja2V0c1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHNlbGYucG9vbFtwb29sS2V5XVxyXG59XHJcblxyXG5SZXF1ZXN0LnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuICAvLyBzdGFydCgpIGlzIGNhbGxlZCBvbmNlIHdlIGFyZSByZWFkeSB0byBzZW5kIHRoZSBvdXRnb2luZyBIVFRQIHJlcXVlc3QuXHJcbiAgLy8gdGhpcyBpcyB1c3VhbGx5IGNhbGxlZCBvbiB0aGUgZmlyc3Qgd3JpdGUoKSwgZW5kKCkgb3Igb24gbmV4dFRpY2soKVxyXG4gIHZhciBzZWxmID0gdGhpc1xyXG5cclxuICBpZiAoc2VsZi50aW1pbmcpIHtcclxuICAgIC8vIEFsbCB0aW1pbmdzIHdpbGwgYmUgcmVsYXRpdmUgdG8gdGhpcyByZXF1ZXN0J3Mgc3RhcnRUaW1lLiAgSW4gb3JkZXIgdG8gZG8gdGhpcyxcclxuICAgIC8vIHdlIG5lZWQgdG8gY2FwdHVyZSB0aGUgd2FsbC1jbG9jayBzdGFydCB0aW1lICh2aWEgRGF0ZSksIGltbWVkaWF0ZWx5IGZvbGxvd2VkXHJcbiAgICAvLyBieSB0aGUgaGlnaC1yZXNvbHV0aW9uIHRpbWVyICh2aWEgbm93KCkpLiAgV2hpbGUgdGhlc2UgdHdvIHdvbid0IGJlIHNldFxyXG4gICAgLy8gYXQgdGhlIF9leGFjdF8gc2FtZSB0aW1lLCB0aGV5IHNob3VsZCBiZSBjbG9zZSBlbm91Z2ggdG8gYmUgYWJsZSB0byBjYWxjdWxhdGVcclxuICAgIC8vIGhpZ2gtcmVzb2x1dGlvbiwgbW9ub3RvbmljYWxseSBub24tZGVjcmVhc2luZyB0aW1lc3RhbXBzIHJlbGF0aXZlIHRvIHN0YXJ0VGltZS5cclxuICAgIHZhciBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxyXG4gICAgdmFyIHN0YXJ0VGltZU5vdyA9IG5vdygpXHJcbiAgfVxyXG5cclxuICBpZiAoc2VsZi5fYWJvcnRlZCkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG5cclxuICBzZWxmLl9zdGFydGVkID0gdHJ1ZVxyXG4gIHNlbGYubWV0aG9kID0gc2VsZi5tZXRob2QgfHwgJ0dFVCdcclxuICBzZWxmLmhyZWYgPSBzZWxmLnVyaS5ocmVmXHJcblxyXG4gIGlmIChzZWxmLnNyYyAmJiBzZWxmLnNyYy5zdGF0ICYmIHNlbGYuc3JjLnN0YXQuc2l6ZSAmJiAhc2VsZi5oYXNIZWFkZXIoJ2NvbnRlbnQtbGVuZ3RoJykpIHtcclxuICAgIHNlbGYuc2V0SGVhZGVyKCdjb250ZW50LWxlbmd0aCcsIHNlbGYuc3JjLnN0YXQuc2l6ZSlcclxuICB9XHJcbiAgaWYgKHNlbGYuX2F3cykge1xyXG4gICAgc2VsZi5hd3Moc2VsZi5fYXdzLCB0cnVlKVxyXG4gIH1cclxuXHJcbiAgLy8gV2UgaGF2ZSBhIG1ldGhvZCBuYW1lZCBhdXRoLCB3aGljaCBpcyBjb21wbGV0ZWx5IGRpZmZlcmVudCBmcm9tIHRoZSBodHRwLnJlcXVlc3RcclxuICAvLyBhdXRoIG9wdGlvbi4gIElmIHdlIGRvbid0IHJlbW92ZSBpdCwgd2UncmUgZ29ubmEgaGF2ZSBhIGJhZCB0aW1lLlxyXG4gIHZhciByZXFPcHRpb25zID0gY29weShzZWxmKVxyXG4gIGRlbGV0ZSByZXFPcHRpb25zLmF1dGhcclxuXHJcbiAgZGVidWcoJ21ha2UgcmVxdWVzdCcsIHNlbGYudXJpLmhyZWYpXHJcblxyXG4gIC8vIG5vZGUgdjYuOC4wIG5vdyBzdXBwb3J0cyBhIGB0aW1lb3V0YCB2YWx1ZSBpbiBgaHR0cC5yZXF1ZXN0KClgLCBidXQgd2VcclxuICAvLyBzaG91bGQgZGVsZXRlIGl0IGZvciBub3cgc2luY2Ugd2UgaGFuZGxlIHRpbWVvdXRzIG1hbnVhbGx5IGZvciBiZXR0ZXJcclxuICAvLyBjb25zaXN0ZW5jeSB3aXRoIG5vZGUgdmVyc2lvbnMgYmVmb3JlIHY2LjguMFxyXG4gIGRlbGV0ZSByZXFPcHRpb25zLnRpbWVvdXRcclxuXHJcbiAgdHJ5IHtcclxuICAgIHNlbGYucmVxID0gc2VsZi5odHRwTW9kdWxlLnJlcXVlc3QocmVxT3B0aW9ucylcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlcnIpXHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIGlmIChzZWxmLnRpbWluZykge1xyXG4gICAgc2VsZi5zdGFydFRpbWUgPSBzdGFydFRpbWVcclxuICAgIHNlbGYuc3RhcnRUaW1lTm93ID0gc3RhcnRUaW1lTm93XHJcblxyXG4gICAgLy8gVGltaW5nIHZhbHVlcyB3aWxsIGFsbCBiZSByZWxhdGl2ZSB0byBzdGFydFRpbWUgKGJ5IGNvbXBhcmluZyB0byBzdGFydFRpbWVOb3dcclxuICAgIC8vIHNvIHdlIGhhdmUgYW4gYWNjdXJhdGUgY2xvY2spXHJcbiAgICBzZWxmLnRpbWluZ3MgPSB7fVxyXG4gIH1cclxuXHJcbiAgdmFyIHRpbWVvdXRcclxuICBpZiAoc2VsZi50aW1lb3V0ICYmICFzZWxmLnRpbWVvdXRUaW1lcikge1xyXG4gICAgaWYgKHNlbGYudGltZW91dCA8IDApIHtcclxuICAgICAgdGltZW91dCA9IDBcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNlbGYudGltZW91dCA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUoc2VsZi50aW1lb3V0KSkge1xyXG4gICAgICB0aW1lb3V0ID0gc2VsZi50aW1lb3V0XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZWxmLnJlcS5vbigncmVzcG9uc2UnLCBzZWxmLm9uUmVxdWVzdFJlc3BvbnNlLmJpbmQoc2VsZikpXHJcbiAgc2VsZi5yZXEub24oJ2Vycm9yJywgc2VsZi5vblJlcXVlc3RFcnJvci5iaW5kKHNlbGYpKVxyXG4gIHNlbGYucmVxLm9uKCdkcmFpbicsIGZ1bmN0aW9uICgpIHtcclxuICAgIHNlbGYuZW1pdCgnZHJhaW4nKVxyXG4gIH0pXHJcblxyXG4gIHNlbGYucmVxLm9uKCdzb2NrZXQnLCBmdW5jdGlvbiAoc29ja2V0KSB7XHJcbiAgICAvLyBgLl9jb25uZWN0aW5nYCB3YXMgdGhlIG9sZCBwcm9wZXJ0eSB3aGljaCB3YXMgbWFkZSBwdWJsaWMgaW4gbm9kZSB2Ni4xLjBcclxuICAgIHZhciBpc0Nvbm5lY3RpbmcgPSBzb2NrZXQuX2Nvbm5lY3RpbmcgfHwgc29ja2V0LmNvbm5lY3RpbmdcclxuICAgIGlmIChzZWxmLnRpbWluZykge1xyXG4gICAgICBzZWxmLnRpbWluZ3Muc29ja2V0ID0gbm93KCkgLSBzZWxmLnN0YXJ0VGltZU5vd1xyXG5cclxuICAgICAgaWYgKGlzQ29ubmVjdGluZykge1xyXG4gICAgICAgIHZhciBvbkxvb2t1cFRpbWluZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHNlbGYudGltaW5ncy5sb29rdXAgPSBub3coKSAtIHNlbGYuc3RhcnRUaW1lTm93XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgb25Db25uZWN0VGltaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgc2VsZi50aW1pbmdzLmNvbm5lY3QgPSBub3coKSAtIHNlbGYuc3RhcnRUaW1lTm93XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzb2NrZXQub25jZSgnbG9va3VwJywgb25Mb29rdXBUaW1pbmcpXHJcbiAgICAgICAgc29ja2V0Lm9uY2UoJ2Nvbm5lY3QnLCBvbkNvbm5lY3RUaW1pbmcpXHJcblxyXG4gICAgICAgIC8vIGNsZWFuIHVwIHRpbWluZyBldmVudCBsaXN0ZW5lcnMgaWYgbmVlZGVkIG9uIGVycm9yXHJcbiAgICAgICAgc2VsZi5yZXEub25jZSgnZXJyb3InLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2xvb2t1cCcsIG9uTG9va3VwVGltaW5nKVxyXG4gICAgICAgICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKCdjb25uZWN0Jywgb25Db25uZWN0VGltaW5nKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgc2V0UmVxVGltZW91dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gVGhpcyB0aW1lb3V0IHNldHMgdGhlIGFtb3VudCBvZiB0aW1lIHRvIHdhaXQgKmJldHdlZW4qIGJ5dGVzIHNlbnRcclxuICAgICAgLy8gZnJvbSB0aGUgc2VydmVyIG9uY2UgY29ubmVjdGVkLlxyXG4gICAgICAvL1xyXG4gICAgICAvLyBJbiBwYXJ0aWN1bGFyLCBpdCdzIHVzZWZ1bCBmb3IgZXJyb3JpbmcgaWYgdGhlIHNlcnZlciBmYWlscyB0byBzZW5kXHJcbiAgICAgIC8vIGRhdGEgaGFsZndheSB0aHJvdWdoIHN0cmVhbWluZyBhIHJlc3BvbnNlLlxyXG4gICAgICBzZWxmLnJlcS5zZXRUaW1lb3V0KHRpbWVvdXQsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoc2VsZi5yZXEpIHtcclxuICAgICAgICAgIHNlbGYuYWJvcnQoKVxyXG4gICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoJ0VTT0NLRVRUSU1FRE9VVCcpXHJcbiAgICAgICAgICBlLmNvZGUgPSAnRVNPQ0tFVFRJTUVET1VUJ1xyXG4gICAgICAgICAgZS5jb25uZWN0ID0gZmFsc2VcclxuICAgICAgICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIGlmICh0aW1lb3V0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgLy8gT25seSBzdGFydCB0aGUgY29ubmVjdGlvbiB0aW1lciBpZiB3ZSdyZSBhY3R1YWxseSBjb25uZWN0aW5nIGEgbmV3XHJcbiAgICAgIC8vIHNvY2tldCwgb3RoZXJ3aXNlIGlmIHdlJ3JlIGFscmVhZHkgY29ubmVjdGVkIChiZWNhdXNlIHRoaXMgaXMgYVxyXG4gICAgICAvLyBrZWVwLWFsaXZlIGNvbm5lY3Rpb24pIGRvIG5vdCBib3RoZXIuIFRoaXMgaXMgaW1wb3J0YW50IHNpbmNlIHdlIHdvbid0XHJcbiAgICAgIC8vIGdldCBhICdjb25uZWN0JyBldmVudCBmb3IgYW4gYWxyZWFkeSBjb25uZWN0ZWQgc29ja2V0LlxyXG4gICAgICBpZiAoaXNDb25uZWN0aW5nKSB7XHJcbiAgICAgICAgdmFyIG9uUmVxU29ja0Nvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2Nvbm5lY3QnLCBvblJlcVNvY2tDb25uZWN0KVxyXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dFRpbWVyKVxyXG4gICAgICAgICAgc2VsZi50aW1lb3V0VGltZXIgPSBudWxsXHJcbiAgICAgICAgICBzZXRSZXFUaW1lb3V0KClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNvY2tldC5vbignY29ubmVjdCcsIG9uUmVxU29ja0Nvbm5lY3QpXHJcblxyXG4gICAgICAgIHNlbGYucmVxLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBoYW5kbGUtY2FsbGJhY2stZXJyXHJcbiAgICAgICAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2Nvbm5lY3QnLCBvblJlcVNvY2tDb25uZWN0KVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIFNldCBhIHRpbWVvdXQgaW4gbWVtb3J5IC0gdGhpcyBibG9jayB3aWxsIHRocm93IGlmIHRoZSBzZXJ2ZXIgdGFrZXMgbW9yZVxyXG4gICAgICAgIC8vIHRoYW4gYHRpbWVvdXRgIHRvIHdyaXRlIHRoZSBIVFRQIHN0YXR1cyBhbmQgaGVhZGVycyAoY29ycmVzcG9uZGluZyB0b1xyXG4gICAgICAgIC8vIHRoZSBvbigncmVzcG9uc2UnKSBldmVudCBvbiB0aGUgY2xpZW50KS4gTkI6IHRoaXMgbWVhc3VyZXMgd2FsbC1jbG9ja1xyXG4gICAgICAgIC8vIHRpbWUsIG5vdCB0aGUgdGltZSBiZXR3ZWVuIGJ5dGVzIHNlbnQgYnkgdGhlIHNlcnZlci5cclxuICAgICAgICBzZWxmLnRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKCdjb25uZWN0Jywgb25SZXFTb2NrQ29ubmVjdClcclxuICAgICAgICAgIHNlbGYuYWJvcnQoKVxyXG4gICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoJ0VUSU1FRE9VVCcpXHJcbiAgICAgICAgICBlLmNvZGUgPSAnRVRJTUVET1VUJ1xyXG4gICAgICAgICAgZS5jb25uZWN0ID0gdHJ1ZVxyXG4gICAgICAgICAgc2VsZi5lbWl0KCdlcnJvcicsIGUpXHJcbiAgICAgICAgfSwgdGltZW91dClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBXZSdyZSBhbHJlYWR5IGNvbm5lY3RlZFxyXG4gICAgICAgIHNldFJlcVRpbWVvdXQoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBzZWxmLmVtaXQoJ3NvY2tldCcsIHNvY2tldClcclxuICB9KVxyXG5cclxuICBzZWxmLmVtaXQoJ3JlcXVlc3QnLCBzZWxmLnJlcSlcclxufVxyXG5cclxuUmVxdWVzdC5wcm90b3R5cGUub25SZXF1ZXN0RXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICBpZiAoc2VsZi5fYWJvcnRlZCkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIGlmIChzZWxmLnJlcSAmJiBzZWxmLnJlcS5fcmV1c2VkU29ja2V0ICYmIGVycm9yLmNvZGUgPT09ICdFQ09OTlJFU0VUJyAmJlxyXG4gICAgc2VsZi5hZ2VudC5hZGRSZXF1ZXN0Tm9yZXVzZSkge1xyXG4gICAgc2VsZi5hZ2VudCA9IHsgYWRkUmVxdWVzdDogc2VsZi5hZ2VudC5hZGRSZXF1ZXN0Tm9yZXVzZS5iaW5kKHNlbGYuYWdlbnQpIH1cclxuICAgIHNlbGYuc3RhcnQoKVxyXG4gICAgc2VsZi5yZXEuZW5kKClcclxuICAgIHJldHVyblxyXG4gIH1cclxuICBpZiAoc2VsZi50aW1lb3V0ICYmIHNlbGYudGltZW91dFRpbWVyKSB7XHJcbiAgICBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0VGltZXIpXHJcbiAgICBzZWxmLnRpbWVvdXRUaW1lciA9IG51bGxcclxuICB9XHJcbiAgc2VsZi5lbWl0KCdlcnJvcicsIGVycm9yKVxyXG59XHJcblxyXG5SZXF1ZXN0LnByb3RvdHlwZS5vblJlcXVlc3RSZXNwb25zZSA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG5cclxuICBpZiAoc2VsZi50aW1pbmcpIHtcclxuICAgIHNlbGYudGltaW5ncy5yZXNwb25zZSA9IG5vdygpIC0gc2VsZi5zdGFydFRpbWVOb3dcclxuICB9XHJcblxyXG4gIGRlYnVnKCdvblJlcXVlc3RSZXNwb25zZScsIHNlbGYudXJpLmhyZWYsIHJlc3BvbnNlLnN0YXR1c0NvZGUsIHJlc3BvbnNlLmhlYWRlcnMpXHJcbiAgcmVzcG9uc2Uub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChzZWxmLnRpbWluZykge1xyXG4gICAgICBzZWxmLnRpbWluZ3MuZW5kID0gbm93KCkgLSBzZWxmLnN0YXJ0VGltZU5vd1xyXG4gICAgICByZXNwb25zZS50aW1pbmdTdGFydCA9IHNlbGYuc3RhcnRUaW1lXHJcblxyXG4gICAgICAvLyBmaWxsIGluIHRoZSBibGFua3MgZm9yIGFueSBwZXJpb2RzIHRoYXQgZGlkbid0IHRyaWdnZXIsIHN1Y2ggYXNcclxuICAgICAgLy8gbm8gbG9va3VwIG9yIGNvbm5lY3QgZHVlIHRvIGtlZXAgYWxpdmVcclxuICAgICAgaWYgKCFzZWxmLnRpbWluZ3Muc29ja2V0KSB7XHJcbiAgICAgICAgc2VsZi50aW1pbmdzLnNvY2tldCA9IDBcclxuICAgICAgfVxyXG4gICAgICBpZiAoIXNlbGYudGltaW5ncy5sb29rdXApIHtcclxuICAgICAgICBzZWxmLnRpbWluZ3MubG9va3VwID0gc2VsZi50aW1pbmdzLnNvY2tldFxyXG4gICAgICB9XHJcbiAgICAgIGlmICghc2VsZi50aW1pbmdzLmNvbm5lY3QpIHtcclxuICAgICAgICBzZWxmLnRpbWluZ3MuY29ubmVjdCA9IHNlbGYudGltaW5ncy5sb29rdXBcclxuICAgICAgfVxyXG4gICAgICBpZiAoIXNlbGYudGltaW5ncy5yZXNwb25zZSkge1xyXG4gICAgICAgIHNlbGYudGltaW5ncy5yZXNwb25zZSA9IHNlbGYudGltaW5ncy5jb25uZWN0XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRlYnVnKCdlbGFwc2VkIHRpbWUnLCBzZWxmLnRpbWluZ3MuZW5kKVxyXG5cclxuICAgICAgLy8gZWxhcHNlZFRpbWUgaW5jbHVkZXMgYWxsIHJlZGlyZWN0c1xyXG4gICAgICBzZWxmLmVsYXBzZWRUaW1lICs9IE1hdGgucm91bmQoc2VsZi50aW1pbmdzLmVuZClcclxuXHJcbiAgICAgIC8vIE5PVEU6IGVsYXBzZWRUaW1lIGlzIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgLnRpbWluZ3NcclxuICAgICAgcmVzcG9uc2UuZWxhcHNlZFRpbWUgPSBzZWxmLmVsYXBzZWRUaW1lXHJcblxyXG4gICAgICAvLyB0aW1pbmdzIGlzIGp1c3QgZm9yIHRoZSBmaW5hbCBmZXRjaFxyXG4gICAgICByZXNwb25zZS50aW1pbmdzID0gc2VsZi50aW1pbmdzXHJcblxyXG4gICAgICAvLyBwcmUtY2FsY3VsYXRlIHBoYXNlIHRpbWluZ3MgYXMgd2VsbFxyXG4gICAgICByZXNwb25zZS50aW1pbmdQaGFzZXMgPSB7XHJcbiAgICAgICAgd2FpdDogc2VsZi50aW1pbmdzLnNvY2tldCxcclxuICAgICAgICBkbnM6IHNlbGYudGltaW5ncy5sb29rdXAgLSBzZWxmLnRpbWluZ3Muc29ja2V0LFxyXG4gICAgICAgIHRjcDogc2VsZi50aW1pbmdzLmNvbm5lY3QgLSBzZWxmLnRpbWluZ3MubG9va3VwLFxyXG4gICAgICAgIGZpcnN0Qnl0ZTogc2VsZi50aW1pbmdzLnJlc3BvbnNlIC0gc2VsZi50aW1pbmdzLmNvbm5lY3QsXHJcbiAgICAgICAgZG93bmxvYWQ6IHNlbGYudGltaW5ncy5lbmQgLSBzZWxmLnRpbWluZ3MucmVzcG9uc2UsXHJcbiAgICAgICAgdG90YWw6IHNlbGYudGltaW5ncy5lbmRcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZGVidWcoJ3Jlc3BvbnNlIGVuZCcsIHNlbGYudXJpLmhyZWYsIHJlc3BvbnNlLnN0YXR1c0NvZGUsIHJlc3BvbnNlLmhlYWRlcnMpXHJcbiAgfSlcclxuXHJcbiAgaWYgKHNlbGYuX2Fib3J0ZWQpIHtcclxuICAgIGRlYnVnKCdhYm9ydGVkJywgc2VsZi51cmkuaHJlZilcclxuICAgIHJlc3BvbnNlLnJlc3VtZSgpXHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIHNlbGYucmVzcG9uc2UgPSByZXNwb25zZVxyXG4gIHJlc3BvbnNlLnJlcXVlc3QgPSBzZWxmXHJcbiAgcmVzcG9uc2UudG9KU09OID0gcmVzcG9uc2VUb0pTT05cclxuXHJcbiAgLy8gWFhYIFRoaXMgaXMgZGlmZmVyZW50IG9uIDAuMTAsIGJlY2F1c2UgU1NMIGlzIHN0cmljdCBieSBkZWZhdWx0XHJcbiAgaWYgKHNlbGYuaHR0cE1vZHVsZSA9PT0gaHR0cHMgJiZcclxuICAgIHNlbGYuc3RyaWN0U1NMICYmICghcmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ3NvY2tldCcpIHx8XHJcbiAgICAhcmVzcG9uc2Uuc29ja2V0LmF1dGhvcml6ZWQpKSB7XHJcbiAgICBkZWJ1Zygnc3RyaWN0IHNzbCBlcnJvcicsIHNlbGYudXJpLmhyZWYpXHJcbiAgICB2YXIgc3NsRXJyID0gcmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ3NvY2tldCcpID8gcmVzcG9uc2Uuc29ja2V0LmF1dGhvcml6YXRpb25FcnJvciA6IHNlbGYudXJpLmhyZWYgKyAnIGRvZXMgbm90IHN1cHBvcnQgU1NMJ1xyXG4gICAgc2VsZi5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignU1NMIEVycm9yOiAnICsgc3NsRXJyKSlcclxuICAgIHJldHVyblxyXG4gIH1cclxuXHJcbiAgLy8gU2F2ZSB0aGUgb3JpZ2luYWwgaG9zdCBiZWZvcmUgYW55IHJlZGlyZWN0IChpZiBpdCBjaGFuZ2VzLCB3ZSBuZWVkIHRvXHJcbiAgLy8gcmVtb3ZlIGFueSBhdXRob3JpemF0aW9uIGhlYWRlcnMpLiAgQWxzbyByZW1lbWJlciB0aGUgY2FzZSBvZiB0aGUgaGVhZGVyXHJcbiAgLy8gbmFtZSBiZWNhdXNlIGxvdHMgb2YgYnJva2VuIHNlcnZlcnMgZXhwZWN0IEhvc3QgaW5zdGVhZCBvZiBob3N0IGFuZCB3ZVxyXG4gIC8vIHdhbnQgdGhlIGNhbGxlciB0byBiZSBhYmxlIHRvIHNwZWNpZnkgdGhpcy5cclxuICBzZWxmLm9yaWdpbmFsSG9zdCA9IHNlbGYuZ2V0SGVhZGVyKCdob3N0JylcclxuICBpZiAoIXNlbGYub3JpZ2luYWxIb3N0SGVhZGVyTmFtZSkge1xyXG4gICAgc2VsZi5vcmlnaW5hbEhvc3RIZWFkZXJOYW1lID0gc2VsZi5oYXNIZWFkZXIoJ2hvc3QnKVxyXG4gIH1cclxuICBpZiAoc2VsZi5zZXRIb3N0KSB7XHJcbiAgICBzZWxmLnJlbW92ZUhlYWRlcignaG9zdCcpXHJcbiAgfVxyXG4gIGlmIChzZWxmLnRpbWVvdXQgJiYgc2VsZi50aW1lb3V0VGltZXIpIHtcclxuICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXRUaW1lcilcclxuICAgIHNlbGYudGltZW91dFRpbWVyID0gbnVsbFxyXG4gIH1cclxuXHJcbiAgdmFyIHRhcmdldENvb2tpZUphciA9IChzZWxmLl9qYXIgJiYgc2VsZi5famFyLnNldENvb2tpZSkgPyBzZWxmLl9qYXIgOiBnbG9iYWxDb29raWVKYXJcclxuICB2YXIgYWRkQ29va2llID0gZnVuY3Rpb24gKGNvb2tpZSkge1xyXG4gICAgLy8gc2V0IHRoZSBjb29raWUgaWYgaXQncyBkb21haW4gaW4gdGhlIGhyZWYncyBkb21haW4uXHJcbiAgICB0cnkge1xyXG4gICAgICB0YXJnZXRDb29raWVKYXIuc2V0Q29va2llKGNvb2tpZSwgc2VsZi51cmkuaHJlZiwge2lnbm9yZUVycm9yOiB0cnVlfSlcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgc2VsZi5lbWl0KCdlcnJvcicsIGUpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXNwb25zZS5jYXNlbGVzcyA9IGNhc2VsZXNzKHJlc3BvbnNlLmhlYWRlcnMpXHJcblxyXG4gIGlmIChyZXNwb25zZS5jYXNlbGVzcy5oYXMoJ3NldC1jb29raWUnKSAmJiAoIXNlbGYuX2Rpc2FibGVDb29raWVzKSkge1xyXG4gICAgdmFyIGhlYWRlck5hbWUgPSByZXNwb25zZS5jYXNlbGVzcy5oYXMoJ3NldC1jb29raWUnKVxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocmVzcG9uc2UuaGVhZGVyc1toZWFkZXJOYW1lXSkpIHtcclxuICAgICAgcmVzcG9uc2UuaGVhZGVyc1toZWFkZXJOYW1lXS5mb3JFYWNoKGFkZENvb2tpZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFkZENvb2tpZShyZXNwb25zZS5oZWFkZXJzW2hlYWRlck5hbWVdKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHNlbGYuX3JlZGlyZWN0Lm9uUmVzcG9uc2UocmVzcG9uc2UpKSB7XHJcbiAgICByZXR1cm4gLy8gSWdub3JlIHRoZSByZXN0IG9mIHRoZSByZXNwb25zZVxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBCZSBhIGdvb2Qgc3RyZWFtIGFuZCBlbWl0IGVuZCB3aGVuIHRoZSByZXNwb25zZSBpcyBmaW5pc2hlZC5cclxuICAgIC8vIEhhY2sgdG8gZW1pdCBlbmQgb24gY2xvc2UgYmVjYXVzZSBvZiBhIGNvcmUgYnVnIHRoYXQgbmV2ZXIgZmlyZXMgZW5kXHJcbiAgICByZXNwb25zZS5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghc2VsZi5fZW5kZWQpIHtcclxuICAgICAgICBzZWxmLnJlc3BvbnNlLmVtaXQoJ2VuZCcpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgcmVzcG9uc2Uub25jZSgnZW5kJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLl9lbmRlZCA9IHRydWVcclxuICAgIH0pXHJcblxyXG4gICAgdmFyIG5vQm9keSA9IGZ1bmN0aW9uIChjb2RlKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgc2VsZi5tZXRob2QgPT09ICdIRUFEJyB8fFxyXG4gICAgICAgIC8vIEluZm9ybWF0aW9uYWxcclxuICAgICAgICAoY29kZSA+PSAxMDAgJiYgY29kZSA8IDIwMCkgfHxcclxuICAgICAgICAvLyBObyBDb250ZW50XHJcbiAgICAgICAgY29kZSA9PT0gMjA0IHx8XHJcbiAgICAgICAgLy8gTm90IE1vZGlmaWVkXHJcbiAgICAgICAgY29kZSA9PT0gMzA0XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmVzcG9uc2VDb250ZW50XHJcbiAgICBpZiAoc2VsZi5nemlwICYmICFub0JvZHkocmVzcG9uc2Uuc3RhdHVzQ29kZSkpIHtcclxuICAgICAgdmFyIGNvbnRlbnRFbmNvZGluZyA9IHJlc3BvbnNlLmhlYWRlcnNbJ2NvbnRlbnQtZW5jb2RpbmcnXSB8fCAnaWRlbnRpdHknXHJcbiAgICAgIGNvbnRlbnRFbmNvZGluZyA9IGNvbnRlbnRFbmNvZGluZy50cmltKCkudG9Mb3dlckNhc2UoKVxyXG5cclxuICAgICAgLy8gQmUgbW9yZSBsZW5pZW50IHdpdGggZGVjb2RpbmcgY29tcHJlc3NlZCByZXNwb25zZXMsIHNpbmNlICh2ZXJ5IHJhcmVseSlcclxuICAgICAgLy8gc2VydmVycyBzZW5kIHNsaWdodGx5IGludmFsaWQgZ3ppcCByZXNwb25zZXMgdGhhdCBhcmUgc3RpbGwgYWNjZXB0ZWRcclxuICAgICAgLy8gYnkgY29tbW9uIGJyb3dzZXJzLlxyXG4gICAgICAvLyBBbHdheXMgdXNpbmcgWl9TWU5DX0ZMVVNIIGlzIHdoYXQgY1VSTCBkb2VzLlxyXG4gICAgICB2YXIgemxpYk9wdGlvbnMgPSB7XHJcbiAgICAgICAgZmx1c2g6IHpsaWIuWl9TWU5DX0ZMVVNILFxyXG4gICAgICAgIGZpbmlzaEZsdXNoOiB6bGliLlpfU1lOQ19GTFVTSFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY29udGVudEVuY29kaW5nID09PSAnZ3ppcCcpIHtcclxuICAgICAgICByZXNwb25zZUNvbnRlbnQgPSB6bGliLmNyZWF0ZUd1bnppcCh6bGliT3B0aW9ucylcclxuICAgICAgICByZXNwb25zZS5waXBlKHJlc3BvbnNlQ29udGVudClcclxuICAgICAgfSBlbHNlIGlmIChjb250ZW50RW5jb2RpbmcgPT09ICdkZWZsYXRlJykge1xyXG4gICAgICAgIHJlc3BvbnNlQ29udGVudCA9IHpsaWIuY3JlYXRlSW5mbGF0ZSh6bGliT3B0aW9ucylcclxuICAgICAgICByZXNwb25zZS5waXBlKHJlc3BvbnNlQ29udGVudClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBTaW5jZSBwcmV2aW91cyB2ZXJzaW9ucyBkaWRuJ3QgY2hlY2sgZm9yIENvbnRlbnQtRW5jb2RpbmcgaGVhZGVyLFxyXG4gICAgICAgIC8vIGlnbm9yZSBhbnkgaW52YWxpZCB2YWx1ZXMgdG8gcHJlc2VydmUgYmFja3dhcmRzLWNvbXBhdGliaWxpdHlcclxuICAgICAgICBpZiAoY29udGVudEVuY29kaW5nICE9PSAnaWRlbnRpdHknKSB7XHJcbiAgICAgICAgICBkZWJ1ZygnaWdub3JpbmcgdW5yZWNvZ25pemVkIENvbnRlbnQtRW5jb2RpbmcgJyArIGNvbnRlbnRFbmNvZGluZylcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzcG9uc2VDb250ZW50ID0gcmVzcG9uc2VcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzcG9uc2VDb250ZW50ID0gcmVzcG9uc2VcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZi5lbmNvZGluZykge1xyXG4gICAgICBpZiAoc2VsZi5kZXN0cy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdJZ25vcmluZyBlbmNvZGluZyBwYXJhbWV0ZXIgYXMgdGhpcyBzdHJlYW0gaXMgYmVpbmcgcGlwZWQgdG8gYW5vdGhlciBzdHJlYW0gd2hpY2ggbWFrZXMgdGhlIGVuY29kaW5nIG9wdGlvbiBpbnZhbGlkLicpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzcG9uc2VDb250ZW50LnNldEVuY29kaW5nKHNlbGYuZW5jb2RpbmcpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZi5fcGF1c2VkKSB7XHJcbiAgICAgIHJlc3BvbnNlQ29udGVudC5wYXVzZSgpXHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5yZXNwb25zZUNvbnRlbnQgPSByZXNwb25zZUNvbnRlbnRcclxuXHJcbiAgICBzZWxmLmVtaXQoJ3Jlc3BvbnNlJywgcmVzcG9uc2UpXHJcblxyXG4gICAgc2VsZi5kZXN0cy5mb3JFYWNoKGZ1bmN0aW9uIChkZXN0KSB7XHJcbiAgICAgIHNlbGYucGlwZURlc3QoZGVzdClcclxuICAgIH0pXHJcblxyXG4gICAgcmVzcG9uc2VDb250ZW50Lm9uKCdkYXRhJywgZnVuY3Rpb24gKGNodW5rKSB7XHJcbiAgICAgIGlmIChzZWxmLnRpbWluZyAmJiAhc2VsZi5yZXNwb25zZVN0YXJ0ZWQpIHtcclxuICAgICAgICBzZWxmLnJlc3BvbnNlU3RhcnRUaW1lID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKVxyXG5cclxuICAgICAgICAvLyBOT1RFOiByZXNwb25zZVN0YXJ0VGltZSBpcyBkZXByZWNhdGVkIGluIGZhdm9yIG9mIC50aW1pbmdzXHJcbiAgICAgICAgcmVzcG9uc2UucmVzcG9uc2VTdGFydFRpbWUgPSBzZWxmLnJlc3BvbnNlU3RhcnRUaW1lXHJcbiAgICAgIH1cclxuICAgICAgc2VsZi5fZGVzdGRhdGEgPSB0cnVlXHJcbiAgICAgIHNlbGYuZW1pdCgnZGF0YScsIGNodW5rKVxyXG4gICAgfSlcclxuICAgIHJlc3BvbnNlQ29udGVudC5vbmNlKCdlbmQnLCBmdW5jdGlvbiAoY2h1bmspIHtcclxuICAgICAgc2VsZi5lbWl0KCdlbmQnLCBjaHVuaylcclxuICAgIH0pXHJcbiAgICByZXNwb25zZUNvbnRlbnQub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlcnJvcilcclxuICAgIH0pXHJcbiAgICByZXNwb25zZUNvbnRlbnQub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkgeyBzZWxmLmVtaXQoJ2Nsb3NlJykgfSlcclxuXHJcbiAgICBpZiAoc2VsZi5jYWxsYmFjaykge1xyXG4gICAgICBzZWxmLnJlYWRSZXNwb25zZUJvZHkocmVzcG9uc2UpXHJcbiAgICB9IGVsc2UgeyAvLyBpZiBubyBjYWxsYmFja1xyXG4gICAgICBzZWxmLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHNlbGYuX2Fib3J0ZWQpIHtcclxuICAgICAgICAgIGRlYnVnKCdhYm9ydGVkJywgc2VsZi51cmkuaHJlZilcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBzZWxmLmVtaXQoJ2NvbXBsZXRlJywgcmVzcG9uc2UpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG4gIGRlYnVnKCdmaW5pc2ggaW5pdCBmdW5jdGlvbicsIHNlbGYudXJpLmhyZWYpXHJcbn1cclxuXHJcblJlcXVlc3QucHJvdG90eXBlLnJlYWRSZXNwb25zZUJvZHkgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICBkZWJ1ZyhcInJlYWRpbmcgcmVzcG9uc2UncyBib2R5XCIpXHJcbiAgdmFyIGJ1ZmZlcnMgPSBbXVxyXG4gIHZhciBidWZmZXJMZW5ndGggPSAwXHJcbiAgdmFyIHN0cmluZ3MgPSBbXVxyXG5cclxuICBzZWxmLm9uKCdkYXRhJywgZnVuY3Rpb24gKGNodW5rKSB7XHJcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihjaHVuaykpIHtcclxuICAgICAgc3RyaW5ncy5wdXNoKGNodW5rKVxyXG4gICAgfSBlbHNlIGlmIChjaHVuay5sZW5ndGgpIHtcclxuICAgICAgYnVmZmVyTGVuZ3RoICs9IGNodW5rLmxlbmd0aFxyXG4gICAgICBidWZmZXJzLnB1c2goY2h1bmspXHJcbiAgICB9XHJcbiAgfSlcclxuICBzZWxmLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBkZWJ1ZygnZW5kIGV2ZW50Jywgc2VsZi51cmkuaHJlZilcclxuICAgIGlmIChzZWxmLl9hYm9ydGVkKSB7XHJcbiAgICAgIGRlYnVnKCdhYm9ydGVkJywgc2VsZi51cmkuaHJlZilcclxuICAgICAgLy8gYGJ1ZmZlcmAgaXMgZGVmaW5lZCBpbiB0aGUgcGFyZW50IHNjb3BlIGFuZCB1c2VkIGluIGEgY2xvc3VyZSBpdCBleGlzdHMgZm9yIHRoZSBsaWZlIG9mIHRoZSByZXF1ZXN0LlxyXG4gICAgICAvLyBUaGlzIGNhbiBsZWFkIHRvIGxlYWt5IGJlaGF2aW9yIGlmIHRoZSB1c2VyIHJldGFpbnMgYSByZWZlcmVuY2UgdG8gdGhlIHJlcXVlc3Qgb2JqZWN0LlxyXG4gICAgICBidWZmZXJzID0gW11cclxuICAgICAgYnVmZmVyTGVuZ3RoID0gMFxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAoYnVmZmVyTGVuZ3RoKSB7XHJcbiAgICAgIGRlYnVnKCdoYXMgYm9keScsIHNlbGYudXJpLmhyZWYsIGJ1ZmZlckxlbmd0aClcclxuICAgICAgcmVzcG9uc2UuYm9keSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycywgYnVmZmVyTGVuZ3RoKVxyXG4gICAgICBpZiAoc2VsZi5lbmNvZGluZyAhPT0gbnVsbCkge1xyXG4gICAgICAgIHJlc3BvbnNlLmJvZHkgPSByZXNwb25zZS5ib2R5LnRvU3RyaW5nKHNlbGYuZW5jb2RpbmcpXHJcbiAgICAgIH1cclxuICAgICAgLy8gYGJ1ZmZlcmAgaXMgZGVmaW5lZCBpbiB0aGUgcGFyZW50IHNjb3BlIGFuZCB1c2VkIGluIGEgY2xvc3VyZSBpdCBleGlzdHMgZm9yIHRoZSBsaWZlIG9mIHRoZSBSZXF1ZXN0LlxyXG4gICAgICAvLyBUaGlzIGNhbiBsZWFkIHRvIGxlYWt5IGJlaGF2aW9yIGlmIHRoZSB1c2VyIHJldGFpbnMgYSByZWZlcmVuY2UgdG8gdGhlIHJlcXVlc3Qgb2JqZWN0LlxyXG4gICAgICBidWZmZXJzID0gW11cclxuICAgICAgYnVmZmVyTGVuZ3RoID0gMFxyXG4gICAgfSBlbHNlIGlmIChzdHJpbmdzLmxlbmd0aCkge1xyXG4gICAgICAvLyBUaGUgVVRGOCBCT00gWzB4RUYsMHhCQiwweEJGXSBpcyBjb252ZXJ0ZWQgdG8gWzB4RkUsMHhGRl0gaW4gdGhlIEpTIFVUQzE2L1VDUzIgcmVwcmVzZW50YXRpb24uXHJcbiAgICAgIC8vIFN0cmlwIHRoaXMgdmFsdWUgb3V0IHdoZW4gdGhlIGVuY29kaW5nIGlzIHNldCB0byAndXRmOCcsIGFzIHVwc3RyZWFtIGNvbnN1bWVycyB3b24ndCBleHBlY3QgaXQgYW5kIGl0IGJyZWFrcyBKU09OLnBhcnNlKCkuXHJcbiAgICAgIGlmIChzZWxmLmVuY29kaW5nID09PSAndXRmOCcgJiYgc3RyaW5nc1swXS5sZW5ndGggPiAwICYmIHN0cmluZ3NbMF1bMF0gPT09ICdcXHVGRUZGJykge1xyXG4gICAgICAgIHN0cmluZ3NbMF0gPSBzdHJpbmdzWzBdLnN1YnN0cmluZygxKVxyXG4gICAgICB9XHJcbiAgICAgIHJlc3BvbnNlLmJvZHkgPSBzdHJpbmdzLmpvaW4oJycpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNlbGYuX2pzb24pIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXNwb25zZS5ib2R5ID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5LCBzZWxmLl9qc29uUmV2aXZlcilcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGRlYnVnKCdpbnZhbGlkIEpTT04gcmVjZWl2ZWQnLCBzZWxmLnVyaS5ocmVmKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBkZWJ1ZygnZW1pdHRpbmcgY29tcGxldGUnLCBzZWxmLnVyaS5ocmVmKVxyXG4gICAgaWYgKHR5cGVvZiByZXNwb25zZS5ib2R5ID09PSAndW5kZWZpbmVkJyAmJiAhc2VsZi5fanNvbikge1xyXG4gICAgICByZXNwb25zZS5ib2R5ID0gc2VsZi5lbmNvZGluZyA9PT0gbnVsbCA/IEJ1ZmZlci5hbGxvYygwKSA6ICcnXHJcbiAgICB9XHJcbiAgICBzZWxmLmVtaXQoJ2NvbXBsZXRlJywgcmVzcG9uc2UsIHJlc3BvbnNlLmJvZHkpXHJcbiAgfSlcclxufVxyXG5cclxuUmVxdWVzdC5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgc2VsZi5fYWJvcnRlZCA9IHRydWVcclxuXHJcbiAgaWYgKHNlbGYucmVxKSB7XHJcbiAgICBzZWxmLnJlcS5hYm9ydCgpXHJcbiAgfSBlbHNlIGlmIChzZWxmLnJlc3BvbnNlKSB7XHJcbiAgICBzZWxmLnJlc3BvbnNlLmRlc3Ryb3koKVxyXG4gIH1cclxuXHJcbiAgc2VsZi5lbWl0KCdhYm9ydCcpXHJcbn1cclxuXHJcblJlcXVlc3QucHJvdG90eXBlLnBpcGVEZXN0ID0gZnVuY3Rpb24gKGRlc3QpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICB2YXIgcmVzcG9uc2UgPSBzZWxmLnJlc3BvbnNlXHJcbiAgLy8gQ2FsbGVkIGFmdGVyIHRoZSByZXNwb25zZSBpcyByZWNlaXZlZFxyXG4gIGlmIChkZXN0LmhlYWRlcnMgJiYgIWRlc3QuaGVhZGVyc1NlbnQpIHtcclxuICAgIGlmIChyZXNwb25zZS5jYXNlbGVzcy5oYXMoJ2NvbnRlbnQtdHlwZScpKSB7XHJcbiAgICAgIHZhciBjdG5hbWUgPSByZXNwb25zZS5jYXNlbGVzcy5oYXMoJ2NvbnRlbnQtdHlwZScpXHJcbiAgICAgIGlmIChkZXN0LnNldEhlYWRlcikge1xyXG4gICAgICAgIGRlc3Quc2V0SGVhZGVyKGN0bmFtZSwgcmVzcG9uc2UuaGVhZGVyc1tjdG5hbWVdKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRlc3QuaGVhZGVyc1tjdG5hbWVdID0gcmVzcG9uc2UuaGVhZGVyc1tjdG5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVzcG9uc2UuY2FzZWxlc3MuaGFzKCdjb250ZW50LWxlbmd0aCcpKSB7XHJcbiAgICAgIHZhciBjbG5hbWUgPSByZXNwb25zZS5jYXNlbGVzcy5oYXMoJ2NvbnRlbnQtbGVuZ3RoJylcclxuICAgICAgaWYgKGRlc3Quc2V0SGVhZGVyKSB7XHJcbiAgICAgICAgZGVzdC5zZXRIZWFkZXIoY2xuYW1lLCByZXNwb25zZS5oZWFkZXJzW2NsbmFtZV0pXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGVzdC5oZWFkZXJzW2NsbmFtZV0gPSByZXNwb25zZS5oZWFkZXJzW2NsbmFtZV1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoZGVzdC5zZXRIZWFkZXIgJiYgIWRlc3QuaGVhZGVyc1NlbnQpIHtcclxuICAgIGZvciAodmFyIGkgaW4gcmVzcG9uc2UuaGVhZGVycykge1xyXG4gICAgICAvLyBJZiB0aGUgcmVzcG9uc2UgY29udGVudCBpcyBiZWluZyBkZWNvZGVkLCB0aGUgQ29udGVudC1FbmNvZGluZyBoZWFkZXJcclxuICAgICAgLy8gb2YgdGhlIHJlc3BvbnNlIGRvZXNuJ3QgcmVwcmVzZW50IHRoZSBwaXBlZCBjb250ZW50LCBzbyBkb24ndCBwYXNzIGl0LlxyXG4gICAgICBpZiAoIXNlbGYuZ3ppcCB8fCBpICE9PSAnY29udGVudC1lbmNvZGluZycpIHtcclxuICAgICAgICBkZXN0LnNldEhlYWRlcihpLCByZXNwb25zZS5oZWFkZXJzW2ldKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBkZXN0LnN0YXR1c0NvZGUgPSByZXNwb25zZS5zdGF0dXNDb2RlXHJcbiAgfVxyXG4gIGlmIChzZWxmLnBpcGVmaWx0ZXIpIHtcclxuICAgIHNlbGYucGlwZWZpbHRlcihyZXNwb25zZSwgZGVzdClcclxuICB9XHJcbn1cclxuXHJcblJlcXVlc3QucHJvdG90eXBlLnFzID0gZnVuY3Rpb24gKHEsIGNsb2JiZXIpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICB2YXIgYmFzZVxyXG4gIGlmICghY2xvYmJlciAmJiBzZWxmLnVyaS5xdWVyeSkge1xyXG4gICAgYmFzZSA9IHNlbGYuX3FzLnBhcnNlKHNlbGYudXJpLnF1ZXJ5KVxyXG4gIH0gZWxzZSB7XHJcbiAgICBiYXNlID0ge31cclxuICB9XHJcblxyXG4gIGZvciAodmFyIGkgaW4gcSkge1xyXG4gICAgYmFzZVtpXSA9IHFbaV1cclxuICB9XHJcblxyXG4gIHZhciBxcyA9IHNlbGYuX3FzLnN0cmluZ2lmeShiYXNlKVxyXG5cclxuICBpZiAocXMgPT09ICcnKSB7XHJcbiAgICByZXR1cm4gc2VsZlxyXG4gIH1cclxuXHJcbiAgc2VsZi51cmkgPSB1cmwucGFyc2Uoc2VsZi51cmkuaHJlZi5zcGxpdCgnPycpWzBdICsgJz8nICsgcXMpXHJcbiAgc2VsZi51cmwgPSBzZWxmLnVyaVxyXG4gIHNlbGYucGF0aCA9IHNlbGYudXJpLnBhdGhcclxuXHJcbiAgaWYgKHNlbGYudXJpLmhvc3QgPT09ICd1bml4Jykge1xyXG4gICAgc2VsZi5lbmFibGVVbml4U29ja2V0KClcclxuICB9XHJcblxyXG4gIHJldHVybiBzZWxmXHJcbn1cclxuUmVxdWVzdC5wcm90b3R5cGUuZm9ybSA9IGZ1bmN0aW9uIChmb3JtKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgaWYgKGZvcm0pIHtcclxuICAgIGlmICghL15hcHBsaWNhdGlvblxcL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFxcYi8udGVzdChzZWxmLmdldEhlYWRlcignY29udGVudC10eXBlJykpKSB7XHJcbiAgICAgIHNlbGYuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcclxuICAgIH1cclxuICAgIHNlbGYuYm9keSA9ICh0eXBlb2YgZm9ybSA9PT0gJ3N0cmluZycpXHJcbiAgICAgID8gc2VsZi5fcXMucmZjMzk4Nihmb3JtLnRvU3RyaW5nKCd1dGY4JykpXHJcbiAgICAgIDogc2VsZi5fcXMuc3RyaW5naWZ5KGZvcm0pLnRvU3RyaW5nKCd1dGY4JylcclxuICAgIHJldHVybiBzZWxmXHJcbiAgfVxyXG4gIC8vIGNyZWF0ZSBmb3JtLWRhdGEgb2JqZWN0XHJcbiAgc2VsZi5fZm9ybSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgc2VsZi5fZm9ybS5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICBlcnIubWVzc2FnZSA9ICdmb3JtLWRhdGE6ICcgKyBlcnIubWVzc2FnZVxyXG4gICAgc2VsZi5lbWl0KCdlcnJvcicsIGVycilcclxuICAgIHNlbGYuYWJvcnQoKVxyXG4gIH0pXHJcbiAgcmV0dXJuIHNlbGYuX2Zvcm1cclxufVxyXG5SZXF1ZXN0LnByb3RvdHlwZS5tdWx0aXBhcnQgPSBmdW5jdGlvbiAobXVsdGlwYXJ0KSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcblxyXG4gIHNlbGYuX211bHRpcGFydC5vblJlcXVlc3QobXVsdGlwYXJ0KVxyXG5cclxuICBpZiAoIXNlbGYuX211bHRpcGFydC5jaHVua2VkKSB7XHJcbiAgICBzZWxmLmJvZHkgPSBzZWxmLl9tdWx0aXBhcnQuYm9keVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHNlbGZcclxufVxyXG5SZXF1ZXN0LnByb3RvdHlwZS5qc29uID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG5cclxuICBpZiAoIXNlbGYuaGFzSGVhZGVyKCdhY2NlcHQnKSkge1xyXG4gICAgc2VsZi5zZXRIZWFkZXIoJ2FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJylcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2Ygc2VsZi5qc29uUmVwbGFjZXIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIHNlbGYuX2pzb25SZXBsYWNlciA9IHNlbGYuanNvblJlcGxhY2VyXHJcbiAgfVxyXG5cclxuICBzZWxmLl9qc29uID0gdHJ1ZVxyXG4gIGlmICh0eXBlb2YgdmFsID09PSAnYm9vbGVhbicpIHtcclxuICAgIGlmIChzZWxmLmJvZHkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAoIS9eYXBwbGljYXRpb25cXC94LXd3dy1mb3JtLXVybGVuY29kZWRcXGIvLnRlc3Qoc2VsZi5nZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScpKSkge1xyXG4gICAgICAgIHNlbGYuYm9keSA9IHNhZmVTdHJpbmdpZnkoc2VsZi5ib2R5LCBzZWxmLl9qc29uUmVwbGFjZXIpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZi5ib2R5ID0gc2VsZi5fcXMucmZjMzk4NihzZWxmLmJvZHkpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFzZWxmLmhhc0hlYWRlcignY29udGVudC10eXBlJykpIHtcclxuICAgICAgICBzZWxmLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHNlbGYuYm9keSA9IHNhZmVTdHJpbmdpZnkodmFsLCBzZWxmLl9qc29uUmVwbGFjZXIpXHJcbiAgICBpZiAoIXNlbGYuaGFzSGVhZGVyKCdjb250ZW50LXR5cGUnKSkge1xyXG4gICAgICBzZWxmLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHR5cGVvZiBzZWxmLmpzb25SZXZpdmVyID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBzZWxmLl9qc29uUmV2aXZlciA9IHNlbGYuanNvblJldml2ZXJcclxuICB9XHJcblxyXG4gIHJldHVybiBzZWxmXHJcbn1cclxuUmVxdWVzdC5wcm90b3R5cGUuZ2V0SGVhZGVyID0gZnVuY3Rpb24gKG5hbWUsIGhlYWRlcnMpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICB2YXIgcmVzdWx0LCByZSwgbWF0Y2hcclxuICBpZiAoIWhlYWRlcnMpIHtcclxuICAgIGhlYWRlcnMgPSBzZWxmLmhlYWRlcnNcclxuICB9XHJcbiAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICBpZiAoa2V5Lmxlbmd0aCAhPT0gbmFtZS5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICByZSA9IG5ldyBSZWdFeHAobmFtZSwgJ2knKVxyXG4gICAgbWF0Y2ggPSBrZXkubWF0Y2gocmUpXHJcbiAgICBpZiAobWF0Y2gpIHtcclxuICAgICAgcmVzdWx0ID0gaGVhZGVyc1trZXldXHJcbiAgICB9XHJcbiAgfSlcclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuUmVxdWVzdC5wcm90b3R5cGUuZW5hYmxlVW5peFNvY2tldCA9IGZ1bmN0aW9uICgpIHtcclxuICAvLyBHZXQgdGhlIHNvY2tldCAmIHJlcXVlc3QgcGF0aHMgZnJvbSB0aGUgVVJMXHJcbiAgdmFyIHVuaXhQYXJ0cyA9IHRoaXMudXJpLnBhdGguc3BsaXQoJzonKVxyXG4gIHZhciBob3N0ID0gdW5peFBhcnRzWzBdXHJcbiAgdmFyIHBhdGggPSB1bml4UGFydHNbMV1cclxuICAvLyBBcHBseSB1bml4IHByb3BlcnRpZXMgdG8gcmVxdWVzdFxyXG4gIHRoaXMuc29ja2V0UGF0aCA9IGhvc3RcclxuICB0aGlzLnVyaS5wYXRobmFtZSA9IHBhdGhcclxuICB0aGlzLnVyaS5wYXRoID0gcGF0aFxyXG4gIHRoaXMudXJpLmhvc3QgPSBob3N0XHJcbiAgdGhpcy51cmkuaG9zdG5hbWUgPSBob3N0XHJcbiAgdGhpcy51cmkuaXNVbml4ID0gdHJ1ZVxyXG59XHJcblxyXG5SZXF1ZXN0LnByb3RvdHlwZS5hdXRoID0gZnVuY3Rpb24gKHVzZXIsIHBhc3MsIHNlbmRJbW1lZGlhdGVseSwgYmVhcmVyKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcblxyXG4gIHNlbGYuX2F1dGgub25SZXF1ZXN0KHVzZXIsIHBhc3MsIHNlbmRJbW1lZGlhdGVseSwgYmVhcmVyKVxyXG5cclxuICByZXR1cm4gc2VsZlxyXG59XHJcblJlcXVlc3QucHJvdG90eXBlLmF3cyA9IGZ1bmN0aW9uIChvcHRzLCBub3cpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuXHJcbiAgaWYgKCFub3cpIHtcclxuICAgIHNlbGYuX2F3cyA9IG9wdHNcclxuICAgIHJldHVybiBzZWxmXHJcbiAgfVxyXG5cclxuICBpZiAob3B0cy5zaWduX3ZlcnNpb24gPT09IDQgfHwgb3B0cy5zaWduX3ZlcnNpb24gPT09ICc0Jykge1xyXG4gICAgLy8gdXNlIGF3czRcclxuICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICBob3N0OiBzZWxmLnVyaS5ob3N0LFxyXG4gICAgICBwYXRoOiBzZWxmLnVyaS5wYXRoLFxyXG4gICAgICBtZXRob2Q6IHNlbGYubWV0aG9kLFxyXG4gICAgICBoZWFkZXJzOiBzZWxmLmhlYWRlcnMsXHJcbiAgICAgIGJvZHk6IHNlbGYuYm9keVxyXG4gICAgfVxyXG4gICAgaWYgKG9wdHMuc2VydmljZSkge1xyXG4gICAgICBvcHRpb25zLnNlcnZpY2UgPSBvcHRzLnNlcnZpY2VcclxuICAgIH1cclxuICAgIHZhciBzaWduUmVzID0gYXdzNC5zaWduKG9wdGlvbnMsIHtcclxuICAgICAgYWNjZXNzS2V5SWQ6IG9wdHMua2V5LFxyXG4gICAgICBzZWNyZXRBY2Nlc3NLZXk6IG9wdHMuc2VjcmV0LFxyXG4gICAgICBzZXNzaW9uVG9rZW46IG9wdHMuc2Vzc2lvblxyXG4gICAgfSlcclxuICAgIHNlbGYuc2V0SGVhZGVyKCdhdXRob3JpemF0aW9uJywgc2lnblJlcy5oZWFkZXJzLkF1dGhvcml6YXRpb24pXHJcbiAgICBzZWxmLnNldEhlYWRlcigneC1hbXotZGF0ZScsIHNpZ25SZXMuaGVhZGVyc1snWC1BbXotRGF0ZSddKVxyXG4gICAgaWYgKHNpZ25SZXMuaGVhZGVyc1snWC1BbXotU2VjdXJpdHktVG9rZW4nXSkge1xyXG4gICAgICBzZWxmLnNldEhlYWRlcigneC1hbXotc2VjdXJpdHktdG9rZW4nLCBzaWduUmVzLmhlYWRlcnNbJ1gtQW16LVNlY3VyaXR5LVRva2VuJ10pXHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIGRlZmF1bHQ6IHVzZSBhd3Mtc2lnbjJcclxuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKVxyXG4gICAgc2VsZi5zZXRIZWFkZXIoJ2RhdGUnLCBkYXRlLnRvVVRDU3RyaW5nKCkpXHJcbiAgICB2YXIgYXV0aCA9IHtcclxuICAgICAga2V5OiBvcHRzLmtleSxcclxuICAgICAgc2VjcmV0OiBvcHRzLnNlY3JldCxcclxuICAgICAgdmVyYjogc2VsZi5tZXRob2QudG9VcHBlckNhc2UoKSxcclxuICAgICAgZGF0ZTogZGF0ZSxcclxuICAgICAgY29udGVudFR5cGU6IHNlbGYuZ2V0SGVhZGVyKCdjb250ZW50LXR5cGUnKSB8fCAnJyxcclxuICAgICAgbWQ1OiBzZWxmLmdldEhlYWRlcignY29udGVudC1tZDUnKSB8fCAnJyxcclxuICAgICAgYW1hem9uSGVhZGVyczogYXdzMi5jYW5vbmljYWxpemVIZWFkZXJzKHNlbGYuaGVhZGVycylcclxuICAgIH1cclxuICAgIHZhciBwYXRoID0gc2VsZi51cmkucGF0aFxyXG4gICAgaWYgKG9wdHMuYnVja2V0ICYmIHBhdGgpIHtcclxuICAgICAgYXV0aC5yZXNvdXJjZSA9ICcvJyArIG9wdHMuYnVja2V0ICsgcGF0aFxyXG4gICAgfSBlbHNlIGlmIChvcHRzLmJ1Y2tldCAmJiAhcGF0aCkge1xyXG4gICAgICBhdXRoLnJlc291cmNlID0gJy8nICsgb3B0cy5idWNrZXRcclxuICAgIH0gZWxzZSBpZiAoIW9wdHMuYnVja2V0ICYmIHBhdGgpIHtcclxuICAgICAgYXV0aC5yZXNvdXJjZSA9IHBhdGhcclxuICAgIH0gZWxzZSBpZiAoIW9wdHMuYnVja2V0ICYmICFwYXRoKSB7XHJcbiAgICAgIGF1dGgucmVzb3VyY2UgPSAnLydcclxuICAgIH1cclxuICAgIGF1dGgucmVzb3VyY2UgPSBhd3MyLmNhbm9uaWNhbGl6ZVJlc291cmNlKGF1dGgucmVzb3VyY2UpXHJcbiAgICBzZWxmLnNldEhlYWRlcignYXV0aG9yaXphdGlvbicsIGF3czIuYXV0aG9yaXphdGlvbihhdXRoKSlcclxuICB9XHJcblxyXG4gIHJldHVybiBzZWxmXHJcbn1cclxuUmVxdWVzdC5wcm90b3R5cGUuaHR0cFNpZ25hdHVyZSA9IGZ1bmN0aW9uIChvcHRzKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgaHR0cFNpZ25hdHVyZS5zaWduUmVxdWVzdCh7XHJcbiAgICBnZXRIZWFkZXI6IGZ1bmN0aW9uIChoZWFkZXIpIHtcclxuICAgICAgcmV0dXJuIHNlbGYuZ2V0SGVhZGVyKGhlYWRlciwgc2VsZi5oZWFkZXJzKVxyXG4gICAgfSxcclxuICAgIHNldEhlYWRlcjogZnVuY3Rpb24gKGhlYWRlciwgdmFsdWUpIHtcclxuICAgICAgc2VsZi5zZXRIZWFkZXIoaGVhZGVyLCB2YWx1ZSlcclxuICAgIH0sXHJcbiAgICBtZXRob2Q6IHNlbGYubWV0aG9kLFxyXG4gICAgcGF0aDogc2VsZi5wYXRoXHJcbiAgfSwgb3B0cylcclxuICBkZWJ1ZygnaHR0cFNpZ25hdHVyZSBhdXRob3JpemF0aW9uJywgc2VsZi5nZXRIZWFkZXIoJ2F1dGhvcml6YXRpb24nKSlcclxuXHJcbiAgcmV0dXJuIHNlbGZcclxufVxyXG5SZXF1ZXN0LnByb3RvdHlwZS5oYXdrID0gZnVuY3Rpb24gKG9wdHMpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICBzZWxmLnNldEhlYWRlcignQXV0aG9yaXphdGlvbicsIGhhd2suaGVhZGVyKHNlbGYudXJpLCBzZWxmLm1ldGhvZCwgb3B0cykpXHJcbn1cclxuUmVxdWVzdC5wcm90b3R5cGUub2F1dGggPSBmdW5jdGlvbiAoX29hdXRoKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcblxyXG4gIHNlbGYuX29hdXRoLm9uUmVxdWVzdChfb2F1dGgpXHJcblxyXG4gIHJldHVybiBzZWxmXHJcbn1cclxuXHJcblJlcXVlc3QucHJvdG90eXBlLmphciA9IGZ1bmN0aW9uIChqYXIpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICB2YXIgY29va2llc1xyXG5cclxuICBpZiAoc2VsZi5fcmVkaXJlY3QucmVkaXJlY3RzRm9sbG93ZWQgPT09IDApIHtcclxuICAgIHNlbGYub3JpZ2luYWxDb29raWVIZWFkZXIgPSBzZWxmLmdldEhlYWRlcignY29va2llJylcclxuICB9XHJcblxyXG4gIGlmICghamFyKSB7XHJcbiAgICAvLyBkaXNhYmxlIGNvb2tpZXNcclxuICAgIGNvb2tpZXMgPSBmYWxzZVxyXG4gICAgc2VsZi5fZGlzYWJsZUNvb2tpZXMgPSB0cnVlXHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciB0YXJnZXRDb29raWVKYXIgPSAoamFyICYmIGphci5nZXRDb29raWVTdHJpbmcpID8gamFyIDogZ2xvYmFsQ29va2llSmFyXHJcbiAgICB2YXIgdXJpaHJlZiA9IHNlbGYudXJpLmhyZWZcclxuICAgIC8vIGZldGNoIGNvb2tpZSBpbiB0aGUgU3BlY2lmaWVkIGhvc3RcclxuICAgIGlmICh0YXJnZXRDb29raWVKYXIpIHtcclxuICAgICAgY29va2llcyA9IHRhcmdldENvb2tpZUphci5nZXRDb29raWVTdHJpbmcodXJpaHJlZilcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGlmIG5lZWQgY29va2llIGFuZCBjb29raWUgaXMgbm90IGVtcHR5XHJcbiAgaWYgKGNvb2tpZXMgJiYgY29va2llcy5sZW5ndGgpIHtcclxuICAgIGlmIChzZWxmLm9yaWdpbmFsQ29va2llSGVhZGVyKSB7XHJcbiAgICAgIC8vIERvbid0IG92ZXJ3cml0ZSBleGlzdGluZyBDb29raWUgaGVhZGVyXHJcbiAgICAgIHNlbGYuc2V0SGVhZGVyKCdjb29raWUnLCBzZWxmLm9yaWdpbmFsQ29va2llSGVhZGVyICsgJzsgJyArIGNvb2tpZXMpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZWxmLnNldEhlYWRlcignY29va2llJywgY29va2llcylcclxuICAgIH1cclxuICB9XHJcbiAgc2VsZi5famFyID0gamFyXHJcbiAgcmV0dXJuIHNlbGZcclxufVxyXG5cclxuLy8gU3RyZWFtIEFQSVxyXG5SZXF1ZXN0LnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24gKGRlc3QsIG9wdHMpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuXHJcbiAgaWYgKHNlbGYucmVzcG9uc2UpIHtcclxuICAgIGlmIChzZWxmLl9kZXN0ZGF0YSkge1xyXG4gICAgICBzZWxmLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdZb3UgY2Fubm90IHBpcGUgYWZ0ZXIgZGF0YSBoYXMgYmVlbiBlbWl0dGVkIGZyb20gdGhlIHJlc3BvbnNlLicpKVxyXG4gICAgfSBlbHNlIGlmIChzZWxmLl9lbmRlZCkge1xyXG4gICAgICBzZWxmLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdZb3UgY2Fubm90IHBpcGUgYWZ0ZXIgdGhlIHJlc3BvbnNlIGhhcyBiZWVuIGVuZGVkLicpKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3RyZWFtLlN0cmVhbS5wcm90b3R5cGUucGlwZS5jYWxsKHNlbGYsIGRlc3QsIG9wdHMpXHJcbiAgICAgIHNlbGYucGlwZURlc3QoZGVzdClcclxuICAgICAgcmV0dXJuIGRlc3RcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgc2VsZi5kZXN0cy5wdXNoKGRlc3QpXHJcbiAgICBzdHJlYW0uU3RyZWFtLnByb3RvdHlwZS5waXBlLmNhbGwoc2VsZiwgZGVzdCwgb3B0cylcclxuICAgIHJldHVybiBkZXN0XHJcbiAgfVxyXG59XHJcblJlcXVlc3QucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIGlmIChzZWxmLl9hYm9ydGVkKSB7IHJldHVybiB9XHJcblxyXG4gIGlmICghc2VsZi5fc3RhcnRlZCkge1xyXG4gICAgc2VsZi5zdGFydCgpXHJcbiAgfVxyXG4gIGlmIChzZWxmLnJlcSkge1xyXG4gICAgcmV0dXJuIHNlbGYucmVxLndyaXRlLmFwcGx5KHNlbGYucmVxLCBhcmd1bWVudHMpXHJcbiAgfVxyXG59XHJcblJlcXVlc3QucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChjaHVuaykge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIGlmIChzZWxmLl9hYm9ydGVkKSB7IHJldHVybiB9XHJcblxyXG4gIGlmIChjaHVuaykge1xyXG4gICAgc2VsZi53cml0ZShjaHVuaylcclxuICB9XHJcbiAgaWYgKCFzZWxmLl9zdGFydGVkKSB7XHJcbiAgICBzZWxmLnN0YXJ0KClcclxuICB9XHJcbiAgaWYgKHNlbGYucmVxKSB7XHJcbiAgICBzZWxmLnJlcS5lbmQoKVxyXG4gIH1cclxufVxyXG5SZXF1ZXN0LnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICBpZiAoIXNlbGYucmVzcG9uc2VDb250ZW50KSB7XHJcbiAgICBzZWxmLl9wYXVzZWQgPSB0cnVlXHJcbiAgfSBlbHNlIHtcclxuICAgIHNlbGYucmVzcG9uc2VDb250ZW50LnBhdXNlLmFwcGx5KHNlbGYucmVzcG9uc2VDb250ZW50LCBhcmd1bWVudHMpXHJcbiAgfVxyXG59XHJcblJlcXVlc3QucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICBpZiAoIXNlbGYucmVzcG9uc2VDb250ZW50KSB7XHJcbiAgICBzZWxmLl9wYXVzZWQgPSBmYWxzZVxyXG4gIH0gZWxzZSB7XHJcbiAgICBzZWxmLnJlc3BvbnNlQ29udGVudC5yZXN1bWUuYXBwbHkoc2VsZi5yZXNwb25zZUNvbnRlbnQsIGFyZ3VtZW50cylcclxuICB9XHJcbn1cclxuUmVxdWVzdC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICBpZiAoIXNlbGYuX2VuZGVkKSB7XHJcbiAgICBzZWxmLmVuZCgpXHJcbiAgfSBlbHNlIGlmIChzZWxmLnJlc3BvbnNlKSB7XHJcbiAgICBzZWxmLnJlc3BvbnNlLmRlc3Ryb3koKVxyXG4gIH1cclxufVxyXG5cclxuUmVxdWVzdC5kZWZhdWx0UHJveHlIZWFkZXJXaGl0ZUxpc3QgPVxyXG4gIFR1bm5lbC5kZWZhdWx0UHJveHlIZWFkZXJXaGl0ZUxpc3Quc2xpY2UoKVxyXG5cclxuUmVxdWVzdC5kZWZhdWx0UHJveHlIZWFkZXJFeGNsdXNpdmVMaXN0ID1cclxuICBUdW5uZWwuZGVmYXVsdFByb3h5SGVhZGVyRXhjbHVzaXZlTGlzdC5zbGljZSgpXHJcblxyXG4vLyBFeHBvcnRzXHJcblxyXG5SZXF1ZXN0LnByb3RvdHlwZS50b0pTT04gPSByZXF1ZXN0VG9KU09OXHJcbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdFxyXG4iLCIndXNlIHN0cmljdCdcclxuXHJcbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxyXG5cclxuZnVuY3Rpb24gcmFuZG9tU3RyaW5nIChzaXplKSB7XHJcbiAgdmFyIGJpdHMgPSAoc2l6ZSArIDEpICogNlxyXG4gIHZhciBidWZmZXIgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoTWF0aC5jZWlsKGJpdHMgLyA4KSlcclxuICB2YXIgc3RyaW5nID0gYnVmZmVyLnRvU3RyaW5nKCdiYXNlNjQnKS5yZXBsYWNlKC9cXCsvZywgJy0nKS5yZXBsYWNlKC9cXC8vZywgJ18nKS5yZXBsYWNlKC89L2csICcnKVxyXG4gIHJldHVybiBzdHJpbmcuc2xpY2UoMCwgc2l6ZSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2FsY3VsYXRlUGF5bG9hZEhhc2ggKHBheWxvYWQsIGFsZ29yaXRobSwgY29udGVudFR5cGUpIHtcclxuICB2YXIgaGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKGFsZ29yaXRobSlcclxuICBoYXNoLnVwZGF0ZSgnaGF3ay4xLnBheWxvYWRcXG4nKVxyXG4gIGhhc2gudXBkYXRlKChjb250ZW50VHlwZSA/IGNvbnRlbnRUeXBlLnNwbGl0KCc7JylbMF0udHJpbSgpLnRvTG93ZXJDYXNlKCkgOiAnJykgKyAnXFxuJylcclxuICBoYXNoLnVwZGF0ZShwYXlsb2FkIHx8ICcnKVxyXG4gIGhhc2gudXBkYXRlKCdcXG4nKVxyXG4gIHJldHVybiBoYXNoLmRpZ2VzdCgnYmFzZTY0JylcclxufVxyXG5cclxuZXhwb3J0cy5jYWxjdWxhdGVNYWMgPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMsIG9wdHMpIHtcclxuICB2YXIgbm9ybWFsaXplZCA9ICdoYXdrLjEuaGVhZGVyXFxuJyArXHJcbiAgICBvcHRzLnRzICsgJ1xcbicgK1xyXG4gICAgb3B0cy5ub25jZSArICdcXG4nICtcclxuICAgIChvcHRzLm1ldGhvZCB8fCAnJykudG9VcHBlckNhc2UoKSArICdcXG4nICtcclxuICAgIG9wdHMucmVzb3VyY2UgKyAnXFxuJyArXHJcbiAgICBvcHRzLmhvc3QudG9Mb3dlckNhc2UoKSArICdcXG4nICtcclxuICAgIG9wdHMucG9ydCArICdcXG4nICtcclxuICAgIChvcHRzLmhhc2ggfHwgJycpICsgJ1xcbidcclxuXHJcbiAgaWYgKG9wdHMuZXh0KSB7XHJcbiAgICBub3JtYWxpemVkID0gbm9ybWFsaXplZCArIG9wdHMuZXh0LnJlcGxhY2UoJ1xcXFwnLCAnXFxcXFxcXFwnKS5yZXBsYWNlKCdcXG4nLCAnXFxcXG4nKVxyXG4gIH1cclxuXHJcbiAgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZWQgKyAnXFxuJ1xyXG5cclxuICBpZiAob3B0cy5hcHApIHtcclxuICAgIG5vcm1hbGl6ZWQgPSBub3JtYWxpemVkICsgb3B0cy5hcHAgKyAnXFxuJyArIChvcHRzLmRsZyB8fCAnJykgKyAnXFxuJ1xyXG4gIH1cclxuXHJcbiAgdmFyIGhtYWMgPSBjcnlwdG8uY3JlYXRlSG1hYyhjcmVkZW50aWFscy5hbGdvcml0aG0sIGNyZWRlbnRpYWxzLmtleSkudXBkYXRlKG5vcm1hbGl6ZWQpXHJcbiAgdmFyIGRpZ2VzdCA9IGhtYWMuZGlnZXN0KCdiYXNlNjQnKVxyXG4gIHJldHVybiBkaWdlc3RcclxufVxyXG5cclxuZXhwb3J0cy5oZWFkZXIgPSBmdW5jdGlvbiAodXJpLCBtZXRob2QsIG9wdHMpIHtcclxuICB2YXIgdGltZXN0YW1wID0gb3B0cy50aW1lc3RhbXAgfHwgTWF0aC5mbG9vcigoRGF0ZS5ub3coKSArIChvcHRzLmxvY2FsdGltZU9mZnNldE1zZWMgfHwgMCkpIC8gMTAwMClcclxuICB2YXIgY3JlZGVudGlhbHMgPSBvcHRzLmNyZWRlbnRpYWxzXHJcbiAgaWYgKCFjcmVkZW50aWFscyB8fCAhY3JlZGVudGlhbHMuaWQgfHwgIWNyZWRlbnRpYWxzLmtleSB8fCAhY3JlZGVudGlhbHMuYWxnb3JpdGhtKSB7XHJcbiAgICByZXR1cm4gJydcclxuICB9XHJcblxyXG4gIGlmIChbJ3NoYTEnLCAnc2hhMjU2J10uaW5kZXhPZihjcmVkZW50aWFscy5hbGdvcml0aG0pID09PSAtMSkge1xyXG4gICAgcmV0dXJuICcnXHJcbiAgfVxyXG5cclxuICB2YXIgYXJ0aWZhY3RzID0ge1xyXG4gICAgdHM6IHRpbWVzdGFtcCxcclxuICAgIG5vbmNlOiBvcHRzLm5vbmNlIHx8IHJhbmRvbVN0cmluZyg2KSxcclxuICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgcmVzb3VyY2U6IHVyaS5wYXRobmFtZSArICh1cmkuc2VhcmNoIHx8ICcnKSxcclxuICAgIGhvc3Q6IHVyaS5ob3N0bmFtZSxcclxuICAgIHBvcnQ6IHVyaS5wb3J0IHx8ICh1cmkucHJvdG9jb2wgPT09ICdodHRwOicgPyA4MCA6IDQ0MyksXHJcbiAgICBoYXNoOiBvcHRzLmhhc2gsXHJcbiAgICBleHQ6IG9wdHMuZXh0LFxyXG4gICAgYXBwOiBvcHRzLmFwcCxcclxuICAgIGRsZzogb3B0cy5kbGdcclxuICB9XHJcblxyXG4gIGlmICghYXJ0aWZhY3RzLmhhc2ggJiYgKG9wdHMucGF5bG9hZCB8fCBvcHRzLnBheWxvYWQgPT09ICcnKSkge1xyXG4gICAgYXJ0aWZhY3RzLmhhc2ggPSBjYWxjdWxhdGVQYXlsb2FkSGFzaChvcHRzLnBheWxvYWQsIGNyZWRlbnRpYWxzLmFsZ29yaXRobSwgb3B0cy5jb250ZW50VHlwZSlcclxuICB9XHJcblxyXG4gIHZhciBtYWMgPSBleHBvcnRzLmNhbGN1bGF0ZU1hYyhjcmVkZW50aWFscywgYXJ0aWZhY3RzKVxyXG5cclxuICB2YXIgaGFzRXh0ID0gYXJ0aWZhY3RzLmV4dCAhPT0gbnVsbCAmJiBhcnRpZmFjdHMuZXh0ICE9PSB1bmRlZmluZWQgJiYgYXJ0aWZhY3RzLmV4dCAhPT0gJydcclxuICB2YXIgaGVhZGVyID0gJ0hhd2sgaWQ9XCInICsgY3JlZGVudGlhbHMuaWQgK1xyXG4gICAgJ1wiLCB0cz1cIicgKyBhcnRpZmFjdHMudHMgK1xyXG4gICAgJ1wiLCBub25jZT1cIicgKyBhcnRpZmFjdHMubm9uY2UgK1xyXG4gICAgKGFydGlmYWN0cy5oYXNoID8gJ1wiLCBoYXNoPVwiJyArIGFydGlmYWN0cy5oYXNoIDogJycpICtcclxuICAgIChoYXNFeHQgPyAnXCIsIGV4dD1cIicgKyBhcnRpZmFjdHMuZXh0LnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpIDogJycpICtcclxuICAgICdcIiwgbWFjPVwiJyArIG1hYyArICdcIidcclxuXHJcbiAgaWYgKGFydGlmYWN0cy5hcHApIHtcclxuICAgIGhlYWRlciA9IGhlYWRlciArICcsIGFwcD1cIicgKyBhcnRpZmFjdHMuYXBwICsgKGFydGlmYWN0cy5kbGcgPyAnXCIsIGRsZz1cIicgKyBhcnRpZmFjdHMuZGxnIDogJycpICsgJ1wiJ1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGhlYWRlclxyXG59XHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIGNhc2VsZXNzID0gcmVxdWlyZSgnY2FzZWxlc3MnKVxyXG52YXIgdXVpZCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxyXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpXHJcblxyXG52YXIgbWQ1ID0gaGVscGVycy5tZDVcclxudmFyIHRvQmFzZTY0ID0gaGVscGVycy50b0Jhc2U2NFxyXG5cclxuZnVuY3Rpb24gQXV0aCAocmVxdWVzdCkge1xyXG4gIC8vIGRlZmluZSBhbGwgcHVibGljIHByb3BlcnRpZXMgaGVyZVxyXG4gIHRoaXMucmVxdWVzdCA9IHJlcXVlc3RcclxuICB0aGlzLmhhc0F1dGggPSBmYWxzZVxyXG4gIHRoaXMuc2VudEF1dGggPSBmYWxzZVxyXG4gIHRoaXMuYmVhcmVyVG9rZW4gPSBudWxsXHJcbiAgdGhpcy51c2VyID0gbnVsbFxyXG4gIHRoaXMucGFzcyA9IG51bGxcclxufVxyXG5cclxuQXV0aC5wcm90b3R5cGUuYmFzaWMgPSBmdW5jdGlvbiAodXNlciwgcGFzcywgc2VuZEltbWVkaWF0ZWx5KSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgaWYgKHR5cGVvZiB1c2VyICE9PSAnc3RyaW5nJyB8fCAocGFzcyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBwYXNzICE9PSAnc3RyaW5nJykpIHtcclxuICAgIHNlbGYucmVxdWVzdC5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignYXV0aCgpIHJlY2VpdmVkIGludmFsaWQgdXNlciBvciBwYXNzd29yZCcpKVxyXG4gIH1cclxuICBzZWxmLnVzZXIgPSB1c2VyXHJcbiAgc2VsZi5wYXNzID0gcGFzc1xyXG4gIHNlbGYuaGFzQXV0aCA9IHRydWVcclxuICB2YXIgaGVhZGVyID0gdXNlciArICc6JyArIChwYXNzIHx8ICcnKVxyXG4gIGlmIChzZW5kSW1tZWRpYXRlbHkgfHwgdHlwZW9mIHNlbmRJbW1lZGlhdGVseSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHZhciBhdXRoSGVhZGVyID0gJ0Jhc2ljICcgKyB0b0Jhc2U2NChoZWFkZXIpXHJcbiAgICBzZWxmLnNlbnRBdXRoID0gdHJ1ZVxyXG4gICAgcmV0dXJuIGF1dGhIZWFkZXJcclxuICB9XHJcbn1cclxuXHJcbkF1dGgucHJvdG90eXBlLmJlYXJlciA9IGZ1bmN0aW9uIChiZWFyZXIsIHNlbmRJbW1lZGlhdGVseSkge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIHNlbGYuYmVhcmVyVG9rZW4gPSBiZWFyZXJcclxuICBzZWxmLmhhc0F1dGggPSB0cnVlXHJcbiAgaWYgKHNlbmRJbW1lZGlhdGVseSB8fCB0eXBlb2Ygc2VuZEltbWVkaWF0ZWx5ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgaWYgKHR5cGVvZiBiZWFyZXIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgYmVhcmVyID0gYmVhcmVyKClcclxuICAgIH1cclxuICAgIHZhciBhdXRoSGVhZGVyID0gJ0JlYXJlciAnICsgKGJlYXJlciB8fCAnJylcclxuICAgIHNlbGYuc2VudEF1dGggPSB0cnVlXHJcbiAgICByZXR1cm4gYXV0aEhlYWRlclxyXG4gIH1cclxufVxyXG5cclxuQXV0aC5wcm90b3R5cGUuZGlnZXN0ID0gZnVuY3Rpb24gKG1ldGhvZCwgcGF0aCwgYXV0aEhlYWRlcikge1xyXG4gIC8vIFRPRE86IE1vcmUgY29tcGxldGUgaW1wbGVtZW50YXRpb24gb2YgUkZDIDI2MTcuXHJcbiAgLy8gICAtIGhhbmRsZSBjaGFsbGVuZ2UuZG9tYWluXHJcbiAgLy8gICAtIHN1cHBvcnQgcW9wPVwiYXV0aC1pbnRcIiBvbmx5XHJcbiAgLy8gICAtIGhhbmRsZSBBdXRoZW50aWNhdGlvbi1JbmZvIChub3QgbmVjZXNzYXJpbHk/KVxyXG4gIC8vICAgLSBjaGVjayBjaGFsbGVuZ2Uuc3RhbGUgKG5vdCBuZWNlc3NhcmlseT8pXHJcbiAgLy8gICAtIGluY3JlYXNlIG5jIChub3QgbmVjZXNzYXJpbHk/KVxyXG4gIC8vIEZvciByZWZlcmVuY2U6XHJcbiAgLy8gaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMjYxNyNzZWN0aW9uLTNcclxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vYmFnZGVyL2N1cmwvYmxvYi9tYXN0ZXIvbGliL2h0dHBfZGlnZXN0LmNcclxuXHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcblxyXG4gIHZhciBjaGFsbGVuZ2UgPSB7fVxyXG4gIHZhciByZSA9IC8oW2EtejAtOV8tXSspPSg/OlwiKFteXCJdKylcInwoW2EtejAtOV8tXSspKS9naVxyXG4gIGZvciAoOzspIHtcclxuICAgIHZhciBtYXRjaCA9IHJlLmV4ZWMoYXV0aEhlYWRlcilcclxuICAgIGlmICghbWF0Y2gpIHtcclxuICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIGNoYWxsZW5nZVttYXRjaFsxXV0gPSBtYXRjaFsyXSB8fCBtYXRjaFszXVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUkZDIDI2MTc6IGhhbmRsZSBib3RoIE1ENSBhbmQgTUQ1LXNlc3MgYWxnb3JpdGhtcy5cclxuICAgKlxyXG4gICAqIElmIHRoZSBhbGdvcml0aG0gZGlyZWN0aXZlJ3MgdmFsdWUgaXMgXCJNRDVcIiBvciB1bnNwZWNpZmllZCwgdGhlbiBIQTEgaXNcclxuICAgKiAgIEhBMT1NRDUodXNlcm5hbWU6cmVhbG06cGFzc3dvcmQpXHJcbiAgICogSWYgdGhlIGFsZ29yaXRobSBkaXJlY3RpdmUncyB2YWx1ZSBpcyBcIk1ENS1zZXNzXCIsIHRoZW4gSEExIGlzXHJcbiAgICogICBIQTE9TUQ1KE1ENSh1c2VybmFtZTpyZWFsbTpwYXNzd29yZCk6bm9uY2U6Y25vbmNlKVxyXG4gICAqL1xyXG4gIHZhciBoYTFDb21wdXRlID0gZnVuY3Rpb24gKGFsZ29yaXRobSwgdXNlciwgcmVhbG0sIHBhc3MsIG5vbmNlLCBjbm9uY2UpIHtcclxuICAgIHZhciBoYTEgPSBtZDUodXNlciArICc6JyArIHJlYWxtICsgJzonICsgcGFzcylcclxuICAgIGlmIChhbGdvcml0aG0gJiYgYWxnb3JpdGhtLnRvTG93ZXJDYXNlKCkgPT09ICdtZDUtc2VzcycpIHtcclxuICAgICAgcmV0dXJuIG1kNShoYTEgKyAnOicgKyBub25jZSArICc6JyArIGNub25jZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBoYTFcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBxb3AgPSAvKF58LClcXHMqYXV0aFxccyooJHwsKS8udGVzdChjaGFsbGVuZ2UucW9wKSAmJiAnYXV0aCdcclxuICB2YXIgbmMgPSBxb3AgJiYgJzAwMDAwMDAxJ1xyXG4gIHZhciBjbm9uY2UgPSBxb3AgJiYgdXVpZCgpLnJlcGxhY2UoLy0vZywgJycpXHJcbiAgdmFyIGhhMSA9IGhhMUNvbXB1dGUoY2hhbGxlbmdlLmFsZ29yaXRobSwgc2VsZi51c2VyLCBjaGFsbGVuZ2UucmVhbG0sIHNlbGYucGFzcywgY2hhbGxlbmdlLm5vbmNlLCBjbm9uY2UpXHJcbiAgdmFyIGhhMiA9IG1kNShtZXRob2QgKyAnOicgKyBwYXRoKVxyXG4gIHZhciBkaWdlc3RSZXNwb25zZSA9IHFvcFxyXG4gICAgPyBtZDUoaGExICsgJzonICsgY2hhbGxlbmdlLm5vbmNlICsgJzonICsgbmMgKyAnOicgKyBjbm9uY2UgKyAnOicgKyBxb3AgKyAnOicgKyBoYTIpXHJcbiAgICA6IG1kNShoYTEgKyAnOicgKyBjaGFsbGVuZ2Uubm9uY2UgKyAnOicgKyBoYTIpXHJcbiAgdmFyIGF1dGhWYWx1ZXMgPSB7XHJcbiAgICB1c2VybmFtZTogc2VsZi51c2VyLFxyXG4gICAgcmVhbG06IGNoYWxsZW5nZS5yZWFsbSxcclxuICAgIG5vbmNlOiBjaGFsbGVuZ2Uubm9uY2UsXHJcbiAgICB1cmk6IHBhdGgsXHJcbiAgICBxb3A6IHFvcCxcclxuICAgIHJlc3BvbnNlOiBkaWdlc3RSZXNwb25zZSxcclxuICAgIG5jOiBuYyxcclxuICAgIGNub25jZTogY25vbmNlLFxyXG4gICAgYWxnb3JpdGhtOiBjaGFsbGVuZ2UuYWxnb3JpdGhtLFxyXG4gICAgb3BhcXVlOiBjaGFsbGVuZ2Uub3BhcXVlXHJcbiAgfVxyXG5cclxuICBhdXRoSGVhZGVyID0gW11cclxuICBmb3IgKHZhciBrIGluIGF1dGhWYWx1ZXMpIHtcclxuICAgIGlmIChhdXRoVmFsdWVzW2tdKSB7XHJcbiAgICAgIGlmIChrID09PSAncW9wJyB8fCBrID09PSAnbmMnIHx8IGsgPT09ICdhbGdvcml0aG0nKSB7XHJcbiAgICAgICAgYXV0aEhlYWRlci5wdXNoKGsgKyAnPScgKyBhdXRoVmFsdWVzW2tdKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGF1dGhIZWFkZXIucHVzaChrICsgJz1cIicgKyBhdXRoVmFsdWVzW2tdICsgJ1wiJylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBhdXRoSGVhZGVyID0gJ0RpZ2VzdCAnICsgYXV0aEhlYWRlci5qb2luKCcsICcpXHJcbiAgc2VsZi5zZW50QXV0aCA9IHRydWVcclxuICByZXR1cm4gYXV0aEhlYWRlclxyXG59XHJcblxyXG5BdXRoLnByb3RvdHlwZS5vblJlcXVlc3QgPSBmdW5jdGlvbiAodXNlciwgcGFzcywgc2VuZEltbWVkaWF0ZWx5LCBiZWFyZXIpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICB2YXIgcmVxdWVzdCA9IHNlbGYucmVxdWVzdFxyXG5cclxuICB2YXIgYXV0aEhlYWRlclxyXG4gIGlmIChiZWFyZXIgPT09IHVuZGVmaW5lZCAmJiB1c2VyID09PSB1bmRlZmluZWQpIHtcclxuICAgIHNlbGYucmVxdWVzdC5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignbm8gYXV0aCBtZWNoYW5pc20gZGVmaW5lZCcpKVxyXG4gIH0gZWxzZSBpZiAoYmVhcmVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgIGF1dGhIZWFkZXIgPSBzZWxmLmJlYXJlcihiZWFyZXIsIHNlbmRJbW1lZGlhdGVseSlcclxuICB9IGVsc2Uge1xyXG4gICAgYXV0aEhlYWRlciA9IHNlbGYuYmFzaWModXNlciwgcGFzcywgc2VuZEltbWVkaWF0ZWx5KVxyXG4gIH1cclxuICBpZiAoYXV0aEhlYWRlcikge1xyXG4gICAgcmVxdWVzdC5zZXRIZWFkZXIoJ2F1dGhvcml6YXRpb24nLCBhdXRoSGVhZGVyKVxyXG4gIH1cclxufVxyXG5cclxuQXV0aC5wcm90b3R5cGUub25SZXNwb25zZSA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIHZhciByZXF1ZXN0ID0gc2VsZi5yZXF1ZXN0XHJcblxyXG4gIGlmICghc2VsZi5oYXNBdXRoIHx8IHNlbGYuc2VudEF1dGgpIHsgcmV0dXJuIG51bGwgfVxyXG5cclxuICB2YXIgYyA9IGNhc2VsZXNzKHJlc3BvbnNlLmhlYWRlcnMpXHJcblxyXG4gIHZhciBhdXRoSGVhZGVyID0gYy5nZXQoJ3d3dy1hdXRoZW50aWNhdGUnKVxyXG4gIHZhciBhdXRoVmVyYiA9IGF1dGhIZWFkZXIgJiYgYXV0aEhlYWRlci5zcGxpdCgnICcpWzBdLnRvTG93ZXJDYXNlKClcclxuICByZXF1ZXN0LmRlYnVnKCdyZWF1dGgnLCBhdXRoVmVyYilcclxuXHJcbiAgc3dpdGNoIChhdXRoVmVyYikge1xyXG4gICAgY2FzZSAnYmFzaWMnOlxyXG4gICAgICByZXR1cm4gc2VsZi5iYXNpYyhzZWxmLnVzZXIsIHNlbGYucGFzcywgdHJ1ZSlcclxuXHJcbiAgICBjYXNlICdiZWFyZXInOlxyXG4gICAgICByZXR1cm4gc2VsZi5iZWFyZXIoc2VsZi5iZWFyZXJUb2tlbiwgdHJ1ZSlcclxuXHJcbiAgICBjYXNlICdkaWdlc3QnOlxyXG4gICAgICByZXR1cm4gc2VsZi5kaWdlc3QocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QucGF0aCwgYXV0aEhlYWRlcilcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydHMuQXV0aCA9IEF1dGhcclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgdXJsID0gcmVxdWlyZSgndXJsJylcclxudmFyIGlzVXJsID0gL15odHRwcz86L1xyXG5cclxuZnVuY3Rpb24gUmVkaXJlY3QgKHJlcXVlc3QpIHtcclxuICB0aGlzLnJlcXVlc3QgPSByZXF1ZXN0XHJcbiAgdGhpcy5mb2xsb3dSZWRpcmVjdCA9IHRydWVcclxuICB0aGlzLmZvbGxvd1JlZGlyZWN0cyA9IHRydWVcclxuICB0aGlzLmZvbGxvd0FsbFJlZGlyZWN0cyA9IGZhbHNlXHJcbiAgdGhpcy5mb2xsb3dPcmlnaW5hbEh0dHBNZXRob2QgPSBmYWxzZVxyXG4gIHRoaXMuYWxsb3dSZWRpcmVjdCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWUgfVxyXG4gIHRoaXMubWF4UmVkaXJlY3RzID0gMTBcclxuICB0aGlzLnJlZGlyZWN0cyA9IFtdXHJcbiAgdGhpcy5yZWRpcmVjdHNGb2xsb3dlZCA9IDBcclxuICB0aGlzLnJlbW92ZVJlZmVyZXJIZWFkZXIgPSBmYWxzZVxyXG59XHJcblxyXG5SZWRpcmVjdC5wcm90b3R5cGUub25SZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuXHJcbiAgaWYgKG9wdGlvbnMubWF4UmVkaXJlY3RzICE9PSB1bmRlZmluZWQpIHtcclxuICAgIHNlbGYubWF4UmVkaXJlY3RzID0gb3B0aW9ucy5tYXhSZWRpcmVjdHNcclxuICB9XHJcbiAgaWYgKHR5cGVvZiBvcHRpb25zLmZvbGxvd1JlZGlyZWN0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBzZWxmLmFsbG93UmVkaXJlY3QgPSBvcHRpb25zLmZvbGxvd1JlZGlyZWN0XHJcbiAgfVxyXG4gIGlmIChvcHRpb25zLmZvbGxvd1JlZGlyZWN0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgIHNlbGYuZm9sbG93UmVkaXJlY3RzID0gISFvcHRpb25zLmZvbGxvd1JlZGlyZWN0XHJcbiAgfVxyXG4gIGlmIChvcHRpb25zLmZvbGxvd0FsbFJlZGlyZWN0cyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBzZWxmLmZvbGxvd0FsbFJlZGlyZWN0cyA9IG9wdGlvbnMuZm9sbG93QWxsUmVkaXJlY3RzXHJcbiAgfVxyXG4gIGlmIChzZWxmLmZvbGxvd1JlZGlyZWN0cyB8fCBzZWxmLmZvbGxvd0FsbFJlZGlyZWN0cykge1xyXG4gICAgc2VsZi5yZWRpcmVjdHMgPSBzZWxmLnJlZGlyZWN0cyB8fCBbXVxyXG4gIH1cclxuICBpZiAob3B0aW9ucy5yZW1vdmVSZWZlcmVySGVhZGVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgIHNlbGYucmVtb3ZlUmVmZXJlckhlYWRlciA9IG9wdGlvbnMucmVtb3ZlUmVmZXJlckhlYWRlclxyXG4gIH1cclxuICBpZiAob3B0aW9ucy5mb2xsb3dPcmlnaW5hbEh0dHBNZXRob2QgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgc2VsZi5mb2xsb3dPcmlnaW5hbEh0dHBNZXRob2QgPSBvcHRpb25zLmZvbGxvd09yaWdpbmFsSHR0cE1ldGhvZFxyXG4gIH1cclxufVxyXG5cclxuUmVkaXJlY3QucHJvdG90eXBlLnJlZGlyZWN0VG8gPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICB2YXIgcmVxdWVzdCA9IHNlbGYucmVxdWVzdFxyXG5cclxuICB2YXIgcmVkaXJlY3RUbyA9IG51bGxcclxuICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA+PSAzMDAgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDQwMCAmJiByZXNwb25zZS5jYXNlbGVzcy5oYXMoJ2xvY2F0aW9uJykpIHtcclxuICAgIHZhciBsb2NhdGlvbiA9IHJlc3BvbnNlLmNhc2VsZXNzLmdldCgnbG9jYXRpb24nKVxyXG4gICAgcmVxdWVzdC5kZWJ1ZygncmVkaXJlY3QnLCBsb2NhdGlvbilcclxuXHJcbiAgICBpZiAoc2VsZi5mb2xsb3dBbGxSZWRpcmVjdHMpIHtcclxuICAgICAgcmVkaXJlY3RUbyA9IGxvY2F0aW9uXHJcbiAgICB9IGVsc2UgaWYgKHNlbGYuZm9sbG93UmVkaXJlY3RzKSB7XHJcbiAgICAgIHN3aXRjaCAocmVxdWVzdC5tZXRob2QpIHtcclxuICAgICAgICBjYXNlICdQQVRDSCc6XHJcbiAgICAgICAgY2FzZSAnUFVUJzpcclxuICAgICAgICBjYXNlICdQT1NUJzpcclxuICAgICAgICBjYXNlICdERUxFVEUnOlxyXG4gICAgICAgICAgLy8gRG8gbm90IGZvbGxvdyByZWRpcmVjdHNcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHJlZGlyZWN0VG8gPSBsb2NhdGlvblxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gNDAxKSB7XHJcbiAgICB2YXIgYXV0aEhlYWRlciA9IHJlcXVlc3QuX2F1dGgub25SZXNwb25zZShyZXNwb25zZSlcclxuICAgIGlmIChhdXRoSGVhZGVyKSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0SGVhZGVyKCdhdXRob3JpemF0aW9uJywgYXV0aEhlYWRlcilcclxuICAgICAgcmVkaXJlY3RUbyA9IHJlcXVlc3QudXJpXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiByZWRpcmVjdFRvXHJcbn1cclxuXHJcblJlZGlyZWN0LnByb3RvdHlwZS5vblJlc3BvbnNlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgdmFyIHJlcXVlc3QgPSBzZWxmLnJlcXVlc3RcclxuXHJcbiAgdmFyIHJlZGlyZWN0VG8gPSBzZWxmLnJlZGlyZWN0VG8ocmVzcG9uc2UpXHJcbiAgaWYgKCFyZWRpcmVjdFRvIHx8ICFzZWxmLmFsbG93UmVkaXJlY3QuY2FsbChyZXF1ZXN0LCByZXNwb25zZSkpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgcmVxdWVzdC5kZWJ1ZygncmVkaXJlY3QgdG8nLCByZWRpcmVjdFRvKVxyXG5cclxuICAvLyBpZ25vcmUgYW55IHBvdGVudGlhbCByZXNwb25zZSBib2R5LiAgaXQgY2Fubm90IHBvc3NpYmx5IGJlIHVzZWZ1bFxyXG4gIC8vIHRvIHVzIGF0IHRoaXMgcG9pbnQuXHJcbiAgLy8gcmVzcG9uc2UucmVzdW1lIHNob3VsZCBiZSBkZWZpbmVkLCBidXQgY2hlY2sgYW55d2F5IGJlZm9yZSBjYWxsaW5nLiBXb3JrYXJvdW5kIGZvciBicm93c2VyaWZ5LlxyXG4gIGlmIChyZXNwb25zZS5yZXN1bWUpIHtcclxuICAgIHJlc3BvbnNlLnJlc3VtZSgpXHJcbiAgfVxyXG5cclxuICBpZiAoc2VsZi5yZWRpcmVjdHNGb2xsb3dlZCA+PSBzZWxmLm1heFJlZGlyZWN0cykge1xyXG4gICAgcmVxdWVzdC5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignRXhjZWVkZWQgbWF4UmVkaXJlY3RzLiBQcm9iYWJseSBzdHVjayBpbiBhIHJlZGlyZWN0IGxvb3AgJyArIHJlcXVlc3QudXJpLmhyZWYpKVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG4gIHNlbGYucmVkaXJlY3RzRm9sbG93ZWQgKz0gMVxyXG5cclxuICBpZiAoIWlzVXJsLnRlc3QocmVkaXJlY3RUbykpIHtcclxuICAgIHJlZGlyZWN0VG8gPSB1cmwucmVzb2x2ZShyZXF1ZXN0LnVyaS5ocmVmLCByZWRpcmVjdFRvKVxyXG4gIH1cclxuXHJcbiAgdmFyIHVyaVByZXYgPSByZXF1ZXN0LnVyaVxyXG4gIHJlcXVlc3QudXJpID0gdXJsLnBhcnNlKHJlZGlyZWN0VG8pXHJcblxyXG4gIC8vIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB3ZSBjaGFuZ2UgcHJvdG9jb2wgZnJvbSBodHRwcyB0byBodHRwIG9yIHZpY2UgdmVyc2FcclxuICBpZiAocmVxdWVzdC51cmkucHJvdG9jb2wgIT09IHVyaVByZXYucHJvdG9jb2wpIHtcclxuICAgIGRlbGV0ZSByZXF1ZXN0LmFnZW50XHJcbiAgfVxyXG5cclxuICBzZWxmLnJlZGlyZWN0cy5wdXNoKHsgc3RhdHVzQ29kZTogcmVzcG9uc2Uuc3RhdHVzQ29kZSwgcmVkaXJlY3RVcmk6IHJlZGlyZWN0VG8gfSlcclxuXHJcbiAgaWYgKHNlbGYuZm9sbG93QWxsUmVkaXJlY3RzICYmIHJlcXVlc3QubWV0aG9kICE9PSAnSEVBRCcgJiZcclxuICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDQwMSAmJiByZXNwb25zZS5zdGF0dXNDb2RlICE9PSAzMDcpIHtcclxuICAgIHJlcXVlc3QubWV0aG9kID0gc2VsZi5mb2xsb3dPcmlnaW5hbEh0dHBNZXRob2QgPyByZXF1ZXN0Lm1ldGhvZCA6ICdHRVQnXHJcbiAgfVxyXG4gIC8vIHJlcXVlc3QubWV0aG9kID0gJ0dFVCcgLy8gRm9yY2UgYWxsIHJlZGlyZWN0cyB0byB1c2UgR0VUIHx8IGNvbW1lbnRlZCBvdXQgZml4ZXMgIzIxNVxyXG4gIGRlbGV0ZSByZXF1ZXN0LnNyY1xyXG4gIGRlbGV0ZSByZXF1ZXN0LnJlcVxyXG4gIGRlbGV0ZSByZXF1ZXN0Ll9zdGFydGVkXHJcbiAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDQwMSAmJiByZXNwb25zZS5zdGF0dXNDb2RlICE9PSAzMDcpIHtcclxuICAgIC8vIFJlbW92ZSBwYXJhbWV0ZXJzIGZyb20gdGhlIHByZXZpb3VzIHJlc3BvbnNlLCB1bmxlc3MgdGhpcyBpcyB0aGUgc2Vjb25kIHJlcXVlc3RcclxuICAgIC8vIGZvciBhIHNlcnZlciB0aGF0IHJlcXVpcmVzIGRpZ2VzdCBhdXRoZW50aWNhdGlvbi5cclxuICAgIGRlbGV0ZSByZXF1ZXN0LmJvZHlcclxuICAgIGRlbGV0ZSByZXF1ZXN0Ll9mb3JtXHJcbiAgICBpZiAocmVxdWVzdC5oZWFkZXJzKSB7XHJcbiAgICAgIHJlcXVlc3QucmVtb3ZlSGVhZGVyKCdob3N0JylcclxuICAgICAgcmVxdWVzdC5yZW1vdmVIZWFkZXIoJ2NvbnRlbnQtdHlwZScpXHJcbiAgICAgIHJlcXVlc3QucmVtb3ZlSGVhZGVyKCdjb250ZW50LWxlbmd0aCcpXHJcbiAgICAgIGlmIChyZXF1ZXN0LnVyaS5ob3N0bmFtZSAhPT0gcmVxdWVzdC5vcmlnaW5hbEhvc3Quc3BsaXQoJzonKVswXSkge1xyXG4gICAgICAgIC8vIFJlbW92ZSBhdXRob3JpemF0aW9uIGlmIGNoYW5naW5nIGhvc3RuYW1lcyAoYnV0IG5vdCBpZiBqdXN0XHJcbiAgICAgICAgLy8gY2hhbmdpbmcgcG9ydHMgb3IgcHJvdG9jb2xzKS4gIFRoaXMgbWF0Y2hlcyB0aGUgYmVoYXZpb3Igb2YgY3VybDpcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYmFnZGVyL2N1cmwvYmxvYi82YmViMGVlZS9saWIvaHR0cC5jI0w3MTBcclxuICAgICAgICByZXF1ZXN0LnJlbW92ZUhlYWRlcignYXV0aG9yaXphdGlvbicpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICghc2VsZi5yZW1vdmVSZWZlcmVySGVhZGVyKSB7XHJcbiAgICByZXF1ZXN0LnNldEhlYWRlcigncmVmZXJlcicsIHVyaVByZXYuaHJlZilcclxuICB9XHJcblxyXG4gIHJlcXVlc3QuZW1pdCgncmVkaXJlY3QnKVxyXG5cclxuICByZXF1ZXN0LmluaXQoKVxyXG5cclxuICByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG5leHBvcnRzLlJlZGlyZWN0ID0gUmVkaXJlY3RcclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgdXJsID0gcmVxdWlyZSgndXJsJylcclxudmFyIHR1bm5lbCA9IHJlcXVpcmUoJ3R1bm5lbC1hZ2VudCcpXHJcblxyXG52YXIgZGVmYXVsdFByb3h5SGVhZGVyV2hpdGVMaXN0ID0gW1xyXG4gICdhY2NlcHQnLFxyXG4gICdhY2NlcHQtY2hhcnNldCcsXHJcbiAgJ2FjY2VwdC1lbmNvZGluZycsXHJcbiAgJ2FjY2VwdC1sYW5ndWFnZScsXHJcbiAgJ2FjY2VwdC1yYW5nZXMnLFxyXG4gICdjYWNoZS1jb250cm9sJyxcclxuICAnY29udGVudC1lbmNvZGluZycsXHJcbiAgJ2NvbnRlbnQtbGFuZ3VhZ2UnLFxyXG4gICdjb250ZW50LWxvY2F0aW9uJyxcclxuICAnY29udGVudC1tZDUnLFxyXG4gICdjb250ZW50LXJhbmdlJyxcclxuICAnY29udGVudC10eXBlJyxcclxuICAnY29ubmVjdGlvbicsXHJcbiAgJ2RhdGUnLFxyXG4gICdleHBlY3QnLFxyXG4gICdtYXgtZm9yd2FyZHMnLFxyXG4gICdwcmFnbWEnLFxyXG4gICdyZWZlcmVyJyxcclxuICAndGUnLFxyXG4gICd1c2VyLWFnZW50JyxcclxuICAndmlhJ1xyXG5dXHJcblxyXG52YXIgZGVmYXVsdFByb3h5SGVhZGVyRXhjbHVzaXZlTGlzdCA9IFtcclxuICAncHJveHktYXV0aG9yaXphdGlvbidcclxuXVxyXG5cclxuZnVuY3Rpb24gY29uc3RydWN0UHJveHlIb3N0ICh1cmlPYmplY3QpIHtcclxuICB2YXIgcG9ydCA9IHVyaU9iamVjdC5wb3J0XHJcbiAgdmFyIHByb3RvY29sID0gdXJpT2JqZWN0LnByb3RvY29sXHJcbiAgdmFyIHByb3h5SG9zdCA9IHVyaU9iamVjdC5ob3N0bmFtZSArICc6J1xyXG5cclxuICBpZiAocG9ydCkge1xyXG4gICAgcHJveHlIb3N0ICs9IHBvcnRcclxuICB9IGVsc2UgaWYgKHByb3RvY29sID09PSAnaHR0cHM6Jykge1xyXG4gICAgcHJveHlIb3N0ICs9ICc0NDMnXHJcbiAgfSBlbHNlIHtcclxuICAgIHByb3h5SG9zdCArPSAnODAnXHJcbiAgfVxyXG5cclxuICByZXR1cm4gcHJveHlIb3N0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnN0cnVjdFByb3h5SGVhZGVyV2hpdGVMaXN0IChoZWFkZXJzLCBwcm94eUhlYWRlcldoaXRlTGlzdCkge1xyXG4gIHZhciB3aGl0ZUxpc3QgPSBwcm94eUhlYWRlcldoaXRlTGlzdFxyXG4gICAgLnJlZHVjZShmdW5jdGlvbiAoc2V0LCBoZWFkZXIpIHtcclxuICAgICAgc2V0W2hlYWRlci50b0xvd2VyQ2FzZSgpXSA9IHRydWVcclxuICAgICAgcmV0dXJuIHNldFxyXG4gICAgfSwge30pXHJcblxyXG4gIHJldHVybiBPYmplY3Qua2V5cyhoZWFkZXJzKVxyXG4gICAgLmZpbHRlcihmdW5jdGlvbiAoaGVhZGVyKSB7XHJcbiAgICAgIHJldHVybiB3aGl0ZUxpc3RbaGVhZGVyLnRvTG93ZXJDYXNlKCldXHJcbiAgICB9KVxyXG4gICAgLnJlZHVjZShmdW5jdGlvbiAoc2V0LCBoZWFkZXIpIHtcclxuICAgICAgc2V0W2hlYWRlcl0gPSBoZWFkZXJzW2hlYWRlcl1cclxuICAgICAgcmV0dXJuIHNldFxyXG4gICAgfSwge30pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnN0cnVjdFR1bm5lbE9wdGlvbnMgKHJlcXVlc3QsIHByb3h5SGVhZGVycykge1xyXG4gIHZhciBwcm94eSA9IHJlcXVlc3QucHJveHlcclxuXHJcbiAgdmFyIHR1bm5lbE9wdGlvbnMgPSB7XHJcbiAgICBwcm94eToge1xyXG4gICAgICBob3N0OiBwcm94eS5ob3N0bmFtZSxcclxuICAgICAgcG9ydDogK3Byb3h5LnBvcnQsXHJcbiAgICAgIHByb3h5QXV0aDogcHJveHkuYXV0aCxcclxuICAgICAgaGVhZGVyczogcHJveHlIZWFkZXJzXHJcbiAgICB9LFxyXG4gICAgaGVhZGVyczogcmVxdWVzdC5oZWFkZXJzLFxyXG4gICAgY2E6IHJlcXVlc3QuY2EsXHJcbiAgICBjZXJ0OiByZXF1ZXN0LmNlcnQsXHJcbiAgICBrZXk6IHJlcXVlc3Qua2V5LFxyXG4gICAgcGFzc3BocmFzZTogcmVxdWVzdC5wYXNzcGhyYXNlLFxyXG4gICAgcGZ4OiByZXF1ZXN0LnBmeCxcclxuICAgIGNpcGhlcnM6IHJlcXVlc3QuY2lwaGVycyxcclxuICAgIHJlamVjdFVuYXV0aG9yaXplZDogcmVxdWVzdC5yZWplY3RVbmF1dGhvcml6ZWQsXHJcbiAgICBzZWN1cmVPcHRpb25zOiByZXF1ZXN0LnNlY3VyZU9wdGlvbnMsXHJcbiAgICBzZWN1cmVQcm90b2NvbDogcmVxdWVzdC5zZWN1cmVQcm90b2NvbFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHR1bm5lbE9wdGlvbnNcclxufVxyXG5cclxuZnVuY3Rpb24gY29uc3RydWN0VHVubmVsRm5OYW1lICh1cmksIHByb3h5KSB7XHJcbiAgdmFyIHVyaVByb3RvY29sID0gKHVyaS5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyAnaHR0cHMnIDogJ2h0dHAnKVxyXG4gIHZhciBwcm94eVByb3RvY29sID0gKHByb3h5LnByb3RvY29sID09PSAnaHR0cHM6JyA/ICdIdHRwcycgOiAnSHR0cCcpXHJcbiAgcmV0dXJuIFt1cmlQcm90b2NvbCwgcHJveHlQcm90b2NvbF0uam9pbignT3ZlcicpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFR1bm5lbEZuIChyZXF1ZXN0KSB7XHJcbiAgdmFyIHVyaSA9IHJlcXVlc3QudXJpXHJcbiAgdmFyIHByb3h5ID0gcmVxdWVzdC5wcm94eVxyXG4gIHZhciB0dW5uZWxGbk5hbWUgPSBjb25zdHJ1Y3RUdW5uZWxGbk5hbWUodXJpLCBwcm94eSlcclxuICByZXR1cm4gdHVubmVsW3R1bm5lbEZuTmFtZV1cclxufVxyXG5cclxuZnVuY3Rpb24gVHVubmVsIChyZXF1ZXN0KSB7XHJcbiAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdFxyXG4gIHRoaXMucHJveHlIZWFkZXJXaGl0ZUxpc3QgPSBkZWZhdWx0UHJveHlIZWFkZXJXaGl0ZUxpc3RcclxuICB0aGlzLnByb3h5SGVhZGVyRXhjbHVzaXZlTGlzdCA9IFtdXHJcbiAgaWYgKHR5cGVvZiByZXF1ZXN0LnR1bm5lbCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHRoaXMudHVubmVsT3ZlcnJpZGUgPSByZXF1ZXN0LnR1bm5lbFxyXG4gIH1cclxufVxyXG5cclxuVHVubmVsLnByb3RvdHlwZS5pc0VuYWJsZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgdmFyIHJlcXVlc3QgPSBzZWxmLnJlcXVlc3RcclxuICAgIC8vIFR1bm5lbCBIVFRQUyBieSBkZWZhdWx0LiBBbGxvdyB0aGUgdXNlciB0byBvdmVycmlkZSB0aGlzIHNldHRpbmcuXHJcblxyXG4gIC8vIElmIHNlbGYudHVubmVsT3ZlcnJpZGUgaXMgc2V0ICh0aGUgdXNlciBzcGVjaWZpZWQgYSB2YWx1ZSksIHVzZSBpdC5cclxuICBpZiAodHlwZW9mIHNlbGYudHVubmVsT3ZlcnJpZGUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXR1cm4gc2VsZi50dW5uZWxPdmVycmlkZVxyXG4gIH1cclxuXHJcbiAgLy8gSWYgdGhlIGRlc3RpbmF0aW9uIGlzIEhUVFBTLCB0dW5uZWwuXHJcbiAgaWYgKHJlcXVlc3QudXJpLnByb3RvY29sID09PSAnaHR0cHM6Jykge1xyXG4gICAgcmV0dXJuIHRydWVcclxuICB9XHJcblxyXG4gIC8vIE90aGVyd2lzZSwgZG8gbm90IHVzZSB0dW5uZWwuXHJcbiAgcmV0dXJuIGZhbHNlXHJcbn1cclxuXHJcblR1bm5lbC5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIHZhciByZXF1ZXN0ID0gc2VsZi5yZXF1ZXN0XHJcblxyXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XHJcblxyXG4gIGlmICh0eXBlb2YgcmVxdWVzdC5wcm94eSA9PT0gJ3N0cmluZycpIHtcclxuICAgIHJlcXVlc3QucHJveHkgPSB1cmwucGFyc2UocmVxdWVzdC5wcm94eSlcclxuICB9XHJcblxyXG4gIGlmICghcmVxdWVzdC5wcm94eSB8fCAhcmVxdWVzdC50dW5uZWwpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLy8gU2V0dXAgUHJveHkgSGVhZGVyIEV4Y2x1c2l2ZSBMaXN0IGFuZCBXaGl0ZSBMaXN0XHJcbiAgaWYgKG9wdGlvbnMucHJveHlIZWFkZXJXaGl0ZUxpc3QpIHtcclxuICAgIHNlbGYucHJveHlIZWFkZXJXaGl0ZUxpc3QgPSBvcHRpb25zLnByb3h5SGVhZGVyV2hpdGVMaXN0XHJcbiAgfVxyXG4gIGlmIChvcHRpb25zLnByb3h5SGVhZGVyRXhjbHVzaXZlTGlzdCkge1xyXG4gICAgc2VsZi5wcm94eUhlYWRlckV4Y2x1c2l2ZUxpc3QgPSBvcHRpb25zLnByb3h5SGVhZGVyRXhjbHVzaXZlTGlzdFxyXG4gIH1cclxuXHJcbiAgdmFyIHByb3h5SGVhZGVyRXhjbHVzaXZlTGlzdCA9IHNlbGYucHJveHlIZWFkZXJFeGNsdXNpdmVMaXN0LmNvbmNhdChkZWZhdWx0UHJveHlIZWFkZXJFeGNsdXNpdmVMaXN0KVxyXG4gIHZhciBwcm94eUhlYWRlcldoaXRlTGlzdCA9IHNlbGYucHJveHlIZWFkZXJXaGl0ZUxpc3QuY29uY2F0KHByb3h5SGVhZGVyRXhjbHVzaXZlTGlzdClcclxuXHJcbiAgLy8gU2V0dXAgUHJveHkgSGVhZGVycyBhbmQgUHJveHkgSGVhZGVycyBIb3N0XHJcbiAgLy8gT25seSBzZW5kIHRoZSBQcm94eSBXaGl0ZSBMaXN0ZWQgSGVhZGVyIG5hbWVzXHJcbiAgdmFyIHByb3h5SGVhZGVycyA9IGNvbnN0cnVjdFByb3h5SGVhZGVyV2hpdGVMaXN0KHJlcXVlc3QuaGVhZGVycywgcHJveHlIZWFkZXJXaGl0ZUxpc3QpXHJcbiAgcHJveHlIZWFkZXJzLmhvc3QgPSBjb25zdHJ1Y3RQcm94eUhvc3QocmVxdWVzdC51cmkpXHJcblxyXG4gIHByb3h5SGVhZGVyRXhjbHVzaXZlTGlzdC5mb3JFYWNoKHJlcXVlc3QucmVtb3ZlSGVhZGVyLCByZXF1ZXN0KVxyXG5cclxuICAvLyBTZXQgQWdlbnQgZnJvbSBUdW5uZWwgRGF0YVxyXG4gIHZhciB0dW5uZWxGbiA9IGdldFR1bm5lbEZuKHJlcXVlc3QpXHJcbiAgdmFyIHR1bm5lbE9wdGlvbnMgPSBjb25zdHJ1Y3RUdW5uZWxPcHRpb25zKHJlcXVlc3QsIHByb3h5SGVhZGVycylcclxuICByZXF1ZXN0LmFnZW50ID0gdHVubmVsRm4odHVubmVsT3B0aW9ucylcclxuXHJcbiAgcmV0dXJuIHRydWVcclxufVxyXG5cclxuVHVubmVsLmRlZmF1bHRQcm94eUhlYWRlcldoaXRlTGlzdCA9IGRlZmF1bHRQcm94eUhlYWRlcldoaXRlTGlzdFxyXG5UdW5uZWwuZGVmYXVsdFByb3h5SGVhZGVyRXhjbHVzaXZlTGlzdCA9IGRlZmF1bHRQcm94eUhlYWRlckV4Y2x1c2l2ZUxpc3RcclxuZXhwb3J0cy5UdW5uZWwgPSBUdW5uZWxcclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5mdW5jdGlvbiBmb3JtYXRIb3N0bmFtZSAoaG9zdG5hbWUpIHtcclxuICAvLyBjYW5vbmljYWxpemUgdGhlIGhvc3RuYW1lLCBzbyB0aGF0ICdvb2dsZS5jb20nIHdvbid0IG1hdGNoICdnb29nbGUuY29tJ1xyXG4gIHJldHVybiBob3N0bmFtZS5yZXBsYWNlKC9eXFwuKi8sICcuJykudG9Mb3dlckNhc2UoKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZU5vUHJveHlab25lICh6b25lKSB7XHJcbiAgem9uZSA9IHpvbmUudHJpbSgpLnRvTG93ZXJDYXNlKClcclxuXHJcbiAgdmFyIHpvbmVQYXJ0cyA9IHpvbmUuc3BsaXQoJzonLCAyKVxyXG4gIHZhciB6b25lSG9zdCA9IGZvcm1hdEhvc3RuYW1lKHpvbmVQYXJ0c1swXSlcclxuICB2YXIgem9uZVBvcnQgPSB6b25lUGFydHNbMV1cclxuICB2YXIgaGFzUG9ydCA9IHpvbmUuaW5kZXhPZignOicpID4gLTFcclxuXHJcbiAgcmV0dXJuIHtob3N0bmFtZTogem9uZUhvc3QsIHBvcnQ6IHpvbmVQb3J0LCBoYXNQb3J0OiBoYXNQb3J0fVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cmlJbk5vUHJveHkgKHVyaSwgbm9Qcm94eSkge1xyXG4gIHZhciBwb3J0ID0gdXJpLnBvcnQgfHwgKHVyaS5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyAnNDQzJyA6ICc4MCcpXHJcbiAgdmFyIGhvc3RuYW1lID0gZm9ybWF0SG9zdG5hbWUodXJpLmhvc3RuYW1lKVxyXG4gIHZhciBub1Byb3h5TGlzdCA9IG5vUHJveHkuc3BsaXQoJywnKVxyXG5cclxuICAvLyBpdGVyYXRlIHRocm91Z2ggdGhlIG5vUHJveHlMaXN0IHVudGlsIGl0IGZpbmRzIGEgbWF0Y2guXHJcbiAgcmV0dXJuIG5vUHJveHlMaXN0Lm1hcChwYXJzZU5vUHJveHlab25lKS5zb21lKGZ1bmN0aW9uIChub1Byb3h5Wm9uZSkge1xyXG4gICAgdmFyIGlzTWF0Y2hlZEF0ID0gaG9zdG5hbWUuaW5kZXhPZihub1Byb3h5Wm9uZS5ob3N0bmFtZSlcclxuICAgIHZhciBob3N0bmFtZU1hdGNoZWQgPSAoXHJcbiAgICAgIGlzTWF0Y2hlZEF0ID4gLTEgJiZcclxuICAgICAgICAoaXNNYXRjaGVkQXQgPT09IGhvc3RuYW1lLmxlbmd0aCAtIG5vUHJveHlab25lLmhvc3RuYW1lLmxlbmd0aClcclxuICAgIClcclxuXHJcbiAgICBpZiAobm9Qcm94eVpvbmUuaGFzUG9ydCkge1xyXG4gICAgICByZXR1cm4gKHBvcnQgPT09IG5vUHJveHlab25lLnBvcnQpICYmIGhvc3RuYW1lTWF0Y2hlZFxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBob3N0bmFtZU1hdGNoZWRcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQcm94eUZyb21VUkkgKHVyaSkge1xyXG4gIC8vIERlY2lkZSB0aGUgcHJvcGVyIHJlcXVlc3QgcHJveHkgdG8gdXNlIGJhc2VkIG9uIHRoZSByZXF1ZXN0IFVSSSBvYmplY3QgYW5kIHRoZVxyXG4gIC8vIGVudmlyb25tZW50YWwgdmFyaWFibGVzIChOT19QUk9YWSwgSFRUUF9QUk9YWSwgZXRjLilcclxuICAvLyByZXNwZWN0IE5PX1BST1hZIGVudmlyb25tZW50IHZhcmlhYmxlcyAoc2VlOiBodHRwOi8vbHlueC5pc2Mub3JnL2N1cnJlbnQvYnJlYWtvdXQvbHlueF9oZWxwL2tleXN0cm9rZXMvZW52aXJvbm1lbnRzLmh0bWwpXHJcblxyXG4gIHZhciBub1Byb3h5ID0gcHJvY2Vzcy5lbnYuTk9fUFJPWFkgfHwgcHJvY2Vzcy5lbnYubm9fcHJveHkgfHwgJydcclxuXHJcbiAgLy8gaWYgdGhlIG5vUHJveHkgaXMgYSB3aWxkY2FyZCB0aGVuIHJldHVybiBudWxsXHJcblxyXG4gIGlmIChub1Byb3h5ID09PSAnKicpIHtcclxuICAgIHJldHVybiBudWxsXHJcbiAgfVxyXG5cclxuICAvLyBpZiB0aGUgbm9Qcm94eSBpcyBub3QgZW1wdHkgYW5kIHRoZSB1cmkgaXMgZm91bmQgcmV0dXJuIG51bGxcclxuXHJcbiAgaWYgKG5vUHJveHkgIT09ICcnICYmIHVyaUluTm9Qcm94eSh1cmksIG5vUHJveHkpKSB7XHJcbiAgICByZXR1cm4gbnVsbFxyXG4gIH1cclxuXHJcbiAgLy8gQ2hlY2sgZm9yIEhUVFAgb3IgSFRUUFMgUHJveHkgaW4gZW52aXJvbm1lbnQgRWxzZSBkZWZhdWx0IHRvIG51bGxcclxuXHJcbiAgaWYgKHVyaS5wcm90b2NvbCA9PT0gJ2h0dHA6Jykge1xyXG4gICAgcmV0dXJuIHByb2Nlc3MuZW52LkhUVFBfUFJPWFkgfHxcclxuICAgICAgcHJvY2Vzcy5lbnYuaHR0cF9wcm94eSB8fCBudWxsXHJcbiAgfVxyXG5cclxuICBpZiAodXJpLnByb3RvY29sID09PSAnaHR0cHM6Jykge1xyXG4gICAgcmV0dXJuIHByb2Nlc3MuZW52LkhUVFBTX1BST1hZIHx8XHJcbiAgICAgIHByb2Nlc3MuZW52Lmh0dHBzX3Byb3h5IHx8XHJcbiAgICAgIHByb2Nlc3MuZW52LkhUVFBfUFJPWFkgfHxcclxuICAgICAgcHJvY2Vzcy5lbnYuaHR0cF9wcm94eSB8fCBudWxsXHJcbiAgfVxyXG5cclxuICAvLyBpZiBub25lIG9mIHRoYXQgd29ya3MsIHJldHVybiBudWxsXHJcbiAgLy8gKFdoYXQgdXJpIHByb3RvY29sIGFyZSB5b3UgdXNpbmcgdGhlbj8pXHJcblxyXG4gIHJldHVybiBudWxsXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ2V0UHJveHlGcm9tVVJJXHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIHVybCA9IHJlcXVpcmUoJ3VybCcpXHJcbnZhciBxcyA9IHJlcXVpcmUoJ3FzJylcclxudmFyIGNhc2VsZXNzID0gcmVxdWlyZSgnY2FzZWxlc3MnKVxyXG52YXIgdXVpZCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxyXG52YXIgb2F1dGggPSByZXF1aXJlKCdvYXV0aC1zaWduJylcclxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG5cclxuZnVuY3Rpb24gT0F1dGggKHJlcXVlc3QpIHtcclxuICB0aGlzLnJlcXVlc3QgPSByZXF1ZXN0XHJcbiAgdGhpcy5wYXJhbXMgPSBudWxsXHJcbn1cclxuXHJcbk9BdXRoLnByb3RvdHlwZS5idWlsZFBhcmFtcyA9IGZ1bmN0aW9uIChfb2F1dGgsIHVyaSwgbWV0aG9kLCBxdWVyeSwgZm9ybSwgcXNMaWIpIHtcclxuICB2YXIgb2EgPSB7fVxyXG4gIGZvciAodmFyIGkgaW4gX29hdXRoKSB7XHJcbiAgICBvYVsnb2F1dGhfJyArIGldID0gX29hdXRoW2ldXHJcbiAgfVxyXG4gIGlmICghb2Eub2F1dGhfdmVyc2lvbikge1xyXG4gICAgb2Eub2F1dGhfdmVyc2lvbiA9ICcxLjAnXHJcbiAgfVxyXG4gIGlmICghb2Eub2F1dGhfdGltZXN0YW1wKSB7XHJcbiAgICBvYS5vYXV0aF90aW1lc3RhbXAgPSBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKS50b1N0cmluZygpXHJcbiAgfVxyXG4gIGlmICghb2Eub2F1dGhfbm9uY2UpIHtcclxuICAgIG9hLm9hdXRoX25vbmNlID0gdXVpZCgpLnJlcGxhY2UoLy0vZywgJycpXHJcbiAgfVxyXG4gIGlmICghb2Eub2F1dGhfc2lnbmF0dXJlX21ldGhvZCkge1xyXG4gICAgb2Eub2F1dGhfc2lnbmF0dXJlX21ldGhvZCA9ICdITUFDLVNIQTEnXHJcbiAgfVxyXG5cclxuICB2YXIgY29uc3VtZXJfc2VjcmV0X29yX3ByaXZhdGVfa2V5ID0gb2Eub2F1dGhfY29uc3VtZXJfc2VjcmV0IHx8IG9hLm9hdXRoX3ByaXZhdGVfa2V5IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY2FtZWxjYXNlXHJcbiAgZGVsZXRlIG9hLm9hdXRoX2NvbnN1bWVyX3NlY3JldFxyXG4gIGRlbGV0ZSBvYS5vYXV0aF9wcml2YXRlX2tleVxyXG5cclxuICB2YXIgdG9rZW5fc2VjcmV0ID0gb2Eub2F1dGhfdG9rZW5fc2VjcmV0IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY2FtZWxjYXNlXHJcbiAgZGVsZXRlIG9hLm9hdXRoX3Rva2VuX3NlY3JldFxyXG5cclxuICB2YXIgcmVhbG0gPSBvYS5vYXV0aF9yZWFsbVxyXG4gIGRlbGV0ZSBvYS5vYXV0aF9yZWFsbVxyXG4gIGRlbGV0ZSBvYS5vYXV0aF90cmFuc3BvcnRfbWV0aG9kXHJcblxyXG4gIHZhciBiYXNldXJsID0gdXJpLnByb3RvY29sICsgJy8vJyArIHVyaS5ob3N0ICsgdXJpLnBhdGhuYW1lXHJcbiAgdmFyIHBhcmFtcyA9IHFzTGliLnBhcnNlKFtdLmNvbmNhdChxdWVyeSwgZm9ybSwgcXNMaWIuc3RyaW5naWZ5KG9hKSkuam9pbignJicpKVxyXG5cclxuICBvYS5vYXV0aF9zaWduYXR1cmUgPSBvYXV0aC5zaWduKFxyXG4gICAgb2Eub2F1dGhfc2lnbmF0dXJlX21ldGhvZCxcclxuICAgIG1ldGhvZCxcclxuICAgIGJhc2V1cmwsXHJcbiAgICBwYXJhbXMsXHJcbiAgICBjb25zdW1lcl9zZWNyZXRfb3JfcHJpdmF0ZV9rZXksIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY2FtZWxjYXNlXHJcbiAgICB0b2tlbl9zZWNyZXQgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjYW1lbGNhc2VcclxuICApXHJcblxyXG4gIGlmIChyZWFsbSkge1xyXG4gICAgb2EucmVhbG0gPSByZWFsbVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG9hXHJcbn1cclxuXHJcbk9BdXRoLnByb3RvdHlwZS5idWlsZEJvZHlIYXNoID0gZnVuY3Rpb24gKF9vYXV0aCwgYm9keSkge1xyXG4gIGlmIChbJ0hNQUMtU0hBMScsICdSU0EtU0hBMSddLmluZGV4T2YoX29hdXRoLnNpZ25hdHVyZV9tZXRob2QgfHwgJ0hNQUMtU0hBMScpIDwgMCkge1xyXG4gICAgdGhpcy5yZXF1ZXN0LmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdvYXV0aDogJyArIF9vYXV0aC5zaWduYXR1cmVfbWV0aG9kICtcclxuICAgICAgJyBzaWduYXR1cmVfbWV0aG9kIG5vdCBzdXBwb3J0ZWQgd2l0aCBib2R5X2hhc2ggc2lnbmluZy4nKSlcclxuICB9XHJcblxyXG4gIHZhciBzaGFzdW0gPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpXHJcbiAgc2hhc3VtLnVwZGF0ZShib2R5IHx8ICcnKVxyXG4gIHZhciBzaGExID0gc2hhc3VtLmRpZ2VzdCgnaGV4JylcclxuXHJcbiAgcmV0dXJuIEJ1ZmZlci5mcm9tKHNoYTEsICdoZXgnKS50b1N0cmluZygnYmFzZTY0JylcclxufVxyXG5cclxuT0F1dGgucHJvdG90eXBlLmNvbmNhdFBhcmFtcyA9IGZ1bmN0aW9uIChvYSwgc2VwLCB3cmFwKSB7XHJcbiAgd3JhcCA9IHdyYXAgfHwgJydcclxuXHJcbiAgdmFyIHBhcmFtcyA9IE9iamVjdC5rZXlzKG9hKS5maWx0ZXIoZnVuY3Rpb24gKGkpIHtcclxuICAgIHJldHVybiBpICE9PSAncmVhbG0nICYmIGkgIT09ICdvYXV0aF9zaWduYXR1cmUnXHJcbiAgfSkuc29ydCgpXHJcblxyXG4gIGlmIChvYS5yZWFsbSkge1xyXG4gICAgcGFyYW1zLnNwbGljZSgwLCAwLCAncmVhbG0nKVxyXG4gIH1cclxuICBwYXJhbXMucHVzaCgnb2F1dGhfc2lnbmF0dXJlJylcclxuXHJcbiAgcmV0dXJuIHBhcmFtcy5tYXAoZnVuY3Rpb24gKGkpIHtcclxuICAgIHJldHVybiBpICsgJz0nICsgd3JhcCArIG9hdXRoLnJmYzM5ODYob2FbaV0pICsgd3JhcFxyXG4gIH0pLmpvaW4oc2VwKVxyXG59XHJcblxyXG5PQXV0aC5wcm90b3R5cGUub25SZXF1ZXN0ID0gZnVuY3Rpb24gKF9vYXV0aCkge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIHNlbGYucGFyYW1zID0gX29hdXRoXHJcblxyXG4gIHZhciB1cmkgPSBzZWxmLnJlcXVlc3QudXJpIHx8IHt9XHJcbiAgdmFyIG1ldGhvZCA9IHNlbGYucmVxdWVzdC5tZXRob2QgfHwgJydcclxuICB2YXIgaGVhZGVycyA9IGNhc2VsZXNzKHNlbGYucmVxdWVzdC5oZWFkZXJzKVxyXG4gIHZhciBib2R5ID0gc2VsZi5yZXF1ZXN0LmJvZHkgfHwgJydcclxuICB2YXIgcXNMaWIgPSBzZWxmLnJlcXVlc3QucXNMaWIgfHwgcXNcclxuXHJcbiAgdmFyIGZvcm1cclxuICB2YXIgcXVlcnlcclxuICB2YXIgY29udGVudFR5cGUgPSBoZWFkZXJzLmdldCgnY29udGVudC10eXBlJykgfHwgJydcclxuICB2YXIgZm9ybUNvbnRlbnRUeXBlID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcclxuICB2YXIgdHJhbnNwb3J0ID0gX29hdXRoLnRyYW5zcG9ydF9tZXRob2QgfHwgJ2hlYWRlcidcclxuXHJcbiAgaWYgKGNvbnRlbnRUeXBlLnNsaWNlKDAsIGZvcm1Db250ZW50VHlwZS5sZW5ndGgpID09PSBmb3JtQ29udGVudFR5cGUpIHtcclxuICAgIGNvbnRlbnRUeXBlID0gZm9ybUNvbnRlbnRUeXBlXHJcbiAgICBmb3JtID0gYm9keVxyXG4gIH1cclxuICBpZiAodXJpLnF1ZXJ5KSB7XHJcbiAgICBxdWVyeSA9IHVyaS5xdWVyeVxyXG4gIH1cclxuICBpZiAodHJhbnNwb3J0ID09PSAnYm9keScgJiYgKG1ldGhvZCAhPT0gJ1BPU1QnIHx8IGNvbnRlbnRUeXBlICE9PSBmb3JtQ29udGVudFR5cGUpKSB7XHJcbiAgICBzZWxmLnJlcXVlc3QuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ29hdXRoOiB0cmFuc3BvcnRfbWV0aG9kIG9mIGJvZHkgcmVxdWlyZXMgUE9TVCAnICtcclxuICAgICAgJ2FuZCBjb250ZW50LXR5cGUgJyArIGZvcm1Db250ZW50VHlwZSkpXHJcbiAgfVxyXG5cclxuICBpZiAoIWZvcm0gJiYgdHlwZW9mIF9vYXV0aC5ib2R5X2hhc2ggPT09ICdib29sZWFuJykge1xyXG4gICAgX29hdXRoLmJvZHlfaGFzaCA9IHNlbGYuYnVpbGRCb2R5SGFzaChfb2F1dGgsIHNlbGYucmVxdWVzdC5ib2R5LnRvU3RyaW5nKCkpXHJcbiAgfVxyXG5cclxuICB2YXIgb2EgPSBzZWxmLmJ1aWxkUGFyYW1zKF9vYXV0aCwgdXJpLCBtZXRob2QsIHF1ZXJ5LCBmb3JtLCBxc0xpYilcclxuXHJcbiAgc3dpdGNoICh0cmFuc3BvcnQpIHtcclxuICAgIGNhc2UgJ2hlYWRlcic6XHJcbiAgICAgIHNlbGYucmVxdWVzdC5zZXRIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCAnT0F1dGggJyArIHNlbGYuY29uY2F0UGFyYW1zKG9hLCAnLCcsICdcIicpKVxyXG4gICAgICBicmVha1xyXG5cclxuICAgIGNhc2UgJ3F1ZXJ5JzpcclxuICAgICAgdmFyIGhyZWYgPSBzZWxmLnJlcXVlc3QudXJpLmhyZWYgKz0gKHF1ZXJ5ID8gJyYnIDogJz8nKSArIHNlbGYuY29uY2F0UGFyYW1zKG9hLCAnJicpXHJcbiAgICAgIHNlbGYucmVxdWVzdC51cmkgPSB1cmwucGFyc2UoaHJlZilcclxuICAgICAgc2VsZi5yZXF1ZXN0LnBhdGggPSBzZWxmLnJlcXVlc3QudXJpLnBhdGhcclxuICAgICAgYnJlYWtcclxuXHJcbiAgICBjYXNlICdib2R5JzpcclxuICAgICAgc2VsZi5yZXF1ZXN0LmJvZHkgPSAoZm9ybSA/IGZvcm0gKyAnJicgOiAnJykgKyBzZWxmLmNvbmNhdFBhcmFtcyhvYSwgJyYnKVxyXG4gICAgICBicmVha1xyXG5cclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHNlbGYucmVxdWVzdC5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignb2F1dGg6IHRyYW5zcG9ydF9tZXRob2QgaW52YWxpZCcpKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0cy5PQXV0aCA9IE9BdXRoXHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxyXG52YXIgcXMgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpXHJcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJ2hhci12YWxpZGF0b3InKVxyXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJylcclxuXHJcbmZ1bmN0aW9uIEhhciAocmVxdWVzdCkge1xyXG4gIHRoaXMucmVxdWVzdCA9IHJlcXVlc3RcclxufVxyXG5cclxuSGFyLnByb3RvdHlwZS5yZWR1Y2VyID0gZnVuY3Rpb24gKG9iaiwgcGFpcikge1xyXG4gIC8vIG5ldyBwcm9wZXJ0eSA/XHJcbiAgaWYgKG9ialtwYWlyLm5hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgIG9ialtwYWlyLm5hbWVdID0gcGFpci52YWx1ZVxyXG4gICAgcmV0dXJuIG9ialxyXG4gIH1cclxuXHJcbiAgLy8gZXhpc3Rpbmc/IGNvbnZlcnQgdG8gYXJyYXlcclxuICB2YXIgYXJyID0gW1xyXG4gICAgb2JqW3BhaXIubmFtZV0sXHJcbiAgICBwYWlyLnZhbHVlXHJcbiAgXVxyXG5cclxuICBvYmpbcGFpci5uYW1lXSA9IGFyclxyXG5cclxuICByZXR1cm4gb2JqXHJcbn1cclxuXHJcbkhhci5wcm90b3R5cGUucHJlcCA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgLy8gY29uc3RydWN0IHV0aWxpdHkgcHJvcGVydGllc1xyXG4gIGRhdGEucXVlcnlPYmogPSB7fVxyXG4gIGRhdGEuaGVhZGVyc09iaiA9IHt9XHJcbiAgZGF0YS5wb3N0RGF0YS5qc29uT2JqID0gZmFsc2VcclxuICBkYXRhLnBvc3REYXRhLnBhcmFtc09iaiA9IGZhbHNlXHJcblxyXG4gIC8vIGNvbnN0cnVjdCBxdWVyeSBvYmplY3RzXHJcbiAgaWYgKGRhdGEucXVlcnlTdHJpbmcgJiYgZGF0YS5xdWVyeVN0cmluZy5sZW5ndGgpIHtcclxuICAgIGRhdGEucXVlcnlPYmogPSBkYXRhLnF1ZXJ5U3RyaW5nLnJlZHVjZSh0aGlzLnJlZHVjZXIsIHt9KVxyXG4gIH1cclxuXHJcbiAgLy8gY29uc3RydWN0IGhlYWRlcnMgb2JqZWN0c1xyXG4gIGlmIChkYXRhLmhlYWRlcnMgJiYgZGF0YS5oZWFkZXJzLmxlbmd0aCkge1xyXG4gICAgLy8gbG93ZUNhc2UgaGVhZGVyIGtleXNcclxuICAgIGRhdGEuaGVhZGVyc09iaiA9IGRhdGEuaGVhZGVycy5yZWR1Y2VSaWdodChmdW5jdGlvbiAoaGVhZGVycywgaGVhZGVyKSB7XHJcbiAgICAgIGhlYWRlcnNbaGVhZGVyLm5hbWVdID0gaGVhZGVyLnZhbHVlXHJcbiAgICAgIHJldHVybiBoZWFkZXJzXHJcbiAgICB9LCB7fSlcclxuICB9XHJcblxyXG4gIC8vIGNvbnN0cnVjdCBDb29raWUgaGVhZGVyXHJcbiAgaWYgKGRhdGEuY29va2llcyAmJiBkYXRhLmNvb2tpZXMubGVuZ3RoKSB7XHJcbiAgICB2YXIgY29va2llcyA9IGRhdGEuY29va2llcy5tYXAoZnVuY3Rpb24gKGNvb2tpZSkge1xyXG4gICAgICByZXR1cm4gY29va2llLm5hbWUgKyAnPScgKyBjb29raWUudmFsdWVcclxuICAgIH0pXHJcblxyXG4gICAgaWYgKGNvb2tpZXMubGVuZ3RoKSB7XHJcbiAgICAgIGRhdGEuaGVhZGVyc09iai5jb29raWUgPSBjb29raWVzLmpvaW4oJzsgJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHByZXAgYm9keVxyXG4gIGZ1bmN0aW9uIHNvbWUgKGFycikge1xyXG4gICAgcmV0dXJuIGFyci5zb21lKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgIHJldHVybiBkYXRhLnBvc3REYXRhLm1pbWVUeXBlLmluZGV4T2YodHlwZSkgPT09IDBcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBpZiAoc29tZShbXHJcbiAgICAnbXVsdGlwYXJ0L21peGVkJyxcclxuICAgICdtdWx0aXBhcnQvcmVsYXRlZCcsXHJcbiAgICAnbXVsdGlwYXJ0L2Zvcm0tZGF0YScsXHJcbiAgICAnbXVsdGlwYXJ0L2FsdGVybmF0aXZlJ10pKSB7XHJcbiAgICAvLyByZXNldCB2YWx1ZXNcclxuICAgIGRhdGEucG9zdERhdGEubWltZVR5cGUgPSAnbXVsdGlwYXJ0L2Zvcm0tZGF0YSdcclxuICB9IGVsc2UgaWYgKHNvbWUoW1xyXG4gICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCddKSkge1xyXG4gICAgaWYgKCFkYXRhLnBvc3REYXRhLnBhcmFtcykge1xyXG4gICAgICBkYXRhLnBvc3REYXRhLnRleHQgPSAnJ1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGF0YS5wb3N0RGF0YS5wYXJhbXNPYmogPSBkYXRhLnBvc3REYXRhLnBhcmFtcy5yZWR1Y2UodGhpcy5yZWR1Y2VyLCB7fSlcclxuXHJcbiAgICAgIC8vIGFsd2F5cyBvdmVyd3JpdGVcclxuICAgICAgZGF0YS5wb3N0RGF0YS50ZXh0ID0gcXMuc3RyaW5naWZ5KGRhdGEucG9zdERhdGEucGFyYW1zT2JqKVxyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoc29tZShbXHJcbiAgICAndGV4dC9qc29uJyxcclxuICAgICd0ZXh0L3gtanNvbicsXHJcbiAgICAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAnYXBwbGljYXRpb24veC1qc29uJ10pKSB7XHJcbiAgICBkYXRhLnBvc3REYXRhLm1pbWVUeXBlID0gJ2FwcGxpY2F0aW9uL2pzb24nXHJcblxyXG4gICAgaWYgKGRhdGEucG9zdERhdGEudGV4dCkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGRhdGEucG9zdERhdGEuanNvbk9iaiA9IEpTT04ucGFyc2UoZGF0YS5wb3N0RGF0YS50ZXh0KVxyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0LmRlYnVnKGUpXHJcblxyXG4gICAgICAgIC8vIGZvcmNlIGJhY2sgdG8gdGV4dC9wbGFpblxyXG4gICAgICAgIGRhdGEucG9zdERhdGEubWltZVR5cGUgPSAndGV4dC9wbGFpbidcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGFcclxufVxyXG5cclxuSGFyLnByb3RvdHlwZS5vcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAvLyBza2lwIGlmIG5vIGhhciBwcm9wZXJ0eSBkZWZpbmVkXHJcbiAgaWYgKCFvcHRpb25zLmhhcikge1xyXG4gICAgcmV0dXJuIG9wdGlvbnNcclxuICB9XHJcblxyXG4gIHZhciBoYXIgPSB7fVxyXG4gIGV4dGVuZChoYXIsIG9wdGlvbnMuaGFyKVxyXG5cclxuICAvLyBvbmx5IHByb2Nlc3MgdGhlIGZpcnN0IGVudHJ5XHJcbiAgaWYgKGhhci5sb2cgJiYgaGFyLmxvZy5lbnRyaWVzKSB7XHJcbiAgICBoYXIgPSBoYXIubG9nLmVudHJpZXNbMF1cclxuICB9XHJcblxyXG4gIC8vIGFkZCBvcHRpb25hbCBwcm9wZXJ0aWVzIHRvIG1ha2UgdmFsaWRhdGlvbiBzdWNjZXNzZnVsXHJcbiAgaGFyLnVybCA9IGhhci51cmwgfHwgb3B0aW9ucy51cmwgfHwgb3B0aW9ucy51cmkgfHwgb3B0aW9ucy5iYXNlVXJsIHx8ICcvJ1xyXG4gIGhhci5odHRwVmVyc2lvbiA9IGhhci5odHRwVmVyc2lvbiB8fCAnSFRUUC8xLjEnXHJcbiAgaGFyLnF1ZXJ5U3RyaW5nID0gaGFyLnF1ZXJ5U3RyaW5nIHx8IFtdXHJcbiAgaGFyLmhlYWRlcnMgPSBoYXIuaGVhZGVycyB8fCBbXVxyXG4gIGhhci5jb29raWVzID0gaGFyLmNvb2tpZXMgfHwgW11cclxuICBoYXIucG9zdERhdGEgPSBoYXIucG9zdERhdGEgfHwge31cclxuICBoYXIucG9zdERhdGEubWltZVR5cGUgPSBoYXIucG9zdERhdGEubWltZVR5cGUgfHwgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuXHJcbiAgaGFyLmJvZHlTaXplID0gMFxyXG4gIGhhci5oZWFkZXJzU2l6ZSA9IDBcclxuICBoYXIucG9zdERhdGEuc2l6ZSA9IDBcclxuXHJcbiAgaWYgKCF2YWxpZGF0ZS5yZXF1ZXN0KGhhcikpIHtcclxuICAgIHJldHVybiBvcHRpb25zXHJcbiAgfVxyXG5cclxuICAvLyBjbGVhbiB1cCBhbmQgZ2V0IHNvbWUgdXRpbGl0eSBwcm9wZXJ0aWVzXHJcbiAgdmFyIHJlcSA9IHRoaXMucHJlcChoYXIpXHJcblxyXG4gIC8vIGNvbnN0cnVjdCBuZXcgb3B0aW9uc1xyXG4gIGlmIChyZXEudXJsKSB7XHJcbiAgICBvcHRpb25zLnVybCA9IHJlcS51cmxcclxuICB9XHJcblxyXG4gIGlmIChyZXEubWV0aG9kKSB7XHJcbiAgICBvcHRpb25zLm1ldGhvZCA9IHJlcS5tZXRob2RcclxuICB9XHJcblxyXG4gIGlmIChPYmplY3Qua2V5cyhyZXEucXVlcnlPYmopLmxlbmd0aCkge1xyXG4gICAgb3B0aW9ucy5xcyA9IHJlcS5xdWVyeU9ialxyXG4gIH1cclxuXHJcbiAgaWYgKE9iamVjdC5rZXlzKHJlcS5oZWFkZXJzT2JqKS5sZW5ndGgpIHtcclxuICAgIG9wdGlvbnMuaGVhZGVycyA9IHJlcS5oZWFkZXJzT2JqXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0ZXN0ICh0eXBlKSB7XHJcbiAgICByZXR1cm4gcmVxLnBvc3REYXRhLm1pbWVUeXBlLmluZGV4T2YodHlwZSkgPT09IDBcclxuICB9XHJcbiAgaWYgKHRlc3QoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpKSB7XHJcbiAgICBvcHRpb25zLmZvcm0gPSByZXEucG9zdERhdGEucGFyYW1zT2JqXHJcbiAgfSBlbHNlIGlmICh0ZXN0KCdhcHBsaWNhdGlvbi9qc29uJykpIHtcclxuICAgIGlmIChyZXEucG9zdERhdGEuanNvbk9iaikge1xyXG4gICAgICBvcHRpb25zLmJvZHkgPSByZXEucG9zdERhdGEuanNvbk9ialxyXG4gICAgICBvcHRpb25zLmpzb24gPSB0cnVlXHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmICh0ZXN0KCdtdWx0aXBhcnQvZm9ybS1kYXRhJykpIHtcclxuICAgIG9wdGlvbnMuZm9ybURhdGEgPSB7fVxyXG5cclxuICAgIHJlcS5wb3N0RGF0YS5wYXJhbXMuZm9yRWFjaChmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIGF0dGFjaG1lbnQgPSB7fVxyXG5cclxuICAgICAgaWYgKCFwYXJhbS5maWxlTmFtZSAmJiAhcGFyYW0uZmlsZU5hbWUgJiYgIXBhcmFtLmNvbnRlbnRUeXBlKSB7XHJcbiAgICAgICAgb3B0aW9ucy5mb3JtRGF0YVtwYXJhbS5uYW1lXSA9IHBhcmFtLnZhbHVlXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGF0dGVtcHQgdG8gcmVhZCBmcm9tIGRpc2shXHJcbiAgICAgIGlmIChwYXJhbS5maWxlTmFtZSAmJiAhcGFyYW0udmFsdWUpIHtcclxuICAgICAgICBhdHRhY2htZW50LnZhbHVlID0gZnMuY3JlYXRlUmVhZFN0cmVhbShwYXJhbS5maWxlTmFtZSlcclxuICAgICAgfSBlbHNlIGlmIChwYXJhbS52YWx1ZSkge1xyXG4gICAgICAgIGF0dGFjaG1lbnQudmFsdWUgPSBwYXJhbS52YWx1ZVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW0uZmlsZU5hbWUpIHtcclxuICAgICAgICBhdHRhY2htZW50Lm9wdGlvbnMgPSB7XHJcbiAgICAgICAgICBmaWxlbmFtZTogcGFyYW0uZmlsZU5hbWUsXHJcbiAgICAgICAgICBjb250ZW50VHlwZTogcGFyYW0uY29udGVudFR5cGUgPyBwYXJhbS5jb250ZW50VHlwZSA6IG51bGxcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9wdGlvbnMuZm9ybURhdGFbcGFyYW0ubmFtZV0gPSBhdHRhY2htZW50XHJcbiAgICB9KVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAocmVxLnBvc3REYXRhLnRleHQpIHtcclxuICAgICAgb3B0aW9ucy5ib2R5ID0gcmVxLnBvc3REYXRhLnRleHRcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBvcHRpb25zXHJcbn1cclxuXHJcbmV4cG9ydHMuSGFyID0gSGFyXHJcbiJdLCJzb3VyY2VSb290IjoiIn0=