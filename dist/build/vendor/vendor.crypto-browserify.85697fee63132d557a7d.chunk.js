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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFZOztBQUVaLCtFQUErRSxtQkFBTyxDQUFDLHlCQUFhO0FBQ3BHLG9DQUFvQyxtQkFBTyxDQUFDLHlCQUFhO0FBQ3pELG9DQUFvQyxtQkFBTyxDQUFDLHlCQUFhOztBQUV6RCxZQUFZLG1CQUFPLENBQUMsbUNBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUUFBUSxtQkFBTyxDQUFDLG9CQUFRO0FBQ3hCO0FBQ0E7O0FBRUEsVUFBVSxtQkFBTyxDQUFDLCtCQUFtQjs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUyxtQkFBTyxDQUFDLDRCQUFnQjs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLG1CQUFPLENBQUMsNkJBQWlCOztBQUVwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUIsbUJBQU8sQ0FBQyx5QkFBYTs7QUFFMUMsb0JBQW9CLG1CQUFPLENBQUMsNEJBQWdCOztBQUU1QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKLFNBQVMsbUJBQU8sQ0FBQyx3QkFBWTs7QUFFN0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuY3J5cHRvLWJyb3dzZXJpZnkuODU2OTdmZWU2MzEzMmQ1NTdhN2QuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuZXhwb3J0cy5yYW5kb21CeXRlcyA9IGV4cG9ydHMucm5nID0gZXhwb3J0cy5wc2V1ZG9SYW5kb21CeXRlcyA9IGV4cG9ydHMucHJuZyA9IHJlcXVpcmUoJ3JhbmRvbWJ5dGVzJylcbmV4cG9ydHMuY3JlYXRlSGFzaCA9IGV4cG9ydHMuSGFzaCA9IHJlcXVpcmUoJ2NyZWF0ZS1oYXNoJylcbmV4cG9ydHMuY3JlYXRlSG1hYyA9IGV4cG9ydHMuSG1hYyA9IHJlcXVpcmUoJ2NyZWF0ZS1obWFjJylcblxudmFyIGFsZ29zID0gcmVxdWlyZSgnYnJvd3NlcmlmeS1zaWduL2FsZ29zJylcbnZhciBhbGdvS2V5cyA9IE9iamVjdC5rZXlzKGFsZ29zKVxudmFyIGhhc2hlcyA9IFsnc2hhMScsICdzaGEyMjQnLCAnc2hhMjU2JywgJ3NoYTM4NCcsICdzaGE1MTInLCAnbWQ1JywgJ3JtZDE2MCddLmNvbmNhdChhbGdvS2V5cylcbmV4cG9ydHMuZ2V0SGFzaGVzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gaGFzaGVzXG59XG5cbnZhciBwID0gcmVxdWlyZSgncGJrZGYyJylcbmV4cG9ydHMucGJrZGYyID0gcC5wYmtkZjJcbmV4cG9ydHMucGJrZGYyU3luYyA9IHAucGJrZGYyU3luY1xuXG52YXIgYWVzID0gcmVxdWlyZSgnYnJvd3NlcmlmeS1jaXBoZXInKVxuXG5leHBvcnRzLkNpcGhlciA9IGFlcy5DaXBoZXJcbmV4cG9ydHMuY3JlYXRlQ2lwaGVyID0gYWVzLmNyZWF0ZUNpcGhlclxuZXhwb3J0cy5DaXBoZXJpdiA9IGFlcy5DaXBoZXJpdlxuZXhwb3J0cy5jcmVhdGVDaXBoZXJpdiA9IGFlcy5jcmVhdGVDaXBoZXJpdlxuZXhwb3J0cy5EZWNpcGhlciA9IGFlcy5EZWNpcGhlclxuZXhwb3J0cy5jcmVhdGVEZWNpcGhlciA9IGFlcy5jcmVhdGVEZWNpcGhlclxuZXhwb3J0cy5EZWNpcGhlcml2ID0gYWVzLkRlY2lwaGVyaXZcbmV4cG9ydHMuY3JlYXRlRGVjaXBoZXJpdiA9IGFlcy5jcmVhdGVEZWNpcGhlcml2XG5leHBvcnRzLmdldENpcGhlcnMgPSBhZXMuZ2V0Q2lwaGVyc1xuZXhwb3J0cy5saXN0Q2lwaGVycyA9IGFlcy5saXN0Q2lwaGVyc1xuXG52YXIgZGggPSByZXF1aXJlKCdkaWZmaWUtaGVsbG1hbicpXG5cbmV4cG9ydHMuRGlmZmllSGVsbG1hbkdyb3VwID0gZGguRGlmZmllSGVsbG1hbkdyb3VwXG5leHBvcnRzLmNyZWF0ZURpZmZpZUhlbGxtYW5Hcm91cCA9IGRoLmNyZWF0ZURpZmZpZUhlbGxtYW5Hcm91cFxuZXhwb3J0cy5nZXREaWZmaWVIZWxsbWFuID0gZGguZ2V0RGlmZmllSGVsbG1hblxuZXhwb3J0cy5jcmVhdGVEaWZmaWVIZWxsbWFuID0gZGguY3JlYXRlRGlmZmllSGVsbG1hblxuZXhwb3J0cy5EaWZmaWVIZWxsbWFuID0gZGguRGlmZmllSGVsbG1hblxuXG52YXIgc2lnbiA9IHJlcXVpcmUoJ2Jyb3dzZXJpZnktc2lnbicpXG5cbmV4cG9ydHMuY3JlYXRlU2lnbiA9IHNpZ24uY3JlYXRlU2lnblxuZXhwb3J0cy5TaWduID0gc2lnbi5TaWduXG5leHBvcnRzLmNyZWF0ZVZlcmlmeSA9IHNpZ24uY3JlYXRlVmVyaWZ5XG5leHBvcnRzLlZlcmlmeSA9IHNpZ24uVmVyaWZ5XG5cbmV4cG9ydHMuY3JlYXRlRUNESCA9IHJlcXVpcmUoJ2NyZWF0ZS1lY2RoJylcblxudmFyIHB1YmxpY0VuY3J5cHQgPSByZXF1aXJlKCdwdWJsaWMtZW5jcnlwdCcpXG5cbmV4cG9ydHMucHVibGljRW5jcnlwdCA9IHB1YmxpY0VuY3J5cHQucHVibGljRW5jcnlwdFxuZXhwb3J0cy5wcml2YXRlRW5jcnlwdCA9IHB1YmxpY0VuY3J5cHQucHJpdmF0ZUVuY3J5cHRcbmV4cG9ydHMucHVibGljRGVjcnlwdCA9IHB1YmxpY0VuY3J5cHQucHVibGljRGVjcnlwdFxuZXhwb3J0cy5wcml2YXRlRGVjcnlwdCA9IHB1YmxpY0VuY3J5cHQucHJpdmF0ZURlY3J5cHRcblxuLy8gdGhlIGxlYXN0IEkgY2FuIGRvIGlzIG1ha2UgZXJyb3IgbWVzc2FnZXMgZm9yIHRoZSByZXN0IG9mIHRoZSBub2RlLmpzL2NyeXB0byBhcGkuXG4vLyA7W1xuLy8gICAnY3JlYXRlQ3JlZGVudGlhbHMnXG4vLyBdLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbi8vICAgZXhwb3J0c1tuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICB0aHJvdyBuZXcgRXJyb3IoW1xuLy8gICAgICAgJ3NvcnJ5LCAnICsgbmFtZSArICcgaXMgbm90IGltcGxlbWVudGVkIHlldCcsXG4vLyAgICAgICAnd2UgYWNjZXB0IHB1bGwgcmVxdWVzdHMnLFxuLy8gICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9jcnlwdG8tYnJvd3NlcmlmeS9jcnlwdG8tYnJvd3NlcmlmeSdcbi8vICAgICBdLmpvaW4oJ1xcbicpKVxuLy8gICB9XG4vLyB9KVxuXG52YXIgcmYgPSByZXF1aXJlKCdyYW5kb21maWxsJylcblxuZXhwb3J0cy5yYW5kb21GaWxsID0gcmYucmFuZG9tRmlsbFxuZXhwb3J0cy5yYW5kb21GaWxsU3luYyA9IHJmLnJhbmRvbUZpbGxTeW5jXG5cbmV4cG9ydHMuY3JlYXRlQ3JlZGVudGlhbHMgPSBmdW5jdGlvbiAoKSB7XG4gIHRocm93IG5ldyBFcnJvcihbXG4gICAgJ3NvcnJ5LCBjcmVhdGVDcmVkZW50aWFscyBpcyBub3QgaW1wbGVtZW50ZWQgeWV0JyxcbiAgICAnd2UgYWNjZXB0IHB1bGwgcmVxdWVzdHMnLFxuICAgICdodHRwczovL2dpdGh1Yi5jb20vY3J5cHRvLWJyb3dzZXJpZnkvY3J5cHRvLWJyb3dzZXJpZnknXG4gIF0uam9pbignXFxuJykpXG59XG5cbmV4cG9ydHMuY29uc3RhbnRzID0ge1xuICAnREhfQ0hFQ0tfUF9OT1RfU0FGRV9QUklNRSc6IDIsXG4gICdESF9DSEVDS19QX05PVF9QUklNRSc6IDEsXG4gICdESF9VTkFCTEVfVE9fQ0hFQ0tfR0VORVJBVE9SJzogNCxcbiAgJ0RIX05PVF9TVUlUQUJMRV9HRU5FUkFUT1InOiA4LFxuICAnTlBOX0VOQUJMRUQnOiAxLFxuICAnQUxQTl9FTkFCTEVEJzogMSxcbiAgJ1JTQV9QS0NTMV9QQURESU5HJzogMSxcbiAgJ1JTQV9TU0xWMjNfUEFERElORyc6IDIsXG4gICdSU0FfTk9fUEFERElORyc6IDMsXG4gICdSU0FfUEtDUzFfT0FFUF9QQURESU5HJzogNCxcbiAgJ1JTQV9YOTMxX1BBRERJTkcnOiA1LFxuICAnUlNBX1BLQ1MxX1BTU19QQURESU5HJzogNixcbiAgJ1BPSU5UX0NPTlZFUlNJT05fQ09NUFJFU1NFRCc6IDIsXG4gICdQT0lOVF9DT05WRVJTSU9OX1VOQ09NUFJFU1NFRCc6IDQsXG4gICdQT0lOVF9DT05WRVJTSU9OX0hZQlJJRCc6IDZcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=