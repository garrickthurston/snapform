(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.stream-http"],{

/***/ "kl5A":
/*!*************************************************!*\
  !*** ./node_modules/stream-http/lib/request.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer, global, process) {var capability = __webpack_require__(/*! ./capability */ "qfHW")
var inherits = __webpack_require__(/*! inherits */ "P7XM")
var response = __webpack_require__(/*! ./response */ "yQtW")
var stream = __webpack_require__(/*! readable-stream */ "43KI")
var toArrayBuffer = __webpack_require__(/*! to-arraybuffer */ "2Tiy")

var IncomingMessage = response.IncomingMessage
var rStates = response.readyStates

function decideMode (preferBinary, useFetch) {
	if (capability.fetch && useFetch) {
		return 'fetch'
	} else if (capability.mozchunkedarraybuffer) {
		return 'moz-chunked-arraybuffer'
	} else if (capability.msstream) {
		return 'ms-stream'
	} else if (capability.arraybuffer && preferBinary) {
		return 'arraybuffer'
	} else if (capability.vbArray && preferBinary) {
		return 'text:vbarray'
	} else {
		return 'text'
	}
}

var ClientRequest = module.exports = function (opts) {
	var self = this
	stream.Writable.call(self)

	self._opts = opts
	self._body = []
	self._headers = {}
	if (opts.auth)
		self.setHeader('Authorization', 'Basic ' + new Buffer(opts.auth).toString('base64'))
	Object.keys(opts.headers).forEach(function (name) {
		self.setHeader(name, opts.headers[name])
	})

	var preferBinary
	var useFetch = true
	if (opts.mode === 'disable-fetch' || ('requestTimeout' in opts && !capability.abortController)) {
		// If the use of XHR should be preferred. Not typically needed.
		useFetch = false
		preferBinary = true
	} else if (opts.mode === 'prefer-streaming') {
		// If streaming is a high priority but binary compatibility and
		// the accuracy of the 'content-type' header aren't
		preferBinary = false
	} else if (opts.mode === 'allow-wrong-content-type') {
		// If streaming is more important than preserving the 'content-type' header
		preferBinary = !capability.overrideMimeType
	} else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast') {
		// Use binary if text streaming may corrupt data or the content-type header, or for speed
		preferBinary = true
	} else {
		throw new Error('Invalid value for opts.mode')
	}
	self._mode = decideMode(preferBinary, useFetch)
	self._fetchTimer = null

	self.on('finish', function () {
		self._onFinish()
	})
}

inherits(ClientRequest, stream.Writable)

ClientRequest.prototype.setHeader = function (name, value) {
	var self = this
	var lowerName = name.toLowerCase()
	// This check is not necessary, but it prevents warnings from browsers about setting unsafe
	// headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
	// http-browserify did it, so I will too.
	if (unsafeHeaders.indexOf(lowerName) !== -1)
		return

	self._headers[lowerName] = {
		name: name,
		value: value
	}
}

ClientRequest.prototype.getHeader = function (name) {
	var header = this._headers[name.toLowerCase()]
	if (header)
		return header.value
	return null
}

ClientRequest.prototype.removeHeader = function (name) {
	var self = this
	delete self._headers[name.toLowerCase()]
}

ClientRequest.prototype._onFinish = function () {
	var self = this

	if (self._destroyed)
		return
	var opts = self._opts

	var headersObj = self._headers
	var body = null
	if (opts.method !== 'GET' && opts.method !== 'HEAD') {
		if (capability.arraybuffer) {
			body = toArrayBuffer(Buffer.concat(self._body))
		} else if (capability.blobConstructor) {
			body = new global.Blob(self._body.map(function (buffer) {
				return toArrayBuffer(buffer)
			}), {
				type: (headersObj['content-type'] || {}).value || ''
			})
		} else {
			// get utf8 string
			body = Buffer.concat(self._body).toString()
		}
	}

	// create flattened list of headers
	var headersList = []
	Object.keys(headersObj).forEach(function (keyName) {
		var name = headersObj[keyName].name
		var value = headersObj[keyName].value
		if (Array.isArray(value)) {
			value.forEach(function (v) {
				headersList.push([name, v])
			})
		} else {
			headersList.push([name, value])
		}
	})

	if (self._mode === 'fetch') {
		var signal = null
		var fetchTimer = null
		if (capability.abortController) {
			var controller = new AbortController()
			signal = controller.signal
			self._fetchAbortController = controller

			if ('requestTimeout' in opts && opts.requestTimeout !== 0) {
				self._fetchTimer = global.setTimeout(function () {
					self.emit('requestTimeout')
					if (self._fetchAbortController)
						self._fetchAbortController.abort()
				}, opts.requestTimeout)
			}
		}

		global.fetch(self._opts.url, {
			method: self._opts.method,
			headers: headersList,
			body: body || undefined,
			mode: 'cors',
			credentials: opts.withCredentials ? 'include' : 'same-origin',
			signal: signal
		}).then(function (response) {
			self._fetchResponse = response
			self._connect()
		}, function (reason) {
			global.clearTimeout(self._fetchTimer)
			if (!self._destroyed)
				self.emit('error', reason)
		})
	} else {
		var xhr = self._xhr = new global.XMLHttpRequest()
		try {
			xhr.open(self._opts.method, self._opts.url, true)
		} catch (err) {
			process.nextTick(function () {
				self.emit('error', err)
			})
			return
		}

		// Can't set responseType on really old browsers
		if ('responseType' in xhr)
			xhr.responseType = self._mode.split(':')[0]

		if ('withCredentials' in xhr)
			xhr.withCredentials = !!opts.withCredentials

		if (self._mode === 'text' && 'overrideMimeType' in xhr)
			xhr.overrideMimeType('text/plain; charset=x-user-defined')

		if ('requestTimeout' in opts) {
			xhr.timeout = opts.requestTimeout
			xhr.ontimeout = function () {
				self.emit('requestTimeout')
			}
		}

		headersList.forEach(function (header) {
			xhr.setRequestHeader(header[0], header[1])
		})

		self._response = null
		xhr.onreadystatechange = function () {
			switch (xhr.readyState) {
				case rStates.LOADING:
				case rStates.DONE:
					self._onXHRProgress()
					break
			}
		}
		// Necessary for streaming in Firefox, since xhr.response is ONLY defined
		// in onprogress, not in onreadystatechange with xhr.readyState = 3
		if (self._mode === 'moz-chunked-arraybuffer') {
			xhr.onprogress = function () {
				self._onXHRProgress()
			}
		}

		xhr.onerror = function () {
			if (self._destroyed)
				return
			self.emit('error', new Error('XHR error'))
		}

		try {
			xhr.send(body)
		} catch (err) {
			process.nextTick(function () {
				self.emit('error', err)
			})
			return
		}
	}
}

/**
 * Checks if xhr.status is readable and non-zero, indicating no error.
 * Even though the spec says it should be available in readyState 3,
 * accessing it throws an exception in IE8
 */
function statusValid (xhr) {
	try {
		var status = xhr.status
		return (status !== null && status !== 0)
	} catch (e) {
		return false
	}
}

ClientRequest.prototype._onXHRProgress = function () {
	var self = this

	if (!statusValid(self._xhr) || self._destroyed)
		return

	if (!self._response)
		self._connect()

	self._response._onXHRProgress()
}

ClientRequest.prototype._connect = function () {
	var self = this

	if (self._destroyed)
		return

	self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode, self._fetchTimer)
	self._response.on('error', function(err) {
		self.emit('error', err)
	})

	self.emit('response', self._response)
}

ClientRequest.prototype._write = function (chunk, encoding, cb) {
	var self = this

	self._body.push(chunk)
	cb()
}

ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function () {
	var self = this
	self._destroyed = true
	global.clearTimeout(self._fetchTimer)
	if (self._response)
		self._response._destroyed = true
	if (self._xhr)
		self._xhr.abort()
	else if (self._fetchAbortController)
		self._fetchAbortController.abort()
}

ClientRequest.prototype.end = function (data, encoding, cb) {
	var self = this
	if (typeof data === 'function') {
		cb = data
		data = undefined
	}

	stream.Writable.prototype.end.call(self, data, encoding, cb)
}

ClientRequest.prototype.flushHeaders = function () {}
ClientRequest.prototype.setTimeout = function () {}
ClientRequest.prototype.setNoDelay = function () {}
ClientRequest.prototype.setSocketKeepAlive = function () {}

// Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
var unsafeHeaders = [
	'accept-charset',
	'accept-encoding',
	'access-control-request-headers',
	'access-control-request-method',
	'connection',
	'content-length',
	'cookie',
	'cookie2',
	'date',
	'dnt',
	'expect',
	'host',
	'keep-alive',
	'origin',
	'referer',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
	'via'
]

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "tjlA").Buffer, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "yLpj"), __webpack_require__(/*! ./../../process/browser.js */ "8oxB")))

/***/ }),

/***/ "lJCZ":
/*!*******************************************!*\
  !*** ./node_modules/stream-http/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var ClientRequest = __webpack_require__(/*! ./lib/request */ "kl5A")
var response = __webpack_require__(/*! ./lib/response */ "yQtW")
var extend = __webpack_require__(/*! xtend */ "U6jy")
var statusCodes = __webpack_require__(/*! builtin-status-codes */ "jAWH")
var url = __webpack_require__(/*! url */ "CxY0")

var http = exports

