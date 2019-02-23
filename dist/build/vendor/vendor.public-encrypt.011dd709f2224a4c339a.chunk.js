(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.public-encrypt"],{

/***/ "9GDS":
/*!********************************************!*\
  !*** ./node_modules/public-encrypt/mgf.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var createHash = __webpack_require__(/*! create-hash */ "mObS")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

module.exports = function (seed, len) {
  var t = Buffer.alloc(0)
  var i = 0
  var c
  while (t.length < len) {
    c = i2ops(i++)
    t = Buffer.concat([t, createHash('sha1').update(seed).update(c).digest()])
  }
  return t.slice(0, len)
}

function i2ops (c) {
  var out = Buffer.allocUnsafe(4)
  out.writeUInt32BE(c, 0)
  return out
}


/***/ }),

/***/ "DyzK":
/*!*******************************************************!*\
  !*** ./node_modules/public-encrypt/privateDecrypt.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var parseKeys = __webpack_require__(/*! parse-asn1 */ "Ku4m")
var mgf = __webpack_require__(/*! ./mgf */ "9GDS")
var xor = __webpack_require__(/*! ./xor */ "g9U9")
var BN = __webpack_require__(/*! bn.js */ "OZ/i")
var crt = __webpack_require__(/*! browserify-rsa */ "qVij")
var createHash = __webpack_require__(/*! create-hash */ "mObS")
var withPublic = __webpack_require__(/*! ./withPublic */ "UpF+")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

module.exports = function privateDecrypt (privateKey, enc, reverse) {
  var padding
  if (privateKey.padding) {
    padding = privateKey.padding
  } else if (reverse) {
    padding = 1
  } else {
    padding = 4
  }

  var key = parseKeys(privateKey)
  var k = key.modulus.byteLength()
  if (enc.length > k || new BN(enc).cmp(key.modulus) >= 0) {
    throw new Error('decryption error')
  }
  var msg
  if (reverse) {
    msg = withPublic(new BN(enc), key)
  } else {
    msg = crt(enc, key)
  }
  var zBuffer = Buffer.alloc(k - msg.length)
  msg = Buffer.concat([zBuffer, msg], k)
  if (padding === 4) {
    return oaep(key, msg)
  } else if (padding === 1) {
    return pkcs1(key, msg, reverse)
  } else if (padding === 3) {
    return msg
  } else {
    throw new Error('unknown padding')
  }
}

function oaep (key, msg) {
  var k = key.modulus.byteLength()
  var iHash = createHash('sha1').update(Buffer.alloc(0)).digest()
  var hLen = iHash.length
  if (msg[0] !== 0) {
    throw new Error('decryption error')
  }
  var maskedSeed = msg.slice(1, hLen + 1)
  var maskedDb = msg.slice(hLen + 1)
  var seed = xor(maskedSeed, mgf(maskedDb, hLen))
  var db = xor(maskedDb, mgf(seed, k - hLen - 1))
  if (compare(iHash, db.slice(0, hLen))) {
    throw new Error('decryption error')
  }
  var i = hLen
  while (db[i] === 0) {
    i++
  }
  if (db[i++] !== 1) {
    throw new Error('decryption error')
  }
  return db.slice(i)
}

function pkcs1 (key, msg, reverse) {
  var p1 = msg.slice(0, 2)
  var i = 2
  var status = 0
  while (msg[i++] !== 0) {
    if (i >= msg.length) {
      status++
      break
    }
  }
  var ps = msg.slice(2, i - 1)

  if ((p1.toString('hex') !== '0002' && !reverse) || (p1.toString('hex') !== '0001' && reverse)) {
    status++
  }
  if (ps.length < 8) {
    status++
  }
  if (status) {
    throw new Error('decryption error')
  }
  return msg.slice(i)
}
function compare (a, b) {
  a = Buffer.from(a)
  b = Buffer.from(b)
  var dif = 0
  var len = a.length
  if (a.length !== b.length) {
    dif++
    len = Math.min(a.length, b.length)
  }
  var i = -1
  while (++i < len) {
    dif += (a[i] ^ b[i])
  }
  return dif
}


/***/ }),

