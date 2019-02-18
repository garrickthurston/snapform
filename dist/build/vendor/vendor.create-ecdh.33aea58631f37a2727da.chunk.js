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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3JlYXRlLWVjZGgvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw2REFBZSxtQkFBTyxDQUFDLHNCQUFVO0FBQ2pDLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTzs7QUFFeEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmNyZWF0ZS1lY2RoLjMzYWVhNTg2MzFmMzdhMjcyN2RhLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVsbGlwdGljID0gcmVxdWlyZSgnZWxsaXB0aWMnKVxudmFyIEJOID0gcmVxdWlyZSgnYm4uanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVDREggKGN1cnZlKSB7XG4gIHJldHVybiBuZXcgRUNESChjdXJ2ZSlcbn1cblxudmFyIGFsaWFzZXMgPSB7XG4gIHNlY3AyNTZrMToge1xuICAgIG5hbWU6ICdzZWNwMjU2azEnLFxuICAgIGJ5dGVMZW5ndGg6IDMyXG4gIH0sXG4gIHNlY3AyMjRyMToge1xuICAgIG5hbWU6ICdwMjI0JyxcbiAgICBieXRlTGVuZ3RoOiAyOFxuICB9LFxuICBwcmltZTI1NnYxOiB7XG4gICAgbmFtZTogJ3AyNTYnLFxuICAgIGJ5dGVMZW5ndGg6IDMyXG4gIH0sXG4gIHByaW1lMTkydjE6IHtcbiAgICBuYW1lOiAncDE5MicsXG4gICAgYnl0ZUxlbmd0aDogMjRcbiAgfSxcbiAgZWQyNTUxOToge1xuICAgIG5hbWU6ICdlZDI1NTE5JyxcbiAgICBieXRlTGVuZ3RoOiAzMlxuICB9LFxuICBzZWNwMzg0cjE6IHtcbiAgICBuYW1lOiAncDM4NCcsXG4gICAgYnl0ZUxlbmd0aDogNDhcbiAgfSxcbiAgc2VjcDUyMXIxOiB7XG4gICAgbmFtZTogJ3A1MjEnLFxuICAgIGJ5dGVMZW5ndGg6IDY2XG4gIH1cbn1cblxuYWxpYXNlcy5wMjI0ID0gYWxpYXNlcy5zZWNwMjI0cjFcbmFsaWFzZXMucDI1NiA9IGFsaWFzZXMuc2VjcDI1NnIxID0gYWxpYXNlcy5wcmltZTI1NnYxXG5hbGlhc2VzLnAxOTIgPSBhbGlhc2VzLnNlY3AxOTJyMSA9IGFsaWFzZXMucHJpbWUxOTJ2MVxuYWxpYXNlcy5wMzg0ID0gYWxpYXNlcy5zZWNwMzg0cjFcbmFsaWFzZXMucDUyMSA9IGFsaWFzZXMuc2VjcDUyMXIxXG5cbmZ1bmN0aW9uIEVDREggKGN1cnZlKSB7XG4gIHRoaXMuY3VydmVUeXBlID0gYWxpYXNlc1tjdXJ2ZV1cbiAgaWYgKCF0aGlzLmN1cnZlVHlwZSkge1xuICAgIHRoaXMuY3VydmVUeXBlID0ge1xuICAgICAgbmFtZTogY3VydmVcbiAgICB9XG4gIH1cbiAgdGhpcy5jdXJ2ZSA9IG5ldyBlbGxpcHRpYy5lYyh0aGlzLmN1cnZlVHlwZS5uYW1lKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5ldy1jYXBcbiAgdGhpcy5rZXlzID0gdm9pZCAwXG59XG5cbkVDREgucHJvdG90eXBlLmdlbmVyYXRlS2V5cyA9IGZ1bmN0aW9uIChlbmMsIGZvcm1hdCkge1xuICB0aGlzLmtleXMgPSB0aGlzLmN1cnZlLmdlbktleVBhaXIoKVxuICByZXR1cm4gdGhpcy5nZXRQdWJsaWNLZXkoZW5jLCBmb3JtYXQpXG59XG5cbkVDREgucHJvdG90eXBlLmNvbXB1dGVTZWNyZXQgPSBmdW5jdGlvbiAob3RoZXIsIGluZW5jLCBlbmMpIHtcbiAgaW5lbmMgPSBpbmVuYyB8fCAndXRmOCdcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIob3RoZXIpKSB7XG4gICAgb3RoZXIgPSBuZXcgQnVmZmVyKG90aGVyLCBpbmVuYylcbiAgfVxuICB2YXIgb3RoZXJQdWIgPSB0aGlzLmN1cnZlLmtleUZyb21QdWJsaWMob3RoZXIpLmdldFB1YmxpYygpXG4gIHZhciBvdXQgPSBvdGhlclB1Yi5tdWwodGhpcy5rZXlzLmdldFByaXZhdGUoKSkuZ2V0WCgpXG4gIHJldHVybiBmb3JtYXRSZXR1cm5WYWx1ZShvdXQsIGVuYywgdGhpcy5jdXJ2ZVR5cGUuYnl0ZUxlbmd0aClcbn1cblxuRUNESC5wcm90b3R5cGUuZ2V0UHVibGljS2V5ID0gZnVuY3Rpb24gKGVuYywgZm9ybWF0KSB7XG4gIHZhciBrZXkgPSB0aGlzLmtleXMuZ2V0UHVibGljKGZvcm1hdCA9PT0gJ2NvbXByZXNzZWQnLCB0cnVlKVxuICBpZiAoZm9ybWF0ID09PSAnaHlicmlkJykge1xuICAgIGlmIChrZXlba2V5Lmxlbmd0aCAtIDFdICUgMikge1xuICAgICAga2V5WzBdID0gN1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXlbMF0gPSA2XG4gICAgfVxuICB9XG4gIHJldHVybiBmb3JtYXRSZXR1cm5WYWx1ZShrZXksIGVuYylcbn1cblxuRUNESC5wcm90b3R5cGUuZ2V0UHJpdmF0ZUtleSA9IGZ1bmN0aW9uIChlbmMpIHtcbiAgcmV0dXJuIGZvcm1hdFJldHVyblZhbHVlKHRoaXMua2V5cy5nZXRQcml2YXRlKCksIGVuYylcbn1cblxuRUNESC5wcm90b3R5cGUuc2V0UHVibGljS2V5ID0gZnVuY3Rpb24gKHB1YiwgZW5jKSB7XG4gIGVuYyA9IGVuYyB8fCAndXRmOCdcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIocHViKSkge1xuICAgIHB1YiA9IG5ldyBCdWZmZXIocHViLCBlbmMpXG4gIH1cbiAgdGhpcy5rZXlzLl9pbXBvcnRQdWJsaWMocHViKVxuICByZXR1cm4gdGhpc1xufVxuXG5FQ0RILnByb3RvdHlwZS5zZXRQcml2YXRlS2V5ID0gZnVuY3Rpb24gKHByaXYsIGVuYykge1xuICBlbmMgPSBlbmMgfHwgJ3V0ZjgnXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHByaXYpKSB7XG4gICAgcHJpdiA9IG5ldyBCdWZmZXIocHJpdiwgZW5jKVxuICB9XG5cbiAgdmFyIF9wcml2ID0gbmV3IEJOKHByaXYpXG4gIF9wcml2ID0gX3ByaXYudG9TdHJpbmcoMTYpXG4gIHRoaXMua2V5cyA9IHRoaXMuY3VydmUuZ2VuS2V5UGFpcigpXG4gIHRoaXMua2V5cy5faW1wb3J0UHJpdmF0ZShfcHJpdilcbiAgcmV0dXJuIHRoaXNcbn1cblxuZnVuY3Rpb24gZm9ybWF0UmV0dXJuVmFsdWUgKGJuLCBlbmMsIGxlbikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoYm4pKSB7XG4gICAgYm4gPSBibi50b0FycmF5KClcbiAgfVxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcihibilcbiAgaWYgKGxlbiAmJiBidWYubGVuZ3RoIDwgbGVuKSB7XG4gICAgdmFyIHplcm9zID0gbmV3IEJ1ZmZlcihsZW4gLSBidWYubGVuZ3RoKVxuICAgIHplcm9zLmZpbGwoMClcbiAgICBidWYgPSBCdWZmZXIuY29uY2F0KFt6ZXJvcywgYnVmXSlcbiAgfVxuICBpZiAoIWVuYykge1xuICAgIHJldHVybiBidWZcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYnVmLnRvU3RyaW5nKGVuYylcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==