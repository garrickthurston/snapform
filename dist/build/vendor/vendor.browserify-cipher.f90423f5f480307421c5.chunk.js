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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1jaXBoZXIvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxVQUFVLG1CQUFPLENBQUMsNEJBQWdCO0FBQ2xDLFVBQVUsbUJBQU8sQ0FBQyxvQ0FBd0I7QUFDMUMsZUFBZSxtQkFBTyxDQUFDLGtDQUFzQjtBQUM3QyxlQUFlLG1CQUFPLENBQUMsa0NBQXNCO0FBQzdDLFdBQVcsbUJBQU8sQ0FBQyw0QkFBZ0I7O0FBRW5DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLGdDQUFnQzs7QUFFdkU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsK0NBQStDOztBQUV0RjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuYnJvd3NlcmlmeS1jaXBoZXIuZjkwNDIzZjVmNDgwMzA3NDIxYzUuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgREVTID0gcmVxdWlyZSgnYnJvd3NlcmlmeS1kZXMnKVxudmFyIGFlcyA9IHJlcXVpcmUoJ2Jyb3dzZXJpZnktYWVzL2Jyb3dzZXInKVxudmFyIGFlc01vZGVzID0gcmVxdWlyZSgnYnJvd3NlcmlmeS1hZXMvbW9kZXMnKVxudmFyIGRlc01vZGVzID0gcmVxdWlyZSgnYnJvd3NlcmlmeS1kZXMvbW9kZXMnKVxudmFyIGVidGsgPSByZXF1aXJlKCdldnBfYnl0ZXN0b2tleScpXG5cbmZ1bmN0aW9uIGNyZWF0ZUNpcGhlciAoc3VpdGUsIHBhc3N3b3JkKSB7XG4gIHN1aXRlID0gc3VpdGUudG9Mb3dlckNhc2UoKVxuXG4gIHZhciBrZXlMZW4sIGl2TGVuXG4gIGlmIChhZXNNb2Rlc1tzdWl0ZV0pIHtcbiAgICBrZXlMZW4gPSBhZXNNb2Rlc1tzdWl0ZV0ua2V5XG4gICAgaXZMZW4gPSBhZXNNb2Rlc1tzdWl0ZV0uaXZcbiAgfSBlbHNlIGlmIChkZXNNb2Rlc1tzdWl0ZV0pIHtcbiAgICBrZXlMZW4gPSBkZXNNb2Rlc1tzdWl0ZV0ua2V5ICogOFxuICAgIGl2TGVuID0gZGVzTW9kZXNbc3VpdGVdLml2XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBzdWl0ZSB0eXBlJylcbiAgfVxuXG4gIHZhciBrZXlzID0gZWJ0ayhwYXNzd29yZCwgZmFsc2UsIGtleUxlbiwgaXZMZW4pXG4gIHJldHVybiBjcmVhdGVDaXBoZXJpdihzdWl0ZSwga2V5cy5rZXksIGtleXMuaXYpXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZURlY2lwaGVyIChzdWl0ZSwgcGFzc3dvcmQpIHtcbiAgc3VpdGUgPSBzdWl0ZS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIGtleUxlbiwgaXZMZW5cbiAgaWYgKGFlc01vZGVzW3N1aXRlXSkge1xuICAgIGtleUxlbiA9IGFlc01vZGVzW3N1aXRlXS5rZXlcbiAgICBpdkxlbiA9IGFlc01vZGVzW3N1aXRlXS5pdlxuICB9IGVsc2UgaWYgKGRlc01vZGVzW3N1aXRlXSkge1xuICAgIGtleUxlbiA9IGRlc01vZGVzW3N1aXRlXS5rZXkgKiA4XG4gICAgaXZMZW4gPSBkZXNNb2Rlc1tzdWl0ZV0uaXZcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHN1aXRlIHR5cGUnKVxuICB9XG5cbiAgdmFyIGtleXMgPSBlYnRrKHBhc3N3b3JkLCBmYWxzZSwga2V5TGVuLCBpdkxlbilcbiAgcmV0dXJuIGNyZWF0ZURlY2lwaGVyaXYoc3VpdGUsIGtleXMua2V5LCBrZXlzLml2KVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDaXBoZXJpdiAoc3VpdGUsIGtleSwgaXYpIHtcbiAgc3VpdGUgPSBzdWl0ZS50b0xvd2VyQ2FzZSgpXG4gIGlmIChhZXNNb2Rlc1tzdWl0ZV0pIHJldHVybiBhZXMuY3JlYXRlQ2lwaGVyaXYoc3VpdGUsIGtleSwgaXYpXG4gIGlmIChkZXNNb2Rlc1tzdWl0ZV0pIHJldHVybiBuZXcgREVTKHsga2V5OiBrZXksIGl2OiBpdiwgbW9kZTogc3VpdGUgfSlcblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHN1aXRlIHR5cGUnKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVEZWNpcGhlcml2IChzdWl0ZSwga2V5LCBpdikge1xuICBzdWl0ZSA9IHN1aXRlLnRvTG93ZXJDYXNlKClcbiAgaWYgKGFlc01vZGVzW3N1aXRlXSkgcmV0dXJuIGFlcy5jcmVhdGVEZWNpcGhlcml2KHN1aXRlLCBrZXksIGl2KVxuICBpZiAoZGVzTW9kZXNbc3VpdGVdKSByZXR1cm4gbmV3IERFUyh7IGtleToga2V5LCBpdjogaXYsIG1vZGU6IHN1aXRlLCBkZWNyeXB0OiB0cnVlIH0pXG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBzdWl0ZSB0eXBlJylcbn1cblxuZnVuY3Rpb24gZ2V0Q2lwaGVycyAoKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhkZXNNb2RlcykuY29uY2F0KGFlcy5nZXRDaXBoZXJzKCkpXG59XG5cbmV4cG9ydHMuY3JlYXRlQ2lwaGVyID0gZXhwb3J0cy5DaXBoZXIgPSBjcmVhdGVDaXBoZXJcbmV4cG9ydHMuY3JlYXRlQ2lwaGVyaXYgPSBleHBvcnRzLkNpcGhlcml2ID0gY3JlYXRlQ2lwaGVyaXZcbmV4cG9ydHMuY3JlYXRlRGVjaXBoZXIgPSBleHBvcnRzLkRlY2lwaGVyID0gY3JlYXRlRGVjaXBoZXJcbmV4cG9ydHMuY3JlYXRlRGVjaXBoZXJpdiA9IGV4cG9ydHMuRGVjaXBoZXJpdiA9IGNyZWF0ZURlY2lwaGVyaXZcbmV4cG9ydHMubGlzdENpcGhlcnMgPSBleHBvcnRzLmdldENpcGhlcnMgPSBnZXRDaXBoZXJzXG4iXSwic291cmNlUm9vdCI6IiJ9