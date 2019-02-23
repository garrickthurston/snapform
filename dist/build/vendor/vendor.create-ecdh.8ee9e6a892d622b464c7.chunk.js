(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.create-ecdh"],{

/***/ "4dMO":
/*!*********************************************!*\
  !*** ./node_modules/create-ecdh/browser.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var elliptic = __webpack_require__(/*! elliptic */ "MzeL")
var BN = __webpack_require__(/*! bn.js */ "OZ/i")

module.exports = function createECDH (curve) {
  return new ECDH(curve)
}

var aliases = {
  secp256k1: {
    name: 'secp256k1',
    byteLength: 32
  },
  secp224r1: {
    name: 'p224',
    byteLength: 28
  },
  prime256v1: {
    name: 'p256',
    byteLength: 32
  },
  prime192v1: {
    name: 'p192',
    byteLength: 24
  },
  ed25519: {
    name: 'ed25519',
    byteLength: 32
  },
  secp384r1: {
    name: 'p384',
    byteLength: 48
  },
  secp521r1: {
    name: 'p521',
    byteLength: 66
  }
}

aliases.p224 = aliases.secp224r1
aliases.p256 = aliases.secp256r1 = aliases.prime256v1
aliases.p192 = aliases.secp192r1 = aliases.prime192v1
aliases.p384 = aliases.secp384r1
aliases.p521 = aliases.secp521r1

function ECDH (curve) {
  this.curveType = aliases[curve]
  if (!this.curveType) {
    this.curveType = {
      name: curve
    }
  }
  this.curve = new elliptic.ec(this.curveType.name) // eslint-disable-line new-cap
  this.keys = void 0
}

ECDH.prototype.generateKeys = function (enc, format) {
  this.keys = this.curve.genKeyPair()
  return this.getPublicKey(enc, format)
}

ECDH.prototype.computeSecret = function (other, inenc, enc) {
  inenc = inenc || 'utf8'
  if (!Buffer.isBuffer(other)) {
    other = new Buffer(other, inenc)
  }
  var otherPub = this.curve.keyFromPublic(other).getPublic()
  var out = otherPub.mul(this.keys.getPrivate()).getX()
  return formatReturnValue(out, enc, this.curveType.byteLength)
}

ECDH.prototype.getPublicKey = function (enc, format) {
  var key = this.keys.getPublic(format === 'compressed', true)
  if (format === 'hybrid') {
    if (key[key.length - 1] % 2) {
      key[0] = 7
    } else {
      key[0] = 6
    }
  }
  return formatReturnValue(key, enc)
}

ECDH.prototype.getPrivateKey = function (enc) {
  return formatReturnValue(this.keys.getPrivate(), enc)
}

ECDH.prototype.setPublicKey = function (pub, enc) {
  enc = enc || 'utf8'
  if (!Buffer.isBuffer(pub)) {
    pub = new Buffer(pub, enc)
  }
  this.keys._importPublic(pub)
  return this
}

ECDH.prototype.setPrivateKey = function (priv, enc) {
  enc = enc || 'utf8'
  if (!Buffer.isBuffer(priv)) {
    priv = new Buffer(priv, enc)
  }

  var _priv = new BN(priv)
  _priv = _priv.toString(16)
  this.keys = this.curve.genKeyPair()
  this.keys._importPrivate(_priv)
  return this
}

