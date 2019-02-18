(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.asn1.js"],{

/***/ "0cit":
/*!********************************************************!*\
  !*** ./node_modules/asn1.js/lib/asn1/base/reporter.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(/*! inherits */ "P7XM");

function Reporter(options) {
  this._reporterState = {
    obj: null,
    path: [],
    options: options || {},
    errors: []
  };
}
exports.Reporter = Reporter;

Reporter.prototype.isError = function isError(obj) {
  return obj instanceof ReporterError;
};

Reporter.prototype.save = function save() {
  var state = this._reporterState;

  return { obj: state.obj, pathLen: state.path.length };
};

Reporter.prototype.restore = function restore(data) {
  var state = this._reporterState;

  state.obj = data.obj;
  state.path = state.path.slice(0, data.pathLen);
};

Reporter.prototype.enterKey = function enterKey(key) {
  return this._reporterState.path.push(key);
};

Reporter.prototype.exitKey = function exitKey(index) {
  var state = this._reporterState;

  state.path = state.path.slice(0, index - 1);
};

Reporter.prototype.leaveKey = function leaveKey(index, key, value) {
  var state = this._reporterState;

  this.exitKey(index);
  if (state.obj !== null)
    state.obj[key] = value;
};

Reporter.prototype.path = function path() {
  return this._reporterState.path.join('/');
};

Reporter.prototype.enterObject = function enterObject() {
  var state = this._reporterState;

  var prev = state.obj;
  state.obj = {};
  return prev;
};

Reporter.prototype.leaveObject = function leaveObject(prev) {
  var state = this._reporterState;

  var now = state.obj;
  state.obj = prev;
  return now;
};

Reporter.prototype.error = function error(msg) {
  var err;
  var state = this._reporterState;

  var inherited = msg instanceof ReporterError;
  if (inherited) {
    err = msg;
  } else {
    err = new ReporterError(state.path.map(function(elem) {
      return '[' + JSON.stringify(elem) + ']';
    }).join(''), msg.message || msg, msg.stack);
  }

  if (!state.options.partial)
    throw err;

  if (!inherited)
    state.errors.push(err);

  return err;
};

Reporter.prototype.wrapResult = function wrapResult(result) {
  var state = this._reporterState;
  if (!state.options.partial)
    return result;

  return {
    result: this.isError(result) ? null : result,
    errors: state.errors
  };
};

function ReporterError(path, msg) {
  this.path = path;
  this.rethrow(msg);
};
inherits(ReporterError, Error);

ReporterError.prototype.rethrow = function rethrow(msg) {
  this.message = msg + ' at: ' + (this.path || '(shallow)');
  if (Error.captureStackTrace)
    Error.captureStackTrace(this, ReporterError);

  if (!this.stack) {
    try {
      // IE only adds stack when thrown
      throw new Error(this.message);
    } catch (e) {
      this.stack = e.stack;
    }
  }
  return this;
};


/***/ }),

/***/ "7zrB":
/*!**********************************************!*\
  !*** ./node_modules/asn1.js/lib/asn1/api.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var asn1 = __webpack_require__(/*! ../asn1 */ "f3pb");
var inherits = __webpack_require__(/*! inherits */ "P7XM");

var api = exports;

api.define = function define(name, body) {
  return new Entity(name, body);
};

function Entity(name, body) {
  this.name = name;
  this.body = body;

  this.decoders = {};
  this.encoders = {};
};

Entity.prototype._createNamed = function createNamed(base) {
  var named;
  try {
    named = __webpack_require__(/*! vm */ "BwZh").runInThisContext(
      '(function ' + this.name + '(entity) {\n' +
      '  this._initNamed(entity);\n' +
      '})'
    );
  } catch (e) {
    named = function (entity) {
      this._initNamed(entity);
    };
  }
  inherits(named, base);
  named.prototype._initNamed = function initnamed(entity) {
    base.call(this, entity);
  };

  return new named(this);
};

Entity.prototype._getDecoder = function _getDecoder(enc) {
  enc = enc || 'der';
  // Lazily create decoder
  if (!this.decoders.hasOwnProperty(enc))
    this.decoders[enc] = this._createNamed(asn1.decoders[enc]);
  return this.decoders[enc];
};

Entity.prototype.decode = function decode(data, enc, options) {
  return this._getDecoder(enc).decode(data, options);
};

Entity.prototype._getEncoder = function _getEncoder(enc) {
  enc = enc || 'der';
  // Lazily create encoder
  if (!this.encoders.hasOwnProperty(enc))
    this.encoders[enc] = this._createNamed(asn1.encoders[enc]);
  return this.encoders[enc];
};

Entity.prototype.encode = function encode(data, enc, /* internal */ reporter) {
  return this._getEncoder(enc).encode(data, reporter);
};


/***/ }),

/***/ "AhHn":
/*!**********************************************************!*\
  !*** ./node_modules/asn1.js/lib/asn1/constants/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var constants = exports;

// Helper
constants._reverse = function reverse(map) {
  var res = {};

  Object.keys(map).forEach(function(key) {
    // Convert key to integer if it is stringified
    if ((key | 0) == key)
      key = key | 0;

    var value = map[key];
    res[value] = key;
  });

  return res;
};

constants.der = __webpack_require__(/*! ./der */ "i3FT");


/***/ }),

/***/ "IPZY":
/*!*********************************************************!*\
  !*** ./node_modules/asn1.js/lib/asn1/decoders/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var decoders = exports;

decoders.der = __webpack_require__(/*! ./der */ "z71Z");
decoders.pem = __webpack_require__(/*! ./pem */ "jfd1");


/***/ }),

/***/ "N2jm":
/*!*******************************************************!*\
  !*** ./node_modules/asn1.js/lib/asn1/encoders/der.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(/*! inherits */ "P7XM");
var Buffer = __webpack_require__(/*! buffer */ "tjlA").Buffer;

var asn1 = __webpack_require__(/*! ../../asn1 */ "f3pb");
var base = asn1.base;

// Import DER constants
var der = asn1.constants.der;

function DEREncoder(entity) {
  this.enc = 'der';
  this.name = entity.name;
  this.entity = entity;

  // Construct base tree
  this.tree = new DERNode();
  this.tree._init(entity.body);
};
module.exports = DEREncoder;

DEREncoder.prototype.encode = function encode(data, reporter) {
  return this.tree._encode(data, reporter).join();
};

// Tree methods

function DERNode(parent) {
  base.Node.call(this, 'der', parent);
}
inherits(DERNode, base.Node);

DERNode.prototype._encodeComposite = function encodeComposite(tag,
                                                              primitive,
                                                              cls,
                                                              content) {
  var encodedTag = encodeTag(tag, primitive, cls, this.reporter);

  // Short form
  if (content.length < 0x80) {
    var header = new Buffer(2);
    header[0] = encodedTag;
    header[1] = content.length;
    return this._createEncoderBuffer([ header, content ]);
  }

  // Long form
  // Count octets required to store length
  var lenOctets = 1;
  for (var i = content.length; i >= 0x100; i >>= 8)
    lenOctets++;

  var header = new Buffer(1 + 1 + lenOctets);
  header[0] = encodedTag;
  header[1] = 0x80 | lenOctets;

  for (var i = 1 + lenOctets, j = content.length; j > 0; i--, j >>= 8)
    header[i] = j & 0xff;

  return this._createEncoderBuffer([ header, content ]);
};

DERNode.prototype._encodeStr = function encodeStr(str, tag) {
  if (tag === 'bitstr') {
    return this._createEncoderBuffer([ str.unused | 0, str.data ]);
  } else if (tag === 'bmpstr') {
    var buf = new Buffer(str.length * 2);
    for (var i = 0; i < str.length; i++) {
      buf.writeUInt16BE(str.charCodeAt(i), i * 2);
    }
    return this._createEncoderBuffer(buf);
  } else if (tag === 'numstr') {
    if (!this._isNumstr(str)) {
      return this.reporter.error('Encoding of string type: numstr supports ' +
                                 'only digits and space');
    }
    return this._createEncoderBuffer(str);
  } else if (tag === 'printstr') {
    if (!this._isPrintstr(str)) {
      return this.reporter.error('Encoding of string type: printstr supports ' +
                                 'only latin upper and lower case letters, ' +
                                 'digits, space, apostrophe, left and rigth ' +
                                 'parenthesis, plus sign, comma, hyphen, ' +
                                 'dot, slash, colon, equal sign, ' +
                                 'question mark');
    }
    return this._createEncoderBuffer(str);
  } else if (/str$/.test(tag)) {
    return this._createEncoderBuffer(str);
  } else if (tag === 'objDesc') {
    return this._createEncoderBuffer(str);
  } else {
    return this.reporter.error('Encoding of string type: ' + tag +
                               ' unsupported');
  }
};

DERNode.prototype._encodeObjid = function encodeObjid(id, values, relative) {
  if (typeof id === 'string') {
    if (!values)
      return this.reporter.error('string objid given, but no values map found');
    if (!values.hasOwnProperty(id))
      return this.reporter.error('objid not found in values map');
    id = values[id].split(/[\s\.]+/g);
    for (var i = 0; i < id.length; i++)
      id[i] |= 0;
  } else if (Array.isArray(id)) {
    id = id.slice();
    for (var i = 0; i < id.length; i++)
      id[i] |= 0;
  }

  if (!Array.isArray(id)) {
    return this.reporter.error('objid() should be either array or string, ' +
                               'got: ' + JSON.stringify(id));
  }

  if (!relative) {
    if (id[1] >= 40)
      return this.reporter.error('Second objid identifier OOB');
    id.splice(0, 2, id[0] * 40 + id[1]);
  }

  // Count number of octets
  var size = 0;
  for (var i = 0; i < id.length; i++) {
    var ident = id[i];
    for (size++; ident >= 0x80; ident >>= 7)
      size++;
  }

  var objid = new Buffer(size);
  var offset = objid.length - 1;
  for (var i = id.length - 1; i >= 0; i--) {
    var ident = id[i];
    objid[offset--] = ident & 0x7f;
    while ((ident >>= 7) > 0)
      objid[offset--] = 0x80 | (ident & 0x7f);
  }

  return this._createEncoderBuffer(objid);
};

function two(num) {
  if (num < 10)
    return '0' + num;
  else
    return num;
}

DERNode.prototype._encodeTime = function encodeTime(time, tag) {
  var str;
  var date = new Date(time);

  if (tag === 'gentime') {
    str = [
      two(date.getFullYear()),
      two(date.getUTCMonth() + 1),
      two(date.getUTCDate()),
      two(date.getUTCHours()),
      two(date.getUTCMinutes()),
      two(date.getUTCSeconds()),
      'Z'
    ].join('');
  } else if (tag === 'utctime') {
    str = [
      two(date.getFullYear() % 100),
      two(date.getUTCMonth() + 1),
      two(date.getUTCDate()),
      two(date.getUTCHours()),
      two(date.getUTCMinutes()),
      two(date.getUTCSeconds()),
      'Z'
    ].join('');
  } else {
    this.reporter.error('Encoding ' + tag + ' time is not supported yet');
  }

  return this._encodeStr(str, 'octstr');
};

DERNode.prototype._encodeNull = function encodeNull() {
  return this._createEncoderBuffer('');
};

DERNode.prototype._encodeInt = function encodeInt(num, values) {
  if (typeof num === 'string') {
    if (!values)
      return this.reporter.error('String int or enum given, but no values map');
    if (!values.hasOwnProperty(num)) {
      return this.reporter.error('Values map doesn\'t contain: ' +
                                 JSON.stringify(num));
    }
    num = values[num];
  }

  // Bignum, assume big endian
  if (typeof num !== 'number' && !Buffer.isBuffer(num)) {
    var numArray = num.toArray();
    if (!num.sign && numArray[0] & 0x80) {
      numArray.unshift(0);
    }
    num = new Buffer(numArray);
  }

  if (Buffer.isBuffer(num)) {
    var size = num.length;
    if (num.length === 0)
      size++;

    var out = new Buffer(size);
    num.copy(out);
    if (num.length === 0)
      out[0] = 0
    return this._createEncoderBuffer(out);
  }

  if (num < 0x80)
    return this._createEncoderBuffer(num);

  if (num < 0x100)
    return this._createEncoderBuffer([0, num]);

  var size = 1;
  for (var i = num; i >= 0x100; i >>= 8)
    size++;

  var out = new Array(size);
  for (var i = out.length - 1; i >= 0; i--) {
    out[i] = num & 0xff;
    num >>= 8;
  }
  if(out[0] & 0x80) {
    out.unshift(0);
  }

  return this._createEncoderBuffer(new Buffer(out));
};

DERNode.prototype._encodeBool = function encodeBool(value) {
  return this._createEncoderBuffer(value ? 0xff : 0);
};

DERNode.prototype._use = function use(entity, obj) {
  if (typeof entity === 'function')
    entity = entity(obj);
  return entity._getEncoder('der').tree;
};

DERNode.prototype._skipDefault = function skipDefault(dataBuffer, reporter, parent) {
  var state = this._baseState;
  var i;
  if (state['default'] === null)
    return false;

  var data = dataBuffer.join();
  if (state.defaultBuffer === undefined)
    state.defaultBuffer = this._encodeValue(state['default'], reporter, parent).join();

  if (data.length !== state.defaultBuffer.length)
    return false;

  for (i=0; i < data.length; i++)
    if (data[i] !== state.defaultBuffer[i])
      return false;

  return true;
};

// Utility methods

function encodeTag(tag, primitive, cls, reporter) {
  var res;

  if (tag === 'seqof')
    tag = 'seq';
  else if (tag === 'setof')
    tag = 'set';

  if (der.tagByName.hasOwnProperty(tag))
    res = der.tagByName[tag];
  else if (typeof tag === 'number' && (tag | 0) === tag)
    res = tag;
  else
    return reporter.error('Unknown tag: ' + tag);

  if (res >= 0x1f)
    return reporter.error('Multi-octet tag encoding unsupported');

  if (!primitive)
    res |= 0x20;

  res |= (der.tagClassByName[cls || 'universal'] << 6);

  return res;
}


/***/ }),

/***/ "ND7S":
/*!*********************************************************!*\
  !*** ./node_modules/asn1.js/lib/asn1/encoders/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var encoders = exports;

encoders.der = __webpack_require__(/*! ./der */ "N2jm");
encoders.pem = __webpack_require__(/*! ./pem */ "hbMA");


/***/ }),

/***/ "Qd/k":
/*!*****************************************************!*\
  !*** ./node_modules/asn1.js/lib/asn1/base/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var base = exports;

base.Reporter = __webpack_require__(/*! ./reporter */ "0cit").Reporter;
base.DecoderBuffer = __webpack_require__(/*! ./buffer */ "YoN+").DecoderBuffer;
base.EncoderBuffer = __webpack_require__(/*! ./buffer */ "YoN+").EncoderBuffer;
base.Node = __webpack_require__(/*! ./node */ "g2Dh");


/***/ }),

/***/ "YoN+":
/*!******************************************************!*\
  !*** ./node_modules/asn1.js/lib/asn1/base/buffer.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(/*! inherits */ "P7XM");
var Reporter = __webpack_require__(/*! ../base */ "Qd/k").Reporter;
var Buffer = __webpack_require__(/*! buffer */ "tjlA").Buffer;

function DecoderBuffer(base, options) {
  Reporter.call(this, options);
  if (!Buffer.isBuffer(base)) {
    this.error('Input not Buffer');
    return;
  }

  this.base = base;
  this.offset = 0;
  this.length = base.length;
}
inherits(DecoderBuffer, Reporter);
exports.DecoderBuffer = DecoderBuffer;

DecoderBuffer.prototype.save = function save() {
  return { offset: this.offset, reporter: Reporter.prototype.save.call(this) };
};

DecoderBuffer.prototype.restore = function restore(save) {
  // Return skipped data
  var res = new DecoderBuffer(this.base);
  res.offset = save.offset;
  res.length = this.offset;

  this.offset = save.offset;
  Reporter.prototype.restore.call(this, save.reporter);

  return res;
};

DecoderBuffer.prototype.isEmpty = function isEmpty() {
  return this.offset === this.length;
};

DecoderBuffer.prototype.readUInt8 = function readUInt8(fail) {
  if (this.offset + 1 <= this.length)
    return this.base.readUInt8(this.offset++, true);
  else
    return this.error(fail || 'DecoderBuffer overrun');
}

DecoderBuffer.prototype.skip = function skip(bytes, fail) {
  if (!(this.offset + bytes <= this.length))
    return this.error(fail || 'DecoderBuffer overrun');

  var res = new DecoderBuffer(this.base);

  // Share reporter state
  res._reporterState = this._reporterState;

  res.offset = this.offset;
  res.length = this.offset + bytes;
  this.offset += bytes;
  return res;
}

DecoderBuffer.prototype.raw = function raw(save) {
  return this.base.slice(save ? save.offset : this.offset, this.length);
}

function EncoderBuffer(value, reporter) {
  if (Array.isArray(value)) {
    this.length = 0;
    this.value = value.map(function(item) {
      if (!(item instanceof EncoderBuffer))
        item = new EncoderBuffer(item, reporter);
      this.length += item.length;
      return item;
    }, this);
  } else if (typeof value === 'number') {
    if (!(0 <= value && value <= 0xff))
      return reporter.error('non-byte EncoderBuffer value');
    this.value = value;
    this.length = 1;
  } else if (typeof value === 'string') {
    this.value = value;
    this.length = Buffer.byteLength(value);
  } else if (Buffer.isBuffer(value)) {
    this.value = value;
    this.length = value.length;
  } else {
    return reporter.error('Unsupported type: ' + typeof value);
  }
}
exports.EncoderBuffer = EncoderBuffer;

EncoderBuffer.prototype.join = function join(out, offset) {
  if (!out)
    out = new Buffer(this.length);
  if (!offset)
    offset = 0;

  if (this.length === 0)
    return out;

  if (Array.isArray(this.value)) {
    this.value.forEach(function(item) {
      item.join(out, offset);
      offset += item.length;
    });
  } else {
    if (typeof this.value === 'number')
      out[offset] = this.value;
    else if (typeof this.value === 'string')
      out.write(this.value, offset);
    else if (Buffer.isBuffer(this.value))
      this.value.copy(out, offset);
    offset += this.length;
  }

  return out;
};


/***/ }),

/***/ "f3pb":
/*!******************************************!*\
  !*** ./node_modules/asn1.js/lib/asn1.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var asn1 = exports;

asn1.bignum = __webpack_require__(/*! bn.js */ "OZ/i");

asn1.define = __webpack_require__(/*! ./asn1/api */ "7zrB").define;
asn1.base = __webpack_require__(/*! ./asn1/base */ "Qd/k");
asn1.constants = __webpack_require__(/*! ./asn1/constants */ "AhHn");
asn1.decoders = __webpack_require__(/*! ./asn1/decoders */ "IPZY");
asn1.encoders = __webpack_require__(/*! ./asn1/encoders */ "ND7S");


/***/ }),

/***/ "g2Dh":
/*!****************************************************!*\
  !*** ./node_modules/asn1.js/lib/asn1/base/node.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Reporter = __webpack_require__(/*! ../base */ "Qd/k").Reporter;
var EncoderBuffer = __webpack_require__(/*! ../base */ "Qd/k").EncoderBuffer;
var DecoderBuffer = __webpack_require__(/*! ../base */ "Qd/k").DecoderBuffer;
var assert = __webpack_require__(/*! minimalistic-assert */ "2j6C");

// Supported tags
var tags = [
  'seq', 'seqof', 'set', 'setof', 'objid', 'bool',
  'gentime', 'utctime', 'null_', 'enum', 'int', 'objDesc',
  'bitstr', 'bmpstr', 'charstr', 'genstr', 'graphstr', 'ia5str', 'iso646str',
  'numstr', 'octstr', 'printstr', 't61str', 'unistr', 'utf8str', 'videostr'
];

// Public methods list
var methods = [
  'key', 'obj', 'use', 'optional', 'explicit', 'implicit', 'def', 'choice',
  'any', 'contains'
].concat(tags);

// Overrided methods list
var overrided = [
  '_peekTag', '_decodeTag', '_use',
  '_decodeStr', '_decodeObjid', '_decodeTime',
  '_decodeNull', '_decodeInt', '_decodeBool', '_decodeList',

  '_encodeComposite', '_encodeStr', '_encodeObjid', '_encodeTime',
  '_encodeNull', '_encodeInt', '_encodeBool'
];

