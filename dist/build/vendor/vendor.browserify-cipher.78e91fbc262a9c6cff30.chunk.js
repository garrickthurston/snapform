(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.browserify-cipher"],{

/***/ "lWpZ":
/*!***************************************************!*\
  !*** ./node_modules/browserify-cipher/browser.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var DES = __webpack_require__(/*! browserify-des */ "Hjy1")
var aes = __webpack_require__(/*! browserify-aes/browser */ "/ab2")
var aesModes = __webpack_require__(/*! browserify-aes/modes */ "usKN")
var desModes = __webpack_require__(/*! browserify-des/modes */ "C+gy")
var ebtk = __webpack_require__(/*! evp_bytestokey */ "roQf")

function createCipher (suite, password) {
  suite = suite.toLowerCase()

  var keyLen, ivLen
  if (aesModes[suite]) {
    keyLen = aesModes[suite].key
    ivLen = aesModes[suite].iv
  } else if (desModes[suite]) {
    keyLen = desModes[suite].key * 8
    ivLen = desModes[suite].iv
  } else {
    throw new TypeError('invalid suite type')
  }

  var keys = ebtk(password, false, keyLen, ivLen)
  return createCipheriv(suite, keys.key, keys.iv)
}

function createDecipher (suite, password) {
  suite = suite.toLowerCase()

  var keyLen, ivLen
  if (aesModes[suite]) {
    keyLen = aesModes[suite].key
    ivLen = aesModes[suite].iv
  } else if (desModes[suite]) {
    keyLen = desModes[suite].key * 8
    ivLen = desModes[suite].iv
  } else {
    throw new TypeError('invalid suite type')
  }

  var keys = ebtk(password, false, keyLen, ivLen)
  return createDecipheriv(suite, keys.key, keys.iv)
}

function createCipheriv (suite, key, iv) {
  suite = suite.toLowerCase()
  if (aesModes[suite]) return aes.createCipheriv(suite, key, iv)
  if (desModes[suite]) return new DES({ key: key, iv: iv, mode: suite })

  throw new TypeError('invalid suite type')
}

function createDecipheriv (suite, key, iv) {
  suite = suite.toLowerCase()
  if (aesModes[suite]) return aes.createDecipheriv(suite, key, iv)
  if (desModes[suite]) return new DES({ key: key, iv: iv, mode: suite, decrypt: true })

  throw new TypeError('invalid suite type')
}

function getCiphers () {
  return Object.keys(desModes).concat(aes.getCiphers())
}