/***/ "UpF+":
/*!***************************************************!*\
  !*** ./node_modules/public-encrypt/withPublic.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var BN = __webpack_require__(/*! bn.js */ "OZ/i")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

function withPublic (paddedMsg, key) {
  return Buffer.from(paddedMsg
    .toRed(BN.mont(key.modulus))
    .redPow(new BN(key.publicExponent))
    .fromRed()
    .toArray())
}

module.exports = withPublic


/***/ }),

/***/ "ZEK9":
/*!************************************************!*\
  !*** ./node_modules/public-encrypt/browser.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.publicEncrypt = __webpack_require__(/*! ./publicEncrypt */ "rSVQ")
exports.privateDecrypt = __webpack_require__(/*! ./privateDecrypt */ "DyzK")

exports.privateEncrypt = function privateEncrypt (key, buf) {
  return exports.publicEncrypt(key, buf, true)
}

exports.publicDecrypt = function publicDecrypt (key, buf) {
  return exports.privateDecrypt(key, buf, true)
}


/***/ }),

/***/ "g9U9":
/*!********************************************!*\
  !*** ./node_modules/public-encrypt/xor.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function xor (a, b) {
  var len = a.length
  var i = -1
  while (++i < len) {
    a[i] ^= b[i]
  }
  return a
}


/***/ }),

/***/ "rSVQ":
/*!******************************************************!*\
  !*** ./node_modules/public-encrypt/publicEncrypt.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var parseKeys = __webpack_require__(/*! parse-asn1 */ "Ku4m")
var randomBytes = __webpack_require__(/*! randombytes */ "Edxu")
var createHash = __webpack_require__(/*! create-hash */ "mObS")
var mgf = __webpack_require__(/*! ./mgf */ "9GDS")
var xor = __webpack_require__(/*! ./xor */ "g9U9")
var BN = __webpack_require__(/*! bn.js */ "OZ/i")
var withPublic = __webpack_require__(/*! ./withPublic */ "UpF+")
var crt = __webpack_require__(/*! browserify-rsa */ "qVij")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

module.exports = function publicEncrypt (publicKey, msg, reverse) {
  var padding
  if (publicKey.padding) {
    padding = publicKey.padding
  } else if (reverse) {
    padding = 1
  } else {
    padding = 4
  }
  var key = parseKeys(publicKey)
  var paddedMsg
  if (padding === 4) {
    paddedMsg = oaep(key, msg)
  } else if (padding === 1) {
    paddedMsg = pkcs1(key, msg, reverse)
  } else if (padding === 3) {
    paddedMsg = new BN(msg)
    if (paddedMsg.cmp(key.modulus) >= 0) {
      throw new Error('data too long for modulus')
    }
  } else {
    throw new Error('unknown padding')
  }
  if (reverse) {
    return crt(paddedMsg, key)
  } else {
    return withPublic(paddedMsg, key)
  }
}

