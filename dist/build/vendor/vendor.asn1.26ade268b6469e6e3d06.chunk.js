(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.asn1"],{

/***/ "3OfL":
/*!*********************************************!*\
  !*** ./node_modules/asn1/lib/ber/writer.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var assert = __webpack_require__(/*! assert */ "9lTW");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var ASN1 = __webpack_require__(/*! ./types */ "jS04");
var errors = __webpack_require__(/*! ./errors */ "jx5P");


// --- Globals

var newInvalidAsn1Error = errors.newInvalidAsn1Error;

var DEFAULT_OPTS = {
  size: 1024,
  growthFactor: 8
};


// --- Helpers

function merge(from, to) {
  assert.ok(from);
  assert.equal(typeof (from), 'object');
  assert.ok(to);
  assert.equal(typeof (to), 'object');

  var keys = Object.getOwnPropertyNames(from);
  keys.forEach(function (key) {
    if (to[key])
      return;

    var value = Object.getOwnPropertyDescriptor(from, key);
    Object.defineProperty(to, key, value);
  });

  return to;
}



// --- API

function Writer(options) {
  options = merge(DEFAULT_OPTS, options || {});

  this._buf = Buffer.alloc(options.size || 1024);
  this._size = this._buf.length;
  this._offset = 0;
  this._options = options;

  // A list of offsets in the buffer where we need to insert
  // sequence tag/len pairs.
  this._seq = [];
}

Object.defineProperty(Writer.prototype, 'buffer', {
  get: function () {
    if (this._seq.length)
      throw newInvalidAsn1Error(this._seq.length + ' unended sequence(s)');

    return (this._buf.slice(0, this._offset));
  }
});

Writer.prototype.writeByte = function (b) {
  if (typeof (b) !== 'number')
    throw new TypeError('argument must be a Number');

  this._ensure(1);
  this._buf[this._offset++] = b;
};


Writer.prototype.writeInt = function (i, tag) {
  if (typeof (i) !== 'number')
    throw new TypeError('argument must be a Number');
  if (typeof (tag) !== 'number')
    tag = ASN1.Integer;

  var sz = 4;

  while ((((i & 0xff800000) === 0) || ((i & 0xff800000) === 0xff800000 >> 0)) &&
        (sz > 1)) {
    sz--;
    i <<= 8;
  }

  if (sz > 4)
    throw newInvalidAsn1Error('BER ints cannot be > 0xffffffff');

  this._ensure(2 + sz);
  this._buf[this._offset++] = tag;
  this._buf[this._offset++] = sz;

  while (sz-- > 0) {
    this._buf[this._offset++] = ((i & 0xff000000) >>> 24);
    i <<= 8;
  }

};


Writer.prototype.writeNull = function () {
  this.writeByte(ASN1.Null);
  this.writeByte(0x00);
};


Writer.prototype.writeEnumeration = function (i, tag) {
  if (typeof (i) !== 'number')
    throw new TypeError('argument must be a Number');
  if (typeof (tag) !== 'number')
    tag = ASN1.Enumeration;

  return this.writeInt(i, tag);
};


Writer.prototype.writeBoolean = function (b, tag) {
  if (typeof (b) !== 'boolean')
    throw new TypeError('argument must be a Boolean');
  if (typeof (tag) !== 'number')
    tag = ASN1.Boolean;

  this._ensure(3);
  this._buf[this._offset++] = tag;
  this._buf[this._offset++] = 0x01;
  this._buf[this._offset++] = b ? 0xff : 0x00;
};


Writer.prototype.writeString = function (s, tag) {
  if (typeof (s) !== 'string')
    throw new TypeError('argument must be a string (was: ' + typeof (s) + ')');
  if (typeof (tag) !== 'number')
    tag = ASN1.OctetString;

  var len = Buffer.byteLength(s);
  this.writeByte(tag);
  this.writeLength(len);
  if (len) {
    this._ensure(len);
    this._buf.write(s, this._offset);
    this._offset += len;
  }
};


Writer.prototype.writeBuffer = function (buf, tag) {
  if (typeof (tag) !== 'number')
    throw new TypeError('tag must be a number');
  if (!Buffer.isBuffer(buf))
    throw new TypeError('argument must be a buffer');

  this.writeByte(tag);
  this.writeLength(buf.length);
  this._ensure(buf.length);
  buf.copy(this._buf, this._offset, 0, buf.length);
  this._offset += buf.length;
};


Writer.prototype.writeStringArray = function (strings) {
  if ((!strings instanceof Array))
    throw new TypeError('argument must be an Array[String]');

  var self = this;
  strings.forEach(function (s) {
    self.writeString(s);
  });
};

// This is really to solve DER cases, but whatever for now
Writer.prototype.writeOID = function (s, tag) {
  if (typeof (s) !== 'string')
    throw new TypeError('argument must be a string');
  if (typeof (tag) !== 'number')
    tag = ASN1.OID;

  if (!/^([0-9]+\.){3,}[0-9]+$/.test(s))
    throw new Error('argument is not a valid OID string');

  function encodeOctet(bytes, octet) {
    if (octet < 128) {
        bytes.push(octet);
    } else if (octet < 16384) {
        bytes.push((octet >>> 7) | 0x80);
        bytes.push(octet & 0x7F);
    } else if (octet < 2097152) {
      bytes.push((octet >>> 14) | 0x80);
      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
      bytes.push(octet & 0x7F);
    } else if (octet < 268435456) {
      bytes.push((octet >>> 21) | 0x80);
      bytes.push(((octet >>> 14) | 0x80) & 0xFF);
      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
      bytes.push(octet & 0x7F);
    } else {
      bytes.push(((octet >>> 28) | 0x80) & 0xFF);
      bytes.push(((octet >>> 21) | 0x80) & 0xFF);
      bytes.push(((octet >>> 14) | 0x80) & 0xFF);
      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
      bytes.push(octet & 0x7F);
    }
  }

  var tmp = s.split('.');
  var bytes = [];
  bytes.push(parseInt(tmp[0], 10) * 40 + parseInt(tmp[1], 10));
  tmp.slice(2).forEach(function (b) {
    encodeOctet(bytes, parseInt(b, 10));
  });

  var self = this;
  this._ensure(2 + bytes.length);
  this.writeByte(tag);
  this.writeLength(bytes.length);
  bytes.forEach(function (b) {
    self.writeByte(b);
  });
};


Writer.prototype.writeLength = function (len) {
  if (typeof (len) !== 'number')
    throw new TypeError('argument must be a Number');

  this._ensure(4);

  if (len <= 0x7f) {
    this._buf[this._offset++] = len;
  } else if (len <= 0xff) {
    this._buf[this._offset++] = 0x81;
    this._buf[this._offset++] = len;
  } else if (len <= 0xffff) {
    this._buf[this._offset++] = 0x82;
    this._buf[this._offset++] = len >> 8;
    this._buf[this._offset++] = len;
  } else if (len <= 0xffffff) {
    this._buf[this._offset++] = 0x83;
    this._buf[this._offset++] = len >> 16;
    this._buf[this._offset++] = len >> 8;
    this._buf[this._offset++] = len;
  } else {
    throw newInvalidAsn1Error('Length too long (> 4 bytes)');
  }
};

