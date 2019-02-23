(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.hash-base"],{

/***/ "k+aG":
/*!*****************************************!*\
  !*** ./node_modules/hash-base/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
var Transform = __webpack_require__(/*! stream */ "1IWx").Transform
var inherits = __webpack_require__(/*! inherits */ "P7XM")

function throwIfNotStringOrBuffer (val, prefix) {
  if (!Buffer.isBuffer(val) && typeof val !== 'string') {
    throw new TypeError(prefix + ' must be a string or a buffer')
  }
}

function HashBase (blockSize) {
  Transform.call(this)

  this._block = Buffer.allocUnsafe(blockSize)
  this._blockSize = blockSize
  this._blockOffset = 0
  this._length = [0, 0, 0, 0]

  this._finalized = false
}

inherits(HashBase, Transform)

HashBase.prototype._transform = function (chunk, encoding, callback) {
  var error = null
  try {
    this.update(chunk, encoding)
  } catch (err) {
    error = err
  }

  callback(error)
}

HashBase.prototype._flush = function (callback) {
  var error = null
  try {
    this.push(this.digest())
  } catch (err) {
    error = err
  }

  callback(error)
}

HashBase.prototype.update = function (data, encoding) {
  throwIfNotStringOrBuffer(data, 'Data')
  if (this._finalized) throw new Error('Digest already called')
  if (!Buffer.isBuffer(data)) data = Buffer.from(data, encoding)

  // consume data
  var block = this._block
  var offset = 0
  while (this._blockOffset + data.length - offset >= this._blockSize) {
    for (var i = this._blockOffset; i < this._blockSize;) block[i++] = data[offset++]
    this._update()
    this._blockOffset = 0
  }
  while (offset < data.length) block[this._blockOffset++] = data[offset++]

  // update length
  for (var j = 0, carry = data.length * 8; carry > 0; ++j) {
    this._length[j] += carry
    carry = (this._length[j] / 0x0100000000) | 0
    if (carry > 0) this._length[j] -= 0x0100000000 * carry
  }

  return this
}

HashBase.prototype._update = function () {
  throw new Error('_update is not implemented')
}

HashBase.prototype.digest = function (encoding) {
  if (this._finalized) throw new Error('Digest already called')
  this._finalized = true

  var digest = this._digest()
  if (encoding !== undefined) digest = digest.toString(encoding)

  // reset state
  this._block.fill(0)
  this._blockOffset = 0
  for (var i = 0; i < 4; ++i) this._length[i] = 0

  return digest
}

HashBase.prototype._digest = function () {
  throw new Error('_digest is not implemented')
}

