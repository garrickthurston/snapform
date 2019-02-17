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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVxdWVzdC9saWIvY29va2llcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVxdWVzdC9saWIvaGVscGVycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVxdWVzdC9saWIvcXVlcnlzdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlcXVlc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlcXVlc3QvbGliL211bHRpcGFydC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVxdWVzdC9yZXF1ZXN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZXF1ZXN0L2xpYi9oYXdrLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZXF1ZXN0L2xpYi9hdXRoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZXF1ZXN0L2xpYi9yZWRpcmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVxdWVzdC9saWIvdHVubmVsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZXF1ZXN0L2xpYi9nZXRQcm94eUZyb21VUkkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlcXVlc3QvbGliL29hdXRoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZXF1ZXN0L2xpYi9oYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFZOztBQUVaLFlBQVksbUJBQU8sQ0FBQywwQkFBYzs7QUFFbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixZQUFZO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxnQkFBZ0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFO0FBQ2hFO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHdDQUF3QyxxQkFBcUIsMkNBQTJDO0FBQ3hHOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixzQkFBc0I7QUFDL0M7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0VBQXNFLGlDQUFpQztBQUN2RztBQUNBOztBQUVBO0FBQ0EsMEVBQTBFLGlDQUFpQztBQUMzRztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxtREFBbUQsc0JBQXNCO0FBQ3pFLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0Esd0JBQXdCO0FBQ3hCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsNkNBQTZDO0FBQzdDO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELGtCQUFrQjtBQUMxRSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMLDZDQUE2QyxxQkFBcUI7O0FBRWxFO0FBQ0E7QUFDQSxLQUFLLE9BQU87QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLElBQUk7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUssSUFBSTtBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDOUtBLCtDQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFD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QUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBIiwiZmlsZSI6InZlbmRvci92ZW5kb3IucmVxdWVzdC5kN2QyOTg1ZDJlZjQ3MDZjYTdkYy5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG52YXIgdG91Z2ggPSByZXF1aXJlKCd0b3VnaC1jb29raWUnKVxuXG52YXIgQ29va2llID0gdG91Z2guQ29va2llXG52YXIgQ29va2llSmFyID0gdG91Z2guQ29va2llSmFyXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIGlmIChzdHIgJiYgc3RyLnVyaSkge1xuICAgIHN0ciA9IHN0ci51cmlcbiAgfVxuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb29raWUgZnVuY3Rpb24gb25seSBhY2NlcHRzIFNUUklORyBhcyBwYXJhbScpXG4gIH1cbiAgcmV0dXJuIENvb2tpZS5wYXJzZShzdHIsIHtsb29zZTogdHJ1ZX0pXG59XG5cbi8vIEFkYXB0IHRoZSBzb21ldGltZXMtQXN5bmMgYXBpIG9mIHRvdWdoLkNvb2tpZUphciB0byBvdXIgcmVxdWlyZW1lbnRzXG5mdW5jdGlvbiBSZXF1ZXN0SmFyIChzdG9yZSkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgc2VsZi5famFyID0gbmV3IENvb2tpZUphcihzdG9yZSwge2xvb3NlTW9kZTogdHJ1ZX0pXG59XG5SZXF1ZXN0SmFyLnByb3RvdHlwZS5zZXRDb29raWUgPSBmdW5jdGlvbiAoY29va2llT3JTdHIsIHVyaSwgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgcmV0dXJuIHNlbGYuX2phci5zZXRDb29raWVTeW5jKGNvb2tpZU9yU3RyLCB1cmksIG9wdGlvbnMgfHwge30pXG59XG5SZXF1ZXN0SmFyLnByb3RvdHlwZS5nZXRDb29raWVTdHJpbmcgPSBmdW5jdGlvbiAodXJpKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICByZXR1cm4gc2VsZi5famFyLmdldENvb2tpZVN0cmluZ1N5bmModXJpKVxufVxuUmVxdWVzdEphci5wcm90b3R5cGUuZ2V0Q29va2llcyA9IGZ1bmN0aW9uICh1cmkpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHJldHVybiBzZWxmLl9qYXIuZ2V0Q29va2llc1N5bmModXJpKVxufVxuXG5leHBvcnRzLmphciA9IGZ1bmN0aW9uIChzdG9yZSkge1xuICByZXR1cm4gbmV3IFJlcXVlc3RKYXIoc3RvcmUpXG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIGpzb25TYWZlU3RyaW5naWZ5ID0gcmVxdWlyZSgnanNvbi1zdHJpbmdpZnktc2FmZScpXG52YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxuXG52YXIgZGVmZXIgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAndW5kZWZpbmVkJ1xuICA/IHByb2Nlc3MubmV4dFRpY2tcbiAgOiBzZXRJbW1lZGlhdGVcblxuZnVuY3Rpb24gcGFyYW1zSGF2ZVJlcXVlc3RCb2R5IChwYXJhbXMpIHtcbiAgcmV0dXJuIChcbiAgICBwYXJhbXMuYm9keSB8fFxuICAgIHBhcmFtcy5yZXF1ZXN0Qm9keVN0cmVhbSB8fFxuICAgIChwYXJhbXMuanNvbiAmJiB0eXBlb2YgcGFyYW1zLmpzb24gIT09ICdib29sZWFuJykgfHxcbiAgICBwYXJhbXMubXVsdGlwYXJ0XG4gIClcbn1cblxuZnVuY3Rpb24gc2FmZVN0cmluZ2lmeSAob2JqLCByZXBsYWNlcikge1xuICB2YXIgcmV0XG4gIHRyeSB7XG4gICAgcmV0ID0gSlNPTi5zdHJpbmdpZnkob2JqLCByZXBsYWNlcilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldCA9IGpzb25TYWZlU3RyaW5naWZ5KG9iaiwgcmVwbGFjZXIpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBtZDUgKHN0cikge1xuICByZXR1cm4gY3J5cHRvLmNyZWF0ZUhhc2goJ21kNScpLnVwZGF0ZShzdHIpLmRpZ2VzdCgnaGV4Jylcbn1cblxuZnVuY3Rpb24gaXNSZWFkU3RyZWFtIChycykge1xuICByZXR1cm4gcnMucmVhZGFibGUgJiYgcnMucGF0aCAmJiBycy5tb2RlXG59XG5cbmZ1bmN0aW9uIHRvQmFzZTY0IChzdHIpIHtcbiAgcmV0dXJuIEJ1ZmZlci5mcm9tKHN0ciB8fCAnJywgJ3V0ZjgnKS50b1N0cmluZygnYmFzZTY0Jylcbn1cblxuZnVuY3Rpb24gY29weSAob2JqKSB7XG4gIHZhciBvID0ge31cbiAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgb1tpXSA9IG9ialtpXVxuICB9KVxuICByZXR1cm4gb1xufVxuXG5mdW5jdGlvbiB2ZXJzaW9uICgpIHtcbiAgdmFyIG51bWJlcnMgPSBwcm9jZXNzLnZlcnNpb24ucmVwbGFjZSgndicsICcnKS5zcGxpdCgnLicpXG4gIHJldHVybiB7XG4gICAgbWFqb3I6IHBhcnNlSW50KG51bWJlcnNbMF0sIDEwKSxcbiAgICBtaW5vcjogcGFyc2VJbnQobnVtYmVyc1sxXSwgMTApLFxuICAgIHBhdGNoOiBwYXJzZUludChudW1iZXJzWzJdLCAxMClcbiAgfVxufVxuXG5leHBvcnRzLnBhcmFtc0hhdmVSZXF1ZXN0Qm9keSA9IHBhcmFtc0hhdmVSZXF1ZXN0Qm9keVxuZXhwb3J0cy5zYWZlU3RyaW5naWZ5ID0gc2FmZVN0cmluZ2lmeVxuZXhwb3J0cy5tZDUgPSBtZDVcbmV4cG9ydHMuaXNSZWFkU3RyZWFtID0gaXNSZWFkU3RyZWFtXG5leHBvcnRzLnRvQmFzZTY0ID0gdG9CYXNlNjRcbmV4cG9ydHMuY29weSA9IGNvcHlcbmV4cG9ydHMudmVyc2lvbiA9IHZlcnNpb25cbmV4cG9ydHMuZGVmZXIgPSBkZWZlclxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBxcyA9IHJlcXVpcmUoJ3FzJylcbnZhciBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJylcblxuZnVuY3Rpb24gUXVlcnlzdHJpbmcgKHJlcXVlc3QpIHtcbiAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdFxuICB0aGlzLmxpYiA9IG51bGxcbiAgdGhpcy51c2VRdWVyeXN0cmluZyA9IG51bGxcbiAgdGhpcy5wYXJzZU9wdGlvbnMgPSBudWxsXG4gIHRoaXMuc3RyaW5naWZ5T3B0aW9ucyA9IG51bGxcbn1cblxuUXVlcnlzdHJpbmcucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAodGhpcy5saWIpIHsgcmV0dXJuIH1cblxuICB0aGlzLnVzZVF1ZXJ5c3RyaW5nID0gb3B0aW9ucy51c2VRdWVyeXN0cmluZ1xuICB0aGlzLmxpYiA9ICh0aGlzLnVzZVF1ZXJ5c3RyaW5nID8gcXVlcnlzdHJpbmcgOiBxcylcblxuICB0aGlzLnBhcnNlT3B0aW9ucyA9IG9wdGlvbnMucXNQYXJzZU9wdGlvbnMgfHwge31cbiAgdGhpcy5zdHJpbmdpZnlPcHRpb25zID0gb3B0aW9ucy5xc1N0cmluZ2lmeU9wdGlvbnMgfHwge31cbn1cblxuUXVlcnlzdHJpbmcucHJvdG90eXBlLnN0cmluZ2lmeSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuICh0aGlzLnVzZVF1ZXJ5c3RyaW5nKVxuICAgID8gdGhpcy5yZmMzOTg2KHRoaXMubGliLnN0cmluZ2lmeShvYmosXG4gICAgICB0aGlzLnN0cmluZ2lmeU9wdGlvbnMuc2VwIHx8IG51bGwsXG4gICAgICB0aGlzLnN0cmluZ2lmeU9wdGlvbnMuZXEgfHwgbnVsbCxcbiAgICAgIHRoaXMuc3RyaW5naWZ5T3B0aW9ucykpXG4gICAgOiB0aGlzLmxpYi5zdHJpbmdpZnkob2JqLCB0aGlzLnN0cmluZ2lmeU9wdGlvbnMpXG59XG5cblF1ZXJ5c3RyaW5nLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuICh0aGlzLnVzZVF1ZXJ5c3RyaW5nKVxuICAgID8gdGhpcy5saWIucGFyc2Uoc3RyLFxuICAgICAgdGhpcy5wYXJzZU9wdGlvbnMuc2VwIHx8IG51bGwsXG4gICAgICB0aGlzLnBhcnNlT3B0aW9ucy5lcSB8fCBudWxsLFxuICAgICAgdGhpcy5wYXJzZU9wdGlvbnMpXG4gICAgOiB0aGlzLmxpYi5wYXJzZShzdHIsIHRoaXMucGFyc2VPcHRpb25zKVxufVxuXG5RdWVyeXN0cmluZy5wcm90b3R5cGUucmZjMzk4NiA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bIScoKSpdL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgcmV0dXJuICclJyArIGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKVxuICB9KVxufVxuXG5RdWVyeXN0cmluZy5wcm90b3R5cGUudW5lc2NhcGUgPSBxdWVyeXN0cmluZy51bmVzY2FwZVxuXG5leHBvcnRzLlF1ZXJ5c3RyaW5nID0gUXVlcnlzdHJpbmdcbiIsIi8vIENvcHlyaWdodCAyMDEwLTIwMTIgTWlrZWFsIFJvZ2Vyc1xuLy9cbi8vICAgIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyAgICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyAgICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gICAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gICAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gICAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyAgICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyAgICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKVxudmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuL2xpYi9jb29raWVzJylcbnZhciBoZWxwZXJzID0gcmVxdWlyZSgnLi9saWIvaGVscGVycycpXG5cbnZhciBwYXJhbXNIYXZlUmVxdWVzdEJvZHkgPSBoZWxwZXJzLnBhcmFtc0hhdmVSZXF1ZXN0Qm9keVxuXG4vLyBvcmdhbml6ZSBwYXJhbXMgZm9yIHBhdGNoLCBwb3N0LCBwdXQsIGhlYWQsIGRlbFxuZnVuY3Rpb24gaW5pdFBhcmFtcyAodXJpLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnNcbiAgfVxuXG4gIHZhciBwYXJhbXMgPSB7fVxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgZXh0ZW5kKHBhcmFtcywgb3B0aW9ucywge3VyaTogdXJpfSlcbiAgfSBlbHNlIGlmICh0eXBlb2YgdXJpID09PSAnc3RyaW5nJykge1xuICAgIGV4dGVuZChwYXJhbXMsIHt1cmk6IHVyaX0pXG4gIH0gZWxzZSB7XG4gICAgZXh0ZW5kKHBhcmFtcywgdXJpKVxuICB9XG5cbiAgcGFyYW1zLmNhbGxiYWNrID0gY2FsbGJhY2sgfHwgcGFyYW1zLmNhbGxiYWNrXG4gIHJldHVybiBwYXJhbXNcbn1cblxuZnVuY3Rpb24gcmVxdWVzdCAodXJpLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIHVyaSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuZGVmaW5lZCBpcyBub3QgYSB2YWxpZCB1cmkgb3Igb3B0aW9ucyBvYmplY3QuJylcbiAgfVxuXG4gIHZhciBwYXJhbXMgPSBpbml0UGFyYW1zKHVyaSwgb3B0aW9ucywgY2FsbGJhY2spXG5cbiAgaWYgKHBhcmFtcy5tZXRob2QgPT09ICdIRUFEJyAmJiBwYXJhbXNIYXZlUmVxdWVzdEJvZHkocGFyYW1zKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSFRUUCBIRUFEIHJlcXVlc3RzIE1VU1QgTk9UIGluY2x1ZGUgYSByZXF1ZXN0IGJvZHkuJylcbiAgfVxuXG4gIHJldHVybiBuZXcgcmVxdWVzdC5SZXF1ZXN0KHBhcmFtcylcbn1cblxuZnVuY3Rpb24gdmVyYkZ1bmMgKHZlcmIpIHtcbiAgdmFyIG1ldGhvZCA9IHZlcmIudG9VcHBlckNhc2UoKVxuICByZXR1cm4gZnVuY3Rpb24gKHVyaSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICB2YXIgcGFyYW1zID0gaW5pdFBhcmFtcyh1cmksIG9wdGlvbnMsIGNhbGxiYWNrKVxuICAgIHBhcmFtcy5tZXRob2QgPSBtZXRob2RcbiAgICByZXR1cm4gcmVxdWVzdChwYXJhbXMsIHBhcmFtcy5jYWxsYmFjaylcbiAgfVxufVxuXG4vLyBkZWZpbmUgbGlrZSB0aGlzIHRvIHBsZWFzZSBjb2RlaW50ZWwvaW50ZWxsaXNlbnNlIElERXNcbnJlcXVlc3QuZ2V0ID0gdmVyYkZ1bmMoJ2dldCcpXG5yZXF1ZXN0LmhlYWQgPSB2ZXJiRnVuYygnaGVhZCcpXG5yZXF1ZXN0Lm9wdGlvbnMgPSB2ZXJiRnVuYygnb3B0aW9ucycpXG5yZXF1ZXN0LnBvc3QgPSB2ZXJiRnVuYygncG9zdCcpXG5yZXF1ZXN0LnB1dCA9IHZlcmJGdW5jKCdwdXQnKVxucmVxdWVzdC5wYXRjaCA9IHZlcmJGdW5jKCdwYXRjaCcpXG5yZXF1ZXN0LmRlbCA9IHZlcmJGdW5jKCdkZWxldGUnKVxucmVxdWVzdFsnZGVsZXRlJ10gPSB2ZXJiRnVuYygnZGVsZXRlJylcblxucmVxdWVzdC5qYXIgPSBmdW5jdGlvbiAoc3RvcmUpIHtcbiAgcmV0dXJuIGNvb2tpZXMuamFyKHN0b3JlKVxufVxuXG5yZXF1ZXN0LmNvb2tpZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIGNvb2tpZXMucGFyc2Uoc3RyKVxufVxuXG5mdW5jdGlvbiB3cmFwUmVxdWVzdE1ldGhvZCAobWV0aG9kLCBvcHRpb25zLCByZXF1ZXN0ZXIsIHZlcmIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh1cmksIG9wdHMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHBhcmFtcyA9IGluaXRQYXJhbXModXJpLCBvcHRzLCBjYWxsYmFjaylcblxuICAgIHZhciB0YXJnZXQgPSB7fVxuICAgIGV4dGVuZCh0cnVlLCB0YXJnZXQsIG9wdGlvbnMsIHBhcmFtcylcblxuICAgIHRhcmdldC5wb29sID0gcGFyYW1zLnBvb2wgfHwgb3B0aW9ucy5wb29sXG5cbiAgICBpZiAodmVyYikge1xuICAgICAgdGFyZ2V0Lm1ldGhvZCA9IHZlcmIudG9VcHBlckNhc2UoKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcmVxdWVzdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXRob2QgPSByZXF1ZXN0ZXJcbiAgICB9XG5cbiAgICByZXR1cm4gbWV0aG9kKHRhcmdldCwgdGFyZ2V0LmNhbGxiYWNrKVxuICB9XG59XG5cbnJlcXVlc3QuZGVmYXVsdHMgPSBmdW5jdGlvbiAob3B0aW9ucywgcmVxdWVzdGVyKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmVxdWVzdGVyID0gb3B0aW9uc1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgdmFyIGRlZmF1bHRzID0gd3JhcFJlcXVlc3RNZXRob2Qoc2VsZiwgb3B0aW9ucywgcmVxdWVzdGVyKVxuXG4gIHZhciB2ZXJicyA9IFsnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnZGVsJywgJ2RlbGV0ZSddXG4gIHZlcmJzLmZvckVhY2goZnVuY3Rpb24gKHZlcmIpIHtcbiAgICBkZWZhdWx0c1t2ZXJiXSA9IHdyYXBSZXF1ZXN0TWV0aG9kKHNlbGZbdmVyYl0sIG9wdGlvbnMsIHJlcXVlc3RlciwgdmVyYilcbiAgfSlcblxuICBkZWZhdWx0cy5jb29raWUgPSB3cmFwUmVxdWVzdE1ldGhvZChzZWxmLmNvb2tpZSwgb3B0aW9ucywgcmVxdWVzdGVyKVxuICBkZWZhdWx0cy5qYXIgPSBzZWxmLmphclxuICBkZWZhdWx0cy5kZWZhdWx0cyA9IHNlbGYuZGVmYXVsdHNcbiAgcmV0dXJuIGRlZmF1bHRzXG59XG5cbnJlcXVlc3QuZm9yZXZlciA9IGZ1bmN0aW9uIChhZ2VudE9wdGlvbnMsIG9wdGlvbnNBcmcpIHtcbiAgdmFyIG9wdGlvbnMgPSB7fVxuICBpZiAob3B0aW9uc0FyZykge1xuICAgIGV4dGVuZChvcHRpb25zLCBvcHRpb25zQXJnKVxuICB9XG4gIGlmIChhZ2VudE9wdGlvbnMpIHtcbiAgICBvcHRpb25zLmFnZW50T3B0aW9ucyA9IGFnZW50T3B0aW9uc1xuICB9XG5cbiAgb3B0aW9ucy5mb3JldmVyID0gdHJ1ZVxuICByZXR1cm4gcmVxdWVzdC5kZWZhdWx0cyhvcHRpb25zKVxufVxuXG4vLyBFeHBvcnRzXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWVzdFxucmVxdWVzdC5SZXF1ZXN0ID0gcmVxdWlyZSgnLi9yZXF1ZXN0JylcbnJlcXVlc3QuaW5pdFBhcmFtcyA9IGluaXRQYXJhbXNcblxuLy8gQmFja3dhcmRzIGNvbXBhdGliaWxpdHkgZm9yIHJlcXVlc3QuZGVidWdcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1ZXN0LCAnZGVidWcnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiByZXF1ZXN0LlJlcXVlc3QuZGVidWdcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiAoZGVidWcpIHtcbiAgICByZXF1ZXN0LlJlcXVlc3QuZGVidWcgPSBkZWJ1Z1xuICB9XG59KVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciB1dWlkID0gcmVxdWlyZSgndXVpZC92NCcpXG52YXIgQ29tYmluZWRTdHJlYW0gPSByZXF1aXJlKCdjb21iaW5lZC1zdHJlYW0nKVxudmFyIGlzc3RyZWFtID0gcmVxdWlyZSgnaXNzdHJlYW0nKVxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG5cbmZ1bmN0aW9uIE11bHRpcGFydCAocmVxdWVzdCkge1xuICB0aGlzLnJlcXVlc3QgPSByZXF1ZXN0XG4gIHRoaXMuYm91bmRhcnkgPSB1dWlkKClcbiAgdGhpcy5jaHVua2VkID0gZmFsc2VcbiAgdGhpcy5ib2R5ID0gbnVsbFxufVxuXG5NdWx0aXBhcnQucHJvdG90eXBlLmlzQ2h1bmtlZCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgY2h1bmtlZCA9IGZhbHNlXG4gIHZhciBwYXJ0cyA9IG9wdGlvbnMuZGF0YSB8fCBvcHRpb25zXG5cbiAgaWYgKCFwYXJ0cy5mb3JFYWNoKSB7XG4gICAgc2VsZi5yZXF1ZXN0LmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdBcmd1bWVudCBlcnJvciwgb3B0aW9ucy5tdWx0aXBhcnQuJykpXG4gIH1cblxuICBpZiAob3B0aW9ucy5jaHVua2VkICE9PSB1bmRlZmluZWQpIHtcbiAgICBjaHVua2VkID0gb3B0aW9ucy5jaHVua2VkXG4gIH1cblxuICBpZiAoc2VsZi5yZXF1ZXN0LmdldEhlYWRlcigndHJhbnNmZXItZW5jb2RpbmcnKSA9PT0gJ2NodW5rZWQnKSB7XG4gICAgY2h1bmtlZCA9IHRydWVcbiAgfVxuXG4gIGlmICghY2h1bmtlZCkge1xuICAgIHBhcnRzLmZvckVhY2goZnVuY3Rpb24gKHBhcnQpIHtcbiAgICAgIGlmICh0eXBlb2YgcGFydC5ib2R5ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzZWxmLnJlcXVlc3QuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ0JvZHkgYXR0cmlidXRlIG1pc3NpbmcgaW4gbXVsdGlwYXJ0LicpKVxuICAgICAgfVxuICAgICAgaWYgKGlzc3RyZWFtKHBhcnQuYm9keSkpIHtcbiAgICAgICAgY2h1bmtlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIGNodW5rZWRcbn1cblxuTXVsdGlwYXJ0LnByb3RvdHlwZS5zZXRIZWFkZXJzID0gZnVuY3Rpb24gKGNodW5rZWQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgaWYgKGNodW5rZWQgJiYgIXNlbGYucmVxdWVzdC5oYXNIZWFkZXIoJ3RyYW5zZmVyLWVuY29kaW5nJykpIHtcbiAgICBzZWxmLnJlcXVlc3Quc2V0SGVhZGVyKCd0cmFuc2Zlci1lbmNvZGluZycsICdjaHVua2VkJylcbiAgfVxuXG4gIHZhciBoZWFkZXIgPSBzZWxmLnJlcXVlc3QuZ2V0SGVhZGVyKCdjb250ZW50LXR5cGUnKVxuXG4gIGlmICghaGVhZGVyIHx8IGhlYWRlci5pbmRleE9mKCdtdWx0aXBhcnQnKSA9PT0gLTEpIHtcbiAgICBzZWxmLnJlcXVlc3Quc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnbXVsdGlwYXJ0L3JlbGF0ZWQ7IGJvdW5kYXJ5PScgKyBzZWxmLmJvdW5kYXJ5KVxuICB9IGVsc2Uge1xuICAgIGlmIChoZWFkZXIuaW5kZXhPZignYm91bmRhcnknKSAhPT0gLTEpIHtcbiAgICAgIHNlbGYuYm91bmRhcnkgPSBoZWFkZXIucmVwbGFjZSgvLipib3VuZGFyeT0oW15cXHM7XSspLiovLCAnJDEnKVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLnJlcXVlc3Quc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCBoZWFkZXIgKyAnOyBib3VuZGFyeT0nICsgc2VsZi5ib3VuZGFyeSlcbiAgICB9XG4gIH1cbn1cblxuTXVsdGlwYXJ0LnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uIChwYXJ0cywgY2h1bmtlZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIGJvZHkgPSBjaHVua2VkID8gbmV3IENvbWJpbmVkU3RyZWFtKCkgOiBbXVxuXG4gIGZ1bmN0aW9uIGFkZCAocGFydCkge1xuICAgIGlmICh0eXBlb2YgcGFydCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHBhcnQgPSBwYXJ0LnRvU3RyaW5nKClcbiAgICB9XG4gICAgcmV0dXJuIGNodW5rZWQgPyBib2R5LmFwcGVuZChwYXJ0KSA6IGJvZHkucHVzaChCdWZmZXIuZnJvbShwYXJ0KSlcbiAgfVxuXG4gIGlmIChzZWxmLnJlcXVlc3QucHJlYW1ibGVDUkxGKSB7XG4gICAgYWRkKCdcXHJcXG4nKVxuICB9XG5cbiAgcGFydHMuZm9yRWFjaChmdW5jdGlvbiAocGFydCkge1xuICAgIHZhciBwcmVhbWJsZSA9ICctLScgKyBzZWxmLmJvdW5kYXJ5ICsgJ1xcclxcbidcbiAgICBPYmplY3Qua2V5cyhwYXJ0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmIChrZXkgPT09ICdib2R5JykgeyByZXR1cm4gfVxuICAgICAgcHJlYW1ibGUgKz0ga2V5ICsgJzogJyArIHBhcnRba2V5XSArICdcXHJcXG4nXG4gICAgfSlcbiAgICBwcmVhbWJsZSArPSAnXFxyXFxuJ1xuICAgIGFkZChwcmVhbWJsZSlcbiAgICBhZGQocGFydC5ib2R5KVxuICAgIGFkZCgnXFxyXFxuJylcbiAgfSlcbiAgYWRkKCctLScgKyBzZWxmLmJvdW5kYXJ5ICsgJy0tJylcblxuICBpZiAoc2VsZi5yZXF1ZXN0LnBvc3RhbWJsZUNSTEYpIHtcbiAgICBhZGQoJ1xcclxcbicpXG4gIH1cblxuICByZXR1cm4gYm9keVxufVxuXG5NdWx0aXBhcnQucHJvdG90eXBlLm9uUmVxdWVzdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIHZhciBjaHVua2VkID0gc2VsZi5pc0NodW5rZWQob3B0aW9ucylcbiAgdmFyIHBhcnRzID0gb3B0aW9ucy5kYXRhIHx8IG9wdGlvbnNcblxuICBzZWxmLnNldEhlYWRlcnMoY2h1bmtlZClcbiAgc2VsZi5jaHVua2VkID0gY2h1bmtlZFxuICBzZWxmLmJvZHkgPSBzZWxmLmJ1aWxkKHBhcnRzLCBjaHVua2VkKVxufVxuXG5leHBvcnRzLk11bHRpcGFydCA9IE11bHRpcGFydFxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBodHRwID0gcmVxdWlyZSgnaHR0cCcpXG52YXIgaHR0cHMgPSByZXF1aXJlKCdodHRwcycpXG52YXIgdXJsID0gcmVxdWlyZSgndXJsJylcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpXG52YXIgc3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJylcbnZhciB6bGliID0gcmVxdWlyZSgnemxpYicpXG52YXIgYXdzMiA9IHJlcXVpcmUoJ2F3cy1zaWduMicpXG52YXIgYXdzNCA9IHJlcXVpcmUoJ2F3czQnKVxudmFyIGh0dHBTaWduYXR1cmUgPSByZXF1aXJlKCdodHRwLXNpZ25hdHVyZScpXG52YXIgbWltZSA9IHJlcXVpcmUoJ21pbWUtdHlwZXMnKVxudmFyIGNhc2VsZXNzID0gcmVxdWlyZSgnY2FzZWxlc3MnKVxudmFyIEZvcmV2ZXJBZ2VudCA9IHJlcXVpcmUoJ2ZvcmV2ZXItYWdlbnQnKVxudmFyIEZvcm1EYXRhID0gcmVxdWlyZSgnZm9ybS1kYXRhJylcbnZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKVxudmFyIGlzc3RyZWFtID0gcmVxdWlyZSgnaXNzdHJlYW0nKVxudmFyIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJ2lzLXR5cGVkYXJyYXknKS5zdHJpY3RcbnZhciBoZWxwZXJzID0gcmVxdWlyZSgnLi9saWIvaGVscGVycycpXG52YXIgY29va2llcyA9IHJlcXVpcmUoJy4vbGliL2Nvb2tpZXMnKVxudmFyIGdldFByb3h5RnJvbVVSSSA9IHJlcXVpcmUoJy4vbGliL2dldFByb3h5RnJvbVVSSScpXG52YXIgUXVlcnlzdHJpbmcgPSByZXF1aXJlKCcuL2xpYi9xdWVyeXN0cmluZycpLlF1ZXJ5c3RyaW5nXG52YXIgSGFyID0gcmVxdWlyZSgnLi9saWIvaGFyJykuSGFyXG52YXIgQXV0aCA9IHJlcXVpcmUoJy4vbGliL2F1dGgnKS5BdXRoXG52YXIgT0F1dGggPSByZXF1aXJlKCcuL2xpYi9vYXV0aCcpLk9BdXRoXG52YXIgaGF3ayA9IHJlcXVpcmUoJy4vbGliL2hhd2snKVxudmFyIE11bHRpcGFydCA9IHJlcXVpcmUoJy4vbGliL211bHRpcGFydCcpLk11bHRpcGFydFxudmFyIFJlZGlyZWN0ID0gcmVxdWlyZSgnLi9saWIvcmVkaXJlY3QnKS5SZWRpcmVjdFxudmFyIFR1bm5lbCA9IHJlcXVpcmUoJy4vbGliL3R1bm5lbCcpLlR1bm5lbFxudmFyIG5vdyA9IHJlcXVpcmUoJ3BlcmZvcm1hbmNlLW5vdycpXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcblxudmFyIHNhZmVTdHJpbmdpZnkgPSBoZWxwZXJzLnNhZmVTdHJpbmdpZnlcbnZhciBpc1JlYWRTdHJlYW0gPSBoZWxwZXJzLmlzUmVhZFN0cmVhbVxudmFyIHRvQmFzZTY0ID0gaGVscGVycy50b0Jhc2U2NFxudmFyIGRlZmVyID0gaGVscGVycy5kZWZlclxudmFyIGNvcHkgPSBoZWxwZXJzLmNvcHlcbnZhciB2ZXJzaW9uID0gaGVscGVycy52ZXJzaW9uXG52YXIgZ2xvYmFsQ29va2llSmFyID0gY29va2llcy5qYXIoKVxuXG52YXIgZ2xvYmFsUG9vbCA9IHt9XG5cbmZ1bmN0aW9uIGZpbHRlckZvck5vblJlc2VydmVkIChyZXNlcnZlZCwgb3B0aW9ucykge1xuICAvLyBGaWx0ZXIgb3V0IHByb3BlcnRpZXMgdGhhdCBhcmUgbm90IHJlc2VydmVkLlxuICAvLyBSZXNlcnZlZCB2YWx1ZXMgYXJlIHBhc3NlZCBpbiBhdCBjYWxsIHNpdGUuXG5cbiAgdmFyIG9iamVjdCA9IHt9XG4gIGZvciAodmFyIGkgaW4gb3B0aW9ucykge1xuICAgIHZhciBub3RSZXNlcnZlZCA9IChyZXNlcnZlZC5pbmRleE9mKGkpID09PSAtMSlcbiAgICBpZiAobm90UmVzZXJ2ZWQpIHtcbiAgICAgIG9iamVjdFtpXSA9IG9wdGlvbnNbaV1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdFxufVxuXG5mdW5jdGlvbiBmaWx0ZXJPdXRSZXNlcnZlZEZ1bmN0aW9ucyAocmVzZXJ2ZWQsIG9wdGlvbnMpIHtcbiAgLy8gRmlsdGVyIG91dCBwcm9wZXJ0aWVzIHRoYXQgYXJlIGZ1bmN0aW9ucyBhbmQgYXJlIHJlc2VydmVkLlxuICAvLyBSZXNlcnZlZCB2YWx1ZXMgYXJlIHBhc3NlZCBpbiBhdCBjYWxsIHNpdGUuXG5cbiAgdmFyIG9iamVjdCA9IHt9XG4gIGZvciAodmFyIGkgaW4gb3B0aW9ucykge1xuICAgIHZhciBpc1Jlc2VydmVkID0gIShyZXNlcnZlZC5pbmRleE9mKGkpID09PSAtMSlcbiAgICB2YXIgaXNGdW5jdGlvbiA9ICh0eXBlb2Ygb3B0aW9uc1tpXSA9PT0gJ2Z1bmN0aW9uJylcbiAgICBpZiAoIShpc1Jlc2VydmVkICYmIGlzRnVuY3Rpb24pKSB7XG4gICAgICBvYmplY3RbaV0gPSBvcHRpb25zW2ldXG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Rcbn1cblxuLy8gUmV0dXJuIGEgc2ltcGxlciByZXF1ZXN0IG9iamVjdCB0byBhbGxvdyBzZXJpYWxpemF0aW9uXG5mdW5jdGlvbiByZXF1ZXN0VG9KU09OICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHJldHVybiB7XG4gICAgdXJpOiBzZWxmLnVyaSxcbiAgICBtZXRob2Q6IHNlbGYubWV0aG9kLFxuICAgIGhlYWRlcnM6IHNlbGYuaGVhZGVyc1xuICB9XG59XG5cbi8vIFJldHVybiBhIHNpbXBsZXIgcmVzcG9uc2Ugb2JqZWN0IHRvIGFsbG93IHNlcmlhbGl6YXRpb25cbmZ1bmN0aW9uIHJlc3BvbnNlVG9KU09OICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHJldHVybiB7XG4gICAgc3RhdHVzQ29kZTogc2VsZi5zdGF0dXNDb2RlLFxuICAgIGJvZHk6IHNlbGYuYm9keSxcbiAgICBoZWFkZXJzOiBzZWxmLmhlYWRlcnMsXG4gICAgcmVxdWVzdDogcmVxdWVzdFRvSlNPTi5jYWxsKHNlbGYucmVxdWVzdClcbiAgfVxufVxuXG5mdW5jdGlvbiBSZXF1ZXN0IChvcHRpb25zKSB7XG4gIC8vIGlmIGdpdmVuIHRoZSBtZXRob2QgcHJvcGVydHkgaW4gb3B0aW9ucywgc2V0IHByb3BlcnR5IGV4cGxpY2l0TWV0aG9kIHRvIHRydWVcblxuICAvLyBleHRlbmQgdGhlIFJlcXVlc3QgaW5zdGFuY2Ugd2l0aCBhbnkgbm9uLXJlc2VydmVkIHByb3BlcnRpZXNcbiAgLy8gcmVtb3ZlIGFueSByZXNlcnZlZCBmdW5jdGlvbnMgZnJvbSB0aGUgb3B0aW9ucyBvYmplY3RcbiAgLy8gc2V0IFJlcXVlc3QgaW5zdGFuY2UgdG8gYmUgcmVhZGFibGUgYW5kIHdyaXRhYmxlXG4gIC8vIGNhbGwgaW5pdFxuXG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIC8vIHN0YXJ0IHdpdGggSEFSLCB0aGVuIG92ZXJyaWRlIHdpdGggYWRkaXRpb25hbCBvcHRpb25zXG4gIGlmIChvcHRpb25zLmhhcikge1xuICAgIHNlbGYuX2hhciA9IG5ldyBIYXIoc2VsZilcbiAgICBvcHRpb25zID0gc2VsZi5faGFyLm9wdGlvbnMob3B0aW9ucylcbiAgfVxuXG4gIHN0cmVhbS5TdHJlYW0uY2FsbChzZWxmKVxuICB2YXIgcmVzZXJ2ZWQgPSBPYmplY3Qua2V5cyhSZXF1ZXN0LnByb3RvdHlwZSlcbiAgdmFyIG5vblJlc2VydmVkID0gZmlsdGVyRm9yTm9uUmVzZXJ2ZWQocmVzZXJ2ZWQsIG9wdGlvbnMpXG5cbiAgZXh0ZW5kKHNlbGYsIG5vblJlc2VydmVkKVxuICBvcHRpb25zID0gZmlsdGVyT3V0UmVzZXJ2ZWRGdW5jdGlvbnMocmVzZXJ2ZWQsIG9wdGlvbnMpXG5cbiAgc2VsZi5yZWFkYWJsZSA9IHRydWVcbiAgc2VsZi53cml0YWJsZSA9IHRydWVcbiAgaWYgKG9wdGlvbnMubWV0aG9kKSB7XG4gICAgc2VsZi5leHBsaWNpdE1ldGhvZCA9IHRydWVcbiAgfVxuICBzZWxmLl9xcyA9IG5ldyBRdWVyeXN0cmluZyhzZWxmKVxuICBzZWxmLl9hdXRoID0gbmV3IEF1dGgoc2VsZilcbiAgc2VsZi5fb2F1dGggPSBuZXcgT0F1dGgoc2VsZilcbiAgc2VsZi5fbXVsdGlwYXJ0ID0gbmV3IE11bHRpcGFydChzZWxmKVxuICBzZWxmLl9yZWRpcmVjdCA9IG5ldyBSZWRpcmVjdChzZWxmKVxuICBzZWxmLl90dW5uZWwgPSBuZXcgVHVubmVsKHNlbGYpXG4gIHNlbGYuaW5pdChvcHRpb25zKVxufVxuXG51dGlsLmluaGVyaXRzKFJlcXVlc3QsIHN0cmVhbS5TdHJlYW0pXG5cbi8vIERlYnVnZ2luZ1xuUmVxdWVzdC5kZWJ1ZyA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgJiYgL1xcYnJlcXVlc3RcXGIvLnRlc3QocHJvY2Vzcy5lbnYuTk9ERV9ERUJVRylcbmZ1bmN0aW9uIGRlYnVnICgpIHtcbiAgaWYgKFJlcXVlc3QuZGVidWcpIHtcbiAgICBjb25zb2xlLmVycm9yKCdSRVFVRVNUICVzJywgdXRpbC5mb3JtYXQuYXBwbHkodXRpbCwgYXJndW1lbnRzKSlcbiAgfVxufVxuUmVxdWVzdC5wcm90b3R5cGUuZGVidWcgPSBkZWJ1Z1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgLy8gaW5pdCgpIGNvbnRhaW5zIGFsbCB0aGUgY29kZSB0byBzZXR1cCB0aGUgcmVxdWVzdCBvYmplY3QuXG4gIC8vIHRoZSBhY3R1YWwgb3V0Z29pbmcgcmVxdWVzdCBpcyBub3Qgc3RhcnRlZCB1bnRpbCBzdGFydCgpIGlzIGNhbGxlZFxuICAvLyB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBmcm9tIGJvdGggdGhlIGNvbnN0cnVjdG9yIGFuZCBvbiByZWRpcmVjdC5cbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG4gIHNlbGYuaGVhZGVycyA9IHNlbGYuaGVhZGVycyA/IGNvcHkoc2VsZi5oZWFkZXJzKSA6IHt9XG5cbiAgLy8gRGVsZXRlIGhlYWRlcnMgd2l0aCB2YWx1ZSB1bmRlZmluZWQgc2luY2UgdGhleSBicmVha1xuICAvLyBDbGllbnRSZXF1ZXN0Lk91dGdvaW5nTWVzc2FnZS5zZXRIZWFkZXIgaW4gbm9kZSAwLjEyXG4gIGZvciAodmFyIGhlYWRlck5hbWUgaW4gc2VsZi5oZWFkZXJzKSB7XG4gICAgaWYgKHR5cGVvZiBzZWxmLmhlYWRlcnNbaGVhZGVyTmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBkZWxldGUgc2VsZi5oZWFkZXJzW2hlYWRlck5hbWVdXG4gICAgfVxuICB9XG5cbiAgY2FzZWxlc3MuaHR0cGlmeShzZWxmLCBzZWxmLmhlYWRlcnMpXG5cbiAgaWYgKCFzZWxmLm1ldGhvZCkge1xuICAgIHNlbGYubWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgJ0dFVCdcbiAgfVxuICBpZiAoIXNlbGYubG9jYWxBZGRyZXNzKSB7XG4gICAgc2VsZi5sb2NhbEFkZHJlc3MgPSBvcHRpb25zLmxvY2FsQWRkcmVzc1xuICB9XG5cbiAgc2VsZi5fcXMuaW5pdChvcHRpb25zKVxuXG4gIGRlYnVnKG9wdGlvbnMpXG4gIGlmICghc2VsZi5wb29sICYmIHNlbGYucG9vbCAhPT0gZmFsc2UpIHtcbiAgICBzZWxmLnBvb2wgPSBnbG9iYWxQb29sXG4gIH1cbiAgc2VsZi5kZXN0cyA9IHNlbGYuZGVzdHMgfHwgW11cbiAgc2VsZi5fX2lzUmVxdWVzdFJlcXVlc3QgPSB0cnVlXG5cbiAgLy8gUHJvdGVjdCBhZ2FpbnN0IGRvdWJsZSBjYWxsYmFja1xuICBpZiAoIXNlbGYuX2NhbGxiYWNrICYmIHNlbGYuY2FsbGJhY2spIHtcbiAgICBzZWxmLl9jYWxsYmFjayA9IHNlbGYuY2FsbGJhY2tcbiAgICBzZWxmLmNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuX2NhbGxiYWNrQ2FsbGVkKSB7XG4gICAgICAgIHJldHVybiAvLyBQcmludCBhIHdhcm5pbmcgbWF5YmU/XG4gICAgICB9XG4gICAgICBzZWxmLl9jYWxsYmFja0NhbGxlZCA9IHRydWVcbiAgICAgIHNlbGYuX2NhbGxiYWNrLmFwcGx5KHNlbGYsIGFyZ3VtZW50cylcbiAgICB9XG4gICAgc2VsZi5vbignZXJyb3InLCBzZWxmLmNhbGxiYWNrLmJpbmQoKSlcbiAgICBzZWxmLm9uKCdjb21wbGV0ZScsIHNlbGYuY2FsbGJhY2suYmluZChzZWxmLCBudWxsKSlcbiAgfVxuXG4gIC8vIFBlb3BsZSB1c2UgdGhpcyBwcm9wZXJ0eSBpbnN0ZWFkIGFsbCB0aGUgdGltZSwgc28gc3VwcG9ydCBpdFxuICBpZiAoIXNlbGYudXJpICYmIHNlbGYudXJsKSB7XG4gICAgc2VsZi51cmkgPSBzZWxmLnVybFxuICAgIGRlbGV0ZSBzZWxmLnVybFxuICB9XG5cbiAgLy8gSWYgdGhlcmUncyBhIGJhc2VVcmwsIHRoZW4gdXNlIGl0IGFzIHRoZSBiYXNlIFVSTCAoaS5lLiB1cmkgbXVzdCBiZVxuICAvLyBzcGVjaWZpZWQgYXMgYSByZWxhdGl2ZSBwYXRoIGFuZCBpcyBhcHBlbmRlZCB0byBiYXNlVXJsKS5cbiAgaWYgKHNlbGYuYmFzZVVybCkge1xuICAgIGlmICh0eXBlb2Ygc2VsZi5iYXNlVXJsICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHNlbGYuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ29wdGlvbnMuYmFzZVVybCBtdXN0IGJlIGEgc3RyaW5nJykpXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzZWxmLnVyaSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBzZWxmLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdvcHRpb25zLnVyaSBtdXN0IGJlIGEgc3RyaW5nIHdoZW4gdXNpbmcgb3B0aW9ucy5iYXNlVXJsJykpXG4gICAgfVxuXG4gICAgaWYgKHNlbGYudXJpLmluZGV4T2YoJy8vJykgPT09IDAgfHwgc2VsZi51cmkuaW5kZXhPZignOi8vJykgIT09IC0xKSB7XG4gICAgICByZXR1cm4gc2VsZi5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignb3B0aW9ucy51cmkgbXVzdCBiZSBhIHBhdGggd2hlbiB1c2luZyBvcHRpb25zLmJhc2VVcmwnKSlcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgYWxsIGNhc2VzIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZXJlJ3Mgb25seSBvbmUgc2xhc2ggYmV0d2VlblxuICAgIC8vIGJhc2VVcmwgYW5kIHVyaS5cbiAgICB2YXIgYmFzZVVybEVuZHNXaXRoU2xhc2ggPSBzZWxmLmJhc2VVcmwubGFzdEluZGV4T2YoJy8nKSA9PT0gc2VsZi5iYXNlVXJsLmxlbmd0aCAtIDFcbiAgICB2YXIgdXJpU3RhcnRzV2l0aFNsYXNoID0gc2VsZi51cmkuaW5kZXhPZignLycpID09PSAwXG5cbiAgICBpZiAoYmFzZVVybEVuZHNXaXRoU2xhc2ggJiYgdXJpU3RhcnRzV2l0aFNsYXNoKSB7XG4gICAgICBzZWxmLnVyaSA9IHNlbGYuYmFzZVVybCArIHNlbGYudXJpLnNsaWNlKDEpXG4gICAgfSBlbHNlIGlmIChiYXNlVXJsRW5kc1dpdGhTbGFzaCB8fCB1cmlTdGFydHNXaXRoU2xhc2gpIHtcbiAgICAgIHNlbGYudXJpID0gc2VsZi5iYXNlVXJsICsgc2VsZi51cmlcbiAgICB9IGVsc2UgaWYgKHNlbGYudXJpID09PSAnJykge1xuICAgICAgc2VsZi51cmkgPSBzZWxmLmJhc2VVcmxcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi51cmkgPSBzZWxmLmJhc2VVcmwgKyAnLycgKyBzZWxmLnVyaVxuICAgIH1cbiAgICBkZWxldGUgc2VsZi5iYXNlVXJsXG4gIH1cblxuICAvLyBBIFVSSSBpcyBuZWVkZWQgYnkgdGhpcyBwb2ludCwgZW1pdCBlcnJvciBpZiB3ZSBoYXZlbid0IGJlZW4gYWJsZSB0byBnZXQgb25lXG4gIGlmICghc2VsZi51cmkpIHtcbiAgICByZXR1cm4gc2VsZi5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignb3B0aW9ucy51cmkgaXMgYSByZXF1aXJlZCBhcmd1bWVudCcpKVxuICB9XG5cbiAgLy8gSWYgYSBzdHJpbmcgVVJJL1VSTCB3YXMgZ2l2ZW4sIHBhcnNlIGl0IGludG8gYSBVUkwgb2JqZWN0XG4gIGlmICh0eXBlb2Ygc2VsZi51cmkgPT09ICdzdHJpbmcnKSB7XG4gICAgc2VsZi51cmkgPSB1cmwucGFyc2Uoc2VsZi51cmkpXG4gIH1cblxuICAvLyBTb21lIFVSTCBvYmplY3RzIGFyZSBub3QgZnJvbSBhIFVSTCBwYXJzZWQgc3RyaW5nIGFuZCBuZWVkIGhyZWYgYWRkZWRcbiAgaWYgKCFzZWxmLnVyaS5ocmVmKSB7XG4gICAgc2VsZi51cmkuaHJlZiA9IHVybC5mb3JtYXQoc2VsZi51cmkpXG4gIH1cblxuICAvLyBERVBSRUNBVEVEOiBXYXJuaW5nIGZvciB1c2VycyBvZiB0aGUgb2xkIFVuaXggU29ja2V0cyBVUkwgU2NoZW1lXG4gIGlmIChzZWxmLnVyaS5wcm90b2NvbCA9PT0gJ3VuaXg6Jykge1xuICAgIHJldHVybiBzZWxmLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdgdW5peDovL2AgVVJMIHNjaGVtZSBpcyBubyBsb25nZXIgc3VwcG9ydGVkLiBQbGVhc2UgdXNlIHRoZSBmb3JtYXQgYGh0dHA6Ly91bml4OlNPQ0tFVDpQQVRIYCcpKVxuICB9XG5cbiAgLy8gU3VwcG9ydCBVbml4IFNvY2tldHNcbiAgaWYgKHNlbGYudXJpLmhvc3QgPT09ICd1bml4Jykge1xuICAgIHNlbGYuZW5hYmxlVW5peFNvY2tldCgpXG4gIH1cblxuICBpZiAoc2VsZi5zdHJpY3RTU0wgPT09IGZhbHNlKSB7XG4gICAgc2VsZi5yZWplY3RVbmF1dGhvcml6ZWQgPSBmYWxzZVxuICB9XG5cbiAgaWYgKCFzZWxmLnVyaS5wYXRobmFtZSkgeyBzZWxmLnVyaS5wYXRobmFtZSA9ICcvJyB9XG5cbiAgaWYgKCEoc2VsZi51cmkuaG9zdCB8fCAoc2VsZi51cmkuaG9zdG5hbWUgJiYgc2VsZi51cmkucG9ydCkpICYmICFzZWxmLnVyaS5pc1VuaXgpIHtcbiAgICAvLyBJbnZhbGlkIFVSSTogaXQgbWF5IGdlbmVyYXRlIGxvdCBvZiBiYWQgZXJyb3JzLCBsaWtlICdUeXBlRXJyb3I6IENhbm5vdCBjYWxsIG1ldGhvZCBgaW5kZXhPZmAgb2YgdW5kZWZpbmVkJyBpbiBDb29raWVKYXJcbiAgICAvLyBEZXRlY3QgYW5kIHJlamVjdCBpdCBhcyBzb29uIGFzIHBvc3NpYmxlXG4gICAgdmFyIGZhdWx0eVVyaSA9IHVybC5mb3JtYXQoc2VsZi51cmkpXG4gICAgdmFyIG1lc3NhZ2UgPSAnSW52YWxpZCBVUkkgXCInICsgZmF1bHR5VXJpICsgJ1wiJ1xuICAgIGlmIChPYmplY3Qua2V5cyhvcHRpb25zKS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIE5vIG9wdGlvbiA/IFRoaXMgY2FuIGJlIHRoZSBzaWduIG9mIGEgcmVkaXJlY3RcbiAgICAgIC8vIEFzIHRoaXMgaXMgYSBjYXNlIHdoZXJlIHRoZSB1c2VyIGNhbm5vdCBkbyBhbnl0aGluZyAodGhleSBkaWRuJ3QgY2FsbCByZXF1ZXN0IGRpcmVjdGx5IHdpdGggdGhpcyBVUkwpXG4gICAgICAvLyB0aGV5IHNob3VsZCBiZSB3YXJuZWQgdGhhdCBpdCBjYW4gYmUgY2F1c2VkIGJ5IGEgcmVkaXJlY3Rpb24gKGNhbiBzYXZlIHNvbWUgaGFpcilcbiAgICAgIG1lc3NhZ2UgKz0gJy4gVGhpcyBjYW4gYmUgY2F1c2VkIGJ5IGEgY3JhcHB5IHJlZGlyZWN0aW9uLidcbiAgICB9XG4gICAgLy8gVGhpcyBlcnJvciB3YXMgZmF0YWxcbiAgICBzZWxmLmFib3J0KClcbiAgICByZXR1cm4gc2VsZi5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcihtZXNzYWdlKSlcbiAgfVxuXG4gIGlmICghc2VsZi5oYXNPd25Qcm9wZXJ0eSgncHJveHknKSkge1xuICAgIHNlbGYucHJveHkgPSBnZXRQcm94eUZyb21VUkkoc2VsZi51cmkpXG4gIH1cblxuICBzZWxmLnR1bm5lbCA9IHNlbGYuX3R1bm5lbC5pc0VuYWJsZWQoKVxuICBpZiAoc2VsZi5wcm94eSkge1xuICAgIHNlbGYuX3R1bm5lbC5zZXR1cChvcHRpb25zKVxuICB9XG5cbiAgc2VsZi5fcmVkaXJlY3Qub25SZXF1ZXN0KG9wdGlvbnMpXG5cbiAgc2VsZi5zZXRIb3N0ID0gZmFsc2VcbiAgaWYgKCFzZWxmLmhhc0hlYWRlcignaG9zdCcpKSB7XG4gICAgdmFyIGhvc3RIZWFkZXJOYW1lID0gc2VsZi5vcmlnaW5hbEhvc3RIZWFkZXJOYW1lIHx8ICdob3N0J1xuICAgIHNlbGYuc2V0SGVhZGVyKGhvc3RIZWFkZXJOYW1lLCBzZWxmLnVyaS5ob3N0KVxuICAgIC8vIERyb3AgOnBvcnQgc3VmZml4IGZyb20gSG9zdCBoZWFkZXIgaWYga25vd24gcHJvdG9jb2wuXG4gICAgaWYgKHNlbGYudXJpLnBvcnQpIHtcbiAgICAgIGlmICgoc2VsZi51cmkucG9ydCA9PT0gJzgwJyAmJiBzZWxmLnVyaS5wcm90b2NvbCA9PT0gJ2h0dHA6JykgfHxcbiAgICAgICAgICAoc2VsZi51cmkucG9ydCA9PT0gJzQ0MycgJiYgc2VsZi51cmkucHJvdG9jb2wgPT09ICdodHRwczonKSkge1xuICAgICAgICBzZWxmLnNldEhlYWRlcihob3N0SGVhZGVyTmFtZSwgc2VsZi51cmkuaG9zdG5hbWUpXG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYuc2V0SG9zdCA9IHRydWVcbiAgfVxuXG4gIHNlbGYuamFyKHNlbGYuX2phciB8fCBvcHRpb25zLmphcilcblxuICBpZiAoIXNlbGYudXJpLnBvcnQpIHtcbiAgICBpZiAoc2VsZi51cmkucHJvdG9jb2wgPT09ICdodHRwOicpIHsgc2VsZi51cmkucG9ydCA9IDgwIH0gZWxzZSBpZiAoc2VsZi51cmkucHJvdG9jb2wgPT09ICdodHRwczonKSB7IHNlbGYudXJpLnBvcnQgPSA0NDMgfVxuICB9XG5cbiAgaWYgKHNlbGYucHJveHkgJiYgIXNlbGYudHVubmVsKSB7XG4gICAgc2VsZi5wb3J0ID0gc2VsZi5wcm94eS5wb3J0XG4gICAgc2VsZi5ob3N0ID0gc2VsZi5wcm94eS5ob3N0bmFtZVxuICB9IGVsc2Uge1xuICAgIHNlbGYucG9ydCA9IHNlbGYudXJpLnBvcnRcbiAgICBzZWxmLmhvc3QgPSBzZWxmLnVyaS5ob3N0bmFtZVxuICB9XG5cbiAgaWYgKG9wdGlvbnMuZm9ybSkge1xuICAgIHNlbGYuZm9ybShvcHRpb25zLmZvcm0pXG4gIH1cblxuICBpZiAob3B0aW9ucy5mb3JtRGF0YSkge1xuICAgIHZhciBmb3JtRGF0YSA9IG9wdGlvbnMuZm9ybURhdGFcbiAgICB2YXIgcmVxdWVzdEZvcm0gPSBzZWxmLmZvcm0oKVxuICAgIHZhciBhcHBlbmRGb3JtVmFsdWUgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmhhc093blByb3BlcnR5KCd2YWx1ZScpICYmIHZhbHVlLmhhc093blByb3BlcnR5KCdvcHRpb25zJykpIHtcbiAgICAgICAgcmVxdWVzdEZvcm0uYXBwZW5kKGtleSwgdmFsdWUudmFsdWUsIHZhbHVlLm9wdGlvbnMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0Rm9ybS5hcHBlbmQoa2V5LCB2YWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgZm9ybUtleSBpbiBmb3JtRGF0YSkge1xuICAgICAgaWYgKGZvcm1EYXRhLmhhc093blByb3BlcnR5KGZvcm1LZXkpKSB7XG4gICAgICAgIHZhciBmb3JtVmFsdWUgPSBmb3JtRGF0YVtmb3JtS2V5XVxuICAgICAgICBpZiAoZm9ybVZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGZvcm1WYWx1ZS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgYXBwZW5kRm9ybVZhbHVlKGZvcm1LZXksIGZvcm1WYWx1ZVtqXSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXBwZW5kRm9ybVZhbHVlKGZvcm1LZXksIGZvcm1WYWx1ZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChvcHRpb25zLnFzKSB7XG4gICAgc2VsZi5xcyhvcHRpb25zLnFzKVxuICB9XG5cbiAgaWYgKHNlbGYudXJpLnBhdGgpIHtcbiAgICBzZWxmLnBhdGggPSBzZWxmLnVyaS5wYXRoXG4gIH0gZWxzZSB7XG4gICAgc2VsZi5wYXRoID0gc2VsZi51cmkucGF0aG5hbWUgKyAoc2VsZi51cmkuc2VhcmNoIHx8ICcnKVxuICB9XG5cbiAgaWYgKHNlbGYucGF0aC5sZW5ndGggPT09IDApIHtcbiAgICBzZWxmLnBhdGggPSAnLydcbiAgfVxuXG4gIC8vIEF1dGggbXVzdCBoYXBwZW4gbGFzdCBpbiBjYXNlIHNpZ25pbmcgaXMgZGVwZW5kZW50IG9uIG90aGVyIGhlYWRlcnNcbiAgaWYgKG9wdGlvbnMuYXdzKSB7XG4gICAgc2VsZi5hd3Mob3B0aW9ucy5hd3MpXG4gIH1cblxuICBpZiAob3B0aW9ucy5oYXdrKSB7XG4gICAgc2VsZi5oYXdrKG9wdGlvbnMuaGF3aylcbiAgfVxuXG4gIGlmIChvcHRpb25zLmh0dHBTaWduYXR1cmUpIHtcbiAgICBzZWxmLmh0dHBTaWduYXR1cmUob3B0aW9ucy5odHRwU2lnbmF0dXJlKVxuICB9XG5cbiAgaWYgKG9wdGlvbnMuYXV0aCkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3B0aW9ucy5hdXRoLCAndXNlcm5hbWUnKSkge1xuICAgICAgb3B0aW9ucy5hdXRoLnVzZXIgPSBvcHRpb25zLmF1dGgudXNlcm5hbWVcbiAgICB9XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvcHRpb25zLmF1dGgsICdwYXNzd29yZCcpKSB7XG4gICAgICBvcHRpb25zLmF1dGgucGFzcyA9IG9wdGlvbnMuYXV0aC5wYXNzd29yZFxuICAgIH1cblxuICAgIHNlbGYuYXV0aChcbiAgICAgIG9wdGlvbnMuYXV0aC51c2VyLFxuICAgICAgb3B0aW9ucy5hdXRoLnBhc3MsXG4gICAgICBvcHRpb25zLmF1dGguc2VuZEltbWVkaWF0ZWx5LFxuICAgICAgb3B0aW9ucy5hdXRoLmJlYXJlclxuICAgIClcbiAgfVxuXG4gIGlmIChzZWxmLmd6aXAgJiYgIXNlbGYuaGFzSGVhZGVyKCdhY2NlcHQtZW5jb2RpbmcnKSkge1xuICAgIHNlbGYuc2V0SGVhZGVyKCdhY2NlcHQtZW5jb2RpbmcnLCAnZ3ppcCwgZGVmbGF0ZScpXG4gIH1cblxuICBpZiAoc2VsZi51cmkuYXV0aCAmJiAhc2VsZi5oYXNIZWFkZXIoJ2F1dGhvcml6YXRpb24nKSkge1xuICAgIHZhciB1cmlBdXRoUGllY2VzID0gc2VsZi51cmkuYXV0aC5zcGxpdCgnOicpLm1hcChmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gc2VsZi5fcXMudW5lc2NhcGUoaXRlbSkgfSlcbiAgICBzZWxmLmF1dGgodXJpQXV0aFBpZWNlc1swXSwgdXJpQXV0aFBpZWNlcy5zbGljZSgxKS5qb2luKCc6JyksIHRydWUpXG4gIH1cblxuICBpZiAoIXNlbGYudHVubmVsICYmIHNlbGYucHJveHkgJiYgc2VsZi5wcm94eS5hdXRoICYmICFzZWxmLmhhc0hlYWRlcigncHJveHktYXV0aG9yaXphdGlvbicpKSB7XG4gICAgdmFyIHByb3h5QXV0aFBpZWNlcyA9IHNlbGYucHJveHkuYXV0aC5zcGxpdCgnOicpLm1hcChmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gc2VsZi5fcXMudW5lc2NhcGUoaXRlbSkgfSlcbiAgICB2YXIgYXV0aEhlYWRlciA9ICdCYXNpYyAnICsgdG9CYXNlNjQocHJveHlBdXRoUGllY2VzLmpvaW4oJzonKSlcbiAgICBzZWxmLnNldEhlYWRlcigncHJveHktYXV0aG9yaXphdGlvbicsIGF1dGhIZWFkZXIpXG4gIH1cblxuICBpZiAoc2VsZi5wcm94eSAmJiAhc2VsZi50dW5uZWwpIHtcbiAgICBzZWxmLnBhdGggPSAoc2VsZi51cmkucHJvdG9jb2wgKyAnLy8nICsgc2VsZi51cmkuaG9zdCArIHNlbGYucGF0aClcbiAgfVxuXG4gIGlmIChvcHRpb25zLmpzb24pIHtcbiAgICBzZWxmLmpzb24ob3B0aW9ucy5qc29uKVxuICB9XG4gIGlmIChvcHRpb25zLm11bHRpcGFydCkge1xuICAgIHNlbGYubXVsdGlwYXJ0KG9wdGlvbnMubXVsdGlwYXJ0KVxuICB9XG5cbiAgaWYgKG9wdGlvbnMudGltZSkge1xuICAgIHNlbGYudGltaW5nID0gdHJ1ZVxuXG4gICAgLy8gTk9URTogZWxhcHNlZFRpbWUgaXMgZGVwcmVjYXRlZCBpbiBmYXZvciBvZiAudGltaW5nc1xuICAgIHNlbGYuZWxhcHNlZFRpbWUgPSBzZWxmLmVsYXBzZWRUaW1lIHx8IDBcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldENvbnRlbnRMZW5ndGggKCkge1xuICAgIGlmIChpc1R5cGVkQXJyYXkoc2VsZi5ib2R5KSkge1xuICAgICAgc2VsZi5ib2R5ID0gQnVmZmVyLmZyb20oc2VsZi5ib2R5KVxuICAgIH1cblxuICAgIGlmICghc2VsZi5oYXNIZWFkZXIoJ2NvbnRlbnQtbGVuZ3RoJykpIHtcbiAgICAgIHZhciBsZW5ndGhcbiAgICAgIGlmICh0eXBlb2Ygc2VsZi5ib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzZWxmLmJvZHkpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc2VsZi5ib2R5KSkge1xuICAgICAgICBsZW5ndGggPSBzZWxmLmJvZHkucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhICsgYi5sZW5ndGggfSwgMClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlbmd0aCA9IHNlbGYuYm9keS5sZW5ndGhcbiAgICAgIH1cblxuICAgICAgaWYgKGxlbmd0aCkge1xuICAgICAgICBzZWxmLnNldEhlYWRlcignY29udGVudC1sZW5ndGgnLCBsZW5ndGgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdBcmd1bWVudCBlcnJvciwgb3B0aW9ucy5ib2R5LicpKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoc2VsZi5ib2R5ICYmICFpc3N0cmVhbShzZWxmLmJvZHkpKSB7XG4gICAgc2V0Q29udGVudExlbmd0aCgpXG4gIH1cblxuICBpZiAob3B0aW9ucy5vYXV0aCkge1xuICAgIHNlbGYub2F1dGgob3B0aW9ucy5vYXV0aClcbiAgfSBlbHNlIGlmIChzZWxmLl9vYXV0aC5wYXJhbXMgJiYgc2VsZi5oYXNIZWFkZXIoJ2F1dGhvcml6YXRpb24nKSkge1xuICAgIHNlbGYub2F1dGgoc2VsZi5fb2F1dGgucGFyYW1zKVxuICB9XG5cbiAgdmFyIHByb3RvY29sID0gc2VsZi5wcm94eSAmJiAhc2VsZi50dW5uZWwgPyBzZWxmLnByb3h5LnByb3RvY29sIDogc2VsZi51cmkucHJvdG9jb2xcbiAgdmFyIGRlZmF1bHRNb2R1bGVzID0geydodHRwOic6IGh0dHAsICdodHRwczonOiBodHRwc31cbiAgdmFyIGh0dHBNb2R1bGVzID0gc2VsZi5odHRwTW9kdWxlcyB8fCB7fVxuXG4gIHNlbGYuaHR0cE1vZHVsZSA9IGh0dHBNb2R1bGVzW3Byb3RvY29sXSB8fCBkZWZhdWx0TW9kdWxlc1twcm90b2NvbF1cblxuICBpZiAoIXNlbGYuaHR0cE1vZHVsZSkge1xuICAgIHJldHVybiBzZWxmLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdJbnZhbGlkIHByb3RvY29sOiAnICsgcHJvdG9jb2wpKVxuICB9XG5cbiAgaWYgKG9wdGlvbnMuY2EpIHtcbiAgICBzZWxmLmNhID0gb3B0aW9ucy5jYVxuICB9XG5cbiAgaWYgKCFzZWxmLmFnZW50KSB7XG4gICAgaWYgKG9wdGlvbnMuYWdlbnRPcHRpb25zKSB7XG4gICAgICBzZWxmLmFnZW50T3B0aW9ucyA9IG9wdGlvbnMuYWdlbnRPcHRpb25zXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuYWdlbnRDbGFzcykge1xuICAgICAgc2VsZi5hZ2VudENsYXNzID0gb3B0aW9ucy5hZ2VudENsYXNzXG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmZvcmV2ZXIpIHtcbiAgICAgIHZhciB2ID0gdmVyc2lvbigpXG4gICAgICAvLyB1c2UgRm9yZXZlckFnZW50IGluIG5vZGUgMC4xMC0gb25seVxuICAgICAgaWYgKHYubWFqb3IgPT09IDAgJiYgdi5taW5vciA8PSAxMCkge1xuICAgICAgICBzZWxmLmFnZW50Q2xhc3MgPSBwcm90b2NvbCA9PT0gJ2h0dHA6JyA/IEZvcmV2ZXJBZ2VudCA6IEZvcmV2ZXJBZ2VudC5TU0xcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuYWdlbnRDbGFzcyA9IHNlbGYuaHR0cE1vZHVsZS5BZ2VudFxuICAgICAgICBzZWxmLmFnZW50T3B0aW9ucyA9IHNlbGYuYWdlbnRPcHRpb25zIHx8IHt9XG4gICAgICAgIHNlbGYuYWdlbnRPcHRpb25zLmtlZXBBbGl2ZSA9IHRydWVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5hZ2VudENsYXNzID0gc2VsZi5odHRwTW9kdWxlLkFnZW50XG4gICAgfVxuICB9XG5cbiAgaWYgKHNlbGYucG9vbCA9PT0gZmFsc2UpIHtcbiAgICBzZWxmLmFnZW50ID0gZmFsc2VcbiAgfSBlbHNlIHtcbiAgICBzZWxmLmFnZW50ID0gc2VsZi5hZ2VudCB8fCBzZWxmLmdldE5ld0FnZW50KClcbiAgfVxuXG4gIHNlbGYub24oJ3BpcGUnLCBmdW5jdGlvbiAoc3JjKSB7XG4gICAgaWYgKHNlbGYubnRpY2sgJiYgc2VsZi5fc3RhcnRlZCkge1xuICAgICAgc2VsZi5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignWW91IGNhbm5vdCBwaXBlIHRvIHRoaXMgc3RyZWFtIGFmdGVyIHRoZSBvdXRib3VuZCByZXF1ZXN0IGhhcyBzdGFydGVkLicpKVxuICAgIH1cbiAgICBzZWxmLnNyYyA9IHNyY1xuICAgIGlmIChpc1JlYWRTdHJlYW0oc3JjKSkge1xuICAgICAgaWYgKCFzZWxmLmhhc0hlYWRlcignY29udGVudC10eXBlJykpIHtcbiAgICAgICAgc2VsZi5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsIG1pbWUubG9va3VwKHNyYy5wYXRoKSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHNyYy5oZWFkZXJzKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gc3JjLmhlYWRlcnMpIHtcbiAgICAgICAgICBpZiAoIXNlbGYuaGFzSGVhZGVyKGkpKSB7XG4gICAgICAgICAgICBzZWxmLnNldEhlYWRlcihpLCBzcmMuaGVhZGVyc1tpXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzZWxmLl9qc29uICYmICFzZWxmLmhhc0hlYWRlcignY29udGVudC10eXBlJykpIHtcbiAgICAgICAgc2VsZi5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJylcbiAgICAgIH1cbiAgICAgIGlmIChzcmMubWV0aG9kICYmICFzZWxmLmV4cGxpY2l0TWV0aG9kKSB7XG4gICAgICAgIHNlbGYubWV0aG9kID0gc3JjLm1ldGhvZFxuICAgICAgfVxuICAgIH1cblxuICAvLyBzZWxmLm9uKCdwaXBlJywgZnVuY3Rpb24gKCkge1xuICAvLyAgIGNvbnNvbGUuZXJyb3IoJ1lvdSBoYXZlIGFscmVhZHkgcGlwZWQgdG8gdGhpcyBzdHJlYW0uIFBpcGVpbmcgdHdpY2UgaXMgbGlrZWx5IHRvIGJyZWFrIHRoZSByZXF1ZXN0LicpXG4gIC8vIH0pXG4gIH0pXG5cbiAgZGVmZXIoZnVuY3Rpb24gKCkge1xuICAgIGlmIChzZWxmLl9hYm9ydGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgZW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuX2Zvcm0pIHtcbiAgICAgICAgaWYgKCFzZWxmLl9hdXRoLmhhc0F1dGgpIHtcbiAgICAgICAgICBzZWxmLl9mb3JtLnBpcGUoc2VsZilcbiAgICAgICAgfSBlbHNlIGlmIChzZWxmLl9hdXRoLmhhc0F1dGggJiYgc2VsZi5fYXV0aC5zZW50QXV0aCkge1xuICAgICAgICAgIHNlbGYuX2Zvcm0ucGlwZShzZWxmKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc2VsZi5fbXVsdGlwYXJ0ICYmIHNlbGYuX211bHRpcGFydC5jaHVua2VkKSB7XG4gICAgICAgIHNlbGYuX211bHRpcGFydC5ib2R5LnBpcGUoc2VsZilcbiAgICAgIH1cbiAgICAgIGlmIChzZWxmLmJvZHkpIHtcbiAgICAgICAgaWYgKGlzc3RyZWFtKHNlbGYuYm9keSkpIHtcbiAgICAgICAgICBzZWxmLmJvZHkucGlwZShzZWxmKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldENvbnRlbnRMZW5ndGgoKVxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHNlbGYuYm9keSkpIHtcbiAgICAgICAgICAgIHNlbGYuYm9keS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgICAgICAgIHNlbGYud3JpdGUocGFydClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYud3JpdGUoc2VsZi5ib2R5KVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLmVuZCgpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc2VsZi5yZXF1ZXN0Qm9keVN0cmVhbSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ29wdGlvbnMucmVxdWVzdEJvZHlTdHJlYW0gaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHBhc3MgdGhlIHJlcXVlc3Qgb2JqZWN0IHRvIHN0cmVhbS5waXBlLicpXG4gICAgICAgIHNlbGYucmVxdWVzdEJvZHlTdHJlYW0ucGlwZShzZWxmKVxuICAgICAgfSBlbHNlIGlmICghc2VsZi5zcmMpIHtcbiAgICAgICAgaWYgKHNlbGYuX2F1dGguaGFzQXV0aCAmJiAhc2VsZi5fYXV0aC5zZW50QXV0aCkge1xuICAgICAgICAgIHNlbGYuZW5kKClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZi5tZXRob2QgIT09ICdHRVQnICYmIHR5cGVvZiBzZWxmLm1ldGhvZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBzZWxmLnNldEhlYWRlcignY29udGVudC1sZW5ndGgnLCAwKVxuICAgICAgICB9XG4gICAgICAgIHNlbGYuZW5kKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5fZm9ybSAmJiAhc2VsZi5oYXNIZWFkZXIoJ2NvbnRlbnQtbGVuZ3RoJykpIHtcbiAgICAgIC8vIEJlZm9yZSBlbmRpbmcgdGhlIHJlcXVlc3QsIHdlIGhhZCB0byBjb21wdXRlIHRoZSBsZW5ndGggb2YgdGhlIHdob2xlIGZvcm0sIGFzeW5jbHlcbiAgICAgIHNlbGYuc2V0SGVhZGVyKHNlbGYuX2Zvcm0uZ2V0SGVhZGVycygpLCB0cnVlKVxuICAgICAgc2VsZi5fZm9ybS5nZXRMZW5ndGgoZnVuY3Rpb24gKGVyciwgbGVuZ3RoKSB7XG4gICAgICAgIGlmICghZXJyICYmICFpc05hTihsZW5ndGgpKSB7XG4gICAgICAgICAgc2VsZi5zZXRIZWFkZXIoJ2NvbnRlbnQtbGVuZ3RoJywgbGVuZ3RoKVxuICAgICAgICB9XG4gICAgICAgIGVuZCgpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBlbmQoKVxuICAgIH1cblxuICAgIHNlbGYubnRpY2sgPSB0cnVlXG4gIH0pXG59XG5cblJlcXVlc3QucHJvdG90eXBlLmdldE5ld0FnZW50ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIEFnZW50ID0gc2VsZi5hZ2VudENsYXNzXG4gIHZhciBvcHRpb25zID0ge31cbiAgaWYgKHNlbGYuYWdlbnRPcHRpb25zKSB7XG4gICAgZm9yICh2YXIgaSBpbiBzZWxmLmFnZW50T3B0aW9ucykge1xuICAgICAgb3B0aW9uc1tpXSA9IHNlbGYuYWdlbnRPcHRpb25zW2ldXG4gICAgfVxuICB9XG4gIGlmIChzZWxmLmNhKSB7XG4gICAgb3B0aW9ucy5jYSA9IHNlbGYuY2FcbiAgfVxuICBpZiAoc2VsZi5jaXBoZXJzKSB7XG4gICAgb3B0aW9ucy5jaXBoZXJzID0gc2VsZi5jaXBoZXJzXG4gIH1cbiAgaWYgKHNlbGYuc2VjdXJlUHJvdG9jb2wpIHtcbiAgICBvcHRpb25zLnNlY3VyZVByb3RvY29sID0gc2VsZi5zZWN1cmVQcm90b2NvbFxuICB9XG4gIGlmIChzZWxmLnNlY3VyZU9wdGlvbnMpIHtcbiAgICBvcHRpb25zLnNlY3VyZU9wdGlvbnMgPSBzZWxmLnNlY3VyZU9wdGlvbnNcbiAgfVxuICBpZiAodHlwZW9mIHNlbGYucmVqZWN0VW5hdXRob3JpemVkICE9PSAndW5kZWZpbmVkJykge1xuICAgIG9wdGlvbnMucmVqZWN0VW5hdXRob3JpemVkID0gc2VsZi5yZWplY3RVbmF1dGhvcml6ZWRcbiAgfVxuXG4gIGlmIChzZWxmLmNlcnQgJiYgc2VsZi5rZXkpIHtcbiAgICBvcHRpb25zLmtleSA9IHNlbGYua2V5XG4gICAgb3B0aW9ucy5jZXJ0ID0gc2VsZi5jZXJ0XG4gIH1cblxuICBpZiAoc2VsZi5wZngpIHtcbiAgICBvcHRpb25zLnBmeCA9IHNlbGYucGZ4XG4gIH1cblxuICBpZiAoc2VsZi5wYXNzcGhyYXNlKSB7XG4gICAgb3B0aW9ucy5wYXNzcGhyYXNlID0gc2VsZi5wYXNzcGhyYXNlXG4gIH1cblxuICB2YXIgcG9vbEtleSA9ICcnXG5cbiAgLy8gZGlmZmVyZW50IHR5cGVzIG9mIGFnZW50cyBhcmUgaW4gZGlmZmVyZW50IHBvb2xzXG4gIGlmIChBZ2VudCAhPT0gc2VsZi5odHRwTW9kdWxlLkFnZW50KSB7XG4gICAgcG9vbEtleSArPSBBZ2VudC5uYW1lXG4gIH1cblxuICAvLyBjYSBvcHRpb24gaXMgb25seSByZWxldmFudCBpZiBwcm94eSBvciBkZXN0aW5hdGlvbiBhcmUgaHR0cHNcbiAgdmFyIHByb3h5ID0gc2VsZi5wcm94eVxuICBpZiAodHlwZW9mIHByb3h5ID09PSAnc3RyaW5nJykge1xuICAgIHByb3h5ID0gdXJsLnBhcnNlKHByb3h5KVxuICB9XG4gIHZhciBpc0h0dHBzID0gKHByb3h5ICYmIHByb3h5LnByb3RvY29sID09PSAnaHR0cHM6JykgfHwgdGhpcy51cmkucHJvdG9jb2wgPT09ICdodHRwczonXG5cbiAgaWYgKGlzSHR0cHMpIHtcbiAgICBpZiAob3B0aW9ucy5jYSkge1xuICAgICAgaWYgKHBvb2xLZXkpIHtcbiAgICAgICAgcG9vbEtleSArPSAnOidcbiAgICAgIH1cbiAgICAgIHBvb2xLZXkgKz0gb3B0aW9ucy5jYVxuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5yZWplY3RVbmF1dGhvcml6ZWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAocG9vbEtleSkge1xuICAgICAgICBwb29sS2V5ICs9ICc6J1xuICAgICAgfVxuICAgICAgcG9vbEtleSArPSBvcHRpb25zLnJlamVjdFVuYXV0aG9yaXplZFxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmNlcnQpIHtcbiAgICAgIGlmIChwb29sS2V5KSB7XG4gICAgICAgIHBvb2xLZXkgKz0gJzonXG4gICAgICB9XG4gICAgICBwb29sS2V5ICs9IG9wdGlvbnMuY2VydC50b1N0cmluZygnYXNjaWknKSArIG9wdGlvbnMua2V5LnRvU3RyaW5nKCdhc2NpaScpXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMucGZ4KSB7XG4gICAgICBpZiAocG9vbEtleSkge1xuICAgICAgICBwb29sS2V5ICs9ICc6J1xuICAgICAgfVxuICAgICAgcG9vbEtleSArPSBvcHRpb25zLnBmeC50b1N0cmluZygnYXNjaWknKVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmNpcGhlcnMpIHtcbiAgICAgIGlmIChwb29sS2V5KSB7XG4gICAgICAgIHBvb2xLZXkgKz0gJzonXG4gICAgICB9XG4gICAgICBwb29sS2V5ICs9IG9wdGlvbnMuY2lwaGVyc1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnNlY3VyZVByb3RvY29sKSB7XG4gICAgICBpZiAocG9vbEtleSkge1xuICAgICAgICBwb29sS2V5ICs9ICc6J1xuICAgICAgfVxuICAgICAgcG9vbEtleSArPSBvcHRpb25zLnNlY3VyZVByb3RvY29sXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc2VjdXJlT3B0aW9ucykge1xuICAgICAgaWYgKHBvb2xLZXkpIHtcbiAgICAgICAgcG9vbEtleSArPSAnOidcbiAgICAgIH1cbiAgICAgIHBvb2xLZXkgKz0gb3B0aW9ucy5zZWN1cmVPcHRpb25zXG4gICAgfVxuICB9XG5cbiAgaWYgKHNlbGYucG9vbCA9PT0gZ2xvYmFsUG9vbCAmJiAhcG9vbEtleSAmJiBPYmplY3Qua2V5cyhvcHRpb25zKS5sZW5ndGggPT09IDAgJiYgc2VsZi5odHRwTW9kdWxlLmdsb2JhbEFnZW50KSB7XG4gICAgLy8gbm90IGRvaW5nIGFueXRoaW5nIHNwZWNpYWwuICBVc2UgdGhlIGdsb2JhbEFnZW50XG4gICAgcmV0dXJuIHNlbGYuaHR0cE1vZHVsZS5nbG9iYWxBZ2VudFxuICB9XG5cbiAgLy8gd2UncmUgdXNpbmcgYSBzdG9yZWQgYWdlbnQuICBNYWtlIHN1cmUgaXQncyBwcm90b2NvbC1zcGVjaWZpY1xuICBwb29sS2V5ID0gc2VsZi51cmkucHJvdG9jb2wgKyBwb29sS2V5XG5cbiAgLy8gZ2VuZXJhdGUgYSBuZXcgYWdlbnQgZm9yIHRoaXMgc2V0dGluZyBpZiBub25lIHlldCBleGlzdHNcbiAgaWYgKCFzZWxmLnBvb2xbcG9vbEtleV0pIHtcbiAgICBzZWxmLnBvb2xbcG9vbEtleV0gPSBuZXcgQWdlbnQob3B0aW9ucylcbiAgICAvLyBwcm9wZXJseSBzZXQgbWF4U29ja2V0cyBvbiBuZXcgYWdlbnRzXG4gICAgaWYgKHNlbGYucG9vbC5tYXhTb2NrZXRzKSB7XG4gICAgICBzZWxmLnBvb2xbcG9vbEtleV0ubWF4U29ja2V0cyA9IHNlbGYucG9vbC5tYXhTb2NrZXRzXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNlbGYucG9vbFtwb29sS2V5XVxufVxuXG5SZXF1ZXN0LnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gc3RhcnQoKSBpcyBjYWxsZWQgb25jZSB3ZSBhcmUgcmVhZHkgdG8gc2VuZCB0aGUgb3V0Z29pbmcgSFRUUCByZXF1ZXN0LlxuICAvLyB0aGlzIGlzIHVzdWFsbHkgY2FsbGVkIG9uIHRoZSBmaXJzdCB3cml0ZSgpLCBlbmQoKSBvciBvbiBuZXh0VGljaygpXG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGlmIChzZWxmLnRpbWluZykge1xuICAgIC8vIEFsbCB0aW1pbmdzIHdpbGwgYmUgcmVsYXRpdmUgdG8gdGhpcyByZXF1ZXN0J3Mgc3RhcnRUaW1lLiAgSW4gb3JkZXIgdG8gZG8gdGhpcyxcbiAgICAvLyB3ZSBuZWVkIHRvIGNhcHR1cmUgdGhlIHdhbGwtY2xvY2sgc3RhcnQgdGltZSAodmlhIERhdGUpLCBpbW1lZGlhdGVseSBmb2xsb3dlZFxuICAgIC8vIGJ5IHRoZSBoaWdoLXJlc29sdXRpb24gdGltZXIgKHZpYSBub3coKSkuICBXaGlsZSB0aGVzZSB0d28gd29uJ3QgYmUgc2V0XG4gICAgLy8gYXQgdGhlIF9leGFjdF8gc2FtZSB0aW1lLCB0aGV5IHNob3VsZCBiZSBjbG9zZSBlbm91Z2ggdG8gYmUgYWJsZSB0byBjYWxjdWxhdGVcbiAgICAvLyBoaWdoLXJlc29sdXRpb24sIG1vbm90b25pY2FsbHkgbm9uLWRlY3JlYXNpbmcgdGltZXN0YW1wcyByZWxhdGl2ZSB0byBzdGFydFRpbWUuXG4gICAgdmFyIHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgdmFyIHN0YXJ0VGltZU5vdyA9IG5vdygpXG4gIH1cblxuICBpZiAoc2VsZi5fYWJvcnRlZCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgc2VsZi5fc3RhcnRlZCA9IHRydWVcbiAgc2VsZi5tZXRob2QgPSBzZWxmLm1ldGhvZCB8fCAnR0VUJ1xuICBzZWxmLmhyZWYgPSBzZWxmLnVyaS5ocmVmXG5cbiAgaWYgKHNlbGYuc3JjICYmIHNlbGYuc3JjLnN0YXQgJiYgc2VsZi5zcmMuc3RhdC5zaXplICYmICFzZWxmLmhhc0hlYWRlcignY29udGVudC1sZW5ndGgnKSkge1xuICAgIHNlbGYuc2V0SGVhZGVyKCdjb250ZW50LWxlbmd0aCcsIHNlbGYuc3JjLnN0YXQuc2l6ZSlcbiAgfVxuICBpZiAoc2VsZi5fYXdzKSB7XG4gICAgc2VsZi5hd3Moc2VsZi5fYXdzLCB0cnVlKVxuICB9XG5cbiAgLy8gV2UgaGF2ZSBhIG1ldGhvZCBuYW1lZCBhdXRoLCB3aGljaCBpcyBjb21wbGV0ZWx5IGRpZmZlcmVudCBmcm9tIHRoZSBodHRwLnJlcXVlc3RcbiAgLy8gYXV0aCBvcHRpb24uICBJZiB3ZSBkb24ndCByZW1vdmUgaXQsIHdlJ3JlIGdvbm5hIGhhdmUgYSBiYWQgdGltZS5cbiAgdmFyIHJlcU9wdGlvbnMgPSBjb3B5KHNlbGYpXG4gIGRlbGV0ZSByZXFPcHRpb25zLmF1dGhcblxuICBkZWJ1ZygnbWFrZSByZXF1ZXN0Jywgc2VsZi51cmkuaHJlZilcblxuICAvLyBub2RlIHY2LjguMCBub3cgc3VwcG9ydHMgYSBgdGltZW91dGAgdmFsdWUgaW4gYGh0dHAucmVxdWVzdCgpYCwgYnV0IHdlXG4gIC8vIHNob3VsZCBkZWxldGUgaXQgZm9yIG5vdyBzaW5jZSB3ZSBoYW5kbGUgdGltZW91dHMgbWFudWFsbHkgZm9yIGJldHRlclxuICAvLyBjb25zaXN0ZW5jeSB3aXRoIG5vZGUgdmVyc2lvbnMgYmVmb3JlIHY2LjguMFxuICBkZWxldGUgcmVxT3B0aW9ucy50aW1lb3V0XG5cbiAgdHJ5IHtcbiAgICBzZWxmLnJlcSA9IHNlbGYuaHR0cE1vZHVsZS5yZXF1ZXN0KHJlcU9wdGlvbnMpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAoc2VsZi50aW1pbmcpIHtcbiAgICBzZWxmLnN0YXJ0VGltZSA9IHN0YXJ0VGltZVxuICAgIHNlbGYuc3RhcnRUaW1lTm93ID0gc3RhcnRUaW1lTm93XG5cbiAgICAvLyBUaW1pbmcgdmFsdWVzIHdpbGwgYWxsIGJlIHJlbGF0aXZlIHRvIHN0YXJ0VGltZSAoYnkgY29tcGFyaW5nIHRvIHN0YXJ0VGltZU5vd1xuICAgIC8vIHNvIHdlIGhhdmUgYW4gYWNjdXJhdGUgY2xvY2spXG4gICAgc2VsZi50aW1pbmdzID0ge31cbiAgfVxuXG4gIHZhciB0aW1lb3V0XG4gIGlmIChzZWxmLnRpbWVvdXQgJiYgIXNlbGYudGltZW91dFRpbWVyKSB7XG4gICAgaWYgKHNlbGYudGltZW91dCA8IDApIHtcbiAgICAgIHRpbWVvdXQgPSAwXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZi50aW1lb3V0ID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZShzZWxmLnRpbWVvdXQpKSB7XG4gICAgICB0aW1lb3V0ID0gc2VsZi50aW1lb3V0XG4gICAgfVxuICB9XG5cbiAgc2VsZi5yZXEub24oJ3Jlc3BvbnNlJywgc2VsZi5vblJlcXVlc3RSZXNwb25zZS5iaW5kKHNlbGYpKVxuICBzZWxmLnJlcS5vbignZXJyb3InLCBzZWxmLm9uUmVxdWVzdEVycm9yLmJpbmQoc2VsZikpXG4gIHNlbGYucmVxLm9uKCdkcmFpbicsIGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLmVtaXQoJ2RyYWluJylcbiAgfSlcblxuICBzZWxmLnJlcS5vbignc29ja2V0JywgZnVuY3Rpb24gKHNvY2tldCkge1xuICAgIC8vIGAuX2Nvbm5lY3RpbmdgIHdhcyB0aGUgb2xkIHByb3BlcnR5IHdoaWNoIHdhcyBtYWRlIHB1YmxpYyBpbiBub2RlIHY2LjEuMFxuICAgIHZhciBpc0Nvbm5lY3RpbmcgPSBzb2NrZXQuX2Nvbm5lY3RpbmcgfHwgc29ja2V0LmNvbm5lY3RpbmdcbiAgICBpZiAoc2VsZi50aW1pbmcpIHtcbiAgICAgIHNlbGYudGltaW5ncy5zb2NrZXQgPSBub3coKSAtIHNlbGYuc3RhcnRUaW1lTm93XG5cbiAgICAgIGlmIChpc0Nvbm5lY3RpbmcpIHtcbiAgICAgICAgdmFyIG9uTG9va3VwVGltaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYudGltaW5ncy5sb29rdXAgPSBub3coKSAtIHNlbGYuc3RhcnRUaW1lTm93XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb25Db25uZWN0VGltaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYudGltaW5ncy5jb25uZWN0ID0gbm93KCkgLSBzZWxmLnN0YXJ0VGltZU5vd1xuICAgICAgICB9XG5cbiAgICAgICAgc29ja2V0Lm9uY2UoJ2xvb2t1cCcsIG9uTG9va3VwVGltaW5nKVxuICAgICAgICBzb2NrZXQub25jZSgnY29ubmVjdCcsIG9uQ29ubmVjdFRpbWluZylcblxuICAgICAgICAvLyBjbGVhbiB1cCB0aW1pbmcgZXZlbnQgbGlzdGVuZXJzIGlmIG5lZWRlZCBvbiBlcnJvclxuICAgICAgICBzZWxmLnJlcS5vbmNlKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2xvb2t1cCcsIG9uTG9va3VwVGltaW5nKVxuICAgICAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignY29ubmVjdCcsIG9uQ29ubmVjdFRpbWluZylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc2V0UmVxVGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFRoaXMgdGltZW91dCBzZXRzIHRoZSBhbW91bnQgb2YgdGltZSB0byB3YWl0ICpiZXR3ZWVuKiBieXRlcyBzZW50XG4gICAgICAvLyBmcm9tIHRoZSBzZXJ2ZXIgb25jZSBjb25uZWN0ZWQuXG4gICAgICAvL1xuICAgICAgLy8gSW4gcGFydGljdWxhciwgaXQncyB1c2VmdWwgZm9yIGVycm9yaW5nIGlmIHRoZSBzZXJ2ZXIgZmFpbHMgdG8gc2VuZFxuICAgICAgLy8gZGF0YSBoYWxmd2F5IHRocm91Z2ggc3RyZWFtaW5nIGEgcmVzcG9uc2UuXG4gICAgICBzZWxmLnJlcS5zZXRUaW1lb3V0KHRpbWVvdXQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHNlbGYucmVxKSB7XG4gICAgICAgICAgc2VsZi5hYm9ydCgpXG4gICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoJ0VTT0NLRVRUSU1FRE9VVCcpXG4gICAgICAgICAgZS5jb2RlID0gJ0VTT0NLRVRUSU1FRE9VVCdcbiAgICAgICAgICBlLmNvbm5lY3QgPSBmYWxzZVxuICAgICAgICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAodGltZW91dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBPbmx5IHN0YXJ0IHRoZSBjb25uZWN0aW9uIHRpbWVyIGlmIHdlJ3JlIGFjdHVhbGx5IGNvbm5lY3RpbmcgYSBuZXdcbiAgICAgIC8vIHNvY2tldCwgb3RoZXJ3aXNlIGlmIHdlJ3JlIGFscmVhZHkgY29ubmVjdGVkIChiZWNhdXNlIHRoaXMgaXMgYVxuICAgICAgLy8ga2VlcC1hbGl2ZSBjb25uZWN0aW9uKSBkbyBub3QgYm90aGVyLiBUaGlzIGlzIGltcG9ydGFudCBzaW5jZSB3ZSB3b24ndFxuICAgICAgLy8gZ2V0IGEgJ2Nvbm5lY3QnIGV2ZW50IGZvciBhbiBhbHJlYWR5IGNvbm5lY3RlZCBzb2NrZXQuXG4gICAgICBpZiAoaXNDb25uZWN0aW5nKSB7XG4gICAgICAgIHZhciBvblJlcVNvY2tDb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignY29ubmVjdCcsIG9uUmVxU29ja0Nvbm5lY3QpXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dFRpbWVyKVxuICAgICAgICAgIHNlbGYudGltZW91dFRpbWVyID0gbnVsbFxuICAgICAgICAgIHNldFJlcVRpbWVvdXQoKVxuICAgICAgICB9XG5cbiAgICAgICAgc29ja2V0Lm9uKCdjb25uZWN0Jywgb25SZXFTb2NrQ29ubmVjdClcblxuICAgICAgICBzZWxmLnJlcS5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaGFuZGxlLWNhbGxiYWNrLWVyclxuICAgICAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignY29ubmVjdCcsIG9uUmVxU29ja0Nvbm5lY3QpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gU2V0IGEgdGltZW91dCBpbiBtZW1vcnkgLSB0aGlzIGJsb2NrIHdpbGwgdGhyb3cgaWYgdGhlIHNlcnZlciB0YWtlcyBtb3JlXG4gICAgICAgIC8vIHRoYW4gYHRpbWVvdXRgIHRvIHdyaXRlIHRoZSBIVFRQIHN0YXR1cyBhbmQgaGVhZGVycyAoY29ycmVzcG9uZGluZyB0b1xuICAgICAgICAvLyB0aGUgb24oJ3Jlc3BvbnNlJykgZXZlbnQgb24gdGhlIGNsaWVudCkuIE5COiB0aGlzIG1lYXN1cmVzIHdhbGwtY2xvY2tcbiAgICAgICAgLy8gdGltZSwgbm90IHRoZSB0aW1lIGJldHdlZW4gYnl0ZXMgc2VudCBieSB0aGUgc2VydmVyLlxuICAgICAgICBzZWxmLnRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignY29ubmVjdCcsIG9uUmVxU29ja0Nvbm5lY3QpXG4gICAgICAgICAgc2VsZi5hYm9ydCgpXG4gICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoJ0VUSU1FRE9VVCcpXG4gICAgICAgICAgZS5jb2RlID0gJ0VUSU1FRE9VVCdcbiAgICAgICAgICBlLmNvbm5lY3QgPSB0cnVlXG4gICAgICAgICAgc2VsZi5lbWl0KCdlcnJvcicsIGUpXG4gICAgICAgIH0sIHRpbWVvdXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBXZSdyZSBhbHJlYWR5IGNvbm5lY3RlZFxuICAgICAgICBzZXRSZXFUaW1lb3V0KClcbiAgICAgIH1cbiAgICB9XG4gICAgc2VsZi5lbWl0KCdzb2NrZXQnLCBzb2NrZXQpXG4gIH0pXG5cbiAgc2VsZi5lbWl0KCdyZXF1ZXN0Jywgc2VsZi5yZXEpXG59XG5cblJlcXVlc3QucHJvdG90eXBlLm9uUmVxdWVzdEVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBpZiAoc2VsZi5fYWJvcnRlZCkge1xuICAgIHJldHVyblxuICB9XG4gIGlmIChzZWxmLnJlcSAmJiBzZWxmLnJlcS5fcmV1c2VkU29ja2V0ICYmIGVycm9yLmNvZGUgPT09ICdFQ09OTlJFU0VUJyAmJlxuICAgIHNlbGYuYWdlbnQuYWRkUmVxdWVzdE5vcmV1c2UpIHtcbiAgICBzZWxmLmFnZW50ID0geyBhZGRSZXF1ZXN0OiBzZWxmLmFnZW50LmFkZFJlcXVlc3ROb3JldXNlLmJpbmQoc2VsZi5hZ2VudCkgfVxuICAgIHNlbGYuc3RhcnQoKVxuICAgIHNlbGYucmVxLmVuZCgpXG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKHNlbGYudGltZW91dCAmJiBzZWxmLnRpbWVvdXRUaW1lcikge1xuICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXRUaW1lcilcbiAgICBzZWxmLnRpbWVvdXRUaW1lciA9IG51bGxcbiAgfVxuICBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyb3IpXG59XG5cblJlcXVlc3QucHJvdG90eXBlLm9uUmVxdWVzdFJlc3BvbnNlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGlmIChzZWxmLnRpbWluZykge1xuICAgIHNlbGYudGltaW5ncy5yZXNwb25zZSA9IG5vdygpIC0gc2VsZi5zdGFydFRpbWVOb3dcbiAgfVxuXG4gIGRlYnVnKCdvblJlcXVlc3RSZXNwb25zZScsIHNlbGYudXJpLmhyZWYsIHJlc3BvbnNlLnN0YXR1c0NvZGUsIHJlc3BvbnNlLmhlYWRlcnMpXG4gIHJlc3BvbnNlLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNlbGYudGltaW5nKSB7XG4gICAgICBzZWxmLnRpbWluZ3MuZW5kID0gbm93KCkgLSBzZWxmLnN0YXJ0VGltZU5vd1xuICAgICAgcmVzcG9uc2UudGltaW5nU3RhcnQgPSBzZWxmLnN0YXJ0VGltZVxuXG4gICAgICAvLyBmaWxsIGluIHRoZSBibGFua3MgZm9yIGFueSBwZXJpb2RzIHRoYXQgZGlkbid0IHRyaWdnZXIsIHN1Y2ggYXNcbiAgICAgIC8vIG5vIGxvb2t1cCBvciBjb25uZWN0IGR1ZSB0byBrZWVwIGFsaXZlXG4gICAgICBpZiAoIXNlbGYudGltaW5ncy5zb2NrZXQpIHtcbiAgICAgICAgc2VsZi50aW1pbmdzLnNvY2tldCA9IDBcbiAgICAgIH1cbiAgICAgIGlmICghc2VsZi50aW1pbmdzLmxvb2t1cCkge1xuICAgICAgICBzZWxmLnRpbWluZ3MubG9va3VwID0gc2VsZi50aW1pbmdzLnNvY2tldFxuICAgICAgfVxuICAgICAgaWYgKCFzZWxmLnRpbWluZ3MuY29ubmVjdCkge1xuICAgICAgICBzZWxmLnRpbWluZ3MuY29ubmVjdCA9IHNlbGYudGltaW5ncy5sb29rdXBcbiAgICAgIH1cbiAgICAgIGlmICghc2VsZi50aW1pbmdzLnJlc3BvbnNlKSB7XG4gICAgICAgIHNlbGYudGltaW5ncy5yZXNwb25zZSA9IHNlbGYudGltaW5ncy5jb25uZWN0XG4gICAgICB9XG5cbiAgICAgIGRlYnVnKCdlbGFwc2VkIHRpbWUnLCBzZWxmLnRpbWluZ3MuZW5kKVxuXG4gICAgICAvLyBlbGFwc2VkVGltZSBpbmNsdWRlcyBhbGwgcmVkaXJlY3RzXG4gICAgICBzZWxmLmVsYXBzZWRUaW1lICs9IE1hdGgucm91bmQoc2VsZi50aW1pbmdzLmVuZClcblxuICAgICAgLy8gTk9URTogZWxhcHNlZFRpbWUgaXMgZGVwcmVjYXRlZCBpbiBmYXZvciBvZiAudGltaW5nc1xuICAgICAgcmVzcG9uc2UuZWxhcHNlZFRpbWUgPSBzZWxmLmVsYXBzZWRUaW1lXG5cbiAgICAgIC8vIHRpbWluZ3MgaXMganVzdCBmb3IgdGhlIGZpbmFsIGZldGNoXG4gICAgICByZXNwb25zZS50aW1pbmdzID0gc2VsZi50aW1pbmdzXG5cbiAgICAgIC8vIHByZS1jYWxjdWxhdGUgcGhhc2UgdGltaW5ncyBhcyB3ZWxsXG4gICAgICByZXNwb25zZS50aW1pbmdQaGFzZXMgPSB7XG4gICAgICAgIHdhaXQ6IHNlbGYudGltaW5ncy5zb2NrZXQsXG4gICAgICAgIGRuczogc2VsZi50aW1pbmdzLmxvb2t1cCAtIHNlbGYudGltaW5ncy5zb2NrZXQsXG4gICAgICAgIHRjcDogc2VsZi50aW1pbmdzLmNvbm5lY3QgLSBzZWxmLnRpbWluZ3MubG9va3VwLFxuICAgICAgICBmaXJzdEJ5dGU6IHNlbGYudGltaW5ncy5yZXNwb25zZSAtIHNlbGYudGltaW5ncy5jb25uZWN0LFxuICAgICAgICBkb3dubG9hZDogc2VsZi50aW1pbmdzLmVuZCAtIHNlbGYudGltaW5ncy5yZXNwb25zZSxcbiAgICAgICAgdG90YWw6IHNlbGYudGltaW5ncy5lbmRcbiAgICAgIH1cbiAgICB9XG4gICAgZGVidWcoJ3Jlc3BvbnNlIGVuZCcsIHNlbGYudXJpLmhyZWYsIHJlc3BvbnNlLnN0YXR1c0NvZGUsIHJlc3BvbnNlLmhlYWRlcnMpXG4gIH0pXG5cbiAgaWYgKHNlbGYuX2Fib3J0ZWQpIHtcbiAgICBkZWJ1ZygnYWJvcnRlZCcsIHNlbGYudXJpLmhyZWYpXG4gICAgcmVzcG9uc2UucmVzdW1lKClcbiAgICByZXR1cm5cbiAgfVxuXG4gIHNlbGYucmVzcG9uc2UgPSByZXNwb25zZVxuICByZXNwb25zZS5yZXF1ZXN0ID0gc2VsZlxuICByZXNwb25zZS50b0pTT04gPSByZXNwb25zZVRvSlNPTlxuXG4gIC8vIFhYWCBUaGlzIGlzIGRpZmZlcmVudCBvbiAwLjEwLCBiZWNhdXNlIFNTTCBpcyBzdHJpY3QgYnkgZGVmYXVsdFxuICBpZiAoc2VsZi5odHRwTW9kdWxlID09PSBodHRwcyAmJlxuICAgIHNlbGYuc3RyaWN0U1NMICYmICghcmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ3NvY2tldCcpIHx8XG4gICAgIXJlc3BvbnNlLnNvY2tldC5hdXRob3JpemVkKSkge1xuICAgIGRlYnVnKCdzdHJpY3Qgc3NsIGVycm9yJywgc2VsZi51cmkuaHJlZilcbiAgICB2YXIgc3NsRXJyID0gcmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ3NvY2tldCcpID8gcmVzcG9uc2Uuc29ja2V0LmF1dGhvcml6YXRpb25FcnJvciA6IHNlbGYudXJpLmhyZWYgKyAnIGRvZXMgbm90IHN1cHBvcnQgU1NMJ1xuICAgIHNlbGYuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ1NTTCBFcnJvcjogJyArIHNzbEVycikpXG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBTYXZlIHRoZSBvcmlnaW5hbCBob3N0IGJlZm9yZSBhbnkgcmVkaXJlY3QgKGlmIGl0IGNoYW5nZXMsIHdlIG5lZWQgdG9cbiAgLy8gcmVtb3ZlIGFueSBhdXRob3JpemF0aW9uIGhlYWRlcnMpLiAgQWxzbyByZW1lbWJlciB0aGUgY2FzZSBvZiB0aGUgaGVhZGVyXG4gIC8vIG5hbWUgYmVjYXVzZSBsb3RzIG9mIGJyb2tlbiBzZXJ2ZXJzIGV4cGVjdCBIb3N0IGluc3RlYWQgb2YgaG9zdCBhbmQgd2VcbiAgLy8gd2FudCB0aGUgY2FsbGVyIHRvIGJlIGFibGUgdG8gc3BlY2lmeSB0aGlzLlxuICBzZWxmLm9yaWdpbmFsSG9zdCA9IHNlbGYuZ2V0SGVhZGVyKCdob3N0JylcbiAgaWYgKCFzZWxmLm9yaWdpbmFsSG9zdEhlYWRlck5hbWUpIHtcbiAgICBzZWxmLm9yaWdpbmFsSG9zdEhlYWRlck5hbWUgPSBzZWxmLmhhc0hlYWRlcignaG9zdCcpXG4gIH1cbiAgaWYgKHNlbGYuc2V0SG9zdCkge1xuICAgIHNlbGYucmVtb3ZlSGVhZGVyKCdob3N0JylcbiAgfVxuICBpZiAoc2VsZi50aW1lb3V0ICYmIHNlbGYudGltZW91dFRpbWVyKSB7XG4gICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dFRpbWVyKVxuICAgIHNlbGYudGltZW91dFRpbWVyID0gbnVsbFxuICB9XG5cbiAgdmFyIHRhcmdldENvb2tpZUphciA9IChzZWxmLl9qYXIgJiYgc2VsZi5famFyLnNldENvb2tpZSkgPyBzZWxmLl9qYXIgOiBnbG9iYWxDb29raWVKYXJcbiAgdmFyIGFkZENvb2tpZSA9IGZ1bmN0aW9uIChjb29raWUpIHtcbiAgICAvLyBzZXQgdGhlIGNvb2tpZSBpZiBpdCdzIGRvbWFpbiBpbiB0aGUgaHJlZidzIGRvbWFpbi5cbiAgICB0cnkge1xuICAgICAgdGFyZ2V0Q29va2llSmFyLnNldENvb2tpZShjb29raWUsIHNlbGYudXJpLmhyZWYsIHtpZ25vcmVFcnJvcjogdHJ1ZX0pXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2VsZi5lbWl0KCdlcnJvcicsIGUpXG4gICAgfVxuICB9XG5cbiAgcmVzcG9uc2UuY2FzZWxlc3MgPSBjYXNlbGVzcyhyZXNwb25zZS5oZWFkZXJzKVxuXG4gIGlmIChyZXNwb25zZS5jYXNlbGVzcy5oYXMoJ3NldC1jb29raWUnKSAmJiAoIXNlbGYuX2Rpc2FibGVDb29raWVzKSkge1xuICAgIHZhciBoZWFkZXJOYW1lID0gcmVzcG9uc2UuY2FzZWxlc3MuaGFzKCdzZXQtY29va2llJylcbiAgICBpZiAoQXJyYXkuaXNBcnJheShyZXNwb25zZS5oZWFkZXJzW2hlYWRlck5hbWVdKSkge1xuICAgICAgcmVzcG9uc2UuaGVhZGVyc1toZWFkZXJOYW1lXS5mb3JFYWNoKGFkZENvb2tpZSlcbiAgICB9IGVsc2Uge1xuICAgICAgYWRkQ29va2llKHJlc3BvbnNlLmhlYWRlcnNbaGVhZGVyTmFtZV0pXG4gICAgfVxuICB9XG5cbiAgaWYgKHNlbGYuX3JlZGlyZWN0Lm9uUmVzcG9uc2UocmVzcG9uc2UpKSB7XG4gICAgcmV0dXJuIC8vIElnbm9yZSB0aGUgcmVzdCBvZiB0aGUgcmVzcG9uc2VcbiAgfSBlbHNlIHtcbiAgICAvLyBCZSBhIGdvb2Qgc3RyZWFtIGFuZCBlbWl0IGVuZCB3aGVuIHRoZSByZXNwb25zZSBpcyBmaW5pc2hlZC5cbiAgICAvLyBIYWNrIHRvIGVtaXQgZW5kIG9uIGNsb3NlIGJlY2F1c2Ugb2YgYSBjb3JlIGJ1ZyB0aGF0IG5ldmVyIGZpcmVzIGVuZFxuICAgIHJlc3BvbnNlLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghc2VsZi5fZW5kZWQpIHtcbiAgICAgICAgc2VsZi5yZXNwb25zZS5lbWl0KCdlbmQnKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXNwb25zZS5vbmNlKCdlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9lbmRlZCA9IHRydWVcbiAgICB9KVxuXG4gICAgdmFyIG5vQm9keSA9IGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBzZWxmLm1ldGhvZCA9PT0gJ0hFQUQnIHx8XG4gICAgICAgIC8vIEluZm9ybWF0aW9uYWxcbiAgICAgICAgKGNvZGUgPj0gMTAwICYmIGNvZGUgPCAyMDApIHx8XG4gICAgICAgIC8vIE5vIENvbnRlbnRcbiAgICAgICAgY29kZSA9PT0gMjA0IHx8XG4gICAgICAgIC8vIE5vdCBNb2RpZmllZFxuICAgICAgICBjb2RlID09PSAzMDRcbiAgICAgIClcbiAgICB9XG5cbiAgICB2YXIgcmVzcG9uc2VDb250ZW50XG4gICAgaWYgKHNlbGYuZ3ppcCAmJiAhbm9Cb2R5KHJlc3BvbnNlLnN0YXR1c0NvZGUpKSB7XG4gICAgICB2YXIgY29udGVudEVuY29kaW5nID0gcmVzcG9uc2UuaGVhZGVyc1snY29udGVudC1lbmNvZGluZyddIHx8ICdpZGVudGl0eSdcbiAgICAgIGNvbnRlbnRFbmNvZGluZyA9IGNvbnRlbnRFbmNvZGluZy50cmltKCkudG9Mb3dlckNhc2UoKVxuXG4gICAgICAvLyBCZSBtb3JlIGxlbmllbnQgd2l0aCBkZWNvZGluZyBjb21wcmVzc2VkIHJlc3BvbnNlcywgc2luY2UgKHZlcnkgcmFyZWx5KVxuICAgICAgLy8gc2VydmVycyBzZW5kIHNsaWdodGx5IGludmFsaWQgZ3ppcCByZXNwb25zZXMgdGhhdCBhcmUgc3RpbGwgYWNjZXB0ZWRcbiAgICAgIC8vIGJ5IGNvbW1vbiBicm93c2Vycy5cbiAgICAgIC8vIEFsd2F5cyB1c2luZyBaX1NZTkNfRkxVU0ggaXMgd2hhdCBjVVJMIGRvZXMuXG4gICAgICB2YXIgemxpYk9wdGlvbnMgPSB7XG4gICAgICAgIGZsdXNoOiB6bGliLlpfU1lOQ19GTFVTSCxcbiAgICAgICAgZmluaXNoRmx1c2g6IHpsaWIuWl9TWU5DX0ZMVVNIXG4gICAgICB9XG5cbiAgICAgIGlmIChjb250ZW50RW5jb2RpbmcgPT09ICdnemlwJykge1xuICAgICAgICByZXNwb25zZUNvbnRlbnQgPSB6bGliLmNyZWF0ZUd1bnppcCh6bGliT3B0aW9ucylcbiAgICAgICAgcmVzcG9uc2UucGlwZShyZXNwb25zZUNvbnRlbnQpXG4gICAgICB9IGVsc2UgaWYgKGNvbnRlbnRFbmNvZGluZyA9PT0gJ2RlZmxhdGUnKSB7XG4gICAgICAgIHJlc3BvbnNlQ29udGVudCA9IHpsaWIuY3JlYXRlSW5mbGF0ZSh6bGliT3B0aW9ucylcbiAgICAgICAgcmVzcG9uc2UucGlwZShyZXNwb25zZUNvbnRlbnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTaW5jZSBwcmV2aW91cyB2ZXJzaW9ucyBkaWRuJ3QgY2hlY2sgZm9yIENvbnRlbnQtRW5jb2RpbmcgaGVhZGVyLFxuICAgICAgICAvLyBpZ25vcmUgYW55IGludmFsaWQgdmFsdWVzIHRvIHByZXNlcnZlIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5XG4gICAgICAgIGlmIChjb250ZW50RW5jb2RpbmcgIT09ICdpZGVudGl0eScpIHtcbiAgICAgICAgICBkZWJ1ZygnaWdub3JpbmcgdW5yZWNvZ25pemVkIENvbnRlbnQtRW5jb2RpbmcgJyArIGNvbnRlbnRFbmNvZGluZylcbiAgICAgICAgfVxuICAgICAgICByZXNwb25zZUNvbnRlbnQgPSByZXNwb25zZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXNwb25zZUNvbnRlbnQgPSByZXNwb25zZVxuICAgIH1cblxuICAgIGlmIChzZWxmLmVuY29kaW5nKSB7XG4gICAgICBpZiAoc2VsZi5kZXN0cy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignSWdub3JpbmcgZW5jb2RpbmcgcGFyYW1ldGVyIGFzIHRoaXMgc3RyZWFtIGlzIGJlaW5nIHBpcGVkIHRvIGFub3RoZXIgc3RyZWFtIHdoaWNoIG1ha2VzIHRoZSBlbmNvZGluZyBvcHRpb24gaW52YWxpZC4nKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzcG9uc2VDb250ZW50LnNldEVuY29kaW5nKHNlbGYuZW5jb2RpbmcpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuX3BhdXNlZCkge1xuICAgICAgcmVzcG9uc2VDb250ZW50LnBhdXNlKClcbiAgICB9XG5cbiAgICBzZWxmLnJlc3BvbnNlQ29udGVudCA9IHJlc3BvbnNlQ29udGVudFxuXG4gICAgc2VsZi5lbWl0KCdyZXNwb25zZScsIHJlc3BvbnNlKVxuXG4gICAgc2VsZi5kZXN0cy5mb3JFYWNoKGZ1bmN0aW9uIChkZXN0KSB7XG4gICAgICBzZWxmLnBpcGVEZXN0KGRlc3QpXG4gICAgfSlcblxuICAgIHJlc3BvbnNlQ29udGVudC5vbignZGF0YScsIGZ1bmN0aW9uIChjaHVuaykge1xuICAgICAgaWYgKHNlbGYudGltaW5nICYmICFzZWxmLnJlc3BvbnNlU3RhcnRlZCkge1xuICAgICAgICBzZWxmLnJlc3BvbnNlU3RhcnRUaW1lID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKVxuXG4gICAgICAgIC8vIE5PVEU6IHJlc3BvbnNlU3RhcnRUaW1lIGlzIGRlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgLnRpbWluZ3NcbiAgICAgICAgcmVzcG9uc2UucmVzcG9uc2VTdGFydFRpbWUgPSBzZWxmLnJlc3BvbnNlU3RhcnRUaW1lXG4gICAgICB9XG4gICAgICBzZWxmLl9kZXN0ZGF0YSA9IHRydWVcbiAgICAgIHNlbGYuZW1pdCgnZGF0YScsIGNodW5rKVxuICAgIH0pXG4gICAgcmVzcG9uc2VDb250ZW50Lm9uY2UoJ2VuZCcsIGZ1bmN0aW9uIChjaHVuaykge1xuICAgICAgc2VsZi5lbWl0KCdlbmQnLCBjaHVuaylcbiAgICB9KVxuICAgIHJlc3BvbnNlQ29udGVudC5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlcnJvcilcbiAgICB9KVxuICAgIHJlc3BvbnNlQ29udGVudC5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7IHNlbGYuZW1pdCgnY2xvc2UnKSB9KVxuXG4gICAgaWYgKHNlbGYuY2FsbGJhY2spIHtcbiAgICAgIHNlbGYucmVhZFJlc3BvbnNlQm9keShyZXNwb25zZSlcbiAgICB9IGVsc2UgeyAvLyBpZiBubyBjYWxsYmFja1xuICAgICAgc2VsZi5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoc2VsZi5fYWJvcnRlZCkge1xuICAgICAgICAgIGRlYnVnKCdhYm9ydGVkJywgc2VsZi51cmkuaHJlZilcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBzZWxmLmVtaXQoJ2NvbXBsZXRlJywgcmVzcG9uc2UpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBkZWJ1ZygnZmluaXNoIGluaXQgZnVuY3Rpb24nLCBzZWxmLnVyaS5ocmVmKVxufVxuXG5SZXF1ZXN0LnByb3RvdHlwZS5yZWFkUmVzcG9uc2VCb2R5ID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBkZWJ1ZyhcInJlYWRpbmcgcmVzcG9uc2UncyBib2R5XCIpXG4gIHZhciBidWZmZXJzID0gW11cbiAgdmFyIGJ1ZmZlckxlbmd0aCA9IDBcbiAgdmFyIHN0cmluZ3MgPSBbXVxuXG4gIHNlbGYub24oJ2RhdGEnLCBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihjaHVuaykpIHtcbiAgICAgIHN0cmluZ3MucHVzaChjaHVuaylcbiAgICB9IGVsc2UgaWYgKGNodW5rLmxlbmd0aCkge1xuICAgICAgYnVmZmVyTGVuZ3RoICs9IGNodW5rLmxlbmd0aFxuICAgICAgYnVmZmVycy5wdXNoKGNodW5rKVxuICAgIH1cbiAgfSlcbiAgc2VsZi5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuICAgIGRlYnVnKCdlbmQgZXZlbnQnLCBzZWxmLnVyaS5ocmVmKVxuICAgIGlmIChzZWxmLl9hYm9ydGVkKSB7XG4gICAgICBkZWJ1ZygnYWJvcnRlZCcsIHNlbGYudXJpLmhyZWYpXG4gICAgICAvLyBgYnVmZmVyYCBpcyBkZWZpbmVkIGluIHRoZSBwYXJlbnQgc2NvcGUgYW5kIHVzZWQgaW4gYSBjbG9zdXJlIGl0IGV4aXN0cyBmb3IgdGhlIGxpZmUgb2YgdGhlIHJlcXVlc3QuXG4gICAgICAvLyBUaGlzIGNhbiBsZWFkIHRvIGxlYWt5IGJlaGF2aW9yIGlmIHRoZSB1c2VyIHJldGFpbnMgYSByZWZlcmVuY2UgdG8gdGhlIHJlcXVlc3Qgb2JqZWN0LlxuICAgICAgYnVmZmVycyA9IFtdXG4gICAgICBidWZmZXJMZW5ndGggPSAwXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoYnVmZmVyTGVuZ3RoKSB7XG4gICAgICBkZWJ1ZygnaGFzIGJvZHknLCBzZWxmLnVyaS5ocmVmLCBidWZmZXJMZW5ndGgpXG4gICAgICByZXNwb25zZS5ib2R5ID0gQnVmZmVyLmNvbmNhdChidWZmZXJzLCBidWZmZXJMZW5ndGgpXG4gICAgICBpZiAoc2VsZi5lbmNvZGluZyAhPT0gbnVsbCkge1xuICAgICAgICByZXNwb25zZS5ib2R5ID0gcmVzcG9uc2UuYm9keS50b1N0cmluZyhzZWxmLmVuY29kaW5nKVxuICAgICAgfVxuICAgICAgLy8gYGJ1ZmZlcmAgaXMgZGVmaW5lZCBpbiB0aGUgcGFyZW50IHNjb3BlIGFuZCB1c2VkIGluIGEgY2xvc3VyZSBpdCBleGlzdHMgZm9yIHRoZSBsaWZlIG9mIHRoZSBSZXF1ZXN0LlxuICAgICAgLy8gVGhpcyBjYW4gbGVhZCB0byBsZWFreSBiZWhhdmlvciBpZiB0aGUgdXNlciByZXRhaW5zIGEgcmVmZXJlbmNlIHRvIHRoZSByZXF1ZXN0IG9iamVjdC5cbiAgICAgIGJ1ZmZlcnMgPSBbXVxuICAgICAgYnVmZmVyTGVuZ3RoID0gMFxuICAgIH0gZWxzZSBpZiAoc3RyaW5ncy5sZW5ndGgpIHtcbiAgICAgIC8vIFRoZSBVVEY4IEJPTSBbMHhFRiwweEJCLDB4QkZdIGlzIGNvbnZlcnRlZCB0byBbMHhGRSwweEZGXSBpbiB0aGUgSlMgVVRDMTYvVUNTMiByZXByZXNlbnRhdGlvbi5cbiAgICAgIC8vIFN0cmlwIHRoaXMgdmFsdWUgb3V0IHdoZW4gdGhlIGVuY29kaW5nIGlzIHNldCB0byAndXRmOCcsIGFzIHVwc3RyZWFtIGNvbnN1bWVycyB3b24ndCBleHBlY3QgaXQgYW5kIGl0IGJyZWFrcyBKU09OLnBhcnNlKCkuXG4gICAgICBpZiAoc2VsZi5lbmNvZGluZyA9PT0gJ3V0ZjgnICYmIHN0cmluZ3NbMF0ubGVuZ3RoID4gMCAmJiBzdHJpbmdzWzBdWzBdID09PSAnXFx1RkVGRicpIHtcbiAgICAgICAgc3RyaW5nc1swXSA9IHN0cmluZ3NbMF0uc3Vic3RyaW5nKDEpXG4gICAgICB9XG4gICAgICByZXNwb25zZS5ib2R5ID0gc3RyaW5ncy5qb2luKCcnKVxuICAgIH1cblxuICAgIGlmIChzZWxmLl9qc29uKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNwb25zZS5ib2R5ID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5LCBzZWxmLl9qc29uUmV2aXZlcilcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVidWcoJ2ludmFsaWQgSlNPTiByZWNlaXZlZCcsIHNlbGYudXJpLmhyZWYpXG4gICAgICB9XG4gICAgfVxuICAgIGRlYnVnKCdlbWl0dGluZyBjb21wbGV0ZScsIHNlbGYudXJpLmhyZWYpXG4gICAgaWYgKHR5cGVvZiByZXNwb25zZS5ib2R5ID09PSAndW5kZWZpbmVkJyAmJiAhc2VsZi5fanNvbikge1xuICAgICAgcmVzcG9uc2UuYm9keSA9IHNlbGYuZW5jb2RpbmcgPT09IG51bGwgPyBCdWZmZXIuYWxsb2MoMCkgOiAnJ1xuICAgIH1cbiAgICBzZWxmLmVtaXQoJ2NvbXBsZXRlJywgcmVzcG9uc2UsIHJlc3BvbnNlLmJvZHkpXG4gIH0pXG59XG5cblJlcXVlc3QucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgc2VsZi5fYWJvcnRlZCA9IHRydWVcblxuICBpZiAoc2VsZi5yZXEpIHtcbiAgICBzZWxmLnJlcS5hYm9ydCgpXG4gIH0gZWxzZSBpZiAoc2VsZi5yZXNwb25zZSkge1xuICAgIHNlbGYucmVzcG9uc2UuZGVzdHJveSgpXG4gIH1cblxuICBzZWxmLmVtaXQoJ2Fib3J0Jylcbn1cblxuUmVxdWVzdC5wcm90b3R5cGUucGlwZURlc3QgPSBmdW5jdGlvbiAoZGVzdCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIHJlc3BvbnNlID0gc2VsZi5yZXNwb25zZVxuICAvLyBDYWxsZWQgYWZ0ZXIgdGhlIHJlc3BvbnNlIGlzIHJlY2VpdmVkXG4gIGlmIChkZXN0LmhlYWRlcnMgJiYgIWRlc3QuaGVhZGVyc1NlbnQpIHtcbiAgICBpZiAocmVzcG9uc2UuY2FzZWxlc3MuaGFzKCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgdmFyIGN0bmFtZSA9IHJlc3BvbnNlLmNhc2VsZXNzLmhhcygnY29udGVudC10eXBlJylcbiAgICAgIGlmIChkZXN0LnNldEhlYWRlcikge1xuICAgICAgICBkZXN0LnNldEhlYWRlcihjdG5hbWUsIHJlc3BvbnNlLmhlYWRlcnNbY3RuYW1lXSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlc3QuaGVhZGVyc1tjdG5hbWVdID0gcmVzcG9uc2UuaGVhZGVyc1tjdG5hbWVdXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlc3BvbnNlLmNhc2VsZXNzLmhhcygnY29udGVudC1sZW5ndGgnKSkge1xuICAgICAgdmFyIGNsbmFtZSA9IHJlc3BvbnNlLmNhc2VsZXNzLmhhcygnY29udGVudC1sZW5ndGgnKVxuICAgICAgaWYgKGRlc3Quc2V0SGVhZGVyKSB7XG4gICAgICAgIGRlc3Quc2V0SGVhZGVyKGNsbmFtZSwgcmVzcG9uc2UuaGVhZGVyc1tjbG5hbWVdKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVzdC5oZWFkZXJzW2NsbmFtZV0gPSByZXNwb25zZS5oZWFkZXJzW2NsbmFtZV1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKGRlc3Quc2V0SGVhZGVyICYmICFkZXN0LmhlYWRlcnNTZW50KSB7XG4gICAgZm9yICh2YXIgaSBpbiByZXNwb25zZS5oZWFkZXJzKSB7XG4gICAgICAvLyBJZiB0aGUgcmVzcG9uc2UgY29udGVudCBpcyBiZWluZyBkZWNvZGVkLCB0aGUgQ29udGVudC1FbmNvZGluZyBoZWFkZXJcbiAgICAgIC8vIG9mIHRoZSByZXNwb25zZSBkb2Vzbid0IHJlcHJlc2VudCB0aGUgcGlwZWQgY29udGVudCwgc28gZG9uJ3QgcGFzcyBpdC5cbiAgICAgIGlmICghc2VsZi5nemlwIHx8IGkgIT09ICdjb250ZW50LWVuY29kaW5nJykge1xuICAgICAgICBkZXN0LnNldEhlYWRlcihpLCByZXNwb25zZS5oZWFkZXJzW2ldKVxuICAgICAgfVxuICAgIH1cbiAgICBkZXN0LnN0YXR1c0NvZGUgPSByZXNwb25zZS5zdGF0dXNDb2RlXG4gIH1cbiAgaWYgKHNlbGYucGlwZWZpbHRlcikge1xuICAgIHNlbGYucGlwZWZpbHRlcihyZXNwb25zZSwgZGVzdClcbiAgfVxufVxuXG5SZXF1ZXN0LnByb3RvdHlwZS5xcyA9IGZ1bmN0aW9uIChxLCBjbG9iYmVyKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgYmFzZVxuICBpZiAoIWNsb2JiZXIgJiYgc2VsZi51cmkucXVlcnkpIHtcbiAgICBiYXNlID0gc2VsZi5fcXMucGFyc2Uoc2VsZi51cmkucXVlcnkpXG4gIH0gZWxzZSB7XG4gICAgYmFzZSA9IHt9XG4gIH1cblxuICBmb3IgKHZhciBpIGluIHEpIHtcbiAgICBiYXNlW2ldID0gcVtpXVxuICB9XG5cbiAgdmFyIHFzID0gc2VsZi5fcXMuc3RyaW5naWZ5KGJhc2UpXG5cbiAgaWYgKHFzID09PSAnJykge1xuICAgIHJldHVybiBzZWxmXG4gIH1cblxuICBzZWxmLnVyaSA9IHVybC5wYXJzZShzZWxmLnVyaS5ocmVmLnNwbGl0KCc/JylbMF0gKyAnPycgKyBxcylcbiAgc2VsZi51cmwgPSBzZWxmLnVyaVxuICBzZWxmLnBhdGggPSBzZWxmLnVyaS5wYXRoXG5cbiAgaWYgKHNlbGYudXJpLmhvc3QgPT09ICd1bml4Jykge1xuICAgIHNlbGYuZW5hYmxlVW5peFNvY2tldCgpXG4gIH1cblxuICByZXR1cm4gc2VsZlxufVxuUmVxdWVzdC5wcm90b3R5cGUuZm9ybSA9IGZ1bmN0aW9uIChmb3JtKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBpZiAoZm9ybSkge1xuICAgIGlmICghL15hcHBsaWNhdGlvblxcL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFxcYi8udGVzdChzZWxmLmdldEhlYWRlcignY29udGVudC10eXBlJykpKSB7XG4gICAgICBzZWxmLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpXG4gICAgfVxuICAgIHNlbGYuYm9keSA9ICh0eXBlb2YgZm9ybSA9PT0gJ3N0cmluZycpXG4gICAgICA/IHNlbGYuX3FzLnJmYzM5ODYoZm9ybS50b1N0cmluZygndXRmOCcpKVxuICAgICAgOiBzZWxmLl9xcy5zdHJpbmdpZnkoZm9ybSkudG9TdHJpbmcoJ3V0ZjgnKVxuICAgIHJldHVybiBzZWxmXG4gIH1cbiAgLy8gY3JlYXRlIGZvcm0tZGF0YSBvYmplY3RcbiAgc2VsZi5fZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gIHNlbGYuX2Zvcm0ub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgIGVyci5tZXNzYWdlID0gJ2Zvcm0tZGF0YTogJyArIGVyci5tZXNzYWdlXG4gICAgc2VsZi5lbWl0KCdlcnJvcicsIGVycilcbiAgICBzZWxmLmFib3J0KClcbiAgfSlcbiAgcmV0dXJuIHNlbGYuX2Zvcm1cbn1cblJlcXVlc3QucHJvdG90eXBlLm11bHRpcGFydCA9IGZ1bmN0aW9uIChtdWx0aXBhcnQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgc2VsZi5fbXVsdGlwYXJ0Lm9uUmVxdWVzdChtdWx0aXBhcnQpXG5cbiAgaWYgKCFzZWxmLl9tdWx0aXBhcnQuY2h1bmtlZCkge1xuICAgIHNlbGYuYm9keSA9IHNlbGYuX211bHRpcGFydC5ib2R5XG4gIH1cblxuICByZXR1cm4gc2VsZlxufVxuUmVxdWVzdC5wcm90b3R5cGUuanNvbiA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgaWYgKCFzZWxmLmhhc0hlYWRlcignYWNjZXB0JykpIHtcbiAgICBzZWxmLnNldEhlYWRlcignYWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBzZWxmLmpzb25SZXBsYWNlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHNlbGYuX2pzb25SZXBsYWNlciA9IHNlbGYuanNvblJlcGxhY2VyXG4gIH1cblxuICBzZWxmLl9qc29uID0gdHJ1ZVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgaWYgKHNlbGYuYm9keSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIS9eYXBwbGljYXRpb25cXC94LXd3dy1mb3JtLXVybGVuY29kZWRcXGIvLnRlc3Qoc2VsZi5nZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScpKSkge1xuICAgICAgICBzZWxmLmJvZHkgPSBzYWZlU3RyaW5naWZ5KHNlbGYuYm9keSwgc2VsZi5fanNvblJlcGxhY2VyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5ib2R5ID0gc2VsZi5fcXMucmZjMzk4NihzZWxmLmJvZHkpXG4gICAgICB9XG4gICAgICBpZiAoIXNlbGYuaGFzSGVhZGVyKCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgICBzZWxmLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZWxmLmJvZHkgPSBzYWZlU3RyaW5naWZ5KHZhbCwgc2VsZi5fanNvblJlcGxhY2VyKVxuICAgIGlmICghc2VsZi5oYXNIZWFkZXIoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICBzZWxmLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKVxuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2Ygc2VsZi5qc29uUmV2aXZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHNlbGYuX2pzb25SZXZpdmVyID0gc2VsZi5qc29uUmV2aXZlclxuICB9XG5cbiAgcmV0dXJuIHNlbGZcbn1cblJlcXVlc3QucHJvdG90eXBlLmdldEhlYWRlciA9IGZ1bmN0aW9uIChuYW1lLCBoZWFkZXJzKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgcmVzdWx0LCByZSwgbWF0Y2hcbiAgaWYgKCFoZWFkZXJzKSB7XG4gICAgaGVhZGVycyA9IHNlbGYuaGVhZGVyc1xuICB9XG4gIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChrZXkubGVuZ3RoICE9PSBuYW1lLmxlbmd0aCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHJlID0gbmV3IFJlZ0V4cChuYW1lLCAnaScpXG4gICAgbWF0Y2ggPSBrZXkubWF0Y2gocmUpXG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICByZXN1bHQgPSBoZWFkZXJzW2tleV1cbiAgICB9XG4gIH0pXG4gIHJldHVybiByZXN1bHRcbn1cblJlcXVlc3QucHJvdG90eXBlLmVuYWJsZVVuaXhTb2NrZXQgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIEdldCB0aGUgc29ja2V0ICYgcmVxdWVzdCBwYXRocyBmcm9tIHRoZSBVUkxcbiAgdmFyIHVuaXhQYXJ0cyA9IHRoaXMudXJpLnBhdGguc3BsaXQoJzonKVxuICB2YXIgaG9zdCA9IHVuaXhQYXJ0c1swXVxuICB2YXIgcGF0aCA9IHVuaXhQYXJ0c1sxXVxuICAvLyBBcHBseSB1bml4IHByb3BlcnRpZXMgdG8gcmVxdWVzdFxuICB0aGlzLnNvY2tldFBhdGggPSBob3N0XG4gIHRoaXMudXJpLnBhdGhuYW1lID0gcGF0aFxuICB0aGlzLnVyaS5wYXRoID0gcGF0aFxuICB0aGlzLnVyaS5ob3N0ID0gaG9zdFxuICB0aGlzLnVyaS5ob3N0bmFtZSA9IGhvc3RcbiAgdGhpcy51cmkuaXNVbml4ID0gdHJ1ZVxufVxuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdXRoID0gZnVuY3Rpb24gKHVzZXIsIHBhc3MsIHNlbmRJbW1lZGlhdGVseSwgYmVhcmVyKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIHNlbGYuX2F1dGgub25SZXF1ZXN0KHVzZXIsIHBhc3MsIHNlbmRJbW1lZGlhdGVseSwgYmVhcmVyKVxuXG4gIHJldHVybiBzZWxmXG59XG5SZXF1ZXN0LnByb3RvdHlwZS5hd3MgPSBmdW5jdGlvbiAob3B0cywgbm93KSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGlmICghbm93KSB7XG4gICAgc2VsZi5fYXdzID0gb3B0c1xuICAgIHJldHVybiBzZWxmXG4gIH1cblxuICBpZiAob3B0cy5zaWduX3ZlcnNpb24gPT09IDQgfHwgb3B0cy5zaWduX3ZlcnNpb24gPT09ICc0Jykge1xuICAgIC8vIHVzZSBhd3M0XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBob3N0OiBzZWxmLnVyaS5ob3N0LFxuICAgICAgcGF0aDogc2VsZi51cmkucGF0aCxcbiAgICAgIG1ldGhvZDogc2VsZi5tZXRob2QsXG4gICAgICBoZWFkZXJzOiBzZWxmLmhlYWRlcnMsXG4gICAgICBib2R5OiBzZWxmLmJvZHlcbiAgICB9XG4gICAgaWYgKG9wdHMuc2VydmljZSkge1xuICAgICAgb3B0aW9ucy5zZXJ2aWNlID0gb3B0cy5zZXJ2aWNlXG4gICAgfVxuICAgIHZhciBzaWduUmVzID0gYXdzNC5zaWduKG9wdGlvbnMsIHtcbiAgICAgIGFjY2Vzc0tleUlkOiBvcHRzLmtleSxcbiAgICAgIHNlY3JldEFjY2Vzc0tleTogb3B0cy5zZWNyZXQsXG4gICAgICBzZXNzaW9uVG9rZW46IG9wdHMuc2Vzc2lvblxuICAgIH0pXG4gICAgc2VsZi5zZXRIZWFkZXIoJ2F1dGhvcml6YXRpb24nLCBzaWduUmVzLmhlYWRlcnMuQXV0aG9yaXphdGlvbilcbiAgICBzZWxmLnNldEhlYWRlcigneC1hbXotZGF0ZScsIHNpZ25SZXMuaGVhZGVyc1snWC1BbXotRGF0ZSddKVxuICAgIGlmIChzaWduUmVzLmhlYWRlcnNbJ1gtQW16LVNlY3VyaXR5LVRva2VuJ10pIHtcbiAgICAgIHNlbGYuc2V0SGVhZGVyKCd4LWFtei1zZWN1cml0eS10b2tlbicsIHNpZ25SZXMuaGVhZGVyc1snWC1BbXotU2VjdXJpdHktVG9rZW4nXSlcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gZGVmYXVsdDogdXNlIGF3cy1zaWduMlxuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKVxuICAgIHNlbGYuc2V0SGVhZGVyKCdkYXRlJywgZGF0ZS50b1VUQ1N0cmluZygpKVxuICAgIHZhciBhdXRoID0ge1xuICAgICAga2V5OiBvcHRzLmtleSxcbiAgICAgIHNlY3JldDogb3B0cy5zZWNyZXQsXG4gICAgICB2ZXJiOiBzZWxmLm1ldGhvZC50b1VwcGVyQ2FzZSgpLFxuICAgICAgZGF0ZTogZGF0ZSxcbiAgICAgIGNvbnRlbnRUeXBlOiBzZWxmLmdldEhlYWRlcignY29udGVudC10eXBlJykgfHwgJycsXG4gICAgICBtZDU6IHNlbGYuZ2V0SGVhZGVyKCdjb250ZW50LW1kNScpIHx8ICcnLFxuICAgICAgYW1hem9uSGVhZGVyczogYXdzMi5jYW5vbmljYWxpemVIZWFkZXJzKHNlbGYuaGVhZGVycylcbiAgICB9XG4gICAgdmFyIHBhdGggPSBzZWxmLnVyaS5wYXRoXG4gICAgaWYgKG9wdHMuYnVja2V0ICYmIHBhdGgpIHtcbiAgICAgIGF1dGgucmVzb3VyY2UgPSAnLycgKyBvcHRzLmJ1Y2tldCArIHBhdGhcbiAgICB9IGVsc2UgaWYgKG9wdHMuYnVja2V0ICYmICFwYXRoKSB7XG4gICAgICBhdXRoLnJlc291cmNlID0gJy8nICsgb3B0cy5idWNrZXRcbiAgICB9IGVsc2UgaWYgKCFvcHRzLmJ1Y2tldCAmJiBwYXRoKSB7XG4gICAgICBhdXRoLnJlc291cmNlID0gcGF0aFxuICAgIH0gZWxzZSBpZiAoIW9wdHMuYnVja2V0ICYmICFwYXRoKSB7XG4gICAgICBhdXRoLnJlc291cmNlID0gJy8nXG4gICAgfVxuICAgIGF1dGgucmVzb3VyY2UgPSBhd3MyLmNhbm9uaWNhbGl6ZVJlc291cmNlKGF1dGgucmVzb3VyY2UpXG4gICAgc2VsZi5zZXRIZWFkZXIoJ2F1dGhvcml6YXRpb24nLCBhd3MyLmF1dGhvcml6YXRpb24oYXV0aCkpXG4gIH1cblxuICByZXR1cm4gc2VsZlxufVxuUmVxdWVzdC5wcm90b3R5cGUuaHR0cFNpZ25hdHVyZSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBodHRwU2lnbmF0dXJlLnNpZ25SZXF1ZXN0KHtcbiAgICBnZXRIZWFkZXI6IGZ1bmN0aW9uIChoZWFkZXIpIHtcbiAgICAgIHJldHVybiBzZWxmLmdldEhlYWRlcihoZWFkZXIsIHNlbGYuaGVhZGVycylcbiAgICB9LFxuICAgIHNldEhlYWRlcjogZnVuY3Rpb24gKGhlYWRlciwgdmFsdWUpIHtcbiAgICAgIHNlbGYuc2V0SGVhZGVyKGhlYWRlciwgdmFsdWUpXG4gICAgfSxcbiAgICBtZXRob2Q6IHNlbGYubWV0aG9kLFxuICAgIHBhdGg6IHNlbGYucGF0aFxuICB9LCBvcHRzKVxuICBkZWJ1ZygnaHR0cFNpZ25hdHVyZSBhdXRob3JpemF0aW9uJywgc2VsZi5nZXRIZWFkZXIoJ2F1dGhvcml6YXRpb24nKSlcblxuICByZXR1cm4gc2VsZlxufVxuUmVxdWVzdC5wcm90b3R5cGUuaGF3ayA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBzZWxmLnNldEhlYWRlcignQXV0aG9yaXphdGlvbicsIGhhd2suaGVhZGVyKHNlbGYudXJpLCBzZWxmLm1ldGhvZCwgb3B0cykpXG59XG5SZXF1ZXN0LnByb3RvdHlwZS5vYXV0aCA9IGZ1bmN0aW9uIChfb2F1dGgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgc2VsZi5fb2F1dGgub25SZXF1ZXN0KF9vYXV0aClcblxuICByZXR1cm4gc2VsZlxufVxuXG5SZXF1ZXN0LnByb3RvdHlwZS5qYXIgPSBmdW5jdGlvbiAoamFyKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgY29va2llc1xuXG4gIGlmIChzZWxmLl9yZWRpcmVjdC5yZWRpcmVjdHNGb2xsb3dlZCA9PT0gMCkge1xuICAgIHNlbGYub3JpZ2luYWxDb29raWVIZWFkZXIgPSBzZWxmLmdldEhlYWRlcignY29va2llJylcbiAgfVxuXG4gIGlmICghamFyKSB7XG4gICAgLy8gZGlzYWJsZSBjb29raWVzXG4gICAgY29va2llcyA9IGZhbHNlXG4gICAgc2VsZi5fZGlzYWJsZUNvb2tpZXMgPSB0cnVlXG4gIH0gZWxzZSB7XG4gICAgdmFyIHRhcmdldENvb2tpZUphciA9IChqYXIgJiYgamFyLmdldENvb2tpZVN0cmluZykgPyBqYXIgOiBnbG9iYWxDb29raWVKYXJcbiAgICB2YXIgdXJpaHJlZiA9IHNlbGYudXJpLmhyZWZcbiAgICAvLyBmZXRjaCBjb29raWUgaW4gdGhlIFNwZWNpZmllZCBob3N0XG4gICAgaWYgKHRhcmdldENvb2tpZUphcikge1xuICAgICAgY29va2llcyA9IHRhcmdldENvb2tpZUphci5nZXRDb29raWVTdHJpbmcodXJpaHJlZilcbiAgICB9XG4gIH1cblxuICAvLyBpZiBuZWVkIGNvb2tpZSBhbmQgY29va2llIGlzIG5vdCBlbXB0eVxuICBpZiAoY29va2llcyAmJiBjb29raWVzLmxlbmd0aCkge1xuICAgIGlmIChzZWxmLm9yaWdpbmFsQ29va2llSGVhZGVyKSB7XG4gICAgICAvLyBEb24ndCBvdmVyd3JpdGUgZXhpc3RpbmcgQ29va2llIGhlYWRlclxuICAgICAgc2VsZi5zZXRIZWFkZXIoJ2Nvb2tpZScsIHNlbGYub3JpZ2luYWxDb29raWVIZWFkZXIgKyAnOyAnICsgY29va2llcylcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5zZXRIZWFkZXIoJ2Nvb2tpZScsIGNvb2tpZXMpXG4gICAgfVxuICB9XG4gIHNlbGYuX2phciA9IGphclxuICByZXR1cm4gc2VsZlxufVxuXG4vLyBTdHJlYW0gQVBJXG5SZXF1ZXN0LnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24gKGRlc3QsIG9wdHMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgaWYgKHNlbGYucmVzcG9uc2UpIHtcbiAgICBpZiAoc2VsZi5fZGVzdGRhdGEpIHtcbiAgICAgIHNlbGYuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ1lvdSBjYW5ub3QgcGlwZSBhZnRlciBkYXRhIGhhcyBiZWVuIGVtaXR0ZWQgZnJvbSB0aGUgcmVzcG9uc2UuJykpXG4gICAgfSBlbHNlIGlmIChzZWxmLl9lbmRlZCkge1xuICAgICAgc2VsZi5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignWW91IGNhbm5vdCBwaXBlIGFmdGVyIHRoZSByZXNwb25zZSBoYXMgYmVlbiBlbmRlZC4nKSlcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyZWFtLlN0cmVhbS5wcm90b3R5cGUucGlwZS5jYWxsKHNlbGYsIGRlc3QsIG9wdHMpXG4gICAgICBzZWxmLnBpcGVEZXN0KGRlc3QpXG4gICAgICByZXR1cm4gZGVzdFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZWxmLmRlc3RzLnB1c2goZGVzdClcbiAgICBzdHJlYW0uU3RyZWFtLnByb3RvdHlwZS5waXBlLmNhbGwoc2VsZiwgZGVzdCwgb3B0cylcbiAgICByZXR1cm4gZGVzdFxuICB9XG59XG5SZXF1ZXN0LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGlmIChzZWxmLl9hYm9ydGVkKSB7IHJldHVybiB9XG5cbiAgaWYgKCFzZWxmLl9zdGFydGVkKSB7XG4gICAgc2VsZi5zdGFydCgpXG4gIH1cbiAgaWYgKHNlbGYucmVxKSB7XG4gICAgcmV0dXJuIHNlbGYucmVxLndyaXRlLmFwcGx5KHNlbGYucmVxLCBhcmd1bWVudHMpXG4gIH1cbn1cblJlcXVlc3QucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChjaHVuaykge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgaWYgKHNlbGYuX2Fib3J0ZWQpIHsgcmV0dXJuIH1cblxuICBpZiAoY2h1bmspIHtcbiAgICBzZWxmLndyaXRlKGNodW5rKVxuICB9XG4gIGlmICghc2VsZi5fc3RhcnRlZCkge1xuICAgIHNlbGYuc3RhcnQoKVxuICB9XG4gIGlmIChzZWxmLnJlcSkge1xuICAgIHNlbGYucmVxLmVuZCgpXG4gIH1cbn1cblJlcXVlc3QucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgaWYgKCFzZWxmLnJlc3BvbnNlQ29udGVudCkge1xuICAgIHNlbGYuX3BhdXNlZCA9IHRydWVcbiAgfSBlbHNlIHtcbiAgICBzZWxmLnJlc3BvbnNlQ29udGVudC5wYXVzZS5hcHBseShzZWxmLnJlc3BvbnNlQ29udGVudCwgYXJndW1lbnRzKVxuICB9XG59XG5SZXF1ZXN0LnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBpZiAoIXNlbGYucmVzcG9uc2VDb250ZW50KSB7XG4gICAgc2VsZi5fcGF1c2VkID0gZmFsc2VcbiAgfSBlbHNlIHtcbiAgICBzZWxmLnJlc3BvbnNlQ29udGVudC5yZXN1bWUuYXBwbHkoc2VsZi5yZXNwb25zZUNvbnRlbnQsIGFyZ3VtZW50cylcbiAgfVxufVxuUmVxdWVzdC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGlmICghc2VsZi5fZW5kZWQpIHtcbiAgICBzZWxmLmVuZCgpXG4gIH0gZWxzZSBpZiAoc2VsZi5yZXNwb25zZSkge1xuICAgIHNlbGYucmVzcG9uc2UuZGVzdHJveSgpXG4gIH1cbn1cblxuUmVxdWVzdC5kZWZhdWx0UHJveHlIZWFkZXJXaGl0ZUxpc3QgPVxuICBUdW5uZWwuZGVmYXVsdFByb3h5SGVhZGVyV2hpdGVMaXN0LnNsaWNlKClcblxuUmVxdWVzdC5kZWZhdWx0UHJveHlIZWFkZXJFeGNsdXNpdmVMaXN0ID1cbiAgVHVubmVsLmRlZmF1bHRQcm94eUhlYWRlckV4Y2x1c2l2ZUxpc3Quc2xpY2UoKVxuXG4vLyBFeHBvcnRzXG5cblJlcXVlc3QucHJvdG90eXBlLnRvSlNPTiA9IHJlcXVlc3RUb0pTT05cbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdFxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxuXG5mdW5jdGlvbiByYW5kb21TdHJpbmcgKHNpemUpIHtcbiAgdmFyIGJpdHMgPSAoc2l6ZSArIDEpICogNlxuICB2YXIgYnVmZmVyID0gY3J5cHRvLnJhbmRvbUJ5dGVzKE1hdGguY2VpbChiaXRzIC8gOCkpXG4gIHZhciBzdHJpbmcgPSBidWZmZXIudG9TdHJpbmcoJ2Jhc2U2NCcpLnJlcGxhY2UoL1xcKy9nLCAnLScpLnJlcGxhY2UoL1xcLy9nLCAnXycpLnJlcGxhY2UoLz0vZywgJycpXG4gIHJldHVybiBzdHJpbmcuc2xpY2UoMCwgc2l6ZSlcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlUGF5bG9hZEhhc2ggKHBheWxvYWQsIGFsZ29yaXRobSwgY29udGVudFR5cGUpIHtcbiAgdmFyIGhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaChhbGdvcml0aG0pXG4gIGhhc2gudXBkYXRlKCdoYXdrLjEucGF5bG9hZFxcbicpXG4gIGhhc2gudXBkYXRlKChjb250ZW50VHlwZSA/IGNvbnRlbnRUeXBlLnNwbGl0KCc7JylbMF0udHJpbSgpLnRvTG93ZXJDYXNlKCkgOiAnJykgKyAnXFxuJylcbiAgaGFzaC51cGRhdGUocGF5bG9hZCB8fCAnJylcbiAgaGFzaC51cGRhdGUoJ1xcbicpXG4gIHJldHVybiBoYXNoLmRpZ2VzdCgnYmFzZTY0Jylcbn1cblxuZXhwb3J0cy5jYWxjdWxhdGVNYWMgPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMsIG9wdHMpIHtcbiAgdmFyIG5vcm1hbGl6ZWQgPSAnaGF3ay4xLmhlYWRlclxcbicgK1xuICAgIG9wdHMudHMgKyAnXFxuJyArXG4gICAgb3B0cy5ub25jZSArICdcXG4nICtcbiAgICAob3B0cy5tZXRob2QgfHwgJycpLnRvVXBwZXJDYXNlKCkgKyAnXFxuJyArXG4gICAgb3B0cy5yZXNvdXJjZSArICdcXG4nICtcbiAgICBvcHRzLmhvc3QudG9Mb3dlckNhc2UoKSArICdcXG4nICtcbiAgICBvcHRzLnBvcnQgKyAnXFxuJyArXG4gICAgKG9wdHMuaGFzaCB8fCAnJykgKyAnXFxuJ1xuXG4gIGlmIChvcHRzLmV4dCkge1xuICAgIG5vcm1hbGl6ZWQgPSBub3JtYWxpemVkICsgb3B0cy5leHQucmVwbGFjZSgnXFxcXCcsICdcXFxcXFxcXCcpLnJlcGxhY2UoJ1xcbicsICdcXFxcbicpXG4gIH1cblxuICBub3JtYWxpemVkID0gbm9ybWFsaXplZCArICdcXG4nXG5cbiAgaWYgKG9wdHMuYXBwKSB7XG4gICAgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZWQgKyBvcHRzLmFwcCArICdcXG4nICsgKG9wdHMuZGxnIHx8ICcnKSArICdcXG4nXG4gIH1cblxuICB2YXIgaG1hYyA9IGNyeXB0by5jcmVhdGVIbWFjKGNyZWRlbnRpYWxzLmFsZ29yaXRobSwgY3JlZGVudGlhbHMua2V5KS51cGRhdGUobm9ybWFsaXplZClcbiAgdmFyIGRpZ2VzdCA9IGhtYWMuZGlnZXN0KCdiYXNlNjQnKVxuICByZXR1cm4gZGlnZXN0XG59XG5cbmV4cG9ydHMuaGVhZGVyID0gZnVuY3Rpb24gKHVyaSwgbWV0aG9kLCBvcHRzKSB7XG4gIHZhciB0aW1lc3RhbXAgPSBvcHRzLnRpbWVzdGFtcCB8fCBNYXRoLmZsb29yKChEYXRlLm5vdygpICsgKG9wdHMubG9jYWx0aW1lT2Zmc2V0TXNlYyB8fCAwKSkgLyAxMDAwKVxuICB2YXIgY3JlZGVudGlhbHMgPSBvcHRzLmNyZWRlbnRpYWxzXG4gIGlmICghY3JlZGVudGlhbHMgfHwgIWNyZWRlbnRpYWxzLmlkIHx8ICFjcmVkZW50aWFscy5rZXkgfHwgIWNyZWRlbnRpYWxzLmFsZ29yaXRobSkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKFsnc2hhMScsICdzaGEyNTYnXS5pbmRleE9mKGNyZWRlbnRpYWxzLmFsZ29yaXRobSkgPT09IC0xKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICB2YXIgYXJ0aWZhY3RzID0ge1xuICAgIHRzOiB0aW1lc3RhbXAsXG4gICAgbm9uY2U6IG9wdHMubm9uY2UgfHwgcmFuZG9tU3RyaW5nKDYpLFxuICAgIG1ldGhvZDogbWV0aG9kLFxuICAgIHJlc291cmNlOiB1cmkucGF0aG5hbWUgKyAodXJpLnNlYXJjaCB8fCAnJyksXG4gICAgaG9zdDogdXJpLmhvc3RuYW1lLFxuICAgIHBvcnQ6IHVyaS5wb3J0IHx8ICh1cmkucHJvdG9jb2wgPT09ICdodHRwOicgPyA4MCA6IDQ0MyksXG4gICAgaGFzaDogb3B0cy5oYXNoLFxuICAgIGV4dDogb3B0cy5leHQsXG4gICAgYXBwOiBvcHRzLmFwcCxcbiAgICBkbGc6IG9wdHMuZGxnXG4gIH1cblxuICBpZiAoIWFydGlmYWN0cy5oYXNoICYmIChvcHRzLnBheWxvYWQgfHwgb3B0cy5wYXlsb2FkID09PSAnJykpIHtcbiAgICBhcnRpZmFjdHMuaGFzaCA9IGNhbGN1bGF0ZVBheWxvYWRIYXNoKG9wdHMucGF5bG9hZCwgY3JlZGVudGlhbHMuYWxnb3JpdGhtLCBvcHRzLmNvbnRlbnRUeXBlKVxuICB9XG5cbiAgdmFyIG1hYyA9IGV4cG9ydHMuY2FsY3VsYXRlTWFjKGNyZWRlbnRpYWxzLCBhcnRpZmFjdHMpXG5cbiAgdmFyIGhhc0V4dCA9IGFydGlmYWN0cy5leHQgIT09IG51bGwgJiYgYXJ0aWZhY3RzLmV4dCAhPT0gdW5kZWZpbmVkICYmIGFydGlmYWN0cy5leHQgIT09ICcnXG4gIHZhciBoZWFkZXIgPSAnSGF3ayBpZD1cIicgKyBjcmVkZW50aWFscy5pZCArXG4gICAgJ1wiLCB0cz1cIicgKyBhcnRpZmFjdHMudHMgK1xuICAgICdcIiwgbm9uY2U9XCInICsgYXJ0aWZhY3RzLm5vbmNlICtcbiAgICAoYXJ0aWZhY3RzLmhhc2ggPyAnXCIsIGhhc2g9XCInICsgYXJ0aWZhY3RzLmhhc2ggOiAnJykgK1xuICAgIChoYXNFeHQgPyAnXCIsIGV4dD1cIicgKyBhcnRpZmFjdHMuZXh0LnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpIDogJycpICtcbiAgICAnXCIsIG1hYz1cIicgKyBtYWMgKyAnXCInXG5cbiAgaWYgKGFydGlmYWN0cy5hcHApIHtcbiAgICBoZWFkZXIgPSBoZWFkZXIgKyAnLCBhcHA9XCInICsgYXJ0aWZhY3RzLmFwcCArIChhcnRpZmFjdHMuZGxnID8gJ1wiLCBkbGc9XCInICsgYXJ0aWZhY3RzLmRsZyA6ICcnKSArICdcIidcbiAgfVxuXG4gIHJldHVybiBoZWFkZXJcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgY2FzZWxlc3MgPSByZXF1aXJlKCdjYXNlbGVzcycpXG52YXIgdXVpZCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKVxuXG52YXIgbWQ1ID0gaGVscGVycy5tZDVcbnZhciB0b0Jhc2U2NCA9IGhlbHBlcnMudG9CYXNlNjRcblxuZnVuY3Rpb24gQXV0aCAocmVxdWVzdCkge1xuICAvLyBkZWZpbmUgYWxsIHB1YmxpYyBwcm9wZXJ0aWVzIGhlcmVcbiAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdFxuICB0aGlzLmhhc0F1dGggPSBmYWxzZVxuICB0aGlzLnNlbnRBdXRoID0gZmFsc2VcbiAgdGhpcy5iZWFyZXJUb2tlbiA9IG51bGxcbiAgdGhpcy51c2VyID0gbnVsbFxuICB0aGlzLnBhc3MgPSBudWxsXG59XG5cbkF1dGgucHJvdG90eXBlLmJhc2ljID0gZnVuY3Rpb24gKHVzZXIsIHBhc3MsIHNlbmRJbW1lZGlhdGVseSkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgaWYgKHR5cGVvZiB1c2VyICE9PSAnc3RyaW5nJyB8fCAocGFzcyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBwYXNzICE9PSAnc3RyaW5nJykpIHtcbiAgICBzZWxmLnJlcXVlc3QuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ2F1dGgoKSByZWNlaXZlZCBpbnZhbGlkIHVzZXIgb3IgcGFzc3dvcmQnKSlcbiAgfVxuICBzZWxmLnVzZXIgPSB1c2VyXG4gIHNlbGYucGFzcyA9IHBhc3NcbiAgc2VsZi5oYXNBdXRoID0gdHJ1ZVxuICB2YXIgaGVhZGVyID0gdXNlciArICc6JyArIChwYXNzIHx8ICcnKVxuICBpZiAoc2VuZEltbWVkaWF0ZWx5IHx8IHR5cGVvZiBzZW5kSW1tZWRpYXRlbHkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIGF1dGhIZWFkZXIgPSAnQmFzaWMgJyArIHRvQmFzZTY0KGhlYWRlcilcbiAgICBzZWxmLnNlbnRBdXRoID0gdHJ1ZVxuICAgIHJldHVybiBhdXRoSGVhZGVyXG4gIH1cbn1cblxuQXV0aC5wcm90b3R5cGUuYmVhcmVyID0gZnVuY3Rpb24gKGJlYXJlciwgc2VuZEltbWVkaWF0ZWx5KSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBzZWxmLmJlYXJlclRva2VuID0gYmVhcmVyXG4gIHNlbGYuaGFzQXV0aCA9IHRydWVcbiAgaWYgKHNlbmRJbW1lZGlhdGVseSB8fCB0eXBlb2Ygc2VuZEltbWVkaWF0ZWx5ID09PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgYmVhcmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBiZWFyZXIgPSBiZWFyZXIoKVxuICAgIH1cbiAgICB2YXIgYXV0aEhlYWRlciA9ICdCZWFyZXIgJyArIChiZWFyZXIgfHwgJycpXG4gICAgc2VsZi5zZW50QXV0aCA9IHRydWVcbiAgICByZXR1cm4gYXV0aEhlYWRlclxuICB9XG59XG5cbkF1dGgucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uIChtZXRob2QsIHBhdGgsIGF1dGhIZWFkZXIpIHtcbiAgLy8gVE9ETzogTW9yZSBjb21wbGV0ZSBpbXBsZW1lbnRhdGlvbiBvZiBSRkMgMjYxNy5cbiAgLy8gICAtIGhhbmRsZSBjaGFsbGVuZ2UuZG9tYWluXG4gIC8vICAgLSBzdXBwb3J0IHFvcD1cImF1dGgtaW50XCIgb25seVxuICAvLyAgIC0gaGFuZGxlIEF1dGhlbnRpY2F0aW9uLUluZm8gKG5vdCBuZWNlc3NhcmlseT8pXG4gIC8vICAgLSBjaGVjayBjaGFsbGVuZ2Uuc3RhbGUgKG5vdCBuZWNlc3NhcmlseT8pXG4gIC8vICAgLSBpbmNyZWFzZSBuYyAobm90IG5lY2Vzc2FyaWx5PylcbiAgLy8gRm9yIHJlZmVyZW5jZTpcbiAgLy8gaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMjYxNyNzZWN0aW9uLTNcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2JhZ2Rlci9jdXJsL2Jsb2IvbWFzdGVyL2xpYi9odHRwX2RpZ2VzdC5jXG5cbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgdmFyIGNoYWxsZW5nZSA9IHt9XG4gIHZhciByZSA9IC8oW2EtejAtOV8tXSspPSg/OlwiKFteXCJdKylcInwoW2EtejAtOV8tXSspKS9naVxuICBmb3IgKDs7KSB7XG4gICAgdmFyIG1hdGNoID0gcmUuZXhlYyhhdXRoSGVhZGVyKVxuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGNoYWxsZW5nZVttYXRjaFsxXV0gPSBtYXRjaFsyXSB8fCBtYXRjaFszXVxuICB9XG5cbiAgLyoqXG4gICAqIFJGQyAyNjE3OiBoYW5kbGUgYm90aCBNRDUgYW5kIE1ENS1zZXNzIGFsZ29yaXRobXMuXG4gICAqXG4gICAqIElmIHRoZSBhbGdvcml0aG0gZGlyZWN0aXZlJ3MgdmFsdWUgaXMgXCJNRDVcIiBvciB1bnNwZWNpZmllZCwgdGhlbiBIQTEgaXNcbiAgICogICBIQTE9TUQ1KHVzZXJuYW1lOnJlYWxtOnBhc3N3b3JkKVxuICAgKiBJZiB0aGUgYWxnb3JpdGhtIGRpcmVjdGl2ZSdzIHZhbHVlIGlzIFwiTUQ1LXNlc3NcIiwgdGhlbiBIQTEgaXNcbiAgICogICBIQTE9TUQ1KE1ENSh1c2VybmFtZTpyZWFsbTpwYXNzd29yZCk6bm9uY2U6Y25vbmNlKVxuICAgKi9cbiAgdmFyIGhhMUNvbXB1dGUgPSBmdW5jdGlvbiAoYWxnb3JpdGhtLCB1c2VyLCByZWFsbSwgcGFzcywgbm9uY2UsIGNub25jZSkge1xuICAgIHZhciBoYTEgPSBtZDUodXNlciArICc6JyArIHJlYWxtICsgJzonICsgcGFzcylcbiAgICBpZiAoYWxnb3JpdGhtICYmIGFsZ29yaXRobS50b0xvd2VyQ2FzZSgpID09PSAnbWQ1LXNlc3MnKSB7XG4gICAgICByZXR1cm4gbWQ1KGhhMSArICc6JyArIG5vbmNlICsgJzonICsgY25vbmNlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaGExXG4gICAgfVxuICB9XG5cbiAgdmFyIHFvcCA9IC8oXnwsKVxccyphdXRoXFxzKigkfCwpLy50ZXN0KGNoYWxsZW5nZS5xb3ApICYmICdhdXRoJ1xuICB2YXIgbmMgPSBxb3AgJiYgJzAwMDAwMDAxJ1xuICB2YXIgY25vbmNlID0gcW9wICYmIHV1aWQoKS5yZXBsYWNlKC8tL2csICcnKVxuICB2YXIgaGExID0gaGExQ29tcHV0ZShjaGFsbGVuZ2UuYWxnb3JpdGhtLCBzZWxmLnVzZXIsIGNoYWxsZW5nZS5yZWFsbSwgc2VsZi5wYXNzLCBjaGFsbGVuZ2Uubm9uY2UsIGNub25jZSlcbiAgdmFyIGhhMiA9IG1kNShtZXRob2QgKyAnOicgKyBwYXRoKVxuICB2YXIgZGlnZXN0UmVzcG9uc2UgPSBxb3BcbiAgICA/IG1kNShoYTEgKyAnOicgKyBjaGFsbGVuZ2Uubm9uY2UgKyAnOicgKyBuYyArICc6JyArIGNub25jZSArICc6JyArIHFvcCArICc6JyArIGhhMilcbiAgICA6IG1kNShoYTEgKyAnOicgKyBjaGFsbGVuZ2Uubm9uY2UgKyAnOicgKyBoYTIpXG4gIHZhciBhdXRoVmFsdWVzID0ge1xuICAgIHVzZXJuYW1lOiBzZWxmLnVzZXIsXG4gICAgcmVhbG06IGNoYWxsZW5nZS5yZWFsbSxcbiAgICBub25jZTogY2hhbGxlbmdlLm5vbmNlLFxuICAgIHVyaTogcGF0aCxcbiAgICBxb3A6IHFvcCxcbiAgICByZXNwb25zZTogZGlnZXN0UmVzcG9uc2UsXG4gICAgbmM6IG5jLFxuICAgIGNub25jZTogY25vbmNlLFxuICAgIGFsZ29yaXRobTogY2hhbGxlbmdlLmFsZ29yaXRobSxcbiAgICBvcGFxdWU6IGNoYWxsZW5nZS5vcGFxdWVcbiAgfVxuXG4gIGF1dGhIZWFkZXIgPSBbXVxuICBmb3IgKHZhciBrIGluIGF1dGhWYWx1ZXMpIHtcbiAgICBpZiAoYXV0aFZhbHVlc1trXSkge1xuICAgICAgaWYgKGsgPT09ICdxb3AnIHx8IGsgPT09ICduYycgfHwgayA9PT0gJ2FsZ29yaXRobScpIHtcbiAgICAgICAgYXV0aEhlYWRlci5wdXNoKGsgKyAnPScgKyBhdXRoVmFsdWVzW2tdKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXV0aEhlYWRlci5wdXNoKGsgKyAnPVwiJyArIGF1dGhWYWx1ZXNba10gKyAnXCInKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBhdXRoSGVhZGVyID0gJ0RpZ2VzdCAnICsgYXV0aEhlYWRlci5qb2luKCcsICcpXG4gIHNlbGYuc2VudEF1dGggPSB0cnVlXG4gIHJldHVybiBhdXRoSGVhZGVyXG59XG5cbkF1dGgucHJvdG90eXBlLm9uUmVxdWVzdCA9IGZ1bmN0aW9uICh1c2VyLCBwYXNzLCBzZW5kSW1tZWRpYXRlbHksIGJlYXJlcikge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIHJlcXVlc3QgPSBzZWxmLnJlcXVlc3RcblxuICB2YXIgYXV0aEhlYWRlclxuICBpZiAoYmVhcmVyID09PSB1bmRlZmluZWQgJiYgdXNlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc2VsZi5yZXF1ZXN0LmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdubyBhdXRoIG1lY2hhbmlzbSBkZWZpbmVkJykpXG4gIH0gZWxzZSBpZiAoYmVhcmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICBhdXRoSGVhZGVyID0gc2VsZi5iZWFyZXIoYmVhcmVyLCBzZW5kSW1tZWRpYXRlbHkpXG4gIH0gZWxzZSB7XG4gICAgYXV0aEhlYWRlciA9IHNlbGYuYmFzaWModXNlciwgcGFzcywgc2VuZEltbWVkaWF0ZWx5KVxuICB9XG4gIGlmIChhdXRoSGVhZGVyKSB7XG4gICAgcmVxdWVzdC5zZXRIZWFkZXIoJ2F1dGhvcml6YXRpb24nLCBhdXRoSGVhZGVyKVxuICB9XG59XG5cbkF1dGgucHJvdG90eXBlLm9uUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHZhciByZXF1ZXN0ID0gc2VsZi5yZXF1ZXN0XG5cbiAgaWYgKCFzZWxmLmhhc0F1dGggfHwgc2VsZi5zZW50QXV0aCkgeyByZXR1cm4gbnVsbCB9XG5cbiAgdmFyIGMgPSBjYXNlbGVzcyhyZXNwb25zZS5oZWFkZXJzKVxuXG4gIHZhciBhdXRoSGVhZGVyID0gYy5nZXQoJ3d3dy1hdXRoZW50aWNhdGUnKVxuICB2YXIgYXV0aFZlcmIgPSBhdXRoSGVhZGVyICYmIGF1dGhIZWFkZXIuc3BsaXQoJyAnKVswXS50b0xvd2VyQ2FzZSgpXG4gIHJlcXVlc3QuZGVidWcoJ3JlYXV0aCcsIGF1dGhWZXJiKVxuXG4gIHN3aXRjaCAoYXV0aFZlcmIpIHtcbiAgICBjYXNlICdiYXNpYyc6XG4gICAgICByZXR1cm4gc2VsZi5iYXNpYyhzZWxmLnVzZXIsIHNlbGYucGFzcywgdHJ1ZSlcblxuICAgIGNhc2UgJ2JlYXJlcic6XG4gICAgICByZXR1cm4gc2VsZi5iZWFyZXIoc2VsZi5iZWFyZXJUb2tlbiwgdHJ1ZSlcblxuICAgIGNhc2UgJ2RpZ2VzdCc6XG4gICAgICByZXR1cm4gc2VsZi5kaWdlc3QocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QucGF0aCwgYXV0aEhlYWRlcilcbiAgfVxufVxuXG5leHBvcnRzLkF1dGggPSBBdXRoXG4iLCIndXNlIHN0cmljdCdcblxudmFyIHVybCA9IHJlcXVpcmUoJ3VybCcpXG52YXIgaXNVcmwgPSAvXmh0dHBzPzovXG5cbmZ1bmN0aW9uIFJlZGlyZWN0IChyZXF1ZXN0KSB7XG4gIHRoaXMucmVxdWVzdCA9IHJlcXVlc3RcbiAgdGhpcy5mb2xsb3dSZWRpcmVjdCA9IHRydWVcbiAgdGhpcy5mb2xsb3dSZWRpcmVjdHMgPSB0cnVlXG4gIHRoaXMuZm9sbG93QWxsUmVkaXJlY3RzID0gZmFsc2VcbiAgdGhpcy5mb2xsb3dPcmlnaW5hbEh0dHBNZXRob2QgPSBmYWxzZVxuICB0aGlzLmFsbG93UmVkaXJlY3QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlIH1cbiAgdGhpcy5tYXhSZWRpcmVjdHMgPSAxMFxuICB0aGlzLnJlZGlyZWN0cyA9IFtdXG4gIHRoaXMucmVkaXJlY3RzRm9sbG93ZWQgPSAwXG4gIHRoaXMucmVtb3ZlUmVmZXJlckhlYWRlciA9IGZhbHNlXG59XG5cblJlZGlyZWN0LnByb3RvdHlwZS5vblJlcXVlc3QgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBpZiAob3B0aW9ucy5tYXhSZWRpcmVjdHMgIT09IHVuZGVmaW5lZCkge1xuICAgIHNlbGYubWF4UmVkaXJlY3RzID0gb3B0aW9ucy5tYXhSZWRpcmVjdHNcbiAgfVxuICBpZiAodHlwZW9mIG9wdGlvbnMuZm9sbG93UmVkaXJlY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICBzZWxmLmFsbG93UmVkaXJlY3QgPSBvcHRpb25zLmZvbGxvd1JlZGlyZWN0XG4gIH1cbiAgaWYgKG9wdGlvbnMuZm9sbG93UmVkaXJlY3QgIT09IHVuZGVmaW5lZCkge1xuICAgIHNlbGYuZm9sbG93UmVkaXJlY3RzID0gISFvcHRpb25zLmZvbGxvd1JlZGlyZWN0XG4gIH1cbiAgaWYgKG9wdGlvbnMuZm9sbG93QWxsUmVkaXJlY3RzICE9PSB1bmRlZmluZWQpIHtcbiAgICBzZWxmLmZvbGxvd0FsbFJlZGlyZWN0cyA9IG9wdGlvbnMuZm9sbG93QWxsUmVkaXJlY3RzXG4gIH1cbiAgaWYgKHNlbGYuZm9sbG93UmVkaXJlY3RzIHx8IHNlbGYuZm9sbG93QWxsUmVkaXJlY3RzKSB7XG4gICAgc2VsZi5yZWRpcmVjdHMgPSBzZWxmLnJlZGlyZWN0cyB8fCBbXVxuICB9XG4gIGlmIChvcHRpb25zLnJlbW92ZVJlZmVyZXJIZWFkZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIHNlbGYucmVtb3ZlUmVmZXJlckhlYWRlciA9IG9wdGlvbnMucmVtb3ZlUmVmZXJlckhlYWRlclxuICB9XG4gIGlmIChvcHRpb25zLmZvbGxvd09yaWdpbmFsSHR0cE1ldGhvZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc2VsZi5mb2xsb3dPcmlnaW5hbEh0dHBNZXRob2QgPSBvcHRpb25zLmZvbGxvd09yaWdpbmFsSHR0cE1ldGhvZFxuICB9XG59XG5cblJlZGlyZWN0LnByb3RvdHlwZS5yZWRpcmVjdFRvID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgcmVxdWVzdCA9IHNlbGYucmVxdWVzdFxuXG4gIHZhciByZWRpcmVjdFRvID0gbnVsbFxuICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA+PSAzMDAgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDQwMCAmJiByZXNwb25zZS5jYXNlbGVzcy5oYXMoJ2xvY2F0aW9uJykpIHtcbiAgICB2YXIgbG9jYXRpb24gPSByZXNwb25zZS5jYXNlbGVzcy5nZXQoJ2xvY2F0aW9uJylcbiAgICByZXF1ZXN0LmRlYnVnKCdyZWRpcmVjdCcsIGxvY2F0aW9uKVxuXG4gICAgaWYgKHNlbGYuZm9sbG93QWxsUmVkaXJlY3RzKSB7XG4gICAgICByZWRpcmVjdFRvID0gbG9jYXRpb25cbiAgICB9IGVsc2UgaWYgKHNlbGYuZm9sbG93UmVkaXJlY3RzKSB7XG4gICAgICBzd2l0Y2ggKHJlcXVlc3QubWV0aG9kKSB7XG4gICAgICAgIGNhc2UgJ1BBVENIJzpcbiAgICAgICAgY2FzZSAnUFVUJzpcbiAgICAgICAgY2FzZSAnUE9TVCc6XG4gICAgICAgIGNhc2UgJ0RFTEVURSc6XG4gICAgICAgICAgLy8gRG8gbm90IGZvbGxvdyByZWRpcmVjdHNcbiAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJlZGlyZWN0VG8gPSBsb2NhdGlvblxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDQwMSkge1xuICAgIHZhciBhdXRoSGVhZGVyID0gcmVxdWVzdC5fYXV0aC5vblJlc3BvbnNlKHJlc3BvbnNlKVxuICAgIGlmIChhdXRoSGVhZGVyKSB7XG4gICAgICByZXF1ZXN0LnNldEhlYWRlcignYXV0aG9yaXphdGlvbicsIGF1dGhIZWFkZXIpXG4gICAgICByZWRpcmVjdFRvID0gcmVxdWVzdC51cmlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlZGlyZWN0VG9cbn1cblxuUmVkaXJlY3QucHJvdG90eXBlLm9uUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHZhciByZXF1ZXN0ID0gc2VsZi5yZXF1ZXN0XG5cbiAgdmFyIHJlZGlyZWN0VG8gPSBzZWxmLnJlZGlyZWN0VG8ocmVzcG9uc2UpXG4gIGlmICghcmVkaXJlY3RUbyB8fCAhc2VsZi5hbGxvd1JlZGlyZWN0LmNhbGwocmVxdWVzdCwgcmVzcG9uc2UpKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXF1ZXN0LmRlYnVnKCdyZWRpcmVjdCB0bycsIHJlZGlyZWN0VG8pXG5cbiAgLy8gaWdub3JlIGFueSBwb3RlbnRpYWwgcmVzcG9uc2UgYm9keS4gIGl0IGNhbm5vdCBwb3NzaWJseSBiZSB1c2VmdWxcbiAgLy8gdG8gdXMgYXQgdGhpcyBwb2ludC5cbiAgLy8gcmVzcG9uc2UucmVzdW1lIHNob3VsZCBiZSBkZWZpbmVkLCBidXQgY2hlY2sgYW55d2F5IGJlZm9yZSBjYWxsaW5nLiBXb3JrYXJvdW5kIGZvciBicm93c2VyaWZ5LlxuICBpZiAocmVzcG9uc2UucmVzdW1lKSB7XG4gICAgcmVzcG9uc2UucmVzdW1lKClcbiAgfVxuXG4gIGlmIChzZWxmLnJlZGlyZWN0c0ZvbGxvd2VkID49IHNlbGYubWF4UmVkaXJlY3RzKSB7XG4gICAgcmVxdWVzdC5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignRXhjZWVkZWQgbWF4UmVkaXJlY3RzLiBQcm9iYWJseSBzdHVjayBpbiBhIHJlZGlyZWN0IGxvb3AgJyArIHJlcXVlc3QudXJpLmhyZWYpKVxuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHNlbGYucmVkaXJlY3RzRm9sbG93ZWQgKz0gMVxuXG4gIGlmICghaXNVcmwudGVzdChyZWRpcmVjdFRvKSkge1xuICAgIHJlZGlyZWN0VG8gPSB1cmwucmVzb2x2ZShyZXF1ZXN0LnVyaS5ocmVmLCByZWRpcmVjdFRvKVxuICB9XG5cbiAgdmFyIHVyaVByZXYgPSByZXF1ZXN0LnVyaVxuICByZXF1ZXN0LnVyaSA9IHVybC5wYXJzZShyZWRpcmVjdFRvKVxuXG4gIC8vIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB3ZSBjaGFuZ2UgcHJvdG9jb2wgZnJvbSBodHRwcyB0byBodHRwIG9yIHZpY2UgdmVyc2FcbiAgaWYgKHJlcXVlc3QudXJpLnByb3RvY29sICE9PSB1cmlQcmV2LnByb3RvY29sKSB7XG4gICAgZGVsZXRlIHJlcXVlc3QuYWdlbnRcbiAgfVxuXG4gIHNlbGYucmVkaXJlY3RzLnB1c2goeyBzdGF0dXNDb2RlOiByZXNwb25zZS5zdGF0dXNDb2RlLCByZWRpcmVjdFVyaTogcmVkaXJlY3RUbyB9KVxuXG4gIGlmIChzZWxmLmZvbGxvd0FsbFJlZGlyZWN0cyAmJiByZXF1ZXN0Lm1ldGhvZCAhPT0gJ0hFQUQnICYmXG4gICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSAhPT0gNDAxICYmIHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDMwNykge1xuICAgIHJlcXVlc3QubWV0aG9kID0gc2VsZi5mb2xsb3dPcmlnaW5hbEh0dHBNZXRob2QgPyByZXF1ZXN0Lm1ldGhvZCA6ICdHRVQnXG4gIH1cbiAgLy8gcmVxdWVzdC5tZXRob2QgPSAnR0VUJyAvLyBGb3JjZSBhbGwgcmVkaXJlY3RzIHRvIHVzZSBHRVQgfHwgY29tbWVudGVkIG91dCBmaXhlcyAjMjE1XG4gIGRlbGV0ZSByZXF1ZXN0LnNyY1xuICBkZWxldGUgcmVxdWVzdC5yZXFcbiAgZGVsZXRlIHJlcXVlc3QuX3N0YXJ0ZWRcbiAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDQwMSAmJiByZXNwb25zZS5zdGF0dXNDb2RlICE9PSAzMDcpIHtcbiAgICAvLyBSZW1vdmUgcGFyYW1ldGVycyBmcm9tIHRoZSBwcmV2aW91cyByZXNwb25zZSwgdW5sZXNzIHRoaXMgaXMgdGhlIHNlY29uZCByZXF1ZXN0XG4gICAgLy8gZm9yIGEgc2VydmVyIHRoYXQgcmVxdWlyZXMgZGlnZXN0IGF1dGhlbnRpY2F0aW9uLlxuICAgIGRlbGV0ZSByZXF1ZXN0LmJvZHlcbiAgICBkZWxldGUgcmVxdWVzdC5fZm9ybVxuICAgIGlmIChyZXF1ZXN0LmhlYWRlcnMpIHtcbiAgICAgIHJlcXVlc3QucmVtb3ZlSGVhZGVyKCdob3N0JylcbiAgICAgIHJlcXVlc3QucmVtb3ZlSGVhZGVyKCdjb250ZW50LXR5cGUnKVxuICAgICAgcmVxdWVzdC5yZW1vdmVIZWFkZXIoJ2NvbnRlbnQtbGVuZ3RoJylcbiAgICAgIGlmIChyZXF1ZXN0LnVyaS5ob3N0bmFtZSAhPT0gcmVxdWVzdC5vcmlnaW5hbEhvc3Quc3BsaXQoJzonKVswXSkge1xuICAgICAgICAvLyBSZW1vdmUgYXV0aG9yaXphdGlvbiBpZiBjaGFuZ2luZyBob3N0bmFtZXMgKGJ1dCBub3QgaWYganVzdFxuICAgICAgICAvLyBjaGFuZ2luZyBwb3J0cyBvciBwcm90b2NvbHMpLiAgVGhpcyBtYXRjaGVzIHRoZSBiZWhhdmlvciBvZiBjdXJsOlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYmFnZGVyL2N1cmwvYmxvYi82YmViMGVlZS9saWIvaHR0cC5jI0w3MTBcbiAgICAgICAgcmVxdWVzdC5yZW1vdmVIZWFkZXIoJ2F1dGhvcml6YXRpb24nKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICghc2VsZi5yZW1vdmVSZWZlcmVySGVhZGVyKSB7XG4gICAgcmVxdWVzdC5zZXRIZWFkZXIoJ3JlZmVyZXInLCB1cmlQcmV2LmhyZWYpXG4gIH1cblxuICByZXF1ZXN0LmVtaXQoJ3JlZGlyZWN0JylcblxuICByZXF1ZXN0LmluaXQoKVxuXG4gIHJldHVybiB0cnVlXG59XG5cbmV4cG9ydHMuUmVkaXJlY3QgPSBSZWRpcmVjdFxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciB1cmwgPSByZXF1aXJlKCd1cmwnKVxudmFyIHR1bm5lbCA9IHJlcXVpcmUoJ3R1bm5lbC1hZ2VudCcpXG5cbnZhciBkZWZhdWx0UHJveHlIZWFkZXJXaGl0ZUxpc3QgPSBbXG4gICdhY2NlcHQnLFxuICAnYWNjZXB0LWNoYXJzZXQnLFxuICAnYWNjZXB0LWVuY29kaW5nJyxcbiAgJ2FjY2VwdC1sYW5ndWFnZScsXG4gICdhY2NlcHQtcmFuZ2VzJyxcbiAgJ2NhY2hlLWNvbnRyb2wnLFxuICAnY29udGVudC1lbmNvZGluZycsXG4gICdjb250ZW50LWxhbmd1YWdlJyxcbiAgJ2NvbnRlbnQtbG9jYXRpb24nLFxuICAnY29udGVudC1tZDUnLFxuICAnY29udGVudC1yYW5nZScsXG4gICdjb250ZW50LXR5cGUnLFxuICAnY29ubmVjdGlvbicsXG4gICdkYXRlJyxcbiAgJ2V4cGVjdCcsXG4gICdtYXgtZm9yd2FyZHMnLFxuICAncHJhZ21hJyxcbiAgJ3JlZmVyZXInLFxuICAndGUnLFxuICAndXNlci1hZ2VudCcsXG4gICd2aWEnXG5dXG5cbnZhciBkZWZhdWx0UHJveHlIZWFkZXJFeGNsdXNpdmVMaXN0ID0gW1xuICAncHJveHktYXV0aG9yaXphdGlvbidcbl1cblxuZnVuY3Rpb24gY29uc3RydWN0UHJveHlIb3N0ICh1cmlPYmplY3QpIHtcbiAgdmFyIHBvcnQgPSB1cmlPYmplY3QucG9ydFxuICB2YXIgcHJvdG9jb2wgPSB1cmlPYmplY3QucHJvdG9jb2xcbiAgdmFyIHByb3h5SG9zdCA9IHVyaU9iamVjdC5ob3N0bmFtZSArICc6J1xuXG4gIGlmIChwb3J0KSB7XG4gICAgcHJveHlIb3N0ICs9IHBvcnRcbiAgfSBlbHNlIGlmIChwcm90b2NvbCA9PT0gJ2h0dHBzOicpIHtcbiAgICBwcm94eUhvc3QgKz0gJzQ0MydcbiAgfSBlbHNlIHtcbiAgICBwcm94eUhvc3QgKz0gJzgwJ1xuICB9XG5cbiAgcmV0dXJuIHByb3h5SG9zdFxufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RQcm94eUhlYWRlcldoaXRlTGlzdCAoaGVhZGVycywgcHJveHlIZWFkZXJXaGl0ZUxpc3QpIHtcbiAgdmFyIHdoaXRlTGlzdCA9IHByb3h5SGVhZGVyV2hpdGVMaXN0XG4gICAgLnJlZHVjZShmdW5jdGlvbiAoc2V0LCBoZWFkZXIpIHtcbiAgICAgIHNldFtoZWFkZXIudG9Mb3dlckNhc2UoKV0gPSB0cnVlXG4gICAgICByZXR1cm4gc2V0XG4gICAgfSwge30pXG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGhlYWRlcnMpXG4gICAgLmZpbHRlcihmdW5jdGlvbiAoaGVhZGVyKSB7XG4gICAgICByZXR1cm4gd2hpdGVMaXN0W2hlYWRlci50b0xvd2VyQ2FzZSgpXVxuICAgIH0pXG4gICAgLnJlZHVjZShmdW5jdGlvbiAoc2V0LCBoZWFkZXIpIHtcbiAgICAgIHNldFtoZWFkZXJdID0gaGVhZGVyc1toZWFkZXJdXG4gICAgICByZXR1cm4gc2V0XG4gICAgfSwge30pXG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFR1bm5lbE9wdGlvbnMgKHJlcXVlc3QsIHByb3h5SGVhZGVycykge1xuICB2YXIgcHJveHkgPSByZXF1ZXN0LnByb3h5XG5cbiAgdmFyIHR1bm5lbE9wdGlvbnMgPSB7XG4gICAgcHJveHk6IHtcbiAgICAgIGhvc3Q6IHByb3h5Lmhvc3RuYW1lLFxuICAgICAgcG9ydDogK3Byb3h5LnBvcnQsXG4gICAgICBwcm94eUF1dGg6IHByb3h5LmF1dGgsXG4gICAgICBoZWFkZXJzOiBwcm94eUhlYWRlcnNcbiAgICB9LFxuICAgIGhlYWRlcnM6IHJlcXVlc3QuaGVhZGVycyxcbiAgICBjYTogcmVxdWVzdC5jYSxcbiAgICBjZXJ0OiByZXF1ZXN0LmNlcnQsXG4gICAga2V5OiByZXF1ZXN0LmtleSxcbiAgICBwYXNzcGhyYXNlOiByZXF1ZXN0LnBhc3NwaHJhc2UsXG4gICAgcGZ4OiByZXF1ZXN0LnBmeCxcbiAgICBjaXBoZXJzOiByZXF1ZXN0LmNpcGhlcnMsXG4gICAgcmVqZWN0VW5hdXRob3JpemVkOiByZXF1ZXN0LnJlamVjdFVuYXV0aG9yaXplZCxcbiAgICBzZWN1cmVPcHRpb25zOiByZXF1ZXN0LnNlY3VyZU9wdGlvbnMsXG4gICAgc2VjdXJlUHJvdG9jb2w6IHJlcXVlc3Quc2VjdXJlUHJvdG9jb2xcbiAgfVxuXG4gIHJldHVybiB0dW5uZWxPcHRpb25zXG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFR1bm5lbEZuTmFtZSAodXJpLCBwcm94eSkge1xuICB2YXIgdXJpUHJvdG9jb2wgPSAodXJpLnByb3RvY29sID09PSAnaHR0cHM6JyA/ICdodHRwcycgOiAnaHR0cCcpXG4gIHZhciBwcm94eVByb3RvY29sID0gKHByb3h5LnByb3RvY29sID09PSAnaHR0cHM6JyA/ICdIdHRwcycgOiAnSHR0cCcpXG4gIHJldHVybiBbdXJpUHJvdG9jb2wsIHByb3h5UHJvdG9jb2xdLmpvaW4oJ092ZXInKVxufVxuXG5mdW5jdGlvbiBnZXRUdW5uZWxGbiAocmVxdWVzdCkge1xuICB2YXIgdXJpID0gcmVxdWVzdC51cmlcbiAgdmFyIHByb3h5ID0gcmVxdWVzdC5wcm94eVxuICB2YXIgdHVubmVsRm5OYW1lID0gY29uc3RydWN0VHVubmVsRm5OYW1lKHVyaSwgcHJveHkpXG4gIHJldHVybiB0dW5uZWxbdHVubmVsRm5OYW1lXVxufVxuXG5mdW5jdGlvbiBUdW5uZWwgKHJlcXVlc3QpIHtcbiAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdFxuICB0aGlzLnByb3h5SGVhZGVyV2hpdGVMaXN0ID0gZGVmYXVsdFByb3h5SGVhZGVyV2hpdGVMaXN0XG4gIHRoaXMucHJveHlIZWFkZXJFeGNsdXNpdmVMaXN0ID0gW11cbiAgaWYgKHR5cGVvZiByZXF1ZXN0LnR1bm5lbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aGlzLnR1bm5lbE92ZXJyaWRlID0gcmVxdWVzdC50dW5uZWxcbiAgfVxufVxuXG5UdW5uZWwucHJvdG90eXBlLmlzRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHZhciByZXF1ZXN0ID0gc2VsZi5yZXF1ZXN0XG4gICAgLy8gVHVubmVsIEhUVFBTIGJ5IGRlZmF1bHQuIEFsbG93IHRoZSB1c2VyIHRvIG92ZXJyaWRlIHRoaXMgc2V0dGluZy5cblxuICAvLyBJZiBzZWxmLnR1bm5lbE92ZXJyaWRlIGlzIHNldCAodGhlIHVzZXIgc3BlY2lmaWVkIGEgdmFsdWUpLCB1c2UgaXQuXG4gIGlmICh0eXBlb2Ygc2VsZi50dW5uZWxPdmVycmlkZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gc2VsZi50dW5uZWxPdmVycmlkZVxuICB9XG5cbiAgLy8gSWYgdGhlIGRlc3RpbmF0aW9uIGlzIEhUVFBTLCB0dW5uZWwuXG4gIGlmIChyZXF1ZXN0LnVyaS5wcm90b2NvbCA9PT0gJ2h0dHBzOicpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBkbyBub3QgdXNlIHR1bm5lbC5cbiAgcmV0dXJuIGZhbHNlXG59XG5cblR1bm5lbC5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIHJlcXVlc3QgPSBzZWxmLnJlcXVlc3RcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXG4gIGlmICh0eXBlb2YgcmVxdWVzdC5wcm94eSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXF1ZXN0LnByb3h5ID0gdXJsLnBhcnNlKHJlcXVlc3QucHJveHkpXG4gIH1cblxuICBpZiAoIXJlcXVlc3QucHJveHkgfHwgIXJlcXVlc3QudHVubmVsKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvLyBTZXR1cCBQcm94eSBIZWFkZXIgRXhjbHVzaXZlIExpc3QgYW5kIFdoaXRlIExpc3RcbiAgaWYgKG9wdGlvbnMucHJveHlIZWFkZXJXaGl0ZUxpc3QpIHtcbiAgICBzZWxmLnByb3h5SGVhZGVyV2hpdGVMaXN0ID0gb3B0aW9ucy5wcm94eUhlYWRlcldoaXRlTGlzdFxuICB9XG4gIGlmIChvcHRpb25zLnByb3h5SGVhZGVyRXhjbHVzaXZlTGlzdCkge1xuICAgIHNlbGYucHJveHlIZWFkZXJFeGNsdXNpdmVMaXN0ID0gb3B0aW9ucy5wcm94eUhlYWRlckV4Y2x1c2l2ZUxpc3RcbiAgfVxuXG4gIHZhciBwcm94eUhlYWRlckV4Y2x1c2l2ZUxpc3QgPSBzZWxmLnByb3h5SGVhZGVyRXhjbHVzaXZlTGlzdC5jb25jYXQoZGVmYXVsdFByb3h5SGVhZGVyRXhjbHVzaXZlTGlzdClcbiAgdmFyIHByb3h5SGVhZGVyV2hpdGVMaXN0ID0gc2VsZi5wcm94eUhlYWRlcldoaXRlTGlzdC5jb25jYXQocHJveHlIZWFkZXJFeGNsdXNpdmVMaXN0KVxuXG4gIC8vIFNldHVwIFByb3h5IEhlYWRlcnMgYW5kIFByb3h5IEhlYWRlcnMgSG9zdFxuICAvLyBPbmx5IHNlbmQgdGhlIFByb3h5IFdoaXRlIExpc3RlZCBIZWFkZXIgbmFtZXNcbiAgdmFyIHByb3h5SGVhZGVycyA9IGNvbnN0cnVjdFByb3h5SGVhZGVyV2hpdGVMaXN0KHJlcXVlc3QuaGVhZGVycywgcHJveHlIZWFkZXJXaGl0ZUxpc3QpXG4gIHByb3h5SGVhZGVycy5ob3N0ID0gY29uc3RydWN0UHJveHlIb3N0KHJlcXVlc3QudXJpKVxuXG4gIHByb3h5SGVhZGVyRXhjbHVzaXZlTGlzdC5mb3JFYWNoKHJlcXVlc3QucmVtb3ZlSGVhZGVyLCByZXF1ZXN0KVxuXG4gIC8vIFNldCBBZ2VudCBmcm9tIFR1bm5lbCBEYXRhXG4gIHZhciB0dW5uZWxGbiA9IGdldFR1bm5lbEZuKHJlcXVlc3QpXG4gIHZhciB0dW5uZWxPcHRpb25zID0gY29uc3RydWN0VHVubmVsT3B0aW9ucyhyZXF1ZXN0LCBwcm94eUhlYWRlcnMpXG4gIHJlcXVlc3QuYWdlbnQgPSB0dW5uZWxGbih0dW5uZWxPcHRpb25zKVxuXG4gIHJldHVybiB0cnVlXG59XG5cblR1bm5lbC5kZWZhdWx0UHJveHlIZWFkZXJXaGl0ZUxpc3QgPSBkZWZhdWx0UHJveHlIZWFkZXJXaGl0ZUxpc3RcblR1bm5lbC5kZWZhdWx0UHJveHlIZWFkZXJFeGNsdXNpdmVMaXN0ID0gZGVmYXVsdFByb3h5SGVhZGVyRXhjbHVzaXZlTGlzdFxuZXhwb3J0cy5UdW5uZWwgPSBUdW5uZWxcbiIsIid1c2Ugc3RyaWN0J1xuXG5mdW5jdGlvbiBmb3JtYXRIb3N0bmFtZSAoaG9zdG5hbWUpIHtcbiAgLy8gY2Fub25pY2FsaXplIHRoZSBob3N0bmFtZSwgc28gdGhhdCAnb29nbGUuY29tJyB3b24ndCBtYXRjaCAnZ29vZ2xlLmNvbSdcbiAgcmV0dXJuIGhvc3RuYW1lLnJlcGxhY2UoL15cXC4qLywgJy4nKS50b0xvd2VyQ2FzZSgpXG59XG5cbmZ1bmN0aW9uIHBhcnNlTm9Qcm94eVpvbmUgKHpvbmUpIHtcbiAgem9uZSA9IHpvbmUudHJpbSgpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgem9uZVBhcnRzID0gem9uZS5zcGxpdCgnOicsIDIpXG4gIHZhciB6b25lSG9zdCA9IGZvcm1hdEhvc3RuYW1lKHpvbmVQYXJ0c1swXSlcbiAgdmFyIHpvbmVQb3J0ID0gem9uZVBhcnRzWzFdXG4gIHZhciBoYXNQb3J0ID0gem9uZS5pbmRleE9mKCc6JykgPiAtMVxuXG4gIHJldHVybiB7aG9zdG5hbWU6IHpvbmVIb3N0LCBwb3J0OiB6b25lUG9ydCwgaGFzUG9ydDogaGFzUG9ydH1cbn1cblxuZnVuY3Rpb24gdXJpSW5Ob1Byb3h5ICh1cmksIG5vUHJveHkpIHtcbiAgdmFyIHBvcnQgPSB1cmkucG9ydCB8fCAodXJpLnByb3RvY29sID09PSAnaHR0cHM6JyA/ICc0NDMnIDogJzgwJylcbiAgdmFyIGhvc3RuYW1lID0gZm9ybWF0SG9zdG5hbWUodXJpLmhvc3RuYW1lKVxuICB2YXIgbm9Qcm94eUxpc3QgPSBub1Byb3h5LnNwbGl0KCcsJylcblxuICAvLyBpdGVyYXRlIHRocm91Z2ggdGhlIG5vUHJveHlMaXN0IHVudGlsIGl0IGZpbmRzIGEgbWF0Y2guXG4gIHJldHVybiBub1Byb3h5TGlzdC5tYXAocGFyc2VOb1Byb3h5Wm9uZSkuc29tZShmdW5jdGlvbiAobm9Qcm94eVpvbmUpIHtcbiAgICB2YXIgaXNNYXRjaGVkQXQgPSBob3N0bmFtZS5pbmRleE9mKG5vUHJveHlab25lLmhvc3RuYW1lKVxuICAgIHZhciBob3N0bmFtZU1hdGNoZWQgPSAoXG4gICAgICBpc01hdGNoZWRBdCA+IC0xICYmXG4gICAgICAgIChpc01hdGNoZWRBdCA9PT0gaG9zdG5hbWUubGVuZ3RoIC0gbm9Qcm94eVpvbmUuaG9zdG5hbWUubGVuZ3RoKVxuICAgIClcblxuICAgIGlmIChub1Byb3h5Wm9uZS5oYXNQb3J0KSB7XG4gICAgICByZXR1cm4gKHBvcnQgPT09IG5vUHJveHlab25lLnBvcnQpICYmIGhvc3RuYW1lTWF0Y2hlZFxuICAgIH1cblxuICAgIHJldHVybiBob3N0bmFtZU1hdGNoZWRcbiAgfSlcbn1cblxuZnVuY3Rpb24gZ2V0UHJveHlGcm9tVVJJICh1cmkpIHtcbiAgLy8gRGVjaWRlIHRoZSBwcm9wZXIgcmVxdWVzdCBwcm94eSB0byB1c2UgYmFzZWQgb24gdGhlIHJlcXVlc3QgVVJJIG9iamVjdCBhbmQgdGhlXG4gIC8vIGVudmlyb25tZW50YWwgdmFyaWFibGVzIChOT19QUk9YWSwgSFRUUF9QUk9YWSwgZXRjLilcbiAgLy8gcmVzcGVjdCBOT19QUk9YWSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgKHNlZTogaHR0cDovL2x5bnguaXNjLm9yZy9jdXJyZW50L2JyZWFrb3V0L2x5bnhfaGVscC9rZXlzdHJva2VzL2Vudmlyb25tZW50cy5odG1sKVxuXG4gIHZhciBub1Byb3h5ID0gcHJvY2Vzcy5lbnYuTk9fUFJPWFkgfHwgcHJvY2Vzcy5lbnYubm9fcHJveHkgfHwgJydcblxuICAvLyBpZiB0aGUgbm9Qcm94eSBpcyBhIHdpbGRjYXJkIHRoZW4gcmV0dXJuIG51bGxcblxuICBpZiAobm9Qcm94eSA9PT0gJyonKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8vIGlmIHRoZSBub1Byb3h5IGlzIG5vdCBlbXB0eSBhbmQgdGhlIHVyaSBpcyBmb3VuZCByZXR1cm4gbnVsbFxuXG4gIGlmIChub1Byb3h5ICE9PSAnJyAmJiB1cmlJbk5vUHJveHkodXJpLCBub1Byb3h5KSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICAvLyBDaGVjayBmb3IgSFRUUCBvciBIVFRQUyBQcm94eSBpbiBlbnZpcm9ubWVudCBFbHNlIGRlZmF1bHQgdG8gbnVsbFxuXG4gIGlmICh1cmkucHJvdG9jb2wgPT09ICdodHRwOicpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5lbnYuSFRUUF9QUk9YWSB8fFxuICAgICAgcHJvY2Vzcy5lbnYuaHR0cF9wcm94eSB8fCBudWxsXG4gIH1cblxuICBpZiAodXJpLnByb3RvY29sID09PSAnaHR0cHM6Jykge1xuICAgIHJldHVybiBwcm9jZXNzLmVudi5IVFRQU19QUk9YWSB8fFxuICAgICAgcHJvY2Vzcy5lbnYuaHR0cHNfcHJveHkgfHxcbiAgICAgIHByb2Nlc3MuZW52LkhUVFBfUFJPWFkgfHxcbiAgICAgIHByb2Nlc3MuZW52Lmh0dHBfcHJveHkgfHwgbnVsbFxuICB9XG5cbiAgLy8gaWYgbm9uZSBvZiB0aGF0IHdvcmtzLCByZXR1cm4gbnVsbFxuICAvLyAoV2hhdCB1cmkgcHJvdG9jb2wgYXJlIHlvdSB1c2luZyB0aGVuPylcblxuICByZXR1cm4gbnVsbFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFByb3h5RnJvbVVSSVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciB1cmwgPSByZXF1aXJlKCd1cmwnKVxudmFyIHFzID0gcmVxdWlyZSgncXMnKVxudmFyIGNhc2VsZXNzID0gcmVxdWlyZSgnY2FzZWxlc3MnKVxudmFyIHV1aWQgPSByZXF1aXJlKCd1dWlkL3Y0JylcbnZhciBvYXV0aCA9IHJlcXVpcmUoJ29hdXRoLXNpZ24nKVxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcblxuZnVuY3Rpb24gT0F1dGggKHJlcXVlc3QpIHtcbiAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdFxuICB0aGlzLnBhcmFtcyA9IG51bGxcbn1cblxuT0F1dGgucHJvdG90eXBlLmJ1aWxkUGFyYW1zID0gZnVuY3Rpb24gKF9vYXV0aCwgdXJpLCBtZXRob2QsIHF1ZXJ5LCBmb3JtLCBxc0xpYikge1xuICB2YXIgb2EgPSB7fVxuICBmb3IgKHZhciBpIGluIF9vYXV0aCkge1xuICAgIG9hWydvYXV0aF8nICsgaV0gPSBfb2F1dGhbaV1cbiAgfVxuICBpZiAoIW9hLm9hdXRoX3ZlcnNpb24pIHtcbiAgICBvYS5vYXV0aF92ZXJzaW9uID0gJzEuMCdcbiAgfVxuICBpZiAoIW9hLm9hdXRoX3RpbWVzdGFtcCkge1xuICAgIG9hLm9hdXRoX3RpbWVzdGFtcCA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApLnRvU3RyaW5nKClcbiAgfVxuICBpZiAoIW9hLm9hdXRoX25vbmNlKSB7XG4gICAgb2Eub2F1dGhfbm9uY2UgPSB1dWlkKCkucmVwbGFjZSgvLS9nLCAnJylcbiAgfVxuICBpZiAoIW9hLm9hdXRoX3NpZ25hdHVyZV9tZXRob2QpIHtcbiAgICBvYS5vYXV0aF9zaWduYXR1cmVfbWV0aG9kID0gJ0hNQUMtU0hBMSdcbiAgfVxuXG4gIHZhciBjb25zdW1lcl9zZWNyZXRfb3JfcHJpdmF0ZV9rZXkgPSBvYS5vYXV0aF9jb25zdW1lcl9zZWNyZXQgfHwgb2Eub2F1dGhfcHJpdmF0ZV9rZXkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjYW1lbGNhc2VcbiAgZGVsZXRlIG9hLm9hdXRoX2NvbnN1bWVyX3NlY3JldFxuICBkZWxldGUgb2Eub2F1dGhfcHJpdmF0ZV9rZXlcblxuICB2YXIgdG9rZW5fc2VjcmV0ID0gb2Eub2F1dGhfdG9rZW5fc2VjcmV0IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY2FtZWxjYXNlXG4gIGRlbGV0ZSBvYS5vYXV0aF90b2tlbl9zZWNyZXRcblxuICB2YXIgcmVhbG0gPSBvYS5vYXV0aF9yZWFsbVxuICBkZWxldGUgb2Eub2F1dGhfcmVhbG1cbiAgZGVsZXRlIG9hLm9hdXRoX3RyYW5zcG9ydF9tZXRob2RcblxuICB2YXIgYmFzZXVybCA9IHVyaS5wcm90b2NvbCArICcvLycgKyB1cmkuaG9zdCArIHVyaS5wYXRobmFtZVxuICB2YXIgcGFyYW1zID0gcXNMaWIucGFyc2UoW10uY29uY2F0KHF1ZXJ5LCBmb3JtLCBxc0xpYi5zdHJpbmdpZnkob2EpKS5qb2luKCcmJykpXG5cbiAgb2Eub2F1dGhfc2lnbmF0dXJlID0gb2F1dGguc2lnbihcbiAgICBvYS5vYXV0aF9zaWduYXR1cmVfbWV0aG9kLFxuICAgIG1ldGhvZCxcbiAgICBiYXNldXJsLFxuICAgIHBhcmFtcyxcbiAgICBjb25zdW1lcl9zZWNyZXRfb3JfcHJpdmF0ZV9rZXksIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY2FtZWxjYXNlXG4gICAgdG9rZW5fc2VjcmV0IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY2FtZWxjYXNlXG4gIClcblxuICBpZiAocmVhbG0pIHtcbiAgICBvYS5yZWFsbSA9IHJlYWxtXG4gIH1cblxuICByZXR1cm4gb2Fcbn1cblxuT0F1dGgucHJvdG90eXBlLmJ1aWxkQm9keUhhc2ggPSBmdW5jdGlvbiAoX29hdXRoLCBib2R5KSB7XG4gIGlmIChbJ0hNQUMtU0hBMScsICdSU0EtU0hBMSddLmluZGV4T2YoX29hdXRoLnNpZ25hdHVyZV9tZXRob2QgfHwgJ0hNQUMtU0hBMScpIDwgMCkge1xuICAgIHRoaXMucmVxdWVzdC5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignb2F1dGg6ICcgKyBfb2F1dGguc2lnbmF0dXJlX21ldGhvZCArXG4gICAgICAnIHNpZ25hdHVyZV9tZXRob2Qgbm90IHN1cHBvcnRlZCB3aXRoIGJvZHlfaGFzaCBzaWduaW5nLicpKVxuICB9XG5cbiAgdmFyIHNoYXN1bSA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJylcbiAgc2hhc3VtLnVwZGF0ZShib2R5IHx8ICcnKVxuICB2YXIgc2hhMSA9IHNoYXN1bS5kaWdlc3QoJ2hleCcpXG5cbiAgcmV0dXJuIEJ1ZmZlci5mcm9tKHNoYTEsICdoZXgnKS50b1N0cmluZygnYmFzZTY0Jylcbn1cblxuT0F1dGgucHJvdG90eXBlLmNvbmNhdFBhcmFtcyA9IGZ1bmN0aW9uIChvYSwgc2VwLCB3cmFwKSB7XG4gIHdyYXAgPSB3cmFwIHx8ICcnXG5cbiAgdmFyIHBhcmFtcyA9IE9iamVjdC5rZXlzKG9hKS5maWx0ZXIoZnVuY3Rpb24gKGkpIHtcbiAgICByZXR1cm4gaSAhPT0gJ3JlYWxtJyAmJiBpICE9PSAnb2F1dGhfc2lnbmF0dXJlJ1xuICB9KS5zb3J0KClcblxuICBpZiAob2EucmVhbG0pIHtcbiAgICBwYXJhbXMuc3BsaWNlKDAsIDAsICdyZWFsbScpXG4gIH1cbiAgcGFyYW1zLnB1c2goJ29hdXRoX3NpZ25hdHVyZScpXG5cbiAgcmV0dXJuIHBhcmFtcy5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICByZXR1cm4gaSArICc9JyArIHdyYXAgKyBvYXV0aC5yZmMzOTg2KG9hW2ldKSArIHdyYXBcbiAgfSkuam9pbihzZXApXG59XG5cbk9BdXRoLnByb3RvdHlwZS5vblJlcXVlc3QgPSBmdW5jdGlvbiAoX29hdXRoKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBzZWxmLnBhcmFtcyA9IF9vYXV0aFxuXG4gIHZhciB1cmkgPSBzZWxmLnJlcXVlc3QudXJpIHx8IHt9XG4gIHZhciBtZXRob2QgPSBzZWxmLnJlcXVlc3QubWV0aG9kIHx8ICcnXG4gIHZhciBoZWFkZXJzID0gY2FzZWxlc3Moc2VsZi5yZXF1ZXN0LmhlYWRlcnMpXG4gIHZhciBib2R5ID0gc2VsZi5yZXF1ZXN0LmJvZHkgfHwgJydcbiAgdmFyIHFzTGliID0gc2VsZi5yZXF1ZXN0LnFzTGliIHx8IHFzXG5cbiAgdmFyIGZvcm1cbiAgdmFyIHF1ZXJ5XG4gIHZhciBjb250ZW50VHlwZSA9IGhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSB8fCAnJ1xuICB2YXIgZm9ybUNvbnRlbnRUeXBlID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgdmFyIHRyYW5zcG9ydCA9IF9vYXV0aC50cmFuc3BvcnRfbWV0aG9kIHx8ICdoZWFkZXInXG5cbiAgaWYgKGNvbnRlbnRUeXBlLnNsaWNlKDAsIGZvcm1Db250ZW50VHlwZS5sZW5ndGgpID09PSBmb3JtQ29udGVudFR5cGUpIHtcbiAgICBjb250ZW50VHlwZSA9IGZvcm1Db250ZW50VHlwZVxuICAgIGZvcm0gPSBib2R5XG4gIH1cbiAgaWYgKHVyaS5xdWVyeSkge1xuICAgIHF1ZXJ5ID0gdXJpLnF1ZXJ5XG4gIH1cbiAgaWYgKHRyYW5zcG9ydCA9PT0gJ2JvZHknICYmIChtZXRob2QgIT09ICdQT1NUJyB8fCBjb250ZW50VHlwZSAhPT0gZm9ybUNvbnRlbnRUeXBlKSkge1xuICAgIHNlbGYucmVxdWVzdC5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignb2F1dGg6IHRyYW5zcG9ydF9tZXRob2Qgb2YgYm9keSByZXF1aXJlcyBQT1NUICcgK1xuICAgICAgJ2FuZCBjb250ZW50LXR5cGUgJyArIGZvcm1Db250ZW50VHlwZSkpXG4gIH1cblxuICBpZiAoIWZvcm0gJiYgdHlwZW9mIF9vYXV0aC5ib2R5X2hhc2ggPT09ICdib29sZWFuJykge1xuICAgIF9vYXV0aC5ib2R5X2hhc2ggPSBzZWxmLmJ1aWxkQm9keUhhc2goX29hdXRoLCBzZWxmLnJlcXVlc3QuYm9keS50b1N0cmluZygpKVxuICB9XG5cbiAgdmFyIG9hID0gc2VsZi5idWlsZFBhcmFtcyhfb2F1dGgsIHVyaSwgbWV0aG9kLCBxdWVyeSwgZm9ybSwgcXNMaWIpXG5cbiAgc3dpdGNoICh0cmFuc3BvcnQpIHtcbiAgICBjYXNlICdoZWFkZXInOlxuICAgICAgc2VsZi5yZXF1ZXN0LnNldEhlYWRlcignQXV0aG9yaXphdGlvbicsICdPQXV0aCAnICsgc2VsZi5jb25jYXRQYXJhbXMob2EsICcsJywgJ1wiJykpXG4gICAgICBicmVha1xuXG4gICAgY2FzZSAncXVlcnknOlxuICAgICAgdmFyIGhyZWYgPSBzZWxmLnJlcXVlc3QudXJpLmhyZWYgKz0gKHF1ZXJ5ID8gJyYnIDogJz8nKSArIHNlbGYuY29uY2F0UGFyYW1zKG9hLCAnJicpXG4gICAgICBzZWxmLnJlcXVlc3QudXJpID0gdXJsLnBhcnNlKGhyZWYpXG4gICAgICBzZWxmLnJlcXVlc3QucGF0aCA9IHNlbGYucmVxdWVzdC51cmkucGF0aFxuICAgICAgYnJlYWtcblxuICAgIGNhc2UgJ2JvZHknOlxuICAgICAgc2VsZi5yZXF1ZXN0LmJvZHkgPSAoZm9ybSA/IGZvcm0gKyAnJicgOiAnJykgKyBzZWxmLmNvbmNhdFBhcmFtcyhvYSwgJyYnKVxuICAgICAgYnJlYWtcblxuICAgIGRlZmF1bHQ6XG4gICAgICBzZWxmLnJlcXVlc3QuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ29hdXRoOiB0cmFuc3BvcnRfbWV0aG9kIGludmFsaWQnKSlcbiAgfVxufVxuXG5leHBvcnRzLk9BdXRoID0gT0F1dGhcbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpXG52YXIgcXMgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpXG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCdoYXItdmFsaWRhdG9yJylcbnZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKVxuXG5mdW5jdGlvbiBIYXIgKHJlcXVlc3QpIHtcbiAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdFxufVxuXG5IYXIucHJvdG90eXBlLnJlZHVjZXIgPSBmdW5jdGlvbiAob2JqLCBwYWlyKSB7XG4gIC8vIG5ldyBwcm9wZXJ0eSA/XG4gIGlmIChvYmpbcGFpci5uYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgb2JqW3BhaXIubmFtZV0gPSBwYWlyLnZhbHVlXG4gICAgcmV0dXJuIG9ialxuICB9XG5cbiAgLy8gZXhpc3Rpbmc/IGNvbnZlcnQgdG8gYXJyYXlcbiAgdmFyIGFyciA9IFtcbiAgICBvYmpbcGFpci5uYW1lXSxcbiAgICBwYWlyLnZhbHVlXG4gIF1cblxuICBvYmpbcGFpci5uYW1lXSA9IGFyclxuXG4gIHJldHVybiBvYmpcbn1cblxuSGFyLnByb3RvdHlwZS5wcmVwID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgLy8gY29uc3RydWN0IHV0aWxpdHkgcHJvcGVydGllc1xuICBkYXRhLnF1ZXJ5T2JqID0ge31cbiAgZGF0YS5oZWFkZXJzT2JqID0ge31cbiAgZGF0YS5wb3N0RGF0YS5qc29uT2JqID0gZmFsc2VcbiAgZGF0YS5wb3N0RGF0YS5wYXJhbXNPYmogPSBmYWxzZVxuXG4gIC8vIGNvbnN0cnVjdCBxdWVyeSBvYmplY3RzXG4gIGlmIChkYXRhLnF1ZXJ5U3RyaW5nICYmIGRhdGEucXVlcnlTdHJpbmcubGVuZ3RoKSB7XG4gICAgZGF0YS5xdWVyeU9iaiA9IGRhdGEucXVlcnlTdHJpbmcucmVkdWNlKHRoaXMucmVkdWNlciwge30pXG4gIH1cblxuICAvLyBjb25zdHJ1Y3QgaGVhZGVycyBvYmplY3RzXG4gIGlmIChkYXRhLmhlYWRlcnMgJiYgZGF0YS5oZWFkZXJzLmxlbmd0aCkge1xuICAgIC8vIGxvd2VDYXNlIGhlYWRlciBrZXlzXG4gICAgZGF0YS5oZWFkZXJzT2JqID0gZGF0YS5oZWFkZXJzLnJlZHVjZVJpZ2h0KGZ1bmN0aW9uIChoZWFkZXJzLCBoZWFkZXIpIHtcbiAgICAgIGhlYWRlcnNbaGVhZGVyLm5hbWVdID0gaGVhZGVyLnZhbHVlXG4gICAgICByZXR1cm4gaGVhZGVyc1xuICAgIH0sIHt9KVxuICB9XG5cbiAgLy8gY29uc3RydWN0IENvb2tpZSBoZWFkZXJcbiAgaWYgKGRhdGEuY29va2llcyAmJiBkYXRhLmNvb2tpZXMubGVuZ3RoKSB7XG4gICAgdmFyIGNvb2tpZXMgPSBkYXRhLmNvb2tpZXMubWFwKGZ1bmN0aW9uIChjb29raWUpIHtcbiAgICAgIHJldHVybiBjb29raWUubmFtZSArICc9JyArIGNvb2tpZS52YWx1ZVxuICAgIH0pXG5cbiAgICBpZiAoY29va2llcy5sZW5ndGgpIHtcbiAgICAgIGRhdGEuaGVhZGVyc09iai5jb29raWUgPSBjb29raWVzLmpvaW4oJzsgJylcbiAgICB9XG4gIH1cblxuICAvLyBwcmVwIGJvZHlcbiAgZnVuY3Rpb24gc29tZSAoYXJyKSB7XG4gICAgcmV0dXJuIGFyci5zb21lKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICByZXR1cm4gZGF0YS5wb3N0RGF0YS5taW1lVHlwZS5pbmRleE9mKHR5cGUpID09PSAwXG4gICAgfSlcbiAgfVxuXG4gIGlmIChzb21lKFtcbiAgICAnbXVsdGlwYXJ0L21peGVkJyxcbiAgICAnbXVsdGlwYXJ0L3JlbGF0ZWQnLFxuICAgICdtdWx0aXBhcnQvZm9ybS1kYXRhJyxcbiAgICAnbXVsdGlwYXJ0L2FsdGVybmF0aXZlJ10pKSB7XG4gICAgLy8gcmVzZXQgdmFsdWVzXG4gICAgZGF0YS5wb3N0RGF0YS5taW1lVHlwZSA9ICdtdWx0aXBhcnQvZm9ybS1kYXRhJ1xuICB9IGVsc2UgaWYgKHNvbWUoW1xuICAgICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXSkpIHtcbiAgICBpZiAoIWRhdGEucG9zdERhdGEucGFyYW1zKSB7XG4gICAgICBkYXRhLnBvc3REYXRhLnRleHQgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLnBvc3REYXRhLnBhcmFtc09iaiA9IGRhdGEucG9zdERhdGEucGFyYW1zLnJlZHVjZSh0aGlzLnJlZHVjZXIsIHt9KVxuXG4gICAgICAvLyBhbHdheXMgb3ZlcndyaXRlXG4gICAgICBkYXRhLnBvc3REYXRhLnRleHQgPSBxcy5zdHJpbmdpZnkoZGF0YS5wb3N0RGF0YS5wYXJhbXNPYmopXG4gICAgfVxuICB9IGVsc2UgaWYgKHNvbWUoW1xuICAgICd0ZXh0L2pzb24nLFxuICAgICd0ZXh0L3gtanNvbicsXG4gICAgJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICdhcHBsaWNhdGlvbi94LWpzb24nXSkpIHtcbiAgICBkYXRhLnBvc3REYXRhLm1pbWVUeXBlID0gJ2FwcGxpY2F0aW9uL2pzb24nXG5cbiAgICBpZiAoZGF0YS5wb3N0RGF0YS50ZXh0KSB7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhLnBvc3REYXRhLmpzb25PYmogPSBKU09OLnBhcnNlKGRhdGEucG9zdERhdGEudGV4dClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0LmRlYnVnKGUpXG5cbiAgICAgICAgLy8gZm9yY2UgYmFjayB0byB0ZXh0L3BsYWluXG4gICAgICAgIGRhdGEucG9zdERhdGEubWltZVR5cGUgPSAndGV4dC9wbGFpbidcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGF0YVxufVxuXG5IYXIucHJvdG90eXBlLm9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAvLyBza2lwIGlmIG5vIGhhciBwcm9wZXJ0eSBkZWZpbmVkXG4gIGlmICghb3B0aW9ucy5oYXIpIHtcbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgdmFyIGhhciA9IHt9XG4gIGV4dGVuZChoYXIsIG9wdGlvbnMuaGFyKVxuXG4gIC8vIG9ubHkgcHJvY2VzcyB0aGUgZmlyc3QgZW50cnlcbiAgaWYgKGhhci5sb2cgJiYgaGFyLmxvZy5lbnRyaWVzKSB7XG4gICAgaGFyID0gaGFyLmxvZy5lbnRyaWVzWzBdXG4gIH1cblxuICAvLyBhZGQgb3B0aW9uYWwgcHJvcGVydGllcyB0byBtYWtlIHZhbGlkYXRpb24gc3VjY2Vzc2Z1bFxuICBoYXIudXJsID0gaGFyLnVybCB8fCBvcHRpb25zLnVybCB8fCBvcHRpb25zLnVyaSB8fCBvcHRpb25zLmJhc2VVcmwgfHwgJy8nXG4gIGhhci5odHRwVmVyc2lvbiA9IGhhci5odHRwVmVyc2lvbiB8fCAnSFRUUC8xLjEnXG4gIGhhci5xdWVyeVN0cmluZyA9IGhhci5xdWVyeVN0cmluZyB8fCBbXVxuICBoYXIuaGVhZGVycyA9IGhhci5oZWFkZXJzIHx8IFtdXG4gIGhhci5jb29raWVzID0gaGFyLmNvb2tpZXMgfHwgW11cbiAgaGFyLnBvc3REYXRhID0gaGFyLnBvc3REYXRhIHx8IHt9XG4gIGhhci5wb3N0RGF0YS5taW1lVHlwZSA9IGhhci5wb3N0RGF0YS5taW1lVHlwZSB8fCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuXG4gIGhhci5ib2R5U2l6ZSA9IDBcbiAgaGFyLmhlYWRlcnNTaXplID0gMFxuICBoYXIucG9zdERhdGEuc2l6ZSA9IDBcblxuICBpZiAoIXZhbGlkYXRlLnJlcXVlc3QoaGFyKSkge1xuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICAvLyBjbGVhbiB1cCBhbmQgZ2V0IHNvbWUgdXRpbGl0eSBwcm9wZXJ0aWVzXG4gIHZhciByZXEgPSB0aGlzLnByZXAoaGFyKVxuXG4gIC8vIGNvbnN0cnVjdCBuZXcgb3B0aW9uc1xuICBpZiAocmVxLnVybCkge1xuICAgIG9wdGlvbnMudXJsID0gcmVxLnVybFxuICB9XG5cbiAgaWYgKHJlcS5tZXRob2QpIHtcbiAgICBvcHRpb25zLm1ldGhvZCA9IHJlcS5tZXRob2RcbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhyZXEucXVlcnlPYmopLmxlbmd0aCkge1xuICAgIG9wdGlvbnMucXMgPSByZXEucXVlcnlPYmpcbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhyZXEuaGVhZGVyc09iaikubGVuZ3RoKSB7XG4gICAgb3B0aW9ucy5oZWFkZXJzID0gcmVxLmhlYWRlcnNPYmpcbiAgfVxuXG4gIGZ1bmN0aW9uIHRlc3QgKHR5cGUpIHtcbiAgICByZXR1cm4gcmVxLnBvc3REYXRhLm1pbWVUeXBlLmluZGV4T2YodHlwZSkgPT09IDBcbiAgfVxuICBpZiAodGVzdCgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykpIHtcbiAgICBvcHRpb25zLmZvcm0gPSByZXEucG9zdERhdGEucGFyYW1zT2JqXG4gIH0gZWxzZSBpZiAodGVzdCgnYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgaWYgKHJlcS5wb3N0RGF0YS5qc29uT2JqKSB7XG4gICAgICBvcHRpb25zLmJvZHkgPSByZXEucG9zdERhdGEuanNvbk9ialxuICAgICAgb3B0aW9ucy5qc29uID0gdHJ1ZVxuICAgIH1cbiAgfSBlbHNlIGlmICh0ZXN0KCdtdWx0aXBhcnQvZm9ybS1kYXRhJykpIHtcbiAgICBvcHRpb25zLmZvcm1EYXRhID0ge31cblxuICAgIHJlcS5wb3N0RGF0YS5wYXJhbXMuZm9yRWFjaChmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBhdHRhY2htZW50ID0ge31cblxuICAgICAgaWYgKCFwYXJhbS5maWxlTmFtZSAmJiAhcGFyYW0uZmlsZU5hbWUgJiYgIXBhcmFtLmNvbnRlbnRUeXBlKSB7XG4gICAgICAgIG9wdGlvbnMuZm9ybURhdGFbcGFyYW0ubmFtZV0gPSBwYXJhbS52YWx1ZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gYXR0ZW1wdCB0byByZWFkIGZyb20gZGlzayFcbiAgICAgIGlmIChwYXJhbS5maWxlTmFtZSAmJiAhcGFyYW0udmFsdWUpIHtcbiAgICAgICAgYXR0YWNobWVudC52YWx1ZSA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0ocGFyYW0uZmlsZU5hbWUpXG4gICAgICB9IGVsc2UgaWYgKHBhcmFtLnZhbHVlKSB7XG4gICAgICAgIGF0dGFjaG1lbnQudmFsdWUgPSBwYXJhbS52YWx1ZVxuICAgICAgfVxuXG4gICAgICBpZiAocGFyYW0uZmlsZU5hbWUpIHtcbiAgICAgICAgYXR0YWNobWVudC5vcHRpb25zID0ge1xuICAgICAgICAgIGZpbGVuYW1lOiBwYXJhbS5maWxlTmFtZSxcbiAgICAgICAgICBjb250ZW50VHlwZTogcGFyYW0uY29udGVudFR5cGUgPyBwYXJhbS5jb250ZW50VHlwZSA6IG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBvcHRpb25zLmZvcm1EYXRhW3BhcmFtLm5hbWVdID0gYXR0YWNobWVudFxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgaWYgKHJlcS5wb3N0RGF0YS50ZXh0KSB7XG4gICAgICBvcHRpb25zLmJvZHkgPSByZXEucG9zdERhdGEudGV4dFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvcHRpb25zXG59XG5cbmV4cG9ydHMuSGFyID0gSGFyXG4iXSwic291cmNlUm9vdCI6IiJ9