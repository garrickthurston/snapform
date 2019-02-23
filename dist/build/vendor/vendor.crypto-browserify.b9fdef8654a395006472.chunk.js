(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.crypto-browserify"],{

/***/ "HEbw":
/*!*************************************************!*\
  !*** ./node_modules/crypto-browserify/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.randomBytes = exports.rng = exports.pseudoRandomBytes = exports.prng = __webpack_require__(/*! randombytes */ "Edxu")
exports.createHash = exports.Hash = __webpack_require__(/*! create-hash */ "mObS")
exports.createHmac = exports.Hmac = __webpack_require__(/*! create-hmac */ "Giow")

var algos = __webpack_require__(/*! browserify-sign/algos */ "EW2V")
var algoKeys = Object.keys(algos)
var hashes = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'md5', 'rmd160'].concat(algoKeys)
exports.getHashes = function () {
  return hashes
}

var p = __webpack_require__(/*! pbkdf2 */ "oJl4")
exports.pbkdf2 = p.pbkdf2
exports.pbkdf2Sync = p.pbkdf2Sync

var aes = __webpack_require__(/*! browserify-cipher */ "lWpZ")

exports.Cipher = aes.Cipher
exports.createCipher = aes.createCipher
exports.Cipheriv = aes.Cipheriv
exports.createCipheriv = aes.createCipheriv
exports.Decipher = aes.Decipher
exports.createDecipher = aes.createDecipher
exports.Decipheriv = aes.Decipheriv
exports.createDecipheriv = aes.createDecipheriv
exports.getCiphers = aes.getCiphers
exports.listCiphers = aes.listCiphers

var dh = __webpack_require__(/*! diffie-hellman */ "ANxK")

exports.DiffieHellmanGroup = dh.DiffieHellmanGroup
exports.createDiffieHellmanGroup = dh.createDiffieHellmanGroup
exports.getDiffieHellman = dh.getDiffieHellman
exports.createDiffieHellman = dh.createDiffieHellman
exports.DiffieHellman = dh.DiffieHellman

var sign = __webpack_require__(/*! browserify-sign */ "tpL1")

exports.createSign = sign.createSign
exports.Sign = sign.Sign
exports.createVerify = sign.createVerify
exports.Verify = sign.Verify

exports.createECDH = __webpack_require__(/*! create-ecdh */ "4dMO")

var publicEncrypt = __webpack_require__(/*! public-encrypt */ "ZEK9")

exports.publicEncrypt = publicEncrypt.publicEncrypt
exports.privateEncrypt = publicEncrypt.privateEncrypt
exports.publicDecrypt = publicEncrypt.publicDecrypt
exports.privateDecrypt = publicEncrypt.privateDecrypt

// the least I can do is make error messages for the rest of the node.js/crypto api.
// ;[
//   'createCredentials'
// ].forEach(function (name) {
//   exports[name] = function () {
//     throw new Error([
//       'sorry, ' + name + ' is not implemented yet',
//       'we accept pull requests',
//       'https://github.com/crypto-browserify/crypto-browserify'
//     ].join('\n'))
//   }
// })

var rf = __webpack_require__(/*! randomfill */ "dcwN")

exports.randomFill = rf.randomFill
exports.randomFillSync = rf.randomFillSync

exports.createCredentials = function () {
  throw new Error([
    'sorry, createCredentials is not implemented yet',
    'we accept pull requests',
    'https://github.com/crypto-browserify/crypto-browserify'
  ].join('\n'))
}