module.exports = HashBase


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaGFzaC1iYXNlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBWTtBQUNaLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQyxnQkFBZ0IsbUJBQU8sQ0FBQyxvQkFBUTtBQUNoQyxlQUFlLG1CQUFPLENBQUMsc0JBQVU7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMscUJBQXFCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMENBQTBDLFdBQVc7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87O0FBRXhCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuaGFzaC1iYXNlLmNmNGMwZjJlYTZkNDJhZmQ4ZTk5LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnc3RyZWFtJykuVHJhbnNmb3JtXHJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcclxuXHJcbmZ1bmN0aW9uIHRocm93SWZOb3RTdHJpbmdPckJ1ZmZlciAodmFsLCBwcmVmaXgpIHtcclxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih2YWwpICYmIHR5cGVvZiB2YWwgIT09ICdzdHJpbmcnKSB7XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHByZWZpeCArICcgbXVzdCBiZSBhIHN0cmluZyBvciBhIGJ1ZmZlcicpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBIYXNoQmFzZSAoYmxvY2tTaXplKSB7XHJcbiAgVHJhbnNmb3JtLmNhbGwodGhpcylcclxuXHJcbiAgdGhpcy5fYmxvY2sgPSBCdWZmZXIuYWxsb2NVbnNhZmUoYmxvY2tTaXplKVxyXG4gIHRoaXMuX2Jsb2NrU2l6ZSA9IGJsb2NrU2l6ZVxyXG4gIHRoaXMuX2Jsb2NrT2Zmc2V0ID0gMFxyXG4gIHRoaXMuX2xlbmd0aCA9IFswLCAwLCAwLCAwXVxyXG5cclxuICB0aGlzLl9maW5hbGl6ZWQgPSBmYWxzZVxyXG59XHJcblxyXG5pbmhlcml0cyhIYXNoQmFzZSwgVHJhbnNmb3JtKVxyXG5cclxuSGFzaEJhc2UucHJvdG90eXBlLl90cmFuc2Zvcm0gPSBmdW5jdGlvbiAoY2h1bmssIGVuY29kaW5nLCBjYWxsYmFjaykge1xyXG4gIHZhciBlcnJvciA9IG51bGxcclxuICB0cnkge1xyXG4gICAgdGhpcy51cGRhdGUoY2h1bmssIGVuY29kaW5nKVxyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgZXJyb3IgPSBlcnJcclxuICB9XHJcblxyXG4gIGNhbGxiYWNrKGVycm9yKVxyXG59XHJcblxyXG5IYXNoQmFzZS5wcm90b3R5cGUuX2ZsdXNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgdmFyIGVycm9yID0gbnVsbFxyXG4gIHRyeSB7XHJcbiAgICB0aGlzLnB1c2godGhpcy5kaWdlc3QoKSlcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGVycm9yID0gZXJyXHJcbiAgfVxyXG5cclxuICBjYWxsYmFjayhlcnJvcilcclxufVxyXG5cclxuSGFzaEJhc2UucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhLCBlbmNvZGluZykge1xyXG4gIHRocm93SWZOb3RTdHJpbmdPckJ1ZmZlcihkYXRhLCAnRGF0YScpXHJcbiAgaWYgKHRoaXMuX2ZpbmFsaXplZCkgdGhyb3cgbmV3IEVycm9yKCdEaWdlc3QgYWxyZWFkeSBjYWxsZWQnKVxyXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGRhdGEpKSBkYXRhID0gQnVmZmVyLmZyb20oZGF0YSwgZW5jb2RpbmcpXHJcblxyXG4gIC8vIGNvbnN1bWUgZGF0YVxyXG4gIHZhciBibG9jayA9IHRoaXMuX2Jsb2NrXHJcbiAgdmFyIG9mZnNldCA9IDBcclxuICB3aGlsZSAodGhpcy5fYmxvY2tPZmZzZXQgKyBkYXRhLmxlbmd0aCAtIG9mZnNldCA+PSB0aGlzLl9ibG9ja1NpemUpIHtcclxuICAgIGZvciAodmFyIGkgPSB0aGlzLl9ibG9ja09mZnNldDsgaSA8IHRoaXMuX2Jsb2NrU2l6ZTspIGJsb2NrW2krK10gPSBkYXRhW29mZnNldCsrXVxyXG4gICAgdGhpcy5fdXBkYXRlKClcclxuICAgIHRoaXMuX2Jsb2NrT2Zmc2V0ID0gMFxyXG4gIH1cclxuICB3aGlsZSAob2Zmc2V0IDwgZGF0YS5sZW5ndGgpIGJsb2NrW3RoaXMuX2Jsb2NrT2Zmc2V0KytdID0gZGF0YVtvZmZzZXQrK11cclxuXHJcbiAgLy8gdXBkYXRlIGxlbmd0aFxyXG4gIGZvciAodmFyIGogPSAwLCBjYXJyeSA9IGRhdGEubGVuZ3RoICogODsgY2FycnkgPiAwOyArK2opIHtcclxuICAgIHRoaXMuX2xlbmd0aFtqXSArPSBjYXJyeVxyXG4gICAgY2FycnkgPSAodGhpcy5fbGVuZ3RoW2pdIC8gMHgwMTAwMDAwMDAwKSB8IDBcclxuICAgIGlmIChjYXJyeSA+IDApIHRoaXMuX2xlbmd0aFtqXSAtPSAweDAxMDAwMDAwMDAgKiBjYXJyeVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuSGFzaEJhc2UucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhyb3cgbmV3IEVycm9yKCdfdXBkYXRlIGlzIG5vdCBpbXBsZW1lbnRlZCcpXHJcbn1cclxuXHJcbkhhc2hCYXNlLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoZW5jb2RpbmcpIHtcclxuICBpZiAodGhpcy5fZmluYWxpemVkKSB0aHJvdyBuZXcgRXJyb3IoJ0RpZ2VzdCBhbHJlYWR5IGNhbGxlZCcpXHJcbiAgdGhpcy5fZmluYWxpemVkID0gdHJ1ZVxyXG5cclxuICB2YXIgZGlnZXN0ID0gdGhpcy5fZGlnZXN0KClcclxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkgZGlnZXN0ID0gZGlnZXN0LnRvU3RyaW5nKGVuY29kaW5nKVxyXG5cclxuICAvLyByZXNldCBzdGF0ZVxyXG4gIHRoaXMuX2Jsb2NrLmZpbGwoMClcclxuICB0aGlzLl9ibG9ja09mZnNldCA9IDBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7ICsraSkgdGhpcy5fbGVuZ3RoW2ldID0gMFxyXG5cclxuICByZXR1cm4gZGlnZXN0XHJcbn1cclxuXHJcbkhhc2hCYXNlLnByb3RvdHlwZS5fZGlnZXN0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHRocm93IG5ldyBFcnJvcignX2RpZ2VzdCBpcyBub3QgaW1wbGVtZW50ZWQnKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2hCYXNlXHJcbiJdLCJzb3VyY2VSb290IjoiIn0=