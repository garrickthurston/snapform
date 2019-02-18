(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.sha.js"],{

/***/ "CH9F":
/*!************************************!*\
  !*** ./node_modules/sha.js/sha.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-0, as defined
 * in FIPS PUB 180-1
 * This source code is derived from sha1.js of the same repository.
 * The difference between SHA-0 and SHA-1 is just a bitwise rotate left
 * operation was added.
 */

var inherits = __webpack_require__(/*! inherits */ "P7XM")
var Hash = __webpack_require__(/*! ./hash */ "tnIz")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

var K = [
  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
]

var W = new Array(80)

function Sha () {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha, Hash)

Sha.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl5 (num) {
  return (num << 5) | (num >>> 27)
}

function rotl30 (num) {
  return (num << 30) | (num >>> 2)
}

function ft (s, b, c, d) {
  if (s === 0) return (b & c) | ((~b) & d)
  if (s === 2) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}

Sha.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20)
    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha.prototype._hash = function () {
  var H = Buffer.allocUnsafe(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha


/***/ }),

/***/ "T9HO":
/*!***************************************!*\
  !*** ./node_modules/sha.js/sha512.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(/*! inherits */ "P7XM")
var Hash = __webpack_require__(/*! ./hash */ "tnIz")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
]

var W = new Array(160)

function Sha512 () {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha512, Hash)

Sha512.prototype.init = function () {
  this._ah = 0x6a09e667
  this._bh = 0xbb67ae85
  this._ch = 0x3c6ef372
  this._dh = 0xa54ff53a
  this._eh = 0x510e527f
  this._fh = 0x9b05688c
  this._gh = 0x1f83d9ab
  this._hh = 0x5be0cd19

  this._al = 0xf3bcc908
  this._bl = 0x84caa73b
  this._cl = 0xfe94f82b
  this._dl = 0x5f1d36f1
  this._el = 0xade682d1
  this._fl = 0x2b3e6c1f
  this._gl = 0xfb41bd6b
  this._hl = 0x137e2179

  return this
}

function Ch (x, y, z) {
  return z ^ (x & (y ^ z))
}

function maj (x, y, z) {
  return (x & y) | (z & (x | y))
}

function sigma0 (x, xl) {
  return (x >>> 28 | xl << 4) ^ (xl >>> 2 | x << 30) ^ (xl >>> 7 | x << 25)
}

function sigma1 (x, xl) {
  return (x >>> 14 | xl << 18) ^ (x >>> 18 | xl << 14) ^ (xl >>> 9 | x << 23)
}

function Gamma0 (x, xl) {
  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7)
}

function Gamma0l (x, xl) {
  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7 | xl << 25)
}

function Gamma1 (x, xl) {
  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6)
}

function Gamma1l (x, xl) {
  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6 | xl << 26)
}

function getCarry (a, b) {
  return (a >>> 0) < (b >>> 0) ? 1 : 0
}

Sha512.prototype._update = function (M) {
  var W = this._w

  var ah = this._ah | 0
  var bh = this._bh | 0
  var ch = this._ch | 0
  var dh = this._dh | 0
  var eh = this._eh | 0
  var fh = this._fh | 0
  var gh = this._gh | 0
  var hh = this._hh | 0

  var al = this._al | 0
  var bl = this._bl | 0
  var cl = this._cl | 0
  var dl = this._dl | 0
  var el = this._el | 0
  var fl = this._fl | 0
  var gl = this._gl | 0
  var hl = this._hl | 0

  for (var i = 0; i < 32; i += 2) {
    W[i] = M.readInt32BE(i * 4)
    W[i + 1] = M.readInt32BE(i * 4 + 4)
  }
  for (; i < 160; i += 2) {
    var xh = W[i - 15 * 2]
    var xl = W[i - 15 * 2 + 1]
    var gamma0 = Gamma0(xh, xl)
    var gamma0l = Gamma0l(xl, xh)

    xh = W[i - 2 * 2]
    xl = W[i - 2 * 2 + 1]
    var gamma1 = Gamma1(xh, xl)
    var gamma1l = Gamma1l(xl, xh)

    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
    var Wi7h = W[i - 7 * 2]
    var Wi7l = W[i - 7 * 2 + 1]

    var Wi16h = W[i - 16 * 2]
    var Wi16l = W[i - 16 * 2 + 1]

    var Wil = (gamma0l + Wi7l) | 0
    var Wih = (gamma0 + Wi7h + getCarry(Wil, gamma0l)) | 0
    Wil = (Wil + gamma1l) | 0
    Wih = (Wih + gamma1 + getCarry(Wil, gamma1l)) | 0
    Wil = (Wil + Wi16l) | 0
    Wih = (Wih + Wi16h + getCarry(Wil, Wi16l)) | 0

    W[i] = Wih
    W[i + 1] = Wil
  }

  for (var j = 0; j < 160; j += 2) {
    Wih = W[j]
    Wil = W[j + 1]

    var majh = maj(ah, bh, ch)
    var majl = maj(al, bl, cl)

    var sigma0h = sigma0(ah, al)
    var sigma0l = sigma0(al, ah)
    var sigma1h = sigma1(eh, el)
    var sigma1l = sigma1(el, eh)

    // t1 = h + sigma1 + ch + K[j] + W[j]
    var Kih = K[j]
    var Kil = K[j + 1]

    var chh = Ch(eh, fh, gh)
    var chl = Ch(el, fl, gl)

    var t1l = (hl + sigma1l) | 0
    var t1h = (hh + sigma1h + getCarry(t1l, hl)) | 0
    t1l = (t1l + chl) | 0
    t1h = (t1h + chh + getCarry(t1l, chl)) | 0
    t1l = (t1l + Kil) | 0
    t1h = (t1h + Kih + getCarry(t1l, Kil)) | 0
    t1l = (t1l + Wil) | 0
    t1h = (t1h + Wih + getCarry(t1l, Wil)) | 0

    // t2 = sigma0 + maj
    var t2l = (sigma0l + majl) | 0
    var t2h = (sigma0h + majh + getCarry(t2l, sigma0l)) | 0

    hh = gh
    hl = gl
    gh = fh
    gl = fl
    fh = eh
    fl = el
    el = (dl + t1l) | 0
    eh = (dh + t1h + getCarry(el, dl)) | 0
    dh = ch
    dl = cl
    ch = bh
    cl = bl
    bh = ah
    bl = al
    al = (t1l + t2l) | 0
    ah = (t1h + t2h + getCarry(al, t1l)) | 0
  }

  this._al = (this._al + al) | 0
  this._bl = (this._bl + bl) | 0
  this._cl = (this._cl + cl) | 0
  this._dl = (this._dl + dl) | 0
  this._el = (this._el + el) | 0
  this._fl = (this._fl + fl) | 0
  this._gl = (this._gl + gl) | 0
  this._hl = (this._hl + hl) | 0

  this._ah = (this._ah + ah + getCarry(this._al, al)) | 0
  this._bh = (this._bh + bh + getCarry(this._bl, bl)) | 0
  this._ch = (this._ch + ch + getCarry(this._cl, cl)) | 0
  this._dh = (this._dh + dh + getCarry(this._dl, dl)) | 0
  this._eh = (this._eh + eh + getCarry(this._el, el)) | 0
  this._fh = (this._fh + fh + getCarry(this._fl, fl)) | 0
  this._gh = (this._gh + gh + getCarry(this._gl, gl)) | 0
  this._hh = (this._hh + hh + getCarry(this._hl, hl)) | 0
}

Sha512.prototype._hash = function () {
  var H = Buffer.allocUnsafe(64)

  function writeInt64BE (h, l, offset) {
    H.writeInt32BE(h, offset)
    H.writeInt32BE(l, offset + 4)
  }

  writeInt64BE(this._ah, this._al, 0)
  writeInt64BE(this._bh, this._bl, 8)
  writeInt64BE(this._ch, this._cl, 16)
  writeInt64BE(this._dh, this._dl, 24)
  writeInt64BE(this._eh, this._el, 32)
  writeInt64BE(this._fh, this._fl, 40)
  writeInt64BE(this._gh, this._gl, 48)
  writeInt64BE(this._hh, this._hl, 56)

  return H
}

module.exports = Sha512


/***/ }),

/***/ "afKu":
/*!**************************************!*\
  !*** ./node_modules/sha.js/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var exports = module.exports = function SHA (algorithm) {
  algorithm = algorithm.toLowerCase()

  var Algorithm = exports[algorithm]
  if (!Algorithm) throw new Error(algorithm + ' is not supported (we accept pull requests)')

  return new Algorithm()
}

exports.sha = __webpack_require__(/*! ./sha */ "CH9F")
exports.sha1 = __webpack_require__(/*! ./sha1 */ "fnjI")
exports.sha224 = __webpack_require__(/*! ./sha224 */ "cqoG")
exports.sha256 = __webpack_require__(/*! ./sha256 */ "olUY")
exports.sha384 = __webpack_require__(/*! ./sha384 */ "uDfV")
exports.sha512 = __webpack_require__(/*! ./sha512 */ "T9HO")


/***/ }),

/***/ "cqoG":
/*!***************************************!*\
  !*** ./node_modules/sha.js/sha224.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var inherits = __webpack_require__(/*! inherits */ "P7XM")
