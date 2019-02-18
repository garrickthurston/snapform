(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.http-signature"],{

/***/ "/lFk":
/*!**************************************************!*\
  !*** ./node_modules/http-signature/lib/utils.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2012 Joyent, Inc.  All rights reserved.

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var sshpk = __webpack_require__(/*! sshpk */ "5Q5X");
var util = __webpack_require__(/*! util */ "7tlc");

var HASH_ALGOS = {
  'sha1': true,
  'sha256': true,
  'sha512': true
};

var PK_ALGOS = {
  'rsa': true,
  'dsa': true,
  'ecdsa': true
};

function HttpSignatureError(message, caller) {
  if (Error.captureStackTrace)
    Error.captureStackTrace(this, caller || HttpSignatureError);

  this.message = message;
  this.name = caller.name;
}
util.inherits(HttpSignatureError, Error);

function InvalidAlgorithmError(message) {
  HttpSignatureError.call(this, message, InvalidAlgorithmError);
}
util.inherits(InvalidAlgorithmError, HttpSignatureError);

function validateAlgorithm(algorithm) {
  var alg = algorithm.toLowerCase().split('-');

  if (alg.length !== 2) {
    throw (new InvalidAlgorithmError(alg[0].toUpperCase() + ' is not a ' +
      'valid algorithm'));
  }

  if (alg[0] !== 'hmac' && !PK_ALGOS[alg[0]]) {
    throw (new InvalidAlgorithmError(alg[0].toUpperCase() + ' type keys ' +
      'are not supported'));
  }

  if (!HASH_ALGOS[alg[1]]) {
    throw (new InvalidAlgorithmError(alg[1].toUpperCase() + ' is not a ' +
      'supported hash algorithm'));
  }

  return (alg);
}

///--- API

module.exports = {

  HASH_ALGOS: HASH_ALGOS,
  PK_ALGOS: PK_ALGOS,

  HttpSignatureError: HttpSignatureError,
  InvalidAlgorithmError: InvalidAlgorithmError,

  validateAlgorithm: validateAlgorithm,

  /**
   * Converts an OpenSSH public key (rsa only) to a PKCS#8 PEM file.
   *
   * The intent of this module is to interoperate with OpenSSL only,
   * specifically the node crypto module's `verify` method.
   *
   * @param {String} key an OpenSSH public key.
   * @return {String} PEM encoded form of the RSA public key.
   * @throws {TypeError} on bad input.
   * @throws {Error} on invalid ssh key formatted data.
   */
  sshKeyToPEM: function sshKeyToPEM(key) {
    assert.string(key, 'ssh_key');

    var k = sshpk.parseKey(key, 'ssh');
    return (k.toString('pem'));
  },


  /**
   * Generates an OpenSSH fingerprint from an ssh public key.
   *
   * @param {String} key an OpenSSH public key.
   * @return {String} key fingerprint.
   * @throws {TypeError} on bad input.
   * @throws {Error} if what you passed doesn't look like an ssh public key.
   */
  fingerprint: function fingerprint(key) {
    assert.string(key, 'ssh_key');

    var k = sshpk.parseKey(key, 'ssh');
    return (k.fingerprint('md5').toString('hex'));
  },

  /**
   * Converts a PKGCS#8 PEM file to an OpenSSH public key (rsa)
   *
   * The reverse of the above function.
   */
  pemToRsaSSHKey: function pemToRsaSSHKey(pem, comment) {
    assert.equal('string', typeof (pem), 'typeof pem');

    var k = sshpk.parseKey(pem, 'pem');
    k.comment = comment;
    return (k.toString('ssh'));
  }
};


/***/ }),

/***/ "1HQQ":
/*!***************************************************!*\
  !*** ./node_modules/http-signature/lib/parser.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2012 Joyent, Inc.  All rights reserved.

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var util = __webpack_require__(/*! util */ "7tlc");
var utils = __webpack_require__(/*! ./utils */ "/lFk");



///--- Globals

var HASH_ALGOS = utils.HASH_ALGOS;
var PK_ALGOS = utils.PK_ALGOS;
var HttpSignatureError = utils.HttpSignatureError;
var InvalidAlgorithmError = utils.InvalidAlgorithmError;
var validateAlgorithm = utils.validateAlgorithm;

var State = {
  New: 0,
  Params: 1
};

var ParamsState = {
  Name: 0,
  Quote: 1,
  Value: 2,
  Comma: 3
};


///--- Specific Errors


function ExpiredRequestError(message) {
  HttpSignatureError.call(this, message, ExpiredRequestError);
}
util.inherits(ExpiredRequestError, HttpSignatureError);


function InvalidHeaderError(message) {
  HttpSignatureError.call(this, message, InvalidHeaderError);
}
util.inherits(InvalidHeaderError, HttpSignatureError);


function InvalidParamsError(message) {
  HttpSignatureError.call(this, message, InvalidParamsError);
}
util.inherits(InvalidParamsError, HttpSignatureError);


function MissingHeaderError(message) {
  HttpSignatureError.call(this, message, MissingHeaderError);
}
util.inherits(MissingHeaderError, HttpSignatureError);

function StrictParsingError(message) {
  HttpSignatureError.call(this, message, StrictParsingError);
}
util.inherits(StrictParsingError, HttpSignatureError);

///--- Exported API

module.exports = {

  /**
   * Parses the 'Authorization' header out of an http.ServerRequest object.
   *
   * Note that this API will fully validate the Authorization header, and throw
   * on any error.  It will not however check the signature, or the keyId format
   * as those are specific to your environment.  You can use the options object
   * to pass in extra constraints.
   *
   * As a response object you can expect this:
   *
   *     {
   *       "scheme": "Signature",
   *       "params": {
   *         "keyId": "foo",
   *         "algorithm": "rsa-sha256",
   *         "headers": [
   *           "date" or "x-date",
   *           "digest"
   *         ],
   *         "signature": "base64"
   *       },
   *       "signingString": "ready to be passed to crypto.verify()"
   *     }
   *
   * @param {Object} request an http.ServerRequest.
   * @param {Object} options an optional options object with:
   *                   - clockSkew: allowed clock skew in seconds (default 300).
   *                   - headers: required header names (def: date or x-date)
   *                   - algorithms: algorithms to support (default: all).
   *                   - strict: should enforce latest spec parsing
   *                             (default: false).
   * @return {Object} parsed out object (see above).
   * @throws {TypeError} on invalid input.
   * @throws {InvalidHeaderError} on an invalid Authorization header error.
   * @throws {InvalidParamsError} if the params in the scheme are invalid.
   * @throws {MissingHeaderError} if the params indicate a header not present,
   *                              either in the request headers from the params,
   *                              or not in the params from a required header
   *                              in options.
   * @throws {StrictParsingError} if old attributes are used in strict parsing
   *                              mode.
   * @throws {ExpiredRequestError} if the value of date or x-date exceeds skew.
   */
  parseRequest: function parseRequest(request, options) {
    assert.object(request, 'request');
    assert.object(request.headers, 'request.headers');
    if (options === undefined) {
      options = {};
    }
    if (options.headers === undefined) {
      options.headers = [request.headers['x-date'] ? 'x-date' : 'date'];
    }
    assert.object(options, 'options');
    assert.arrayOfString(options.headers, 'options.headers');
    assert.optionalFinite(options.clockSkew, 'options.clockSkew');

    var authzHeaderName = options.authorizationHeaderName || 'authorization';

    if (!request.headers[authzHeaderName]) {
      throw new MissingHeaderError('no ' + authzHeaderName + ' header ' +
                                   'present in the request');
    }

    options.clockSkew = options.clockSkew || 300;


    var i = 0;
    var state = State.New;
    var substate = ParamsState.Name;
    var tmpName = '';
    var tmpValue = '';

    var parsed = {
      scheme: '',
      params: {},
      signingString: ''
    };

    var authz = request.headers[authzHeaderName];
    for (i = 0; i < authz.length; i++) {
      var c = authz.charAt(i);

      switch (Number(state)) {

      case State.New:
        if (c !== ' ') parsed.scheme += c;
        else state = State.Params;
        break;

      case State.Params:
        switch (Number(substate)) {

        case ParamsState.Name:
          var code = c.charCodeAt(0);
          // restricted name of A-Z / a-z
          if ((code >= 0x41 && code <= 0x5a) || // A-Z
              (code >= 0x61 && code <= 0x7a)) { // a-z
            tmpName += c;
          } else if (c === '=') {
            if (tmpName.length === 0)
              throw new InvalidHeaderError('bad param format');
            substate = ParamsState.Quote;
          } else {
            throw new InvalidHeaderError('bad param format');
          }
          break;

        case ParamsState.Quote:
          if (c === '"') {
            tmpValue = '';
            substate = ParamsState.Value;
          } else {
            throw new InvalidHeaderError('bad param format');
          }
          break;

        case ParamsState.Value:
          if (c === '"') {
            parsed.params[tmpName] = tmpValue;
            substate = ParamsState.Comma;
          } else {
            tmpValue += c;
          }
          break;

        case ParamsState.Comma:
          if (c === ',') {
            tmpName = '';
            substate = ParamsState.Name;
          } else {
            throw new InvalidHeaderError('bad param format');
          }
          break;

        default:
          throw new Error('Invalid substate');
        }
        break;

      default:
        throw new Error('Invalid substate');
      }

    }

    if (!parsed.params.headers || parsed.params.headers === '') {
      if (request.headers['x-date']) {
        parsed.params.headers = ['x-date'];
      } else {
        parsed.params.headers = ['date'];
      }
    } else {
      parsed.params.headers = parsed.params.headers.split(' ');
    }

    // Minimally validate the parsed object
    if (!parsed.scheme || parsed.scheme !== 'Signature')
      throw new InvalidHeaderError('scheme was not "Signature"');

    if (!parsed.params.keyId)
      throw new InvalidHeaderError('keyId was not specified');

    if (!parsed.params.algorithm)
      throw new InvalidHeaderError('algorithm was not specified');

    if (!parsed.params.signature)
      throw new InvalidHeaderError('signature was not specified');

    // Check the algorithm against the official list
    parsed.params.algorithm = parsed.params.algorithm.toLowerCase();
    try {
      validateAlgorithm(parsed.params.algorithm);
    } catch (e) {
      if (e instanceof InvalidAlgorithmError)
        throw (new InvalidParamsError(parsed.params.algorithm + ' is not ' +
          'supported'));
      else
        throw (e);
    }

    // Build the signingString
    for (i = 0; i < parsed.params.headers.length; i++) {
      var h = parsed.params.headers[i].toLowerCase();
      parsed.params.headers[i] = h;

      if (h === 'request-line') {
        if (!options.strict) {
          /*
           * We allow headers from the older spec drafts if strict parsing isn't
           * specified in options.
           */
          parsed.signingString +=
            request.method + ' ' + request.url + ' HTTP/' + request.httpVersion;
        } else {
          /* Strict parsing doesn't allow older draft headers. */
          throw (new StrictParsingError('request-line is not a valid header ' +
            'with strict parsing enabled.'));
        }
      } else if (h === '(request-target)') {
        parsed.signingString +=
          '(request-target): ' + request.method.toLowerCase() + ' ' +
          request.url;
      } else {
        var value = request.headers[h];
        if (value === undefined)
          throw new MissingHeaderError(h + ' was not in the request');
        parsed.signingString += h + ': ' + value;
      }

      if ((i + 1) < parsed.params.headers.length)
        parsed.signingString += '\n';
    }

    // Check against the constraints
    var date;
    if (request.headers.date || request.headers['x-date']) {
        if (request.headers['x-date']) {
          date = new Date(request.headers['x-date']);
        } else {
          date = new Date(request.headers.date);
        }
      var now = new Date();
      var skew = Math.abs(now.getTime() - date.getTime());

      if (skew > options.clockSkew * 1000) {
        throw new ExpiredRequestError('clock skew of ' +
                                      (skew / 1000) +
                                      's was greater than ' +
                                      options.clockSkew + 's');
      }
    }

    options.headers.forEach(function (hdr) {
      // Remember that we already checked any headers in the params
      // were in the request, so if this passes we're good.
      if (parsed.params.headers.indexOf(hdr.toLowerCase()) < 0)
        throw new MissingHeaderError(hdr + ' was not a signed header');
    });

    if (options.algorithms) {
      if (options.algorithms.indexOf(parsed.params.algorithm) === -1)
        throw new InvalidParamsError(parsed.params.algorithm +
                                     ' is not a supported algorithm');
    }

    parsed.algorithm = parsed.params.algorithm.toUpperCase();
    parsed.keyId = parsed.params.keyId;
    return parsed;
  }

};


/***/ }),

/***/ "YXHM":
/*!***************************************************!*\
  !*** ./node_modules/http-signature/lib/verify.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var crypto = __webpack_require__(/*! crypto */ "HEbw");
var sshpk = __webpack_require__(/*! sshpk */ "5Q5X");
var utils = __webpack_require__(/*! ./utils */ "/lFk");

var HASH_ALGOS = utils.HASH_ALGOS;
var PK_ALGOS = utils.PK_ALGOS;
var InvalidAlgorithmError = utils.InvalidAlgorithmError;
var HttpSignatureError = utils.HttpSignatureError;
var validateAlgorithm = utils.validateAlgorithm;

///--- Exported API

