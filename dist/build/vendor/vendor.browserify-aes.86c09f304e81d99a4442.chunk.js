(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.browserify-aes"],{

/***/ "/ab2":
/*!************************************************!*\
  !*** ./node_modules/browserify-aes/browser.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ciphers = __webpack_require__(/*! ./encrypter */ "iUdu")
var deciphers = __webpack_require__(/*! ./decrypter */ "QihY")
var modes = __webpack_require__(/*! ./modes/list.json */ "6F8h")

function getCiphers () {
  return Object.keys(modes)
}

exports.createCipher = exports.Cipher = ciphers.createCipher
exports.createCipheriv = exports.Cipheriv = ciphers.createCipheriv
exports.createDecipher = exports.Decipher = deciphers.createDecipher
exports.createDecipheriv = exports.Decipheriv = deciphers.createDecipheriv
exports.listCiphers = exports.getCiphers = getCiphers


/***/ }),

/***/ "6F8h":
/*!*****************************************************!*\
  !*** ./node_modules/browserify-aes/modes/list.json ***!
  \*****************************************************/
/*! exports provided: aes-128-ecb, aes-192-ecb, aes-256-ecb, aes-128-cbc, aes-192-cbc, aes-256-cbc, aes128, aes192, aes256, aes-128-cfb, aes-192-cfb, aes-256-cfb, aes-128-cfb8, aes-192-cfb8, aes-256-cfb8, aes-128-cfb1, aes-192-cfb1, aes-256-cfb1, aes-128-ofb, aes-192-ofb, aes-256-ofb, aes-128-ctr, aes-192-ctr, aes-256-ctr, aes-128-gcm, aes-192-gcm, aes-256-gcm, default */
/***/ (function(module) {

module.exports = {"aes-128-ecb":{"cipher":"AES","key":128,"iv":0,"mode":"ECB","type":"block"},"aes-192-ecb":{"cipher":"AES","key":192,"iv":0,"mode":"ECB","type":"block"},"aes-256-ecb":{"cipher":"AES","key":256,"iv":0,"mode":"ECB","type":"block"},"aes-128-cbc":{"cipher":"AES","key":128,"iv":16,"mode":"CBC","type":"block"},"aes-192-cbc":{"cipher":"AES","key":192,"iv":16,"mode":"CBC","type":"block"},"aes-256-cbc":{"cipher":"AES","key":256,"iv":16,"mode":"CBC","type":"block"},"aes128":{"cipher":"AES","key":128,"iv":16,"mode":"CBC","type":"block"},"aes192":{"cipher":"AES","key":192,"iv":16,"mode":"CBC","type":"block"},"aes256":{"cipher":"AES","key":256,"iv":16,"mode":"CBC","type":"block"},"aes-128-cfb":{"cipher":"AES","key":128,"iv":16,"mode":"CFB","type":"stream"},"aes-192-cfb":{"cipher":"AES","key":192,"iv":16,"mode":"CFB","type":"stream"},"aes-256-cfb":{"cipher":"AES","key":256,"iv":16,"mode":"CFB","type":"stream"},"aes-128-cfb8":{"cipher":"AES","key":128,"iv":16,"mode":"CFB8","type":"stream"},"aes-192-cfb8":{"cipher":"AES","key":192,"iv":16,"mode":"CFB8","type":"stream"},"aes-256-cfb8":{"cipher":"AES","key":256,"iv":16,"mode":"CFB8","type":"stream"},"aes-128-cfb1":{"cipher":"AES","key":128,"iv":16,"mode":"CFB1","type":"stream"},"aes-192-cfb1":{"cipher":"AES","key":192,"iv":16,"mode":"CFB1","type":"stream"},"aes-256-cfb1":{"cipher":"AES","key":256,"iv":16,"mode":"CFB1","type":"stream"},"aes-128-ofb":{"cipher":"AES","key":128,"iv":16,"mode":"OFB","type":"stream"},"aes-192-ofb":{"cipher":"AES","key":192,"iv":16,"mode":"OFB","type":"stream"},"aes-256-ofb":{"cipher":"AES","key":256,"iv":16,"mode":"OFB","type":"stream"},"aes-128-ctr":{"cipher":"AES","key":128,"iv":16,"mode":"CTR","type":"stream"},"aes-192-ctr":{"cipher":"AES","key":192,"iv":16,"mode":"CTR","type":"stream"},"aes-256-ctr":{"cipher":"AES","key":256,"iv":16,"mode":"CTR","type":"stream"},"aes-128-gcm":{"cipher":"AES","key":128,"iv":12,"mode":"GCM","type":"auth"},"aes-192-gcm":{"cipher":"AES","key":192,"iv":12,"mode":"GCM","type":"auth"},"aes-256-gcm":{"cipher":"AES","key":256,"iv":12,"mode":"GCM","type":"auth"}};

/***/ }),

/***/ "AUX7":
/*!**************************************************!*\
  !*** ./node_modules/browserify-aes/modes/ecb.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.encrypt = function (self, block) {
  return self._cipher.encryptBlock(block)
}

exports.decrypt = function (self, block) {
  return self._cipher.decryptBlock(block)
}


/***/ }),

/***/ "CfXC":
/*!*****************************************************!*\
  !*** ./node_modules/browserify-aes/streamCipher.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var aes = __webpack_require__(/*! ./aes */ "OfWw")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
var Transform = __webpack_require__(/*! cipher-base */ "ZDAU")
var inherits = __webpack_require__(/*! inherits */ "P7XM")

function StreamCipher (mode, key, iv, decrypt) {
  Transform.call(this)

  this._cipher = new aes.AES(key)
  this._prev = Buffer.from(iv)
  this._cache = Buffer.allocUnsafe(0)
  this._secCache = Buffer.allocUnsafe(0)
  this._decrypt = decrypt
  this._mode = mode
}

inherits(StreamCipher, Transform)

StreamCipher.prototype._update = function (chunk) {
  return this._mode.encrypt(this, chunk, this._decrypt)
}

StreamCipher.prototype._final = function () {
  this._cipher.scrub()
}

module.exports = StreamCipher


/***/ }),

/***/ "NQVK":
/*!**************************************************!*\
  !*** ./node_modules/browserify-aes/modes/cfb.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
var xor = __webpack_require__(/*! buffer-xor */ "jIre")

function encryptStart (self, data, decrypt) {
  var len = data.length
  var out = xor(data, self._cache)
  self._cache = self._cache.slice(len)
  self._prev = Buffer.concat([self._prev, decrypt ? data : out])
  return out
}

exports.encrypt = function (self, data, decrypt) {
  var out = Buffer.allocUnsafe(0)
  var len

  while (data.length) {
    if (self._cache.length === 0) {
      self._cache = self._cipher.encryptBlock(self._prev)
      self._prev = Buffer.allocUnsafe(0)
    }

    if (self._cache.length <= data.length) {
      len = self._cache.length
      out = Buffer.concat([out, encryptStart(self, data.slice(0, len), decrypt)])
      data = data.slice(len)
    } else {
      out = Buffer.concat([out, encryptStart(self, data, decrypt)])
      break
    }
  }

  return out
}


/***/ }),

/***/ "OfWw":
/*!********************************************!*\
  !*** ./node_modules/browserify-aes/aes.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// based on the aes implimentation in triple sec
// https://github.com/keybase/triplesec
// which is in turn based on the one from crypto-js
// https://code.google.com/p/crypto-js/

var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

function asUInt32Array (buf) {
  if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)

  var len = (buf.length / 4) | 0
  var out = new Array(len)

  for (var i = 0; i < len; i++) {
    out[i] = buf.readUInt32BE(i * 4)
  }

  return out
}

function scrubVec (v) {
  for (var i = 0; i < v.length; v++) {
    v[i] = 0
  }
}

function cryptBlock (M, keySchedule, SUB_MIX, SBOX, nRounds) {
  var SUB_MIX0 = SUB_MIX[0]
  var SUB_MIX1 = SUB_MIX[1]
  var SUB_MIX2 = SUB_MIX[2]
  var SUB_MIX3 = SUB_MIX[3]

  var s0 = M[0] ^ keySchedule[0]
  var s1 = M[1] ^ keySchedule[1]
  var s2 = M[2] ^ keySchedule[2]
  var s3 = M[3] ^ keySchedule[3]
  var t0, t1, t2, t3
  var ksRow = 4

  for (var round = 1; round < nRounds; round++) {
    t0 = SUB_MIX0[s0 >>> 24] ^ SUB_MIX1[(s1 >>> 16) & 0xff] ^ SUB_MIX2[(s2 >>> 8) & 0xff] ^ SUB_MIX3[s3 & 0xff] ^ keySchedule[ksRow++]
    t1 = SUB_MIX0[s1 >>> 24] ^ SUB_MIX1[(s2 >>> 16) & 0xff] ^ SUB_MIX2[(s3 >>> 8) & 0xff] ^ SUB_MIX3[s0 & 0xff] ^ keySchedule[ksRow++]
    t2 = SUB_MIX0[s2 >>> 24] ^ SUB_MIX1[(s3 >>> 16) & 0xff] ^ SUB_MIX2[(s0 >>> 8) & 0xff] ^ SUB_MIX3[s1 & 0xff] ^ keySchedule[ksRow++]
    t3 = SUB_MIX0[s3 >>> 24] ^ SUB_MIX1[(s0 >>> 16) & 0xff] ^ SUB_MIX2[(s1 >>> 8) & 0xff] ^ SUB_MIX3[s2 & 0xff] ^ keySchedule[ksRow++]
    s0 = t0
    s1 = t1
    s2 = t2
    s3 = t3
  }

  t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++]
  t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++]
  t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++]
  t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++]
  t0 = t0 >>> 0
  t1 = t1 >>> 0
  t2 = t2 >>> 0
  t3 = t3 >>> 0

  return [t0, t1, t2, t3]
}

// AES constants
var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36]
var G = (function () {
  // Compute double table
  var d = new Array(256)
  for (var j = 0; j < 256; j++) {
    if (j < 128) {
      d[j] = j << 1
    } else {
      d[j] = (j << 1) ^ 0x11b
    }
  }

  var SBOX = []
  var INV_SBOX = []
  var SUB_MIX = [[], [], [], []]
  var INV_SUB_MIX = [[], [], [], []]

  // Walk GF(2^8)
  var x = 0
  var xi = 0
  for (var i = 0; i < 256; ++i) {
    // Compute sbox
    var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4)
    sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63
    SBOX[x] = sx
    INV_SBOX[sx] = x

    // Compute multiplication
    var x2 = d[x]
    var x4 = d[x2]
    var x8 = d[x4]

    // Compute sub bytes, mix columns tables
    var t = (d[sx] * 0x101) ^ (sx * 0x1010100)
    SUB_MIX[0][x] = (t << 24) | (t >>> 8)
    SUB_MIX[1][x] = (t << 16) | (t >>> 16)
    SUB_MIX[2][x] = (t << 8) | (t >>> 24)
    SUB_MIX[3][x] = t

    // Compute inv sub bytes, inv mix columns tables
    t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100)
    INV_SUB_MIX[0][sx] = (t << 24) | (t >>> 8)
    INV_SUB_MIX[1][sx] = (t << 16) | (t >>> 16)
    INV_SUB_MIX[2][sx] = (t << 8) | (t >>> 24)
    INV_SUB_MIX[3][sx] = t

    if (x === 0) {
      x = xi = 1
    } else {
      x = x2 ^ d[d[d[x8 ^ x2]]]
      xi ^= d[d[xi]]
    }
  }

  return {
    SBOX: SBOX,
    INV_SBOX: INV_SBOX,
    SUB_MIX: SUB_MIX,
    INV_SUB_MIX: INV_SUB_MIX
  }
})()

function AES (key) {
  this._key = asUInt32Array(key)
  this._reset()
}

AES.blockSize = 4 * 4
AES.keySize = 256 / 8
AES.prototype.blockSize = AES.blockSize
AES.prototype.keySize = AES.keySize
AES.prototype._reset = function () {
  var keyWords = this._key
  var keySize = keyWords.length
  var nRounds = keySize + 6
  var ksRows = (nRounds + 1) * 4

  var keySchedule = []
  for (var k = 0; k < keySize; k++) {
    keySchedule[k] = keyWords[k]
  }

  for (k = keySize; k < ksRows; k++) {
    var t = keySchedule[k - 1]

    if (k % keySize === 0) {
      t = (t << 8) | (t >>> 24)
      t =
        (G.SBOX[t >>> 24] << 24) |
        (G.SBOX[(t >>> 16) & 0xff] << 16) |
        (G.SBOX[(t >>> 8) & 0xff] << 8) |
        (G.SBOX[t & 0xff])

      t ^= RCON[(k / keySize) | 0] << 24
    } else if (keySize > 6 && k % keySize === 4) {
      t =
        (G.SBOX[t >>> 24] << 24) |
        (G.SBOX[(t >>> 16) & 0xff] << 16) |
        (G.SBOX[(t >>> 8) & 0xff] << 8) |
        (G.SBOX[t & 0xff])
    }

    keySchedule[k] = keySchedule[k - keySize] ^ t
  }

  var invKeySchedule = []
  for (var ik = 0; ik < ksRows; ik++) {
    var ksR = ksRows - ik
    var tt = keySchedule[ksR - (ik % 4 ? 0 : 4)]

    if (ik < 4 || ksR <= 4) {
      invKeySchedule[ik] = tt
    } else {
      invKeySchedule[ik] =
        G.INV_SUB_MIX[0][G.SBOX[tt >>> 24]] ^
        G.INV_SUB_MIX[1][G.SBOX[(tt >>> 16) & 0xff]] ^
        G.INV_SUB_MIX[2][G.SBOX[(tt >>> 8) & 0xff]] ^
        G.INV_SUB_MIX[3][G.SBOX[tt & 0xff]]
    }
  }

  this._nRounds = nRounds
  this._keySchedule = keySchedule
  this._invKeySchedule = invKeySchedule
}

AES.prototype.encryptBlockRaw = function (M) {
  M = asUInt32Array(M)
  return cryptBlock(M, this._keySchedule, G.SUB_MIX, G.SBOX, this._nRounds)
}

AES.prototype.encryptBlock = function (M) {
  var out = this.encryptBlockRaw(M)
  var buf = Buffer.allocUnsafe(16)
  buf.writeUInt32BE(out[0], 0)
  buf.writeUInt32BE(out[1], 4)
  buf.writeUInt32BE(out[2], 8)
  buf.writeUInt32BE(out[3], 12)
  return buf
}

AES.prototype.decryptBlock = function (M) {
  M = asUInt32Array(M)

  // swap
  var m1 = M[1]
  M[1] = M[3]
  M[3] = m1

  var out = cryptBlock(M, this._invKeySchedule, G.INV_SUB_MIX, G.INV_SBOX, this._nRounds)
  var buf = Buffer.allocUnsafe(16)
  buf.writeUInt32BE(out[0], 0)
  buf.writeUInt32BE(out[3], 4)
  buf.writeUInt32BE(out[2], 8)
  buf.writeUInt32BE(out[1], 12)
  return buf
}

AES.prototype.scrub = function () {
  scrubVec(this._keySchedule)
  scrubVec(this._invKeySchedule)
  scrubVec(this._key)
}

module.exports.AES = AES


/***/ }),

