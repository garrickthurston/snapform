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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvandzL2xpYi90b3N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvandzL2xpYi92ZXJpZnktc3RyZWFtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qd3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2p3cy9saWIvc2lnbi1zdHJlYW0uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2p3cy9saWIvZGF0YS1zdHJlYW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxhQUFhLG1CQUFPLENBQUMsb0JBQVE7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNUQTtBQUNBLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQyxpQkFBaUIsbUJBQU8sQ0FBQywyQkFBZTtBQUN4QyxVQUFVLG1CQUFPLENBQUMsaUJBQUs7QUFDdkIsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLGVBQWUsbUJBQU8sQ0FBQyx3QkFBWTtBQUNuQyxXQUFXLG1CQUFPLENBQUMsa0JBQU07QUFDekI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sMEJBQTBCO0FBQ2pDLGFBQWEsa0JBQWtCO0FBQy9COztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUN2SEE7QUFDQSxpQkFBaUIsbUJBQU8sQ0FBQywrQkFBbUI7QUFDNUMsbUJBQW1CLG1CQUFPLENBQUMsaUNBQXFCOztBQUVoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDckJBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLHlCQUFhO0FBQ2xDLGlCQUFpQixtQkFBTyxDQUFDLDJCQUFlO0FBQ3hDLFVBQVUsbUJBQU8sQ0FBQyxpQkFBSztBQUN2QixhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsZUFBZSxtQkFBTyxDQUFDLHdCQUFZO0FBQ25DLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7Ozs7Ozs7QUM3RUE7QUFDQSxhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoidmVuZG9yL3ZlbmRvci5qd3MuN2Q4ZDdjNjc5M2IwNTA0YmY0ZDUuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKmdsb2JhbCBtb2R1bGUqL1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b1N0cmluZyhvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKVxuICAgIHJldHVybiBvYmo7XG4gIGlmICh0eXBlb2Ygb2JqID09PSAnbnVtYmVyJyB8fCBCdWZmZXIuaXNCdWZmZXIob2JqKSlcbiAgICByZXR1cm4gb2JqLnRvU3RyaW5nKCk7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xufTtcbiIsIi8qZ2xvYmFsIG1vZHVsZSovXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXI7XG52YXIgRGF0YVN0cmVhbSA9IHJlcXVpcmUoJy4vZGF0YS1zdHJlYW0nKTtcbnZhciBqd2EgPSByZXF1aXJlKCdqd2EnKTtcbnZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcbnZhciB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9zdHJpbmcnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIEpXU19SRUdFWCA9IC9eW2EtekEtWjAtOVxcLV9dKz9cXC5bYS16QS1aMC05XFwtX10rP1xcLihbYS16QS1aMC05XFwtX10rKT8kLztcblxuZnVuY3Rpb24gaXNPYmplY3QodGhpbmcpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0aGluZykgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuXG5mdW5jdGlvbiBzYWZlSnNvblBhcnNlKHRoaW5nKSB7XG4gIGlmIChpc09iamVjdCh0aGluZykpXG4gICAgcmV0dXJuIHRoaW5nO1xuICB0cnkgeyByZXR1cm4gSlNPTi5wYXJzZSh0aGluZyk7IH1cbiAgY2F0Y2ggKGUpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxufVxuXG5mdW5jdGlvbiBoZWFkZXJGcm9tSldTKGp3c1NpZykge1xuICB2YXIgZW5jb2RlZEhlYWRlciA9IGp3c1NpZy5zcGxpdCgnLicsIDEpWzBdO1xuICByZXR1cm4gc2FmZUpzb25QYXJzZShCdWZmZXIuZnJvbShlbmNvZGVkSGVhZGVyLCAnYmFzZTY0JykudG9TdHJpbmcoJ2JpbmFyeScpKTtcbn1cblxuZnVuY3Rpb24gc2VjdXJlZElucHV0RnJvbUpXUyhqd3NTaWcpIHtcbiAgcmV0dXJuIGp3c1NpZy5zcGxpdCgnLicsIDIpLmpvaW4oJy4nKTtcbn1cblxuZnVuY3Rpb24gc2lnbmF0dXJlRnJvbUpXUyhqd3NTaWcpIHtcbiAgcmV0dXJuIGp3c1NpZy5zcGxpdCgnLicpWzJdO1xufVxuXG5mdW5jdGlvbiBwYXlsb2FkRnJvbUpXUyhqd3NTaWcsIGVuY29kaW5nKSB7XG4gIGVuY29kaW5nID0gZW5jb2RpbmcgfHwgJ3V0ZjgnO1xuICB2YXIgcGF5bG9hZCA9IGp3c1NpZy5zcGxpdCgnLicpWzFdO1xuICByZXR1cm4gQnVmZmVyLmZyb20ocGF5bG9hZCwgJ2Jhc2U2NCcpLnRvU3RyaW5nKGVuY29kaW5nKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZEp3cyhzdHJpbmcpIHtcbiAgcmV0dXJuIEpXU19SRUdFWC50ZXN0KHN0cmluZykgJiYgISFoZWFkZXJGcm9tSldTKHN0cmluZyk7XG59XG5cbmZ1bmN0aW9uIGp3c1ZlcmlmeShqd3NTaWcsIGFsZ29yaXRobSwgc2VjcmV0T3JLZXkpIHtcbiAgaWYgKCFhbGdvcml0aG0pIHtcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKFwiTWlzc2luZyBhbGdvcml0aG0gcGFyYW1ldGVyIGZvciBqd3MudmVyaWZ5XCIpO1xuICAgIGVyci5jb2RlID0gXCJNSVNTSU5HX0FMR09SSVRITVwiO1xuICAgIHRocm93IGVycjtcbiAgfVxuICBqd3NTaWcgPSB0b1N0cmluZyhqd3NTaWcpO1xuICB2YXIgc2lnbmF0dXJlID0gc2lnbmF0dXJlRnJvbUpXUyhqd3NTaWcpO1xuICB2YXIgc2VjdXJlZElucHV0ID0gc2VjdXJlZElucHV0RnJvbUpXUyhqd3NTaWcpO1xuICB2YXIgYWxnbyA9IGp3YShhbGdvcml0aG0pO1xuICByZXR1cm4gYWxnby52ZXJpZnkoc2VjdXJlZElucHV0LCBzaWduYXR1cmUsIHNlY3JldE9yS2V5KTtcbn1cblxuZnVuY3Rpb24gandzRGVjb2RlKGp3c1NpZywgb3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgandzU2lnID0gdG9TdHJpbmcoandzU2lnKTtcblxuICBpZiAoIWlzVmFsaWRKd3MoandzU2lnKSlcbiAgICByZXR1cm4gbnVsbDtcblxuICB2YXIgaGVhZGVyID0gaGVhZGVyRnJvbUpXUyhqd3NTaWcpO1xuXG4gIGlmICghaGVhZGVyKVxuICAgIHJldHVybiBudWxsO1xuXG4gIHZhciBwYXlsb2FkID0gcGF5bG9hZEZyb21KV1MoandzU2lnKTtcbiAgaWYgKGhlYWRlci50eXAgPT09ICdKV1QnIHx8IG9wdHMuanNvbilcbiAgICBwYXlsb2FkID0gSlNPTi5wYXJzZShwYXlsb2FkLCBvcHRzLmVuY29kaW5nKTtcblxuICByZXR1cm4ge1xuICAgIGhlYWRlcjogaGVhZGVyLFxuICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgc2lnbmF0dXJlOiBzaWduYXR1cmVGcm9tSldTKGp3c1NpZylcbiAgfTtcbn1cblxuZnVuY3Rpb24gVmVyaWZ5U3RyZWFtKG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge307XG4gIHZhciBzZWNyZXRPcktleSA9IG9wdHMuc2VjcmV0fHxvcHRzLnB1YmxpY0tleXx8b3B0cy5rZXk7XG4gIHZhciBzZWNyZXRTdHJlYW0gPSBuZXcgRGF0YVN0cmVhbShzZWNyZXRPcktleSk7XG4gIHRoaXMucmVhZGFibGUgPSB0cnVlO1xuICB0aGlzLmFsZ29yaXRobSA9IG9wdHMuYWxnb3JpdGhtO1xuICB0aGlzLmVuY29kaW5nID0gb3B0cy5lbmNvZGluZztcbiAgdGhpcy5zZWNyZXQgPSB0aGlzLnB1YmxpY0tleSA9IHRoaXMua2V5ID0gc2VjcmV0U3RyZWFtO1xuICB0aGlzLnNpZ25hdHVyZSA9IG5ldyBEYXRhU3RyZWFtKG9wdHMuc2lnbmF0dXJlKTtcbiAgdGhpcy5zZWNyZXQub25jZSgnY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnNpZ25hdHVyZS53cml0YWJsZSAmJiB0aGlzLnJlYWRhYmxlKVxuICAgICAgdGhpcy52ZXJpZnkoKTtcbiAgfS5iaW5kKHRoaXMpKTtcblxuICB0aGlzLnNpZ25hdHVyZS5vbmNlKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuc2VjcmV0LndyaXRhYmxlICYmIHRoaXMucmVhZGFibGUpXG4gICAgICB0aGlzLnZlcmlmeSgpO1xuICB9LmJpbmQodGhpcykpO1xufVxudXRpbC5pbmhlcml0cyhWZXJpZnlTdHJlYW0sIFN0cmVhbSk7XG5WZXJpZnlTdHJlYW0ucHJvdG90eXBlLnZlcmlmeSA9IGZ1bmN0aW9uIHZlcmlmeSgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdmFsaWQgPSBqd3NWZXJpZnkodGhpcy5zaWduYXR1cmUuYnVmZmVyLCB0aGlzLmFsZ29yaXRobSwgdGhpcy5rZXkuYnVmZmVyKTtcbiAgICB2YXIgb2JqID0gandzRGVjb2RlKHRoaXMuc2lnbmF0dXJlLmJ1ZmZlciwgdGhpcy5lbmNvZGluZyk7XG4gICAgdGhpcy5lbWl0KCdkb25lJywgdmFsaWQsIG9iaik7XG4gICAgdGhpcy5lbWl0KCdkYXRhJywgdmFsaWQpO1xuICAgIHRoaXMuZW1pdCgnZW5kJyk7XG4gICAgdGhpcy5yZWFkYWJsZSA9IGZhbHNlO1xuICAgIHJldHVybiB2YWxpZDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRoaXMucmVhZGFibGUgPSBmYWxzZTtcbiAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZSk7XG4gICAgdGhpcy5lbWl0KCdjbG9zZScpO1xuICB9XG59O1xuXG5WZXJpZnlTdHJlYW0uZGVjb2RlID0gandzRGVjb2RlO1xuVmVyaWZ5U3RyZWFtLmlzVmFsaWQgPSBpc1ZhbGlkSndzO1xuVmVyaWZ5U3RyZWFtLnZlcmlmeSA9IGp3c1ZlcmlmeTtcblxubW9kdWxlLmV4cG9ydHMgPSBWZXJpZnlTdHJlYW07XG4iLCIvKmdsb2JhbCBleHBvcnRzKi9cbnZhciBTaWduU3RyZWFtID0gcmVxdWlyZSgnLi9saWIvc2lnbi1zdHJlYW0nKTtcbnZhciBWZXJpZnlTdHJlYW0gPSByZXF1aXJlKCcuL2xpYi92ZXJpZnktc3RyZWFtJyk7XG5cbnZhciBBTEdPUklUSE1TID0gW1xuICAnSFMyNTYnLCAnSFMzODQnLCAnSFM1MTInLFxuICAnUlMyNTYnLCAnUlMzODQnLCAnUlM1MTInLFxuICAnUFMyNTYnLCAnUFMzODQnLCAnUFM1MTInLFxuICAnRVMyNTYnLCAnRVMzODQnLCAnRVM1MTInXG5dO1xuXG5leHBvcnRzLkFMR09SSVRITVMgPSBBTEdPUklUSE1TO1xuZXhwb3J0cy5zaWduID0gU2lnblN0cmVhbS5zaWduO1xuZXhwb3J0cy52ZXJpZnkgPSBWZXJpZnlTdHJlYW0udmVyaWZ5O1xuZXhwb3J0cy5kZWNvZGUgPSBWZXJpZnlTdHJlYW0uZGVjb2RlO1xuZXhwb3J0cy5pc1ZhbGlkID0gVmVyaWZ5U3RyZWFtLmlzVmFsaWQ7XG5leHBvcnRzLmNyZWF0ZVNpZ24gPSBmdW5jdGlvbiBjcmVhdGVTaWduKG9wdHMpIHtcbiAgcmV0dXJuIG5ldyBTaWduU3RyZWFtKG9wdHMpO1xufTtcbmV4cG9ydHMuY3JlYXRlVmVyaWZ5ID0gZnVuY3Rpb24gY3JlYXRlVmVyaWZ5KG9wdHMpIHtcbiAgcmV0dXJuIG5ldyBWZXJpZnlTdHJlYW0ob3B0cyk7XG59O1xuIiwiLypnbG9iYWwgbW9kdWxlKi9cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlcjtcbnZhciBEYXRhU3RyZWFtID0gcmVxdWlyZSgnLi9kYXRhLXN0cmVhbScpO1xudmFyIGp3YSA9IHJlcXVpcmUoJ2p3YScpO1xudmFyIFN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xudmFyIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b3N0cmluZycpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbmZ1bmN0aW9uIGJhc2U2NHVybChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIHJldHVybiBCdWZmZXJcbiAgICAuZnJvbShzdHJpbmcsIGVuY29kaW5nKVxuICAgIC50b1N0cmluZygnYmFzZTY0JylcbiAgICAucmVwbGFjZSgvPS9nLCAnJylcbiAgICAucmVwbGFjZSgvXFwrL2csICctJylcbiAgICAucmVwbGFjZSgvXFwvL2csICdfJyk7XG59XG5cbmZ1bmN0aW9uIGp3c1NlY3VyZWRJbnB1dChoZWFkZXIsIHBheWxvYWQsIGVuY29kaW5nKSB7XG4gIGVuY29kaW5nID0gZW5jb2RpbmcgfHwgJ3V0ZjgnO1xuICB2YXIgZW5jb2RlZEhlYWRlciA9IGJhc2U2NHVybCh0b1N0cmluZyhoZWFkZXIpLCAnYmluYXJ5Jyk7XG4gIHZhciBlbmNvZGVkUGF5bG9hZCA9IGJhc2U2NHVybCh0b1N0cmluZyhwYXlsb2FkKSwgZW5jb2RpbmcpO1xuICByZXR1cm4gdXRpbC5mb3JtYXQoJyVzLiVzJywgZW5jb2RlZEhlYWRlciwgZW5jb2RlZFBheWxvYWQpO1xufVxuXG5mdW5jdGlvbiBqd3NTaWduKG9wdHMpIHtcbiAgdmFyIGhlYWRlciA9IG9wdHMuaGVhZGVyO1xuICB2YXIgcGF5bG9hZCA9IG9wdHMucGF5bG9hZDtcbiAgdmFyIHNlY3JldE9yS2V5ID0gb3B0cy5zZWNyZXQgfHwgb3B0cy5wcml2YXRlS2V5O1xuICB2YXIgZW5jb2RpbmcgPSBvcHRzLmVuY29kaW5nO1xuICB2YXIgYWxnbyA9IGp3YShoZWFkZXIuYWxnKTtcbiAgdmFyIHNlY3VyZWRJbnB1dCA9IGp3c1NlY3VyZWRJbnB1dChoZWFkZXIsIHBheWxvYWQsIGVuY29kaW5nKTtcbiAgdmFyIHNpZ25hdHVyZSA9IGFsZ28uc2lnbihzZWN1cmVkSW5wdXQsIHNlY3JldE9yS2V5KTtcbiAgcmV0dXJuIHV0aWwuZm9ybWF0KCclcy4lcycsIHNlY3VyZWRJbnB1dCwgc2lnbmF0dXJlKTtcbn1cblxuZnVuY3Rpb24gU2lnblN0cmVhbShvcHRzKSB7XG4gIHZhciBzZWNyZXQgPSBvcHRzLnNlY3JldHx8b3B0cy5wcml2YXRlS2V5fHxvcHRzLmtleTtcbiAgdmFyIHNlY3JldFN0cmVhbSA9IG5ldyBEYXRhU3RyZWFtKHNlY3JldCk7XG4gIHRoaXMucmVhZGFibGUgPSB0cnVlO1xuICB0aGlzLmhlYWRlciA9IG9wdHMuaGVhZGVyO1xuICB0aGlzLmVuY29kaW5nID0gb3B0cy5lbmNvZGluZztcbiAgdGhpcy5zZWNyZXQgPSB0aGlzLnByaXZhdGVLZXkgPSB0aGlzLmtleSA9IHNlY3JldFN0cmVhbTtcbiAgdGhpcy5wYXlsb2FkID0gbmV3IERhdGFTdHJlYW0ob3B0cy5wYXlsb2FkKTtcbiAgdGhpcy5zZWNyZXQub25jZSgnY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnBheWxvYWQud3JpdGFibGUgJiYgdGhpcy5yZWFkYWJsZSlcbiAgICAgIHRoaXMuc2lnbigpO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIHRoaXMucGF5bG9hZC5vbmNlKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuc2VjcmV0LndyaXRhYmxlICYmIHRoaXMucmVhZGFibGUpXG4gICAgICB0aGlzLnNpZ24oKTtcbiAgfS5iaW5kKHRoaXMpKTtcbn1cbnV0aWwuaW5oZXJpdHMoU2lnblN0cmVhbSwgU3RyZWFtKTtcblxuU2lnblN0cmVhbS5wcm90b3R5cGUuc2lnbiA9IGZ1bmN0aW9uIHNpZ24oKSB7XG4gIHRyeSB7XG4gICAgdmFyIHNpZ25hdHVyZSA9IGp3c1NpZ24oe1xuICAgICAgaGVhZGVyOiB0aGlzLmhlYWRlcixcbiAgICAgIHBheWxvYWQ6IHRoaXMucGF5bG9hZC5idWZmZXIsXG4gICAgICBzZWNyZXQ6IHRoaXMuc2VjcmV0LmJ1ZmZlcixcbiAgICAgIGVuY29kaW5nOiB0aGlzLmVuY29kaW5nXG4gICAgfSk7XG4gICAgdGhpcy5lbWl0KCdkb25lJywgc2lnbmF0dXJlKTtcbiAgICB0aGlzLmVtaXQoJ2RhdGEnLCBzaWduYXR1cmUpO1xuICAgIHRoaXMuZW1pdCgnZW5kJyk7XG4gICAgdGhpcy5yZWFkYWJsZSA9IGZhbHNlO1xuICAgIHJldHVybiBzaWduYXR1cmU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aGlzLnJlYWRhYmxlID0gZmFsc2U7XG4gICAgdGhpcy5lbWl0KCdlcnJvcicsIGUpO1xuICAgIHRoaXMuZW1pdCgnY2xvc2UnKTtcbiAgfVxufTtcblxuU2lnblN0cmVhbS5zaWduID0gandzU2lnbjtcblxubW9kdWxlLmV4cG9ydHMgPSBTaWduU3RyZWFtO1xuIiwiLypnbG9iYWwgbW9kdWxlLCBwcm9jZXNzKi9cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlcjtcbnZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG5mdW5jdGlvbiBEYXRhU3RyZWFtKGRhdGEpIHtcbiAgdGhpcy5idWZmZXIgPSBudWxsO1xuICB0aGlzLndyaXRhYmxlID0gdHJ1ZTtcbiAgdGhpcy5yZWFkYWJsZSA9IHRydWU7XG5cbiAgLy8gTm8gaW5wdXRcbiAgaWYgKCFkYXRhKSB7XG4gICAgdGhpcy5idWZmZXIgPSBCdWZmZXIuYWxsb2MoMCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBTdHJlYW1cbiAgaWYgKHR5cGVvZiBkYXRhLnBpcGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygwKTtcbiAgICBkYXRhLnBpcGUodGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBCdWZmZXIgb3IgU3RyaW5nXG4gIC8vIG9yIE9iamVjdCAoYXNzdW1lZGx5IGEgcGFzc3dvcmRlZCBrZXkpXG4gIGlmIChkYXRhLmxlbmd0aCB8fCB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IGRhdGE7XG4gICAgdGhpcy53cml0YWJsZSA9IGZhbHNlO1xuICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5lbWl0KCdlbmQnLCBkYXRhKTtcbiAgICAgIHRoaXMucmVhZGFibGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZW1pdCgnY2xvc2UnKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5leHBlY3RlZCBkYXRhIHR5cGUgKCcrIHR5cGVvZiBkYXRhICsgJyknKTtcbn1cbnV0aWwuaW5oZXJpdHMoRGF0YVN0cmVhbSwgU3RyZWFtKTtcblxuRGF0YVN0cmVhbS5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZShkYXRhKSB7XG4gIHRoaXMuYnVmZmVyID0gQnVmZmVyLmNvbmNhdChbdGhpcy5idWZmZXIsIEJ1ZmZlci5mcm9tKGRhdGEpXSk7XG4gIHRoaXMuZW1pdCgnZGF0YScsIGRhdGEpO1xufTtcblxuRGF0YVN0cmVhbS5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24gZW5kKGRhdGEpIHtcbiAgaWYgKGRhdGEpXG4gICAgdGhpcy53cml0ZShkYXRhKTtcbiAgdGhpcy5lbWl0KCdlbmQnLCBkYXRhKTtcbiAgdGhpcy5lbWl0KCdjbG9zZScpO1xuICB0aGlzLndyaXRhYmxlID0gZmFsc2U7XG4gIHRoaXMucmVhZGFibGUgPSBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVN0cmVhbTtcbiJdLCJzb3VyY2VSb290IjoiIn0=