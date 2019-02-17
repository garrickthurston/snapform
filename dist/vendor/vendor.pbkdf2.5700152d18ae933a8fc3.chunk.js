(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.pbkdf2"],{

/***/ "4Hv8":
/*!*************************************************!*\
  !*** ./node_modules/pbkdf2/lib/sync-browser.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var md5 = __webpack_require__(/*! create-hash/md5 */ "WnY+")
var RIPEMD160 = __webpack_require__(/*! ripemd160 */ "tcrS")
var sha = __webpack_require__(/*! sha.js */ "afKu")

var checkParameters = __webpack_require__(/*! ./precondition */ "fSpj")
var defaultEncoding = __webpack_require__(/*! ./default-encoding */ "n53Y")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
var ZEROS = Buffer.alloc(128)
var sizes = {
  md5: 16,
  sha1: 20,
  sha224: 28,
  sha256: 32,
  sha384: 48,
  sha512: 64,
  rmd160: 20,
  ripemd160: 20
}

function Hmac (alg, key, saltLen) {
  var hash = getDigest(alg)
  var blocksize = (alg === 'sha512' || alg === 'sha384') ? 128 : 64

  if (key.length > blocksize) {
    key = hash(key)
  } else if (key.length < blocksize) {
    key = Buffer.concat([key, ZEROS], blocksize)
  }

  var ipad = Buffer.allocUnsafe(blocksize + sizes[alg])
  var opad = Buffer.allocUnsafe(blocksize + sizes[alg])
  for (var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  var ipad1 = Buffer.allocUnsafe(blocksize + saltLen + 4)
  ipad.copy(ipad1, 0, 0, blocksize)
  this.ipad1 = ipad1
  this.ipad2 = ipad
  this.opad = opad
  this.alg = alg
  this.blocksize = blocksize
  this.hash = hash
  this.size = sizes[alg]
}

Hmac.prototype.run = function (data, ipad) {
  data.copy(ipad, this.blocksize)
  var h = this.hash(ipad)
  h.copy(this.opad, this.blocksize)
  return this.hash(this.opad)
}

function getDigest (alg) {
  function shaFunc (data) {
    return sha(alg).update(data).digest()
  }
  function rmd160Func (data) {
    return new RIPEMD160().update(data).digest()
  }

  if (alg === 'rmd160' || alg === 'ripemd160') return rmd160Func
  if (alg === 'md5') return md5
  return shaFunc
}

function pbkdf2 (password, salt, iterations, keylen, digest) {
  checkParameters(password, salt, iterations, keylen)

  if (!Buffer.isBuffer(password)) password = Buffer.from(password, defaultEncoding)
  if (!Buffer.isBuffer(salt)) salt = Buffer.from(salt, defaultEncoding)

  digest = digest || 'sha1'

  var hmac = new Hmac(digest, password, salt.length)

  var DK = Buffer.allocUnsafe(keylen)
  var block1 = Buffer.allocUnsafe(salt.length + 4)
  salt.copy(block1, 0, 0, salt.length)

  var destPos = 0
  var hLen = sizes[digest]
  var l = Math.ceil(keylen / hLen)

  for (var i = 1; i <= l; i++) {
    block1.writeUInt32BE(i, salt.length)

    var T = hmac.run(block1, hmac.ipad1)
    var U = T

    for (var j = 1; j < iterations; j++) {
      U = hmac.run(U, hmac.ipad2)
      for (var k = 0; k < hLen; k++) T[k] ^= U[k]
    }

    T.copy(DK, destPos)
    destPos += hLen
  }

  return DK
}

module.exports = pbkdf2


/***/ }),

/***/ "IG1u":
/*!******************************************!*\
  !*** ./node_modules/pbkdf2/lib/async.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {var checkParameters = __webpack_require__(/*! ./precondition */ "fSpj")
var defaultEncoding = __webpack_require__(/*! ./default-encoding */ "n53Y")
var sync = __webpack_require__(/*! ./sync */ "4Hv8")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

