(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.jws"],{

/***/ "DacQ":
/*!******************************************!*\
  !*** ./node_modules/jws/lib/tostring.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*global module*/
var Buffer = __webpack_require__(/*! buffer */ "tjlA").Buffer;

module.exports = function toString(obj) {
  if (typeof obj === 'string')
    return obj;
  if (typeof obj === 'number' || Buffer.isBuffer(obj))
    return obj.toString();
  return JSON.stringify(obj);
};


/***/ }),

/***/ "GC/n":
/*!***********************************************!*\
  !*** ./node_modules/jws/lib/verify-stream.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*global module*/
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer;
var DataStream = __webpack_require__(/*! ./data-stream */ "ocFe");
var jwa = __webpack_require__(/*! jwa */ "eegf");
var Stream = __webpack_require__(/*! stream */ "1IWx");
var toString = __webpack_require__(/*! ./tostring */ "DacQ");
var util = __webpack_require__(/*! util */ "7tlc");
var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

function isObject(thing) {
  return Object.prototype.toString.call(thing) === '[object Object]';
}

function safeJsonParse(thing) {
  if (isObject(thing))
    return thing;
  try { return JSON.parse(thing); }
  catch (e) { return undefined; }
}

function headerFromJWS(jwsSig) {
  var encodedHeader = jwsSig.split('.', 1)[0];
  return safeJsonParse(Buffer.from(encodedHeader, 'base64').toString('binary'));
}

function securedInputFromJWS(jwsSig) {
  return jwsSig.split('.', 2).join('.');
}

function signatureFromJWS(jwsSig) {
  return jwsSig.split('.')[2];
}

function payloadFromJWS(jwsSig, encoding) {
  encoding = encoding || 'utf8';
  var payload = jwsSig.split('.')[1];
  return Buffer.from(payload, 'base64').toString(encoding);
}

function isValidJws(string) {
  return JWS_REGEX.test(string) && !!headerFromJWS(string);
}

function jwsVerify(jwsSig, algorithm, secretOrKey) {
  if (!algorithm) {
    var err = new Error("Missing algorithm parameter for jws.verify");
    err.code = "MISSING_ALGORITHM";
    throw err;
  }
  jwsSig = toString(jwsSig);
  var signature = signatureFromJWS(jwsSig);
  var securedInput = securedInputFromJWS(jwsSig);
  var algo = jwa(algorithm);
  return algo.verify(securedInput, signature, secretOrKey);
}

function jwsDecode(jwsSig, opts) {
  opts = opts || {};
  jwsSig = toString(jwsSig);

  if (!isValidJws(jwsSig))
    return null;

  var header = headerFromJWS(jwsSig);

  if (!header)
    return null;

  var payload = payloadFromJWS(jwsSig);
  if (header.typ === 'JWT' || opts.json)
    payload = JSON.parse(payload, opts.encoding);

  return {
    header: header,
    payload: payload,
    signature: signatureFromJWS(jwsSig)
  };
}

function VerifyStream(opts) {
  opts = opts || {};
  var secretOrKey = opts.secret||opts.publicKey||opts.key;
  var secretStream = new DataStream(secretOrKey);
  this.readable = true;
  this.algorithm = opts.algorithm;
  this.encoding = opts.encoding;
  this.secret = this.publicKey = this.key = secretStream;
  this.signature = new DataStream(opts.signature);
  this.secret.once('close', function () {
    if (!this.signature.writable && this.readable)
      this.verify();
  }.bind(this));

  this.signature.once('close', function () {
    if (!this.secret.writable && this.readable)
      this.verify();
  }.bind(this));
}
util.inherits(VerifyStream, Stream);
VerifyStream.prototype.verify = function verify() {
  try {
    var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);
    var obj = jwsDecode(this.signature.buffer, this.encoding);
    this.emit('done', valid, obj);
    this.emit('data', valid);
    this.emit('end');
    this.readable = false;
    return valid;
  } catch (e) {
    this.readable = false;
    this.emit('error', e);
    this.emit('close');
  }
};

