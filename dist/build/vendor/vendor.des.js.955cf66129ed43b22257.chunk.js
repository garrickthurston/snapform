(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.des.js"],{

/***/ "AYSA":
/*!***********************************************!*\
  !*** ./node_modules/des.js/lib/des/cipher.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assert = __webpack_require__(/*! minimalistic-assert */ "2j6C");

function Cipher(options) {
  this.options = options;

  this.type = this.options.type;
  this.blockSize = 8;
  this._init();

  this.buffer = new Array(this.blockSize);
  this.bufferOff = 0;
}
module.exports = Cipher;

Cipher.prototype._init = function _init() {
  // Might be overrided
};

Cipher.prototype.update = function update(data) {
  if (data.length === 0)
    return [];

  if (this.type === 'decrypt')
    return this._updateDecrypt(data);
  else
    return this._updateEncrypt(data);
};

Cipher.prototype._buffer = function _buffer(data, off) {
  // Append data to buffer
  var min = Math.min(this.buffer.length - this.bufferOff, data.length - off);
  for (var i = 0; i < min; i++)
    this.buffer[this.bufferOff + i] = data[off + i];
  this.bufferOff += min;

  // Shift next
  return min;
};

Cipher.prototype._flushBuffer = function _flushBuffer(out, off) {
  this._update(this.buffer, 0, out, off);
  this.bufferOff = 0;
  return this.blockSize;
};

Cipher.prototype._updateEncrypt = function _updateEncrypt(data) {
  var inputOff = 0;
  var outputOff = 0;

  var count = ((this.bufferOff + data.length) / this.blockSize) | 0;
  var out = new Array(count * this.blockSize);

  if (this.bufferOff !== 0) {
    inputOff += this._buffer(data, inputOff);

    if (this.bufferOff === this.buffer.length)
      outputOff += this._flushBuffer(out, outputOff);
  }

  // Write blocks
  var max = data.length - ((data.length - inputOff) % this.blockSize);
  for (; inputOff < max; inputOff += this.blockSize) {
    this._update(data, inputOff, out, outputOff);
    outputOff += this.blockSize;
  }

  // Queue rest
  for (; inputOff < data.length; inputOff++, this.bufferOff++)
    this.buffer[this.bufferOff] = data[inputOff];

  return out;
};

Cipher.prototype._updateDecrypt = function _updateDecrypt(data) {
  var inputOff = 0;
  var outputOff = 0;

  var count = Math.ceil((this.bufferOff + data.length) / this.blockSize) - 1;
  var out = new Array(count * this.blockSize);

  // TODO(indutny): optimize it, this is far from optimal
  for (; count > 0; count--) {
    inputOff += this._buffer(data, inputOff);
    outputOff += this._flushBuffer(out, outputOff);
  }

  // Buffer rest of the input
  inputOff += this._buffer(data, inputOff);

  return out;
};

Cipher.prototype.final = function final(buffer) {
  var first;
  if (buffer)
    first = this.update(buffer);

  var last;
  if (this.type === 'encrypt')
    last = this._finalEncrypt();
  else
    last = this._finalDecrypt();

  if (first)
    return first.concat(last);
  else
    return last;
};

Cipher.prototype._pad = function _pad(buffer, off) {
  if (off === 0)
    return false;

  while (off < buffer.length)
    buffer[off++] = 0;

  return true;
};

Cipher.prototype._finalEncrypt = function _finalEncrypt() {
  if (!this._pad(this.buffer, this.bufferOff))
    return [];

  var out = new Array(this.blockSize);
  this._update(this.buffer, 0, out, 0);
  return out;
};

Cipher.prototype._unpad = function _unpad(buffer) {
  return buffer;
};

Cipher.prototype._finalDecrypt = function _finalDecrypt() {
  assert.equal(this.bufferOff, this.blockSize, 'Not enough data to decrypt');
  var out = new Array(this.blockSize);
  this._flushBuffer(out, 0);

  return this._unpad(out);
};


/***/ }),

/***/ "DaRl":
/*!********************************************!*\
  !*** ./node_modules/des.js/lib/des/cbc.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assert = __webpack_require__(/*! minimalistic-assert */ "2j6C");
var inherits = __webpack_require__(/*! inherits */ "P7XM");

var proto = {};

function CBCState(iv) {
  assert.equal(iv.length, 8, 'Invalid IV length');

  this.iv = new Array(8);
  for (var i = 0; i < this.iv.length; i++)
    this.iv[i] = iv[i];
}

function instantiate(Base) {
  function CBC(options) {
    Base.call(this, options);
    this._cbcInit();
  }
  inherits(CBC, Base);

  var keys = Object.keys(proto);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    CBC.prototype[key] = proto[key];
  }

  CBC.create = function create(options) {
    return new CBC(options);
  };

  return CBC;
}

exports.instantiate = instantiate;

proto._cbcInit = function _cbcInit() {
  var state = new CBCState(this.options.iv);
  this._cbcState = state;
};

proto._update = function _update(inp, inOff, out, outOff) {
  var state = this._cbcState;
  var superProto = this.constructor.super_.prototype;

  var iv = state.iv;
  if (this.type === 'encrypt') {
    for (var i = 0; i < this.blockSize; i++)
      iv[i] ^= inp[inOff + i];

    superProto._update.call(this, iv, 0, out, outOff);

    for (var i = 0; i < this.blockSize; i++)
      iv[i] = out[outOff + i];
  } else {
    superProto._update.call(this, inp, inOff, out, outOff);

    for (var i = 0; i < this.blockSize; i++)
      out[outOff + i] ^= iv[i];

    for (var i = 0; i < this.blockSize; i++)
      iv[i] = inp[inOff + i];
  }
};


/***/ }),

/***/ "FUXG":
/*!****************************************!*\
  !*** ./node_modules/des.js/lib/des.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.utils = __webpack_require__(/*! ./des/utils */ "Xudb");
exports.Cipher = __webpack_require__(/*! ./des/cipher */ "AYSA");
exports.DES = __webpack_require__(/*! ./des/des */ "Titl");
exports.CBC = __webpack_require__(/*! ./des/cbc */ "DaRl");
exports.EDE = __webpack_require__(/*! ./des/ede */ "H+yo");


/***/ }),

/***/ "H+yo":
/*!********************************************!*\
  !*** ./node_modules/des.js/lib/des/ede.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assert = __webpack_require__(/*! minimalistic-assert */ "2j6C");
var inherits = __webpack_require__(/*! inherits */ "P7XM");

var des = __webpack_require__(/*! ../des */ "FUXG");
var Cipher = des.Cipher;
var DES = des.DES;

function EDEState(type, key) {
  assert.equal(key.length, 24, 'Invalid key length');

  var k1 = key.slice(0, 8);
  var k2 = key.slice(8, 16);
  var k3 = key.slice(16, 24);

  if (type === 'encrypt') {
    this.ciphers = [
      DES.create({ type: 'encrypt', key: k1 }),
      DES.create({ type: 'decrypt', key: k2 }),
      DES.create({ type: 'encrypt', key: k3 })
    ];
  } else {
    this.ciphers = [
      DES.create({ type: 'decrypt', key: k3 }),
      DES.create({ type: 'encrypt', key: k2 }),
      DES.create({ type: 'decrypt', key: k1 })
    ];
  }
}

function EDE(options) {
  Cipher.call(this, options);

  var state = new EDEState(this.type, this.options.key);
  this._edeState = state;
}
inherits(EDE, Cipher);

module.exports = EDE;

EDE.create = function create(options) {
  return new EDE(options);
};

EDE.prototype._update = function _update(inp, inOff, out, outOff) {
  var state = this._edeState;

  state.ciphers[0]._update(inp, inOff, out, outOff);
  state.ciphers[1]._update(out, outOff, out, outOff);
  state.ciphers[2]._update(out, outOff, out, outOff);
};

EDE.prototype._pad = DES.prototype._pad;
EDE.prototype._unpad = DES.prototype._unpad;


/***/ }),

/***/ "Titl":
/*!********************************************!*\
  !*** ./node_modules/des.js/lib/des/des.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assert = __webpack_require__(/*! minimalistic-assert */ "2j6C");
var inherits = __webpack_require__(/*! inherits */ "P7XM");

var des = __webpack_require__(/*! ../des */ "FUXG");
var utils = des.utils;
var Cipher = des.Cipher;

function DESState() {
  this.tmp = new Array(2);
  this.keys = null;
}

function DES(options) {
  Cipher.call(this, options);

  var state = new DESState();
  this._desState = state;

  this.deriveKeys(state, options.key);
}
inherits(DES, Cipher);
module.exports = DES;

DES.create = function create(options) {
  return new DES(options);
};

var shiftTable = [
  1, 1, 2, 2, 2, 2, 2, 2,
  1, 2, 2, 2, 2, 2, 2, 1
];