exports.constants = {
  'DH_CHECK_P_NOT_SAFE_PRIME': 2,
  'DH_CHECK_P_NOT_PRIME': 1,
  'DH_UNABLE_TO_CHECK_GENERATOR': 4,
  'DH_NOT_SUITABLE_GENERATOR': 8,
  'NPN_ENABLED': 1,
  'ALPN_ENABLED': 1,
  'RSA_PKCS1_PADDING': 1,
  'RSA_SSLV23_PADDING': 2,
  'RSA_NO_PADDING': 3,
  'RSA_PKCS1_OAEP_PADDING': 4,
  'RSA_X931_PADDING': 5,
  'RSA_PKCS1_PSS_PADDING': 6,
  'POINT_CONVERSION_COMPRESSED': 2,
  'POINT_CONVERSION_UNCOMPRESSED': 4,
  'POINT_CONVERSION_HYBRID': 6
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFZOztBQUVaLCtFQUErRSxtQkFBTyxDQUFDLHlCQUFhO0FBQ3BHLG9DQUFvQyxtQkFBTyxDQUFDLHlCQUFhO0FBQ3pELG9DQUFvQyxtQkFBTyxDQUFDLHlCQUFhOztBQUV6RCxZQUFZLG1CQUFPLENBQUMsbUNBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUUFBUSxtQkFBTyxDQUFDLG9CQUFRO0FBQ3hCO0FBQ0E7O0FBRUEsVUFBVSxtQkFBTyxDQUFDLCtCQUFtQjs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUyxtQkFBTyxDQUFDLDRCQUFnQjs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLG1CQUFPLENBQUMsNkJBQWlCOztBQUVwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUIsbUJBQU8sQ0FBQyx5QkFBYTs7QUFFMUMsb0JBQW9CLG1CQUFPLENBQUMsNEJBQWdCOztBQUU1QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKLFNBQVMsbUJBQU8sQ0FBQyx3QkFBWTs7QUFFN0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuY3J5cHRvLWJyb3dzZXJpZnkuYjlmZGVmODY1NGEzOTUwMDY0NzIuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcclxuXHJcbmV4cG9ydHMucmFuZG9tQnl0ZXMgPSBleHBvcnRzLnJuZyA9IGV4cG9ydHMucHNldWRvUmFuZG9tQnl0ZXMgPSBleHBvcnRzLnBybmcgPSByZXF1aXJlKCdyYW5kb21ieXRlcycpXHJcbmV4cG9ydHMuY3JlYXRlSGFzaCA9IGV4cG9ydHMuSGFzaCA9IHJlcXVpcmUoJ2NyZWF0ZS1oYXNoJylcclxuZXhwb3J0cy5jcmVhdGVIbWFjID0gZXhwb3J0cy5IbWFjID0gcmVxdWlyZSgnY3JlYXRlLWhtYWMnKVxyXG5cclxudmFyIGFsZ29zID0gcmVxdWlyZSgnYnJvd3NlcmlmeS1zaWduL2FsZ29zJylcclxudmFyIGFsZ29LZXlzID0gT2JqZWN0LmtleXMoYWxnb3MpXHJcbnZhciBoYXNoZXMgPSBbJ3NoYTEnLCAnc2hhMjI0JywgJ3NoYTI1NicsICdzaGEzODQnLCAnc2hhNTEyJywgJ21kNScsICdybWQxNjAnXS5jb25jYXQoYWxnb0tleXMpXHJcbmV4cG9ydHMuZ2V0SGFzaGVzID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBoYXNoZXNcclxufVxyXG5cclxudmFyIHAgPSByZXF1aXJlKCdwYmtkZjInKVxyXG5leHBvcnRzLnBia2RmMiA9IHAucGJrZGYyXHJcbmV4cG9ydHMucGJrZGYyU3luYyA9IHAucGJrZGYyU3luY1xyXG5cclxudmFyIGFlcyA9IHJlcXVpcmUoJ2Jyb3dzZXJpZnktY2lwaGVyJylcclxuXHJcbmV4cG9ydHMuQ2lwaGVyID0gYWVzLkNpcGhlclxyXG5leHBvcnRzLmNyZWF0ZUNpcGhlciA9IGFlcy5jcmVhdGVDaXBoZXJcclxuZXhwb3J0cy5DaXBoZXJpdiA9IGFlcy5DaXBoZXJpdlxyXG5leHBvcnRzLmNyZWF0ZUNpcGhlcml2ID0gYWVzLmNyZWF0ZUNpcGhlcml2XHJcbmV4cG9ydHMuRGVjaXBoZXIgPSBhZXMuRGVjaXBoZXJcclxuZXhwb3J0cy5jcmVhdGVEZWNpcGhlciA9IGFlcy5jcmVhdGVEZWNpcGhlclxyXG5leHBvcnRzLkRlY2lwaGVyaXYgPSBhZXMuRGVjaXBoZXJpdlxyXG5leHBvcnRzLmNyZWF0ZURlY2lwaGVyaXYgPSBhZXMuY3JlYXRlRGVjaXBoZXJpdlxyXG5leHBvcnRzLmdldENpcGhlcnMgPSBhZXMuZ2V0Q2lwaGVyc1xyXG5leHBvcnRzLmxpc3RDaXBoZXJzID0gYWVzLmxpc3RDaXBoZXJzXHJcblxyXG52YXIgZGggPSByZXF1aXJlKCdkaWZmaWUtaGVsbG1hbicpXHJcblxyXG5leHBvcnRzLkRpZmZpZUhlbGxtYW5Hcm91cCA9IGRoLkRpZmZpZUhlbGxtYW5Hcm91cFxyXG5leHBvcnRzLmNyZWF0ZURpZmZpZUhlbGxtYW5Hcm91cCA9IGRoLmNyZWF0ZURpZmZpZUhlbGxtYW5Hcm91cFxyXG5leHBvcnRzLmdldERpZmZpZUhlbGxtYW4gPSBkaC5nZXREaWZmaWVIZWxsbWFuXHJcbmV4cG9ydHMuY3JlYXRlRGlmZmllSGVsbG1hbiA9IGRoLmNyZWF0ZURpZmZpZUhlbGxtYW5cclxuZXhwb3J0cy5EaWZmaWVIZWxsbWFuID0gZGguRGlmZmllSGVsbG1hblxyXG5cclxudmFyIHNpZ24gPSByZXF1aXJlKCdicm93c2VyaWZ5LXNpZ24nKVxyXG5cclxuZXhwb3J0cy5jcmVhdGVTaWduID0gc2lnbi5jcmVhdGVTaWduXHJcbmV4cG9ydHMuU2lnbiA9IHNpZ24uU2lnblxyXG5leHBvcnRzLmNyZWF0ZVZlcmlmeSA9IHNpZ24uY3JlYXRlVmVyaWZ5XHJcbmV4cG9ydHMuVmVyaWZ5ID0gc2lnbi5WZXJpZnlcclxuXHJcbmV4cG9ydHMuY3JlYXRlRUNESCA9IHJlcXVpcmUoJ2NyZWF0ZS1lY2RoJylcclxuXHJcbnZhciBwdWJsaWNFbmNyeXB0ID0gcmVxdWlyZSgncHVibGljLWVuY3J5cHQnKVxyXG5cclxuZXhwb3J0cy5wdWJsaWNFbmNyeXB0ID0gcHVibGljRW5jcnlwdC5wdWJsaWNFbmNyeXB0XHJcbmV4cG9ydHMucHJpdmF0ZUVuY3J5cHQgPSBwdWJsaWNFbmNyeXB0LnByaXZhdGVFbmNyeXB0XHJcbmV4cG9ydHMucHVibGljRGVjcnlwdCA9IHB1YmxpY0VuY3J5cHQucHVibGljRGVjcnlwdFxyXG5leHBvcnRzLnByaXZhdGVEZWNyeXB0ID0gcHVibGljRW5jcnlwdC5wcml2YXRlRGVjcnlwdFxyXG5cclxuLy8gdGhlIGxlYXN0IEkgY2FuIGRvIGlzIG1ha2UgZXJyb3IgbWVzc2FnZXMgZm9yIHRoZSByZXN0IG9mIHRoZSBub2RlLmpzL2NyeXB0byBhcGkuXHJcbi8vIDtbXHJcbi8vICAgJ2NyZWF0ZUNyZWRlbnRpYWxzJ1xyXG4vLyBdLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcclxuLy8gICBleHBvcnRzW25hbWVdID0gZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgdGhyb3cgbmV3IEVycm9yKFtcclxuLy8gICAgICAgJ3NvcnJ5LCAnICsgbmFtZSArICcgaXMgbm90IGltcGxlbWVudGVkIHlldCcsXHJcbi8vICAgICAgICd3ZSBhY2NlcHQgcHVsbCByZXF1ZXN0cycsXHJcbi8vICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vY3J5cHRvLWJyb3dzZXJpZnkvY3J5cHRvLWJyb3dzZXJpZnknXHJcbi8vICAgICBdLmpvaW4oJ1xcbicpKVxyXG4vLyAgIH1cclxuLy8gfSlcclxuXHJcbnZhciByZiA9IHJlcXVpcmUoJ3JhbmRvbWZpbGwnKVxyXG5cclxuZXhwb3J0cy5yYW5kb21GaWxsID0gcmYucmFuZG9tRmlsbFxyXG5leHBvcnRzLnJhbmRvbUZpbGxTeW5jID0gcmYucmFuZG9tRmlsbFN5bmNcclxuXHJcbmV4cG9ydHMuY3JlYXRlQ3JlZGVudGlhbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhyb3cgbmV3IEVycm9yKFtcclxuICAgICdzb3JyeSwgY3JlYXRlQ3JlZGVudGlhbHMgaXMgbm90IGltcGxlbWVudGVkIHlldCcsXHJcbiAgICAnd2UgYWNjZXB0IHB1bGwgcmVxdWVzdHMnLFxyXG4gICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9jcnlwdG8tYnJvd3NlcmlmeS9jcnlwdG8tYnJvd3NlcmlmeSdcclxuICBdLmpvaW4oJ1xcbicpKVxyXG59XHJcblxyXG5leHBvcnRzLmNvbnN0YW50cyA9IHtcclxuICAnREhfQ0hFQ0tfUF9OT1RfU0FGRV9QUklNRSc6IDIsXHJcbiAgJ0RIX0NIRUNLX1BfTk9UX1BSSU1FJzogMSxcclxuICAnREhfVU5BQkxFX1RPX0NIRUNLX0dFTkVSQVRPUic6IDQsXHJcbiAgJ0RIX05PVF9TVUlUQUJMRV9HRU5FUkFUT1InOiA4LFxyXG4gICdOUE5fRU5BQkxFRCc6IDEsXHJcbiAgJ0FMUE5fRU5BQkxFRCc6IDEsXHJcbiAgJ1JTQV9QS0NTMV9QQURESU5HJzogMSxcclxuICAnUlNBX1NTTFYyM19QQURESU5HJzogMixcclxuICAnUlNBX05PX1BBRERJTkcnOiAzLFxyXG4gICdSU0FfUEtDUzFfT0FFUF9QQURESU5HJzogNCxcclxuICAnUlNBX1g5MzFfUEFERElORyc6IDUsXHJcbiAgJ1JTQV9QS0NTMV9QU1NfUEFERElORyc6IDYsXHJcbiAgJ1BPSU5UX0NPTlZFUlNJT05fQ09NUFJFU1NFRCc6IDIsXHJcbiAgJ1BPSU5UX0NPTlZFUlNJT05fVU5DT01QUkVTU0VEJzogNCxcclxuICAnUE9JTlRfQ09OVkVSU0lPTl9IWUJSSUQnOiA2XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==