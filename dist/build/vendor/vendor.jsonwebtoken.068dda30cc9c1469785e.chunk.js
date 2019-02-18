(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.jsonwebtoken"],{

/***/ "8wnj":
/*!*********************************************************!*\
  !*** ./node_modules/jsonwebtoken/lib/NotBeforeError.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var JsonWebTokenError = __webpack_require__(/*! ./JsonWebTokenError */ "KRB3");

var NotBeforeError = function (message, date) {
  JsonWebTokenError.call(this, message);
  this.name = 'NotBeforeError';
  this.date = date;
};

NotBeforeError.prototype = Object.create(JsonWebTokenError.prototype);

NotBeforeError.prototype.constructor = NotBeforeError;

module.exports = NotBeforeError;

/***/ }),

/***/ "9Oa7":
/*!***************************************************!*\
  !*** ./node_modules/jsonwebtoken/lib/timespan.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ms = __webpack_require__(/*! ms */ "eCYC");

module.exports = function (time, iat) {
  var timestamp = iat || Math.floor(Date.now() / 1000);

  if (typeof time === 'string') {
    var milliseconds = ms(time);
    if (typeof milliseconds === 'undefined') {
      return;
    }
    return Math.floor(timestamp + milliseconds / 1000);
  } else if (typeof time === 'number') {
    return timestamp + time;
  } else {
    return;
  }

};

/***/ }),

/***/ "Duz0":
/*!*********************************************!*\
  !*** ./node_modules/jsonwebtoken/verify.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var JsonWebTokenError = __webpack_require__(/*! ./lib/JsonWebTokenError */ "KRB3");
var NotBeforeError    = __webpack_require__(/*! ./lib/NotBeforeError */ "8wnj");
var TokenExpiredError = __webpack_require__(/*! ./lib/TokenExpiredError */ "bmkK");
var decode            = __webpack_require__(/*! ./decode */ "OXVQ");
var timespan          = __webpack_require__(/*! ./lib/timespan */ "9Oa7");
var jws               = __webpack_require__(/*! jws */ "M+8A");

module.exports = function (jwtString, secretOrPublicKey, options, callback) {
  if ((typeof options === 'function') && !callback) {
    callback = options;
    options = {};
  }

  if (!options) {
    options = {};
  }

  //clone this object since we are going to mutate it.
  options = Object.assign({}, options);

  var done;

  if (callback) {
    done = callback;
  } else {
    done = function(err, data) {
      if (err) throw err;
      return data;
    };
  }

  if (options.clockTimestamp && typeof options.clockTimestamp !== 'number') {
    return done(new JsonWebTokenError('clockTimestamp must be a number'));
  }

  if (options.nonce !== undefined && (typeof options.nonce !== 'string' || options.nonce.trim() === '')) {
    return done(new JsonWebTokenError('nonce must be a non-empty string'));
  }

  var clockTimestamp = options.clockTimestamp || Math.floor(Date.now() / 1000);

  if (!jwtString){
    return done(new JsonWebTokenError('jwt must be provided'));
  }

  if (typeof jwtString !== 'string') {
    return done(new JsonWebTokenError('jwt must be a string'));
  }

  var parts = jwtString.split('.');

  if (parts.length !== 3){
    return done(new JsonWebTokenError('jwt malformed'));
  }

  var decodedToken;

  try {
    decodedToken = decode(jwtString, { complete: true });
  } catch(err) {
    return done(err);
  }

  if (!decodedToken) {
    return done(new JsonWebTokenError('invalid token'));
  }

  var header = decodedToken.header;
  var getSecret;

  if(typeof secretOrPublicKey === 'function') {
    if(!callback) {
      return done(new JsonWebTokenError('verify must be called asynchronous if secret or public key is provided as a callback'));
    }

    getSecret = secretOrPublicKey;
  }
  else {
    getSecret = function(header, secretCallback) {
      return secretCallback(null, secretOrPublicKey);
    };
  }

  return getSecret(header, function(err, secretOrPublicKey) {
    if(err) {
      return done(new JsonWebTokenError('error in secret or public key callback: ' + err.message));
    }

    var hasSignature = parts[2].trim() !== '';

    if (!hasSignature && secretOrPublicKey){
      return done(new JsonWebTokenError('jwt signature is required'));
    }

    if (hasSignature && !secretOrPublicKey) {
      return done(new JsonWebTokenError('secret or public key must be provided'));
    }

    if (!hasSignature && !options.algorithms) {
      options.algorithms = ['none'];
    }

    if (!options.algorithms) {
      options.algorithms = ~secretOrPublicKey.toString().indexOf('BEGIN CERTIFICATE') ||
          ~secretOrPublicKey.toString().indexOf('BEGIN PUBLIC KEY') ?
        ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512'] :
        ~secretOrPublicKey.toString().indexOf('BEGIN RSA PUBLIC KEY') ?
          ['RS256', 'RS384', 'RS512'] :
          ['HS256', 'HS384', 'HS512'];

    }

    if (!~options.algorithms.indexOf(decodedToken.header.alg)) {
      return done(new JsonWebTokenError('invalid algorithm'));
    }

    var valid;

    try {
      valid = jws.verify(jwtString, decodedToken.header.alg, secretOrPublicKey);
    } catch (e) {
      return done(e);
    }

    if (!valid) {
      return done(new JsonWebTokenError('invalid signature'));
    }

    var payload = decodedToken.payload;

    if (typeof payload.nbf !== 'undefined' && !options.ignoreNotBefore) {
      if (typeof payload.nbf !== 'number') {
        return done(new JsonWebTokenError('invalid nbf value'));
      }
      if (payload.nbf > clockTimestamp + (options.clockTolerance || 0)) {
        return done(new NotBeforeError('jwt not active', new Date(payload.nbf * 1000)));
      }
    }

    if (typeof payload.exp !== 'undefined' && !options.ignoreExpiration) {
      if (typeof payload.exp !== 'number') {
        return done(new JsonWebTokenError('invalid exp value'));
      }
      if (clockTimestamp >= payload.exp + (options.clockTolerance || 0)) {
        return done(new TokenExpiredError('jwt expired', new Date(payload.exp * 1000)));
      }
    }

    if (options.audience) {
      var audiences = Array.isArray(options.audience) ? options.audience : [options.audience];
      var target = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

      var match = target.some(function (targetAudience) {
        return audiences.some(function (audience) {
          return audience instanceof RegExp ? audience.test(targetAudience) : audience === targetAudience;
        });
      });

      if (!match) {
        return done(new JsonWebTokenError('jwt audience invalid. expected: ' + audiences.join(' or ')));
      }
    }

    if (options.issuer) {
      var invalid_issuer =
              (typeof options.issuer === 'string' && payload.iss !== options.issuer) ||
              (Array.isArray(options.issuer) && options.issuer.indexOf(payload.iss) === -1);

      if (invalid_issuer) {
        return done(new JsonWebTokenError('jwt issuer invalid. expected: ' + options.issuer));
      }
    }

    if (options.subject) {
      if (payload.sub !== options.subject) {
        return done(new JsonWebTokenError('jwt subject invalid. expected: ' + options.subject));
      }
    }

    if (options.jwtid) {
      if (payload.jti !== options.jwtid) {
        return done(new JsonWebTokenError('jwt jwtid invalid. expected: ' + options.jwtid));
      }
    }

    if (options.nonce) {
      if (payload.nonce !== options.nonce) {
        return done(new JsonWebTokenError('jwt nonce invalid. expected: ' + options.nonce));
      }
    }

    if (options.maxAge) {
      if (typeof payload.iat !== 'number') {
        return done(new JsonWebTokenError('iat required when maxAge is specified'));
      }

      var maxAgeTimestamp = timespan(options.maxAge, payload.iat);
      if (typeof maxAgeTimestamp === 'undefined') {
        return done(new JsonWebTokenError('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
      }
      if (clockTimestamp >= maxAgeTimestamp + (options.clockTolerance || 0)) {
        return done(new TokenExpiredError('maxAge exceeded', new Date(maxAgeTimestamp * 1000)));
      }
    }

    return done(null, payload);
  });
};


/***/ }),

