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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL2xpYi9Ob3RCZWZvcmVFcnJvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL2xpYi90aW1lc3Bhbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL3ZlcmlmeS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qc29ud2VidG9rZW4vc2lnbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL2xpYi9Kc29uV2ViVG9rZW5FcnJvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL2RlY29kZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL2xpYi9Ub2tlbkV4cGlyZWRFcnJvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbndlYnRva2VuL25vZGVfbW9kdWxlcy9tcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSx3QkFBd0IsbUJBQU8sQ0FBQyxpQ0FBcUI7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsZ0M7Ozs7Ozs7Ozs7O0FDWkEsU0FBUyxtQkFBTyxDQUFDLGdCQUFJOztBQUVyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBLEU7Ozs7Ozs7Ozs7O0FDakJBLHdCQUF3QixtQkFBTyxDQUFDLHFDQUF5QjtBQUN6RCx3QkFBd0IsbUJBQU8sQ0FBQyxrQ0FBc0I7QUFDdEQsd0JBQXdCLG1CQUFPLENBQUMscUNBQXlCO0FBQ3pELHdCQUF3QixtQkFBTyxD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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsT0FBTztBQUNQLEdBQUc7QUFDSCxxQkFBcUIsaUZBQWlGO0FBQ3RHO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQ2JBLFVBQVUsbUJBQU8sQ0FBQyxpQkFBSzs7QUFFdkI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGFBQWE7QUFDOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLFlBQVk7QUFDakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM3QkEsd0JBQXdCLG1CQUFPLENBQUMsaUNBQXFCOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLG1DOzs7Ozs7Ozs7OztBQ1pBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGNBQWM7QUFDekIsV0FBVyxPQUFPO0FBQ2xCLFlBQVksTUFBTTtBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuanNvbndlYnRva2VuLmM2NzFmNjgzM2M1MzNiYTJjOWYyLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEpzb25XZWJUb2tlbkVycm9yID0gcmVxdWlyZSgnLi9Kc29uV2ViVG9rZW5FcnJvcicpO1xyXG5cclxudmFyIE5vdEJlZm9yZUVycm9yID0gZnVuY3Rpb24gKG1lc3NhZ2UsIGRhdGUpIHtcclxuICBKc29uV2ViVG9rZW5FcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xyXG4gIHRoaXMubmFtZSA9ICdOb3RCZWZvcmVFcnJvcic7XHJcbiAgdGhpcy5kYXRlID0gZGF0ZTtcclxufTtcclxuXHJcbk5vdEJlZm9yZUVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSnNvbldlYlRva2VuRXJyb3IucHJvdG90eXBlKTtcclxuXHJcbk5vdEJlZm9yZUVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE5vdEJlZm9yZUVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOb3RCZWZvcmVFcnJvcjsiLCJ2YXIgbXMgPSByZXF1aXJlKCdtcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGltZSwgaWF0KSB7XHJcbiAgdmFyIHRpbWVzdGFtcCA9IGlhdCB8fCBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKTtcclxuXHJcbiAgaWYgKHR5cGVvZiB0aW1lID09PSAnc3RyaW5nJykge1xyXG4gICAgdmFyIG1pbGxpc2Vjb25kcyA9IG1zKHRpbWUpO1xyXG4gICAgaWYgKHR5cGVvZiBtaWxsaXNlY29uZHMgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHJldHVybiBNYXRoLmZsb29yKHRpbWVzdGFtcCArIG1pbGxpc2Vjb25kcyAvIDEwMDApO1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIHRpbWUgPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gdGltZXN0YW1wICsgdGltZTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbn07IiwidmFyIEpzb25XZWJUb2tlbkVycm9yID0gcmVxdWlyZSgnLi9saWIvSnNvbldlYlRva2VuRXJyb3InKTtcclxudmFyIE5vdEJlZm9yZUVycm9yICAgID0gcmVxdWlyZSgnLi9saWIvTm90QmVmb3JlRXJyb3InKTtcclxudmFyIFRva2VuRXhwaXJlZEVycm9yID0gcmVxdWlyZSgnLi9saWIvVG9rZW5FeHBpcmVkRXJyb3InKTtcclxudmFyIGRlY29kZSAgICAgICAgICAgID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcclxudmFyIHRpbWVzcGFuICAgICAgICAgID0gcmVxdWlyZSgnLi9saWIvdGltZXNwYW4nKTtcclxudmFyIGp3cyAgICAgICAgICAgICAgID0gcmVxdWlyZSgnandzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChqd3RTdHJpbmcsIHNlY3JldE9yUHVibGljS2V5LCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gIGlmICgodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpICYmICFjYWxsYmFjaykge1xyXG4gICAgY2FsbGJhY2sgPSBvcHRpb25zO1xyXG4gICAgb3B0aW9ucyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0ge307XHJcbiAgfVxyXG5cclxuICAvL2Nsb25lIHRoaXMgb2JqZWN0IHNpbmNlIHdlIGFyZSBnb2luZyB0byBtdXRhdGUgaXQuXHJcbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpO1xyXG5cclxuICB2YXIgZG9uZTtcclxuXHJcbiAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICBkb25lID0gY2FsbGJhY2s7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRvbmUgPSBmdW5jdGlvbihlcnIsIGRhdGEpIHtcclxuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBpZiAob3B0aW9ucy5jbG9ja1RpbWVzdGFtcCAmJiB0eXBlb2Ygb3B0aW9ucy5jbG9ja1RpbWVzdGFtcCAhPT0gJ251bWJlcicpIHtcclxuICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignY2xvY2tUaW1lc3RhbXAgbXVzdCBiZSBhIG51bWJlcicpKTtcclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLm5vbmNlICE9PSB1bmRlZmluZWQgJiYgKHR5cGVvZiBvcHRpb25zLm5vbmNlICE9PSAnc3RyaW5nJyB8fCBvcHRpb25zLm5vbmNlLnRyaW0oKSA9PT0gJycpKSB7XHJcbiAgICByZXR1cm4gZG9uZShuZXcgSnNvbldlYlRva2VuRXJyb3IoJ25vbmNlIG11c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nJykpO1xyXG4gIH1cclxuXHJcbiAgdmFyIGNsb2NrVGltZXN0YW1wID0gb3B0aW9ucy5jbG9ja1RpbWVzdGFtcCB8fCBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKTtcclxuXHJcbiAgaWYgKCFqd3RTdHJpbmcpe1xyXG4gICAgcmV0dXJuIGRvbmUobmV3IEpzb25XZWJUb2tlbkVycm9yKCdqd3QgbXVzdCBiZSBwcm92aWRlZCcpKTtcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2Ygand0U3RyaW5nICE9PSAnc3RyaW5nJykge1xyXG4gICAgcmV0dXJuIGRvbmUobmV3IEpzb25XZWJUb2tlbkVycm9yKCdqd3QgbXVzdCBiZSBhIHN0cmluZycpKTtcclxuICB9XHJcblxyXG4gIHZhciBwYXJ0cyA9IGp3dFN0cmluZy5zcGxpdCgnLicpO1xyXG5cclxuICBpZiAocGFydHMubGVuZ3RoICE9PSAzKXtcclxuICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignand0IG1hbGZvcm1lZCcpKTtcclxuICB9XHJcblxyXG4gIHZhciBkZWNvZGVkVG9rZW47XHJcblxyXG4gIHRyeSB7XHJcbiAgICBkZWNvZGVkVG9rZW4gPSBkZWNvZGUoand0U3RyaW5nLCB7IGNvbXBsZXRlOiB0cnVlIH0pO1xyXG4gIH0gY2F0Y2goZXJyKSB7XHJcbiAgICByZXR1cm4gZG9uZShlcnIpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFkZWNvZGVkVG9rZW4pIHtcclxuICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignaW52YWxpZCB0b2tlbicpKTtcclxuICB9XHJcblxyXG4gIHZhciBoZWFkZXIgPSBkZWNvZGVkVG9rZW4uaGVhZGVyO1xyXG4gIHZhciBnZXRTZWNyZXQ7XHJcblxyXG4gIGlmKHR5cGVvZiBzZWNyZXRPclB1YmxpY0tleSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgaWYoIWNhbGxiYWNrKSB7XHJcbiAgICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcigndmVyaWZ5IG11c3QgYmUgY2FsbGVkIGFzeW5jaHJvbm91cyBpZiBzZWNyZXQgb3IgcHVibGljIGtleSBpcyBwcm92aWRlZCBhcyBhIGNhbGxiYWNrJykpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNlY3JldCA9IHNlY3JldE9yUHVibGljS2V5O1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGdldFNlY3JldCA9IGZ1bmN0aW9uKGhlYWRlciwgc2VjcmV0Q2FsbGJhY2spIHtcclxuICAgICAgcmV0dXJuIHNlY3JldENhbGxiYWNrKG51bGwsIHNlY3JldE9yUHVibGljS2V5KTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZ2V0U2VjcmV0KGhlYWRlciwgZnVuY3Rpb24oZXJyLCBzZWNyZXRPclB1YmxpY0tleSkge1xyXG4gICAgaWYoZXJyKSB7XHJcbiAgICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignZXJyb3IgaW4gc2VjcmV0IG9yIHB1YmxpYyBrZXkgY2FsbGJhY2s6ICcgKyBlcnIubWVzc2FnZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBoYXNTaWduYXR1cmUgPSBwYXJ0c1syXS50cmltKCkgIT09ICcnO1xyXG5cclxuICAgIGlmICghaGFzU2lnbmF0dXJlICYmIHNlY3JldE9yUHVibGljS2V5KXtcclxuICAgICAgcmV0dXJuIGRvbmUobmV3IEpzb25XZWJUb2tlbkVycm9yKCdqd3Qgc2lnbmF0dXJlIGlzIHJlcXVpcmVkJykpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChoYXNTaWduYXR1cmUgJiYgIXNlY3JldE9yUHVibGljS2V5KSB7XHJcbiAgICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignc2VjcmV0IG9yIHB1YmxpYyBrZXkgbXVzdCBiZSBwcm92aWRlZCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWhhc1NpZ25hdHVyZSAmJiAhb3B0aW9ucy5hbGdvcml0aG1zKSB7XHJcbiAgICAgIG9wdGlvbnMuYWxnb3JpdGhtcyA9IFsnbm9uZSddO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghb3B0aW9ucy5hbGdvcml0aG1zKSB7XHJcbiAgICAgIG9wdGlvbnMuYWxnb3JpdGhtcyA9IH5zZWNyZXRPclB1YmxpY0tleS50b1N0cmluZygpLmluZGV4T2YoJ0JFR0lOIENFUlRJRklDQVRFJykgfHxcclxuICAgICAgICAgIH5zZWNyZXRPclB1YmxpY0tleS50b1N0cmluZygpLmluZGV4T2YoJ0JFR0lOIFBVQkxJQyBLRVknKSA/XHJcbiAgICAgICAgWydSUzI1NicsICdSUzM4NCcsICdSUzUxMicsICdFUzI1NicsICdFUzM4NCcsICdFUzUxMiddIDpcclxuICAgICAgICB+c2VjcmV0T3JQdWJsaWNLZXkudG9TdHJpbmcoKS5pbmRleE9mKCdCRUdJTiBSU0EgUFVCTElDIEtFWScpID9cclxuICAgICAgICAgIFsnUlMyNTYnLCAnUlMzODQnLCAnUlM1MTInXSA6XHJcbiAgICAgICAgICBbJ0hTMjU2JywgJ0hTMzg0JywgJ0hTNTEyJ107XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGlmICghfm9wdGlvbnMuYWxnb3JpdGhtcy5pbmRleE9mKGRlY29kZWRUb2tlbi5oZWFkZXIuYWxnKSkge1xyXG4gICAgICByZXR1cm4gZG9uZShuZXcgSnNvbldlYlRva2VuRXJyb3IoJ2ludmFsaWQgYWxnb3JpdGhtJykpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB2YWxpZDtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB2YWxpZCA9IGp3cy52ZXJpZnkoand0U3RyaW5nLCBkZWNvZGVkVG9rZW4uaGVhZGVyLmFsZywgc2VjcmV0T3JQdWJsaWNLZXkpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICByZXR1cm4gZG9uZShlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXZhbGlkKSB7XHJcbiAgICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignaW52YWxpZCBzaWduYXR1cmUnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHBheWxvYWQgPSBkZWNvZGVkVG9rZW4ucGF5bG9hZDtcclxuXHJcbiAgICBpZiAodHlwZW9mIHBheWxvYWQubmJmICE9PSAndW5kZWZpbmVkJyAmJiAhb3B0aW9ucy5pZ25vcmVOb3RCZWZvcmUpIHtcclxuICAgICAgaWYgKHR5cGVvZiBwYXlsb2FkLm5iZiAhPT0gJ251bWJlcicpIHtcclxuICAgICAgICByZXR1cm4gZG9uZShuZXcgSnNvbldlYlRva2VuRXJyb3IoJ2ludmFsaWQgbmJmIHZhbHVlJykpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwYXlsb2FkLm5iZiA+IGNsb2NrVGltZXN0YW1wICsgKG9wdGlvbnMuY2xvY2tUb2xlcmFuY2UgfHwgMCkpIHtcclxuICAgICAgICByZXR1cm4gZG9uZShuZXcgTm90QmVmb3JlRXJyb3IoJ2p3dCBub3QgYWN0aXZlJywgbmV3IERhdGUocGF5bG9hZC5uYmYgKiAxMDAwKSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBwYXlsb2FkLmV4cCAhPT0gJ3VuZGVmaW5lZCcgJiYgIW9wdGlvbnMuaWdub3JlRXhwaXJhdGlvbikge1xyXG4gICAgICBpZiAodHlwZW9mIHBheWxvYWQuZXhwICE9PSAnbnVtYmVyJykge1xyXG4gICAgICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignaW52YWxpZCBleHAgdmFsdWUnKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNsb2NrVGltZXN0YW1wID49IHBheWxvYWQuZXhwICsgKG9wdGlvbnMuY2xvY2tUb2xlcmFuY2UgfHwgMCkpIHtcclxuICAgICAgICByZXR1cm4gZG9uZShuZXcgVG9rZW5FeHBpcmVkRXJyb3IoJ2p3dCBleHBpcmVkJywgbmV3IERhdGUocGF5bG9hZC5leHAgKiAxMDAwKSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuYXVkaWVuY2UpIHtcclxuICAgICAgdmFyIGF1ZGllbmNlcyA9IEFycmF5LmlzQXJyYXkob3B0aW9ucy5hdWRpZW5jZSkgPyBvcHRpb25zLmF1ZGllbmNlIDogW29wdGlvbnMuYXVkaWVuY2VdO1xyXG4gICAgICB2YXIgdGFyZ2V0ID0gQXJyYXkuaXNBcnJheShwYXlsb2FkLmF1ZCkgPyBwYXlsb2FkLmF1ZCA6IFtwYXlsb2FkLmF1ZF07XHJcblxyXG4gICAgICB2YXIgbWF0Y2ggPSB0YXJnZXQuc29tZShmdW5jdGlvbiAodGFyZ2V0QXVkaWVuY2UpIHtcclxuICAgICAgICByZXR1cm4gYXVkaWVuY2VzLnNvbWUoZnVuY3Rpb24gKGF1ZGllbmNlKSB7XHJcbiAgICAgICAgICByZXR1cm4gYXVkaWVuY2UgaW5zdGFuY2VvZiBSZWdFeHAgPyBhdWRpZW5jZS50ZXN0KHRhcmdldEF1ZGllbmNlKSA6IGF1ZGllbmNlID09PSB0YXJnZXRBdWRpZW5jZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoIW1hdGNoKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvbmUobmV3IEpzb25XZWJUb2tlbkVycm9yKCdqd3QgYXVkaWVuY2UgaW52YWxpZC4gZXhwZWN0ZWQ6ICcgKyBhdWRpZW5jZXMuam9pbignIG9yICcpKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucy5pc3N1ZXIpIHtcclxuICAgICAgdmFyIGludmFsaWRfaXNzdWVyID1cclxuICAgICAgICAgICAgICAodHlwZW9mIG9wdGlvbnMuaXNzdWVyID09PSAnc3RyaW5nJyAmJiBwYXlsb2FkLmlzcyAhPT0gb3B0aW9ucy5pc3N1ZXIpIHx8XHJcbiAgICAgICAgICAgICAgKEFycmF5LmlzQXJyYXkob3B0aW9ucy5pc3N1ZXIpICYmIG9wdGlvbnMuaXNzdWVyLmluZGV4T2YocGF5bG9hZC5pc3MpID09PSAtMSk7XHJcblxyXG4gICAgICBpZiAoaW52YWxpZF9pc3N1ZXIpIHtcclxuICAgICAgICByZXR1cm4gZG9uZShuZXcgSnNvbldlYlRva2VuRXJyb3IoJ2p3dCBpc3N1ZXIgaW52YWxpZC4gZXhwZWN0ZWQ6ICcgKyBvcHRpb25zLmlzc3VlcikpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuc3ViamVjdCkge1xyXG4gICAgICBpZiAocGF5bG9hZC5zdWIgIT09IG9wdGlvbnMuc3ViamVjdCkge1xyXG4gICAgICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignand0IHN1YmplY3QgaW52YWxpZC4gZXhwZWN0ZWQ6ICcgKyBvcHRpb25zLnN1YmplY3QpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLmp3dGlkKSB7XHJcbiAgICAgIGlmIChwYXlsb2FkLmp0aSAhPT0gb3B0aW9ucy5qd3RpZCkge1xyXG4gICAgICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignand0IGp3dGlkIGludmFsaWQuIGV4cGVjdGVkOiAnICsgb3B0aW9ucy5qd3RpZCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMubm9uY2UpIHtcclxuICAgICAgaWYgKHBheWxvYWQubm9uY2UgIT09IG9wdGlvbnMubm9uY2UpIHtcclxuICAgICAgICByZXR1cm4gZG9uZShuZXcgSnNvbldlYlRva2VuRXJyb3IoJ2p3dCBub25jZSBpbnZhbGlkLiBleHBlY3RlZDogJyArIG9wdGlvbnMubm9uY2UpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLm1heEFnZSkge1xyXG4gICAgICBpZiAodHlwZW9mIHBheWxvYWQuaWF0ICE9PSAnbnVtYmVyJykge1xyXG4gICAgICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignaWF0IHJlcXVpcmVkIHdoZW4gbWF4QWdlIGlzIHNwZWNpZmllZCcpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIG1heEFnZVRpbWVzdGFtcCA9IHRpbWVzcGFuKG9wdGlvbnMubWF4QWdlLCBwYXlsb2FkLmlhdCk7XHJcbiAgICAgIGlmICh0eXBlb2YgbWF4QWdlVGltZXN0YW1wID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiBkb25lKG5ldyBKc29uV2ViVG9rZW5FcnJvcignXCJtYXhBZ2VcIiBzaG91bGQgYmUgYSBudW1iZXIgb2Ygc2Vjb25kcyBvciBzdHJpbmcgcmVwcmVzZW50aW5nIGEgdGltZXNwYW4gZWc6IFwiMWRcIiwgXCIyMGhcIiwgNjAnKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNsb2NrVGltZXN0YW1wID49IG1heEFnZVRpbWVzdGFtcCArIChvcHRpb25zLmNsb2NrVG9sZXJhbmNlIHx8IDApKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvbmUobmV3IFRva2VuRXhwaXJlZEVycm9yKCdtYXhBZ2UgZXhjZWVkZWQnLCBuZXcgRGF0ZShtYXhBZ2VUaW1lc3RhbXAgKiAxMDAwKSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRvbmUobnVsbCwgcGF5bG9hZCk7XHJcbiAgfSk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGRlY29kZTogcmVxdWlyZSgnLi9kZWNvZGUnKSxcclxuICB2ZXJpZnk6IHJlcXVpcmUoJy4vdmVyaWZ5JyksXHJcbiAgc2lnbjogcmVxdWlyZSgnLi9zaWduJyksXHJcbiAgSnNvbldlYlRva2VuRXJyb3I6IHJlcXVpcmUoJy4vbGliL0pzb25XZWJUb2tlbkVycm9yJyksXHJcbiAgTm90QmVmb3JlRXJyb3I6IHJlcXVpcmUoJy4vbGliL05vdEJlZm9yZUVycm9yJyksXHJcbiAgVG9rZW5FeHBpcmVkRXJyb3I6IHJlcXVpcmUoJy4vbGliL1Rva2VuRXhwaXJlZEVycm9yJyksXHJcbn07XHJcbiIsInZhciB0aW1lc3BhbiA9IHJlcXVpcmUoJy4vbGliL3RpbWVzcGFuJyk7XHJcbnZhciBqd3MgPSByZXF1aXJlKCdqd3MnKTtcclxudmFyIGluY2x1ZGVzID0gcmVxdWlyZSgnbG9kYXNoLmluY2x1ZGVzJyk7XHJcbnZhciBpc0Jvb2xlYW4gPSByZXF1aXJlKCdsb2Rhc2guaXNib29sZWFuJyk7XHJcbnZhciBpc0ludGVnZXIgPSByZXF1aXJlKCdsb2Rhc2guaXNpbnRlZ2VyJyk7XHJcbnZhciBpc051bWJlciA9IHJlcXVpcmUoJ2xvZGFzaC5pc251bWJlcicpO1xyXG52YXIgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoJ2xvZGFzaC5pc3BsYWlub2JqZWN0Jyk7XHJcbnZhciBpc1N0cmluZyA9IHJlcXVpcmUoJ2xvZGFzaC5pc3N0cmluZycpO1xyXG52YXIgb25jZSA9IHJlcXVpcmUoJ2xvZGFzaC5vbmNlJyk7XHJcblxyXG52YXIgc2lnbl9vcHRpb25zX3NjaGVtYSA9IHtcclxuICBleHBpcmVzSW46IHsgaXNWYWxpZDogZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIGlzSW50ZWdlcih2YWx1ZSkgfHwgKGlzU3RyaW5nKHZhbHVlKSAmJiB2YWx1ZSk7IH0sIG1lc3NhZ2U6ICdcImV4cGlyZXNJblwiIHNob3VsZCBiZSBhIG51bWJlciBvZiBzZWNvbmRzIG9yIHN0cmluZyByZXByZXNlbnRpbmcgYSB0aW1lc3BhbicgfSxcclxuICBub3RCZWZvcmU6IHsgaXNWYWxpZDogZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIGlzSW50ZWdlcih2YWx1ZSkgfHwgKGlzU3RyaW5nKHZhbHVlKSAmJiB2YWx1ZSk7IH0sIG1lc3NhZ2U6ICdcIm5vdEJlZm9yZVwiIHNob3VsZCBiZSBhIG51bWJlciBvZiBzZWNvbmRzIG9yIHN0cmluZyByZXByZXNlbnRpbmcgYSB0aW1lc3BhbicgfSxcclxuICBhdWRpZW5jZTogeyBpc1ZhbGlkOiBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gaXNTdHJpbmcodmFsdWUpIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpOyB9LCBtZXNzYWdlOiAnXCJhdWRpZW5jZVwiIG11c3QgYmUgYSBzdHJpbmcgb3IgYXJyYXknIH0sXHJcbiAgYWxnb3JpdGhtOiB7IGlzVmFsaWQ6IGluY2x1ZGVzLmJpbmQobnVsbCwgWydSUzI1NicsICdSUzM4NCcsICdSUzUxMicsICdFUzI1NicsICdFUzM4NCcsICdFUzUxMicsICdIUzI1NicsICdIUzM4NCcsICdIUzUxMicsICdub25lJ10pLCBtZXNzYWdlOiAnXCJhbGdvcml0aG1cIiBtdXN0IGJlIGEgdmFsaWQgc3RyaW5nIGVudW0gdmFsdWUnIH0sXHJcbiAgaGVhZGVyOiB7IGlzVmFsaWQ6IGlzUGxhaW5PYmplY3QsIG1lc3NhZ2U6ICdcImhlYWRlclwiIG11c3QgYmUgYW4gb2JqZWN0JyB9LFxyXG4gIGVuY29kaW5nOiB7IGlzVmFsaWQ6IGlzU3RyaW5nLCBtZXNzYWdlOiAnXCJlbmNvZGluZ1wiIG11c3QgYmUgYSBzdHJpbmcnIH0sXHJcbiAgaXNzdWVyOiB7IGlzVmFsaWQ6IGlzU3RyaW5nLCBtZXNzYWdlOiAnXCJpc3N1ZXJcIiBtdXN0IGJlIGEgc3RyaW5nJyB9LFxyXG4gIHN1YmplY3Q6IHsgaXNWYWxpZDogaXNTdHJpbmcsIG1lc3NhZ2U6ICdcInN1YmplY3RcIiBtdXN0IGJlIGEgc3RyaW5nJyB9LFxyXG4gIGp3dGlkOiB7IGlzVmFsaWQ6IGlzU3RyaW5nLCBtZXNzYWdlOiAnXCJqd3RpZFwiIG11c3QgYmUgYSBzdHJpbmcnIH0sXHJcbiAgbm9UaW1lc3RhbXA6IHsgaXNWYWxpZDogaXNCb29sZWFuLCBtZXNzYWdlOiAnXCJub1RpbWVzdGFtcFwiIG11c3QgYmUgYSBib29sZWFuJyB9LFxyXG4gIGtleWlkOiB7IGlzVmFsaWQ6IGlzU3RyaW5nLCBtZXNzYWdlOiAnXCJrZXlpZFwiIG11c3QgYmUgYSBzdHJpbmcnIH0sXHJcbiAgbXV0YXRlUGF5bG9hZDogeyBpc1ZhbGlkOiBpc0Jvb2xlYW4sIG1lc3NhZ2U6ICdcIm11dGF0ZVBheWxvYWRcIiBtdXN0IGJlIGEgYm9vbGVhbicgfVxyXG59O1xyXG5cclxudmFyIHJlZ2lzdGVyZWRfY2xhaW1zX3NjaGVtYSA9IHtcclxuICBpYXQ6IHsgaXNWYWxpZDogaXNOdW1iZXIsIG1lc3NhZ2U6ICdcImlhdFwiIHNob3VsZCBiZSBhIG51bWJlciBvZiBzZWNvbmRzJyB9LFxyXG4gIGV4cDogeyBpc1ZhbGlkOiBpc051bWJlciwgbWVzc2FnZTogJ1wiZXhwXCIgc2hvdWxkIGJlIGEgbnVtYmVyIG9mIHNlY29uZHMnIH0sXHJcbiAgbmJmOiB7IGlzVmFsaWQ6IGlzTnVtYmVyLCBtZXNzYWdlOiAnXCJuYmZcIiBzaG91bGQgYmUgYSBudW1iZXIgb2Ygc2Vjb25kcycgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGUoc2NoZW1hLCBhbGxvd1Vua25vd24sIG9iamVjdCwgcGFyYW1ldGVyTmFtZSkge1xyXG4gIGlmICghaXNQbGFpbk9iamVjdChvYmplY3QpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIFwiJyArIHBhcmFtZXRlck5hbWUgKyAnXCIgdG8gYmUgYSBwbGFpbiBvYmplY3QuJyk7XHJcbiAgfVxyXG4gIE9iamVjdC5rZXlzKG9iamVjdClcclxuICAgIC5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICB2YXIgdmFsaWRhdG9yID0gc2NoZW1hW2tleV07XHJcbiAgICAgIGlmICghdmFsaWRhdG9yKSB7XHJcbiAgICAgICAgaWYgKCFhbGxvd1Vua25vd24pIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignXCInICsga2V5ICsgJ1wiIGlzIG5vdCBhbGxvd2VkIGluIFwiJyArIHBhcmFtZXRlck5hbWUgKyAnXCInKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghdmFsaWRhdG9yLmlzVmFsaWQob2JqZWN0W2tleV0pKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHZhbGlkYXRvci5tZXNzYWdlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgcmV0dXJuIHZhbGlkYXRlKHNpZ25fb3B0aW9uc19zY2hlbWEsIGZhbHNlLCBvcHRpb25zLCAnb3B0aW9ucycpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB2YWxpZGF0ZVBheWxvYWQocGF5bG9hZCkge1xyXG4gIHJldHVybiB2YWxpZGF0ZShyZWdpc3RlcmVkX2NsYWltc19zY2hlbWEsIHRydWUsIHBheWxvYWQsICdwYXlsb2FkJyk7XHJcbn1cclxuXHJcbnZhciBvcHRpb25zX3RvX3BheWxvYWQgPSB7XHJcbiAgJ2F1ZGllbmNlJzogJ2F1ZCcsXHJcbiAgJ2lzc3Vlcic6ICdpc3MnLFxyXG4gICdzdWJqZWN0JzogJ3N1YicsXHJcbiAgJ2p3dGlkJzogJ2p0aSdcclxufTtcclxuXHJcbnZhciBvcHRpb25zX2Zvcl9vYmplY3RzID0gW1xyXG4gICdleHBpcmVzSW4nLFxyXG4gICdub3RCZWZvcmUnLFxyXG4gICdub1RpbWVzdGFtcCcsXHJcbiAgJ2F1ZGllbmNlJyxcclxuICAnaXNzdWVyJyxcclxuICAnc3ViamVjdCcsXHJcbiAgJ2p3dGlkJyxcclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBheWxvYWQsIHNlY3JldE9yUHJpdmF0ZUtleSwgb3B0aW9ucywgY2FsbGJhY2spIHtcclxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcclxuICAgIG9wdGlvbnMgPSB7fTtcclxuICB9IGVsc2Uge1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgfVxyXG5cclxuICB2YXIgaXNPYmplY3RQYXlsb2FkID0gdHlwZW9mIHBheWxvYWQgPT09ICdvYmplY3QnICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICFCdWZmZXIuaXNCdWZmZXIocGF5bG9hZCk7XHJcblxyXG4gIHZhciBoZWFkZXIgPSBPYmplY3QuYXNzaWduKHtcclxuICAgIGFsZzogb3B0aW9ucy5hbGdvcml0aG0gfHwgJ0hTMjU2JyxcclxuICAgIHR5cDogaXNPYmplY3RQYXlsb2FkID8gJ0pXVCcgOiB1bmRlZmluZWQsXHJcbiAgICBraWQ6IG9wdGlvbnMua2V5aWRcclxuICB9LCBvcHRpb25zLmhlYWRlcik7XHJcblxyXG4gIGZ1bmN0aW9uIGZhaWx1cmUoZXJyKSB7XHJcbiAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfVxyXG5cclxuICBpZiAoIXNlY3JldE9yUHJpdmF0ZUtleSAmJiBvcHRpb25zLmFsZ29yaXRobSAhPT0gJ25vbmUnKSB7XHJcbiAgICByZXR1cm4gZmFpbHVyZShuZXcgRXJyb3IoJ3NlY3JldE9yUHJpdmF0ZUtleSBtdXN0IGhhdmUgYSB2YWx1ZScpKTtcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2YgcGF5bG9hZCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHJldHVybiBmYWlsdXJlKG5ldyBFcnJvcigncGF5bG9hZCBpcyByZXF1aXJlZCcpKTtcclxuICB9IGVsc2UgaWYgKGlzT2JqZWN0UGF5bG9hZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdmFsaWRhdGVQYXlsb2FkKHBheWxvYWQpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBmYWlsdXJlKGVycm9yKTtcclxuICAgIH1cclxuICAgIGlmICghb3B0aW9ucy5tdXRhdGVQYXlsb2FkKSB7XHJcbiAgICAgIHBheWxvYWQgPSBPYmplY3QuYXNzaWduKHt9LHBheWxvYWQpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgaW52YWxpZF9vcHRpb25zID0gb3B0aW9uc19mb3Jfb2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24gKG9wdCkge1xyXG4gICAgICByZXR1cm4gdHlwZW9mIG9wdGlvbnNbb3B0XSAhPT0gJ3VuZGVmaW5lZCc7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoaW52YWxpZF9vcHRpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgcmV0dXJuIGZhaWx1cmUobmV3IEVycm9yKCdpbnZhbGlkICcgKyBpbnZhbGlkX29wdGlvbnMuam9pbignLCcpICsgJyBvcHRpb24gZm9yICcgKyAodHlwZW9mIHBheWxvYWQgKSArICcgcGF5bG9hZCcpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2YgcGF5bG9hZC5leHAgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBvcHRpb25zLmV4cGlyZXNJbiAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHJldHVybiBmYWlsdXJlKG5ldyBFcnJvcignQmFkIFwib3B0aW9ucy5leHBpcmVzSW5cIiBvcHRpb24gdGhlIHBheWxvYWQgYWxyZWFkeSBoYXMgYW4gXCJleHBcIiBwcm9wZXJ0eS4nKSk7XHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIHBheWxvYWQubmJmICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygb3B0aW9ucy5ub3RCZWZvcmUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXR1cm4gZmFpbHVyZShuZXcgRXJyb3IoJ0JhZCBcIm9wdGlvbnMubm90QmVmb3JlXCIgb3B0aW9uIHRoZSBwYXlsb2FkIGFscmVhZHkgaGFzIGFuIFwibmJmXCIgcHJvcGVydHkuJykpO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIHZhbGlkYXRlT3B0aW9ucyhvcHRpb25zKTtcclxuICB9XHJcbiAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXR1cm4gZmFpbHVyZShlcnJvcik7XHJcbiAgfVxyXG5cclxuICB2YXIgdGltZXN0YW1wID0gcGF5bG9hZC5pYXQgfHwgTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCk7XHJcblxyXG4gIGlmICghb3B0aW9ucy5ub1RpbWVzdGFtcCkge1xyXG4gICAgcGF5bG9hZC5pYXQgPSB0aW1lc3RhbXA7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRlbGV0ZSBwYXlsb2FkLmlhdDtcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5ub3RCZWZvcmUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBwYXlsb2FkLm5iZiA9IHRpbWVzcGFuKG9wdGlvbnMubm90QmVmb3JlLCB0aW1lc3RhbXApO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycikge1xyXG4gICAgICByZXR1cm4gZmFpbHVyZShlcnIpO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBwYXlsb2FkLm5iZiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgcmV0dXJuIGZhaWx1cmUobmV3IEVycm9yKCdcIm5vdEJlZm9yZVwiIHNob3VsZCBiZSBhIG51bWJlciBvZiBzZWNvbmRzIG9yIHN0cmluZyByZXByZXNlbnRpbmcgYSB0aW1lc3BhbiBlZzogXCIxZFwiLCBcIjIwaFwiLCA2MCcpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5leHBpcmVzSW4gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwYXlsb2FkID09PSAnb2JqZWN0Jykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgcGF5bG9hZC5leHAgPSB0aW1lc3BhbihvcHRpb25zLmV4cGlyZXNJbiwgdGltZXN0YW1wKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgcmV0dXJuIGZhaWx1cmUoZXJyKTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgcGF5bG9hZC5leHAgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHJldHVybiBmYWlsdXJlKG5ldyBFcnJvcignXCJleHBpcmVzSW5cIiBzaG91bGQgYmUgYSBudW1iZXIgb2Ygc2Vjb25kcyBvciBzdHJpbmcgcmVwcmVzZW50aW5nIGEgdGltZXNwYW4gZWc6IFwiMWRcIiwgXCIyMGhcIiwgNjAnKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBPYmplY3Qua2V5cyhvcHRpb25zX3RvX3BheWxvYWQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG4gICAgdmFyIGNsYWltID0gb3B0aW9uc190b19wYXlsb2FkW2tleV07XHJcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgaWYgKHR5cGVvZiBwYXlsb2FkW2NsYWltXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm4gZmFpbHVyZShuZXcgRXJyb3IoJ0JhZCBcIm9wdGlvbnMuJyArIGtleSArICdcIiBvcHRpb24uIFRoZSBwYXlsb2FkIGFscmVhZHkgaGFzIGFuIFwiJyArIGNsYWltICsgJ1wiIHByb3BlcnR5LicpKTtcclxuICAgICAgfVxyXG4gICAgICBwYXlsb2FkW2NsYWltXSA9IG9wdGlvbnNba2V5XTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgdmFyIGVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZyB8fCAndXRmOCc7XHJcblxyXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgJiYgb25jZShjYWxsYmFjayk7XHJcblxyXG4gICAgandzLmNyZWF0ZVNpZ24oe1xyXG4gICAgICBoZWFkZXI6IGhlYWRlcixcclxuICAgICAgcHJpdmF0ZUtleTogc2VjcmV0T3JQcml2YXRlS2V5LFxyXG4gICAgICBwYXlsb2FkOiBwYXlsb2FkLFxyXG4gICAgICBlbmNvZGluZzogZW5jb2RpbmdcclxuICAgIH0pLm9uY2UoJ2Vycm9yJywgY2FsbGJhY2spXHJcbiAgICAgIC5vbmNlKCdkb25lJywgZnVuY3Rpb24gKHNpZ25hdHVyZSkge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHNpZ25hdHVyZSk7XHJcbiAgICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gandzLnNpZ24oe2hlYWRlcjogaGVhZGVyLCBwYXlsb2FkOiBwYXlsb2FkLCBzZWNyZXQ6IHNlY3JldE9yUHJpdmF0ZUtleSwgZW5jb2Rpbmc6IGVuY29kaW5nfSk7XHJcbiAgfVxyXG59O1xyXG4iLCJ2YXIgSnNvbldlYlRva2VuRXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSwgZXJyb3IpIHtcclxuICBFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xyXG4gIGlmKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XHJcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcclxuICB9XHJcbiAgdGhpcy5uYW1lID0gJ0pzb25XZWJUb2tlbkVycm9yJztcclxuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gIGlmIChlcnJvcikgdGhpcy5pbm5lciA9IGVycm9yO1xyXG59O1xyXG5cclxuSnNvbldlYlRva2VuRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xyXG5Kc29uV2ViVG9rZW5FcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBKc29uV2ViVG9rZW5FcnJvcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSnNvbldlYlRva2VuRXJyb3I7XHJcbiIsInZhciBqd3MgPSByZXF1aXJlKCdqd3MnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGp3dCwgb3B0aW9ucykge1xyXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gIHZhciBkZWNvZGVkID0gandzLmRlY29kZShqd3QsIG9wdGlvbnMpO1xyXG4gIGlmICghZGVjb2RlZCkgeyByZXR1cm4gbnVsbDsgfVxyXG4gIHZhciBwYXlsb2FkID0gZGVjb2RlZC5wYXlsb2FkO1xyXG5cclxuICAvL3RyeSBwYXJzZSB0aGUgcGF5bG9hZFxyXG4gIGlmKHR5cGVvZiBwYXlsb2FkID09PSAnc3RyaW5nJykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdmFyIG9iaiA9IEpTT04ucGFyc2UocGF5bG9hZCk7XHJcbiAgICAgIGlmKG9iaiAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIHBheWxvYWQgPSBvYmo7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHsgfVxyXG4gIH1cclxuXHJcbiAgLy9yZXR1cm4gaGVhZGVyIGlmIGBjb21wbGV0ZWAgb3B0aW9uIGlzIGVuYWJsZWQuICBoZWFkZXIgaW5jbHVkZXMgY2xhaW1zXHJcbiAgLy9zdWNoIGFzIGBraWRgIGFuZCBgYWxnYCB1c2VkIHRvIHNlbGVjdCB0aGUga2V5IHdpdGhpbiBhIEpXS1MgbmVlZGVkIHRvXHJcbiAgLy92ZXJpZnkgdGhlIHNpZ25hdHVyZVxyXG4gIGlmIChvcHRpb25zLmNvbXBsZXRlID09PSB0cnVlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoZWFkZXI6IGRlY29kZWQuaGVhZGVyLFxyXG4gICAgICBwYXlsb2FkOiBwYXlsb2FkLFxyXG4gICAgICBzaWduYXR1cmU6IGRlY29kZWQuc2lnbmF0dXJlXHJcbiAgICB9O1xyXG4gIH1cclxuICByZXR1cm4gcGF5bG9hZDtcclxufTtcclxuIiwidmFyIEpzb25XZWJUb2tlbkVycm9yID0gcmVxdWlyZSgnLi9Kc29uV2ViVG9rZW5FcnJvcicpO1xyXG5cclxudmFyIFRva2VuRXhwaXJlZEVycm9yID0gZnVuY3Rpb24gKG1lc3NhZ2UsIGV4cGlyZWRBdCkge1xyXG4gIEpzb25XZWJUb2tlbkVycm9yLmNhbGwodGhpcywgbWVzc2FnZSk7XHJcbiAgdGhpcy5uYW1lID0gJ1Rva2VuRXhwaXJlZEVycm9yJztcclxuICB0aGlzLmV4cGlyZWRBdCA9IGV4cGlyZWRBdDtcclxufTtcclxuXHJcblRva2VuRXhwaXJlZEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSnNvbldlYlRva2VuRXJyb3IucHJvdG90eXBlKTtcclxuXHJcblRva2VuRXhwaXJlZEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRva2VuRXhwaXJlZEVycm9yO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUb2tlbkV4cGlyZWRFcnJvcjsiLCIvKipcclxuICogSGVscGVycy5cclxuICovXHJcblxyXG52YXIgcyA9IDEwMDA7XHJcbnZhciBtID0gcyAqIDYwO1xyXG52YXIgaCA9IG0gKiA2MDtcclxudmFyIGQgPSBoICogMjQ7XHJcbnZhciB3ID0gZCAqIDc7XHJcbnZhciB5ID0gZCAqIDM2NS4yNTtcclxuXHJcbi8qKlxyXG4gKiBQYXJzZSBvciBmb3JtYXQgdGhlIGdpdmVuIGB2YWxgLlxyXG4gKlxyXG4gKiBPcHRpb25zOlxyXG4gKlxyXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSB2YWxcclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAdGhyb3dzIHtFcnJvcn0gdGhyb3cgYW4gZXJyb3IgaWYgdmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSBudW1iZXJcclxuICogQHJldHVybiB7U3RyaW5nfE51bWJlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCwgb3B0aW9ucykge1xyXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbDtcclxuICBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDApIHtcclxuICAgIHJldHVybiBwYXJzZSh2YWwpO1xyXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgaXNOYU4odmFsKSA9PT0gZmFsc2UpIHtcclxuICAgIHJldHVybiBvcHRpb25zLmxvbmcgPyBmbXRMb25nKHZhbCkgOiBmbXRTaG9ydCh2YWwpO1xyXG4gIH1cclxuICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAndmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSB2YWxpZCBudW1iZXIuIHZhbD0nICtcclxuICAgICAgSlNPTi5zdHJpbmdpZnkodmFsKVxyXG4gICk7XHJcbn07XHJcblxyXG4vKipcclxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIGFuZCByZXR1cm4gbWlsbGlzZWNvbmRzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXHJcbiAqIEByZXR1cm4ge051bWJlcn1cclxuICogQGFwaSBwcml2YXRlXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XHJcbiAgc3RyID0gU3RyaW5nKHN0cik7XHJcbiAgaWYgKHN0ci5sZW5ndGggPiAxMDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIG1hdGNoID0gL14oKD86XFxkKyk/XFwtP1xcZD9cXC4/XFxkKykgKihtaWxsaXNlY29uZHM/fG1zZWNzP3xtc3xzZWNvbmRzP3xzZWNzP3xzfG1pbnV0ZXM/fG1pbnM/fG18aG91cnM/fGhycz98aHxkYXlzP3xkfHdlZWtzP3x3fHllYXJzP3x5cnM/fHkpPyQvaS5leGVjKFxyXG4gICAgc3RyXHJcbiAgKTtcclxuICBpZiAoIW1hdGNoKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBuID0gcGFyc2VGbG9hdChtYXRjaFsxXSk7XHJcbiAgdmFyIHR5cGUgPSAobWF0Y2hbMl0gfHwgJ21zJykudG9Mb3dlckNhc2UoKTtcclxuICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgIGNhc2UgJ3llYXJzJzpcclxuICAgIGNhc2UgJ3llYXInOlxyXG4gICAgY2FzZSAneXJzJzpcclxuICAgIGNhc2UgJ3lyJzpcclxuICAgIGNhc2UgJ3knOlxyXG4gICAgICByZXR1cm4gbiAqIHk7XHJcbiAgICBjYXNlICd3ZWVrcyc6XHJcbiAgICBjYXNlICd3ZWVrJzpcclxuICAgIGNhc2UgJ3cnOlxyXG4gICAgICByZXR1cm4gbiAqIHc7XHJcbiAgICBjYXNlICdkYXlzJzpcclxuICAgIGNhc2UgJ2RheSc6XHJcbiAgICBjYXNlICdkJzpcclxuICAgICAgcmV0dXJuIG4gKiBkO1xyXG4gICAgY2FzZSAnaG91cnMnOlxyXG4gICAgY2FzZSAnaG91cic6XHJcbiAgICBjYXNlICdocnMnOlxyXG4gICAgY2FzZSAnaHInOlxyXG4gICAgY2FzZSAnaCc6XHJcbiAgICAgIHJldHVybiBuICogaDtcclxuICAgIGNhc2UgJ21pbnV0ZXMnOlxyXG4gICAgY2FzZSAnbWludXRlJzpcclxuICAgIGNhc2UgJ21pbnMnOlxyXG4gICAgY2FzZSAnbWluJzpcclxuICAgIGNhc2UgJ20nOlxyXG4gICAgICByZXR1cm4gbiAqIG07XHJcbiAgICBjYXNlICdzZWNvbmRzJzpcclxuICAgIGNhc2UgJ3NlY29uZCc6XHJcbiAgICBjYXNlICdzZWNzJzpcclxuICAgIGNhc2UgJ3NlYyc6XHJcbiAgICBjYXNlICdzJzpcclxuICAgICAgcmV0dXJuIG4gKiBzO1xyXG4gICAgY2FzZSAnbWlsbGlzZWNvbmRzJzpcclxuICAgIGNhc2UgJ21pbGxpc2Vjb25kJzpcclxuICAgIGNhc2UgJ21zZWNzJzpcclxuICAgIGNhc2UgJ21zZWMnOlxyXG4gICAgY2FzZSAnbXMnOlxyXG4gICAgICByZXR1cm4gbjtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogU2hvcnQgZm9ybWF0IGZvciBgbXNgLlxyXG4gKlxyXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKiBAYXBpIHByaXZhdGVcclxuICovXHJcblxyXG5mdW5jdGlvbiBmbXRTaG9ydChtcykge1xyXG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcclxuICBpZiAobXNBYnMgPj0gZCkge1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBkKSArICdkJztcclxuICB9XHJcbiAgaWYgKG1zQWJzID49IGgpIHtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gaCkgKyAnaCc7XHJcbiAgfVxyXG4gIGlmIChtc0FicyA+PSBtKSB7XHJcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG0pICsgJ20nO1xyXG4gIH1cclxuICBpZiAobXNBYnMgPj0gcykge1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBzKSArICdzJztcclxuICB9XHJcbiAgcmV0dXJuIG1zICsgJ21zJztcclxufVxyXG5cclxuLyoqXHJcbiAqIExvbmcgZm9ybWF0IGZvciBgbXNgLlxyXG4gKlxyXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKiBAYXBpIHByaXZhdGVcclxuICovXHJcblxyXG5mdW5jdGlvbiBmbXRMb25nKG1zKSB7XHJcbiAgdmFyIG1zQWJzID0gTWF0aC5hYnMobXMpO1xyXG4gIGlmIChtc0FicyA+PSBkKSB7XHJcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgZCwgJ2RheScpO1xyXG4gIH1cclxuICBpZiAobXNBYnMgPj0gaCkge1xyXG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIGgsICdob3VyJyk7XHJcbiAgfVxyXG4gIGlmIChtc0FicyA+PSBtKSB7XHJcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgbSwgJ21pbnV0ZScpO1xyXG4gIH1cclxuICBpZiAobXNBYnMgPj0gcykge1xyXG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIHMsICdzZWNvbmQnKTtcclxuICB9XHJcbiAgcmV0dXJuIG1zICsgJyBtcyc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQbHVyYWxpemF0aW9uIGhlbHBlci5cclxuICovXHJcblxyXG5mdW5jdGlvbiBwbHVyYWwobXMsIG1zQWJzLCBuLCBuYW1lKSB7XHJcbiAgdmFyIGlzUGx1cmFsID0gbXNBYnMgPj0gbiAqIDEuNTtcclxuICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG4pICsgJyAnICsgbmFtZSArIChpc1BsdXJhbCA/ICdzJyA6ICcnKTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9