/***/ "P2KE":
/*!**********************************************!*\
  !*** ./node_modules/browserify-aes/ghash.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
var ZEROES = Buffer.alloc(16, 0)

function toArray (buf) {
  return [
    buf.readUInt32BE(0),
    buf.readUInt32BE(4),
    buf.readUInt32BE(8),
    buf.readUInt32BE(12)
  ]
}

function fromArray (out) {
  var buf = Buffer.allocUnsafe(16)
  buf.writeUInt32BE(out[0] >>> 0, 0)
  buf.writeUInt32BE(out[1] >>> 0, 4)
  buf.writeUInt32BE(out[2] >>> 0, 8)
  buf.writeUInt32BE(out[3] >>> 0, 12)
  return buf
}

function GHASH (key) {
  this.h = key
  this.state = Buffer.alloc(16, 0)
  this.cache = Buffer.allocUnsafe(0)
}

// from http://bitwiseshiftleft.github.io/sjcl/doc/symbols/src/core_gcm.js.html
// by Juho Vähä-Herttua
GHASH.prototype.ghash = function (block) {
  var i = -1
  while (++i < block.length) {
    this.state[i] ^= block[i]
  }
  this._multiply()
}

GHASH.prototype._multiply = function () {
  var Vi = toArray(this.h)
  var Zi = [0, 0, 0, 0]
  var j, xi, lsbVi
  var i = -1
  while (++i < 128) {
    xi = (this.state[~~(i / 8)] & (1 << (7 - (i % 8)))) !== 0
    if (xi) {
      // Z_i+1 = Z_i ^ V_i
      Zi[0] ^= Vi[0]
      Zi[1] ^= Vi[1]
      Zi[2] ^= Vi[2]
      Zi[3] ^= Vi[3]
    }

    // Store the value of LSB(V_i)
    lsbVi = (Vi[3] & 1) !== 0

    // V_i+1 = V_i >> 1
    for (j = 3; j > 0; j--) {
      Vi[j] = (Vi[j] >>> 1) | ((Vi[j - 1] & 1) << 31)
    }
    Vi[0] = Vi[0] >>> 1

    // If LSB(V_i) is 1, V_i+1 = (V_i >> 1) ^ R
    if (lsbVi) {
      Vi[0] = Vi[0] ^ (0xe1 << 24)
    }
  }
  this.state = fromArray(Zi)
}

GHASH.prototype.update = function (buf) {
  this.cache = Buffer.concat([this.cache, buf])
  var chunk
  while (this.cache.length >= 16) {
    chunk = this.cache.slice(0, 16)
    this.cache = this.cache.slice(16)
    this.ghash(chunk)
  }
}

GHASH.prototype.final = function (abl, bl) {
  if (this.cache.length) {
    this.ghash(Buffer.concat([this.cache, ZEROES], 16))
  }

  this.ghash(fromArray([0, abl, 0, bl]))
  return this.state
}

module.exports = GHASH


/***/ }),

/***/ "QihY":
/*!**************************************************!*\
  !*** ./node_modules/browserify-aes/decrypter.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var AuthCipher = __webpack_require__(/*! ./authCipher */ "gvAe")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
var MODES = __webpack_require__(/*! ./modes */ "usKN")
var StreamCipher = __webpack_require__(/*! ./streamCipher */ "CfXC")
var Transform = __webpack_require__(/*! cipher-base */ "ZDAU")
var aes = __webpack_require__(/*! ./aes */ "OfWw")
var ebtk = __webpack_require__(/*! evp_bytestokey */ "roQf")
var inherits = __webpack_require__(/*! inherits */ "P7XM")

function Decipher (mode, key, iv) {
  Transform.call(this)

  this._cache = new Splitter()
  this._last = void 0
  this._cipher = new aes.AES(key)
  this._prev = Buffer.from(iv)
  this._mode = mode
  this._autopadding = true
}

inherits(Decipher, Transform)

Decipher.prototype._update = function (data) {
  this._cache.add(data)
  var chunk
  var thing
  var out = []
  while ((chunk = this._cache.get(this._autopadding))) {
    thing = this._mode.decrypt(this, chunk)
    out.push(thing)
  }
  return Buffer.concat(out)
}

Decipher.prototype._final = function () {
  var chunk = this._cache.flush()
  if (this._autopadding) {
    return unpad(this._mode.decrypt(this, chunk))
  } else if (chunk) {
    throw new Error('data not multiple of block length')
  }
}

Decipher.prototype.setAutoPadding = function (setTo) {
  this._autopadding = !!setTo
  return this
}

function Splitter () {
  this.cache = Buffer.allocUnsafe(0)
}

Splitter.prototype.add = function (data) {
  this.cache = Buffer.concat([this.cache, data])
}

Splitter.prototype.get = function (autoPadding) {
  var out
  if (autoPadding) {
    if (this.cache.length > 16) {
      out = this.cache.slice(0, 16)
      this.cache = this.cache.slice(16)
      return out
    }
  } else {
    if (this.cache.length >= 16) {
      out = this.cache.slice(0, 16)
      this.cache = this.cache.slice(16)
      return out
    }
  }

  return null
}

Splitter.prototype.flush = function () {
  if (this.cache.length) return this.cache
}

function unpad (last) {
  var padded = last[15]
  if (padded < 1 || padded > 16) {
    throw new Error('unable to decrypt data')
  }
  var i = -1
  while (++i < padded) {
    if (last[(i + (16 - padded))] !== padded) {
      throw new Error('unable to decrypt data')
    }
  }
  if (padded === 16) return

  return last.slice(0, 16 - padded)
}

function createDecipheriv (suite, password, iv) {
  var config = MODES[suite.toLowerCase()]
  if (!config) throw new TypeError('invalid suite type')

  if (typeof iv === 'string') iv = Buffer.from(iv)
  if (config.mode !== 'GCM' && iv.length !== config.iv) throw new TypeError('invalid iv length ' + iv.length)

  if (typeof password === 'string') password = Buffer.from(password)
  if (password.length !== config.key / 8) throw new TypeError('invalid key length ' + password.length)

  if (config.type === 'stream') {
    return new StreamCipher(config.module, password, iv, true)
  } else if (config.type === 'auth') {
    return new AuthCipher(config.module, password, iv, true)
  }

  return new Decipher(config.module, password, iv)
}

function createDecipher (suite, password) {
  var config = MODES[suite.toLowerCase()]
  if (!config) throw new TypeError('invalid suite type')

  var keys = ebtk(password, false, config.key, config.iv)
  return createDecipheriv(suite, keys.key, keys.iv)
}

exports.createDecipher = createDecipher
exports.createDecipheriv = createDecipheriv


/***/ }),

/***/ "UWVS":
/*!**************************************************!*\
  !*** ./node_modules/browserify-aes/modes/ofb.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var xor = __webpack_require__(/*! buffer-xor */ "jIre")

function getBlock (self) {
  self._prev = self._cipher.encryptBlock(self._prev)
  return self._prev
}

exports.encrypt = function (self, chunk) {
  while (self._cache.length < chunk.length) {
    self._cache = Buffer.concat([self._cache, getBlock(self)])
  }

  var pad = self._cache.slice(0, chunk.length)
  self._cache = self._cache.slice(chunk.length)
  return xor(chunk, pad)
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "tjlA").Buffer))

/***/ }),

/***/ "Ujlg":
/*!***************************************************!*\
  !*** ./node_modules/browserify-aes/modes/cfb1.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

function encryptByte (self, byteParam, decrypt) {
  var pad
  var i = -1
  var len = 8
  var out = 0
  var bit, value
  while (++i < len) {
    pad = self._cipher.encryptBlock(self._prev)
    bit = (byteParam & (1 << (7 - i))) ? 0x80 : 0
    value = pad[0] ^ bit
    out += ((value & 0x80) >> (i % 8))
    self._prev = shiftIn(self._prev, decrypt ? bit : value)
  }
  return out
}

function shiftIn (buffer, value) {
  var len = buffer.length
  var i = -1
  var out = Buffer.allocUnsafe(buffer.length)
  buffer = Buffer.concat([buffer, Buffer.from([value])])

  while (++i < len) {
    out[i] = buffer[i] << 1 | buffer[i + 1] >> (7)
  }

  return out
}

exports.encrypt = function (self, chunk, decrypt) {
  var len = chunk.length
  var out = Buffer.allocUnsafe(len)
  var i = -1

  while (++i < len) {
    out[i] = encryptByte(self, chunk[i], decrypt)
  }

  return out
}


/***/ }),

/***/ "YskG":
/*!***************************************************!*\
  !*** ./node_modules/browserify-aes/modes/cfb8.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

function encryptByte (self, byteParam, decrypt) {
  var pad = self._cipher.encryptBlock(self._prev)
  var out = pad[0] ^ byteParam

  self._prev = Buffer.concat([
    self._prev.slice(1),
    Buffer.from([decrypt ? byteParam : out])
  ])

  return out
}

exports.encrypt = function (self, chunk, decrypt) {
  var len = chunk.length
  var out = Buffer.allocUnsafe(len)
  var i = -1

  while (++i < len) {
    out[i] = encryptByte(self, chunk[i], decrypt)
  }

  return out
}


/***/ }),

/***/ "at63":
/*!**************************************************!*\
  !*** ./node_modules/browserify-aes/modes/ctr.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var xor = __webpack_require__(/*! buffer-xor */ "jIre")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
var incr32 = __webpack_require__(/*! ../incr32 */ "vZ2G")

function getBlock (self) {
  var out = self._cipher.encryptBlockRaw(self._prev)
  incr32(self._prev)
  return out
}

var blockSize = 16
exports.encrypt = function (self, chunk) {
  var chunkNum = Math.ceil(chunk.length / blockSize)
  var start = self._cache.length
  self._cache = Buffer.concat([
    self._cache,
    Buffer.allocUnsafe(chunkNum * blockSize)
  ])
  for (var i = 0; i < chunkNum; i++) {
    var out = getBlock(self)
    var offset = start + i * blockSize
    self._cache.writeUInt32BE(out[0], offset + 0)
    self._cache.writeUInt32BE(out[1], offset + 4)
    self._cache.writeUInt32BE(out[2], offset + 8)
    self._cache.writeUInt32BE(out[3], offset + 12)
  }
  var pad = self._cache.slice(0, chunk.length)
  self._cache = self._cache.slice(chunk.length)
  return xor(chunk, pad)
}


/***/ }),

/***/ "gvAe":
/*!***************************************************!*\
  !*** ./node_modules/browserify-aes/authCipher.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var aes = __webpack_require__(/*! ./aes */ "OfWw")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
var Transform = __webpack_require__(/*! cipher-base */ "ZDAU")
var inherits = __webpack_require__(/*! inherits */ "P7XM")
var GHASH = __webpack_require__(/*! ./ghash */ "P2KE")
var xor = __webpack_require__(/*! buffer-xor */ "jIre")
var incr32 = __webpack_require__(/*! ./incr32 */ "vZ2G")

function xorTest (a, b) {
  var out = 0
  if (a.length !== b.length) out++

  var len = Math.min(a.length, b.length)
  for (var i = 0; i < len; ++i) {
    out += (a[i] ^ b[i])
  }

  return out
}