module.exports = {
  /**
   * Verify RSA/DSA signature against public key.  You are expected to pass in
   * an object that was returned from `parse()`.
   *
   * @param {Object} parsedSignature the object you got from `parse`.
   * @param {String} pubkey RSA/DSA private key PEM.
   * @return {Boolean} true if valid, false otherwise.
   * @throws {TypeError} if you pass in bad arguments.
   * @throws {InvalidAlgorithmError}
   */
  verifySignature: function verifySignature(parsedSignature, pubkey) {
    assert.object(parsedSignature, 'parsedSignature');
    if (typeof (pubkey) === 'string' || Buffer.isBuffer(pubkey))
      pubkey = sshpk.parseKey(pubkey);
    assert.ok(sshpk.Key.isKey(pubkey, [1, 1]), 'pubkey must be a sshpk.Key');

    var alg = validateAlgorithm(parsedSignature.algorithm);
    if (alg[0] === 'hmac' || alg[0] !== pubkey.type)
      return (false);

    var v = pubkey.createVerify(alg[1]);
    v.update(parsedSignature.signingString);
    return (v.verify(parsedSignature.params.signature, 'base64'));
  },

  /**
   * Verify HMAC against shared secret.  You are expected to pass in an object
   * that was returned from `parse()`.
   *
   * @param {Object} parsedSignature the object you got from `parse`.
   * @param {String} secret HMAC shared secret.
   * @return {Boolean} true if valid, false otherwise.
   * @throws {TypeError} if you pass in bad arguments.
   * @throws {InvalidAlgorithmError}
   */
  verifyHMAC: function verifyHMAC(parsedSignature, secret) {
    assert.object(parsedSignature, 'parsedHMAC');
    assert.string(secret, 'secret');

    var alg = validateAlgorithm(parsedSignature.algorithm);
    if (alg[0] !== 'hmac')
      return (false);

    var hashAlg = alg[1].toUpperCase();

    var hmac = crypto.createHmac(hashAlg, secret);
    hmac.update(parsedSignature.signingString);

    /*
     * Now double-hash to avoid leaking timing information - there's
     * no easy constant-time compare in JS, so we use this approach
     * instead. See for more info:
     * https://www.isecpartners.com/blog/2011/february/double-hmac-
     * verification.aspx
     */
    var h1 = crypto.createHmac(hashAlg, secret);
    h1.update(hmac.digest());
    h1 = h1.digest();
    var h2 = crypto.createHmac(hashAlg, secret);
    h2.update(new Buffer(parsedSignature.params.signature, 'base64'));
    h2 = h2.digest();

    /* Node 0.8 returns strings from .digest(). */
    if (typeof (h1) === 'string')
      return (h1 === h2);
    /* And node 0.10 lacks the .equals() method on Buffers. */
    if (Buffer.isBuffer(h1) && !h1.equals)
      return (h1.toString('binary') === h2.toString('binary'));

    return (h1.equals(h2));
  }
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "tjlA").Buffer))

/***/ }),

/***/ "oRnL":
/*!**************************************************!*\
  !*** ./node_modules/http-signature/lib/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2015 Joyent, Inc.

var parser = __webpack_require__(/*! ./parser */ "1HQQ");
var signer = __webpack_require__(/*! ./signer */ "t38n");
var verify = __webpack_require__(/*! ./verify */ "YXHM");
var utils = __webpack_require__(/*! ./utils */ "/lFk");



///--- API

module.exports = {

  parse: parser.parseRequest,
  parseRequest: parser.parseRequest,

  sign: signer.signRequest,
  signRequest: signer.signRequest,
  createSigner: signer.createSigner,
  isSigner: signer.isSigner,

  sshKeyToPEM: utils.sshKeyToPEM,
  sshKeyFingerprint: utils.fingerprint,
  pemToRsaSSHKey: utils.pemToRsaSSHKey,

  verify: verify.verifySignature,
  verifySignature: verify.verifySignature,
  verifyHMAC: verify.verifyHMAC
};


/***/ }),

/***/ "t38n":
/*!***************************************************!*\
  !*** ./node_modules/http-signature/lib/signer.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2012 Joyent, Inc.  All rights reserved.

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var crypto = __webpack_require__(/*! crypto */ "HEbw");
var http = __webpack_require__(/*! http */ "lJCZ");
var util = __webpack_require__(/*! util */ "7tlc");
var sshpk = __webpack_require__(/*! sshpk */ "5Q5X");
var jsprim = __webpack_require__(/*! jsprim */ "ef4q");
var utils = __webpack_require__(/*! ./utils */ "/lFk");

var sprintf = __webpack_require__(/*! util */ "7tlc").format;

var HASH_ALGOS = utils.HASH_ALGOS;
var PK_ALGOS = utils.PK_ALGOS;
var InvalidAlgorithmError = utils.InvalidAlgorithmError;
var HttpSignatureError = utils.HttpSignatureError;
var validateAlgorithm = utils.validateAlgorithm;

///--- Globals

var AUTHZ_FMT =
  'Signature keyId="%s",algorithm="%s",headers="%s",signature="%s"';

///--- Specific Errors

function MissingHeaderError(message) {
  HttpSignatureError.call(this, message, MissingHeaderError);
}
util.inherits(MissingHeaderError, HttpSignatureError);

function StrictParsingError(message) {
  HttpSignatureError.call(this, message, StrictParsingError);
}
util.inherits(StrictParsingError, HttpSignatureError);

/* See createSigner() */
function RequestSigner(options) {
  assert.object(options, 'options');

  var alg = [];
  if (options.algorithm !== undefined) {
    assert.string(options.algorithm, 'options.algorithm');
    alg = validateAlgorithm(options.algorithm);
  }
  this.rs_alg = alg;

  /*
   * RequestSigners come in two varieties: ones with an rs_signFunc, and ones
   * with an rs_signer.
   *
   * rs_signFunc-based RequestSigners have to build up their entire signing
   * string within the rs_lines array and give it to rs_signFunc as a single
   * concat'd blob. rs_signer-based RequestSigners can add a line at a time to
   * their signing state by using rs_signer.update(), thus only needing to
   * buffer the hash function state and one line at a time.
   */
  if (options.sign !== undefined) {
    assert.func(options.sign, 'options.sign');
    this.rs_signFunc = options.sign;

  } else if (alg[0] === 'hmac' && options.key !== undefined) {
    assert.string(options.keyId, 'options.keyId');
    this.rs_keyId = options.keyId;

    if (typeof (options.key) !== 'string' && !Buffer.isBuffer(options.key))
      throw (new TypeError('options.key for HMAC must be a string or Buffer'));

    /*
     * Make an rs_signer for HMACs, not a rs_signFunc -- HMACs digest their
     * data in chunks rather than requiring it all to be given in one go
     * at the end, so they are more similar to signers than signFuncs.
     */
    this.rs_signer = crypto.createHmac(alg[1].toUpperCase(), options.key);
    this.rs_signer.sign = function () {
      var digest = this.digest('base64');
      return ({
        hashAlgorithm: alg[1],
        toString: function () { return (digest); }
      });
    };

  } else if (options.key !== undefined) {
    var key = options.key;
    if (typeof (key) === 'string' || Buffer.isBuffer(key))
      key = sshpk.parsePrivateKey(key);

    assert.ok(sshpk.PrivateKey.isPrivateKey(key, [1, 2]),
      'options.key must be a sshpk.PrivateKey');
    this.rs_key = key;

    assert.string(options.keyId, 'options.keyId');
    this.rs_keyId = options.keyId;

    if (!PK_ALGOS[key.type]) {
      throw (new InvalidAlgorithmError(key.type.toUpperCase() + ' type ' +
        'keys are not supported'));
    }

    if (alg[0] !== undefined && key.type !== alg[0]) {
      throw (new InvalidAlgorithmError('options.key must be a ' +
        alg[0].toUpperCase() + ' key, was given a ' +
        key.type.toUpperCase() + ' key instead'));
    }

    this.rs_signer = key.createSign(alg[1]);

  } else {
    throw (new TypeError('options.sign (func) or options.key is required'));
  }

  this.rs_headers = [];
  this.rs_lines = [];
}

/**
 * Adds a header to be signed, with its value, into this signer.
 *
 * @param {String} header
 * @param {String} value
 * @return {String} value written
 */
RequestSigner.prototype.writeHeader = function (header, value) {
  assert.string(header, 'header');
  header = header.toLowerCase();
  assert.string(value, 'value');

  this.rs_headers.push(header);

  if (this.rs_signFunc) {
    this.rs_lines.push(header + ': ' + value);

  } else {
    var line = header + ': ' + value;
    if (this.rs_headers.length > 0)
      line = '\n' + line;
    this.rs_signer.update(line);
  }

  return (value);
};

/**
 * Adds a default Date header, returning its value.
 *
 * @return {String}
 */
RequestSigner.prototype.writeDateHeader = function () {
  return (this.writeHeader('date', jsprim.rfc1123(new Date())));
};

/**
 * Adds the request target line to be signed.
 *
 * @param {String} method, HTTP method (e.g. 'get', 'post', 'put')
 * @param {String} path
 */
RequestSigner.prototype.writeTarget = function (method, path) {
  assert.string(method, 'method');
  assert.string(path, 'path');
  method = method.toLowerCase();
  this.writeHeader('(request-target)', method + ' ' + path);
};

/**
 * Calculate the value for the Authorization header on this request
 * asynchronously.
 *
 * @param {Func} callback (err, authz)
 */
RequestSigner.prototype.sign = function (cb) {
  assert.func(cb, 'callback');

  if (this.rs_headers.length < 1)
    throw (new Error('At least one header must be signed'));

  var alg, authz;
  if (this.rs_signFunc) {
    var data = this.rs_lines.join('\n');
    var self = this;
    this.rs_signFunc(data, function (err, sig) {
      if (err) {
        cb(err);
        return;
      }
      try {
        assert.object(sig, 'signature');
        assert.string(sig.keyId, 'signature.keyId');
        assert.string(sig.algorithm, 'signature.algorithm');
        assert.string(sig.signature, 'signature.signature');
        alg = validateAlgorithm(sig.algorithm);

        authz = sprintf(AUTHZ_FMT,
          sig.keyId,
          sig.algorithm,
          self.rs_headers.join(' '),
          sig.signature);
      } catch (e) {
        cb(e);
        return;
      }
      cb(null, authz);
    });

  } else {
    try {
      var sigObj = this.rs_signer.sign();
    } catch (e) {
      cb(e);
      return;
    }
    alg = (this.rs_alg[0] || this.rs_key.type) + '-' + sigObj.hashAlgorithm;
    var signature = sigObj.toString();
    authz = sprintf(AUTHZ_FMT,
      this.rs_keyId,
      alg,
      this.rs_headers.join(' '),
      signature);
    cb(null, authz);
  }
};

///--- Exported API

