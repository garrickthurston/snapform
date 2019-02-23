(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.cipher-base"],{

/***/ "ZDAU":
/*!*******************************************!*\
  !*** ./node_modules/cipher-base/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
var Transform = __webpack_require__(/*! stream */ "1IWx").Transform
var StringDecoder = __webpack_require__(/*! string_decoder */ "fXKp").StringDecoder
var inherits = __webpack_require__(/*! inherits */ "P7XM")

function CipherBase (hashMode) {
  Transform.call(this)
  this.hashMode = typeof hashMode === 'string'
  if (this.hashMode) {
    this[hashMode] = this._finalOrDigest
  } else {
    this.final = this._finalOrDigest
  }
  if (this._final) {
    this.__final = this._final
    this._final = null
  }
  this._decoder = null
  this._encoding = null
}
inherits(CipherBase, Transform)

CipherBase.prototype.update = function (data, inputEnc, outputEnc) {
  if (typeof data === 'string') {
    data = Buffer.from(data, inputEnc)
  }

  var outData = this._update(data)
  if (this.hashMode) return this

  if (outputEnc) {
    outData = this._toString(outData, outputEnc)
  }

  return outData
}

CipherBase.prototype.setAutoPadding = function () {}
CipherBase.prototype.getAuthTag = function () {
  throw new Error('trying to get auth tag in unsupported state')
}

CipherBase.prototype.setAuthTag = function () {
  throw new Error('trying to set auth tag in unsupported state')
}

CipherBase.prototype.setAAD = function () {
  throw new Error('trying to set aad in unsupported state')
}

CipherBase.prototype._transform = function (data, _, next) {
  var err
  try {
    if (this.hashMode) {
      this._update(data)
    } else {
      this.push(this._update(data))
    }
  } catch (e) {
    err = e
  } finally {
    next(err)
  }
}
CipherBase.prototype._flush = function (done) {
  var err
  try {
    this.push(this.__final())
  } catch (e) {
    err = e
  }

  done(err)
}
CipherBase.prototype._finalOrDigest = function (outputEnc) {
  var outData = this.__final() || Buffer.alloc(0)
  if (outputEnc) {
    outData = this._toString(outData, outputEnc, true)
  }
  return outData
}

CipherBase.prototype._toString = function (value, enc, fin) {
  if (!this._decoder) {
    this._decoder = new StringDecoder(enc)
    this._encoding = enc
  }

  if (this._encoding !== enc) throw new Error('can\'t switch encodings')

  var out = this._decoder.write(value)
  if (fin) {
    out += this._decoder.end()
  }

  return out
}