function calcIv (self, iv, ck) {
  if (iv.length === 12) {
    self._finID = Buffer.concat([iv, Buffer.from([0, 0, 0, 1])])
    return Buffer.concat([iv, Buffer.from([0, 0, 0, 2])])
  }
  var ghash = new GHASH(ck)
  var len = iv.length
  var toPad = len % 16
  ghash.update(iv)
  if (toPad) {
    toPad = 16 - toPad
    ghash.update(Buffer.alloc(toPad, 0))
  }
  ghash.update(Buffer.alloc(8, 0))
  var ivBits = len * 8
  var tail = Buffer.alloc(8)
  tail.writeUIntBE(ivBits, 0, 8)
  ghash.update(tail)
  self._finID = ghash.state
  var out = Buffer.from(self._finID)
  incr32(out)
  return out
}
function StreamCipher (mode, key, iv, decrypt) {
  Transform.call(this)

  var h = Buffer.alloc(4, 0)

  this._cipher = new aes.AES(key)
  var ck = this._cipher.encryptBlock(h)
  this._ghash = new GHASH(ck)
  iv = calcIv(this, iv, ck)

  this._prev = Buffer.from(iv)
  this._cache = Buffer.allocUnsafe(0)
  this._secCache = Buffer.allocUnsafe(0)
  this._decrypt = decrypt
  this._alen = 0
  this._len = 0
  this._mode = mode

  this._authTag = null
  this._called = false
}

inherits(StreamCipher, Transform)

StreamCipher.prototype._update = function (chunk) {
  if (!this._called && this._alen) {
    var rump = 16 - (this._alen % 16)
    if (rump < 16) {
      rump = Buffer.alloc(rump, 0)
      this._ghash.update(rump)
    }
  }

  this._called = true
  var out = this._mode.encrypt(this, chunk)
  if (this._decrypt) {
    this._ghash.update(chunk)
  } else {
    this._ghash.update(out)
  }
  this._len += chunk.length
  return out
}

StreamCipher.prototype._final = function () {
  if (this._decrypt && !this._authTag) throw new Error('Unsupported state or unable to authenticate data')

  var tag = xor(this._ghash.final(this._alen * 8, this._len * 8), this._cipher.encryptBlock(this._finID))
  if (this._decrypt && xorTest(tag, this._authTag)) throw new Error('Unsupported state or unable to authenticate data')

  this._authTag = tag
  this._cipher.scrub()
}

StreamCipher.prototype.getAuthTag = function getAuthTag () {
  if (this._decrypt || !Buffer.isBuffer(this._authTag)) throw new Error('Attempting to get auth tag in unsupported state')

  return this._authTag
}

StreamCipher.prototype.setAuthTag = function setAuthTag (tag) {
  if (!this._decrypt) throw new Error('Attempting to set auth tag in unsupported state')

  this._authTag = tag
}

StreamCipher.prototype.setAAD = function setAAD (buf) {
  if (this._called) throw new Error('Attempting to set AAD in unsupported state')

  this._ghash.update(buf)
  this._alen += buf.length
}

module.exports = StreamCipher


/***/ }),

/***/ "iUdu":
/*!**************************************************!*\
  !*** ./node_modules/browserify-aes/encrypter.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var MODES = __webpack_require__(/*! ./modes */ "usKN")
var AuthCipher = __webpack_require__(/*! ./authCipher */ "gvAe")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
var StreamCipher = __webpack_require__(/*! ./streamCipher */ "CfXC")
var Transform = __webpack_require__(/*! cipher-base */ "ZDAU")
var aes = __webpack_require__(/*! ./aes */ "OfWw")
var ebtk = __webpack_require__(/*! evp_bytestokey */ "roQf")
var inherits = __webpack_require__(/*! inherits */ "P7XM")

function Cipher (mode, key, iv) {
  Transform.call(this)

  this._cache = new Splitter()
  this._cipher = new aes.AES(key)
  this._prev = Buffer.from(iv)
  this._mode = mode
  this._autopadding = true
}

inherits(Cipher, Transform)

Cipher.prototype._update = function (data) {
  this._cache.add(data)
  var chunk
  var thing
  var out = []

  while ((chunk = this._cache.get())) {
    thing = this._mode.encrypt(this, chunk)
    out.push(thing)
  }

  return Buffer.concat(out)
}

var PADDING = Buffer.alloc(16, 0x10)

Cipher.prototype._final = function () {
  var chunk = this._cache.flush()
  if (this._autopadding) {
    chunk = this._mode.encrypt(this, chunk)
    this._cipher.scrub()
    return chunk
  }

  if (!chunk.equals(PADDING)) {
    this._cipher.scrub()
    throw new Error('data not multiple of block length')
  }
}

Cipher.prototype.setAutoPadding = function (setTo) {
  this._autopadding = !!setTo
  return this
}

function Splitter () {
  this.cache = Buffer.allocUnsafe(0)
}

Splitter.prototype.add = function (data) {
  this.cache = Buffer.concat([this.cache, data])
}

Splitter.prototype.get = function () {
  if (this.cache.length > 15) {
    var out = this.cache.slice(0, 16)
    this.cache = this.cache.slice(16)
    return out
  }
  return null
}

Splitter.prototype.flush = function () {
  var len = 16 - this.cache.length
  var padBuff = Buffer.allocUnsafe(len)

  var i = -1
  while (++i < len) {
    padBuff.writeUInt8(len, i)
  }

  return Buffer.concat([this.cache, padBuff])
}

function createCipheriv (suite, password, iv) {
  var config = MODES[suite.toLowerCase()]
  if (!config) throw new TypeError('invalid suite type')

  if (typeof password === 'string') password = Buffer.from(password)
  if (password.length !== config.key / 8) throw new TypeError('invalid key length ' + password.length)

  if (typeof iv === 'string') iv = Buffer.from(iv)
  if (config.mode !== 'GCM' && iv.length !== config.iv) throw new TypeError('invalid iv length ' + iv.length)

  if (config.type === 'stream') {
    return new StreamCipher(config.module, password, iv)
  } else if (config.type === 'auth') {
    return new AuthCipher(config.module, password, iv)
  }

  return new Cipher(config.module, password, iv)
}

function createCipher (suite, password) {
  var config = MODES[suite.toLowerCase()]
  if (!config) throw new TypeError('invalid suite type')

  var keys = ebtk(password, false, config.key, config.iv)
  return createCipheriv(suite, keys.key, keys.iv)
}

exports.createCipheriv = createCipheriv
exports.createCipher = createCipher


/***/ }),

/***/ "usKN":
/*!****************************************************!*\
  !*** ./node_modules/browserify-aes/modes/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var modeModules = {
  ECB: __webpack_require__(/*! ./ecb */ "AUX7"),
  CBC: __webpack_require__(/*! ./cbc */ "wRn4"),
  CFB: __webpack_require__(/*! ./cfb */ "NQVK"),
  CFB8: __webpack_require__(/*! ./cfb8 */ "YskG"),
  CFB1: __webpack_require__(/*! ./cfb1 */ "Ujlg"),
  OFB: __webpack_require__(/*! ./ofb */ "UWVS"),
  CTR: __webpack_require__(/*! ./ctr */ "at63"),
  GCM: __webpack_require__(/*! ./ctr */ "at63")
}

var modes = __webpack_require__(/*! ./list.json */ "6F8h")

for (var key in modes) {
  modes[key].module = modeModules[modes[key].mode]
}

module.exports = modes


/***/ }),

/***/ "vZ2G":
/*!***********************************************!*\
  !*** ./node_modules/browserify-aes/incr32.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function incr32 (iv) {
  var len = iv.length
  var item
  while (len--) {
    item = iv.readUInt8(len)
    if (item === 255) {
      iv.writeUInt8(0, len)
    } else {
      item++
      iv.writeUInt8(item, len)
      break
    }
  }
}
module.exports = incr32


/***/ }),

/***/ "wRn4":
/*!**************************************************!*\
  !*** ./node_modules/browserify-aes/modes/cbc.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var xor = __webpack_require__(/*! buffer-xor */ "jIre")

exports.encrypt = function (self, block) {
  var data = xor(block, self._prev)

  self._prev = self._cipher.encryptBlock(data)
  return self._prev
}

