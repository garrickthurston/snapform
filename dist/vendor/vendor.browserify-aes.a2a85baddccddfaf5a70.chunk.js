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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1hZXMvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1hZXMvbW9kZXMvZWNiLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5LWFlcy9zdHJlYW1DaXBoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktYWVzL21vZGVzL2NmYi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1hZXMvYWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5LWFlcy9naGFzaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1hZXMvZGVjcnlwdGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5LWFlcy9tb2Rlcy9vZmIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktYWVzL21vZGVzL2NmYjEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktYWVzL21vZGVzL2NmYjguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktYWVzL21vZGVzL2N0ci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1hZXMvYXV0aENpcGhlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1hZXMvZW5jcnlwdGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5LWFlcy9tb2Rlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1hZXMvaW5jcjMyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5LWFlcy9tb2Rlcy9jYmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsY0FBYyxtQkFBTyxDQUFDLHlCQUFhO0FBQ25DLGdCQUFnQixtQkFBTyxDQUFDLHlCQUFhO0FBQ3JDLFlBQVksbUJBQU8sQ0FBQywrQkFBbUI7O0FBRXZDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1pBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ05BLFVBQVUsbUJBQU8sQ0FBQyxtQkFBTztBQUN6QixhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsZ0JBQWdCLG1CQUFPLENBQUMseUJBQWE7QUFDckMsZUFBZSxtQkFBTyxDQUFDLHNCQUFVOztBQUVqQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQzFCQSxhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsVUFBVSxtQkFBTyxDQUFDLHdCQUFZOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLHlCQUFhOztBQUVsQztBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLGNBQWM7QUFDL0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCQUFxQixpQkFBaUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsYUFBYTtBQUM5QjtBQUNBOztBQUVBLG1CQUFtQixZQUFZO0FBQy9COztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLGFBQWE7QUFDL0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDZEEsVUFBVSxtQkFBTyxDQUFDLHdCQUFZOztBQUU5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSIsImZpbGUiOiJ2ZW5kb3IvdmVuZG9yLmJyb3dzZXJpZnktYWVzLmEyYTg1YmFkZGNjZGRmYWY1YTcwLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNpcGhlcnMgPSByZXF1aXJlKCcuL2VuY3J5cHRlcicpXG52YXIgZGVjaXBoZXJzID0gcmVxdWlyZSgnLi9kZWNyeXB0ZXInKVxudmFyIG1vZGVzID0gcmVxdWlyZSgnLi9tb2Rlcy9saXN0Lmpzb24nKVxuXG5mdW5jdGlvbiBnZXRDaXBoZXJzICgpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG1vZGVzKVxufVxuXG5leHBvcnRzLmNyZWF0ZUNpcGhlciA9IGV4cG9ydHMuQ2lwaGVyID0gY2lwaGVycy5jcmVhdGVDaXBoZXJcbmV4cG9ydHMuY3JlYXRlQ2lwaGVyaXYgPSBleHBvcnRzLkNpcGhlcml2ID0gY2lwaGVycy5jcmVhdGVDaXBoZXJpdlxuZXhwb3J0cy5jcmVhdGVEZWNpcGhlciA9IGV4cG9ydHMuRGVjaXBoZXIgPSBkZWNpcGhlcnMuY3JlYXRlRGVjaXBoZXJcbmV4cG9ydHMuY3JlYXRlRGVjaXBoZXJpdiA9IGV4cG9ydHMuRGVjaXBoZXJpdiA9IGRlY2lwaGVycy5jcmVhdGVEZWNpcGhlcml2XG5leHBvcnRzLmxpc3RDaXBoZXJzID0gZXhwb3J0cy5nZXRDaXBoZXJzID0gZ2V0Q2lwaGVyc1xuIiwiZXhwb3J0cy5lbmNyeXB0ID0gZnVuY3Rpb24gKHNlbGYsIGJsb2NrKSB7XG4gIHJldHVybiBzZWxmLl9jaXBoZXIuZW5jcnlwdEJsb2NrKGJsb2NrKVxufVxuXG5leHBvcnRzLmRlY3J5cHQgPSBmdW5jdGlvbiAoc2VsZiwgYmxvY2spIHtcbiAgcmV0dXJuIHNlbGYuX2NpcGhlci5kZWNyeXB0QmxvY2soYmxvY2spXG59XG4iLCJ2YXIgYWVzID0gcmVxdWlyZSgnLi9hZXMnKVxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnY2lwaGVyLWJhc2UnKVxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxuXG5mdW5jdGlvbiBTdHJlYW1DaXBoZXIgKG1vZGUsIGtleSwgaXYsIGRlY3J5cHQpIHtcbiAgVHJhbnNmb3JtLmNhbGwodGhpcylcblxuICB0aGlzLl9jaXBoZXIgPSBuZXcgYWVzLkFFUyhrZXkpXG4gIHRoaXMuX3ByZXYgPSBCdWZmZXIuZnJvbShpdilcbiAgdGhpcy5fY2FjaGUgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMClcbiAgdGhpcy5fc2VjQ2FjaGUgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMClcbiAgdGhpcy5fZGVjcnlwdCA9IGRlY3J5cHRcbiAgdGhpcy5fbW9kZSA9IG1vZGVcbn1cblxuaW5oZXJpdHMoU3RyZWFtQ2lwaGVyLCBUcmFuc2Zvcm0pXG5cblN0cmVhbUNpcGhlci5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChjaHVuaykge1xuICByZXR1cm4gdGhpcy5fbW9kZS5lbmNyeXB0KHRoaXMsIGNodW5rLCB0aGlzLl9kZWNyeXB0KVxufVxuXG5TdHJlYW1DaXBoZXIucHJvdG90eXBlLl9maW5hbCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fY2lwaGVyLnNjcnViKClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdHJlYW1DaXBoZXJcbiIsInZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxudmFyIHhvciA9IHJlcXVpcmUoJ2J1ZmZlci14b3InKVxuXG5mdW5jdGlvbiBlbmNyeXB0U3RhcnQgKHNlbGYsIGRhdGEsIGRlY3J5cHQpIHtcbiAgdmFyIGxlbiA9IGRhdGEubGVuZ3RoXG4gIHZhciBvdXQgPSB4b3IoZGF0YSwgc2VsZi5fY2FjaGUpXG4gIHNlbGYuX2NhY2hlID0gc2VsZi5fY2FjaGUuc2xpY2UobGVuKVxuICBzZWxmLl9wcmV2ID0gQnVmZmVyLmNvbmNhdChbc2VsZi5fcHJldiwgZGVjcnlwdCA/IGRhdGEgOiBvdXRdKVxuICByZXR1cm4gb3V0XG59XG5cbmV4cG9ydHMuZW5jcnlwdCA9IGZ1bmN0aW9uIChzZWxmLCBkYXRhLCBkZWNyeXB0KSB7XG4gIHZhciBvdXQgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMClcbiAgdmFyIGxlblxuXG4gIHdoaWxlIChkYXRhLmxlbmd0aCkge1xuICAgIGlmIChzZWxmLl9jYWNoZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHNlbGYuX2NhY2hlID0gc2VsZi5fY2lwaGVyLmVuY3J5cHRCbG9jayhzZWxmLl9wcmV2KVxuICAgICAgc2VsZi5fcHJldiA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgwKVxuICAgIH1cblxuICAgIGlmIChzZWxmLl9jYWNoZS5sZW5ndGggPD0gZGF0YS5sZW5ndGgpIHtcbiAgICAgIGxlbiA9IHNlbGYuX2NhY2hlLmxlbmd0aFxuICAgICAgb3V0ID0gQnVmZmVyLmNvbmNhdChbb3V0LCBlbmNyeXB0U3RhcnQoc2VsZiwgZGF0YS5zbGljZSgwLCBsZW4pLCBkZWNyeXB0KV0pXG4gICAgICBkYXRhID0gZGF0YS5zbGljZShsZW4pXG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCA9IEJ1ZmZlci5jb25jYXQoW291dCwgZW5jcnlwdFN0YXJ0KHNlbGYsIGRhdGEsIGRlY3J5cHQpXSlcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dFxufVxuIiwiLy8gYmFzZWQgb24gdGhlIGFlcyBpbXBsaW1lbnRhdGlvbiBpbiB0cmlwbGUgc2VjXG4vLyBodHRwczovL2dpdGh1Yi5jb20va2V5YmFzZS90cmlwbGVzZWNcbi8vIHdoaWNoIGlzIGluIHR1cm4gYmFzZWQgb24gdGhlIG9uZSBmcm9tIGNyeXB0by1qc1xuLy8gaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jcnlwdG8tanMvXG5cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxuXG5mdW5jdGlvbiBhc1VJbnQzMkFycmF5IChidWYpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgYnVmID0gQnVmZmVyLmZyb20oYnVmKVxuXG4gIHZhciBsZW4gPSAoYnVmLmxlbmd0aCAvIDQpIHwgMFxuICB2YXIgb3V0ID0gbmV3IEFycmF5KGxlbilcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gYnVmLnJlYWRVSW50MzJCRShpICogNClcbiAgfVxuXG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gc2NydWJWZWMgKHYpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2Lmxlbmd0aDsgdisrKSB7XG4gICAgdltpXSA9IDBcbiAgfVxufVxuXG5mdW5jdGlvbiBjcnlwdEJsb2NrIChNLCBrZXlTY2hlZHVsZSwgU1VCX01JWCwgU0JPWCwgblJvdW5kcykge1xuICB2YXIgU1VCX01JWDAgPSBTVUJfTUlYWzBdXG4gIHZhciBTVUJfTUlYMSA9IFNVQl9NSVhbMV1cbiAgdmFyIFNVQl9NSVgyID0gU1VCX01JWFsyXVxuICB2YXIgU1VCX01JWDMgPSBTVUJfTUlYWzNdXG5cbiAgdmFyIHMwID0gTVswXSBeIGtleVNjaGVkdWxlWzBdXG4gIHZhciBzMSA9IE1bMV0gXiBrZXlTY2hlZHVsZVsxXVxuICB2YXIgczIgPSBNWzJdIF4ga2V5U2NoZWR1bGVbMl1cbiAgdmFyIHMzID0gTVszXSBeIGtleVNjaGVkdWxlWzNdXG4gIHZhciB0MCwgdDEsIHQyLCB0M1xuICB2YXIga3NSb3cgPSA0XG5cbiAgZm9yICh2YXIgcm91bmQgPSAxOyByb3VuZCA8IG5Sb3VuZHM7IHJvdW5kKyspIHtcbiAgICB0MCA9IFNVQl9NSVgwW3MwID4+PiAyNF0gXiBTVUJfTUlYMVsoczEgPj4+IDE2KSAmIDB4ZmZdIF4gU1VCX01JWDJbKHMyID4+PiA4KSAmIDB4ZmZdIF4gU1VCX01JWDNbczMgJiAweGZmXSBeIGtleVNjaGVkdWxlW2tzUm93KytdXG4gICAgdDEgPSBTVUJfTUlYMFtzMSA+Pj4gMjRdIF4gU1VCX01JWDFbKHMyID4+PiAxNikgJiAweGZmXSBeIFNVQl9NSVgyWyhzMyA+Pj4gOCkgJiAweGZmXSBeIFNVQl9NSVgzW3MwICYgMHhmZl0gXiBrZXlTY2hlZHVsZVtrc1JvdysrXVxuICAgIHQyID0gU1VCX01JWDBbczIgPj4+IDI0XSBeIFNVQl9NSVgxWyhzMyA+Pj4gMTYpICYgMHhmZl0gXiBTVUJfTUlYMlsoczAgPj4+IDgpICYgMHhmZl0gXiBTVUJfTUlYM1tzMSAmIDB4ZmZdIF4ga2V5U2NoZWR1bGVba3NSb3crK11cbiAgICB0MyA9IFNVQl9NSVgwW3MzID4+PiAyNF0gXiBTVUJfTUlYMVsoczAgPj4+IDE2KSAmIDB4ZmZdIF4gU1VCX01JWDJbKHMxID4+PiA4KSAmIDB4ZmZdIF4gU1VCX01JWDNbczIgJiAweGZmXSBeIGtleVNjaGVkdWxlW2tzUm93KytdXG4gICAgczAgPSB0MFxuICAgIHMxID0gdDFcbiAgICBzMiA9IHQyXG4gICAgczMgPSB0M1xuICB9XG5cbiAgdDAgPSAoKFNCT1hbczAgPj4+IDI0XSA8PCAyNCkgfCAoU0JPWFsoczEgPj4+IDE2KSAmIDB4ZmZdIDw8IDE2KSB8IChTQk9YWyhzMiA+Pj4gOCkgJiAweGZmXSA8PCA4KSB8IFNCT1hbczMgJiAweGZmXSkgXiBrZXlTY2hlZHVsZVtrc1JvdysrXVxuICB0MSA9ICgoU0JPWFtzMSA+Pj4gMjRdIDw8IDI0KSB8IChTQk9YWyhzMiA+Pj4gMTYpICYgMHhmZl0gPDwgMTYpIHwgKFNCT1hbKHMzID4+PiA4KSAmIDB4ZmZdIDw8IDgpIHwgU0JPWFtzMCAmIDB4ZmZdKSBeIGtleVNjaGVkdWxlW2tzUm93KytdXG4gIHQyID0gKChTQk9YW3MyID4+PiAyNF0gPDwgMjQpIHwgKFNCT1hbKHMzID4+PiAxNikgJiAweGZmXSA8PCAxNikgfCAoU0JPWFsoczAgPj4+IDgpICYgMHhmZl0gPDwgOCkgfCBTQk9YW3MxICYgMHhmZl0pIF4ga2V5U2NoZWR1bGVba3NSb3crK11cbiAgdDMgPSAoKFNCT1hbczMgPj4+IDI0XSA8PCAyNCkgfCAoU0JPWFsoczAgPj4+IDE2KSAmIDB4ZmZdIDw8IDE2KSB8IChTQk9YWyhzMSA+Pj4gOCkgJiAweGZmXSA8PCA4KSB8IFNCT1hbczIgJiAweGZmXSkgXiBrZXlTY2hlZHVsZVtrc1JvdysrXVxuICB0MCA9IHQwID4+PiAwXG4gIHQxID0gdDEgPj4+IDBcbiAgdDIgPSB0MiA+Pj4gMFxuICB0MyA9IHQzID4+PiAwXG5cbiAgcmV0dXJuIFt0MCwgdDEsIHQyLCB0M11cbn1cblxuLy8gQUVTIGNvbnN0YW50c1xudmFyIFJDT04gPSBbMHgwMCwgMHgwMSwgMHgwMiwgMHgwNCwgMHgwOCwgMHgxMCwgMHgyMCwgMHg0MCwgMHg4MCwgMHgxYiwgMHgzNl1cbnZhciBHID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gQ29tcHV0ZSBkb3VibGUgdGFibGVcbiAgdmFyIGQgPSBuZXcgQXJyYXkoMjU2KVxuICBmb3IgKHZhciBqID0gMDsgaiA8IDI1NjsgaisrKSB7XG4gICAgaWYgKGogPCAxMjgpIHtcbiAgICAgIGRbal0gPSBqIDw8IDFcbiAgICB9IGVsc2Uge1xuICAgICAgZFtqXSA9IChqIDw8IDEpIF4gMHgxMWJcbiAgICB9XG4gIH1cblxuICB2YXIgU0JPWCA9IFtdXG4gIHZhciBJTlZfU0JPWCA9IFtdXG4gIHZhciBTVUJfTUlYID0gW1tdLCBbXSwgW10sIFtdXVxuICB2YXIgSU5WX1NVQl9NSVggPSBbW10sIFtdLCBbXSwgW11dXG5cbiAgLy8gV2FsayBHRigyXjgpXG4gIHZhciB4ID0gMFxuICB2YXIgeGkgPSAwXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgICAvLyBDb21wdXRlIHNib3hcbiAgICB2YXIgc3ggPSB4aSBeICh4aSA8PCAxKSBeICh4aSA8PCAyKSBeICh4aSA8PCAzKSBeICh4aSA8PCA0KVxuICAgIHN4ID0gKHN4ID4+PiA4KSBeIChzeCAmIDB4ZmYpIF4gMHg2M1xuICAgIFNCT1hbeF0gPSBzeFxuICAgIElOVl9TQk9YW3N4XSA9IHhcblxuICAgIC8vIENvbXB1dGUgbXVsdGlwbGljYXRpb25cbiAgICB2YXIgeDIgPSBkW3hdXG4gICAgdmFyIHg0ID0gZFt4Ml1cbiAgICB2YXIgeDggPSBkW3g0XVxuXG4gICAgLy8gQ29tcHV0ZSBzdWIgYnl0ZXMsIG1peCBjb2x1bW5zIHRhYmxlc1xuICAgIHZhciB0ID0gKGRbc3hdICogMHgxMDEpIF4gKHN4ICogMHgxMDEwMTAwKVxuICAgIFNVQl9NSVhbMF1beF0gPSAodCA8PCAyNCkgfCAodCA+Pj4gOClcbiAgICBTVUJfTUlYWzFdW3hdID0gKHQgPDwgMTYpIHwgKHQgPj4+IDE2KVxuICAgIFNVQl9NSVhbMl1beF0gPSAodCA8PCA4KSB8ICh0ID4+PiAyNClcbiAgICBTVUJfTUlYWzNdW3hdID0gdFxuXG4gICAgLy8gQ29tcHV0ZSBpbnYgc3ViIGJ5dGVzLCBpbnYgbWl4IGNvbHVtbnMgdGFibGVzXG4gICAgdCA9ICh4OCAqIDB4MTAxMDEwMSkgXiAoeDQgKiAweDEwMDAxKSBeICh4MiAqIDB4MTAxKSBeICh4ICogMHgxMDEwMTAwKVxuICAgIElOVl9TVUJfTUlYWzBdW3N4XSA9ICh0IDw8IDI0KSB8ICh0ID4+PiA4KVxuICAgIElOVl9TVUJfTUlYWzFdW3N4XSA9ICh0IDw8IDE2KSB8ICh0ID4+PiAxNilcbiAgICBJTlZfU1VCX01JWFsyXVtzeF0gPSAodCA8PCA4KSB8ICh0ID4+PiAyNClcbiAgICBJTlZfU1VCX01JWFszXVtzeF0gPSB0XG5cbiAgICBpZiAoeCA9PT0gMCkge1xuICAgICAgeCA9IHhpID0gMVxuICAgIH0gZWxzZSB7XG4gICAgICB4ID0geDIgXiBkW2RbZFt4OCBeIHgyXV1dXG4gICAgICB4aSBePSBkW2RbeGldXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgU0JPWDogU0JPWCxcbiAgICBJTlZfU0JPWDogSU5WX1NCT1gsXG4gICAgU1VCX01JWDogU1VCX01JWCxcbiAgICBJTlZfU1VCX01JWDogSU5WX1NVQl9NSVhcbiAgfVxufSkoKVxuXG5mdW5jdGlvbiBBRVMgKGtleSkge1xuICB0aGlzLl9rZXkgPSBhc1VJbnQzMkFycmF5KGtleSlcbiAgdGhpcy5fcmVzZXQoKVxufVxuXG5BRVMuYmxvY2tTaXplID0gNCAqIDRcbkFFUy5rZXlTaXplID0gMjU2IC8gOFxuQUVTLnByb3RvdHlwZS5ibG9ja1NpemUgPSBBRVMuYmxvY2tTaXplXG5BRVMucHJvdG90eXBlLmtleVNpemUgPSBBRVMua2V5U2l6ZVxuQUVTLnByb3RvdHlwZS5fcmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBrZXlXb3JkcyA9IHRoaXMuX2tleVxuICB2YXIga2V5U2l6ZSA9IGtleVdvcmRzLmxlbmd0aFxuICB2YXIgblJvdW5kcyA9IGtleVNpemUgKyA2XG4gIHZhciBrc1Jvd3MgPSAoblJvdW5kcyArIDEpICogNFxuXG4gIHZhciBrZXlTY2hlZHVsZSA9IFtdXG4gIGZvciAodmFyIGsgPSAwOyBrIDwga2V5U2l6ZTsgaysrKSB7XG4gICAga2V5U2NoZWR1bGVba10gPSBrZXlXb3Jkc1trXVxuICB9XG5cbiAgZm9yIChrID0ga2V5U2l6ZTsgayA8IGtzUm93czsgaysrKSB7XG4gICAgdmFyIHQgPSBrZXlTY2hlZHVsZVtrIC0gMV1cblxuICAgIGlmIChrICUga2V5U2l6ZSA9PT0gMCkge1xuICAgICAgdCA9ICh0IDw8IDgpIHwgKHQgPj4+IDI0KVxuICAgICAgdCA9XG4gICAgICAgIChHLlNCT1hbdCA+Pj4gMjRdIDw8IDI0KSB8XG4gICAgICAgIChHLlNCT1hbKHQgPj4+IDE2KSAmIDB4ZmZdIDw8IDE2KSB8XG4gICAgICAgIChHLlNCT1hbKHQgPj4+IDgpICYgMHhmZl0gPDwgOCkgfFxuICAgICAgICAoRy5TQk9YW3QgJiAweGZmXSlcblxuICAgICAgdCBePSBSQ09OWyhrIC8ga2V5U2l6ZSkgfCAwXSA8PCAyNFxuICAgIH0gZWxzZSBpZiAoa2V5U2l6ZSA+IDYgJiYgayAlIGtleVNpemUgPT09IDQpIHtcbiAgICAgIHQgPVxuICAgICAgICAoRy5TQk9YW3QgPj4+IDI0XSA8PCAyNCkgfFxuICAgICAgICAoRy5TQk9YWyh0ID4+PiAxNikgJiAweGZmXSA8PCAxNikgfFxuICAgICAgICAoRy5TQk9YWyh0ID4+PiA4KSAmIDB4ZmZdIDw8IDgpIHxcbiAgICAgICAgKEcuU0JPWFt0ICYgMHhmZl0pXG4gICAgfVxuXG4gICAga2V5U2NoZWR1bGVba10gPSBrZXlTY2hlZHVsZVtrIC0ga2V5U2l6ZV0gXiB0XG4gIH1cblxuICB2YXIgaW52S2V5U2NoZWR1bGUgPSBbXVxuICBmb3IgKHZhciBpayA9IDA7IGlrIDwga3NSb3dzOyBpaysrKSB7XG4gICAgdmFyIGtzUiA9IGtzUm93cyAtIGlrXG4gICAgdmFyIHR0ID0ga2V5U2NoZWR1bGVba3NSIC0gKGlrICUgNCA/IDAgOiA0KV1cblxuICAgIGlmIChpayA8IDQgfHwga3NSIDw9IDQpIHtcbiAgICAgIGludktleVNjaGVkdWxlW2lrXSA9IHR0XG4gICAgfSBlbHNlIHtcbiAgICAgIGludktleVNjaGVkdWxlW2lrXSA9XG4gICAgICAgIEcuSU5WX1NVQl9NSVhbMF1bRy5TQk9YW3R0ID4+PiAyNF1dIF5cbiAgICAgICAgRy5JTlZfU1VCX01JWFsxXVtHLlNCT1hbKHR0ID4+PiAxNikgJiAweGZmXV0gXlxuICAgICAgICBHLklOVl9TVUJfTUlYWzJdW0cuU0JPWFsodHQgPj4+IDgpICYgMHhmZl1dIF5cbiAgICAgICAgRy5JTlZfU1VCX01JWFszXVtHLlNCT1hbdHQgJiAweGZmXV1cbiAgICB9XG4gIH1cblxuICB0aGlzLl9uUm91bmRzID0gblJvdW5kc1xuICB0aGlzLl9rZXlTY2hlZHVsZSA9IGtleVNjaGVkdWxlXG4gIHRoaXMuX2ludktleVNjaGVkdWxlID0gaW52S2V5U2NoZWR1bGVcbn1cblxuQUVTLnByb3RvdHlwZS5lbmNyeXB0QmxvY2tSYXcgPSBmdW5jdGlvbiAoTSkge1xuICBNID0gYXNVSW50MzJBcnJheShNKVxuICByZXR1cm4gY3J5cHRCbG9jayhNLCB0aGlzLl9rZXlTY2hlZHVsZSwgRy5TVUJfTUlYLCBHLlNCT1gsIHRoaXMuX25Sb3VuZHMpXG59XG5cbkFFUy5wcm90b3R5cGUuZW5jcnlwdEJsb2NrID0gZnVuY3Rpb24gKE0pIHtcbiAgdmFyIG91dCA9IHRoaXMuZW5jcnlwdEJsb2NrUmF3KE0pXG4gIHZhciBidWYgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMTYpXG4gIGJ1Zi53cml0ZVVJbnQzMkJFKG91dFswXSwgMClcbiAgYnVmLndyaXRlVUludDMyQkUob3V0WzFdLCA0KVxuICBidWYud3JpdGVVSW50MzJCRShvdXRbMl0sIDgpXG4gIGJ1Zi53cml0ZVVJbnQzMkJFKG91dFszXSwgMTIpXG4gIHJldHVybiBidWZcbn1cblxuQUVTLnByb3RvdHlwZS5kZWNyeXB0QmxvY2sgPSBmdW5jdGlvbiAoTSkge1xuICBNID0gYXNVSW50MzJBcnJheShNKVxuXG4gIC8vIHN3YXBcbiAgdmFyIG0xID0gTVsxXVxuICBNWzFdID0gTVszXVxuICBNWzNdID0gbTFcblxuICB2YXIgb3V0ID0gY3J5cHRCbG9jayhNLCB0aGlzLl9pbnZLZXlTY2hlZHVsZSwgRy5JTlZfU1VCX01JWCwgRy5JTlZfU0JPWCwgdGhpcy5fblJvdW5kcylcbiAgdmFyIGJ1ZiA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgxNilcbiAgYnVmLndyaXRlVUludDMyQkUob3V0WzBdLCAwKVxuICBidWYud3JpdGVVSW50MzJCRShvdXRbM10sIDQpXG4gIGJ1Zi53cml0ZVVJbnQzMkJFKG91dFsyXSwgOClcbiAgYnVmLndyaXRlVUludDMyQkUob3V0WzFdLCAxMilcbiAgcmV0dXJuIGJ1ZlxufVxuXG5BRVMucHJvdG90eXBlLnNjcnViID0gZnVuY3Rpb24gKCkge1xuICBzY3J1YlZlYyh0aGlzLl9rZXlTY2hlZHVsZSlcbiAgc2NydWJWZWModGhpcy5faW52S2V5U2NoZWR1bGUpXG4gIHNjcnViVmVjKHRoaXMuX2tleSlcbn1cblxubW9kdWxlLmV4cG9ydHMuQUVTID0gQUVTXG4iLCJ2YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcbnZhciBaRVJPRVMgPSBCdWZmZXIuYWxsb2MoMTYsIDApXG5cbmZ1bmN0aW9uIHRvQXJyYXkgKGJ1Zikge1xuICByZXR1cm4gW1xuICAgIGJ1Zi5yZWFkVUludDMyQkUoMCksXG4gICAgYnVmLnJlYWRVSW50MzJCRSg0KSxcbiAgICBidWYucmVhZFVJbnQzMkJFKDgpLFxuICAgIGJ1Zi5yZWFkVUludDMyQkUoMTIpXG4gIF1cbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5IChvdXQpIHtcbiAgdmFyIGJ1ZiA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgxNilcbiAgYnVmLndyaXRlVUludDMyQkUob3V0WzBdID4+PiAwLCAwKVxuICBidWYud3JpdGVVSW50MzJCRShvdXRbMV0gPj4+IDAsIDQpXG4gIGJ1Zi53cml0ZVVJbnQzMkJFKG91dFsyXSA+Pj4gMCwgOClcbiAgYnVmLndyaXRlVUludDMyQkUob3V0WzNdID4+PiAwLCAxMilcbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBHSEFTSCAoa2V5KSB7XG4gIHRoaXMuaCA9IGtleVxuICB0aGlzLnN0YXRlID0gQnVmZmVyLmFsbG9jKDE2LCAwKVxuICB0aGlzLmNhY2hlID0gQnVmZmVyLmFsbG9jVW5zYWZlKDApXG59XG5cbi8vIGZyb20gaHR0cDovL2JpdHdpc2VzaGlmdGxlZnQuZ2l0aHViLmlvL3NqY2wvZG9jL3N5bWJvbHMvc3JjL2NvcmVfZ2NtLmpzLmh0bWxcbi8vIGJ5IEp1aG8gVsOkaMOkLUhlcnR0dWFcbkdIQVNILnByb3RvdHlwZS5naGFzaCA9IGZ1bmN0aW9uIChibG9jaykge1xuICB2YXIgaSA9IC0xXG4gIHdoaWxlICgrK2kgPCBibG9jay5sZW5ndGgpIHtcbiAgICB0aGlzLnN0YXRlW2ldIF49IGJsb2NrW2ldXG4gIH1cbiAgdGhpcy5fbXVsdGlwbHkoKVxufVxuXG5HSEFTSC5wcm90b3R5cGUuX211bHRpcGx5ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgVmkgPSB0b0FycmF5KHRoaXMuaClcbiAgdmFyIFppID0gWzAsIDAsIDAsIDBdXG4gIHZhciBqLCB4aSwgbHNiVmlcbiAgdmFyIGkgPSAtMVxuICB3aGlsZSAoKytpIDwgMTI4KSB7XG4gICAgeGkgPSAodGhpcy5zdGF0ZVt+fihpIC8gOCldICYgKDEgPDwgKDcgLSAoaSAlIDgpKSkpICE9PSAwXG4gICAgaWYgKHhpKSB7XG4gICAgICAvLyBaX2krMSA9IFpfaSBeIFZfaVxuICAgICAgWmlbMF0gXj0gVmlbMF1cbiAgICAgIFppWzFdIF49IFZpWzFdXG4gICAgICBaaVsyXSBePSBWaVsyXVxuICAgICAgWmlbM10gXj0gVmlbM11cbiAgICB9XG5cbiAgICAvLyBTdG9yZSB0aGUgdmFsdWUgb2YgTFNCKFZfaSlcbiAgICBsc2JWaSA9IChWaVszXSAmIDEpICE9PSAwXG5cbiAgICAvLyBWX2krMSA9IFZfaSA+PiAxXG4gICAgZm9yIChqID0gMzsgaiA+IDA7IGotLSkge1xuICAgICAgVmlbal0gPSAoVmlbal0gPj4+IDEpIHwgKChWaVtqIC0gMV0gJiAxKSA8PCAzMSlcbiAgICB9XG4gICAgVmlbMF0gPSBWaVswXSA+Pj4gMVxuXG4gICAgLy8gSWYgTFNCKFZfaSkgaXMgMSwgVl9pKzEgPSAoVl9pID4+IDEpIF4gUlxuICAgIGlmIChsc2JWaSkge1xuICAgICAgVmlbMF0gPSBWaVswXSBeICgweGUxIDw8IDI0KVxuICAgIH1cbiAgfVxuICB0aGlzLnN0YXRlID0gZnJvbUFycmF5KFppKVxufVxuXG5HSEFTSC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGJ1Zikge1xuICB0aGlzLmNhY2hlID0gQnVmZmVyLmNvbmNhdChbdGhpcy5jYWNoZSwgYnVmXSlcbiAgdmFyIGNodW5rXG4gIHdoaWxlICh0aGlzLmNhY2hlLmxlbmd0aCA+PSAxNikge1xuICAgIGNodW5rID0gdGhpcy5jYWNoZS5zbGljZSgwLCAxNilcbiAgICB0aGlzLmNhY2hlID0gdGhpcy5jYWNoZS5zbGljZSgxNilcbiAgICB0aGlzLmdoYXNoKGNodW5rKVxuICB9XG59XG5cbkdIQVNILnByb3RvdHlwZS5maW5hbCA9IGZ1bmN0aW9uIChhYmwsIGJsKSB7XG4gIGlmICh0aGlzLmNhY2hlLmxlbmd0aCkge1xuICAgIHRoaXMuZ2hhc2goQnVmZmVyLmNvbmNhdChbdGhpcy5jYWNoZSwgWkVST0VTXSwgMTYpKVxuICB9XG5cbiAgdGhpcy5naGFzaChmcm9tQXJyYXkoWzAsIGFibCwgMCwgYmxdKSlcbiAgcmV0dXJuIHRoaXMuc3RhdGVcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHSEFTSFxuIiwidmFyIEF1dGhDaXBoZXIgPSByZXF1aXJlKCcuL2F1dGhDaXBoZXInKVxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG52YXIgTU9ERVMgPSByZXF1aXJlKCcuL21vZGVzJylcbnZhciBTdHJlYW1DaXBoZXIgPSByZXF1aXJlKCcuL3N0cmVhbUNpcGhlcicpXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnY2lwaGVyLWJhc2UnKVxudmFyIGFlcyA9IHJlcXVpcmUoJy4vYWVzJylcbnZhciBlYnRrID0gcmVxdWlyZSgnZXZwX2J5dGVzdG9rZXknKVxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxuXG5mdW5jdGlvbiBEZWNpcGhlciAobW9kZSwga2V5LCBpdikge1xuICBUcmFuc2Zvcm0uY2FsbCh0aGlzKVxuXG4gIHRoaXMuX2NhY2hlID0gbmV3IFNwbGl0dGVyKClcbiAgdGhpcy5fbGFzdCA9IHZvaWQgMFxuICB0aGlzLl9jaXBoZXIgPSBuZXcgYWVzLkFFUyhrZXkpXG4gIHRoaXMuX3ByZXYgPSBCdWZmZXIuZnJvbShpdilcbiAgdGhpcy5fbW9kZSA9IG1vZGVcbiAgdGhpcy5fYXV0b3BhZGRpbmcgPSB0cnVlXG59XG5cbmluaGVyaXRzKERlY2lwaGVyLCBUcmFuc2Zvcm0pXG5cbkRlY2lwaGVyLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgdGhpcy5fY2FjaGUuYWRkKGRhdGEpXG4gIHZhciBjaHVua1xuICB2YXIgdGhpbmdcbiAgdmFyIG91dCA9IFtdXG4gIHdoaWxlICgoY2h1bmsgPSB0aGlzLl9jYWNoZS5nZXQodGhpcy5fYXV0b3BhZGRpbmcpKSkge1xuICAgIHRoaW5nID0gdGhpcy5fbW9kZS5kZWNyeXB0KHRoaXMsIGNodW5rKVxuICAgIG91dC5wdXNoKHRoaW5nKVxuICB9XG4gIHJldHVybiBCdWZmZXIuY29uY2F0KG91dClcbn1cblxuRGVjaXBoZXIucHJvdG90eXBlLl9maW5hbCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNodW5rID0gdGhpcy5fY2FjaGUuZmx1c2goKVxuICBpZiAodGhpcy5fYXV0b3BhZGRpbmcpIHtcbiAgICByZXR1cm4gdW5wYWQodGhpcy5fbW9kZS5kZWNyeXB0KHRoaXMsIGNodW5rKSlcbiAgfSBlbHNlIGlmIChjaHVuaykge1xuICAgIHRocm93IG5ldyBFcnJvcignZGF0YSBub3QgbXVsdGlwbGUgb2YgYmxvY2sgbGVuZ3RoJylcbiAgfVxufVxuXG5EZWNpcGhlci5wcm90b3R5cGUuc2V0QXV0b1BhZGRpbmcgPSBmdW5jdGlvbiAoc2V0VG8pIHtcbiAgdGhpcy5fYXV0b3BhZGRpbmcgPSAhIXNldFRvXG4gIHJldHVybiB0aGlzXG59XG5cbmZ1bmN0aW9uIFNwbGl0dGVyICgpIHtcbiAgdGhpcy5jYWNoZSA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgwKVxufVxuXG5TcGxpdHRlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgdGhpcy5jYWNoZSA9IEJ1ZmZlci5jb25jYXQoW3RoaXMuY2FjaGUsIGRhdGFdKVxufVxuXG5TcGxpdHRlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGF1dG9QYWRkaW5nKSB7XG4gIHZhciBvdXRcbiAgaWYgKGF1dG9QYWRkaW5nKSB7XG4gICAgaWYgKHRoaXMuY2FjaGUubGVuZ3RoID4gMTYpIHtcbiAgICAgIG91dCA9IHRoaXMuY2FjaGUuc2xpY2UoMCwgMTYpXG4gICAgICB0aGlzLmNhY2hlID0gdGhpcy5jYWNoZS5zbGljZSgxNilcbiAgICAgIHJldHVybiBvdXRcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKHRoaXMuY2FjaGUubGVuZ3RoID49IDE2KSB7XG4gICAgICBvdXQgPSB0aGlzLmNhY2hlLnNsaWNlKDAsIDE2KVxuICAgICAgdGhpcy5jYWNoZSA9IHRoaXMuY2FjaGUuc2xpY2UoMTYpXG4gICAgICByZXR1cm4gb3V0XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuU3BsaXR0ZXIucHJvdG90eXBlLmZsdXNoID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5jYWNoZS5sZW5ndGgpIHJldHVybiB0aGlzLmNhY2hlXG59XG5cbmZ1bmN0aW9uIHVucGFkIChsYXN0KSB7XG4gIHZhciBwYWRkZWQgPSBsYXN0WzE1XVxuICBpZiAocGFkZGVkIDwgMSB8fCBwYWRkZWQgPiAxNikge1xuICAgIHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIGRlY3J5cHQgZGF0YScpXG4gIH1cbiAgdmFyIGkgPSAtMVxuICB3aGlsZSAoKytpIDwgcGFkZGVkKSB7XG4gICAgaWYgKGxhc3RbKGkgKyAoMTYgLSBwYWRkZWQpKV0gIT09IHBhZGRlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmFibGUgdG8gZGVjcnlwdCBkYXRhJylcbiAgICB9XG4gIH1cbiAgaWYgKHBhZGRlZCA9PT0gMTYpIHJldHVyblxuXG4gIHJldHVybiBsYXN0LnNsaWNlKDAsIDE2IC0gcGFkZGVkKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVEZWNpcGhlcml2IChzdWl0ZSwgcGFzc3dvcmQsIGl2KSB7XG4gIHZhciBjb25maWcgPSBNT0RFU1tzdWl0ZS50b0xvd2VyQ2FzZSgpXVxuICBpZiAoIWNvbmZpZykgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBzdWl0ZSB0eXBlJylcblxuICBpZiAodHlwZW9mIGl2ID09PSAnc3RyaW5nJykgaXYgPSBCdWZmZXIuZnJvbShpdilcbiAgaWYgKGNvbmZpZy5tb2RlICE9PSAnR0NNJyAmJiBpdi5sZW5ndGggIT09IGNvbmZpZy5pdikgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBpdiBsZW5ndGggJyArIGl2Lmxlbmd0aClcblxuICBpZiAodHlwZW9mIHBhc3N3b3JkID09PSAnc3RyaW5nJykgcGFzc3dvcmQgPSBCdWZmZXIuZnJvbShwYXNzd29yZClcbiAgaWYgKHBhc3N3b3JkLmxlbmd0aCAhPT0gY29uZmlnLmtleSAvIDgpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQga2V5IGxlbmd0aCAnICsgcGFzc3dvcmQubGVuZ3RoKVxuXG4gIGlmIChjb25maWcudHlwZSA9PT0gJ3N0cmVhbScpIHtcbiAgICByZXR1cm4gbmV3IFN0cmVhbUNpcGhlcihjb25maWcubW9kdWxlLCBwYXNzd29yZCwgaXYsIHRydWUpXG4gIH0gZWxzZSBpZiAoY29uZmlnLnR5cGUgPT09ICdhdXRoJykge1xuICAgIHJldHVybiBuZXcgQXV0aENpcGhlcihjb25maWcubW9kdWxlLCBwYXNzd29yZCwgaXYsIHRydWUpXG4gIH1cblxuICByZXR1cm4gbmV3IERlY2lwaGVyKGNvbmZpZy5tb2R1bGUsIHBhc3N3b3JkLCBpdilcbn1cblxuZnVuY3Rpb24gY3JlYXRlRGVjaXBoZXIgKHN1aXRlLCBwYXNzd29yZCkge1xuICB2YXIgY29uZmlnID0gTU9ERVNbc3VpdGUudG9Mb3dlckNhc2UoKV1cbiAgaWYgKCFjb25maWcpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgc3VpdGUgdHlwZScpXG5cbiAgdmFyIGtleXMgPSBlYnRrKHBhc3N3b3JkLCBmYWxzZSwgY29uZmlnLmtleSwgY29uZmlnLml2KVxuICByZXR1cm4gY3JlYXRlRGVjaXBoZXJpdihzdWl0ZSwga2V5cy5rZXksIGtleXMuaXYpXG59XG5cbmV4cG9ydHMuY3JlYXRlRGVjaXBoZXIgPSBjcmVhdGVEZWNpcGhlclxuZXhwb3J0cy5jcmVhdGVEZWNpcGhlcml2ID0gY3JlYXRlRGVjaXBoZXJpdlxuIiwidmFyIHhvciA9IHJlcXVpcmUoJ2J1ZmZlci14b3InKVxuXG5mdW5jdGlvbiBnZXRCbG9jayAoc2VsZikge1xuICBzZWxmLl9wcmV2ID0gc2VsZi5fY2lwaGVyLmVuY3J5cHRCbG9jayhzZWxmLl9wcmV2KVxuICByZXR1cm4gc2VsZi5fcHJldlxufVxuXG5leHBvcnRzLmVuY3J5cHQgPSBmdW5jdGlvbiAoc2VsZiwgY2h1bmspIHtcbiAgd2hpbGUgKHNlbGYuX2NhY2hlLmxlbmd0aCA8IGNodW5rLmxlbmd0aCkge1xuICAgIHNlbGYuX2NhY2hlID0gQnVmZmVyLmNvbmNhdChbc2VsZi5fY2FjaGUsIGdldEJsb2NrKHNlbGYpXSlcbiAgfVxuXG4gIHZhciBwYWQgPSBzZWxmLl9jYWNoZS5zbGljZSgwLCBjaHVuay5sZW5ndGgpXG4gIHNlbGYuX2NhY2hlID0gc2VsZi5fY2FjaGUuc2xpY2UoY2h1bmsubGVuZ3RoKVxuICByZXR1cm4geG9yKGNodW5rLCBwYWQpXG59XG4iLCJ2YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcblxuZnVuY3Rpb24gZW5jcnlwdEJ5dGUgKHNlbGYsIGJ5dGVQYXJhbSwgZGVjcnlwdCkge1xuICB2YXIgcGFkXG4gIHZhciBpID0gLTFcbiAgdmFyIGxlbiA9IDhcbiAgdmFyIG91dCA9IDBcbiAgdmFyIGJpdCwgdmFsdWVcbiAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgIHBhZCA9IHNlbGYuX2NpcGhlci5lbmNyeXB0QmxvY2soc2VsZi5fcHJldilcbiAgICBiaXQgPSAoYnl0ZVBhcmFtICYgKDEgPDwgKDcgLSBpKSkpID8gMHg4MCA6IDBcbiAgICB2YWx1ZSA9IHBhZFswXSBeIGJpdFxuICAgIG91dCArPSAoKHZhbHVlICYgMHg4MCkgPj4gKGkgJSA4KSlcbiAgICBzZWxmLl9wcmV2ID0gc2hpZnRJbihzZWxmLl9wcmV2LCBkZWNyeXB0ID8gYml0IDogdmFsdWUpXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBzaGlmdEluIChidWZmZXIsIHZhbHVlKSB7XG4gIHZhciBsZW4gPSBidWZmZXIubGVuZ3RoXG4gIHZhciBpID0gLTFcbiAgdmFyIG91dCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShidWZmZXIubGVuZ3RoKVxuICBidWZmZXIgPSBCdWZmZXIuY29uY2F0KFtidWZmZXIsIEJ1ZmZlci5mcm9tKFt2YWx1ZV0pXSlcblxuICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgb3V0W2ldID0gYnVmZmVyW2ldIDw8IDEgfCBidWZmZXJbaSArIDFdID4+ICg3KVxuICB9XG5cbiAgcmV0dXJuIG91dFxufVxuXG5leHBvcnRzLmVuY3J5cHQgPSBmdW5jdGlvbiAoc2VsZiwgY2h1bmssIGRlY3J5cHQpIHtcbiAgdmFyIGxlbiA9IGNodW5rLmxlbmd0aFxuICB2YXIgb3V0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbilcbiAgdmFyIGkgPSAtMVxuXG4gIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICBvdXRbaV0gPSBlbmNyeXB0Qnl0ZShzZWxmLCBjaHVua1tpXSwgZGVjcnlwdClcbiAgfVxuXG4gIHJldHVybiBvdXRcbn1cbiIsInZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxuXG5mdW5jdGlvbiBlbmNyeXB0Qnl0ZSAoc2VsZiwgYnl0ZVBhcmFtLCBkZWNyeXB0KSB7XG4gIHZhciBwYWQgPSBzZWxmLl9jaXBoZXIuZW5jcnlwdEJsb2NrKHNlbGYuX3ByZXYpXG4gIHZhciBvdXQgPSBwYWRbMF0gXiBieXRlUGFyYW1cblxuICBzZWxmLl9wcmV2ID0gQnVmZmVyLmNvbmNhdChbXG4gICAgc2VsZi5fcHJldi5zbGljZSgxKSxcbiAgICBCdWZmZXIuZnJvbShbZGVjcnlwdCA/IGJ5dGVQYXJhbSA6IG91dF0pXG4gIF0pXG5cbiAgcmV0dXJuIG91dFxufVxuXG5leHBvcnRzLmVuY3J5cHQgPSBmdW5jdGlvbiAoc2VsZiwgY2h1bmssIGRlY3J5cHQpIHtcbiAgdmFyIGxlbiA9IGNodW5rLmxlbmd0aFxuICB2YXIgb3V0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbilcbiAgdmFyIGkgPSAtMVxuXG4gIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICBvdXRbaV0gPSBlbmNyeXB0Qnl0ZShzZWxmLCBjaHVua1tpXSwgZGVjcnlwdClcbiAgfVxuXG4gIHJldHVybiBvdXRcbn1cbiIsInZhciB4b3IgPSByZXF1aXJlKCdidWZmZXIteG9yJylcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxudmFyIGluY3IzMiA9IHJlcXVpcmUoJy4uL2luY3IzMicpXG5cbmZ1bmN0aW9uIGdldEJsb2NrIChzZWxmKSB7XG4gIHZhciBvdXQgPSBzZWxmLl9jaXBoZXIuZW5jcnlwdEJsb2NrUmF3KHNlbGYuX3ByZXYpXG4gIGluY3IzMihzZWxmLl9wcmV2KVxuICByZXR1cm4gb3V0XG59XG5cbnZhciBibG9ja1NpemUgPSAxNlxuZXhwb3J0cy5lbmNyeXB0ID0gZnVuY3Rpb24gKHNlbGYsIGNodW5rKSB7XG4gIHZhciBjaHVua051bSA9IE1hdGguY2VpbChjaHVuay5sZW5ndGggLyBibG9ja1NpemUpXG4gIHZhciBzdGFydCA9IHNlbGYuX2NhY2hlLmxlbmd0aFxuICBzZWxmLl9jYWNoZSA9IEJ1ZmZlci5jb25jYXQoW1xuICAgIHNlbGYuX2NhY2hlLFxuICAgIEJ1ZmZlci5hbGxvY1Vuc2FmZShjaHVua051bSAqIGJsb2NrU2l6ZSlcbiAgXSlcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua051bTsgaSsrKSB7XG4gICAgdmFyIG91dCA9IGdldEJsb2NrKHNlbGYpXG4gICAgdmFyIG9mZnNldCA9IHN0YXJ0ICsgaSAqIGJsb2NrU2l6ZVxuICAgIHNlbGYuX2NhY2hlLndyaXRlVUludDMyQkUob3V0WzBdLCBvZmZzZXQgKyAwKVxuICAgIHNlbGYuX2NhY2hlLndyaXRlVUludDMyQkUob3V0WzFdLCBvZmZzZXQgKyA0KVxuICAgIHNlbGYuX2NhY2hlLndyaXRlVUludDMyQkUob3V0WzJdLCBvZmZzZXQgKyA4KVxuICAgIHNlbGYuX2NhY2hlLndyaXRlVUludDMyQkUob3V0WzNdLCBvZmZzZXQgKyAxMilcbiAgfVxuICB2YXIgcGFkID0gc2VsZi5fY2FjaGUuc2xpY2UoMCwgY2h1bmsubGVuZ3RoKVxuICBzZWxmLl9jYWNoZSA9IHNlbGYuX2NhY2hlLnNsaWNlKGNodW5rLmxlbmd0aClcbiAgcmV0dXJuIHhvcihjaHVuaywgcGFkKVxufVxuIiwidmFyIGFlcyA9IHJlcXVpcmUoJy4vYWVzJylcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJ2NpcGhlci1iYXNlJylcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBHSEFTSCA9IHJlcXVpcmUoJy4vZ2hhc2gnKVxudmFyIHhvciA9IHJlcXVpcmUoJ2J1ZmZlci14b3InKVxudmFyIGluY3IzMiA9IHJlcXVpcmUoJy4vaW5jcjMyJylcblxuZnVuY3Rpb24geG9yVGVzdCAoYSwgYikge1xuICB2YXIgb3V0ID0gMFxuICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSBvdXQrK1xuXG4gIHZhciBsZW4gPSBNYXRoLm1pbihhLmxlbmd0aCwgYi5sZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBvdXQgKz0gKGFbaV0gXiBiW2ldKVxuICB9XG5cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBjYWxjSXYgKHNlbGYsIGl2LCBjaykge1xuICBpZiAoaXYubGVuZ3RoID09PSAxMikge1xuICAgIHNlbGYuX2ZpbklEID0gQnVmZmVyLmNvbmNhdChbaXYsIEJ1ZmZlci5mcm9tKFswLCAwLCAwLCAxXSldKVxuICAgIHJldHVybiBCdWZmZXIuY29uY2F0KFtpdiwgQnVmZmVyLmZyb20oWzAsIDAsIDAsIDJdKV0pXG4gIH1cbiAgdmFyIGdoYXNoID0gbmV3IEdIQVNIKGNrKVxuICB2YXIgbGVuID0gaXYubGVuZ3RoXG4gIHZhciB0b1BhZCA9IGxlbiAlIDE2XG4gIGdoYXNoLnVwZGF0ZShpdilcbiAgaWYgKHRvUGFkKSB7XG4gICAgdG9QYWQgPSAxNiAtIHRvUGFkXG4gICAgZ2hhc2gudXBkYXRlKEJ1ZmZlci5hbGxvYyh0b1BhZCwgMCkpXG4gIH1cbiAgZ2hhc2gudXBkYXRlKEJ1ZmZlci5hbGxvYyg4LCAwKSlcbiAgdmFyIGl2Qml0cyA9IGxlbiAqIDhcbiAgdmFyIHRhaWwgPSBCdWZmZXIuYWxsb2MoOClcbiAgdGFpbC53cml0ZVVJbnRCRShpdkJpdHMsIDAsIDgpXG4gIGdoYXNoLnVwZGF0ZSh0YWlsKVxuICBzZWxmLl9maW5JRCA9IGdoYXNoLnN0YXRlXG4gIHZhciBvdXQgPSBCdWZmZXIuZnJvbShzZWxmLl9maW5JRClcbiAgaW5jcjMyKG91dClcbiAgcmV0dXJuIG91dFxufVxuZnVuY3Rpb24gU3RyZWFtQ2lwaGVyIChtb2RlLCBrZXksIGl2LCBkZWNyeXB0KSB7XG4gIFRyYW5zZm9ybS5jYWxsKHRoaXMpXG5cbiAgdmFyIGggPSBCdWZmZXIuYWxsb2MoNCwgMClcblxuICB0aGlzLl9jaXBoZXIgPSBuZXcgYWVzLkFFUyhrZXkpXG4gIHZhciBjayA9IHRoaXMuX2NpcGhlci5lbmNyeXB0QmxvY2soaClcbiAgdGhpcy5fZ2hhc2ggPSBuZXcgR0hBU0goY2spXG4gIGl2ID0gY2FsY0l2KHRoaXMsIGl2LCBjaylcblxuICB0aGlzLl9wcmV2ID0gQnVmZmVyLmZyb20oaXYpXG4gIHRoaXMuX2NhY2hlID0gQnVmZmVyLmFsbG9jVW5zYWZlKDApXG4gIHRoaXMuX3NlY0NhY2hlID0gQnVmZmVyLmFsbG9jVW5zYWZlKDApXG4gIHRoaXMuX2RlY3J5cHQgPSBkZWNyeXB0XG4gIHRoaXMuX2FsZW4gPSAwXG4gIHRoaXMuX2xlbiA9IDBcbiAgdGhpcy5fbW9kZSA9IG1vZGVcblxuICB0aGlzLl9hdXRoVGFnID0gbnVsbFxuICB0aGlzLl9jYWxsZWQgPSBmYWxzZVxufVxuXG5pbmhlcml0cyhTdHJlYW1DaXBoZXIsIFRyYW5zZm9ybSlcblxuU3RyZWFtQ2lwaGVyLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24gKGNodW5rKSB7XG4gIGlmICghdGhpcy5fY2FsbGVkICYmIHRoaXMuX2FsZW4pIHtcbiAgICB2YXIgcnVtcCA9IDE2IC0gKHRoaXMuX2FsZW4gJSAxNilcbiAgICBpZiAocnVtcCA8IDE2KSB7XG4gICAgICBydW1wID0gQnVmZmVyLmFsbG9jKHJ1bXAsIDApXG4gICAgICB0aGlzLl9naGFzaC51cGRhdGUocnVtcClcbiAgICB9XG4gIH1cblxuICB0aGlzLl9jYWxsZWQgPSB0cnVlXG4gIHZhciBvdXQgPSB0aGlzLl9tb2RlLmVuY3J5cHQodGhpcywgY2h1bmspXG4gIGlmICh0aGlzLl9kZWNyeXB0KSB7XG4gICAgdGhpcy5fZ2hhc2gudXBkYXRlKGNodW5rKVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2doYXNoLnVwZGF0ZShvdXQpXG4gIH1cbiAgdGhpcy5fbGVuICs9IGNodW5rLmxlbmd0aFxuICByZXR1cm4gb3V0XG59XG5cblN0cmVhbUNpcGhlci5wcm90b3R5cGUuX2ZpbmFsID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5fZGVjcnlwdCAmJiAhdGhpcy5fYXV0aFRhZykgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBzdGF0ZSBvciB1bmFibGUgdG8gYXV0aGVudGljYXRlIGRhdGEnKVxuXG4gIHZhciB0YWcgPSB4b3IodGhpcy5fZ2hhc2guZmluYWwodGhpcy5fYWxlbiAqIDgsIHRoaXMuX2xlbiAqIDgpLCB0aGlzLl9jaXBoZXIuZW5jcnlwdEJsb2NrKHRoaXMuX2ZpbklEKSlcbiAgaWYgKHRoaXMuX2RlY3J5cHQgJiYgeG9yVGVzdCh0YWcsIHRoaXMuX2F1dGhUYWcpKSB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHN0YXRlIG9yIHVuYWJsZSB0byBhdXRoZW50aWNhdGUgZGF0YScpXG5cbiAgdGhpcy5fYXV0aFRhZyA9IHRhZ1xuICB0aGlzLl9jaXBoZXIuc2NydWIoKVxufVxuXG5TdHJlYW1DaXBoZXIucHJvdG90eXBlLmdldEF1dGhUYWcgPSBmdW5jdGlvbiBnZXRBdXRoVGFnICgpIHtcbiAgaWYgKHRoaXMuX2RlY3J5cHQgfHwgIUJ1ZmZlci5pc0J1ZmZlcih0aGlzLl9hdXRoVGFnKSkgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0aW5nIHRvIGdldCBhdXRoIHRhZyBpbiB1bnN1cHBvcnRlZCBzdGF0ZScpXG5cbiAgcmV0dXJuIHRoaXMuX2F1dGhUYWdcbn1cblxuU3RyZWFtQ2lwaGVyLnByb3RvdHlwZS5zZXRBdXRoVGFnID0gZnVuY3Rpb24gc2V0QXV0aFRhZyAodGFnKSB7XG4gIGlmICghdGhpcy5fZGVjcnlwdCkgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0aW5nIHRvIHNldCBhdXRoIHRhZyBpbiB1bnN1cHBvcnRlZCBzdGF0ZScpXG5cbiAgdGhpcy5fYXV0aFRhZyA9IHRhZ1xufVxuXG5TdHJlYW1DaXBoZXIucHJvdG90eXBlLnNldEFBRCA9IGZ1bmN0aW9uIHNldEFBRCAoYnVmKSB7XG4gIGlmICh0aGlzLl9jYWxsZWQpIHRocm93IG5ldyBFcnJvcignQXR0ZW1wdGluZyB0byBzZXQgQUFEIGluIHVuc3VwcG9ydGVkIHN0YXRlJylcblxuICB0aGlzLl9naGFzaC51cGRhdGUoYnVmKVxuICB0aGlzLl9hbGVuICs9IGJ1Zi5sZW5ndGhcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdHJlYW1DaXBoZXJcbiIsInZhciBNT0RFUyA9IHJlcXVpcmUoJy4vbW9kZXMnKVxudmFyIEF1dGhDaXBoZXIgPSByZXF1aXJlKCcuL2F1dGhDaXBoZXInKVxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG52YXIgU3RyZWFtQ2lwaGVyID0gcmVxdWlyZSgnLi9zdHJlYW1DaXBoZXInKVxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJ2NpcGhlci1iYXNlJylcbnZhciBhZXMgPSByZXF1aXJlKCcuL2FlcycpXG52YXIgZWJ0ayA9IHJlcXVpcmUoJ2V2cF9ieXRlc3Rva2V5JylcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcblxuZnVuY3Rpb24gQ2lwaGVyIChtb2RlLCBrZXksIGl2KSB7XG4gIFRyYW5zZm9ybS5jYWxsKHRoaXMpXG5cbiAgdGhpcy5fY2FjaGUgPSBuZXcgU3BsaXR0ZXIoKVxuICB0aGlzLl9jaXBoZXIgPSBuZXcgYWVzLkFFUyhrZXkpXG4gIHRoaXMuX3ByZXYgPSBCdWZmZXIuZnJvbShpdilcbiAgdGhpcy5fbW9kZSA9IG1vZGVcbiAgdGhpcy5fYXV0b3BhZGRpbmcgPSB0cnVlXG59XG5cbmluaGVyaXRzKENpcGhlciwgVHJhbnNmb3JtKVxuXG5DaXBoZXIucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICB0aGlzLl9jYWNoZS5hZGQoZGF0YSlcbiAgdmFyIGNodW5rXG4gIHZhciB0aGluZ1xuICB2YXIgb3V0ID0gW11cblxuICB3aGlsZSAoKGNodW5rID0gdGhpcy5fY2FjaGUuZ2V0KCkpKSB7XG4gICAgdGhpbmcgPSB0aGlzLl9tb2RlLmVuY3J5cHQodGhpcywgY2h1bmspXG4gICAgb3V0LnB1c2godGhpbmcpXG4gIH1cblxuICByZXR1cm4gQnVmZmVyLmNvbmNhdChvdXQpXG59XG5cbnZhciBQQURESU5HID0gQnVmZmVyLmFsbG9jKDE2LCAweDEwKVxuXG5DaXBoZXIucHJvdG90eXBlLl9maW5hbCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNodW5rID0gdGhpcy5fY2FjaGUuZmx1c2goKVxuICBpZiAodGhpcy5fYXV0b3BhZGRpbmcpIHtcbiAgICBjaHVuayA9IHRoaXMuX21vZGUuZW5jcnlwdCh0aGlzLCBjaHVuaylcbiAgICB0aGlzLl9jaXBoZXIuc2NydWIoKVxuICAgIHJldHVybiBjaHVua1xuICB9XG5cbiAgaWYgKCFjaHVuay5lcXVhbHMoUEFERElORykpIHtcbiAgICB0aGlzLl9jaXBoZXIuc2NydWIoKVxuICAgIHRocm93IG5ldyBFcnJvcignZGF0YSBub3QgbXVsdGlwbGUgb2YgYmxvY2sgbGVuZ3RoJylcbiAgfVxufVxuXG5DaXBoZXIucHJvdG90eXBlLnNldEF1dG9QYWRkaW5nID0gZnVuY3Rpb24gKHNldFRvKSB7XG4gIHRoaXMuX2F1dG9wYWRkaW5nID0gISFzZXRUb1xuICByZXR1cm4gdGhpc1xufVxuXG5mdW5jdGlvbiBTcGxpdHRlciAoKSB7XG4gIHRoaXMuY2FjaGUgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMClcbn1cblxuU3BsaXR0ZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIHRoaXMuY2FjaGUgPSBCdWZmZXIuY29uY2F0KFt0aGlzLmNhY2hlLCBkYXRhXSlcbn1cblxuU3BsaXR0ZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuY2FjaGUubGVuZ3RoID4gMTUpIHtcbiAgICB2YXIgb3V0ID0gdGhpcy5jYWNoZS5zbGljZSgwLCAxNilcbiAgICB0aGlzLmNhY2hlID0gdGhpcy5jYWNoZS5zbGljZSgxNilcbiAgICByZXR1cm4gb3V0XG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxuU3BsaXR0ZXIucHJvdG90eXBlLmZsdXNoID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbGVuID0gMTYgLSB0aGlzLmNhY2hlLmxlbmd0aFxuICB2YXIgcGFkQnVmZiA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW4pXG5cbiAgdmFyIGkgPSAtMVxuICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgcGFkQnVmZi53cml0ZVVJbnQ4KGxlbiwgaSlcbiAgfVxuXG4gIHJldHVybiBCdWZmZXIuY29uY2F0KFt0aGlzLmNhY2hlLCBwYWRCdWZmXSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2lwaGVyaXYgKHN1aXRlLCBwYXNzd29yZCwgaXYpIHtcbiAgdmFyIGNvbmZpZyA9IE1PREVTW3N1aXRlLnRvTG93ZXJDYXNlKCldXG4gIGlmICghY29uZmlnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHN1aXRlIHR5cGUnKVxuXG4gIGlmICh0eXBlb2YgcGFzc3dvcmQgPT09ICdzdHJpbmcnKSBwYXNzd29yZCA9IEJ1ZmZlci5mcm9tKHBhc3N3b3JkKVxuICBpZiAocGFzc3dvcmQubGVuZ3RoICE9PSBjb25maWcua2V5IC8gOCkgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBrZXkgbGVuZ3RoICcgKyBwYXNzd29yZC5sZW5ndGgpXG5cbiAgaWYgKHR5cGVvZiBpdiA9PT0gJ3N0cmluZycpIGl2ID0gQnVmZmVyLmZyb20oaXYpXG4gIGlmIChjb25maWcubW9kZSAhPT0gJ0dDTScgJiYgaXYubGVuZ3RoICE9PSBjb25maWcuaXYpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgaXYgbGVuZ3RoICcgKyBpdi5sZW5ndGgpXG5cbiAgaWYgKGNvbmZpZy50eXBlID09PSAnc3RyZWFtJykge1xuICAgIHJldHVybiBuZXcgU3RyZWFtQ2lwaGVyKGNvbmZpZy5tb2R1bGUsIHBhc3N3b3JkLCBpdilcbiAgfSBlbHNlIGlmIChjb25maWcudHlwZSA9PT0gJ2F1dGgnKSB7XG4gICAgcmV0dXJuIG5ldyBBdXRoQ2lwaGVyKGNvbmZpZy5tb2R1bGUsIHBhc3N3b3JkLCBpdilcbiAgfVxuXG4gIHJldHVybiBuZXcgQ2lwaGVyKGNvbmZpZy5tb2R1bGUsIHBhc3N3b3JkLCBpdilcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2lwaGVyIChzdWl0ZSwgcGFzc3dvcmQpIHtcbiAgdmFyIGNvbmZpZyA9IE1PREVTW3N1aXRlLnRvTG93ZXJDYXNlKCldXG4gIGlmICghY29uZmlnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHN1aXRlIHR5cGUnKVxuXG4gIHZhciBrZXlzID0gZWJ0ayhwYXNzd29yZCwgZmFsc2UsIGNvbmZpZy5rZXksIGNvbmZpZy5pdilcbiAgcmV0dXJuIGNyZWF0ZUNpcGhlcml2KHN1aXRlLCBrZXlzLmtleSwga2V5cy5pdilcbn1cblxuZXhwb3J0cy5jcmVhdGVDaXBoZXJpdiA9IGNyZWF0ZUNpcGhlcml2XG5leHBvcnRzLmNyZWF0ZUNpcGhlciA9IGNyZWF0ZUNpcGhlclxuIiwidmFyIG1vZGVNb2R1bGVzID0ge1xuICBFQ0I6IHJlcXVpcmUoJy4vZWNiJyksXG4gIENCQzogcmVxdWlyZSgnLi9jYmMnKSxcbiAgQ0ZCOiByZXF1aXJlKCcuL2NmYicpLFxuICBDRkI4OiByZXF1aXJlKCcuL2NmYjgnKSxcbiAgQ0ZCMTogcmVxdWlyZSgnLi9jZmIxJyksXG4gIE9GQjogcmVxdWlyZSgnLi9vZmInKSxcbiAgQ1RSOiByZXF1aXJlKCcuL2N0cicpLFxuICBHQ006IHJlcXVpcmUoJy4vY3RyJylcbn1cblxudmFyIG1vZGVzID0gcmVxdWlyZSgnLi9saXN0Lmpzb24nKVxuXG5mb3IgKHZhciBrZXkgaW4gbW9kZXMpIHtcbiAgbW9kZXNba2V5XS5tb2R1bGUgPSBtb2RlTW9kdWxlc1ttb2Rlc1trZXldLm1vZGVdXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbW9kZXNcbiIsImZ1bmN0aW9uIGluY3IzMiAoaXYpIHtcbiAgdmFyIGxlbiA9IGl2Lmxlbmd0aFxuICB2YXIgaXRlbVxuICB3aGlsZSAobGVuLS0pIHtcbiAgICBpdGVtID0gaXYucmVhZFVJbnQ4KGxlbilcbiAgICBpZiAoaXRlbSA9PT0gMjU1KSB7XG4gICAgICBpdi53cml0ZVVJbnQ4KDAsIGxlbilcbiAgICB9IGVsc2Uge1xuICAgICAgaXRlbSsrXG4gICAgICBpdi53cml0ZVVJbnQ4KGl0ZW0sIGxlbilcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluY3IzMlxuIiwidmFyIHhvciA9IHJlcXVpcmUoJ2J1ZmZlci14b3InKVxuXG5leHBvcnRzLmVuY3J5cHQgPSBmdW5jdGlvbiAoc2VsZiwgYmxvY2spIHtcbiAgdmFyIGRhdGEgPSB4b3IoYmxvY2ssIHNlbGYuX3ByZXYpXG5cbiAgc2VsZi5fcHJldiA9IHNlbGYuX2NpcGhlci5lbmNyeXB0QmxvY2soZGF0YSlcbiAgcmV0dXJuIHNlbGYuX3ByZXZcbn1cblxuZXhwb3J0cy5kZWNyeXB0ID0gZnVuY3Rpb24gKHNlbGYsIGJsb2NrKSB7XG4gIHZhciBwYWQgPSBzZWxmLl9wcmV2XG5cbiAgc2VsZi5fcHJldiA9IGJsb2NrXG4gIHZhciBvdXQgPSBzZWxmLl9jaXBoZXIuZGVjcnlwdEJsb2NrKGJsb2NrKVxuXG4gIHJldHVybiB4b3Iob3V0LCBwYWQpXG59XG4iXSwic291cmNlUm9vdCI6IiJ9