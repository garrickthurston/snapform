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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3RyZWFtLWh0dHAvbGliL3JlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0cmVhbS1odHRwL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHJlYW0taHR0cC9saWIvY2FwYWJpbGl0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3RyZWFtLWh0dHAvbGliL3Jlc3BvbnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGdGQUFpQixtQkFBTyxDQUFDLDBCQUFjO0FBQ3ZDLGVBQWUsbUJBQU8sQ0FBQyxzQkFBVTtBQUNqQyxlQUFlLG1CQUFPLENBQUMsd0JBQVk7QUFDbkMsYUFBYSxtQkFBTyxDQUFDLDZCQUFpQjtBQUN0QyxvQkFBb0IsbUJBQU8sQ0FBQyw0QkFBZ0I7O0FBRTVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxJQUFJO0FBQ0osMkNBQTJDO0FBQzNDLElBQUk7QUFDSixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7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QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsZUFBZSxJQUFJO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG9CQUFvQjtBQUN4Qzs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidmVuZG9yL3ZlbmRvci5zdHJlYW0taHR0cC5jNGYwNGUwZDNlZjE5ZmQyNjIwMy5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjYXBhYmlsaXR5ID0gcmVxdWlyZSgnLi9jYXBhYmlsaXR5JylcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciByZXNwb25zZSA9IHJlcXVpcmUoJy4vcmVzcG9uc2UnKVxudmFyIHN0cmVhbSA9IHJlcXVpcmUoJ3JlYWRhYmxlLXN0cmVhbScpXG52YXIgdG9BcnJheUJ1ZmZlciA9IHJlcXVpcmUoJ3RvLWFycmF5YnVmZmVyJylcblxudmFyIEluY29taW5nTWVzc2FnZSA9IHJlc3BvbnNlLkluY29taW5nTWVzc2FnZVxudmFyIHJTdGF0ZXMgPSByZXNwb25zZS5yZWFkeVN0YXRlc1xuXG5mdW5jdGlvbiBkZWNpZGVNb2RlIChwcmVmZXJCaW5hcnksIHVzZUZldGNoKSB7XG5cdGlmIChjYXBhYmlsaXR5LmZldGNoICYmIHVzZUZldGNoKSB7XG5cdFx0cmV0dXJuICdmZXRjaCdcblx0fSBlbHNlIGlmIChjYXBhYmlsaXR5Lm1vemNodW5rZWRhcnJheWJ1ZmZlcikge1xuXHRcdHJldHVybiAnbW96LWNodW5rZWQtYXJyYXlidWZmZXInXG5cdH0gZWxzZSBpZiAoY2FwYWJpbGl0eS5tc3N0cmVhbSkge1xuXHRcdHJldHVybiAnbXMtc3RyZWFtJ1xuXHR9IGVsc2UgaWYgKGNhcGFiaWxpdHkuYXJyYXlidWZmZXIgJiYgcHJlZmVyQmluYXJ5KSB7XG5cdFx0cmV0dXJuICdhcnJheWJ1ZmZlcidcblx0fSBlbHNlIGlmIChjYXBhYmlsaXR5LnZiQXJyYXkgJiYgcHJlZmVyQmluYXJ5KSB7XG5cdFx0cmV0dXJuICd0ZXh0OnZiYXJyYXknXG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuICd0ZXh0J1xuXHR9XG59XG5cbnZhciBDbGllbnRSZXF1ZXN0ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0cykge1xuXHR2YXIgc2VsZiA9IHRoaXNcblx0c3RyZWFtLldyaXRhYmxlLmNhbGwoc2VsZilcblxuXHRzZWxmLl9vcHRzID0gb3B0c1xuXHRzZWxmLl9ib2R5ID0gW11cblx0c2VsZi5faGVhZGVycyA9IHt9XG5cdGlmIChvcHRzLmF1dGgpXG5cdFx0c2VsZi5zZXRIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCAnQmFzaWMgJyArIG5ldyBCdWZmZXIob3B0cy5hdXRoKS50b1N0cmluZygnYmFzZTY0JykpXG5cdE9iamVjdC5rZXlzKG9wdHMuaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuXHRcdHNlbGYuc2V0SGVhZGVyKG5hbWUsIG9wdHMuaGVhZGVyc1tuYW1lXSlcblx0fSlcblxuXHR2YXIgcHJlZmVyQmluYXJ5XG5cdHZhciB1c2VGZXRjaCA9IHRydWVcblx0aWYgKG9wdHMubW9kZSA9PT0gJ2Rpc2FibGUtZmV0Y2gnIHx8ICgncmVxdWVzdFRpbWVvdXQnIGluIG9wdHMgJiYgIWNhcGFiaWxpdHkuYWJvcnRDb250cm9sbGVyKSkge1xuXHRcdC8vIElmIHRoZSB1c2Ugb2YgWEhSIHNob3VsZCBiZSBwcmVmZXJyZWQuIE5vdCB0eXBpY2FsbHkgbmVlZGVkLlxuXHRcdHVzZUZldGNoID0gZmFsc2Vcblx0XHRwcmVmZXJCaW5hcnkgPSB0cnVlXG5cdH0gZWxzZSBpZiAob3B0cy5tb2RlID09PSAncHJlZmVyLXN0cmVhbWluZycpIHtcblx0XHQvLyBJZiBzdHJlYW1pbmcgaXMgYSBoaWdoIHByaW9yaXR5IGJ1dCBiaW5hcnkgY29tcGF0aWJpbGl0eSBhbmRcblx0XHQvLyB0aGUgYWNjdXJhY3kgb2YgdGhlICdjb250ZW50LXR5cGUnIGhlYWRlciBhcmVuJ3Rcblx0XHRwcmVmZXJCaW5hcnkgPSBmYWxzZVxuXHR9IGVsc2UgaWYgKG9wdHMubW9kZSA9PT0gJ2FsbG93LXdyb25nLWNvbnRlbnQtdHlwZScpIHtcblx0XHQvLyBJZiBzdHJlYW1pbmcgaXMgbW9yZSBpbXBvcnRhbnQgdGhhbiBwcmVzZXJ2aW5nIHRoZSAnY29udGVudC10eXBlJyBoZWFkZXJcblx0XHRwcmVmZXJCaW5hcnkgPSAhY2FwYWJpbGl0eS5vdmVycmlkZU1pbWVUeXBlXG5cdH0gZWxzZSBpZiAoIW9wdHMubW9kZSB8fCBvcHRzLm1vZGUgPT09ICdkZWZhdWx0JyB8fCBvcHRzLm1vZGUgPT09ICdwcmVmZXItZmFzdCcpIHtcblx0XHQvLyBVc2UgYmluYXJ5IGlmIHRleHQgc3RyZWFtaW5nIG1heSBjb3JydXB0IGRhdGEgb3IgdGhlIGNvbnRlbnQtdHlwZSBoZWFkZXIsIG9yIGZvciBzcGVlZFxuXHRcdHByZWZlckJpbmFyeSA9IHRydWVcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmFsdWUgZm9yIG9wdHMubW9kZScpXG5cdH1cblx0c2VsZi5fbW9kZSA9IGRlY2lkZU1vZGUocHJlZmVyQmluYXJ5LCB1c2VGZXRjaClcblx0c2VsZi5fZmV0Y2hUaW1lciA9IG51bGxcblxuXHRzZWxmLm9uKCdmaW5pc2gnLCBmdW5jdGlvbiAoKSB7XG5cdFx0c2VsZi5fb25GaW5pc2goKVxuXHR9KVxufVxuXG5pbmhlcml0cyhDbGllbnRSZXF1ZXN0LCBzdHJlYW0uV3JpdGFibGUpXG5cbkNsaWVudFJlcXVlc3QucHJvdG90eXBlLnNldEhlYWRlciA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuXHR2YXIgc2VsZiA9IHRoaXNcblx0dmFyIGxvd2VyTmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKVxuXHQvLyBUaGlzIGNoZWNrIGlzIG5vdCBuZWNlc3NhcnksIGJ1dCBpdCBwcmV2ZW50cyB3YXJuaW5ncyBmcm9tIGJyb3dzZXJzIGFib3V0IHNldHRpbmcgdW5zYWZlXG5cdC8vIGhlYWRlcnMuIFRvIGJlIGhvbmVzdCBJJ20gbm90IGVudGlyZWx5IHN1cmUgaGlkaW5nIHRoZXNlIHdhcm5pbmdzIGlzIGEgZ29vZCB0aGluZywgYnV0XG5cdC8vIGh0dHAtYnJvd3NlcmlmeSBkaWQgaXQsIHNvIEkgd2lsbCB0b28uXG5cdGlmICh1bnNhZmVIZWFkZXJzLmluZGV4T2YobG93ZXJOYW1lKSAhPT0gLTEpXG5cdFx0cmV0dXJuXG5cblx0c2VsZi5faGVhZGVyc1tsb3dlck5hbWVdID0ge1xuXHRcdG5hbWU6IG5hbWUsXG5cdFx0dmFsdWU6IHZhbHVlXG5cdH1cbn1cblxuQ2xpZW50UmVxdWVzdC5wcm90b3R5cGUuZ2V0SGVhZGVyID0gZnVuY3Rpb24gKG5hbWUpIHtcblx0dmFyIGhlYWRlciA9IHRoaXMuX2hlYWRlcnNbbmFtZS50b0xvd2VyQ2FzZSgpXVxuXHRpZiAoaGVhZGVyKVxuXHRcdHJldHVybiBoZWFkZXIudmFsdWVcblx0cmV0dXJuIG51bGxcbn1cblxuQ2xpZW50UmVxdWVzdC5wcm90b3R5cGUucmVtb3ZlSGVhZGVyID0gZnVuY3Rpb24gKG5hbWUpIHtcblx0dmFyIHNlbGYgPSB0aGlzXG5cdGRlbGV0ZSBzZWxmLl9oZWFkZXJzW25hbWUudG9Mb3dlckNhc2UoKV1cbn1cblxuQ2xpZW50UmVxdWVzdC5wcm90b3R5cGUuX29uRmluaXNoID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgc2VsZiA9IHRoaXNcblxuXHRpZiAoc2VsZi5fZGVzdHJveWVkKVxuXHRcdHJldHVyblxuXHR2YXIgb3B0cyA9IHNlbGYuX29wdHNcblxuXHR2YXIgaGVhZGVyc09iaiA9IHNlbGYuX2hlYWRlcnNcblx0dmFyIGJvZHkgPSBudWxsXG5cdGlmIChvcHRzLm1ldGhvZCAhPT0gJ0dFVCcgJiYgb3B0cy5tZXRob2QgIT09ICdIRUFEJykge1xuXHRcdGlmIChjYXBhYmlsaXR5LmFycmF5YnVmZmVyKSB7XG5cdFx0XHRib2R5ID0gdG9BcnJheUJ1ZmZlcihCdWZmZXIuY29uY2F0KHNlbGYuX2JvZHkpKVxuXHRcdH0gZWxzZSBpZiAoY2FwYWJpbGl0eS5ibG9iQ29uc3RydWN0b3IpIHtcblx0XHRcdGJvZHkgPSBuZXcgZ2xvYmFsLkJsb2Ioc2VsZi5fYm9keS5tYXAoZnVuY3Rpb24gKGJ1ZmZlcikge1xuXHRcdFx0XHRyZXR1cm4gdG9BcnJheUJ1ZmZlcihidWZmZXIpXG5cdFx0XHR9KSwge1xuXHRcdFx0XHR0eXBlOiAoaGVhZGVyc09ialsnY29udGVudC10eXBlJ10gfHwge30pLnZhbHVlIHx8ICcnXG5cdFx0XHR9KVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBnZXQgdXRmOCBzdHJpbmdcblx0XHRcdGJvZHkgPSBCdWZmZXIuY29uY2F0KHNlbGYuX2JvZHkpLnRvU3RyaW5nKClcblx0XHR9XG5cdH1cblxuXHQvLyBjcmVhdGUgZmxhdHRlbmVkIGxpc3Qgb2YgaGVhZGVyc1xuXHR2YXIgaGVhZGVyc0xpc3QgPSBbXVxuXHRPYmplY3Qua2V5cyhoZWFkZXJzT2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXlOYW1lKSB7XG5cdFx0dmFyIG5hbWUgPSBoZWFkZXJzT2JqW2tleU5hbWVdLm5hbWVcblx0XHR2YXIgdmFsdWUgPSBoZWFkZXJzT2JqW2tleU5hbWVdLnZhbHVlXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHR2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG5cdFx0XHRcdGhlYWRlcnNMaXN0LnB1c2goW25hbWUsIHZdKVxuXHRcdFx0fSlcblx0XHR9IGVsc2Uge1xuXHRcdFx0aGVhZGVyc0xpc3QucHVzaChbbmFtZSwgdmFsdWVdKVxuXHRcdH1cblx0fSlcblxuXHRpZiAoc2VsZi5fbW9kZSA9PT0gJ2ZldGNoJykge1xuXHRcdHZhciBzaWduYWwgPSBudWxsXG5cdFx0dmFyIGZldGNoVGltZXIgPSBudWxsXG5cdFx0aWYgKGNhcGFiaWxpdHkuYWJvcnRDb250cm9sbGVyKSB7XG5cdFx0XHR2YXIgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKVxuXHRcdFx0c2lnbmFsID0gY29udHJvbGxlci5zaWduYWxcblx0XHRcdHNlbGYuX2ZldGNoQWJvcnRDb250cm9sbGVyID0gY29udHJvbGxlclxuXG5cdFx0XHRpZiAoJ3JlcXVlc3RUaW1lb3V0JyBpbiBvcHRzICYmIG9wdHMucmVxdWVzdFRpbWVvdXQgIT09IDApIHtcblx0XHRcdFx0c2VsZi5fZmV0Y2hUaW1lciA9IGdsb2JhbC5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRzZWxmLmVtaXQoJ3JlcXVlc3RUaW1lb3V0Jylcblx0XHRcdFx0XHRpZiAoc2VsZi5fZmV0Y2hBYm9ydENvbnRyb2xsZXIpXG5cdFx0XHRcdFx0XHRzZWxmLl9mZXRjaEFib3J0Q29udHJvbGxlci5hYm9ydCgpXG5cdFx0XHRcdH0sIG9wdHMucmVxdWVzdFRpbWVvdXQpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Z2xvYmFsLmZldGNoKHNlbGYuX29wdHMudXJsLCB7XG5cdFx0XHRtZXRob2Q6IHNlbGYuX29wdHMubWV0aG9kLFxuXHRcdFx0aGVhZGVyczogaGVhZGVyc0xpc3QsXG5cdFx0XHRib2R5OiBib2R5IHx8IHVuZGVmaW5lZCxcblx0XHRcdG1vZGU6ICdjb3JzJyxcblx0XHRcdGNyZWRlbnRpYWxzOiBvcHRzLndpdGhDcmVkZW50aWFscyA/ICdpbmNsdWRlJyA6ICdzYW1lLW9yaWdpbicsXG5cdFx0XHRzaWduYWw6IHNpZ25hbFxuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRzZWxmLl9mZXRjaFJlc3BvbnNlID0gcmVzcG9uc2Vcblx0XHRcdHNlbGYuX2Nvbm5lY3QoKVxuXHRcdH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcblx0XHRcdGdsb2JhbC5jbGVhclRpbWVvdXQoc2VsZi5fZmV0Y2hUaW1lcilcblx0XHRcdGlmICghc2VsZi5fZGVzdHJveWVkKVxuXHRcdFx0XHRzZWxmLmVtaXQoJ2Vycm9yJywgcmVhc29uKVxuXHRcdH0pXG5cdH0gZWxzZSB7XG5cdFx0dmFyIHhociA9IHNlbGYuX3hociA9IG5ldyBnbG9iYWwuWE1MSHR0cFJlcXVlc3QoKVxuXHRcdHRyeSB7XG5cdFx0XHR4aHIub3BlbihzZWxmLl9vcHRzLm1ldGhvZCwgc2VsZi5fb3B0cy51cmwsIHRydWUpXG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0c2VsZi5lbWl0KCdlcnJvcicsIGVycilcblx0XHRcdH0pXG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cblx0XHQvLyBDYW4ndCBzZXQgcmVzcG9uc2VUeXBlIG9uIHJlYWxseSBvbGQgYnJvd3NlcnNcblx0XHRpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyKVxuXHRcdFx0eGhyLnJlc3BvbnNlVHlwZSA9IHNlbGYuX21vZGUuc3BsaXQoJzonKVswXVxuXG5cdFx0aWYgKCd3aXRoQ3JlZGVudGlhbHMnIGluIHhocilcblx0XHRcdHhoci53aXRoQ3JlZGVudGlhbHMgPSAhIW9wdHMud2l0aENyZWRlbnRpYWxzXG5cblx0XHRpZiAoc2VsZi5fbW9kZSA9PT0gJ3RleHQnICYmICdvdmVycmlkZU1pbWVUeXBlJyBpbiB4aHIpXG5cdFx0XHR4aHIub3ZlcnJpZGVNaW1lVHlwZSgndGV4dC9wbGFpbjsgY2hhcnNldD14LXVzZXItZGVmaW5lZCcpXG5cblx0XHRpZiAoJ3JlcXVlc3RUaW1lb3V0JyBpbiBvcHRzKSB7XG5cdFx0XHR4aHIudGltZW91dCA9IG9wdHMucmVxdWVzdFRpbWVvdXRcblx0XHRcdHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHNlbGYuZW1pdCgncmVxdWVzdFRpbWVvdXQnKVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGhlYWRlcnNMaXN0LmZvckVhY2goZnVuY3Rpb24gKGhlYWRlcikge1xuXHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG5cdFx0fSlcblxuXHRcdHNlbGYuX3Jlc3BvbnNlID0gbnVsbFxuXHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRzd2l0Y2ggKHhoci5yZWFkeVN0YXRlKSB7XG5cdFx0XHRcdGNhc2UgclN0YXRlcy5MT0FESU5HOlxuXHRcdFx0XHRjYXNlIHJTdGF0ZXMuRE9ORTpcblx0XHRcdFx0XHRzZWxmLl9vblhIUlByb2dyZXNzKClcblx0XHRcdFx0XHRicmVha1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBOZWNlc3NhcnkgZm9yIHN0cmVhbWluZyBpbiBGaXJlZm94LCBzaW5jZSB4aHIucmVzcG9uc2UgaXMgT05MWSBkZWZpbmVkXG5cdFx0Ly8gaW4gb25wcm9ncmVzcywgbm90IGluIG9ucmVhZHlzdGF0ZWNoYW5nZSB3aXRoIHhoci5yZWFkeVN0YXRlID0gM1xuXHRcdGlmIChzZWxmLl9tb2RlID09PSAnbW96LWNodW5rZWQtYXJyYXlidWZmZXInKSB7XG5cdFx0XHR4aHIub25wcm9ncmVzcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0c2VsZi5fb25YSFJQcm9ncmVzcygpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0eGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoc2VsZi5fZGVzdHJveWVkKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdHNlbGYuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ1hIUiBlcnJvcicpKVxuXHRcdH1cblxuXHRcdHRyeSB7XG5cdFx0XHR4aHIuc2VuZChib2R5KVxuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0cHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHNlbGYuZW1pdCgnZXJyb3InLCBlcnIpXG5cdFx0XHR9KVxuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHhoci5zdGF0dXMgaXMgcmVhZGFibGUgYW5kIG5vbi16ZXJvLCBpbmRpY2F0aW5nIG5vIGVycm9yLlxuICogRXZlbiB0aG91Z2ggdGhlIHNwZWMgc2F5cyBpdCBzaG91bGQgYmUgYXZhaWxhYmxlIGluIHJlYWR5U3RhdGUgMyxcbiAqIGFjY2Vzc2luZyBpdCB0aHJvd3MgYW4gZXhjZXB0aW9uIGluIElFOFxuICovXG5mdW5jdGlvbiBzdGF0dXNWYWxpZCAoeGhyKSB7XG5cdHRyeSB7XG5cdFx0dmFyIHN0YXR1cyA9IHhoci5zdGF0dXNcblx0XHRyZXR1cm4gKHN0YXR1cyAhPT0gbnVsbCAmJiBzdGF0dXMgIT09IDApXG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxufVxuXG5DbGllbnRSZXF1ZXN0LnByb3RvdHlwZS5fb25YSFJQcm9ncmVzcyA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHNlbGYgPSB0aGlzXG5cblx0aWYgKCFzdGF0dXNWYWxpZChzZWxmLl94aHIpIHx8IHNlbGYuX2Rlc3Ryb3llZClcblx0XHRyZXR1cm5cblxuXHRpZiAoIXNlbGYuX3Jlc3BvbnNlKVxuXHRcdHNlbGYuX2Nvbm5lY3QoKVxuXG5cdHNlbGYuX3Jlc3BvbnNlLl9vblhIUlByb2dyZXNzKClcbn1cblxuQ2xpZW50UmVxdWVzdC5wcm90b3R5cGUuX2Nvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBzZWxmID0gdGhpc1xuXG5cdGlmIChzZWxmLl9kZXN0cm95ZWQpXG5cdFx0cmV0dXJuXG5cblx0c2VsZi5fcmVzcG9uc2UgPSBuZXcgSW5jb21pbmdNZXNzYWdlKHNlbGYuX3hociwgc2VsZi5fZmV0Y2hSZXNwb25zZSwgc2VsZi5fbW9kZSwgc2VsZi5fZmV0Y2hUaW1lcilcblx0c2VsZi5fcmVzcG9uc2Uub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyKSB7XG5cdFx0c2VsZi5lbWl0KCdlcnJvcicsIGVycilcblx0fSlcblxuXHRzZWxmLmVtaXQoJ3Jlc3BvbnNlJywgc2VsZi5fcmVzcG9uc2UpXG59XG5cbkNsaWVudFJlcXVlc3QucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uIChjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG5cdHZhciBzZWxmID0gdGhpc1xuXG5cdHNlbGYuX2JvZHkucHVzaChjaHVuaylcblx0Y2IoKVxufVxuXG5DbGllbnRSZXF1ZXN0LnByb3RvdHlwZS5hYm9ydCA9IENsaWVudFJlcXVlc3QucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBzZWxmID0gdGhpc1xuXHRzZWxmLl9kZXN0cm95ZWQgPSB0cnVlXG5cdGdsb2JhbC5jbGVhclRpbWVvdXQoc2VsZi5fZmV0Y2hUaW1lcilcblx0aWYgKHNlbGYuX3Jlc3BvbnNlKVxuXHRcdHNlbGYuX3Jlc3BvbnNlLl9kZXN0cm95ZWQgPSB0cnVlXG5cdGlmIChzZWxmLl94aHIpXG5cdFx0c2VsZi5feGhyLmFib3J0KClcblx0ZWxzZSBpZiAoc2VsZi5fZmV0Y2hBYm9ydENvbnRyb2xsZXIpXG5cdFx0c2VsZi5fZmV0Y2hBYm9ydENvbnRyb2xsZXIuYWJvcnQoKVxufVxuXG5DbGllbnRSZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbiAoZGF0YSwgZW5jb2RpbmcsIGNiKSB7XG5cdHZhciBzZWxmID0gdGhpc1xuXHRpZiAodHlwZW9mIGRhdGEgPT09ICdmdW5jdGlvbicpIHtcblx0XHRjYiA9IGRhdGFcblx0XHRkYXRhID0gdW5kZWZpbmVkXG5cdH1cblxuXHRzdHJlYW0uV3JpdGFibGUucHJvdG90eXBlLmVuZC5jYWxsKHNlbGYsIGRhdGEsIGVuY29kaW5nLCBjYilcbn1cblxuQ2xpZW50UmVxdWVzdC5wcm90b3R5cGUuZmx1c2hIZWFkZXJzID0gZnVuY3Rpb24gKCkge31cbkNsaWVudFJlcXVlc3QucHJvdG90eXBlLnNldFRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7fVxuQ2xpZW50UmVxdWVzdC5wcm90b3R5cGUuc2V0Tm9EZWxheSA9IGZ1bmN0aW9uICgpIHt9XG5DbGllbnRSZXF1ZXN0LnByb3RvdHlwZS5zZXRTb2NrZXRLZWVwQWxpdmUgPSBmdW5jdGlvbiAoKSB7fVxuXG4vLyBUYWtlbiBmcm9tIGh0dHA6Ly93d3cudzMub3JnL1RSL1hNTEh0dHBSZXF1ZXN0LyN0aGUtc2V0cmVxdWVzdGhlYWRlciUyOCUyOS1tZXRob2RcbnZhciB1bnNhZmVIZWFkZXJzID0gW1xuXHQnYWNjZXB0LWNoYXJzZXQnLFxuXHQnYWNjZXB0LWVuY29kaW5nJyxcblx0J2FjY2Vzcy1jb250cm9sLXJlcXVlc3QtaGVhZGVycycsXG5cdCdhY2Nlc3MtY29udHJvbC1yZXF1ZXN0LW1ldGhvZCcsXG5cdCdjb25uZWN0aW9uJyxcblx0J2NvbnRlbnQtbGVuZ3RoJyxcblx0J2Nvb2tpZScsXG5cdCdjb29raWUyJyxcblx0J2RhdGUnLFxuXHQnZG50Jyxcblx0J2V4cGVjdCcsXG5cdCdob3N0Jyxcblx0J2tlZXAtYWxpdmUnLFxuXHQnb3JpZ2luJyxcblx0J3JlZmVyZXInLFxuXHQndGUnLFxuXHQndHJhaWxlcicsXG5cdCd0cmFuc2Zlci1lbmNvZGluZycsXG5cdCd1cGdyYWRlJyxcblx0J3ZpYSdcbl1cbiIsInZhciBDbGllbnRSZXF1ZXN0ID0gcmVxdWlyZSgnLi9saWIvcmVxdWVzdCcpXG52YXIgcmVzcG9uc2UgPSByZXF1aXJlKCcuL2xpYi9yZXNwb25zZScpXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgneHRlbmQnKVxudmFyIHN0YXR1c0NvZGVzID0gcmVxdWlyZSgnYnVpbHRpbi1zdGF0dXMtY29kZXMnKVxudmFyIHVybCA9IHJlcXVpcmUoJ3VybCcpXG5cbnZhciBodHRwID0gZXhwb3J0c1xuXG5odHRwLnJlcXVlc3QgPSBmdW5jdGlvbiAob3B0cywgY2IpIHtcblx0aWYgKHR5cGVvZiBvcHRzID09PSAnc3RyaW5nJylcblx0XHRvcHRzID0gdXJsLnBhcnNlKG9wdHMpXG5cdGVsc2Vcblx0XHRvcHRzID0gZXh0ZW5kKG9wdHMpXG5cblx0Ly8gTm9ybWFsbHksIHRoZSBwYWdlIGlzIGxvYWRlZCBmcm9tIGh0dHAgb3IgaHR0cHMsIHNvIG5vdCBzcGVjaWZ5aW5nIGEgcHJvdG9jb2xcblx0Ly8gd2lsbCByZXN1bHQgaW4gYSAodmFsaWQpIHByb3RvY29sLXJlbGF0aXZlIHVybC4gSG93ZXZlciwgdGhpcyB3b24ndCB3b3JrIGlmXG5cdC8vIHRoZSBwcm90b2NvbCBpcyBzb21ldGhpbmcgZWxzZSwgbGlrZSAnZmlsZTonXG5cdHZhciBkZWZhdWx0UHJvdG9jb2wgPSBnbG9iYWwubG9jYXRpb24ucHJvdG9jb2wuc2VhcmNoKC9eaHR0cHM/OiQvKSA9PT0gLTEgPyAnaHR0cDonIDogJydcblxuXHR2YXIgcHJvdG9jb2wgPSBvcHRzLnByb3RvY29sIHx8IGRlZmF1bHRQcm90b2NvbFxuXHR2YXIgaG9zdCA9IG9wdHMuaG9zdG5hbWUgfHwgb3B0cy5ob3N0XG5cdHZhciBwb3J0ID0gb3B0cy5wb3J0XG5cdHZhciBwYXRoID0gb3B0cy5wYXRoIHx8ICcvJ1xuXG5cdC8vIE5lY2Vzc2FyeSBmb3IgSVB2NiBhZGRyZXNzZXNcblx0aWYgKGhvc3QgJiYgaG9zdC5pbmRleE9mKCc6JykgIT09IC0xKVxuXHRcdGhvc3QgPSAnWycgKyBob3N0ICsgJ10nXG5cblx0Ly8gVGhpcyBtYXkgYmUgYSByZWxhdGl2ZSB1cmwuIFRoZSBicm93c2VyIHNob3VsZCBhbHdheXMgYmUgYWJsZSB0byBpbnRlcnByZXQgaXQgY29ycmVjdGx5LlxuXHRvcHRzLnVybCA9IChob3N0ID8gKHByb3RvY29sICsgJy8vJyArIGhvc3QpIDogJycpICsgKHBvcnQgPyAnOicgKyBwb3J0IDogJycpICsgcGF0aFxuXHRvcHRzLm1ldGhvZCA9IChvcHRzLm1ldGhvZCB8fCAnR0VUJykudG9VcHBlckNhc2UoKVxuXHRvcHRzLmhlYWRlcnMgPSBvcHRzLmhlYWRlcnMgfHwge31cblxuXHQvLyBBbHNvIHZhbGlkIG9wdHMuYXV0aCwgb3B0cy5tb2RlXG5cblx0dmFyIHJlcSA9IG5ldyBDbGllbnRSZXF1ZXN0KG9wdHMpXG5cdGlmIChjYilcblx0XHRyZXEub24oJ3Jlc3BvbnNlJywgY2IpXG5cdHJldHVybiByZXFcbn1cblxuaHR0cC5nZXQgPSBmdW5jdGlvbiBnZXQgKG9wdHMsIGNiKSB7XG5cdHZhciByZXEgPSBodHRwLnJlcXVlc3Qob3B0cywgY2IpXG5cdHJlcS5lbmQoKVxuXHRyZXR1cm4gcmVxXG59XG5cbmh0dHAuQ2xpZW50UmVxdWVzdCA9IENsaWVudFJlcXVlc3Rcbmh0dHAuSW5jb21pbmdNZXNzYWdlID0gcmVzcG9uc2UuSW5jb21pbmdNZXNzYWdlXG5cbmh0dHAuQWdlbnQgPSBmdW5jdGlvbiAoKSB7fVxuaHR0cC5BZ2VudC5kZWZhdWx0TWF4U29ja2V0cyA9IDRcblxuaHR0cC5nbG9iYWxBZ2VudCA9IG5ldyBodHRwLkFnZW50KClcblxuaHR0cC5TVEFUVVNfQ09ERVMgPSBzdGF0dXNDb2Rlc1xuXG5odHRwLk1FVEhPRFMgPSBbXG5cdCdDSEVDS09VVCcsXG5cdCdDT05ORUNUJyxcblx0J0NPUFknLFxuXHQnREVMRVRFJyxcblx0J0dFVCcsXG5cdCdIRUFEJyxcblx0J0xPQ0snLFxuXHQnTS1TRUFSQ0gnLFxuXHQnTUVSR0UnLFxuXHQnTUtBQ1RJVklUWScsXG5cdCdNS0NPTCcsXG5cdCdNT1ZFJyxcblx0J05PVElGWScsXG5cdCdPUFRJT05TJyxcblx0J1BBVENIJyxcblx0J1BPU1QnLFxuXHQnUFJPUEZJTkQnLFxuXHQnUFJPUFBBVENIJyxcblx0J1BVUkdFJyxcblx0J1BVVCcsXG5cdCdSRVBPUlQnLFxuXHQnU0VBUkNIJyxcblx0J1NVQlNDUklCRScsXG5cdCdUUkFDRScsXG5cdCdVTkxPQ0snLFxuXHQnVU5TVUJTQ1JJQkUnXG5dIiwiZXhwb3J0cy5mZXRjaCA9IGlzRnVuY3Rpb24oZ2xvYmFsLmZldGNoKSAmJiBpc0Z1bmN0aW9uKGdsb2JhbC5SZWFkYWJsZVN0cmVhbSlcblxuZXhwb3J0cy53cml0YWJsZVN0cmVhbSA9IGlzRnVuY3Rpb24oZ2xvYmFsLldyaXRhYmxlU3RyZWFtKVxuXG5leHBvcnRzLmFib3J0Q29udHJvbGxlciA9IGlzRnVuY3Rpb24oZ2xvYmFsLkFib3J0Q29udHJvbGxlcilcblxuZXhwb3J0cy5ibG9iQ29uc3RydWN0b3IgPSBmYWxzZVxudHJ5IHtcblx0bmV3IEJsb2IoW25ldyBBcnJheUJ1ZmZlcigxKV0pXG5cdGV4cG9ydHMuYmxvYkNvbnN0cnVjdG9yID0gdHJ1ZVxufSBjYXRjaCAoZSkge31cblxuLy8gVGhlIHhociByZXF1ZXN0IHRvIGV4YW1wbGUuY29tIG1heSB2aW9sYXRlIHNvbWUgcmVzdHJpY3RpdmUgQ1NQIGNvbmZpZ3VyYXRpb25zLFxuLy8gc28gaWYgd2UncmUgcnVubmluZyBpbiBhIGJyb3dzZXIgdGhhdCBzdXBwb3J0cyBgZmV0Y2hgLCBhdm9pZCBjYWxsaW5nIGdldFhIUigpXG4vLyBhbmQgYXNzdW1lIHN1cHBvcnQgZm9yIGNlcnRhaW4gZmVhdHVyZXMgYmVsb3cuXG52YXIgeGhyXG5mdW5jdGlvbiBnZXRYSFIgKCkge1xuXHQvLyBDYWNoZSB0aGUgeGhyIHZhbHVlXG5cdGlmICh4aHIgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHhoclxuXG5cdGlmIChnbG9iYWwuWE1MSHR0cFJlcXVlc3QpIHtcblx0XHR4aHIgPSBuZXcgZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KClcblx0XHQvLyBJZiBYRG9tYWluUmVxdWVzdCBpcyBhdmFpbGFibGUgKGllIG9ubHksIHdoZXJlIHhociBtaWdodCBub3Qgd29ya1xuXHRcdC8vIGNyb3NzIGRvbWFpbiksIHVzZSB0aGUgcGFnZSBsb2NhdGlvbi4gT3RoZXJ3aXNlIHVzZSBleGFtcGxlLmNvbVxuXHRcdC8vIE5vdGU6IHRoaXMgZG9lc24ndCBhY3R1YWxseSBtYWtlIGFuIGh0dHAgcmVxdWVzdC5cblx0XHR0cnkge1xuXHRcdFx0eGhyLm9wZW4oJ0dFVCcsIGdsb2JhbC5YRG9tYWluUmVxdWVzdCA/ICcvJyA6ICdodHRwczovL2V4YW1wbGUuY29tJylcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdHhociA9IG51bGxcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly8gU2VydmljZSB3b3JrZXJzIGRvbid0IGhhdmUgWEhSXG5cdFx0eGhyID0gbnVsbFxuXHR9XG5cdHJldHVybiB4aHJcbn1cblxuZnVuY3Rpb24gY2hlY2tUeXBlU3VwcG9ydCAodHlwZSkge1xuXHR2YXIgeGhyID0gZ2V0WEhSKClcblx0aWYgKCF4aHIpIHJldHVybiBmYWxzZVxuXHR0cnkge1xuXHRcdHhoci5yZXNwb25zZVR5cGUgPSB0eXBlXG5cdFx0cmV0dXJuIHhoci5yZXNwb25zZVR5cGUgPT09IHR5cGVcblx0fSBjYXRjaCAoZSkge31cblx0cmV0dXJuIGZhbHNlXG59XG5cbi8vIEZvciBzb21lIHN0cmFuZ2UgcmVhc29uLCBTYWZhcmkgNy4wIHJlcG9ydHMgdHlwZW9mIGdsb2JhbC5BcnJheUJ1ZmZlciA9PT0gJ29iamVjdCcuXG4vLyBTYWZhcmkgNy4xIGFwcGVhcnMgdG8gaGF2ZSBmaXhlZCB0aGlzIGJ1Zy5cbnZhciBoYXZlQXJyYXlCdWZmZXIgPSB0eXBlb2YgZ2xvYmFsLkFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJ1xudmFyIGhhdmVTbGljZSA9IGhhdmVBcnJheUJ1ZmZlciAmJiBpc0Z1bmN0aW9uKGdsb2JhbC5BcnJheUJ1ZmZlci5wcm90b3R5cGUuc2xpY2UpXG5cbi8vIElmIGZldGNoIGlzIHN1cHBvcnRlZCwgdGhlbiBhcnJheWJ1ZmZlciB3aWxsIGJlIHN1cHBvcnRlZCB0b28uIFNraXAgY2FsbGluZ1xuLy8gY2hlY2tUeXBlU3VwcG9ydCgpLCBzaW5jZSB0aGF0IGNhbGxzIGdldFhIUigpLlxuZXhwb3J0cy5hcnJheWJ1ZmZlciA9IGV4cG9ydHMuZmV0Y2ggfHwgKGhhdmVBcnJheUJ1ZmZlciAmJiBjaGVja1R5cGVTdXBwb3J0KCdhcnJheWJ1ZmZlcicpKVxuXG4vLyBUaGVzZSBuZXh0IHR3byB0ZXN0cyB1bmF2b2lkYWJseSBzaG93IHdhcm5pbmdzIGluIENocm9tZS4gU2luY2UgZmV0Y2ggd2lsbCBhbHdheXNcbi8vIGJlIHVzZWQgaWYgaXQncyBhdmFpbGFibGUsIGp1c3QgcmV0dXJuIGZhbHNlIGZvciB0aGVzZSB0byBhdm9pZCB0aGUgd2FybmluZ3MuXG5leHBvcnRzLm1zc3RyZWFtID0gIWV4cG9ydHMuZmV0Y2ggJiYgaGF2ZVNsaWNlICYmIGNoZWNrVHlwZVN1cHBvcnQoJ21zLXN0cmVhbScpXG5leHBvcnRzLm1vemNodW5rZWRhcnJheWJ1ZmZlciA9ICFleHBvcnRzLmZldGNoICYmIGhhdmVBcnJheUJ1ZmZlciAmJlxuXHRjaGVja1R5cGVTdXBwb3J0KCdtb3otY2h1bmtlZC1hcnJheWJ1ZmZlcicpXG5cbi8vIElmIGZldGNoIGlzIHN1cHBvcnRlZCwgdGhlbiBvdmVycmlkZU1pbWVUeXBlIHdpbGwgYmUgc3VwcG9ydGVkIHRvby4gU2tpcCBjYWxsaW5nXG4vLyBnZXRYSFIoKS5cbmV4cG9ydHMub3ZlcnJpZGVNaW1lVHlwZSA9IGV4cG9ydHMuZmV0Y2ggfHwgKGdldFhIUigpID8gaXNGdW5jdGlvbihnZXRYSFIoKS5vdmVycmlkZU1pbWVUeXBlKSA6IGZhbHNlKVxuXG5leHBvcnRzLnZiQXJyYXkgPSBpc0Z1bmN0aW9uKGdsb2JhbC5WQkFycmF5KVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uICh2YWx1ZSkge1xuXHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nXG59XG5cbnhociA9IG51bGwgLy8gSGVscCBnY1xuIiwidmFyIGNhcGFiaWxpdHkgPSByZXF1aXJlKCcuL2NhcGFiaWxpdHknKVxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxudmFyIHN0cmVhbSA9IHJlcXVpcmUoJ3JlYWRhYmxlLXN0cmVhbScpXG5cbnZhciByU3RhdGVzID0gZXhwb3J0cy5yZWFkeVN0YXRlcyA9IHtcblx0VU5TRU5UOiAwLFxuXHRPUEVORUQ6IDEsXG5cdEhFQURFUlNfUkVDRUlWRUQ6IDIsXG5cdExPQURJTkc6IDMsXG5cdERPTkU6IDRcbn1cblxudmFyIEluY29taW5nTWVzc2FnZSA9IGV4cG9ydHMuSW5jb21pbmdNZXNzYWdlID0gZnVuY3Rpb24gKHhociwgcmVzcG9uc2UsIG1vZGUsIGZldGNoVGltZXIpIHtcblx0dmFyIHNlbGYgPSB0aGlzXG5cdHN0cmVhbS5SZWFkYWJsZS5jYWxsKHNlbGYpXG5cblx0c2VsZi5fbW9kZSA9IG1vZGVcblx0c2VsZi5oZWFkZXJzID0ge31cblx0c2VsZi5yYXdIZWFkZXJzID0gW11cblx0c2VsZi50cmFpbGVycyA9IHt9XG5cdHNlbGYucmF3VHJhaWxlcnMgPSBbXVxuXG5cdC8vIEZha2UgdGhlICdjbG9zZScgZXZlbnQsIGJ1dCBvbmx5IG9uY2UgJ2VuZCcgZmlyZXNcblx0c2VsZi5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuXHRcdC8vIFRoZSBuZXh0VGljayBpcyBuZWNlc3NhcnkgdG8gcHJldmVudCB0aGUgJ3JlcXVlc3QnIG1vZHVsZSBmcm9tIGNhdXNpbmcgYW4gaW5maW5pdGUgbG9vcFxuXHRcdHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuXHRcdFx0c2VsZi5lbWl0KCdjbG9zZScpXG5cdFx0fSlcblx0fSlcblxuXHRpZiAobW9kZSA9PT0gJ2ZldGNoJykge1xuXHRcdHNlbGYuX2ZldGNoUmVzcG9uc2UgPSByZXNwb25zZVxuXG5cdFx0c2VsZi51cmwgPSByZXNwb25zZS51cmxcblx0XHRzZWxmLnN0YXR1c0NvZGUgPSByZXNwb25zZS5zdGF0dXNcblx0XHRzZWxmLnN0YXR1c01lc3NhZ2UgPSByZXNwb25zZS5zdGF0dXNUZXh0XG5cdFx0XG5cdFx0cmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoZWFkZXIsIGtleSl7XG5cdFx0XHRzZWxmLmhlYWRlcnNba2V5LnRvTG93ZXJDYXNlKCldID0gaGVhZGVyXG5cdFx0XHRzZWxmLnJhd0hlYWRlcnMucHVzaChrZXksIGhlYWRlcilcblx0XHR9KVxuXG5cdFx0aWYgKGNhcGFiaWxpdHkud3JpdGFibGVTdHJlYW0pIHtcblx0XHRcdHZhciB3cml0YWJsZSA9IG5ldyBXcml0YWJsZVN0cmVhbSh7XG5cdFx0XHRcdHdyaXRlOiBmdW5jdGlvbiAoY2h1bmspIHtcblx0XHRcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0XHRcdFx0aWYgKHNlbGYuX2Rlc3Ryb3llZCkge1xuXHRcdFx0XHRcdFx0XHRyZWplY3QoKVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmKHNlbGYucHVzaChuZXcgQnVmZmVyKGNodW5rKSkpIHtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgpXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRzZWxmLl9yZXN1bWVGZXRjaCA9IHJlc29sdmVcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjbG9zZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGdsb2JhbC5jbGVhclRpbWVvdXQoZmV0Y2hUaW1lcilcblx0XHRcdFx0XHRpZiAoIXNlbGYuX2Rlc3Ryb3llZClcblx0XHRcdFx0XHRcdHNlbGYucHVzaChudWxsKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRhYm9ydDogZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRcdGlmICghc2VsZi5fZGVzdHJveWVkKVxuXHRcdFx0XHRcdFx0c2VsZi5lbWl0KCdlcnJvcicsIGVycilcblx0XHRcdFx0fVxuXHRcdFx0fSlcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0cmVzcG9uc2UuYm9keS5waXBlVG8od3JpdGFibGUpLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0XHRnbG9iYWwuY2xlYXJUaW1lb3V0KGZldGNoVGltZXIpXG5cdFx0XHRcdFx0aWYgKCFzZWxmLl9kZXN0cm95ZWQpXG5cdFx0XHRcdFx0XHRzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKVxuXHRcdFx0XHR9KVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH0gY2F0Y2ggKGUpIHt9IC8vIHBpcGVUbyBtZXRob2QgaXNuJ3QgZGVmaW5lZC4gQ2FuJ3QgZmluZCBhIGJldHRlciB3YXkgdG8gZmVhdHVyZSB0ZXN0IHRoaXNcblx0XHR9XG5cdFx0Ly8gZmFsbGJhY2sgZm9yIHdoZW4gd3JpdGFibGVTdHJlYW0gb3IgcGlwZVRvIGFyZW4ndCBhdmFpbGFibGVcblx0XHR2YXIgcmVhZGVyID0gcmVzcG9uc2UuYm9keS5nZXRSZWFkZXIoKVxuXHRcdGZ1bmN0aW9uIHJlYWQgKCkge1xuXHRcdFx0cmVhZGVyLnJlYWQoKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRcdFx0aWYgKHNlbGYuX2Rlc3Ryb3llZClcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0aWYgKHJlc3VsdC5kb25lKSB7XG5cdFx0XHRcdFx0Z2xvYmFsLmNsZWFyVGltZW91dChmZXRjaFRpbWVyKVxuXHRcdFx0XHRcdHNlbGYucHVzaChudWxsKVxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHR9XG5cdFx0XHRcdHNlbGYucHVzaChuZXcgQnVmZmVyKHJlc3VsdC52YWx1ZSkpXG5cdFx0XHRcdHJlYWQoKVxuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRnbG9iYWwuY2xlYXJUaW1lb3V0KGZldGNoVGltZXIpXG5cdFx0XHRcdGlmICghc2VsZi5fZGVzdHJveWVkKVxuXHRcdFx0XHRcdHNlbGYuZW1pdCgnZXJyb3InLCBlcnIpXG5cdFx0XHR9KVxuXHRcdH1cblx0XHRyZWFkKClcblx0fSBlbHNlIHtcblx0XHRzZWxmLl94aHIgPSB4aHJcblx0XHRzZWxmLl9wb3MgPSAwXG5cblx0XHRzZWxmLnVybCA9IHhoci5yZXNwb25zZVVSTFxuXHRcdHNlbGYuc3RhdHVzQ29kZSA9IHhoci5zdGF0dXNcblx0XHRzZWxmLnN0YXR1c01lc3NhZ2UgPSB4aHIuc3RhdHVzVGV4dFxuXHRcdHZhciBoZWFkZXJzID0geGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpLnNwbGl0KC9cXHI/XFxuLylcblx0XHRoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24gKGhlYWRlcikge1xuXHRcdFx0dmFyIG1hdGNoZXMgPSBoZWFkZXIubWF0Y2goL14oW146XSspOlxccyooLiopLylcblx0XHRcdGlmIChtYXRjaGVzKSB7XG5cdFx0XHRcdHZhciBrZXkgPSBtYXRjaGVzWzFdLnRvTG93ZXJDYXNlKClcblx0XHRcdFx0aWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG5cdFx0XHRcdFx0aWYgKHNlbGYuaGVhZGVyc1trZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHNlbGYuaGVhZGVyc1trZXldID0gW11cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c2VsZi5oZWFkZXJzW2tleV0ucHVzaChtYXRjaGVzWzJdKVxuXHRcdFx0XHR9IGVsc2UgaWYgKHNlbGYuaGVhZGVyc1trZXldICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRzZWxmLmhlYWRlcnNba2V5XSArPSAnLCAnICsgbWF0Y2hlc1syXVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlbGYuaGVhZGVyc1trZXldID0gbWF0Y2hlc1syXVxuXHRcdFx0XHR9XG5cdFx0XHRcdHNlbGYucmF3SGVhZGVycy5wdXNoKG1hdGNoZXNbMV0sIG1hdGNoZXNbMl0pXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdHNlbGYuX2NoYXJzZXQgPSAneC11c2VyLWRlZmluZWQnXG5cdFx0aWYgKCFjYXBhYmlsaXR5Lm92ZXJyaWRlTWltZVR5cGUpIHtcblx0XHRcdHZhciBtaW1lVHlwZSA9IHNlbGYucmF3SGVhZGVyc1snbWltZS10eXBlJ11cblx0XHRcdGlmIChtaW1lVHlwZSkge1xuXHRcdFx0XHR2YXIgY2hhcnNldE1hdGNoID0gbWltZVR5cGUubWF0Y2goLztcXHMqY2hhcnNldD0oW147XSkoO3wkKS8pXG5cdFx0XHRcdGlmIChjaGFyc2V0TWF0Y2gpIHtcblx0XHRcdFx0XHRzZWxmLl9jaGFyc2V0ID0gY2hhcnNldE1hdGNoWzFdLnRvTG93ZXJDYXNlKClcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKCFzZWxmLl9jaGFyc2V0KVxuXHRcdFx0XHRzZWxmLl9jaGFyc2V0ID0gJ3V0Zi04JyAvLyBiZXN0IGd1ZXNzXG5cdFx0fVxuXHR9XG59XG5cbmluaGVyaXRzKEluY29taW5nTWVzc2FnZSwgc3RyZWFtLlJlYWRhYmxlKVxuXG5JbmNvbWluZ01lc3NhZ2UucHJvdG90eXBlLl9yZWFkID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgc2VsZiA9IHRoaXNcblxuXHR2YXIgcmVzb2x2ZSA9IHNlbGYuX3Jlc3VtZUZldGNoXG5cdGlmIChyZXNvbHZlKSB7XG5cdFx0c2VsZi5fcmVzdW1lRmV0Y2ggPSBudWxsXG5cdFx0cmVzb2x2ZSgpXG5cdH1cbn1cblxuSW5jb21pbmdNZXNzYWdlLnByb3RvdHlwZS5fb25YSFJQcm9ncmVzcyA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHNlbGYgPSB0aGlzXG5cblx0dmFyIHhociA9IHNlbGYuX3hoclxuXG5cdHZhciByZXNwb25zZSA9IG51bGxcblx0c3dpdGNoIChzZWxmLl9tb2RlKSB7XG5cdFx0Y2FzZSAndGV4dDp2YmFycmF5JzogLy8gRm9yIElFOVxuXHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlICE9PSByU3RhdGVzLkRPTkUpXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHR0cnkge1xuXHRcdFx0XHQvLyBUaGlzIGZhaWxzIGluIElFOFxuXHRcdFx0XHRyZXNwb25zZSA9IG5ldyBnbG9iYWwuVkJBcnJheSh4aHIucmVzcG9uc2VCb2R5KS50b0FycmF5KClcblx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cdFx0XHRpZiAocmVzcG9uc2UgIT09IG51bGwpIHtcblx0XHRcdFx0c2VsZi5wdXNoKG5ldyBCdWZmZXIocmVzcG9uc2UpKVxuXHRcdFx0XHRicmVha1xuXHRcdFx0fVxuXHRcdFx0Ly8gRmFsbHMgdGhyb3VnaCBpbiBJRThcdFxuXHRcdGNhc2UgJ3RleHQnOlxuXHRcdFx0dHJ5IHsgLy8gVGhpcyB3aWxsIGZhaWwgd2hlbiByZWFkeVN0YXRlID0gMyBpbiBJRTkuIFN3aXRjaCBtb2RlIGFuZCB3YWl0IGZvciByZWFkeVN0YXRlID0gNFxuXHRcdFx0XHRyZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHRcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0c2VsZi5fbW9kZSA9ICd0ZXh0OnZiYXJyYXknXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHR9XG5cdFx0XHRpZiAocmVzcG9uc2UubGVuZ3RoID4gc2VsZi5fcG9zKSB7XG5cdFx0XHRcdHZhciBuZXdEYXRhID0gcmVzcG9uc2Uuc3Vic3RyKHNlbGYuX3Bvcylcblx0XHRcdFx0aWYgKHNlbGYuX2NoYXJzZXQgPT09ICd4LXVzZXItZGVmaW5lZCcpIHtcblx0XHRcdFx0XHR2YXIgYnVmZmVyID0gbmV3IEJ1ZmZlcihuZXdEYXRhLmxlbmd0aClcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG5ld0RhdGEubGVuZ3RoOyBpKyspXG5cdFx0XHRcdFx0XHRidWZmZXJbaV0gPSBuZXdEYXRhLmNoYXJDb2RlQXQoaSkgJiAweGZmXG5cblx0XHRcdFx0XHRzZWxmLnB1c2goYnVmZmVyKVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlbGYucHVzaChuZXdEYXRhLCBzZWxmLl9jaGFyc2V0KVxuXHRcdFx0XHR9XG5cdFx0XHRcdHNlbGYuX3BvcyA9IHJlc3BvbnNlLmxlbmd0aFxuXHRcdFx0fVxuXHRcdFx0YnJlYWtcblx0XHRjYXNlICdhcnJheWJ1ZmZlcic6XG5cdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgIT09IHJTdGF0ZXMuRE9ORSB8fCAheGhyLnJlc3BvbnNlKVxuXHRcdFx0XHRicmVha1xuXHRcdFx0cmVzcG9uc2UgPSB4aHIucmVzcG9uc2Vcblx0XHRcdHNlbGYucHVzaChuZXcgQnVmZmVyKG5ldyBVaW50OEFycmF5KHJlc3BvbnNlKSkpXG5cdFx0XHRicmVha1xuXHRcdGNhc2UgJ21vei1jaHVua2VkLWFycmF5YnVmZmVyJzogLy8gdGFrZSB3aG9sZVxuXHRcdFx0cmVzcG9uc2UgPSB4aHIucmVzcG9uc2Vcblx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSAhPT0gclN0YXRlcy5MT0FESU5HIHx8ICFyZXNwb25zZSlcblx0XHRcdFx0YnJlYWtcblx0XHRcdHNlbGYucHVzaChuZXcgQnVmZmVyKG5ldyBVaW50OEFycmF5KHJlc3BvbnNlKSkpXG5cdFx0XHRicmVha1xuXHRcdGNhc2UgJ21zLXN0cmVhbSc6XG5cdFx0XHRyZXNwb25zZSA9IHhoci5yZXNwb25zZVxuXHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlICE9PSByU3RhdGVzLkxPQURJTkcpXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHR2YXIgcmVhZGVyID0gbmV3IGdsb2JhbC5NU1N0cmVhbVJlYWRlcigpXG5cdFx0XHRyZWFkZXIub25wcm9ncmVzcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKHJlYWRlci5yZXN1bHQuYnl0ZUxlbmd0aCA+IHNlbGYuX3Bvcykge1xuXHRcdFx0XHRcdHNlbGYucHVzaChuZXcgQnVmZmVyKG5ldyBVaW50OEFycmF5KHJlYWRlci5yZXN1bHQuc2xpY2Uoc2VsZi5fcG9zKSkpKVxuXHRcdFx0XHRcdHNlbGYuX3BvcyA9IHJlYWRlci5yZXN1bHQuYnl0ZUxlbmd0aFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzZWxmLnB1c2gobnVsbClcblx0XHRcdH1cblx0XHRcdC8vIHJlYWRlci5vbmVycm9yID0gPz8/IC8vIFRPRE86IHRoaXNcblx0XHRcdHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihyZXNwb25zZSlcblx0XHRcdGJyZWFrXG5cdH1cblxuXHQvLyBUaGUgbXMtc3RyZWFtIGNhc2UgaGFuZGxlcyBlbmQgc2VwYXJhdGVseSBpbiByZWFkZXIub25sb2FkKClcblx0aWYgKHNlbGYuX3hoci5yZWFkeVN0YXRlID09PSByU3RhdGVzLkRPTkUgJiYgc2VsZi5fbW9kZSAhPT0gJ21zLXN0cmVhbScpIHtcblx0XHRzZWxmLnB1c2gobnVsbClcblx0fVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==