Writer.prototype.startSequence = function (tag) {
  if (typeof (tag) !== 'number')
    tag = ASN1.Sequence | ASN1.Constructor;

  this.writeByte(tag);
  this._seq.push(this._offset);
  this._ensure(3);
  this._offset += 3;
};


Writer.prototype.endSequence = function () {
  var seq = this._seq.pop();
  var start = seq + 3;
  var len = this._offset - start;

  if (len <= 0x7f) {
    this._shift(start, len, -2);
    this._buf[seq] = len;
  } else if (len <= 0xff) {
    this._shift(start, len, -1);
    this._buf[seq] = 0x81;
    this._buf[seq + 1] = len;
  } else if (len <= 0xffff) {
    this._buf[seq] = 0x82;
    this._buf[seq + 1] = len >> 8;
    this._buf[seq + 2] = len;
  } else if (len <= 0xffffff) {
    this._shift(start, len, 1);
    this._buf[seq] = 0x83;
    this._buf[seq + 1] = len >> 16;
    this._buf[seq + 2] = len >> 8;
    this._buf[seq + 3] = len;
  } else {
    throw newInvalidAsn1Error('Sequence too long');
  }
};


Writer.prototype._shift = function (start, len, shift) {
  assert.ok(start !== undefined);
  assert.ok(len !== undefined);
  assert.ok(shift);

  this._buf.copy(this._buf, start + shift, start, start + len);
  this._offset += shift;
};

Writer.prototype._ensure = function (len) {
  assert.ok(len);

  if (this._size - this._offset < len) {
    var sz = this._size * this._options.growthFactor;
    if (sz - this._offset < len)
      sz += len;

    var buf = Buffer.alloc(sz);

    this._buf.copy(buf, 0, 0, this._offset);
    this._buf = buf;
    this._size = sz;
  }
};



// --- Exported API

module.exports = Writer;


/***/ }),

/***/ "6toL":
/*!*********************************************!*\
  !*** ./node_modules/asn1/lib/ber/reader.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var assert = __webpack_require__(/*! assert */ "9lTW");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;

var ASN1 = __webpack_require__(/*! ./types */ "jS04");
var errors = __webpack_require__(/*! ./errors */ "jx5P");


// --- Globals

var newInvalidAsn1Error = errors.newInvalidAsn1Error;



// --- API

function Reader(data) {
  if (!data || !Buffer.isBuffer(data))
    throw new TypeError('data must be a node Buffer');

  this._buf = data;
  this._size = data.length;

  // These hold the "current" state
  this._len = 0;
  this._offset = 0;
}

Object.defineProperty(Reader.prototype, 'length', {
  enumerable: true,
  get: function () { return (this._len); }
});

Object.defineProperty(Reader.prototype, 'offset', {
  enumerable: true,
  get: function () { return (this._offset); }
});

Object.defineProperty(Reader.prototype, 'remain', {
  get: function () { return (this._size - this._offset); }
});

Object.defineProperty(Reader.prototype, 'buffer', {
  get: function () { return (this._buf.slice(this._offset)); }
});


/**
 * Reads a single byte and advances offset; you can pass in `true` to make this
 * a "peek" operation (i.e., get the byte, but don't advance the offset).
 *
 * @param {Boolean} peek true means don't move offset.
 * @return {Number} the next byte, null if not enough data.
 */
Reader.prototype.readByte = function (peek) {
  if (this._size - this._offset < 1)
    return null;

  var b = this._buf[this._offset] & 0xff;

  if (!peek)
    this._offset += 1;

  return b;
};


Reader.prototype.peek = function () {
  return this.readByte(true);
};


/**
 * Reads a (potentially) variable length off the BER buffer.  This call is
 * not really meant to be called directly, as callers have to manipulate
 * the internal buffer afterwards.
 *
 * As a result of this call, you can call `Reader.length`, until the
 * next thing called that does a readLength.
 *
 * @return {Number} the amount of offset to advance the buffer.
 * @throws {InvalidAsn1Error} on bad ASN.1
 */
Reader.prototype.readLength = function (offset) {
  if (offset === undefined)
    offset = this._offset;

  if (offset >= this._size)
    return null;

  var lenB = this._buf[offset++] & 0xff;
  if (lenB === null)
    return null;

  if ((lenB & 0x80) === 0x80) {
    lenB &= 0x7f;

    if (lenB === 0)
      throw newInvalidAsn1Error('Indefinite length not supported');

    if (lenB > 4)
      throw newInvalidAsn1Error('encoding too long');

    if (this._size - offset < lenB)
      return null;

    this._len = 0;
    for (var i = 0; i < lenB; i++)
      this._len = (this._len << 8) + (this._buf[offset++] & 0xff);

  } else {
    // Wasn't a variable length
    this._len = lenB;
  }

  return offset;
};


/**
 * Parses the next sequence in this BER buffer.
 *
 * To get the length of the sequence, call `Reader.length`.
 *
 * @return {Number} the sequence's tag.
 */
Reader.prototype.readSequence = function (tag) {
  var seq = this.peek();
  if (seq === null)
    return null;
  if (tag !== undefined && tag !== seq)
    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
                              ': got 0x' + seq.toString(16));

  var o = this.readLength(this._offset + 1); // stored in `length`
  if (o === null)
    return null;

  this._offset = o;
  return seq;
};


Reader.prototype.readInt = function () {
  return this._readTag(ASN1.Integer);
};


Reader.prototype.readBoolean = function () {
  return (this._readTag(ASN1.Boolean) === 0 ? false : true);
};


Reader.prototype.readEnumeration = function () {
  return this._readTag(ASN1.Enumeration);
};


Reader.prototype.readString = function (tag, retbuf) {
  if (!tag)
    tag = ASN1.OctetString;

  var b = this.peek();
  if (b === null)
    return null;

  if (b !== tag)
    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
                              ': got 0x' + b.toString(16));

  var o = this.readLength(this._offset + 1); // stored in `length`

  if (o === null)
    return null;

  if (this.length > this._size - o)
    return null;

  this._offset = o;

  if (this.length === 0)
    return retbuf ? Buffer.alloc(0) : '';

  var str = this._buf.slice(this._offset, this._offset + this.length);
  this._offset += this.length;

  return retbuf ? str : str.toString('utf8');
};

Reader.prototype.readOID = function (tag) {
  if (!tag)
    tag = ASN1.OID;

  var b = this.readString(tag, true);
  if (b === null)
    return null;

  var values = [];
  var value = 0;

  for (var i = 0; i < b.length; i++) {
    var byte = b[i] & 0xff;

    value <<= 7;
    value += byte & 0x7f;
    if ((byte & 0x80) === 0) {
      values.push(value);
      value = 0;
    }
  }

  value = values.shift();
  values.unshift(value % 40);
  values.unshift((value / 40) >> 0);

  return values.join('.');
};


Reader.prototype._readTag = function (tag) {
  assert.ok(tag !== undefined);

  var b = this.peek();

  if (b === null)
    return null;

  if (b !== tag)
    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
                              ': got 0x' + b.toString(16));

  var o = this.readLength(this._offset + 1); // stored in `length`
  if (o === null)
    return null;

  if (this.length > 4)
    throw newInvalidAsn1Error('Integer too long: ' + this.length);

  if (this.length > this._size - o)
    return null;
  this._offset = o;

  var fb = this._buf[this._offset];
  var value = 0;

  for (var i = 0; i < this.length; i++) {
    value <<= 8;
    value |= (this._buf[this._offset++] & 0xff);
  }

  if ((fb & 0x80) === 0x80 && i !== 4)
    value -= (1 << (i * 8));

  return value >> 0;
};



