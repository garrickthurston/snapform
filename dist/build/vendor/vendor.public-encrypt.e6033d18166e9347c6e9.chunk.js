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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVibGljLWVuY3J5cHQvbWdmLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wdWJsaWMtZW5jcnlwdC9wcml2YXRlRGVjcnlwdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVibGljLWVuY3J5cHQvd2l0aFB1YmxpYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVibGljLWVuY3J5cHQvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHVibGljLWVuY3J5cHQveG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wdWJsaWMtZW5jcnlwdC9wdWJsaWNFbmNyeXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGlCQUFpQixtQkFBTyxDQUFDLHlCQUFhO0FBQ3RDLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEJBLGdCQUFnQixtQkFBTyxDQUFDLHdCQUFZO0FBQ3BDLFVBQVUsbUJBQU8sQ0FBQyxtQkFBTztBQUN6QixVQUFVLG1CQUFPLENBQUMsbUJBQU87QUFDekIsU0FBUyxtQkFBTyxDQUFDLG1CQUFPO0FBQ3hCLFVBQVUsbUJBQU8sQ0FBQyw0QkFBZ0I7QUFDbEMsaUJBQWlCLG1CQUFPLENBQUMseUJBQWE7QUFDdEMsaUJBQWlCLG1CQUFPLENBQUMsMEJBQWM7QUFDdkMsYUFBYSxtQkFBTyxDQUFDLHlCQUFhOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDeEdBLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QixhQUFhLG1CQUFPLENBQUMseUJBQWE7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUNYQSx3QkFBd0IsbUJBQU8sQ0FBQyw2QkFBaUI7QUFDakQseUJBQXlCLG1CQUFPLENBQUMsOEJBQWtCOztBQUVuRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNQQSxnQkFBZ0IsbUJBQU8sQ0FBQyx3QkFBWTtBQUNwQyxrQkFBa0IsbUJBQU8sQ0FBQyx5QkFBYTtBQUN2QyxpQkFBaUIsbUJBQU8sQ0FBQyx5QkFBYTtBQUN0QyxVQUFVLG1CQUFPLENBQUMsbUJBQU87QUFDekIsVUFBVSxtQkFBTyxDQUFDLG1CQUFPO0FBQ3pCLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QixpQkFBaUIsbUJBQU8sQ0FBQywwQkFBYztBQUN2QyxVQUFVLG1CQUFPLENBQUMsNEJBQWdCO0FBQ2xDLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLnB1YmxpYy1lbmNyeXB0LmU2MDMzZDE4MTY2ZTkzNDdjNmU5LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZUhhc2ggPSByZXF1aXJlKCdjcmVhdGUtaGFzaCcpXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc2VlZCwgbGVuKSB7XG4gIHZhciB0ID0gQnVmZmVyLmFsbG9jKDApXG4gIHZhciBpID0gMFxuICB2YXIgY1xuICB3aGlsZSAodC5sZW5ndGggPCBsZW4pIHtcbiAgICBjID0gaTJvcHMoaSsrKVxuICAgIHQgPSBCdWZmZXIuY29uY2F0KFt0LCBjcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKHNlZWQpLnVwZGF0ZShjKS5kaWdlc3QoKV0pXG4gIH1cbiAgcmV0dXJuIHQuc2xpY2UoMCwgbGVuKVxufVxuXG5mdW5jdGlvbiBpMm9wcyAoYykge1xuICB2YXIgb3V0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKDQpXG4gIG91dC53cml0ZVVJbnQzMkJFKGMsIDApXG4gIHJldHVybiBvdXRcbn1cbiIsInZhciBwYXJzZUtleXMgPSByZXF1aXJlKCdwYXJzZS1hc24xJylcbnZhciBtZ2YgPSByZXF1aXJlKCcuL21nZicpXG52YXIgeG9yID0gcmVxdWlyZSgnLi94b3InKVxudmFyIEJOID0gcmVxdWlyZSgnYm4uanMnKVxudmFyIGNydCA9IHJlcXVpcmUoJ2Jyb3dzZXJpZnktcnNhJylcbnZhciBjcmVhdGVIYXNoID0gcmVxdWlyZSgnY3JlYXRlLWhhc2gnKVxudmFyIHdpdGhQdWJsaWMgPSByZXF1aXJlKCcuL3dpdGhQdWJsaWMnKVxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcHJpdmF0ZURlY3J5cHQgKHByaXZhdGVLZXksIGVuYywgcmV2ZXJzZSkge1xuICB2YXIgcGFkZGluZ1xuICBpZiAocHJpdmF0ZUtleS5wYWRkaW5nKSB7XG4gICAgcGFkZGluZyA9IHByaXZhdGVLZXkucGFkZGluZ1xuICB9IGVsc2UgaWYgKHJldmVyc2UpIHtcbiAgICBwYWRkaW5nID0gMVxuICB9IGVsc2Uge1xuICAgIHBhZGRpbmcgPSA0XG4gIH1cblxuICB2YXIga2V5ID0gcGFyc2VLZXlzKHByaXZhdGVLZXkpXG4gIHZhciBrID0ga2V5Lm1vZHVsdXMuYnl0ZUxlbmd0aCgpXG4gIGlmIChlbmMubGVuZ3RoID4gayB8fCBuZXcgQk4oZW5jKS5jbXAoa2V5Lm1vZHVsdXMpID49IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2RlY3J5cHRpb24gZXJyb3InKVxuICB9XG4gIHZhciBtc2dcbiAgaWYgKHJldmVyc2UpIHtcbiAgICBtc2cgPSB3aXRoUHVibGljKG5ldyBCTihlbmMpLCBrZXkpXG4gIH0gZWxzZSB7XG4gICAgbXNnID0gY3J0KGVuYywga2V5KVxuICB9XG4gIHZhciB6QnVmZmVyID0gQnVmZmVyLmFsbG9jKGsgLSBtc2cubGVuZ3RoKVxuICBtc2cgPSBCdWZmZXIuY29uY2F0KFt6QnVmZmVyLCBtc2ddLCBrKVxuICBpZiAocGFkZGluZyA9PT0gNCkge1xuICAgIHJldHVybiBvYWVwKGtleSwgbXNnKVxuICB9IGVsc2UgaWYgKHBhZGRpbmcgPT09IDEpIHtcbiAgICByZXR1cm4gcGtjczEoa2V5LCBtc2csIHJldmVyc2UpXG4gIH0gZWxzZSBpZiAocGFkZGluZyA9PT0gMykge1xuICAgIHJldHVybiBtc2dcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vua25vd24gcGFkZGluZycpXG4gIH1cbn1cblxuZnVuY3Rpb24gb2FlcCAoa2V5LCBtc2cpIHtcbiAgdmFyIGsgPSBrZXkubW9kdWx1cy5ieXRlTGVuZ3RoKClcbiAgdmFyIGlIYXNoID0gY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShCdWZmZXIuYWxsb2MoMCkpLmRpZ2VzdCgpXG4gIHZhciBoTGVuID0gaUhhc2gubGVuZ3RoXG4gIGlmIChtc2dbMF0gIT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2RlY3J5cHRpb24gZXJyb3InKVxuICB9XG4gIHZhciBtYXNrZWRTZWVkID0gbXNnLnNsaWNlKDEsIGhMZW4gKyAxKVxuICB2YXIgbWFza2VkRGIgPSBtc2cuc2xpY2UoaExlbiArIDEpXG4gIHZhciBzZWVkID0geG9yKG1hc2tlZFNlZWQsIG1nZihtYXNrZWREYiwgaExlbikpXG4gIHZhciBkYiA9IHhvcihtYXNrZWREYiwgbWdmKHNlZWQsIGsgLSBoTGVuIC0gMSkpXG4gIGlmIChjb21wYXJlKGlIYXNoLCBkYi5zbGljZSgwLCBoTGVuKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2RlY3J5cHRpb24gZXJyb3InKVxuICB9XG4gIHZhciBpID0gaExlblxuICB3aGlsZSAoZGJbaV0gPT09IDApIHtcbiAgICBpKytcbiAgfVxuICBpZiAoZGJbaSsrXSAhPT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignZGVjcnlwdGlvbiBlcnJvcicpXG4gIH1cbiAgcmV0dXJuIGRiLnNsaWNlKGkpXG59XG5cbmZ1bmN0aW9uIHBrY3MxIChrZXksIG1zZywgcmV2ZXJzZSkge1xuICB2YXIgcDEgPSBtc2cuc2xpY2UoMCwgMilcbiAgdmFyIGkgPSAyXG4gIHZhciBzdGF0dXMgPSAwXG4gIHdoaWxlIChtc2dbaSsrXSAhPT0gMCkge1xuICAgIGlmIChpID49IG1zZy5sZW5ndGgpIHtcbiAgICAgIHN0YXR1cysrXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICB2YXIgcHMgPSBtc2cuc2xpY2UoMiwgaSAtIDEpXG5cbiAgaWYgKChwMS50b1N0cmluZygnaGV4JykgIT09ICcwMDAyJyAmJiAhcmV2ZXJzZSkgfHwgKHAxLnRvU3RyaW5nKCdoZXgnKSAhPT0gJzAwMDEnICYmIHJldmVyc2UpKSB7XG4gICAgc3RhdHVzKytcbiAgfVxuICBpZiAocHMubGVuZ3RoIDwgOCkge1xuICAgIHN0YXR1cysrXG4gIH1cbiAgaWYgKHN0YXR1cykge1xuICAgIHRocm93IG5ldyBFcnJvcignZGVjcnlwdGlvbiBlcnJvcicpXG4gIH1cbiAgcmV0dXJuIG1zZy5zbGljZShpKVxufVxuZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBhID0gQnVmZmVyLmZyb20oYSlcbiAgYiA9IEJ1ZmZlci5mcm9tKGIpXG4gIHZhciBkaWYgPSAwXG4gIHZhciBsZW4gPSBhLmxlbmd0aFxuICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7XG4gICAgZGlmKytcbiAgICBsZW4gPSBNYXRoLm1pbihhLmxlbmd0aCwgYi5sZW5ndGgpXG4gIH1cbiAgdmFyIGkgPSAtMVxuICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgZGlmICs9IChhW2ldIF4gYltpXSlcbiAgfVxuICByZXR1cm4gZGlmXG59XG4iLCJ2YXIgQk4gPSByZXF1aXJlKCdibi5qcycpXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcblxuZnVuY3Rpb24gd2l0aFB1YmxpYyAocGFkZGVkTXNnLCBrZXkpIHtcbiAgcmV0dXJuIEJ1ZmZlci5mcm9tKHBhZGRlZE1zZ1xuICAgIC50b1JlZChCTi5tb250KGtleS5tb2R1bHVzKSlcbiAgICAucmVkUG93KG5ldyBCTihrZXkucHVibGljRXhwb25lbnQpKVxuICAgIC5mcm9tUmVkKClcbiAgICAudG9BcnJheSgpKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdpdGhQdWJsaWNcbiIsImV4cG9ydHMucHVibGljRW5jcnlwdCA9IHJlcXVpcmUoJy4vcHVibGljRW5jcnlwdCcpXG5leHBvcnRzLnByaXZhdGVEZWNyeXB0ID0gcmVxdWlyZSgnLi9wcml2YXRlRGVjcnlwdCcpXG5cbmV4cG9ydHMucHJpdmF0ZUVuY3J5cHQgPSBmdW5jdGlvbiBwcml2YXRlRW5jcnlwdCAoa2V5LCBidWYpIHtcbiAgcmV0dXJuIGV4cG9ydHMucHVibGljRW5jcnlwdChrZXksIGJ1ZiwgdHJ1ZSlcbn1cblxuZXhwb3J0cy5wdWJsaWNEZWNyeXB0ID0gZnVuY3Rpb24gcHVibGljRGVjcnlwdCAoa2V5LCBidWYpIHtcbiAgcmV0dXJuIGV4cG9ydHMucHJpdmF0ZURlY3J5cHQoa2V5LCBidWYsIHRydWUpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhvciAoYSwgYikge1xuICB2YXIgbGVuID0gYS5sZW5ndGhcbiAgdmFyIGkgPSAtMVxuICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgYVtpXSBePSBiW2ldXG4gIH1cbiAgcmV0dXJuIGFcbn1cbiIsInZhciBwYXJzZUtleXMgPSByZXF1aXJlKCdwYXJzZS1hc24xJylcbnZhciByYW5kb21CeXRlcyA9IHJlcXVpcmUoJ3JhbmRvbWJ5dGVzJylcbnZhciBjcmVhdGVIYXNoID0gcmVxdWlyZSgnY3JlYXRlLWhhc2gnKVxudmFyIG1nZiA9IHJlcXVpcmUoJy4vbWdmJylcbnZhciB4b3IgPSByZXF1aXJlKCcuL3hvcicpXG52YXIgQk4gPSByZXF1aXJlKCdibi5qcycpXG52YXIgd2l0aFB1YmxpYyA9IHJlcXVpcmUoJy4vd2l0aFB1YmxpYycpXG52YXIgY3J0ID0gcmVxdWlyZSgnYnJvd3NlcmlmeS1yc2EnKVxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcHVibGljRW5jcnlwdCAocHVibGljS2V5LCBtc2csIHJldmVyc2UpIHtcbiAgdmFyIHBhZGRpbmdcbiAgaWYgKHB1YmxpY0tleS5wYWRkaW5nKSB7XG4gICAgcGFkZGluZyA9IHB1YmxpY0tleS5wYWRkaW5nXG4gIH0gZWxzZSBpZiAocmV2ZXJzZSkge1xuICAgIHBhZGRpbmcgPSAxXG4gIH0gZWxzZSB7XG4gICAgcGFkZGluZyA9IDRcbiAgfVxuICB2YXIga2V5ID0gcGFyc2VLZXlzKHB1YmxpY0tleSlcbiAgdmFyIHBhZGRlZE1zZ1xuICBpZiAocGFkZGluZyA9PT0gNCkge1xuICAgIHBhZGRlZE1zZyA9IG9hZXAoa2V5LCBtc2cpXG4gIH0gZWxzZSBpZiAocGFkZGluZyA9PT0gMSkge1xuICAgIHBhZGRlZE1zZyA9IHBrY3MxKGtleSwgbXNnLCByZXZlcnNlKVxuICB9IGVsc2UgaWYgKHBhZGRpbmcgPT09IDMpIHtcbiAgICBwYWRkZWRNc2cgPSBuZXcgQk4obXNnKVxuICAgIGlmIChwYWRkZWRNc2cuY21wKGtleS5tb2R1bHVzKSA+PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2RhdGEgdG9vIGxvbmcgZm9yIG1vZHVsdXMnKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vua25vd24gcGFkZGluZycpXG4gIH1cbiAgaWYgKHJldmVyc2UpIHtcbiAgICByZXR1cm4gY3J0KHBhZGRlZE1zZywga2V5KVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB3aXRoUHVibGljKHBhZGRlZE1zZywga2V5KVxuICB9XG59XG5cbmZ1bmN0aW9uIG9hZXAgKGtleSwgbXNnKSB7XG4gIHZhciBrID0ga2V5Lm1vZHVsdXMuYnl0ZUxlbmd0aCgpXG4gIHZhciBtTGVuID0gbXNnLmxlbmd0aFxuICB2YXIgaUhhc2ggPSBjcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKEJ1ZmZlci5hbGxvYygwKSkuZGlnZXN0KClcbiAgdmFyIGhMZW4gPSBpSGFzaC5sZW5ndGhcbiAgdmFyIGhMZW4yID0gMiAqIGhMZW5cbiAgaWYgKG1MZW4gPiBrIC0gaExlbjIgLSAyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdtZXNzYWdlIHRvbyBsb25nJylcbiAgfVxuICB2YXIgcHMgPSBCdWZmZXIuYWxsb2MoayAtIG1MZW4gLSBoTGVuMiAtIDIpXG4gIHZhciBkYmxlbiA9IGsgLSBoTGVuIC0gMVxuICB2YXIgc2VlZCA9IHJhbmRvbUJ5dGVzKGhMZW4pXG4gIHZhciBtYXNrZWREYiA9IHhvcihCdWZmZXIuY29uY2F0KFtpSGFzaCwgcHMsIEJ1ZmZlci5hbGxvYygxLCAxKSwgbXNnXSwgZGJsZW4pLCBtZ2Yoc2VlZCwgZGJsZW4pKVxuICB2YXIgbWFza2VkU2VlZCA9IHhvcihzZWVkLCBtZ2YobWFza2VkRGIsIGhMZW4pKVxuICByZXR1cm4gbmV3IEJOKEJ1ZmZlci5jb25jYXQoW0J1ZmZlci5hbGxvYygxKSwgbWFza2VkU2VlZCwgbWFza2VkRGJdLCBrKSlcbn1cbmZ1bmN0aW9uIHBrY3MxIChrZXksIG1zZywgcmV2ZXJzZSkge1xuICB2YXIgbUxlbiA9IG1zZy5sZW5ndGhcbiAgdmFyIGsgPSBrZXkubW9kdWx1cy5ieXRlTGVuZ3RoKClcbiAgaWYgKG1MZW4gPiBrIC0gMTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ21lc3NhZ2UgdG9vIGxvbmcnKVxuICB9XG4gIHZhciBwc1xuICBpZiAocmV2ZXJzZSkge1xuICAgIHBzID0gQnVmZmVyLmFsbG9jKGsgLSBtTGVuIC0gMywgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBwcyA9IG5vblplcm8oayAtIG1MZW4gLSAzKVxuICB9XG4gIHJldHVybiBuZXcgQk4oQnVmZmVyLmNvbmNhdChbQnVmZmVyLmZyb20oWzAsIHJldmVyc2UgPyAxIDogMl0pLCBwcywgQnVmZmVyLmFsbG9jKDEpLCBtc2ddLCBrKSlcbn1cbmZ1bmN0aW9uIG5vblplcm8gKGxlbikge1xuICB2YXIgb3V0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbilcbiAgdmFyIGkgPSAwXG4gIHZhciBjYWNoZSA9IHJhbmRvbUJ5dGVzKGxlbiAqIDIpXG4gIHZhciBjdXIgPSAwXG4gIHZhciBudW1cbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICBpZiAoY3VyID09PSBjYWNoZS5sZW5ndGgpIHtcbiAgICAgIGNhY2hlID0gcmFuZG9tQnl0ZXMobGVuICogMilcbiAgICAgIGN1ciA9IDBcbiAgICB9XG4gICAgbnVtID0gY2FjaGVbY3VyKytdXG4gICAgaWYgKG51bSkge1xuICAgICAgb3V0W2krK10gPSBudW1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dFxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==