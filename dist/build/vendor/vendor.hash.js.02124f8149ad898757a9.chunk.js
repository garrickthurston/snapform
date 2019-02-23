(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.hash.js"],{

/***/ "7ckf":
/*!*************************************************!*\
  !*** ./node_modules/hash.js/lib/hash/common.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "w8CP");
var assert = __webpack_require__(/*! minimalistic-assert */ "2j6C");

function BlockHash() {
  this.pending = null;
  this.pendingTotal = 0;
  this.blockSize = this.constructor.blockSize;
  this.outSize = this.constructor.outSize;
  this.hmacStrength = this.constructor.hmacStrength;
  this.padLength = this.constructor.padLength / 8;
  this.endian = 'big';

  this._delta8 = this.blockSize / 8;
  this._delta32 = this.blockSize / 32;
}
exports.BlockHash = BlockHash;

BlockHash.prototype.update = function update(msg, enc) {
  // Convert message to array, pad it, and join into 32bit blocks
  msg = utils.toArray(msg, enc);
  if (!this.pending)
    this.pending = msg;
  else
    this.pending = this.pending.concat(msg);
  this.pendingTotal += msg.length;

  // Enough data, try updating
  if (this.pending.length >= this._delta8) {
    msg = this.pending;

    // Process pending data in blocks
    var r = msg.length % this._delta8;
    this.pending = msg.slice(msg.length - r, msg.length);
    if (this.pending.length === 0)
      this.pending = null;

    msg = utils.join32(msg, 0, msg.length - r, this.endian);
    for (var i = 0; i < msg.length; i += this._delta32)
      this._update(msg, i, i + this._delta32);
  }

  return this;
};

BlockHash.prototype.digest = function digest(enc) {
  this.update(this._pad());
  assert(this.pending === null);

  return this._digest(enc);
};

BlockHash.prototype._pad = function pad() {
  var len = this.pendingTotal;
  var bytes = this._delta8;
  var k = bytes - ((len + this.padLength) % bytes);
  var res = new Array(k + this.padLength);
  res[0] = 0x80;
  for (var i = 1; i < k; i++)
    res[i] = 0;

  // Append length
  len <<= 3;
  if (this.endian === 'big') {
    for (var t = 8; t < this.padLength; t++)
      res[i++] = 0;

    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = len & 0xff;
  } else {
    res[i++] = len & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;

    for (t = 8; t < this.padLength; t++)
      res[i++] = 0;
  }

  return res;
};


/***/ }),

/***/ "B/J0":
/*!**************************************************!*\
  !*** ./node_modules/hash.js/lib/hash/sha/224.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "w8CP");
var SHA256 = __webpack_require__(/*! ./256 */ "bu2F");

function SHA224() {
  if (!(this instanceof SHA224))
    return new SHA224();

  SHA256.call(this);
  this.h = [
    0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
    0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4 ];
}
utils.inherits(SHA224, SHA256);
module.exports = SHA224;

SHA224.blockSize = 512;
SHA224.outSize = 224;
SHA224.hmacStrength = 192;
SHA224.padLength = 64;

SHA224.prototype._digest = function digest(enc) {
  // Just truncate output
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 7), 'big');
  else
    return utils.split32(this.h.slice(0, 7), 'big');
};



/***/ }),

/***/ "E+IA":
/*!************************************************!*\
  !*** ./node_modules/hash.js/lib/hash/sha/1.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "w8CP");
var common = __webpack_require__(/*! ../common */ "7ckf");
var shaCommon = __webpack_require__(/*! ./common */ "qlaj");

var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_5 = utils.sum32_5;
var ft_1 = shaCommon.ft_1;
var BlockHash = common.BlockHash;

var sha1_K = [
  0x5A827999, 0x6ED9EBA1,
  0x8F1BBCDC, 0xCA62C1D6
];

function SHA1() {
  if (!(this instanceof SHA1))
    return new SHA1();

  BlockHash.call(this);
  this.h = [
    0x67452301, 0xefcdab89, 0x98badcfe,
    0x10325476, 0xc3d2e1f0 ];
  this.W = new Array(80);
}

utils.inherits(SHA1, BlockHash);
module.exports = SHA1;

SHA1.blockSize = 512;
SHA1.outSize = 160;
SHA1.hmacStrength = 80;
SHA1.padLength = 64;

SHA1.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];

  for(; i < W.length; i++)
    W[i] = rotl32(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];

  for (i = 0; i < W.length; i++) {
    var s = ~~(i / 20);
    var t = sum32_5(rotl32(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
    e = d;
    d = c;
    c = rotl32(b, 30);
    b = a;
    a = t;
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
};

SHA1.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};


/***/ }),

/***/ "ITfd":
/*!***********************************************!*\
  !*** ./node_modules/hash.js/lib/hash/hmac.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "w8CP");
var assert = __webpack_require__(/*! minimalistic-assert */ "2j6C");

function Hmac(hash, key, enc) {
  if (!(this instanceof Hmac))
    return new Hmac(hash, key, enc);
  this.Hash = hash;
  this.blockSize = hash.blockSize / 8;
  this.outSize = hash.outSize / 8;
  this.inner = null;
  this.outer = null;

  this._init(utils.toArray(key, enc));
}
module.exports = Hmac;

Hmac.prototype._init = function init(key) {
  // Shorten key, if needed
  if (key.length > this.blockSize)
    key = new this.Hash().update(key).digest();
  assert(key.length <= this.blockSize);

  // Add padding to key
  for (var i = key.length; i < this.blockSize; i++)
    key.push(0);

  for (i = 0; i < key.length; i++)
    key[i] ^= 0x36;
  this.inner = new this.Hash().update(key);

  // 0x36 ^ 0x5c = 0x6a
  for (i = 0; i < key.length; i++)
    key[i] ^= 0x6a;
  this.outer = new this.Hash().update(key);
};

Hmac.prototype.update = function update(msg, enc) {
  this.inner.update(msg, enc);
  return this;
};

Hmac.prototype.digest = function digest(enc) {
  this.outer.update(this.inner.digest());
  return this.outer.digest(enc);
};


/***/ }),

/***/ "WRkp":
/*!**********************************************!*\
  !*** ./node_modules/hash.js/lib/hash/sha.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.sha1 = __webpack_require__(/*! ./sha/1 */ "E+IA");
exports.sha224 = __webpack_require__(/*! ./sha/224 */ "B/J0");
exports.sha256 = __webpack_require__(/*! ./sha/256 */ "bu2F");
exports.sha384 = __webpack_require__(/*! ./sha/384 */ "i5UE");
exports.sha512 = __webpack_require__(/*! ./sha/512 */ "tSWc");


/***/ }),

/***/ "bu2F":
/*!**************************************************!*\
  !*** ./node_modules/hash.js/lib/hash/sha/256.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "w8CP");
var common = __webpack_require__(/*! ../common */ "7ckf");
var shaCommon = __webpack_require__(/*! ./common */ "qlaj");
var assert = __webpack_require__(/*! minimalistic-assert */ "2j6C");

var sum32 = utils.sum32;
var sum32_4 = utils.sum32_4;
var sum32_5 = utils.sum32_5;
var ch32 = shaCommon.ch32;
var maj32 = shaCommon.maj32;
var s0_256 = shaCommon.s0_256;
var s1_256 = shaCommon.s1_256;
var g0_256 = shaCommon.g0_256;
var g1_256 = shaCommon.g1_256;

var BlockHash = common.BlockHash;

var sha256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function SHA256() {
  if (!(this instanceof SHA256))
    return new SHA256();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  this.k = sha256_K;
  this.W = new Array(64);
}
utils.inherits(SHA256, BlockHash);
module.exports = SHA256;

SHA256.blockSize = 512;
SHA256.outSize = 256;
SHA256.hmacStrength = 192;
SHA256.padLength = 64;

SHA256.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i++)
    W[i] = sum32_4(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];
  var f = this.h[5];
  var g = this.h[6];
  var h = this.h[7];

  assert(this.k.length === W.length);
  for (i = 0; i < W.length; i++) {
    var T1 = sum32_5(h, s1_256(e), ch32(e, f, g), this.k[i], W[i]);
    var T2 = sum32(s0_256(a), maj32(a, b, c));
    h = g;
    g = f;
    f = e;
    e = sum32(d, T1);
    d = c;
    c = b;
    b = a;
    a = sum32(T1, T2);
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
  this.h[5] = sum32(this.h[5], f);
  this.h[6] = sum32(this.h[6], g);
  this.h[7] = sum32(this.h[7], h);
};

SHA256.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};


/***/ }),

/***/ "fZJM":
/*!******************************************!*\
  !*** ./node_modules/hash.js/lib/hash.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var hash = exports;

hash.utils = __webpack_require__(/*! ./hash/utils */ "w8CP");
hash.common = __webpack_require__(/*! ./hash/common */ "7ckf");
hash.sha = __webpack_require__(/*! ./hash/sha */ "WRkp");
hash.ripemd = __webpack_require__(/*! ./hash/ripemd */ "u0Sq");
hash.hmac = __webpack_require__(/*! ./hash/hmac */ "ITfd");

// Proxy hash functions to the main object
hash.sha1 = hash.sha.sha1;
hash.sha256 = hash.sha.sha256;
hash.sha224 = hash.sha.sha224;
hash.sha384 = hash.sha.sha384;
hash.sha512 = hash.sha.sha512;
hash.ripemd160 = hash.ripemd.ripemd160;


/***/ }),

/***/ "i5UE":
/*!**************************************************!*\
  !*** ./node_modules/hash.js/lib/hash/sha/384.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "w8CP");

var SHA512 = __webpack_require__(/*! ./512 */ "tSWc");

function SHA384() {
  if (!(this instanceof SHA384))
    return new SHA384();

  SHA512.call(this);
  this.h = [
    0xcbbb9d5d, 0xc1059ed8,
    0x629a292a, 0x367cd507,
    0x9159015a, 0x3070dd17,
    0x152fecd8, 0xf70e5939,
    0x67332667, 0xffc00b31,
    0x8eb44a87, 0x68581511,
    0xdb0c2e0d, 0x64f98fa7,
    0x47b5481d, 0xbefa4fa4 ];
}
utils.inherits(SHA384, SHA512);
module.exports = SHA384;

SHA384.blockSize = 1024;
SHA384.outSize = 384;
SHA384.hmacStrength = 192;
SHA384.padLength = 128;

SHA384.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 12), 'big');
  else
    return utils.split32(this.h.slice(0, 12), 'big');
};


/***/ }),

/***/ "qlaj":
/*!*****************************************************!*\
  !*** ./node_modules/hash.js/lib/hash/sha/common.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "w8CP");
var rotr32 = utils.rotr32;

function ft_1(s, x, y, z) {
  if (s === 0)
    return ch32(x, y, z);
  if (s === 1 || s === 3)
    return p32(x, y, z);
  if (s === 2)
    return maj32(x, y, z);
}
exports.ft_1 = ft_1;

function ch32(x, y, z) {
  return (x & y) ^ ((~x) & z);
}
exports.ch32 = ch32;

function maj32(x, y, z) {
  return (x & y) ^ (x & z) ^ (y & z);
}
exports.maj32 = maj32;

function p32(x, y, z) {
  return x ^ y ^ z;
}
exports.p32 = p32;

function s0_256(x) {
  return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
}
exports.s0_256 = s0_256;

function s1_256(x) {
  return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
}
exports.s1_256 = s1_256;

function g0_256(x) {
  return rotr32(x, 7) ^ rotr32(x, 18) ^ (x >>> 3);
}
exports.g0_256 = g0_256;

function g1_256(x) {
  return rotr32(x, 17) ^ rotr32(x, 19) ^ (x >>> 10);
}
exports.g1_256 = g1_256;


/***/ }),

/***/ "tSWc":
/*!**************************************************!*\
  !*** ./node_modules/hash.js/lib/hash/sha/512.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "w8CP");
var common = __webpack_require__(/*! ../common */ "7ckf");
var assert = __webpack_require__(/*! minimalistic-assert */ "2j6C");

var rotr64_hi = utils.rotr64_hi;
var rotr64_lo = utils.rotr64_lo;
var shr64_hi = utils.shr64_hi;
var shr64_lo = utils.shr64_lo;
var sum64 = utils.sum64;
var sum64_hi = utils.sum64_hi;
var sum64_lo = utils.sum64_lo;
var sum64_4_hi = utils.sum64_4_hi;
var sum64_4_lo = utils.sum64_4_lo;
var sum64_5_hi = utils.sum64_5_hi;
var sum64_5_lo = utils.sum64_5_lo;

var BlockHash = common.BlockHash;

var sha512_K = [
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
];

function SHA512() {
  if (!(this instanceof SHA512))
    return new SHA512();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xf3bcc908,
    0xbb67ae85, 0x84caa73b,
    0x3c6ef372, 0xfe94f82b,
    0xa54ff53a, 0x5f1d36f1,
    0x510e527f, 0xade682d1,
    0x9b05688c, 0x2b3e6c1f,
    0x1f83d9ab, 0xfb41bd6b,
    0x5be0cd19, 0x137e2179 ];
  this.k = sha512_K;
  this.W = new Array(160);
}
utils.inherits(SHA512, BlockHash);
module.exports = SHA512;

SHA512.blockSize = 1024;
SHA512.outSize = 512;
SHA512.hmacStrength = 192;
SHA512.padLength = 128;

SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
  var W = this.W;

  // 32 x 32bit words
  for (var i = 0; i < 32; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i += 2) {
    var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);  // i - 2
    var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
    var c1_hi = W[i - 14];  // i - 7
    var c1_lo = W[i - 13];
    var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);  // i - 15
    var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
    var c3_hi = W[i - 32];  // i - 16
    var c3_lo = W[i - 31];

    W[i] = sum64_4_hi(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo);
    W[i + 1] = sum64_4_lo(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo);
  }
};

SHA512.prototype._update = function _update(msg, start) {
  this._prepareBlock(msg, start);

  var W = this.W;

  var ah = this.h[0];
  var al = this.h[1];
  var bh = this.h[2];
  var bl = this.h[3];
  var ch = this.h[4];
  var cl = this.h[5];
  var dh = this.h[6];
  var dl = this.h[7];
  var eh = this.h[8];
  var el = this.h[9];
  var fh = this.h[10];
  var fl = this.h[11];
  var gh = this.h[12];
  var gl = this.h[13];
  var hh = this.h[14];
  var hl = this.h[15];

  assert(this.k.length === W.length);
  for (var i = 0; i < W.length; i += 2) {
    var c0_hi = hh;
    var c0_lo = hl;
    var c1_hi = s1_512_hi(eh, el);
    var c1_lo = s1_512_lo(eh, el);
    var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
    var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
    var c3_hi = this.k[i];
    var c3_lo = this.k[i + 1];
    var c4_hi = W[i];
    var c4_lo = W[i + 1];

    var T1_hi = sum64_5_hi(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo,
      c4_hi, c4_lo);
    var T1_lo = sum64_5_lo(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo,
      c4_hi, c4_lo);

    c0_hi = s0_512_hi(ah, al);
    c0_lo = s0_512_lo(ah, al);
    c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
    c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);

    var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
    var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);

    hh = gh;
    hl = gl;

    gh = fh;
    gl = fl;

    fh = eh;
    fl = el;

    eh = sum64_hi(dh, dl, T1_hi, T1_lo);
    el = sum64_lo(dl, dl, T1_hi, T1_lo);

    dh = ch;
    dl = cl;

    ch = bh;
    cl = bl;

    bh = ah;
    bl = al;

    ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
    al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
  }

  sum64(this.h, 0, ah, al);
  sum64(this.h, 2, bh, bl);
  sum64(this.h, 4, ch, cl);
  sum64(this.h, 6, dh, dl);
  sum64(this.h, 8, eh, el);
  sum64(this.h, 10, fh, fl);
  sum64(this.h, 12, gh, gl);
  sum64(this.h, 14, hh, hl);
};