// --- Exported API

module.exports = Reader;


/***/ }),

/***/ "PrQf":
/*!********************************************!*\
  !*** ./node_modules/asn1/lib/ber/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var errors = __webpack_require__(/*! ./errors */ "jx5P");
var types = __webpack_require__(/*! ./types */ "jS04");

var Reader = __webpack_require__(/*! ./reader */ "6toL");
var Writer = __webpack_require__(/*! ./writer */ "3OfL");


// --- Exports

module.exports = {

  Reader: Reader,

  Writer: Writer

};

for (var t in types) {
  if (types.hasOwnProperty(t))
    module.exports[t] = types[t];
}
for (var e in errors) {
  if (errors.hasOwnProperty(e))
    module.exports[e] = errors[e];
}


/***/ }),

/***/ "ZkxX":
/*!****************************************!*\
  !*** ./node_modules/asn1/lib/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

// If you have no idea what ASN.1 or BER is, see this:
// ftp://ftp.rsa.com/pub/pkcs/ascii/layman.asc

var Ber = __webpack_require__(/*! ./ber/index */ "PrQf");



// --- Exported API

module.exports = {

  Ber: Ber,

  BerReader: Ber.Reader,

  BerWriter: Ber.Writer

};


/***/ }),

/***/ "jS04":
/*!********************************************!*\
  !*** ./node_modules/asn1/lib/ber/types.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.


module.exports = {
  EOC: 0,
  Boolean: 1,
  Integer: 2,
  BitString: 3,
  OctetString: 4,
  Null: 5,
  OID: 6,
  ObjectDescriptor: 7,
  External: 8,
  Real: 9, // float
  Enumeration: 10,
  PDV: 11,
  Utf8String: 12,
  RelativeOID: 13,
  Sequence: 16,
  Set: 17,
  NumericString: 18,
  PrintableString: 19,
  T61String: 20,
  VideotexString: 21,
  IA5String: 22,
  UTCTime: 23,
  GeneralizedTime: 24,
  GraphicString: 25,
  VisibleString: 26,
  GeneralString: 28,
  UniversalString: 29,
  CharacterString: 30,
  BMPString: 31,
  Constructor: 32,
  Context: 128
};


/***/ }),