/***/ "FLf1":
/*!********************************************!*\
  !*** ./node_modules/jsonwebtoken/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  decode: __webpack_require__(/*! ./decode */ "OXVQ"),
  verify: __webpack_require__(/*! ./verify */ "Duz0"),
  sign: __webpack_require__(/*! ./sign */ "JWdw"),
  JsonWebTokenError: __webpack_require__(/*! ./lib/JsonWebTokenError */ "KRB3"),
  NotBeforeError: __webpack_require__(/*! ./lib/NotBeforeError */ "8wnj"),
  TokenExpiredError: __webpack_require__(/*! ./lib/TokenExpiredError */ "bmkK"),
};


/***/ }),

/***/ "JWdw":
/*!*******************************************!*\
  !*** ./node_modules/jsonwebtoken/sign.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var timespan = __webpack_require__(/*! ./lib/timespan */ "9Oa7");
var jws = __webpack_require__(/*! jws */ "M+8A");
var includes = __webpack_require__(/*! lodash.includes */ "nPsm");
var isBoolean = __webpack_require__(/*! lodash.isboolean */ "A1SM");
var isInteger = __webpack_require__(/*! lodash.isinteger */ "TbSJ");
var isNumber = __webpack_require__(/*! lodash.isnumber */ "Z94/");
var isPlainObject = __webpack_require__(/*! lodash.isplainobject */ "zZPE");
var isString = __webpack_require__(/*! lodash.isstring */ "mfmY");
var once = __webpack_require__(/*! lodash.once */ "60yG");

var sign_options_schema = {
  expiresIn: { isValid: function(value) { return isInteger(value) || (isString(value) && value); }, message: '"expiresIn" should be a number of seconds or string representing a timespan' },
  notBefore: { isValid: function(value) { return isInteger(value) || (isString(value) && value); }, message: '"notBefore" should be a number of seconds or string representing a timespan' },
  audience: { isValid: function(value) { return isString(value) || Array.isArray(value); }, message: '"audience" must be a string or array' },
  algorithm: { isValid: includes.bind(null, ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'HS256', 'HS384', 'HS512', 'none']), message: '"algorithm" must be a valid string enum value' },
  header: { isValid: isPlainObject, message: '"header" must be an object' },
  encoding: { isValid: isString, message: '"encoding" must be a string' },
  issuer: { isValid: isString, message: '"issuer" must be a string' },
  subject: { isValid: isString, message: '"subject" must be a string' },
  jwtid: { isValid: isString, message: '"jwtid" must be a string' },
  noTimestamp: { isValid: isBoolean, message: '"noTimestamp" must be a boolean' },
  keyid: { isValid: isString, message: '"keyid" must be a string' },
  mutatePayload: { isValid: isBoolean, message: '"mutatePayload" must be a boolean' }
};

var registered_claims_schema = {
  iat: { isValid: isNumber, message: '"iat" should be a number of seconds' },
  exp: { isValid: isNumber, message: '"exp" should be a number of seconds' },
  nbf: { isValid: isNumber, message: '"nbf" should be a number of seconds' }
};

function validate(schema, allowUnknown, object, parameterName) {
  if (!isPlainObject(object)) {
    throw new Error('Expected "' + parameterName + '" to be a plain object.');
  }
  Object.keys(object)
    .forEach(function(key) {
      var validator = schema[key];
      if (!validator) {
        if (!allowUnknown) {
          throw new Error('"' + key + '" is not allowed in "' + parameterName + '"');
        }
        return;
      }
      if (!validator.isValid(object[key])) {
        throw new Error(validator.message);
      }
    });
}

function validateOptions(options) {
  return validate(sign_options_schema, false, options, 'options');
}

function validatePayload(payload) {
  return validate(registered_claims_schema, true, payload, 'payload');
}

var options_to_payload = {
  'audience': 'aud',
  'issuer': 'iss',
  'subject': 'sub',
  'jwtid': 'jti'
};

var options_for_objects = [
  'expiresIn',
  'notBefore',
  'noTimestamp',
  'audience',
  'issuer',
  'subject',
  'jwtid',
];

module.exports = function (payload, secretOrPrivateKey, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  } else {
    options = options || {};
  }

  var isObjectPayload = typeof payload === 'object' &&
                        !Buffer.isBuffer(payload);

  var header = Object.assign({
    alg: options.algorithm || 'HS256',
    typ: isObjectPayload ? 'JWT' : undefined,
    kid: options.keyid
  }, options.header);

  function failure(err) {
    if (callback) {
      return callback(err);
    }
    throw err;
  }

  if (!secretOrPrivateKey && options.algorithm !== 'none') {
    return failure(new Error('secretOrPrivateKey must have a value'));
  }

  if (typeof payload === 'undefined') {
    return failure(new Error('payload is required'));
  } else if (isObjectPayload) {
    try {
      validatePayload(payload);
    }
    catch (error) {
      return failure(error);
    }
    if (!options.mutatePayload) {
      payload = Object.assign({},payload);
    }
  } else {
    var invalid_options = options_for_objects.filter(function (opt) {
      return typeof options[opt] !== 'undefined';
    });

    if (invalid_options.length > 0) {
      return failure(new Error('invalid ' + invalid_options.join(',') + ' option for ' + (typeof payload ) + ' payload'));
    }
  }

  if (typeof payload.exp !== 'undefined' && typeof options.expiresIn !== 'undefined') {
    return failure(new Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
  }

  if (typeof payload.nbf !== 'undefined' && typeof options.notBefore !== 'undefined') {
    return failure(new Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
  }

  try {
    validateOptions(options);
  }
  catch (error) {
    return failure(error);
  }

  var timestamp = payload.iat || Math.floor(Date.now() / 1000);

  if (!options.noTimestamp) {
    payload.iat = timestamp;
  } else {
    delete payload.iat;
  }

  if (typeof options.notBefore !== 'undefined') {
    try {
      payload.nbf = timespan(options.notBefore, timestamp);
    }
    catch (err) {
      return failure(err);
    }
    if (typeof payload.nbf === 'undefined') {
      return failure(new Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
    }
  }

  if (typeof options.expiresIn !== 'undefined' && typeof payload === 'object') {
    try {
      payload.exp = timespan(options.expiresIn, timestamp);
    }
    catch (err) {
      return failure(err);
    }
    if (typeof payload.exp === 'undefined') {
      return failure(new Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
    }
  }

  Object.keys(options_to_payload).forEach(function (key) {
    var claim = options_to_payload[key];
    if (typeof options[key] !== 'undefined') {
      if (typeof payload[claim] !== 'undefined') {
        return failure(new Error('Bad "options.' + key + '" option. The payload already has an "' + claim + '" property.'));
      }
      payload[claim] = options[key];
    }
  });

  var encoding = options.encoding || 'utf8';

  if (typeof callback === 'function') {
    callback = callback && once(callback);

    jws.createSign({
      header: header,
      privateKey: secretOrPrivateKey,
      payload: payload,
      encoding: encoding
    }).once('error', callback)
      .once('done', function (signature) {
        callback(null, signature);
      });
  } else {
    return jws.sign({header: header, payload: payload, secret: secretOrPrivateKey, encoding: encoding});
  }
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../buffer/index.js */ "tjlA").Buffer))

/***/ }),

/***/ "KRB3":
/*!************************************************************!*\
  !*** ./node_modules/jsonwebtoken/lib/JsonWebTokenError.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var JsonWebTokenError = function (message, error) {
  Error.call(this, message);
  if(Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = 'JsonWebTokenError';
  this.message = message;
  if (error) this.inner = error;
};

JsonWebTokenError.prototype = Object.create(Error.prototype);
JsonWebTokenError.prototype.constructor = JsonWebTokenError;

module.exports = JsonWebTokenError;


/***/ }),

/***/ "OXVQ":
/*!*********************************************!*\
  !*** ./node_modules/jsonwebtoken/decode.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var jws = __webpack_require__(/*! jws */ "M+8A");

