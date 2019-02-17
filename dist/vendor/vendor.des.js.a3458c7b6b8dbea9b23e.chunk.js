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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVzLmpzL2xpYi9kZXMvY2lwaGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9kZXMuanMvbGliL2Rlcy9jYmMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Rlcy5qcy9saWIvZGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9kZXMuanMvbGliL2Rlcy9lZGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Rlcy5qcy9saWIvZGVzL2Rlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVzLmpzL2xpYi9kZXMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhOztBQUViLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBcUI7O0FBRTFDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsU0FBUztBQUMxQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRLGdCQUFnQjtBQUN4QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLHdCQUF3QjtBQUNoQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsUUFBUSxXQUFXO0FBQ25CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7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QkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLFNBQVM7QUFDM0I7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFFBQVE7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQix5QkFBeUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixVQUFVO0FBQzNCO0FBQ0E7QUFDQSIsImZpbGUiOiJ2ZW5kb3IvdmVuZG9yLmRlcy5qcy5hMzQ1OGM3YjZiOGRiZWE5YjIzZS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ21pbmltYWxpc3RpYy1hc3NlcnQnKTtcblxuZnVuY3Rpb24gQ2lwaGVyKG9wdGlvbnMpIHtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICB0aGlzLnR5cGUgPSB0aGlzLm9wdGlvbnMudHlwZTtcbiAgdGhpcy5ibG9ja1NpemUgPSA4O1xuICB0aGlzLl9pbml0KCk7XG5cbiAgdGhpcy5idWZmZXIgPSBuZXcgQXJyYXkodGhpcy5ibG9ja1NpemUpO1xuICB0aGlzLmJ1ZmZlck9mZiA9IDA7XG59XG5tb2R1bGUuZXhwb3J0cyA9IENpcGhlcjtcblxuQ2lwaGVyLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uIF9pbml0KCkge1xuICAvLyBNaWdodCBiZSBvdmVycmlkZWRcbn07XG5cbkNpcGhlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKGRhdGEpIHtcbiAgaWYgKGRhdGEubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiBbXTtcblxuICBpZiAodGhpcy50eXBlID09PSAnZGVjcnlwdCcpXG4gICAgcmV0dXJuIHRoaXMuX3VwZGF0ZURlY3J5cHQoZGF0YSk7XG4gIGVsc2VcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlRW5jcnlwdChkYXRhKTtcbn07XG5cbkNpcGhlci5wcm90b3R5cGUuX2J1ZmZlciA9IGZ1bmN0aW9uIF9idWZmZXIoZGF0YSwgb2ZmKSB7XG4gIC8vIEFwcGVuZCBkYXRhIHRvIGJ1ZmZlclxuICB2YXIgbWluID0gTWF0aC5taW4odGhpcy5idWZmZXIubGVuZ3RoIC0gdGhpcy5idWZmZXJPZmYsIGRhdGEubGVuZ3RoIC0gb2ZmKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtaW47IGkrKylcbiAgICB0aGlzLmJ1ZmZlclt0aGlzLmJ1ZmZlck9mZiArIGldID0gZGF0YVtvZmYgKyBpXTtcbiAgdGhpcy5idWZmZXJPZmYgKz0gbWluO1xuXG4gIC8vIFNoaWZ0IG5leHRcbiAgcmV0dXJuIG1pbjtcbn07XG5cbkNpcGhlci5wcm90b3R5cGUuX2ZsdXNoQnVmZmVyID0gZnVuY3Rpb24gX2ZsdXNoQnVmZmVyKG91dCwgb2ZmKSB7XG4gIHRoaXMuX3VwZGF0ZSh0aGlzLmJ1ZmZlciwgMCwgb3V0LCBvZmYpO1xuICB0aGlzLmJ1ZmZlck9mZiA9IDA7XG4gIHJldHVybiB0aGlzLmJsb2NrU2l6ZTtcbn07XG5cbkNpcGhlci5wcm90b3R5cGUuX3VwZGF0ZUVuY3J5cHQgPSBmdW5jdGlvbiBfdXBkYXRlRW5jcnlwdChkYXRhKSB7XG4gIHZhciBpbnB1dE9mZiA9IDA7XG4gIHZhciBvdXRwdXRPZmYgPSAwO1xuXG4gIHZhciBjb3VudCA9ICgodGhpcy5idWZmZXJPZmYgKyBkYXRhLmxlbmd0aCkgLyB0aGlzLmJsb2NrU2l6ZSkgfCAwO1xuICB2YXIgb3V0ID0gbmV3IEFycmF5KGNvdW50ICogdGhpcy5ibG9ja1NpemUpO1xuXG4gIGlmICh0aGlzLmJ1ZmZlck9mZiAhPT0gMCkge1xuICAgIGlucHV0T2ZmICs9IHRoaXMuX2J1ZmZlcihkYXRhLCBpbnB1dE9mZik7XG5cbiAgICBpZiAodGhpcy5idWZmZXJPZmYgPT09IHRoaXMuYnVmZmVyLmxlbmd0aClcbiAgICAgIG91dHB1dE9mZiArPSB0aGlzLl9mbHVzaEJ1ZmZlcihvdXQsIG91dHB1dE9mZik7XG4gIH1cblxuICAvLyBXcml0ZSBibG9ja3NcbiAgdmFyIG1heCA9IGRhdGEubGVuZ3RoIC0gKChkYXRhLmxlbmd0aCAtIGlucHV0T2ZmKSAlIHRoaXMuYmxvY2tTaXplKTtcbiAgZm9yICg7IGlucHV0T2ZmIDwgbWF4OyBpbnB1dE9mZiArPSB0aGlzLmJsb2NrU2l6ZSkge1xuICAgIHRoaXMuX3VwZGF0ZShkYXRhLCBpbnB1dE9mZiwgb3V0LCBvdXRwdXRPZmYpO1xuICAgIG91dHB1dE9mZiArPSB0aGlzLmJsb2NrU2l6ZTtcbiAgfVxuXG4gIC8vIFF1ZXVlIHJlc3RcbiAgZm9yICg7IGlucHV0T2ZmIDwgZGF0YS5sZW5ndGg7IGlucHV0T2ZmKyssIHRoaXMuYnVmZmVyT2ZmKyspXG4gICAgdGhpcy5idWZmZXJbdGhpcy5idWZmZXJPZmZdID0gZGF0YVtpbnB1dE9mZl07XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbkNpcGhlci5wcm90b3R5cGUuX3VwZGF0ZURlY3J5cHQgPSBmdW5jdGlvbiBfdXBkYXRlRGVjcnlwdChkYXRhKSB7XG4gIHZhciBpbnB1dE9mZiA9IDA7XG4gIHZhciBvdXRwdXRPZmYgPSAwO1xuXG4gIHZhciBjb3VudCA9IE1hdGguY2VpbCgodGhpcy5idWZmZXJPZmYgKyBkYXRhLmxlbmd0aCkgLyB0aGlzLmJsb2NrU2l6ZSkgLSAxO1xuICB2YXIgb3V0ID0gbmV3IEFycmF5KGNvdW50ICogdGhpcy5ibG9ja1NpemUpO1xuXG4gIC8vIFRPRE8oaW5kdXRueSk6IG9wdGltaXplIGl0LCB0aGlzIGlzIGZhciBmcm9tIG9wdGltYWxcbiAgZm9yICg7IGNvdW50ID4gMDsgY291bnQtLSkge1xuICAgIGlucHV0T2ZmICs9IHRoaXMuX2J1ZmZlcihkYXRhLCBpbnB1dE9mZik7XG4gICAgb3V0cHV0T2ZmICs9IHRoaXMuX2ZsdXNoQnVmZmVyKG91dCwgb3V0cHV0T2ZmKTtcbiAgfVxuXG4gIC8vIEJ1ZmZlciByZXN0IG9mIHRoZSBpbnB1dFxuICBpbnB1dE9mZiArPSB0aGlzLl9idWZmZXIoZGF0YSwgaW5wdXRPZmYpO1xuXG4gIHJldHVybiBvdXQ7XG59O1xuXG5DaXBoZXIucHJvdG90eXBlLmZpbmFsID0gZnVuY3Rpb24gZmluYWwoYnVmZmVyKSB7XG4gIHZhciBmaXJzdDtcbiAgaWYgKGJ1ZmZlcilcbiAgICBmaXJzdCA9IHRoaXMudXBkYXRlKGJ1ZmZlcik7XG5cbiAgdmFyIGxhc3Q7XG4gIGlmICh0aGlzLnR5cGUgPT09ICdlbmNyeXB0JylcbiAgICBsYXN0ID0gdGhpcy5fZmluYWxFbmNyeXB0KCk7XG4gIGVsc2VcbiAgICBsYXN0ID0gdGhpcy5fZmluYWxEZWNyeXB0KCk7XG5cbiAgaWYgKGZpcnN0KVxuICAgIHJldHVybiBmaXJzdC5jb25jYXQobGFzdCk7XG4gIGVsc2VcbiAgICByZXR1cm4gbGFzdDtcbn07XG5cbkNpcGhlci5wcm90b3R5cGUuX3BhZCA9IGZ1bmN0aW9uIF9wYWQoYnVmZmVyLCBvZmYpIHtcbiAgaWYgKG9mZiA9PT0gMClcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgd2hpbGUgKG9mZiA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgYnVmZmVyW29mZisrXSA9IDA7XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5DaXBoZXIucHJvdG90eXBlLl9maW5hbEVuY3J5cHQgPSBmdW5jdGlvbiBfZmluYWxFbmNyeXB0KCkge1xuICBpZiAoIXRoaXMuX3BhZCh0aGlzLmJ1ZmZlciwgdGhpcy5idWZmZXJPZmYpKVxuICAgIHJldHVybiBbXTtcblxuICB2YXIgb3V0ID0gbmV3IEFycmF5KHRoaXMuYmxvY2tTaXplKTtcbiAgdGhpcy5fdXBkYXRlKHRoaXMuYnVmZmVyLCAwLCBvdXQsIDApO1xuICByZXR1cm4gb3V0O1xufTtcblxuQ2lwaGVyLnByb3RvdHlwZS5fdW5wYWQgPSBmdW5jdGlvbiBfdW5wYWQoYnVmZmVyKSB7XG4gIHJldHVybiBidWZmZXI7XG59O1xuXG5DaXBoZXIucHJvdG90eXBlLl9maW5hbERlY3J5cHQgPSBmdW5jdGlvbiBfZmluYWxEZWNyeXB0KCkge1xuICBhc3NlcnQuZXF1YWwodGhpcy5idWZmZXJPZmYsIHRoaXMuYmxvY2tTaXplLCAnTm90IGVub3VnaCBkYXRhIHRvIGRlY3J5cHQnKTtcbiAgdmFyIG91dCA9IG5ldyBBcnJheSh0aGlzLmJsb2NrU2l6ZSk7XG4gIHRoaXMuX2ZsdXNoQnVmZmVyKG91dCwgMCk7XG5cbiAgcmV0dXJuIHRoaXMuX3VucGFkKG91dCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnbWluaW1hbGlzdGljLWFzc2VydCcpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIHByb3RvID0ge307XG5cbmZ1bmN0aW9uIENCQ1N0YXRlKGl2KSB7XG4gIGFzc2VydC5lcXVhbChpdi5sZW5ndGgsIDgsICdJbnZhbGlkIElWIGxlbmd0aCcpO1xuXG4gIHRoaXMuaXYgPSBuZXcgQXJyYXkoOCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pdi5sZW5ndGg7IGkrKylcbiAgICB0aGlzLml2W2ldID0gaXZbaV07XG59XG5cbmZ1bmN0aW9uIGluc3RhbnRpYXRlKEJhc2UpIHtcbiAgZnVuY3Rpb24gQ0JDKG9wdGlvbnMpIHtcbiAgICBCYXNlLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgdGhpcy5fY2JjSW5pdCgpO1xuICB9XG4gIGluaGVyaXRzKENCQywgQmFzZSk7XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm90byk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIENCQy5wcm90b3R5cGVba2V5XSA9IHByb3RvW2tleV07XG4gIH1cblxuICBDQkMuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IENCQyhvcHRpb25zKTtcbiAgfTtcblxuICByZXR1cm4gQ0JDO1xufVxuXG5leHBvcnRzLmluc3RhbnRpYXRlID0gaW5zdGFudGlhdGU7XG5cbnByb3RvLl9jYmNJbml0ID0gZnVuY3Rpb24gX2NiY0luaXQoKSB7XG4gIHZhciBzdGF0ZSA9IG5ldyBDQkNTdGF0ZSh0aGlzLm9wdGlvbnMuaXYpO1xuICB0aGlzLl9jYmNTdGF0ZSA9IHN0YXRlO1xufTtcblxucHJvdG8uX3VwZGF0ZSA9IGZ1bmN0aW9uIF91cGRhdGUoaW5wLCBpbk9mZiwgb3V0LCBvdXRPZmYpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fY2JjU3RhdGU7XG4gIHZhciBzdXBlclByb3RvID0gdGhpcy5jb25zdHJ1Y3Rvci5zdXBlcl8ucHJvdG90eXBlO1xuXG4gIHZhciBpdiA9IHN0YXRlLml2O1xuICBpZiAodGhpcy50eXBlID09PSAnZW5jcnlwdCcpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxvY2tTaXplOyBpKyspXG4gICAgICBpdltpXSBePSBpbnBbaW5PZmYgKyBpXTtcblxuICAgIHN1cGVyUHJvdG8uX3VwZGF0ZS5jYWxsKHRoaXMsIGl2LCAwLCBvdXQsIG91dE9mZik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxvY2tTaXplOyBpKyspXG4gICAgICBpdltpXSA9IG91dFtvdXRPZmYgKyBpXTtcbiAgfSBlbHNlIHtcbiAgICBzdXBlclByb3RvLl91cGRhdGUuY2FsbCh0aGlzLCBpbnAsIGluT2ZmLCBvdXQsIG91dE9mZik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxvY2tTaXplOyBpKyspXG4gICAgICBvdXRbb3V0T2ZmICsgaV0gXj0gaXZbaV07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxvY2tTaXplOyBpKyspXG4gICAgICBpdltpXSA9IGlucFtpbk9mZiArIGldO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLnV0aWxzID0gcmVxdWlyZSgnLi9kZXMvdXRpbHMnKTtcbmV4cG9ydHMuQ2lwaGVyID0gcmVxdWlyZSgnLi9kZXMvY2lwaGVyJyk7XG5leHBvcnRzLkRFUyA9IHJlcXVpcmUoJy4vZGVzL2RlcycpO1xuZXhwb3J0cy5DQkMgPSByZXF1aXJlKCcuL2Rlcy9jYmMnKTtcbmV4cG9ydHMuRURFID0gcmVxdWlyZSgnLi9kZXMvZWRlJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCdtaW5pbWFsaXN0aWMtYXNzZXJ0Jyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgZGVzID0gcmVxdWlyZSgnLi4vZGVzJyk7XG52YXIgQ2lwaGVyID0gZGVzLkNpcGhlcjtcbnZhciBERVMgPSBkZXMuREVTO1xuXG5mdW5jdGlvbiBFREVTdGF0ZSh0eXBlLCBrZXkpIHtcbiAgYXNzZXJ0LmVxdWFsKGtleS5sZW5ndGgsIDI0LCAnSW52YWxpZCBrZXkgbGVuZ3RoJyk7XG5cbiAgdmFyIGsxID0ga2V5LnNsaWNlKDAsIDgpO1xuICB2YXIgazIgPSBrZXkuc2xpY2UoOCwgMTYpO1xuICB2YXIgazMgPSBrZXkuc2xpY2UoMTYsIDI0KTtcblxuICBpZiAodHlwZSA9PT0gJ2VuY3J5cHQnKSB7XG4gICAgdGhpcy5jaXBoZXJzID0gW1xuICAgICAgREVTLmNyZWF0ZSh7IHR5cGU6ICdlbmNyeXB0Jywga2V5OiBrMSB9KSxcbiAgICAgIERFUy5jcmVhdGUoeyB0eXBlOiAnZGVjcnlwdCcsIGtleTogazIgfSksXG4gICAgICBERVMuY3JlYXRlKHsgdHlwZTogJ2VuY3J5cHQnLCBrZXk6IGszIH0pXG4gICAgXTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmNpcGhlcnMgPSBbXG4gICAgICBERVMuY3JlYXRlKHsgdHlwZTogJ2RlY3J5cHQnLCBrZXk6IGszIH0pLFxuICAgICAgREVTLmNyZWF0ZSh7IHR5cGU6ICdlbmNyeXB0Jywga2V5OiBrMiB9KSxcbiAgICAgIERFUy5jcmVhdGUoeyB0eXBlOiAnZGVjcnlwdCcsIGtleTogazEgfSlcbiAgICBdO1xuICB9XG59XG5cbmZ1bmN0aW9uIEVERShvcHRpb25zKSB7XG4gIENpcGhlci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuXG4gIHZhciBzdGF0ZSA9IG5ldyBFREVTdGF0ZSh0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5rZXkpO1xuICB0aGlzLl9lZGVTdGF0ZSA9IHN0YXRlO1xufVxuaW5oZXJpdHMoRURFLCBDaXBoZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVERTtcblxuRURFLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgRURFKG9wdGlvbnMpO1xufTtcblxuRURFLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24gX3VwZGF0ZShpbnAsIGluT2ZmLCBvdXQsIG91dE9mZikge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9lZGVTdGF0ZTtcblxuICBzdGF0ZS5jaXBoZXJzWzBdLl91cGRhdGUoaW5wLCBpbk9mZiwgb3V0LCBvdXRPZmYpO1xuICBzdGF0ZS5jaXBoZXJzWzFdLl91cGRhdGUob3V0LCBvdXRPZmYsIG91dCwgb3V0T2ZmKTtcbiAgc3RhdGUuY2lwaGVyc1syXS5fdXBkYXRlKG91dCwgb3V0T2ZmLCBvdXQsIG91dE9mZik7XG59O1xuXG5FREUucHJvdG90eXBlLl9wYWQgPSBERVMucHJvdG90eXBlLl9wYWQ7XG5FREUucHJvdG90eXBlLl91bnBhZCA9IERFUy5wcm90b3R5cGUuX3VucGFkO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnbWluaW1hbGlzdGljLWFzc2VydCcpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIGRlcyA9IHJlcXVpcmUoJy4uL2RlcycpO1xudmFyIHV0aWxzID0gZGVzLnV0aWxzO1xudmFyIENpcGhlciA9IGRlcy5DaXBoZXI7XG5cbmZ1bmN0aW9uIERFU1N0YXRlKCkge1xuICB0aGlzLnRtcCA9IG5ldyBBcnJheSgyKTtcbiAgdGhpcy5rZXlzID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gREVTKG9wdGlvbnMpIHtcbiAgQ2lwaGVyLmNhbGwodGhpcywgb3B0aW9ucyk7XG5cbiAgdmFyIHN0YXRlID0gbmV3IERFU1N0YXRlKCk7XG4gIHRoaXMuX2Rlc1N0YXRlID0gc3RhdGU7XG5cbiAgdGhpcy5kZXJpdmVLZXlzKHN0YXRlLCBvcHRpb25zLmtleSk7XG59XG5pbmhlcml0cyhERVMsIENpcGhlcik7XG5tb2R1bGUuZXhwb3J0cyA9IERFUztcblxuREVTLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgREVTKG9wdGlvbnMpO1xufTtcblxudmFyIHNoaWZ0VGFibGUgPSBbXG4gIDEsIDEsIDIsIDIsIDIsIDIsIDIsIDIsXG4gIDEsIDIsIDIsIDIsIDIsIDIsIDIsIDFcbl07XG5cbkRFUy5wcm90b3R5cGUuZGVyaXZlS2V5cyA9IGZ1bmN0aW9uIGRlcml2ZUtleXMoc3RhdGUsIGtleSkge1xuICBzdGF0ZS5rZXlzID0gbmV3IEFycmF5KDE2ICogMik7XG5cbiAgYXNzZXJ0LmVxdWFsKGtleS5sZW5ndGgsIHRoaXMuYmxvY2tTaXplLCAnSW52YWxpZCBrZXkgbGVuZ3RoJyk7XG5cbiAgdmFyIGtMID0gdXRpbHMucmVhZFVJbnQzMkJFKGtleSwgMCk7XG4gIHZhciBrUiA9IHV0aWxzLnJlYWRVSW50MzJCRShrZXksIDQpO1xuXG4gIHV0aWxzLnBjMShrTCwga1IsIHN0YXRlLnRtcCwgMCk7XG4gIGtMID0gc3RhdGUudG1wWzBdO1xuICBrUiA9IHN0YXRlLnRtcFsxXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZS5rZXlzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgdmFyIHNoaWZ0ID0gc2hpZnRUYWJsZVtpID4+PiAxXTtcbiAgICBrTCA9IHV0aWxzLnIyOHNobChrTCwgc2hpZnQpO1xuICAgIGtSID0gdXRpbHMucjI4c2hsKGtSLCBzaGlmdCk7XG4gICAgdXRpbHMucGMyKGtMLCBrUiwgc3RhdGUua2V5cywgaSk7XG4gIH1cbn07XG5cbkRFUy5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIF91cGRhdGUoaW5wLCBpbk9mZiwgb3V0LCBvdXRPZmYpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fZGVzU3RhdGU7XG5cbiAgdmFyIGwgPSB1dGlscy5yZWFkVUludDMyQkUoaW5wLCBpbk9mZik7XG4gIHZhciByID0gdXRpbHMucmVhZFVJbnQzMkJFKGlucCwgaW5PZmYgKyA0KTtcblxuICAvLyBJbml0aWFsIFBlcm11dGF0aW9uXG4gIHV0aWxzLmlwKGwsIHIsIHN0YXRlLnRtcCwgMCk7XG4gIGwgPSBzdGF0ZS50bXBbMF07XG4gIHIgPSBzdGF0ZS50bXBbMV07XG5cbiAgaWYgKHRoaXMudHlwZSA9PT0gJ2VuY3J5cHQnKVxuICAgIHRoaXMuX2VuY3J5cHQoc3RhdGUsIGwsIHIsIHN0YXRlLnRtcCwgMCk7XG4gIGVsc2VcbiAgICB0aGlzLl9kZWNyeXB0KHN0YXRlLCBsLCByLCBzdGF0ZS50bXAsIDApO1xuXG4gIGwgPSBzdGF0ZS50bXBbMF07XG4gIHIgPSBzdGF0ZS50bXBbMV07XG5cbiAgdXRpbHMud3JpdGVVSW50MzJCRShvdXQsIGwsIG91dE9mZik7XG4gIHV0aWxzLndyaXRlVUludDMyQkUob3V0LCByLCBvdXRPZmYgKyA0KTtcbn07XG5cbkRFUy5wcm90b3R5cGUuX3BhZCA9IGZ1bmN0aW9uIF9wYWQoYnVmZmVyLCBvZmYpIHtcbiAgdmFyIHZhbHVlID0gYnVmZmVyLmxlbmd0aCAtIG9mZjtcbiAgZm9yICh2YXIgaSA9IG9mZjsgaSA8IGJ1ZmZlci5sZW5ndGg7IGkrKylcbiAgICBidWZmZXJbaV0gPSB2YWx1ZTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkRFUy5wcm90b3R5cGUuX3VucGFkID0gZnVuY3Rpb24gX3VucGFkKGJ1ZmZlcikge1xuICB2YXIgcGFkID0gYnVmZmVyW2J1ZmZlci5sZW5ndGggLSAxXTtcbiAgZm9yICh2YXIgaSA9IGJ1ZmZlci5sZW5ndGggLSBwYWQ7IGkgPCBidWZmZXIubGVuZ3RoOyBpKyspXG4gICAgYXNzZXJ0LmVxdWFsKGJ1ZmZlcltpXSwgcGFkKTtcblxuICByZXR1cm4gYnVmZmVyLnNsaWNlKDAsIGJ1ZmZlci5sZW5ndGggLSBwYWQpO1xufTtcblxuREVTLnByb3RvdHlwZS5fZW5jcnlwdCA9IGZ1bmN0aW9uIF9lbmNyeXB0KHN0YXRlLCBsU3RhcnQsIHJTdGFydCwgb3V0LCBvZmYpIHtcbiAgdmFyIGwgPSBsU3RhcnQ7XG4gIHZhciByID0gclN0YXJ0O1xuXG4gIC8vIEFwcGx5IGYoKSB4MTYgdGltZXNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZS5rZXlzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgdmFyIGtleUwgPSBzdGF0ZS5rZXlzW2ldO1xuICAgIHZhciBrZXlSID0gc3RhdGUua2V5c1tpICsgMV07XG5cbiAgICAvLyBmKHIsIGspXG4gICAgdXRpbHMuZXhwYW5kKHIsIHN0YXRlLnRtcCwgMCk7XG5cbiAgICBrZXlMIF49IHN0YXRlLnRtcFswXTtcbiAgICBrZXlSIF49IHN0YXRlLnRtcFsxXTtcbiAgICB2YXIgcyA9IHV0aWxzLnN1YnN0aXR1dGUoa2V5TCwga2V5Uik7XG4gICAgdmFyIGYgPSB1dGlscy5wZXJtdXRlKHMpO1xuXG4gICAgdmFyIHQgPSByO1xuICAgIHIgPSAobCBeIGYpID4+PiAwO1xuICAgIGwgPSB0O1xuICB9XG5cbiAgLy8gUmV2ZXJzZSBJbml0aWFsIFBlcm11dGF0aW9uXG4gIHV0aWxzLnJpcChyLCBsLCBvdXQsIG9mZik7XG59O1xuXG5ERVMucHJvdG90eXBlLl9kZWNyeXB0ID0gZnVuY3Rpb24gX2RlY3J5cHQoc3RhdGUsIGxTdGFydCwgclN0YXJ0LCBvdXQsIG9mZikge1xuICB2YXIgbCA9IHJTdGFydDtcbiAgdmFyIHIgPSBsU3RhcnQ7XG5cbiAgLy8gQXBwbHkgZigpIHgxNiB0aW1lc1xuICBmb3IgKHZhciBpID0gc3RhdGUua2V5cy5sZW5ndGggLSAyOyBpID49IDA7IGkgLT0gMikge1xuICAgIHZhciBrZXlMID0gc3RhdGUua2V5c1tpXTtcbiAgICB2YXIga2V5UiA9IHN0YXRlLmtleXNbaSArIDFdO1xuXG4gICAgLy8gZihyLCBrKVxuICAgIHV0aWxzLmV4cGFuZChsLCBzdGF0ZS50bXAsIDApO1xuXG4gICAga2V5TCBePSBzdGF0ZS50bXBbMF07XG4gICAga2V5UiBePSBzdGF0ZS50bXBbMV07XG4gICAgdmFyIHMgPSB1dGlscy5zdWJzdGl0dXRlKGtleUwsIGtleVIpO1xuICAgIHZhciBmID0gdXRpbHMucGVybXV0ZShzKTtcblxuICAgIHZhciB0ID0gbDtcbiAgICBsID0gKHIgXiBmKSA+Pj4gMDtcbiAgICByID0gdDtcbiAgfVxuXG4gIC8vIFJldmVyc2UgSW5pdGlhbCBQZXJtdXRhdGlvblxuICB1dGlscy5yaXAobCwgciwgb3V0LCBvZmYpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUoYnl0ZXMsIG9mZikge1xuICB2YXIgcmVzID0gIChieXRlc1swICsgb2ZmXSA8PCAyNCkgfFxuICAgICAgICAgICAgIChieXRlc1sxICsgb2ZmXSA8PCAxNikgfFxuICAgICAgICAgICAgIChieXRlc1syICsgb2ZmXSA8PCA4KSB8XG4gICAgICAgICAgICAgYnl0ZXNbMyArIG9mZl07XG4gIHJldHVybiByZXMgPj4+IDA7XG59O1xuXG5leHBvcnRzLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFKGJ5dGVzLCB2YWx1ZSwgb2ZmKSB7XG4gIGJ5dGVzWzAgKyBvZmZdID0gdmFsdWUgPj4+IDI0O1xuICBieXRlc1sxICsgb2ZmXSA9ICh2YWx1ZSA+Pj4gMTYpICYgMHhmZjtcbiAgYnl0ZXNbMiArIG9mZl0gPSAodmFsdWUgPj4+IDgpICYgMHhmZjtcbiAgYnl0ZXNbMyArIG9mZl0gPSB2YWx1ZSAmIDB4ZmY7XG59O1xuXG5leHBvcnRzLmlwID0gZnVuY3Rpb24gaXAoaW5MLCBpblIsIG91dCwgb2ZmKSB7XG4gIHZhciBvdXRMID0gMDtcbiAgdmFyIG91dFIgPSAwO1xuXG4gIGZvciAodmFyIGkgPSA2OyBpID49IDA7IGkgLT0gMikge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDw9IDI0OyBqICs9IDgpIHtcbiAgICAgIG91dEwgPDw9IDE7XG4gICAgICBvdXRMIHw9IChpblIgPj4+IChqICsgaSkpICYgMTtcbiAgICB9XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPD0gMjQ7IGogKz0gOCkge1xuICAgICAgb3V0TCA8PD0gMTtcbiAgICAgIG91dEwgfD0gKGluTCA+Pj4gKGogKyBpKSkgJiAxO1xuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSA2OyBpID49IDA7IGkgLT0gMikge1xuICAgIGZvciAodmFyIGogPSAxOyBqIDw9IDI1OyBqICs9IDgpIHtcbiAgICAgIG91dFIgPDw9IDE7XG4gICAgICBvdXRSIHw9IChpblIgPj4+IChqICsgaSkpICYgMTtcbiAgICB9XG4gICAgZm9yICh2YXIgaiA9IDE7IGogPD0gMjU7IGogKz0gOCkge1xuICAgICAgb3V0UiA8PD0gMTtcbiAgICAgIG91dFIgfD0gKGluTCA+Pj4gKGogKyBpKSkgJiAxO1xuICAgIH1cbiAgfVxuXG4gIG91dFtvZmYgKyAwXSA9IG91dEwgPj4+IDA7XG4gIG91dFtvZmYgKyAxXSA9IG91dFIgPj4+IDA7XG59O1xuXG5leHBvcnRzLnJpcCA9IGZ1bmN0aW9uIHJpcChpbkwsIGluUiwgb3V0LCBvZmYpIHtcbiAgdmFyIG91dEwgPSAwO1xuICB2YXIgb3V0UiA9IDA7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICBmb3IgKHZhciBqID0gMjQ7IGogPj0gMDsgaiAtPSA4KSB7XG4gICAgICBvdXRMIDw8PSAxO1xuICAgICAgb3V0TCB8PSAoaW5SID4+PiAoaiArIGkpKSAmIDE7XG4gICAgICBvdXRMIDw8PSAxO1xuICAgICAgb3V0TCB8PSAoaW5MID4+PiAoaiArIGkpKSAmIDE7XG4gICAgfVxuICB9XG4gIGZvciAodmFyIGkgPSA0OyBpIDwgODsgaSsrKSB7XG4gICAgZm9yICh2YXIgaiA9IDI0OyBqID49IDA7IGogLT0gOCkge1xuICAgICAgb3V0UiA8PD0gMTtcbiAgICAgIG91dFIgfD0gKGluUiA+Pj4gKGogKyBpKSkgJiAxO1xuICAgICAgb3V0UiA8PD0gMTtcbiAgICAgIG91dFIgfD0gKGluTCA+Pj4gKGogKyBpKSkgJiAxO1xuICAgIH1cbiAgfVxuXG4gIG91dFtvZmYgKyAwXSA9IG91dEwgPj4+IDA7XG4gIG91dFtvZmYgKyAxXSA9IG91dFIgPj4+IDA7XG59O1xuXG5leHBvcnRzLnBjMSA9IGZ1bmN0aW9uIHBjMShpbkwsIGluUiwgb3V0LCBvZmYpIHtcbiAgdmFyIG91dEwgPSAwO1xuICB2YXIgb3V0UiA9IDA7XG5cbiAgLy8gNywgMTUsIDIzLCAzMSwgMzksIDQ3LCA1NSwgNjNcbiAgLy8gNiwgMTQsIDIyLCAzMCwgMzksIDQ3LCA1NSwgNjNcbiAgLy8gNSwgMTMsIDIxLCAyOSwgMzksIDQ3LCA1NSwgNjNcbiAgLy8gNCwgMTIsIDIwLCAyOFxuICBmb3IgKHZhciBpID0gNzsgaSA+PSA1OyBpLS0pIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8PSAyNDsgaiArPSA4KSB7XG4gICAgICBvdXRMIDw8PSAxO1xuICAgICAgb3V0TCB8PSAoaW5SID4+IChqICsgaSkpICYgMTtcbiAgICB9XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPD0gMjQ7IGogKz0gOCkge1xuICAgICAgb3V0TCA8PD0gMTtcbiAgICAgIG91dEwgfD0gKGluTCA+PiAoaiArIGkpKSAmIDE7XG4gICAgfVxuICB9XG4gIGZvciAodmFyIGogPSAwOyBqIDw9IDI0OyBqICs9IDgpIHtcbiAgICBvdXRMIDw8PSAxO1xuICAgIG91dEwgfD0gKGluUiA+PiAoaiArIGkpKSAmIDE7XG4gIH1cblxuICAvLyAxLCA5LCAxNywgMjUsIDMzLCA0MSwgNDksIDU3XG4gIC8vIDIsIDEwLCAxOCwgMjYsIDM0LCA0MiwgNTAsIDU4XG4gIC8vIDMsIDExLCAxOSwgMjcsIDM1LCA0MywgNTEsIDU5XG4gIC8vIDM2LCA0NCwgNTIsIDYwXG4gIGZvciAodmFyIGkgPSAxOyBpIDw9IDM7IGkrKykge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDw9IDI0OyBqICs9IDgpIHtcbiAgICAgIG91dFIgPDw9IDE7XG4gICAgICBvdXRSIHw9IChpblIgPj4gKGogKyBpKSkgJiAxO1xuICAgIH1cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8PSAyNDsgaiArPSA4KSB7XG4gICAgICBvdXRSIDw8PSAxO1xuICAgICAgb3V0UiB8PSAoaW5MID4+IChqICsgaSkpICYgMTtcbiAgICB9XG4gIH1cbiAgZm9yICh2YXIgaiA9IDA7IGogPD0gMjQ7IGogKz0gOCkge1xuICAgIG91dFIgPDw9IDE7XG4gICAgb3V0UiB8PSAoaW5MID4+IChqICsgaSkpICYgMTtcbiAgfVxuXG4gIG91dFtvZmYgKyAwXSA9IG91dEwgPj4+IDA7XG4gIG91dFtvZmYgKyAxXSA9IG91dFIgPj4+IDA7XG59O1xuXG5leHBvcnRzLnIyOHNobCA9IGZ1bmN0aW9uIHIyOHNobChudW0sIHNoaWZ0KSB7XG4gIHJldHVybiAoKG51bSA8PCBzaGlmdCkgJiAweGZmZmZmZmYpIHwgKG51bSA+Pj4gKDI4IC0gc2hpZnQpKTtcbn07XG5cbnZhciBwYzJ0YWJsZSA9IFtcbiAgLy8gaW5MID0+IG91dExcbiAgMTQsIDExLCAxNywgNCwgMjcsIDIzLCAyNSwgMCxcbiAgMTMsIDIyLCA3LCAxOCwgNSwgOSwgMTYsIDI0LFxuICAyLCAyMCwgMTIsIDIxLCAxLCA4LCAxNSwgMjYsXG5cbiAgLy8gaW5SID0+IG91dFJcbiAgMTUsIDQsIDI1LCAxOSwgOSwgMSwgMjYsIDE2LFxuICA1LCAxMSwgMjMsIDgsIDEyLCA3LCAxNywgMCxcbiAgMjIsIDMsIDEwLCAxNCwgNiwgMjAsIDI3LCAyNFxuXTtcblxuZXhwb3J0cy5wYzIgPSBmdW5jdGlvbiBwYzIoaW5MLCBpblIsIG91dCwgb2ZmKSB7XG4gIHZhciBvdXRMID0gMDtcbiAgdmFyIG91dFIgPSAwO1xuXG4gIHZhciBsZW4gPSBwYzJ0YWJsZS5sZW5ndGggPj4+IDE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRMIDw8PSAxO1xuICAgIG91dEwgfD0gKGluTCA+Pj4gcGMydGFibGVbaV0pICYgMHgxO1xuICB9XG4gIGZvciAodmFyIGkgPSBsZW47IGkgPCBwYzJ0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgIG91dFIgPDw9IDE7XG4gICAgb3V0UiB8PSAoaW5SID4+PiBwYzJ0YWJsZVtpXSkgJiAweDE7XG4gIH1cblxuICBvdXRbb2ZmICsgMF0gPSBvdXRMID4+PiAwO1xuICBvdXRbb2ZmICsgMV0gPSBvdXRSID4+PiAwO1xufTtcblxuZXhwb3J0cy5leHBhbmQgPSBmdW5jdGlvbiBleHBhbmQociwgb3V0LCBvZmYpIHtcbiAgdmFyIG91dEwgPSAwO1xuICB2YXIgb3V0UiA9IDA7XG5cbiAgb3V0TCA9ICgociAmIDEpIDw8IDUpIHwgKHIgPj4+IDI3KTtcbiAgZm9yICh2YXIgaSA9IDIzOyBpID49IDE1OyBpIC09IDQpIHtcbiAgICBvdXRMIDw8PSA2O1xuICAgIG91dEwgfD0gKHIgPj4+IGkpICYgMHgzZjtcbiAgfVxuICBmb3IgKHZhciBpID0gMTE7IGkgPj0gMzsgaSAtPSA0KSB7XG4gICAgb3V0UiB8PSAociA+Pj4gaSkgJiAweDNmO1xuICAgIG91dFIgPDw9IDY7XG4gIH1cbiAgb3V0UiB8PSAoKHIgJiAweDFmKSA8PCAxKSB8IChyID4+PiAzMSk7XG5cbiAgb3V0W29mZiArIDBdID0gb3V0TCA+Pj4gMDtcbiAgb3V0W29mZiArIDFdID0gb3V0UiA+Pj4gMDtcbn07XG5cbnZhciBzVGFibGUgPSBbXG4gIDE0LCAwLCA0LCAxNSwgMTMsIDcsIDEsIDQsIDIsIDE0LCAxNSwgMiwgMTEsIDEzLCA4LCAxLFxuICAzLCAxMCwgMTAsIDYsIDYsIDEyLCAxMiwgMTEsIDUsIDksIDksIDUsIDAsIDMsIDcsIDgsXG4gIDQsIDE1LCAxLCAxMiwgMTQsIDgsIDgsIDIsIDEzLCA0LCA2LCA5LCAyLCAxLCAxMSwgNyxcbiAgMTUsIDUsIDEyLCAxMSwgOSwgMywgNywgMTQsIDMsIDEwLCAxMCwgMCwgNSwgNiwgMCwgMTMsXG5cbiAgMTUsIDMsIDEsIDEzLCA4LCA0LCAxNCwgNywgNiwgMTUsIDExLCAyLCAzLCA4LCA0LCAxNCxcbiAgOSwgMTIsIDcsIDAsIDIsIDEsIDEzLCAxMCwgMTIsIDYsIDAsIDksIDUsIDExLCAxMCwgNSxcbiAgMCwgMTMsIDE0LCA4LCA3LCAxMCwgMTEsIDEsIDEwLCAzLCA0LCAxNSwgMTMsIDQsIDEsIDIsXG4gIDUsIDExLCA4LCA2LCAxMiwgNywgNiwgMTIsIDksIDAsIDMsIDUsIDIsIDE0LCAxNSwgOSxcblxuICAxMCwgMTMsIDAsIDcsIDksIDAsIDE0LCA5LCA2LCAzLCAzLCA0LCAxNSwgNiwgNSwgMTAsXG4gIDEsIDIsIDEzLCA4LCAxMiwgNSwgNywgMTQsIDExLCAxMiwgNCwgMTEsIDIsIDE1LCA4LCAxLFxuICAxMywgMSwgNiwgMTAsIDQsIDEzLCA5LCAwLCA4LCA2LCAxNSwgOSwgMywgOCwgMCwgNyxcbiAgMTEsIDQsIDEsIDE1LCAyLCAxNCwgMTIsIDMsIDUsIDExLCAxMCwgNSwgMTQsIDIsIDcsIDEyLFxuXG4gIDcsIDEzLCAxMywgOCwgMTQsIDExLCAzLCA1LCAwLCA2LCA2LCAxNSwgOSwgMCwgMTAsIDMsXG4gIDEsIDQsIDIsIDcsIDgsIDIsIDUsIDEyLCAxMSwgMSwgMTIsIDEwLCA0LCAxNCwgMTUsIDksXG4gIDEwLCAzLCA2LCAxNSwgOSwgMCwgMCwgNiwgMTIsIDEwLCAxMSwgMSwgNywgMTMsIDEzLCA4LFxuICAxNSwgOSwgMSwgNCwgMywgNSwgMTQsIDExLCA1LCAxMiwgMiwgNywgOCwgMiwgNCwgMTQsXG5cbiAgMiwgMTQsIDEyLCAxMSwgNCwgMiwgMSwgMTIsIDcsIDQsIDEwLCA3LCAxMSwgMTMsIDYsIDEsXG4gIDgsIDUsIDUsIDAsIDMsIDE1LCAxNSwgMTAsIDEzLCAzLCAwLCA5LCAxNCwgOCwgOSwgNixcbiAgNCwgMTEsIDIsIDgsIDEsIDEyLCAxMSwgNywgMTAsIDEsIDEzLCAxNCwgNywgMiwgOCwgMTMsXG4gIDE1LCA2LCA5LCAxNSwgMTIsIDAsIDUsIDksIDYsIDEwLCAzLCA0LCAwLCA1LCAxNCwgMyxcblxuICAxMiwgMTAsIDEsIDE1LCAxMCwgNCwgMTUsIDIsIDksIDcsIDIsIDEyLCA2LCA5LCA4LCA1LFxuICAwLCA2LCAxMywgMSwgMywgMTMsIDQsIDE0LCAxNCwgMCwgNywgMTEsIDUsIDMsIDExLCA4LFxuICA5LCA0LCAxNCwgMywgMTUsIDIsIDUsIDEyLCAyLCA5LCA4LCA1LCAxMiwgMTUsIDMsIDEwLFxuICA3LCAxMSwgMCwgMTQsIDQsIDEsIDEwLCA3LCAxLCA2LCAxMywgMCwgMTEsIDgsIDYsIDEzLFxuXG4gIDQsIDEzLCAxMSwgMCwgMiwgMTEsIDE0LCA3LCAxNSwgNCwgMCwgOSwgOCwgMSwgMTMsIDEwLFxuICAzLCAxNCwgMTIsIDMsIDksIDUsIDcsIDEyLCA1LCAyLCAxMCwgMTUsIDYsIDgsIDEsIDYsXG4gIDEsIDYsIDQsIDExLCAxMSwgMTMsIDEzLCA4LCAxMiwgMSwgMywgNCwgNywgMTAsIDE0LCA3LFxuICAxMCwgOSwgMTUsIDUsIDYsIDAsIDgsIDE1LCAwLCAxNCwgNSwgMiwgOSwgMywgMiwgMTIsXG5cbiAgMTMsIDEsIDIsIDE1LCA4LCAxMywgNCwgOCwgNiwgMTAsIDE1LCAzLCAxMSwgNywgMSwgNCxcbiAgMTAsIDEyLCA5LCA1LCAzLCA2LCAxNCwgMTEsIDUsIDAsIDAsIDE0LCAxMiwgOSwgNywgMixcbiAgNywgMiwgMTEsIDEsIDQsIDE0LCAxLCA3LCA5LCA0LCAxMiwgMTAsIDE0LCA4LCAyLCAxMyxcbiAgMCwgMTUsIDYsIDEyLCAxMCwgOSwgMTMsIDAsIDE1LCAzLCAzLCA1LCA1LCA2LCA4LCAxMVxuXTtcblxuZXhwb3J0cy5zdWJzdGl0dXRlID0gZnVuY3Rpb24gc3Vic3RpdHV0ZShpbkwsIGluUikge1xuICB2YXIgb3V0ID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICB2YXIgYiA9IChpbkwgPj4+ICgxOCAtIGkgKiA2KSkgJiAweDNmO1xuICAgIHZhciBzYiA9IHNUYWJsZVtpICogMHg0MCArIGJdO1xuXG4gICAgb3V0IDw8PSA0O1xuICAgIG91dCB8PSBzYjtcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgIHZhciBiID0gKGluUiA+Pj4gKDE4IC0gaSAqIDYpKSAmIDB4M2Y7XG4gICAgdmFyIHNiID0gc1RhYmxlWzQgKiAweDQwICsgaSAqIDB4NDAgKyBiXTtcblxuICAgIG91dCA8PD0gNDtcbiAgICBvdXQgfD0gc2I7XG4gIH1cbiAgcmV0dXJuIG91dCA+Pj4gMDtcbn07XG5cbnZhciBwZXJtdXRlVGFibGUgPSBbXG4gIDE2LCAyNSwgMTIsIDExLCAzLCAyMCwgNCwgMTUsIDMxLCAxNywgOSwgNiwgMjcsIDE0LCAxLCAyMixcbiAgMzAsIDI0LCA4LCAxOCwgMCwgNSwgMjksIDIzLCAxMywgMTksIDIsIDI2LCAxMCwgMjEsIDI4LCA3XG5dO1xuXG5leHBvcnRzLnBlcm11dGUgPSBmdW5jdGlvbiBwZXJtdXRlKG51bSkge1xuICB2YXIgb3V0ID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwZXJtdXRlVGFibGUubGVuZ3RoOyBpKyspIHtcbiAgICBvdXQgPDw9IDE7XG4gICAgb3V0IHw9IChudW0gPj4+IHBlcm11dGVUYWJsZVtpXSkgJiAweDE7XG4gIH1cbiAgcmV0dXJuIG91dCA+Pj4gMDtcbn07XG5cbmV4cG9ydHMucGFkU3BsaXQgPSBmdW5jdGlvbiBwYWRTcGxpdChudW0sIHNpemUsIGdyb3VwKSB7XG4gIHZhciBzdHIgPSBudW0udG9TdHJpbmcoMik7XG4gIHdoaWxlIChzdHIubGVuZ3RoIDwgc2l6ZSlcbiAgICBzdHIgPSAnMCcgKyBzdHI7XG5cbiAgdmFyIG91dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkgKz0gZ3JvdXApXG4gICAgb3V0LnB1c2goc3RyLnNsaWNlKGksIGkgKyBncm91cCkpO1xuICByZXR1cm4gb3V0LmpvaW4oJyAnKTtcbn07XG4iXSwic291cmNlUm9vdCI6IiJ9