function Node(enc, parent) {
  var state = {};
  this._baseState = state;

  state.enc = enc;

  state.parent = parent || null;
  state.children = null;

  // State
  state.tag = null;
  state.args = null;
  state.reverseArgs = null;
  state.choice = null;
  state.optional = false;
  state.any = false;
  state.obj = false;
  state.use = null;
  state.useDecoder = null;
  state.key = null;
  state['default'] = null;
  state.explicit = null;
  state.implicit = null;
  state.contains = null;

  // Should create new instance on each method
  if (!state.parent) {
    state.children = [];
    this._wrap();
  }
}
module.exports = Node;

var stateProps = [
  'enc', 'parent', 'children', 'tag', 'args', 'reverseArgs', 'choice',
  'optional', 'any', 'obj', 'use', 'alteredUse', 'key', 'default', 'explicit',
  'implicit', 'contains'
];

Node.prototype.clone = function clone() {
  var state = this._baseState;
  var cstate = {};
  stateProps.forEach(function(prop) {
    cstate[prop] = state[prop];
  });
  var res = new this.constructor(cstate.parent);
  res._baseState = cstate;
  return res;
};

Node.prototype._wrap = function wrap() {
  var state = this._baseState;
  methods.forEach(function(method) {
    this[method] = function _wrappedMethod() {
      var clone = new this.constructor(this);
      state.children.push(clone);
      return clone[method].apply(clone, arguments);
    };
  }, this);
};

Node.prototype._init = function init(body) {
  var state = this._baseState;

  assert(state.parent === null);
  body.call(this);

  // Filter children
  state.children = state.children.filter(function(child) {
    return child._baseState.parent === this;
  }, this);
  assert.equal(state.children.length, 1, 'Root node can have only one child');
};

Node.prototype._useArgs = function useArgs(args) {
  var state = this._baseState;

  // Filter children and args
  var children = args.filter(function(arg) {
    return arg instanceof this.constructor;
  }, this);
  args = args.filter(function(arg) {
    return !(arg instanceof this.constructor);
  }, this);

  if (children.length !== 0) {
    assert(state.children === null);
    state.children = children;

    // Replace parent to maintain backward link
    children.forEach(function(child) {
      child._baseState.parent = this;
    }, this);
  }
  if (args.length !== 0) {
    assert(state.args === null);
    state.args = args;
    state.reverseArgs = args.map(function(arg) {
      if (typeof arg !== 'object' || arg.constructor !== Object)
        return arg;

      var res = {};
      Object.keys(arg).forEach(function(key) {
        if (key == (key | 0))
          key |= 0;
        var value = arg[key];
        res[value] = key;
      });
      return res;
    });
  }
};

//
// Overrided methods
//

overrided.forEach(function(method) {
  Node.prototype[method] = function _overrided() {
    var state = this._baseState;
    throw new Error(method + ' not implemented for encoding: ' + state.enc);
  };
});

//
// Public methods
//

tags.forEach(function(tag) {
  Node.prototype[tag] = function _tagMethod() {
    var state = this._baseState;
    var args = Array.prototype.slice.call(arguments);

    assert(state.tag === null);
    state.tag = tag;

    this._useArgs(args);

    return this;
  };
});

Node.prototype.use = function use(item) {
  assert(item);
  var state = this._baseState;

  assert(state.use === null);
  state.use = item;

  return this;
};

Node.prototype.optional = function optional() {
  var state = this._baseState;

  state.optional = true;

  return this;
};

Node.prototype.def = function def(val) {
  var state = this._baseState;

  assert(state['default'] === null);
  state['default'] = val;
  state.optional = true;

  return this;
};

Node.prototype.explicit = function explicit(num) {
  var state = this._baseState;

  assert(state.explicit === null && state.implicit === null);
  state.explicit = num;

  return this;
};

Node.prototype.implicit = function implicit(num) {
  var state = this._baseState;

  assert(state.explicit === null && state.implicit === null);
  state.implicit = num;

  return this;
};

Node.prototype.obj = function obj() {
  var state = this._baseState;
  var args = Array.prototype.slice.call(arguments);

  state.obj = true;

  if (args.length !== 0)
    this._useArgs(args);

  return this;
};

Node.prototype.key = function key(newKey) {
  var state = this._baseState;

  assert(state.key === null);
  state.key = newKey;

  return this;
};

Node.prototype.any = function any() {
  var state = this._baseState;

  state.any = true;

  return this;
};

Node.prototype.choice = function choice(obj) {
  var state = this._baseState;

  assert(state.choice === null);
  state.choice = obj;
  this._useArgs(Object.keys(obj).map(function(key) {
    return obj[key];
  }));

  return this;
};

Node.prototype.contains = function contains(item) {
  var state = this._baseState;

  assert(state.use === null);
  state.contains = item;

  return this;
};

//
// Decoding
//

Node.prototype._decode = function decode(input, options) {
  var state = this._baseState;

  // Decode root node
  if (state.parent === null)
    return input.wrapResult(state.children[0]._decode(input, options));

  var result = state['default'];
  var present = true;

  var prevKey = null;
  if (state.key !== null)
    prevKey = input.enterKey(state.key);

  // Check if tag is there
  if (state.optional) {
    var tag = null;
    if (state.explicit !== null)
      tag = state.explicit;
    else if (state.implicit !== null)
      tag = state.implicit;
    else if (state.tag !== null)
      tag = state.tag;

    if (tag === null && !state.any) {
      // Trial and Error
      var save = input.save();
      try {
        if (state.choice === null)
          this._decodeGeneric(state.tag, input, options);
        else
          this._decodeChoice(input, options);
        present = true;
      } catch (e) {
        present = false;
      }
      input.restore(save);
    } else {
      present = this._peekTag(input, tag, state.any);

      if (input.isError(present))
        return present;
    }
  }

  // Push object on stack
  var prevObj;
  if (state.obj && present)
    prevObj = input.enterObject();

  if (present) {
    // Unwrap explicit values
    if (state.explicit !== null) {
      var explicit = this._decodeTag(input, state.explicit);
      if (input.isError(explicit))
        return explicit;
      input = explicit;
    }

    var start = input.offset;

    // Unwrap implicit and normal values
    if (state.use === null && state.choice === null) {
      if (state.any)
        var save = input.save();
      var body = this._decodeTag(
        input,
        state.implicit !== null ? state.implicit : state.tag,
        state.any
      );
      if (input.isError(body))
        return body;

      if (state.any)
        result = input.raw(save);
      else
        input = body;
    }

    if (options && options.track && state.tag !== null)
      options.track(input.path(), start, input.length, 'tagged');

    if (options && options.track && state.tag !== null)
      options.track(input.path(), input.offset, input.length, 'content');

    // Select proper method for tag
    if (state.any)
      result = result;
    else if (state.choice === null)
      result = this._decodeGeneric(state.tag, input, options);
    else
      result = this._decodeChoice(input, options);

    if (input.isError(result))
      return result;

    // Decode children
    if (!state.any && state.choice === null && state.children !== null) {
      state.children.forEach(function decodeChildren(child) {
        // NOTE: We are ignoring errors here, to let parser continue with other
        // parts of encoded data
        child._decode(input, options);
      });
    }

    // Decode contained/encoded by schema, only in bit or octet strings
    if (state.contains && (state.tag === 'octstr' || state.tag === 'bitstr')) {
      var data = new DecoderBuffer(result);
      result = this._getUse(state.contains, input._reporterState.obj)
          ._decode(data, options);
    }
  }

  // Pop object
  if (state.obj && present)
    result = input.leaveObject(prevObj);

  // Set key
  if (state.key !== null && (result !== null || present === true))
    input.leaveKey(prevKey, state.key, result);
  else if (prevKey !== null)
    input.exitKey(prevKey);

  return result;
};

Node.prototype._decodeGeneric = function decodeGeneric(tag, input, options) {
  var state = this._baseState;

  if (tag === 'seq' || tag === 'set')
    return null;
  if (tag === 'seqof' || tag === 'setof')
    return this._decodeList(input, tag, state.args[0], options);
  else if (/str$/.test(tag))
    return this._decodeStr(input, tag, options);
  else if (tag === 'objid' && state.args)
    return this._decodeObjid(input, state.args[0], state.args[1], options);
  else if (tag === 'objid')
    return this._decodeObjid(input, null, null, options);
  else if (tag === 'gentime' || tag === 'utctime')
    return this._decodeTime(input, tag, options);
  else if (tag === 'null_')
    return this._decodeNull(input, options);
  else if (tag === 'bool')
    return this._decodeBool(input, options);
  else if (tag === 'objDesc')
    return this._decodeStr(input, tag, options);
  else if (tag === 'int' || tag === 'enum')
    return this._decodeInt(input, state.args && state.args[0], options);

  if (state.use !== null) {
    return this._getUse(state.use, input._reporterState.obj)
        ._decode(input, options);
  } else {
    return input.error('unknown tag: ' + tag);
  }
};

Node.prototype._getUse = function _getUse(entity, obj) {

  var state = this._baseState;
  // Create altered use decoder if implicit is set
  state.useDecoder = this._use(entity, obj);
  assert(state.useDecoder._baseState.parent === null);
  state.useDecoder = state.useDecoder._baseState.children[0];
  if (state.implicit !== state.useDecoder._baseState.implicit) {
    state.useDecoder = state.useDecoder.clone();
    state.useDecoder._baseState.implicit = state.implicit;
  }
  return state.useDecoder;
};

Node.prototype._decodeChoice = function decodeChoice(input, options) {
  var state = this._baseState;
  var result = null;
  var match = false;

  Object.keys(state.choice).some(function(key) {
    var save = input.save();
    var node = state.choice[key];
    try {
      var value = node._decode(input, options);
      if (input.isError(value))
        return false;

      result = { type: key, value: value };
      match = true;
    } catch (e) {
      input.restore(save);
      return false;
    }
    return true;
  }, this);

  if (!match)
    return input.error('Choice not matched');

  return result;
};

//
// Encoding
//

Node.prototype._createEncoderBuffer = function createEncoderBuffer(data) {
  return new EncoderBuffer(data, this.reporter);
};

Node.prototype._encode = function encode(data, reporter, parent) {
  var state = this._baseState;
  if (state['default'] !== null && state['default'] === data)
    return;

  var result = this._encodeValue(data, reporter, parent);
  if (result === undefined)
    return;

  if (this._skipDefault(result, reporter, parent))
    return;

  return result;
};

Node.prototype._encodeValue = function encode(data, reporter, parent) {
  var state = this._baseState;

  // Decode root node
  if (state.parent === null)
    return state.children[0]._encode(data, reporter || new Reporter());

  var result = null;

  // Set reporter to share it with a child class
  this.reporter = reporter;

  // Check if data is there
  if (state.optional && data === undefined) {
    if (state['default'] !== null)
      data = state['default']
    else
      return;
  }

  // Encode children first
  var content = null;
  var primitive = false;
  if (state.any) {
    // Anything that was given is translated to buffer
    result = this._createEncoderBuffer(data);
  } else if (state.choice) {
    result = this._encodeChoice(data, reporter);
  } else if (state.contains) {
    content = this._getUse(state.contains, parent)._encode(data, reporter);
    primitive = true;
  } else if (state.children) {
    content = state.children.map(function(child) {
      if (child._baseState.tag === 'null_')
        return child._encode(null, reporter, data);

      if (child._baseState.key === null)
        return reporter.error('Child should have a key');
      var prevKey = reporter.enterKey(child._baseState.key);

      if (typeof data !== 'object')
        return reporter.error('Child expected, but input is not object');

      var res = child._encode(data[child._baseState.key], reporter, data);
      reporter.leaveKey(prevKey);

      return res;
    }, this).filter(function(child) {
      return child;
    });
    content = this._createEncoderBuffer(content);
  } else {
    if (state.tag === 'seqof' || state.tag === 'setof') {
      // TODO(indutny): this should be thrown on DSL level
      if (!(state.args && state.args.length === 1))
        return reporter.error('Too many args for : ' + state.tag);

      if (!Array.isArray(data))
        return reporter.error('seqof/setof, but data is not Array');

      var child = this.clone();
      child._baseState.implicit = null;
      content = this._createEncoderBuffer(data.map(function(item) {
        var state = this._baseState;

        return this._getUse(state.args[0], data)._encode(item, reporter);
      }, child));
    } else if (state.use !== null) {
      result = this._getUse(state.use, parent)._encode(data, reporter);
    } else {
      content = this._encodePrimitive(state.tag, data);
      primitive = true;
    }
  }

  // Encode data itself
  var result;
  if (!state.any && state.choice === null) {
    var tag = state.implicit !== null ? state.implicit : state.tag;
    var cls = state.implicit === null ? 'universal' : 'context';

    if (tag === null) {
      if (state.use === null)
        reporter.error('Tag could be omitted only for .use()');
    } else {
      if (state.use === null)
        result = this._encodeComposite(tag, primitive, cls, content);
    }
  }

  // Wrap in explicit
  if (state.explicit !== null)
    result = this._encodeComposite(state.explicit, false, 'context', result);

  return result;
};

Node.prototype._encodeChoice = function encodeChoice(data, reporter) {
  var state = this._baseState;

  var node = state.choice[data.type];
  if (!node) {
    assert(
        false,
        data.type + ' not found in ' +
            JSON.stringify(Object.keys(state.choice)));
  }
  return node._encode(data.value, reporter);
};

Node.prototype._encodePrimitive = function encodePrimitive(tag, data) {
  var state = this._baseState;

  if (/str$/.test(tag))
    return this._encodeStr(data, tag);
  else if (tag === 'objid' && state.args)
    return this._encodeObjid(data, state.reverseArgs[0], state.args[1]);
  else if (tag === 'objid')
    return this._encodeObjid(data, null, null);
  else if (tag === 'gentime' || tag === 'utctime')
    return this._encodeTime(data, tag);
  else if (tag === 'null_')
    return this._encodeNull();
  else if (tag === 'int' || tag === 'enum')
    return this._encodeInt(data, state.args && state.reverseArgs[0]);
  else if (tag === 'bool')
    return this._encodeBool(data);
  else if (tag === 'objDesc')
    return this._encodeStr(data, tag);
  else
    throw new Error('Unsupported tag: ' + tag);
};

Node.prototype._isNumstr = function isNumstr(str) {
  return /^[0-9 ]*$/.test(str);
};

Node.prototype._isPrintstr = function isPrintstr(str) {
  return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(str);
};


/***/ }),

/***/ "hbMA":
/*!*******************************************************!*\
  !*** ./node_modules/asn1.js/lib/asn1/encoders/pem.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(/*! inherits */ "P7XM");

var DEREncoder = __webpack_require__(/*! ./der */ "N2jm");

function PEMEncoder(entity) {
  DEREncoder.call(this, entity);
  this.enc = 'pem';
};
inherits(PEMEncoder, DEREncoder);
module.exports = PEMEncoder;

PEMEncoder.prototype.encode = function encode(data, options) {
  var buf = DEREncoder.prototype.encode.call(this, data);

  var p = buf.toString('base64');
  var out = [ '-----BEGIN ' + options.label + '-----' ];
  for (var i = 0; i < p.length; i += 64)
    out.push(p.slice(i, i + 64));
  out.push('-----END ' + options.label + '-----');
  return out.join('\n');
};


/***/ }),

/***/ "i3FT":
/*!********************************************************!*\
  !*** ./node_modules/asn1.js/lib/asn1/constants/der.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var constants = __webpack_require__(/*! ../constants */ "AhHn");

exports.tagClass = {
  0: 'universal',
  1: 'application',
  2: 'context',
  3: 'private'
};
exports.tagClassByName = constants._reverse(exports.tagClass);

exports.tag = {
  0x00: 'end',
  0x01: 'bool',
  0x02: 'int',
  0x03: 'bitstr',
  0x04: 'octstr',
  0x05: 'null_',
  0x06: 'objid',
  0x07: 'objDesc',
  0x08: 'external',
  0x09: 'real',
  0x0a: 'enum',
  0x0b: 'embed',
  0x0c: 'utf8str',
  0x0d: 'relativeOid',
  0x10: 'seq',
  0x11: 'set',
  0x12: 'numstr',
  0x13: 'printstr',
  0x14: 't61str',
  0x15: 'videostr',
  0x16: 'ia5str',
  0x17: 'utctime',
  0x18: 'gentime',
  0x19: 'graphstr',
  0x1a: 'iso646str',
  0x1b: 'genstr',
  0x1c: 'unistr',
  0x1d: 'charstr',
  0x1e: 'bmpstr'
};
exports.tagByName = constants._reverse(exports.tag);


/***/ }),

/***/ "jfd1":
/*!*******************************************************!*\
  !*** ./node_modules/asn1.js/lib/asn1/decoders/pem.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(/*! inherits */ "P7XM");
var Buffer = __webpack_require__(/*! buffer */ "tjlA").Buffer;

var DERDecoder = __webpack_require__(/*! ./der */ "z71Z");

function PEMDecoder(entity) {
  DERDecoder.call(this, entity);
  this.enc = 'pem';
};
inherits(PEMDecoder, DERDecoder);
module.exports = PEMDecoder;

PEMDecoder.prototype.decode = function decode(data, options) {
  var lines = data.toString().split(/[\r\n]+/g);

  var label = options.label.toUpperCase();

  var re = /^-----(BEGIN|END) ([^-]+)-----$/;
  var start = -1;
  var end = -1;
  for (var i = 0; i < lines.length; i++) {
    var match = lines[i].match(re);
    if (match === null)
      continue;

    if (match[2] !== label)
      continue;

    if (start === -1) {
      if (match[1] !== 'BEGIN')
        break;
      start = i;
    } else {
      if (match[1] !== 'END')
        break;
      end = i;
      break;
    }
  }
  if (start === -1 || end === -1)
    throw new Error('PEM section not found for: ' + label);

  var base64 = lines.slice(start + 1, end).join('');
  // Remove excessive symbols
  base64.replace(/[^a-z0-9\+\/=]+/gi, '');

  var input = new Buffer(base64, 'base64');
  return DERDecoder.prototype.decode.call(this, input, options);
};


/***/ }),

/***/ "z71Z":
/*!*******************************************************!*\
  !*** ./node_modules/asn1.js/lib/asn1/decoders/der.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(/*! inherits */ "P7XM");

var asn1 = __webpack_require__(/*! ../../asn1 */ "f3pb");
var base = asn1.base;
var bignum = asn1.bignum;

// Import DER constants
var der = asn1.constants.der;

function DERDecoder(entity) {
  this.enc = 'der';
  this.name = entity.name;
  this.entity = entity;

  // Construct base tree
  this.tree = new DERNode();
  this.tree._init(entity.body);
};
module.exports = DERDecoder;

DERDecoder.prototype.decode = function decode(data, options) {
  if (!(data instanceof base.DecoderBuffer))
    data = new base.DecoderBuffer(data, options);

  return this.tree._decode(data, options);
};

// Tree methods

function DERNode(parent) {
  base.Node.call(this, 'der', parent);
}
inherits(DERNode, base.Node);

DERNode.prototype._peekTag = function peekTag(buffer, tag, any) {
  if (buffer.isEmpty())
    return false;

  var state = buffer.save();
  var decodedTag = derDecodeTag(buffer, 'Failed to peek tag: "' + tag + '"');
  if (buffer.isError(decodedTag))
    return decodedTag;

  buffer.restore(state);

  return decodedTag.tag === tag || decodedTag.tagStr === tag ||
    (decodedTag.tagStr + 'of') === tag || any;
};

DERNode.prototype._decodeTag = function decodeTag(buffer, tag, any) {
  var decodedTag = derDecodeTag(buffer,
                                'Failed to decode tag of "' + tag + '"');
  if (buffer.isError(decodedTag))
    return decodedTag;

  var len = derDecodeLen(buffer,
                         decodedTag.primitive,
                         'Failed to get length of "' + tag + '"');

  // Failure
  if (buffer.isError(len))
    return len;

  if (!any &&
      decodedTag.tag !== tag &&
      decodedTag.tagStr !== tag &&
      decodedTag.tagStr + 'of' !== tag) {
    return buffer.error('Failed to match tag: "' + tag + '"');
  }

  if (decodedTag.primitive || len !== null)
    return buffer.skip(len, 'Failed to match body of: "' + tag + '"');

  // Indefinite length... find END tag
  var state = buffer.save();
  var res = this._skipUntilEnd(
      buffer,
      'Failed to skip indefinite length body: "' + this.tag + '"');
  if (buffer.isError(res))
    return res;

  len = buffer.offset - state.offset;
  buffer.restore(state);
  return buffer.skip(len, 'Failed to match body of: "' + tag + '"');
};