var ZERO_BUF
var subtle = global.crypto && global.crypto.subtle
var toBrowser = {
  'sha': 'SHA-1',
  'sha-1': 'SHA-1',
  'sha1': 'SHA-1',
  'sha256': 'SHA-256',
  'sha-256': 'SHA-256',
  'sha384': 'SHA-384',
  'sha-384': 'SHA-384',
  'sha-512': 'SHA-512',
  'sha512': 'SHA-512'
}
var checks = []
function checkNative (algo) {
  if (global.process && !global.process.browser) {
    return Promise.resolve(false)
  }
  if (!subtle || !subtle.importKey || !subtle.deriveBits) {
    return Promise.resolve(false)
  }
  if (checks[algo] !== undefined) {
    return checks[algo]
  }
  ZERO_BUF = ZERO_BUF || Buffer.alloc(8)
  var prom = browserPbkdf2(ZERO_BUF, ZERO_BUF, 10, 128, algo)
    .then(function () {
      return true
    }).catch(function () {
      return false
    })
  checks[algo] = prom
  return prom
}

function browserPbkdf2 (password, salt, iterations, length, algo) {
  return subtle.importKey(
    'raw', password, {name: 'PBKDF2'}, false, ['deriveBits']
  ).then(function (key) {
    return subtle.deriveBits({
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: {
        name: algo
      }
    }, key, length << 3)
  }).then(function (res) {
    return Buffer.from(res)
  })
}

function resolvePromise (promise, callback) {
  promise.then(function (out) {
    process.nextTick(function () {
      callback(null, out)
    })
  }, function (e) {
    process.nextTick(function () {
      callback(e)
    })
  })
}
module.exports = function (password, salt, iterations, keylen, digest, callback) {
  if (typeof digest === 'function') {
    callback = digest
    digest = undefined
  }

  digest = digest || 'sha1'
  var algo = toBrowser[digest.toLowerCase()]

  if (!algo || typeof global.Promise !== 'function') {
    return process.nextTick(function () {
      var out
      try {
        out = sync(password, salt, iterations, keylen, digest)
      } catch (e) {
        return callback(e)
      }
      callback(null, out)
    })
  }

  checkParameters(password, salt, iterations, keylen)
  if (typeof callback !== 'function') throw new Error('No callback provided to pbkdf2')
  if (!Buffer.isBuffer(password)) password = Buffer.from(password, defaultEncoding)
  if (!Buffer.isBuffer(salt)) salt = Buffer.from(salt, defaultEncoding)

  resolvePromise(checkNative(algo).then(function (resp) {
    if (resp) return browserPbkdf2(password, salt, iterations, keylen, algo)

    return sync(password, salt, iterations, keylen, digest)
  }), callback)
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "yLpj"), __webpack_require__(/*! ./../../process/browser.js */ "8oxB")))

/***/ }),

/***/ "fSpj":
/*!*************************************************!*\
  !*** ./node_modules/pbkdf2/lib/precondition.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var MAX_ALLOC = Math.pow(2, 30) - 1 // default in iojs

function checkBuffer (buf, name) {
  if (typeof buf !== 'string' && !Buffer.isBuffer(buf)) {
    throw new TypeError(name + ' must be a buffer or string')
  }
}

module.exports = function (password, salt, iterations, keylen) {
  checkBuffer(password, 'Password')
  checkBuffer(salt, 'Salt')

  if (typeof iterations !== 'number') {
    throw new TypeError('Iterations not a number')
  }

  if (iterations < 0) {
    throw new TypeError('Bad iterations')
  }

  if (typeof keylen !== 'number') {
    throw new TypeError('Key length not a number')
  }

  if (keylen < 0 || keylen > MAX_ALLOC || keylen !== keylen) { /* eslint no-self-compare: 0 */
    throw new TypeError('Bad key length')
  }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "tjlA").Buffer))

/***/ }),

