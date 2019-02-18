(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.evp_bytestokey"],{

/***/ "roQf":
/*!**********************************************!*\
  !*** ./node_modules/evp_bytestokey/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
var MD5 = __webpack_require__(/*! md5.js */ "9XZ3")

/* eslint-disable camelcase */
function EVP_BytesToKey (password, salt, keyBits, ivLen) {
  if (!Buffer.isBuffer(password)) password = Buffer.from(password, 'binary')
  if (salt) {
    if (!Buffer.isBuffer(salt)) salt = Buffer.from(salt, 'binary')
    if (salt.length !== 8) throw new RangeError('salt should be Buffer with 8 byte length')
  }

  var keyLen = keyBits / 8
  var key = Buffer.alloc(keyLen)
  var iv = Buffer.alloc(ivLen || 0)
  var tmp = Buffer.alloc(0)

  while (keyLen > 0 || ivLen > 0) {
    var hash = new MD5()
    hash.update(tmp)
    hash.update(password)
    if (salt) hash.update(salt)
    tmp = hash.digest()

    var used = 0

    if (keyLen > 0) {
      var keyStart = key.length - keyLen
      used = Math.min(keyLen, tmp.length)
      tmp.copy(key, keyStart, 0, used)
      keyLen -= used
    }

    if (used < tmp.length && ivLen > 0) {
      var ivStart = iv.length - ivLen
      var length = Math.min(ivLen, tmp.length - used)
      tmp.copy(iv, ivStart, used, used + length)
      ivLen -= length
    }
  }

  tmp.fill(0)
  return { key: key, iv: iv }
}

module.exports = EVP_BytesToKey


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZXZwX2J5dGVzdG9rZXkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsYUFBYSxtQkFBTyxDQUFDLHlCQUFhO0FBQ2xDLFVBQVUsbUJBQU8sQ0FBQyxvQkFBUTs7QUFFMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVU7QUFDVjs7QUFFQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmV2cF9ieXRlc3Rva2V5LjM2MmNlYmYzYzI1NDM2ZTE2Y2RiLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG52YXIgTUQ1ID0gcmVxdWlyZSgnbWQ1LmpzJylcblxuLyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXG5mdW5jdGlvbiBFVlBfQnl0ZXNUb0tleSAocGFzc3dvcmQsIHNhbHQsIGtleUJpdHMsIGl2TGVuKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHBhc3N3b3JkKSkgcGFzc3dvcmQgPSBCdWZmZXIuZnJvbShwYXNzd29yZCwgJ2JpbmFyeScpXG4gIGlmIChzYWx0KSB7XG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoc2FsdCkpIHNhbHQgPSBCdWZmZXIuZnJvbShzYWx0LCAnYmluYXJ5JylcbiAgICBpZiAoc2FsdC5sZW5ndGggIT09IDgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzYWx0IHNob3VsZCBiZSBCdWZmZXIgd2l0aCA4IGJ5dGUgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBrZXlMZW4gPSBrZXlCaXRzIC8gOFxuICB2YXIga2V5ID0gQnVmZmVyLmFsbG9jKGtleUxlbilcbiAgdmFyIGl2ID0gQnVmZmVyLmFsbG9jKGl2TGVuIHx8IDApXG4gIHZhciB0bXAgPSBCdWZmZXIuYWxsb2MoMClcblxuICB3aGlsZSAoa2V5TGVuID4gMCB8fCBpdkxlbiA+IDApIHtcbiAgICB2YXIgaGFzaCA9IG5ldyBNRDUoKVxuICAgIGhhc2gudXBkYXRlKHRtcClcbiAgICBoYXNoLnVwZGF0ZShwYXNzd29yZClcbiAgICBpZiAoc2FsdCkgaGFzaC51cGRhdGUoc2FsdClcbiAgICB0bXAgPSBoYXNoLmRpZ2VzdCgpXG5cbiAgICB2YXIgdXNlZCA9IDBcblxuICAgIGlmIChrZXlMZW4gPiAwKSB7XG4gICAgICB2YXIga2V5U3RhcnQgPSBrZXkubGVuZ3RoIC0ga2V5TGVuXG4gICAgICB1c2VkID0gTWF0aC5taW4oa2V5TGVuLCB0bXAubGVuZ3RoKVxuICAgICAgdG1wLmNvcHkoa2V5LCBrZXlTdGFydCwgMCwgdXNlZClcbiAgICAgIGtleUxlbiAtPSB1c2VkXG4gICAgfVxuXG4gICAgaWYgKHVzZWQgPCB0bXAubGVuZ3RoICYmIGl2TGVuID4gMCkge1xuICAgICAgdmFyIGl2U3RhcnQgPSBpdi5sZW5ndGggLSBpdkxlblxuICAgICAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGl2TGVuLCB0bXAubGVuZ3RoIC0gdXNlZClcbiAgICAgIHRtcC5jb3B5KGl2LCBpdlN0YXJ0LCB1c2VkLCB1c2VkICsgbGVuZ3RoKVxuICAgICAgaXZMZW4gLT0gbGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdG1wLmZpbGwoMClcbiAgcmV0dXJuIHsga2V5OiBrZXksIGl2OiBpdiB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRVZQX0J5dGVzVG9LZXlcbiJdLCJzb3VyY2VSb290IjoiIn0=