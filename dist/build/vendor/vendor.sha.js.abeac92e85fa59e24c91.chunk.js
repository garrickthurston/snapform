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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hhLmpzL3NoYS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hhLmpzL3NoYTUxMi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hhLmpzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaGEuanMvc2hhMjI0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaGEuanMvc2hhMS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hhLmpzL3NoYTI1Ni5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hhLmpzL2hhc2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NoYS5qcy9zaGEzODQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZSxtQkFBTyxDQUFDLHNCQUFVO0FBQ2pDLFdBQVcsbUJBQU8sQ0FBQyxvQkFBUTtBQUMzQixhQUFhLG1CQUFPLENBQUMseUJBQWE7O0FBRWxDO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixRQUFRO0FBQ3pCLFFBQVEsUUFBUTs7QUFFaEIsaUJBQWlCLFFBQVE7QUFDekI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVB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O0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3Iuc2hhLmpzLmFiZWFjOTJlODVmYTU5ZTI0YzkxLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBTZWN1cmUgSGFzaCBBbGdvcml0aG0sIFNIQS0wLCBhcyBkZWZpbmVkXHJcbiAqIGluIEZJUFMgUFVCIDE4MC0xXHJcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgZGVyaXZlZCBmcm9tIHNoYTEuanMgb2YgdGhlIHNhbWUgcmVwb3NpdG9yeS5cclxuICogVGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBTSEEtMCBhbmQgU0hBLTEgaXMganVzdCBhIGJpdHdpc2Ugcm90YXRlIGxlZnRcclxuICogb3BlcmF0aW9uIHdhcyBhZGRlZC5cclxuICovXHJcblxyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXHJcbnZhciBIYXNoID0gcmVxdWlyZSgnLi9oYXNoJylcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcblxyXG52YXIgSyA9IFtcclxuICAweDVhODI3OTk5LCAweDZlZDllYmExLCAweDhmMWJiY2RjIHwgMCwgMHhjYTYyYzFkNiB8IDBcclxuXVxyXG5cclxudmFyIFcgPSBuZXcgQXJyYXkoODApXHJcblxyXG5mdW5jdGlvbiBTaGEgKCkge1xyXG4gIHRoaXMuaW5pdCgpXHJcbiAgdGhpcy5fdyA9IFdcclxuXHJcbiAgSGFzaC5jYWxsKHRoaXMsIDY0LCA1NilcclxufVxyXG5cclxuaW5oZXJpdHMoU2hhLCBIYXNoKVxyXG5cclxuU2hhLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuX2EgPSAweDY3NDUyMzAxXHJcbiAgdGhpcy5fYiA9IDB4ZWZjZGFiODlcclxuICB0aGlzLl9jID0gMHg5OGJhZGNmZVxyXG4gIHRoaXMuX2QgPSAweDEwMzI1NDc2XHJcbiAgdGhpcy5fZSA9IDB4YzNkMmUxZjBcclxuXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuZnVuY3Rpb24gcm90bDUgKG51bSkge1xyXG4gIHJldHVybiAobnVtIDw8IDUpIHwgKG51bSA+Pj4gMjcpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJvdGwzMCAobnVtKSB7XHJcbiAgcmV0dXJuIChudW0gPDwgMzApIHwgKG51bSA+Pj4gMilcclxufVxyXG5cclxuZnVuY3Rpb24gZnQgKHMsIGIsIGMsIGQpIHtcclxuICBpZiAocyA9PT0gMCkgcmV0dXJuIChiICYgYykgfCAoKH5iKSAmIGQpXHJcbiAgaWYgKHMgPT09IDIpIHJldHVybiAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZClcclxuICByZXR1cm4gYiBeIGMgXiBkXHJcbn1cclxuXHJcblNoYS5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChNKSB7XHJcbiAgdmFyIFcgPSB0aGlzLl93XHJcblxyXG4gIHZhciBhID0gdGhpcy5fYSB8IDBcclxuICB2YXIgYiA9IHRoaXMuX2IgfCAwXHJcbiAgdmFyIGMgPSB0aGlzLl9jIHwgMFxyXG4gIHZhciBkID0gdGhpcy5fZCB8IDBcclxuICB2YXIgZSA9IHRoaXMuX2UgfCAwXHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7ICsraSkgV1tpXSA9IE0ucmVhZEludDMyQkUoaSAqIDQpXHJcbiAgZm9yICg7IGkgPCA4MDsgKytpKSBXW2ldID0gV1tpIC0gM10gXiBXW2kgLSA4XSBeIFdbaSAtIDE0XSBeIFdbaSAtIDE2XVxyXG5cclxuICBmb3IgKHZhciBqID0gMDsgaiA8IDgwOyArK2opIHtcclxuICAgIHZhciBzID0gfn4oaiAvIDIwKVxyXG4gICAgdmFyIHQgPSAocm90bDUoYSkgKyBmdChzLCBiLCBjLCBkKSArIGUgKyBXW2pdICsgS1tzXSkgfCAwXHJcblxyXG4gICAgZSA9IGRcclxuICAgIGQgPSBjXHJcbiAgICBjID0gcm90bDMwKGIpXHJcbiAgICBiID0gYVxyXG4gICAgYSA9IHRcclxuICB9XHJcblxyXG4gIHRoaXMuX2EgPSAoYSArIHRoaXMuX2EpIHwgMFxyXG4gIHRoaXMuX2IgPSAoYiArIHRoaXMuX2IpIHwgMFxyXG4gIHRoaXMuX2MgPSAoYyArIHRoaXMuX2MpIHwgMFxyXG4gIHRoaXMuX2QgPSAoZCArIHRoaXMuX2QpIHwgMFxyXG4gIHRoaXMuX2UgPSAoZSArIHRoaXMuX2UpIHwgMFxyXG59XHJcblxyXG5TaGEucHJvdG90eXBlLl9oYXNoID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBIID0gQnVmZmVyLmFsbG9jVW5zYWZlKDIwKVxyXG5cclxuICBILndyaXRlSW50MzJCRSh0aGlzLl9hIHwgMCwgMClcclxuICBILndyaXRlSW50MzJCRSh0aGlzLl9iIHwgMCwgNClcclxuICBILndyaXRlSW50MzJCRSh0aGlzLl9jIHwgMCwgOClcclxuICBILndyaXRlSW50MzJCRSh0aGlzLl9kIHwgMCwgMTIpXHJcbiAgSC53cml0ZUludDMyQkUodGhpcy5fZSB8IDAsIDE2KVxyXG5cclxuICByZXR1cm4gSFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYVxyXG4iLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXHJcbnZhciBIYXNoID0gcmVxdWlyZSgnLi9oYXNoJylcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcblxyXG52YXIgSyA9IFtcclxuICAweDQyOGEyZjk4LCAweGQ3MjhhZTIyLCAweDcxMzc0NDkxLCAweDIzZWY2NWNkLFxyXG4gIDB4YjVjMGZiY2YsIDB4ZWM0ZDNiMmYsIDB4ZTliNWRiYTUsIDB4ODE4OWRiYmMsXHJcbiAgMHgzOTU2YzI1YiwgMHhmMzQ4YjUzOCwgMHg1OWYxMTFmMSwgMHhiNjA1ZDAxOSxcclxuICAweDkyM2Y4MmE0LCAweGFmMTk0ZjliLCAweGFiMWM1ZWQ1LCAweGRhNmQ4MTE4LFxyXG4gIDB4ZDgwN2FhOTgsIDB4YTMwMzAyNDIsIDB4MTI4MzViMDEsIDB4NDU3MDZmYmUsXHJcbiAgMHgyNDMxODViZSwgMHg0ZWU0YjI4YywgMHg1NTBjN2RjMywgMHhkNWZmYjRlMixcclxuICAweDcyYmU1ZDc0LCAweGYyN2I4OTZmLCAweDgwZGViMWZlLCAweDNiMTY5NmIxLFxyXG4gIDB4OWJkYzA2YTcsIDB4MjVjNzEyMzUsIDB4YzE5YmYxNzQsIDB4Y2Y2OTI2OTQsXHJcbiAgMHhlNDliNjljMSwgMHg5ZWYxNGFkMiwgMHhlZmJlNDc4NiwgMHgzODRmMjVlMyxcclxuICAweDBmYzE5ZGM2LCAweDhiOGNkNWI1LCAweDI0MGNhMWNjLCAweDc3YWM5YzY1LFxyXG4gIDB4MmRlOTJjNmYsIDB4NTkyYjAyNzUsIDB4NGE3NDg0YWEsIDB4NmVhNmU0ODMsXHJcbiAgMHg1Y2IwYTlkYywgMHhiZDQxZmJkNCwgMHg3NmY5ODhkYSwgMHg4MzExNTNiNSxcclxuICAweDk4M2U1MTUyLCAweGVlNjZkZmFiLCAweGE4MzFjNjZkLCAweDJkYjQzMjEwLFxyXG4gIDB4YjAwMzI3YzgsIDB4OThmYjIxM2YsIDB4YmY1OTdmYzcsIDB4YmVlZjBlZTQsXHJcbiAgMHhjNmUwMGJmMywgMHgzZGE4OGZjMiwgMHhkNWE3OTE0NywgMHg5MzBhYTcyNSxcclxuICAweDA2Y2E2MzUxLCAweGUwMDM4MjZmLCAweDE0MjkyOTY3LCAweDBhMGU2ZTcwLFxyXG4gIDB4MjdiNzBhODUsIDB4NDZkMjJmZmMsIDB4MmUxYjIxMzgsIDB4NWMyNmM5MjYsXHJcbiAgMHg0ZDJjNmRmYywgMHg1YWM0MmFlZCwgMHg1MzM4MGQxMywgMHg5ZDk1YjNkZixcclxuICAweDY1MGE3MzU0LCAweDhiYWY2M2RlLCAweDc2NmEwYWJiLCAweDNjNzdiMmE4LFxyXG4gIDB4ODFjMmM5MmUsIDB4NDdlZGFlZTYsIDB4OTI3MjJjODUsIDB4MTQ4MjM1M2IsXHJcbiAgMHhhMmJmZThhMSwgMHg0Y2YxMDM2NCwgMHhhODFhNjY0YiwgMHhiYzQyMzAwMSxcclxuICAweGMyNGI4YjcwLCAweGQwZjg5NzkxLCAweGM3NmM1MWEzLCAweDA2NTRiZTMwLFxyXG4gIDB4ZDE5MmU4MTksIDB4ZDZlZjUyMTgsIDB4ZDY5OTA2MjQsIDB4NTU2NWE5MTAsXHJcbiAgMHhmNDBlMzU4NSwgMHg1NzcxMjAyYSwgMHgxMDZhYTA3MCwgMHgzMmJiZDFiOCxcclxuICAweDE5YTRjMTE2LCAweGI4ZDJkMGM4LCAweDFlMzc2YzA4LCAweDUxNDFhYjUzLFxyXG4gIDB4Mjc0ODc3NGMsIDB4ZGY4ZWViOTksIDB4MzRiMGJjYjUsIDB4ZTE5YjQ4YTgsXHJcbiAgMHgzOTFjMGNiMywgMHhjNWM5NWE2MywgMHg0ZWQ4YWE0YSwgMHhlMzQxOGFjYixcclxuICAweDViOWNjYTRmLCAweDc3NjNlMzczLCAweDY4MmU2ZmYzLCAweGQ2YjJiOGEzLFxyXG4gIDB4NzQ4ZjgyZWUsIDB4NWRlZmIyZmMsIDB4NzhhNTYzNmYsIDB4NDMxNzJmNjAsXHJcbiAgMHg4NGM4NzgxNCwgMHhhMWYwYWI3MiwgMHg4Y2M3MDIwOCwgMHgxYTY0MzllYyxcclxuICAweDkwYmVmZmZhLCAweDIzNjMxZTI4LCAweGE0NTA2Y2ViLCAweGRlODJiZGU5LFxyXG4gIDB4YmVmOWEzZjcsIDB4YjJjNjc5MTUsIDB4YzY3MTc4ZjIsIDB4ZTM3MjUzMmIsXHJcbiAgMHhjYTI3M2VjZSwgMHhlYTI2NjE5YywgMHhkMTg2YjhjNywgMHgyMWMwYzIwNyxcclxuICAweGVhZGE3ZGQ2LCAweGNkZTBlYjFlLCAweGY1N2Q0ZjdmLCAweGVlNmVkMTc4LFxyXG4gIDB4MDZmMDY3YWEsIDB4NzIxNzZmYmEsIDB4MGE2MzdkYzUsIDB4YTJjODk4YTYsXHJcbiAgMHgxMTNmOTgwNCwgMHhiZWY5MGRhZSwgMHgxYjcxMGIzNSwgMHgxMzFjNDcxYixcclxuICAweDI4ZGI3N2Y1LCAweDIzMDQ3ZDg0LCAweDMyY2FhYjdiLCAweDQwYzcyNDkzLFxyXG4gIDB4M2M5ZWJlMGEsIDB4MTVjOWJlYmMsIDB4NDMxZDY3YzQsIDB4OWMxMDBkNGMsXHJcbiAgMHg0Y2M1ZDRiZSwgMHhjYjNlNDJiNiwgMHg1OTdmMjk5YywgMHhmYzY1N2UyYSxcclxuICAweDVmY2I2ZmFiLCAweDNhZDZmYWVjLCAweDZjNDQxOThjLCAweDRhNDc1ODE3XHJcbl1cclxuXHJcbnZhciBXID0gbmV3IEFycmF5KDE2MClcclxuXHJcbmZ1bmN0aW9uIFNoYTUxMiAoKSB7XHJcbiAgdGhpcy5pbml0KClcclxuICB0aGlzLl93ID0gV1xyXG5cclxuICBIYXNoLmNhbGwodGhpcywgMTI4LCAxMTIpXHJcbn1cclxuXHJcbmluaGVyaXRzKFNoYTUxMiwgSGFzaClcclxuXHJcblNoYTUxMi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLl9haCA9IDB4NmEwOWU2NjdcclxuICB0aGlzLl9iaCA9IDB4YmI2N2FlODVcclxuICB0aGlzLl9jaCA9IDB4M2M2ZWYzNzJcclxuICB0aGlzLl9kaCA9IDB4YTU0ZmY1M2FcclxuICB0aGlzLl9laCA9IDB4NTEwZTUyN2ZcclxuICB0aGlzLl9maCA9IDB4OWIwNTY4OGNcclxuICB0aGlzLl9naCA9IDB4MWY4M2Q5YWJcclxuICB0aGlzLl9oaCA9IDB4NWJlMGNkMTlcclxuXHJcbiAgdGhpcy5fYWwgPSAweGYzYmNjOTA4XHJcbiAgdGhpcy5fYmwgPSAweDg0Y2FhNzNiXHJcbiAgdGhpcy5fY2wgPSAweGZlOTRmODJiXHJcbiAgdGhpcy5fZGwgPSAweDVmMWQzNmYxXHJcbiAgdGhpcy5fZWwgPSAweGFkZTY4MmQxXHJcbiAgdGhpcy5fZmwgPSAweDJiM2U2YzFmXHJcbiAgdGhpcy5fZ2wgPSAweGZiNDFiZDZiXHJcbiAgdGhpcy5faGwgPSAweDEzN2UyMTc5XHJcblxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbmZ1bmN0aW9uIENoICh4LCB5LCB6KSB7XHJcbiAgcmV0dXJuIHogXiAoeCAmICh5IF4geikpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1haiAoeCwgeSwgeikge1xyXG4gIHJldHVybiAoeCAmIHkpIHwgKHogJiAoeCB8IHkpKVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaWdtYTAgKHgsIHhsKSB7XHJcbiAgcmV0dXJuICh4ID4+PiAyOCB8IHhsIDw8IDQpIF4gKHhsID4+PiAyIHwgeCA8PCAzMCkgXiAoeGwgPj4+IDcgfCB4IDw8IDI1KVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaWdtYTEgKHgsIHhsKSB7XHJcbiAgcmV0dXJuICh4ID4+PiAxNCB8IHhsIDw8IDE4KSBeICh4ID4+PiAxOCB8IHhsIDw8IDE0KSBeICh4bCA+Pj4gOSB8IHggPDwgMjMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIEdhbW1hMCAoeCwgeGwpIHtcclxuICByZXR1cm4gKHggPj4+IDEgfCB4bCA8PCAzMSkgXiAoeCA+Pj4gOCB8IHhsIDw8IDI0KSBeICh4ID4+PiA3KVxyXG59XHJcblxyXG5mdW5jdGlvbiBHYW1tYTBsICh4LCB4bCkge1xyXG4gIHJldHVybiAoeCA+Pj4gMSB8IHhsIDw8IDMxKSBeICh4ID4+PiA4IHwgeGwgPDwgMjQpIF4gKHggPj4+IDcgfCB4bCA8PCAyNSlcclxufVxyXG5cclxuZnVuY3Rpb24gR2FtbWExICh4LCB4bCkge1xyXG4gIHJldHVybiAoeCA+Pj4gMTkgfCB4bCA8PCAxMykgXiAoeGwgPj4+IDI5IHwgeCA8PCAzKSBeICh4ID4+PiA2KVxyXG59XHJcblxyXG5mdW5jdGlvbiBHYW1tYTFsICh4LCB4bCkge1xyXG4gIHJldHVybiAoeCA+Pj4gMTkgfCB4bCA8PCAxMykgXiAoeGwgPj4+IDI5IHwgeCA8PCAzKSBeICh4ID4+PiA2IHwgeGwgPDwgMjYpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhcnJ5IChhLCBiKSB7XHJcbiAgcmV0dXJuIChhID4+PiAwKSA8IChiID4+PiAwKSA/IDEgOiAwXHJcbn1cclxuXHJcblNoYTUxMi5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChNKSB7XHJcbiAgdmFyIFcgPSB0aGlzLl93XHJcblxyXG4gIHZhciBhaCA9IHRoaXMuX2FoIHwgMFxyXG4gIHZhciBiaCA9IHRoaXMuX2JoIHwgMFxyXG4gIHZhciBjaCA9IHRoaXMuX2NoIHwgMFxyXG4gIHZhciBkaCA9IHRoaXMuX2RoIHwgMFxyXG4gIHZhciBlaCA9IHRoaXMuX2VoIHwgMFxyXG4gIHZhciBmaCA9IHRoaXMuX2ZoIHwgMFxyXG4gIHZhciBnaCA9IHRoaXMuX2doIHwgMFxyXG4gIHZhciBoaCA9IHRoaXMuX2hoIHwgMFxyXG5cclxuICB2YXIgYWwgPSB0aGlzLl9hbCB8IDBcclxuICB2YXIgYmwgPSB0aGlzLl9ibCB8IDBcclxuICB2YXIgY2wgPSB0aGlzLl9jbCB8IDBcclxuICB2YXIgZGwgPSB0aGlzLl9kbCB8IDBcclxuICB2YXIgZWwgPSB0aGlzLl9lbCB8IDBcclxuICB2YXIgZmwgPSB0aGlzLl9mbCB8IDBcclxuICB2YXIgZ2wgPSB0aGlzLl9nbCB8IDBcclxuICB2YXIgaGwgPSB0aGlzLl9obCB8IDBcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzMjsgaSArPSAyKSB7XHJcbiAgICBXW2ldID0gTS5yZWFkSW50MzJCRShpICogNClcclxuICAgIFdbaSArIDFdID0gTS5yZWFkSW50MzJCRShpICogNCArIDQpXHJcbiAgfVxyXG4gIGZvciAoOyBpIDwgMTYwOyBpICs9IDIpIHtcclxuICAgIHZhciB4aCA9IFdbaSAtIDE1ICogMl1cclxuICAgIHZhciB4bCA9IFdbaSAtIDE1ICogMiArIDFdXHJcbiAgICB2YXIgZ2FtbWEwID0gR2FtbWEwKHhoLCB4bClcclxuICAgIHZhciBnYW1tYTBsID0gR2FtbWEwbCh4bCwgeGgpXHJcblxyXG4gICAgeGggPSBXW2kgLSAyICogMl1cclxuICAgIHhsID0gV1tpIC0gMiAqIDIgKyAxXVxyXG4gICAgdmFyIGdhbW1hMSA9IEdhbW1hMSh4aCwgeGwpXHJcbiAgICB2YXIgZ2FtbWExbCA9IEdhbW1hMWwoeGwsIHhoKVxyXG5cclxuICAgIC8vIFdbaV0gPSBnYW1tYTAgKyBXW2kgLSA3XSArIGdhbW1hMSArIFdbaSAtIDE2XVxyXG4gICAgdmFyIFdpN2ggPSBXW2kgLSA3ICogMl1cclxuICAgIHZhciBXaTdsID0gV1tpIC0gNyAqIDIgKyAxXVxyXG5cclxuICAgIHZhciBXaTE2aCA9IFdbaSAtIDE2ICogMl1cclxuICAgIHZhciBXaTE2bCA9IFdbaSAtIDE2ICogMiArIDFdXHJcblxyXG4gICAgdmFyIFdpbCA9IChnYW1tYTBsICsgV2k3bCkgfCAwXHJcbiAgICB2YXIgV2loID0gKGdhbW1hMCArIFdpN2ggKyBnZXRDYXJyeShXaWwsIGdhbW1hMGwpKSB8IDBcclxuICAgIFdpbCA9IChXaWwgKyBnYW1tYTFsKSB8IDBcclxuICAgIFdpaCA9IChXaWggKyBnYW1tYTEgKyBnZXRDYXJyeShXaWwsIGdhbW1hMWwpKSB8IDBcclxuICAgIFdpbCA9IChXaWwgKyBXaTE2bCkgfCAwXHJcbiAgICBXaWggPSAoV2loICsgV2kxNmggKyBnZXRDYXJyeShXaWwsIFdpMTZsKSkgfCAwXHJcblxyXG4gICAgV1tpXSA9IFdpaFxyXG4gICAgV1tpICsgMV0gPSBXaWxcclxuICB9XHJcblxyXG4gIGZvciAodmFyIGogPSAwOyBqIDwgMTYwOyBqICs9IDIpIHtcclxuICAgIFdpaCA9IFdbal1cclxuICAgIFdpbCA9IFdbaiArIDFdXHJcblxyXG4gICAgdmFyIG1hamggPSBtYWooYWgsIGJoLCBjaClcclxuICAgIHZhciBtYWpsID0gbWFqKGFsLCBibCwgY2wpXHJcblxyXG4gICAgdmFyIHNpZ21hMGggPSBzaWdtYTAoYWgsIGFsKVxyXG4gICAgdmFyIHNpZ21hMGwgPSBzaWdtYTAoYWwsIGFoKVxyXG4gICAgdmFyIHNpZ21hMWggPSBzaWdtYTEoZWgsIGVsKVxyXG4gICAgdmFyIHNpZ21hMWwgPSBzaWdtYTEoZWwsIGVoKVxyXG5cclxuICAgIC8vIHQxID0gaCArIHNpZ21hMSArIGNoICsgS1tqXSArIFdbal1cclxuICAgIHZhciBLaWggPSBLW2pdXHJcbiAgICB2YXIgS2lsID0gS1tqICsgMV1cclxuXHJcbiAgICB2YXIgY2hoID0gQ2goZWgsIGZoLCBnaClcclxuICAgIHZhciBjaGwgPSBDaChlbCwgZmwsIGdsKVxyXG5cclxuICAgIHZhciB0MWwgPSAoaGwgKyBzaWdtYTFsKSB8IDBcclxuICAgIHZhciB0MWggPSAoaGggKyBzaWdtYTFoICsgZ2V0Q2FycnkodDFsLCBobCkpIHwgMFxyXG4gICAgdDFsID0gKHQxbCArIGNobCkgfCAwXHJcbiAgICB0MWggPSAodDFoICsgY2hoICsgZ2V0Q2FycnkodDFsLCBjaGwpKSB8IDBcclxuICAgIHQxbCA9ICh0MWwgKyBLaWwpIHwgMFxyXG4gICAgdDFoID0gKHQxaCArIEtpaCArIGdldENhcnJ5KHQxbCwgS2lsKSkgfCAwXHJcbiAgICB0MWwgPSAodDFsICsgV2lsKSB8IDBcclxuICAgIHQxaCA9ICh0MWggKyBXaWggKyBnZXRDYXJyeSh0MWwsIFdpbCkpIHwgMFxyXG5cclxuICAgIC8vIHQyID0gc2lnbWEwICsgbWFqXHJcbiAgICB2YXIgdDJsID0gKHNpZ21hMGwgKyBtYWpsKSB8IDBcclxuICAgIHZhciB0MmggPSAoc2lnbWEwaCArIG1hamggKyBnZXRDYXJyeSh0MmwsIHNpZ21hMGwpKSB8IDBcclxuXHJcbiAgICBoaCA9IGdoXHJcbiAgICBobCA9IGdsXHJcbiAgICBnaCA9IGZoXHJcbiAgICBnbCA9IGZsXHJcbiAgICBmaCA9IGVoXHJcbiAgICBmbCA9IGVsXHJcbiAgICBlbCA9IChkbCArIHQxbCkgfCAwXHJcbiAgICBlaCA9IChkaCArIHQxaCArIGdldENhcnJ5KGVsLCBkbCkpIHwgMFxyXG4gICAgZGggPSBjaFxyXG4gICAgZGwgPSBjbFxyXG4gICAgY2ggPSBiaFxyXG4gICAgY2wgPSBibFxyXG4gICAgYmggPSBhaFxyXG4gICAgYmwgPSBhbFxyXG4gICAgYWwgPSAodDFsICsgdDJsKSB8IDBcclxuICAgIGFoID0gKHQxaCArIHQyaCArIGdldENhcnJ5KGFsLCB0MWwpKSB8IDBcclxuICB9XHJcblxyXG4gIHRoaXMuX2FsID0gKHRoaXMuX2FsICsgYWwpIHwgMFxyXG4gIHRoaXMuX2JsID0gKHRoaXMuX2JsICsgYmwpIHwgMFxyXG4gIHRoaXMuX2NsID0gKHRoaXMuX2NsICsgY2wpIHwgMFxyXG4gIHRoaXMuX2RsID0gKHRoaXMuX2RsICsgZGwpIHwgMFxyXG4gIHRoaXMuX2VsID0gKHRoaXMuX2VsICsgZWwpIHwgMFxyXG4gIHRoaXMuX2ZsID0gKHRoaXMuX2ZsICsgZmwpIHwgMFxyXG4gIHRoaXMuX2dsID0gKHRoaXMuX2dsICsgZ2wpIHwgMFxyXG4gIHRoaXMuX2hsID0gKHRoaXMuX2hsICsgaGwpIHwgMFxyXG5cclxuICB0aGlzLl9haCA9ICh0aGlzLl9haCArIGFoICsgZ2V0Q2FycnkodGhpcy5fYWwsIGFsKSkgfCAwXHJcbiAgdGhpcy5fYmggPSAodGhpcy5fYmggKyBiaCArIGdldENhcnJ5KHRoaXMuX2JsLCBibCkpIHwgMFxyXG4gIHRoaXMuX2NoID0gKHRoaXMuX2NoICsgY2ggKyBnZXRDYXJyeSh0aGlzLl9jbCwgY2wpKSB8IDBcclxuICB0aGlzLl9kaCA9ICh0aGlzLl9kaCArIGRoICsgZ2V0Q2FycnkodGhpcy5fZGwsIGRsKSkgfCAwXHJcbiAgdGhpcy5fZWggPSAodGhpcy5fZWggKyBlaCArIGdldENhcnJ5KHRoaXMuX2VsLCBlbCkpIHwgMFxyXG4gIHRoaXMuX2ZoID0gKHRoaXMuX2ZoICsgZmggKyBnZXRDYXJyeSh0aGlzLl9mbCwgZmwpKSB8IDBcclxuICB0aGlzLl9naCA9ICh0aGlzLl9naCArIGdoICsgZ2V0Q2FycnkodGhpcy5fZ2wsIGdsKSkgfCAwXHJcbiAgdGhpcy5faGggPSAodGhpcy5faGggKyBoaCArIGdldENhcnJ5KHRoaXMuX2hsLCBobCkpIHwgMFxyXG59XHJcblxyXG5TaGE1MTIucHJvdG90eXBlLl9oYXNoID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBIID0gQnVmZmVyLmFsbG9jVW5zYWZlKDY0KVxyXG5cclxuICBmdW5jdGlvbiB3cml0ZUludDY0QkUgKGgsIGwsIG9mZnNldCkge1xyXG4gICAgSC53cml0ZUludDMyQkUoaCwgb2Zmc2V0KVxyXG4gICAgSC53cml0ZUludDMyQkUobCwgb2Zmc2V0ICsgNClcclxuICB9XHJcblxyXG4gIHdyaXRlSW50NjRCRSh0aGlzLl9haCwgdGhpcy5fYWwsIDApXHJcbiAgd3JpdGVJbnQ2NEJFKHRoaXMuX2JoLCB0aGlzLl9ibCwgOClcclxuICB3cml0ZUludDY0QkUodGhpcy5fY2gsIHRoaXMuX2NsLCAxNilcclxuICB3cml0ZUludDY0QkUodGhpcy5fZGgsIHRoaXMuX2RsLCAyNClcclxuICB3cml0ZUludDY0QkUodGhpcy5fZWgsIHRoaXMuX2VsLCAzMilcclxuICB3cml0ZUludDY0QkUodGhpcy5fZmgsIHRoaXMuX2ZsLCA0MClcclxuICB3cml0ZUludDY0QkUodGhpcy5fZ2gsIHRoaXMuX2dsLCA0OClcclxuICB3cml0ZUludDY0QkUodGhpcy5faGgsIHRoaXMuX2hsLCA1NilcclxuXHJcbiAgcmV0dXJuIEhcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGE1MTJcclxuIiwidmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFNIQSAoYWxnb3JpdGhtKSB7XHJcbiAgYWxnb3JpdGhtID0gYWxnb3JpdGhtLnRvTG93ZXJDYXNlKClcclxuXHJcbiAgdmFyIEFsZ29yaXRobSA9IGV4cG9ydHNbYWxnb3JpdGhtXVxyXG4gIGlmICghQWxnb3JpdGhtKSB0aHJvdyBuZXcgRXJyb3IoYWxnb3JpdGhtICsgJyBpcyBub3Qgc3VwcG9ydGVkICh3ZSBhY2NlcHQgcHVsbCByZXF1ZXN0cyknKVxyXG5cclxuICByZXR1cm4gbmV3IEFsZ29yaXRobSgpXHJcbn1cclxuXHJcbmV4cG9ydHMuc2hhID0gcmVxdWlyZSgnLi9zaGEnKVxyXG5leHBvcnRzLnNoYTEgPSByZXF1aXJlKCcuL3NoYTEnKVxyXG5leHBvcnRzLnNoYTIyNCA9IHJlcXVpcmUoJy4vc2hhMjI0JylcclxuZXhwb3J0cy5zaGEyNTYgPSByZXF1aXJlKCcuL3NoYTI1NicpXHJcbmV4cG9ydHMuc2hhMzg0ID0gcmVxdWlyZSgnLi9zaGEzODQnKVxyXG5leHBvcnRzLnNoYTUxMiA9IHJlcXVpcmUoJy4vc2hhNTEyJylcclxuIiwiLyoqXHJcbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgU2VjdXJlIEhhc2ggQWxnb3JpdGhtLCBTSEEtMjU2LCBhcyBkZWZpbmVkXHJcbiAqIGluIEZJUFMgMTgwLTJcclxuICogVmVyc2lvbiAyLjItYmV0YSBDb3B5cmlnaHQgQW5nZWwgTWFyaW4sIFBhdWwgSm9obnN0b24gMjAwMCAtIDIwMDkuXHJcbiAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcclxuICpcclxuICovXHJcblxyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXHJcbnZhciBTaGEyNTYgPSByZXF1aXJlKCcuL3NoYTI1NicpXHJcbnZhciBIYXNoID0gcmVxdWlyZSgnLi9oYXNoJylcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcblxyXG52YXIgVyA9IG5ldyBBcnJheSg2NClcclxuXHJcbmZ1bmN0aW9uIFNoYTIyNCAoKSB7XHJcbiAgdGhpcy5pbml0KClcclxuXHJcbiAgdGhpcy5fdyA9IFcgLy8gbmV3IEFycmF5KDY0KVxyXG5cclxuICBIYXNoLmNhbGwodGhpcywgNjQsIDU2KVxyXG59XHJcblxyXG5pbmhlcml0cyhTaGEyMjQsIFNoYTI1NilcclxuXHJcblNoYTIyNC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLl9hID0gMHhjMTA1OWVkOFxyXG4gIHRoaXMuX2IgPSAweDM2N2NkNTA3XHJcbiAgdGhpcy5fYyA9IDB4MzA3MGRkMTdcclxuICB0aGlzLl9kID0gMHhmNzBlNTkzOVxyXG4gIHRoaXMuX2UgPSAweGZmYzAwYjMxXHJcbiAgdGhpcy5fZiA9IDB4Njg1ODE1MTFcclxuICB0aGlzLl9nID0gMHg2NGY5OGZhN1xyXG4gIHRoaXMuX2ggPSAweGJlZmE0ZmE0XHJcblxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcblNoYTIyNC5wcm90b3R5cGUuX2hhc2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIEggPSBCdWZmZXIuYWxsb2NVbnNhZmUoMjgpXHJcblxyXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2EsIDApXHJcbiAgSC53cml0ZUludDMyQkUodGhpcy5fYiwgNClcclxuICBILndyaXRlSW50MzJCRSh0aGlzLl9jLCA4KVxyXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2QsIDEyKVxyXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2UsIDE2KVxyXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2YsIDIwKVxyXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2csIDI0KVxyXG5cclxuICByZXR1cm4gSFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYTIyNFxyXG4iLCIvKlxyXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNlY3VyZSBIYXNoIEFsZ29yaXRobSwgU0hBLTEsIGFzIGRlZmluZWRcclxuICogaW4gRklQUyBQVUIgMTgwLTFcclxuICogVmVyc2lvbiAyLjFhIENvcHlyaWdodCBQYXVsIEpvaG5zdG9uIDIwMDAgLSAyMDAyLlxyXG4gKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XHJcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSBCU0QgTGljZW5zZVxyXG4gKiBTZWUgaHR0cDovL3BhamhvbWUub3JnLnVrL2NyeXB0L21kNSBmb3IgZGV0YWlscy5cclxuICovXHJcblxyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXHJcbnZhciBIYXNoID0gcmVxdWlyZSgnLi9oYXNoJylcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcblxyXG52YXIgSyA9IFtcclxuICAweDVhODI3OTk5LCAweDZlZDllYmExLCAweDhmMWJiY2RjIHwgMCwgMHhjYTYyYzFkNiB8IDBcclxuXVxyXG5cclxudmFyIFcgPSBuZXcgQXJyYXkoODApXHJcblxyXG5mdW5jdGlvbiBTaGExICgpIHtcclxuICB0aGlzLmluaXQoKVxyXG4gIHRoaXMuX3cgPSBXXHJcblxyXG4gIEhhc2guY2FsbCh0aGlzLCA2NCwgNTYpXHJcbn1cclxuXHJcbmluaGVyaXRzKFNoYTEsIEhhc2gpXHJcblxyXG5TaGExLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuX2EgPSAweDY3NDUyMzAxXHJcbiAgdGhpcy5fYiA9IDB4ZWZjZGFiODlcclxuICB0aGlzLl9jID0gMHg5OGJhZGNmZVxyXG4gIHRoaXMuX2QgPSAweDEwMzI1NDc2XHJcbiAgdGhpcy5fZSA9IDB4YzNkMmUxZjBcclxuXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuZnVuY3Rpb24gcm90bDEgKG51bSkge1xyXG4gIHJldHVybiAobnVtIDw8IDEpIHwgKG51bSA+Pj4gMzEpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJvdGw1IChudW0pIHtcclxuICByZXR1cm4gKG51bSA8PCA1KSB8IChudW0gPj4+IDI3KVxyXG59XHJcblxyXG5mdW5jdGlvbiByb3RsMzAgKG51bSkge1xyXG4gIHJldHVybiAobnVtIDw8IDMwKSB8IChudW0gPj4+IDIpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZ0IChzLCBiLCBjLCBkKSB7XHJcbiAgaWYgKHMgPT09IDApIHJldHVybiAoYiAmIGMpIHwgKCh+YikgJiBkKVxyXG4gIGlmIChzID09PSAyKSByZXR1cm4gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpXHJcbiAgcmV0dXJuIGIgXiBjIF4gZFxyXG59XHJcblxyXG5TaGExLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24gKE0pIHtcclxuICB2YXIgVyA9IHRoaXMuX3dcclxuXHJcbiAgdmFyIGEgPSB0aGlzLl9hIHwgMFxyXG4gIHZhciBiID0gdGhpcy5fYiB8IDBcclxuICB2YXIgYyA9IHRoaXMuX2MgfCAwXHJcbiAgdmFyIGQgPSB0aGlzLl9kIHwgMFxyXG4gIHZhciBlID0gdGhpcy5fZSB8IDBcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgKytpKSBXW2ldID0gTS5yZWFkSW50MzJCRShpICogNClcclxuICBmb3IgKDsgaSA8IDgwOyArK2kpIFdbaV0gPSByb3RsMShXW2kgLSAzXSBeIFdbaSAtIDhdIF4gV1tpIC0gMTRdIF4gV1tpIC0gMTZdKVxyXG5cclxuICBmb3IgKHZhciBqID0gMDsgaiA8IDgwOyArK2opIHtcclxuICAgIHZhciBzID0gfn4oaiAvIDIwKVxyXG4gICAgdmFyIHQgPSAocm90bDUoYSkgKyBmdChzLCBiLCBjLCBkKSArIGUgKyBXW2pdICsgS1tzXSkgfCAwXHJcblxyXG4gICAgZSA9IGRcclxuICAgIGQgPSBjXHJcbiAgICBjID0gcm90bDMwKGIpXHJcbiAgICBiID0gYVxyXG4gICAgYSA9IHRcclxuICB9XHJcblxyXG4gIHRoaXMuX2EgPSAoYSArIHRoaXMuX2EpIHwgMFxyXG4gIHRoaXMuX2IgPSAoYiArIHRoaXMuX2IpIHwgMFxyXG4gIHRoaXMuX2MgPSAoYyArIHRoaXMuX2MpIHwgMFxyXG4gIHRoaXMuX2QgPSAoZCArIHRoaXMuX2QpIHwgMFxyXG4gIHRoaXMuX2UgPSAoZSArIHRoaXMuX2UpIHwgMFxyXG59XHJcblxyXG5TaGExLnByb3RvdHlwZS5faGFzaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgSCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgyMClcclxuXHJcbiAgSC53cml0ZUludDMyQkUodGhpcy5fYSB8IDAsIDApXHJcbiAgSC53cml0ZUludDMyQkUodGhpcy5fYiB8IDAsIDQpXHJcbiAgSC53cml0ZUludDMyQkUodGhpcy5fYyB8IDAsIDgpXHJcbiAgSC53cml0ZUludDMyQkUodGhpcy5fZCB8IDAsIDEyKVxyXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2UgfCAwLCAxNilcclxuXHJcbiAgcmV0dXJuIEhcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGExXHJcbiIsIi8qKlxyXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNlY3VyZSBIYXNoIEFsZ29yaXRobSwgU0hBLTI1NiwgYXMgZGVmaW5lZFxyXG4gKiBpbiBGSVBTIDE4MC0yXHJcbiAqIFZlcnNpb24gMi4yLWJldGEgQ29weXJpZ2h0IEFuZ2VsIE1hcmluLCBQYXVsIEpvaG5zdG9uIDIwMDAgLSAyMDA5LlxyXG4gKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XHJcbiAqXHJcbiAqL1xyXG5cclxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxyXG52YXIgSGFzaCA9IHJlcXVpcmUoJy4vaGFzaCcpXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG5cclxudmFyIEsgPSBbXHJcbiAgMHg0MjhBMkY5OCwgMHg3MTM3NDQ5MSwgMHhCNUMwRkJDRiwgMHhFOUI1REJBNSxcclxuICAweDM5NTZDMjVCLCAweDU5RjExMUYxLCAweDkyM0Y4MkE0LCAweEFCMUM1RUQ1LFxyXG4gIDB4RDgwN0FBOTgsIDB4MTI4MzVCMDEsIDB4MjQzMTg1QkUsIDB4NTUwQzdEQzMsXHJcbiAgMHg3MkJFNUQ3NCwgMHg4MERFQjFGRSwgMHg5QkRDMDZBNywgMHhDMTlCRjE3NCxcclxuICAweEU0OUI2OUMxLCAweEVGQkU0Nzg2LCAweDBGQzE5REM2LCAweDI0MENBMUNDLFxyXG4gIDB4MkRFOTJDNkYsIDB4NEE3NDg0QUEsIDB4NUNCMEE5REMsIDB4NzZGOTg4REEsXHJcbiAgMHg5ODNFNTE1MiwgMHhBODMxQzY2RCwgMHhCMDAzMjdDOCwgMHhCRjU5N0ZDNyxcclxuICAweEM2RTAwQkYzLCAweEQ1QTc5MTQ3LCAweDA2Q0E2MzUxLCAweDE0MjkyOTY3LFxyXG4gIDB4MjdCNzBBODUsIDB4MkUxQjIxMzgsIDB4NEQyQzZERkMsIDB4NTMzODBEMTMsXHJcbiAgMHg2NTBBNzM1NCwgMHg3NjZBMEFCQiwgMHg4MUMyQzkyRSwgMHg5MjcyMkM4NSxcclxuICAweEEyQkZFOEExLCAweEE4MUE2NjRCLCAweEMyNEI4QjcwLCAweEM3NkM1MUEzLFxyXG4gIDB4RDE5MkU4MTksIDB4RDY5OTA2MjQsIDB4RjQwRTM1ODUsIDB4MTA2QUEwNzAsXHJcbiAgMHgxOUE0QzExNiwgMHgxRTM3NkMwOCwgMHgyNzQ4Nzc0QywgMHgzNEIwQkNCNSxcclxuICAweDM5MUMwQ0IzLCAweDRFRDhBQTRBLCAweDVCOUNDQTRGLCAweDY4MkU2RkYzLFxyXG4gIDB4NzQ4RjgyRUUsIDB4NzhBNTYzNkYsIDB4ODRDODc4MTQsIDB4OENDNzAyMDgsXHJcbiAgMHg5MEJFRkZGQSwgMHhBNDUwNkNFQiwgMHhCRUY5QTNGNywgMHhDNjcxNzhGMlxyXG5dXHJcblxyXG52YXIgVyA9IG5ldyBBcnJheSg2NClcclxuXHJcbmZ1bmN0aW9uIFNoYTI1NiAoKSB7XHJcbiAgdGhpcy5pbml0KClcclxuXHJcbiAgdGhpcy5fdyA9IFcgLy8gbmV3IEFycmF5KDY0KVxyXG5cclxuICBIYXNoLmNhbGwodGhpcywgNjQsIDU2KVxyXG59XHJcblxyXG5pbmhlcml0cyhTaGEyNTYsIEhhc2gpXHJcblxyXG5TaGEyNTYucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5fYSA9IDB4NmEwOWU2NjdcclxuICB0aGlzLl9iID0gMHhiYjY3YWU4NVxyXG4gIHRoaXMuX2MgPSAweDNjNmVmMzcyXHJcbiAgdGhpcy5fZCA9IDB4YTU0ZmY1M2FcclxuICB0aGlzLl9lID0gMHg1MTBlNTI3ZlxyXG4gIHRoaXMuX2YgPSAweDliMDU2ODhjXHJcbiAgdGhpcy5fZyA9IDB4MWY4M2Q5YWJcclxuICB0aGlzLl9oID0gMHg1YmUwY2QxOVxyXG5cclxuICByZXR1cm4gdGhpc1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaCAoeCwgeSwgeikge1xyXG4gIHJldHVybiB6IF4gKHggJiAoeSBeIHopKVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWogKHgsIHksIHopIHtcclxuICByZXR1cm4gKHggJiB5KSB8ICh6ICYgKHggfCB5KSlcclxufVxyXG5cclxuZnVuY3Rpb24gc2lnbWEwICh4KSB7XHJcbiAgcmV0dXJuICh4ID4+PiAyIHwgeCA8PCAzMCkgXiAoeCA+Pj4gMTMgfCB4IDw8IDE5KSBeICh4ID4+PiAyMiB8IHggPDwgMTApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNpZ21hMSAoeCkge1xyXG4gIHJldHVybiAoeCA+Pj4gNiB8IHggPDwgMjYpIF4gKHggPj4+IDExIHwgeCA8PCAyMSkgXiAoeCA+Pj4gMjUgfCB4IDw8IDcpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdhbW1hMCAoeCkge1xyXG4gIHJldHVybiAoeCA+Pj4gNyB8IHggPDwgMjUpIF4gKHggPj4+IDE4IHwgeCA8PCAxNCkgXiAoeCA+Pj4gMylcclxufVxyXG5cclxuZnVuY3Rpb24gZ2FtbWExICh4KSB7XHJcbiAgcmV0dXJuICh4ID4+PiAxNyB8IHggPDwgMTUpIF4gKHggPj4+IDE5IHwgeCA8PCAxMykgXiAoeCA+Pj4gMTApXHJcbn1cclxuXHJcblNoYTI1Ni5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChNKSB7XHJcbiAgdmFyIFcgPSB0aGlzLl93XHJcblxyXG4gIHZhciBhID0gdGhpcy5fYSB8IDBcclxuICB2YXIgYiA9IHRoaXMuX2IgfCAwXHJcbiAgdmFyIGMgPSB0aGlzLl9jIHwgMFxyXG4gIHZhciBkID0gdGhpcy5fZCB8IDBcclxuICB2YXIgZSA9IHRoaXMuX2UgfCAwXHJcbiAgdmFyIGYgPSB0aGlzLl9mIHwgMFxyXG4gIHZhciBnID0gdGhpcy5fZyB8IDBcclxuICB2YXIgaCA9IHRoaXMuX2ggfCAwXHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7ICsraSkgV1tpXSA9IE0ucmVhZEludDMyQkUoaSAqIDQpXHJcbiAgZm9yICg7IGkgPCA2NDsgKytpKSBXW2ldID0gKGdhbW1hMShXW2kgLSAyXSkgKyBXW2kgLSA3XSArIGdhbW1hMChXW2kgLSAxNV0pICsgV1tpIC0gMTZdKSB8IDBcclxuXHJcbiAgZm9yICh2YXIgaiA9IDA7IGogPCA2NDsgKytqKSB7XHJcbiAgICB2YXIgVDEgPSAoaCArIHNpZ21hMShlKSArIGNoKGUsIGYsIGcpICsgS1tqXSArIFdbal0pIHwgMFxyXG4gICAgdmFyIFQyID0gKHNpZ21hMChhKSArIG1haihhLCBiLCBjKSkgfCAwXHJcblxyXG4gICAgaCA9IGdcclxuICAgIGcgPSBmXHJcbiAgICBmID0gZVxyXG4gICAgZSA9IChkICsgVDEpIHwgMFxyXG4gICAgZCA9IGNcclxuICAgIGMgPSBiXHJcbiAgICBiID0gYVxyXG4gICAgYSA9IChUMSArIFQyKSB8IDBcclxuICB9XHJcblxyXG4gIHRoaXMuX2EgPSAoYSArIHRoaXMuX2EpIHwgMFxyXG4gIHRoaXMuX2IgPSAoYiArIHRoaXMuX2IpIHwgMFxyXG4gIHRoaXMuX2MgPSAoYyArIHRoaXMuX2MpIHwgMFxyXG4gIHRoaXMuX2QgPSAoZCArIHRoaXMuX2QpIHwgMFxyXG4gIHRoaXMuX2UgPSAoZSArIHRoaXMuX2UpIHwgMFxyXG4gIHRoaXMuX2YgPSAoZiArIHRoaXMuX2YpIHwgMFxyXG4gIHRoaXMuX2cgPSAoZyArIHRoaXMuX2cpIHwgMFxyXG4gIHRoaXMuX2ggPSAoaCArIHRoaXMuX2gpIHwgMFxyXG59XHJcblxyXG5TaGEyNTYucHJvdG90eXBlLl9oYXNoID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBIID0gQnVmZmVyLmFsbG9jVW5zYWZlKDMyKVxyXG5cclxuICBILndyaXRlSW50MzJCRSh0aGlzLl9hLCAwKVxyXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2IsIDQpXHJcbiAgSC53cml0ZUludDMyQkUodGhpcy5fYywgOClcclxuICBILndyaXRlSW50MzJCRSh0aGlzLl9kLCAxMilcclxuICBILndyaXRlSW50MzJCRSh0aGlzLl9lLCAxNilcclxuICBILndyaXRlSW50MzJCRSh0aGlzLl9mLCAyMClcclxuICBILndyaXRlSW50MzJCRSh0aGlzLl9nLCAyNClcclxuICBILndyaXRlSW50MzJCRSh0aGlzLl9oLCAyOClcclxuXHJcbiAgcmV0dXJuIEhcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGEyNTZcclxuIiwidmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcblxyXG4vLyBwcm90b3R5cGUgY2xhc3MgZm9yIGhhc2ggZnVuY3Rpb25zXHJcbmZ1bmN0aW9uIEhhc2ggKGJsb2NrU2l6ZSwgZmluYWxTaXplKSB7XHJcbiAgdGhpcy5fYmxvY2sgPSBCdWZmZXIuYWxsb2MoYmxvY2tTaXplKVxyXG4gIHRoaXMuX2ZpbmFsU2l6ZSA9IGZpbmFsU2l6ZVxyXG4gIHRoaXMuX2Jsb2NrU2l6ZSA9IGJsb2NrU2l6ZVxyXG4gIHRoaXMuX2xlbiA9IDBcclxufVxyXG5cclxuSGFzaC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRhdGEsIGVuYykge1xyXG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcclxuICAgIGVuYyA9IGVuYyB8fCAndXRmOCdcclxuICAgIGRhdGEgPSBCdWZmZXIuZnJvbShkYXRhLCBlbmMpXHJcbiAgfVxyXG5cclxuICB2YXIgYmxvY2sgPSB0aGlzLl9ibG9ja1xyXG4gIHZhciBibG9ja1NpemUgPSB0aGlzLl9ibG9ja1NpemVcclxuICB2YXIgbGVuZ3RoID0gZGF0YS5sZW5ndGhcclxuICB2YXIgYWNjdW0gPSB0aGlzLl9sZW5cclxuXHJcbiAgZm9yICh2YXIgb2Zmc2V0ID0gMDsgb2Zmc2V0IDwgbGVuZ3RoOykge1xyXG4gICAgdmFyIGFzc2lnbmVkID0gYWNjdW0gJSBibG9ja1NpemVcclxuICAgIHZhciByZW1haW5kZXIgPSBNYXRoLm1pbihsZW5ndGggLSBvZmZzZXQsIGJsb2NrU2l6ZSAtIGFzc2lnbmVkKVxyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVtYWluZGVyOyBpKyspIHtcclxuICAgICAgYmxvY2tbYXNzaWduZWQgKyBpXSA9IGRhdGFbb2Zmc2V0ICsgaV1cclxuICAgIH1cclxuXHJcbiAgICBhY2N1bSArPSByZW1haW5kZXJcclxuICAgIG9mZnNldCArPSByZW1haW5kZXJcclxuXHJcbiAgICBpZiAoKGFjY3VtICUgYmxvY2tTaXplKSA9PT0gMCkge1xyXG4gICAgICB0aGlzLl91cGRhdGUoYmxvY2spXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0aGlzLl9sZW4gKz0gbGVuZ3RoXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuSGFzaC5wcm90b3R5cGUuZGlnZXN0ID0gZnVuY3Rpb24gKGVuYykge1xyXG4gIHZhciByZW0gPSB0aGlzLl9sZW4gJSB0aGlzLl9ibG9ja1NpemVcclxuXHJcbiAgdGhpcy5fYmxvY2tbcmVtXSA9IDB4ODBcclxuXHJcbiAgLy8gemVybyAocmVtICsgMSkgdHJhaWxpbmcgYml0cywgd2hlcmUgKHJlbSArIDEpIGlzIHRoZSBzbWFsbGVzdFxyXG4gIC8vIG5vbi1uZWdhdGl2ZSBzb2x1dGlvbiB0byB0aGUgZXF1YXRpb24gKGxlbmd0aCArIDEgKyAocmVtICsgMSkpID09PSBmaW5hbFNpemUgbW9kIGJsb2NrU2l6ZVxyXG4gIHRoaXMuX2Jsb2NrLmZpbGwoMCwgcmVtICsgMSlcclxuXHJcbiAgaWYgKHJlbSA+PSB0aGlzLl9maW5hbFNpemUpIHtcclxuICAgIHRoaXMuX3VwZGF0ZSh0aGlzLl9ibG9jaylcclxuICAgIHRoaXMuX2Jsb2NrLmZpbGwoMClcclxuICB9XHJcblxyXG4gIHZhciBiaXRzID0gdGhpcy5fbGVuICogOFxyXG5cclxuICAvLyB1aW50MzJcclxuICBpZiAoYml0cyA8PSAweGZmZmZmZmZmKSB7XHJcbiAgICB0aGlzLl9ibG9jay53cml0ZVVJbnQzMkJFKGJpdHMsIHRoaXMuX2Jsb2NrU2l6ZSAtIDQpXHJcblxyXG4gIC8vIHVpbnQ2NFxyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgbG93Qml0cyA9IChiaXRzICYgMHhmZmZmZmZmZikgPj4+IDBcclxuICAgIHZhciBoaWdoQml0cyA9IChiaXRzIC0gbG93Qml0cykgLyAweDEwMDAwMDAwMFxyXG5cclxuICAgIHRoaXMuX2Jsb2NrLndyaXRlVUludDMyQkUoaGlnaEJpdHMsIHRoaXMuX2Jsb2NrU2l6ZSAtIDgpXHJcbiAgICB0aGlzLl9ibG9jay53cml0ZVVJbnQzMkJFKGxvd0JpdHMsIHRoaXMuX2Jsb2NrU2l6ZSAtIDQpXHJcbiAgfVxyXG5cclxuICB0aGlzLl91cGRhdGUodGhpcy5fYmxvY2spXHJcbiAgdmFyIGhhc2ggPSB0aGlzLl9oYXNoKClcclxuXHJcbiAgcmV0dXJuIGVuYyA/IGhhc2gudG9TdHJpbmcoZW5jKSA6IGhhc2hcclxufVxyXG5cclxuSGFzaC5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoJ191cGRhdGUgbXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcycpXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGFzaFxyXG4iLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXHJcbnZhciBTSEE1MTIgPSByZXF1aXJlKCcuL3NoYTUxMicpXHJcbnZhciBIYXNoID0gcmVxdWlyZSgnLi9oYXNoJylcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcblxyXG52YXIgVyA9IG5ldyBBcnJheSgxNjApXHJcblxyXG5mdW5jdGlvbiBTaGEzODQgKCkge1xyXG4gIHRoaXMuaW5pdCgpXHJcbiAgdGhpcy5fdyA9IFdcclxuXHJcbiAgSGFzaC5jYWxsKHRoaXMsIDEyOCwgMTEyKVxyXG59XHJcblxyXG5pbmhlcml0cyhTaGEzODQsIFNIQTUxMilcclxuXHJcblNoYTM4NC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLl9haCA9IDB4Y2JiYjlkNWRcclxuICB0aGlzLl9iaCA9IDB4NjI5YTI5MmFcclxuICB0aGlzLl9jaCA9IDB4OTE1OTAxNWFcclxuICB0aGlzLl9kaCA9IDB4MTUyZmVjZDhcclxuICB0aGlzLl9laCA9IDB4NjczMzI2NjdcclxuICB0aGlzLl9maCA9IDB4OGViNDRhODdcclxuICB0aGlzLl9naCA9IDB4ZGIwYzJlMGRcclxuICB0aGlzLl9oaCA9IDB4NDdiNTQ4MWRcclxuXHJcbiAgdGhpcy5fYWwgPSAweGMxMDU5ZWQ4XHJcbiAgdGhpcy5fYmwgPSAweDM2N2NkNTA3XHJcbiAgdGhpcy5fY2wgPSAweDMwNzBkZDE3XHJcbiAgdGhpcy5fZGwgPSAweGY3MGU1OTM5XHJcbiAgdGhpcy5fZWwgPSAweGZmYzAwYjMxXHJcbiAgdGhpcy5fZmwgPSAweDY4NTgxNTExXHJcbiAgdGhpcy5fZ2wgPSAweDY0Zjk4ZmE3XHJcbiAgdGhpcy5faGwgPSAweGJlZmE0ZmE0XHJcblxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcblNoYTM4NC5wcm90b3R5cGUuX2hhc2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIEggPSBCdWZmZXIuYWxsb2NVbnNhZmUoNDgpXHJcblxyXG4gIGZ1bmN0aW9uIHdyaXRlSW50NjRCRSAoaCwgbCwgb2Zmc2V0KSB7XHJcbiAgICBILndyaXRlSW50MzJCRShoLCBvZmZzZXQpXHJcbiAgICBILndyaXRlSW50MzJCRShsLCBvZmZzZXQgKyA0KVxyXG4gIH1cclxuXHJcbiAgd3JpdGVJbnQ2NEJFKHRoaXMuX2FoLCB0aGlzLl9hbCwgMClcclxuICB3cml0ZUludDY0QkUodGhpcy5fYmgsIHRoaXMuX2JsLCA4KVxyXG4gIHdyaXRlSW50NjRCRSh0aGlzLl9jaCwgdGhpcy5fY2wsIDE2KVxyXG4gIHdyaXRlSW50NjRCRSh0aGlzLl9kaCwgdGhpcy5fZGwsIDI0KVxyXG4gIHdyaXRlSW50NjRCRSh0aGlzLl9laCwgdGhpcy5fZWwsIDMyKVxyXG4gIHdyaXRlSW50NjRCRSh0aGlzLl9maCwgdGhpcy5fZmwsIDQwKVxyXG5cclxuICByZXR1cm4gSFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYTM4NFxyXG4iXSwic291cmNlUm9vdCI6IiJ9