DES.prototype.deriveKeys = function deriveKeys(state, key) {
  state.keys = new Array(16 * 2);

  assert.equal(key.length, this.blockSize, 'Invalid key length');

  var kL = utils.readUInt32BE(key, 0);
  var kR = utils.readUInt32BE(key, 4);

  utils.pc1(kL, kR, state.tmp, 0);
  kL = state.tmp[0];
  kR = state.tmp[1];
  for (var i = 0; i < state.keys.length; i += 2) {
    var shift = shiftTable[i >>> 1];
    kL = utils.r28shl(kL, shift);
    kR = utils.r28shl(kR, shift);
    utils.pc2(kL, kR, state.keys, i);
  }
};

DES.prototype._update = function _update(inp, inOff, out, outOff) {
  var state = this._desState;

  var l = utils.readUInt32BE(inp, inOff);
  var r = utils.readUInt32BE(inp, inOff + 4);

  // Initial Permutation
  utils.ip(l, r, state.tmp, 0);
  l = state.tmp[0];
  r = state.tmp[1];

  if (this.type === 'encrypt')
    this._encrypt(state, l, r, state.tmp, 0);
  else
    this._decrypt(state, l, r, state.tmp, 0);

  l = state.tmp[0];
  r = state.tmp[1];

  utils.writeUInt32BE(out, l, outOff);
  utils.writeUInt32BE(out, r, outOff + 4);
};

DES.prototype._pad = function _pad(buffer, off) {
  var value = buffer.length - off;
  for (var i = off; i < buffer.length; i++)
    buffer[i] = value;

  return true;
};

DES.prototype._unpad = function _unpad(buffer) {
  var pad = buffer[buffer.length - 1];
  for (var i = buffer.length - pad; i < buffer.length; i++)
    assert.equal(buffer[i], pad);

  return buffer.slice(0, buffer.length - pad);
};

DES.prototype._encrypt = function _encrypt(state, lStart, rStart, out, off) {
  var l = lStart;
  var r = rStart;

  // Apply f() x16 times
  for (var i = 0; i < state.keys.length; i += 2) {
    var keyL = state.keys[i];
    var keyR = state.keys[i + 1];

    // f(r, k)
    utils.expand(r, state.tmp, 0);

    keyL ^= state.tmp[0];
    keyR ^= state.tmp[1];
    var s = utils.substitute(keyL, keyR);
    var f = utils.permute(s);

    var t = r;
    r = (l ^ f) >>> 0;
    l = t;
  }

  // Reverse Initial Permutation
  utils.rip(r, l, out, off);
};

DES.prototype._decrypt = function _decrypt(state, lStart, rStart, out, off) {
  var l = rStart;
  var r = lStart;

  // Apply f() x16 times
  for (var i = state.keys.length - 2; i >= 0; i -= 2) {
    var keyL = state.keys[i];
    var keyR = state.keys[i + 1];

    // f(r, k)
    utils.expand(l, state.tmp, 0);

    keyL ^= state.tmp[0];
    keyR ^= state.tmp[1];
    var s = utils.substitute(keyL, keyR);
    var f = utils.permute(s);

    var t = l;
    l = (r ^ f) >>> 0;
    r = t;
  }

  // Reverse Initial Permutation
  utils.rip(l, r, out, off);
};


/***/ }),