exports.createCipher = exports.Cipher = createCipher
exports.createCipheriv = exports.Cipheriv = createCipheriv
exports.createDecipher = exports.Decipher = createDecipher
exports.createDecipheriv = exports.Decipheriv = createDecipheriv
exports.listCiphers = exports.getCiphers = getCiphers


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1jaXBoZXIvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxVQUFVLG1CQUFPLENBQUMsNEJBQWdCO0FBQ2xDLFVBQVUsbUJBQU8sQ0FBQyxvQ0FBd0I7QUFDMUMsZUFBZSxtQkFBTyxDQUFDLGtDQUFzQjtBQUM3QyxlQUFlLG1CQUFPLENBQUMsa0NBQXNCO0FBQzdDLFdBQVcsbUJBQU8sQ0FBQyw0QkFBZ0I7O0FBRW5DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLGdDQUFnQzs7QUFFdkU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsK0NBQStDOztBQUV0RjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuYnJvd3NlcmlmeS1jaXBoZXIuNzhlOTFmYmMyNjJhOWM2Y2ZmMzAuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgREVTID0gcmVxdWlyZSgnYnJvd3NlcmlmeS1kZXMnKVxyXG52YXIgYWVzID0gcmVxdWlyZSgnYnJvd3NlcmlmeS1hZXMvYnJvd3NlcicpXHJcbnZhciBhZXNNb2RlcyA9IHJlcXVpcmUoJ2Jyb3dzZXJpZnktYWVzL21vZGVzJylcclxudmFyIGRlc01vZGVzID0gcmVxdWlyZSgnYnJvd3NlcmlmeS1kZXMvbW9kZXMnKVxyXG52YXIgZWJ0ayA9IHJlcXVpcmUoJ2V2cF9ieXRlc3Rva2V5JylcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUNpcGhlciAoc3VpdGUsIHBhc3N3b3JkKSB7XHJcbiAgc3VpdGUgPSBzdWl0ZS50b0xvd2VyQ2FzZSgpXHJcblxyXG4gIHZhciBrZXlMZW4sIGl2TGVuXHJcbiAgaWYgKGFlc01vZGVzW3N1aXRlXSkge1xyXG4gICAga2V5TGVuID0gYWVzTW9kZXNbc3VpdGVdLmtleVxyXG4gICAgaXZMZW4gPSBhZXNNb2Rlc1tzdWl0ZV0uaXZcclxuICB9IGVsc2UgaWYgKGRlc01vZGVzW3N1aXRlXSkge1xyXG4gICAga2V5TGVuID0gZGVzTW9kZXNbc3VpdGVdLmtleSAqIDhcclxuICAgIGl2TGVuID0gZGVzTW9kZXNbc3VpdGVdLml2XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgc3VpdGUgdHlwZScpXHJcbiAgfVxyXG5cclxuICB2YXIga2V5cyA9IGVidGsocGFzc3dvcmQsIGZhbHNlLCBrZXlMZW4sIGl2TGVuKVxyXG4gIHJldHVybiBjcmVhdGVDaXBoZXJpdihzdWl0ZSwga2V5cy5rZXksIGtleXMuaXYpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZURlY2lwaGVyIChzdWl0ZSwgcGFzc3dvcmQpIHtcclxuICBzdWl0ZSA9IHN1aXRlLnRvTG93ZXJDYXNlKClcclxuXHJcbiAgdmFyIGtleUxlbiwgaXZMZW5cclxuICBpZiAoYWVzTW9kZXNbc3VpdGVdKSB7XHJcbiAgICBrZXlMZW4gPSBhZXNNb2Rlc1tzdWl0ZV0ua2V5XHJcbiAgICBpdkxlbiA9IGFlc01vZGVzW3N1aXRlXS5pdlxyXG4gIH0gZWxzZSBpZiAoZGVzTW9kZXNbc3VpdGVdKSB7XHJcbiAgICBrZXlMZW4gPSBkZXNNb2Rlc1tzdWl0ZV0ua2V5ICogOFxyXG4gICAgaXZMZW4gPSBkZXNNb2Rlc1tzdWl0ZV0uaXZcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBzdWl0ZSB0eXBlJylcclxuICB9XHJcblxyXG4gIHZhciBrZXlzID0gZWJ0ayhwYXNzd29yZCwgZmFsc2UsIGtleUxlbiwgaXZMZW4pXHJcbiAgcmV0dXJuIGNyZWF0ZURlY2lwaGVyaXYoc3VpdGUsIGtleXMua2V5LCBrZXlzLml2KVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDaXBoZXJpdiAoc3VpdGUsIGtleSwgaXYpIHtcclxuICBzdWl0ZSA9IHN1aXRlLnRvTG93ZXJDYXNlKClcclxuICBpZiAoYWVzTW9kZXNbc3VpdGVdKSByZXR1cm4gYWVzLmNyZWF0ZUNpcGhlcml2KHN1aXRlLCBrZXksIGl2KVxyXG4gIGlmIChkZXNNb2Rlc1tzdWl0ZV0pIHJldHVybiBuZXcgREVTKHsga2V5OiBrZXksIGl2OiBpdiwgbW9kZTogc3VpdGUgfSlcclxuXHJcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBzdWl0ZSB0eXBlJylcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRGVjaXBoZXJpdiAoc3VpdGUsIGtleSwgaXYpIHtcclxuICBzdWl0ZSA9IHN1aXRlLnRvTG93ZXJDYXNlKClcclxuICBpZiAoYWVzTW9kZXNbc3VpdGVdKSByZXR1cm4gYWVzLmNyZWF0ZURlY2lwaGVyaXYoc3VpdGUsIGtleSwgaXYpXHJcbiAgaWYgKGRlc01vZGVzW3N1aXRlXSkgcmV0dXJuIG5ldyBERVMoeyBrZXk6IGtleSwgaXY6IGl2LCBtb2RlOiBzdWl0ZSwgZGVjcnlwdDogdHJ1ZSB9KVxyXG5cclxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHN1aXRlIHR5cGUnKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDaXBoZXJzICgpIHtcclxuICByZXR1cm4gT2JqZWN0LmtleXMoZGVzTW9kZXMpLmNvbmNhdChhZXMuZ2V0Q2lwaGVycygpKVxyXG59XHJcblxyXG5leHBvcnRzLmNyZWF0ZUNpcGhlciA9IGV4cG9ydHMuQ2lwaGVyID0gY3JlYXRlQ2lwaGVyXHJcbmV4cG9ydHMuY3JlYXRlQ2lwaGVyaXYgPSBleHBvcnRzLkNpcGhlcml2ID0gY3JlYXRlQ2lwaGVyaXZcclxuZXhwb3J0cy5jcmVhdGVEZWNpcGhlciA9IGV4cG9ydHMuRGVjaXBoZXIgPSBjcmVhdGVEZWNpcGhlclxyXG5leHBvcnRzLmNyZWF0ZURlY2lwaGVyaXYgPSBleHBvcnRzLkRlY2lwaGVyaXYgPSBjcmVhdGVEZWNpcGhlcml2XHJcbmV4cG9ydHMubGlzdENpcGhlcnMgPSBleHBvcnRzLmdldENpcGhlcnMgPSBnZXRDaXBoZXJzXHJcbiJdLCJzb3VyY2VSb290IjoiIn0=