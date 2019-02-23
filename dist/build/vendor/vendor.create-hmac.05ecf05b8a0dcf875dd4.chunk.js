(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.create-hmac"],{

/***/ "1CSz":
/*!********************************************!*\
  !*** ./node_modules/create-hmac/legacy.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var inherits = __webpack_require__(/*! inherits */ "P7XM")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

var Base = __webpack_require__(/*! cipher-base */ "ZDAU")

var ZEROS = Buffer.alloc(128)
var blocksize = 64

function Hmac (alg, key) {
  Base.call(this, 'digest')
  if (typeof key === 'string') {
    key = Buffer.from(key)
  }

  this._alg = alg
  this._key = key

  if (key.length > blocksize) {
    key = alg(key)
  } else if (key.length < blocksize) {
    key = Buffer.concat([key, ZEROS], blocksize)
  }

  var ipad = this._ipad = Buffer.allocUnsafe(blocksize)
  var opad = this._opad = Buffer.allocUnsafe(blocksize)

  for (var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  this._hash = [ipad]
}

inherits(Hmac, Base)

Hmac.prototype._update = function (data) {
  this._hash.push(data)
}

Hmac.prototype._final = function () {
  var h = this._alg(Buffer.concat(this._hash))
  return this._alg(Buffer.concat([this._opad, h]))
}
module.exports = Hmac


/***/ }),

/***/ "Giow":
/*!*********************************************!*\
  !*** ./node_modules/create-hmac/browser.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var inherits = __webpack_require__(/*! inherits */ "P7XM")
var Legacy = __webpack_require__(/*! ./legacy */ "1CSz")
var Base = __webpack_require__(/*! cipher-base */ "ZDAU")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
var md5 = __webpack_require__(/*! create-hash/md5 */ "WnY+")
var RIPEMD160 = __webpack_require__(/*! ripemd160 */ "tcrS")

var sha = __webpack_require__(/*! sha.js */ "afKu")

var ZEROS = Buffer.alloc(128)

function Hmac (alg, key) {
  Base.call(this, 'digest')
  if (typeof key === 'string') {
    key = Buffer.from(key)
  }

  var blocksize = (alg === 'sha512' || alg === 'sha384') ? 128 : 64

  this._alg = alg
  this._key = key
  if (key.length > blocksize) {
    var hash = alg === 'rmd160' ? new RIPEMD160() : sha(alg)
    key = hash.update(key).digest()
  } else if (key.length < blocksize) {
    key = Buffer.concat([key, ZEROS], blocksize)
  }

  var ipad = this._ipad = Buffer.allocUnsafe(blocksize)
  var opad = this._opad = Buffer.allocUnsafe(blocksize)

  for (var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }
  this._hash = alg === 'rmd160' ? new RIPEMD160() : sha(alg)
  this._hash.update(ipad)
}

inherits(Hmac, Base)

Hmac.prototype._update = function (data) {
  this._hash.update(data)
}

Hmac.prototype._final = function () {
  var h = this._hash.digest()
  var hash = this._alg === 'rmd160' ? new RIPEMD160() : sha(this._alg)
  return hash.update(this._opad).update(h).digest()
}

