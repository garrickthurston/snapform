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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS9saWIvYmVyL3dyaXRlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS9saWIvYmVyL3JlYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS9saWIvYmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc24xL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS9saWIvYmVyL3R5cGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc24xL2xpYi9iZXIvZXJyb3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixhQUFhLG1CQUFPLENBQUMsMEJBQWM7QUFDbkMsV0FBVyxtQkFBTyxDQUFDLHFCQUFTO0FBQzVCLGFBQWEsbUJBQU8sQ0FBQyxzQkFBVTs7O0FBRy9COztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7Ozs7QUFJQTs7QUFFQTtBQUNBLDZDQUE2Qzs7QUFFN0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLEdBQUc7QUFDdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7O0FBR0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNuQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmFzbjEuYjYwZTlhNWM2YmIwZTM0MjQ1M2YuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMSBNYXJrIENhdmFnZSA8bWNhdmFnZUBnbWFpbC5jb20+IEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XHJcbnZhciBBU04xID0gcmVxdWlyZSgnLi90eXBlcycpO1xyXG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcclxuXHJcblxyXG4vLyAtLS0gR2xvYmFsc1xyXG5cclxudmFyIG5ld0ludmFsaWRBc24xRXJyb3IgPSBlcnJvcnMubmV3SW52YWxpZEFzbjFFcnJvcjtcclxuXHJcbnZhciBERUZBVUxUX09QVFMgPSB7XHJcbiAgc2l6ZTogMTAyNCxcclxuICBncm93dGhGYWN0b3I6IDhcclxufTtcclxuXHJcblxyXG4vLyAtLS0gSGVscGVyc1xyXG5cclxuZnVuY3Rpb24gbWVyZ2UoZnJvbSwgdG8pIHtcclxuICBhc3NlcnQub2soZnJvbSk7XHJcbiAgYXNzZXJ0LmVxdWFsKHR5cGVvZiAoZnJvbSksICdvYmplY3QnKTtcclxuICBhc3NlcnQub2sodG8pO1xyXG4gIGFzc2VydC5lcXVhbCh0eXBlb2YgKHRvKSwgJ29iamVjdCcpO1xyXG5cclxuICB2YXIga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGZyb20pO1xyXG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICBpZiAodG9ba2V5XSlcclxuICAgICAgcmV0dXJuO1xyXG5cclxuICAgIHZhciB2YWx1ZSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZnJvbSwga2V5KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0bywga2V5LCB2YWx1ZSk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiB0bztcclxufVxyXG5cclxuXHJcblxyXG4vLyAtLS0gQVBJXHJcblxyXG5mdW5jdGlvbiBXcml0ZXIob3B0aW9ucykge1xyXG4gIG9wdGlvbnMgPSBtZXJnZShERUZBVUxUX09QVFMsIG9wdGlvbnMgfHwge30pO1xyXG5cclxuICB0aGlzLl9idWYgPSBCdWZmZXIuYWxsb2Mob3B0aW9ucy5zaXplIHx8IDEwMjQpO1xyXG4gIHRoaXMuX3NpemUgPSB0aGlzLl9idWYubGVuZ3RoO1xyXG4gIHRoaXMuX29mZnNldCA9IDA7XHJcbiAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG4gIC8vIEEgbGlzdCBvZiBvZmZzZXRzIGluIHRoZSBidWZmZXIgd2hlcmUgd2UgbmVlZCB0byBpbnNlcnRcclxuICAvLyBzZXF1ZW5jZSB0YWcvbGVuIHBhaXJzLlxyXG4gIHRoaXMuX3NlcSA9IFtdO1xyXG59XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoV3JpdGVyLnByb3RvdHlwZSwgJ2J1ZmZlcicsIHtcclxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLl9zZXEubGVuZ3RoKVxyXG4gICAgICB0aHJvdyBuZXdJbnZhbGlkQXNuMUVycm9yKHRoaXMuX3NlcS5sZW5ndGggKyAnIHVuZW5kZWQgc2VxdWVuY2UocyknKTtcclxuXHJcbiAgICByZXR1cm4gKHRoaXMuX2J1Zi5zbGljZSgwLCB0aGlzLl9vZmZzZXQpKTtcclxuICB9XHJcbn0pO1xyXG5cclxuV3JpdGVyLnByb3RvdHlwZS53cml0ZUJ5dGUgPSBmdW5jdGlvbiAoYikge1xyXG4gIGlmICh0eXBlb2YgKGIpICE9PSAnbnVtYmVyJylcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IG11c3QgYmUgYSBOdW1iZXInKTtcclxuXHJcbiAgdGhpcy5fZW5zdXJlKDEpO1xyXG4gIHRoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK10gPSBiO1xyXG59O1xyXG5cclxuXHJcbldyaXRlci5wcm90b3R5cGUud3JpdGVJbnQgPSBmdW5jdGlvbiAoaSwgdGFnKSB7XHJcbiAgaWYgKHR5cGVvZiAoaSkgIT09ICdudW1iZXInKVxyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgbXVzdCBiZSBhIE51bWJlcicpO1xyXG4gIGlmICh0eXBlb2YgKHRhZykgIT09ICdudW1iZXInKVxyXG4gICAgdGFnID0gQVNOMS5JbnRlZ2VyO1xyXG5cclxuICB2YXIgc3ogPSA0O1xyXG5cclxuICB3aGlsZSAoKCgoaSAmIDB4ZmY4MDAwMDApID09PSAwKSB8fCAoKGkgJiAweGZmODAwMDAwKSA9PT0gMHhmZjgwMDAwMCA+PiAwKSkgJiZcclxuICAgICAgICAoc3ogPiAxKSkge1xyXG4gICAgc3otLTtcclxuICAgIGkgPDw9IDg7XHJcbiAgfVxyXG5cclxuICBpZiAoc3ogPiA0KVxyXG4gICAgdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcignQkVSIGludHMgY2Fubm90IGJlID4gMHhmZmZmZmZmZicpO1xyXG5cclxuICB0aGlzLl9lbnN1cmUoMiArIHN6KTtcclxuICB0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdID0gdGFnO1xyXG4gIHRoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK10gPSBzejtcclxuXHJcbiAgd2hpbGUgKHN6LS0gPiAwKSB7XHJcbiAgICB0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdID0gKChpICYgMHhmZjAwMDAwMCkgPj4+IDI0KTtcclxuICAgIGkgPDw9IDg7XHJcbiAgfVxyXG5cclxufTtcclxuXHJcblxyXG5Xcml0ZXIucHJvdG90eXBlLndyaXRlTnVsbCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLndyaXRlQnl0ZShBU04xLk51bGwpO1xyXG4gIHRoaXMud3JpdGVCeXRlKDB4MDApO1xyXG59O1xyXG5cclxuXHJcbldyaXRlci5wcm90b3R5cGUud3JpdGVFbnVtZXJhdGlvbiA9IGZ1bmN0aW9uIChpLCB0YWcpIHtcclxuICBpZiAodHlwZW9mIChpKSAhPT0gJ251bWJlcicpXHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBtdXN0IGJlIGEgTnVtYmVyJyk7XHJcbiAgaWYgKHR5cGVvZiAodGFnKSAhPT0gJ251bWJlcicpXHJcbiAgICB0YWcgPSBBU04xLkVudW1lcmF0aW9uO1xyXG5cclxuICByZXR1cm4gdGhpcy53cml0ZUludChpLCB0YWcpO1xyXG59O1xyXG5cclxuXHJcbldyaXRlci5wcm90b3R5cGUud3JpdGVCb29sZWFuID0gZnVuY3Rpb24gKGIsIHRhZykge1xyXG4gIGlmICh0eXBlb2YgKGIpICE9PSAnYm9vbGVhbicpXHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBtdXN0IGJlIGEgQm9vbGVhbicpO1xyXG4gIGlmICh0eXBlb2YgKHRhZykgIT09ICdudW1iZXInKVxyXG4gICAgdGFnID0gQVNOMS5Cb29sZWFuO1xyXG5cclxuICB0aGlzLl9lbnN1cmUoMyk7XHJcbiAgdGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXSA9IHRhZztcclxuICB0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdID0gMHgwMTtcclxuICB0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdID0gYiA/IDB4ZmYgOiAweDAwO1xyXG59O1xyXG5cclxuXHJcbldyaXRlci5wcm90b3R5cGUud3JpdGVTdHJpbmcgPSBmdW5jdGlvbiAocywgdGFnKSB7XHJcbiAgaWYgKHR5cGVvZiAocykgIT09ICdzdHJpbmcnKVxyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZyAod2FzOiAnICsgdHlwZW9mIChzKSArICcpJyk7XHJcbiAgaWYgKHR5cGVvZiAodGFnKSAhPT0gJ251bWJlcicpXHJcbiAgICB0YWcgPSBBU04xLk9jdGV0U3RyaW5nO1xyXG5cclxuICB2YXIgbGVuID0gQnVmZmVyLmJ5dGVMZW5ndGgocyk7XHJcbiAgdGhpcy53cml0ZUJ5dGUodGFnKTtcclxuICB0aGlzLndyaXRlTGVuZ3RoKGxlbik7XHJcbiAgaWYgKGxlbikge1xyXG4gICAgdGhpcy5fZW5zdXJlKGxlbik7XHJcbiAgICB0aGlzLl9idWYud3JpdGUocywgdGhpcy5fb2Zmc2V0KTtcclxuICAgIHRoaXMuX29mZnNldCArPSBsZW47XHJcbiAgfVxyXG59O1xyXG5cclxuXHJcbldyaXRlci5wcm90b3R5cGUud3JpdGVCdWZmZXIgPSBmdW5jdGlvbiAoYnVmLCB0YWcpIHtcclxuICBpZiAodHlwZW9mICh0YWcpICE9PSAnbnVtYmVyJylcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RhZyBtdXN0IGJlIGEgbnVtYmVyJyk7XHJcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSlcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IG11c3QgYmUgYSBidWZmZXInKTtcclxuXHJcbiAgdGhpcy53cml0ZUJ5dGUodGFnKTtcclxuICB0aGlzLndyaXRlTGVuZ3RoKGJ1Zi5sZW5ndGgpO1xyXG4gIHRoaXMuX2Vuc3VyZShidWYubGVuZ3RoKTtcclxuICBidWYuY29weSh0aGlzLl9idWYsIHRoaXMuX29mZnNldCwgMCwgYnVmLmxlbmd0aCk7XHJcbiAgdGhpcy5fb2Zmc2V0ICs9IGJ1Zi5sZW5ndGg7XHJcbn07XHJcblxyXG5cclxuV3JpdGVyLnByb3RvdHlwZS53cml0ZVN0cmluZ0FycmF5ID0gZnVuY3Rpb24gKHN0cmluZ3MpIHtcclxuICBpZiAoKCFzdHJpbmdzIGluc3RhbmNlb2YgQXJyYXkpKVxyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheVtTdHJpbmddJyk7XHJcblxyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICBzdHJpbmdzLmZvckVhY2goZnVuY3Rpb24gKHMpIHtcclxuICAgIHNlbGYud3JpdGVTdHJpbmcocyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vLyBUaGlzIGlzIHJlYWxseSB0byBzb2x2ZSBERVIgY2FzZXMsIGJ1dCB3aGF0ZXZlciBmb3Igbm93XHJcbldyaXRlci5wcm90b3R5cGUud3JpdGVPSUQgPSBmdW5jdGlvbiAocywgdGFnKSB7XHJcbiAgaWYgKHR5cGVvZiAocykgIT09ICdzdHJpbmcnKVxyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZycpO1xyXG4gIGlmICh0eXBlb2YgKHRhZykgIT09ICdudW1iZXInKVxyXG4gICAgdGFnID0gQVNOMS5PSUQ7XHJcblxyXG4gIGlmICghL14oWzAtOV0rXFwuKXszLH1bMC05XSskLy50ZXN0KHMpKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdhcmd1bWVudCBpcyBub3QgYSB2YWxpZCBPSUQgc3RyaW5nJyk7XHJcblxyXG4gIGZ1bmN0aW9uIGVuY29kZU9jdGV0KGJ5dGVzLCBvY3RldCkge1xyXG4gICAgaWYgKG9jdGV0IDwgMTI4KSB7XHJcbiAgICAgICAgYnl0ZXMucHVzaChvY3RldCk7XHJcbiAgICB9IGVsc2UgaWYgKG9jdGV0IDwgMTYzODQpIHtcclxuICAgICAgICBieXRlcy5wdXNoKChvY3RldCA+Pj4gNykgfCAweDgwKTtcclxuICAgICAgICBieXRlcy5wdXNoKG9jdGV0ICYgMHg3Rik7XHJcbiAgICB9IGVsc2UgaWYgKG9jdGV0IDwgMjA5NzE1Mikge1xyXG4gICAgICBieXRlcy5wdXNoKChvY3RldCA+Pj4gMTQpIHwgMHg4MCk7XHJcbiAgICAgIGJ5dGVzLnB1c2goKChvY3RldCA+Pj4gNykgfCAweDgwKSAmIDB4RkYpO1xyXG4gICAgICBieXRlcy5wdXNoKG9jdGV0ICYgMHg3Rik7XHJcbiAgICB9IGVsc2UgaWYgKG9jdGV0IDwgMjY4NDM1NDU2KSB7XHJcbiAgICAgIGJ5dGVzLnB1c2goKG9jdGV0ID4+PiAyMSkgfCAweDgwKTtcclxuICAgICAgYnl0ZXMucHVzaCgoKG9jdGV0ID4+PiAxNCkgfCAweDgwKSAmIDB4RkYpO1xyXG4gICAgICBieXRlcy5wdXNoKCgob2N0ZXQgPj4+IDcpIHwgMHg4MCkgJiAweEZGKTtcclxuICAgICAgYnl0ZXMucHVzaChvY3RldCAmIDB4N0YpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYnl0ZXMucHVzaCgoKG9jdGV0ID4+PiAyOCkgfCAweDgwKSAmIDB4RkYpO1xyXG4gICAgICBieXRlcy5wdXNoKCgob2N0ZXQgPj4+IDIxKSB8IDB4ODApICYgMHhGRik7XHJcbiAgICAgIGJ5dGVzLnB1c2goKChvY3RldCA+Pj4gMTQpIHwgMHg4MCkgJiAweEZGKTtcclxuICAgICAgYnl0ZXMucHVzaCgoKG9jdGV0ID4+PiA3KSB8IDB4ODApICYgMHhGRik7XHJcbiAgICAgIGJ5dGVzLnB1c2gob2N0ZXQgJiAweDdGKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciB0bXAgPSBzLnNwbGl0KCcuJyk7XHJcbiAgdmFyIGJ5dGVzID0gW107XHJcbiAgYnl0ZXMucHVzaChwYXJzZUludCh0bXBbMF0sIDEwKSAqIDQwICsgcGFyc2VJbnQodG1wWzFdLCAxMCkpO1xyXG4gIHRtcC5zbGljZSgyKS5mb3JFYWNoKGZ1bmN0aW9uIChiKSB7XHJcbiAgICBlbmNvZGVPY3RldChieXRlcywgcGFyc2VJbnQoYiwgMTApKTtcclxuICB9KTtcclxuXHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIHRoaXMuX2Vuc3VyZSgyICsgYnl0ZXMubGVuZ3RoKTtcclxuICB0aGlzLndyaXRlQnl0ZSh0YWcpO1xyXG4gIHRoaXMud3JpdGVMZW5ndGgoYnl0ZXMubGVuZ3RoKTtcclxuICBieXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChiKSB7XHJcbiAgICBzZWxmLndyaXRlQnl0ZShiKTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5Xcml0ZXIucHJvdG90eXBlLndyaXRlTGVuZ3RoID0gZnVuY3Rpb24gKGxlbikge1xyXG4gIGlmICh0eXBlb2YgKGxlbikgIT09ICdudW1iZXInKVxyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgbXVzdCBiZSBhIE51bWJlcicpO1xyXG5cclxuICB0aGlzLl9lbnN1cmUoNCk7XHJcblxyXG4gIGlmIChsZW4gPD0gMHg3Zikge1xyXG4gICAgdGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXSA9IGxlbjtcclxuICB9IGVsc2UgaWYgKGxlbiA8PSAweGZmKSB7XHJcbiAgICB0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdID0gMHg4MTtcclxuICAgIHRoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK10gPSBsZW47XHJcbiAgfSBlbHNlIGlmIChsZW4gPD0gMHhmZmZmKSB7XHJcbiAgICB0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdID0gMHg4MjtcclxuICAgIHRoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK10gPSBsZW4gPj4gODtcclxuICAgIHRoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK10gPSBsZW47XHJcbiAgfSBlbHNlIGlmIChsZW4gPD0gMHhmZmZmZmYpIHtcclxuICAgIHRoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK10gPSAweDgzO1xyXG4gICAgdGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXSA9IGxlbiA+PiAxNjtcclxuICAgIHRoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK10gPSBsZW4gPj4gODtcclxuICAgIHRoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK10gPSBsZW47XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IG5ld0ludmFsaWRBc24xRXJyb3IoJ0xlbmd0aCB0b28gbG9uZyAoPiA0IGJ5dGVzKScpO1xyXG4gIH1cclxufTtcclxuXHJcbldyaXRlci5wcm90b3R5cGUuc3RhcnRTZXF1ZW5jZSA9IGZ1bmN0aW9uICh0YWcpIHtcclxuICBpZiAodHlwZW9mICh0YWcpICE9PSAnbnVtYmVyJylcclxuICAgIHRhZyA9IEFTTjEuU2VxdWVuY2UgfCBBU04xLkNvbnN0cnVjdG9yO1xyXG5cclxuICB0aGlzLndyaXRlQnl0ZSh0YWcpO1xyXG4gIHRoaXMuX3NlcS5wdXNoKHRoaXMuX29mZnNldCk7XHJcbiAgdGhpcy5fZW5zdXJlKDMpO1xyXG4gIHRoaXMuX29mZnNldCArPSAzO1xyXG59O1xyXG5cclxuXHJcbldyaXRlci5wcm90b3R5cGUuZW5kU2VxdWVuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHNlcSA9IHRoaXMuX3NlcS5wb3AoKTtcclxuICB2YXIgc3RhcnQgPSBzZXEgKyAzO1xyXG4gIHZhciBsZW4gPSB0aGlzLl9vZmZzZXQgLSBzdGFydDtcclxuXHJcbiAgaWYgKGxlbiA8PSAweDdmKSB7XHJcbiAgICB0aGlzLl9zaGlmdChzdGFydCwgbGVuLCAtMik7XHJcbiAgICB0aGlzLl9idWZbc2VxXSA9IGxlbjtcclxuICB9IGVsc2UgaWYgKGxlbiA8PSAweGZmKSB7XHJcbiAgICB0aGlzLl9zaGlmdChzdGFydCwgbGVuLCAtMSk7XHJcbiAgICB0aGlzLl9idWZbc2VxXSA9IDB4ODE7XHJcbiAgICB0aGlzLl9idWZbc2VxICsgMV0gPSBsZW47XHJcbiAgfSBlbHNlIGlmIChsZW4gPD0gMHhmZmZmKSB7XHJcbiAgICB0aGlzLl9idWZbc2VxXSA9IDB4ODI7XHJcbiAgICB0aGlzLl9idWZbc2VxICsgMV0gPSBsZW4gPj4gODtcclxuICAgIHRoaXMuX2J1ZltzZXEgKyAyXSA9IGxlbjtcclxuICB9IGVsc2UgaWYgKGxlbiA8PSAweGZmZmZmZikge1xyXG4gICAgdGhpcy5fc2hpZnQoc3RhcnQsIGxlbiwgMSk7XHJcbiAgICB0aGlzLl9idWZbc2VxXSA9IDB4ODM7XHJcbiAgICB0aGlzLl9idWZbc2VxICsgMV0gPSBsZW4gPj4gMTY7XHJcbiAgICB0aGlzLl9idWZbc2VxICsgMl0gPSBsZW4gPj4gODtcclxuICAgIHRoaXMuX2J1ZltzZXEgKyAzXSA9IGxlbjtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcignU2VxdWVuY2UgdG9vIGxvbmcnKTtcclxuICB9XHJcbn07XHJcblxyXG5cclxuV3JpdGVyLnByb3RvdHlwZS5fc2hpZnQgPSBmdW5jdGlvbiAoc3RhcnQsIGxlbiwgc2hpZnQpIHtcclxuICBhc3NlcnQub2soc3RhcnQgIT09IHVuZGVmaW5lZCk7XHJcbiAgYXNzZXJ0Lm9rKGxlbiAhPT0gdW5kZWZpbmVkKTtcclxuICBhc3NlcnQub2soc2hpZnQpO1xyXG5cclxuICB0aGlzLl9idWYuY29weSh0aGlzLl9idWYsIHN0YXJ0ICsgc2hpZnQsIHN0YXJ0LCBzdGFydCArIGxlbik7XHJcbiAgdGhpcy5fb2Zmc2V0ICs9IHNoaWZ0O1xyXG59O1xyXG5cclxuV3JpdGVyLnByb3RvdHlwZS5fZW5zdXJlID0gZnVuY3Rpb24gKGxlbikge1xyXG4gIGFzc2VydC5vayhsZW4pO1xyXG5cclxuICBpZiAodGhpcy5fc2l6ZSAtIHRoaXMuX29mZnNldCA8IGxlbikge1xyXG4gICAgdmFyIHN6ID0gdGhpcy5fc2l6ZSAqIHRoaXMuX29wdGlvbnMuZ3Jvd3RoRmFjdG9yO1xyXG4gICAgaWYgKHN6IC0gdGhpcy5fb2Zmc2V0IDwgbGVuKVxyXG4gICAgICBzeiArPSBsZW47XHJcblxyXG4gICAgdmFyIGJ1ZiA9IEJ1ZmZlci5hbGxvYyhzeik7XHJcblxyXG4gICAgdGhpcy5fYnVmLmNvcHkoYnVmLCAwLCAwLCB0aGlzLl9vZmZzZXQpO1xyXG4gICAgdGhpcy5fYnVmID0gYnVmO1xyXG4gICAgdGhpcy5fc2l6ZSA9IHN6O1xyXG4gIH1cclxufTtcclxuXHJcblxyXG5cclxuLy8gLS0tIEV4cG9ydGVkIEFQSVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXcml0ZXI7XHJcbiIsIi8vIENvcHlyaWdodCAyMDExIE1hcmsgQ2F2YWdlIDxtY2F2YWdlQGdtYWlsLmNvbT4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuXHJcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcclxuXHJcbnZhciBBU04xID0gcmVxdWlyZSgnLi90eXBlcycpO1xyXG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcclxuXHJcblxyXG4vLyAtLS0gR2xvYmFsc1xyXG5cclxudmFyIG5ld0ludmFsaWRBc24xRXJyb3IgPSBlcnJvcnMubmV3SW52YWxpZEFzbjFFcnJvcjtcclxuXHJcblxyXG5cclxuLy8gLS0tIEFQSVxyXG5cclxuZnVuY3Rpb24gUmVhZGVyKGRhdGEpIHtcclxuICBpZiAoIWRhdGEgfHwgIUJ1ZmZlci5pc0J1ZmZlcihkYXRhKSlcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2RhdGEgbXVzdCBiZSBhIG5vZGUgQnVmZmVyJyk7XHJcblxyXG4gIHRoaXMuX2J1ZiA9IGRhdGE7XHJcbiAgdGhpcy5fc2l6ZSA9IGRhdGEubGVuZ3RoO1xyXG5cclxuICAvLyBUaGVzZSBob2xkIHRoZSBcImN1cnJlbnRcIiBzdGF0ZVxyXG4gIHRoaXMuX2xlbiA9IDA7XHJcbiAgdGhpcy5fb2Zmc2V0ID0gMDtcclxufVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRlci5wcm90b3R5cGUsICdsZW5ndGgnLCB7XHJcbiAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuICh0aGlzLl9sZW4pOyB9XHJcbn0pO1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRlci5wcm90b3R5cGUsICdvZmZzZXQnLCB7XHJcbiAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuICh0aGlzLl9vZmZzZXQpOyB9XHJcbn0pO1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRlci5wcm90b3R5cGUsICdyZW1haW4nLCB7XHJcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiAodGhpcy5fc2l6ZSAtIHRoaXMuX29mZnNldCk7IH1cclxufSk7XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGVyLnByb3RvdHlwZSwgJ2J1ZmZlcicsIHtcclxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuICh0aGlzLl9idWYuc2xpY2UodGhpcy5fb2Zmc2V0KSk7IH1cclxufSk7XHJcblxyXG5cclxuLyoqXHJcbiAqIFJlYWRzIGEgc2luZ2xlIGJ5dGUgYW5kIGFkdmFuY2VzIG9mZnNldDsgeW91IGNhbiBwYXNzIGluIGB0cnVlYCB0byBtYWtlIHRoaXNcclxuICogYSBcInBlZWtcIiBvcGVyYXRpb24gKGkuZS4sIGdldCB0aGUgYnl0ZSwgYnV0IGRvbid0IGFkdmFuY2UgdGhlIG9mZnNldCkuXHJcbiAqXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcGVlayB0cnVlIG1lYW5zIGRvbid0IG1vdmUgb2Zmc2V0LlxyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IHRoZSBuZXh0IGJ5dGUsIG51bGwgaWYgbm90IGVub3VnaCBkYXRhLlxyXG4gKi9cclxuUmVhZGVyLnByb3RvdHlwZS5yZWFkQnl0ZSA9IGZ1bmN0aW9uIChwZWVrKSB7XHJcbiAgaWYgKHRoaXMuX3NpemUgLSB0aGlzLl9vZmZzZXQgPCAxKVxyXG4gICAgcmV0dXJuIG51bGw7XHJcblxyXG4gIHZhciBiID0gdGhpcy5fYnVmW3RoaXMuX29mZnNldF0gJiAweGZmO1xyXG5cclxuICBpZiAoIXBlZWspXHJcbiAgICB0aGlzLl9vZmZzZXQgKz0gMTtcclxuXHJcbiAgcmV0dXJuIGI7XHJcbn07XHJcblxyXG5cclxuUmVhZGVyLnByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLnJlYWRCeXRlKHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBSZWFkcyBhIChwb3RlbnRpYWxseSkgdmFyaWFibGUgbGVuZ3RoIG9mZiB0aGUgQkVSIGJ1ZmZlci4gIFRoaXMgY2FsbCBpc1xyXG4gKiBub3QgcmVhbGx5IG1lYW50IHRvIGJlIGNhbGxlZCBkaXJlY3RseSwgYXMgY2FsbGVycyBoYXZlIHRvIG1hbmlwdWxhdGVcclxuICogdGhlIGludGVybmFsIGJ1ZmZlciBhZnRlcndhcmRzLlxyXG4gKlxyXG4gKiBBcyBhIHJlc3VsdCBvZiB0aGlzIGNhbGwsIHlvdSBjYW4gY2FsbCBgUmVhZGVyLmxlbmd0aGAsIHVudGlsIHRoZVxyXG4gKiBuZXh0IHRoaW5nIGNhbGxlZCB0aGF0IGRvZXMgYSByZWFkTGVuZ3RoLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IHRoZSBhbW91bnQgb2Ygb2Zmc2V0IHRvIGFkdmFuY2UgdGhlIGJ1ZmZlci5cclxuICogQHRocm93cyB7SW52YWxpZEFzbjFFcnJvcn0gb24gYmFkIEFTTi4xXHJcbiAqL1xyXG5SZWFkZXIucHJvdG90eXBlLnJlYWRMZW5ndGggPSBmdW5jdGlvbiAob2Zmc2V0KSB7XHJcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgb2Zmc2V0ID0gdGhpcy5fb2Zmc2V0O1xyXG5cclxuICBpZiAob2Zmc2V0ID49IHRoaXMuX3NpemUpXHJcbiAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgdmFyIGxlbkIgPSB0aGlzLl9idWZbb2Zmc2V0KytdICYgMHhmZjtcclxuICBpZiAobGVuQiA9PT0gbnVsbClcclxuICAgIHJldHVybiBudWxsO1xyXG5cclxuICBpZiAoKGxlbkIgJiAweDgwKSA9PT0gMHg4MCkge1xyXG4gICAgbGVuQiAmPSAweDdmO1xyXG5cclxuICAgIGlmIChsZW5CID09PSAwKVxyXG4gICAgICB0aHJvdyBuZXdJbnZhbGlkQXNuMUVycm9yKCdJbmRlZmluaXRlIGxlbmd0aCBub3Qgc3VwcG9ydGVkJyk7XHJcblxyXG4gICAgaWYgKGxlbkIgPiA0KVxyXG4gICAgICB0aHJvdyBuZXdJbnZhbGlkQXNuMUVycm9yKCdlbmNvZGluZyB0b28gbG9uZycpO1xyXG5cclxuICAgIGlmICh0aGlzLl9zaXplIC0gb2Zmc2V0IDwgbGVuQilcclxuICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgdGhpcy5fbGVuID0gMDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuQjsgaSsrKVxyXG4gICAgICB0aGlzLl9sZW4gPSAodGhpcy5fbGVuIDw8IDgpICsgKHRoaXMuX2J1ZltvZmZzZXQrK10gJiAweGZmKTtcclxuXHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIFdhc24ndCBhIHZhcmlhYmxlIGxlbmd0aFxyXG4gICAgdGhpcy5fbGVuID0gbGVuQjtcclxuICB9XHJcblxyXG4gIHJldHVybiBvZmZzZXQ7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIFBhcnNlcyB0aGUgbmV4dCBzZXF1ZW5jZSBpbiB0aGlzIEJFUiBidWZmZXIuXHJcbiAqXHJcbiAqIFRvIGdldCB0aGUgbGVuZ3RoIG9mIHRoZSBzZXF1ZW5jZSwgY2FsbCBgUmVhZGVyLmxlbmd0aGAuXHJcbiAqXHJcbiAqIEByZXR1cm4ge051bWJlcn0gdGhlIHNlcXVlbmNlJ3MgdGFnLlxyXG4gKi9cclxuUmVhZGVyLnByb3RvdHlwZS5yZWFkU2VxdWVuY2UgPSBmdW5jdGlvbiAodGFnKSB7XHJcbiAgdmFyIHNlcSA9IHRoaXMucGVlaygpO1xyXG4gIGlmIChzZXEgPT09IG51bGwpXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICBpZiAodGFnICE9PSB1bmRlZmluZWQgJiYgdGFnICE9PSBzZXEpXHJcbiAgICB0aHJvdyBuZXdJbnZhbGlkQXNuMUVycm9yKCdFeHBlY3RlZCAweCcgKyB0YWcudG9TdHJpbmcoMTYpICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzogZ290IDB4JyArIHNlcS50b1N0cmluZygxNikpO1xyXG5cclxuICB2YXIgbyA9IHRoaXMucmVhZExlbmd0aCh0aGlzLl9vZmZzZXQgKyAxKTsgLy8gc3RvcmVkIGluIGBsZW5ndGhgXHJcbiAgaWYgKG8gPT09IG51bGwpXHJcbiAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgdGhpcy5fb2Zmc2V0ID0gbztcclxuICByZXR1cm4gc2VxO1xyXG59O1xyXG5cclxuXHJcblJlYWRlci5wcm90b3R5cGUucmVhZEludCA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gdGhpcy5fcmVhZFRhZyhBU04xLkludGVnZXIpO1xyXG59O1xyXG5cclxuXHJcblJlYWRlci5wcm90b3R5cGUucmVhZEJvb2xlYW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuICh0aGlzLl9yZWFkVGFnKEFTTjEuQm9vbGVhbikgPT09IDAgPyBmYWxzZSA6IHRydWUpO1xyXG59O1xyXG5cclxuXHJcblJlYWRlci5wcm90b3R5cGUucmVhZEVudW1lcmF0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLl9yZWFkVGFnKEFTTjEuRW51bWVyYXRpb24pO1xyXG59O1xyXG5cclxuXHJcblJlYWRlci5wcm90b3R5cGUucmVhZFN0cmluZyA9IGZ1bmN0aW9uICh0YWcsIHJldGJ1Zikge1xyXG4gIGlmICghdGFnKVxyXG4gICAgdGFnID0gQVNOMS5PY3RldFN0cmluZztcclxuXHJcbiAgdmFyIGIgPSB0aGlzLnBlZWsoKTtcclxuICBpZiAoYiA9PT0gbnVsbClcclxuICAgIHJldHVybiBudWxsO1xyXG5cclxuICBpZiAoYiAhPT0gdGFnKVxyXG4gICAgdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcignRXhwZWN0ZWQgMHgnICsgdGFnLnRvU3RyaW5nKDE2KSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6IGdvdCAweCcgKyBiLnRvU3RyaW5nKDE2KSk7XHJcblxyXG4gIHZhciBvID0gdGhpcy5yZWFkTGVuZ3RoKHRoaXMuX29mZnNldCArIDEpOyAvLyBzdG9yZWQgaW4gYGxlbmd0aGBcclxuXHJcbiAgaWYgKG8gPT09IG51bGwpXHJcbiAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgaWYgKHRoaXMubGVuZ3RoID4gdGhpcy5fc2l6ZSAtIG8pXHJcbiAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgdGhpcy5fb2Zmc2V0ID0gbztcclxuXHJcbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKVxyXG4gICAgcmV0dXJuIHJldGJ1ZiA/IEJ1ZmZlci5hbGxvYygwKSA6ICcnO1xyXG5cclxuICB2YXIgc3RyID0gdGhpcy5fYnVmLnNsaWNlKHRoaXMuX29mZnNldCwgdGhpcy5fb2Zmc2V0ICsgdGhpcy5sZW5ndGgpO1xyXG4gIHRoaXMuX29mZnNldCArPSB0aGlzLmxlbmd0aDtcclxuXHJcbiAgcmV0dXJuIHJldGJ1ZiA/IHN0ciA6IHN0ci50b1N0cmluZygndXRmOCcpO1xyXG59O1xyXG5cclxuUmVhZGVyLnByb3RvdHlwZS5yZWFkT0lEID0gZnVuY3Rpb24gKHRhZykge1xyXG4gIGlmICghdGFnKVxyXG4gICAgdGFnID0gQVNOMS5PSUQ7XHJcblxyXG4gIHZhciBiID0gdGhpcy5yZWFkU3RyaW5nKHRhZywgdHJ1ZSk7XHJcbiAgaWYgKGIgPT09IG51bGwpXHJcbiAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgdmFyIHZhbHVlcyA9IFtdO1xyXG4gIHZhciB2YWx1ZSA9IDA7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGJ5dGUgPSBiW2ldICYgMHhmZjtcclxuXHJcbiAgICB2YWx1ZSA8PD0gNztcclxuICAgIHZhbHVlICs9IGJ5dGUgJiAweDdmO1xyXG4gICAgaWYgKChieXRlICYgMHg4MCkgPT09IDApIHtcclxuICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xyXG4gICAgICB2YWx1ZSA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YWx1ZSA9IHZhbHVlcy5zaGlmdCgpO1xyXG4gIHZhbHVlcy51bnNoaWZ0KHZhbHVlICUgNDApO1xyXG4gIHZhbHVlcy51bnNoaWZ0KCh2YWx1ZSAvIDQwKSA+PiAwKTtcclxuXHJcbiAgcmV0dXJuIHZhbHVlcy5qb2luKCcuJyk7XHJcbn07XHJcblxyXG5cclxuUmVhZGVyLnByb3RvdHlwZS5fcmVhZFRhZyA9IGZ1bmN0aW9uICh0YWcpIHtcclxuICBhc3NlcnQub2sodGFnICE9PSB1bmRlZmluZWQpO1xyXG5cclxuICB2YXIgYiA9IHRoaXMucGVlaygpO1xyXG5cclxuICBpZiAoYiA9PT0gbnVsbClcclxuICAgIHJldHVybiBudWxsO1xyXG5cclxuICBpZiAoYiAhPT0gdGFnKVxyXG4gICAgdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcignRXhwZWN0ZWQgMHgnICsgdGFnLnRvU3RyaW5nKDE2KSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6IGdvdCAweCcgKyBiLnRvU3RyaW5nKDE2KSk7XHJcblxyXG4gIHZhciBvID0gdGhpcy5yZWFkTGVuZ3RoKHRoaXMuX29mZnNldCArIDEpOyAvLyBzdG9yZWQgaW4gYGxlbmd0aGBcclxuICBpZiAobyA9PT0gbnVsbClcclxuICAgIHJldHVybiBudWxsO1xyXG5cclxuICBpZiAodGhpcy5sZW5ndGggPiA0KVxyXG4gICAgdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcignSW50ZWdlciB0b28gbG9uZzogJyArIHRoaXMubGVuZ3RoKTtcclxuXHJcbiAgaWYgKHRoaXMubGVuZ3RoID4gdGhpcy5fc2l6ZSAtIG8pXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB0aGlzLl9vZmZzZXQgPSBvO1xyXG5cclxuICB2YXIgZmIgPSB0aGlzLl9idWZbdGhpcy5fb2Zmc2V0XTtcclxuICB2YXIgdmFsdWUgPSAwO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhbHVlIDw8PSA4O1xyXG4gICAgdmFsdWUgfD0gKHRoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK10gJiAweGZmKTtcclxuICB9XHJcblxyXG4gIGlmICgoZmIgJiAweDgwKSA9PT0gMHg4MCAmJiBpICE9PSA0KVxyXG4gICAgdmFsdWUgLT0gKDEgPDwgKGkgKiA4KSk7XHJcblxyXG4gIHJldHVybiB2YWx1ZSA+PiAwO1xyXG59O1xyXG5cclxuXHJcblxyXG4vLyAtLS0gRXhwb3J0ZWQgQVBJXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWRlcjtcclxuIiwiLy8gQ29weXJpZ2h0IDIwMTEgTWFyayBDYXZhZ2UgPG1jYXZhZ2VAZ21haWwuY29tPiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5cclxudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XHJcbnZhciB0eXBlcyA9IHJlcXVpcmUoJy4vdHlwZXMnKTtcclxuXHJcbnZhciBSZWFkZXIgPSByZXF1aXJlKCcuL3JlYWRlcicpO1xyXG52YXIgV3JpdGVyID0gcmVxdWlyZSgnLi93cml0ZXInKTtcclxuXHJcblxyXG4vLyAtLS0gRXhwb3J0c1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gIFJlYWRlcjogUmVhZGVyLFxyXG5cclxuICBXcml0ZXI6IFdyaXRlclxyXG5cclxufTtcclxuXHJcbmZvciAodmFyIHQgaW4gdHlwZXMpIHtcclxuICBpZiAodHlwZXMuaGFzT3duUHJvcGVydHkodCkpXHJcbiAgICBtb2R1bGUuZXhwb3J0c1t0XSA9IHR5cGVzW3RdO1xyXG59XHJcbmZvciAodmFyIGUgaW4gZXJyb3JzKSB7XHJcbiAgaWYgKGVycm9ycy5oYXNPd25Qcm9wZXJ0eShlKSlcclxuICAgIG1vZHVsZS5leHBvcnRzW2VdID0gZXJyb3JzW2VdO1xyXG59XHJcbiIsIi8vIENvcHlyaWdodCAyMDExIE1hcmsgQ2F2YWdlIDxtY2F2YWdlQGdtYWlsLmNvbT4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuXHJcbi8vIElmIHlvdSBoYXZlIG5vIGlkZWEgd2hhdCBBU04uMSBvciBCRVIgaXMsIHNlZSB0aGlzOlxyXG4vLyBmdHA6Ly9mdHAucnNhLmNvbS9wdWIvcGtjcy9hc2NpaS9sYXltYW4uYXNjXHJcblxyXG52YXIgQmVyID0gcmVxdWlyZSgnLi9iZXIvaW5kZXgnKTtcclxuXHJcblxyXG5cclxuLy8gLS0tIEV4cG9ydGVkIEFQSVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gIEJlcjogQmVyLFxyXG5cclxuICBCZXJSZWFkZXI6IEJlci5SZWFkZXIsXHJcblxyXG4gIEJlcldyaXRlcjogQmVyLldyaXRlclxyXG5cclxufTtcclxuIiwiLy8gQ29weXJpZ2h0IDIwMTEgTWFyayBDYXZhZ2UgPG1jYXZhZ2VAZ21haWwuY29tPiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIEVPQzogMCxcclxuICBCb29sZWFuOiAxLFxyXG4gIEludGVnZXI6IDIsXHJcbiAgQml0U3RyaW5nOiAzLFxyXG4gIE9jdGV0U3RyaW5nOiA0LFxyXG4gIE51bGw6IDUsXHJcbiAgT0lEOiA2LFxyXG4gIE9iamVjdERlc2NyaXB0b3I6IDcsXHJcbiAgRXh0ZXJuYWw6IDgsXHJcbiAgUmVhbDogOSwgLy8gZmxvYXRcclxuICBFbnVtZXJhdGlvbjogMTAsXHJcbiAgUERWOiAxMSxcclxuICBVdGY4U3RyaW5nOiAxMixcclxuICBSZWxhdGl2ZU9JRDogMTMsXHJcbiAgU2VxdWVuY2U6IDE2LFxyXG4gIFNldDogMTcsXHJcbiAgTnVtZXJpY1N0cmluZzogMTgsXHJcbiAgUHJpbnRhYmxlU3RyaW5nOiAxOSxcclxuICBUNjFTdHJpbmc6IDIwLFxyXG4gIFZpZGVvdGV4U3RyaW5nOiAyMSxcclxuICBJQTVTdHJpbmc6IDIyLFxyXG4gIFVUQ1RpbWU6IDIzLFxyXG4gIEdlbmVyYWxpemVkVGltZTogMjQsXHJcbiAgR3JhcGhpY1N0cmluZzogMjUsXHJcbiAgVmlzaWJsZVN0cmluZzogMjYsXHJcbiAgR2VuZXJhbFN0cmluZzogMjgsXHJcbiAgVW5pdmVyc2FsU3RyaW5nOiAyOSxcclxuICBDaGFyYWN0ZXJTdHJpbmc6IDMwLFxyXG4gIEJNUFN0cmluZzogMzEsXHJcbiAgQ29uc3RydWN0b3I6IDMyLFxyXG4gIENvbnRleHQ6IDEyOFxyXG59O1xyXG4iLCIvLyBDb3B5cmlnaHQgMjAxMSBNYXJrIENhdmFnZSA8bWNhdmFnZUBnbWFpbC5jb20+IEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gIG5ld0ludmFsaWRBc24xRXJyb3I6IGZ1bmN0aW9uIChtc2cpIHtcclxuICAgIHZhciBlID0gbmV3IEVycm9yKCk7XHJcbiAgICBlLm5hbWUgPSAnSW52YWxpZEFzbjFFcnJvcic7XHJcbiAgICBlLm1lc3NhZ2UgPSBtc2cgfHwgJyc7XHJcbiAgICByZXR1cm4gZTtcclxuICB9XHJcblxyXG59O1xyXG4iXSwic291cmNlUm9vdCI6IiJ9