function formatReturnValue (bn, enc, len) {
  if (!Array.isArray(bn)) {
    bn = bn.toArray()
  }
  var buf = new Buffer(bn)
  if (len && buf.length < len) {
    var zeros = new Buffer(len - buf.length)
    zeros.fill(0)
    buf = Buffer.concat([zeros, buf])
  }
  if (!enc) {
    return buf
  } else {
    return buf.toString(enc)
  }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../buffer/index.js */ "tjlA").Buffer))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3JlYXRlLWVjZGgvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw2REFBZSxtQkFBTyxDQUFDLHNCQUFVO0FBQ2pDLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTzs7QUFFeEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmNyZWF0ZS1lY2RoLjhlZTllNmE4OTJkNjIyYjQ2NGM3LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVsbGlwdGljID0gcmVxdWlyZSgnZWxsaXB0aWMnKVxyXG52YXIgQk4gPSByZXF1aXJlKCdibi5qcycpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVDREggKGN1cnZlKSB7XHJcbiAgcmV0dXJuIG5ldyBFQ0RIKGN1cnZlKVxyXG59XHJcblxyXG52YXIgYWxpYXNlcyA9IHtcclxuICBzZWNwMjU2azE6IHtcclxuICAgIG5hbWU6ICdzZWNwMjU2azEnLFxyXG4gICAgYnl0ZUxlbmd0aDogMzJcclxuICB9LFxyXG4gIHNlY3AyMjRyMToge1xyXG4gICAgbmFtZTogJ3AyMjQnLFxyXG4gICAgYnl0ZUxlbmd0aDogMjhcclxuICB9LFxyXG4gIHByaW1lMjU2djE6IHtcclxuICAgIG5hbWU6ICdwMjU2JyxcclxuICAgIGJ5dGVMZW5ndGg6IDMyXHJcbiAgfSxcclxuICBwcmltZTE5MnYxOiB7XHJcbiAgICBuYW1lOiAncDE5MicsXHJcbiAgICBieXRlTGVuZ3RoOiAyNFxyXG4gIH0sXHJcbiAgZWQyNTUxOToge1xyXG4gICAgbmFtZTogJ2VkMjU1MTknLFxyXG4gICAgYnl0ZUxlbmd0aDogMzJcclxuICB9LFxyXG4gIHNlY3AzODRyMToge1xyXG4gICAgbmFtZTogJ3AzODQnLFxyXG4gICAgYnl0ZUxlbmd0aDogNDhcclxuICB9LFxyXG4gIHNlY3A1MjFyMToge1xyXG4gICAgbmFtZTogJ3A1MjEnLFxyXG4gICAgYnl0ZUxlbmd0aDogNjZcclxuICB9XHJcbn1cclxuXHJcbmFsaWFzZXMucDIyNCA9IGFsaWFzZXMuc2VjcDIyNHIxXHJcbmFsaWFzZXMucDI1NiA9IGFsaWFzZXMuc2VjcDI1NnIxID0gYWxpYXNlcy5wcmltZTI1NnYxXHJcbmFsaWFzZXMucDE5MiA9IGFsaWFzZXMuc2VjcDE5MnIxID0gYWxpYXNlcy5wcmltZTE5MnYxXHJcbmFsaWFzZXMucDM4NCA9IGFsaWFzZXMuc2VjcDM4NHIxXHJcbmFsaWFzZXMucDUyMSA9IGFsaWFzZXMuc2VjcDUyMXIxXHJcblxyXG5mdW5jdGlvbiBFQ0RIIChjdXJ2ZSkge1xyXG4gIHRoaXMuY3VydmVUeXBlID0gYWxpYXNlc1tjdXJ2ZV1cclxuICBpZiAoIXRoaXMuY3VydmVUeXBlKSB7XHJcbiAgICB0aGlzLmN1cnZlVHlwZSA9IHtcclxuICAgICAgbmFtZTogY3VydmVcclxuICAgIH1cclxuICB9XHJcbiAgdGhpcy5jdXJ2ZSA9IG5ldyBlbGxpcHRpYy5lYyh0aGlzLmN1cnZlVHlwZS5uYW1lKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5ldy1jYXBcclxuICB0aGlzLmtleXMgPSB2b2lkIDBcclxufVxyXG5cclxuRUNESC5wcm90b3R5cGUuZ2VuZXJhdGVLZXlzID0gZnVuY3Rpb24gKGVuYywgZm9ybWF0KSB7XHJcbiAgdGhpcy5rZXlzID0gdGhpcy5jdXJ2ZS5nZW5LZXlQYWlyKClcclxuICByZXR1cm4gdGhpcy5nZXRQdWJsaWNLZXkoZW5jLCBmb3JtYXQpXHJcbn1cclxuXHJcbkVDREgucHJvdG90eXBlLmNvbXB1dGVTZWNyZXQgPSBmdW5jdGlvbiAob3RoZXIsIGluZW5jLCBlbmMpIHtcclxuICBpbmVuYyA9IGluZW5jIHx8ICd1dGY4J1xyXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKG90aGVyKSkge1xyXG4gICAgb3RoZXIgPSBuZXcgQnVmZmVyKG90aGVyLCBpbmVuYylcclxuICB9XHJcbiAgdmFyIG90aGVyUHViID0gdGhpcy5jdXJ2ZS5rZXlGcm9tUHVibGljKG90aGVyKS5nZXRQdWJsaWMoKVxyXG4gIHZhciBvdXQgPSBvdGhlclB1Yi5tdWwodGhpcy5rZXlzLmdldFByaXZhdGUoKSkuZ2V0WCgpXHJcbiAgcmV0dXJuIGZvcm1hdFJldHVyblZhbHVlKG91dCwgZW5jLCB0aGlzLmN1cnZlVHlwZS5ieXRlTGVuZ3RoKVxyXG59XHJcblxyXG5FQ0RILnByb3RvdHlwZS5nZXRQdWJsaWNLZXkgPSBmdW5jdGlvbiAoZW5jLCBmb3JtYXQpIHtcclxuICB2YXIga2V5ID0gdGhpcy5rZXlzLmdldFB1YmxpYyhmb3JtYXQgPT09ICdjb21wcmVzc2VkJywgdHJ1ZSlcclxuICBpZiAoZm9ybWF0ID09PSAnaHlicmlkJykge1xyXG4gICAgaWYgKGtleVtrZXkubGVuZ3RoIC0gMV0gJSAyKSB7XHJcbiAgICAgIGtleVswXSA9IDdcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGtleVswXSA9IDZcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGZvcm1hdFJldHVyblZhbHVlKGtleSwgZW5jKVxyXG59XHJcblxyXG5FQ0RILnByb3RvdHlwZS5nZXRQcml2YXRlS2V5ID0gZnVuY3Rpb24gKGVuYykge1xyXG4gIHJldHVybiBmb3JtYXRSZXR1cm5WYWx1ZSh0aGlzLmtleXMuZ2V0UHJpdmF0ZSgpLCBlbmMpXHJcbn1cclxuXHJcbkVDREgucHJvdG90eXBlLnNldFB1YmxpY0tleSA9IGZ1bmN0aW9uIChwdWIsIGVuYykge1xyXG4gIGVuYyA9IGVuYyB8fCAndXRmOCdcclxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihwdWIpKSB7XHJcbiAgICBwdWIgPSBuZXcgQnVmZmVyKHB1YiwgZW5jKVxyXG4gIH1cclxuICB0aGlzLmtleXMuX2ltcG9ydFB1YmxpYyhwdWIpXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuRUNESC5wcm90b3R5cGUuc2V0UHJpdmF0ZUtleSA9IGZ1bmN0aW9uIChwcml2LCBlbmMpIHtcclxuICBlbmMgPSBlbmMgfHwgJ3V0ZjgnXHJcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIocHJpdikpIHtcclxuICAgIHByaXYgPSBuZXcgQnVmZmVyKHByaXYsIGVuYylcclxuICB9XHJcblxyXG4gIHZhciBfcHJpdiA9IG5ldyBCTihwcml2KVxyXG4gIF9wcml2ID0gX3ByaXYudG9TdHJpbmcoMTYpXHJcbiAgdGhpcy5rZXlzID0gdGhpcy5jdXJ2ZS5nZW5LZXlQYWlyKClcclxuICB0aGlzLmtleXMuX2ltcG9ydFByaXZhdGUoX3ByaXYpXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybWF0UmV0dXJuVmFsdWUgKGJuLCBlbmMsIGxlbikge1xyXG4gIGlmICghQXJyYXkuaXNBcnJheShibikpIHtcclxuICAgIGJuID0gYm4udG9BcnJheSgpXHJcbiAgfVxyXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKGJuKVxyXG4gIGlmIChsZW4gJiYgYnVmLmxlbmd0aCA8IGxlbikge1xyXG4gICAgdmFyIHplcm9zID0gbmV3IEJ1ZmZlcihsZW4gLSBidWYubGVuZ3RoKVxyXG4gICAgemVyb3MuZmlsbCgwKVxyXG4gICAgYnVmID0gQnVmZmVyLmNvbmNhdChbemVyb3MsIGJ1Zl0pXHJcbiAgfVxyXG4gIGlmICghZW5jKSB7XHJcbiAgICByZXR1cm4gYnVmXHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBidWYudG9TdHJpbmcoZW5jKVxyXG4gIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9