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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaHR0cC1zaWduYXR1cmUvbGliL3V0aWxzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9odHRwLXNpZ25hdHVyZS9saWIvcGFyc2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9odHRwLXNpZ25hdHVyZS9saWIvdmVyaWZ5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9odHRwLXNpZ25hdHVyZS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2h0dHAtc2lnbmF0dXJlL2xpYi9zaWduZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLHlCQUFhO0FBQ2xDLFlBQVksbUJBQU8sQ0FBQyxtQkFBTztBQUMzQixXQUFXLG1CQUFPLENBQUMsa0JBQU07O0FBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsVUFBVTtBQUN4QixjQUFjLE1BQU07QUFDcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsVUFBVTtBQUN4QixjQUFjLE1BQU07QUFDcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQy9HQTs7QUFFQSxhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsV0FBVyxtQkFBTyxDQUFDLGtCQUFNO0FBQ3pCLFlBQVksbUJBQU8sQ0FBQyxxQkFBUzs7OztBQUk3Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsVUFBVTtBQUN4QixjQUFjLG1CQUFtQjtBQUNqQyxjQUFjLG1CQUFtQjtBQUNqQyxjQUFjLG1CQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQSxjQUFjLG1CQUFtQjtBQUNqQztBQUNBLGNBQWMsb0JBQW9CO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBLGVBQWUsa0JBQWtCO0FBQ2pDOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxrQ0FBa0M7QUFDakQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQzFUQTs7QUFFQSxhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLFlBQVksbUJBQU8sQ0FBQyxtQkFBTztBQUMzQixZQUFZLG1CQUFPLENBQUMscUJBQVM7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsY0FBYyxRQUFRO0FBQ3RCLGNBQWMsVUFBVTtBQUN4QixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLFFBQVE7QUFDdEIsY0FBYyxVQUFVO0FBQ3hCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDdkZBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyxzQkFBVTtBQUMvQixhQUFhLG1CQUFPLENBQUMsc0JBQVU7QUFDL0IsYUFBYSxtQkFBTyxDQUFDLHNCQUFVO0FBQy9CLFlBQVksbUJBQU8sQ0FBQyxxQkFBUzs7OztBQUk3Qjs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDNUJBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQyxhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsV0FBVyxtQkFBTyxDQUFDLGtCQUFNO0FBQ3pCLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTtBQUN6QixZQUFZLG1CQUFPLENBQUMsbUJBQU87QUFDM0IsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLFlBQVksbUJBQU8sQ0FBQyxxQkFBUzs7QUFFN0IsY0FBYyxtQkFBTyxDQUFDLGtCQUFNOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGlCQUFpQjtBQUNoRCxPQUFPO0FBQ1A7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsS0FBSztBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLDBCQUEwQixPQUFPO0FBQ2pDLDBCQUEwQixjQUFjO0FBQ3hDLDBCQUEwQixPQUFPO0FBQ2pDO0FBQ0EsMEJBQTBCLEtBQUs7QUFDL0IsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLDBCQUEwQixPQUFPO0FBQ2pDLDBCQUEwQixPQUFPO0FBQ2pDLDBCQUEwQixNQUFNLGtCQUFrQjtBQUNsRCwwQkFBMEIsT0FBTztBQUNqQztBQUNBO0FBQ0EsMEJBQTBCLE9BQU8sc0JBQXNCO0FBQ3ZELDBCQUEwQixRQUFRLGlCQUFpQjtBQUNuRCxjQUFjLFFBQVE7QUFDdEIsY0FBYyxVQUFVO0FBQ3hCLGNBQWMsc0JBQXNCO0FBQ3BDO0FBQ0EsY0FBYyxvQkFBb0I7QUFDbEMsY0FBYyxtQkFBbUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLDRCQUE0QjtBQUMzQztBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5odHRwLXNpZ25hdHVyZS43Y2RiNzc1NzBhNzNmZDFhOGU5OS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyIEpveWVudCwgSW5jLiAgQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuXHJcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQtcGx1cycpO1xyXG52YXIgc3NocGsgPSByZXF1aXJlKCdzc2hwaycpO1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcclxuXHJcbnZhciBIQVNIX0FMR09TID0ge1xyXG4gICdzaGExJzogdHJ1ZSxcclxuICAnc2hhMjU2JzogdHJ1ZSxcclxuICAnc2hhNTEyJzogdHJ1ZVxyXG59O1xyXG5cclxudmFyIFBLX0FMR09TID0ge1xyXG4gICdyc2EnOiB0cnVlLFxyXG4gICdkc2EnOiB0cnVlLFxyXG4gICdlY2RzYSc6IHRydWVcclxufTtcclxuXHJcbmZ1bmN0aW9uIEh0dHBTaWduYXR1cmVFcnJvcihtZXNzYWdlLCBjYWxsZXIpIHtcclxuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpXHJcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBjYWxsZXIgfHwgSHR0cFNpZ25hdHVyZUVycm9yKTtcclxuXHJcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICB0aGlzLm5hbWUgPSBjYWxsZXIubmFtZTtcclxufVxyXG51dGlsLmluaGVyaXRzKEh0dHBTaWduYXR1cmVFcnJvciwgRXJyb3IpO1xyXG5cclxuZnVuY3Rpb24gSW52YWxpZEFsZ29yaXRobUVycm9yKG1lc3NhZ2UpIHtcclxuICBIdHRwU2lnbmF0dXJlRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlLCBJbnZhbGlkQWxnb3JpdGhtRXJyb3IpO1xyXG59XHJcbnV0aWwuaW5oZXJpdHMoSW52YWxpZEFsZ29yaXRobUVycm9yLCBIdHRwU2lnbmF0dXJlRXJyb3IpO1xyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVBbGdvcml0aG0oYWxnb3JpdGhtKSB7XHJcbiAgdmFyIGFsZyA9IGFsZ29yaXRobS50b0xvd2VyQ2FzZSgpLnNwbGl0KCctJyk7XHJcblxyXG4gIGlmIChhbGcubGVuZ3RoICE9PSAyKSB7XHJcbiAgICB0aHJvdyAobmV3IEludmFsaWRBbGdvcml0aG1FcnJvcihhbGdbMF0udG9VcHBlckNhc2UoKSArICcgaXMgbm90IGEgJyArXHJcbiAgICAgICd2YWxpZCBhbGdvcml0aG0nKSk7XHJcbiAgfVxyXG5cclxuICBpZiAoYWxnWzBdICE9PSAnaG1hYycgJiYgIVBLX0FMR09TW2FsZ1swXV0pIHtcclxuICAgIHRocm93IChuZXcgSW52YWxpZEFsZ29yaXRobUVycm9yKGFsZ1swXS50b1VwcGVyQ2FzZSgpICsgJyB0eXBlIGtleXMgJyArXHJcbiAgICAgICdhcmUgbm90IHN1cHBvcnRlZCcpKTtcclxuICB9XHJcblxyXG4gIGlmICghSEFTSF9BTEdPU1thbGdbMV1dKSB7XHJcbiAgICB0aHJvdyAobmV3IEludmFsaWRBbGdvcml0aG1FcnJvcihhbGdbMV0udG9VcHBlckNhc2UoKSArICcgaXMgbm90IGEgJyArXHJcbiAgICAgICdzdXBwb3J0ZWQgaGFzaCBhbGdvcml0aG0nKSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKGFsZyk7XHJcbn1cclxuXHJcbi8vLy0tLSBBUElcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICBIQVNIX0FMR09TOiBIQVNIX0FMR09TLFxyXG4gIFBLX0FMR09TOiBQS19BTEdPUyxcclxuXHJcbiAgSHR0cFNpZ25hdHVyZUVycm9yOiBIdHRwU2lnbmF0dXJlRXJyb3IsXHJcbiAgSW52YWxpZEFsZ29yaXRobUVycm9yOiBJbnZhbGlkQWxnb3JpdGhtRXJyb3IsXHJcblxyXG4gIHZhbGlkYXRlQWxnb3JpdGhtOiB2YWxpZGF0ZUFsZ29yaXRobSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ29udmVydHMgYW4gT3BlblNTSCBwdWJsaWMga2V5IChyc2Egb25seSkgdG8gYSBQS0NTIzggUEVNIGZpbGUuXHJcbiAgICpcclxuICAgKiBUaGUgaW50ZW50IG9mIHRoaXMgbW9kdWxlIGlzIHRvIGludGVyb3BlcmF0ZSB3aXRoIE9wZW5TU0wgb25seSxcclxuICAgKiBzcGVjaWZpY2FsbHkgdGhlIG5vZGUgY3J5cHRvIG1vZHVsZSdzIGB2ZXJpZnlgIG1ldGhvZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgYW4gT3BlblNTSCBwdWJsaWMga2V5LlxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gUEVNIGVuY29kZWQgZm9ybSBvZiB0aGUgUlNBIHB1YmxpYyBrZXkuXHJcbiAgICogQHRocm93cyB7VHlwZUVycm9yfSBvbiBiYWQgaW5wdXQuXHJcbiAgICogQHRocm93cyB7RXJyb3J9IG9uIGludmFsaWQgc3NoIGtleSBmb3JtYXR0ZWQgZGF0YS5cclxuICAgKi9cclxuICBzc2hLZXlUb1BFTTogZnVuY3Rpb24gc3NoS2V5VG9QRU0oa2V5KSB7XHJcbiAgICBhc3NlcnQuc3RyaW5nKGtleSwgJ3NzaF9rZXknKTtcclxuXHJcbiAgICB2YXIgayA9IHNzaHBrLnBhcnNlS2V5KGtleSwgJ3NzaCcpO1xyXG4gICAgcmV0dXJuIChrLnRvU3RyaW5nKCdwZW0nKSk7XHJcbiAgfSxcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIEdlbmVyYXRlcyBhbiBPcGVuU1NIIGZpbmdlcnByaW50IGZyb20gYW4gc3NoIHB1YmxpYyBrZXkuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IGFuIE9wZW5TU0ggcHVibGljIGtleS5cclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IGtleSBmaW5nZXJwcmludC5cclxuICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IG9uIGJhZCBpbnB1dC5cclxuICAgKiBAdGhyb3dzIHtFcnJvcn0gaWYgd2hhdCB5b3UgcGFzc2VkIGRvZXNuJ3QgbG9vayBsaWtlIGFuIHNzaCBwdWJsaWMga2V5LlxyXG4gICAqL1xyXG4gIGZpbmdlcnByaW50OiBmdW5jdGlvbiBmaW5nZXJwcmludChrZXkpIHtcclxuICAgIGFzc2VydC5zdHJpbmcoa2V5LCAnc3NoX2tleScpO1xyXG5cclxuICAgIHZhciBrID0gc3NocGsucGFyc2VLZXkoa2V5LCAnc3NoJyk7XHJcbiAgICByZXR1cm4gKGsuZmluZ2VycHJpbnQoJ21kNScpLnRvU3RyaW5nKCdoZXgnKSk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ29udmVydHMgYSBQS0dDUyM4IFBFTSBmaWxlIHRvIGFuIE9wZW5TU0ggcHVibGljIGtleSAocnNhKVxyXG4gICAqXHJcbiAgICogVGhlIHJldmVyc2Ugb2YgdGhlIGFib3ZlIGZ1bmN0aW9uLlxyXG4gICAqL1xyXG4gIHBlbVRvUnNhU1NIS2V5OiBmdW5jdGlvbiBwZW1Ub1JzYVNTSEtleShwZW0sIGNvbW1lbnQpIHtcclxuICAgIGFzc2VydC5lcXVhbCgnc3RyaW5nJywgdHlwZW9mIChwZW0pLCAndHlwZW9mIHBlbScpO1xyXG5cclxuICAgIHZhciBrID0gc3NocGsucGFyc2VLZXkocGVtLCAncGVtJyk7XHJcbiAgICBrLmNvbW1lbnQgPSBjb21tZW50O1xyXG4gICAgcmV0dXJuIChrLnRvU3RyaW5nKCdzc2gnKSk7XHJcbiAgfVxyXG59O1xyXG4iLCIvLyBDb3B5cmlnaHQgMjAxMiBKb3llbnQsIEluYy4gIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcclxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuXHJcblxyXG5cclxuLy8vLS0tIEdsb2JhbHNcclxuXHJcbnZhciBIQVNIX0FMR09TID0gdXRpbHMuSEFTSF9BTEdPUztcclxudmFyIFBLX0FMR09TID0gdXRpbHMuUEtfQUxHT1M7XHJcbnZhciBIdHRwU2lnbmF0dXJlRXJyb3IgPSB1dGlscy5IdHRwU2lnbmF0dXJlRXJyb3I7XHJcbnZhciBJbnZhbGlkQWxnb3JpdGhtRXJyb3IgPSB1dGlscy5JbnZhbGlkQWxnb3JpdGhtRXJyb3I7XHJcbnZhciB2YWxpZGF0ZUFsZ29yaXRobSA9IHV0aWxzLnZhbGlkYXRlQWxnb3JpdGhtO1xyXG5cclxudmFyIFN0YXRlID0ge1xyXG4gIE5ldzogMCxcclxuICBQYXJhbXM6IDFcclxufTtcclxuXHJcbnZhciBQYXJhbXNTdGF0ZSA9IHtcclxuICBOYW1lOiAwLFxyXG4gIFF1b3RlOiAxLFxyXG4gIFZhbHVlOiAyLFxyXG4gIENvbW1hOiAzXHJcbn07XHJcblxyXG5cclxuLy8vLS0tIFNwZWNpZmljIEVycm9yc1xyXG5cclxuXHJcbmZ1bmN0aW9uIEV4cGlyZWRSZXF1ZXN0RXJyb3IobWVzc2FnZSkge1xyXG4gIEh0dHBTaWduYXR1cmVFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UsIEV4cGlyZWRSZXF1ZXN0RXJyb3IpO1xyXG59XHJcbnV0aWwuaW5oZXJpdHMoRXhwaXJlZFJlcXVlc3RFcnJvciwgSHR0cFNpZ25hdHVyZUVycm9yKTtcclxuXHJcblxyXG5mdW5jdGlvbiBJbnZhbGlkSGVhZGVyRXJyb3IobWVzc2FnZSkge1xyXG4gIEh0dHBTaWduYXR1cmVFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UsIEludmFsaWRIZWFkZXJFcnJvcik7XHJcbn1cclxudXRpbC5pbmhlcml0cyhJbnZhbGlkSGVhZGVyRXJyb3IsIEh0dHBTaWduYXR1cmVFcnJvcik7XHJcblxyXG5cclxuZnVuY3Rpb24gSW52YWxpZFBhcmFtc0Vycm9yKG1lc3NhZ2UpIHtcclxuICBIdHRwU2lnbmF0dXJlRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlLCBJbnZhbGlkUGFyYW1zRXJyb3IpO1xyXG59XHJcbnV0aWwuaW5oZXJpdHMoSW52YWxpZFBhcmFtc0Vycm9yLCBIdHRwU2lnbmF0dXJlRXJyb3IpO1xyXG5cclxuXHJcbmZ1bmN0aW9uIE1pc3NpbmdIZWFkZXJFcnJvcihtZXNzYWdlKSB7XHJcbiAgSHR0cFNpZ25hdHVyZUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSwgTWlzc2luZ0hlYWRlckVycm9yKTtcclxufVxyXG51dGlsLmluaGVyaXRzKE1pc3NpbmdIZWFkZXJFcnJvciwgSHR0cFNpZ25hdHVyZUVycm9yKTtcclxuXHJcbmZ1bmN0aW9uIFN0cmljdFBhcnNpbmdFcnJvcihtZXNzYWdlKSB7XHJcbiAgSHR0cFNpZ25hdHVyZUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSwgU3RyaWN0UGFyc2luZ0Vycm9yKTtcclxufVxyXG51dGlsLmluaGVyaXRzKFN0cmljdFBhcnNpbmdFcnJvciwgSHR0cFNpZ25hdHVyZUVycm9yKTtcclxuXHJcbi8vLy0tLSBFeHBvcnRlZCBBUElcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAvKipcclxuICAgKiBQYXJzZXMgdGhlICdBdXRob3JpemF0aW9uJyBoZWFkZXIgb3V0IG9mIGFuIGh0dHAuU2VydmVyUmVxdWVzdCBvYmplY3QuXHJcbiAgICpcclxuICAgKiBOb3RlIHRoYXQgdGhpcyBBUEkgd2lsbCBmdWxseSB2YWxpZGF0ZSB0aGUgQXV0aG9yaXphdGlvbiBoZWFkZXIsIGFuZCB0aHJvd1xyXG4gICAqIG9uIGFueSBlcnJvci4gIEl0IHdpbGwgbm90IGhvd2V2ZXIgY2hlY2sgdGhlIHNpZ25hdHVyZSwgb3IgdGhlIGtleUlkIGZvcm1hdFxyXG4gICAqIGFzIHRob3NlIGFyZSBzcGVjaWZpYyB0byB5b3VyIGVudmlyb25tZW50LiAgWW91IGNhbiB1c2UgdGhlIG9wdGlvbnMgb2JqZWN0XHJcbiAgICogdG8gcGFzcyBpbiBleHRyYSBjb25zdHJhaW50cy5cclxuICAgKlxyXG4gICAqIEFzIGEgcmVzcG9uc2Ugb2JqZWN0IHlvdSBjYW4gZXhwZWN0IHRoaXM6XHJcbiAgICpcclxuICAgKiAgICAge1xyXG4gICAqICAgICAgIFwic2NoZW1lXCI6IFwiU2lnbmF0dXJlXCIsXHJcbiAgICogICAgICAgXCJwYXJhbXNcIjoge1xyXG4gICAqICAgICAgICAgXCJrZXlJZFwiOiBcImZvb1wiLFxyXG4gICAqICAgICAgICAgXCJhbGdvcml0aG1cIjogXCJyc2Etc2hhMjU2XCIsXHJcbiAgICogICAgICAgICBcImhlYWRlcnNcIjogW1xyXG4gICAqICAgICAgICAgICBcImRhdGVcIiBvciBcIngtZGF0ZVwiLFxyXG4gICAqICAgICAgICAgICBcImRpZ2VzdFwiXHJcbiAgICogICAgICAgICBdLFxyXG4gICAqICAgICAgICAgXCJzaWduYXR1cmVcIjogXCJiYXNlNjRcIlxyXG4gICAqICAgICAgIH0sXHJcbiAgICogICAgICAgXCJzaWduaW5nU3RyaW5nXCI6IFwicmVhZHkgdG8gYmUgcGFzc2VkIHRvIGNyeXB0by52ZXJpZnkoKVwiXHJcbiAgICogICAgIH1cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0IGFuIGh0dHAuU2VydmVyUmVxdWVzdC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBhbiBvcHRpb25hbCBvcHRpb25zIG9iamVjdCB3aXRoOlxyXG4gICAqICAgICAgICAgICAgICAgICAgIC0gY2xvY2tTa2V3OiBhbGxvd2VkIGNsb2NrIHNrZXcgaW4gc2Vjb25kcyAoZGVmYXVsdCAzMDApLlxyXG4gICAqICAgICAgICAgICAgICAgICAgIC0gaGVhZGVyczogcmVxdWlyZWQgaGVhZGVyIG5hbWVzIChkZWY6IGRhdGUgb3IgeC1kYXRlKVxyXG4gICAqICAgICAgICAgICAgICAgICAgIC0gYWxnb3JpdGhtczogYWxnb3JpdGhtcyB0byBzdXBwb3J0IChkZWZhdWx0OiBhbGwpLlxyXG4gICAqICAgICAgICAgICAgICAgICAgIC0gc3RyaWN0OiBzaG91bGQgZW5mb3JjZSBsYXRlc3Qgc3BlYyBwYXJzaW5nXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIChkZWZhdWx0OiBmYWxzZSkuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBwYXJzZWQgb3V0IG9iamVjdCAoc2VlIGFib3ZlKS5cclxuICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IG9uIGludmFsaWQgaW5wdXQuXHJcbiAgICogQHRocm93cyB7SW52YWxpZEhlYWRlckVycm9yfSBvbiBhbiBpbnZhbGlkIEF1dGhvcml6YXRpb24gaGVhZGVyIGVycm9yLlxyXG4gICAqIEB0aHJvd3Mge0ludmFsaWRQYXJhbXNFcnJvcn0gaWYgdGhlIHBhcmFtcyBpbiB0aGUgc2NoZW1lIGFyZSBpbnZhbGlkLlxyXG4gICAqIEB0aHJvd3Mge01pc3NpbmdIZWFkZXJFcnJvcn0gaWYgdGhlIHBhcmFtcyBpbmRpY2F0ZSBhIGhlYWRlciBub3QgcHJlc2VudCxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVpdGhlciBpbiB0aGUgcmVxdWVzdCBoZWFkZXJzIGZyb20gdGhlIHBhcmFtcyxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yIG5vdCBpbiB0aGUgcGFyYW1zIGZyb20gYSByZXF1aXJlZCBoZWFkZXJcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIG9wdGlvbnMuXHJcbiAgICogQHRocm93cyB7U3RyaWN0UGFyc2luZ0Vycm9yfSBpZiBvbGQgYXR0cmlidXRlcyBhcmUgdXNlZCBpbiBzdHJpY3QgcGFyc2luZ1xyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZS5cclxuICAgKiBAdGhyb3dzIHtFeHBpcmVkUmVxdWVzdEVycm9yfSBpZiB0aGUgdmFsdWUgb2YgZGF0ZSBvciB4LWRhdGUgZXhjZWVkcyBza2V3LlxyXG4gICAqL1xyXG4gIHBhcnNlUmVxdWVzdDogZnVuY3Rpb24gcGFyc2VSZXF1ZXN0KHJlcXVlc3QsIG9wdGlvbnMpIHtcclxuICAgIGFzc2VydC5vYmplY3QocmVxdWVzdCwgJ3JlcXVlc3QnKTtcclxuICAgIGFzc2VydC5vYmplY3QocmVxdWVzdC5oZWFkZXJzLCAncmVxdWVzdC5oZWFkZXJzJyk7XHJcbiAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIG9wdGlvbnMgPSB7fTtcclxuICAgIH1cclxuICAgIGlmIChvcHRpb25zLmhlYWRlcnMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBvcHRpb25zLmhlYWRlcnMgPSBbcmVxdWVzdC5oZWFkZXJzWyd4LWRhdGUnXSA/ICd4LWRhdGUnIDogJ2RhdGUnXTtcclxuICAgIH1cclxuICAgIGFzc2VydC5vYmplY3Qob3B0aW9ucywgJ29wdGlvbnMnKTtcclxuICAgIGFzc2VydC5hcnJheU9mU3RyaW5nKG9wdGlvbnMuaGVhZGVycywgJ29wdGlvbnMuaGVhZGVycycpO1xyXG4gICAgYXNzZXJ0Lm9wdGlvbmFsRmluaXRlKG9wdGlvbnMuY2xvY2tTa2V3LCAnb3B0aW9ucy5jbG9ja1NrZXcnKTtcclxuXHJcbiAgICB2YXIgYXV0aHpIZWFkZXJOYW1lID0gb3B0aW9ucy5hdXRob3JpemF0aW9uSGVhZGVyTmFtZSB8fCAnYXV0aG9yaXphdGlvbic7XHJcblxyXG4gICAgaWYgKCFyZXF1ZXN0LmhlYWRlcnNbYXV0aHpIZWFkZXJOYW1lXSkge1xyXG4gICAgICB0aHJvdyBuZXcgTWlzc2luZ0hlYWRlckVycm9yKCdubyAnICsgYXV0aHpIZWFkZXJOYW1lICsgJyBoZWFkZXIgJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ByZXNlbnQgaW4gdGhlIHJlcXVlc3QnKTtcclxuICAgIH1cclxuXHJcbiAgICBvcHRpb25zLmNsb2NrU2tldyA9IG9wdGlvbnMuY2xvY2tTa2V3IHx8IDMwMDtcclxuXHJcblxyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgdmFyIHN0YXRlID0gU3RhdGUuTmV3O1xyXG4gICAgdmFyIHN1YnN0YXRlID0gUGFyYW1zU3RhdGUuTmFtZTtcclxuICAgIHZhciB0bXBOYW1lID0gJyc7XHJcbiAgICB2YXIgdG1wVmFsdWUgPSAnJztcclxuXHJcbiAgICB2YXIgcGFyc2VkID0ge1xyXG4gICAgICBzY2hlbWU6ICcnLFxyXG4gICAgICBwYXJhbXM6IHt9LFxyXG4gICAgICBzaWduaW5nU3RyaW5nOiAnJ1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgYXV0aHogPSByZXF1ZXN0LmhlYWRlcnNbYXV0aHpIZWFkZXJOYW1lXTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBhdXRoei5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgYyA9IGF1dGh6LmNoYXJBdChpKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoTnVtYmVyKHN0YXRlKSkge1xyXG5cclxuICAgICAgY2FzZSBTdGF0ZS5OZXc6XHJcbiAgICAgICAgaWYgKGMgIT09ICcgJykgcGFyc2VkLnNjaGVtZSArPSBjO1xyXG4gICAgICAgIGVsc2Ugc3RhdGUgPSBTdGF0ZS5QYXJhbXM7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIFN0YXRlLlBhcmFtczpcclxuICAgICAgICBzd2l0Y2ggKE51bWJlcihzdWJzdGF0ZSkpIHtcclxuXHJcbiAgICAgICAgY2FzZSBQYXJhbXNTdGF0ZS5OYW1lOlxyXG4gICAgICAgICAgdmFyIGNvZGUgPSBjLmNoYXJDb2RlQXQoMCk7XHJcbiAgICAgICAgICAvLyByZXN0cmljdGVkIG5hbWUgb2YgQS1aIC8gYS16XHJcbiAgICAgICAgICBpZiAoKGNvZGUgPj0gMHg0MSAmJiBjb2RlIDw9IDB4NWEpIHx8IC8vIEEtWlxyXG4gICAgICAgICAgICAgIChjb2RlID49IDB4NjEgJiYgY29kZSA8PSAweDdhKSkgeyAvLyBhLXpcclxuICAgICAgICAgICAgdG1wTmFtZSArPSBjO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChjID09PSAnPScpIHtcclxuICAgICAgICAgICAgaWYgKHRtcE5hbWUubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkSGVhZGVyRXJyb3IoJ2JhZCBwYXJhbSBmb3JtYXQnKTtcclxuICAgICAgICAgICAgc3Vic3RhdGUgPSBQYXJhbXNTdGF0ZS5RdW90ZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkSGVhZGVyRXJyb3IoJ2JhZCBwYXJhbSBmb3JtYXQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIFBhcmFtc1N0YXRlLlF1b3RlOlxyXG4gICAgICAgICAgaWYgKGMgPT09ICdcIicpIHtcclxuICAgICAgICAgICAgdG1wVmFsdWUgPSAnJztcclxuICAgICAgICAgICAgc3Vic3RhdGUgPSBQYXJhbXNTdGF0ZS5WYWx1ZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkSGVhZGVyRXJyb3IoJ2JhZCBwYXJhbSBmb3JtYXQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIFBhcmFtc1N0YXRlLlZhbHVlOlxyXG4gICAgICAgICAgaWYgKGMgPT09ICdcIicpIHtcclxuICAgICAgICAgICAgcGFyc2VkLnBhcmFtc1t0bXBOYW1lXSA9IHRtcFZhbHVlO1xyXG4gICAgICAgICAgICBzdWJzdGF0ZSA9IFBhcmFtc1N0YXRlLkNvbW1hO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdG1wVmFsdWUgKz0gYztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIFBhcmFtc1N0YXRlLkNvbW1hOlxyXG4gICAgICAgICAgaWYgKGMgPT09ICcsJykge1xyXG4gICAgICAgICAgICB0bXBOYW1lID0gJyc7XHJcbiAgICAgICAgICAgIHN1YnN0YXRlID0gUGFyYW1zU3RhdGUuTmFtZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkSGVhZGVyRXJyb3IoJ2JhZCBwYXJhbSBmb3JtYXQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN1YnN0YXRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3Vic3RhdGUnKTtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXBhcnNlZC5wYXJhbXMuaGVhZGVycyB8fCBwYXJzZWQucGFyYW1zLmhlYWRlcnMgPT09ICcnKSB7XHJcbiAgICAgIGlmIChyZXF1ZXN0LmhlYWRlcnNbJ3gtZGF0ZSddKSB7XHJcbiAgICAgICAgcGFyc2VkLnBhcmFtcy5oZWFkZXJzID0gWyd4LWRhdGUnXTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwYXJzZWQucGFyYW1zLmhlYWRlcnMgPSBbJ2RhdGUnXTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGFyc2VkLnBhcmFtcy5oZWFkZXJzID0gcGFyc2VkLnBhcmFtcy5oZWFkZXJzLnNwbGl0KCcgJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTWluaW1hbGx5IHZhbGlkYXRlIHRoZSBwYXJzZWQgb2JqZWN0XHJcbiAgICBpZiAoIXBhcnNlZC5zY2hlbWUgfHwgcGFyc2VkLnNjaGVtZSAhPT0gJ1NpZ25hdHVyZScpXHJcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkSGVhZGVyRXJyb3IoJ3NjaGVtZSB3YXMgbm90IFwiU2lnbmF0dXJlXCInKTtcclxuXHJcbiAgICBpZiAoIXBhcnNlZC5wYXJhbXMua2V5SWQpXHJcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkSGVhZGVyRXJyb3IoJ2tleUlkIHdhcyBub3Qgc3BlY2lmaWVkJyk7XHJcblxyXG4gICAgaWYgKCFwYXJzZWQucGFyYW1zLmFsZ29yaXRobSlcclxuICAgICAgdGhyb3cgbmV3IEludmFsaWRIZWFkZXJFcnJvcignYWxnb3JpdGhtIHdhcyBub3Qgc3BlY2lmaWVkJyk7XHJcblxyXG4gICAgaWYgKCFwYXJzZWQucGFyYW1zLnNpZ25hdHVyZSlcclxuICAgICAgdGhyb3cgbmV3IEludmFsaWRIZWFkZXJFcnJvcignc2lnbmF0dXJlIHdhcyBub3Qgc3BlY2lmaWVkJyk7XHJcblxyXG4gICAgLy8gQ2hlY2sgdGhlIGFsZ29yaXRobSBhZ2FpbnN0IHRoZSBvZmZpY2lhbCBsaXN0XHJcbiAgICBwYXJzZWQucGFyYW1zLmFsZ29yaXRobSA9IHBhcnNlZC5wYXJhbXMuYWxnb3JpdGhtLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICB2YWxpZGF0ZUFsZ29yaXRobShwYXJzZWQucGFyYW1zLmFsZ29yaXRobSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgSW52YWxpZEFsZ29yaXRobUVycm9yKVxyXG4gICAgICAgIHRocm93IChuZXcgSW52YWxpZFBhcmFtc0Vycm9yKHBhcnNlZC5wYXJhbXMuYWxnb3JpdGhtICsgJyBpcyBub3QgJyArXHJcbiAgICAgICAgICAnc3VwcG9ydGVkJykpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhyb3cgKGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEJ1aWxkIHRoZSBzaWduaW5nU3RyaW5nXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgcGFyc2VkLnBhcmFtcy5oZWFkZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBoID0gcGFyc2VkLnBhcmFtcy5oZWFkZXJzW2ldLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgIHBhcnNlZC5wYXJhbXMuaGVhZGVyc1tpXSA9IGg7XHJcblxyXG4gICAgICBpZiAoaCA9PT0gJ3JlcXVlc3QtbGluZScpIHtcclxuICAgICAgICBpZiAoIW9wdGlvbnMuc3RyaWN0KSB7XHJcbiAgICAgICAgICAvKlxyXG4gICAgICAgICAgICogV2UgYWxsb3cgaGVhZGVycyBmcm9tIHRoZSBvbGRlciBzcGVjIGRyYWZ0cyBpZiBzdHJpY3QgcGFyc2luZyBpc24ndFxyXG4gICAgICAgICAgICogc3BlY2lmaWVkIGluIG9wdGlvbnMuXHJcbiAgICAgICAgICAgKi9cclxuICAgICAgICAgIHBhcnNlZC5zaWduaW5nU3RyaW5nICs9XHJcbiAgICAgICAgICAgIHJlcXVlc3QubWV0aG9kICsgJyAnICsgcmVxdWVzdC51cmwgKyAnIEhUVFAvJyArIHJlcXVlc3QuaHR0cFZlcnNpb247XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8qIFN0cmljdCBwYXJzaW5nIGRvZXNuJ3QgYWxsb3cgb2xkZXIgZHJhZnQgaGVhZGVycy4gKi9cclxuICAgICAgICAgIHRocm93IChuZXcgU3RyaWN0UGFyc2luZ0Vycm9yKCdyZXF1ZXN0LWxpbmUgaXMgbm90IGEgdmFsaWQgaGVhZGVyICcgK1xyXG4gICAgICAgICAgICAnd2l0aCBzdHJpY3QgcGFyc2luZyBlbmFibGVkLicpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoaCA9PT0gJyhyZXF1ZXN0LXRhcmdldCknKSB7XHJcbiAgICAgICAgcGFyc2VkLnNpZ25pbmdTdHJpbmcgKz1cclxuICAgICAgICAgICcocmVxdWVzdC10YXJnZXQpOiAnICsgcmVxdWVzdC5tZXRob2QudG9Mb3dlckNhc2UoKSArICcgJyArXHJcbiAgICAgICAgICByZXF1ZXN0LnVybDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSByZXF1ZXN0LmhlYWRlcnNbaF07XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICB0aHJvdyBuZXcgTWlzc2luZ0hlYWRlckVycm9yKGggKyAnIHdhcyBub3QgaW4gdGhlIHJlcXVlc3QnKTtcclxuICAgICAgICBwYXJzZWQuc2lnbmluZ1N0cmluZyArPSBoICsgJzogJyArIHZhbHVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoKGkgKyAxKSA8IHBhcnNlZC5wYXJhbXMuaGVhZGVycy5sZW5ndGgpXHJcbiAgICAgICAgcGFyc2VkLnNpZ25pbmdTdHJpbmcgKz0gJ1xcbic7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgYWdhaW5zdCB0aGUgY29uc3RyYWludHNcclxuICAgIHZhciBkYXRlO1xyXG4gICAgaWYgKHJlcXVlc3QuaGVhZGVycy5kYXRlIHx8IHJlcXVlc3QuaGVhZGVyc1sneC1kYXRlJ10pIHtcclxuICAgICAgICBpZiAocmVxdWVzdC5oZWFkZXJzWyd4LWRhdGUnXSkge1xyXG4gICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKHJlcXVlc3QuaGVhZGVyc1sneC1kYXRlJ10pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBkYXRlID0gbmV3IERhdGUocmVxdWVzdC5oZWFkZXJzLmRhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAgIHZhciBza2V3ID0gTWF0aC5hYnMobm93LmdldFRpbWUoKSAtIGRhdGUuZ2V0VGltZSgpKTtcclxuXHJcbiAgICAgIGlmIChza2V3ID4gb3B0aW9ucy5jbG9ja1NrZXcgKiAxMDAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEV4cGlyZWRSZXF1ZXN0RXJyb3IoJ2Nsb2NrIHNrZXcgb2YgJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNrZXcgLyAxMDAwKSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Mgd2FzIGdyZWF0ZXIgdGhhbiAnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmNsb2NrU2tldyArICdzJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvcHRpb25zLmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGRyKSB7XHJcbiAgICAgIC8vIFJlbWVtYmVyIHRoYXQgd2UgYWxyZWFkeSBjaGVja2VkIGFueSBoZWFkZXJzIGluIHRoZSBwYXJhbXNcclxuICAgICAgLy8gd2VyZSBpbiB0aGUgcmVxdWVzdCwgc28gaWYgdGhpcyBwYXNzZXMgd2UncmUgZ29vZC5cclxuICAgICAgaWYgKHBhcnNlZC5wYXJhbXMuaGVhZGVycy5pbmRleE9mKGhkci50b0xvd2VyQ2FzZSgpKSA8IDApXHJcbiAgICAgICAgdGhyb3cgbmV3IE1pc3NpbmdIZWFkZXJFcnJvcihoZHIgKyAnIHdhcyBub3QgYSBzaWduZWQgaGVhZGVyJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAob3B0aW9ucy5hbGdvcml0aG1zKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLmFsZ29yaXRobXMuaW5kZXhPZihwYXJzZWQucGFyYW1zLmFsZ29yaXRobSkgPT09IC0xKVxyXG4gICAgICAgIHRocm93IG5ldyBJbnZhbGlkUGFyYW1zRXJyb3IocGFyc2VkLnBhcmFtcy5hbGdvcml0aG0gK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyBpcyBub3QgYSBzdXBwb3J0ZWQgYWxnb3JpdGhtJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VkLmFsZ29yaXRobSA9IHBhcnNlZC5wYXJhbXMuYWxnb3JpdGhtLnRvVXBwZXJDYXNlKCk7XHJcbiAgICBwYXJzZWQua2V5SWQgPSBwYXJzZWQucGFyYW1zLmtleUlkO1xyXG4gICAgcmV0dXJuIHBhcnNlZDtcclxuICB9XHJcblxyXG59O1xyXG4iLCIvLyBDb3B5cmlnaHQgMjAxNSBKb3llbnQsIEluYy5cclxuXHJcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQtcGx1cycpO1xyXG52YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XHJcbnZhciBzc2hwayA9IHJlcXVpcmUoJ3NzaHBrJyk7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuXHJcbnZhciBIQVNIX0FMR09TID0gdXRpbHMuSEFTSF9BTEdPUztcclxudmFyIFBLX0FMR09TID0gdXRpbHMuUEtfQUxHT1M7XHJcbnZhciBJbnZhbGlkQWxnb3JpdGhtRXJyb3IgPSB1dGlscy5JbnZhbGlkQWxnb3JpdGhtRXJyb3I7XHJcbnZhciBIdHRwU2lnbmF0dXJlRXJyb3IgPSB1dGlscy5IdHRwU2lnbmF0dXJlRXJyb3I7XHJcbnZhciB2YWxpZGF0ZUFsZ29yaXRobSA9IHV0aWxzLnZhbGlkYXRlQWxnb3JpdGhtO1xyXG5cclxuLy8vLS0tIEV4cG9ydGVkIEFQSVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgLyoqXHJcbiAgICogVmVyaWZ5IFJTQS9EU0Egc2lnbmF0dXJlIGFnYWluc3QgcHVibGljIGtleS4gIFlvdSBhcmUgZXhwZWN0ZWQgdG8gcGFzcyBpblxyXG4gICAqIGFuIG9iamVjdCB0aGF0IHdhcyByZXR1cm5lZCBmcm9tIGBwYXJzZSgpYC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJzZWRTaWduYXR1cmUgdGhlIG9iamVjdCB5b3UgZ290IGZyb20gYHBhcnNlYC5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gcHVia2V5IFJTQS9EU0EgcHJpdmF0ZSBrZXkgUEVNLlxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdmFsaWQsIGZhbHNlIG90aGVyd2lzZS5cclxuICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IGlmIHlvdSBwYXNzIGluIGJhZCBhcmd1bWVudHMuXHJcbiAgICogQHRocm93cyB7SW52YWxpZEFsZ29yaXRobUVycm9yfVxyXG4gICAqL1xyXG4gIHZlcmlmeVNpZ25hdHVyZTogZnVuY3Rpb24gdmVyaWZ5U2lnbmF0dXJlKHBhcnNlZFNpZ25hdHVyZSwgcHVia2V5KSB7XHJcbiAgICBhc3NlcnQub2JqZWN0KHBhcnNlZFNpZ25hdHVyZSwgJ3BhcnNlZFNpZ25hdHVyZScpO1xyXG4gICAgaWYgKHR5cGVvZiAocHVia2V5KSA9PT0gJ3N0cmluZycgfHwgQnVmZmVyLmlzQnVmZmVyKHB1YmtleSkpXHJcbiAgICAgIHB1YmtleSA9IHNzaHBrLnBhcnNlS2V5KHB1YmtleSk7XHJcbiAgICBhc3NlcnQub2soc3NocGsuS2V5LmlzS2V5KHB1YmtleSwgWzEsIDFdKSwgJ3B1YmtleSBtdXN0IGJlIGEgc3NocGsuS2V5Jyk7XHJcblxyXG4gICAgdmFyIGFsZyA9IHZhbGlkYXRlQWxnb3JpdGhtKHBhcnNlZFNpZ25hdHVyZS5hbGdvcml0aG0pO1xyXG4gICAgaWYgKGFsZ1swXSA9PT0gJ2htYWMnIHx8IGFsZ1swXSAhPT0gcHVia2V5LnR5cGUpXHJcbiAgICAgIHJldHVybiAoZmFsc2UpO1xyXG5cclxuICAgIHZhciB2ID0gcHVia2V5LmNyZWF0ZVZlcmlmeShhbGdbMV0pO1xyXG4gICAgdi51cGRhdGUocGFyc2VkU2lnbmF0dXJlLnNpZ25pbmdTdHJpbmcpO1xyXG4gICAgcmV0dXJuICh2LnZlcmlmeShwYXJzZWRTaWduYXR1cmUucGFyYW1zLnNpZ25hdHVyZSwgJ2Jhc2U2NCcpKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBWZXJpZnkgSE1BQyBhZ2FpbnN0IHNoYXJlZCBzZWNyZXQuICBZb3UgYXJlIGV4cGVjdGVkIHRvIHBhc3MgaW4gYW4gb2JqZWN0XHJcbiAgICogdGhhdCB3YXMgcmV0dXJuZWQgZnJvbSBgcGFyc2UoKWAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyc2VkU2lnbmF0dXJlIHRoZSBvYmplY3QgeW91IGdvdCBmcm9tIGBwYXJzZWAuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlY3JldCBITUFDIHNoYXJlZCBzZWNyZXQuXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB2YWxpZCwgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4gICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gaWYgeW91IHBhc3MgaW4gYmFkIGFyZ3VtZW50cy5cclxuICAgKiBAdGhyb3dzIHtJbnZhbGlkQWxnb3JpdGhtRXJyb3J9XHJcbiAgICovXHJcbiAgdmVyaWZ5SE1BQzogZnVuY3Rpb24gdmVyaWZ5SE1BQyhwYXJzZWRTaWduYXR1cmUsIHNlY3JldCkge1xyXG4gICAgYXNzZXJ0Lm9iamVjdChwYXJzZWRTaWduYXR1cmUsICdwYXJzZWRITUFDJyk7XHJcbiAgICBhc3NlcnQuc3RyaW5nKHNlY3JldCwgJ3NlY3JldCcpO1xyXG5cclxuICAgIHZhciBhbGcgPSB2YWxpZGF0ZUFsZ29yaXRobShwYXJzZWRTaWduYXR1cmUuYWxnb3JpdGhtKTtcclxuICAgIGlmIChhbGdbMF0gIT09ICdobWFjJylcclxuICAgICAgcmV0dXJuIChmYWxzZSk7XHJcblxyXG4gICAgdmFyIGhhc2hBbGcgPSBhbGdbMV0udG9VcHBlckNhc2UoKTtcclxuXHJcbiAgICB2YXIgaG1hYyA9IGNyeXB0by5jcmVhdGVIbWFjKGhhc2hBbGcsIHNlY3JldCk7XHJcbiAgICBobWFjLnVwZGF0ZShwYXJzZWRTaWduYXR1cmUuc2lnbmluZ1N0cmluZyk7XHJcblxyXG4gICAgLypcclxuICAgICAqIE5vdyBkb3VibGUtaGFzaCB0byBhdm9pZCBsZWFraW5nIHRpbWluZyBpbmZvcm1hdGlvbiAtIHRoZXJlJ3NcclxuICAgICAqIG5vIGVhc3kgY29uc3RhbnQtdGltZSBjb21wYXJlIGluIEpTLCBzbyB3ZSB1c2UgdGhpcyBhcHByb2FjaFxyXG4gICAgICogaW5zdGVhZC4gU2VlIGZvciBtb3JlIGluZm86XHJcbiAgICAgKiBodHRwczovL3d3dy5pc2VjcGFydG5lcnMuY29tL2Jsb2cvMjAxMS9mZWJydWFyeS9kb3VibGUtaG1hYy1cclxuICAgICAqIHZlcmlmaWNhdGlvbi5hc3B4XHJcbiAgICAgKi9cclxuICAgIHZhciBoMSA9IGNyeXB0by5jcmVhdGVIbWFjKGhhc2hBbGcsIHNlY3JldCk7XHJcbiAgICBoMS51cGRhdGUoaG1hYy5kaWdlc3QoKSk7XHJcbiAgICBoMSA9IGgxLmRpZ2VzdCgpO1xyXG4gICAgdmFyIGgyID0gY3J5cHRvLmNyZWF0ZUhtYWMoaGFzaEFsZywgc2VjcmV0KTtcclxuICAgIGgyLnVwZGF0ZShuZXcgQnVmZmVyKHBhcnNlZFNpZ25hdHVyZS5wYXJhbXMuc2lnbmF0dXJlLCAnYmFzZTY0JykpO1xyXG4gICAgaDIgPSBoMi5kaWdlc3QoKTtcclxuXHJcbiAgICAvKiBOb2RlIDAuOCByZXR1cm5zIHN0cmluZ3MgZnJvbSAuZGlnZXN0KCkuICovXHJcbiAgICBpZiAodHlwZW9mIChoMSkgPT09ICdzdHJpbmcnKVxyXG4gICAgICByZXR1cm4gKGgxID09PSBoMik7XHJcbiAgICAvKiBBbmQgbm9kZSAwLjEwIGxhY2tzIHRoZSAuZXF1YWxzKCkgbWV0aG9kIG9uIEJ1ZmZlcnMuICovXHJcbiAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKGgxKSAmJiAhaDEuZXF1YWxzKVxyXG4gICAgICByZXR1cm4gKGgxLnRvU3RyaW5nKCdiaW5hcnknKSA9PT0gaDIudG9TdHJpbmcoJ2JpbmFyeScpKTtcclxuXHJcbiAgICByZXR1cm4gKGgxLmVxdWFscyhoMikpO1xyXG4gIH1cclxufTtcclxuIiwiLy8gQ29weXJpZ2h0IDIwMTUgSm95ZW50LCBJbmMuXHJcblxyXG52YXIgcGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXInKTtcclxudmFyIHNpZ25lciA9IHJlcXVpcmUoJy4vc2lnbmVyJyk7XHJcbnZhciB2ZXJpZnkgPSByZXF1aXJlKCcuL3ZlcmlmeScpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcblxyXG5cclxuXHJcbi8vLy0tLSBBUElcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICBwYXJzZTogcGFyc2VyLnBhcnNlUmVxdWVzdCxcclxuICBwYXJzZVJlcXVlc3Q6IHBhcnNlci5wYXJzZVJlcXVlc3QsXHJcblxyXG4gIHNpZ246IHNpZ25lci5zaWduUmVxdWVzdCxcclxuICBzaWduUmVxdWVzdDogc2lnbmVyLnNpZ25SZXF1ZXN0LFxyXG4gIGNyZWF0ZVNpZ25lcjogc2lnbmVyLmNyZWF0ZVNpZ25lcixcclxuICBpc1NpZ25lcjogc2lnbmVyLmlzU2lnbmVyLFxyXG5cclxuICBzc2hLZXlUb1BFTTogdXRpbHMuc3NoS2V5VG9QRU0sXHJcbiAgc3NoS2V5RmluZ2VycHJpbnQ6IHV0aWxzLmZpbmdlcnByaW50LFxyXG4gIHBlbVRvUnNhU1NIS2V5OiB1dGlscy5wZW1Ub1JzYVNTSEtleSxcclxuXHJcbiAgdmVyaWZ5OiB2ZXJpZnkudmVyaWZ5U2lnbmF0dXJlLFxyXG4gIHZlcmlmeVNpZ25hdHVyZTogdmVyaWZ5LnZlcmlmeVNpZ25hdHVyZSxcclxuICB2ZXJpZnlITUFDOiB2ZXJpZnkudmVyaWZ5SE1BQ1xyXG59O1xyXG4iLCIvLyBDb3B5cmlnaHQgMjAxMiBKb3llbnQsIEluYy4gIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcclxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xyXG52YXIgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcclxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XHJcbnZhciBzc2hwayA9IHJlcXVpcmUoJ3NzaHBrJyk7XHJcbnZhciBqc3ByaW0gPSByZXF1aXJlKCdqc3ByaW0nKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG5cclxudmFyIHNwcmludGYgPSByZXF1aXJlKCd1dGlsJykuZm9ybWF0O1xyXG5cclxudmFyIEhBU0hfQUxHT1MgPSB1dGlscy5IQVNIX0FMR09TO1xyXG52YXIgUEtfQUxHT1MgPSB1dGlscy5QS19BTEdPUztcclxudmFyIEludmFsaWRBbGdvcml0aG1FcnJvciA9IHV0aWxzLkludmFsaWRBbGdvcml0aG1FcnJvcjtcclxudmFyIEh0dHBTaWduYXR1cmVFcnJvciA9IHV0aWxzLkh0dHBTaWduYXR1cmVFcnJvcjtcclxudmFyIHZhbGlkYXRlQWxnb3JpdGhtID0gdXRpbHMudmFsaWRhdGVBbGdvcml0aG07XHJcblxyXG4vLy8tLS0gR2xvYmFsc1xyXG5cclxudmFyIEFVVEhaX0ZNVCA9XHJcbiAgJ1NpZ25hdHVyZSBrZXlJZD1cIiVzXCIsYWxnb3JpdGhtPVwiJXNcIixoZWFkZXJzPVwiJXNcIixzaWduYXR1cmU9XCIlc1wiJztcclxuXHJcbi8vLy0tLSBTcGVjaWZpYyBFcnJvcnNcclxuXHJcbmZ1bmN0aW9uIE1pc3NpbmdIZWFkZXJFcnJvcihtZXNzYWdlKSB7XHJcbiAgSHR0cFNpZ25hdHVyZUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSwgTWlzc2luZ0hlYWRlckVycm9yKTtcclxufVxyXG51dGlsLmluaGVyaXRzKE1pc3NpbmdIZWFkZXJFcnJvciwgSHR0cFNpZ25hdHVyZUVycm9yKTtcclxuXHJcbmZ1bmN0aW9uIFN0cmljdFBhcnNpbmdFcnJvcihtZXNzYWdlKSB7XHJcbiAgSHR0cFNpZ25hdHVyZUVycm9yLmNhbGwodGhpcywgbWVzc2FnZSwgU3RyaWN0UGFyc2luZ0Vycm9yKTtcclxufVxyXG51dGlsLmluaGVyaXRzKFN0cmljdFBhcnNpbmdFcnJvciwgSHR0cFNpZ25hdHVyZUVycm9yKTtcclxuXHJcbi8qIFNlZSBjcmVhdGVTaWduZXIoKSAqL1xyXG5mdW5jdGlvbiBSZXF1ZXN0U2lnbmVyKG9wdGlvbnMpIHtcclxuICBhc3NlcnQub2JqZWN0KG9wdGlvbnMsICdvcHRpb25zJyk7XHJcblxyXG4gIHZhciBhbGcgPSBbXTtcclxuICBpZiAob3B0aW9ucy5hbGdvcml0aG0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgYXNzZXJ0LnN0cmluZyhvcHRpb25zLmFsZ29yaXRobSwgJ29wdGlvbnMuYWxnb3JpdGhtJyk7XHJcbiAgICBhbGcgPSB2YWxpZGF0ZUFsZ29yaXRobShvcHRpb25zLmFsZ29yaXRobSk7XHJcbiAgfVxyXG4gIHRoaXMucnNfYWxnID0gYWxnO1xyXG5cclxuICAvKlxyXG4gICAqIFJlcXVlc3RTaWduZXJzIGNvbWUgaW4gdHdvIHZhcmlldGllczogb25lcyB3aXRoIGFuIHJzX3NpZ25GdW5jLCBhbmQgb25lc1xyXG4gICAqIHdpdGggYW4gcnNfc2lnbmVyLlxyXG4gICAqXHJcbiAgICogcnNfc2lnbkZ1bmMtYmFzZWQgUmVxdWVzdFNpZ25lcnMgaGF2ZSB0byBidWlsZCB1cCB0aGVpciBlbnRpcmUgc2lnbmluZ1xyXG4gICAqIHN0cmluZyB3aXRoaW4gdGhlIHJzX2xpbmVzIGFycmF5IGFuZCBnaXZlIGl0IHRvIHJzX3NpZ25GdW5jIGFzIGEgc2luZ2xlXHJcbiAgICogY29uY2F0J2QgYmxvYi4gcnNfc2lnbmVyLWJhc2VkIFJlcXVlc3RTaWduZXJzIGNhbiBhZGQgYSBsaW5lIGF0IGEgdGltZSB0b1xyXG4gICAqIHRoZWlyIHNpZ25pbmcgc3RhdGUgYnkgdXNpbmcgcnNfc2lnbmVyLnVwZGF0ZSgpLCB0aHVzIG9ubHkgbmVlZGluZyB0b1xyXG4gICAqIGJ1ZmZlciB0aGUgaGFzaCBmdW5jdGlvbiBzdGF0ZSBhbmQgb25lIGxpbmUgYXQgYSB0aW1lLlxyXG4gICAqL1xyXG4gIGlmIChvcHRpb25zLnNpZ24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgYXNzZXJ0LmZ1bmMob3B0aW9ucy5zaWduLCAnb3B0aW9ucy5zaWduJyk7XHJcbiAgICB0aGlzLnJzX3NpZ25GdW5jID0gb3B0aW9ucy5zaWduO1xyXG5cclxuICB9IGVsc2UgaWYgKGFsZ1swXSA9PT0gJ2htYWMnICYmIG9wdGlvbnMua2V5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgIGFzc2VydC5zdHJpbmcob3B0aW9ucy5rZXlJZCwgJ29wdGlvbnMua2V5SWQnKTtcclxuICAgIHRoaXMucnNfa2V5SWQgPSBvcHRpb25zLmtleUlkO1xyXG5cclxuICAgIGlmICh0eXBlb2YgKG9wdGlvbnMua2V5KSAhPT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLmtleSkpXHJcbiAgICAgIHRocm93IChuZXcgVHlwZUVycm9yKCdvcHRpb25zLmtleSBmb3IgSE1BQyBtdXN0IGJlIGEgc3RyaW5nIG9yIEJ1ZmZlcicpKTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogTWFrZSBhbiByc19zaWduZXIgZm9yIEhNQUNzLCBub3QgYSByc19zaWduRnVuYyAtLSBITUFDcyBkaWdlc3QgdGhlaXJcclxuICAgICAqIGRhdGEgaW4gY2h1bmtzIHJhdGhlciB0aGFuIHJlcXVpcmluZyBpdCBhbGwgdG8gYmUgZ2l2ZW4gaW4gb25lIGdvXHJcbiAgICAgKiBhdCB0aGUgZW5kLCBzbyB0aGV5IGFyZSBtb3JlIHNpbWlsYXIgdG8gc2lnbmVycyB0aGFuIHNpZ25GdW5jcy5cclxuICAgICAqL1xyXG4gICAgdGhpcy5yc19zaWduZXIgPSBjcnlwdG8uY3JlYXRlSG1hYyhhbGdbMV0udG9VcHBlckNhc2UoKSwgb3B0aW9ucy5rZXkpO1xyXG4gICAgdGhpcy5yc19zaWduZXIuc2lnbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGRpZ2VzdCA9IHRoaXMuZGlnZXN0KCdiYXNlNjQnKTtcclxuICAgICAgcmV0dXJuICh7XHJcbiAgICAgICAgaGFzaEFsZ29yaXRobTogYWxnWzFdLFxyXG4gICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7IHJldHVybiAoZGlnZXN0KTsgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gIH0gZWxzZSBpZiAob3B0aW9ucy5rZXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgdmFyIGtleSA9IG9wdGlvbnMua2V5O1xyXG4gICAgaWYgKHR5cGVvZiAoa2V5KSA9PT0gJ3N0cmluZycgfHwgQnVmZmVyLmlzQnVmZmVyKGtleSkpXHJcbiAgICAgIGtleSA9IHNzaHBrLnBhcnNlUHJpdmF0ZUtleShrZXkpO1xyXG5cclxuICAgIGFzc2VydC5vayhzc2hway5Qcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXksIFsxLCAyXSksXHJcbiAgICAgICdvcHRpb25zLmtleSBtdXN0IGJlIGEgc3NocGsuUHJpdmF0ZUtleScpO1xyXG4gICAgdGhpcy5yc19rZXkgPSBrZXk7XHJcblxyXG4gICAgYXNzZXJ0LnN0cmluZyhvcHRpb25zLmtleUlkLCAnb3B0aW9ucy5rZXlJZCcpO1xyXG4gICAgdGhpcy5yc19rZXlJZCA9IG9wdGlvbnMua2V5SWQ7XHJcblxyXG4gICAgaWYgKCFQS19BTEdPU1trZXkudHlwZV0pIHtcclxuICAgICAgdGhyb3cgKG5ldyBJbnZhbGlkQWxnb3JpdGhtRXJyb3Ioa2V5LnR5cGUudG9VcHBlckNhc2UoKSArICcgdHlwZSAnICtcclxuICAgICAgICAna2V5cyBhcmUgbm90IHN1cHBvcnRlZCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYWxnWzBdICE9PSB1bmRlZmluZWQgJiYga2V5LnR5cGUgIT09IGFsZ1swXSkge1xyXG4gICAgICB0aHJvdyAobmV3IEludmFsaWRBbGdvcml0aG1FcnJvcignb3B0aW9ucy5rZXkgbXVzdCBiZSBhICcgK1xyXG4gICAgICAgIGFsZ1swXS50b1VwcGVyQ2FzZSgpICsgJyBrZXksIHdhcyBnaXZlbiBhICcgK1xyXG4gICAgICAgIGtleS50eXBlLnRvVXBwZXJDYXNlKCkgKyAnIGtleSBpbnN0ZWFkJykpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucnNfc2lnbmVyID0ga2V5LmNyZWF0ZVNpZ24oYWxnWzFdKTtcclxuXHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IChuZXcgVHlwZUVycm9yKCdvcHRpb25zLnNpZ24gKGZ1bmMpIG9yIG9wdGlvbnMua2V5IGlzIHJlcXVpcmVkJykpO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5yc19oZWFkZXJzID0gW107XHJcbiAgdGhpcy5yc19saW5lcyA9IFtdO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkcyBhIGhlYWRlciB0byBiZSBzaWduZWQsIHdpdGggaXRzIHZhbHVlLCBpbnRvIHRoaXMgc2lnbmVyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVyXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHZhbHVlIHdyaXR0ZW5cclxuICovXHJcblJlcXVlc3RTaWduZXIucHJvdG90eXBlLndyaXRlSGVhZGVyID0gZnVuY3Rpb24gKGhlYWRlciwgdmFsdWUpIHtcclxuICBhc3NlcnQuc3RyaW5nKGhlYWRlciwgJ2hlYWRlcicpO1xyXG4gIGhlYWRlciA9IGhlYWRlci50b0xvd2VyQ2FzZSgpO1xyXG4gIGFzc2VydC5zdHJpbmcodmFsdWUsICd2YWx1ZScpO1xyXG5cclxuICB0aGlzLnJzX2hlYWRlcnMucHVzaChoZWFkZXIpO1xyXG5cclxuICBpZiAodGhpcy5yc19zaWduRnVuYykge1xyXG4gICAgdGhpcy5yc19saW5lcy5wdXNoKGhlYWRlciArICc6ICcgKyB2YWx1ZSk7XHJcblxyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgbGluZSA9IGhlYWRlciArICc6ICcgKyB2YWx1ZTtcclxuICAgIGlmICh0aGlzLnJzX2hlYWRlcnMubGVuZ3RoID4gMClcclxuICAgICAgbGluZSA9ICdcXG4nICsgbGluZTtcclxuICAgIHRoaXMucnNfc2lnbmVyLnVwZGF0ZShsaW5lKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAodmFsdWUpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgYSBkZWZhdWx0IERhdGUgaGVhZGVyLCByZXR1cm5pbmcgaXRzIHZhbHVlLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5SZXF1ZXN0U2lnbmVyLnByb3RvdHlwZS53cml0ZURhdGVIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuICh0aGlzLndyaXRlSGVhZGVyKCdkYXRlJywganNwcmltLnJmYzExMjMobmV3IERhdGUoKSkpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGRzIHRoZSByZXF1ZXN0IHRhcmdldCBsaW5lIHRvIGJlIHNpZ25lZC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZCwgSFRUUCBtZXRob2QgKGUuZy4gJ2dldCcsICdwb3N0JywgJ3B1dCcpXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXHJcbiAqL1xyXG5SZXF1ZXN0U2lnbmVyLnByb3RvdHlwZS53cml0ZVRhcmdldCA9IGZ1bmN0aW9uIChtZXRob2QsIHBhdGgpIHtcclxuICBhc3NlcnQuc3RyaW5nKG1ldGhvZCwgJ21ldGhvZCcpO1xyXG4gIGFzc2VydC5zdHJpbmcocGF0aCwgJ3BhdGgnKTtcclxuICBtZXRob2QgPSBtZXRob2QudG9Mb3dlckNhc2UoKTtcclxuICB0aGlzLndyaXRlSGVhZGVyKCcocmVxdWVzdC10YXJnZXQpJywgbWV0aG9kICsgJyAnICsgcGF0aCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2FsY3VsYXRlIHRoZSB2YWx1ZSBmb3IgdGhlIEF1dGhvcml6YXRpb24gaGVhZGVyIG9uIHRoaXMgcmVxdWVzdFxyXG4gKiBhc3luY2hyb25vdXNseS5cclxuICpcclxuICogQHBhcmFtIHtGdW5jfSBjYWxsYmFjayAoZXJyLCBhdXRoeilcclxuICovXHJcblJlcXVlc3RTaWduZXIucHJvdG90eXBlLnNpZ24gPSBmdW5jdGlvbiAoY2IpIHtcclxuICBhc3NlcnQuZnVuYyhjYiwgJ2NhbGxiYWNrJyk7XHJcblxyXG4gIGlmICh0aGlzLnJzX2hlYWRlcnMubGVuZ3RoIDwgMSlcclxuICAgIHRocm93IChuZXcgRXJyb3IoJ0F0IGxlYXN0IG9uZSBoZWFkZXIgbXVzdCBiZSBzaWduZWQnKSk7XHJcblxyXG4gIHZhciBhbGcsIGF1dGh6O1xyXG4gIGlmICh0aGlzLnJzX3NpZ25GdW5jKSB7XHJcbiAgICB2YXIgZGF0YSA9IHRoaXMucnNfbGluZXMuam9pbignXFxuJyk7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLnJzX3NpZ25GdW5jKGRhdGEsIGZ1bmN0aW9uIChlcnIsIHNpZykge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2IoZXJyKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhc3NlcnQub2JqZWN0KHNpZywgJ3NpZ25hdHVyZScpO1xyXG4gICAgICAgIGFzc2VydC5zdHJpbmcoc2lnLmtleUlkLCAnc2lnbmF0dXJlLmtleUlkJyk7XHJcbiAgICAgICAgYXNzZXJ0LnN0cmluZyhzaWcuYWxnb3JpdGhtLCAnc2lnbmF0dXJlLmFsZ29yaXRobScpO1xyXG4gICAgICAgIGFzc2VydC5zdHJpbmcoc2lnLnNpZ25hdHVyZSwgJ3NpZ25hdHVyZS5zaWduYXR1cmUnKTtcclxuICAgICAgICBhbGcgPSB2YWxpZGF0ZUFsZ29yaXRobShzaWcuYWxnb3JpdGhtKTtcclxuXHJcbiAgICAgICAgYXV0aHogPSBzcHJpbnRmKEFVVEhaX0ZNVCxcclxuICAgICAgICAgIHNpZy5rZXlJZCxcclxuICAgICAgICAgIHNpZy5hbGdvcml0aG0sXHJcbiAgICAgICAgICBzZWxmLnJzX2hlYWRlcnMuam9pbignICcpLFxyXG4gICAgICAgICAgc2lnLnNpZ25hdHVyZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBjYihlKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgY2IobnVsbCwgYXV0aHopO1xyXG4gICAgfSk7XHJcblxyXG4gIH0gZWxzZSB7XHJcbiAgICB0cnkge1xyXG4gICAgICB2YXIgc2lnT2JqID0gdGhpcy5yc19zaWduZXIuc2lnbigpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjYihlKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgYWxnID0gKHRoaXMucnNfYWxnWzBdIHx8IHRoaXMucnNfa2V5LnR5cGUpICsgJy0nICsgc2lnT2JqLmhhc2hBbGdvcml0aG07XHJcbiAgICB2YXIgc2lnbmF0dXJlID0gc2lnT2JqLnRvU3RyaW5nKCk7XHJcbiAgICBhdXRoeiA9IHNwcmludGYoQVVUSFpfRk1ULFxyXG4gICAgICB0aGlzLnJzX2tleUlkLFxyXG4gICAgICBhbGcsXHJcbiAgICAgIHRoaXMucnNfaGVhZGVycy5qb2luKCcgJyksXHJcbiAgICAgIHNpZ25hdHVyZSk7XHJcbiAgICBjYihudWxsLCBhdXRoeik7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8vLS0tIEV4cG9ydGVkIEFQSVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgLyoqXHJcbiAgICogSWRlbnRpZmllcyB3aGV0aGVyIGEgZ2l2ZW4gb2JqZWN0IGlzIGEgcmVxdWVzdCBzaWduZXIgb3Igbm90LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCwgdGhlIG9iamVjdCB0byBpZGVudGlmeVxyXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIGlzU2lnbmVyOiBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICBpZiAodHlwZW9mIChvYmopID09PSAnb2JqZWN0JyAmJiBvYmogaW5zdGFuY2VvZiBSZXF1ZXN0U2lnbmVyKVxyXG4gICAgICByZXR1cm4gKHRydWUpO1xyXG4gICAgcmV0dXJuIChmYWxzZSk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIHJlcXVlc3Qgc2lnbmVyLCB1c2VkIHRvIGFzeW5jaHJvbm91c2x5IGJ1aWxkIGEgc2lnbmF0dXJlXHJcbiAgICogZm9yIGEgcmVxdWVzdCAoZG9lcyBub3QgaGF2ZSB0byBiZSBhbiBodHRwLkNsaWVudFJlcXVlc3QpLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMsIGVpdGhlcjpcclxuICAgKiAgICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IGtleUlkXHJcbiAgICogICAgICAgICAgICAgICAgICAgLSB7U3RyaW5nfEJ1ZmZlcn0ga2V5XHJcbiAgICogICAgICAgICAgICAgICAgICAgLSB7U3RyaW5nfSBhbGdvcml0aG0gKG9wdGlvbmFsLCByZXF1aXJlZCBmb3IgSE1BQylcclxuICAgKiAgICAgICAgICAgICAgICAgb3I6XHJcbiAgICogICAgICAgICAgICAgICAgICAgLSB7RnVuY30gc2lnbiAoZGF0YSwgY2IpXHJcbiAgICogQHJldHVybiB7UmVxdWVzdFNpZ25lcn1cclxuICAgKi9cclxuICBjcmVhdGVTaWduZXI6IGZ1bmN0aW9uIGNyZWF0ZVNpZ25lcihvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gKG5ldyBSZXF1ZXN0U2lnbmVyKG9wdGlvbnMpKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBBZGRzIGFuICdBdXRob3JpemF0aW9uJyBoZWFkZXIgdG8gYW4gaHR0cC5DbGllbnRSZXF1ZXN0IG9iamVjdC5cclxuICAgKlxyXG4gICAqIE5vdGUgdGhhdCB0aGlzIEFQSSB3aWxsIGFkZCBhIERhdGUgaGVhZGVyIGlmIGl0J3Mgbm90IGFscmVhZHkgc2V0LiBBbnlcclxuICAgKiBvdGhlciBoZWFkZXJzIGluIHRoZSBvcHRpb25zLmhlYWRlcnMgYXJyYXkgTVVTVCBiZSBwcmVzZW50LCBvciB0aGlzXHJcbiAgICogd2lsbCB0aHJvdy5cclxuICAgKlxyXG4gICAqIFlvdSBzaG91bGRuJ3QgbmVlZCB0byBjaGVjayB0aGUgcmV0dXJuIHR5cGU7IGl0J3MganVzdCB0aGVyZSBpZiB5b3Ugd2FudFxyXG4gICAqIHRvIGJlIHBlZGFudGljLlxyXG4gICAqXHJcbiAgICogVGhlIG9wdGlvbmFsIGZsYWcgaW5kaWNhdGVzIHdoZXRoZXIgcGFyc2luZyBzaG91bGQgdXNlIHN0cmljdCBlbmZvcmNlbWVudFxyXG4gICAqIG9mIHRoZSB2ZXJzaW9uIGRyYWZ0LWNhdmFnZS1odHRwLXNpZ25hdHVyZXMtMDQgb2YgdGhlIHNwZWMgb3IgYmV5b25kLlxyXG4gICAqIFRoZSBkZWZhdWx0IGlzIHRvIGJlIGxvb3NlIGFuZCBzdXBwb3J0XHJcbiAgICogb2xkZXIgdmVyc2lvbnMgZm9yIGNvbXBhdGliaWxpdHkuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdCBhbiBpbnN0YW5jZSBvZiBodHRwLkNsaWVudFJlcXVlc3QuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgc2lnbmluZyBwYXJhbWV0ZXJzIG9iamVjdDpcclxuICAgKiAgICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IGtleUlkIHJlcXVpcmVkLlxyXG4gICAqICAgICAgICAgICAgICAgICAgIC0ge1N0cmluZ30ga2V5IHJlcXVpcmVkIChlaXRoZXIgYSBQRU0gb3IgSE1BQyBrZXkpLlxyXG4gICAqICAgICAgICAgICAgICAgICAgIC0ge0FycmF5fSBoZWFkZXJzIG9wdGlvbmFsOyBkZWZhdWx0cyB0byBbJ2RhdGUnXS5cclxuICAgKiAgICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IGFsZ29yaXRobSBvcHRpb25hbCAodW5sZXNzIGtleSBpcyBITUFDKTtcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQgaXMgdGhlIHNhbWUgYXMgdGhlIHNzaHBrIGRlZmF1bHRcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25pbmcgYWxnb3JpdGhtIGZvciB0aGUgdHlwZSBvZiBrZXkgZ2l2ZW5cclxuICAgKiAgICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IGh0dHBWZXJzaW9uIG9wdGlvbmFsOyBkZWZhdWx0cyB0byAnMS4xJy5cclxuICAgKiAgICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSBzdHJpY3Qgb3B0aW9uYWw7IGRlZmF1bHRzIHRvICdmYWxzZScuXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBBdXRob3JpemF0aW9uIChhbmQgb3B0aW9uYWxseSBEYXRlKSB3ZXJlIGFkZGVkLlxyXG4gICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gb24gYmFkIHBhcmFtZXRlciB0eXBlcyAoaW5wdXQpLlxyXG4gICAqIEB0aHJvd3Mge0ludmFsaWRBbGdvcml0aG1FcnJvcn0gaWYgYWxnb3JpdGhtIHdhcyBiYWQgb3IgaW5jb21wYXRpYmxlIHdpdGhcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBnaXZlbiBrZXkuXHJcbiAgICogQHRocm93cyB7c3NocGsuS2V5UGFyc2VFcnJvcn0gaWYga2V5IHdhcyBiYWQuXHJcbiAgICogQHRocm93cyB7TWlzc2luZ0hlYWRlckVycm9yfSBpZiBhIGhlYWRlciB0byBiZSBzaWduZWQgd2FzIHNwZWNpZmllZCBidXRcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhcyBub3QgcHJlc2VudC5cclxuICAgKi9cclxuICBzaWduUmVxdWVzdDogZnVuY3Rpb24gc2lnblJlcXVlc3QocmVxdWVzdCwgb3B0aW9ucykge1xyXG4gICAgYXNzZXJ0Lm9iamVjdChyZXF1ZXN0LCAncmVxdWVzdCcpO1xyXG4gICAgYXNzZXJ0Lm9iamVjdChvcHRpb25zLCAnb3B0aW9ucycpO1xyXG4gICAgYXNzZXJ0Lm9wdGlvbmFsU3RyaW5nKG9wdGlvbnMuYWxnb3JpdGhtLCAnb3B0aW9ucy5hbGdvcml0aG0nKTtcclxuICAgIGFzc2VydC5zdHJpbmcob3B0aW9ucy5rZXlJZCwgJ29wdGlvbnMua2V5SWQnKTtcclxuICAgIGFzc2VydC5vcHRpb25hbEFycmF5T2ZTdHJpbmcob3B0aW9ucy5oZWFkZXJzLCAnb3B0aW9ucy5oZWFkZXJzJyk7XHJcbiAgICBhc3NlcnQub3B0aW9uYWxTdHJpbmcob3B0aW9ucy5odHRwVmVyc2lvbiwgJ29wdGlvbnMuaHR0cFZlcnNpb24nKTtcclxuXHJcbiAgICBpZiAoIXJlcXVlc3QuZ2V0SGVhZGVyKCdEYXRlJykpXHJcbiAgICAgIHJlcXVlc3Quc2V0SGVhZGVyKCdEYXRlJywganNwcmltLnJmYzExMjMobmV3IERhdGUoKSkpO1xyXG4gICAgaWYgKCFvcHRpb25zLmhlYWRlcnMpXHJcbiAgICAgIG9wdGlvbnMuaGVhZGVycyA9IFsnZGF0ZSddO1xyXG4gICAgaWYgKCFvcHRpb25zLmh0dHBWZXJzaW9uKVxyXG4gICAgICBvcHRpb25zLmh0dHBWZXJzaW9uID0gJzEuMSc7XHJcblxyXG4gICAgdmFyIGFsZyA9IFtdO1xyXG4gICAgaWYgKG9wdGlvbnMuYWxnb3JpdGhtKSB7XHJcbiAgICAgIG9wdGlvbnMuYWxnb3JpdGhtID0gb3B0aW9ucy5hbGdvcml0aG0udG9Mb3dlckNhc2UoKTtcclxuICAgICAgYWxnID0gdmFsaWRhdGVBbGdvcml0aG0ob3B0aW9ucy5hbGdvcml0aG0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpO1xyXG4gICAgdmFyIHN0cmluZ1RvU2lnbiA9ICcnO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IG9wdGlvbnMuaGVhZGVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodHlwZW9mIChvcHRpb25zLmhlYWRlcnNbaV0pICE9PSAnc3RyaW5nJylcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb25zLmhlYWRlcnMgbXVzdCBiZSBhbiBhcnJheSBvZiBTdHJpbmdzJyk7XHJcblxyXG4gICAgICB2YXIgaCA9IG9wdGlvbnMuaGVhZGVyc1tpXS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgaWYgKGggPT09ICdyZXF1ZXN0LWxpbmUnKSB7XHJcbiAgICAgICAgaWYgKCFvcHRpb25zLnN0cmljdCkge1xyXG4gICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgKiBXZSBhbGxvdyBoZWFkZXJzIGZyb20gdGhlIG9sZGVyIHNwZWMgZHJhZnRzIGlmIHN0cmljdCBwYXJzaW5nIGlzbid0XHJcbiAgICAgICAgICAgKiBzcGVjaWZpZWQgaW4gb3B0aW9ucy5cclxuICAgICAgICAgICAqL1xyXG4gICAgICAgICAgc3RyaW5nVG9TaWduICs9XHJcbiAgICAgICAgICAgIHJlcXVlc3QubWV0aG9kICsgJyAnICsgcmVxdWVzdC5wYXRoICsgJyBIVFRQLycgK1xyXG4gICAgICAgICAgICBvcHRpb25zLmh0dHBWZXJzaW9uO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvKiBTdHJpY3QgcGFyc2luZyBkb2Vzbid0IGFsbG93IG9sZGVyIGRyYWZ0IGhlYWRlcnMuICovXHJcbiAgICAgICAgICB0aHJvdyAobmV3IFN0cmljdFBhcnNpbmdFcnJvcigncmVxdWVzdC1saW5lIGlzIG5vdCBhIHZhbGlkIGhlYWRlciAnICtcclxuICAgICAgICAgICAgJ3dpdGggc3RyaWN0IHBhcnNpbmcgZW5hYmxlZC4nKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGggPT09ICcocmVxdWVzdC10YXJnZXQpJykge1xyXG4gICAgICAgIHN0cmluZ1RvU2lnbiArPVxyXG4gICAgICAgICAgJyhyZXF1ZXN0LXRhcmdldCk6ICcgKyByZXF1ZXN0Lm1ldGhvZC50b0xvd2VyQ2FzZSgpICsgJyAnICtcclxuICAgICAgICAgIHJlcXVlc3QucGF0aDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSByZXF1ZXN0LmdldEhlYWRlcihoKTtcclxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gJycpIHtcclxuICAgICAgICAgIHRocm93IG5ldyBNaXNzaW5nSGVhZGVyRXJyb3IoaCArICcgd2FzIG5vdCBpbiB0aGUgcmVxdWVzdCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdHJpbmdUb1NpZ24gKz0gaCArICc6ICcgKyB2YWx1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKChpICsgMSkgPCBvcHRpb25zLmhlYWRlcnMubGVuZ3RoKVxyXG4gICAgICAgIHN0cmluZ1RvU2lnbiArPSAnXFxuJztcclxuICAgIH1cclxuXHJcbiAgICAvKiBUaGlzIGlzIGp1c3QgZm9yIHVuaXQgdGVzdHMuICovXHJcbiAgICBpZiAocmVxdWVzdC5oYXNPd25Qcm9wZXJ0eSgnX3N0cmluZ1RvU2lnbicpKSB7XHJcbiAgICAgIHJlcXVlc3QuX3N0cmluZ1RvU2lnbiA9IHN0cmluZ1RvU2lnbjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgc2lnbmF0dXJlO1xyXG4gICAgaWYgKGFsZ1swXSA9PT0gJ2htYWMnKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgKG9wdGlvbnMua2V5KSAhPT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLmtleSkpXHJcbiAgICAgICAgdGhyb3cgKG5ldyBUeXBlRXJyb3IoJ29wdGlvbnMua2V5IG11c3QgYmUgYSBzdHJpbmcgb3IgQnVmZmVyJykpO1xyXG5cclxuICAgICAgdmFyIGhtYWMgPSBjcnlwdG8uY3JlYXRlSG1hYyhhbGdbMV0udG9VcHBlckNhc2UoKSwgb3B0aW9ucy5rZXkpO1xyXG4gICAgICBobWFjLnVwZGF0ZShzdHJpbmdUb1NpZ24pO1xyXG4gICAgICBzaWduYXR1cmUgPSBobWFjLmRpZ2VzdCgnYmFzZTY0Jyk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIGtleSA9IG9wdGlvbnMua2V5O1xyXG4gICAgICBpZiAodHlwZW9mIChrZXkpID09PSAnc3RyaW5nJyB8fCBCdWZmZXIuaXNCdWZmZXIoa2V5KSlcclxuICAgICAgICBrZXkgPSBzc2hway5wYXJzZVByaXZhdGVLZXkob3B0aW9ucy5rZXkpO1xyXG5cclxuICAgICAgYXNzZXJ0Lm9rKHNzaHBrLlByaXZhdGVLZXkuaXNQcml2YXRlS2V5KGtleSwgWzEsIDJdKSxcclxuICAgICAgICAnb3B0aW9ucy5rZXkgbXVzdCBiZSBhIHNzaHBrLlByaXZhdGVLZXknKTtcclxuXHJcbiAgICAgIGlmICghUEtfQUxHT1Nba2V5LnR5cGVdKSB7XHJcbiAgICAgICAgdGhyb3cgKG5ldyBJbnZhbGlkQWxnb3JpdGhtRXJyb3Ioa2V5LnR5cGUudG9VcHBlckNhc2UoKSArICcgdHlwZSAnICtcclxuICAgICAgICAgICdrZXlzIGFyZSBub3Qgc3VwcG9ydGVkJykpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYWxnWzBdICE9PSB1bmRlZmluZWQgJiYga2V5LnR5cGUgIT09IGFsZ1swXSkge1xyXG4gICAgICAgIHRocm93IChuZXcgSW52YWxpZEFsZ29yaXRobUVycm9yKCdvcHRpb25zLmtleSBtdXN0IGJlIGEgJyArXHJcbiAgICAgICAgICBhbGdbMF0udG9VcHBlckNhc2UoKSArICcga2V5LCB3YXMgZ2l2ZW4gYSAnICtcclxuICAgICAgICAgIGtleS50eXBlLnRvVXBwZXJDYXNlKCkgKyAnIGtleSBpbnN0ZWFkJykpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgc2lnbmVyID0ga2V5LmNyZWF0ZVNpZ24oYWxnWzFdKTtcclxuICAgICAgc2lnbmVyLnVwZGF0ZShzdHJpbmdUb1NpZ24pO1xyXG4gICAgICB2YXIgc2lnT2JqID0gc2lnbmVyLnNpZ24oKTtcclxuICAgICAgaWYgKCFIQVNIX0FMR09TW3NpZ09iai5oYXNoQWxnb3JpdGhtXSkge1xyXG4gICAgICAgIHRocm93IChuZXcgSW52YWxpZEFsZ29yaXRobUVycm9yKHNpZ09iai5oYXNoQWxnb3JpdGhtLnRvVXBwZXJDYXNlKCkgK1xyXG4gICAgICAgICAgJyBpcyBub3QgYSBzdXBwb3J0ZWQgaGFzaCBhbGdvcml0aG0nKSk7XHJcbiAgICAgIH1cclxuICAgICAgb3B0aW9ucy5hbGdvcml0aG0gPSBrZXkudHlwZSArICctJyArIHNpZ09iai5oYXNoQWxnb3JpdGhtO1xyXG4gICAgICBzaWduYXR1cmUgPSBzaWdPYmoudG9TdHJpbmcoKTtcclxuICAgICAgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKHNpZ25hdHVyZSwgJycsICdlbXB0eSBzaWduYXR1cmUgcHJvZHVjZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgYXV0aHpIZWFkZXJOYW1lID0gb3B0aW9ucy5hdXRob3JpemF0aW9uSGVhZGVyTmFtZSB8fCAnQXV0aG9yaXphdGlvbic7XHJcblxyXG4gICAgcmVxdWVzdC5zZXRIZWFkZXIoYXV0aHpIZWFkZXJOYW1lLCBzcHJpbnRmKEFVVEhaX0ZNVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmtleUlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuYWxnb3JpdGhtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuaGVhZGVycy5qb2luKCcgJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmF0dXJlKSk7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==