DERNode.prototype._skipUntilEnd = function skipUntilEnd(buffer, fail) {
  while (true) {
    var tag = derDecodeTag(buffer, fail);
    if (buffer.isError(tag))
      return tag;
    var len = derDecodeLen(buffer, tag.primitive, fail);
    if (buffer.isError(len))
      return len;

    var res;
    if (tag.primitive || len !== null)
      res = buffer.skip(len)
    else
      res = this._skipUntilEnd(buffer, fail);

    // Failure
    if (buffer.isError(res))
      return res;

    if (tag.tagStr === 'end')
      break;
  }
};

DERNode.prototype._decodeList = function decodeList(buffer, tag, decoder,
                                                    options) {
  var result = [];
  while (!buffer.isEmpty()) {
    var possibleEnd = this._peekTag(buffer, 'end');
    if (buffer.isError(possibleEnd))
      return possibleEnd;

    var res = decoder.decode(buffer, 'der', options);
    if (buffer.isError(res) && possibleEnd)
      break;
    result.push(res);
  }
  return result;
};

DERNode.prototype._decodeStr = function decodeStr(buffer, tag) {
  if (tag === 'bitstr') {
    var unused = buffer.readUInt8();
    if (buffer.isError(unused))
      return unused;
    return { unused: unused, data: buffer.raw() };
  } else if (tag === 'bmpstr') {
    var raw = buffer.raw();
    if (raw.length % 2 === 1)
      return buffer.error('Decoding of string type: bmpstr length mismatch');

    var str = '';
    for (var i = 0; i < raw.length / 2; i++) {
      str += String.fromCharCode(raw.readUInt16BE(i * 2));
    }
    return str;
  } else if (tag === 'numstr') {
    var numstr = buffer.raw().toString('ascii');
    if (!this._isNumstr(numstr)) {
      return buffer.error('Decoding of string type: ' +
                          'numstr unsupported characters');
    }
    return numstr;
  } else if (tag === 'octstr') {
    return buffer.raw();
  } else if (tag === 'objDesc') {
    return buffer.raw();
  } else if (tag === 'printstr') {
    var printstr = buffer.raw().toString('ascii');
    if (!this._isPrintstr(printstr)) {
      return buffer.error('Decoding of string type: ' +
                          'printstr unsupported characters');
    }
    return printstr;
  } else if (/str$/.test(tag)) {
    return buffer.raw().toString();
  } else {
    return buffer.error('Decoding of string type: ' + tag + ' unsupported');
  }
};

DERNode.prototype._decodeObjid = function decodeObjid(buffer, values, relative) {
  var result;
  var identifiers = [];
  var ident = 0;
  while (!buffer.isEmpty()) {
    var subident = buffer.readUInt8();
    ident <<= 7;
    ident |= subident & 0x7f;
    if ((subident & 0x80) === 0) {
      identifiers.push(ident);
      ident = 0;
    }
  }
  if (subident & 0x80)
    identifiers.push(ident);

  var first = (identifiers[0] / 40) | 0;
  var second = identifiers[0] % 40;

  if (relative)
    result = identifiers;
  else
    result = [first, second].concat(identifiers.slice(1));

  if (values) {
    var tmp = values[result.join(' ')];
    if (tmp === undefined)
      tmp = values[result.join('.')];
    if (tmp !== undefined)
      result = tmp;
  }

  return result;
};

DERNode.prototype._decodeTime = function decodeTime(buffer, tag) {
  var str = buffer.raw().toString();
  if (tag === 'gentime') {
    var year = str.slice(0, 4) | 0;
    var mon = str.slice(4, 6) | 0;
    var day = str.slice(6, 8) | 0;
    var hour = str.slice(8, 10) | 0;
    var min = str.slice(10, 12) | 0;
    var sec = str.slice(12, 14) | 0;
  } else if (tag === 'utctime') {
    var year = str.slice(0, 2) | 0;
    var mon = str.slice(2, 4) | 0;
    var day = str.slice(4, 6) | 0;
    var hour = str.slice(6, 8) | 0;
    var min = str.slice(8, 10) | 0;
    var sec = str.slice(10, 12) | 0;
    if (year < 70)
      year = 2000 + year;
    else
      year = 1900 + year;
  } else {
    return buffer.error('Decoding ' + tag + ' time is not supported yet');
  }

  return Date.UTC(year, mon - 1, day, hour, min, sec, 0);
};

DERNode.prototype._decodeNull = function decodeNull(buffer) {
  return null;
};

DERNode.prototype._decodeBool = function decodeBool(buffer) {
  var res = buffer.readUInt8();
  if (buffer.isError(res))
    return res;
  else
    return res !== 0;
};

DERNode.prototype._decodeInt = function decodeInt(buffer, values) {
  // Bigint, return as it is (assume big endian)
  var raw = buffer.raw();
  var res = new bignum(raw);

  if (values)
    res = values[res.toString(10)] || res;

  return res;
};

DERNode.prototype._use = function use(entity, obj) {
  if (typeof entity === 'function')
    entity = entity(obj);
  return entity._getDecoder('der').tree;
};

// Utility methods

function derDecodeTag(buf, fail) {
  var tag = buf.readUInt8(fail);
  if (buf.isError(tag))
    return tag;

  var cls = der.tagClass[tag >> 6];
  var primitive = (tag & 0x20) === 0;

  // Multi-octet tag - load
  if ((tag & 0x1f) === 0x1f) {
    var oct = tag;
    tag = 0;
    while ((oct & 0x80) === 0x80) {
      oct = buf.readUInt8(fail);
      if (buf.isError(oct))
        return oct;

      tag <<= 7;
      tag |= oct & 0x7f;
    }
  } else {
    tag &= 0x1f;
  }
  var tagStr = der.tag[tag];

  return {
    cls: cls,
    primitive: primitive,
    tag: tag,
    tagStr: tagStr
  };
}