module.exports = CipherBase


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2lwaGVyLWJhc2UvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsYUFBYSxtQkFBTyxDQUFDLHlCQUFhO0FBQ2xDLGdCQUFnQixtQkFBTyxDQUFDLG9CQUFRO0FBQ2hDLG9CQUFvQixtQkFBTyxDQUFDLDRCQUFnQjtBQUM1QyxlQUFlLG1CQUFPLENBQUMsc0JBQVU7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5jaXBoZXItYmFzZS5hYjg0YzQ4ZDk2MzA3MmZhODJkMi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnc3RyZWFtJykuVHJhbnNmb3JtXHJcbnZhciBTdHJpbmdEZWNvZGVyID0gcmVxdWlyZSgnc3RyaW5nX2RlY29kZXInKS5TdHJpbmdEZWNvZGVyXHJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcclxuXHJcbmZ1bmN0aW9uIENpcGhlckJhc2UgKGhhc2hNb2RlKSB7XHJcbiAgVHJhbnNmb3JtLmNhbGwodGhpcylcclxuICB0aGlzLmhhc2hNb2RlID0gdHlwZW9mIGhhc2hNb2RlID09PSAnc3RyaW5nJ1xyXG4gIGlmICh0aGlzLmhhc2hNb2RlKSB7XHJcbiAgICB0aGlzW2hhc2hNb2RlXSA9IHRoaXMuX2ZpbmFsT3JEaWdlc3RcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5maW5hbCA9IHRoaXMuX2ZpbmFsT3JEaWdlc3RcclxuICB9XHJcbiAgaWYgKHRoaXMuX2ZpbmFsKSB7XHJcbiAgICB0aGlzLl9fZmluYWwgPSB0aGlzLl9maW5hbFxyXG4gICAgdGhpcy5fZmluYWwgPSBudWxsXHJcbiAgfVxyXG4gIHRoaXMuX2RlY29kZXIgPSBudWxsXHJcbiAgdGhpcy5fZW5jb2RpbmcgPSBudWxsXHJcbn1cclxuaW5oZXJpdHMoQ2lwaGVyQmFzZSwgVHJhbnNmb3JtKVxyXG5cclxuQ2lwaGVyQmFzZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRhdGEsIGlucHV0RW5jLCBvdXRwdXRFbmMpIHtcclxuICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XHJcbiAgICBkYXRhID0gQnVmZmVyLmZyb20oZGF0YSwgaW5wdXRFbmMpXHJcbiAgfVxyXG5cclxuICB2YXIgb3V0RGF0YSA9IHRoaXMuX3VwZGF0ZShkYXRhKVxyXG4gIGlmICh0aGlzLmhhc2hNb2RlKSByZXR1cm4gdGhpc1xyXG5cclxuICBpZiAob3V0cHV0RW5jKSB7XHJcbiAgICBvdXREYXRhID0gdGhpcy5fdG9TdHJpbmcob3V0RGF0YSwgb3V0cHV0RW5jKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG91dERhdGFcclxufVxyXG5cclxuQ2lwaGVyQmFzZS5wcm90b3R5cGUuc2V0QXV0b1BhZGRpbmcgPSBmdW5jdGlvbiAoKSB7fVxyXG5DaXBoZXJCYXNlLnByb3RvdHlwZS5nZXRBdXRoVGFnID0gZnVuY3Rpb24gKCkge1xyXG4gIHRocm93IG5ldyBFcnJvcigndHJ5aW5nIHRvIGdldCBhdXRoIHRhZyBpbiB1bnN1cHBvcnRlZCBzdGF0ZScpXHJcbn1cclxuXHJcbkNpcGhlckJhc2UucHJvdG90eXBlLnNldEF1dGhUYWcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhyb3cgbmV3IEVycm9yKCd0cnlpbmcgdG8gc2V0IGF1dGggdGFnIGluIHVuc3VwcG9ydGVkIHN0YXRlJylcclxufVxyXG5cclxuQ2lwaGVyQmFzZS5wcm90b3R5cGUuc2V0QUFEID0gZnVuY3Rpb24gKCkge1xyXG4gIHRocm93IG5ldyBFcnJvcigndHJ5aW5nIHRvIHNldCBhYWQgaW4gdW5zdXBwb3J0ZWQgc3RhdGUnKVxyXG59XHJcblxyXG5DaXBoZXJCYXNlLnByb3RvdHlwZS5fdHJhbnNmb3JtID0gZnVuY3Rpb24gKGRhdGEsIF8sIG5leHQpIHtcclxuICB2YXIgZXJyXHJcbiAgdHJ5IHtcclxuICAgIGlmICh0aGlzLmhhc2hNb2RlKSB7XHJcbiAgICAgIHRoaXMuX3VwZGF0ZShkYXRhKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5wdXNoKHRoaXMuX3VwZGF0ZShkYXRhKSlcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBlcnIgPSBlXHJcbiAgfSBmaW5hbGx5IHtcclxuICAgIG5leHQoZXJyKVxyXG4gIH1cclxufVxyXG5DaXBoZXJCYXNlLnByb3RvdHlwZS5fZmx1c2ggPSBmdW5jdGlvbiAoZG9uZSkge1xyXG4gIHZhciBlcnJcclxuICB0cnkge1xyXG4gICAgdGhpcy5wdXNoKHRoaXMuX19maW5hbCgpKVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGVyciA9IGVcclxuICB9XHJcblxyXG4gIGRvbmUoZXJyKVxyXG59XHJcbkNpcGhlckJhc2UucHJvdG90eXBlLl9maW5hbE9yRGlnZXN0ID0gZnVuY3Rpb24gKG91dHB1dEVuYykge1xyXG4gIHZhciBvdXREYXRhID0gdGhpcy5fX2ZpbmFsKCkgfHwgQnVmZmVyLmFsbG9jKDApXHJcbiAgaWYgKG91dHB1dEVuYykge1xyXG4gICAgb3V0RGF0YSA9IHRoaXMuX3RvU3RyaW5nKG91dERhdGEsIG91dHB1dEVuYywgdHJ1ZSlcclxuICB9XHJcbiAgcmV0dXJuIG91dERhdGFcclxufVxyXG5cclxuQ2lwaGVyQmFzZS5wcm90b3R5cGUuX3RvU3RyaW5nID0gZnVuY3Rpb24gKHZhbHVlLCBlbmMsIGZpbikge1xyXG4gIGlmICghdGhpcy5fZGVjb2Rlcikge1xyXG4gICAgdGhpcy5fZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKGVuYylcclxuICAgIHRoaXMuX2VuY29kaW5nID0gZW5jXHJcbiAgfVxyXG5cclxuICBpZiAodGhpcy5fZW5jb2RpbmcgIT09IGVuYykgdGhyb3cgbmV3IEVycm9yKCdjYW5cXCd0IHN3aXRjaCBlbmNvZGluZ3MnKVxyXG5cclxuICB2YXIgb3V0ID0gdGhpcy5fZGVjb2Rlci53cml0ZSh2YWx1ZSlcclxuICBpZiAoZmluKSB7XHJcbiAgICBvdXQgKz0gdGhpcy5fZGVjb2Rlci5lbmQoKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG91dFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENpcGhlckJhc2VcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==