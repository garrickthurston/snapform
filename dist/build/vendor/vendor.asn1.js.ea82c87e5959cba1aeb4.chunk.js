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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS5qcy9saWIvYXNuMS9iYXNlL3JlcG9ydGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2FwaS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS5qcy9saWIvYXNuMS9jb25zdGFudHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEvZGVjb2RlcnMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEvZW5jb2RlcnMvZGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2VuY29kZXJzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2Jhc2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEvYmFzZS9idWZmZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEvYmFzZS9ub2RlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2VuY29kZXJzL3BlbS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS5qcy9saWIvYXNuMS9jb25zdGFudHMvZGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2RlY29kZXJzL3BlbS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNuMS5qcy9saWIvYXNuMS9kZWNvZGVycy9kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsZUFB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QUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCO0FBQ2hCO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUCxL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Q0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5hc24xLmpzLmVhODJjODdlNTk1OWNiYTFhZWI0LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcclxuXHJcbmZ1bmN0aW9uIFJlcG9ydGVyKG9wdGlvbnMpIHtcclxuICB0aGlzLl9yZXBvcnRlclN0YXRlID0ge1xyXG4gICAgb2JqOiBudWxsLFxyXG4gICAgcGF0aDogW10sXHJcbiAgICBvcHRpb25zOiBvcHRpb25zIHx8IHt9LFxyXG4gICAgZXJyb3JzOiBbXVxyXG4gIH07XHJcbn1cclxuZXhwb3J0cy5SZXBvcnRlciA9IFJlcG9ydGVyO1xyXG5cclxuUmVwb3J0ZXIucHJvdG90eXBlLmlzRXJyb3IgPSBmdW5jdGlvbiBpc0Vycm9yKG9iaikge1xyXG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiBSZXBvcnRlckVycm9yO1xyXG59O1xyXG5cclxuUmVwb3J0ZXIucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiBzYXZlKCkge1xyXG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlcG9ydGVyU3RhdGU7XHJcblxyXG4gIHJldHVybiB7IG9iajogc3RhdGUub2JqLCBwYXRoTGVuOiBzdGF0ZS5wYXRoLmxlbmd0aCB9O1xyXG59O1xyXG5cclxuUmVwb3J0ZXIucHJvdG90eXBlLnJlc3RvcmUgPSBmdW5jdGlvbiByZXN0b3JlKGRhdGEpIHtcclxuICB2YXIgc3RhdGUgPSB0aGlzLl9yZXBvcnRlclN0YXRlO1xyXG5cclxuICBzdGF0ZS5vYmogPSBkYXRhLm9iajtcclxuICBzdGF0ZS5wYXRoID0gc3RhdGUucGF0aC5zbGljZSgwLCBkYXRhLnBhdGhMZW4pO1xyXG59O1xyXG5cclxuUmVwb3J0ZXIucHJvdG90eXBlLmVudGVyS2V5ID0gZnVuY3Rpb24gZW50ZXJLZXkoa2V5KSB7XHJcbiAgcmV0dXJuIHRoaXMuX3JlcG9ydGVyU3RhdGUucGF0aC5wdXNoKGtleSk7XHJcbn07XHJcblxyXG5SZXBvcnRlci5wcm90b3R5cGUuZXhpdEtleSA9IGZ1bmN0aW9uIGV4aXRLZXkoaW5kZXgpIHtcclxuICB2YXIgc3RhdGUgPSB0aGlzLl9yZXBvcnRlclN0YXRlO1xyXG5cclxuICBzdGF0ZS5wYXRoID0gc3RhdGUucGF0aC5zbGljZSgwLCBpbmRleCAtIDEpO1xyXG59O1xyXG5cclxuUmVwb3J0ZXIucHJvdG90eXBlLmxlYXZlS2V5ID0gZnVuY3Rpb24gbGVhdmVLZXkoaW5kZXgsIGtleSwgdmFsdWUpIHtcclxuICB2YXIgc3RhdGUgPSB0aGlzLl9yZXBvcnRlclN0YXRlO1xyXG5cclxuICB0aGlzLmV4aXRLZXkoaW5kZXgpO1xyXG4gIGlmIChzdGF0ZS5vYmogIT09IG51bGwpXHJcbiAgICBzdGF0ZS5vYmpba2V5XSA9IHZhbHVlO1xyXG59O1xyXG5cclxuUmVwb3J0ZXIucHJvdG90eXBlLnBhdGggPSBmdW5jdGlvbiBwYXRoKCkge1xyXG4gIHJldHVybiB0aGlzLl9yZXBvcnRlclN0YXRlLnBhdGguam9pbignLycpO1xyXG59O1xyXG5cclxuUmVwb3J0ZXIucHJvdG90eXBlLmVudGVyT2JqZWN0ID0gZnVuY3Rpb24gZW50ZXJPYmplY3QoKSB7XHJcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVwb3J0ZXJTdGF0ZTtcclxuXHJcbiAgdmFyIHByZXYgPSBzdGF0ZS5vYmo7XHJcbiAgc3RhdGUub2JqID0ge307XHJcbiAgcmV0dXJuIHByZXY7XHJcbn07XHJcblxyXG5SZXBvcnRlci5wcm90b3R5cGUubGVhdmVPYmplY3QgPSBmdW5jdGlvbiBsZWF2ZU9iamVjdChwcmV2KSB7XHJcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVwb3J0ZXJTdGF0ZTtcclxuXHJcbiAgdmFyIG5vdyA9IHN0YXRlLm9iajtcclxuICBzdGF0ZS5vYmogPSBwcmV2O1xyXG4gIHJldHVybiBub3c7XHJcbn07XHJcblxyXG5SZXBvcnRlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiBlcnJvcihtc2cpIHtcclxuICB2YXIgZXJyO1xyXG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlcG9ydGVyU3RhdGU7XHJcblxyXG4gIHZhciBpbmhlcml0ZWQgPSBtc2cgaW5zdGFuY2VvZiBSZXBvcnRlckVycm9yO1xyXG4gIGlmIChpbmhlcml0ZWQpIHtcclxuICAgIGVyciA9IG1zZztcclxuICB9IGVsc2Uge1xyXG4gICAgZXJyID0gbmV3IFJlcG9ydGVyRXJyb3Ioc3RhdGUucGF0aC5tYXAoZnVuY3Rpb24oZWxlbSkge1xyXG4gICAgICByZXR1cm4gJ1snICsgSlNPTi5zdHJpbmdpZnkoZWxlbSkgKyAnXSc7XHJcbiAgICB9KS5qb2luKCcnKSwgbXNnLm1lc3NhZ2UgfHwgbXNnLCBtc2cuc3RhY2spO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFzdGF0ZS5vcHRpb25zLnBhcnRpYWwpXHJcbiAgICB0aHJvdyBlcnI7XHJcblxyXG4gIGlmICghaW5oZXJpdGVkKVxyXG4gICAgc3RhdGUuZXJyb3JzLnB1c2goZXJyKTtcclxuXHJcbiAgcmV0dXJuIGVycjtcclxufTtcclxuXHJcblJlcG9ydGVyLnByb3RvdHlwZS53cmFwUmVzdWx0ID0gZnVuY3Rpb24gd3JhcFJlc3VsdChyZXN1bHQpIHtcclxuICB2YXIgc3RhdGUgPSB0aGlzLl9yZXBvcnRlclN0YXRlO1xyXG4gIGlmICghc3RhdGUub3B0aW9ucy5wYXJ0aWFsKVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHJlc3VsdDogdGhpcy5pc0Vycm9yKHJlc3VsdCkgPyBudWxsIDogcmVzdWx0LFxyXG4gICAgZXJyb3JzOiBzdGF0ZS5lcnJvcnNcclxuICB9O1xyXG59O1xyXG5cclxuZnVuY3Rpb24gUmVwb3J0ZXJFcnJvcihwYXRoLCBtc2cpIHtcclxuICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gIHRoaXMucmV0aHJvdyhtc2cpO1xyXG59O1xyXG5pbmhlcml0cyhSZXBvcnRlckVycm9yLCBFcnJvcik7XHJcblxyXG5SZXBvcnRlckVycm9yLnByb3RvdHlwZS5yZXRocm93ID0gZnVuY3Rpb24gcmV0aHJvdyhtc2cpIHtcclxuICB0aGlzLm1lc3NhZ2UgPSBtc2cgKyAnIGF0OiAnICsgKHRoaXMucGF0aCB8fCAnKHNoYWxsb3cpJyk7XHJcbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxyXG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgUmVwb3J0ZXJFcnJvcik7XHJcblxyXG4gIGlmICghdGhpcy5zdGFjaykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gSUUgb25seSBhZGRzIHN0YWNrIHdoZW4gdGhyb3duXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLm1lc3NhZ2UpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICB0aGlzLnN0YWNrID0gZS5zdGFjaztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcbiIsInZhciBhc24xID0gcmVxdWlyZSgnLi4vYXNuMScpO1xyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG5cclxudmFyIGFwaSA9IGV4cG9ydHM7XHJcblxyXG5hcGkuZGVmaW5lID0gZnVuY3Rpb24gZGVmaW5lKG5hbWUsIGJvZHkpIHtcclxuICByZXR1cm4gbmV3IEVudGl0eShuYW1lLCBib2R5KTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIEVudGl0eShuYW1lLCBib2R5KSB7XHJcbiAgdGhpcy5uYW1lID0gbmFtZTtcclxuICB0aGlzLmJvZHkgPSBib2R5O1xyXG5cclxuICB0aGlzLmRlY29kZXJzID0ge307XHJcbiAgdGhpcy5lbmNvZGVycyA9IHt9O1xyXG59O1xyXG5cclxuRW50aXR5LnByb3RvdHlwZS5fY3JlYXRlTmFtZWQgPSBmdW5jdGlvbiBjcmVhdGVOYW1lZChiYXNlKSB7XHJcbiAgdmFyIG5hbWVkO1xyXG4gIHRyeSB7XHJcbiAgICBuYW1lZCA9IHJlcXVpcmUoJ3ZtJykucnVuSW5UaGlzQ29udGV4dChcclxuICAgICAgJyhmdW5jdGlvbiAnICsgdGhpcy5uYW1lICsgJyhlbnRpdHkpIHtcXG4nICtcclxuICAgICAgJyAgdGhpcy5faW5pdE5hbWVkKGVudGl0eSk7XFxuJyArXHJcbiAgICAgICd9KSdcclxuICAgICk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgbmFtZWQgPSBmdW5jdGlvbiAoZW50aXR5KSB7XHJcbiAgICAgIHRoaXMuX2luaXROYW1lZChlbnRpdHkpO1xyXG4gICAgfTtcclxuICB9XHJcbiAgaW5oZXJpdHMobmFtZWQsIGJhc2UpO1xyXG4gIG5hbWVkLnByb3RvdHlwZS5faW5pdE5hbWVkID0gZnVuY3Rpb24gaW5pdG5hbWVkKGVudGl0eSkge1xyXG4gICAgYmFzZS5jYWxsKHRoaXMsIGVudGl0eSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIG5ldyBuYW1lZCh0aGlzKTtcclxufTtcclxuXHJcbkVudGl0eS5wcm90b3R5cGUuX2dldERlY29kZXIgPSBmdW5jdGlvbiBfZ2V0RGVjb2RlcihlbmMpIHtcclxuICBlbmMgPSBlbmMgfHwgJ2Rlcic7XHJcbiAgLy8gTGF6aWx5IGNyZWF0ZSBkZWNvZGVyXHJcbiAgaWYgKCF0aGlzLmRlY29kZXJzLmhhc093blByb3BlcnR5KGVuYykpXHJcbiAgICB0aGlzLmRlY29kZXJzW2VuY10gPSB0aGlzLl9jcmVhdGVOYW1lZChhc24xLmRlY29kZXJzW2VuY10pO1xyXG4gIHJldHVybiB0aGlzLmRlY29kZXJzW2VuY107XHJcbn07XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmRlY29kZSA9IGZ1bmN0aW9uIGRlY29kZShkYXRhLCBlbmMsIG9wdGlvbnMpIHtcclxuICByZXR1cm4gdGhpcy5fZ2V0RGVjb2RlcihlbmMpLmRlY29kZShkYXRhLCBvcHRpb25zKTtcclxufTtcclxuXHJcbkVudGl0eS5wcm90b3R5cGUuX2dldEVuY29kZXIgPSBmdW5jdGlvbiBfZ2V0RW5jb2RlcihlbmMpIHtcclxuICBlbmMgPSBlbmMgfHwgJ2Rlcic7XHJcbiAgLy8gTGF6aWx5IGNyZWF0ZSBlbmNvZGVyXHJcbiAgaWYgKCF0aGlzLmVuY29kZXJzLmhhc093blByb3BlcnR5KGVuYykpXHJcbiAgICB0aGlzLmVuY29kZXJzW2VuY10gPSB0aGlzLl9jcmVhdGVOYW1lZChhc24xLmVuY29kZXJzW2VuY10pO1xyXG4gIHJldHVybiB0aGlzLmVuY29kZXJzW2VuY107XHJcbn07XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmVuY29kZSA9IGZ1bmN0aW9uIGVuY29kZShkYXRhLCBlbmMsIC8qIGludGVybmFsICovIHJlcG9ydGVyKSB7XHJcbiAgcmV0dXJuIHRoaXMuX2dldEVuY29kZXIoZW5jKS5lbmNvZGUoZGF0YSwgcmVwb3J0ZXIpO1xyXG59O1xyXG4iLCJ2YXIgY29uc3RhbnRzID0gZXhwb3J0cztcclxuXHJcbi8vIEhlbHBlclxyXG5jb25zdGFudHMuX3JldmVyc2UgPSBmdW5jdGlvbiByZXZlcnNlKG1hcCkge1xyXG4gIHZhciByZXMgPSB7fTtcclxuXHJcbiAgT2JqZWN0LmtleXMobWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xyXG4gICAgLy8gQ29udmVydCBrZXkgdG8gaW50ZWdlciBpZiBpdCBpcyBzdHJpbmdpZmllZFxyXG4gICAgaWYgKChrZXkgfCAwKSA9PSBrZXkpXHJcbiAgICAgIGtleSA9IGtleSB8IDA7XHJcblxyXG4gICAgdmFyIHZhbHVlID0gbWFwW2tleV07XHJcbiAgICByZXNbdmFsdWVdID0ga2V5O1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gcmVzO1xyXG59O1xyXG5cclxuY29uc3RhbnRzLmRlciA9IHJlcXVpcmUoJy4vZGVyJyk7XHJcbiIsInZhciBkZWNvZGVycyA9IGV4cG9ydHM7XHJcblxyXG5kZWNvZGVycy5kZXIgPSByZXF1aXJlKCcuL2RlcicpO1xyXG5kZWNvZGVycy5wZW0gPSByZXF1aXJlKCcuL3BlbScpO1xyXG4iLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xyXG5cclxudmFyIGFzbjEgPSByZXF1aXJlKCcuLi8uLi9hc24xJyk7XHJcbnZhciBiYXNlID0gYXNuMS5iYXNlO1xyXG5cclxuLy8gSW1wb3J0IERFUiBjb25zdGFudHNcclxudmFyIGRlciA9IGFzbjEuY29uc3RhbnRzLmRlcjtcclxuXHJcbmZ1bmN0aW9uIERFUkVuY29kZXIoZW50aXR5KSB7XHJcbiAgdGhpcy5lbmMgPSAnZGVyJztcclxuICB0aGlzLm5hbWUgPSBlbnRpdHkubmFtZTtcclxuICB0aGlzLmVudGl0eSA9IGVudGl0eTtcclxuXHJcbiAgLy8gQ29uc3RydWN0IGJhc2UgdHJlZVxyXG4gIHRoaXMudHJlZSA9IG5ldyBERVJOb2RlKCk7XHJcbiAgdGhpcy50cmVlLl9pbml0KGVudGl0eS5ib2R5KTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBERVJFbmNvZGVyO1xyXG5cclxuREVSRW5jb2Rlci5wcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24gZW5jb2RlKGRhdGEsIHJlcG9ydGVyKSB7XHJcbiAgcmV0dXJuIHRoaXMudHJlZS5fZW5jb2RlKGRhdGEsIHJlcG9ydGVyKS5qb2luKCk7XHJcbn07XHJcblxyXG4vLyBUcmVlIG1ldGhvZHNcclxuXHJcbmZ1bmN0aW9uIERFUk5vZGUocGFyZW50KSB7XHJcbiAgYmFzZS5Ob2RlLmNhbGwodGhpcywgJ2RlcicsIHBhcmVudCk7XHJcbn1cclxuaW5oZXJpdHMoREVSTm9kZSwgYmFzZS5Ob2RlKTtcclxuXHJcbkRFUk5vZGUucHJvdG90eXBlLl9lbmNvZGVDb21wb3NpdGUgPSBmdW5jdGlvbiBlbmNvZGVDb21wb3NpdGUodGFnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW1pdGl2ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCkge1xyXG4gIHZhciBlbmNvZGVkVGFnID0gZW5jb2RlVGFnKHRhZywgcHJpbWl0aXZlLCBjbHMsIHRoaXMucmVwb3J0ZXIpO1xyXG5cclxuICAvLyBTaG9ydCBmb3JtXHJcbiAgaWYgKGNvbnRlbnQubGVuZ3RoIDwgMHg4MCkge1xyXG4gICAgdmFyIGhlYWRlciA9IG5ldyBCdWZmZXIoMik7XHJcbiAgICBoZWFkZXJbMF0gPSBlbmNvZGVkVGFnO1xyXG4gICAgaGVhZGVyWzFdID0gY29udGVudC5sZW5ndGg7XHJcbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihbIGhlYWRlciwgY29udGVudCBdKTtcclxuICB9XHJcblxyXG4gIC8vIExvbmcgZm9ybVxyXG4gIC8vIENvdW50IG9jdGV0cyByZXF1aXJlZCB0byBzdG9yZSBsZW5ndGhcclxuICB2YXIgbGVuT2N0ZXRzID0gMTtcclxuICBmb3IgKHZhciBpID0gY29udGVudC5sZW5ndGg7IGkgPj0gMHgxMDA7IGkgPj49IDgpXHJcbiAgICBsZW5PY3RldHMrKztcclxuXHJcbiAgdmFyIGhlYWRlciA9IG5ldyBCdWZmZXIoMSArIDEgKyBsZW5PY3RldHMpO1xyXG4gIGhlYWRlclswXSA9IGVuY29kZWRUYWc7XHJcbiAgaGVhZGVyWzFdID0gMHg4MCB8IGxlbk9jdGV0cztcclxuXHJcbiAgZm9yICh2YXIgaSA9IDEgKyBsZW5PY3RldHMsIGogPSBjb250ZW50Lmxlbmd0aDsgaiA+IDA7IGktLSwgaiA+Pj0gOClcclxuICAgIGhlYWRlcltpXSA9IGogJiAweGZmO1xyXG5cclxuICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihbIGhlYWRlciwgY29udGVudCBdKTtcclxufTtcclxuXHJcbkRFUk5vZGUucHJvdG90eXBlLl9lbmNvZGVTdHIgPSBmdW5jdGlvbiBlbmNvZGVTdHIoc3RyLCB0YWcpIHtcclxuICBpZiAodGFnID09PSAnYml0c3RyJykge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIoWyBzdHIudW51c2VkIHwgMCwgc3RyLmRhdGEgXSk7XHJcbiAgfSBlbHNlIGlmICh0YWcgPT09ICdibXBzdHInKSB7XHJcbiAgICB2YXIgYnVmID0gbmV3IEJ1ZmZlcihzdHIubGVuZ3RoICogMik7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBidWYud3JpdGVVSW50MTZCRShzdHIuY2hhckNvZGVBdChpKSwgaSAqIDIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIoYnVmKTtcclxuICB9IGVsc2UgaWYgKHRhZyA9PT0gJ251bXN0cicpIHtcclxuICAgIGlmICghdGhpcy5faXNOdW1zdHIoc3RyKSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5yZXBvcnRlci5lcnJvcignRW5jb2Rpbmcgb2Ygc3RyaW5nIHR5cGU6IG51bXN0ciBzdXBwb3J0cyAnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29ubHkgZGlnaXRzIGFuZCBzcGFjZScpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIoc3RyKTtcclxuICB9IGVsc2UgaWYgKHRhZyA9PT0gJ3ByaW50c3RyJykge1xyXG4gICAgaWYgKCF0aGlzLl9pc1ByaW50c3RyKHN0cikpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucmVwb3J0ZXIuZXJyb3IoJ0VuY29kaW5nIG9mIHN0cmluZyB0eXBlOiBwcmludHN0ciBzdXBwb3J0cyAnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29ubHkgbGF0aW4gdXBwZXIgYW5kIGxvd2VyIGNhc2UgbGV0dGVycywgJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkaWdpdHMsIHNwYWNlLCBhcG9zdHJvcGhlLCBsZWZ0IGFuZCByaWd0aCAnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BhcmVudGhlc2lzLCBwbHVzIHNpZ24sIGNvbW1hLCBoeXBoZW4sICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZG90LCBzbGFzaCwgY29sb24sIGVxdWFsIHNpZ24sICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncXVlc3Rpb24gbWFyaycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIoc3RyKTtcclxuICB9IGVsc2UgaWYgKC9zdHIkLy50ZXN0KHRhZykpIHtcclxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVFbmNvZGVyQnVmZmVyKHN0cik7XHJcbiAgfSBlbHNlIGlmICh0YWcgPT09ICdvYmpEZXNjJykge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIoc3RyKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHRoaXMucmVwb3J0ZXIuZXJyb3IoJ0VuY29kaW5nIG9mIHN0cmluZyB0eXBlOiAnICsgdGFnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgdW5zdXBwb3J0ZWQnKTtcclxuICB9XHJcbn07XHJcblxyXG5ERVJOb2RlLnByb3RvdHlwZS5fZW5jb2RlT2JqaWQgPSBmdW5jdGlvbiBlbmNvZGVPYmppZChpZCwgdmFsdWVzLCByZWxhdGl2ZSkge1xyXG4gIGlmICh0eXBlb2YgaWQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICBpZiAoIXZhbHVlcylcclxuICAgICAgcmV0dXJuIHRoaXMucmVwb3J0ZXIuZXJyb3IoJ3N0cmluZyBvYmppZCBnaXZlbiwgYnV0IG5vIHZhbHVlcyBtYXAgZm91bmQnKTtcclxuICAgIGlmICghdmFsdWVzLmhhc093blByb3BlcnR5KGlkKSlcclxuICAgICAgcmV0dXJuIHRoaXMucmVwb3J0ZXIuZXJyb3IoJ29iamlkIG5vdCBmb3VuZCBpbiB2YWx1ZXMgbWFwJyk7XHJcbiAgICBpZCA9IHZhbHVlc1tpZF0uc3BsaXQoL1tcXHNcXC5dKy9nKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaWQubGVuZ3RoOyBpKyspXHJcbiAgICAgIGlkW2ldIHw9IDA7XHJcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGlkKSkge1xyXG4gICAgaWQgPSBpZC5zbGljZSgpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpZC5sZW5ndGg7IGkrKylcclxuICAgICAgaWRbaV0gfD0gMDtcclxuICB9XHJcblxyXG4gIGlmICghQXJyYXkuaXNBcnJheShpZCkpIHtcclxuICAgIHJldHVybiB0aGlzLnJlcG9ydGVyLmVycm9yKCdvYmppZCgpIHNob3VsZCBiZSBlaXRoZXIgYXJyYXkgb3Igc3RyaW5nLCAnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdnb3Q6ICcgKyBKU09OLnN0cmluZ2lmeShpZCkpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFyZWxhdGl2ZSkge1xyXG4gICAgaWYgKGlkWzFdID49IDQwKVxyXG4gICAgICByZXR1cm4gdGhpcy5yZXBvcnRlci5lcnJvcignU2Vjb25kIG9iamlkIGlkZW50aWZpZXIgT09CJyk7XHJcbiAgICBpZC5zcGxpY2UoMCwgMiwgaWRbMF0gKiA0MCArIGlkWzFdKTtcclxuICB9XHJcblxyXG4gIC8vIENvdW50IG51bWJlciBvZiBvY3RldHNcclxuICB2YXIgc2l6ZSA9IDA7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBpZC5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGlkZW50ID0gaWRbaV07XHJcbiAgICBmb3IgKHNpemUrKzsgaWRlbnQgPj0gMHg4MDsgaWRlbnQgPj49IDcpXHJcbiAgICAgIHNpemUrKztcclxuICB9XHJcblxyXG4gIHZhciBvYmppZCA9IG5ldyBCdWZmZXIoc2l6ZSk7XHJcbiAgdmFyIG9mZnNldCA9IG9iamlkLmxlbmd0aCAtIDE7XHJcbiAgZm9yICh2YXIgaSA9IGlkLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICB2YXIgaWRlbnQgPSBpZFtpXTtcclxuICAgIG9iamlkW29mZnNldC0tXSA9IGlkZW50ICYgMHg3ZjtcclxuICAgIHdoaWxlICgoaWRlbnQgPj49IDcpID4gMClcclxuICAgICAgb2JqaWRbb2Zmc2V0LS1dID0gMHg4MCB8IChpZGVudCAmIDB4N2YpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIob2JqaWQpO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gdHdvKG51bSkge1xyXG4gIGlmIChudW0gPCAxMClcclxuICAgIHJldHVybiAnMCcgKyBudW07XHJcbiAgZWxzZVxyXG4gICAgcmV0dXJuIG51bTtcclxufVxyXG5cclxuREVSTm9kZS5wcm90b3R5cGUuX2VuY29kZVRpbWUgPSBmdW5jdGlvbiBlbmNvZGVUaW1lKHRpbWUsIHRhZykge1xyXG4gIHZhciBzdHI7XHJcbiAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh0aW1lKTtcclxuXHJcbiAgaWYgKHRhZyA9PT0gJ2dlbnRpbWUnKSB7XHJcbiAgICBzdHIgPSBbXHJcbiAgICAgIHR3byhkYXRlLmdldEZ1bGxZZWFyKCkpLFxyXG4gICAgICB0d28oZGF0ZS5nZXRVVENNb250aCgpICsgMSksXHJcbiAgICAgIHR3byhkYXRlLmdldFVUQ0RhdGUoKSksXHJcbiAgICAgIHR3byhkYXRlLmdldFVUQ0hvdXJzKCkpLFxyXG4gICAgICB0d28oZGF0ZS5nZXRVVENNaW51dGVzKCkpLFxyXG4gICAgICB0d28oZGF0ZS5nZXRVVENTZWNvbmRzKCkpLFxyXG4gICAgICAnWidcclxuICAgIF0uam9pbignJyk7XHJcbiAgfSBlbHNlIGlmICh0YWcgPT09ICd1dGN0aW1lJykge1xyXG4gICAgc3RyID0gW1xyXG4gICAgICB0d28oZGF0ZS5nZXRGdWxsWWVhcigpICUgMTAwKSxcclxuICAgICAgdHdvKGRhdGUuZ2V0VVRDTW9udGgoKSArIDEpLFxyXG4gICAgICB0d28oZGF0ZS5nZXRVVENEYXRlKCkpLFxyXG4gICAgICB0d28oZGF0ZS5nZXRVVENIb3VycygpKSxcclxuICAgICAgdHdvKGRhdGUuZ2V0VVRDTWludXRlcygpKSxcclxuICAgICAgdHdvKGRhdGUuZ2V0VVRDU2Vjb25kcygpKSxcclxuICAgICAgJ1onXHJcbiAgICBdLmpvaW4oJycpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLnJlcG9ydGVyLmVycm9yKCdFbmNvZGluZyAnICsgdGFnICsgJyB0aW1lIGlzIG5vdCBzdXBwb3J0ZWQgeWV0Jyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcy5fZW5jb2RlU3RyKHN0ciwgJ29jdHN0cicpO1xyXG59O1xyXG5cclxuREVSTm9kZS5wcm90b3R5cGUuX2VuY29kZU51bGwgPSBmdW5jdGlvbiBlbmNvZGVOdWxsKCkge1xyXG4gIHJldHVybiB0aGlzLl9jcmVhdGVFbmNvZGVyQnVmZmVyKCcnKTtcclxufTtcclxuXHJcbkRFUk5vZGUucHJvdG90eXBlLl9lbmNvZGVJbnQgPSBmdW5jdGlvbiBlbmNvZGVJbnQobnVtLCB2YWx1ZXMpIHtcclxuICBpZiAodHlwZW9mIG51bSA9PT0gJ3N0cmluZycpIHtcclxuICAgIGlmICghdmFsdWVzKVxyXG4gICAgICByZXR1cm4gdGhpcy5yZXBvcnRlci5lcnJvcignU3RyaW5nIGludCBvciBlbnVtIGdpdmVuLCBidXQgbm8gdmFsdWVzIG1hcCcpO1xyXG4gICAgaWYgKCF2YWx1ZXMuaGFzT3duUHJvcGVydHkobnVtKSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5yZXBvcnRlci5lcnJvcignVmFsdWVzIG1hcCBkb2VzblxcJ3QgY29udGFpbjogJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KG51bSkpO1xyXG4gICAgfVxyXG4gICAgbnVtID0gdmFsdWVzW251bV07XHJcbiAgfVxyXG5cclxuICAvLyBCaWdudW0sIGFzc3VtZSBiaWcgZW5kaWFuXHJcbiAgaWYgKHR5cGVvZiBudW0gIT09ICdudW1iZXInICYmICFCdWZmZXIuaXNCdWZmZXIobnVtKSkge1xyXG4gICAgdmFyIG51bUFycmF5ID0gbnVtLnRvQXJyYXkoKTtcclxuICAgIGlmICghbnVtLnNpZ24gJiYgbnVtQXJyYXlbMF0gJiAweDgwKSB7XHJcbiAgICAgIG51bUFycmF5LnVuc2hpZnQoMCk7XHJcbiAgICB9XHJcbiAgICBudW0gPSBuZXcgQnVmZmVyKG51bUFycmF5KTtcclxuICB9XHJcblxyXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIobnVtKSkge1xyXG4gICAgdmFyIHNpemUgPSBudW0ubGVuZ3RoO1xyXG4gICAgaWYgKG51bS5sZW5ndGggPT09IDApXHJcbiAgICAgIHNpemUrKztcclxuXHJcbiAgICB2YXIgb3V0ID0gbmV3IEJ1ZmZlcihzaXplKTtcclxuICAgIG51bS5jb3B5KG91dCk7XHJcbiAgICBpZiAobnVtLmxlbmd0aCA9PT0gMClcclxuICAgICAgb3V0WzBdID0gMFxyXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIob3V0KTtcclxuICB9XHJcblxyXG4gIGlmIChudW0gPCAweDgwKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIobnVtKTtcclxuXHJcbiAgaWYgKG51bSA8IDB4MTAwKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIoWzAsIG51bV0pO1xyXG5cclxuICB2YXIgc2l6ZSA9IDE7XHJcbiAgZm9yICh2YXIgaSA9IG51bTsgaSA+PSAweDEwMDsgaSA+Pj0gOClcclxuICAgIHNpemUrKztcclxuXHJcbiAgdmFyIG91dCA9IG5ldyBBcnJheShzaXplKTtcclxuICBmb3IgKHZhciBpID0gb3V0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICBvdXRbaV0gPSBudW0gJiAweGZmO1xyXG4gICAgbnVtID4+PSA4O1xyXG4gIH1cclxuICBpZihvdXRbMF0gJiAweDgwKSB7XHJcbiAgICBvdXQudW5zaGlmdCgwKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzLl9jcmVhdGVFbmNvZGVyQnVmZmVyKG5ldyBCdWZmZXIob3V0KSk7XHJcbn07XHJcblxyXG5ERVJOb2RlLnByb3RvdHlwZS5fZW5jb2RlQm9vbCA9IGZ1bmN0aW9uIGVuY29kZUJvb2wodmFsdWUpIHtcclxuICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcih2YWx1ZSA/IDB4ZmYgOiAwKTtcclxufTtcclxuXHJcbkRFUk5vZGUucHJvdG90eXBlLl91c2UgPSBmdW5jdGlvbiB1c2UoZW50aXR5LCBvYmopIHtcclxuICBpZiAodHlwZW9mIGVudGl0eSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgIGVudGl0eSA9IGVudGl0eShvYmopO1xyXG4gIHJldHVybiBlbnRpdHkuX2dldEVuY29kZXIoJ2RlcicpLnRyZWU7XHJcbn07XHJcblxyXG5ERVJOb2RlLnByb3RvdHlwZS5fc2tpcERlZmF1bHQgPSBmdW5jdGlvbiBza2lwRGVmYXVsdChkYXRhQnVmZmVyLCByZXBvcnRlciwgcGFyZW50KSB7XHJcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xyXG4gIHZhciBpO1xyXG4gIGlmIChzdGF0ZVsnZGVmYXVsdCddID09PSBudWxsKVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICB2YXIgZGF0YSA9IGRhdGFCdWZmZXIuam9pbigpO1xyXG4gIGlmIChzdGF0ZS5kZWZhdWx0QnVmZmVyID09PSB1bmRlZmluZWQpXHJcbiAgICBzdGF0ZS5kZWZhdWx0QnVmZmVyID0gdGhpcy5fZW5jb2RlVmFsdWUoc3RhdGVbJ2RlZmF1bHQnXSwgcmVwb3J0ZXIsIHBhcmVudCkuam9pbigpO1xyXG5cclxuICBpZiAoZGF0YS5sZW5ndGggIT09IHN0YXRlLmRlZmF1bHRCdWZmZXIubGVuZ3RoKVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICBmb3IgKGk9MDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXHJcbiAgICBpZiAoZGF0YVtpXSAhPT0gc3RhdGUuZGVmYXVsdEJ1ZmZlcltpXSlcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8vIFV0aWxpdHkgbWV0aG9kc1xyXG5cclxuZnVuY3Rpb24gZW5jb2RlVGFnKHRhZywgcHJpbWl0aXZlLCBjbHMsIHJlcG9ydGVyKSB7XHJcbiAgdmFyIHJlcztcclxuXHJcbiAgaWYgKHRhZyA9PT0gJ3NlcW9mJylcclxuICAgIHRhZyA9ICdzZXEnO1xyXG4gIGVsc2UgaWYgKHRhZyA9PT0gJ3NldG9mJylcclxuICAgIHRhZyA9ICdzZXQnO1xyXG5cclxuICBpZiAoZGVyLnRhZ0J5TmFtZS5oYXNPd25Qcm9wZXJ0eSh0YWcpKVxyXG4gICAgcmVzID0gZGVyLnRhZ0J5TmFtZVt0YWddO1xyXG4gIGVsc2UgaWYgKHR5cGVvZiB0YWcgPT09ICdudW1iZXInICYmICh0YWcgfCAwKSA9PT0gdGFnKVxyXG4gICAgcmVzID0gdGFnO1xyXG4gIGVsc2VcclxuICAgIHJldHVybiByZXBvcnRlci5lcnJvcignVW5rbm93biB0YWc6ICcgKyB0YWcpO1xyXG5cclxuICBpZiAocmVzID49IDB4MWYpXHJcbiAgICByZXR1cm4gcmVwb3J0ZXIuZXJyb3IoJ011bHRpLW9jdGV0IHRhZyBlbmNvZGluZyB1bnN1cHBvcnRlZCcpO1xyXG5cclxuICBpZiAoIXByaW1pdGl2ZSlcclxuICAgIHJlcyB8PSAweDIwO1xyXG5cclxuICByZXMgfD0gKGRlci50YWdDbGFzc0J5TmFtZVtjbHMgfHwgJ3VuaXZlcnNhbCddIDw8IDYpO1xyXG5cclxuICByZXR1cm4gcmVzO1xyXG59XHJcbiIsInZhciBlbmNvZGVycyA9IGV4cG9ydHM7XHJcblxyXG5lbmNvZGVycy5kZXIgPSByZXF1aXJlKCcuL2RlcicpO1xyXG5lbmNvZGVycy5wZW0gPSByZXF1aXJlKCcuL3BlbScpO1xyXG4iLCJ2YXIgYmFzZSA9IGV4cG9ydHM7XHJcblxyXG5iYXNlLlJlcG9ydGVyID0gcmVxdWlyZSgnLi9yZXBvcnRlcicpLlJlcG9ydGVyO1xyXG5iYXNlLkRlY29kZXJCdWZmZXIgPSByZXF1aXJlKCcuL2J1ZmZlcicpLkRlY29kZXJCdWZmZXI7XHJcbmJhc2UuRW5jb2RlckJ1ZmZlciA9IHJlcXVpcmUoJy4vYnVmZmVyJykuRW5jb2RlckJ1ZmZlcjtcclxuYmFzZS5Ob2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XHJcbiIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XHJcbnZhciBSZXBvcnRlciA9IHJlcXVpcmUoJy4uL2Jhc2UnKS5SZXBvcnRlcjtcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcclxuXHJcbmZ1bmN0aW9uIERlY29kZXJCdWZmZXIoYmFzZSwgb3B0aW9ucykge1xyXG4gIFJlcG9ydGVyLmNhbGwodGhpcywgb3B0aW9ucyk7XHJcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYmFzZSkpIHtcclxuICAgIHRoaXMuZXJyb3IoJ0lucHV0IG5vdCBCdWZmZXInKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHRoaXMuYmFzZSA9IGJhc2U7XHJcbiAgdGhpcy5vZmZzZXQgPSAwO1xyXG4gIHRoaXMubGVuZ3RoID0gYmFzZS5sZW5ndGg7XHJcbn1cclxuaW5oZXJpdHMoRGVjb2RlckJ1ZmZlciwgUmVwb3J0ZXIpO1xyXG5leHBvcnRzLkRlY29kZXJCdWZmZXIgPSBEZWNvZGVyQnVmZmVyO1xyXG5cclxuRGVjb2RlckJ1ZmZlci5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uIHNhdmUoKSB7XHJcbiAgcmV0dXJuIHsgb2Zmc2V0OiB0aGlzLm9mZnNldCwgcmVwb3J0ZXI6IFJlcG9ydGVyLnByb3RvdHlwZS5zYXZlLmNhbGwodGhpcykgfTtcclxufTtcclxuXHJcbkRlY29kZXJCdWZmZXIucHJvdG90eXBlLnJlc3RvcmUgPSBmdW5jdGlvbiByZXN0b3JlKHNhdmUpIHtcclxuICAvLyBSZXR1cm4gc2tpcHBlZCBkYXRhXHJcbiAgdmFyIHJlcyA9IG5ldyBEZWNvZGVyQnVmZmVyKHRoaXMuYmFzZSk7XHJcbiAgcmVzLm9mZnNldCA9IHNhdmUub2Zmc2V0O1xyXG4gIHJlcy5sZW5ndGggPSB0aGlzLm9mZnNldDtcclxuXHJcbiAgdGhpcy5vZmZzZXQgPSBzYXZlLm9mZnNldDtcclxuICBSZXBvcnRlci5wcm90b3R5cGUucmVzdG9yZS5jYWxsKHRoaXMsIHNhdmUucmVwb3J0ZXIpO1xyXG5cclxuICByZXR1cm4gcmVzO1xyXG59O1xyXG5cclxuRGVjb2RlckJ1ZmZlci5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uIGlzRW1wdHkoKSB7XHJcbiAgcmV0dXJuIHRoaXMub2Zmc2V0ID09PSB0aGlzLmxlbmd0aDtcclxufTtcclxuXHJcbkRlY29kZXJCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OChmYWlsKSB7XHJcbiAgaWYgKHRoaXMub2Zmc2V0ICsgMSA8PSB0aGlzLmxlbmd0aClcclxuICAgIHJldHVybiB0aGlzLmJhc2UucmVhZFVJbnQ4KHRoaXMub2Zmc2V0KyssIHRydWUpO1xyXG4gIGVsc2VcclxuICAgIHJldHVybiB0aGlzLmVycm9yKGZhaWwgfHwgJ0RlY29kZXJCdWZmZXIgb3ZlcnJ1bicpO1xyXG59XHJcblxyXG5EZWNvZGVyQnVmZmVyLnByb3RvdHlwZS5za2lwID0gZnVuY3Rpb24gc2tpcChieXRlcywgZmFpbCkge1xyXG4gIGlmICghKHRoaXMub2Zmc2V0ICsgYnl0ZXMgPD0gdGhpcy5sZW5ndGgpKVxyXG4gICAgcmV0dXJuIHRoaXMuZXJyb3IoZmFpbCB8fCAnRGVjb2RlckJ1ZmZlciBvdmVycnVuJyk7XHJcblxyXG4gIHZhciByZXMgPSBuZXcgRGVjb2RlckJ1ZmZlcih0aGlzLmJhc2UpO1xyXG5cclxuICAvLyBTaGFyZSByZXBvcnRlciBzdGF0ZVxyXG4gIHJlcy5fcmVwb3J0ZXJTdGF0ZSA9IHRoaXMuX3JlcG9ydGVyU3RhdGU7XHJcblxyXG4gIHJlcy5vZmZzZXQgPSB0aGlzLm9mZnNldDtcclxuICByZXMubGVuZ3RoID0gdGhpcy5vZmZzZXQgKyBieXRlcztcclxuICB0aGlzLm9mZnNldCArPSBieXRlcztcclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG5EZWNvZGVyQnVmZmVyLnByb3RvdHlwZS5yYXcgPSBmdW5jdGlvbiByYXcoc2F2ZSkge1xyXG4gIHJldHVybiB0aGlzLmJhc2Uuc2xpY2Uoc2F2ZSA/IHNhdmUub2Zmc2V0IDogdGhpcy5vZmZzZXQsIHRoaXMubGVuZ3RoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gRW5jb2RlckJ1ZmZlcih2YWx1ZSwgcmVwb3J0ZXIpIHtcclxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgIHRoaXMubGVuZ3RoID0gMDtcclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZS5tYXAoZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgRW5jb2RlckJ1ZmZlcikpXHJcbiAgICAgICAgaXRlbSA9IG5ldyBFbmNvZGVyQnVmZmVyKGl0ZW0sIHJlcG9ydGVyKTtcclxuICAgICAgdGhpcy5sZW5ndGggKz0gaXRlbS5sZW5ndGg7XHJcbiAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfSwgdGhpcyk7XHJcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XHJcbiAgICBpZiAoISgwIDw9IHZhbHVlICYmIHZhbHVlIDw9IDB4ZmYpKVxyXG4gICAgICByZXR1cm4gcmVwb3J0ZXIuZXJyb3IoJ25vbi1ieXRlIEVuY29kZXJCdWZmZXIgdmFsdWUnKTtcclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIHRoaXMubGVuZ3RoID0gMTtcclxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIHRoaXMubGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgodmFsdWUpO1xyXG4gIH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbHVlKSkge1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgdGhpcy5sZW5ndGggPSB2YWx1ZS5sZW5ndGg7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiByZXBvcnRlci5lcnJvcignVW5zdXBwb3J0ZWQgdHlwZTogJyArIHR5cGVvZiB2YWx1ZSk7XHJcbiAgfVxyXG59XHJcbmV4cG9ydHMuRW5jb2RlckJ1ZmZlciA9IEVuY29kZXJCdWZmZXI7XHJcblxyXG5FbmNvZGVyQnVmZmVyLnByb3RvdHlwZS5qb2luID0gZnVuY3Rpb24gam9pbihvdXQsIG9mZnNldCkge1xyXG4gIGlmICghb3V0KVxyXG4gICAgb3V0ID0gbmV3IEJ1ZmZlcih0aGlzLmxlbmd0aCk7XHJcbiAgaWYgKCFvZmZzZXQpXHJcbiAgICBvZmZzZXQgPSAwO1xyXG5cclxuICBpZiAodGhpcy5sZW5ndGggPT09IDApXHJcbiAgICByZXR1cm4gb3V0O1xyXG5cclxuICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnZhbHVlKSkge1xyXG4gICAgdGhpcy52YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgaXRlbS5qb2luKG91dCwgb2Zmc2V0KTtcclxuICAgICAgb2Zmc2V0ICs9IGl0ZW0ubGVuZ3RoO1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy52YWx1ZSA9PT0gJ251bWJlcicpXHJcbiAgICAgIG91dFtvZmZzZXRdID0gdGhpcy52YWx1ZTtcclxuICAgIGVsc2UgaWYgKHR5cGVvZiB0aGlzLnZhbHVlID09PSAnc3RyaW5nJylcclxuICAgICAgb3V0LndyaXRlKHRoaXMudmFsdWUsIG9mZnNldCk7XHJcbiAgICBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIodGhpcy52YWx1ZSkpXHJcbiAgICAgIHRoaXMudmFsdWUuY29weShvdXQsIG9mZnNldCk7XHJcbiAgICBvZmZzZXQgKz0gdGhpcy5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3V0O1xyXG59O1xyXG4iLCJ2YXIgYXNuMSA9IGV4cG9ydHM7XHJcblxyXG5hc24xLmJpZ251bSA9IHJlcXVpcmUoJ2JuLmpzJyk7XHJcblxyXG5hc24xLmRlZmluZSA9IHJlcXVpcmUoJy4vYXNuMS9hcGknKS5kZWZpbmU7XHJcbmFzbjEuYmFzZSA9IHJlcXVpcmUoJy4vYXNuMS9iYXNlJyk7XHJcbmFzbjEuY29uc3RhbnRzID0gcmVxdWlyZSgnLi9hc24xL2NvbnN0YW50cycpO1xyXG5hc24xLmRlY29kZXJzID0gcmVxdWlyZSgnLi9hc24xL2RlY29kZXJzJyk7XHJcbmFzbjEuZW5jb2RlcnMgPSByZXF1aXJlKCcuL2FzbjEvZW5jb2RlcnMnKTtcclxuIiwidmFyIFJlcG9ydGVyID0gcmVxdWlyZSgnLi4vYmFzZScpLlJlcG9ydGVyO1xyXG52YXIgRW5jb2RlckJ1ZmZlciA9IHJlcXVpcmUoJy4uL2Jhc2UnKS5FbmNvZGVyQnVmZmVyO1xyXG52YXIgRGVjb2RlckJ1ZmZlciA9IHJlcXVpcmUoJy4uL2Jhc2UnKS5EZWNvZGVyQnVmZmVyO1xyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnbWluaW1hbGlzdGljLWFzc2VydCcpO1xyXG5cclxuLy8gU3VwcG9ydGVkIHRhZ3NcclxudmFyIHRhZ3MgPSBbXHJcbiAgJ3NlcScsICdzZXFvZicsICdzZXQnLCAnc2V0b2YnLCAnb2JqaWQnLCAnYm9vbCcsXHJcbiAgJ2dlbnRpbWUnLCAndXRjdGltZScsICdudWxsXycsICdlbnVtJywgJ2ludCcsICdvYmpEZXNjJyxcclxuICAnYml0c3RyJywgJ2JtcHN0cicsICdjaGFyc3RyJywgJ2dlbnN0cicsICdncmFwaHN0cicsICdpYTVzdHInLCAnaXNvNjQ2c3RyJyxcclxuICAnbnVtc3RyJywgJ29jdHN0cicsICdwcmludHN0cicsICd0NjFzdHInLCAndW5pc3RyJywgJ3V0ZjhzdHInLCAndmlkZW9zdHInXHJcbl07XHJcblxyXG4vLyBQdWJsaWMgbWV0aG9kcyBsaXN0XHJcbnZhciBtZXRob2RzID0gW1xyXG4gICdrZXknLCAnb2JqJywgJ3VzZScsICdvcHRpb25hbCcsICdleHBsaWNpdCcsICdpbXBsaWNpdCcsICdkZWYnLCAnY2hvaWNlJyxcclxuICAnYW55JywgJ2NvbnRhaW5zJ1xyXG5dLmNvbmNhdCh0YWdzKTtcclxuXHJcbi8vIE92ZXJyaWRlZCBtZXRob2RzIGxpc3RcclxudmFyIG92ZXJyaWRlZCA9IFtcclxuICAnX3BlZWtUYWcnLCAnX2RlY29kZVRhZycsICdfdXNlJyxcclxuICAnX2RlY29kZVN0cicsICdfZGVjb2RlT2JqaWQnLCAnX2RlY29kZVRpbWUnLFxyXG4gICdfZGVjb2RlTnVsbCcsICdfZGVjb2RlSW50JywgJ19kZWNvZGVCb29sJywgJ19kZWNvZGVMaXN0JyxcclxuXHJcbiAgJ19lbmNvZGVDb21wb3NpdGUnLCAnX2VuY29kZVN0cicsICdfZW5jb2RlT2JqaWQnLCAnX2VuY29kZVRpbWUnLFxyXG4gICdfZW5jb2RlTnVsbCcsICdfZW5jb2RlSW50JywgJ19lbmNvZGVCb29sJ1xyXG5dO1xyXG5cclxuZnVuY3Rpb24gTm9kZShlbmMsIHBhcmVudCkge1xyXG4gIHZhciBzdGF0ZSA9IHt9O1xyXG4gIHRoaXMuX2Jhc2VTdGF0ZSA9IHN0YXRlO1xyXG5cclxuICBzdGF0ZS5lbmMgPSBlbmM7XHJcblxyXG4gIHN0YXRlLnBhcmVudCA9IHBhcmVudCB8fCBudWxsO1xyXG4gIHN0YXRlLmNoaWxkcmVuID0gbnVsbDtcclxuXHJcbiAgLy8gU3RhdGVcclxuICBzdGF0ZS50YWcgPSBudWxsO1xyXG4gIHN0YXRlLmFyZ3MgPSBudWxsO1xyXG4gIHN0YXRlLnJldmVyc2VBcmdzID0gbnVsbDtcclxuICBzdGF0ZS5jaG9pY2UgPSBudWxsO1xyXG4gIHN0YXRlLm9wdGlvbmFsID0gZmFsc2U7XHJcbiAgc3RhdGUuYW55ID0gZmFsc2U7XHJcbiAgc3RhdGUub2JqID0gZmFsc2U7XHJcbiAgc3RhdGUudXNlID0gbnVsbDtcclxuICBzdGF0ZS51c2VEZWNvZGVyID0gbnVsbDtcclxuICBzdGF0ZS5rZXkgPSBudWxsO1xyXG4gIHN0YXRlWydkZWZhdWx0J10gPSBudWxsO1xyXG4gIHN0YXRlLmV4cGxpY2l0ID0gbnVsbDtcclxuICBzdGF0ZS5pbXBsaWNpdCA9IG51bGw7XHJcbiAgc3RhdGUuY29udGFpbnMgPSBudWxsO1xyXG5cclxuICAvLyBTaG91bGQgY3JlYXRlIG5ldyBpbnN0YW5jZSBvbiBlYWNoIG1ldGhvZFxyXG4gIGlmICghc3RhdGUucGFyZW50KSB7XHJcbiAgICBzdGF0ZS5jaGlsZHJlbiA9IFtdO1xyXG4gICAgdGhpcy5fd3JhcCgpO1xyXG4gIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IE5vZGU7XHJcblxyXG52YXIgc3RhdGVQcm9wcyA9IFtcclxuICAnZW5jJywgJ3BhcmVudCcsICdjaGlsZHJlbicsICd0YWcnLCAnYXJncycsICdyZXZlcnNlQXJncycsICdjaG9pY2UnLFxyXG4gICdvcHRpb25hbCcsICdhbnknLCAnb2JqJywgJ3VzZScsICdhbHRlcmVkVXNlJywgJ2tleScsICdkZWZhdWx0JywgJ2V4cGxpY2l0JyxcclxuICAnaW1wbGljaXQnLCAnY29udGFpbnMnXHJcbl07XHJcblxyXG5Ob2RlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uIGNsb25lKCkge1xyXG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcclxuICB2YXIgY3N0YXRlID0ge307XHJcbiAgc3RhdGVQcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcclxuICAgIGNzdGF0ZVtwcm9wXSA9IHN0YXRlW3Byb3BdO1xyXG4gIH0pO1xyXG4gIHZhciByZXMgPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcihjc3RhdGUucGFyZW50KTtcclxuICByZXMuX2Jhc2VTdGF0ZSA9IGNzdGF0ZTtcclxuICByZXR1cm4gcmVzO1xyXG59O1xyXG5cclxuTm9kZS5wcm90b3R5cGUuX3dyYXAgPSBmdW5jdGlvbiB3cmFwKCkge1xyXG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcclxuICBtZXRob2RzLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XHJcbiAgICB0aGlzW21ldGhvZF0gPSBmdW5jdGlvbiBfd3JhcHBlZE1ldGhvZCgpIHtcclxuICAgICAgdmFyIGNsb25lID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyk7XHJcbiAgICAgIHN0YXRlLmNoaWxkcmVuLnB1c2goY2xvbmUpO1xyXG4gICAgICByZXR1cm4gY2xvbmVbbWV0aG9kXS5hcHBseShjbG9uZSwgYXJndW1lbnRzKTtcclxuICAgIH07XHJcbiAgfSwgdGhpcyk7XHJcbn07XHJcblxyXG5Ob2RlLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uIGluaXQoYm9keSkge1xyXG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcclxuXHJcbiAgYXNzZXJ0KHN0YXRlLnBhcmVudCA9PT0gbnVsbCk7XHJcbiAgYm9keS5jYWxsKHRoaXMpO1xyXG5cclxuICAvLyBGaWx0ZXIgY2hpbGRyZW5cclxuICBzdGF0ZS5jaGlsZHJlbiA9IHN0YXRlLmNoaWxkcmVuLmZpbHRlcihmdW5jdGlvbihjaGlsZCkge1xyXG4gICAgcmV0dXJuIGNoaWxkLl9iYXNlU3RhdGUucGFyZW50ID09PSB0aGlzO1xyXG4gIH0sIHRoaXMpO1xyXG4gIGFzc2VydC5lcXVhbChzdGF0ZS5jaGlsZHJlbi5sZW5ndGgsIDEsICdSb290IG5vZGUgY2FuIGhhdmUgb25seSBvbmUgY2hpbGQnKTtcclxufTtcclxuXHJcbk5vZGUucHJvdG90eXBlLl91c2VBcmdzID0gZnVuY3Rpb24gdXNlQXJncyhhcmdzKSB7XHJcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xyXG5cclxuICAvLyBGaWx0ZXIgY2hpbGRyZW4gYW5kIGFyZ3NcclxuICB2YXIgY2hpbGRyZW4gPSBhcmdzLmZpbHRlcihmdW5jdGlvbihhcmcpIHtcclxuICAgIHJldHVybiBhcmcgaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yO1xyXG4gIH0sIHRoaXMpO1xyXG4gIGFyZ3MgPSBhcmdzLmZpbHRlcihmdW5jdGlvbihhcmcpIHtcclxuICAgIHJldHVybiAhKGFyZyBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IpO1xyXG4gIH0sIHRoaXMpO1xyXG5cclxuICBpZiAoY2hpbGRyZW4ubGVuZ3RoICE9PSAwKSB7XHJcbiAgICBhc3NlcnQoc3RhdGUuY2hpbGRyZW4gPT09IG51bGwpO1xyXG4gICAgc3RhdGUuY2hpbGRyZW4gPSBjaGlsZHJlbjtcclxuXHJcbiAgICAvLyBSZXBsYWNlIHBhcmVudCB0byBtYWludGFpbiBiYWNrd2FyZCBsaW5rXHJcbiAgICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XHJcbiAgICAgIGNoaWxkLl9iYXNlU3RhdGUucGFyZW50ID0gdGhpcztcclxuICAgIH0sIHRoaXMpO1xyXG4gIH1cclxuICBpZiAoYXJncy5sZW5ndGggIT09IDApIHtcclxuICAgIGFzc2VydChzdGF0ZS5hcmdzID09PSBudWxsKTtcclxuICAgIHN0YXRlLmFyZ3MgPSBhcmdzO1xyXG4gICAgc3RhdGUucmV2ZXJzZUFyZ3MgPSBhcmdzLm1hcChmdW5jdGlvbihhcmcpIHtcclxuICAgICAgaWYgKHR5cGVvZiBhcmcgIT09ICdvYmplY3QnIHx8IGFyZy5jb25zdHJ1Y3RvciAhPT0gT2JqZWN0KVxyXG4gICAgICAgIHJldHVybiBhcmc7XHJcblxyXG4gICAgICB2YXIgcmVzID0ge307XHJcbiAgICAgIE9iamVjdC5rZXlzKGFyZykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcclxuICAgICAgICBpZiAoa2V5ID09IChrZXkgfCAwKSlcclxuICAgICAgICAgIGtleSB8PSAwO1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ1trZXldO1xyXG4gICAgICAgIHJlc1t2YWx1ZV0gPSBrZXk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy9cclxuLy8gT3ZlcnJpZGVkIG1ldGhvZHNcclxuLy9cclxuXHJcbm92ZXJyaWRlZC5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xyXG4gIE5vZGUucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbiBfb3ZlcnJpZGVkKCkge1xyXG4gICAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKG1ldGhvZCArICcgbm90IGltcGxlbWVudGVkIGZvciBlbmNvZGluZzogJyArIHN0YXRlLmVuYyk7XHJcbiAgfTtcclxufSk7XHJcblxyXG4vL1xyXG4vLyBQdWJsaWMgbWV0aG9kc1xyXG4vL1xyXG5cclxudGFncy5mb3JFYWNoKGZ1bmN0aW9uKHRhZykge1xyXG4gIE5vZGUucHJvdG90eXBlW3RhZ10gPSBmdW5jdGlvbiBfdGFnTWV0aG9kKCkge1xyXG4gICAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xyXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG5cclxuICAgIGFzc2VydChzdGF0ZS50YWcgPT09IG51bGwpO1xyXG4gICAgc3RhdGUudGFnID0gdGFnO1xyXG5cclxuICAgIHRoaXMuX3VzZUFyZ3MoYXJncyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxufSk7XHJcblxyXG5Ob2RlLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoaXRlbSkge1xyXG4gIGFzc2VydChpdGVtKTtcclxuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XHJcblxyXG4gIGFzc2VydChzdGF0ZS51c2UgPT09IG51bGwpO1xyXG4gIHN0YXRlLnVzZSA9IGl0ZW07XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTm9kZS5wcm90b3R5cGUub3B0aW9uYWwgPSBmdW5jdGlvbiBvcHRpb25hbCgpIHtcclxuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XHJcblxyXG4gIHN0YXRlLm9wdGlvbmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5Ob2RlLnByb3RvdHlwZS5kZWYgPSBmdW5jdGlvbiBkZWYodmFsKSB7XHJcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xyXG5cclxuICBhc3NlcnQoc3RhdGVbJ2RlZmF1bHQnXSA9PT0gbnVsbCk7XHJcbiAgc3RhdGVbJ2RlZmF1bHQnXSA9IHZhbDtcclxuICBzdGF0ZS5vcHRpb25hbCA9IHRydWU7XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTm9kZS5wcm90b3R5cGUuZXhwbGljaXQgPSBmdW5jdGlvbiBleHBsaWNpdChudW0pIHtcclxuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XHJcblxyXG4gIGFzc2VydChzdGF0ZS5leHBsaWNpdCA9PT0gbnVsbCAmJiBzdGF0ZS5pbXBsaWNpdCA9PT0gbnVsbCk7XHJcbiAgc3RhdGUuZXhwbGljaXQgPSBudW07XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTm9kZS5wcm90b3R5cGUuaW1wbGljaXQgPSBmdW5jdGlvbiBpbXBsaWNpdChudW0pIHtcclxuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XHJcblxyXG4gIGFzc2VydChzdGF0ZS5leHBsaWNpdCA9PT0gbnVsbCAmJiBzdGF0ZS5pbXBsaWNpdCA9PT0gbnVsbCk7XHJcbiAgc3RhdGUuaW1wbGljaXQgPSBudW07XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTm9kZS5wcm90b3R5cGUub2JqID0gZnVuY3Rpb24gb2JqKCkge1xyXG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcclxuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcblxyXG4gIHN0YXRlLm9iaiA9IHRydWU7XHJcblxyXG4gIGlmIChhcmdzLmxlbmd0aCAhPT0gMClcclxuICAgIHRoaXMuX3VzZUFyZ3MoYXJncyk7XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTm9kZS5wcm90b3R5cGUua2V5ID0gZnVuY3Rpb24ga2V5KG5ld0tleSkge1xyXG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcclxuXHJcbiAgYXNzZXJ0KHN0YXRlLmtleSA9PT0gbnVsbCk7XHJcbiAgc3RhdGUua2V5ID0gbmV3S2V5O1xyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk5vZGUucHJvdG90eXBlLmFueSA9IGZ1bmN0aW9uIGFueSgpIHtcclxuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XHJcblxyXG4gIHN0YXRlLmFueSA9IHRydWU7XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTm9kZS5wcm90b3R5cGUuY2hvaWNlID0gZnVuY3Rpb24gY2hvaWNlKG9iaikge1xyXG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcclxuXHJcbiAgYXNzZXJ0KHN0YXRlLmNob2ljZSA9PT0gbnVsbCk7XHJcbiAgc3RhdGUuY2hvaWNlID0gb2JqO1xyXG4gIHRoaXMuX3VzZUFyZ3MoT2JqZWN0LmtleXMob2JqKS5tYXAoZnVuY3Rpb24oa2V5KSB7XHJcbiAgICByZXR1cm4gb2JqW2tleV07XHJcbiAgfSkpO1xyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk5vZGUucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gY29udGFpbnMoaXRlbSkge1xyXG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcclxuXHJcbiAgYXNzZXJ0KHN0YXRlLnVzZSA9PT0gbnVsbCk7XHJcbiAgc3RhdGUuY29udGFpbnMgPSBpdGVtO1xyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8vXHJcbi8vIERlY29kaW5nXHJcbi8vXHJcblxyXG5Ob2RlLnByb3RvdHlwZS5fZGVjb2RlID0gZnVuY3Rpb24gZGVjb2RlKGlucHV0LCBvcHRpb25zKSB7XHJcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xyXG5cclxuICAvLyBEZWNvZGUgcm9vdCBub2RlXHJcbiAgaWYgKHN0YXRlLnBhcmVudCA9PT0gbnVsbClcclxuICAgIHJldHVybiBpbnB1dC53cmFwUmVzdWx0KHN0YXRlLmNoaWxkcmVuWzBdLl9kZWNvZGUoaW5wdXQsIG9wdGlvbnMpKTtcclxuXHJcbiAgdmFyIHJlc3VsdCA9IHN0YXRlWydkZWZhdWx0J107XHJcbiAgdmFyIHByZXNlbnQgPSB0cnVlO1xyXG5cclxuICB2YXIgcHJldktleSA9IG51bGw7XHJcbiAgaWYgKHN0YXRlLmtleSAhPT0gbnVsbClcclxuICAgIHByZXZLZXkgPSBpbnB1dC5lbnRlcktleShzdGF0ZS5rZXkpO1xyXG5cclxuICAvLyBDaGVjayBpZiB0YWcgaXMgdGhlcmVcclxuICBpZiAoc3RhdGUub3B0aW9uYWwpIHtcclxuICAgIHZhciB0YWcgPSBudWxsO1xyXG4gICAgaWYgKHN0YXRlLmV4cGxpY2l0ICE9PSBudWxsKVxyXG4gICAgICB0YWcgPSBzdGF0ZS5leHBsaWNpdDtcclxuICAgIGVsc2UgaWYgKHN0YXRlLmltcGxpY2l0ICE9PSBudWxsKVxyXG4gICAgICB0YWcgPSBzdGF0ZS5pbXBsaWNpdDtcclxuICAgIGVsc2UgaWYgKHN0YXRlLnRhZyAhPT0gbnVsbClcclxuICAgICAgdGFnID0gc3RhdGUudGFnO1xyXG5cclxuICAgIGlmICh0YWcgPT09IG51bGwgJiYgIXN0YXRlLmFueSkge1xyXG4gICAgICAvLyBUcmlhbCBhbmQgRXJyb3JcclxuICAgICAgdmFyIHNhdmUgPSBpbnB1dC5zYXZlKCk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKHN0YXRlLmNob2ljZSA9PT0gbnVsbClcclxuICAgICAgICAgIHRoaXMuX2RlY29kZUdlbmVyaWMoc3RhdGUudGFnLCBpbnB1dCwgb3B0aW9ucyk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgdGhpcy5fZGVjb2RlQ2hvaWNlKGlucHV0LCBvcHRpb25zKTtcclxuICAgICAgICBwcmVzZW50ID0gdHJ1ZTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHByZXNlbnQgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBpbnB1dC5yZXN0b3JlKHNhdmUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcHJlc2VudCA9IHRoaXMuX3BlZWtUYWcoaW5wdXQsIHRhZywgc3RhdGUuYW55KTtcclxuXHJcbiAgICAgIGlmIChpbnB1dC5pc0Vycm9yKHByZXNlbnQpKVxyXG4gICAgICAgIHJldHVybiBwcmVzZW50O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gUHVzaCBvYmplY3Qgb24gc3RhY2tcclxuICB2YXIgcHJldk9iajtcclxuICBpZiAoc3RhdGUub2JqICYmIHByZXNlbnQpXHJcbiAgICBwcmV2T2JqID0gaW5wdXQuZW50ZXJPYmplY3QoKTtcclxuXHJcbiAgaWYgKHByZXNlbnQpIHtcclxuICAgIC8vIFVud3JhcCBleHBsaWNpdCB2YWx1ZXNcclxuICAgIGlmIChzdGF0ZS5leHBsaWNpdCAhPT0gbnVsbCkge1xyXG4gICAgICB2YXIgZXhwbGljaXQgPSB0aGlzLl9kZWNvZGVUYWcoaW5wdXQsIHN0YXRlLmV4cGxpY2l0KTtcclxuICAgICAgaWYgKGlucHV0LmlzRXJyb3IoZXhwbGljaXQpKVxyXG4gICAgICAgIHJldHVybiBleHBsaWNpdDtcclxuICAgICAgaW5wdXQgPSBleHBsaWNpdDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgc3RhcnQgPSBpbnB1dC5vZmZzZXQ7XHJcblxyXG4gICAgLy8gVW53cmFwIGltcGxpY2l0IGFuZCBub3JtYWwgdmFsdWVzXHJcbiAgICBpZiAoc3RhdGUudXNlID09PSBudWxsICYmIHN0YXRlLmNob2ljZSA9PT0gbnVsbCkge1xyXG4gICAgICBpZiAoc3RhdGUuYW55KVxyXG4gICAgICAgIHZhciBzYXZlID0gaW5wdXQuc2F2ZSgpO1xyXG4gICAgICB2YXIgYm9keSA9IHRoaXMuX2RlY29kZVRhZyhcclxuICAgICAgICBpbnB1dCxcclxuICAgICAgICBzdGF0ZS5pbXBsaWNpdCAhPT0gbnVsbCA/IHN0YXRlLmltcGxpY2l0IDogc3RhdGUudGFnLFxyXG4gICAgICAgIHN0YXRlLmFueVxyXG4gICAgICApO1xyXG4gICAgICBpZiAoaW5wdXQuaXNFcnJvcihib2R5KSlcclxuICAgICAgICByZXR1cm4gYm9keTtcclxuXHJcbiAgICAgIGlmIChzdGF0ZS5hbnkpXHJcbiAgICAgICAgcmVzdWx0ID0gaW5wdXQucmF3KHNhdmUpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgaW5wdXQgPSBib2R5O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMudHJhY2sgJiYgc3RhdGUudGFnICE9PSBudWxsKVxyXG4gICAgICBvcHRpb25zLnRyYWNrKGlucHV0LnBhdGgoKSwgc3RhcnQsIGlucHV0Lmxlbmd0aCwgJ3RhZ2dlZCcpO1xyXG5cclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMudHJhY2sgJiYgc3RhdGUudGFnICE9PSBudWxsKVxyXG4gICAgICBvcHRpb25zLnRyYWNrKGlucHV0LnBhdGgoKSwgaW5wdXQub2Zmc2V0LCBpbnB1dC5sZW5ndGgsICdjb250ZW50Jyk7XHJcblxyXG4gICAgLy8gU2VsZWN0IHByb3BlciBtZXRob2QgZm9yIHRhZ1xyXG4gICAgaWYgKHN0YXRlLmFueSlcclxuICAgICAgcmVzdWx0ID0gcmVzdWx0O1xyXG4gICAgZWxzZSBpZiAoc3RhdGUuY2hvaWNlID09PSBudWxsKVxyXG4gICAgICByZXN1bHQgPSB0aGlzLl9kZWNvZGVHZW5lcmljKHN0YXRlLnRhZywgaW5wdXQsIG9wdGlvbnMpO1xyXG4gICAgZWxzZVxyXG4gICAgICByZXN1bHQgPSB0aGlzLl9kZWNvZGVDaG9pY2UoaW5wdXQsIG9wdGlvbnMpO1xyXG5cclxuICAgIGlmIChpbnB1dC5pc0Vycm9yKHJlc3VsdCkpXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcblxyXG4gICAgLy8gRGVjb2RlIGNoaWxkcmVuXHJcbiAgICBpZiAoIXN0YXRlLmFueSAmJiBzdGF0ZS5jaG9pY2UgPT09IG51bGwgJiYgc3RhdGUuY2hpbGRyZW4gIT09IG51bGwpIHtcclxuICAgICAgc3RhdGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiBkZWNvZGVDaGlsZHJlbihjaGlsZCkge1xyXG4gICAgICAgIC8vIE5PVEU6IFdlIGFyZSBpZ25vcmluZyBlcnJvcnMgaGVyZSwgdG8gbGV0IHBhcnNlciBjb250aW51ZSB3aXRoIG90aGVyXHJcbiAgICAgICAgLy8gcGFydHMgb2YgZW5jb2RlZCBkYXRhXHJcbiAgICAgICAgY2hpbGQuX2RlY29kZShpbnB1dCwgb3B0aW9ucyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERlY29kZSBjb250YWluZWQvZW5jb2RlZCBieSBzY2hlbWEsIG9ubHkgaW4gYml0IG9yIG9jdGV0IHN0cmluZ3NcclxuICAgIGlmIChzdGF0ZS5jb250YWlucyAmJiAoc3RhdGUudGFnID09PSAnb2N0c3RyJyB8fCBzdGF0ZS50YWcgPT09ICdiaXRzdHInKSkge1xyXG4gICAgICB2YXIgZGF0YSA9IG5ldyBEZWNvZGVyQnVmZmVyKHJlc3VsdCk7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuX2dldFVzZShzdGF0ZS5jb250YWlucywgaW5wdXQuX3JlcG9ydGVyU3RhdGUub2JqKVxyXG4gICAgICAgICAgLl9kZWNvZGUoZGF0YSwgb3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBQb3Agb2JqZWN0XHJcbiAgaWYgKHN0YXRlLm9iaiAmJiBwcmVzZW50KVxyXG4gICAgcmVzdWx0ID0gaW5wdXQubGVhdmVPYmplY3QocHJldk9iaik7XHJcblxyXG4gIC8vIFNldCBrZXlcclxuICBpZiAoc3RhdGUua2V5ICE9PSBudWxsICYmIChyZXN1bHQgIT09IG51bGwgfHwgcHJlc2VudCA9PT0gdHJ1ZSkpXHJcbiAgICBpbnB1dC5sZWF2ZUtleShwcmV2S2V5LCBzdGF0ZS5rZXksIHJlc3VsdCk7XHJcbiAgZWxzZSBpZiAocHJldktleSAhPT0gbnVsbClcclxuICAgIGlucHV0LmV4aXRLZXkocHJldktleSk7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5Ob2RlLnByb3RvdHlwZS5fZGVjb2RlR2VuZXJpYyA9IGZ1bmN0aW9uIGRlY29kZUdlbmVyaWModGFnLCBpbnB1dCwgb3B0aW9ucykge1xyXG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcclxuXHJcbiAgaWYgKHRhZyA9PT0gJ3NlcScgfHwgdGFnID09PSAnc2V0JylcclxuICAgIHJldHVybiBudWxsO1xyXG4gIGlmICh0YWcgPT09ICdzZXFvZicgfHwgdGFnID09PSAnc2V0b2YnKVxyXG4gICAgcmV0dXJuIHRoaXMuX2RlY29kZUxpc3QoaW5wdXQsIHRhZywgc3RhdGUuYXJnc1swXSwgb3B0aW9ucyk7XHJcbiAgZWxzZSBpZiAoL3N0ciQvLnRlc3QodGFnKSlcclxuICAgIHJldHVybiB0aGlzLl9kZWNvZGVTdHIoaW5wdXQsIHRhZywgb3B0aW9ucyk7XHJcbiAgZWxzZSBpZiAodGFnID09PSAnb2JqaWQnICYmIHN0YXRlLmFyZ3MpXHJcbiAgICByZXR1cm4gdGhpcy5fZGVjb2RlT2JqaWQoaW5wdXQsIHN0YXRlLmFyZ3NbMF0sIHN0YXRlLmFyZ3NbMV0sIG9wdGlvbnMpO1xyXG4gIGVsc2UgaWYgKHRhZyA9PT0gJ29iamlkJylcclxuICAgIHJldHVybiB0aGlzLl9kZWNvZGVPYmppZChpbnB1dCwgbnVsbCwgbnVsbCwgb3B0aW9ucyk7XHJcbiAgZWxzZSBpZiAodGFnID09PSAnZ2VudGltZScgfHwgdGFnID09PSAndXRjdGltZScpXHJcbiAgICByZXR1cm4gdGhpcy5fZGVjb2RlVGltZShpbnB1dCwgdGFnLCBvcHRpb25zKTtcclxuICBlbHNlIGlmICh0YWcgPT09ICdudWxsXycpXHJcbiAgICByZXR1cm4gdGhpcy5fZGVjb2RlTnVsbChpbnB1dCwgb3B0aW9ucyk7XHJcbiAgZWxzZSBpZiAodGFnID09PSAnYm9vbCcpXHJcbiAgICByZXR1cm4gdGhpcy5fZGVjb2RlQm9vbChpbnB1dCwgb3B0aW9ucyk7XHJcbiAgZWxzZSBpZiAodGFnID09PSAnb2JqRGVzYycpXHJcbiAgICByZXR1cm4gdGhpcy5fZGVjb2RlU3RyKGlucHV0LCB0YWcsIG9wdGlvbnMpO1xyXG4gIGVsc2UgaWYgKHRhZyA9PT0gJ2ludCcgfHwgdGFnID09PSAnZW51bScpXHJcbiAgICByZXR1cm4gdGhpcy5fZGVjb2RlSW50KGlucHV0LCBzdGF0ZS5hcmdzICYmIHN0YXRlLmFyZ3NbMF0sIG9wdGlvbnMpO1xyXG5cclxuICBpZiAoc3RhdGUudXNlICE9PSBudWxsKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZ2V0VXNlKHN0YXRlLnVzZSwgaW5wdXQuX3JlcG9ydGVyU3RhdGUub2JqKVxyXG4gICAgICAgIC5fZGVjb2RlKGlucHV0LCBvcHRpb25zKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGlucHV0LmVycm9yKCd1bmtub3duIHRhZzogJyArIHRhZyk7XHJcbiAgfVxyXG59O1xyXG5cclxuTm9kZS5wcm90b3R5cGUuX2dldFVzZSA9IGZ1bmN0aW9uIF9nZXRVc2UoZW50aXR5LCBvYmopIHtcclxuXHJcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xyXG4gIC8vIENyZWF0ZSBhbHRlcmVkIHVzZSBkZWNvZGVyIGlmIGltcGxpY2l0IGlzIHNldFxyXG4gIHN0YXRlLnVzZURlY29kZXIgPSB0aGlzLl91c2UoZW50aXR5LCBvYmopO1xyXG4gIGFzc2VydChzdGF0ZS51c2VEZWNvZGVyLl9iYXNlU3RhdGUucGFyZW50ID09PSBudWxsKTtcclxuICBzdGF0ZS51c2VEZWNvZGVyID0gc3RhdGUudXNlRGVjb2Rlci5fYmFzZVN0YXRlLmNoaWxkcmVuWzBdO1xyXG4gIGlmIChzdGF0ZS5pbXBsaWNpdCAhPT0gc3RhdGUudXNlRGVjb2Rlci5fYmFzZVN0YXRlLmltcGxpY2l0KSB7XHJcbiAgICBzdGF0ZS51c2VEZWNvZGVyID0gc3RhdGUudXNlRGVjb2Rlci5jbG9uZSgpO1xyXG4gICAgc3RhdGUudXNlRGVjb2Rlci5fYmFzZVN0YXRlLmltcGxpY2l0ID0gc3RhdGUuaW1wbGljaXQ7XHJcbiAgfVxyXG4gIHJldHVybiBzdGF0ZS51c2VEZWNvZGVyO1xyXG59O1xyXG5cclxuTm9kZS5wcm90b3R5cGUuX2RlY29kZUNob2ljZSA9IGZ1bmN0aW9uIGRlY29kZUNob2ljZShpbnB1dCwgb3B0aW9ucykge1xyXG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcclxuICB2YXIgcmVzdWx0ID0gbnVsbDtcclxuICB2YXIgbWF0Y2ggPSBmYWxzZTtcclxuXHJcbiAgT2JqZWN0LmtleXMoc3RhdGUuY2hvaWNlKS5zb21lKGZ1bmN0aW9uKGtleSkge1xyXG4gICAgdmFyIHNhdmUgPSBpbnB1dC5zYXZlKCk7XHJcbiAgICB2YXIgbm9kZSA9IHN0YXRlLmNob2ljZVtrZXldO1xyXG4gICAgdHJ5IHtcclxuICAgICAgdmFyIHZhbHVlID0gbm9kZS5fZGVjb2RlKGlucHV0LCBvcHRpb25zKTtcclxuICAgICAgaWYgKGlucHV0LmlzRXJyb3IodmFsdWUpKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIHJlc3VsdCA9IHsgdHlwZToga2V5LCB2YWx1ZTogdmFsdWUgfTtcclxuICAgICAgbWF0Y2ggPSB0cnVlO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBpbnB1dC5yZXN0b3JlKHNhdmUpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9LCB0aGlzKTtcclxuXHJcbiAgaWYgKCFtYXRjaClcclxuICAgIHJldHVybiBpbnB1dC5lcnJvcignQ2hvaWNlIG5vdCBtYXRjaGVkJyk7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vL1xyXG4vLyBFbmNvZGluZ1xyXG4vL1xyXG5cclxuTm9kZS5wcm90b3R5cGUuX2NyZWF0ZUVuY29kZXJCdWZmZXIgPSBmdW5jdGlvbiBjcmVhdGVFbmNvZGVyQnVmZmVyKGRhdGEpIHtcclxuICByZXR1cm4gbmV3IEVuY29kZXJCdWZmZXIoZGF0YSwgdGhpcy5yZXBvcnRlcik7XHJcbn07XHJcblxyXG5Ob2RlLnByb3RvdHlwZS5fZW5jb2RlID0gZnVuY3Rpb24gZW5jb2RlKGRhdGEsIHJlcG9ydGVyLCBwYXJlbnQpIHtcclxuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XHJcbiAgaWYgKHN0YXRlWydkZWZhdWx0J10gIT09IG51bGwgJiYgc3RhdGVbJ2RlZmF1bHQnXSA9PT0gZGF0YSlcclxuICAgIHJldHVybjtcclxuXHJcbiAgdmFyIHJlc3VsdCA9IHRoaXMuX2VuY29kZVZhbHVlKGRhdGEsIHJlcG9ydGVyLCBwYXJlbnQpO1xyXG4gIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZClcclxuICAgIHJldHVybjtcclxuXHJcbiAgaWYgKHRoaXMuX3NraXBEZWZhdWx0KHJlc3VsdCwgcmVwb3J0ZXIsIHBhcmVudCkpXHJcbiAgICByZXR1cm47XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5Ob2RlLnByb3RvdHlwZS5fZW5jb2RlVmFsdWUgPSBmdW5jdGlvbiBlbmNvZGUoZGF0YSwgcmVwb3J0ZXIsIHBhcmVudCkge1xyXG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcclxuXHJcbiAgLy8gRGVjb2RlIHJvb3Qgbm9kZVxyXG4gIGlmIChzdGF0ZS5wYXJlbnQgPT09IG51bGwpXHJcbiAgICByZXR1cm4gc3RhdGUuY2hpbGRyZW5bMF0uX2VuY29kZShkYXRhLCByZXBvcnRlciB8fCBuZXcgUmVwb3J0ZXIoKSk7XHJcblxyXG4gIHZhciByZXN1bHQgPSBudWxsO1xyXG5cclxuICAvLyBTZXQgcmVwb3J0ZXIgdG8gc2hhcmUgaXQgd2l0aCBhIGNoaWxkIGNsYXNzXHJcbiAgdGhpcy5yZXBvcnRlciA9IHJlcG9ydGVyO1xyXG5cclxuICAvLyBDaGVjayBpZiBkYXRhIGlzIHRoZXJlXHJcbiAgaWYgKHN0YXRlLm9wdGlvbmFsICYmIGRhdGEgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgaWYgKHN0YXRlWydkZWZhdWx0J10gIT09IG51bGwpXHJcbiAgICAgIGRhdGEgPSBzdGF0ZVsnZGVmYXVsdCddXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIEVuY29kZSBjaGlsZHJlbiBmaXJzdFxyXG4gIHZhciBjb250ZW50ID0gbnVsbDtcclxuICB2YXIgcHJpbWl0aXZlID0gZmFsc2U7XHJcbiAgaWYgKHN0YXRlLmFueSkge1xyXG4gICAgLy8gQW55dGhpbmcgdGhhdCB3YXMgZ2l2ZW4gaXMgdHJhbnNsYXRlZCB0byBidWZmZXJcclxuICAgIHJlc3VsdCA9IHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIoZGF0YSk7XHJcbiAgfSBlbHNlIGlmIChzdGF0ZS5jaG9pY2UpIHtcclxuICAgIHJlc3VsdCA9IHRoaXMuX2VuY29kZUNob2ljZShkYXRhLCByZXBvcnRlcik7XHJcbiAgfSBlbHNlIGlmIChzdGF0ZS5jb250YWlucykge1xyXG4gICAgY29udGVudCA9IHRoaXMuX2dldFVzZShzdGF0ZS5jb250YWlucywgcGFyZW50KS5fZW5jb2RlKGRhdGEsIHJlcG9ydGVyKTtcclxuICAgIHByaW1pdGl2ZSA9IHRydWU7XHJcbiAgfSBlbHNlIGlmIChzdGF0ZS5jaGlsZHJlbikge1xyXG4gICAgY29udGVudCA9IHN0YXRlLmNoaWxkcmVuLm1hcChmdW5jdGlvbihjaGlsZCkge1xyXG4gICAgICBpZiAoY2hpbGQuX2Jhc2VTdGF0ZS50YWcgPT09ICdudWxsXycpXHJcbiAgICAgICAgcmV0dXJuIGNoaWxkLl9lbmNvZGUobnVsbCwgcmVwb3J0ZXIsIGRhdGEpO1xyXG5cclxuICAgICAgaWYgKGNoaWxkLl9iYXNlU3RhdGUua2V5ID09PSBudWxsKVxyXG4gICAgICAgIHJldHVybiByZXBvcnRlci5lcnJvcignQ2hpbGQgc2hvdWxkIGhhdmUgYSBrZXknKTtcclxuICAgICAgdmFyIHByZXZLZXkgPSByZXBvcnRlci5lbnRlcktleShjaGlsZC5fYmFzZVN0YXRlLmtleSk7XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGRhdGEgIT09ICdvYmplY3QnKVxyXG4gICAgICAgIHJldHVybiByZXBvcnRlci5lcnJvcignQ2hpbGQgZXhwZWN0ZWQsIGJ1dCBpbnB1dCBpcyBub3Qgb2JqZWN0Jyk7XHJcblxyXG4gICAgICB2YXIgcmVzID0gY2hpbGQuX2VuY29kZShkYXRhW2NoaWxkLl9iYXNlU3RhdGUua2V5XSwgcmVwb3J0ZXIsIGRhdGEpO1xyXG4gICAgICByZXBvcnRlci5sZWF2ZUtleShwcmV2S2V5KTtcclxuXHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9LCB0aGlzKS5maWx0ZXIoZnVuY3Rpb24oY2hpbGQpIHtcclxuICAgICAgcmV0dXJuIGNoaWxkO1xyXG4gICAgfSk7XHJcbiAgICBjb250ZW50ID0gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihjb250ZW50KTtcclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKHN0YXRlLnRhZyA9PT0gJ3NlcW9mJyB8fCBzdGF0ZS50YWcgPT09ICdzZXRvZicpIHtcclxuICAgICAgLy8gVE9ETyhpbmR1dG55KTogdGhpcyBzaG91bGQgYmUgdGhyb3duIG9uIERTTCBsZXZlbFxyXG4gICAgICBpZiAoIShzdGF0ZS5hcmdzICYmIHN0YXRlLmFyZ3MubGVuZ3RoID09PSAxKSlcclxuICAgICAgICByZXR1cm4gcmVwb3J0ZXIuZXJyb3IoJ1RvbyBtYW55IGFyZ3MgZm9yIDogJyArIHN0YXRlLnRhZyk7XHJcblxyXG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpXHJcbiAgICAgICAgcmV0dXJuIHJlcG9ydGVyLmVycm9yKCdzZXFvZi9zZXRvZiwgYnV0IGRhdGEgaXMgbm90IEFycmF5Jyk7XHJcblxyXG4gICAgICB2YXIgY2hpbGQgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgIGNoaWxkLl9iYXNlU3RhdGUuaW1wbGljaXQgPSBudWxsO1xyXG4gICAgICBjb250ZW50ID0gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihkYXRhLm1hcChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0VXNlKHN0YXRlLmFyZ3NbMF0sIGRhdGEpLl9lbmNvZGUoaXRlbSwgcmVwb3J0ZXIpO1xyXG4gICAgICB9LCBjaGlsZCkpO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0ZS51c2UgIT09IG51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5fZ2V0VXNlKHN0YXRlLnVzZSwgcGFyZW50KS5fZW5jb2RlKGRhdGEsIHJlcG9ydGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnRlbnQgPSB0aGlzLl9lbmNvZGVQcmltaXRpdmUoc3RhdGUudGFnLCBkYXRhKTtcclxuICAgICAgcHJpbWl0aXZlID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEVuY29kZSBkYXRhIGl0c2VsZlxyXG4gIHZhciByZXN1bHQ7XHJcbiAgaWYgKCFzdGF0ZS5hbnkgJiYgc3RhdGUuY2hvaWNlID09PSBudWxsKSB7XHJcbiAgICB2YXIgdGFnID0gc3RhdGUuaW1wbGljaXQgIT09IG51bGwgPyBzdGF0ZS5pbXBsaWNpdCA6IHN0YXRlLnRhZztcclxuICAgIHZhciBjbHMgPSBzdGF0ZS5pbXBsaWNpdCA9PT0gbnVsbCA/ICd1bml2ZXJzYWwnIDogJ2NvbnRleHQnO1xyXG5cclxuICAgIGlmICh0YWcgPT09IG51bGwpIHtcclxuICAgICAgaWYgKHN0YXRlLnVzZSA9PT0gbnVsbClcclxuICAgICAgICByZXBvcnRlci5lcnJvcignVGFnIGNvdWxkIGJlIG9taXR0ZWQgb25seSBmb3IgLnVzZSgpJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoc3RhdGUudXNlID09PSBudWxsKVxyXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuX2VuY29kZUNvbXBvc2l0ZSh0YWcsIHByaW1pdGl2ZSwgY2xzLCBjb250ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFdyYXAgaW4gZXhwbGljaXRcclxuICBpZiAoc3RhdGUuZXhwbGljaXQgIT09IG51bGwpXHJcbiAgICByZXN1bHQgPSB0aGlzLl9lbmNvZGVDb21wb3NpdGUoc3RhdGUuZXhwbGljaXQsIGZhbHNlLCAnY29udGV4dCcsIHJlc3VsdCk7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5Ob2RlLnByb3RvdHlwZS5fZW5jb2RlQ2hvaWNlID0gZnVuY3Rpb24gZW5jb2RlQ2hvaWNlKGRhdGEsIHJlcG9ydGVyKSB7XHJcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xyXG5cclxuICB2YXIgbm9kZSA9IHN0YXRlLmNob2ljZVtkYXRhLnR5cGVdO1xyXG4gIGlmICghbm9kZSkge1xyXG4gICAgYXNzZXJ0KFxyXG4gICAgICAgIGZhbHNlLFxyXG4gICAgICAgIGRhdGEudHlwZSArICcgbm90IGZvdW5kIGluICcgK1xyXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShPYmplY3Qua2V5cyhzdGF0ZS5jaG9pY2UpKSk7XHJcbiAgfVxyXG4gIHJldHVybiBub2RlLl9lbmNvZGUoZGF0YS52YWx1ZSwgcmVwb3J0ZXIpO1xyXG59O1xyXG5cclxuTm9kZS5wcm90b3R5cGUuX2VuY29kZVByaW1pdGl2ZSA9IGZ1bmN0aW9uIGVuY29kZVByaW1pdGl2ZSh0YWcsIGRhdGEpIHtcclxuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XHJcblxyXG4gIGlmICgvc3RyJC8udGVzdCh0YWcpKVxyXG4gICAgcmV0dXJuIHRoaXMuX2VuY29kZVN0cihkYXRhLCB0YWcpO1xyXG4gIGVsc2UgaWYgKHRhZyA9PT0gJ29iamlkJyAmJiBzdGF0ZS5hcmdzKVxyXG4gICAgcmV0dXJuIHRoaXMuX2VuY29kZU9iamlkKGRhdGEsIHN0YXRlLnJldmVyc2VBcmdzWzBdLCBzdGF0ZS5hcmdzWzFdKTtcclxuICBlbHNlIGlmICh0YWcgPT09ICdvYmppZCcpXHJcbiAgICByZXR1cm4gdGhpcy5fZW5jb2RlT2JqaWQoZGF0YSwgbnVsbCwgbnVsbCk7XHJcbiAgZWxzZSBpZiAodGFnID09PSAnZ2VudGltZScgfHwgdGFnID09PSAndXRjdGltZScpXHJcbiAgICByZXR1cm4gdGhpcy5fZW5jb2RlVGltZShkYXRhLCB0YWcpO1xyXG4gIGVsc2UgaWYgKHRhZyA9PT0gJ251bGxfJylcclxuICAgIHJldHVybiB0aGlzLl9lbmNvZGVOdWxsKCk7XHJcbiAgZWxzZSBpZiAodGFnID09PSAnaW50JyB8fCB0YWcgPT09ICdlbnVtJylcclxuICAgIHJldHVybiB0aGlzLl9lbmNvZGVJbnQoZGF0YSwgc3RhdGUuYXJncyAmJiBzdGF0ZS5yZXZlcnNlQXJnc1swXSk7XHJcbiAgZWxzZSBpZiAodGFnID09PSAnYm9vbCcpXHJcbiAgICByZXR1cm4gdGhpcy5fZW5jb2RlQm9vbChkYXRhKTtcclxuICBlbHNlIGlmICh0YWcgPT09ICdvYmpEZXNjJylcclxuICAgIHJldHVybiB0aGlzLl9lbmNvZGVTdHIoZGF0YSwgdGFnKTtcclxuICBlbHNlXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHRhZzogJyArIHRhZyk7XHJcbn07XHJcblxyXG5Ob2RlLnByb3RvdHlwZS5faXNOdW1zdHIgPSBmdW5jdGlvbiBpc051bXN0cihzdHIpIHtcclxuICByZXR1cm4gL15bMC05IF0qJC8udGVzdChzdHIpO1xyXG59O1xyXG5cclxuTm9kZS5wcm90b3R5cGUuX2lzUHJpbnRzdHIgPSBmdW5jdGlvbiBpc1ByaW50c3RyKHN0cikge1xyXG4gIHJldHVybiAvXltBLVphLXowLTkgJ1xcKFxcKVxcKyxcXC1cXC5cXC86PVxcP10qJC8udGVzdChzdHIpO1xyXG59O1xyXG4iLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG5cclxudmFyIERFUkVuY29kZXIgPSByZXF1aXJlKCcuL2RlcicpO1xyXG5cclxuZnVuY3Rpb24gUEVNRW5jb2RlcihlbnRpdHkpIHtcclxuICBERVJFbmNvZGVyLmNhbGwodGhpcywgZW50aXR5KTtcclxuICB0aGlzLmVuYyA9ICdwZW0nO1xyXG59O1xyXG5pbmhlcml0cyhQRU1FbmNvZGVyLCBERVJFbmNvZGVyKTtcclxubW9kdWxlLmV4cG9ydHMgPSBQRU1FbmNvZGVyO1xyXG5cclxuUEVNRW5jb2Rlci5wcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24gZW5jb2RlKGRhdGEsIG9wdGlvbnMpIHtcclxuICB2YXIgYnVmID0gREVSRW5jb2Rlci5wcm90b3R5cGUuZW5jb2RlLmNhbGwodGhpcywgZGF0YSk7XHJcblxyXG4gIHZhciBwID0gYnVmLnRvU3RyaW5nKCdiYXNlNjQnKTtcclxuICB2YXIgb3V0ID0gWyAnLS0tLS1CRUdJTiAnICsgb3B0aW9ucy5sYWJlbCArICctLS0tLScgXTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHAubGVuZ3RoOyBpICs9IDY0KVxyXG4gICAgb3V0LnB1c2gocC5zbGljZShpLCBpICsgNjQpKTtcclxuICBvdXQucHVzaCgnLS0tLS1FTkQgJyArIG9wdGlvbnMubGFiZWwgKyAnLS0tLS0nKTtcclxuICByZXR1cm4gb3V0LmpvaW4oJ1xcbicpO1xyXG59O1xyXG4iLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzJyk7XHJcblxyXG5leHBvcnRzLnRhZ0NsYXNzID0ge1xyXG4gIDA6ICd1bml2ZXJzYWwnLFxyXG4gIDE6ICdhcHBsaWNhdGlvbicsXHJcbiAgMjogJ2NvbnRleHQnLFxyXG4gIDM6ICdwcml2YXRlJ1xyXG59O1xyXG5leHBvcnRzLnRhZ0NsYXNzQnlOYW1lID0gY29uc3RhbnRzLl9yZXZlcnNlKGV4cG9ydHMudGFnQ2xhc3MpO1xyXG5cclxuZXhwb3J0cy50YWcgPSB7XHJcbiAgMHgwMDogJ2VuZCcsXHJcbiAgMHgwMTogJ2Jvb2wnLFxyXG4gIDB4MDI6ICdpbnQnLFxyXG4gIDB4MDM6ICdiaXRzdHInLFxyXG4gIDB4MDQ6ICdvY3RzdHInLFxyXG4gIDB4MDU6ICdudWxsXycsXHJcbiAgMHgwNjogJ29iamlkJyxcclxuICAweDA3OiAnb2JqRGVzYycsXHJcbiAgMHgwODogJ2V4dGVybmFsJyxcclxuICAweDA5OiAncmVhbCcsXHJcbiAgMHgwYTogJ2VudW0nLFxyXG4gIDB4MGI6ICdlbWJlZCcsXHJcbiAgMHgwYzogJ3V0ZjhzdHInLFxyXG4gIDB4MGQ6ICdyZWxhdGl2ZU9pZCcsXHJcbiAgMHgxMDogJ3NlcScsXHJcbiAgMHgxMTogJ3NldCcsXHJcbiAgMHgxMjogJ251bXN0cicsXHJcbiAgMHgxMzogJ3ByaW50c3RyJyxcclxuICAweDE0OiAndDYxc3RyJyxcclxuICAweDE1OiAndmlkZW9zdHInLFxyXG4gIDB4MTY6ICdpYTVzdHInLFxyXG4gIDB4MTc6ICd1dGN0aW1lJyxcclxuICAweDE4OiAnZ2VudGltZScsXHJcbiAgMHgxOTogJ2dyYXBoc3RyJyxcclxuICAweDFhOiAnaXNvNjQ2c3RyJyxcclxuICAweDFiOiAnZ2Vuc3RyJyxcclxuICAweDFjOiAndW5pc3RyJyxcclxuICAweDFkOiAnY2hhcnN0cicsXHJcbiAgMHgxZTogJ2JtcHN0cidcclxufTtcclxuZXhwb3J0cy50YWdCeU5hbWUgPSBjb25zdGFudHMuX3JldmVyc2UoZXhwb3J0cy50YWcpO1xyXG4iLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xyXG5cclxudmFyIERFUkRlY29kZXIgPSByZXF1aXJlKCcuL2RlcicpO1xyXG5cclxuZnVuY3Rpb24gUEVNRGVjb2RlcihlbnRpdHkpIHtcclxuICBERVJEZWNvZGVyLmNhbGwodGhpcywgZW50aXR5KTtcclxuICB0aGlzLmVuYyA9ICdwZW0nO1xyXG59O1xyXG5pbmhlcml0cyhQRU1EZWNvZGVyLCBERVJEZWNvZGVyKTtcclxubW9kdWxlLmV4cG9ydHMgPSBQRU1EZWNvZGVyO1xyXG5cclxuUEVNRGVjb2Rlci5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24gZGVjb2RlKGRhdGEsIG9wdGlvbnMpIHtcclxuICB2YXIgbGluZXMgPSBkYXRhLnRvU3RyaW5nKCkuc3BsaXQoL1tcXHJcXG5dKy9nKTtcclxuXHJcbiAgdmFyIGxhYmVsID0gb3B0aW9ucy5sYWJlbC50b1VwcGVyQ2FzZSgpO1xyXG5cclxuICB2YXIgcmUgPSAvXi0tLS0tKEJFR0lOfEVORCkgKFteLV0rKS0tLS0tJC87XHJcbiAgdmFyIHN0YXJ0ID0gLTE7XHJcbiAgdmFyIGVuZCA9IC0xO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBtYXRjaCA9IGxpbmVzW2ldLm1hdGNoKHJlKTtcclxuICAgIGlmIChtYXRjaCA9PT0gbnVsbClcclxuICAgICAgY29udGludWU7XHJcblxyXG4gICAgaWYgKG1hdGNoWzJdICE9PSBsYWJlbClcclxuICAgICAgY29udGludWU7XHJcblxyXG4gICAgaWYgKHN0YXJ0ID09PSAtMSkge1xyXG4gICAgICBpZiAobWF0Y2hbMV0gIT09ICdCRUdJTicpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIHN0YXJ0ID0gaTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChtYXRjaFsxXSAhPT0gJ0VORCcpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGVuZCA9IGk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoc3RhcnQgPT09IC0xIHx8IGVuZCA9PT0gLTEpXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BFTSBzZWN0aW9uIG5vdCBmb3VuZCBmb3I6ICcgKyBsYWJlbCk7XHJcblxyXG4gIHZhciBiYXNlNjQgPSBsaW5lcy5zbGljZShzdGFydCArIDEsIGVuZCkuam9pbignJyk7XHJcbiAgLy8gUmVtb3ZlIGV4Y2Vzc2l2ZSBzeW1ib2xzXHJcbiAgYmFzZTY0LnJlcGxhY2UoL1teYS16MC05XFwrXFwvPV0rL2dpLCAnJyk7XHJcblxyXG4gIHZhciBpbnB1dCA9IG5ldyBCdWZmZXIoYmFzZTY0LCAnYmFzZTY0Jyk7XHJcbiAgcmV0dXJuIERFUkRlY29kZXIucHJvdG90eXBlLmRlY29kZS5jYWxsKHRoaXMsIGlucHV0LCBvcHRpb25zKTtcclxufTtcclxuIiwidmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcclxuXHJcbnZhciBhc24xID0gcmVxdWlyZSgnLi4vLi4vYXNuMScpO1xyXG52YXIgYmFzZSA9IGFzbjEuYmFzZTtcclxudmFyIGJpZ251bSA9IGFzbjEuYmlnbnVtO1xyXG5cclxuLy8gSW1wb3J0IERFUiBjb25zdGFudHNcclxudmFyIGRlciA9IGFzbjEuY29uc3RhbnRzLmRlcjtcclxuXHJcbmZ1bmN0aW9uIERFUkRlY29kZXIoZW50aXR5KSB7XHJcbiAgdGhpcy5lbmMgPSAnZGVyJztcclxuICB0aGlzLm5hbWUgPSBlbnRpdHkubmFtZTtcclxuICB0aGlzLmVudGl0eSA9IGVudGl0eTtcclxuXHJcbiAgLy8gQ29uc3RydWN0IGJhc2UgdHJlZVxyXG4gIHRoaXMudHJlZSA9IG5ldyBERVJOb2RlKCk7XHJcbiAgdGhpcy50cmVlLl9pbml0KGVudGl0eS5ib2R5KTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBERVJEZWNvZGVyO1xyXG5cclxuREVSRGVjb2Rlci5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24gZGVjb2RlKGRhdGEsIG9wdGlvbnMpIHtcclxuICBpZiAoIShkYXRhIGluc3RhbmNlb2YgYmFzZS5EZWNvZGVyQnVmZmVyKSlcclxuICAgIGRhdGEgPSBuZXcgYmFzZS5EZWNvZGVyQnVmZmVyKGRhdGEsIG9wdGlvbnMpO1xyXG5cclxuICByZXR1cm4gdGhpcy50cmVlLl9kZWNvZGUoZGF0YSwgb3B0aW9ucyk7XHJcbn07XHJcblxyXG4vLyBUcmVlIG1ldGhvZHNcclxuXHJcbmZ1bmN0aW9uIERFUk5vZGUocGFyZW50KSB7XHJcbiAgYmFzZS5Ob2RlLmNhbGwodGhpcywgJ2RlcicsIHBhcmVudCk7XHJcbn1cclxuaW5oZXJpdHMoREVSTm9kZSwgYmFzZS5Ob2RlKTtcclxuXHJcbkRFUk5vZGUucHJvdG90eXBlLl9wZWVrVGFnID0gZnVuY3Rpb24gcGVla1RhZyhidWZmZXIsIHRhZywgYW55KSB7XHJcbiAgaWYgKGJ1ZmZlci5pc0VtcHR5KCkpXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gIHZhciBzdGF0ZSA9IGJ1ZmZlci5zYXZlKCk7XHJcbiAgdmFyIGRlY29kZWRUYWcgPSBkZXJEZWNvZGVUYWcoYnVmZmVyLCAnRmFpbGVkIHRvIHBlZWsgdGFnOiBcIicgKyB0YWcgKyAnXCInKTtcclxuICBpZiAoYnVmZmVyLmlzRXJyb3IoZGVjb2RlZFRhZykpXHJcbiAgICByZXR1cm4gZGVjb2RlZFRhZztcclxuXHJcbiAgYnVmZmVyLnJlc3RvcmUoc3RhdGUpO1xyXG5cclxuICByZXR1cm4gZGVjb2RlZFRhZy50YWcgPT09IHRhZyB8fCBkZWNvZGVkVGFnLnRhZ1N0ciA9PT0gdGFnIHx8XHJcbiAgICAoZGVjb2RlZFRhZy50YWdTdHIgKyAnb2YnKSA9PT0gdGFnIHx8IGFueTtcclxufTtcclxuXHJcbkRFUk5vZGUucHJvdG90eXBlLl9kZWNvZGVUYWcgPSBmdW5jdGlvbiBkZWNvZGVUYWcoYnVmZmVyLCB0YWcsIGFueSkge1xyXG4gIHZhciBkZWNvZGVkVGFnID0gZGVyRGVjb2RlVGFnKGJ1ZmZlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRmFpbGVkIHRvIGRlY29kZSB0YWcgb2YgXCInICsgdGFnICsgJ1wiJyk7XHJcbiAgaWYgKGJ1ZmZlci5pc0Vycm9yKGRlY29kZWRUYWcpKVxyXG4gICAgcmV0dXJuIGRlY29kZWRUYWc7XHJcblxyXG4gIHZhciBsZW4gPSBkZXJEZWNvZGVMZW4oYnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgZGVjb2RlZFRhZy5wcmltaXRpdmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAnRmFpbGVkIHRvIGdldCBsZW5ndGggb2YgXCInICsgdGFnICsgJ1wiJyk7XHJcblxyXG4gIC8vIEZhaWx1cmVcclxuICBpZiAoYnVmZmVyLmlzRXJyb3IobGVuKSlcclxuICAgIHJldHVybiBsZW47XHJcblxyXG4gIGlmICghYW55ICYmXHJcbiAgICAgIGRlY29kZWRUYWcudGFnICE9PSB0YWcgJiZcclxuICAgICAgZGVjb2RlZFRhZy50YWdTdHIgIT09IHRhZyAmJlxyXG4gICAgICBkZWNvZGVkVGFnLnRhZ1N0ciArICdvZicgIT09IHRhZykge1xyXG4gICAgcmV0dXJuIGJ1ZmZlci5lcnJvcignRmFpbGVkIHRvIG1hdGNoIHRhZzogXCInICsgdGFnICsgJ1wiJyk7XHJcbiAgfVxyXG5cclxuICBpZiAoZGVjb2RlZFRhZy5wcmltaXRpdmUgfHwgbGVuICE9PSBudWxsKVxyXG4gICAgcmV0dXJuIGJ1ZmZlci5za2lwKGxlbiwgJ0ZhaWxlZCB0byBtYXRjaCBib2R5IG9mOiBcIicgKyB0YWcgKyAnXCInKTtcclxuXHJcbiAgLy8gSW5kZWZpbml0ZSBsZW5ndGguLi4gZmluZCBFTkQgdGFnXHJcbiAgdmFyIHN0YXRlID0gYnVmZmVyLnNhdmUoKTtcclxuICB2YXIgcmVzID0gdGhpcy5fc2tpcFVudGlsRW5kKFxyXG4gICAgICBidWZmZXIsXHJcbiAgICAgICdGYWlsZWQgdG8gc2tpcCBpbmRlZmluaXRlIGxlbmd0aCBib2R5OiBcIicgKyB0aGlzLnRhZyArICdcIicpO1xyXG4gIGlmIChidWZmZXIuaXNFcnJvcihyZXMpKVxyXG4gICAgcmV0dXJuIHJlcztcclxuXHJcbiAgbGVuID0gYnVmZmVyLm9mZnNldCAtIHN0YXRlLm9mZnNldDtcclxuICBidWZmZXIucmVzdG9yZShzdGF0ZSk7XHJcbiAgcmV0dXJuIGJ1ZmZlci5za2lwKGxlbiwgJ0ZhaWxlZCB0byBtYXRjaCBib2R5IG9mOiBcIicgKyB0YWcgKyAnXCInKTtcclxufTtcclxuXHJcbkRFUk5vZGUucHJvdG90eXBlLl9za2lwVW50aWxFbmQgPSBmdW5jdGlvbiBza2lwVW50aWxFbmQoYnVmZmVyLCBmYWlsKSB7XHJcbiAgd2hpbGUgKHRydWUpIHtcclxuICAgIHZhciB0YWcgPSBkZXJEZWNvZGVUYWcoYnVmZmVyLCBmYWlsKTtcclxuICAgIGlmIChidWZmZXIuaXNFcnJvcih0YWcpKVxyXG4gICAgICByZXR1cm4gdGFnO1xyXG4gICAgdmFyIGxlbiA9IGRlckRlY29kZUxlbihidWZmZXIsIHRhZy5wcmltaXRpdmUsIGZhaWwpO1xyXG4gICAgaWYgKGJ1ZmZlci5pc0Vycm9yKGxlbikpXHJcbiAgICAgIHJldHVybiBsZW47XHJcblxyXG4gICAgdmFyIHJlcztcclxuICAgIGlmICh0YWcucHJpbWl0aXZlIHx8IGxlbiAhPT0gbnVsbClcclxuICAgICAgcmVzID0gYnVmZmVyLnNraXAobGVuKVxyXG4gICAgZWxzZVxyXG4gICAgICByZXMgPSB0aGlzLl9za2lwVW50aWxFbmQoYnVmZmVyLCBmYWlsKTtcclxuXHJcbiAgICAvLyBGYWlsdXJlXHJcbiAgICBpZiAoYnVmZmVyLmlzRXJyb3IocmVzKSlcclxuICAgICAgcmV0dXJuIHJlcztcclxuXHJcbiAgICBpZiAodGFnLnRhZ1N0ciA9PT0gJ2VuZCcpXHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufTtcclxuXHJcbkRFUk5vZGUucHJvdG90eXBlLl9kZWNvZGVMaXN0ID0gZnVuY3Rpb24gZGVjb2RlTGlzdChidWZmZXIsIHRhZywgZGVjb2RlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMpIHtcclxuICB2YXIgcmVzdWx0ID0gW107XHJcbiAgd2hpbGUgKCFidWZmZXIuaXNFbXB0eSgpKSB7XHJcbiAgICB2YXIgcG9zc2libGVFbmQgPSB0aGlzLl9wZWVrVGFnKGJ1ZmZlciwgJ2VuZCcpO1xyXG4gICAgaWYgKGJ1ZmZlci5pc0Vycm9yKHBvc3NpYmxlRW5kKSlcclxuICAgICAgcmV0dXJuIHBvc3NpYmxlRW5kO1xyXG5cclxuICAgIHZhciByZXMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIsICdkZXInLCBvcHRpb25zKTtcclxuICAgIGlmIChidWZmZXIuaXNFcnJvcihyZXMpICYmIHBvc3NpYmxlRW5kKVxyXG4gICAgICBicmVhaztcclxuICAgIHJlc3VsdC5wdXNoKHJlcyk7XHJcbiAgfVxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5ERVJOb2RlLnByb3RvdHlwZS5fZGVjb2RlU3RyID0gZnVuY3Rpb24gZGVjb2RlU3RyKGJ1ZmZlciwgdGFnKSB7XHJcbiAgaWYgKHRhZyA9PT0gJ2JpdHN0cicpIHtcclxuICAgIHZhciB1bnVzZWQgPSBidWZmZXIucmVhZFVJbnQ4KCk7XHJcbiAgICBpZiAoYnVmZmVyLmlzRXJyb3IodW51c2VkKSlcclxuICAgICAgcmV0dXJuIHVudXNlZDtcclxuICAgIHJldHVybiB7IHVudXNlZDogdW51c2VkLCBkYXRhOiBidWZmZXIucmF3KCkgfTtcclxuICB9IGVsc2UgaWYgKHRhZyA9PT0gJ2JtcHN0cicpIHtcclxuICAgIHZhciByYXcgPSBidWZmZXIucmF3KCk7XHJcbiAgICBpZiAocmF3Lmxlbmd0aCAlIDIgPT09IDEpXHJcbiAgICAgIHJldHVybiBidWZmZXIuZXJyb3IoJ0RlY29kaW5nIG9mIHN0cmluZyB0eXBlOiBibXBzdHIgbGVuZ3RoIG1pc21hdGNoJyk7XHJcblxyXG4gICAgdmFyIHN0ciA9ICcnO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXcubGVuZ3RoIC8gMjsgaSsrKSB7XHJcbiAgICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHJhdy5yZWFkVUludDE2QkUoaSAqIDIpKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdHI7XHJcbiAgfSBlbHNlIGlmICh0YWcgPT09ICdudW1zdHInKSB7XHJcbiAgICB2YXIgbnVtc3RyID0gYnVmZmVyLnJhdygpLnRvU3RyaW5nKCdhc2NpaScpO1xyXG4gICAgaWYgKCF0aGlzLl9pc051bXN0cihudW1zdHIpKSB7XHJcbiAgICAgIHJldHVybiBidWZmZXIuZXJyb3IoJ0RlY29kaW5nIG9mIHN0cmluZyB0eXBlOiAnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAnbnVtc3RyIHVuc3VwcG9ydGVkIGNoYXJhY3RlcnMnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBudW1zdHI7XHJcbiAgfSBlbHNlIGlmICh0YWcgPT09ICdvY3RzdHInKSB7XHJcbiAgICByZXR1cm4gYnVmZmVyLnJhdygpO1xyXG4gIH0gZWxzZSBpZiAodGFnID09PSAnb2JqRGVzYycpIHtcclxuICAgIHJldHVybiBidWZmZXIucmF3KCk7XHJcbiAgfSBlbHNlIGlmICh0YWcgPT09ICdwcmludHN0cicpIHtcclxuICAgIHZhciBwcmludHN0ciA9IGJ1ZmZlci5yYXcoKS50b1N0cmluZygnYXNjaWknKTtcclxuICAgIGlmICghdGhpcy5faXNQcmludHN0cihwcmludHN0cikpIHtcclxuICAgICAgcmV0dXJuIGJ1ZmZlci5lcnJvcignRGVjb2Rpbmcgb2Ygc3RyaW5nIHR5cGU6ICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdwcmludHN0ciB1bnN1cHBvcnRlZCBjaGFyYWN0ZXJzJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJpbnRzdHI7XHJcbiAgfSBlbHNlIGlmICgvc3RyJC8udGVzdCh0YWcpKSB7XHJcbiAgICByZXR1cm4gYnVmZmVyLnJhdygpLnRvU3RyaW5nKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBidWZmZXIuZXJyb3IoJ0RlY29kaW5nIG9mIHN0cmluZyB0eXBlOiAnICsgdGFnICsgJyB1bnN1cHBvcnRlZCcpO1xyXG4gIH1cclxufTtcclxuXHJcbkRFUk5vZGUucHJvdG90eXBlLl9kZWNvZGVPYmppZCA9IGZ1bmN0aW9uIGRlY29kZU9iamlkKGJ1ZmZlciwgdmFsdWVzLCByZWxhdGl2ZSkge1xyXG4gIHZhciByZXN1bHQ7XHJcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XHJcbiAgdmFyIGlkZW50ID0gMDtcclxuICB3aGlsZSAoIWJ1ZmZlci5pc0VtcHR5KCkpIHtcclxuICAgIHZhciBzdWJpZGVudCA9IGJ1ZmZlci5yZWFkVUludDgoKTtcclxuICAgIGlkZW50IDw8PSA3O1xyXG4gICAgaWRlbnQgfD0gc3ViaWRlbnQgJiAweDdmO1xyXG4gICAgaWYgKChzdWJpZGVudCAmIDB4ODApID09PSAwKSB7XHJcbiAgICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnQpO1xyXG4gICAgICBpZGVudCA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChzdWJpZGVudCAmIDB4ODApXHJcbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50KTtcclxuXHJcbiAgdmFyIGZpcnN0ID0gKGlkZW50aWZpZXJzWzBdIC8gNDApIHwgMDtcclxuICB2YXIgc2Vjb25kID0gaWRlbnRpZmllcnNbMF0gJSA0MDtcclxuXHJcbiAgaWYgKHJlbGF0aXZlKVxyXG4gICAgcmVzdWx0ID0gaWRlbnRpZmllcnM7XHJcbiAgZWxzZVxyXG4gICAgcmVzdWx0ID0gW2ZpcnN0LCBzZWNvbmRdLmNvbmNhdChpZGVudGlmaWVycy5zbGljZSgxKSk7XHJcblxyXG4gIGlmICh2YWx1ZXMpIHtcclxuICAgIHZhciB0bXAgPSB2YWx1ZXNbcmVzdWx0LmpvaW4oJyAnKV07XHJcbiAgICBpZiAodG1wID09PSB1bmRlZmluZWQpXHJcbiAgICAgIHRtcCA9IHZhbHVlc1tyZXN1bHQuam9pbignLicpXTtcclxuICAgIGlmICh0bXAgIT09IHVuZGVmaW5lZClcclxuICAgICAgcmVzdWx0ID0gdG1wO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbkRFUk5vZGUucHJvdG90eXBlLl9kZWNvZGVUaW1lID0gZnVuY3Rpb24gZGVjb2RlVGltZShidWZmZXIsIHRhZykge1xyXG4gIHZhciBzdHIgPSBidWZmZXIucmF3KCkudG9TdHJpbmcoKTtcclxuICBpZiAodGFnID09PSAnZ2VudGltZScpIHtcclxuICAgIHZhciB5ZWFyID0gc3RyLnNsaWNlKDAsIDQpIHwgMDtcclxuICAgIHZhciBtb24gPSBzdHIuc2xpY2UoNCwgNikgfCAwO1xyXG4gICAgdmFyIGRheSA9IHN0ci5zbGljZSg2LCA4KSB8IDA7XHJcbiAgICB2YXIgaG91ciA9IHN0ci5zbGljZSg4LCAxMCkgfCAwO1xyXG4gICAgdmFyIG1pbiA9IHN0ci5zbGljZSgxMCwgMTIpIHwgMDtcclxuICAgIHZhciBzZWMgPSBzdHIuc2xpY2UoMTIsIDE0KSB8IDA7XHJcbiAgfSBlbHNlIGlmICh0YWcgPT09ICd1dGN0aW1lJykge1xyXG4gICAgdmFyIHllYXIgPSBzdHIuc2xpY2UoMCwgMikgfCAwO1xyXG4gICAgdmFyIG1vbiA9IHN0ci5zbGljZSgyLCA0KSB8IDA7XHJcbiAgICB2YXIgZGF5ID0gc3RyLnNsaWNlKDQsIDYpIHwgMDtcclxuICAgIHZhciBob3VyID0gc3RyLnNsaWNlKDYsIDgpIHwgMDtcclxuICAgIHZhciBtaW4gPSBzdHIuc2xpY2UoOCwgMTApIHwgMDtcclxuICAgIHZhciBzZWMgPSBzdHIuc2xpY2UoMTAsIDEyKSB8IDA7XHJcbiAgICBpZiAoeWVhciA8IDcwKVxyXG4gICAgICB5ZWFyID0gMjAwMCArIHllYXI7XHJcbiAgICBlbHNlXHJcbiAgICAgIHllYXIgPSAxOTAwICsgeWVhcjtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGJ1ZmZlci5lcnJvcignRGVjb2RpbmcgJyArIHRhZyArICcgdGltZSBpcyBub3Qgc3VwcG9ydGVkIHlldCcpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIERhdGUuVVRDKHllYXIsIG1vbiAtIDEsIGRheSwgaG91ciwgbWluLCBzZWMsIDApO1xyXG59O1xyXG5cclxuREVSTm9kZS5wcm90b3R5cGUuX2RlY29kZU51bGwgPSBmdW5jdGlvbiBkZWNvZGVOdWxsKGJ1ZmZlcikge1xyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuREVSTm9kZS5wcm90b3R5cGUuX2RlY29kZUJvb2wgPSBmdW5jdGlvbiBkZWNvZGVCb29sKGJ1ZmZlcikge1xyXG4gIHZhciByZXMgPSBidWZmZXIucmVhZFVJbnQ4KCk7XHJcbiAgaWYgKGJ1ZmZlci5pc0Vycm9yKHJlcykpXHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIGVsc2VcclxuICAgIHJldHVybiByZXMgIT09IDA7XHJcbn07XHJcblxyXG5ERVJOb2RlLnByb3RvdHlwZS5fZGVjb2RlSW50ID0gZnVuY3Rpb24gZGVjb2RlSW50KGJ1ZmZlciwgdmFsdWVzKSB7XHJcbiAgLy8gQmlnaW50LCByZXR1cm4gYXMgaXQgaXMgKGFzc3VtZSBiaWcgZW5kaWFuKVxyXG4gIHZhciByYXcgPSBidWZmZXIucmF3KCk7XHJcbiAgdmFyIHJlcyA9IG5ldyBiaWdudW0ocmF3KTtcclxuXHJcbiAgaWYgKHZhbHVlcylcclxuICAgIHJlcyA9IHZhbHVlc1tyZXMudG9TdHJpbmcoMTApXSB8fCByZXM7XHJcblxyXG4gIHJldHVybiByZXM7XHJcbn07XHJcblxyXG5ERVJOb2RlLnByb3RvdHlwZS5fdXNlID0gZnVuY3Rpb24gdXNlKGVudGl0eSwgb2JqKSB7XHJcbiAgaWYgKHR5cGVvZiBlbnRpdHkgPT09ICdmdW5jdGlvbicpXHJcbiAgICBlbnRpdHkgPSBlbnRpdHkob2JqKTtcclxuICByZXR1cm4gZW50aXR5Ll9nZXREZWNvZGVyKCdkZXInKS50cmVlO1xyXG59O1xyXG5cclxuLy8gVXRpbGl0eSBtZXRob2RzXHJcblxyXG5mdW5jdGlvbiBkZXJEZWNvZGVUYWcoYnVmLCBmYWlsKSB7XHJcbiAgdmFyIHRhZyA9IGJ1Zi5yZWFkVUludDgoZmFpbCk7XHJcbiAgaWYgKGJ1Zi5pc0Vycm9yKHRhZykpXHJcbiAgICByZXR1cm4gdGFnO1xyXG5cclxuICB2YXIgY2xzID0gZGVyLnRhZ0NsYXNzW3RhZyA+PiA2XTtcclxuICB2YXIgcHJpbWl0aXZlID0gKHRhZyAmIDB4MjApID09PSAwO1xyXG5cclxuICAvLyBNdWx0aS1vY3RldCB0YWcgLSBsb2FkXHJcbiAgaWYgKCh0YWcgJiAweDFmKSA9PT0gMHgxZikge1xyXG4gICAgdmFyIG9jdCA9IHRhZztcclxuICAgIHRhZyA9IDA7XHJcbiAgICB3aGlsZSAoKG9jdCAmIDB4ODApID09PSAweDgwKSB7XHJcbiAgICAgIG9jdCA9IGJ1Zi5yZWFkVUludDgoZmFpbCk7XHJcbiAgICAgIGlmIChidWYuaXNFcnJvcihvY3QpKVxyXG4gICAgICAgIHJldHVybiBvY3Q7XHJcblxyXG4gICAgICB0YWcgPDw9IDc7XHJcbiAgICAgIHRhZyB8PSBvY3QgJiAweDdmO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICB0YWcgJj0gMHgxZjtcclxuICB9XHJcbiAgdmFyIHRhZ1N0ciA9IGRlci50YWdbdGFnXTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGNsczogY2xzLFxyXG4gICAgcHJpbWl0aXZlOiBwcmltaXRpdmUsXHJcbiAgICB0YWc6IHRhZyxcclxuICAgIHRhZ1N0cjogdGFnU3RyXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGVyRGVjb2RlTGVuKGJ1ZiwgcHJpbWl0aXZlLCBmYWlsKSB7XHJcbiAgdmFyIGxlbiA9IGJ1Zi5yZWFkVUludDgoZmFpbCk7XHJcbiAgaWYgKGJ1Zi5pc0Vycm9yKGxlbikpXHJcbiAgICByZXR1cm4gbGVuO1xyXG5cclxuICAvLyBJbmRlZmluaXRlIGZvcm1cclxuICBpZiAoIXByaW1pdGl2ZSAmJiBsZW4gPT09IDB4ODApXHJcbiAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgLy8gRGVmaW5pdGUgZm9ybVxyXG4gIGlmICgobGVuICYgMHg4MCkgPT09IDApIHtcclxuICAgIC8vIFNob3J0IGZvcm1cclxuICAgIHJldHVybiBsZW47XHJcbiAgfVxyXG5cclxuICAvLyBMb25nIGZvcm1cclxuICB2YXIgbnVtID0gbGVuICYgMHg3ZjtcclxuICBpZiAobnVtID4gNClcclxuICAgIHJldHVybiBidWYuZXJyb3IoJ2xlbmd0aCBvY3RlY3QgaXMgdG9vIGxvbmcnKTtcclxuXHJcbiAgbGVuID0gMDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bTsgaSsrKSB7XHJcbiAgICBsZW4gPDw9IDg7XHJcbiAgICB2YXIgaiA9IGJ1Zi5yZWFkVUludDgoZmFpbCk7XHJcbiAgICBpZiAoYnVmLmlzRXJyb3IoaikpXHJcbiAgICAgIHJldHVybiBqO1xyXG4gICAgbGVuIHw9IGo7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbGVuO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=