http.request = function (opts, cb) {
	if (typeof opts === 'string')
		opts = url.parse(opts)
	else
		opts = extend(opts)

	// Normally, the page is loaded from http or https, so not specifying a protocol
	// will result in a (valid) protocol-relative url. However, this won't work if
	// the protocol is something else, like 'file:'
	var defaultProtocol = global.location.protocol.search(/^https?:$/) === -1 ? 'http:' : ''

	var protocol = opts.protocol || defaultProtocol
	var host = opts.hostname || opts.host
	var port = opts.port
	var path = opts.path || '/'

	// Necessary for IPv6 addresses
	if (host && host.indexOf(':') !== -1)
		host = '[' + host + ']'

	// This may be a relative url. The browser should always be able to interpret it correctly.
	opts.url = (host ? (protocol + '//' + host) : '') + (port ? ':' + port : '') + path
	opts.method = (opts.method || 'GET').toUpperCase()
	opts.headers = opts.headers || {}

	// Also valid opts.auth, opts.mode

	var req = new ClientRequest(opts)
	if (cb)
		req.on('response', cb)
	return req
}

http.get = function get (opts, cb) {
	var req = http.request(opts, cb)
	req.end()
	return req
}

http.ClientRequest = ClientRequest
http.IncomingMessage = response.IncomingMessage

http.Agent = function () {}
http.Agent.defaultMaxSockets = 4

http.globalAgent = new http.Agent()

http.STATUS_CODES = statusCodes

http.METHODS = [
	'CHECKOUT',
	'CONNECT',
	'COPY',
	'DELETE',
	'GET',
	'HEAD',
	'LOCK',
	'M-SEARCH',
	'MERGE',
	'MKACTIVITY',
	'MKCOL',
	'MOVE',
	'NOTIFY',
	'OPTIONS',
	'PATCH',
	'POST',
	'PROPFIND',
	'PROPPATCH',
	'PURGE',
	'PUT',
	'REPORT',
	'SEARCH',
	'SUBSCRIBE',
	'TRACE',
	'UNLOCK',
	'UNSUBSCRIBE'
]
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "yLpj")))

/***/ }),

/***/ "qfHW":
/*!****************************************************!*\
  !*** ./node_modules/stream-http/lib/capability.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {exports.fetch = isFunction(global.fetch) && isFunction(global.ReadableStream)

exports.writableStream = isFunction(global.WritableStream)

exports.abortController = isFunction(global.AbortController)

exports.blobConstructor = false
try {
	new Blob([new ArrayBuffer(1)])
	exports.blobConstructor = true
} catch (e) {}

// The xhr request to example.com may violate some restrictive CSP configurations,
// so if we're running in a browser that supports `fetch`, avoid calling getXHR()
// and assume support for certain features below.
var xhr
function getXHR () {
	// Cache the xhr value
	if (xhr !== undefined) return xhr

	if (global.XMLHttpRequest) {
		xhr = new global.XMLHttpRequest()
		// If XDomainRequest is available (ie only, where xhr might not work
		// cross domain), use the page location. Otherwise use example.com
		// Note: this doesn't actually make an http request.
		try {
			xhr.open('GET', global.XDomainRequest ? '/' : 'https://example.com')
		} catch(e) {
			xhr = null
		}
	} else {
		// Service workers don't have XHR
		xhr = null
	}
	return xhr
}

function checkTypeSupport (type) {
	var xhr = getXHR()
	if (!xhr) return false
	try {
		xhr.responseType = type
		return xhr.responseType === type
	} catch (e) {}
	return false
}

// For some strange reason, Safari 7.0 reports typeof global.ArrayBuffer === 'object'.
// Safari 7.1 appears to have fixed this bug.
var haveArrayBuffer = typeof global.ArrayBuffer !== 'undefined'
var haveSlice = haveArrayBuffer && isFunction(global.ArrayBuffer.prototype.slice)

// If fetch is supported, then arraybuffer will be supported too. Skip calling
// checkTypeSupport(), since that calls getXHR().
exports.arraybuffer = exports.fetch || (haveArrayBuffer && checkTypeSupport('arraybuffer'))

// These next two tests unavoidably show warnings in Chrome. Since fetch will always
// be used if it's available, just return false for these to avoid the warnings.
exports.msstream = !exports.fetch && haveSlice && checkTypeSupport('ms-stream')
exports.mozchunkedarraybuffer = !exports.fetch && haveArrayBuffer &&
	checkTypeSupport('moz-chunked-arraybuffer')

// If fetch is supported, then overrideMimeType will be supported too. Skip calling
// getXHR().
exports.overrideMimeType = exports.fetch || (getXHR() ? isFunction(getXHR().overrideMimeType) : false)

exports.vbArray = isFunction(global.VBArray)

function isFunction (value) {
	return typeof value === 'function'
}

xhr = null // Help gc

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "yLpj")))

/***/ }),

/***/ "yQtW":
/*!**************************************************!*\
  !*** ./node_modules/stream-http/lib/response.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, Buffer, global) {var capability = __webpack_require__(/*! ./capability */ "qfHW")
var inherits = __webpack_require__(/*! inherits */ "P7XM")
var stream = __webpack_require__(/*! readable-stream */ "43KI")

var rStates = exports.readyStates = {
	UNSENT: 0,
	OPENED: 1,
	HEADERS_RECEIVED: 2,
	LOADING: 3,
	DONE: 4
}

var IncomingMessage = exports.IncomingMessage = function (xhr, response, mode, fetchTimer) {
	var self = this
	stream.Readable.call(self)

	self._mode = mode
	self.headers = {}
	self.rawHeaders = []
	self.trailers = {}
	self.rawTrailers = []

	// Fake the 'close' event, but only once 'end' fires
	self.on('end', function () {
		// The nextTick is necessary to prevent the 'request' module from causing an infinite loop
		process.nextTick(function () {
			self.emit('close')
		})
	})

	if (mode === 'fetch') {
		self._fetchResponse = response

		self.url = response.url
		self.statusCode = response.status
		self.statusMessage = response.statusText
		
		response.headers.forEach(function (header, key){
			self.headers[key.toLowerCase()] = header
			self.rawHeaders.push(key, header)
		})

		if (capability.writableStream) {
			var writable = new WritableStream({
				write: function (chunk) {
					return new Promise(function (resolve, reject) {
						if (self._destroyed) {
							reject()
						} else if(self.push(new Buffer(chunk))) {
							resolve()
						} else {
							self._resumeFetch = resolve
						}
					})
				},
				close: function () {
					global.clearTimeout(fetchTimer)
					if (!self._destroyed)
						self.push(null)
				},
				abort: function (err) {
					if (!self._destroyed)
						self.emit('error', err)
				}
			})

			try {
				response.body.pipeTo(writable).catch(function (err) {
					global.clearTimeout(fetchTimer)
					if (!self._destroyed)
						self.emit('error', err)
				})
				return
			} catch (e) {} // pipeTo method isn't defined. Can't find a better way to feature test this
		}
		// fallback for when writableStream or pipeTo aren't available
		var reader = response.body.getReader()
		function read () {
			reader.read().then(function (result) {
				if (self._destroyed)
					return
				if (result.done) {
					global.clearTimeout(fetchTimer)
					self.push(null)
					return
				}
				self.push(new Buffer(result.value))
				read()
			}).catch(function (err) {
				global.clearTimeout(fetchTimer)
				if (!self._destroyed)
					self.emit('error', err)
			})
		}
		read()
	} else {
		self._xhr = xhr
		self._pos = 0

		self.url = xhr.responseURL
		self.statusCode = xhr.status
		self.statusMessage = xhr.statusText
		var headers = xhr.getAllResponseHeaders().split(/\r?\n/)
		headers.forEach(function (header) {
			var matches = header.match(/^([^:]+):\s*(.*)/)
			if (matches) {
				var key = matches[1].toLowerCase()
				if (key === 'set-cookie') {
					if (self.headers[key] === undefined) {
						self.headers[key] = []
					}
					self.headers[key].push(matches[2])
				} else if (self.headers[key] !== undefined) {
					self.headers[key] += ', ' + matches[2]
				} else {
					self.headers[key] = matches[2]
				}
				self.rawHeaders.push(matches[1], matches[2])
			}
		})

		self._charset = 'x-user-defined'
		if (!capability.overrideMimeType) {
			var mimeType = self.rawHeaders['mime-type']
			if (mimeType) {
				var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/)
				if (charsetMatch) {
					self._charset = charsetMatch[1].toLowerCase()
				}
			}
			if (!self._charset)
				self._charset = 'utf-8' // best guess
		}
	}
}

inherits(IncomingMessage, stream.Readable)

IncomingMessage.prototype._read = function () {
	var self = this

	var resolve = self._resumeFetch
	if (resolve) {
		self._resumeFetch = null
		resolve()
	}
}