module.exports = function (jwt, options) {
  options = options || {};
  var decoded = jws.decode(jwt, options);
  if (!decoded) { return null; }
  var payload = decoded.payload;

  //try parse the payload
  if(typeof payload === 'string') {
    try {
      var obj = JSON.parse(payload);
      if(obj !== null && typeof obj === 'object') {
        payload = obj;
      }
    } catch (e) { }
  }

  //return header if `complete` option is enabled.  header includes claims
  //such as `kid` and `alg` used to select the key within a JWKS needed to
  //verify the signature
  if (options.complete === true) {
    return {
      header: decoded.header,
      payload: payload,
      signature: decoded.signature
    };
  }
  return payload;
};


/***/ }),

/***/ "bmkK":
/*!************************************************************!*\
  !*** ./node_modules/jsonwebtoken/lib/TokenExpiredError.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var JsonWebTokenError = __webpack_require__(/*! ./JsonWebTokenError */ "KRB3");

var TokenExpiredError = function (message, expiredAt) {
  JsonWebTokenError.call(this, message);
  this.name = 'TokenExpiredError';
  this.expiredAt = expiredAt;
};

TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype);

TokenExpiredError.prototype.constructor = TokenExpiredError;

module.exports = TokenExpiredError;

/***/ }),

/***/ "eCYC":
/*!************************************************************!*\
  !*** ./node_modules/jsonwebtoken/node_modules/ms/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL2xpYi9Ob3RCZWZvcmVFcnJvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL2xpYi90aW1lc3Bhbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL3ZlcmlmeS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qc29ud2VidG9rZW4vc2lnbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL2xpYi9Kc29uV2ViVG9rZW5FcnJvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL2RlY29kZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL2xpYi9Ub2tlbkV4cGlyZWRFcnJvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL25vZGVfbW9kdWxlcy9tcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSx3QkFBd0IsbUJBQU8sQ0FBQyxpQ0FBcUI7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsZ0M7Ozs7Ozs7Ozs7O0FDWkEsU0FBUyxtQkFBTyxDQUFDLGdCQUFJOztBQUVyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBLEU7Ozs7Ozs7Ozs7O0FDakJBLHdCQUF3QixtQkFBTyxDQUFDLHFDQUF5QjtBQUN6RCx3QkFBd0IsbUJBQU8sQ0FBQyxrQ0FBc0I7QUFDdEQsd0JBQXdCLG1CQUFPLENBQUMscUNBQXlCO0FBQ3pELHdCQUF3QixtQkFBTyxD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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsT0FBTztBQUNQLEdBQUc7QUFDSCxxQkFBcUIsaUZBQWlGO0FBQ3RHO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQ2JBLFVBQVUsbUJBQU8sQ0FBQyxpQkFBSzs7QUFFdkI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGFBQWE7QUFDOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLFlBQVk7QUFDakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM3QkEsd0JBQXdCLG1CQUFPLENBQUMsaUNBQXFCOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLG1DOzs7Ozs7Ozs7OztBQ1pBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGNBQWM7QUFDekIsV0FBVyxPQUFPO0FBQ2xCLFlBQVksTUFBTTtBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuanNvbndlYnRva2VuLjA2OGRkYTMwY2M5YzE0Njk3ODVlLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEpzb25XZWJUb2tlbkVycm9yID0gcmVxdWlyZSgnLi9Kc29uV2ViVG9rZW5FcnJvcicpO1xuXG52YXIgTm90QmVmb3JlRXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSwgZGF0ZSkge1xuICBKc29uV2ViVG9rZW5FcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuICB0aGlzLm5hbWUgPSAnTm90QmVmb3JlRXJyb3InO1xuICB0aGlzLmRhdGUgPSBkYXRlO1xufTtcblxuTm90QmVmb3JlRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShKc29uV2ViVG9rZW5FcnJvci5wcm90b3R5cGUpO1xuXG5Ob3RCZWZvcmVFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBOb3RCZWZvcmVFcnJvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBOb3RCZWZvcmVFcnJvcjsiLCJ2YXIgbXMgPSByZXF1aXJlKCdtcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0aW1lLCBpYXQpIHtcbiAgdmFyIHRpbWVzdGFtcCA9IGlhdCB8fCBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKTtcblxuICBpZiAodHlwZW9mIHRpbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIG1pbGxpc2Vjb25kcyA9IG1zKHRpbWUpO1xuICAgIGlmICh0eXBlb2YgbWlsbGlzZWNvbmRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcih0aW1lc3RhbXAgKyBtaWxsaXNlY29uZHMgLyAxMDAwKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdGltZSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdGltZXN0YW1wICsgdGltZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm47XG4gIH1cblxufTsiLCJ2YXIgSnNvbldlYlRva2VuRXJyb3IgPSByZXF1aXJlKCcuL2xpYi9Kc29uV2ViVG9rZW5FcnJvcicpO1xudmFyIE5vdEJlZm9yZUVycm9yICAgID0gcmVxdWlyZSgnLi9saWIvTm90QmVmb3JlRXJyb3InKTtcbnZhciBUb2tlbkV4cGlyZWRFcnJvciA9IHJlcXVpcmUoJy4vbGliL1Rva2VuRXhwaXJlZEVycm9yJyk7XG52YXIgZGVjb2RlICAgICAgICAgICAgPSByZXF1aXJlKCcuL2RlY29kZScpO1xudmFyIHRpbWVzcGFuICAgICAgICAgID0gcmVxdWlyZSgnLi9saWIvdGltZXNwYW4nKTtcbnZhciBqd3MgICAgICAgICAgICAgICA9IHJlcXVpcmUoJ2p3cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChqd3RTdHJpbmcsIHNlY3JldE9yUHVibGljS2V5LCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAoKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSAmJiAhY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgLy9jbG9uZSB0aGlzIG9iamVjdCBzaW5jZSB3ZSBhcmUgZ29pbmcgdG8gbXV0YXRlIGl0LlxuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyk7XG5cbiAgdmFyIGRvbmU7XG5cbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgZG9uZSA9IGNhbGxiYWNrO1xuICB9IGVsc2Uge1xuICAgIGRvbmUgPSBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH07XG4gIH1cblxuICBpZiAob3B0aW9ucy5jbG9ja1RpbWVzdGFtcCAmJiB0eXBlb2Ygb3B0aW9ucy5jbG9ja1RpbWVzdGFtcCAhPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gZG9uZShuZXcgSnNvbldlYlRva2VuRXJyb3IoJ2Nsb2NrVGltZXN0YW1wIG11c3QgYmUgYSBudW1iZXInKSk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5ub25jZSAhPT0gdW5kZWZpbmVkICYmICh0eXBlb2Ygb3B0aW9ucy5ub25jZSAhPT0gJ3N0cmluZycgfHwgb3B0aW9ucy5ub25jZS50cmltKCkgPT09ICcnKSkge1xuICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignbm9uY2UgbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnKSk7XG4gIH1cblxuICB2YXIgY2xvY2tUaW1lc3RhbXAgPSBvcHRpb25zLmNsb2NrVGltZXN0YW1wIHx8IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApO1xuXG4gIGlmICghand0U3RyaW5nKXtcbiAgICByZXR1cm4gZG9uZShuZXcgSnNvbldlYlRva2VuRXJyb3IoJ2p3dCBtdXN0IGJlIHByb3ZpZGVkJykpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBqd3RTdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGRvbmUobmV3IEpzb25XZWJUb2tlbkVycm9yKCdqd3QgbXVzdCBiZSBhIHN0cmluZycpKTtcbiAgfVxuXG4gIHZhciBwYXJ0cyA9IGp3dFN0cmluZy5zcGxpdCgnLicpO1xuXG4gIGlmIChwYXJ0cy5sZW5ndGggIT09IDMpe1xuICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignand0IG1hbGZvcm1lZCcpKTtcbiAgfVxuXG4gIHZhciBkZWNvZGVkVG9rZW47XG5cbiAgdHJ5IHtcbiAgICBkZWNvZGVkVG9rZW4gPSBkZWNvZGUoand0U3RyaW5nLCB7IGNvbXBsZXRlOiB0cnVlIH0pO1xuICB9IGNhdGNoKGVycikge1xuICAgIHJldHVybiBkb25lKGVycik7XG4gIH1cblxuICBpZiAoIWRlY29kZWRUb2tlbikge1xuICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignaW52YWxpZCB0b2tlbicpKTtcbiAgfVxuXG4gIHZhciBoZWFkZXIgPSBkZWNvZGVkVG9rZW4uaGVhZGVyO1xuICB2YXIgZ2V0U2VjcmV0O1xuXG4gIGlmKHR5cGVvZiBzZWNyZXRPclB1YmxpY0tleSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmKCFjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIGRvbmUobmV3IEpzb25XZWJUb2tlbkVycm9yKCd2ZXJpZnkgbXVzdCBiZSBjYWxsZWQgYXN5bmNocm9ub3VzIGlmIHNlY3JldCBvciBwdWJsaWMga2V5IGlzIHByb3ZpZGVkIGFzIGEgY2FsbGJhY2snKSk7XG4gICAgfVxuXG4gICAgZ2V0U2VjcmV0ID0gc2VjcmV0T3JQdWJsaWNLZXk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZ2V0U2VjcmV0ID0gZnVuY3Rpb24oaGVhZGVyLCBzZWNyZXRDYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHNlY3JldENhbGxiYWNrKG51bGwsIHNlY3JldE9yUHVibGljS2V5KTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGdldFNlY3JldChoZWFkZXIsIGZ1bmN0aW9uKGVyciwgc2VjcmV0T3JQdWJsaWNLZXkpIHtcbiAgICBpZihlcnIpIHtcbiAgICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignZXJyb3IgaW4gc2VjcmV0IG9yIHB1YmxpYyBrZXkgY2FsbGJhY2s6ICcgKyBlcnIubWVzc2FnZSkpO1xuICAgIH1cblxuICAgIHZhciBoYXNTaWduYXR1cmUgPSBwYXJ0c1syXS50cmltKCkgIT09ICcnO1xuXG4gICAgaWYgKCFoYXNTaWduYXR1cmUgJiYgc2VjcmV0T3JQdWJsaWNLZXkpe1xuICAgICAgcmV0dXJuIGRvbmUobmV3IEpzb25XZWJUb2tlbkVycm9yKCdqd3Qgc2lnbmF0dXJlIGlzIHJlcXVpcmVkJykpO1xuICAgIH1cblxuICAgIGlmIChoYXNTaWduYXR1cmUgJiYgIXNlY3JldE9yUHVibGljS2V5KSB7XG4gICAgICByZXR1cm4gZG9uZShuZXcgSnNvbldlYlRva2VuRXJyb3IoJ3NlY3JldCBvciBwdWJsaWMga2V5IG11c3QgYmUgcHJvdmlkZWQnKSk7XG4gICAgfVxuXG4gICAgaWYgKCFoYXNTaWduYXR1cmUgJiYgIW9wdGlvbnMuYWxnb3JpdGhtcykge1xuICAgICAgb3B0aW9ucy5hbGdvcml0aG1zID0gWydub25lJ107XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLmFsZ29yaXRobXMpIHtcbiAgICAgIG9wdGlvbnMuYWxnb3JpdGhtcyA9IH5zZWNyZXRPclB1YmxpY0tleS50b1N0cmluZygpLmluZGV4T2YoJ0JFR0lOIENFUlRJRklDQVRFJykgfHxcbiAgICAgICAgICB+c2VjcmV0T3JQdWJsaWNLZXkudG9TdHJpbmcoKS5pbmRleE9mKCdCRUdJTiBQVUJMSUMgS0VZJykgP1xuICAgICAgICBbJ1JTMjU2JywgJ1JTMzg0JywgJ1JTNTEyJywgJ0VTMjU2JywgJ0VTMzg0JywgJ0VTNTEyJ10gOlxuICAgICAgICB+c2VjcmV0T3JQdWJsaWNLZXkudG9TdHJpbmcoKS5pbmRleE9mKCdCRUdJTiBSU0EgUFVCTElDIEtFWScpID9cbiAgICAgICAgICBbJ1JTMjU2JywgJ1JTMzg0JywgJ1JTNTEyJ10gOlxuICAgICAgICAgIFsnSFMyNTYnLCAnSFMzODQnLCAnSFM1MTInXTtcblxuICAgIH1cblxuICAgIGlmICghfm9wdGlvbnMuYWxnb3JpdGhtcy5pbmRleE9mKGRlY29kZWRUb2tlbi5oZWFkZXIuYWxnKSkge1xuICAgICAgcmV0dXJuIGRvbmUobmV3IEpzb25XZWJUb2tlbkVycm9yKCdpbnZhbGlkIGFsZ29yaXRobScpKTtcbiAgICB9XG5cbiAgICB2YXIgdmFsaWQ7XG5cbiAgICB0cnkge1xuICAgICAgdmFsaWQgPSBqd3MudmVyaWZ5KGp3dFN0cmluZywgZGVjb2RlZFRva2VuLmhlYWRlci5hbGcsIHNlY3JldE9yUHVibGljS2V5KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZG9uZShlKTtcbiAgICB9XG5cbiAgICBpZiAoIXZhbGlkKSB7XG4gICAgICByZXR1cm4gZG9uZShuZXcgSnNvbldlYlRva2VuRXJyb3IoJ2ludmFsaWQgc2lnbmF0dXJlJykpO1xuICAgIH1cblxuICAgIHZhciBwYXlsb2FkID0gZGVjb2RlZFRva2VuLnBheWxvYWQ7XG5cbiAgICBpZiAodHlwZW9mIHBheWxvYWQubmJmICE9PSAndW5kZWZpbmVkJyAmJiAhb3B0aW9ucy5pZ25vcmVOb3RCZWZvcmUpIHtcbiAgICAgIGlmICh0eXBlb2YgcGF5bG9hZC5uYmYgIT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignaW52YWxpZCBuYmYgdmFsdWUnKSk7XG4gICAgICB9XG4gICAgICBpZiAocGF5bG9hZC5uYmYgPiBjbG9ja1RpbWVzdGFtcCArIChvcHRpb25zLmNsb2NrVG9sZXJhbmNlIHx8IDApKSB7XG4gICAgICAgIHJldHVybiBkb25lKG5ldyBOb3RCZWZvcmVFcnJvcignand0IG5vdCBhY3RpdmUnLCBuZXcgRGF0ZShwYXlsb2FkLm5iZiAqIDEwMDApKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwYXlsb2FkLmV4cCAhPT0gJ3VuZGVmaW5lZCcgJiYgIW9wdGlvbnMuaWdub3JlRXhwaXJhdGlvbikge1xuICAgICAgaWYgKHR5cGVvZiBwYXlsb2FkLmV4cCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIGRvbmUobmV3IEpzb25XZWJUb2tlbkVycm9yKCdpbnZhbGlkIGV4cCB2YWx1ZScpKTtcbiAgICAgIH1cbiAgICAgIGlmIChjbG9ja1RpbWVzdGFtcCA+PSBwYXlsb2FkLmV4cCArIChvcHRpb25zLmNsb2NrVG9sZXJhbmNlIHx8IDApKSB7XG4gICAgICAgIHJldHVybiBkb25lKG5ldyBUb2tlbkV4cGlyZWRFcnJvcignand0IGV4cGlyZWQnLCBuZXcgRGF0ZShwYXlsb2FkLmV4cCAqIDEwMDApKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuYXVkaWVuY2UpIHtcbiAgICAgIHZhciBhdWRpZW5jZXMgPSBBcnJheS5pc0FycmF5KG9wdGlvbnMuYXVkaWVuY2UpID8gb3B0aW9ucy5hdWRpZW5jZSA6IFtvcHRpb25zLmF1ZGllbmNlXTtcbiAgICAgIHZhciB0YXJnZXQgPSBBcnJheS5pc0FycmF5KHBheWxvYWQuYXVkKSA/IHBheWxvYWQuYXVkIDogW3BheWxvYWQuYXVkXTtcblxuICAgICAgdmFyIG1hdGNoID0gdGFyZ2V0LnNvbWUoZnVuY3Rpb24gKHRhcmdldEF1ZGllbmNlKSB7XG4gICAgICAgIHJldHVybiBhdWRpZW5jZXMuc29tZShmdW5jdGlvbiAoYXVkaWVuY2UpIHtcbiAgICAgICAgICByZXR1cm4gYXVkaWVuY2UgaW5zdGFuY2VvZiBSZWdFeHAgPyBhdWRpZW5jZS50ZXN0KHRhcmdldEF1ZGllbmNlKSA6IGF1ZGllbmNlID09PSB0YXJnZXRBdWRpZW5jZTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICByZXR1cm4gZG9uZShuZXcgSnNvbldlYlRva2VuRXJyb3IoJ2p3dCBhdWRpZW5jZSBpbnZhbGlkLiBleHBlY3RlZDogJyArIGF1ZGllbmNlcy5qb2luKCcgb3IgJykpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5pc3N1ZXIpIHtcbiAgICAgIHZhciBpbnZhbGlkX2lzc3VlciA9XG4gICAgICAgICAgICAgICh0eXBlb2Ygb3B0aW9ucy5pc3N1ZXIgPT09ICdzdHJpbmcnICYmIHBheWxvYWQuaXNzICE9PSBvcHRpb25zLmlzc3VlcikgfHxcbiAgICAgICAgICAgICAgKEFycmF5LmlzQXJyYXkob3B0aW9ucy5pc3N1ZXIpICYmIG9wdGlvbnMuaXNzdWVyLmluZGV4T2YocGF5bG9hZC5pc3MpID09PSAtMSk7XG5cbiAgICAgIGlmIChpbnZhbGlkX2lzc3Vlcikge1xuICAgICAgICByZXR1cm4gZG9uZShuZXcgSnNvbldlYlRva2VuRXJyb3IoJ2p3dCBpc3N1ZXIgaW52YWxpZC4gZXhwZWN0ZWQ6ICcgKyBvcHRpb25zLmlzc3VlcikpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnN1YmplY3QpIHtcbiAgICAgIGlmIChwYXlsb2FkLnN1YiAhPT0gb3B0aW9ucy5zdWJqZWN0KSB7XG4gICAgICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignand0IHN1YmplY3QgaW52YWxpZC4gZXhwZWN0ZWQ6ICcgKyBvcHRpb25zLnN1YmplY3QpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5qd3RpZCkge1xuICAgICAgaWYgKHBheWxvYWQuanRpICE9PSBvcHRpb25zLmp3dGlkKSB7XG4gICAgICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignand0IGp3dGlkIGludmFsaWQuIGV4cGVjdGVkOiAnICsgb3B0aW9ucy5qd3RpZCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLm5vbmNlKSB7XG4gICAgICBpZiAocGF5bG9hZC5ub25jZSAhPT0gb3B0aW9ucy5ub25jZSkge1xuICAgICAgICByZXR1cm4gZG9uZShuZXcgSnNvbldlYlRva2VuRXJyb3IoJ2p3dCBub25jZSBpbnZhbGlkLiBleHBlY3RlZDogJyArIG9wdGlvbnMubm9uY2UpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5tYXhBZ2UpIHtcbiAgICAgIGlmICh0eXBlb2YgcGF5bG9hZC5pYXQgIT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignaWF0IHJlcXVpcmVkIHdoZW4gbWF4QWdlIGlzIHNwZWNpZmllZCcpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG1heEFnZVRpbWVzdGFtcCA9IHRpbWVzcGFuKG9wdGlvbnMubWF4QWdlLCBwYXlsb2FkLmlhdCk7XG4gICAgICBpZiAodHlwZW9mIG1heEFnZVRpbWVzdGFtcCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIGRvbmUobmV3IEpzb25XZWJUb2tlbkVycm9yKCdcIm1heEFnZVwiIHNob3VsZCBiZSBhIG51bWJlciBvZiBzZWNvbmRzIG9yIHN0cmluZyByZXByZXNlbnRpbmcgYSB0aW1lc3BhbiBlZzogXCIxZFwiLCBcIjIwaFwiLCA2MCcpKTtcbiAgICAgIH1cbiAgICAgIGlmIChjbG9ja1RpbWVzdGFtcCA+PSBtYXhBZ2VUaW1lc3RhbXAgKyAob3B0aW9ucy5jbG9ja1RvbGVyYW5jZSB8fCAwKSkge1xuICAgICAgICByZXR1cm4gZG9uZShuZXcgVG9rZW5FeHBpcmVkRXJyb3IoJ21heEFnZSBleGNlZWRlZCcsIG5ldyBEYXRlKG1heEFnZVRpbWVzdGFtcCAqIDEwMDApKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRvbmUobnVsbCwgcGF5bG9hZCk7XG4gIH0pO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBkZWNvZGU6IHJlcXVpcmUoJy4vZGVjb2RlJyksXG4gIHZlcmlmeTogcmVxdWlyZSgnLi92ZXJpZnknKSxcbiAgc2lnbjogcmVxdWlyZSgnLi9zaWduJyksXG4gIEpzb25XZWJUb2tlbkVycm9yOiByZXF1aXJlKCcuL2xpYi9Kc29uV2ViVG9rZW5FcnJvcicpLFxuICBOb3RCZWZvcmVFcnJvcjogcmVxdWlyZSgnLi9saWIvTm90QmVmb3JlRXJyb3InKSxcbiAgVG9rZW5FeHBpcmVkRXJyb3I6IHJlcXVpcmUoJy4vbGliL1Rva2VuRXhwaXJlZEVycm9yJyksXG59O1xuIiwidmFyIHRpbWVzcGFuID0gcmVxdWlyZSgnLi9saWIvdGltZXNwYW4nKTtcbnZhciBqd3MgPSByZXF1aXJlKCdqd3MnKTtcbnZhciBpbmNsdWRlcyA9IHJlcXVpcmUoJ2xvZGFzaC5pbmNsdWRlcycpO1xudmFyIGlzQm9vbGVhbiA9IHJlcXVpcmUoJ2xvZGFzaC5pc2Jvb2xlYW4nKTtcbnZhciBpc0ludGVnZXIgPSByZXF1aXJlKCdsb2Rhc2guaXNpbnRlZ2VyJyk7XG52YXIgaXNOdW1iZXIgPSByZXF1aXJlKCdsb2Rhc2guaXNudW1iZXInKTtcbnZhciBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnbG9kYXNoLmlzcGxhaW5vYmplY3QnKTtcbnZhciBpc1N0cmluZyA9IHJlcXVpcmUoJ2xvZGFzaC5pc3N0cmluZycpO1xudmFyIG9uY2UgPSByZXF1aXJlKCdsb2Rhc2gub25jZScpO1xuXG52YXIgc2lnbl9vcHRpb25zX3NjaGVtYSA9IHtcbiAgZXhwaXJlc0luOiB7IGlzVmFsaWQ6IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiBpc0ludGVnZXIodmFsdWUpIHx8IChpc1N0cmluZyh2YWx1ZSkgJiYgdmFsdWUpOyB9LCBtZXNzYWdlOiAnXCJleHBpcmVzSW5cIiBzaG91bGQgYmUgYSBudW1iZXIgb2Ygc2Vjb25kcyBvciBzdHJpbmcgcmVwcmVzZW50aW5nIGEgdGltZXNwYW4nIH0sXG4gIG5vdEJlZm9yZTogeyBpc1ZhbGlkOiBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gaXNJbnRlZ2VyKHZhbHVlKSB8fCAoaXNTdHJpbmcodmFsdWUpICYmIHZhbHVlKTsgfSwgbWVzc2FnZTogJ1wibm90QmVmb3JlXCIgc2hvdWxkIGJlIGEgbnVtYmVyIG9mIHNlY29uZHMgb3Igc3RyaW5nIHJlcHJlc2VudGluZyBhIHRpbWVzcGFuJyB9LFxuICBhdWRpZW5jZTogeyBpc1ZhbGlkOiBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gaXNTdHJpbmcodmFsdWUpIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpOyB9LCBtZXNzYWdlOiAnXCJhdWRpZW5jZVwiIG11c3QgYmUgYSBzdHJpbmcgb3IgYXJyYXknIH0sXG4gIGFsZ29yaXRobTogeyBpc1ZhbGlkOiBpbmNsdWRlcy5iaW5kKG51bGwsIFsnUlMyNTYnLCAnUlMzODQnLCAnUlM1MTInLCAnRVMyNTYnLCAnRVMzODQnLCAnRVM1MTInLCAnSFMyNTYnLCAnSFMzODQnLCAnSFM1MTInLCAnbm9uZSddKSwgbWVzc2FnZTogJ1wiYWxnb3JpdGhtXCIgbXVzdCBiZSBhIHZhbGlkIHN0cmluZyBlbnVtIHZhbHVlJyB9LFxuICBoZWFkZXI6IHsgaXNWYWxpZDogaXNQbGFpbk9iamVjdCwgbWVzc2FnZTogJ1wiaGVhZGVyXCIgbXVzdCBiZSBhbiBvYmplY3QnIH0sXG4gIGVuY29kaW5nOiB7IGlzVmFsaWQ6IGlzU3RyaW5nLCBtZXNzYWdlOiAnXCJlbmNvZGluZ1wiIG11c3QgYmUgYSBzdHJpbmcnIH0sXG4gIGlzc3VlcjogeyBpc1ZhbGlkOiBpc1N0cmluZywgbWVzc2FnZTogJ1wiaXNzdWVyXCIgbXVzdCBiZSBhIHN0cmluZycgfSxcbiAgc3ViamVjdDogeyBpc1ZhbGlkOiBpc1N0cmluZywgbWVzc2FnZTogJ1wic3ViamVjdFwiIG11c3QgYmUgYSBzdHJpbmcnIH0sXG4gIGp3dGlkOiB7IGlzVmFsaWQ6IGlzU3RyaW5nLCBtZXNzYWdlOiAnXCJqd3RpZFwiIG11c3QgYmUgYSBzdHJpbmcnIH0sXG4gIG5vVGltZXN0YW1wOiB7IGlzVmFsaWQ6IGlzQm9vbGVhbiwgbWVzc2FnZTogJ1wibm9UaW1lc3RhbXBcIiBtdXN0IGJlIGEgYm9vbGVhbicgfSxcbiAga2V5aWQ6IHsgaXNWYWxpZDogaXNTdHJpbmcsIG1lc3NhZ2U6ICdcImtleWlkXCIgbXVzdCBiZSBhIHN0cmluZycgfSxcbiAgbXV0YXRlUGF5bG9hZDogeyBpc1ZhbGlkOiBpc0Jvb2xlYW4sIG1lc3NhZ2U6ICdcIm11dGF0ZVBheWxvYWRcIiBtdXN0IGJlIGEgYm9vbGVhbicgfVxufTtcblxudmFyIHJlZ2lzdGVyZWRfY2xhaW1zX3NjaGVtYSA9IHtcbiAgaWF0OiB7IGlzVmFsaWQ6IGlzTnVtYmVyLCBtZXNzYWdlOiAnXCJpYXRcIiBzaG91bGQgYmUgYSBudW1iZXIgb2Ygc2Vjb25kcycgfSxcbiAgZXhwOiB7IGlzVmFsaWQ6IGlzTnVtYmVyLCBtZXNzYWdlOiAnXCJleHBcIiBzaG91bGQgYmUgYSBudW1iZXIgb2Ygc2Vjb25kcycgfSxcbiAgbmJmOiB7IGlzVmFsaWQ6IGlzTnVtYmVyLCBtZXNzYWdlOiAnXCJuYmZcIiBzaG91bGQgYmUgYSBudW1iZXIgb2Ygc2Vjb25kcycgfVxufTtcblxuZnVuY3Rpb24gdmFsaWRhdGUoc2NoZW1hLCBhbGxvd1Vua25vd24sIG9iamVjdCwgcGFyYW1ldGVyTmFtZSkge1xuICBpZiAoIWlzUGxhaW5PYmplY3Qob2JqZWN0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgXCInICsgcGFyYW1ldGVyTmFtZSArICdcIiB0byBiZSBhIHBsYWluIG9iamVjdC4nKTtcbiAgfVxuICBPYmplY3Qua2V5cyhvYmplY3QpXG4gICAgLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgdmFsaWRhdG9yID0gc2NoZW1hW2tleV07XG4gICAgICBpZiAoIXZhbGlkYXRvcikge1xuICAgICAgICBpZiAoIWFsbG93VW5rbm93bikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignXCInICsga2V5ICsgJ1wiIGlzIG5vdCBhbGxvd2VkIGluIFwiJyArIHBhcmFtZXRlck5hbWUgKyAnXCInKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXZhbGlkYXRvci5pc1ZhbGlkKG9iamVjdFtrZXldKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IodmFsaWRhdG9yLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZU9wdGlvbnMob3B0aW9ucykge1xuICByZXR1cm4gdmFsaWRhdGUoc2lnbl9vcHRpb25zX3NjaGVtYSwgZmFsc2UsIG9wdGlvbnMsICdvcHRpb25zJyk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlUGF5bG9hZChwYXlsb2FkKSB7XG4gIHJldHVybiB2YWxpZGF0ZShyZWdpc3RlcmVkX2NsYWltc19zY2hlbWEsIHRydWUsIHBheWxvYWQsICdwYXlsb2FkJyk7XG59XG5cbnZhciBvcHRpb25zX3RvX3BheWxvYWQgPSB7XG4gICdhdWRpZW5jZSc6ICdhdWQnLFxuICAnaXNzdWVyJzogJ2lzcycsXG4gICdzdWJqZWN0JzogJ3N1YicsXG4gICdqd3RpZCc6ICdqdGknXG59O1xuXG52YXIgb3B0aW9uc19mb3Jfb2JqZWN0cyA9IFtcbiAgJ2V4cGlyZXNJbicsXG4gICdub3RCZWZvcmUnLFxuICAnbm9UaW1lc3RhbXAnLFxuICAnYXVkaWVuY2UnLFxuICAnaXNzdWVyJyxcbiAgJ3N1YmplY3QnLFxuICAnand0aWQnLFxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGF5bG9hZCwgc2VjcmV0T3JQcml2YXRlS2V5LCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9IGVsc2Uge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB9XG5cbiAgdmFyIGlzT2JqZWN0UGF5bG9hZCA9IHR5cGVvZiBwYXlsb2FkID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIUJ1ZmZlci5pc0J1ZmZlcihwYXlsb2FkKTtcblxuICB2YXIgaGVhZGVyID0gT2JqZWN0LmFzc2lnbih7XG4gICAgYWxnOiBvcHRpb25zLmFsZ29yaXRobSB8fCAnSFMyNTYnLFxuICAgIHR5cDogaXNPYmplY3RQYXlsb2FkID8gJ0pXVCcgOiB1bmRlZmluZWQsXG4gICAga2lkOiBvcHRpb25zLmtleWlkXG4gIH0sIG9wdGlvbnMuaGVhZGVyKTtcblxuICBmdW5jdGlvbiBmYWlsdXJlKGVycikge1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgfVxuICAgIHRocm93IGVycjtcbiAgfVxuXG4gIGlmICghc2VjcmV0T3JQcml2YXRlS2V5ICYmIG9wdGlvbnMuYWxnb3JpdGhtICE9PSAnbm9uZScpIHtcbiAgICByZXR1cm4gZmFpbHVyZShuZXcgRXJyb3IoJ3NlY3JldE9yUHJpdmF0ZUtleSBtdXN0IGhhdmUgYSB2YWx1ZScpKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgcGF5bG9hZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZmFpbHVyZShuZXcgRXJyb3IoJ3BheWxvYWQgaXMgcmVxdWlyZWQnKSk7XG4gIH0gZWxzZSBpZiAoaXNPYmplY3RQYXlsb2FkKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRlUGF5bG9hZChwYXlsb2FkKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZmFpbHVyZShlcnJvcik7XG4gICAgfVxuICAgIGlmICghb3B0aW9ucy5tdXRhdGVQYXlsb2FkKSB7XG4gICAgICBwYXlsb2FkID0gT2JqZWN0LmFzc2lnbih7fSxwYXlsb2FkKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGludmFsaWRfb3B0aW9ucyA9IG9wdGlvbnNfZm9yX29iamVjdHMuZmlsdGVyKGZ1bmN0aW9uIChvcHQpIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb3B0aW9uc1tvcHRdICE9PSAndW5kZWZpbmVkJztcbiAgICB9KTtcblxuICAgIGlmIChpbnZhbGlkX29wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGZhaWx1cmUobmV3IEVycm9yKCdpbnZhbGlkICcgKyBpbnZhbGlkX29wdGlvbnMuam9pbignLCcpICsgJyBvcHRpb24gZm9yICcgKyAodHlwZW9mIHBheWxvYWQgKSArICcgcGF5bG9hZCcpKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIHBheWxvYWQuZXhwICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygb3B0aW9ucy5leHBpcmVzSW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZhaWx1cmUobmV3IEVycm9yKCdCYWQgXCJvcHRpb25zLmV4cGlyZXNJblwiIG9wdGlvbiB0aGUgcGF5bG9hZCBhbHJlYWR5IGhhcyBhbiBcImV4cFwiIHByb3BlcnR5LicpKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgcGF5bG9hZC5uYmYgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBvcHRpb25zLm5vdEJlZm9yZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZmFpbHVyZShuZXcgRXJyb3IoJ0JhZCBcIm9wdGlvbnMubm90QmVmb3JlXCIgb3B0aW9uIHRoZSBwYXlsb2FkIGFscmVhZHkgaGFzIGFuIFwibmJmXCIgcHJvcGVydHkuJykpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICB2YWxpZGF0ZU9wdGlvbnMob3B0aW9ucyk7XG4gIH1cbiAgY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhaWx1cmUoZXJyb3IpO1xuICB9XG5cbiAgdmFyIHRpbWVzdGFtcCA9IHBheWxvYWQuaWF0IHx8IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApO1xuXG4gIGlmICghb3B0aW9ucy5ub1RpbWVzdGFtcCkge1xuICAgIHBheWxvYWQuaWF0ID0gdGltZXN0YW1wO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBwYXlsb2FkLmlhdDtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5ub3RCZWZvcmUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHBheWxvYWQubmJmID0gdGltZXNwYW4ob3B0aW9ucy5ub3RCZWZvcmUsIHRpbWVzdGFtcCk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBmYWlsdXJlKGVycik7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcGF5bG9hZC5uYmYgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gZmFpbHVyZShuZXcgRXJyb3IoJ1wibm90QmVmb3JlXCIgc2hvdWxkIGJlIGEgbnVtYmVyIG9mIHNlY29uZHMgb3Igc3RyaW5nIHJlcHJlc2VudGluZyBhIHRpbWVzcGFuIGVnOiBcIjFkXCIsIFwiMjBoXCIsIDYwJykpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5leHBpcmVzSW4gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwYXlsb2FkID09PSAnb2JqZWN0Jykge1xuICAgIHRyeSB7XG4gICAgICBwYXlsb2FkLmV4cCA9IHRpbWVzcGFuKG9wdGlvbnMuZXhwaXJlc0luLCB0aW1lc3RhbXApO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZmFpbHVyZShlcnIpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBheWxvYWQuZXhwID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIGZhaWx1cmUobmV3IEVycm9yKCdcImV4cGlyZXNJblwiIHNob3VsZCBiZSBhIG51bWJlciBvZiBzZWNvbmRzIG9yIHN0cmluZyByZXByZXNlbnRpbmcgYSB0aW1lc3BhbiBlZzogXCIxZFwiLCBcIjIwaFwiLCA2MCcpKTtcbiAgICB9XG4gIH1cblxuICBPYmplY3Qua2V5cyhvcHRpb25zX3RvX3BheWxvYWQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBjbGFpbSA9IG9wdGlvbnNfdG9fcGF5bG9hZFtrZXldO1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uc1trZXldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKHR5cGVvZiBwYXlsb2FkW2NsYWltXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIGZhaWx1cmUobmV3IEVycm9yKCdCYWQgXCJvcHRpb25zLicgKyBrZXkgKyAnXCIgb3B0aW9uLiBUaGUgcGF5bG9hZCBhbHJlYWR5IGhhcyBhbiBcIicgKyBjbGFpbSArICdcIiBwcm9wZXJ0eS4nKSk7XG4gICAgICB9XG4gICAgICBwYXlsb2FkW2NsYWltXSA9IG9wdGlvbnNba2V5XTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBlbmNvZGluZyA9IG9wdGlvbnMuZW5jb2RpbmcgfHwgJ3V0ZjgnO1xuXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IGNhbGxiYWNrICYmIG9uY2UoY2FsbGJhY2spO1xuXG4gICAgandzLmNyZWF0ZVNpZ24oe1xuICAgICAgaGVhZGVyOiBoZWFkZXIsXG4gICAgICBwcml2YXRlS2V5OiBzZWNyZXRPclByaXZhdGVLZXksXG4gICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgZW5jb2Rpbmc6IGVuY29kaW5nXG4gICAgfSkub25jZSgnZXJyb3InLCBjYWxsYmFjaylcbiAgICAgIC5vbmNlKCdkb25lJywgZnVuY3Rpb24gKHNpZ25hdHVyZSkge1xuICAgICAgICBjYWxsYmFjayhudWxsLCBzaWduYXR1cmUpO1xuICAgICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGp3cy5zaWduKHtoZWFkZXI6IGhlYWRlciwgcGF5bG9hZDogcGF5bG9hZCwgc2VjcmV0OiBzZWNyZXRPclByaXZhdGVLZXksIGVuY29kaW5nOiBlbmNvZGluZ30pO1xuICB9XG59O1xuIiwidmFyIEpzb25XZWJUb2tlbkVycm9yID0gZnVuY3Rpb24gKG1lc3NhZ2UsIGVycm9yKSB7XG4gIEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSk7XG4gIGlmKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gIH1cbiAgdGhpcy5uYW1lID0gJ0pzb25XZWJUb2tlbkVycm9yJztcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgaWYgKGVycm9yKSB0aGlzLmlubmVyID0gZXJyb3I7XG59O1xuXG5Kc29uV2ViVG9rZW5FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5Kc29uV2ViVG9rZW5FcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBKc29uV2ViVG9rZW5FcnJvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBKc29uV2ViVG9rZW5FcnJvcjtcbiIsInZhciBqd3MgPSByZXF1aXJlKCdqd3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoand0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgZGVjb2RlZCA9IGp3cy5kZWNvZGUoand0LCBvcHRpb25zKTtcbiAgaWYgKCFkZWNvZGVkKSB7IHJldHVybiBudWxsOyB9XG4gIHZhciBwYXlsb2FkID0gZGVjb2RlZC5wYXlsb2FkO1xuXG4gIC8vdHJ5IHBhcnNlIHRoZSBwYXlsb2FkXG4gIGlmKHR5cGVvZiBwYXlsb2FkID09PSAnc3RyaW5nJykge1xuICAgIHRyeSB7XG4gICAgICB2YXIgb2JqID0gSlNPTi5wYXJzZShwYXlsb2FkKTtcbiAgICAgIGlmKG9iaiAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgICAgICBwYXlsb2FkID0gb2JqO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHsgfVxuICB9XG5cbiAgLy9yZXR1cm4gaGVhZGVyIGlmIGBjb21wbGV0ZWAgb3B0aW9uIGlzIGVuYWJsZWQuICBoZWFkZXIgaW5jbHVkZXMgY2xhaW1zXG4gIC8vc3VjaCBhcyBga2lkYCBhbmQgYGFsZ2AgdXNlZCB0byBzZWxlY3QgdGhlIGtleSB3aXRoaW4gYSBKV0tTIG5lZWRlZCB0b1xuICAvL3ZlcmlmeSB0aGUgc2lnbmF0dXJlXG4gIGlmIChvcHRpb25zLmNvbXBsZXRlID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlYWRlcjogZGVjb2RlZC5oZWFkZXIsXG4gICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgc2lnbmF0dXJlOiBkZWNvZGVkLnNpZ25hdHVyZVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHBheWxvYWQ7XG59O1xuIiwidmFyIEpzb25XZWJUb2tlbkVycm9yID0gcmVxdWlyZSgnLi9Kc29uV2ViVG9rZW5FcnJvcicpO1xuXG52YXIgVG9rZW5FeHBpcmVkRXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSwgZXhwaXJlZEF0KSB7XG4gIEpzb25XZWJUb2tlbkVycm9yLmNhbGwodGhpcywgbWVzc2FnZSk7XG4gIHRoaXMubmFtZSA9ICdUb2tlbkV4cGlyZWRFcnJvcic7XG4gIHRoaXMuZXhwaXJlZEF0ID0gZXhwaXJlZEF0O1xufTtcblxuVG9rZW5FeHBpcmVkRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShKc29uV2ViVG9rZW5FcnJvci5wcm90b3R5cGUpO1xuXG5Ub2tlbkV4cGlyZWRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUb2tlbkV4cGlyZWRFcnJvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBUb2tlbkV4cGlyZWRFcnJvcjsiLCIvKipcbiAqIEhlbHBlcnMuXG4gKi9cblxudmFyIHMgPSAxMDAwO1xudmFyIG0gPSBzICogNjA7XG52YXIgaCA9IG0gKiA2MDtcbnZhciBkID0gaCAqIDI0O1xudmFyIHcgPSBkICogNztcbnZhciB5ID0gZCAqIDM2NS4yNTtcblxuLyoqXG4gKiBQYXJzZSBvciBmb3JtYXQgdGhlIGdpdmVuIGB2YWxgLlxuICpcbiAqIE9wdGlvbnM6XG4gKlxuICogIC0gYGxvbmdgIHZlcmJvc2UgZm9ybWF0dGluZyBbZmFsc2VdXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSB2YWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEB0aHJvd3Mge0Vycm9yfSB0aHJvdyBhbiBlcnJvciBpZiB2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIG51bWJlclxuICogQHJldHVybiB7U3RyaW5nfE51bWJlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbDtcbiAgaWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHZhbC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHBhcnNlKHZhbCk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgaXNOYU4odmFsKSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5sb25nID8gZm10TG9uZyh2YWwpIDogZm10U2hvcnQodmFsKTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgJ3ZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgdmFsaWQgbnVtYmVyLiB2YWw9JyArXG4gICAgICBKU09OLnN0cmluZ2lmeSh2YWwpXG4gICk7XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBgc3RyYCBhbmQgcmV0dXJuIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZShzdHIpIHtcbiAgc3RyID0gU3RyaW5nKHN0cik7XG4gIGlmIChzdHIubGVuZ3RoID4gMTAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBtYXRjaCA9IC9eKCg/OlxcZCspP1xcLT9cXGQ/XFwuP1xcZCspICoobWlsbGlzZWNvbmRzP3xtc2Vjcz98bXN8c2Vjb25kcz98c2Vjcz98c3xtaW51dGVzP3xtaW5zP3xtfGhvdXJzP3xocnM/fGh8ZGF5cz98ZHx3ZWVrcz98d3x5ZWFycz98eXJzP3x5KT8kL2kuZXhlYyhcbiAgICBzdHJcbiAgKTtcbiAgaWYgKCFtYXRjaCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICB2YXIgdHlwZSA9IChtYXRjaFsyXSB8fCAnbXMnKS50b0xvd2VyQ2FzZSgpO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICd5ZWFycyc6XG4gICAgY2FzZSAneWVhcic6XG4gICAgY2FzZSAneXJzJzpcbiAgICBjYXNlICd5cic6XG4gICAgY2FzZSAneSc6XG4gICAgICByZXR1cm4gbiAqIHk7XG4gICAgY2FzZSAnd2Vla3MnOlxuICAgIGNhc2UgJ3dlZWsnOlxuICAgIGNhc2UgJ3cnOlxuICAgICAgcmV0dXJuIG4gKiB3O1xuICAgIGNhc2UgJ2RheXMnOlxuICAgIGNhc2UgJ2RheSc6XG4gICAgY2FzZSAnZCc6XG4gICAgICByZXR1cm4gbiAqIGQ7XG4gICAgY2FzZSAnaG91cnMnOlxuICAgIGNhc2UgJ2hvdXInOlxuICAgIGNhc2UgJ2hycyc6XG4gICAgY2FzZSAnaHInOlxuICAgIGNhc2UgJ2gnOlxuICAgICAgcmV0dXJuIG4gKiBoO1xuICAgIGNhc2UgJ21pbnV0ZXMnOlxuICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgY2FzZSAnbWlucyc6XG4gICAgY2FzZSAnbWluJzpcbiAgICBjYXNlICdtJzpcbiAgICAgIHJldHVybiBuICogbTtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdzZWNvbmQnOlxuICAgIGNhc2UgJ3NlY3MnOlxuICAgIGNhc2UgJ3NlYyc6XG4gICAgY2FzZSAncyc6XG4gICAgICByZXR1cm4gbiAqIHM7XG4gICAgY2FzZSAnbWlsbGlzZWNvbmRzJzpcbiAgICBjYXNlICdtaWxsaXNlY29uZCc6XG4gICAgY2FzZSAnbXNlY3MnOlxuICAgIGNhc2UgJ21zZWMnOlxuICAgIGNhc2UgJ21zJzpcbiAgICAgIHJldHVybiBuO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogU2hvcnQgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZm10U2hvcnQobXMpIHtcbiAgdmFyIG1zQWJzID0gTWF0aC5hYnMobXMpO1xuICBpZiAobXNBYnMgPj0gZCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gZCkgKyAnZCc7XG4gIH1cbiAgaWYgKG1zQWJzID49IGgpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGgpICsgJ2gnO1xuICB9XG4gIGlmIChtc0FicyA+PSBtKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBtKSArICdtJztcbiAgfVxuICBpZiAobXNBYnMgPj0gcykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gcykgKyAncyc7XG4gIH1cbiAgcmV0dXJuIG1zICsgJ21zJztcbn1cblxuLyoqXG4gKiBMb25nIGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdExvbmcobXMpIHtcbiAgdmFyIG1zQWJzID0gTWF0aC5hYnMobXMpO1xuICBpZiAobXNBYnMgPj0gZCkge1xuICAgIHJldHVybiBwbHVyYWwobXMsIG1zQWJzLCBkLCAnZGF5Jyk7XG4gIH1cbiAgaWYgKG1zQWJzID49IGgpIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgaCwgJ2hvdXInKTtcbiAgfVxuICBpZiAobXNBYnMgPj0gbSkge1xuICAgIHJldHVybiBwbHVyYWwobXMsIG1zQWJzLCBtLCAnbWludXRlJyk7XG4gIH1cbiAgaWYgKG1zQWJzID49IHMpIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgcywgJ3NlY29uZCcpO1xuICB9XG4gIHJldHVybiBtcyArICcgbXMnO1xufVxuXG4vKipcbiAqIFBsdXJhbGl6YXRpb24gaGVscGVyLlxuICovXG5cbmZ1bmN0aW9uIHBsdXJhbChtcywgbXNBYnMsIG4sIG5hbWUpIHtcbiAgdmFyIGlzUGx1cmFsID0gbXNBYnMgPj0gbiAqIDEuNTtcbiAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBuKSArICcgJyArIG5hbWUgKyAoaXNQbHVyYWwgPyAncycgOiAnJyk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9