module.exports = function createHmac (alg, key) {
  alg = alg.toLowerCase()
  if (alg === 'rmd160' || alg === 'ripemd160') {
    return new Hmac('rmd160', key)
  }
  if (alg === 'md5') {
    return new Legacy(md5, key)
  }
  return new Hmac(alg, key)
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3JlYXRlLWhtYWMvbGVnYWN5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jcmVhdGUtaG1hYy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBWTtBQUNaLGVBQWUsbUJBQU8sQ0FBQyxzQkFBVTtBQUNqQyxhQUFhLG1CQUFPLENBQUMseUJBQWE7O0FBRWxDLFdBQVcsbUJBQU8sQ0FBQyx5QkFBYTs7QUFFaEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLGVBQWU7QUFDaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM3Q1k7QUFDWixlQUFlLG1CQUFPLENBQUMsc0JBQVU7QUFDakMsYUFBYSxtQkFBTyxDQUFDLHNCQUFVO0FBQy9CLFdBQVcsbUJBQU8sQ0FBQyx5QkFBYTtBQUNoQyxhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsVUFBVSxtQkFBTyxDQUFDLDZCQUFpQjtBQUNuQyxnQkFBZ0IsbUJBQU8sQ0FBQyx1QkFBVzs7QUFFbkMsVUFBVSxtQkFBTyxDQUFDLG9CQUFROztBQUUxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQixlQUFlO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmNyZWF0ZS1obWFjLjA1ZWNmMDViOGEwZGNmODc1ZGQ0LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXHJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcblxyXG52YXIgQmFzZSA9IHJlcXVpcmUoJ2NpcGhlci1iYXNlJylcclxuXHJcbnZhciBaRVJPUyA9IEJ1ZmZlci5hbGxvYygxMjgpXHJcbnZhciBibG9ja3NpemUgPSA2NFxyXG5cclxuZnVuY3Rpb24gSG1hYyAoYWxnLCBrZXkpIHtcclxuICBCYXNlLmNhbGwodGhpcywgJ2RpZ2VzdCcpXHJcbiAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XHJcbiAgICBrZXkgPSBCdWZmZXIuZnJvbShrZXkpXHJcbiAgfVxyXG5cclxuICB0aGlzLl9hbGcgPSBhbGdcclxuICB0aGlzLl9rZXkgPSBrZXlcclxuXHJcbiAgaWYgKGtleS5sZW5ndGggPiBibG9ja3NpemUpIHtcclxuICAgIGtleSA9IGFsZyhrZXkpXHJcbiAgfSBlbHNlIGlmIChrZXkubGVuZ3RoIDwgYmxvY2tzaXplKSB7XHJcbiAgICBrZXkgPSBCdWZmZXIuY29uY2F0KFtrZXksIFpFUk9TXSwgYmxvY2tzaXplKVxyXG4gIH1cclxuXHJcbiAgdmFyIGlwYWQgPSB0aGlzLl9pcGFkID0gQnVmZmVyLmFsbG9jVW5zYWZlKGJsb2Nrc2l6ZSlcclxuICB2YXIgb3BhZCA9IHRoaXMuX29wYWQgPSBCdWZmZXIuYWxsb2NVbnNhZmUoYmxvY2tzaXplKVxyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrc2l6ZTsgaSsrKSB7XHJcbiAgICBpcGFkW2ldID0ga2V5W2ldIF4gMHgzNlxyXG4gICAgb3BhZFtpXSA9IGtleVtpXSBeIDB4NUNcclxuICB9XHJcblxyXG4gIHRoaXMuX2hhc2ggPSBbaXBhZF1cclxufVxyXG5cclxuaW5oZXJpdHMoSG1hYywgQmFzZSlcclxuXHJcbkhtYWMucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gIHRoaXMuX2hhc2gucHVzaChkYXRhKVxyXG59XHJcblxyXG5IbWFjLnByb3RvdHlwZS5fZmluYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGggPSB0aGlzLl9hbGcoQnVmZmVyLmNvbmNhdCh0aGlzLl9oYXNoKSlcclxuICByZXR1cm4gdGhpcy5fYWxnKEJ1ZmZlci5jb25jYXQoW3RoaXMuX29wYWQsIGhdKSlcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IEhtYWNcclxuIiwiJ3VzZSBzdHJpY3QnXHJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcclxudmFyIExlZ2FjeSA9IHJlcXVpcmUoJy4vbGVnYWN5JylcclxudmFyIEJhc2UgPSByZXF1aXJlKCdjaXBoZXItYmFzZScpXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG52YXIgbWQ1ID0gcmVxdWlyZSgnY3JlYXRlLWhhc2gvbWQ1JylcclxudmFyIFJJUEVNRDE2MCA9IHJlcXVpcmUoJ3JpcGVtZDE2MCcpXHJcblxyXG52YXIgc2hhID0gcmVxdWlyZSgnc2hhLmpzJylcclxuXHJcbnZhciBaRVJPUyA9IEJ1ZmZlci5hbGxvYygxMjgpXHJcblxyXG5mdW5jdGlvbiBIbWFjIChhbGcsIGtleSkge1xyXG4gIEJhc2UuY2FsbCh0aGlzLCAnZGlnZXN0JylcclxuICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcclxuICAgIGtleSA9IEJ1ZmZlci5mcm9tKGtleSlcclxuICB9XHJcblxyXG4gIHZhciBibG9ja3NpemUgPSAoYWxnID09PSAnc2hhNTEyJyB8fCBhbGcgPT09ICdzaGEzODQnKSA/IDEyOCA6IDY0XHJcblxyXG4gIHRoaXMuX2FsZyA9IGFsZ1xyXG4gIHRoaXMuX2tleSA9IGtleVxyXG4gIGlmIChrZXkubGVuZ3RoID4gYmxvY2tzaXplKSB7XHJcbiAgICB2YXIgaGFzaCA9IGFsZyA9PT0gJ3JtZDE2MCcgPyBuZXcgUklQRU1EMTYwKCkgOiBzaGEoYWxnKVxyXG4gICAga2V5ID0gaGFzaC51cGRhdGUoa2V5KS5kaWdlc3QoKVxyXG4gIH0gZWxzZSBpZiAoa2V5Lmxlbmd0aCA8IGJsb2Nrc2l6ZSkge1xyXG4gICAga2V5ID0gQnVmZmVyLmNvbmNhdChba2V5LCBaRVJPU10sIGJsb2Nrc2l6ZSlcclxuICB9XHJcblxyXG4gIHZhciBpcGFkID0gdGhpcy5faXBhZCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShibG9ja3NpemUpXHJcbiAgdmFyIG9wYWQgPSB0aGlzLl9vcGFkID0gQnVmZmVyLmFsbG9jVW5zYWZlKGJsb2Nrc2l6ZSlcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja3NpemU7IGkrKykge1xyXG4gICAgaXBhZFtpXSA9IGtleVtpXSBeIDB4MzZcclxuICAgIG9wYWRbaV0gPSBrZXlbaV0gXiAweDVDXHJcbiAgfVxyXG4gIHRoaXMuX2hhc2ggPSBhbGcgPT09ICdybWQxNjAnID8gbmV3IFJJUEVNRDE2MCgpIDogc2hhKGFsZylcclxuICB0aGlzLl9oYXNoLnVwZGF0ZShpcGFkKVxyXG59XHJcblxyXG5pbmhlcml0cyhIbWFjLCBCYXNlKVxyXG5cclxuSG1hYy5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgdGhpcy5faGFzaC51cGRhdGUoZGF0YSlcclxufVxyXG5cclxuSG1hYy5wcm90b3R5cGUuX2ZpbmFsID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBoID0gdGhpcy5faGFzaC5kaWdlc3QoKVxyXG4gIHZhciBoYXNoID0gdGhpcy5fYWxnID09PSAncm1kMTYwJyA/IG5ldyBSSVBFTUQxNjAoKSA6IHNoYSh0aGlzLl9hbGcpXHJcbiAgcmV0dXJuIGhhc2gudXBkYXRlKHRoaXMuX29wYWQpLnVwZGF0ZShoKS5kaWdlc3QoKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUhtYWMgKGFsZywga2V5KSB7XHJcbiAgYWxnID0gYWxnLnRvTG93ZXJDYXNlKClcclxuICBpZiAoYWxnID09PSAncm1kMTYwJyB8fCBhbGcgPT09ICdyaXBlbWQxNjAnKSB7XHJcbiAgICByZXR1cm4gbmV3IEhtYWMoJ3JtZDE2MCcsIGtleSlcclxuICB9XHJcbiAgaWYgKGFsZyA9PT0gJ21kNScpIHtcclxuICAgIHJldHVybiBuZXcgTGVnYWN5KG1kNSwga2V5KVxyXG4gIH1cclxuICByZXR1cm4gbmV3IEhtYWMoYWxnLCBrZXkpXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==