var Sha256 = __webpack_require__(/*! ./sha256 */ "olUY")
var Hash = __webpack_require__(/*! ./hash */ "tnIz")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

var W = new Array(64)

function Sha224 () {
  this.init()

  this._w = W // new Array(64)

  Hash.call(this, 64, 56)
}

inherits(Sha224, Sha256)

Sha224.prototype.init = function () {
  this._a = 0xc1059ed8
  this._b = 0x367cd507
  this._c = 0x3070dd17
  this._d = 0xf70e5939
  this._e = 0xffc00b31
  this._f = 0x68581511
  this._g = 0x64f98fa7
  this._h = 0xbefa4fa4

  return this
}

Sha224.prototype._hash = function () {
  var H = Buffer.allocUnsafe(28)

  H.writeInt32BE(this._a, 0)
  H.writeInt32BE(this._b, 4)
  H.writeInt32BE(this._c, 8)
  H.writeInt32BE(this._d, 12)
  H.writeInt32BE(this._e, 16)
  H.writeInt32BE(this._f, 20)
  H.writeInt32BE(this._g, 24)

  return H
}

module.exports = Sha224


/***/ }),

/***/ "fnjI":
/*!*************************************!*\
  !*** ./node_modules/sha.js/sha1.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var inherits = __webpack_require__(/*! inherits */ "P7XM")
var Hash = __webpack_require__(/*! ./hash */ "tnIz")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

var K = [
  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
]

var W = new Array(80)

function Sha1 () {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha1, Hash)

Sha1.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl1 (num) {
  return (num << 1) | (num >>> 31)
}

function rotl5 (num) {
  return (num << 5) | (num >>> 27)
}

function rotl30 (num) {
  return (num << 30) | (num >>> 2)
}

function ft (s, b, c, d) {
  if (s === 0) return (b & c) | ((~b) & d)
  if (s === 2) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}

Sha1.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16])

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20)
    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha1.prototype._hash = function () {
  var H = Buffer.allocUnsafe(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha1


/***/ }),

/***/ "olUY":
/*!***************************************!*\
  !*** ./node_modules/sha.js/sha256.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var inherits = __webpack_require__(/*! inherits */ "P7XM")
var Hash = __webpack_require__(/*! ./hash */ "tnIz")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

var K = [
  0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
  0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
  0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
  0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
  0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
  0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
  0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
  0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
  0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
  0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
  0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
  0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
  0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
  0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
  0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
  0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
]

var W = new Array(64)

function Sha256 () {
  this.init()

  this._w = W // new Array(64)

  Hash.call(this, 64, 56)
}

inherits(Sha256, Hash)

Sha256.prototype.init = function () {
  this._a = 0x6a09e667
  this._b = 0xbb67ae85
  this._c = 0x3c6ef372
  this._d = 0xa54ff53a
  this._e = 0x510e527f
  this._f = 0x9b05688c
  this._g = 0x1f83d9ab
  this._h = 0x5be0cd19

  return this
}

function ch (x, y, z) {
  return z ^ (x & (y ^ z))
}

function maj (x, y, z) {
  return (x & y) | (z & (x | y))
}

function sigma0 (x) {
  return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10)
}

function sigma1 (x) {
  return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7)
}

function gamma0 (x) {
  return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ (x >>> 3)
}

function gamma1 (x) {
  return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ (x >>> 10)
}

Sha256.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0
  var f = this._f | 0
  var g = this._g | 0
  var h = this._h | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 64; ++i) W[i] = (gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16]) | 0

  for (var j = 0; j < 64; ++j) {
    var T1 = (h + sigma1(e) + ch(e, f, g) + K[j] + W[j]) | 0
    var T2 = (sigma0(a) + maj(a, b, c)) | 0

    h = g
    g = f
    f = e
    e = (d + T1) | 0
    d = c
    c = b
    b = a
    a = (T1 + T2) | 0
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
  this._f = (f + this._f) | 0
  this._g = (g + this._g) | 0
  this._h = (h + this._h) | 0
}

Sha256.prototype._hash = function () {
  var H = Buffer.allocUnsafe(32)

  H.writeInt32BE(this._a, 0)
  H.writeInt32BE(this._b, 4)
  H.writeInt32BE(this._c, 8)
  H.writeInt32BE(this._d, 12)
  H.writeInt32BE(this._e, 16)
  H.writeInt32BE(this._f, 20)
  H.writeInt32BE(this._g, 24)
  H.writeInt32BE(this._h, 28)

  return H
}

module.exports = Sha256


/***/ }),

/***/ "tnIz":
/*!*************************************!*\
  !*** ./node_modules/sha.js/hash.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

// prototype class for hash functions
function Hash (blockSize, finalSize) {
  this._block = Buffer.alloc(blockSize)
  this._finalSize = finalSize
  this._blockSize = blockSize
  this._len = 0
}

Hash.prototype.update = function (data, enc) {
  if (typeof data === 'string') {
    enc = enc || 'utf8'
    data = Buffer.from(data, enc)
  }

  var block = this._block
  var blockSize = this._blockSize
  var length = data.length
  var accum = this._len

  for (var offset = 0; offset < length;) {
    var assigned = accum % blockSize
    var remainder = Math.min(length - offset, blockSize - assigned)

    for (var i = 0; i < remainder; i++) {
      block[assigned + i] = data[offset + i]
    }

    accum += remainder
    offset += remainder

    if ((accum % blockSize) === 0) {
      this._update(block)
    }
  }

  this._len += length
  return this
}

Hash.prototype.digest = function (enc) {
  var rem = this._len % this._blockSize

  this._block[rem] = 0x80

  // zero (rem + 1) trailing bits, where (rem + 1) is the smallest
  // non-negative solution to the equation (length + 1 + (rem + 1)) === finalSize mod blockSize
  this._block.fill(0, rem + 1)

  if (rem >= this._finalSize) {
    this._update(this._block)
    this._block.fill(0)
  }

  var bits = this._len * 8

  // uint32
  if (bits <= 0xffffffff) {
    this._block.writeUInt32BE(bits, this._blockSize - 4)

  // uint64
  } else {
    var lowBits = (bits & 0xffffffff) >>> 0
    var highBits = (bits - lowBits) / 0x100000000

    this._block.writeUInt32BE(highBits, this._blockSize - 8)
    this._block.writeUInt32BE(lowBits, this._blockSize - 4)
  }

  this._update(this._block)
  var hash = this._hash()

  return enc ? hash.toString(enc) : hash
}

Hash.prototype._update = function () {
  throw new Error('_update must be implemented by subclass')
}

module.exports = Hash


/***/ }),

/***/ "uDfV":
/*!***************************************!*\
  !*** ./node_modules/sha.js/sha384.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(/*! inherits */ "P7XM")
var SHA512 = __webpack_require__(/*! ./sha512 */ "T9HO")
var Hash = __webpack_require__(/*! ./hash */ "tnIz")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

var W = new Array(160)

function Sha384 () {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha384, SHA512)

Sha384.prototype.init = function () {
  this._ah = 0xcbbb9d5d
  this._bh = 0x629a292a
  this._ch = 0x9159015a
  this._dh = 0x152fecd8
  this._eh = 0x67332667
  this._fh = 0x8eb44a87
  this._gh = 0xdb0c2e0d
  this._hh = 0x47b5481d

  this._al = 0xc1059ed8
  this._bl = 0x367cd507
  this._cl = 0x3070dd17
  this._dl = 0xf70e5939
  this._el = 0xffc00b31
  this._fl = 0x68581511
  this._gl = 0x64f98fa7
  this._hl = 0xbefa4fa4

  return this
}

Sha384.prototype._hash = function () {
  var H = Buffer.allocUnsafe(48)

  function writeInt64BE (h, l, offset) {
    H.writeInt32BE(h, offset)
    H.writeInt32BE(l, offset + 4)
  }

  writeInt64BE(this._ah, this._al, 0)
  writeInt64BE(this._bh, this._bl, 8)
  writeInt64BE(this._ch, this._cl, 16)
  writeInt64BE(this._dh, this._dl, 24)
  writeInt64BE(this._eh, this._el, 32)
  writeInt64BE(this._fh, this._fl, 40)

  return H
}