module.exports = {
  /**
   * Identifies whether a given object is a request signer or not.
   *
   * @param {Object} object, the object to identify
   * @returns {Boolean}
   */
  isSigner: function (obj) {
    if (typeof (obj) === 'object' && obj instanceof RequestSigner)
      return (true);
    return (false);
  },

  /**
   * Creates a request signer, used to asynchronously build a signature
   * for a request (does not have to be an http.ClientRequest).
   *
   * @param {Object} options, either:
   *                   - {String} keyId
   *                   - {String|Buffer} key
   *                   - {String} algorithm (optional, required for HMAC)
   *                 or:
   *                   - {Func} sign (data, cb)
   * @return {RequestSigner}
   */
  createSigner: function createSigner(options) {
    return (new RequestSigner(options));
  },

  /**
   * Adds an 'Authorization' header to an http.ClientRequest object.
   *
   * Note that this API will add a Date header if it's not already set. Any
   * other headers in the options.headers array MUST be present, or this
   * will throw.
   *
   * You shouldn't need to check the return type; it's just there if you want
   * to be pedantic.
   *
   * The optional flag indicates whether parsing should use strict enforcement
   * of the version draft-cavage-http-signatures-04 of the spec or beyond.
   * The default is to be loose and support
   * older versions for compatibility.
   *
   * @param {Object} request an instance of http.ClientRequest.
   * @param {Object} options signing parameters object:
   *                   - {String} keyId required.
   *                   - {String} key required (either a PEM or HMAC key).
   *                   - {Array} headers optional; defaults to ['date'].
   *                   - {String} algorithm optional (unless key is HMAC);
   *                              default is the same as the sshpk default
   *                              signing algorithm for the type of key given
   *                   - {String} httpVersion optional; defaults to '1.1'.
   *                   - {Boolean} strict optional; defaults to 'false'.
   * @return {Boolean} true if Authorization (and optionally Date) were added.
   * @throws {TypeError} on bad parameter types (input).
   * @throws {InvalidAlgorithmError} if algorithm was bad or incompatible with
   *                                 the given key.
   * @throws {sshpk.KeyParseError} if key was bad.
   * @throws {MissingHeaderError} if a header to be signed was specified but
   *                              was not present.
   */
  signRequest: function signRequest(request, options) {
    assert.object(request, 'request');
    assert.object(options, 'options');
    assert.optionalString(options.algorithm, 'options.algorithm');
    assert.string(options.keyId, 'options.keyId');
    assert.optionalArrayOfString(options.headers, 'options.headers');
    assert.optionalString(options.httpVersion, 'options.httpVersion');

    if (!request.getHeader('Date'))
      request.setHeader('Date', jsprim.rfc1123(new Date()));
    if (!options.headers)
      options.headers = ['date'];
    if (!options.httpVersion)
      options.httpVersion = '1.1';

    var alg = [];
    if (options.algorithm) {
      options.algorithm = options.algorithm.toLowerCase();
      alg = validateAlgorithm(options.algorithm);
    }

    var i;
    var stringToSign = '';
    for (i = 0; i < options.headers.length; i++) {
      if (typeof (options.headers[i]) !== 'string')
        throw new TypeError('options.headers must be an array of Strings');

      var h = options.headers[i].toLowerCase();

      if (h === 'request-line') {
        if (!options.strict) {
          /**
           * We allow headers from the older spec drafts if strict parsing isn't
           * specified in options.
           */
          stringToSign +=
            request.method + ' ' + request.path + ' HTTP/' +
            options.httpVersion;
        } else {
          /* Strict parsing doesn't allow older draft headers. */
          throw (new StrictParsingError('request-line is not a valid header ' +
            'with strict parsing enabled.'));
        }
      } else if (h === '(request-target)') {
        stringToSign +=
          '(request-target): ' + request.method.toLowerCase() + ' ' +
          request.path;
      } else {
        var value = request.getHeader(h);
        if (value === undefined || value === '') {
          throw new MissingHeaderError(h + ' was not in the request');
        }
        stringToSign += h + ': ' + value;
      }

      if ((i + 1) < options.headers.length)
        stringToSign += '\n';
    }

    /* This is just for unit tests. */
    if (request.hasOwnProperty('_stringToSign')) {
      request._stringToSign = stringToSign;
    }

    var signature;
    if (alg[0] === 'hmac') {
      if (typeof (options.key) !== 'string' && !Buffer.isBuffer(options.key))
        throw (new TypeError('options.key must be a string or Buffer'));

      var hmac = crypto.createHmac(alg[1].toUpperCase(), options.key);
      hmac.update(stringToSign);
      signature = hmac.digest('base64');

    } else {
      var key = options.key;
      if (typeof (key) === 'string' || Buffer.isBuffer(key))
        key = sshpk.parsePrivateKey(options.key);

      assert.ok(sshpk.PrivateKey.isPrivateKey(key, [1, 2]),
        'options.key must be a sshpk.PrivateKey');

      if (!PK_ALGOS[key.type]) {
        throw (new InvalidAlgorithmError(key.type.toUpperCase() + ' type ' +
          'keys are not supported'));
      }

      if (alg[0] !== undefined && key.type !== alg[0]) {
        throw (new InvalidAlgorithmError('options.key must be a ' +
          alg[0].toUpperCase() + ' key, was given a ' +
          key.type.toUpperCase() + ' key instead'));
      }

      var signer = key.createSign(alg[1]);
      signer.update(stringToSign);
      var sigObj = signer.sign();
      if (!HASH_ALGOS[sigObj.hashAlgorithm]) {
        throw (new InvalidAlgorithmError(sigObj.hashAlgorithm.toUpperCase() +
          ' is not a supported hash algorithm'));
      }
      options.algorithm = key.type + '-' + sigObj.hashAlgorithm;
      signature = sigObj.toString();
      assert.notStrictEqual(signature, '', 'empty signature produced');
    }

    var authzHeaderName = options.authorizationHeaderName || 'Authorization';

    request.setHeader(authzHeaderName, sprintf(AUTHZ_FMT,
                                               options.keyId,
                                               options.algorithm,
                                               options.headers.join(' '),
                                               signature));

    return true;
  }

};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "tjlA").Buffer))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaHR0cC1zaWduYXR1cmUvbGliL3V0aWxzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9odHRwLXNpZ25hdHVyZS9saWIvcGFyc2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9odHRwLXNpZ25hdHVyZS9saWIvdmVyaWZ5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9odHRwLXNpZ25hdHVyZS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2h0dHAtc2lnbmF0dXJlL2xpYi9zaWduZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLHlCQUFhO0FBQ2xDLFlBQVksbUJBQU8sQ0FBQyxtQkFBTztBQUMzQixXQUFXLG1CQUFPLENBQUMsa0JBQU07O0FBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsVUFBVTtBQUN4QixjQUFjLE1BQU07QUFDcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsVUFBVTtBQUN4QixjQUFjLE1BQU07QUFDcEI7QUFDQTtBQUNBOztBQUVBO0FB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QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLDRCQUE0QjtBQUMzQztBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5odHRwLXNpZ25hdHVyZS41ZjgwZTA3YTQ3Y2Y3MjBkNjBkZS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyIEpveWVudCwgSW5jLiAgQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XG52YXIgc3NocGsgPSByZXF1aXJlKCdzc2hwaycpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbnZhciBIQVNIX0FMR09TID0ge1xuICAnc2hhMSc6IHRydWUsXG4gICdzaGEyNTYnOiB0cnVlLFxuICAnc2hhNTEyJzogdHJ1ZVxufTtcblxudmFyIFBLX0FMR09TID0ge1xuICAncnNhJzogdHJ1ZSxcbiAgJ2RzYSc6IHRydWUsXG4gICdlY2RzYSc6IHRydWVcbn07XG5cbmZ1bmN0aW9uIEh0dHBTaWduYXR1cmVFcnJvcihtZXNzYWdlLCBjYWxsZXIpIHtcbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIGNhbGxlciB8fCBIdHRwU2lnbmF0dXJlRXJyb3IpO1xuXG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIHRoaXMubmFtZSA9IGNhbGxlci5uYW1lO1xufVxudXRpbC5pbmhlcml0cyhIdHRwU2lnbmF0dXJlRXJyb3IsIEVycm9yKTtcblxuZnVuY3Rpb24gSW52YWxpZEFsZ29yaXRobUVycm9yKG1lc3NhZ2UpIHtcbiAgSHR0cFNpZ25hdHVyZUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSwgSW52YWxpZEFsZ29yaXRobUVycm9yKTtcbn1cbnV0aWwuaW5oZXJpdHMoSW52YWxpZEFsZ29yaXRobUVycm9yLCBIdHRwU2lnbmF0dXJlRXJyb3IpO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZUFsZ29yaXRobShhbGdvcml0aG0pIHtcbiAgdmFyIGFsZyA9IGFsZ29yaXRobS50b0xvd2VyQ2FzZSgpLnNwbGl0KCctJyk7XG5cbiAgaWYgKGFsZy5sZW5ndGggIT09IDIpIHtcbiAgICB0aHJvdyAobmV3IEludmFsaWRBbGdvcml0aG1FcnJvcihhbGdbMF0udG9VcHBlckNhc2UoKSArICcgaXMgbm90IGEgJyArXG4gICAgICAndmFsaWQgYWxnb3JpdGhtJykpO1xuICB9XG5cbiAgaWYgKGFsZ1swXSAhPT0gJ2htYWMnICYmICFQS19BTEdPU1thbGdbMF1dKSB7XG4gICAgdGhyb3cgKG5ldyBJbnZhbGlkQWxnb3JpdGhtRXJyb3IoYWxnWzBdLnRvVXBwZXJDYXNlKCkgKyAnIHR5cGUga2V5cyAnICtcbiAgICAgICdhcmUgbm90IHN1cHBvcnRlZCcpKTtcbiAgfVxuXG4gIGlmICghSEFTSF9BTEdPU1thbGdbMV1dKSB7XG4gICAgdGhyb3cgKG5ldyBJbnZhbGlkQWxnb3JpdGhtRXJyb3IoYWxnWzFdLnRvVXBwZXJDYXNlKCkgKyAnIGlzIG5vdCBhICcgK1xuICAgICAgJ3N1cHBvcnRlZCBoYXNoIGFsZ29yaXRobScpKTtcbiAgfVxuXG4gIHJldHVybiAoYWxnKTtcbn1cblxuLy8vLS0tIEFQSVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBIQVNIX0FMR09TOiBIQVNIX0FMR09TLFxuICBQS19BTEdPUzogUEtfQUxHT1MsXG5cbiAgSHR0cFNpZ25hdHVyZUVycm9yOiBIdHRwU2lnbmF0dXJlRXJyb3IsXG4gIEludmFsaWRBbGdvcml0aG1FcnJvcjogSW52YWxpZEFsZ29yaXRobUVycm9yLFxuXG4gIHZhbGlkYXRlQWxnb3JpdGhtOiB2YWxpZGF0ZUFsZ29yaXRobSxcblxuICAvKipcbiAgICogQ29udmVydHMgYW4gT3BlblNTSCBwdWJsaWMga2V5IChyc2Egb25seSkgdG8gYSBQS0NTIzggUEVNIGZpbGUuXG4gICAqXG4gICAqIFRoZSBpbnRlbnQgb2YgdGhpcyBtb2R1bGUgaXMgdG8gaW50ZXJvcGVyYXRlIHdpdGggT3BlblNTTCBvbmx5LFxuICAgKiBzcGVjaWZpY2FsbHkgdGhlIG5vZGUgY3J5cHRvIG1vZHVsZSdzIGB2ZXJpZnlgIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBhbiBPcGVuU1NIIHB1YmxpYyBrZXkuXG4gICAqIEByZXR1cm4ge1N0cmluZ30gUEVNIGVuY29kZWQgZm9ybSBvZiB0aGUgUlNBIHB1YmxpYyBrZXkuXG4gICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gb24gYmFkIGlucHV0LlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gb24gaW52YWxpZCBzc2gga2V5IGZvcm1hdHRlZCBkYXRhLlxuICAgKi9cbiAgc3NoS2V5VG9QRU06IGZ1bmN0aW9uIHNzaEtleVRvUEVNKGtleSkge1xuICAgIGFzc2VydC5zdHJpbmcoa2V5LCAnc3NoX2tleScpO1xuXG4gICAgdmFyIGsgPSBzc2hway5wYXJzZUtleShrZXksICdzc2gnKTtcbiAgICByZXR1cm4gKGsudG9TdHJpbmcoJ3BlbScpKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYW4gT3BlblNTSCBmaW5nZXJwcmludCBmcm9tIGFuIHNzaCBwdWJsaWMga2V5LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IGFuIE9wZW5TU0ggcHVibGljIGtleS5cbiAgICogQHJldHVybiB7U3RyaW5nfSBrZXkgZmluZ2VycHJpbnQuXG4gICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gb24gYmFkIGlucHV0LlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gaWYgd2hhdCB5b3UgcGFzc2VkIGRvZXNuJ3QgbG9vayBsaWtlIGFuIHNzaCBwdWJsaWMga2V5LlxuICAgKi9cbiAgZmluZ2VycHJpbnQ6IGZ1bmN0aW9uIGZpbmdlcnByaW50KGtleSkge1xuICAgIGFzc2VydC5zdHJpbmcoa2V5LCAnc3NoX2tleScpO1xuXG4gICAgdmFyIGsgPSBzc2hway5wYXJzZUtleShrZXksICdzc2gnKTtcbiAgICByZXR1cm4gKGsuZmluZ2VycHJpbnQoJ21kNScpLnRvU3RyaW5nKCdoZXgnKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgUEtHQ1MjOCBQRU0gZmlsZSB0byBhbiBPcGVuU1NIIHB1YmxpYyBrZXkgKHJzYSlcbiAgICpcbiAgICogVGhlIHJldmVyc2Ugb2YgdGhlIGFib3ZlIGZ1bmN0aW9uLlxuICAgKi9cbiAgcGVtVG9Sc2FTU0hLZXk6IGZ1bmN0aW9uIHBlbVRvUnNhU1NIS2V5KHBlbSwgY29tbWVudCkge1xuICAgIGFzc2VydC5lcXVhbCgnc3RyaW5nJywgdHlwZW9mIChwZW0pLCAndHlwZW9mIHBlbScpO1xuXG4gICAgdmFyIGsgPSBzc2hway5wYXJzZUtleShwZW0sICdwZW0nKTtcbiAgICBrLmNvbW1lbnQgPSBjb21tZW50O1xuICAgIHJldHVybiAoay50b1N0cmluZygnc3NoJykpO1xuICB9XG59O1xuIiwiLy8gQ29weXJpZ2h0IDIwMTIgSm95ZW50LCBJbmMuICBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5cblxuLy8vLS0tIEdsb2JhbHNcblxudmFyIEhBU0hfQUxHT1MgPSB1dGlscy5IQVNIX0FMR09TO1xudmFyIFBLX0FMR09TID0gdXRpbHMuUEtfQUxHT1M7XG52YXIgSHR0cFNpZ25hdHVyZUVycm9yID0gdXRpbHMuSHR0cFNpZ25hdHVyZUVycm9yO1xudmFyIEludmFsaWRBbGdvcml0aG1FcnJvciA9IHV0aWxzLkludmFsaWRBbGdvcml0aG1FcnJvcjtcbnZhciB2YWxpZGF0ZUFsZ29yaXRobSA9IHV0aWxzLnZhbGlkYXRlQWxnb3JpdGhtO1xuXG52YXIgU3RhdGUgPSB7XG4gIE5ldzogMCxcbiAgUGFyYW1zOiAxXG59O1xuXG52YXIgUGFyYW1zU3RhdGUgPSB7XG4gIE5hbWU6IDAsXG4gIFF1b3RlOiAxLFxuICBWYWx1ZTogMixcbiAgQ29tbWE6IDNcbn07XG5cblxuLy8vLS0tIFNwZWNpZmljIEVycm9yc1xuXG5cbmZ1bmN0aW9uIEV4cGlyZWRSZXF1ZXN0RXJyb3IobWVzc2FnZSkge1xuICBIdHRwU2lnbmF0dXJlRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlLCBFeHBpcmVkUmVxdWVzdEVycm9yKTtcbn1cbnV0aWwuaW5oZXJpdHMoRXhwaXJlZFJlcXVlc3RFcnJvciwgSHR0cFNpZ25hdHVyZUVycm9yKTtcblxuXG5mdW5jdGlvbiBJbnZhbGlkSGVhZGVyRXJyb3IobWVzc2FnZSkge1xuICBIdHRwU2lnbmF0dXJlRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlLCBJbnZhbGlkSGVhZGVyRXJyb3IpO1xufVxudXRpbC5pbmhlcml0cyhJbnZhbGlkSGVhZGVyRXJyb3IsIEh0dHBTaWduYXR1cmVFcnJvcik7XG5cblxuZnVuY3Rpb24gSW52YWxpZFBhcmFtc0Vycm9yKG1lc3NhZ2UpIHtcbiAgSHR0cFNpZ25hdHVyZUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSwgSW52YWxpZFBhcmFtc0Vycm9yKTtcbn1cbnV0aWwuaW5oZXJpdHMoSW52YWxpZFBhcmFtc0Vycm9yLCBIdHRwU2lnbmF0dXJlRXJyb3IpO1xuXG5cbmZ1bmN0aW9uIE1pc3NpbmdIZWFkZXJFcnJvcihtZXNzYWdlKSB7XG4gIEh0dHBTaWduYXR1cmVFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UsIE1pc3NpbmdIZWFkZXJFcnJvcik7XG59XG51dGlsLmluaGVyaXRzKE1pc3NpbmdIZWFkZXJFcnJvciwgSHR0cFNpZ25hdHVyZUVycm9yKTtcblxuZnVuY3Rpb24gU3RyaWN0UGFyc2luZ0Vycm9yKG1lc3NhZ2UpIHtcbiAgSHR0cFNpZ25hdHVyZUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSwgU3RyaWN0UGFyc2luZ0Vycm9yKTtcbn1cbnV0aWwuaW5oZXJpdHMoU3RyaWN0UGFyc2luZ0Vycm9yLCBIdHRwU2lnbmF0dXJlRXJyb3IpO1xuXG4vLy8tLS0gRXhwb3J0ZWQgQVBJXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIC8qKlxuICAgKiBQYXJzZXMgdGhlICdBdXRob3JpemF0aW9uJyBoZWFkZXIgb3V0IG9mIGFuIGh0dHAuU2VydmVyUmVxdWVzdCBvYmplY3QuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGlzIEFQSSB3aWxsIGZ1bGx5IHZhbGlkYXRlIHRoZSBBdXRob3JpemF0aW9uIGhlYWRlciwgYW5kIHRocm93XG4gICAqIG9uIGFueSBlcnJvci4gIEl0IHdpbGwgbm90IGhvd2V2ZXIgY2hlY2sgdGhlIHNpZ25hdHVyZSwgb3IgdGhlIGtleUlkIGZvcm1hdFxuICAgKiBhcyB0aG9zZSBhcmUgc3BlY2lmaWMgdG8geW91ciBlbnZpcm9ubWVudC4gIFlvdSBjYW4gdXNlIHRoZSBvcHRpb25zIG9iamVjdFxuICAgKiB0byBwYXNzIGluIGV4dHJhIGNvbnN0cmFpbnRzLlxuICAgKlxuICAgKiBBcyBhIHJlc3BvbnNlIG9iamVjdCB5b3UgY2FuIGV4cGVjdCB0aGlzOlxuICAgKlxuICAgKiAgICAge1xuICAgKiAgICAgICBcInNjaGVtZVwiOiBcIlNpZ25hdHVyZVwiLFxuICAgKiAgICAgICBcInBhcmFtc1wiOiB7XG4gICAqICAgICAgICAgXCJrZXlJZFwiOiBcImZvb1wiLFxuICAgKiAgICAgICAgIFwiYWxnb3JpdGhtXCI6IFwicnNhLXNoYTI1NlwiLFxuICAgKiAgICAgICAgIFwiaGVhZGVyc1wiOiBbXG4gICAqICAgICAgICAgICBcImRhdGVcIiBvciBcIngtZGF0ZVwiLFxuICAgKiAgICAgICAgICAgXCJkaWdlc3RcIlxuICAgKiAgICAgICAgIF0sXG4gICAqICAgICAgICAgXCJzaWduYXR1cmVcIjogXCJiYXNlNjRcIlxuICAgKiAgICAgICB9LFxuICAgKiAgICAgICBcInNpZ25pbmdTdHJpbmdcIjogXCJyZWFkeSB0byBiZSBwYXNzZWQgdG8gY3J5cHRvLnZlcmlmeSgpXCJcbiAgICogICAgIH1cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3QgYW4gaHR0cC5TZXJ2ZXJSZXF1ZXN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBhbiBvcHRpb25hbCBvcHRpb25zIG9iamVjdCB3aXRoOlxuICAgKiAgICAgICAgICAgICAgICAgICAtIGNsb2NrU2tldzogYWxsb3dlZCBjbG9jayBza2V3IGluIHNlY29uZHMgKGRlZmF1bHQgMzAwKS5cbiAgICogICAgICAgICAgICAgICAgICAgLSBoZWFkZXJzOiByZXF1aXJlZCBoZWFkZXIgbmFtZXMgKGRlZjogZGF0ZSBvciB4LWRhdGUpXG4gICAqICAgICAgICAgICAgICAgICAgIC0gYWxnb3JpdGhtczogYWxnb3JpdGhtcyB0byBzdXBwb3J0IChkZWZhdWx0OiBhbGwpLlxuICAgKiAgICAgICAgICAgICAgICAgICAtIHN0cmljdDogc2hvdWxkIGVuZm9yY2UgbGF0ZXN0IHNwZWMgcGFyc2luZ1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGRlZmF1bHQ6IGZhbHNlKS5cbiAgICogQHJldHVybiB7T2JqZWN0fSBwYXJzZWQgb3V0IG9iamVjdCAoc2VlIGFib3ZlKS5cbiAgICogQHRocm93cyB7VHlwZUVycm9yfSBvbiBpbnZhbGlkIGlucHV0LlxuICAgKiBAdGhyb3dzIHtJbnZhbGlkSGVhZGVyRXJyb3J9IG9uIGFuIGludmFsaWQgQXV0aG9yaXphdGlvbiBoZWFkZXIgZXJyb3IuXG4gICAqIEB0aHJvd3Mge0ludmFsaWRQYXJhbXNFcnJvcn0gaWYgdGhlIHBhcmFtcyBpbiB0aGUgc2NoZW1lIGFyZSBpbnZhbGlkLlxuICAgKiBAdGhyb3dzIHtNaXNzaW5nSGVhZGVyRXJyb3J9IGlmIHRoZSBwYXJhbXMgaW5kaWNhdGUgYSBoZWFkZXIgbm90IHByZXNlbnQsXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWl0aGVyIGluIHRoZSByZXF1ZXN0IGhlYWRlcnMgZnJvbSB0aGUgcGFyYW1zLFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yIG5vdCBpbiB0aGUgcGFyYW1zIGZyb20gYSByZXF1aXJlZCBoZWFkZXJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbiBvcHRpb25zLlxuICAgKiBAdGhyb3dzIHtTdHJpY3RQYXJzaW5nRXJyb3J9IGlmIG9sZCBhdHRyaWJ1dGVzIGFyZSB1c2VkIGluIHN0cmljdCBwYXJzaW5nXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZS5cbiAgICogQHRocm93cyB7RXhwaXJlZFJlcXVlc3RFcnJvcn0gaWYgdGhlIHZhbHVlIG9mIGRhdGUgb3IgeC1kYXRlIGV4Y2VlZHMgc2tldy5cbiAgICovXG4gIHBhcnNlUmVxdWVzdDogZnVuY3Rpb24gcGFyc2VSZXF1ZXN0KHJlcXVlc3QsIG9wdGlvbnMpIHtcbiAgICBhc3NlcnQub2JqZWN0KHJlcXVlc3QsICdyZXF1ZXN0Jyk7XG4gICAgYXNzZXJ0Lm9iamVjdChyZXF1ZXN0LmhlYWRlcnMsICdyZXF1ZXN0LmhlYWRlcnMnKTtcbiAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmhlYWRlcnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0aW9ucy5oZWFkZXJzID0gW3JlcXVlc3QuaGVhZGVyc1sneC1kYXRlJ10gPyAneC1kYXRlJyA6ICdkYXRlJ107XG4gICAgfVxuICAgIGFzc2VydC5vYmplY3Qob3B0aW9ucywgJ29wdGlvbnMnKTtcbiAgICBhc3NlcnQuYXJyYXlPZlN0cmluZyhvcHRpb25zLmhlYWRlcnMsICdvcHRpb25zLmhlYWRlcnMnKTtcbiAgICBhc3NlcnQub3B0aW9uYWxGaW5pdGUob3B0aW9ucy5jbG9ja1NrZXcsICdvcHRpb25zLmNsb2NrU2tldycpO1xuXG4gICAgdmFyIGF1dGh6SGVhZGVyTmFtZSA9IG9wdGlvbnMuYXV0aG9yaXphdGlvbkhlYWRlck5hbWUgfHwgJ2F1dGhvcml6YXRpb24nO1xuXG4gICAgaWYgKCFyZXF1ZXN0LmhlYWRlcnNbYXV0aHpIZWFkZXJOYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IE1pc3NpbmdIZWFkZXJFcnJvcignbm8gJyArIGF1dGh6SGVhZGVyTmFtZSArICcgaGVhZGVyICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncHJlc2VudCBpbiB0aGUgcmVxdWVzdCcpO1xuICAgIH1cblxuICAgIG9wdGlvbnMuY2xvY2tTa2V3ID0gb3B0aW9ucy5jbG9ja1NrZXcgfHwgMzAwO1xuXG5cbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIHN0YXRlID0gU3RhdGUuTmV3O1xuICAgIHZhciBzdWJzdGF0ZSA9IFBhcmFtc1N0YXRlLk5hbWU7XG4gICAgdmFyIHRtcE5hbWUgPSAnJztcbiAgICB2YXIgdG1wVmFsdWUgPSAnJztcblxuICAgIHZhciBwYXJzZWQgPSB7XG4gICAgICBzY2hlbWU6ICcnLFxuICAgICAgcGFyYW1zOiB7fSxcbiAgICAgIHNpZ25pbmdTdHJpbmc6ICcnXG4gICAgfTtcblxuICAgIHZhciBhdXRoeiA9IHJlcXVlc3QuaGVhZGVyc1thdXRoekhlYWRlck5hbWVdO1xuICAgIGZvciAoaSA9IDA7IGkgPCBhdXRoei5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGMgPSBhdXRoei5jaGFyQXQoaSk7XG5cbiAgICAgIHN3aXRjaCAoTnVtYmVyKHN0YXRlKSkge1xuXG4gICAgICBjYXNlIFN0YXRlLk5ldzpcbiAgICAgICAgaWYgKGMgIT09ICcgJykgcGFyc2VkLnNjaGVtZSArPSBjO1xuICAgICAgICBlbHNlIHN0YXRlID0gU3RhdGUuUGFyYW1zO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTdGF0ZS5QYXJhbXM6XG4gICAgICAgIHN3aXRjaCAoTnVtYmVyKHN1YnN0YXRlKSkge1xuXG4gICAgICAgIGNhc2UgUGFyYW1zU3RhdGUuTmFtZTpcbiAgICAgICAgICB2YXIgY29kZSA9IGMuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAvLyByZXN0cmljdGVkIG5hbWUgb2YgQS1aIC8gYS16XG4gICAgICAgICAgaWYgKChjb2RlID49IDB4NDEgJiYgY29kZSA8PSAweDVhKSB8fCAvLyBBLVpcbiAgICAgICAgICAgICAgKGNvZGUgPj0gMHg2MSAmJiBjb2RlIDw9IDB4N2EpKSB7IC8vIGEtelxuICAgICAgICAgICAgdG1wTmFtZSArPSBjO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJz0nKSB7XG4gICAgICAgICAgICBpZiAodG1wTmFtZS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkSGVhZGVyRXJyb3IoJ2JhZCBwYXJhbSBmb3JtYXQnKTtcbiAgICAgICAgICAgIHN1YnN0YXRlID0gUGFyYW1zU3RhdGUuUXVvdGU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkSGVhZGVyRXJyb3IoJ2JhZCBwYXJhbSBmb3JtYXQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBQYXJhbXNTdGF0ZS5RdW90ZTpcbiAgICAgICAgICBpZiAoYyA9PT0gJ1wiJykge1xuICAgICAgICAgICAgdG1wVmFsdWUgPSAnJztcbiAgICAgICAgICAgIHN1YnN0YXRlID0gUGFyYW1zU3RhdGUuVmFsdWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkSGVhZGVyRXJyb3IoJ2JhZCBwYXJhbSBmb3JtYXQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBQYXJhbXNTdGF0ZS5WYWx1ZTpcbiAgICAgICAgICBpZiAoYyA9PT0gJ1wiJykge1xuICAgICAgICAgICAgcGFyc2VkLnBhcmFtc1t0bXBOYW1lXSA9IHRtcFZhbHVlO1xuICAgICAgICAgICAgc3Vic3RhdGUgPSBQYXJhbXNTdGF0ZS5Db21tYTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG1wVmFsdWUgKz0gYztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBQYXJhbXNTdGF0ZS5Db21tYTpcbiAgICAgICAgICBpZiAoYyA9PT0gJywnKSB7XG4gICAgICAgICAgICB0bXBOYW1lID0gJyc7XG4gICAgICAgICAgICBzdWJzdGF0ZSA9IFBhcmFtc1N0YXRlLk5hbWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkSGVhZGVyRXJyb3IoJ2JhZCBwYXJhbSBmb3JtYXQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3Vic3RhdGUnKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN1YnN0YXRlJyk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBpZiAoIXBhcnNlZC5wYXJhbXMuaGVhZGVycyB8fCBwYXJzZWQucGFyYW1zLmhlYWRlcnMgPT09ICcnKSB7XG4gICAgICBpZiAocmVxdWVzdC5oZWFkZXJzWyd4LWRhdGUnXSkge1xuICAgICAgICBwYXJzZWQucGFyYW1zLmhlYWRlcnMgPSBbJ3gtZGF0ZSddO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkLnBhcmFtcy5oZWFkZXJzID0gWydkYXRlJ107XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnNlZC5wYXJhbXMuaGVhZGVycyA9IHBhcnNlZC5wYXJhbXMuaGVhZGVycy5zcGxpdCgnICcpO1xuICAgIH1cblxuICAgIC8vIE1pbmltYWxseSB2YWxpZGF0ZSB0aGUgcGFyc2VkIG9iamVjdFxuICAgIGlmICghcGFyc2VkLnNjaGVtZSB8fCBwYXJzZWQuc2NoZW1lICE9PSAnU2lnbmF0dXJlJylcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkSGVhZGVyRXJyb3IoJ3NjaGVtZSB3YXMgbm90IFwiU2lnbmF0dXJlXCInKTtcblxuICAgIGlmICghcGFyc2VkLnBhcmFtcy5rZXlJZClcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkSGVhZGVyRXJyb3IoJ2tleUlkIHdhcyBub3Qgc3BlY2lmaWVkJyk7XG5cbiAgICBpZiAoIXBhcnNlZC5wYXJhbXMuYWxnb3JpdGhtKVxuICAgICAgdGhyb3cgbmV3IEludmFsaWRIZWFkZXJFcnJvcignYWxnb3JpdGhtIHdhcyBub3Qgc3BlY2lmaWVkJyk7XG5cbiAgICBpZiAoIXBhcnNlZC5wYXJhbXMuc2lnbmF0dXJlKVxuICAgICAgdGhyb3cgbmV3IEludmFsaWRIZWFkZXJFcnJvcignc2lnbmF0dXJlIHdhcyBub3Qgc3BlY2lmaWVkJyk7XG5cbiAgICAvLyBDaGVjayB0aGUgYWxnb3JpdGhtIGFnYWluc3QgdGhlIG9mZmljaWFsIGxpc3RcbiAgICBwYXJzZWQucGFyYW1zLmFsZ29yaXRobSA9IHBhcnNlZC5wYXJhbXMuYWxnb3JpdGhtLnRvTG93ZXJDYXNlKCk7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRlQWxnb3JpdGhtKHBhcnNlZC5wYXJhbXMuYWxnb3JpdGhtKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEludmFsaWRBbGdvcml0aG1FcnJvcilcbiAgICAgICAgdGhyb3cgKG5ldyBJbnZhbGlkUGFyYW1zRXJyb3IocGFyc2VkLnBhcmFtcy5hbGdvcml0aG0gKyAnIGlzIG5vdCAnICtcbiAgICAgICAgICAnc3VwcG9ydGVkJykpO1xuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyAoZSk7XG4gICAgfVxuXG4gICAgLy8gQnVpbGQgdGhlIHNpZ25pbmdTdHJpbmdcbiAgICBmb3IgKGkgPSAwOyBpIDwgcGFyc2VkLnBhcmFtcy5oZWFkZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaCA9IHBhcnNlZC5wYXJhbXMuaGVhZGVyc1tpXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcGFyc2VkLnBhcmFtcy5oZWFkZXJzW2ldID0gaDtcblxuICAgICAgaWYgKGggPT09ICdyZXF1ZXN0LWxpbmUnKSB7XG4gICAgICAgIGlmICghb3B0aW9ucy5zdHJpY3QpIHtcbiAgICAgICAgICAvKlxuICAgICAgICAgICAqIFdlIGFsbG93IGhlYWRlcnMgZnJvbSB0aGUgb2xkZXIgc3BlYyBkcmFmdHMgaWYgc3RyaWN0IHBhcnNpbmcgaXNuJ3RcbiAgICAgICAgICAgKiBzcGVjaWZpZWQgaW4gb3B0aW9ucy5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBwYXJzZWQuc2lnbmluZ1N0cmluZyArPVxuICAgICAgICAgICAgcmVxdWVzdC5tZXRob2QgKyAnICcgKyByZXF1ZXN0LnVybCArICcgSFRUUC8nICsgcmVxdWVzdC5odHRwVmVyc2lvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvKiBTdHJpY3QgcGFyc2luZyBkb2Vzbid0IGFsbG93IG9sZGVyIGRyYWZ0IGhlYWRlcnMuICovXG4gICAgICAgICAgdGhyb3cgKG5ldyBTdHJpY3RQYXJzaW5nRXJyb3IoJ3JlcXVlc3QtbGluZSBpcyBub3QgYSB2YWxpZCBoZWFkZXIgJyArXG4gICAgICAgICAgICAnd2l0aCBzdHJpY3QgcGFyc2luZyBlbmFibGVkLicpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChoID09PSAnKHJlcXVlc3QtdGFyZ2V0KScpIHtcbiAgICAgICAgcGFyc2VkLnNpZ25pbmdTdHJpbmcgKz1cbiAgICAgICAgICAnKHJlcXVlc3QtdGFyZ2V0KTogJyArIHJlcXVlc3QubWV0aG9kLnRvTG93ZXJDYXNlKCkgKyAnICcgK1xuICAgICAgICAgIHJlcXVlc3QudXJsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcmVxdWVzdC5oZWFkZXJzW2hdO1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICB0aHJvdyBuZXcgTWlzc2luZ0hlYWRlckVycm9yKGggKyAnIHdhcyBub3QgaW4gdGhlIHJlcXVlc3QnKTtcbiAgICAgICAgcGFyc2VkLnNpZ25pbmdTdHJpbmcgKz0gaCArICc6ICcgKyB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKChpICsgMSkgPCBwYXJzZWQucGFyYW1zLmhlYWRlcnMubGVuZ3RoKVxuICAgICAgICBwYXJzZWQuc2lnbmluZ1N0cmluZyArPSAnXFxuJztcbiAgICB9XG5cbiAgICAvLyBDaGVjayBhZ2FpbnN0IHRoZSBjb25zdHJhaW50c1xuICAgIHZhciBkYXRlO1xuICAgIGlmIChyZXF1ZXN0LmhlYWRlcnMuZGF0ZSB8fCByZXF1ZXN0LmhlYWRlcnNbJ3gtZGF0ZSddKSB7XG4gICAgICAgIGlmIChyZXF1ZXN0LmhlYWRlcnNbJ3gtZGF0ZSddKSB7XG4gICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKHJlcXVlc3QuaGVhZGVyc1sneC1kYXRlJ10pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZShyZXF1ZXN0LmhlYWRlcnMuZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgdmFyIHNrZXcgPSBNYXRoLmFicyhub3cuZ2V0VGltZSgpIC0gZGF0ZS5nZXRUaW1lKCkpO1xuXG4gICAgICBpZiAoc2tldyA+IG9wdGlvbnMuY2xvY2tTa2V3ICogMTAwMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXhwaXJlZFJlcXVlc3RFcnJvcignY2xvY2sgc2tldyBvZiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNrZXcgLyAxMDAwKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzIHdhcyBncmVhdGVyIHRoYW4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY2xvY2tTa2V3ICsgJ3MnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvcHRpb25zLmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGRyKSB7XG4gICAgICAvLyBSZW1lbWJlciB0aGF0IHdlIGFscmVhZHkgY2hlY2tlZCBhbnkgaGVhZGVycyBpbiB0aGUgcGFyYW1zXG4gICAgICAvLyB3ZXJlIGluIHRoZSByZXF1ZXN0LCBzbyBpZiB0aGlzIHBhc3NlcyB3ZSdyZSBnb29kLlxuICAgICAgaWYgKHBhcnNlZC5wYXJhbXMuaGVhZGVycy5pbmRleE9mKGhkci50b0xvd2VyQ2FzZSgpKSA8IDApXG4gICAgICAgIHRocm93IG5ldyBNaXNzaW5nSGVhZGVyRXJyb3IoaGRyICsgJyB3YXMgbm90IGEgc2lnbmVkIGhlYWRlcicpO1xuICAgIH0pO1xuXG4gICAgaWYgKG9wdGlvbnMuYWxnb3JpdGhtcykge1xuICAgICAgaWYgKG9wdGlvbnMuYWxnb3JpdGhtcy5pbmRleE9mKHBhcnNlZC5wYXJhbXMuYWxnb3JpdGhtKSA9PT0gLTEpXG4gICAgICAgIHRocm93IG5ldyBJbnZhbGlkUGFyYW1zRXJyb3IocGFyc2VkLnBhcmFtcy5hbGdvcml0aG0gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgaXMgbm90IGEgc3VwcG9ydGVkIGFsZ29yaXRobScpO1xuICAgIH1cblxuICAgIHBhcnNlZC5hbGdvcml0aG0gPSBwYXJzZWQucGFyYW1zLmFsZ29yaXRobS50b1VwcGVyQ2FzZSgpO1xuICAgIHBhcnNlZC5rZXlJZCA9IHBhcnNlZC5wYXJhbXMua2V5SWQ7XG4gICAgcmV0dXJuIHBhcnNlZDtcbiAgfVxuXG59O1xuIiwiLy8gQ29weXJpZ2h0IDIwMTUgSm95ZW50LCBJbmMuXG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQtcGx1cycpO1xudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xudmFyIHNzaHBrID0gcmVxdWlyZSgnc3NocGsnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIEhBU0hfQUxHT1MgPSB1dGlscy5IQVNIX0FMR09TO1xudmFyIFBLX0FMR09TID0gdXRpbHMuUEtfQUxHT1M7XG52YXIgSW52YWxpZEFsZ29yaXRobUVycm9yID0gdXRpbHMuSW52YWxpZEFsZ29yaXRobUVycm9yO1xudmFyIEh0dHBTaWduYXR1cmVFcnJvciA9IHV0aWxzLkh0dHBTaWduYXR1cmVFcnJvcjtcbnZhciB2YWxpZGF0ZUFsZ29yaXRobSA9IHV0aWxzLnZhbGlkYXRlQWxnb3JpdGhtO1xuXG4vLy8tLS0gRXhwb3J0ZWQgQVBJXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvKipcbiAgICogVmVyaWZ5IFJTQS9EU0Egc2lnbmF0dXJlIGFnYWluc3QgcHVibGljIGtleS4gIFlvdSBhcmUgZXhwZWN0ZWQgdG8gcGFzcyBpblxuICAgKiBhbiBvYmplY3QgdGhhdCB3YXMgcmV0dXJuZWQgZnJvbSBgcGFyc2UoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJzZWRTaWduYXR1cmUgdGhlIG9iamVjdCB5b3UgZ290IGZyb20gYHBhcnNlYC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHB1YmtleSBSU0EvRFNBIHByaXZhdGUga2V5IFBFTS5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB2YWxpZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IGlmIHlvdSBwYXNzIGluIGJhZCBhcmd1bWVudHMuXG4gICAqIEB0aHJvd3Mge0ludmFsaWRBbGdvcml0aG1FcnJvcn1cbiAgICovXG4gIHZlcmlmeVNpZ25hdHVyZTogZnVuY3Rpb24gdmVyaWZ5U2lnbmF0dXJlKHBhcnNlZFNpZ25hdHVyZSwgcHVia2V5KSB7XG4gICAgYXNzZXJ0Lm9iamVjdChwYXJzZWRTaWduYXR1cmUsICdwYXJzZWRTaWduYXR1cmUnKTtcbiAgICBpZiAodHlwZW9mIChwdWJrZXkpID09PSAnc3RyaW5nJyB8fCBCdWZmZXIuaXNCdWZmZXIocHVia2V5KSlcbiAgICAgIHB1YmtleSA9IHNzaHBrLnBhcnNlS2V5KHB1YmtleSk7XG4gICAgYXNzZXJ0Lm9rKHNzaHBrLktleS5pc0tleShwdWJrZXksIFsxLCAxXSksICdwdWJrZXkgbXVzdCBiZSBhIHNzaHBrLktleScpO1xuXG4gICAgdmFyIGFsZyA9IHZhbGlkYXRlQWxnb3JpdGhtKHBhcnNlZFNpZ25hdHVyZS5hbGdvcml0aG0pO1xuICAgIGlmIChhbGdbMF0gPT09ICdobWFjJyB8fCBhbGdbMF0gIT09IHB1YmtleS50eXBlKVxuICAgICAgcmV0dXJuIChmYWxzZSk7XG5cbiAgICB2YXIgdiA9IHB1YmtleS5jcmVhdGVWZXJpZnkoYWxnWzFdKTtcbiAgICB2LnVwZGF0ZShwYXJzZWRTaWduYXR1cmUuc2lnbmluZ1N0cmluZyk7XG4gICAgcmV0dXJuICh2LnZlcmlmeShwYXJzZWRTaWduYXR1cmUucGFyYW1zLnNpZ25hdHVyZSwgJ2Jhc2U2NCcpKTtcbiAgfSxcblxuICAvKipcbiAgICogVmVyaWZ5IEhNQUMgYWdhaW5zdCBzaGFyZWQgc2VjcmV0LiAgWW91IGFyZSBleHBlY3RlZCB0byBwYXNzIGluIGFuIG9iamVjdFxuICAgKiB0aGF0IHdhcyByZXR1cm5lZCBmcm9tIGBwYXJzZSgpYC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcnNlZFNpZ25hdHVyZSB0aGUgb2JqZWN0IHlvdSBnb3QgZnJvbSBgcGFyc2VgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VjcmV0IEhNQUMgc2hhcmVkIHNlY3JldC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB2YWxpZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IGlmIHlvdSBwYXNzIGluIGJhZCBhcmd1bWVudHMuXG4gICAqIEB0aHJvd3Mge0ludmFsaWRBbGdvcml0aG1FcnJvcn1cbiAgICovXG4gIHZlcmlmeUhNQUM6IGZ1bmN0aW9uIHZlcmlmeUhNQUMocGFyc2VkU2lnbmF0dXJlLCBzZWNyZXQpIHtcbiAgICBhc3NlcnQub2JqZWN0KHBhcnNlZFNpZ25hdHVyZSwgJ3BhcnNlZEhNQUMnKTtcbiAgICBhc3NlcnQuc3RyaW5nKHNlY3JldCwgJ3NlY3JldCcpO1xuXG4gICAgdmFyIGFsZyA9IHZhbGlkYXRlQWxnb3JpdGhtKHBhcnNlZFNpZ25hdHVyZS5hbGdvcml0aG0pO1xuICAgIGlmIChhbGdbMF0gIT09ICdobWFjJylcbiAgICAgIHJldHVybiAoZmFsc2UpO1xuXG4gICAgdmFyIGhhc2hBbGcgPSBhbGdbMV0udG9VcHBlckNhc2UoKTtcblxuICAgIHZhciBobWFjID0gY3J5cHRvLmNyZWF0ZUhtYWMoaGFzaEFsZywgc2VjcmV0KTtcbiAgICBobWFjLnVwZGF0ZShwYXJzZWRTaWduYXR1cmUuc2lnbmluZ1N0cmluZyk7XG5cbiAgICAvKlxuICAgICAqIE5vdyBkb3VibGUtaGFzaCB0byBhdm9pZCBsZWFraW5nIHRpbWluZyBpbmZvcm1hdGlvbiAtIHRoZXJlJ3NcbiAgICAgKiBubyBlYXN5IGNvbnN0YW50LXRpbWUgY29tcGFyZSBpbiBKUywgc28gd2UgdXNlIHRoaXMgYXBwcm9hY2hcbiAgICAgKiBpbnN0ZWFkLiBTZWUgZm9yIG1vcmUgaW5mbzpcbiAgICAgKiBodHRwczovL3d3dy5pc2VjcGFydG5lcnMuY29tL2Jsb2cvMjAxMS9mZWJydWFyeS9kb3VibGUtaG1hYy1cbiAgICAgKiB2ZXJpZmljYXRpb24uYXNweFxuICAgICAqL1xuICAgIHZhciBoMSA9IGNyeXB0by5jcmVhdGVIbWFjKGhhc2hBbGcsIHNlY3JldCk7XG4gICAgaDEudXBkYXRlKGhtYWMuZGlnZXN0KCkpO1xuICAgIGgxID0gaDEuZGlnZXN0KCk7XG4gICAgdmFyIGgyID0gY3J5cHRvLmNyZWF0ZUhtYWMoaGFzaEFsZywgc2VjcmV0KTtcbiAgICBoMi51cGRhdGUobmV3IEJ1ZmZlcihwYXJzZWRTaWduYXR1cmUucGFyYW1zLnNpZ25hdHVyZSwgJ2Jhc2U2NCcpKTtcbiAgICBoMiA9IGgyLmRpZ2VzdCgpO1xuXG4gICAgLyogTm9kZSAwLjggcmV0dXJucyBzdHJpbmdzIGZyb20gLmRpZ2VzdCgpLiAqL1xuICAgIGlmICh0eXBlb2YgKGgxKSA9PT0gJ3N0cmluZycpXG4gICAgICByZXR1cm4gKGgxID09PSBoMik7XG4gICAgLyogQW5kIG5vZGUgMC4xMCBsYWNrcyB0aGUgLmVxdWFscygpIG1ldGhvZCBvbiBCdWZmZXJzLiAqL1xuICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoaDEpICYmICFoMS5lcXVhbHMpXG4gICAgICByZXR1cm4gKGgxLnRvU3RyaW5nKCdiaW5hcnknKSA9PT0gaDIudG9TdHJpbmcoJ2JpbmFyeScpKTtcblxuICAgIHJldHVybiAoaDEuZXF1YWxzKGgyKSk7XG4gIH1cbn07XG4iLCIvLyBDb3B5cmlnaHQgMjAxNSBKb3llbnQsIEluYy5cblxudmFyIHBhcnNlciA9IHJlcXVpcmUoJy4vcGFyc2VyJyk7XG52YXIgc2lnbmVyID0gcmVxdWlyZSgnLi9zaWduZXInKTtcbnZhciB2ZXJpZnkgPSByZXF1aXJlKCcuL3ZlcmlmeScpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5cblxuLy8vLS0tIEFQSVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBwYXJzZTogcGFyc2VyLnBhcnNlUmVxdWVzdCxcbiAgcGFyc2VSZXF1ZXN0OiBwYXJzZXIucGFyc2VSZXF1ZXN0LFxuXG4gIHNpZ246IHNpZ25lci5zaWduUmVxdWVzdCxcbiAgc2lnblJlcXVlc3Q6IHNpZ25lci5zaWduUmVxdWVzdCxcbiAgY3JlYXRlU2lnbmVyOiBzaWduZXIuY3JlYXRlU2lnbmVyLFxuICBpc1NpZ25lcjogc2lnbmVyLmlzU2lnbmVyLFxuXG4gIHNzaEtleVRvUEVNOiB1dGlscy5zc2hLZXlUb1BFTSxcbiAgc3NoS2V5RmluZ2VycHJpbnQ6IHV0aWxzLmZpbmdlcnByaW50LFxuICBwZW1Ub1JzYVNTSEtleTogdXRpbHMucGVtVG9Sc2FTU0hLZXksXG5cbiAgdmVyaWZ5OiB2ZXJpZnkudmVyaWZ5U2lnbmF0dXJlLFxuICB2ZXJpZnlTaWduYXR1cmU6IHZlcmlmeS52ZXJpZnlTaWduYXR1cmUsXG4gIHZlcmlmeUhNQUM6IHZlcmlmeS52ZXJpZnlITUFDXG59O1xuIiwiLy8gQ29weXJpZ2h0IDIwMTIgSm95ZW50LCBJbmMuICBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbnZhciBodHRwID0gcmVxdWlyZSgnaHR0cCcpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgc3NocGsgPSByZXF1aXJlKCdzc2hwaycpO1xudmFyIGpzcHJpbSA9IHJlcXVpcmUoJ2pzcHJpbScpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgc3ByaW50ZiA9IHJlcXVpcmUoJ3V0aWwnKS5mb3JtYXQ7XG5cbnZhciBIQVNIX0FMR09TID0gdXRpbHMuSEFTSF9BTEdPUztcbnZhciBQS19BTEdPUyA9IHV0aWxzLlBLX0FMR09TO1xudmFyIEludmFsaWRBbGdvcml0aG1FcnJvciA9IHV0aWxzLkludmFsaWRBbGdvcml0aG1FcnJvcjtcbnZhciBIdHRwU2lnbmF0dXJlRXJyb3IgPSB1dGlscy5IdHRwU2lnbmF0dXJlRXJyb3I7XG52YXIgdmFsaWRhdGVBbGdvcml0aG0gPSB1dGlscy52YWxpZGF0ZUFsZ29yaXRobTtcblxuLy8vLS0tIEdsb2JhbHNcblxudmFyIEFVVEhaX0ZNVCA9XG4gICdTaWduYXR1cmUga2V5SWQ9XCIlc1wiLGFsZ29yaXRobT1cIiVzXCIsaGVhZGVycz1cIiVzXCIsc2lnbmF0dXJlPVwiJXNcIic7XG5cbi8vLy0tLSBTcGVjaWZpYyBFcnJvcnNcblxuZnVuY3Rpb24gTWlzc2luZ0hlYWRlckVycm9yKG1lc3NhZ2UpIHtcbiAgSHR0cFNpZ25hdHVyZUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSwgTWlzc2luZ0hlYWRlckVycm9yKTtcbn1cbnV0aWwuaW5oZXJpdHMoTWlzc2luZ0hlYWRlckVycm9yLCBIdHRwU2lnbmF0dXJlRXJyb3IpO1xuXG5mdW5jdGlvbiBTdHJpY3RQYXJzaW5nRXJyb3IobWVzc2FnZSkge1xuICBIdHRwU2lnbmF0dXJlRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlLCBTdHJpY3RQYXJzaW5nRXJyb3IpO1xufVxudXRpbC5pbmhlcml0cyhTdHJpY3RQYXJzaW5nRXJyb3IsIEh0dHBTaWduYXR1cmVFcnJvcik7XG5cbi8qIFNlZSBjcmVhdGVTaWduZXIoKSAqL1xuZnVuY3Rpb24gUmVxdWVzdFNpZ25lcihvcHRpb25zKSB7XG4gIGFzc2VydC5vYmplY3Qob3B0aW9ucywgJ29wdGlvbnMnKTtcblxuICB2YXIgYWxnID0gW107XG4gIGlmIChvcHRpb25zLmFsZ29yaXRobSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgYXNzZXJ0LnN0cmluZyhvcHRpb25zLmFsZ29yaXRobSwgJ29wdGlvbnMuYWxnb3JpdGhtJyk7XG4gICAgYWxnID0gdmFsaWRhdGVBbGdvcml0aG0ob3B0aW9ucy5hbGdvcml0aG0pO1xuICB9XG4gIHRoaXMucnNfYWxnID0gYWxnO1xuXG4gIC8qXG4gICAqIFJlcXVlc3RTaWduZXJzIGNvbWUgaW4gdHdvIHZhcmlldGllczogb25lcyB3aXRoIGFuIHJzX3NpZ25GdW5jLCBhbmQgb25lc1xuICAgKiB3aXRoIGFuIHJzX3NpZ25lci5cbiAgICpcbiAgICogcnNfc2lnbkZ1bmMtYmFzZWQgUmVxdWVzdFNpZ25lcnMgaGF2ZSB0byBidWlsZCB1cCB0aGVpciBlbnRpcmUgc2lnbmluZ1xuICAgKiBzdHJpbmcgd2l0aGluIHRoZSByc19saW5lcyBhcnJheSBhbmQgZ2l2ZSBpdCB0byByc19zaWduRnVuYyBhcyBhIHNpbmdsZVxuICAgKiBjb25jYXQnZCBibG9iLiByc19zaWduZXItYmFzZWQgUmVxdWVzdFNpZ25lcnMgY2FuIGFkZCBhIGxpbmUgYXQgYSB0aW1lIHRvXG4gICAqIHRoZWlyIHNpZ25pbmcgc3RhdGUgYnkgdXNpbmcgcnNfc2lnbmVyLnVwZGF0ZSgpLCB0aHVzIG9ubHkgbmVlZGluZyB0b1xuICAgKiBidWZmZXIgdGhlIGhhc2ggZnVuY3Rpb24gc3RhdGUgYW5kIG9uZSBsaW5lIGF0IGEgdGltZS5cbiAgICovXG4gIGlmIChvcHRpb25zLnNpZ24gIT09IHVuZGVmaW5lZCkge1xuICAgIGFzc2VydC5mdW5jKG9wdGlvbnMuc2lnbiwgJ29wdGlvbnMuc2lnbicpO1xuICAgIHRoaXMucnNfc2lnbkZ1bmMgPSBvcHRpb25zLnNpZ247XG5cbiAgfSBlbHNlIGlmIChhbGdbMF0gPT09ICdobWFjJyAmJiBvcHRpb25zLmtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgYXNzZXJ0LnN0cmluZyhvcHRpb25zLmtleUlkLCAnb3B0aW9ucy5rZXlJZCcpO1xuICAgIHRoaXMucnNfa2V5SWQgPSBvcHRpb25zLmtleUlkO1xuXG4gICAgaWYgKHR5cGVvZiAob3B0aW9ucy5rZXkpICE9PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMua2V5KSlcbiAgICAgIHRocm93IChuZXcgVHlwZUVycm9yKCdvcHRpb25zLmtleSBmb3IgSE1BQyBtdXN0IGJlIGEgc3RyaW5nIG9yIEJ1ZmZlcicpKTtcblxuICAgIC8qXG4gICAgICogTWFrZSBhbiByc19zaWduZXIgZm9yIEhNQUNzLCBub3QgYSByc19zaWduRnVuYyAtLSBITUFDcyBkaWdlc3QgdGhlaXJcbiAgICAgKiBkYXRhIGluIGNodW5rcyByYXRoZXIgdGhhbiByZXF1aXJpbmcgaXQgYWxsIHRvIGJlIGdpdmVuIGluIG9uZSBnb1xuICAgICAqIGF0IHRoZSBlbmQsIHNvIHRoZXkgYXJlIG1vcmUgc2ltaWxhciB0byBzaWduZXJzIHRoYW4gc2lnbkZ1bmNzLlxuICAgICAqL1xuICAgIHRoaXMucnNfc2lnbmVyID0gY3J5cHRvLmNyZWF0ZUhtYWMoYWxnWzFdLnRvVXBwZXJDYXNlKCksIG9wdGlvbnMua2V5KTtcbiAgICB0aGlzLnJzX3NpZ25lci5zaWduID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGRpZ2VzdCA9IHRoaXMuZGlnZXN0KCdiYXNlNjQnKTtcbiAgICAgIHJldHVybiAoe1xuICAgICAgICBoYXNoQWxnb3JpdGhtOiBhbGdbMV0sXG4gICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7IHJldHVybiAoZGlnZXN0KTsgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICB9IGVsc2UgaWYgKG9wdGlvbnMua2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIga2V5ID0gb3B0aW9ucy5rZXk7XG4gICAgaWYgKHR5cGVvZiAoa2V5KSA9PT0gJ3N0cmluZycgfHwgQnVmZmVyLmlzQnVmZmVyKGtleSkpXG4gICAgICBrZXkgPSBzc2hway5wYXJzZVByaXZhdGVLZXkoa2V5KTtcblxuICAgIGFzc2VydC5vayhzc2hway5Qcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXksIFsxLCAyXSksXG4gICAgICAnb3B0aW9ucy5rZXkgbXVzdCBiZSBhIHNzaHBrLlByaXZhdGVLZXknKTtcbiAgICB0aGlzLnJzX2tleSA9IGtleTtcblxuICAgIGFzc2VydC5zdHJpbmcob3B0aW9ucy5rZXlJZCwgJ29wdGlvbnMua2V5SWQnKTtcbiAgICB0aGlzLnJzX2tleUlkID0gb3B0aW9ucy5rZXlJZDtcblxuICAgIGlmICghUEtfQUxHT1Nba2V5LnR5cGVdKSB7XG4gICAgICB0aHJvdyAobmV3IEludmFsaWRBbGdvcml0aG1FcnJvcihrZXkudHlwZS50b1VwcGVyQ2FzZSgpICsgJyB0eXBlICcgK1xuICAgICAgICAna2V5cyBhcmUgbm90IHN1cHBvcnRlZCcpKTtcbiAgICB9XG5cbiAgICBpZiAoYWxnWzBdICE9PSB1bmRlZmluZWQgJiYga2V5LnR5cGUgIT09IGFsZ1swXSkge1xuICAgICAgdGhyb3cgKG5ldyBJbnZhbGlkQWxnb3JpdGhtRXJyb3IoJ29wdGlvbnMua2V5IG11c3QgYmUgYSAnICtcbiAgICAgICAgYWxnWzBdLnRvVXBwZXJDYXNlKCkgKyAnIGtleSwgd2FzIGdpdmVuIGEgJyArXG4gICAgICAgIGtleS50eXBlLnRvVXBwZXJDYXNlKCkgKyAnIGtleSBpbnN0ZWFkJykpO1xuICAgIH1cblxuICAgIHRoaXMucnNfc2lnbmVyID0ga2V5LmNyZWF0ZVNpZ24oYWxnWzFdKTtcblxuICB9IGVsc2Uge1xuICAgIHRocm93IChuZXcgVHlwZUVycm9yKCdvcHRpb25zLnNpZ24gKGZ1bmMpIG9yIG9wdGlvbnMua2V5IGlzIHJlcXVpcmVkJykpO1xuICB9XG5cbiAgdGhpcy5yc19oZWFkZXJzID0gW107XG4gIHRoaXMucnNfbGluZXMgPSBbXTtcbn1cblxuLyoqXG4gKiBBZGRzIGEgaGVhZGVyIHRvIGJlIHNpZ25lZCwgd2l0aCBpdHMgdmFsdWUsIGludG8gdGhpcyBzaWduZXIuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlclxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHZhbHVlIHdyaXR0ZW5cbiAqL1xuUmVxdWVzdFNpZ25lci5wcm90b3R5cGUud3JpdGVIZWFkZXIgPSBmdW5jdGlvbiAoaGVhZGVyLCB2YWx1ZSkge1xuICBhc3NlcnQuc3RyaW5nKGhlYWRlciwgJ2hlYWRlcicpO1xuICBoZWFkZXIgPSBoZWFkZXIudG9Mb3dlckNhc2UoKTtcbiAgYXNzZXJ0LnN0cmluZyh2YWx1ZSwgJ3ZhbHVlJyk7XG5cbiAgdGhpcy5yc19oZWFkZXJzLnB1c2goaGVhZGVyKTtcblxuICBpZiAodGhpcy5yc19zaWduRnVuYykge1xuICAgIHRoaXMucnNfbGluZXMucHVzaChoZWFkZXIgKyAnOiAnICsgdmFsdWUpO1xuXG4gIH0gZWxzZSB7XG4gICAgdmFyIGxpbmUgPSBoZWFkZXIgKyAnOiAnICsgdmFsdWU7XG4gICAgaWYgKHRoaXMucnNfaGVhZGVycy5sZW5ndGggPiAwKVxuICAgICAgbGluZSA9ICdcXG4nICsgbGluZTtcbiAgICB0aGlzLnJzX3NpZ25lci51cGRhdGUobGluZSk7XG4gIH1cblxuICByZXR1cm4gKHZhbHVlKTtcbn07XG5cbi8qKlxuICogQWRkcyBhIGRlZmF1bHQgRGF0ZSBoZWFkZXIsIHJldHVybmluZyBpdHMgdmFsdWUuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5SZXF1ZXN0U2lnbmVyLnByb3RvdHlwZS53cml0ZURhdGVIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAodGhpcy53cml0ZUhlYWRlcignZGF0ZScsIGpzcHJpbS5yZmMxMTIzKG5ldyBEYXRlKCkpKSk7XG59O1xuXG4vKipcbiAqIEFkZHMgdGhlIHJlcXVlc3QgdGFyZ2V0IGxpbmUgdG8gYmUgc2lnbmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2QsIEhUVFAgbWV0aG9kIChlLmcuICdnZXQnLCAncG9zdCcsICdwdXQnKVxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqL1xuUmVxdWVzdFNpZ25lci5wcm90b3R5cGUud3JpdGVUYXJnZXQgPSBmdW5jdGlvbiAobWV0aG9kLCBwYXRoKSB7XG4gIGFzc2VydC5zdHJpbmcobWV0aG9kLCAnbWV0aG9kJyk7XG4gIGFzc2VydC5zdHJpbmcocGF0aCwgJ3BhdGgnKTtcbiAgbWV0aG9kID0gbWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIHRoaXMud3JpdGVIZWFkZXIoJyhyZXF1ZXN0LXRhcmdldCknLCBtZXRob2QgKyAnICcgKyBwYXRoKTtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSB2YWx1ZSBmb3IgdGhlIEF1dGhvcml6YXRpb24gaGVhZGVyIG9uIHRoaXMgcmVxdWVzdFxuICogYXN5bmNocm9ub3VzbHkuXG4gKlxuICogQHBhcmFtIHtGdW5jfSBjYWxsYmFjayAoZXJyLCBhdXRoeilcbiAqL1xuUmVxdWVzdFNpZ25lci5wcm90b3R5cGUuc2lnbiA9IGZ1bmN0aW9uIChjYikge1xuICBhc3NlcnQuZnVuYyhjYiwgJ2NhbGxiYWNrJyk7XG5cbiAgaWYgKHRoaXMucnNfaGVhZGVycy5sZW5ndGggPCAxKVxuICAgIHRocm93IChuZXcgRXJyb3IoJ0F0IGxlYXN0IG9uZSBoZWFkZXIgbXVzdCBiZSBzaWduZWQnKSk7XG5cbiAgdmFyIGFsZywgYXV0aHo7XG4gIGlmICh0aGlzLnJzX3NpZ25GdW5jKSB7XG4gICAgdmFyIGRhdGEgPSB0aGlzLnJzX2xpbmVzLmpvaW4oJ1xcbicpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLnJzX3NpZ25GdW5jKGRhdGEsIGZ1bmN0aW9uIChlcnIsIHNpZykge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYihlcnIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBhc3NlcnQub2JqZWN0KHNpZywgJ3NpZ25hdHVyZScpO1xuICAgICAgICBhc3NlcnQuc3RyaW5nKHNpZy5rZXlJZCwgJ3NpZ25hdHVyZS5rZXlJZCcpO1xuICAgICAgICBhc3NlcnQuc3RyaW5nKHNpZy5hbGdvcml0aG0sICdzaWduYXR1cmUuYWxnb3JpdGhtJyk7XG4gICAgICAgIGFzc2VydC5zdHJpbmcoc2lnLnNpZ25hdHVyZSwgJ3NpZ25hdHVyZS5zaWduYXR1cmUnKTtcbiAgICAgICAgYWxnID0gdmFsaWRhdGVBbGdvcml0aG0oc2lnLmFsZ29yaXRobSk7XG5cbiAgICAgICAgYXV0aHogPSBzcHJpbnRmKEFVVEhaX0ZNVCxcbiAgICAgICAgICBzaWcua2V5SWQsXG4gICAgICAgICAgc2lnLmFsZ29yaXRobSxcbiAgICAgICAgICBzZWxmLnJzX2hlYWRlcnMuam9pbignICcpLFxuICAgICAgICAgIHNpZy5zaWduYXR1cmUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYihlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2IobnVsbCwgYXV0aHopO1xuICAgIH0pO1xuXG4gIH0gZWxzZSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBzaWdPYmogPSB0aGlzLnJzX3NpZ25lci5zaWduKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY2IoZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGFsZyA9ICh0aGlzLnJzX2FsZ1swXSB8fCB0aGlzLnJzX2tleS50eXBlKSArICctJyArIHNpZ09iai5oYXNoQWxnb3JpdGhtO1xuICAgIHZhciBzaWduYXR1cmUgPSBzaWdPYmoudG9TdHJpbmcoKTtcbiAgICBhdXRoeiA9IHNwcmludGYoQVVUSFpfRk1ULFxuICAgICAgdGhpcy5yc19rZXlJZCxcbiAgICAgIGFsZyxcbiAgICAgIHRoaXMucnNfaGVhZGVycy5qb2luKCcgJyksXG4gICAgICBzaWduYXR1cmUpO1xuICAgIGNiKG51bGwsIGF1dGh6KTtcbiAgfVxufTtcblxuLy8vLS0tIEV4cG9ydGVkIEFQSVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLyoqXG4gICAqIElkZW50aWZpZXMgd2hldGhlciBhIGdpdmVuIG9iamVjdCBpcyBhIHJlcXVlc3Qgc2lnbmVyIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCwgdGhlIG9iamVjdCB0byBpZGVudGlmeVxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICovXG4gIGlzU2lnbmVyOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgaWYgKHR5cGVvZiAob2JqKSA9PT0gJ29iamVjdCcgJiYgb2JqIGluc3RhbmNlb2YgUmVxdWVzdFNpZ25lcilcbiAgICAgIHJldHVybiAodHJ1ZSk7XG4gICAgcmV0dXJuIChmYWxzZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSByZXF1ZXN0IHNpZ25lciwgdXNlZCB0byBhc3luY2hyb25vdXNseSBidWlsZCBhIHNpZ25hdHVyZVxuICAgKiBmb3IgYSByZXF1ZXN0IChkb2VzIG5vdCBoYXZlIHRvIGJlIGFuIGh0dHAuQ2xpZW50UmVxdWVzdCkuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLCBlaXRoZXI6XG4gICAqICAgICAgICAgICAgICAgICAgIC0ge1N0cmluZ30ga2V5SWRcbiAgICogICAgICAgICAgICAgICAgICAgLSB7U3RyaW5nfEJ1ZmZlcn0ga2V5XG4gICAqICAgICAgICAgICAgICAgICAgIC0ge1N0cmluZ30gYWxnb3JpdGhtIChvcHRpb25hbCwgcmVxdWlyZWQgZm9yIEhNQUMpXG4gICAqICAgICAgICAgICAgICAgICBvcjpcbiAgICogICAgICAgICAgICAgICAgICAgLSB7RnVuY30gc2lnbiAoZGF0YSwgY2IpXG4gICAqIEByZXR1cm4ge1JlcXVlc3RTaWduZXJ9XG4gICAqL1xuICBjcmVhdGVTaWduZXI6IGZ1bmN0aW9uIGNyZWF0ZVNpZ25lcihvcHRpb25zKSB7XG4gICAgcmV0dXJuIChuZXcgUmVxdWVzdFNpZ25lcihvcHRpb25zKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gJ0F1dGhvcml6YXRpb24nIGhlYWRlciB0byBhbiBodHRwLkNsaWVudFJlcXVlc3Qgb2JqZWN0LlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhpcyBBUEkgd2lsbCBhZGQgYSBEYXRlIGhlYWRlciBpZiBpdCdzIG5vdCBhbHJlYWR5IHNldC4gQW55XG4gICAqIG90aGVyIGhlYWRlcnMgaW4gdGhlIG9wdGlvbnMuaGVhZGVycyBhcnJheSBNVVNUIGJlIHByZXNlbnQsIG9yIHRoaXNcbiAgICogd2lsbCB0aHJvdy5cbiAgICpcbiAgICogWW91IHNob3VsZG4ndCBuZWVkIHRvIGNoZWNrIHRoZSByZXR1cm4gdHlwZTsgaXQncyBqdXN0IHRoZXJlIGlmIHlvdSB3YW50XG4gICAqIHRvIGJlIHBlZGFudGljLlxuICAgKlxuICAgKiBUaGUgb3B0aW9uYWwgZmxhZyBpbmRpY2F0ZXMgd2hldGhlciBwYXJzaW5nIHNob3VsZCB1c2Ugc3RyaWN0IGVuZm9yY2VtZW50XG4gICAqIG9mIHRoZSB2ZXJzaW9uIGRyYWZ0LWNhdmFnZS1odHRwLXNpZ25hdHVyZXMtMDQgb2YgdGhlIHNwZWMgb3IgYmV5b25kLlxuICAgKiBUaGUgZGVmYXVsdCBpcyB0byBiZSBsb29zZSBhbmQgc3VwcG9ydFxuICAgKiBvbGRlciB2ZXJzaW9ucyBmb3IgY29tcGF0aWJpbGl0eS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3QgYW4gaW5zdGFuY2Ugb2YgaHR0cC5DbGllbnRSZXF1ZXN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBzaWduaW5nIHBhcmFtZXRlcnMgb2JqZWN0OlxuICAgKiAgICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IGtleUlkIHJlcXVpcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IGtleSByZXF1aXJlZCAoZWl0aGVyIGEgUEVNIG9yIEhNQUMga2V5KS5cbiAgICogICAgICAgICAgICAgICAgICAgLSB7QXJyYXl9IGhlYWRlcnMgb3B0aW9uYWw7IGRlZmF1bHRzIHRvIFsnZGF0ZSddLlxuICAgKiAgICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IGFsZ29yaXRobSBvcHRpb25hbCAodW5sZXNzIGtleSBpcyBITUFDKTtcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0IGlzIHRoZSBzYW1lIGFzIHRoZSBzc2hwayBkZWZhdWx0XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmluZyBhbGdvcml0aG0gZm9yIHRoZSB0eXBlIG9mIGtleSBnaXZlblxuICAgKiAgICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IGh0dHBWZXJzaW9uIG9wdGlvbmFsOyBkZWZhdWx0cyB0byAnMS4xJy5cbiAgICogICAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gc3RyaWN0IG9wdGlvbmFsOyBkZWZhdWx0cyB0byAnZmFsc2UnLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIEF1dGhvcml6YXRpb24gKGFuZCBvcHRpb25hbGx5IERhdGUpIHdlcmUgYWRkZWQuXG4gICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gb24gYmFkIHBhcmFtZXRlciB0eXBlcyAoaW5wdXQpLlxuICAgKiBAdGhyb3dzIHtJbnZhbGlkQWxnb3JpdGhtRXJyb3J9IGlmIGFsZ29yaXRobSB3YXMgYmFkIG9yIGluY29tcGF0aWJsZSB3aXRoXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGdpdmVuIGtleS5cbiAgICogQHRocm93cyB7c3NocGsuS2V5UGFyc2VFcnJvcn0gaWYga2V5IHdhcyBiYWQuXG4gICAqIEB0aHJvd3Mge01pc3NpbmdIZWFkZXJFcnJvcn0gaWYgYSBoZWFkZXIgdG8gYmUgc2lnbmVkIHdhcyBzcGVjaWZpZWQgYnV0XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2FzIG5vdCBwcmVzZW50LlxuICAgKi9cbiAgc2lnblJlcXVlc3Q6IGZ1bmN0aW9uIHNpZ25SZXF1ZXN0KHJlcXVlc3QsIG9wdGlvbnMpIHtcbiAgICBhc3NlcnQub2JqZWN0KHJlcXVlc3QsICdyZXF1ZXN0Jyk7XG4gICAgYXNzZXJ0Lm9iamVjdChvcHRpb25zLCAnb3B0aW9ucycpO1xuICAgIGFzc2VydC5vcHRpb25hbFN0cmluZyhvcHRpb25zLmFsZ29yaXRobSwgJ29wdGlvbnMuYWxnb3JpdGhtJyk7XG4gICAgYXNzZXJ0LnN0cmluZyhvcHRpb25zLmtleUlkLCAnb3B0aW9ucy5rZXlJZCcpO1xuICAgIGFzc2VydC5vcHRpb25hbEFycmF5T2ZTdHJpbmcob3B0aW9ucy5oZWFkZXJzLCAnb3B0aW9ucy5oZWFkZXJzJyk7XG4gICAgYXNzZXJ0Lm9wdGlvbmFsU3RyaW5nKG9wdGlvbnMuaHR0cFZlcnNpb24sICdvcHRpb25zLmh0dHBWZXJzaW9uJyk7XG5cbiAgICBpZiAoIXJlcXVlc3QuZ2V0SGVhZGVyKCdEYXRlJykpXG4gICAgICByZXF1ZXN0LnNldEhlYWRlcignRGF0ZScsIGpzcHJpbS5yZmMxMTIzKG5ldyBEYXRlKCkpKTtcbiAgICBpZiAoIW9wdGlvbnMuaGVhZGVycylcbiAgICAgIG9wdGlvbnMuaGVhZGVycyA9IFsnZGF0ZSddO1xuICAgIGlmICghb3B0aW9ucy5odHRwVmVyc2lvbilcbiAgICAgIG9wdGlvbnMuaHR0cFZlcnNpb24gPSAnMS4xJztcblxuICAgIHZhciBhbGcgPSBbXTtcbiAgICBpZiAob3B0aW9ucy5hbGdvcml0aG0pIHtcbiAgICAgIG9wdGlvbnMuYWxnb3JpdGhtID0gb3B0aW9ucy5hbGdvcml0aG0udG9Mb3dlckNhc2UoKTtcbiAgICAgIGFsZyA9IHZhbGlkYXRlQWxnb3JpdGhtKG9wdGlvbnMuYWxnb3JpdGhtKTtcbiAgICB9XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgc3RyaW5nVG9TaWduID0gJyc7XG4gICAgZm9yIChpID0gMDsgaSA8IG9wdGlvbnMuaGVhZGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHR5cGVvZiAob3B0aW9ucy5oZWFkZXJzW2ldKSAhPT0gJ3N0cmluZycpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbnMuaGVhZGVycyBtdXN0IGJlIGFuIGFycmF5IG9mIFN0cmluZ3MnKTtcblxuICAgICAgdmFyIGggPSBvcHRpb25zLmhlYWRlcnNbaV0udG9Mb3dlckNhc2UoKTtcblxuICAgICAgaWYgKGggPT09ICdyZXF1ZXN0LWxpbmUnKSB7XG4gICAgICAgIGlmICghb3B0aW9ucy5zdHJpY3QpIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBXZSBhbGxvdyBoZWFkZXJzIGZyb20gdGhlIG9sZGVyIHNwZWMgZHJhZnRzIGlmIHN0cmljdCBwYXJzaW5nIGlzbid0XG4gICAgICAgICAgICogc3BlY2lmaWVkIGluIG9wdGlvbnMuXG4gICAgICAgICAgICovXG4gICAgICAgICAgc3RyaW5nVG9TaWduICs9XG4gICAgICAgICAgICByZXF1ZXN0Lm1ldGhvZCArICcgJyArIHJlcXVlc3QucGF0aCArICcgSFRUUC8nICtcbiAgICAgICAgICAgIG9wdGlvbnMuaHR0cFZlcnNpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLyogU3RyaWN0IHBhcnNpbmcgZG9lc24ndCBhbGxvdyBvbGRlciBkcmFmdCBoZWFkZXJzLiAqL1xuICAgICAgICAgIHRocm93IChuZXcgU3RyaWN0UGFyc2luZ0Vycm9yKCdyZXF1ZXN0LWxpbmUgaXMgbm90IGEgdmFsaWQgaGVhZGVyICcgK1xuICAgICAgICAgICAgJ3dpdGggc3RyaWN0IHBhcnNpbmcgZW5hYmxlZC4nKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaCA9PT0gJyhyZXF1ZXN0LXRhcmdldCknKSB7XG4gICAgICAgIHN0cmluZ1RvU2lnbiArPVxuICAgICAgICAgICcocmVxdWVzdC10YXJnZXQpOiAnICsgcmVxdWVzdC5tZXRob2QudG9Mb3dlckNhc2UoKSArICcgJyArXG4gICAgICAgICAgcmVxdWVzdC5wYXRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcmVxdWVzdC5nZXRIZWFkZXIoaCk7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSAnJykge1xuICAgICAgICAgIHRocm93IG5ldyBNaXNzaW5nSGVhZGVyRXJyb3IoaCArICcgd2FzIG5vdCBpbiB0aGUgcmVxdWVzdCcpO1xuICAgICAgICB9XG4gICAgICAgIHN0cmluZ1RvU2lnbiArPSBoICsgJzogJyArIHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoKGkgKyAxKSA8IG9wdGlvbnMuaGVhZGVycy5sZW5ndGgpXG4gICAgICAgIHN0cmluZ1RvU2lnbiArPSAnXFxuJztcbiAgICB9XG5cbiAgICAvKiBUaGlzIGlzIGp1c3QgZm9yIHVuaXQgdGVzdHMuICovXG4gICAgaWYgKHJlcXVlc3QuaGFzT3duUHJvcGVydHkoJ19zdHJpbmdUb1NpZ24nKSkge1xuICAgICAgcmVxdWVzdC5fc3RyaW5nVG9TaWduID0gc3RyaW5nVG9TaWduO1xuICAgIH1cblxuICAgIHZhciBzaWduYXR1cmU7XG4gICAgaWYgKGFsZ1swXSA9PT0gJ2htYWMnKSB7XG4gICAgICBpZiAodHlwZW9mIChvcHRpb25zLmtleSkgIT09ICdzdHJpbmcnICYmICFCdWZmZXIuaXNCdWZmZXIob3B0aW9ucy5rZXkpKVxuICAgICAgICB0aHJvdyAobmV3IFR5cGVFcnJvcignb3B0aW9ucy5rZXkgbXVzdCBiZSBhIHN0cmluZyBvciBCdWZmZXInKSk7XG5cbiAgICAgIHZhciBobWFjID0gY3J5cHRvLmNyZWF0ZUhtYWMoYWxnWzFdLnRvVXBwZXJDYXNlKCksIG9wdGlvbnMua2V5KTtcbiAgICAgIGhtYWMudXBkYXRlKHN0cmluZ1RvU2lnbik7XG4gICAgICBzaWduYXR1cmUgPSBobWFjLmRpZ2VzdCgnYmFzZTY0Jyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleSA9IG9wdGlvbnMua2V5O1xuICAgICAgaWYgKHR5cGVvZiAoa2V5KSA9PT0gJ3N0cmluZycgfHwgQnVmZmVyLmlzQnVmZmVyKGtleSkpXG4gICAgICAgIGtleSA9IHNzaHBrLnBhcnNlUHJpdmF0ZUtleShvcHRpb25zLmtleSk7XG5cbiAgICAgIGFzc2VydC5vayhzc2hway5Qcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXksIFsxLCAyXSksXG4gICAgICAgICdvcHRpb25zLmtleSBtdXN0IGJlIGEgc3NocGsuUHJpdmF0ZUtleScpO1xuXG4gICAgICBpZiAoIVBLX0FMR09TW2tleS50eXBlXSkge1xuICAgICAgICB0aHJvdyAobmV3IEludmFsaWRBbGdvcml0aG1FcnJvcihrZXkudHlwZS50b1VwcGVyQ2FzZSgpICsgJyB0eXBlICcgK1xuICAgICAgICAgICdrZXlzIGFyZSBub3Qgc3VwcG9ydGVkJykpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYWxnWzBdICE9PSB1bmRlZmluZWQgJiYga2V5LnR5cGUgIT09IGFsZ1swXSkge1xuICAgICAgICB0aHJvdyAobmV3IEludmFsaWRBbGdvcml0aG1FcnJvcignb3B0aW9ucy5rZXkgbXVzdCBiZSBhICcgK1xuICAgICAgICAgIGFsZ1swXS50b1VwcGVyQ2FzZSgpICsgJyBrZXksIHdhcyBnaXZlbiBhICcgK1xuICAgICAgICAgIGtleS50eXBlLnRvVXBwZXJDYXNlKCkgKyAnIGtleSBpbnN0ZWFkJykpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2lnbmVyID0ga2V5LmNyZWF0ZVNpZ24oYWxnWzFdKTtcbiAgICAgIHNpZ25lci51cGRhdGUoc3RyaW5nVG9TaWduKTtcbiAgICAgIHZhciBzaWdPYmogPSBzaWduZXIuc2lnbigpO1xuICAgICAgaWYgKCFIQVNIX0FMR09TW3NpZ09iai5oYXNoQWxnb3JpdGhtXSkge1xuICAgICAgICB0aHJvdyAobmV3IEludmFsaWRBbGdvcml0aG1FcnJvcihzaWdPYmouaGFzaEFsZ29yaXRobS50b1VwcGVyQ2FzZSgpICtcbiAgICAgICAgICAnIGlzIG5vdCBhIHN1cHBvcnRlZCBoYXNoIGFsZ29yaXRobScpKTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMuYWxnb3JpdGhtID0ga2V5LnR5cGUgKyAnLScgKyBzaWdPYmouaGFzaEFsZ29yaXRobTtcbiAgICAgIHNpZ25hdHVyZSA9IHNpZ09iai50b1N0cmluZygpO1xuICAgICAgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKHNpZ25hdHVyZSwgJycsICdlbXB0eSBzaWduYXR1cmUgcHJvZHVjZWQnKTtcbiAgICB9XG5cbiAgICB2YXIgYXV0aHpIZWFkZXJOYW1lID0gb3B0aW9ucy5hdXRob3JpemF0aW9uSGVhZGVyTmFtZSB8fCAnQXV0aG9yaXphdGlvbic7XG5cbiAgICByZXF1ZXN0LnNldEhlYWRlcihhdXRoekhlYWRlck5hbWUsIHNwcmludGYoQVVUSFpfRk1ULFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmtleUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmFsZ29yaXRobSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5oZWFkZXJzLmpvaW4oJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmF0dXJlKSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==