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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYm4uanMvbGliL2JuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsbUJBQU8sQ0FBQyxlQUFRO0FBQzdCLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsUUFBUTtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsd0JBQXdCLG1CQUFtQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFNBQVM7QUFDaEM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLFlBQVk7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsU0FBUztBQUNoQzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNDQUFzQyxzQkFBc0I7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLFNBQVM7QUFDaEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixpQkFBaUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTs7QUFFQSxpQkFBaUIsYUFBYTtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsaUJBQWlCLGFBQWE7QUFDOUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFlBQVksZUFBZTtBQUMzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxxQkFBcUIsZ0JBQWdCO0FBQ3JDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxtQkFBbUIsY0FBYztBQUNqQztBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsY0FBYztBQUNqQztBQUNBOztBQUVBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsY0FBYztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsNkJBQTZCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsWUFBWSxjQUFjO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGNBQWM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLDZCQUE2QjtBQUN2QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsU0FBUztBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELFdBQVc7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsb0JBQW9CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxXQUFXO0FBQy9EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG1CQUFtQixPQUFPO0FBQzFCOztBQUVBO0FBQ0E7O0FBRUEscUJBQXFCLE9BQU87QUFDNUI7QUFDQTs7QUFFQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLEdBQUc7QUFDMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsbUJBQW1CLFdBQVc7QUFDOUI7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLFdBQVc7QUFDOUI7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixTQUFTO0FBQzVCOztBQUVBLGtDQUFrQztBQUNsQyxzQ0FBc0M7QUFDdEM7O0FBRUE7QUFDQSxxQkFBcUIsT0FBTztBQUM1QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLE9BQU87QUFDMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxtQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGlCQUFpQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsY0FBYztBQUNqQztBQUNBOztBQUVBO0FBQ0EsNkJBQTZCLGNBQWM7QUFDM0M7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsaUJBQWlCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtCQUErQixRQUFRO0FBQ3ZDO0FBQ0E7O0FBRUEsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLE9BQU87QUFDNUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGlCQUFpQixpQkFBaUI7QUFDbEM7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkIsbUNBQW1DO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQiwrQ0FBK0M7QUFDbEU7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EscUJBQXFCLHNDQUFzQztBQUMzRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGVBQWUsZ0JBQWdCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUseUJBQXlCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsaUJBQWlCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixjQUFjO0FBQ25DO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsUUFBUTtBQUMvQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQ0FBaUMsUUFBUTtBQUN6QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUNBQWlDLFFBQVE7QUFDekM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCLG1DQUFtQztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2QkFBNkIsbUNBQW1DO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsNkJBQTZCLG1DQUFtQztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDZCQUE2QixtQ0FBbUM7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLDBCQUEwQjtBQUNqRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsZ0NBQWdDO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQ0FBaUMsUUFBUTtBQUN6QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLGtCQUFrQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLG9CQUFvQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUE0QixRQUFRO0FBQ3BDO0FBQ0EsNkJBQTZCLFFBQVE7QUFDckM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBRSxNQUE2QiIsImZpbGUiOiJ2ZW5kb3IvdmVuZG9yLmJuLmpzLjIzMmViY2YwMWFhNzI1Yjg2MzE2LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChtb2R1bGUsIGV4cG9ydHMpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFV0aWxzXG4gIGZ1bmN0aW9uIGFzc2VydCAodmFsLCBtc2cpIHtcbiAgICBpZiAoIXZhbCkgdGhyb3cgbmV3IEVycm9yKG1zZyB8fCAnQXNzZXJ0aW9uIGZhaWxlZCcpO1xuICB9XG5cbiAgLy8gQ291bGQgdXNlIGBpbmhlcml0c2AgbW9kdWxlLCBidXQgZG9uJ3Qgd2FudCB0byBtb3ZlIGZyb20gc2luZ2xlIGZpbGVcbiAgLy8gYXJjaGl0ZWN0dXJlIHlldC5cbiAgZnVuY3Rpb24gaW5oZXJpdHMgKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yO1xuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGU7XG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKTtcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3I7XG4gIH1cblxuICAvLyBCTlxuXG4gIGZ1bmN0aW9uIEJOIChudW1iZXIsIGJhc2UsIGVuZGlhbikge1xuICAgIGlmIChCTi5pc0JOKG51bWJlcikpIHtcbiAgICAgIHJldHVybiBudW1iZXI7XG4gICAgfVxuXG4gICAgdGhpcy5uZWdhdGl2ZSA9IDA7XG4gICAgdGhpcy53b3JkcyA9IG51bGw7XG4gICAgdGhpcy5sZW5ndGggPSAwO1xuXG4gICAgLy8gUmVkdWN0aW9uIGNvbnRleHRcbiAgICB0aGlzLnJlZCA9IG51bGw7XG5cbiAgICBpZiAobnVtYmVyICE9PSBudWxsKSB7XG4gICAgICBpZiAoYmFzZSA9PT0gJ2xlJyB8fCBiYXNlID09PSAnYmUnKSB7XG4gICAgICAgIGVuZGlhbiA9IGJhc2U7XG4gICAgICAgIGJhc2UgPSAxMDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5faW5pdChudW1iZXIgfHwgMCwgYmFzZSB8fCAxMCwgZW5kaWFuIHx8ICdiZScpO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEJOO1xuICB9IGVsc2Uge1xuICAgIGV4cG9ydHMuQk4gPSBCTjtcbiAgfVxuXG4gIEJOLkJOID0gQk47XG4gIEJOLndvcmRTaXplID0gMjY7XG5cbiAgdmFyIEJ1ZmZlcjtcbiAgdHJ5IHtcbiAgICBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgfVxuXG4gIEJOLmlzQk4gPSBmdW5jdGlvbiBpc0JOIChudW0pIHtcbiAgICBpZiAobnVtIGluc3RhbmNlb2YgQk4pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBudW0gIT09IG51bGwgJiYgdHlwZW9mIG51bSA9PT0gJ29iamVjdCcgJiZcbiAgICAgIG51bS5jb25zdHJ1Y3Rvci53b3JkU2l6ZSA9PT0gQk4ud29yZFNpemUgJiYgQXJyYXkuaXNBcnJheShudW0ud29yZHMpO1xuICB9O1xuXG4gIEJOLm1heCA9IGZ1bmN0aW9uIG1heCAobGVmdCwgcmlnaHQpIHtcbiAgICBpZiAobGVmdC5jbXAocmlnaHQpID4gMCkgcmV0dXJuIGxlZnQ7XG4gICAgcmV0dXJuIHJpZ2h0O1xuICB9O1xuXG4gIEJOLm1pbiA9IGZ1bmN0aW9uIG1pbiAobGVmdCwgcmlnaHQpIHtcbiAgICBpZiAobGVmdC5jbXAocmlnaHQpIDwgMCkgcmV0dXJuIGxlZnQ7XG4gICAgcmV0dXJuIHJpZ2h0O1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uIGluaXQgKG51bWJlciwgYmFzZSwgZW5kaWFuKSB7XG4gICAgaWYgKHR5cGVvZiBudW1iZXIgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy5faW5pdE51bWJlcihudW1iZXIsIGJhc2UsIGVuZGlhbik7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBudW1iZXIgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gdGhpcy5faW5pdEFycmF5KG51bWJlciwgYmFzZSwgZW5kaWFuKTtcbiAgICB9XG5cbiAgICBpZiAoYmFzZSA9PT0gJ2hleCcpIHtcbiAgICAgIGJhc2UgPSAxNjtcbiAgICB9XG4gICAgYXNzZXJ0KGJhc2UgPT09IChiYXNlIHwgMCkgJiYgYmFzZSA+PSAyICYmIGJhc2UgPD0gMzYpO1xuXG4gICAgbnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxzKy9nLCAnJyk7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBpZiAobnVtYmVyWzBdID09PSAnLScpIHtcbiAgICAgIHN0YXJ0Kys7XG4gICAgfVxuXG4gICAgaWYgKGJhc2UgPT09IDE2KSB7XG4gICAgICB0aGlzLl9wYXJzZUhleChudW1iZXIsIHN0YXJ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcGFyc2VCYXNlKG51bWJlciwgYmFzZSwgc3RhcnQpO1xuICAgIH1cblxuICAgIGlmIChudW1iZXJbMF0gPT09ICctJykge1xuICAgICAgdGhpcy5uZWdhdGl2ZSA9IDE7XG4gICAgfVxuXG4gICAgdGhpcy5zdHJpcCgpO1xuXG4gICAgaWYgKGVuZGlhbiAhPT0gJ2xlJykgcmV0dXJuO1xuXG4gICAgdGhpcy5faW5pdEFycmF5KHRoaXMudG9BcnJheSgpLCBiYXNlLCBlbmRpYW4pO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5faW5pdE51bWJlciA9IGZ1bmN0aW9uIF9pbml0TnVtYmVyIChudW1iZXIsIGJhc2UsIGVuZGlhbikge1xuICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMTtcbiAgICAgIG51bWJlciA9IC1udW1iZXI7XG4gICAgfVxuICAgIGlmIChudW1iZXIgPCAweDQwMDAwMDApIHtcbiAgICAgIHRoaXMud29yZHMgPSBbIG51bWJlciAmIDB4M2ZmZmZmZiBdO1xuICAgICAgdGhpcy5sZW5ndGggPSAxO1xuICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMHgxMDAwMDAwMDAwMDAwMCkge1xuICAgICAgdGhpcy53b3JkcyA9IFtcbiAgICAgICAgbnVtYmVyICYgMHgzZmZmZmZmLFxuICAgICAgICAobnVtYmVyIC8gMHg0MDAwMDAwKSAmIDB4M2ZmZmZmZlxuICAgICAgXTtcbiAgICAgIHRoaXMubGVuZ3RoID0gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzZXJ0KG51bWJlciA8IDB4MjAwMDAwMDAwMDAwMDApOyAvLyAyIF4gNTMgKHVuc2FmZSlcbiAgICAgIHRoaXMud29yZHMgPSBbXG4gICAgICAgIG51bWJlciAmIDB4M2ZmZmZmZixcbiAgICAgICAgKG51bWJlciAvIDB4NDAwMDAwMCkgJiAweDNmZmZmZmYsXG4gICAgICAgIDFcbiAgICAgIF07XG4gICAgICB0aGlzLmxlbmd0aCA9IDM7XG4gICAgfVxuXG4gICAgaWYgKGVuZGlhbiAhPT0gJ2xlJykgcmV0dXJuO1xuXG4gICAgLy8gUmV2ZXJzZSB0aGUgYnl0ZXNcbiAgICB0aGlzLl9pbml0QXJyYXkodGhpcy50b0FycmF5KCksIGJhc2UsIGVuZGlhbik7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLl9pbml0QXJyYXkgPSBmdW5jdGlvbiBfaW5pdEFycmF5IChudW1iZXIsIGJhc2UsIGVuZGlhbikge1xuICAgIC8vIFBlcmhhcHMgYSBVaW50OEFycmF5XG4gICAgYXNzZXJ0KHR5cGVvZiBudW1iZXIubGVuZ3RoID09PSAnbnVtYmVyJyk7XG4gICAgaWYgKG51bWJlci5sZW5ndGggPD0gMCkge1xuICAgICAgdGhpcy53b3JkcyA9IFsgMCBdO1xuICAgICAgdGhpcy5sZW5ndGggPSAxO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhpcy5sZW5ndGggPSBNYXRoLmNlaWwobnVtYmVyLmxlbmd0aCAvIDMpO1xuICAgIHRoaXMud29yZHMgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy53b3Jkc1tpXSA9IDA7XG4gICAgfVxuXG4gICAgdmFyIGosIHc7XG4gICAgdmFyIG9mZiA9IDA7XG4gICAgaWYgKGVuZGlhbiA9PT0gJ2JlJykge1xuICAgICAgZm9yIChpID0gbnVtYmVyLmxlbmd0aCAtIDEsIGogPSAwOyBpID49IDA7IGkgLT0gMykge1xuICAgICAgICB3ID0gbnVtYmVyW2ldIHwgKG51bWJlcltpIC0gMV0gPDwgOCkgfCAobnVtYmVyW2kgLSAyXSA8PCAxNik7XG4gICAgICAgIHRoaXMud29yZHNbal0gfD0gKHcgPDwgb2ZmKSAmIDB4M2ZmZmZmZjtcbiAgICAgICAgdGhpcy53b3Jkc1tqICsgMV0gPSAodyA+Pj4gKDI2IC0gb2ZmKSkgJiAweDNmZmZmZmY7XG4gICAgICAgIG9mZiArPSAyNDtcbiAgICAgICAgaWYgKG9mZiA+PSAyNikge1xuICAgICAgICAgIG9mZiAtPSAyNjtcbiAgICAgICAgICBqKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVuZGlhbiA9PT0gJ2xlJykge1xuICAgICAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBudW1iZXIubGVuZ3RoOyBpICs9IDMpIHtcbiAgICAgICAgdyA9IG51bWJlcltpXSB8IChudW1iZXJbaSArIDFdIDw8IDgpIHwgKG51bWJlcltpICsgMl0gPDwgMTYpO1xuICAgICAgICB0aGlzLndvcmRzW2pdIHw9ICh3IDw8IG9mZikgJiAweDNmZmZmZmY7XG4gICAgICAgIHRoaXMud29yZHNbaiArIDFdID0gKHcgPj4+ICgyNiAtIG9mZikpICYgMHgzZmZmZmZmO1xuICAgICAgICBvZmYgKz0gMjQ7XG4gICAgICAgIGlmIChvZmYgPj0gMjYpIHtcbiAgICAgICAgICBvZmYgLT0gMjY7XG4gICAgICAgICAgaisrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN0cmlwKCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gcGFyc2VIZXggKHN0ciwgc3RhcnQsIGVuZCkge1xuICAgIHZhciByID0gMDtcbiAgICB2YXIgbGVuID0gTWF0aC5taW4oc3RyLmxlbmd0aCwgZW5kKTtcbiAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIGMgPSBzdHIuY2hhckNvZGVBdChpKSAtIDQ4O1xuXG4gICAgICByIDw8PSA0O1xuXG4gICAgICAvLyAnYScgLSAnZidcbiAgICAgIGlmIChjID49IDQ5ICYmIGMgPD0gNTQpIHtcbiAgICAgICAgciB8PSBjIC0gNDkgKyAweGE7XG5cbiAgICAgIC8vICdBJyAtICdGJ1xuICAgICAgfSBlbHNlIGlmIChjID49IDE3ICYmIGMgPD0gMjIpIHtcbiAgICAgICAgciB8PSBjIC0gMTcgKyAweGE7XG5cbiAgICAgIC8vICcwJyAtICc5J1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgciB8PSBjICYgMHhmO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcjtcbiAgfVxuXG4gIEJOLnByb3RvdHlwZS5fcGFyc2VIZXggPSBmdW5jdGlvbiBfcGFyc2VIZXggKG51bWJlciwgc3RhcnQpIHtcbiAgICAvLyBDcmVhdGUgcG9zc2libHkgYmlnZ2VyIGFycmF5IHRvIGVuc3VyZSB0aGF0IGl0IGZpdHMgdGhlIG51bWJlclxuICAgIHRoaXMubGVuZ3RoID0gTWF0aC5jZWlsKChudW1iZXIubGVuZ3RoIC0gc3RhcnQpIC8gNik7XG4gICAgdGhpcy53b3JkcyA9IG5ldyBBcnJheSh0aGlzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLndvcmRzW2ldID0gMDtcbiAgICB9XG5cbiAgICB2YXIgaiwgdztcbiAgICAvLyBTY2FuIDI0LWJpdCBjaHVua3MgYW5kIGFkZCB0aGVtIHRvIHRoZSBudW1iZXJcbiAgICB2YXIgb2ZmID0gMDtcbiAgICBmb3IgKGkgPSBudW1iZXIubGVuZ3RoIC0gNiwgaiA9IDA7IGkgPj0gc3RhcnQ7IGkgLT0gNikge1xuICAgICAgdyA9IHBhcnNlSGV4KG51bWJlciwgaSwgaSArIDYpO1xuICAgICAgdGhpcy53b3Jkc1tqXSB8PSAodyA8PCBvZmYpICYgMHgzZmZmZmZmO1xuICAgICAgLy8gTk9URTogYDB4M2ZmZmZmYCBpcyBpbnRlbnRpb25hbCBoZXJlLCAyNmJpdHMgbWF4IHNoaWZ0ICsgMjRiaXQgaGV4IGxpbWJcbiAgICAgIHRoaXMud29yZHNbaiArIDFdIHw9IHcgPj4+ICgyNiAtIG9mZikgJiAweDNmZmZmZjtcbiAgICAgIG9mZiArPSAyNDtcbiAgICAgIGlmIChvZmYgPj0gMjYpIHtcbiAgICAgICAgb2ZmIC09IDI2O1xuICAgICAgICBqKys7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpICsgNiAhPT0gc3RhcnQpIHtcbiAgICAgIHcgPSBwYXJzZUhleChudW1iZXIsIHN0YXJ0LCBpICsgNik7XG4gICAgICB0aGlzLndvcmRzW2pdIHw9ICh3IDw8IG9mZikgJiAweDNmZmZmZmY7XG4gICAgICB0aGlzLndvcmRzW2ogKyAxXSB8PSB3ID4+PiAoMjYgLSBvZmYpICYgMHgzZmZmZmY7XG4gICAgfVxuICAgIHRoaXMuc3RyaXAoKTtcbiAgfTtcblxuICBmdW5jdGlvbiBwYXJzZUJhc2UgKHN0ciwgc3RhcnQsIGVuZCwgbXVsKSB7XG4gICAgdmFyIHIgPSAwO1xuICAgIHZhciBsZW4gPSBNYXRoLm1pbihzdHIubGVuZ3RoLCBlbmQpO1xuICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgYyA9IHN0ci5jaGFyQ29kZUF0KGkpIC0gNDg7XG5cbiAgICAgIHIgKj0gbXVsO1xuXG4gICAgICAvLyAnYSdcbiAgICAgIGlmIChjID49IDQ5KSB7XG4gICAgICAgIHIgKz0gYyAtIDQ5ICsgMHhhO1xuXG4gICAgICAvLyAnQSdcbiAgICAgIH0gZWxzZSBpZiAoYyA+PSAxNykge1xuICAgICAgICByICs9IGMgLSAxNyArIDB4YTtcblxuICAgICAgLy8gJzAnIC0gJzknXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByICs9IGM7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByO1xuICB9XG5cbiAgQk4ucHJvdG90eXBlLl9wYXJzZUJhc2UgPSBmdW5jdGlvbiBfcGFyc2VCYXNlIChudW1iZXIsIGJhc2UsIHN0YXJ0KSB7XG4gICAgLy8gSW5pdGlhbGl6ZSBhcyB6ZXJvXG4gICAgdGhpcy53b3JkcyA9IFsgMCBdO1xuICAgIHRoaXMubGVuZ3RoID0gMTtcblxuICAgIC8vIEZpbmQgbGVuZ3RoIG9mIGxpbWIgaW4gYmFzZVxuICAgIGZvciAodmFyIGxpbWJMZW4gPSAwLCBsaW1iUG93ID0gMTsgbGltYlBvdyA8PSAweDNmZmZmZmY7IGxpbWJQb3cgKj0gYmFzZSkge1xuICAgICAgbGltYkxlbisrO1xuICAgIH1cbiAgICBsaW1iTGVuLS07XG4gICAgbGltYlBvdyA9IChsaW1iUG93IC8gYmFzZSkgfCAwO1xuXG4gICAgdmFyIHRvdGFsID0gbnVtYmVyLmxlbmd0aCAtIHN0YXJ0O1xuICAgIHZhciBtb2QgPSB0b3RhbCAlIGxpbWJMZW47XG4gICAgdmFyIGVuZCA9IE1hdGgubWluKHRvdGFsLCB0b3RhbCAtIG1vZCkgKyBzdGFydDtcblxuICAgIHZhciB3b3JkID0gMDtcbiAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gbGltYkxlbikge1xuICAgICAgd29yZCA9IHBhcnNlQmFzZShudW1iZXIsIGksIGkgKyBsaW1iTGVuLCBiYXNlKTtcblxuICAgICAgdGhpcy5pbXVsbihsaW1iUG93KTtcbiAgICAgIGlmICh0aGlzLndvcmRzWzBdICsgd29yZCA8IDB4NDAwMDAwMCkge1xuICAgICAgICB0aGlzLndvcmRzWzBdICs9IHdvcmQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9pYWRkbih3b3JkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobW9kICE9PSAwKSB7XG4gICAgICB2YXIgcG93ID0gMTtcbiAgICAgIHdvcmQgPSBwYXJzZUJhc2UobnVtYmVyLCBpLCBudW1iZXIubGVuZ3RoLCBiYXNlKTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IG1vZDsgaSsrKSB7XG4gICAgICAgIHBvdyAqPSBiYXNlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmltdWxuKHBvdyk7XG4gICAgICBpZiAodGhpcy53b3Jkc1swXSArIHdvcmQgPCAweDQwMDAwMDApIHtcbiAgICAgICAgdGhpcy53b3Jkc1swXSArPSB3b3JkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5faWFkZG4od29yZCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAoZGVzdCkge1xuICAgIGRlc3Qud29yZHMgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgZGVzdC53b3Jkc1tpXSA9IHRoaXMud29yZHNbaV07XG4gICAgfVxuICAgIGRlc3QubGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gICAgZGVzdC5uZWdhdGl2ZSA9IHRoaXMubmVnYXRpdmU7XG4gICAgZGVzdC5yZWQgPSB0aGlzLnJlZDtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiBjbG9uZSAoKSB7XG4gICAgdmFyIHIgPSBuZXcgQk4obnVsbCk7XG4gICAgdGhpcy5jb3B5KHIpO1xuICAgIHJldHVybiByO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5fZXhwYW5kID0gZnVuY3Rpb24gX2V4cGFuZCAoc2l6ZSkge1xuICAgIHdoaWxlICh0aGlzLmxlbmd0aCA8IHNpemUpIHtcbiAgICAgIHRoaXMud29yZHNbdGhpcy5sZW5ndGgrK10gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBSZW1vdmUgbGVhZGluZyBgMGAgZnJvbSBgdGhpc2BcbiAgQk4ucHJvdG90eXBlLnN0cmlwID0gZnVuY3Rpb24gc3RyaXAgKCkge1xuICAgIHdoaWxlICh0aGlzLmxlbmd0aCA+IDEgJiYgdGhpcy53b3Jkc1t0aGlzLmxlbmd0aCAtIDFdID09PSAwKSB7XG4gICAgICB0aGlzLmxlbmd0aC0tO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbm9ybVNpZ24oKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuX25vcm1TaWduID0gZnVuY3Rpb24gX25vcm1TaWduICgpIHtcbiAgICAvLyAtMCA9IDBcbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDEgJiYgdGhpcy53b3Jkc1swXSA9PT0gMCkge1xuICAgICAgdGhpcy5uZWdhdGl2ZSA9IDA7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gICAgcmV0dXJuICh0aGlzLnJlZCA/ICc8Qk4tUjogJyA6ICc8Qk46ICcpICsgdGhpcy50b1N0cmluZygxNikgKyAnPic7XG4gIH07XG5cbiAgLypcblxuICB2YXIgemVyb3MgPSBbXTtcbiAgdmFyIGdyb3VwU2l6ZXMgPSBbXTtcbiAgdmFyIGdyb3VwQmFzZXMgPSBbXTtcblxuICB2YXIgcyA9ICcnO1xuICB2YXIgaSA9IC0xO1xuICB3aGlsZSAoKytpIDwgQk4ud29yZFNpemUpIHtcbiAgICB6ZXJvc1tpXSA9IHM7XG4gICAgcyArPSAnMCc7XG4gIH1cbiAgZ3JvdXBTaXplc1swXSA9IDA7XG4gIGdyb3VwU2l6ZXNbMV0gPSAwO1xuICBncm91cEJhc2VzWzBdID0gMDtcbiAgZ3JvdXBCYXNlc1sxXSA9IDA7XG4gIHZhciBiYXNlID0gMiAtIDE7XG4gIHdoaWxlICgrK2Jhc2UgPCAzNiArIDEpIHtcbiAgICB2YXIgZ3JvdXBTaXplID0gMDtcbiAgICB2YXIgZ3JvdXBCYXNlID0gMTtcbiAgICB3aGlsZSAoZ3JvdXBCYXNlIDwgKDEgPDwgQk4ud29yZFNpemUpIC8gYmFzZSkge1xuICAgICAgZ3JvdXBCYXNlICo9IGJhc2U7XG4gICAgICBncm91cFNpemUgKz0gMTtcbiAgICB9XG4gICAgZ3JvdXBTaXplc1tiYXNlXSA9IGdyb3VwU2l6ZTtcbiAgICBncm91cEJhc2VzW2Jhc2VdID0gZ3JvdXBCYXNlO1xuICB9XG5cbiAgKi9cblxuICB2YXIgemVyb3MgPSBbXG4gICAgJycsXG4gICAgJzAnLFxuICAgICcwMCcsXG4gICAgJzAwMCcsXG4gICAgJzAwMDAnLFxuICAgICcwMDAwMCcsXG4gICAgJzAwMDAwMCcsXG4gICAgJzAwMDAwMDAnLFxuICAgICcwMDAwMDAwMCcsXG4gICAgJzAwMDAwMDAwMCcsXG4gICAgJzAwMDAwMDAwMDAnLFxuICAgICcwMDAwMDAwMDAwMCcsXG4gICAgJzAwMDAwMDAwMDAwMCcsXG4gICAgJzAwMDAwMDAwMDAwMDAnLFxuICAgICcwMDAwMDAwMDAwMDAwMCcsXG4gICAgJzAwMDAwMDAwMDAwMDAwMCcsXG4gICAgJzAwMDAwMDAwMDAwMDAwMDAnLFxuICAgICcwMDAwMDAwMDAwMDAwMDAwMCcsXG4gICAgJzAwMDAwMDAwMDAwMDAwMDAwMCcsXG4gICAgJzAwMDAwMDAwMDAwMDAwMDAwMDAnLFxuICAgICcwMDAwMDAwMDAwMDAwMDAwMDAwMCcsXG4gICAgJzAwMDAwMDAwMDAwMDAwMDAwMDAwMCcsXG4gICAgJzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAnLFxuICAgICcwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCcsXG4gICAgJzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCcsXG4gICAgJzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAnXG4gIF07XG5cbiAgdmFyIGdyb3VwU2l6ZXMgPSBbXG4gICAgMCwgMCxcbiAgICAyNSwgMTYsIDEyLCAxMSwgMTAsIDksIDgsXG4gICAgOCwgNywgNywgNywgNywgNiwgNixcbiAgICA2LCA2LCA2LCA2LCA2LCA1LCA1LFxuICAgIDUsIDUsIDUsIDUsIDUsIDUsIDUsXG4gICAgNSwgNSwgNSwgNSwgNSwgNSwgNVxuICBdO1xuXG4gIHZhciBncm91cEJhc2VzID0gW1xuICAgIDAsIDAsXG4gICAgMzM1NTQ0MzIsIDQzMDQ2NzIxLCAxNjc3NzIxNiwgNDg4MjgxMjUsIDYwNDY2MTc2LCA0MDM1MzYwNywgMTY3NzcyMTYsXG4gICAgNDMwNDY3MjEsIDEwMDAwMDAwLCAxOTQ4NzE3MSwgMzU4MzE4MDgsIDYyNzQ4NTE3LCA3NTI5NTM2LCAxMTM5MDYyNSxcbiAgICAxNjc3NzIxNiwgMjQxMzc1NjksIDM0MDEyMjI0LCA0NzA0NTg4MSwgNjQwMDAwMDAsIDQwODQxMDEsIDUxNTM2MzIsXG4gICAgNjQzNjM0MywgNzk2MjYyNCwgOTc2NTYyNSwgMTE4ODEzNzYsIDE0MzQ4OTA3LCAxNzIxMDM2OCwgMjA1MTExNDksXG4gICAgMjQzMDAwMDAsIDI4NjI5MTUxLCAzMzU1NDQzMiwgMzkxMzUzOTMsIDQ1NDM1NDI0LCA1MjUyMTg3NSwgNjA0NjYxNzZcbiAgXTtcblxuICBCTi5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoYmFzZSwgcGFkZGluZykge1xuICAgIGJhc2UgPSBiYXNlIHx8IDEwO1xuICAgIHBhZGRpbmcgPSBwYWRkaW5nIHwgMCB8fCAxO1xuXG4gICAgdmFyIG91dDtcbiAgICBpZiAoYmFzZSA9PT0gMTYgfHwgYmFzZSA9PT0gJ2hleCcpIHtcbiAgICAgIG91dCA9ICcnO1xuICAgICAgdmFyIG9mZiA9IDA7XG4gICAgICB2YXIgY2FycnkgPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB3ID0gdGhpcy53b3Jkc1tpXTtcbiAgICAgICAgdmFyIHdvcmQgPSAoKCh3IDw8IG9mZikgfCBjYXJyeSkgJiAweGZmZmZmZikudG9TdHJpbmcoMTYpO1xuICAgICAgICBjYXJyeSA9ICh3ID4+PiAoMjQgLSBvZmYpKSAmIDB4ZmZmZmZmO1xuICAgICAgICBpZiAoY2FycnkgIT09IDAgfHwgaSAhPT0gdGhpcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgb3V0ID0gemVyb3NbNiAtIHdvcmQubGVuZ3RoXSArIHdvcmQgKyBvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0ID0gd29yZCArIG91dDtcbiAgICAgICAgfVxuICAgICAgICBvZmYgKz0gMjtcbiAgICAgICAgaWYgKG9mZiA+PSAyNikge1xuICAgICAgICAgIG9mZiAtPSAyNjtcbiAgICAgICAgICBpLS07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjYXJyeSAhPT0gMCkge1xuICAgICAgICBvdXQgPSBjYXJyeS50b1N0cmluZygxNikgKyBvdXQ7XG4gICAgICB9XG4gICAgICB3aGlsZSAob3V0Lmxlbmd0aCAlIHBhZGRpbmcgIT09IDApIHtcbiAgICAgICAgb3V0ID0gJzAnICsgb3V0O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubmVnYXRpdmUgIT09IDApIHtcbiAgICAgICAgb3V0ID0gJy0nICsgb3V0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBpZiAoYmFzZSA9PT0gKGJhc2UgfCAwKSAmJiBiYXNlID49IDIgJiYgYmFzZSA8PSAzNikge1xuICAgICAgLy8gdmFyIGdyb3VwU2l6ZSA9IE1hdGguZmxvb3IoQk4ud29yZFNpemUgKiBNYXRoLkxOMiAvIE1hdGgubG9nKGJhc2UpKTtcbiAgICAgIHZhciBncm91cFNpemUgPSBncm91cFNpemVzW2Jhc2VdO1xuICAgICAgLy8gdmFyIGdyb3VwQmFzZSA9IE1hdGgucG93KGJhc2UsIGdyb3VwU2l6ZSk7XG4gICAgICB2YXIgZ3JvdXBCYXNlID0gZ3JvdXBCYXNlc1tiYXNlXTtcbiAgICAgIG91dCA9ICcnO1xuICAgICAgdmFyIGMgPSB0aGlzLmNsb25lKCk7XG4gICAgICBjLm5lZ2F0aXZlID0gMDtcbiAgICAgIHdoaWxlICghYy5pc1plcm8oKSkge1xuICAgICAgICB2YXIgciA9IGMubW9kbihncm91cEJhc2UpLnRvU3RyaW5nKGJhc2UpO1xuICAgICAgICBjID0gYy5pZGl2bihncm91cEJhc2UpO1xuXG4gICAgICAgIGlmICghYy5pc1plcm8oKSkge1xuICAgICAgICAgIG91dCA9IHplcm9zW2dyb3VwU2l6ZSAtIHIubGVuZ3RoXSArIHIgKyBvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0ID0gciArIG91dDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaXNaZXJvKCkpIHtcbiAgICAgICAgb3V0ID0gJzAnICsgb3V0O1xuICAgICAgfVxuICAgICAgd2hpbGUgKG91dC5sZW5ndGggJSBwYWRkaW5nICE9PSAwKSB7XG4gICAgICAgIG91dCA9ICcwJyArIG91dDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm5lZ2F0aXZlICE9PSAwKSB7XG4gICAgICAgIG91dCA9ICctJyArIG91dDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgYXNzZXJ0KGZhbHNlLCAnQmFzZSBzaG91bGQgYmUgYmV0d2VlbiAyIGFuZCAzNicpO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS50b051bWJlciA9IGZ1bmN0aW9uIHRvTnVtYmVyICgpIHtcbiAgICB2YXIgcmV0ID0gdGhpcy53b3Jkc1swXTtcbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHJldCArPSB0aGlzLndvcmRzWzFdICogMHg0MDAwMDAwO1xuICAgIH0gZWxzZSBpZiAodGhpcy5sZW5ndGggPT09IDMgJiYgdGhpcy53b3Jkc1syXSA9PT0gMHgwMSkge1xuICAgICAgLy8gTk9URTogYXQgdGhpcyBzdGFnZSBpdCBpcyBrbm93biB0aGF0IHRoZSB0b3AgYml0IGlzIHNldFxuICAgICAgcmV0ICs9IDB4MTAwMDAwMDAwMDAwMDAgKyAodGhpcy53b3Jkc1sxXSAqIDB4NDAwMDAwMCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmxlbmd0aCA+IDIpIHtcbiAgICAgIGFzc2VydChmYWxzZSwgJ051bWJlciBjYW4gb25seSBzYWZlbHkgc3RvcmUgdXAgdG8gNTMgYml0cycpO1xuICAgIH1cbiAgICByZXR1cm4gKHRoaXMubmVnYXRpdmUgIT09IDApID8gLXJldCA6IHJldDtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgICByZXR1cm4gdGhpcy50b1N0cmluZygxNik7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLnRvQnVmZmVyID0gZnVuY3Rpb24gdG9CdWZmZXIgKGVuZGlhbiwgbGVuZ3RoKSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBCdWZmZXIgIT09ICd1bmRlZmluZWQnKTtcbiAgICByZXR1cm4gdGhpcy50b0FycmF5TGlrZShCdWZmZXIsIGVuZGlhbiwgbGVuZ3RoKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uIHRvQXJyYXkgKGVuZGlhbiwgbGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9BcnJheUxpa2UoQXJyYXksIGVuZGlhbiwgbGVuZ3RoKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUudG9BcnJheUxpa2UgPSBmdW5jdGlvbiB0b0FycmF5TGlrZSAoQXJyYXlUeXBlLCBlbmRpYW4sIGxlbmd0aCkge1xuICAgIHZhciBieXRlTGVuZ3RoID0gdGhpcy5ieXRlTGVuZ3RoKCk7XG4gICAgdmFyIHJlcUxlbmd0aCA9IGxlbmd0aCB8fCBNYXRoLm1heCgxLCBieXRlTGVuZ3RoKTtcbiAgICBhc3NlcnQoYnl0ZUxlbmd0aCA8PSByZXFMZW5ndGgsICdieXRlIGFycmF5IGxvbmdlciB0aGFuIGRlc2lyZWQgbGVuZ3RoJyk7XG4gICAgYXNzZXJ0KHJlcUxlbmd0aCA+IDAsICdSZXF1ZXN0ZWQgYXJyYXkgbGVuZ3RoIDw9IDAnKTtcblxuICAgIHRoaXMuc3RyaXAoKTtcbiAgICB2YXIgbGl0dGxlRW5kaWFuID0gZW5kaWFuID09PSAnbGUnO1xuICAgIHZhciByZXMgPSBuZXcgQXJyYXlUeXBlKHJlcUxlbmd0aCk7XG5cbiAgICB2YXIgYiwgaTtcbiAgICB2YXIgcSA9IHRoaXMuY2xvbmUoKTtcbiAgICBpZiAoIWxpdHRsZUVuZGlhbikge1xuICAgICAgLy8gQXNzdW1lIGJpZy1lbmRpYW5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCByZXFMZW5ndGggLSBieXRlTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzW2ldID0gMDtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMDsgIXEuaXNaZXJvKCk7IGkrKykge1xuICAgICAgICBiID0gcS5hbmRsbigweGZmKTtcbiAgICAgICAgcS5pdXNocm4oOCk7XG5cbiAgICAgICAgcmVzW3JlcUxlbmd0aCAtIGkgLSAxXSA9IGI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IDA7ICFxLmlzWmVybygpOyBpKyspIHtcbiAgICAgICAgYiA9IHEuYW5kbG4oMHhmZik7XG4gICAgICAgIHEuaXVzaHJuKDgpO1xuXG4gICAgICAgIHJlc1tpXSA9IGI7XG4gICAgICB9XG5cbiAgICAgIGZvciAoOyBpIDwgcmVxTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzW2ldID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9O1xuXG4gIGlmIChNYXRoLmNsejMyKSB7XG4gICAgQk4ucHJvdG90eXBlLl9jb3VudEJpdHMgPSBmdW5jdGlvbiBfY291bnRCaXRzICh3KSB7XG4gICAgICByZXR1cm4gMzIgLSBNYXRoLmNsejMyKHcpO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgQk4ucHJvdG90eXBlLl9jb3VudEJpdHMgPSBmdW5jdGlvbiBfY291bnRCaXRzICh3KSB7XG4gICAgICB2YXIgdCA9IHc7XG4gICAgICB2YXIgciA9IDA7XG4gICAgICBpZiAodCA+PSAweDEwMDApIHtcbiAgICAgICAgciArPSAxMztcbiAgICAgICAgdCA+Pj49IDEzO1xuICAgICAgfVxuICAgICAgaWYgKHQgPj0gMHg0MCkge1xuICAgICAgICByICs9IDc7XG4gICAgICAgIHQgPj4+PSA3O1xuICAgICAgfVxuICAgICAgaWYgKHQgPj0gMHg4KSB7XG4gICAgICAgIHIgKz0gNDtcbiAgICAgICAgdCA+Pj49IDQ7XG4gICAgICB9XG4gICAgICBpZiAodCA+PSAweDAyKSB7XG4gICAgICAgIHIgKz0gMjtcbiAgICAgICAgdCA+Pj49IDI7XG4gICAgICB9XG4gICAgICByZXR1cm4gciArIHQ7XG4gICAgfTtcbiAgfVxuXG4gIEJOLnByb3RvdHlwZS5femVyb0JpdHMgPSBmdW5jdGlvbiBfemVyb0JpdHMgKHcpIHtcbiAgICAvLyBTaG9ydC1jdXRcbiAgICBpZiAodyA9PT0gMCkgcmV0dXJuIDI2O1xuXG4gICAgdmFyIHQgPSB3O1xuICAgIHZhciByID0gMDtcbiAgICBpZiAoKHQgJiAweDFmZmYpID09PSAwKSB7XG4gICAgICByICs9IDEzO1xuICAgICAgdCA+Pj49IDEzO1xuICAgIH1cbiAgICBpZiAoKHQgJiAweDdmKSA9PT0gMCkge1xuICAgICAgciArPSA3O1xuICAgICAgdCA+Pj49IDc7XG4gICAgfVxuICAgIGlmICgodCAmIDB4ZikgPT09IDApIHtcbiAgICAgIHIgKz0gNDtcbiAgICAgIHQgPj4+PSA0O1xuICAgIH1cbiAgICBpZiAoKHQgJiAweDMpID09PSAwKSB7XG4gICAgICByICs9IDI7XG4gICAgICB0ID4+Pj0gMjtcbiAgICB9XG4gICAgaWYgKCh0ICYgMHgxKSA9PT0gMCkge1xuICAgICAgcisrO1xuICAgIH1cbiAgICByZXR1cm4gcjtcbiAgfTtcblxuICAvLyBSZXR1cm4gbnVtYmVyIG9mIHVzZWQgYml0cyBpbiBhIEJOXG4gIEJOLnByb3RvdHlwZS5iaXRMZW5ndGggPSBmdW5jdGlvbiBiaXRMZW5ndGggKCkge1xuICAgIHZhciB3ID0gdGhpcy53b3Jkc1t0aGlzLmxlbmd0aCAtIDFdO1xuICAgIHZhciBoaSA9IHRoaXMuX2NvdW50Qml0cyh3KTtcbiAgICByZXR1cm4gKHRoaXMubGVuZ3RoIC0gMSkgKiAyNiArIGhpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHRvQml0QXJyYXkgKG51bSkge1xuICAgIHZhciB3ID0gbmV3IEFycmF5KG51bS5iaXRMZW5ndGgoKSk7XG5cbiAgICBmb3IgKHZhciBiaXQgPSAwOyBiaXQgPCB3Lmxlbmd0aDsgYml0KyspIHtcbiAgICAgIHZhciBvZmYgPSAoYml0IC8gMjYpIHwgMDtcbiAgICAgIHZhciB3Yml0ID0gYml0ICUgMjY7XG5cbiAgICAgIHdbYml0XSA9IChudW0ud29yZHNbb2ZmXSAmICgxIDw8IHdiaXQpKSA+Pj4gd2JpdDtcbiAgICB9XG5cbiAgICByZXR1cm4gdztcbiAgfVxuXG4gIC8vIE51bWJlciBvZiB0cmFpbGluZyB6ZXJvIGJpdHNcbiAgQk4ucHJvdG90eXBlLnplcm9CaXRzID0gZnVuY3Rpb24gemVyb0JpdHMgKCkge1xuICAgIGlmICh0aGlzLmlzWmVybygpKSByZXR1cm4gMDtcblxuICAgIHZhciByID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBiID0gdGhpcy5femVyb0JpdHModGhpcy53b3Jkc1tpXSk7XG4gICAgICByICs9IGI7XG4gICAgICBpZiAoYiAhPT0gMjYpIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gcjtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIGJ5dGVMZW5ndGggKCkge1xuICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5iaXRMZW5ndGgoKSAvIDgpO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS50b1R3b3MgPSBmdW5jdGlvbiB0b1R3b3MgKHdpZHRoKSB7XG4gICAgaWYgKHRoaXMubmVnYXRpdmUgIT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLmFicygpLmlub3RuKHdpZHRoKS5pYWRkbigxKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuZnJvbVR3b3MgPSBmdW5jdGlvbiBmcm9tVHdvcyAod2lkdGgpIHtcbiAgICBpZiAodGhpcy50ZXN0bih3aWR0aCAtIDEpKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub3RuKHdpZHRoKS5pYWRkbigxKS5pbmVnKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNsb25lKCk7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLmlzTmVnID0gZnVuY3Rpb24gaXNOZWcgKCkge1xuICAgIHJldHVybiB0aGlzLm5lZ2F0aXZlICE9PSAwO1xuICB9O1xuXG4gIC8vIFJldHVybiBuZWdhdGl2ZSBjbG9uZSBvZiBgdGhpc2BcbiAgQk4ucHJvdG90eXBlLm5lZyA9IGZ1bmN0aW9uIG5lZyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pbmVnKCk7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLmluZWcgPSBmdW5jdGlvbiBpbmVnICgpIHtcbiAgICBpZiAoIXRoaXMuaXNaZXJvKCkpIHtcbiAgICAgIHRoaXMubmVnYXRpdmUgXj0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBPciBgbnVtYCB3aXRoIGB0aGlzYCBpbi1wbGFjZVxuICBCTi5wcm90b3R5cGUuaXVvciA9IGZ1bmN0aW9uIGl1b3IgKG51bSkge1xuICAgIHdoaWxlICh0aGlzLmxlbmd0aCA8IG51bS5sZW5ndGgpIHtcbiAgICAgIHRoaXMud29yZHNbdGhpcy5sZW5ndGgrK10gPSAwO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLndvcmRzW2ldID0gdGhpcy53b3Jkc1tpXSB8IG51bS53b3Jkc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdHJpcCgpO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5pb3IgPSBmdW5jdGlvbiBpb3IgKG51bSkge1xuICAgIGFzc2VydCgodGhpcy5uZWdhdGl2ZSB8IG51bS5uZWdhdGl2ZSkgPT09IDApO1xuICAgIHJldHVybiB0aGlzLml1b3IobnVtKTtcbiAgfTtcblxuICAvLyBPciBgbnVtYCB3aXRoIGB0aGlzYFxuICBCTi5wcm90b3R5cGUub3IgPSBmdW5jdGlvbiBvciAobnVtKSB7XG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbnVtLmxlbmd0aCkgcmV0dXJuIHRoaXMuY2xvbmUoKS5pb3IobnVtKTtcbiAgICByZXR1cm4gbnVtLmNsb25lKCkuaW9yKHRoaXMpO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS51b3IgPSBmdW5jdGlvbiB1b3IgKG51bSkge1xuICAgIGlmICh0aGlzLmxlbmd0aCA+IG51bS5sZW5ndGgpIHJldHVybiB0aGlzLmNsb25lKCkuaXVvcihudW0pO1xuICAgIHJldHVybiBudW0uY2xvbmUoKS5pdW9yKHRoaXMpO1xuICB9O1xuXG4gIC8vIEFuZCBgbnVtYCB3aXRoIGB0aGlzYCBpbi1wbGFjZVxuICBCTi5wcm90b3R5cGUuaXVhbmQgPSBmdW5jdGlvbiBpdWFuZCAobnVtKSB7XG4gICAgLy8gYiA9IG1pbi1sZW5ndGgobnVtLCB0aGlzKVxuICAgIHZhciBiO1xuICAgIGlmICh0aGlzLmxlbmd0aCA+IG51bS5sZW5ndGgpIHtcbiAgICAgIGIgPSBudW07XG4gICAgfSBlbHNlIHtcbiAgICAgIGIgPSB0aGlzO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy53b3Jkc1tpXSA9IHRoaXMud29yZHNbaV0gJiBudW0ud29yZHNbaV07XG4gICAgfVxuXG4gICAgdGhpcy5sZW5ndGggPSBiLmxlbmd0aDtcblxuICAgIHJldHVybiB0aGlzLnN0cmlwKCk7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLmlhbmQgPSBmdW5jdGlvbiBpYW5kIChudW0pIHtcbiAgICBhc3NlcnQoKHRoaXMubmVnYXRpdmUgfCBudW0ubmVnYXRpdmUpID09PSAwKTtcbiAgICByZXR1cm4gdGhpcy5pdWFuZChudW0pO1xuICB9O1xuXG4gIC8vIEFuZCBgbnVtYCB3aXRoIGB0aGlzYFxuICBCTi5wcm90b3R5cGUuYW5kID0gZnVuY3Rpb24gYW5kIChudW0pIHtcbiAgICBpZiAodGhpcy5sZW5ndGggPiBudW0ubGVuZ3RoKSByZXR1cm4gdGhpcy5jbG9uZSgpLmlhbmQobnVtKTtcbiAgICByZXR1cm4gbnVtLmNsb25lKCkuaWFuZCh0aGlzKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUudWFuZCA9IGZ1bmN0aW9uIHVhbmQgKG51bSkge1xuICAgIGlmICh0aGlzLmxlbmd0aCA+IG51bS5sZW5ndGgpIHJldHVybiB0aGlzLmNsb25lKCkuaXVhbmQobnVtKTtcbiAgICByZXR1cm4gbnVtLmNsb25lKCkuaXVhbmQodGhpcyk7XG4gIH07XG5cbiAgLy8gWG9yIGBudW1gIHdpdGggYHRoaXNgIGluLXBsYWNlXG4gIEJOLnByb3RvdHlwZS5pdXhvciA9IGZ1bmN0aW9uIGl1eG9yIChudW0pIHtcbiAgICAvLyBhLmxlbmd0aCA+IGIubGVuZ3RoXG4gICAgdmFyIGE7XG4gICAgdmFyIGI7XG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbnVtLmxlbmd0aCkge1xuICAgICAgYSA9IHRoaXM7XG4gICAgICBiID0gbnVtO1xuICAgIH0gZWxzZSB7XG4gICAgICBhID0gbnVtO1xuICAgICAgYiA9IHRoaXM7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLndvcmRzW2ldID0gYS53b3Jkc1tpXSBeIGIud29yZHNbaV07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMgIT09IGEpIHtcbiAgICAgIGZvciAoOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLndvcmRzW2ldID0gYS53b3Jkc1tpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmxlbmd0aCA9IGEubGVuZ3RoO1xuXG4gICAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuaXhvciA9IGZ1bmN0aW9uIGl4b3IgKG51bSkge1xuICAgIGFzc2VydCgodGhpcy5uZWdhdGl2ZSB8IG51bS5uZWdhdGl2ZSkgPT09IDApO1xuICAgIHJldHVybiB0aGlzLml1eG9yKG51bSk7XG4gIH07XG5cbiAgLy8gWG9yIGBudW1gIHdpdGggYHRoaXNgXG4gIEJOLnByb3RvdHlwZS54b3IgPSBmdW5jdGlvbiB4b3IgKG51bSkge1xuICAgIGlmICh0aGlzLmxlbmd0aCA+IG51bS5sZW5ndGgpIHJldHVybiB0aGlzLmNsb25lKCkuaXhvcihudW0pO1xuICAgIHJldHVybiBudW0uY2xvbmUoKS5peG9yKHRoaXMpO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS51eG9yID0gZnVuY3Rpb24gdXhvciAobnVtKSB7XG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbnVtLmxlbmd0aCkgcmV0dXJuIHRoaXMuY2xvbmUoKS5pdXhvcihudW0pO1xuICAgIHJldHVybiBudW0uY2xvbmUoKS5pdXhvcih0aGlzKTtcbiAgfTtcblxuICAvLyBOb3QgYGB0aGlzYGAgd2l0aCBgYHdpZHRoYGAgYml0d2lkdGhcbiAgQk4ucHJvdG90eXBlLmlub3RuID0gZnVuY3Rpb24gaW5vdG4gKHdpZHRoKSB7XG4gICAgYXNzZXJ0KHR5cGVvZiB3aWR0aCA9PT0gJ251bWJlcicgJiYgd2lkdGggPj0gMCk7XG5cbiAgICB2YXIgYnl0ZXNOZWVkZWQgPSBNYXRoLmNlaWwod2lkdGggLyAyNikgfCAwO1xuICAgIHZhciBiaXRzTGVmdCA9IHdpZHRoICUgMjY7XG5cbiAgICAvLyBFeHRlbmQgdGhlIGJ1ZmZlciB3aXRoIGxlYWRpbmcgemVyb2VzXG4gICAgdGhpcy5fZXhwYW5kKGJ5dGVzTmVlZGVkKTtcblxuICAgIGlmIChiaXRzTGVmdCA+IDApIHtcbiAgICAgIGJ5dGVzTmVlZGVkLS07XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIGNvbXBsZXRlIHdvcmRzXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlc05lZWRlZDsgaSsrKSB7XG4gICAgICB0aGlzLndvcmRzW2ldID0gfnRoaXMud29yZHNbaV0gJiAweDNmZmZmZmY7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHRoZSByZXNpZHVlXG4gICAgaWYgKGJpdHNMZWZ0ID4gMCkge1xuICAgICAgdGhpcy53b3Jkc1tpXSA9IH50aGlzLndvcmRzW2ldICYgKDB4M2ZmZmZmZiA+PiAoMjYgLSBiaXRzTGVmdCkpO1xuICAgIH1cblxuICAgIC8vIEFuZCByZW1vdmUgbGVhZGluZyB6ZXJvZXNcbiAgICByZXR1cm4gdGhpcy5zdHJpcCgpO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5ub3RuID0gZnVuY3Rpb24gbm90biAod2lkdGgpIHtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmlub3RuKHdpZHRoKTtcbiAgfTtcblxuICAvLyBTZXQgYGJpdGAgb2YgYHRoaXNgXG4gIEJOLnByb3RvdHlwZS5zZXRuID0gZnVuY3Rpb24gc2V0biAoYml0LCB2YWwpIHtcbiAgICBhc3NlcnQodHlwZW9mIGJpdCA9PT0gJ251bWJlcicgJiYgYml0ID49IDApO1xuXG4gICAgdmFyIG9mZiA9IChiaXQgLyAyNikgfCAwO1xuICAgIHZhciB3Yml0ID0gYml0ICUgMjY7XG5cbiAgICB0aGlzLl9leHBhbmQob2ZmICsgMSk7XG5cbiAgICBpZiAodmFsKSB7XG4gICAgICB0aGlzLndvcmRzW29mZl0gPSB0aGlzLndvcmRzW29mZl0gfCAoMSA8PCB3Yml0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy53b3Jkc1tvZmZdID0gdGhpcy53b3Jkc1tvZmZdICYgfigxIDw8IHdiaXQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0cmlwKCk7XG4gIH07XG5cbiAgLy8gQWRkIGBudW1gIHRvIGB0aGlzYCBpbi1wbGFjZVxuICBCTi5wcm90b3R5cGUuaWFkZCA9IGZ1bmN0aW9uIGlhZGQgKG51bSkge1xuICAgIHZhciByO1xuXG4gICAgLy8gbmVnYXRpdmUgKyBwb3NpdGl2ZVxuICAgIGlmICh0aGlzLm5lZ2F0aXZlICE9PSAwICYmIG51bS5uZWdhdGl2ZSA9PT0gMCkge1xuICAgICAgdGhpcy5uZWdhdGl2ZSA9IDA7XG4gICAgICByID0gdGhpcy5pc3ViKG51bSk7XG4gICAgICB0aGlzLm5lZ2F0aXZlIF49IDE7XG4gICAgICByZXR1cm4gdGhpcy5fbm9ybVNpZ24oKTtcblxuICAgIC8vIHBvc2l0aXZlICsgbmVnYXRpdmVcbiAgICB9IGVsc2UgaWYgKHRoaXMubmVnYXRpdmUgPT09IDAgJiYgbnVtLm5lZ2F0aXZlICE9PSAwKSB7XG4gICAgICBudW0ubmVnYXRpdmUgPSAwO1xuICAgICAgciA9IHRoaXMuaXN1YihudW0pO1xuICAgICAgbnVtLm5lZ2F0aXZlID0gMTtcbiAgICAgIHJldHVybiByLl9ub3JtU2lnbigpO1xuICAgIH1cblxuICAgIC8vIGEubGVuZ3RoID4gYi5sZW5ndGhcbiAgICB2YXIgYSwgYjtcbiAgICBpZiAodGhpcy5sZW5ndGggPiBudW0ubGVuZ3RoKSB7XG4gICAgICBhID0gdGhpcztcbiAgICAgIGIgPSBudW07XG4gICAgfSBlbHNlIHtcbiAgICAgIGEgPSBudW07XG4gICAgICBiID0gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgY2FycnkgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xuICAgICAgciA9IChhLndvcmRzW2ldIHwgMCkgKyAoYi53b3Jkc1tpXSB8IDApICsgY2Fycnk7XG4gICAgICB0aGlzLndvcmRzW2ldID0gciAmIDB4M2ZmZmZmZjtcbiAgICAgIGNhcnJ5ID0gciA+Pj4gMjY7XG4gICAgfVxuICAgIGZvciAoOyBjYXJyeSAhPT0gMCAmJiBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgciA9IChhLndvcmRzW2ldIHwgMCkgKyBjYXJyeTtcbiAgICAgIHRoaXMud29yZHNbaV0gPSByICYgMHgzZmZmZmZmO1xuICAgICAgY2FycnkgPSByID4+PiAyNjtcbiAgICB9XG5cbiAgICB0aGlzLmxlbmd0aCA9IGEubGVuZ3RoO1xuICAgIGlmIChjYXJyeSAhPT0gMCkge1xuICAgICAgdGhpcy53b3Jkc1t0aGlzLmxlbmd0aF0gPSBjYXJyeTtcbiAgICAgIHRoaXMubGVuZ3RoKys7XG4gICAgLy8gQ29weSB0aGUgcmVzdCBvZiB0aGUgd29yZHNcbiAgICB9IGVsc2UgaWYgKGEgIT09IHRoaXMpIHtcbiAgICAgIGZvciAoOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLndvcmRzW2ldID0gYS53b3Jkc1tpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBBZGQgYG51bWAgdG8gYHRoaXNgXG4gIEJOLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQgKG51bSkge1xuICAgIHZhciByZXM7XG4gICAgaWYgKG51bS5uZWdhdGl2ZSAhPT0gMCAmJiB0aGlzLm5lZ2F0aXZlID09PSAwKSB7XG4gICAgICBudW0ubmVnYXRpdmUgPSAwO1xuICAgICAgcmVzID0gdGhpcy5zdWIobnVtKTtcbiAgICAgIG51bS5uZWdhdGl2ZSBePSAxO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGVsc2UgaWYgKG51bS5uZWdhdGl2ZSA9PT0gMCAmJiB0aGlzLm5lZ2F0aXZlICE9PSAwKSB7XG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMDtcbiAgICAgIHJlcyA9IG51bS5zdWIodGhpcyk7XG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbnVtLmxlbmd0aCkgcmV0dXJuIHRoaXMuY2xvbmUoKS5pYWRkKG51bSk7XG5cbiAgICByZXR1cm4gbnVtLmNsb25lKCkuaWFkZCh0aGlzKTtcbiAgfTtcblxuICAvLyBTdWJ0cmFjdCBgbnVtYCBmcm9tIGB0aGlzYCBpbi1wbGFjZVxuICBCTi5wcm90b3R5cGUuaXN1YiA9IGZ1bmN0aW9uIGlzdWIgKG51bSkge1xuICAgIC8vIHRoaXMgLSAoLW51bSkgPSB0aGlzICsgbnVtXG4gICAgaWYgKG51bS5uZWdhdGl2ZSAhPT0gMCkge1xuICAgICAgbnVtLm5lZ2F0aXZlID0gMDtcbiAgICAgIHZhciByID0gdGhpcy5pYWRkKG51bSk7XG4gICAgICBudW0ubmVnYXRpdmUgPSAxO1xuICAgICAgcmV0dXJuIHIuX25vcm1TaWduKCk7XG5cbiAgICAvLyAtdGhpcyAtIG51bSA9IC0odGhpcyArIG51bSlcbiAgICB9IGVsc2UgaWYgKHRoaXMubmVnYXRpdmUgIT09IDApIHtcbiAgICAgIHRoaXMubmVnYXRpdmUgPSAwO1xuICAgICAgdGhpcy5pYWRkKG51bSk7XG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMTtcbiAgICAgIHJldHVybiB0aGlzLl9ub3JtU2lnbigpO1xuICAgIH1cblxuICAgIC8vIEF0IHRoaXMgcG9pbnQgYm90aCBudW1iZXJzIGFyZSBwb3NpdGl2ZVxuICAgIHZhciBjbXAgPSB0aGlzLmNtcChudW0pO1xuXG4gICAgLy8gT3B0aW1pemF0aW9uIC0gemVyb2lmeVxuICAgIGlmIChjbXAgPT09IDApIHtcbiAgICAgIHRoaXMubmVnYXRpdmUgPSAwO1xuICAgICAgdGhpcy5sZW5ndGggPSAxO1xuICAgICAgdGhpcy53b3Jkc1swXSA9IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBhID4gYlxuICAgIHZhciBhLCBiO1xuICAgIGlmIChjbXAgPiAwKSB7XG4gICAgICBhID0gdGhpcztcbiAgICAgIGIgPSBudW07XG4gICAgfSBlbHNlIHtcbiAgICAgIGEgPSBudW07XG4gICAgICBiID0gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgY2FycnkgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xuICAgICAgciA9IChhLndvcmRzW2ldIHwgMCkgLSAoYi53b3Jkc1tpXSB8IDApICsgY2Fycnk7XG4gICAgICBjYXJyeSA9IHIgPj4gMjY7XG4gICAgICB0aGlzLndvcmRzW2ldID0gciAmIDB4M2ZmZmZmZjtcbiAgICB9XG4gICAgZm9yICg7IGNhcnJ5ICE9PSAwICYmIGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICByID0gKGEud29yZHNbaV0gfCAwKSArIGNhcnJ5O1xuICAgICAgY2FycnkgPSByID4+IDI2O1xuICAgICAgdGhpcy53b3Jkc1tpXSA9IHIgJiAweDNmZmZmZmY7XG4gICAgfVxuXG4gICAgLy8gQ29weSByZXN0IG9mIHRoZSB3b3Jkc1xuICAgIGlmIChjYXJyeSA9PT0gMCAmJiBpIDwgYS5sZW5ndGggJiYgYSAhPT0gdGhpcykge1xuICAgICAgZm9yICg7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMud29yZHNbaV0gPSBhLndvcmRzW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubGVuZ3RoID0gTWF0aC5tYXgodGhpcy5sZW5ndGgsIGkpO1xuXG4gICAgaWYgKGEgIT09IHRoaXMpIHtcbiAgICAgIHRoaXMubmVnYXRpdmUgPSAxO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0cmlwKCk7XG4gIH07XG5cbiAgLy8gU3VidHJhY3QgYG51bWAgZnJvbSBgdGhpc2BcbiAgQk4ucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uIHN1YiAobnVtKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pc3ViKG51bSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gc21hbGxNdWxUbyAoc2VsZiwgbnVtLCBvdXQpIHtcbiAgICBvdXQubmVnYXRpdmUgPSBudW0ubmVnYXRpdmUgXiBzZWxmLm5lZ2F0aXZlO1xuICAgIHZhciBsZW4gPSAoc2VsZi5sZW5ndGggKyBudW0ubGVuZ3RoKSB8IDA7XG4gICAgb3V0Lmxlbmd0aCA9IGxlbjtcbiAgICBsZW4gPSAobGVuIC0gMSkgfCAwO1xuXG4gICAgLy8gUGVlbCBvbmUgaXRlcmF0aW9uIChjb21waWxlciBjYW4ndCBkbyBpdCwgYmVjYXVzZSBvZiBjb2RlIGNvbXBsZXhpdHkpXG4gICAgdmFyIGEgPSBzZWxmLndvcmRzWzBdIHwgMDtcbiAgICB2YXIgYiA9IG51bS53b3Jkc1swXSB8IDA7XG4gICAgdmFyIHIgPSBhICogYjtcblxuICAgIHZhciBsbyA9IHIgJiAweDNmZmZmZmY7XG4gICAgdmFyIGNhcnJ5ID0gKHIgLyAweDQwMDAwMDApIHwgMDtcbiAgICBvdXQud29yZHNbMF0gPSBsbztcblxuICAgIGZvciAodmFyIGsgPSAxOyBrIDwgbGVuOyBrKyspIHtcbiAgICAgIC8vIFN1bSBhbGwgd29yZHMgd2l0aCB0aGUgc2FtZSBgaSArIGogPSBrYCBhbmQgYWNjdW11bGF0ZSBgbmNhcnJ5YCxcbiAgICAgIC8vIG5vdGUgdGhhdCBuY2FycnkgY291bGQgYmUgPj0gMHgzZmZmZmZmXG4gICAgICB2YXIgbmNhcnJ5ID0gY2FycnkgPj4+IDI2O1xuICAgICAgdmFyIHJ3b3JkID0gY2FycnkgJiAweDNmZmZmZmY7XG4gICAgICB2YXIgbWF4SiA9IE1hdGgubWluKGssIG51bS5sZW5ndGggLSAxKTtcbiAgICAgIGZvciAodmFyIGogPSBNYXRoLm1heCgwLCBrIC0gc2VsZi5sZW5ndGggKyAxKTsgaiA8PSBtYXhKOyBqKyspIHtcbiAgICAgICAgdmFyIGkgPSAoayAtIGopIHwgMDtcbiAgICAgICAgYSA9IHNlbGYud29yZHNbaV0gfCAwO1xuICAgICAgICBiID0gbnVtLndvcmRzW2pdIHwgMDtcbiAgICAgICAgciA9IGEgKiBiICsgcndvcmQ7XG4gICAgICAgIG5jYXJyeSArPSAociAvIDB4NDAwMDAwMCkgfCAwO1xuICAgICAgICByd29yZCA9IHIgJiAweDNmZmZmZmY7XG4gICAgICB9XG4gICAgICBvdXQud29yZHNba10gPSByd29yZCB8IDA7XG4gICAgICBjYXJyeSA9IG5jYXJyeSB8IDA7XG4gICAgfVxuICAgIGlmIChjYXJyeSAhPT0gMCkge1xuICAgICAgb3V0LndvcmRzW2tdID0gY2FycnkgfCAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQubGVuZ3RoLS07XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dC5zdHJpcCgpO1xuICB9XG5cbiAgLy8gVE9ETyhpbmR1dG55KTogaXQgbWF5IGJlIHJlYXNvbmFibGUgdG8gb21pdCBpdCBmb3IgdXNlcnMgd2hvIGRvbid0IG5lZWRcbiAgLy8gdG8gd29yayB3aXRoIDI1Ni1iaXQgbnVtYmVycywgb3RoZXJ3aXNlIGl0IGdpdmVzIDIwJSBpbXByb3ZlbWVudCBmb3IgMjU2LWJpdFxuICAvLyBtdWx0aXBsaWNhdGlvbiAobGlrZSBlbGxpcHRpYyBzZWNwMjU2azEpLlxuICB2YXIgY29tYjEwTXVsVG8gPSBmdW5jdGlvbiBjb21iMTBNdWxUbyAoc2VsZiwgbnVtLCBvdXQpIHtcbiAgICB2YXIgYSA9IHNlbGYud29yZHM7XG4gICAgdmFyIGIgPSBudW0ud29yZHM7XG4gICAgdmFyIG8gPSBvdXQud29yZHM7XG4gICAgdmFyIGMgPSAwO1xuICAgIHZhciBsbztcbiAgICB2YXIgbWlkO1xuICAgIHZhciBoaTtcbiAgICB2YXIgYTAgPSBhWzBdIHwgMDtcbiAgICB2YXIgYWwwID0gYTAgJiAweDFmZmY7XG4gICAgdmFyIGFoMCA9IGEwID4+PiAxMztcbiAgICB2YXIgYTEgPSBhWzFdIHwgMDtcbiAgICB2YXIgYWwxID0gYTEgJiAweDFmZmY7XG4gICAgdmFyIGFoMSA9IGExID4+PiAxMztcbiAgICB2YXIgYTIgPSBhWzJdIHwgMDtcbiAgICB2YXIgYWwyID0gYTIgJiAweDFmZmY7XG4gICAgdmFyIGFoMiA9IGEyID4+PiAxMztcbiAgICB2YXIgYTMgPSBhWzNdIHwgMDtcbiAgICB2YXIgYWwzID0gYTMgJiAweDFmZmY7XG4gICAgdmFyIGFoMyA9IGEzID4+PiAxMztcbiAgICB2YXIgYTQgPSBhWzRdIHwgMDtcbiAgICB2YXIgYWw0ID0gYTQgJiAweDFmZmY7XG4gICAgdmFyIGFoNCA9IGE0ID4+PiAxMztcbiAgICB2YXIgYTUgPSBhWzVdIHwgMDtcbiAgICB2YXIgYWw1ID0gYTUgJiAweDFmZmY7XG4gICAgdmFyIGFoNSA9IGE1ID4+PiAxMztcbiAgICB2YXIgYTYgPSBhWzZdIHwgMDtcbiAgICB2YXIgYWw2ID0gYTYgJiAweDFmZmY7XG4gICAgdmFyIGFoNiA9IGE2ID4+PiAxMztcbiAgICB2YXIgYTcgPSBhWzddIHwgMDtcbiAgICB2YXIgYWw3ID0gYTcgJiAweDFmZmY7XG4gICAgdmFyIGFoNyA9IGE3ID4+PiAxMztcbiAgICB2YXIgYTggPSBhWzhdIHwgMDtcbiAgICB2YXIgYWw4ID0gYTggJiAweDFmZmY7XG4gICAgdmFyIGFoOCA9IGE4ID4+PiAxMztcbiAgICB2YXIgYTkgPSBhWzldIHwgMDtcbiAgICB2YXIgYWw5ID0gYTkgJiAweDFmZmY7XG4gICAgdmFyIGFoOSA9IGE5ID4+PiAxMztcbiAgICB2YXIgYjAgPSBiWzBdIHwgMDtcbiAgICB2YXIgYmwwID0gYjAgJiAweDFmZmY7XG4gICAgdmFyIGJoMCA9IGIwID4+PiAxMztcbiAgICB2YXIgYjEgPSBiWzFdIHwgMDtcbiAgICB2YXIgYmwxID0gYjEgJiAweDFmZmY7XG4gICAgdmFyIGJoMSA9IGIxID4+PiAxMztcbiAgICB2YXIgYjIgPSBiWzJdIHwgMDtcbiAgICB2YXIgYmwyID0gYjIgJiAweDFmZmY7XG4gICAgdmFyIGJoMiA9IGIyID4+PiAxMztcbiAgICB2YXIgYjMgPSBiWzNdIHwgMDtcbiAgICB2YXIgYmwzID0gYjMgJiAweDFmZmY7XG4gICAgdmFyIGJoMyA9IGIzID4+PiAxMztcbiAgICB2YXIgYjQgPSBiWzRdIHwgMDtcbiAgICB2YXIgYmw0ID0gYjQgJiAweDFmZmY7XG4gICAgdmFyIGJoNCA9IGI0ID4+PiAxMztcbiAgICB2YXIgYjUgPSBiWzVdIHwgMDtcbiAgICB2YXIgYmw1ID0gYjUgJiAweDFmZmY7XG4gICAgdmFyIGJoNSA9IGI1ID4+PiAxMztcbiAgICB2YXIgYjYgPSBiWzZdIHwgMDtcbiAgICB2YXIgYmw2ID0gYjYgJiAweDFmZmY7XG4gICAgdmFyIGJoNiA9IGI2ID4+PiAxMztcbiAgICB2YXIgYjcgPSBiWzddIHwgMDtcbiAgICB2YXIgYmw3ID0gYjcgJiAweDFmZmY7XG4gICAgdmFyIGJoNyA9IGI3ID4+PiAxMztcbiAgICB2YXIgYjggPSBiWzhdIHwgMDtcbiAgICB2YXIgYmw4ID0gYjggJiAweDFmZmY7XG4gICAgdmFyIGJoOCA9IGI4ID4+PiAxMztcbiAgICB2YXIgYjkgPSBiWzldIHwgMDtcbiAgICB2YXIgYmw5ID0gYjkgJiAweDFmZmY7XG4gICAgdmFyIGJoOSA9IGI5ID4+PiAxMztcblxuICAgIG91dC5uZWdhdGl2ZSA9IHNlbGYubmVnYXRpdmUgXiBudW0ubmVnYXRpdmU7XG4gICAgb3V0Lmxlbmd0aCA9IDE5O1xuICAgIC8qIGsgPSAwICovXG4gICAgbG8gPSBNYXRoLmltdWwoYWwwLCBibDApO1xuICAgIG1pZCA9IE1hdGguaW11bChhbDAsIGJoMCk7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDAsIGJsMCkpIHwgMDtcbiAgICBoaSA9IE1hdGguaW11bChhaDAsIGJoMCk7XG4gICAgdmFyIHcwID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3MCA+Pj4gMjYpKSB8IDA7XG4gICAgdzAgJj0gMHgzZmZmZmZmO1xuICAgIC8qIGsgPSAxICovXG4gICAgbG8gPSBNYXRoLmltdWwoYWwxLCBibDApO1xuICAgIG1pZCA9IE1hdGguaW11bChhbDEsIGJoMCk7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDEsIGJsMCkpIHwgMDtcbiAgICBoaSA9IE1hdGguaW11bChhaDEsIGJoMCk7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwwLCBibDEpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDAsIGJoMSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMCwgYmwxKSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMCwgYmgxKSkgfCAwO1xuICAgIHZhciB3MSA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzEgPj4+IDI2KSkgfCAwO1xuICAgIHcxICY9IDB4M2ZmZmZmZjtcbiAgICAvKiBrID0gMiAqL1xuICAgIGxvID0gTWF0aC5pbXVsKGFsMiwgYmwwKTtcbiAgICBtaWQgPSBNYXRoLmltdWwoYWwyLCBiaDApO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgyLCBibDApKSB8IDA7XG4gICAgaGkgPSBNYXRoLmltdWwoYWgyLCBiaDApO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMSwgYmwxKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwxLCBiaDEpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDEsIGJsMSkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDEsIGJoMSkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDAsIGJsMikpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMCwgYmgyKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgwLCBibDIpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgwLCBiaDIpKSB8IDA7XG4gICAgdmFyIHcyID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3MiA+Pj4gMjYpKSB8IDA7XG4gICAgdzIgJj0gMHgzZmZmZmZmO1xuICAgIC8qIGsgPSAzICovXG4gICAgbG8gPSBNYXRoLmltdWwoYWwzLCBibDApO1xuICAgIG1pZCA9IE1hdGguaW11bChhbDMsIGJoMCk7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDMsIGJsMCkpIHwgMDtcbiAgICBoaSA9IE1hdGguaW11bChhaDMsIGJoMCk7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwyLCBibDEpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDIsIGJoMSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMiwgYmwxKSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMiwgYmgxKSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMSwgYmwyKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwxLCBiaDIpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDEsIGJsMikpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDEsIGJoMikpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDAsIGJsMykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMCwgYmgzKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgwLCBibDMpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgwLCBiaDMpKSB8IDA7XG4gICAgdmFyIHczID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3MyA+Pj4gMjYpKSB8IDA7XG4gICAgdzMgJj0gMHgzZmZmZmZmO1xuICAgIC8qIGsgPSA0ICovXG4gICAgbG8gPSBNYXRoLmltdWwoYWw0LCBibDApO1xuICAgIG1pZCA9IE1hdGguaW11bChhbDQsIGJoMCk7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDQsIGJsMCkpIHwgMDtcbiAgICBoaSA9IE1hdGguaW11bChhaDQsIGJoMCk7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwzLCBibDEpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDMsIGJoMSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMywgYmwxKSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMywgYmgxKSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMiwgYmwyKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwyLCBiaDIpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDIsIGJsMikpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDIsIGJoMikpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDEsIGJsMykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMSwgYmgzKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgxLCBibDMpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgxLCBiaDMpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwwLCBibDQpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDAsIGJoNCkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMCwgYmw0KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMCwgYmg0KSkgfCAwO1xuICAgIHZhciB3NCA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzQgPj4+IDI2KSkgfCAwO1xuICAgIHc0ICY9IDB4M2ZmZmZmZjtcbiAgICAvKiBrID0gNSAqL1xuICAgIGxvID0gTWF0aC5pbXVsKGFsNSwgYmwwKTtcbiAgICBtaWQgPSBNYXRoLmltdWwoYWw1LCBiaDApO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg1LCBibDApKSB8IDA7XG4gICAgaGkgPSBNYXRoLmltdWwoYWg1LCBiaDApO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNCwgYmwxKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw0LCBiaDEpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDQsIGJsMSkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDQsIGJoMSkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDMsIGJsMikpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMywgYmgyKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgzLCBibDIpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgzLCBiaDIpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwyLCBibDMpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDIsIGJoMykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMiwgYmwzKSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMiwgYmgzKSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMSwgYmw0KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwxLCBiaDQpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDEsIGJsNCkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDEsIGJoNCkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDAsIGJsNSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMCwgYmg1KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgwLCBibDUpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgwLCBiaDUpKSB8IDA7XG4gICAgdmFyIHc1ID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3NSA+Pj4gMjYpKSB8IDA7XG4gICAgdzUgJj0gMHgzZmZmZmZmO1xuICAgIC8qIGsgPSA2ICovXG4gICAgbG8gPSBNYXRoLmltdWwoYWw2LCBibDApO1xuICAgIG1pZCA9IE1hdGguaW11bChhbDYsIGJoMCk7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDYsIGJsMCkpIHwgMDtcbiAgICBoaSA9IE1hdGguaW11bChhaDYsIGJoMCk7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw1LCBibDEpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDUsIGJoMSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNSwgYmwxKSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNSwgYmgxKSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNCwgYmwyKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw0LCBiaDIpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDQsIGJsMikpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDQsIGJoMikpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDMsIGJsMykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMywgYmgzKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgzLCBibDMpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgzLCBiaDMpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwyLCBibDQpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDIsIGJoNCkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMiwgYmw0KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMiwgYmg0KSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMSwgYmw1KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwxLCBiaDUpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDEsIGJsNSkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDEsIGJoNSkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDAsIGJsNikpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMCwgYmg2KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgwLCBibDYpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgwLCBiaDYpKSB8IDA7XG4gICAgdmFyIHc2ID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3NiA+Pj4gMjYpKSB8IDA7XG4gICAgdzYgJj0gMHgzZmZmZmZmO1xuICAgIC8qIGsgPSA3ICovXG4gICAgbG8gPSBNYXRoLmltdWwoYWw3LCBibDApO1xuICAgIG1pZCA9IE1hdGguaW11bChhbDcsIGJoMCk7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDcsIGJsMCkpIHwgMDtcbiAgICBoaSA9IE1hdGguaW11bChhaDcsIGJoMCk7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw2LCBibDEpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDYsIGJoMSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNiwgYmwxKSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNiwgYmgxKSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNSwgYmwyKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw1LCBiaDIpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDUsIGJsMikpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDUsIGJoMikpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDQsIGJsMykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNCwgYmgzKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg0LCBibDMpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg0LCBiaDMpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwzLCBibDQpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDMsIGJoNCkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMywgYmw0KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMywgYmg0KSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMiwgYmw1KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwyLCBiaDUpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDIsIGJsNSkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDIsIGJoNSkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDEsIGJsNikpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMSwgYmg2KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgxLCBibDYpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgxLCBiaDYpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwwLCBibDcpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDAsIGJoNykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMCwgYmw3KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMCwgYmg3KSkgfCAwO1xuICAgIHZhciB3NyA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzcgPj4+IDI2KSkgfCAwO1xuICAgIHc3ICY9IDB4M2ZmZmZmZjtcbiAgICAvKiBrID0gOCAqL1xuICAgIGxvID0gTWF0aC5pbXVsKGFsOCwgYmwwKTtcbiAgICBtaWQgPSBNYXRoLmltdWwoYWw4LCBiaDApO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg4LCBibDApKSB8IDA7XG4gICAgaGkgPSBNYXRoLmltdWwoYWg4LCBiaDApO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNywgYmwxKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw3LCBiaDEpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDcsIGJsMSkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDcsIGJoMSkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDYsIGJsMikpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNiwgYmgyKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg2LCBibDIpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg2LCBiaDIpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw1LCBibDMpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDUsIGJoMykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNSwgYmwzKSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNSwgYmgzKSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNCwgYmw0KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw0LCBiaDQpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDQsIGJsNCkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDQsIGJoNCkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDMsIGJsNSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMywgYmg1KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgzLCBibDUpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgzLCBiaDUpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwyLCBibDYpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDIsIGJoNikpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMiwgYmw2KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMiwgYmg2KSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMSwgYmw3KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwxLCBiaDcpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDEsIGJsNykpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDEsIGJoNykpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDAsIGJsOCkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMCwgYmg4KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgwLCBibDgpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgwLCBiaDgpKSB8IDA7XG4gICAgdmFyIHc4ID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3OCA+Pj4gMjYpKSB8IDA7XG4gICAgdzggJj0gMHgzZmZmZmZmO1xuICAgIC8qIGsgPSA5ICovXG4gICAgbG8gPSBNYXRoLmltdWwoYWw5LCBibDApO1xuICAgIG1pZCA9IE1hdGguaW11bChhbDksIGJoMCk7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDksIGJsMCkpIHwgMDtcbiAgICBoaSA9IE1hdGguaW11bChhaDksIGJoMCk7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw4LCBibDEpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDgsIGJoMSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoOCwgYmwxKSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoOCwgYmgxKSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNywgYmwyKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw3LCBiaDIpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDcsIGJsMikpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDcsIGJoMikpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDYsIGJsMykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNiwgYmgzKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg2LCBibDMpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg2LCBiaDMpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw1LCBibDQpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDUsIGJoNCkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNSwgYmw0KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNSwgYmg0KSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNCwgYmw1KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw0LCBiaDUpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDQsIGJsNSkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDQsIGJoNSkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDMsIGJsNikpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMywgYmg2KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgzLCBibDYpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgzLCBiaDYpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwyLCBibDcpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDIsIGJoNykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMiwgYmw3KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMiwgYmg3KSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMSwgYmw4KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwxLCBiaDgpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDEsIGJsOCkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDEsIGJoOCkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDAsIGJsOSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMCwgYmg5KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgwLCBibDkpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgwLCBiaDkpKSB8IDA7XG4gICAgdmFyIHc5ID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3OSA+Pj4gMjYpKSB8IDA7XG4gICAgdzkgJj0gMHgzZmZmZmZmO1xuICAgIC8qIGsgPSAxMCAqL1xuICAgIGxvID0gTWF0aC5pbXVsKGFsOSwgYmwxKTtcbiAgICBtaWQgPSBNYXRoLmltdWwoYWw5LCBiaDEpO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg5LCBibDEpKSB8IDA7XG4gICAgaGkgPSBNYXRoLmltdWwoYWg5LCBiaDEpO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsOCwgYmwyKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw4LCBiaDIpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDgsIGJsMikpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDgsIGJoMikpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDcsIGJsMykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNywgYmgzKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg3LCBibDMpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg3LCBiaDMpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw2LCBibDQpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDYsIGJoNCkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNiwgYmw0KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNiwgYmg0KSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNSwgYmw1KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw1LCBiaDUpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDUsIGJsNSkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDUsIGJoNSkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDQsIGJsNikpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNCwgYmg2KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg0LCBibDYpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg0LCBiaDYpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwzLCBibDcpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDMsIGJoNykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMywgYmw3KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMywgYmg3KSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMiwgYmw4KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwyLCBiaDgpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDIsIGJsOCkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDIsIGJoOCkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDEsIGJsOSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMSwgYmg5KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgxLCBibDkpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgxLCBiaDkpKSB8IDA7XG4gICAgdmFyIHcxMCA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzEwID4+PiAyNikpIHwgMDtcbiAgICB3MTAgJj0gMHgzZmZmZmZmO1xuICAgIC8qIGsgPSAxMSAqL1xuICAgIGxvID0gTWF0aC5pbXVsKGFsOSwgYmwyKTtcbiAgICBtaWQgPSBNYXRoLmltdWwoYWw5LCBiaDIpO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg5LCBibDIpKSB8IDA7XG4gICAgaGkgPSBNYXRoLmltdWwoYWg5LCBiaDIpO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsOCwgYmwzKSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw4LCBiaDMpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDgsIGJsMykpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDgsIGJoMykpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDcsIGJsNCkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNywgYmg0KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg3LCBibDQpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg3LCBiaDQpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw2LCBibDUpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDYsIGJoNSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNiwgYmw1KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNiwgYmg1KSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNSwgYmw2KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw1LCBiaDYpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDUsIGJsNikpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDUsIGJoNikpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDQsIGJsNykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNCwgYmg3KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg0LCBibDcpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg0LCBiaDcpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWwzLCBibDgpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDMsIGJoOCkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoMywgYmw4KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoMywgYmg4KSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsMiwgYmw5KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWwyLCBiaDkpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDIsIGJsOSkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDIsIGJoOSkpIHwgMDtcbiAgICB2YXIgdzExID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3MTEgPj4+IDI2KSkgfCAwO1xuICAgIHcxMSAmPSAweDNmZmZmZmY7XG4gICAgLyogayA9IDEyICovXG4gICAgbG8gPSBNYXRoLmltdWwoYWw5LCBibDMpO1xuICAgIG1pZCA9IE1hdGguaW11bChhbDksIGJoMyk7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDksIGJsMykpIHwgMDtcbiAgICBoaSA9IE1hdGguaW11bChhaDksIGJoMyk7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw4LCBibDQpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDgsIGJoNCkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoOCwgYmw0KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoOCwgYmg0KSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNywgYmw1KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw3LCBiaDUpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDcsIGJsNSkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDcsIGJoNSkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDYsIGJsNikpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNiwgYmg2KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg2LCBibDYpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg2LCBiaDYpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw1LCBibDcpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDUsIGJoNykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNSwgYmw3KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNSwgYmg3KSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNCwgYmw4KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw0LCBiaDgpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDQsIGJsOCkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDQsIGJoOCkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDMsIGJsOSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsMywgYmg5KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWgzLCBibDkpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWgzLCBiaDkpKSB8IDA7XG4gICAgdmFyIHcxMiA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzEyID4+PiAyNikpIHwgMDtcbiAgICB3MTIgJj0gMHgzZmZmZmZmO1xuICAgIC8qIGsgPSAxMyAqL1xuICAgIGxvID0gTWF0aC5pbXVsKGFsOSwgYmw0KTtcbiAgICBtaWQgPSBNYXRoLmltdWwoYWw5LCBiaDQpO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg5LCBibDQpKSB8IDA7XG4gICAgaGkgPSBNYXRoLmltdWwoYWg5LCBiaDQpO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsOCwgYmw1KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw4LCBiaDUpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDgsIGJsNSkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDgsIGJoNSkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDcsIGJsNikpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNywgYmg2KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg3LCBibDYpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg3LCBiaDYpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw2LCBibDcpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDYsIGJoNykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNiwgYmw3KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNiwgYmg3KSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNSwgYmw4KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw1LCBiaDgpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDUsIGJsOCkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDUsIGJoOCkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDQsIGJsOSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNCwgYmg5KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg0LCBibDkpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg0LCBiaDkpKSB8IDA7XG4gICAgdmFyIHcxMyA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzEzID4+PiAyNikpIHwgMDtcbiAgICB3MTMgJj0gMHgzZmZmZmZmO1xuICAgIC8qIGsgPSAxNCAqL1xuICAgIGxvID0gTWF0aC5pbXVsKGFsOSwgYmw1KTtcbiAgICBtaWQgPSBNYXRoLmltdWwoYWw5LCBiaDUpO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg5LCBibDUpKSB8IDA7XG4gICAgaGkgPSBNYXRoLmltdWwoYWg5LCBiaDUpO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsOCwgYmw2KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw4LCBiaDYpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDgsIGJsNikpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDgsIGJoNikpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDcsIGJsNykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNywgYmg3KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg3LCBibDcpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg3LCBiaDcpKSB8IDA7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw2LCBibDgpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDYsIGJoOCkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoNiwgYmw4KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoNiwgYmg4KSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNSwgYmw5KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw1LCBiaDkpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDUsIGJsOSkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDUsIGJoOSkpIHwgMDtcbiAgICB2YXIgdzE0ID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3MTQgPj4+IDI2KSkgfCAwO1xuICAgIHcxNCAmPSAweDNmZmZmZmY7XG4gICAgLyogayA9IDE1ICovXG4gICAgbG8gPSBNYXRoLmltdWwoYWw5LCBibDYpO1xuICAgIG1pZCA9IE1hdGguaW11bChhbDksIGJoNik7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDksIGJsNikpIHwgMDtcbiAgICBoaSA9IE1hdGguaW11bChhaDksIGJoNik7XG4gICAgbG8gPSAobG8gKyBNYXRoLmltdWwoYWw4LCBibDcpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhbDgsIGJoNykpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFoOCwgYmw3KSkgfCAwO1xuICAgIGhpID0gKGhpICsgTWF0aC5pbXVsKGFoOCwgYmg3KSkgfCAwO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsNywgYmw4KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw3LCBiaDgpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDcsIGJsOCkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDcsIGJoOCkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDYsIGJsOSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNiwgYmg5KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg2LCBibDkpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg2LCBiaDkpKSB8IDA7XG4gICAgdmFyIHcxNSA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzE1ID4+PiAyNikpIHwgMDtcbiAgICB3MTUgJj0gMHgzZmZmZmZmO1xuICAgIC8qIGsgPSAxNiAqL1xuICAgIGxvID0gTWF0aC5pbXVsKGFsOSwgYmw3KTtcbiAgICBtaWQgPSBNYXRoLmltdWwoYWw5LCBiaDcpO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg5LCBibDcpKSB8IDA7XG4gICAgaGkgPSBNYXRoLmltdWwoYWg5LCBiaDcpO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsOCwgYmw4KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw4LCBiaDgpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDgsIGJsOCkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDgsIGJoOCkpIHwgMDtcbiAgICBsbyA9IChsbyArIE1hdGguaW11bChhbDcsIGJsOSkpIHwgMDtcbiAgICBtaWQgPSAobWlkICsgTWF0aC5pbXVsKGFsNywgYmg5KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg3LCBibDkpKSB8IDA7XG4gICAgaGkgPSAoaGkgKyBNYXRoLmltdWwoYWg3LCBiaDkpKSB8IDA7XG4gICAgdmFyIHcxNiA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzE2ID4+PiAyNikpIHwgMDtcbiAgICB3MTYgJj0gMHgzZmZmZmZmO1xuICAgIC8qIGsgPSAxNyAqL1xuICAgIGxvID0gTWF0aC5pbXVsKGFsOSwgYmw4KTtcbiAgICBtaWQgPSBNYXRoLmltdWwoYWw5LCBiaDgpO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWg5LCBibDgpKSB8IDA7XG4gICAgaGkgPSBNYXRoLmltdWwoYWg5LCBiaDgpO1xuICAgIGxvID0gKGxvICsgTWF0aC5pbXVsKGFsOCwgYmw5KSkgfCAwO1xuICAgIG1pZCA9IChtaWQgKyBNYXRoLmltdWwoYWw4LCBiaDkpKSB8IDA7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDgsIGJsOSkpIHwgMDtcbiAgICBoaSA9IChoaSArIE1hdGguaW11bChhaDgsIGJoOSkpIHwgMDtcbiAgICB2YXIgdzE3ID0gKCgoYyArIGxvKSB8IDApICsgKChtaWQgJiAweDFmZmYpIDw8IDEzKSkgfCAwO1xuICAgIGMgPSAoKChoaSArIChtaWQgPj4+IDEzKSkgfCAwKSArICh3MTcgPj4+IDI2KSkgfCAwO1xuICAgIHcxNyAmPSAweDNmZmZmZmY7XG4gICAgLyogayA9IDE4ICovXG4gICAgbG8gPSBNYXRoLmltdWwoYWw5LCBibDkpO1xuICAgIG1pZCA9IE1hdGguaW11bChhbDksIGJoOSk7XG4gICAgbWlkID0gKG1pZCArIE1hdGguaW11bChhaDksIGJsOSkpIHwgMDtcbiAgICBoaSA9IE1hdGguaW11bChhaDksIGJoOSk7XG4gICAgdmFyIHcxOCA9ICgoKGMgKyBsbykgfCAwKSArICgobWlkICYgMHgxZmZmKSA8PCAxMykpIHwgMDtcbiAgICBjID0gKCgoaGkgKyAobWlkID4+PiAxMykpIHwgMCkgKyAodzE4ID4+PiAyNikpIHwgMDtcbiAgICB3MTggJj0gMHgzZmZmZmZmO1xuICAgIG9bMF0gPSB3MDtcbiAgICBvWzFdID0gdzE7XG4gICAgb1syXSA9IHcyO1xuICAgIG9bM10gPSB3MztcbiAgICBvWzRdID0gdzQ7XG4gICAgb1s1XSA9IHc1O1xuICAgIG9bNl0gPSB3NjtcbiAgICBvWzddID0gdzc7XG4gICAgb1s4XSA9IHc4O1xuICAgIG9bOV0gPSB3OTtcbiAgICBvWzEwXSA9IHcxMDtcbiAgICBvWzExXSA9IHcxMTtcbiAgICBvWzEyXSA9IHcxMjtcbiAgICBvWzEzXSA9IHcxMztcbiAgICBvWzE0XSA9IHcxNDtcbiAgICBvWzE1XSA9IHcxNTtcbiAgICBvWzE2XSA9IHcxNjtcbiAgICBvWzE3XSA9IHcxNztcbiAgICBvWzE4XSA9IHcxODtcbiAgICBpZiAoYyAhPT0gMCkge1xuICAgICAgb1sxOV0gPSBjO1xuICAgICAgb3V0Lmxlbmd0aCsrO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIC8vIFBvbHlmaWxsIGNvbWJcbiAgaWYgKCFNYXRoLmltdWwpIHtcbiAgICBjb21iMTBNdWxUbyA9IHNtYWxsTXVsVG87XG4gIH1cblxuICBmdW5jdGlvbiBiaWdNdWxUbyAoc2VsZiwgbnVtLCBvdXQpIHtcbiAgICBvdXQubmVnYXRpdmUgPSBudW0ubmVnYXRpdmUgXiBzZWxmLm5lZ2F0aXZlO1xuICAgIG91dC5sZW5ndGggPSBzZWxmLmxlbmd0aCArIG51bS5sZW5ndGg7XG5cbiAgICB2YXIgY2FycnkgPSAwO1xuICAgIHZhciBobmNhcnJ5ID0gMDtcbiAgICBmb3IgKHZhciBrID0gMDsgayA8IG91dC5sZW5ndGggLSAxOyBrKyspIHtcbiAgICAgIC8vIFN1bSBhbGwgd29yZHMgd2l0aCB0aGUgc2FtZSBgaSArIGogPSBrYCBhbmQgYWNjdW11bGF0ZSBgbmNhcnJ5YCxcbiAgICAgIC8vIG5vdGUgdGhhdCBuY2FycnkgY291bGQgYmUgPj0gMHgzZmZmZmZmXG4gICAgICB2YXIgbmNhcnJ5ID0gaG5jYXJyeTtcbiAgICAgIGhuY2FycnkgPSAwO1xuICAgICAgdmFyIHJ3b3JkID0gY2FycnkgJiAweDNmZmZmZmY7XG4gICAgICB2YXIgbWF4SiA9IE1hdGgubWluKGssIG51bS5sZW5ndGggLSAxKTtcbiAgICAgIGZvciAodmFyIGogPSBNYXRoLm1heCgwLCBrIC0gc2VsZi5sZW5ndGggKyAxKTsgaiA8PSBtYXhKOyBqKyspIHtcbiAgICAgICAgdmFyIGkgPSBrIC0gajtcbiAgICAgICAgdmFyIGEgPSBzZWxmLndvcmRzW2ldIHwgMDtcbiAgICAgICAgdmFyIGIgPSBudW0ud29yZHNbal0gfCAwO1xuICAgICAgICB2YXIgciA9IGEgKiBiO1xuXG4gICAgICAgIHZhciBsbyA9IHIgJiAweDNmZmZmZmY7XG4gICAgICAgIG5jYXJyeSA9IChuY2FycnkgKyAoKHIgLyAweDQwMDAwMDApIHwgMCkpIHwgMDtcbiAgICAgICAgbG8gPSAobG8gKyByd29yZCkgfCAwO1xuICAgICAgICByd29yZCA9IGxvICYgMHgzZmZmZmZmO1xuICAgICAgICBuY2FycnkgPSAobmNhcnJ5ICsgKGxvID4+PiAyNikpIHwgMDtcblxuICAgICAgICBobmNhcnJ5ICs9IG5jYXJyeSA+Pj4gMjY7XG4gICAgICAgIG5jYXJyeSAmPSAweDNmZmZmZmY7XG4gICAgICB9XG4gICAgICBvdXQud29yZHNba10gPSByd29yZDtcbiAgICAgIGNhcnJ5ID0gbmNhcnJ5O1xuICAgICAgbmNhcnJ5ID0gaG5jYXJyeTtcbiAgICB9XG4gICAgaWYgKGNhcnJ5ICE9PSAwKSB7XG4gICAgICBvdXQud29yZHNba10gPSBjYXJyeTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0Lmxlbmd0aC0tO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQuc3RyaXAoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGp1bWJvTXVsVG8gKHNlbGYsIG51bSwgb3V0KSB7XG4gICAgdmFyIGZmdG0gPSBuZXcgRkZUTSgpO1xuICAgIHJldHVybiBmZnRtLm11bHAoc2VsZiwgbnVtLCBvdXQpO1xuICB9XG5cbiAgQk4ucHJvdG90eXBlLm11bFRvID0gZnVuY3Rpb24gbXVsVG8gKG51bSwgb3V0KSB7XG4gICAgdmFyIHJlcztcbiAgICB2YXIgbGVuID0gdGhpcy5sZW5ndGggKyBudW0ubGVuZ3RoO1xuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMTAgJiYgbnVtLmxlbmd0aCA9PT0gMTApIHtcbiAgICAgIHJlcyA9IGNvbWIxME11bFRvKHRoaXMsIG51bSwgb3V0KTtcbiAgICB9IGVsc2UgaWYgKGxlbiA8IDYzKSB7XG4gICAgICByZXMgPSBzbWFsbE11bFRvKHRoaXMsIG51bSwgb3V0KTtcbiAgICB9IGVsc2UgaWYgKGxlbiA8IDEwMjQpIHtcbiAgICAgIHJlcyA9IGJpZ011bFRvKHRoaXMsIG51bSwgb3V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzID0ganVtYm9NdWxUbyh0aGlzLCBudW0sIG91dCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfTtcblxuICAvLyBDb29sZXktVHVrZXkgYWxnb3JpdGhtIGZvciBGRlRcbiAgLy8gc2xpZ2h0bHkgcmV2aXNpdGVkIHRvIHJlbHkgb24gbG9vcGluZyBpbnN0ZWFkIG9mIHJlY3Vyc2lvblxuXG4gIGZ1bmN0aW9uIEZGVE0gKHgsIHkpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gIH1cblxuICBGRlRNLnByb3RvdHlwZS5tYWtlUkJUID0gZnVuY3Rpb24gbWFrZVJCVCAoTikge1xuICAgIHZhciB0ID0gbmV3IEFycmF5KE4pO1xuICAgIHZhciBsID0gQk4ucHJvdG90eXBlLl9jb3VudEJpdHMoTikgLSAxO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XG4gICAgICB0W2ldID0gdGhpcy5yZXZCaW4oaSwgbCwgTik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBiaW5hcnktcmV2ZXJzZWQgcmVwcmVzZW50YXRpb24gb2YgYHhgXG4gIEZGVE0ucHJvdG90eXBlLnJldkJpbiA9IGZ1bmN0aW9uIHJldkJpbiAoeCwgbCwgTikge1xuICAgIGlmICh4ID09PSAwIHx8IHggPT09IE4gLSAxKSByZXR1cm4geDtcblxuICAgIHZhciByYiA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHJiIHw9ICh4ICYgMSkgPDwgKGwgLSBpIC0gMSk7XG4gICAgICB4ID4+PSAxO1xuICAgIH1cblxuICAgIHJldHVybiByYjtcbiAgfTtcblxuICAvLyBQZXJmb3JtcyBcInR3ZWVkbGluZ1wiIHBoYXNlLCB0aGVyZWZvcmUgJ2VtdWxhdGluZydcbiAgLy8gYmVoYXZpb3VyIG9mIHRoZSByZWN1cnNpdmUgYWxnb3JpdGhtXG4gIEZGVE0ucHJvdG90eXBlLnBlcm11dGUgPSBmdW5jdGlvbiBwZXJtdXRlIChyYnQsIHJ3cywgaXdzLCBydHdzLCBpdHdzLCBOKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcbiAgICAgIHJ0d3NbaV0gPSByd3NbcmJ0W2ldXTtcbiAgICAgIGl0d3NbaV0gPSBpd3NbcmJ0W2ldXTtcbiAgICB9XG4gIH07XG5cbiAgRkZUTS5wcm90b3R5cGUudHJhbnNmb3JtID0gZnVuY3Rpb24gdHJhbnNmb3JtIChyd3MsIGl3cywgcnR3cywgaXR3cywgTiwgcmJ0KSB7XG4gICAgdGhpcy5wZXJtdXRlKHJidCwgcndzLCBpd3MsIHJ0d3MsIGl0d3MsIE4pO1xuXG4gICAgZm9yICh2YXIgcyA9IDE7IHMgPCBOOyBzIDw8PSAxKSB7XG4gICAgICB2YXIgbCA9IHMgPDwgMTtcblxuICAgICAgdmFyIHJ0d2RmID0gTWF0aC5jb3MoMiAqIE1hdGguUEkgLyBsKTtcbiAgICAgIHZhciBpdHdkZiA9IE1hdGguc2luKDIgKiBNYXRoLlBJIC8gbCk7XG5cbiAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgTjsgcCArPSBsKSB7XG4gICAgICAgIHZhciBydHdkZl8gPSBydHdkZjtcbiAgICAgICAgdmFyIGl0d2RmXyA9IGl0d2RmO1xuXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgczsgaisrKSB7XG4gICAgICAgICAgdmFyIHJlID0gcnR3c1twICsgal07XG4gICAgICAgICAgdmFyIGllID0gaXR3c1twICsgal07XG5cbiAgICAgICAgICB2YXIgcm8gPSBydHdzW3AgKyBqICsgc107XG4gICAgICAgICAgdmFyIGlvID0gaXR3c1twICsgaiArIHNdO1xuXG4gICAgICAgICAgdmFyIHJ4ID0gcnR3ZGZfICogcm8gLSBpdHdkZl8gKiBpbztcblxuICAgICAgICAgIGlvID0gcnR3ZGZfICogaW8gKyBpdHdkZl8gKiBybztcbiAgICAgICAgICBybyA9IHJ4O1xuXG4gICAgICAgICAgcnR3c1twICsgal0gPSByZSArIHJvO1xuICAgICAgICAgIGl0d3NbcCArIGpdID0gaWUgKyBpbztcblxuICAgICAgICAgIHJ0d3NbcCArIGogKyBzXSA9IHJlIC0gcm87XG4gICAgICAgICAgaXR3c1twICsgaiArIHNdID0gaWUgLSBpbztcblxuICAgICAgICAgIC8qIGpzaGludCBtYXhkZXB0aCA6IGZhbHNlICovXG4gICAgICAgICAgaWYgKGogIT09IGwpIHtcbiAgICAgICAgICAgIHJ4ID0gcnR3ZGYgKiBydHdkZl8gLSBpdHdkZiAqIGl0d2RmXztcblxuICAgICAgICAgICAgaXR3ZGZfID0gcnR3ZGYgKiBpdHdkZl8gKyBpdHdkZiAqIHJ0d2RmXztcbiAgICAgICAgICAgIHJ0d2RmXyA9IHJ4O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBGRlRNLnByb3RvdHlwZS5ndWVzc0xlbjEzYiA9IGZ1bmN0aW9uIGd1ZXNzTGVuMTNiIChuLCBtKSB7XG4gICAgdmFyIE4gPSBNYXRoLm1heChtLCBuKSB8IDE7XG4gICAgdmFyIG9kZCA9IE4gJiAxO1xuICAgIHZhciBpID0gMDtcbiAgICBmb3IgKE4gPSBOIC8gMiB8IDA7IE47IE4gPSBOID4+PiAxKSB7XG4gICAgICBpKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIDEgPDwgaSArIDEgKyBvZGQ7XG4gIH07XG5cbiAgRkZUTS5wcm90b3R5cGUuY29uanVnYXRlID0gZnVuY3Rpb24gY29uanVnYXRlIChyd3MsIGl3cywgTikge1xuICAgIGlmIChOIDw9IDEpIHJldHVybjtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTiAvIDI7IGkrKykge1xuICAgICAgdmFyIHQgPSByd3NbaV07XG5cbiAgICAgIHJ3c1tpXSA9IHJ3c1tOIC0gaSAtIDFdO1xuICAgICAgcndzW04gLSBpIC0gMV0gPSB0O1xuXG4gICAgICB0ID0gaXdzW2ldO1xuXG4gICAgICBpd3NbaV0gPSAtaXdzW04gLSBpIC0gMV07XG4gICAgICBpd3NbTiAtIGkgLSAxXSA9IC10O1xuICAgIH1cbiAgfTtcblxuICBGRlRNLnByb3RvdHlwZS5ub3JtYWxpemUxM2IgPSBmdW5jdGlvbiBub3JtYWxpemUxM2IgKHdzLCBOKSB7XG4gICAgdmFyIGNhcnJ5ID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE4gLyAyOyBpKyspIHtcbiAgICAgIHZhciB3ID0gTWF0aC5yb3VuZCh3c1syICogaSArIDFdIC8gTikgKiAweDIwMDAgK1xuICAgICAgICBNYXRoLnJvdW5kKHdzWzIgKiBpXSAvIE4pICtcbiAgICAgICAgY2Fycnk7XG5cbiAgICAgIHdzW2ldID0gdyAmIDB4M2ZmZmZmZjtcblxuICAgICAgaWYgKHcgPCAweDQwMDAwMDApIHtcbiAgICAgICAgY2FycnkgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FycnkgPSB3IC8gMHg0MDAwMDAwIHwgMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gd3M7XG4gIH07XG5cbiAgRkZUTS5wcm90b3R5cGUuY29udmVydDEzYiA9IGZ1bmN0aW9uIGNvbnZlcnQxM2IgKHdzLCBsZW4sIHJ3cywgTikge1xuICAgIHZhciBjYXJyeSA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY2FycnkgPSBjYXJyeSArICh3c1tpXSB8IDApO1xuXG4gICAgICByd3NbMiAqIGldID0gY2FycnkgJiAweDFmZmY7IGNhcnJ5ID0gY2FycnkgPj4+IDEzO1xuICAgICAgcndzWzIgKiBpICsgMV0gPSBjYXJyeSAmIDB4MWZmZjsgY2FycnkgPSBjYXJyeSA+Pj4gMTM7XG4gICAgfVxuXG4gICAgLy8gUGFkIHdpdGggemVyb2VzXG4gICAgZm9yIChpID0gMiAqIGxlbjsgaSA8IE47ICsraSkge1xuICAgICAgcndzW2ldID0gMDtcbiAgICB9XG5cbiAgICBhc3NlcnQoY2FycnkgPT09IDApO1xuICAgIGFzc2VydCgoY2FycnkgJiB+MHgxZmZmKSA9PT0gMCk7XG4gIH07XG5cbiAgRkZUTS5wcm90b3R5cGUuc3R1YiA9IGZ1bmN0aW9uIHN0dWIgKE4pIHtcbiAgICB2YXIgcGggPSBuZXcgQXJyYXkoTik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcbiAgICAgIHBoW2ldID0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGg7XG4gIH07XG5cbiAgRkZUTS5wcm90b3R5cGUubXVscCA9IGZ1bmN0aW9uIG11bHAgKHgsIHksIG91dCkge1xuICAgIHZhciBOID0gMiAqIHRoaXMuZ3Vlc3NMZW4xM2IoeC5sZW5ndGgsIHkubGVuZ3RoKTtcblxuICAgIHZhciByYnQgPSB0aGlzLm1ha2VSQlQoTik7XG5cbiAgICB2YXIgXyA9IHRoaXMuc3R1YihOKTtcblxuICAgIHZhciByd3MgPSBuZXcgQXJyYXkoTik7XG4gICAgdmFyIHJ3c3QgPSBuZXcgQXJyYXkoTik7XG4gICAgdmFyIGl3c3QgPSBuZXcgQXJyYXkoTik7XG5cbiAgICB2YXIgbnJ3cyA9IG5ldyBBcnJheShOKTtcbiAgICB2YXIgbnJ3c3QgPSBuZXcgQXJyYXkoTik7XG4gICAgdmFyIG5pd3N0ID0gbmV3IEFycmF5KE4pO1xuXG4gICAgdmFyIHJtd3MgPSBvdXQud29yZHM7XG4gICAgcm13cy5sZW5ndGggPSBOO1xuXG4gICAgdGhpcy5jb252ZXJ0MTNiKHgud29yZHMsIHgubGVuZ3RoLCByd3MsIE4pO1xuICAgIHRoaXMuY29udmVydDEzYih5LndvcmRzLCB5Lmxlbmd0aCwgbnJ3cywgTik7XG5cbiAgICB0aGlzLnRyYW5zZm9ybShyd3MsIF8sIHJ3c3QsIGl3c3QsIE4sIHJidCk7XG4gICAgdGhpcy50cmFuc2Zvcm0obnJ3cywgXywgbnJ3c3QsIG5pd3N0LCBOLCByYnQpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcbiAgICAgIHZhciByeCA9IHJ3c3RbaV0gKiBucndzdFtpXSAtIGl3c3RbaV0gKiBuaXdzdFtpXTtcbiAgICAgIGl3c3RbaV0gPSByd3N0W2ldICogbml3c3RbaV0gKyBpd3N0W2ldICogbnJ3c3RbaV07XG4gICAgICByd3N0W2ldID0gcng7XG4gICAgfVxuXG4gICAgdGhpcy5jb25qdWdhdGUocndzdCwgaXdzdCwgTik7XG4gICAgdGhpcy50cmFuc2Zvcm0ocndzdCwgaXdzdCwgcm13cywgXywgTiwgcmJ0KTtcbiAgICB0aGlzLmNvbmp1Z2F0ZShybXdzLCBfLCBOKTtcbiAgICB0aGlzLm5vcm1hbGl6ZTEzYihybXdzLCBOKTtcblxuICAgIG91dC5uZWdhdGl2ZSA9IHgubmVnYXRpdmUgXiB5Lm5lZ2F0aXZlO1xuICAgIG91dC5sZW5ndGggPSB4Lmxlbmd0aCArIHkubGVuZ3RoO1xuICAgIHJldHVybiBvdXQuc3RyaXAoKTtcbiAgfTtcblxuICAvLyBNdWx0aXBseSBgdGhpc2AgYnkgYG51bWBcbiAgQk4ucHJvdG90eXBlLm11bCA9IGZ1bmN0aW9uIG11bCAobnVtKSB7XG4gICAgdmFyIG91dCA9IG5ldyBCTihudWxsKTtcbiAgICBvdXQud29yZHMgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGggKyBudW0ubGVuZ3RoKTtcbiAgICByZXR1cm4gdGhpcy5tdWxUbyhudW0sIG91dCk7XG4gIH07XG5cbiAgLy8gTXVsdGlwbHkgZW1wbG95aW5nIEZGVFxuICBCTi5wcm90b3R5cGUubXVsZiA9IGZ1bmN0aW9uIG11bGYgKG51bSkge1xuICAgIHZhciBvdXQgPSBuZXcgQk4obnVsbCk7XG4gICAgb3V0LndvcmRzID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoICsgbnVtLmxlbmd0aCk7XG4gICAgcmV0dXJuIGp1bWJvTXVsVG8odGhpcywgbnVtLCBvdXQpO1xuICB9O1xuXG4gIC8vIEluLXBsYWNlIE11bHRpcGxpY2F0aW9uXG4gIEJOLnByb3RvdHlwZS5pbXVsID0gZnVuY3Rpb24gaW11bCAobnVtKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5tdWxUbyhudW0sIHRoaXMpO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5pbXVsbiA9IGZ1bmN0aW9uIGltdWxuIChudW0pIHtcbiAgICBhc3NlcnQodHlwZW9mIG51bSA9PT0gJ251bWJlcicpO1xuICAgIGFzc2VydChudW0gPCAweDQwMDAwMDApO1xuXG4gICAgLy8gQ2FycnlcbiAgICB2YXIgY2FycnkgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHcgPSAodGhpcy53b3Jkc1tpXSB8IDApICogbnVtO1xuICAgICAgdmFyIGxvID0gKHcgJiAweDNmZmZmZmYpICsgKGNhcnJ5ICYgMHgzZmZmZmZmKTtcbiAgICAgIGNhcnJ5ID4+PSAyNjtcbiAgICAgIGNhcnJ5ICs9ICh3IC8gMHg0MDAwMDAwKSB8IDA7XG4gICAgICAvLyBOT1RFOiBsbyBpcyAyN2JpdCBtYXhpbXVtXG4gICAgICBjYXJyeSArPSBsbyA+Pj4gMjY7XG4gICAgICB0aGlzLndvcmRzW2ldID0gbG8gJiAweDNmZmZmZmY7XG4gICAgfVxuXG4gICAgaWYgKGNhcnJ5ICE9PSAwKSB7XG4gICAgICB0aGlzLndvcmRzW2ldID0gY2Fycnk7XG4gICAgICB0aGlzLmxlbmd0aCsrO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5tdWxuID0gZnVuY3Rpb24gbXVsbiAobnVtKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pbXVsbihudW0pO1xuICB9O1xuXG4gIC8vIGB0aGlzYCAqIGB0aGlzYFxuICBCTi5wcm90b3R5cGUuc3FyID0gZnVuY3Rpb24gc3FyICgpIHtcbiAgICByZXR1cm4gdGhpcy5tdWwodGhpcyk7XG4gIH07XG5cbiAgLy8gYHRoaXNgICogYHRoaXNgIGluLXBsYWNlXG4gIEJOLnByb3RvdHlwZS5pc3FyID0gZnVuY3Rpb24gaXNxciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW11bCh0aGlzLmNsb25lKCkpO1xuICB9O1xuXG4gIC8vIE1hdGgucG93KGB0aGlzYCwgYG51bWApXG4gIEJOLnByb3RvdHlwZS5wb3cgPSBmdW5jdGlvbiBwb3cgKG51bSkge1xuICAgIHZhciB3ID0gdG9CaXRBcnJheShudW0pO1xuICAgIGlmICh3Lmxlbmd0aCA9PT0gMCkgcmV0dXJuIG5ldyBCTigxKTtcblxuICAgIC8vIFNraXAgbGVhZGluZyB6ZXJvZXNcbiAgICB2YXIgcmVzID0gdGhpcztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHcubGVuZ3RoOyBpKyssIHJlcyA9IHJlcy5zcXIoKSkge1xuICAgICAgaWYgKHdbaV0gIT09IDApIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICgrK2kgPCB3Lmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgcSA9IHJlcy5zcXIoKTsgaSA8IHcubGVuZ3RoOyBpKyssIHEgPSBxLnNxcigpKSB7XG4gICAgICAgIGlmICh3W2ldID09PSAwKSBjb250aW51ZTtcblxuICAgICAgICByZXMgPSByZXMubXVsKHEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH07XG5cbiAgLy8gU2hpZnQtbGVmdCBpbi1wbGFjZVxuICBCTi5wcm90b3R5cGUuaXVzaGxuID0gZnVuY3Rpb24gaXVzaGxuIChiaXRzKSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBiaXRzID09PSAnbnVtYmVyJyAmJiBiaXRzID49IDApO1xuICAgIHZhciByID0gYml0cyAlIDI2O1xuICAgIHZhciBzID0gKGJpdHMgLSByKSAvIDI2O1xuICAgIHZhciBjYXJyeU1hc2sgPSAoMHgzZmZmZmZmID4+PiAoMjYgLSByKSkgPDwgKDI2IC0gcik7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAociAhPT0gMCkge1xuICAgICAgdmFyIGNhcnJ5ID0gMDtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5ld0NhcnJ5ID0gdGhpcy53b3Jkc1tpXSAmIGNhcnJ5TWFzaztcbiAgICAgICAgdmFyIGMgPSAoKHRoaXMud29yZHNbaV0gfCAwKSAtIG5ld0NhcnJ5KSA8PCByO1xuICAgICAgICB0aGlzLndvcmRzW2ldID0gYyB8IGNhcnJ5O1xuICAgICAgICBjYXJyeSA9IG5ld0NhcnJ5ID4+PiAoMjYgLSByKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNhcnJ5KSB7XG4gICAgICAgIHRoaXMud29yZHNbaV0gPSBjYXJyeTtcbiAgICAgICAgdGhpcy5sZW5ndGgrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocyAhPT0gMCkge1xuICAgICAgZm9yIChpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB0aGlzLndvcmRzW2kgKyBzXSA9IHRoaXMud29yZHNbaV07XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBzOyBpKyspIHtcbiAgICAgICAgdGhpcy53b3Jkc1tpXSA9IDA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGVuZ3RoICs9IHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuaXNobG4gPSBmdW5jdGlvbiBpc2hsbiAoYml0cykge1xuICAgIC8vIFRPRE8oaW5kdXRueSk6IGltcGxlbWVudCBtZVxuICAgIGFzc2VydCh0aGlzLm5lZ2F0aXZlID09PSAwKTtcbiAgICByZXR1cm4gdGhpcy5pdXNobG4oYml0cyk7XG4gIH07XG5cbiAgLy8gU2hpZnQtcmlnaHQgaW4tcGxhY2VcbiAgLy8gTk9URTogYGhpbnRgIGlzIGEgbG93ZXN0IGJpdCBiZWZvcmUgdHJhaWxpbmcgemVyb2VzXG4gIC8vIE5PVEU6IGlmIGBleHRlbmRlZGAgaXMgcHJlc2VudCAtIGl0IHdpbGwgYmUgZmlsbGVkIHdpdGggZGVzdHJveWVkIGJpdHNcbiAgQk4ucHJvdG90eXBlLml1c2hybiA9IGZ1bmN0aW9uIGl1c2hybiAoYml0cywgaGludCwgZXh0ZW5kZWQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGJpdHMgPT09ICdudW1iZXInICYmIGJpdHMgPj0gMCk7XG4gICAgdmFyIGg7XG4gICAgaWYgKGhpbnQpIHtcbiAgICAgIGggPSAoaGludCAtIChoaW50ICUgMjYpKSAvIDI2O1xuICAgIH0gZWxzZSB7XG4gICAgICBoID0gMDtcbiAgICB9XG5cbiAgICB2YXIgciA9IGJpdHMgJSAyNjtcbiAgICB2YXIgcyA9IE1hdGgubWluKChiaXRzIC0gcikgLyAyNiwgdGhpcy5sZW5ndGgpO1xuICAgIHZhciBtYXNrID0gMHgzZmZmZmZmIF4gKCgweDNmZmZmZmYgPj4+IHIpIDw8IHIpO1xuICAgIHZhciBtYXNrZWRXb3JkcyA9IGV4dGVuZGVkO1xuXG4gICAgaCAtPSBzO1xuICAgIGggPSBNYXRoLm1heCgwLCBoKTtcblxuICAgIC8vIEV4dGVuZGVkIG1vZGUsIGNvcHkgbWFza2VkIHBhcnRcbiAgICBpZiAobWFza2VkV29yZHMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKSB7XG4gICAgICAgIG1hc2tlZFdvcmRzLndvcmRzW2ldID0gdGhpcy53b3Jkc1tpXTtcbiAgICAgIH1cbiAgICAgIG1hc2tlZFdvcmRzLmxlbmd0aCA9IHM7XG4gICAgfVxuXG4gICAgaWYgKHMgPT09IDApIHtcbiAgICAgIC8vIE5vLW9wLCB3ZSBzaG91bGQgbm90IG1vdmUgYW55dGhpbmcgYXQgYWxsXG4gICAgfSBlbHNlIGlmICh0aGlzLmxlbmd0aCA+IHMpIHtcbiAgICAgIHRoaXMubGVuZ3RoIC09IHM7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLndvcmRzW2ldID0gdGhpcy53b3Jkc1tpICsgc107XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMud29yZHNbMF0gPSAwO1xuICAgICAgdGhpcy5sZW5ndGggPSAxO1xuICAgIH1cblxuICAgIHZhciBjYXJyeSA9IDA7XG4gICAgZm9yIChpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDAgJiYgKGNhcnJ5ICE9PSAwIHx8IGkgPj0gaCk7IGktLSkge1xuICAgICAgdmFyIHdvcmQgPSB0aGlzLndvcmRzW2ldIHwgMDtcbiAgICAgIHRoaXMud29yZHNbaV0gPSAoY2FycnkgPDwgKDI2IC0gcikpIHwgKHdvcmQgPj4+IHIpO1xuICAgICAgY2FycnkgPSB3b3JkICYgbWFzaztcbiAgICB9XG5cbiAgICAvLyBQdXNoIGNhcnJpZWQgYml0cyBhcyBhIG1hc2tcbiAgICBpZiAobWFza2VkV29yZHMgJiYgY2FycnkgIT09IDApIHtcbiAgICAgIG1hc2tlZFdvcmRzLndvcmRzW21hc2tlZFdvcmRzLmxlbmd0aCsrXSA9IGNhcnJ5O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy53b3Jkc1swXSA9IDA7XG4gICAgICB0aGlzLmxlbmd0aCA9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuaXNocm4gPSBmdW5jdGlvbiBpc2hybiAoYml0cywgaGludCwgZXh0ZW5kZWQpIHtcbiAgICAvLyBUT0RPKGluZHV0bnkpOiBpbXBsZW1lbnQgbWVcbiAgICBhc3NlcnQodGhpcy5uZWdhdGl2ZSA9PT0gMCk7XG4gICAgcmV0dXJuIHRoaXMuaXVzaHJuKGJpdHMsIGhpbnQsIGV4dGVuZGVkKTtcbiAgfTtcblxuICAvLyBTaGlmdC1sZWZ0XG4gIEJOLnByb3RvdHlwZS5zaGxuID0gZnVuY3Rpb24gc2hsbiAoYml0cykge1xuICAgIHJldHVybiB0aGlzLmNsb25lKCkuaXNobG4oYml0cyk7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLnVzaGxuID0gZnVuY3Rpb24gdXNobG4gKGJpdHMpIHtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLml1c2hsbihiaXRzKTtcbiAgfTtcblxuICAvLyBTaGlmdC1yaWdodFxuICBCTi5wcm90b3R5cGUuc2hybiA9IGZ1bmN0aW9uIHNocm4gKGJpdHMpIHtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmlzaHJuKGJpdHMpO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS51c2hybiA9IGZ1bmN0aW9uIHVzaHJuIChiaXRzKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pdXNocm4oYml0cyk7XG4gIH07XG5cbiAgLy8gVGVzdCBpZiBuIGJpdCBpcyBzZXRcbiAgQk4ucHJvdG90eXBlLnRlc3RuID0gZnVuY3Rpb24gdGVzdG4gKGJpdCkge1xuICAgIGFzc2VydCh0eXBlb2YgYml0ID09PSAnbnVtYmVyJyAmJiBiaXQgPj0gMCk7XG4gICAgdmFyIHIgPSBiaXQgJSAyNjtcbiAgICB2YXIgcyA9IChiaXQgLSByKSAvIDI2O1xuICAgIHZhciBxID0gMSA8PCByO1xuXG4gICAgLy8gRmFzdCBjYXNlOiBiaXQgaXMgbXVjaCBoaWdoZXIgdGhhbiBhbGwgZXhpc3Rpbmcgd29yZHNcbiAgICBpZiAodGhpcy5sZW5ndGggPD0gcykgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gQ2hlY2sgYml0IGFuZCByZXR1cm5cbiAgICB2YXIgdyA9IHRoaXMud29yZHNbc107XG5cbiAgICByZXR1cm4gISEodyAmIHEpO1xuICB9O1xuXG4gIC8vIFJldHVybiBvbmx5IGxvd2VycyBiaXRzIG9mIG51bWJlciAoaW4tcGxhY2UpXG4gIEJOLnByb3RvdHlwZS5pbWFza24gPSBmdW5jdGlvbiBpbWFza24gKGJpdHMpIHtcbiAgICBhc3NlcnQodHlwZW9mIGJpdHMgPT09ICdudW1iZXInICYmIGJpdHMgPj0gMCk7XG4gICAgdmFyIHIgPSBiaXRzICUgMjY7XG4gICAgdmFyIHMgPSAoYml0cyAtIHIpIC8gMjY7XG5cbiAgICBhc3NlcnQodGhpcy5uZWdhdGl2ZSA9PT0gMCwgJ2ltYXNrbiB3b3JrcyBvbmx5IHdpdGggcG9zaXRpdmUgbnVtYmVycycpO1xuXG4gICAgaWYgKHRoaXMubGVuZ3RoIDw9IHMpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmIChyICE9PSAwKSB7XG4gICAgICBzKys7XG4gICAgfVxuICAgIHRoaXMubGVuZ3RoID0gTWF0aC5taW4ocywgdGhpcy5sZW5ndGgpO1xuXG4gICAgaWYgKHIgIT09IDApIHtcbiAgICAgIHZhciBtYXNrID0gMHgzZmZmZmZmIF4gKCgweDNmZmZmZmYgPj4+IHIpIDw8IHIpO1xuICAgICAgdGhpcy53b3Jkc1t0aGlzLmxlbmd0aCAtIDFdICY9IG1hc2s7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gb25seSBsb3dlcnMgYml0cyBvZiBudW1iZXJcbiAgQk4ucHJvdG90eXBlLm1hc2tuID0gZnVuY3Rpb24gbWFza24gKGJpdHMpIHtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmltYXNrbihiaXRzKTtcbiAgfTtcblxuICAvLyBBZGQgcGxhaW4gbnVtYmVyIGBudW1gIHRvIGB0aGlzYFxuICBCTi5wcm90b3R5cGUuaWFkZG4gPSBmdW5jdGlvbiBpYWRkbiAobnVtKSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBudW0gPT09ICdudW1iZXInKTtcbiAgICBhc3NlcnQobnVtIDwgMHg0MDAwMDAwKTtcbiAgICBpZiAobnVtIDwgMCkgcmV0dXJuIHRoaXMuaXN1Ym4oLW51bSk7XG5cbiAgICAvLyBQb3NzaWJsZSBzaWduIGNoYW5nZVxuICAgIGlmICh0aGlzLm5lZ2F0aXZlICE9PSAwKSB7XG4gICAgICBpZiAodGhpcy5sZW5ndGggPT09IDEgJiYgKHRoaXMud29yZHNbMF0gfCAwKSA8IG51bSkge1xuICAgICAgICB0aGlzLndvcmRzWzBdID0gbnVtIC0gKHRoaXMud29yZHNbMF0gfCAwKTtcbiAgICAgICAgdGhpcy5uZWdhdGl2ZSA9IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMDtcbiAgICAgIHRoaXMuaXN1Ym4obnVtKTtcbiAgICAgIHRoaXMubmVnYXRpdmUgPSAxO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhvdXQgY2hlY2tzXG4gICAgcmV0dXJuIHRoaXMuX2lhZGRuKG51bSk7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLl9pYWRkbiA9IGZ1bmN0aW9uIF9pYWRkbiAobnVtKSB7XG4gICAgdGhpcy53b3Jkc1swXSArPSBudW07XG5cbiAgICAvLyBDYXJyeVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGggJiYgdGhpcy53b3Jkc1tpXSA+PSAweDQwMDAwMDA7IGkrKykge1xuICAgICAgdGhpcy53b3Jkc1tpXSAtPSAweDQwMDAwMDA7XG4gICAgICBpZiAoaSA9PT0gdGhpcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHRoaXMud29yZHNbaSArIDFdID0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMud29yZHNbaSArIDFdKys7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubGVuZ3RoID0gTWF0aC5tYXgodGhpcy5sZW5ndGgsIGkgKyAxKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8vIFN1YnRyYWN0IHBsYWluIG51bWJlciBgbnVtYCBmcm9tIGB0aGlzYFxuICBCTi5wcm90b3R5cGUuaXN1Ym4gPSBmdW5jdGlvbiBpc3VibiAobnVtKSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBudW0gPT09ICdudW1iZXInKTtcbiAgICBhc3NlcnQobnVtIDwgMHg0MDAwMDAwKTtcbiAgICBpZiAobnVtIDwgMCkgcmV0dXJuIHRoaXMuaWFkZG4oLW51bSk7XG5cbiAgICBpZiAodGhpcy5uZWdhdGl2ZSAhPT0gMCkge1xuICAgICAgdGhpcy5uZWdhdGl2ZSA9IDA7XG4gICAgICB0aGlzLmlhZGRuKG51bSk7XG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMud29yZHNbMF0gLT0gbnVtO1xuXG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAxICYmIHRoaXMud29yZHNbMF0gPCAwKSB7XG4gICAgICB0aGlzLndvcmRzWzBdID0gLXRoaXMud29yZHNbMF07XG4gICAgICB0aGlzLm5lZ2F0aXZlID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ2FycnlcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGggJiYgdGhpcy53b3Jkc1tpXSA8IDA7IGkrKykge1xuICAgICAgICB0aGlzLndvcmRzW2ldICs9IDB4NDAwMDAwMDtcbiAgICAgICAgdGhpcy53b3Jkc1tpICsgMV0gLT0gMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdHJpcCgpO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5hZGRuID0gZnVuY3Rpb24gYWRkbiAobnVtKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pYWRkbihudW0pO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5zdWJuID0gZnVuY3Rpb24gc3VibiAobnVtKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pc3VibihudW0pO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5pYWJzID0gZnVuY3Rpb24gaWFicyAoKSB7XG4gICAgdGhpcy5uZWdhdGl2ZSA9IDA7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuYWJzID0gZnVuY3Rpb24gYWJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmlhYnMoKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuX2lzaGxuc3VibXVsID0gZnVuY3Rpb24gX2lzaGxuc3VibXVsIChudW0sIG11bCwgc2hpZnQpIHtcbiAgICB2YXIgbGVuID0gbnVtLmxlbmd0aCArIHNoaWZ0O1xuICAgIHZhciBpO1xuXG4gICAgdGhpcy5fZXhwYW5kKGxlbik7XG5cbiAgICB2YXIgdztcbiAgICB2YXIgY2FycnkgPSAwO1xuICAgIGZvciAoaSA9IDA7IGkgPCBudW0ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHcgPSAodGhpcy53b3Jkc1tpICsgc2hpZnRdIHwgMCkgKyBjYXJyeTtcbiAgICAgIHZhciByaWdodCA9IChudW0ud29yZHNbaV0gfCAwKSAqIG11bDtcbiAgICAgIHcgLT0gcmlnaHQgJiAweDNmZmZmZmY7XG4gICAgICBjYXJyeSA9ICh3ID4+IDI2KSAtICgocmlnaHQgLyAweDQwMDAwMDApIHwgMCk7XG4gICAgICB0aGlzLndvcmRzW2kgKyBzaGlmdF0gPSB3ICYgMHgzZmZmZmZmO1xuICAgIH1cbiAgICBmb3IgKDsgaSA8IHRoaXMubGVuZ3RoIC0gc2hpZnQ7IGkrKykge1xuICAgICAgdyA9ICh0aGlzLndvcmRzW2kgKyBzaGlmdF0gfCAwKSArIGNhcnJ5O1xuICAgICAgY2FycnkgPSB3ID4+IDI2O1xuICAgICAgdGhpcy53b3Jkc1tpICsgc2hpZnRdID0gdyAmIDB4M2ZmZmZmZjtcbiAgICB9XG5cbiAgICBpZiAoY2FycnkgPT09IDApIHJldHVybiB0aGlzLnN0cmlwKCk7XG5cbiAgICAvLyBTdWJ0cmFjdGlvbiBvdmVyZmxvd1xuICAgIGFzc2VydChjYXJyeSA9PT0gLTEpO1xuICAgIGNhcnJ5ID0gMDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgdyA9IC0odGhpcy53b3Jkc1tpXSB8IDApICsgY2Fycnk7XG4gICAgICBjYXJyeSA9IHcgPj4gMjY7XG4gICAgICB0aGlzLndvcmRzW2ldID0gdyAmIDB4M2ZmZmZmZjtcbiAgICB9XG4gICAgdGhpcy5uZWdhdGl2ZSA9IDE7XG5cbiAgICByZXR1cm4gdGhpcy5zdHJpcCgpO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5fd29yZERpdiA9IGZ1bmN0aW9uIF93b3JkRGl2IChudW0sIG1vZGUpIHtcbiAgICB2YXIgc2hpZnQgPSB0aGlzLmxlbmd0aCAtIG51bS5sZW5ndGg7XG5cbiAgICB2YXIgYSA9IHRoaXMuY2xvbmUoKTtcbiAgICB2YXIgYiA9IG51bTtcblxuICAgIC8vIE5vcm1hbGl6ZVxuICAgIHZhciBiaGkgPSBiLndvcmRzW2IubGVuZ3RoIC0gMV0gfCAwO1xuICAgIHZhciBiaGlCaXRzID0gdGhpcy5fY291bnRCaXRzKGJoaSk7XG4gICAgc2hpZnQgPSAyNiAtIGJoaUJpdHM7XG4gICAgaWYgKHNoaWZ0ICE9PSAwKSB7XG4gICAgICBiID0gYi51c2hsbihzaGlmdCk7XG4gICAgICBhLml1c2hsbihzaGlmdCk7XG4gICAgICBiaGkgPSBiLndvcmRzW2IubGVuZ3RoIC0gMV0gfCAwO1xuICAgIH1cblxuICAgIC8vIEluaXRpYWxpemUgcXVvdGllbnRcbiAgICB2YXIgbSA9IGEubGVuZ3RoIC0gYi5sZW5ndGg7XG4gICAgdmFyIHE7XG5cbiAgICBpZiAobW9kZSAhPT0gJ21vZCcpIHtcbiAgICAgIHEgPSBuZXcgQk4obnVsbCk7XG4gICAgICBxLmxlbmd0aCA9IG0gKyAxO1xuICAgICAgcS53b3JkcyA9IG5ldyBBcnJheShxLmxlbmd0aCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcS53b3Jkc1tpXSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGRpZmYgPSBhLmNsb25lKCkuX2lzaGxuc3VibXVsKGIsIDEsIG0pO1xuICAgIGlmIChkaWZmLm5lZ2F0aXZlID09PSAwKSB7XG4gICAgICBhID0gZGlmZjtcbiAgICAgIGlmIChxKSB7XG4gICAgICAgIHEud29yZHNbbV0gPSAxO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGogPSBtIC0gMTsgaiA+PSAwOyBqLS0pIHtcbiAgICAgIHZhciBxaiA9IChhLndvcmRzW2IubGVuZ3RoICsgal0gfCAwKSAqIDB4NDAwMDAwMCArXG4gICAgICAgIChhLndvcmRzW2IubGVuZ3RoICsgaiAtIDFdIHwgMCk7XG5cbiAgICAgIC8vIE5PVEU6IChxaiAvIGJoaSkgaXMgKDB4M2ZmZmZmZiAqIDB4NDAwMDAwMCArIDB4M2ZmZmZmZikgLyAweDIwMDAwMDAgbWF4XG4gICAgICAvLyAoMHg3ZmZmZmZmKVxuICAgICAgcWogPSBNYXRoLm1pbigocWogLyBiaGkpIHwgMCwgMHgzZmZmZmZmKTtcblxuICAgICAgYS5faXNobG5zdWJtdWwoYiwgcWosIGopO1xuICAgICAgd2hpbGUgKGEubmVnYXRpdmUgIT09IDApIHtcbiAgICAgICAgcWotLTtcbiAgICAgICAgYS5uZWdhdGl2ZSA9IDA7XG4gICAgICAgIGEuX2lzaGxuc3VibXVsKGIsIDEsIGopO1xuICAgICAgICBpZiAoIWEuaXNaZXJvKCkpIHtcbiAgICAgICAgICBhLm5lZ2F0aXZlIF49IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChxKSB7XG4gICAgICAgIHEud29yZHNbal0gPSBxajtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHEpIHtcbiAgICAgIHEuc3RyaXAoKTtcbiAgICB9XG4gICAgYS5zdHJpcCgpO1xuXG4gICAgLy8gRGVub3JtYWxpemVcbiAgICBpZiAobW9kZSAhPT0gJ2RpdicgJiYgc2hpZnQgIT09IDApIHtcbiAgICAgIGEuaXVzaHJuKHNoaWZ0KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGl2OiBxIHx8IG51bGwsXG4gICAgICBtb2Q6IGFcbiAgICB9O1xuICB9O1xuXG4gIC8vIE5PVEU6IDEpIGBtb2RlYCBjYW4gYmUgc2V0IHRvIGBtb2RgIHRvIHJlcXVlc3QgbW9kIG9ubHksXG4gIC8vICAgICAgIHRvIGBkaXZgIHRvIHJlcXVlc3QgZGl2IG9ubHksIG9yIGJlIGFic2VudCB0b1xuICAvLyAgICAgICByZXF1ZXN0IGJvdGggZGl2ICYgbW9kXG4gIC8vICAgICAgIDIpIGBwb3NpdGl2ZWAgaXMgdHJ1ZSBpZiB1bnNpZ25lZCBtb2QgaXMgcmVxdWVzdGVkXG4gIEJOLnByb3RvdHlwZS5kaXZtb2QgPSBmdW5jdGlvbiBkaXZtb2QgKG51bSwgbW9kZSwgcG9zaXRpdmUpIHtcbiAgICBhc3NlcnQoIW51bS5pc1plcm8oKSk7XG5cbiAgICBpZiAodGhpcy5pc1plcm8oKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGl2OiBuZXcgQk4oMCksXG4gICAgICAgIG1vZDogbmV3IEJOKDApXG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBkaXYsIG1vZCwgcmVzO1xuICAgIGlmICh0aGlzLm5lZ2F0aXZlICE9PSAwICYmIG51bS5uZWdhdGl2ZSA9PT0gMCkge1xuICAgICAgcmVzID0gdGhpcy5uZWcoKS5kaXZtb2QobnVtLCBtb2RlKTtcblxuICAgICAgaWYgKG1vZGUgIT09ICdtb2QnKSB7XG4gICAgICAgIGRpdiA9IHJlcy5kaXYubmVnKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChtb2RlICE9PSAnZGl2Jykge1xuICAgICAgICBtb2QgPSByZXMubW9kLm5lZygpO1xuICAgICAgICBpZiAocG9zaXRpdmUgJiYgbW9kLm5lZ2F0aXZlICE9PSAwKSB7XG4gICAgICAgICAgbW9kLmlhZGQobnVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBkaXY6IGRpdixcbiAgICAgICAgbW9kOiBtb2RcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubmVnYXRpdmUgPT09IDAgJiYgbnVtLm5lZ2F0aXZlICE9PSAwKSB7XG4gICAgICByZXMgPSB0aGlzLmRpdm1vZChudW0ubmVnKCksIG1vZGUpO1xuXG4gICAgICBpZiAobW9kZSAhPT0gJ21vZCcpIHtcbiAgICAgICAgZGl2ID0gcmVzLmRpdi5uZWcoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGl2OiBkaXYsXG4gICAgICAgIG1vZDogcmVzLm1vZFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoKHRoaXMubmVnYXRpdmUgJiBudW0ubmVnYXRpdmUpICE9PSAwKSB7XG4gICAgICByZXMgPSB0aGlzLm5lZygpLmRpdm1vZChudW0ubmVnKCksIG1vZGUpO1xuXG4gICAgICBpZiAobW9kZSAhPT0gJ2RpdicpIHtcbiAgICAgICAgbW9kID0gcmVzLm1vZC5uZWcoKTtcbiAgICAgICAgaWYgKHBvc2l0aXZlICYmIG1vZC5uZWdhdGl2ZSAhPT0gMCkge1xuICAgICAgICAgIG1vZC5pc3ViKG51bSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGl2OiByZXMuZGl2LFxuICAgICAgICBtb2Q6IG1vZFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBCb3RoIG51bWJlcnMgYXJlIHBvc2l0aXZlIGF0IHRoaXMgcG9pbnRcblxuICAgIC8vIFN0cmlwIGJvdGggbnVtYmVycyB0byBhcHByb3hpbWF0ZSBzaGlmdCB2YWx1ZVxuICAgIGlmIChudW0ubGVuZ3RoID4gdGhpcy5sZW5ndGggfHwgdGhpcy5jbXAobnVtKSA8IDApIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRpdjogbmV3IEJOKDApLFxuICAgICAgICBtb2Q6IHRoaXNcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gVmVyeSBzaG9ydCByZWR1Y3Rpb25cbiAgICBpZiAobnVtLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKG1vZGUgPT09ICdkaXYnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZGl2OiB0aGlzLmRpdm4obnVtLndvcmRzWzBdKSxcbiAgICAgICAgICBtb2Q6IG51bGxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1vZGUgPT09ICdtb2QnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZGl2OiBudWxsLFxuICAgICAgICAgIG1vZDogbmV3IEJOKHRoaXMubW9kbihudW0ud29yZHNbMF0pKVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBkaXY6IHRoaXMuZGl2bihudW0ud29yZHNbMF0pLFxuICAgICAgICBtb2Q6IG5ldyBCTih0aGlzLm1vZG4obnVtLndvcmRzWzBdKSlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3dvcmREaXYobnVtLCBtb2RlKTtcbiAgfTtcblxuICAvLyBGaW5kIGB0aGlzYCAvIGBudW1gXG4gIEJOLnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbiBkaXYgKG51bSkge1xuICAgIHJldHVybiB0aGlzLmRpdm1vZChudW0sICdkaXYnLCBmYWxzZSkuZGl2O1xuICB9O1xuXG4gIC8vIEZpbmQgYHRoaXNgICUgYG51bWBcbiAgQk4ucHJvdG90eXBlLm1vZCA9IGZ1bmN0aW9uIG1vZCAobnVtKSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2bW9kKG51bSwgJ21vZCcsIGZhbHNlKS5tb2Q7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLnVtb2QgPSBmdW5jdGlvbiB1bW9kIChudW0pIHtcbiAgICByZXR1cm4gdGhpcy5kaXZtb2QobnVtLCAnbW9kJywgdHJ1ZSkubW9kO1xuICB9O1xuXG4gIC8vIEZpbmQgUm91bmQoYHRoaXNgIC8gYG51bWApXG4gIEJOLnByb3RvdHlwZS5kaXZSb3VuZCA9IGZ1bmN0aW9uIGRpdlJvdW5kIChudW0pIHtcbiAgICB2YXIgZG0gPSB0aGlzLmRpdm1vZChudW0pO1xuXG4gICAgLy8gRmFzdCBjYXNlIC0gZXhhY3QgZGl2aXNpb25cbiAgICBpZiAoZG0ubW9kLmlzWmVybygpKSByZXR1cm4gZG0uZGl2O1xuXG4gICAgdmFyIG1vZCA9IGRtLmRpdi5uZWdhdGl2ZSAhPT0gMCA/IGRtLm1vZC5pc3ViKG51bSkgOiBkbS5tb2Q7XG5cbiAgICB2YXIgaGFsZiA9IG51bS51c2hybigxKTtcbiAgICB2YXIgcjIgPSBudW0uYW5kbG4oMSk7XG4gICAgdmFyIGNtcCA9IG1vZC5jbXAoaGFsZik7XG5cbiAgICAvLyBSb3VuZCBkb3duXG4gICAgaWYgKGNtcCA8IDAgfHwgcjIgPT09IDEgJiYgY21wID09PSAwKSByZXR1cm4gZG0uZGl2O1xuXG4gICAgLy8gUm91bmQgdXBcbiAgICByZXR1cm4gZG0uZGl2Lm5lZ2F0aXZlICE9PSAwID8gZG0uZGl2LmlzdWJuKDEpIDogZG0uZGl2LmlhZGRuKDEpO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5tb2RuID0gZnVuY3Rpb24gbW9kbiAobnVtKSB7XG4gICAgYXNzZXJ0KG51bSA8PSAweDNmZmZmZmYpO1xuICAgIHZhciBwID0gKDEgPDwgMjYpICUgbnVtO1xuXG4gICAgdmFyIGFjYyA9IDA7XG4gICAgZm9yICh2YXIgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGFjYyA9IChwICogYWNjICsgKHRoaXMud29yZHNbaV0gfCAwKSkgJSBudW07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjYztcbiAgfTtcblxuICAvLyBJbi1wbGFjZSBkaXZpc2lvbiBieSBudW1iZXJcbiAgQk4ucHJvdG90eXBlLmlkaXZuID0gZnVuY3Rpb24gaWRpdm4gKG51bSkge1xuICAgIGFzc2VydChudW0gPD0gMHgzZmZmZmZmKTtcblxuICAgIHZhciBjYXJyeSA9IDA7XG4gICAgZm9yICh2YXIgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciB3ID0gKHRoaXMud29yZHNbaV0gfCAwKSArIGNhcnJ5ICogMHg0MDAwMDAwO1xuICAgICAgdGhpcy53b3Jkc1tpXSA9ICh3IC8gbnVtKSB8IDA7XG4gICAgICBjYXJyeSA9IHcgJSBudW07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuZGl2biA9IGZ1bmN0aW9uIGRpdm4gKG51bSkge1xuICAgIHJldHVybiB0aGlzLmNsb25lKCkuaWRpdm4obnVtKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuZWdjZCA9IGZ1bmN0aW9uIGVnY2QgKHApIHtcbiAgICBhc3NlcnQocC5uZWdhdGl2ZSA9PT0gMCk7XG4gICAgYXNzZXJ0KCFwLmlzWmVybygpKTtcblxuICAgIHZhciB4ID0gdGhpcztcbiAgICB2YXIgeSA9IHAuY2xvbmUoKTtcblxuICAgIGlmICh4Lm5lZ2F0aXZlICE9PSAwKSB7XG4gICAgICB4ID0geC51bW9kKHApO1xuICAgIH0gZWxzZSB7XG4gICAgICB4ID0geC5jbG9uZSgpO1xuICAgIH1cblxuICAgIC8vIEEgKiB4ICsgQiAqIHkgPSB4XG4gICAgdmFyIEEgPSBuZXcgQk4oMSk7XG4gICAgdmFyIEIgPSBuZXcgQk4oMCk7XG5cbiAgICAvLyBDICogeCArIEQgKiB5ID0geVxuICAgIHZhciBDID0gbmV3IEJOKDApO1xuICAgIHZhciBEID0gbmV3IEJOKDEpO1xuXG4gICAgdmFyIGcgPSAwO1xuXG4gICAgd2hpbGUgKHguaXNFdmVuKCkgJiYgeS5pc0V2ZW4oKSkge1xuICAgICAgeC5pdXNocm4oMSk7XG4gICAgICB5Lml1c2hybigxKTtcbiAgICAgICsrZztcbiAgICB9XG5cbiAgICB2YXIgeXAgPSB5LmNsb25lKCk7XG4gICAgdmFyIHhwID0geC5jbG9uZSgpO1xuXG4gICAgd2hpbGUgKCF4LmlzWmVybygpKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaW0gPSAxOyAoeC53b3Jkc1swXSAmIGltKSA9PT0gMCAmJiBpIDwgMjY7ICsraSwgaW0gPDw9IDEpO1xuICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgIHguaXVzaHJuKGkpO1xuICAgICAgICB3aGlsZSAoaS0tID4gMCkge1xuICAgICAgICAgIGlmIChBLmlzT2RkKCkgfHwgQi5pc09kZCgpKSB7XG4gICAgICAgICAgICBBLmlhZGQoeXApO1xuICAgICAgICAgICAgQi5pc3ViKHhwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBBLml1c2hybigxKTtcbiAgICAgICAgICBCLml1c2hybigxKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBqID0gMCwgam0gPSAxOyAoeS53b3Jkc1swXSAmIGptKSA9PT0gMCAmJiBqIDwgMjY7ICsraiwgam0gPDw9IDEpO1xuICAgICAgaWYgKGogPiAwKSB7XG4gICAgICAgIHkuaXVzaHJuKGopO1xuICAgICAgICB3aGlsZSAoai0tID4gMCkge1xuICAgICAgICAgIGlmIChDLmlzT2RkKCkgfHwgRC5pc09kZCgpKSB7XG4gICAgICAgICAgICBDLmlhZGQoeXApO1xuICAgICAgICAgICAgRC5pc3ViKHhwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBDLml1c2hybigxKTtcbiAgICAgICAgICBELml1c2hybigxKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoeC5jbXAoeSkgPj0gMCkge1xuICAgICAgICB4LmlzdWIoeSk7XG4gICAgICAgIEEuaXN1YihDKTtcbiAgICAgICAgQi5pc3ViKEQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeS5pc3ViKHgpO1xuICAgICAgICBDLmlzdWIoQSk7XG4gICAgICAgIEQuaXN1YihCKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgYTogQyxcbiAgICAgIGI6IEQsXG4gICAgICBnY2Q6IHkuaXVzaGxuKGcpXG4gICAgfTtcbiAgfTtcblxuICAvLyBUaGlzIGlzIHJlZHVjZWQgaW5jYXJuYXRpb24gb2YgdGhlIGJpbmFyeSBFRUFcbiAgLy8gYWJvdmUsIGRlc2lnbmF0ZWQgdG8gaW52ZXJ0IG1lbWJlcnMgb2YgdGhlXG4gIC8vIF9wcmltZV8gZmllbGRzIEYocCkgYXQgYSBtYXhpbWFsIHNwZWVkXG4gIEJOLnByb3RvdHlwZS5faW52bXAgPSBmdW5jdGlvbiBfaW52bXAgKHApIHtcbiAgICBhc3NlcnQocC5uZWdhdGl2ZSA9PT0gMCk7XG4gICAgYXNzZXJ0KCFwLmlzWmVybygpKTtcblxuICAgIHZhciBhID0gdGhpcztcbiAgICB2YXIgYiA9IHAuY2xvbmUoKTtcblxuICAgIGlmIChhLm5lZ2F0aXZlICE9PSAwKSB7XG4gICAgICBhID0gYS51bW9kKHApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhID0gYS5jbG9uZSgpO1xuICAgIH1cblxuICAgIHZhciB4MSA9IG5ldyBCTigxKTtcbiAgICB2YXIgeDIgPSBuZXcgQk4oMCk7XG5cbiAgICB2YXIgZGVsdGEgPSBiLmNsb25lKCk7XG5cbiAgICB3aGlsZSAoYS5jbXBuKDEpID4gMCAmJiBiLmNtcG4oMSkgPiAwKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaW0gPSAxOyAoYS53b3Jkc1swXSAmIGltKSA9PT0gMCAmJiBpIDwgMjY7ICsraSwgaW0gPDw9IDEpO1xuICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgIGEuaXVzaHJuKGkpO1xuICAgICAgICB3aGlsZSAoaS0tID4gMCkge1xuICAgICAgICAgIGlmICh4MS5pc09kZCgpKSB7XG4gICAgICAgICAgICB4MS5pYWRkKGRlbHRhKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB4MS5pdXNocm4oMSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaiA9IDAsIGptID0gMTsgKGIud29yZHNbMF0gJiBqbSkgPT09IDAgJiYgaiA8IDI2OyArK2osIGptIDw8PSAxKTtcbiAgICAgIGlmIChqID4gMCkge1xuICAgICAgICBiLml1c2hybihqKTtcbiAgICAgICAgd2hpbGUgKGotLSA+IDApIHtcbiAgICAgICAgICBpZiAoeDIuaXNPZGQoKSkge1xuICAgICAgICAgICAgeDIuaWFkZChkZWx0YSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgeDIuaXVzaHJuKDEpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChhLmNtcChiKSA+PSAwKSB7XG4gICAgICAgIGEuaXN1YihiKTtcbiAgICAgICAgeDEuaXN1Yih4Mik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiLmlzdWIoYSk7XG4gICAgICAgIHgyLmlzdWIoeDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciByZXM7XG4gICAgaWYgKGEuY21wbigxKSA9PT0gMCkge1xuICAgICAgcmVzID0geDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcyA9IHgyO1xuICAgIH1cblxuICAgIGlmIChyZXMuY21wbigwKSA8IDApIHtcbiAgICAgIHJlcy5pYWRkKHApO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLmdjZCA9IGZ1bmN0aW9uIGdjZCAobnVtKSB7XG4gICAgaWYgKHRoaXMuaXNaZXJvKCkpIHJldHVybiBudW0uYWJzKCk7XG4gICAgaWYgKG51bS5pc1plcm8oKSkgcmV0dXJuIHRoaXMuYWJzKCk7XG5cbiAgICB2YXIgYSA9IHRoaXMuY2xvbmUoKTtcbiAgICB2YXIgYiA9IG51bS5jbG9uZSgpO1xuICAgIGEubmVnYXRpdmUgPSAwO1xuICAgIGIubmVnYXRpdmUgPSAwO1xuXG4gICAgLy8gUmVtb3ZlIGNvbW1vbiBmYWN0b3Igb2YgdHdvXG4gICAgZm9yICh2YXIgc2hpZnQgPSAwOyBhLmlzRXZlbigpICYmIGIuaXNFdmVuKCk7IHNoaWZ0KyspIHtcbiAgICAgIGEuaXVzaHJuKDEpO1xuICAgICAgYi5pdXNocm4oMSk7XG4gICAgfVxuXG4gICAgZG8ge1xuICAgICAgd2hpbGUgKGEuaXNFdmVuKCkpIHtcbiAgICAgICAgYS5pdXNocm4oMSk7XG4gICAgICB9XG4gICAgICB3aGlsZSAoYi5pc0V2ZW4oKSkge1xuICAgICAgICBiLml1c2hybigxKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHIgPSBhLmNtcChiKTtcbiAgICAgIGlmIChyIDwgMCkge1xuICAgICAgICAvLyBTd2FwIGBhYCBhbmQgYGJgIHRvIG1ha2UgYGFgIGFsd2F5cyBiaWdnZXIgdGhhbiBgYmBcbiAgICAgICAgdmFyIHQgPSBhO1xuICAgICAgICBhID0gYjtcbiAgICAgICAgYiA9IHQ7XG4gICAgICB9IGVsc2UgaWYgKHIgPT09IDAgfHwgYi5jbXBuKDEpID09PSAwKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBhLmlzdWIoYik7XG4gICAgfSB3aGlsZSAodHJ1ZSk7XG5cbiAgICByZXR1cm4gYi5pdXNobG4oc2hpZnQpO1xuICB9O1xuXG4gIC8vIEludmVydCBudW1iZXIgaW4gdGhlIGZpZWxkIEYobnVtKVxuICBCTi5wcm90b3R5cGUuaW52bSA9IGZ1bmN0aW9uIGludm0gKG51bSkge1xuICAgIHJldHVybiB0aGlzLmVnY2QobnVtKS5hLnVtb2QobnVtKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuaXNFdmVuID0gZnVuY3Rpb24gaXNFdmVuICgpIHtcbiAgICByZXR1cm4gKHRoaXMud29yZHNbMF0gJiAxKSA9PT0gMDtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuaXNPZGQgPSBmdW5jdGlvbiBpc09kZCAoKSB7XG4gICAgcmV0dXJuICh0aGlzLndvcmRzWzBdICYgMSkgPT09IDE7XG4gIH07XG5cbiAgLy8gQW5kIGZpcnN0IHdvcmQgYW5kIG51bVxuICBCTi5wcm90b3R5cGUuYW5kbG4gPSBmdW5jdGlvbiBhbmRsbiAobnVtKSB7XG4gICAgcmV0dXJuIHRoaXMud29yZHNbMF0gJiBudW07XG4gIH07XG5cbiAgLy8gSW5jcmVtZW50IGF0IHRoZSBiaXQgcG9zaXRpb24gaW4tbGluZVxuICBCTi5wcm90b3R5cGUuYmluY24gPSBmdW5jdGlvbiBiaW5jbiAoYml0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBiaXQgPT09ICdudW1iZXInKTtcbiAgICB2YXIgciA9IGJpdCAlIDI2O1xuICAgIHZhciBzID0gKGJpdCAtIHIpIC8gMjY7XG4gICAgdmFyIHEgPSAxIDw8IHI7XG5cbiAgICAvLyBGYXN0IGNhc2U6IGJpdCBpcyBtdWNoIGhpZ2hlciB0aGFuIGFsbCBleGlzdGluZyB3b3Jkc1xuICAgIGlmICh0aGlzLmxlbmd0aCA8PSBzKSB7XG4gICAgICB0aGlzLl9leHBhbmQocyArIDEpO1xuICAgICAgdGhpcy53b3Jkc1tzXSB8PSBxO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gQWRkIGJpdCBhbmQgcHJvcGFnYXRlLCBpZiBuZWVkZWRcbiAgICB2YXIgY2FycnkgPSBxO1xuICAgIGZvciAodmFyIGkgPSBzOyBjYXJyeSAhPT0gMCAmJiBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHcgPSB0aGlzLndvcmRzW2ldIHwgMDtcbiAgICAgIHcgKz0gY2Fycnk7XG4gICAgICBjYXJyeSA9IHcgPj4+IDI2O1xuICAgICAgdyAmPSAweDNmZmZmZmY7XG4gICAgICB0aGlzLndvcmRzW2ldID0gdztcbiAgICB9XG4gICAgaWYgKGNhcnJ5ICE9PSAwKSB7XG4gICAgICB0aGlzLndvcmRzW2ldID0gY2Fycnk7XG4gICAgICB0aGlzLmxlbmd0aCsrO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuaXNaZXJvID0gZnVuY3Rpb24gaXNaZXJvICgpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggPT09IDEgJiYgdGhpcy53b3Jkc1swXSA9PT0gMDtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuY21wbiA9IGZ1bmN0aW9uIGNtcG4gKG51bSkge1xuICAgIHZhciBuZWdhdGl2ZSA9IG51bSA8IDA7XG5cbiAgICBpZiAodGhpcy5uZWdhdGl2ZSAhPT0gMCAmJiAhbmVnYXRpdmUpIHJldHVybiAtMTtcbiAgICBpZiAodGhpcy5uZWdhdGl2ZSA9PT0gMCAmJiBuZWdhdGl2ZSkgcmV0dXJuIDE7XG5cbiAgICB0aGlzLnN0cmlwKCk7XG5cbiAgICB2YXIgcmVzO1xuICAgIGlmICh0aGlzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJlcyA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChuZWdhdGl2ZSkge1xuICAgICAgICBudW0gPSAtbnVtO1xuICAgICAgfVxuXG4gICAgICBhc3NlcnQobnVtIDw9IDB4M2ZmZmZmZiwgJ051bWJlciBpcyB0b28gYmlnJyk7XG5cbiAgICAgIHZhciB3ID0gdGhpcy53b3Jkc1swXSB8IDA7XG4gICAgICByZXMgPSB3ID09PSBudW0gPyAwIDogdyA8IG51bSA/IC0xIDogMTtcbiAgICB9XG4gICAgaWYgKHRoaXMubmVnYXRpdmUgIT09IDApIHJldHVybiAtcmVzIHwgMDtcbiAgICByZXR1cm4gcmVzO1xuICB9O1xuXG4gIC8vIENvbXBhcmUgdHdvIG51bWJlcnMgYW5kIHJldHVybjpcbiAgLy8gMSAtIGlmIGB0aGlzYCA+IGBudW1gXG4gIC8vIDAgLSBpZiBgdGhpc2AgPT0gYG51bWBcbiAgLy8gLTEgLSBpZiBgdGhpc2AgPCBgbnVtYFxuICBCTi5wcm90b3R5cGUuY21wID0gZnVuY3Rpb24gY21wIChudW0pIHtcbiAgICBpZiAodGhpcy5uZWdhdGl2ZSAhPT0gMCAmJiBudW0ubmVnYXRpdmUgPT09IDApIHJldHVybiAtMTtcbiAgICBpZiAodGhpcy5uZWdhdGl2ZSA9PT0gMCAmJiBudW0ubmVnYXRpdmUgIT09IDApIHJldHVybiAxO1xuXG4gICAgdmFyIHJlcyA9IHRoaXMudWNtcChudW0pO1xuICAgIGlmICh0aGlzLm5lZ2F0aXZlICE9PSAwKSByZXR1cm4gLXJlcyB8IDA7XG4gICAgcmV0dXJuIHJlcztcbiAgfTtcblxuICAvLyBVbnNpZ25lZCBjb21wYXJpc29uXG4gIEJOLnByb3RvdHlwZS51Y21wID0gZnVuY3Rpb24gdWNtcCAobnVtKSB7XG4gICAgLy8gQXQgdGhpcyBwb2ludCBib3RoIG51bWJlcnMgaGF2ZSB0aGUgc2FtZSBzaWduXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbnVtLmxlbmd0aCkgcmV0dXJuIDE7XG4gICAgaWYgKHRoaXMubGVuZ3RoIDwgbnVtLmxlbmd0aCkgcmV0dXJuIC0xO1xuXG4gICAgdmFyIHJlcyA9IDA7XG4gICAgZm9yICh2YXIgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBhID0gdGhpcy53b3Jkc1tpXSB8IDA7XG4gICAgICB2YXIgYiA9IG51bS53b3Jkc1tpXSB8IDA7XG5cbiAgICAgIGlmIChhID09PSBiKSBjb250aW51ZTtcbiAgICAgIGlmIChhIDwgYikge1xuICAgICAgICByZXMgPSAtMTtcbiAgICAgIH0gZWxzZSBpZiAoYSA+IGIpIHtcbiAgICAgICAgcmVzID0gMTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5ndG4gPSBmdW5jdGlvbiBndG4gKG51bSkge1xuICAgIHJldHVybiB0aGlzLmNtcG4obnVtKSA9PT0gMTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuZ3QgPSBmdW5jdGlvbiBndCAobnVtKSB7XG4gICAgcmV0dXJuIHRoaXMuY21wKG51bSkgPT09IDE7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLmd0ZW4gPSBmdW5jdGlvbiBndGVuIChudW0pIHtcbiAgICByZXR1cm4gdGhpcy5jbXBuKG51bSkgPj0gMDtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuZ3RlID0gZnVuY3Rpb24gZ3RlIChudW0pIHtcbiAgICByZXR1cm4gdGhpcy5jbXAobnVtKSA+PSAwO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5sdG4gPSBmdW5jdGlvbiBsdG4gKG51bSkge1xuICAgIHJldHVybiB0aGlzLmNtcG4obnVtKSA9PT0gLTE7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLmx0ID0gZnVuY3Rpb24gbHQgKG51bSkge1xuICAgIHJldHVybiB0aGlzLmNtcChudW0pID09PSAtMTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUubHRlbiA9IGZ1bmN0aW9uIGx0ZW4gKG51bSkge1xuICAgIHJldHVybiB0aGlzLmNtcG4obnVtKSA8PSAwO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5sdGUgPSBmdW5jdGlvbiBsdGUgKG51bSkge1xuICAgIHJldHVybiB0aGlzLmNtcChudW0pIDw9IDA7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLmVxbiA9IGZ1bmN0aW9uIGVxbiAobnVtKSB7XG4gICAgcmV0dXJuIHRoaXMuY21wbihudW0pID09PSAwO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5lcSA9IGZ1bmN0aW9uIGVxIChudW0pIHtcbiAgICByZXR1cm4gdGhpcy5jbXAobnVtKSA9PT0gMDtcbiAgfTtcblxuICAvL1xuICAvLyBBIHJlZHVjZSBjb250ZXh0LCBjb3VsZCBiZSB1c2luZyBtb250Z29tZXJ5IG9yIHNvbWV0aGluZyBiZXR0ZXIsIGRlcGVuZGluZ1xuICAvLyBvbiB0aGUgYG1gIGl0c2VsZi5cbiAgLy9cbiAgQk4ucmVkID0gZnVuY3Rpb24gcmVkIChudW0pIHtcbiAgICByZXR1cm4gbmV3IFJlZChudW0pO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS50b1JlZCA9IGZ1bmN0aW9uIHRvUmVkIChjdHgpIHtcbiAgICBhc3NlcnQoIXRoaXMucmVkLCAnQWxyZWFkeSBhIG51bWJlciBpbiByZWR1Y3Rpb24gY29udGV4dCcpO1xuICAgIGFzc2VydCh0aGlzLm5lZ2F0aXZlID09PSAwLCAncmVkIHdvcmtzIG9ubHkgd2l0aCBwb3NpdGl2ZXMnKTtcbiAgICByZXR1cm4gY3R4LmNvbnZlcnRUbyh0aGlzKS5fZm9yY2VSZWQoY3R4KTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUuZnJvbVJlZCA9IGZ1bmN0aW9uIGZyb21SZWQgKCkge1xuICAgIGFzc2VydCh0aGlzLnJlZCwgJ2Zyb21SZWQgd29ya3Mgb25seSB3aXRoIG51bWJlcnMgaW4gcmVkdWN0aW9uIGNvbnRleHQnKTtcbiAgICByZXR1cm4gdGhpcy5yZWQuY29udmVydEZyb20odGhpcyk7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLl9mb3JjZVJlZCA9IGZ1bmN0aW9uIF9mb3JjZVJlZCAoY3R4KSB7XG4gICAgdGhpcy5yZWQgPSBjdHg7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLmZvcmNlUmVkID0gZnVuY3Rpb24gZm9yY2VSZWQgKGN0eCkge1xuICAgIGFzc2VydCghdGhpcy5yZWQsICdBbHJlYWR5IGEgbnVtYmVyIGluIHJlZHVjdGlvbiBjb250ZXh0Jyk7XG4gICAgcmV0dXJuIHRoaXMuX2ZvcmNlUmVkKGN0eCk7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLnJlZEFkZCA9IGZ1bmN0aW9uIHJlZEFkZCAobnVtKSB7XG4gICAgYXNzZXJ0KHRoaXMucmVkLCAncmVkQWRkIHdvcmtzIG9ubHkgd2l0aCByZWQgbnVtYmVycycpO1xuICAgIHJldHVybiB0aGlzLnJlZC5hZGQodGhpcywgbnVtKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUucmVkSUFkZCA9IGZ1bmN0aW9uIHJlZElBZGQgKG51bSkge1xuICAgIGFzc2VydCh0aGlzLnJlZCwgJ3JlZElBZGQgd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XG4gICAgcmV0dXJuIHRoaXMucmVkLmlhZGQodGhpcywgbnVtKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUucmVkU3ViID0gZnVuY3Rpb24gcmVkU3ViIChudW0pIHtcbiAgICBhc3NlcnQodGhpcy5yZWQsICdyZWRTdWIgd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XG4gICAgcmV0dXJuIHRoaXMucmVkLnN1Yih0aGlzLCBudW0pO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5yZWRJU3ViID0gZnVuY3Rpb24gcmVkSVN1YiAobnVtKSB7XG4gICAgYXNzZXJ0KHRoaXMucmVkLCAncmVkSVN1YiB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcbiAgICByZXR1cm4gdGhpcy5yZWQuaXN1Yih0aGlzLCBudW0pO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5yZWRTaGwgPSBmdW5jdGlvbiByZWRTaGwgKG51bSkge1xuICAgIGFzc2VydCh0aGlzLnJlZCwgJ3JlZFNobCB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcbiAgICByZXR1cm4gdGhpcy5yZWQuc2hsKHRoaXMsIG51bSk7XG4gIH07XG5cbiAgQk4ucHJvdG90eXBlLnJlZE11bCA9IGZ1bmN0aW9uIHJlZE11bCAobnVtKSB7XG4gICAgYXNzZXJ0KHRoaXMucmVkLCAncmVkTXVsIHdvcmtzIG9ubHkgd2l0aCByZWQgbnVtYmVycycpO1xuICAgIHRoaXMucmVkLl92ZXJpZnkyKHRoaXMsIG51bSk7XG4gICAgcmV0dXJuIHRoaXMucmVkLm11bCh0aGlzLCBudW0pO1xuICB9O1xuXG4gIEJOLnByb3RvdHlwZS5yZWRJTXVsID0gZnVuY3Rpb24gcmVkSU11bCAobnVtKSB7XG4gICAgYXNzZXJ0KHRoaXMucmVkLCAncmVkTXVsIHdvcmtzIG9ubHkgd2l0aCByZWQgbnVtYmVycycpO1xuICAgIHRoaXMucmVkLl92ZXJpZnkyKHRoaXMsIG51bSk7XG4gICAgcmV0dXJuIHRoaXMucmVkLmltdWwodGhpcywgbnVtKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUucmVkU3FyID0gZnVuY3Rpb24gcmVkU3FyICgpIHtcbiAgICBhc3NlcnQodGhpcy5yZWQsICdyZWRTcXIgd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XG4gICAgdGhpcy5yZWQuX3ZlcmlmeTEodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMucmVkLnNxcih0aGlzKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUucmVkSVNxciA9IGZ1bmN0aW9uIHJlZElTcXIgKCkge1xuICAgIGFzc2VydCh0aGlzLnJlZCwgJ3JlZElTcXIgd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XG4gICAgdGhpcy5yZWQuX3ZlcmlmeTEodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMucmVkLmlzcXIodGhpcyk7XG4gIH07XG5cbiAgLy8gU3F1YXJlIHJvb3Qgb3ZlciBwXG4gIEJOLnByb3RvdHlwZS5yZWRTcXJ0ID0gZnVuY3Rpb24gcmVkU3FydCAoKSB7XG4gICAgYXNzZXJ0KHRoaXMucmVkLCAncmVkU3FydCB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcbiAgICB0aGlzLnJlZC5fdmVyaWZ5MSh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5yZWQuc3FydCh0aGlzKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUucmVkSW52bSA9IGZ1bmN0aW9uIHJlZEludm0gKCkge1xuICAgIGFzc2VydCh0aGlzLnJlZCwgJ3JlZEludm0gd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XG4gICAgdGhpcy5yZWQuX3ZlcmlmeTEodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMucmVkLmludm0odGhpcyk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIG5lZ2F0aXZlIGNsb25lIG9mIGB0aGlzYCAlIGByZWQgbW9kdWxvYFxuICBCTi5wcm90b3R5cGUucmVkTmVnID0gZnVuY3Rpb24gcmVkTmVnICgpIHtcbiAgICBhc3NlcnQodGhpcy5yZWQsICdyZWROZWcgd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XG4gICAgdGhpcy5yZWQuX3ZlcmlmeTEodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMucmVkLm5lZyh0aGlzKTtcbiAgfTtcblxuICBCTi5wcm90b3R5cGUucmVkUG93ID0gZnVuY3Rpb24gcmVkUG93IChudW0pIHtcbiAgICBhc3NlcnQodGhpcy5yZWQgJiYgIW51bS5yZWQsICdyZWRQb3cobm9ybWFsTnVtKScpO1xuICAgIHRoaXMucmVkLl92ZXJpZnkxKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLnJlZC5wb3codGhpcywgbnVtKTtcbiAgfTtcblxuICAvLyBQcmltZSBudW1iZXJzIHdpdGggZWZmaWNpZW50IHJlZHVjdGlvblxuICB2YXIgcHJpbWVzID0ge1xuICAgIGsyNTY6IG51bGwsXG4gICAgcDIyNDogbnVsbCxcbiAgICBwMTkyOiBudWxsLFxuICAgIHAyNTUxOTogbnVsbFxuICB9O1xuXG4gIC8vIFBzZXVkby1NZXJzZW5uZSBwcmltZVxuICBmdW5jdGlvbiBNUHJpbWUgKG5hbWUsIHApIHtcbiAgICAvLyBQID0gMiBeIE4gLSBLXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnAgPSBuZXcgQk4ocCwgMTYpO1xuICAgIHRoaXMubiA9IHRoaXMucC5iaXRMZW5ndGgoKTtcbiAgICB0aGlzLmsgPSBuZXcgQk4oMSkuaXVzaGxuKHRoaXMubikuaXN1Yih0aGlzLnApO1xuXG4gICAgdGhpcy50bXAgPSB0aGlzLl90bXAoKTtcbiAgfVxuXG4gIE1QcmltZS5wcm90b3R5cGUuX3RtcCA9IGZ1bmN0aW9uIF90bXAgKCkge1xuICAgIHZhciB0bXAgPSBuZXcgQk4obnVsbCk7XG4gICAgdG1wLndvcmRzID0gbmV3IEFycmF5KE1hdGguY2VpbCh0aGlzLm4gLyAxMykpO1xuICAgIHJldHVybiB0bXA7XG4gIH07XG5cbiAgTVByaW1lLnByb3RvdHlwZS5pcmVkdWNlID0gZnVuY3Rpb24gaXJlZHVjZSAobnVtKSB7XG4gICAgLy8gQXNzdW1lcyB0aGF0IGBudW1gIGlzIGxlc3MgdGhhbiBgUF4yYFxuICAgIC8vIG51bSA9IEhJICogKDIgXiBOIC0gSykgKyBISSAqIEsgKyBMTyA9IEhJICogSyArIExPIChtb2QgUClcbiAgICB2YXIgciA9IG51bTtcbiAgICB2YXIgcmxlbjtcblxuICAgIGRvIHtcbiAgICAgIHRoaXMuc3BsaXQociwgdGhpcy50bXApO1xuICAgICAgciA9IHRoaXMuaW11bEsocik7XG4gICAgICByID0gci5pYWRkKHRoaXMudG1wKTtcbiAgICAgIHJsZW4gPSByLmJpdExlbmd0aCgpO1xuICAgIH0gd2hpbGUgKHJsZW4gPiB0aGlzLm4pO1xuXG4gICAgdmFyIGNtcCA9IHJsZW4gPCB0aGlzLm4gPyAtMSA6IHIudWNtcCh0aGlzLnApO1xuICAgIGlmIChjbXAgPT09IDApIHtcbiAgICAgIHIud29yZHNbMF0gPSAwO1xuICAgICAgci5sZW5ndGggPSAxO1xuICAgIH0gZWxzZSBpZiAoY21wID4gMCkge1xuICAgICAgci5pc3ViKHRoaXMucCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHIuc3RyaXAoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcjtcbiAgfTtcblxuICBNUHJpbWUucHJvdG90eXBlLnNwbGl0ID0gZnVuY3Rpb24gc3BsaXQgKGlucHV0LCBvdXQpIHtcbiAgICBpbnB1dC5pdXNocm4odGhpcy5uLCAwLCBvdXQpO1xuICB9O1xuXG4gIE1QcmltZS5wcm90b3R5cGUuaW11bEsgPSBmdW5jdGlvbiBpbXVsSyAobnVtKSB7XG4gICAgcmV0dXJuIG51bS5pbXVsKHRoaXMuayk7XG4gIH07XG5cbiAgZnVuY3Rpb24gSzI1NiAoKSB7XG4gICAgTVByaW1lLmNhbGwoXG4gICAgICB0aGlzLFxuICAgICAgJ2syNTYnLFxuICAgICAgJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZlIGZmZmZmYzJmJyk7XG4gIH1cbiAgaW5oZXJpdHMoSzI1NiwgTVByaW1lKTtcblxuICBLMjU2LnByb3RvdHlwZS5zcGxpdCA9IGZ1bmN0aW9uIHNwbGl0IChpbnB1dCwgb3V0cHV0KSB7XG4gICAgLy8gMjU2ID0gOSAqIDI2ICsgMjJcbiAgICB2YXIgbWFzayA9IDB4M2ZmZmZmO1xuXG4gICAgdmFyIG91dExlbiA9IE1hdGgubWluKGlucHV0Lmxlbmd0aCwgOSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvdXRMZW47IGkrKykge1xuICAgICAgb3V0cHV0LndvcmRzW2ldID0gaW5wdXQud29yZHNbaV07XG4gICAgfVxuICAgIG91dHB1dC5sZW5ndGggPSBvdXRMZW47XG5cbiAgICBpZiAoaW5wdXQubGVuZ3RoIDw9IDkpIHtcbiAgICAgIGlucHV0LndvcmRzWzBdID0gMDtcbiAgICAgIGlucHV0Lmxlbmd0aCA9IDE7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gU2hpZnQgYnkgOSBsaW1ic1xuICAgIHZhciBwcmV2ID0gaW5wdXQud29yZHNbOV07XG4gICAgb3V0cHV0LndvcmRzW291dHB1dC5sZW5ndGgrK10gPSBwcmV2ICYgbWFzaztcblxuICAgIGZvciAoaSA9IDEwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuZXh0ID0gaW5wdXQud29yZHNbaV0gfCAwO1xuICAgICAgaW5wdXQud29yZHNbaSAtIDEwXSA9ICgobmV4dCAmIG1hc2spIDw8IDQpIHwgKHByZXYgPj4+IDIyKTtcbiAgICAgIHByZXYgPSBuZXh0O1xuICAgIH1cbiAgICBwcmV2ID4+Pj0gMjI7XG4gICAgaW5wdXQud29yZHNbaSAtIDEwXSA9IHByZXY7XG4gICAgaWYgKHByZXYgPT09IDAgJiYgaW5wdXQubGVuZ3RoID4gMTApIHtcbiAgICAgIGlucHV0Lmxlbmd0aCAtPSAxMDtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXQubGVuZ3RoIC09IDk7XG4gICAgfVxuICB9O1xuXG4gIEsyNTYucHJvdG90eXBlLmltdWxLID0gZnVuY3Rpb24gaW11bEsgKG51bSkge1xuICAgIC8vIEsgPSAweDEwMDAwMDNkMSA9IFsgMHg0MCwgMHgzZDEgXVxuICAgIG51bS53b3Jkc1tudW0ubGVuZ3RoXSA9IDA7XG4gICAgbnVtLndvcmRzW251bS5sZW5ndGggKyAxXSA9IDA7XG4gICAgbnVtLmxlbmd0aCArPSAyO1xuXG4gICAgLy8gYm91bmRlZCBhdDogMHg0MCAqIDB4M2ZmZmZmZiArIDB4M2QwID0gMHgxMDAwMDAzOTBcbiAgICB2YXIgbG8gPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdyA9IG51bS53b3Jkc1tpXSB8IDA7XG4gICAgICBsbyArPSB3ICogMHgzZDE7XG4gICAgICBudW0ud29yZHNbaV0gPSBsbyAmIDB4M2ZmZmZmZjtcbiAgICAgIGxvID0gdyAqIDB4NDAgKyAoKGxvIC8gMHg0MDAwMDAwKSB8IDApO1xuICAgIH1cblxuICAgIC8vIEZhc3QgbGVuZ3RoIHJlZHVjdGlvblxuICAgIGlmIChudW0ud29yZHNbbnVtLmxlbmd0aCAtIDFdID09PSAwKSB7XG4gICAgICBudW0ubGVuZ3RoLS07XG4gICAgICBpZiAobnVtLndvcmRzW251bS5sZW5ndGggLSAxXSA9PT0gMCkge1xuICAgICAgICBudW0ubGVuZ3RoLS07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudW07XG4gIH07XG5cbiAgZnVuY3Rpb24gUDIyNCAoKSB7XG4gICAgTVByaW1lLmNhbGwoXG4gICAgICB0aGlzLFxuICAgICAgJ3AyMjQnLFxuICAgICAgJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIDAwMDAwMDAwIDAwMDAwMDAwIDAwMDAwMDAxJyk7XG4gIH1cbiAgaW5oZXJpdHMoUDIyNCwgTVByaW1lKTtcblxuICBmdW5jdGlvbiBQMTkyICgpIHtcbiAgICBNUHJpbWUuY2FsbChcbiAgICAgIHRoaXMsXG4gICAgICAncDE5MicsXG4gICAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmUgZmZmZmZmZmYgZmZmZmZmZmYnKTtcbiAgfVxuICBpbmhlcml0cyhQMTkyLCBNUHJpbWUpO1xuXG4gIGZ1bmN0aW9uIFAyNTUxOSAoKSB7XG4gICAgLy8gMiBeIDI1NSAtIDE5XG4gICAgTVByaW1lLmNhbGwoXG4gICAgICB0aGlzLFxuICAgICAgJzI1NTE5JyxcbiAgICAgICc3ZmZmZmZmZmZmZmZmZmZmIGZmZmZmZmZmZmZmZmZmZmYgZmZmZmZmZmZmZmZmZmZmZiBmZmZmZmZmZmZmZmZmZmVkJyk7XG4gIH1cbiAgaW5oZXJpdHMoUDI1NTE5LCBNUHJpbWUpO1xuXG4gIFAyNTUxOS5wcm90b3R5cGUuaW11bEsgPSBmdW5jdGlvbiBpbXVsSyAobnVtKSB7XG4gICAgLy8gSyA9IDB4MTNcbiAgICB2YXIgY2FycnkgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaGkgPSAobnVtLndvcmRzW2ldIHwgMCkgKiAweDEzICsgY2Fycnk7XG4gICAgICB2YXIgbG8gPSBoaSAmIDB4M2ZmZmZmZjtcbiAgICAgIGhpID4+Pj0gMjY7XG5cbiAgICAgIG51bS53b3Jkc1tpXSA9IGxvO1xuICAgICAgY2FycnkgPSBoaTtcbiAgICB9XG4gICAgaWYgKGNhcnJ5ICE9PSAwKSB7XG4gICAgICBudW0ud29yZHNbbnVtLmxlbmd0aCsrXSA9IGNhcnJ5O1xuICAgIH1cbiAgICByZXR1cm4gbnVtO1xuICB9O1xuXG4gIC8vIEV4cG9ydGVkIG1vc3RseSBmb3IgdGVzdGluZyBwdXJwb3NlcywgdXNlIHBsYWluIG5hbWUgaW5zdGVhZFxuICBCTi5fcHJpbWUgPSBmdW5jdGlvbiBwcmltZSAobmFtZSkge1xuICAgIC8vIENhY2hlZCB2ZXJzaW9uIG9mIHByaW1lXG4gICAgaWYgKHByaW1lc1tuYW1lXSkgcmV0dXJuIHByaW1lc1tuYW1lXTtcblxuICAgIHZhciBwcmltZTtcbiAgICBpZiAobmFtZSA9PT0gJ2syNTYnKSB7XG4gICAgICBwcmltZSA9IG5ldyBLMjU2KCk7XG4gICAgfSBlbHNlIGlmIChuYW1lID09PSAncDIyNCcpIHtcbiAgICAgIHByaW1lID0gbmV3IFAyMjQoKTtcbiAgICB9IGVsc2UgaWYgKG5hbWUgPT09ICdwMTkyJykge1xuICAgICAgcHJpbWUgPSBuZXcgUDE5MigpO1xuICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ3AyNTUxOScpIHtcbiAgICAgIHByaW1lID0gbmV3IFAyNTUxOSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gcHJpbWUgJyArIG5hbWUpO1xuICAgIH1cbiAgICBwcmltZXNbbmFtZV0gPSBwcmltZTtcblxuICAgIHJldHVybiBwcmltZTtcbiAgfTtcblxuICAvL1xuICAvLyBCYXNlIHJlZHVjdGlvbiBlbmdpbmVcbiAgLy9cbiAgZnVuY3Rpb24gUmVkIChtKSB7XG4gICAgaWYgKHR5cGVvZiBtID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIHByaW1lID0gQk4uX3ByaW1lKG0pO1xuICAgICAgdGhpcy5tID0gcHJpbWUucDtcbiAgICAgIHRoaXMucHJpbWUgPSBwcmltZTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzZXJ0KG0uZ3RuKDEpLCAnbW9kdWx1cyBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAxJyk7XG4gICAgICB0aGlzLm0gPSBtO1xuICAgICAgdGhpcy5wcmltZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgUmVkLnByb3RvdHlwZS5fdmVyaWZ5MSA9IGZ1bmN0aW9uIF92ZXJpZnkxIChhKSB7XG4gICAgYXNzZXJ0KGEubmVnYXRpdmUgPT09IDAsICdyZWQgd29ya3Mgb25seSB3aXRoIHBvc2l0aXZlcycpO1xuICAgIGFzc2VydChhLnJlZCwgJ3JlZCB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcbiAgfTtcblxuICBSZWQucHJvdG90eXBlLl92ZXJpZnkyID0gZnVuY3Rpb24gX3ZlcmlmeTIgKGEsIGIpIHtcbiAgICBhc3NlcnQoKGEubmVnYXRpdmUgfCBiLm5lZ2F0aXZlKSA9PT0gMCwgJ3JlZCB3b3JrcyBvbmx5IHdpdGggcG9zaXRpdmVzJyk7XG4gICAgYXNzZXJ0KGEucmVkICYmIGEucmVkID09PSBiLnJlZCxcbiAgICAgICdyZWQgd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XG4gIH07XG5cbiAgUmVkLnByb3RvdHlwZS5pbW9kID0gZnVuY3Rpb24gaW1vZCAoYSkge1xuICAgIGlmICh0aGlzLnByaW1lKSByZXR1cm4gdGhpcy5wcmltZS5pcmVkdWNlKGEpLl9mb3JjZVJlZCh0aGlzKTtcbiAgICByZXR1cm4gYS51bW9kKHRoaXMubSkuX2ZvcmNlUmVkKHRoaXMpO1xuICB9O1xuXG4gIFJlZC5wcm90b3R5cGUubmVnID0gZnVuY3Rpb24gbmVnIChhKSB7XG4gICAgaWYgKGEuaXNaZXJvKCkpIHtcbiAgICAgIHJldHVybiBhLmNsb25lKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubS5zdWIoYSkuX2ZvcmNlUmVkKHRoaXMpO1xuICB9O1xuXG4gIFJlZC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkIChhLCBiKSB7XG4gICAgdGhpcy5fdmVyaWZ5MihhLCBiKTtcblxuICAgIHZhciByZXMgPSBhLmFkZChiKTtcbiAgICBpZiAocmVzLmNtcCh0aGlzLm0pID49IDApIHtcbiAgICAgIHJlcy5pc3ViKHRoaXMubSk7XG4gICAgfVxuICAgIHJldHVybiByZXMuX2ZvcmNlUmVkKHRoaXMpO1xuICB9O1xuXG4gIFJlZC5wcm90b3R5cGUuaWFkZCA9IGZ1bmN0aW9uIGlhZGQgKGEsIGIpIHtcbiAgICB0aGlzLl92ZXJpZnkyKGEsIGIpO1xuXG4gICAgdmFyIHJlcyA9IGEuaWFkZChiKTtcbiAgICBpZiAocmVzLmNtcCh0aGlzLm0pID49IDApIHtcbiAgICAgIHJlcy5pc3ViKHRoaXMubSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH07XG5cbiAgUmVkLnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbiBzdWIgKGEsIGIpIHtcbiAgICB0aGlzLl92ZXJpZnkyKGEsIGIpO1xuXG4gICAgdmFyIHJlcyA9IGEuc3ViKGIpO1xuICAgIGlmIChyZXMuY21wbigwKSA8IDApIHtcbiAgICAgIHJlcy5pYWRkKHRoaXMubSk7XG4gICAgfVxuICAgIHJldHVybiByZXMuX2ZvcmNlUmVkKHRoaXMpO1xuICB9O1xuXG4gIFJlZC5wcm90b3R5cGUuaXN1YiA9IGZ1bmN0aW9uIGlzdWIgKGEsIGIpIHtcbiAgICB0aGlzLl92ZXJpZnkyKGEsIGIpO1xuXG4gICAgdmFyIHJlcyA9IGEuaXN1YihiKTtcbiAgICBpZiAocmVzLmNtcG4oMCkgPCAwKSB7XG4gICAgICByZXMuaWFkZCh0aGlzLm0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9O1xuXG4gIFJlZC5wcm90b3R5cGUuc2hsID0gZnVuY3Rpb24gc2hsIChhLCBudW0pIHtcbiAgICB0aGlzLl92ZXJpZnkxKGEpO1xuICAgIHJldHVybiB0aGlzLmltb2QoYS51c2hsbihudW0pKTtcbiAgfTtcblxuICBSZWQucHJvdG90eXBlLmltdWwgPSBmdW5jdGlvbiBpbXVsIChhLCBiKSB7XG4gICAgdGhpcy5fdmVyaWZ5MihhLCBiKTtcbiAgICByZXR1cm4gdGhpcy5pbW9kKGEuaW11bChiKSk7XG4gIH07XG5cbiAgUmVkLnByb3RvdHlwZS5tdWwgPSBmdW5jdGlvbiBtdWwgKGEsIGIpIHtcbiAgICB0aGlzLl92ZXJpZnkyKGEsIGIpO1xuICAgIHJldHVybiB0aGlzLmltb2QoYS5tdWwoYikpO1xuICB9O1xuXG4gIFJlZC5wcm90b3R5cGUuaXNxciA9IGZ1bmN0aW9uIGlzcXIgKGEpIHtcbiAgICByZXR1cm4gdGhpcy5pbXVsKGEsIGEuY2xvbmUoKSk7XG4gIH07XG5cbiAgUmVkLnByb3RvdHlwZS5zcXIgPSBmdW5jdGlvbiBzcXIgKGEpIHtcbiAgICByZXR1cm4gdGhpcy5tdWwoYSwgYSk7XG4gIH07XG5cbiAgUmVkLnByb3RvdHlwZS5zcXJ0ID0gZnVuY3Rpb24gc3FydCAoYSkge1xuICAgIGlmIChhLmlzWmVybygpKSByZXR1cm4gYS5jbG9uZSgpO1xuXG4gICAgdmFyIG1vZDMgPSB0aGlzLm0uYW5kbG4oMyk7XG4gICAgYXNzZXJ0KG1vZDMgJSAyID09PSAxKTtcblxuICAgIC8vIEZhc3QgY2FzZVxuICAgIGlmIChtb2QzID09PSAzKSB7XG4gICAgICB2YXIgcG93ID0gdGhpcy5tLmFkZChuZXcgQk4oMSkpLml1c2hybigyKTtcbiAgICAgIHJldHVybiB0aGlzLnBvdyhhLCBwb3cpO1xuICAgIH1cblxuICAgIC8vIFRvbmVsbGktU2hhbmtzIGFsZ29yaXRobSAoVG90YWxseSB1bm9wdGltaXplZCBhbmQgc2xvdylcbiAgICAvL1xuICAgIC8vIEZpbmQgUSBhbmQgUywgdGhhdCBRICogMiBeIFMgPSAoUCAtIDEpXG4gICAgdmFyIHEgPSB0aGlzLm0uc3VibigxKTtcbiAgICB2YXIgcyA9IDA7XG4gICAgd2hpbGUgKCFxLmlzWmVybygpICYmIHEuYW5kbG4oMSkgPT09IDApIHtcbiAgICAgIHMrKztcbiAgICAgIHEuaXVzaHJuKDEpO1xuICAgIH1cbiAgICBhc3NlcnQoIXEuaXNaZXJvKCkpO1xuXG4gICAgdmFyIG9uZSA9IG5ldyBCTigxKS50b1JlZCh0aGlzKTtcbiAgICB2YXIgbk9uZSA9IG9uZS5yZWROZWcoKTtcblxuICAgIC8vIEZpbmQgcXVhZHJhdGljIG5vbi1yZXNpZHVlXG4gICAgLy8gTk9URTogTWF4IGlzIHN1Y2ggYmVjYXVzZSBvZiBnZW5lcmFsaXplZCBSaWVtYW5uIGh5cG90aGVzaXMuXG4gICAgdmFyIGxwb3cgPSB0aGlzLm0uc3VibigxKS5pdXNocm4oMSk7XG4gICAgdmFyIHogPSB0aGlzLm0uYml0TGVuZ3RoKCk7XG4gICAgeiA9IG5ldyBCTigyICogeiAqIHopLnRvUmVkKHRoaXMpO1xuXG4gICAgd2hpbGUgKHRoaXMucG93KHosIGxwb3cpLmNtcChuT25lKSAhPT0gMCkge1xuICAgICAgei5yZWRJQWRkKG5PbmUpO1xuICAgIH1cblxuICAgIHZhciBjID0gdGhpcy5wb3coeiwgcSk7XG4gICAgdmFyIHIgPSB0aGlzLnBvdyhhLCBxLmFkZG4oMSkuaXVzaHJuKDEpKTtcbiAgICB2YXIgdCA9IHRoaXMucG93KGEsIHEpO1xuICAgIHZhciBtID0gcztcbiAgICB3aGlsZSAodC5jbXAob25lKSAhPT0gMCkge1xuICAgICAgdmFyIHRtcCA9IHQ7XG4gICAgICBmb3IgKHZhciBpID0gMDsgdG1wLmNtcChvbmUpICE9PSAwOyBpKyspIHtcbiAgICAgICAgdG1wID0gdG1wLnJlZFNxcigpO1xuICAgICAgfVxuICAgICAgYXNzZXJ0KGkgPCBtKTtcbiAgICAgIHZhciBiID0gdGhpcy5wb3coYywgbmV3IEJOKDEpLml1c2hsbihtIC0gaSAtIDEpKTtcblxuICAgICAgciA9IHIucmVkTXVsKGIpO1xuICAgICAgYyA9IGIucmVkU3FyKCk7XG4gICAgICB0ID0gdC5yZWRNdWwoYyk7XG4gICAgICBtID0gaTtcbiAgICB9XG5cbiAgICByZXR1cm4gcjtcbiAgfTtcblxuICBSZWQucHJvdG90eXBlLmludm0gPSBmdW5jdGlvbiBpbnZtIChhKSB7XG4gICAgdmFyIGludiA9IGEuX2ludm1wKHRoaXMubSk7XG4gICAgaWYgKGludi5uZWdhdGl2ZSAhPT0gMCkge1xuICAgICAgaW52Lm5lZ2F0aXZlID0gMDtcbiAgICAgIHJldHVybiB0aGlzLmltb2QoaW52KS5yZWROZWcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuaW1vZChpbnYpO1xuICAgIH1cbiAgfTtcblxuICBSZWQucHJvdG90eXBlLnBvdyA9IGZ1bmN0aW9uIHBvdyAoYSwgbnVtKSB7XG4gICAgaWYgKG51bS5pc1plcm8oKSkgcmV0dXJuIG5ldyBCTigxKS50b1JlZCh0aGlzKTtcbiAgICBpZiAobnVtLmNtcG4oMSkgPT09IDApIHJldHVybiBhLmNsb25lKCk7XG5cbiAgICB2YXIgd2luZG93U2l6ZSA9IDQ7XG4gICAgdmFyIHduZCA9IG5ldyBBcnJheSgxIDw8IHdpbmRvd1NpemUpO1xuICAgIHduZFswXSA9IG5ldyBCTigxKS50b1JlZCh0aGlzKTtcbiAgICB3bmRbMV0gPSBhO1xuICAgIGZvciAodmFyIGkgPSAyOyBpIDwgd25kLmxlbmd0aDsgaSsrKSB7XG4gICAgICB3bmRbaV0gPSB0aGlzLm11bCh3bmRbaSAtIDFdLCBhKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzID0gd25kWzBdO1xuICAgIHZhciBjdXJyZW50ID0gMDtcbiAgICB2YXIgY3VycmVudExlbiA9IDA7XG4gICAgdmFyIHN0YXJ0ID0gbnVtLmJpdExlbmd0aCgpICUgMjY7XG4gICAgaWYgKHN0YXJ0ID09PSAwKSB7XG4gICAgICBzdGFydCA9IDI2O1xuICAgIH1cblxuICAgIGZvciAoaSA9IG51bS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIHdvcmQgPSBudW0ud29yZHNbaV07XG4gICAgICBmb3IgKHZhciBqID0gc3RhcnQgLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICB2YXIgYml0ID0gKHdvcmQgPj4gaikgJiAxO1xuICAgICAgICBpZiAocmVzICE9PSB3bmRbMF0pIHtcbiAgICAgICAgICByZXMgPSB0aGlzLnNxcihyZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJpdCA9PT0gMCAmJiBjdXJyZW50ID09PSAwKSB7XG4gICAgICAgICAgY3VycmVudExlbiA9IDA7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50IDw8PSAxO1xuICAgICAgICBjdXJyZW50IHw9IGJpdDtcbiAgICAgICAgY3VycmVudExlbisrO1xuICAgICAgICBpZiAoY3VycmVudExlbiAhPT0gd2luZG93U2l6ZSAmJiAoaSAhPT0gMCB8fCBqICE9PSAwKSkgY29udGludWU7XG5cbiAgICAgICAgcmVzID0gdGhpcy5tdWwocmVzLCB3bmRbY3VycmVudF0pO1xuICAgICAgICBjdXJyZW50TGVuID0gMDtcbiAgICAgICAgY3VycmVudCA9IDA7XG4gICAgICB9XG4gICAgICBzdGFydCA9IDI2O1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH07XG5cbiAgUmVkLnByb3RvdHlwZS5jb252ZXJ0VG8gPSBmdW5jdGlvbiBjb252ZXJ0VG8gKG51bSkge1xuICAgIHZhciByID0gbnVtLnVtb2QodGhpcy5tKTtcblxuICAgIHJldHVybiByID09PSBudW0gPyByLmNsb25lKCkgOiByO1xuICB9O1xuXG4gIFJlZC5wcm90b3R5cGUuY29udmVydEZyb20gPSBmdW5jdGlvbiBjb252ZXJ0RnJvbSAobnVtKSB7XG4gICAgdmFyIHJlcyA9IG51bS5jbG9uZSgpO1xuICAgIHJlcy5yZWQgPSBudWxsO1xuICAgIHJldHVybiByZXM7XG4gIH07XG5cbiAgLy9cbiAgLy8gTW9udGdvbWVyeSBtZXRob2QgZW5naW5lXG4gIC8vXG5cbiAgQk4ubW9udCA9IGZ1bmN0aW9uIG1vbnQgKG51bSkge1xuICAgIHJldHVybiBuZXcgTW9udChudW0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIE1vbnQgKG0pIHtcbiAgICBSZWQuY2FsbCh0aGlzLCBtKTtcblxuICAgIHRoaXMuc2hpZnQgPSB0aGlzLm0uYml0TGVuZ3RoKCk7XG4gICAgaWYgKHRoaXMuc2hpZnQgJSAyNiAhPT0gMCkge1xuICAgICAgdGhpcy5zaGlmdCArPSAyNiAtICh0aGlzLnNoaWZ0ICUgMjYpO1xuICAgIH1cblxuICAgIHRoaXMuciA9IG5ldyBCTigxKS5pdXNobG4odGhpcy5zaGlmdCk7XG4gICAgdGhpcy5yMiA9IHRoaXMuaW1vZCh0aGlzLnIuc3FyKCkpO1xuICAgIHRoaXMucmludiA9IHRoaXMuci5faW52bXAodGhpcy5tKTtcblxuICAgIHRoaXMubWludiA9IHRoaXMucmludi5tdWwodGhpcy5yKS5pc3VibigxKS5kaXYodGhpcy5tKTtcbiAgICB0aGlzLm1pbnYgPSB0aGlzLm1pbnYudW1vZCh0aGlzLnIpO1xuICAgIHRoaXMubWludiA9IHRoaXMuci5zdWIodGhpcy5taW52KTtcbiAgfVxuICBpbmhlcml0cyhNb250LCBSZWQpO1xuXG4gIE1vbnQucHJvdG90eXBlLmNvbnZlcnRUbyA9IGZ1bmN0aW9uIGNvbnZlcnRUbyAobnVtKSB7XG4gICAgcmV0dXJuIHRoaXMuaW1vZChudW0udXNobG4odGhpcy5zaGlmdCkpO1xuICB9O1xuXG4gIE1vbnQucHJvdG90eXBlLmNvbnZlcnRGcm9tID0gZnVuY3Rpb24gY29udmVydEZyb20gKG51bSkge1xuICAgIHZhciByID0gdGhpcy5pbW9kKG51bS5tdWwodGhpcy5yaW52KSk7XG4gICAgci5yZWQgPSBudWxsO1xuICAgIHJldHVybiByO1xuICB9O1xuXG4gIE1vbnQucHJvdG90eXBlLmltdWwgPSBmdW5jdGlvbiBpbXVsIChhLCBiKSB7XG4gICAgaWYgKGEuaXNaZXJvKCkgfHwgYi5pc1plcm8oKSkge1xuICAgICAgYS53b3Jkc1swXSA9IDA7XG4gICAgICBhLmxlbmd0aCA9IDE7XG4gICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICB2YXIgdCA9IGEuaW11bChiKTtcbiAgICB2YXIgYyA9IHQubWFza24odGhpcy5zaGlmdCkubXVsKHRoaXMubWludikuaW1hc2tuKHRoaXMuc2hpZnQpLm11bCh0aGlzLm0pO1xuICAgIHZhciB1ID0gdC5pc3ViKGMpLml1c2hybih0aGlzLnNoaWZ0KTtcbiAgICB2YXIgcmVzID0gdTtcblxuICAgIGlmICh1LmNtcCh0aGlzLm0pID49IDApIHtcbiAgICAgIHJlcyA9IHUuaXN1Yih0aGlzLm0pO1xuICAgIH0gZWxzZSBpZiAodS5jbXBuKDApIDwgMCkge1xuICAgICAgcmVzID0gdS5pYWRkKHRoaXMubSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5fZm9yY2VSZWQodGhpcyk7XG4gIH07XG5cbiAgTW9udC5wcm90b3R5cGUubXVsID0gZnVuY3Rpb24gbXVsIChhLCBiKSB7XG4gICAgaWYgKGEuaXNaZXJvKCkgfHwgYi5pc1plcm8oKSkgcmV0dXJuIG5ldyBCTigwKS5fZm9yY2VSZWQodGhpcyk7XG5cbiAgICB2YXIgdCA9IGEubXVsKGIpO1xuICAgIHZhciBjID0gdC5tYXNrbih0aGlzLnNoaWZ0KS5tdWwodGhpcy5taW52KS5pbWFza24odGhpcy5zaGlmdCkubXVsKHRoaXMubSk7XG4gICAgdmFyIHUgPSB0LmlzdWIoYykuaXVzaHJuKHRoaXMuc2hpZnQpO1xuICAgIHZhciByZXMgPSB1O1xuICAgIGlmICh1LmNtcCh0aGlzLm0pID49IDApIHtcbiAgICAgIHJlcyA9IHUuaXN1Yih0aGlzLm0pO1xuICAgIH0gZWxzZSBpZiAodS5jbXBuKDApIDwgMCkge1xuICAgICAgcmVzID0gdS5pYWRkKHRoaXMubSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5fZm9yY2VSZWQodGhpcyk7XG4gIH07XG5cbiAgTW9udC5wcm90b3R5cGUuaW52bSA9IGZ1bmN0aW9uIGludm0gKGEpIHtcbiAgICAvLyAoQVIpXi0xICogUl4yID0gKEFeLTEgKiBSXi0xKSAqIFJeMiA9IEFeLTEgKiBSXG4gICAgdmFyIHJlcyA9IHRoaXMuaW1vZChhLl9pbnZtcCh0aGlzLm0pLm11bCh0aGlzLnIyKSk7XG4gICAgcmV0dXJuIHJlcy5fZm9yY2VSZWQodGhpcyk7XG4gIH07XG59KSh0eXBlb2YgbW9kdWxlID09PSAndW5kZWZpbmVkJyB8fCBtb2R1bGUsIHRoaXMpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==