SHA512.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

function ch64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ ((~xh) & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function ch64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ ((~xl) & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 28);
  var c1_hi = rotr64_hi(xl, xh, 2);  // 34
  var c2_hi = rotr64_hi(xl, xh, 7);  // 39

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 28);
  var c1_lo = rotr64_lo(xl, xh, 2);  // 34
  var c2_lo = rotr64_lo(xl, xh, 7);  // 39

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 14);
  var c1_hi = rotr64_hi(xh, xl, 18);
  var c2_hi = rotr64_hi(xl, xh, 9);  // 41

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 14);
  var c1_lo = rotr64_lo(xh, xl, 18);
  var c2_lo = rotr64_lo(xl, xh, 9);  // 41

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 1);
  var c1_hi = rotr64_hi(xh, xl, 8);
  var c2_hi = shr64_hi(xh, xl, 7);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 1);
  var c1_lo = rotr64_lo(xh, xl, 8);
  var c2_lo = shr64_lo(xh, xl, 7);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 19);
  var c1_hi = rotr64_hi(xl, xh, 29);  // 61
  var c2_hi = shr64_hi(xh, xl, 6);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 19);
  var c1_lo = rotr64_lo(xl, xh, 29);  // 61
  var c2_lo = shr64_lo(xh, xl, 6);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}


/***/ }),

/***/ "u0Sq":
/*!*************************************************!*\
  !*** ./node_modules/hash.js/lib/hash/ripemd.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "w8CP");
var common = __webpack_require__(/*! ./common */ "7ckf");

var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_3 = utils.sum32_3;
var sum32_4 = utils.sum32_4;
var BlockHash = common.BlockHash;

function RIPEMD160() {
  if (!(this instanceof RIPEMD160))
    return new RIPEMD160();

  BlockHash.call(this);

  this.h = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 ];
  this.endian = 'little';
}
utils.inherits(RIPEMD160, BlockHash);
exports.ripemd160 = RIPEMD160;

RIPEMD160.blockSize = 512;
RIPEMD160.outSize = 160;
RIPEMD160.hmacStrength = 192;
RIPEMD160.padLength = 64;

RIPEMD160.prototype._update = function update(msg, start) {
  var A = this.h[0];
  var B = this.h[1];
  var C = this.h[2];
  var D = this.h[3];
  var E = this.h[4];
  var Ah = A;
  var Bh = B;
  var Ch = C;
  var Dh = D;
  var Eh = E;
  for (var j = 0; j < 80; j++) {
    var T = sum32(
      rotl32(
        sum32_4(A, f(j, B, C, D), msg[r[j] + start], K(j)),
        s[j]),
      E);
    A = E;
    E = D;
    D = rotl32(C, 10);
    C = B;
    B = T;
    T = sum32(
      rotl32(
        sum32_4(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
        sh[j]),
      Eh);
    Ah = Eh;
    Eh = Dh;
    Dh = rotl32(Ch, 10);
    Ch = Bh;
    Bh = T;
  }
  T = sum32_3(this.h[1], C, Dh);
  this.h[1] = sum32_3(this.h[2], D, Eh);
  this.h[2] = sum32_3(this.h[3], E, Ah);
  this.h[3] = sum32_3(this.h[4], A, Bh);
  this.h[4] = sum32_3(this.h[0], B, Ch);
  this.h[0] = T;
};

RIPEMD160.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'little');
  else
    return utils.split32(this.h, 'little');
};

function f(j, x, y, z) {
  if (j <= 15)
    return x ^ y ^ z;
  else if (j <= 31)
    return (x & y) | ((~x) & z);
  else if (j <= 47)
    return (x | (~y)) ^ z;
  else if (j <= 63)
    return (x & z) | (y & (~z));
  else
    return x ^ (y | (~z));
}

function K(j) {
  if (j <= 15)
    return 0x00000000;
  else if (j <= 31)
    return 0x5a827999;
  else if (j <= 47)
    return 0x6ed9eba1;
  else if (j <= 63)
    return 0x8f1bbcdc;
  else
    return 0xa953fd4e;
}

function Kh(j) {
  if (j <= 15)
    return 0x50a28be6;
  else if (j <= 31)
    return 0x5c4dd124;
  else if (j <= 47)
    return 0x6d703ef3;
  else if (j <= 63)
    return 0x7a6d76e9;
  else
    return 0x00000000;
}

var r = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
];

var rh = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
];

var s = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
];

var sh = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
];


/***/ }),

/***/ "w8CP":
/*!************************************************!*\
  !*** ./node_modules/hash.js/lib/hash/utils.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assert = __webpack_require__(/*! minimalistic-assert */ "2j6C");
var inherits = __webpack_require__(/*! inherits */ "P7XM");

exports.inherits = inherits;

function isSurrogatePair(msg, i) {
  if ((msg.charCodeAt(i) & 0xFC00) !== 0xD800) {
    return false;
  }
  if (i < 0 || i + 1 >= msg.length) {
    return false;
  }
  return (msg.charCodeAt(i + 1) & 0xFC00) === 0xDC00;
}

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg === 'string') {
    if (!enc) {
      // Inspired by stringToUtf8ByteArray() in closure-library by Google
      // https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js#L117-L143
      // Apache License 2.0
      // https://github.com/google/closure-library/blob/master/LICENSE
      var p = 0;
      for (var i = 0; i < msg.length; i++) {
        var c = msg.charCodeAt(i);
        if (c < 128) {
          res[p++] = c;
        } else if (c < 2048) {
          res[p++] = (c >> 6) | 192;
          res[p++] = (c & 63) | 128;
        } else if (isSurrogatePair(msg, i)) {
          c = 0x10000 + ((c & 0x03FF) << 10) + (msg.charCodeAt(++i) & 0x03FF);
          res[p++] = (c >> 18) | 240;
          res[p++] = ((c >> 12) & 63) | 128;
          res[p++] = ((c >> 6) & 63) | 128;
          res[p++] = (c & 63) | 128;
        } else {
          res[p++] = (c >> 12) | 224;
          res[p++] = ((c >> 6) & 63) | 128;
          res[p++] = (c & 63) | 128;
        }
      }
    } else if (enc === 'hex') {
      msg = msg.replace(/[^a-z0-9]+/ig, '');
      if (msg.length % 2 !== 0)
        msg = '0' + msg;
      for (i = 0; i < msg.length; i += 2)
        res.push(parseInt(msg[i] + msg[i + 1], 16));
    }
  } else {
    for (i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
  }
  return res;
}
exports.toArray = toArray;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
exports.toHex = toHex;

function htonl(w) {
  var res = (w >>> 24) |
            ((w >>> 8) & 0xff00) |
            ((w << 8) & 0xff0000) |
            ((w & 0xff) << 24);
  return res >>> 0;
}
exports.htonl = htonl;

function toHex32(msg, endian) {
  var res = '';
  for (var i = 0; i < msg.length; i++) {
    var w = msg[i];
    if (endian === 'little')
      w = htonl(w);
    res += zero8(w.toString(16));
  }
  return res;
}
exports.toHex32 = toHex32;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
exports.zero2 = zero2;

function zero8(word) {
  if (word.length === 7)
    return '0' + word;
  else if (word.length === 6)
    return '00' + word;
  else if (word.length === 5)
    return '000' + word;
  else if (word.length === 4)
    return '0000' + word;
  else if (word.length === 3)
    return '00000' + word;
  else if (word.length === 2)
    return '000000' + word;
  else if (word.length === 1)
    return '0000000' + word;
  else
    return word;
}
exports.zero8 = zero8;

function join32(msg, start, end, endian) {
  var len = end - start;
  assert(len % 4 === 0);
  var res = new Array(len / 4);
  for (var i = 0, k = start; i < res.length; i++, k += 4) {
    var w;
    if (endian === 'big')
      w = (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3];
    else
      w = (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
    res[i] = w >>> 0;
  }
  return res;
}
exports.join32 = join32;

function split32(msg, endian) {
  var res = new Array(msg.length * 4);
  for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
    var m = msg[i];
    if (endian === 'big') {
      res[k] = m >>> 24;
      res[k + 1] = (m >>> 16) & 0xff;
      res[k + 2] = (m >>> 8) & 0xff;
      res[k + 3] = m & 0xff;
    } else {
      res[k + 3] = m >>> 24;
      res[k + 2] = (m >>> 16) & 0xff;
      res[k + 1] = (m >>> 8) & 0xff;
      res[k] = m & 0xff;
    }
  }
  return res;
}
exports.split32 = split32;

function rotr32(w, b) {
  return (w >>> b) | (w << (32 - b));
}
exports.rotr32 = rotr32;

function rotl32(w, b) {
  return (w << b) | (w >>> (32 - b));
}
exports.rotl32 = rotl32;

function sum32(a, b) {
  return (a + b) >>> 0;
}
exports.sum32 = sum32;

function sum32_3(a, b, c) {
  return (a + b + c) >>> 0;
}
exports.sum32_3 = sum32_3;

function sum32_4(a, b, c, d) {
  return (a + b + c + d) >>> 0;
}
exports.sum32_4 = sum32_4;

function sum32_5(a, b, c, d, e) {
  return (a + b + c + d + e) >>> 0;
}
exports.sum32_5 = sum32_5;

function sum64(buf, pos, ah, al) {
  var bh = buf[pos];
  var bl = buf[pos + 1];

  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  buf[pos] = hi >>> 0;
  buf[pos + 1] = lo;
}
exports.sum64 = sum64;

function sum64_hi(ah, al, bh, bl) {
  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  return hi >>> 0;
}
exports.sum64_hi = sum64_hi;

function sum64_lo(ah, al, bh, bl) {
  var lo = al + bl;
  return lo >>> 0;
}
exports.sum64_lo = sum64_lo;

function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;

  var hi = ah + bh + ch + dh + carry;
  return hi >>> 0;
}
exports.sum64_4_hi = sum64_4_hi;

function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
  var lo = al + bl + cl + dl;
  return lo >>> 0;
}
exports.sum64_4_lo = sum64_4_lo;

function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;
  lo = (lo + el) >>> 0;
  carry += lo < el ? 1 : 0;

  var hi = ah + bh + ch + dh + eh + carry;
  return hi >>> 0;
}
exports.sum64_5_hi = sum64_5_hi;

function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var lo = al + bl + cl + dl + el;

  return lo >>> 0;
}
exports.sum64_5_lo = sum64_5_lo;

function rotr64_hi(ah, al, num) {
  var r = (al << (32 - num)) | (ah >>> num);
  return r >>> 0;
}
exports.rotr64_hi = rotr64_hi;

function rotr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
exports.rotr64_lo = rotr64_lo;

function shr64_hi(ah, al, num) {
  return ah >>> num;
}
exports.shr64_hi = shr64_hi;