function derDecodeLen(buf, primitive, fail) {
  var len = buf.readUInt8(fail);
  if (buf.isError(len))
    return len;

  // Indefinite form
  if (!primitive && len === 0x80)
    return null;

  // Definite form
  if ((len & 0x80) === 0) {
    // Short form
    return len;
  }

  // Long form
  var num = len & 0x7f;
  if (num > 4)
    return buf.error('length octect is too long');

  len = 0;
  for (var i = 0; i < num; i++) {
    len <<= 8;
    var j = buf.readUInt8(fail);
    if (buf.isError(j))
      return j;
    len |= j;
  }

  return len;
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS5qcy9saWIvYXNuMS9iYXNlL3JlcG9ydGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2FwaS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS5qcy9saWIvYXNuMS9jb25zdGFudHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEvZGVjb2RlcnMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEvZW5jb2RlcnMvZGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2VuY29kZXJzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2Jhc2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEvYmFzZS9idWZmZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEvYmFzZS9ub2RlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2VuY29kZXJzL3BlbS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS5qcy9saWIvYXNuMS9jb25zdGFudHMvZGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2RlY29kZXJzL3BlbS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS5qcy9saWIvYXNuMS9kZWNvZGVycy9kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsZUFB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QUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCO0FBQ2hCO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUCxL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Q0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5hc24xLmpzLmJhMDBjMTBiYTI2Mjk5OThhMjcwLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZnVuY3Rpb24gUmVwb3J0ZXIob3B0aW9ucykge1xuICB0aGlzLl9yZXBvcnRlclN0YXRlID0ge1xuICAgIG9iajogbnVsbCxcbiAgICBwYXRoOiBbXSxcbiAgICBvcHRpb25zOiBvcHRpb25zIHx8IHt9LFxuICAgIGVycm9yczogW11cbiAgfTtcbn1cbmV4cG9ydHMuUmVwb3J0ZXIgPSBSZXBvcnRlcjtcblxuUmVwb3J0ZXIucHJvdG90eXBlLmlzRXJyb3IgPSBmdW5jdGlvbiBpc0Vycm9yKG9iaikge1xuICByZXR1cm4gb2JqIGluc3RhbmNlb2YgUmVwb3J0ZXJFcnJvcjtcbn07XG5cblJlcG9ydGVyLnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24gc2F2ZSgpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVwb3J0ZXJTdGF0ZTtcblxuICByZXR1cm4geyBvYmo6IHN0YXRlLm9iaiwgcGF0aExlbjogc3RhdGUucGF0aC5sZW5ndGggfTtcbn07XG5cblJlcG9ydGVyLnByb3RvdHlwZS5yZXN0b3JlID0gZnVuY3Rpb24gcmVzdG9yZShkYXRhKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlcG9ydGVyU3RhdGU7XG5cbiAgc3RhdGUub2JqID0gZGF0YS5vYmo7XG4gIHN0YXRlLnBhdGggPSBzdGF0ZS5wYXRoLnNsaWNlKDAsIGRhdGEucGF0aExlbik7XG59O1xuXG5SZXBvcnRlci5wcm90b3R5cGUuZW50ZXJLZXkgPSBmdW5jdGlvbiBlbnRlcktleShrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX3JlcG9ydGVyU3RhdGUucGF0aC5wdXNoKGtleSk7XG59O1xuXG5SZXBvcnRlci5wcm90b3R5cGUuZXhpdEtleSA9IGZ1bmN0aW9uIGV4aXRLZXkoaW5kZXgpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVwb3J0ZXJTdGF0ZTtcblxuICBzdGF0ZS5wYXRoID0gc3RhdGUucGF0aC5zbGljZSgwLCBpbmRleCAtIDEpO1xufTtcblxuUmVwb3J0ZXIucHJvdG90eXBlLmxlYXZlS2V5ID0gZnVuY3Rpb24gbGVhdmVLZXkoaW5kZXgsIGtleSwgdmFsdWUpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVwb3J0ZXJTdGF0ZTtcblxuICB0aGlzLmV4aXRLZXkoaW5kZXgpO1xuICBpZiAoc3RhdGUub2JqICE9PSBudWxsKVxuICAgIHN0YXRlLm9ialtrZXldID0gdmFsdWU7XG59O1xuXG5SZXBvcnRlci5wcm90b3R5cGUucGF0aCA9IGZ1bmN0aW9uIHBhdGgoKSB7XG4gIHJldHVybiB0aGlzLl9yZXBvcnRlclN0YXRlLnBhdGguam9pbignLycpO1xufTtcblxuUmVwb3J0ZXIucHJvdG90eXBlLmVudGVyT2JqZWN0ID0gZnVuY3Rpb24gZW50ZXJPYmplY3QoKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlcG9ydGVyU3RhdGU7XG5cbiAgdmFyIHByZXYgPSBzdGF0ZS5vYmo7XG4gIHN0YXRlLm9iaiA9IHt9O1xuICByZXR1cm4gcHJldjtcbn07XG5cblJlcG9ydGVyLnByb3RvdHlwZS5sZWF2ZU9iamVjdCA9IGZ1bmN0aW9uIGxlYXZlT2JqZWN0KHByZXYpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVwb3J0ZXJTdGF0ZTtcblxuICB2YXIgbm93ID0gc3RhdGUub2JqO1xuICBzdGF0ZS5vYmogPSBwcmV2O1xuICByZXR1cm4gbm93O1xufTtcblxuUmVwb3J0ZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gZXJyb3IobXNnKSB7XG4gIHZhciBlcnI7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlcG9ydGVyU3RhdGU7XG5cbiAgdmFyIGluaGVyaXRlZCA9IG1zZyBpbnN0YW5jZW9mIFJlcG9ydGVyRXJyb3I7XG4gIGlmIChpbmhlcml0ZWQpIHtcbiAgICBlcnIgPSBtc2c7XG4gIH0gZWxzZSB7XG4gICAgZXJyID0gbmV3IFJlcG9ydGVyRXJyb3Ioc3RhdGUucGF0aC5tYXAoZnVuY3Rpb24oZWxlbSkge1xuICAgICAgcmV0dXJuICdbJyArIEpTT04uc3RyaW5naWZ5KGVsZW0pICsgJ10nO1xuICAgIH0pLmpvaW4oJycpLCBtc2cubWVzc2FnZSB8fCBtc2csIG1zZy5zdGFjayk7XG4gIH1cblxuICBpZiAoIXN0YXRlLm9wdGlvbnMucGFydGlhbClcbiAgICB0aHJvdyBlcnI7XG5cbiAgaWYgKCFpbmhlcml0ZWQpXG4gICAgc3RhdGUuZXJyb3JzLnB1c2goZXJyKTtcblxuICByZXR1cm4gZXJyO1xufTtcblxuUmVwb3J0ZXIucHJvdG90eXBlLndyYXBSZXN1bHQgPSBmdW5jdGlvbiB3cmFwUmVzdWx0KHJlc3VsdCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZXBvcnRlclN0YXRlO1xuICBpZiAoIXN0YXRlLm9wdGlvbnMucGFydGlhbClcbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIHJldHVybiB7XG4gICAgcmVzdWx0OiB0aGlzLmlzRXJyb3IocmVzdWx0KSA/IG51bGwgOiByZXN1bHQsXG4gICAgZXJyb3JzOiBzdGF0ZS5lcnJvcnNcbiAgfTtcbn07XG5cbmZ1bmN0aW9uIFJlcG9ydGVyRXJyb3IocGF0aCwgbXNnKSB7XG4gIHRoaXMucGF0aCA9IHBhdGg7XG4gIHRoaXMucmV0aHJvdyhtc2cpO1xufTtcbmluaGVyaXRzKFJlcG9ydGVyRXJyb3IsIEVycm9yKTtcblxuUmVwb3J0ZXJFcnJvci5wcm90b3R5cGUucmV0aHJvdyA9IGZ1bmN0aW9uIHJldGhyb3cobXNnKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1zZyArICcgYXQ6ICcgKyAodGhpcy5wYXRoIHx8ICcoc2hhbGxvdyknKTtcbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIFJlcG9ydGVyRXJyb3IpO1xuXG4gIGlmICghdGhpcy5zdGFjaykge1xuICAgIHRyeSB7XG4gICAgICAvLyBJRSBvbmx5IGFkZHMgc3RhY2sgd2hlbiB0aHJvd25cbiAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLm1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuc3RhY2sgPSBlLnN0YWNrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG4iLCJ2YXIgYXNuMSA9IHJlcXVpcmUoJy4uL2FzbjEnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBhcGkgPSBleHBvcnRzO1xuXG5hcGkuZGVmaW5lID0gZnVuY3Rpb24gZGVmaW5lKG5hbWUsIGJvZHkpIHtcbiAgcmV0dXJuIG5ldyBFbnRpdHkobmFtZSwgYm9keSk7XG59O1xuXG5mdW5jdGlvbiBFbnRpdHkobmFtZSwgYm9keSkge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmJvZHkgPSBib2R5O1xuXG4gIHRoaXMuZGVjb2RlcnMgPSB7fTtcbiAgdGhpcy5lbmNvZGVycyA9IHt9O1xufTtcblxuRW50aXR5LnByb3RvdHlwZS5fY3JlYXRlTmFtZWQgPSBmdW5jdGlvbiBjcmVhdGVOYW1lZChiYXNlKSB7XG4gIHZhciBuYW1lZDtcbiAgdHJ5IHtcbiAgICBuYW1lZCA9IHJlcXVpcmUoJ3ZtJykucnVuSW5UaGlzQ29udGV4dChcbiAgICAgICcoZnVuY3Rpb24gJyArIHRoaXMubmFtZSArICcoZW50aXR5KSB7XFxuJyArXG4gICAgICAnICB0aGlzLl9pbml0TmFtZWQoZW50aXR5KTtcXG4nICtcbiAgICAgICd9KSdcbiAgICApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgbmFtZWQgPSBmdW5jdGlvbiAoZW50aXR5KSB7XG4gICAgICB0aGlzLl9pbml0TmFtZWQoZW50aXR5KTtcbiAgICB9O1xuICB9XG4gIGluaGVyaXRzKG5hbWVkLCBiYXNlKTtcbiAgbmFtZWQucHJvdG90eXBlLl9pbml0TmFtZWQgPSBmdW5jdGlvbiBpbml0bmFtZWQoZW50aXR5KSB7XG4gICAgYmFzZS5jYWxsKHRoaXMsIGVudGl0eSk7XG4gIH07XG5cbiAgcmV0dXJuIG5ldyBuYW1lZCh0aGlzKTtcbn07XG5cbkVudGl0eS5wcm90b3R5cGUuX2dldERlY29kZXIgPSBmdW5jdGlvbiBfZ2V0RGVjb2RlcihlbmMpIHtcbiAgZW5jID0gZW5jIHx8ICdkZXInO1xuICAvLyBMYXppbHkgY3JlYXRlIGRlY29kZXJcbiAgaWYgKCF0aGlzLmRlY29kZXJzLmhhc093blByb3BlcnR5KGVuYykpXG4gICAgdGhpcy5kZWNvZGVyc1tlbmNdID0gdGhpcy5fY3JlYXRlTmFtZWQoYXNuMS5kZWNvZGVyc1tlbmNdKTtcbiAgcmV0dXJuIHRoaXMuZGVjb2RlcnNbZW5jXTtcbn07XG5cbkVudGl0eS5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24gZGVjb2RlKGRhdGEsIGVuYywgb3B0aW9ucykge1xuICByZXR1cm4gdGhpcy5fZ2V0RGVjb2RlcihlbmMpLmRlY29kZShkYXRhLCBvcHRpb25zKTtcbn07XG5cbkVudGl0eS5wcm90b3R5cGUuX2dldEVuY29kZXIgPSBmdW5jdGlvbiBfZ2V0RW5jb2RlcihlbmMpIHtcbiAgZW5jID0gZW5jIHx8ICdkZXInO1xuICAvLyBMYXppbHkgY3JlYXRlIGVuY29kZXJcbiAgaWYgKCF0aGlzLmVuY29kZXJzLmhhc093blByb3BlcnR5KGVuYykpXG4gICAgdGhpcy5lbmNvZGVyc1tlbmNdID0gdGhpcy5fY3JlYXRlTmFtZWQoYXNuMS5lbmNvZGVyc1tlbmNdKTtcbiAgcmV0dXJuIHRoaXMuZW5jb2RlcnNbZW5jXTtcbn07XG5cbkVudGl0eS5wcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24gZW5jb2RlKGRhdGEsIGVuYywgLyogaW50ZXJuYWwgKi8gcmVwb3J0ZXIpIHtcbiAgcmV0dXJuIHRoaXMuX2dldEVuY29kZXIoZW5jKS5lbmNvZGUoZGF0YSwgcmVwb3J0ZXIpO1xufTtcbiIsInZhciBjb25zdGFudHMgPSBleHBvcnRzO1xuXG4vLyBIZWxwZXJcbmNvbnN0YW50cy5fcmV2ZXJzZSA9IGZ1bmN0aW9uIHJldmVyc2UobWFwKSB7XG4gIHZhciByZXMgPSB7fTtcblxuICBPYmplY3Qua2V5cyhtYXApLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgLy8gQ29udmVydCBrZXkgdG8gaW50ZWdlciBpZiBpdCBpcyBzdHJpbmdpZmllZFxuICAgIGlmICgoa2V5IHwgMCkgPT0ga2V5KVxuICAgICAga2V5ID0ga2V5IHwgMDtcblxuICAgIHZhciB2YWx1ZSA9IG1hcFtrZXldO1xuICAgIHJlc1t2YWx1ZV0gPSBrZXk7XG4gIH0pO1xuXG4gIHJldHVybiByZXM7XG59O1xuXG5jb25zdGFudHMuZGVyID0gcmVxdWlyZSgnLi9kZXInKTtcbiIsInZhciBkZWNvZGVycyA9IGV4cG9ydHM7XG5cbmRlY29kZXJzLmRlciA9IHJlcXVpcmUoJy4vZGVyJyk7XG5kZWNvZGVycy5wZW0gPSByZXF1aXJlKCcuL3BlbScpO1xuIiwidmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG5cbnZhciBhc24xID0gcmVxdWlyZSgnLi4vLi4vYXNuMScpO1xudmFyIGJhc2UgPSBhc24xLmJhc2U7XG5cbi8vIEltcG9ydCBERVIgY29uc3RhbnRzXG52YXIgZGVyID0gYXNuMS5jb25zdGFudHMuZGVyO1xuXG5mdW5jdGlvbiBERVJFbmNvZGVyKGVudGl0eSkge1xuICB0aGlzLmVuYyA9ICdkZXInO1xuICB0aGlzLm5hbWUgPSBlbnRpdHkubmFtZTtcbiAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG5cbiAgLy8gQ29uc3RydWN0IGJhc2UgdHJlZVxuICB0aGlzLnRyZWUgPSBuZXcgREVSTm9kZSgpO1xuICB0aGlzLnRyZWUuX2luaXQoZW50aXR5LmJvZHkpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gREVSRW5jb2RlcjtcblxuREVSRW5jb2Rlci5wcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24gZW5jb2RlKGRhdGEsIHJlcG9ydGVyKSB7XG4gIHJldHVybiB0aGlzLnRyZWUuX2VuY29kZShkYXRhLCByZXBvcnRlcikuam9pbigpO1xufTtcblxuLy8gVHJlZSBtZXRob2RzXG5cbmZ1bmN0aW9uIERFUk5vZGUocGFyZW50KSB7XG4gIGJhc2UuTm9kZS5jYWxsKHRoaXMsICdkZXInLCBwYXJlbnQpO1xufVxuaW5oZXJpdHMoREVSTm9kZSwgYmFzZS5Ob2RlKTtcblxuREVSTm9kZS5wcm90b3R5cGUuX2VuY29kZUNvbXBvc2l0ZSA9IGZ1bmN0aW9uIGVuY29kZUNvbXBvc2l0ZSh0YWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW1pdGl2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50KSB7XG4gIHZhciBlbmNvZGVkVGFnID0gZW5jb2RlVGFnKHRhZywgcHJpbWl0aXZlLCBjbHMsIHRoaXMucmVwb3J0ZXIpO1xuXG4gIC8vIFNob3J0IGZvcm1cbiAgaWYgKGNvbnRlbnQubGVuZ3RoIDwgMHg4MCkge1xuICAgIHZhciBoZWFkZXIgPSBuZXcgQnVmZmVyKDIpO1xuICAgIGhlYWRlclswXSA9IGVuY29kZWRUYWc7XG4gICAgaGVhZGVyWzFdID0gY29udGVudC5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIoWyBoZWFkZXIsIGNvbnRlbnQgXSk7XG4gIH1cblxuICAvLyBMb25nIGZvcm1cbiAgLy8gQ291bnQgb2N0ZXRzIHJlcXVpcmVkIHRvIHN0b3JlIGxlbmd0aFxuICB2YXIgbGVuT2N0ZXRzID0gMTtcbiAgZm9yICh2YXIgaSA9IGNvbnRlbnQubGVuZ3RoOyBpID49IDB4MTAwOyBpID4+PSA4KVxuICAgIGxlbk9jdGV0cysrO1xuXG4gIHZhciBoZWFkZXIgPSBuZXcgQnVmZmVyKDEgKyAxICsgbGVuT2N0ZXRzKTtcbiAgaGVhZGVyWzBdID0gZW5jb2RlZFRhZztcbiAgaGVhZGVyWzFdID0gMHg4MCB8IGxlbk9jdGV0cztcblxuICBmb3IgKHZhciBpID0gMSArIGxlbk9jdGV0cywgaiA9IGNvbnRlbnQubGVuZ3RoOyBqID4gMDsgaS0tLCBqID4+PSA4KVxuICAgIGhlYWRlcltpXSA9IGogJiAweGZmO1xuXG4gIHJldHVybiB0aGlzLl9jcmVhdGVFbmNvZGVyQnVmZmVyKFsgaGVhZGVyLCBjb250ZW50IF0pO1xufTtcblxuREVSTm9kZS5wcm90b3R5cGUuX2VuY29kZVN0ciA9IGZ1bmN0aW9uIGVuY29kZVN0cihzdHIsIHRhZykge1xuICBpZiAodGFnID09PSAnYml0c3RyJykge1xuICAgIHJldHVybiB0aGlzLl9jcmVhdGVFbmNvZGVyQnVmZmVyKFsgc3RyLnVudXNlZCB8IDAsIHN0ci5kYXRhIF0pO1xuICB9IGVsc2UgaWYgKHRhZyA9PT0gJ2JtcHN0cicpIHtcbiAgICB2YXIgYnVmID0gbmV3IEJ1ZmZlcihzdHIubGVuZ3RoICogMik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1Zi53cml0ZVVJbnQxNkJFKHN0ci5jaGFyQ29kZUF0KGkpLCBpICogMik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVFbmNvZGVyQnVmZmVyKGJ1Zik7XG4gIH0gZWxzZSBpZiAodGFnID09PSAnbnVtc3RyJykge1xuICAgIGlmICghdGhpcy5faXNOdW1zdHIoc3RyKSkge1xuICAgICAgcmV0dXJuIHRoaXMucmVwb3J0ZXIuZXJyb3IoJ0VuY29kaW5nIG9mIHN0cmluZyB0eXBlOiBudW1zdHIgc3VwcG9ydHMgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb25seSBkaWdpdHMgYW5kIHNwYWNlJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVFbmNvZGVyQnVmZmVyKHN0cik7XG4gIH0gZWxzZSBpZiAodGFnID09PSAncHJpbnRzdHInKSB7XG4gICAgaWYgKCF0aGlzLl9pc1ByaW50c3RyKHN0cikpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlcG9ydGVyLmVycm9yKCdFbmNvZGluZyBvZiBzdHJpbmcgdHlwZTogcHJpbnRzdHIgc3VwcG9ydHMgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb25seSBsYXRpbiB1cHBlciBhbmQgbG93ZXIgY2FzZSBsZXR0ZXJzLCAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkaWdpdHMsIHNwYWNlLCBhcG9zdHJvcGhlLCBsZWZ0IGFuZCByaWd0aCAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwYXJlbnRoZXNpcywgcGx1cyBzaWduLCBjb21tYSwgaHlwaGVuLCAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkb3QsIHNsYXNoLCBjb2xvbiwgZXF1YWwgc2lnbiwgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncXVlc3Rpb24gbWFyaycpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihzdHIpO1xuICB9IGVsc2UgaWYgKC9zdHIkLy50ZXN0KHRhZykpIHtcbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihzdHIpO1xuICB9IGVsc2UgaWYgKHRhZyA9PT0gJ29iakRlc2MnKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIoc3RyKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5yZXBvcnRlci5lcnJvcignRW5jb2Rpbmcgb2Ygc3RyaW5nIHR5cGU6ICcgKyB0YWcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgdW5zdXBwb3J0ZWQnKTtcbiAgfVxufTtcblxuREVSTm9kZS5wcm90b3R5cGUuX2VuY29kZU9iamlkID0gZnVuY3Rpb24gZW5jb2RlT2JqaWQoaWQsIHZhbHVlcywgcmVsYXRpdmUpIHtcbiAgaWYgKHR5cGVvZiBpZCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAoIXZhbHVlcylcbiAgICAgIHJldHVybiB0aGlzLnJlcG9ydGVyLmVycm9yKCdzdHJpbmcgb2JqaWQgZ2l2ZW4sIGJ1dCBubyB2YWx1ZXMgbWFwIGZvdW5kJyk7XG4gICAgaWYgKCF2YWx1ZXMuaGFzT3duUHJvcGVydHkoaWQpKVxuICAgICAgcmV0dXJuIHRoaXMucmVwb3J0ZXIuZXJyb3IoJ29iamlkIG5vdCBmb3VuZCBpbiB2YWx1ZXMgbWFwJyk7XG4gICAgaWQgPSB2YWx1ZXNbaWRdLnNwbGl0KC9bXFxzXFwuXSsvZyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpZC5sZW5ndGg7IGkrKylcbiAgICAgIGlkW2ldIHw9IDA7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShpZCkpIHtcbiAgICBpZCA9IGlkLnNsaWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpZC5sZW5ndGg7IGkrKylcbiAgICAgIGlkW2ldIHw9IDA7XG4gIH1cblxuICBpZiAoIUFycmF5LmlzQXJyYXkoaWQpKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwb3J0ZXIuZXJyb3IoJ29iamlkKCkgc2hvdWxkIGJlIGVpdGhlciBhcnJheSBvciBzdHJpbmcsICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdnb3Q6ICcgKyBKU09OLnN0cmluZ2lmeShpZCkpO1xuICB9XG5cbiAgaWYgKCFyZWxhdGl2ZSkge1xuICAgIGlmIChpZFsxXSA+PSA0MClcbiAgICAgIHJldHVybiB0aGlzLnJlcG9ydGVyLmVycm9yKCdTZWNvbmQgb2JqaWQgaWRlbnRpZmllciBPT0InKTtcbiAgICBpZC5zcGxpY2UoMCwgMiwgaWRbMF0gKiA0MCArIGlkWzFdKTtcbiAgfVxuXG4gIC8vIENvdW50IG51bWJlciBvZiBvY3RldHNcbiAgdmFyIHNpemUgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGlkLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkZW50ID0gaWRbaV07XG4gICAgZm9yIChzaXplKys7IGlkZW50ID49IDB4ODA7IGlkZW50ID4+PSA3KVxuICAgICAgc2l6ZSsrO1xuICB9XG5cbiAgdmFyIG9iamlkID0gbmV3IEJ1ZmZlcihzaXplKTtcbiAgdmFyIG9mZnNldCA9IG9iamlkLmxlbmd0aCAtIDE7XG4gIGZvciAodmFyIGkgPSBpZC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBpZGVudCA9IGlkW2ldO1xuICAgIG9iamlkW29mZnNldC0tXSA9IGlkZW50ICYgMHg3ZjtcbiAgICB3aGlsZSAoKGlkZW50ID4+PSA3KSA+IDApXG4gICAgICBvYmppZFtvZmZzZXQtLV0gPSAweDgwIHwgKGlkZW50ICYgMHg3Zik7XG4gIH1cblxuICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihvYmppZCk7XG59O1xuXG5mdW5jdGlvbiB0d28obnVtKSB7XG4gIGlmIChudW0gPCAxMClcbiAgICByZXR1cm4gJzAnICsgbnVtO1xuICBlbHNlXG4gICAgcmV0dXJuIG51bTtcbn1cblxuREVSTm9kZS5wcm90b3R5cGUuX2VuY29kZVRpbWUgPSBmdW5jdGlvbiBlbmNvZGVUaW1lKHRpbWUsIHRhZykge1xuICB2YXIgc3RyO1xuICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHRpbWUpO1xuXG4gIGlmICh0YWcgPT09ICdnZW50aW1lJykge1xuICAgIHN0ciA9IFtcbiAgICAgIHR3byhkYXRlLmdldEZ1bGxZZWFyKCkpLFxuICAgICAgdHdvKGRhdGUuZ2V0VVRDTW9udGgoKSArIDEpLFxuICAgICAgdHdvKGRhdGUuZ2V0VVRDRGF0ZSgpKSxcbiAgICAgIHR3byhkYXRlLmdldFVUQ0hvdXJzKCkpLFxuICAgICAgdHdvKGRhdGUuZ2V0VVRDTWludXRlcygpKSxcbiAgICAgIHR3byhkYXRlLmdldFVUQ1NlY29uZHMoKSksXG4gICAgICAnWidcbiAgICBdLmpvaW4oJycpO1xuICB9IGVsc2UgaWYgKHRhZyA9PT0gJ3V0Y3RpbWUnKSB7XG4gICAgc3RyID0gW1xuICAgICAgdHdvKGRhdGUuZ2V0RnVsbFllYXIoKSAlIDEwMCksXG4gICAgICB0d28oZGF0ZS5nZXRVVENNb250aCgpICsgMSksXG4gICAgICB0d28oZGF0ZS5nZXRVVENEYXRlKCkpLFxuICAgICAgdHdvKGRhdGUuZ2V0VVRDSG91cnMoKSksXG4gICAgICB0d28oZGF0ZS5nZXRVVENNaW51dGVzKCkpLFxuICAgICAgdHdvKGRhdGUuZ2V0VVRDU2Vjb25kcygpKSxcbiAgICAgICdaJ1xuICAgIF0uam9pbignJyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5yZXBvcnRlci5lcnJvcignRW5jb2RpbmcgJyArIHRhZyArICcgdGltZSBpcyBub3Qgc3VwcG9ydGVkIHlldCcpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuX2VuY29kZVN0cihzdHIsICdvY3RzdHInKTtcbn07XG5cbkRFUk5vZGUucHJvdG90eXBlLl9lbmNvZGVOdWxsID0gZnVuY3Rpb24gZW5jb2RlTnVsbCgpIHtcbiAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIoJycpO1xufTtcblxuREVSTm9kZS5wcm90b3R5cGUuX2VuY29kZUludCA9IGZ1bmN0aW9uIGVuY29kZUludChudW0sIHZhbHVlcykge1xuICBpZiAodHlwZW9mIG51bSA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAoIXZhbHVlcylcbiAgICAgIHJldHVybiB0aGlzLnJlcG9ydGVyLmVycm9yKCdTdHJpbmcgaW50IG9yIGVudW0gZ2l2ZW4sIGJ1dCBubyB2YWx1ZXMgbWFwJyk7XG4gICAgaWYgKCF2YWx1ZXMuaGFzT3duUHJvcGVydHkobnVtKSkge1xuICAgICAgcmV0dXJuIHRoaXMucmVwb3J0ZXIuZXJyb3IoJ1ZhbHVlcyBtYXAgZG9lc25cXCd0IGNvbnRhaW46ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkobnVtKSk7XG4gICAgfVxuICAgIG51bSA9IHZhbHVlc1tudW1dO1xuICB9XG5cbiAgLy8gQmlnbnVtLCBhc3N1bWUgYmlnIGVuZGlhblxuICBpZiAodHlwZW9mIG51bSAhPT0gJ251bWJlcicgJiYgIUJ1ZmZlci5pc0J1ZmZlcihudW0pKSB7XG4gICAgdmFyIG51bUFycmF5ID0gbnVtLnRvQXJyYXkoKTtcbiAgICBpZiAoIW51bS5zaWduICYmIG51bUFycmF5WzBdICYgMHg4MCkge1xuICAgICAgbnVtQXJyYXkudW5zaGlmdCgwKTtcbiAgICB9XG4gICAgbnVtID0gbmV3IEJ1ZmZlcihudW1BcnJheSk7XG4gIH1cblxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG51bSkpIHtcbiAgICB2YXIgc2l6ZSA9IG51bS5sZW5ndGg7XG4gICAgaWYgKG51bS5sZW5ndGggPT09IDApXG4gICAgICBzaXplKys7XG5cbiAgICB2YXIgb3V0ID0gbmV3IEJ1ZmZlcihzaXplKTtcbiAgICBudW0uY29weShvdXQpO1xuICAgIGlmIChudW0ubGVuZ3RoID09PSAwKVxuICAgICAgb3V0WzBdID0gMFxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVFbmNvZGVyQnVmZmVyKG91dCk7XG4gIH1cblxuICBpZiAobnVtIDwgMHg4MClcbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihudW0pO1xuXG4gIGlmIChudW0gPCAweDEwMClcbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihbMCwgbnVtXSk7XG5cbiAgdmFyIHNpemUgPSAxO1xuICBmb3IgKHZhciBpID0gbnVtOyBpID49IDB4MTAwOyBpID4+PSA4KVxuICAgIHNpemUrKztcblxuICB2YXIgb3V0ID0gbmV3IEFycmF5KHNpemUpO1xuICBmb3IgKHZhciBpID0gb3V0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgb3V0W2ldID0gbnVtICYgMHhmZjtcbiAgICBudW0gPj49IDg7XG4gIH1cbiAgaWYob3V0WzBdICYgMHg4MCkge1xuICAgIG91dC51bnNoaWZ0KDApO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIobmV3IEJ1ZmZlcihvdXQpKTtcbn07XG5cbkRFUk5vZGUucHJvdG90eXBlLl9lbmNvZGVCb29sID0gZnVuY3Rpb24gZW5jb2RlQm9vbCh2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcih2YWx1ZSA/IDB4ZmYgOiAwKTtcbn07XG5cbkRFUk5vZGUucHJvdG90eXBlLl91c2UgPSBmdW5jdGlvbiB1c2UoZW50aXR5LCBvYmopIHtcbiAgaWYgKHR5cGVvZiBlbnRpdHkgPT09ICdmdW5jdGlvbicpXG4gICAgZW50aXR5ID0gZW50aXR5KG9iaik7XG4gIHJldHVybiBlbnRpdHkuX2dldEVuY29kZXIoJ2RlcicpLnRyZWU7XG59O1xuXG5ERVJOb2RlLnByb3RvdHlwZS5fc2tpcERlZmF1bHQgPSBmdW5jdGlvbiBza2lwRGVmYXVsdChkYXRhQnVmZmVyLCByZXBvcnRlciwgcGFyZW50KSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcbiAgdmFyIGk7XG4gIGlmIChzdGF0ZVsnZGVmYXVsdCddID09PSBudWxsKVxuICAgIHJldHVybiBmYWxzZTtcblxuICB2YXIgZGF0YSA9IGRhdGFCdWZmZXIuam9pbigpO1xuICBpZiAoc3RhdGUuZGVmYXVsdEJ1ZmZlciA9PT0gdW5kZWZpbmVkKVxuICAgIHN0YXRlLmRlZmF1bHRCdWZmZXIgPSB0aGlzLl9lbmNvZGVWYWx1ZShzdGF0ZVsnZGVmYXVsdCddLCByZXBvcnRlciwgcGFyZW50KS5qb2luKCk7XG5cbiAgaWYgKGRhdGEubGVuZ3RoICE9PSBzdGF0ZS5kZWZhdWx0QnVmZmVyLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgZm9yIChpPTA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKVxuICAgIGlmIChkYXRhW2ldICE9PSBzdGF0ZS5kZWZhdWx0QnVmZmVyW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gVXRpbGl0eSBtZXRob2RzXG5cbmZ1bmN0aW9uIGVuY29kZVRhZyh0YWcsIHByaW1pdGl2ZSwgY2xzLCByZXBvcnRlcikge1xuICB2YXIgcmVzO1xuXG4gIGlmICh0YWcgPT09ICdzZXFvZicpXG4gICAgdGFnID0gJ3NlcSc7XG4gIGVsc2UgaWYgKHRhZyA9PT0gJ3NldG9mJylcbiAgICB0YWcgPSAnc2V0JztcblxuICBpZiAoZGVyLnRhZ0J5TmFtZS5oYXNPd25Qcm9wZXJ0eSh0YWcpKVxuICAgIHJlcyA9IGRlci50YWdCeU5hbWVbdGFnXTtcbiAgZWxzZSBpZiAodHlwZW9mIHRhZyA9PT0gJ251bWJlcicgJiYgKHRhZyB8IDApID09PSB0YWcpXG4gICAgcmVzID0gdGFnO1xuICBlbHNlXG4gICAgcmV0dXJuIHJlcG9ydGVyLmVycm9yKCdVbmtub3duIHRhZzogJyArIHRhZyk7XG5cbiAgaWYgKHJlcyA+PSAweDFmKVxuICAgIHJldHVybiByZXBvcnRlci5lcnJvcignTXVsdGktb2N0ZXQgdGFnIGVuY29kaW5nIHVuc3VwcG9ydGVkJyk7XG5cbiAgaWYgKCFwcmltaXRpdmUpXG4gICAgcmVzIHw9IDB4MjA7XG5cbiAgcmVzIHw9IChkZXIudGFnQ2xhc3NCeU5hbWVbY2xzIHx8ICd1bml2ZXJzYWwnXSA8PCA2KTtcblxuICByZXR1cm4gcmVzO1xufVxuIiwidmFyIGVuY29kZXJzID0gZXhwb3J0cztcblxuZW5jb2RlcnMuZGVyID0gcmVxdWlyZSgnLi9kZXInKTtcbmVuY29kZXJzLnBlbSA9IHJlcXVpcmUoJy4vcGVtJyk7XG4iLCJ2YXIgYmFzZSA9IGV4cG9ydHM7XG5cbmJhc2UuUmVwb3J0ZXIgPSByZXF1aXJlKCcuL3JlcG9ydGVyJykuUmVwb3J0ZXI7XG5iYXNlLkRlY29kZXJCdWZmZXIgPSByZXF1aXJlKCcuL2J1ZmZlcicpLkRlY29kZXJCdWZmZXI7XG5iYXNlLkVuY29kZXJCdWZmZXIgPSByZXF1aXJlKCcuL2J1ZmZlcicpLkVuY29kZXJCdWZmZXI7XG5iYXNlLk5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcbiIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgUmVwb3J0ZXIgPSByZXF1aXJlKCcuLi9iYXNlJykuUmVwb3J0ZXI7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuXG5mdW5jdGlvbiBEZWNvZGVyQnVmZmVyKGJhc2UsIG9wdGlvbnMpIHtcbiAgUmVwb3J0ZXIuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYmFzZSkpIHtcbiAgICB0aGlzLmVycm9yKCdJbnB1dCBub3QgQnVmZmVyJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5iYXNlID0gYmFzZTtcbiAgdGhpcy5vZmZzZXQgPSAwO1xuICB0aGlzLmxlbmd0aCA9IGJhc2UubGVuZ3RoO1xufVxuaW5oZXJpdHMoRGVjb2RlckJ1ZmZlciwgUmVwb3J0ZXIpO1xuZXhwb3J0cy5EZWNvZGVyQnVmZmVyID0gRGVjb2RlckJ1ZmZlcjtcblxuRGVjb2RlckJ1ZmZlci5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uIHNhdmUoKSB7XG4gIHJldHVybiB7IG9mZnNldDogdGhpcy5vZmZzZXQsIHJlcG9ydGVyOiBSZXBvcnRlci5wcm90b3R5cGUuc2F2ZS5jYWxsKHRoaXMpIH07XG59O1xuXG5EZWNvZGVyQnVmZmVyLnByb3RvdHlwZS5yZXN0b3JlID0gZnVuY3Rpb24gcmVzdG9yZShzYXZlKSB7XG4gIC8vIFJldHVybiBza2lwcGVkIGRhdGFcbiAgdmFyIHJlcyA9IG5ldyBEZWNvZGVyQnVmZmVyKHRoaXMuYmFzZSk7XG4gIHJlcy5vZmZzZXQgPSBzYXZlLm9mZnNldDtcbiAgcmVzLmxlbmd0aCA9IHRoaXMub2Zmc2V0O1xuXG4gIHRoaXMub2Zmc2V0ID0gc2F2ZS5vZmZzZXQ7XG4gIFJlcG9ydGVyLnByb3RvdHlwZS5yZXN0b3JlLmNhbGwodGhpcywgc2F2ZS5yZXBvcnRlcik7XG5cbiAgcmV0dXJuIHJlcztcbn07XG5cbkRlY29kZXJCdWZmZXIucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiBpc0VtcHR5KCkge1xuICByZXR1cm4gdGhpcy5vZmZzZXQgPT09IHRoaXMubGVuZ3RoO1xufTtcblxuRGVjb2RlckJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4KGZhaWwpIHtcbiAgaWYgKHRoaXMub2Zmc2V0ICsgMSA8PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm4gdGhpcy5iYXNlLnJlYWRVSW50OCh0aGlzLm9mZnNldCsrLCB0cnVlKTtcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzLmVycm9yKGZhaWwgfHwgJ0RlY29kZXJCdWZmZXIgb3ZlcnJ1bicpO1xufVxuXG5EZWNvZGVyQnVmZmVyLnByb3RvdHlwZS5za2lwID0gZnVuY3Rpb24gc2tpcChieXRlcywgZmFpbCkge1xuICBpZiAoISh0aGlzLm9mZnNldCArIGJ5dGVzIDw9IHRoaXMubGVuZ3RoKSlcbiAgICByZXR1cm4gdGhpcy5lcnJvcihmYWlsIHx8ICdEZWNvZGVyQnVmZmVyIG92ZXJydW4nKTtcblxuICB2YXIgcmVzID0gbmV3IERlY29kZXJCdWZmZXIodGhpcy5iYXNlKTtcblxuICAvLyBTaGFyZSByZXBvcnRlciBzdGF0ZVxuICByZXMuX3JlcG9ydGVyU3RhdGUgPSB0aGlzLl9yZXBvcnRlclN0YXRlO1xuXG4gIHJlcy5vZmZzZXQgPSB0aGlzLm9mZnNldDtcbiAgcmVzLmxlbmd0aCA9IHRoaXMub2Zmc2V0ICsgYnl0ZXM7XG4gIHRoaXMub2Zmc2V0ICs9IGJ5dGVzO1xuICByZXR1cm4gcmVzO1xufVxuXG5EZWNvZGVyQnVmZmVyLnByb3RvdHlwZS5yYXcgPSBmdW5jdGlvbiByYXcoc2F2ZSkge1xuICByZXR1cm4gdGhpcy5iYXNlLnNsaWNlKHNhdmUgPyBzYXZlLm9mZnNldCA6IHRoaXMub2Zmc2V0LCB0aGlzLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIEVuY29kZXJCdWZmZXIodmFsdWUsIHJlcG9ydGVyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWUubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIGlmICghKGl0ZW0gaW5zdGFuY2VvZiBFbmNvZGVyQnVmZmVyKSlcbiAgICAgICAgaXRlbSA9IG5ldyBFbmNvZGVyQnVmZmVyKGl0ZW0sIHJlcG9ydGVyKTtcbiAgICAgIHRoaXMubGVuZ3RoICs9IGl0ZW0ubGVuZ3RoO1xuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfSwgdGhpcyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIGlmICghKDAgPD0gdmFsdWUgJiYgdmFsdWUgPD0gMHhmZikpXG4gICAgICByZXR1cm4gcmVwb3J0ZXIuZXJyb3IoJ25vbi1ieXRlIEVuY29kZXJCdWZmZXIgdmFsdWUnKTtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5sZW5ndGggPSAxO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5sZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aCh2YWx1ZSk7XG4gIH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbHVlKSkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcmVwb3J0ZXIuZXJyb3IoJ1Vuc3VwcG9ydGVkIHR5cGU6ICcgKyB0eXBlb2YgdmFsdWUpO1xuICB9XG59XG5leHBvcnRzLkVuY29kZXJCdWZmZXIgPSBFbmNvZGVyQnVmZmVyO1xuXG5FbmNvZGVyQnVmZmVyLnByb3RvdHlwZS5qb2luID0gZnVuY3Rpb24gam9pbihvdXQsIG9mZnNldCkge1xuICBpZiAoIW91dClcbiAgICBvdXQgPSBuZXcgQnVmZmVyKHRoaXMubGVuZ3RoKTtcbiAgaWYgKCFvZmZzZXQpXG4gICAgb2Zmc2V0ID0gMDtcblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIG91dDtcblxuICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnZhbHVlKSkge1xuICAgIHRoaXMudmFsdWUuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICBpdGVtLmpvaW4ob3V0LCBvZmZzZXQpO1xuICAgICAgb2Zmc2V0ICs9IGl0ZW0ubGVuZ3RoO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2YgdGhpcy52YWx1ZSA9PT0gJ251bWJlcicpXG4gICAgICBvdXRbb2Zmc2V0XSA9IHRoaXMudmFsdWU7XG4gICAgZWxzZSBpZiAodHlwZW9mIHRoaXMudmFsdWUgPT09ICdzdHJpbmcnKVxuICAgICAgb3V0LndyaXRlKHRoaXMudmFsdWUsIG9mZnNldCk7XG4gICAgZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKHRoaXMudmFsdWUpKVxuICAgICAgdGhpcy52YWx1ZS5jb3B5KG91dCwgb2Zmc2V0KTtcbiAgICBvZmZzZXQgKz0gdGhpcy5sZW5ndGg7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufTtcbiIsInZhciBhc24xID0gZXhwb3J0cztcblxuYXNuMS5iaWdudW0gPSByZXF1aXJlKCdibi5qcycpO1xuXG5hc24xLmRlZmluZSA9IHJlcXVpcmUoJy4vYXNuMS9hcGknKS5kZWZpbmU7XG5hc24xLmJhc2UgPSByZXF1aXJlKCcuL2FzbjEvYmFzZScpO1xuYXNuMS5jb25zdGFudHMgPSByZXF1aXJlKCcuL2FzbjEvY29uc3RhbnRzJyk7XG5hc24xLmRlY29kZXJzID0gcmVxdWlyZSgnLi9hc24xL2RlY29kZXJzJyk7XG5hc24xLmVuY29kZXJzID0gcmVxdWlyZSgnLi9hc24xL2VuY29kZXJzJyk7XG4iLCJ2YXIgUmVwb3J0ZXIgPSByZXF1aXJlKCcuLi9iYXNlJykuUmVwb3J0ZXI7XG52YXIgRW5jb2RlckJ1ZmZlciA9IHJlcXVpcmUoJy4uL2Jhc2UnKS5FbmNvZGVyQnVmZmVyO1xudmFyIERlY29kZXJCdWZmZXIgPSByZXF1aXJlKCcuLi9iYXNlJykuRGVjb2RlckJ1ZmZlcjtcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdtaW5pbWFsaXN0aWMtYXNzZXJ0Jyk7XG5cbi8vIFN1cHBvcnRlZCB0YWdzXG52YXIgdGFncyA9IFtcbiAgJ3NlcScsICdzZXFvZicsICdzZXQnLCAnc2V0b2YnLCAnb2JqaWQnLCAnYm9vbCcsXG4gICdnZW50aW1lJywgJ3V0Y3RpbWUnLCAnbnVsbF8nLCAnZW51bScsICdpbnQnLCAnb2JqRGVzYycsXG4gICdiaXRzdHInLCAnYm1wc3RyJywgJ2NoYXJzdHInLCAnZ2Vuc3RyJywgJ2dyYXBoc3RyJywgJ2lhNXN0cicsICdpc282NDZzdHInLFxuICAnbnVtc3RyJywgJ29jdHN0cicsICdwcmludHN0cicsICd0NjFzdHInLCAndW5pc3RyJywgJ3V0ZjhzdHInLCAndmlkZW9zdHInXG5dO1xuXG4vLyBQdWJsaWMgbWV0aG9kcyBsaXN0XG52YXIgbWV0aG9kcyA9IFtcbiAgJ2tleScsICdvYmonLCAndXNlJywgJ29wdGlvbmFsJywgJ2V4cGxpY2l0JywgJ2ltcGxpY2l0JywgJ2RlZicsICdjaG9pY2UnLFxuICAnYW55JywgJ2NvbnRhaW5zJ1xuXS5jb25jYXQodGFncyk7XG5cbi8vIE92ZXJyaWRlZCBtZXRob2RzIGxpc3RcbnZhciBvdmVycmlkZWQgPSBbXG4gICdfcGVla1RhZycsICdfZGVjb2RlVGFnJywgJ191c2UnLFxuICAnX2RlY29kZVN0cicsICdfZGVjb2RlT2JqaWQnLCAnX2RlY29kZVRpbWUnLFxuICAnX2RlY29kZU51bGwnLCAnX2RlY29kZUludCcsICdfZGVjb2RlQm9vbCcsICdfZGVjb2RlTGlzdCcsXG5cbiAgJ19lbmNvZGVDb21wb3NpdGUnLCAnX2VuY29kZVN0cicsICdfZW5jb2RlT2JqaWQnLCAnX2VuY29kZVRpbWUnLFxuICAnX2VuY29kZU51bGwnLCAnX2VuY29kZUludCcsICdfZW5jb2RlQm9vbCdcbl07XG5cbmZ1bmN0aW9uIE5vZGUoZW5jLCBwYXJlbnQpIHtcbiAgdmFyIHN0YXRlID0ge307XG4gIHRoaXMuX2Jhc2VTdGF0ZSA9IHN0YXRlO1xuXG4gIHN0YXRlLmVuYyA9IGVuYztcblxuICBzdGF0ZS5wYXJlbnQgPSBwYXJlbnQgfHwgbnVsbDtcbiAgc3RhdGUuY2hpbGRyZW4gPSBudWxsO1xuXG4gIC8vIFN0YXRlXG4gIHN0YXRlLnRhZyA9IG51bGw7XG4gIHN0YXRlLmFyZ3MgPSBudWxsO1xuICBzdGF0ZS5yZXZlcnNlQXJncyA9IG51bGw7XG4gIHN0YXRlLmNob2ljZSA9IG51bGw7XG4gIHN0YXRlLm9wdGlvbmFsID0gZmFsc2U7XG4gIHN0YXRlLmFueSA9IGZhbHNlO1xuICBzdGF0ZS5vYmogPSBmYWxzZTtcbiAgc3RhdGUudXNlID0gbnVsbDtcbiAgc3RhdGUudXNlRGVjb2RlciA9IG51bGw7XG4gIHN0YXRlLmtleSA9IG51bGw7XG4gIHN0YXRlWydkZWZhdWx0J10gPSBudWxsO1xuICBzdGF0ZS5leHBsaWNpdCA9IG51bGw7XG4gIHN0YXRlLmltcGxpY2l0ID0gbnVsbDtcbiAgc3RhdGUuY29udGFpbnMgPSBudWxsO1xuXG4gIC8vIFNob3VsZCBjcmVhdGUgbmV3IGluc3RhbmNlIG9uIGVhY2ggbWV0aG9kXG4gIGlmICghc3RhdGUucGFyZW50KSB7XG4gICAgc3RhdGUuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLl93cmFwKCk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gTm9kZTtcblxudmFyIHN0YXRlUHJvcHMgPSBbXG4gICdlbmMnLCAncGFyZW50JywgJ2NoaWxkcmVuJywgJ3RhZycsICdhcmdzJywgJ3JldmVyc2VBcmdzJywgJ2Nob2ljZScsXG4gICdvcHRpb25hbCcsICdhbnknLCAnb2JqJywgJ3VzZScsICdhbHRlcmVkVXNlJywgJ2tleScsICdkZWZhdWx0JywgJ2V4cGxpY2l0JyxcbiAgJ2ltcGxpY2l0JywgJ2NvbnRhaW5zJ1xuXTtcblxuTm9kZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiBjbG9uZSgpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuICB2YXIgY3N0YXRlID0ge307XG4gIHN0YXRlUHJvcHMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgY3N0YXRlW3Byb3BdID0gc3RhdGVbcHJvcF07XG4gIH0pO1xuICB2YXIgcmVzID0gbmV3IHRoaXMuY29uc3RydWN0b3IoY3N0YXRlLnBhcmVudCk7XG4gIHJlcy5fYmFzZVN0YXRlID0gY3N0YXRlO1xuICByZXR1cm4gcmVzO1xufTtcblxuTm9kZS5wcm90b3R5cGUuX3dyYXAgPSBmdW5jdGlvbiB3cmFwKCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XG4gIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICB0aGlzW21ldGhvZF0gPSBmdW5jdGlvbiBfd3JhcHBlZE1ldGhvZCgpIHtcbiAgICAgIHZhciBjbG9uZSA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xuICAgICAgc3RhdGUuY2hpbGRyZW4ucHVzaChjbG9uZSk7XG4gICAgICByZXR1cm4gY2xvbmVbbWV0aG9kXS5hcHBseShjbG9uZSwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9LCB0aGlzKTtcbn07XG5cbk5vZGUucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24gaW5pdChib2R5KSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICBhc3NlcnQoc3RhdGUucGFyZW50ID09PSBudWxsKTtcbiAgYm9keS5jYWxsKHRoaXMpO1xuXG4gIC8vIEZpbHRlciBjaGlsZHJlblxuICBzdGF0ZS5jaGlsZHJlbiA9IHN0YXRlLmNoaWxkcmVuLmZpbHRlcihmdW5jdGlvbihjaGlsZCkge1xuICAgIHJldHVybiBjaGlsZC5fYmFzZVN0YXRlLnBhcmVudCA9PT0gdGhpcztcbiAgfSwgdGhpcyk7XG4gIGFzc2VydC5lcXVhbChzdGF0ZS5jaGlsZHJlbi5sZW5ndGgsIDEsICdSb290IG5vZGUgY2FuIGhhdmUgb25seSBvbmUgY2hpbGQnKTtcbn07XG5cbk5vZGUucHJvdG90eXBlLl91c2VBcmdzID0gZnVuY3Rpb24gdXNlQXJncyhhcmdzKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICAvLyBGaWx0ZXIgY2hpbGRyZW4gYW5kIGFyZ3NcbiAgdmFyIGNoaWxkcmVuID0gYXJncy5maWx0ZXIoZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGFyZyBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3I7XG4gIH0sIHRoaXMpO1xuICBhcmdzID0gYXJncy5maWx0ZXIoZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuICEoYXJnIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gIH0sIHRoaXMpO1xuXG4gIGlmIChjaGlsZHJlbi5sZW5ndGggIT09IDApIHtcbiAgICBhc3NlcnQoc3RhdGUuY2hpbGRyZW4gPT09IG51bGwpO1xuICAgIHN0YXRlLmNoaWxkcmVuID0gY2hpbGRyZW47XG5cbiAgICAvLyBSZXBsYWNlIHBhcmVudCB0byBtYWludGFpbiBiYWNrd2FyZCBsaW5rXG4gICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgY2hpbGQuX2Jhc2VTdGF0ZS5wYXJlbnQgPSB0aGlzO1xuICAgIH0sIHRoaXMpO1xuICB9XG4gIGlmIChhcmdzLmxlbmd0aCAhPT0gMCkge1xuICAgIGFzc2VydChzdGF0ZS5hcmdzID09PSBudWxsKTtcbiAgICBzdGF0ZS5hcmdzID0gYXJncztcbiAgICBzdGF0ZS5yZXZlcnNlQXJncyA9IGFyZ3MubWFwKGZ1bmN0aW9uKGFyZykge1xuICAgICAgaWYgKHR5cGVvZiBhcmcgIT09ICdvYmplY3QnIHx8IGFyZy5jb25zdHJ1Y3RvciAhPT0gT2JqZWN0KVxuICAgICAgICByZXR1cm4gYXJnO1xuXG4gICAgICB2YXIgcmVzID0ge307XG4gICAgICBPYmplY3Qua2V5cyhhcmcpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChrZXkgPT0gKGtleSB8IDApKVxuICAgICAgICAgIGtleSB8PSAwO1xuICAgICAgICB2YXIgdmFsdWUgPSBhcmdba2V5XTtcbiAgICAgICAgcmVzW3ZhbHVlXSA9IGtleTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9KTtcbiAgfVxufTtcblxuLy9cbi8vIE92ZXJyaWRlZCBtZXRob2RzXG4vL1xuXG5vdmVycmlkZWQuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgTm9kZS5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uIF9vdmVycmlkZWQoKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuICAgIHRocm93IG5ldyBFcnJvcihtZXRob2QgKyAnIG5vdCBpbXBsZW1lbnRlZCBmb3IgZW5jb2Rpbmc6ICcgKyBzdGF0ZS5lbmMpO1xuICB9O1xufSk7XG5cbi8vXG4vLyBQdWJsaWMgbWV0aG9kc1xuLy9cblxudGFncy5mb3JFYWNoKGZ1bmN0aW9uKHRhZykge1xuICBOb2RlLnByb3RvdHlwZVt0YWddID0gZnVuY3Rpb24gX3RhZ01ldGhvZCgpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgYXNzZXJ0KHN0YXRlLnRhZyA9PT0gbnVsbCk7XG4gICAgc3RhdGUudGFnID0gdGFnO1xuXG4gICAgdGhpcy5fdXNlQXJncyhhcmdzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xufSk7XG5cbk5vZGUucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShpdGVtKSB7XG4gIGFzc2VydChpdGVtKTtcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuXG4gIGFzc2VydChzdGF0ZS51c2UgPT09IG51bGwpO1xuICBzdGF0ZS51c2UgPSBpdGVtO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuTm9kZS5wcm90b3R5cGUub3B0aW9uYWwgPSBmdW5jdGlvbiBvcHRpb25hbCgpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuXG4gIHN0YXRlLm9wdGlvbmFsID0gdHJ1ZTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbk5vZGUucHJvdG90eXBlLmRlZiA9IGZ1bmN0aW9uIGRlZih2YWwpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuXG4gIGFzc2VydChzdGF0ZVsnZGVmYXVsdCddID09PSBudWxsKTtcbiAgc3RhdGVbJ2RlZmF1bHQnXSA9IHZhbDtcbiAgc3RhdGUub3B0aW9uYWwgPSB0cnVlO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuTm9kZS5wcm90b3R5cGUuZXhwbGljaXQgPSBmdW5jdGlvbiBleHBsaWNpdChudW0pIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuXG4gIGFzc2VydChzdGF0ZS5leHBsaWNpdCA9PT0gbnVsbCAmJiBzdGF0ZS5pbXBsaWNpdCA9PT0gbnVsbCk7XG4gIHN0YXRlLmV4cGxpY2l0ID0gbnVtO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuTm9kZS5wcm90b3R5cGUuaW1wbGljaXQgPSBmdW5jdGlvbiBpbXBsaWNpdChudW0pIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuXG4gIGFzc2VydChzdGF0ZS5leHBsaWNpdCA9PT0gbnVsbCAmJiBzdGF0ZS5pbXBsaWNpdCA9PT0gbnVsbCk7XG4gIHN0YXRlLmltcGxpY2l0ID0gbnVtO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuTm9kZS5wcm90b3R5cGUub2JqID0gZnVuY3Rpb24gb2JqKCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICBzdGF0ZS5vYmogPSB0cnVlO1xuXG4gIGlmIChhcmdzLmxlbmd0aCAhPT0gMClcbiAgICB0aGlzLl91c2VBcmdzKGFyZ3MpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuTm9kZS5wcm90b3R5cGUua2V5ID0gZnVuY3Rpb24ga2V5KG5ld0tleSkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XG5cbiAgYXNzZXJ0KHN0YXRlLmtleSA9PT0gbnVsbCk7XG4gIHN0YXRlLmtleSA9IG5ld0tleTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbk5vZGUucHJvdG90eXBlLmFueSA9IGZ1bmN0aW9uIGFueSgpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuXG4gIHN0YXRlLmFueSA9IHRydWU7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5jaG9pY2UgPSBmdW5jdGlvbiBjaG9pY2Uob2JqKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICBhc3NlcnQoc3RhdGUuY2hvaWNlID09PSBudWxsKTtcbiAgc3RhdGUuY2hvaWNlID0gb2JqO1xuICB0aGlzLl91c2VBcmdzKE9iamVjdC5rZXlzKG9iaikubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBvYmpba2V5XTtcbiAgfSkpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuTm9kZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiBjb250YWlucyhpdGVtKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICBhc3NlcnQoc3RhdGUudXNlID09PSBudWxsKTtcbiAgc3RhdGUuY29udGFpbnMgPSBpdGVtO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIERlY29kaW5nXG4vL1xuXG5Ob2RlLnByb3RvdHlwZS5fZGVjb2RlID0gZnVuY3Rpb24gZGVjb2RlKGlucHV0LCBvcHRpb25zKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICAvLyBEZWNvZGUgcm9vdCBub2RlXG4gIGlmIChzdGF0ZS5wYXJlbnQgPT09IG51bGwpXG4gICAgcmV0dXJuIGlucHV0LndyYXBSZXN1bHQoc3RhdGUuY2hpbGRyZW5bMF0uX2RlY29kZShpbnB1dCwgb3B0aW9ucykpO1xuXG4gIHZhciByZXN1bHQgPSBzdGF0ZVsnZGVmYXVsdCddO1xuICB2YXIgcHJlc2VudCA9IHRydWU7XG5cbiAgdmFyIHByZXZLZXkgPSBudWxsO1xuICBpZiAoc3RhdGUua2V5ICE9PSBudWxsKVxuICAgIHByZXZLZXkgPSBpbnB1dC5lbnRlcktleShzdGF0ZS5rZXkpO1xuXG4gIC8vIENoZWNrIGlmIHRhZyBpcyB0aGVyZVxuICBpZiAoc3RhdGUub3B0aW9uYWwpIHtcbiAgICB2YXIgdGFnID0gbnVsbDtcbiAgICBpZiAoc3RhdGUuZXhwbGljaXQgIT09IG51bGwpXG4gICAgICB0YWcgPSBzdGF0ZS5leHBsaWNpdDtcbiAgICBlbHNlIGlmIChzdGF0ZS5pbXBsaWNpdCAhPT0gbnVsbClcbiAgICAgIHRhZyA9IHN0YXRlLmltcGxpY2l0O1xuICAgIGVsc2UgaWYgKHN0YXRlLnRhZyAhPT0gbnVsbClcbiAgICAgIHRhZyA9IHN0YXRlLnRhZztcblxuICAgIGlmICh0YWcgPT09IG51bGwgJiYgIXN0YXRlLmFueSkge1xuICAgICAgLy8gVHJpYWwgYW5kIEVycm9yXG4gICAgICB2YXIgc2F2ZSA9IGlucHV0LnNhdmUoKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChzdGF0ZS5jaG9pY2UgPT09IG51bGwpXG4gICAgICAgICAgdGhpcy5fZGVjb2RlR2VuZXJpYyhzdGF0ZS50YWcsIGlucHV0LCBvcHRpb25zKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRoaXMuX2RlY29kZUNob2ljZShpbnB1dCwgb3B0aW9ucyk7XG4gICAgICAgIHByZXNlbnQgPSB0cnVlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBwcmVzZW50ID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpbnB1dC5yZXN0b3JlKHNhdmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmVzZW50ID0gdGhpcy5fcGVla1RhZyhpbnB1dCwgdGFnLCBzdGF0ZS5hbnkpO1xuXG4gICAgICBpZiAoaW5wdXQuaXNFcnJvcihwcmVzZW50KSlcbiAgICAgICAgcmV0dXJuIHByZXNlbnQ7XG4gICAgfVxuICB9XG5cbiAgLy8gUHVzaCBvYmplY3Qgb24gc3RhY2tcbiAgdmFyIHByZXZPYmo7XG4gIGlmIChzdGF0ZS5vYmogJiYgcHJlc2VudClcbiAgICBwcmV2T2JqID0gaW5wdXQuZW50ZXJPYmplY3QoKTtcblxuICBpZiAocHJlc2VudCkge1xuICAgIC8vIFVud3JhcCBleHBsaWNpdCB2YWx1ZXNcbiAgICBpZiAoc3RhdGUuZXhwbGljaXQgIT09IG51bGwpIHtcbiAgICAgIHZhciBleHBsaWNpdCA9IHRoaXMuX2RlY29kZVRhZyhpbnB1dCwgc3RhdGUuZXhwbGljaXQpO1xuICAgICAgaWYgKGlucHV0LmlzRXJyb3IoZXhwbGljaXQpKVxuICAgICAgICByZXR1cm4gZXhwbGljaXQ7XG4gICAgICBpbnB1dCA9IGV4cGxpY2l0O1xuICAgIH1cblxuICAgIHZhciBzdGFydCA9IGlucHV0Lm9mZnNldDtcblxuICAgIC8vIFVud3JhcCBpbXBsaWNpdCBhbmQgbm9ybWFsIHZhbHVlc1xuICAgIGlmIChzdGF0ZS51c2UgPT09IG51bGwgJiYgc3RhdGUuY2hvaWNlID09PSBudWxsKSB7XG4gICAgICBpZiAoc3RhdGUuYW55KVxuICAgICAgICB2YXIgc2F2ZSA9IGlucHV0LnNhdmUoKTtcbiAgICAgIHZhciBib2R5ID0gdGhpcy5fZGVjb2RlVGFnKFxuICAgICAgICBpbnB1dCxcbiAgICAgICAgc3RhdGUuaW1wbGljaXQgIT09IG51bGwgPyBzdGF0ZS5pbXBsaWNpdCA6IHN0YXRlLnRhZyxcbiAgICAgICAgc3RhdGUuYW55XG4gICAgICApO1xuICAgICAgaWYgKGlucHV0LmlzRXJyb3IoYm9keSkpXG4gICAgICAgIHJldHVybiBib2R5O1xuXG4gICAgICBpZiAoc3RhdGUuYW55KVxuICAgICAgICByZXN1bHQgPSBpbnB1dC5yYXcoc2F2ZSk7XG4gICAgICBlbHNlXG4gICAgICAgIGlucHV0ID0gYm9keTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnRyYWNrICYmIHN0YXRlLnRhZyAhPT0gbnVsbClcbiAgICAgIG9wdGlvbnMudHJhY2soaW5wdXQucGF0aCgpLCBzdGFydCwgaW5wdXQubGVuZ3RoLCAndGFnZ2VkJyk7XG5cbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnRyYWNrICYmIHN0YXRlLnRhZyAhPT0gbnVsbClcbiAgICAgIG9wdGlvbnMudHJhY2soaW5wdXQucGF0aCgpLCBpbnB1dC5vZmZzZXQsIGlucHV0Lmxlbmd0aCwgJ2NvbnRlbnQnKTtcblxuICAgIC8vIFNlbGVjdCBwcm9wZXIgbWV0aG9kIGZvciB0YWdcbiAgICBpZiAoc3RhdGUuYW55KVxuICAgICAgcmVzdWx0ID0gcmVzdWx0O1xuICAgIGVsc2UgaWYgKHN0YXRlLmNob2ljZSA9PT0gbnVsbClcbiAgICAgIHJlc3VsdCA9IHRoaXMuX2RlY29kZUdlbmVyaWMoc3RhdGUudGFnLCBpbnB1dCwgb3B0aW9ucyk7XG4gICAgZWxzZVxuICAgICAgcmVzdWx0ID0gdGhpcy5fZGVjb2RlQ2hvaWNlKGlucHV0LCBvcHRpb25zKTtcblxuICAgIGlmIChpbnB1dC5pc0Vycm9yKHJlc3VsdCkpXG4gICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgLy8gRGVjb2RlIGNoaWxkcmVuXG4gICAgaWYgKCFzdGF0ZS5hbnkgJiYgc3RhdGUuY2hvaWNlID09PSBudWxsICYmIHN0YXRlLmNoaWxkcmVuICE9PSBudWxsKSB7XG4gICAgICBzdGF0ZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIGRlY29kZUNoaWxkcmVuKGNoaWxkKSB7XG4gICAgICAgIC8vIE5PVEU6IFdlIGFyZSBpZ25vcmluZyBlcnJvcnMgaGVyZSwgdG8gbGV0IHBhcnNlciBjb250aW51ZSB3aXRoIG90aGVyXG4gICAgICAgIC8vIHBhcnRzIG9mIGVuY29kZWQgZGF0YVxuICAgICAgICBjaGlsZC5fZGVjb2RlKGlucHV0LCBvcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIERlY29kZSBjb250YWluZWQvZW5jb2RlZCBieSBzY2hlbWEsIG9ubHkgaW4gYml0IG9yIG9jdGV0IHN0cmluZ3NcbiAgICBpZiAoc3RhdGUuY29udGFpbnMgJiYgKHN0YXRlLnRhZyA9PT0gJ29jdHN0cicgfHwgc3RhdGUudGFnID09PSAnYml0c3RyJykpIHtcbiAgICAgIHZhciBkYXRhID0gbmV3IERlY29kZXJCdWZmZXIocmVzdWx0KTtcbiAgICAgIHJlc3VsdCA9IHRoaXMuX2dldFVzZShzdGF0ZS5jb250YWlucywgaW5wdXQuX3JlcG9ydGVyU3RhdGUub2JqKVxuICAgICAgICAgIC5fZGVjb2RlKGRhdGEsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFBvcCBvYmplY3RcbiAgaWYgKHN0YXRlLm9iaiAmJiBwcmVzZW50KVxuICAgIHJlc3VsdCA9IGlucHV0LmxlYXZlT2JqZWN0KHByZXZPYmopO1xuXG4gIC8vIFNldCBrZXlcbiAgaWYgKHN0YXRlLmtleSAhPT0gbnVsbCAmJiAocmVzdWx0ICE9PSBudWxsIHx8IHByZXNlbnQgPT09IHRydWUpKVxuICAgIGlucHV0LmxlYXZlS2V5KHByZXZLZXksIHN0YXRlLmtleSwgcmVzdWx0KTtcbiAgZWxzZSBpZiAocHJldktleSAhPT0gbnVsbClcbiAgICBpbnB1dC5leGl0S2V5KHByZXZLZXkpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5fZGVjb2RlR2VuZXJpYyA9IGZ1bmN0aW9uIGRlY29kZUdlbmVyaWModGFnLCBpbnB1dCwgb3B0aW9ucykge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XG5cbiAgaWYgKHRhZyA9PT0gJ3NlcScgfHwgdGFnID09PSAnc2V0JylcbiAgICByZXR1cm4gbnVsbDtcbiAgaWYgKHRhZyA9PT0gJ3NlcW9mJyB8fCB0YWcgPT09ICdzZXRvZicpXG4gICAgcmV0dXJuIHRoaXMuX2RlY29kZUxpc3QoaW5wdXQsIHRhZywgc3RhdGUuYXJnc1swXSwgb3B0aW9ucyk7XG4gIGVsc2UgaWYgKC9zdHIkLy50ZXN0KHRhZykpXG4gICAgcmV0dXJuIHRoaXMuX2RlY29kZVN0cihpbnB1dCwgdGFnLCBvcHRpb25zKTtcbiAgZWxzZSBpZiAodGFnID09PSAnb2JqaWQnICYmIHN0YXRlLmFyZ3MpXG4gICAgcmV0dXJuIHRoaXMuX2RlY29kZU9iamlkKGlucHV0LCBzdGF0ZS5hcmdzWzBdLCBzdGF0ZS5hcmdzWzFdLCBvcHRpb25zKTtcbiAgZWxzZSBpZiAodGFnID09PSAnb2JqaWQnKVxuICAgIHJldHVybiB0aGlzLl9kZWNvZGVPYmppZChpbnB1dCwgbnVsbCwgbnVsbCwgb3B0aW9ucyk7XG4gIGVsc2UgaWYgKHRhZyA9PT0gJ2dlbnRpbWUnIHx8IHRhZyA9PT0gJ3V0Y3RpbWUnKVxuICAgIHJldHVybiB0aGlzLl9kZWNvZGVUaW1lKGlucHV0LCB0YWcsIG9wdGlvbnMpO1xuICBlbHNlIGlmICh0YWcgPT09ICdudWxsXycpXG4gICAgcmV0dXJuIHRoaXMuX2RlY29kZU51bGwoaW5wdXQsIG9wdGlvbnMpO1xuICBlbHNlIGlmICh0YWcgPT09ICdib29sJylcbiAgICByZXR1cm4gdGhpcy5fZGVjb2RlQm9vbChpbnB1dCwgb3B0aW9ucyk7XG4gIGVsc2UgaWYgKHRhZyA9PT0gJ29iakRlc2MnKVxuICAgIHJldHVybiB0aGlzLl9kZWNvZGVTdHIoaW5wdXQsIHRhZywgb3B0aW9ucyk7XG4gIGVsc2UgaWYgKHRhZyA9PT0gJ2ludCcgfHwgdGFnID09PSAnZW51bScpXG4gICAgcmV0dXJuIHRoaXMuX2RlY29kZUludChpbnB1dCwgc3RhdGUuYXJncyAmJiBzdGF0ZS5hcmdzWzBdLCBvcHRpb25zKTtcblxuICBpZiAoc3RhdGUudXNlICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFVzZShzdGF0ZS51c2UsIGlucHV0Ll9yZXBvcnRlclN0YXRlLm9iailcbiAgICAgICAgLl9kZWNvZGUoaW5wdXQsIG9wdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBpbnB1dC5lcnJvcigndW5rbm93biB0YWc6ICcgKyB0YWcpO1xuICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5fZ2V0VXNlID0gZnVuY3Rpb24gX2dldFVzZShlbnRpdHksIG9iaikge1xuXG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcbiAgLy8gQ3JlYXRlIGFsdGVyZWQgdXNlIGRlY29kZXIgaWYgaW1wbGljaXQgaXMgc2V0XG4gIHN0YXRlLnVzZURlY29kZXIgPSB0aGlzLl91c2UoZW50aXR5LCBvYmopO1xuICBhc3NlcnQoc3RhdGUudXNlRGVjb2Rlci5fYmFzZVN0YXRlLnBhcmVudCA9PT0gbnVsbCk7XG4gIHN0YXRlLnVzZURlY29kZXIgPSBzdGF0ZS51c2VEZWNvZGVyLl9iYXNlU3RhdGUuY2hpbGRyZW5bMF07XG4gIGlmIChzdGF0ZS5pbXBsaWNpdCAhPT0gc3RhdGUudXNlRGVjb2Rlci5fYmFzZVN0YXRlLmltcGxpY2l0KSB7XG4gICAgc3RhdGUudXNlRGVjb2RlciA9IHN0YXRlLnVzZURlY29kZXIuY2xvbmUoKTtcbiAgICBzdGF0ZS51c2VEZWNvZGVyLl9iYXNlU3RhdGUuaW1wbGljaXQgPSBzdGF0ZS5pbXBsaWNpdDtcbiAgfVxuICByZXR1cm4gc3RhdGUudXNlRGVjb2Rlcjtcbn07XG5cbk5vZGUucHJvdG90eXBlLl9kZWNvZGVDaG9pY2UgPSBmdW5jdGlvbiBkZWNvZGVDaG9pY2UoaW5wdXQsIG9wdGlvbnMpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgdmFyIG1hdGNoID0gZmFsc2U7XG5cbiAgT2JqZWN0LmtleXMoc3RhdGUuY2hvaWNlKS5zb21lKGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBzYXZlID0gaW5wdXQuc2F2ZSgpO1xuICAgIHZhciBub2RlID0gc3RhdGUuY2hvaWNlW2tleV07XG4gICAgdHJ5IHtcbiAgICAgIHZhciB2YWx1ZSA9IG5vZGUuX2RlY29kZShpbnB1dCwgb3B0aW9ucyk7XG4gICAgICBpZiAoaW5wdXQuaXNFcnJvcih2YWx1ZSkpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgcmVzdWx0ID0geyB0eXBlOiBrZXksIHZhbHVlOiB2YWx1ZSB9O1xuICAgICAgbWF0Y2ggPSB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlucHV0LnJlc3RvcmUoc2F2ZSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9LCB0aGlzKTtcblxuICBpZiAoIW1hdGNoKVxuICAgIHJldHVybiBpbnB1dC5lcnJvcignQ2hvaWNlIG5vdCBtYXRjaGVkJyk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vXG4vLyBFbmNvZGluZ1xuLy9cblxuTm9kZS5wcm90b3R5cGUuX2NyZWF0ZUVuY29kZXJCdWZmZXIgPSBmdW5jdGlvbiBjcmVhdGVFbmNvZGVyQnVmZmVyKGRhdGEpIHtcbiAgcmV0dXJuIG5ldyBFbmNvZGVyQnVmZmVyKGRhdGEsIHRoaXMucmVwb3J0ZXIpO1xufTtcblxuTm9kZS5wcm90b3R5cGUuX2VuY29kZSA9IGZ1bmN0aW9uIGVuY29kZShkYXRhLCByZXBvcnRlciwgcGFyZW50KSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcbiAgaWYgKHN0YXRlWydkZWZhdWx0J10gIT09IG51bGwgJiYgc3RhdGVbJ2RlZmF1bHQnXSA9PT0gZGF0YSlcbiAgICByZXR1cm47XG5cbiAgdmFyIHJlc3VsdCA9IHRoaXMuX2VuY29kZVZhbHVlKGRhdGEsIHJlcG9ydGVyLCBwYXJlbnQpO1xuICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuO1xuXG4gIGlmICh0aGlzLl9za2lwRGVmYXVsdChyZXN1bHQsIHJlcG9ydGVyLCBwYXJlbnQpKVxuICAgIHJldHVybjtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuTm9kZS5wcm90b3R5cGUuX2VuY29kZVZhbHVlID0gZnVuY3Rpb24gZW5jb2RlKGRhdGEsIHJlcG9ydGVyLCBwYXJlbnQpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuXG4gIC8vIERlY29kZSByb290IG5vZGVcbiAgaWYgKHN0YXRlLnBhcmVudCA9PT0gbnVsbClcbiAgICByZXR1cm4gc3RhdGUuY2hpbGRyZW5bMF0uX2VuY29kZShkYXRhLCByZXBvcnRlciB8fCBuZXcgUmVwb3J0ZXIoKSk7XG5cbiAgdmFyIHJlc3VsdCA9IG51bGw7XG5cbiAgLy8gU2V0IHJlcG9ydGVyIHRvIHNoYXJlIGl0IHdpdGggYSBjaGlsZCBjbGFzc1xuICB0aGlzLnJlcG9ydGVyID0gcmVwb3J0ZXI7XG5cbiAgLy8gQ2hlY2sgaWYgZGF0YSBpcyB0aGVyZVxuICBpZiAoc3RhdGUub3B0aW9uYWwgJiYgZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHN0YXRlWydkZWZhdWx0J10gIT09IG51bGwpXG4gICAgICBkYXRhID0gc3RhdGVbJ2RlZmF1bHQnXVxuICAgIGVsc2VcbiAgICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEVuY29kZSBjaGlsZHJlbiBmaXJzdFxuICB2YXIgY29udGVudCA9IG51bGw7XG4gIHZhciBwcmltaXRpdmUgPSBmYWxzZTtcbiAgaWYgKHN0YXRlLmFueSkge1xuICAgIC8vIEFueXRoaW5nIHRoYXQgd2FzIGdpdmVuIGlzIHRyYW5zbGF0ZWQgdG8gYnVmZmVyXG4gICAgcmVzdWx0ID0gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihkYXRhKTtcbiAgfSBlbHNlIGlmIChzdGF0ZS5jaG9pY2UpIHtcbiAgICByZXN1bHQgPSB0aGlzLl9lbmNvZGVDaG9pY2UoZGF0YSwgcmVwb3J0ZXIpO1xuICB9IGVsc2UgaWYgKHN0YXRlLmNvbnRhaW5zKSB7XG4gICAgY29udGVudCA9IHRoaXMuX2dldFVzZShzdGF0ZS5jb250YWlucywgcGFyZW50KS5fZW5jb2RlKGRhdGEsIHJlcG9ydGVyKTtcbiAgICBwcmltaXRpdmUgPSB0cnVlO1xuICB9IGVsc2UgaWYgKHN0YXRlLmNoaWxkcmVuKSB7XG4gICAgY29udGVudCA9IHN0YXRlLmNoaWxkcmVuLm1hcChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKGNoaWxkLl9iYXNlU3RhdGUudGFnID09PSAnbnVsbF8nKVxuICAgICAgICByZXR1cm4gY2hpbGQuX2VuY29kZShudWxsLCByZXBvcnRlciwgZGF0YSk7XG5cbiAgICAgIGlmIChjaGlsZC5fYmFzZVN0YXRlLmtleSA9PT0gbnVsbClcbiAgICAgICAgcmV0dXJuIHJlcG9ydGVyLmVycm9yKCdDaGlsZCBzaG91bGQgaGF2ZSBhIGtleScpO1xuICAgICAgdmFyIHByZXZLZXkgPSByZXBvcnRlci5lbnRlcktleShjaGlsZC5fYmFzZVN0YXRlLmtleSk7XG5cbiAgICAgIGlmICh0eXBlb2YgZGF0YSAhPT0gJ29iamVjdCcpXG4gICAgICAgIHJldHVybiByZXBvcnRlci5lcnJvcignQ2hpbGQgZXhwZWN0ZWQsIGJ1dCBpbnB1dCBpcyBub3Qgb2JqZWN0Jyk7XG5cbiAgICAgIHZhciByZXMgPSBjaGlsZC5fZW5jb2RlKGRhdGFbY2hpbGQuX2Jhc2VTdGF0ZS5rZXldLCByZXBvcnRlciwgZGF0YSk7XG4gICAgICByZXBvcnRlci5sZWF2ZUtleShwcmV2S2V5KTtcblxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9LCB0aGlzKS5maWx0ZXIoZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9KTtcbiAgICBjb250ZW50ID0gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihjb250ZW50KTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoc3RhdGUudGFnID09PSAnc2Vxb2YnIHx8IHN0YXRlLnRhZyA9PT0gJ3NldG9mJykge1xuICAgICAgLy8gVE9ETyhpbmR1dG55KTogdGhpcyBzaG91bGQgYmUgdGhyb3duIG9uIERTTCBsZXZlbFxuICAgICAgaWYgKCEoc3RhdGUuYXJncyAmJiBzdGF0ZS5hcmdzLmxlbmd0aCA9PT0gMSkpXG4gICAgICAgIHJldHVybiByZXBvcnRlci5lcnJvcignVG9vIG1hbnkgYXJncyBmb3IgOiAnICsgc3RhdGUudGFnKTtcblxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKVxuICAgICAgICByZXR1cm4gcmVwb3J0ZXIuZXJyb3IoJ3NlcW9mL3NldG9mLCBidXQgZGF0YSBpcyBub3QgQXJyYXknKTtcblxuICAgICAgdmFyIGNoaWxkID0gdGhpcy5jbG9uZSgpO1xuICAgICAgY2hpbGQuX2Jhc2VTdGF0ZS5pbXBsaWNpdCA9IG51bGw7XG4gICAgICBjb250ZW50ID0gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihkYXRhLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0VXNlKHN0YXRlLmFyZ3NbMF0sIGRhdGEpLl9lbmNvZGUoaXRlbSwgcmVwb3J0ZXIpO1xuICAgICAgfSwgY2hpbGQpKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlLnVzZSAhPT0gbnVsbCkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5fZ2V0VXNlKHN0YXRlLnVzZSwgcGFyZW50KS5fZW5jb2RlKGRhdGEsIHJlcG9ydGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGVudCA9IHRoaXMuX2VuY29kZVByaW1pdGl2ZShzdGF0ZS50YWcsIGRhdGEpO1xuICAgICAgcHJpbWl0aXZlID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBFbmNvZGUgZGF0YSBpdHNlbGZcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKCFzdGF0ZS5hbnkgJiYgc3RhdGUuY2hvaWNlID09PSBudWxsKSB7XG4gICAgdmFyIHRhZyA9IHN0YXRlLmltcGxpY2l0ICE9PSBudWxsID8gc3RhdGUuaW1wbGljaXQgOiBzdGF0ZS50YWc7XG4gICAgdmFyIGNscyA9IHN0YXRlLmltcGxpY2l0ID09PSBudWxsID8gJ3VuaXZlcnNhbCcgOiAnY29udGV4dCc7XG5cbiAgICBpZiAodGFnID09PSBudWxsKSB7XG4gICAgICBpZiAoc3RhdGUudXNlID09PSBudWxsKVxuICAgICAgICByZXBvcnRlci5lcnJvcignVGFnIGNvdWxkIGJlIG9taXR0ZWQgb25seSBmb3IgLnVzZSgpJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzdGF0ZS51c2UgPT09IG51bGwpXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuX2VuY29kZUNvbXBvc2l0ZSh0YWcsIHByaW1pdGl2ZSwgY2xzLCBjb250ZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBXcmFwIGluIGV4cGxpY2l0XG4gIGlmIChzdGF0ZS5leHBsaWNpdCAhPT0gbnVsbClcbiAgICByZXN1bHQgPSB0aGlzLl9lbmNvZGVDb21wb3NpdGUoc3RhdGUuZXhwbGljaXQsIGZhbHNlLCAnY29udGV4dCcsIHJlc3VsdCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbk5vZGUucHJvdG90eXBlLl9lbmNvZGVDaG9pY2UgPSBmdW5jdGlvbiBlbmNvZGVDaG9pY2UoZGF0YSwgcmVwb3J0ZXIpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuXG4gIHZhciBub2RlID0gc3RhdGUuY2hvaWNlW2RhdGEudHlwZV07XG4gIGlmICghbm9kZSkge1xuICAgIGFzc2VydChcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIGRhdGEudHlwZSArICcgbm90IGZvdW5kIGluICcgK1xuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmtleXMoc3RhdGUuY2hvaWNlKSkpO1xuICB9XG4gIHJldHVybiBub2RlLl9lbmNvZGUoZGF0YS52YWx1ZSwgcmVwb3J0ZXIpO1xufTtcblxuTm9kZS5wcm90b3R5cGUuX2VuY29kZVByaW1pdGl2ZSA9IGZ1bmN0aW9uIGVuY29kZVByaW1pdGl2ZSh0YWcsIGRhdGEpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuXG4gIGlmICgvc3RyJC8udGVzdCh0YWcpKVxuICAgIHJldHVybiB0aGlzLl9lbmNvZGVTdHIoZGF0YSwgdGFnKTtcbiAgZWxzZSBpZiAodGFnID09PSAnb2JqaWQnICYmIHN0YXRlLmFyZ3MpXG4gICAgcmV0dXJuIHRoaXMuX2VuY29kZU9iamlkKGRhdGEsIHN0YXRlLnJldmVyc2VBcmdzWzBdLCBzdGF0ZS5hcmdzWzFdKTtcbiAgZWxzZSBpZiAodGFnID09PSAnb2JqaWQnKVxuICAgIHJldHVybiB0aGlzLl9lbmNvZGVPYmppZChkYXRhLCBudWxsLCBudWxsKTtcbiAgZWxzZSBpZiAodGFnID09PSAnZ2VudGltZScgfHwgdGFnID09PSAndXRjdGltZScpXG4gICAgcmV0dXJuIHRoaXMuX2VuY29kZVRpbWUoZGF0YSwgdGFnKTtcbiAgZWxzZSBpZiAodGFnID09PSAnbnVsbF8nKVxuICAgIHJldHVybiB0aGlzLl9lbmNvZGVOdWxsKCk7XG4gIGVsc2UgaWYgKHRhZyA9PT0gJ2ludCcgfHwgdGFnID09PSAnZW51bScpXG4gICAgcmV0dXJuIHRoaXMuX2VuY29kZUludChkYXRhLCBzdGF0ZS5hcmdzICYmIHN0YXRlLnJldmVyc2VBcmdzWzBdKTtcbiAgZWxzZSBpZiAodGFnID09PSAnYm9vbCcpXG4gICAgcmV0dXJuIHRoaXMuX2VuY29kZUJvb2woZGF0YSk7XG4gIGVsc2UgaWYgKHRhZyA9PT0gJ29iakRlc2MnKVxuICAgIHJldHVybiB0aGlzLl9lbmNvZGVTdHIoZGF0YSwgdGFnKTtcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgdGFnOiAnICsgdGFnKTtcbn07XG5cbk5vZGUucHJvdG90eXBlLl9pc051bXN0ciA9IGZ1bmN0aW9uIGlzTnVtc3RyKHN0cikge1xuICByZXR1cm4gL15bMC05IF0qJC8udGVzdChzdHIpO1xufTtcblxuTm9kZS5wcm90b3R5cGUuX2lzUHJpbnRzdHIgPSBmdW5jdGlvbiBpc1ByaW50c3RyKHN0cikge1xuICByZXR1cm4gL15bQS1aYS16MC05ICdcXChcXClcXCssXFwtXFwuXFwvOj1cXD9dKiQvLnRlc3Qoc3RyKTtcbn07XG4iLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgREVSRW5jb2RlciA9IHJlcXVpcmUoJy4vZGVyJyk7XG5cbmZ1bmN0aW9uIFBFTUVuY29kZXIoZW50aXR5KSB7XG4gIERFUkVuY29kZXIuY2FsbCh0aGlzLCBlbnRpdHkpO1xuICB0aGlzLmVuYyA9ICdwZW0nO1xufTtcbmluaGVyaXRzKFBFTUVuY29kZXIsIERFUkVuY29kZXIpO1xubW9kdWxlLmV4cG9ydHMgPSBQRU1FbmNvZGVyO1xuXG5QRU1FbmNvZGVyLnByb3RvdHlwZS5lbmNvZGUgPSBmdW5jdGlvbiBlbmNvZGUoZGF0YSwgb3B0aW9ucykge1xuICB2YXIgYnVmID0gREVSRW5jb2Rlci5wcm90b3R5cGUuZW5jb2RlLmNhbGwodGhpcywgZGF0YSk7XG5cbiAgdmFyIHAgPSBidWYudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICB2YXIgb3V0ID0gWyAnLS0tLS1CRUdJTiAnICsgb3B0aW9ucy5sYWJlbCArICctLS0tLScgXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwLmxlbmd0aDsgaSArPSA2NClcbiAgICBvdXQucHVzaChwLnNsaWNlKGksIGkgKyA2NCkpO1xuICBvdXQucHVzaCgnLS0tLS1FTkQgJyArIG9wdGlvbnMubGFiZWwgKyAnLS0tLS0nKTtcbiAgcmV0dXJuIG91dC5qb2luKCdcXG4nKTtcbn07XG4iLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzJyk7XG5cbmV4cG9ydHMudGFnQ2xhc3MgPSB7XG4gIDA6ICd1bml2ZXJzYWwnLFxuICAxOiAnYXBwbGljYXRpb24nLFxuICAyOiAnY29udGV4dCcsXG4gIDM6ICdwcml2YXRlJ1xufTtcbmV4cG9ydHMudGFnQ2xhc3NCeU5hbWUgPSBjb25zdGFudHMuX3JldmVyc2UoZXhwb3J0cy50YWdDbGFzcyk7XG5cbmV4cG9ydHMudGFnID0ge1xuICAweDAwOiAnZW5kJyxcbiAgMHgwMTogJ2Jvb2wnLFxuICAweDAyOiAnaW50JyxcbiAgMHgwMzogJ2JpdHN0cicsXG4gIDB4MDQ6ICdvY3RzdHInLFxuICAweDA1OiAnbnVsbF8nLFxuICAweDA2OiAnb2JqaWQnLFxuICAweDA3OiAnb2JqRGVzYycsXG4gIDB4MDg6ICdleHRlcm5hbCcsXG4gIDB4MDk6ICdyZWFsJyxcbiAgMHgwYTogJ2VudW0nLFxuICAweDBiOiAnZW1iZWQnLFxuICAweDBjOiAndXRmOHN0cicsXG4gIDB4MGQ6ICdyZWxhdGl2ZU9pZCcsXG4gIDB4MTA6ICdzZXEnLFxuICAweDExOiAnc2V0JyxcbiAgMHgxMjogJ251bXN0cicsXG4gIDB4MTM6ICdwcmludHN0cicsXG4gIDB4MTQ6ICd0NjFzdHInLFxuICAweDE1OiAndmlkZW9zdHInLFxuICAweDE2OiAnaWE1c3RyJyxcbiAgMHgxNzogJ3V0Y3RpbWUnLFxuICAweDE4OiAnZ2VudGltZScsXG4gIDB4MTk6ICdncmFwaHN0cicsXG4gIDB4MWE6ICdpc282NDZzdHInLFxuICAweDFiOiAnZ2Vuc3RyJyxcbiAgMHgxYzogJ3VuaXN0cicsXG4gIDB4MWQ6ICdjaGFyc3RyJyxcbiAgMHgxZTogJ2JtcHN0cidcbn07XG5leHBvcnRzLnRhZ0J5TmFtZSA9IGNvbnN0YW50cy5fcmV2ZXJzZShleHBvcnRzLnRhZyk7XG4iLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcblxudmFyIERFUkRlY29kZXIgPSByZXF1aXJlKCcuL2RlcicpO1xuXG5mdW5jdGlvbiBQRU1EZWNvZGVyKGVudGl0eSkge1xuICBERVJEZWNvZGVyLmNhbGwodGhpcywgZW50aXR5KTtcbiAgdGhpcy5lbmMgPSAncGVtJztcbn07XG5pbmhlcml0cyhQRU1EZWNvZGVyLCBERVJEZWNvZGVyKTtcbm1vZHVsZS5leHBvcnRzID0gUEVNRGVjb2RlcjtcblxuUEVNRGVjb2Rlci5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24gZGVjb2RlKGRhdGEsIG9wdGlvbnMpIHtcbiAgdmFyIGxpbmVzID0gZGF0YS50b1N0cmluZygpLnNwbGl0KC9bXFxyXFxuXSsvZyk7XG5cbiAgdmFyIGxhYmVsID0gb3B0aW9ucy5sYWJlbC50b1VwcGVyQ2FzZSgpO1xuXG4gIHZhciByZSA9IC9eLS0tLS0oQkVHSU58RU5EKSAoW14tXSspLS0tLS0kLztcbiAgdmFyIHN0YXJ0ID0gLTE7XG4gIHZhciBlbmQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBtYXRjaCA9IGxpbmVzW2ldLm1hdGNoKHJlKTtcbiAgICBpZiAobWF0Y2ggPT09IG51bGwpXG4gICAgICBjb250aW51ZTtcblxuICAgIGlmIChtYXRjaFsyXSAhPT0gbGFiZWwpXG4gICAgICBjb250aW51ZTtcblxuICAgIGlmIChzdGFydCA9PT0gLTEpIHtcbiAgICAgIGlmIChtYXRjaFsxXSAhPT0gJ0JFR0lOJylcbiAgICAgICAgYnJlYWs7XG4gICAgICBzdGFydCA9IGk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChtYXRjaFsxXSAhPT0gJ0VORCcpXG4gICAgICAgIGJyZWFrO1xuICAgICAgZW5kID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBpZiAoc3RhcnQgPT09IC0xIHx8IGVuZCA9PT0gLTEpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdQRU0gc2VjdGlvbiBub3QgZm91bmQgZm9yOiAnICsgbGFiZWwpO1xuXG4gIHZhciBiYXNlNjQgPSBsaW5lcy5zbGljZShzdGFydCArIDEsIGVuZCkuam9pbignJyk7XG4gIC8vIFJlbW92ZSBleGNlc3NpdmUgc3ltYm9sc1xuICBiYXNlNjQucmVwbGFjZSgvW15hLXowLTlcXCtcXC89XSsvZ2ksICcnKTtcblxuICB2YXIgaW5wdXQgPSBuZXcgQnVmZmVyKGJhc2U2NCwgJ2Jhc2U2NCcpO1xuICByZXR1cm4gREVSRGVjb2Rlci5wcm90b3R5cGUuZGVjb2RlLmNhbGwodGhpcywgaW5wdXQsIG9wdGlvbnMpO1xufTtcbiIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBhc24xID0gcmVxdWlyZSgnLi4vLi4vYXNuMScpO1xudmFyIGJhc2UgPSBhc24xLmJhc2U7XG52YXIgYmlnbnVtID0gYXNuMS5iaWdudW07XG5cbi8vIEltcG9ydCBERVIgY29uc3RhbnRzXG52YXIgZGVyID0gYXNuMS5jb25zdGFudHMuZGVyO1xuXG5mdW5jdGlvbiBERVJEZWNvZGVyKGVudGl0eSkge1xuICB0aGlzLmVuYyA9ICdkZXInO1xuICB0aGlzLm5hbWUgPSBlbnRpdHkubmFtZTtcbiAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG5cbiAgLy8gQ29uc3RydWN0IGJhc2UgdHJlZVxuICB0aGlzLnRyZWUgPSBuZXcgREVSTm9kZSgpO1xuICB0aGlzLnRyZWUuX2luaXQoZW50aXR5LmJvZHkpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gREVSRGVjb2RlcjtcblxuREVSRGVjb2Rlci5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24gZGVjb2RlKGRhdGEsIG9wdGlvbnMpIHtcbiAgaWYgKCEoZGF0YSBpbnN0YW5jZW9mIGJhc2UuRGVjb2RlckJ1ZmZlcikpXG4gICAgZGF0YSA9IG5ldyBiYXNlLkRlY29kZXJCdWZmZXIoZGF0YSwgb3B0aW9ucyk7XG5cbiAgcmV0dXJuIHRoaXMudHJlZS5fZGVjb2RlKGRhdGEsIG9wdGlvbnMpO1xufTtcblxuLy8gVHJlZSBtZXRob2RzXG5cbmZ1bmN0aW9uIERFUk5vZGUocGFyZW50KSB7XG4gIGJhc2UuTm9kZS5jYWxsKHRoaXMsICdkZXInLCBwYXJlbnQpO1xufVxuaW5oZXJpdHMoREVSTm9kZSwgYmFzZS5Ob2RlKTtcblxuREVSTm9kZS5wcm90b3R5cGUuX3BlZWtUYWcgPSBmdW5jdGlvbiBwZWVrVGFnKGJ1ZmZlciwgdGFnLCBhbnkpIHtcbiAgaWYgKGJ1ZmZlci5pc0VtcHR5KCkpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBzdGF0ZSA9IGJ1ZmZlci5zYXZlKCk7XG4gIHZhciBkZWNvZGVkVGFnID0gZGVyRGVjb2RlVGFnKGJ1ZmZlciwgJ0ZhaWxlZCB0byBwZWVrIHRhZzogXCInICsgdGFnICsgJ1wiJyk7XG4gIGlmIChidWZmZXIuaXNFcnJvcihkZWNvZGVkVGFnKSlcbiAgICByZXR1cm4gZGVjb2RlZFRhZztcblxuICBidWZmZXIucmVzdG9yZShzdGF0ZSk7XG5cbiAgcmV0dXJuIGRlY29kZWRUYWcudGFnID09PSB0YWcgfHwgZGVjb2RlZFRhZy50YWdTdHIgPT09IHRhZyB8fFxuICAgIChkZWNvZGVkVGFnLnRhZ1N0ciArICdvZicpID09PSB0YWcgfHwgYW55O1xufTtcblxuREVSTm9kZS5wcm90b3R5cGUuX2RlY29kZVRhZyA9IGZ1bmN0aW9uIGRlY29kZVRhZyhidWZmZXIsIHRhZywgYW55KSB7XG4gIHZhciBkZWNvZGVkVGFnID0gZGVyRGVjb2RlVGFnKGJ1ZmZlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZhaWxlZCB0byBkZWNvZGUgdGFnIG9mIFwiJyArIHRhZyArICdcIicpO1xuICBpZiAoYnVmZmVyLmlzRXJyb3IoZGVjb2RlZFRhZykpXG4gICAgcmV0dXJuIGRlY29kZWRUYWc7XG5cbiAgdmFyIGxlbiA9IGRlckRlY29kZUxlbihidWZmZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgZGVjb2RlZFRhZy5wcmltaXRpdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ0ZhaWxlZCB0byBnZXQgbGVuZ3RoIG9mIFwiJyArIHRhZyArICdcIicpO1xuXG4gIC8vIEZhaWx1cmVcbiAgaWYgKGJ1ZmZlci5pc0Vycm9yKGxlbikpXG4gICAgcmV0dXJuIGxlbjtcblxuICBpZiAoIWFueSAmJlxuICAgICAgZGVjb2RlZFRhZy50YWcgIT09IHRhZyAmJlxuICAgICAgZGVjb2RlZFRhZy50YWdTdHIgIT09IHRhZyAmJlxuICAgICAgZGVjb2RlZFRhZy50YWdTdHIgKyAnb2YnICE9PSB0YWcpIHtcbiAgICByZXR1cm4gYnVmZmVyLmVycm9yKCdGYWlsZWQgdG8gbWF0Y2ggdGFnOiBcIicgKyB0YWcgKyAnXCInKTtcbiAgfVxuXG4gIGlmIChkZWNvZGVkVGFnLnByaW1pdGl2ZSB8fCBsZW4gIT09IG51bGwpXG4gICAgcmV0dXJuIGJ1ZmZlci5za2lwKGxlbiwgJ0ZhaWxlZCB0byBtYXRjaCBib2R5IG9mOiBcIicgKyB0YWcgKyAnXCInKTtcblxuICAvLyBJbmRlZmluaXRlIGxlbmd0aC4uLiBmaW5kIEVORCB0YWdcbiAgdmFyIHN0YXRlID0gYnVmZmVyLnNhdmUoKTtcbiAgdmFyIHJlcyA9IHRoaXMuX3NraXBVbnRpbEVuZChcbiAgICAgIGJ1ZmZlcixcbiAgICAgICdGYWlsZWQgdG8gc2tpcCBpbmRlZmluaXRlIGxlbmd0aCBib2R5OiBcIicgKyB0aGlzLnRhZyArICdcIicpO1xuICBpZiAoYnVmZmVyLmlzRXJyb3IocmVzKSlcbiAgICByZXR1cm4gcmVzO1xuXG4gIGxlbiA9IGJ1ZmZlci5vZmZzZXQgLSBzdGF0ZS5vZmZzZXQ7XG4gIGJ1ZmZlci5yZXN0b3JlKHN0YXRlKTtcbiAgcmV0dXJuIGJ1ZmZlci5za2lwKGxlbiwgJ0ZhaWxlZCB0byBtYXRjaCBib2R5IG9mOiBcIicgKyB0YWcgKyAnXCInKTtcbn07XG5cbkRFUk5vZGUucHJvdG90eXBlLl9za2lwVW50aWxFbmQgPSBmdW5jdGlvbiBza2lwVW50aWxFbmQoYnVmZmVyLCBmYWlsKSB7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdmFyIHRhZyA9IGRlckRlY29kZVRhZyhidWZmZXIsIGZhaWwpO1xuICAgIGlmIChidWZmZXIuaXNFcnJvcih0YWcpKVxuICAgICAgcmV0dXJuIHRhZztcbiAgICB2YXIgbGVuID0gZGVyRGVjb2RlTGVuKGJ1ZmZlciwgdGFnLnByaW1pdGl2ZSwgZmFpbCk7XG4gICAgaWYgKGJ1ZmZlci5pc0Vycm9yKGxlbikpXG4gICAgICByZXR1cm4gbGVuO1xuXG4gICAgdmFyIHJlcztcbiAgICBpZiAodGFnLnByaW1pdGl2ZSB8fCBsZW4gIT09IG51bGwpXG4gICAgICByZXMgPSBidWZmZXIuc2tpcChsZW4pXG4gICAgZWxzZVxuICAgICAgcmVzID0gdGhpcy5fc2tpcFVudGlsRW5kKGJ1ZmZlciwgZmFpbCk7XG5cbiAgICAvLyBGYWlsdXJlXG4gICAgaWYgKGJ1ZmZlci5pc0Vycm9yKHJlcykpXG4gICAgICByZXR1cm4gcmVzO1xuXG4gICAgaWYgKHRhZy50YWdTdHIgPT09ICdlbmQnKVxuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cbkRFUk5vZGUucHJvdG90eXBlLl9kZWNvZGVMaXN0ID0gZnVuY3Rpb24gZGVjb2RlTGlzdChidWZmZXIsIHRhZywgZGVjb2RlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgd2hpbGUgKCFidWZmZXIuaXNFbXB0eSgpKSB7XG4gICAgdmFyIHBvc3NpYmxlRW5kID0gdGhpcy5fcGVla1RhZyhidWZmZXIsICdlbmQnKTtcbiAgICBpZiAoYnVmZmVyLmlzRXJyb3IocG9zc2libGVFbmQpKVxuICAgICAgcmV0dXJuIHBvc3NpYmxlRW5kO1xuXG4gICAgdmFyIHJlcyA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlciwgJ2RlcicsIG9wdGlvbnMpO1xuICAgIGlmIChidWZmZXIuaXNFcnJvcihyZXMpICYmIHBvc3NpYmxlRW5kKVxuICAgICAgYnJlYWs7XG4gICAgcmVzdWx0LnB1c2gocmVzKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuREVSTm9kZS5wcm90b3R5cGUuX2RlY29kZVN0ciA9IGZ1bmN0aW9uIGRlY29kZVN0cihidWZmZXIsIHRhZykge1xuICBpZiAodGFnID09PSAnYml0c3RyJykge1xuICAgIHZhciB1bnVzZWQgPSBidWZmZXIucmVhZFVJbnQ4KCk7XG4gICAgaWYgKGJ1ZmZlci5pc0Vycm9yKHVudXNlZCkpXG4gICAgICByZXR1cm4gdW51c2VkO1xuICAgIHJldHVybiB7IHVudXNlZDogdW51c2VkLCBkYXRhOiBidWZmZXIucmF3KCkgfTtcbiAgfSBlbHNlIGlmICh0YWcgPT09ICdibXBzdHInKSB7XG4gICAgdmFyIHJhdyA9IGJ1ZmZlci5yYXcoKTtcbiAgICBpZiAocmF3Lmxlbmd0aCAlIDIgPT09IDEpXG4gICAgICByZXR1cm4gYnVmZmVyLmVycm9yKCdEZWNvZGluZyBvZiBzdHJpbmcgdHlwZTogYm1wc3RyIGxlbmd0aCBtaXNtYXRjaCcpO1xuXG4gICAgdmFyIHN0ciA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3Lmxlbmd0aCAvIDI7IGkrKykge1xuICAgICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUocmF3LnJlYWRVSW50MTZCRShpICogMikpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9IGVsc2UgaWYgKHRhZyA9PT0gJ251bXN0cicpIHtcbiAgICB2YXIgbnVtc3RyID0gYnVmZmVyLnJhdygpLnRvU3RyaW5nKCdhc2NpaScpO1xuICAgIGlmICghdGhpcy5faXNOdW1zdHIobnVtc3RyKSkge1xuICAgICAgcmV0dXJuIGJ1ZmZlci5lcnJvcignRGVjb2Rpbmcgb2Ygc3RyaW5nIHR5cGU6ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnbnVtc3RyIHVuc3VwcG9ydGVkIGNoYXJhY3RlcnMnKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bXN0cjtcbiAgfSBlbHNlIGlmICh0YWcgPT09ICdvY3RzdHInKSB7XG4gICAgcmV0dXJuIGJ1ZmZlci5yYXcoKTtcbiAgfSBlbHNlIGlmICh0YWcgPT09ICdvYmpEZXNjJykge1xuICAgIHJldHVybiBidWZmZXIucmF3KCk7XG4gIH0gZWxzZSBpZiAodGFnID09PSAncHJpbnRzdHInKSB7XG4gICAgdmFyIHByaW50c3RyID0gYnVmZmVyLnJhdygpLnRvU3RyaW5nKCdhc2NpaScpO1xuICAgIGlmICghdGhpcy5faXNQcmludHN0cihwcmludHN0cikpIHtcbiAgICAgIHJldHVybiBidWZmZXIuZXJyb3IoJ0RlY29kaW5nIG9mIHN0cmluZyB0eXBlOiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ByaW50c3RyIHVuc3VwcG9ydGVkIGNoYXJhY3RlcnMnKTtcbiAgICB9XG4gICAgcmV0dXJuIHByaW50c3RyO1xuICB9IGVsc2UgaWYgKC9zdHIkLy50ZXN0KHRhZykpIHtcbiAgICByZXR1cm4gYnVmZmVyLnJhdygpLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJ1ZmZlci5lcnJvcignRGVjb2Rpbmcgb2Ygc3RyaW5nIHR5cGU6ICcgKyB0YWcgKyAnIHVuc3VwcG9ydGVkJyk7XG4gIH1cbn07XG5cbkRFUk5vZGUucHJvdG90eXBlLl9kZWNvZGVPYmppZCA9IGZ1bmN0aW9uIGRlY29kZU9iamlkKGJ1ZmZlciwgdmFsdWVzLCByZWxhdGl2ZSkge1xuICB2YXIgcmVzdWx0O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgdmFyIGlkZW50ID0gMDtcbiAgd2hpbGUgKCFidWZmZXIuaXNFbXB0eSgpKSB7XG4gICAgdmFyIHN1YmlkZW50ID0gYnVmZmVyLnJlYWRVSW50OCgpO1xuICAgIGlkZW50IDw8PSA3O1xuICAgIGlkZW50IHw9IHN1YmlkZW50ICYgMHg3ZjtcbiAgICBpZiAoKHN1YmlkZW50ICYgMHg4MCkgPT09IDApIHtcbiAgICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnQpO1xuICAgICAgaWRlbnQgPSAwO1xuICAgIH1cbiAgfVxuICBpZiAoc3ViaWRlbnQgJiAweDgwKVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnQpO1xuXG4gIHZhciBmaXJzdCA9IChpZGVudGlmaWVyc1swXSAvIDQwKSB8IDA7XG4gIHZhciBzZWNvbmQgPSBpZGVudGlmaWVyc1swXSAlIDQwO1xuXG4gIGlmIChyZWxhdGl2ZSlcbiAgICByZXN1bHQgPSBpZGVudGlmaWVycztcbiAgZWxzZVxuICAgIHJlc3VsdCA9IFtmaXJzdCwgc2Vjb25kXS5jb25jYXQoaWRlbnRpZmllcnMuc2xpY2UoMSkpO1xuXG4gIGlmICh2YWx1ZXMpIHtcbiAgICB2YXIgdG1wID0gdmFsdWVzW3Jlc3VsdC5qb2luKCcgJyldO1xuICAgIGlmICh0bXAgPT09IHVuZGVmaW5lZClcbiAgICAgIHRtcCA9IHZhbHVlc1tyZXN1bHQuam9pbignLicpXTtcbiAgICBpZiAodG1wICE9PSB1bmRlZmluZWQpXG4gICAgICByZXN1bHQgPSB0bXA7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuREVSTm9kZS5wcm90b3R5cGUuX2RlY29kZVRpbWUgPSBmdW5jdGlvbiBkZWNvZGVUaW1lKGJ1ZmZlciwgdGFnKSB7XG4gIHZhciBzdHIgPSBidWZmZXIucmF3KCkudG9TdHJpbmcoKTtcbiAgaWYgKHRhZyA9PT0gJ2dlbnRpbWUnKSB7XG4gICAgdmFyIHllYXIgPSBzdHIuc2xpY2UoMCwgNCkgfCAwO1xuICAgIHZhciBtb24gPSBzdHIuc2xpY2UoNCwgNikgfCAwO1xuICAgIHZhciBkYXkgPSBzdHIuc2xpY2UoNiwgOCkgfCAwO1xuICAgIHZhciBob3VyID0gc3RyLnNsaWNlKDgsIDEwKSB8IDA7XG4gICAgdmFyIG1pbiA9IHN0ci5zbGljZSgxMCwgMTIpIHwgMDtcbiAgICB2YXIgc2VjID0gc3RyLnNsaWNlKDEyLCAxNCkgfCAwO1xuICB9IGVsc2UgaWYgKHRhZyA9PT0gJ3V0Y3RpbWUnKSB7XG4gICAgdmFyIHllYXIgPSBzdHIuc2xpY2UoMCwgMikgfCAwO1xuICAgIHZhciBtb24gPSBzdHIuc2xpY2UoMiwgNCkgfCAwO1xuICAgIHZhciBkYXkgPSBzdHIuc2xpY2UoNCwgNikgfCAwO1xuICAgIHZhciBob3VyID0gc3RyLnNsaWNlKDYsIDgpIHwgMDtcbiAgICB2YXIgbWluID0gc3RyLnNsaWNlKDgsIDEwKSB8IDA7XG4gICAgdmFyIHNlYyA9IHN0ci5zbGljZSgxMCwgMTIpIHwgMDtcbiAgICBpZiAoeWVhciA8IDcwKVxuICAgICAgeWVhciA9IDIwMDAgKyB5ZWFyO1xuICAgIGVsc2VcbiAgICAgIHllYXIgPSAxOTAwICsgeWVhcjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYnVmZmVyLmVycm9yKCdEZWNvZGluZyAnICsgdGFnICsgJyB0aW1lIGlzIG5vdCBzdXBwb3J0ZWQgeWV0Jyk7XG4gIH1cblxuICByZXR1cm4gRGF0ZS5VVEMoeWVhciwgbW9uIC0gMSwgZGF5LCBob3VyLCBtaW4sIHNlYywgMCk7XG59O1xuXG5ERVJOb2RlLnByb3RvdHlwZS5fZGVjb2RlTnVsbCA9IGZ1bmN0aW9uIGRlY29kZU51bGwoYnVmZmVyKSB7XG4gIHJldHVybiBudWxsO1xufTtcblxuREVSTm9kZS5wcm90b3R5cGUuX2RlY29kZUJvb2wgPSBmdW5jdGlvbiBkZWNvZGVCb29sKGJ1ZmZlcikge1xuICB2YXIgcmVzID0gYnVmZmVyLnJlYWRVSW50OCgpO1xuICBpZiAoYnVmZmVyLmlzRXJyb3IocmVzKSlcbiAgICByZXR1cm4gcmVzO1xuICBlbHNlXG4gICAgcmV0dXJuIHJlcyAhPT0gMDtcbn07XG5cbkRFUk5vZGUucHJvdG90eXBlLl9kZWNvZGVJbnQgPSBmdW5jdGlvbiBkZWNvZGVJbnQoYnVmZmVyLCB2YWx1ZXMpIHtcbiAgLy8gQmlnaW50LCByZXR1cm4gYXMgaXQgaXMgKGFzc3VtZSBiaWcgZW5kaWFuKVxuICB2YXIgcmF3ID0gYnVmZmVyLnJhdygpO1xuICB2YXIgcmVzID0gbmV3IGJpZ251bShyYXcpO1xuXG4gIGlmICh2YWx1ZXMpXG4gICAgcmVzID0gdmFsdWVzW3Jlcy50b1N0cmluZygxMCldIHx8IHJlcztcblxuICByZXR1cm4gcmVzO1xufTtcblxuREVSTm9kZS5wcm90b3R5cGUuX3VzZSA9IGZ1bmN0aW9uIHVzZShlbnRpdHksIG9iaikge1xuICBpZiAodHlwZW9mIGVudGl0eSA9PT0gJ2Z1bmN0aW9uJylcbiAgICBlbnRpdHkgPSBlbnRpdHkob2JqKTtcbiAgcmV0dXJuIGVudGl0eS5fZ2V0RGVjb2RlcignZGVyJykudHJlZTtcbn07XG5cbi8vIFV0aWxpdHkgbWV0aG9kc1xuXG5mdW5jdGlvbiBkZXJEZWNvZGVUYWcoYnVmLCBmYWlsKSB7XG4gIHZhciB0YWcgPSBidWYucmVhZFVJbnQ4KGZhaWwpO1xuICBpZiAoYnVmLmlzRXJyb3IodGFnKSlcbiAgICByZXR1cm4gdGFnO1xuXG4gIHZhciBjbHMgPSBkZXIudGFnQ2xhc3NbdGFnID4+IDZdO1xuICB2YXIgcHJpbWl0aXZlID0gKHRhZyAmIDB4MjApID09PSAwO1xuXG4gIC8vIE11bHRpLW9jdGV0IHRhZyAtIGxvYWRcbiAgaWYgKCh0YWcgJiAweDFmKSA9PT0gMHgxZikge1xuICAgIHZhciBvY3QgPSB0YWc7XG4gICAgdGFnID0gMDtcbiAgICB3aGlsZSAoKG9jdCAmIDB4ODApID09PSAweDgwKSB7XG4gICAgICBvY3QgPSBidWYucmVhZFVJbnQ4KGZhaWwpO1xuICAgICAgaWYgKGJ1Zi5pc0Vycm9yKG9jdCkpXG4gICAgICAgIHJldHVybiBvY3Q7XG5cbiAgICAgIHRhZyA8PD0gNztcbiAgICAgIHRhZyB8PSBvY3QgJiAweDdmO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0YWcgJj0gMHgxZjtcbiAgfVxuICB2YXIgdGFnU3RyID0gZGVyLnRhZ1t0YWddO1xuXG4gIHJldHVybiB7XG4gICAgY2xzOiBjbHMsXG4gICAgcHJpbWl0aXZlOiBwcmltaXRpdmUsXG4gICAgdGFnOiB0YWcsXG4gICAgdGFnU3RyOiB0YWdTdHJcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGVyRGVjb2RlTGVuKGJ1ZiwgcHJpbWl0aXZlLCBmYWlsKSB7XG4gIHZhciBsZW4gPSBidWYucmVhZFVJbnQ4KGZhaWwpO1xuICBpZiAoYnVmLmlzRXJyb3IobGVuKSlcbiAgICByZXR1cm4gbGVuO1xuXG4gIC8vIEluZGVmaW5pdGUgZm9ybVxuICBpZiAoIXByaW1pdGl2ZSAmJiBsZW4gPT09IDB4ODApXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgLy8gRGVmaW5pdGUgZm9ybVxuICBpZiAoKGxlbiAmIDB4ODApID09PSAwKSB7XG4gICAgLy8gU2hvcnQgZm9ybVxuICAgIHJldHVybiBsZW47XG4gIH1cblxuICAvLyBMb25nIGZvcm1cbiAgdmFyIG51bSA9IGxlbiAmIDB4N2Y7XG4gIGlmIChudW0gPiA0KVxuICAgIHJldHVybiBidWYuZXJyb3IoJ2xlbmd0aCBvY3RlY3QgaXMgdG9vIGxvbmcnKTtcblxuICBsZW4gPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bTsgaSsrKSB7XG4gICAgbGVuIDw8PSA4O1xuICAgIHZhciBqID0gYnVmLnJlYWRVSW50OChmYWlsKTtcbiAgICBpZiAoYnVmLmlzRXJyb3IoaikpXG4gICAgICByZXR1cm4gajtcbiAgICBsZW4gfD0gajtcbiAgfVxuXG4gIHJldHVybiBsZW47XG59XG4iXSwic291cmNlUm9vdCI6IiJ9