/***/ "n53Y":
/*!*****************************************************!*\
  !*** ./node_modules/pbkdf2/lib/default-encoding.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var defaultEncoding
/* istanbul ignore next */
if (process.browser) {
  defaultEncoding = 'utf-8'
} else {
  var pVersionMajor = parseInt(process.version.split('.')[0].slice(1), 10)

  defaultEncoding = pVersionMajor >= 6 ? 'utf-8' : 'binary'
}
module.exports = defaultEncoding

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "8oxB")))

/***/ }),

/***/ "oJl4":
/*!****************************************!*\
  !*** ./node_modules/pbkdf2/browser.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.pbkdf2 = __webpack_require__(/*! ./lib/async */ "IG1u")
exports.pbkdf2Sync = __webpack_require__(/*! ./lib/sync */ "4Hv8")


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGJrZGYyL2xpYi9zeW5jLWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Bia2RmMi9saWIvYXN5bmMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Bia2RmMi9saWIvcHJlY29uZGl0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wYmtkZjIvbGliL2RlZmF1bHQtZW5jb2RpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Bia2RmMi9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLFVBQVUsbUJBQU8sQ0FBQyw2QkFBaUI7QUFDbkMsZ0JBQWdCLG1CQUFPLENBQUMsdUJBQVc7QUFDbkMsVUFBVSxtQkFBTyxDQUFDLG9CQUFROztBQUUxQixzQkFBc0IsbUJBQU8sQ0FBQyw0QkFBZ0I7QUFDOUMsc0JBQXNCLG1CQUFPLENBQUMsZ0NBQW9CO0FBQ2xELGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixlQUFlO0FBQ2hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLFFBQVE7QUFDekI7O0FBRUE7QUFDQTs7QUFFQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0EscUJBQXFCLFVBQVU7QUFDL0I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQ3ZHQSw2RUFBc0IsbUJBQU8sQ0FBQyw0QkFBZ0I7QUFDOUMsc0JBQXNCLG1CQUFPLENBQUMsZ0NBQW9CO0FBQ2xELFdBQVcsbUJBQU8sQ0FBQyxvQkFBUTtBQUMzQixhQUFhLG1CQUFPLENBQUMseUJBQWE7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCLGVBQWU7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7Ozs7QUNuR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsOERBQThEO0FBQzlEO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNUQSxpQkFBaUIsbUJBQU8sQ0FBQyx5QkFBYTtBQUN0QyxxQkFBcUIsbUJBQU8sQ0FBQyx3QkFBWSIsImZpbGUiOiJ2ZW5kb3IvdmVuZG9yLnBia2RmMi41NzAwMTUyZDE4YWU5MzNhOGZjMy5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBtZDUgPSByZXF1aXJlKCdjcmVhdGUtaGFzaC9tZDUnKVxudmFyIFJJUEVNRDE2MCA9IHJlcXVpcmUoJ3JpcGVtZDE2MCcpXG52YXIgc2hhID0gcmVxdWlyZSgnc2hhLmpzJylcblxudmFyIGNoZWNrUGFyYW1ldGVycyA9IHJlcXVpcmUoJy4vcHJlY29uZGl0aW9uJylcbnZhciBkZWZhdWx0RW5jb2RpbmcgPSByZXF1aXJlKCcuL2RlZmF1bHQtZW5jb2RpbmcnKVxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG52YXIgWkVST1MgPSBCdWZmZXIuYWxsb2MoMTI4KVxudmFyIHNpemVzID0ge1xuICBtZDU6IDE2LFxuICBzaGExOiAyMCxcbiAgc2hhMjI0OiAyOCxcbiAgc2hhMjU2OiAzMixcbiAgc2hhMzg0OiA0OCxcbiAgc2hhNTEyOiA2NCxcbiAgcm1kMTYwOiAyMCxcbiAgcmlwZW1kMTYwOiAyMFxufVxuXG5mdW5jdGlvbiBIbWFjIChhbGcsIGtleSwgc2FsdExlbikge1xuICB2YXIgaGFzaCA9IGdldERpZ2VzdChhbGcpXG4gIHZhciBibG9ja3NpemUgPSAoYWxnID09PSAnc2hhNTEyJyB8fCBhbGcgPT09ICdzaGEzODQnKSA/IDEyOCA6IDY0XG5cbiAgaWYgKGtleS5sZW5ndGggPiBibG9ja3NpemUpIHtcbiAgICBrZXkgPSBoYXNoKGtleSlcbiAgfSBlbHNlIGlmIChrZXkubGVuZ3RoIDwgYmxvY2tzaXplKSB7XG4gICAga2V5ID0gQnVmZmVyLmNvbmNhdChba2V5LCBaRVJPU10sIGJsb2Nrc2l6ZSlcbiAgfVxuXG4gIHZhciBpcGFkID0gQnVmZmVyLmFsbG9jVW5zYWZlKGJsb2Nrc2l6ZSArIHNpemVzW2FsZ10pXG4gIHZhciBvcGFkID0gQnVmZmVyLmFsbG9jVW5zYWZlKGJsb2Nrc2l6ZSArIHNpemVzW2FsZ10pXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tzaXplOyBpKyspIHtcbiAgICBpcGFkW2ldID0ga2V5W2ldIF4gMHgzNlxuICAgIG9wYWRbaV0gPSBrZXlbaV0gXiAweDVDXG4gIH1cblxuICB2YXIgaXBhZDEgPSBCdWZmZXIuYWxsb2NVbnNhZmUoYmxvY2tzaXplICsgc2FsdExlbiArIDQpXG4gIGlwYWQuY29weShpcGFkMSwgMCwgMCwgYmxvY2tzaXplKVxuICB0aGlzLmlwYWQxID0gaXBhZDFcbiAgdGhpcy5pcGFkMiA9IGlwYWRcbiAgdGhpcy5vcGFkID0gb3BhZFxuICB0aGlzLmFsZyA9IGFsZ1xuICB0aGlzLmJsb2Nrc2l6ZSA9IGJsb2Nrc2l6ZVxuICB0aGlzLmhhc2ggPSBoYXNoXG4gIHRoaXMuc2l6ZSA9IHNpemVzW2FsZ11cbn1cblxuSG1hYy5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKGRhdGEsIGlwYWQpIHtcbiAgZGF0YS5jb3B5KGlwYWQsIHRoaXMuYmxvY2tzaXplKVxuICB2YXIgaCA9IHRoaXMuaGFzaChpcGFkKVxuICBoLmNvcHkodGhpcy5vcGFkLCB0aGlzLmJsb2Nrc2l6ZSlcbiAgcmV0dXJuIHRoaXMuaGFzaCh0aGlzLm9wYWQpXG59XG5cbmZ1bmN0aW9uIGdldERpZ2VzdCAoYWxnKSB7XG4gIGZ1bmN0aW9uIHNoYUZ1bmMgKGRhdGEpIHtcbiAgICByZXR1cm4gc2hhKGFsZykudXBkYXRlKGRhdGEpLmRpZ2VzdCgpXG4gIH1cbiAgZnVuY3Rpb24gcm1kMTYwRnVuYyAoZGF0YSkge1xuICAgIHJldHVybiBuZXcgUklQRU1EMTYwKCkudXBkYXRlKGRhdGEpLmRpZ2VzdCgpXG4gIH1cblxuICBpZiAoYWxnID09PSAncm1kMTYwJyB8fCBhbGcgPT09ICdyaXBlbWQxNjAnKSByZXR1cm4gcm1kMTYwRnVuY1xuICBpZiAoYWxnID09PSAnbWQ1JykgcmV0dXJuIG1kNVxuICByZXR1cm4gc2hhRnVuY1xufVxuXG5mdW5jdGlvbiBwYmtkZjIgKHBhc3N3b3JkLCBzYWx0LCBpdGVyYXRpb25zLCBrZXlsZW4sIGRpZ2VzdCkge1xuICBjaGVja1BhcmFtZXRlcnMocGFzc3dvcmQsIHNhbHQsIGl0ZXJhdGlvbnMsIGtleWxlbilcblxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihwYXNzd29yZCkpIHBhc3N3b3JkID0gQnVmZmVyLmZyb20ocGFzc3dvcmQsIGRlZmF1bHRFbmNvZGluZylcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoc2FsdCkpIHNhbHQgPSBCdWZmZXIuZnJvbShzYWx0LCBkZWZhdWx0RW5jb2RpbmcpXG5cbiAgZGlnZXN0ID0gZGlnZXN0IHx8ICdzaGExJ1xuXG4gIHZhciBobWFjID0gbmV3IEhtYWMoZGlnZXN0LCBwYXNzd29yZCwgc2FsdC5sZW5ndGgpXG5cbiAgdmFyIERLID0gQnVmZmVyLmFsbG9jVW5zYWZlKGtleWxlbilcbiAgdmFyIGJsb2NrMSA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShzYWx0Lmxlbmd0aCArIDQpXG4gIHNhbHQuY29weShibG9jazEsIDAsIDAsIHNhbHQubGVuZ3RoKVxuXG4gIHZhciBkZXN0UG9zID0gMFxuICB2YXIgaExlbiA9IHNpemVzW2RpZ2VzdF1cbiAgdmFyIGwgPSBNYXRoLmNlaWwoa2V5bGVuIC8gaExlbilcblxuICBmb3IgKHZhciBpID0gMTsgaSA8PSBsOyBpKyspIHtcbiAgICBibG9jazEud3JpdGVVSW50MzJCRShpLCBzYWx0Lmxlbmd0aClcblxuICAgIHZhciBUID0gaG1hYy5ydW4oYmxvY2sxLCBobWFjLmlwYWQxKVxuICAgIHZhciBVID0gVFxuXG4gICAgZm9yICh2YXIgaiA9IDE7IGogPCBpdGVyYXRpb25zOyBqKyspIHtcbiAgICAgIFUgPSBobWFjLnJ1bihVLCBobWFjLmlwYWQyKVxuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBoTGVuOyBrKyspIFRba10gXj0gVVtrXVxuICAgIH1cblxuICAgIFQuY29weShESywgZGVzdFBvcylcbiAgICBkZXN0UG9zICs9IGhMZW5cbiAgfVxuXG4gIHJldHVybiBES1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBia2RmMlxuIiwidmFyIGNoZWNrUGFyYW1ldGVycyA9IHJlcXVpcmUoJy4vcHJlY29uZGl0aW9uJylcbnZhciBkZWZhdWx0RW5jb2RpbmcgPSByZXF1aXJlKCcuL2RlZmF1bHQtZW5jb2RpbmcnKVxudmFyIHN5bmMgPSByZXF1aXJlKCcuL3N5bmMnKVxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG5cbnZhciBaRVJPX0JVRlxudmFyIHN1YnRsZSA9IGdsb2JhbC5jcnlwdG8gJiYgZ2xvYmFsLmNyeXB0by5zdWJ0bGVcbnZhciB0b0Jyb3dzZXIgPSB7XG4gICdzaGEnOiAnU0hBLTEnLFxuICAnc2hhLTEnOiAnU0hBLTEnLFxuICAnc2hhMSc6ICdTSEEtMScsXG4gICdzaGEyNTYnOiAnU0hBLTI1NicsXG4gICdzaGEtMjU2JzogJ1NIQS0yNTYnLFxuICAnc2hhMzg0JzogJ1NIQS0zODQnLFxuICAnc2hhLTM4NCc6ICdTSEEtMzg0JyxcbiAgJ3NoYS01MTInOiAnU0hBLTUxMicsXG4gICdzaGE1MTInOiAnU0hBLTUxMidcbn1cbnZhciBjaGVja3MgPSBbXVxuZnVuY3Rpb24gY2hlY2tOYXRpdmUgKGFsZ28pIHtcbiAgaWYgKGdsb2JhbC5wcm9jZXNzICYmICFnbG9iYWwucHJvY2Vzcy5icm93c2VyKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgfVxuICBpZiAoIXN1YnRsZSB8fCAhc3VidGxlLmltcG9ydEtleSB8fCAhc3VidGxlLmRlcml2ZUJpdHMpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICB9XG4gIGlmIChjaGVja3NbYWxnb10gIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBjaGVja3NbYWxnb11cbiAgfVxuICBaRVJPX0JVRiA9IFpFUk9fQlVGIHx8IEJ1ZmZlci5hbGxvYyg4KVxuICB2YXIgcHJvbSA9IGJyb3dzZXJQYmtkZjIoWkVST19CVUYsIFpFUk9fQlVGLCAxMCwgMTI4LCBhbGdvKVxuICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSlcbiAgY2hlY2tzW2FsZ29dID0gcHJvbVxuICByZXR1cm4gcHJvbVxufVxuXG5mdW5jdGlvbiBicm93c2VyUGJrZGYyIChwYXNzd29yZCwgc2FsdCwgaXRlcmF0aW9ucywgbGVuZ3RoLCBhbGdvKSB7XG4gIHJldHVybiBzdWJ0bGUuaW1wb3J0S2V5KFxuICAgICdyYXcnLCBwYXNzd29yZCwge25hbWU6ICdQQktERjInfSwgZmFsc2UsIFsnZGVyaXZlQml0cyddXG4gICkudGhlbihmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHN1YnRsZS5kZXJpdmVCaXRzKHtcbiAgICAgIG5hbWU6ICdQQktERjInLFxuICAgICAgc2FsdDogc2FsdCxcbiAgICAgIGl0ZXJhdGlvbnM6IGl0ZXJhdGlvbnMsXG4gICAgICBoYXNoOiB7XG4gICAgICAgIG5hbWU6IGFsZ29cbiAgICAgIH1cbiAgICB9LCBrZXksIGxlbmd0aCA8PCAzKVxuICB9KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20ocmVzKVxuICB9KVxufVxuXG5mdW5jdGlvbiByZXNvbHZlUHJvbWlzZSAocHJvbWlzZSwgY2FsbGJhY2spIHtcbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChvdXQpIHtcbiAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNhbGxiYWNrKG51bGwsIG91dClcbiAgICB9KVxuICB9LCBmdW5jdGlvbiAoZSkge1xuICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgY2FsbGJhY2soZSlcbiAgICB9KVxuICB9KVxufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGFzc3dvcmQsIHNhbHQsIGl0ZXJhdGlvbnMsIGtleWxlbiwgZGlnZXN0LCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIGRpZ2VzdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gZGlnZXN0XG4gICAgZGlnZXN0ID0gdW5kZWZpbmVkXG4gIH1cblxuICBkaWdlc3QgPSBkaWdlc3QgfHwgJ3NoYTEnXG4gIHZhciBhbGdvID0gdG9Ccm93c2VyW2RpZ2VzdC50b0xvd2VyQ2FzZSgpXVxuXG4gIGlmICghYWxnbyB8fCB0eXBlb2YgZ2xvYmFsLlByb21pc2UgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb3V0XG4gICAgICB0cnkge1xuICAgICAgICBvdXQgPSBzeW5jKHBhc3N3b3JkLCBzYWx0LCBpdGVyYXRpb25zLCBrZXlsZW4sIGRpZ2VzdClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGUpXG4gICAgICB9XG4gICAgICBjYWxsYmFjayhudWxsLCBvdXQpXG4gICAgfSlcbiAgfVxuXG4gIGNoZWNrUGFyYW1ldGVycyhwYXNzd29yZCwgc2FsdCwgaXRlcmF0aW9ucywga2V5bGVuKVxuICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgRXJyb3IoJ05vIGNhbGxiYWNrIHByb3ZpZGVkIHRvIHBia2RmMicpXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHBhc3N3b3JkKSkgcGFzc3dvcmQgPSBCdWZmZXIuZnJvbShwYXNzd29yZCwgZGVmYXVsdEVuY29kaW5nKVxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihzYWx0KSkgc2FsdCA9IEJ1ZmZlci5mcm9tKHNhbHQsIGRlZmF1bHRFbmNvZGluZylcblxuICByZXNvbHZlUHJvbWlzZShjaGVja05hdGl2ZShhbGdvKS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgaWYgKHJlc3ApIHJldHVybiBicm93c2VyUGJrZGYyKHBhc3N3b3JkLCBzYWx0LCBpdGVyYXRpb25zLCBrZXlsZW4sIGFsZ28pXG5cbiAgICByZXR1cm4gc3luYyhwYXNzd29yZCwgc2FsdCwgaXRlcmF0aW9ucywga2V5bGVuLCBkaWdlc3QpXG4gIH0pLCBjYWxsYmFjaylcbn1cbiIsInZhciBNQVhfQUxMT0MgPSBNYXRoLnBvdygyLCAzMCkgLSAxIC8vIGRlZmF1bHQgaW4gaW9qc1xuXG5mdW5jdGlvbiBjaGVja0J1ZmZlciAoYnVmLCBuYW1lKSB7XG4gIGlmICh0eXBlb2YgYnVmICE9PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKG5hbWUgKyAnIG11c3QgYmUgYSBidWZmZXIgb3Igc3RyaW5nJylcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwYXNzd29yZCwgc2FsdCwgaXRlcmF0aW9ucywga2V5bGVuKSB7XG4gIGNoZWNrQnVmZmVyKHBhc3N3b3JkLCAnUGFzc3dvcmQnKVxuICBjaGVja0J1ZmZlcihzYWx0LCAnU2FsdCcpXG5cbiAgaWYgKHR5cGVvZiBpdGVyYXRpb25zICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0l0ZXJhdGlvbnMgbm90IGEgbnVtYmVyJylcbiAgfVxuXG4gIGlmIChpdGVyYXRpb25zIDwgMCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JhZCBpdGVyYXRpb25zJylcbiAgfVxuXG4gIGlmICh0eXBlb2Yga2V5bGVuICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0tleSBsZW5ndGggbm90IGEgbnVtYmVyJylcbiAgfVxuXG4gIGlmIChrZXlsZW4gPCAwIHx8IGtleWxlbiA+IE1BWF9BTExPQyB8fCBrZXlsZW4gIT09IGtleWxlbikgeyAvKiBlc2xpbnQgbm8tc2VsZi1jb21wYXJlOiAwICovXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQmFkIGtleSBsZW5ndGgnKVxuICB9XG59XG4iLCJ2YXIgZGVmYXVsdEVuY29kaW5nXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKHByb2Nlc3MuYnJvd3Nlcikge1xuICBkZWZhdWx0RW5jb2RpbmcgPSAndXRmLTgnXG59IGVsc2Uge1xuICB2YXIgcFZlcnNpb25NYWpvciA9IHBhcnNlSW50KHByb2Nlc3MudmVyc2lvbi5zcGxpdCgnLicpWzBdLnNsaWNlKDEpLCAxMClcblxuICBkZWZhdWx0RW5jb2RpbmcgPSBwVmVyc2lvbk1ham9yID49IDYgPyAndXRmLTgnIDogJ2JpbmFyeSdcbn1cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdEVuY29kaW5nXG4iLCJleHBvcnRzLnBia2RmMiA9IHJlcXVpcmUoJy4vbGliL2FzeW5jJylcbmV4cG9ydHMucGJrZGYyU3luYyA9IHJlcXVpcmUoJy4vbGliL3N5bmMnKVxuIl0sInNvdXJjZVJvb3QiOiIifQ==