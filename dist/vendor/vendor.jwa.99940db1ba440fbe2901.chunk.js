(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.jwa"],{

/***/ "eegf":
/*!***********************************!*\
  !*** ./node_modules/jwa/index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var bufferEqual = __webpack_require__(/*! buffer-equal-constant-time */ "tc1l");
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer;
var crypto = __webpack_require__(/*! crypto */ "HEbw");
var formatEcdsa = __webpack_require__(/*! ecdsa-sig-formatter */ "ij2l");
var util = __webpack_require__(/*! util */ "7tlc");

var MSG_INVALID_ALGORITHM = '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".'
var MSG_INVALID_SECRET = 'secret must be a string or buffer';
var MSG_INVALID_VERIFIER_KEY = 'key must be a string or a buffer';
var MSG_INVALID_SIGNER_KEY = 'key must be a string, a buffer or an object';

function fromBase64(base64) {
  return base64
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function toBase64(base64url) {
  base64url = base64url.toString();

  var padding = 4 - base64url.length % 4;
  if (padding !== 4) {
    for (var i = 0; i < padding; ++i) {
      base64url += '=';
    }
  }

  return base64url
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
}

function typeError(template) {
  var args = [].slice.call(arguments, 1);
  var errMsg = util.format.bind(util, template).apply(null, args);
  return new TypeError(errMsg);
}

function bufferOrString(obj) {
  return Buffer.isBuffer(obj) || typeof obj === 'string';
}

function normalizeInput(thing) {
  if (!bufferOrString(thing))
    thing = JSON.stringify(thing);
  return thing;
}

function createHmacSigner(bits) {
  return function sign(thing, secret) {
    if (!bufferOrString(secret))
      throw typeError(MSG_INVALID_SECRET);
    thing = normalizeInput(thing);
    var hmac = crypto.createHmac('sha' + bits, secret);
    var sig = (hmac.update(thing), hmac.digest('base64'))
    return fromBase64(sig);
  }
}

function createHmacVerifier(bits) {
  return function verify(thing, signature, secret) {
    var computedSig = createHmacSigner(bits)(thing, secret);
    return bufferEqual(Buffer.from(signature), Buffer.from(computedSig));
  }
}

function createKeySigner(bits) {
 return function sign(thing, privateKey) {
    if (!bufferOrString(privateKey) && !(typeof privateKey === 'object'))
      throw typeError(MSG_INVALID_SIGNER_KEY);
    thing = normalizeInput(thing);
    // Even though we are specifying "RSA" here, this works with ECDSA
    // keys as well.
    var signer = crypto.createSign('RSA-SHA' + bits);
    var sig = (signer.update(thing), signer.sign(privateKey, 'base64'));
    return fromBase64(sig);
  }
}

function createKeyVerifier(bits) {
  return function verify(thing, signature, publicKey) {
    if (!bufferOrString(publicKey))
      throw typeError(MSG_INVALID_VERIFIER_KEY);
    thing = normalizeInput(thing);
    signature = toBase64(signature);
    var verifier = crypto.createVerify('RSA-SHA' + bits);
    verifier.update(thing);
    return verifier.verify(publicKey, signature, 'base64');
  }
}

function createPSSKeySigner(bits) {
 return function sign(thing, privateKey) {
    if (!bufferOrString(privateKey) && !(typeof privateKey === 'object'))
      throw typeError(MSG_INVALID_SIGNER_KEY);
    thing = normalizeInput(thing);
    var signer = crypto.createSign('RSA-SHA' + bits);
    var sig = (signer.update(thing), signer.sign({key: privateKey, padding: crypto.constants.RSA_PKCS1_PSS_PADDING}, 'base64'));
    return fromBase64(sig);
  }
}

function createPSSKeyVerifier(bits) {
  return function verify(thing, signature, publicKey) {
    if (!bufferOrString(publicKey))
      throw typeError(MSG_INVALID_VERIFIER_KEY);
    thing = normalizeInput(thing);
    signature = toBase64(signature);
    var verifier = crypto.createVerify('RSA-SHA' + bits);
    verifier.update(thing);
    return verifier.verify({key: publicKey, padding: crypto.constants.RSA_PKCS1_PSS_PADDING}, signature, 'base64');
  }
}

function createECDSASigner(bits) {
  var inner = createKeySigner(bits);
  return function sign() {
    var signature = inner.apply(null, arguments);
    signature = formatEcdsa.derToJose(signature, 'ES' + bits);
    return signature;
  };
}

function createECDSAVerifer(bits) {
  var inner = createKeyVerifier(bits);
  return function verify(thing, signature, publicKey) {
    signature = formatEcdsa.joseToDer(signature, 'ES' + bits).toString('base64');
    var result = inner(thing, signature, publicKey);
    return result;
  };
}

function createNoneSigner() {
  return function sign() {
    return '';
  }
}

function createNoneVerifier() {
  return function verify(thing, signature) {
    return signature === '';
  }
}

module.exports = function jwa(algorithm) {
  var signerFactories = {
    hs: createHmacSigner,
    rs: createKeySigner,
    ps: createPSSKeySigner,
    es: createECDSASigner,
    none: createNoneSigner,
  }
  var verifierFactories = {
    hs: createHmacVerifier,
    rs: createKeyVerifier,
    ps: createPSSKeyVerifier,
    es: createECDSAVerifer,
    none: createNoneVerifier,
  }
  var match = algorithm.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/i);
  if (!match)
    throw typeError(MSG_INVALID_ALGORITHM, algorithm);
  var algo = (match[1] || match[3]).toLowerCase();
  var bits = match[2];

  return {
    sign: signerFactories[algo](bits),
    verify: verifierFactories[algo](bits),
  }
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvandhL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGtCQUFrQixtQkFBTyxDQUFDLHdDQUE0QjtBQUN0RCxhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLGtCQUFrQixtQkFBTyxDQUFDLGlDQUFxQjtBQUMvQyxXQUFXLG1CQUFPLENBQUMsa0JBQU07O0FBRXpCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsYUFBYTtBQUNoQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELGlFQUFpRTtBQUNuSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixnRUFBZ0U7QUFDNUY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJ2ZW5kb3IvdmVuZG9yLmp3YS45OTk0MGRiMWJhNDQwZmJlMjkwMS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBidWZmZXJFcXVhbCA9IHJlcXVpcmUoJ2J1ZmZlci1lcXVhbC1jb25zdGFudC10aW1lJyk7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXI7XG52YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG52YXIgZm9ybWF0RWNkc2EgPSByZXF1aXJlKCdlY2RzYS1zaWctZm9ybWF0dGVyJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxudmFyIE1TR19JTlZBTElEX0FMR09SSVRITSA9ICdcIiVzXCIgaXMgbm90IGEgdmFsaWQgYWxnb3JpdGhtLlxcbiAgU3VwcG9ydGVkIGFsZ29yaXRobXMgYXJlOlxcbiAgXCJIUzI1NlwiLCBcIkhTMzg0XCIsIFwiSFM1MTJcIiwgXCJSUzI1NlwiLCBcIlJTMzg0XCIsIFwiUlM1MTJcIiwgXCJQUzI1NlwiLCBcIlBTMzg0XCIsIFwiUFM1MTJcIiwgXCJFUzI1NlwiLCBcIkVTMzg0XCIsIFwiRVM1MTJcIiBhbmQgXCJub25lXCIuJ1xudmFyIE1TR19JTlZBTElEX1NFQ1JFVCA9ICdzZWNyZXQgbXVzdCBiZSBhIHN0cmluZyBvciBidWZmZXInO1xudmFyIE1TR19JTlZBTElEX1ZFUklGSUVSX0tFWSA9ICdrZXkgbXVzdCBiZSBhIHN0cmluZyBvciBhIGJ1ZmZlcic7XG52YXIgTVNHX0lOVkFMSURfU0lHTkVSX0tFWSA9ICdrZXkgbXVzdCBiZSBhIHN0cmluZywgYSBidWZmZXIgb3IgYW4gb2JqZWN0JztcblxuZnVuY3Rpb24gZnJvbUJhc2U2NChiYXNlNjQpIHtcbiAgcmV0dXJuIGJhc2U2NFxuICAgIC5yZXBsYWNlKC89L2csICcnKVxuICAgIC5yZXBsYWNlKC9cXCsvZywgJy0nKVxuICAgIC5yZXBsYWNlKC9cXC8vZywgJ18nKTtcbn1cblxuZnVuY3Rpb24gdG9CYXNlNjQoYmFzZTY0dXJsKSB7XG4gIGJhc2U2NHVybCA9IGJhc2U2NHVybC50b1N0cmluZygpO1xuXG4gIHZhciBwYWRkaW5nID0gNCAtIGJhc2U2NHVybC5sZW5ndGggJSA0O1xuICBpZiAocGFkZGluZyAhPT0gNCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFkZGluZzsgKytpKSB7XG4gICAgICBiYXNlNjR1cmwgKz0gJz0nO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBiYXNlNjR1cmxcbiAgICAucmVwbGFjZSgvXFwtL2csICcrJylcbiAgICAucmVwbGFjZSgvXy9nLCAnLycpO1xufVxuXG5mdW5jdGlvbiB0eXBlRXJyb3IodGVtcGxhdGUpIHtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHZhciBlcnJNc2cgPSB1dGlsLmZvcm1hdC5iaW5kKHV0aWwsIHRlbXBsYXRlKS5hcHBseShudWxsLCBhcmdzKTtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoZXJyTXNnKTtcbn1cblxuZnVuY3Rpb24gYnVmZmVyT3JTdHJpbmcob2JqKSB7XG4gIHJldHVybiBCdWZmZXIuaXNCdWZmZXIob2JqKSB8fCB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJztcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplSW5wdXQodGhpbmcpIHtcbiAgaWYgKCFidWZmZXJPclN0cmluZyh0aGluZykpXG4gICAgdGhpbmcgPSBKU09OLnN0cmluZ2lmeSh0aGluZyk7XG4gIHJldHVybiB0aGluZztcbn1cblxuZnVuY3Rpb24gY3JlYXRlSG1hY1NpZ25lcihiaXRzKSB7XG4gIHJldHVybiBmdW5jdGlvbiBzaWduKHRoaW5nLCBzZWNyZXQpIHtcbiAgICBpZiAoIWJ1ZmZlck9yU3RyaW5nKHNlY3JldCkpXG4gICAgICB0aHJvdyB0eXBlRXJyb3IoTVNHX0lOVkFMSURfU0VDUkVUKTtcbiAgICB0aGluZyA9IG5vcm1hbGl6ZUlucHV0KHRoaW5nKTtcbiAgICB2YXIgaG1hYyA9IGNyeXB0by5jcmVhdGVIbWFjKCdzaGEnICsgYml0cywgc2VjcmV0KTtcbiAgICB2YXIgc2lnID0gKGhtYWMudXBkYXRlKHRoaW5nKSwgaG1hYy5kaWdlc3QoJ2Jhc2U2NCcpKVxuICAgIHJldHVybiBmcm9tQmFzZTY0KHNpZyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlSG1hY1ZlcmlmaWVyKGJpdHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHZlcmlmeSh0aGluZywgc2lnbmF0dXJlLCBzZWNyZXQpIHtcbiAgICB2YXIgY29tcHV0ZWRTaWcgPSBjcmVhdGVIbWFjU2lnbmVyKGJpdHMpKHRoaW5nLCBzZWNyZXQpO1xuICAgIHJldHVybiBidWZmZXJFcXVhbChCdWZmZXIuZnJvbShzaWduYXR1cmUpLCBCdWZmZXIuZnJvbShjb21wdXRlZFNpZykpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUtleVNpZ25lcihiaXRzKSB7XG4gcmV0dXJuIGZ1bmN0aW9uIHNpZ24odGhpbmcsIHByaXZhdGVLZXkpIHtcbiAgICBpZiAoIWJ1ZmZlck9yU3RyaW5nKHByaXZhdGVLZXkpICYmICEodHlwZW9mIHByaXZhdGVLZXkgPT09ICdvYmplY3QnKSlcbiAgICAgIHRocm93IHR5cGVFcnJvcihNU0dfSU5WQUxJRF9TSUdORVJfS0VZKTtcbiAgICB0aGluZyA9IG5vcm1hbGl6ZUlucHV0KHRoaW5nKTtcbiAgICAvLyBFdmVuIHRob3VnaCB3ZSBhcmUgc3BlY2lmeWluZyBcIlJTQVwiIGhlcmUsIHRoaXMgd29ya3Mgd2l0aCBFQ0RTQVxuICAgIC8vIGtleXMgYXMgd2VsbC5cbiAgICB2YXIgc2lnbmVyID0gY3J5cHRvLmNyZWF0ZVNpZ24oJ1JTQS1TSEEnICsgYml0cyk7XG4gICAgdmFyIHNpZyA9IChzaWduZXIudXBkYXRlKHRoaW5nKSwgc2lnbmVyLnNpZ24ocHJpdmF0ZUtleSwgJ2Jhc2U2NCcpKTtcbiAgICByZXR1cm4gZnJvbUJhc2U2NChzaWcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUtleVZlcmlmaWVyKGJpdHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHZlcmlmeSh0aGluZywgc2lnbmF0dXJlLCBwdWJsaWNLZXkpIHtcbiAgICBpZiAoIWJ1ZmZlck9yU3RyaW5nKHB1YmxpY0tleSkpXG4gICAgICB0aHJvdyB0eXBlRXJyb3IoTVNHX0lOVkFMSURfVkVSSUZJRVJfS0VZKTtcbiAgICB0aGluZyA9IG5vcm1hbGl6ZUlucHV0KHRoaW5nKTtcbiAgICBzaWduYXR1cmUgPSB0b0Jhc2U2NChzaWduYXR1cmUpO1xuICAgIHZhciB2ZXJpZmllciA9IGNyeXB0by5jcmVhdGVWZXJpZnkoJ1JTQS1TSEEnICsgYml0cyk7XG4gICAgdmVyaWZpZXIudXBkYXRlKHRoaW5nKTtcbiAgICByZXR1cm4gdmVyaWZpZXIudmVyaWZ5KHB1YmxpY0tleSwgc2lnbmF0dXJlLCAnYmFzZTY0Jyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlUFNTS2V5U2lnbmVyKGJpdHMpIHtcbiByZXR1cm4gZnVuY3Rpb24gc2lnbih0aGluZywgcHJpdmF0ZUtleSkge1xuICAgIGlmICghYnVmZmVyT3JTdHJpbmcocHJpdmF0ZUtleSkgJiYgISh0eXBlb2YgcHJpdmF0ZUtleSA9PT0gJ29iamVjdCcpKVxuICAgICAgdGhyb3cgdHlwZUVycm9yKE1TR19JTlZBTElEX1NJR05FUl9LRVkpO1xuICAgIHRoaW5nID0gbm9ybWFsaXplSW5wdXQodGhpbmcpO1xuICAgIHZhciBzaWduZXIgPSBjcnlwdG8uY3JlYXRlU2lnbignUlNBLVNIQScgKyBiaXRzKTtcbiAgICB2YXIgc2lnID0gKHNpZ25lci51cGRhdGUodGhpbmcpLCBzaWduZXIuc2lnbih7a2V5OiBwcml2YXRlS2V5LCBwYWRkaW5nOiBjcnlwdG8uY29uc3RhbnRzLlJTQV9QS0NTMV9QU1NfUEFERElOR30sICdiYXNlNjQnKSk7XG4gICAgcmV0dXJuIGZyb21CYXNlNjQoc2lnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVQU1NLZXlWZXJpZmllcihiaXRzKSB7XG4gIHJldHVybiBmdW5jdGlvbiB2ZXJpZnkodGhpbmcsIHNpZ25hdHVyZSwgcHVibGljS2V5KSB7XG4gICAgaWYgKCFidWZmZXJPclN0cmluZyhwdWJsaWNLZXkpKVxuICAgICAgdGhyb3cgdHlwZUVycm9yKE1TR19JTlZBTElEX1ZFUklGSUVSX0tFWSk7XG4gICAgdGhpbmcgPSBub3JtYWxpemVJbnB1dCh0aGluZyk7XG4gICAgc2lnbmF0dXJlID0gdG9CYXNlNjQoc2lnbmF0dXJlKTtcbiAgICB2YXIgdmVyaWZpZXIgPSBjcnlwdG8uY3JlYXRlVmVyaWZ5KCdSU0EtU0hBJyArIGJpdHMpO1xuICAgIHZlcmlmaWVyLnVwZGF0ZSh0aGluZyk7XG4gICAgcmV0dXJuIHZlcmlmaWVyLnZlcmlmeSh7a2V5OiBwdWJsaWNLZXksIHBhZGRpbmc6IGNyeXB0by5jb25zdGFudHMuUlNBX1BLQ1MxX1BTU19QQURESU5HfSwgc2lnbmF0dXJlLCAnYmFzZTY0Jyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlRUNEU0FTaWduZXIoYml0cykge1xuICB2YXIgaW5uZXIgPSBjcmVhdGVLZXlTaWduZXIoYml0cyk7XG4gIHJldHVybiBmdW5jdGlvbiBzaWduKCkge1xuICAgIHZhciBzaWduYXR1cmUgPSBpbm5lci5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIHNpZ25hdHVyZSA9IGZvcm1hdEVjZHNhLmRlclRvSm9zZShzaWduYXR1cmUsICdFUycgKyBiaXRzKTtcbiAgICByZXR1cm4gc2lnbmF0dXJlO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFQ0RTQVZlcmlmZXIoYml0cykge1xuICB2YXIgaW5uZXIgPSBjcmVhdGVLZXlWZXJpZmllcihiaXRzKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHZlcmlmeSh0aGluZywgc2lnbmF0dXJlLCBwdWJsaWNLZXkpIHtcbiAgICBzaWduYXR1cmUgPSBmb3JtYXRFY2RzYS5qb3NlVG9EZXIoc2lnbmF0dXJlLCAnRVMnICsgYml0cykudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgIHZhciByZXN1bHQgPSBpbm5lcih0aGluZywgc2lnbmF0dXJlLCBwdWJsaWNLZXkpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU5vbmVTaWduZXIoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBzaWduKCkge1xuICAgIHJldHVybiAnJztcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVOb25lVmVyaWZpZXIoKSB7XG4gIHJldHVybiBmdW5jdGlvbiB2ZXJpZnkodGhpbmcsIHNpZ25hdHVyZSkge1xuICAgIHJldHVybiBzaWduYXR1cmUgPT09ICcnO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gandhKGFsZ29yaXRobSkge1xuICB2YXIgc2lnbmVyRmFjdG9yaWVzID0ge1xuICAgIGhzOiBjcmVhdGVIbWFjU2lnbmVyLFxuICAgIHJzOiBjcmVhdGVLZXlTaWduZXIsXG4gICAgcHM6IGNyZWF0ZVBTU0tleVNpZ25lcixcbiAgICBlczogY3JlYXRlRUNEU0FTaWduZXIsXG4gICAgbm9uZTogY3JlYXRlTm9uZVNpZ25lcixcbiAgfVxuICB2YXIgdmVyaWZpZXJGYWN0b3JpZXMgPSB7XG4gICAgaHM6IGNyZWF0ZUhtYWNWZXJpZmllcixcbiAgICByczogY3JlYXRlS2V5VmVyaWZpZXIsXG4gICAgcHM6IGNyZWF0ZVBTU0tleVZlcmlmaWVyLFxuICAgIGVzOiBjcmVhdGVFQ0RTQVZlcmlmZXIsXG4gICAgbm9uZTogY3JlYXRlTm9uZVZlcmlmaWVyLFxuICB9XG4gIHZhciBtYXRjaCA9IGFsZ29yaXRobS5tYXRjaCgvXihSU3xQU3xFU3xIUykoMjU2fDM4NHw1MTIpJHxeKG5vbmUpJC9pKTtcbiAgaWYgKCFtYXRjaClcbiAgICB0aHJvdyB0eXBlRXJyb3IoTVNHX0lOVkFMSURfQUxHT1JJVEhNLCBhbGdvcml0aG0pO1xuICB2YXIgYWxnbyA9IChtYXRjaFsxXSB8fCBtYXRjaFszXSkudG9Mb3dlckNhc2UoKTtcbiAgdmFyIGJpdHMgPSBtYXRjaFsyXTtcblxuICByZXR1cm4ge1xuICAgIHNpZ246IHNpZ25lckZhY3Rvcmllc1thbGdvXShiaXRzKSxcbiAgICB2ZXJpZnk6IHZlcmlmaWVyRmFjdG9yaWVzW2FsZ29dKGJpdHMpLFxuICB9XG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==