IncomingMessage.prototype._onXHRProgress = function () {
	var self = this

	var xhr = self._xhr

	var response = null
	switch (self._mode) {
		case 'text:vbarray': // For IE9
			if (xhr.readyState !== rStates.DONE)
				break
			try {
				// This fails in IE8
				response = new global.VBArray(xhr.responseBody).toArray()
			} catch (e) {}
			if (response !== null) {
				self.push(new Buffer(response))
				break
			}
			// Falls through in IE8	
		case 'text':
			try { // This will fail when readyState = 3 in IE9. Switch mode and wait for readyState = 4
				response = xhr.responseText
			} catch (e) {
				self._mode = 'text:vbarray'
				break
			}
			if (response.length > self._pos) {
				var newData = response.substr(self._pos)
				if (self._charset === 'x-user-defined') {
					var buffer = new Buffer(newData.length)
					for (var i = 0; i < newData.length; i++)
						buffer[i] = newData.charCodeAt(i) & 0xff

					self.push(buffer)
				} else {
					self.push(newData, self._charset)
				}
				self._pos = response.length
			}
			break
		case 'arraybuffer':
			if (xhr.readyState !== rStates.DONE || !xhr.response)
				break
			response = xhr.response
			self.push(new Buffer(new Uint8Array(response)))
			break
		case 'moz-chunked-arraybuffer': // take whole
			response = xhr.response
			if (xhr.readyState !== rStates.LOADING || !response)
				break
			self.push(new Buffer(new Uint8Array(response)))
			break
		case 'ms-stream':
			response = xhr.response
			if (xhr.readyState !== rStates.LOADING)
				break
			var reader = new global.MSStreamReader()
			reader.onprogress = function () {
				if (reader.result.byteLength > self._pos) {
					self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos))))
					self._pos = reader.result.byteLength
				}
			}
			reader.onload = function () {
				self.push(null)
			}
			// reader.onerror = ??? // TODO: this
			reader.readAsArrayBuffer(response)
			break
	}

	// The ms-stream case handles end separately in reader.onload()
	if (self._xhr.readyState === rStates.DONE && self._mode !== 'ms-stream') {
		self.push(null)
	}
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "8oxB"), __webpack_require__(/*! ./../../buffer/index.js */ "tjlA").Buffer, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "yLpj")))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3RyZWFtLWh0dHAvbGliL3JlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0cmVhbS1odHRwL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHJlYW0taHR0cC9saWIvY2FwYWJpbGl0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3RyZWFtLWh0dHAvbGliL3Jlc3BvbnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGdGQUFpQixtQkFBTyxDQUFDLDBCQUFjO0FBQ3ZDLGVBQWUsbUJBQU8sQ0FBQyxzQkFBVTtBQUNqQyxlQUFlLG1CQUFPLENBQUMsd0JBQVk7QUFDbkMsYUFBYSxtQkFBTyxDQUFDLDZCQUFpQjtBQUN0QyxvQkFBb0IsbUJBQU8sQ0FBQyw0QkFBZ0I7O0FBRTVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxJQUFJO0FBQ0osMkNBQTJDO0FBQzNDLElBQUk7QUFDSixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7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QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsZUFBZSxJQUFJO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG9CQUFvQjtBQUN4Qzs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5zdHJlYW0taHR0cC40MDdiNjg1N2RkMDEwYTZhMDgwYi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjYXBhYmlsaXR5ID0gcmVxdWlyZSgnLi9jYXBhYmlsaXR5JylcclxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxyXG52YXIgcmVzcG9uc2UgPSByZXF1aXJlKCcuL3Jlc3BvbnNlJylcclxudmFyIHN0cmVhbSA9IHJlcXVpcmUoJ3JlYWRhYmxlLXN0cmVhbScpXHJcbnZhciB0b0FycmF5QnVmZmVyID0gcmVxdWlyZSgndG8tYXJyYXlidWZmZXInKVxyXG5cclxudmFyIEluY29taW5nTWVzc2FnZSA9IHJlc3BvbnNlLkluY29taW5nTWVzc2FnZVxyXG52YXIgclN0YXRlcyA9IHJlc3BvbnNlLnJlYWR5U3RhdGVzXHJcblxyXG5mdW5jdGlvbiBkZWNpZGVNb2RlIChwcmVmZXJCaW5hcnksIHVzZUZldGNoKSB7XHJcblx0aWYgKGNhcGFiaWxpdHkuZmV0Y2ggJiYgdXNlRmV0Y2gpIHtcclxuXHRcdHJldHVybiAnZmV0Y2gnXHJcblx0fSBlbHNlIGlmIChjYXBhYmlsaXR5Lm1vemNodW5rZWRhcnJheWJ1ZmZlcikge1xyXG5cdFx0cmV0dXJuICdtb3otY2h1bmtlZC1hcnJheWJ1ZmZlcidcclxuXHR9IGVsc2UgaWYgKGNhcGFiaWxpdHkubXNzdHJlYW0pIHtcclxuXHRcdHJldHVybiAnbXMtc3RyZWFtJ1xyXG5cdH0gZWxzZSBpZiAoY2FwYWJpbGl0eS5hcnJheWJ1ZmZlciAmJiBwcmVmZXJCaW5hcnkpIHtcclxuXHRcdHJldHVybiAnYXJyYXlidWZmZXInXHJcblx0fSBlbHNlIGlmIChjYXBhYmlsaXR5LnZiQXJyYXkgJiYgcHJlZmVyQmluYXJ5KSB7XHJcblx0XHRyZXR1cm4gJ3RleHQ6dmJhcnJheSdcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuICd0ZXh0J1xyXG5cdH1cclxufVxyXG5cclxudmFyIENsaWVudFJlcXVlc3QgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRzKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzXHJcblx0c3RyZWFtLldyaXRhYmxlLmNhbGwoc2VsZilcclxuXHJcblx0c2VsZi5fb3B0cyA9IG9wdHNcclxuXHRzZWxmLl9ib2R5ID0gW11cclxuXHRzZWxmLl9oZWFkZXJzID0ge31cclxuXHRpZiAob3B0cy5hdXRoKVxyXG5cdFx0c2VsZi5zZXRIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCAnQmFzaWMgJyArIG5ldyBCdWZmZXIob3B0cy5hdXRoKS50b1N0cmluZygnYmFzZTY0JykpXHJcblx0T2JqZWN0LmtleXMob3B0cy5oZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XHJcblx0XHRzZWxmLnNldEhlYWRlcihuYW1lLCBvcHRzLmhlYWRlcnNbbmFtZV0pXHJcblx0fSlcclxuXHJcblx0dmFyIHByZWZlckJpbmFyeVxyXG5cdHZhciB1c2VGZXRjaCA9IHRydWVcclxuXHRpZiAob3B0cy5tb2RlID09PSAnZGlzYWJsZS1mZXRjaCcgfHwgKCdyZXF1ZXN0VGltZW91dCcgaW4gb3B0cyAmJiAhY2FwYWJpbGl0eS5hYm9ydENvbnRyb2xsZXIpKSB7XHJcblx0XHQvLyBJZiB0aGUgdXNlIG9mIFhIUiBzaG91bGQgYmUgcHJlZmVycmVkLiBOb3QgdHlwaWNhbGx5IG5lZWRlZC5cclxuXHRcdHVzZUZldGNoID0gZmFsc2VcclxuXHRcdHByZWZlckJpbmFyeSA9IHRydWVcclxuXHR9IGVsc2UgaWYgKG9wdHMubW9kZSA9PT0gJ3ByZWZlci1zdHJlYW1pbmcnKSB7XHJcblx0XHQvLyBJZiBzdHJlYW1pbmcgaXMgYSBoaWdoIHByaW9yaXR5IGJ1dCBiaW5hcnkgY29tcGF0aWJpbGl0eSBhbmRcclxuXHRcdC8vIHRoZSBhY2N1cmFjeSBvZiB0aGUgJ2NvbnRlbnQtdHlwZScgaGVhZGVyIGFyZW4ndFxyXG5cdFx0cHJlZmVyQmluYXJ5ID0gZmFsc2VcclxuXHR9IGVsc2UgaWYgKG9wdHMubW9kZSA9PT0gJ2FsbG93LXdyb25nLWNvbnRlbnQtdHlwZScpIHtcclxuXHRcdC8vIElmIHN0cmVhbWluZyBpcyBtb3JlIGltcG9ydGFudCB0aGFuIHByZXNlcnZpbmcgdGhlICdjb250ZW50LXR5cGUnIGhlYWRlclxyXG5cdFx0cHJlZmVyQmluYXJ5ID0gIWNhcGFiaWxpdHkub3ZlcnJpZGVNaW1lVHlwZVxyXG5cdH0gZWxzZSBpZiAoIW9wdHMubW9kZSB8fCBvcHRzLm1vZGUgPT09ICdkZWZhdWx0JyB8fCBvcHRzLm1vZGUgPT09ICdwcmVmZXItZmFzdCcpIHtcclxuXHRcdC8vIFVzZSBiaW5hcnkgaWYgdGV4dCBzdHJlYW1pbmcgbWF5IGNvcnJ1cHQgZGF0YSBvciB0aGUgY29udGVudC10eXBlIGhlYWRlciwgb3IgZm9yIHNwZWVkXHJcblx0XHRwcmVmZXJCaW5hcnkgPSB0cnVlXHJcblx0fSBlbHNlIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2YWx1ZSBmb3Igb3B0cy5tb2RlJylcclxuXHR9XHJcblx0c2VsZi5fbW9kZSA9IGRlY2lkZU1vZGUocHJlZmVyQmluYXJ5LCB1c2VGZXRjaClcclxuXHRzZWxmLl9mZXRjaFRpbWVyID0gbnVsbFxyXG5cclxuXHRzZWxmLm9uKCdmaW5pc2gnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRzZWxmLl9vbkZpbmlzaCgpXHJcblx0fSlcclxufVxyXG5cclxuaW5oZXJpdHMoQ2xpZW50UmVxdWVzdCwgc3RyZWFtLldyaXRhYmxlKVxyXG5cclxuQ2xpZW50UmVxdWVzdC5wcm90b3R5cGUuc2V0SGVhZGVyID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzXHJcblx0dmFyIGxvd2VyTmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKVxyXG5cdC8vIFRoaXMgY2hlY2sgaXMgbm90IG5lY2Vzc2FyeSwgYnV0IGl0IHByZXZlbnRzIHdhcm5pbmdzIGZyb20gYnJvd3NlcnMgYWJvdXQgc2V0dGluZyB1bnNhZmVcclxuXHQvLyBoZWFkZXJzLiBUbyBiZSBob25lc3QgSSdtIG5vdCBlbnRpcmVseSBzdXJlIGhpZGluZyB0aGVzZSB3YXJuaW5ncyBpcyBhIGdvb2QgdGhpbmcsIGJ1dFxyXG5cdC8vIGh0dHAtYnJvd3NlcmlmeSBkaWQgaXQsIHNvIEkgd2lsbCB0b28uXHJcblx0aWYgKHVuc2FmZUhlYWRlcnMuaW5kZXhPZihsb3dlck5hbWUpICE9PSAtMSlcclxuXHRcdHJldHVyblxyXG5cclxuXHRzZWxmLl9oZWFkZXJzW2xvd2VyTmFtZV0gPSB7XHJcblx0XHRuYW1lOiBuYW1lLFxyXG5cdFx0dmFsdWU6IHZhbHVlXHJcblx0fVxyXG59XHJcblxyXG5DbGllbnRSZXF1ZXN0LnByb3RvdHlwZS5nZXRIZWFkZXIgPSBmdW5jdGlvbiAobmFtZSkge1xyXG5cdHZhciBoZWFkZXIgPSB0aGlzLl9oZWFkZXJzW25hbWUudG9Mb3dlckNhc2UoKV1cclxuXHRpZiAoaGVhZGVyKVxyXG5cdFx0cmV0dXJuIGhlYWRlci52YWx1ZVxyXG5cdHJldHVybiBudWxsXHJcbn1cclxuXHJcbkNsaWVudFJlcXVlc3QucHJvdG90eXBlLnJlbW92ZUhlYWRlciA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzXHJcblx0ZGVsZXRlIHNlbGYuX2hlYWRlcnNbbmFtZS50b0xvd2VyQ2FzZSgpXVxyXG59XHJcblxyXG5DbGllbnRSZXF1ZXN0LnByb3RvdHlwZS5fb25GaW5pc2ggPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzXHJcblxyXG5cdGlmIChzZWxmLl9kZXN0cm95ZWQpXHJcblx0XHRyZXR1cm5cclxuXHR2YXIgb3B0cyA9IHNlbGYuX29wdHNcclxuXHJcblx0dmFyIGhlYWRlcnNPYmogPSBzZWxmLl9oZWFkZXJzXHJcblx0dmFyIGJvZHkgPSBudWxsXHJcblx0aWYgKG9wdHMubWV0aG9kICE9PSAnR0VUJyAmJiBvcHRzLm1ldGhvZCAhPT0gJ0hFQUQnKSB7XHJcblx0XHRpZiAoY2FwYWJpbGl0eS5hcnJheWJ1ZmZlcikge1xyXG5cdFx0XHRib2R5ID0gdG9BcnJheUJ1ZmZlcihCdWZmZXIuY29uY2F0KHNlbGYuX2JvZHkpKVxyXG5cdFx0fSBlbHNlIGlmIChjYXBhYmlsaXR5LmJsb2JDb25zdHJ1Y3Rvcikge1xyXG5cdFx0XHRib2R5ID0gbmV3IGdsb2JhbC5CbG9iKHNlbGYuX2JvZHkubWFwKGZ1bmN0aW9uIChidWZmZXIpIHtcclxuXHRcdFx0XHRyZXR1cm4gdG9BcnJheUJ1ZmZlcihidWZmZXIpXHJcblx0XHRcdH0pLCB7XHJcblx0XHRcdFx0dHlwZTogKGhlYWRlcnNPYmpbJ2NvbnRlbnQtdHlwZSddIHx8IHt9KS52YWx1ZSB8fCAnJ1xyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gZ2V0IHV0Zjggc3RyaW5nXHJcblx0XHRcdGJvZHkgPSBCdWZmZXIuY29uY2F0KHNlbGYuX2JvZHkpLnRvU3RyaW5nKClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGNyZWF0ZSBmbGF0dGVuZWQgbGlzdCBvZiBoZWFkZXJzXHJcblx0dmFyIGhlYWRlcnNMaXN0ID0gW11cclxuXHRPYmplY3Qua2V5cyhoZWFkZXJzT2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXlOYW1lKSB7XHJcblx0XHR2YXIgbmFtZSA9IGhlYWRlcnNPYmpba2V5TmFtZV0ubmFtZVxyXG5cdFx0dmFyIHZhbHVlID0gaGVhZGVyc09ialtrZXlOYW1lXS52YWx1ZVxyXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcblx0XHRcdHZhbHVlLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcclxuXHRcdFx0XHRoZWFkZXJzTGlzdC5wdXNoKFtuYW1lLCB2XSlcclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGhlYWRlcnNMaXN0LnB1c2goW25hbWUsIHZhbHVlXSlcclxuXHRcdH1cclxuXHR9KVxyXG5cclxuXHRpZiAoc2VsZi5fbW9kZSA9PT0gJ2ZldGNoJykge1xyXG5cdFx0dmFyIHNpZ25hbCA9IG51bGxcclxuXHRcdHZhciBmZXRjaFRpbWVyID0gbnVsbFxyXG5cdFx0aWYgKGNhcGFiaWxpdHkuYWJvcnRDb250cm9sbGVyKSB7XHJcblx0XHRcdHZhciBjb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpXHJcblx0XHRcdHNpZ25hbCA9IGNvbnRyb2xsZXIuc2lnbmFsXHJcblx0XHRcdHNlbGYuX2ZldGNoQWJvcnRDb250cm9sbGVyID0gY29udHJvbGxlclxyXG5cclxuXHRcdFx0aWYgKCdyZXF1ZXN0VGltZW91dCcgaW4gb3B0cyAmJiBvcHRzLnJlcXVlc3RUaW1lb3V0ICE9PSAwKSB7XHJcblx0XHRcdFx0c2VsZi5fZmV0Y2hUaW1lciA9IGdsb2JhbC5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHNlbGYuZW1pdCgncmVxdWVzdFRpbWVvdXQnKVxyXG5cdFx0XHRcdFx0aWYgKHNlbGYuX2ZldGNoQWJvcnRDb250cm9sbGVyKVxyXG5cdFx0XHRcdFx0XHRzZWxmLl9mZXRjaEFib3J0Q29udHJvbGxlci5hYm9ydCgpXHJcblx0XHRcdFx0fSwgb3B0cy5yZXF1ZXN0VGltZW91dClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGdsb2JhbC5mZXRjaChzZWxmLl9vcHRzLnVybCwge1xyXG5cdFx0XHRtZXRob2Q6IHNlbGYuX29wdHMubWV0aG9kLFxyXG5cdFx0XHRoZWFkZXJzOiBoZWFkZXJzTGlzdCxcclxuXHRcdFx0Ym9keTogYm9keSB8fCB1bmRlZmluZWQsXHJcblx0XHRcdG1vZGU6ICdjb3JzJyxcclxuXHRcdFx0Y3JlZGVudGlhbHM6IG9wdHMud2l0aENyZWRlbnRpYWxzID8gJ2luY2x1ZGUnIDogJ3NhbWUtb3JpZ2luJyxcclxuXHRcdFx0c2lnbmFsOiBzaWduYWxcclxuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdHNlbGYuX2ZldGNoUmVzcG9uc2UgPSByZXNwb25zZVxyXG5cdFx0XHRzZWxmLl9jb25uZWN0KClcclxuXHRcdH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcclxuXHRcdFx0Z2xvYmFsLmNsZWFyVGltZW91dChzZWxmLl9mZXRjaFRpbWVyKVxyXG5cdFx0XHRpZiAoIXNlbGYuX2Rlc3Ryb3llZClcclxuXHRcdFx0XHRzZWxmLmVtaXQoJ2Vycm9yJywgcmVhc29uKVxyXG5cdFx0fSlcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIHhociA9IHNlbGYuX3hociA9IG5ldyBnbG9iYWwuWE1MSHR0cFJlcXVlc3QoKVxyXG5cdFx0dHJ5IHtcclxuXHRcdFx0eGhyLm9wZW4oc2VsZi5fb3B0cy5tZXRob2QsIHNlbGYuX29wdHMudXJsLCB0cnVlKVxyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHNlbGYuZW1pdCgnZXJyb3InLCBlcnIpXHJcblx0XHRcdH0pXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENhbid0IHNldCByZXNwb25zZVR5cGUgb24gcmVhbGx5IG9sZCBicm93c2Vyc1xyXG5cdFx0aWYgKCdyZXNwb25zZVR5cGUnIGluIHhocilcclxuXHRcdFx0eGhyLnJlc3BvbnNlVHlwZSA9IHNlbGYuX21vZGUuc3BsaXQoJzonKVswXVxyXG5cclxuXHRcdGlmICgnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpXHJcblx0XHRcdHhoci53aXRoQ3JlZGVudGlhbHMgPSAhIW9wdHMud2l0aENyZWRlbnRpYWxzXHJcblxyXG5cdFx0aWYgKHNlbGYuX21vZGUgPT09ICd0ZXh0JyAmJiAnb3ZlcnJpZGVNaW1lVHlwZScgaW4geGhyKVxyXG5cdFx0XHR4aHIub3ZlcnJpZGVNaW1lVHlwZSgndGV4dC9wbGFpbjsgY2hhcnNldD14LXVzZXItZGVmaW5lZCcpXHJcblxyXG5cdFx0aWYgKCdyZXF1ZXN0VGltZW91dCcgaW4gb3B0cykge1xyXG5cdFx0XHR4aHIudGltZW91dCA9IG9wdHMucmVxdWVzdFRpbWVvdXRcclxuXHRcdFx0eGhyLm9udGltZW91dCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRzZWxmLmVtaXQoJ3JlcXVlc3RUaW1lb3V0JylcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGhlYWRlcnNMaXN0LmZvckVhY2goZnVuY3Rpb24gKGhlYWRlcikge1xyXG5cdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXJbMF0sIGhlYWRlclsxXSlcclxuXHRcdH0pXHJcblxyXG5cdFx0c2VsZi5fcmVzcG9uc2UgPSBudWxsXHJcblx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRzd2l0Y2ggKHhoci5yZWFkeVN0YXRlKSB7XHJcblx0XHRcdFx0Y2FzZSByU3RhdGVzLkxPQURJTkc6XHJcblx0XHRcdFx0Y2FzZSByU3RhdGVzLkRPTkU6XHJcblx0XHRcdFx0XHRzZWxmLl9vblhIUlByb2dyZXNzKClcclxuXHRcdFx0XHRcdGJyZWFrXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIE5lY2Vzc2FyeSBmb3Igc3RyZWFtaW5nIGluIEZpcmVmb3gsIHNpbmNlIHhoci5yZXNwb25zZSBpcyBPTkxZIGRlZmluZWRcclxuXHRcdC8vIGluIG9ucHJvZ3Jlc3MsIG5vdCBpbiBvbnJlYWR5c3RhdGVjaGFuZ2Ugd2l0aCB4aHIucmVhZHlTdGF0ZSA9IDNcclxuXHRcdGlmIChzZWxmLl9tb2RlID09PSAnbW96LWNodW5rZWQtYXJyYXlidWZmZXInKSB7XHJcblx0XHRcdHhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHNlbGYuX29uWEhSUHJvZ3Jlc3MoKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0eGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmIChzZWxmLl9kZXN0cm95ZWQpXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdHNlbGYuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ1hIUiBlcnJvcicpKVxyXG5cdFx0fVxyXG5cclxuXHRcdHRyeSB7XHJcblx0XHRcdHhoci5zZW5kKGJvZHkpXHJcblx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0cHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0c2VsZi5lbWl0KCdlcnJvcicsIGVycilcclxuXHRcdFx0fSlcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIHhoci5zdGF0dXMgaXMgcmVhZGFibGUgYW5kIG5vbi16ZXJvLCBpbmRpY2F0aW5nIG5vIGVycm9yLlxyXG4gKiBFdmVuIHRob3VnaCB0aGUgc3BlYyBzYXlzIGl0IHNob3VsZCBiZSBhdmFpbGFibGUgaW4gcmVhZHlTdGF0ZSAzLFxyXG4gKiBhY2Nlc3NpbmcgaXQgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpbiBJRThcclxuICovXHJcbmZ1bmN0aW9uIHN0YXR1c1ZhbGlkICh4aHIpIHtcclxuXHR0cnkge1xyXG5cdFx0dmFyIHN0YXR1cyA9IHhoci5zdGF0dXNcclxuXHRcdHJldHVybiAoc3RhdHVzICE9PSBudWxsICYmIHN0YXR1cyAhPT0gMClcclxuXHR9IGNhdGNoIChlKSB7XHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR9XHJcbn1cclxuXHJcbkNsaWVudFJlcXVlc3QucHJvdG90eXBlLl9vblhIUlByb2dyZXNzID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBzZWxmID0gdGhpc1xyXG5cclxuXHRpZiAoIXN0YXR1c1ZhbGlkKHNlbGYuX3hocikgfHwgc2VsZi5fZGVzdHJveWVkKVxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdGlmICghc2VsZi5fcmVzcG9uc2UpXHJcblx0XHRzZWxmLl9jb25uZWN0KClcclxuXHJcblx0c2VsZi5fcmVzcG9uc2UuX29uWEhSUHJvZ3Jlc3MoKVxyXG59XHJcblxyXG5DbGllbnRSZXF1ZXN0LnByb3RvdHlwZS5fY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXNcclxuXHJcblx0aWYgKHNlbGYuX2Rlc3Ryb3llZClcclxuXHRcdHJldHVyblxyXG5cclxuXHRzZWxmLl9yZXNwb25zZSA9IG5ldyBJbmNvbWluZ01lc3NhZ2Uoc2VsZi5feGhyLCBzZWxmLl9mZXRjaFJlc3BvbnNlLCBzZWxmLl9tb2RlLCBzZWxmLl9mZXRjaFRpbWVyKVxyXG5cdHNlbGYuX3Jlc3BvbnNlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycikge1xyXG5cdFx0c2VsZi5lbWl0KCdlcnJvcicsIGVycilcclxuXHR9KVxyXG5cclxuXHRzZWxmLmVtaXQoJ3Jlc3BvbnNlJywgc2VsZi5fcmVzcG9uc2UpXHJcbn1cclxuXHJcbkNsaWVudFJlcXVlc3QucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uIChjaHVuaywgZW5jb2RpbmcsIGNiKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzXHJcblxyXG5cdHNlbGYuX2JvZHkucHVzaChjaHVuaylcclxuXHRjYigpXHJcbn1cclxuXHJcbkNsaWVudFJlcXVlc3QucHJvdG90eXBlLmFib3J0ID0gQ2xpZW50UmVxdWVzdC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXNcclxuXHRzZWxmLl9kZXN0cm95ZWQgPSB0cnVlXHJcblx0Z2xvYmFsLmNsZWFyVGltZW91dChzZWxmLl9mZXRjaFRpbWVyKVxyXG5cdGlmIChzZWxmLl9yZXNwb25zZSlcclxuXHRcdHNlbGYuX3Jlc3BvbnNlLl9kZXN0cm95ZWQgPSB0cnVlXHJcblx0aWYgKHNlbGYuX3hocilcclxuXHRcdHNlbGYuX3hoci5hYm9ydCgpXHJcblx0ZWxzZSBpZiAoc2VsZi5fZmV0Y2hBYm9ydENvbnRyb2xsZXIpXHJcblx0XHRzZWxmLl9mZXRjaEFib3J0Q29udHJvbGxlci5hYm9ydCgpXHJcbn1cclxuXHJcbkNsaWVudFJlcXVlc3QucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChkYXRhLCBlbmNvZGluZywgY2IpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXNcclxuXHRpZiAodHlwZW9mIGRhdGEgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNiID0gZGF0YVxyXG5cdFx0ZGF0YSA9IHVuZGVmaW5lZFxyXG5cdH1cclxuXHJcblx0c3RyZWFtLldyaXRhYmxlLnByb3RvdHlwZS5lbmQuY2FsbChzZWxmLCBkYXRhLCBlbmNvZGluZywgY2IpXHJcbn1cclxuXHJcbkNsaWVudFJlcXVlc3QucHJvdG90eXBlLmZsdXNoSGVhZGVycyA9IGZ1bmN0aW9uICgpIHt9XHJcbkNsaWVudFJlcXVlc3QucHJvdG90eXBlLnNldFRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7fVxyXG5DbGllbnRSZXF1ZXN0LnByb3RvdHlwZS5zZXROb0RlbGF5ID0gZnVuY3Rpb24gKCkge31cclxuQ2xpZW50UmVxdWVzdC5wcm90b3R5cGUuc2V0U29ja2V0S2VlcEFsaXZlID0gZnVuY3Rpb24gKCkge31cclxuXHJcbi8vIFRha2VuIGZyb20gaHR0cDovL3d3dy53My5vcmcvVFIvWE1MSHR0cFJlcXVlc3QvI3RoZS1zZXRyZXF1ZXN0aGVhZGVyJTI4JTI5LW1ldGhvZFxyXG52YXIgdW5zYWZlSGVhZGVycyA9IFtcclxuXHQnYWNjZXB0LWNoYXJzZXQnLFxyXG5cdCdhY2NlcHQtZW5jb2RpbmcnLFxyXG5cdCdhY2Nlc3MtY29udHJvbC1yZXF1ZXN0LWhlYWRlcnMnLFxyXG5cdCdhY2Nlc3MtY29udHJvbC1yZXF1ZXN0LW1ldGhvZCcsXHJcblx0J2Nvbm5lY3Rpb24nLFxyXG5cdCdjb250ZW50LWxlbmd0aCcsXHJcblx0J2Nvb2tpZScsXHJcblx0J2Nvb2tpZTInLFxyXG5cdCdkYXRlJyxcclxuXHQnZG50JyxcclxuXHQnZXhwZWN0JyxcclxuXHQnaG9zdCcsXHJcblx0J2tlZXAtYWxpdmUnLFxyXG5cdCdvcmlnaW4nLFxyXG5cdCdyZWZlcmVyJyxcclxuXHQndGUnLFxyXG5cdCd0cmFpbGVyJyxcclxuXHQndHJhbnNmZXItZW5jb2RpbmcnLFxyXG5cdCd1cGdyYWRlJyxcclxuXHQndmlhJ1xyXG5dXHJcbiIsInZhciBDbGllbnRSZXF1ZXN0ID0gcmVxdWlyZSgnLi9saWIvcmVxdWVzdCcpXHJcbnZhciByZXNwb25zZSA9IHJlcXVpcmUoJy4vbGliL3Jlc3BvbnNlJylcclxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kJylcclxudmFyIHN0YXR1c0NvZGVzID0gcmVxdWlyZSgnYnVpbHRpbi1zdGF0dXMtY29kZXMnKVxyXG52YXIgdXJsID0gcmVxdWlyZSgndXJsJylcclxuXHJcbnZhciBodHRwID0gZXhwb3J0c1xyXG5cclxuaHR0cC5yZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdHMsIGNiKSB7XHJcblx0aWYgKHR5cGVvZiBvcHRzID09PSAnc3RyaW5nJylcclxuXHRcdG9wdHMgPSB1cmwucGFyc2Uob3B0cylcclxuXHRlbHNlXHJcblx0XHRvcHRzID0gZXh0ZW5kKG9wdHMpXHJcblxyXG5cdC8vIE5vcm1hbGx5LCB0aGUgcGFnZSBpcyBsb2FkZWQgZnJvbSBodHRwIG9yIGh0dHBzLCBzbyBub3Qgc3BlY2lmeWluZyBhIHByb3RvY29sXHJcblx0Ly8gd2lsbCByZXN1bHQgaW4gYSAodmFsaWQpIHByb3RvY29sLXJlbGF0aXZlIHVybC4gSG93ZXZlciwgdGhpcyB3b24ndCB3b3JrIGlmXHJcblx0Ly8gdGhlIHByb3RvY29sIGlzIHNvbWV0aGluZyBlbHNlLCBsaWtlICdmaWxlOidcclxuXHR2YXIgZGVmYXVsdFByb3RvY29sID0gZ2xvYmFsLmxvY2F0aW9uLnByb3RvY29sLnNlYXJjaCgvXmh0dHBzPzokLykgPT09IC0xID8gJ2h0dHA6JyA6ICcnXHJcblxyXG5cdHZhciBwcm90b2NvbCA9IG9wdHMucHJvdG9jb2wgfHwgZGVmYXVsdFByb3RvY29sXHJcblx0dmFyIGhvc3QgPSBvcHRzLmhvc3RuYW1lIHx8IG9wdHMuaG9zdFxyXG5cdHZhciBwb3J0ID0gb3B0cy5wb3J0XHJcblx0dmFyIHBhdGggPSBvcHRzLnBhdGggfHwgJy8nXHJcblxyXG5cdC8vIE5lY2Vzc2FyeSBmb3IgSVB2NiBhZGRyZXNzZXNcclxuXHRpZiAoaG9zdCAmJiBob3N0LmluZGV4T2YoJzonKSAhPT0gLTEpXHJcblx0XHRob3N0ID0gJ1snICsgaG9zdCArICddJ1xyXG5cclxuXHQvLyBUaGlzIG1heSBiZSBhIHJlbGF0aXZlIHVybC4gVGhlIGJyb3dzZXIgc2hvdWxkIGFsd2F5cyBiZSBhYmxlIHRvIGludGVycHJldCBpdCBjb3JyZWN0bHkuXHJcblx0b3B0cy51cmwgPSAoaG9zdCA/IChwcm90b2NvbCArICcvLycgKyBob3N0KSA6ICcnKSArIChwb3J0ID8gJzonICsgcG9ydCA6ICcnKSArIHBhdGhcclxuXHRvcHRzLm1ldGhvZCA9IChvcHRzLm1ldGhvZCB8fCAnR0VUJykudG9VcHBlckNhc2UoKVxyXG5cdG9wdHMuaGVhZGVycyA9IG9wdHMuaGVhZGVycyB8fCB7fVxyXG5cclxuXHQvLyBBbHNvIHZhbGlkIG9wdHMuYXV0aCwgb3B0cy5tb2RlXHJcblxyXG5cdHZhciByZXEgPSBuZXcgQ2xpZW50UmVxdWVzdChvcHRzKVxyXG5cdGlmIChjYilcclxuXHRcdHJlcS5vbigncmVzcG9uc2UnLCBjYilcclxuXHRyZXR1cm4gcmVxXHJcbn1cclxuXHJcbmh0dHAuZ2V0ID0gZnVuY3Rpb24gZ2V0IChvcHRzLCBjYikge1xyXG5cdHZhciByZXEgPSBodHRwLnJlcXVlc3Qob3B0cywgY2IpXHJcblx0cmVxLmVuZCgpXHJcblx0cmV0dXJuIHJlcVxyXG59XHJcblxyXG5odHRwLkNsaWVudFJlcXVlc3QgPSBDbGllbnRSZXF1ZXN0XHJcbmh0dHAuSW5jb21pbmdNZXNzYWdlID0gcmVzcG9uc2UuSW5jb21pbmdNZXNzYWdlXHJcblxyXG5odHRwLkFnZW50ID0gZnVuY3Rpb24gKCkge31cclxuaHR0cC5BZ2VudC5kZWZhdWx0TWF4U29ja2V0cyA9IDRcclxuXHJcbmh0dHAuZ2xvYmFsQWdlbnQgPSBuZXcgaHR0cC5BZ2VudCgpXHJcblxyXG5odHRwLlNUQVRVU19DT0RFUyA9IHN0YXR1c0NvZGVzXHJcblxyXG5odHRwLk1FVEhPRFMgPSBbXHJcblx0J0NIRUNLT1VUJyxcclxuXHQnQ09OTkVDVCcsXHJcblx0J0NPUFknLFxyXG5cdCdERUxFVEUnLFxyXG5cdCdHRVQnLFxyXG5cdCdIRUFEJyxcclxuXHQnTE9DSycsXHJcblx0J00tU0VBUkNIJyxcclxuXHQnTUVSR0UnLFxyXG5cdCdNS0FDVElWSVRZJyxcclxuXHQnTUtDT0wnLFxyXG5cdCdNT1ZFJyxcclxuXHQnTk9USUZZJyxcclxuXHQnT1BUSU9OUycsXHJcblx0J1BBVENIJyxcclxuXHQnUE9TVCcsXHJcblx0J1BST1BGSU5EJyxcclxuXHQnUFJPUFBBVENIJyxcclxuXHQnUFVSR0UnLFxyXG5cdCdQVVQnLFxyXG5cdCdSRVBPUlQnLFxyXG5cdCdTRUFSQ0gnLFxyXG5cdCdTVUJTQ1JJQkUnLFxyXG5cdCdUUkFDRScsXHJcblx0J1VOTE9DSycsXHJcblx0J1VOU1VCU0NSSUJFJ1xyXG5dIiwiZXhwb3J0cy5mZXRjaCA9IGlzRnVuY3Rpb24oZ2xvYmFsLmZldGNoKSAmJiBpc0Z1bmN0aW9uKGdsb2JhbC5SZWFkYWJsZVN0cmVhbSlcclxuXHJcbmV4cG9ydHMud3JpdGFibGVTdHJlYW0gPSBpc0Z1bmN0aW9uKGdsb2JhbC5Xcml0YWJsZVN0cmVhbSlcclxuXHJcbmV4cG9ydHMuYWJvcnRDb250cm9sbGVyID0gaXNGdW5jdGlvbihnbG9iYWwuQWJvcnRDb250cm9sbGVyKVxyXG5cclxuZXhwb3J0cy5ibG9iQ29uc3RydWN0b3IgPSBmYWxzZVxyXG50cnkge1xyXG5cdG5ldyBCbG9iKFtuZXcgQXJyYXlCdWZmZXIoMSldKVxyXG5cdGV4cG9ydHMuYmxvYkNvbnN0cnVjdG9yID0gdHJ1ZVxyXG59IGNhdGNoIChlKSB7fVxyXG5cclxuLy8gVGhlIHhociByZXF1ZXN0IHRvIGV4YW1wbGUuY29tIG1heSB2aW9sYXRlIHNvbWUgcmVzdHJpY3RpdmUgQ1NQIGNvbmZpZ3VyYXRpb25zLFxyXG4vLyBzbyBpZiB3ZSdyZSBydW5uaW5nIGluIGEgYnJvd3NlciB0aGF0IHN1cHBvcnRzIGBmZXRjaGAsIGF2b2lkIGNhbGxpbmcgZ2V0WEhSKClcclxuLy8gYW5kIGFzc3VtZSBzdXBwb3J0IGZvciBjZXJ0YWluIGZlYXR1cmVzIGJlbG93LlxyXG52YXIgeGhyXHJcbmZ1bmN0aW9uIGdldFhIUiAoKSB7XHJcblx0Ly8gQ2FjaGUgdGhlIHhociB2YWx1ZVxyXG5cdGlmICh4aHIgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHhoclxyXG5cclxuXHRpZiAoZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KSB7XHJcblx0XHR4aHIgPSBuZXcgZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KClcclxuXHRcdC8vIElmIFhEb21haW5SZXF1ZXN0IGlzIGF2YWlsYWJsZSAoaWUgb25seSwgd2hlcmUgeGhyIG1pZ2h0IG5vdCB3b3JrXHJcblx0XHQvLyBjcm9zcyBkb21haW4pLCB1c2UgdGhlIHBhZ2UgbG9jYXRpb24uIE90aGVyd2lzZSB1c2UgZXhhbXBsZS5jb21cclxuXHRcdC8vIE5vdGU6IHRoaXMgZG9lc24ndCBhY3R1YWxseSBtYWtlIGFuIGh0dHAgcmVxdWVzdC5cclxuXHRcdHRyeSB7XHJcblx0XHRcdHhoci5vcGVuKCdHRVQnLCBnbG9iYWwuWERvbWFpblJlcXVlc3QgPyAnLycgOiAnaHR0cHM6Ly9leGFtcGxlLmNvbScpXHJcblx0XHR9IGNhdGNoKGUpIHtcclxuXHRcdFx0eGhyID0gbnVsbFxyXG5cdFx0fVxyXG5cdH0gZWxzZSB7XHJcblx0XHQvLyBTZXJ2aWNlIHdvcmtlcnMgZG9uJ3QgaGF2ZSBYSFJcclxuXHRcdHhociA9IG51bGxcclxuXHR9XHJcblx0cmV0dXJuIHhoclxyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja1R5cGVTdXBwb3J0ICh0eXBlKSB7XHJcblx0dmFyIHhociA9IGdldFhIUigpXHJcblx0aWYgKCF4aHIpIHJldHVybiBmYWxzZVxyXG5cdHRyeSB7XHJcblx0XHR4aHIucmVzcG9uc2VUeXBlID0gdHlwZVxyXG5cdFx0cmV0dXJuIHhoci5yZXNwb25zZVR5cGUgPT09IHR5cGVcclxuXHR9IGNhdGNoIChlKSB7fVxyXG5cdHJldHVybiBmYWxzZVxyXG59XHJcblxyXG4vLyBGb3Igc29tZSBzdHJhbmdlIHJlYXNvbiwgU2FmYXJpIDcuMCByZXBvcnRzIHR5cGVvZiBnbG9iYWwuQXJyYXlCdWZmZXIgPT09ICdvYmplY3QnLlxyXG4vLyBTYWZhcmkgNy4xIGFwcGVhcnMgdG8gaGF2ZSBmaXhlZCB0aGlzIGJ1Zy5cclxudmFyIGhhdmVBcnJheUJ1ZmZlciA9IHR5cGVvZiBnbG9iYWwuQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnXHJcbnZhciBoYXZlU2xpY2UgPSBoYXZlQXJyYXlCdWZmZXIgJiYgaXNGdW5jdGlvbihnbG9iYWwuQXJyYXlCdWZmZXIucHJvdG90eXBlLnNsaWNlKVxyXG5cclxuLy8gSWYgZmV0Y2ggaXMgc3VwcG9ydGVkLCB0aGVuIGFycmF5YnVmZmVyIHdpbGwgYmUgc3VwcG9ydGVkIHRvby4gU2tpcCBjYWxsaW5nXHJcbi8vIGNoZWNrVHlwZVN1cHBvcnQoKSwgc2luY2UgdGhhdCBjYWxscyBnZXRYSFIoKS5cclxuZXhwb3J0cy5hcnJheWJ1ZmZlciA9IGV4cG9ydHMuZmV0Y2ggfHwgKGhhdmVBcnJheUJ1ZmZlciAmJiBjaGVja1R5cGVTdXBwb3J0KCdhcnJheWJ1ZmZlcicpKVxyXG5cclxuLy8gVGhlc2UgbmV4dCB0d28gdGVzdHMgdW5hdm9pZGFibHkgc2hvdyB3YXJuaW5ncyBpbiBDaHJvbWUuIFNpbmNlIGZldGNoIHdpbGwgYWx3YXlzXHJcbi8vIGJlIHVzZWQgaWYgaXQncyBhdmFpbGFibGUsIGp1c3QgcmV0dXJuIGZhbHNlIGZvciB0aGVzZSB0byBhdm9pZCB0aGUgd2FybmluZ3MuXHJcbmV4cG9ydHMubXNzdHJlYW0gPSAhZXhwb3J0cy5mZXRjaCAmJiBoYXZlU2xpY2UgJiYgY2hlY2tUeXBlU3VwcG9ydCgnbXMtc3RyZWFtJylcclxuZXhwb3J0cy5tb3pjaHVua2VkYXJyYXlidWZmZXIgPSAhZXhwb3J0cy5mZXRjaCAmJiBoYXZlQXJyYXlCdWZmZXIgJiZcclxuXHRjaGVja1R5cGVTdXBwb3J0KCdtb3otY2h1bmtlZC1hcnJheWJ1ZmZlcicpXHJcblxyXG4vLyBJZiBmZXRjaCBpcyBzdXBwb3J0ZWQsIHRoZW4gb3ZlcnJpZGVNaW1lVHlwZSB3aWxsIGJlIHN1cHBvcnRlZCB0b28uIFNraXAgY2FsbGluZ1xyXG4vLyBnZXRYSFIoKS5cclxuZXhwb3J0cy5vdmVycmlkZU1pbWVUeXBlID0gZXhwb3J0cy5mZXRjaCB8fCAoZ2V0WEhSKCkgPyBpc0Z1bmN0aW9uKGdldFhIUigpLm92ZXJyaWRlTWltZVR5cGUpIDogZmFsc2UpXHJcblxyXG5leHBvcnRzLnZiQXJyYXkgPSBpc0Z1bmN0aW9uKGdsb2JhbC5WQkFycmF5KVxyXG5cclxuZnVuY3Rpb24gaXNGdW5jdGlvbiAodmFsdWUpIHtcclxuXHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nXHJcbn1cclxuXHJcbnhociA9IG51bGwgLy8gSGVscCBnY1xyXG4iLCJ2YXIgY2FwYWJpbGl0eSA9IHJlcXVpcmUoJy4vY2FwYWJpbGl0eScpXHJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcclxudmFyIHN0cmVhbSA9IHJlcXVpcmUoJ3JlYWRhYmxlLXN0cmVhbScpXHJcblxyXG52YXIgclN0YXRlcyA9IGV4cG9ydHMucmVhZHlTdGF0ZXMgPSB7XHJcblx0VU5TRU5UOiAwLFxyXG5cdE9QRU5FRDogMSxcclxuXHRIRUFERVJTX1JFQ0VJVkVEOiAyLFxyXG5cdExPQURJTkc6IDMsXHJcblx0RE9ORTogNFxyXG59XHJcblxyXG52YXIgSW5jb21pbmdNZXNzYWdlID0gZXhwb3J0cy5JbmNvbWluZ01lc3NhZ2UgPSBmdW5jdGlvbiAoeGhyLCByZXNwb25zZSwgbW9kZSwgZmV0Y2hUaW1lcikge1xyXG5cdHZhciBzZWxmID0gdGhpc1xyXG5cdHN0cmVhbS5SZWFkYWJsZS5jYWxsKHNlbGYpXHJcblxyXG5cdHNlbGYuX21vZGUgPSBtb2RlXHJcblx0c2VsZi5oZWFkZXJzID0ge31cclxuXHRzZWxmLnJhd0hlYWRlcnMgPSBbXVxyXG5cdHNlbGYudHJhaWxlcnMgPSB7fVxyXG5cdHNlbGYucmF3VHJhaWxlcnMgPSBbXVxyXG5cclxuXHQvLyBGYWtlIHRoZSAnY2xvc2UnIGV2ZW50LCBidXQgb25seSBvbmNlICdlbmQnIGZpcmVzXHJcblx0c2VsZi5vbignZW5kJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0Ly8gVGhlIG5leHRUaWNrIGlzIG5lY2Vzc2FyeSB0byBwcmV2ZW50IHRoZSAncmVxdWVzdCcgbW9kdWxlIGZyb20gY2F1c2luZyBhbiBpbmZpbml0ZSBsb29wXHJcblx0XHRwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0c2VsZi5lbWl0KCdjbG9zZScpXHJcblx0XHR9KVxyXG5cdH0pXHJcblxyXG5cdGlmIChtb2RlID09PSAnZmV0Y2gnKSB7XHJcblx0XHRzZWxmLl9mZXRjaFJlc3BvbnNlID0gcmVzcG9uc2VcclxuXHJcblx0XHRzZWxmLnVybCA9IHJlc3BvbnNlLnVybFxyXG5cdFx0c2VsZi5zdGF0dXNDb2RlID0gcmVzcG9uc2Uuc3RhdHVzXHJcblx0XHRzZWxmLnN0YXR1c01lc3NhZ2UgPSByZXNwb25zZS5zdGF0dXNUZXh0XHJcblx0XHRcclxuXHRcdHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGVhZGVyLCBrZXkpe1xyXG5cdFx0XHRzZWxmLmhlYWRlcnNba2V5LnRvTG93ZXJDYXNlKCldID0gaGVhZGVyXHJcblx0XHRcdHNlbGYucmF3SGVhZGVycy5wdXNoKGtleSwgaGVhZGVyKVxyXG5cdFx0fSlcclxuXHJcblx0XHRpZiAoY2FwYWJpbGl0eS53cml0YWJsZVN0cmVhbSkge1xyXG5cdFx0XHR2YXIgd3JpdGFibGUgPSBuZXcgV3JpdGFibGVTdHJlYW0oe1xyXG5cdFx0XHRcdHdyaXRlOiBmdW5jdGlvbiAoY2h1bmspIHtcclxuXHRcdFx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRcdFx0XHRcdGlmIChzZWxmLl9kZXN0cm95ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHRyZWplY3QoKVxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYoc2VsZi5wdXNoKG5ldyBCdWZmZXIoY2h1bmspKSkge1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoKVxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHNlbGYuX3Jlc3VtZUZldGNoID0gcmVzb2x2ZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0Y2xvc2U6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGdsb2JhbC5jbGVhclRpbWVvdXQoZmV0Y2hUaW1lcilcclxuXHRcdFx0XHRcdGlmICghc2VsZi5fZGVzdHJveWVkKVxyXG5cdFx0XHRcdFx0XHRzZWxmLnB1c2gobnVsbClcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGFib3J0OiBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHRpZiAoIXNlbGYuX2Rlc3Ryb3llZClcclxuXHRcdFx0XHRcdFx0c2VsZi5lbWl0KCdlcnJvcicsIGVycilcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHJlc3BvbnNlLmJvZHkucGlwZVRvKHdyaXRhYmxlKS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHRnbG9iYWwuY2xlYXJUaW1lb3V0KGZldGNoVGltZXIpXHJcblx0XHRcdFx0XHRpZiAoIXNlbGYuX2Rlc3Ryb3llZClcclxuXHRcdFx0XHRcdFx0c2VsZi5lbWl0KCdlcnJvcicsIGVycilcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9IGNhdGNoIChlKSB7fSAvLyBwaXBlVG8gbWV0aG9kIGlzbid0IGRlZmluZWQuIENhbid0IGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGZlYXR1cmUgdGVzdCB0aGlzXHJcblx0XHR9XHJcblx0XHQvLyBmYWxsYmFjayBmb3Igd2hlbiB3cml0YWJsZVN0cmVhbSBvciBwaXBlVG8gYXJlbid0IGF2YWlsYWJsZVxyXG5cdFx0dmFyIHJlYWRlciA9IHJlc3BvbnNlLmJvZHkuZ2V0UmVhZGVyKClcclxuXHRcdGZ1bmN0aW9uIHJlYWQgKCkge1xyXG5cdFx0XHRyZWFkZXIucmVhZCgpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG5cdFx0XHRcdGlmIChzZWxmLl9kZXN0cm95ZWQpXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRpZiAocmVzdWx0LmRvbmUpIHtcclxuXHRcdFx0XHRcdGdsb2JhbC5jbGVhclRpbWVvdXQoZmV0Y2hUaW1lcilcclxuXHRcdFx0XHRcdHNlbGYucHVzaChudWxsKVxyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHNlbGYucHVzaChuZXcgQnVmZmVyKHJlc3VsdC52YWx1ZSkpXHJcblx0XHRcdFx0cmVhZCgpXHJcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRnbG9iYWwuY2xlYXJUaW1lb3V0KGZldGNoVGltZXIpXHJcblx0XHRcdFx0aWYgKCFzZWxmLl9kZXN0cm95ZWQpXHJcblx0XHRcdFx0XHRzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdFx0cmVhZCgpXHJcblx0fSBlbHNlIHtcclxuXHRcdHNlbGYuX3hociA9IHhoclxyXG5cdFx0c2VsZi5fcG9zID0gMFxyXG5cclxuXHRcdHNlbGYudXJsID0geGhyLnJlc3BvbnNlVVJMXHJcblx0XHRzZWxmLnN0YXR1c0NvZGUgPSB4aHIuc3RhdHVzXHJcblx0XHRzZWxmLnN0YXR1c01lc3NhZ2UgPSB4aHIuc3RhdHVzVGV4dFxyXG5cdFx0dmFyIGhlYWRlcnMgPSB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkuc3BsaXQoL1xccj9cXG4vKVxyXG5cdFx0aGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoZWFkZXIpIHtcclxuXHRcdFx0dmFyIG1hdGNoZXMgPSBoZWFkZXIubWF0Y2goL14oW146XSspOlxccyooLiopLylcclxuXHRcdFx0aWYgKG1hdGNoZXMpIHtcclxuXHRcdFx0XHR2YXIga2V5ID0gbWF0Y2hlc1sxXS50b0xvd2VyQ2FzZSgpXHJcblx0XHRcdFx0aWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XHJcblx0XHRcdFx0XHRpZiAoc2VsZi5oZWFkZXJzW2tleV0gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0XHRzZWxmLmhlYWRlcnNba2V5XSA9IFtdXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRzZWxmLmhlYWRlcnNba2V5XS5wdXNoKG1hdGNoZXNbMl0pXHJcblx0XHRcdFx0fSBlbHNlIGlmIChzZWxmLmhlYWRlcnNba2V5XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRzZWxmLmhlYWRlcnNba2V5XSArPSAnLCAnICsgbWF0Y2hlc1syXVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzZWxmLmhlYWRlcnNba2V5XSA9IG1hdGNoZXNbMl1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c2VsZi5yYXdIZWFkZXJzLnB1c2gobWF0Y2hlc1sxXSwgbWF0Y2hlc1syXSlcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0XHRzZWxmLl9jaGFyc2V0ID0gJ3gtdXNlci1kZWZpbmVkJ1xyXG5cdFx0aWYgKCFjYXBhYmlsaXR5Lm92ZXJyaWRlTWltZVR5cGUpIHtcclxuXHRcdFx0dmFyIG1pbWVUeXBlID0gc2VsZi5yYXdIZWFkZXJzWydtaW1lLXR5cGUnXVxyXG5cdFx0XHRpZiAobWltZVR5cGUpIHtcclxuXHRcdFx0XHR2YXIgY2hhcnNldE1hdGNoID0gbWltZVR5cGUubWF0Y2goLztcXHMqY2hhcnNldD0oW147XSkoO3wkKS8pXHJcblx0XHRcdFx0aWYgKGNoYXJzZXRNYXRjaCkge1xyXG5cdFx0XHRcdFx0c2VsZi5fY2hhcnNldCA9IGNoYXJzZXRNYXRjaFsxXS50b0xvd2VyQ2FzZSgpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghc2VsZi5fY2hhcnNldClcclxuXHRcdFx0XHRzZWxmLl9jaGFyc2V0ID0gJ3V0Zi04JyAvLyBiZXN0IGd1ZXNzXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5pbmhlcml0cyhJbmNvbWluZ01lc3NhZ2UsIHN0cmVhbS5SZWFkYWJsZSlcclxuXHJcbkluY29taW5nTWVzc2FnZS5wcm90b3R5cGUuX3JlYWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzXHJcblxyXG5cdHZhciByZXNvbHZlID0gc2VsZi5fcmVzdW1lRmV0Y2hcclxuXHRpZiAocmVzb2x2ZSkge1xyXG5cdFx0c2VsZi5fcmVzdW1lRmV0Y2ggPSBudWxsXHJcblx0XHRyZXNvbHZlKClcclxuXHR9XHJcbn1cclxuXHJcbkluY29taW5nTWVzc2FnZS5wcm90b3R5cGUuX29uWEhSUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzXHJcblxyXG5cdHZhciB4aHIgPSBzZWxmLl94aHJcclxuXHJcblx0dmFyIHJlc3BvbnNlID0gbnVsbFxyXG5cdHN3aXRjaCAoc2VsZi5fbW9kZSkge1xyXG5cdFx0Y2FzZSAndGV4dDp2YmFycmF5JzogLy8gRm9yIElFOVxyXG5cdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgIT09IHJTdGF0ZXMuRE9ORSlcclxuXHRcdFx0XHRicmVha1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdC8vIFRoaXMgZmFpbHMgaW4gSUU4XHJcblx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgZ2xvYmFsLlZCQXJyYXkoeGhyLnJlc3BvbnNlQm9keSkudG9BcnJheSgpXHJcblx0XHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0XHRcdGlmIChyZXNwb25zZSAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdHNlbGYucHVzaChuZXcgQnVmZmVyKHJlc3BvbnNlKSlcclxuXHRcdFx0XHRicmVha1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIEZhbGxzIHRocm91Z2ggaW4gSUU4XHRcclxuXHRcdGNhc2UgJ3RleHQnOlxyXG5cdFx0XHR0cnkgeyAvLyBUaGlzIHdpbGwgZmFpbCB3aGVuIHJlYWR5U3RhdGUgPSAzIGluIElFOS4gU3dpdGNoIG1vZGUgYW5kIHdhaXQgZm9yIHJlYWR5U3RhdGUgPSA0XHJcblx0XHRcdFx0cmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRzZWxmLl9tb2RlID0gJ3RleHQ6dmJhcnJheSdcclxuXHRcdFx0XHRicmVha1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChyZXNwb25zZS5sZW5ndGggPiBzZWxmLl9wb3MpIHtcclxuXHRcdFx0XHR2YXIgbmV3RGF0YSA9IHJlc3BvbnNlLnN1YnN0cihzZWxmLl9wb3MpXHJcblx0XHRcdFx0aWYgKHNlbGYuX2NoYXJzZXQgPT09ICd4LXVzZXItZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRcdHZhciBidWZmZXIgPSBuZXcgQnVmZmVyKG5ld0RhdGEubGVuZ3RoKVxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBuZXdEYXRhLmxlbmd0aDsgaSsrKVxyXG5cdFx0XHRcdFx0XHRidWZmZXJbaV0gPSBuZXdEYXRhLmNoYXJDb2RlQXQoaSkgJiAweGZmXHJcblxyXG5cdFx0XHRcdFx0c2VsZi5wdXNoKGJ1ZmZlcilcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2VsZi5wdXNoKG5ld0RhdGEsIHNlbGYuX2NoYXJzZXQpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHNlbGYuX3BvcyA9IHJlc3BvbnNlLmxlbmd0aFxyXG5cdFx0XHR9XHJcblx0XHRcdGJyZWFrXHJcblx0XHRjYXNlICdhcnJheWJ1ZmZlcic6XHJcblx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSAhPT0gclN0YXRlcy5ET05FIHx8ICF4aHIucmVzcG9uc2UpXHJcblx0XHRcdFx0YnJlYWtcclxuXHRcdFx0cmVzcG9uc2UgPSB4aHIucmVzcG9uc2VcclxuXHRcdFx0c2VsZi5wdXNoKG5ldyBCdWZmZXIobmV3IFVpbnQ4QXJyYXkocmVzcG9uc2UpKSlcclxuXHRcdFx0YnJlYWtcclxuXHRcdGNhc2UgJ21vei1jaHVua2VkLWFycmF5YnVmZmVyJzogLy8gdGFrZSB3aG9sZVxyXG5cdFx0XHRyZXNwb25zZSA9IHhoci5yZXNwb25zZVxyXG5cdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgIT09IHJTdGF0ZXMuTE9BRElORyB8fCAhcmVzcG9uc2UpXHJcblx0XHRcdFx0YnJlYWtcclxuXHRcdFx0c2VsZi5wdXNoKG5ldyBCdWZmZXIobmV3IFVpbnQ4QXJyYXkocmVzcG9uc2UpKSlcclxuXHRcdFx0YnJlYWtcclxuXHRcdGNhc2UgJ21zLXN0cmVhbSc6XHJcblx0XHRcdHJlc3BvbnNlID0geGhyLnJlc3BvbnNlXHJcblx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSAhPT0gclN0YXRlcy5MT0FESU5HKVxyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHRcdHZhciByZWFkZXIgPSBuZXcgZ2xvYmFsLk1TU3RyZWFtUmVhZGVyKClcclxuXHRcdFx0cmVhZGVyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKHJlYWRlci5yZXN1bHQuYnl0ZUxlbmd0aCA+IHNlbGYuX3Bvcykge1xyXG5cdFx0XHRcdFx0c2VsZi5wdXNoKG5ldyBCdWZmZXIobmV3IFVpbnQ4QXJyYXkocmVhZGVyLnJlc3VsdC5zbGljZShzZWxmLl9wb3MpKSkpXHJcblx0XHRcdFx0XHRzZWxmLl9wb3MgPSByZWFkZXIucmVzdWx0LmJ5dGVMZW5ndGhcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRzZWxmLnB1c2gobnVsbClcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyByZWFkZXIub25lcnJvciA9ID8/PyAvLyBUT0RPOiB0aGlzXHJcblx0XHRcdHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihyZXNwb25zZSlcclxuXHRcdFx0YnJlYWtcclxuXHR9XHJcblxyXG5cdC8vIFRoZSBtcy1zdHJlYW0gY2FzZSBoYW5kbGVzIGVuZCBzZXBhcmF0ZWx5IGluIHJlYWRlci5vbmxvYWQoKVxyXG5cdGlmIChzZWxmLl94aHIucmVhZHlTdGF0ZSA9PT0gclN0YXRlcy5ET05FICYmIHNlbGYuX21vZGUgIT09ICdtcy1zdHJlYW0nKSB7XHJcblx0XHRzZWxmLnB1c2gobnVsbClcclxuXHR9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==