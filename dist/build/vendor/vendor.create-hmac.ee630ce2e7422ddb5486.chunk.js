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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3JlYXRlLWhtYWMvbGVnYWN5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jcmVhdGUtaG1hYy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBWTtBQUNaLGVBQWUsbUJBQU8sQ0FBQyxzQkFBVTtBQUNqQyxhQUFhLG1CQUFPLENBQUMseUJBQWE7O0FBRWxDLFdBQVcsbUJBQU8sQ0FBQyx5QkFBYTs7QUFFaEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLGVBQWU7QUFDaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM3Q1k7QUFDWixlQUFlLG1CQUFPLENBQUMsc0JBQVU7QUFDakMsYUFBYSxtQkFBTyxDQUFDLHNCQUFVO0FBQy9CLFdBQVcsbUJBQU8sQ0FBQyx5QkFBYTtBQUNoQyxhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsVUFBVSxtQkFBTyxDQUFDLDZCQUFpQjtBQUNuQyxnQkFBZ0IsbUJBQU8sQ0FBQyx1QkFBVzs7QUFFbkMsVUFBVSxtQkFBTyxDQUFDLG9CQUFROztBQUUxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQixlQUFlO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmNyZWF0ZS1obWFjLmVlNjMwY2UyZTc0MjJkZGI1NDg2LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcblxudmFyIEJhc2UgPSByZXF1aXJlKCdjaXBoZXItYmFzZScpXG5cbnZhciBaRVJPUyA9IEJ1ZmZlci5hbGxvYygxMjgpXG52YXIgYmxvY2tzaXplID0gNjRcblxuZnVuY3Rpb24gSG1hYyAoYWxnLCBrZXkpIHtcbiAgQmFzZS5jYWxsKHRoaXMsICdkaWdlc3QnKVxuICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcbiAgICBrZXkgPSBCdWZmZXIuZnJvbShrZXkpXG4gIH1cblxuICB0aGlzLl9hbGcgPSBhbGdcbiAgdGhpcy5fa2V5ID0ga2V5XG5cbiAgaWYgKGtleS5sZW5ndGggPiBibG9ja3NpemUpIHtcbiAgICBrZXkgPSBhbGcoa2V5KVxuICB9IGVsc2UgaWYgKGtleS5sZW5ndGggPCBibG9ja3NpemUpIHtcbiAgICBrZXkgPSBCdWZmZXIuY29uY2F0KFtrZXksIFpFUk9TXSwgYmxvY2tzaXplKVxuICB9XG5cbiAgdmFyIGlwYWQgPSB0aGlzLl9pcGFkID0gQnVmZmVyLmFsbG9jVW5zYWZlKGJsb2Nrc2l6ZSlcbiAgdmFyIG9wYWQgPSB0aGlzLl9vcGFkID0gQnVmZmVyLmFsbG9jVW5zYWZlKGJsb2Nrc2l6ZSlcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrc2l6ZTsgaSsrKSB7XG4gICAgaXBhZFtpXSA9IGtleVtpXSBeIDB4MzZcbiAgICBvcGFkW2ldID0ga2V5W2ldIF4gMHg1Q1xuICB9XG5cbiAgdGhpcy5faGFzaCA9IFtpcGFkXVxufVxuXG5pbmhlcml0cyhIbWFjLCBCYXNlKVxuXG5IbWFjLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgdGhpcy5faGFzaC5wdXNoKGRhdGEpXG59XG5cbkhtYWMucHJvdG90eXBlLl9maW5hbCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGggPSB0aGlzLl9hbGcoQnVmZmVyLmNvbmNhdCh0aGlzLl9oYXNoKSlcbiAgcmV0dXJuIHRoaXMuX2FsZyhCdWZmZXIuY29uY2F0KFt0aGlzLl9vcGFkLCBoXSkpXG59XG5tb2R1bGUuZXhwb3J0cyA9IEhtYWNcbiIsIid1c2Ugc3RyaWN0J1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxudmFyIExlZ2FjeSA9IHJlcXVpcmUoJy4vbGVnYWN5JylcbnZhciBCYXNlID0gcmVxdWlyZSgnY2lwaGVyLWJhc2UnKVxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG52YXIgbWQ1ID0gcmVxdWlyZSgnY3JlYXRlLWhhc2gvbWQ1JylcbnZhciBSSVBFTUQxNjAgPSByZXF1aXJlKCdyaXBlbWQxNjAnKVxuXG52YXIgc2hhID0gcmVxdWlyZSgnc2hhLmpzJylcblxudmFyIFpFUk9TID0gQnVmZmVyLmFsbG9jKDEyOClcblxuZnVuY3Rpb24gSG1hYyAoYWxnLCBrZXkpIHtcbiAgQmFzZS5jYWxsKHRoaXMsICdkaWdlc3QnKVxuICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcbiAgICBrZXkgPSBCdWZmZXIuZnJvbShrZXkpXG4gIH1cblxuICB2YXIgYmxvY2tzaXplID0gKGFsZyA9PT0gJ3NoYTUxMicgfHwgYWxnID09PSAnc2hhMzg0JykgPyAxMjggOiA2NFxuXG4gIHRoaXMuX2FsZyA9IGFsZ1xuICB0aGlzLl9rZXkgPSBrZXlcbiAgaWYgKGtleS5sZW5ndGggPiBibG9ja3NpemUpIHtcbiAgICB2YXIgaGFzaCA9IGFsZyA9PT0gJ3JtZDE2MCcgPyBuZXcgUklQRU1EMTYwKCkgOiBzaGEoYWxnKVxuICAgIGtleSA9IGhhc2gudXBkYXRlKGtleSkuZGlnZXN0KClcbiAgfSBlbHNlIGlmIChrZXkubGVuZ3RoIDwgYmxvY2tzaXplKSB7XG4gICAga2V5ID0gQnVmZmVyLmNvbmNhdChba2V5LCBaRVJPU10sIGJsb2Nrc2l6ZSlcbiAgfVxuXG4gIHZhciBpcGFkID0gdGhpcy5faXBhZCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShibG9ja3NpemUpXG4gIHZhciBvcGFkID0gdGhpcy5fb3BhZCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShibG9ja3NpemUpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja3NpemU7IGkrKykge1xuICAgIGlwYWRbaV0gPSBrZXlbaV0gXiAweDM2XG4gICAgb3BhZFtpXSA9IGtleVtpXSBeIDB4NUNcbiAgfVxuICB0aGlzLl9oYXNoID0gYWxnID09PSAncm1kMTYwJyA/IG5ldyBSSVBFTUQxNjAoKSA6IHNoYShhbGcpXG4gIHRoaXMuX2hhc2gudXBkYXRlKGlwYWQpXG59XG5cbmluaGVyaXRzKEhtYWMsIEJhc2UpXG5cbkhtYWMucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICB0aGlzLl9oYXNoLnVwZGF0ZShkYXRhKVxufVxuXG5IbWFjLnByb3RvdHlwZS5fZmluYWwgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBoID0gdGhpcy5faGFzaC5kaWdlc3QoKVxuICB2YXIgaGFzaCA9IHRoaXMuX2FsZyA9PT0gJ3JtZDE2MCcgPyBuZXcgUklQRU1EMTYwKCkgOiBzaGEodGhpcy5fYWxnKVxuICByZXR1cm4gaGFzaC51cGRhdGUodGhpcy5fb3BhZCkudXBkYXRlKGgpLmRpZ2VzdCgpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlSG1hYyAoYWxnLCBrZXkpIHtcbiAgYWxnID0gYWxnLnRvTG93ZXJDYXNlKClcbiAgaWYgKGFsZyA9PT0gJ3JtZDE2MCcgfHwgYWxnID09PSAncmlwZW1kMTYwJykge1xuICAgIHJldHVybiBuZXcgSG1hYygncm1kMTYwJywga2V5KVxuICB9XG4gIGlmIChhbGcgPT09ICdtZDUnKSB7XG4gICAgcmV0dXJuIG5ldyBMZWdhY3kobWQ1LCBrZXkpXG4gIH1cbiAgcmV0dXJuIG5ldyBIbWFjKGFsZywga2V5KVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==