exports.decrypt = function (self, block) {
  var pad = self._prev

  self._prev = block
  var out = self._cipher.decryptBlock(block)

  return xor(out, pad)
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1hZXMvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1hZXMvbW9kZXMvZWNiLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5LWFlcy9zdHJlYW1DaXBoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktYWVzL21vZGVzL2NmYi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1hZXMvYWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5LWFlcy9naGFzaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1hZXMvZGVjcnlwdGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5LWFlcy9tb2Rlcy9vZmIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktYWVzL21vZGVzL2NmYjEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktYWVzL21vZGVzL2NmYjguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktYWVzL21vZGVzL2N0ci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1hZXMvYXV0aENpcGhlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1hZXMvZW5jcnlwdGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5LWFlcy9tb2Rlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1hZXMvaW5jcjMyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5LWFlcy9tb2Rlcy9jYmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsY0FBYyxtQkFBTyxDQUFDLHlCQUFhO0FBQ25DLGdCQUFnQixtQkFBTyxDQUFDLHlCQUFhO0FBQ3JDLFlBQVksbUJBQU8sQ0FBQywrQkFBbUI7O0FBRXZDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1pBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ05BLFVBQVUsbUJBQU8sQ0FBQyxtQkFBTztBQUN6QixhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsZ0JBQWdCLG1CQUFPLENBQUMseUJBQWE7QUFDckMsZUFBZSxtQkFBTyxDQUFDLHNCQUFVOztBQUVqQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQzFCQSxhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsVUFBVSxtQkFBTyxDQUFDLHdCQUFZOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLHlCQUFhOztBQUVsQztBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLGNBQWM7QUFDL0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCQUFxQixpQkFBaUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsYUFBYTtBQUM5QjtBQUNBOztBQUVBLG1CQUFtQixZQUFZO0FBQy9COztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLGFBQWE7QUFDL0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDZEEsVUFBVSxtQkFBTyxDQUFDLHdCQUFZOztBQUU5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmJyb3dzZXJpZnktYWVzLjg2YzA5ZjMwNGU4MWQ5OWE0NDQyLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNpcGhlcnMgPSByZXF1aXJlKCcuL2VuY3J5cHRlcicpXHJcbnZhciBkZWNpcGhlcnMgPSByZXF1aXJlKCcuL2RlY3J5cHRlcicpXHJcbnZhciBtb2RlcyA9IHJlcXVpcmUoJy4vbW9kZXMvbGlzdC5qc29uJylcclxuXHJcbmZ1bmN0aW9uIGdldENpcGhlcnMgKCkge1xyXG4gIHJldHVybiBPYmplY3Qua2V5cyhtb2RlcylcclxufVxyXG5cclxuZXhwb3J0cy5jcmVhdGVDaXBoZXIgPSBleHBvcnRzLkNpcGhlciA9IGNpcGhlcnMuY3JlYXRlQ2lwaGVyXHJcbmV4cG9ydHMuY3JlYXRlQ2lwaGVyaXYgPSBleHBvcnRzLkNpcGhlcml2ID0gY2lwaGVycy5jcmVhdGVDaXBoZXJpdlxyXG5leHBvcnRzLmNyZWF0ZURlY2lwaGVyID0gZXhwb3J0cy5EZWNpcGhlciA9IGRlY2lwaGVycy5jcmVhdGVEZWNpcGhlclxyXG5leHBvcnRzLmNyZWF0ZURlY2lwaGVyaXYgPSBleHBvcnRzLkRlY2lwaGVyaXYgPSBkZWNpcGhlcnMuY3JlYXRlRGVjaXBoZXJpdlxyXG5leHBvcnRzLmxpc3RDaXBoZXJzID0gZXhwb3J0cy5nZXRDaXBoZXJzID0gZ2V0Q2lwaGVyc1xyXG4iLCJleHBvcnRzLmVuY3J5cHQgPSBmdW5jdGlvbiAoc2VsZiwgYmxvY2spIHtcclxuICByZXR1cm4gc2VsZi5fY2lwaGVyLmVuY3J5cHRCbG9jayhibG9jaylcclxufVxyXG5cclxuZXhwb3J0cy5kZWNyeXB0ID0gZnVuY3Rpb24gKHNlbGYsIGJsb2NrKSB7XHJcbiAgcmV0dXJuIHNlbGYuX2NpcGhlci5kZWNyeXB0QmxvY2soYmxvY2spXHJcbn1cclxuIiwidmFyIGFlcyA9IHJlcXVpcmUoJy4vYWVzJylcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCdjaXBoZXItYmFzZScpXHJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcclxuXHJcbmZ1bmN0aW9uIFN0cmVhbUNpcGhlciAobW9kZSwga2V5LCBpdiwgZGVjcnlwdCkge1xyXG4gIFRyYW5zZm9ybS5jYWxsKHRoaXMpXHJcblxyXG4gIHRoaXMuX2NpcGhlciA9IG5ldyBhZXMuQUVTKGtleSlcclxuICB0aGlzLl9wcmV2ID0gQnVmZmVyLmZyb20oaXYpXHJcbiAgdGhpcy5fY2FjaGUgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMClcclxuICB0aGlzLl9zZWNDYWNoZSA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgwKVxyXG4gIHRoaXMuX2RlY3J5cHQgPSBkZWNyeXB0XHJcbiAgdGhpcy5fbW9kZSA9IG1vZGVcclxufVxyXG5cclxuaW5oZXJpdHMoU3RyZWFtQ2lwaGVyLCBUcmFuc2Zvcm0pXHJcblxyXG5TdHJlYW1DaXBoZXIucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAoY2h1bmspIHtcclxuICByZXR1cm4gdGhpcy5fbW9kZS5lbmNyeXB0KHRoaXMsIGNodW5rLCB0aGlzLl9kZWNyeXB0KVxyXG59XHJcblxyXG5TdHJlYW1DaXBoZXIucHJvdG90eXBlLl9maW5hbCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLl9jaXBoZXIuc2NydWIoKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN0cmVhbUNpcGhlclxyXG4iLCJ2YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcclxudmFyIHhvciA9IHJlcXVpcmUoJ2J1ZmZlci14b3InKVxyXG5cclxuZnVuY3Rpb24gZW5jcnlwdFN0YXJ0IChzZWxmLCBkYXRhLCBkZWNyeXB0KSB7XHJcbiAgdmFyIGxlbiA9IGRhdGEubGVuZ3RoXHJcbiAgdmFyIG91dCA9IHhvcihkYXRhLCBzZWxmLl9jYWNoZSlcclxuICBzZWxmLl9jYWNoZSA9IHNlbGYuX2NhY2hlLnNsaWNlKGxlbilcclxuICBzZWxmLl9wcmV2ID0gQnVmZmVyLmNvbmNhdChbc2VsZi5fcHJldiwgZGVjcnlwdCA/IGRhdGEgOiBvdXRdKVxyXG4gIHJldHVybiBvdXRcclxufVxyXG5cclxuZXhwb3J0cy5lbmNyeXB0ID0gZnVuY3Rpb24gKHNlbGYsIGRhdGEsIGRlY3J5cHQpIHtcclxuICB2YXIgb3V0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKDApXHJcbiAgdmFyIGxlblxyXG5cclxuICB3aGlsZSAoZGF0YS5sZW5ndGgpIHtcclxuICAgIGlmIChzZWxmLl9jYWNoZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgc2VsZi5fY2FjaGUgPSBzZWxmLl9jaXBoZXIuZW5jcnlwdEJsb2NrKHNlbGYuX3ByZXYpXHJcbiAgICAgIHNlbGYuX3ByZXYgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMClcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZi5fY2FjaGUubGVuZ3RoIDw9IGRhdGEubGVuZ3RoKSB7XHJcbiAgICAgIGxlbiA9IHNlbGYuX2NhY2hlLmxlbmd0aFxyXG4gICAgICBvdXQgPSBCdWZmZXIuY29uY2F0KFtvdXQsIGVuY3J5cHRTdGFydChzZWxmLCBkYXRhLnNsaWNlKDAsIGxlbiksIGRlY3J5cHQpXSlcclxuICAgICAgZGF0YSA9IGRhdGEuc2xpY2UobGVuKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0ID0gQnVmZmVyLmNvbmNhdChbb3V0LCBlbmNyeXB0U3RhcnQoc2VsZiwgZGF0YSwgZGVjcnlwdCldKVxyXG4gICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG91dFxyXG59XHJcbiIsIi8vIGJhc2VkIG9uIHRoZSBhZXMgaW1wbGltZW50YXRpb24gaW4gdHJpcGxlIHNlY1xyXG4vLyBodHRwczovL2dpdGh1Yi5jb20va2V5YmFzZS90cmlwbGVzZWNcclxuLy8gd2hpY2ggaXMgaW4gdHVybiBiYXNlZCBvbiB0aGUgb25lIGZyb20gY3J5cHRvLWpzXHJcbi8vIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY3J5cHRvLWpzL1xyXG5cclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcblxyXG5mdW5jdGlvbiBhc1VJbnQzMkFycmF5IChidWYpIHtcclxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSBidWYgPSBCdWZmZXIuZnJvbShidWYpXHJcblxyXG4gIHZhciBsZW4gPSAoYnVmLmxlbmd0aCAvIDQpIHwgMFxyXG4gIHZhciBvdXQgPSBuZXcgQXJyYXkobGVuKVxyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICBvdXRbaV0gPSBidWYucmVhZFVJbnQzMkJFKGkgKiA0KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG91dFxyXG59XHJcblxyXG5mdW5jdGlvbiBzY3J1YlZlYyAodikge1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdi5sZW5ndGg7IHYrKykge1xyXG4gICAgdltpXSA9IDBcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyeXB0QmxvY2sgKE0sIGtleVNjaGVkdWxlLCBTVUJfTUlYLCBTQk9YLCBuUm91bmRzKSB7XHJcbiAgdmFyIFNVQl9NSVgwID0gU1VCX01JWFswXVxyXG4gIHZhciBTVUJfTUlYMSA9IFNVQl9NSVhbMV1cclxuICB2YXIgU1VCX01JWDIgPSBTVUJfTUlYWzJdXHJcbiAgdmFyIFNVQl9NSVgzID0gU1VCX01JWFszXVxyXG5cclxuICB2YXIgczAgPSBNWzBdIF4ga2V5U2NoZWR1bGVbMF1cclxuICB2YXIgczEgPSBNWzFdIF4ga2V5U2NoZWR1bGVbMV1cclxuICB2YXIgczIgPSBNWzJdIF4ga2V5U2NoZWR1bGVbMl1cclxuICB2YXIgczMgPSBNWzNdIF4ga2V5U2NoZWR1bGVbM11cclxuICB2YXIgdDAsIHQxLCB0MiwgdDNcclxuICB2YXIga3NSb3cgPSA0XHJcblxyXG4gIGZvciAodmFyIHJvdW5kID0gMTsgcm91bmQgPCBuUm91bmRzOyByb3VuZCsrKSB7XHJcbiAgICB0MCA9IFNVQl9NSVgwW3MwID4+PiAyNF0gXiBTVUJfTUlYMVsoczEgPj4+IDE2KSAmIDB4ZmZdIF4gU1VCX01JWDJbKHMyID4+PiA4KSAmIDB4ZmZdIF4gU1VCX01JWDNbczMgJiAweGZmXSBeIGtleVNjaGVkdWxlW2tzUm93KytdXHJcbiAgICB0MSA9IFNVQl9NSVgwW3MxID4+PiAyNF0gXiBTVUJfTUlYMVsoczIgPj4+IDE2KSAmIDB4ZmZdIF4gU1VCX01JWDJbKHMzID4+PiA4KSAmIDB4ZmZdIF4gU1VCX01JWDNbczAgJiAweGZmXSBeIGtleVNjaGVkdWxlW2tzUm93KytdXHJcbiAgICB0MiA9IFNVQl9NSVgwW3MyID4+PiAyNF0gXiBTVUJfTUlYMVsoczMgPj4+IDE2KSAmIDB4ZmZdIF4gU1VCX01JWDJbKHMwID4+PiA4KSAmIDB4ZmZdIF4gU1VCX01JWDNbczEgJiAweGZmXSBeIGtleVNjaGVkdWxlW2tzUm93KytdXHJcbiAgICB0MyA9IFNVQl9NSVgwW3MzID4+PiAyNF0gXiBTVUJfTUlYMVsoczAgPj4+IDE2KSAmIDB4ZmZdIF4gU1VCX01JWDJbKHMxID4+PiA4KSAmIDB4ZmZdIF4gU1VCX01JWDNbczIgJiAweGZmXSBeIGtleVNjaGVkdWxlW2tzUm93KytdXHJcbiAgICBzMCA9IHQwXHJcbiAgICBzMSA9IHQxXHJcbiAgICBzMiA9IHQyXHJcbiAgICBzMyA9IHQzXHJcbiAgfVxyXG5cclxuICB0MCA9ICgoU0JPWFtzMCA+Pj4gMjRdIDw8IDI0KSB8IChTQk9YWyhzMSA+Pj4gMTYpICYgMHhmZl0gPDwgMTYpIHwgKFNCT1hbKHMyID4+PiA4KSAmIDB4ZmZdIDw8IDgpIHwgU0JPWFtzMyAmIDB4ZmZdKSBeIGtleVNjaGVkdWxlW2tzUm93KytdXHJcbiAgdDEgPSAoKFNCT1hbczEgPj4+IDI0XSA8PCAyNCkgfCAoU0JPWFsoczIgPj4+IDE2KSAmIDB4ZmZdIDw8IDE2KSB8IChTQk9YWyhzMyA+Pj4gOCkgJiAweGZmXSA8PCA4KSB8IFNCT1hbczAgJiAweGZmXSkgXiBrZXlTY2hlZHVsZVtrc1JvdysrXVxyXG4gIHQyID0gKChTQk9YW3MyID4+PiAyNF0gPDwgMjQpIHwgKFNCT1hbKHMzID4+PiAxNikgJiAweGZmXSA8PCAxNikgfCAoU0JPWFsoczAgPj4+IDgpICYgMHhmZl0gPDwgOCkgfCBTQk9YW3MxICYgMHhmZl0pIF4ga2V5U2NoZWR1bGVba3NSb3crK11cclxuICB0MyA9ICgoU0JPWFtzMyA+Pj4gMjRdIDw8IDI0KSB8IChTQk9YWyhzMCA+Pj4gMTYpICYgMHhmZl0gPDwgMTYpIHwgKFNCT1hbKHMxID4+PiA4KSAmIDB4ZmZdIDw8IDgpIHwgU0JPWFtzMiAmIDB4ZmZdKSBeIGtleVNjaGVkdWxlW2tzUm93KytdXHJcbiAgdDAgPSB0MCA+Pj4gMFxyXG4gIHQxID0gdDEgPj4+IDBcclxuICB0MiA9IHQyID4+PiAwXHJcbiAgdDMgPSB0MyA+Pj4gMFxyXG5cclxuICByZXR1cm4gW3QwLCB0MSwgdDIsIHQzXVxyXG59XHJcblxyXG4vLyBBRVMgY29uc3RhbnRzXHJcbnZhciBSQ09OID0gWzB4MDAsIDB4MDEsIDB4MDIsIDB4MDQsIDB4MDgsIDB4MTAsIDB4MjAsIDB4NDAsIDB4ODAsIDB4MWIsIDB4MzZdXHJcbnZhciBHID0gKGZ1bmN0aW9uICgpIHtcclxuICAvLyBDb21wdXRlIGRvdWJsZSB0YWJsZVxyXG4gIHZhciBkID0gbmV3IEFycmF5KDI1NilcclxuICBmb3IgKHZhciBqID0gMDsgaiA8IDI1NjsgaisrKSB7XHJcbiAgICBpZiAoaiA8IDEyOCkge1xyXG4gICAgICBkW2pdID0gaiA8PCAxXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkW2pdID0gKGogPDwgMSkgXiAweDExYlxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIFNCT1ggPSBbXVxyXG4gIHZhciBJTlZfU0JPWCA9IFtdXHJcbiAgdmFyIFNVQl9NSVggPSBbW10sIFtdLCBbXSwgW11dXHJcbiAgdmFyIElOVl9TVUJfTUlYID0gW1tdLCBbXSwgW10sIFtdXVxyXG5cclxuICAvLyBXYWxrIEdGKDJeOClcclxuICB2YXIgeCA9IDBcclxuICB2YXIgeGkgPSAwXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xyXG4gICAgLy8gQ29tcHV0ZSBzYm94XHJcbiAgICB2YXIgc3ggPSB4aSBeICh4aSA8PCAxKSBeICh4aSA8PCAyKSBeICh4aSA8PCAzKSBeICh4aSA8PCA0KVxyXG4gICAgc3ggPSAoc3ggPj4+IDgpIF4gKHN4ICYgMHhmZikgXiAweDYzXHJcbiAgICBTQk9YW3hdID0gc3hcclxuICAgIElOVl9TQk9YW3N4XSA9IHhcclxuXHJcbiAgICAvLyBDb21wdXRlIG11bHRpcGxpY2F0aW9uXHJcbiAgICB2YXIgeDIgPSBkW3hdXHJcbiAgICB2YXIgeDQgPSBkW3gyXVxyXG4gICAgdmFyIHg4ID0gZFt4NF1cclxuXHJcbiAgICAvLyBDb21wdXRlIHN1YiBieXRlcywgbWl4IGNvbHVtbnMgdGFibGVzXHJcbiAgICB2YXIgdCA9IChkW3N4XSAqIDB4MTAxKSBeIChzeCAqIDB4MTAxMDEwMClcclxuICAgIFNVQl9NSVhbMF1beF0gPSAodCA8PCAyNCkgfCAodCA+Pj4gOClcclxuICAgIFNVQl9NSVhbMV1beF0gPSAodCA8PCAxNikgfCAodCA+Pj4gMTYpXHJcbiAgICBTVUJfTUlYWzJdW3hdID0gKHQgPDwgOCkgfCAodCA+Pj4gMjQpXHJcbiAgICBTVUJfTUlYWzNdW3hdID0gdFxyXG5cclxuICAgIC8vIENvbXB1dGUgaW52IHN1YiBieXRlcywgaW52IG1peCBjb2x1bW5zIHRhYmxlc1xyXG4gICAgdCA9ICh4OCAqIDB4MTAxMDEwMSkgXiAoeDQgKiAweDEwMDAxKSBeICh4MiAqIDB4MTAxKSBeICh4ICogMHgxMDEwMTAwKVxyXG4gICAgSU5WX1NVQl9NSVhbMF1bc3hdID0gKHQgPDwgMjQpIHwgKHQgPj4+IDgpXHJcbiAgICBJTlZfU1VCX01JWFsxXVtzeF0gPSAodCA8PCAxNikgfCAodCA+Pj4gMTYpXHJcbiAgICBJTlZfU1VCX01JWFsyXVtzeF0gPSAodCA8PCA4KSB8ICh0ID4+PiAyNClcclxuICAgIElOVl9TVUJfTUlYWzNdW3N4XSA9IHRcclxuXHJcbiAgICBpZiAoeCA9PT0gMCkge1xyXG4gICAgICB4ID0geGkgPSAxXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB4ID0geDIgXiBkW2RbZFt4OCBeIHgyXV1dXHJcbiAgICAgIHhpIF49IGRbZFt4aV1dXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgU0JPWDogU0JPWCxcclxuICAgIElOVl9TQk9YOiBJTlZfU0JPWCxcclxuICAgIFNVQl9NSVg6IFNVQl9NSVgsXHJcbiAgICBJTlZfU1VCX01JWDogSU5WX1NVQl9NSVhcclxuICB9XHJcbn0pKClcclxuXHJcbmZ1bmN0aW9uIEFFUyAoa2V5KSB7XHJcbiAgdGhpcy5fa2V5ID0gYXNVSW50MzJBcnJheShrZXkpXHJcbiAgdGhpcy5fcmVzZXQoKVxyXG59XHJcblxyXG5BRVMuYmxvY2tTaXplID0gNCAqIDRcclxuQUVTLmtleVNpemUgPSAyNTYgLyA4XHJcbkFFUy5wcm90b3R5cGUuYmxvY2tTaXplID0gQUVTLmJsb2NrU2l6ZVxyXG5BRVMucHJvdG90eXBlLmtleVNpemUgPSBBRVMua2V5U2l6ZVxyXG5BRVMucHJvdG90eXBlLl9yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIga2V5V29yZHMgPSB0aGlzLl9rZXlcclxuICB2YXIga2V5U2l6ZSA9IGtleVdvcmRzLmxlbmd0aFxyXG4gIHZhciBuUm91bmRzID0ga2V5U2l6ZSArIDZcclxuICB2YXIga3NSb3dzID0gKG5Sb3VuZHMgKyAxKSAqIDRcclxuXHJcbiAgdmFyIGtleVNjaGVkdWxlID0gW11cclxuICBmb3IgKHZhciBrID0gMDsgayA8IGtleVNpemU7IGsrKykge1xyXG4gICAga2V5U2NoZWR1bGVba10gPSBrZXlXb3Jkc1trXVxyXG4gIH1cclxuXHJcbiAgZm9yIChrID0ga2V5U2l6ZTsgayA8IGtzUm93czsgaysrKSB7XHJcbiAgICB2YXIgdCA9IGtleVNjaGVkdWxlW2sgLSAxXVxyXG5cclxuICAgIGlmIChrICUga2V5U2l6ZSA9PT0gMCkge1xyXG4gICAgICB0ID0gKHQgPDwgOCkgfCAodCA+Pj4gMjQpXHJcbiAgICAgIHQgPVxyXG4gICAgICAgIChHLlNCT1hbdCA+Pj4gMjRdIDw8IDI0KSB8XHJcbiAgICAgICAgKEcuU0JPWFsodCA+Pj4gMTYpICYgMHhmZl0gPDwgMTYpIHxcclxuICAgICAgICAoRy5TQk9YWyh0ID4+PiA4KSAmIDB4ZmZdIDw8IDgpIHxcclxuICAgICAgICAoRy5TQk9YW3QgJiAweGZmXSlcclxuXHJcbiAgICAgIHQgXj0gUkNPTlsoayAvIGtleVNpemUpIHwgMF0gPDwgMjRcclxuICAgIH0gZWxzZSBpZiAoa2V5U2l6ZSA+IDYgJiYgayAlIGtleVNpemUgPT09IDQpIHtcclxuICAgICAgdCA9XHJcbiAgICAgICAgKEcuU0JPWFt0ID4+PiAyNF0gPDwgMjQpIHxcclxuICAgICAgICAoRy5TQk9YWyh0ID4+PiAxNikgJiAweGZmXSA8PCAxNikgfFxyXG4gICAgICAgIChHLlNCT1hbKHQgPj4+IDgpICYgMHhmZl0gPDwgOCkgfFxyXG4gICAgICAgIChHLlNCT1hbdCAmIDB4ZmZdKVxyXG4gICAgfVxyXG5cclxuICAgIGtleVNjaGVkdWxlW2tdID0ga2V5U2NoZWR1bGVbayAtIGtleVNpemVdIF4gdFxyXG4gIH1cclxuXHJcbiAgdmFyIGludktleVNjaGVkdWxlID0gW11cclxuICBmb3IgKHZhciBpayA9IDA7IGlrIDwga3NSb3dzOyBpaysrKSB7XHJcbiAgICB2YXIga3NSID0ga3NSb3dzIC0gaWtcclxuICAgIHZhciB0dCA9IGtleVNjaGVkdWxlW2tzUiAtIChpayAlIDQgPyAwIDogNCldXHJcblxyXG4gICAgaWYgKGlrIDwgNCB8fCBrc1IgPD0gNCkge1xyXG4gICAgICBpbnZLZXlTY2hlZHVsZVtpa10gPSB0dFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaW52S2V5U2NoZWR1bGVbaWtdID1cclxuICAgICAgICBHLklOVl9TVUJfTUlYWzBdW0cuU0JPWFt0dCA+Pj4gMjRdXSBeXHJcbiAgICAgICAgRy5JTlZfU1VCX01JWFsxXVtHLlNCT1hbKHR0ID4+PiAxNikgJiAweGZmXV0gXlxyXG4gICAgICAgIEcuSU5WX1NVQl9NSVhbMl1bRy5TQk9YWyh0dCA+Pj4gOCkgJiAweGZmXV0gXlxyXG4gICAgICAgIEcuSU5WX1NVQl9NSVhbM11bRy5TQk9YW3R0ICYgMHhmZl1dXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0aGlzLl9uUm91bmRzID0gblJvdW5kc1xyXG4gIHRoaXMuX2tleVNjaGVkdWxlID0ga2V5U2NoZWR1bGVcclxuICB0aGlzLl9pbnZLZXlTY2hlZHVsZSA9IGludktleVNjaGVkdWxlXHJcbn1cclxuXHJcbkFFUy5wcm90b3R5cGUuZW5jcnlwdEJsb2NrUmF3ID0gZnVuY3Rpb24gKE0pIHtcclxuICBNID0gYXNVSW50MzJBcnJheShNKVxyXG4gIHJldHVybiBjcnlwdEJsb2NrKE0sIHRoaXMuX2tleVNjaGVkdWxlLCBHLlNVQl9NSVgsIEcuU0JPWCwgdGhpcy5fblJvdW5kcylcclxufVxyXG5cclxuQUVTLnByb3RvdHlwZS5lbmNyeXB0QmxvY2sgPSBmdW5jdGlvbiAoTSkge1xyXG4gIHZhciBvdXQgPSB0aGlzLmVuY3J5cHRCbG9ja1JhdyhNKVxyXG4gIHZhciBidWYgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMTYpXHJcbiAgYnVmLndyaXRlVUludDMyQkUob3V0WzBdLCAwKVxyXG4gIGJ1Zi53cml0ZVVJbnQzMkJFKG91dFsxXSwgNClcclxuICBidWYud3JpdGVVSW50MzJCRShvdXRbMl0sIDgpXHJcbiAgYnVmLndyaXRlVUludDMyQkUob3V0WzNdLCAxMilcclxuICByZXR1cm4gYnVmXHJcbn1cclxuXHJcbkFFUy5wcm90b3R5cGUuZGVjcnlwdEJsb2NrID0gZnVuY3Rpb24gKE0pIHtcclxuICBNID0gYXNVSW50MzJBcnJheShNKVxyXG5cclxuICAvLyBzd2FwXHJcbiAgdmFyIG0xID0gTVsxXVxyXG4gIE1bMV0gPSBNWzNdXHJcbiAgTVszXSA9IG0xXHJcblxyXG4gIHZhciBvdXQgPSBjcnlwdEJsb2NrKE0sIHRoaXMuX2ludktleVNjaGVkdWxlLCBHLklOVl9TVUJfTUlYLCBHLklOVl9TQk9YLCB0aGlzLl9uUm91bmRzKVxyXG4gIHZhciBidWYgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMTYpXHJcbiAgYnVmLndyaXRlVUludDMyQkUob3V0WzBdLCAwKVxyXG4gIGJ1Zi53cml0ZVVJbnQzMkJFKG91dFszXSwgNClcclxuICBidWYud3JpdGVVSW50MzJCRShvdXRbMl0sIDgpXHJcbiAgYnVmLndyaXRlVUludDMyQkUob3V0WzFdLCAxMilcclxuICByZXR1cm4gYnVmXHJcbn1cclxuXHJcbkFFUy5wcm90b3R5cGUuc2NydWIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgc2NydWJWZWModGhpcy5fa2V5U2NoZWR1bGUpXHJcbiAgc2NydWJWZWModGhpcy5faW52S2V5U2NoZWR1bGUpXHJcbiAgc2NydWJWZWModGhpcy5fa2V5KVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5BRVMgPSBBRVNcclxuIiwidmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcbnZhciBaRVJPRVMgPSBCdWZmZXIuYWxsb2MoMTYsIDApXHJcblxyXG5mdW5jdGlvbiB0b0FycmF5IChidWYpIHtcclxuICByZXR1cm4gW1xyXG4gICAgYnVmLnJlYWRVSW50MzJCRSgwKSxcclxuICAgIGJ1Zi5yZWFkVUludDMyQkUoNCksXHJcbiAgICBidWYucmVhZFVJbnQzMkJFKDgpLFxyXG4gICAgYnVmLnJlYWRVSW50MzJCRSgxMilcclxuICBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZyb21BcnJheSAob3V0KSB7XHJcbiAgdmFyIGJ1ZiA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgxNilcclxuICBidWYud3JpdGVVSW50MzJCRShvdXRbMF0gPj4+IDAsIDApXHJcbiAgYnVmLndyaXRlVUludDMyQkUob3V0WzFdID4+PiAwLCA0KVxyXG4gIGJ1Zi53cml0ZVVJbnQzMkJFKG91dFsyXSA+Pj4gMCwgOClcclxuICBidWYud3JpdGVVSW50MzJCRShvdXRbM10gPj4+IDAsIDEyKVxyXG4gIHJldHVybiBidWZcclxufVxyXG5cclxuZnVuY3Rpb24gR0hBU0ggKGtleSkge1xyXG4gIHRoaXMuaCA9IGtleVxyXG4gIHRoaXMuc3RhdGUgPSBCdWZmZXIuYWxsb2MoMTYsIDApXHJcbiAgdGhpcy5jYWNoZSA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgwKVxyXG59XHJcblxyXG4vLyBmcm9tIGh0dHA6Ly9iaXR3aXNlc2hpZnRsZWZ0LmdpdGh1Yi5pby9zamNsL2RvYy9zeW1ib2xzL3NyYy9jb3JlX2djbS5qcy5odG1sXHJcbi8vIGJ5IEp1aG8gVsOkaMOkLUhlcnR0dWFcclxuR0hBU0gucHJvdG90eXBlLmdoYXNoID0gZnVuY3Rpb24gKGJsb2NrKSB7XHJcbiAgdmFyIGkgPSAtMVxyXG4gIHdoaWxlICgrK2kgPCBibG9jay5sZW5ndGgpIHtcclxuICAgIHRoaXMuc3RhdGVbaV0gXj0gYmxvY2tbaV1cclxuICB9XHJcbiAgdGhpcy5fbXVsdGlwbHkoKVxyXG59XHJcblxyXG5HSEFTSC5wcm90b3R5cGUuX211bHRpcGx5ID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBWaSA9IHRvQXJyYXkodGhpcy5oKVxyXG4gIHZhciBaaSA9IFswLCAwLCAwLCAwXVxyXG4gIHZhciBqLCB4aSwgbHNiVmlcclxuICB2YXIgaSA9IC0xXHJcbiAgd2hpbGUgKCsraSA8IDEyOCkge1xyXG4gICAgeGkgPSAodGhpcy5zdGF0ZVt+fihpIC8gOCldICYgKDEgPDwgKDcgLSAoaSAlIDgpKSkpICE9PSAwXHJcbiAgICBpZiAoeGkpIHtcclxuICAgICAgLy8gWl9pKzEgPSBaX2kgXiBWX2lcclxuICAgICAgWmlbMF0gXj0gVmlbMF1cclxuICAgICAgWmlbMV0gXj0gVmlbMV1cclxuICAgICAgWmlbMl0gXj0gVmlbMl1cclxuICAgICAgWmlbM10gXj0gVmlbM11cclxuICAgIH1cclxuXHJcbiAgICAvLyBTdG9yZSB0aGUgdmFsdWUgb2YgTFNCKFZfaSlcclxuICAgIGxzYlZpID0gKFZpWzNdICYgMSkgIT09IDBcclxuXHJcbiAgICAvLyBWX2krMSA9IFZfaSA+PiAxXHJcbiAgICBmb3IgKGogPSAzOyBqID4gMDsgai0tKSB7XHJcbiAgICAgIFZpW2pdID0gKFZpW2pdID4+PiAxKSB8ICgoVmlbaiAtIDFdICYgMSkgPDwgMzEpXHJcbiAgICB9XHJcbiAgICBWaVswXSA9IFZpWzBdID4+PiAxXHJcblxyXG4gICAgLy8gSWYgTFNCKFZfaSkgaXMgMSwgVl9pKzEgPSAoVl9pID4+IDEpIF4gUlxyXG4gICAgaWYgKGxzYlZpKSB7XHJcbiAgICAgIFZpWzBdID0gVmlbMF0gXiAoMHhlMSA8PCAyNClcclxuICAgIH1cclxuICB9XHJcbiAgdGhpcy5zdGF0ZSA9IGZyb21BcnJheShaaSlcclxufVxyXG5cclxuR0hBU0gucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChidWYpIHtcclxuICB0aGlzLmNhY2hlID0gQnVmZmVyLmNvbmNhdChbdGhpcy5jYWNoZSwgYnVmXSlcclxuICB2YXIgY2h1bmtcclxuICB3aGlsZSAodGhpcy5jYWNoZS5sZW5ndGggPj0gMTYpIHtcclxuICAgIGNodW5rID0gdGhpcy5jYWNoZS5zbGljZSgwLCAxNilcclxuICAgIHRoaXMuY2FjaGUgPSB0aGlzLmNhY2hlLnNsaWNlKDE2KVxyXG4gICAgdGhpcy5naGFzaChjaHVuaylcclxuICB9XHJcbn1cclxuXHJcbkdIQVNILnByb3RvdHlwZS5maW5hbCA9IGZ1bmN0aW9uIChhYmwsIGJsKSB7XHJcbiAgaWYgKHRoaXMuY2FjaGUubGVuZ3RoKSB7XHJcbiAgICB0aGlzLmdoYXNoKEJ1ZmZlci5jb25jYXQoW3RoaXMuY2FjaGUsIFpFUk9FU10sIDE2KSlcclxuICB9XHJcblxyXG4gIHRoaXMuZ2hhc2goZnJvbUFycmF5KFswLCBhYmwsIDAsIGJsXSkpXHJcbiAgcmV0dXJuIHRoaXMuc3RhdGVcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHSEFTSFxyXG4iLCJ2YXIgQXV0aENpcGhlciA9IHJlcXVpcmUoJy4vYXV0aENpcGhlcicpXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG52YXIgTU9ERVMgPSByZXF1aXJlKCcuL21vZGVzJylcclxudmFyIFN0cmVhbUNpcGhlciA9IHJlcXVpcmUoJy4vc3RyZWFtQ2lwaGVyJylcclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJ2NpcGhlci1iYXNlJylcclxudmFyIGFlcyA9IHJlcXVpcmUoJy4vYWVzJylcclxudmFyIGVidGsgPSByZXF1aXJlKCdldnBfYnl0ZXN0b2tleScpXHJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcclxuXHJcbmZ1bmN0aW9uIERlY2lwaGVyIChtb2RlLCBrZXksIGl2KSB7XHJcbiAgVHJhbnNmb3JtLmNhbGwodGhpcylcclxuXHJcbiAgdGhpcy5fY2FjaGUgPSBuZXcgU3BsaXR0ZXIoKVxyXG4gIHRoaXMuX2xhc3QgPSB2b2lkIDBcclxuICB0aGlzLl9jaXBoZXIgPSBuZXcgYWVzLkFFUyhrZXkpXHJcbiAgdGhpcy5fcHJldiA9IEJ1ZmZlci5mcm9tKGl2KVxyXG4gIHRoaXMuX21vZGUgPSBtb2RlXHJcbiAgdGhpcy5fYXV0b3BhZGRpbmcgPSB0cnVlXHJcbn1cclxuXHJcbmluaGVyaXRzKERlY2lwaGVyLCBUcmFuc2Zvcm0pXHJcblxyXG5EZWNpcGhlci5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgdGhpcy5fY2FjaGUuYWRkKGRhdGEpXHJcbiAgdmFyIGNodW5rXHJcbiAgdmFyIHRoaW5nXHJcbiAgdmFyIG91dCA9IFtdXHJcbiAgd2hpbGUgKChjaHVuayA9IHRoaXMuX2NhY2hlLmdldCh0aGlzLl9hdXRvcGFkZGluZykpKSB7XHJcbiAgICB0aGluZyA9IHRoaXMuX21vZGUuZGVjcnlwdCh0aGlzLCBjaHVuaylcclxuICAgIG91dC5wdXNoKHRoaW5nKVxyXG4gIH1cclxuICByZXR1cm4gQnVmZmVyLmNvbmNhdChvdXQpXHJcbn1cclxuXHJcbkRlY2lwaGVyLnByb3RvdHlwZS5fZmluYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGNodW5rID0gdGhpcy5fY2FjaGUuZmx1c2goKVxyXG4gIGlmICh0aGlzLl9hdXRvcGFkZGluZykge1xyXG4gICAgcmV0dXJuIHVucGFkKHRoaXMuX21vZGUuZGVjcnlwdCh0aGlzLCBjaHVuaykpXHJcbiAgfSBlbHNlIGlmIChjaHVuaykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdkYXRhIG5vdCBtdWx0aXBsZSBvZiBibG9jayBsZW5ndGgnKVxyXG4gIH1cclxufVxyXG5cclxuRGVjaXBoZXIucHJvdG90eXBlLnNldEF1dG9QYWRkaW5nID0gZnVuY3Rpb24gKHNldFRvKSB7XHJcbiAgdGhpcy5fYXV0b3BhZGRpbmcgPSAhIXNldFRvXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuZnVuY3Rpb24gU3BsaXR0ZXIgKCkge1xyXG4gIHRoaXMuY2FjaGUgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMClcclxufVxyXG5cclxuU3BsaXR0ZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgdGhpcy5jYWNoZSA9IEJ1ZmZlci5jb25jYXQoW3RoaXMuY2FjaGUsIGRhdGFdKVxyXG59XHJcblxyXG5TcGxpdHRlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGF1dG9QYWRkaW5nKSB7XHJcbiAgdmFyIG91dFxyXG4gIGlmIChhdXRvUGFkZGluZykge1xyXG4gICAgaWYgKHRoaXMuY2FjaGUubGVuZ3RoID4gMTYpIHtcclxuICAgICAgb3V0ID0gdGhpcy5jYWNoZS5zbGljZSgwLCAxNilcclxuICAgICAgdGhpcy5jYWNoZSA9IHRoaXMuY2FjaGUuc2xpY2UoMTYpXHJcbiAgICAgIHJldHVybiBvdXRcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKHRoaXMuY2FjaGUubGVuZ3RoID49IDE2KSB7XHJcbiAgICAgIG91dCA9IHRoaXMuY2FjaGUuc2xpY2UoMCwgMTYpXHJcbiAgICAgIHRoaXMuY2FjaGUgPSB0aGlzLmNhY2hlLnNsaWNlKDE2KVxyXG4gICAgICByZXR1cm4gb3V0XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbFxyXG59XHJcblxyXG5TcGxpdHRlci5wcm90b3R5cGUuZmx1c2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKHRoaXMuY2FjaGUubGVuZ3RoKSByZXR1cm4gdGhpcy5jYWNoZVxyXG59XHJcblxyXG5mdW5jdGlvbiB1bnBhZCAobGFzdCkge1xyXG4gIHZhciBwYWRkZWQgPSBsYXN0WzE1XVxyXG4gIGlmIChwYWRkZWQgPCAxIHx8IHBhZGRlZCA+IDE2KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuYWJsZSB0byBkZWNyeXB0IGRhdGEnKVxyXG4gIH1cclxuICB2YXIgaSA9IC0xXHJcbiAgd2hpbGUgKCsraSA8IHBhZGRlZCkge1xyXG4gICAgaWYgKGxhc3RbKGkgKyAoMTYgLSBwYWRkZWQpKV0gIT09IHBhZGRlZCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuYWJsZSB0byBkZWNyeXB0IGRhdGEnKVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAocGFkZGVkID09PSAxNikgcmV0dXJuXHJcblxyXG4gIHJldHVybiBsYXN0LnNsaWNlKDAsIDE2IC0gcGFkZGVkKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVEZWNpcGhlcml2IChzdWl0ZSwgcGFzc3dvcmQsIGl2KSB7XHJcbiAgdmFyIGNvbmZpZyA9IE1PREVTW3N1aXRlLnRvTG93ZXJDYXNlKCldXHJcbiAgaWYgKCFjb25maWcpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgc3VpdGUgdHlwZScpXHJcblxyXG4gIGlmICh0eXBlb2YgaXYgPT09ICdzdHJpbmcnKSBpdiA9IEJ1ZmZlci5mcm9tKGl2KVxyXG4gIGlmIChjb25maWcubW9kZSAhPT0gJ0dDTScgJiYgaXYubGVuZ3RoICE9PSBjb25maWcuaXYpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgaXYgbGVuZ3RoICcgKyBpdi5sZW5ndGgpXHJcblxyXG4gIGlmICh0eXBlb2YgcGFzc3dvcmQgPT09ICdzdHJpbmcnKSBwYXNzd29yZCA9IEJ1ZmZlci5mcm9tKHBhc3N3b3JkKVxyXG4gIGlmIChwYXNzd29yZC5sZW5ndGggIT09IGNvbmZpZy5rZXkgLyA4KSB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIGtleSBsZW5ndGggJyArIHBhc3N3b3JkLmxlbmd0aClcclxuXHJcbiAgaWYgKGNvbmZpZy50eXBlID09PSAnc3RyZWFtJykge1xyXG4gICAgcmV0dXJuIG5ldyBTdHJlYW1DaXBoZXIoY29uZmlnLm1vZHVsZSwgcGFzc3dvcmQsIGl2LCB0cnVlKVxyXG4gIH0gZWxzZSBpZiAoY29uZmlnLnR5cGUgPT09ICdhdXRoJykge1xyXG4gICAgcmV0dXJuIG5ldyBBdXRoQ2lwaGVyKGNvbmZpZy5tb2R1bGUsIHBhc3N3b3JkLCBpdiwgdHJ1ZSlcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgRGVjaXBoZXIoY29uZmlnLm1vZHVsZSwgcGFzc3dvcmQsIGl2KVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVEZWNpcGhlciAoc3VpdGUsIHBhc3N3b3JkKSB7XHJcbiAgdmFyIGNvbmZpZyA9IE1PREVTW3N1aXRlLnRvTG93ZXJDYXNlKCldXHJcbiAgaWYgKCFjb25maWcpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgc3VpdGUgdHlwZScpXHJcblxyXG4gIHZhciBrZXlzID0gZWJ0ayhwYXNzd29yZCwgZmFsc2UsIGNvbmZpZy5rZXksIGNvbmZpZy5pdilcclxuICByZXR1cm4gY3JlYXRlRGVjaXBoZXJpdihzdWl0ZSwga2V5cy5rZXksIGtleXMuaXYpXHJcbn1cclxuXHJcbmV4cG9ydHMuY3JlYXRlRGVjaXBoZXIgPSBjcmVhdGVEZWNpcGhlclxyXG5leHBvcnRzLmNyZWF0ZURlY2lwaGVyaXYgPSBjcmVhdGVEZWNpcGhlcml2XHJcbiIsInZhciB4b3IgPSByZXF1aXJlKCdidWZmZXIteG9yJylcclxuXHJcbmZ1bmN0aW9uIGdldEJsb2NrIChzZWxmKSB7XHJcbiAgc2VsZi5fcHJldiA9IHNlbGYuX2NpcGhlci5lbmNyeXB0QmxvY2soc2VsZi5fcHJldilcclxuICByZXR1cm4gc2VsZi5fcHJldlxyXG59XHJcblxyXG5leHBvcnRzLmVuY3J5cHQgPSBmdW5jdGlvbiAoc2VsZiwgY2h1bmspIHtcclxuICB3aGlsZSAoc2VsZi5fY2FjaGUubGVuZ3RoIDwgY2h1bmsubGVuZ3RoKSB7XHJcbiAgICBzZWxmLl9jYWNoZSA9IEJ1ZmZlci5jb25jYXQoW3NlbGYuX2NhY2hlLCBnZXRCbG9jayhzZWxmKV0pXHJcbiAgfVxyXG5cclxuICB2YXIgcGFkID0gc2VsZi5fY2FjaGUuc2xpY2UoMCwgY2h1bmsubGVuZ3RoKVxyXG4gIHNlbGYuX2NhY2hlID0gc2VsZi5fY2FjaGUuc2xpY2UoY2h1bmsubGVuZ3RoKVxyXG4gIHJldHVybiB4b3IoY2h1bmssIHBhZClcclxufVxyXG4iLCJ2YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcclxuXHJcbmZ1bmN0aW9uIGVuY3J5cHRCeXRlIChzZWxmLCBieXRlUGFyYW0sIGRlY3J5cHQpIHtcclxuICB2YXIgcGFkXHJcbiAgdmFyIGkgPSAtMVxyXG4gIHZhciBsZW4gPSA4XHJcbiAgdmFyIG91dCA9IDBcclxuICB2YXIgYml0LCB2YWx1ZVxyXG4gIHdoaWxlICgrK2kgPCBsZW4pIHtcclxuICAgIHBhZCA9IHNlbGYuX2NpcGhlci5lbmNyeXB0QmxvY2soc2VsZi5fcHJldilcclxuICAgIGJpdCA9IChieXRlUGFyYW0gJiAoMSA8PCAoNyAtIGkpKSkgPyAweDgwIDogMFxyXG4gICAgdmFsdWUgPSBwYWRbMF0gXiBiaXRcclxuICAgIG91dCArPSAoKHZhbHVlICYgMHg4MCkgPj4gKGkgJSA4KSlcclxuICAgIHNlbGYuX3ByZXYgPSBzaGlmdEluKHNlbGYuX3ByZXYsIGRlY3J5cHQgPyBiaXQgOiB2YWx1ZSlcclxuICB9XHJcbiAgcmV0dXJuIG91dFxyXG59XHJcblxyXG5mdW5jdGlvbiBzaGlmdEluIChidWZmZXIsIHZhbHVlKSB7XHJcbiAgdmFyIGxlbiA9IGJ1ZmZlci5sZW5ndGhcclxuICB2YXIgaSA9IC0xXHJcbiAgdmFyIG91dCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShidWZmZXIubGVuZ3RoKVxyXG4gIGJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoW2J1ZmZlciwgQnVmZmVyLmZyb20oW3ZhbHVlXSldKVxyXG5cclxuICB3aGlsZSAoKytpIDwgbGVuKSB7XHJcbiAgICBvdXRbaV0gPSBidWZmZXJbaV0gPDwgMSB8IGJ1ZmZlcltpICsgMV0gPj4gKDcpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3V0XHJcbn1cclxuXHJcbmV4cG9ydHMuZW5jcnlwdCA9IGZ1bmN0aW9uIChzZWxmLCBjaHVuaywgZGVjcnlwdCkge1xyXG4gIHZhciBsZW4gPSBjaHVuay5sZW5ndGhcclxuICB2YXIgb3V0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbilcclxuICB2YXIgaSA9IC0xXHJcblxyXG4gIHdoaWxlICgrK2kgPCBsZW4pIHtcclxuICAgIG91dFtpXSA9IGVuY3J5cHRCeXRlKHNlbGYsIGNodW5rW2ldLCBkZWNyeXB0KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG91dFxyXG59XHJcbiIsInZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG5cclxuZnVuY3Rpb24gZW5jcnlwdEJ5dGUgKHNlbGYsIGJ5dGVQYXJhbSwgZGVjcnlwdCkge1xyXG4gIHZhciBwYWQgPSBzZWxmLl9jaXBoZXIuZW5jcnlwdEJsb2NrKHNlbGYuX3ByZXYpXHJcbiAgdmFyIG91dCA9IHBhZFswXSBeIGJ5dGVQYXJhbVxyXG5cclxuICBzZWxmLl9wcmV2ID0gQnVmZmVyLmNvbmNhdChbXHJcbiAgICBzZWxmLl9wcmV2LnNsaWNlKDEpLFxyXG4gICAgQnVmZmVyLmZyb20oW2RlY3J5cHQgPyBieXRlUGFyYW0gOiBvdXRdKVxyXG4gIF0pXHJcblxyXG4gIHJldHVybiBvdXRcclxufVxyXG5cclxuZXhwb3J0cy5lbmNyeXB0ID0gZnVuY3Rpb24gKHNlbGYsIGNodW5rLCBkZWNyeXB0KSB7XHJcbiAgdmFyIGxlbiA9IGNodW5rLmxlbmd0aFxyXG4gIHZhciBvdXQgPSBCdWZmZXIuYWxsb2NVbnNhZmUobGVuKVxyXG4gIHZhciBpID0gLTFcclxuXHJcbiAgd2hpbGUgKCsraSA8IGxlbikge1xyXG4gICAgb3V0W2ldID0gZW5jcnlwdEJ5dGUoc2VsZiwgY2h1bmtbaV0sIGRlY3J5cHQpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3V0XHJcbn1cclxuIiwidmFyIHhvciA9IHJlcXVpcmUoJ2J1ZmZlci14b3InKVxyXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcclxudmFyIGluY3IzMiA9IHJlcXVpcmUoJy4uL2luY3IzMicpXHJcblxyXG5mdW5jdGlvbiBnZXRCbG9jayAoc2VsZikge1xyXG4gIHZhciBvdXQgPSBzZWxmLl9jaXBoZXIuZW5jcnlwdEJsb2NrUmF3KHNlbGYuX3ByZXYpXHJcbiAgaW5jcjMyKHNlbGYuX3ByZXYpXHJcbiAgcmV0dXJuIG91dFxyXG59XHJcblxyXG52YXIgYmxvY2tTaXplID0gMTZcclxuZXhwb3J0cy5lbmNyeXB0ID0gZnVuY3Rpb24gKHNlbGYsIGNodW5rKSB7XHJcbiAgdmFyIGNodW5rTnVtID0gTWF0aC5jZWlsKGNodW5rLmxlbmd0aCAvIGJsb2NrU2l6ZSlcclxuICB2YXIgc3RhcnQgPSBzZWxmLl9jYWNoZS5sZW5ndGhcclxuICBzZWxmLl9jYWNoZSA9IEJ1ZmZlci5jb25jYXQoW1xyXG4gICAgc2VsZi5fY2FjaGUsXHJcbiAgICBCdWZmZXIuYWxsb2NVbnNhZmUoY2h1bmtOdW0gKiBibG9ja1NpemUpXHJcbiAgXSlcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rTnVtOyBpKyspIHtcclxuICAgIHZhciBvdXQgPSBnZXRCbG9jayhzZWxmKVxyXG4gICAgdmFyIG9mZnNldCA9IHN0YXJ0ICsgaSAqIGJsb2NrU2l6ZVxyXG4gICAgc2VsZi5fY2FjaGUud3JpdGVVSW50MzJCRShvdXRbMF0sIG9mZnNldCArIDApXHJcbiAgICBzZWxmLl9jYWNoZS53cml0ZVVJbnQzMkJFKG91dFsxXSwgb2Zmc2V0ICsgNClcclxuICAgIHNlbGYuX2NhY2hlLndyaXRlVUludDMyQkUob3V0WzJdLCBvZmZzZXQgKyA4KVxyXG4gICAgc2VsZi5fY2FjaGUud3JpdGVVSW50MzJCRShvdXRbM10sIG9mZnNldCArIDEyKVxyXG4gIH1cclxuICB2YXIgcGFkID0gc2VsZi5fY2FjaGUuc2xpY2UoMCwgY2h1bmsubGVuZ3RoKVxyXG4gIHNlbGYuX2NhY2hlID0gc2VsZi5fY2FjaGUuc2xpY2UoY2h1bmsubGVuZ3RoKVxyXG4gIHJldHVybiB4b3IoY2h1bmssIHBhZClcclxufVxyXG4iLCJ2YXIgYWVzID0gcmVxdWlyZSgnLi9hZXMnKVxyXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJ2NpcGhlci1iYXNlJylcclxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxyXG52YXIgR0hBU0ggPSByZXF1aXJlKCcuL2doYXNoJylcclxudmFyIHhvciA9IHJlcXVpcmUoJ2J1ZmZlci14b3InKVxyXG52YXIgaW5jcjMyID0gcmVxdWlyZSgnLi9pbmNyMzInKVxyXG5cclxuZnVuY3Rpb24geG9yVGVzdCAoYSwgYikge1xyXG4gIHZhciBvdXQgPSAwXHJcbiAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkgb3V0KytcclxuXHJcbiAgdmFyIGxlbiA9IE1hdGgubWluKGEubGVuZ3RoLCBiLmxlbmd0aClcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICBvdXQgKz0gKGFbaV0gXiBiW2ldKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG91dFxyXG59XHJcblxyXG5mdW5jdGlvbiBjYWxjSXYgKHNlbGYsIGl2LCBjaykge1xyXG4gIGlmIChpdi5sZW5ndGggPT09IDEyKSB7XHJcbiAgICBzZWxmLl9maW5JRCA9IEJ1ZmZlci5jb25jYXQoW2l2LCBCdWZmZXIuZnJvbShbMCwgMCwgMCwgMV0pXSlcclxuICAgIHJldHVybiBCdWZmZXIuY29uY2F0KFtpdiwgQnVmZmVyLmZyb20oWzAsIDAsIDAsIDJdKV0pXHJcbiAgfVxyXG4gIHZhciBnaGFzaCA9IG5ldyBHSEFTSChjaylcclxuICB2YXIgbGVuID0gaXYubGVuZ3RoXHJcbiAgdmFyIHRvUGFkID0gbGVuICUgMTZcclxuICBnaGFzaC51cGRhdGUoaXYpXHJcbiAgaWYgKHRvUGFkKSB7XHJcbiAgICB0b1BhZCA9IDE2IC0gdG9QYWRcclxuICAgIGdoYXNoLnVwZGF0ZShCdWZmZXIuYWxsb2ModG9QYWQsIDApKVxyXG4gIH1cclxuICBnaGFzaC51cGRhdGUoQnVmZmVyLmFsbG9jKDgsIDApKVxyXG4gIHZhciBpdkJpdHMgPSBsZW4gKiA4XHJcbiAgdmFyIHRhaWwgPSBCdWZmZXIuYWxsb2MoOClcclxuICB0YWlsLndyaXRlVUludEJFKGl2Qml0cywgMCwgOClcclxuICBnaGFzaC51cGRhdGUodGFpbClcclxuICBzZWxmLl9maW5JRCA9IGdoYXNoLnN0YXRlXHJcbiAgdmFyIG91dCA9IEJ1ZmZlci5mcm9tKHNlbGYuX2ZpbklEKVxyXG4gIGluY3IzMihvdXQpXHJcbiAgcmV0dXJuIG91dFxyXG59XHJcbmZ1bmN0aW9uIFN0cmVhbUNpcGhlciAobW9kZSwga2V5LCBpdiwgZGVjcnlwdCkge1xyXG4gIFRyYW5zZm9ybS5jYWxsKHRoaXMpXHJcblxyXG4gIHZhciBoID0gQnVmZmVyLmFsbG9jKDQsIDApXHJcblxyXG4gIHRoaXMuX2NpcGhlciA9IG5ldyBhZXMuQUVTKGtleSlcclxuICB2YXIgY2sgPSB0aGlzLl9jaXBoZXIuZW5jcnlwdEJsb2NrKGgpXHJcbiAgdGhpcy5fZ2hhc2ggPSBuZXcgR0hBU0goY2spXHJcbiAgaXYgPSBjYWxjSXYodGhpcywgaXYsIGNrKVxyXG5cclxuICB0aGlzLl9wcmV2ID0gQnVmZmVyLmZyb20oaXYpXHJcbiAgdGhpcy5fY2FjaGUgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMClcclxuICB0aGlzLl9zZWNDYWNoZSA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgwKVxyXG4gIHRoaXMuX2RlY3J5cHQgPSBkZWNyeXB0XHJcbiAgdGhpcy5fYWxlbiA9IDBcclxuICB0aGlzLl9sZW4gPSAwXHJcbiAgdGhpcy5fbW9kZSA9IG1vZGVcclxuXHJcbiAgdGhpcy5fYXV0aFRhZyA9IG51bGxcclxuICB0aGlzLl9jYWxsZWQgPSBmYWxzZVxyXG59XHJcblxyXG5pbmhlcml0cyhTdHJlYW1DaXBoZXIsIFRyYW5zZm9ybSlcclxuXHJcblN0cmVhbUNpcGhlci5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChjaHVuaykge1xyXG4gIGlmICghdGhpcy5fY2FsbGVkICYmIHRoaXMuX2FsZW4pIHtcclxuICAgIHZhciBydW1wID0gMTYgLSAodGhpcy5fYWxlbiAlIDE2KVxyXG4gICAgaWYgKHJ1bXAgPCAxNikge1xyXG4gICAgICBydW1wID0gQnVmZmVyLmFsbG9jKHJ1bXAsIDApXHJcbiAgICAgIHRoaXMuX2doYXNoLnVwZGF0ZShydW1wKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdGhpcy5fY2FsbGVkID0gdHJ1ZVxyXG4gIHZhciBvdXQgPSB0aGlzLl9tb2RlLmVuY3J5cHQodGhpcywgY2h1bmspXHJcbiAgaWYgKHRoaXMuX2RlY3J5cHQpIHtcclxuICAgIHRoaXMuX2doYXNoLnVwZGF0ZShjaHVuaylcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5fZ2hhc2gudXBkYXRlKG91dClcclxuICB9XHJcbiAgdGhpcy5fbGVuICs9IGNodW5rLmxlbmd0aFxyXG4gIHJldHVybiBvdXRcclxufVxyXG5cclxuU3RyZWFtQ2lwaGVyLnByb3RvdHlwZS5fZmluYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKHRoaXMuX2RlY3J5cHQgJiYgIXRoaXMuX2F1dGhUYWcpIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgc3RhdGUgb3IgdW5hYmxlIHRvIGF1dGhlbnRpY2F0ZSBkYXRhJylcclxuXHJcbiAgdmFyIHRhZyA9IHhvcih0aGlzLl9naGFzaC5maW5hbCh0aGlzLl9hbGVuICogOCwgdGhpcy5fbGVuICogOCksIHRoaXMuX2NpcGhlci5lbmNyeXB0QmxvY2sodGhpcy5fZmluSUQpKVxyXG4gIGlmICh0aGlzLl9kZWNyeXB0ICYmIHhvclRlc3QodGFnLCB0aGlzLl9hdXRoVGFnKSkgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBzdGF0ZSBvciB1bmFibGUgdG8gYXV0aGVudGljYXRlIGRhdGEnKVxyXG5cclxuICB0aGlzLl9hdXRoVGFnID0gdGFnXHJcbiAgdGhpcy5fY2lwaGVyLnNjcnViKClcclxufVxyXG5cclxuU3RyZWFtQ2lwaGVyLnByb3RvdHlwZS5nZXRBdXRoVGFnID0gZnVuY3Rpb24gZ2V0QXV0aFRhZyAoKSB7XHJcbiAgaWYgKHRoaXMuX2RlY3J5cHQgfHwgIUJ1ZmZlci5pc0J1ZmZlcih0aGlzLl9hdXRoVGFnKSkgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0aW5nIHRvIGdldCBhdXRoIHRhZyBpbiB1bnN1cHBvcnRlZCBzdGF0ZScpXHJcblxyXG4gIHJldHVybiB0aGlzLl9hdXRoVGFnXHJcbn1cclxuXHJcblN0cmVhbUNpcGhlci5wcm90b3R5cGUuc2V0QXV0aFRhZyA9IGZ1bmN0aW9uIHNldEF1dGhUYWcgKHRhZykge1xyXG4gIGlmICghdGhpcy5fZGVjcnlwdCkgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0aW5nIHRvIHNldCBhdXRoIHRhZyBpbiB1bnN1cHBvcnRlZCBzdGF0ZScpXHJcblxyXG4gIHRoaXMuX2F1dGhUYWcgPSB0YWdcclxufVxyXG5cclxuU3RyZWFtQ2lwaGVyLnByb3RvdHlwZS5zZXRBQUQgPSBmdW5jdGlvbiBzZXRBQUQgKGJ1Zikge1xyXG4gIGlmICh0aGlzLl9jYWxsZWQpIHRocm93IG5ldyBFcnJvcignQXR0ZW1wdGluZyB0byBzZXQgQUFEIGluIHVuc3VwcG9ydGVkIHN0YXRlJylcclxuXHJcbiAgdGhpcy5fZ2hhc2gudXBkYXRlKGJ1ZilcclxuICB0aGlzLl9hbGVuICs9IGJ1Zi5sZW5ndGhcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdHJlYW1DaXBoZXJcclxuIiwidmFyIE1PREVTID0gcmVxdWlyZSgnLi9tb2RlcycpXHJcbnZhciBBdXRoQ2lwaGVyID0gcmVxdWlyZSgnLi9hdXRoQ2lwaGVyJylcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcbnZhciBTdHJlYW1DaXBoZXIgPSByZXF1aXJlKCcuL3N0cmVhbUNpcGhlcicpXHJcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCdjaXBoZXItYmFzZScpXHJcbnZhciBhZXMgPSByZXF1aXJlKCcuL2FlcycpXHJcbnZhciBlYnRrID0gcmVxdWlyZSgnZXZwX2J5dGVzdG9rZXknKVxyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXHJcblxyXG5mdW5jdGlvbiBDaXBoZXIgKG1vZGUsIGtleSwgaXYpIHtcclxuICBUcmFuc2Zvcm0uY2FsbCh0aGlzKVxyXG5cclxuICB0aGlzLl9jYWNoZSA9IG5ldyBTcGxpdHRlcigpXHJcbiAgdGhpcy5fY2lwaGVyID0gbmV3IGFlcy5BRVMoa2V5KVxyXG4gIHRoaXMuX3ByZXYgPSBCdWZmZXIuZnJvbShpdilcclxuICB0aGlzLl9tb2RlID0gbW9kZVxyXG4gIHRoaXMuX2F1dG9wYWRkaW5nID0gdHJ1ZVxyXG59XHJcblxyXG5pbmhlcml0cyhDaXBoZXIsIFRyYW5zZm9ybSlcclxuXHJcbkNpcGhlci5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgdGhpcy5fY2FjaGUuYWRkKGRhdGEpXHJcbiAgdmFyIGNodW5rXHJcbiAgdmFyIHRoaW5nXHJcbiAgdmFyIG91dCA9IFtdXHJcblxyXG4gIHdoaWxlICgoY2h1bmsgPSB0aGlzLl9jYWNoZS5nZXQoKSkpIHtcclxuICAgIHRoaW5nID0gdGhpcy5fbW9kZS5lbmNyeXB0KHRoaXMsIGNodW5rKVxyXG4gICAgb3V0LnB1c2godGhpbmcpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gQnVmZmVyLmNvbmNhdChvdXQpXHJcbn1cclxuXHJcbnZhciBQQURESU5HID0gQnVmZmVyLmFsbG9jKDE2LCAweDEwKVxyXG5cclxuQ2lwaGVyLnByb3RvdHlwZS5fZmluYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGNodW5rID0gdGhpcy5fY2FjaGUuZmx1c2goKVxyXG4gIGlmICh0aGlzLl9hdXRvcGFkZGluZykge1xyXG4gICAgY2h1bmsgPSB0aGlzLl9tb2RlLmVuY3J5cHQodGhpcywgY2h1bmspXHJcbiAgICB0aGlzLl9jaXBoZXIuc2NydWIoKVxyXG4gICAgcmV0dXJuIGNodW5rXHJcbiAgfVxyXG5cclxuICBpZiAoIWNodW5rLmVxdWFscyhQQURESU5HKSkge1xyXG4gICAgdGhpcy5fY2lwaGVyLnNjcnViKClcclxuICAgIHRocm93IG5ldyBFcnJvcignZGF0YSBub3QgbXVsdGlwbGUgb2YgYmxvY2sgbGVuZ3RoJylcclxuICB9XHJcbn1cclxuXHJcbkNpcGhlci5wcm90b3R5cGUuc2V0QXV0b1BhZGRpbmcgPSBmdW5jdGlvbiAoc2V0VG8pIHtcclxuICB0aGlzLl9hdXRvcGFkZGluZyA9ICEhc2V0VG9cclxuICByZXR1cm4gdGhpc1xyXG59XHJcblxyXG5mdW5jdGlvbiBTcGxpdHRlciAoKSB7XHJcbiAgdGhpcy5jYWNoZSA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgwKVxyXG59XHJcblxyXG5TcGxpdHRlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICB0aGlzLmNhY2hlID0gQnVmZmVyLmNvbmNhdChbdGhpcy5jYWNoZSwgZGF0YV0pXHJcbn1cclxuXHJcblNwbGl0dGVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKHRoaXMuY2FjaGUubGVuZ3RoID4gMTUpIHtcclxuICAgIHZhciBvdXQgPSB0aGlzLmNhY2hlLnNsaWNlKDAsIDE2KVxyXG4gICAgdGhpcy5jYWNoZSA9IHRoaXMuY2FjaGUuc2xpY2UoMTYpXHJcbiAgICByZXR1cm4gb3V0XHJcbiAgfVxyXG4gIHJldHVybiBudWxsXHJcbn1cclxuXHJcblNwbGl0dGVyLnByb3RvdHlwZS5mbHVzaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgbGVuID0gMTYgLSB0aGlzLmNhY2hlLmxlbmd0aFxyXG4gIHZhciBwYWRCdWZmID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbilcclxuXHJcbiAgdmFyIGkgPSAtMVxyXG4gIHdoaWxlICgrK2kgPCBsZW4pIHtcclxuICAgIHBhZEJ1ZmYud3JpdGVVSW50OChsZW4sIGkpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gQnVmZmVyLmNvbmNhdChbdGhpcy5jYWNoZSwgcGFkQnVmZl0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUNpcGhlcml2IChzdWl0ZSwgcGFzc3dvcmQsIGl2KSB7XHJcbiAgdmFyIGNvbmZpZyA9IE1PREVTW3N1aXRlLnRvTG93ZXJDYXNlKCldXHJcbiAgaWYgKCFjb25maWcpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgc3VpdGUgdHlwZScpXHJcblxyXG4gIGlmICh0eXBlb2YgcGFzc3dvcmQgPT09ICdzdHJpbmcnKSBwYXNzd29yZCA9IEJ1ZmZlci5mcm9tKHBhc3N3b3JkKVxyXG4gIGlmIChwYXNzd29yZC5sZW5ndGggIT09IGNvbmZpZy5rZXkgLyA4KSB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIGtleSBsZW5ndGggJyArIHBhc3N3b3JkLmxlbmd0aClcclxuXHJcbiAgaWYgKHR5cGVvZiBpdiA9PT0gJ3N0cmluZycpIGl2ID0gQnVmZmVyLmZyb20oaXYpXHJcbiAgaWYgKGNvbmZpZy5tb2RlICE9PSAnR0NNJyAmJiBpdi5sZW5ndGggIT09IGNvbmZpZy5pdikgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBpdiBsZW5ndGggJyArIGl2Lmxlbmd0aClcclxuXHJcbiAgaWYgKGNvbmZpZy50eXBlID09PSAnc3RyZWFtJykge1xyXG4gICAgcmV0dXJuIG5ldyBTdHJlYW1DaXBoZXIoY29uZmlnLm1vZHVsZSwgcGFzc3dvcmQsIGl2KVxyXG4gIH0gZWxzZSBpZiAoY29uZmlnLnR5cGUgPT09ICdhdXRoJykge1xyXG4gICAgcmV0dXJuIG5ldyBBdXRoQ2lwaGVyKGNvbmZpZy5tb2R1bGUsIHBhc3N3b3JkLCBpdilcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgQ2lwaGVyKGNvbmZpZy5tb2R1bGUsIHBhc3N3b3JkLCBpdilcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ2lwaGVyIChzdWl0ZSwgcGFzc3dvcmQpIHtcclxuICB2YXIgY29uZmlnID0gTU9ERVNbc3VpdGUudG9Mb3dlckNhc2UoKV1cclxuICBpZiAoIWNvbmZpZykgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBzdWl0ZSB0eXBlJylcclxuXHJcbiAgdmFyIGtleXMgPSBlYnRrKHBhc3N3b3JkLCBmYWxzZSwgY29uZmlnLmtleSwgY29uZmlnLml2KVxyXG4gIHJldHVybiBjcmVhdGVDaXBoZXJpdihzdWl0ZSwga2V5cy5rZXksIGtleXMuaXYpXHJcbn1cclxuXHJcbmV4cG9ydHMuY3JlYXRlQ2lwaGVyaXYgPSBjcmVhdGVDaXBoZXJpdlxyXG5leHBvcnRzLmNyZWF0ZUNpcGhlciA9IGNyZWF0ZUNpcGhlclxyXG4iLCJ2YXIgbW9kZU1vZHVsZXMgPSB7XHJcbiAgRUNCOiByZXF1aXJlKCcuL2VjYicpLFxyXG4gIENCQzogcmVxdWlyZSgnLi9jYmMnKSxcclxuICBDRkI6IHJlcXVpcmUoJy4vY2ZiJyksXHJcbiAgQ0ZCODogcmVxdWlyZSgnLi9jZmI4JyksXHJcbiAgQ0ZCMTogcmVxdWlyZSgnLi9jZmIxJyksXHJcbiAgT0ZCOiByZXF1aXJlKCcuL29mYicpLFxyXG4gIENUUjogcmVxdWlyZSgnLi9jdHInKSxcclxuICBHQ006IHJlcXVpcmUoJy4vY3RyJylcclxufVxyXG5cclxudmFyIG1vZGVzID0gcmVxdWlyZSgnLi9saXN0Lmpzb24nKVxyXG5cclxuZm9yICh2YXIga2V5IGluIG1vZGVzKSB7XHJcbiAgbW9kZXNba2V5XS5tb2R1bGUgPSBtb2RlTW9kdWxlc1ttb2Rlc1trZXldLm1vZGVdXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbW9kZXNcclxuIiwiZnVuY3Rpb24gaW5jcjMyIChpdikge1xyXG4gIHZhciBsZW4gPSBpdi5sZW5ndGhcclxuICB2YXIgaXRlbVxyXG4gIHdoaWxlIChsZW4tLSkge1xyXG4gICAgaXRlbSA9IGl2LnJlYWRVSW50OChsZW4pXHJcbiAgICBpZiAoaXRlbSA9PT0gMjU1KSB7XHJcbiAgICAgIGl2LndyaXRlVUludDgoMCwgbGVuKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbSsrXHJcbiAgICAgIGl2LndyaXRlVUludDgoaXRlbSwgbGVuKVxyXG4gICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IGluY3IzMlxyXG4iLCJ2YXIgeG9yID0gcmVxdWlyZSgnYnVmZmVyLXhvcicpXHJcblxyXG5leHBvcnRzLmVuY3J5cHQgPSBmdW5jdGlvbiAoc2VsZiwgYmxvY2spIHtcclxuICB2YXIgZGF0YSA9IHhvcihibG9jaywgc2VsZi5fcHJldilcclxuXHJcbiAgc2VsZi5fcHJldiA9IHNlbGYuX2NpcGhlci5lbmNyeXB0QmxvY2soZGF0YSlcclxuICByZXR1cm4gc2VsZi5fcHJldlxyXG59XHJcblxyXG5leHBvcnRzLmRlY3J5cHQgPSBmdW5jdGlvbiAoc2VsZiwgYmxvY2spIHtcclxuICB2YXIgcGFkID0gc2VsZi5fcHJldlxyXG5cclxuICBzZWxmLl9wcmV2ID0gYmxvY2tcclxuICB2YXIgb3V0ID0gc2VsZi5fY2lwaGVyLmRlY3J5cHRCbG9jayhibG9jaylcclxuXHJcbiAgcmV0dXJuIHhvcihvdXQsIHBhZClcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9