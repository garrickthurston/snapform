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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvandhL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGtCQUFrQixtQkFBTyxDQUFDLHdDQUE0QjtBQUN0RCxhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLGtCQUFrQixtQkFBTyxDQUFDLGlDQUFxQjtBQUMvQyxXQUFXLG1CQUFPLENBQUMsa0JBQU07O0FBRXpCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsYUFBYTtBQUNoQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELGlFQUFpRTtBQUNuSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixnRUFBZ0U7QUFDNUY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmp3YS4zZGZlOWJkZmU4YmZkZGE2ZmRiNi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBidWZmZXJFcXVhbCA9IHJlcXVpcmUoJ2J1ZmZlci1lcXVhbC1jb25zdGFudC10aW1lJyk7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlcjtcclxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xyXG52YXIgZm9ybWF0RWNkc2EgPSByZXF1aXJlKCdlY2RzYS1zaWctZm9ybWF0dGVyJyk7XHJcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xyXG5cclxudmFyIE1TR19JTlZBTElEX0FMR09SSVRITSA9ICdcIiVzXCIgaXMgbm90IGEgdmFsaWQgYWxnb3JpdGhtLlxcbiAgU3VwcG9ydGVkIGFsZ29yaXRobXMgYXJlOlxcbiAgXCJIUzI1NlwiLCBcIkhTMzg0XCIsIFwiSFM1MTJcIiwgXCJSUzI1NlwiLCBcIlJTMzg0XCIsIFwiUlM1MTJcIiwgXCJQUzI1NlwiLCBcIlBTMzg0XCIsIFwiUFM1MTJcIiwgXCJFUzI1NlwiLCBcIkVTMzg0XCIsIFwiRVM1MTJcIiBhbmQgXCJub25lXCIuJ1xyXG52YXIgTVNHX0lOVkFMSURfU0VDUkVUID0gJ3NlY3JldCBtdXN0IGJlIGEgc3RyaW5nIG9yIGJ1ZmZlcic7XHJcbnZhciBNU0dfSU5WQUxJRF9WRVJJRklFUl9LRVkgPSAna2V5IG11c3QgYmUgYSBzdHJpbmcgb3IgYSBidWZmZXInO1xyXG52YXIgTVNHX0lOVkFMSURfU0lHTkVSX0tFWSA9ICdrZXkgbXVzdCBiZSBhIHN0cmluZywgYSBidWZmZXIgb3IgYW4gb2JqZWN0JztcclxuXHJcbmZ1bmN0aW9uIGZyb21CYXNlNjQoYmFzZTY0KSB7XHJcbiAgcmV0dXJuIGJhc2U2NFxyXG4gICAgLnJlcGxhY2UoLz0vZywgJycpXHJcbiAgICAucmVwbGFjZSgvXFwrL2csICctJylcclxuICAgIC5yZXBsYWNlKC9cXC8vZywgJ18nKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdG9CYXNlNjQoYmFzZTY0dXJsKSB7XHJcbiAgYmFzZTY0dXJsID0gYmFzZTY0dXJsLnRvU3RyaW5nKCk7XHJcblxyXG4gIHZhciBwYWRkaW5nID0gNCAtIGJhc2U2NHVybC5sZW5ndGggJSA0O1xyXG4gIGlmIChwYWRkaW5nICE9PSA0KSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZGRpbmc7ICsraSkge1xyXG4gICAgICBiYXNlNjR1cmwgKz0gJz0nO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGJhc2U2NHVybFxyXG4gICAgLnJlcGxhY2UoL1xcLS9nLCAnKycpXHJcbiAgICAucmVwbGFjZSgvXy9nLCAnLycpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0eXBlRXJyb3IodGVtcGxhdGUpIHtcclxuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICB2YXIgZXJyTXNnID0gdXRpbC5mb3JtYXQuYmluZCh1dGlsLCB0ZW1wbGF0ZSkuYXBwbHkobnVsbCwgYXJncyk7XHJcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoZXJyTXNnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVmZmVyT3JTdHJpbmcob2JqKSB7XHJcbiAgcmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcihvYmopIHx8IHR5cGVvZiBvYmogPT09ICdzdHJpbmcnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBub3JtYWxpemVJbnB1dCh0aGluZykge1xyXG4gIGlmICghYnVmZmVyT3JTdHJpbmcodGhpbmcpKVxyXG4gICAgdGhpbmcgPSBKU09OLnN0cmluZ2lmeSh0aGluZyk7XHJcbiAgcmV0dXJuIHRoaW5nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVIbWFjU2lnbmVyKGJpdHMpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gc2lnbih0aGluZywgc2VjcmV0KSB7XHJcbiAgICBpZiAoIWJ1ZmZlck9yU3RyaW5nKHNlY3JldCkpXHJcbiAgICAgIHRocm93IHR5cGVFcnJvcihNU0dfSU5WQUxJRF9TRUNSRVQpO1xyXG4gICAgdGhpbmcgPSBub3JtYWxpemVJbnB1dCh0aGluZyk7XHJcbiAgICB2YXIgaG1hYyA9IGNyeXB0by5jcmVhdGVIbWFjKCdzaGEnICsgYml0cywgc2VjcmV0KTtcclxuICAgIHZhciBzaWcgPSAoaG1hYy51cGRhdGUodGhpbmcpLCBobWFjLmRpZ2VzdCgnYmFzZTY0JykpXHJcbiAgICByZXR1cm4gZnJvbUJhc2U2NChzaWcpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlSG1hY1ZlcmlmaWVyKGJpdHMpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gdmVyaWZ5KHRoaW5nLCBzaWduYXR1cmUsIHNlY3JldCkge1xyXG4gICAgdmFyIGNvbXB1dGVkU2lnID0gY3JlYXRlSG1hY1NpZ25lcihiaXRzKSh0aGluZywgc2VjcmV0KTtcclxuICAgIHJldHVybiBidWZmZXJFcXVhbChCdWZmZXIuZnJvbShzaWduYXR1cmUpLCBCdWZmZXIuZnJvbShjb21wdXRlZFNpZykpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlS2V5U2lnbmVyKGJpdHMpIHtcclxuIHJldHVybiBmdW5jdGlvbiBzaWduKHRoaW5nLCBwcml2YXRlS2V5KSB7XHJcbiAgICBpZiAoIWJ1ZmZlck9yU3RyaW5nKHByaXZhdGVLZXkpICYmICEodHlwZW9mIHByaXZhdGVLZXkgPT09ICdvYmplY3QnKSlcclxuICAgICAgdGhyb3cgdHlwZUVycm9yKE1TR19JTlZBTElEX1NJR05FUl9LRVkpO1xyXG4gICAgdGhpbmcgPSBub3JtYWxpemVJbnB1dCh0aGluZyk7XHJcbiAgICAvLyBFdmVuIHRob3VnaCB3ZSBhcmUgc3BlY2lmeWluZyBcIlJTQVwiIGhlcmUsIHRoaXMgd29ya3Mgd2l0aCBFQ0RTQVxyXG4gICAgLy8ga2V5cyBhcyB3ZWxsLlxyXG4gICAgdmFyIHNpZ25lciA9IGNyeXB0by5jcmVhdGVTaWduKCdSU0EtU0hBJyArIGJpdHMpO1xyXG4gICAgdmFyIHNpZyA9IChzaWduZXIudXBkYXRlKHRoaW5nKSwgc2lnbmVyLnNpZ24ocHJpdmF0ZUtleSwgJ2Jhc2U2NCcpKTtcclxuICAgIHJldHVybiBmcm9tQmFzZTY0KHNpZyk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVLZXlWZXJpZmllcihiaXRzKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIHZlcmlmeSh0aGluZywgc2lnbmF0dXJlLCBwdWJsaWNLZXkpIHtcclxuICAgIGlmICghYnVmZmVyT3JTdHJpbmcocHVibGljS2V5KSlcclxuICAgICAgdGhyb3cgdHlwZUVycm9yKE1TR19JTlZBTElEX1ZFUklGSUVSX0tFWSk7XHJcbiAgICB0aGluZyA9IG5vcm1hbGl6ZUlucHV0KHRoaW5nKTtcclxuICAgIHNpZ25hdHVyZSA9IHRvQmFzZTY0KHNpZ25hdHVyZSk7XHJcbiAgICB2YXIgdmVyaWZpZXIgPSBjcnlwdG8uY3JlYXRlVmVyaWZ5KCdSU0EtU0hBJyArIGJpdHMpO1xyXG4gICAgdmVyaWZpZXIudXBkYXRlKHRoaW5nKTtcclxuICAgIHJldHVybiB2ZXJpZmllci52ZXJpZnkocHVibGljS2V5LCBzaWduYXR1cmUsICdiYXNlNjQnKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBTU0tleVNpZ25lcihiaXRzKSB7XHJcbiByZXR1cm4gZnVuY3Rpb24gc2lnbih0aGluZywgcHJpdmF0ZUtleSkge1xyXG4gICAgaWYgKCFidWZmZXJPclN0cmluZyhwcml2YXRlS2V5KSAmJiAhKHR5cGVvZiBwcml2YXRlS2V5ID09PSAnb2JqZWN0JykpXHJcbiAgICAgIHRocm93IHR5cGVFcnJvcihNU0dfSU5WQUxJRF9TSUdORVJfS0VZKTtcclxuICAgIHRoaW5nID0gbm9ybWFsaXplSW5wdXQodGhpbmcpO1xyXG4gICAgdmFyIHNpZ25lciA9IGNyeXB0by5jcmVhdGVTaWduKCdSU0EtU0hBJyArIGJpdHMpO1xyXG4gICAgdmFyIHNpZyA9IChzaWduZXIudXBkYXRlKHRoaW5nKSwgc2lnbmVyLnNpZ24oe2tleTogcHJpdmF0ZUtleSwgcGFkZGluZzogY3J5cHRvLmNvbnN0YW50cy5SU0FfUEtDUzFfUFNTX1BBRERJTkd9LCAnYmFzZTY0JykpO1xyXG4gICAgcmV0dXJuIGZyb21CYXNlNjQoc2lnKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBTU0tleVZlcmlmaWVyKGJpdHMpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gdmVyaWZ5KHRoaW5nLCBzaWduYXR1cmUsIHB1YmxpY0tleSkge1xyXG4gICAgaWYgKCFidWZmZXJPclN0cmluZyhwdWJsaWNLZXkpKVxyXG4gICAgICB0aHJvdyB0eXBlRXJyb3IoTVNHX0lOVkFMSURfVkVSSUZJRVJfS0VZKTtcclxuICAgIHRoaW5nID0gbm9ybWFsaXplSW5wdXQodGhpbmcpO1xyXG4gICAgc2lnbmF0dXJlID0gdG9CYXNlNjQoc2lnbmF0dXJlKTtcclxuICAgIHZhciB2ZXJpZmllciA9IGNyeXB0by5jcmVhdGVWZXJpZnkoJ1JTQS1TSEEnICsgYml0cyk7XHJcbiAgICB2ZXJpZmllci51cGRhdGUodGhpbmcpO1xyXG4gICAgcmV0dXJuIHZlcmlmaWVyLnZlcmlmeSh7a2V5OiBwdWJsaWNLZXksIHBhZGRpbmc6IGNyeXB0by5jb25zdGFudHMuUlNBX1BLQ1MxX1BTU19QQURESU5HfSwgc2lnbmF0dXJlLCAnYmFzZTY0Jyk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFQ0RTQVNpZ25lcihiaXRzKSB7XHJcbiAgdmFyIGlubmVyID0gY3JlYXRlS2V5U2lnbmVyKGJpdHMpO1xyXG4gIHJldHVybiBmdW5jdGlvbiBzaWduKCkge1xyXG4gICAgdmFyIHNpZ25hdHVyZSA9IGlubmVyLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XHJcbiAgICBzaWduYXR1cmUgPSBmb3JtYXRFY2RzYS5kZXJUb0pvc2Uoc2lnbmF0dXJlLCAnRVMnICsgYml0cyk7XHJcbiAgICByZXR1cm4gc2lnbmF0dXJlO1xyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUVDRFNBVmVyaWZlcihiaXRzKSB7XHJcbiAgdmFyIGlubmVyID0gY3JlYXRlS2V5VmVyaWZpZXIoYml0cyk7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIHZlcmlmeSh0aGluZywgc2lnbmF0dXJlLCBwdWJsaWNLZXkpIHtcclxuICAgIHNpZ25hdHVyZSA9IGZvcm1hdEVjZHNhLmpvc2VUb0RlcihzaWduYXR1cmUsICdFUycgKyBiaXRzKS50b1N0cmluZygnYmFzZTY0Jyk7XHJcbiAgICB2YXIgcmVzdWx0ID0gaW5uZXIodGhpbmcsIHNpZ25hdHVyZSwgcHVibGljS2V5KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTm9uZVNpZ25lcigpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gc2lnbigpIHtcclxuICAgIHJldHVybiAnJztcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU5vbmVWZXJpZmllcigpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gdmVyaWZ5KHRoaW5nLCBzaWduYXR1cmUpIHtcclxuICAgIHJldHVybiBzaWduYXR1cmUgPT09ICcnO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBqd2EoYWxnb3JpdGhtKSB7XHJcbiAgdmFyIHNpZ25lckZhY3RvcmllcyA9IHtcclxuICAgIGhzOiBjcmVhdGVIbWFjU2lnbmVyLFxyXG4gICAgcnM6IGNyZWF0ZUtleVNpZ25lcixcclxuICAgIHBzOiBjcmVhdGVQU1NLZXlTaWduZXIsXHJcbiAgICBlczogY3JlYXRlRUNEU0FTaWduZXIsXHJcbiAgICBub25lOiBjcmVhdGVOb25lU2lnbmVyLFxyXG4gIH1cclxuICB2YXIgdmVyaWZpZXJGYWN0b3JpZXMgPSB7XHJcbiAgICBoczogY3JlYXRlSG1hY1ZlcmlmaWVyLFxyXG4gICAgcnM6IGNyZWF0ZUtleVZlcmlmaWVyLFxyXG4gICAgcHM6IGNyZWF0ZVBTU0tleVZlcmlmaWVyLFxyXG4gICAgZXM6IGNyZWF0ZUVDRFNBVmVyaWZlcixcclxuICAgIG5vbmU6IGNyZWF0ZU5vbmVWZXJpZmllcixcclxuICB9XHJcbiAgdmFyIG1hdGNoID0gYWxnb3JpdGhtLm1hdGNoKC9eKFJTfFBTfEVTfEhTKSgyNTZ8Mzg0fDUxMikkfF4obm9uZSkkL2kpO1xyXG4gIGlmICghbWF0Y2gpXHJcbiAgICB0aHJvdyB0eXBlRXJyb3IoTVNHX0lOVkFMSURfQUxHT1JJVEhNLCBhbGdvcml0aG0pO1xyXG4gIHZhciBhbGdvID0gKG1hdGNoWzFdIHx8IG1hdGNoWzNdKS50b0xvd2VyQ2FzZSgpO1xyXG4gIHZhciBiaXRzID0gbWF0Y2hbMl07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzaWduOiBzaWduZXJGYWN0b3JpZXNbYWxnb10oYml0cyksXHJcbiAgICB2ZXJpZnk6IHZlcmlmaWVyRmFjdG9yaWVzW2FsZ29dKGJpdHMpLFxyXG4gIH1cclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==