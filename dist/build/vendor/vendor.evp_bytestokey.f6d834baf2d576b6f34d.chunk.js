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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZXZwX2J5dGVzdG9rZXkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsYUFBYSxtQkFBTyxDQUFDLHlCQUFhO0FBQ2xDLFVBQVUsbUJBQU8sQ0FBQyxvQkFBUTs7QUFFMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVU7QUFDVjs7QUFFQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmV2cF9ieXRlc3Rva2V5LmY2ZDgzNGJhZjJkNTc2YjZmMzRkLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcbnZhciBNRDUgPSByZXF1aXJlKCdtZDUuanMnKVxyXG5cclxuLyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXHJcbmZ1bmN0aW9uIEVWUF9CeXRlc1RvS2V5IChwYXNzd29yZCwgc2FsdCwga2V5Qml0cywgaXZMZW4pIHtcclxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihwYXNzd29yZCkpIHBhc3N3b3JkID0gQnVmZmVyLmZyb20ocGFzc3dvcmQsICdiaW5hcnknKVxyXG4gIGlmIChzYWx0KSB7XHJcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihzYWx0KSkgc2FsdCA9IEJ1ZmZlci5mcm9tKHNhbHQsICdiaW5hcnknKVxyXG4gICAgaWYgKHNhbHQubGVuZ3RoICE9PSA4KSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc2FsdCBzaG91bGQgYmUgQnVmZmVyIHdpdGggOCBieXRlIGxlbmd0aCcpXHJcbiAgfVxyXG5cclxuICB2YXIga2V5TGVuID0ga2V5Qml0cyAvIDhcclxuICB2YXIga2V5ID0gQnVmZmVyLmFsbG9jKGtleUxlbilcclxuICB2YXIgaXYgPSBCdWZmZXIuYWxsb2MoaXZMZW4gfHwgMClcclxuICB2YXIgdG1wID0gQnVmZmVyLmFsbG9jKDApXHJcblxyXG4gIHdoaWxlIChrZXlMZW4gPiAwIHx8IGl2TGVuID4gMCkge1xyXG4gICAgdmFyIGhhc2ggPSBuZXcgTUQ1KClcclxuICAgIGhhc2gudXBkYXRlKHRtcClcclxuICAgIGhhc2gudXBkYXRlKHBhc3N3b3JkKVxyXG4gICAgaWYgKHNhbHQpIGhhc2gudXBkYXRlKHNhbHQpXHJcbiAgICB0bXAgPSBoYXNoLmRpZ2VzdCgpXHJcblxyXG4gICAgdmFyIHVzZWQgPSAwXHJcblxyXG4gICAgaWYgKGtleUxlbiA+IDApIHtcclxuICAgICAgdmFyIGtleVN0YXJ0ID0ga2V5Lmxlbmd0aCAtIGtleUxlblxyXG4gICAgICB1c2VkID0gTWF0aC5taW4oa2V5TGVuLCB0bXAubGVuZ3RoKVxyXG4gICAgICB0bXAuY29weShrZXksIGtleVN0YXJ0LCAwLCB1c2VkKVxyXG4gICAgICBrZXlMZW4gLT0gdXNlZFxyXG4gICAgfVxyXG5cclxuICAgIGlmICh1c2VkIDwgdG1wLmxlbmd0aCAmJiBpdkxlbiA+IDApIHtcclxuICAgICAgdmFyIGl2U3RhcnQgPSBpdi5sZW5ndGggLSBpdkxlblxyXG4gICAgICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oaXZMZW4sIHRtcC5sZW5ndGggLSB1c2VkKVxyXG4gICAgICB0bXAuY29weShpdiwgaXZTdGFydCwgdXNlZCwgdXNlZCArIGxlbmd0aClcclxuICAgICAgaXZMZW4gLT0gbGVuZ3RoXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0bXAuZmlsbCgwKVxyXG4gIHJldHVybiB7IGtleToga2V5LCBpdjogaXYgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVWUF9CeXRlc1RvS2V5XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=