function oaep (key, msg) {
  var k = key.modulus.byteLength()
  var mLen = msg.length
  var iHash = createHash('sha1').update(Buffer.alloc(0)).digest()
  var hLen = iHash.length
  var hLen2 = 2 * hLen
  if (mLen > k - hLen2 - 2) {
    throw new Error('message too long')
  }
  var ps = Buffer.alloc(k - mLen - hLen2 - 2)
  var dblen = k - hLen - 1
  var seed = randomBytes(hLen)
  var maskedDb = xor(Buffer.concat([iHash, ps, Buffer.alloc(1, 1), msg], dblen), mgf(seed, dblen))
  var maskedSeed = xor(seed, mgf(maskedDb, hLen))
  return new BN(Buffer.concat([Buffer.alloc(1), maskedSeed, maskedDb], k))
}
function pkcs1 (key, msg, reverse) {
  var mLen = msg.length
  var k = key.modulus.byteLength()
  if (mLen > k - 11) {
    throw new Error('message too long')
  }
  var ps
  if (reverse) {
    ps = Buffer.alloc(k - mLen - 3, 0xff)
  } else {
    ps = nonZero(k - mLen - 3)
  }
  return new BN(Buffer.concat([Buffer.from([0, reverse ? 1 : 2]), ps, Buffer.alloc(1), msg], k))
}
function nonZero (len) {
  var out = Buffer.allocUnsafe(len)
  var i = 0
  var cache = randomBytes(len * 2)
  var cur = 0
  var num
  while (i < len) {
    if (cur === cache.length) {
      cache = randomBytes(len * 2)
      cur = 0
    }
    num = cache[cur++]
    if (num) {
      out[i++] = num
    }
  }
  return out
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVibGljLWVuY3J5cHQvbWdmLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wdWJsaWMtZW5jcnlwdC9wcml2YXRlRGVjcnlwdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVibGljLWVuY3J5cHQvd2l0aFB1YmxpYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVibGljLWVuY3J5cHQvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVibGljLWVuY3J5cHQveG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wdWJsaWMtZW5jcnlwdC9wdWJsaWNFbmNyeXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGlCQUFpQixtQkFBTyxDQUFDLHlCQUFhO0FBQ3RDLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEJBLGdCQUFnQixtQkFBTyxDQUFDLHdCQUFZO0FBQ3BDLFVBQVUsbUJBQU8sQ0FBQyxtQkFBTztBQUN6QixVQUFVLG1CQUFPLENBQUMsbUJBQU87QUFDekIsU0FBUyxtQkFBTyxDQUFDLG1CQUFPO0FBQ3hCLFVBQVUsbUJBQU8sQ0FBQyw0QkFBZ0I7QUFDbEMsaUJBQWlCLG1CQUFPLENBQUMseUJBQWE7QUFDdEMsaUJBQWlCLG1CQUFPLENBQUMsMEJBQWM7QUFDdkMsYUFBYSxtQkFBTyxDQUFDLHlCQUFhOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDeEdBLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QixhQUFhLG1CQUFPLENBQUMseUJBQWE7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUNYQSx3QkFBd0IsbUJBQU8sQ0FBQyw2QkFBaUI7QUFDakQseUJBQXlCLG1CQUFPLENBQUMsOEJBQWtCOztBQUVuRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNQQSxnQkFBZ0IsbUJBQU8sQ0FBQyx3QkFBWTtBQUNwQyxrQkFBa0IsbUJBQU8sQ0FBQyx5QkFBYTtBQUN2QyxpQkFBaUIsbUJBQU8sQ0FBQyx5QkFBYTtBQUN0QyxVQUFVLG1CQUFPLENBQUMsbUJBQU87QUFDekIsVUFBVSxtQkFBTyxDQUFDLG1CQUFPO0FBQ3pCLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QixpQkFBaUIsbUJBQU8sQ0FBQywwQkFBYztBQUN2QyxVQUFVLG1CQUFPLENBQUMsNEJBQWdCO0FBQ2xDLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLnB1YmxpYy1lbmNyeXB0LjAxMWRkNzA5ZjIyMjRhNGMzMzlhLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZUhhc2ggPSByZXF1aXJlKCdjcmVhdGUtaGFzaCcpXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc2VlZCwgbGVuKSB7XHJcbiAgdmFyIHQgPSBCdWZmZXIuYWxsb2MoMClcclxuICB2YXIgaSA9IDBcclxuICB2YXIgY1xyXG4gIHdoaWxlICh0Lmxlbmd0aCA8IGxlbikge1xyXG4gICAgYyA9IGkyb3BzKGkrKylcclxuICAgIHQgPSBCdWZmZXIuY29uY2F0KFt0LCBjcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKHNlZWQpLnVwZGF0ZShjKS5kaWdlc3QoKV0pXHJcbiAgfVxyXG4gIHJldHVybiB0LnNsaWNlKDAsIGxlbilcclxufVxyXG5cclxuZnVuY3Rpb24gaTJvcHMgKGMpIHtcclxuICB2YXIgb3V0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKDQpXHJcbiAgb3V0LndyaXRlVUludDMyQkUoYywgMClcclxuICByZXR1cm4gb3V0XHJcbn1cclxuIiwidmFyIHBhcnNlS2V5cyA9IHJlcXVpcmUoJ3BhcnNlLWFzbjEnKVxyXG52YXIgbWdmID0gcmVxdWlyZSgnLi9tZ2YnKVxyXG52YXIgeG9yID0gcmVxdWlyZSgnLi94b3InKVxyXG52YXIgQk4gPSByZXF1aXJlKCdibi5qcycpXHJcbnZhciBjcnQgPSByZXF1aXJlKCdicm93c2VyaWZ5LXJzYScpXHJcbnZhciBjcmVhdGVIYXNoID0gcmVxdWlyZSgnY3JlYXRlLWhhc2gnKVxyXG52YXIgd2l0aFB1YmxpYyA9IHJlcXVpcmUoJy4vd2l0aFB1YmxpYycpXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwcml2YXRlRGVjcnlwdCAocHJpdmF0ZUtleSwgZW5jLCByZXZlcnNlKSB7XHJcbiAgdmFyIHBhZGRpbmdcclxuICBpZiAocHJpdmF0ZUtleS5wYWRkaW5nKSB7XHJcbiAgICBwYWRkaW5nID0gcHJpdmF0ZUtleS5wYWRkaW5nXHJcbiAgfSBlbHNlIGlmIChyZXZlcnNlKSB7XHJcbiAgICBwYWRkaW5nID0gMVxyXG4gIH0gZWxzZSB7XHJcbiAgICBwYWRkaW5nID0gNFxyXG4gIH1cclxuXHJcbiAgdmFyIGtleSA9IHBhcnNlS2V5cyhwcml2YXRlS2V5KVxyXG4gIHZhciBrID0ga2V5Lm1vZHVsdXMuYnl0ZUxlbmd0aCgpXHJcbiAgaWYgKGVuYy5sZW5ndGggPiBrIHx8IG5ldyBCTihlbmMpLmNtcChrZXkubW9kdWx1cykgPj0gMCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdkZWNyeXB0aW9uIGVycm9yJylcclxuICB9XHJcbiAgdmFyIG1zZ1xyXG4gIGlmIChyZXZlcnNlKSB7XHJcbiAgICBtc2cgPSB3aXRoUHVibGljKG5ldyBCTihlbmMpLCBrZXkpXHJcbiAgfSBlbHNlIHtcclxuICAgIG1zZyA9IGNydChlbmMsIGtleSlcclxuICB9XHJcbiAgdmFyIHpCdWZmZXIgPSBCdWZmZXIuYWxsb2MoayAtIG1zZy5sZW5ndGgpXHJcbiAgbXNnID0gQnVmZmVyLmNvbmNhdChbekJ1ZmZlciwgbXNnXSwgaylcclxuICBpZiAocGFkZGluZyA9PT0gNCkge1xyXG4gICAgcmV0dXJuIG9hZXAoa2V5LCBtc2cpXHJcbiAgfSBlbHNlIGlmIChwYWRkaW5nID09PSAxKSB7XHJcbiAgICByZXR1cm4gcGtjczEoa2V5LCBtc2csIHJldmVyc2UpXHJcbiAgfSBlbHNlIGlmIChwYWRkaW5nID09PSAzKSB7XHJcbiAgICByZXR1cm4gbXNnXHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndW5rbm93biBwYWRkaW5nJylcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9hZXAgKGtleSwgbXNnKSB7XHJcbiAgdmFyIGsgPSBrZXkubW9kdWx1cy5ieXRlTGVuZ3RoKClcclxuICB2YXIgaUhhc2ggPSBjcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKEJ1ZmZlci5hbGxvYygwKSkuZGlnZXN0KClcclxuICB2YXIgaExlbiA9IGlIYXNoLmxlbmd0aFxyXG4gIGlmIChtc2dbMF0gIT09IDApIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignZGVjcnlwdGlvbiBlcnJvcicpXHJcbiAgfVxyXG4gIHZhciBtYXNrZWRTZWVkID0gbXNnLnNsaWNlKDEsIGhMZW4gKyAxKVxyXG4gIHZhciBtYXNrZWREYiA9IG1zZy5zbGljZShoTGVuICsgMSlcclxuICB2YXIgc2VlZCA9IHhvcihtYXNrZWRTZWVkLCBtZ2YobWFza2VkRGIsIGhMZW4pKVxyXG4gIHZhciBkYiA9IHhvcihtYXNrZWREYiwgbWdmKHNlZWQsIGsgLSBoTGVuIC0gMSkpXHJcbiAgaWYgKGNvbXBhcmUoaUhhc2gsIGRiLnNsaWNlKDAsIGhMZW4pKSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdkZWNyeXB0aW9uIGVycm9yJylcclxuICB9XHJcbiAgdmFyIGkgPSBoTGVuXHJcbiAgd2hpbGUgKGRiW2ldID09PSAwKSB7XHJcbiAgICBpKytcclxuICB9XHJcbiAgaWYgKGRiW2krK10gIT09IDEpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignZGVjcnlwdGlvbiBlcnJvcicpXHJcbiAgfVxyXG4gIHJldHVybiBkYi5zbGljZShpKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwa2NzMSAoa2V5LCBtc2csIHJldmVyc2UpIHtcclxuICB2YXIgcDEgPSBtc2cuc2xpY2UoMCwgMilcclxuICB2YXIgaSA9IDJcclxuICB2YXIgc3RhdHVzID0gMFxyXG4gIHdoaWxlIChtc2dbaSsrXSAhPT0gMCkge1xyXG4gICAgaWYgKGkgPj0gbXNnLmxlbmd0aCkge1xyXG4gICAgICBzdGF0dXMrK1xyXG4gICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxuICB2YXIgcHMgPSBtc2cuc2xpY2UoMiwgaSAtIDEpXHJcblxyXG4gIGlmICgocDEudG9TdHJpbmcoJ2hleCcpICE9PSAnMDAwMicgJiYgIXJldmVyc2UpIHx8IChwMS50b1N0cmluZygnaGV4JykgIT09ICcwMDAxJyAmJiByZXZlcnNlKSkge1xyXG4gICAgc3RhdHVzKytcclxuICB9XHJcbiAgaWYgKHBzLmxlbmd0aCA8IDgpIHtcclxuICAgIHN0YXR1cysrXHJcbiAgfVxyXG4gIGlmIChzdGF0dXMpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignZGVjcnlwdGlvbiBlcnJvcicpXHJcbiAgfVxyXG4gIHJldHVybiBtc2cuc2xpY2UoaSlcclxufVxyXG5mdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XHJcbiAgYSA9IEJ1ZmZlci5mcm9tKGEpXHJcbiAgYiA9IEJ1ZmZlci5mcm9tKGIpXHJcbiAgdmFyIGRpZiA9IDBcclxuICB2YXIgbGVuID0gYS5sZW5ndGhcclxuICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7XHJcbiAgICBkaWYrK1xyXG4gICAgbGVuID0gTWF0aC5taW4oYS5sZW5ndGgsIGIubGVuZ3RoKVxyXG4gIH1cclxuICB2YXIgaSA9IC0xXHJcbiAgd2hpbGUgKCsraSA8IGxlbikge1xyXG4gICAgZGlmICs9IChhW2ldIF4gYltpXSlcclxuICB9XHJcbiAgcmV0dXJuIGRpZlxyXG59XHJcbiIsInZhciBCTiA9IHJlcXVpcmUoJ2JuLmpzJylcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcblxyXG5mdW5jdGlvbiB3aXRoUHVibGljIChwYWRkZWRNc2csIGtleSkge1xyXG4gIHJldHVybiBCdWZmZXIuZnJvbShwYWRkZWRNc2dcclxuICAgIC50b1JlZChCTi5tb250KGtleS5tb2R1bHVzKSlcclxuICAgIC5yZWRQb3cobmV3IEJOKGtleS5wdWJsaWNFeHBvbmVudCkpXHJcbiAgICAuZnJvbVJlZCgpXHJcbiAgICAudG9BcnJheSgpKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHdpdGhQdWJsaWNcclxuIiwiZXhwb3J0cy5wdWJsaWNFbmNyeXB0ID0gcmVxdWlyZSgnLi9wdWJsaWNFbmNyeXB0JylcclxuZXhwb3J0cy5wcml2YXRlRGVjcnlwdCA9IHJlcXVpcmUoJy4vcHJpdmF0ZURlY3J5cHQnKVxyXG5cclxuZXhwb3J0cy5wcml2YXRlRW5jcnlwdCA9IGZ1bmN0aW9uIHByaXZhdGVFbmNyeXB0IChrZXksIGJ1Zikge1xyXG4gIHJldHVybiBleHBvcnRzLnB1YmxpY0VuY3J5cHQoa2V5LCBidWYsIHRydWUpXHJcbn1cclxuXHJcbmV4cG9ydHMucHVibGljRGVjcnlwdCA9IGZ1bmN0aW9uIHB1YmxpY0RlY3J5cHQgKGtleSwgYnVmKSB7XHJcbiAgcmV0dXJuIGV4cG9ydHMucHJpdmF0ZURlY3J5cHQoa2V5LCBidWYsIHRydWUpXHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4b3IgKGEsIGIpIHtcclxuICB2YXIgbGVuID0gYS5sZW5ndGhcclxuICB2YXIgaSA9IC0xXHJcbiAgd2hpbGUgKCsraSA8IGxlbikge1xyXG4gICAgYVtpXSBePSBiW2ldXHJcbiAgfVxyXG4gIHJldHVybiBhXHJcbn1cclxuIiwidmFyIHBhcnNlS2V5cyA9IHJlcXVpcmUoJ3BhcnNlLWFzbjEnKVxyXG52YXIgcmFuZG9tQnl0ZXMgPSByZXF1aXJlKCdyYW5kb21ieXRlcycpXHJcbnZhciBjcmVhdGVIYXNoID0gcmVxdWlyZSgnY3JlYXRlLWhhc2gnKVxyXG52YXIgbWdmID0gcmVxdWlyZSgnLi9tZ2YnKVxyXG52YXIgeG9yID0gcmVxdWlyZSgnLi94b3InKVxyXG52YXIgQk4gPSByZXF1aXJlKCdibi5qcycpXHJcbnZhciB3aXRoUHVibGljID0gcmVxdWlyZSgnLi93aXRoUHVibGljJylcclxudmFyIGNydCA9IHJlcXVpcmUoJ2Jyb3dzZXJpZnktcnNhJylcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHB1YmxpY0VuY3J5cHQgKHB1YmxpY0tleSwgbXNnLCByZXZlcnNlKSB7XHJcbiAgdmFyIHBhZGRpbmdcclxuICBpZiAocHVibGljS2V5LnBhZGRpbmcpIHtcclxuICAgIHBhZGRpbmcgPSBwdWJsaWNLZXkucGFkZGluZ1xyXG4gIH0gZWxzZSBpZiAocmV2ZXJzZSkge1xyXG4gICAgcGFkZGluZyA9IDFcclxuICB9IGVsc2Uge1xyXG4gICAgcGFkZGluZyA9IDRcclxuICB9XHJcbiAgdmFyIGtleSA9IHBhcnNlS2V5cyhwdWJsaWNLZXkpXHJcbiAgdmFyIHBhZGRlZE1zZ1xyXG4gIGlmIChwYWRkaW5nID09PSA0KSB7XHJcbiAgICBwYWRkZWRNc2cgPSBvYWVwKGtleSwgbXNnKVxyXG4gIH0gZWxzZSBpZiAocGFkZGluZyA9PT0gMSkge1xyXG4gICAgcGFkZGVkTXNnID0gcGtjczEoa2V5LCBtc2csIHJldmVyc2UpXHJcbiAgfSBlbHNlIGlmIChwYWRkaW5nID09PSAzKSB7XHJcbiAgICBwYWRkZWRNc2cgPSBuZXcgQk4obXNnKVxyXG4gICAgaWYgKHBhZGRlZE1zZy5jbXAoa2V5Lm1vZHVsdXMpID49IDApIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdkYXRhIHRvbyBsb25nIGZvciBtb2R1bHVzJylcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1bmtub3duIHBhZGRpbmcnKVxyXG4gIH1cclxuICBpZiAocmV2ZXJzZSkge1xyXG4gICAgcmV0dXJuIGNydChwYWRkZWRNc2csIGtleSlcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHdpdGhQdWJsaWMocGFkZGVkTXNnLCBrZXkpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBvYWVwIChrZXksIG1zZykge1xyXG4gIHZhciBrID0ga2V5Lm1vZHVsdXMuYnl0ZUxlbmd0aCgpXHJcbiAgdmFyIG1MZW4gPSBtc2cubGVuZ3RoXHJcbiAgdmFyIGlIYXNoID0gY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShCdWZmZXIuYWxsb2MoMCkpLmRpZ2VzdCgpXHJcbiAgdmFyIGhMZW4gPSBpSGFzaC5sZW5ndGhcclxuICB2YXIgaExlbjIgPSAyICogaExlblxyXG4gIGlmIChtTGVuID4gayAtIGhMZW4yIC0gMikge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdtZXNzYWdlIHRvbyBsb25nJylcclxuICB9XHJcbiAgdmFyIHBzID0gQnVmZmVyLmFsbG9jKGsgLSBtTGVuIC0gaExlbjIgLSAyKVxyXG4gIHZhciBkYmxlbiA9IGsgLSBoTGVuIC0gMVxyXG4gIHZhciBzZWVkID0gcmFuZG9tQnl0ZXMoaExlbilcclxuICB2YXIgbWFza2VkRGIgPSB4b3IoQnVmZmVyLmNvbmNhdChbaUhhc2gsIHBzLCBCdWZmZXIuYWxsb2MoMSwgMSksIG1zZ10sIGRibGVuKSwgbWdmKHNlZWQsIGRibGVuKSlcclxuICB2YXIgbWFza2VkU2VlZCA9IHhvcihzZWVkLCBtZ2YobWFza2VkRGIsIGhMZW4pKVxyXG4gIHJldHVybiBuZXcgQk4oQnVmZmVyLmNvbmNhdChbQnVmZmVyLmFsbG9jKDEpLCBtYXNrZWRTZWVkLCBtYXNrZWREYl0sIGspKVxyXG59XHJcbmZ1bmN0aW9uIHBrY3MxIChrZXksIG1zZywgcmV2ZXJzZSkge1xyXG4gIHZhciBtTGVuID0gbXNnLmxlbmd0aFxyXG4gIHZhciBrID0ga2V5Lm1vZHVsdXMuYnl0ZUxlbmd0aCgpXHJcbiAgaWYgKG1MZW4gPiBrIC0gMTEpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignbWVzc2FnZSB0b28gbG9uZycpXHJcbiAgfVxyXG4gIHZhciBwc1xyXG4gIGlmIChyZXZlcnNlKSB7XHJcbiAgICBwcyA9IEJ1ZmZlci5hbGxvYyhrIC0gbUxlbiAtIDMsIDB4ZmYpXHJcbiAgfSBlbHNlIHtcclxuICAgIHBzID0gbm9uWmVybyhrIC0gbUxlbiAtIDMpXHJcbiAgfVxyXG4gIHJldHVybiBuZXcgQk4oQnVmZmVyLmNvbmNhdChbQnVmZmVyLmZyb20oWzAsIHJldmVyc2UgPyAxIDogMl0pLCBwcywgQnVmZmVyLmFsbG9jKDEpLCBtc2ddLCBrKSlcclxufVxyXG5mdW5jdGlvbiBub25aZXJvIChsZW4pIHtcclxuICB2YXIgb3V0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbilcclxuICB2YXIgaSA9IDBcclxuICB2YXIgY2FjaGUgPSByYW5kb21CeXRlcyhsZW4gKiAyKVxyXG4gIHZhciBjdXIgPSAwXHJcbiAgdmFyIG51bVxyXG4gIHdoaWxlIChpIDwgbGVuKSB7XHJcbiAgICBpZiAoY3VyID09PSBjYWNoZS5sZW5ndGgpIHtcclxuICAgICAgY2FjaGUgPSByYW5kb21CeXRlcyhsZW4gKiAyKVxyXG4gICAgICBjdXIgPSAwXHJcbiAgICB9XHJcbiAgICBudW0gPSBjYWNoZVtjdXIrK11cclxuICAgIGlmIChudW0pIHtcclxuICAgICAgb3V0W2krK10gPSBudW1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG91dFxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=