function shr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
exports.shr64_lo = shr64_lo;


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaGFzaC5qcy9saWIvaGFzaC9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2hhc2guanMvbGliL2hhc2gvc2hhLzIyNC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaGFzaC5qcy9saWIvaGFzaC9zaGEvMS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaGFzaC5qcy9saWIvaGFzaC9obWFjLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9oYXNoLmpzL2xpYi9oYXNoL3NoYS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaGFzaC5qcy9saWIvaGFzaC9zaGEvMjU2LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9oYXNoLmpzL2xpYi9oYXNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9oYXNoLmpzL2xpYi9oYXNoL3NoYS8zODQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2hhc2guanMvbGliL2hhc2gvc2hhL2NvbW1vbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaGFzaC5qcy9saWIvaGFzaC9zaGEvNTEyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9oYXNoLmpzL2xpYi9oYXNoL3JpcGVtZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaGFzaC5qcy9saWIvaGFzaC91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7O0FBRWIsWUFBWSxtQkFBTyxDQUFDLHFCQUFTO0FBQzdCLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBcUI7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7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QUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5oYXNoLmpzLjAyMTI0ZjgxNDlhZDg5ODc1N2E5LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnbWluaW1hbGlzdGljLWFzc2VydCcpO1xyXG5cclxuZnVuY3Rpb24gQmxvY2tIYXNoKCkge1xyXG4gIHRoaXMucGVuZGluZyA9IG51bGw7XHJcbiAgdGhpcy5wZW5kaW5nVG90YWwgPSAwO1xyXG4gIHRoaXMuYmxvY2tTaXplID0gdGhpcy5jb25zdHJ1Y3Rvci5ibG9ja1NpemU7XHJcbiAgdGhpcy5vdXRTaXplID0gdGhpcy5jb25zdHJ1Y3Rvci5vdXRTaXplO1xyXG4gIHRoaXMuaG1hY1N0cmVuZ3RoID0gdGhpcy5jb25zdHJ1Y3Rvci5obWFjU3RyZW5ndGg7XHJcbiAgdGhpcy5wYWRMZW5ndGggPSB0aGlzLmNvbnN0cnVjdG9yLnBhZExlbmd0aCAvIDg7XHJcbiAgdGhpcy5lbmRpYW4gPSAnYmlnJztcclxuXHJcbiAgdGhpcy5fZGVsdGE4ID0gdGhpcy5ibG9ja1NpemUgLyA4O1xyXG4gIHRoaXMuX2RlbHRhMzIgPSB0aGlzLmJsb2NrU2l6ZSAvIDMyO1xyXG59XHJcbmV4cG9ydHMuQmxvY2tIYXNoID0gQmxvY2tIYXNoO1xyXG5cclxuQmxvY2tIYXNoLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUobXNnLCBlbmMpIHtcclxuICAvLyBDb252ZXJ0IG1lc3NhZ2UgdG8gYXJyYXksIHBhZCBpdCwgYW5kIGpvaW4gaW50byAzMmJpdCBibG9ja3NcclxuICBtc2cgPSB1dGlscy50b0FycmF5KG1zZywgZW5jKTtcclxuICBpZiAoIXRoaXMucGVuZGluZylcclxuICAgIHRoaXMucGVuZGluZyA9IG1zZztcclxuICBlbHNlXHJcbiAgICB0aGlzLnBlbmRpbmcgPSB0aGlzLnBlbmRpbmcuY29uY2F0KG1zZyk7XHJcbiAgdGhpcy5wZW5kaW5nVG90YWwgKz0gbXNnLmxlbmd0aDtcclxuXHJcbiAgLy8gRW5vdWdoIGRhdGEsIHRyeSB1cGRhdGluZ1xyXG4gIGlmICh0aGlzLnBlbmRpbmcubGVuZ3RoID49IHRoaXMuX2RlbHRhOCkge1xyXG4gICAgbXNnID0gdGhpcy5wZW5kaW5nO1xyXG5cclxuICAgIC8vIFByb2Nlc3MgcGVuZGluZyBkYXRhIGluIGJsb2Nrc1xyXG4gICAgdmFyIHIgPSBtc2cubGVuZ3RoICUgdGhpcy5fZGVsdGE4O1xyXG4gICAgdGhpcy5wZW5kaW5nID0gbXNnLnNsaWNlKG1zZy5sZW5ndGggLSByLCBtc2cubGVuZ3RoKTtcclxuICAgIGlmICh0aGlzLnBlbmRpbmcubGVuZ3RoID09PSAwKVxyXG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xyXG5cclxuICAgIG1zZyA9IHV0aWxzLmpvaW4zMihtc2csIDAsIG1zZy5sZW5ndGggLSByLCB0aGlzLmVuZGlhbik7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkgKz0gdGhpcy5fZGVsdGEzMilcclxuICAgICAgdGhpcy5fdXBkYXRlKG1zZywgaSwgaSArIHRoaXMuX2RlbHRhMzIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5CbG9ja0hhc2gucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uIGRpZ2VzdChlbmMpIHtcclxuICB0aGlzLnVwZGF0ZSh0aGlzLl9wYWQoKSk7XHJcbiAgYXNzZXJ0KHRoaXMucGVuZGluZyA9PT0gbnVsbCk7XHJcblxyXG4gIHJldHVybiB0aGlzLl9kaWdlc3QoZW5jKTtcclxufTtcclxuXHJcbkJsb2NrSGFzaC5wcm90b3R5cGUuX3BhZCA9IGZ1bmN0aW9uIHBhZCgpIHtcclxuICB2YXIgbGVuID0gdGhpcy5wZW5kaW5nVG90YWw7XHJcbiAgdmFyIGJ5dGVzID0gdGhpcy5fZGVsdGE4O1xyXG4gIHZhciBrID0gYnl0ZXMgLSAoKGxlbiArIHRoaXMucGFkTGVuZ3RoKSAlIGJ5dGVzKTtcclxuICB2YXIgcmVzID0gbmV3IEFycmF5KGsgKyB0aGlzLnBhZExlbmd0aCk7XHJcbiAgcmVzWzBdID0gMHg4MDtcclxuICBmb3IgKHZhciBpID0gMTsgaSA8IGs7IGkrKylcclxuICAgIHJlc1tpXSA9IDA7XHJcblxyXG4gIC8vIEFwcGVuZCBsZW5ndGhcclxuICBsZW4gPDw9IDM7XHJcbiAgaWYgKHRoaXMuZW5kaWFuID09PSAnYmlnJykge1xyXG4gICAgZm9yICh2YXIgdCA9IDg7IHQgPCB0aGlzLnBhZExlbmd0aDsgdCsrKVxyXG4gICAgICByZXNbaSsrXSA9IDA7XHJcblxyXG4gICAgcmVzW2krK10gPSAwO1xyXG4gICAgcmVzW2krK10gPSAwO1xyXG4gICAgcmVzW2krK10gPSAwO1xyXG4gICAgcmVzW2krK10gPSAwO1xyXG4gICAgcmVzW2krK10gPSAobGVuID4+PiAyNCkgJiAweGZmO1xyXG4gICAgcmVzW2krK10gPSAobGVuID4+PiAxNikgJiAweGZmO1xyXG4gICAgcmVzW2krK10gPSAobGVuID4+PiA4KSAmIDB4ZmY7XHJcbiAgICByZXNbaSsrXSA9IGxlbiAmIDB4ZmY7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJlc1tpKytdID0gbGVuICYgMHhmZjtcclxuICAgIHJlc1tpKytdID0gKGxlbiA+Pj4gOCkgJiAweGZmO1xyXG4gICAgcmVzW2krK10gPSAobGVuID4+PiAxNikgJiAweGZmO1xyXG4gICAgcmVzW2krK10gPSAobGVuID4+PiAyNCkgJiAweGZmO1xyXG4gICAgcmVzW2krK10gPSAwO1xyXG4gICAgcmVzW2krK10gPSAwO1xyXG4gICAgcmVzW2krK10gPSAwO1xyXG4gICAgcmVzW2krK10gPSAwO1xyXG5cclxuICAgIGZvciAodCA9IDg7IHQgPCB0aGlzLnBhZExlbmd0aDsgdCsrKVxyXG4gICAgICByZXNbaSsrXSA9IDA7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzO1xyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xyXG52YXIgU0hBMjU2ID0gcmVxdWlyZSgnLi8yNTYnKTtcclxuXHJcbmZ1bmN0aW9uIFNIQTIyNCgpIHtcclxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU0hBMjI0KSlcclxuICAgIHJldHVybiBuZXcgU0hBMjI0KCk7XHJcblxyXG4gIFNIQTI1Ni5jYWxsKHRoaXMpO1xyXG4gIHRoaXMuaCA9IFtcclxuICAgIDB4YzEwNTllZDgsIDB4MzY3Y2Q1MDcsIDB4MzA3MGRkMTcsIDB4ZjcwZTU5MzksXHJcbiAgICAweGZmYzAwYjMxLCAweDY4NTgxNTExLCAweDY0Zjk4ZmE3LCAweGJlZmE0ZmE0IF07XHJcbn1cclxudXRpbHMuaW5oZXJpdHMoU0hBMjI0LCBTSEEyNTYpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IFNIQTIyNDtcclxuXHJcblNIQTIyNC5ibG9ja1NpemUgPSA1MTI7XHJcblNIQTIyNC5vdXRTaXplID0gMjI0O1xyXG5TSEEyMjQuaG1hY1N0cmVuZ3RoID0gMTkyO1xyXG5TSEEyMjQucGFkTGVuZ3RoID0gNjQ7XHJcblxyXG5TSEEyMjQucHJvdG90eXBlLl9kaWdlc3QgPSBmdW5jdGlvbiBkaWdlc3QoZW5jKSB7XHJcbiAgLy8gSnVzdCB0cnVuY2F0ZSBvdXRwdXRcclxuICBpZiAoZW5jID09PSAnaGV4JylcclxuICAgIHJldHVybiB1dGlscy50b0hleDMyKHRoaXMuaC5zbGljZSgwLCA3KSwgJ2JpZycpO1xyXG4gIGVsc2VcclxuICAgIHJldHVybiB1dGlscy5zcGxpdDMyKHRoaXMuaC5zbGljZSgwLCA3KSwgJ2JpZycpO1xyXG59O1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcclxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4uL2NvbW1vbicpO1xyXG52YXIgc2hhQ29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcclxuXHJcbnZhciByb3RsMzIgPSB1dGlscy5yb3RsMzI7XHJcbnZhciBzdW0zMiA9IHV0aWxzLnN1bTMyO1xyXG52YXIgc3VtMzJfNSA9IHV0aWxzLnN1bTMyXzU7XHJcbnZhciBmdF8xID0gc2hhQ29tbW9uLmZ0XzE7XHJcbnZhciBCbG9ja0hhc2ggPSBjb21tb24uQmxvY2tIYXNoO1xyXG5cclxudmFyIHNoYTFfSyA9IFtcclxuICAweDVBODI3OTk5LCAweDZFRDlFQkExLFxyXG4gIDB4OEYxQkJDREMsIDB4Q0E2MkMxRDZcclxuXTtcclxuXHJcbmZ1bmN0aW9uIFNIQTEoKSB7XHJcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFNIQTEpKVxyXG4gICAgcmV0dXJuIG5ldyBTSEExKCk7XHJcblxyXG4gIEJsb2NrSGFzaC5jYWxsKHRoaXMpO1xyXG4gIHRoaXMuaCA9IFtcclxuICAgIDB4Njc0NTIzMDEsIDB4ZWZjZGFiODksIDB4OThiYWRjZmUsXHJcbiAgICAweDEwMzI1NDc2LCAweGMzZDJlMWYwIF07XHJcbiAgdGhpcy5XID0gbmV3IEFycmF5KDgwKTtcclxufVxyXG5cclxudXRpbHMuaW5oZXJpdHMoU0hBMSwgQmxvY2tIYXNoKTtcclxubW9kdWxlLmV4cG9ydHMgPSBTSEExO1xyXG5cclxuU0hBMS5ibG9ja1NpemUgPSA1MTI7XHJcblNIQTEub3V0U2l6ZSA9IDE2MDtcclxuU0hBMS5obWFjU3RyZW5ndGggPSA4MDtcclxuU0hBMS5wYWRMZW5ndGggPSA2NDtcclxuXHJcblNIQTEucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiBfdXBkYXRlKG1zZywgc3RhcnQpIHtcclxuICB2YXIgVyA9IHRoaXMuVztcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgaSsrKVxyXG4gICAgV1tpXSA9IG1zZ1tzdGFydCArIGldO1xyXG5cclxuICBmb3IoOyBpIDwgVy5sZW5ndGg7IGkrKylcclxuICAgIFdbaV0gPSByb3RsMzIoV1tpIC0gM10gXiBXW2kgLSA4XSBeIFdbaSAtIDE0XSBeIFdbaSAtIDE2XSwgMSk7XHJcblxyXG4gIHZhciBhID0gdGhpcy5oWzBdO1xyXG4gIHZhciBiID0gdGhpcy5oWzFdO1xyXG4gIHZhciBjID0gdGhpcy5oWzJdO1xyXG4gIHZhciBkID0gdGhpcy5oWzNdO1xyXG4gIHZhciBlID0gdGhpcy5oWzRdO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgVy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHMgPSB+fihpIC8gMjApO1xyXG4gICAgdmFyIHQgPSBzdW0zMl81KHJvdGwzMihhLCA1KSwgZnRfMShzLCBiLCBjLCBkKSwgZSwgV1tpXSwgc2hhMV9LW3NdKTtcclxuICAgIGUgPSBkO1xyXG4gICAgZCA9IGM7XHJcbiAgICBjID0gcm90bDMyKGIsIDMwKTtcclxuICAgIGIgPSBhO1xyXG4gICAgYSA9IHQ7XHJcbiAgfVxyXG5cclxuICB0aGlzLmhbMF0gPSBzdW0zMih0aGlzLmhbMF0sIGEpO1xyXG4gIHRoaXMuaFsxXSA9IHN1bTMyKHRoaXMuaFsxXSwgYik7XHJcbiAgdGhpcy5oWzJdID0gc3VtMzIodGhpcy5oWzJdLCBjKTtcclxuICB0aGlzLmhbM10gPSBzdW0zMih0aGlzLmhbM10sIGQpO1xyXG4gIHRoaXMuaFs0XSA9IHN1bTMyKHRoaXMuaFs0XSwgZSk7XHJcbn07XHJcblxyXG5TSEExLnByb3RvdHlwZS5fZGlnZXN0ID0gZnVuY3Rpb24gZGlnZXN0KGVuYykge1xyXG4gIGlmIChlbmMgPT09ICdoZXgnKVxyXG4gICAgcmV0dXJuIHV0aWxzLnRvSGV4MzIodGhpcy5oLCAnYmlnJyk7XHJcbiAgZWxzZVxyXG4gICAgcmV0dXJuIHV0aWxzLnNwbGl0MzIodGhpcy5oLCAnYmlnJyk7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ21pbmltYWxpc3RpYy1hc3NlcnQnKTtcclxuXHJcbmZ1bmN0aW9uIEhtYWMoaGFzaCwga2V5LCBlbmMpIHtcclxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgSG1hYykpXHJcbiAgICByZXR1cm4gbmV3IEhtYWMoaGFzaCwga2V5LCBlbmMpO1xyXG4gIHRoaXMuSGFzaCA9IGhhc2g7XHJcbiAgdGhpcy5ibG9ja1NpemUgPSBoYXNoLmJsb2NrU2l6ZSAvIDg7XHJcbiAgdGhpcy5vdXRTaXplID0gaGFzaC5vdXRTaXplIC8gODtcclxuICB0aGlzLmlubmVyID0gbnVsbDtcclxuICB0aGlzLm91dGVyID0gbnVsbDtcclxuXHJcbiAgdGhpcy5faW5pdCh1dGlscy50b0FycmF5KGtleSwgZW5jKSk7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBIbWFjO1xyXG5cclxuSG1hYy5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbiBpbml0KGtleSkge1xyXG4gIC8vIFNob3J0ZW4ga2V5LCBpZiBuZWVkZWRcclxuICBpZiAoa2V5Lmxlbmd0aCA+IHRoaXMuYmxvY2tTaXplKVxyXG4gICAga2V5ID0gbmV3IHRoaXMuSGFzaCgpLnVwZGF0ZShrZXkpLmRpZ2VzdCgpO1xyXG4gIGFzc2VydChrZXkubGVuZ3RoIDw9IHRoaXMuYmxvY2tTaXplKTtcclxuXHJcbiAgLy8gQWRkIHBhZGRpbmcgdG8ga2V5XHJcbiAgZm9yICh2YXIgaSA9IGtleS5sZW5ndGg7IGkgPCB0aGlzLmJsb2NrU2l6ZTsgaSsrKVxyXG4gICAga2V5LnB1c2goMCk7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBrZXkubGVuZ3RoOyBpKyspXHJcbiAgICBrZXlbaV0gXj0gMHgzNjtcclxuICB0aGlzLmlubmVyID0gbmV3IHRoaXMuSGFzaCgpLnVwZGF0ZShrZXkpO1xyXG5cclxuICAvLyAweDM2IF4gMHg1YyA9IDB4NmFcclxuICBmb3IgKGkgPSAwOyBpIDwga2V5Lmxlbmd0aDsgaSsrKVxyXG4gICAga2V5W2ldIF49IDB4NmE7XHJcbiAgdGhpcy5vdXRlciA9IG5ldyB0aGlzLkhhc2goKS51cGRhdGUoa2V5KTtcclxufTtcclxuXHJcbkhtYWMucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZShtc2csIGVuYykge1xyXG4gIHRoaXMuaW5uZXIudXBkYXRlKG1zZywgZW5jKTtcclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbkhtYWMucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uIGRpZ2VzdChlbmMpIHtcclxuICB0aGlzLm91dGVyLnVwZGF0ZSh0aGlzLmlubmVyLmRpZ2VzdCgpKTtcclxuICByZXR1cm4gdGhpcy5vdXRlci5kaWdlc3QoZW5jKTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0cy5zaGExID0gcmVxdWlyZSgnLi9zaGEvMScpO1xyXG5leHBvcnRzLnNoYTIyNCA9IHJlcXVpcmUoJy4vc2hhLzIyNCcpO1xyXG5leHBvcnRzLnNoYTI1NiA9IHJlcXVpcmUoJy4vc2hhLzI1NicpO1xyXG5leHBvcnRzLnNoYTM4NCA9IHJlcXVpcmUoJy4vc2hhLzM4NCcpO1xyXG5leHBvcnRzLnNoYTUxMiA9IHJlcXVpcmUoJy4vc2hhLzUxMicpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xyXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi4vY29tbW9uJyk7XHJcbnZhciBzaGFDb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnbWluaW1hbGlzdGljLWFzc2VydCcpO1xyXG5cclxudmFyIHN1bTMyID0gdXRpbHMuc3VtMzI7XHJcbnZhciBzdW0zMl80ID0gdXRpbHMuc3VtMzJfNDtcclxudmFyIHN1bTMyXzUgPSB1dGlscy5zdW0zMl81O1xyXG52YXIgY2gzMiA9IHNoYUNvbW1vbi5jaDMyO1xyXG52YXIgbWFqMzIgPSBzaGFDb21tb24ubWFqMzI7XHJcbnZhciBzMF8yNTYgPSBzaGFDb21tb24uczBfMjU2O1xyXG52YXIgczFfMjU2ID0gc2hhQ29tbW9uLnMxXzI1NjtcclxudmFyIGcwXzI1NiA9IHNoYUNvbW1vbi5nMF8yNTY7XHJcbnZhciBnMV8yNTYgPSBzaGFDb21tb24uZzFfMjU2O1xyXG5cclxudmFyIEJsb2NrSGFzaCA9IGNvbW1vbi5CbG9ja0hhc2g7XHJcblxyXG52YXIgc2hhMjU2X0sgPSBbXHJcbiAgMHg0MjhhMmY5OCwgMHg3MTM3NDQ5MSwgMHhiNWMwZmJjZiwgMHhlOWI1ZGJhNSxcclxuICAweDM5NTZjMjViLCAweDU5ZjExMWYxLCAweDkyM2Y4MmE0LCAweGFiMWM1ZWQ1LFxyXG4gIDB4ZDgwN2FhOTgsIDB4MTI4MzViMDEsIDB4MjQzMTg1YmUsIDB4NTUwYzdkYzMsXHJcbiAgMHg3MmJlNWQ3NCwgMHg4MGRlYjFmZSwgMHg5YmRjMDZhNywgMHhjMTliZjE3NCxcclxuICAweGU0OWI2OWMxLCAweGVmYmU0Nzg2LCAweDBmYzE5ZGM2LCAweDI0MGNhMWNjLFxyXG4gIDB4MmRlOTJjNmYsIDB4NGE3NDg0YWEsIDB4NWNiMGE5ZGMsIDB4NzZmOTg4ZGEsXHJcbiAgMHg5ODNlNTE1MiwgMHhhODMxYzY2ZCwgMHhiMDAzMjdjOCwgMHhiZjU5N2ZjNyxcclxuICAweGM2ZTAwYmYzLCAweGQ1YTc5MTQ3LCAweDA2Y2E2MzUxLCAweDE0MjkyOTY3LFxyXG4gIDB4MjdiNzBhODUsIDB4MmUxYjIxMzgsIDB4NGQyYzZkZmMsIDB4NTMzODBkMTMsXHJcbiAgMHg2NTBhNzM1NCwgMHg3NjZhMGFiYiwgMHg4MWMyYzkyZSwgMHg5MjcyMmM4NSxcclxuICAweGEyYmZlOGExLCAweGE4MWE2NjRiLCAweGMyNGI4YjcwLCAweGM3NmM1MWEzLFxyXG4gIDB4ZDE5MmU4MTksIDB4ZDY5OTA2MjQsIDB4ZjQwZTM1ODUsIDB4MTA2YWEwNzAsXHJcbiAgMHgxOWE0YzExNiwgMHgxZTM3NmMwOCwgMHgyNzQ4Nzc0YywgMHgzNGIwYmNiNSxcclxuICAweDM5MWMwY2IzLCAweDRlZDhhYTRhLCAweDViOWNjYTRmLCAweDY4MmU2ZmYzLFxyXG4gIDB4NzQ4ZjgyZWUsIDB4NzhhNTYzNmYsIDB4ODRjODc4MTQsIDB4OGNjNzAyMDgsXHJcbiAgMHg5MGJlZmZmYSwgMHhhNDUwNmNlYiwgMHhiZWY5YTNmNywgMHhjNjcxNzhmMlxyXG5dO1xyXG5cclxuZnVuY3Rpb24gU0hBMjU2KCkge1xyXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTSEEyNTYpKVxyXG4gICAgcmV0dXJuIG5ldyBTSEEyNTYoKTtcclxuXHJcbiAgQmxvY2tIYXNoLmNhbGwodGhpcyk7XHJcbiAgdGhpcy5oID0gW1xyXG4gICAgMHg2YTA5ZTY2NywgMHhiYjY3YWU4NSwgMHgzYzZlZjM3MiwgMHhhNTRmZjUzYSxcclxuICAgIDB4NTEwZTUyN2YsIDB4OWIwNTY4OGMsIDB4MWY4M2Q5YWIsIDB4NWJlMGNkMTlcclxuICBdO1xyXG4gIHRoaXMuayA9IHNoYTI1Nl9LO1xyXG4gIHRoaXMuVyA9IG5ldyBBcnJheSg2NCk7XHJcbn1cclxudXRpbHMuaW5oZXJpdHMoU0hBMjU2LCBCbG9ja0hhc2gpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IFNIQTI1NjtcclxuXHJcblNIQTI1Ni5ibG9ja1NpemUgPSA1MTI7XHJcblNIQTI1Ni5vdXRTaXplID0gMjU2O1xyXG5TSEEyNTYuaG1hY1N0cmVuZ3RoID0gMTkyO1xyXG5TSEEyNTYucGFkTGVuZ3RoID0gNjQ7XHJcblxyXG5TSEEyNTYucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiBfdXBkYXRlKG1zZywgc3RhcnQpIHtcclxuICB2YXIgVyA9IHRoaXMuVztcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgaSsrKVxyXG4gICAgV1tpXSA9IG1zZ1tzdGFydCArIGldO1xyXG4gIGZvciAoOyBpIDwgVy5sZW5ndGg7IGkrKylcclxuICAgIFdbaV0gPSBzdW0zMl80KGcxXzI1NihXW2kgLSAyXSksIFdbaSAtIDddLCBnMF8yNTYoV1tpIC0gMTVdKSwgV1tpIC0gMTZdKTtcclxuXHJcbiAgdmFyIGEgPSB0aGlzLmhbMF07XHJcbiAgdmFyIGIgPSB0aGlzLmhbMV07XHJcbiAgdmFyIGMgPSB0aGlzLmhbMl07XHJcbiAgdmFyIGQgPSB0aGlzLmhbM107XHJcbiAgdmFyIGUgPSB0aGlzLmhbNF07XHJcbiAgdmFyIGYgPSB0aGlzLmhbNV07XHJcbiAgdmFyIGcgPSB0aGlzLmhbNl07XHJcbiAgdmFyIGggPSB0aGlzLmhbN107XHJcblxyXG4gIGFzc2VydCh0aGlzLmsubGVuZ3RoID09PSBXLmxlbmd0aCk7XHJcbiAgZm9yIChpID0gMDsgaSA8IFcubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBUMSA9IHN1bTMyXzUoaCwgczFfMjU2KGUpLCBjaDMyKGUsIGYsIGcpLCB0aGlzLmtbaV0sIFdbaV0pO1xyXG4gICAgdmFyIFQyID0gc3VtMzIoczBfMjU2KGEpLCBtYWozMihhLCBiLCBjKSk7XHJcbiAgICBoID0gZztcclxuICAgIGcgPSBmO1xyXG4gICAgZiA9IGU7XHJcbiAgICBlID0gc3VtMzIoZCwgVDEpO1xyXG4gICAgZCA9IGM7XHJcbiAgICBjID0gYjtcclxuICAgIGIgPSBhO1xyXG4gICAgYSA9IHN1bTMyKFQxLCBUMik7XHJcbiAgfVxyXG5cclxuICB0aGlzLmhbMF0gPSBzdW0zMih0aGlzLmhbMF0sIGEpO1xyXG4gIHRoaXMuaFsxXSA9IHN1bTMyKHRoaXMuaFsxXSwgYik7XHJcbiAgdGhpcy5oWzJdID0gc3VtMzIodGhpcy5oWzJdLCBjKTtcclxuICB0aGlzLmhbM10gPSBzdW0zMih0aGlzLmhbM10sIGQpO1xyXG4gIHRoaXMuaFs0XSA9IHN1bTMyKHRoaXMuaFs0XSwgZSk7XHJcbiAgdGhpcy5oWzVdID0gc3VtMzIodGhpcy5oWzVdLCBmKTtcclxuICB0aGlzLmhbNl0gPSBzdW0zMih0aGlzLmhbNl0sIGcpO1xyXG4gIHRoaXMuaFs3XSA9IHN1bTMyKHRoaXMuaFs3XSwgaCk7XHJcbn07XHJcblxyXG5TSEEyNTYucHJvdG90eXBlLl9kaWdlc3QgPSBmdW5jdGlvbiBkaWdlc3QoZW5jKSB7XHJcbiAgaWYgKGVuYyA9PT0gJ2hleCcpXHJcbiAgICByZXR1cm4gdXRpbHMudG9IZXgzMih0aGlzLmgsICdiaWcnKTtcclxuICBlbHNlXHJcbiAgICByZXR1cm4gdXRpbHMuc3BsaXQzMih0aGlzLmgsICdiaWcnKTtcclxufTtcclxuIiwidmFyIGhhc2ggPSBleHBvcnRzO1xyXG5cclxuaGFzaC51dGlscyA9IHJlcXVpcmUoJy4vaGFzaC91dGlscycpO1xyXG5oYXNoLmNvbW1vbiA9IHJlcXVpcmUoJy4vaGFzaC9jb21tb24nKTtcclxuaGFzaC5zaGEgPSByZXF1aXJlKCcuL2hhc2gvc2hhJyk7XHJcbmhhc2gucmlwZW1kID0gcmVxdWlyZSgnLi9oYXNoL3JpcGVtZCcpO1xyXG5oYXNoLmhtYWMgPSByZXF1aXJlKCcuL2hhc2gvaG1hYycpO1xyXG5cclxuLy8gUHJveHkgaGFzaCBmdW5jdGlvbnMgdG8gdGhlIG1haW4gb2JqZWN0XHJcbmhhc2guc2hhMSA9IGhhc2guc2hhLnNoYTE7XHJcbmhhc2guc2hhMjU2ID0gaGFzaC5zaGEuc2hhMjU2O1xyXG5oYXNoLnNoYTIyNCA9IGhhc2guc2hhLnNoYTIyNDtcclxuaGFzaC5zaGEzODQgPSBoYXNoLnNoYS5zaGEzODQ7XHJcbmhhc2guc2hhNTEyID0gaGFzaC5zaGEuc2hhNTEyO1xyXG5oYXNoLnJpcGVtZDE2MCA9IGhhc2gucmlwZW1kLnJpcGVtZDE2MDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcclxuXHJcbnZhciBTSEE1MTIgPSByZXF1aXJlKCcuLzUxMicpO1xyXG5cclxuZnVuY3Rpb24gU0hBMzg0KCkge1xyXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTSEEzODQpKVxyXG4gICAgcmV0dXJuIG5ldyBTSEEzODQoKTtcclxuXHJcbiAgU0hBNTEyLmNhbGwodGhpcyk7XHJcbiAgdGhpcy5oID0gW1xyXG4gICAgMHhjYmJiOWQ1ZCwgMHhjMTA1OWVkOCxcclxuICAgIDB4NjI5YTI5MmEsIDB4MzY3Y2Q1MDcsXHJcbiAgICAweDkxNTkwMTVhLCAweDMwNzBkZDE3LFxyXG4gICAgMHgxNTJmZWNkOCwgMHhmNzBlNTkzOSxcclxuICAgIDB4NjczMzI2NjcsIDB4ZmZjMDBiMzEsXHJcbiAgICAweDhlYjQ0YTg3LCAweDY4NTgxNTExLFxyXG4gICAgMHhkYjBjMmUwZCwgMHg2NGY5OGZhNyxcclxuICAgIDB4NDdiNTQ4MWQsIDB4YmVmYTRmYTQgXTtcclxufVxyXG51dGlscy5pbmhlcml0cyhTSEEzODQsIFNIQTUxMik7XHJcbm1vZHVsZS5leHBvcnRzID0gU0hBMzg0O1xyXG5cclxuU0hBMzg0LmJsb2NrU2l6ZSA9IDEwMjQ7XHJcblNIQTM4NC5vdXRTaXplID0gMzg0O1xyXG5TSEEzODQuaG1hY1N0cmVuZ3RoID0gMTkyO1xyXG5TSEEzODQucGFkTGVuZ3RoID0gMTI4O1xyXG5cclxuU0hBMzg0LnByb3RvdHlwZS5fZGlnZXN0ID0gZnVuY3Rpb24gZGlnZXN0KGVuYykge1xyXG4gIGlmIChlbmMgPT09ICdoZXgnKVxyXG4gICAgcmV0dXJuIHV0aWxzLnRvSGV4MzIodGhpcy5oLnNsaWNlKDAsIDEyKSwgJ2JpZycpO1xyXG4gIGVsc2VcclxuICAgIHJldHVybiB1dGlscy5zcGxpdDMyKHRoaXMuaC5zbGljZSgwLCAxMiksICdiaWcnKTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcclxudmFyIHJvdHIzMiA9IHV0aWxzLnJvdHIzMjtcclxuXHJcbmZ1bmN0aW9uIGZ0XzEocywgeCwgeSwgeikge1xyXG4gIGlmIChzID09PSAwKVxyXG4gICAgcmV0dXJuIGNoMzIoeCwgeSwgeik7XHJcbiAgaWYgKHMgPT09IDEgfHwgcyA9PT0gMylcclxuICAgIHJldHVybiBwMzIoeCwgeSwgeik7XHJcbiAgaWYgKHMgPT09IDIpXHJcbiAgICByZXR1cm4gbWFqMzIoeCwgeSwgeik7XHJcbn1cclxuZXhwb3J0cy5mdF8xID0gZnRfMTtcclxuXHJcbmZ1bmN0aW9uIGNoMzIoeCwgeSwgeikge1xyXG4gIHJldHVybiAoeCAmIHkpIF4gKCh+eCkgJiB6KTtcclxufVxyXG5leHBvcnRzLmNoMzIgPSBjaDMyO1xyXG5cclxuZnVuY3Rpb24gbWFqMzIoeCwgeSwgeikge1xyXG4gIHJldHVybiAoeCAmIHkpIF4gKHggJiB6KSBeICh5ICYgeik7XHJcbn1cclxuZXhwb3J0cy5tYWozMiA9IG1hajMyO1xyXG5cclxuZnVuY3Rpb24gcDMyKHgsIHksIHopIHtcclxuICByZXR1cm4geCBeIHkgXiB6O1xyXG59XHJcbmV4cG9ydHMucDMyID0gcDMyO1xyXG5cclxuZnVuY3Rpb24gczBfMjU2KHgpIHtcclxuICByZXR1cm4gcm90cjMyKHgsIDIpIF4gcm90cjMyKHgsIDEzKSBeIHJvdHIzMih4LCAyMik7XHJcbn1cclxuZXhwb3J0cy5zMF8yNTYgPSBzMF8yNTY7XHJcblxyXG5mdW5jdGlvbiBzMV8yNTYoeCkge1xyXG4gIHJldHVybiByb3RyMzIoeCwgNikgXiByb3RyMzIoeCwgMTEpIF4gcm90cjMyKHgsIDI1KTtcclxufVxyXG5leHBvcnRzLnMxXzI1NiA9IHMxXzI1NjtcclxuXHJcbmZ1bmN0aW9uIGcwXzI1Nih4KSB7XHJcbiAgcmV0dXJuIHJvdHIzMih4LCA3KSBeIHJvdHIzMih4LCAxOCkgXiAoeCA+Pj4gMyk7XHJcbn1cclxuZXhwb3J0cy5nMF8yNTYgPSBnMF8yNTY7XHJcblxyXG5mdW5jdGlvbiBnMV8yNTYoeCkge1xyXG4gIHJldHVybiByb3RyMzIoeCwgMTcpIF4gcm90cjMyKHgsIDE5KSBeICh4ID4+PiAxMCk7XHJcbn1cclxuZXhwb3J0cy5nMV8yNTYgPSBnMV8yNTY7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XHJcbnZhciBjb21tb24gPSByZXF1aXJlKCcuLi9jb21tb24nKTtcclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ21pbmltYWxpc3RpYy1hc3NlcnQnKTtcclxuXHJcbnZhciByb3RyNjRfaGkgPSB1dGlscy5yb3RyNjRfaGk7XHJcbnZhciByb3RyNjRfbG8gPSB1dGlscy5yb3RyNjRfbG87XHJcbnZhciBzaHI2NF9oaSA9IHV0aWxzLnNocjY0X2hpO1xyXG52YXIgc2hyNjRfbG8gPSB1dGlscy5zaHI2NF9sbztcclxudmFyIHN1bTY0ID0gdXRpbHMuc3VtNjQ7XHJcbnZhciBzdW02NF9oaSA9IHV0aWxzLnN1bTY0X2hpO1xyXG52YXIgc3VtNjRfbG8gPSB1dGlscy5zdW02NF9sbztcclxudmFyIHN1bTY0XzRfaGkgPSB1dGlscy5zdW02NF80X2hpO1xyXG52YXIgc3VtNjRfNF9sbyA9IHV0aWxzLnN1bTY0XzRfbG87XHJcbnZhciBzdW02NF81X2hpID0gdXRpbHMuc3VtNjRfNV9oaTtcclxudmFyIHN1bTY0XzVfbG8gPSB1dGlscy5zdW02NF81X2xvO1xyXG5cclxudmFyIEJsb2NrSGFzaCA9IGNvbW1vbi5CbG9ja0hhc2g7XHJcblxyXG52YXIgc2hhNTEyX0sgPSBbXHJcbiAgMHg0MjhhMmY5OCwgMHhkNzI4YWUyMiwgMHg3MTM3NDQ5MSwgMHgyM2VmNjVjZCxcclxuICAweGI1YzBmYmNmLCAweGVjNGQzYjJmLCAweGU5YjVkYmE1LCAweDgxODlkYmJjLFxyXG4gIDB4Mzk1NmMyNWIsIDB4ZjM0OGI1MzgsIDB4NTlmMTExZjEsIDB4YjYwNWQwMTksXHJcbiAgMHg5MjNmODJhNCwgMHhhZjE5NGY5YiwgMHhhYjFjNWVkNSwgMHhkYTZkODExOCxcclxuICAweGQ4MDdhYTk4LCAweGEzMDMwMjQyLCAweDEyODM1YjAxLCAweDQ1NzA2ZmJlLFxyXG4gIDB4MjQzMTg1YmUsIDB4NGVlNGIyOGMsIDB4NTUwYzdkYzMsIDB4ZDVmZmI0ZTIsXHJcbiAgMHg3MmJlNWQ3NCwgMHhmMjdiODk2ZiwgMHg4MGRlYjFmZSwgMHgzYjE2OTZiMSxcclxuICAweDliZGMwNmE3LCAweDI1YzcxMjM1LCAweGMxOWJmMTc0LCAweGNmNjkyNjk0LFxyXG4gIDB4ZTQ5YjY5YzEsIDB4OWVmMTRhZDIsIDB4ZWZiZTQ3ODYsIDB4Mzg0ZjI1ZTMsXHJcbiAgMHgwZmMxOWRjNiwgMHg4YjhjZDViNSwgMHgyNDBjYTFjYywgMHg3N2FjOWM2NSxcclxuICAweDJkZTkyYzZmLCAweDU5MmIwMjc1LCAweDRhNzQ4NGFhLCAweDZlYTZlNDgzLFxyXG4gIDB4NWNiMGE5ZGMsIDB4YmQ0MWZiZDQsIDB4NzZmOTg4ZGEsIDB4ODMxMTUzYjUsXHJcbiAgMHg5ODNlNTE1MiwgMHhlZTY2ZGZhYiwgMHhhODMxYzY2ZCwgMHgyZGI0MzIxMCxcclxuICAweGIwMDMyN2M4LCAweDk4ZmIyMTNmLCAweGJmNTk3ZmM3LCAweGJlZWYwZWU0LFxyXG4gIDB4YzZlMDBiZjMsIDB4M2RhODhmYzIsIDB4ZDVhNzkxNDcsIDB4OTMwYWE3MjUsXHJcbiAgMHgwNmNhNjM1MSwgMHhlMDAzODI2ZiwgMHgxNDI5Mjk2NywgMHgwYTBlNmU3MCxcclxuICAweDI3YjcwYTg1LCAweDQ2ZDIyZmZjLCAweDJlMWIyMTM4LCAweDVjMjZjOTI2LFxyXG4gIDB4NGQyYzZkZmMsIDB4NWFjNDJhZWQsIDB4NTMzODBkMTMsIDB4OWQ5NWIzZGYsXHJcbiAgMHg2NTBhNzM1NCwgMHg4YmFmNjNkZSwgMHg3NjZhMGFiYiwgMHgzYzc3YjJhOCxcclxuICAweDgxYzJjOTJlLCAweDQ3ZWRhZWU2LCAweDkyNzIyYzg1LCAweDE0ODIzNTNiLFxyXG4gIDB4YTJiZmU4YTEsIDB4NGNmMTAzNjQsIDB4YTgxYTY2NGIsIDB4YmM0MjMwMDEsXHJcbiAgMHhjMjRiOGI3MCwgMHhkMGY4OTc5MSwgMHhjNzZjNTFhMywgMHgwNjU0YmUzMCxcclxuICAweGQxOTJlODE5LCAweGQ2ZWY1MjE4LCAweGQ2OTkwNjI0LCAweDU1NjVhOTEwLFxyXG4gIDB4ZjQwZTM1ODUsIDB4NTc3MTIwMmEsIDB4MTA2YWEwNzAsIDB4MzJiYmQxYjgsXHJcbiAgMHgxOWE0YzExNiwgMHhiOGQyZDBjOCwgMHgxZTM3NmMwOCwgMHg1MTQxYWI1MyxcclxuICAweDI3NDg3NzRjLCAweGRmOGVlYjk5LCAweDM0YjBiY2I1LCAweGUxOWI0OGE4LFxyXG4gIDB4MzkxYzBjYjMsIDB4YzVjOTVhNjMsIDB4NGVkOGFhNGEsIDB4ZTM0MThhY2IsXHJcbiAgMHg1YjljY2E0ZiwgMHg3NzYzZTM3MywgMHg2ODJlNmZmMywgMHhkNmIyYjhhMyxcclxuICAweDc0OGY4MmVlLCAweDVkZWZiMmZjLCAweDc4YTU2MzZmLCAweDQzMTcyZjYwLFxyXG4gIDB4ODRjODc4MTQsIDB4YTFmMGFiNzIsIDB4OGNjNzAyMDgsIDB4MWE2NDM5ZWMsXHJcbiAgMHg5MGJlZmZmYSwgMHgyMzYzMWUyOCwgMHhhNDUwNmNlYiwgMHhkZTgyYmRlOSxcclxuICAweGJlZjlhM2Y3LCAweGIyYzY3OTE1LCAweGM2NzE3OGYyLCAweGUzNzI1MzJiLFxyXG4gIDB4Y2EyNzNlY2UsIDB4ZWEyNjYxOWMsIDB4ZDE4NmI4YzcsIDB4MjFjMGMyMDcsXHJcbiAgMHhlYWRhN2RkNiwgMHhjZGUwZWIxZSwgMHhmNTdkNGY3ZiwgMHhlZTZlZDE3OCxcclxuICAweDA2ZjA2N2FhLCAweDcyMTc2ZmJhLCAweDBhNjM3ZGM1LCAweGEyYzg5OGE2LFxyXG4gIDB4MTEzZjk4MDQsIDB4YmVmOTBkYWUsIDB4MWI3MTBiMzUsIDB4MTMxYzQ3MWIsXHJcbiAgMHgyOGRiNzdmNSwgMHgyMzA0N2Q4NCwgMHgzMmNhYWI3YiwgMHg0MGM3MjQ5MyxcclxuICAweDNjOWViZTBhLCAweDE1YzliZWJjLCAweDQzMWQ2N2M0LCAweDljMTAwZDRjLFxyXG4gIDB4NGNjNWQ0YmUsIDB4Y2IzZTQyYjYsIDB4NTk3ZjI5OWMsIDB4ZmM2NTdlMmEsXHJcbiAgMHg1ZmNiNmZhYiwgMHgzYWQ2ZmFlYywgMHg2YzQ0MTk4YywgMHg0YTQ3NTgxN1xyXG5dO1xyXG5cclxuZnVuY3Rpb24gU0hBNTEyKCkge1xyXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTSEE1MTIpKVxyXG4gICAgcmV0dXJuIG5ldyBTSEE1MTIoKTtcclxuXHJcbiAgQmxvY2tIYXNoLmNhbGwodGhpcyk7XHJcbiAgdGhpcy5oID0gW1xyXG4gICAgMHg2YTA5ZTY2NywgMHhmM2JjYzkwOCxcclxuICAgIDB4YmI2N2FlODUsIDB4ODRjYWE3M2IsXHJcbiAgICAweDNjNmVmMzcyLCAweGZlOTRmODJiLFxyXG4gICAgMHhhNTRmZjUzYSwgMHg1ZjFkMzZmMSxcclxuICAgIDB4NTEwZTUyN2YsIDB4YWRlNjgyZDEsXHJcbiAgICAweDliMDU2ODhjLCAweDJiM2U2YzFmLFxyXG4gICAgMHgxZjgzZDlhYiwgMHhmYjQxYmQ2YixcclxuICAgIDB4NWJlMGNkMTksIDB4MTM3ZTIxNzkgXTtcclxuICB0aGlzLmsgPSBzaGE1MTJfSztcclxuICB0aGlzLlcgPSBuZXcgQXJyYXkoMTYwKTtcclxufVxyXG51dGlscy5pbmhlcml0cyhTSEE1MTIsIEJsb2NrSGFzaCk7XHJcbm1vZHVsZS5leHBvcnRzID0gU0hBNTEyO1xyXG5cclxuU0hBNTEyLmJsb2NrU2l6ZSA9IDEwMjQ7XHJcblNIQTUxMi5vdXRTaXplID0gNTEyO1xyXG5TSEE1MTIuaG1hY1N0cmVuZ3RoID0gMTkyO1xyXG5TSEE1MTIucGFkTGVuZ3RoID0gMTI4O1xyXG5cclxuU0hBNTEyLnByb3RvdHlwZS5fcHJlcGFyZUJsb2NrID0gZnVuY3Rpb24gX3ByZXBhcmVCbG9jayhtc2csIHN0YXJ0KSB7XHJcbiAgdmFyIFcgPSB0aGlzLlc7XHJcblxyXG4gIC8vIDMyIHggMzJiaXQgd29yZHNcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IDMyOyBpKyspXHJcbiAgICBXW2ldID0gbXNnW3N0YXJ0ICsgaV07XHJcbiAgZm9yICg7IGkgPCBXLmxlbmd0aDsgaSArPSAyKSB7XHJcbiAgICB2YXIgYzBfaGkgPSBnMV81MTJfaGkoV1tpIC0gNF0sIFdbaSAtIDNdKTsgIC8vIGkgLSAyXHJcbiAgICB2YXIgYzBfbG8gPSBnMV81MTJfbG8oV1tpIC0gNF0sIFdbaSAtIDNdKTtcclxuICAgIHZhciBjMV9oaSA9IFdbaSAtIDE0XTsgIC8vIGkgLSA3XHJcbiAgICB2YXIgYzFfbG8gPSBXW2kgLSAxM107XHJcbiAgICB2YXIgYzJfaGkgPSBnMF81MTJfaGkoV1tpIC0gMzBdLCBXW2kgLSAyOV0pOyAgLy8gaSAtIDE1XHJcbiAgICB2YXIgYzJfbG8gPSBnMF81MTJfbG8oV1tpIC0gMzBdLCBXW2kgLSAyOV0pO1xyXG4gICAgdmFyIGMzX2hpID0gV1tpIC0gMzJdOyAgLy8gaSAtIDE2XHJcbiAgICB2YXIgYzNfbG8gPSBXW2kgLSAzMV07XHJcblxyXG4gICAgV1tpXSA9IHN1bTY0XzRfaGkoXHJcbiAgICAgIGMwX2hpLCBjMF9sbyxcclxuICAgICAgYzFfaGksIGMxX2xvLFxyXG4gICAgICBjMl9oaSwgYzJfbG8sXHJcbiAgICAgIGMzX2hpLCBjM19sbyk7XHJcbiAgICBXW2kgKyAxXSA9IHN1bTY0XzRfbG8oXHJcbiAgICAgIGMwX2hpLCBjMF9sbyxcclxuICAgICAgYzFfaGksIGMxX2xvLFxyXG4gICAgICBjMl9oaSwgYzJfbG8sXHJcbiAgICAgIGMzX2hpLCBjM19sbyk7XHJcbiAgfVxyXG59O1xyXG5cclxuU0hBNTEyLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24gX3VwZGF0ZShtc2csIHN0YXJ0KSB7XHJcbiAgdGhpcy5fcHJlcGFyZUJsb2NrKG1zZywgc3RhcnQpO1xyXG5cclxuICB2YXIgVyA9IHRoaXMuVztcclxuXHJcbiAgdmFyIGFoID0gdGhpcy5oWzBdO1xyXG4gIHZhciBhbCA9IHRoaXMuaFsxXTtcclxuICB2YXIgYmggPSB0aGlzLmhbMl07XHJcbiAgdmFyIGJsID0gdGhpcy5oWzNdO1xyXG4gIHZhciBjaCA9IHRoaXMuaFs0XTtcclxuICB2YXIgY2wgPSB0aGlzLmhbNV07XHJcbiAgdmFyIGRoID0gdGhpcy5oWzZdO1xyXG4gIHZhciBkbCA9IHRoaXMuaFs3XTtcclxuICB2YXIgZWggPSB0aGlzLmhbOF07XHJcbiAgdmFyIGVsID0gdGhpcy5oWzldO1xyXG4gIHZhciBmaCA9IHRoaXMuaFsxMF07XHJcbiAgdmFyIGZsID0gdGhpcy5oWzExXTtcclxuICB2YXIgZ2ggPSB0aGlzLmhbMTJdO1xyXG4gIHZhciBnbCA9IHRoaXMuaFsxM107XHJcbiAgdmFyIGhoID0gdGhpcy5oWzE0XTtcclxuICB2YXIgaGwgPSB0aGlzLmhbMTVdO1xyXG5cclxuICBhc3NlcnQodGhpcy5rLmxlbmd0aCA9PT0gVy5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgVy5sZW5ndGg7IGkgKz0gMikge1xyXG4gICAgdmFyIGMwX2hpID0gaGg7XHJcbiAgICB2YXIgYzBfbG8gPSBobDtcclxuICAgIHZhciBjMV9oaSA9IHMxXzUxMl9oaShlaCwgZWwpO1xyXG4gICAgdmFyIGMxX2xvID0gczFfNTEyX2xvKGVoLCBlbCk7XHJcbiAgICB2YXIgYzJfaGkgPSBjaDY0X2hpKGVoLCBlbCwgZmgsIGZsLCBnaCwgZ2wpO1xyXG4gICAgdmFyIGMyX2xvID0gY2g2NF9sbyhlaCwgZWwsIGZoLCBmbCwgZ2gsIGdsKTtcclxuICAgIHZhciBjM19oaSA9IHRoaXMua1tpXTtcclxuICAgIHZhciBjM19sbyA9IHRoaXMua1tpICsgMV07XHJcbiAgICB2YXIgYzRfaGkgPSBXW2ldO1xyXG4gICAgdmFyIGM0X2xvID0gV1tpICsgMV07XHJcblxyXG4gICAgdmFyIFQxX2hpID0gc3VtNjRfNV9oaShcclxuICAgICAgYzBfaGksIGMwX2xvLFxyXG4gICAgICBjMV9oaSwgYzFfbG8sXHJcbiAgICAgIGMyX2hpLCBjMl9sbyxcclxuICAgICAgYzNfaGksIGMzX2xvLFxyXG4gICAgICBjNF9oaSwgYzRfbG8pO1xyXG4gICAgdmFyIFQxX2xvID0gc3VtNjRfNV9sbyhcclxuICAgICAgYzBfaGksIGMwX2xvLFxyXG4gICAgICBjMV9oaSwgYzFfbG8sXHJcbiAgICAgIGMyX2hpLCBjMl9sbyxcclxuICAgICAgYzNfaGksIGMzX2xvLFxyXG4gICAgICBjNF9oaSwgYzRfbG8pO1xyXG5cclxuICAgIGMwX2hpID0gczBfNTEyX2hpKGFoLCBhbCk7XHJcbiAgICBjMF9sbyA9IHMwXzUxMl9sbyhhaCwgYWwpO1xyXG4gICAgYzFfaGkgPSBtYWo2NF9oaShhaCwgYWwsIGJoLCBibCwgY2gsIGNsKTtcclxuICAgIGMxX2xvID0gbWFqNjRfbG8oYWgsIGFsLCBiaCwgYmwsIGNoLCBjbCk7XHJcblxyXG4gICAgdmFyIFQyX2hpID0gc3VtNjRfaGkoYzBfaGksIGMwX2xvLCBjMV9oaSwgYzFfbG8pO1xyXG4gICAgdmFyIFQyX2xvID0gc3VtNjRfbG8oYzBfaGksIGMwX2xvLCBjMV9oaSwgYzFfbG8pO1xyXG5cclxuICAgIGhoID0gZ2g7XHJcbiAgICBobCA9IGdsO1xyXG5cclxuICAgIGdoID0gZmg7XHJcbiAgICBnbCA9IGZsO1xyXG5cclxuICAgIGZoID0gZWg7XHJcbiAgICBmbCA9IGVsO1xyXG5cclxuICAgIGVoID0gc3VtNjRfaGkoZGgsIGRsLCBUMV9oaSwgVDFfbG8pO1xyXG4gICAgZWwgPSBzdW02NF9sbyhkbCwgZGwsIFQxX2hpLCBUMV9sbyk7XHJcblxyXG4gICAgZGggPSBjaDtcclxuICAgIGRsID0gY2w7XHJcblxyXG4gICAgY2ggPSBiaDtcclxuICAgIGNsID0gYmw7XHJcblxyXG4gICAgYmggPSBhaDtcclxuICAgIGJsID0gYWw7XHJcblxyXG4gICAgYWggPSBzdW02NF9oaShUMV9oaSwgVDFfbG8sIFQyX2hpLCBUMl9sbyk7XHJcbiAgICBhbCA9IHN1bTY0X2xvKFQxX2hpLCBUMV9sbywgVDJfaGksIFQyX2xvKTtcclxuICB9XHJcblxyXG4gIHN1bTY0KHRoaXMuaCwgMCwgYWgsIGFsKTtcclxuICBzdW02NCh0aGlzLmgsIDIsIGJoLCBibCk7XHJcbiAgc3VtNjQodGhpcy5oLCA0LCBjaCwgY2wpO1xyXG4gIHN1bTY0KHRoaXMuaCwgNiwgZGgsIGRsKTtcclxuICBzdW02NCh0aGlzLmgsIDgsIGVoLCBlbCk7XHJcbiAgc3VtNjQodGhpcy5oLCAxMCwgZmgsIGZsKTtcclxuICBzdW02NCh0aGlzLmgsIDEyLCBnaCwgZ2wpO1xyXG4gIHN1bTY0KHRoaXMuaCwgMTQsIGhoLCBobCk7XHJcbn07XHJcblxyXG5TSEE1MTIucHJvdG90eXBlLl9kaWdlc3QgPSBmdW5jdGlvbiBkaWdlc3QoZW5jKSB7XHJcbiAgaWYgKGVuYyA9PT0gJ2hleCcpXHJcbiAgICByZXR1cm4gdXRpbHMudG9IZXgzMih0aGlzLmgsICdiaWcnKTtcclxuICBlbHNlXHJcbiAgICByZXR1cm4gdXRpbHMuc3BsaXQzMih0aGlzLmgsICdiaWcnKTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIGNoNjRfaGkoeGgsIHhsLCB5aCwgeWwsIHpoKSB7XHJcbiAgdmFyIHIgPSAoeGggJiB5aCkgXiAoKH54aCkgJiB6aCk7XHJcbiAgaWYgKHIgPCAwKVxyXG4gICAgciArPSAweDEwMDAwMDAwMDtcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuZnVuY3Rpb24gY2g2NF9sbyh4aCwgeGwsIHloLCB5bCwgemgsIHpsKSB7XHJcbiAgdmFyIHIgPSAoeGwgJiB5bCkgXiAoKH54bCkgJiB6bCk7XHJcbiAgaWYgKHIgPCAwKVxyXG4gICAgciArPSAweDEwMDAwMDAwMDtcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuZnVuY3Rpb24gbWFqNjRfaGkoeGgsIHhsLCB5aCwgeWwsIHpoKSB7XHJcbiAgdmFyIHIgPSAoeGggJiB5aCkgXiAoeGggJiB6aCkgXiAoeWggJiB6aCk7XHJcbiAgaWYgKHIgPCAwKVxyXG4gICAgciArPSAweDEwMDAwMDAwMDtcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuZnVuY3Rpb24gbWFqNjRfbG8oeGgsIHhsLCB5aCwgeWwsIHpoLCB6bCkge1xyXG4gIHZhciByID0gKHhsICYgeWwpIF4gKHhsICYgemwpIF4gKHlsICYgemwpO1xyXG4gIGlmIChyIDwgMClcclxuICAgIHIgKz0gMHgxMDAwMDAwMDA7XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHMwXzUxMl9oaSh4aCwgeGwpIHtcclxuICB2YXIgYzBfaGkgPSByb3RyNjRfaGkoeGgsIHhsLCAyOCk7XHJcbiAgdmFyIGMxX2hpID0gcm90cjY0X2hpKHhsLCB4aCwgMik7ICAvLyAzNFxyXG4gIHZhciBjMl9oaSA9IHJvdHI2NF9oaSh4bCwgeGgsIDcpOyAgLy8gMzlcclxuXHJcbiAgdmFyIHIgPSBjMF9oaSBeIGMxX2hpIF4gYzJfaGk7XHJcbiAgaWYgKHIgPCAwKVxyXG4gICAgciArPSAweDEwMDAwMDAwMDtcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuZnVuY3Rpb24gczBfNTEyX2xvKHhoLCB4bCkge1xyXG4gIHZhciBjMF9sbyA9IHJvdHI2NF9sbyh4aCwgeGwsIDI4KTtcclxuICB2YXIgYzFfbG8gPSByb3RyNjRfbG8oeGwsIHhoLCAyKTsgIC8vIDM0XHJcbiAgdmFyIGMyX2xvID0gcm90cjY0X2xvKHhsLCB4aCwgNyk7ICAvLyAzOVxyXG5cclxuICB2YXIgciA9IGMwX2xvIF4gYzFfbG8gXiBjMl9sbztcclxuICBpZiAociA8IDApXHJcbiAgICByICs9IDB4MTAwMDAwMDAwO1xyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzMV81MTJfaGkoeGgsIHhsKSB7XHJcbiAgdmFyIGMwX2hpID0gcm90cjY0X2hpKHhoLCB4bCwgMTQpO1xyXG4gIHZhciBjMV9oaSA9IHJvdHI2NF9oaSh4aCwgeGwsIDE4KTtcclxuICB2YXIgYzJfaGkgPSByb3RyNjRfaGkoeGwsIHhoLCA5KTsgIC8vIDQxXHJcblxyXG4gIHZhciByID0gYzBfaGkgXiBjMV9oaSBeIGMyX2hpO1xyXG4gIGlmIChyIDwgMClcclxuICAgIHIgKz0gMHgxMDAwMDAwMDA7XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHMxXzUxMl9sbyh4aCwgeGwpIHtcclxuICB2YXIgYzBfbG8gPSByb3RyNjRfbG8oeGgsIHhsLCAxNCk7XHJcbiAgdmFyIGMxX2xvID0gcm90cjY0X2xvKHhoLCB4bCwgMTgpO1xyXG4gIHZhciBjMl9sbyA9IHJvdHI2NF9sbyh4bCwgeGgsIDkpOyAgLy8gNDFcclxuXHJcbiAgdmFyIHIgPSBjMF9sbyBeIGMxX2xvIF4gYzJfbG87XHJcbiAgaWYgKHIgPCAwKVxyXG4gICAgciArPSAweDEwMDAwMDAwMDtcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuZnVuY3Rpb24gZzBfNTEyX2hpKHhoLCB4bCkge1xyXG4gIHZhciBjMF9oaSA9IHJvdHI2NF9oaSh4aCwgeGwsIDEpO1xyXG4gIHZhciBjMV9oaSA9IHJvdHI2NF9oaSh4aCwgeGwsIDgpO1xyXG4gIHZhciBjMl9oaSA9IHNocjY0X2hpKHhoLCB4bCwgNyk7XHJcblxyXG4gIHZhciByID0gYzBfaGkgXiBjMV9oaSBeIGMyX2hpO1xyXG4gIGlmIChyIDwgMClcclxuICAgIHIgKz0gMHgxMDAwMDAwMDA7XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGcwXzUxMl9sbyh4aCwgeGwpIHtcclxuICB2YXIgYzBfbG8gPSByb3RyNjRfbG8oeGgsIHhsLCAxKTtcclxuICB2YXIgYzFfbG8gPSByb3RyNjRfbG8oeGgsIHhsLCA4KTtcclxuICB2YXIgYzJfbG8gPSBzaHI2NF9sbyh4aCwgeGwsIDcpO1xyXG5cclxuICB2YXIgciA9IGMwX2xvIF4gYzFfbG8gXiBjMl9sbztcclxuICBpZiAociA8IDApXHJcbiAgICByICs9IDB4MTAwMDAwMDAwO1xyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnMV81MTJfaGkoeGgsIHhsKSB7XHJcbiAgdmFyIGMwX2hpID0gcm90cjY0X2hpKHhoLCB4bCwgMTkpO1xyXG4gIHZhciBjMV9oaSA9IHJvdHI2NF9oaSh4bCwgeGgsIDI5KTsgIC8vIDYxXHJcbiAgdmFyIGMyX2hpID0gc2hyNjRfaGkoeGgsIHhsLCA2KTtcclxuXHJcbiAgdmFyIHIgPSBjMF9oaSBeIGMxX2hpIF4gYzJfaGk7XHJcbiAgaWYgKHIgPCAwKVxyXG4gICAgciArPSAweDEwMDAwMDAwMDtcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuZnVuY3Rpb24gZzFfNTEyX2xvKHhoLCB4bCkge1xyXG4gIHZhciBjMF9sbyA9IHJvdHI2NF9sbyh4aCwgeGwsIDE5KTtcclxuICB2YXIgYzFfbG8gPSByb3RyNjRfbG8oeGwsIHhoLCAyOSk7ICAvLyA2MVxyXG4gIHZhciBjMl9sbyA9IHNocjY0X2xvKHhoLCB4bCwgNik7XHJcblxyXG4gIHZhciByID0gYzBfbG8gXiBjMV9sbyBeIGMyX2xvO1xyXG4gIGlmIChyIDwgMClcclxuICAgIHIgKz0gMHgxMDAwMDAwMDA7XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcclxuXHJcbnZhciByb3RsMzIgPSB1dGlscy5yb3RsMzI7XHJcbnZhciBzdW0zMiA9IHV0aWxzLnN1bTMyO1xyXG52YXIgc3VtMzJfMyA9IHV0aWxzLnN1bTMyXzM7XHJcbnZhciBzdW0zMl80ID0gdXRpbHMuc3VtMzJfNDtcclxudmFyIEJsb2NrSGFzaCA9IGNvbW1vbi5CbG9ja0hhc2g7XHJcblxyXG5mdW5jdGlvbiBSSVBFTUQxNjAoKSB7XHJcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJJUEVNRDE2MCkpXHJcbiAgICByZXR1cm4gbmV3IFJJUEVNRDE2MCgpO1xyXG5cclxuICBCbG9ja0hhc2guY2FsbCh0aGlzKTtcclxuXHJcbiAgdGhpcy5oID0gWyAweDY3NDUyMzAxLCAweGVmY2RhYjg5LCAweDk4YmFkY2ZlLCAweDEwMzI1NDc2LCAweGMzZDJlMWYwIF07XHJcbiAgdGhpcy5lbmRpYW4gPSAnbGl0dGxlJztcclxufVxyXG51dGlscy5pbmhlcml0cyhSSVBFTUQxNjAsIEJsb2NrSGFzaCk7XHJcbmV4cG9ydHMucmlwZW1kMTYwID0gUklQRU1EMTYwO1xyXG5cclxuUklQRU1EMTYwLmJsb2NrU2l6ZSA9IDUxMjtcclxuUklQRU1EMTYwLm91dFNpemUgPSAxNjA7XHJcblJJUEVNRDE2MC5obWFjU3RyZW5ndGggPSAxOTI7XHJcblJJUEVNRDE2MC5wYWRMZW5ndGggPSA2NDtcclxuXHJcblJJUEVNRDE2MC5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZShtc2csIHN0YXJ0KSB7XHJcbiAgdmFyIEEgPSB0aGlzLmhbMF07XHJcbiAgdmFyIEIgPSB0aGlzLmhbMV07XHJcbiAgdmFyIEMgPSB0aGlzLmhbMl07XHJcbiAgdmFyIEQgPSB0aGlzLmhbM107XHJcbiAgdmFyIEUgPSB0aGlzLmhbNF07XHJcbiAgdmFyIEFoID0gQTtcclxuICB2YXIgQmggPSBCO1xyXG4gIHZhciBDaCA9IEM7XHJcbiAgdmFyIERoID0gRDtcclxuICB2YXIgRWggPSBFO1xyXG4gIGZvciAodmFyIGogPSAwOyBqIDwgODA7IGorKykge1xyXG4gICAgdmFyIFQgPSBzdW0zMihcclxuICAgICAgcm90bDMyKFxyXG4gICAgICAgIHN1bTMyXzQoQSwgZihqLCBCLCBDLCBEKSwgbXNnW3Jbal0gKyBzdGFydF0sIEsoaikpLFxyXG4gICAgICAgIHNbal0pLFxyXG4gICAgICBFKTtcclxuICAgIEEgPSBFO1xyXG4gICAgRSA9IEQ7XHJcbiAgICBEID0gcm90bDMyKEMsIDEwKTtcclxuICAgIEMgPSBCO1xyXG4gICAgQiA9IFQ7XHJcbiAgICBUID0gc3VtMzIoXHJcbiAgICAgIHJvdGwzMihcclxuICAgICAgICBzdW0zMl80KEFoLCBmKDc5IC0gaiwgQmgsIENoLCBEaCksIG1zZ1tyaFtqXSArIHN0YXJ0XSwgS2goaikpLFxyXG4gICAgICAgIHNoW2pdKSxcclxuICAgICAgRWgpO1xyXG4gICAgQWggPSBFaDtcclxuICAgIEVoID0gRGg7XHJcbiAgICBEaCA9IHJvdGwzMihDaCwgMTApO1xyXG4gICAgQ2ggPSBCaDtcclxuICAgIEJoID0gVDtcclxuICB9XHJcbiAgVCA9IHN1bTMyXzModGhpcy5oWzFdLCBDLCBEaCk7XHJcbiAgdGhpcy5oWzFdID0gc3VtMzJfMyh0aGlzLmhbMl0sIEQsIEVoKTtcclxuICB0aGlzLmhbMl0gPSBzdW0zMl8zKHRoaXMuaFszXSwgRSwgQWgpO1xyXG4gIHRoaXMuaFszXSA9IHN1bTMyXzModGhpcy5oWzRdLCBBLCBCaCk7XHJcbiAgdGhpcy5oWzRdID0gc3VtMzJfMyh0aGlzLmhbMF0sIEIsIENoKTtcclxuICB0aGlzLmhbMF0gPSBUO1xyXG59O1xyXG5cclxuUklQRU1EMTYwLnByb3RvdHlwZS5fZGlnZXN0ID0gZnVuY3Rpb24gZGlnZXN0KGVuYykge1xyXG4gIGlmIChlbmMgPT09ICdoZXgnKVxyXG4gICAgcmV0dXJuIHV0aWxzLnRvSGV4MzIodGhpcy5oLCAnbGl0dGxlJyk7XHJcbiAgZWxzZVxyXG4gICAgcmV0dXJuIHV0aWxzLnNwbGl0MzIodGhpcy5oLCAnbGl0dGxlJyk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBmKGosIHgsIHksIHopIHtcclxuICBpZiAoaiA8PSAxNSlcclxuICAgIHJldHVybiB4IF4geSBeIHo7XHJcbiAgZWxzZSBpZiAoaiA8PSAzMSlcclxuICAgIHJldHVybiAoeCAmIHkpIHwgKCh+eCkgJiB6KTtcclxuICBlbHNlIGlmIChqIDw9IDQ3KVxyXG4gICAgcmV0dXJuICh4IHwgKH55KSkgXiB6O1xyXG4gIGVsc2UgaWYgKGogPD0gNjMpXHJcbiAgICByZXR1cm4gKHggJiB6KSB8ICh5ICYgKH56KSk7XHJcbiAgZWxzZVxyXG4gICAgcmV0dXJuIHggXiAoeSB8ICh+eikpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBLKGopIHtcclxuICBpZiAoaiA8PSAxNSlcclxuICAgIHJldHVybiAweDAwMDAwMDAwO1xyXG4gIGVsc2UgaWYgKGogPD0gMzEpXHJcbiAgICByZXR1cm4gMHg1YTgyNzk5OTtcclxuICBlbHNlIGlmIChqIDw9IDQ3KVxyXG4gICAgcmV0dXJuIDB4NmVkOWViYTE7XHJcbiAgZWxzZSBpZiAoaiA8PSA2MylcclxuICAgIHJldHVybiAweDhmMWJiY2RjO1xyXG4gIGVsc2VcclxuICAgIHJldHVybiAweGE5NTNmZDRlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBLaChqKSB7XHJcbiAgaWYgKGogPD0gMTUpXHJcbiAgICByZXR1cm4gMHg1MGEyOGJlNjtcclxuICBlbHNlIGlmIChqIDw9IDMxKVxyXG4gICAgcmV0dXJuIDB4NWM0ZGQxMjQ7XHJcbiAgZWxzZSBpZiAoaiA8PSA0NylcclxuICAgIHJldHVybiAweDZkNzAzZWYzO1xyXG4gIGVsc2UgaWYgKGogPD0gNjMpXHJcbiAgICByZXR1cm4gMHg3YTZkNzZlOTtcclxuICBlbHNlXHJcbiAgICByZXR1cm4gMHgwMDAwMDAwMDtcclxufVxyXG5cclxudmFyIHIgPSBbXHJcbiAgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSxcclxuICA3LCA0LCAxMywgMSwgMTAsIDYsIDE1LCAzLCAxMiwgMCwgOSwgNSwgMiwgMTQsIDExLCA4LFxyXG4gIDMsIDEwLCAxNCwgNCwgOSwgMTUsIDgsIDEsIDIsIDcsIDAsIDYsIDEzLCAxMSwgNSwgMTIsXHJcbiAgMSwgOSwgMTEsIDEwLCAwLCA4LCAxMiwgNCwgMTMsIDMsIDcsIDE1LCAxNCwgNSwgNiwgMixcclxuICA0LCAwLCA1LCA5LCA3LCAxMiwgMiwgMTAsIDE0LCAxLCAzLCA4LCAxMSwgNiwgMTUsIDEzXHJcbl07XHJcblxyXG52YXIgcmggPSBbXHJcbiAgNSwgMTQsIDcsIDAsIDksIDIsIDExLCA0LCAxMywgNiwgMTUsIDgsIDEsIDEwLCAzLCAxMixcclxuICA2LCAxMSwgMywgNywgMCwgMTMsIDUsIDEwLCAxNCwgMTUsIDgsIDEyLCA0LCA5LCAxLCAyLFxyXG4gIDE1LCA1LCAxLCAzLCA3LCAxNCwgNiwgOSwgMTEsIDgsIDEyLCAyLCAxMCwgMCwgNCwgMTMsXHJcbiAgOCwgNiwgNCwgMSwgMywgMTEsIDE1LCAwLCA1LCAxMiwgMiwgMTMsIDksIDcsIDEwLCAxNCxcclxuICAxMiwgMTUsIDEwLCA0LCAxLCA1LCA4LCA3LCA2LCAyLCAxMywgMTQsIDAsIDMsIDksIDExXHJcbl07XHJcblxyXG52YXIgcyA9IFtcclxuICAxMSwgMTQsIDE1LCAxMiwgNSwgOCwgNywgOSwgMTEsIDEzLCAxNCwgMTUsIDYsIDcsIDksIDgsXHJcbiAgNywgNiwgOCwgMTMsIDExLCA5LCA3LCAxNSwgNywgMTIsIDE1LCA5LCAxMSwgNywgMTMsIDEyLFxyXG4gIDExLCAxMywgNiwgNywgMTQsIDksIDEzLCAxNSwgMTQsIDgsIDEzLCA2LCA1LCAxMiwgNywgNSxcclxuICAxMSwgMTIsIDE0LCAxNSwgMTQsIDE1LCA5LCA4LCA5LCAxNCwgNSwgNiwgOCwgNiwgNSwgMTIsXHJcbiAgOSwgMTUsIDUsIDExLCA2LCA4LCAxMywgMTIsIDUsIDEyLCAxMywgMTQsIDExLCA4LCA1LCA2XHJcbl07XHJcblxyXG52YXIgc2ggPSBbXHJcbiAgOCwgOSwgOSwgMTEsIDEzLCAxNSwgMTUsIDUsIDcsIDcsIDgsIDExLCAxNCwgMTQsIDEyLCA2LFxyXG4gIDksIDEzLCAxNSwgNywgMTIsIDgsIDksIDExLCA3LCA3LCAxMiwgNywgNiwgMTUsIDEzLCAxMSxcclxuICA5LCA3LCAxNSwgMTEsIDgsIDYsIDYsIDE0LCAxMiwgMTMsIDUsIDE0LCAxMywgMTMsIDcsIDUsXHJcbiAgMTUsIDUsIDgsIDExLCAxNCwgMTQsIDYsIDE0LCA2LCA5LCAxMiwgOSwgMTIsIDUsIDE1LCA4LFxyXG4gIDgsIDUsIDEyLCA5LCAxMiwgNSwgMTQsIDYsIDgsIDEzLCA2LCA1LCAxNSwgMTMsIDExLCAxMVxyXG5dO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnbWluaW1hbGlzdGljLWFzc2VydCcpO1xyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG5cclxuZXhwb3J0cy5pbmhlcml0cyA9IGluaGVyaXRzO1xyXG5cclxuZnVuY3Rpb24gaXNTdXJyb2dhdGVQYWlyKG1zZywgaSkge1xyXG4gIGlmICgobXNnLmNoYXJDb2RlQXQoaSkgJiAweEZDMDApICE9PSAweEQ4MDApIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgaWYgKGkgPCAwIHx8IGkgKyAxID49IG1zZy5sZW5ndGgpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIChtc2cuY2hhckNvZGVBdChpICsgMSkgJiAweEZDMDApID09PSAweERDMDA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvQXJyYXkobXNnLCBlbmMpIHtcclxuICBpZiAoQXJyYXkuaXNBcnJheShtc2cpKVxyXG4gICAgcmV0dXJuIG1zZy5zbGljZSgpO1xyXG4gIGlmICghbXNnKVxyXG4gICAgcmV0dXJuIFtdO1xyXG4gIHZhciByZXMgPSBbXTtcclxuICBpZiAodHlwZW9mIG1zZyA9PT0gJ3N0cmluZycpIHtcclxuICAgIGlmICghZW5jKSB7XHJcbiAgICAgIC8vIEluc3BpcmVkIGJ5IHN0cmluZ1RvVXRmOEJ5dGVBcnJheSgpIGluIGNsb3N1cmUtbGlicmFyeSBieSBHb29nbGVcclxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9jbG9zdXJlLWxpYnJhcnkvYmxvYi84NTk4ZDg3MjQyYWY1OWFhYzIzMzI3MDc0MmM4OTg0ZTJiMmJkYmUwL2Nsb3N1cmUvZ29vZy9jcnlwdC9jcnlwdC5qcyNMMTE3LUwxNDNcclxuICAgICAgLy8gQXBhY2hlIExpY2Vuc2UgMi4wXHJcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvY2xvc3VyZS1saWJyYXJ5L2Jsb2IvbWFzdGVyL0xJQ0VOU0VcclxuICAgICAgdmFyIHAgPSAwO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBjID0gbXNnLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgaWYgKGMgPCAxMjgpIHtcclxuICAgICAgICAgIHJlc1twKytdID0gYztcclxuICAgICAgICB9IGVsc2UgaWYgKGMgPCAyMDQ4KSB7XHJcbiAgICAgICAgICByZXNbcCsrXSA9IChjID4+IDYpIHwgMTkyO1xyXG4gICAgICAgICAgcmVzW3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9IGVsc2UgaWYgKGlzU3Vycm9nYXRlUGFpcihtc2csIGkpKSB7XHJcbiAgICAgICAgICBjID0gMHgxMDAwMCArICgoYyAmIDB4MDNGRikgPDwgMTApICsgKG1zZy5jaGFyQ29kZUF0KCsraSkgJiAweDAzRkYpO1xyXG4gICAgICAgICAgcmVzW3ArK10gPSAoYyA+PiAxOCkgfCAyNDA7XHJcbiAgICAgICAgICByZXNbcCsrXSA9ICgoYyA+PiAxMikgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgICByZXNbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgIHJlc1twKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlc1twKytdID0gKGMgPj4gMTIpIHwgMjI0O1xyXG4gICAgICAgICAgcmVzW3ArK10gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgICByZXNbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChlbmMgPT09ICdoZXgnKSB7XHJcbiAgICAgIG1zZyA9IG1zZy5yZXBsYWNlKC9bXmEtejAtOV0rL2lnLCAnJyk7XHJcbiAgICAgIGlmIChtc2cubGVuZ3RoICUgMiAhPT0gMClcclxuICAgICAgICBtc2cgPSAnMCcgKyBtc2c7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBtc2cubGVuZ3RoOyBpICs9IDIpXHJcbiAgICAgICAgcmVzLnB1c2gocGFyc2VJbnQobXNnW2ldICsgbXNnW2kgKyAxXSwgMTYpKTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgZm9yIChpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkrKylcclxuICAgICAgcmVzW2ldID0gbXNnW2ldIHwgMDtcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5leHBvcnRzLnRvQXJyYXkgPSB0b0FycmF5O1xyXG5cclxuZnVuY3Rpb24gdG9IZXgobXNnKSB7XHJcbiAgdmFyIHJlcyA9ICcnO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLmxlbmd0aDsgaSsrKVxyXG4gICAgcmVzICs9IHplcm8yKG1zZ1tpXS50b1N0cmluZygxNikpO1xyXG4gIHJldHVybiByZXM7XHJcbn1cclxuZXhwb3J0cy50b0hleCA9IHRvSGV4O1xyXG5cclxuZnVuY3Rpb24gaHRvbmwodykge1xyXG4gIHZhciByZXMgPSAodyA+Pj4gMjQpIHxcclxuICAgICAgICAgICAgKCh3ID4+PiA4KSAmIDB4ZmYwMCkgfFxyXG4gICAgICAgICAgICAoKHcgPDwgOCkgJiAweGZmMDAwMCkgfFxyXG4gICAgICAgICAgICAoKHcgJiAweGZmKSA8PCAyNCk7XHJcbiAgcmV0dXJuIHJlcyA+Pj4gMDtcclxufVxyXG5leHBvcnRzLmh0b25sID0gaHRvbmw7XHJcblxyXG5mdW5jdGlvbiB0b0hleDMyKG1zZywgZW5kaWFuKSB7XHJcbiAgdmFyIHJlcyA9ICcnO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgdyA9IG1zZ1tpXTtcclxuICAgIGlmIChlbmRpYW4gPT09ICdsaXR0bGUnKVxyXG4gICAgICB3ID0gaHRvbmwodyk7XHJcbiAgICByZXMgKz0gemVybzgody50b1N0cmluZygxNikpO1xyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcbmV4cG9ydHMudG9IZXgzMiA9IHRvSGV4MzI7XHJcblxyXG5mdW5jdGlvbiB6ZXJvMih3b3JkKSB7XHJcbiAgaWYgKHdvcmQubGVuZ3RoID09PSAxKVxyXG4gICAgcmV0dXJuICcwJyArIHdvcmQ7XHJcbiAgZWxzZVxyXG4gICAgcmV0dXJuIHdvcmQ7XHJcbn1cclxuZXhwb3J0cy56ZXJvMiA9IHplcm8yO1xyXG5cclxuZnVuY3Rpb24gemVybzgod29yZCkge1xyXG4gIGlmICh3b3JkLmxlbmd0aCA9PT0gNylcclxuICAgIHJldHVybiAnMCcgKyB3b3JkO1xyXG4gIGVsc2UgaWYgKHdvcmQubGVuZ3RoID09PSA2KVxyXG4gICAgcmV0dXJuICcwMCcgKyB3b3JkO1xyXG4gIGVsc2UgaWYgKHdvcmQubGVuZ3RoID09PSA1KVxyXG4gICAgcmV0dXJuICcwMDAnICsgd29yZDtcclxuICBlbHNlIGlmICh3b3JkLmxlbmd0aCA9PT0gNClcclxuICAgIHJldHVybiAnMDAwMCcgKyB3b3JkO1xyXG4gIGVsc2UgaWYgKHdvcmQubGVuZ3RoID09PSAzKVxyXG4gICAgcmV0dXJuICcwMDAwMCcgKyB3b3JkO1xyXG4gIGVsc2UgaWYgKHdvcmQubGVuZ3RoID09PSAyKVxyXG4gICAgcmV0dXJuICcwMDAwMDAnICsgd29yZDtcclxuICBlbHNlIGlmICh3b3JkLmxlbmd0aCA9PT0gMSlcclxuICAgIHJldHVybiAnMDAwMDAwMCcgKyB3b3JkO1xyXG4gIGVsc2VcclxuICAgIHJldHVybiB3b3JkO1xyXG59XHJcbmV4cG9ydHMuemVybzggPSB6ZXJvODtcclxuXHJcbmZ1bmN0aW9uIGpvaW4zMihtc2csIHN0YXJ0LCBlbmQsIGVuZGlhbikge1xyXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydDtcclxuICBhc3NlcnQobGVuICUgNCA9PT0gMCk7XHJcbiAgdmFyIHJlcyA9IG5ldyBBcnJheShsZW4gLyA0KTtcclxuICBmb3IgKHZhciBpID0gMCwgayA9IHN0YXJ0OyBpIDwgcmVzLmxlbmd0aDsgaSsrLCBrICs9IDQpIHtcclxuICAgIHZhciB3O1xyXG4gICAgaWYgKGVuZGlhbiA9PT0gJ2JpZycpXHJcbiAgICAgIHcgPSAobXNnW2tdIDw8IDI0KSB8IChtc2dbayArIDFdIDw8IDE2KSB8IChtc2dbayArIDJdIDw8IDgpIHwgbXNnW2sgKyAzXTtcclxuICAgIGVsc2VcclxuICAgICAgdyA9IChtc2dbayArIDNdIDw8IDI0KSB8IChtc2dbayArIDJdIDw8IDE2KSB8IChtc2dbayArIDFdIDw8IDgpIHwgbXNnW2tdO1xyXG4gICAgcmVzW2ldID0gdyA+Pj4gMDtcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5leHBvcnRzLmpvaW4zMiA9IGpvaW4zMjtcclxuXHJcbmZ1bmN0aW9uIHNwbGl0MzIobXNnLCBlbmRpYW4pIHtcclxuICB2YXIgcmVzID0gbmV3IEFycmF5KG1zZy5sZW5ndGggKiA0KTtcclxuICBmb3IgKHZhciBpID0gMCwgayA9IDA7IGkgPCBtc2cubGVuZ3RoOyBpKyssIGsgKz0gNCkge1xyXG4gICAgdmFyIG0gPSBtc2dbaV07XHJcbiAgICBpZiAoZW5kaWFuID09PSAnYmlnJykge1xyXG4gICAgICByZXNba10gPSBtID4+PiAyNDtcclxuICAgICAgcmVzW2sgKyAxXSA9IChtID4+PiAxNikgJiAweGZmO1xyXG4gICAgICByZXNbayArIDJdID0gKG0gPj4+IDgpICYgMHhmZjtcclxuICAgICAgcmVzW2sgKyAzXSA9IG0gJiAweGZmO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzW2sgKyAzXSA9IG0gPj4+IDI0O1xyXG4gICAgICByZXNbayArIDJdID0gKG0gPj4+IDE2KSAmIDB4ZmY7XHJcbiAgICAgIHJlc1trICsgMV0gPSAobSA+Pj4gOCkgJiAweGZmO1xyXG4gICAgICByZXNba10gPSBtICYgMHhmZjtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5leHBvcnRzLnNwbGl0MzIgPSBzcGxpdDMyO1xyXG5cclxuZnVuY3Rpb24gcm90cjMyKHcsIGIpIHtcclxuICByZXR1cm4gKHcgPj4+IGIpIHwgKHcgPDwgKDMyIC0gYikpO1xyXG59XHJcbmV4cG9ydHMucm90cjMyID0gcm90cjMyO1xyXG5cclxuZnVuY3Rpb24gcm90bDMyKHcsIGIpIHtcclxuICByZXR1cm4gKHcgPDwgYikgfCAodyA+Pj4gKDMyIC0gYikpO1xyXG59XHJcbmV4cG9ydHMucm90bDMyID0gcm90bDMyO1xyXG5cclxuZnVuY3Rpb24gc3VtMzIoYSwgYikge1xyXG4gIHJldHVybiAoYSArIGIpID4+PiAwO1xyXG59XHJcbmV4cG9ydHMuc3VtMzIgPSBzdW0zMjtcclxuXHJcbmZ1bmN0aW9uIHN1bTMyXzMoYSwgYiwgYykge1xyXG4gIHJldHVybiAoYSArIGIgKyBjKSA+Pj4gMDtcclxufVxyXG5leHBvcnRzLnN1bTMyXzMgPSBzdW0zMl8zO1xyXG5cclxuZnVuY3Rpb24gc3VtMzJfNChhLCBiLCBjLCBkKSB7XHJcbiAgcmV0dXJuIChhICsgYiArIGMgKyBkKSA+Pj4gMDtcclxufVxyXG5leHBvcnRzLnN1bTMyXzQgPSBzdW0zMl80O1xyXG5cclxuZnVuY3Rpb24gc3VtMzJfNShhLCBiLCBjLCBkLCBlKSB7XHJcbiAgcmV0dXJuIChhICsgYiArIGMgKyBkICsgZSkgPj4+IDA7XHJcbn1cclxuZXhwb3J0cy5zdW0zMl81ID0gc3VtMzJfNTtcclxuXHJcbmZ1bmN0aW9uIHN1bTY0KGJ1ZiwgcG9zLCBhaCwgYWwpIHtcclxuICB2YXIgYmggPSBidWZbcG9zXTtcclxuICB2YXIgYmwgPSBidWZbcG9zICsgMV07XHJcblxyXG4gIHZhciBsbyA9IChhbCArIGJsKSA+Pj4gMDtcclxuICB2YXIgaGkgPSAobG8gPCBhbCA/IDEgOiAwKSArIGFoICsgYmg7XHJcbiAgYnVmW3Bvc10gPSBoaSA+Pj4gMDtcclxuICBidWZbcG9zICsgMV0gPSBsbztcclxufVxyXG5leHBvcnRzLnN1bTY0ID0gc3VtNjQ7XHJcblxyXG5mdW5jdGlvbiBzdW02NF9oaShhaCwgYWwsIGJoLCBibCkge1xyXG4gIHZhciBsbyA9IChhbCArIGJsKSA+Pj4gMDtcclxuICB2YXIgaGkgPSAobG8gPCBhbCA/IDEgOiAwKSArIGFoICsgYmg7XHJcbiAgcmV0dXJuIGhpID4+PiAwO1xyXG59XHJcbmV4cG9ydHMuc3VtNjRfaGkgPSBzdW02NF9oaTtcclxuXHJcbmZ1bmN0aW9uIHN1bTY0X2xvKGFoLCBhbCwgYmgsIGJsKSB7XHJcbiAgdmFyIGxvID0gYWwgKyBibDtcclxuICByZXR1cm4gbG8gPj4+IDA7XHJcbn1cclxuZXhwb3J0cy5zdW02NF9sbyA9IHN1bTY0X2xvO1xyXG5cclxuZnVuY3Rpb24gc3VtNjRfNF9oaShhaCwgYWwsIGJoLCBibCwgY2gsIGNsLCBkaCwgZGwpIHtcclxuICB2YXIgY2FycnkgPSAwO1xyXG4gIHZhciBsbyA9IGFsO1xyXG4gIGxvID0gKGxvICsgYmwpID4+PiAwO1xyXG4gIGNhcnJ5ICs9IGxvIDwgYWwgPyAxIDogMDtcclxuICBsbyA9IChsbyArIGNsKSA+Pj4gMDtcclxuICBjYXJyeSArPSBsbyA8IGNsID8gMSA6IDA7XHJcbiAgbG8gPSAobG8gKyBkbCkgPj4+IDA7XHJcbiAgY2FycnkgKz0gbG8gPCBkbCA/IDEgOiAwO1xyXG5cclxuICB2YXIgaGkgPSBhaCArIGJoICsgY2ggKyBkaCArIGNhcnJ5O1xyXG4gIHJldHVybiBoaSA+Pj4gMDtcclxufVxyXG5leHBvcnRzLnN1bTY0XzRfaGkgPSBzdW02NF80X2hpO1xyXG5cclxuZnVuY3Rpb24gc3VtNjRfNF9sbyhhaCwgYWwsIGJoLCBibCwgY2gsIGNsLCBkaCwgZGwpIHtcclxuICB2YXIgbG8gPSBhbCArIGJsICsgY2wgKyBkbDtcclxuICByZXR1cm4gbG8gPj4+IDA7XHJcbn1cclxuZXhwb3J0cy5zdW02NF80X2xvID0gc3VtNjRfNF9sbztcclxuXHJcbmZ1bmN0aW9uIHN1bTY0XzVfaGkoYWgsIGFsLCBiaCwgYmwsIGNoLCBjbCwgZGgsIGRsLCBlaCwgZWwpIHtcclxuICB2YXIgY2FycnkgPSAwO1xyXG4gIHZhciBsbyA9IGFsO1xyXG4gIGxvID0gKGxvICsgYmwpID4+PiAwO1xyXG4gIGNhcnJ5ICs9IGxvIDwgYWwgPyAxIDogMDtcclxuICBsbyA9IChsbyArIGNsKSA+Pj4gMDtcclxuICBjYXJyeSArPSBsbyA8IGNsID8gMSA6IDA7XHJcbiAgbG8gPSAobG8gKyBkbCkgPj4+IDA7XHJcbiAgY2FycnkgKz0gbG8gPCBkbCA/IDEgOiAwO1xyXG4gIGxvID0gKGxvICsgZWwpID4+PiAwO1xyXG4gIGNhcnJ5ICs9IGxvIDwgZWwgPyAxIDogMDtcclxuXHJcbiAgdmFyIGhpID0gYWggKyBiaCArIGNoICsgZGggKyBlaCArIGNhcnJ5O1xyXG4gIHJldHVybiBoaSA+Pj4gMDtcclxufVxyXG5leHBvcnRzLnN1bTY0XzVfaGkgPSBzdW02NF81X2hpO1xyXG5cclxuZnVuY3Rpb24gc3VtNjRfNV9sbyhhaCwgYWwsIGJoLCBibCwgY2gsIGNsLCBkaCwgZGwsIGVoLCBlbCkge1xyXG4gIHZhciBsbyA9IGFsICsgYmwgKyBjbCArIGRsICsgZWw7XHJcblxyXG4gIHJldHVybiBsbyA+Pj4gMDtcclxufVxyXG5leHBvcnRzLnN1bTY0XzVfbG8gPSBzdW02NF81X2xvO1xyXG5cclxuZnVuY3Rpb24gcm90cjY0X2hpKGFoLCBhbCwgbnVtKSB7XHJcbiAgdmFyIHIgPSAoYWwgPDwgKDMyIC0gbnVtKSkgfCAoYWggPj4+IG51bSk7XHJcbiAgcmV0dXJuIHIgPj4+IDA7XHJcbn1cclxuZXhwb3J0cy5yb3RyNjRfaGkgPSByb3RyNjRfaGk7XHJcblxyXG5mdW5jdGlvbiByb3RyNjRfbG8oYWgsIGFsLCBudW0pIHtcclxuICB2YXIgciA9IChhaCA8PCAoMzIgLSBudW0pKSB8IChhbCA+Pj4gbnVtKTtcclxuICByZXR1cm4gciA+Pj4gMDtcclxufVxyXG5leHBvcnRzLnJvdHI2NF9sbyA9IHJvdHI2NF9sbztcclxuXHJcbmZ1bmN0aW9uIHNocjY0X2hpKGFoLCBhbCwgbnVtKSB7XHJcbiAgcmV0dXJuIGFoID4+PiBudW07XHJcbn1cclxuZXhwb3J0cy5zaHI2NF9oaSA9IHNocjY0X2hpO1xyXG5cclxuZnVuY3Rpb24gc2hyNjRfbG8oYWgsIGFsLCBudW0pIHtcclxuICB2YXIgciA9IChhaCA8PCAoMzIgLSBudW0pKSB8IChhbCA+Pj4gbnVtKTtcclxuICByZXR1cm4gciA+Pj4gMDtcclxufVxyXG5leHBvcnRzLnNocjY0X2xvID0gc2hyNjRfbG87XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=