module.exports = Sha384


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hhLmpzL3NoYS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hhLmpzL3NoYTUxMi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hhLmpzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaGEuanMvc2hhMjI0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaGEuanMvc2hhMS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hhLmpzL3NoYTI1Ni5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hhLmpzL2hhc2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NoYS5qcy9zaGEzODQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZSxtQkFBTyxDQUFDLHNCQUFVO0FBQ2pDLFdBQVcsbUJBQU8sQ0FBQyxvQkFBUTtBQUMzQixhQUFhLG1CQUFPLENBQUMseUJBQWE7O0FBRWxDO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixRQUFRO0FBQ3pCLFFBQVEsUUFBUTs7QUFFaEIsaUJBQWlCLFFBQVE7QUFDekI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVB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O0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3Iuc2hhLmpzLjlhMzI4YjdjNTNkNmUwN2YxODY0LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgU2VjdXJlIEhhc2ggQWxnb3JpdGhtLCBTSEEtMCwgYXMgZGVmaW5lZFxuICogaW4gRklQUyBQVUIgMTgwLTFcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgZGVyaXZlZCBmcm9tIHNoYTEuanMgb2YgdGhlIHNhbWUgcmVwb3NpdG9yeS5cbiAqIFRoZSBkaWZmZXJlbmNlIGJldHdlZW4gU0hBLTAgYW5kIFNIQS0xIGlzIGp1c3QgYSBiaXR3aXNlIHJvdGF0ZSBsZWZ0XG4gKiBvcGVyYXRpb24gd2FzIGFkZGVkLlxuICovXG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBIYXNoID0gcmVxdWlyZSgnLi9oYXNoJylcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxuXG52YXIgSyA9IFtcbiAgMHg1YTgyNzk5OSwgMHg2ZWQ5ZWJhMSwgMHg4ZjFiYmNkYyB8IDAsIDB4Y2E2MmMxZDYgfCAwXG5dXG5cbnZhciBXID0gbmV3IEFycmF5KDgwKVxuXG5mdW5jdGlvbiBTaGEgKCkge1xuICB0aGlzLmluaXQoKVxuICB0aGlzLl93ID0gV1xuXG4gIEhhc2guY2FsbCh0aGlzLCA2NCwgNTYpXG59XG5cbmluaGVyaXRzKFNoYSwgSGFzaClcblxuU2hhLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9hID0gMHg2NzQ1MjMwMVxuICB0aGlzLl9iID0gMHhlZmNkYWI4OVxuICB0aGlzLl9jID0gMHg5OGJhZGNmZVxuICB0aGlzLl9kID0gMHgxMDMyNTQ3NlxuICB0aGlzLl9lID0gMHhjM2QyZTFmMFxuXG4gIHJldHVybiB0aGlzXG59XG5cbmZ1bmN0aW9uIHJvdGw1IChudW0pIHtcbiAgcmV0dXJuIChudW0gPDwgNSkgfCAobnVtID4+PiAyNylcbn1cblxuZnVuY3Rpb24gcm90bDMwIChudW0pIHtcbiAgcmV0dXJuIChudW0gPDwgMzApIHwgKG51bSA+Pj4gMilcbn1cblxuZnVuY3Rpb24gZnQgKHMsIGIsIGMsIGQpIHtcbiAgaWYgKHMgPT09IDApIHJldHVybiAoYiAmIGMpIHwgKCh+YikgJiBkKVxuICBpZiAocyA9PT0gMikgcmV0dXJuIChiICYgYykgfCAoYiAmIGQpIHwgKGMgJiBkKVxuICByZXR1cm4gYiBeIGMgXiBkXG59XG5cblNoYS5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChNKSB7XG4gIHZhciBXID0gdGhpcy5fd1xuXG4gIHZhciBhID0gdGhpcy5fYSB8IDBcbiAgdmFyIGIgPSB0aGlzLl9iIHwgMFxuICB2YXIgYyA9IHRoaXMuX2MgfCAwXG4gIHZhciBkID0gdGhpcy5fZCB8IDBcbiAgdmFyIGUgPSB0aGlzLl9lIHwgMFxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7ICsraSkgV1tpXSA9IE0ucmVhZEludDMyQkUoaSAqIDQpXG4gIGZvciAoOyBpIDwgODA7ICsraSkgV1tpXSA9IFdbaSAtIDNdIF4gV1tpIC0gOF0gXiBXW2kgLSAxNF0gXiBXW2kgLSAxNl1cblxuICBmb3IgKHZhciBqID0gMDsgaiA8IDgwOyArK2opIHtcbiAgICB2YXIgcyA9IH5+KGogLyAyMClcbiAgICB2YXIgdCA9IChyb3RsNShhKSArIGZ0KHMsIGIsIGMsIGQpICsgZSArIFdbal0gKyBLW3NdKSB8IDBcblxuICAgIGUgPSBkXG4gICAgZCA9IGNcbiAgICBjID0gcm90bDMwKGIpXG4gICAgYiA9IGFcbiAgICBhID0gdFxuICB9XG5cbiAgdGhpcy5fYSA9IChhICsgdGhpcy5fYSkgfCAwXG4gIHRoaXMuX2IgPSAoYiArIHRoaXMuX2IpIHwgMFxuICB0aGlzLl9jID0gKGMgKyB0aGlzLl9jKSB8IDBcbiAgdGhpcy5fZCA9IChkICsgdGhpcy5fZCkgfCAwXG4gIHRoaXMuX2UgPSAoZSArIHRoaXMuX2UpIHwgMFxufVxuXG5TaGEucHJvdG90eXBlLl9oYXNoID0gZnVuY3Rpb24gKCkge1xuICB2YXIgSCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgyMClcblxuICBILndyaXRlSW50MzJCRSh0aGlzLl9hIHwgMCwgMClcbiAgSC53cml0ZUludDMyQkUodGhpcy5fYiB8IDAsIDQpXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2MgfCAwLCA4KVxuICBILndyaXRlSW50MzJCRSh0aGlzLl9kIHwgMCwgMTIpXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2UgfCAwLCAxNilcblxuICByZXR1cm4gSFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYVxuIiwidmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxudmFyIEhhc2ggPSByZXF1aXJlKCcuL2hhc2gnKVxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG5cbnZhciBLID0gW1xuICAweDQyOGEyZjk4LCAweGQ3MjhhZTIyLCAweDcxMzc0NDkxLCAweDIzZWY2NWNkLFxuICAweGI1YzBmYmNmLCAweGVjNGQzYjJmLCAweGU5YjVkYmE1LCAweDgxODlkYmJjLFxuICAweDM5NTZjMjViLCAweGYzNDhiNTM4LCAweDU5ZjExMWYxLCAweGI2MDVkMDE5LFxuICAweDkyM2Y4MmE0LCAweGFmMTk0ZjliLCAweGFiMWM1ZWQ1LCAweGRhNmQ4MTE4LFxuICAweGQ4MDdhYTk4LCAweGEzMDMwMjQyLCAweDEyODM1YjAxLCAweDQ1NzA2ZmJlLFxuICAweDI0MzE4NWJlLCAweDRlZTRiMjhjLCAweDU1MGM3ZGMzLCAweGQ1ZmZiNGUyLFxuICAweDcyYmU1ZDc0LCAweGYyN2I4OTZmLCAweDgwZGViMWZlLCAweDNiMTY5NmIxLFxuICAweDliZGMwNmE3LCAweDI1YzcxMjM1LCAweGMxOWJmMTc0LCAweGNmNjkyNjk0LFxuICAweGU0OWI2OWMxLCAweDllZjE0YWQyLCAweGVmYmU0Nzg2LCAweDM4NGYyNWUzLFxuICAweDBmYzE5ZGM2LCAweDhiOGNkNWI1LCAweDI0MGNhMWNjLCAweDc3YWM5YzY1LFxuICAweDJkZTkyYzZmLCAweDU5MmIwMjc1LCAweDRhNzQ4NGFhLCAweDZlYTZlNDgzLFxuICAweDVjYjBhOWRjLCAweGJkNDFmYmQ0LCAweDc2Zjk4OGRhLCAweDgzMTE1M2I1LFxuICAweDk4M2U1MTUyLCAweGVlNjZkZmFiLCAweGE4MzFjNjZkLCAweDJkYjQzMjEwLFxuICAweGIwMDMyN2M4LCAweDk4ZmIyMTNmLCAweGJmNTk3ZmM3LCAweGJlZWYwZWU0LFxuICAweGM2ZTAwYmYzLCAweDNkYTg4ZmMyLCAweGQ1YTc5MTQ3LCAweDkzMGFhNzI1LFxuICAweDA2Y2E2MzUxLCAweGUwMDM4MjZmLCAweDE0MjkyOTY3LCAweDBhMGU2ZTcwLFxuICAweDI3YjcwYTg1LCAweDQ2ZDIyZmZjLCAweDJlMWIyMTM4LCAweDVjMjZjOTI2LFxuICAweDRkMmM2ZGZjLCAweDVhYzQyYWVkLCAweDUzMzgwZDEzLCAweDlkOTViM2RmLFxuICAweDY1MGE3MzU0LCAweDhiYWY2M2RlLCAweDc2NmEwYWJiLCAweDNjNzdiMmE4LFxuICAweDgxYzJjOTJlLCAweDQ3ZWRhZWU2LCAweDkyNzIyYzg1LCAweDE0ODIzNTNiLFxuICAweGEyYmZlOGExLCAweDRjZjEwMzY0LCAweGE4MWE2NjRiLCAweGJjNDIzMDAxLFxuICAweGMyNGI4YjcwLCAweGQwZjg5NzkxLCAweGM3NmM1MWEzLCAweDA2NTRiZTMwLFxuICAweGQxOTJlODE5LCAweGQ2ZWY1MjE4LCAweGQ2OTkwNjI0LCAweDU1NjVhOTEwLFxuICAweGY0MGUzNTg1LCAweDU3NzEyMDJhLCAweDEwNmFhMDcwLCAweDMyYmJkMWI4LFxuICAweDE5YTRjMTE2LCAweGI4ZDJkMGM4LCAweDFlMzc2YzA4LCAweDUxNDFhYjUzLFxuICAweDI3NDg3NzRjLCAweGRmOGVlYjk5LCAweDM0YjBiY2I1LCAweGUxOWI0OGE4LFxuICAweDM5MWMwY2IzLCAweGM1Yzk1YTYzLCAweDRlZDhhYTRhLCAweGUzNDE4YWNiLFxuICAweDViOWNjYTRmLCAweDc3NjNlMzczLCAweDY4MmU2ZmYzLCAweGQ2YjJiOGEzLFxuICAweDc0OGY4MmVlLCAweDVkZWZiMmZjLCAweDc4YTU2MzZmLCAweDQzMTcyZjYwLFxuICAweDg0Yzg3ODE0LCAweGExZjBhYjcyLCAweDhjYzcwMjA4LCAweDFhNjQzOWVjLFxuICAweDkwYmVmZmZhLCAweDIzNjMxZTI4LCAweGE0NTA2Y2ViLCAweGRlODJiZGU5LFxuICAweGJlZjlhM2Y3LCAweGIyYzY3OTE1LCAweGM2NzE3OGYyLCAweGUzNzI1MzJiLFxuICAweGNhMjczZWNlLCAweGVhMjY2MTljLCAweGQxODZiOGM3LCAweDIxYzBjMjA3LFxuICAweGVhZGE3ZGQ2LCAweGNkZTBlYjFlLCAweGY1N2Q0ZjdmLCAweGVlNmVkMTc4LFxuICAweDA2ZjA2N2FhLCAweDcyMTc2ZmJhLCAweDBhNjM3ZGM1LCAweGEyYzg5OGE2LFxuICAweDExM2Y5ODA0LCAweGJlZjkwZGFlLCAweDFiNzEwYjM1LCAweDEzMWM0NzFiLFxuICAweDI4ZGI3N2Y1LCAweDIzMDQ3ZDg0LCAweDMyY2FhYjdiLCAweDQwYzcyNDkzLFxuICAweDNjOWViZTBhLCAweDE1YzliZWJjLCAweDQzMWQ2N2M0LCAweDljMTAwZDRjLFxuICAweDRjYzVkNGJlLCAweGNiM2U0MmI2LCAweDU5N2YyOTljLCAweGZjNjU3ZTJhLFxuICAweDVmY2I2ZmFiLCAweDNhZDZmYWVjLCAweDZjNDQxOThjLCAweDRhNDc1ODE3XG5dXG5cbnZhciBXID0gbmV3IEFycmF5KDE2MClcblxuZnVuY3Rpb24gU2hhNTEyICgpIHtcbiAgdGhpcy5pbml0KClcbiAgdGhpcy5fdyA9IFdcblxuICBIYXNoLmNhbGwodGhpcywgMTI4LCAxMTIpXG59XG5cbmluaGVyaXRzKFNoYTUxMiwgSGFzaClcblxuU2hhNTEyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9haCA9IDB4NmEwOWU2NjdcbiAgdGhpcy5fYmggPSAweGJiNjdhZTg1XG4gIHRoaXMuX2NoID0gMHgzYzZlZjM3MlxuICB0aGlzLl9kaCA9IDB4YTU0ZmY1M2FcbiAgdGhpcy5fZWggPSAweDUxMGU1MjdmXG4gIHRoaXMuX2ZoID0gMHg5YjA1Njg4Y1xuICB0aGlzLl9naCA9IDB4MWY4M2Q5YWJcbiAgdGhpcy5faGggPSAweDViZTBjZDE5XG5cbiAgdGhpcy5fYWwgPSAweGYzYmNjOTA4XG4gIHRoaXMuX2JsID0gMHg4NGNhYTczYlxuICB0aGlzLl9jbCA9IDB4ZmU5NGY4MmJcbiAgdGhpcy5fZGwgPSAweDVmMWQzNmYxXG4gIHRoaXMuX2VsID0gMHhhZGU2ODJkMVxuICB0aGlzLl9mbCA9IDB4MmIzZTZjMWZcbiAgdGhpcy5fZ2wgPSAweGZiNDFiZDZiXG4gIHRoaXMuX2hsID0gMHgxMzdlMjE3OVxuXG4gIHJldHVybiB0aGlzXG59XG5cbmZ1bmN0aW9uIENoICh4LCB5LCB6KSB7XG4gIHJldHVybiB6IF4gKHggJiAoeSBeIHopKVxufVxuXG5mdW5jdGlvbiBtYWogKHgsIHksIHopIHtcbiAgcmV0dXJuICh4ICYgeSkgfCAoeiAmICh4IHwgeSkpXG59XG5cbmZ1bmN0aW9uIHNpZ21hMCAoeCwgeGwpIHtcbiAgcmV0dXJuICh4ID4+PiAyOCB8IHhsIDw8IDQpIF4gKHhsID4+PiAyIHwgeCA8PCAzMCkgXiAoeGwgPj4+IDcgfCB4IDw8IDI1KVxufVxuXG5mdW5jdGlvbiBzaWdtYTEgKHgsIHhsKSB7XG4gIHJldHVybiAoeCA+Pj4gMTQgfCB4bCA8PCAxOCkgXiAoeCA+Pj4gMTggfCB4bCA8PCAxNCkgXiAoeGwgPj4+IDkgfCB4IDw8IDIzKVxufVxuXG5mdW5jdGlvbiBHYW1tYTAgKHgsIHhsKSB7XG4gIHJldHVybiAoeCA+Pj4gMSB8IHhsIDw8IDMxKSBeICh4ID4+PiA4IHwgeGwgPDwgMjQpIF4gKHggPj4+IDcpXG59XG5cbmZ1bmN0aW9uIEdhbW1hMGwgKHgsIHhsKSB7XG4gIHJldHVybiAoeCA+Pj4gMSB8IHhsIDw8IDMxKSBeICh4ID4+PiA4IHwgeGwgPDwgMjQpIF4gKHggPj4+IDcgfCB4bCA8PCAyNSlcbn1cblxuZnVuY3Rpb24gR2FtbWExICh4LCB4bCkge1xuICByZXR1cm4gKHggPj4+IDE5IHwgeGwgPDwgMTMpIF4gKHhsID4+PiAyOSB8IHggPDwgMykgXiAoeCA+Pj4gNilcbn1cblxuZnVuY3Rpb24gR2FtbWExbCAoeCwgeGwpIHtcbiAgcmV0dXJuICh4ID4+PiAxOSB8IHhsIDw8IDEzKSBeICh4bCA+Pj4gMjkgfCB4IDw8IDMpIF4gKHggPj4+IDYgfCB4bCA8PCAyNilcbn1cblxuZnVuY3Rpb24gZ2V0Q2FycnkgKGEsIGIpIHtcbiAgcmV0dXJuIChhID4+PiAwKSA8IChiID4+PiAwKSA/IDEgOiAwXG59XG5cblNoYTUxMi5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChNKSB7XG4gIHZhciBXID0gdGhpcy5fd1xuXG4gIHZhciBhaCA9IHRoaXMuX2FoIHwgMFxuICB2YXIgYmggPSB0aGlzLl9iaCB8IDBcbiAgdmFyIGNoID0gdGhpcy5fY2ggfCAwXG4gIHZhciBkaCA9IHRoaXMuX2RoIHwgMFxuICB2YXIgZWggPSB0aGlzLl9laCB8IDBcbiAgdmFyIGZoID0gdGhpcy5fZmggfCAwXG4gIHZhciBnaCA9IHRoaXMuX2doIHwgMFxuICB2YXIgaGggPSB0aGlzLl9oaCB8IDBcblxuICB2YXIgYWwgPSB0aGlzLl9hbCB8IDBcbiAgdmFyIGJsID0gdGhpcy5fYmwgfCAwXG4gIHZhciBjbCA9IHRoaXMuX2NsIHwgMFxuICB2YXIgZGwgPSB0aGlzLl9kbCB8IDBcbiAgdmFyIGVsID0gdGhpcy5fZWwgfCAwXG4gIHZhciBmbCA9IHRoaXMuX2ZsIHwgMFxuICB2YXIgZ2wgPSB0aGlzLl9nbCB8IDBcbiAgdmFyIGhsID0gdGhpcy5faGwgfCAwXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzMjsgaSArPSAyKSB7XG4gICAgV1tpXSA9IE0ucmVhZEludDMyQkUoaSAqIDQpXG4gICAgV1tpICsgMV0gPSBNLnJlYWRJbnQzMkJFKGkgKiA0ICsgNClcbiAgfVxuICBmb3IgKDsgaSA8IDE2MDsgaSArPSAyKSB7XG4gICAgdmFyIHhoID0gV1tpIC0gMTUgKiAyXVxuICAgIHZhciB4bCA9IFdbaSAtIDE1ICogMiArIDFdXG4gICAgdmFyIGdhbW1hMCA9IEdhbW1hMCh4aCwgeGwpXG4gICAgdmFyIGdhbW1hMGwgPSBHYW1tYTBsKHhsLCB4aClcblxuICAgIHhoID0gV1tpIC0gMiAqIDJdXG4gICAgeGwgPSBXW2kgLSAyICogMiArIDFdXG4gICAgdmFyIGdhbW1hMSA9IEdhbW1hMSh4aCwgeGwpXG4gICAgdmFyIGdhbW1hMWwgPSBHYW1tYTFsKHhsLCB4aClcblxuICAgIC8vIFdbaV0gPSBnYW1tYTAgKyBXW2kgLSA3XSArIGdhbW1hMSArIFdbaSAtIDE2XVxuICAgIHZhciBXaTdoID0gV1tpIC0gNyAqIDJdXG4gICAgdmFyIFdpN2wgPSBXW2kgLSA3ICogMiArIDFdXG5cbiAgICB2YXIgV2kxNmggPSBXW2kgLSAxNiAqIDJdXG4gICAgdmFyIFdpMTZsID0gV1tpIC0gMTYgKiAyICsgMV1cblxuICAgIHZhciBXaWwgPSAoZ2FtbWEwbCArIFdpN2wpIHwgMFxuICAgIHZhciBXaWggPSAoZ2FtbWEwICsgV2k3aCArIGdldENhcnJ5KFdpbCwgZ2FtbWEwbCkpIHwgMFxuICAgIFdpbCA9IChXaWwgKyBnYW1tYTFsKSB8IDBcbiAgICBXaWggPSAoV2loICsgZ2FtbWExICsgZ2V0Q2FycnkoV2lsLCBnYW1tYTFsKSkgfCAwXG4gICAgV2lsID0gKFdpbCArIFdpMTZsKSB8IDBcbiAgICBXaWggPSAoV2loICsgV2kxNmggKyBnZXRDYXJyeShXaWwsIFdpMTZsKSkgfCAwXG5cbiAgICBXW2ldID0gV2loXG4gICAgV1tpICsgMV0gPSBXaWxcbiAgfVxuXG4gIGZvciAodmFyIGogPSAwOyBqIDwgMTYwOyBqICs9IDIpIHtcbiAgICBXaWggPSBXW2pdXG4gICAgV2lsID0gV1tqICsgMV1cblxuICAgIHZhciBtYWpoID0gbWFqKGFoLCBiaCwgY2gpXG4gICAgdmFyIG1hamwgPSBtYWooYWwsIGJsLCBjbClcblxuICAgIHZhciBzaWdtYTBoID0gc2lnbWEwKGFoLCBhbClcbiAgICB2YXIgc2lnbWEwbCA9IHNpZ21hMChhbCwgYWgpXG4gICAgdmFyIHNpZ21hMWggPSBzaWdtYTEoZWgsIGVsKVxuICAgIHZhciBzaWdtYTFsID0gc2lnbWExKGVsLCBlaClcblxuICAgIC8vIHQxID0gaCArIHNpZ21hMSArIGNoICsgS1tqXSArIFdbal1cbiAgICB2YXIgS2loID0gS1tqXVxuICAgIHZhciBLaWwgPSBLW2ogKyAxXVxuXG4gICAgdmFyIGNoaCA9IENoKGVoLCBmaCwgZ2gpXG4gICAgdmFyIGNobCA9IENoKGVsLCBmbCwgZ2wpXG5cbiAgICB2YXIgdDFsID0gKGhsICsgc2lnbWExbCkgfCAwXG4gICAgdmFyIHQxaCA9IChoaCArIHNpZ21hMWggKyBnZXRDYXJyeSh0MWwsIGhsKSkgfCAwXG4gICAgdDFsID0gKHQxbCArIGNobCkgfCAwXG4gICAgdDFoID0gKHQxaCArIGNoaCArIGdldENhcnJ5KHQxbCwgY2hsKSkgfCAwXG4gICAgdDFsID0gKHQxbCArIEtpbCkgfCAwXG4gICAgdDFoID0gKHQxaCArIEtpaCArIGdldENhcnJ5KHQxbCwgS2lsKSkgfCAwXG4gICAgdDFsID0gKHQxbCArIFdpbCkgfCAwXG4gICAgdDFoID0gKHQxaCArIFdpaCArIGdldENhcnJ5KHQxbCwgV2lsKSkgfCAwXG5cbiAgICAvLyB0MiA9IHNpZ21hMCArIG1halxuICAgIHZhciB0MmwgPSAoc2lnbWEwbCArIG1hamwpIHwgMFxuICAgIHZhciB0MmggPSAoc2lnbWEwaCArIG1hamggKyBnZXRDYXJyeSh0MmwsIHNpZ21hMGwpKSB8IDBcblxuICAgIGhoID0gZ2hcbiAgICBobCA9IGdsXG4gICAgZ2ggPSBmaFxuICAgIGdsID0gZmxcbiAgICBmaCA9IGVoXG4gICAgZmwgPSBlbFxuICAgIGVsID0gKGRsICsgdDFsKSB8IDBcbiAgICBlaCA9IChkaCArIHQxaCArIGdldENhcnJ5KGVsLCBkbCkpIHwgMFxuICAgIGRoID0gY2hcbiAgICBkbCA9IGNsXG4gICAgY2ggPSBiaFxuICAgIGNsID0gYmxcbiAgICBiaCA9IGFoXG4gICAgYmwgPSBhbFxuICAgIGFsID0gKHQxbCArIHQybCkgfCAwXG4gICAgYWggPSAodDFoICsgdDJoICsgZ2V0Q2FycnkoYWwsIHQxbCkpIHwgMFxuICB9XG5cbiAgdGhpcy5fYWwgPSAodGhpcy5fYWwgKyBhbCkgfCAwXG4gIHRoaXMuX2JsID0gKHRoaXMuX2JsICsgYmwpIHwgMFxuICB0aGlzLl9jbCA9ICh0aGlzLl9jbCArIGNsKSB8IDBcbiAgdGhpcy5fZGwgPSAodGhpcy5fZGwgKyBkbCkgfCAwXG4gIHRoaXMuX2VsID0gKHRoaXMuX2VsICsgZWwpIHwgMFxuICB0aGlzLl9mbCA9ICh0aGlzLl9mbCArIGZsKSB8IDBcbiAgdGhpcy5fZ2wgPSAodGhpcy5fZ2wgKyBnbCkgfCAwXG4gIHRoaXMuX2hsID0gKHRoaXMuX2hsICsgaGwpIHwgMFxuXG4gIHRoaXMuX2FoID0gKHRoaXMuX2FoICsgYWggKyBnZXRDYXJyeSh0aGlzLl9hbCwgYWwpKSB8IDBcbiAgdGhpcy5fYmggPSAodGhpcy5fYmggKyBiaCArIGdldENhcnJ5KHRoaXMuX2JsLCBibCkpIHwgMFxuICB0aGlzLl9jaCA9ICh0aGlzLl9jaCArIGNoICsgZ2V0Q2FycnkodGhpcy5fY2wsIGNsKSkgfCAwXG4gIHRoaXMuX2RoID0gKHRoaXMuX2RoICsgZGggKyBnZXRDYXJyeSh0aGlzLl9kbCwgZGwpKSB8IDBcbiAgdGhpcy5fZWggPSAodGhpcy5fZWggKyBlaCArIGdldENhcnJ5KHRoaXMuX2VsLCBlbCkpIHwgMFxuICB0aGlzLl9maCA9ICh0aGlzLl9maCArIGZoICsgZ2V0Q2FycnkodGhpcy5fZmwsIGZsKSkgfCAwXG4gIHRoaXMuX2doID0gKHRoaXMuX2doICsgZ2ggKyBnZXRDYXJyeSh0aGlzLl9nbCwgZ2wpKSB8IDBcbiAgdGhpcy5faGggPSAodGhpcy5faGggKyBoaCArIGdldENhcnJ5KHRoaXMuX2hsLCBobCkpIHwgMFxufVxuXG5TaGE1MTIucHJvdG90eXBlLl9oYXNoID0gZnVuY3Rpb24gKCkge1xuICB2YXIgSCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSg2NClcblxuICBmdW5jdGlvbiB3cml0ZUludDY0QkUgKGgsIGwsIG9mZnNldCkge1xuICAgIEgud3JpdGVJbnQzMkJFKGgsIG9mZnNldClcbiAgICBILndyaXRlSW50MzJCRShsLCBvZmZzZXQgKyA0KVxuICB9XG5cbiAgd3JpdGVJbnQ2NEJFKHRoaXMuX2FoLCB0aGlzLl9hbCwgMClcbiAgd3JpdGVJbnQ2NEJFKHRoaXMuX2JoLCB0aGlzLl9ibCwgOClcbiAgd3JpdGVJbnQ2NEJFKHRoaXMuX2NoLCB0aGlzLl9jbCwgMTYpXG4gIHdyaXRlSW50NjRCRSh0aGlzLl9kaCwgdGhpcy5fZGwsIDI0KVxuICB3cml0ZUludDY0QkUodGhpcy5fZWgsIHRoaXMuX2VsLCAzMilcbiAgd3JpdGVJbnQ2NEJFKHRoaXMuX2ZoLCB0aGlzLl9mbCwgNDApXG4gIHdyaXRlSW50NjRCRSh0aGlzLl9naCwgdGhpcy5fZ2wsIDQ4KVxuICB3cml0ZUludDY0QkUodGhpcy5faGgsIHRoaXMuX2hsLCA1NilcblxuICByZXR1cm4gSFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYTUxMlxuIiwidmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFNIQSAoYWxnb3JpdGhtKSB7XG4gIGFsZ29yaXRobSA9IGFsZ29yaXRobS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIEFsZ29yaXRobSA9IGV4cG9ydHNbYWxnb3JpdGhtXVxuICBpZiAoIUFsZ29yaXRobSkgdGhyb3cgbmV3IEVycm9yKGFsZ29yaXRobSArICcgaXMgbm90IHN1cHBvcnRlZCAod2UgYWNjZXB0IHB1bGwgcmVxdWVzdHMpJylcblxuICByZXR1cm4gbmV3IEFsZ29yaXRobSgpXG59XG5cbmV4cG9ydHMuc2hhID0gcmVxdWlyZSgnLi9zaGEnKVxuZXhwb3J0cy5zaGExID0gcmVxdWlyZSgnLi9zaGExJylcbmV4cG9ydHMuc2hhMjI0ID0gcmVxdWlyZSgnLi9zaGEyMjQnKVxuZXhwb3J0cy5zaGEyNTYgPSByZXF1aXJlKCcuL3NoYTI1NicpXG5leHBvcnRzLnNoYTM4NCA9IHJlcXVpcmUoJy4vc2hhMzg0JylcbmV4cG9ydHMuc2hhNTEyID0gcmVxdWlyZSgnLi9zaGE1MTInKVxuIiwiLyoqXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNlY3VyZSBIYXNoIEFsZ29yaXRobSwgU0hBLTI1NiwgYXMgZGVmaW5lZFxuICogaW4gRklQUyAxODAtMlxuICogVmVyc2lvbiAyLjItYmV0YSBDb3B5cmlnaHQgQW5nZWwgTWFyaW4sIFBhdWwgSm9obnN0b24gMjAwMCAtIDIwMDkuXG4gKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gKlxuICovXG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBTaGEyNTYgPSByZXF1aXJlKCcuL3NoYTI1NicpXG52YXIgSGFzaCA9IHJlcXVpcmUoJy4vaGFzaCcpXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcblxudmFyIFcgPSBuZXcgQXJyYXkoNjQpXG5cbmZ1bmN0aW9uIFNoYTIyNCAoKSB7XG4gIHRoaXMuaW5pdCgpXG5cbiAgdGhpcy5fdyA9IFcgLy8gbmV3IEFycmF5KDY0KVxuXG4gIEhhc2guY2FsbCh0aGlzLCA2NCwgNTYpXG59XG5cbmluaGVyaXRzKFNoYTIyNCwgU2hhMjU2KVxuXG5TaGEyMjQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuX2EgPSAweGMxMDU5ZWQ4XG4gIHRoaXMuX2IgPSAweDM2N2NkNTA3XG4gIHRoaXMuX2MgPSAweDMwNzBkZDE3XG4gIHRoaXMuX2QgPSAweGY3MGU1OTM5XG4gIHRoaXMuX2UgPSAweGZmYzAwYjMxXG4gIHRoaXMuX2YgPSAweDY4NTgxNTExXG4gIHRoaXMuX2cgPSAweDY0Zjk4ZmE3XG4gIHRoaXMuX2ggPSAweGJlZmE0ZmE0XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuU2hhMjI0LnByb3RvdHlwZS5faGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIEggPSBCdWZmZXIuYWxsb2NVbnNhZmUoMjgpXG5cbiAgSC53cml0ZUludDMyQkUodGhpcy5fYSwgMClcbiAgSC53cml0ZUludDMyQkUodGhpcy5fYiwgNClcbiAgSC53cml0ZUludDMyQkUodGhpcy5fYywgOClcbiAgSC53cml0ZUludDMyQkUodGhpcy5fZCwgMTIpXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2UsIDE2KVxuICBILndyaXRlSW50MzJCRSh0aGlzLl9mLCAyMClcbiAgSC53cml0ZUludDMyQkUodGhpcy5fZywgMjQpXG5cbiAgcmV0dXJuIEhcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGEyMjRcbiIsIi8qXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNlY3VyZSBIYXNoIEFsZ29yaXRobSwgU0hBLTEsIGFzIGRlZmluZWRcbiAqIGluIEZJUFMgUFVCIDE4MC0xXG4gKiBWZXJzaW9uIDIuMWEgQ29weXJpZ2h0IFBhdWwgSm9obnN0b24gMjAwMCAtIDIwMDIuXG4gKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgQlNEIExpY2Vuc2VcbiAqIFNlZSBodHRwOi8vcGFqaG9tZS5vcmcudWsvY3J5cHQvbWQ1IGZvciBkZXRhaWxzLlxuICovXG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBIYXNoID0gcmVxdWlyZSgnLi9oYXNoJylcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxuXG52YXIgSyA9IFtcbiAgMHg1YTgyNzk5OSwgMHg2ZWQ5ZWJhMSwgMHg4ZjFiYmNkYyB8IDAsIDB4Y2E2MmMxZDYgfCAwXG5dXG5cbnZhciBXID0gbmV3IEFycmF5KDgwKVxuXG5mdW5jdGlvbiBTaGExICgpIHtcbiAgdGhpcy5pbml0KClcbiAgdGhpcy5fdyA9IFdcblxuICBIYXNoLmNhbGwodGhpcywgNjQsIDU2KVxufVxuXG5pbmhlcml0cyhTaGExLCBIYXNoKVxuXG5TaGExLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9hID0gMHg2NzQ1MjMwMVxuICB0aGlzLl9iID0gMHhlZmNkYWI4OVxuICB0aGlzLl9jID0gMHg5OGJhZGNmZVxuICB0aGlzLl9kID0gMHgxMDMyNTQ3NlxuICB0aGlzLl9lID0gMHhjM2QyZTFmMFxuXG4gIHJldHVybiB0aGlzXG59XG5cbmZ1bmN0aW9uIHJvdGwxIChudW0pIHtcbiAgcmV0dXJuIChudW0gPDwgMSkgfCAobnVtID4+PiAzMSlcbn1cblxuZnVuY3Rpb24gcm90bDUgKG51bSkge1xuICByZXR1cm4gKG51bSA8PCA1KSB8IChudW0gPj4+IDI3KVxufVxuXG5mdW5jdGlvbiByb3RsMzAgKG51bSkge1xuICByZXR1cm4gKG51bSA8PCAzMCkgfCAobnVtID4+PiAyKVxufVxuXG5mdW5jdGlvbiBmdCAocywgYiwgYywgZCkge1xuICBpZiAocyA9PT0gMCkgcmV0dXJuIChiICYgYykgfCAoKH5iKSAmIGQpXG4gIGlmIChzID09PSAyKSByZXR1cm4gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpXG4gIHJldHVybiBiIF4gYyBeIGRcbn1cblxuU2hhMS5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChNKSB7XG4gIHZhciBXID0gdGhpcy5fd1xuXG4gIHZhciBhID0gdGhpcy5fYSB8IDBcbiAgdmFyIGIgPSB0aGlzLl9iIHwgMFxuICB2YXIgYyA9IHRoaXMuX2MgfCAwXG4gIHZhciBkID0gdGhpcy5fZCB8IDBcbiAgdmFyIGUgPSB0aGlzLl9lIHwgMFxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7ICsraSkgV1tpXSA9IE0ucmVhZEludDMyQkUoaSAqIDQpXG4gIGZvciAoOyBpIDwgODA7ICsraSkgV1tpXSA9IHJvdGwxKFdbaSAtIDNdIF4gV1tpIC0gOF0gXiBXW2kgLSAxNF0gXiBXW2kgLSAxNl0pXG5cbiAgZm9yICh2YXIgaiA9IDA7IGogPCA4MDsgKytqKSB7XG4gICAgdmFyIHMgPSB+fihqIC8gMjApXG4gICAgdmFyIHQgPSAocm90bDUoYSkgKyBmdChzLCBiLCBjLCBkKSArIGUgKyBXW2pdICsgS1tzXSkgfCAwXG5cbiAgICBlID0gZFxuICAgIGQgPSBjXG4gICAgYyA9IHJvdGwzMChiKVxuICAgIGIgPSBhXG4gICAgYSA9IHRcbiAgfVxuXG4gIHRoaXMuX2EgPSAoYSArIHRoaXMuX2EpIHwgMFxuICB0aGlzLl9iID0gKGIgKyB0aGlzLl9iKSB8IDBcbiAgdGhpcy5fYyA9IChjICsgdGhpcy5fYykgfCAwXG4gIHRoaXMuX2QgPSAoZCArIHRoaXMuX2QpIHwgMFxuICB0aGlzLl9lID0gKGUgKyB0aGlzLl9lKSB8IDBcbn1cblxuU2hhMS5wcm90b3R5cGUuX2hhc2ggPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBIID0gQnVmZmVyLmFsbG9jVW5zYWZlKDIwKVxuXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2EgfCAwLCAwKVxuICBILndyaXRlSW50MzJCRSh0aGlzLl9iIHwgMCwgNClcbiAgSC53cml0ZUludDMyQkUodGhpcy5fYyB8IDAsIDgpXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2QgfCAwLCAxMilcbiAgSC53cml0ZUludDMyQkUodGhpcy5fZSB8IDAsIDE2KVxuXG4gIHJldHVybiBIXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhMVxuIiwiLyoqXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNlY3VyZSBIYXNoIEFsZ29yaXRobSwgU0hBLTI1NiwgYXMgZGVmaW5lZFxuICogaW4gRklQUyAxODAtMlxuICogVmVyc2lvbiAyLjItYmV0YSBDb3B5cmlnaHQgQW5nZWwgTWFyaW4sIFBhdWwgSm9obnN0b24gMjAwMCAtIDIwMDkuXG4gKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gKlxuICovXG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBIYXNoID0gcmVxdWlyZSgnLi9oYXNoJylcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxuXG52YXIgSyA9IFtcbiAgMHg0MjhBMkY5OCwgMHg3MTM3NDQ5MSwgMHhCNUMwRkJDRiwgMHhFOUI1REJBNSxcbiAgMHgzOTU2QzI1QiwgMHg1OUYxMTFGMSwgMHg5MjNGODJBNCwgMHhBQjFDNUVENSxcbiAgMHhEODA3QUE5OCwgMHgxMjgzNUIwMSwgMHgyNDMxODVCRSwgMHg1NTBDN0RDMyxcbiAgMHg3MkJFNUQ3NCwgMHg4MERFQjFGRSwgMHg5QkRDMDZBNywgMHhDMTlCRjE3NCxcbiAgMHhFNDlCNjlDMSwgMHhFRkJFNDc4NiwgMHgwRkMxOURDNiwgMHgyNDBDQTFDQyxcbiAgMHgyREU5MkM2RiwgMHg0QTc0ODRBQSwgMHg1Q0IwQTlEQywgMHg3NkY5ODhEQSxcbiAgMHg5ODNFNTE1MiwgMHhBODMxQzY2RCwgMHhCMDAzMjdDOCwgMHhCRjU5N0ZDNyxcbiAgMHhDNkUwMEJGMywgMHhENUE3OTE0NywgMHgwNkNBNjM1MSwgMHgxNDI5Mjk2NyxcbiAgMHgyN0I3MEE4NSwgMHgyRTFCMjEzOCwgMHg0RDJDNkRGQywgMHg1MzM4MEQxMyxcbiAgMHg2NTBBNzM1NCwgMHg3NjZBMEFCQiwgMHg4MUMyQzkyRSwgMHg5MjcyMkM4NSxcbiAgMHhBMkJGRThBMSwgMHhBODFBNjY0QiwgMHhDMjRCOEI3MCwgMHhDNzZDNTFBMyxcbiAgMHhEMTkyRTgxOSwgMHhENjk5MDYyNCwgMHhGNDBFMzU4NSwgMHgxMDZBQTA3MCxcbiAgMHgxOUE0QzExNiwgMHgxRTM3NkMwOCwgMHgyNzQ4Nzc0QywgMHgzNEIwQkNCNSxcbiAgMHgzOTFDMENCMywgMHg0RUQ4QUE0QSwgMHg1QjlDQ0E0RiwgMHg2ODJFNkZGMyxcbiAgMHg3NDhGODJFRSwgMHg3OEE1NjM2RiwgMHg4NEM4NzgxNCwgMHg4Q0M3MDIwOCxcbiAgMHg5MEJFRkZGQSwgMHhBNDUwNkNFQiwgMHhCRUY5QTNGNywgMHhDNjcxNzhGMlxuXVxuXG52YXIgVyA9IG5ldyBBcnJheSg2NClcblxuZnVuY3Rpb24gU2hhMjU2ICgpIHtcbiAgdGhpcy5pbml0KClcblxuICB0aGlzLl93ID0gVyAvLyBuZXcgQXJyYXkoNjQpXG5cbiAgSGFzaC5jYWxsKHRoaXMsIDY0LCA1Nilcbn1cblxuaW5oZXJpdHMoU2hhMjU2LCBIYXNoKVxuXG5TaGEyNTYucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuX2EgPSAweDZhMDllNjY3XG4gIHRoaXMuX2IgPSAweGJiNjdhZTg1XG4gIHRoaXMuX2MgPSAweDNjNmVmMzcyXG4gIHRoaXMuX2QgPSAweGE1NGZmNTNhXG4gIHRoaXMuX2UgPSAweDUxMGU1MjdmXG4gIHRoaXMuX2YgPSAweDliMDU2ODhjXG4gIHRoaXMuX2cgPSAweDFmODNkOWFiXG4gIHRoaXMuX2ggPSAweDViZTBjZDE5XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuZnVuY3Rpb24gY2ggKHgsIHksIHopIHtcbiAgcmV0dXJuIHogXiAoeCAmICh5IF4geikpXG59XG5cbmZ1bmN0aW9uIG1haiAoeCwgeSwgeikge1xuICByZXR1cm4gKHggJiB5KSB8ICh6ICYgKHggfCB5KSlcbn1cblxuZnVuY3Rpb24gc2lnbWEwICh4KSB7XG4gIHJldHVybiAoeCA+Pj4gMiB8IHggPDwgMzApIF4gKHggPj4+IDEzIHwgeCA8PCAxOSkgXiAoeCA+Pj4gMjIgfCB4IDw8IDEwKVxufVxuXG5mdW5jdGlvbiBzaWdtYTEgKHgpIHtcbiAgcmV0dXJuICh4ID4+PiA2IHwgeCA8PCAyNikgXiAoeCA+Pj4gMTEgfCB4IDw8IDIxKSBeICh4ID4+PiAyNSB8IHggPDwgNylcbn1cblxuZnVuY3Rpb24gZ2FtbWEwICh4KSB7XG4gIHJldHVybiAoeCA+Pj4gNyB8IHggPDwgMjUpIF4gKHggPj4+IDE4IHwgeCA8PCAxNCkgXiAoeCA+Pj4gMylcbn1cblxuZnVuY3Rpb24gZ2FtbWExICh4KSB7XG4gIHJldHVybiAoeCA+Pj4gMTcgfCB4IDw8IDE1KSBeICh4ID4+PiAxOSB8IHggPDwgMTMpIF4gKHggPj4+IDEwKVxufVxuXG5TaGEyNTYucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAoTSkge1xuICB2YXIgVyA9IHRoaXMuX3dcblxuICB2YXIgYSA9IHRoaXMuX2EgfCAwXG4gIHZhciBiID0gdGhpcy5fYiB8IDBcbiAgdmFyIGMgPSB0aGlzLl9jIHwgMFxuICB2YXIgZCA9IHRoaXMuX2QgfCAwXG4gIHZhciBlID0gdGhpcy5fZSB8IDBcbiAgdmFyIGYgPSB0aGlzLl9mIHwgMFxuICB2YXIgZyA9IHRoaXMuX2cgfCAwXG4gIHZhciBoID0gdGhpcy5faCB8IDBcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyArK2kpIFdbaV0gPSBNLnJlYWRJbnQzMkJFKGkgKiA0KVxuICBmb3IgKDsgaSA8IDY0OyArK2kpIFdbaV0gPSAoZ2FtbWExKFdbaSAtIDJdKSArIFdbaSAtIDddICsgZ2FtbWEwKFdbaSAtIDE1XSkgKyBXW2kgLSAxNl0pIHwgMFxuXG4gIGZvciAodmFyIGogPSAwOyBqIDwgNjQ7ICsraikge1xuICAgIHZhciBUMSA9IChoICsgc2lnbWExKGUpICsgY2goZSwgZiwgZykgKyBLW2pdICsgV1tqXSkgfCAwXG4gICAgdmFyIFQyID0gKHNpZ21hMChhKSArIG1haihhLCBiLCBjKSkgfCAwXG5cbiAgICBoID0gZ1xuICAgIGcgPSBmXG4gICAgZiA9IGVcbiAgICBlID0gKGQgKyBUMSkgfCAwXG4gICAgZCA9IGNcbiAgICBjID0gYlxuICAgIGIgPSBhXG4gICAgYSA9IChUMSArIFQyKSB8IDBcbiAgfVxuXG4gIHRoaXMuX2EgPSAoYSArIHRoaXMuX2EpIHwgMFxuICB0aGlzLl9iID0gKGIgKyB0aGlzLl9iKSB8IDBcbiAgdGhpcy5fYyA9IChjICsgdGhpcy5fYykgfCAwXG4gIHRoaXMuX2QgPSAoZCArIHRoaXMuX2QpIHwgMFxuICB0aGlzLl9lID0gKGUgKyB0aGlzLl9lKSB8IDBcbiAgdGhpcy5fZiA9IChmICsgdGhpcy5fZikgfCAwXG4gIHRoaXMuX2cgPSAoZyArIHRoaXMuX2cpIHwgMFxuICB0aGlzLl9oID0gKGggKyB0aGlzLl9oKSB8IDBcbn1cblxuU2hhMjU2LnByb3RvdHlwZS5faGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIEggPSBCdWZmZXIuYWxsb2NVbnNhZmUoMzIpXG5cbiAgSC53cml0ZUludDMyQkUodGhpcy5fYSwgMClcbiAgSC53cml0ZUludDMyQkUodGhpcy5fYiwgNClcbiAgSC53cml0ZUludDMyQkUodGhpcy5fYywgOClcbiAgSC53cml0ZUludDMyQkUodGhpcy5fZCwgMTIpXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2UsIDE2KVxuICBILndyaXRlSW50MzJCRSh0aGlzLl9mLCAyMClcbiAgSC53cml0ZUludDMyQkUodGhpcy5fZywgMjQpXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2gsIDI4KVxuXG4gIHJldHVybiBIXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhMjU2XG4iLCJ2YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcblxuLy8gcHJvdG90eXBlIGNsYXNzIGZvciBoYXNoIGZ1bmN0aW9uc1xuZnVuY3Rpb24gSGFzaCAoYmxvY2tTaXplLCBmaW5hbFNpemUpIHtcbiAgdGhpcy5fYmxvY2sgPSBCdWZmZXIuYWxsb2MoYmxvY2tTaXplKVxuICB0aGlzLl9maW5hbFNpemUgPSBmaW5hbFNpemVcbiAgdGhpcy5fYmxvY2tTaXplID0gYmxvY2tTaXplXG4gIHRoaXMuX2xlbiA9IDBcbn1cblxuSGFzaC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRhdGEsIGVuYykge1xuICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jID0gZW5jIHx8ICd1dGY4J1xuICAgIGRhdGEgPSBCdWZmZXIuZnJvbShkYXRhLCBlbmMpXG4gIH1cblxuICB2YXIgYmxvY2sgPSB0aGlzLl9ibG9ja1xuICB2YXIgYmxvY2tTaXplID0gdGhpcy5fYmxvY2tTaXplXG4gIHZhciBsZW5ndGggPSBkYXRhLmxlbmd0aFxuICB2YXIgYWNjdW0gPSB0aGlzLl9sZW5cblxuICBmb3IgKHZhciBvZmZzZXQgPSAwOyBvZmZzZXQgPCBsZW5ndGg7KSB7XG4gICAgdmFyIGFzc2lnbmVkID0gYWNjdW0gJSBibG9ja1NpemVcbiAgICB2YXIgcmVtYWluZGVyID0gTWF0aC5taW4obGVuZ3RoIC0gb2Zmc2V0LCBibG9ja1NpemUgLSBhc3NpZ25lZClcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVtYWluZGVyOyBpKyspIHtcbiAgICAgIGJsb2NrW2Fzc2lnbmVkICsgaV0gPSBkYXRhW29mZnNldCArIGldXG4gICAgfVxuXG4gICAgYWNjdW0gKz0gcmVtYWluZGVyXG4gICAgb2Zmc2V0ICs9IHJlbWFpbmRlclxuXG4gICAgaWYgKChhY2N1bSAlIGJsb2NrU2l6ZSkgPT09IDApIHtcbiAgICAgIHRoaXMuX3VwZGF0ZShibG9jaylcbiAgICB9XG4gIH1cblxuICB0aGlzLl9sZW4gKz0gbGVuZ3RoXG4gIHJldHVybiB0aGlzXG59XG5cbkhhc2gucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uIChlbmMpIHtcbiAgdmFyIHJlbSA9IHRoaXMuX2xlbiAlIHRoaXMuX2Jsb2NrU2l6ZVxuXG4gIHRoaXMuX2Jsb2NrW3JlbV0gPSAweDgwXG5cbiAgLy8gemVybyAocmVtICsgMSkgdHJhaWxpbmcgYml0cywgd2hlcmUgKHJlbSArIDEpIGlzIHRoZSBzbWFsbGVzdFxuICAvLyBub24tbmVnYXRpdmUgc29sdXRpb24gdG8gdGhlIGVxdWF0aW9uIChsZW5ndGggKyAxICsgKHJlbSArIDEpKSA9PT0gZmluYWxTaXplIG1vZCBibG9ja1NpemVcbiAgdGhpcy5fYmxvY2suZmlsbCgwLCByZW0gKyAxKVxuXG4gIGlmIChyZW0gPj0gdGhpcy5fZmluYWxTaXplKSB7XG4gICAgdGhpcy5fdXBkYXRlKHRoaXMuX2Jsb2NrKVxuICAgIHRoaXMuX2Jsb2NrLmZpbGwoMClcbiAgfVxuXG4gIHZhciBiaXRzID0gdGhpcy5fbGVuICogOFxuXG4gIC8vIHVpbnQzMlxuICBpZiAoYml0cyA8PSAweGZmZmZmZmZmKSB7XG4gICAgdGhpcy5fYmxvY2sud3JpdGVVSW50MzJCRShiaXRzLCB0aGlzLl9ibG9ja1NpemUgLSA0KVxuXG4gIC8vIHVpbnQ2NFxuICB9IGVsc2Uge1xuICAgIHZhciBsb3dCaXRzID0gKGJpdHMgJiAweGZmZmZmZmZmKSA+Pj4gMFxuICAgIHZhciBoaWdoQml0cyA9IChiaXRzIC0gbG93Qml0cykgLyAweDEwMDAwMDAwMFxuXG4gICAgdGhpcy5fYmxvY2sud3JpdGVVSW50MzJCRShoaWdoQml0cywgdGhpcy5fYmxvY2tTaXplIC0gOClcbiAgICB0aGlzLl9ibG9jay53cml0ZVVJbnQzMkJFKGxvd0JpdHMsIHRoaXMuX2Jsb2NrU2l6ZSAtIDQpXG4gIH1cblxuICB0aGlzLl91cGRhdGUodGhpcy5fYmxvY2spXG4gIHZhciBoYXNoID0gdGhpcy5faGFzaCgpXG5cbiAgcmV0dXJuIGVuYyA/IGhhc2gudG9TdHJpbmcoZW5jKSA6IGhhc2hcbn1cblxuSGFzaC5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdfdXBkYXRlIG11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MnKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2hcbiIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBTSEE1MTIgPSByZXF1aXJlKCcuL3NoYTUxMicpXG52YXIgSGFzaCA9IHJlcXVpcmUoJy4vaGFzaCcpXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcblxudmFyIFcgPSBuZXcgQXJyYXkoMTYwKVxuXG5mdW5jdGlvbiBTaGEzODQgKCkge1xuICB0aGlzLmluaXQoKVxuICB0aGlzLl93ID0gV1xuXG4gIEhhc2guY2FsbCh0aGlzLCAxMjgsIDExMilcbn1cblxuaW5oZXJpdHMoU2hhMzg0LCBTSEE1MTIpXG5cblNoYTM4NC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fYWggPSAweGNiYmI5ZDVkXG4gIHRoaXMuX2JoID0gMHg2MjlhMjkyYVxuICB0aGlzLl9jaCA9IDB4OTE1OTAxNWFcbiAgdGhpcy5fZGggPSAweDE1MmZlY2Q4XG4gIHRoaXMuX2VoID0gMHg2NzMzMjY2N1xuICB0aGlzLl9maCA9IDB4OGViNDRhODdcbiAgdGhpcy5fZ2ggPSAweGRiMGMyZTBkXG4gIHRoaXMuX2hoID0gMHg0N2I1NDgxZFxuXG4gIHRoaXMuX2FsID0gMHhjMTA1OWVkOFxuICB0aGlzLl9ibCA9IDB4MzY3Y2Q1MDdcbiAgdGhpcy5fY2wgPSAweDMwNzBkZDE3XG4gIHRoaXMuX2RsID0gMHhmNzBlNTkzOVxuICB0aGlzLl9lbCA9IDB4ZmZjMDBiMzFcbiAgdGhpcy5fZmwgPSAweDY4NTgxNTExXG4gIHRoaXMuX2dsID0gMHg2NGY5OGZhN1xuICB0aGlzLl9obCA9IDB4YmVmYTRmYTRcblxuICByZXR1cm4gdGhpc1xufVxuXG5TaGEzODQucHJvdG90eXBlLl9oYXNoID0gZnVuY3Rpb24gKCkge1xuICB2YXIgSCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSg0OClcblxuICBmdW5jdGlvbiB3cml0ZUludDY0QkUgKGgsIGwsIG9mZnNldCkge1xuICAgIEgud3JpdGVJbnQzMkJFKGgsIG9mZnNldClcbiAgICBILndyaXRlSW50MzJCRShsLCBvZmZzZXQgKyA0KVxuICB9XG5cbiAgd3JpdGVJbnQ2NEJFKHRoaXMuX2FoLCB0aGlzLl9hbCwgMClcbiAgd3JpdGVJbnQ2NEJFKHRoaXMuX2JoLCB0aGlzLl9ibCwgOClcbiAgd3JpdGVJbnQ2NEJFKHRoaXMuX2NoLCB0aGlzLl9jbCwgMTYpXG4gIHdyaXRlSW50NjRCRSh0aGlzLl9kaCwgdGhpcy5fZGwsIDI0KVxuICB3cml0ZUludDY0QkUodGhpcy5fZWgsIHRoaXMuX2VsLCAzMilcbiAgd3JpdGVJbnQ2NEJFKHRoaXMuX2ZoLCB0aGlzLl9mbCwgNDApXG5cbiAgcmV0dXJuIEhcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGEzODRcbiJdLCJzb3VyY2VSb290IjoiIn0=