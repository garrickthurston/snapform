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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaGFzaC1iYXNlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBWTtBQUNaLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQyxnQkFBZ0IsbUJBQU8sQ0FBQyxvQkFBUTtBQUNoQyxlQUFlLG1CQUFPLENBQUMsc0JBQVU7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMscUJBQXFCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMENBQTBDLFdBQVc7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87O0FBRXhCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuaGFzaC1iYXNlLmQwYjQyN2Y4NzIwNTgzNTkzOTIxLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCdzdHJlYW0nKS5UcmFuc2Zvcm1cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcblxuZnVuY3Rpb24gdGhyb3dJZk5vdFN0cmluZ09yQnVmZmVyICh2YWwsIHByZWZpeCkge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih2YWwpICYmIHR5cGVvZiB2YWwgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihwcmVmaXggKyAnIG11c3QgYmUgYSBzdHJpbmcgb3IgYSBidWZmZXInKVxuICB9XG59XG5cbmZ1bmN0aW9uIEhhc2hCYXNlIChibG9ja1NpemUpIHtcbiAgVHJhbnNmb3JtLmNhbGwodGhpcylcblxuICB0aGlzLl9ibG9jayA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShibG9ja1NpemUpXG4gIHRoaXMuX2Jsb2NrU2l6ZSA9IGJsb2NrU2l6ZVxuICB0aGlzLl9ibG9ja09mZnNldCA9IDBcbiAgdGhpcy5fbGVuZ3RoID0gWzAsIDAsIDAsIDBdXG5cbiAgdGhpcy5fZmluYWxpemVkID0gZmFsc2Vcbn1cblxuaW5oZXJpdHMoSGFzaEJhc2UsIFRyYW5zZm9ybSlcblxuSGFzaEJhc2UucHJvdG90eXBlLl90cmFuc2Zvcm0gPSBmdW5jdGlvbiAoY2h1bmssIGVuY29kaW5nLCBjYWxsYmFjaykge1xuICB2YXIgZXJyb3IgPSBudWxsXG4gIHRyeSB7XG4gICAgdGhpcy51cGRhdGUoY2h1bmssIGVuY29kaW5nKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnJvciA9IGVyclxuICB9XG5cbiAgY2FsbGJhY2soZXJyb3IpXG59XG5cbkhhc2hCYXNlLnByb3RvdHlwZS5fZmx1c2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgdmFyIGVycm9yID0gbnVsbFxuICB0cnkge1xuICAgIHRoaXMucHVzaCh0aGlzLmRpZ2VzdCgpKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnJvciA9IGVyclxuICB9XG5cbiAgY2FsbGJhY2soZXJyb3IpXG59XG5cbkhhc2hCYXNlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSwgZW5jb2RpbmcpIHtcbiAgdGhyb3dJZk5vdFN0cmluZ09yQnVmZmVyKGRhdGEsICdEYXRhJylcbiAgaWYgKHRoaXMuX2ZpbmFsaXplZCkgdGhyb3cgbmV3IEVycm9yKCdEaWdlc3QgYWxyZWFkeSBjYWxsZWQnKVxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihkYXRhKSkgZGF0YSA9IEJ1ZmZlci5mcm9tKGRhdGEsIGVuY29kaW5nKVxuXG4gIC8vIGNvbnN1bWUgZGF0YVxuICB2YXIgYmxvY2sgPSB0aGlzLl9ibG9ja1xuICB2YXIgb2Zmc2V0ID0gMFxuICB3aGlsZSAodGhpcy5fYmxvY2tPZmZzZXQgKyBkYXRhLmxlbmd0aCAtIG9mZnNldCA+PSB0aGlzLl9ibG9ja1NpemUpIHtcbiAgICBmb3IgKHZhciBpID0gdGhpcy5fYmxvY2tPZmZzZXQ7IGkgPCB0aGlzLl9ibG9ja1NpemU7KSBibG9ja1tpKytdID0gZGF0YVtvZmZzZXQrK11cbiAgICB0aGlzLl91cGRhdGUoKVxuICAgIHRoaXMuX2Jsb2NrT2Zmc2V0ID0gMFxuICB9XG4gIHdoaWxlIChvZmZzZXQgPCBkYXRhLmxlbmd0aCkgYmxvY2tbdGhpcy5fYmxvY2tPZmZzZXQrK10gPSBkYXRhW29mZnNldCsrXVxuXG4gIC8vIHVwZGF0ZSBsZW5ndGhcbiAgZm9yICh2YXIgaiA9IDAsIGNhcnJ5ID0gZGF0YS5sZW5ndGggKiA4OyBjYXJyeSA+IDA7ICsraikge1xuICAgIHRoaXMuX2xlbmd0aFtqXSArPSBjYXJyeVxuICAgIGNhcnJ5ID0gKHRoaXMuX2xlbmd0aFtqXSAvIDB4MDEwMDAwMDAwMCkgfCAwXG4gICAgaWYgKGNhcnJ5ID4gMCkgdGhpcy5fbGVuZ3RoW2pdIC09IDB4MDEwMDAwMDAwMCAqIGNhcnJ5XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG5IYXNoQmFzZS5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdfdXBkYXRlIGlzIG5vdCBpbXBsZW1lbnRlZCcpXG59XG5cbkhhc2hCYXNlLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoZW5jb2RpbmcpIHtcbiAgaWYgKHRoaXMuX2ZpbmFsaXplZCkgdGhyb3cgbmV3IEVycm9yKCdEaWdlc3QgYWxyZWFkeSBjYWxsZWQnKVxuICB0aGlzLl9maW5hbGl6ZWQgPSB0cnVlXG5cbiAgdmFyIGRpZ2VzdCA9IHRoaXMuX2RpZ2VzdCgpXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSBkaWdlc3QgPSBkaWdlc3QudG9TdHJpbmcoZW5jb2RpbmcpXG5cbiAgLy8gcmVzZXQgc3RhdGVcbiAgdGhpcy5fYmxvY2suZmlsbCgwKVxuICB0aGlzLl9ibG9ja09mZnNldCA9IDBcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyArK2kpIHRoaXMuX2xlbmd0aFtpXSA9IDBcblxuICByZXR1cm4gZGlnZXN0XG59XG5cbkhhc2hCYXNlLnByb3RvdHlwZS5fZGlnZXN0ID0gZnVuY3Rpb24gKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ19kaWdlc3QgaXMgbm90IGltcGxlbWVudGVkJylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIYXNoQmFzZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==