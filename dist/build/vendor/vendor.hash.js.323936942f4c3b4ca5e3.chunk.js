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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaGFzaC5qcy9saWIvaGFzaC9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2hhc2guanMvbGliL2hhc2gvc2hhLzIyNC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaGFzaC5qcy9saWIvaGFzaC9zaGEvMS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaGFzaC5qcy9saWIvaGFzaC9obWFjLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9oYXNoLmpzL2xpYi9oYXNoL3NoYS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaGFzaC5qcy9saWIvaGFzaC9zaGEvMjU2LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9oYXNoLmpzL2xpYi9oYXNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9oYXNoLmpzL2xpYi9oYXNoL3NoYS8zODQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2hhc2guanMvbGliL2hhc2gvc2hhL2NvbW1vbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaGFzaC5qcy9saWIvaGFzaC9zaGEvNTEyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9oYXNoLmpzL2xpYi9oYXNoL3JpcGVtZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaGFzaC5qcy9saWIvaGFzaC91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7O0FBRWIsWUFBWSxtQkFBTyxDQUFDLHFCQUFTO0FBQzdCLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBcUI7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixnQkFBZ0I7QUFDbkM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixvQkFBb0I7QUFDdkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWUsb0JBQW9CO0FBQ25DO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQzNGYTs7QUFFYixZQUFZLG1CQUFPLENBQUMsc0JBQVU7QUFDOUIsYUFBYSxtQkFBTyxDQUFDLG1CQUFPOztBQUU1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDNUJhOztBQUViLFlBQVksbUJBQU8sQ0FBQyxzQkFBVTtBQUM5QixhQUFhLG1CQUFPLENBQUMsdUJBQVc7QUFDaEMsZ0JBQWdCLG1CQUFPLENBQUMsc0JBQVU7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLFFBQVE7QUFDekI7O0FBRUEsT0FBTyxjQUFjO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxjQUFjO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3pFYTs7QUFFYixZQUFZLG1CQUFPLENBQUMscUJBQVM7QUFDN0IsYUFBYSxtQkFBTyxDQUFDLGlDQUFxQjs7QUFFMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQixvQkFBb0I7QUFDOUM7O0FBRUEsYUFBYSxnQkFBZ0I7QUFDN0I7QUFDQTs7QUFFQTtBQUNBLGFBQWEsZ0JBQWdCO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzlDYTs7QUFFYixlQUFlLG1CQUFPLENBQUMscUJBQVM7QUFDaEMsaUJBQWlCLG1CQUFPLENBQUMsdUJBQVc7QUFDcEMsaUJBQWlCLG1CQUFPLENBQUMsdUJBQVc7QUFDcEMsaUJBQWlCLG1CQUFPLENBQUMsdUJBQVc7QUFDcEMsaUJBQWlCLG1CQUFPLENBQUMsdUJBQVc7Ozs7Ozs7Ozs7Ozs7QUNOdkI7O0FBRWIsWUFBWSxtQkFBTyxDQUFDLHNCQUFVO0FBQzlCLGFBQWEsbUJBQU8sQ0FBQyx1QkFBVztBQUNoQyxnQkFBZ0IsbUJBQU8sQ0FBQyxzQkFBVTtBQUNsQyxhQUFhLG1CQUFPLENBQUMsaUNBQXFCOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQixRQUFRO0FBQ3pCO0FBQ0EsUUFBUSxjQUFjO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLGNBQWM7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN4R0E7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLDBCQUFjO0FBQ25DLGNBQWMsbUJBQU8sQ0FBQywyQkFBZTtBQUNyQyxXQUFXLG1CQUFPLENBQUMsd0JBQVk7QUFDL0IsY0FBYyxtQkFBTyxDQUFDLDJCQUFlO0FBQ3JDLFlBQVksbUJBQU8sQ0FBQyx5QkFBYTs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNkYTs7QUFFYixZQUFZLG1CQUFPLENBQUMsc0JBQVU7O0FBRTlCLGFBQWEsbUJBQU8sQ0FBQyxtQkFBTzs7QUFFNUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2xDYTs7QUFFYixZQUFZLG1CQUFPLENBQUMsc0JBQVU7QUFDOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaERhOztBQUViLFlBQVksbUJBQU8sQ0FBQyxzQkFBVTtBQUM5QixhQUFhLG1CQUFPLENBQUMsdUJBQVc7QUFDaEMsYUFBYSxtQkFBTyxDQUFDLGlDQUFxQjs7QUFFMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLFFBQVE7QUFDekI7QUFDQSxRQUFRLGNBQWM7QUFDdEIsOENBQThDO0FBQzlDO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0EsMEJBQTBCO0FBQzFCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLGNBQWM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFtQztBQUNuQyxtQ0FBbUM7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFtQztBQUNuQyxtQ0FBbUM7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DOztBQUVuQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQzs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9DQUFvQztBQUNwQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3pVYTs7QUFFYixZQUFZLG1CQUFPLENBQUMscUJBQVM7QUFDN0IsYUFBYSxtQkFBTyxDQUFDLHNCQUFVOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsUUFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNqSmE7O0FBRWIsYUFBYSxtQkFBTyxDQUFDLGlDQUFxQjtBQUMxQyxlQUFlLG1CQUFPLENBQUMsc0JBQVU7O0FBRWpDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixnQkFBZ0I7QUFDckM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBLEdBQUc7QUFDSCxlQUFlLGdCQUFnQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsZ0JBQWdCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixnQkFBZ0I7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3QixnQkFBZ0I7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5oYXNoLmpzLjMyMzkzNjk0MmY0YzNiNGNhNWUzLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnbWluaW1hbGlzdGljLWFzc2VydCcpO1xuXG5mdW5jdGlvbiBCbG9ja0hhc2goKSB7XG4gIHRoaXMucGVuZGluZyA9IG51bGw7XG4gIHRoaXMucGVuZGluZ1RvdGFsID0gMDtcbiAgdGhpcy5ibG9ja1NpemUgPSB0aGlzLmNvbnN0cnVjdG9yLmJsb2NrU2l6ZTtcbiAgdGhpcy5vdXRTaXplID0gdGhpcy5jb25zdHJ1Y3Rvci5vdXRTaXplO1xuICB0aGlzLmhtYWNTdHJlbmd0aCA9IHRoaXMuY29uc3RydWN0b3IuaG1hY1N0cmVuZ3RoO1xuICB0aGlzLnBhZExlbmd0aCA9IHRoaXMuY29uc3RydWN0b3IucGFkTGVuZ3RoIC8gODtcbiAgdGhpcy5lbmRpYW4gPSAnYmlnJztcblxuICB0aGlzLl9kZWx0YTggPSB0aGlzLmJsb2NrU2l6ZSAvIDg7XG4gIHRoaXMuX2RlbHRhMzIgPSB0aGlzLmJsb2NrU2l6ZSAvIDMyO1xufVxuZXhwb3J0cy5CbG9ja0hhc2ggPSBCbG9ja0hhc2g7XG5cbkJsb2NrSGFzaC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKG1zZywgZW5jKSB7XG4gIC8vIENvbnZlcnQgbWVzc2FnZSB0byBhcnJheSwgcGFkIGl0LCBhbmQgam9pbiBpbnRvIDMyYml0IGJsb2Nrc1xuICBtc2cgPSB1dGlscy50b0FycmF5KG1zZywgZW5jKTtcbiAgaWYgKCF0aGlzLnBlbmRpbmcpXG4gICAgdGhpcy5wZW5kaW5nID0gbXNnO1xuICBlbHNlXG4gICAgdGhpcy5wZW5kaW5nID0gdGhpcy5wZW5kaW5nLmNvbmNhdChtc2cpO1xuICB0aGlzLnBlbmRpbmdUb3RhbCArPSBtc2cubGVuZ3RoO1xuXG4gIC8vIEVub3VnaCBkYXRhLCB0cnkgdXBkYXRpbmdcbiAgaWYgKHRoaXMucGVuZGluZy5sZW5ndGggPj0gdGhpcy5fZGVsdGE4KSB7XG4gICAgbXNnID0gdGhpcy5wZW5kaW5nO1xuXG4gICAgLy8gUHJvY2VzcyBwZW5kaW5nIGRhdGEgaW4gYmxvY2tzXG4gICAgdmFyIHIgPSBtc2cubGVuZ3RoICUgdGhpcy5fZGVsdGE4O1xuICAgIHRoaXMucGVuZGluZyA9IG1zZy5zbGljZShtc2cubGVuZ3RoIC0gciwgbXNnLmxlbmd0aCk7XG4gICAgaWYgKHRoaXMucGVuZGluZy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xuXG4gICAgbXNnID0gdXRpbHMuam9pbjMyKG1zZywgMCwgbXNnLmxlbmd0aCAtIHIsIHRoaXMuZW5kaWFuKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkgKz0gdGhpcy5fZGVsdGEzMilcbiAgICAgIHRoaXMuX3VwZGF0ZShtc2csIGksIGkgKyB0aGlzLl9kZWx0YTMyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuQmxvY2tIYXNoLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiBkaWdlc3QoZW5jKSB7XG4gIHRoaXMudXBkYXRlKHRoaXMuX3BhZCgpKTtcbiAgYXNzZXJ0KHRoaXMucGVuZGluZyA9PT0gbnVsbCk7XG5cbiAgcmV0dXJuIHRoaXMuX2RpZ2VzdChlbmMpO1xufTtcblxuQmxvY2tIYXNoLnByb3RvdHlwZS5fcGFkID0gZnVuY3Rpb24gcGFkKCkge1xuICB2YXIgbGVuID0gdGhpcy5wZW5kaW5nVG90YWw7XG4gIHZhciBieXRlcyA9IHRoaXMuX2RlbHRhODtcbiAgdmFyIGsgPSBieXRlcyAtICgobGVuICsgdGhpcy5wYWRMZW5ndGgpICUgYnl0ZXMpO1xuICB2YXIgcmVzID0gbmV3IEFycmF5KGsgKyB0aGlzLnBhZExlbmd0aCk7XG4gIHJlc1swXSA9IDB4ODA7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgazsgaSsrKVxuICAgIHJlc1tpXSA9IDA7XG5cbiAgLy8gQXBwZW5kIGxlbmd0aFxuICBsZW4gPDw9IDM7XG4gIGlmICh0aGlzLmVuZGlhbiA9PT0gJ2JpZycpIHtcbiAgICBmb3IgKHZhciB0ID0gODsgdCA8IHRoaXMucGFkTGVuZ3RoOyB0KyspXG4gICAgICByZXNbaSsrXSA9IDA7XG5cbiAgICByZXNbaSsrXSA9IDA7XG4gICAgcmVzW2krK10gPSAwO1xuICAgIHJlc1tpKytdID0gMDtcbiAgICByZXNbaSsrXSA9IDA7XG4gICAgcmVzW2krK10gPSAobGVuID4+PiAyNCkgJiAweGZmO1xuICAgIHJlc1tpKytdID0gKGxlbiA+Pj4gMTYpICYgMHhmZjtcbiAgICByZXNbaSsrXSA9IChsZW4gPj4+IDgpICYgMHhmZjtcbiAgICByZXNbaSsrXSA9IGxlbiAmIDB4ZmY7XG4gIH0gZWxzZSB7XG4gICAgcmVzW2krK10gPSBsZW4gJiAweGZmO1xuICAgIHJlc1tpKytdID0gKGxlbiA+Pj4gOCkgJiAweGZmO1xuICAgIHJlc1tpKytdID0gKGxlbiA+Pj4gMTYpICYgMHhmZjtcbiAgICByZXNbaSsrXSA9IChsZW4gPj4+IDI0KSAmIDB4ZmY7XG4gICAgcmVzW2krK10gPSAwO1xuICAgIHJlc1tpKytdID0gMDtcbiAgICByZXNbaSsrXSA9IDA7XG4gICAgcmVzW2krK10gPSAwO1xuXG4gICAgZm9yICh0ID0gODsgdCA8IHRoaXMucGFkTGVuZ3RoOyB0KyspXG4gICAgICByZXNbaSsrXSA9IDA7XG4gIH1cblxuICByZXR1cm4gcmVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBTSEEyNTYgPSByZXF1aXJlKCcuLzI1NicpO1xuXG5mdW5jdGlvbiBTSEEyMjQoKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTSEEyMjQpKVxuICAgIHJldHVybiBuZXcgU0hBMjI0KCk7XG5cbiAgU0hBMjU2LmNhbGwodGhpcyk7XG4gIHRoaXMuaCA9IFtcbiAgICAweGMxMDU5ZWQ4LCAweDM2N2NkNTA3LCAweDMwNzBkZDE3LCAweGY3MGU1OTM5LFxuICAgIDB4ZmZjMDBiMzEsIDB4Njg1ODE1MTEsIDB4NjRmOThmYTcsIDB4YmVmYTRmYTQgXTtcbn1cbnV0aWxzLmluaGVyaXRzKFNIQTIyNCwgU0hBMjU2KTtcbm1vZHVsZS5leHBvcnRzID0gU0hBMjI0O1xuXG5TSEEyMjQuYmxvY2tTaXplID0gNTEyO1xuU0hBMjI0Lm91dFNpemUgPSAyMjQ7XG5TSEEyMjQuaG1hY1N0cmVuZ3RoID0gMTkyO1xuU0hBMjI0LnBhZExlbmd0aCA9IDY0O1xuXG5TSEEyMjQucHJvdG90eXBlLl9kaWdlc3QgPSBmdW5jdGlvbiBkaWdlc3QoZW5jKSB7XG4gIC8vIEp1c3QgdHJ1bmNhdGUgb3V0cHV0XG4gIGlmIChlbmMgPT09ICdoZXgnKVxuICAgIHJldHVybiB1dGlscy50b0hleDMyKHRoaXMuaC5zbGljZSgwLCA3KSwgJ2JpZycpO1xuICBlbHNlXG4gICAgcmV0dXJuIHV0aWxzLnNwbGl0MzIodGhpcy5oLnNsaWNlKDAsIDcpLCAnYmlnJyk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi4vY29tbW9uJyk7XG52YXIgc2hhQ29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcblxudmFyIHJvdGwzMiA9IHV0aWxzLnJvdGwzMjtcbnZhciBzdW0zMiA9IHV0aWxzLnN1bTMyO1xudmFyIHN1bTMyXzUgPSB1dGlscy5zdW0zMl81O1xudmFyIGZ0XzEgPSBzaGFDb21tb24uZnRfMTtcbnZhciBCbG9ja0hhc2ggPSBjb21tb24uQmxvY2tIYXNoO1xuXG52YXIgc2hhMV9LID0gW1xuICAweDVBODI3OTk5LCAweDZFRDlFQkExLFxuICAweDhGMUJCQ0RDLCAweENBNjJDMUQ2XG5dO1xuXG5mdW5jdGlvbiBTSEExKCkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU0hBMSkpXG4gICAgcmV0dXJuIG5ldyBTSEExKCk7XG5cbiAgQmxvY2tIYXNoLmNhbGwodGhpcyk7XG4gIHRoaXMuaCA9IFtcbiAgICAweDY3NDUyMzAxLCAweGVmY2RhYjg5LCAweDk4YmFkY2ZlLFxuICAgIDB4MTAzMjU0NzYsIDB4YzNkMmUxZjAgXTtcbiAgdGhpcy5XID0gbmV3IEFycmF5KDgwKTtcbn1cblxudXRpbHMuaW5oZXJpdHMoU0hBMSwgQmxvY2tIYXNoKTtcbm1vZHVsZS5leHBvcnRzID0gU0hBMTtcblxuU0hBMS5ibG9ja1NpemUgPSA1MTI7XG5TSEExLm91dFNpemUgPSAxNjA7XG5TSEExLmhtYWNTdHJlbmd0aCA9IDgwO1xuU0hBMS5wYWRMZW5ndGggPSA2NDtcblxuU0hBMS5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIF91cGRhdGUobXNnLCBzdGFydCkge1xuICB2YXIgVyA9IHRoaXMuVztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyBpKyspXG4gICAgV1tpXSA9IG1zZ1tzdGFydCArIGldO1xuXG4gIGZvcig7IGkgPCBXLmxlbmd0aDsgaSsrKVxuICAgIFdbaV0gPSByb3RsMzIoV1tpIC0gM10gXiBXW2kgLSA4XSBeIFdbaSAtIDE0XSBeIFdbaSAtIDE2XSwgMSk7XG5cbiAgdmFyIGEgPSB0aGlzLmhbMF07XG4gIHZhciBiID0gdGhpcy5oWzFdO1xuICB2YXIgYyA9IHRoaXMuaFsyXTtcbiAgdmFyIGQgPSB0aGlzLmhbM107XG4gIHZhciBlID0gdGhpcy5oWzRdO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBXLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHMgPSB+fihpIC8gMjApO1xuICAgIHZhciB0ID0gc3VtMzJfNShyb3RsMzIoYSwgNSksIGZ0XzEocywgYiwgYywgZCksIGUsIFdbaV0sIHNoYTFfS1tzXSk7XG4gICAgZSA9IGQ7XG4gICAgZCA9IGM7XG4gICAgYyA9IHJvdGwzMihiLCAzMCk7XG4gICAgYiA9IGE7XG4gICAgYSA9IHQ7XG4gIH1cblxuICB0aGlzLmhbMF0gPSBzdW0zMih0aGlzLmhbMF0sIGEpO1xuICB0aGlzLmhbMV0gPSBzdW0zMih0aGlzLmhbMV0sIGIpO1xuICB0aGlzLmhbMl0gPSBzdW0zMih0aGlzLmhbMl0sIGMpO1xuICB0aGlzLmhbM10gPSBzdW0zMih0aGlzLmhbM10sIGQpO1xuICB0aGlzLmhbNF0gPSBzdW0zMih0aGlzLmhbNF0sIGUpO1xufTtcblxuU0hBMS5wcm90b3R5cGUuX2RpZ2VzdCA9IGZ1bmN0aW9uIGRpZ2VzdChlbmMpIHtcbiAgaWYgKGVuYyA9PT0gJ2hleCcpXG4gICAgcmV0dXJuIHV0aWxzLnRvSGV4MzIodGhpcy5oLCAnYmlnJyk7XG4gIGVsc2VcbiAgICByZXR1cm4gdXRpbHMuc3BsaXQzMih0aGlzLmgsICdiaWcnKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdtaW5pbWFsaXN0aWMtYXNzZXJ0Jyk7XG5cbmZ1bmN0aW9uIEhtYWMoaGFzaCwga2V5LCBlbmMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEhtYWMpKVxuICAgIHJldHVybiBuZXcgSG1hYyhoYXNoLCBrZXksIGVuYyk7XG4gIHRoaXMuSGFzaCA9IGhhc2g7XG4gIHRoaXMuYmxvY2tTaXplID0gaGFzaC5ibG9ja1NpemUgLyA4O1xuICB0aGlzLm91dFNpemUgPSBoYXNoLm91dFNpemUgLyA4O1xuICB0aGlzLmlubmVyID0gbnVsbDtcbiAgdGhpcy5vdXRlciA9IG51bGw7XG5cbiAgdGhpcy5faW5pdCh1dGlscy50b0FycmF5KGtleSwgZW5jKSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEhtYWM7XG5cbkhtYWMucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24gaW5pdChrZXkpIHtcbiAgLy8gU2hvcnRlbiBrZXksIGlmIG5lZWRlZFxuICBpZiAoa2V5Lmxlbmd0aCA+IHRoaXMuYmxvY2tTaXplKVxuICAgIGtleSA9IG5ldyB0aGlzLkhhc2goKS51cGRhdGUoa2V5KS5kaWdlc3QoKTtcbiAgYXNzZXJ0KGtleS5sZW5ndGggPD0gdGhpcy5ibG9ja1NpemUpO1xuXG4gIC8vIEFkZCBwYWRkaW5nIHRvIGtleVxuICBmb3IgKHZhciBpID0ga2V5Lmxlbmd0aDsgaSA8IHRoaXMuYmxvY2tTaXplOyBpKyspXG4gICAga2V5LnB1c2goMCk7XG5cbiAgZm9yIChpID0gMDsgaSA8IGtleS5sZW5ndGg7IGkrKylcbiAgICBrZXlbaV0gXj0gMHgzNjtcbiAgdGhpcy5pbm5lciA9IG5ldyB0aGlzLkhhc2goKS51cGRhdGUoa2V5KTtcblxuICAvLyAweDM2IF4gMHg1YyA9IDB4NmFcbiAgZm9yIChpID0gMDsgaSA8IGtleS5sZW5ndGg7IGkrKylcbiAgICBrZXlbaV0gXj0gMHg2YTtcbiAgdGhpcy5vdXRlciA9IG5ldyB0aGlzLkhhc2goKS51cGRhdGUoa2V5KTtcbn07XG5cbkhtYWMucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZShtc2csIGVuYykge1xuICB0aGlzLmlubmVyLnVwZGF0ZShtc2csIGVuYyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuSG1hYy5wcm90b3R5cGUuZGlnZXN0ID0gZnVuY3Rpb24gZGlnZXN0KGVuYykge1xuICB0aGlzLm91dGVyLnVwZGF0ZSh0aGlzLmlubmVyLmRpZ2VzdCgpKTtcbiAgcmV0dXJuIHRoaXMub3V0ZXIuZGlnZXN0KGVuYyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLnNoYTEgPSByZXF1aXJlKCcuL3NoYS8xJyk7XG5leHBvcnRzLnNoYTIyNCA9IHJlcXVpcmUoJy4vc2hhLzIyNCcpO1xuZXhwb3J0cy5zaGEyNTYgPSByZXF1aXJlKCcuL3NoYS8yNTYnKTtcbmV4cG9ydHMuc2hhMzg0ID0gcmVxdWlyZSgnLi9zaGEvMzg0Jyk7XG5leHBvcnRzLnNoYTUxMiA9IHJlcXVpcmUoJy4vc2hhLzUxMicpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4uL2NvbW1vbicpO1xudmFyIHNoYUNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnbWluaW1hbGlzdGljLWFzc2VydCcpO1xuXG52YXIgc3VtMzIgPSB1dGlscy5zdW0zMjtcbnZhciBzdW0zMl80ID0gdXRpbHMuc3VtMzJfNDtcbnZhciBzdW0zMl81ID0gdXRpbHMuc3VtMzJfNTtcbnZhciBjaDMyID0gc2hhQ29tbW9uLmNoMzI7XG52YXIgbWFqMzIgPSBzaGFDb21tb24ubWFqMzI7XG52YXIgczBfMjU2ID0gc2hhQ29tbW9uLnMwXzI1NjtcbnZhciBzMV8yNTYgPSBzaGFDb21tb24uczFfMjU2O1xudmFyIGcwXzI1NiA9IHNoYUNvbW1vbi5nMF8yNTY7XG52YXIgZzFfMjU2ID0gc2hhQ29tbW9uLmcxXzI1NjtcblxudmFyIEJsb2NrSGFzaCA9IGNvbW1vbi5CbG9ja0hhc2g7XG5cbnZhciBzaGEyNTZfSyA9IFtcbiAgMHg0MjhhMmY5OCwgMHg3MTM3NDQ5MSwgMHhiNWMwZmJjZiwgMHhlOWI1ZGJhNSxcbiAgMHgzOTU2YzI1YiwgMHg1OWYxMTFmMSwgMHg5MjNmODJhNCwgMHhhYjFjNWVkNSxcbiAgMHhkODA3YWE5OCwgMHgxMjgzNWIwMSwgMHgyNDMxODViZSwgMHg1NTBjN2RjMyxcbiAgMHg3MmJlNWQ3NCwgMHg4MGRlYjFmZSwgMHg5YmRjMDZhNywgMHhjMTliZjE3NCxcbiAgMHhlNDliNjljMSwgMHhlZmJlNDc4NiwgMHgwZmMxOWRjNiwgMHgyNDBjYTFjYyxcbiAgMHgyZGU5MmM2ZiwgMHg0YTc0ODRhYSwgMHg1Y2IwYTlkYywgMHg3NmY5ODhkYSxcbiAgMHg5ODNlNTE1MiwgMHhhODMxYzY2ZCwgMHhiMDAzMjdjOCwgMHhiZjU5N2ZjNyxcbiAgMHhjNmUwMGJmMywgMHhkNWE3OTE0NywgMHgwNmNhNjM1MSwgMHgxNDI5Mjk2NyxcbiAgMHgyN2I3MGE4NSwgMHgyZTFiMjEzOCwgMHg0ZDJjNmRmYywgMHg1MzM4MGQxMyxcbiAgMHg2NTBhNzM1NCwgMHg3NjZhMGFiYiwgMHg4MWMyYzkyZSwgMHg5MjcyMmM4NSxcbiAgMHhhMmJmZThhMSwgMHhhODFhNjY0YiwgMHhjMjRiOGI3MCwgMHhjNzZjNTFhMyxcbiAgMHhkMTkyZTgxOSwgMHhkNjk5MDYyNCwgMHhmNDBlMzU4NSwgMHgxMDZhYTA3MCxcbiAgMHgxOWE0YzExNiwgMHgxZTM3NmMwOCwgMHgyNzQ4Nzc0YywgMHgzNGIwYmNiNSxcbiAgMHgzOTFjMGNiMywgMHg0ZWQ4YWE0YSwgMHg1YjljY2E0ZiwgMHg2ODJlNmZmMyxcbiAgMHg3NDhmODJlZSwgMHg3OGE1NjM2ZiwgMHg4NGM4NzgxNCwgMHg4Y2M3MDIwOCxcbiAgMHg5MGJlZmZmYSwgMHhhNDUwNmNlYiwgMHhiZWY5YTNmNywgMHhjNjcxNzhmMlxuXTtcblxuZnVuY3Rpb24gU0hBMjU2KCkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU0hBMjU2KSlcbiAgICByZXR1cm4gbmV3IFNIQTI1NigpO1xuXG4gIEJsb2NrSGFzaC5jYWxsKHRoaXMpO1xuICB0aGlzLmggPSBbXG4gICAgMHg2YTA5ZTY2NywgMHhiYjY3YWU4NSwgMHgzYzZlZjM3MiwgMHhhNTRmZjUzYSxcbiAgICAweDUxMGU1MjdmLCAweDliMDU2ODhjLCAweDFmODNkOWFiLCAweDViZTBjZDE5XG4gIF07XG4gIHRoaXMuayA9IHNoYTI1Nl9LO1xuICB0aGlzLlcgPSBuZXcgQXJyYXkoNjQpO1xufVxudXRpbHMuaW5oZXJpdHMoU0hBMjU2LCBCbG9ja0hhc2gpO1xubW9kdWxlLmV4cG9ydHMgPSBTSEEyNTY7XG5cblNIQTI1Ni5ibG9ja1NpemUgPSA1MTI7XG5TSEEyNTYub3V0U2l6ZSA9IDI1NjtcblNIQTI1Ni5obWFjU3RyZW5ndGggPSAxOTI7XG5TSEEyNTYucGFkTGVuZ3RoID0gNjQ7XG5cblNIQTI1Ni5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIF91cGRhdGUobXNnLCBzdGFydCkge1xuICB2YXIgVyA9IHRoaXMuVztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyBpKyspXG4gICAgV1tpXSA9IG1zZ1tzdGFydCArIGldO1xuICBmb3IgKDsgaSA8IFcubGVuZ3RoOyBpKyspXG4gICAgV1tpXSA9IHN1bTMyXzQoZzFfMjU2KFdbaSAtIDJdKSwgV1tpIC0gN10sIGcwXzI1NihXW2kgLSAxNV0pLCBXW2kgLSAxNl0pO1xuXG4gIHZhciBhID0gdGhpcy5oWzBdO1xuICB2YXIgYiA9IHRoaXMuaFsxXTtcbiAgdmFyIGMgPSB0aGlzLmhbMl07XG4gIHZhciBkID0gdGhpcy5oWzNdO1xuICB2YXIgZSA9IHRoaXMuaFs0XTtcbiAgdmFyIGYgPSB0aGlzLmhbNV07XG4gIHZhciBnID0gdGhpcy5oWzZdO1xuICB2YXIgaCA9IHRoaXMuaFs3XTtcblxuICBhc3NlcnQodGhpcy5rLmxlbmd0aCA9PT0gVy5sZW5ndGgpO1xuICBmb3IgKGkgPSAwOyBpIDwgVy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBUMSA9IHN1bTMyXzUoaCwgczFfMjU2KGUpLCBjaDMyKGUsIGYsIGcpLCB0aGlzLmtbaV0sIFdbaV0pO1xuICAgIHZhciBUMiA9IHN1bTMyKHMwXzI1NihhKSwgbWFqMzIoYSwgYiwgYykpO1xuICAgIGggPSBnO1xuICAgIGcgPSBmO1xuICAgIGYgPSBlO1xuICAgIGUgPSBzdW0zMihkLCBUMSk7XG4gICAgZCA9IGM7XG4gICAgYyA9IGI7XG4gICAgYiA9IGE7XG4gICAgYSA9IHN1bTMyKFQxLCBUMik7XG4gIH1cblxuICB0aGlzLmhbMF0gPSBzdW0zMih0aGlzLmhbMF0sIGEpO1xuICB0aGlzLmhbMV0gPSBzdW0zMih0aGlzLmhbMV0sIGIpO1xuICB0aGlzLmhbMl0gPSBzdW0zMih0aGlzLmhbMl0sIGMpO1xuICB0aGlzLmhbM10gPSBzdW0zMih0aGlzLmhbM10sIGQpO1xuICB0aGlzLmhbNF0gPSBzdW0zMih0aGlzLmhbNF0sIGUpO1xuICB0aGlzLmhbNV0gPSBzdW0zMih0aGlzLmhbNV0sIGYpO1xuICB0aGlzLmhbNl0gPSBzdW0zMih0aGlzLmhbNl0sIGcpO1xuICB0aGlzLmhbN10gPSBzdW0zMih0aGlzLmhbN10sIGgpO1xufTtcblxuU0hBMjU2LnByb3RvdHlwZS5fZGlnZXN0ID0gZnVuY3Rpb24gZGlnZXN0KGVuYykge1xuICBpZiAoZW5jID09PSAnaGV4JylcbiAgICByZXR1cm4gdXRpbHMudG9IZXgzMih0aGlzLmgsICdiaWcnKTtcbiAgZWxzZVxuICAgIHJldHVybiB1dGlscy5zcGxpdDMyKHRoaXMuaCwgJ2JpZycpO1xufTtcbiIsInZhciBoYXNoID0gZXhwb3J0cztcblxuaGFzaC51dGlscyA9IHJlcXVpcmUoJy4vaGFzaC91dGlscycpO1xuaGFzaC5jb21tb24gPSByZXF1aXJlKCcuL2hhc2gvY29tbW9uJyk7XG5oYXNoLnNoYSA9IHJlcXVpcmUoJy4vaGFzaC9zaGEnKTtcbmhhc2gucmlwZW1kID0gcmVxdWlyZSgnLi9oYXNoL3JpcGVtZCcpO1xuaGFzaC5obWFjID0gcmVxdWlyZSgnLi9oYXNoL2htYWMnKTtcblxuLy8gUHJveHkgaGFzaCBmdW5jdGlvbnMgdG8gdGhlIG1haW4gb2JqZWN0XG5oYXNoLnNoYTEgPSBoYXNoLnNoYS5zaGExO1xuaGFzaC5zaGEyNTYgPSBoYXNoLnNoYS5zaGEyNTY7XG5oYXNoLnNoYTIyNCA9IGhhc2guc2hhLnNoYTIyNDtcbmhhc2guc2hhMzg0ID0gaGFzaC5zaGEuc2hhMzg0O1xuaGFzaC5zaGE1MTIgPSBoYXNoLnNoYS5zaGE1MTI7XG5oYXNoLnJpcGVtZDE2MCA9IGhhc2gucmlwZW1kLnJpcGVtZDE2MDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxudmFyIFNIQTUxMiA9IHJlcXVpcmUoJy4vNTEyJyk7XG5cbmZ1bmN0aW9uIFNIQTM4NCgpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFNIQTM4NCkpXG4gICAgcmV0dXJuIG5ldyBTSEEzODQoKTtcblxuICBTSEE1MTIuY2FsbCh0aGlzKTtcbiAgdGhpcy5oID0gW1xuICAgIDB4Y2JiYjlkNWQsIDB4YzEwNTllZDgsXG4gICAgMHg2MjlhMjkyYSwgMHgzNjdjZDUwNyxcbiAgICAweDkxNTkwMTVhLCAweDMwNzBkZDE3LFxuICAgIDB4MTUyZmVjZDgsIDB4ZjcwZTU5MzksXG4gICAgMHg2NzMzMjY2NywgMHhmZmMwMGIzMSxcbiAgICAweDhlYjQ0YTg3LCAweDY4NTgxNTExLFxuICAgIDB4ZGIwYzJlMGQsIDB4NjRmOThmYTcsXG4gICAgMHg0N2I1NDgxZCwgMHhiZWZhNGZhNCBdO1xufVxudXRpbHMuaW5oZXJpdHMoU0hBMzg0LCBTSEE1MTIpO1xubW9kdWxlLmV4cG9ydHMgPSBTSEEzODQ7XG5cblNIQTM4NC5ibG9ja1NpemUgPSAxMDI0O1xuU0hBMzg0Lm91dFNpemUgPSAzODQ7XG5TSEEzODQuaG1hY1N0cmVuZ3RoID0gMTkyO1xuU0hBMzg0LnBhZExlbmd0aCA9IDEyODtcblxuU0hBMzg0LnByb3RvdHlwZS5fZGlnZXN0ID0gZnVuY3Rpb24gZGlnZXN0KGVuYykge1xuICBpZiAoZW5jID09PSAnaGV4JylcbiAgICByZXR1cm4gdXRpbHMudG9IZXgzMih0aGlzLmguc2xpY2UoMCwgMTIpLCAnYmlnJyk7XG4gIGVsc2VcbiAgICByZXR1cm4gdXRpbHMuc3BsaXQzMih0aGlzLmguc2xpY2UoMCwgMTIpLCAnYmlnJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIHJvdHIzMiA9IHV0aWxzLnJvdHIzMjtcblxuZnVuY3Rpb24gZnRfMShzLCB4LCB5LCB6KSB7XG4gIGlmIChzID09PSAwKVxuICAgIHJldHVybiBjaDMyKHgsIHksIHopO1xuICBpZiAocyA9PT0gMSB8fCBzID09PSAzKVxuICAgIHJldHVybiBwMzIoeCwgeSwgeik7XG4gIGlmIChzID09PSAyKVxuICAgIHJldHVybiBtYWozMih4LCB5LCB6KTtcbn1cbmV4cG9ydHMuZnRfMSA9IGZ0XzE7XG5cbmZ1bmN0aW9uIGNoMzIoeCwgeSwgeikge1xuICByZXR1cm4gKHggJiB5KSBeICgofngpICYgeik7XG59XG5leHBvcnRzLmNoMzIgPSBjaDMyO1xuXG5mdW5jdGlvbiBtYWozMih4LCB5LCB6KSB7XG4gIHJldHVybiAoeCAmIHkpIF4gKHggJiB6KSBeICh5ICYgeik7XG59XG5leHBvcnRzLm1hajMyID0gbWFqMzI7XG5cbmZ1bmN0aW9uIHAzMih4LCB5LCB6KSB7XG4gIHJldHVybiB4IF4geSBeIHo7XG59XG5leHBvcnRzLnAzMiA9IHAzMjtcblxuZnVuY3Rpb24gczBfMjU2KHgpIHtcbiAgcmV0dXJuIHJvdHIzMih4LCAyKSBeIHJvdHIzMih4LCAxMykgXiByb3RyMzIoeCwgMjIpO1xufVxuZXhwb3J0cy5zMF8yNTYgPSBzMF8yNTY7XG5cbmZ1bmN0aW9uIHMxXzI1Nih4KSB7XG4gIHJldHVybiByb3RyMzIoeCwgNikgXiByb3RyMzIoeCwgMTEpIF4gcm90cjMyKHgsIDI1KTtcbn1cbmV4cG9ydHMuczFfMjU2ID0gczFfMjU2O1xuXG5mdW5jdGlvbiBnMF8yNTYoeCkge1xuICByZXR1cm4gcm90cjMyKHgsIDcpIF4gcm90cjMyKHgsIDE4KSBeICh4ID4+PiAzKTtcbn1cbmV4cG9ydHMuZzBfMjU2ID0gZzBfMjU2O1xuXG5mdW5jdGlvbiBnMV8yNTYoeCkge1xuICByZXR1cm4gcm90cjMyKHgsIDE3KSBeIHJvdHIzMih4LCAxOSkgXiAoeCA+Pj4gMTApO1xufVxuZXhwb3J0cy5nMV8yNTYgPSBnMV8yNTY7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi4vY29tbW9uJyk7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnbWluaW1hbGlzdGljLWFzc2VydCcpO1xuXG52YXIgcm90cjY0X2hpID0gdXRpbHMucm90cjY0X2hpO1xudmFyIHJvdHI2NF9sbyA9IHV0aWxzLnJvdHI2NF9sbztcbnZhciBzaHI2NF9oaSA9IHV0aWxzLnNocjY0X2hpO1xudmFyIHNocjY0X2xvID0gdXRpbHMuc2hyNjRfbG87XG52YXIgc3VtNjQgPSB1dGlscy5zdW02NDtcbnZhciBzdW02NF9oaSA9IHV0aWxzLnN1bTY0X2hpO1xudmFyIHN1bTY0X2xvID0gdXRpbHMuc3VtNjRfbG87XG52YXIgc3VtNjRfNF9oaSA9IHV0aWxzLnN1bTY0XzRfaGk7XG52YXIgc3VtNjRfNF9sbyA9IHV0aWxzLnN1bTY0XzRfbG87XG52YXIgc3VtNjRfNV9oaSA9IHV0aWxzLnN1bTY0XzVfaGk7XG52YXIgc3VtNjRfNV9sbyA9IHV0aWxzLnN1bTY0XzVfbG87XG5cbnZhciBCbG9ja0hhc2ggPSBjb21tb24uQmxvY2tIYXNoO1xuXG52YXIgc2hhNTEyX0sgPSBbXG4gIDB4NDI4YTJmOTgsIDB4ZDcyOGFlMjIsIDB4NzEzNzQ0OTEsIDB4MjNlZjY1Y2QsXG4gIDB4YjVjMGZiY2YsIDB4ZWM0ZDNiMmYsIDB4ZTliNWRiYTUsIDB4ODE4OWRiYmMsXG4gIDB4Mzk1NmMyNWIsIDB4ZjM0OGI1MzgsIDB4NTlmMTExZjEsIDB4YjYwNWQwMTksXG4gIDB4OTIzZjgyYTQsIDB4YWYxOTRmOWIsIDB4YWIxYzVlZDUsIDB4ZGE2ZDgxMTgsXG4gIDB4ZDgwN2FhOTgsIDB4YTMwMzAyNDIsIDB4MTI4MzViMDEsIDB4NDU3MDZmYmUsXG4gIDB4MjQzMTg1YmUsIDB4NGVlNGIyOGMsIDB4NTUwYzdkYzMsIDB4ZDVmZmI0ZTIsXG4gIDB4NzJiZTVkNzQsIDB4ZjI3Yjg5NmYsIDB4ODBkZWIxZmUsIDB4M2IxNjk2YjEsXG4gIDB4OWJkYzA2YTcsIDB4MjVjNzEyMzUsIDB4YzE5YmYxNzQsIDB4Y2Y2OTI2OTQsXG4gIDB4ZTQ5YjY5YzEsIDB4OWVmMTRhZDIsIDB4ZWZiZTQ3ODYsIDB4Mzg0ZjI1ZTMsXG4gIDB4MGZjMTlkYzYsIDB4OGI4Y2Q1YjUsIDB4MjQwY2ExY2MsIDB4NzdhYzljNjUsXG4gIDB4MmRlOTJjNmYsIDB4NTkyYjAyNzUsIDB4NGE3NDg0YWEsIDB4NmVhNmU0ODMsXG4gIDB4NWNiMGE5ZGMsIDB4YmQ0MWZiZDQsIDB4NzZmOTg4ZGEsIDB4ODMxMTUzYjUsXG4gIDB4OTgzZTUxNTIsIDB4ZWU2NmRmYWIsIDB4YTgzMWM2NmQsIDB4MmRiNDMyMTAsXG4gIDB4YjAwMzI3YzgsIDB4OThmYjIxM2YsIDB4YmY1OTdmYzcsIDB4YmVlZjBlZTQsXG4gIDB4YzZlMDBiZjMsIDB4M2RhODhmYzIsIDB4ZDVhNzkxNDcsIDB4OTMwYWE3MjUsXG4gIDB4MDZjYTYzNTEsIDB4ZTAwMzgyNmYsIDB4MTQyOTI5NjcsIDB4MGEwZTZlNzAsXG4gIDB4MjdiNzBhODUsIDB4NDZkMjJmZmMsIDB4MmUxYjIxMzgsIDB4NWMyNmM5MjYsXG4gIDB4NGQyYzZkZmMsIDB4NWFjNDJhZWQsIDB4NTMzODBkMTMsIDB4OWQ5NWIzZGYsXG4gIDB4NjUwYTczNTQsIDB4OGJhZjYzZGUsIDB4NzY2YTBhYmIsIDB4M2M3N2IyYTgsXG4gIDB4ODFjMmM5MmUsIDB4NDdlZGFlZTYsIDB4OTI3MjJjODUsIDB4MTQ4MjM1M2IsXG4gIDB4YTJiZmU4YTEsIDB4NGNmMTAzNjQsIDB4YTgxYTY2NGIsIDB4YmM0MjMwMDEsXG4gIDB4YzI0YjhiNzAsIDB4ZDBmODk3OTEsIDB4Yzc2YzUxYTMsIDB4MDY1NGJlMzAsXG4gIDB4ZDE5MmU4MTksIDB4ZDZlZjUyMTgsIDB4ZDY5OTA2MjQsIDB4NTU2NWE5MTAsXG4gIDB4ZjQwZTM1ODUsIDB4NTc3MTIwMmEsIDB4MTA2YWEwNzAsIDB4MzJiYmQxYjgsXG4gIDB4MTlhNGMxMTYsIDB4YjhkMmQwYzgsIDB4MWUzNzZjMDgsIDB4NTE0MWFiNTMsXG4gIDB4Mjc0ODc3NGMsIDB4ZGY4ZWViOTksIDB4MzRiMGJjYjUsIDB4ZTE5YjQ4YTgsXG4gIDB4MzkxYzBjYjMsIDB4YzVjOTVhNjMsIDB4NGVkOGFhNGEsIDB4ZTM0MThhY2IsXG4gIDB4NWI5Y2NhNGYsIDB4Nzc2M2UzNzMsIDB4NjgyZTZmZjMsIDB4ZDZiMmI4YTMsXG4gIDB4NzQ4ZjgyZWUsIDB4NWRlZmIyZmMsIDB4NzhhNTYzNmYsIDB4NDMxNzJmNjAsXG4gIDB4ODRjODc4MTQsIDB4YTFmMGFiNzIsIDB4OGNjNzAyMDgsIDB4MWE2NDM5ZWMsXG4gIDB4OTBiZWZmZmEsIDB4MjM2MzFlMjgsIDB4YTQ1MDZjZWIsIDB4ZGU4MmJkZTksXG4gIDB4YmVmOWEzZjcsIDB4YjJjNjc5MTUsIDB4YzY3MTc4ZjIsIDB4ZTM3MjUzMmIsXG4gIDB4Y2EyNzNlY2UsIDB4ZWEyNjYxOWMsIDB4ZDE4NmI4YzcsIDB4MjFjMGMyMDcsXG4gIDB4ZWFkYTdkZDYsIDB4Y2RlMGViMWUsIDB4ZjU3ZDRmN2YsIDB4ZWU2ZWQxNzgsXG4gIDB4MDZmMDY3YWEsIDB4NzIxNzZmYmEsIDB4MGE2MzdkYzUsIDB4YTJjODk4YTYsXG4gIDB4MTEzZjk4MDQsIDB4YmVmOTBkYWUsIDB4MWI3MTBiMzUsIDB4MTMxYzQ3MWIsXG4gIDB4MjhkYjc3ZjUsIDB4MjMwNDdkODQsIDB4MzJjYWFiN2IsIDB4NDBjNzI0OTMsXG4gIDB4M2M5ZWJlMGEsIDB4MTVjOWJlYmMsIDB4NDMxZDY3YzQsIDB4OWMxMDBkNGMsXG4gIDB4NGNjNWQ0YmUsIDB4Y2IzZTQyYjYsIDB4NTk3ZjI5OWMsIDB4ZmM2NTdlMmEsXG4gIDB4NWZjYjZmYWIsIDB4M2FkNmZhZWMsIDB4NmM0NDE5OGMsIDB4NGE0NzU4MTdcbl07XG5cbmZ1bmN0aW9uIFNIQTUxMigpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFNIQTUxMikpXG4gICAgcmV0dXJuIG5ldyBTSEE1MTIoKTtcblxuICBCbG9ja0hhc2guY2FsbCh0aGlzKTtcbiAgdGhpcy5oID0gW1xuICAgIDB4NmEwOWU2NjcsIDB4ZjNiY2M5MDgsXG4gICAgMHhiYjY3YWU4NSwgMHg4NGNhYTczYixcbiAgICAweDNjNmVmMzcyLCAweGZlOTRmODJiLFxuICAgIDB4YTU0ZmY1M2EsIDB4NWYxZDM2ZjEsXG4gICAgMHg1MTBlNTI3ZiwgMHhhZGU2ODJkMSxcbiAgICAweDliMDU2ODhjLCAweDJiM2U2YzFmLFxuICAgIDB4MWY4M2Q5YWIsIDB4ZmI0MWJkNmIsXG4gICAgMHg1YmUwY2QxOSwgMHgxMzdlMjE3OSBdO1xuICB0aGlzLmsgPSBzaGE1MTJfSztcbiAgdGhpcy5XID0gbmV3IEFycmF5KDE2MCk7XG59XG51dGlscy5pbmhlcml0cyhTSEE1MTIsIEJsb2NrSGFzaCk7XG5tb2R1bGUuZXhwb3J0cyA9IFNIQTUxMjtcblxuU0hBNTEyLmJsb2NrU2l6ZSA9IDEwMjQ7XG5TSEE1MTIub3V0U2l6ZSA9IDUxMjtcblNIQTUxMi5obWFjU3RyZW5ndGggPSAxOTI7XG5TSEE1MTIucGFkTGVuZ3RoID0gMTI4O1xuXG5TSEE1MTIucHJvdG90eXBlLl9wcmVwYXJlQmxvY2sgPSBmdW5jdGlvbiBfcHJlcGFyZUJsb2NrKG1zZywgc3RhcnQpIHtcbiAgdmFyIFcgPSB0aGlzLlc7XG5cbiAgLy8gMzIgeCAzMmJpdCB3b3Jkc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDMyOyBpKyspXG4gICAgV1tpXSA9IG1zZ1tzdGFydCArIGldO1xuICBmb3IgKDsgaSA8IFcubGVuZ3RoOyBpICs9IDIpIHtcbiAgICB2YXIgYzBfaGkgPSBnMV81MTJfaGkoV1tpIC0gNF0sIFdbaSAtIDNdKTsgIC8vIGkgLSAyXG4gICAgdmFyIGMwX2xvID0gZzFfNTEyX2xvKFdbaSAtIDRdLCBXW2kgLSAzXSk7XG4gICAgdmFyIGMxX2hpID0gV1tpIC0gMTRdOyAgLy8gaSAtIDdcbiAgICB2YXIgYzFfbG8gPSBXW2kgLSAxM107XG4gICAgdmFyIGMyX2hpID0gZzBfNTEyX2hpKFdbaSAtIDMwXSwgV1tpIC0gMjldKTsgIC8vIGkgLSAxNVxuICAgIHZhciBjMl9sbyA9IGcwXzUxMl9sbyhXW2kgLSAzMF0sIFdbaSAtIDI5XSk7XG4gICAgdmFyIGMzX2hpID0gV1tpIC0gMzJdOyAgLy8gaSAtIDE2XG4gICAgdmFyIGMzX2xvID0gV1tpIC0gMzFdO1xuXG4gICAgV1tpXSA9IHN1bTY0XzRfaGkoXG4gICAgICBjMF9oaSwgYzBfbG8sXG4gICAgICBjMV9oaSwgYzFfbG8sXG4gICAgICBjMl9oaSwgYzJfbG8sXG4gICAgICBjM19oaSwgYzNfbG8pO1xuICAgIFdbaSArIDFdID0gc3VtNjRfNF9sbyhcbiAgICAgIGMwX2hpLCBjMF9sbyxcbiAgICAgIGMxX2hpLCBjMV9sbyxcbiAgICAgIGMyX2hpLCBjMl9sbyxcbiAgICAgIGMzX2hpLCBjM19sbyk7XG4gIH1cbn07XG5cblNIQTUxMi5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIF91cGRhdGUobXNnLCBzdGFydCkge1xuICB0aGlzLl9wcmVwYXJlQmxvY2sobXNnLCBzdGFydCk7XG5cbiAgdmFyIFcgPSB0aGlzLlc7XG5cbiAgdmFyIGFoID0gdGhpcy5oWzBdO1xuICB2YXIgYWwgPSB0aGlzLmhbMV07XG4gIHZhciBiaCA9IHRoaXMuaFsyXTtcbiAgdmFyIGJsID0gdGhpcy5oWzNdO1xuICB2YXIgY2ggPSB0aGlzLmhbNF07XG4gIHZhciBjbCA9IHRoaXMuaFs1XTtcbiAgdmFyIGRoID0gdGhpcy5oWzZdO1xuICB2YXIgZGwgPSB0aGlzLmhbN107XG4gIHZhciBlaCA9IHRoaXMuaFs4XTtcbiAgdmFyIGVsID0gdGhpcy5oWzldO1xuICB2YXIgZmggPSB0aGlzLmhbMTBdO1xuICB2YXIgZmwgPSB0aGlzLmhbMTFdO1xuICB2YXIgZ2ggPSB0aGlzLmhbMTJdO1xuICB2YXIgZ2wgPSB0aGlzLmhbMTNdO1xuICB2YXIgaGggPSB0aGlzLmhbMTRdO1xuICB2YXIgaGwgPSB0aGlzLmhbMTVdO1xuXG4gIGFzc2VydCh0aGlzLmsubGVuZ3RoID09PSBXLmxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgVy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHZhciBjMF9oaSA9IGhoO1xuICAgIHZhciBjMF9sbyA9IGhsO1xuICAgIHZhciBjMV9oaSA9IHMxXzUxMl9oaShlaCwgZWwpO1xuICAgIHZhciBjMV9sbyA9IHMxXzUxMl9sbyhlaCwgZWwpO1xuICAgIHZhciBjMl9oaSA9IGNoNjRfaGkoZWgsIGVsLCBmaCwgZmwsIGdoLCBnbCk7XG4gICAgdmFyIGMyX2xvID0gY2g2NF9sbyhlaCwgZWwsIGZoLCBmbCwgZ2gsIGdsKTtcbiAgICB2YXIgYzNfaGkgPSB0aGlzLmtbaV07XG4gICAgdmFyIGMzX2xvID0gdGhpcy5rW2kgKyAxXTtcbiAgICB2YXIgYzRfaGkgPSBXW2ldO1xuICAgIHZhciBjNF9sbyA9IFdbaSArIDFdO1xuXG4gICAgdmFyIFQxX2hpID0gc3VtNjRfNV9oaShcbiAgICAgIGMwX2hpLCBjMF9sbyxcbiAgICAgIGMxX2hpLCBjMV9sbyxcbiAgICAgIGMyX2hpLCBjMl9sbyxcbiAgICAgIGMzX2hpLCBjM19sbyxcbiAgICAgIGM0X2hpLCBjNF9sbyk7XG4gICAgdmFyIFQxX2xvID0gc3VtNjRfNV9sbyhcbiAgICAgIGMwX2hpLCBjMF9sbyxcbiAgICAgIGMxX2hpLCBjMV9sbyxcbiAgICAgIGMyX2hpLCBjMl9sbyxcbiAgICAgIGMzX2hpLCBjM19sbyxcbiAgICAgIGM0X2hpLCBjNF9sbyk7XG5cbiAgICBjMF9oaSA9IHMwXzUxMl9oaShhaCwgYWwpO1xuICAgIGMwX2xvID0gczBfNTEyX2xvKGFoLCBhbCk7XG4gICAgYzFfaGkgPSBtYWo2NF9oaShhaCwgYWwsIGJoLCBibCwgY2gsIGNsKTtcbiAgICBjMV9sbyA9IG1hajY0X2xvKGFoLCBhbCwgYmgsIGJsLCBjaCwgY2wpO1xuXG4gICAgdmFyIFQyX2hpID0gc3VtNjRfaGkoYzBfaGksIGMwX2xvLCBjMV9oaSwgYzFfbG8pO1xuICAgIHZhciBUMl9sbyA9IHN1bTY0X2xvKGMwX2hpLCBjMF9sbywgYzFfaGksIGMxX2xvKTtcblxuICAgIGhoID0gZ2g7XG4gICAgaGwgPSBnbDtcblxuICAgIGdoID0gZmg7XG4gICAgZ2wgPSBmbDtcblxuICAgIGZoID0gZWg7XG4gICAgZmwgPSBlbDtcblxuICAgIGVoID0gc3VtNjRfaGkoZGgsIGRsLCBUMV9oaSwgVDFfbG8pO1xuICAgIGVsID0gc3VtNjRfbG8oZGwsIGRsLCBUMV9oaSwgVDFfbG8pO1xuXG4gICAgZGggPSBjaDtcbiAgICBkbCA9IGNsO1xuXG4gICAgY2ggPSBiaDtcbiAgICBjbCA9IGJsO1xuXG4gICAgYmggPSBhaDtcbiAgICBibCA9IGFsO1xuXG4gICAgYWggPSBzdW02NF9oaShUMV9oaSwgVDFfbG8sIFQyX2hpLCBUMl9sbyk7XG4gICAgYWwgPSBzdW02NF9sbyhUMV9oaSwgVDFfbG8sIFQyX2hpLCBUMl9sbyk7XG4gIH1cblxuICBzdW02NCh0aGlzLmgsIDAsIGFoLCBhbCk7XG4gIHN1bTY0KHRoaXMuaCwgMiwgYmgsIGJsKTtcbiAgc3VtNjQodGhpcy5oLCA0LCBjaCwgY2wpO1xuICBzdW02NCh0aGlzLmgsIDYsIGRoLCBkbCk7XG4gIHN1bTY0KHRoaXMuaCwgOCwgZWgsIGVsKTtcbiAgc3VtNjQodGhpcy5oLCAxMCwgZmgsIGZsKTtcbiAgc3VtNjQodGhpcy5oLCAxMiwgZ2gsIGdsKTtcbiAgc3VtNjQodGhpcy5oLCAxNCwgaGgsIGhsKTtcbn07XG5cblNIQTUxMi5wcm90b3R5cGUuX2RpZ2VzdCA9IGZ1bmN0aW9uIGRpZ2VzdChlbmMpIHtcbiAgaWYgKGVuYyA9PT0gJ2hleCcpXG4gICAgcmV0dXJuIHV0aWxzLnRvSGV4MzIodGhpcy5oLCAnYmlnJyk7XG4gIGVsc2VcbiAgICByZXR1cm4gdXRpbHMuc3BsaXQzMih0aGlzLmgsICdiaWcnKTtcbn07XG5cbmZ1bmN0aW9uIGNoNjRfaGkoeGgsIHhsLCB5aCwgeWwsIHpoKSB7XG4gIHZhciByID0gKHhoICYgeWgpIF4gKCh+eGgpICYgemgpO1xuICBpZiAociA8IDApXG4gICAgciArPSAweDEwMDAwMDAwMDtcbiAgcmV0dXJuIHI7XG59XG5cbmZ1bmN0aW9uIGNoNjRfbG8oeGgsIHhsLCB5aCwgeWwsIHpoLCB6bCkge1xuICB2YXIgciA9ICh4bCAmIHlsKSBeICgofnhsKSAmIHpsKTtcbiAgaWYgKHIgPCAwKVxuICAgIHIgKz0gMHgxMDAwMDAwMDA7XG4gIHJldHVybiByO1xufVxuXG5mdW5jdGlvbiBtYWo2NF9oaSh4aCwgeGwsIHloLCB5bCwgemgpIHtcbiAgdmFyIHIgPSAoeGggJiB5aCkgXiAoeGggJiB6aCkgXiAoeWggJiB6aCk7XG4gIGlmIChyIDwgMClcbiAgICByICs9IDB4MTAwMDAwMDAwO1xuICByZXR1cm4gcjtcbn1cblxuZnVuY3Rpb24gbWFqNjRfbG8oeGgsIHhsLCB5aCwgeWwsIHpoLCB6bCkge1xuICB2YXIgciA9ICh4bCAmIHlsKSBeICh4bCAmIHpsKSBeICh5bCAmIHpsKTtcbiAgaWYgKHIgPCAwKVxuICAgIHIgKz0gMHgxMDAwMDAwMDA7XG4gIHJldHVybiByO1xufVxuXG5mdW5jdGlvbiBzMF81MTJfaGkoeGgsIHhsKSB7XG4gIHZhciBjMF9oaSA9IHJvdHI2NF9oaSh4aCwgeGwsIDI4KTtcbiAgdmFyIGMxX2hpID0gcm90cjY0X2hpKHhsLCB4aCwgMik7ICAvLyAzNFxuICB2YXIgYzJfaGkgPSByb3RyNjRfaGkoeGwsIHhoLCA3KTsgIC8vIDM5XG5cbiAgdmFyIHIgPSBjMF9oaSBeIGMxX2hpIF4gYzJfaGk7XG4gIGlmIChyIDwgMClcbiAgICByICs9IDB4MTAwMDAwMDAwO1xuICByZXR1cm4gcjtcbn1cblxuZnVuY3Rpb24gczBfNTEyX2xvKHhoLCB4bCkge1xuICB2YXIgYzBfbG8gPSByb3RyNjRfbG8oeGgsIHhsLCAyOCk7XG4gIHZhciBjMV9sbyA9IHJvdHI2NF9sbyh4bCwgeGgsIDIpOyAgLy8gMzRcbiAgdmFyIGMyX2xvID0gcm90cjY0X2xvKHhsLCB4aCwgNyk7ICAvLyAzOVxuXG4gIHZhciByID0gYzBfbG8gXiBjMV9sbyBeIGMyX2xvO1xuICBpZiAociA8IDApXG4gICAgciArPSAweDEwMDAwMDAwMDtcbiAgcmV0dXJuIHI7XG59XG5cbmZ1bmN0aW9uIHMxXzUxMl9oaSh4aCwgeGwpIHtcbiAgdmFyIGMwX2hpID0gcm90cjY0X2hpKHhoLCB4bCwgMTQpO1xuICB2YXIgYzFfaGkgPSByb3RyNjRfaGkoeGgsIHhsLCAxOCk7XG4gIHZhciBjMl9oaSA9IHJvdHI2NF9oaSh4bCwgeGgsIDkpOyAgLy8gNDFcblxuICB2YXIgciA9IGMwX2hpIF4gYzFfaGkgXiBjMl9oaTtcbiAgaWYgKHIgPCAwKVxuICAgIHIgKz0gMHgxMDAwMDAwMDA7XG4gIHJldHVybiByO1xufVxuXG5mdW5jdGlvbiBzMV81MTJfbG8oeGgsIHhsKSB7XG4gIHZhciBjMF9sbyA9IHJvdHI2NF9sbyh4aCwgeGwsIDE0KTtcbiAgdmFyIGMxX2xvID0gcm90cjY0X2xvKHhoLCB4bCwgMTgpO1xuICB2YXIgYzJfbG8gPSByb3RyNjRfbG8oeGwsIHhoLCA5KTsgIC8vIDQxXG5cbiAgdmFyIHIgPSBjMF9sbyBeIGMxX2xvIF4gYzJfbG87XG4gIGlmIChyIDwgMClcbiAgICByICs9IDB4MTAwMDAwMDAwO1xuICByZXR1cm4gcjtcbn1cblxuZnVuY3Rpb24gZzBfNTEyX2hpKHhoLCB4bCkge1xuICB2YXIgYzBfaGkgPSByb3RyNjRfaGkoeGgsIHhsLCAxKTtcbiAgdmFyIGMxX2hpID0gcm90cjY0X2hpKHhoLCB4bCwgOCk7XG4gIHZhciBjMl9oaSA9IHNocjY0X2hpKHhoLCB4bCwgNyk7XG5cbiAgdmFyIHIgPSBjMF9oaSBeIGMxX2hpIF4gYzJfaGk7XG4gIGlmIChyIDwgMClcbiAgICByICs9IDB4MTAwMDAwMDAwO1xuICByZXR1cm4gcjtcbn1cblxuZnVuY3Rpb24gZzBfNTEyX2xvKHhoLCB4bCkge1xuICB2YXIgYzBfbG8gPSByb3RyNjRfbG8oeGgsIHhsLCAxKTtcbiAgdmFyIGMxX2xvID0gcm90cjY0X2xvKHhoLCB4bCwgOCk7XG4gIHZhciBjMl9sbyA9IHNocjY0X2xvKHhoLCB4bCwgNyk7XG5cbiAgdmFyIHIgPSBjMF9sbyBeIGMxX2xvIF4gYzJfbG87XG4gIGlmIChyIDwgMClcbiAgICByICs9IDB4MTAwMDAwMDAwO1xuICByZXR1cm4gcjtcbn1cblxuZnVuY3Rpb24gZzFfNTEyX2hpKHhoLCB4bCkge1xuICB2YXIgYzBfaGkgPSByb3RyNjRfaGkoeGgsIHhsLCAxOSk7XG4gIHZhciBjMV9oaSA9IHJvdHI2NF9oaSh4bCwgeGgsIDI5KTsgIC8vIDYxXG4gIHZhciBjMl9oaSA9IHNocjY0X2hpKHhoLCB4bCwgNik7XG5cbiAgdmFyIHIgPSBjMF9oaSBeIGMxX2hpIF4gYzJfaGk7XG4gIGlmIChyIDwgMClcbiAgICByICs9IDB4MTAwMDAwMDAwO1xuICByZXR1cm4gcjtcbn1cblxuZnVuY3Rpb24gZzFfNTEyX2xvKHhoLCB4bCkge1xuICB2YXIgYzBfbG8gPSByb3RyNjRfbG8oeGgsIHhsLCAxOSk7XG4gIHZhciBjMV9sbyA9IHJvdHI2NF9sbyh4bCwgeGgsIDI5KTsgIC8vIDYxXG4gIHZhciBjMl9sbyA9IHNocjY0X2xvKHhoLCB4bCwgNik7XG5cbiAgdmFyIHIgPSBjMF9sbyBeIGMxX2xvIF4gYzJfbG87XG4gIGlmIChyIDwgMClcbiAgICByICs9IDB4MTAwMDAwMDAwO1xuICByZXR1cm4gcjtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5cbnZhciByb3RsMzIgPSB1dGlscy5yb3RsMzI7XG52YXIgc3VtMzIgPSB1dGlscy5zdW0zMjtcbnZhciBzdW0zMl8zID0gdXRpbHMuc3VtMzJfMztcbnZhciBzdW0zMl80ID0gdXRpbHMuc3VtMzJfNDtcbnZhciBCbG9ja0hhc2ggPSBjb21tb24uQmxvY2tIYXNoO1xuXG5mdW5jdGlvbiBSSVBFTUQxNjAoKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSSVBFTUQxNjApKVxuICAgIHJldHVybiBuZXcgUklQRU1EMTYwKCk7XG5cbiAgQmxvY2tIYXNoLmNhbGwodGhpcyk7XG5cbiAgdGhpcy5oID0gWyAweDY3NDUyMzAxLCAweGVmY2RhYjg5LCAweDk4YmFkY2ZlLCAweDEwMzI1NDc2LCAweGMzZDJlMWYwIF07XG4gIHRoaXMuZW5kaWFuID0gJ2xpdHRsZSc7XG59XG51dGlscy5pbmhlcml0cyhSSVBFTUQxNjAsIEJsb2NrSGFzaCk7XG5leHBvcnRzLnJpcGVtZDE2MCA9IFJJUEVNRDE2MDtcblxuUklQRU1EMTYwLmJsb2NrU2l6ZSA9IDUxMjtcblJJUEVNRDE2MC5vdXRTaXplID0gMTYwO1xuUklQRU1EMTYwLmhtYWNTdHJlbmd0aCA9IDE5MjtcblJJUEVNRDE2MC5wYWRMZW5ndGggPSA2NDtcblxuUklQRU1EMTYwLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKG1zZywgc3RhcnQpIHtcbiAgdmFyIEEgPSB0aGlzLmhbMF07XG4gIHZhciBCID0gdGhpcy5oWzFdO1xuICB2YXIgQyA9IHRoaXMuaFsyXTtcbiAgdmFyIEQgPSB0aGlzLmhbM107XG4gIHZhciBFID0gdGhpcy5oWzRdO1xuICB2YXIgQWggPSBBO1xuICB2YXIgQmggPSBCO1xuICB2YXIgQ2ggPSBDO1xuICB2YXIgRGggPSBEO1xuICB2YXIgRWggPSBFO1xuICBmb3IgKHZhciBqID0gMDsgaiA8IDgwOyBqKyspIHtcbiAgICB2YXIgVCA9IHN1bTMyKFxuICAgICAgcm90bDMyKFxuICAgICAgICBzdW0zMl80KEEsIGYoaiwgQiwgQywgRCksIG1zZ1tyW2pdICsgc3RhcnRdLCBLKGopKSxcbiAgICAgICAgc1tqXSksXG4gICAgICBFKTtcbiAgICBBID0gRTtcbiAgICBFID0gRDtcbiAgICBEID0gcm90bDMyKEMsIDEwKTtcbiAgICBDID0gQjtcbiAgICBCID0gVDtcbiAgICBUID0gc3VtMzIoXG4gICAgICByb3RsMzIoXG4gICAgICAgIHN1bTMyXzQoQWgsIGYoNzkgLSBqLCBCaCwgQ2gsIERoKSwgbXNnW3JoW2pdICsgc3RhcnRdLCBLaChqKSksXG4gICAgICAgIHNoW2pdKSxcbiAgICAgIEVoKTtcbiAgICBBaCA9IEVoO1xuICAgIEVoID0gRGg7XG4gICAgRGggPSByb3RsMzIoQ2gsIDEwKTtcbiAgICBDaCA9IEJoO1xuICAgIEJoID0gVDtcbiAgfVxuICBUID0gc3VtMzJfMyh0aGlzLmhbMV0sIEMsIERoKTtcbiAgdGhpcy5oWzFdID0gc3VtMzJfMyh0aGlzLmhbMl0sIEQsIEVoKTtcbiAgdGhpcy5oWzJdID0gc3VtMzJfMyh0aGlzLmhbM10sIEUsIEFoKTtcbiAgdGhpcy5oWzNdID0gc3VtMzJfMyh0aGlzLmhbNF0sIEEsIEJoKTtcbiAgdGhpcy5oWzRdID0gc3VtMzJfMyh0aGlzLmhbMF0sIEIsIENoKTtcbiAgdGhpcy5oWzBdID0gVDtcbn07XG5cblJJUEVNRDE2MC5wcm90b3R5cGUuX2RpZ2VzdCA9IGZ1bmN0aW9uIGRpZ2VzdChlbmMpIHtcbiAgaWYgKGVuYyA9PT0gJ2hleCcpXG4gICAgcmV0dXJuIHV0aWxzLnRvSGV4MzIodGhpcy5oLCAnbGl0dGxlJyk7XG4gIGVsc2VcbiAgICByZXR1cm4gdXRpbHMuc3BsaXQzMih0aGlzLmgsICdsaXR0bGUnKTtcbn07XG5cbmZ1bmN0aW9uIGYoaiwgeCwgeSwgeikge1xuICBpZiAoaiA8PSAxNSlcbiAgICByZXR1cm4geCBeIHkgXiB6O1xuICBlbHNlIGlmIChqIDw9IDMxKVxuICAgIHJldHVybiAoeCAmIHkpIHwgKCh+eCkgJiB6KTtcbiAgZWxzZSBpZiAoaiA8PSA0NylcbiAgICByZXR1cm4gKHggfCAofnkpKSBeIHo7XG4gIGVsc2UgaWYgKGogPD0gNjMpXG4gICAgcmV0dXJuICh4ICYgeikgfCAoeSAmICh+eikpO1xuICBlbHNlXG4gICAgcmV0dXJuIHggXiAoeSB8ICh+eikpO1xufVxuXG5mdW5jdGlvbiBLKGopIHtcbiAgaWYgKGogPD0gMTUpXG4gICAgcmV0dXJuIDB4MDAwMDAwMDA7XG4gIGVsc2UgaWYgKGogPD0gMzEpXG4gICAgcmV0dXJuIDB4NWE4Mjc5OTk7XG4gIGVsc2UgaWYgKGogPD0gNDcpXG4gICAgcmV0dXJuIDB4NmVkOWViYTE7XG4gIGVsc2UgaWYgKGogPD0gNjMpXG4gICAgcmV0dXJuIDB4OGYxYmJjZGM7XG4gIGVsc2VcbiAgICByZXR1cm4gMHhhOTUzZmQ0ZTtcbn1cblxuZnVuY3Rpb24gS2goaikge1xuICBpZiAoaiA8PSAxNSlcbiAgICByZXR1cm4gMHg1MGEyOGJlNjtcbiAgZWxzZSBpZiAoaiA8PSAzMSlcbiAgICByZXR1cm4gMHg1YzRkZDEyNDtcbiAgZWxzZSBpZiAoaiA8PSA0NylcbiAgICByZXR1cm4gMHg2ZDcwM2VmMztcbiAgZWxzZSBpZiAoaiA8PSA2MylcbiAgICByZXR1cm4gMHg3YTZkNzZlOTtcbiAgZWxzZVxuICAgIHJldHVybiAweDAwMDAwMDAwO1xufVxuXG52YXIgciA9IFtcbiAgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSxcbiAgNywgNCwgMTMsIDEsIDEwLCA2LCAxNSwgMywgMTIsIDAsIDksIDUsIDIsIDE0LCAxMSwgOCxcbiAgMywgMTAsIDE0LCA0LCA5LCAxNSwgOCwgMSwgMiwgNywgMCwgNiwgMTMsIDExLCA1LCAxMixcbiAgMSwgOSwgMTEsIDEwLCAwLCA4LCAxMiwgNCwgMTMsIDMsIDcsIDE1LCAxNCwgNSwgNiwgMixcbiAgNCwgMCwgNSwgOSwgNywgMTIsIDIsIDEwLCAxNCwgMSwgMywgOCwgMTEsIDYsIDE1LCAxM1xuXTtcblxudmFyIHJoID0gW1xuICA1LCAxNCwgNywgMCwgOSwgMiwgMTEsIDQsIDEzLCA2LCAxNSwgOCwgMSwgMTAsIDMsIDEyLFxuICA2LCAxMSwgMywgNywgMCwgMTMsIDUsIDEwLCAxNCwgMTUsIDgsIDEyLCA0LCA5LCAxLCAyLFxuICAxNSwgNSwgMSwgMywgNywgMTQsIDYsIDksIDExLCA4LCAxMiwgMiwgMTAsIDAsIDQsIDEzLFxuICA4LCA2LCA0LCAxLCAzLCAxMSwgMTUsIDAsIDUsIDEyLCAyLCAxMywgOSwgNywgMTAsIDE0LFxuICAxMiwgMTUsIDEwLCA0LCAxLCA1LCA4LCA3LCA2LCAyLCAxMywgMTQsIDAsIDMsIDksIDExXG5dO1xuXG52YXIgcyA9IFtcbiAgMTEsIDE0LCAxNSwgMTIsIDUsIDgsIDcsIDksIDExLCAxMywgMTQsIDE1LCA2LCA3LCA5LCA4LFxuICA3LCA2LCA4LCAxMywgMTEsIDksIDcsIDE1LCA3LCAxMiwgMTUsIDksIDExLCA3LCAxMywgMTIsXG4gIDExLCAxMywgNiwgNywgMTQsIDksIDEzLCAxNSwgMTQsIDgsIDEzLCA2LCA1LCAxMiwgNywgNSxcbiAgMTEsIDEyLCAxNCwgMTUsIDE0LCAxNSwgOSwgOCwgOSwgMTQsIDUsIDYsIDgsIDYsIDUsIDEyLFxuICA5LCAxNSwgNSwgMTEsIDYsIDgsIDEzLCAxMiwgNSwgMTIsIDEzLCAxNCwgMTEsIDgsIDUsIDZcbl07XG5cbnZhciBzaCA9IFtcbiAgOCwgOSwgOSwgMTEsIDEzLCAxNSwgMTUsIDUsIDcsIDcsIDgsIDExLCAxNCwgMTQsIDEyLCA2LFxuICA5LCAxMywgMTUsIDcsIDEyLCA4LCA5LCAxMSwgNywgNywgMTIsIDcsIDYsIDE1LCAxMywgMTEsXG4gIDksIDcsIDE1LCAxMSwgOCwgNiwgNiwgMTQsIDEyLCAxMywgNSwgMTQsIDEzLCAxMywgNywgNSxcbiAgMTUsIDUsIDgsIDExLCAxNCwgMTQsIDYsIDE0LCA2LCA5LCAxMiwgOSwgMTIsIDUsIDE1LCA4LFxuICA4LCA1LCAxMiwgOSwgMTIsIDUsIDE0LCA2LCA4LCAxMywgNiwgNSwgMTUsIDEzLCAxMSwgMTFcbl07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCdtaW5pbWFsaXN0aWMtYXNzZXJ0Jyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLmluaGVyaXRzID0gaW5oZXJpdHM7XG5cbmZ1bmN0aW9uIGlzU3Vycm9nYXRlUGFpcihtc2csIGkpIHtcbiAgaWYgKChtc2cuY2hhckNvZGVBdChpKSAmIDB4RkMwMCkgIT09IDB4RDgwMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoaSA8IDAgfHwgaSArIDEgPj0gbXNnLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKG1zZy5jaGFyQ29kZUF0KGkgKyAxKSAmIDB4RkMwMCkgPT09IDB4REMwMDtcbn1cblxuZnVuY3Rpb24gdG9BcnJheShtc2csIGVuYykge1xuICBpZiAoQXJyYXkuaXNBcnJheShtc2cpKVxuICAgIHJldHVybiBtc2cuc2xpY2UoKTtcbiAgaWYgKCFtc2cpXG4gICAgcmV0dXJuIFtdO1xuICB2YXIgcmVzID0gW107XG4gIGlmICh0eXBlb2YgbXNnID09PSAnc3RyaW5nJykge1xuICAgIGlmICghZW5jKSB7XG4gICAgICAvLyBJbnNwaXJlZCBieSBzdHJpbmdUb1V0ZjhCeXRlQXJyYXkoKSBpbiBjbG9zdXJlLWxpYnJhcnkgYnkgR29vZ2xlXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtbGlicmFyeS9ibG9iLzg1OThkODcyNDJhZjU5YWFjMjMzMjcwNzQyYzg5ODRlMmIyYmRiZTAvY2xvc3VyZS9nb29nL2NyeXB0L2NyeXB0LmpzI0wxMTctTDE0M1xuICAgICAgLy8gQXBhY2hlIExpY2Vuc2UgMi4wXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtbGlicmFyeS9ibG9iL21hc3Rlci9MSUNFTlNFXG4gICAgICB2YXIgcCA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IG1zZy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoYyA8IDEyOCkge1xuICAgICAgICAgIHJlc1twKytdID0gYztcbiAgICAgICAgfSBlbHNlIGlmIChjIDwgMjA0OCkge1xuICAgICAgICAgIHJlc1twKytdID0gKGMgPj4gNikgfCAxOTI7XG4gICAgICAgICAgcmVzW3ArK10gPSAoYyAmIDYzKSB8IDEyODtcbiAgICAgICAgfSBlbHNlIGlmIChpc1N1cnJvZ2F0ZVBhaXIobXNnLCBpKSkge1xuICAgICAgICAgIGMgPSAweDEwMDAwICsgKChjICYgMHgwM0ZGKSA8PCAxMCkgKyAobXNnLmNoYXJDb2RlQXQoKytpKSAmIDB4MDNGRik7XG4gICAgICAgICAgcmVzW3ArK10gPSAoYyA+PiAxOCkgfCAyNDA7XG4gICAgICAgICAgcmVzW3ArK10gPSAoKGMgPj4gMTIpICYgNjMpIHwgMTI4O1xuICAgICAgICAgIHJlc1twKytdID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xuICAgICAgICAgIHJlc1twKytdID0gKGMgJiA2MykgfCAxMjg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzW3ArK10gPSAoYyA+PiAxMikgfCAyMjQ7XG4gICAgICAgICAgcmVzW3ArK10gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XG4gICAgICAgICAgcmVzW3ArK10gPSAoYyAmIDYzKSB8IDEyODtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZW5jID09PSAnaGV4Jykge1xuICAgICAgbXNnID0gbXNnLnJlcGxhY2UoL1teYS16MC05XSsvaWcsICcnKTtcbiAgICAgIGlmIChtc2cubGVuZ3RoICUgMiAhPT0gMClcbiAgICAgICAgbXNnID0gJzAnICsgbXNnO1xuICAgICAgZm9yIChpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkgKz0gMilcbiAgICAgICAgcmVzLnB1c2gocGFyc2VJbnQobXNnW2ldICsgbXNnW2kgKyAxXSwgMTYpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkrKylcbiAgICAgIHJlc1tpXSA9IG1zZ1tpXSB8IDA7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cbmV4cG9ydHMudG9BcnJheSA9IHRvQXJyYXk7XG5cbmZ1bmN0aW9uIHRvSGV4KG1zZykge1xuICB2YXIgcmVzID0gJyc7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLmxlbmd0aDsgaSsrKVxuICAgIHJlcyArPSB6ZXJvMihtc2dbaV0udG9TdHJpbmcoMTYpKTtcbiAgcmV0dXJuIHJlcztcbn1cbmV4cG9ydHMudG9IZXggPSB0b0hleDtcblxuZnVuY3Rpb24gaHRvbmwodykge1xuICB2YXIgcmVzID0gKHcgPj4+IDI0KSB8XG4gICAgICAgICAgICAoKHcgPj4+IDgpICYgMHhmZjAwKSB8XG4gICAgICAgICAgICAoKHcgPDwgOCkgJiAweGZmMDAwMCkgfFxuICAgICAgICAgICAgKCh3ICYgMHhmZikgPDwgMjQpO1xuICByZXR1cm4gcmVzID4+PiAwO1xufVxuZXhwb3J0cy5odG9ubCA9IGh0b25sO1xuXG5mdW5jdGlvbiB0b0hleDMyKG1zZywgZW5kaWFuKSB7XG4gIHZhciByZXMgPSAnJztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtc2cubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdyA9IG1zZ1tpXTtcbiAgICBpZiAoZW5kaWFuID09PSAnbGl0dGxlJylcbiAgICAgIHcgPSBodG9ubCh3KTtcbiAgICByZXMgKz0gemVybzgody50b1N0cmluZygxNikpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5leHBvcnRzLnRvSGV4MzIgPSB0b0hleDMyO1xuXG5mdW5jdGlvbiB6ZXJvMih3b3JkKSB7XG4gIGlmICh3b3JkLmxlbmd0aCA9PT0gMSlcbiAgICByZXR1cm4gJzAnICsgd29yZDtcbiAgZWxzZVxuICAgIHJldHVybiB3b3JkO1xufVxuZXhwb3J0cy56ZXJvMiA9IHplcm8yO1xuXG5mdW5jdGlvbiB6ZXJvOCh3b3JkKSB7XG4gIGlmICh3b3JkLmxlbmd0aCA9PT0gNylcbiAgICByZXR1cm4gJzAnICsgd29yZDtcbiAgZWxzZSBpZiAod29yZC5sZW5ndGggPT09IDYpXG4gICAgcmV0dXJuICcwMCcgKyB3b3JkO1xuICBlbHNlIGlmICh3b3JkLmxlbmd0aCA9PT0gNSlcbiAgICByZXR1cm4gJzAwMCcgKyB3b3JkO1xuICBlbHNlIGlmICh3b3JkLmxlbmd0aCA9PT0gNClcbiAgICByZXR1cm4gJzAwMDAnICsgd29yZDtcbiAgZWxzZSBpZiAod29yZC5sZW5ndGggPT09IDMpXG4gICAgcmV0dXJuICcwMDAwMCcgKyB3b3JkO1xuICBlbHNlIGlmICh3b3JkLmxlbmd0aCA9PT0gMilcbiAgICByZXR1cm4gJzAwMDAwMCcgKyB3b3JkO1xuICBlbHNlIGlmICh3b3JkLmxlbmd0aCA9PT0gMSlcbiAgICByZXR1cm4gJzAwMDAwMDAnICsgd29yZDtcbiAgZWxzZVxuICAgIHJldHVybiB3b3JkO1xufVxuZXhwb3J0cy56ZXJvOCA9IHplcm84O1xuXG5mdW5jdGlvbiBqb2luMzIobXNnLCBzdGFydCwgZW5kLCBlbmRpYW4pIHtcbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0O1xuICBhc3NlcnQobGVuICUgNCA9PT0gMCk7XG4gIHZhciByZXMgPSBuZXcgQXJyYXkobGVuIC8gNCk7XG4gIGZvciAodmFyIGkgPSAwLCBrID0gc3RhcnQ7IGkgPCByZXMubGVuZ3RoOyBpKyssIGsgKz0gNCkge1xuICAgIHZhciB3O1xuICAgIGlmIChlbmRpYW4gPT09ICdiaWcnKVxuICAgICAgdyA9IChtc2dba10gPDwgMjQpIHwgKG1zZ1trICsgMV0gPDwgMTYpIHwgKG1zZ1trICsgMl0gPDwgOCkgfCBtc2dbayArIDNdO1xuICAgIGVsc2VcbiAgICAgIHcgPSAobXNnW2sgKyAzXSA8PCAyNCkgfCAobXNnW2sgKyAyXSA8PCAxNikgfCAobXNnW2sgKyAxXSA8PCA4KSB8IG1zZ1trXTtcbiAgICByZXNbaV0gPSB3ID4+PiAwO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5leHBvcnRzLmpvaW4zMiA9IGpvaW4zMjtcblxuZnVuY3Rpb24gc3BsaXQzMihtc2csIGVuZGlhbikge1xuICB2YXIgcmVzID0gbmV3IEFycmF5KG1zZy5sZW5ndGggKiA0KTtcbiAgZm9yICh2YXIgaSA9IDAsIGsgPSAwOyBpIDwgbXNnLmxlbmd0aDsgaSsrLCBrICs9IDQpIHtcbiAgICB2YXIgbSA9IG1zZ1tpXTtcbiAgICBpZiAoZW5kaWFuID09PSAnYmlnJykge1xuICAgICAgcmVzW2tdID0gbSA+Pj4gMjQ7XG4gICAgICByZXNbayArIDFdID0gKG0gPj4+IDE2KSAmIDB4ZmY7XG4gICAgICByZXNbayArIDJdID0gKG0gPj4+IDgpICYgMHhmZjtcbiAgICAgIHJlc1trICsgM10gPSBtICYgMHhmZjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzW2sgKyAzXSA9IG0gPj4+IDI0O1xuICAgICAgcmVzW2sgKyAyXSA9IChtID4+PiAxNikgJiAweGZmO1xuICAgICAgcmVzW2sgKyAxXSA9IChtID4+PiA4KSAmIDB4ZmY7XG4gICAgICByZXNba10gPSBtICYgMHhmZjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cbmV4cG9ydHMuc3BsaXQzMiA9IHNwbGl0MzI7XG5cbmZ1bmN0aW9uIHJvdHIzMih3LCBiKSB7XG4gIHJldHVybiAodyA+Pj4gYikgfCAodyA8PCAoMzIgLSBiKSk7XG59XG5leHBvcnRzLnJvdHIzMiA9IHJvdHIzMjtcblxuZnVuY3Rpb24gcm90bDMyKHcsIGIpIHtcbiAgcmV0dXJuICh3IDw8IGIpIHwgKHcgPj4+ICgzMiAtIGIpKTtcbn1cbmV4cG9ydHMucm90bDMyID0gcm90bDMyO1xuXG5mdW5jdGlvbiBzdW0zMihhLCBiKSB7XG4gIHJldHVybiAoYSArIGIpID4+PiAwO1xufVxuZXhwb3J0cy5zdW0zMiA9IHN1bTMyO1xuXG5mdW5jdGlvbiBzdW0zMl8zKGEsIGIsIGMpIHtcbiAgcmV0dXJuIChhICsgYiArIGMpID4+PiAwO1xufVxuZXhwb3J0cy5zdW0zMl8zID0gc3VtMzJfMztcblxuZnVuY3Rpb24gc3VtMzJfNChhLCBiLCBjLCBkKSB7XG4gIHJldHVybiAoYSArIGIgKyBjICsgZCkgPj4+IDA7XG59XG5leHBvcnRzLnN1bTMyXzQgPSBzdW0zMl80O1xuXG5mdW5jdGlvbiBzdW0zMl81KGEsIGIsIGMsIGQsIGUpIHtcbiAgcmV0dXJuIChhICsgYiArIGMgKyBkICsgZSkgPj4+IDA7XG59XG5leHBvcnRzLnN1bTMyXzUgPSBzdW0zMl81O1xuXG5mdW5jdGlvbiBzdW02NChidWYsIHBvcywgYWgsIGFsKSB7XG4gIHZhciBiaCA9IGJ1Zltwb3NdO1xuICB2YXIgYmwgPSBidWZbcG9zICsgMV07XG5cbiAgdmFyIGxvID0gKGFsICsgYmwpID4+PiAwO1xuICB2YXIgaGkgPSAobG8gPCBhbCA/IDEgOiAwKSArIGFoICsgYmg7XG4gIGJ1Zltwb3NdID0gaGkgPj4+IDA7XG4gIGJ1Zltwb3MgKyAxXSA9IGxvO1xufVxuZXhwb3J0cy5zdW02NCA9IHN1bTY0O1xuXG5mdW5jdGlvbiBzdW02NF9oaShhaCwgYWwsIGJoLCBibCkge1xuICB2YXIgbG8gPSAoYWwgKyBibCkgPj4+IDA7XG4gIHZhciBoaSA9IChsbyA8IGFsID8gMSA6IDApICsgYWggKyBiaDtcbiAgcmV0dXJuIGhpID4+PiAwO1xufVxuZXhwb3J0cy5zdW02NF9oaSA9IHN1bTY0X2hpO1xuXG5mdW5jdGlvbiBzdW02NF9sbyhhaCwgYWwsIGJoLCBibCkge1xuICB2YXIgbG8gPSBhbCArIGJsO1xuICByZXR1cm4gbG8gPj4+IDA7XG59XG5leHBvcnRzLnN1bTY0X2xvID0gc3VtNjRfbG87XG5cbmZ1bmN0aW9uIHN1bTY0XzRfaGkoYWgsIGFsLCBiaCwgYmwsIGNoLCBjbCwgZGgsIGRsKSB7XG4gIHZhciBjYXJyeSA9IDA7XG4gIHZhciBsbyA9IGFsO1xuICBsbyA9IChsbyArIGJsKSA+Pj4gMDtcbiAgY2FycnkgKz0gbG8gPCBhbCA/IDEgOiAwO1xuICBsbyA9IChsbyArIGNsKSA+Pj4gMDtcbiAgY2FycnkgKz0gbG8gPCBjbCA/IDEgOiAwO1xuICBsbyA9IChsbyArIGRsKSA+Pj4gMDtcbiAgY2FycnkgKz0gbG8gPCBkbCA/IDEgOiAwO1xuXG4gIHZhciBoaSA9IGFoICsgYmggKyBjaCArIGRoICsgY2Fycnk7XG4gIHJldHVybiBoaSA+Pj4gMDtcbn1cbmV4cG9ydHMuc3VtNjRfNF9oaSA9IHN1bTY0XzRfaGk7XG5cbmZ1bmN0aW9uIHN1bTY0XzRfbG8oYWgsIGFsLCBiaCwgYmwsIGNoLCBjbCwgZGgsIGRsKSB7XG4gIHZhciBsbyA9IGFsICsgYmwgKyBjbCArIGRsO1xuICByZXR1cm4gbG8gPj4+IDA7XG59XG5leHBvcnRzLnN1bTY0XzRfbG8gPSBzdW02NF80X2xvO1xuXG5mdW5jdGlvbiBzdW02NF81X2hpKGFoLCBhbCwgYmgsIGJsLCBjaCwgY2wsIGRoLCBkbCwgZWgsIGVsKSB7XG4gIHZhciBjYXJyeSA9IDA7XG4gIHZhciBsbyA9IGFsO1xuICBsbyA9IChsbyArIGJsKSA+Pj4gMDtcbiAgY2FycnkgKz0gbG8gPCBhbCA/IDEgOiAwO1xuICBsbyA9IChsbyArIGNsKSA+Pj4gMDtcbiAgY2FycnkgKz0gbG8gPCBjbCA/IDEgOiAwO1xuICBsbyA9IChsbyArIGRsKSA+Pj4gMDtcbiAgY2FycnkgKz0gbG8gPCBkbCA/IDEgOiAwO1xuICBsbyA9IChsbyArIGVsKSA+Pj4gMDtcbiAgY2FycnkgKz0gbG8gPCBlbCA/IDEgOiAwO1xuXG4gIHZhciBoaSA9IGFoICsgYmggKyBjaCArIGRoICsgZWggKyBjYXJyeTtcbiAgcmV0dXJuIGhpID4+PiAwO1xufVxuZXhwb3J0cy5zdW02NF81X2hpID0gc3VtNjRfNV9oaTtcblxuZnVuY3Rpb24gc3VtNjRfNV9sbyhhaCwgYWwsIGJoLCBibCwgY2gsIGNsLCBkaCwgZGwsIGVoLCBlbCkge1xuICB2YXIgbG8gPSBhbCArIGJsICsgY2wgKyBkbCArIGVsO1xuXG4gIHJldHVybiBsbyA+Pj4gMDtcbn1cbmV4cG9ydHMuc3VtNjRfNV9sbyA9IHN1bTY0XzVfbG87XG5cbmZ1bmN0aW9uIHJvdHI2NF9oaShhaCwgYWwsIG51bSkge1xuICB2YXIgciA9IChhbCA8PCAoMzIgLSBudW0pKSB8IChhaCA+Pj4gbnVtKTtcbiAgcmV0dXJuIHIgPj4+IDA7XG59XG5leHBvcnRzLnJvdHI2NF9oaSA9IHJvdHI2NF9oaTtcblxuZnVuY3Rpb24gcm90cjY0X2xvKGFoLCBhbCwgbnVtKSB7XG4gIHZhciByID0gKGFoIDw8ICgzMiAtIG51bSkpIHwgKGFsID4+PiBudW0pO1xuICByZXR1cm4gciA+Pj4gMDtcbn1cbmV4cG9ydHMucm90cjY0X2xvID0gcm90cjY0X2xvO1xuXG5mdW5jdGlvbiBzaHI2NF9oaShhaCwgYWwsIG51bSkge1xuICByZXR1cm4gYWggPj4+IG51bTtcbn1cbmV4cG9ydHMuc2hyNjRfaGkgPSBzaHI2NF9oaTtcblxuZnVuY3Rpb24gc2hyNjRfbG8oYWgsIGFsLCBudW0pIHtcbiAgdmFyIHIgPSAoYWggPDwgKDMyIC0gbnVtKSkgfCAoYWwgPj4+IG51bSk7XG4gIHJldHVybiByID4+PiAwO1xufVxuZXhwb3J0cy5zaHI2NF9sbyA9IHNocjY0X2xvO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==