/***/ "jx5P":
/*!*********************************************!*\
  !*** ./node_modules/asn1/lib/ber/errors.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.


module.exports = {

  newInvalidAsn1Error: function (msg) {
    var e = new Error();
    e.name = 'InvalidAsn1Error';
    e.message = msg || '';
    return e;
  }

};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS9saWIvYmVyL3dyaXRlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS9saWIvYmVyL3JlYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS9saWIvYmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc24xL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS9saWIvYmVyL3R5cGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc24xL2xpYi9iZXIvZXJyb3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixhQUFhLG1CQUFPLENBQUMsMEJBQWM7QUFDbkMsV0FBVyxtQkFBTyxDQUFDLHFCQUFTO0FBQzVCLGFBQWEsbUJBQU8sQ0FBQyxzQkFBVTs7O0FBRy9COztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7Ozs7QUFJQTs7QUFFQTtBQUNBLDZDQUE2Qzs7QUFFN0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLEdBQUc7QUFDdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7O0FBR0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNuQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmFzbjEuMjZhZGUyNjhiNjQ2OWU2ZTNkMDYuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMSBNYXJrIENhdmFnZSA8bWNhdmFnZUBnbWFpbC5jb20+IEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XG52YXIgQVNOMSA9IHJlcXVpcmUoJy4vdHlwZXMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xuXG5cbi8vIC0tLSBHbG9iYWxzXG5cbnZhciBuZXdJbnZhbGlkQXNuMUVycm9yID0gZXJyb3JzLm5ld0ludmFsaWRBc24xRXJyb3I7XG5cbnZhciBERUZBVUxUX09QVFMgPSB7XG4gIHNpemU6IDEwMjQsXG4gIGdyb3d0aEZhY3RvcjogOFxufTtcblxuXG4vLyAtLS0gSGVscGVyc1xuXG5mdW5jdGlvbiBtZXJnZShmcm9tLCB0bykge1xuICBhc3NlcnQub2soZnJvbSk7XG4gIGFzc2VydC5lcXVhbCh0eXBlb2YgKGZyb20pLCAnb2JqZWN0Jyk7XG4gIGFzc2VydC5vayh0byk7XG4gIGFzc2VydC5lcXVhbCh0eXBlb2YgKHRvKSwgJ29iamVjdCcpO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZnJvbSk7XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKHRvW2tleV0pXG4gICAgICByZXR1cm47XG5cbiAgICB2YXIgdmFsdWUgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZyb20sIGtleSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRvLCBrZXksIHZhbHVlKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRvO1xufVxuXG5cblxuLy8gLS0tIEFQSVxuXG5mdW5jdGlvbiBXcml0ZXIob3B0aW9ucykge1xuICBvcHRpb25zID0gbWVyZ2UoREVGQVVMVF9PUFRTLCBvcHRpb25zIHx8IHt9KTtcblxuICB0aGlzLl9idWYgPSBCdWZmZXIuYWxsb2Mob3B0aW9ucy5zaXplIHx8IDEwMjQpO1xuICB0aGlzLl9zaXplID0gdGhpcy5fYnVmLmxlbmd0aDtcbiAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgLy8gQSBsaXN0IG9mIG9mZnNldHMgaW4gdGhlIGJ1ZmZlciB3aGVyZSB3ZSBuZWVkIHRvIGluc2VydFxuICAvLyBzZXF1ZW5jZSB0YWcvbGVuIHBhaXJzLlxuICB0aGlzLl9zZXEgPSBbXTtcbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRlci5wcm90b3R5cGUsICdidWZmZXInLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9zZXEubGVuZ3RoKVxuICAgICAgdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcih0aGlzLl9zZXEubGVuZ3RoICsgJyB1bmVuZGVkIHNlcXVlbmNlKHMpJyk7XG5cbiAgICByZXR1cm4gKHRoaXMuX2J1Zi5zbGljZSgwLCB0aGlzLl9vZmZzZXQpKTtcbiAgfVxufSk7XG5cbldyaXRlci5wcm90b3R5cGUud3JpdGVCeXRlID0gZnVuY3Rpb24gKGIpIHtcbiAgaWYgKHR5cGVvZiAoYikgIT09ICdudW1iZXInKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IG11c3QgYmUgYSBOdW1iZXInKTtcblxuICB0aGlzLl9lbnN1cmUoMSk7XG4gIHRoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK10gPSBiO1xufTtcblxuXG5Xcml0ZXIucHJvdG90eXBlLndyaXRlSW50ID0gZnVuY3Rpb24gKGksIHRhZykge1xuICBpZiAodHlwZW9mIChpKSAhPT0gJ251bWJlcicpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgbXVzdCBiZSBhIE51bWJlcicpO1xuICBpZiAodHlwZW9mICh0YWcpICE9PSAnbnVtYmVyJylcbiAgICB0YWcgPSBBU04xLkludGVnZXI7XG5cbiAgdmFyIHN6ID0gNDtcblxuICB3aGlsZSAoKCgoaSAmIDB4ZmY4MDAwMDApID09PSAwKSB8fCAoKGkgJiAweGZmODAwMDAwKSA9PT0gMHhmZjgwMDAwMCA+PiAwKSkgJiZcbiAgICAgICAgKHN6ID4gMSkpIHtcbiAgICBzei0tO1xuICAgIGkgPDw9IDg7XG4gIH1cblxuICBpZiAoc3ogPiA0KVxuICAgIHRocm93IG5ld0ludmFsaWRBc24xRXJyb3IoJ0JFUiBpbnRzIGNhbm5vdCBiZSA+IDB4ZmZmZmZmZmYnKTtcblxuICB0aGlzLl9lbnN1cmUoMiArIHN6KTtcbiAgdGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXSA9IHRhZztcbiAgdGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXSA9IHN6O1xuXG4gIHdoaWxlIChzei0tID4gMCkge1xuICAgIHRoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK10gPSAoKGkgJiAweGZmMDAwMDAwKSA+Pj4gMjQpO1xuICAgIGkgPDw9IDg7XG4gIH1cblxufTtcblxuXG5Xcml0ZXIucHJvdG90eXBlLndyaXRlTnVsbCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy53cml0ZUJ5dGUoQVNOMS5OdWxsKTtcbiAgdGhpcy53cml0ZUJ5dGUoMHgwMCk7XG59O1xuXG5cbldyaXRlci5wcm90b3R5cGUud3JpdGVFbnVtZXJhdGlvbiA9IGZ1bmN0aW9uIChpLCB0YWcpIHtcbiAgaWYgKHR5cGVvZiAoaSkgIT09ICdudW1iZXInKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IG11c3QgYmUgYSBOdW1iZXInKTtcbiAgaWYgKHR5cGVvZiAodGFnKSAhPT0gJ251bWJlcicpXG4gICAgdGFnID0gQVNOMS5FbnVtZXJhdGlvbjtcblxuICByZXR1cm4gdGhpcy53cml0ZUludChpLCB0YWcpO1xufTtcblxuXG5Xcml0ZXIucHJvdG90eXBlLndyaXRlQm9vbGVhbiA9IGZ1bmN0aW9uIChiLCB0YWcpIHtcbiAgaWYgKHR5cGVvZiAoYikgIT09ICdib29sZWFuJylcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBtdXN0IGJlIGEgQm9vbGVhbicpO1xuICBpZiAodHlwZW9mICh0YWcpICE9PSAnbnVtYmVyJylcbiAgICB0YWcgPSBBU04xLkJvb2xlYW47XG5cbiAgdGhpcy5fZW5zdXJlKDMpO1xuICB0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdID0gdGFnO1xuICB0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdID0gMHgwMTtcbiAgdGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXSA9IGIgPyAweGZmIDogMHgwMDtcbn07XG5cblxuV3JpdGVyLnByb3RvdHlwZS53cml0ZVN0cmluZyA9IGZ1bmN0aW9uIChzLCB0YWcpIHtcbiAgaWYgKHR5cGVvZiAocykgIT09ICdzdHJpbmcnKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcgKHdhczogJyArIHR5cGVvZiAocykgKyAnKScpO1xuICBpZiAodHlwZW9mICh0YWcpICE9PSAnbnVtYmVyJylcbiAgICB0YWcgPSBBU04xLk9jdGV0U3RyaW5nO1xuXG4gIHZhciBsZW4gPSBCdWZmZXIuYnl0ZUxlbmd0aChzKTtcbiAgdGhpcy53cml0ZUJ5dGUodGFnKTtcbiAgdGhpcy53cml0ZUxlbmd0aChsZW4pO1xuICBpZiAobGVuKSB7XG4gICAgdGhpcy5fZW5zdXJlKGxlbik7XG4gICAgdGhpcy5fYnVmLndyaXRlKHMsIHRoaXMuX29mZnNldCk7XG4gICAgdGhpcy5fb2Zmc2V0ICs9IGxlbjtcbiAgfVxufTtcblxuXG5Xcml0ZXIucHJvdG90eXBlLndyaXRlQnVmZmVyID0gZnVuY3Rpb24gKGJ1ZiwgdGFnKSB7XG4gIGlmICh0eXBlb2YgKHRhZykgIT09ICdudW1iZXInKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RhZyBtdXN0IGJlIGEgbnVtYmVyJyk7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgbXVzdCBiZSBhIGJ1ZmZlcicpO1xuXG4gIHRoaXMud3JpdGVCeXRlKHRhZyk7XG4gIHRoaXMud3JpdGVMZW5ndGgoYnVmLmxlbmd0aCk7XG4gIHRoaXMuX2Vuc3VyZShidWYubGVuZ3RoKTtcbiAgYnVmLmNvcHkodGhpcy5fYnVmLCB0aGlzLl9vZmZzZXQsIDAsIGJ1Zi5sZW5ndGgpO1xuICB0aGlzLl9vZmZzZXQgKz0gYnVmLmxlbmd0aDtcbn07XG5cblxuV3JpdGVyLnByb3RvdHlwZS53cml0ZVN0cmluZ0FycmF5ID0gZnVuY3Rpb24gKHN0cmluZ3MpIHtcbiAgaWYgKCghc3RyaW5ncyBpbnN0YW5jZW9mIEFycmF5KSlcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5W1N0cmluZ10nKTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHN0cmluZ3MuZm9yRWFjaChmdW5jdGlvbiAocykge1xuICAgIHNlbGYud3JpdGVTdHJpbmcocyk7XG4gIH0pO1xufTtcblxuLy8gVGhpcyBpcyByZWFsbHkgdG8gc29sdmUgREVSIGNhc2VzLCBidXQgd2hhdGV2ZXIgZm9yIG5vd1xuV3JpdGVyLnByb3RvdHlwZS53cml0ZU9JRCA9IGZ1bmN0aW9uIChzLCB0YWcpIHtcbiAgaWYgKHR5cGVvZiAocykgIT09ICdzdHJpbmcnKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgaWYgKHR5cGVvZiAodGFnKSAhPT0gJ251bWJlcicpXG4gICAgdGFnID0gQVNOMS5PSUQ7XG5cbiAgaWYgKCEvXihbMC05XStcXC4pezMsfVswLTldKyQvLnRlc3QocykpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdhcmd1bWVudCBpcyBub3QgYSB2YWxpZCBPSUQgc3RyaW5nJyk7XG5cbiAgZnVuY3Rpb24gZW5jb2RlT2N0ZXQoYnl0ZXMsIG9jdGV0KSB7XG4gICAgaWYgKG9jdGV0IDwgMTI4KSB7XG4gICAgICAgIGJ5dGVzLnB1c2gob2N0ZXQpO1xuICAgIH0gZWxzZSBpZiAob2N0ZXQgPCAxNjM4NCkge1xuICAgICAgICBieXRlcy5wdXNoKChvY3RldCA+Pj4gNykgfCAweDgwKTtcbiAgICAgICAgYnl0ZXMucHVzaChvY3RldCAmIDB4N0YpO1xuICAgIH0gZWxzZSBpZiAob2N0ZXQgPCAyMDk3MTUyKSB7XG4gICAgICBieXRlcy5wdXNoKChvY3RldCA+Pj4gMTQpIHwgMHg4MCk7XG4gICAgICBieXRlcy5wdXNoKCgob2N0ZXQgPj4+IDcpIHwgMHg4MCkgJiAweEZGKTtcbiAgICAgIGJ5dGVzLnB1c2gob2N0ZXQgJiAweDdGKTtcbiAgICB9IGVsc2UgaWYgKG9jdGV0IDwgMjY4NDM1NDU2KSB7XG4gICAgICBieXRlcy5wdXNoKChvY3RldCA+Pj4gMjEpIHwgMHg4MCk7XG4gICAgICBieXRlcy5wdXNoKCgob2N0ZXQgPj4+IDE0KSB8IDB4ODApICYgMHhGRik7XG4gICAgICBieXRlcy5wdXNoKCgob2N0ZXQgPj4+IDcpIHwgMHg4MCkgJiAweEZGKTtcbiAgICAgIGJ5dGVzLnB1c2gob2N0ZXQgJiAweDdGKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnl0ZXMucHVzaCgoKG9jdGV0ID4+PiAyOCkgfCAweDgwKSAmIDB4RkYpO1xuICAgICAgYnl0ZXMucHVzaCgoKG9jdGV0ID4+PiAyMSkgfCAweDgwKSAmIDB4RkYpO1xuICAgICAgYnl0ZXMucHVzaCgoKG9jdGV0ID4+PiAxNCkgfCAweDgwKSAmIDB4RkYpO1xuICAgICAgYnl0ZXMucHVzaCgoKG9jdGV0ID4+PiA3KSB8IDB4ODApICYgMHhGRik7XG4gICAgICBieXRlcy5wdXNoKG9jdGV0ICYgMHg3Rik7XG4gICAgfVxuICB9XG5cbiAgdmFyIHRtcCA9IHMuc3BsaXQoJy4nKTtcbiAgdmFyIGJ5dGVzID0gW107XG4gIGJ5dGVzLnB1c2gocGFyc2VJbnQodG1wWzBdLCAxMCkgKiA0MCArIHBhcnNlSW50KHRtcFsxXSwgMTApKTtcbiAgdG1wLnNsaWNlKDIpLmZvckVhY2goZnVuY3Rpb24gKGIpIHtcbiAgICBlbmNvZGVPY3RldChieXRlcywgcGFyc2VJbnQoYiwgMTApKTtcbiAgfSk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9lbnN1cmUoMiArIGJ5dGVzLmxlbmd0aCk7XG4gIHRoaXMud3JpdGVCeXRlKHRhZyk7XG4gIHRoaXMud3JpdGVMZW5ndGgoYnl0ZXMubGVuZ3RoKTtcbiAgYnl0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYikge1xuICAgIHNlbGYud3JpdGVCeXRlKGIpO1xuICB9KTtcbn07XG5cblxuV3JpdGVyLnByb3RvdHlwZS53cml0ZUxlbmd0aCA9IGZ1bmN0aW9uIChsZW4pIHtcbiAgaWYgKHR5cGVvZiAobGVuKSAhPT0gJ251bWJlcicpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgbXVzdCBiZSBhIE51bWJlcicpO1xuXG4gIHRoaXMuX2Vuc3VyZSg0KTtcblxuICBpZiAobGVuIDw9IDB4N2YpIHtcbiAgICB0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdID0gbGVuO1xuICB9IGVsc2UgaWYgKGxlbiA8PSAweGZmKSB7XG4gICAgdGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXSA9IDB4ODE7XG4gICAgdGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXSA9IGxlbjtcbiAgfSBlbHNlIGlmIChsZW4gPD0gMHhmZmZmKSB7XG4gICAgdGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXSA9IDB4ODI7XG4gICAgdGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXSA9IGxlbiA+PiA4O1xuICAgIHRoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK10gPSBsZW47XG4gIH0gZWxzZSBpZiAobGVuIDw9IDB4ZmZmZmZmKSB7XG4gICAgdGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXSA9IDB4ODM7XG4gICAgdGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXSA9IGxlbiA+PiAxNjtcbiAgICB0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdID0gbGVuID4+IDg7XG4gICAgdGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXSA9IGxlbjtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXdJbnZhbGlkQXNuMUVycm9yKCdMZW5ndGggdG9vIGxvbmcgKD4gNCBieXRlcyknKTtcbiAgfVxufTtcblxuV3JpdGVyLnByb3RvdHlwZS5zdGFydFNlcXVlbmNlID0gZnVuY3Rpb24gKHRhZykge1xuICBpZiAodHlwZW9mICh0YWcpICE9PSAnbnVtYmVyJylcbiAgICB0YWcgPSBBU04xLlNlcXVlbmNlIHwgQVNOMS5Db25zdHJ1Y3RvcjtcblxuICB0aGlzLndyaXRlQnl0ZSh0YWcpO1xuICB0aGlzLl9zZXEucHVzaCh0aGlzLl9vZmZzZXQpO1xuICB0aGlzLl9lbnN1cmUoMyk7XG4gIHRoaXMuX29mZnNldCArPSAzO1xufTtcblxuXG5Xcml0ZXIucHJvdG90eXBlLmVuZFNlcXVlbmNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VxID0gdGhpcy5fc2VxLnBvcCgpO1xuICB2YXIgc3RhcnQgPSBzZXEgKyAzO1xuICB2YXIgbGVuID0gdGhpcy5fb2Zmc2V0IC0gc3RhcnQ7XG5cbiAgaWYgKGxlbiA8PSAweDdmKSB7XG4gICAgdGhpcy5fc2hpZnQoc3RhcnQsIGxlbiwgLTIpO1xuICAgIHRoaXMuX2J1ZltzZXFdID0gbGVuO1xuICB9IGVsc2UgaWYgKGxlbiA8PSAweGZmKSB7XG4gICAgdGhpcy5fc2hpZnQoc3RhcnQsIGxlbiwgLTEpO1xuICAgIHRoaXMuX2J1ZltzZXFdID0gMHg4MTtcbiAgICB0aGlzLl9idWZbc2VxICsgMV0gPSBsZW47XG4gIH0gZWxzZSBpZiAobGVuIDw9IDB4ZmZmZikge1xuICAgIHRoaXMuX2J1ZltzZXFdID0gMHg4MjtcbiAgICB0aGlzLl9idWZbc2VxICsgMV0gPSBsZW4gPj4gODtcbiAgICB0aGlzLl9idWZbc2VxICsgMl0gPSBsZW47XG4gIH0gZWxzZSBpZiAobGVuIDw9IDB4ZmZmZmZmKSB7XG4gICAgdGhpcy5fc2hpZnQoc3RhcnQsIGxlbiwgMSk7XG4gICAgdGhpcy5fYnVmW3NlcV0gPSAweDgzO1xuICAgIHRoaXMuX2J1ZltzZXEgKyAxXSA9IGxlbiA+PiAxNjtcbiAgICB0aGlzLl9idWZbc2VxICsgMl0gPSBsZW4gPj4gODtcbiAgICB0aGlzLl9idWZbc2VxICsgM10gPSBsZW47XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcignU2VxdWVuY2UgdG9vIGxvbmcnKTtcbiAgfVxufTtcblxuXG5Xcml0ZXIucHJvdG90eXBlLl9zaGlmdCA9IGZ1bmN0aW9uIChzdGFydCwgbGVuLCBzaGlmdCkge1xuICBhc3NlcnQub2soc3RhcnQgIT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydC5vayhsZW4gIT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydC5vayhzaGlmdCk7XG5cbiAgdGhpcy5fYnVmLmNvcHkodGhpcy5fYnVmLCBzdGFydCArIHNoaWZ0LCBzdGFydCwgc3RhcnQgKyBsZW4pO1xuICB0aGlzLl9vZmZzZXQgKz0gc2hpZnQ7XG59O1xuXG5Xcml0ZXIucHJvdG90eXBlLl9lbnN1cmUgPSBmdW5jdGlvbiAobGVuKSB7XG4gIGFzc2VydC5vayhsZW4pO1xuXG4gIGlmICh0aGlzLl9zaXplIC0gdGhpcy5fb2Zmc2V0IDwgbGVuKSB7XG4gICAgdmFyIHN6ID0gdGhpcy5fc2l6ZSAqIHRoaXMuX29wdGlvbnMuZ3Jvd3RoRmFjdG9yO1xuICAgIGlmIChzeiAtIHRoaXMuX29mZnNldCA8IGxlbilcbiAgICAgIHN6ICs9IGxlbjtcblxuICAgIHZhciBidWYgPSBCdWZmZXIuYWxsb2Moc3opO1xuXG4gICAgdGhpcy5fYnVmLmNvcHkoYnVmLCAwLCAwLCB0aGlzLl9vZmZzZXQpO1xuICAgIHRoaXMuX2J1ZiA9IGJ1ZjtcbiAgICB0aGlzLl9zaXplID0gc3o7XG4gIH1cbn07XG5cblxuXG4vLyAtLS0gRXhwb3J0ZWQgQVBJXG5cbm1vZHVsZS5leHBvcnRzID0gV3JpdGVyO1xuIiwiLy8gQ29weXJpZ2h0IDIwMTEgTWFyayBDYXZhZ2UgPG1jYXZhZ2VAZ21haWwuY29tPiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZXItYnVmZmVyJykuQnVmZmVyO1xuXG52YXIgQVNOMSA9IHJlcXVpcmUoJy4vdHlwZXMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xuXG5cbi8vIC0tLSBHbG9iYWxzXG5cbnZhciBuZXdJbnZhbGlkQXNuMUVycm9yID0gZXJyb3JzLm5ld0ludmFsaWRBc24xRXJyb3I7XG5cblxuXG4vLyAtLS0gQVBJXG5cbmZ1bmN0aW9uIFJlYWRlcihkYXRhKSB7XG4gIGlmICghZGF0YSB8fCAhQnVmZmVyLmlzQnVmZmVyKGRhdGEpKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2RhdGEgbXVzdCBiZSBhIG5vZGUgQnVmZmVyJyk7XG5cbiAgdGhpcy5fYnVmID0gZGF0YTtcbiAgdGhpcy5fc2l6ZSA9IGRhdGEubGVuZ3RoO1xuXG4gIC8vIFRoZXNlIGhvbGQgdGhlIFwiY3VycmVudFwiIHN0YXRlXG4gIHRoaXMuX2xlbiA9IDA7XG4gIHRoaXMuX29mZnNldCA9IDA7XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkZXIucHJvdG90eXBlLCAnbGVuZ3RoJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuICh0aGlzLl9sZW4pOyB9XG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRlci5wcm90b3R5cGUsICdvZmZzZXQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gKHRoaXMuX29mZnNldCk7IH1cbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGVyLnByb3RvdHlwZSwgJ3JlbWFpbicsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiAodGhpcy5fc2l6ZSAtIHRoaXMuX29mZnNldCk7IH1cbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGVyLnByb3RvdHlwZSwgJ2J1ZmZlcicsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiAodGhpcy5fYnVmLnNsaWNlKHRoaXMuX29mZnNldCkpOyB9XG59KTtcblxuXG4vKipcbiAqIFJlYWRzIGEgc2luZ2xlIGJ5dGUgYW5kIGFkdmFuY2VzIG9mZnNldDsgeW91IGNhbiBwYXNzIGluIGB0cnVlYCB0byBtYWtlIHRoaXNcbiAqIGEgXCJwZWVrXCIgb3BlcmF0aW9uIChpLmUuLCBnZXQgdGhlIGJ5dGUsIGJ1dCBkb24ndCBhZHZhbmNlIHRoZSBvZmZzZXQpLlxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcGVlayB0cnVlIG1lYW5zIGRvbid0IG1vdmUgb2Zmc2V0LlxuICogQHJldHVybiB7TnVtYmVyfSB0aGUgbmV4dCBieXRlLCBudWxsIGlmIG5vdCBlbm91Z2ggZGF0YS5cbiAqL1xuUmVhZGVyLnByb3RvdHlwZS5yZWFkQnl0ZSA9IGZ1bmN0aW9uIChwZWVrKSB7XG4gIGlmICh0aGlzLl9zaXplIC0gdGhpcy5fb2Zmc2V0IDwgMSlcbiAgICByZXR1cm4gbnVsbDtcblxuICB2YXIgYiA9IHRoaXMuX2J1Zlt0aGlzLl9vZmZzZXRdICYgMHhmZjtcblxuICBpZiAoIXBlZWspXG4gICAgdGhpcy5fb2Zmc2V0ICs9IDE7XG5cbiAgcmV0dXJuIGI7XG59O1xuXG5cblJlYWRlci5wcm90b3R5cGUucGVlayA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMucmVhZEJ5dGUodHJ1ZSk7XG59O1xuXG5cbi8qKlxuICogUmVhZHMgYSAocG90ZW50aWFsbHkpIHZhcmlhYmxlIGxlbmd0aCBvZmYgdGhlIEJFUiBidWZmZXIuICBUaGlzIGNhbGwgaXNcbiAqIG5vdCByZWFsbHkgbWVhbnQgdG8gYmUgY2FsbGVkIGRpcmVjdGx5LCBhcyBjYWxsZXJzIGhhdmUgdG8gbWFuaXB1bGF0ZVxuICogdGhlIGludGVybmFsIGJ1ZmZlciBhZnRlcndhcmRzLlxuICpcbiAqIEFzIGEgcmVzdWx0IG9mIHRoaXMgY2FsbCwgeW91IGNhbiBjYWxsIGBSZWFkZXIubGVuZ3RoYCwgdW50aWwgdGhlXG4gKiBuZXh0IHRoaW5nIGNhbGxlZCB0aGF0IGRvZXMgYSByZWFkTGVuZ3RoLlxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gdGhlIGFtb3VudCBvZiBvZmZzZXQgdG8gYWR2YW5jZSB0aGUgYnVmZmVyLlxuICogQHRocm93cyB7SW52YWxpZEFzbjFFcnJvcn0gb24gYmFkIEFTTi4xXG4gKi9cblJlYWRlci5wcm90b3R5cGUucmVhZExlbmd0aCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKVxuICAgIG9mZnNldCA9IHRoaXMuX29mZnNldDtcblxuICBpZiAob2Zmc2V0ID49IHRoaXMuX3NpemUpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgdmFyIGxlbkIgPSB0aGlzLl9idWZbb2Zmc2V0KytdICYgMHhmZjtcbiAgaWYgKGxlbkIgPT09IG51bGwpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgaWYgKChsZW5CICYgMHg4MCkgPT09IDB4ODApIHtcbiAgICBsZW5CICY9IDB4N2Y7XG5cbiAgICBpZiAobGVuQiA9PT0gMClcbiAgICAgIHRocm93IG5ld0ludmFsaWRBc24xRXJyb3IoJ0luZGVmaW5pdGUgbGVuZ3RoIG5vdCBzdXBwb3J0ZWQnKTtcblxuICAgIGlmIChsZW5CID4gNClcbiAgICAgIHRocm93IG5ld0ludmFsaWRBc24xRXJyb3IoJ2VuY29kaW5nIHRvbyBsb25nJyk7XG5cbiAgICBpZiAodGhpcy5fc2l6ZSAtIG9mZnNldCA8IGxlbkIpXG4gICAgICByZXR1cm4gbnVsbDtcblxuICAgIHRoaXMuX2xlbiA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5COyBpKyspXG4gICAgICB0aGlzLl9sZW4gPSAodGhpcy5fbGVuIDw8IDgpICsgKHRoaXMuX2J1ZltvZmZzZXQrK10gJiAweGZmKTtcblxuICB9IGVsc2Uge1xuICAgIC8vIFdhc24ndCBhIHZhcmlhYmxlIGxlbmd0aFxuICAgIHRoaXMuX2xlbiA9IGxlbkI7XG4gIH1cblxuICByZXR1cm4gb2Zmc2V0O1xufTtcblxuXG4vKipcbiAqIFBhcnNlcyB0aGUgbmV4dCBzZXF1ZW5jZSBpbiB0aGlzIEJFUiBidWZmZXIuXG4gKlxuICogVG8gZ2V0IHRoZSBsZW5ndGggb2YgdGhlIHNlcXVlbmNlLCBjYWxsIGBSZWFkZXIubGVuZ3RoYC5cbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IHRoZSBzZXF1ZW5jZSdzIHRhZy5cbiAqL1xuUmVhZGVyLnByb3RvdHlwZS5yZWFkU2VxdWVuY2UgPSBmdW5jdGlvbiAodGFnKSB7XG4gIHZhciBzZXEgPSB0aGlzLnBlZWsoKTtcbiAgaWYgKHNlcSA9PT0gbnVsbClcbiAgICByZXR1cm4gbnVsbDtcbiAgaWYgKHRhZyAhPT0gdW5kZWZpbmVkICYmIHRhZyAhPT0gc2VxKVxuICAgIHRocm93IG5ld0ludmFsaWRBc24xRXJyb3IoJ0V4cGVjdGVkIDB4JyArIHRhZy50b1N0cmluZygxNikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzogZ290IDB4JyArIHNlcS50b1N0cmluZygxNikpO1xuXG4gIHZhciBvID0gdGhpcy5yZWFkTGVuZ3RoKHRoaXMuX29mZnNldCArIDEpOyAvLyBzdG9yZWQgaW4gYGxlbmd0aGBcbiAgaWYgKG8gPT09IG51bGwpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgdGhpcy5fb2Zmc2V0ID0gbztcbiAgcmV0dXJuIHNlcTtcbn07XG5cblxuUmVhZGVyLnByb3RvdHlwZS5yZWFkSW50ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fcmVhZFRhZyhBU04xLkludGVnZXIpO1xufTtcblxuXG5SZWFkZXIucHJvdG90eXBlLnJlYWRCb29sZWFuID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gKHRoaXMuX3JlYWRUYWcoQVNOMS5Cb29sZWFuKSA9PT0gMCA/IGZhbHNlIDogdHJ1ZSk7XG59O1xuXG5cblJlYWRlci5wcm90b3R5cGUucmVhZEVudW1lcmF0aW9uID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fcmVhZFRhZyhBU04xLkVudW1lcmF0aW9uKTtcbn07XG5cblxuUmVhZGVyLnByb3RvdHlwZS5yZWFkU3RyaW5nID0gZnVuY3Rpb24gKHRhZywgcmV0YnVmKSB7XG4gIGlmICghdGFnKVxuICAgIHRhZyA9IEFTTjEuT2N0ZXRTdHJpbmc7XG5cbiAgdmFyIGIgPSB0aGlzLnBlZWsoKTtcbiAgaWYgKGIgPT09IG51bGwpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgaWYgKGIgIT09IHRhZylcbiAgICB0aHJvdyBuZXdJbnZhbGlkQXNuMUVycm9yKCdFeHBlY3RlZCAweCcgKyB0YWcudG9TdHJpbmcoMTYpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6IGdvdCAweCcgKyBiLnRvU3RyaW5nKDE2KSk7XG5cbiAgdmFyIG8gPSB0aGlzLnJlYWRMZW5ndGgodGhpcy5fb2Zmc2V0ICsgMSk7IC8vIHN0b3JlZCBpbiBgbGVuZ3RoYFxuXG4gIGlmIChvID09PSBudWxsKVxuICAgIHJldHVybiBudWxsO1xuXG4gIGlmICh0aGlzLmxlbmd0aCA+IHRoaXMuX3NpemUgLSBvKVxuICAgIHJldHVybiBudWxsO1xuXG4gIHRoaXMuX29mZnNldCA9IG87XG5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiByZXRidWYgPyBCdWZmZXIuYWxsb2MoMCkgOiAnJztcblxuICB2YXIgc3RyID0gdGhpcy5fYnVmLnNsaWNlKHRoaXMuX29mZnNldCwgdGhpcy5fb2Zmc2V0ICsgdGhpcy5sZW5ndGgpO1xuICB0aGlzLl9vZmZzZXQgKz0gdGhpcy5sZW5ndGg7XG5cbiAgcmV0dXJuIHJldGJ1ZiA/IHN0ciA6IHN0ci50b1N0cmluZygndXRmOCcpO1xufTtcblxuUmVhZGVyLnByb3RvdHlwZS5yZWFkT0lEID0gZnVuY3Rpb24gKHRhZykge1xuICBpZiAoIXRhZylcbiAgICB0YWcgPSBBU04xLk9JRDtcblxuICB2YXIgYiA9IHRoaXMucmVhZFN0cmluZyh0YWcsIHRydWUpO1xuICBpZiAoYiA9PT0gbnVsbClcbiAgICByZXR1cm4gbnVsbDtcblxuICB2YXIgdmFsdWVzID0gW107XG4gIHZhciB2YWx1ZSA9IDA7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBiW2ldICYgMHhmZjtcblxuICAgIHZhbHVlIDw8PSA3O1xuICAgIHZhbHVlICs9IGJ5dGUgJiAweDdmO1xuICAgIGlmICgoYnl0ZSAmIDB4ODApID09PSAwKSB7XG4gICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgICB2YWx1ZSA9IDA7XG4gICAgfVxuICB9XG5cbiAgdmFsdWUgPSB2YWx1ZXMuc2hpZnQoKTtcbiAgdmFsdWVzLnVuc2hpZnQodmFsdWUgJSA0MCk7XG4gIHZhbHVlcy51bnNoaWZ0KCh2YWx1ZSAvIDQwKSA+PiAwKTtcblxuICByZXR1cm4gdmFsdWVzLmpvaW4oJy4nKTtcbn07XG5cblxuUmVhZGVyLnByb3RvdHlwZS5fcmVhZFRhZyA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgYXNzZXJ0Lm9rKHRhZyAhPT0gdW5kZWZpbmVkKTtcblxuICB2YXIgYiA9IHRoaXMucGVlaygpO1xuXG4gIGlmIChiID09PSBudWxsKVxuICAgIHJldHVybiBudWxsO1xuXG4gIGlmIChiICE9PSB0YWcpXG4gICAgdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcignRXhwZWN0ZWQgMHgnICsgdGFnLnRvU3RyaW5nKDE2KSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnOiBnb3QgMHgnICsgYi50b1N0cmluZygxNikpO1xuXG4gIHZhciBvID0gdGhpcy5yZWFkTGVuZ3RoKHRoaXMuX29mZnNldCArIDEpOyAvLyBzdG9yZWQgaW4gYGxlbmd0aGBcbiAgaWYgKG8gPT09IG51bGwpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgaWYgKHRoaXMubGVuZ3RoID4gNClcbiAgICB0aHJvdyBuZXdJbnZhbGlkQXNuMUVycm9yKCdJbnRlZ2VyIHRvbyBsb25nOiAnICsgdGhpcy5sZW5ndGgpO1xuXG4gIGlmICh0aGlzLmxlbmd0aCA+IHRoaXMuX3NpemUgLSBvKVxuICAgIHJldHVybiBudWxsO1xuICB0aGlzLl9vZmZzZXQgPSBvO1xuXG4gIHZhciBmYiA9IHRoaXMuX2J1Zlt0aGlzLl9vZmZzZXRdO1xuICB2YXIgdmFsdWUgPSAwO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgIHZhbHVlIDw8PSA4O1xuICAgIHZhbHVlIHw9ICh0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdICYgMHhmZik7XG4gIH1cblxuICBpZiAoKGZiICYgMHg4MCkgPT09IDB4ODAgJiYgaSAhPT0gNClcbiAgICB2YWx1ZSAtPSAoMSA8PCAoaSAqIDgpKTtcblxuICByZXR1cm4gdmFsdWUgPj4gMDtcbn07XG5cblxuXG4vLyAtLS0gRXhwb3J0ZWQgQVBJXG5cbm1vZHVsZS5leHBvcnRzID0gUmVhZGVyO1xuIiwiLy8gQ29weXJpZ2h0IDIwMTEgTWFyayBDYXZhZ2UgPG1jYXZhZ2VAZ21haWwuY29tPiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciB0eXBlcyA9IHJlcXVpcmUoJy4vdHlwZXMnKTtcblxudmFyIFJlYWRlciA9IHJlcXVpcmUoJy4vcmVhZGVyJyk7XG52YXIgV3JpdGVyID0gcmVxdWlyZSgnLi93cml0ZXInKTtcblxuXG4vLyAtLS0gRXhwb3J0c1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBSZWFkZXI6IFJlYWRlcixcblxuICBXcml0ZXI6IFdyaXRlclxuXG59O1xuXG5mb3IgKHZhciB0IGluIHR5cGVzKSB7XG4gIGlmICh0eXBlcy5oYXNPd25Qcm9wZXJ0eSh0KSlcbiAgICBtb2R1bGUuZXhwb3J0c1t0XSA9IHR5cGVzW3RdO1xufVxuZm9yICh2YXIgZSBpbiBlcnJvcnMpIHtcbiAgaWYgKGVycm9ycy5oYXNPd25Qcm9wZXJ0eShlKSlcbiAgICBtb2R1bGUuZXhwb3J0c1tlXSA9IGVycm9yc1tlXTtcbn1cbiIsIi8vIENvcHlyaWdodCAyMDExIE1hcmsgQ2F2YWdlIDxtY2F2YWdlQGdtYWlsLmNvbT4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxuLy8gSWYgeW91IGhhdmUgbm8gaWRlYSB3aGF0IEFTTi4xIG9yIEJFUiBpcywgc2VlIHRoaXM6XG4vLyBmdHA6Ly9mdHAucnNhLmNvbS9wdWIvcGtjcy9hc2NpaS9sYXltYW4uYXNjXG5cbnZhciBCZXIgPSByZXF1aXJlKCcuL2Jlci9pbmRleCcpO1xuXG5cblxuLy8gLS0tIEV4cG9ydGVkIEFQSVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBCZXI6IEJlcixcblxuICBCZXJSZWFkZXI6IEJlci5SZWFkZXIsXG5cbiAgQmVyV3JpdGVyOiBCZXIuV3JpdGVyXG5cbn07XG4iLCIvLyBDb3B5cmlnaHQgMjAxMSBNYXJrIENhdmFnZSA8bWNhdmFnZUBnbWFpbC5jb20+IEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEVPQzogMCxcbiAgQm9vbGVhbjogMSxcbiAgSW50ZWdlcjogMixcbiAgQml0U3RyaW5nOiAzLFxuICBPY3RldFN0cmluZzogNCxcbiAgTnVsbDogNSxcbiAgT0lEOiA2LFxuICBPYmplY3REZXNjcmlwdG9yOiA3LFxuICBFeHRlcm5hbDogOCxcbiAgUmVhbDogOSwgLy8gZmxvYXRcbiAgRW51bWVyYXRpb246IDEwLFxuICBQRFY6IDExLFxuICBVdGY4U3RyaW5nOiAxMixcbiAgUmVsYXRpdmVPSUQ6IDEzLFxuICBTZXF1ZW5jZTogMTYsXG4gIFNldDogMTcsXG4gIE51bWVyaWNTdHJpbmc6IDE4LFxuICBQcmludGFibGVTdHJpbmc6IDE5LFxuICBUNjFTdHJpbmc6IDIwLFxuICBWaWRlb3RleFN0cmluZzogMjEsXG4gIElBNVN0cmluZzogMjIsXG4gIFVUQ1RpbWU6IDIzLFxuICBHZW5lcmFsaXplZFRpbWU6IDI0LFxuICBHcmFwaGljU3RyaW5nOiAyNSxcbiAgVmlzaWJsZVN0cmluZzogMjYsXG4gIEdlbmVyYWxTdHJpbmc6IDI4LFxuICBVbml2ZXJzYWxTdHJpbmc6IDI5LFxuICBDaGFyYWN0ZXJTdHJpbmc6IDMwLFxuICBCTVBTdHJpbmc6IDMxLFxuICBDb25zdHJ1Y3RvcjogMzIsXG4gIENvbnRleHQ6IDEyOFxufTtcbiIsIi8vIENvcHlyaWdodCAyMDExIE1hcmsgQ2F2YWdlIDxtY2F2YWdlQGdtYWlsLmNvbT4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuZXdJbnZhbGlkQXNuMUVycm9yOiBmdW5jdGlvbiAobXNnKSB7XG4gICAgdmFyIGUgPSBuZXcgRXJyb3IoKTtcbiAgICBlLm5hbWUgPSAnSW52YWxpZEFzbjFFcnJvcic7XG4gICAgZS5tZXNzYWdlID0gbXNnIHx8ICcnO1xuICAgIHJldHVybiBlO1xuICB9XG5cbn07XG4iXSwic291cmNlUm9vdCI6IiJ9