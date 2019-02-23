(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.bn.js"],{

/***/ "OZ/i":
/*!**************************************!*\
  !*** ./node_modules/bn.js/lib/bn.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {(function (module, exports) {
  'use strict';

  // Utils
  function assert (val, msg) {
    if (!val) throw new Error(msg || 'Assertion failed');
  }

  // Could use `inherits` module, but don't want to move from single file
  // architecture yet.
  function inherits (ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  }

  // BN

  function BN (number, base, endian) {
    if (BN.isBN(number)) {
      return number;
    }

    this.negative = 0;
    this.words = null;
    this.length = 0;

    // Reduction context
    this.red = null;

    if (number !== null) {
      if (base === 'le' || base === 'be') {
        endian = base;
        base = 10;
      }

      this._init(number || 0, base || 10, endian || 'be');
    }
  }
  if (typeof module === 'object') {
    module.exports = BN;
  } else {
    exports.BN = BN;
  }

  BN.BN = BN;
  BN.wordSize = 26;

  var Buffer;
  try {
    Buffer = __webpack_require__(/*! buffer */ 2).Buffer;
  } catch (e) {
  }

  BN.isBN = function isBN (num) {
    if (num instanceof BN) {
      return true;
    }

    return num !== null && typeof num === 'object' &&
      num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
  };

  BN.max = function max (left, right) {
    if (left.cmp(right) > 0) return left;
    return right;
  };

  BN.min = function min (left, right) {
    if (left.cmp(right) < 0) return left;
    return right;
  };

  BN.prototype._init = function init (number, base, endian) {
    if (typeof number === 'number') {
      return this._initNumber(number, base, endian);
    }

    if (typeof number === 'object') {
      return this._initArray(number, base, endian);
    }

    if (base === 'hex') {
      base = 16;
    }
    assert(base === (base | 0) && base >= 2 && base <= 36);

    number = number.toString().replace(/\s+/g, '');
    var start = 0;
    if (number[0] === '-') {
      start++;
    }

    if (base === 16) {
      this._parseHex(number, start);
    } else {
      this._parseBase(number, base, start);
    }

    if (number[0] === '-') {
      this.negative = 1;
    }

    this.strip();

    if (endian !== 'le') return;

    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initNumber = function _initNumber (number, base, endian) {
    if (number < 0) {
      this.negative = 1;
      number = -number;
    }
    if (number < 0x4000000) {
      this.words = [ number & 0x3ffffff ];
      this.length = 1;
    } else if (number < 0x10000000000000) {
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff
      ];
      this.length = 2;
    } else {
      assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff,
        1
      ];
      this.length = 3;
    }

    if (endian !== 'le') return;

    // Reverse the bytes
    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initArray = function _initArray (number, base, endian) {
    // Perhaps a Uint8Array
    assert(typeof number.length === 'number');
    if (number.length <= 0) {
      this.words = [ 0 ];
      this.length = 1;
      return this;
    }

    this.length = Math.ceil(number.length / 3);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    var off = 0;
    if (endian === 'be') {
      for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
        w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    } else if (endian === 'le') {
      for (i = 0, j = 0; i < number.length; i += 3) {
        w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    }
    return this.strip();
  };

  function parseHex (str, start, end) {
    var r = 0;
    var len = Math.min(str.length, end);
    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;

      r <<= 4;

      // 'a' - 'f'
      if (c >= 49 && c <= 54) {
        r |= c - 49 + 0xa;

      // 'A' - 'F'
      } else if (c >= 17 && c <= 22) {
        r |= c - 17 + 0xa;

      // '0' - '9'
      } else {
        r |= c & 0xf;
      }
    }
    return r;
  }

  BN.prototype._parseHex = function _parseHex (number, start) {
    // Create possibly bigger array to ensure that it fits the number
    this.length = Math.ceil((number.length - start) / 6);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    // Scan 24-bit chunks and add them to the number
    var off = 0;
    for (i = number.length - 6, j = 0; i >= start; i -= 6) {
      w = parseHex(number, i, i + 6);
      this.words[j] |= (w << off) & 0x3ffffff;
      // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb
      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
      off += 24;
      if (off >= 26) {
        off -= 26;
        j++;
      }
    }
    if (i + 6 !== start) {
      w = parseHex(number, start, i + 6);
      this.words[j] |= (w << off) & 0x3ffffff;
      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
    }
    this.strip();
  };

  function parseBase (str, start, end, mul) {
    var r = 0;
    var len = Math.min(str.length, end);
    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;

      r *= mul;

      // 'a'
      if (c >= 49) {
        r += c - 49 + 0xa;

      // 'A'
      } else if (c >= 17) {
        r += c - 17 + 0xa;

      // '0' - '9'
      } else {
        r += c;
      }
    }
    return r;
  }

  BN.prototype._parseBase = function _parseBase (number, base, start) {
    // Initialize as zero
    this.words = [ 0 ];
    this.length = 1;

    // Find length of limb in base
    for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
      limbLen++;
    }
    limbLen--;
    limbPow = (limbPow / base) | 0;

    var total = number.length - start;
    var mod = total % limbLen;
    var end = Math.min(total, total - mod) + start;

    var word = 0;
    for (var i = start; i < end; i += limbLen) {
      word = parseBase(number, i, i + limbLen, base);

      this.imuln(limbPow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }

    if (mod !== 0) {
      var pow = 1;
      word = parseBase(number, i, number.length, base);

      for (i = 0; i < mod; i++) {
        pow *= base;
      }

      this.imuln(pow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }
  };

  BN.prototype.copy = function copy (dest) {
    dest.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      dest.words[i] = this.words[i];
    }
    dest.length = this.length;
    dest.negative = this.negative;
    dest.red = this.red;
  };

  BN.prototype.clone = function clone () {
    var r = new BN(null);
    this.copy(r);
    return r;
  };

  BN.prototype._expand = function _expand (size) {
    while (this.length < size) {
      this.words[this.length++] = 0;
    }
    return this;
  };

  // Remove leading `0` from `this`
  BN.prototype.strip = function strip () {
    while (this.length > 1 && this.words[this.length - 1] === 0) {
      this.length--;
    }
    return this._normSign();
  };

  BN.prototype._normSign = function _normSign () {
    // -0 = 0
    if (this.length === 1 && this.words[0] === 0) {
      this.negative = 0;
    }
    return this;
  };

  BN.prototype.inspect = function inspect () {
    return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
  };

  /*

  var zeros = [];
  var groupSizes = [];
  var groupBases = [];

  var s = '';
  var i = -1;
  while (++i < BN.wordSize) {
    zeros[i] = s;
    s += '0';
  }
  groupSizes[0] = 0;
  groupSizes[1] = 0;
  groupBases[0] = 0;
  groupBases[1] = 0;
  var base = 2 - 1;
  while (++base < 36 + 1) {
    var groupSize = 0;
    var groupBase = 1;
    while (groupBase < (1 << BN.wordSize) / base) {
      groupBase *= base;
      groupSize += 1;
    }
    groupSizes[base] = groupSize;
    groupBases[base] = groupBase;
  }

  */

  var zeros = [
    '',
    '0',
    '00',
    '000',
    '0000',
    '00000',
    '000000',
    '0000000',
    '00000000',
    '000000000',
    '0000000000',
    '00000000000',
    '000000000000',
    '0000000000000',
    '00000000000000',
    '000000000000000',
    '0000000000000000',
    '00000000000000000',
    '000000000000000000',
    '0000000000000000000',
    '00000000000000000000',
    '000000000000000000000',
    '0000000000000000000000',
    '00000000000000000000000',
    '000000000000000000000000',
    '0000000000000000000000000'
  ];

  var groupSizes = [
    0, 0,
    25, 16, 12, 11, 10, 9, 8,
    8, 7, 7, 7, 7, 6, 6,
    6, 6, 6, 6, 6, 5, 5,
    5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5
  ];

  var groupBases = [
    0, 0,
    33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
    43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
    16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
    6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
    24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
  ];

  BN.prototype.toString = function toString (base, padding) {
    base = base || 10;
    padding = padding | 0 || 1;

    var out;
    if (base === 16 || base === 'hex') {
      out = '';
      var off = 0;
      var carry = 0;
      for (var i = 0; i < this.length; i++) {
        var w = this.words[i];
        var word = (((w << off) | carry) & 0xffffff).toString(16);
        carry = (w >>> (24 - off)) & 0xffffff;
        if (carry !== 0 || i !== this.length - 1) {
          out = zeros[6 - word.length] + word + out;
        } else {
          out = word + out;
        }
        off += 2;
        if (off >= 26) {
          off -= 26;
          i--;
        }
      }
      if (carry !== 0) {
        out = carry.toString(16) + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    if (base === (base | 0) && base >= 2 && base <= 36) {
      // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
      var groupSize = groupSizes[base];
      // var groupBase = Math.pow(base, groupSize);
      var groupBase = groupBases[base];
      out = '';
      var c = this.clone();
      c.negative = 0;
      while (!c.isZero()) {
        var r = c.modn(groupBase).toString(base);
        c = c.idivn(groupBase);

        if (!c.isZero()) {
          out = zeros[groupSize - r.length] + r + out;
        } else {
          out = r + out;
        }
      }
      if (this.isZero()) {
        out = '0' + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    assert(false, 'Base should be between 2 and 36');
  };

  BN.prototype.toNumber = function toNumber () {
    var ret = this.words[0];
    if (this.length === 2) {
      ret += this.words[1] * 0x4000000;
    } else if (this.length === 3 && this.words[2] === 0x01) {
      // NOTE: at this stage it is known that the top bit is set
      ret += 0x10000000000000 + (this.words[1] * 0x4000000);
    } else if (this.length > 2) {
      assert(false, 'Number can only safely store up to 53 bits');
    }
    return (this.negative !== 0) ? -ret : ret;
  };

  BN.prototype.toJSON = function toJSON () {
    return this.toString(16);
  };

  BN.prototype.toBuffer = function toBuffer (endian, length) {
    assert(typeof Buffer !== 'undefined');
    return this.toArrayLike(Buffer, endian, length);
  };

  BN.prototype.toArray = function toArray (endian, length) {
    return this.toArrayLike(Array, endian, length);
  };

  BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
    var byteLength = this.byteLength();
    var reqLength = length || Math.max(1, byteLength);
    assert(byteLength <= reqLength, 'byte array longer than desired length');
    assert(reqLength > 0, 'Requested array length <= 0');

    this.strip();
    var littleEndian = endian === 'le';
    var res = new ArrayType(reqLength);

    var b, i;
    var q = this.clone();
    if (!littleEndian) {
      // Assume big-endian
      for (i = 0; i < reqLength - byteLength; i++) {
        res[i] = 0;
      }

      for (i = 0; !q.isZero(); i++) {
        b = q.andln(0xff);
        q.iushrn(8);

        res[reqLength - i - 1] = b;
      }
    } else {
      for (i = 0; !q.isZero(); i++) {
        b = q.andln(0xff);
        q.iushrn(8);

        res[i] = b;
      }

      for (; i < reqLength; i++) {
        res[i] = 0;
      }
    }

    return res;
  };

  if (Math.clz32) {
    BN.prototype._countBits = function _countBits (w) {
      return 32 - Math.clz32(w);
    };
  } else {
    BN.prototype._countBits = function _countBits (w) {
      var t = w;
      var r = 0;
      if (t >= 0x1000) {
        r += 13;
        t >>>= 13;
      }
      if (t >= 0x40) {
        r += 7;
        t >>>= 7;
      }
      if (t >= 0x8) {
        r += 4;
        t >>>= 4;
      }
      if (t >= 0x02) {
        r += 2;
        t >>>= 2;
      }
      return r + t;
    };
  }

  BN.prototype._zeroBits = function _zeroBits (w) {
    // Short-cut
    if (w === 0) return 26;

    var t = w;
    var r = 0;
    if ((t & 0x1fff) === 0) {
      r += 13;
      t >>>= 13;
    }
    if ((t & 0x7f) === 0) {
      r += 7;
      t >>>= 7;
    }
    if ((t & 0xf) === 0) {
      r += 4;
      t >>>= 4;
    }
    if ((t & 0x3) === 0) {
      r += 2;
      t >>>= 2;
    }
    if ((t & 0x1) === 0) {
      r++;
    }
    return r;
  };

  // Return number of used bits in a BN
  BN.prototype.bitLength = function bitLength () {
    var w = this.words[this.length - 1];
    var hi = this._countBits(w);
    return (this.length - 1) * 26 + hi;
  };

  function toBitArray (num) {
    var w = new Array(num.bitLength());

    for (var bit = 0; bit < w.length; bit++) {
      var off = (bit / 26) | 0;
      var wbit = bit % 26;

      w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
    }

    return w;
  }

  // Number of trailing zero bits
  BN.prototype.zeroBits = function zeroBits () {
    if (this.isZero()) return 0;

    var r = 0;
    for (var i = 0; i < this.length; i++) {
      var b = this._zeroBits(this.words[i]);
      r += b;
      if (b !== 26) break;
    }
    return r;
  };

  BN.prototype.byteLength = function byteLength () {
    return Math.ceil(this.bitLength() / 8);
  };

  BN.prototype.toTwos = function toTwos (width) {
    if (this.negative !== 0) {
      return this.abs().inotn(width).iaddn(1);
    }
    return this.clone();
  };

  BN.prototype.fromTwos = function fromTwos (width) {
    if (this.testn(width - 1)) {
      return this.notn(width).iaddn(1).ineg();
    }
    return this.clone();
  };

  BN.prototype.isNeg = function isNeg () {
    return this.negative !== 0;
  };

  // Return negative clone of `this`
  BN.prototype.neg = function neg () {
    return this.clone().ineg();
  };

  BN.prototype.ineg = function ineg () {
    if (!this.isZero()) {
      this.negative ^= 1;
    }

    return this;
  };

  // Or `num` with `this` in-place
  BN.prototype.iuor = function iuor (num) {
    while (this.length < num.length) {
      this.words[this.length++] = 0;
    }

    for (var i = 0; i < num.length; i++) {
      this.words[i] = this.words[i] | num.words[i];
    }

    return this.strip();
  };

  BN.prototype.ior = function ior (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuor(num);
  };

  // Or `num` with `this`
  BN.prototype.or = function or (num) {
    if (this.length > num.length) return this.clone().ior(num);
    return num.clone().ior(this);
  };

  BN.prototype.uor = function uor (num) {
    if (this.length > num.length) return this.clone().iuor(num);
    return num.clone().iuor(this);
  };

  // And `num` with `this` in-place
  BN.prototype.iuand = function iuand (num) {
    // b = min-length(num, this)
    var b;
    if (this.length > num.length) {
      b = num;
    } else {
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = this.words[i] & num.words[i];
    }

    this.length = b.length;

    return this.strip();
  };

  BN.prototype.iand = function iand (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuand(num);
  };

  // And `num` with `this`
  BN.prototype.and = function and (num) {
    if (this.length > num.length) return this.clone().iand(num);
    return num.clone().iand(this);
  };

  BN.prototype.uand = function uand (num) {
    if (this.length > num.length) return this.clone().iuand(num);
    return num.clone().iuand(this);
  };

  // Xor `num` with `this` in-place
  BN.prototype.iuxor = function iuxor (num) {
    // a.length > b.length
    var a;
    var b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = a.words[i] ^ b.words[i];
    }

    if (this !== a) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = a.length;

    return this.strip();
  };

  BN.prototype.ixor = function ixor (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuxor(num);
  };

  // Xor `num` with `this`
  BN.prototype.xor = function xor (num) {
    if (this.length > num.length) return this.clone().ixor(num);
    return num.clone().ixor(this);
  };

  BN.prototype.uxor = function uxor (num) {
    if (this.length > num.length) return this.clone().iuxor(num);
    return num.clone().iuxor(this);
  };

  // Not ``this`` with ``width`` bitwidth
  BN.prototype.inotn = function inotn (width) {
    assert(typeof width === 'number' && width >= 0);

    var bytesNeeded = Math.ceil(width / 26) | 0;
    var bitsLeft = width % 26;

    // Extend the buffer with leading zeroes
    this._expand(bytesNeeded);

    if (bitsLeft > 0) {
      bytesNeeded--;
    }

    // Handle complete words
    for (var i = 0; i < bytesNeeded; i++) {
      this.words[i] = ~this.words[i] & 0x3ffffff;
    }

    // Handle the residue
    if (bitsLeft > 0) {
      this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
    }

    // And remove leading zeroes
    return this.strip();
  };

  BN.prototype.notn = function notn (width) {
    return this.clone().inotn(width);
  };

  // Set `bit` of `this`
  BN.prototype.setn = function setn (bit, val) {
    assert(typeof bit === 'number' && bit >= 0);

    var off = (bit / 26) | 0;
    var wbit = bit % 26;

    this._expand(off + 1);

    if (val) {
      this.words[off] = this.words[off] | (1 << wbit);
    } else {
      this.words[off] = this.words[off] & ~(1 << wbit);
    }

    return this.strip();
  };

  // Add `num` to `this` in-place
  BN.prototype.iadd = function iadd (num) {
    var r;

    // negative + positive
    if (this.negative !== 0 && num.negative === 0) {
      this.negative = 0;
      r = this.isub(num);
      this.negative ^= 1;
      return this._normSign();

    // positive + negative
    } else if (this.negative === 0 && num.negative !== 0) {
      num.negative = 0;
      r = this.isub(num);
      num.negative = 1;
      return r._normSign();
    }

    // a.length > b.length
    var a, b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }

    this.length = a.length;
    if (carry !== 0) {
      this.words[this.length] = carry;
      this.length++;
    // Copy the rest of the words
    } else if (a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    return this;
  };

  // Add `num` to `this`
  BN.prototype.add = function add (num) {
    var res;
    if (num.negative !== 0 && this.negative === 0) {
      num.negative = 0;
      res = this.sub(num);
      num.negative ^= 1;
      return res;
    } else if (num.negative === 0 && this.negative !== 0) {
      this.negative = 0;
      res = num.sub(this);
      this.negative = 1;
      return res;
    }

    if (this.length > num.length) return this.clone().iadd(num);

    return num.clone().iadd(this);
  };

  // Subtract `num` from `this` in-place
  BN.prototype.isub = function isub (num) {
    // this - (-num) = this + num
    if (num.negative !== 0) {
      num.negative = 0;
      var r = this.iadd(num);
      num.negative = 1;
      return r._normSign();

    // -this - num = -(this + num)
    } else if (this.negative !== 0) {
      this.negative = 0;
      this.iadd(num);
      this.negative = 1;
      return this._normSign();
    }

    // At this point both numbers are positive
    var cmp = this.cmp(num);

    // Optimization - zeroify
    if (cmp === 0) {
      this.negative = 0;
      this.length = 1;
      this.words[0] = 0;
      return this;
    }

    // a > b
    var a, b;
    if (cmp > 0) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }

    // Copy rest of the words
    if (carry === 0 && i < a.length && a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = Math.max(this.length, i);

    if (a !== this) {
      this.negative = 1;
    }

    return this.strip();
  };

  // Subtract `num` from `this`
  BN.prototype.sub = function sub (num) {
    return this.clone().isub(num);
  };

  function smallMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    var len = (self.length + num.length) | 0;
    out.length = len;
    len = (len - 1) | 0;

    // Peel one iteration (compiler can't do it, because of code complexity)
    var a = self.words[0] | 0;
    var b = num.words[0] | 0;
    var r = a * b;

    var lo = r & 0x3ffffff;
    var carry = (r / 0x4000000) | 0;
    out.words[0] = lo;

    for (var k = 1; k < len; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = carry >>> 26;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = (k - j) | 0;
        a = self.words[i] | 0;
        b = num.words[j] | 0;
        r = a * b + rword;
        ncarry += (r / 0x4000000) | 0;
        rword = r & 0x3ffffff;
      }
      out.words[k] = rword | 0;
      carry = ncarry | 0;
    }
    if (carry !== 0) {
      out.words[k] = carry | 0;
    } else {
      out.length--;
    }

    return out.strip();
  }

  // TODO(indutny): it may be reasonable to omit it for users who don't need
  // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
  // multiplication (like elliptic secp256k1).
  var comb10MulTo = function comb10MulTo (self, num, out) {
    var a = self.words;
    var b = num.words;
    var o = out.words;
    var c = 0;
    var lo;
    var mid;
    var hi;
    var a0 = a[0] | 0;
    var al0 = a0 & 0x1fff;
    var ah0 = a0 >>> 13;
    var a1 = a[1] | 0;
    var al1 = a1 & 0x1fff;
    var ah1 = a1 >>> 13;
    var a2 = a[2] | 0;
    var al2 = a2 & 0x1fff;
    var ah2 = a2 >>> 13;
    var a3 = a[3] | 0;
    var al3 = a3 & 0x1fff;
    var ah3 = a3 >>> 13;
    var a4 = a[4] | 0;
    var al4 = a4 & 0x1fff;
    var ah4 = a4 >>> 13;
    var a5 = a[5] | 0;
    var al5 = a5 & 0x1fff;
    var ah5 = a5 >>> 13;
    var a6 = a[6] | 0;
    var al6 = a6 & 0x1fff;
    var ah6 = a6 >>> 13;
    var a7 = a[7] | 0;
    var al7 = a7 & 0x1fff;
    var ah7 = a7 >>> 13;
    var a8 = a[8] | 0;
    var al8 = a8 & 0x1fff;
    var ah8 = a8 >>> 13;
    var a9 = a[9] | 0;
    var al9 = a9 & 0x1fff;
    var ah9 = a9 >>> 13;
    var b0 = b[0] | 0;
    var bl0 = b0 & 0x1fff;
    var bh0 = b0 >>> 13;
    var b1 = b[1] | 0;
    var bl1 = b1 & 0x1fff;
    var bh1 = b1 >>> 13;
    var b2 = b[2] | 0;
    var bl2 = b2 & 0x1fff;
    var bh2 = b2 >>> 13;
    var b3 = b[3] | 0;
    var bl3 = b3 & 0x1fff;
    var bh3 = b3 >>> 13;
    var b4 = b[4] | 0;
    var bl4 = b4 & 0x1fff;
    var bh4 = b4 >>> 13;
    var b5 = b[5] | 0;
    var bl5 = b5 & 0x1fff;
    var bh5 = b5 >>> 13;
    var b6 = b[6] | 0;
    var bl6 = b6 & 0x1fff;
    var bh6 = b6 >>> 13;
    var b7 = b[7] | 0;
    var bl7 = b7 & 0x1fff;
    var bh7 = b7 >>> 13;
    var b8 = b[8] | 0;
    var bl8 = b8 & 0x1fff;
    var bh8 = b8 >>> 13;
    var b9 = b[9] | 0;
    var bl9 = b9 & 0x1fff;
    var bh9 = b9 >>> 13;

    out.negative = self.negative ^ num.negative;
    out.length = 19;
    /* k = 0 */
    lo = Math.imul(al0, bl0);
    mid = Math.imul(al0, bh0);
    mid = (mid + Math.imul(ah0, bl0)) | 0;
    hi = Math.imul(ah0, bh0);
    var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
    w0 &= 0x3ffffff;
    /* k = 1 */
    lo = Math.imul(al1, bl0);
    mid = Math.imul(al1, bh0);
    mid = (mid + Math.imul(ah1, bl0)) | 0;
    hi = Math.imul(ah1, bh0);
    lo = (lo + Math.imul(al0, bl1)) | 0;
    mid = (mid + Math.imul(al0, bh1)) | 0;
    mid = (mid + Math.imul(ah0, bl1)) | 0;
    hi = (hi + Math.imul(ah0, bh1)) | 0;
    var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
    w1 &= 0x3ffffff;
    /* k = 2 */
    lo = Math.imul(al2, bl0);
    mid = Math.imul(al2, bh0);
    mid = (mid + Math.imul(ah2, bl0)) | 0;
    hi = Math.imul(ah2, bh0);
    lo = (lo + Math.imul(al1, bl1)) | 0;
    mid = (mid + Math.imul(al1, bh1)) | 0;
    mid = (mid + Math.imul(ah1, bl1)) | 0;
    hi = (hi + Math.imul(ah1, bh1)) | 0;
    lo = (lo + Math.imul(al0, bl2)) | 0;
    mid = (mid + Math.imul(al0, bh2)) | 0;
    mid = (mid + Math.imul(ah0, bl2)) | 0;
    hi = (hi + Math.imul(ah0, bh2)) | 0;
    var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
    w2 &= 0x3ffffff;
    /* k = 3 */
    lo = Math.imul(al3, bl0);
    mid = Math.imul(al3, bh0);
    mid = (mid + Math.imul(ah3, bl0)) | 0;
    hi = Math.imul(ah3, bh0);
    lo = (lo + Math.imul(al2, bl1)) | 0;
    mid = (mid + Math.imul(al2, bh1)) | 0;
    mid = (mid + Math.imul(ah2, bl1)) | 0;
    hi = (hi + Math.imul(ah2, bh1)) | 0;
    lo = (lo + Math.imul(al1, bl2)) | 0;
    mid = (mid + Math.imul(al1, bh2)) | 0;
    mid = (mid + Math.imul(ah1, bl2)) | 0;
    hi = (hi + Math.imul(ah1, bh2)) | 0;
    lo = (lo + Math.imul(al0, bl3)) | 0;
    mid = (mid + Math.imul(al0, bh3)) | 0;
    mid = (mid + Math.imul(ah0, bl3)) | 0;
    hi = (hi + Math.imul(ah0, bh3)) | 0;
    var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
    w3 &= 0x3ffffff;
    /* k = 4 */
    lo = Math.imul(al4, bl0);
    mid = Math.imul(al4, bh0);
    mid = (mid + Math.imul(ah4, bl0)) | 0;
    hi = Math.imul(ah4, bh0);
    lo = (lo + Math.imul(al3, bl1)) | 0;
    mid = (mid + Math.imul(al3, bh1)) | 0;
    mid = (mid + Math.imul(ah3, bl1)) | 0;
    hi = (hi + Math.imul(ah3, bh1)) | 0;
    lo = (lo + Math.imul(al2, bl2)) | 0;
    mid = (mid + Math.imul(al2, bh2)) | 0;
    mid = (mid + Math.imul(ah2, bl2)) | 0;
    hi = (hi + Math.imul(ah2, bh2)) | 0;
    lo = (lo + Math.imul(al1, bl3)) | 0;
    mid = (mid + Math.imul(al1, bh3)) | 0;
    mid = (mid + Math.imul(ah1, bl3)) | 0;
    hi = (hi + Math.imul(ah1, bh3)) | 0;
    lo = (lo + Math.imul(al0, bl4)) | 0;
    mid = (mid + Math.imul(al0, bh4)) | 0;
    mid = (mid + Math.imul(ah0, bl4)) | 0;
    hi = (hi + Math.imul(ah0, bh4)) | 0;
    var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
    w4 &= 0x3ffffff;
    /* k = 5 */
    lo = Math.imul(al5, bl0);
    mid = Math.imul(al5, bh0);
    mid = (mid + Math.imul(ah5, bl0)) | 0;
    hi = Math.imul(ah5, bh0);
    lo = (lo + Math.imul(al4, bl1)) | 0;
    mid = (mid + Math.imul(al4, bh1)) | 0;
    mid = (mid + Math.imul(ah4, bl1)) | 0;
    hi = (hi + Math.imul(ah4, bh1)) | 0;
    lo = (lo + Math.imul(al3, bl2)) | 0;
    mid = (mid + Math.imul(al3, bh2)) | 0;
    mid = (mid + Math.imul(ah3, bl2)) | 0;
    hi = (hi + Math.imul(ah3, bh2)) | 0;
    lo = (lo + Math.imul(al2, bl3)) | 0;
    mid = (mid + Math.imul(al2, bh3)) | 0;
    mid = (mid + Math.imul(ah2, bl3)) | 0;
    hi = (hi + Math.imul(ah2, bh3)) | 0;
    lo = (lo + Math.imul(al1, bl4)) | 0;
    mid = (mid + Math.imul(al1, bh4)) | 0;
    mid = (mid + Math.imul(ah1, bl4)) | 0;
    hi = (hi + Math.imul(ah1, bh4)) | 0;
    lo = (lo + Math.imul(al0, bl5)) | 0;
    mid = (mid + Math.imul(al0, bh5)) | 0;
    mid = (mid + Math.imul(ah0, bl5)) | 0;
    hi = (hi + Math.imul(ah0, bh5)) | 0;
    var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
    w5 &= 0x3ffffff;
    /* k = 6 */
    lo = Math.imul(al6, bl0);
    mid = Math.imul(al6, bh0);
    mid = (mid + Math.imul(ah6, bl0)) | 0;
    hi = Math.imul(ah6, bh0);
    lo = (lo + Math.imul(al5, bl1)) | 0;
    mid = (mid + Math.imul(al5, bh1)) | 0;
    mid = (mid + Math.imul(ah5, bl1)) | 0;
    hi = (hi + Math.imul(ah5, bh1)) | 0;
    lo = (lo + Math.imul(al4, bl2)) | 0;
    mid = (mid + Math.imul(al4, bh2)) | 0;
    mid = (mid + Math.imul(ah4, bl2)) | 0;
    hi = (hi + Math.imul(ah4, bh2)) | 0;
    lo = (lo + Math.imul(al3, bl3)) | 0;
    mid = (mid + Math.imul(al3, bh3)) | 0;
    mid = (mid + Math.imul(ah3, bl3)) | 0;
    hi = (hi + Math.imul(ah3, bh3)) | 0;
    lo = (lo + Math.imul(al2, bl4)) | 0;
    mid = (mid + Math.imul(al2, bh4)) | 0;
    mid = (mid + Math.imul(ah2, bl4)) | 0;
    hi = (hi + Math.imul(ah2, bh4)) | 0;
    lo = (lo + Math.imul(al1, bl5)) | 0;
    mid = (mid + Math.imul(al1, bh5)) | 0;
    mid = (mid + Math.imul(ah1, bl5)) | 0;
    hi = (hi + Math.imul(ah1, bh5)) | 0;
    lo = (lo + Math.imul(al0, bl6)) | 0;
    mid = (mid + Math.imul(al0, bh6)) | 0;
    mid = (mid + Math.imul(ah0, bl6)) | 0;
    hi = (hi + Math.imul(ah0, bh6)) | 0;
    var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
    w6 &= 0x3ffffff;
    /* k = 7 */
    lo = Math.imul(al7, bl0);
    mid = Math.imul(al7, bh0);
    mid = (mid + Math.imul(ah7, bl0)) | 0;
    hi = Math.imul(ah7, bh0);
    lo = (lo + Math.imul(al6, bl1)) | 0;
    mid = (mid + Math.imul(al6, bh1)) | 0;
    mid = (mid + Math.imul(ah6, bl1)) | 0;
    hi = (hi + Math.imul(ah6, bh1)) | 0;
    lo = (lo + Math.imul(al5, bl2)) | 0;
    mid = (mid + Math.imul(al5, bh2)) | 0;
    mid = (mid + Math.imul(ah5, bl2)) | 0;
    hi = (hi + Math.imul(ah5, bh2)) | 0;
    lo = (lo + Math.imul(al4, bl3)) | 0;
    mid = (mid + Math.imul(al4, bh3)) | 0;
    mid = (mid + Math.imul(ah4, bl3)) | 0;
    hi = (hi + Math.imul(ah4, bh3)) | 0;
    lo = (lo + Math.imul(al3, bl4)) | 0;
    mid = (mid + Math.imul(al3, bh4)) | 0;
    mid = (mid + Math.imul(ah3, bl4)) | 0;
    hi = (hi + Math.imul(ah3, bh4)) | 0;
    lo = (lo + Math.imul(al2, bl5)) | 0;
    mid = (mid + Math.imul(al2, bh5)) | 0;
    mid = (mid + Math.imul(ah2, bl5)) | 0;
    hi = (hi + Math.imul(ah2, bh5)) | 0;
    lo = (lo + Math.imul(al1, bl6)) | 0;
    mid = (mid + Math.imul(al1, bh6)) | 0;
    mid = (mid + Math.imul(ah1, bl6)) | 0;
    hi = (hi + Math.imul(ah1, bh6)) | 0;
    lo = (lo + Math.imul(al0, bl7)) | 0;
    mid = (mid + Math.imul(al0, bh7)) | 0;
    mid = (mid + Math.imul(ah0, bl7)) | 0;
    hi = (hi + Math.imul(ah0, bh7)) | 0;
    var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
    w7 &= 0x3ffffff;
    /* k = 8 */
    lo = Math.imul(al8, bl0);
    mid = Math.imul(al8, bh0);
    mid = (mid + Math.imul(ah8, bl0)) | 0;
    hi = Math.imul(ah8, bh0);
    lo = (lo + Math.imul(al7, bl1)) | 0;
    mid = (mid + Math.imul(al7, bh1)) | 0;
    mid = (mid + Math.imul(ah7, bl1)) | 0;
    hi = (hi + Math.imul(ah7, bh1)) | 0;
    lo = (lo + Math.imul(al6, bl2)) | 0;
    mid = (mid + Math.imul(al6, bh2)) | 0;
    mid = (mid + Math.imul(ah6, bl2)) | 0;
    hi = (hi + Math.imul(ah6, bh2)) | 0;
    lo = (lo + Math.imul(al5, bl3)) | 0;
    mid = (mid + Math.imul(al5, bh3)) | 0;
    mid = (mid + Math.imul(ah5, bl3)) | 0;
    hi = (hi + Math.imul(ah5, bh3)) | 0;
    lo = (lo + Math.imul(al4, bl4)) | 0;
    mid = (mid + Math.imul(al4, bh4)) | 0;
    mid = (mid + Math.imul(ah4, bl4)) | 0;
    hi = (hi + Math.imul(ah4, bh4)) | 0;
    lo = (lo + Math.imul(al3, bl5)) | 0;
    mid = (mid + Math.imul(al3, bh5)) | 0;
    mid = (mid + Math.imul(ah3, bl5)) | 0;
    hi = (hi + Math.imul(ah3, bh5)) | 0;
    lo = (lo + Math.imul(al2, bl6)) | 0;
    mid = (mid + Math.imul(al2, bh6)) | 0;
    mid = (mid + Math.imul(ah2, bl6)) | 0;
    hi = (hi + Math.imul(ah2, bh6)) | 0;
    lo = (lo + Math.imul(al1, bl7)) | 0;
    mid = (mid + Math.imul(al1, bh7)) | 0;
    mid = (mid + Math.imul(ah1, bl7)) | 0;
    hi = (hi + Math.imul(ah1, bh7)) | 0;
    lo = (lo + Math.imul(al0, bl8)) | 0;
    mid = (mid + Math.imul(al0, bh8)) | 0;
    mid = (mid + Math.imul(ah0, bl8)) | 0;
    hi = (hi + Math.imul(ah0, bh8)) | 0;
    var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
    w8 &= 0x3ffffff;
    /* k = 9 */
    lo = Math.imul(al9, bl0);
    mid = Math.imul(al9, bh0);
    mid = (mid + Math.imul(ah9, bl0)) | 0;
    hi = Math.imul(ah9, bh0);
    lo = (lo + Math.imul(al8, bl1)) | 0;
    mid = (mid + Math.imul(al8, bh1)) | 0;
    mid = (mid + Math.imul(ah8, bl1)) | 0;
    hi = (hi + Math.imul(ah8, bh1)) | 0;
    lo = (lo + Math.imul(al7, bl2)) | 0;
    mid = (mid + Math.imul(al7, bh2)) | 0;
    mid = (mid + Math.imul(ah7, bl2)) | 0;
    hi = (hi + Math.imul(ah7, bh2)) | 0;
    lo = (lo + Math.imul(al6, bl3)) | 0;
    mid = (mid + Math.imul(al6, bh3)) | 0;
    mid = (mid + Math.imul(ah6, bl3)) | 0;
    hi = (hi + Math.imul(ah6, bh3)) | 0;
    lo = (lo + Math.imul(al5, bl4)) | 0;
    mid = (mid + Math.imul(al5, bh4)) | 0;
    mid = (mid + Math.imul(ah5, bl4)) | 0;
    hi = (hi + Math.imul(ah5, bh4)) | 0;
    lo = (lo + Math.imul(al4, bl5)) | 0;
    mid = (mid + Math.imul(al4, bh5)) | 0;
    mid = (mid + Math.imul(ah4, bl5)) | 0;
    hi = (hi + Math.imul(ah4, bh5)) | 0;
    lo = (lo + Math.imul(al3, bl6)) | 0;
    mid = (mid + Math.imul(al3, bh6)) | 0;
    mid = (mid + Math.imul(ah3, bl6)) | 0;
    hi = (hi + Math.imul(ah3, bh6)) | 0;
    lo = (lo + Math.imul(al2, bl7)) | 0;
    mid = (mid + Math.imul(al2, bh7)) | 0;
    mid = (mid + Math.imul(ah2, bl7)) | 0;
    hi = (hi + Math.imul(ah2, bh7)) | 0;
    lo = (lo + Math.imul(al1, bl8)) | 0;
    mid = (mid + Math.imul(al1, bh8)) | 0;
    mid = (mid + Math.imul(ah1, bl8)) | 0;
    hi = (hi + Math.imul(ah1, bh8)) | 0;
    lo = (lo + Math.imul(al0, bl9)) | 0;
    mid = (mid + Math.imul(al0, bh9)) | 0;
    mid = (mid + Math.imul(ah0, bl9)) | 0;
    hi = (hi + Math.imul(ah0, bh9)) | 0;
    var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
    w9 &= 0x3ffffff;
    /* k = 10 */
    lo = Math.imul(al9, bl1);
    mid = Math.imul(al9, bh1);
    mid = (mid + Math.imul(ah9, bl1)) | 0;
    hi = Math.imul(ah9, bh1);
    lo = (lo + Math.imul(al8, bl2)) | 0;
    mid = (mid + Math.imul(al8, bh2)) | 0;
    mid = (mid + Math.imul(ah8, bl2)) | 0;
    hi = (hi + Math.imul(ah8, bh2)) | 0;
    lo = (lo + Math.imul(al7, bl3)) | 0;
    mid = (mid + Math.imul(al7, bh3)) | 0;
    mid = (mid + Math.imul(ah7, bl3)) | 0;
    hi = (hi + Math.imul(ah7, bh3)) | 0;
    lo = (lo + Math.imul(al6, bl4)) | 0;
    mid = (mid + Math.imul(al6, bh4)) | 0;
    mid = (mid + Math.imul(ah6, bl4)) | 0;
    hi = (hi + Math.imul(ah6, bh4)) | 0;
    lo = (lo + Math.imul(al5, bl5)) | 0;
    mid = (mid + Math.imul(al5, bh5)) | 0;
    mid = (mid + Math.imul(ah5, bl5)) | 0;
    hi = (hi + Math.imul(ah5, bh5)) | 0;
    lo = (lo + Math.imul(al4, bl6)) | 0;
    mid = (mid + Math.imul(al4, bh6)) | 0;
    mid = (mid + Math.imul(ah4, bl6)) | 0;
    hi = (hi + Math.imul(ah4, bh6)) | 0;
    lo = (lo + Math.imul(al3, bl7)) | 0;
    mid = (mid + Math.imul(al3, bh7)) | 0;
    mid = (mid + Math.imul(ah3, bl7)) | 0;
    hi = (hi + Math.imul(ah3, bh7)) | 0;
    lo = (lo + Math.imul(al2, bl8)) | 0;
    mid = (mid + Math.imul(al2, bh8)) | 0;
    mid = (mid + Math.imul(ah2, bl8)) | 0;
    hi = (hi + Math.imul(ah2, bh8)) | 0;
    lo = (lo + Math.imul(al1, bl9)) | 0;
    mid = (mid + Math.imul(al1, bh9)) | 0;
    mid = (mid + Math.imul(ah1, bl9)) | 0;
    hi = (hi + Math.imul(ah1, bh9)) | 0;
    var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
    w10 &= 0x3ffffff;
    /* k = 11 */
    lo = Math.imul(al9, bl2);
    mid = Math.imul(al9, bh2);
    mid = (mid + Math.imul(ah9, bl2)) | 0;
    hi = Math.imul(ah9, bh2);
    lo = (lo + Math.imul(al8, bl3)) | 0;
    mid = (mid + Math.imul(al8, bh3)) | 0;
    mid = (mid + Math.imul(ah8, bl3)) | 0;
    hi = (hi + Math.imul(ah8, bh3)) | 0;
    lo = (lo + Math.imul(al7, bl4)) | 0;
    mid = (mid + Math.imul(al7, bh4)) | 0;
    mid = (mid + Math.imul(ah7, bl4)) | 0;
    hi = (hi + Math.imul(ah7, bh4)) | 0;
    lo = (lo + Math.imul(al6, bl5)) | 0;
    mid = (mid + Math.imul(al6, bh5)) | 0;
    mid = (mid + Math.imul(ah6, bl5)) | 0;
    hi = (hi + Math.imul(ah6, bh5)) | 0;
    lo = (lo + Math.imul(al5, bl6)) | 0;
    mid = (mid + Math.imul(al5, bh6)) | 0;
    mid = (mid + Math.imul(ah5, bl6)) | 0;
    hi = (hi + Math.imul(ah5, bh6)) | 0;
    lo = (lo + Math.imul(al4, bl7)) | 0;
    mid = (mid + Math.imul(al4, bh7)) | 0;
    mid = (mid + Math.imul(ah4, bl7)) | 0;
    hi = (hi + Math.imul(ah4, bh7)) | 0;
    lo = (lo + Math.imul(al3, bl8)) | 0;
    mid = (mid + Math.imul(al3, bh8)) | 0;
    mid = (mid + Math.imul(ah3, bl8)) | 0;
    hi = (hi + Math.imul(ah3, bh8)) | 0;
    lo = (lo + Math.imul(al2, bl9)) | 0;
    mid = (mid + Math.imul(al2, bh9)) | 0;
    mid = (mid + Math.imul(ah2, bl9)) | 0;
    hi = (hi + Math.imul(ah2, bh9)) | 0;
    var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
    w11 &= 0x3ffffff;
    /* k = 12 */
    lo = Math.imul(al9, bl3);
    mid = Math.imul(al9, bh3);
    mid = (mid + Math.imul(ah9, bl3)) | 0;
    hi = Math.imul(ah9, bh3);
    lo = (lo + Math.imul(al8, bl4)) | 0;
    mid = (mid + Math.imul(al8, bh4)) | 0;
    mid = (mid + Math.imul(ah8, bl4)) | 0;
    hi = (hi + Math.imul(ah8, bh4)) | 0;
    lo = (lo + Math.imul(al7, bl5)) | 0;
    mid = (mid + Math.imul(al7, bh5)) | 0;
    mid = (mid + Math.imul(ah7, bl5)) | 0;
    hi = (hi + Math.imul(ah7, bh5)) | 0;
    lo = (lo + Math.imul(al6, bl6)) | 0;
    mid = (mid + Math.imul(al6, bh6)) | 0;
    mid = (mid + Math.imul(ah6, bl6)) | 0;
    hi = (hi + Math.imul(ah6, bh6)) | 0;
    lo = (lo + Math.imul(al5, bl7)) | 0;
    mid = (mid + Math.imul(al5, bh7)) | 0;
    mid = (mid + Math.imul(ah5, bl7)) | 0;
    hi = (hi + Math.imul(ah5, bh7)) | 0;
    lo = (lo + Math.imul(al4, bl8)) | 0;
    mid = (mid + Math.imul(al4, bh8)) | 0;
    mid = (mid + Math.imul(ah4, bl8)) | 0;
    hi = (hi + Math.imul(ah4, bh8)) | 0;
    lo = (lo + Math.imul(al3, bl9)) | 0;
    mid = (mid + Math.imul(al3, bh9)) | 0;
    mid = (mid + Math.imul(ah3, bl9)) | 0;
    hi = (hi + Math.imul(ah3, bh9)) | 0;
    var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
    w12 &= 0x3ffffff;
    /* k = 13 */
    lo = Math.imul(al9, bl4);
    mid = Math.imul(al9, bh4);
    mid = (mid + Math.imul(ah9, bl4)) | 0;
    hi = Math.imul(ah9, bh4);
    lo = (lo + Math.imul(al8, bl5)) | 0;
    mid = (mid + Math.imul(al8, bh5)) | 0;
    mid = (mid + Math.imul(ah8, bl5)) | 0;
    hi = (hi + Math.imul(ah8, bh5)) | 0;
    lo = (lo + Math.imul(al7, bl6)) | 0;
    mid = (mid + Math.imul(al7, bh6)) | 0;
    mid = (mid + Math.imul(ah7, bl6)) | 0;
    hi = (hi + Math.imul(ah7, bh6)) | 0;
    lo = (lo + Math.imul(al6, bl7)) | 0;
    mid = (mid + Math.imul(al6, bh7)) | 0;
    mid = (mid + Math.imul(ah6, bl7)) | 0;
    hi = (hi + Math.imul(ah6, bh7)) | 0;
    lo = (lo + Math.imul(al5, bl8)) | 0;
    mid = (mid + Math.imul(al5, bh8)) | 0;
    mid = (mid + Math.imul(ah5, bl8)) | 0;
    hi = (hi + Math.imul(ah5, bh8)) | 0;
    lo = (lo + Math.imul(al4, bl9)) | 0;
    mid = (mid + Math.imul(al4, bh9)) | 0;
    mid = (mid + Math.imul(ah4, bl9)) | 0;
    hi = (hi + Math.imul(ah4, bh9)) | 0;
    var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
    w13 &= 0x3ffffff;
    /* k = 14 */
    lo = Math.imul(al9, bl5);
    mid = Math.imul(al9, bh5);
    mid = (mid + Math.imul(ah9, bl5)) | 0;
    hi = Math.imul(ah9, bh5);
    lo = (lo + Math.imul(al8, bl6)) | 0;
    mid = (mid + Math.imul(al8, bh6)) | 0;
    mid = (mid + Math.imul(ah8, bl6)) | 0;
    hi = (hi + Math.imul(ah8, bh6)) | 0;
    lo = (lo + Math.imul(al7, bl7)) | 0;
    mid = (mid + Math.imul(al7, bh7)) | 0;
    mid = (mid + Math.imul(ah7, bl7)) | 0;
    hi = (hi + Math.imul(ah7, bh7)) | 0;
    lo = (lo + Math.imul(al6, bl8)) | 0;
    mid = (mid + Math.imul(al6, bh8)) | 0;
    mid = (mid + Math.imul(ah6, bl8)) | 0;
    hi = (hi + Math.imul(ah6, bh8)) | 0;
    lo = (lo + Math.imul(al5, bl9)) | 0;
    mid = (mid + Math.imul(al5, bh9)) | 0;
    mid = (mid + Math.imul(ah5, bl9)) | 0;
    hi = (hi + Math.imul(ah5, bh9)) | 0;
    var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
    w14 &= 0x3ffffff;
    /* k = 15 */
    lo = Math.imul(al9, bl6);
    mid = Math.imul(al9, bh6);
    mid = (mid + Math.imul(ah9, bl6)) | 0;
    hi = Math.imul(ah9, bh6);
    lo = (lo + Math.imul(al8, bl7)) | 0;
    mid = (mid + Math.imul(al8, bh7)) | 0;
    mid = (mid + Math.imul(ah8, bl7)) | 0;
    hi = (hi + Math.imul(ah8, bh7)) | 0;
    lo = (lo + Math.imul(al7, bl8)) | 0;
    mid = (mid + Math.imul(al7, bh8)) | 0;
    mid = (mid + Math.imul(ah7, bl8)) | 0;
    hi = (hi + Math.imul(ah7, bh8)) | 0;
    lo = (lo + Math.imul(al6, bl9)) | 0;
    mid = (mid + Math.imul(al6, bh9)) | 0;
    mid = (mid + Math.imul(ah6, bl9)) | 0;
    hi = (hi + Math.imul(ah6, bh9)) | 0;
    var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
    w15 &= 0x3ffffff;
    /* k = 16 */
    lo = Math.imul(al9, bl7);
    mid = Math.imul(al9, bh7);
    mid = (mid + Math.imul(ah9, bl7)) | 0;
    hi = Math.imul(ah9, bh7);
    lo = (lo + Math.imul(al8, bl8)) | 0;
    mid = (mid + Math.imul(al8, bh8)) | 0;
    mid = (mid + Math.imul(ah8, bl8)) | 0;
    hi = (hi + Math.imul(ah8, bh8)) | 0;
    lo = (lo + Math.imul(al7, bl9)) | 0;
    mid = (mid + Math.imul(al7, bh9)) | 0;
    mid = (mid + Math.imul(ah7, bl9)) | 0;
    hi = (hi + Math.imul(ah7, bh9)) | 0;
    var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
    w16 &= 0x3ffffff;
    /* k = 17 */
    lo = Math.imul(al9, bl8);
    mid = Math.imul(al9, bh8);
    mid = (mid + Math.imul(ah9, bl8)) | 0;
    hi = Math.imul(ah9, bh8);
    lo = (lo + Math.imul(al8, bl9)) | 0;
    mid = (mid + Math.imul(al8, bh9)) | 0;
    mid = (mid + Math.imul(ah8, bl9)) | 0;
    hi = (hi + Math.imul(ah8, bh9)) | 0;
    var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
    w17 &= 0x3ffffff;
    /* k = 18 */
    lo = Math.imul(al9, bl9);
    mid = Math.imul(al9, bh9);
    mid = (mid + Math.imul(ah9, bl9)) | 0;
    hi = Math.imul(ah9, bh9);
    var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
    w18 &= 0x3ffffff;
    o[0] = w0;
    o[1] = w1;
    o[2] = w2;
    o[3] = w3;
    o[4] = w4;
    o[5] = w5;
    o[6] = w6;
    o[7] = w7;
    o[8] = w8;
    o[9] = w9;
    o[10] = w10;
    o[11] = w11;
    o[12] = w12;
    o[13] = w13;
    o[14] = w14;
    o[15] = w15;
    o[16] = w16;
    o[17] = w17;
    o[18] = w18;
    if (c !== 0) {
      o[19] = c;
      out.length++;
    }
    return out;
  };

  // Polyfill comb
  if (!Math.imul) {
    comb10MulTo = smallMulTo;
  }

  function bigMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    out.length = self.length + num.length;

    var carry = 0;
    var hncarry = 0;
    for (var k = 0; k < out.length - 1; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = hncarry;
      hncarry = 0;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = k - j;
        var a = self.words[i] | 0;
        var b = num.words[j] | 0;
        var r = a * b;

        var lo = r & 0x3ffffff;
        ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
        lo = (lo + rword) | 0;
        rword = lo & 0x3ffffff;
        ncarry = (ncarry + (lo >>> 26)) | 0;

        hncarry += ncarry >>> 26;
        ncarry &= 0x3ffffff;
      }
      out.words[k] = rword;
      carry = ncarry;
      ncarry = hncarry;
    }
    if (carry !== 0) {
      out.words[k] = carry;
    } else {
      out.length--;
    }

    return out.strip();
  }

  function jumboMulTo (self, num, out) {
    var fftm = new FFTM();
    return fftm.mulp(self, num, out);
  }

  BN.prototype.mulTo = function mulTo (num, out) {
    var res;
    var len = this.length + num.length;
    if (this.length === 10 && num.length === 10) {
      res = comb10MulTo(this, num, out);
    } else if (len < 63) {
      res = smallMulTo(this, num, out);
    } else if (len < 1024) {
      res = bigMulTo(this, num, out);
    } else {
      res = jumboMulTo(this, num, out);
    }

    return res;
  };

  // Cooley-Tukey algorithm for FFT
  // slightly revisited to rely on looping instead of recursion

  function FFTM (x, y) {
    this.x = x;
    this.y = y;
  }

  FFTM.prototype.makeRBT = function makeRBT (N) {
    var t = new Array(N);
    var l = BN.prototype._countBits(N) - 1;
    for (var i = 0; i < N; i++) {
      t[i] = this.revBin(i, l, N);
    }

    return t;
  };

  // Returns binary-reversed representation of `x`
  FFTM.prototype.revBin = function revBin (x, l, N) {
    if (x === 0 || x === N - 1) return x;

    var rb = 0;
    for (var i = 0; i < l; i++) {
      rb |= (x & 1) << (l - i - 1);
      x >>= 1;
    }

    return rb;
  };

  // Performs "tweedling" phase, therefore 'emulating'
  // behaviour of the recursive algorithm
  FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
    for (var i = 0; i < N; i++) {
      rtws[i] = rws[rbt[i]];
      itws[i] = iws[rbt[i]];
    }
  };

  FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
    this.permute(rbt, rws, iws, rtws, itws, N);

    for (var s = 1; s < N; s <<= 1) {
      var l = s << 1;

      var rtwdf = Math.cos(2 * Math.PI / l);
      var itwdf = Math.sin(2 * Math.PI / l);

      for (var p = 0; p < N; p += l) {
        var rtwdf_ = rtwdf;
        var itwdf_ = itwdf;

        for (var j = 0; j < s; j++) {
          var re = rtws[p + j];
          var ie = itws[p + j];

          var ro = rtws[p + j + s];
          var io = itws[p + j + s];

          var rx = rtwdf_ * ro - itwdf_ * io;

          io = rtwdf_ * io + itwdf_ * ro;
          ro = rx;

          rtws[p + j] = re + ro;
          itws[p + j] = ie + io;

          rtws[p + j + s] = re - ro;
          itws[p + j + s] = ie - io;

          /* jshint maxdepth : false */
          if (j !== l) {
            rx = rtwdf * rtwdf_ - itwdf * itwdf_;

            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
            rtwdf_ = rx;
          }
        }
      }
    }
  };

  FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
    var N = Math.max(m, n) | 1;
    var odd = N & 1;
    var i = 0;
    for (N = N / 2 | 0; N; N = N >>> 1) {
      i++;
    }

    return 1 << i + 1 + odd;
  };

  FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
    if (N <= 1) return;

    for (var i = 0; i < N / 2; i++) {
      var t = rws[i];

      rws[i] = rws[N - i - 1];
      rws[N - i - 1] = t;

      t = iws[i];

      iws[i] = -iws[N - i - 1];
      iws[N - i - 1] = -t;
    }
  };

  FFTM.prototype.normalize13b = function normalize13b (ws, N) {
    var carry = 0;
    for (var i = 0; i < N / 2; i++) {
      var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
        Math.round(ws[2 * i] / N) +
        carry;

      ws[i] = w & 0x3ffffff;

      if (w < 0x4000000) {
        carry = 0;
      } else {
        carry = w / 0x4000000 | 0;
      }
    }

    return ws;
  };

  FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
    var carry = 0;
    for (var i = 0; i < len; i++) {
      carry = carry + (ws[i] | 0);

      rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
      rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
    }

    // Pad with zeroes
    for (i = 2 * len; i < N; ++i) {
      rws[i] = 0;
    }

    assert(carry === 0);
    assert((carry & ~0x1fff) === 0);
  };

  FFTM.prototype.stub = function stub (N) {
    var ph = new Array(N);
    for (var i = 0; i < N; i++) {
      ph[i] = 0;
    }

    return ph;
  };

  FFTM.prototype.mulp = function mulp (x, y, out) {
    var N = 2 * this.guessLen13b(x.length, y.length);

    var rbt = this.makeRBT(N);

    var _ = this.stub(N);

    var rws = new Array(N);
    var rwst = new Array(N);
    var iwst = new Array(N);

    var nrws = new Array(N);
    var nrwst = new Array(N);
    var niwst = new Array(N);

    var rmws = out.words;
    rmws.length = N;

    this.convert13b(x.words, x.length, rws, N);
    this.convert13b(y.words, y.length, nrws, N);

    this.transform(rws, _, rwst, iwst, N, rbt);
    this.transform(nrws, _, nrwst, niwst, N, rbt);

    for (var i = 0; i < N; i++) {
      var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
      iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
      rwst[i] = rx;
    }

    this.conjugate(rwst, iwst, N);
    this.transform(rwst, iwst, rmws, _, N, rbt);
    this.conjugate(rmws, _, N);
    this.normalize13b(rmws, N);

    out.negative = x.negative ^ y.negative;
    out.length = x.length + y.length;
    return out.strip();
  };

  // Multiply `this` by `num`
  BN.prototype.mul = function mul (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return this.mulTo(num, out);
  };

  // Multiply employing FFT
  BN.prototype.mulf = function mulf (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return jumboMulTo(this, num, out);
  };

  // In-place Multiplication
  BN.prototype.imul = function imul (num) {
    return this.clone().mulTo(num, this);
  };

  BN.prototype.imuln = function imuln (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);

    // Carry
    var carry = 0;
    for (var i = 0; i < this.length; i++) {
      var w = (this.words[i] | 0) * num;
      var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
      carry >>= 26;
      carry += (w / 0x4000000) | 0;
      // NOTE: lo is 27bit maximum
      carry += lo >>> 26;
      this.words[i] = lo & 0x3ffffff;
    }

    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }

    return this;
  };

  BN.prototype.muln = function muln (num) {
    return this.clone().imuln(num);
  };

  // `this` * `this`
  BN.prototype.sqr = function sqr () {
    return this.mul(this);
  };

  // `this` * `this` in-place
  BN.prototype.isqr = function isqr () {
    return this.imul(this.clone());
  };

  // Math.pow(`this`, `num`)
  BN.prototype.pow = function pow (num) {
    var w = toBitArray(num);
    if (w.length === 0) return new BN(1);

    // Skip leading zeroes
    var res = this;
    for (var i = 0; i < w.length; i++, res = res.sqr()) {
      if (w[i] !== 0) break;
    }

    if (++i < w.length) {
      for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
        if (w[i] === 0) continue;

        res = res.mul(q);
      }
    }

    return res;
  };

  // Shift-left in-place
  BN.prototype.iushln = function iushln (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;
    var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
    var i;

    if (r !== 0) {
      var carry = 0;

      for (i = 0; i < this.length; i++) {
        var newCarry = this.words[i] & carryMask;
        var c = ((this.words[i] | 0) - newCarry) << r;
        this.words[i] = c | carry;
        carry = newCarry >>> (26 - r);
      }

      if (carry) {
        this.words[i] = carry;
        this.length++;
      }
    }

    if (s !== 0) {
      for (i = this.length - 1; i >= 0; i--) {
        this.words[i + s] = this.words[i];
      }

      for (i = 0; i < s; i++) {
        this.words[i] = 0;
      }

      this.length += s;
    }

    return this.strip();
  };

  BN.prototype.ishln = function ishln (bits) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushln(bits);
  };

  // Shift-right in-place
  // NOTE: `hint` is a lowest bit before trailing zeroes
  // NOTE: if `extended` is present - it will be filled with destroyed bits
  BN.prototype.iushrn = function iushrn (bits, hint, extended) {
    assert(typeof bits === 'number' && bits >= 0);
    var h;
    if (hint) {
      h = (hint - (hint % 26)) / 26;
    } else {
      h = 0;
    }

    var r = bits % 26;
    var s = Math.min((bits - r) / 26, this.length);
    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
    var maskedWords = extended;

    h -= s;
    h = Math.max(0, h);

    // Extended mode, copy masked part
    if (maskedWords) {
      for (var i = 0; i < s; i++) {
        maskedWords.words[i] = this.words[i];
      }
      maskedWords.length = s;
    }

    if (s === 0) {
      // No-op, we should not move anything at all
    } else if (this.length > s) {
      this.length -= s;
      for (i = 0; i < this.length; i++) {
        this.words[i] = this.words[i + s];
      }
    } else {
      this.words[0] = 0;
      this.length = 1;
    }

    var carry = 0;
    for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
      var word = this.words[i] | 0;
      this.words[i] = (carry << (26 - r)) | (word >>> r);
      carry = word & mask;
    }

    // Push carried bits as a mask
    if (maskedWords && carry !== 0) {
      maskedWords.words[maskedWords.length++] = carry;
    }

    if (this.length === 0) {
      this.words[0] = 0;
      this.length = 1;
    }

    return this.strip();
  };

  BN.prototype.ishrn = function ishrn (bits, hint, extended) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushrn(bits, hint, extended);
  };

  // Shift-left
  BN.prototype.shln = function shln (bits) {
    return this.clone().ishln(bits);
  };

  BN.prototype.ushln = function ushln (bits) {
    return this.clone().iushln(bits);
  };

  // Shift-right
  BN.prototype.shrn = function shrn (bits) {
    return this.clone().ishrn(bits);
  };

  BN.prototype.ushrn = function ushrn (bits) {
    return this.clone().iushrn(bits);
  };

  // Test if n bit is set
  BN.prototype.testn = function testn (bit) {
    assert(typeof bit === 'number' && bit >= 0);
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) return false;

    // Check bit and return
    var w = this.words[s];

    return !!(w & q);
  };

  // Return only lowers bits of number (in-place)
  BN.prototype.imaskn = function imaskn (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;

    assert(this.negative === 0, 'imaskn works only with positive numbers');

    if (this.length <= s) {
      return this;
    }

    if (r !== 0) {
      s++;
    }
    this.length = Math.min(s, this.length);

    if (r !== 0) {
      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
      this.words[this.length - 1] &= mask;
    }

    return this.strip();
  };

  // Return only lowers bits of number
  BN.prototype.maskn = function maskn (bits) {
    return this.clone().imaskn(bits);
  };

  // Add plain number `num` to `this`
  BN.prototype.iaddn = function iaddn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.isubn(-num);

    // Possible sign change
    if (this.negative !== 0) {
      if (this.length === 1 && (this.words[0] | 0) < num) {
        this.words[0] = num - (this.words[0] | 0);
        this.negative = 0;
        return this;
      }

      this.negative = 0;
      this.isubn(num);
      this.negative = 1;
      return this;
    }

    // Add without checks
    return this._iaddn(num);
  };

  BN.prototype._iaddn = function _iaddn (num) {
    this.words[0] += num;

    // Carry
    for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
      this.words[i] -= 0x4000000;
      if (i === this.length - 1) {
        this.words[i + 1] = 1;
      } else {
        this.words[i + 1]++;
      }
    }
    this.length = Math.max(this.length, i + 1);

    return this;
  };

  // Subtract plain number `num` from `this`
  BN.prototype.isubn = function isubn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.iaddn(-num);

    if (this.negative !== 0) {
      this.negative = 0;
      this.iaddn(num);
      this.negative = 1;
      return this;
    }

    this.words[0] -= num;

    if (this.length === 1 && this.words[0] < 0) {
      this.words[0] = -this.words[0];
      this.negative = 1;
    } else {
      // Carry
      for (var i = 0; i < this.length && this.words[i] < 0; i++) {
        this.words[i] += 0x4000000;
        this.words[i + 1] -= 1;
      }
    }

    return this.strip();
  };

  BN.prototype.addn = function addn (num) {
    return this.clone().iaddn(num);
  };

  BN.prototype.subn = function subn (num) {
    return this.clone().isubn(num);
  };

  BN.prototype.iabs = function iabs () {
    this.negative = 0;

    return this;
  };

  BN.prototype.abs = function abs () {
    return this.clone().iabs();
  };

  BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
    var len = num.length + shift;
    var i;

    this._expand(len);

    var w;
    var carry = 0;
    for (i = 0; i < num.length; i++) {
      w = (this.words[i + shift] | 0) + carry;
      var right = (num.words[i] | 0) * mul;
      w -= right & 0x3ffffff;
      carry = (w >> 26) - ((right / 0x4000000) | 0);
      this.words[i + shift] = w & 0x3ffffff;
    }
    for (; i < this.length - shift; i++) {
      w = (this.words[i + shift] | 0) + carry;
      carry = w >> 26;
      this.words[i + shift] = w & 0x3ffffff;
    }

    if (carry === 0) return this.strip();

    // Subtraction overflow
    assert(carry === -1);
    carry = 0;
    for (i = 0; i < this.length; i++) {
      w = -(this.words[i] | 0) + carry;
      carry = w >> 26;
      this.words[i] = w & 0x3ffffff;
    }
    this.negative = 1;

    return this.strip();
  };

  BN.prototype._wordDiv = function _wordDiv (num, mode) {
    var shift = this.length - num.length;

    var a = this.clone();
    var b = num;

    // Normalize
    var bhi = b.words[b.length - 1] | 0;
    var bhiBits = this._countBits(bhi);
    shift = 26 - bhiBits;
    if (shift !== 0) {
      b = b.ushln(shift);
      a.iushln(shift);
      bhi = b.words[b.length - 1] | 0;
    }

    // Initialize quotient
    var m = a.length - b.length;
    var q;

    if (mode !== 'mod') {
      q = new BN(null);
      q.length = m + 1;
      q.words = new Array(q.length);
      for (var i = 0; i < q.length; i++) {
        q.words[i] = 0;
      }
    }

    var diff = a.clone()._ishlnsubmul(b, 1, m);
    if (diff.negative === 0) {
      a = diff;
      if (q) {
        q.words[m] = 1;
      }
    }

    for (var j = m - 1; j >= 0; j--) {
      var qj = (a.words[b.length + j] | 0) * 0x4000000 +
        (a.words[b.length + j - 1] | 0);

      // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
      // (0x7ffffff)
      qj = Math.min((qj / bhi) | 0, 0x3ffffff);

      a._ishlnsubmul(b, qj, j);
      while (a.negative !== 0) {
        qj--;
        a.negative = 0;
        a._ishlnsubmul(b, 1, j);
        if (!a.isZero()) {
          a.negative ^= 1;
        }
      }
      if (q) {
        q.words[j] = qj;
      }
    }
    if (q) {
      q.strip();
    }
    a.strip();

    // Denormalize
    if (mode !== 'div' && shift !== 0) {
      a.iushrn(shift);
    }

    return {
      div: q || null,
      mod: a
    };
  };

  // NOTE: 1) `mode` can be set to `mod` to request mod only,
  //       to `div` to request div only, or be absent to
  //       request both div & mod
  //       2) `positive` is true if unsigned mod is requested
  BN.prototype.divmod = function divmod (num, mode, positive) {
    assert(!num.isZero());

    if (this.isZero()) {
      return {
        div: new BN(0),
        mod: new BN(0)
      };
    }

    var div, mod, res;
    if (this.negative !== 0 && num.negative === 0) {
      res = this.neg().divmod(num, mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.iadd(num);
        }
      }

      return {
        div: div,
        mod: mod
      };
    }

    if (this.negative === 0 && num.negative !== 0) {
      res = this.divmod(num.neg(), mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      return {
        div: div,
        mod: res.mod
      };
    }

    if ((this.negative & num.negative) !== 0) {
      res = this.neg().divmod(num.neg(), mode);

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.isub(num);
        }
      }

      return {
        div: res.div,
        mod: mod
      };
    }

    // Both numbers are positive at this point

    // Strip both numbers to approximate shift value
    if (num.length > this.length || this.cmp(num) < 0) {
      return {
        div: new BN(0),
        mod: this
      };
    }

    // Very short reduction
    if (num.length === 1) {
      if (mode === 'div') {
        return {
          div: this.divn(num.words[0]),
          mod: null
        };
      }

      if (mode === 'mod') {
        return {
          div: null,
          mod: new BN(this.modn(num.words[0]))
        };
      }

      return {
        div: this.divn(num.words[0]),
        mod: new BN(this.modn(num.words[0]))
      };
    }

    return this._wordDiv(num, mode);
  };

  // Find `this` / `num`
  BN.prototype.div = function div (num) {
    return this.divmod(num, 'div', false).div;
  };

  // Find `this` % `num`
  BN.prototype.mod = function mod (num) {
    return this.divmod(num, 'mod', false).mod;
  };

  BN.prototype.umod = function umod (num) {
    return this.divmod(num, 'mod', true).mod;
  };

  // Find Round(`this` / `num`)
  BN.prototype.divRound = function divRound (num) {
    var dm = this.divmod(num);

    // Fast case - exact division
    if (dm.mod.isZero()) return dm.div;

    var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

    var half = num.ushrn(1);
    var r2 = num.andln(1);
    var cmp = mod.cmp(half);

    // Round down
    if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

    // Round up
    return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
  };

  BN.prototype.modn = function modn (num) {
    assert(num <= 0x3ffffff);
    var p = (1 << 26) % num;

    var acc = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      acc = (p * acc + (this.words[i] | 0)) % num;
    }

    return acc;
  };

  // In-place division by number
  BN.prototype.idivn = function idivn (num) {
    assert(num <= 0x3ffffff);

    var carry = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var w = (this.words[i] | 0) + carry * 0x4000000;
      this.words[i] = (w / num) | 0;
      carry = w % num;
    }

    return this.strip();
  };

  BN.prototype.divn = function divn (num) {
    return this.clone().idivn(num);
  };

  BN.prototype.egcd = function egcd (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var x = this;
    var y = p.clone();

    if (x.negative !== 0) {
      x = x.umod(p);
    } else {
      x = x.clone();
    }

    // A * x + B * y = x
    var A = new BN(1);
    var B = new BN(0);

    // C * x + D * y = y
    var C = new BN(0);
    var D = new BN(1);

    var g = 0;

    while (x.isEven() && y.isEven()) {
      x.iushrn(1);
      y.iushrn(1);
      ++g;
    }

    var yp = y.clone();
    var xp = x.clone();

    while (!x.isZero()) {
      for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        x.iushrn(i);
        while (i-- > 0) {
          if (A.isOdd() || B.isOdd()) {
            A.iadd(yp);
            B.isub(xp);
          }

          A.iushrn(1);
          B.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        y.iushrn(j);
        while (j-- > 0) {
          if (C.isOdd() || D.isOdd()) {
            C.iadd(yp);
            D.isub(xp);
          }

          C.iushrn(1);
          D.iushrn(1);
        }
      }

      if (x.cmp(y) >= 0) {
        x.isub(y);
        A.isub(C);
        B.isub(D);
      } else {
        y.isub(x);
        C.isub(A);
        D.isub(B);
      }
    }

    return {
      a: C,
      b: D,
      gcd: y.iushln(g)
    };
  };

  // This is reduced incarnation of the binary EEA
  // above, designated to invert members of the
  // _prime_ fields F(p) at a maximal speed
  BN.prototype._invmp = function _invmp (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var a = this;
    var b = p.clone();

    if (a.negative !== 0) {
      a = a.umod(p);
    } else {
      a = a.clone();
    }

    var x1 = new BN(1);
    var x2 = new BN(0);

    var delta = b.clone();

    while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
      for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        a.iushrn(i);
        while (i-- > 0) {
          if (x1.isOdd()) {
            x1.iadd(delta);
          }

          x1.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        b.iushrn(j);
        while (j-- > 0) {
          if (x2.isOdd()) {
            x2.iadd(delta);
          }

          x2.iushrn(1);
        }
      }

      if (a.cmp(b) >= 0) {
        a.isub(b);
        x1.isub(x2);
      } else {
        b.isub(a);
        x2.isub(x1);
      }
    }

    var res;
    if (a.cmpn(1) === 0) {
      res = x1;
    } else {
      res = x2;
    }

    if (res.cmpn(0) < 0) {
      res.iadd(p);
    }

    return res;
  };

  BN.prototype.gcd = function gcd (num) {
    if (this.isZero()) return num.abs();
    if (num.isZero()) return this.abs();

    var a = this.clone();
    var b = num.clone();
    a.negative = 0;
    b.negative = 0;

    // Remove common factor of two
    for (var shift = 0; a.isEven() && b.isEven(); shift++) {
      a.iushrn(1);
      b.iushrn(1);
    }

    do {
      while (a.isEven()) {
        a.iushrn(1);
      }
      while (b.isEven()) {
        b.iushrn(1);
      }

      var r = a.cmp(b);
      if (r < 0) {
        // Swap `a` and `b` to make `a` always bigger than `b`
        var t = a;
        a = b;
        b = t;
      } else if (r === 0 || b.cmpn(1) === 0) {
        break;
      }

      a.isub(b);
    } while (true);

    return b.iushln(shift);
  };

  // Invert number in the field F(num)
  BN.prototype.invm = function invm (num) {
    return this.egcd(num).a.umod(num);
  };

  BN.prototype.isEven = function isEven () {
    return (this.words[0] & 1) === 0;
  };

  BN.prototype.isOdd = function isOdd () {
    return (this.words[0] & 1) === 1;
  };

  // And first word and num
  BN.prototype.andln = function andln (num) {
    return this.words[0] & num;
  };

  // Increment at the bit position in-line
  BN.prototype.bincn = function bincn (bit) {
    assert(typeof bit === 'number');
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) {
      this._expand(s + 1);
      this.words[s] |= q;
      return this;
    }

    // Add bit and propagate, if needed
    var carry = q;
    for (var i = s; carry !== 0 && i < this.length; i++) {
      var w = this.words[i] | 0;
      w += carry;
      carry = w >>> 26;
      w &= 0x3ffffff;
      this.words[i] = w;
    }
    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }
    return this;
  };

  BN.prototype.isZero = function isZero () {
    return this.length === 1 && this.words[0] === 0;
  };

  BN.prototype.cmpn = function cmpn (num) {
    var negative = num < 0;

    if (this.negative !== 0 && !negative) return -1;
    if (this.negative === 0 && negative) return 1;

    this.strip();

    var res;
    if (this.length > 1) {
      res = 1;
    } else {
      if (negative) {
        num = -num;
      }

      assert(num <= 0x3ffffff, 'Number is too big');

      var w = this.words[0] | 0;
      res = w === num ? 0 : w < num ? -1 : 1;
    }
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Compare two numbers and return:
  // 1 - if `this` > `num`
  // 0 - if `this` == `num`
  // -1 - if `this` < `num`
  BN.prototype.cmp = function cmp (num) {
    if (this.negative !== 0 && num.negative === 0) return -1;
    if (this.negative === 0 && num.negative !== 0) return 1;

    var res = this.ucmp(num);
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Unsigned comparison
  BN.prototype.ucmp = function ucmp (num) {
    // At this point both numbers have the same sign
    if (this.length > num.length) return 1;
    if (this.length < num.length) return -1;

    var res = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var a = this.words[i] | 0;
      var b = num.words[i] | 0;

      if (a === b) continue;
      if (a < b) {
        res = -1;
      } else if (a > b) {
        res = 1;
      }
      break;
    }
    return res;
  };

  BN.prototype.gtn = function gtn (num) {
    return this.cmpn(num) === 1;
  };

  BN.prototype.gt = function gt (num) {
    return this.cmp(num) === 1;
  };

  BN.prototype.gten = function gten (num) {
    return this.cmpn(num) >= 0;
  };

  BN.prototype.gte = function gte (num) {
    return this.cmp(num) >= 0;
  };

  BN.prototype.ltn = function ltn (num) {
    return this.cmpn(num) === -1;
  };

  BN.prototype.lt = function lt (num) {
    return this.cmp(num) === -1;
  };

  BN.prototype.lten = function lten (num) {
    return this.cmpn(num) <= 0;
  };

  BN.prototype.lte = function lte (num) {
    return this.cmp(num) <= 0;
  };

  BN.prototype.eqn = function eqn (num) {
    return this.cmpn(num) === 0;
  };

  BN.prototype.eq = function eq (num) {
    return this.cmp(num) === 0;
  };

  //
  // A reduce context, could be using montgomery or something better, depending
  // on the `m` itself.
  //
  BN.red = function red (num) {
    return new Red(num);
  };

  BN.prototype.toRed = function toRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    assert(this.negative === 0, 'red works only with positives');
    return ctx.convertTo(this)._forceRed(ctx);
  };

  BN.prototype.fromRed = function fromRed () {
    assert(this.red, 'fromRed works only with numbers in reduction context');
    return this.red.convertFrom(this);
  };

  BN.prototype._forceRed = function _forceRed (ctx) {
    this.red = ctx;
    return this;
  };

  BN.prototype.forceRed = function forceRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    return this._forceRed(ctx);
  };

  BN.prototype.redAdd = function redAdd (num) {
    assert(this.red, 'redAdd works only with red numbers');
    return this.red.add(this, num);
  };

  BN.prototype.redIAdd = function redIAdd (num) {
    assert(this.red, 'redIAdd works only with red numbers');
    return this.red.iadd(this, num);
  };

  BN.prototype.redSub = function redSub (num) {
    assert(this.red, 'redSub works only with red numbers');
    return this.red.sub(this, num);
  };

  BN.prototype.redISub = function redISub (num) {
    assert(this.red, 'redISub works only with red numbers');
    return this.red.isub(this, num);
  };

  BN.prototype.redShl = function redShl (num) {
    assert(this.red, 'redShl works only with red numbers');
    return this.red.shl(this, num);
  };

  BN.prototype.redMul = function redMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.mul(this, num);
  };

  BN.prototype.redIMul = function redIMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.imul(this, num);
  };

  BN.prototype.redSqr = function redSqr () {
    assert(this.red, 'redSqr works only with red numbers');
    this.red._verify1(this);
    return this.red.sqr(this);
  };

  BN.prototype.redISqr = function redISqr () {
    assert(this.red, 'redISqr works only with red numbers');
    this.red._verify1(this);
    return this.red.isqr(this);
  };

  // Square root over p
  BN.prototype.redSqrt = function redSqrt () {
    assert(this.red, 'redSqrt works only with red numbers');
    this.red._verify1(this);
    return this.red.sqrt(this);
  };

  BN.prototype.redInvm = function redInvm () {
    assert(this.red, 'redInvm works only with red numbers');
    this.red._verify1(this);
    return this.red.invm(this);
  };

  // Return negative clone of `this` % `red modulo`
  BN.prototype.redNeg = function redNeg () {
    assert(this.red, 'redNeg works only with red numbers');
    this.red._verify1(this);
    return this.red.neg(this);
  };

  BN.prototype.redPow = function redPow (num) {
    assert(this.red && !num.red, 'redPow(normalNum)');
    this.red._verify1(this);
    return this.red.pow(this, num);
  };

  // Prime numbers with efficient reduction
  var primes = {
    k256: null,
    p224: null,
    p192: null,
    p25519: null
  };

  // Pseudo-Mersenne prime
  function MPrime (name, p) {
    // P = 2 ^ N - K
    this.name = name;
    this.p = new BN(p, 16);
    this.n = this.p.bitLength();
    this.k = new BN(1).iushln(this.n).isub(this.p);

    this.tmp = this._tmp();
  }

  MPrime.prototype._tmp = function _tmp () {
    var tmp = new BN(null);
    tmp.words = new Array(Math.ceil(this.n / 13));
    return tmp;
  };

  MPrime.prototype.ireduce = function ireduce (num) {
    // Assumes that `num` is less than `P^2`
    // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
    var r = num;
    var rlen;

    do {
      this.split(r, this.tmp);
      r = this.imulK(r);
      r = r.iadd(this.tmp);
      rlen = r.bitLength();
    } while (rlen > this.n);

    var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
    if (cmp === 0) {
      r.words[0] = 0;
      r.length = 1;
    } else if (cmp > 0) {
      r.isub(this.p);
    } else {
      r.strip();
    }

    return r;
  };

  MPrime.prototype.split = function split (input, out) {
    input.iushrn(this.n, 0, out);
  };

  MPrime.prototype.imulK = function imulK (num) {
    return num.imul(this.k);
  };

  function K256 () {
    MPrime.call(
      this,
      'k256',
      'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
  }
  inherits(K256, MPrime);

  K256.prototype.split = function split (input, output) {
    // 256 = 9 * 26 + 22
    var mask = 0x3fffff;

    var outLen = Math.min(input.length, 9);
    for (var i = 0; i < outLen; i++) {
      output.words[i] = input.words[i];
    }
    output.length = outLen;

    if (input.length <= 9) {
      input.words[0] = 0;
      input.length = 1;
      return;
    }

    // Shift by 9 limbs
    var prev = input.words[9];
    output.words[output.length++] = prev & mask;

    for (i = 10; i < input.length; i++) {
      var next = input.words[i] | 0;
      input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
      prev = next;
    }
    prev >>>= 22;
    input.words[i - 10] = prev;
    if (prev === 0 && input.length > 10) {
      input.length -= 10;
    } else {
      input.length -= 9;
    }
  };

  K256.prototype.imulK = function imulK (num) {
    // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
    num.words[num.length] = 0;
    num.words[num.length + 1] = 0;
    num.length += 2;

    // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
    var lo = 0;
    for (var i = 0; i < num.length; i++) {
      var w = num.words[i] | 0;
      lo += w * 0x3d1;
      num.words[i] = lo & 0x3ffffff;
      lo = w * 0x40 + ((lo / 0x4000000) | 0);
    }

    // Fast length reduction
    if (num.words[num.length - 1] === 0) {
      num.length--;
      if (num.words[num.length - 1] === 0) {
        num.length--;
      }
    }
    return num;
  };

  function P224 () {
    MPrime.call(
      this,
      'p224',
      'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
  }
  inherits(P224, MPrime);

  function P192 () {
    MPrime.call(
      this,
      'p192',
      'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
  }
  inherits(P192, MPrime);

  function P25519 () {
    // 2 ^ 255 - 19
    MPrime.call(
      this,
      '25519',
      '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
  }
  inherits(P25519, MPrime);

  P25519.prototype.imulK = function imulK (num) {
    // K = 0x13
    var carry = 0;
    for (var i = 0; i < num.length; i++) {
      var hi = (num.words[i] | 0) * 0x13 + carry;
      var lo = hi & 0x3ffffff;
      hi >>>= 26;

      num.words[i] = lo;
      carry = hi;
    }
    if (carry !== 0) {
      num.words[num.length++] = carry;
    }
    return num;
  };

  // Exported mostly for testing purposes, use plain name instead
  BN._prime = function prime (name) {
    // Cached version of prime
    if (primes[name]) return primes[name];

    var prime;
    if (name === 'k256') {
      prime = new K256();
    } else if (name === 'p224') {
      prime = new P224();
    } else if (name === 'p192') {
      prime = new P192();
    } else if (name === 'p25519') {
      prime = new P25519();
    } else {
      throw new Error('Unknown prime ' + name);
    }
    primes[name] = prime;

    return prime;
  };

  //
  // Base reduction engine
  //
  function Red (m) {
    if (typeof m === 'string') {
      var prime = BN._prime(m);
      this.m = prime.p;
      this.prime = prime;
    } else {
      assert(m.gtn(1), 'modulus must be greater than 1');
      this.m = m;
      this.prime = null;
    }
  }

  Red.prototype._verify1 = function _verify1 (a) {
    assert(a.negative === 0, 'red works only with positives');
    assert(a.red, 'red works only with red numbers');
  };

  Red.prototype._verify2 = function _verify2 (a, b) {
    assert((a.negative | b.negative) === 0, 'red works only with positives');
    assert(a.red && a.red === b.red,
      'red works only with red numbers');
  };

  Red.prototype.imod = function imod (a) {
    if (this.prime) return this.prime.ireduce(a)._forceRed(this);
    return a.umod(this.m)._forceRed(this);
  };

  Red.prototype.neg = function neg (a) {
    if (a.isZero()) {
      return a.clone();
    }

    return this.m.sub(a)._forceRed(this);
  };

  Red.prototype.add = function add (a, b) {
    this._verify2(a, b);

    var res = a.add(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.iadd = function iadd (a, b) {
    this._verify2(a, b);

    var res = a.iadd(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res;
  };

  Red.prototype.sub = function sub (a, b) {
    this._verify2(a, b);

    var res = a.sub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.isub = function isub (a, b) {
    this._verify2(a, b);

    var res = a.isub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res;
  };

  Red.prototype.shl = function shl (a, num) {
    this._verify1(a);
    return this.imod(a.ushln(num));
  };

  Red.prototype.imul = function imul (a, b) {
    this._verify2(a, b);
    return this.imod(a.imul(b));
  };

  Red.prototype.mul = function mul (a, b) {
    this._verify2(a, b);
    return this.imod(a.mul(b));
  };

  Red.prototype.isqr = function isqr (a) {
    return this.imul(a, a.clone());
  };

  Red.prototype.sqr = function sqr (a) {
    return this.mul(a, a);
  };

  Red.prototype.sqrt = function sqrt (a) {
    if (a.isZero()) return a.clone();

    var mod3 = this.m.andln(3);
    assert(mod3 % 2 === 1);

    // Fast case
    if (mod3 === 3) {
      var pow = this.m.add(new BN(1)).iushrn(2);
      return this.pow(a, pow);
    }

    // Tonelli-Shanks algorithm (Totally unoptimized and slow)
    //
    // Find Q and S, that Q * 2 ^ S = (P - 1)
    var q = this.m.subn(1);
    var s = 0;
    while (!q.isZero() && q.andln(1) === 0) {
      s++;
      q.iushrn(1);
    }
    assert(!q.isZero());

    var one = new BN(1).toRed(this);
    var nOne = one.redNeg();

    // Find quadratic non-residue
    // NOTE: Max is such because of generalized Riemann hypothesis.
    var lpow = this.m.subn(1).iushrn(1);
    var z = this.m.bitLength();
    z = new BN(2 * z * z).toRed(this);

    while (this.pow(z, lpow).cmp(nOne) !== 0) {
      z.redIAdd(nOne);
    }

    var c = this.pow(z, q);
    var r = this.pow(a, q.addn(1).iushrn(1));
    var t = this.pow(a, q);
    var m = s;
    while (t.cmp(one) !== 0) {
      var tmp = t;
      for (var i = 0; tmp.cmp(one) !== 0; i++) {
        tmp = tmp.redSqr();
      }
      assert(i < m);
      var b = this.pow(c, new BN(1).iushln(m - i - 1));

      r = r.redMul(b);
      c = b.redSqr();
      t = t.redMul(c);
      m = i;
    }

    return r;
  };

  Red.prototype.invm = function invm (a) {
    var inv = a._invmp(this.m);
    if (inv.negative !== 0) {
      inv.negative = 0;
      return this.imod(inv).redNeg();
    } else {
      return this.imod(inv);
    }
  };

  Red.prototype.pow = function pow (a, num) {
    if (num.isZero()) return new BN(1).toRed(this);
    if (num.cmpn(1) === 0) return a.clone();

    var windowSize = 4;
    var wnd = new Array(1 << windowSize);
    wnd[0] = new BN(1).toRed(this);
    wnd[1] = a;
    for (var i = 2; i < wnd.length; i++) {
      wnd[i] = this.mul(wnd[i - 1], a);
    }

    var res = wnd[0];
    var current = 0;
    var currentLen = 0;
    var start = num.bitLength() % 26;
    if (start === 0) {
      start = 26;
    }

    for (i = num.length - 1; i >= 0; i--) {
      var word = num.words[i];
      for (var j = start - 1; j >= 0; j--) {
        var bit = (word >> j) & 1;
        if (res !== wnd[0]) {
          res = this.sqr(res);
        }

        if (bit === 0 && current === 0) {
          currentLen = 0;
          continue;
        }

        current <<= 1;
        current |= bit;
        currentLen++;
        if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

        res = this.mul(res, wnd[current]);
        currentLen = 0;
        current = 0;
      }
      start = 26;
    }

    return res;
  };

  Red.prototype.convertTo = function convertTo (num) {
    var r = num.umod(this.m);

    return r === num ? r.clone() : r;
  };

  Red.prototype.convertFrom = function convertFrom (num) {
    var res = num.clone();
    res.red = null;
    return res;
  };

  //
  // Montgomery method engine
  //

  BN.mont = function mont (num) {
    return new Mont(num);
  };

  function Mont (m) {
    Red.call(this, m);

    this.shift = this.m.bitLength();
    if (this.shift % 26 !== 0) {
      this.shift += 26 - (this.shift % 26);
    }

    this.r = new BN(1).iushln(this.shift);
    this.r2 = this.imod(this.r.sqr());
    this.rinv = this.r._invmp(this.m);

    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
    this.minv = this.minv.umod(this.r);
    this.minv = this.r.sub(this.minv);
  }
  inherits(Mont, Red);

  Mont.prototype.convertTo = function convertTo (num) {
    return this.imod(num.ushln(this.shift));
  };

  Mont.prototype.convertFrom = function convertFrom (num) {
    var r = this.imod(num.mul(this.rinv));
    r.red = null;
    return r;
  };

  Mont.prototype.imul = function imul (a, b) {
    if (a.isZero() || b.isZero()) {
      a.words[0] = 0;
      a.length = 1;
      return a;
    }

    var t = a.imul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;

    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.mul = function mul (a, b) {
    if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

    var t = a.mul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;
    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.invm = function invm (a) {
    // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
    var res = this.imod(a._invmp(this.m).mul(this.r2));
    return res._forceRed(this);
  };
})( false || module, this);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/module.js */ "YuTi")(module)))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYm4uanMvbGliL2JuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsbUJBQU8sQ0FBQyxlQUFRO0FBQzdCLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsUUFBUTtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsd0JBQXdCLG1CQUFtQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFNBQVM7QUFDaEM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLFlBQVk7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsU0FBUztBQUNoQzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNDQUFzQyxzQkFBc0I7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLFNBQVM7QUFDaEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixpQkFBaUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTs7QUFFQSxpQkFBaUIsYUFBYTtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsaUJBQWlCLGFBQWE7QUFDOUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFlBQVksZUFBZTtBQUMzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxxQkFBcUIsZ0JBQWdCO0FBQ3JDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxtQkFBbUIsY0FBYztBQUNqQztBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsY0FBYztBQUNqQztBQUNBOztBQUVBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsY0FBYztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsNkJBQTZCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsWUFBWSxjQUFjO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGNBQWM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLDZCQUE2QjtBQUN2QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsU0FBUztBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELFdBQVc7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsb0JBQW9CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxXQUFXO0FBQy9EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG1CQUFtQixPQUFPO0FBQzFCOztBQUVBO0FBQ0E7O0FBRUEscUJBQXFCLE9BQU87QUFDNUI7QUFDQTs7QUFFQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLEdBQUc7QUFDMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsbUJBQW1CLFdBQVc7QUFDOUI7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLFdBQVc7QUFDOUI7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixTQUFTO0FBQzVCOztBQUVBLGtDQUFrQztBQUNsQyxzQ0FBc0M7QUFDdEM7O0FBRUE7QUFDQSxxQkFBcUIsT0FBTztBQUM1QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLE9BQU87QUFDMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxtQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGlCQUFpQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsY0FBYztBQUNqQztBQUNBOztBQUVBO0FBQ0EsNkJBQTZCLGNBQWM7QUFDM0M7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsaUJBQWlCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtCQUErQixRQUFRO0FBQ3ZDO0FBQ0E7O0FBRUEsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLE9BQU87QUFDNUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGlCQUFpQixpQkFBaUI7QUFDbEM7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkIsbUNBQW1DO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQiwrQ0FBK0M7QUFDbEU7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EscUJBQXFCLHNDQUFzQztBQUMzRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGVBQWUsZ0JBQWdCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUseUJBQXlCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsaUJBQWlCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixjQUFjO0FBQ25DO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsUUFBUTtBQUMvQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQ0FBaUMsUUFBUTtBQUN6QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUNBQWlDLFFBQVE7QUFDekM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCLG1DQUFtQztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2QkFBNkIsbUNBQW1DO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsNkJBQTZCLG1DQUFtQztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDZCQUE2QixtQ0FBbUM7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLDBCQUEwQjtBQUNqRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsZ0NBQWdDO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQ0FBaUMsUUFBUTtBQUN6QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLGtCQUFrQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLG9CQUFvQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUE0QixRQUFRO0FBQ3BDO0FBQ0EsNkJBQTZCLFFBQVE7QUFDckM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBRSxNQUE2QiIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmJuLmpzLjg2YjJjMGM2Y2I4OGM4NDY1ZWJjLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChtb2R1bGUsIGV4cG9ydHMpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIC8vIFV0aWxzXHJcbiAgZnVuY3Rpb24gYXNzZXJ0ICh2YWwsIG1zZykge1xyXG4gICAgaWYgKCF2YWwpIHRocm93IG5ldyBFcnJvcihtc2cgfHwgJ0Fzc2VydGlvbiBmYWlsZWQnKTtcclxuICB9XHJcblxyXG4gIC8vIENvdWxkIHVzZSBgaW5oZXJpdHNgIG1vZHVsZSwgYnV0IGRvbid0IHdhbnQgdG8gbW92ZSBmcm9tIHNpbmdsZSBmaWxlXHJcbiAgLy8gYXJjaGl0ZWN0dXJlIHlldC5cclxuICBmdW5jdGlvbiBpbmhlcml0cyAoY3Rvciwgc3VwZXJDdG9yKSB7XHJcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvcjtcclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9O1xyXG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZTtcclxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKCk7XHJcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3I7XHJcbiAgfVxyXG5cclxuICAvLyBCTlxyXG5cclxuICBmdW5jdGlvbiBCTiAobnVtYmVyLCBiYXNlLCBlbmRpYW4pIHtcclxuICAgIGlmIChCTi5pc0JOKG51bWJlcikpIHtcclxuICAgICAgcmV0dXJuIG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm5lZ2F0aXZlID0gMDtcclxuICAgIHRoaXMud29yZHMgPSBudWxsO1xyXG4gICAgdGhpcy5sZW5ndGggPSAwO1xyXG5cclxuICAgIC8vIFJlZHVjdGlvbiBjb250ZXh0XHJcbiAgICB0aGlzLnJlZCA9IG51bGw7XHJcblxyXG4gICAgaWYgKG51bWJlciAhPT0gbnVsbCkge1xyXG4gICAgICBpZiAoYmFzZSA9PT0gJ2xlJyB8fCBiYXNlID09PSAnYmUnKSB7XHJcbiAgICAgICAgZW5kaWFuID0gYmFzZTtcclxuICAgICAgICBiYXNlID0gMTA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuX2luaXQobnVtYmVyIHx8IDAsIGJhc2UgfHwgMTAsIGVuZGlhbiB8fCAnYmUnKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEJOO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBleHBvcnRzLkJOID0gQk47XHJcbiAgfVxyXG5cclxuICBCTi5CTiA9IEJOO1xyXG4gIEJOLndvcmRTaXplID0gMjY7XHJcblxyXG4gIHZhciBCdWZmZXI7XHJcbiAgdHJ5IHtcclxuICAgIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgfVxyXG5cclxuICBCTi5pc0JOID0gZnVuY3Rpb24gaXNCTiAobnVtKSB7XHJcbiAgICBpZiAobnVtIGluc3RhbmNlb2YgQk4pIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bSAhPT0gbnVsbCAmJiB0eXBlb2YgbnVtID09PSAnb2JqZWN0JyAmJlxyXG4gICAgICBudW0uY29uc3RydWN0b3Iud29yZFNpemUgPT09IEJOLndvcmRTaXplICYmIEFycmF5LmlzQXJyYXkobnVtLndvcmRzKTtcclxuICB9O1xyXG5cclxuICBCTi5tYXggPSBmdW5jdGlvbiBtYXggKGxlZnQsIHJpZ2h0KSB7XHJcbiAgICBpZiAobGVmdC5jbXAocmlnaHQpID4gMCkgcmV0dXJuIGxlZnQ7XHJcbiAgICByZXR1cm4gcmlnaHQ7XHJcbiAgfTtcclxuXHJcbiAgQk4ubWluID0gZnVuY3Rpb24gbWluIChsZWZ0LCByaWdodCkge1xyXG4gICAgaWYgKGxlZnQuY21wKHJpZ2h0KSA8IDApIHJldHVybiBsZWZ0O1xyXG4gICAgcmV0dXJuIHJpZ2h0O1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uIGluaXQgKG51bWJlciwgYmFzZSwgZW5kaWFuKSB7XHJcbiAgICBpZiAodHlwZW9mIG51bWJlciA9PT0gJ251bWJlcicpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2luaXROdW1iZXIobnVtYmVyLCBiYXNlLCBlbmRpYW4pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgbnVtYmVyID09PSAnb2JqZWN0Jykge1xyXG4gICAgICByZXR1cm4gdGhpcy5faW5pdEFycmF5KG51bWJlciwgYmFzZSwgZW5kaWFuKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYmFzZSA9PT0gJ2hleCcpIHtcclxuICAgICAgYmFzZSA9IDE2O1xyXG4gICAgfVxyXG4gICAgYXNzZXJ0KGJhc2UgPT09IChiYXNlIHwgMCkgJiYgYmFzZSA+PSAyICYmIGJhc2UgPD0gMzYpO1xyXG5cclxuICAgIG51bWJlciA9IG51bWJlci50b1N0cmluZygpLnJlcGxhY2UoL1xccysvZywgJycpO1xyXG4gICAgdmFyIHN0YXJ0ID0gMDtcclxuICAgIGlmIChudW1iZXJbMF0gPT09ICctJykge1xyXG4gICAgICBzdGFydCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChiYXNlID09PSAxNikge1xyXG4gICAgICB0aGlzLl9wYXJzZUhleChudW1iZXIsIHN0YXJ0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3BhcnNlQmFzZShudW1iZXIsIGJhc2UsIHN0YXJ0KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobnVtYmVyWzBdID09PSAnLScpIHtcclxuICAgICAgdGhpcy5uZWdhdGl2ZSA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdHJpcCgpO1xyXG5cclxuICAgIGlmIChlbmRpYW4gIT09ICdsZScpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLl9pbml0QXJyYXkodGhpcy50b0FycmF5KCksIGJhc2UsIGVuZGlhbik7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLl9pbml0TnVtYmVyID0gZnVuY3Rpb24gX2luaXROdW1iZXIgKG51bWJlciwgYmFzZSwgZW5kaWFuKSB7XHJcbiAgICBpZiAobnVtYmVyIDwgMCkge1xyXG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMTtcclxuICAgICAgbnVtYmVyID0gLW51bWJlcjtcclxuICAgIH1cclxuICAgIGlmIChudW1iZXIgPCAweDQwMDAwMDApIHtcclxuICAgICAgdGhpcy53b3JkcyA9IFsgbnVtYmVyICYgMHgzZmZmZmZmIF07XHJcbiAgICAgIHRoaXMubGVuZ3RoID0gMTtcclxuICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMHgxMDAwMDAwMDAwMDAwMCkge1xyXG4gICAgICB0aGlzLndvcmRzID0gW1xyXG4gICAgICAgIG51bWJlciAmIDB4M2ZmZmZmZixcclxuICAgICAgICAobnVtYmVyIC8gMHg0MDAwMDAwKSAmIDB4M2ZmZmZmZlxyXG4gICAgICBdO1xyXG4gICAgICB0aGlzLmxlbmd0aCA9IDI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhc3NlcnQobnVtYmVyIDwgMHgyMDAwMDAwMDAwMDAwMCk7IC8vIDIgXiA1MyAodW5zYWZlKVxyXG4gICAgICB0aGlzLndvcmRzID0gW1xyXG4gICAgICAgIG51bWJlciAmIDB4M2ZmZmZmZixcclxuICAgICAgICAobnVtYmVyIC8gMHg0MDAwMDAwKSAmIDB4M2ZmZmZmZixcclxuICAgICAgICAxXHJcbiAgICAgIF07XHJcbiAgICAgIHRoaXMubGVuZ3RoID0gMztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZW5kaWFuICE9PSAnbGUnKSByZXR1cm47XHJcblxyXG4gICAgLy8gUmV2ZXJzZSB0aGUgYnl0ZXNcclxuICAgIHRoaXMuX2luaXRBcnJheSh0aGlzLnRvQXJyYXkoKSwgYmFzZSwgZW5kaWFuKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuX2luaXRBcnJheSA9IGZ1bmN0aW9uIF9pbml0QXJyYXkgKG51bWJlciwgYmFzZSwgZW5kaWFuKSB7XHJcbiAgICAvLyBQZXJoYXBzIGEgVWludDhBcnJheVxyXG4gICAgYXNzZXJ0KHR5cGVvZiBudW1iZXIubGVuZ3RoID09PSAnbnVtYmVyJyk7XHJcbiAgICBpZiAobnVtYmVyLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgIHRoaXMud29yZHMgPSBbIDAgXTtcclxuICAgICAgdGhpcy5sZW5ndGggPSAxO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxlbmd0aCA9IE1hdGguY2VpbChudW1iZXIubGVuZ3RoIC8gMyk7XHJcbiAgICB0aGlzLndvcmRzID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLndvcmRzW2ldID0gMDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaiwgdztcclxuICAgIHZhciBvZmYgPSAwO1xyXG4gICAgaWYgKGVuZGlhbiA9PT0gJ2JlJykge1xyXG4gICAgICBmb3IgKGkgPSBudW1iZXIubGVuZ3RoIC0gMSwgaiA9IDA7IGkgPj0gMDsgaSAtPSAzKSB7XHJcbiAgICAgICAgdyA9IG51bWJlcltpXSB8IChudW1iZXJbaSAtIDFdIDw8IDgpIHwgKG51bWJlcltpIC0gMl0gPDwgMTYpO1xyXG4gICAgICAgIHRoaXMud29yZHNbal0gfD0gKHcgPDwgb2ZmKSAmIDB4M2ZmZmZmZjtcclxuICAgICAgICB0aGlzLndvcmRzW2ogKyAxXSA9ICh3ID4+PiAoMjYgLSBvZmYpKSAmIDB4M2ZmZmZmZjtcclxuICAgICAgICBvZmYgKz0gMjQ7XHJcbiAgICAgICAgaWYgKG9mZiA+PSAyNikge1xyXG4gICAgICAgICAgb2ZmIC09IDI2O1xyXG4gICAgICAgICAgaisrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChlbmRpYW4gPT09ICdsZScpIHtcclxuICAgICAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBudW1iZXIubGVuZ3RoOyBpICs9IDMpIHtcclxuICAgICAgICB3ID0gbnVtYmVyW2ldIHwgKG51bWJlcltpICsgMV0gPDwgOCkgfCAobnVtYmVyW2kgKyAyXSA8PCAxNik7XHJcbiAgICAgICAgdGhpcy53b3Jkc1tqXSB8PSAodyA8PCBvZmYpICYgMHgzZmZmZmZmO1xyXG4gICAgICAgIHRoaXMud29yZHNbaiArIDFdID0gKHcgPj4+ICgyNiAtIG9mZikpICYgMHgzZmZmZmZmO1xyXG4gICAgICAgIG9mZiArPSAyNDtcclxuICAgICAgICBpZiAob2ZmID49IDI2KSB7XHJcbiAgICAgICAgICBvZmYgLT0gMjY7XHJcbiAgICAgICAgICBqKys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5zdHJpcCgpO1xyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlSGV4IChzdHIsIHN0YXJ0LCBlbmQpIHtcclxuICAgIHZhciByID0gMDtcclxuICAgIHZhciBsZW4gPSBNYXRoLm1pbihzdHIubGVuZ3RoLCBlbmQpO1xyXG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgdmFyIGMgPSBzdHIuY2hhckNvZGVBdChpKSAtIDQ4O1xyXG5cclxuICAgICAgciA8PD0gNDtcclxuXHJcbiAgICAgIC8vICdhJyAtICdmJ1xyXG4gICAgICBpZiAoYyA+PSA0OSAmJiBjIDw9IDU0KSB7XHJcbiAgICAgICAgciB8PSBjIC0gNDkgKyAweGE7XHJcblxyXG4gICAgICAvLyAnQScgLSAnRidcclxuICAgICAgfSBlbHNlIGlmIChjID49IDE3ICYmIGMgPD0gMjIpIHtcclxuICAgICAgICByIHw9IGMgLSAxNyArIDB4YTtcclxuXHJcbiAgICAgIC8vICcwJyAtICc5J1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHIgfD0gYyAmIDB4ZjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHI7XHJcbiAgfVxyXG5cclxuICBCTi5wcm90b3R5cGUuX3BhcnNlSGV4ID0gZnVuY3Rpb24gX3BhcnNlSGV4IChudW1iZXIsIHN0YXJ0KSB7XHJcbiAgICAvLyBDcmVhdGUgcG9zc2libHkgYmlnZ2VyIGFycmF5IHRvIGVuc3VyZSB0aGF0IGl0IGZpdHMgdGhlIG51bWJlclxyXG4gICAgdGhpcy5sZW5ndGggPSBNYXRoLmNlaWwoKG51bWJlci5sZW5ndGggLSBzdGFydCkgLyA2KTtcclxuICAgIHRoaXMud29yZHMgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMud29yZHNbaV0gPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBqLCB3O1xyXG4gICAgLy8gU2NhbiAyNC1iaXQgY2h1bmtzIGFuZCBhZGQgdGhlbSB0byB0aGUgbnVtYmVyXHJcbiAgICB2YXIgb2ZmID0gMDtcclxuICAgIGZvciAoaSA9IG51bWJlci5sZW5ndGggLSA2LCBqID0gMDsgaSA+PSBzdGFydDsgaSAtPSA2KSB7XHJcbiAgICAgIHcgPSBwYXJzZUhleChudW1iZXIsIGksIGkgKyA2KTtcclxuICAgICAgdGhpcy53b3Jkc1tqXSB8PSAodyA8PCBvZmYpICYgMHgzZmZmZmZmO1xyXG4gICAgICAvLyBOT1RFOiBgMHgzZmZmZmZgIGlzIGludGVudGlvbmFsIGhlcmUsIDI2Yml0cyBtYXggc2hpZnQgKyAyNGJpdCBoZXggbGltYlxyXG4gICAgICB0aGlzLndvcmRzW2ogKyAxXSB8PSB3ID4+PiAoMjYgLSBvZmYpICYgMHgzZmZmZmY7XHJcbiAgICAgIG9mZiArPSAyNDtcclxuICAgICAgaWYgKG9mZiA+PSAyNikge1xyXG4gICAgICAgIG9mZiAtPSAyNjtcclxuICAgICAgICBqKys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChpICsgNiAhPT0gc3RhcnQpIHtcclxuICAgICAgdyA9IHBhcnNlSGV4KG51bWJlciwgc3RhcnQsIGkgKyA2KTtcclxuICAgICAgdGhpcy53b3Jkc1tqXSB8PSAodyA8PCBvZmYpICYgMHgzZmZmZmZmO1xyXG4gICAgICB0aGlzLndvcmRzW2ogKyAxXSB8PSB3ID4+PiAoMjYgLSBvZmYpICYgMHgzZmZmZmY7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN0cmlwKCk7XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VCYXNlIChzdHIsIHN0YXJ0LCBlbmQsIG11bCkge1xyXG4gICAgdmFyIHIgPSAwO1xyXG4gICAgdmFyIGxlbiA9IE1hdGgubWluKHN0ci5sZW5ndGgsIGVuZCk7XHJcbiAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICB2YXIgYyA9IHN0ci5jaGFyQ29kZUF0KGkpIC0gNDg7XHJcblxyXG4gICAgICByICo9IG11bDtcclxuXHJcbiAgICAgIC8vICdhJ1xyXG4gICAgICBpZiAoYyA+PSA0OSkge1xyXG4gICAgICAgIHIgKz0gYyAtIDQ5ICsgMHhhO1xyXG5cclxuICAgICAgLy8gJ0EnXHJcbiAgICAgIH0gZWxzZSBpZiAoYyA+PSAxNykge1xyXG4gICAgICAgIHIgKz0gYyAtIDE3ICsgMHhhO1xyXG5cclxuICAgICAgLy8gJzAnIC0gJzknXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgciArPSBjO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcjtcclxuICB9XHJcblxyXG4gIEJOLnByb3RvdHlwZS5fcGFyc2VCYXNlID0gZnVuY3Rpb24gX3BhcnNlQmFzZSAobnVtYmVyLCBiYXNlLCBzdGFydCkge1xyXG4gICAgLy8gSW5pdGlhbGl6ZSBhcyB6ZXJvXHJcbiAgICB0aGlzLndvcmRzID0gWyAwIF07XHJcbiAgICB0aGlzLmxlbmd0aCA9IDE7XHJcblxyXG4gICAgLy8gRmluZCBsZW5ndGggb2YgbGltYiBpbiBiYXNlXHJcbiAgICBmb3IgKHZhciBsaW1iTGVuID0gMCwgbGltYlBvdyA9IDE7IGxpbWJQb3cgPD0gMHgzZmZmZmZmOyBsaW1iUG93ICo9IGJhc2UpIHtcclxuICAgICAgbGltYkxlbisrO1xyXG4gICAgfVxyXG4gICAgbGltYkxlbi0tO1xyXG4gICAgbGltYlBvdyA9IChsaW1iUG93IC8gYmFzZSkgfCAwO1xyXG5cclxuICAgIHZhciB0b3RhbCA9IG51bWJlci5sZW5ndGggLSBzdGFydDtcclxuICAgIHZhciBtb2QgPSB0b3RhbCAlIGxpbWJMZW47XHJcbiAgICB2YXIgZW5kID0gTWF0aC5taW4odG90YWwsIHRvdGFsIC0gbW9kKSArIHN0YXJ0O1xyXG5cclxuICAgIHZhciB3b3JkID0gMDtcclxuICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSBsaW1iTGVuKSB7XHJcbiAgICAgIHdvcmQgPSBwYXJzZUJhc2UobnVtYmVyLCBpLCBpICsgbGltYkxlbiwgYmFzZSk7XHJcblxyXG4gICAgICB0aGlzLmltdWxuKGxpbWJQb3cpO1xyXG4gICAgICBpZiAodGhpcy53b3Jkc1swXSArIHdvcmQgPCAweDQwMDAwMDApIHtcclxuICAgICAgICB0aGlzLndvcmRzWzBdICs9IHdvcmQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5faWFkZG4od29yZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobW9kICE9PSAwKSB7XHJcbiAgICAgIHZhciBwb3cgPSAxO1xyXG4gICAgICB3b3JkID0gcGFyc2VCYXNlKG51bWJlciwgaSwgbnVtYmVyLmxlbmd0aCwgYmFzZSk7XHJcblxyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbW9kOyBpKyspIHtcclxuICAgICAgICBwb3cgKj0gYmFzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5pbXVsbihwb3cpO1xyXG4gICAgICBpZiAodGhpcy53b3Jkc1swXSArIHdvcmQgPCAweDQwMDAwMDApIHtcclxuICAgICAgICB0aGlzLndvcmRzWzBdICs9IHdvcmQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5faWFkZG4od29yZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKGRlc3QpIHtcclxuICAgIGRlc3Qud29yZHMgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGRlc3Qud29yZHNbaV0gPSB0aGlzLndvcmRzW2ldO1xyXG4gICAgfVxyXG4gICAgZGVzdC5sZW5ndGggPSB0aGlzLmxlbmd0aDtcclxuICAgIGRlc3QubmVnYXRpdmUgPSB0aGlzLm5lZ2F0aXZlO1xyXG4gICAgZGVzdC5yZWQgPSB0aGlzLnJlZDtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiBjbG9uZSAoKSB7XHJcbiAgICB2YXIgciA9IG5ldyBCTihudWxsKTtcclxuICAgIHRoaXMuY29weShyKTtcclxuICAgIHJldHVybiByO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5fZXhwYW5kID0gZnVuY3Rpb24gX2V4cGFuZCAoc2l6ZSkge1xyXG4gICAgd2hpbGUgKHRoaXMubGVuZ3RoIDwgc2l6ZSkge1xyXG4gICAgICB0aGlzLndvcmRzW3RoaXMubGVuZ3RoKytdID0gMDtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIC8vIFJlbW92ZSBsZWFkaW5nIGAwYCBmcm9tIGB0aGlzYFxyXG4gIEJOLnByb3RvdHlwZS5zdHJpcCA9IGZ1bmN0aW9uIHN0cmlwICgpIHtcclxuICAgIHdoaWxlICh0aGlzLmxlbmd0aCA+IDEgJiYgdGhpcy53b3Jkc1t0aGlzLmxlbmd0aCAtIDFdID09PSAwKSB7XHJcbiAgICAgIHRoaXMubGVuZ3RoLS07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5fbm9ybVNpZ24oKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuX25vcm1TaWduID0gZnVuY3Rpb24gX25vcm1TaWduICgpIHtcclxuICAgIC8vIC0wID0gMFxyXG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAxICYmIHRoaXMud29yZHNbMF0gPT09IDApIHtcclxuICAgICAgdGhpcy5uZWdhdGl2ZSA9IDA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xyXG4gICAgcmV0dXJuICh0aGlzLnJlZCA/ICc8Qk4tUjogJyA6ICc8Qk46ICcpICsgdGhpcy50b1N0cmluZygxNikgKyAnPic7XHJcbiAgfTtcclxuXHJcbiAgLypcclxuXHJcbiAgdmFyIHplcm9zID0gW107XHJcbiAgdmFyIGdyb3VwU2l6ZXMgPSBbXTtcclxuICB2YXIgZ3JvdXBCYXNlcyA9IFtdO1xyXG5cclxuICB2YXIgcyA9ICcnO1xyXG4gIHZhciBpID0gLTE7XHJcbiAgd2hpbGUgKCsraSA8IEJOLndvcmRTaXplKSB7XHJcbiAgICB6ZXJvc1tpXSA9IHM7XHJcbiAgICBzICs9ICcwJztcclxuICB9XHJcbiAgZ3JvdXBTaXplc1swXSA9IDA7XHJcbiAgZ3JvdXBTaXplc1sxXSA9IDA7XHJcbiAgZ3JvdXBCYXNlc1swXSA9IDA7XHJcbiAgZ3JvdXBCYXNlc1sxXSA9IDA7XHJcbiAgdmFyIGJhc2UgPSAyIC0gMTtcclxuICB3aGlsZSAoKytiYXNlIDwgMzYgKyAxKSB7XHJcbiAgICB2YXIgZ3JvdXBTaXplID0gMDtcclxuICAgIHZhciBncm91cEJhc2UgPSAxO1xyXG4gICAgd2hpbGUgKGdyb3VwQmFzZSA8ICgxIDw8IEJOLndvcmRTaXplKSAvIGJhc2UpIHtcclxuICAgICAgZ3JvdXBCYXNlICo9IGJhc2U7XHJcbiAgICAgIGdyb3VwU2l6ZSArPSAxO1xyXG4gICAgfVxyXG4gICAgZ3JvdXBTaXplc1tiYXNlXSA9IGdyb3VwU2l6ZTtcclxuICAgIGdyb3VwQmFzZXNbYmFzZV0gPSBncm91cEJhc2U7XHJcbiAgfVxyXG5cclxuICAqL1xyXG5cclxuICB2YXIgemVyb3MgPSBbXHJcbiAgICAnJyxcclxuICAgICcwJyxcclxuICAgICcwMCcsXHJcbiAgICAnMDAwJyxcclxuICAgICcwMDAwJyxcclxuICAgICcwMDAwMCcsXHJcbiAgICAnMDAwMDAwJyxcclxuICAgICcwMDAwMDAwJyxcclxuICAgICcwMDAwMDAwMCcsXHJcbiAgICAnMDAwMDAwMDAwJyxcclxuICAgICcwMDAwMDAwMDAwJyxcclxuICAgICcwMDAwMDAwMDAwMCcsXHJcbiAgICAnMDAwMDAwMDAwMDAwJyxcclxuICAgICcwMDAwMDAwMDAwMDAwJyxcclxuICAgICcwMDAwMDAwMDAwMDAwMCcsXHJcbiAgICAnMDAwMDAwMDAwMDAwMDAwJyxcclxuICAgICcwMDAwMDAwMDAwMDAwMDAwJyxcclxuICAgICcwMDAwMDAwMDAwMDAwMDAwMCcsXHJcbiAgICAnMDAwMDAwMDAwMDAwMDAwMDAwJyxcclxuICAgICcwMDAwMDAwMDAwMDAwMDAwMDAwJyxcclxuICAgICcwMDAwMDAwMDAwMDAwMDAwMDAwMCcsXHJcbiAgICAnMDAwMDAwMDAwMDAwMDAwMDAwMDAwJyxcclxuICAgICcwMDAwMDAwMDAwMDAwMDAwMDAwMDAwJyxcclxuICAgICcwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCcsXHJcbiAgICAnMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwJyxcclxuICAgICcwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwJ1xyXG4gIF07XHJcblxyXG4gIHZhciBncm91cFNpemVzID0gW1xyXG4gICAgMCwgMCxcclxuICAgIDI1LCAxNiwgMTIsIDExLCAxMCwgOSwgOCxcclxuICAgIDgsIDcsIDcsIDcsIDcsIDYsIDYsXHJcbiAgICA2LCA2LCA2LCA2LCA2LCA1LCA1LFxyXG4gICAgNSwgNSwgNSwgNSwgNSwgNSwgNSxcclxuICAgIDUsIDUsIDUsIDUsIDUsIDUsIDVcclxuICBdO1xyXG5cclxuICB2YXIgZ3JvdXBCYXNlcyA9IFtcclxuICAgIDAsIDAsXHJcbiAgICAzMzU1NDQzMiwgNDMwNDY3MjEsIDE2Nzc3MjE2LCA0ODgyODEyNSwgNjA0NjYxNzYsIDQwMzUzNjA3LCAxNjc3NzIxNixcclxuICAgIDQzMDQ2NzIxLCAxMDAwMDAwMCwgMTk0ODcxNzEsIDM1ODMxODA4LCA2Mjc0ODUxNywgNzUyOTUzNiwgMTEzOTA2MjUsXHJcbiAgICAxNjc3NzIxNiwgMjQxMzc1NjksIDM0MDEyMjI0LCA0NzA0NTg4MSwgNjQwMDAwMDAsIDQwODQxMDEsIDUxNTM2MzIsXHJcbiAgICA2NDM2MzQzLCA3OTYyNjI0LCA5NzY1NjI1LCAxMTg4MTM3NiwgMTQzNDg5MDcsIDE3MjEwMzY4LCAyMDUxMTE0OSxcclxuICAgIDI0MzAwMDAwLCAyODYyOTE1MSwgMzM1NTQ0MzIsIDM5MTM1MzkzLCA0NTQzNTQyNCwgNTI1MjE4NzUsIDYwNDY2MTc2XHJcbiAgXTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKGJhc2UsIHBhZGRpbmcpIHtcclxuICAgIGJhc2UgPSBiYXNlIHx8IDEwO1xyXG4gICAgcGFkZGluZyA9IHBhZGRpbmcgfCAwIHx8IDE7XHJcblxyXG4gICAgdmFyIG91dDtcclxuICAgIGlmIChiYXNlID09PSAxNiB8fCBiYXNlID09PSAnaGV4Jykge1xyXG4gICAgICBvdXQgPSAnJztcclxuICAgICAgdmFyIG9mZiA9IDA7XHJcbiAgICAgIHZhciBjYXJyeSA9IDA7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciB3ID0gdGhpcy53b3Jkc1tpXTtcclxuICAgICAgICB2YXIgd29yZCA9ICgoKHcgPDwgb2ZmKSB8IGNhcnJ5KSAmIDB4ZmZmZmZmKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgY2FycnkgPSAodyA+Pj4gKDI0IC0gb2ZmKSkgJiAweGZmZmZmZjtcclxuICAgICAgICBpZiAoY2FycnkgIT09IDAgfHwgaSAhPT0gdGhpcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICBvdXQgPSB6ZXJvc1s2IC0gd29yZC5sZW5ndGhdICsgd29yZCArIG91dDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb3V0ID0gd29yZCArIG91dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgb2ZmICs9IDI7XHJcbiAgICAgICAgaWYgKG9mZiA+PSAyNikge1xyXG4gICAgICAgICAgb2ZmIC09IDI2O1xyXG4gICAgICAgICAgaS0tO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoY2FycnkgIT09IDApIHtcclxuICAgICAgICBvdXQgPSBjYXJyeS50b1N0cmluZygxNikgKyBvdXQ7XHJcbiAgICAgIH1cclxuICAgICAgd2hpbGUgKG91dC5sZW5ndGggJSBwYWRkaW5nICE9PSAwKSB7XHJcbiAgICAgICAgb3V0ID0gJzAnICsgb3V0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLm5lZ2F0aXZlICE9PSAwKSB7XHJcbiAgICAgICAgb3V0ID0gJy0nICsgb3V0O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGJhc2UgPT09IChiYXNlIHwgMCkgJiYgYmFzZSA+PSAyICYmIGJhc2UgPD0gMzYpIHtcclxuICAgICAgLy8gdmFyIGdyb3VwU2l6ZSA9IE1hdGguZmxvb3IoQk4ud29yZFNpemUgKiBNYXRoLkxOMiAvIE1hdGgubG9nKGJhc2UpKTtcclxuICAgICAgdmFyIGdyb3VwU2l6ZSA9IGdyb3VwU2l6ZXNbYmFzZV07XHJcbiAgICAgIC8vIHZhciBncm91cEJhc2UgPSBNYXRoLnBvdyhiYXNlLCBncm91cFNpemUpO1xyXG4gICAgICB2YXIgZ3JvdXBCYXNlID0gZ3JvdXBCYXNlc1tiYXNlXTtcclxuICAgICAgb3V0ID0gJyc7XHJcbiAgICAgIHZhciBjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICBjLm5lZ2F0aXZlID0gMDtcclxuICAgICAgd2hpbGUgKCFjLmlzWmVybygpKSB7XHJcbiAgICAgICAgdmFyIHIgPSBjLm1vZG4oZ3JvdXBCYXNlKS50b1N0cmluZyhiYXNlKTtcclxuICAgICAgICBjID0gYy5pZGl2bihncm91cEJhc2UpO1xyXG5cclxuICAgICAgICBpZiAoIWMuaXNaZXJvKCkpIHtcclxuICAgICAgICAgIG91dCA9IHplcm9zW2dyb3VwU2l6ZSAtIHIubGVuZ3RoXSArIHIgKyBvdXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG91dCA9IHIgKyBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmlzWmVybygpKSB7XHJcbiAgICAgICAgb3V0ID0gJzAnICsgb3V0O1xyXG4gICAgICB9XHJcbiAgICAgIHdoaWxlIChvdXQubGVuZ3RoICUgcGFkZGluZyAhPT0gMCkge1xyXG4gICAgICAgIG91dCA9ICcwJyArIG91dDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5uZWdhdGl2ZSAhPT0gMCkge1xyXG4gICAgICAgIG91dCA9ICctJyArIG91dDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIGFzc2VydChmYWxzZSwgJ0Jhc2Ugc2hvdWxkIGJlIGJldHdlZW4gMiBhbmQgMzYnKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUudG9OdW1iZXIgPSBmdW5jdGlvbiB0b051bWJlciAoKSB7XHJcbiAgICB2YXIgcmV0ID0gdGhpcy53b3Jkc1swXTtcclxuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICByZXQgKz0gdGhpcy53b3Jkc1sxXSAqIDB4NDAwMDAwMDtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5sZW5ndGggPT09IDMgJiYgdGhpcy53b3Jkc1syXSA9PT0gMHgwMSkge1xyXG4gICAgICAvLyBOT1RFOiBhdCB0aGlzIHN0YWdlIGl0IGlzIGtub3duIHRoYXQgdGhlIHRvcCBiaXQgaXMgc2V0XHJcbiAgICAgIHJldCArPSAweDEwMDAwMDAwMDAwMDAwICsgKHRoaXMud29yZHNbMV0gKiAweDQwMDAwMDApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmxlbmd0aCA+IDIpIHtcclxuICAgICAgYXNzZXJ0KGZhbHNlLCAnTnVtYmVyIGNhbiBvbmx5IHNhZmVseSBzdG9yZSB1cCB0byA1MyBiaXRzJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKHRoaXMubmVnYXRpdmUgIT09IDApID8gLXJldCA6IHJldDtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcclxuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKDE2KTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUudG9CdWZmZXIgPSBmdW5jdGlvbiB0b0J1ZmZlciAoZW5kaWFuLCBsZW5ndGgpIHtcclxuICAgIGFzc2VydCh0eXBlb2YgQnVmZmVyICE9PSAndW5kZWZpbmVkJyk7XHJcbiAgICByZXR1cm4gdGhpcy50b0FycmF5TGlrZShCdWZmZXIsIGVuZGlhbiwgbGVuZ3RoKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uIHRvQXJyYXkgKGVuZGlhbiwgbGVuZ3RoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50b0FycmF5TGlrZShBcnJheSwgZW5kaWFuLCBsZW5ndGgpO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS50b0FycmF5TGlrZSA9IGZ1bmN0aW9uIHRvQXJyYXlMaWtlIChBcnJheVR5cGUsIGVuZGlhbiwgbGVuZ3RoKSB7XHJcbiAgICB2YXIgYnl0ZUxlbmd0aCA9IHRoaXMuYnl0ZUxlbmd0aCgpO1xyXG4gICAgdmFyIHJlcUxlbmd0aCA9IGxlbmd0aCB8fCBNYXRoLm1heCgxLCBieXRlTGVuZ3RoKTtcclxuICAgIGFzc2VydChieXRlTGVuZ3RoIDw9IHJlcUxlbmd0aCwgJ2J5dGUgYXJyYXkgbG9uZ2VyIHRoYW4gZGVzaXJlZCBsZW5ndGgnKTtcclxuICAgIGFzc2VydChyZXFMZW5ndGggPiAwLCAnUmVxdWVzdGVkIGFycmF5IGxlbmd0aCA8PSAwJyk7XHJcblxyXG4gICAgdGhpcy5zdHJpcCgpO1xyXG4gICAgdmFyIGxpdHRsZUVuZGlhbiA9IGVuZGlhbiA9PT0gJ2xlJztcclxuICAgIHZhciByZXMgPSBuZXcgQXJyYXlUeXBlKHJlcUxlbmd0aCk7XHJcblxyXG4gICAgdmFyIGIsIGk7XHJcbiAgICB2YXIgcSA9IHRoaXMuY2xvbmUoKTtcclxuICAgIGlmICghbGl0dGxlRW5kaWFuKSB7XHJcbiAgICAgIC8vIEFzc3VtZSBiaWctZW5kaWFuXHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCByZXFMZW5ndGggLSBieXRlTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICByZXNbaV0gPSAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGkgPSAwOyAhcS5pc1plcm8oKTsgaSsrKSB7XHJcbiAgICAgICAgYiA9IHEuYW5kbG4oMHhmZik7XHJcbiAgICAgICAgcS5pdXNocm4oOCk7XHJcblxyXG4gICAgICAgIHJlc1tyZXFMZW5ndGggLSBpIC0gMV0gPSBiO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IgKGkgPSAwOyAhcS5pc1plcm8oKTsgaSsrKSB7XHJcbiAgICAgICAgYiA9IHEuYW5kbG4oMHhmZik7XHJcbiAgICAgICAgcS5pdXNocm4oOCk7XHJcblxyXG4gICAgICAgIHJlc1tpXSA9IGI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAoOyBpIDwgcmVxTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICByZXNbaV0gPSAwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlcztcclxuICB9O1xyXG5cclxuICBpZiAoTWF0aC5jbHozMikge1xyXG4gICAgQk4ucHJvdG90eXBlLl9jb3VudEJpdHMgPSBmdW5jdGlvbiBfY291bnRCaXRzICh3KSB7XHJcbiAgICAgIHJldHVybiAzMiAtIE1hdGguY2x6MzIodyk7XHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICBCTi5wcm90b3R5cGUuX2NvdW50Qml0cyA9IGZ1bmN0aW9uIF9jb3VudEJpdHMgKHcpIHtcclxuICAgICAgdmFyIHQgPSB3O1xyXG4gICAgICB2YXIgciA9IDA7XHJcbiAgICAgIGlmICh0ID49IDB4MTAwMCkge1xyXG4gICAgICAgIHIgKz0gMTM7XHJcbiAgICAgICAgdCA+Pj49IDEzO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ID49IDB4NDApIHtcclxuICAgICAgICByICs9IDc7XHJcbiAgICAgICAgdCA+Pj49IDc7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHQgPj0gMHg4KSB7XHJcbiAgICAgICAgciArPSA0O1xyXG4gICAgICAgIHQgPj4+PSA0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ID49IDB4MDIpIHtcclxuICAgICAgICByICs9IDI7XHJcbiAgICAgICAgdCA+Pj49IDI7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHIgKyB0O1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIEJOLnByb3RvdHlwZS5femVyb0JpdHMgPSBmdW5jdGlvbiBfemVyb0JpdHMgKHcpIHtcclxuICAgIC8vIFNob3J0LWN1dFxyXG4gICAgaWYgKHcgPT09IDApIHJldHVybiAyNjtcclxuXHJcbiAgICB2YXIgdCA9IHc7XHJcbiAgICB2YXIgciA9IDA7XHJcbiAgICBpZiAoKHQgJiAweDFmZmYpID09PSAwKSB7XHJcbiAgICAgIHIgKz0gMTM7XHJcbiAgICAgIHQgPj4+PSAxMztcclxuICAgIH1cclxuICAgIGlmICgodCAmIDB4N2YpID09PSAwKSB7XHJcbiAgICAgIHIgKz0gNztcclxuICAgICAgdCA+Pj49IDc7XHJcbiAgICB9XHJcbiAgICBpZiAoKHQgJiAweGYpID09PSAwKSB7XHJcbiAgICAgIHIgKz0gNDtcclxuICAgICAgdCA+Pj49IDQ7XHJcbiAgICB9XHJcbiAgICBpZiAoKHQgJiAweDMpID09PSAwKSB7XHJcbiAgICAgIHIgKz0gMjtcclxuICAgICAgdCA+Pj49IDI7XHJcbiAgICB9XHJcbiAgICBpZiAoKHQgJiAweDEpID09PSAwKSB7XHJcbiAgICAgIHIrKztcclxuICAgIH1cclxuICAgIHJldHVybiByO1xyXG4gIH07XHJcblxyXG4gIC8vIFJldHVybiBudW1iZXIgb2YgdXNlZCBiaXRzIGluIGEgQk5cclxuICBCTi5wcm90b3R5cGUuYml0TGVuZ3RoID0gZnVuY3Rpb24gYml0TGVuZ3RoICgpIHtcclxuICAgIHZhciB3ID0gdGhpcy53b3Jkc1t0aGlzLmxlbmd0aCAtIDFdO1xyXG4gICAgdmFyIGhpID0gdGhpcy5fY291bnRCaXRzKHcpO1xyXG4gICAgcmV0dXJuICh0aGlzLmxlbmd0aCAtIDEpICogMjYgKyBoaTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiB0b0JpdEFycmF5IChudW0pIHtcclxuICAgIHZhciB3ID0gbmV3IEFycmF5KG51bS5iaXRMZW5ndGgoKSk7XHJcblxyXG4gICAgZm9yICh2YXIgYml0ID0gMDsgYml0IDwgdy5sZW5ndGg7IGJpdCsrKSB7XHJcbiAgICAgIHZhciBvZmYgPSAoYml0IC8gMjYpIHwgMDtcclxuICAgICAgdmFyIHdiaXQgPSBiaXQgJSAyNjtcclxuXHJcbiAgICAgIHdbYml0XSA9IChudW0ud29yZHNbb2ZmXSAmICgxIDw8IHdiaXQpKSA+Pj4gd2JpdDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdztcclxuICB9XHJcblxyXG4gIC8vIE51bWJlciBvZiB0cmFpbGluZyB6ZXJvIGJpdHNcclxuICBCTi5wcm90b3R5cGUuemVyb0JpdHMgPSBmdW5jdGlvbiB6ZXJvQml0cyAoKSB7XHJcbiAgICBpZiAodGhpcy5pc1plcm8oKSkgcmV0dXJuIDA7XHJcblxyXG4gICAgdmFyIHIgPSAwO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBiID0gdGhpcy5femVyb0JpdHModGhpcy53b3Jkc1tpXSk7XHJcbiAgICAgIHIgKz0gYjtcclxuICAgICAgaWYgKGIgIT09IDI2KSBicmVhaztcclxuICAgIH1cclxuICAgIHJldHVybiByO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gYnl0ZUxlbmd0aCAoKSB7XHJcbiAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMuYml0TGVuZ3RoKCkgLyA4KTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUudG9Ud29zID0gZnVuY3Rpb24gdG9Ud29zICh3aWR0aCkge1xyXG4gICAgaWYgKHRoaXMubmVnYXRpdmUgIT09IDApIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYWJzKCkuaW5vdG4od2lkdGgpLmlhZGRuKDEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuZnJvbVR3b3MgPSBmdW5jdGlvbiBmcm9tVHdvcyAod2lkdGgpIHtcclxuICAgIGlmICh0aGlzLnRlc3RuKHdpZHRoIC0gMSkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMubm90bih3aWR0aCkuaWFkZG4oMSkuaW5lZygpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuaXNOZWcgPSBmdW5jdGlvbiBpc05lZyAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5uZWdhdGl2ZSAhPT0gMDtcclxuICB9O1xyXG5cclxuICAvLyBSZXR1cm4gbmVnYXRpdmUgY2xvbmUgb2YgYHRoaXNgXHJcbiAgQk4ucHJvdG90eXBlLm5lZyA9IGZ1bmN0aW9uIG5lZyAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmluZWcoKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuaW5lZyA9IGZ1bmN0aW9uIGluZWcgKCkge1xyXG4gICAgaWYgKCF0aGlzLmlzWmVybygpKSB7XHJcbiAgICAgIHRoaXMubmVnYXRpdmUgXj0gMTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICAvLyBPciBgbnVtYCB3aXRoIGB0aGlzYCBpbi1wbGFjZVxyXG4gIEJOLnByb3RvdHlwZS5pdW9yID0gZnVuY3Rpb24gaXVvciAobnVtKSB7XHJcbiAgICB3aGlsZSAodGhpcy5sZW5ndGggPCBudW0ubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMud29yZHNbdGhpcy5sZW5ndGgrK10gPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMud29yZHNbaV0gPSB0aGlzLndvcmRzW2ldIHwgbnVtLndvcmRzW2ldO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnN0cmlwKCk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLmlvciA9IGZ1bmN0aW9uIGlvciAobnVtKSB7XHJcbiAgICBhc3NlcnQoKHRoaXMubmVnYXRpdmUgfCBudW0ubmVnYXRpdmUpID09PSAwKTtcclxuICAgIHJldHVybiB0aGlzLml1b3IobnVtKTtcclxuICB9O1xyXG5cclxuICAvLyBPciBgbnVtYCB3aXRoIGB0aGlzYFxyXG4gIEJOLnByb3RvdHlwZS5vciA9IGZ1bmN0aW9uIG9yIChudW0pIHtcclxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG51bS5sZW5ndGgpIHJldHVybiB0aGlzLmNsb25lKCkuaW9yKG51bSk7XHJcbiAgICByZXR1cm4gbnVtLmNsb25lKCkuaW9yKHRoaXMpO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS51b3IgPSBmdW5jdGlvbiB1b3IgKG51bSkge1xyXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbnVtLmxlbmd0aCkgcmV0dXJuIHRoaXMuY2xvbmUoKS5pdW9yKG51bSk7XHJcbiAgICByZXR1cm4gbnVtLmNsb25lKCkuaXVvcih0aGlzKTtcclxuICB9O1xyXG5cclxuICAvLyBBbmQgYG51bWAgd2l0aCBgdGhpc2AgaW4tcGxhY2VcclxuICBCTi5wcm90b3R5cGUuaXVhbmQgPSBmdW5jdGlvbiBpdWFuZCAobnVtKSB7XHJcbiAgICAvLyBiID0gbWluLWxlbmd0aChudW0sIHRoaXMpXHJcbiAgICB2YXIgYjtcclxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG51bS5sZW5ndGgpIHtcclxuICAgICAgYiA9IG51bTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGIgPSB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLndvcmRzW2ldID0gdGhpcy53b3Jkc1tpXSAmIG51bS53b3Jkc1tpXTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxlbmd0aCA9IGIubGVuZ3RoO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnN0cmlwKCk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLmlhbmQgPSBmdW5jdGlvbiBpYW5kIChudW0pIHtcclxuICAgIGFzc2VydCgodGhpcy5uZWdhdGl2ZSB8IG51bS5uZWdhdGl2ZSkgPT09IDApO1xyXG4gICAgcmV0dXJuIHRoaXMuaXVhbmQobnVtKTtcclxuICB9O1xyXG5cclxuICAvLyBBbmQgYG51bWAgd2l0aCBgdGhpc2BcclxuICBCTi5wcm90b3R5cGUuYW5kID0gZnVuY3Rpb24gYW5kIChudW0pIHtcclxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG51bS5sZW5ndGgpIHJldHVybiB0aGlzLmNsb25lKCkuaWFuZChudW0pO1xyXG4gICAgcmV0dXJuIG51bS5jbG9uZSgpLmlhbmQodGhpcyk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLnVhbmQgPSBmdW5jdGlvbiB1YW5kIChudW0pIHtcclxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG51bS5sZW5ndGgpIHJldHVybiB0aGlzLmNsb25lKCkuaXVhbmQobnVtKTtcclxuICAgIHJldHVybiBudW0uY2xvbmUoKS5pdWFuZCh0aGlzKTtcclxuICB9O1xyXG5cclxuICAvLyBYb3IgYG51bWAgd2l0aCBgdGhpc2AgaW4tcGxhY2VcclxuICBCTi5wcm90b3R5cGUuaXV4b3IgPSBmdW5jdGlvbiBpdXhvciAobnVtKSB7XHJcbiAgICAvLyBhLmxlbmd0aCA+IGIubGVuZ3RoXHJcbiAgICB2YXIgYTtcclxuICAgIHZhciBiO1xyXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbnVtLmxlbmd0aCkge1xyXG4gICAgICBhID0gdGhpcztcclxuICAgICAgYiA9IG51bTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGEgPSBudW07XHJcbiAgICAgIGIgPSB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLndvcmRzW2ldID0gYS53b3Jkc1tpXSBeIGIud29yZHNbaV07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMgIT09IGEpIHtcclxuICAgICAgZm9yICg7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy53b3Jkc1tpXSA9IGEud29yZHNbaV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxlbmd0aCA9IGEubGVuZ3RoO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnN0cmlwKCk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLml4b3IgPSBmdW5jdGlvbiBpeG9yIChudW0pIHtcclxuICAgIGFzc2VydCgodGhpcy5uZWdhdGl2ZSB8IG51bS5uZWdhdGl2ZSkgPT09IDApO1xyXG4gICAgcmV0dXJuIHRoaXMuaXV4b3IobnVtKTtcclxuICB9O1xyXG5cclxuICAvLyBYb3IgYG51bWAgd2l0aCBgdGhpc2BcclxuICBCTi5wcm90b3R5cGUueG9yID0gZnVuY3Rpb24geG9yIChudW0pIHtcclxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG51bS5sZW5ndGgpIHJldHVybiB0aGlzLmNsb25lKCkuaXhvcihudW0pO1xyXG4gICAgcmV0dXJuIG51bS5jbG9uZSgpLml4b3IodGhpcyk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLnV4b3IgPSBmdW5jdGlvbiB1eG9yIChudW0pIHtcclxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG51bS5sZW5ndGgpIHJldHVybiB0aGlzLmNsb25lKCkuaXV4b3IobnVtKTtcclxuICAgIHJldHVybiBudW0uY2xvbmUoKS5pdXhvcih0aGlzKTtcclxuICB9O1xyXG5cclxuICAvLyBOb3QgYGB0aGlzYGAgd2l0aCBgYHdpZHRoYGAgYml0d2lkdGhcclxuICBCTi5wcm90b3R5cGUuaW5vdG4gPSBmdW5jdGlvbiBpbm90biAod2lkdGgpIHtcclxuICAgIGFzc2VydCh0eXBlb2Ygd2lkdGggPT09ICdudW1iZXInICYmIHdpZHRoID49IDApO1xyXG5cclxuICAgIHZhciBieXRlc05lZWRlZCA9IE1hdGguY2VpbCh3aWR0aCAvIDI2KSB8IDA7XHJcbiAgICB2YXIgYml0c0xlZnQgPSB3aWR0aCAlIDI2O1xyXG5cclxuICAgIC8vIEV4dGVuZCB0aGUgYnVmZmVyIHdpdGggbGVhZGluZyB6ZXJvZXNcclxuICAgIHRoaXMuX2V4cGFuZChieXRlc05lZWRlZCk7XHJcblxyXG4gICAgaWYgKGJpdHNMZWZ0ID4gMCkge1xyXG4gICAgICBieXRlc05lZWRlZC0tO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEhhbmRsZSBjb21wbGV0ZSB3b3Jkc1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlc05lZWRlZDsgaSsrKSB7XHJcbiAgICAgIHRoaXMud29yZHNbaV0gPSB+dGhpcy53b3Jkc1tpXSAmIDB4M2ZmZmZmZjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIYW5kbGUgdGhlIHJlc2lkdWVcclxuICAgIGlmIChiaXRzTGVmdCA+IDApIHtcclxuICAgICAgdGhpcy53b3Jkc1tpXSA9IH50aGlzLndvcmRzW2ldICYgKDB4M2ZmZmZmZiA+PiAoMjYgLSBiaXRzTGVmdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFuZCByZW1vdmUgbGVhZGluZyB6ZXJvZXNcclxuICAgIHJldHVybiB0aGlzLnN0cmlwKCk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLm5vdG4gPSBmdW5jdGlvbiBub3RuICh3aWR0aCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pbm90bih3aWR0aCk7XHJcbiAgfTtcclxuXHJcbiAgLy8gU2V0IGBiaXRgIG9mIGB0aGlzYFxyXG4gIEJOLnByb3RvdHlwZS5zZXRuID0gZnVuY3Rpb24gc2V0biAoYml0LCB2YWwpIHtcclxuICAgIGFzc2VydCh0eXBlb2YgYml0ID09PSAnbnVtYmVyJyAmJiBiaXQgPj0gMCk7XHJcblxyXG4gICAgdmFyIG9mZiA9IChiaXQgLyAyNikgfCAwO1xyXG4gICAgdmFyIHdiaXQgPSBiaXQgJSAyNjtcclxuXHJcbiAgICB0aGlzLl9leHBhbmQob2ZmICsgMSk7XHJcblxyXG4gICAgaWYgKHZhbCkge1xyXG4gICAgICB0aGlzLndvcmRzW29mZl0gPSB0aGlzLndvcmRzW29mZl0gfCAoMSA8PCB3Yml0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMud29yZHNbb2ZmXSA9IHRoaXMud29yZHNbb2ZmXSAmIH4oMSA8PCB3Yml0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5zdHJpcCgpO1xyXG4gIH07XHJcblxyXG4gIC8vIEFkZCBgbnVtYCB0byBgdGhpc2AgaW4tcGxhY2VcclxuICBCTi5wcm90b3R5cGUuaWFkZCA9IGZ1bmN0aW9uIGlhZGQgKG51bSkge1xyXG4gICAgdmFyIHI7XHJcblxyXG4gICAgLy8gbmVnYXRpdmUgKyBwb3NpdGl2ZVxyXG4gICAgaWYgKHRoaXMubmVnYXRpdmUgIT09IDAgJiYgbnVtLm5lZ2F0aXZlID09PSAwKSB7XHJcbiAgICAgIHRoaXMubmVnYXRpdmUgPSAwO1xyXG4gICAgICByID0gdGhpcy5pc3ViKG51bSk7XHJcbiAgICAgIHRoaXMubmVnYXRpdmUgXj0gMTtcclxuICAgICAgcmV0dXJuIHRoaXMuX25vcm1TaWduKCk7XHJcblxyXG4gICAgLy8gcG9zaXRpdmUgKyBuZWdhdGl2ZVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLm5lZ2F0aXZlID09PSAwICYmIG51bS5uZWdhdGl2ZSAhPT0gMCkge1xyXG4gICAgICBudW0ubmVnYXRpdmUgPSAwO1xyXG4gICAgICByID0gdGhpcy5pc3ViKG51bSk7XHJcbiAgICAgIG51bS5uZWdhdGl2ZSA9IDE7XHJcbiAgICAgIHJldHVybiByLl9ub3JtU2lnbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGEubGVuZ3RoID4gYi5sZW5ndGhcclxuICAgIHZhciBhLCBiO1xyXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbnVtLmxlbmd0aCkge1xyXG4gICAgICBhID0gdGhpcztcclxuICAgICAgYiA9IG51bTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGEgPSBudW07XHJcbiAgICAgIGIgPSB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjYXJyeSA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgciA9IChhLndvcmRzW2ldIHwgMCkgKyAoYi53b3Jkc1tpXSB8IDApICsgY2Fycnk7XHJcbiAgICAgIHRoaXMud29yZHNbaV0gPSByICYgMHgzZmZmZmZmO1xyXG4gICAgICBjYXJyeSA9IHIgPj4+IDI2O1xyXG4gICAgfVxyXG4gICAgZm9yICg7IGNhcnJ5ICE9PSAwICYmIGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHIgPSAoYS53b3Jkc1tpXSB8IDApICsgY2Fycnk7XHJcbiAgICAgIHRoaXMud29yZHNbaV0gPSByICYgMHgzZmZmZmZmO1xyXG4gICAgICBjYXJyeSA9IHIgPj4+IDI2O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGVuZ3RoID0gYS5sZW5ndGg7XHJcbiAgICBpZiAoY2FycnkgIT09IDApIHtcclxuICAgICAgdGhpcy53b3Jkc1t0aGlzLmxlbmd0aF0gPSBjYXJyeTtcclxuICAgICAgdGhpcy5sZW5ndGgrKztcclxuICAgIC8vIENvcHkgdGhlIHJlc3Qgb2YgdGhlIHdvcmRzXHJcbiAgICB9IGVsc2UgaWYgKGEgIT09IHRoaXMpIHtcclxuICAgICAgZm9yICg7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy53b3Jkc1tpXSA9IGEud29yZHNbaV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICAvLyBBZGQgYG51bWAgdG8gYHRoaXNgXHJcbiAgQk4ucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZCAobnVtKSB7XHJcbiAgICB2YXIgcmVzO1xyXG4gICAgaWYgKG51bS5uZWdhdGl2ZSAhPT0gMCAmJiB0aGlzLm5lZ2F0aXZlID09PSAwKSB7XHJcbiAgICAgIG51bS5uZWdhdGl2ZSA9IDA7XHJcbiAgICAgIHJlcyA9IHRoaXMuc3ViKG51bSk7XHJcbiAgICAgIG51bS5uZWdhdGl2ZSBePSAxO1xyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfSBlbHNlIGlmIChudW0ubmVnYXRpdmUgPT09IDAgJiYgdGhpcy5uZWdhdGl2ZSAhPT0gMCkge1xyXG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMDtcclxuICAgICAgcmVzID0gbnVtLnN1Yih0aGlzKTtcclxuICAgICAgdGhpcy5uZWdhdGl2ZSA9IDE7XHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbnVtLmxlbmd0aCkgcmV0dXJuIHRoaXMuY2xvbmUoKS5pYWRkKG51bSk7XHJcblxyXG4gICAgcmV0dXJuIG51bS5jbG9uZSgpLmlhZGQodGhpcyk7XHJcbiAgfTtcclxuXHJcbiAgLy8gU3VidHJhY3QgYG51bWAgZnJvbSBgdGhpc2AgaW4tcGxhY2VcclxuICBCTi5wcm90b3R5cGUuaXN1YiA9IGZ1bmN0aW9uIGlzdWIgKG51bSkge1xyXG4gICAgLy8gdGhpcyAtICgtbnVtKSA9IHRoaXMgKyBudW1cclxuICAgIGlmIChudW0ubmVnYXRpdmUgIT09IDApIHtcclxuICAgICAgbnVtLm5lZ2F0aXZlID0gMDtcclxuICAgICAgdmFyIHIgPSB0aGlzLmlhZGQobnVtKTtcclxuICAgICAgbnVtLm5lZ2F0aXZlID0gMTtcclxuICAgICAgcmV0dXJuIHIuX25vcm1TaWduKCk7XHJcblxyXG4gICAgLy8gLXRoaXMgLSBudW0gPSAtKHRoaXMgKyBudW0pXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMubmVnYXRpdmUgIT09IDApIHtcclxuICAgICAgdGhpcy5uZWdhdGl2ZSA9IDA7XHJcbiAgICAgIHRoaXMuaWFkZChudW0pO1xyXG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMTtcclxuICAgICAgcmV0dXJuIHRoaXMuX25vcm1TaWduKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQXQgdGhpcyBwb2ludCBib3RoIG51bWJlcnMgYXJlIHBvc2l0aXZlXHJcbiAgICB2YXIgY21wID0gdGhpcy5jbXAobnVtKTtcclxuXHJcbiAgICAvLyBPcHRpbWl6YXRpb24gLSB6ZXJvaWZ5XHJcbiAgICBpZiAoY21wID09PSAwKSB7XHJcbiAgICAgIHRoaXMubmVnYXRpdmUgPSAwO1xyXG4gICAgICB0aGlzLmxlbmd0aCA9IDE7XHJcbiAgICAgIHRoaXMud29yZHNbMF0gPSAwO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvLyBhID4gYlxyXG4gICAgdmFyIGEsIGI7XHJcbiAgICBpZiAoY21wID4gMCkge1xyXG4gICAgICBhID0gdGhpcztcclxuICAgICAgYiA9IG51bTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGEgPSBudW07XHJcbiAgICAgIGIgPSB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjYXJyeSA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgciA9IChhLndvcmRzW2ldIHwgMCkgLSAoYi53b3Jkc1tpXSB8IDApICsgY2Fycnk7XHJcbiAgICAgIGNhcnJ5ID0gciA+PiAyNjtcclxuICAgICAgdGhpcy53b3Jkc1tpXSA9IHIgJiAweDNmZmZmZmY7XHJcbiAgICB9XHJcbiAgICBmb3IgKDsgY2FycnkgIT09IDAgJiYgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgciA9IChhLndvcmRzW2ldIHwgMCkgKyBjYXJyeTtcclxuICAgICAgY2FycnkgPSByID4+IDI2O1xyXG4gICAgICB0aGlzLndvcmRzW2ldID0gciAmIDB4M2ZmZmZmZjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb3B5IHJlc3Qgb2YgdGhlIHdvcmRzXHJcbiAgICBpZiAoY2FycnkgPT09IDAgJiYgaSA8IGEubGVuZ3RoICYmIGEgIT09IHRoaXMpIHtcclxuICAgICAgZm9yICg7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy53b3Jkc1tpXSA9IGEud29yZHNbaV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxlbmd0aCA9IE1hdGgubWF4KHRoaXMubGVuZ3RoLCBpKTtcclxuXHJcbiAgICBpZiAoYSAhPT0gdGhpcykge1xyXG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5zdHJpcCgpO1xyXG4gIH07XHJcblxyXG4gIC8vIFN1YnRyYWN0IGBudW1gIGZyb20gYHRoaXNgXHJcbiAgQk4ucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uIHN1YiAobnVtKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmlzdWIobnVtKTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBzbWFsbE11bFRvIChzZWxmLCBudW0sIG91dCkge1xyXG4gICAgb3V0Lm5lZ2F0aXZlID0gbnVtLm5lZ2F0aXZlIF4gc2VsZi5uZWdhdGl2ZTtcclxuICAgIHZhciBsZW4gPSAoc2VsZi5sZW5ndGggKyBudW0ubGVuZ3RoKSB8IDA7XHJcbiAgICBvdXQubGVuZ3RoID0gbGVuO1xyXG4gICAgbGVuID0gKGxlbiAtIDEpIHwgMDtcclxuXHJcbiAgICAvLyBQZWVsIG9uZSBpdGVyYXRpb24gKGNvbXBpbGVyIGNhbid0IGRvIGl0LCBiZWNhdXNlIG9mIGNvZGUgY29tcGxleGl0eSlcclxuICAgIHZhciBhID0gc2VsZi53b3Jkc1swXSB8IDA7XHJcbiAgICB2YXIgYiA9IG51bS53b3Jkc1swXSB8IDA7XHJcbiAgICB2YXIgciA9IGEgKiBiO1xyXG5cclxuICAgIHZhciBsbyA9IHIgJiAweDNmZmZmZmY7XHJcbiAgICB2YXIgY2FycnkgPSAociAvIDB4NDAwMDAwMCkgfCAwO1xyXG4gICAgb3V0LndvcmRzWzBdID0gbG87XHJcblxyXG4gICAgZm9yICh2YXIgayA9IDE7IGsgPCBsZW47IGsrKykge1xyXG4gICAgICAvLyBTdW0gYWxsIHdvcmRzIHdpdGggdGhlIHNhbWUgYGkgKyBqID0ga2AgYW5kIGFjY3VtdWxhdGUgYG5jYXJyeWAsXHJcbiAgICAgIC8vIG5vdGUgdGhhdCBuY2FycnkgY291bGQgYmUgPj0gMHgzZmZmZmZmXHJcbiAgICAgIHZhciBuY2FycnkgPSBjYXJyeSA+Pj4gMjY7XHJcbiAgICAgIHZhciByd29yZCA9IGNhcnJ5ICYgMHgzZmZmZmZmO1xyXG4gICAgICB2YXIgbWF4SiA9IE1hdGgubWluKGssIG51bS5sZW5ndGggLSAxKTtcclxuICAgICAgZm9yICh2YXIgaiA9IE1hdGgubWF4KDAsIGsgLSBzZWxmLmxlbmd0aCArIDEpOyBqIDw9IG1heEo7IGorKykge1xyXG4gICAgICAgIHZhciBpID0gKGsgLSBqKSB8IDA7XHJcbiAgICAgICAgYSA9IHNlbGYud29yZHNbaV0gfCAwO1xyXG4gICAgICAgIGIgPSBudW0ud29yZHNbal0gfCAwO1xyXG4gICAgICAgIHIgPSBhICogYiArIHJ3b3JkO1xyXG4gICAgICAgIG5jYXJyeSArPSAociAvIDB4NDAwMDAwMCkgfCAwO1xyXG4gICAgICAgIHJ3b3JkID0gciAmIDB4M2ZmZmZmZjtcclxuICAgICAgfVxyXG4gICAgICBvdXQud29yZHNba10gPSByd29yZCB8IDA7XHJcbiAgICAgIGNhcnJ5ID0gbmNhcnJ5IHwgMDtcclxuICAgIH1cclxuICAgIGlmIChjYXJyeSAhPT0gMCkge1xyXG4gICAgICBvdXQud29yZHNba10gPSBjYXJyeSB8IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQubGVuZ3RoLS07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG91dC5zdHJpcCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gVE9ETyhpbmR1dG55KTogaXQgbWF5IGJlIHJlYXNvbmFibGUgdG8gb21pdCBpdCBmb3IgdXNlcnMgd2hvIGRvbid0IG5lZWRcclxuICAvLyB0byB3b3JrIHdpdGggMjU2LWJpdCBudW1iZXJzLCBvdGhlcndpc2UgaXQgZ2l2ZXMgMjAlIGltcHJvdmVtZW50IGZvciAyNTYtYml0XHJcbiAgLy8gbXVsdGlwbGljYXRpb24gKGxpa2UgZWxsaXB0aWMgc2VjcDI1NmsxKS5cclxuICB2YXIgY29tYjEwTXVsVG8gPSBmdW5jdGlvbiBjb21iMTBNdWxUbyAoc2VsZiwgbnVtLCBvdXQpIHtcclxuICAgIHZhciBhID0gc2VsZi53b3JkcztcclxuICAgIHZhciBiID0gbnVtLndvcmRzO1xyXG4gICAgdmFyIG8gPSBvdXQud29yZHM7XHJcbiAgICB2YXIgYyA9IDA7XHJcbiAgICB2YXIgbG87XHJcbiAgICB2YXIgbWlkO1xyXG4gICAgdmFyIGhpO1xyXG4gICAgdmFyIGEwID0gYVswXSB8IDA7XHJcbiAgICB2YXIgYWwwID0gYTAgJiAweDFmZmY7XHJcbiAgICB2YXIgYWgwID0gYTAgPj4+IDEzO1xyXG4gICAgdmFyIGExID0gYVsxXSB8IDA7XHJcbiAgICB2YXIgYWwxID0gYTEgJiAweDFmZmY7XHJcbiAgICB2YXIgYWgxID0gYTEgPj4+IDEzO1xyXG4gICAgdmFyIGEyID0gYVsyXSB8IDA7XHJcbiAgICB2YXIgYWwyID0gYTIgJiAweDFmZmY7XHJcbiAgICB2YXIgYWgyID0gYTIgPj4+IDEzO1xyXG4gICAgdmFyIGEzID0gYVszXSB8IDA7XHJcbiAgICB2YXIgYWwzID0gYTMgJiAweDFmZmY7XHJcbiAgICB2YXIgYWgzID0gYTMgPj4+IDEzO1xyXG4gICAgdmFyIGE0ID0gYVs0XSB8IDA7XHJcbiAgICB2YXIgYWw0ID0gYTQgJiAweDFmZmY7XHJcbiAgICB2YXIgYWg0ID0gYTQgPj4+IDEzO1xyXG4gICAgdmFyIGE1ID0gYVs1XSB8IDA7XHJcbiAgICB2YXIgYWw1ID0gYTUgJiAweDFmZmY7XHJcbiAgICB2YXIgYWg1ID0gYTUgPj4+IDEzO1xyXG4gICAgdmFyIGE2ID0gYVs2XSB8IDA7XHJcbiAgICB2YXIgYWw2ID0gYTYgJiAweDFmZmY7XHJcbiAgICB2YXIgYWg2ID0gYTYgPj4+IDEzO1xyXG4gICAgdmFyIGE3ID0gYVs3XSB8IDA7XHJcbiAgICB2YXIgYWw3ID0gYTcgJiAweDFmZmY7XHJcbiAgICB2YXIgYWg3ID0gYTcgPj4+IDEzO1xyXG4gICAgdmFyIGE4ID0gYVs4XSB8IDA7XHJcbiAgICB2YXIgYWw4ID0gYTggJiAweDFmZmY7XHJcbiAgICB2YXIgYWg4ID0gYTggPj4+IDEzO1xyXG4gICAgdmFyIGE5ID0gYVs5XSB8IDA7XHJcbiAgICB2YXIgYWw5ID0gYTkgJiAweDFmZmY7XHJcbiAgICB2YXIgYWg5ID0gYTkgPj4+IDEzO1xyXG4gICAgdmFyIGIwID0gYlswXSB8IDA7XHJcbiAgICB2YXIgYmwwID0gYjAgJiAweDFmZmY7XHJcbiAgICB2YXIgYmgwID0gYjAgPj4+IDEzO1xyXG4gICAgdmFyIGIxID0gYlsxXSB8IDA7XHJcbiAgICB2YXIgYmwxID0gYjEgJiAweDFmZmY7XHJcbiAgICB2YXIgYmgxID0gYjEgPj4+IDEzO1xyXG4gICAgdmFyIGIyID0gYlsyXSB8IDA7XHJcbiAgICB2YXIgYmwyID0gYjIgJiAweDFmZmY7XHJcbiAgICB2YXIgYmgyID0gYjIgPj4+IDEzO1xyXG4gICAgdmFyIGIzID0gYlszXSB8IDA7XHJcbiAgICB2YXIgYmwzID0gYjMgJiAweDFmZmY7XHJcbiAgICB2YXIgYmgzID0gYjMgPj4+IDEzO1xyXG4gICAgdmFyIGI0ID0gYls0XSB8IDA7XHJcbiAgICB2YXIgYmw0ID0gYjQgJiAweDFmZmY7XHJcbiAgICB2YXIgYmg0ID0gYjQgPj4+IDEzO1xyXG4gICAgdmFyIGI1ID0gYls1XSB8IDA7XHJcbiAgICB2YXIgYmw1ID0gYjUgJiAweDFmZmY7XHJcbiAgICB2YXIgYmg1ID0gYjUgPj4+IDEzO1xyXG4gICAgdmFyIGI2ID0gYls2XSB8IDA7XHJcbiAgICB2YXIgYmw2ID0gYjYgJiAweDFmZmY7XHJcbiAgICB2YXIgYmg2ID0gYjYgPj4+IDEzO1xyXG4gICAgdmFyIGI3ID0gYls3XSB8IDA7XHJcbiAgICB2YXIgYmw3ID0gYjcgJiAweDFmZmY7XHJcbiAgICB2YXIgYmg3ID0gYjcgPj4+IDEzO1xyXG4gICAgdmFyIGI4ID0gYls4XSB8IDA7XHJcbiAgICB2YXIgYmw4ID0gYjggJiAweDFmZmY7XHJcbiAgICB2YXIgYmg4ID0gYjggPj4+IDEzO1xyXG4gICAgdmFyIGI5ID0gYls5XSB8IDA7XHJcbiAgICB2YXIgYmw5ID0gYjkgJiAweDFmZmY7XHJcbiAgICB2YXIgYmg5ID0gYjkgPj4+IDEzO1xyXG5cclxuICAgIG91dC5uZWdhdGl2ZSA9IHNlbGYubmVnYXRpdmUgXiBudW0ubmVnYXRpdmU7XHJcbiAgICBvdXQubGVuZ3RoID0gMTk7XHJcbiAgICAvKiBrID0gMCAqL1xyXG4gICAgbG8gPSBNYXRoLmltdWwoYWwwLCBibDApO1xyXG4gICAgbWlkID0gTWF0aC5pbXVsKGFsMCwgYmgwKTtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgwLCBibDApKSB8IDA7XHJcbiAgICBoaSA9IE1hdGguaW11bChhaDAsIGJoMCk7XHJcbiAgICB2YXIgdzAgPSAoKChjICsgbG8pIHwgMCkgKyAoKG1pZCAmIDB4MWZmZikgPDwgMTMpKSB8IDA7XHJcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzAgPj4+IDI2KSkgfCAwO1xyXG4gICAgdzAgJj0gMHgzZmZmZmZmO1xyXG4gICAgLyogayA9IDEgKi9cclxuICAgIGxvID0gTWF0aC5pbXVsKGFsMSwgYmwwKTtcclxuICAgIG1pZCA9IE1hdGguaW11bChhbDEsIGJoMCk7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMSwgYmwwKSkgfCAwO1xyXG4gICAgaGkgPSBNYXRoLmltdWwoYWgxLCBiaDApO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwwLCBibDEpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMCwgYmgxKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDAsIGJsMSkpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMCwgYmgxKSkgfCAwO1xyXG4gICAgdmFyIHcxID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xyXG4gICAgYyA9ICgoKGhpICsgKG1pZCA+Pj4gMTMpKSB8IDApICsgKHcxID4+PiAyNikpIHwgMDtcclxuICAgIHcxICY9IDB4M2ZmZmZmZjtcclxuICAgIC8qIGsgPSAyICovXHJcbiAgICBsbyA9IE1hdGguaW11bChhbDIsIGJsMCk7XHJcbiAgICBtaWQgPSBNYXRoLmltdWwoYWwyLCBiaDApO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDIsIGJsMCkpIHwgMDtcclxuICAgIGhpID0gTWF0aC5pbXVsKGFoMiwgYmgwKTtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMSwgYmwxKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDEsIGJoMSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgxLCBibDEpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDEsIGJoMSkpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMCwgYmwyKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDAsIGJoMikpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgwLCBibDIpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDAsIGJoMikpIHwgMDtcclxuICAgIHZhciB3MiA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcclxuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3MiA+Pj4gMjYpKSB8IDA7XHJcbiAgICB3MiAmPSAweDNmZmZmZmY7XHJcbiAgICAvKiBrID0gMyAqL1xyXG4gICAgbG8gPSBNYXRoLmltdWwoYWwzLCBibDApO1xyXG4gICAgbWlkID0gTWF0aC5pbXVsKGFsMywgYmgwKTtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgzLCBibDApKSB8IDA7XHJcbiAgICBoaSA9IE1hdGguaW11bChhaDMsIGJoMCk7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDIsIGJsMSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwyLCBiaDEpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMiwgYmwxKSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgyLCBiaDEpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDEsIGJsMikpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwxLCBiaDIpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMSwgYmwyKSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgxLCBiaDIpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDAsIGJsMykpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwwLCBiaDMpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMCwgYmwzKSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgwLCBiaDMpKSB8IDA7XHJcbiAgICB2YXIgdzMgPSAoKChjICsgbG8pIHwgMCkgKyAoKG1pZCAmIDB4MWZmZikgPDwgMTMpKSB8IDA7XHJcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzMgPj4+IDI2KSkgfCAwO1xyXG4gICAgdzMgJj0gMHgzZmZmZmZmO1xyXG4gICAgLyogayA9IDQgKi9cclxuICAgIGxvID0gTWF0aC5pbXVsKGFsNCwgYmwwKTtcclxuICAgIG1pZCA9IE1hdGguaW11bChhbDQsIGJoMCk7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNCwgYmwwKSkgfCAwO1xyXG4gICAgaGkgPSBNYXRoLmltdWwoYWg0LCBiaDApO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwzLCBibDEpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMywgYmgxKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDMsIGJsMSkpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMywgYmgxKSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwyLCBibDIpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMiwgYmgyKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDIsIGJsMikpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMiwgYmgyKSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwxLCBibDMpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMSwgYmgzKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDEsIGJsMykpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMSwgYmgzKSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwwLCBibDQpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMCwgYmg0KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDAsIGJsNCkpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMCwgYmg0KSkgfCAwO1xyXG4gICAgdmFyIHc0ID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xyXG4gICAgYyA9ICgoKGhpICsgKG1pZCA+Pj4gMTMpKSB8IDApICsgKHc0ID4+PiAyNikpIHwgMDtcclxuICAgIHc0ICY9IDB4M2ZmZmZmZjtcclxuICAgIC8qIGsgPSA1ICovXHJcbiAgICBsbyA9IE1hdGguaW11bChhbDUsIGJsMCk7XHJcbiAgICBtaWQgPSBNYXRoLmltdWwoYWw1LCBiaDApO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDUsIGJsMCkpIHwgMDtcclxuICAgIGhpID0gTWF0aC5pbXVsKGFoNSwgYmgwKTtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNCwgYmwxKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDQsIGJoMSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg0LCBibDEpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDQsIGJoMSkpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMywgYmwyKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDMsIGJoMikpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgzLCBibDIpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDMsIGJoMikpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMiwgYmwzKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDIsIGJoMykpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgyLCBibDMpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDIsIGJoMykpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMSwgYmw0KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDEsIGJoNCkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgxLCBibDQpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDEsIGJoNCkpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMCwgYmw1KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDAsIGJoNSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgwLCBibDUpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDAsIGJoNSkpIHwgMDtcclxuICAgIHZhciB3NSA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcclxuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3NSA+Pj4gMjYpKSB8IDA7XHJcbiAgICB3NSAmPSAweDNmZmZmZmY7XHJcbiAgICAvKiBrID0gNiAqL1xyXG4gICAgbG8gPSBNYXRoLmltdWwoYWw2LCBibDApO1xyXG4gICAgbWlkID0gTWF0aC5pbXVsKGFsNiwgYmgwKTtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg2LCBibDApKSB8IDA7XHJcbiAgICBoaSA9IE1hdGguaW11bChhaDYsIGJoMCk7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDUsIGJsMSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw1LCBiaDEpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNSwgYmwxKSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg1LCBiaDEpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDQsIGJsMikpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw0LCBiaDIpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNCwgYmwyKSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg0LCBiaDIpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDMsIGJsMykpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwzLCBiaDMpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMywgYmwzKSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgzLCBiaDMpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDIsIGJsNCkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwyLCBiaDQpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMiwgYmw0KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgyLCBiaDQpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDEsIGJsNSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwxLCBiaDUpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMSwgYmw1KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgxLCBiaDUpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDAsIGJsNikpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwwLCBiaDYpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMCwgYmw2KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgwLCBiaDYpKSB8IDA7XHJcbiAgICB2YXIgdzYgPSAoKChjICsgbG8pIHwgMCkgKyAoKG1pZCAmIDB4MWZmZikgPDwgMTMpKSB8IDA7XHJcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzYgPj4+IDI2KSkgfCAwO1xyXG4gICAgdzYgJj0gMHgzZmZmZmZmO1xyXG4gICAgLyogayA9IDcgKi9cclxuICAgIGxvID0gTWF0aC5pbXVsKGFsNywgYmwwKTtcclxuICAgIG1pZCA9IE1hdGguaW11bChhbDcsIGJoMCk7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNywgYmwwKSkgfCAwO1xyXG4gICAgaGkgPSBNYXRoLmltdWwoYWg3LCBiaDApO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw2LCBibDEpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNiwgYmgxKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDYsIGJsMSkpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNiwgYmgxKSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw1LCBibDIpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNSwgYmgyKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDUsIGJsMikpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNSwgYmgyKSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw0LCBibDMpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNCwgYmgzKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDQsIGJsMykpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNCwgYmgzKSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwzLCBibDQpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMywgYmg0KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDMsIGJsNCkpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMywgYmg0KSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwyLCBibDUpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMiwgYmg1KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDIsIGJsNSkpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMiwgYmg1KSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwxLCBibDYpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMSwgYmg2KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDEsIGJsNikpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMSwgYmg2KSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwwLCBibDcpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMCwgYmg3KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDAsIGJsNykpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMCwgYmg3KSkgfCAwO1xyXG4gICAgdmFyIHc3ID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xyXG4gICAgYyA9ICgoKGhpICsgKG1pZCA+Pj4gMTMpKSB8IDApICsgKHc3ID4+PiAyNikpIHwgMDtcclxuICAgIHc3ICY9IDB4M2ZmZmZmZjtcclxuICAgIC8qIGsgPSA4ICovXHJcbiAgICBsbyA9IE1hdGguaW11bChhbDgsIGJsMCk7XHJcbiAgICBtaWQgPSBNYXRoLmltdWwoYWw4LCBiaDApO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDgsIGJsMCkpIHwgMDtcclxuICAgIGhpID0gTWF0aC5pbXVsKGFoOCwgYmgwKTtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNywgYmwxKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDcsIGJoMSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg3LCBibDEpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDcsIGJoMSkpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNiwgYmwyKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDYsIGJoMikpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg2LCBibDIpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDYsIGJoMikpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNSwgYmwzKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDUsIGJoMykpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg1LCBibDMpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDUsIGJoMykpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNCwgYmw0KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDQsIGJoNCkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg0LCBibDQpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDQsIGJoNCkpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMywgYmw1KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDMsIGJoNSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgzLCBibDUpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDMsIGJoNSkpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMiwgYmw2KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDIsIGJoNikpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgyLCBibDYpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDIsIGJoNikpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMSwgYmw3KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDEsIGJoNykpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgxLCBibDcpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDEsIGJoNykpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMCwgYmw4KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDAsIGJoOCkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgwLCBibDgpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDAsIGJoOCkpIHwgMDtcclxuICAgIHZhciB3OCA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcclxuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3OCA+Pj4gMjYpKSB8IDA7XHJcbiAgICB3OCAmPSAweDNmZmZmZmY7XHJcbiAgICAvKiBrID0gOSAqL1xyXG4gICAgbG8gPSBNYXRoLmltdWwoYWw5LCBibDApO1xyXG4gICAgbWlkID0gTWF0aC5pbXVsKGFsOSwgYmgwKTtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg5LCBibDApKSB8IDA7XHJcbiAgICBoaSA9IE1hdGguaW11bChhaDksIGJoMCk7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDgsIGJsMSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw4LCBiaDEpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoOCwgYmwxKSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg4LCBiaDEpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDcsIGJsMikpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw3LCBiaDIpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNywgYmwyKSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg3LCBiaDIpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDYsIGJsMykpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw2LCBiaDMpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNiwgYmwzKSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg2LCBiaDMpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDUsIGJsNCkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw1LCBiaDQpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNSwgYmw0KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg1LCBiaDQpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDQsIGJsNSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw0LCBiaDUpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNCwgYmw1KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg0LCBiaDUpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDMsIGJsNikpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwzLCBiaDYpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMywgYmw2KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgzLCBiaDYpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDIsIGJsNykpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwyLCBiaDcpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMiwgYmw3KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgyLCBiaDcpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDEsIGJsOCkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwxLCBiaDgpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMSwgYmw4KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgxLCBiaDgpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDAsIGJsOSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwwLCBiaDkpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMCwgYmw5KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgwLCBiaDkpKSB8IDA7XHJcbiAgICB2YXIgdzkgPSAoKChjICsgbG8pIHwgMCkgKyAoKG1pZCAmIDB4MWZmZikgPDwgMTMpKSB8IDA7XHJcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzkgPj4+IDI2KSkgfCAwO1xyXG4gICAgdzkgJj0gMHgzZmZmZmZmO1xyXG4gICAgLyogayA9IDEwICovXHJcbiAgICBsbyA9IE1hdGguaW11bChhbDksIGJsMSk7XHJcbiAgICBtaWQgPSBNYXRoLmltdWwoYWw5LCBiaDEpO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDksIGJsMSkpIHwgMDtcclxuICAgIGhpID0gTWF0aC5pbXVsKGFoOSwgYmgxKTtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsOCwgYmwyKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDgsIGJoMikpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg4LCBibDIpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDgsIGJoMikpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNywgYmwzKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDcsIGJoMykpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg3LCBibDMpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDcsIGJoMykpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNiwgYmw0KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDYsIGJoNCkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg2LCBibDQpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDYsIGJoNCkpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNSwgYmw1KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDUsIGJoNSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg1LCBibDUpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDUsIGJoNSkpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNCwgYmw2KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDQsIGJoNikpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg0LCBibDYpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDQsIGJoNikpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMywgYmw3KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDMsIGJoNykpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgzLCBibDcpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDMsIGJoNykpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMiwgYmw4KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDIsIGJoOCkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgyLCBibDgpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDIsIGJoOCkpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMSwgYmw5KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDEsIGJoOSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgxLCBibDkpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDEsIGJoOSkpIHwgMDtcclxuICAgIHZhciB3MTAgPSAoKChjICsgbG8pIHwgMCkgKyAoKG1pZCAmIDB4MWZmZikgPDwgMTMpKSB8IDA7XHJcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzEwID4+PiAyNikpIHwgMDtcclxuICAgIHcxMCAmPSAweDNmZmZmZmY7XHJcbiAgICAvKiBrID0gMTEgKi9cclxuICAgIGxvID0gTWF0aC5pbXVsKGFsOSwgYmwyKTtcclxuICAgIG1pZCA9IE1hdGguaW11bChhbDksIGJoMik7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoOSwgYmwyKSkgfCAwO1xyXG4gICAgaGkgPSBNYXRoLmltdWwoYWg5LCBiaDIpO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw4LCBibDMpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsOCwgYmgzKSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDgsIGJsMykpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoOCwgYmgzKSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw3LCBibDQpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNywgYmg0KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDcsIGJsNCkpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNywgYmg0KSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw2LCBibDUpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNiwgYmg1KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDYsIGJsNSkpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNiwgYmg1KSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw1LCBibDYpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNSwgYmg2KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDUsIGJsNikpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNSwgYmg2KSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw0LCBibDcpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNCwgYmg3KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDQsIGJsNykpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNCwgYmg3KSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwzLCBibDgpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMywgYmg4KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDMsIGJsOCkpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMywgYmg4KSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwyLCBibDkpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMiwgYmg5KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDIsIGJsOSkpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMiwgYmg5KSkgfCAwO1xyXG4gICAgdmFyIHcxMSA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcclxuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3MTEgPj4+IDI2KSkgfCAwO1xyXG4gICAgdzExICY9IDB4M2ZmZmZmZjtcclxuICAgIC8qIGsgPSAxMiAqL1xyXG4gICAgbG8gPSBNYXRoLmltdWwoYWw5LCBibDMpO1xyXG4gICAgbWlkID0gTWF0aC5pbXVsKGFsOSwgYmgzKTtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg5LCBibDMpKSB8IDA7XHJcbiAgICBoaSA9IE1hdGguaW11bChhaDksIGJoMyk7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDgsIGJsNCkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw4LCBiaDQpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoOCwgYmw0KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg4LCBiaDQpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDcsIGJsNSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw3LCBiaDUpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNywgYmw1KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg3LCBiaDUpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDYsIGJsNikpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw2LCBiaDYpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNiwgYmw2KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg2LCBiaDYpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDUsIGJsNykpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw1LCBiaDcpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNSwgYmw3KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg1LCBiaDcpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDQsIGJsOCkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw0LCBiaDgpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNCwgYmw4KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg0LCBiaDgpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDMsIGJsOSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwzLCBiaDkpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMywgYmw5KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgzLCBiaDkpKSB8IDA7XHJcbiAgICB2YXIgdzEyID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xyXG4gICAgYyA9ICgoKGhpICsgKG1pZCA+Pj4gMTMpKSB8IDApICsgKHcxMiA+Pj4gMjYpKSB8IDA7XHJcbiAgICB3MTIgJj0gMHgzZmZmZmZmO1xyXG4gICAgLyogayA9IDEzICovXHJcbiAgICBsbyA9IE1hdGguaW11bChhbDksIGJsNCk7XHJcbiAgICBtaWQgPSBNYXRoLmltdWwoYWw5LCBiaDQpO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDksIGJsNCkpIHwgMDtcclxuICAgIGhpID0gTWF0aC5pbXVsKGFoOSwgYmg0KTtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsOCwgYmw1KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDgsIGJoNSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg4LCBibDUpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDgsIGJoNSkpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNywgYmw2KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDcsIGJoNikpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg3LCBibDYpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDcsIGJoNikpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNiwgYmw3KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDYsIGJoNykpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg2LCBibDcpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDYsIGJoNykpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNSwgYmw4KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDUsIGJoOCkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg1LCBibDgpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDUsIGJoOCkpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNCwgYmw5KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDQsIGJoOSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg0LCBibDkpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDQsIGJoOSkpIHwgMDtcclxuICAgIHZhciB3MTMgPSAoKChjICsgbG8pIHwgMCkgKyAoKG1pZCAmIDB4MWZmZikgPDwgMTMpKSB8IDA7XHJcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzEzID4+PiAyNikpIHwgMDtcclxuICAgIHcxMyAmPSAweDNmZmZmZmY7XHJcbiAgICAvKiBrID0gMTQgKi9cclxuICAgIGxvID0gTWF0aC5pbXVsKGFsOSwgYmw1KTtcclxuICAgIG1pZCA9IE1hdGguaW11bChhbDksIGJoNSk7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoOSwgYmw1KSkgfCAwO1xyXG4gICAgaGkgPSBNYXRoLmltdWwoYWg5LCBiaDUpO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw4LCBibDYpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsOCwgYmg2KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDgsIGJsNikpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoOCwgYmg2KSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw3LCBibDcpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNywgYmg3KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDcsIGJsNykpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNywgYmg3KSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw2LCBibDgpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNiwgYmg4KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDYsIGJsOCkpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNiwgYmg4KSkgfCAwO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw1LCBibDkpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNSwgYmg5KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDUsIGJsOSkpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNSwgYmg5KSkgfCAwO1xyXG4gICAgdmFyIHcxNCA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcclxuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3MTQgPj4+IDI2KSkgfCAwO1xyXG4gICAgdzE0ICY9IDB4M2ZmZmZmZjtcclxuICAgIC8qIGsgPSAxNSAqL1xyXG4gICAgbG8gPSBNYXRoLmltdWwoYWw5LCBibDYpO1xyXG4gICAgbWlkID0gTWF0aC5pbXVsKGFsOSwgYmg2KTtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg5LCBibDYpKSB8IDA7XHJcbiAgICBoaSA9IE1hdGguaW11bChhaDksIGJoNik7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDgsIGJsNykpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw4LCBiaDcpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoOCwgYmw3KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg4LCBiaDcpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDcsIGJsOCkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw3LCBiaDgpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNywgYmw4KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg3LCBiaDgpKSB8IDA7XHJcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDYsIGJsOSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw2LCBiaDkpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNiwgYmw5KSkgfCAwO1xyXG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg2LCBiaDkpKSB8IDA7XHJcbiAgICB2YXIgdzE1ID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xyXG4gICAgYyA9ICgoKGhpICsgKG1pZCA+Pj4gMTMpKSB8IDApICsgKHcxNSA+Pj4gMjYpKSB8IDA7XHJcbiAgICB3MTUgJj0gMHgzZmZmZmZmO1xyXG4gICAgLyogayA9IDE2ICovXHJcbiAgICBsbyA9IE1hdGguaW11bChhbDksIGJsNyk7XHJcbiAgICBtaWQgPSBNYXRoLmltdWwoYWw5LCBiaDcpO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDksIGJsNykpIHwgMDtcclxuICAgIGhpID0gTWF0aC5pbXVsKGFoOSwgYmg3KTtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsOCwgYmw4KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDgsIGJoOCkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg4LCBibDgpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDgsIGJoOCkpIHwgMDtcclxuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNywgYmw5KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDcsIGJoOSkpIHwgMDtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg3LCBibDkpKSB8IDA7XHJcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDcsIGJoOSkpIHwgMDtcclxuICAgIHZhciB3MTYgPSAoKChjICsgbG8pIHwgMCkgKyAoKG1pZCAmIDB4MWZmZikgPDwgMTMpKSB8IDA7XHJcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzE2ID4+PiAyNikpIHwgMDtcclxuICAgIHcxNiAmPSAweDNmZmZmZmY7XHJcbiAgICAvKiBrID0gMTcgKi9cclxuICAgIGxvID0gTWF0aC5pbXVsKGFsOSwgYmw4KTtcclxuICAgIG1pZCA9IE1hdGguaW11bChhbDksIGJoOCk7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoOSwgYmw4KSkgfCAwO1xyXG4gICAgaGkgPSBNYXRoLmltdWwoYWg5LCBiaDgpO1xyXG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw4LCBibDkpKSB8IDA7XHJcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsOCwgYmg5KSkgfCAwO1xyXG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDgsIGJsOSkpIHwgMDtcclxuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoOCwgYmg5KSkgfCAwO1xyXG4gICAgdmFyIHcxNyA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcclxuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3MTcgPj4+IDI2KSkgfCAwO1xyXG4gICAgdzE3ICY9IDB4M2ZmZmZmZjtcclxuICAgIC8qIGsgPSAxOCAqL1xyXG4gICAgbG8gPSBNYXRoLmltdWwoYWw5LCBibDkpO1xyXG4gICAgbWlkID0gTWF0aC5pbXVsKGFsOSwgYmg5KTtcclxuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg5LCBibDkpKSB8IDA7XHJcbiAgICBoaSA9IE1hdGguaW11bChhaDksIGJoOSk7XHJcbiAgICB2YXIgdzE4ID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xyXG4gICAgYyA9ICgoKGhpICsgKG1pZCA+Pj4gMTMpKSB8IDApICsgKHcxOCA+Pj4gMjYpKSB8IDA7XHJcbiAgICB3MTggJj0gMHgzZmZmZmZmO1xyXG4gICAgb1swXSA9IHcwO1xyXG4gICAgb1sxXSA9IHcxO1xyXG4gICAgb1syXSA9IHcyO1xyXG4gICAgb1szXSA9IHczO1xyXG4gICAgb1s0XSA9IHc0O1xyXG4gICAgb1s1XSA9IHc1O1xyXG4gICAgb1s2XSA9IHc2O1xyXG4gICAgb1s3XSA9IHc3O1xyXG4gICAgb1s4XSA9IHc4O1xyXG4gICAgb1s5XSA9IHc5O1xyXG4gICAgb1sxMF0gPSB3MTA7XHJcbiAgICBvWzExXSA9IHcxMTtcclxuICAgIG9bMTJdID0gdzEyO1xyXG4gICAgb1sxM10gPSB3MTM7XHJcbiAgICBvWzE0XSA9IHcxNDtcclxuICAgIG9bMTVdID0gdzE1O1xyXG4gICAgb1sxNl0gPSB3MTY7XHJcbiAgICBvWzE3XSA9IHcxNztcclxuICAgIG9bMThdID0gdzE4O1xyXG4gICAgaWYgKGMgIT09IDApIHtcclxuICAgICAgb1sxOV0gPSBjO1xyXG4gICAgICBvdXQubGVuZ3RoKys7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0O1xyXG4gIH07XHJcblxyXG4gIC8vIFBvbHlmaWxsIGNvbWJcclxuICBpZiAoIU1hdGguaW11bCkge1xyXG4gICAgY29tYjEwTXVsVG8gPSBzbWFsbE11bFRvO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYmlnTXVsVG8gKHNlbGYsIG51bSwgb3V0KSB7XHJcbiAgICBvdXQubmVnYXRpdmUgPSBudW0ubmVnYXRpdmUgXiBzZWxmLm5lZ2F0aXZlO1xyXG4gICAgb3V0Lmxlbmd0aCA9IHNlbGYubGVuZ3RoICsgbnVtLmxlbmd0aDtcclxuXHJcbiAgICB2YXIgY2FycnkgPSAwO1xyXG4gICAgdmFyIGhuY2FycnkgPSAwO1xyXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBvdXQubGVuZ3RoIC0gMTsgaysrKSB7XHJcbiAgICAgIC8vIFN1bSBhbGwgd29yZHMgd2l0aCB0aGUgc2FtZSBgaSArIGogPSBrYCBhbmQgYWNjdW11bGF0ZSBgbmNhcnJ5YCxcclxuICAgICAgLy8gbm90ZSB0aGF0IG5jYXJyeSBjb3VsZCBiZSA+PSAweDNmZmZmZmZcclxuICAgICAgdmFyIG5jYXJyeSA9IGhuY2Fycnk7XHJcbiAgICAgIGhuY2FycnkgPSAwO1xyXG4gICAgICB2YXIgcndvcmQgPSBjYXJyeSAmIDB4M2ZmZmZmZjtcclxuICAgICAgdmFyIG1heEogPSBNYXRoLm1pbihrLCBudW0ubGVuZ3RoIC0gMSk7XHJcbiAgICAgIGZvciAodmFyIGogPSBNYXRoLm1heCgwLCBrIC0gc2VsZi5sZW5ndGggKyAxKTsgaiA8PSBtYXhKOyBqKyspIHtcclxuICAgICAgICB2YXIgaSA9IGsgLSBqO1xyXG4gICAgICAgIHZhciBhID0gc2VsZi53b3Jkc1tpXSB8IDA7XHJcbiAgICAgICAgdmFyIGIgPSBudW0ud29yZHNbal0gfCAwO1xyXG4gICAgICAgIHZhciByID0gYSAqIGI7XHJcblxyXG4gICAgICAgIHZhciBsbyA9IHIgJiAweDNmZmZmZmY7XHJcbiAgICAgICAgbmNhcnJ5ID0gKG5jYXJyeSArICgociAvIDB4NDAwMDAwMCkgfCAwKSkgfCAwO1xyXG4gICAgICAgIGxvID0gKGxvICsgcndvcmQpIHwgMDtcclxuICAgICAgICByd29yZCA9IGxvICYgMHgzZmZmZmZmO1xyXG4gICAgICAgIG5jYXJyeSA9IChuY2FycnkgKyAobG8gPj4+IDI2KSkgfCAwO1xyXG5cclxuICAgICAgICBobmNhcnJ5ICs9IG5jYXJyeSA+Pj4gMjY7XHJcbiAgICAgICAgbmNhcnJ5ICY9IDB4M2ZmZmZmZjtcclxuICAgICAgfVxyXG4gICAgICBvdXQud29yZHNba10gPSByd29yZDtcclxuICAgICAgY2FycnkgPSBuY2Fycnk7XHJcbiAgICAgIG5jYXJyeSA9IGhuY2Fycnk7XHJcbiAgICB9XHJcbiAgICBpZiAoY2FycnkgIT09IDApIHtcclxuICAgICAgb3V0LndvcmRzW2tdID0gY2Fycnk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQubGVuZ3RoLS07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG91dC5zdHJpcCgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24ganVtYm9NdWxUbyAoc2VsZiwgbnVtLCBvdXQpIHtcclxuICAgIHZhciBmZnRtID0gbmV3IEZGVE0oKTtcclxuICAgIHJldHVybiBmZnRtLm11bHAoc2VsZiwgbnVtLCBvdXQpO1xyXG4gIH1cclxuXHJcbiAgQk4ucHJvdG90eXBlLm11bFRvID0gZnVuY3Rpb24gbXVsVG8gKG51bSwgb3V0KSB7XHJcbiAgICB2YXIgcmVzO1xyXG4gICAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoICsgbnVtLmxlbmd0aDtcclxuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMTAgJiYgbnVtLmxlbmd0aCA9PT0gMTApIHtcclxuICAgICAgcmVzID0gY29tYjEwTXVsVG8odGhpcywgbnVtLCBvdXQpO1xyXG4gICAgfSBlbHNlIGlmIChsZW4gPCA2Mykge1xyXG4gICAgICByZXMgPSBzbWFsbE11bFRvKHRoaXMsIG51bSwgb3V0KTtcclxuICAgIH0gZWxzZSBpZiAobGVuIDwgMTAyNCkge1xyXG4gICAgICByZXMgPSBiaWdNdWxUbyh0aGlzLCBudW0sIG91dCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXMgPSBqdW1ib011bFRvKHRoaXMsIG51bSwgb3V0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIH07XHJcblxyXG4gIC8vIENvb2xleS1UdWtleSBhbGdvcml0aG0gZm9yIEZGVFxyXG4gIC8vIHNsaWdodGx5IHJldmlzaXRlZCB0byByZWx5IG9uIGxvb3BpbmcgaW5zdGVhZCBvZiByZWN1cnNpb25cclxuXHJcbiAgZnVuY3Rpb24gRkZUTSAoeCwgeSkge1xyXG4gICAgdGhpcy54ID0geDtcclxuICAgIHRoaXMueSA9IHk7XHJcbiAgfVxyXG5cclxuICBGRlRNLnByb3RvdHlwZS5tYWtlUkJUID0gZnVuY3Rpb24gbWFrZVJCVCAoTikge1xyXG4gICAgdmFyIHQgPSBuZXcgQXJyYXkoTik7XHJcbiAgICB2YXIgbCA9IEJOLnByb3RvdHlwZS5fY291bnRCaXRzKE4pIC0gMTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XHJcbiAgICAgIHRbaV0gPSB0aGlzLnJldkJpbihpLCBsLCBOKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdDtcclxuICB9O1xyXG5cclxuICAvLyBSZXR1cm5zIGJpbmFyeS1yZXZlcnNlZCByZXByZXNlbnRhdGlvbiBvZiBgeGBcclxuICBGRlRNLnByb3RvdHlwZS5yZXZCaW4gPSBmdW5jdGlvbiByZXZCaW4gKHgsIGwsIE4pIHtcclxuICAgIGlmICh4ID09PSAwIHx8IHggPT09IE4gLSAxKSByZXR1cm4geDtcclxuXHJcbiAgICB2YXIgcmIgPSAwO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuICAgICAgcmIgfD0gKHggJiAxKSA8PCAobCAtIGkgLSAxKTtcclxuICAgICAgeCA+Pj0gMTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmI7XHJcbiAgfTtcclxuXHJcbiAgLy8gUGVyZm9ybXMgXCJ0d2VlZGxpbmdcIiBwaGFzZSwgdGhlcmVmb3JlICdlbXVsYXRpbmcnXHJcbiAgLy8gYmVoYXZpb3VyIG9mIHRoZSByZWN1cnNpdmUgYWxnb3JpdGhtXHJcbiAgRkZUTS5wcm90b3R5cGUucGVybXV0ZSA9IGZ1bmN0aW9uIHBlcm11dGUgKHJidCwgcndzLCBpd3MsIHJ0d3MsIGl0d3MsIE4pIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XHJcbiAgICAgIHJ0d3NbaV0gPSByd3NbcmJ0W2ldXTtcclxuICAgICAgaXR3c1tpXSA9IGl3c1tyYnRbaV1dO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIEZGVE0ucHJvdG90eXBlLnRyYW5zZm9ybSA9IGZ1bmN0aW9uIHRyYW5zZm9ybSAocndzLCBpd3MsIHJ0d3MsIGl0d3MsIE4sIHJidCkge1xyXG4gICAgdGhpcy5wZXJtdXRlKHJidCwgcndzLCBpd3MsIHJ0d3MsIGl0d3MsIE4pO1xyXG5cclxuICAgIGZvciAodmFyIHMgPSAxOyBzIDwgTjsgcyA8PD0gMSkge1xyXG4gICAgICB2YXIgbCA9IHMgPDwgMTtcclxuXHJcbiAgICAgIHZhciBydHdkZiA9IE1hdGguY29zKDIgKiBNYXRoLlBJIC8gbCk7XHJcbiAgICAgIHZhciBpdHdkZiA9IE1hdGguc2luKDIgKiBNYXRoLlBJIC8gbCk7XHJcblxyXG4gICAgICBmb3IgKHZhciBwID0gMDsgcCA8IE47IHAgKz0gbCkge1xyXG4gICAgICAgIHZhciBydHdkZl8gPSBydHdkZjtcclxuICAgICAgICB2YXIgaXR3ZGZfID0gaXR3ZGY7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgczsgaisrKSB7XHJcbiAgICAgICAgICB2YXIgcmUgPSBydHdzW3AgKyBqXTtcclxuICAgICAgICAgIHZhciBpZSA9IGl0d3NbcCArIGpdO1xyXG5cclxuICAgICAgICAgIHZhciBybyA9IHJ0d3NbcCArIGogKyBzXTtcclxuICAgICAgICAgIHZhciBpbyA9IGl0d3NbcCArIGogKyBzXTtcclxuXHJcbiAgICAgICAgICB2YXIgcnggPSBydHdkZl8gKiBybyAtIGl0d2RmXyAqIGlvO1xyXG5cclxuICAgICAgICAgIGlvID0gcnR3ZGZfICogaW8gKyBpdHdkZl8gKiBybztcclxuICAgICAgICAgIHJvID0gcng7XHJcblxyXG4gICAgICAgICAgcnR3c1twICsgal0gPSByZSArIHJvO1xyXG4gICAgICAgICAgaXR3c1twICsgal0gPSBpZSArIGlvO1xyXG5cclxuICAgICAgICAgIHJ0d3NbcCArIGogKyBzXSA9IHJlIC0gcm87XHJcbiAgICAgICAgICBpdHdzW3AgKyBqICsgc10gPSBpZSAtIGlvO1xyXG5cclxuICAgICAgICAgIC8qIGpzaGludCBtYXhkZXB0aCA6IGZhbHNlICovXHJcbiAgICAgICAgICBpZiAoaiAhPT0gbCkge1xyXG4gICAgICAgICAgICByeCA9IHJ0d2RmICogcnR3ZGZfIC0gaXR3ZGYgKiBpdHdkZl87XHJcblxyXG4gICAgICAgICAgICBpdHdkZl8gPSBydHdkZiAqIGl0d2RmXyArIGl0d2RmICogcnR3ZGZfO1xyXG4gICAgICAgICAgICBydHdkZl8gPSByeDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBGRlRNLnByb3RvdHlwZS5ndWVzc0xlbjEzYiA9IGZ1bmN0aW9uIGd1ZXNzTGVuMTNiIChuLCBtKSB7XHJcbiAgICB2YXIgTiA9IE1hdGgubWF4KG0sIG4pIHwgMTtcclxuICAgIHZhciBvZGQgPSBOICYgMTtcclxuICAgIHZhciBpID0gMDtcclxuICAgIGZvciAoTiA9IE4gLyAyIHwgMDsgTjsgTiA9IE4gPj4+IDEpIHtcclxuICAgICAgaSsrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAxIDw8IGkgKyAxICsgb2RkO1xyXG4gIH07XHJcblxyXG4gIEZGVE0ucHJvdG90eXBlLmNvbmp1Z2F0ZSA9IGZ1bmN0aW9uIGNvbmp1Z2F0ZSAocndzLCBpd3MsIE4pIHtcclxuICAgIGlmIChOIDw9IDEpIHJldHVybjtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE4gLyAyOyBpKyspIHtcclxuICAgICAgdmFyIHQgPSByd3NbaV07XHJcblxyXG4gICAgICByd3NbaV0gPSByd3NbTiAtIGkgLSAxXTtcclxuICAgICAgcndzW04gLSBpIC0gMV0gPSB0O1xyXG5cclxuICAgICAgdCA9IGl3c1tpXTtcclxuXHJcbiAgICAgIGl3c1tpXSA9IC1pd3NbTiAtIGkgLSAxXTtcclxuICAgICAgaXdzW04gLSBpIC0gMV0gPSAtdDtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBGRlRNLnByb3RvdHlwZS5ub3JtYWxpemUxM2IgPSBmdW5jdGlvbiBub3JtYWxpemUxM2IgKHdzLCBOKSB7XHJcbiAgICB2YXIgY2FycnkgPSAwO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOIC8gMjsgaSsrKSB7XHJcbiAgICAgIHZhciB3ID0gTWF0aC5yb3VuZCh3c1syICogaSArIDFdIC8gTikgKiAweDIwMDAgK1xyXG4gICAgICAgIE1hdGgucm91bmQod3NbMiAqIGldIC8gTikgK1xyXG4gICAgICAgIGNhcnJ5O1xyXG5cclxuICAgICAgd3NbaV0gPSB3ICYgMHgzZmZmZmZmO1xyXG5cclxuICAgICAgaWYgKHcgPCAweDQwMDAwMDApIHtcclxuICAgICAgICBjYXJyeSA9IDA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FycnkgPSB3IC8gMHg0MDAwMDAwIHwgMDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB3cztcclxuICB9O1xyXG5cclxuICBGRlRNLnByb3RvdHlwZS5jb252ZXJ0MTNiID0gZnVuY3Rpb24gY29udmVydDEzYiAod3MsIGxlbiwgcndzLCBOKSB7XHJcbiAgICB2YXIgY2FycnkgPSAwO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICBjYXJyeSA9IGNhcnJ5ICsgKHdzW2ldIHwgMCk7XHJcblxyXG4gICAgICByd3NbMiAqIGldID0gY2FycnkgJiAweDFmZmY7IGNhcnJ5ID0gY2FycnkgPj4+IDEzO1xyXG4gICAgICByd3NbMiAqIGkgKyAxXSA9IGNhcnJ5ICYgMHgxZmZmOyBjYXJyeSA9IGNhcnJ5ID4+PiAxMztcclxuICAgIH1cclxuXHJcbiAgICAvLyBQYWQgd2l0aCB6ZXJvZXNcclxuICAgIGZvciAoaSA9IDIgKiBsZW47IGkgPCBOOyArK2kpIHtcclxuICAgICAgcndzW2ldID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBhc3NlcnQoY2FycnkgPT09IDApO1xyXG4gICAgYXNzZXJ0KChjYXJyeSAmIH4weDFmZmYpID09PSAwKTtcclxuICB9O1xyXG5cclxuICBGRlRNLnByb3RvdHlwZS5zdHViID0gZnVuY3Rpb24gc3R1YiAoTikge1xyXG4gICAgdmFyIHBoID0gbmV3IEFycmF5KE4pO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcclxuICAgICAgcGhbaV0gPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwaDtcclxuICB9O1xyXG5cclxuICBGRlRNLnByb3RvdHlwZS5tdWxwID0gZnVuY3Rpb24gbXVscCAoeCwgeSwgb3V0KSB7XHJcbiAgICB2YXIgTiA9IDIgKiB0aGlzLmd1ZXNzTGVuMTNiKHgubGVuZ3RoLCB5Lmxlbmd0aCk7XHJcblxyXG4gICAgdmFyIHJidCA9IHRoaXMubWFrZVJCVChOKTtcclxuXHJcbiAgICB2YXIgXyA9IHRoaXMuc3R1YihOKTtcclxuXHJcbiAgICB2YXIgcndzID0gbmV3IEFycmF5KE4pO1xyXG4gICAgdmFyIHJ3c3QgPSBuZXcgQXJyYXkoTik7XHJcbiAgICB2YXIgaXdzdCA9IG5ldyBBcnJheShOKTtcclxuXHJcbiAgICB2YXIgbnJ3cyA9IG5ldyBBcnJheShOKTtcclxuICAgIHZhciBucndzdCA9IG5ldyBBcnJheShOKTtcclxuICAgIHZhciBuaXdzdCA9IG5ldyBBcnJheShOKTtcclxuXHJcbiAgICB2YXIgcm13cyA9IG91dC53b3JkcztcclxuICAgIHJtd3MubGVuZ3RoID0gTjtcclxuXHJcbiAgICB0aGlzLmNvbnZlcnQxM2IoeC53b3JkcywgeC5sZW5ndGgsIHJ3cywgTik7XHJcbiAgICB0aGlzLmNvbnZlcnQxM2IoeS53b3JkcywgeS5sZW5ndGgsIG5yd3MsIE4pO1xyXG5cclxuICAgIHRoaXMudHJhbnNmb3JtKHJ3cywgXywgcndzdCwgaXdzdCwgTiwgcmJ0KTtcclxuICAgIHRoaXMudHJhbnNmb3JtKG5yd3MsIF8sIG5yd3N0LCBuaXdzdCwgTiwgcmJ0KTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKykge1xyXG4gICAgICB2YXIgcnggPSByd3N0W2ldICogbnJ3c3RbaV0gLSBpd3N0W2ldICogbml3c3RbaV07XHJcbiAgICAgIGl3c3RbaV0gPSByd3N0W2ldICogbml3c3RbaV0gKyBpd3N0W2ldICogbnJ3c3RbaV07XHJcbiAgICAgIHJ3c3RbaV0gPSByeDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbmp1Z2F0ZShyd3N0LCBpd3N0LCBOKTtcclxuICAgIHRoaXMudHJhbnNmb3JtKHJ3c3QsIGl3c3QsIHJtd3MsIF8sIE4sIHJidCk7XHJcbiAgICB0aGlzLmNvbmp1Z2F0ZShybXdzLCBfLCBOKTtcclxuICAgIHRoaXMubm9ybWFsaXplMTNiKHJtd3MsIE4pO1xyXG5cclxuICAgIG91dC5uZWdhdGl2ZSA9IHgubmVnYXRpdmUgXiB5Lm5lZ2F0aXZlO1xyXG4gICAgb3V0Lmxlbmd0aCA9IHgubGVuZ3RoICsgeS5sZW5ndGg7XHJcbiAgICByZXR1cm4gb3V0LnN0cmlwKCk7XHJcbiAgfTtcclxuXHJcbiAgLy8gTXVsdGlwbHkgYHRoaXNgIGJ5IGBudW1gXHJcbiAgQk4ucHJvdG90eXBlLm11bCA9IGZ1bmN0aW9uIG11bCAobnVtKSB7XHJcbiAgICB2YXIgb3V0ID0gbmV3IEJOKG51bGwpO1xyXG4gICAgb3V0LndvcmRzID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoICsgbnVtLmxlbmd0aCk7XHJcbiAgICByZXR1cm4gdGhpcy5tdWxUbyhudW0sIG91dCk7XHJcbiAgfTtcclxuXHJcbiAgLy8gTXVsdGlwbHkgZW1wbG95aW5nIEZGVFxyXG4gIEJOLnByb3RvdHlwZS5tdWxmID0gZnVuY3Rpb24gbXVsZiAobnVtKSB7XHJcbiAgICB2YXIgb3V0ID0gbmV3IEJOKG51bGwpO1xyXG4gICAgb3V0LndvcmRzID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoICsgbnVtLmxlbmd0aCk7XHJcbiAgICByZXR1cm4ganVtYm9NdWxUbyh0aGlzLCBudW0sIG91dCk7XHJcbiAgfTtcclxuXHJcbiAgLy8gSW4tcGxhY2UgTXVsdGlwbGljYXRpb25cclxuICBCTi5wcm90b3R5cGUuaW11bCA9IGZ1bmN0aW9uIGltdWwgKG51bSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5tdWxUbyhudW0sIHRoaXMpO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5pbXVsbiA9IGZ1bmN0aW9uIGltdWxuIChudW0pIHtcclxuICAgIGFzc2VydCh0eXBlb2YgbnVtID09PSAnbnVtYmVyJyk7XHJcbiAgICBhc3NlcnQobnVtIDwgMHg0MDAwMDAwKTtcclxuXHJcbiAgICAvLyBDYXJyeVxyXG4gICAgdmFyIGNhcnJ5ID0gMDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgdyA9ICh0aGlzLndvcmRzW2ldIHwgMCkgKiBudW07XHJcbiAgICAgIHZhciBsbyA9ICh3ICYgMHgzZmZmZmZmKSArIChjYXJyeSAmIDB4M2ZmZmZmZik7XHJcbiAgICAgIGNhcnJ5ID4+PSAyNjtcclxuICAgICAgY2FycnkgKz0gKHcgLyAweDQwMDAwMDApIHwgMDtcclxuICAgICAgLy8gTk9URTogbG8gaXMgMjdiaXQgbWF4aW11bVxyXG4gICAgICBjYXJyeSArPSBsbyA+Pj4gMjY7XHJcbiAgICAgIHRoaXMud29yZHNbaV0gPSBsbyAmIDB4M2ZmZmZmZjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2FycnkgIT09IDApIHtcclxuICAgICAgdGhpcy53b3Jkc1tpXSA9IGNhcnJ5O1xyXG4gICAgICB0aGlzLmxlbmd0aCsrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5tdWxuID0gZnVuY3Rpb24gbXVsbiAobnVtKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmltdWxuKG51bSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gYHRoaXNgICogYHRoaXNgXHJcbiAgQk4ucHJvdG90eXBlLnNxciA9IGZ1bmN0aW9uIHNxciAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5tdWwodGhpcyk7XHJcbiAgfTtcclxuXHJcbiAgLy8gYHRoaXNgICogYHRoaXNgIGluLXBsYWNlXHJcbiAgQk4ucHJvdG90eXBlLmlzcXIgPSBmdW5jdGlvbiBpc3FyICgpIHtcclxuICAgIHJldHVybiB0aGlzLmltdWwodGhpcy5jbG9uZSgpKTtcclxuICB9O1xyXG5cclxuICAvLyBNYXRoLnBvdyhgdGhpc2AsIGBudW1gKVxyXG4gIEJOLnByb3RvdHlwZS5wb3cgPSBmdW5jdGlvbiBwb3cgKG51bSkge1xyXG4gICAgdmFyIHcgPSB0b0JpdEFycmF5KG51bSk7XHJcbiAgICBpZiAody5sZW5ndGggPT09IDApIHJldHVybiBuZXcgQk4oMSk7XHJcblxyXG4gICAgLy8gU2tpcCBsZWFkaW5nIHplcm9lc1xyXG4gICAgdmFyIHJlcyA9IHRoaXM7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHcubGVuZ3RoOyBpKyssIHJlcyA9IHJlcy5zcXIoKSkge1xyXG4gICAgICBpZiAod1tpXSAhPT0gMCkgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCsraSA8IHcubGVuZ3RoKSB7XHJcbiAgICAgIGZvciAodmFyIHEgPSByZXMuc3FyKCk7IGkgPCB3Lmxlbmd0aDsgaSsrLCBxID0gcS5zcXIoKSkge1xyXG4gICAgICAgIGlmICh3W2ldID09PSAwKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgcmVzID0gcmVzLm11bChxKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXM7XHJcbiAgfTtcclxuXHJcbiAgLy8gU2hpZnQtbGVmdCBpbi1wbGFjZVxyXG4gIEJOLnByb3RvdHlwZS5pdXNobG4gPSBmdW5jdGlvbiBpdXNobG4gKGJpdHMpIHtcclxuICAgIGFzc2VydCh0eXBlb2YgYml0cyA9PT0gJ251bWJlcicgJiYgYml0cyA+PSAwKTtcclxuICAgIHZhciByID0gYml0cyAlIDI2O1xyXG4gICAgdmFyIHMgPSAoYml0cyAtIHIpIC8gMjY7XHJcbiAgICB2YXIgY2FycnlNYXNrID0gKDB4M2ZmZmZmZiA+Pj4gKDI2IC0gcikpIDw8ICgyNiAtIHIpO1xyXG4gICAgdmFyIGk7XHJcblxyXG4gICAgaWYgKHIgIT09IDApIHtcclxuICAgICAgdmFyIGNhcnJ5ID0gMDtcclxuXHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5ld0NhcnJ5ID0gdGhpcy53b3Jkc1tpXSAmIGNhcnJ5TWFzaztcclxuICAgICAgICB2YXIgYyA9ICgodGhpcy53b3Jkc1tpXSB8IDApIC0gbmV3Q2FycnkpIDw8IHI7XHJcbiAgICAgICAgdGhpcy53b3Jkc1tpXSA9IGMgfCBjYXJyeTtcclxuICAgICAgICBjYXJyeSA9IG5ld0NhcnJ5ID4+PiAoMjYgLSByKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGNhcnJ5KSB7XHJcbiAgICAgICAgdGhpcy53b3Jkc1tpXSA9IGNhcnJ5O1xyXG4gICAgICAgIHRoaXMubGVuZ3RoKys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAocyAhPT0gMCkge1xyXG4gICAgICBmb3IgKGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgdGhpcy53b3Jkc1tpICsgc10gPSB0aGlzLndvcmRzW2ldO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgczsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy53b3Jkc1tpXSA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMubGVuZ3RoICs9IHM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuaXNobG4gPSBmdW5jdGlvbiBpc2hsbiAoYml0cykge1xyXG4gICAgLy8gVE9ETyhpbmR1dG55KTogaW1wbGVtZW50IG1lXHJcbiAgICBhc3NlcnQodGhpcy5uZWdhdGl2ZSA9PT0gMCk7XHJcbiAgICByZXR1cm4gdGhpcy5pdXNobG4oYml0cyk7XHJcbiAgfTtcclxuXHJcbiAgLy8gU2hpZnQtcmlnaHQgaW4tcGxhY2VcclxuICAvLyBOT1RFOiBgaGludGAgaXMgYSBsb3dlc3QgYml0IGJlZm9yZSB0cmFpbGluZyB6ZXJvZXNcclxuICAvLyBOT1RFOiBpZiBgZXh0ZW5kZWRgIGlzIHByZXNlbnQgLSBpdCB3aWxsIGJlIGZpbGxlZCB3aXRoIGRlc3Ryb3llZCBiaXRzXHJcbiAgQk4ucHJvdG90eXBlLml1c2hybiA9IGZ1bmN0aW9uIGl1c2hybiAoYml0cywgaGludCwgZXh0ZW5kZWQpIHtcclxuICAgIGFzc2VydCh0eXBlb2YgYml0cyA9PT0gJ251bWJlcicgJiYgYml0cyA+PSAwKTtcclxuICAgIHZhciBoO1xyXG4gICAgaWYgKGhpbnQpIHtcclxuICAgICAgaCA9IChoaW50IC0gKGhpbnQgJSAyNikpIC8gMjY7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgciA9IGJpdHMgJSAyNjtcclxuICAgIHZhciBzID0gTWF0aC5taW4oKGJpdHMgLSByKSAvIDI2LCB0aGlzLmxlbmd0aCk7XHJcbiAgICB2YXIgbWFzayA9IDB4M2ZmZmZmZiBeICgoMHgzZmZmZmZmID4+PiByKSA8PCByKTtcclxuICAgIHZhciBtYXNrZWRXb3JkcyA9IGV4dGVuZGVkO1xyXG5cclxuICAgIGggLT0gcztcclxuICAgIGggPSBNYXRoLm1heCgwLCBoKTtcclxuXHJcbiAgICAvLyBFeHRlbmRlZCBtb2RlLCBjb3B5IG1hc2tlZCBwYXJ0XHJcbiAgICBpZiAobWFza2VkV29yZHMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspIHtcclxuICAgICAgICBtYXNrZWRXb3Jkcy53b3Jkc1tpXSA9IHRoaXMud29yZHNbaV07XHJcbiAgICAgIH1cclxuICAgICAgbWFza2VkV29yZHMubGVuZ3RoID0gcztcclxuICAgIH1cclxuXHJcbiAgICBpZiAocyA9PT0gMCkge1xyXG4gICAgICAvLyBOby1vcCwgd2Ugc2hvdWxkIG5vdCBtb3ZlIGFueXRoaW5nIGF0IGFsbFxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmxlbmd0aCA+IHMpIHtcclxuICAgICAgdGhpcy5sZW5ndGggLT0gcztcclxuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLndvcmRzW2ldID0gdGhpcy53b3Jkc1tpICsgc107XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMud29yZHNbMF0gPSAwO1xyXG4gICAgICB0aGlzLmxlbmd0aCA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNhcnJ5ID0gMDtcclxuICAgIGZvciAoaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwICYmIChjYXJyeSAhPT0gMCB8fCBpID49IGgpOyBpLS0pIHtcclxuICAgICAgdmFyIHdvcmQgPSB0aGlzLndvcmRzW2ldIHwgMDtcclxuICAgICAgdGhpcy53b3Jkc1tpXSA9IChjYXJyeSA8PCAoMjYgLSByKSkgfCAod29yZCA+Pj4gcik7XHJcbiAgICAgIGNhcnJ5ID0gd29yZCAmIG1hc2s7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHVzaCBjYXJyaWVkIGJpdHMgYXMgYSBtYXNrXHJcbiAgICBpZiAobWFza2VkV29yZHMgJiYgY2FycnkgIT09IDApIHtcclxuICAgICAgbWFza2VkV29yZHMud29yZHNbbWFza2VkV29yZHMubGVuZ3RoKytdID0gY2Fycnk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRoaXMud29yZHNbMF0gPSAwO1xyXG4gICAgICB0aGlzLmxlbmd0aCA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuaXNocm4gPSBmdW5jdGlvbiBpc2hybiAoYml0cywgaGludCwgZXh0ZW5kZWQpIHtcclxuICAgIC8vIFRPRE8oaW5kdXRueSk6IGltcGxlbWVudCBtZVxyXG4gICAgYXNzZXJ0KHRoaXMubmVnYXRpdmUgPT09IDApO1xyXG4gICAgcmV0dXJuIHRoaXMuaXVzaHJuKGJpdHMsIGhpbnQsIGV4dGVuZGVkKTtcclxuICB9O1xyXG5cclxuICAvLyBTaGlmdC1sZWZ0XHJcbiAgQk4ucHJvdG90eXBlLnNobG4gPSBmdW5jdGlvbiBzaGxuIChiaXRzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmlzaGxuKGJpdHMpO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS51c2hsbiA9IGZ1bmN0aW9uIHVzaGxuIChiaXRzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLml1c2hsbihiaXRzKTtcclxuICB9O1xyXG5cclxuICAvLyBTaGlmdC1yaWdodFxyXG4gIEJOLnByb3RvdHlwZS5zaHJuID0gZnVuY3Rpb24gc2hybiAoYml0cykge1xyXG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pc2hybihiaXRzKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUudXNocm4gPSBmdW5jdGlvbiB1c2hybiAoYml0cykge1xyXG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pdXNocm4oYml0cyk7XHJcbiAgfTtcclxuXHJcbiAgLy8gVGVzdCBpZiBuIGJpdCBpcyBzZXRcclxuICBCTi5wcm90b3R5cGUudGVzdG4gPSBmdW5jdGlvbiB0ZXN0biAoYml0KSB7XHJcbiAgICBhc3NlcnQodHlwZW9mIGJpdCA9PT0gJ251bWJlcicgJiYgYml0ID49IDApO1xyXG4gICAgdmFyIHIgPSBiaXQgJSAyNjtcclxuICAgIHZhciBzID0gKGJpdCAtIHIpIC8gMjY7XHJcbiAgICB2YXIgcSA9IDEgPDwgcjtcclxuXHJcbiAgICAvLyBGYXN0IGNhc2U6IGJpdCBpcyBtdWNoIGhpZ2hlciB0aGFuIGFsbCBleGlzdGluZyB3b3Jkc1xyXG4gICAgaWYgKHRoaXMubGVuZ3RoIDw9IHMpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAvLyBDaGVjayBiaXQgYW5kIHJldHVyblxyXG4gICAgdmFyIHcgPSB0aGlzLndvcmRzW3NdO1xyXG5cclxuICAgIHJldHVybiAhISh3ICYgcSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gUmV0dXJuIG9ubHkgbG93ZXJzIGJpdHMgb2YgbnVtYmVyIChpbi1wbGFjZSlcclxuICBCTi5wcm90b3R5cGUuaW1hc2tuID0gZnVuY3Rpb24gaW1hc2tuIChiaXRzKSB7XHJcbiAgICBhc3NlcnQodHlwZW9mIGJpdHMgPT09ICdudW1iZXInICYmIGJpdHMgPj0gMCk7XHJcbiAgICB2YXIgciA9IGJpdHMgJSAyNjtcclxuICAgIHZhciBzID0gKGJpdHMgLSByKSAvIDI2O1xyXG5cclxuICAgIGFzc2VydCh0aGlzLm5lZ2F0aXZlID09PSAwLCAnaW1hc2tuIHdvcmtzIG9ubHkgd2l0aCBwb3NpdGl2ZSBudW1iZXJzJyk7XHJcblxyXG4gICAgaWYgKHRoaXMubGVuZ3RoIDw9IHMpIHtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHIgIT09IDApIHtcclxuICAgICAgcysrO1xyXG4gICAgfVxyXG4gICAgdGhpcy5sZW5ndGggPSBNYXRoLm1pbihzLCB0aGlzLmxlbmd0aCk7XHJcblxyXG4gICAgaWYgKHIgIT09IDApIHtcclxuICAgICAgdmFyIG1hc2sgPSAweDNmZmZmZmYgXiAoKDB4M2ZmZmZmZiA+Pj4gcikgPDwgcik7XHJcbiAgICAgIHRoaXMud29yZHNbdGhpcy5sZW5ndGggLSAxXSAmPSBtYXNrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnN0cmlwKCk7XHJcbiAgfTtcclxuXHJcbiAgLy8gUmV0dXJuIG9ubHkgbG93ZXJzIGJpdHMgb2YgbnVtYmVyXHJcbiAgQk4ucHJvdG90eXBlLm1hc2tuID0gZnVuY3Rpb24gbWFza24gKGJpdHMpIHtcclxuICAgIHJldHVybiB0aGlzLmNsb25lKCkuaW1hc2tuKGJpdHMpO1xyXG4gIH07XHJcblxyXG4gIC8vIEFkZCBwbGFpbiBudW1iZXIgYG51bWAgdG8gYHRoaXNgXHJcbiAgQk4ucHJvdG90eXBlLmlhZGRuID0gZnVuY3Rpb24gaWFkZG4gKG51bSkge1xyXG4gICAgYXNzZXJ0KHR5cGVvZiBudW0gPT09ICdudW1iZXInKTtcclxuICAgIGFzc2VydChudW0gPCAweDQwMDAwMDApO1xyXG4gICAgaWYgKG51bSA8IDApIHJldHVybiB0aGlzLmlzdWJuKC1udW0pO1xyXG5cclxuICAgIC8vIFBvc3NpYmxlIHNpZ24gY2hhbmdlXHJcbiAgICBpZiAodGhpcy5uZWdhdGl2ZSAhPT0gMCkge1xyXG4gICAgICBpZiAodGhpcy5sZW5ndGggPT09IDEgJiYgKHRoaXMud29yZHNbMF0gfCAwKSA8IG51bSkge1xyXG4gICAgICAgIHRoaXMud29yZHNbMF0gPSBudW0gLSAodGhpcy53b3Jkc1swXSB8IDApO1xyXG4gICAgICAgIHRoaXMubmVnYXRpdmUgPSAwO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMDtcclxuICAgICAgdGhpcy5pc3VibihudW0pO1xyXG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIHdpdGhvdXQgY2hlY2tzXHJcbiAgICByZXR1cm4gdGhpcy5faWFkZG4obnVtKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuX2lhZGRuID0gZnVuY3Rpb24gX2lhZGRuIChudW0pIHtcclxuICAgIHRoaXMud29yZHNbMF0gKz0gbnVtO1xyXG5cclxuICAgIC8vIENhcnJ5XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoICYmIHRoaXMud29yZHNbaV0gPj0gMHg0MDAwMDAwOyBpKyspIHtcclxuICAgICAgdGhpcy53b3Jkc1tpXSAtPSAweDQwMDAwMDA7XHJcbiAgICAgIGlmIChpID09PSB0aGlzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICB0aGlzLndvcmRzW2kgKyAxXSA9IDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy53b3Jkc1tpICsgMV0rKztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5sZW5ndGggPSBNYXRoLm1heCh0aGlzLmxlbmd0aCwgaSArIDEpO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIC8vIFN1YnRyYWN0IHBsYWluIG51bWJlciBgbnVtYCBmcm9tIGB0aGlzYFxyXG4gIEJOLnByb3RvdHlwZS5pc3VibiA9IGZ1bmN0aW9uIGlzdWJuIChudW0pIHtcclxuICAgIGFzc2VydCh0eXBlb2YgbnVtID09PSAnbnVtYmVyJyk7XHJcbiAgICBhc3NlcnQobnVtIDwgMHg0MDAwMDAwKTtcclxuICAgIGlmIChudW0gPCAwKSByZXR1cm4gdGhpcy5pYWRkbigtbnVtKTtcclxuXHJcbiAgICBpZiAodGhpcy5uZWdhdGl2ZSAhPT0gMCkge1xyXG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMDtcclxuICAgICAgdGhpcy5pYWRkbihudW0pO1xyXG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy53b3Jkc1swXSAtPSBudW07XHJcblxyXG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAxICYmIHRoaXMud29yZHNbMF0gPCAwKSB7XHJcbiAgICAgIHRoaXMud29yZHNbMF0gPSAtdGhpcy53b3Jkc1swXTtcclxuICAgICAgdGhpcy5uZWdhdGl2ZSA9IDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBDYXJyeVxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoICYmIHRoaXMud29yZHNbaV0gPCAwOyBpKyspIHtcclxuICAgICAgICB0aGlzLndvcmRzW2ldICs9IDB4NDAwMDAwMDtcclxuICAgICAgICB0aGlzLndvcmRzW2kgKyAxXSAtPSAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuYWRkbiA9IGZ1bmN0aW9uIGFkZG4gKG51bSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pYWRkbihudW0pO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5zdWJuID0gZnVuY3Rpb24gc3VibiAobnVtKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmlzdWJuKG51bSk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLmlhYnMgPSBmdW5jdGlvbiBpYWJzICgpIHtcclxuICAgIHRoaXMubmVnYXRpdmUgPSAwO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5hYnMgPSBmdW5jdGlvbiBhYnMgKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pYWJzKCk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLl9pc2hsbnN1Ym11bCA9IGZ1bmN0aW9uIF9pc2hsbnN1Ym11bCAobnVtLCBtdWwsIHNoaWZ0KSB7XHJcbiAgICB2YXIgbGVuID0gbnVtLmxlbmd0aCArIHNoaWZ0O1xyXG4gICAgdmFyIGk7XHJcblxyXG4gICAgdGhpcy5fZXhwYW5kKGxlbik7XHJcblxyXG4gICAgdmFyIHc7XHJcbiAgICB2YXIgY2FycnkgPSAwO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IG51bS5sZW5ndGg7IGkrKykge1xyXG4gICAgICB3ID0gKHRoaXMud29yZHNbaSArIHNoaWZ0XSB8IDApICsgY2Fycnk7XHJcbiAgICAgIHZhciByaWdodCA9IChudW0ud29yZHNbaV0gfCAwKSAqIG11bDtcclxuICAgICAgdyAtPSByaWdodCAmIDB4M2ZmZmZmZjtcclxuICAgICAgY2FycnkgPSAodyA+PiAyNikgLSAoKHJpZ2h0IC8gMHg0MDAwMDAwKSB8IDApO1xyXG4gICAgICB0aGlzLndvcmRzW2kgKyBzaGlmdF0gPSB3ICYgMHgzZmZmZmZmO1xyXG4gICAgfVxyXG4gICAgZm9yICg7IGkgPCB0aGlzLmxlbmd0aCAtIHNoaWZ0OyBpKyspIHtcclxuICAgICAgdyA9ICh0aGlzLndvcmRzW2kgKyBzaGlmdF0gfCAwKSArIGNhcnJ5O1xyXG4gICAgICBjYXJyeSA9IHcgPj4gMjY7XHJcbiAgICAgIHRoaXMud29yZHNbaSArIHNoaWZ0XSA9IHcgJiAweDNmZmZmZmY7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNhcnJ5ID09PSAwKSByZXR1cm4gdGhpcy5zdHJpcCgpO1xyXG5cclxuICAgIC8vIFN1YnRyYWN0aW9uIG92ZXJmbG93XHJcbiAgICBhc3NlcnQoY2FycnkgPT09IC0xKTtcclxuICAgIGNhcnJ5ID0gMDtcclxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHcgPSAtKHRoaXMud29yZHNbaV0gfCAwKSArIGNhcnJ5O1xyXG4gICAgICBjYXJyeSA9IHcgPj4gMjY7XHJcbiAgICAgIHRoaXMud29yZHNbaV0gPSB3ICYgMHgzZmZmZmZmO1xyXG4gICAgfVxyXG4gICAgdGhpcy5uZWdhdGl2ZSA9IDE7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuX3dvcmREaXYgPSBmdW5jdGlvbiBfd29yZERpdiAobnVtLCBtb2RlKSB7XHJcbiAgICB2YXIgc2hpZnQgPSB0aGlzLmxlbmd0aCAtIG51bS5sZW5ndGg7XHJcblxyXG4gICAgdmFyIGEgPSB0aGlzLmNsb25lKCk7XHJcbiAgICB2YXIgYiA9IG51bTtcclxuXHJcbiAgICAvLyBOb3JtYWxpemVcclxuICAgIHZhciBiaGkgPSBiLndvcmRzW2IubGVuZ3RoIC0gMV0gfCAwO1xyXG4gICAgdmFyIGJoaUJpdHMgPSB0aGlzLl9jb3VudEJpdHMoYmhpKTtcclxuICAgIHNoaWZ0ID0gMjYgLSBiaGlCaXRzO1xyXG4gICAgaWYgKHNoaWZ0ICE9PSAwKSB7XHJcbiAgICAgIGIgPSBiLnVzaGxuKHNoaWZ0KTtcclxuICAgICAgYS5pdXNobG4oc2hpZnQpO1xyXG4gICAgICBiaGkgPSBiLndvcmRzW2IubGVuZ3RoIC0gMV0gfCAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEluaXRpYWxpemUgcXVvdGllbnRcclxuICAgIHZhciBtID0gYS5sZW5ndGggLSBiLmxlbmd0aDtcclxuICAgIHZhciBxO1xyXG5cclxuICAgIGlmIChtb2RlICE9PSAnbW9kJykge1xyXG4gICAgICBxID0gbmV3IEJOKG51bGwpO1xyXG4gICAgICBxLmxlbmd0aCA9IG0gKyAxO1xyXG4gICAgICBxLndvcmRzID0gbmV3IEFycmF5KHEubGVuZ3RoKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgcS53b3Jkc1tpXSA9IDA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgZGlmZiA9IGEuY2xvbmUoKS5faXNobG5zdWJtdWwoYiwgMSwgbSk7XHJcbiAgICBpZiAoZGlmZi5uZWdhdGl2ZSA9PT0gMCkge1xyXG4gICAgICBhID0gZGlmZjtcclxuICAgICAgaWYgKHEpIHtcclxuICAgICAgICBxLndvcmRzW21dID0gMTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGogPSBtIC0gMTsgaiA+PSAwOyBqLS0pIHtcclxuICAgICAgdmFyIHFqID0gKGEud29yZHNbYi5sZW5ndGggKyBqXSB8IDApICogMHg0MDAwMDAwICtcclxuICAgICAgICAoYS53b3Jkc1tiLmxlbmd0aCArIGogLSAxXSB8IDApO1xyXG5cclxuICAgICAgLy8gTk9URTogKHFqIC8gYmhpKSBpcyAoMHgzZmZmZmZmICogMHg0MDAwMDAwICsgMHgzZmZmZmZmKSAvIDB4MjAwMDAwMCBtYXhcclxuICAgICAgLy8gKDB4N2ZmZmZmZilcclxuICAgICAgcWogPSBNYXRoLm1pbigocWogLyBiaGkpIHwgMCwgMHgzZmZmZmZmKTtcclxuXHJcbiAgICAgIGEuX2lzaGxuc3VibXVsKGIsIHFqLCBqKTtcclxuICAgICAgd2hpbGUgKGEubmVnYXRpdmUgIT09IDApIHtcclxuICAgICAgICBxai0tO1xyXG4gICAgICAgIGEubmVnYXRpdmUgPSAwO1xyXG4gICAgICAgIGEuX2lzaGxuc3VibXVsKGIsIDEsIGopO1xyXG4gICAgICAgIGlmICghYS5pc1plcm8oKSkge1xyXG4gICAgICAgICAgYS5uZWdhdGl2ZSBePSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAocSkge1xyXG4gICAgICAgIHEud29yZHNbal0gPSBxajtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHEpIHtcclxuICAgICAgcS5zdHJpcCgpO1xyXG4gICAgfVxyXG4gICAgYS5zdHJpcCgpO1xyXG5cclxuICAgIC8vIERlbm9ybWFsaXplXHJcbiAgICBpZiAobW9kZSAhPT0gJ2RpdicgJiYgc2hpZnQgIT09IDApIHtcclxuICAgICAgYS5pdXNocm4oc2hpZnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRpdjogcSB8fCBudWxsLFxyXG4gICAgICBtb2Q6IGFcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgLy8gTk9URTogMSkgYG1vZGVgIGNhbiBiZSBzZXQgdG8gYG1vZGAgdG8gcmVxdWVzdCBtb2Qgb25seSxcclxuICAvLyAgICAgICB0byBgZGl2YCB0byByZXF1ZXN0IGRpdiBvbmx5LCBvciBiZSBhYnNlbnQgdG9cclxuICAvLyAgICAgICByZXF1ZXN0IGJvdGggZGl2ICYgbW9kXHJcbiAgLy8gICAgICAgMikgYHBvc2l0aXZlYCBpcyB0cnVlIGlmIHVuc2lnbmVkIG1vZCBpcyByZXF1ZXN0ZWRcclxuICBCTi5wcm90b3R5cGUuZGl2bW9kID0gZnVuY3Rpb24gZGl2bW9kIChudW0sIG1vZGUsIHBvc2l0aXZlKSB7XHJcbiAgICBhc3NlcnQoIW51bS5pc1plcm8oKSk7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNaZXJvKCkpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBkaXY6IG5ldyBCTigwKSxcclxuICAgICAgICBtb2Q6IG5ldyBCTigwKVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBkaXYsIG1vZCwgcmVzO1xyXG4gICAgaWYgKHRoaXMubmVnYXRpdmUgIT09IDAgJiYgbnVtLm5lZ2F0aXZlID09PSAwKSB7XHJcbiAgICAgIHJlcyA9IHRoaXMubmVnKCkuZGl2bW9kKG51bSwgbW9kZSk7XHJcblxyXG4gICAgICBpZiAobW9kZSAhPT0gJ21vZCcpIHtcclxuICAgICAgICBkaXYgPSByZXMuZGl2Lm5lZygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobW9kZSAhPT0gJ2RpdicpIHtcclxuICAgICAgICBtb2QgPSByZXMubW9kLm5lZygpO1xyXG4gICAgICAgIGlmIChwb3NpdGl2ZSAmJiBtb2QubmVnYXRpdmUgIT09IDApIHtcclxuICAgICAgICAgIG1vZC5pYWRkKG51bSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRpdjogZGl2LFxyXG4gICAgICAgIG1vZDogbW9kXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMubmVnYXRpdmUgPT09IDAgJiYgbnVtLm5lZ2F0aXZlICE9PSAwKSB7XHJcbiAgICAgIHJlcyA9IHRoaXMuZGl2bW9kKG51bS5uZWcoKSwgbW9kZSk7XHJcblxyXG4gICAgICBpZiAobW9kZSAhPT0gJ21vZCcpIHtcclxuICAgICAgICBkaXYgPSByZXMuZGl2Lm5lZygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRpdjogZGl2LFxyXG4gICAgICAgIG1vZDogcmVzLm1vZFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgodGhpcy5uZWdhdGl2ZSAmIG51bS5uZWdhdGl2ZSkgIT09IDApIHtcclxuICAgICAgcmVzID0gdGhpcy5uZWcoKS5kaXZtb2QobnVtLm5lZygpLCBtb2RlKTtcclxuXHJcbiAgICAgIGlmIChtb2RlICE9PSAnZGl2Jykge1xyXG4gICAgICAgIG1vZCA9IHJlcy5tb2QubmVnKCk7XHJcbiAgICAgICAgaWYgKHBvc2l0aXZlICYmIG1vZC5uZWdhdGl2ZSAhPT0gMCkge1xyXG4gICAgICAgICAgbW9kLmlzdWIobnVtKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGl2OiByZXMuZGl2LFxyXG4gICAgICAgIG1vZDogbW9kXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQm90aCBudW1iZXJzIGFyZSBwb3NpdGl2ZSBhdCB0aGlzIHBvaW50XHJcblxyXG4gICAgLy8gU3RyaXAgYm90aCBudW1iZXJzIHRvIGFwcHJveGltYXRlIHNoaWZ0IHZhbHVlXHJcbiAgICBpZiAobnVtLmxlbmd0aCA+IHRoaXMubGVuZ3RoIHx8IHRoaXMuY21wKG51bSkgPCAwKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGl2OiBuZXcgQk4oMCksXHJcbiAgICAgICAgbW9kOiB0aGlzXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVmVyeSBzaG9ydCByZWR1Y3Rpb25cclxuICAgIGlmIChudW0ubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIGlmIChtb2RlID09PSAnZGl2Jykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBkaXY6IHRoaXMuZGl2bihudW0ud29yZHNbMF0pLFxyXG4gICAgICAgICAgbW9kOiBudWxsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG1vZGUgPT09ICdtb2QnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGRpdjogbnVsbCxcclxuICAgICAgICAgIG1vZDogbmV3IEJOKHRoaXMubW9kbihudW0ud29yZHNbMF0pKVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGl2OiB0aGlzLmRpdm4obnVtLndvcmRzWzBdKSxcclxuICAgICAgICBtb2Q6IG5ldyBCTih0aGlzLm1vZG4obnVtLndvcmRzWzBdKSlcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5fd29yZERpdihudW0sIG1vZGUpO1xyXG4gIH07XHJcblxyXG4gIC8vIEZpbmQgYHRoaXNgIC8gYG51bWBcclxuICBCTi5wcm90b3R5cGUuZGl2ID0gZnVuY3Rpb24gZGl2IChudW0pIHtcclxuICAgIHJldHVybiB0aGlzLmRpdm1vZChudW0sICdkaXYnLCBmYWxzZSkuZGl2O1xyXG4gIH07XHJcblxyXG4gIC8vIEZpbmQgYHRoaXNgICUgYG51bWBcclxuICBCTi5wcm90b3R5cGUubW9kID0gZnVuY3Rpb24gbW9kIChudW0pIHtcclxuICAgIHJldHVybiB0aGlzLmRpdm1vZChudW0sICdtb2QnLCBmYWxzZSkubW9kO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS51bW9kID0gZnVuY3Rpb24gdW1vZCAobnVtKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kaXZtb2QobnVtLCAnbW9kJywgdHJ1ZSkubW9kO1xyXG4gIH07XHJcblxyXG4gIC8vIEZpbmQgUm91bmQoYHRoaXNgIC8gYG51bWApXHJcbiAgQk4ucHJvdG90eXBlLmRpdlJvdW5kID0gZnVuY3Rpb24gZGl2Um91bmQgKG51bSkge1xyXG4gICAgdmFyIGRtID0gdGhpcy5kaXZtb2QobnVtKTtcclxuXHJcbiAgICAvLyBGYXN0IGNhc2UgLSBleGFjdCBkaXZpc2lvblxyXG4gICAgaWYgKGRtLm1vZC5pc1plcm8oKSkgcmV0dXJuIGRtLmRpdjtcclxuXHJcbiAgICB2YXIgbW9kID0gZG0uZGl2Lm5lZ2F0aXZlICE9PSAwID8gZG0ubW9kLmlzdWIobnVtKSA6IGRtLm1vZDtcclxuXHJcbiAgICB2YXIgaGFsZiA9IG51bS51c2hybigxKTtcclxuICAgIHZhciByMiA9IG51bS5hbmRsbigxKTtcclxuICAgIHZhciBjbXAgPSBtb2QuY21wKGhhbGYpO1xyXG5cclxuICAgIC8vIFJvdW5kIGRvd25cclxuICAgIGlmIChjbXAgPCAwIHx8IHIyID09PSAxICYmIGNtcCA9PT0gMCkgcmV0dXJuIGRtLmRpdjtcclxuXHJcbiAgICAvLyBSb3VuZCB1cFxyXG4gICAgcmV0dXJuIGRtLmRpdi5uZWdhdGl2ZSAhPT0gMCA/IGRtLmRpdi5pc3VibigxKSA6IGRtLmRpdi5pYWRkbigxKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUubW9kbiA9IGZ1bmN0aW9uIG1vZG4gKG51bSkge1xyXG4gICAgYXNzZXJ0KG51bSA8PSAweDNmZmZmZmYpO1xyXG4gICAgdmFyIHAgPSAoMSA8PCAyNikgJSBudW07XHJcblxyXG4gICAgdmFyIGFjYyA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICBhY2MgPSAocCAqIGFjYyArICh0aGlzLndvcmRzW2ldIHwgMCkpICUgbnVtO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhY2M7XHJcbiAgfTtcclxuXHJcbiAgLy8gSW4tcGxhY2UgZGl2aXNpb24gYnkgbnVtYmVyXHJcbiAgQk4ucHJvdG90eXBlLmlkaXZuID0gZnVuY3Rpb24gaWRpdm4gKG51bSkge1xyXG4gICAgYXNzZXJ0KG51bSA8PSAweDNmZmZmZmYpO1xyXG5cclxuICAgIHZhciBjYXJyeSA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICB2YXIgdyA9ICh0aGlzLndvcmRzW2ldIHwgMCkgKyBjYXJyeSAqIDB4NDAwMDAwMDtcclxuICAgICAgdGhpcy53b3Jkc1tpXSA9ICh3IC8gbnVtKSB8IDA7XHJcbiAgICAgIGNhcnJ5ID0gdyAlIG51bTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5zdHJpcCgpO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5kaXZuID0gZnVuY3Rpb24gZGl2biAobnVtKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmlkaXZuKG51bSk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLmVnY2QgPSBmdW5jdGlvbiBlZ2NkIChwKSB7XHJcbiAgICBhc3NlcnQocC5uZWdhdGl2ZSA9PT0gMCk7XHJcbiAgICBhc3NlcnQoIXAuaXNaZXJvKCkpO1xyXG5cclxuICAgIHZhciB4ID0gdGhpcztcclxuICAgIHZhciB5ID0gcC5jbG9uZSgpO1xyXG5cclxuICAgIGlmICh4Lm5lZ2F0aXZlICE9PSAwKSB7XHJcbiAgICAgIHggPSB4LnVtb2QocCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB4ID0geC5jbG9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEEgKiB4ICsgQiAqIHkgPSB4XHJcbiAgICB2YXIgQSA9IG5ldyBCTigxKTtcclxuICAgIHZhciBCID0gbmV3IEJOKDApO1xyXG5cclxuICAgIC8vIEMgKiB4ICsgRCAqIHkgPSB5XHJcbiAgICB2YXIgQyA9IG5ldyBCTigwKTtcclxuICAgIHZhciBEID0gbmV3IEJOKDEpO1xyXG5cclxuICAgIHZhciBnID0gMDtcclxuXHJcbiAgICB3aGlsZSAoeC5pc0V2ZW4oKSAmJiB5LmlzRXZlbigpKSB7XHJcbiAgICAgIHguaXVzaHJuKDEpO1xyXG4gICAgICB5Lml1c2hybigxKTtcclxuICAgICAgKytnO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB5cCA9IHkuY2xvbmUoKTtcclxuICAgIHZhciB4cCA9IHguY2xvbmUoKTtcclxuXHJcbiAgICB3aGlsZSAoIXguaXNaZXJvKCkpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGltID0gMTsgKHgud29yZHNbMF0gJiBpbSkgPT09IDAgJiYgaSA8IDI2OyArK2ksIGltIDw8PSAxKTtcclxuICAgICAgaWYgKGkgPiAwKSB7XHJcbiAgICAgICAgeC5pdXNocm4oaSk7XHJcbiAgICAgICAgd2hpbGUgKGktLSA+IDApIHtcclxuICAgICAgICAgIGlmIChBLmlzT2RkKCkgfHwgQi5pc09kZCgpKSB7XHJcbiAgICAgICAgICAgIEEuaWFkZCh5cCk7XHJcbiAgICAgICAgICAgIEIuaXN1Yih4cCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgQS5pdXNocm4oMSk7XHJcbiAgICAgICAgICBCLml1c2hybigxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAodmFyIGogPSAwLCBqbSA9IDE7ICh5LndvcmRzWzBdICYgam0pID09PSAwICYmIGogPCAyNjsgKytqLCBqbSA8PD0gMSk7XHJcbiAgICAgIGlmIChqID4gMCkge1xyXG4gICAgICAgIHkuaXVzaHJuKGopO1xyXG4gICAgICAgIHdoaWxlIChqLS0gPiAwKSB7XHJcbiAgICAgICAgICBpZiAoQy5pc09kZCgpIHx8IEQuaXNPZGQoKSkge1xyXG4gICAgICAgICAgICBDLmlhZGQoeXApO1xyXG4gICAgICAgICAgICBELmlzdWIoeHApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIEMuaXVzaHJuKDEpO1xyXG4gICAgICAgICAgRC5pdXNocm4oMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoeC5jbXAoeSkgPj0gMCkge1xyXG4gICAgICAgIHguaXN1Yih5KTtcclxuICAgICAgICBBLmlzdWIoQyk7XHJcbiAgICAgICAgQi5pc3ViKEQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHkuaXN1Yih4KTtcclxuICAgICAgICBDLmlzdWIoQSk7XHJcbiAgICAgICAgRC5pc3ViKEIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYTogQyxcclxuICAgICAgYjogRCxcclxuICAgICAgZ2NkOiB5Lml1c2hsbihnKVxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICAvLyBUaGlzIGlzIHJlZHVjZWQgaW5jYXJuYXRpb24gb2YgdGhlIGJpbmFyeSBFRUFcclxuICAvLyBhYm92ZSwgZGVzaWduYXRlZCB0byBpbnZlcnQgbWVtYmVycyBvZiB0aGVcclxuICAvLyBfcHJpbWVfIGZpZWxkcyBGKHApIGF0IGEgbWF4aW1hbCBzcGVlZFxyXG4gIEJOLnByb3RvdHlwZS5faW52bXAgPSBmdW5jdGlvbiBfaW52bXAgKHApIHtcclxuICAgIGFzc2VydChwLm5lZ2F0aXZlID09PSAwKTtcclxuICAgIGFzc2VydCghcC5pc1plcm8oKSk7XHJcblxyXG4gICAgdmFyIGEgPSB0aGlzO1xyXG4gICAgdmFyIGIgPSBwLmNsb25lKCk7XHJcblxyXG4gICAgaWYgKGEubmVnYXRpdmUgIT09IDApIHtcclxuICAgICAgYSA9IGEudW1vZChwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGEgPSBhLmNsb25lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHgxID0gbmV3IEJOKDEpO1xyXG4gICAgdmFyIHgyID0gbmV3IEJOKDApO1xyXG5cclxuICAgIHZhciBkZWx0YSA9IGIuY2xvbmUoKTtcclxuXHJcbiAgICB3aGlsZSAoYS5jbXBuKDEpID4gMCAmJiBiLmNtcG4oMSkgPiAwKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBpbSA9IDE7IChhLndvcmRzWzBdICYgaW0pID09PSAwICYmIGkgPCAyNjsgKytpLCBpbSA8PD0gMSk7XHJcbiAgICAgIGlmIChpID4gMCkge1xyXG4gICAgICAgIGEuaXVzaHJuKGkpO1xyXG4gICAgICAgIHdoaWxlIChpLS0gPiAwKSB7XHJcbiAgICAgICAgICBpZiAoeDEuaXNPZGQoKSkge1xyXG4gICAgICAgICAgICB4MS5pYWRkKGRlbHRhKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB4MS5pdXNocm4oMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKHZhciBqID0gMCwgam0gPSAxOyAoYi53b3Jkc1swXSAmIGptKSA9PT0gMCAmJiBqIDwgMjY7ICsraiwgam0gPDw9IDEpO1xyXG4gICAgICBpZiAoaiA+IDApIHtcclxuICAgICAgICBiLml1c2hybihqKTtcclxuICAgICAgICB3aGlsZSAoai0tID4gMCkge1xyXG4gICAgICAgICAgaWYgKHgyLmlzT2RkKCkpIHtcclxuICAgICAgICAgICAgeDIuaWFkZChkZWx0YSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgeDIuaXVzaHJuKDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGEuY21wKGIpID49IDApIHtcclxuICAgICAgICBhLmlzdWIoYik7XHJcbiAgICAgICAgeDEuaXN1Yih4Mik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYi5pc3ViKGEpO1xyXG4gICAgICAgIHgyLmlzdWIoeDEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJlcztcclxuICAgIGlmIChhLmNtcG4oMSkgPT09IDApIHtcclxuICAgICAgcmVzID0geDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXMgPSB4MjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVzLmNtcG4oMCkgPCAwKSB7XHJcbiAgICAgIHJlcy5pYWRkKHApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXM7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLmdjZCA9IGZ1bmN0aW9uIGdjZCAobnVtKSB7XHJcbiAgICBpZiAodGhpcy5pc1plcm8oKSkgcmV0dXJuIG51bS5hYnMoKTtcclxuICAgIGlmIChudW0uaXNaZXJvKCkpIHJldHVybiB0aGlzLmFicygpO1xyXG5cclxuICAgIHZhciBhID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgdmFyIGIgPSBudW0uY2xvbmUoKTtcclxuICAgIGEubmVnYXRpdmUgPSAwO1xyXG4gICAgYi5uZWdhdGl2ZSA9IDA7XHJcblxyXG4gICAgLy8gUmVtb3ZlIGNvbW1vbiBmYWN0b3Igb2YgdHdvXHJcbiAgICBmb3IgKHZhciBzaGlmdCA9IDA7IGEuaXNFdmVuKCkgJiYgYi5pc0V2ZW4oKTsgc2hpZnQrKykge1xyXG4gICAgICBhLml1c2hybigxKTtcclxuICAgICAgYi5pdXNocm4oMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZG8ge1xyXG4gICAgICB3aGlsZSAoYS5pc0V2ZW4oKSkge1xyXG4gICAgICAgIGEuaXVzaHJuKDEpO1xyXG4gICAgICB9XHJcbiAgICAgIHdoaWxlIChiLmlzRXZlbigpKSB7XHJcbiAgICAgICAgYi5pdXNocm4oMSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciByID0gYS5jbXAoYik7XHJcbiAgICAgIGlmIChyIDwgMCkge1xyXG4gICAgICAgIC8vIFN3YXAgYGFgIGFuZCBgYmAgdG8gbWFrZSBgYWAgYWx3YXlzIGJpZ2dlciB0aGFuIGBiYFxyXG4gICAgICAgIHZhciB0ID0gYTtcclxuICAgICAgICBhID0gYjtcclxuICAgICAgICBiID0gdDtcclxuICAgICAgfSBlbHNlIGlmIChyID09PSAwIHx8IGIuY21wbigxKSA9PT0gMCkge1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBhLmlzdWIoYik7XHJcbiAgICB9IHdoaWxlICh0cnVlKTtcclxuXHJcbiAgICByZXR1cm4gYi5pdXNobG4oc2hpZnQpO1xyXG4gIH07XHJcblxyXG4gIC8vIEludmVydCBudW1iZXIgaW4gdGhlIGZpZWxkIEYobnVtKVxyXG4gIEJOLnByb3RvdHlwZS5pbnZtID0gZnVuY3Rpb24gaW52bSAobnVtKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lZ2NkKG51bSkuYS51bW9kKG51bSk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLmlzRXZlbiA9IGZ1bmN0aW9uIGlzRXZlbiAoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMud29yZHNbMF0gJiAxKSA9PT0gMDtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuaXNPZGQgPSBmdW5jdGlvbiBpc09kZCAoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMud29yZHNbMF0gJiAxKSA9PT0gMTtcclxuICB9O1xyXG5cclxuICAvLyBBbmQgZmlyc3Qgd29yZCBhbmQgbnVtXHJcbiAgQk4ucHJvdG90eXBlLmFuZGxuID0gZnVuY3Rpb24gYW5kbG4gKG51bSkge1xyXG4gICAgcmV0dXJuIHRoaXMud29yZHNbMF0gJiBudW07XHJcbiAgfTtcclxuXHJcbiAgLy8gSW5jcmVtZW50IGF0IHRoZSBiaXQgcG9zaXRpb24gaW4tbGluZVxyXG4gIEJOLnByb3RvdHlwZS5iaW5jbiA9IGZ1bmN0aW9uIGJpbmNuIChiaXQpIHtcclxuICAgIGFzc2VydCh0eXBlb2YgYml0ID09PSAnbnVtYmVyJyk7XHJcbiAgICB2YXIgciA9IGJpdCAlIDI2O1xyXG4gICAgdmFyIHMgPSAoYml0IC0gcikgLyAyNjtcclxuICAgIHZhciBxID0gMSA8PCByO1xyXG5cclxuICAgIC8vIEZhc3QgY2FzZTogYml0IGlzIG11Y2ggaGlnaGVyIHRoYW4gYWxsIGV4aXN0aW5nIHdvcmRzXHJcbiAgICBpZiAodGhpcy5sZW5ndGggPD0gcykge1xyXG4gICAgICB0aGlzLl9leHBhbmQocyArIDEpO1xyXG4gICAgICB0aGlzLndvcmRzW3NdIHw9IHE7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFkZCBiaXQgYW5kIHByb3BhZ2F0ZSwgaWYgbmVlZGVkXHJcbiAgICB2YXIgY2FycnkgPSBxO1xyXG4gICAgZm9yICh2YXIgaSA9IHM7IGNhcnJ5ICE9PSAwICYmIGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciB3ID0gdGhpcy53b3Jkc1tpXSB8IDA7XHJcbiAgICAgIHcgKz0gY2Fycnk7XHJcbiAgICAgIGNhcnJ5ID0gdyA+Pj4gMjY7XHJcbiAgICAgIHcgJj0gMHgzZmZmZmZmO1xyXG4gICAgICB0aGlzLndvcmRzW2ldID0gdztcclxuICAgIH1cclxuICAgIGlmIChjYXJyeSAhPT0gMCkge1xyXG4gICAgICB0aGlzLndvcmRzW2ldID0gY2Fycnk7XHJcbiAgICAgIHRoaXMubGVuZ3RoKys7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUuaXNaZXJvID0gZnVuY3Rpb24gaXNaZXJvICgpIHtcclxuICAgIHJldHVybiB0aGlzLmxlbmd0aCA9PT0gMSAmJiB0aGlzLndvcmRzWzBdID09PSAwO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5jbXBuID0gZnVuY3Rpb24gY21wbiAobnVtKSB7XHJcbiAgICB2YXIgbmVnYXRpdmUgPSBudW0gPCAwO1xyXG5cclxuICAgIGlmICh0aGlzLm5lZ2F0aXZlICE9PSAwICYmICFuZWdhdGl2ZSkgcmV0dXJuIC0xO1xyXG4gICAgaWYgKHRoaXMubmVnYXRpdmUgPT09IDAgJiYgbmVnYXRpdmUpIHJldHVybiAxO1xyXG5cclxuICAgIHRoaXMuc3RyaXAoKTtcclxuXHJcbiAgICB2YXIgcmVzO1xyXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gMSkge1xyXG4gICAgICByZXMgPSAxO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKG5lZ2F0aXZlKSB7XHJcbiAgICAgICAgbnVtID0gLW51bTtcclxuICAgICAgfVxyXG5cclxuICAgICAgYXNzZXJ0KG51bSA8PSAweDNmZmZmZmYsICdOdW1iZXIgaXMgdG9vIGJpZycpO1xyXG5cclxuICAgICAgdmFyIHcgPSB0aGlzLndvcmRzWzBdIHwgMDtcclxuICAgICAgcmVzID0gdyA9PT0gbnVtID8gMCA6IHcgPCBudW0gPyAtMSA6IDE7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5uZWdhdGl2ZSAhPT0gMCkgcmV0dXJuIC1yZXMgfCAwO1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9O1xyXG5cclxuICAvLyBDb21wYXJlIHR3byBudW1iZXJzIGFuZCByZXR1cm46XHJcbiAgLy8gMSAtIGlmIGB0aGlzYCA+IGBudW1gXHJcbiAgLy8gMCAtIGlmIGB0aGlzYCA9PSBgbnVtYFxyXG4gIC8vIC0xIC0gaWYgYHRoaXNgIDwgYG51bWBcclxuICBCTi5wcm90b3R5cGUuY21wID0gZnVuY3Rpb24gY21wIChudW0pIHtcclxuICAgIGlmICh0aGlzLm5lZ2F0aXZlICE9PSAwICYmIG51bS5uZWdhdGl2ZSA9PT0gMCkgcmV0dXJuIC0xO1xyXG4gICAgaWYgKHRoaXMubmVnYXRpdmUgPT09IDAgJiYgbnVtLm5lZ2F0aXZlICE9PSAwKSByZXR1cm4gMTtcclxuXHJcbiAgICB2YXIgcmVzID0gdGhpcy51Y21wKG51bSk7XHJcbiAgICBpZiAodGhpcy5uZWdhdGl2ZSAhPT0gMCkgcmV0dXJuIC1yZXMgfCAwO1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9O1xyXG5cclxuICAvLyBVbnNpZ25lZCBjb21wYXJpc29uXHJcbiAgQk4ucHJvdG90eXBlLnVjbXAgPSBmdW5jdGlvbiB1Y21wIChudW0pIHtcclxuICAgIC8vIEF0IHRoaXMgcG9pbnQgYm90aCBudW1iZXJzIGhhdmUgdGhlIHNhbWUgc2lnblxyXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbnVtLmxlbmd0aCkgcmV0dXJuIDE7XHJcbiAgICBpZiAodGhpcy5sZW5ndGggPCBudW0ubGVuZ3RoKSByZXR1cm4gLTE7XHJcblxyXG4gICAgdmFyIHJlcyA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICB2YXIgYSA9IHRoaXMud29yZHNbaV0gfCAwO1xyXG4gICAgICB2YXIgYiA9IG51bS53b3Jkc1tpXSB8IDA7XHJcblxyXG4gICAgICBpZiAoYSA9PT0gYikgY29udGludWU7XHJcbiAgICAgIGlmIChhIDwgYikge1xyXG4gICAgICAgIHJlcyA9IC0xO1xyXG4gICAgICB9IGVsc2UgaWYgKGEgPiBiKSB7XHJcbiAgICAgICAgcmVzID0gMTtcclxuICAgICAgfVxyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHJldHVybiByZXM7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLmd0biA9IGZ1bmN0aW9uIGd0biAobnVtKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jbXBuKG51bSkgPT09IDE7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLmd0ID0gZnVuY3Rpb24gZ3QgKG51bSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY21wKG51bSkgPT09IDE7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLmd0ZW4gPSBmdW5jdGlvbiBndGVuIChudW0pIHtcclxuICAgIHJldHVybiB0aGlzLmNtcG4obnVtKSA+PSAwO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5ndGUgPSBmdW5jdGlvbiBndGUgKG51bSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY21wKG51bSkgPj0gMDtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUubHRuID0gZnVuY3Rpb24gbHRuIChudW0pIHtcclxuICAgIHJldHVybiB0aGlzLmNtcG4obnVtKSA9PT0gLTE7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLmx0ID0gZnVuY3Rpb24gbHQgKG51bSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY21wKG51bSkgPT09IC0xO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5sdGVuID0gZnVuY3Rpb24gbHRlbiAobnVtKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jbXBuKG51bSkgPD0gMDtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUubHRlID0gZnVuY3Rpb24gbHRlIChudW0pIHtcclxuICAgIHJldHVybiB0aGlzLmNtcChudW0pIDw9IDA7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLmVxbiA9IGZ1bmN0aW9uIGVxbiAobnVtKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jbXBuKG51bSkgPT09IDA7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLmVxID0gZnVuY3Rpb24gZXEgKG51bSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY21wKG51bSkgPT09IDA7XHJcbiAgfTtcclxuXHJcbiAgLy9cclxuICAvLyBBIHJlZHVjZSBjb250ZXh0LCBjb3VsZCBiZSB1c2luZyBtb250Z29tZXJ5IG9yIHNvbWV0aGluZyBiZXR0ZXIsIGRlcGVuZGluZ1xyXG4gIC8vIG9uIHRoZSBgbWAgaXRzZWxmLlxyXG4gIC8vXHJcbiAgQk4ucmVkID0gZnVuY3Rpb24gcmVkIChudW0pIHtcclxuICAgIHJldHVybiBuZXcgUmVkKG51bSk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLnRvUmVkID0gZnVuY3Rpb24gdG9SZWQgKGN0eCkge1xyXG4gICAgYXNzZXJ0KCF0aGlzLnJlZCwgJ0FscmVhZHkgYSBudW1iZXIgaW4gcmVkdWN0aW9uIGNvbnRleHQnKTtcclxuICAgIGFzc2VydCh0aGlzLm5lZ2F0aXZlID09PSAwLCAncmVkIHdvcmtzIG9ubHkgd2l0aCBwb3NpdGl2ZXMnKTtcclxuICAgIHJldHVybiBjdHguY29udmVydFRvKHRoaXMpLl9mb3JjZVJlZChjdHgpO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5mcm9tUmVkID0gZnVuY3Rpb24gZnJvbVJlZCAoKSB7XHJcbiAgICBhc3NlcnQodGhpcy5yZWQsICdmcm9tUmVkIHdvcmtzIG9ubHkgd2l0aCBudW1iZXJzIGluIHJlZHVjdGlvbiBjb250ZXh0Jyk7XHJcbiAgICByZXR1cm4gdGhpcy5yZWQuY29udmVydEZyb20odGhpcyk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLl9mb3JjZVJlZCA9IGZ1bmN0aW9uIF9mb3JjZVJlZCAoY3R4KSB7XHJcbiAgICB0aGlzLnJlZCA9IGN0eDtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5mb3JjZVJlZCA9IGZ1bmN0aW9uIGZvcmNlUmVkIChjdHgpIHtcclxuICAgIGFzc2VydCghdGhpcy5yZWQsICdBbHJlYWR5IGEgbnVtYmVyIGluIHJlZHVjdGlvbiBjb250ZXh0Jyk7XHJcbiAgICByZXR1cm4gdGhpcy5fZm9yY2VSZWQoY3R4KTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUucmVkQWRkID0gZnVuY3Rpb24gcmVkQWRkIChudW0pIHtcclxuICAgIGFzc2VydCh0aGlzLnJlZCwgJ3JlZEFkZCB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcclxuICAgIHJldHVybiB0aGlzLnJlZC5hZGQodGhpcywgbnVtKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUucmVkSUFkZCA9IGZ1bmN0aW9uIHJlZElBZGQgKG51bSkge1xyXG4gICAgYXNzZXJ0KHRoaXMucmVkLCAncmVkSUFkZCB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcclxuICAgIHJldHVybiB0aGlzLnJlZC5pYWRkKHRoaXMsIG51bSk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLnJlZFN1YiA9IGZ1bmN0aW9uIHJlZFN1YiAobnVtKSB7XHJcbiAgICBhc3NlcnQodGhpcy5yZWQsICdyZWRTdWIgd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XHJcbiAgICByZXR1cm4gdGhpcy5yZWQuc3ViKHRoaXMsIG51bSk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLnJlZElTdWIgPSBmdW5jdGlvbiByZWRJU3ViIChudW0pIHtcclxuICAgIGFzc2VydCh0aGlzLnJlZCwgJ3JlZElTdWIgd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XHJcbiAgICByZXR1cm4gdGhpcy5yZWQuaXN1Yih0aGlzLCBudW0pO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5yZWRTaGwgPSBmdW5jdGlvbiByZWRTaGwgKG51bSkge1xyXG4gICAgYXNzZXJ0KHRoaXMucmVkLCAncmVkU2hsIHdvcmtzIG9ubHkgd2l0aCByZWQgbnVtYmVycycpO1xyXG4gICAgcmV0dXJuIHRoaXMucmVkLnNobCh0aGlzLCBudW0pO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5yZWRNdWwgPSBmdW5jdGlvbiByZWRNdWwgKG51bSkge1xyXG4gICAgYXNzZXJ0KHRoaXMucmVkLCAncmVkTXVsIHdvcmtzIG9ubHkgd2l0aCByZWQgbnVtYmVycycpO1xyXG4gICAgdGhpcy5yZWQuX3ZlcmlmeTIodGhpcywgbnVtKTtcclxuICAgIHJldHVybiB0aGlzLnJlZC5tdWwodGhpcywgbnVtKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUucmVkSU11bCA9IGZ1bmN0aW9uIHJlZElNdWwgKG51bSkge1xyXG4gICAgYXNzZXJ0KHRoaXMucmVkLCAncmVkTXVsIHdvcmtzIG9ubHkgd2l0aCByZWQgbnVtYmVycycpO1xyXG4gICAgdGhpcy5yZWQuX3ZlcmlmeTIodGhpcywgbnVtKTtcclxuICAgIHJldHVybiB0aGlzLnJlZC5pbXVsKHRoaXMsIG51bSk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLnJlZFNxciA9IGZ1bmN0aW9uIHJlZFNxciAoKSB7XHJcbiAgICBhc3NlcnQodGhpcy5yZWQsICdyZWRTcXIgd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XHJcbiAgICB0aGlzLnJlZC5fdmVyaWZ5MSh0aGlzKTtcclxuICAgIHJldHVybiB0aGlzLnJlZC5zcXIodGhpcyk7XHJcbiAgfTtcclxuXHJcbiAgQk4ucHJvdG90eXBlLnJlZElTcXIgPSBmdW5jdGlvbiByZWRJU3FyICgpIHtcclxuICAgIGFzc2VydCh0aGlzLnJlZCwgJ3JlZElTcXIgd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XHJcbiAgICB0aGlzLnJlZC5fdmVyaWZ5MSh0aGlzKTtcclxuICAgIHJldHVybiB0aGlzLnJlZC5pc3FyKHRoaXMpO1xyXG4gIH07XHJcblxyXG4gIC8vIFNxdWFyZSByb290IG92ZXIgcFxyXG4gIEJOLnByb3RvdHlwZS5yZWRTcXJ0ID0gZnVuY3Rpb24gcmVkU3FydCAoKSB7XHJcbiAgICBhc3NlcnQodGhpcy5yZWQsICdyZWRTcXJ0IHdvcmtzIG9ubHkgd2l0aCByZWQgbnVtYmVycycpO1xyXG4gICAgdGhpcy5yZWQuX3ZlcmlmeTEodGhpcyk7XHJcbiAgICByZXR1cm4gdGhpcy5yZWQuc3FydCh0aGlzKTtcclxuICB9O1xyXG5cclxuICBCTi5wcm90b3R5cGUucmVkSW52bSA9IGZ1bmN0aW9uIHJlZEludm0gKCkge1xyXG4gICAgYXNzZXJ0KHRoaXMucmVkLCAncmVkSW52bSB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcclxuICAgIHRoaXMucmVkLl92ZXJpZnkxKHRoaXMpO1xyXG4gICAgcmV0dXJuIHRoaXMucmVkLmludm0odGhpcyk7XHJcbiAgfTtcclxuXHJcbiAgLy8gUmV0dXJuIG5lZ2F0aXZlIGNsb25lIG9mIGB0aGlzYCAlIGByZWQgbW9kdWxvYFxyXG4gIEJOLnByb3RvdHlwZS5yZWROZWcgPSBmdW5jdGlvbiByZWROZWcgKCkge1xyXG4gICAgYXNzZXJ0KHRoaXMucmVkLCAncmVkTmVnIHdvcmtzIG9ubHkgd2l0aCByZWQgbnVtYmVycycpO1xyXG4gICAgdGhpcy5yZWQuX3ZlcmlmeTEodGhpcyk7XHJcbiAgICByZXR1cm4gdGhpcy5yZWQubmVnKHRoaXMpO1xyXG4gIH07XHJcblxyXG4gIEJOLnByb3RvdHlwZS5yZWRQb3cgPSBmdW5jdGlvbiByZWRQb3cgKG51bSkge1xyXG4gICAgYXNzZXJ0KHRoaXMucmVkICYmICFudW0ucmVkLCAncmVkUG93KG5vcm1hbE51bSknKTtcclxuICAgIHRoaXMucmVkLl92ZXJpZnkxKHRoaXMpO1xyXG4gICAgcmV0dXJuIHRoaXMucmVkLnBvdyh0aGlzLCBudW0pO1xyXG4gIH07XHJcblxyXG4gIC8vIFByaW1lIG51bWJlcnMgd2l0aCBlZmZpY2llbnQgcmVkdWN0aW9uXHJcbiAgdmFyIHByaW1lcyA9IHtcclxuICAgIGsyNTY6IG51bGwsXHJcbiAgICBwMjI0OiBudWxsLFxyXG4gICAgcDE5MjogbnVsbCxcclxuICAgIHAyNTUxOTogbnVsbFxyXG4gIH07XHJcblxyXG4gIC8vIFBzZXVkby1NZXJzZW5uZSBwcmltZVxyXG4gIGZ1bmN0aW9uIE1QcmltZSAobmFtZSwgcCkge1xyXG4gICAgLy8gUCA9IDIgXiBOIC0gS1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIHRoaXMucCA9IG5ldyBCTihwLCAxNik7XHJcbiAgICB0aGlzLm4gPSB0aGlzLnAuYml0TGVuZ3RoKCk7XHJcbiAgICB0aGlzLmsgPSBuZXcgQk4oMSkuaXVzaGxuKHRoaXMubikuaXN1Yih0aGlzLnApO1xyXG5cclxuICAgIHRoaXMudG1wID0gdGhpcy5fdG1wKCk7XHJcbiAgfVxyXG5cclxuICBNUHJpbWUucHJvdG90eXBlLl90bXAgPSBmdW5jdGlvbiBfdG1wICgpIHtcclxuICAgIHZhciB0bXAgPSBuZXcgQk4obnVsbCk7XHJcbiAgICB0bXAud29yZHMgPSBuZXcgQXJyYXkoTWF0aC5jZWlsKHRoaXMubiAvIDEzKSk7XHJcbiAgICByZXR1cm4gdG1wO1xyXG4gIH07XHJcblxyXG4gIE1QcmltZS5wcm90b3R5cGUuaXJlZHVjZSA9IGZ1bmN0aW9uIGlyZWR1Y2UgKG51bSkge1xyXG4gICAgLy8gQXNzdW1lcyB0aGF0IGBudW1gIGlzIGxlc3MgdGhhbiBgUF4yYFxyXG4gICAgLy8gbnVtID0gSEkgKiAoMiBeIE4gLSBLKSArIEhJICogSyArIExPID0gSEkgKiBLICsgTE8gKG1vZCBQKVxyXG4gICAgdmFyIHIgPSBudW07XHJcbiAgICB2YXIgcmxlbjtcclxuXHJcbiAgICBkbyB7XHJcbiAgICAgIHRoaXMuc3BsaXQociwgdGhpcy50bXApO1xyXG4gICAgICByID0gdGhpcy5pbXVsSyhyKTtcclxuICAgICAgciA9IHIuaWFkZCh0aGlzLnRtcCk7XHJcbiAgICAgIHJsZW4gPSByLmJpdExlbmd0aCgpO1xyXG4gICAgfSB3aGlsZSAocmxlbiA+IHRoaXMubik7XHJcblxyXG4gICAgdmFyIGNtcCA9IHJsZW4gPCB0aGlzLm4gPyAtMSA6IHIudWNtcCh0aGlzLnApO1xyXG4gICAgaWYgKGNtcCA9PT0gMCkge1xyXG4gICAgICByLndvcmRzWzBdID0gMDtcclxuICAgICAgci5sZW5ndGggPSAxO1xyXG4gICAgfSBlbHNlIGlmIChjbXAgPiAwKSB7XHJcbiAgICAgIHIuaXN1Yih0aGlzLnApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgci5zdHJpcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByO1xyXG4gIH07XHJcblxyXG4gIE1QcmltZS5wcm90b3R5cGUuc3BsaXQgPSBmdW5jdGlvbiBzcGxpdCAoaW5wdXQsIG91dCkge1xyXG4gICAgaW5wdXQuaXVzaHJuKHRoaXMubiwgMCwgb3V0KTtcclxuICB9O1xyXG5cclxuICBNUHJpbWUucHJvdG90eXBlLmltdWxLID0gZnVuY3Rpb24gaW11bEsgKG51bSkge1xyXG4gICAgcmV0dXJuIG51bS5pbXVsKHRoaXMuayk7XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gSzI1NiAoKSB7XHJcbiAgICBNUHJpbWUuY2FsbChcclxuICAgICAgdGhpcyxcclxuICAgICAgJ2syNTYnLFxyXG4gICAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmUgZmZmZmZjMmYnKTtcclxuICB9XHJcbiAgaW5oZXJpdHMoSzI1NiwgTVByaW1lKTtcclxuXHJcbiAgSzI1Ni5wcm90b3R5cGUuc3BsaXQgPSBmdW5jdGlvbiBzcGxpdCAoaW5wdXQsIG91dHB1dCkge1xyXG4gICAgLy8gMjU2ID0gOSAqIDI2ICsgMjJcclxuICAgIHZhciBtYXNrID0gMHgzZmZmZmY7XHJcblxyXG4gICAgdmFyIG91dExlbiA9IE1hdGgubWluKGlucHV0Lmxlbmd0aCwgOSk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG91dExlbjsgaSsrKSB7XHJcbiAgICAgIG91dHB1dC53b3Jkc1tpXSA9IGlucHV0LndvcmRzW2ldO1xyXG4gICAgfVxyXG4gICAgb3V0cHV0Lmxlbmd0aCA9IG91dExlbjtcclxuXHJcbiAgICBpZiAoaW5wdXQubGVuZ3RoIDw9IDkpIHtcclxuICAgICAgaW5wdXQud29yZHNbMF0gPSAwO1xyXG4gICAgICBpbnB1dC5sZW5ndGggPSAxO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2hpZnQgYnkgOSBsaW1ic1xyXG4gICAgdmFyIHByZXYgPSBpbnB1dC53b3Jkc1s5XTtcclxuICAgIG91dHB1dC53b3Jkc1tvdXRwdXQubGVuZ3RoKytdID0gcHJldiAmIG1hc2s7XHJcblxyXG4gICAgZm9yIChpID0gMTA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgbmV4dCA9IGlucHV0LndvcmRzW2ldIHwgMDtcclxuICAgICAgaW5wdXQud29yZHNbaSAtIDEwXSA9ICgobmV4dCAmIG1hc2spIDw8IDQpIHwgKHByZXYgPj4+IDIyKTtcclxuICAgICAgcHJldiA9IG5leHQ7XHJcbiAgICB9XHJcbiAgICBwcmV2ID4+Pj0gMjI7XHJcbiAgICBpbnB1dC53b3Jkc1tpIC0gMTBdID0gcHJldjtcclxuICAgIGlmIChwcmV2ID09PSAwICYmIGlucHV0Lmxlbmd0aCA+IDEwKSB7XHJcbiAgICAgIGlucHV0Lmxlbmd0aCAtPSAxMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlucHV0Lmxlbmd0aCAtPSA5O1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIEsyNTYucHJvdG90eXBlLmltdWxLID0gZnVuY3Rpb24gaW11bEsgKG51bSkge1xyXG4gICAgLy8gSyA9IDB4MTAwMDAwM2QxID0gWyAweDQwLCAweDNkMSBdXHJcbiAgICBudW0ud29yZHNbbnVtLmxlbmd0aF0gPSAwO1xyXG4gICAgbnVtLndvcmRzW251bS5sZW5ndGggKyAxXSA9IDA7XHJcbiAgICBudW0ubGVuZ3RoICs9IDI7XHJcblxyXG4gICAgLy8gYm91bmRlZCBhdDogMHg0MCAqIDB4M2ZmZmZmZiArIDB4M2QwID0gMHgxMDAwMDAzOTBcclxuICAgIHZhciBsbyA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bS5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgdyA9IG51bS53b3Jkc1tpXSB8IDA7XHJcbiAgICAgIGxvICs9IHcgKiAweDNkMTtcclxuICAgICAgbnVtLndvcmRzW2ldID0gbG8gJiAweDNmZmZmZmY7XHJcbiAgICAgIGxvID0gdyAqIDB4NDAgKyAoKGxvIC8gMHg0MDAwMDAwKSB8IDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEZhc3QgbGVuZ3RoIHJlZHVjdGlvblxyXG4gICAgaWYgKG51bS53b3Jkc1tudW0ubGVuZ3RoIC0gMV0gPT09IDApIHtcclxuICAgICAgbnVtLmxlbmd0aC0tO1xyXG4gICAgICBpZiAobnVtLndvcmRzW251bS5sZW5ndGggLSAxXSA9PT0gMCkge1xyXG4gICAgICAgIG51bS5sZW5ndGgtLTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBQMjI0ICgpIHtcclxuICAgIE1QcmltZS5jYWxsKFxyXG4gICAgICB0aGlzLFxyXG4gICAgICAncDIyNCcsXHJcbiAgICAgICdmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMScpO1xyXG4gIH1cclxuICBpbmhlcml0cyhQMjI0LCBNUHJpbWUpO1xyXG5cclxuICBmdW5jdGlvbiBQMTkyICgpIHtcclxuICAgIE1QcmltZS5jYWxsKFxyXG4gICAgICB0aGlzLFxyXG4gICAgICAncDE5MicsXHJcbiAgICAgICdmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZSBmZmZmZmZmZiBmZmZmZmZmZicpO1xyXG4gIH1cclxuICBpbmhlcml0cyhQMTkyLCBNUHJpbWUpO1xyXG5cclxuICBmdW5jdGlvbiBQMjU1MTkgKCkge1xyXG4gICAgLy8gMiBeIDI1NSAtIDE5XHJcbiAgICBNUHJpbWUuY2FsbChcclxuICAgICAgdGhpcyxcclxuICAgICAgJzI1NTE5JyxcclxuICAgICAgJzdmZmZmZmZmZmZmZmZmZmYgZmZmZmZmZmZmZmZmZmZmZiBmZmZmZmZmZmZmZmZmZmZmIGZmZmZmZmZmZmZmZmZmZWQnKTtcclxuICB9XHJcbiAgaW5oZXJpdHMoUDI1NTE5LCBNUHJpbWUpO1xyXG5cclxuICBQMjU1MTkucHJvdG90eXBlLmltdWxLID0gZnVuY3Rpb24gaW11bEsgKG51bSkge1xyXG4gICAgLy8gSyA9IDB4MTNcclxuICAgIHZhciBjYXJyeSA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bS5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgaGkgPSAobnVtLndvcmRzW2ldIHwgMCkgKiAweDEzICsgY2Fycnk7XHJcbiAgICAgIHZhciBsbyA9IGhpICYgMHgzZmZmZmZmO1xyXG4gICAgICBoaSA+Pj49IDI2O1xyXG5cclxuICAgICAgbnVtLndvcmRzW2ldID0gbG87XHJcbiAgICAgIGNhcnJ5ID0gaGk7XHJcbiAgICB9XHJcbiAgICBpZiAoY2FycnkgIT09IDApIHtcclxuICAgICAgbnVtLndvcmRzW251bS5sZW5ndGgrK10gPSBjYXJyeTtcclxuICAgIH1cclxuICAgIHJldHVybiBudW07XHJcbiAgfTtcclxuXHJcbiAgLy8gRXhwb3J0ZWQgbW9zdGx5IGZvciB0ZXN0aW5nIHB1cnBvc2VzLCB1c2UgcGxhaW4gbmFtZSBpbnN0ZWFkXHJcbiAgQk4uX3ByaW1lID0gZnVuY3Rpb24gcHJpbWUgKG5hbWUpIHtcclxuICAgIC8vIENhY2hlZCB2ZXJzaW9uIG9mIHByaW1lXHJcbiAgICBpZiAocHJpbWVzW25hbWVdKSByZXR1cm4gcHJpbWVzW25hbWVdO1xyXG5cclxuICAgIHZhciBwcmltZTtcclxuICAgIGlmIChuYW1lID09PSAnazI1NicpIHtcclxuICAgICAgcHJpbWUgPSBuZXcgSzI1NigpO1xyXG4gICAgfSBlbHNlIGlmIChuYW1lID09PSAncDIyNCcpIHtcclxuICAgICAgcHJpbWUgPSBuZXcgUDIyNCgpO1xyXG4gICAgfSBlbHNlIGlmIChuYW1lID09PSAncDE5MicpIHtcclxuICAgICAgcHJpbWUgPSBuZXcgUDE5MigpO1xyXG4gICAgfSBlbHNlIGlmIChuYW1lID09PSAncDI1NTE5Jykge1xyXG4gICAgICBwcmltZSA9IG5ldyBQMjU1MTkoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBwcmltZSAnICsgbmFtZSk7XHJcbiAgICB9XHJcbiAgICBwcmltZXNbbmFtZV0gPSBwcmltZTtcclxuXHJcbiAgICByZXR1cm4gcHJpbWU7XHJcbiAgfTtcclxuXHJcbiAgLy9cclxuICAvLyBCYXNlIHJlZHVjdGlvbiBlbmdpbmVcclxuICAvL1xyXG4gIGZ1bmN0aW9uIFJlZCAobSkge1xyXG4gICAgaWYgKHR5cGVvZiBtID09PSAnc3RyaW5nJykge1xyXG4gICAgICB2YXIgcHJpbWUgPSBCTi5fcHJpbWUobSk7XHJcbiAgICAgIHRoaXMubSA9IHByaW1lLnA7XHJcbiAgICAgIHRoaXMucHJpbWUgPSBwcmltZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFzc2VydChtLmd0bigxKSwgJ21vZHVsdXMgbXVzdCBiZSBncmVhdGVyIHRoYW4gMScpO1xyXG4gICAgICB0aGlzLm0gPSBtO1xyXG4gICAgICB0aGlzLnByaW1lID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIFJlZC5wcm90b3R5cGUuX3ZlcmlmeTEgPSBmdW5jdGlvbiBfdmVyaWZ5MSAoYSkge1xyXG4gICAgYXNzZXJ0KGEubmVnYXRpdmUgPT09IDAsICdyZWQgd29ya3Mgb25seSB3aXRoIHBvc2l0aXZlcycpO1xyXG4gICAgYXNzZXJ0KGEucmVkLCAncmVkIHdvcmtzIG9ubHkgd2l0aCByZWQgbnVtYmVycycpO1xyXG4gIH07XHJcblxyXG4gIFJlZC5wcm90b3R5cGUuX3ZlcmlmeTIgPSBmdW5jdGlvbiBfdmVyaWZ5MiAoYSwgYikge1xyXG4gICAgYXNzZXJ0KChhLm5lZ2F0aXZlIHwgYi5uZWdhdGl2ZSkgPT09IDAsICdyZWQgd29ya3Mgb25seSB3aXRoIHBvc2l0aXZlcycpO1xyXG4gICAgYXNzZXJ0KGEucmVkICYmIGEucmVkID09PSBiLnJlZCxcclxuICAgICAgJ3JlZCB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcclxuICB9O1xyXG5cclxuICBSZWQucHJvdG90eXBlLmltb2QgPSBmdW5jdGlvbiBpbW9kIChhKSB7XHJcbiAgICBpZiAodGhpcy5wcmltZSkgcmV0dXJuIHRoaXMucHJpbWUuaXJlZHVjZShhKS5fZm9yY2VSZWQodGhpcyk7XHJcbiAgICByZXR1cm4gYS51bW9kKHRoaXMubSkuX2ZvcmNlUmVkKHRoaXMpO1xyXG4gIH07XHJcblxyXG4gIFJlZC5wcm90b3R5cGUubmVnID0gZnVuY3Rpb24gbmVnIChhKSB7XHJcbiAgICBpZiAoYS5pc1plcm8oKSkge1xyXG4gICAgICByZXR1cm4gYS5jbG9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLm0uc3ViKGEpLl9mb3JjZVJlZCh0aGlzKTtcclxuICB9O1xyXG5cclxuICBSZWQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZCAoYSwgYikge1xyXG4gICAgdGhpcy5fdmVyaWZ5MihhLCBiKTtcclxuXHJcbiAgICB2YXIgcmVzID0gYS5hZGQoYik7XHJcbiAgICBpZiAocmVzLmNtcCh0aGlzLm0pID49IDApIHtcclxuICAgICAgcmVzLmlzdWIodGhpcy5tKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXMuX2ZvcmNlUmVkKHRoaXMpO1xyXG4gIH07XHJcblxyXG4gIFJlZC5wcm90b3R5cGUuaWFkZCA9IGZ1bmN0aW9uIGlhZGQgKGEsIGIpIHtcclxuICAgIHRoaXMuX3ZlcmlmeTIoYSwgYik7XHJcblxyXG4gICAgdmFyIHJlcyA9IGEuaWFkZChiKTtcclxuICAgIGlmIChyZXMuY21wKHRoaXMubSkgPj0gMCkge1xyXG4gICAgICByZXMuaXN1Yih0aGlzLm0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcztcclxuICB9O1xyXG5cclxuICBSZWQucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uIHN1YiAoYSwgYikge1xyXG4gICAgdGhpcy5fdmVyaWZ5MihhLCBiKTtcclxuXHJcbiAgICB2YXIgcmVzID0gYS5zdWIoYik7XHJcbiAgICBpZiAocmVzLmNtcG4oMCkgPCAwKSB7XHJcbiAgICAgIHJlcy5pYWRkKHRoaXMubSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzLl9mb3JjZVJlZCh0aGlzKTtcclxuICB9O1xyXG5cclxuICBSZWQucHJvdG90eXBlLmlzdWIgPSBmdW5jdGlvbiBpc3ViIChhLCBiKSB7XHJcbiAgICB0aGlzLl92ZXJpZnkyKGEsIGIpO1xyXG5cclxuICAgIHZhciByZXMgPSBhLmlzdWIoYik7XHJcbiAgICBpZiAocmVzLmNtcG4oMCkgPCAwKSB7XHJcbiAgICAgIHJlcy5pYWRkKHRoaXMubSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIH07XHJcblxyXG4gIFJlZC5wcm90b3R5cGUuc2hsID0gZnVuY3Rpb24gc2hsIChhLCBudW0pIHtcclxuICAgIHRoaXMuX3ZlcmlmeTEoYSk7XHJcbiAgICByZXR1cm4gdGhpcy5pbW9kKGEudXNobG4obnVtKSk7XHJcbiAgfTtcclxuXHJcbiAgUmVkLnByb3RvdHlwZS5pbXVsID0gZnVuY3Rpb24gaW11bCAoYSwgYikge1xyXG4gICAgdGhpcy5fdmVyaWZ5MihhLCBiKTtcclxuICAgIHJldHVybiB0aGlzLmltb2QoYS5pbXVsKGIpKTtcclxuICB9O1xyXG5cclxuICBSZWQucHJvdG90eXBlLm11bCA9IGZ1bmN0aW9uIG11bCAoYSwgYikge1xyXG4gICAgdGhpcy5fdmVyaWZ5MihhLCBiKTtcclxuICAgIHJldHVybiB0aGlzLmltb2QoYS5tdWwoYikpO1xyXG4gIH07XHJcblxyXG4gIFJlZC5wcm90b3R5cGUuaXNxciA9IGZ1bmN0aW9uIGlzcXIgKGEpIHtcclxuICAgIHJldHVybiB0aGlzLmltdWwoYSwgYS5jbG9uZSgpKTtcclxuICB9O1xyXG5cclxuICBSZWQucHJvdG90eXBlLnNxciA9IGZ1bmN0aW9uIHNxciAoYSkge1xyXG4gICAgcmV0dXJuIHRoaXMubXVsKGEsIGEpO1xyXG4gIH07XHJcblxyXG4gIFJlZC5wcm90b3R5cGUuc3FydCA9IGZ1bmN0aW9uIHNxcnQgKGEpIHtcclxuICAgIGlmIChhLmlzWmVybygpKSByZXR1cm4gYS5jbG9uZSgpO1xyXG5cclxuICAgIHZhciBtb2QzID0gdGhpcy5tLmFuZGxuKDMpO1xyXG4gICAgYXNzZXJ0KG1vZDMgJSAyID09PSAxKTtcclxuXHJcbiAgICAvLyBGYXN0IGNhc2VcclxuICAgIGlmIChtb2QzID09PSAzKSB7XHJcbiAgICAgIHZhciBwb3cgPSB0aGlzLm0uYWRkKG5ldyBCTigxKSkuaXVzaHJuKDIpO1xyXG4gICAgICByZXR1cm4gdGhpcy5wb3coYSwgcG93KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUb25lbGxpLVNoYW5rcyBhbGdvcml0aG0gKFRvdGFsbHkgdW5vcHRpbWl6ZWQgYW5kIHNsb3cpXHJcbiAgICAvL1xyXG4gICAgLy8gRmluZCBRIGFuZCBTLCB0aGF0IFEgKiAyIF4gUyA9IChQIC0gMSlcclxuICAgIHZhciBxID0gdGhpcy5tLnN1Ym4oMSk7XHJcbiAgICB2YXIgcyA9IDA7XHJcbiAgICB3aGlsZSAoIXEuaXNaZXJvKCkgJiYgcS5hbmRsbigxKSA9PT0gMCkge1xyXG4gICAgICBzKys7XHJcbiAgICAgIHEuaXVzaHJuKDEpO1xyXG4gICAgfVxyXG4gICAgYXNzZXJ0KCFxLmlzWmVybygpKTtcclxuXHJcbiAgICB2YXIgb25lID0gbmV3IEJOKDEpLnRvUmVkKHRoaXMpO1xyXG4gICAgdmFyIG5PbmUgPSBvbmUucmVkTmVnKCk7XHJcblxyXG4gICAgLy8gRmluZCBxdWFkcmF0aWMgbm9uLXJlc2lkdWVcclxuICAgIC8vIE5PVEU6IE1heCBpcyBzdWNoIGJlY2F1c2Ugb2YgZ2VuZXJhbGl6ZWQgUmllbWFubiBoeXBvdGhlc2lzLlxyXG4gICAgdmFyIGxwb3cgPSB0aGlzLm0uc3VibigxKS5pdXNocm4oMSk7XHJcbiAgICB2YXIgeiA9IHRoaXMubS5iaXRMZW5ndGgoKTtcclxuICAgIHogPSBuZXcgQk4oMiAqIHogKiB6KS50b1JlZCh0aGlzKTtcclxuXHJcbiAgICB3aGlsZSAodGhpcy5wb3coeiwgbHBvdykuY21wKG5PbmUpICE9PSAwKSB7XHJcbiAgICAgIHoucmVkSUFkZChuT25lKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgYyA9IHRoaXMucG93KHosIHEpO1xyXG4gICAgdmFyIHIgPSB0aGlzLnBvdyhhLCBxLmFkZG4oMSkuaXVzaHJuKDEpKTtcclxuICAgIHZhciB0ID0gdGhpcy5wb3coYSwgcSk7XHJcbiAgICB2YXIgbSA9IHM7XHJcbiAgICB3aGlsZSAodC5jbXAob25lKSAhPT0gMCkge1xyXG4gICAgICB2YXIgdG1wID0gdDtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IHRtcC5jbXAob25lKSAhPT0gMDsgaSsrKSB7XHJcbiAgICAgICAgdG1wID0gdG1wLnJlZFNxcigpO1xyXG4gICAgICB9XHJcbiAgICAgIGFzc2VydChpIDwgbSk7XHJcbiAgICAgIHZhciBiID0gdGhpcy5wb3coYywgbmV3IEJOKDEpLml1c2hsbihtIC0gaSAtIDEpKTtcclxuXHJcbiAgICAgIHIgPSByLnJlZE11bChiKTtcclxuICAgICAgYyA9IGIucmVkU3FyKCk7XHJcbiAgICAgIHQgPSB0LnJlZE11bChjKTtcclxuICAgICAgbSA9IGk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHI7XHJcbiAgfTtcclxuXHJcbiAgUmVkLnByb3RvdHlwZS5pbnZtID0gZnVuY3Rpb24gaW52bSAoYSkge1xyXG4gICAgdmFyIGludiA9IGEuX2ludm1wKHRoaXMubSk7XHJcbiAgICBpZiAoaW52Lm5lZ2F0aXZlICE9PSAwKSB7XHJcbiAgICAgIGludi5uZWdhdGl2ZSA9IDA7XHJcbiAgICAgIHJldHVybiB0aGlzLmltb2QoaW52KS5yZWROZWcoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmltb2QoaW52KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBSZWQucHJvdG90eXBlLnBvdyA9IGZ1bmN0aW9uIHBvdyAoYSwgbnVtKSB7XHJcbiAgICBpZiAobnVtLmlzWmVybygpKSByZXR1cm4gbmV3IEJOKDEpLnRvUmVkKHRoaXMpO1xyXG4gICAgaWYgKG51bS5jbXBuKDEpID09PSAwKSByZXR1cm4gYS5jbG9uZSgpO1xyXG5cclxuICAgIHZhciB3aW5kb3dTaXplID0gNDtcclxuICAgIHZhciB3bmQgPSBuZXcgQXJyYXkoMSA8PCB3aW5kb3dTaXplKTtcclxuICAgIHduZFswXSA9IG5ldyBCTigxKS50b1JlZCh0aGlzKTtcclxuICAgIHduZFsxXSA9IGE7XHJcbiAgICBmb3IgKHZhciBpID0gMjsgaSA8IHduZC5sZW5ndGg7IGkrKykge1xyXG4gICAgICB3bmRbaV0gPSB0aGlzLm11bCh3bmRbaSAtIDFdLCBhKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmVzID0gd25kWzBdO1xyXG4gICAgdmFyIGN1cnJlbnQgPSAwO1xyXG4gICAgdmFyIGN1cnJlbnRMZW4gPSAwO1xyXG4gICAgdmFyIHN0YXJ0ID0gbnVtLmJpdExlbmd0aCgpICUgMjY7XHJcbiAgICBpZiAoc3RhcnQgPT09IDApIHtcclxuICAgICAgc3RhcnQgPSAyNjtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSBudW0ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgdmFyIHdvcmQgPSBudW0ud29yZHNbaV07XHJcbiAgICAgIGZvciAodmFyIGogPSBzdGFydCAtIDE7IGogPj0gMDsgai0tKSB7XHJcbiAgICAgICAgdmFyIGJpdCA9ICh3b3JkID4+IGopICYgMTtcclxuICAgICAgICBpZiAocmVzICE9PSB3bmRbMF0pIHtcclxuICAgICAgICAgIHJlcyA9IHRoaXMuc3FyKHJlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYml0ID09PSAwICYmIGN1cnJlbnQgPT09IDApIHtcclxuICAgICAgICAgIGN1cnJlbnRMZW4gPSAwO1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjdXJyZW50IDw8PSAxO1xyXG4gICAgICAgIGN1cnJlbnQgfD0gYml0O1xyXG4gICAgICAgIGN1cnJlbnRMZW4rKztcclxuICAgICAgICBpZiAoY3VycmVudExlbiAhPT0gd2luZG93U2l6ZSAmJiAoaSAhPT0gMCB8fCBqICE9PSAwKSkgY29udGludWU7XHJcblxyXG4gICAgICAgIHJlcyA9IHRoaXMubXVsKHJlcywgd25kW2N1cnJlbnRdKTtcclxuICAgICAgICBjdXJyZW50TGVuID0gMDtcclxuICAgICAgICBjdXJyZW50ID0gMDtcclxuICAgICAgfVxyXG4gICAgICBzdGFydCA9IDI2O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXM7XHJcbiAgfTtcclxuXHJcbiAgUmVkLnByb3RvdHlwZS5jb252ZXJ0VG8gPSBmdW5jdGlvbiBjb252ZXJ0VG8gKG51bSkge1xyXG4gICAgdmFyIHIgPSBudW0udW1vZCh0aGlzLm0pO1xyXG5cclxuICAgIHJldHVybiByID09PSBudW0gPyByLmNsb25lKCkgOiByO1xyXG4gIH07XHJcblxyXG4gIFJlZC5wcm90b3R5cGUuY29udmVydEZyb20gPSBmdW5jdGlvbiBjb252ZXJ0RnJvbSAobnVtKSB7XHJcbiAgICB2YXIgcmVzID0gbnVtLmNsb25lKCk7XHJcbiAgICByZXMucmVkID0gbnVsbDtcclxuICAgIHJldHVybiByZXM7XHJcbiAgfTtcclxuXHJcbiAgLy9cclxuICAvLyBNb250Z29tZXJ5IG1ldGhvZCBlbmdpbmVcclxuICAvL1xyXG5cclxuICBCTi5tb250ID0gZnVuY3Rpb24gbW9udCAobnVtKSB7XHJcbiAgICByZXR1cm4gbmV3IE1vbnQobnVtKTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBNb250IChtKSB7XHJcbiAgICBSZWQuY2FsbCh0aGlzLCBtKTtcclxuXHJcbiAgICB0aGlzLnNoaWZ0ID0gdGhpcy5tLmJpdExlbmd0aCgpO1xyXG4gICAgaWYgKHRoaXMuc2hpZnQgJSAyNiAhPT0gMCkge1xyXG4gICAgICB0aGlzLnNoaWZ0ICs9IDI2IC0gKHRoaXMuc2hpZnQgJSAyNik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yID0gbmV3IEJOKDEpLml1c2hsbih0aGlzLnNoaWZ0KTtcclxuICAgIHRoaXMucjIgPSB0aGlzLmltb2QodGhpcy5yLnNxcigpKTtcclxuICAgIHRoaXMucmludiA9IHRoaXMuci5faW52bXAodGhpcy5tKTtcclxuXHJcbiAgICB0aGlzLm1pbnYgPSB0aGlzLnJpbnYubXVsKHRoaXMucikuaXN1Ym4oMSkuZGl2KHRoaXMubSk7XHJcbiAgICB0aGlzLm1pbnYgPSB0aGlzLm1pbnYudW1vZCh0aGlzLnIpO1xyXG4gICAgdGhpcy5taW52ID0gdGhpcy5yLnN1Yih0aGlzLm1pbnYpO1xyXG4gIH1cclxuICBpbmhlcml0cyhNb250LCBSZWQpO1xyXG5cclxuICBNb250LnByb3RvdHlwZS5jb252ZXJ0VG8gPSBmdW5jdGlvbiBjb252ZXJ0VG8gKG51bSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaW1vZChudW0udXNobG4odGhpcy5zaGlmdCkpO1xyXG4gIH07XHJcblxyXG4gIE1vbnQucHJvdG90eXBlLmNvbnZlcnRGcm9tID0gZnVuY3Rpb24gY29udmVydEZyb20gKG51bSkge1xyXG4gICAgdmFyIHIgPSB0aGlzLmltb2QobnVtLm11bCh0aGlzLnJpbnYpKTtcclxuICAgIHIucmVkID0gbnVsbDtcclxuICAgIHJldHVybiByO1xyXG4gIH07XHJcblxyXG4gIE1vbnQucHJvdG90eXBlLmltdWwgPSBmdW5jdGlvbiBpbXVsIChhLCBiKSB7XHJcbiAgICBpZiAoYS5pc1plcm8oKSB8fCBiLmlzWmVybygpKSB7XHJcbiAgICAgIGEud29yZHNbMF0gPSAwO1xyXG4gICAgICBhLmxlbmd0aCA9IDE7XHJcbiAgICAgIHJldHVybiBhO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB0ID0gYS5pbXVsKGIpO1xyXG4gICAgdmFyIGMgPSB0Lm1hc2tuKHRoaXMuc2hpZnQpLm11bCh0aGlzLm1pbnYpLmltYXNrbih0aGlzLnNoaWZ0KS5tdWwodGhpcy5tKTtcclxuICAgIHZhciB1ID0gdC5pc3ViKGMpLml1c2hybih0aGlzLnNoaWZ0KTtcclxuICAgIHZhciByZXMgPSB1O1xyXG5cclxuICAgIGlmICh1LmNtcCh0aGlzLm0pID49IDApIHtcclxuICAgICAgcmVzID0gdS5pc3ViKHRoaXMubSk7XHJcbiAgICB9IGVsc2UgaWYgKHUuY21wbigwKSA8IDApIHtcclxuICAgICAgcmVzID0gdS5pYWRkKHRoaXMubSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlcy5fZm9yY2VSZWQodGhpcyk7XHJcbiAgfTtcclxuXHJcbiAgTW9udC5wcm90b3R5cGUubXVsID0gZnVuY3Rpb24gbXVsIChhLCBiKSB7XHJcbiAgICBpZiAoYS5pc1plcm8oKSB8fCBiLmlzWmVybygpKSByZXR1cm4gbmV3IEJOKDApLl9mb3JjZVJlZCh0aGlzKTtcclxuXHJcbiAgICB2YXIgdCA9IGEubXVsKGIpO1xyXG4gICAgdmFyIGMgPSB0Lm1hc2tuKHRoaXMuc2hpZnQpLm11bCh0aGlzLm1pbnYpLmltYXNrbih0aGlzLnNoaWZ0KS5tdWwodGhpcy5tKTtcclxuICAgIHZhciB1ID0gdC5pc3ViKGMpLml1c2hybih0aGlzLnNoaWZ0KTtcclxuICAgIHZhciByZXMgPSB1O1xyXG4gICAgaWYgKHUuY21wKHRoaXMubSkgPj0gMCkge1xyXG4gICAgICByZXMgPSB1LmlzdWIodGhpcy5tKTtcclxuICAgIH0gZWxzZSBpZiAodS5jbXBuKDApIDwgMCkge1xyXG4gICAgICByZXMgPSB1LmlhZGQodGhpcy5tKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzLl9mb3JjZVJlZCh0aGlzKTtcclxuICB9O1xyXG5cclxuICBNb250LnByb3RvdHlwZS5pbnZtID0gZnVuY3Rpb24gaW52bSAoYSkge1xyXG4gICAgLy8gKEFSKV4tMSAqIFJeMiA9IChBXi0xICogUl4tMSkgKiBSXjIgPSBBXi0xICogUlxyXG4gICAgdmFyIHJlcyA9IHRoaXMuaW1vZChhLl9pbnZtcCh0aGlzLm0pLm11bCh0aGlzLnIyKSk7XHJcbiAgICByZXR1cm4gcmVzLl9mb3JjZVJlZCh0aGlzKTtcclxuICB9O1xyXG59KSh0eXBlb2YgbW9kdWxlID09PSAndW5kZWZpbmVkJyB8fCBtb2R1bGUsIHRoaXMpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9