VerifyStream.decode = jwsDecode;
VerifyStream.isValid = isValidJws;
VerifyStream.verify = jwsVerify;

module.exports = VerifyStream;


/***/ }),

/***/ "M+8A":
/*!***********************************!*\
  !*** ./node_modules/jws/index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*global exports*/
var SignStream = __webpack_require__(/*! ./lib/sign-stream */ "bDwd");
var VerifyStream = __webpack_require__(/*! ./lib/verify-stream */ "GC/n");

var ALGORITHMS = [
  'HS256', 'HS384', 'HS512',
  'RS256', 'RS384', 'RS512',
  'PS256', 'PS384', 'PS512',
  'ES256', 'ES384', 'ES512'
];

exports.ALGORITHMS = ALGORITHMS;
exports.sign = SignStream.sign;
exports.verify = VerifyStream.verify;
exports.decode = VerifyStream.decode;
exports.isValid = VerifyStream.isValid;
exports.createSign = function createSign(opts) {
  return new SignStream(opts);
};
exports.createVerify = function createVerify(opts) {
  return new VerifyStream(opts);
};


/***/ }),

/***/ "bDwd":
/*!*********************************************!*\
  !*** ./node_modules/jws/lib/sign-stream.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*global module*/
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer;
var DataStream = __webpack_require__(/*! ./data-stream */ "ocFe");
var jwa = __webpack_require__(/*! jwa */ "eegf");
var Stream = __webpack_require__(/*! stream */ "1IWx");
var toString = __webpack_require__(/*! ./tostring */ "DacQ");
var util = __webpack_require__(/*! util */ "7tlc");

function base64url(string, encoding) {
  return Buffer
    .from(string, encoding)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function jwsSecuredInput(header, payload, encoding) {
  encoding = encoding || 'utf8';
  var encodedHeader = base64url(toString(header), 'binary');
  var encodedPayload = base64url(toString(payload), encoding);
  return util.format('%s.%s', encodedHeader, encodedPayload);
}

function jwsSign(opts) {
  var header = opts.header;
  var payload = opts.payload;
  var secretOrKey = opts.secret || opts.privateKey;
  var encoding = opts.encoding;
  var algo = jwa(header.alg);
  var securedInput = jwsSecuredInput(header, payload, encoding);
  var signature = algo.sign(securedInput, secretOrKey);
  return util.format('%s.%s', securedInput, signature);
}

function SignStream(opts) {
  var secret = opts.secret||opts.privateKey||opts.key;
  var secretStream = new DataStream(secret);
  this.readable = true;
  this.header = opts.header;
  this.encoding = opts.encoding;
  this.secret = this.privateKey = this.key = secretStream;
  this.payload = new DataStream(opts.payload);
  this.secret.once('close', function () {
    if (!this.payload.writable && this.readable)
      this.sign();
  }.bind(this));

  this.payload.once('close', function () {
    if (!this.secret.writable && this.readable)
      this.sign();
  }.bind(this));
}
util.inherits(SignStream, Stream);

SignStream.prototype.sign = function sign() {
  try {
    var signature = jwsSign({
      header: this.header,
      payload: this.payload.buffer,
      secret: this.secret.buffer,
      encoding: this.encoding
    });
    this.emit('done', signature);
    this.emit('data', signature);
    this.emit('end');
    this.readable = false;
    return signature;
  } catch (e) {
    this.readable = false;
    this.emit('error', e);
    this.emit('close');
  }
};

SignStream.sign = jwsSign;

module.exports = SignStream;


/***/ }),

/***/ "ocFe":
/*!*********************************************!*\
  !*** ./node_modules/jws/lib/data-stream.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/*global module, process*/
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer;
var Stream = __webpack_require__(/*! stream */ "1IWx");
var util = __webpack_require__(/*! util */ "7tlc");