/***/ "Xudb":
/*!**********************************************!*\
  !*** ./node_modules/des.js/lib/des/utils.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.readUInt32BE = function readUInt32BE(bytes, off) {
  var res =  (bytes[0 + off] << 24) |
             (bytes[1 + off] << 16) |
             (bytes[2 + off] << 8) |
             bytes[3 + off];
  return res >>> 0;
};

exports.writeUInt32BE = function writeUInt32BE(bytes, value, off) {
  bytes[0 + off] = value >>> 24;
  bytes[1 + off] = (value >>> 16) & 0xff;
  bytes[2 + off] = (value >>> 8) & 0xff;
  bytes[3 + off] = value & 0xff;
};

exports.ip = function ip(inL, inR, out, off) {
  var outL = 0;
  var outR = 0;

  for (var i = 6; i >= 0; i -= 2) {
    for (var j = 0; j <= 24; j += 8) {
      outL <<= 1;
      outL |= (inR >>> (j + i)) & 1;
    }
    for (var j = 0; j <= 24; j += 8) {
      outL <<= 1;
      outL |= (inL >>> (j + i)) & 1;
    }
  }

  for (var i = 6; i >= 0; i -= 2) {
    for (var j = 1; j <= 25; j += 8) {
      outR <<= 1;
      outR |= (inR >>> (j + i)) & 1;
    }
    for (var j = 1; j <= 25; j += 8) {
      outR <<= 1;
      outR |= (inL >>> (j + i)) & 1;
    }
  }

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

exports.rip = function rip(inL, inR, out, off) {
  var outL = 0;
  var outR = 0;

  for (var i = 0; i < 4; i++) {
    for (var j = 24; j >= 0; j -= 8) {
      outL <<= 1;
      outL |= (inR >>> (j + i)) & 1;
      outL <<= 1;
      outL |= (inL >>> (j + i)) & 1;
    }
  }
  for (var i = 4; i < 8; i++) {
    for (var j = 24; j >= 0; j -= 8) {
      outR <<= 1;
      outR |= (inR >>> (j + i)) & 1;
      outR <<= 1;
      outR |= (inL >>> (j + i)) & 1;
    }
  }

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

exports.pc1 = function pc1(inL, inR, out, off) {
  var outL = 0;
  var outR = 0;

  // 7, 15, 23, 31, 39, 47, 55, 63
  // 6, 14, 22, 30, 39, 47, 55, 63
  // 5, 13, 21, 29, 39, 47, 55, 63
  // 4, 12, 20, 28
  for (var i = 7; i >= 5; i--) {
    for (var j = 0; j <= 24; j += 8) {
      outL <<= 1;
      outL |= (inR >> (j + i)) & 1;
    }
    for (var j = 0; j <= 24; j += 8) {
      outL <<= 1;
      outL |= (inL >> (j + i)) & 1;
    }
  }
  for (var j = 0; j <= 24; j += 8) {
    outL <<= 1;
    outL |= (inR >> (j + i)) & 1;
  }

  // 1, 9, 17, 25, 33, 41, 49, 57
  // 2, 10, 18, 26, 34, 42, 50, 58
  // 3, 11, 19, 27, 35, 43, 51, 59
  // 36, 44, 52, 60
  for (var i = 1; i <= 3; i++) {
    for (var j = 0; j <= 24; j += 8) {
      outR <<= 1;
      outR |= (inR >> (j + i)) & 1;
    }
    for (var j = 0; j <= 24; j += 8) {
      outR <<= 1;
      outR |= (inL >> (j + i)) & 1;
    }
  }
  for (var j = 0; j <= 24; j += 8) {
    outR <<= 1;
    outR |= (inL >> (j + i)) & 1;
  }

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

exports.r28shl = function r28shl(num, shift) {
  return ((num << shift) & 0xfffffff) | (num >>> (28 - shift));
};

var pc2table = [
  // inL => outL
  14, 11, 17, 4, 27, 23, 25, 0,
  13, 22, 7, 18, 5, 9, 16, 24,
  2, 20, 12, 21, 1, 8, 15, 26,

  // inR => outR
  15, 4, 25, 19, 9, 1, 26, 16,
  5, 11, 23, 8, 12, 7, 17, 0,
  22, 3, 10, 14, 6, 20, 27, 24
];

exports.pc2 = function pc2(inL, inR, out, off) {
  var outL = 0;
  var outR = 0;

  var len = pc2table.length >>> 1;
  for (var i = 0; i < len; i++) {
    outL <<= 1;
    outL |= (inL >>> pc2table[i]) & 0x1;
  }
  for (var i = len; i < pc2table.length; i++) {
    outR <<= 1;
    outR |= (inR >>> pc2table[i]) & 0x1;
  }

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

exports.expand = function expand(r, out, off) {
  var outL = 0;
  var outR = 0;

  outL = ((r & 1) << 5) | (r >>> 27);
  for (var i = 23; i >= 15; i -= 4) {
    outL <<= 6;
    outL |= (r >>> i) & 0x3f;
  }
  for (var i = 11; i >= 3; i -= 4) {
    outR |= (r >>> i) & 0x3f;
    outR <<= 6;
  }
  outR |= ((r & 0x1f) << 1) | (r >>> 31);

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

var sTable = [
  14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1,
  3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8,
  4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7,
  15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13,

  15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14,
  9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5,
  0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2,
  5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9,

  10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10,
  1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1,
  13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7,
  11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12,

  7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3,
  1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9,
  10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8,
  15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14,

  2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1,
  8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6,
  4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13,
  15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3,

  12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5,
  0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8,
  9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10,
  7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13,

  4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10,
  3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6,
  1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7,
  10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12,

  13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4,
  10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2,
  7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13,
  0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11
];

exports.substitute = function substitute(inL, inR) {
  var out = 0;
  for (var i = 0; i < 4; i++) {
    var b = (inL >>> (18 - i * 6)) & 0x3f;
    var sb = sTable[i * 0x40 + b];

    out <<= 4;
    out |= sb;
  }
  for (var i = 0; i < 4; i++) {
    var b = (inR >>> (18 - i * 6)) & 0x3f;
    var sb = sTable[4 * 0x40 + i * 0x40 + b];

    out <<= 4;
    out |= sb;
  }
  return out >>> 0;
};

var permuteTable = [
  16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22,
  30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7
];

exports.permute = function permute(num) {
  var out = 0;
  for (var i = 0; i < permuteTable.length; i++) {
    out <<= 1;
    out |= (num >>> permuteTable[i]) & 0x1;
  }
  return out >>> 0;
};

exports.padSplit = function padSplit(num, size, group) {
  var str = num.toString(2);
  while (str.length < size)
    str = '0' + str;

  var out = [];
  for (var i = 0; i < size; i += group)
    out.push(str.slice(i, i + group));
  return out.join(' ');
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVzLmpzL2xpYi9kZXMvY2lwaGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9kZXMuanMvbGliL2Rlcy9jYmMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Rlcy5qcy9saWIvZGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9kZXMuanMvbGliL2Rlcy9lZGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Rlcy5qcy9saWIvZGVzL2Rlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVzLmpzL2xpYi9kZXMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhOztBQUViLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBcUI7O0FBRTFDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsU0FBUztBQUMxQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRLGdCQUFnQjtBQUN4QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLHdCQUF3QjtBQUNoQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsUUFBUSxXQUFXO0FBQ25CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7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QkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLFNBQVM7QUFDM0I7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFFBQVE7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQix5QkFBeUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixVQUFVO0FBQzNCO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmRlcy5qcy45NTVjZjY2MTI5ZWQ0M2IyMjI1Ny5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdtaW5pbWFsaXN0aWMtYXNzZXJ0Jyk7XHJcblxyXG5mdW5jdGlvbiBDaXBoZXIob3B0aW9ucykge1xyXG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG4gIHRoaXMudHlwZSA9IHRoaXMub3B0aW9ucy50eXBlO1xyXG4gIHRoaXMuYmxvY2tTaXplID0gODtcclxuICB0aGlzLl9pbml0KCk7XHJcblxyXG4gIHRoaXMuYnVmZmVyID0gbmV3IEFycmF5KHRoaXMuYmxvY2tTaXplKTtcclxuICB0aGlzLmJ1ZmZlck9mZiA9IDA7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBDaXBoZXI7XHJcblxyXG5DaXBoZXIucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24gX2luaXQoKSB7XHJcbiAgLy8gTWlnaHQgYmUgb3ZlcnJpZGVkXHJcbn07XHJcblxyXG5DaXBoZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZShkYXRhKSB7XHJcbiAgaWYgKGRhdGEubGVuZ3RoID09PSAwKVxyXG4gICAgcmV0dXJuIFtdO1xyXG5cclxuICBpZiAodGhpcy50eXBlID09PSAnZGVjcnlwdCcpXHJcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlRGVjcnlwdChkYXRhKTtcclxuICBlbHNlXHJcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlRW5jcnlwdChkYXRhKTtcclxufTtcclxuXHJcbkNpcGhlci5wcm90b3R5cGUuX2J1ZmZlciA9IGZ1bmN0aW9uIF9idWZmZXIoZGF0YSwgb2ZmKSB7XHJcbiAgLy8gQXBwZW5kIGRhdGEgdG8gYnVmZmVyXHJcbiAgdmFyIG1pbiA9IE1hdGgubWluKHRoaXMuYnVmZmVyLmxlbmd0aCAtIHRoaXMuYnVmZmVyT2ZmLCBkYXRhLmxlbmd0aCAtIG9mZik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtaW47IGkrKylcclxuICAgIHRoaXMuYnVmZmVyW3RoaXMuYnVmZmVyT2ZmICsgaV0gPSBkYXRhW29mZiArIGldO1xyXG4gIHRoaXMuYnVmZmVyT2ZmICs9IG1pbjtcclxuXHJcbiAgLy8gU2hpZnQgbmV4dFxyXG4gIHJldHVybiBtaW47XHJcbn07XHJcblxyXG5DaXBoZXIucHJvdG90eXBlLl9mbHVzaEJ1ZmZlciA9IGZ1bmN0aW9uIF9mbHVzaEJ1ZmZlcihvdXQsIG9mZikge1xyXG4gIHRoaXMuX3VwZGF0ZSh0aGlzLmJ1ZmZlciwgMCwgb3V0LCBvZmYpO1xyXG4gIHRoaXMuYnVmZmVyT2ZmID0gMDtcclxuICByZXR1cm4gdGhpcy5ibG9ja1NpemU7XHJcbn07XHJcblxyXG5DaXBoZXIucHJvdG90eXBlLl91cGRhdGVFbmNyeXB0ID0gZnVuY3Rpb24gX3VwZGF0ZUVuY3J5cHQoZGF0YSkge1xyXG4gIHZhciBpbnB1dE9mZiA9IDA7XHJcbiAgdmFyIG91dHB1dE9mZiA9IDA7XHJcblxyXG4gIHZhciBjb3VudCA9ICgodGhpcy5idWZmZXJPZmYgKyBkYXRhLmxlbmd0aCkgLyB0aGlzLmJsb2NrU2l6ZSkgfCAwO1xyXG4gIHZhciBvdXQgPSBuZXcgQXJyYXkoY291bnQgKiB0aGlzLmJsb2NrU2l6ZSk7XHJcblxyXG4gIGlmICh0aGlzLmJ1ZmZlck9mZiAhPT0gMCkge1xyXG4gICAgaW5wdXRPZmYgKz0gdGhpcy5fYnVmZmVyKGRhdGEsIGlucHV0T2ZmKTtcclxuXHJcbiAgICBpZiAodGhpcy5idWZmZXJPZmYgPT09IHRoaXMuYnVmZmVyLmxlbmd0aClcclxuICAgICAgb3V0cHV0T2ZmICs9IHRoaXMuX2ZsdXNoQnVmZmVyKG91dCwgb3V0cHV0T2ZmKTtcclxuICB9XHJcblxyXG4gIC8vIFdyaXRlIGJsb2Nrc1xyXG4gIHZhciBtYXggPSBkYXRhLmxlbmd0aCAtICgoZGF0YS5sZW5ndGggLSBpbnB1dE9mZikgJSB0aGlzLmJsb2NrU2l6ZSk7XHJcbiAgZm9yICg7IGlucHV0T2ZmIDwgbWF4OyBpbnB1dE9mZiArPSB0aGlzLmJsb2NrU2l6ZSkge1xyXG4gICAgdGhpcy5fdXBkYXRlKGRhdGEsIGlucHV0T2ZmLCBvdXQsIG91dHB1dE9mZik7XHJcbiAgICBvdXRwdXRPZmYgKz0gdGhpcy5ibG9ja1NpemU7XHJcbiAgfVxyXG5cclxuICAvLyBRdWV1ZSByZXN0XHJcbiAgZm9yICg7IGlucHV0T2ZmIDwgZGF0YS5sZW5ndGg7IGlucHV0T2ZmKyssIHRoaXMuYnVmZmVyT2ZmKyspXHJcbiAgICB0aGlzLmJ1ZmZlclt0aGlzLmJ1ZmZlck9mZl0gPSBkYXRhW2lucHV0T2ZmXTtcclxuXHJcbiAgcmV0dXJuIG91dDtcclxufTtcclxuXHJcbkNpcGhlci5wcm90b3R5cGUuX3VwZGF0ZURlY3J5cHQgPSBmdW5jdGlvbiBfdXBkYXRlRGVjcnlwdChkYXRhKSB7XHJcbiAgdmFyIGlucHV0T2ZmID0gMDtcclxuICB2YXIgb3V0cHV0T2ZmID0gMDtcclxuXHJcbiAgdmFyIGNvdW50ID0gTWF0aC5jZWlsKCh0aGlzLmJ1ZmZlck9mZiArIGRhdGEubGVuZ3RoKSAvIHRoaXMuYmxvY2tTaXplKSAtIDE7XHJcbiAgdmFyIG91dCA9IG5ldyBBcnJheShjb3VudCAqIHRoaXMuYmxvY2tTaXplKTtcclxuXHJcbiAgLy8gVE9ETyhpbmR1dG55KTogb3B0aW1pemUgaXQsIHRoaXMgaXMgZmFyIGZyb20gb3B0aW1hbFxyXG4gIGZvciAoOyBjb3VudCA+IDA7IGNvdW50LS0pIHtcclxuICAgIGlucHV0T2ZmICs9IHRoaXMuX2J1ZmZlcihkYXRhLCBpbnB1dE9mZik7XHJcbiAgICBvdXRwdXRPZmYgKz0gdGhpcy5fZmx1c2hCdWZmZXIob3V0LCBvdXRwdXRPZmYpO1xyXG4gIH1cclxuXHJcbiAgLy8gQnVmZmVyIHJlc3Qgb2YgdGhlIGlucHV0XHJcbiAgaW5wdXRPZmYgKz0gdGhpcy5fYnVmZmVyKGRhdGEsIGlucHV0T2ZmKTtcclxuXHJcbiAgcmV0dXJuIG91dDtcclxufTtcclxuXHJcbkNpcGhlci5wcm90b3R5cGUuZmluYWwgPSBmdW5jdGlvbiBmaW5hbChidWZmZXIpIHtcclxuICB2YXIgZmlyc3Q7XHJcbiAgaWYgKGJ1ZmZlcilcclxuICAgIGZpcnN0ID0gdGhpcy51cGRhdGUoYnVmZmVyKTtcclxuXHJcbiAgdmFyIGxhc3Q7XHJcbiAgaWYgKHRoaXMudHlwZSA9PT0gJ2VuY3J5cHQnKVxyXG4gICAgbGFzdCA9IHRoaXMuX2ZpbmFsRW5jcnlwdCgpO1xyXG4gIGVsc2VcclxuICAgIGxhc3QgPSB0aGlzLl9maW5hbERlY3J5cHQoKTtcclxuXHJcbiAgaWYgKGZpcnN0KVxyXG4gICAgcmV0dXJuIGZpcnN0LmNvbmNhdChsYXN0KTtcclxuICBlbHNlXHJcbiAgICByZXR1cm4gbGFzdDtcclxufTtcclxuXHJcbkNpcGhlci5wcm90b3R5cGUuX3BhZCA9IGZ1bmN0aW9uIF9wYWQoYnVmZmVyLCBvZmYpIHtcclxuICBpZiAob2ZmID09PSAwKVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICB3aGlsZSAob2ZmIDwgYnVmZmVyLmxlbmd0aClcclxuICAgIGJ1ZmZlcltvZmYrK10gPSAwO1xyXG5cclxuICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbkNpcGhlci5wcm90b3R5cGUuX2ZpbmFsRW5jcnlwdCA9IGZ1bmN0aW9uIF9maW5hbEVuY3J5cHQoKSB7XHJcbiAgaWYgKCF0aGlzLl9wYWQodGhpcy5idWZmZXIsIHRoaXMuYnVmZmVyT2ZmKSlcclxuICAgIHJldHVybiBbXTtcclxuXHJcbiAgdmFyIG91dCA9IG5ldyBBcnJheSh0aGlzLmJsb2NrU2l6ZSk7XHJcbiAgdGhpcy5fdXBkYXRlKHRoaXMuYnVmZmVyLCAwLCBvdXQsIDApO1xyXG4gIHJldHVybiBvdXQ7XHJcbn07XHJcblxyXG5DaXBoZXIucHJvdG90eXBlLl91bnBhZCA9IGZ1bmN0aW9uIF91bnBhZChidWZmZXIpIHtcclxuICByZXR1cm4gYnVmZmVyO1xyXG59O1xyXG5cclxuQ2lwaGVyLnByb3RvdHlwZS5fZmluYWxEZWNyeXB0ID0gZnVuY3Rpb24gX2ZpbmFsRGVjcnlwdCgpIHtcclxuICBhc3NlcnQuZXF1YWwodGhpcy5idWZmZXJPZmYsIHRoaXMuYmxvY2tTaXplLCAnTm90IGVub3VnaCBkYXRhIHRvIGRlY3J5cHQnKTtcclxuICB2YXIgb3V0ID0gbmV3IEFycmF5KHRoaXMuYmxvY2tTaXplKTtcclxuICB0aGlzLl9mbHVzaEJ1ZmZlcihvdXQsIDApO1xyXG5cclxuICByZXR1cm4gdGhpcy5fdW5wYWQob3V0KTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ21pbmltYWxpc3RpYy1hc3NlcnQnKTtcclxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcclxuXHJcbnZhciBwcm90byA9IHt9O1xyXG5cclxuZnVuY3Rpb24gQ0JDU3RhdGUoaXYpIHtcclxuICBhc3NlcnQuZXF1YWwoaXYubGVuZ3RoLCA4LCAnSW52YWxpZCBJViBsZW5ndGgnKTtcclxuXHJcbiAgdGhpcy5pdiA9IG5ldyBBcnJheSg4KTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXYubGVuZ3RoOyBpKyspXHJcbiAgICB0aGlzLml2W2ldID0gaXZbaV07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluc3RhbnRpYXRlKEJhc2UpIHtcclxuICBmdW5jdGlvbiBDQkMob3B0aW9ucykge1xyXG4gICAgQmFzZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgdGhpcy5fY2JjSW5pdCgpO1xyXG4gIH1cclxuICBpbmhlcml0cyhDQkMsIEJhc2UpO1xyXG5cclxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHByb3RvKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xyXG4gICAgQ0JDLnByb3RvdHlwZVtrZXldID0gcHJvdG9ba2V5XTtcclxuICB9XHJcblxyXG4gIENCQy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUob3B0aW9ucykge1xyXG4gICAgcmV0dXJuIG5ldyBDQkMob3B0aW9ucyk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIENCQztcclxufVxyXG5cclxuZXhwb3J0cy5pbnN0YW50aWF0ZSA9IGluc3RhbnRpYXRlO1xyXG5cclxucHJvdG8uX2NiY0luaXQgPSBmdW5jdGlvbiBfY2JjSW5pdCgpIHtcclxuICB2YXIgc3RhdGUgPSBuZXcgQ0JDU3RhdGUodGhpcy5vcHRpb25zLml2KTtcclxuICB0aGlzLl9jYmNTdGF0ZSA9IHN0YXRlO1xyXG59O1xyXG5cclxucHJvdG8uX3VwZGF0ZSA9IGZ1bmN0aW9uIF91cGRhdGUoaW5wLCBpbk9mZiwgb3V0LCBvdXRPZmYpIHtcclxuICB2YXIgc3RhdGUgPSB0aGlzLl9jYmNTdGF0ZTtcclxuICB2YXIgc3VwZXJQcm90byA9IHRoaXMuY29uc3RydWN0b3Iuc3VwZXJfLnByb3RvdHlwZTtcclxuXHJcbiAgdmFyIGl2ID0gc3RhdGUuaXY7XHJcbiAgaWYgKHRoaXMudHlwZSA9PT0gJ2VuY3J5cHQnKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxvY2tTaXplOyBpKyspXHJcbiAgICAgIGl2W2ldIF49IGlucFtpbk9mZiArIGldO1xyXG5cclxuICAgIHN1cGVyUHJvdG8uX3VwZGF0ZS5jYWxsKHRoaXMsIGl2LCAwLCBvdXQsIG91dE9mZik7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsb2NrU2l6ZTsgaSsrKVxyXG4gICAgICBpdltpXSA9IG91dFtvdXRPZmYgKyBpXTtcclxuICB9IGVsc2Uge1xyXG4gICAgc3VwZXJQcm90by5fdXBkYXRlLmNhbGwodGhpcywgaW5wLCBpbk9mZiwgb3V0LCBvdXRPZmYpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja1NpemU7IGkrKylcclxuICAgICAgb3V0W291dE9mZiArIGldIF49IGl2W2ldO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja1NpemU7IGkrKylcclxuICAgICAgaXZbaV0gPSBpbnBbaW5PZmYgKyBpXTtcclxuICB9XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydHMudXRpbHMgPSByZXF1aXJlKCcuL2Rlcy91dGlscycpO1xyXG5leHBvcnRzLkNpcGhlciA9IHJlcXVpcmUoJy4vZGVzL2NpcGhlcicpO1xyXG5leHBvcnRzLkRFUyA9IHJlcXVpcmUoJy4vZGVzL2RlcycpO1xyXG5leHBvcnRzLkNCQyA9IHJlcXVpcmUoJy4vZGVzL2NiYycpO1xyXG5leHBvcnRzLkVERSA9IHJlcXVpcmUoJy4vZGVzL2VkZScpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnbWluaW1hbGlzdGljLWFzc2VydCcpO1xyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG5cclxudmFyIGRlcyA9IHJlcXVpcmUoJy4uL2RlcycpO1xyXG52YXIgQ2lwaGVyID0gZGVzLkNpcGhlcjtcclxudmFyIERFUyA9IGRlcy5ERVM7XHJcblxyXG5mdW5jdGlvbiBFREVTdGF0ZSh0eXBlLCBrZXkpIHtcclxuICBhc3NlcnQuZXF1YWwoa2V5Lmxlbmd0aCwgMjQsICdJbnZhbGlkIGtleSBsZW5ndGgnKTtcclxuXHJcbiAgdmFyIGsxID0ga2V5LnNsaWNlKDAsIDgpO1xyXG4gIHZhciBrMiA9IGtleS5zbGljZSg4LCAxNik7XHJcbiAgdmFyIGszID0ga2V5LnNsaWNlKDE2LCAyNCk7XHJcblxyXG4gIGlmICh0eXBlID09PSAnZW5jcnlwdCcpIHtcclxuICAgIHRoaXMuY2lwaGVycyA9IFtcclxuICAgICAgREVTLmNyZWF0ZSh7IHR5cGU6ICdlbmNyeXB0Jywga2V5OiBrMSB9KSxcclxuICAgICAgREVTLmNyZWF0ZSh7IHR5cGU6ICdkZWNyeXB0Jywga2V5OiBrMiB9KSxcclxuICAgICAgREVTLmNyZWF0ZSh7IHR5cGU6ICdlbmNyeXB0Jywga2V5OiBrMyB9KVxyXG4gICAgXTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5jaXBoZXJzID0gW1xyXG4gICAgICBERVMuY3JlYXRlKHsgdHlwZTogJ2RlY3J5cHQnLCBrZXk6IGszIH0pLFxyXG4gICAgICBERVMuY3JlYXRlKHsgdHlwZTogJ2VuY3J5cHQnLCBrZXk6IGsyIH0pLFxyXG4gICAgICBERVMuY3JlYXRlKHsgdHlwZTogJ2RlY3J5cHQnLCBrZXk6IGsxIH0pXHJcbiAgICBdO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gRURFKG9wdGlvbnMpIHtcclxuICBDaXBoZXIuY2FsbCh0aGlzLCBvcHRpb25zKTtcclxuXHJcbiAgdmFyIHN0YXRlID0gbmV3IEVERVN0YXRlKHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLmtleSk7XHJcbiAgdGhpcy5fZWRlU3RhdGUgPSBzdGF0ZTtcclxufVxyXG5pbmhlcml0cyhFREUsIENpcGhlcik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVERTtcclxuXHJcbkVERS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUob3B0aW9ucykge1xyXG4gIHJldHVybiBuZXcgRURFKG9wdGlvbnMpO1xyXG59O1xyXG5cclxuRURFLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24gX3VwZGF0ZShpbnAsIGluT2ZmLCBvdXQsIG91dE9mZikge1xyXG4gIHZhciBzdGF0ZSA9IHRoaXMuX2VkZVN0YXRlO1xyXG5cclxuICBzdGF0ZS5jaXBoZXJzWzBdLl91cGRhdGUoaW5wLCBpbk9mZiwgb3V0LCBvdXRPZmYpO1xyXG4gIHN0YXRlLmNpcGhlcnNbMV0uX3VwZGF0ZShvdXQsIG91dE9mZiwgb3V0LCBvdXRPZmYpO1xyXG4gIHN0YXRlLmNpcGhlcnNbMl0uX3VwZGF0ZShvdXQsIG91dE9mZiwgb3V0LCBvdXRPZmYpO1xyXG59O1xyXG5cclxuRURFLnByb3RvdHlwZS5fcGFkID0gREVTLnByb3RvdHlwZS5fcGFkO1xyXG5FREUucHJvdG90eXBlLl91bnBhZCA9IERFUy5wcm90b3R5cGUuX3VucGFkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnbWluaW1hbGlzdGljLWFzc2VydCcpO1xyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG5cclxudmFyIGRlcyA9IHJlcXVpcmUoJy4uL2RlcycpO1xyXG52YXIgdXRpbHMgPSBkZXMudXRpbHM7XHJcbnZhciBDaXBoZXIgPSBkZXMuQ2lwaGVyO1xyXG5cclxuZnVuY3Rpb24gREVTU3RhdGUoKSB7XHJcbiAgdGhpcy50bXAgPSBuZXcgQXJyYXkoMik7XHJcbiAgdGhpcy5rZXlzID0gbnVsbDtcclxufVxyXG5cclxuZnVuY3Rpb24gREVTKG9wdGlvbnMpIHtcclxuICBDaXBoZXIuY2FsbCh0aGlzLCBvcHRpb25zKTtcclxuXHJcbiAgdmFyIHN0YXRlID0gbmV3IERFU1N0YXRlKCk7XHJcbiAgdGhpcy5fZGVzU3RhdGUgPSBzdGF0ZTtcclxuXHJcbiAgdGhpcy5kZXJpdmVLZXlzKHN0YXRlLCBvcHRpb25zLmtleSk7XHJcbn1cclxuaW5oZXJpdHMoREVTLCBDaXBoZXIpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IERFUztcclxuXHJcbkRFUy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUob3B0aW9ucykge1xyXG4gIHJldHVybiBuZXcgREVTKG9wdGlvbnMpO1xyXG59O1xyXG5cclxudmFyIHNoaWZ0VGFibGUgPSBbXHJcbiAgMSwgMSwgMiwgMiwgMiwgMiwgMiwgMixcclxuICAxLCAyLCAyLCAyLCAyLCAyLCAyLCAxXHJcbl07XHJcblxyXG5ERVMucHJvdG90eXBlLmRlcml2ZUtleXMgPSBmdW5jdGlvbiBkZXJpdmVLZXlzKHN0YXRlLCBrZXkpIHtcclxuICBzdGF0ZS5rZXlzID0gbmV3IEFycmF5KDE2ICogMik7XHJcblxyXG4gIGFzc2VydC5lcXVhbChrZXkubGVuZ3RoLCB0aGlzLmJsb2NrU2l6ZSwgJ0ludmFsaWQga2V5IGxlbmd0aCcpO1xyXG5cclxuICB2YXIga0wgPSB1dGlscy5yZWFkVUludDMyQkUoa2V5LCAwKTtcclxuICB2YXIga1IgPSB1dGlscy5yZWFkVUludDMyQkUoa2V5LCA0KTtcclxuXHJcbiAgdXRpbHMucGMxKGtMLCBrUiwgc3RhdGUudG1wLCAwKTtcclxuICBrTCA9IHN0YXRlLnRtcFswXTtcclxuICBrUiA9IHN0YXRlLnRtcFsxXTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlLmtleXMubGVuZ3RoOyBpICs9IDIpIHtcclxuICAgIHZhciBzaGlmdCA9IHNoaWZ0VGFibGVbaSA+Pj4gMV07XHJcbiAgICBrTCA9IHV0aWxzLnIyOHNobChrTCwgc2hpZnQpO1xyXG4gICAga1IgPSB1dGlscy5yMjhzaGwoa1IsIHNoaWZ0KTtcclxuICAgIHV0aWxzLnBjMihrTCwga1IsIHN0YXRlLmtleXMsIGkpO1xyXG4gIH1cclxufTtcclxuXHJcbkRFUy5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIF91cGRhdGUoaW5wLCBpbk9mZiwgb3V0LCBvdXRPZmYpIHtcclxuICB2YXIgc3RhdGUgPSB0aGlzLl9kZXNTdGF0ZTtcclxuXHJcbiAgdmFyIGwgPSB1dGlscy5yZWFkVUludDMyQkUoaW5wLCBpbk9mZik7XHJcbiAgdmFyIHIgPSB1dGlscy5yZWFkVUludDMyQkUoaW5wLCBpbk9mZiArIDQpO1xyXG5cclxuICAvLyBJbml0aWFsIFBlcm11dGF0aW9uXHJcbiAgdXRpbHMuaXAobCwgciwgc3RhdGUudG1wLCAwKTtcclxuICBsID0gc3RhdGUudG1wWzBdO1xyXG4gIHIgPSBzdGF0ZS50bXBbMV07XHJcblxyXG4gIGlmICh0aGlzLnR5cGUgPT09ICdlbmNyeXB0JylcclxuICAgIHRoaXMuX2VuY3J5cHQoc3RhdGUsIGwsIHIsIHN0YXRlLnRtcCwgMCk7XHJcbiAgZWxzZVxyXG4gICAgdGhpcy5fZGVjcnlwdChzdGF0ZSwgbCwgciwgc3RhdGUudG1wLCAwKTtcclxuXHJcbiAgbCA9IHN0YXRlLnRtcFswXTtcclxuICByID0gc3RhdGUudG1wWzFdO1xyXG5cclxuICB1dGlscy53cml0ZVVJbnQzMkJFKG91dCwgbCwgb3V0T2ZmKTtcclxuICB1dGlscy53cml0ZVVJbnQzMkJFKG91dCwgciwgb3V0T2ZmICsgNCk7XHJcbn07XHJcblxyXG5ERVMucHJvdG90eXBlLl9wYWQgPSBmdW5jdGlvbiBfcGFkKGJ1ZmZlciwgb2ZmKSB7XHJcbiAgdmFyIHZhbHVlID0gYnVmZmVyLmxlbmd0aCAtIG9mZjtcclxuICBmb3IgKHZhciBpID0gb2ZmOyBpIDwgYnVmZmVyLmxlbmd0aDsgaSsrKVxyXG4gICAgYnVmZmVyW2ldID0gdmFsdWU7XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuREVTLnByb3RvdHlwZS5fdW5wYWQgPSBmdW5jdGlvbiBfdW5wYWQoYnVmZmVyKSB7XHJcbiAgdmFyIHBhZCA9IGJ1ZmZlcltidWZmZXIubGVuZ3RoIC0gMV07XHJcbiAgZm9yICh2YXIgaSA9IGJ1ZmZlci5sZW5ndGggLSBwYWQ7IGkgPCBidWZmZXIubGVuZ3RoOyBpKyspXHJcbiAgICBhc3NlcnQuZXF1YWwoYnVmZmVyW2ldLCBwYWQpO1xyXG5cclxuICByZXR1cm4gYnVmZmVyLnNsaWNlKDAsIGJ1ZmZlci5sZW5ndGggLSBwYWQpO1xyXG59O1xyXG5cclxuREVTLnByb3RvdHlwZS5fZW5jcnlwdCA9IGZ1bmN0aW9uIF9lbmNyeXB0KHN0YXRlLCBsU3RhcnQsIHJTdGFydCwgb3V0LCBvZmYpIHtcclxuICB2YXIgbCA9IGxTdGFydDtcclxuICB2YXIgciA9IHJTdGFydDtcclxuXHJcbiAgLy8gQXBwbHkgZigpIHgxNiB0aW1lc1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGUua2V5cy5sZW5ndGg7IGkgKz0gMikge1xyXG4gICAgdmFyIGtleUwgPSBzdGF0ZS5rZXlzW2ldO1xyXG4gICAgdmFyIGtleVIgPSBzdGF0ZS5rZXlzW2kgKyAxXTtcclxuXHJcbiAgICAvLyBmKHIsIGspXHJcbiAgICB1dGlscy5leHBhbmQociwgc3RhdGUudG1wLCAwKTtcclxuXHJcbiAgICBrZXlMIF49IHN0YXRlLnRtcFswXTtcclxuICAgIGtleVIgXj0gc3RhdGUudG1wWzFdO1xyXG4gICAgdmFyIHMgPSB1dGlscy5zdWJzdGl0dXRlKGtleUwsIGtleVIpO1xyXG4gICAgdmFyIGYgPSB1dGlscy5wZXJtdXRlKHMpO1xyXG5cclxuICAgIHZhciB0ID0gcjtcclxuICAgIHIgPSAobCBeIGYpID4+PiAwO1xyXG4gICAgbCA9IHQ7XHJcbiAgfVxyXG5cclxuICAvLyBSZXZlcnNlIEluaXRpYWwgUGVybXV0YXRpb25cclxuICB1dGlscy5yaXAociwgbCwgb3V0LCBvZmYpO1xyXG59O1xyXG5cclxuREVTLnByb3RvdHlwZS5fZGVjcnlwdCA9IGZ1bmN0aW9uIF9kZWNyeXB0KHN0YXRlLCBsU3RhcnQsIHJTdGFydCwgb3V0LCBvZmYpIHtcclxuICB2YXIgbCA9IHJTdGFydDtcclxuICB2YXIgciA9IGxTdGFydDtcclxuXHJcbiAgLy8gQXBwbHkgZigpIHgxNiB0aW1lc1xyXG4gIGZvciAodmFyIGkgPSBzdGF0ZS5rZXlzLmxlbmd0aCAtIDI7IGkgPj0gMDsgaSAtPSAyKSB7XHJcbiAgICB2YXIga2V5TCA9IHN0YXRlLmtleXNbaV07XHJcbiAgICB2YXIga2V5UiA9IHN0YXRlLmtleXNbaSArIDFdO1xyXG5cclxuICAgIC8vIGYociwgaylcclxuICAgIHV0aWxzLmV4cGFuZChsLCBzdGF0ZS50bXAsIDApO1xyXG5cclxuICAgIGtleUwgXj0gc3RhdGUudG1wWzBdO1xyXG4gICAga2V5UiBePSBzdGF0ZS50bXBbMV07XHJcbiAgICB2YXIgcyA9IHV0aWxzLnN1YnN0aXR1dGUoa2V5TCwga2V5Uik7XHJcbiAgICB2YXIgZiA9IHV0aWxzLnBlcm11dGUocyk7XHJcblxyXG4gICAgdmFyIHQgPSBsO1xyXG4gICAgbCA9IChyIF4gZikgPj4+IDA7XHJcbiAgICByID0gdDtcclxuICB9XHJcblxyXG4gIC8vIFJldmVyc2UgSW5pdGlhbCBQZXJtdXRhdGlvblxyXG4gIHV0aWxzLnJpcChsLCByLCBvdXQsIG9mZik7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydHMucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFKGJ5dGVzLCBvZmYpIHtcclxuICB2YXIgcmVzID0gIChieXRlc1swICsgb2ZmXSA8PCAyNCkgfFxyXG4gICAgICAgICAgICAgKGJ5dGVzWzEgKyBvZmZdIDw8IDE2KSB8XHJcbiAgICAgICAgICAgICAoYnl0ZXNbMiArIG9mZl0gPDwgOCkgfFxyXG4gICAgICAgICAgICAgYnl0ZXNbMyArIG9mZl07XHJcbiAgcmV0dXJuIHJlcyA+Pj4gMDtcclxufTtcclxuXHJcbmV4cG9ydHMud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyQkUoYnl0ZXMsIHZhbHVlLCBvZmYpIHtcclxuICBieXRlc1swICsgb2ZmXSA9IHZhbHVlID4+PiAyNDtcclxuICBieXRlc1sxICsgb2ZmXSA9ICh2YWx1ZSA+Pj4gMTYpICYgMHhmZjtcclxuICBieXRlc1syICsgb2ZmXSA9ICh2YWx1ZSA+Pj4gOCkgJiAweGZmO1xyXG4gIGJ5dGVzWzMgKyBvZmZdID0gdmFsdWUgJiAweGZmO1xyXG59O1xyXG5cclxuZXhwb3J0cy5pcCA9IGZ1bmN0aW9uIGlwKGluTCwgaW5SLCBvdXQsIG9mZikge1xyXG4gIHZhciBvdXRMID0gMDtcclxuICB2YXIgb3V0UiA9IDA7XHJcblxyXG4gIGZvciAodmFyIGkgPSA2OyBpID49IDA7IGkgLT0gMikge1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPD0gMjQ7IGogKz0gOCkge1xyXG4gICAgICBvdXRMIDw8PSAxO1xyXG4gICAgICBvdXRMIHw9IChpblIgPj4+IChqICsgaSkpICYgMTtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGogPSAwOyBqIDw9IDI0OyBqICs9IDgpIHtcclxuICAgICAgb3V0TCA8PD0gMTtcclxuICAgICAgb3V0TCB8PSAoaW5MID4+PiAoaiArIGkpKSAmIDE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmb3IgKHZhciBpID0gNjsgaSA+PSAwOyBpIC09IDIpIHtcclxuICAgIGZvciAodmFyIGogPSAxOyBqIDw9IDI1OyBqICs9IDgpIHtcclxuICAgICAgb3V0UiA8PD0gMTtcclxuICAgICAgb3V0UiB8PSAoaW5SID4+PiAoaiArIGkpKSAmIDE7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBqID0gMTsgaiA8PSAyNTsgaiArPSA4KSB7XHJcbiAgICAgIG91dFIgPDw9IDE7XHJcbiAgICAgIG91dFIgfD0gKGluTCA+Pj4gKGogKyBpKSkgJiAxO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb3V0W29mZiArIDBdID0gb3V0TCA+Pj4gMDtcclxuICBvdXRbb2ZmICsgMV0gPSBvdXRSID4+PiAwO1xyXG59O1xyXG5cclxuZXhwb3J0cy5yaXAgPSBmdW5jdGlvbiByaXAoaW5MLCBpblIsIG91dCwgb2ZmKSB7XHJcbiAgdmFyIG91dEwgPSAwO1xyXG4gIHZhciBvdXRSID0gMDtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgIGZvciAodmFyIGogPSAyNDsgaiA+PSAwOyBqIC09IDgpIHtcclxuICAgICAgb3V0TCA8PD0gMTtcclxuICAgICAgb3V0TCB8PSAoaW5SID4+PiAoaiArIGkpKSAmIDE7XHJcbiAgICAgIG91dEwgPDw9IDE7XHJcbiAgICAgIG91dEwgfD0gKGluTCA+Pj4gKGogKyBpKSkgJiAxO1xyXG4gICAgfVxyXG4gIH1cclxuICBmb3IgKHZhciBpID0gNDsgaSA8IDg7IGkrKykge1xyXG4gICAgZm9yICh2YXIgaiA9IDI0OyBqID49IDA7IGogLT0gOCkge1xyXG4gICAgICBvdXRSIDw8PSAxO1xyXG4gICAgICBvdXRSIHw9IChpblIgPj4+IChqICsgaSkpICYgMTtcclxuICAgICAgb3V0UiA8PD0gMTtcclxuICAgICAgb3V0UiB8PSAoaW5MID4+PiAoaiArIGkpKSAmIDE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvdXRbb2ZmICsgMF0gPSBvdXRMID4+PiAwO1xyXG4gIG91dFtvZmYgKyAxXSA9IG91dFIgPj4+IDA7XHJcbn07XHJcblxyXG5leHBvcnRzLnBjMSA9IGZ1bmN0aW9uIHBjMShpbkwsIGluUiwgb3V0LCBvZmYpIHtcclxuICB2YXIgb3V0TCA9IDA7XHJcbiAgdmFyIG91dFIgPSAwO1xyXG5cclxuICAvLyA3LCAxNSwgMjMsIDMxLCAzOSwgNDcsIDU1LCA2M1xyXG4gIC8vIDYsIDE0LCAyMiwgMzAsIDM5LCA0NywgNTUsIDYzXHJcbiAgLy8gNSwgMTMsIDIxLCAyOSwgMzksIDQ3LCA1NSwgNjNcclxuICAvLyA0LCAxMiwgMjAsIDI4XHJcbiAgZm9yICh2YXIgaSA9IDc7IGkgPj0gNTsgaS0tKSB7XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8PSAyNDsgaiArPSA4KSB7XHJcbiAgICAgIG91dEwgPDw9IDE7XHJcbiAgICAgIG91dEwgfD0gKGluUiA+PiAoaiArIGkpKSAmIDE7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8PSAyNDsgaiArPSA4KSB7XHJcbiAgICAgIG91dEwgPDw9IDE7XHJcbiAgICAgIG91dEwgfD0gKGluTCA+PiAoaiArIGkpKSAmIDE7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZvciAodmFyIGogPSAwOyBqIDw9IDI0OyBqICs9IDgpIHtcclxuICAgIG91dEwgPDw9IDE7XHJcbiAgICBvdXRMIHw9IChpblIgPj4gKGogKyBpKSkgJiAxO1xyXG4gIH1cclxuXHJcbiAgLy8gMSwgOSwgMTcsIDI1LCAzMywgNDEsIDQ5LCA1N1xyXG4gIC8vIDIsIDEwLCAxOCwgMjYsIDM0LCA0MiwgNTAsIDU4XHJcbiAgLy8gMywgMTEsIDE5LCAyNywgMzUsIDQzLCA1MSwgNTlcclxuICAvLyAzNiwgNDQsIDUyLCA2MFxyXG4gIGZvciAodmFyIGkgPSAxOyBpIDw9IDM7IGkrKykge1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPD0gMjQ7IGogKz0gOCkge1xyXG4gICAgICBvdXRSIDw8PSAxO1xyXG4gICAgICBvdXRSIHw9IChpblIgPj4gKGogKyBpKSkgJiAxO1xyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPD0gMjQ7IGogKz0gOCkge1xyXG4gICAgICBvdXRSIDw8PSAxO1xyXG4gICAgICBvdXRSIHw9IChpbkwgPj4gKGogKyBpKSkgJiAxO1xyXG4gICAgfVxyXG4gIH1cclxuICBmb3IgKHZhciBqID0gMDsgaiA8PSAyNDsgaiArPSA4KSB7XHJcbiAgICBvdXRSIDw8PSAxO1xyXG4gICAgb3V0UiB8PSAoaW5MID4+IChqICsgaSkpICYgMTtcclxuICB9XHJcblxyXG4gIG91dFtvZmYgKyAwXSA9IG91dEwgPj4+IDA7XHJcbiAgb3V0W29mZiArIDFdID0gb3V0UiA+Pj4gMDtcclxufTtcclxuXHJcbmV4cG9ydHMucjI4c2hsID0gZnVuY3Rpb24gcjI4c2hsKG51bSwgc2hpZnQpIHtcclxuICByZXR1cm4gKChudW0gPDwgc2hpZnQpICYgMHhmZmZmZmZmKSB8IChudW0gPj4+ICgyOCAtIHNoaWZ0KSk7XHJcbn07XHJcblxyXG52YXIgcGMydGFibGUgPSBbXHJcbiAgLy8gaW5MID0+IG91dExcclxuICAxNCwgMTEsIDE3LCA0LCAyNywgMjMsIDI1LCAwLFxyXG4gIDEzLCAyMiwgNywgMTgsIDUsIDksIDE2LCAyNCxcclxuICAyLCAyMCwgMTIsIDIxLCAxLCA4LCAxNSwgMjYsXHJcblxyXG4gIC8vIGluUiA9PiBvdXRSXHJcbiAgMTUsIDQsIDI1LCAxOSwgOSwgMSwgMjYsIDE2LFxyXG4gIDUsIDExLCAyMywgOCwgMTIsIDcsIDE3LCAwLFxyXG4gIDIyLCAzLCAxMCwgMTQsIDYsIDIwLCAyNywgMjRcclxuXTtcclxuXHJcbmV4cG9ydHMucGMyID0gZnVuY3Rpb24gcGMyKGluTCwgaW5SLCBvdXQsIG9mZikge1xyXG4gIHZhciBvdXRMID0gMDtcclxuICB2YXIgb3V0UiA9IDA7XHJcblxyXG4gIHZhciBsZW4gPSBwYzJ0YWJsZS5sZW5ndGggPj4+IDE7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgb3V0TCA8PD0gMTtcclxuICAgIG91dEwgfD0gKGluTCA+Pj4gcGMydGFibGVbaV0pICYgMHgxO1xyXG4gIH1cclxuICBmb3IgKHZhciBpID0gbGVuOyBpIDwgcGMydGFibGUubGVuZ3RoOyBpKyspIHtcclxuICAgIG91dFIgPDw9IDE7XHJcbiAgICBvdXRSIHw9IChpblIgPj4+IHBjMnRhYmxlW2ldKSAmIDB4MTtcclxuICB9XHJcblxyXG4gIG91dFtvZmYgKyAwXSA9IG91dEwgPj4+IDA7XHJcbiAgb3V0W29mZiArIDFdID0gb3V0UiA+Pj4gMDtcclxufTtcclxuXHJcbmV4cG9ydHMuZXhwYW5kID0gZnVuY3Rpb24gZXhwYW5kKHIsIG91dCwgb2ZmKSB7XHJcbiAgdmFyIG91dEwgPSAwO1xyXG4gIHZhciBvdXRSID0gMDtcclxuXHJcbiAgb3V0TCA9ICgociAmIDEpIDw8IDUpIHwgKHIgPj4+IDI3KTtcclxuICBmb3IgKHZhciBpID0gMjM7IGkgPj0gMTU7IGkgLT0gNCkge1xyXG4gICAgb3V0TCA8PD0gNjtcclxuICAgIG91dEwgfD0gKHIgPj4+IGkpICYgMHgzZjtcclxuICB9XHJcbiAgZm9yICh2YXIgaSA9IDExOyBpID49IDM7IGkgLT0gNCkge1xyXG4gICAgb3V0UiB8PSAociA+Pj4gaSkgJiAweDNmO1xyXG4gICAgb3V0UiA8PD0gNjtcclxuICB9XHJcbiAgb3V0UiB8PSAoKHIgJiAweDFmKSA8PCAxKSB8IChyID4+PiAzMSk7XHJcblxyXG4gIG91dFtvZmYgKyAwXSA9IG91dEwgPj4+IDA7XHJcbiAgb3V0W29mZiArIDFdID0gb3V0UiA+Pj4gMDtcclxufTtcclxuXHJcbnZhciBzVGFibGUgPSBbXHJcbiAgMTQsIDAsIDQsIDE1LCAxMywgNywgMSwgNCwgMiwgMTQsIDE1LCAyLCAxMSwgMTMsIDgsIDEsXHJcbiAgMywgMTAsIDEwLCA2LCA2LCAxMiwgMTIsIDExLCA1LCA5LCA5LCA1LCAwLCAzLCA3LCA4LFxyXG4gIDQsIDE1LCAxLCAxMiwgMTQsIDgsIDgsIDIsIDEzLCA0LCA2LCA5LCAyLCAxLCAxMSwgNyxcclxuICAxNSwgNSwgMTIsIDExLCA5LCAzLCA3LCAxNCwgMywgMTAsIDEwLCAwLCA1LCA2LCAwLCAxMyxcclxuXHJcbiAgMTUsIDMsIDEsIDEzLCA4LCA0LCAxNCwgNywgNiwgMTUsIDExLCAyLCAzLCA4LCA0LCAxNCxcclxuICA5LCAxMiwgNywgMCwgMiwgMSwgMTMsIDEwLCAxMiwgNiwgMCwgOSwgNSwgMTEsIDEwLCA1LFxyXG4gIDAsIDEzLCAxNCwgOCwgNywgMTAsIDExLCAxLCAxMCwgMywgNCwgMTUsIDEzLCA0LCAxLCAyLFxyXG4gIDUsIDExLCA4LCA2LCAxMiwgNywgNiwgMTIsIDksIDAsIDMsIDUsIDIsIDE0LCAxNSwgOSxcclxuXHJcbiAgMTAsIDEzLCAwLCA3LCA5LCAwLCAxNCwgOSwgNiwgMywgMywgNCwgMTUsIDYsIDUsIDEwLFxyXG4gIDEsIDIsIDEzLCA4LCAxMiwgNSwgNywgMTQsIDExLCAxMiwgNCwgMTEsIDIsIDE1LCA4LCAxLFxyXG4gIDEzLCAxLCA2LCAxMCwgNCwgMTMsIDksIDAsIDgsIDYsIDE1LCA5LCAzLCA4LCAwLCA3LFxyXG4gIDExLCA0LCAxLCAxNSwgMiwgMTQsIDEyLCAzLCA1LCAxMSwgMTAsIDUsIDE0LCAyLCA3LCAxMixcclxuXHJcbiAgNywgMTMsIDEzLCA4LCAxNCwgMTEsIDMsIDUsIDAsIDYsIDYsIDE1LCA5LCAwLCAxMCwgMyxcclxuICAxLCA0LCAyLCA3LCA4LCAyLCA1LCAxMiwgMTEsIDEsIDEyLCAxMCwgNCwgMTQsIDE1LCA5LFxyXG4gIDEwLCAzLCA2LCAxNSwgOSwgMCwgMCwgNiwgMTIsIDEwLCAxMSwgMSwgNywgMTMsIDEzLCA4LFxyXG4gIDE1LCA5LCAxLCA0LCAzLCA1LCAxNCwgMTEsIDUsIDEyLCAyLCA3LCA4LCAyLCA0LCAxNCxcclxuXHJcbiAgMiwgMTQsIDEyLCAxMSwgNCwgMiwgMSwgMTIsIDcsIDQsIDEwLCA3LCAxMSwgMTMsIDYsIDEsXHJcbiAgOCwgNSwgNSwgMCwgMywgMTUsIDE1LCAxMCwgMTMsIDMsIDAsIDksIDE0LCA4LCA5LCA2LFxyXG4gIDQsIDExLCAyLCA4LCAxLCAxMiwgMTEsIDcsIDEwLCAxLCAxMywgMTQsIDcsIDIsIDgsIDEzLFxyXG4gIDE1LCA2LCA5LCAxNSwgMTIsIDAsIDUsIDksIDYsIDEwLCAzLCA0LCAwLCA1LCAxNCwgMyxcclxuXHJcbiAgMTIsIDEwLCAxLCAxNSwgMTAsIDQsIDE1LCAyLCA5LCA3LCAyLCAxMiwgNiwgOSwgOCwgNSxcclxuICAwLCA2LCAxMywgMSwgMywgMTMsIDQsIDE0LCAxNCwgMCwgNywgMTEsIDUsIDMsIDExLCA4LFxyXG4gIDksIDQsIDE0LCAzLCAxNSwgMiwgNSwgMTIsIDIsIDksIDgsIDUsIDEyLCAxNSwgMywgMTAsXHJcbiAgNywgMTEsIDAsIDE0LCA0LCAxLCAxMCwgNywgMSwgNiwgMTMsIDAsIDExLCA4LCA2LCAxMyxcclxuXHJcbiAgNCwgMTMsIDExLCAwLCAyLCAxMSwgMTQsIDcsIDE1LCA0LCAwLCA5LCA4LCAxLCAxMywgMTAsXHJcbiAgMywgMTQsIDEyLCAzLCA5LCA1LCA3LCAxMiwgNSwgMiwgMTAsIDE1LCA2LCA4LCAxLCA2LFxyXG4gIDEsIDYsIDQsIDExLCAxMSwgMTMsIDEzLCA4LCAxMiwgMSwgMywgNCwgNywgMTAsIDE0LCA3LFxyXG4gIDEwLCA5LCAxNSwgNSwgNiwgMCwgOCwgMTUsIDAsIDE0LCA1LCAyLCA5LCAzLCAyLCAxMixcclxuXHJcbiAgMTMsIDEsIDIsIDE1LCA4LCAxMywgNCwgOCwgNiwgMTAsIDE1LCAzLCAxMSwgNywgMSwgNCxcclxuICAxMCwgMTIsIDksIDUsIDMsIDYsIDE0LCAxMSwgNSwgMCwgMCwgMTQsIDEyLCA5LCA3LCAyLFxyXG4gIDcsIDIsIDExLCAxLCA0LCAxNCwgMSwgNywgOSwgNCwgMTIsIDEwLCAxNCwgOCwgMiwgMTMsXHJcbiAgMCwgMTUsIDYsIDEyLCAxMCwgOSwgMTMsIDAsIDE1LCAzLCAzLCA1LCA1LCA2LCA4LCAxMVxyXG5dO1xyXG5cclxuZXhwb3J0cy5zdWJzdGl0dXRlID0gZnVuY3Rpb24gc3Vic3RpdHV0ZShpbkwsIGluUikge1xyXG4gIHZhciBvdXQgPSAwO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICB2YXIgYiA9IChpbkwgPj4+ICgxOCAtIGkgKiA2KSkgJiAweDNmO1xyXG4gICAgdmFyIHNiID0gc1RhYmxlW2kgKiAweDQwICsgYl07XHJcblxyXG4gICAgb3V0IDw8PSA0O1xyXG4gICAgb3V0IHw9IHNiO1xyXG4gIH1cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgdmFyIGIgPSAoaW5SID4+PiAoMTggLSBpICogNikpICYgMHgzZjtcclxuICAgIHZhciBzYiA9IHNUYWJsZVs0ICogMHg0MCArIGkgKiAweDQwICsgYl07XHJcblxyXG4gICAgb3V0IDw8PSA0O1xyXG4gICAgb3V0IHw9IHNiO1xyXG4gIH1cclxuICByZXR1cm4gb3V0ID4+PiAwO1xyXG59O1xyXG5cclxudmFyIHBlcm11dGVUYWJsZSA9IFtcclxuICAxNiwgMjUsIDEyLCAxMSwgMywgMjAsIDQsIDE1LCAzMSwgMTcsIDksIDYsIDI3LCAxNCwgMSwgMjIsXHJcbiAgMzAsIDI0LCA4LCAxOCwgMCwgNSwgMjksIDIzLCAxMywgMTksIDIsIDI2LCAxMCwgMjEsIDI4LCA3XHJcbl07XHJcblxyXG5leHBvcnRzLnBlcm11dGUgPSBmdW5jdGlvbiBwZXJtdXRlKG51bSkge1xyXG4gIHZhciBvdXQgPSAwO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGVybXV0ZVRhYmxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBvdXQgPDw9IDE7XHJcbiAgICBvdXQgfD0gKG51bSA+Pj4gcGVybXV0ZVRhYmxlW2ldKSAmIDB4MTtcclxuICB9XHJcbiAgcmV0dXJuIG91dCA+Pj4gMDtcclxufTtcclxuXHJcbmV4cG9ydHMucGFkU3BsaXQgPSBmdW5jdGlvbiBwYWRTcGxpdChudW0sIHNpemUsIGdyb3VwKSB7XHJcbiAgdmFyIHN0ciA9IG51bS50b1N0cmluZygyKTtcclxuICB3aGlsZSAoc3RyLmxlbmd0aCA8IHNpemUpXHJcbiAgICBzdHIgPSAnMCcgKyBzdHI7XHJcblxyXG4gIHZhciBvdXQgPSBbXTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkgKz0gZ3JvdXApXHJcbiAgICBvdXQucHVzaChzdHIuc2xpY2UoaSwgaSArIGdyb3VwKSk7XHJcbiAgcmV0dXJuIG91dC5qb2luKCcgJyk7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=