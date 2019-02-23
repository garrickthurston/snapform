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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGJrZGYyL2xpYi9zeW5jLWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Bia2RmMi9saWIvYXN5bmMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Bia2RmMi9saWIvcHJlY29uZGl0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wYmtkZjIvbGliL2RlZmF1bHQtZW5jb2RpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Bia2RmMi9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLFVBQVUsbUJBQU8sQ0FBQyw2QkFBaUI7QUFDbkMsZ0JBQWdCLG1CQUFPLENBQUMsdUJBQVc7QUFDbkMsVUFBVSxtQkFBTyxDQUFDLG9CQUFROztBQUUxQixzQkFBc0IsbUJBQU8sQ0FBQyw0QkFBZ0I7QUFDOUMsc0JBQXNCLG1CQUFPLENBQUMsZ0NBQW9CO0FBQ2xELGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixlQUFlO0FBQ2hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLFFBQVE7QUFDekI7O0FBRUE7QUFDQTs7QUFFQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0EscUJBQXFCLFVBQVU7QUFDL0I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQ3ZHQSw2RUFBc0IsbUJBQU8sQ0FBQyw0QkFBZ0I7QUFDOUMsc0JBQXNCLG1CQUFPLENBQUMsZ0NBQW9CO0FBQ2xELFdBQVcsbUJBQU8sQ0FBQyxvQkFBUTtBQUMzQixhQUFhLG1CQUFPLENBQUMseUJBQWE7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCLGVBQWU7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7Ozs7QUNuR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsOERBQThEO0FBQzlEO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNUQSxpQkFBaUIsbUJBQU8sQ0FBQyx5QkFBYTtBQUN0QyxxQkFBcUIsbUJBQU8sQ0FBQyx3QkFBWSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLnBia2RmMi43MGM5MWE1ZTFjNjZiYTQzZGQzMC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBtZDUgPSByZXF1aXJlKCdjcmVhdGUtaGFzaC9tZDUnKVxyXG52YXIgUklQRU1EMTYwID0gcmVxdWlyZSgncmlwZW1kMTYwJylcclxudmFyIHNoYSA9IHJlcXVpcmUoJ3NoYS5qcycpXHJcblxyXG52YXIgY2hlY2tQYXJhbWV0ZXJzID0gcmVxdWlyZSgnLi9wcmVjb25kaXRpb24nKVxyXG52YXIgZGVmYXVsdEVuY29kaW5nID0gcmVxdWlyZSgnLi9kZWZhdWx0LWVuY29kaW5nJylcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcbnZhciBaRVJPUyA9IEJ1ZmZlci5hbGxvYygxMjgpXHJcbnZhciBzaXplcyA9IHtcclxuICBtZDU6IDE2LFxyXG4gIHNoYTE6IDIwLFxyXG4gIHNoYTIyNDogMjgsXHJcbiAgc2hhMjU2OiAzMixcclxuICBzaGEzODQ6IDQ4LFxyXG4gIHNoYTUxMjogNjQsXHJcbiAgcm1kMTYwOiAyMCxcclxuICByaXBlbWQxNjA6IDIwXHJcbn1cclxuXHJcbmZ1bmN0aW9uIEhtYWMgKGFsZywga2V5LCBzYWx0TGVuKSB7XHJcbiAgdmFyIGhhc2ggPSBnZXREaWdlc3QoYWxnKVxyXG4gIHZhciBibG9ja3NpemUgPSAoYWxnID09PSAnc2hhNTEyJyB8fCBhbGcgPT09ICdzaGEzODQnKSA/IDEyOCA6IDY0XHJcblxyXG4gIGlmIChrZXkubGVuZ3RoID4gYmxvY2tzaXplKSB7XHJcbiAgICBrZXkgPSBoYXNoKGtleSlcclxuICB9IGVsc2UgaWYgKGtleS5sZW5ndGggPCBibG9ja3NpemUpIHtcclxuICAgIGtleSA9IEJ1ZmZlci5jb25jYXQoW2tleSwgWkVST1NdLCBibG9ja3NpemUpXHJcbiAgfVxyXG5cclxuICB2YXIgaXBhZCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShibG9ja3NpemUgKyBzaXplc1thbGddKVxyXG4gIHZhciBvcGFkID0gQnVmZmVyLmFsbG9jVW5zYWZlKGJsb2Nrc2l6ZSArIHNpemVzW2FsZ10pXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja3NpemU7IGkrKykge1xyXG4gICAgaXBhZFtpXSA9IGtleVtpXSBeIDB4MzZcclxuICAgIG9wYWRbaV0gPSBrZXlbaV0gXiAweDVDXHJcbiAgfVxyXG5cclxuICB2YXIgaXBhZDEgPSBCdWZmZXIuYWxsb2NVbnNhZmUoYmxvY2tzaXplICsgc2FsdExlbiArIDQpXHJcbiAgaXBhZC5jb3B5KGlwYWQxLCAwLCAwLCBibG9ja3NpemUpXHJcbiAgdGhpcy5pcGFkMSA9IGlwYWQxXHJcbiAgdGhpcy5pcGFkMiA9IGlwYWRcclxuICB0aGlzLm9wYWQgPSBvcGFkXHJcbiAgdGhpcy5hbGcgPSBhbGdcclxuICB0aGlzLmJsb2Nrc2l6ZSA9IGJsb2Nrc2l6ZVxyXG4gIHRoaXMuaGFzaCA9IGhhc2hcclxuICB0aGlzLnNpemUgPSBzaXplc1thbGddXHJcbn1cclxuXHJcbkhtYWMucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uIChkYXRhLCBpcGFkKSB7XHJcbiAgZGF0YS5jb3B5KGlwYWQsIHRoaXMuYmxvY2tzaXplKVxyXG4gIHZhciBoID0gdGhpcy5oYXNoKGlwYWQpXHJcbiAgaC5jb3B5KHRoaXMub3BhZCwgdGhpcy5ibG9ja3NpemUpXHJcbiAgcmV0dXJuIHRoaXMuaGFzaCh0aGlzLm9wYWQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERpZ2VzdCAoYWxnKSB7XHJcbiAgZnVuY3Rpb24gc2hhRnVuYyAoZGF0YSkge1xyXG4gICAgcmV0dXJuIHNoYShhbGcpLnVwZGF0ZShkYXRhKS5kaWdlc3QoKVxyXG4gIH1cclxuICBmdW5jdGlvbiBybWQxNjBGdW5jIChkYXRhKSB7XHJcbiAgICByZXR1cm4gbmV3IFJJUEVNRDE2MCgpLnVwZGF0ZShkYXRhKS5kaWdlc3QoKVxyXG4gIH1cclxuXHJcbiAgaWYgKGFsZyA9PT0gJ3JtZDE2MCcgfHwgYWxnID09PSAncmlwZW1kMTYwJykgcmV0dXJuIHJtZDE2MEZ1bmNcclxuICBpZiAoYWxnID09PSAnbWQ1JykgcmV0dXJuIG1kNVxyXG4gIHJldHVybiBzaGFGdW5jXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBia2RmMiAocGFzc3dvcmQsIHNhbHQsIGl0ZXJhdGlvbnMsIGtleWxlbiwgZGlnZXN0KSB7XHJcbiAgY2hlY2tQYXJhbWV0ZXJzKHBhc3N3b3JkLCBzYWx0LCBpdGVyYXRpb25zLCBrZXlsZW4pXHJcblxyXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHBhc3N3b3JkKSkgcGFzc3dvcmQgPSBCdWZmZXIuZnJvbShwYXNzd29yZCwgZGVmYXVsdEVuY29kaW5nKVxyXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHNhbHQpKSBzYWx0ID0gQnVmZmVyLmZyb20oc2FsdCwgZGVmYXVsdEVuY29kaW5nKVxyXG5cclxuICBkaWdlc3QgPSBkaWdlc3QgfHwgJ3NoYTEnXHJcblxyXG4gIHZhciBobWFjID0gbmV3IEhtYWMoZGlnZXN0LCBwYXNzd29yZCwgc2FsdC5sZW5ndGgpXHJcblxyXG4gIHZhciBESyA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShrZXlsZW4pXHJcbiAgdmFyIGJsb2NrMSA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShzYWx0Lmxlbmd0aCArIDQpXHJcbiAgc2FsdC5jb3B5KGJsb2NrMSwgMCwgMCwgc2FsdC5sZW5ndGgpXHJcblxyXG4gIHZhciBkZXN0UG9zID0gMFxyXG4gIHZhciBoTGVuID0gc2l6ZXNbZGlnZXN0XVxyXG4gIHZhciBsID0gTWF0aC5jZWlsKGtleWxlbiAvIGhMZW4pXHJcblxyXG4gIGZvciAodmFyIGkgPSAxOyBpIDw9IGw7IGkrKykge1xyXG4gICAgYmxvY2sxLndyaXRlVUludDMyQkUoaSwgc2FsdC5sZW5ndGgpXHJcblxyXG4gICAgdmFyIFQgPSBobWFjLnJ1bihibG9jazEsIGhtYWMuaXBhZDEpXHJcbiAgICB2YXIgVSA9IFRcclxuXHJcbiAgICBmb3IgKHZhciBqID0gMTsgaiA8IGl0ZXJhdGlvbnM7IGorKykge1xyXG4gICAgICBVID0gaG1hYy5ydW4oVSwgaG1hYy5pcGFkMilcclxuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBoTGVuOyBrKyspIFRba10gXj0gVVtrXVxyXG4gICAgfVxyXG5cclxuICAgIFQuY29weShESywgZGVzdFBvcylcclxuICAgIGRlc3RQb3MgKz0gaExlblxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIERLXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcGJrZGYyXHJcbiIsInZhciBjaGVja1BhcmFtZXRlcnMgPSByZXF1aXJlKCcuL3ByZWNvbmRpdGlvbicpXHJcbnZhciBkZWZhdWx0RW5jb2RpbmcgPSByZXF1aXJlKCcuL2RlZmF1bHQtZW5jb2RpbmcnKVxyXG52YXIgc3luYyA9IHJlcXVpcmUoJy4vc3luYycpXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG5cclxudmFyIFpFUk9fQlVGXHJcbnZhciBzdWJ0bGUgPSBnbG9iYWwuY3J5cHRvICYmIGdsb2JhbC5jcnlwdG8uc3VidGxlXHJcbnZhciB0b0Jyb3dzZXIgPSB7XHJcbiAgJ3NoYSc6ICdTSEEtMScsXHJcbiAgJ3NoYS0xJzogJ1NIQS0xJyxcclxuICAnc2hhMSc6ICdTSEEtMScsXHJcbiAgJ3NoYTI1Nic6ICdTSEEtMjU2JyxcclxuICAnc2hhLTI1Nic6ICdTSEEtMjU2JyxcclxuICAnc2hhMzg0JzogJ1NIQS0zODQnLFxyXG4gICdzaGEtMzg0JzogJ1NIQS0zODQnLFxyXG4gICdzaGEtNTEyJzogJ1NIQS01MTInLFxyXG4gICdzaGE1MTInOiAnU0hBLTUxMidcclxufVxyXG52YXIgY2hlY2tzID0gW11cclxuZnVuY3Rpb24gY2hlY2tOYXRpdmUgKGFsZ28pIHtcclxuICBpZiAoZ2xvYmFsLnByb2Nlc3MgJiYgIWdsb2JhbC5wcm9jZXNzLmJyb3dzZXIpIHtcclxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXHJcbiAgfVxyXG4gIGlmICghc3VidGxlIHx8ICFzdWJ0bGUuaW1wb3J0S2V5IHx8ICFzdWJ0bGUuZGVyaXZlQml0cykge1xyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcclxuICB9XHJcbiAgaWYgKGNoZWNrc1thbGdvXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICByZXR1cm4gY2hlY2tzW2FsZ29dXHJcbiAgfVxyXG4gIFpFUk9fQlVGID0gWkVST19CVUYgfHwgQnVmZmVyLmFsbG9jKDgpXHJcbiAgdmFyIHByb20gPSBicm93c2VyUGJrZGYyKFpFUk9fQlVGLCBaRVJPX0JVRiwgMTAsIDEyOCwgYWxnbylcclxuICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9KVxyXG4gIGNoZWNrc1thbGdvXSA9IHByb21cclxuICByZXR1cm4gcHJvbVxyXG59XHJcblxyXG5mdW5jdGlvbiBicm93c2VyUGJrZGYyIChwYXNzd29yZCwgc2FsdCwgaXRlcmF0aW9ucywgbGVuZ3RoLCBhbGdvKSB7XHJcbiAgcmV0dXJuIHN1YnRsZS5pbXBvcnRLZXkoXHJcbiAgICAncmF3JywgcGFzc3dvcmQsIHtuYW1lOiAnUEJLREYyJ30sIGZhbHNlLCBbJ2Rlcml2ZUJpdHMnXVxyXG4gICkudGhlbihmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICByZXR1cm4gc3VidGxlLmRlcml2ZUJpdHMoe1xyXG4gICAgICBuYW1lOiAnUEJLREYyJyxcclxuICAgICAgc2FsdDogc2FsdCxcclxuICAgICAgaXRlcmF0aW9uczogaXRlcmF0aW9ucyxcclxuICAgICAgaGFzaDoge1xyXG4gICAgICAgIG5hbWU6IGFsZ29cclxuICAgICAgfVxyXG4gICAgfSwga2V5LCBsZW5ndGggPDwgMylcclxuICB9KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgIHJldHVybiBCdWZmZXIuZnJvbShyZXMpXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UgKHByb21pc2UsIGNhbGxiYWNrKSB7XHJcbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChvdXQpIHtcclxuICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCBvdXQpXHJcbiAgICB9KVxyXG4gIH0sIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgY2FsbGJhY2soZSlcclxuICAgIH0pXHJcbiAgfSlcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwYXNzd29yZCwgc2FsdCwgaXRlcmF0aW9ucywga2V5bGVuLCBkaWdlc3QsIGNhbGxiYWNrKSB7XHJcbiAgaWYgKHR5cGVvZiBkaWdlc3QgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGNhbGxiYWNrID0gZGlnZXN0XHJcbiAgICBkaWdlc3QgPSB1bmRlZmluZWRcclxuICB9XHJcblxyXG4gIGRpZ2VzdCA9IGRpZ2VzdCB8fCAnc2hhMSdcclxuICB2YXIgYWxnbyA9IHRvQnJvd3NlcltkaWdlc3QudG9Mb3dlckNhc2UoKV1cclxuXHJcbiAgaWYgKCFhbGdvIHx8IHR5cGVvZiBnbG9iYWwuUHJvbWlzZSAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgb3V0XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgb3V0ID0gc3luYyhwYXNzd29yZCwgc2FsdCwgaXRlcmF0aW9ucywga2V5bGVuLCBkaWdlc3QpXHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gY2FsbGJhY2soZSlcclxuICAgICAgfVxyXG4gICAgICBjYWxsYmFjayhudWxsLCBvdXQpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgY2hlY2tQYXJhbWV0ZXJzKHBhc3N3b3JkLCBzYWx0LCBpdGVyYXRpb25zLCBrZXlsZW4pXHJcbiAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IEVycm9yKCdObyBjYWxsYmFjayBwcm92aWRlZCB0byBwYmtkZjInKVxyXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHBhc3N3b3JkKSkgcGFzc3dvcmQgPSBCdWZmZXIuZnJvbShwYXNzd29yZCwgZGVmYXVsdEVuY29kaW5nKVxyXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHNhbHQpKSBzYWx0ID0gQnVmZmVyLmZyb20oc2FsdCwgZGVmYXVsdEVuY29kaW5nKVxyXG5cclxuICByZXNvbHZlUHJvbWlzZShjaGVja05hdGl2ZShhbGdvKS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICBpZiAocmVzcCkgcmV0dXJuIGJyb3dzZXJQYmtkZjIocGFzc3dvcmQsIHNhbHQsIGl0ZXJhdGlvbnMsIGtleWxlbiwgYWxnbylcclxuXHJcbiAgICByZXR1cm4gc3luYyhwYXNzd29yZCwgc2FsdCwgaXRlcmF0aW9ucywga2V5bGVuLCBkaWdlc3QpXHJcbiAgfSksIGNhbGxiYWNrKVxyXG59XHJcbiIsInZhciBNQVhfQUxMT0MgPSBNYXRoLnBvdygyLCAzMCkgLSAxIC8vIGRlZmF1bHQgaW4gaW9qc1xyXG5cclxuZnVuY3Rpb24gY2hlY2tCdWZmZXIgKGJ1ZiwgbmFtZSkge1xyXG4gIGlmICh0eXBlb2YgYnVmICE9PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IobmFtZSArICcgbXVzdCBiZSBhIGJ1ZmZlciBvciBzdHJpbmcnKVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGFzc3dvcmQsIHNhbHQsIGl0ZXJhdGlvbnMsIGtleWxlbikge1xyXG4gIGNoZWNrQnVmZmVyKHBhc3N3b3JkLCAnUGFzc3dvcmQnKVxyXG4gIGNoZWNrQnVmZmVyKHNhbHQsICdTYWx0JylcclxuXHJcbiAgaWYgKHR5cGVvZiBpdGVyYXRpb25zICE9PSAnbnVtYmVyJykge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSXRlcmF0aW9ucyBub3QgYSBudW1iZXInKVxyXG4gIH1cclxuXHJcbiAgaWYgKGl0ZXJhdGlvbnMgPCAwKSB7XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCYWQgaXRlcmF0aW9ucycpXHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIGtleWxlbiAhPT0gJ251bWJlcicpIHtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0tleSBsZW5ndGggbm90IGEgbnVtYmVyJylcclxuICB9XHJcblxyXG4gIGlmIChrZXlsZW4gPCAwIHx8IGtleWxlbiA+IE1BWF9BTExPQyB8fCBrZXlsZW4gIT09IGtleWxlbikgeyAvKiBlc2xpbnQgbm8tc2VsZi1jb21wYXJlOiAwICovXHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCYWQga2V5IGxlbmd0aCcpXHJcbiAgfVxyXG59XHJcbiIsInZhciBkZWZhdWx0RW5jb2RpbmdcclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuaWYgKHByb2Nlc3MuYnJvd3Nlcikge1xyXG4gIGRlZmF1bHRFbmNvZGluZyA9ICd1dGYtOCdcclxufSBlbHNlIHtcclxuICB2YXIgcFZlcnNpb25NYWpvciA9IHBhcnNlSW50KHByb2Nlc3MudmVyc2lvbi5zcGxpdCgnLicpWzBdLnNsaWNlKDEpLCAxMClcclxuXHJcbiAgZGVmYXVsdEVuY29kaW5nID0gcFZlcnNpb25NYWpvciA+PSA2ID8gJ3V0Zi04JyA6ICdiaW5hcnknXHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0RW5jb2RpbmdcclxuIiwiZXhwb3J0cy5wYmtkZjIgPSByZXF1aXJlKCcuL2xpYi9hc3luYycpXHJcbmV4cG9ydHMucGJrZGYyU3luYyA9IHJlcXVpcmUoJy4vbGliL3N5bmMnKVxyXG4iXSwic291cmNlUm9vdCI6IiJ9