function DataStream(data) {
  this.buffer = null;
  this.writable = true;
  this.readable = true;

  // No input
  if (!data) {
    this.buffer = Buffer.alloc(0);
    return this;
  }

  // Stream
  if (typeof data.pipe === 'function') {
    this.buffer = Buffer.alloc(0);
    data.pipe(this);
    return this;
  }

  // Buffer or String
  // or Object (assumedly a passworded key)
  if (data.length || typeof data === 'object') {
    this.buffer = data;
    this.writable = false;
    process.nextTick(function () {
      this.emit('end', data);
      this.readable = false;
      this.emit('close');
    }.bind(this));
    return this;
  }

  throw new TypeError('Unexpected data type ('+ typeof data + ')');
}
util.inherits(DataStream, Stream);

DataStream.prototype.write = function write(data) {
  this.buffer = Buffer.concat([this.buffer, Buffer.from(data)]);
  this.emit('data', data);
};

DataStream.prototype.end = function end(data) {
  if (data)
    this.write(data);
  this.emit('end', data);
  this.emit('close');
  this.writable = false;
  this.readable = false;
};

module.exports = DataStream;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "8oxB")))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvandzL2xpYi90b3N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvandzL2xpYi92ZXJpZnktc3RyZWFtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qd3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2p3cy9saWIvc2lnbi1zdHJlYW0uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2p3cy9saWIvZGF0YS1zdHJlYW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxhQUFhLG1CQUFPLENBQUMsb0JBQVE7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNUQTtBQUNBLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQyxpQkFBaUIsbUJBQU8sQ0FBQywyQkFBZTtBQUN4QyxVQUFVLG1CQUFPLENBQUMsaUJBQUs7QUFDdkIsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLGVBQWUsbUJBQU8sQ0FBQyx3QkFBWTtBQUNuQyxXQUFXLG1CQUFPLENBQUMsa0JBQU07QUFDekI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sMEJBQTBCO0FBQ2pDLGFBQWEsa0JBQWtCO0FBQy9COztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUN2SEE7QUFDQSxpQkFBaUIsbUJBQU8sQ0FBQywrQkFBbUI7QUFDNUMsbUJBQW1CLG1CQUFPLENBQUMsaUNBQXFCOztBQUVoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDckJBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLHlCQUFhO0FBQ2xDLGlCQUFpQixtQkFBTyxDQUFDLDJCQUFlO0FBQ3hDLFVBQVUsbUJBQU8sQ0FBQyxpQkFBSztBQUN2QixhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsZUFBZSxtQkFBTyxDQUFDLHdCQUFZO0FBQ25DLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7Ozs7Ozs7QUM3RUE7QUFDQSxhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5qd3MuZDlmMjcxMGE4MWU0M2RmODEzODEuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKmdsb2JhbCBtb2R1bGUqL1xyXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b1N0cmluZyhvYmopIHtcclxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpXHJcbiAgICByZXR1cm4gb2JqO1xyXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnbnVtYmVyJyB8fCBCdWZmZXIuaXNCdWZmZXIob2JqKSlcclxuICAgIHJldHVybiBvYmoudG9TdHJpbmcoKTtcclxuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcclxufTtcclxuIiwiLypnbG9iYWwgbW9kdWxlKi9cclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyO1xyXG52YXIgRGF0YVN0cmVhbSA9IHJlcXVpcmUoJy4vZGF0YS1zdHJlYW0nKTtcclxudmFyIGp3YSA9IHJlcXVpcmUoJ2p3YScpO1xyXG52YXIgU3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XHJcbnZhciB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9zdHJpbmcnKTtcclxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XHJcbnZhciBKV1NfUkVHRVggPSAvXlthLXpBLVowLTlcXC1fXSs/XFwuW2EtekEtWjAtOVxcLV9dKz9cXC4oW2EtekEtWjAtOVxcLV9dKyk/JC87XHJcblxyXG5mdW5jdGlvbiBpc09iamVjdCh0aGluZykge1xyXG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpbmcpID09PSAnW29iamVjdCBPYmplY3RdJztcclxufVxyXG5cclxuZnVuY3Rpb24gc2FmZUpzb25QYXJzZSh0aGluZykge1xyXG4gIGlmIChpc09iamVjdCh0aGluZykpXHJcbiAgICByZXR1cm4gdGhpbmc7XHJcbiAgdHJ5IHsgcmV0dXJuIEpTT04ucGFyc2UodGhpbmcpOyB9XHJcbiAgY2F0Y2ggKGUpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBoZWFkZXJGcm9tSldTKGp3c1NpZykge1xyXG4gIHZhciBlbmNvZGVkSGVhZGVyID0gandzU2lnLnNwbGl0KCcuJywgMSlbMF07XHJcbiAgcmV0dXJuIHNhZmVKc29uUGFyc2UoQnVmZmVyLmZyb20oZW5jb2RlZEhlYWRlciwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCdiaW5hcnknKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNlY3VyZWRJbnB1dEZyb21KV1MoandzU2lnKSB7XHJcbiAgcmV0dXJuIGp3c1NpZy5zcGxpdCgnLicsIDIpLmpvaW4oJy4nKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2lnbmF0dXJlRnJvbUpXUyhqd3NTaWcpIHtcclxuICByZXR1cm4gandzU2lnLnNwbGl0KCcuJylbMl07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBheWxvYWRGcm9tSldTKGp3c1NpZywgZW5jb2RpbmcpIHtcclxuICBlbmNvZGluZyA9IGVuY29kaW5nIHx8ICd1dGY4JztcclxuICB2YXIgcGF5bG9hZCA9IGp3c1NpZy5zcGxpdCgnLicpWzFdO1xyXG4gIHJldHVybiBCdWZmZXIuZnJvbShwYXlsb2FkLCAnYmFzZTY0JykudG9TdHJpbmcoZW5jb2RpbmcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc1ZhbGlkSndzKHN0cmluZykge1xyXG4gIHJldHVybiBKV1NfUkVHRVgudGVzdChzdHJpbmcpICYmICEhaGVhZGVyRnJvbUpXUyhzdHJpbmcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBqd3NWZXJpZnkoandzU2lnLCBhbGdvcml0aG0sIHNlY3JldE9yS2V5KSB7XHJcbiAgaWYgKCFhbGdvcml0aG0pIHtcclxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXCJNaXNzaW5nIGFsZ29yaXRobSBwYXJhbWV0ZXIgZm9yIGp3cy52ZXJpZnlcIik7XHJcbiAgICBlcnIuY29kZSA9IFwiTUlTU0lOR19BTEdPUklUSE1cIjtcclxuICAgIHRocm93IGVycjtcclxuICB9XHJcbiAgandzU2lnID0gdG9TdHJpbmcoandzU2lnKTtcclxuICB2YXIgc2lnbmF0dXJlID0gc2lnbmF0dXJlRnJvbUpXUyhqd3NTaWcpO1xyXG4gIHZhciBzZWN1cmVkSW5wdXQgPSBzZWN1cmVkSW5wdXRGcm9tSldTKGp3c1NpZyk7XHJcbiAgdmFyIGFsZ28gPSBqd2EoYWxnb3JpdGhtKTtcclxuICByZXR1cm4gYWxnby52ZXJpZnkoc2VjdXJlZElucHV0LCBzaWduYXR1cmUsIHNlY3JldE9yS2V5KTtcclxufVxyXG5cclxuZnVuY3Rpb24gandzRGVjb2RlKGp3c1NpZywgb3B0cykge1xyXG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xyXG4gIGp3c1NpZyA9IHRvU3RyaW5nKGp3c1NpZyk7XHJcblxyXG4gIGlmICghaXNWYWxpZEp3cyhqd3NTaWcpKVxyXG4gICAgcmV0dXJuIG51bGw7XHJcblxyXG4gIHZhciBoZWFkZXIgPSBoZWFkZXJGcm9tSldTKGp3c1NpZyk7XHJcblxyXG4gIGlmICghaGVhZGVyKVxyXG4gICAgcmV0dXJuIG51bGw7XHJcblxyXG4gIHZhciBwYXlsb2FkID0gcGF5bG9hZEZyb21KV1MoandzU2lnKTtcclxuICBpZiAoaGVhZGVyLnR5cCA9PT0gJ0pXVCcgfHwgb3B0cy5qc29uKVxyXG4gICAgcGF5bG9hZCA9IEpTT04ucGFyc2UocGF5bG9hZCwgb3B0cy5lbmNvZGluZyk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBoZWFkZXI6IGhlYWRlcixcclxuICAgIHBheWxvYWQ6IHBheWxvYWQsXHJcbiAgICBzaWduYXR1cmU6IHNpZ25hdHVyZUZyb21KV1MoandzU2lnKVxyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFZlcmlmeVN0cmVhbShvcHRzKSB7XHJcbiAgb3B0cyA9IG9wdHMgfHwge307XHJcbiAgdmFyIHNlY3JldE9yS2V5ID0gb3B0cy5zZWNyZXR8fG9wdHMucHVibGljS2V5fHxvcHRzLmtleTtcclxuICB2YXIgc2VjcmV0U3RyZWFtID0gbmV3IERhdGFTdHJlYW0oc2VjcmV0T3JLZXkpO1xyXG4gIHRoaXMucmVhZGFibGUgPSB0cnVlO1xyXG4gIHRoaXMuYWxnb3JpdGhtID0gb3B0cy5hbGdvcml0aG07XHJcbiAgdGhpcy5lbmNvZGluZyA9IG9wdHMuZW5jb2Rpbmc7XHJcbiAgdGhpcy5zZWNyZXQgPSB0aGlzLnB1YmxpY0tleSA9IHRoaXMua2V5ID0gc2VjcmV0U3RyZWFtO1xyXG4gIHRoaXMuc2lnbmF0dXJlID0gbmV3IERhdGFTdHJlYW0ob3B0cy5zaWduYXR1cmUpO1xyXG4gIHRoaXMuc2VjcmV0Lm9uY2UoJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCF0aGlzLnNpZ25hdHVyZS53cml0YWJsZSAmJiB0aGlzLnJlYWRhYmxlKVxyXG4gICAgICB0aGlzLnZlcmlmeSgpO1xyXG4gIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gIHRoaXMuc2lnbmF0dXJlLm9uY2UoJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCF0aGlzLnNlY3JldC53cml0YWJsZSAmJiB0aGlzLnJlYWRhYmxlKVxyXG4gICAgICB0aGlzLnZlcmlmeSgpO1xyXG4gIH0uYmluZCh0aGlzKSk7XHJcbn1cclxudXRpbC5pbmhlcml0cyhWZXJpZnlTdHJlYW0sIFN0cmVhbSk7XHJcblZlcmlmeVN0cmVhbS5wcm90b3R5cGUudmVyaWZ5ID0gZnVuY3Rpb24gdmVyaWZ5KCkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdmFsaWQgPSBqd3NWZXJpZnkodGhpcy5zaWduYXR1cmUuYnVmZmVyLCB0aGlzLmFsZ29yaXRobSwgdGhpcy5rZXkuYnVmZmVyKTtcclxuICAgIHZhciBvYmogPSBqd3NEZWNvZGUodGhpcy5zaWduYXR1cmUuYnVmZmVyLCB0aGlzLmVuY29kaW5nKTtcclxuICAgIHRoaXMuZW1pdCgnZG9uZScsIHZhbGlkLCBvYmopO1xyXG4gICAgdGhpcy5lbWl0KCdkYXRhJywgdmFsaWQpO1xyXG4gICAgdGhpcy5lbWl0KCdlbmQnKTtcclxuICAgIHRoaXMucmVhZGFibGUgPSBmYWxzZTtcclxuICAgIHJldHVybiB2YWxpZDtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICB0aGlzLnJlYWRhYmxlID0gZmFsc2U7XHJcbiAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZSk7XHJcbiAgICB0aGlzLmVtaXQoJ2Nsb3NlJyk7XHJcbiAgfVxyXG59O1xyXG5cclxuVmVyaWZ5U3RyZWFtLmRlY29kZSA9IGp3c0RlY29kZTtcclxuVmVyaWZ5U3RyZWFtLmlzVmFsaWQgPSBpc1ZhbGlkSndzO1xyXG5WZXJpZnlTdHJlYW0udmVyaWZ5ID0gandzVmVyaWZ5O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWZXJpZnlTdHJlYW07XHJcbiIsIi8qZ2xvYmFsIGV4cG9ydHMqL1xyXG52YXIgU2lnblN0cmVhbSA9IHJlcXVpcmUoJy4vbGliL3NpZ24tc3RyZWFtJyk7XHJcbnZhciBWZXJpZnlTdHJlYW0gPSByZXF1aXJlKCcuL2xpYi92ZXJpZnktc3RyZWFtJyk7XHJcblxyXG52YXIgQUxHT1JJVEhNUyA9IFtcclxuICAnSFMyNTYnLCAnSFMzODQnLCAnSFM1MTInLFxyXG4gICdSUzI1NicsICdSUzM4NCcsICdSUzUxMicsXHJcbiAgJ1BTMjU2JywgJ1BTMzg0JywgJ1BTNTEyJyxcclxuICAnRVMyNTYnLCAnRVMzODQnLCAnRVM1MTInXHJcbl07XHJcblxyXG5leHBvcnRzLkFMR09SSVRITVMgPSBBTEdPUklUSE1TO1xyXG5leHBvcnRzLnNpZ24gPSBTaWduU3RyZWFtLnNpZ247XHJcbmV4cG9ydHMudmVyaWZ5ID0gVmVyaWZ5U3RyZWFtLnZlcmlmeTtcclxuZXhwb3J0cy5kZWNvZGUgPSBWZXJpZnlTdHJlYW0uZGVjb2RlO1xyXG5leHBvcnRzLmlzVmFsaWQgPSBWZXJpZnlTdHJlYW0uaXNWYWxpZDtcclxuZXhwb3J0cy5jcmVhdGVTaWduID0gZnVuY3Rpb24gY3JlYXRlU2lnbihvcHRzKSB7XHJcbiAgcmV0dXJuIG5ldyBTaWduU3RyZWFtKG9wdHMpO1xyXG59O1xyXG5leHBvcnRzLmNyZWF0ZVZlcmlmeSA9IGZ1bmN0aW9uIGNyZWF0ZVZlcmlmeShvcHRzKSB7XHJcbiAgcmV0dXJuIG5ldyBWZXJpZnlTdHJlYW0ob3B0cyk7XHJcbn07XHJcbiIsIi8qZ2xvYmFsIG1vZHVsZSovXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlcjtcclxudmFyIERhdGFTdHJlYW0gPSByZXF1aXJlKCcuL2RhdGEtc3RyZWFtJyk7XHJcbnZhciBqd2EgPSByZXF1aXJlKCdqd2EnKTtcclxudmFyIFN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xyXG52YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3Rvc3RyaW5nJyk7XHJcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xyXG5cclxuZnVuY3Rpb24gYmFzZTY0dXJsKHN0cmluZywgZW5jb2RpbmcpIHtcclxuICByZXR1cm4gQnVmZmVyXHJcbiAgICAuZnJvbShzdHJpbmcsIGVuY29kaW5nKVxyXG4gICAgLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG4gICAgLnJlcGxhY2UoLz0vZywgJycpXHJcbiAgICAucmVwbGFjZSgvXFwrL2csICctJylcclxuICAgIC5yZXBsYWNlKC9cXC8vZywgJ18nKTtcclxufVxyXG5cclxuZnVuY3Rpb24gandzU2VjdXJlZElucHV0KGhlYWRlciwgcGF5bG9hZCwgZW5jb2RpbmcpIHtcclxuICBlbmNvZGluZyA9IGVuY29kaW5nIHx8ICd1dGY4JztcclxuICB2YXIgZW5jb2RlZEhlYWRlciA9IGJhc2U2NHVybCh0b1N0cmluZyhoZWFkZXIpLCAnYmluYXJ5Jyk7XHJcbiAgdmFyIGVuY29kZWRQYXlsb2FkID0gYmFzZTY0dXJsKHRvU3RyaW5nKHBheWxvYWQpLCBlbmNvZGluZyk7XHJcbiAgcmV0dXJuIHV0aWwuZm9ybWF0KCclcy4lcycsIGVuY29kZWRIZWFkZXIsIGVuY29kZWRQYXlsb2FkKTtcclxufVxyXG5cclxuZnVuY3Rpb24gandzU2lnbihvcHRzKSB7XHJcbiAgdmFyIGhlYWRlciA9IG9wdHMuaGVhZGVyO1xyXG4gIHZhciBwYXlsb2FkID0gb3B0cy5wYXlsb2FkO1xyXG4gIHZhciBzZWNyZXRPcktleSA9IG9wdHMuc2VjcmV0IHx8IG9wdHMucHJpdmF0ZUtleTtcclxuICB2YXIgZW5jb2RpbmcgPSBvcHRzLmVuY29kaW5nO1xyXG4gIHZhciBhbGdvID0gandhKGhlYWRlci5hbGcpO1xyXG4gIHZhciBzZWN1cmVkSW5wdXQgPSBqd3NTZWN1cmVkSW5wdXQoaGVhZGVyLCBwYXlsb2FkLCBlbmNvZGluZyk7XHJcbiAgdmFyIHNpZ25hdHVyZSA9IGFsZ28uc2lnbihzZWN1cmVkSW5wdXQsIHNlY3JldE9yS2V5KTtcclxuICByZXR1cm4gdXRpbC5mb3JtYXQoJyVzLiVzJywgc2VjdXJlZElucHV0LCBzaWduYXR1cmUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBTaWduU3RyZWFtKG9wdHMpIHtcclxuICB2YXIgc2VjcmV0ID0gb3B0cy5zZWNyZXR8fG9wdHMucHJpdmF0ZUtleXx8b3B0cy5rZXk7XHJcbiAgdmFyIHNlY3JldFN0cmVhbSA9IG5ldyBEYXRhU3RyZWFtKHNlY3JldCk7XHJcbiAgdGhpcy5yZWFkYWJsZSA9IHRydWU7XHJcbiAgdGhpcy5oZWFkZXIgPSBvcHRzLmhlYWRlcjtcclxuICB0aGlzLmVuY29kaW5nID0gb3B0cy5lbmNvZGluZztcclxuICB0aGlzLnNlY3JldCA9IHRoaXMucHJpdmF0ZUtleSA9IHRoaXMua2V5ID0gc2VjcmV0U3RyZWFtO1xyXG4gIHRoaXMucGF5bG9hZCA9IG5ldyBEYXRhU3RyZWFtKG9wdHMucGF5bG9hZCk7XHJcbiAgdGhpcy5zZWNyZXQub25jZSgnY2xvc2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoIXRoaXMucGF5bG9hZC53cml0YWJsZSAmJiB0aGlzLnJlYWRhYmxlKVxyXG4gICAgICB0aGlzLnNpZ24oKTtcclxuICB9LmJpbmQodGhpcykpO1xyXG5cclxuICB0aGlzLnBheWxvYWQub25jZSgnY2xvc2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoIXRoaXMuc2VjcmV0LndyaXRhYmxlICYmIHRoaXMucmVhZGFibGUpXHJcbiAgICAgIHRoaXMuc2lnbigpO1xyXG4gIH0uYmluZCh0aGlzKSk7XHJcbn1cclxudXRpbC5pbmhlcml0cyhTaWduU3RyZWFtLCBTdHJlYW0pO1xyXG5cclxuU2lnblN0cmVhbS5wcm90b3R5cGUuc2lnbiA9IGZ1bmN0aW9uIHNpZ24oKSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBzaWduYXR1cmUgPSBqd3NTaWduKHtcclxuICAgICAgaGVhZGVyOiB0aGlzLmhlYWRlcixcclxuICAgICAgcGF5bG9hZDogdGhpcy5wYXlsb2FkLmJ1ZmZlcixcclxuICAgICAgc2VjcmV0OiB0aGlzLnNlY3JldC5idWZmZXIsXHJcbiAgICAgIGVuY29kaW5nOiB0aGlzLmVuY29kaW5nXHJcbiAgICB9KTtcclxuICAgIHRoaXMuZW1pdCgnZG9uZScsIHNpZ25hdHVyZSk7XHJcbiAgICB0aGlzLmVtaXQoJ2RhdGEnLCBzaWduYXR1cmUpO1xyXG4gICAgdGhpcy5lbWl0KCdlbmQnKTtcclxuICAgIHRoaXMucmVhZGFibGUgPSBmYWxzZTtcclxuICAgIHJldHVybiBzaWduYXR1cmU7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgdGhpcy5yZWFkYWJsZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5lbWl0KCdlcnJvcicsIGUpO1xyXG4gICAgdGhpcy5lbWl0KCdjbG9zZScpO1xyXG4gIH1cclxufTtcclxuXHJcblNpZ25TdHJlYW0uc2lnbiA9IGp3c1NpZ247XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNpZ25TdHJlYW07XHJcbiIsIi8qZ2xvYmFsIG1vZHVsZSwgcHJvY2VzcyovXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlcjtcclxudmFyIFN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcclxuXHJcbmZ1bmN0aW9uIERhdGFTdHJlYW0oZGF0YSkge1xyXG4gIHRoaXMuYnVmZmVyID0gbnVsbDtcclxuICB0aGlzLndyaXRhYmxlID0gdHJ1ZTtcclxuICB0aGlzLnJlYWRhYmxlID0gdHJ1ZTtcclxuXHJcbiAgLy8gTm8gaW5wdXRcclxuICBpZiAoIWRhdGEpIHtcclxuICAgIHRoaXMuYnVmZmVyID0gQnVmZmVyLmFsbG9jKDApO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyBTdHJlYW1cclxuICBpZiAodHlwZW9mIGRhdGEucGlwZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgdGhpcy5idWZmZXIgPSBCdWZmZXIuYWxsb2MoMCk7XHJcbiAgICBkYXRhLnBpcGUodGhpcyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIEJ1ZmZlciBvciBTdHJpbmdcclxuICAvLyBvciBPYmplY3QgKGFzc3VtZWRseSBhIHBhc3N3b3JkZWQga2V5KVxyXG4gIGlmIChkYXRhLmxlbmd0aCB8fCB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHtcclxuICAgIHRoaXMuYnVmZmVyID0gZGF0YTtcclxuICAgIHRoaXMud3JpdGFibGUgPSBmYWxzZTtcclxuICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLmVtaXQoJ2VuZCcsIGRhdGEpO1xyXG4gICAgICB0aGlzLnJlYWRhYmxlID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuZW1pdCgnY2xvc2UnKTtcclxuICAgIH0uYmluZCh0aGlzKSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ1VuZXhwZWN0ZWQgZGF0YSB0eXBlICgnKyB0eXBlb2YgZGF0YSArICcpJyk7XHJcbn1cclxudXRpbC5pbmhlcml0cyhEYXRhU3RyZWFtLCBTdHJlYW0pO1xyXG5cclxuRGF0YVN0cmVhbS5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZShkYXRhKSB7XHJcbiAgdGhpcy5idWZmZXIgPSBCdWZmZXIuY29uY2F0KFt0aGlzLmJ1ZmZlciwgQnVmZmVyLmZyb20oZGF0YSldKTtcclxuICB0aGlzLmVtaXQoJ2RhdGEnLCBkYXRhKTtcclxufTtcclxuXHJcbkRhdGFTdHJlYW0ucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIGVuZChkYXRhKSB7XHJcbiAgaWYgKGRhdGEpXHJcbiAgICB0aGlzLndyaXRlKGRhdGEpO1xyXG4gIHRoaXMuZW1pdCgnZW5kJywgZGF0YSk7XHJcbiAgdGhpcy5lbWl0KCdjbG9zZScpO1xyXG4gIHRoaXMud3JpdGFibGUgPSBmYWxzZTtcclxuICB0aGlzLnJlYWRhYmxlID0gZmFsc2U7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFTdHJlYW07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=